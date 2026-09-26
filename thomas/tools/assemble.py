"""Assemble the full video: map renders + archive stills (Ken Burns) + narration (+ optional music/SFX).

usage (from thomas/): python3 tools/assemble.py [--music assets/media/music.mp3] [--preview]
- map scenes: renders/SCENE.mp4 (see SCENES); a missing render becomes a placeholder card
- archive slots: assets/archive/*.jpg per ARCHIVE (below), split evenly over the paragraph, slow zoom/pan
writes build/thomas-full.mp4 (1080p master, -14 LUFS), build/chapters.txt, and with --preview build/thomas-preview-720p.mp4
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance

W, H, FPS = 1920, 1080, 30
T = json.load(open("audio/timing.json"))
PARAS, DUR = T["paragraphs"], T["duration"]
key = lambda p: p["tag"].split("|")[0].replace("MAP:", "").replace("ARCHIVE:", "").strip()

# map scene -> first paragraph id (a scene runs until the next non-scene paragraph)
SCENES = {"hook-1": "hook-a", "hook-3": "hook-b", "chick-1": "chick-a", "chick-3": "chick-b", "chick-10": "chick-c",
          "ridge-1": "ridge-a", "ridge-2": "ridge-b", "ridge-7": "ridge-c", "nash-1": "nash-a", "nash-3": "nash-b", "nash-4": "nash-c"}
# archive slots in order of appearance: list of (image, zoom direction)
ARCHIVE = [
    [("hook-archive-1", "in"), ("hook-archive-2", "left")],
    [("chick-archive-1", "right")],
    [("chick-archive-2", "left")],
    [("ridge-archive-1", "in"), ("ridge-archive-1b", "in")],
    [("ridge-archive-2", "in"), ("ridge-archive-2b", "right")],
    [("ridge-archive-3", "in"), ("ridge-archive-3b", "left")],
    [("nash-archive-1", "in"), ("nash-archive-1b", "in"), ("nash-archive-1c", "right")],
    [("end-archive-1", "in"), ("end-archive-2", "left")],
    [("end-archive-3", "in")],
    [("end-archive-2", "in")],
]
CHAPTERS = [("hook-1", "Intro: disaster at Chickamauga"), ("chick-1", "Move 1: The Rock of Chickamauga"),
            ("ridge-1", "Move 2: Missionary Ridge, the charge nobody ordered"), ("nash-1", "Move 3: Nashville, the hammer blow"),
            ("ENDING", "Legacy")]
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", str(FPS), "-an"]
os.makedirs("build/seg", exist_ok=True)
FONT = "tools/oswald-latin-700-normal.ttf"


def still(name, out):
    """Compose a 2x-resolution 16:9 frame: cover-crop wide images, fit tall ones over a blurred copy."""
    path = next((f"assets/archive/{name}.{e}" for e in ("jpg", "jpeg", "png") if os.path.exists(f"assets/archive/{name}.{e}")), None)
    if not path:
        return False
    im = Image.open(path).convert("RGB")
    CW, CH = W * 2, H * 2
    r = im.width / im.height
    if r >= 1.45:  # wide: cover
        s = max(CW / im.width, CH / im.height)
        im2 = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        x, y = (im2.width - CW) // 2, (im2.height - CH) // 2
        canvas = im2.crop((x, y, x + CW, y + CH))
    else:  # tall / square: fit on blurred, darkened background
        s = max(CW / im.width, CH / im.height)
        bg = im.resize((round(im.width * s), round(im.height * s)), Image.BILINEAR)
        x, y = (bg.width - CW) // 2, (bg.height - CH) // 2
        canvas = ImageEnhance.Brightness(bg.crop((x, y, x + CW, y + CH)).filter(ImageFilter.GaussianBlur(40))).enhance(0.45)
        s = min(CW * 0.9 / im.width, CH * 0.94 / im.height)
        fg = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        canvas.paste(fg, ((CW - fg.width) // 2, (CH - fg.height) // 2))
    canvas.save(out, quality=92)
    return True


def kenburns(img, dur, mode, out):
    n = max(int(round(dur * FPS)), 1)
    zin = f"1+0.10*on/{n}"
    if mode == "in":
        z, x, y = zin, "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"
    else:  # slow pan at constant 1.12 zoom
        z = "1.12"
        x = f"(iw-iw/zoom)*on/{n}" if mode == "right" else f"(iw-iw/zoom)*(1-on/{n})"
        y = "ih/2-(ih/zoom/2)"
    vf = f"zoompan=z='{z}':x='{x}':y='{y}':d={n}:s={W}x{H}:fps={FPS},format=yuv420p"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", img, "-vf", vf, "-frames:v", str(n), *ENC, out], check=True)


def card(text, dur, out):
    im = Image.new("RGB", (W, H), (28, 26, 22))
    d = ImageDraw.Draw(im)
    f = ImageFont.truetype(FONT, 64)
    d.text((W / 2, H / 2), text, font=f, fill=(220, 210, 180), anchor="mm")
    im.save("build/seg/card.png")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", "build/seg/card.png", "-t", f"{dur:.3f}", *ENC, out], check=True)


starts = [p["start"] for p in PARAS] + [DUR]
segs, i, a = [], 0, 0
while i < len(PARAS):
    p = PARAS[i]
    if p["tag"].startswith("ARCHIVE"):
        t0, t1 = (0.0 if i == 0 else starts[i]), starts[i + 1]
        items = [(n, m) for n, m in ARCHIVE[a] if still(n, f"build/seg/{n}.jpg")]
        if not items:
            out = f"build/seg/{i:02d}.mp4"; card("ARCHIVE: " + key(p)[:60], t1 - t0, out); segs.append(out)
        for j, (n, m) in enumerate(items):
            d0 = t0 + (t1 - t0) * j / len(items); d1 = t0 + (t1 - t0) * (j + 1) / len(items)
            out = f"build/seg/{i:02d}_{j}.mp4"; kenburns(f"build/seg/{n}.jpg", d1 - d0, m, out); segs.append(out)
        a += 1; i += 1
        continue
    scene = SCENES[key(p)]
    j = i + 1
    while j < len(PARAS) and not PARAS[j]["tag"].startswith("ARCHIVE") and key(PARAS[j]) not in SCENES:
        j += 1
    t0, t1 = (0.0 if i == 0 else starts[i]), starts[j]
    out = f"build/seg/{i:02d}.mp4"
    src = f"renders/{scene}.mp4"
    if os.path.exists(src):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf", f"scale={W}:{H},tpad=stop_mode=clone:stop_duration=3",
                        "-t", f"{t1 - t0:.3f}", *ENC, out], check=True)
    else:
        print("MISSING render", src); card("MAP: " + scene, t1 - t0, out)
    segs.append(out); i = j

open("build/seg/list.txt", "w").write("".join(f"file '{os.path.abspath(s)}'\n" for s in segs))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "build/seg/list.txt", "-c", "copy", "build/video-only.mp4"], check=True)

# audio: voice (+ music ducked under it)
music = sys.argv[sys.argv.index("--music") + 1] if "--music" in sys.argv else None
inputs, f = ["-i", "build/video-only.mp4", "-i", "audio/voice.wav"], []
if music:
    inputs += ["-stream_loop", "-1", "-i", music]
    f += ["[1:a]aresample=48000,asplit=2[vo][key]",
          f"[2:a]aresample=48000,atrim=0:{DUR + 1},volume=0.5,afade=t=out:st={DUR - 3}:d=3[mus]",
          "[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]",
          "[vo][musd]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[aout]"]
else:
    f += ["[1:a]aresample=48000,loudnorm=I=-14:TP=-1.5:LRA=11[aout]"]
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(f), "-map", "0:v", "-map", "[aout]",
                "-t", f"{DUR:.2f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart",
                "build/thomas-full.mp4"], check=True)

# chapters
first = {key(p): p["start"] for p in PARAS}
end_start = next(p["start"] for p in PARAS if p["section"].startswith("ENDING"))
lines = []
for k, title in CHAPTERS:
    t = end_start if k == "ENDING" else (0 if k == "hook-1" else first[k])
    lines.append(f"{int(t // 60)}:{int(t % 60):02d} {title}")
open("build/chapters.txt", "w").write("\n".join(lines) + "\n")
print("\n".join(lines))
if "--preview" in sys.argv:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "build/thomas-full.mp4", "-vf", "scale=1280:720", "-c:v", "libx264",
                    "-crf", "30", "-preset", "medium", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
                    "build/thomas-preview-720p.mp4"], check=True)
print("wrote build/thomas-full.mp4", DUR, "s")
