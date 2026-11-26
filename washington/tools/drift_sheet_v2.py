"""v2 drift sheet: this film (left) vs the owner-APPROVED TESTS (right): gm3d clip v8 (look), v6 (clouds/opening), troops v14.
usage: python3 washington/tools/drift_sheet_v2.py RENDER_DIR TAG -> washington/critics/drift_v2_<TAG>.jpg"""
import subprocess, sys
from PIL import Image, ImageDraw, ImageFont
RD, TAG = sys.argv[1], sys.argv[2]; R = "/home/user/battle-maps"; V = f"{R}/washington"
C8, C6, T14 = f"{R}/research/style_tests/gm3d/clip/gm3d_clip_v8_share.mp4", f"{R}/research/style_tests/gm3d/clip/gm3d_clip_v6_share.mp4", f"{R}/vicksburg/troops_test_v14_share.mp4"
F = ImageFont.truetype(f"{V}/tools/oswald-latin-700-normal.ttf", 22)
PAIRS = [("S01", 3.0, C6, 5.0, "opening: wide map + clouds"), ("S04", 22.8, C8, 3.0, "wide map: legend, timeline, plate"),
         ("S03", 65.2, C8, 35.0, "close summer: clock, carved name"), ("S03", 130.7, C8, 60.5, "result ledger top-right"),
         ("S05", 100.0, C8, 60.5, "close winter: Trenton"), ("S07", 75.9, T14, 40.0, "battle: line blocks, volleys")]
W, H = 960, 540
sh = Image.new("RGB", (2 * W + 30, len(PAIRS) * (H + 40) + 10), (20, 20, 20)); d = ImageDraw.Draw(sh)
def grab(src, t, out):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", src, "-frames:v", "1", "-vf", f"scale={W}:{H}", out], check=True)
    return Image.open(out).convert("RGB")
for i, (s, t, ref, rt, what) in enumerate(PAIRS):
    y = i * (H + 40) + 40
    sh.paste(grab(f"{RD}/{s}.mp4", t, f"/tmp/wx_dv2_{i}a.jpg"), (10, y)); sh.paste(grab(ref, rt, f"/tmp/wx_dv2_{i}b.jpg"), (W + 20, y))
    d.text((10, y - 32), f"WASHINGTON v2 {s} @ {t}s - {what}", fill=(240, 220, 160), font=F)
    d.text((W + 20, y - 32), f"APPROVED TEST {ref.split('/')[-1][:-4]} @ {rt}s", fill=(170, 240, 180), font=F)
out = f"{V}/critics/drift_v2_{TAG}.jpg"; sh.save(out, quality=80); print(out)
