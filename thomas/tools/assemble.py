"""Assemble the full picture track: map-scene renders + Ken Burns archive slots, timed to audio/timing.json.

usage: python3 tools/assemble.py [--preview | --archive]     (run from thomas/)
- MAP runs: scenes/<scene>/renders/<scene>.mp4 (scene per first tag in SCENES below); a missing render becomes a grey placeholder.
- ARCHIVE slots (script order): archive/slots.json [{"slot", "images": [{"file", "title", "points": [[fx, fy], ...]}]}];
  each slot is cut into ~6 s shots (full view + push-ins/pans on the points, cycling through the images) joined by dissolves.
Writes build/picture.mp4 (1920x1080, 30 fps, no audio). --preview = only rebuild missing segments; --archive = rebuild archive slots only (reuse map segments).
"""
import json, os, re, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageEnhance

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
SCENES = {"hook-1": "hook1", "hook-3": "hook3", "chick-1": "chick1", "chick-3": "chick2", "chick-10": "chick3",
          "ridge-1": "ridge1", "ridge-2": "ridge2", "ridge-7": "ridge3", "nash-1": "nash1", "nash-3": "nash2", "nash-4": "nash3"}
FPS = 30
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), "-an"]
T = json.load(open("audio/timing.json"))
paras, total = T["paragraphs"], T["duration"]
key = lambda p: p["tag"].split("|")[0].replace("MAP:", "").strip()
starts = [0.0] + [p["start"] for p in paras[1:]] + [total]
slots = json.load(open("archive/slots.json")) if os.path.exists("archive/slots.json") else []
os.makedirs("build/seg", exist_ok=True)
FONT = "tools/special-elite-latin-400-normal.ttf"


W, H = 2880, 1620  # working canvas = 1.5x output: headroom for smooth zooms, ~2x faster than 4K
SHOT = 6.0          # target seconds per archive shot (a 20 s slot becomes ~3 shots)
XF = 0.4            # cross-dissolve between shots


def grade(im):
    """warm grade + vignette on a W x H canvas."""
    out = Image.blend(im, Image.new("RGB", (W, H), (70, 52, 30)), 0.08)
    vig = Image.new("L", (W, H), 0)
    ImageDraw.Draw(vig).ellipse((-W * 0.25, -H * 0.3, W * 1.25, H * 1.3), fill=255)
    return Image.composite(out, Image.new("RGB", (W, H), (0, 0, 0)), vig.filter(ImageFilter.GaussianBlur(225)))


def fit_canvas(im):
    """whole image fitted, blurred + darkened copy as fill."""
    bg = im.resize((W, int(W * im.height / im.width)) if im.width / im.height < W / H else (int(H * im.width / im.height), H))
    bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))
    bg = ImageEnhance.Brightness(bg.filter(ImageFilter.GaussianBlur(45))).enhance(0.45)
    s = min(W / im.width, H / im.height)
    fg = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    ox, oy = (W - fg.width) // 2, (H - fg.height) // 2
    bg.paste(fg, (ox, oy))
    return grade(bg), (ox, oy, s)


def detail_canvas(im, pt):
    """16:9 crop filling the frame around a point of interest (about 55 % of the image's short side)."""
    fx, fy = pt
    cw = max(min(im.width, im.height * 16 / 9) * 0.62, min(im.width, 720))
    ch = cw * 9 / 16
    if ch > im.height:
        ch = im.height; cw = ch * 16 / 9
    x0 = min(max(fx * im.width - cw / 2, 0), im.width - cw)
    y0 = min(max(fy * im.height - ch * 0.38, 0), im.height - ch)  # point sits in the upper part of the frame (faces)
    crop = im.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((W, H), Image.LANCZOS)
    return grade(crop), ((fx * im.width - x0) / cw, (fy * im.height - y0) / ch)


def caption(path, title):
    c = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    if title:
        d = ImageDraw.Draw(c)
        f = ImageFont.truetype(FONT, 26)
        w = d.textlength(title, font=f)
        d.rectangle((40, 1080 - 92, 40 + w + 36, 1080 - 44), fill=(20, 16, 10, 150))
        d.text((58, 1080 - 84), title, font=f, fill=(236, 226, 200, 235))
    c.save(path)


def slot_images(n):
    """[(path, points, title)] for archive slot n: slots.json 'images' list, or the old single-image format."""
    info = slots[n] if n < len(slots) else {}
    imgs = [(f"archive/{e['file']}", e.get("points") or [[0.5, 0.45]], e.get("title", "")) for e in info.get("images", [])]
    if not imgs and os.path.exists(f"archive/a{n + 1:02d}.jpg"):
        imgs = [(f"archive/a{n + 1:02d}.jpg", [info.get("focus", [0.5, 0.45])], info.get("title", ""))]
    # single-point images get two generic extra details (middle and lower third) so shots don't repeat
    imgs = [(f, pts if len(pts) > 1 else pts + [[0.5, 0.55], [0.45, 0.8]], t) for f, pts, t in imgs]
    return [x for x in imgs if os.path.exists(x[0])]


def plan_shots(imgs, count):
    """establishing shot of image 1, push-in on its main point, then round-robin: other images' full views, other details."""
    queues = [[(k, "fit", pts[0])] + [(k, "detail", p) for p in pts] for k, (_, pts, _) in enumerate(imgs)]
    seq = queues[0][:2]; queues[0] = queues[0][2:]
    while len(seq) < count and any(queues):
        for q in queues:
            if q and len(seq) < count:
                seq.append(q.pop(0))
    while len(seq) < count:  # not enough material: reuse details with the opposite move
        seq.append(seq[len(seq) % max(1, len(seq))])
    return seq[:count]


def archive_seg(i, n, dur, out):
    imgs = slot_images(n)
    if not imgs:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=0x2a241c:s=1920x1080:d={dur:.3f}", *ENC, out], check=True)
        return
    # owner feedback (Thomas video): every image appears ONCE, one move per image, then cut to the next image;
    # slots are sized for ~6-7.5 s per image (long gaps are covered by maps instead of re-zooming the same photo)
    count = len(imgs)
    d = (dur + XF * (count - 1)) / count  # shot length so the dissolves add up to exactly dur
    shots, seen = [], set()
    for k, (img_i, kind, pt) in enumerate([(k, "fit", pts[0]) for k, (_, pts, _) in enumerate(imgs)]):
        path, _, title = imgs[img_i]
        im = Image.open(path).convert("RGB")
        if kind == "fit":
            canvas, (ox, oy, s) = fit_canvas(im)
            tx, ty = (ox + pt[0] * im.width * s) / W, (oy + pt[1] * im.height * s) / H
            # push in from the full view toward the point; narrow images (portraits) zoom further so they end up filling the frame
            z0, z1, a, b = 1.0, min(1.5, max(1.25, 0.95 * W / (im.width * s))), (0.5, 0.5), (tx, ty)
            if k % 2:  # alternate: start close on the point and pull back to the whole picture
                z0, z1, a, b = z1, z0, b, a
        else:
            canvas, (tx, ty) = detail_canvas(im, pt)
            if k % 2:  # alternate: slow pull-back / lateral drift
                z0, z1, a, b = 1.28, 1.08, (tx, ty), (1 - tx * 0.6 - 0.2, ty)
            else:
                z0, z1, a, b = 1.05, 1.3, (0.5, 0.5), (tx, ty)
        still = f"build/seg/s{i:02d}_{k}.jpg"; canvas.save(still, quality=93)
        cap = f"build/seg/c{i:02d}_{k}.png"; caption(cap, title if (kind == "fit" and path not in seen) else "")
        seen.add(path)
        fr = int(round(d * FPS)) + 2
        z = f"({z0}+({z1 - z0})*on/{fr})"
        # keep the moving centre inside the canvas: x = centre*iw - iw/zoom/2, clamped
        cx = f"({a[0]}+({b[0] - a[0]})*on/{fr})"; cy = f"({a[1]}+({b[1] - a[1]})*on/{fr})"
        x = f"max(0,min(iw-iw/zoom,{cx}*iw-iw/zoom/2))"; y = f"max(0,min(ih-ih/zoom,{cy}*ih-ih/zoom/2))"
        vf = (f"[0:v]scale={W}:{H},zoompan=z='{z}':x='{x}':y='{y}':d={fr}:s=1920x1080:fps={FPS}[kb];"
              f"[kb][1:v]overlay=0:0:enable='between(t,0.5,{max(d - 0.7, 1)})'[v]")
        shot = f"build/seg/sh{i:02d}_{k}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", str(FPS), "-i", still, "-i", cap,
                        "-filter_complex", vf, "-map", "[v]", "-t", f"{d:.3f}", *ENC, shot], check=True)
        shots.append(shot)
    # chain the shots with short cross-dissolves
    ins = sum([["-i", s_] for s_ in shots], [])
    f, last = [], "[0:v]"
    for k in range(1, len(shots)):
        f.append(f"{last}[{k}:v]xfade=transition=fade:duration={XF}:offset={k * (d - XF):.3f}[x{k}]"); last = f"[x{k}]"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(f), "-map", last,
                    "-t", f"{dur:.3f}", *ENC, out], check=True)


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
        if not (preview and os.path.exists(out)) or "--archive" in sys.argv:
            archive_seg(i, n_arch, dur, out)
        n_arch += 1; segs.append(out); i += 1
    else:
        scene = SCENES[key(paras[i])]
        j = i + 1
        while j < len(paras) and paras[j]["tag"].startswith("MAP") and key(paras[j]) not in SCENES:
            j += 1
        dur = starts[j] - starts[i]
        if not ((preview or "--archive" in sys.argv) and os.path.exists(out)):
            map_seg(scene, dur, out)
        print(f"{starts[i]:7.1f}s {scene} {dur:.1f}s")
        segs.append(out); i = j
open("build/seg/list.txt", "w").write("".join(f"file '{os.path.abspath(s)}'\n" for s in segs))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "build/seg/list.txt", "-c", "copy", "build/picture.mp4"], check=True)
print("wrote build/picture.mp4", round(total, 1), "s")
