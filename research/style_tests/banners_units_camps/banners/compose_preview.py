# python3 compose_preview.py DIR -> preview.jpg: the 1080p frame, a 2x crop of Grant + Pemberton (+ mystery / reveal), the 4 sway phases,
# and the frame downscaled to 480 px wide (phone feed) + a phone full-screen approximation
import sys, os
from PIL import Image, ImageDraw, ImageFont
d = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
one, two = Image.open(f"{d}/preview_1x.png").convert("RGB"), Image.open(f"{d}/preview_2x.png").convert("RGB")
try: F = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", 24)
except OSError: F = ImageFont.load_default()
H2 = 560
sheet = Image.new("RGB", (1920, 1080 + 40 + H2 + 40 + 280), (18, 16, 13)); sheet.paste(one, (0, 0)); dr = ImageDraw.Draw(sheet)
y = 1080 + 40
c1 = two.crop((2 * 170, 2 * 200, 2 * 640, 2 * 480)).resize((940, H2), Image.LANCZOS); sheet.paste(c1, (0, y)); dr.text((10, y - 32), "2x: Grant (Union) + Pemberton (Confederate)", fill=(240, 230, 200), font=F)
c2 = two.crop((2 * 680, 2 * 200, 2 * 1150, 2 * 480)).resize((940, H2), Image.LANCZOS); sheet.paste(c2, (980, y)); dr.text((990, y - 32), '2x: mystery "?" -> after BN.reveal', fill=(240, 230, 200), font=F)
y += H2 + 40; x = 0
for t in ["0", "0.9", "1.8", "2.7"]:
    s = Image.open(f"{d}/sway_{t}.png").convert("RGB").resize((330, 195), Image.LANCZOS); sheet.paste(s, (x, y)); dr.text((x + 6, y - 30), f"sway t={t}s", fill=(200, 190, 165), font=F); x += 340
ph = one.resize((480, 270), Image.LANCZOS); sheet.paste(ph, (1400, y - 10)); dr.text((1400, y - 40), "480 px (phone feed)", fill=(240, 230, 200), font=F)
sheet.save(os.path.join(os.path.dirname(os.path.abspath(__file__)), "preview.jpg"), quality=90)
