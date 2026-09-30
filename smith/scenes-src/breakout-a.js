// breakout-a: Dec 4 1950, the whole road Hagaru-ri -> Hungnam; the Chinese on every ridge (breakout-1 .. breakout-2).
// Locked style (STYLE_LOCK.md): UN = blue ("carth"), Chinese = red ("rome"); pockets drawn as two-colour fronts (blue inside,
// red outside) with "E"-look territory clipped to land (assets/chosin_land.png); counters with flags + size marks.
// ---------- projection (assets/chosin.json: zoom 11) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 11, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 446141).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 197446).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const tl = B.tl;
const K = FXK(B);
// sound: whoosh on big camera zooms (scale x1.6 or more within 6 s), at the fastest point of the move
const camSfx = (keys) => { for (let i = 1; i < keys.length; i++) { const r = keys[i][3] / keys[i - 1][3], d = keys[i][0] - keys[i - 1][0];
  if ((r >= 1.6 || r <= 1 / 1.6) && d <= 6) SFX("whoosh", Math.max(0, keys[i - 1][0] + d / 2 - 0.5)); } return keys; };

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
const MASK = "assets/chosin_land.png";

// ---------- the road (least-cost valley route, assets/msr_roads.json "chosin"), Yudam-ni -> Hungnam ----------
const ROAD_ALL = poly([[1861.4,1361.4],[1836.1,1351.6],[1821.3,1330.1],[1806.0,1307.0],[1786.2,1287.3],[1764.8,1269.4],[1745.8,1248.8],[1726.1,1229.0],[1711.8,1205.2],[1698.0,1181.7],[1686.0,1156.9],[1677.0,1130.9],[1666.3,1105.1],[1653.4,1080.3],[1641.6,1055.2],[1632.0,1029.4],[1613.5,1008.6],[1591.5,991.5],[1570.8,972.8],[1547.2,958.0],[1526.6,939.0],[1504.4,922.1],[1488.4,899.3],[1481.9,872.2],[1471.9,847.0],[1452.5,826.8],[1450.7,799.1],[1460.5,774.1],[1457.0,748.0],[1441.5,725.5],[1439.8,701.2],[1442.8,673.4],[1451.2,647.5],[1450.0,628.0],[1454.2,601.6],[1437.3,581.1],[1423.2,558.3],[1414.1,532.0],[1395.9,514.3],[1394.5,488.1],[1388.9,462.4],[1380.6,437.5],[1380.7,414.2],[1365.3,391.1],[1353.2,366.4],[1336.5,344.5],[1326.3,318.8],[1324.5,291.7],[1323.0,263.8],[1315.1,238.1],[1289.5,229.8],[1262.2,234.1],[1237.0,229.5],[1216.3,211.4],[1198.3,190.9],[1174.8,184.1],[1148.8,182.2],[1141.0,156.6],[1129.6,132.1],[1120.8,123.3]].reverse());
const HAG = G(40.385, 127.253), KOTO = G(40.285, 127.30), HAM = G(39.92, 127.54), HUNG = G(39.83, 127.62), YUD = G(40.48, 127.11);
const dHAG = dNear(ROAD_ALL, HAG);
const MSR = sub(ROAD_ALL, dHAG, ROAD_ALL.len); // Hagaru-ri -> Hungnam
const WEST = sub(ROAD_ALL, 0, dHAG);          // Yudam-ni -> Hagaru-ri
const KOTOR = posAt(MSR, dNear(MSR, KOTO)), CHINR = posAt(MSR, dNear(MSR, G(40.17, 127.38)));

const S1 = P("breakout-1"), S2 = P("breakout-2");
const T_FORCE = at("breakout-1", "the whole of Smith"), T_GATH = at("breakout-1", "gathered at"), T_DIVS = at("breakout-1", "several Chinese"), T_MILE = at("breakout-1", "every mile");
const T_AIR = at("breakout-1", "airlifted out"), T_ABAND = at("breakout-1", "abandoning");
const T_CHI = S2 + 0.3, T_TRUCKS = at("breakout-2", "trucks, tanks"), T_ROAD = at("breakout-2", "use the road");
const T_CUT = at("breakout-2", "cut that road"), T_LEAVE = at("breakout-2", "leave their guns"), T_CROWD = at("breakout-2", "a division without");

// ---------- camera ----------
B.camera(camSfx([
  [0, 1500, 700, 0.72],
  [T_GATH, 1460, 640, 0.8],
  [T_DIVS, 1380, 470, 1.05],
  [T_MILE - 0.3, 1400, 520, 1.0],
  [T_MILE + 4.2, 1520, 780, 0.82],
  [T_AIR - 0.4, 1480, 700, 0.86],
  [T_AIR + 1.8, 1400, 420, 1.3],
  [S2, 1390, 420, 1.36],
  [T_TRUCKS, 1350, 340, 1.7],
  [T_CUT - 0.2, 1370, 400, 1.6],
  [T_CUT + 2.2, 1450, 600, 1.1],
  [T_LEAVE, 1440, 580, 1.18],
  [END, 1410, 520, 1.3],
]));

// ---------- base ----------
B.image("assets/chosin_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
K.grid(G, 39.5, 40.8, 126.2, 128.5, 0.1, 0.2);
B.snow(0.2, END);
B.dim(0, 4.3, 0.55);
B.title("MOVE 3", "THE BREAKOUT", "DECEMBER 1950", 0.4, 4.1);
SFX("hit", 0.6); // MOVE 3 title card
B.showDate(4.4);
B.date("DECEMBER 4, 1950", 4.6, null, 36);
road(WEST, { t: 0.2, dur: 0.8, w: 7 });
road(MSR, { t: 1.0, dur: 3.2, w: 9 });
B.label("CHOSIN RESERVOIR", ...G(40.47, 127.24), { cls: "river", size: 30, t: 4.4, anchor: [-50, -50], until: T_AIR });
B.label("HAGARU-RI", HAG[0] - 108, HAG[1] + 2, { cls: "city", size: 30, t: 4.6, anchor: [-100, -50] });
B.label("KOTO-RI", KOTOR[0] + 56, KOTOR[1], { cls: "city", size: 28, t: 4.9, anchor: [0, -50] });
B.label("CHINHUNG-NI", CHINR[0] + 40, CHINR[1], { cls: "city", size: 24, t: 5.1, anchor: [0, -50], until: T_ROAD });
B.city("HAMHUNG", ...HAM, { left: true, size: 30, t: 5.2, until: T_AIR + 1 });
B.city("HUNGNAM", ...HUNG, { size: 30, t: 5.4, until: T_AIR + 1 });
B.label("SEA OF JAPAN", 2380, 1360, { cls: "sea", size: 44, t: 5.6, until: T_AIR + 1 });
B.label("78 MILES TO THE SEA", ...normAt(MSR, MSR.len * 0.62, -170), { cls: "tg", size: 30, t: 6.0, until: T_DIVS + 0.5, anchor: [-50, -50] });

// ---------- the pockets: two-colour fronts (blue inside, red outside) ----------
const RH = ringPts(HAG[0] + 4, HAG[1] + 2, 96, 78, 20, 0.07);
const RK = ringPts(KOTOR[0], KOTOR[1], 44, 40, 14, 0.08);
const RC = ringPts(CHINR[0], CHINR[1], 28, 26, 12, 0.08);
const RY = ringPts(YUD[0] + 30, YUD[1] + 20, 96, 78, 20, 0.07); // same size as RH so the drawn band covers the whole ring after the move
// the Yudam-ni force fights its way back to Hagaru-ri (Dec 1-4): its pocket slides down the road and merges
K.front({ pts: RY, to: RH, sideA: "rome", sideB: "carth", t: 0.6, dur: 1.4, moveT: T_FORCE + 0.4, moveDur: 3.0, until: T_FORCE + 3.6 });
B.label("YUDAM-NI", YUD[0] - 72, YUD[1] + 8, { cls: "city", size: 26, t: 0.8, anchor: [-100, -50], until: T_FORCE + 0.6 });
const FH = K.front({ pts: RH, sideA: "rome", sideB: "carth", t: 1.2, dur: 1.6, until: END + 1 });
const FK = K.front({ pts: RK, sideA: "rome", sideB: "carth", t: 1.8, dur: 1.2, until: END + 1 });
const FC = K.front({ pts: RC, sideA: "rome", sideB: "carth", t: 2.2, dur: 1.0, until: END + 1 });
[[RH, 44, 120], [RK, 26, 90], [RC, 16, 70]].forEach(([R, din, dout], i) => {
  ringTint(R, -1, din, "#4a6a9a", 1.4 + i * 0.4, { mask: MASK });
  ringTint(R, +1, dout, "#a8503c", 1.6 + i * 0.4, { mask: MASK });
});
// Marine units: the Yudam-ni regiments arrive; the division gathers at Hagaru-ri
[["y5", "5TH MARINES", -20], ["y7", "7TH MARINES", 20]].forEach(([id, lb, dy], i) => {
  const d0 = 30 + i * 30;
  const [x, y] = posAt(WEST, d0);
  U({ id, side: "carth", x, y, w: 34, h: 28, icon: "infantry", flag: "us", size: "III", t: 0.8 + i * 0.2 });
  follow(id, WEST, T_FORCE + 0.4 + i * 0.2, 3.0, d0, WEST.len - 10 - i * 5, "power1.inOut");
  B.hideUnits([id], T_GATH + 0.2, 0.3);
});
const HQ = [["b0", 0, 8, "hq", "XX", "1ST MARINE DIV"], ["b1", -50, 8, "infantry", "III"], ["b2", 50, 8, "infantry", "III"]];
HQ.forEach(([id, dx, dy, icon, size, label], i) => U({ id, side: "carth", x: HAG[0] + dx, y: HAG[1] + dy, w: 34, h: 28, icon, size, flag: "us", label, fs: 15, t: T_GATH + i * 0.15 }));
gsap.set(B.units.b0.el, { zIndex: 3 });
U({ id: "k0", side: "carth", x: KOTOR[0], y: KOTOR[1], w: 30, h: 24, icon: "infantry", flag: "us", size: "III", t: T_GATH + 0.5 });
U({ id: "k1", side: "carth", x: CHINR[0], y: CHINR[1], w: 24, h: 20, icon: "infantry", flag: "us", size: "II", t: T_GATH + 0.7 });
SFX("tick", T_GATH + 0.1); // counters drop in

// ---------- Chinese divisions around Hagaru-ri ----------
const ring = [[40.45, 127.14], [40.35, 127.12], [40.45, 127.36], [40.34, 127.40], [40.27, 127.17], [40.52, 127.27]];
ring.forEach(([la, lo], i) => U({ id: "rr" + i, side: "rome", x: G(la, lo)[0], y: G(la, lo)[1], w: 40, h: 32, icon: "infantry", flag: "prc", size: "XX",
  label: i === 2 ? "CHINESE DIVISIONS" : null, fs: 15, t: T_DIVS + 0.2 + i * 0.2 }));
SFX("tick", T_DIVS + 0.3); // red counters drop in
// every mile of the road south: ridges on both sides
const ridge = [];
const clearOf = (x, y) => Math.hypot(x - HAG[0], y - HAG[1]) > 150 && Math.hypot(x - KOTOR[0], y - KOTOR[1]) > 95 && Math.hypot(x - CHINR[0], y - CHINR[1]) > 70
  && !(x > KOTOR[0] + 20 && x < KOTOR[0] + 230 && Math.abs(y - KOTOR[1]) < 45) && !(x > CHINR[0] + 10 && x < CHINR[0] + 230 && Math.abs(y - CHINR[1]) < 40); // label boxes
for (let k = 0; k < 13; k++) {
  const d = MSR.len * (0.05 + k * 0.046), side = k % 2 ? 1 : -1;
  const [x, y] = normAt(MSR, d, side * (62 + (k % 3) * 14));
  if (!clearOf(x, y)) continue; // keep the pockets and their labels clear
  ridge.push([x, y, d, side]);
  U({ id: "rd" + k, side: "rome", x, y, w: 28, h: 22, icon: "infantry", flag: "prc", size: "II", t: T_MILE + 0.3 + ridge.length * 0.24 });
}
B.caption("CHINESE ON EVERY RIDGE", T_MILE + 1.4, T_AIR - 0.3, "rome");

// ---------- the expected airlift ----------
const veh = [["v0", "tank", -50], ["v1", "truck", 0], ["v2", "artillery", 50]];
veh.forEach(([id, icon, dx], i) => U({ id, side: "carth", x: HAG[0] + dx, y: HAG[1] - 34, w: 34, h: 26, icon, flag: "us", t: T_AIR - 0.4 + i * 0.15 }));
[0, 1].forEach((i) => K.aircraft({ kind: "turboprop", side: "carth", size: 70, alt: 26, t: T_AIR + 0.3 + i * 1.6, dur: 4.4, until: T_AIR + 4.7 + i * 1.6,
  pts: [[HAG[0] + 40, HAG[1] + 20], [HAG[0] + 300, HAG[1] + 120 + i * 50], [HAG[0] + 640, HAG[1] + 330 + i * 60], [HAG[0] + 1000, HAG[1] + 620]] }));
B.label("C-47 AIRLIFT?", HAG[0] + 330, HAG[1] + 60, { cls: "tg", size: 22, t: T_AIR + 0.8, until: T_ABAND + 2.4, anchor: [0, -50] });
B.grey(["v0", "v1", "v2"], T_ABAND + 0.3, 0.8);
B.caption("FLY OUT, LEAVE THE GUNS BEHIND?", T_AIR + 0.6, S2 - 0.2, "");

// ---------- breakout-2: the Chinese view ----------
ridge.forEach(([x, y, d, side], k) => { const [rx, ry] = posAt(MSR, d); trench(x, y, Math.atan2(ry - y, rx - x), T_CHI + 0.4 + k * 0.12, null, 26); });
// vehicles come back to colour: they need the road
["v0", "v1", "v2"].forEach((id) => {
  const el = B.units[id].el;
  tl.to(el.querySelector(".blk"), { backgroundColor: "#1f4fc4", duration: 0.6 }, T_TRUCKS);
  tl.to(el, { opacity: 1, duration: 0.6 }, T_TRUCKS);
});
B.label("TANKS · TRUCKS · GUNS", HAG[0], HAG[1] - 82, { cls: "tg", size: 18, t: T_TRUCKS + 0.2, until: T_CUT + 0.4, anchor: [-50, -50] });
const glow = document.createElementNS(NS, "path");
glow.setAttribute("d", lineD(MSR.pts)); glow.setAttribute("fill", "none"); glow.setAttribute("stroke", "#fff6d8");
glow.setAttribute("stroke-width", 30); glow.setAttribute("stroke-linecap", "round"); glow.setAttribute("opacity", 0);
OV.insertBefore(glow, OV.children[2] || null);
tl.to(glow, { opacity: 0.6, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_ROAD - 0.3);
B.label("THE ONLY ROAD OUT", ...normAt(MSR, MSR.len * 0.22, -150), { cls: "tg", size: 26, t: T_ROAD, until: T_CUT + 0.2, anchor: [-50, -50] });

// the Chinese can cut the road anywhere: red arrows onto the road, blasts, cut markers
const cuts = [0.1, 0.21, 0.33, 0.46];
cuts.forEach((f, i) => {
  const d = MSR.len * f, side = i % 2 ? 1 : -1, [x0, y0] = normAt(MSR, d - 30, side * 190), [xm, ym] = normAt(MSR, d - 8, side * 95), [x1, y1] = posAt(MSR, d);
  const tt = T_CUT + 0.2 + i * 0.47;
  B.arrow({ side: "rome", pts: [[x0, y0], [xm, ym], [x1 + (xm - x1) * 0.4, y1 + (ym - y1) * 0.4]], width: 10, t: tt, dur: 0.8, until: END - 0.5 });
  K.impact(x1, y1, tt + 0.8, { r: 13 + (i % 2) * 3 });
  cutX(x1, y1, tt + 0.9, END - 0.5, 14);
});
const bp = posAt(MSR, MSR.len * 0.3);
B.bubble("THEY MUST ABANDON EVERYTHING", bp[0] - 520, bp[1] - 20, T_LEAVE - 0.6, END - 0.2);
B.caption("A DIVISION WITHOUT ITS GUNS IS JUST A CROWD", T_CROWD, END - 0.3, "rome");
K.raiseTerritory();
B.finish();
