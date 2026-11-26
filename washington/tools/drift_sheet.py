"""Drift-check sheet: 6 stills of this film (left) next to 6 matching Jackson v4 stills (right, critics/jackson_ref/).
usage: python3 washington/tools/drift_sheet.py RENDER_DIR ROUND   -> washington/critics/drift_round<ROUND>.jpg"""
import subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont
RD, RN = sys.argv[1], sys.argv[2]
V = "/home/user/battle-maps/washington"; J = f"{V}/critics/jackson_ref"
F = ImageFont.truetype(f"{V}/tools/oswald-latin-700-normal.ttf", 22)
PAIRS = [  # (our scene, t, Jackson still, what to compare)
    ("S01", 17.8, "J_S01_18.jpg", "hook: first battle view after the dive"),
    ("S01", 56.0, "J_S01_66.jpg", "name slam: 3D gold title + banner"),
    ("S03", 128.5, "J_S03_124.jpg", "move 1 result card (ledger)"),
    ("S05", 44.0, "J_S05_70.jpg", "night battle look"),
    ("S05", 150.0, "J_S07_150.jpg", "method card (letter)"),
    ("S08", 30.0, "J_S08_55.jpg", "ending: final cards"),
]
W, H = 960, 540
sheet = Image.new("RGB", (2 * W + 30, len(PAIRS) * (H + 40) + 10), (20, 20, 20)); d = ImageDraw.Draw(sheet)
for i, (s, t, jf, what) in enumerate(PAIRS):
    tmp = f"/tmp/wx_drift_{s}_{t}.jpg"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", f"{RD}/{s}.mp4", "-frames:v", "1", "-vf", f"scale={W}:{H}", tmp], check=True)
    y = i * (H + 40) + 40
    sheet.paste(Image.open(tmp).convert("RGB").resize((W, H)), (10, y)); sheet.paste(Image.open(f"{J}/{jf}").convert("RGB").resize((W, H)), (W + 20, y))
    d.text((10, y - 32), f"WASHINGTON {s} @ {t}s  -  {what}", fill=(240, 220, 160), font=F)
    d.text((W + 20, y - 32), f"JACKSON v4 {jf[:-4]}", fill=(170, 200, 240), font=F)
out = f"{V}/critics/drift_round{RN}.jpg"; sheet.save(out, quality=80); print(out)
