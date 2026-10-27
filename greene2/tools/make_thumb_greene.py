"""Greene remake thumbnail: the vidIQ-generated Greene thumbnail (battlefield + colour Peale-style portrait, made whole by vidIQ in
2026-10, greene/youtube/thumbnail.png) with its old 4-word banner removed (inpaint) and a new 1-3 word torn red banner.
vidIQ credits were at 0 on 2026-10-27, so no new generation. usage: python3 tools/make_thumb_greene.py -> youtube/thumb/greene2-thumb-{A,B}.jpg"""
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFilter, ImageFont
W, H = 1280, 720
F = "tools/oswald-latin-700-normal.ttf"
a = np.asarray(Image.open("youtube/thumb/old_A.png").convert("RGB"))
# old 2-line banner: the red part is covered by the new brush; the white "THEIR VICTORIES" line above it (y 455-540)
# becomes dark smoke: the area is filled from the inpainted+blurred plate and darkened, with a feathered edge
m = np.zeros(a.shape[:2], np.uint8)
m[440:560, 0:790] = 255  # the whole old text box
inp = cv2.inpaint(cv2.cvtColor(a, cv2.COLOR_RGB2BGR), m, 15, cv2.INPAINT_NS)
inp = cv2.GaussianBlur(inp, (0, 0), 14)
feather = cv2.GaussianBlur((m > 0).astype(np.float32), (0, 0), 18)[..., None]
dark = inp.astype(np.float32) * 0.55
clean = (cv2.cvtColor(a, cv2.COLOR_RGB2BGR) * (1 - feather) + dark * feather).clip(0, 255).astype(np.uint8)
base = Image.fromarray(cv2.cvtColor(clean, cv2.COLOR_BGR2RGB)).convert("RGBA")
rng = np.random.default_rng(3)

def banner(text, out, size=150):
    im = base.copy(); ft = ImageFont.truetype(F, size); dr = ImageDraw.Draw(im)
    tw = dr.textlength(text, font=ft)
    x1 = max(840, int(tw + 90)); y0 = 522
    # torn brush stroke: jagged top/right edges, covers the old banner (0-823 x 533-720)
    top = [(x, y0 + int(rng.integers(-10, 12))) for x in range(0, x1, 28)]
    right = [(x1 + int(rng.integers(-18, 18)), y) for y in range(y0, H + 1, 24)]
    poly = [(0, H)] + [(0, y0 + 8)] + top + right + [(0, H)]
    brush = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(brush)
    bd.polygon(poly, fill=(170, 16, 24, 255))
    im.alpha_composite(brush.filter(ImageFilter.GaussianBlur(0.8)))
    streak = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(streak)
    for k in range(40):  # dry-brush streaks (own layer, blended over the opaque brush)
        y = int(rng.integers(y0 + 10, H)); sd.line([(0, y), (int(rng.integers(x1 * 0.5, x1)), y + int(rng.integers(-3, 3)))], fill=(120, 8, 14, 90), width=int(rng.integers(1, 4)))
    im.alpha_composite(streak)
    dr = ImageDraw.Draw(im)
    dr.text((40, y0 + (H - y0) / 2 + 6), text, font=ft, fill=(255, 255, 255), anchor="lm", stroke_width=3, stroke_fill=(70, 0, 0))
    im.convert("RGB").save(out, quality=93); print(out)

banner("LET THEM WIN", "youtube/thumb/greene2-thumb-A-let-them-win.jpg")
banner("LOSE TO WIN", "youtube/thumb/greene2-thumb-B-lose-to-win.jpg")
