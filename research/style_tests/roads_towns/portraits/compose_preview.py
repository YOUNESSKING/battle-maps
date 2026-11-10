# python3 compose_preview.py DIR  -> preview.jpg (1080p frame + 2x crops old/new + a phone-size strip), from render_preview.js output in DIR
import sys, os
from PIL import Image, ImageDraw, ImageFont
d = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
one, two = Image.open(f"{d}/preview_1x.png").convert("RGB"), Image.open(f"{d}/preview_2x.png").convert("RGB")
try: F = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", 26)
except OSError: F = ImageFont.load_default()
sheet = Image.new("RGB", (1920, 1080 + 600), (18, 16, 13)); sheet.paste(one, (0, 0)); dr = ImageDraw.Draw(sheet)
box = lambda x0: (2 * x0, 2 * 140, 2 * (x0 + 370), 2 * 400)   # Grant + Pemberton, "up"
for i, (x0, lab) in enumerate([(90, "OLD at 2x"), (1050, "NEW at 2x")]):
    sheet.paste(two.crop(box(x0)), (i * 750, 1080 + 60)); dr.text((i * 750 + 10, 1080 + 16), lab, fill=(240, 230, 200), font=F)
ph = one.resize((420, 236), Image.LANCZOS); sheet.paste(ph, (1500, 1080 + 60)); dr.text((1500, 1080 + 16), "phone feed size", fill=(240, 230, 200), font=F)
ph2 = one.crop((960, 120, 1920, 660)).resize((420, 236), Image.LANCZOS); sheet.paste(ph2, (1500, 1080 + 330)); dr.text((1500, 1080 + 300), "new, phone full-screen (approx.)", fill=(200, 190, 165), font=F)
sheet.save(os.path.join(os.path.dirname(os.path.abspath(__file__)), "preview.jpg"), quality=90)
