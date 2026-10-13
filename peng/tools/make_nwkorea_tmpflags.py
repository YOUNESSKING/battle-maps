"""TEMPORARY stand-in flags for the move 1 scenes while the flag agent's prc_flag.png / rok_flag_1949.png / un_flag.png are missing.
Drawn from the official geometry (PRC five-star flag; ROK Taegukgi with the four trigrams; UN flag simplified: emblem = globe rings
+ laurel suggestion). Replace by the real files: the scenes prefer assets/media/<real>.png when the main session swaps FL.* paths.
usage (from peng/): python3 tools/make_nwkorea_tmpflags.py -> assets/media/nwkorea_tmp_{prc,rok,un}_flag.png"""
import math
from PIL import Image, ImageDraw

def star(d, cx, cy, R, rot, fill):
    pts = []
    for k in range(10):
        r = R if k % 2 == 0 else R * 0.382
        a = math.radians(rot - 90 + k * 36)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    d.polygon(pts, fill=fill)

S = 20  # PRC: 30x20 grid
im = Image.new("RGB", (30 * S, 20 * S), (222, 41, 16)); d = ImageDraw.Draw(im)
Y = (255, 222, 0)
star(d, 5 * S, 5 * S, 3 * S, 0, Y)
for cx, cy in ((10, 2), (12, 4), (12, 7), (10, 9)):
    rot = math.degrees(math.atan2(5 - cy, 5 - cx)) + 90
    star(d, cx * S, cy * S, 1 * S, rot, Y)
im.save("assets/media/nwkorea_tmp_prc_flag.png")

W, H = 600, 400  # ROK Taegukgi (3:2)
im = Image.new("RGB", (W, H), (255, 255, 255)); d = ImageDraw.Draw(im)
cx, cy, r = W / 2, H / 2, H / 4
red, blue, blk = (205, 46, 58), (0, 71, 160), (0, 0, 0)
ang = math.degrees(math.atan2(2, 3))  # the diagonal
big = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(big)
bd.pieslice((cx - r, cy - r, cx + r, cy + r), 180, 360, fill=red); bd.pieslice((cx - r, cy - r, cx + r, cy + r), 0, 180, fill=blue)
bd.ellipse((cx - r, cy - r / 2 - r / 2, cx, cy + r / 2 - r / 2), fill=red) if False else None
bd.ellipse((cx - r, cy - r / 2, cx, cy + r / 2), fill=blue); bd.ellipse((cx, cy - r / 2, cx + r, cy + r / 2), fill=red)
big = big.rotate(-ang + 0, center=(cx, cy), resample=Image.BICUBIC)
im.paste(big, (0, 0), big)
def trigram(cx0, cy0, rot, pattern):  # pattern: 3 bars, True = solid
    t = Image.new("RGBA", (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(t)
    bw, bh, gap = H / 6, H / 24, H / 48
    for i, solid in enumerate(pattern):
        y = cy0 - (bh * 1.5 + gap) + i * (bh + gap)
        if solid: td.rectangle((cx0 - bw / 2, y, cx0 + bw / 2, y + bh), fill=blk)
        else:
            td.rectangle((cx0 - bw / 2, y, cx0 - gap / 2 - bw / 24, y + bh), fill=blk); td.rectangle((cx0 + gap / 2 + bw / 24, y, cx0 + bw / 2, y + bh), fill=blk)
    t = t.rotate(rot, center=(cx0, cy0), resample=Image.BICUBIC); im.paste(t, (0, 0), t)
dist = H / 4 + H / 4 * 0.75 + H / 12
for k, (sx, sy, pat) in enumerate(((-1, -1, (True, True, True)), (1, 1, (False, False, False)), (1, -1, (False, True, False)), (-1, 1, (True, False, True)))):
    a = math.atan2(sy * 2, sx * 3); px, py = cx + dist * math.cos(a), cy + dist * math.sin(a)
    trigram(px, py, -math.degrees(a) + 90, pat)
im.save("assets/media/nwkorea_tmp_rok_flag.png")

im = Image.new("RGB", (600, 400), (0, 158, 219)); d = ImageDraw.Draw(im)  # UN (simplified emblem)
c, w = (300, 200), (255, 255, 255)
for rr in (100, 72, 44): d.ellipse((c[0] - rr, c[1] - rr, c[0] + rr, c[1] + rr), outline=w, width=6)
d.line((c[0], c[1] - 100, c[0], c[1] + 100), fill=w, width=6); d.line((c[0] - 100, c[1], c[0] + 100, c[1]), fill=w, width=6)
for side in (-1, 1):
    for k in range(9):
        a = math.radians(110 + k * 18); x = c[0] + side * 132 * math.cos(a) * -1; y = c[1] + 132 * math.sin(a) * -1 + 10
        d.ellipse((x - 11, y - 6, x + 11, y + 6), fill=w)
im.save("assets/media/nwkorea_tmp_un_flag.png")
print("wrote temp flags")
