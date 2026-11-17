"""Flat yt-dlp listing of a channel's /videos tab (upload order, newest first): id, title, rounded views, duration, approximate upload date (yt-dlp youtubetab:approximate_date, from "x days/weeks/months ago").
usage: python3 research/study/lifecycle/flat_scan.py @Handle [max]  -> research/study/lifecycle/raw/<handle>_flat.json"""
import json, subprocess, sys, datetime
h = sys.argv[1].lstrip("@"); N = sys.argv[2] if len(sys.argv) > 2 else "400"
r = subprocess.run(["yt-dlp", "--flat-playlist", "--extractor-args", "youtubetab:approximate_date", "--dump-json", "--playlist-end", N, f"https://www.youtube.com/@{h}/videos"], capture_output=True, text=True, timeout=900)
rows = []
for l in r.stdout.splitlines():
    try: d = json.loads(l)
    except Exception: continue
    rows.append({"id": d["id"], "title": d.get("title"), "views": d.get("view_count"), "dur": d.get("duration"), "approx_date": d.get("upload_date"), "channel": d.get("playlist_uploader") or d.get("channel")})
json.dump({"handle": h, "scanned": str(datetime.date.today()), "videos": rows, "stderr": r.stderr[-400:]}, open(f"research/study/lifecycle/raw/{h}_flat.json", "w"), indent=1)
print(h, len(rows), r.stderr[-200:].strip())
