// MOVE 3d (move3-9), Stonewall Jackson #11: the result of Chancellorsville, 3-6 May 1863. Basemap nova_hd_ref (z10), option 1
// (control nova3_apr30 -> nova3_may6, tools/make_nova3_control.py), the wide shot again after the move3b/c close-up.
//   move3-9  dawn 3 May: Stuart (commanding Jackson's corps) + Lee converge on Chancellorsville, the ring flips blue; by 6 May Hooker
//            retreats north over the Rappahannock at US Ford (stamp RETREAT); CASUALTY card (campaign, ABT): UNION 17,304 ·
//            CONFEDERATE 13,460 (~22% OF LEE'S ARMY); Jackson badge greyed ("one man he could not replace"); JACKSON'S METHOD line 3
// Built with: python3 tools/build_scene.py move3d nova_hd_ref move3-9 move3-9
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
const PHOTO = { jackson: "assets/media/jackson_head.png", hooker: "assets/media/hooker_head.png" };
const M9 = "move3-9";
const T_NEXT = at(M9, "The next day"), T_DROVE = at(M9, "drove Hooker out"), T_DAYS = at(M9, "within days"), T_LOST = at(M9, "The Union lost"),
  T_LEE = at(M9, "Lee lost about"), T_FIFTH = at(M9, "more than a fifth"), T_ONE = at(M9, "and one man"), T_HIT = at(M9, "Hit the weakest part");

ctlImg("assets/media/nova3_apr30_mx.png", 0, T_DAYS + 1.2, 0.01);
ctlImg("assets/media/nova3_may6_mx.png", T_DAYS + 0.2, null, 1.0);
B.image("assets/media/nova_geo_ref.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.18 }); LV.scaleBar(119.47); LV.north();
B.camera([[0, 1500, 1060, 3.6], [T_DAYS - 0.3, 1500, 1055, 3.4], [T_DAYS + 1.6, 1530, 1030, 2.4], [END, 1535, 1030, 2.3]]);
B.showDate(0.1); B.date("3 MAY 1863", 0.2, T_DAYS - 0.1, 32); B.date("6 MAY 1863", T_DAYS, null, 32);
legend(0.2, END + 1, false);
flag(FL.us, "UNITED STATES", ...L(38.43, -77.47), 0.3, END + 1, 40);
flag(FL.cs, "CONFEDERATE STATES", ...L(38.22, -77.78), 0.4, END + 1, 40);
const CH = L(38.3095, -77.634), FB = L(38.3032, -77.4605);
const F30 = NF_APR30.map((pts, k) => K.front({ pts, sideA: "rome", sideB: "carth", t: 0, dur: 0.01, width: 5, until: T_DAYS + 0.8 }));
const F6 = K.front({ pts: NF_APR28[0], sideA: "rome", sideB: "carth", t: T_DAYS + 0.6, dur: 1.4, width: 5, until: END + 1 });
B.city("", CH[0], CH[1], { r: 2, t: 0 }); box("CHANCELLORSVILLE", CH[0] + 2, CH[1] + 9, 0.1, 6.5, END + 1, { sfx: false });
// dawn 3 May: Stuart (Jackson's corps) from the west, Lee from the south-east, converge on Chancellorsville
GG.dawn(0, 6);
unit("hk", "rome", [CH[0] + 4, CH[1] - 12], "infantry", "HOOKER", { t: 0.1, w: 16, h: 11, tag: 5, size: "XXXX" });
unit("stu", "carth", L(38.315, -77.70), "cavalry", "STUART", { t: 0.2, w: 14, h: 9, tag: 5, size: "XXX" });
unit("lee", "carth", L(38.285, -77.58), "infantry", "LEE", { t: 0.3, w: 14, h: 9, tag: 5, size: "XXX" });
arw({ pts: LL([[38.315, -77.69], [38.312, -77.66], [38.310, -77.643]]), side: "carth", t: T_NEXT, dur: 1.2, width: 4, until: T_DAYS + 1.0 });
arw({ pts: LL([[38.288, -77.585], [38.298, -77.61], [38.306, -77.628]]), side: "carth", t: T_NEXT + 0.3, dur: 1.2, width: 4, until: T_DAYS + 1.0 });
B.move("stu", T_NEXT + 0.2, 1.6, CH[0] - 10, CH[1] + 2); B.move("lee", T_NEXT + 0.4, 1.6, CH[0] + 4, CH[1] + 10);
for (let k = 0; k < 3; k++) K.impact(CH[0] - 4 + k * 4, CH[1] - 2 + (k % 2) * 3, T_DROVE - 0.4 + k * 0.35, { r: 3 });
const RING = GG.pin(`<div class="rg" style="width:30px;height:30px;border-radius:50%;border:3px solid #c4121f;box-shadow:0 0 12px #c4121f, inset 0 0 8px #c4121f"></div>`, CH[0], CH[1], { t: 0.2, pop: true, until: END + 1 });
B.tl.to(RING.querySelector(".rg"), { borderColor: "#1f4fc4", boxShadow: "0 0 12px #4f7fff, inset 0 0 8px #4f7fff", duration: 0.3 }, T_DROVE + 0.6);
B.tl.fromTo(RING, { scale: 1.4 }, { scale: 1, duration: 0.35, immediateRender: false }, T_DROVE + 0.6); SFX("hit", T_DROVE + 0.65);
B.caption("3 MAY: HOOKER DRIVEN OUT OF CHANCELLORSVILLE", T_DROVE, T_DAYS - 0.1, "carth");
// within days: Hooker retreats north over the river (US Ford, night 5-6 May)
B.move("hk", T_DROVE + 0.4, 1.2, ...L(38.33, -77.625));
arw({ pts: LL([[38.33, -77.625], [38.355, -77.615], [38.39, -77.60]]), side: "rome", t: T_DAYS, dur: 1.2, width: 5, until: END + 1 });
B.move("hk", T_DAYS + 0.3, 1.4, ...L(38.40, -77.60));
box("US FORD", ...L(38.369, -77.592), T_DAYS + 0.2, 6, END + 1, { bg: "#dcecf8" });
GG.stamp("RETREAT · 6 MAY", T_DAYS + 0.4, T_LOST - 0.1, { size: 58, top: 840 });
// casualty card (ABT, the whole campaign incl. Salem Church): real numbers only
const CC = scr(`<div style="padding:24px 50px 26px;background:rgba(18,16,12,0.94);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:22px;letter-spacing:.3em;color:#c9b48a;text-align:center;margin-bottom:14px">CASUALTIES · THE CHANCELLORSVILLE CAMPAIGN</div>
  <div style="display:flex;gap:70px">
  <div class="c0" style="min-width:300px"><div style="display:flex;align-items:center;gap:12px;padding-bottom:8px;margin-bottom:8px;border-bottom:3px solid #c4121f"><img src="${FL.us}" style="height:34px;border:1px solid #f7f3ea"><div style="font-size:30px;letter-spacing:.08em">UNION</div></div><div style="font-size:64px">17,304</div></div>
  <div class="c1" style="min-width:300px"><div style="display:flex;align-items:center;gap:12px;padding-bottom:8px;margin-bottom:8px;border-bottom:3px solid #1f4fc4"><img src="${FL.cs}" style="height:34px;border:1px solid #f7f3ea"><div style="font-size:30px;letter-spacing:.08em">CONFEDERATE</div></div><div style="font-size:64px">13,460</div><div class="pc" style="font-size:24px;letter-spacing:.12em;color:#9fc0ea">~22% OF LEE'S ARMY</div></div></div>
  <div style="font-size:15px;letter-spacing:.2em;color:#a8a294;text-align:center;margin-top:12px">KILLED, WOUNDED, MISSING · SOURCE: AMERICAN BATTLEFIELD TRUST</div></div>`,
  "left:0;right:0;top:170px;display:flex;justify-content:center;", T_LOST - 0.2, T_HIT - 0.3);
B.tl.fromTo(CC.querySelector(".c1"), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4, immediateRender: false }, T_LEE - 0.1);
B.tl.fromTo(CC.querySelector(".pc"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, T_FIFTH);
SFX("hit", T_LOST); SFX("hit", T_LEE); SFX("tick", T_FIFTH);
// one man he could not replace
const JB = badge({ name: "STONEWALL JACKSON", role: "ONE MAN LEE COULD NOT REPLACE", initials: "TJJ", photo: PHOTO.jackson, flag: FL.cs, side: "carth", corner: "bl", t: T_ONE - 0.2, until: END + 1 });
B.tl.to(JB.querySelector("img"), { filter: "grayscale(1) brightness(0.55)", duration: 0.8 }, T_ONE + 0.4);
// the method, line 3
GG.METHOD = ["MOVE FAST", "MYSTIFY", "HIT THE WEAKEST PART"];
GG.METHOD_TITLE = "JACKSON'S METHOD";
const mc = GG.method(3, T_HIT - 0.4, END + 1, [T_HIT - 0.3, T_HIT - 0.2, T_HIT]);
mc.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "56px"; });
const rows = mc.querySelectorAll(".row");
B.tl.fromTo(rows[2], { scale: 1 }, { scale: 1.07, color: "#8fb2ff", duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, T_HIT + 0.2);
SFX("ref:boom", T_HIT + 0.2);
fixImgs();
K.raiseTerritory();
B.finish();
