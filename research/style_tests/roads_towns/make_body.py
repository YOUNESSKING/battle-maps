"""s12d -> s12d_rt body (copy; the original is only read). usage: make_body.py OUTDIR_WITH_rt_meta.json"""
import json, os, sys
G = "/home/user/battle-maps/grant"
meta = json.load(open(os.path.join(sys.argv[1], "rt_meta.json")))
RW = json.loads(os.environ.get("RW", "[2.8, 0.9, 0.5, 0.28]"))   # dark width, centre width (on screen px), dark alpha, centre alpha
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from road_fix import fixed_roads
roads = fixed_roads()
import math, random
TC = [t["c"] for t in meta["towns"].values()]
def meander(P, seed):
    rnd = random.Random(seed); ph = [rnd.uniform(0, 6.28) for _ in range(3)]
    out, acc = [], 0.0
    for i, (x, y) in enumerate(P):
        if i: acc += math.hypot(x - P[i - 1][0], y - P[i - 1][1])
        a, b = P[max(0, i - 2)], P[min(len(P) - 1, i + 2)]
        L = math.hypot(b[0] - a[0], b[1] - a[1]) + 1e-9; nx, ny = -(b[1] - a[1]) / L, (b[0] - a[0]) / L
        dt = min(math.hypot(x - cx, y - cy) for cx, cy in TC)
        tap = min(1, max(0, (dt - 26) / 30)) * min(1, i / 8, (len(P) - 1 - i) / 8)
        o = tap * (2.6 * math.sin(acc / 70 + ph[0]) + 1.1 * math.sin(acc / 23 + ph[1]) + 0.35 * math.sin(acc / 8 + ph[2]))
        out.append((x + nx * o, y + ny * o))
    return out
D = [("M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in meander(r["pts"], k))) for k, r in enumerate(roads)]
CXJ = os.path.join(sys.argv[1], "crossings.json")
if os.path.exists(CXJ):   # crossings.py: same meandered roads, ferry roads carried across the Big Black (split at the water)
    D = [" ".join("M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in c) for c in r["paths"]) for r in json.load(open(CXJ))["roads"]]
src = open(f"{G}/tools/s12_body_s12d.js").read()

RT = """
// ===== s12d_rt TEST (roads + painted towns, research/style_tests/roads_towns): never in the approved s12d =====
const RTM = %s, RTD = %s, RW = %s;
let RTSV = null; const RTIMG = {};
const RTL = document.createElement("div"); RTL.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none";
document.getElementById("relief2").after(RTL);   // above both basemaps, under hatching / territory / overlay / pins
// painted hills (research/style_tests/roads_towns/hills, softened copy in hills/soft): wide art right above #relief (so #relief2 covers it
// when the close look takes over), close art right above #relief2 with #relief2's own opacity + lens mask; towns + roads stay above both
const RTH = [], RTHC = [];

["champion_hill", "vicksburg_bluffs"].forEach((h) => { [["", RTH, "relief"], ["_close", RTHC, "relief2"]].forEach(([suf, arr, after]) => {
  const im = document.createElement("img"); im.src = `assets/rt/hill_${h}${suf}.png?v=__BUILDID__`; im.alt = "";
  im.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none";
  const ref = document.getElementById(after); (arr.length ? arr[arr.length - 1] : ref).after(im); arr.push(im); }); });
// cleared lanes through the woods (crossings.py), ABOVE the hill art (the hills' halo repaints the ground under it): wide above the wide hills, close above the close hills
[["lanes_w", RTH, "relief"], ["lanes_close", RTHC, "relief2"]].forEach(([n, arr, after]) => { const im = document.createElement("img");
  im.src = `assets/rt/${n}___BUILDID__.png`; im.alt = ""; im.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none";
  (arr.length ? arr[arr.length - 1] : document.getElementById(after)).after(im); arr.push(im); });
// ground texture (research/style_tests/roads_towns/texture): above the hills + lanes, under the roads/towns; the close one follows #relief2
[["texture_w", RTH, "relief"], ["texture_close", RTHC, "relief2"]].forEach(([n, arr, after]) => { const im = document.createElement("img");
  im.src = `assets/rt/${n}___BUILDID__.png`; im.alt = ""; im.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none";
  (arr.length ? arr[arr.length - 1] : document.getElementById(after)).after(im); arr.push(im); });
const rtHillSync = () => { const R2 = document.getElementById("relief2"); RTHC.forEach((im) => { im.style.opacity = R2.style.opacity;
  im.style.webkitMaskImage = im.style.maskImage = R2.style.maskImage || "none"; }); };
CURV.push([{ setAttribute: () => rtHillSync() }, 1]); rtHillSync();
{ const sv = document.createElementNS("http://www.w3.org/2000/svg", "svg"); sv.setAttribute("viewBox", "0 0 2880 1620"); sv.setAttribute("width", "2880"); sv.setAttribute("height", "1620");
  sv.style.cssText = "position:absolute;left:0;top:0;overflow:visible";
  const lay = [["#c4ba80", 5.0, 0.07], ["#2b2712", RW[0], RW[2]], ["#8e8656", RW[1], RW[3]]], PS = [];
  lay.forEach(([c, w, a]) => RTD.forEach((d) => { const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", d);
    p.setAttribute("fill", "none"); p.setAttribute("stroke", c); p.setAttribute("stroke-opacity", a); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
    p.__w = w; sv.appendChild(p); PS.push(p); }));
  const fl = document.createElementNS("http://www.w3.org/2000/svg", "filter"); fl.setAttribute("id", "rtsoft"); fl.setAttribute("x", "-5%%"); fl.setAttribute("y", "-5%%"); fl.setAttribute("width", "110%%"); fl.setAttribute("height", "110%%");
  fl.innerHTML = '<feGaussianBlur stdDeviation="0.3"/>'; const df = document.createElementNS("http://www.w3.org/2000/svg", "defs"); df.appendChild(fl); sv.appendChild(df);
  const gg = document.createElementNS("http://www.w3.org/2000/svg", "g"); gg.setAttribute("filter", "url(#rtsoft)"); PS.forEach((p) => gg.appendChild(p)); sv.appendChild(gg);
  // timber bridges, ferries, landings (crossings.py) UNDER the road line, so the road runs on over the deck at the same weight
  ["bridges", "bb_ok", "bb_burned"].forEach((n) => { const bi = document.createElement("img"); bi.src = `assets/rt/${n}___BUILDID__.png`; bi.alt = ""; bi.id = "rt_" + n;
    bi.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none"; RTL.appendChild(bi); });
  RTL.appendChild(sv); RTSV = sv; RTL.appendChild(document.getElementById("rt_bb_burned"));   // the burned span sits ABOVE the road: the road breaks at the gap
  const rtApply = (k) => { PS.forEach((p) => p.setAttribute("stroke-width", (p.__w * k).toFixed(3))); fl.firstChild.setAttribute("stdDeviation", (0.35 * k).toFixed(3)); };
  CURV.push([{ setAttribute: (a, v) => rtApply(+v) }, 1]); rtApply(1 / CAM_S); }
Object.entries(RTM.towns).forEach(([k, T]) => { const im = document.createElement("img"); im.src = `assets/rt/town_${k}.png`; im.alt = "";
  im.style.cssText = `position:absolute;left:${T.left}px;top:${T.top}px;width:${T.w}px;height:${T.h}px`; RTL.insertBefore(im, RTSV); RTIMG[k] = im; });
// towns cut by the frame edge step out like labels (sprite + its label), smoothly as the camera moves
const RTLBL = {};
const rtEdge = () => Object.entries(RTM.towns).forEach(([k, T]) => { const x0 = CAM_X0 + T.left * CAM_S, y0 = CAM_Y0 + T.top * CAM_S, x1 = x0 + T.w * CAM_S, y1 = y0 + T.h * CAM_S;
  const m = Math.min(x0, y0, 1920 - x1, 1080 - y1), op = Math.max(0, Math.min(1, 1 + (m + 6) / 40)).toFixed(3);
  RTIMG[k].style.opacity = op; if (RTLBL[k]) RTLBL[k].style.opacity = op; });
CURV.push([{ setAttribute: () => rtEdge() }, 1]);
// reference-style town name (spaced cream serif on a gentle arc, beside the town; constant on screen)
const rtLabel = (k, t = 0, until = null) => { const T = RTM.towns[k], Lb = T.label;
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><img src="assets/rt/label_${k}.png" alt="" style="position:absolute;left:${(Lb.dx - Lb.ax).toFixed(1)}px;top:${(Lb.dy - Lb.ay).toFixed(1)}px;width:${Lb.w}px;height:${Lb.h}px;max-width:none"></div>`, T.c[0], T.c[1], { t: t > 0 ? t : null });
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); pinS(el); RTLBL[k] = el.querySelector("img"); rtEdge(); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el; };
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
rep('BAT("PORT GIBSON", PG, T_PG, T_12 + 0.6, -110, 40);', 'BATT("port_gibson", PG, T_PG, Math.min(T_12 + 0.6, T_PG + LBL_LIFE), [-26, -10]);')
rep('BAT("RAYMOND", RAY, T_RAY, T_14 + 0.6, -40, 46);', 'BATT("raymond", RAY, T_RAY, Math.min(T_14 + 0.6, T_RAY + LBL_LIFE), [-26, 12]);')
rep('BAT("JACKSON", JAX, T_JAX, T_16 + 0.6, 0, -46);', 'BATT("jackson", JAX, T_JAX, null, [-45, -27]);')
for a, b in [('arw({ pts: LL([[32.0, -90.92], [32.09, -90.72], [32.21, -90.50], [32.25, -90.43]])', 'arw({ pts: LL([[32.0, -90.92], [32.09, -90.72], [32.21, -90.50], [32.247, -90.452]])'), ('arw({ pts: LL([[32.25, -90.42], [32.29, -90.32], [32.30, -90.21]])', 'arw({ pts: LL([[32.25, -90.40], [32.29, -90.32], [32.297, -90.232]])'), ('B.move("rv", T_16 - 0.6, 1.2, ...L(32.36, -90.585)); B.move("re", T_16 - 0.5, 1.2, ...L(32.325, -90.59)); B.move("rs", T_16 - 0.5, 1.2, ...L(32.29, -90.595));', 'B.move("rv", T_16 - 0.6, 1.2, ...L(32.36, -90.565)); B.move("re", T_16 - 0.5, 1.2, ...L(32.325, -90.568)); B.move("rs", T_16 - 0.5, 1.2, ...L(32.29, -90.573));   // s12d_rt: ~30 px east so Edwards shows')]:
    rep(a, b)
rep('B.move("u17", T_17 + 0.1, 1.2, ...L(32.31, -90.64));', 'B.move("u17", T_17 + 0.1, 1.2, ...L(32.282, -90.68));   /* s12d_rt: off Edwards */')
rep('B.move("u13", T_17, 1.2, ...L(32.39, -90.66));', 'B.move("u13", T_17, 1.2, ...L(32.39, -90.638));   /* s12d_rt: off Pemberton card */')
rep('hatch("assets/media/gn_vick_may16cap_mx.png", T_CH + 0.5, 1.6);', 'hatch("assets/media/gn_vick_may16cap_mx.png", T_CH + 0.5, 0.2);   /* s12d_rt: form 1 ~2 s, mostly faded by the test frame */')
rep('BAT("CHAMPION HILL", CH, T_CH, T_17 + 0.6, 0, -50);', 'BAT("CHAMPION HILL", CH, T_CH, T_17 + 0.6, 0, -50, [1627, 719]);   /* s12d_rt polish: south foot of Champion Hill (~40 px below the lit crest), between the Jackson and Raymond roads */')
rep('smoke(LL([[32.335, -90.552], [32.33, -90.565], [32.29, -90.56]]), T_CH);', 'smoke([[1627, 719], [1620, 722], [1633, 724]], T_CH);   /* s12d_rt: powder smoke at the battle mark below the hill (it sat on the hill crest and read as a dark hole) */')
rep('BAT("BIG BLACK", BBR, T_BB, T_EVERY + 0.4, -40, 85, L(32.33, -90.722));', 'BAT("BIG BLACK", BBR, T_BB, T_EVERY + 0.4, -40, 85, L(32.33, -90.722));\n{ const ok = document.getElementById("rt_bb_ok"), bx = document.getElementById("rt_bb_burned"); gsap.set(bx, { autoAlpha: 0 });   /* s12d_rt: the Confederates burn the Big Black bridge */\n  tl.to(bx, { autoAlpha: 1, duration: 0.6 }, T_BB + 0.2); tl.to(ok, { autoAlpha: 0, duration: 0.6 }, T_BB + 0.2); }')
rep('{ const ph = GW.firstElementChild.querySelectorAll("img")[1]; tl.set(ph, { attr: { src: PHOTO("grant") } }, T_UG - 0.1); }   // the photo revealed ON "Ulysses Grant"\n', '')
rep('{ const nm = GW.firstElementChild.lastElementChild, n2 = document.createElement("div"); n2.textContent = "Ulysses Grant"; n2.style.cssText = nm.style.cssText + ";position:absolute;left:0;right:0;bottom:0;font-size:13px";\n  GW.firstElementChild.appendChild(n2); gsap.set(n2, { autoAlpha: 0 }); tl.to(nm, { autoAlpha: 0, duration: 0.15 }, T_UG - 0.1); tl.to(n2, { autoAlpha: 1, duration: 0.15 }, T_UG - 0.1);\n  nm.style.visibility = "inherit"; }', 'PC.reveal(GW, PHOTO("grant"), "Ulysses Grant", T_UG - 0.1);   /* s12d_rt: portrait card v2 reveal (research/style_tests/roads_towns/portraits) */')
src = src.replace("// SCRIPT-12 TEST, scene s12d", "// SCRIPT-12 TEST, scene s12d_rt = COPY of s12d + roads + painted towns (make_body.py in the roads_towns test); original s12d", 1)
src = src.replace("B.finish();", "window.__RT_T = { T_CH, T_17, T_16, T_BB };\nB.finish();")
import time
BID = str(int(time.time())); src = src.replace("__BUILDID__", BID); open(os.path.join(sys.argv[1], "buildid.txt"), "w").write(BID)
open(f"{G}/tools/s12_body_s12d_rt.js", "w").write(src)
print("ok", len(src) // 1024, "KB")
