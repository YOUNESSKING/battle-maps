// breakout-b: Dec 6-7 1950, the column fights from Hagaru-ri to Koto-ri (breakout-3).
// Locked style: the MOVING column with a moving two-colour front on each flank (K.front to + moveT, in three hops that
// follow the column), infantry arrows up the ridges, Corsair bombing runs (exact Harrier recipe) + smoke on the hit ridges.
// ---------- projection (assets/chosin_close.json: zoom 12) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 12, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 893344).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 394786).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const tl = B.tl;
const K = FXK(B);
// sound: whoosh on big camera zooms (scale x1.6 or more within 6 s), at the fastest point of the move
const camSfx = (keys) => { for (let i = 1; i < keys.length; i++) { const r = keys[i][3] / keys[i - 1][3], d = keys[i][0] - keys[i - 1][0];
  /* no zoom sound on ordinary camera moves (owner 2026-09-30: only the biggest moves) */ } return keys; };

// ================= scene-local helpers (shared by the breakout / ending scenes; no engine change) =================
const NS = "http://www.w3.org/2000/svg";
const OV = document.getElementById("overlay"), PINS = document.getElementById("pins"), SCENE = document.getElementById("scene");
const smooth = (pts, n = 12) => { // Catmull-Rom sampled into a dense polyline (pure math, build time)
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    for (let s = 0; s < n; s++) {
      const t = s / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  out.push(pts[pts.length - 1].slice());
  return out;
};
const poly = (pts) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, L, len: L[L.length - 1] }; };
const posAt = (Q, d) => {
  d = Math.max(0, Math.min(Q.len, d));
  let i = 1; while (i < Q.L.length - 1 && Q.L[i] < d) i++;
  const a = Q.pts[i - 1], b = Q.pts[i], k = (d - Q.L[i - 1]) / ((Q.L[i] - Q.L[i - 1]) || 1);
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, Math.atan2(b[1] - a[1], b[0] - a[0])];
};
const normAt = (Q, d, off) => { const [x, y, a] = posAt(Q, d); return [x - Math.sin(a) * off, y + Math.cos(a) * off]; };
const dNear = (Q, pt) => { let b = 1e9, d = 0; Q.pts.forEach((p, i) => { const e = Math.hypot(p[0] - pt[0], p[1] - pt[1]); if (e < b) { b = e; d = Q.L[i]; } }); return d; };
const sub = (Q, d0, d1) => poly(Q.pts.filter((_, i) => Q.L[i] >= d0 - 1e-6 && Q.L[i] <= d1 + 1e-6));
const offLine = (Q, d0, d1, off, n = 7) => Array.from({ length: n }, (_, i) => normAt(Q, d0 + (d1 - d0) * i / (n - 1), off).map((v) => +v.toFixed(1)));
const lineD = (pts) => "M " + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L ");
let maskN = 0;
const road = (Q, o = {}) => { // road drawn on along a dense polyline (mask reveal keeps dashes intact)
  const g = document.createElementNS(NS, "g"), mid = "bomask" + (++maskN), w = o.w || 9, d = lineD(Q.pts);
  g.innerHTML = `<mask id="${mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="2880" height="1620"><path d="${d}" fill="none" stroke="#fff" stroke-width="${w + 40}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${Q.len + 5} ${Q.len + 5}" stroke-dashoffset="${Q.len + 5}"/></mask>
    <g mask="url(#${mid})"><path d="${d}" fill="none" stroke="${o.casing || "rgba(26,20,12,0.8)"}" stroke-width="${w + 7}" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="rd" d="${d}" fill="none" stroke="${o.color || "#f4e9cb"}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""}/></g>`;
  OV.appendChild(g);
  tl.to(g.querySelector("mask path"), { strokeDashoffset: 0, duration: o.dur || 2, ease: o.ease || "power1.inOut" }, o.t || 0);
  if (o.until != null) tl.to(g, { autoAlpha: 0, duration: 0.6 }, o.until);
  return g;
};
const follow = (id, Q, t, dur, d0, d1, ease = "power1.inOut") => { // unit rides along a polyline
  const u = B.units[id], pr = { d: d0 };
  tl.to(pr, { d: d1, duration: dur, ease, onUpdate: () => { const [x, y] = posAt(Q, pr.d); gsap.set(u.el, { left: x - u.w / 2, top: y - u.h / 2 }); } }, t);
};
const svgEl = (html, t, until, dur = 0.5) => { const g = document.createElementNS(NS, "g"); g.innerHTML = html; OV.appendChild(g); gsap.set(g, { autoAlpha: 0 }); tl.to(g, { autoAlpha: 1, duration: dur }, t); if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.5 }, until); return g; };
const cutX = (x, y, t, until, s = 26) => { // red X: the road is cut here
  const d = `M ${x - s} ${y - s} L ${x + s} ${y + s} M ${x + s} ${y - s} L ${x - s} ${y + s}`;
  const g = svgEl(`<path d="${d}" stroke="#f7f3ea" stroke-width="${s * 0.75}" stroke-linecap="round"/><path d="${d}" stroke="var(--rome)" stroke-width="${s * 0.42}" stroke-linecap="round"/>`, t, until, 0.01);
  gsap.set(g, { svgOrigin: `${x} ${y}` });
  tl.fromTo(g, { scale: 2.2 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, t);
  return g;
};
const trench = (x, y, ang, t, until, r = 34) => { // red dug-in arc facing the road
  const a0 = ang - 0.9, a1 = ang + 0.9, p = (a) => `${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}`;
  const d = `M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}`;
  return svgEl(`<path d="${d}" fill="none" stroke="#f7f3ea" stroke-width="${r * 0.36}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="var(--rome)" stroke-width="${r * 0.2}" stroke-linecap="round" stroke-dasharray="3 9"/>`, t, until);
};
// extra counter symbols the kit lacks (truck, engineers) drawn in the same white-on-colour style
const XICON = {
  truck: `<rect x="14" y="30" width="50" height="34" fill="none" stroke="#f7f3ea" stroke-width="8"/><path d="M64 42 L80 42 L88 54 L88 64 L64 64 Z" fill="none" stroke="#f7f3ea" stroke-width="8" stroke-linejoin="round"/><circle cx="30" cy="76" r="9" fill="#f7f3ea"/><circle cx="74" cy="76" r="9" fill="#f7f3ea"/>`,
  eng: `<path d="M18 72 L18 34 L82 34 L82 72 M50 34 L50 72" fill="none" stroke="#f7f3ea" stroke-width="8"/>`,
};
// unit + locked counter styling (flag badge, size mark, symbol). o.icon: infantry | artillery | tank | truck | eng | hq
const U = (o) => {
  const el = B.unit(Object.assign({}, o, { label: o.label || null }));
  if (XICON[o.icon]) { B.units[o.id].el.querySelector("svg").innerHTML = XICON[o.icon]; K.counter(o.id, { flag: o.flag, size: o.size }); }
  else K.counter(o.id, { icon: o.icon || "infantry", flag: o.flag, size: o.size });
  const tag = el.querySelector(".tag");
  if (tag && o.fs) tag.style.fontSize = o.fs + "px";
  return el;
};
// LOCKED bombing run (Harrier recipe from goosegreen move3.js): size 84, alt 30, dur 3.2; bombs just after the pass, 0.25 s apart
const bombRun = (pts, t0, bombs, o = {}) => {
  K.bombRun({ kind: o.kind || "prop", side: o.side || "carth", pts, t: t0, bombs }); // locked: jet/prop + bombs + SHAKE on the first bomb
};
const runThrough = (x, y, ang, len = 900) => { const c = Math.cos(ang), s = Math.sin(ang); return [[x - c * len / 2, y - s * len / 2], [x, y], [x + c * len / 2, y + s * len / 2]]; };
// continuous smoke column over a burning / bombed place
const smokeCol = (x, y, t0, t1, o = {}) => { for (let t = t0; t < t1; t += o.gap || 1.1) K.smoke(x, y, t, { n: 1, r: o.r || 10, rise: o.rise || 42, life: 3.2, alpha: 0.62, drift: 14 }); };
// closed perimeter ("pocket") as a ring of points, clockwise on screen (so K.front sideA = outside, sideB = inside)
const ringPts = (cx, cy, rx, ry, n = 18, wob = 0.08, rot = 0) => {
  const pts = [];
  for (let i = 0; i <= n + 1; i++) { // one extra point: the band overlaps itself where it closes
    const a = rot + (i % n) / n * Math.PI * 2, w = 1 + wob * Math.sin(i * 2.3 + cx * 0.01) * Math.cos(i * 1.1);
    pts.push([+(cx + Math.cos(a) * rx * w).toFixed(1), +(cy + Math.sin(a) * ry * w).toFixed(1)]);
  }
  return pts;
};
// "E"-look tint for a pocket: colour strongest at the ring, fading within `depth` px inward (dir -1) or outward (dir +1)
const ringTint = (pts, dir, depth, color, t, o = {}) => {
  const n = 5, rp = pts.slice(0, -2), cx = rp.reduce((s, p) => s + p[0], 0) / rp.length, cy = rp.reduce((s, p) => s + p[1], 0) / rp.length;
  const shift = (d) => pts.map(([x, y]) => { const L = Math.hypot(x - cx, y - cy) || 1; return [x + (x - cx) / L * d * dir, y + (y - cy) / L * d * dir]; });
  const out = [];
  for (let k = 0; k < n; k++) {
    const pl = K.territory({ pts: [...pts, ...shift(depth * (k + 1) / n).reverse()], side: color, t, dur: o.dur, alpha: 0.34 / n * 1.6, mask: o.mask, soft: 24, until: o.until });
    out.push(pl);
  }
  return out;
};
// ship silhouette (copied from goosegreen hook-atlantic G.ship), world coords; silent (stationary ships make no sound)
const ship = (x, y, o = {}) => {
  const w = o.w || 90, col = o.color || "#1f4fc4", el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - w / 2}px;top:${y - w * 0.18}px;width:${w}px;height:${w * 0.36}px;filter:drop-shadow(0 3px 3px rgba(0,0,0,0.45));`;
  el.innerHTML = `<svg width="${w}" height="${w * 0.36}" viewBox="0 0 100 36" style="display:block;overflow:visible;${o.flip ? "transform:scaleX(-1)" : ""}">
      <path d="M2 22 L96 22 L88 33 L10 33 Z" fill="${col}" stroke="#f3eee2" stroke-width="2.5"/>
      <path d="M30 22 L30 13 L46 13 L46 7 L56 7 L56 13 L66 13 L66 22 Z" fill="${col}" stroke="#f3eee2" stroke-width="2.5"/>
      <line x1="51" y1="7" x2="51" y2="0" stroke="#f3eee2" stroke-width="2.5"/><line x1="12" y1="22" x2="4" y2="17" stroke="#f3eee2" stroke-width="3"/></svg>`;
  PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  if (o.t != null) tl.fromTo(el, { autoAlpha: 0, x: o.dx != null ? o.dx : 40 }, { autoAlpha: 1, x: 0, duration: 1.2, ease: "power2.out" }, o.t);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.6 }, o.until);
  return el;
};
const MAIN_COL = { carth: "#2c57b7", rome: "#bc2528" }; // locked day front colours (K.front defaults)
const MASK = "assets/chosin_close_land.png";

// ---------- the road (assets/msr_roads.json "chosin_close"), Yudam-ni -> Funchilin ----------
const ROAD_ALL = poly([[1179.6,352.6],[1193.7,366.7],[1207.4,381.3],[1216.9,398.8],[1219.9,418.4],[1225.8,437.3],[1225.7,457.3],[1238.1,472.2],[1256.1,480.1],[1275.8,478.9],[1294.0,470.7],[1313.3,468.6],[1328.5,481.5],[1340.6,497.1],[1351.4,513.4],[1366.3,526.7],[1381.0,539.6],[1394.7,554.1],[1411.3,564.7],[1428.1,575.1],[1446.2,578.7],[1465.5,573.2],[1484.5,567.0],[1504.3,565.0],[1523.4,568.9],[1541.2,576.9],[1561.1,577.2],[1576.0,590.3],[1582.1,608.9],[1583.2,628.9],[1586.2,648.6],[1587.0,668.6],[1587.0,688.6],[1589.7,708.1],[1589.0,727.1],[1591.7,746.7],[1596.0,766.2],[1603.9,784.5],[1616.1,800.1],[1630.3,814.3],[1641.9,830.3],[1646.5,849.7],[1655.0,867.8],[1665.5,884.6],[1677.9,900.2],[1686.5,918.1],[1698.8,933.8],[1712.2,948.6],[1707.4,966.6],[1699.0,984.1],[1699.0,1004.1],[1706.3,1022.4],[1721.6,1035.1],[1726.9,1053.5],[1726.0,1073.5],[1729.3,1093.2],[1736.5,1111.8],[1731.7,1130.3],[1736.2,1147.3],[1755.2,1153.6],[1766.2,1169.1],[1770.3,1188.7],[1778.3,1207.0],[1785.7,1225.6],[1791.3,1244.5],[1802.7,1260.1],[1816.7,1274.0],[1823.2,1292.5],[1839.9,1303.4],[1847.9,1319.9],[1842.0,1338.5],[1839.4,1357.5],[1833.9,1375.8],[1817.1,1385.5],[1816.0,1404.4],[1823.7,1422.6],[1829.4,1440.7],[1822.2,1458.2],[1821.6,1476.8],[1817.7,1496.0],[1820.7,1515.5],[1808.4,1530.8],[1811.1,1549.8],[1827.7,1560.5],[1833.0,1579.6],[1839.4,1598.2],[1831.5,1610.4]]);
const HAG = G(40.385, 127.253), KOTO = G(40.285, 127.30);
const dH = dNear(ROAD_ALL, HAG), dK = dNear(ROAD_ALL, KOTO);
const ROAD = ROAD_ALL; // distances below are measured along the whole road
const KR = posAt(ROAD, dK), HR = posAt(ROAD, dH);

const S = P("breakout-3");
const T_DRIVE = at("breakout-3", "It did not"), T_INF = at("breakout-3", "Infantry climbed"), T_AIR = at("breakout-3", "while Marine and Navy");
const T_EVERY = at("breakout-3", "fought for every"), T_KOTO = at("breakout-3", "reached Koto-ri");

// ---------- the column's three legs (head distance along the road) ----------
const D = dK - dH;
const HEAD = [dH + 40, dH + D * 0.32, dH + D * 0.64, dK - 6];
const LEG = [[T_DRIVE - 1.6, T_AIR + 0.2], [T_AIR + 0.5, T_EVERY], [T_EVERY + 0.2, END - 1.2]];
const headAt = (t) => { // head distance at time t (linear within a leg; used to time the ridge fights)
  if (t <= LEG[0][0]) return HEAD[0];
  for (let i = 0; i < 3; i++) { const [a, b] = LEG[i]; if (t <= b) return HEAD[i] + (HEAD[i + 1] - HEAD[i]) * Math.max(0, (t - a) / (b - a)); if (i < 2 && t < LEG[i + 1][0]) return HEAD[i + 1]; }
  return HEAD[3];
};
const timeAt = (d) => { for (let t = 0; t < END; t += 0.1) if (headAt(t) >= d) return t; return END; };

// ---------- camera: follow the head of the column ----------
const CAM = (d, dy = 0, s = 1.75) => { const p = posAt(ROAD, d - 60); return [p[0], p[1] + dy, s]; };
B.camera(camSfx([
  [0, HR[0] + 60, HR[1] + 120, 1.3],
  [LEG[0][0], ...CAM(HEAD[0], 40, 1.6)],
  [LEG[0][1], ...CAM(HEAD[1], 20, 1.75)],
  [LEG[1][1], ...CAM(HEAD[2], 20, 1.75)],
  [LEG[2][1], ...CAM(HEAD[3], -20, 1.6)],
  [END, ...CAM(HEAD[3], -30, 1.55)],
]));

// ---------- base ----------
B.image("assets/chosin_close_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
K.grid(G, 39.9, 40.8, 126.4, 128.0, 0.05, 0.2);
B.snow(0, END);
road(ROAD, { t: 0.1, dur: 1.4, w: 10 });
B.showDate(0.2);
B.date("DECEMBER 6, 1950", 0.4, T_KOTO - 0.2, 36);
B.date("DECEMBER 7, 1950", T_KOTO, null, 36);
B.label("CHOSIN RESERVOIR", ...G(40.43, 127.24), { cls: "river", size: 30, t: 0.3, anchor: [-50, -50], until: T_INF });
B.label("HAGARU-RI", HR[0] - 150, HR[1] - 30, { cls: "city", size: 32, t: 0.5, anchor: [-100, -50], until: T_AIR });
B.label("KOTO-RI", KR[0] + 110, KR[1] + 10, { cls: "city", size: 32, t: 0.8, anchor: [0, -50] });
B.caption("DEC 6-7 · HAGARU-RI → KOTO-RI · 11 MILES", 0.8, T_INF - 0.3, "carth");

// ---------- pockets: Hagaru-ri (left behind as the column goes) and Koto-ri (the goal) ----------
const RH = ringPts(HR[0] + 10, HR[1] + 10, 130, 105, 20, 0.07), RK = ringPts(KR[0], KR[1] + 5, 80, 70, 18, 0.07);
K.front({ pts: RH, sideA: "rome", sideB: "carth", t: 0.3, dur: 1.2, until: T_DRIVE - 0.6 });
ringTint(RH, -1, 50, "#4a6a9a", 0.4, { mask: MASK, until: T_DRIVE - 0.6 });
K.front({ pts: RK, sideA: "rome", sideB: "carth", t: 0.9, dur: 1.2, until: END + 1 });
ringTint(RK, -1, 40, "#4a6a9a", 1.0, { mask: MASK });
ringTint(RK, +1, 80, "#a8503c", 1.2, { mask: MASK });

// ---------- the column ----------
const COL = [["c0", "infantry", "III", "7TH MARINES"], ["c1", "tank"], ["c2", "truck"], ["c3", "artillery", null, null], ["c4", "truck"], ["c5", "infantry", "III"]];
const GAP = 34;
COL.forEach(([id, icon, size, label], i) => {
  const [x, y] = posAt(ROAD, HEAD[0] - i * GAP);
  U({ id, side: "carth", x, y, w: 26, h: 22, icon, size, flag: "us", label, t: 1.0 + i * 0.12 });
});
B.units.c0.el.querySelector(".tag").style.cssText += "font-size:13px;position:absolute;left:32px;top:-2px;margin:0;";
gsap.set(B.units.c0.el, { zIndex: 3 });
LEG.forEach(([a, b], k) => COL.forEach((_, i) => follow("c" + i, ROAD, a + i * 0.05, b - a, HEAD[k] - i * GAP, HEAD[k + 1] - i * (k === 2 ? 14 : GAP), "power1.inOut")));

// ---------- moving two-colour front on each flank (hops follow the column: to + moveT) ----------
const OFF = 78, BACK = 300, AHEAD = 70;
// fronts follow a smoothed copy of the road (no kinks at the hairpins); SM distances map ~1:1 to the road's
const SM = poly(smooth(ROAD.pts.filter((_, i) => i % 5 === 0), 6));
const flank = (h, side) => { const k = dNear(SM, posAt(ROAD, h)); return offLine(SM, k - BACK, k + AHEAD, side * OFF, 7); };
LEG.forEach(([a, b], k) => {
  const last = k === LEG.length - 1, t0 = k === 0 ? LEG[0][0] - 1.2 : a - 0.05, until = last ? END + 1 : b + 0.1;
  [-1, 1].forEach((side) => {
    // road runs roughly south: side -1 = east of the road, side +1 = west. sideA (left of travel) = east.
    K.front({ pts: flank(HEAD[k], side), to: flank(HEAD[k + 1], side), sideA: side < 0 ? "rome" : "carth", sideB: side < 0 ? "carth" : "rome",
      t: t0, dur: k === 0 ? 1.1 : 0.01, moveT: a, moveDur: b - a, until });
    // territory: blue corridor between the fronts, red ground beyond them
    K.frontTint({ pts: flank(HEAD[k], side), to: flank(HEAD[k + 1], side), dir: side, depth: 90, color: "#a8503c", t: t0, dur: k === 0 ? 1.2 : 0.3, alpha: 0.34, mask: MASK, moveT: a, moveDur: b - a, until });
    K.frontTint({ pts: flank(HEAD[k], side), to: flank(HEAD[k + 1], side), dir: -side, depth: OFF - 6, color: "#4a6a9a", t: t0, dur: k === 0 ? 1.2 : 0.3, alpha: 0.34, mask: MASK, moveT: a, moveDur: b - a, until });
  });
});

// ---------- the Chinese on the ridges ----------
const TR = [];
const reds = [[0.1, -1], [0.2, 1], [0.3, -1], [0.68, 1], [0.55, -1], [0.49, 1], [0.78, -1], [0.88, 1]];
const RP = reds.map(([f, side], i) => {
  const [x, y] = normAt(ROAD, dH + D * f, side * ((i === 4 || i === 5) ? 185 : 132 + (i % 3) * 14));
  U({ id: "r" + i, side: "rome", x, y, w: 30, h: 24, icon: "infantry", flag: "prc", size: "II", t: 1.6 + i * 0.15 });
  const [rx, ry] = posAt(ROAD, dH + D * f);
  TR.push(trench(x, y, Math.atan2(ry - y, rx - x), 2.0 + i * 0.15, null, 30));
  return [x, y];
});
// Corsair targets: the two positions the column meets during the air strikes
const AIR = [4, 5];
// infantry climbs the ridges on both flanks as the column passes below
reds.forEach(([f, side], i) => {
  if (AIR.includes(i)) return;
  const t = Math.max(T_INF + 0.2 + i * 0.3, timeAt(dH + D * (f - 0.06)));
  const [x0, y0] = normAt(ROAD, dH + D * (f - 0.07), side * 14), [xm, ym] = normAt(ROAD, dH + D * (f - 0.03), side * 70), [x1, y1] = normAt(ROAD, dH + D * f, side * 108);
  B.arrow({ side: "carth", pts: [[x0, y0], [xm, ym], [x1, y1]], width: 9, t, dur: 1.0, until: t + 3.2 });
  B.grey(["r" + i], t + 1.0, 0.6);
  if (i % 2 === 0) SFX("mg", t + 0.8); // infantry fight for the ridge (every other one: no machine-gun loop)
  B.hideUnits(["r" + i], t + 3.4, 0.6); tl.to(TR[i], { autoAlpha: 0, duration: 0.6 }, t + 3.4);
});
B.caption("INFANTRY CLEARS THE RIDGES", T_INF + 0.3, T_AIR + 0.3, "carth");

// ---------- Marine and Navy fighter-bombers: Corsair bombing runs (locked Harrier recipe) ----------
AIR.forEach((ri, k) => {
  const [x, y] = RP[ri], t0 = T_AIR + 0.2 + k * 1.7, ang = k ? 2.3 : 0.75;
  bombRun(runThrough(x, y, ang, 820), t0, [[x - 8, y - 4], [x + Math.cos(ang) * 26, y + Math.sin(ang) * 26 + 6]]);
  B.grey(["r" + ri], t0 + 1.7, 0.5);
  B.hideUnits(["r" + ri], t0 + 5.5, 0.6); tl.to(TR[ri], { autoAlpha: 0, duration: 0.6 }, t0 + 5.5);
  smokeCol(x + 6, y - 6, t0 + 2.4, END, { r: 11 }); // the bombed ridge burns
});
B.caption("MARINE & NAVY CORSAIRS STRIKE ANYTHING THAT MOVES", T_AIR + 0.7, T_EVERY - 0.2, "carth");
B.caption("THE COLUMN KEEPS MOVING", T_EVERY + 0.3, T_KOTO - 0.2, "carth");
B.caption("DEC 7 · THE COLUMN REACHES KOTO-RI", T_KOTO + 0.1, END - 0.2, "carth");
K.raiseTerritory();
B.finish();
