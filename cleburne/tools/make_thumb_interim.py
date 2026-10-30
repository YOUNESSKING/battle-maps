"""INTERIM thumbnail (vidIQ has 0 credits until 22 Nov 2026): our own hook frame (0:26, the swing around Atlanta onto the
railroad at Jonesboro) as the battlefield, darkened + fire/smoke glow, our labels, Sherman's real LoC photo cut out on the right
third, red brush banner bottom-left (same compositor as tools/make_thumb.py). Replace with the vidIQ version when credits return.
usage: python3 tools/make_thumb_interim.py -> youtube/thumb/sherman-thumb-{A-make-georgia-howl,B-cut-loose}.jpg"""
import subprocess
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
from rembg import remove
W, H = 1280, 720
F = "tools/oswald-latin-700-normal.ttf"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "26", "-i", "build/sherman.mp4", "-frames:v", "1", "build/thumbpick/src26.png"], check=True)
fr = Image.open("build/thumbpick/src26.png").convert("RGB")           # 1920x1080
bx = (450, 155, 450 + 1316, 155 + 740)                                    # crop the battlefield, drop the HUD (date box, legend, ? badge)
bg = fr.crop(bx).resize((W, H), Image.LANCZOS)
bg = ImageEnhance.Contrast(ImageEnhance.Color(bg).enhance(0.85)).enhance(1.15)
bg = ImageEnhance.Brightness(bg).enhance(0.82).convert("RGBA")
def glow(x, y, r, col, a):
    g = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse((x - r, y - r, x + r, y + r), fill=col + (a,))
    return g.filter(ImageFilter.GaussianBlur(r * 0.45))
ax, ay = (1000 - bx[0]) * W / (bx[2] - bx[0]), (300 - bx[1]) * H / (bx[3] - bx[1])  # Atlanta in the 26 s frame (~1000, 300)
for r, col, a in [(150, (40, 30, 25), 120), (80, (255, 120, 30), 80), (36, (255, 190, 90), 70)]:
    bg.alpha_composite(glow(ax, ay, r, col, a))
vg = Image.new("RGBA", (W, H), (0, 0, 0, 0)); vd = ImageDraw.Draw(vg)  # darken the bottom-left corner (HUD remnants under the banner)
for i in range(200): vd.line([(0, H - 200 + i), (W, H - 200 + i)], fill=(0, 0, 0, int(210 * i / 200)))
bg.alpha_composite(vg)
pt = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(pt)  # paint out HUD corners (date scroll, flag label, name plate)
pd.rectangle((0, 0, 150, 75), fill=(24, 22, 26, 255)); pd.rectangle((0, 610, 360, H), fill=(10, 9, 10, 255))
bg.alpha_composite(pt.filter(ImageFilter.GaussianBlur(18)))
d = ImageDraw.Draw(bg); f = ImageFont.truetype(F, 24)
def tag(t, x, y):
    w = d.textlength(t, font=f); d.rectangle([x, y, x + w + 18, y + 34], fill=(18, 16, 12)); d.rectangle([x, y, x + w + 18, y + 34], outline=(201, 180, 138), width=2)
    d.text((x + 9, y + 2), t, font=f, fill=(247, 243, 234))
tag("SHERMAN", 150, 300)  # the map frame already carries ATLANTA, JONESBORO, MACON & WESTERN
# right third: dark gradient + Sherman's real photo cut out
src = Image.open("assets/media/sherman_hires_c.jpg").convert("RGB")
cut = remove(src); cut = cut.crop(cut.getbbox()); cut = cut.crop((0, 0, cut.width, int(cut.height * 0.62)))
g = ImageEnhance.Contrast(cut.convert("LA").convert("RGBA")).enhance(1.3); g.putalpha(cut.split()[3])
h = int(H * 0.96); w = int(g.width * h / g.height); g = g.resize((w, h), Image.LANCZOS)
shade = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(shade)
for i in range(460): sd.line([(W - 460 + i, 0), (W - 460 + i, H)], fill=(0, 0, 0, int(200 * i / 460)))
bg.alpha_composite(shade); bg.alpha_composite(g, (W - w + int(w * 0.16), H - h + 6))
base = bg
def banner(text, out, size):
    im = base.copy(); dr = ImageDraw.Draw(im); ft = ImageFont.truetype(F, size)
    tw = dr.textlength(text, font=ft); bx_, by = 34, H - size - 92
    brush = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(brush)
    bd.polygon([(bx_ - 10, by + 14), (bx_ + tw + 60, by - 4), (bx_ + tw + 74, by + size + 40), (bx_ + 6, by + size + 54)], fill=(176, 18, 26, 240))
    im.alpha_composite(brush.filter(ImageFilter.GaussianBlur(1.2)))
    dr.text((bx_ + 26, by + 4), text, font=ft, fill=(255, 255, 255), stroke_width=2, stroke_fill=(60, 0, 0))
    im.convert("RGB").save(out, quality=92); print(out)
banner("“MAKE GEORGIA HOWL”", "youtube/thumb/sherman-thumb-A-make-georgia-howl.jpg", 96)
banner("CUT LOOSE", "youtube/thumb/sherman-thumb-B-cut-loose.jpg", 128)
