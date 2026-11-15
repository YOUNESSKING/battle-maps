"""Battle / night FX sectors (v5): his | ours crops at 3x, with the mean colour of each crop.
  battle_sectors_{TAG}.jpg  his | ours per sector  (LOCAL ONLY: contains Grand Maneuver frames, git-ignored)
  battle_ours_{TAG}.jpg     ours only, same crops   (committable)
usage: TAG=v6 python3 make_battle_sectors.py <our snapshot dir with *-at-<t>s.png>   (his frames are grabbed from /home/user/gm_ref/dl/gm_1814.mp4)"""
import glob, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
VID = "/home/user/gm_ref/dl/gm_1814.mp4"
CW, CH, Z = 200, 112, 3
# (sector, his t, his x, y, our t, our x, y) in 1280x720 frame coordinates
SECTORS = [
    ("musketry smoke curtain", 684, 560, 210, 33, 600, 200),
    ("troops under the smoke", 684, 600, 300, 31.5, 590, 160),
    ("gun flash (24.63 s) / plume", 690, 640, 330, 24.634, 820, 250),
    ("gun plume after 2.4 s", 690, 640, 330, 27, 820, 250),
    ("bridge fire + smoke column", 645, 560, 380, 41, 470, 275),
    ("night: campfires", 187, 200, 260, 52, 520, 300),
    ("night: battery flash, river, boats", 380, 200, 400, 49.53, 560, 260),
]


def his(t):
    out = f"/tmp/gm_bs_{t}.png"
    if not os.path.exists(out):
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", str(t), "-i", VID, "-frames:v", "1", "-vf", "scale=1280:720", out], check=True)
    return Image.open(out).convert("RGB")


def ours(d, t):
    for p in glob.glob(os.path.join(d, "*.png")):
        m = re.search(r"at-([\d.]+)s\.png$", p)
        if m and abs(float(m.group(1)) - t) < 0.01: return Image.open(p).convert("RGB").resize((1280, 720))
    return None


def crop(im, x, y):
    c = im.crop((x, y, x + CW, y + CH)); m = [int(v) for v in np.asarray(c).reshape(-1, 3).mean(0).round()]
    return c.resize((CW * Z, CH * Z), Image.LANCZOS), tuple(m)


def main():
    d = sys.argv[1]; W, H = CW * Z, CH * Z
    both = Image.new("RGB", (2 * W + 30, len(SECTORS) * (H + 34)), (24, 24, 24)); mine = Image.new("RGB", (W, len(SECTORS) * (H + 34)), (24, 24, 24))
    for i, (name, ht, hx, hy, ot, ox, oy) in enumerate(SECTORS):
        y = i * (H + 34) + 30; o = ours(d, ot)
        hc, hm = crop(his(ht), hx, hy); oc, om = crop(o, ox, oy) if o else (Image.new("RGB", (W, H)), (0, 0, 0))
        both.paste(hc, (0, y)); both.paste(oc, (W + 30, y)); mine.paste(oc, (0, y))
        for img, x0, txt in [(both, 0, f"{name} | his {ht} s  mean {hm}"), (both, W + 30, f"ours {ot} s  mean {om}"), (mine, 0, f"{name} | ours {ot} s  mean {om}")]:
            ImageDraw.Draw(img).text((x0 + 6, y - 22), txt, fill=(235, 230, 215))
    tag = os.environ.get("TAG", "v6"); both.save(os.path.join(HERE, f"battle_sectors_{tag}.jpg"), quality=88); mine.save(os.path.join(HERE, f"battle_ours_{tag}.jpg"), quality=88)


if __name__ == "__main__":
    main()
