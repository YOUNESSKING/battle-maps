"""Assets for the merged-style test (our maps + the reference's look, owner test 2026-10-06):
- assets/<map>_ref.jpg: our relief graded to dark green-grey terrain + dark teal sea (the reference palette)
- assets/media/<map>_ctlm_<state>.png: crimson enemy territory with a glowing red rim (reference) + our blue Allied ground + front band
- assets/media/emblem_ger.png: the German national emblem as a big textured 'stamped' disc
- assets/media/headline_holland.jpg: a designed newspaper-style headline card (no real masthead)"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage
import make_control as MC
W, H = 2880, 1620
rng = np.random.default_rng(3)
def grade(src, water, out):
    a = np.asarray(Image.open(src).convert("L"), np.float32) / 255
    lo, hi = np.percentile(a, 2), np.percentile(a, 99.5); a = np.clip((a - lo) / (hi - lo), 0, 1) ** 1.25
    dark, light = np.array([18, 24, 24]), np.array([132, 148, 134])
    rgb = dark + (light - dark) * a[..., None]
    sea = np.array([16, 27, 34]); rgb = rgb * (1 - water[..., None]) + sea * water[..., None]
    n = rng.normal(0, 5, (H, W, 1)); rgb = np.clip(rgb + n, 0, 255)
    Image.fromarray(rgb.astype(np.uint8)).save(out, quality=92)
hl = np.array(Image.open("assets/holland_land.png").convert("L")) > 127
nw = np.array(Image.open("assets/nijmegen_water.png"))[..., 3] > 127
grade("assets/holland.jpg", (~hl).astype(np.float32), "assets/holland_ref.jpg")
grade("assets/nijmegen.jpg", ndimage.gaussian_filter(nw.astype(np.float32), 1.5), "assets/nijmegen_ref.jpg")
# crimson territory (reference) + blue Allied ground (our lock)
def build(name, land, allied, water=None):
    m_al = allied & land; m_ax = land & ~allied
    if water is not None: m_al &= ~water; m_ax &= ~water
    out = np.zeros((H, W, 4), np.float32)
    d_ax = ndimage.distance_transform_edt(~m_al)
    a = np.where(m_ax, 0.36 + 0.24 * np.exp(-d_ax / 40.0), 0); out[m_ax, :3] = (140, 12, 20); out[..., 3] = a
    a2 = np.where(m_al, 0.30, 0); out[m_al, :3] = (46, 92, 178); out[m_al, 3] = a2[m_al]
    rim = ndimage.gaussian_filter((m_ax & ndimage.binary_dilation(m_al, iterations=3)).astype(np.float32), 6) * 3.0
    rim = np.clip(rim, 0, 1) * (land if water is None else land & ~water)
    sel = rim > 0.02; out[sel, :3] = out[sel, :3] * (1 - rim[sel, None]) + np.array([235, 55, 45]) * rim[sel, None]; out[sel, 3] = np.maximum(out[sel, 3], rim[sel] * 0.9)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/{name}.png", optimize=True); print("wrote", name)
build("holland_ctlm_sep20", hl, MC.mask(MC.holland_sep20))
land = ~nw
sep = land & ~ndimage.binary_dilation(nw, iterations=2); sep[:6, :] = False; sep[:, -6:] = False; sep[:, :6] = False
lab, _ = ndimage.label(sep); south = ndimage.binary_dilation(lab == lab[1450, 1700], iterations=9)
build("nijmegen_ctlm_before", land, south, nw)
build("nijmegen_ctlm_after", land, south | (MC.mask(lambda d: d.rectangle((0, 0, 1800, 1620), fill=255)) & ~south), nw)
# stamped emblem: white disc + black swastika (rotated 45), worn texture
S = 1000; em = Image.new("RGBA", (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(em)
d.ellipse((20, 20, S - 20, S - 20), fill=(232, 228, 218, 255))
sw = Image.new("L", (S, S), 0); ds = ImageDraw.Draw(sw); c, u = S // 2, 62
for r in [(-0.75, -4, 0.75, 4), (-4, -0.75, 4, 0.75), (-0.75, -4, 4, -2.5), (2.5, -0.75, 4, 4), (-4, 2.5, 0.75, 4), (-4, -4, -2.5, 0.75)]:
    ds.rectangle((c + r[0] * u, c + r[1] * u, c + r[2] * u, c + r[3] * u), fill=255)
sw = sw.rotate(45, resample=Image.BICUBIC)
em.paste((22, 20, 18, 255), (0, 0), sw)
tex = ndimage.gaussian_filter(rng.random((S, S)), 3); tex = (tex - tex.min()) / (tex.max() - tex.min())
al = np.asarray(em, np.float32)[..., 3] * (0.55 + 0.45 * tex)
em = np.asarray(em, np.float32); em[..., :3] *= (0.8 + 0.2 * tex[..., None]); em[..., 3] = al
Image.fromarray(em.clip(0, 255).astype(np.uint8), "RGBA").save("assets/media/emblem_ger.png", optimize=True)
# newspaper-style headline card (designed; no real paper's name)
PW, PH = 2400, 1350
pap = np.full((PH, PW, 3), (214, 203, 176), np.float32) + rng.normal(0, 7, (PH, PW, 1)) + ndimage.gaussian_filter(rng.normal(0, 25, (PH, PW)), 40)[..., None]
yy, xx = np.mgrid[0:PH, 0:PW]; v = 1 - 0.35 * (((xx - PW / 2) / (PW / 2)) ** 2 + ((yy - PH / 2) / (PH / 2)) ** 2); pap *= v[..., None]
im = Image.fromarray(pap.clip(0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
SB = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"; SR = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
ink = (28, 24, 20)
d.line((260, 200, PW - 260, 200), fill=ink, width=6); d.line((260, 214, PW - 260, 214), fill=ink, width=2)
d.text((PW / 2, 160), "SPECIAL WAR EDITION  ·  MONDAY, SEPTEMBER 18, 1944", font=ImageFont.truetype(SR, 44), fill=ink, anchor="mm")
for i, line in enumerate(["AIRBORNE ARMY", "LANDS IN HOLLAND"]):
    d.text((PW / 2, 360 + i * 185), line, font=ImageFont.truetype(SB, 165), fill=ink, anchor="mm")
d.text((PW / 2, 730), "Paratroops and gliders seize bridges far behind the German lines", font=ImageFont.truetype(SR, 54), fill=ink, anchor="mm")
d.line((260, 800, PW - 260, 800), fill=ink, width=3)
for col in range(4):  # unreadable body columns
    x0 = 260 + col * (PW - 520) / 4 + 20
    for k in range(12):
        w = (PW - 520) / 4 - 60 - (rng.random() * 120 if k % 5 == 4 else 0)
        d.rectangle((x0, 840 + k * 32, x0 + w, 840 + k * 32 + 12), fill=(70, 62, 52))
im = im.filter(ImageFilter.GaussianBlur(1.2))
a = np.asarray(im, np.float32); a = a * np.array([0.86, 0.98, 1.02])  # teal grade like the reference
Image.fromarray(a.clip(0, 255).astype(np.uint8)).save("assets/media/headline_holland.jpg", quality=92)
print("ok")
