"""Ground sector comparison (owner's method): matched crops of the terrain, his | ours, at 2.5x.
  ground_sectors.jpg  his | ours per sector  (LOCAL ONLY: contains GM frames, git-ignored)
  ground_ours.jpg     ours only, same crops   (committable)
usage: python3 make_ground_sectors.py <dir with our snapshot pngs named at-<t>s.png or frame-*-at-<t>s.png>
His frames: /home/user/gm_ref/f2s/f_NNNN.jpg (t = (N-1)*2 s). Crops are 1280x720-frame coordinates."""
import glob, os, re, sys
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
REF = "/home/user/gm_ref/f2s"
CW, CH, Z = 200, 112, 2.5
# (sector, his t, his x, y, our t, our x, y)
SECTORS = [
    ("close: forest edge", 670, 470, 400, 40, 300, 420),
    ("close: wood interior + clearing", 800, 240, 400, 62, 120, 330),
    ("close: town", 800, 820, 250, 24, 160, 140),
    ("close: farmstead", 670, 930, 110, 32, 840, 70),
    ("close: open field + hedge", 670, 820, 440, 40, 640, 460),
    ("close: river bank", 800, 300, 260, 40, 380, 260),
    ("close: horizon haze (top band)", 800, 900, 0, 40, 900, 0),
    ("wide: field / wood patch", 1090, 600, 450, 6, 900, 520),
    ("wide: hill relief", 620, 700, 250, 6, 420, 150),
    ("wide: river + floodplain", 620, 120, 300, 6, 120, 330),
]


def ours(d, t):
    for p in glob.glob(os.path.join(d, "*.png")):
        m = re.search(r"at-([\d.]+)s\.png$", p)
        if m and abs(float(m.group(1)) - t) < 0.01: return Image.open(p).convert("RGB").resize((1280, 720))
    return None


def crop(im, x, y):
    x = max(0, min(1280 - CW, x)); y = max(0, min(720 - CH, y))
    return im.crop((x, y, x + CW, y + CH)).resize((int(CW * Z), int(CH * Z)), Image.LANCZOS)


def main():
    d = sys.argv[1]; W, H = int(CW * Z), int(CH * Z)
    rows = [s for s in SECTORS if ours(d, s[4]) is not None]
    both = Image.new("RGB", (W * 2 + 30, (H + 26) * len(rows)), (20, 20, 20)); mine = Image.new("RGB", (W, (H + 26) * len(rows)), (20, 20, 20))
    for i, (nm, ht, hx, hy, ot, ox, oy) in enumerate(rows):
        y = i * (H + 26); his = Image.open(f"{REF}/f_{int(ht / 2) + 1:04d}.jpg").convert("RGB").resize((1280, 720)); o = ours(d, ot)
        both.paste(crop(his, hx, hy), (0, y + 22)); both.paste(crop(o, ox, oy), (W + 30, y + 22)); mine.paste(crop(o, ox, oy), (0, y + 22))
        ImageDraw.Draw(both).text((6, y + 4), f"{nm}   his {ht} s  |  ours {ot} s", fill=(235, 225, 200)); ImageDraw.Draw(mine).text((6, y + 4), f"{nm}   ours {ot} s", fill=(235, 225, 200))
    both.save(os.path.join(HERE, "ground_sectors.jpg"), quality=86); mine.save(os.path.join(HERE, "ground_ours.jpg"), quality=86)
    print("ground_sectors.jpg + ground_ours.jpg:", len(rows), "sectors")


if __name__ == "__main__":
    main()
