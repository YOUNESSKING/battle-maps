"""Search YouTube for each commander name with yt-dlp (public metadata only) and list the long-form results with date, views, views/day.
usage: python3 research/tools/yt_name_search.py OUT.md "Name 1" "Name 2" ...   (N results per name: env N, default 12)
Writes OUT.md (one table per name) + OUT.json. Long-form = >= 480 s. Run from /home/user/battle-maps."""
import datetime, json, os, subprocess, sys
out, names = sys.argv[1], sys.argv[2:]; N = int(os.environ.get("N", 12)); today = datetime.date.today()
res, md = {}, [f"# YouTube name search (yt-dlp ytsearch{N}, long-form >= 8 min), {today}", ""]
for name in names:
    flat = subprocess.run(["yt-dlp", "--flat-playlist", "--dump-json", f"ytsearch{N}:{name}"], capture_output=True, text=True, timeout=300).stdout
    ents = [json.loads(l) for l in flat.splitlines() if l.strip().startswith("{")]
    rows = []
    for e in ents:
        if (e.get("duration") or 0) < 480: continue
        r = subprocess.run(["yt-dlp", "--skip-download", "--dump-json", "--no-warnings", f"https://www.youtube.com/watch?v={e['id']}"], capture_output=True, text=True, timeout=180)
        try: d = json.loads(r.stdout)
        except Exception: continue
        age = max(1, (today - datetime.datetime.strptime(d["upload_date"], "%Y%m%d").date()).days)
        rows.append({"id": e["id"], "title": d.get("title"), "channel": d.get("channel"), "subs": d.get("channel_follower_count"), "views": d.get("view_count") or 0,
                     "date": d.get("upload_date"), "age": age, "vpd": round((d.get("view_count") or 0) / age), "dur": d.get("duration")})
        print(name, "|", rows[-1]["title"][:60], rows[-1]["views"], age, flush=True)
    res[name] = rows
    md += [f"## {name}", "| Title | Channel (subs) | Views | Age (d) | Views/day | Length | id |", "|---|---|---|---|---|---|---|"]
    for r in sorted(rows, key=lambda r: -r["views"]):
        md.append(f"| {r['title']} | {r['channel']} ({r['subs'] or '?'}) | {r['views']:,} | {r['age']} | {r['vpd']:,} | {r['dur'] // 60}:{r['dur'] % 60:02d} | {r['id']} |")
    md.append("")
json.dump(res, open(out.replace(".md", ".json"), "w"), indent=1); open(out, "w").write("\n".join(md) + "\n")
