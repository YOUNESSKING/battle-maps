"""Compare a channel's current scan (research/competitors/<h>.json) with an earlier git version of the same file.
usage: python3 research/tools/scan_delta.py <git-rev> <new-scan-dir> handle [handle ...]
(new-scan-dir holds the fresh <handle>.json from yt_channel_scan.py; the old one is research/competitors/<handle>.json at <git-rev>)  -> markdown table per channel:
new videos since the old scan (with age + views/day) and, for videos in both, the views gained per day between the two scans."""
import datetime, json, subprocess, sys
rev, nd, hs = sys.argv[1], sys.argv[2], sys.argv[3:]; today = datetime.date.today()
for h in hs:
    p = f"research/competitors/{h}.json"
    new = json.load(open(f"{nd}/{h}.json"))
    try: old = json.loads(subprocess.run(["git", "show", f"{rev}:{p}"], capture_output=True, text=True, check=True).stdout)
    except Exception: old = {"videos": []}
    om = {v["id"]: v for v in old["videos"]}
    oldd = max([v["date"] for v in old["videos"]] or ["?"])
    gap = None
    print(f"\n### {h} (median now {int(new['median']):,}; old scan via {rev})")
    print("| Title | Published | Age (d) | Views now | Views at old scan | Gained/day since old scan | Lifetime views/day | x median | Status |")
    print("|---|---|---|---|---|---|---|---|---|")
    rows = []
    for v in new["videos"]:
        if (v.get("dur") or 0) < 480: continue
        age = max(1, (today - datetime.datetime.strptime(v["date"], "%Y%m%d").date()).days)
        o = om.get(v["id"])
        rows.append((v, age, o))
    # days between scans: from scan header dates is not stored; use the mtime of old commit
    import re
    oldmd = subprocess.run(["git", "show", f"{rev}:{p[:-5]}.md"], capture_output=True, text=True).stdout
    m = re.search(r"scanned (\d{4}-\d\d-\d\d)", oldmd); ct = m.group(1) if m else ""
    days = max(1, (today - datetime.date.fromisoformat(ct)).days) if ct else None
    for v, age, o in sorted(rows, key=lambda r: r[1]):
        if age > 120 and o is None: continue
        g = f"{round(((v['views'] or 0) - (o['views'] or 0)) / days):,}" if (o and days) else "new"
        st = "" if o else ("NEW since old scan" if ct and v["date"] > ct.replace("-", "") else "not in old scan")
        print(f"| {v['title']} | {v['date']} | {age} | {(v['views'] or 0):,} | {(o['views'] if o else 0) or 0:,} | {g} | {round((v['views'] or 0)/age):,} | {round((v['views'] or 0)/new['median'],2)} | {st} |")
    gone = [o for i, o in om.items() if i not in {v['id'] for v in new['videos']} and (o.get('dur') or 0) >= 480]
    for o in gone: print(f"| {o['title']} | {o['date']} | | missing now (fetch failed, removed, private or outside scan window) | {(o['views'] or 0):,} | | | | MISSING |")
    print(f"\n(old scan dated {ct}; {days} days between scans)")
