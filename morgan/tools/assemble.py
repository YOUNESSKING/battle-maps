"""Assemble the full picture track: map-scene renders + Ken Burns archive slots, timed to audio/timing.json.

usage: python3 tools/assemble.py [--preview | --archive]     (run from morgan/)
- MAP runs: scenes/<scene>/renders/<scene>.mp4 (scene per first tag in SCENES below); a missing render becomes a grey placeholder.
- ARCHIVE slots (script order): archive/slots.json [{"slot", "images": [{"file", "title", "points": [[fx, fy], ...]}]}];
  each slot is cut into ~6 s shots (full view + push-ins/pans on the points, cycling through the images) joined by dissolves.
Writes build/picture.mp4 (1920x1080, 30 fps, no audio). --preview = only rebuild missing segments; --archive = rebuild archive slots only (reuse map segments).
--v4 = Netflix-style archive (archive_shots.py, 3D depth, ~4 s shots, portraits <= 4.5 s once per slot) + hook2 bio-card cutaways;
       resumable: a segment is rebuilt only if its .v4 marker is missing (the cloud machine reboots).
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
    count = max(2, round(dur / SHOT))
    d = (dur + XF * (count - 1)) / count  # shot length so the dissolves add up to exactly dur
    shots, seen = [], set()
    for k, (img_i, kind, pt) in enumerate(plan_shots(imgs, count)):
        path, _, title = imgs[img_i]
        im = Image.open(path).convert("RGB")
        if kind == "fit":
            canvas, (ox, oy, s) = fit_canvas(im)
            tx, ty = (ox + pt[0] * im.width * s) / W, (oy + pt[1] * im.height * s) / H
            # push in from the full view toward the point; narrow images (portraits) zoom further so they end up filling the frame
            z0, z1, a, b = 1.0, min(1.5, max(1.2, 0.95 * W / (im.width * s))), (0.5, 0.5), (tx, ty)
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


# ---------- v4: Netflix-style archive (STYLE_LOCK 2a) with archive_shots.py: 3D-depth photos, ~4 s shots, labels, date cards ----------
sys.path.insert(0, os.path.join(ROOT, "tools"))
import archive_shots
PORTRAITS = {"a01.jpg", "a03.jpg", "a03_b.png", "a05.jpg", "a05_b.jpg", "a08.jpg", "a08_b.jpg", "a10_c.jpg"}
HEADLINES = {"a02": ["1781", "COWPENS\nSOUTH CAROLINA"], "a04": ["1777", "SARATOGA\nNEW YORK"], "a10": ["1781", "YORKTOWN\nVIRGINIA"]}
MOVES = ["in", "right", "out", "left", "up", "in", "down"]
SHOT_S = 4.0       # target shot length (style lock: a change every 2-4 s; paintings ~4 s)
PORTRAIT_S = 4.5   # a portrait is on screen once per slot, at most this long (owner: portraits were held too long)


def netflix_shots(images, dur, slot=None):
    imgs = [(f"archive/{e['file']}", e.get("points") or [[0.5, 0.42]], e.get("title", "")) for e in images
            if os.path.exists(f"archive/{e['file']}")]
    port = [x for x in imgs if os.path.basename(x[0]) in PORTRAITS]
    other = [x for x in imgs if os.path.basename(x[0]) not in PORTRAITS] or port
    count = max(2, round(dur / SHOT_S))
    shots, seen = [], set()
    if port and other is not port:
        f, pts, title = port[0]
        shots.append({"photo": f, "focus": pts[0], "move": "in", "depth": True, "label": title, "dur": min(PORTRAIT_S, dur / count)})
        seen.add(f)
    queue = []
    for r in range(4):  # round-robin: each image's main point first, then its other points
        for f, pts, title in other:
            if r < len(pts):
                queue.append((f, pts[r], title))
    k = 0
    while len(shots) < count and queue:
        f, pt, title = queue.pop(0)
        shots.append({"photo": f, "focus": pt, "move": MOVES[(len(shots) + k) % len(MOVES)], "depth": True,
                      "label": title if f not in seen else None})
        seen.add(f)
    if slot in HEADLINES:
        shots[0]["headline"] = HEADLINES[slot]
    for sh in shots:
        if sh.get("label") is None:
            sh.pop("label", None)
    return shots


def archive_seg_v4(i, n, dur, out):
    info = slots[n]
    shots = netflix_shots(info["images"], dur, info.get("slot"))
    archive_shots.build(shots, dur, out, 1920, 1080, ENC)
    open(out + ".v4", "w").write(json.dumps(shots))


def hook2_seg(dur, out):
    """hook-2 + hook-3 render, but the 29 s bio card is cut after 8 s to event cutaways until hook-3 (owner: portraits held too long)"""
    src = "scenes/hook2/renders/hook2.mp4"
    p2 = next(p for p in paras if key(p) == "hook-2"); p3 = next(p for p in paras if key(p) == "hook-3")
    c0, c1 = 8.0, p3["start"] - p2["start"]
    cut = json.load(open("archive/hook_cutaways.json"))
    tmp = "build/seg/hook2"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-t", f"{c0:.3f}", "-vf", f"scale=1920:1080,fps={FPS}", *ENC, tmp + "_a.mp4"], check=True)
    archive_shots.build(netflix_shots(cut, c1 - c0), c1 - c0, tmp + "_b.mp4", 1920, 1080, ENC)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{c1:.3f}", "-i", src, "-vf", f"scale=1920:1080,fps={FPS},tpad=stop_mode=clone:stop_duration=3",
                    "-t", f"{dur - c1:.3f}", *ENC, tmp + "_c.mp4"], check=True)
    open(tmp + "_list.txt", "w").write("".join(f"file '{os.path.abspath(tmp + x)}'\n" for x in ("_a.mp4", "_b.mp4", "_c.mp4")))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", tmp + "_list.txt", "-c", "copy", out], check=True)
    open(out + ".v4", "w").write("hook2")


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
        if "--v4" in sys.argv:
            only = os.environ.get("ONLY")  # e.g. ONLY=a02,a04 -> build just those slots (others reused / skipped)
            if only and slots[n_arch].get("slot") not in only.split(","):
                pass
            elif not os.path.exists(out + ".v4"):
                archive_seg_v4(i, n_arch, dur, out); print(f"{starts[i]:7.1f}s archive a{n_arch + 1:02d} v4 {dur:.1f}s", flush=True)
        elif not (preview and os.path.exists(out)) or "--archive" in sys.argv:
            archive_seg(i, n_arch, dur, out)
        n_arch += 1; segs.append(out); i += 1
    else:
        scene = SCENES[key(paras[i])]
        j = i + 1
        while j < len(paras) and paras[j]["tag"].startswith("MAP") and key(paras[j]) not in SCENES:
            j += 1
        dur = starts[j] - starts[i]
        if "--v4" in sys.argv and os.environ.get("ONLY"):
            pass
        elif "--v4" in sys.argv and scene == "hook2" and os.path.exists("archive/hook_cutaways.json"):
            if not os.path.exists(out + ".v4"):
                hook2_seg(dur, out)
        elif not ((preview or "--archive" in sys.argv or "--v4" in sys.argv) and os.path.exists(out)):
            map_seg(scene, dur, out)
        print(f"{starts[i]:7.1f}s {scene} {dur:.1f}s")
        segs.append(out); i = j
open("build/seg/list.txt", "w").write("".join(f"file '{os.path.abspath(s)}'\n" for s in segs))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "build/seg/list.txt", "-c", "copy", "build/picture.mp4"], check=True)
print("wrote build/picture.mp4", round(total, 1), "s")
