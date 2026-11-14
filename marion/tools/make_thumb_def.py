"""Thumbnails D/E/F from the competitor study only (research/competitors_top20/SUMMARY.md table, owner 2026-11-13), each generated with
vidIQ from its reference + the reference's own text style: D Eastory (map + ONE big place name), E Kings and Generals (illustration over a
faded map + 3-5 word caps headline), F Epic History (cream/red template, one big word). Writes yorktown-thumb6-*.jpg + thumb6_vs_refs.jpg."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W, H = 1280, 720; O = "tools/oswald-latin-700-normal.ttf"
MONO = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"; SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
def load(p): return Image.open(p).convert("RGB").resize((W, H), Image.LANCZOS).convert("RGBA")
def glow_text(im, xy, text, font, fill, outline, ow, anchor="mm", blur=0):
    d = ImageDraw.Draw(im); d.text(xy, text, font=font, fill=fill, anchor=anchor, stroke_width=ow, stroke_fill=outline)
# D: Eastory: typewriter place name across the pocket, dark blue with white outline (as "Berlin")
D = load("youtube/thumb/bg_vidiq_D_eastory.jpg")
glow_text(D, (668, 330), "Yorktown", ImageFont.truetype(MONO, 118), (24, 40, 110), (255, 255, 255), 7)
D.convert("RGB").save("youtube/thumb/yorktown-thumb6-D_EASTORY.jpg", quality=94)
# E: Kings and Generals: stone-white carved serif caps, two lines, centre-low, heavy shadow
E = load("youtube/thumb/bg_vidiq_E_kg.jpg")
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); s = ImageDraw.Draw(sh)
for (y, t, sz) in ((470, "THE TRAP", 132), (590, "AT YORKTOWN", 92)):
    s.text((W / 2 + 6, y + 8), t, font=ImageFont.truetype(SERIF, sz), fill=(0, 0, 0, 200), anchor="mm")
E.alpha_composite(sh.filter(ImageFilter.GaussianBlur(6)))
for (y, t, sz) in ((470, "THE TRAP", 132), (590, "AT YORKTOWN", 92)):
    glow_text(E, (W / 2, y), t, ImageFont.truetype(SERIF, sz), (238, 232, 218), (40, 32, 24), 3)
E.convert("RGB").save("youtube/thumb/yorktown-thumb6-E_KG.jpg", quality=94)
# F: Epic History: big black condensed word top-left on cream, small black date tag, red label box
F = load("youtube/thumb/bg_vidiq_F_epic.jpg"); d = ImageDraw.Draw(F)
d.text((40, 6), "YORKTOWN", font=ImageFont.truetype(O, 190), fill=(18, 16, 14))
d.rectangle([44, 238, 240, 290], fill=(18, 16, 14)); d.text((142, 264), "1781", font=ImageFont.truetype(O, 40), fill=(245, 240, 228), anchor="mm")
d.rectangle([262, 232, 560, 296], fill=(200, 24, 30)); d.text((411, 264), "THE TRAP", font=ImageFont.truetype(O, 48), fill=(255, 255, 255), anchor="mm")
F.convert("RGB").save("youtube/thumb/yorktown-thumb6-F_EPIC.jpg", quality=94)
# sheet vs refs
F2 = ImageFont.truetype(O, 24)
rows = [("D_EASTORY", "ref_D_eastory.jpg", "D  ours  |  ref: Eastory 'Eastern Front 1944/45' (10.3M, 57x): map + ONE big place name"),
        ("E_KG", "ref_E_kingsandgenerals.jpg", "E  ours  |  ref: Kings and Generals 'Rome conquers Greece' (20.3M, 62x): illustration over faded map + caps headline"),
        ("F_EPIC", "ref_F_epichistory.jpg", "F  ours  |  ref: Epic History 'Alexander' (29.3M, 32x): cream/red template, one big word")]
s = Image.new("RGB", (2 * 640 + 2 * 168 + 100, 3 * 410 + 20), (24, 22, 20)); d = ImageDraw.Draw(s)
for r, (p, ref, lab) in enumerate(rows):
    y = 14 + r * 410; d.text((20, y), lab, font=F2, fill=(235, 225, 205))
    for k, f in enumerate([f"youtube/thumb/yorktown-thumb6-{p}.jpg", "youtube/thumb/" + ref]):
        im = Image.open(f).convert("RGB"); s.paste(im.resize((640, 360), Image.LANCZOS), (20 + k * 660, y + 38)); s.paste(im.resize((168, 94), Image.LANCZOS), (1340 + k * 188, y + 38))
    d.text((1340, y + 140), "feed size: ours | ref", font=ImageFont.truetype(O, 18), fill=(170, 160, 140))
s.save("youtube/thumb/thumb6_vs_refs.jpg", quality=92); print("ok")
