"""Assemble the full picture track: map-scene renders + Ken Burns archive slots, timed to audio/timing.json.

usage: python3 tools/assemble.py [--preview]     (run from morgan/)
- MAP runs: scenes/<scene>/renders/<scene>.mp4 (scene per first tag in SCENES below); a missing render becomes a grey placeholder.
- ARCHIVE slots: archive/aNN.jpg in script order (archive/slots.json may give "focus": [fx, fy] and "title").
Writes build/picture.mp4 (1920x1080, 30 fps, no audio). --preview = only rebuild missing segments.
"""
import json, os, re, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageEnhance

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
SCENES = {"hook-1": "hook1", "hook-2": "hook2", "sar-1": "saratoga1", "sar-2": "saratoga2", "cow-1": "cowpens1",
          "cow-4": "cowpens2", "cow-7": "cowpens3", "gui-1": "guilford1", "gui-3": "guilford2", "gui-8": "guilford3",
          "ending-1": "ending"}
FPS = 30
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), "-an"]
T = json.load(open("audio/timing.json"))
paras, total = T["paragraphs"], T["duration"]
key = lambda p: p["tag"].split("|")[0].replace("MAP:", "").strip()
starts = [0.0] + [p["start"] for p in paras[1:]] + [total]
slots = json.load(open("archive/slots.json")) if os.path.exists("archive/slots.json") else []
os.makedirs("build/seg", exist_ok=True)
FONT = "tools/special-elite-latin-400-normal.ttf"


def still(i, src, info):
    """2880x1620 frame (1.5x output: enough headroom for smooth zooms, ~2x faster than 4K): blurred, darkened fill + the image fitted, warm grade + vignette."""
    im = Image.open(src).convert("RGB")
    W, H = 2880, 1620
    bg = im.resize((W, int(W * im.height / im.width)) if im.width / im.height < W / H else (int(H * im.width / im.height), H))
    bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))
    bg = ImageEnhance.Brightness(bg.filter(ImageFilter.GaussianBlur(45))).enhance(0.45)
    s = min(W / im.width, H / im.height)
    fg = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    bg.paste(fg, ((W - fg.width) // 2, (H - fg.height) // 2))
    warm = Image.new("RGB", (W, H), (70, 52, 30))
    out = Image.blend(bg, warm, 0.08)
    vig = Image.new("L", (W, H), 0)
    ImageDraw.Draw(vig).ellipse((-W * 0.25, -H * 0.3, W * 1.25, H * 1.3), fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(225))
    out = Image.composite(out, Image.new("RGB", (W, H), (0, 0, 0)), vig)
    path = f"build/seg/still{i:02d}.jpg"
    out.save(path, quality=93)
    cap = f"build/seg/cap{i:02d}.png"
    c = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    if info.get("title"):
        d = ImageDraw.Draw(c)
        f = ImageFont.truetype(FONT, 26)
        txt = info["title"]
        w = d.textlength(txt, font=f)
        d.rectangle((40, 1080 - 92, 40 + w + 36, 1080 - 44), fill=(20, 16, 10, 150))
        d.text((58, 1080 - 84), txt, font=f, fill=(236, 226, 200, 235))
    c.save(cap)
    return path, cap


def archive_seg(i, n, dur, out):
    info = slots[n] if n < len(slots) else {}
    src = f"archive/a{n + 1:02d}.jpg"
    if not os.path.exists(src):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=0x2a241c:s=1920x1080:d={dur:.3f}", *ENC, out], check=True)
        return
    path, cap = still(i, src, info)
    fx, fy = info.get("focus", [0.5, 0.45])
    frames = int(round(dur * FPS)) + 2
    zin = n % 2 == 0  # alternate push-in / pull-out
    z = f"(1.0+0.13*on/{frames})" if zin else f"(1.13-0.13*on/{frames})"
    # centre drifts from the middle toward the focus point while zooming
    x = f"(iw-iw/zoom)*({0.5}+({fx}-0.5)*on/{frames})"
    y = f"(ih-ih/zoom)*({0.5}+({fy}-0.5)*on/{frames})"
    vf = (f"[0:v]scale=2880:1620,zoompan=z='{z}':x='{x}':y='{y}':d={frames}:s=1920x1080:fps={FPS}[kb];"
          f"[kb][1:v]overlay=0:0:enable='between(t,0.6,{max(dur - 0.8, 1)})'[v]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", str(FPS), "-i", path, "-i", cap,
                    "-filter_complex", vf, "-map", "[v]", "-t", f"{dur:.3f}", *ENC, out], check=True)


def map_seg(scene, dur, out):
    src = f"scenes/{scene}/renders/{scene}.mp4"
    if not os.path.exists(src):
        print("  missing render:", src)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=0x6b6552:s=1920x1080:d={dur:.3f}",
                        "-vf", f"drawtext=fontfile={FONT}:text='MAP {scene}':fontsize=60:fontcolor=white:x=(w-tw)/2:y=(h-th)/2", *ENC, out], check=True)
        return
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf", f"scale=1920:1080,fps={FPS},tpad=stop_mode=clone:stop_duration=3",
                    "-t", f"{dur:.3f}", *ENC, out], check=True)


segs, i, n_arch = [], 0, 0
preview = "--preview" in sys.argv
while i < len(paras):
    out = f"build/seg/{i:02d}.mp4"
    if paras[i]["tag"].startswith("ARCHIVE"):
        dur = starts[i + 1] - starts[i]
        if not (preview and os.path.exists(out)):
            archive_seg(i, n_arch, dur, out)
        n_arch += 1; segs.append(out); i += 1
    else:
        scene = SCENES[key(paras[i])]
        j = i + 1
        while j < len(paras) and paras[j]["tag"].startswith("MAP") and key(paras[j]) not in SCENES:
            j += 1
        dur = starts[j] - starts[i]
        if not (preview and os.path.exists(out)):
            map_seg(scene, dur, out)
        print(f"{starts[i]:7.1f}s {scene} {dur:.1f}s")
        segs.append(out); i = j
open("build/seg/list.txt", "w").write("".join(f"file '{os.path.abspath(s)}'\n" for s in segs))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "build/seg/list.txt", "-c", "copy", "build/picture.mp4"], check=True)
print("wrote build/picture.mp4", round(total, 1), "s")
