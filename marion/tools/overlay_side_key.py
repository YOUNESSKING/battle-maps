"""Burn the side colour key (build/side_key.png, tools/make_side_key.py) into the finished map video, top-right, mirroring the
date plate (owner 2026-11-15). Shown on map stretches only, with 0.3 s fades; hidden during archive shots (build/arch_events.json),
on-screen cards that use the top-right corner, and the end screen (end-2 on).
usage (from marion/): python3 tools/overlay_side_key.py IN.mp4 OUT.mp4 [width]"""
import json, subprocess, sys
src, out = sys.argv[1:3]; W = int(sys.argv[3]) if len(sys.argv) > 3 else 1920
t = json.load(open("audio/timing.json"))["paragraphs"]
P = {p["tag"].split("|")[0].replace("MAP:", "").strip(): p for p in t}
END = P["end-2"]["start"]
hide = [(e[0], e[0] + e[1]) for e in json.load(open("build/arch_events.json"))]
hide += [(9.0, 17.3),        # hook-a: the 70 / 150 number cards sit top-right
         (450.3, 464.7),      # m2b: the 7 HOURS chase card sits top-right
         (570.9, 608.5)]      # m3a: Greene's banner stands at the top edge under the key
hide.sort()
show, cur = [], 1.0          # clean first second (1c)
for a, b in hide:
    if a > cur: show.append((cur, a))
    cur = max(cur, b)
if cur < END: show.append((cur, END))
show = [(a, b) for a, b in show if b - a > 1.0]
f = "+".join(f"clip((T-{a:.2f})/0.3,0,1)*clip(({b:.2f}-T)/0.3,0,1)" for a, b in show)
k = W / 1920
fc = (f"[1:v]scale=iw*{k}:ih*{k},format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='alpha(X,Y)*min(1,{f})'[key];"
      f"[0:v][key]overlay=W-w-{90 * k:.0f}:{80 * k:.0f}:shortest=1:format=auto")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-loop", "1", "-framerate", "30", "-i", "build/side_key.png", "-filter_complex", fc,
                "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out], check=True)
print(out, "shown:", [(round(a, 1), round(b, 1)) for a, b in show])
