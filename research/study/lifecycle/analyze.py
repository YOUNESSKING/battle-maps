"""Channel lifecycle study (2026-11-17). Run from /home/user/battle-maps: python3 research/study/lifecycle/analyze.py
Inputs (all in the repo):
  research/study/lifecycle/raw/<handle>_flat.json      yt-dlp flat listing of /videos (upload order, rounded views, approx dates)
  research/study/lifecycle/raw/vidiq_videos_2026-11-17.json  exact views + publish dates for 70 videos yt-dlp could not fetch (bot check)
  research/study/scan_2026-11-17/channels/*.json, research/competitors/*.json (+ their git history)  exact dates/views + older snapshots
Outputs: research/study/lifecycle/channels.csv (one row per video), summary.json, tables.md (per-channel tables + sparklines)."""
import json, glob, subprocess, statistics, datetime, re, csv, math
from collections import defaultdict, Counter

TODAY = datetime.date(2026, 11, 17)
R = "research/study/lifecycle/"
FORMAT = ["tacticalgeniuss", "WarfareGeniuss", "FootprintHistory", "WarTableAtlas", "CommandersAndTactics", "CloakedHistory1",
          "GeneralsOnTheMap", "HandledLikeEggs", "IronBreachHistory", "TheGeneralOath", "CivilWarDose", "ravelin.history"]
BIG = ["RedcoatsRebels", "WarhawkYT", "kingsandgenerals", "thearmchairhistorian", "epichistorytv", "markfeltonproductions"]
NAMES = {"tacticalgeniuss": "Tactical Genius", "WarfareGeniuss": "Warfare Genius", "FootprintHistory": "Footprints in History",
         "WarTableAtlas": "War Table Atlas", "CommandersAndTactics": "Commanders and Tactics", "CloakedHistory1": "Cloaked History",
         "GeneralsOnTheMap": "Generals On The Map (us)", "HandledLikeEggs": "Handled Like Eggs", "IronBreachHistory": "Iron Breach History",
         "TheGeneralOath": "The Generals' Oath", "CivilWarDose": "Civil War Dose / Civil War Archive", "ravelin.history": "Ravelin",
         "RedcoatsRebels": "Redcoats & Rebels", "WarhawkYT": "Warhawk", "kingsandgenerals": "Kings and Generals",
         "thearmchairhistorian": "The Armchair Historian", "epichistorytv": "Epic History", "markfeltonproductions": "Mark Felton"}

# ---------- exact dates / views / snapshots ----------
exact = {}       # id -> (date, views, subs) newest exact values
snaps = defaultdict(dict)  # id -> {snapshot_date: views}
def take(v, snapdate=None):
    i = v.get("id")
    if not i: return
    if v.get("date"):
        d0 = exact.get(i, {}); d0.setdefault("date", v["date"]); exact[i] = d0
    if snapdate and v.get("views") is not None: snaps[i][snapdate] = v["views"]
    if v.get("subs"): exact.setdefault(i, {})["subs"] = v["subs"]
commits = subprocess.run("git log --all --format='%h %ad' --date=short -- research/competitors research/study/scan_2026-11-17",
                         shell=True, capture_output=True, text=True).stdout.split("\n")
for c in commits:
    if not c.strip(): continue
    h, dt = c.split()
    files = subprocess.run(f"git ls-tree -r --name-only {h} research/competitors research/study/scan_2026-11-17", shell=True,
                           capture_output=True, text=True).stdout.split()
    for f in files:
        if not f.endswith(".json"): continue
        try: d = json.loads(subprocess.run(["git", "show", f"{h}:{f}"], capture_output=True, text=True).stdout)
        except Exception: continue
        if isinstance(d, dict):
            for v in d.get("videos") or []:
                if isinstance(v, dict): take(v, dt)
for f in glob.glob("research/study/scan_2026-11-17/channels/*.json"):
    for v in json.load(open(f))["videos"]:
        take(v, "2026-11-17")
        if v.get("views") is not None: exact[v["id"]]["views"] = v["views"]
vq = json.load(open(R + "raw/vidiq_videos_2026-11-17.json"))
for i, v in vq.items():
    e = exact.setdefault(i, {}); e["date"] = v["publishedAt"][:10].replace("-", ""); e["views"] = int(v["viewCount"]); snaps[i]["2026-11-17"] = int(v["viewCount"])

# exact views for 2 of our videos from vidIQ (research/study/scan_2026-11-17/vidiq_2026-11-17.md, read 2026-11-17)
for i, v in {"fYSkvBHAo1k": 136490, "yQTgsoSe24o": 2297}.items(): exact.setdefault(i, {})["views"] = v
def d8(s): return datetime.datetime.strptime(s, "%Y%m%d").date()
def spark(vals):
    bars = "▁▂▃▄▅▆▇█"; vs = [math.log10(max(1, x)) for x in vals]
    lo, hi = 2.0, 6.5   # 100 views .. ~3M views, same scale for every channel
    return "".join(bars[min(7, max(0, int((x - lo) / (hi - lo) * 8)))] for x in vs)
def fmt(n): return f"{n:,}" if n is not None else "?"

FMT_RE = re.compile(r"(top 3|3 greatest|3 legendary|3 biggest|3 deadliest|3 moves|3 greatest|tactical masterpieces|3 genius)", re.I)
def is_format(t): return bool(FMT_RE.search(t or ""))
def general(t):
    t = (t or "").replace("’", "'")
    if "Saved Hitler's Army" in t: return "Manstein"
    if "1st Marine Division at Chosin" in t: return "Smith"
    m = re.search(r"([A-Z][\w.\- ]+?)(?:'s|s'|’s)? (?:Top 3|3 Greatest|3 Legendary|3 Biggest|3 Deadliest)", t)
    if not m:
        m = re.search(r"— ([A-Z][\w.\- ]+?)'s 3 Greatest", t)
    if not m: return None
    name = m.group(1).strip().split()[-1].replace("'s", "")
    fix = {"Ridgways": "Ridgway", "Para": "2 Para"}
    return fix.get(name, name)

rows = []; summ = {}
for h in FORMAT + BIG:
    fl = json.load(open(R + f"raw/{h}_flat.json"))
    vids = list(reversed(fl["videos"]))  # oldest first
    out = []
    for k, v in enumerate(vids):
        e = exact.get(v["id"], {})
        date = e.get("date") or v.get("approx_date"); dsrc = "exact" if e.get("date") else "approx"
        views = e.get("views") if e.get("views") is not None else v.get("views"); vsrc = "exact" if e.get("views") is not None else "flat(rounded)"
        if views is None: views = 0
        out.append({"handle": h, "n": k + 1, "id": v["id"], "date": date, "date_src": dsrc, "views": views, "views_src": vsrc,
                    "dur_s": v.get("dur"), "title": v.get("title"), "format_title": is_format(v.get("title")), "general": general(v.get("title")),
                    "subs": e.get("subs")})
    long_ = [r for r in out if (r["dur_s"] or 0) >= 480]
    for r in long_:
        r["age"] = (TODAY - d8(r["date"])).days if r["date"] else None
    rows += long_
    summ[h] = long_

# ---------- per-channel metrics ----------
HIT = 50000
def chan_metrics(h, L):
    n = len(L); vals = [r["views"] for r in L]
    dates = [d8(r["date"]) for r in L if r["date"]]
    gaps = [(dates[i] - dates[i - 1]).days for i in range(1, len(dates))]
    first_hit = next((r for r in L if r["views"] >= HIT), None)
    med = statistics.median(vals) if vals else 0
    mature = [r for r in L if (r["age"] or 0) >= 14]
    last5 = [r["views"] for r in mature[-5:]]
    first5 = [r["views"] for r in mature[:5]]
    peak = max(vals) if vals else 0
    peak_i = vals.index(peak) + 1 if vals else None
    since_last = (TODAY - dates[-1]).days if dates else None
    subs = next((r["subs"] for r in reversed(L) if r.get("subs")), None)
    return {"name": NAMES[h], "videos_long": n, "first_upload": str(dates[0]) if dates else None, "last_upload": str(dates[-1]) if dates else None,
            "channel_age_d": (TODAY - dates[0]).days if dates else None, "days_since_last": since_last,
            "median_gap_d": statistics.median(gaps) if gaps else None, "max_gap_d": max(gaps) if gaps else None,
            "uploads_last30": sum(1 for d in dates if (TODAY - d).days <= 30),
            "median_views": med, "peak_views": peak, "peak_upload_no": peak_i,
            "first_hit_no": first_hit["n"] if first_hit else None, "first_hit_date": first_hit["date"] if first_hit else None,
            "first_hit_days_after_start": (d8(first_hit["date"]) - dates[0]).days if first_hit and dates else None,
            "hits": sum(1 for x in vals if x >= HIT), "median_first5_mature": statistics.median(first5) if first5 else None,
            "median_last5_mature": statistics.median(last5) if last5 else None,
            "format_share": round(sum(r["format_title"] for r in L) / n, 2) if n else 0,
            "format_share_last5": round(sum(r["format_title"] for r in L[-5:]) / min(5, n), 2) if n else 0,
            "subs": subs, "spark": spark(vals)}
M = {h: chan_metrics(h, summ[h]) for h in FORMAT + BIG}

# ---------- snapshots: how much a video gains after its first weeks ----------
tail = []
for r in rows:
    s = snaps.get(r["id"], {})
    if "2026-10-30" in s and r["date"]:
        age_then = (datetime.date(2026, 10, 30) - d8(r["date"])).days
        if age_then >= 1 and s["2026-10-30"] > 0:
            tail.append({"handle": r["handle"], "title": r["title"][:60], "age_then": age_then, "views_then": s["2026-10-30"], "views_now": r["views"],
                         "growth_18d": round(r["views"] / s["2026-10-30"], 2)})

# ---------- format-wide cohorts by publish month (format-titled videos on the format channels, not Ravelin/HLE/IBH topic channels) ----------
FMT_CH = ["tacticalgeniuss", "WarfareGeniuss", "FootprintHistory", "WarTableAtlas", "CommandersAndTactics", "GeneralsOnTheMap"]
coh = defaultdict(list)
for r in rows:
    if r["handle"] in FMT_CH and r["format_title"] and r["date"]:
        coh[r["date"][:6]].append(r)
cohorts = {}
for m in sorted(coh):
    L = coh[m]; v = [r["views"] for r in L]
    cohorts[m] = {"uploads": len(L), "channels": len({r["handle"] for r in L}), "median": statistics.median(v), "mean": round(statistics.mean(v)),
                  "share_ge_20k": round(sum(x >= 20000 for x in v) / len(v), 2), "share_ge_100k": round(sum(x >= 100000 for x in v) / len(v), 2),
                  "total": sum(v), "median_age": statistics.median([r["age"] for r in L])}
# same-age comparison: views at the 30 Oct snapshot for uploads 13-27 Oct (age 3-17 d then) vs views now for uploads 31 Oct-14 Nov (age 3-17 d now)
same_age = {"oct": [], "nov": []}
for r in rows:
    if not (r["handle"] in FMT_CH and r["format_title"] and r["date"]): continue
    d = d8(r["date"]); s = snaps.get(r["id"], {})
    if datetime.date(2026, 10, 13) <= d <= datetime.date(2026, 10, 27) and "2026-10-30" in s:
        same_age["oct"].append((r["handle"], r["title"][:50], (datetime.date(2026, 10, 30) - d).days, s["2026-10-30"]))
    if datetime.date(2026, 10, 31) <= d <= datetime.date(2026, 11, 14):
        same_age["nov"].append((r["handle"], r["title"][:50], (TODAY - d).days, r["views"]))

# ---------- topic repetition: n-th time a general appears in the format (all format channels, by date) ----------
fm = sorted([r for r in rows if r["handle"] in FMT_CH and r["format_title"] and r["general"] and r["date"]], key=lambda r: r["date"])
seen = Counter(); rep = []
for r in fm:
    g = r["general"]; seen[g] += 1; r["nth_on_general"] = seen[g]
    rep.append((r["date"], g, seen[g], r["handle"], r["views"], r["age"]))

# ---------- same-age control: non-format niche channels (Oct 13-27 at the 30 Oct snapshot vs Oct 31-Nov 14 now) ----------
CTRL = ["ravelin.history", "CivilWarDose", "TheGeneralOath", "CloakedHistory1"]
ctrl = {"oct": [], "nov": []}
for r in rows:
    if r["handle"] not in CTRL or not r["date"] or r["date_src"] != "exact": continue
    d = d8(r["date"]); s_ = snaps.get(r["id"], {})
    if datetime.date(2026, 10, 13) <= d <= datetime.date(2026, 10, 27) and "2026-10-30" in s_:
        ctrl["oct"].append((r["handle"], r["title"][:50], (datetime.date(2026, 10, 30) - d).days, s_["2026-10-30"]))
    if datetime.date(2026, 10, 31) <= d <= datetime.date(2026, 11, 14):
        ctrl["nov"].append((r["handle"], r["title"][:50], (TODAY - d).days, r["views"]))
def med(L): return statistics.median([x[3] for x in L]) if L else None
same_age_summary = {"format": {"oct_n": len(same_age["oct"]), "oct_median": med(same_age["oct"]), "nov_n": len(same_age["nov"]), "nov_median": med(same_age["nov"])},
                    "control": {"oct_n": len(ctrl["oct"]), "oct_median": med(ctrl["oct"]), "nov_n": len(ctrl["nov"]), "nov_median": med(ctrl["nov"])}}
by_ch = {}
for grp, D in (("format", same_age), ("control", ctrl)):
    for k in ("oct", "nov"):
        for x in D[k]: by_ch.setdefault(x[0], {}).setdefault(k, []).append(x[3])
same_age_by_channel = {h: {k: (len(v), statistics.median(v)) for k, v in d.items()} for h, d in by_ch.items()}

# ---------- supply: format-titled uploads per month across ALL scanned channels ----------
supply = Counter(r["date"][:6] for r in rows if r["format_title"] and r["date"] and r["date_src"] == "exact")

# ---------- repeats: first time a general appears vs later times (format channels), mature videos (age >= 14 d) by month ----------
rep_stats = {}
for m in ("202607", "202608", "202609", "202610"):
    a = [x[4] for x in rep if x[0][:6] == m and x[2] == 1 and x[5] >= 14]
    b = [x[4] for x in rep if x[0][:6] == m and x[2] >= 2 and x[5] >= 14]
    rep_stats[m] = {"first_n": len(a), "first_median": statistics.median(a) if a else None, "repeat_n": len(b), "repeat_median": statistics.median(b) if b else None}
a = [x[4] for x in rep if x[0] >= "20260701" and x[2] == 1 and x[5] >= 14]; b = [x[4] for x in rep if x[0] >= "20260701" and x[2] >= 2 and x[5] >= 14]
rep_stats["Jul-Oct all"] = {"first_n": len(a), "first_median": statistics.median(a), "repeat_n": len(b), "repeat_median": statistics.median(b)}

# ---------- lifecycle classification (channels with >= 5 mature long uploads) ----------
life = {}
for h in FORMAT + BIG:
    L = [r for r in summ[h] if (r["age"] or 0) >= 14]
    if len(L) < 5: life[h] = "too few uploads"; continue
    v = [r["views"] for r in L]; third = max(1, len(v) // 3)
    early, late = statistics.median(v[:third]), statistics.median(v[-third:])
    pk = v.index(max(v)) / (len(v) - 1)
    ratio = late / early if early else None
    if ratio is not None and ratio < 0.25 and pk <= 0.4: cls = "early boost -> decay"
    elif ratio is not None and ratio < 0.25: cls = "decay (peak not early)"
    elif ratio is not None and ratio > 4: cls = "late growth"
    else: cls = "no clear trend (within 4x)"
    life[h] = {"class": cls, "early_third_median": early, "late_third_median": late, "late_over_early": round(ratio, 3) if ratio else None,
               "peak_position": round(pk, 2), "mature_n": len(v)}

# ---------- momentum: does an upload's views follow the previous upload's? (small channels, mature uploads, Spearman on ranks) ----------
def spearman(x, y):
    def rk(a):
        o = sorted(range(len(a)), key=lambda i: a[i]); r = [0] * len(a)
        for k, i in enumerate(o): r[i] = k
        return r
    rx, ry = rk(x), rk(y); n = len(x); mx = (n - 1) / 2
    num = sum((a - mx) * (b - mx) for a, b in zip(rx, ry)); den = sum((a - mx) ** 2 for a in rx)
    return round(num / den, 2) if den else None
SMALL = [h for h in FORMAT if len(summ[h]) >= 6]
pairs = []
for h in SMALL:
    L = [r for r in summ[h] if (r["age"] or 0) >= 14]
    med_h = statistics.median([r["views"] for r in L]) if L else 1
    for a, b in zip(L, L[1:]): pairs.append((math.log10(max(1, a["views"]) / med_h), math.log10(max(1, b["views"]) / med_h)))
momentum = {"pairs": len(pairs), "spearman_prev_vs_next_rel_to_channel_median": spearman([p[0] for p in pairs], [p[1] for p in pairs])}
# after a hit (>= 3x channel median): next upload's x-median
after_hit = []
for h in SMALL:
    L = [r for r in summ[h] if (r["age"] or 0) >= 14]
    if len(L) < 4: continue
    m_ = statistics.median([r["views"] for r in L])
    for a, b in zip(L, L[1:]):
        if a["views"] >= 3 * m_: after_hit.append((NAMES[h], a["title"][:40], round(b["views"] / m_, 2), (d8(b["date"]) - d8(a["date"])).days))
momentum["after_hit_next_x_median"] = after_hit
momentum["after_hit_by_gap"] = {f"{lo}-{hi}d": {"n": len(g), "median_x": statistics.median(g), "n_above_median": sum(x >= 1 for x in g)}
    for lo, hi in ((0, 4), (5, 9), (10, 999)) for g in [[x[2] for x in after_hit if lo <= x[3] <= hi]] if g}
momentum["after_hit_median"] = statistics.median([x[2] for x in after_hit]) if after_hit else None

# ---------- write ----------
with open(R + "channels.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["handle", "upload_no", "id", "date", "date_src", "age_d", "views", "views_src", "dur_s", "format_title", "general", "title"])
    for r in rows: w.writerow([r["handle"], r["n"], r["id"], r["date"], r["date_src"], r.get("age"), r["views"], r["views_src"], r["dur_s"], int(r["format_title"]), r["general"] or "", r["title"]])
json.dump({"metrics": M, "tail_18d": tail, "cohorts": cohorts, "same_age": same_age, "repeats": rep, "control_same_age": ctrl, "same_age_summary": same_age_summary, "same_age_by_channel": same_age_by_channel, "supply_format_titles_by_month": supply, "repeat_stats": rep_stats, "lifecycle": life, "momentum": momentum}, open(R + "summary.json", "w"), indent=1, default=str)

md = ["# Per-channel upload tables (generated by analyze.py, 2026-11-17)", "",
      "Views = exact (yt-dlp scan or vidIQ) where available, else yt-dlp flat listing (rounded to 2 significant figures). Dates = exact publish date, else yt-dlp approximate date (from 'x days/weeks/months/years ago'; coarse for old videos). Long-form only (>= 8 min). Sparkline: one bar per upload, oldest left, log scale 100 to ~3M views, same scale for every channel. F = title in the Top-3/3-Greatest-Moves format.", ""]
for h in FORMAT + BIG:
    m = M[h]; L = summ[h]
    md += [f"## {m['name']} (@{h})", f"`{m['spark']}`", "",
           f"Long videos {m['videos_long']}, first {m['first_upload']}, last {m['last_upload']} ({m['days_since_last']} d ago), median gap {m['median_gap_d']} d, max gap {m['max_gap_d']} d, uploads in last 30 d {m['uploads_last30']}, median views {fmt(int(m['median_views']))}, peak {fmt(m['peak_views'])} (upload #{m['peak_upload_no']}), first >= 50k: upload #{m['first_hit_no']} ({m['first_hit_date']}, {m['first_hit_days_after_start']} d after start), hits >= 50k: {m['hits']}, subs {fmt(m['subs'])}.", ""]
    if h in BIG and len(L) > 40:
        md.append(f"(table: last 40 of {len(L)} scanned)"); L = L[-40:]
    md += ["| # | Date | Views | Len | F | Title |", "|---|---|---|---|---|---|"]
    for r in L:
        md.append(f"| {r['n']} | {r['date'] or '?'}{'' if r['date_src']=='exact' else '~'} | {fmt(r['views'])}{'' if r['views_src']=='exact' else '~'} | {(r['dur_s'] or 0)//60} | {'F' if r['format_title'] else ''} | {(r['title'] or '')[:90].replace('|','/')} |")
    md.append("")
open(R + "tables.md", "w").write("\n".join(md) + "\n")
print(json.dumps({h: {k: M[h][k] for k in M[h]} for h in M}, indent=0, default=str)[:100])
for h in FORMAT + BIG:
    m = M[h]; print(f"{m['name'][:24]:24} {m['spark'][-60:]:60} n={m['videos_long']} start={m['first_upload']} last={m['days_since_last']}d gap={m['median_gap_d']} max={m['max_gap_d']} l30={m['uploads_last30']} med={int(m['median_views'])} peak#{m['peak_upload_no']} hit#{m['first_hit_no']}/{m['first_hit_days_after_start']}d hits={m['hits']} f5={m['median_first5_mature']} l5={m['median_last5_mature']} fmt={m['format_share']}/{m['format_share_last5']} subs={m['subs']}")
print("\nCOHORTS"); [print(k, v) for k, v in cohorts.items()]
print("\nSAME AGE oct"); [print(x) for x in same_age["oct"]]
print("SAME AGE nov"); [print(x) for x in same_age["nov"]]
print("\nTAIL"); [print(x) for x in sorted(tail, key=lambda x: x["age_then"])]
print("\nREPEATS"); [print(x) for x in rep]
print("\nSAME AGE SUMMARY", same_age_summary); print("BY CH", same_age_by_channel)
print("CTRL oct"); [print(x) for x in ctrl["oct"]]; print("CTRL nov"); [print(x) for x in ctrl["nov"]]
print("SUPPLY", sorted(supply.items())); print("REP", rep_stats)
print("LIFE"); [print(NAMES[h], v) for h, v in life.items()]
print("MOMENTUM", momentum)
