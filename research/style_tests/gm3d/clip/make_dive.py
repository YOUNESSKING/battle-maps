"""Dive sheets: dive_ours.jpg (our v3 dive, 12 frames, committable) and dive_compare.jpg (his 636 s battle dive next to ours,
phase-matched; LOCAL ONLY, git-ignored). usage: python3 make_dive.py <our.mp4> [gm.mp4]"""
import os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
# phase-matched pairs (his t in gm_1814.mp4, our t): push, title/numbers, clouds in, filled, cool white, cut, warm + wisps, battlefield in
PAIRS = [(632.0, 12.6), (634.0, 14.0), (635.9, 15.25), (636.1, 15.45), (636.3, 15.6), (636.6, 15.85),
         (637.0, 16.15), (637.5, 16.45), (637.9, 16.8), (638.3, 17.1), (638.6, 17.4), (639.3, 18.1)]   # v5 timeline (DV in index.html)
LABEL = ["push-in", "push-in", "clouds in", "clouds", "clouds fill", "filled", "cool white", "cut", "warm + wisps", "warm", "battlefield in", "haze clears"]


def grab(video, t, path):
    if os.path.isdir(video):   # v5: a dir of `hyperframes snapshot --at` stills (frame-NN-at-<t>s.png): nearest still
        import glob, re
        fs = {float(re.search(r"at-([\d.]+)s", f).group(1)): f for f in glob.glob(f"{video}/*.png") if re.search(r"at-([\d.]+)s", f)}
        return Image.open(fs[min(fs, key=lambda x: abs(x - t))]).convert("RGB").resize((640, 360))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", video, "-frames:v", "1", "-vf", "scale=640:360", path], check=True)
    return Image.open(path).convert("RGB")


def main():
    ours, gm = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "/home/user/gm_ref/dl/gm_1814.mp4")
    off = float(os.environ.get("OFFSET", "0"))   # start time of the file when it is one render chunk
    tag = os.environ.get("TAG", "")              # e.g. TAG=_v4 -> dive_ours_v4.jpg + dive_compare_v4.jpg
    font = ImageFont.load_default()
    with tempfile.TemporaryDirectory() as td:
        O = [grab(ours, b - off, f"{td}/o{i}.png") for i, (_, b) in enumerate(PAIRS)]
        sheet = Image.new("RGB", (640 * 4, 360 * 3))
        for i, im in enumerate(O):
            ImageDraw.Draw(im).text((8, 8), f"{PAIRS[i][1]:.2f}s  {LABEL[i]}", fill="yellow", font=font); sheet.paste(im, ((i % 4) * 640, (i // 4) * 360))
        sheet.save(f"{HERE}/dive_ours{tag}.jpg", quality=85)
        if os.path.exists(gm):
            cmp_ = Image.new("RGB", (640 * 4, 360 * 6))
            for i, (a, b) in enumerate(PAIRS):
                g = grab(gm, a, f"{td}/g{i}.png"); ImageDraw.Draw(g).text((8, 8), f"GM {a:.1f}s  {LABEL[i]}", fill="yellow", font=font)
                col, row = (i % 2) * 2, (i // 2)
                cmp_.paste(g, (col * 640, row * 360)); cmp_.paste(O[i], ((col + 1) * 640, row * 360))
            cmp_.save(f"{HERE}/dive_compare{tag}.jpg", quality=82)
    print("dive sheets written")


if __name__ == "__main__":
    main()
