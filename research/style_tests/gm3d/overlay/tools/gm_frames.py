#!/usr/bin/env python3
"""Frame sampling + measuring helper for the Grand Maneuver reference video (never commit the video or frames).

  sample   VIDEO OUTDIR [--every 2] [--chapters 0:00,0:45,...]
           one frame every N s (f_NNNN.jpg, time = (N-1)*every) + one frame at each chapter start (ch_MMSS.jpg)
  crops    FRAMEDIR OUTDIR [--scale 1920]
           crops every overlay region (REGIONS, in % of the frame) out of every frame -> OUTDIR/<region>/<frame>.jpg
  color    IMAGE x0,y0,x1,y1 [x0,y0,x1,y1 ...] [--px]
           median colour + 3 dominant colours (k-means) of each box -> hex; boxes in % of the frame unless --px
  zoom     OUT.png SCALE IMAGE:x0,y0,x1,y1 [...]
           stacked zoomed crops (px boxes) for looking at one element across frames
  sheet    FRAMEDIR OUT.jpg [--step 5] [--cols 6]
           contact sheet

Regions measured on the France 1814 video (1280x720 source, %):"""
import argparse, glob, json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

# x0, y0, x1, y1 in % of the frame (measured on France 1814; see OVERLAY_SPEC.md)
REGIONS = {
    "plaque":   (0.0, 3.0, 36.0, 22.0),    # top-left date / clock plaque with the pocket watch
    "timeline": (4.0, 88.0, 76.0, 99.5),   # bottom timeline bar with wax-seal playhead
    "legend":   (0.0, 70.0, 22.0, 99.5),   # bottom-left THE ARMIES legend
    "ctr_card": (0.0, 30.0, 100.0, 75.0),  # big cream letter card / centred quote / title
    "right":    (55.0, 5.0, 100.0, 70.0),  # medallions / oval insets (usually right half)
    "full":     (0.0, 0.0, 100.0, 100.0),
}

def tsec(s):
    p = [float(x) for x in s.split(":")]; return p[0] * 60 + p[1] if len(p) == 2 else p[0] * 3600 + p[1] * 60 + p[2]

def cmd_sample(a):
    os.makedirs(a.outdir, exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.video, "-vf", f"fps=1/{a.every}", "-q:v", "2", f"{a.outdir}/f_%04d.jpg"], check=True)
    for c in (a.chapters.split(",") if a.chapters else []):
        t = tsec(c); subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t + 0.5), "-i", a.video, "-frames:v", "1", "-q:v", "2",
                                     f"{a.outdir}/ch_{int(t // 60):02d}{int(t % 60):02d}.jpg"], check=True)
    print(len(glob.glob(f"{a.outdir}/*.jpg")), "frames")

def cmd_crops(a):
    fs = sorted(glob.glob(f"{a.framedir}/*.jpg"))
    for r, (x0, y0, x1, y1) in REGIONS.items():
        if r == "full": continue
        os.makedirs(f"{a.outdir}/{r}", exist_ok=True)
        for f in fs:
            im = Image.open(f); W, H = im.size; c = im.crop((int(x0 * W / 100), int(y0 * H / 100), int(x1 * W / 100), int(y1 * H / 100)))
            k = a.scale / W; c = c.resize((int(c.width * k), int(c.height * k)), Image.LANCZOS); c.save(f"{a.outdir}/{r}/{os.path.basename(f)}", quality=90)
    print("crops in", a.outdir)

def hexc(c): return "#%02X%02X%02X" % tuple(int(round(v)) for v in c)

def kmeans(px, k=3, it=12):
    rng = np.random.default_rng(0); cen = px[rng.choice(len(px), k, replace=False)].astype(float)
    for _ in range(it):
        lab = np.argmin(((px[:, None, :] - cen[None]) ** 2).sum(-1), 1)
        for j in range(k):
            if (lab == j).any(): cen[j] = px[lab == j].mean(0)
    cnt = np.bincount(lab, minlength=k); o = np.argsort(-cnt); return cen[o], cnt[o] / cnt.sum()

def cmd_color(a):
    im = np.asarray(Image.open(a.image).convert("RGB")); H, W, _ = im.shape; out = []
    for b in a.boxes:
        x0, y0, x1, y1 = [float(v) for v in b.split(",")]
        if not a.px: x0, x1, y0, y1 = x0 * W / 100, x1 * W / 100, y0 * H / 100, y1 * H / 100
        px = im[int(y0):max(int(y1), int(y0) + 1), int(x0):max(int(x1), int(x0) + 1)].reshape(-1, 3)
        cen, w = kmeans(px, min(3, len(px)))
        out.append({"box": b, "median": hexc(np.median(px, 0)), "dominant": [f"{hexc(c)} {p:.0%}" for c, p in zip(cen, w)]})
    print(json.dumps(out, indent=1))

def cmd_zoom(a):
    ims = []
    for s in a.items:
        f, b = s.rsplit(":", 1); x0, y0, x1, y1 = map(int, b.split(",")); im = Image.open(f).crop((x0, y0, x1, y1))
        ims.append(im.resize((int(im.width * a.scale), int(im.height * a.scale)), Image.LANCZOS))
    W = max(i.width for i in ims); c = Image.new("RGB", (W, sum(i.height + 4 for i in ims)), (255, 0, 255)); y = 0
    for i in ims: c.paste(i, (0, y)); y += i.height + 4
    c.save(a.out)

def cmd_sheet(a):
    fs = sorted(glob.glob(f"{a.framedir}/f_*.jpg"))[::a.step]; tw, th = 320, 180; rows = (len(fs) + a.cols - 1) // a.cols
    c = Image.new("RGB", (tw * a.cols, th * rows)); d = ImageDraw.Draw(c)
    for i, f in enumerate(fs):
        im = Image.open(f).resize((tw, th)); x, y = (i % a.cols) * tw, (i // a.cols) * th; c.paste(im, (x, y)); d.text((x + 4, y + 4), os.path.basename(f), fill=(255, 255, 0))
    c.save(a.out, quality=85)

if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter); s = p.add_subparsers(dest="cmd", required=True)
    q = s.add_parser("sample"); q.add_argument("video"); q.add_argument("outdir"); q.add_argument("--every", type=float, default=2); q.add_argument("--chapters", default="")
    q = s.add_parser("crops"); q.add_argument("framedir"); q.add_argument("outdir"); q.add_argument("--scale", type=int, default=1920)
    q = s.add_parser("color"); q.add_argument("image"); q.add_argument("boxes", nargs="+"); q.add_argument("--px", action="store_true")
    q = s.add_parser("zoom"); q.add_argument("out"); q.add_argument("scale", type=float); q.add_argument("items", nargs="+")
    q = s.add_parser("sheet"); q.add_argument("framedir"); q.add_argument("out"); q.add_argument("--step", type=int, default=5); q.add_argument("--cols", type=int, default=6)
    a = p.parse_args(); {"sample": cmd_sample, "crops": cmd_crops, "color": cmd_color, "zoom": cmd_zoom, "sheet": cmd_sheet}[a.cmd](a)
