"""dive_sectors.jpg: his dive vs ours, SECTOR BY SECTOR (owner's method). For each dive phase, 4 matched crops
(cloud top, cloud edge over the map, underside / crease, map in a gap, inside the cloud) at 2.5x, his | ours side by side.
LOCAL ONLY (contains GM frames, git-ignored). usage: python3 make_sectors.py <our.mp4 | dir of snapshot pngs> [offset_s] [gm.mp4]"""
import glob, os, re, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
CW, CH, Z = 192, 108, 2.5
# phase, his t, our t, sectors [(name, his x, y, our x, y)] in 1280x720 frames
PHASES = [
    ("1 wide, scattered clouds", 1050.0, 2.0, [("cloud top", 620, 120, 790, 170), ("edge over map", 1130, 330, 690, 350), ("underside / crease", 760, 160, 800, 410), ("map + cloud shadow", 1100, 470, 860, 480)]),
    ("2 deck rolling in", 635.9, 14.95, [("cloud top", 140, 380, 610, 190), ("edge over map", 520, 470, 250, 360), ("underside / crease", 330, 460, 800, 520), ("map in a gap", 430, 300, 470, 500)]),
    ("3 mostly covered", 636.3, 15.25, [("cloud top", 760, 300, 840, 110), ("edge over map", 440, 220, 620, 590), ("underside / crease", 250, 480, 520, 430), ("map in a gap", 1100, 200, 400, 600)]),
    ("4 full cloud interior", 637.0, 15.9, [("interior centre", 540, 300, 540, 300), ("interior top", 900, 140, 900, 140), ("interior low", 300, 480, 300, 480), ("interior edge", 1060, 520, 1060, 520)]),
    ("5 white-out (warm)", 637.9, 16.75, [("centre", 540, 300, 540, 300), ("top right", 1060, 40, 1060, 40), ("bottom left", 240, 470, 240, 470), ("right edge", 1080, 400, 1080, 400)]),
    ("6 emergence", 639.3, 18.1, [("remnant over map", 380, 500, 400, 100), ("remnant edge", 860, 560, 320, 400), ("thin haze", 500, 120, 200, 250), ("clear map", 760, 160, 1000, 520)]),
]


def grab(video, t, path):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", video, "-frames:v", "1", path], check=True)
    return Image.open(path).convert("RGB")


def main():
    src, off = sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 0.0
    gm = sys.argv[3] if len(sys.argv) > 3 else "/home/user/gm_ref/dl/gm_1814.mp4"
    snaps = {}
    if os.path.isdir(src):
        for f in glob.glob(f"{src}/*.png"):
            m = re.search(r"at-([\d.]+)s", f)
            if m: snaps[round(float(m.group(1)), 2)] = f
    font = ImageFont.load_default()
    tw, th = int(CW * Z), int(CH * Z)
    rows = []
    with tempfile.TemporaryDirectory() as td:
        for label, gt, ot, secs in PHASES:
            g = grab(gm, gt, f"{td}/g.png")
            if snaps:
                k = min(snaps, key=lambda x: abs(x - ot)); o = Image.open(snaps[k]).convert("RGB").resize((1280, 720))
            else:
                o = grab(src, ot - off, f"{td}/o.png").resize((1280, 720))
            for half in (secs[:2], secs[2:]):
                row = Image.new("RGB", (tw * 4, th + 16), (20, 20, 20)); d = ImageDraw.Draw(row)
                for i, (nm, gx, gy, ox, oy) in enumerate(half):
                    row.paste(g.crop((gx, gy, gx + CW, gy + CH)).resize((tw, th), Image.LANCZOS), (i * 2 * tw, 16))
                    row.paste(o.crop((ox, oy, ox + CW, oy + CH)).resize((tw, th), Image.LANCZOS), ((i * 2 + 1) * tw, 16))
                    d.text((i * 2 * tw + 4, 2), f"{label} | {nm} | GM {gt:.1f}s", fill="yellow", font=font)
                    d.text(((i * 2 + 1) * tw + 4, 2), f"ours {ot:.2f}s", fill="cyan", font=font)
                rows.append(row)
    sheet = Image.new("RGB", (tw * 4, sum(r.height for r in rows)))
    y = 0
    for r in rows: sheet.paste(r, (0, y)); y += r.height
    sheet.save(f"{HERE}/dive_sectors.jpg", quality=85)
    print("dive_sectors.jpg", sheet.size)


if __name__ == "__main__":
    main()
