"""Hook-a stakes opening (STYLE_LOCK 1a UPDATED 2026-10-28): the whole-Korea overview baked per date (korea_hd_ref dark relief
+ option-1 control overlay multiplied + korea geo layer) -> assets/media/hook_ov_<date>.jpg (5760x3240). hook-a.js places them
inside the nwkorea world at their true place and scale (1 korea px = 4 nwkorea px). usage (from peng/): python3 tools/make_hook_overview.py"""
from PIL import Image, ImageChops
base = Image.open("assets/korea_hd_ref.jpg").convert("RGB")
geo = Image.open("assets/media/korea_geo_ref.png").convert("RGBA")
for d in ("sep15", "oct24", "nov24"):
    ov = Image.open(f"assets/media/korea_ctl_{d}_mx.png").convert("RGBA").resize(base.size, Image.LANCZOS)
    white = Image.new("RGB", base.size, (255, 255, 255)); white.paste(ov.convert("RGB"), mask=ov.split()[3])
    im = ImageChops.multiply(base, white).convert("RGBA")
    im.alpha_composite(geo)
    im.convert("RGB").save(f"assets/media/hook_ov_{d}.jpg", quality=86); print(d)
