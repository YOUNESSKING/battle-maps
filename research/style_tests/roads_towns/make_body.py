"""s12d -> s12d_rt body (copy; the original is only read). usage: make_body.py OUTDIR_WITH_rt_meta.json"""
import json, os, sys
G = "/home/user/battle-maps/grant"
meta = json.load(open(os.path.join(sys.argv[1], "rt_meta.json")))
RW = json.loads(os.environ.get("RW", "[4.4, 1.7, 0.62, 0.5]"))   # dark width, centre width (on screen px), dark alpha, centre alpha
roads = json.load(open("/home/user/battle-maps/research/style_tests/roads_towns/roads/roads_px.json"))["roads"]
D = [("M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in r["pts"])) for r in roads]
src = open(f"{G}/tools/s12_body_s12d.js").read()

RT = """
// ===== s12d_rt TEST (roads + painted towns, research/style_tests/roads_towns): never in the approved s12d =====
const RTM = %s, RTD = %s, RW = %s;
const RTL = document.createElement("div"); RTL.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none";
document.getElementById("relief2").after(RTL);   // above both basemaps, under hatching / territory / overlay / pins
{ const sv = document.createElementNS("http://www.w3.org/2000/svg", "svg"); sv.setAttribute("viewBox", "0 0 2880 1620"); sv.setAttribute("width", "2880"); sv.setAttribute("height", "1620");
  sv.style.cssText = "position:absolute;left:0;top:0;overflow:visible";
  const lay = [["#c4ba80", 8.5, 0.16], ["#26230c", RW[0], RW[2]], ["#8a8452", RW[1], RW[3]]], PS = [];
  lay.forEach(([c, w, a]) => RTD.forEach((d) => { const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", d);
    p.setAttribute("fill", "none"); p.setAttribute("stroke", c); p.setAttribute("stroke-opacity", a); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
    p.__w = w; sv.appendChild(p); PS.push(p); }));
  RTL.appendChild(sv);
  const rtApply = (k) => PS.forEach((p) => p.setAttribute("stroke-width", (p.__w * k).toFixed(3)));
  CURV.push([{ setAttribute: (a, v) => rtApply(+v) }, 1]); rtApply(1 / CAM_S); }
Object.entries(RTM.towns).forEach(([k, T]) => { const im = document.createElement("img"); im.src = `assets/rt/town_${k}.png`; im.alt = "";
  im.style.cssText = `position:absolute;left:${T.left}px;top:${T.top}px;width:${T.w}px;height:${T.h}px`; RTL.appendChild(im); });
// reference-style town name (spaced cream serif on a gentle arc, beside the town; constant on screen)
const rtLabel = (k, t = 0, until = null) => { const T = RTM.towns[k], Lb = T.label;
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><img src="assets/rt/label_${k}.png" alt="" style="position:absolute;left:${(Lb.dx - Lb.ax).toFixed(1)}px;top:${(Lb.dy - Lb.ay).toFixed(1)}px;width:${Lb.w}px;height:${Lb.h}px;max-width:none"></div>`, T.c[0], T.c[1], { t: t > 0 ? t : null });
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); pinS(el); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el; };
""" % (json.dumps(meta), json.dumps(D), json.dumps(RW))

def rep(a, b):
    global src
    assert src.count(a) == 1, a
    src = src.replace(a, b)

rep("const P3 = \"s12-3\"", RT + "const P3 = \"s12-3\"")
rep('const VTW = town("VICKSBURG", VKS, "l", 0);', 'const VTW = rtLabel("vicksburg", 0);   // s12d_rt: painted town + reference label (permanent: the army heads for it)')
# battle names at the three towns -> reference town labels (same timing rule: Port Gibson / Raymond pass, Jackson stays: the army heads for it);
# the crossed-sabres mark moves to the town's edge so the town stays readable
rep('const BAT = (txt, p, t, until, dx = 0, dy = -40, mp = p) => {', 'const BATT = (k, p, t, until, mo) => { MARK([p[0] + mo[0], p[1] + mo[1]], t); return rtLabel(k, t + 0.05, until); };\nconst BAT = (txt, p, t, until, dx = 0, dy = -40, mp = p) => {')
rep('BAT("PORT GIBSON", PG, T_PG, T_12 + 0.6, -110, 40);', 'BATT("port_gibson", PG, T_PG, Math.min(T_12 + 0.6, T_PG + LBL_LIFE), [-22, -8]);')
rep('BAT("RAYMOND", RAY, T_RAY, T_14 + 0.6, -40, 46);', 'BATT("raymond", RAY, T_RAY, Math.min(T_14 + 0.6, T_RAY + LBL_LIFE), [-20, 12]);')
rep('BAT("JACKSON", JAX, T_JAX, T_16 + 0.6, 0, -46);', 'BATT("jackson", JAX, T_JAX, null, [-26, -6]);')
src = src.replace("// SCRIPT-12 TEST, scene s12d", "// SCRIPT-12 TEST, scene s12d_rt = COPY of s12d + roads + painted towns (make_body.py in the roads_towns test); original s12d", 1)
src = src.replace("B.finish();", "window.__RT_T = { T_CH, T_17, T_16, T_BB };\nB.finish();")
open(f"{G}/tools/s12_body_s12d_rt.js", "w").write(src)
print("ok", len(src) // 1024, "KB")
