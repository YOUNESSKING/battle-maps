// MOVE 3a (move3-1), Stonewall Jackson #11: Chancellorsville, the set-up (late April 1863). Basemap nova_hd_ref (z10, move-2 agent's map +
// geography layer, read-only), option 1 (multiply control overlays nova3_apr28 -> nova3_apr30, tools/make_nova3_control.py).
//   move3-1  title MOVE 3 · CHANCELLORSVILLE · MAY 1863; wide: Lee ~60,000 at Fredericksburg, Hooker ~130,000 across the river (badge),
//            count cards 130,000 vs 60,000; Longstreet's 2 divisions away near Suffolk (grey arrow off the map); Hooker leaves Sedgwick
//            facing Fredericksburg (crossing below the town), swings the rest upriver over the Rappahannock (Kelly's Ford) and the Rapidan
//            (Germanna + Ely's Fords; II Corps via US Ford) down behind Lee to CHANCELLORSVILLE (dotted red arrows, push-in, 30 Apr control)
// Built with: python3 tools/build_scene.py move3a nova_hd_ref move3-1 move3-1
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const PR = GG.proj(10, 73052, 99749);
const L = (lat, lon) => PR(lat, lon);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
// @@KIT
// ---------- move-3 kit (tools/make_chanc_inline.py) ----------
const FL = { us: "assets/media/us34_flag.png", cs: "assets/media/csa1_13_flag.png" };
const FALLBACK = { "nova_geo_ref.png": null };   // move-2 agent's nova geography layer: hidden if not baked yet
const fixImgs = () => document.querySelectorAll("img").forEach((im) => {
  const f = (im.getAttribute("src") || "").split("/").pop(); if (!(f in FALLBACK)) return;
  im.addEventListener("error", () => { if (FALLBACK[f]) im.src = "assets/media/" + FALLBACK[f]; else im.style.display = "none"; }, { once: true });
  if (im.complete && !im.naturalWidth) im.style.display = "none"; });
const SCN = document.getElementById("scene");
document.head.insertAdjacentHTML("beforeend", "<style>.place.road{color:#efe3c4;font-weight:500;font-style:italic;letter-spacing:.16em;text-shadow:0 1px 4px rgba(0,0,0,.9)}</style>");
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.2em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.55).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w / 5.2).toFixed(1)}px;color:#f7f3ea;text-shadow:0 ${w * 0.02}px ${w * 0.04}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t, pop: true, until });
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t, label });
  K.counter(id, { icon: icon === "cavalry" ? "infantry" : icon, flag: o.flag || (side === "carth" ? FL.cs : FL.us), size: o.size });
  if (icon === "cavalry") cavIcon(id, { flip: o.flip });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");   // casing scaled to the width
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1)); if (o.dash) ps[0].setAttribute("stroke-dasharray", o.dash);
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(1)); return g; };
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "CONFEDERATE"], ["#be3a2a", "#bc2528", "UNION"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const ctlImg = (file, t, until, dur = 1.0) => { const el = B.image(file, 0, 0, 2880, 1620, { t, dur, until }); el.style.mixBlendMode = "multiply"; return el; };
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
// artillery shot: the gun fires (quiet), shell arc, the impact carries the boom + the locked shake
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 1.0;
  GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.2, h: o.h, impact: false, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: 2 });
};
const badge = (o) => {   // K.badge + initials under the photo (shown if the photo file is missing)
  const el = K.badge(o), ring = el.querySelector("div[style*='border-radius:50%']"), img = ring.querySelector("img");
  if (img) { const ini = document.createElement("div"); ini.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.78) 0%, rgba(10,12,24,0.45) 100%);font-size:60px;font-weight:700;color:#f7f3ea;text-shadow:0 3px 6px #000";
    ini.textContent = o.initials || ""; ring.insertBefore(ini, img); img.addEventListener("error", () => { img.style.display = "none"; }); }
  return el;
};
const glowPath = (pts, col, w, t, until, pulses = 3, op = 0.95) => {   // glowing stroke (river, road, route), pulses then holds
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); p.style.filter = `drop-shadow(0 0 ${w}px ${col})`;
  svg.insertBefore(p, svg.firstChild); gsap.set(p, { opacity: 0 });
  B.tl.to(p, { opacity: op, duration: 0.5 }, t); if (pulses) B.tl.to(p, { opacity: op * 0.45, duration: 0.5, yoyo: true, repeat: pulses, ease: "sine.inOut" }, t + 0.5);
  if (until != null) B.tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const scr = (html, css, t, until, from = { autoAlpha: 0, y: 30 }) => {   // screen-space element (above the map, under the credit)
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);
  B.tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out" }, t); if (until != null) B.tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el;
};
const xMark = (x, y, t, until, s = 40) => GG.pin(`<svg width="${s}" height="${s}" viewBox="0 0 40 40"><path d="M6 6 L34 34 M34 6 L6 34" stroke="#c4121f" stroke-width="7" stroke-linecap="round"/><path d="M6 6 L34 34 M34 6 L6 34" stroke="#f3eee2" stroke-width="2.5" stroke-linecap="round"/></svg>`, x, y, { t, pop: true, until });
// a dotted trail drawn along a path over [t, t + dur] (the march route)
const trail = (pts, col, w, t, dur, until, dash = "2 9") => {
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
  p.style.filter = `drop-shadow(0 0 ${w * 0.8}px ${col})`; svg.appendChild(p);
  let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
  const m = document.createElementNS("http://www.w3.org/2000/svg", "mask"), id = "trm" + (window.__trm = (window.__trm || 0) + 1);
  m.setAttribute("id", id); m.setAttribute("maskUnits", "userSpaceOnUse");
  const mp = p.cloneNode(); mp.setAttribute("stroke", "#fff"); mp.style.filter = ""; mp.setAttribute("stroke-width", w * 4); mp.removeAttribute("stroke-dasharray");
  m.appendChild(mp); svg.appendChild(m); p.setAttribute("stroke-dasharray", dash); p.setAttribute("mask", `url(#${id})`);
  gsap.set(mp, { strokeDasharray: `${Lt} ${Lt + 20}`, strokeDashoffset: Lt }); gsap.set(p, { opacity: 0 });
  B.tl.set(p, { opacity: 1 }, t); B.tl.to(mp, { strokeDashoffset: 0, duration: dur, ease: "none" }, t);
  if (until != null) B.tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
// a unit (or pin) moving along a polyline: keyframes every ~1/12 of the way, so it follows the road
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
const pinAlong = (el, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n); } };
// a counter that ticks up (screen space, gold), e.g. "12+ MILES"
const ticker = (label, to, suffix, css, t, dur, until, n = 8) => {
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    <div style="font-size:18px;letter-spacing:.3em;color:#c9b48a">${label}</div><div class="v" style="font-size:54px;letter-spacing:.04em">0${suffix}</div></div>`, css, t, until);
  const v = el.querySelector(".v"), st = { x: 0 };
  B.tl.to(st, { x: to, duration: dur, ease: "none", onUpdate: () => { v.textContent = Math.round(st.x).toLocaleString("en-US") + suffix; } }, t + 0.2);
  for (let k = 0; k < n; k++) SFX("tick", t + 0.2 + (k * dur) / n);
  return el;
};
// cavalry counter icon (MOVE 1 agent's scenes-src/cavalry_icon.js, TEST icon: owner to approve)
const CAV_SVG = `<g fill="#f7f3ea" stroke="none">
  <path d="M25 43 C16 41 9 47 5 56 C11 52 17 50 24 50 Z"/>
  <path d="M24 44 C28 37 40 36 52 38 L66 37 C70 34 74 28 78 22 L84 17 L86 11 L88.5 18.5 L96 29 L94.5 34.5 L88 33 L82.5 32 C80.5 38 78.5 44 76.5 48 C76.5 54 72 58 66 58 L36 58 C30 58 25 54 24 48 Z"/>
  <path d="M46 38.5 L54 38.5 L58 23 L47.5 20 Z"/>
  <circle cx="52" cy="14" r="5"/><ellipse cx="51.5" cy="9.6" rx="7" ry="2.2"/></g>
  <g fill="none" stroke="#f7f3ea" stroke-linecap="round" stroke-linejoin="round">
  <path d="M69 55 L81 63 L90 61" stroke-width="5"/><path d="M64 56 L73 66 L72 75" stroke-width="5"/>
  <path d="M35 55 L23 63 L13 65" stroke-width="5"/><path d="M41 56 L37 68 L41 76" stroke-width="5"/>
  <path d="M51 35 L59 43 L57 51" stroke-width="5"/>
  <path d="M54 25 L65 20" stroke-width="4.5"/><path d="M65 20 L79 3" stroke-width="2.6"/></g>`;
const cavIcon = (id, o = {}) => {
  const sv = B.units[id].el.querySelector(".blk svg");
  sv.setAttribute("viewBox", "0 0 100 80"); sv.setAttribute("preserveAspectRatio", "xMidYMid meet");
  sv.innerHTML = o.flip ? `<g transform="translate(100 0) scale(-1 1)">${CAV_SVG}</g>` : CAV_SVG;
};
// ---------- end of kit ----------
// @@END-KIT
// @@DATA
// map data (tools/make_chanc_inline.py; fronts from tools/make_nova3_control.py)
const NF_APR28 = [[[1381.8, 920.7], [1381.7, 924.4], [1385.9, 928.7], [1385.9, 929.8], [1384.0, 931.5], [1383.6, 932.7], [1385.3, 936.8], [1386.4, 938.2], [1396.0, 942.7], [1395.7, 950.2], [1396.5, 954.1], [1395.5, 959.6], [1396.7, 963.3], [1398.7, 965.0], [1400.2, 969.1], [1401.7, 970.7], [1403.3, 971.7], [1410.5, 972.8], [1411.6, 973.6], [1414.4, 984.2], [1416.4, 984.8], [1418.9, 984.2], [1421.9, 979.4], [1426.5, 977.3], [1432.5, 975.4], [1437.0, 977.0], [1439.2, 976.9], [1440.2, 976.3], [1441.8, 972.9], [1447.8, 971.7], [1451.6, 972.6], [1453.6, 974.1], [1459.0, 974.6], [1463.6, 977.9], [1470.6, 980.0], [1484.8, 988.1], [1488.2, 987.6], [1489.7, 990.0], [1488.6, 997.6], [1490.0, 999.5], [1489.4, 1002.7], [1490.3, 1003.5], [1496.1, 1005.2], [1497.4, 1006.3], [1499.6, 1011.1], [1498.4, 1012.8], [1498.2, 1014.2], [1499.8, 1018.2], [1498.9, 1021.8], [1499.7, 1023.4], [1499.9, 1026.2], [1501.1, 1027.7], [1504.4, 1029.5], [1506.6, 1035.8], [1511.7, 1043.9], [1510.8, 1049.6], [1508.7, 1054.1], [1509.0, 1055.6], [1511.1, 1058.5], [1512.9, 1059.1], [1514.5, 1058.6], [1520.2, 1052.2], [1524.2, 1046.2], [1526.4, 1045.4], [1529.2, 1045.8], [1534.4, 1044.9], [1537.7, 1047.4], [1535.8, 1053.0], [1536.5, 1055.9], [1539.2, 1057.3], [1544.0, 1058.0], [1553.2, 1065.9], [1556.1, 1075.5], [1560.7, 1079.6], [1565.3, 1080.9], [1566.9, 1080.4], [1566.6, 1075.3], [1565.3, 1072.6], [1565.7, 1070.9], [1567.4, 1069.2], [1573.8, 1067.5], [1576.3, 1065.7], [1582.2, 1064.8], [1585.1, 1065.0], [1588.5, 1066.2], [1594.1, 1069.4], [1599.5, 1074.2], [1601.7, 1073.7], [1603.6, 1070.4], [1604.5, 1069.9], [1606.5, 1071.1], [1611.1, 1072.3], [1612.6, 1074.3], [1613.6, 1079.5], [1617.7, 1084.5], [1624.8, 1103.7], [1626.3, 1105.4], [1629.9, 1105.7], [1631.2, 1106.7], [1632.6, 1113.0], [1634.2, 1115.9], [1635.7, 1117.2], [1639.4, 1118.5], [1641.4, 1120.4], [1645.2, 1129.1], [1655.1, 1131.9], [1662.3, 1137.5], [1666.9, 1140.0], [1670.6, 1139.8], [1672.7, 1136.4], [1676.1, 1135.8], [1678.8, 1137.0], [1683.6, 1142.0], [1687.2, 1142.8], [1688.8, 1142.2], [1697.0, 1134.1], [1701.3, 1133.0], [1705.3, 1135.2], [1707.3, 1138.7], [1709.4, 1140.2], [1716.1, 1141.6], [1718.2, 1143.1], [1721.5, 1145.8], [1723.7, 1149.8], [1724.6, 1150.4], [1726.9, 1149.3]]];
const NF_APR30 = [[[1382.3, 1034.0], [1411.5, 1057.2], [1440.6, 1069.2], [1462.4, 1078.5], [1484.3, 1089.7], [1506.1, 1089.7], [1524.3, 1073.0], [1524.3, 1047.9]], [[1544.0, 1058.0], [1553.2, 1065.9], [1556.1, 1075.5], [1560.7, 1079.6], [1565.3, 1080.9], [1566.9, 1080.4], [1566.6, 1075.3], [1565.3, 1072.6], [1565.7, 1070.9], [1567.4, 1069.2], [1573.8, 1067.5], [1576.3, 1065.7], [1582.2, 1064.8], [1585.1, 1065.0], [1588.5, 1066.2], [1594.1, 1069.4], [1599.5, 1074.2], [1601.7, 1073.7], [1603.6, 1070.4], [1604.5, 1069.9], [1606.5, 1071.1], [1611.1, 1072.3], [1612.6, 1074.3], [1613.6, 1079.5], [1617.7, 1084.5], [1624.8, 1103.7], [1626.3, 1105.4], [1629.9, 1105.7], [1631.2, 1106.7], [1632.6, 1113.0], [1634.2, 1115.9], [1635.7, 1117.2], [1639.4, 1118.5], [1641.4, 1120.4], [1645.2, 1129.1], [1655.1, 1131.9], [1662.3, 1137.5], [1666.9, 1140.0], [1670.6, 1139.8], [1672.7, 1136.4], [1676.1, 1135.8], [1678.8, 1137.0], [1683.6, 1142.0], [1687.2, 1142.8], [1688.8, 1142.2], [1697.0, 1134.1], [1701.3, 1133.0], [1705.3, 1135.2], [1707.3, 1138.7], [1709.4, 1140.2], [1716.1, 1141.6], [1718.2, 1143.1], [1721.5, 1145.8], [1723.7, 1149.8], [1724.6, 1150.4], [1726.9, 1149.3]]];
// @@END-DATA
const PHOTO = { hooker: "assets/media/hooker_head.png", lee: "assets/media/lee_head.png", longstreet: "assets/media/longstreet_head.png" };
const M1 = "move3-1";
const T_HOOK = at(M1, "Joseph Hooker"), T_BIG = at(M1, "the biggest army"), T_130 = at(M1, "about a hundred and thirty"),
  T_LEE = at(M1, "Lee had some sixty"), T_LONG = at(M1, "because Longstreet"), T_PART = at(M1, "Hooker left part"),
  T_SWING = at(M1, "and swung the rest"), T_ACROSS = at(M1, "across the Rappahannock"), T_RAPI = at(M1, "and the Rapidan"),
  T_DOWN = at(M1, "and down behind Lee"), T_CROSS = at(M1, "a crossroads called");

// ---------- map layers: territory (multiply), geography, living map ----------
const C28 = ctlImg("assets/media/nova3_apr28_mx.png", 0, T_DOWN + 0.6, 0.01);
const C30 = ctlImg("assets/media/nova3_apr30_mx.png", T_DOWN - 0.2, null, 1.0);
B.image("assets/media/nova_geo_ref.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.2 }); LV.scaleBar(119.47); LV.north();
B.label("RAPIDAN", ...L(38.335, -77.86), { cls: "river", size: 9, t: T_RAPI - 0.4, rot: 14 });

// ---------- camera: wide (Washington - Fredericksburg) -> push in on the fords and Chancellorsville ----------
B.camera([[0, 1640, 890, 1.15], [T_PART - 0.6, 1610, 930, 1.3], [T_SWING + 0.6, 1525, 1000, 2.9], [T_DOWN, 1505, 1030, 3.3],
  [END, 1500, 1060, 3.6]]);
B.showDate(0.1); B.date("APRIL 1863", 0.2, T_DOWN - 0.2, 34); B.date("30 APRIL 1863", T_DOWN - 0.1, null, 34);
B.title("MOVE 3", "CHANCELLORSVILLE", "MAY 1863", 0.3, 4.4); SFX("ref:boom", 0.4);
legend(0.4, END + 1, false);

// ---------- the powers + the armies on screen from the first second ----------
const WIDE_UNTIL = T_SWING + 0.3;
flag(FL.us, "UNITED STATES", ...L(38.78, -77.20), 0.5, WIDE_UNTIL, 100);
flag(FL.cs, "CONFEDERATE STATES", ...L(38.15, -77.95), 0.65, WIDE_UNTIL, 100);
const FB = L(38.3032, -77.4605), FAL = L(38.324, -77.468), CH = L(38.3095, -77.634);
B.city("", FB[0], FB[1], { r: 3, t: 0.3 });
const F28 = K.front({ pts: NF_APR28[0], sideA: "rome", sideB: "carth", t: 0.2, dur: 1.4, width: 6, until: T_DOWN + 0.4 });
unit("hk", "rome", [FAL[0] - 10, FAL[1] - 44], "infantry", "HOOKER ~130,000", { t: 0.2, w: 58, h: 38, tag: 14, size: "XXXX" });
const LEE0 = L(38.24, -77.52); unit("lee", "carth", LEE0, "infantry", "LEE ~60,000", { t: 0.35, w: 46, h: 30, tag: 13, size: "XXXX" });
B.move("hk", 0.5, 2.4, FAL[0] - 4, FAL[1] - 34);
B.tl.to(B.units.lee.el, { scale: 1.12, duration: 0.4, yoyo: true, repeat: 3 }, 1.0);
// Hooker: new commander (badge, real photo)
badge({ name: "JOSEPH HOOKER", role: "ARMY OF THE POTOMAC · SPRING 1863", initials: "JH", photo: PHOTO.hooker, flag: FL.us, side: "rome", corner: "tr", t: T_HOOK - 0.3, until: T_LEE - 0.2 });
// count cards: 130,000 vs 60,000
const cnt = (n, lbl, col, css, t, until) => ticker(lbl, n, "", css, t, 1.4, until, 6);
cnt(130000, "UNION · ARMY OF THE POTOMAC", "#c4121f", "left:0;right:0;top:150px;display:flex;justify-content:center;", T_130 - 0.2, T_LONG - 0.2);
B.caption("THE BIGGEST UNION ARMY YET IN VIRGINIA", T_BIG, T_LEE - 0.2, "rome");
cnt(60000, "CONFEDERATE · LEE · OUTNUMBERED 2 TO 1", "#1f4fc4", "left:0;right:0;top:150px;display:flex;justify-content:center;", T_LEE - 0.1, T_PART - 0.3);
// Longstreet away with two divisions near Suffolk (off the map to the south-east)
const LG = arw({ pts: LL([[38.22, -77.47], [38.12, -77.36], [38.02, -77.22]]), side: "white", t: T_LONG, dur: 1.2, width: 7, until: T_SWING });
B.tl.set(LG, { opacity: 0.7 }, T_LONG);
box("LONGSTREET · 2 DIVISIONS · TO SUFFOLK", ...L(38.10, -77.06), T_LONG + 0.4, 13, T_SWING, { bg: "#d8d4c8" });
badge({ name: "LONGSTREET", role: "AWAY IN SOUTHERN VIRGINIA", initials: "JL", photo: PHOTO.longstreet, flag: FL.cs, side: "carth", corner: "bl", t: T_LONG - 0.1, until: T_PART + 0.2 });
// Hooker leaves part of the army facing Fredericksburg (Sedgwick: crosses below the town, 29 Apr)
unit("sed", "rome", L(38.345, -77.43), "infantry", "SEDGWICK", { t: T_PART, w: 24, h: 16, tag: 8, size: "XXX" });
arw({ pts: LL([[38.33, -77.43], [38.29, -77.425], [38.272, -77.425]]), side: "rome", t: T_PART + 0.5, dur: 0.8, width: 2.6, until: END + 1 });
box("PART OF THE ARMY STAYS", ...L(38.40, -77.40), T_PART + 0.3, 9, T_SWING + 1.0);
// the swing: upriver to Kelly's Ford, over the Rappahannock, over the Rapidan (Germanna, Ely's), down to Chancellorsville; II Corps via US Ford
B.move("hk", T_SWING, 0.6, FAL[0] - 30, FAL[1] - 18);
const SW1 = LL([[38.33, -77.50], [38.40, -77.58], [38.45, -77.68], [38.477, -77.765], [38.43, -77.79], [38.378, -77.788], [38.335, -77.70], [38.312, -77.645]]);
const SW2 = LL([[38.45, -77.70], [38.40, -77.70], [38.372, -77.692], [38.33, -77.655]]);
const SW3 = LL([[38.33, -77.50], [38.37, -77.56], [38.373, -77.613], [38.33, -77.635]]);
arw({ pts: SW1, side: "rome", t: T_SWING + 0.1, dur: 3.4, width: 3.6, dash: "9 6", until: END + 1 });
arw({ pts: SW2, side: "rome", t: T_RAPI - 0.2, dur: 1.6, width: 3, dash: "8 6", until: END + 1 });
arw({ pts: SW3, side: "rome", t: T_RAPI + 0.4, dur: 1.6, width: 3, dash: "8 6", until: END + 1 });
const MV = unit("hm", "rome", SW1[0], "infantry", null, { t: T_SWING, w: 16, h: 11, size: "XXX" });
along("hm", SW1, T_SWING + 0.2, T_DOWN + 0.6 - T_SWING);
const fd = (nm, la, lo, t, dx = 0, dy = -9) => { const p = L(la, lo); box(nm, p[0] + dx, p[1] + dy, t, 5.5, END + 1, { bg: "#dcecf8" }); };
fd("KELLY'S FORD", 38.477, -77.765, T_ACROSS - 0.2, -18, -8);
fd("GERMANNA FORD", 38.378, -77.788, T_RAPI - 0.1, -22, 6); fd("ELY'S FORD", 38.372, -77.692, T_RAPI + 0.2, -6, -8);
fd("US FORD", 38.369, -77.610, T_RAPI + 0.5, 14, -6);
B.caption("HOOKER SWINGS AROUND LEE'S LEFT", T_SWING, T_CROSS - 0.2, "rome");
// down behind Lee: Chancellorsville (ring), the 30 Apr ground
const F30 = NF_APR30.map((pts, k) => K.front({ pts, sideA: "rome", sideB: "carth", t: T_DOWN + 0.2 + k * 0.2, dur: 1.2, width: 5, until: END + 1 }));
K.target(CH[0], CH[1], T_CROSS, { r: 9, until: END + 1 });
B.city("", CH[0], CH[1], { r: 2, t: T_CROSS - 0.2 }); box("CHANCELLORSVILLE", CH[0] + 2, CH[1] + 9, T_CROSS + 0.1, 6.5, END + 1);
B.move("lee", T_SWING + 0.4, 1.0, FB[0] - 6, FB[1] + 16);
B.tl.to(B.units.lee.el, { scale: 0.34, duration: 1.0 }, T_SWING + 0.4);
B.tl.to(B.units.hk.el, { scale: 0.34, duration: 1.0 }, T_SWING + 0.4);
flag(FL.us, "UNITED STATES", ...L(38.42, -77.45), T_SWING + 1.0, END + 1, 36);
flag(FL.cs, "CONFEDERATE STATES", ...L(38.29, -77.82), T_SWING + 1.2, END + 1, 36);
B.caption("30 APRIL: THE UNION ARMY BEHIND LEE", T_CROSS - 0.1, END + 1, "rome");
fixImgs();
K.raiseTerritory();
B.finish();
