"""Drift-check sheet: 6 rows; columns = this film | Jackson v4 (critics/jackson_ref/) | the owner-approved 3D tests (gm3d clip v6/v8, troops v13/v14).
Grand Maneuver frames: the owner's Gofile (0clSF4KK) was expired on 2026-11-26, so GM is compared through research/competitors_top20/grand_maneuver/GM_STUDY.md
(any GM frame sheet would stay in /tmp: never commit GM frames).
usage: python3 washington/tools/drift_sheet.py RENDER_DIR ROUND   -> washington/critics/drift_round<ROUND>.jpg"""
import subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont
RD, RN = sys.argv[1], sys.argv[2]
V = "/home/user/battle-maps/washington"; J = f"{V}/critics/jackson_ref"
F = ImageFont.truetype(f"{V}/tools/oswald-latin-700-normal.ttf", 22)
R = "/home/user/battle-maps"
CLIP6, CLIP8 = f"{R}/research/style_tests/gm3d/clip/gm3d_clip_v6_share.mp4", f"{R}/research/style_tests/gm3d/clip/gm3d_clip_v8_share.mp4"
TR14 = f"{R}/vicksburg/troops_test_v14_share.mp4"
PAIRS = [  # (our scene, t, Jackson still, approved test (video, t), what to compare)
    ("S01", 17.8, "J_S01_18.jpg", (CLIP6, 16.5), "hook: first view after the cloud dive"),
    ("S01", 54.8, "J_S01_66.jpg", (CLIP8, 12.2), "name slam: 3D gold title + banner"),
    ("S03", 128.5, "J_S03_124.jpg", (CLIP8, 60.5), "move 1 result card (ledger)"),
    ("S07", 70.0, "J_S05_70.jpg", (TR14, 40.0), "battle: line blocks, volleys, smoke"),
    ("S05", 148.0, "J_S07_150.jpg", (CLIP8, 35.2), "method card (letter)"),
    ("S08", 41.0, "J_S08_55.jpg", (CLIP8, 3.0), "ending: final cards / wide map"),
]
W, H = 960, 540
sheet = Image.new("RGB", (3 * W + 40, len(PAIRS) * (H + 40) + 10), (20, 20, 20)); d = ImageDraw.Draw(sheet)
for i, (s, t, jf, (tv, tt), what) in enumerate(PAIRS):
    tmp = f"/tmp/wx_drift_{s}_{t}.jpg"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", f"{RD}/{s}.mp4", "-frames:v", "1", "-vf", f"scale={W}:{H}", tmp], check=True)
    y = i * (H + 40) + 40
    sheet.paste(Image.open(tmp).convert("RGB").resize((W, H)), (10, y)); sheet.paste(Image.open(f"{J}/{jf}").convert("RGB").resize((W, H)), (W + 20, y))
    d.text((10, y - 32), f"WASHINGTON {s} @ {t}s  -  {what}", fill=(240, 220, 160), font=F)
    d.text((W + 20, y - 32), f"JACKSON v4 {jf[:-4]}", fill=(170, 200, 240), font=F)
    tmp2 = f"/tmp/wx_drift_test_{i}.jpg"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(tt), "-i", tv, "-frames:v", "1", "-vf", f"scale={W}:{H}", tmp2], check=True)
    sheet.paste(Image.open(tmp2).convert("RGB").resize((W, H)), (2 * W + 30, y))
    d.text((2 * W + 30, y - 32), f"APPROVED TEST {os.path.basename(tv)[:-4]} @ {tt}s", fill=(170, 240, 180), font=F)
out = f"{V}/critics/drift_round{RN}.jpg"; sheet.save(out, quality=80); print(out)
