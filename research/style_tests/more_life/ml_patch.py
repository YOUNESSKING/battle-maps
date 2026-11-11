# exec'd by make_body.py when ML=1 (after bc_patch.py): s12d_bc -> s12d_ml (farms, river name on its word, living map). Uses `src`, `rep`.
import json as _j, re as _re
MLD = "/home/user/battle-maps/research/style_tests/more_life"
FJ = _j.load(open(f"{MLD}/farms/farms.json"))
k_ = FJ["farms"]["coker_house"]["map_px_per_img_px"]
FARMS = []
for key, c in (("coker_house", (1652, 768)), ("champion_house", (1664, 692))):   # Champion house on the NE shoulder, east of the lit crest
    f = FJ["farms"][key]; W_, H_ = f["size_px"]; cx, cy = f["centre_px"]
    FARMS.append(dict(png=f["png"], left=round(c[0] - cx * k_, 2), top=round(c[1] - cy * k_, 2), w=round(W_ * k_, 2), h=round(H_ * k_, 2)))
LIBS = open(f"{MLD}/living/rivers_px.js").read() + "\n" + open(f"{MLD}/living/river_label.js").read() + "\n" + open(f"{MLD}/living/living.js").read()
rep("// ===== s12d_rt TEST", "// ===== s12d_ml: living map + river labels (research/style_tests/more_life/living, inlined)\n" + LIBS + "\n// ===== s12d_rt TEST")
# farms with the towns (under the road SVG)
rep("const rtLabel = (k, t = 0, until = null) => {", '''const MLF = %s;   /* s12d_ml: Coker house (Raymond road) + Champion plantation (hill's NE shoulder) */
MLF.forEach((c) => { const im = document.createElement("img"); im.src = `assets/rt/${c.png}`; im.alt = "";
  im.style.cssText = `position:absolute;left:${c.left}px;top:${c.top}px;width:${c.w}px;height:${c.h}px;pointer-events:none`; RTL.insertBefore(im, RTSV); });
const rtLabel = (k, t = 0, until = null) => {''' % _j.dumps(FARMS))
# make room for the Champion house: McClernand's corps box and the cavalry up, McPherson further east on the road
for a, b in [('B.move("u13", T_17, 1.2, 1652, 680);', 'B.move("u13", T_17, 1.2, 1652, 650);'),
             ('BOX("ucav", "carth", 1664, 630, "II", "cav")', 'BOX("ucav", "carth", 1678, 612, "II", "cav")'),
             ('BOX("d17a", "carth", 1692, 690, "XX")', 'BOX("d17a", "carth", 1706, 690, "XX")'),
             ('B.move("u17", T_17 + 0.1, 1.2, 1726, 700);', 'B.move("u17", T_17 + 0.1, 1.2, 1742, 700);')]:
    rep(a, b)
# wagon park south-east, clear of the Coker farm and the Raymond cross
m = _re.search(r'\{"fires": \[\[[^\]]*\], \[[^\]]*\]\], "png": "bc_wagon_park.png", "left": ([\d.]+), "top": ([\d.]+)', src)
assert m
seg = m.group(0); dx, dy = 45, 14
seg2 = _re.sub(r'"left": [\d.]+, "top": [\d.]+', f'"left": {float(m.group(1)) + dx:.2f}, "top": {float(m.group(2)) + dy:.2f}', seg)
seg2 = _re.sub(r'\[([\d.]+), ([\d.]+)\]', lambda q: f"[{float(q.group(1)) + dx:.1f}, {float(q.group(2)) + dy:.1f}]", seg2)
src = src.replace(seg, seg2)
# living map + the river name on its word (no weather)
src = src.replace("window.__RT_T = {", '''{ const LV = LivingW({ tl });   /* s12d_ml: living map (no weather: the Big Black weather is unverified) */
  LV.water("assets/mask_water.png", { paths: [RIVERS_PX.mississippi.pts, RIVERS_PX.big_black.pts, RIVERS_PX.pearl.pts], lanes: { 0: [-5, 0, 5] } });
  LV.clouds({ t0: 0, t1: END });
  ["u13", "u17", "u15"].forEach((id) => LV.dust(B.units[id].el, 0.2, END, { opacity: 0.55, size: 52 }));   // dust behind the Union columns while they march
  LV.light("afternoon", 0, { dur: 0 });
  riverLabel("bb", "Big Black River", RIVERS_PX.big_black.pts, T_BB, { s: 1.9, size: 25, hw: 4.5, near: [1597, 554], side: "left", tl }); }
window.__RT_T = {''', 1)
src = src.replace("scene s12d_bc = s12d_rt +", "scene s12d_ml = s12d_bc + farms, river label, living map (ml_patch.py); s12d_bc = s12d_rt +", 1)
# the river now carries its own carved name on "the Big Black": drop the duplicate white battle name (it sat on the Vicksburg label); the mark stays
rep('BAT("BIG BLACK", BBR, T_BB, T_EVERY + 0.4, -40, 85, [1534, 708]);', 'MARK([1534, 708], T_BB);   /* s12d_ml: name given by the river label */')
