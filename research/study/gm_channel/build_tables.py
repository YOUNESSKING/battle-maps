"""Build per-channel tables from yt-dlp flat lists (views, length, newest first) + YouTube RSS (publish dates + views, last 15 uploads).
usage: python3 research/study/gm_channel/build_tables.py   (run from /home/user/battle-maps; fetches RSS once into rss/)"""
import json, glob, os, re, statistics, datetime, subprocess
D = "research/study/gm_channel"; os.makedirs(f"{D}/rss", exist_ok=True)
TODAY = datetime.datetime(2026, 11, 17, 18, tzinfo=datetime.timezone.utc)
out = ["# Niche channel scan (flat lists + RSS), 2026-11-17", "",
       "Sources: `flat/<channel>.jsonl` = yt-dlp --flat-playlist (newest 60 uploads: title, views, length; no dates). `rss/<id>.xml` = the channel's public YouTube RSS feed (last 15 uploads with publish date + views). Long = >= 8 min. Shorts are not in /videos.", ""]
summary = []
for f in sorted(glob.glob(f"{D}/flat/*.jsonl")):
    rows = [json.loads(l) for l in open(f) if l.startswith("{")]
    if not rows: continue
    cid = rows[0]["playlist_channel_id"]; name = rows[0]["playlist_channel"]
    rp = f"{D}/rss/{cid}.xml"
    if not os.path.exists(rp):
        subprocess.run(["curl", "-sS", f"https://www.youtube.com/feeds/videos.xml?channel_id={cid}", "-o", rp])
    x = open(rp).read()
    ents = re.findall(r"<yt:videoId>([^<]+)</yt:videoId>.*?<published>([^<]+)</published>.*?views=\"(\d+)\"", x, re.S)
    rss = {v: (p, int(n)) for v, p, n in ents}
    dur = {r["id"]: r.get("duration") or 0 for r in rows}
    longs = [r for r in rows if (r.get("duration") or 0) >= 480 and r.get("view_count") is not None]
    med = statistics.median([r["view_count"] for r in longs]) if longs else 0
    out += [f"## {name} (`{cid}`, file `{os.path.basename(f)}`)", f"Flat: {len(rows)} newest uploads listed, {len(longs)} long; median views of those long = {int(med):,}; median length = {int(statistics.median([r['duration'] for r in longs])//60) if longs else 0} min", "",
            "| Published (RSS) | Title | Length | Views | Views/day | x median (flat long) |", "|---|---|---|---|---|---|"]
    dated = []
    for v, (p, n) in rss.items():
        dt = datetime.datetime.fromisoformat(p); age = max((TODAY - dt).total_seconds() / 86400, 0.25)
        t = re.search(rf"<yt:videoId>{v}</yt:videoId>.*?<title>([^<]+)</title>", x, re.S).group(1)
        d = dur.get(v); L = f"{d//60}:{d%60:02d}" if d else "?"
        out.append(f"| {p[:10]} | {t} | {L} | {n:,} | {n/age:,.0f} | {round(n/med,2) if med else ''} |")
        dated.append((dt, d or 0, n))
    dl = sorted([a for a in dated if a[1] >= 480])
    if len(dl) >= 2:
        span = (dl[-1][0] - dl[0][0]).days; cad = round(span / (len(dl) - 1), 1)
    else: span, cad = 0, None
    summary.append((name, len(longs), int(med), cad, len(dl), dl[0][0].date() if dl else None))
    out.append("")
out.insert(4, "| Channel | Long videos in flat list | Median views (flat long) | Days between long uploads (RSS) | Long uploads in RSS | Oldest long in RSS |")
out.insert(5, "|---|---|---|---|---|---|")
for i, s in enumerate(summary): out.insert(6 + i, "| " + " | ".join(str(a) for a in s) + " |")
out.insert(6 + len(summary), "")
open(f"{D}/niche_scan.md", "w").write("\n".join(out) + "\n"); print("\n".join(out[:8 + len(summary)]))
