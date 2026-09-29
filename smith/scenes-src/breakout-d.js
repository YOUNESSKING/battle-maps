// breakout-d: Dec 11 1950, the column reaches Hungnam; the 9th Army Group wrecked; Chosin casualty card; method card (rule 3).
// (breakout-7 .. breakout-8; the scene also spans the ARCHIVE slot between them, covered in assembly.)
// Locked style: Hungnam perimeter (one-colour blue line: not in contact) + territory; ships offshore (stationary, silent);
// Chinese counters grey; casualty card (K.casualties). UN = blue ("carth"), Chinese = red ("rome").
// Casualty figures (1st Marine Division, Chosin campaign 26 Oct - 15 Dec 1950): ~1,000 killed, died of wounds or missing
// (Montross & Canzona, USMC Operations in Korea vol. III: 604 KIA + 114 DOW + 192 MIA; script: "around a thousand dead"),
// ~3,000-3,500 wounded (research/gemini_research.md ~3,000; Montross 3,508), frostbite "thousands" (7,313 non-battle casualties,
// mostly frostbite). Chinese 9th Army Group: "tens of thousands" in words (estimates 30,000-50,000+ vary widely).
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
  K.aircraft({ kind: o.kind || "prop", side: o.side || "carth", size: 84, alt: 30, pts, t: t0, dur: 3.2, until: t0 + 3.2 });
  bombs.forEach((b, k) => K.impact(b[0], b[1], t0 + 1.55 + k * 0.25, { r: 20, shake: k === 0 ? 5 : false }));
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

// ---------- METHOD CARD (shared design: identical in inchon-9 / hagaru-9 / breakout-8 / ending-2) ----------
const methodCard = (o) => { // o = { t, until, rowT: [t1,t2,t3], hi: index to highlight or -1, hiT }
  const rows = ["BUILD THE LIFELINE FIRST", "REFUSE TO BE RUSHED", "KEEP THE DIVISION WHOLE"];
  const el = document.createElement("div");
  el.style.cssText = "position:absolute;left:50%;top:50%;translate:-50% -50%;width:1180px;padding:44px 64px 50px;background:rgba(16,15,13,0.86);border-top:6px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,0.55);color:#f4f1ea;";
  el.innerHTML = `<div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a;font-weight:500;margin-bottom:20px">SMITH'S METHOD</div>` +
    rows.map((r, i) => `<div class="mrow" style="position:relative;display:flex;align-items:center;gap:30px;padding:14px 20px;margin:6px -20px;border-radius:4px">
      <div class="mhl" style="position:absolute;inset:0;background:rgba(196,18,31,0.28);border-left:8px solid #e3232f;border-radius:4px;opacity:0"></div>
      <div class="mnum" style="position:relative;width:74px;height:74px;flex:none;border-radius:50%;background:#1f4fc4;border:4px solid #f4f1ea;display:flex;align-items:center;justify-content:center;font-size:42px;font-weight:700">${i + 1}</div>
      <div style="position:relative;font-size:62px;font-weight:700;letter-spacing:0.06em;line-height:1.1">${r}</div></div>`).join("");
  document.getElementById("scene").insertBefore(el, document.getElementById("credit"));
  gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, o.t);
  el.querySelectorAll(".mrow").forEach((r, i) => {
    gsap.set(r, { autoAlpha: 0 });
    tl.fromTo(r, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power3.out" }, o.rowT[i]);
    SFX("hit", Math.max(o.rowT[i] + 0.1, (o.minT || 0) + 0.1)); // each method line slams in
  });
  if (o.hi >= 0) {
    const r = el.querySelectorAll(".mrow")[o.hi];
    tl.to(r.querySelector(".mhl"), { opacity: 1, duration: 0.6 }, o.hiT);
    tl.to(r.querySelector(".mnum"), { backgroundColor: "#c4121f", scale: 1.15, duration: 0.5, ease: "back.out(2)" }, o.hiT);
    el.querySelectorAll(".mrow").forEach((x, i) => { if (i !== o.hi) tl.to(x, { opacity: 0.45, duration: 0.6 }, o.hiT); });
  }
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.6 }, o.until);
  return el;
};

// ---------- geography: the real road (assets/msr_roads.json "chosin"), Hagaru-ri -> Hungnam ----------
const ROAD_ALL = poly([[1861.4,1361.4],[1836.1,1351.6],[1821.3,1330.1],[1806.0,1307.0],[1786.2,1287.3],[1764.8,1269.4],[1745.8,1248.8],[1726.1,1229.0],[1711.8,1205.2],[1698.0,1181.7],[1686.0,1156.9],[1677.0,1130.9],[1666.3,1105.1],[1653.4,1080.3],[1641.6,1055.2],[1632.0,1029.4],[1613.5,1008.6],[1591.5,991.5],[1570.8,972.8],[1547.2,958.0],[1526.6,939.0],[1504.4,922.1],[1488.4,899.3],[1481.9,872.2],[1471.9,847.0],[1452.5,826.8],[1450.7,799.1],[1460.5,774.1],[1457.0,748.0],[1441.5,725.5],[1439.8,701.2],[1442.8,673.4],[1451.2,647.5],[1450.0,628.0],[1454.2,601.6],[1437.3,581.1],[1423.2,558.3],[1414.1,532.0],[1395.9,514.3],[1394.5,488.1],[1388.9,462.4],[1380.6,437.5],[1380.7,414.2],[1365.3,391.1],[1353.2,366.4],[1336.5,344.5],[1326.3,318.8],[1324.5,291.7],[1323.0,263.8],[1315.1,238.1],[1289.5,229.8],[1262.2,234.1],[1237.0,229.5],[1216.3,211.4],[1198.3,190.9],[1174.8,184.1],[1148.8,182.2],[1141.0,156.6],[1129.6,132.1],[1120.8,123.3]].reverse());
const HAG = G(40.385, 127.253), KOTO = G(40.285, 127.30), CHIN = G(40.17, 127.38), HAM = G(39.92, 127.54), HUNG = G(39.83, 127.62);
const MSR = sub(ROAD_ALL, dNear(ROAD_ALL, HAG), ROAD_ALL.len);
const DCH = dNear(MSR, CHIN);

const S7 = P("breakout-7"), S8 = P("breakout-8"), E7 = B.end("breakout-7");
const a7 = (s, o = 0) => at("breakout-7", s, o), a8 = (s, o = 0) => at("breakout-8", s, o);
const T_BEHIND = a7("Behind them"), T_WRECK = a7("had been wrecked"), T_TENS = a7("tens of thousands"), T_MONTHS = a7("would not be able"),
  T_MAR = a7("The Marines had lost"), T_THOUS = a7("thousands more"), T_DIV = a7("But they had come out");
const T_R1 = a8("Build the lifeline"), T_R2 = a8("Refuse to be"), T_R3 = a8("Keep the division"), T_THIRD = a8("put the third"),
  T_HOLD = a8("By holding"), T_RETREAT = a8("turned a retreat");

// ---------- camera ----------
B.camera(camSfx([
  [0, 1660, 1080, 0.95],
  [T_BEHIND - 0.8, 1740, 1200, 1.05],
  [T_BEHIND + 2.2, 1450, 600, 0.95],
  [T_TENS, 1480, 700, 0.9],
  [T_DIV, 1760, 1200, 1.0],
  [E7 + 1.0, 1830, 1290, 1.2],
  [S8 - 0.5, 1760, 1200, 1.05],
  [T_HOLD, 1580, 840, 0.72],
  [END, 1560, 820, 0.76],
]));

// ---------- base ----------
B.image("assets/chosin_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
K.grid(G, 39.5, 40.8, 126.2, 128.5, 0.1, 0.1);
B.snow(0, END);
road(MSR, { t: 0, dur: 0.01, w: 9 });
B.showDate(0.2);
B.date("DECEMBER 11, 1950", 0.4, null, 34);
B.city("HAGARU-RI", ...HAG, { left: true, size: 30, t: 0.2 });
B.city("KOTO-RI", ...KOTO, { size: 28, t: 0.3 });
B.city("HAMHUNG", ...HAM, { left: true, size: 30, t: 0.5 });
B.city("HUNGNAM", HUNG[0] + 4, HUNG[1], { size: 34, t: 0.6, dy: 36 });
B.label("SEA OF JAPAN", 2380, 1180, { cls: "sea", size: 44, t: 0.8 });

// the Hungnam perimeter: a blue line, not in contact (one colour), with blue ground behind it
const PER = [[1680, 1440], [1688, 1320], [1770, 1222], [1890, 1196], [1962, 1250], [1990, 1312]];
K.front({ pts: PER, sideA: "carth", sideB: "carth", t: 0.6, dur: 1.6, until: END + 1 });
K.frontTint({ pts: PER, dir: 1, depth: 160, color: "#4a6a9a", t: 0.8, alpha: 0.34, mask: MASK });

// ships waiting offshore (stationary: no sound)
[[2010, 1440], [2130, 1390], [2110, 1500], [2250, 1450], [1990, 1545], [2230, 1560]].forEach(([x, y], i) => ship(x, y, { w: 90, color: "#1f4fc4", t: 1.0 + i * 0.25, dx: 0 }));
B.label("U.S. NAVY", 2140, 1610, { cls: "tg", size: 26, t: 2.4, until: T_BEHIND, anchor: [-50, -100] });

// the column comes down to the coast
const kinds = [["infantry", "III"], ["tank"], ["truck"], ["artillery", "III"], ["truck"], ["infantry", "III"], ["tank"], ["truck"]];
kinds.forEach(([icon, size], i) => {
  const d0 = DCH + 120 - i * 48, d1 = MSR.len - 10 - i * 26, [x, y] = posAt(MSR, d0);
  U({ id: "c" + i, side: "carth", x, y, w: 32, h: 26, icon, size, flag: "us", label: i === 0 ? "1ST MARINE DIV" : null, t: 0.3 + i * 0.1 });
  follow("c" + i, MSR, 0.8 + i * 0.15, T_BEHIND + 1.0 - i * 0.1, d0, d1, "sine.inOut");
});
SFX("truck", 0.9); // the column rolls down to the coast
B.units.c0.el.querySelector(".tag").style.cssText += "font-size:15px;position:absolute;left:40px;top:-2px;margin:0;";
gsap.set(B.units.c0.el, { zIndex: 3 });
B.caption("DEC 11 · THE LAST UNITS REACH HUNGNAM", 1.0, T_BEHIND - 0.2, "carth");

// the 9th Army Group left behind in the mountains
const reds = [[40.44, 127.15], [40.36, 127.17], [40.42, 127.36], [40.33, 127.4], [40.27, 127.2], [40.22, 127.24], [40.2, 127.46], [40.12, 127.3], [40.1, 127.52], [40.3, 127.48]];
reds.forEach(([la, lo], i) => U({ id: "r" + i, side: "rome", x: G(la, lo)[0], y: G(la, lo)[1], w: 40, h: 32, icon: "infantry", flag: "prc", size: "XX",
  label: i === 2 ? "CHINESE 9TH ARMY GROUP" : null, fs: 15, t: T_BEHIND - 0.4 + i * 0.08 }));
SFX("tick", T_BEHIND - 0.3); // red counters drop in
B.grey(reds.map((_, i) => "r" + i), T_WRECK - 0.2, 1.2);
B.caption("9TH ARMY GROUP · OUT OF ACTION UNTIL SPRING", T_MONTHS, T_MAR - 0.3, "rome");
const ring = svgEl(`<circle cx="${HUNG[0] - 30}" cy="${HUNG[1] - 30}" r="120" fill="none" stroke="#f7f3ea" stroke-width="6" stroke-dasharray="22 12"/>`, T_DIV - 0.4, S8 + 1, 0.6);
B.caption("THEY CAME OUT AS A DIVISION", T_DIV + 0.1, E7 + 1.0, "carth");

// ---------- CASUALTY CARD: the Chosin campaign ----------
const tCard = T_TENS - 0.4, tOff = T_DIV - 0.2;
B.dim(tCard - 0.2, tOff, 0.5);
const card = K.casualties({ headA: "U.S. MARINES", headB: "CHINESE", flagA: "us", flagB: "prc", top: 230,
  rows: [["killed", "~1,000", ""], ["wounded", "3,000–3,500", ""], ["frost", "THOUSANDS", ""]], t: tCard, until: tOff });
const cols = card.firstElementChild.children;
// frostbite row: snowflake pictogram (the kit has none)
const flake = `<svg width="34" height="34" viewBox="0 0 100 100"><g stroke="#9fc0ea" stroke-width="9" stroke-linecap="round">${[0, 60, 120].map((a) => `<line x1="50" y1="8" x2="50" y2="92" transform="rotate(${a} 50 50)"/>`).join("")}</g></svg>`;
cols[0].children[3].insertAdjacentHTML("afterbegin", flake);
cols[0].children[3].querySelector("span").insertAdjacentHTML("afterend", `<span style="font-size:22px;color:#d8cfb8;letter-spacing:0.06em">FROSTBITE</span>`);
// the Chinese column: the script gives no exact figure, so it is said in words
[3, 2, 1].forEach((r) => cols[1].children[r].remove());
cols[1].insertAdjacentHTML("beforeend", `<div class="cn" style="padding-top:18px;max-width:330px"><div style="font-size:54px;line-height:1.05;color:#f7f3ea">TENS OF THOUSANDS</div>
  <div style="font-size:24px;letter-spacing:0.08em;color:#d8cfb8;margin-top:14px">KILLED · WOUNDED · FROZEN</div></div>`);
// numbers land as they are spoken
[1, 2, 3].forEach((r, k) => { const v = cols[0].children[r]; gsap.set(v, { autoAlpha: 0 });
  tl.fromTo(v, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, (k ? T_THOUS : T_MAR) + k * 0.35); });
SFX("tick", T_MAR + 0.1); // Marine figures count in
K.raiseTerritory();

// ---------- breakout-8: method card, rule 3 ----------
B.dateBox(S8 - 0.4, null);
B.dim(T_R1 - 1.2, T_HOLD + 0.2, 0.75);
methodCard({ t: T_R1 - 1.0, until: T_HOLD - 0.3, rowT: [T_R1 - 0.2, T_R2 - 0.2, T_R3 - 0.2], hi: 2, hiT: T_THIRD - 0.3, minT: S8 });
// a retreat turned into an attack: the whole road lit in blue, the enemy wrecked on both sides
road(MSR, { t: T_HOLD + 0.3, dur: 3.0, w: 14, color: "#2f63e0", casing: "#f7f3ea" });
B.caption("A RETREAT TURNED INTO AN ATTACK", T_RETREAT - 0.4, END - 0.3, "carth");
B.finish();
