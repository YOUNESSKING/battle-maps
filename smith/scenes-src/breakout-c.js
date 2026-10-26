// breakout-c: Funchilin Pass, Dec 7-9 1950 - the blown bridge and the bridge dropped from the sky (breakout-4 .. breakout-6).
// Locked style: Koto-ri pocket as a two-colour front with territory; the bridge blown (explosions + smoke column), ~29 FT gap;
// C-119s (K.aircraft "cargo") over Koto-ri drop 8 treadway spans under parachutes (one drifts into Chinese lines);
// Hill 1081 seized in the snowstorm (target ring, the front moves off the height, red ground lost); new bridge DEC 9.
// ---------- projection (assets/funchilin.json: zoom 13) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 13, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 1788887).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 791528).toFixed(1)];
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
const MASK = "assets/funchilin_land.png";

// steel treadway span under a parachute: released at `from` (the aircraft), drifts down to land at (x, y)
const chute = (x, y, t, o = {}) => {
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - 34}px;top:${y - 78}px;width:68px;height:86px;`;
  el.innerHTML = `<svg class="cn" viewBox="0 0 68 86" style="position:absolute;inset:0;overflow:visible">
      <path d="M4 30 Q34 -10 64 30 Q56 24 49 30 Q41 23 34 30 Q27 23 19 30 Q12 24 4 30 Z" fill="#f2ede0" stroke="#3a342a" stroke-width="2.5"/>
      <path d="M19 30 Q34 -6 49 30" fill="none" stroke="#c9412e" stroke-width="3"/>
      <path d="M4 30 L22 72 M19 30 L28 72 M49 30 L40 72 M64 30 L46 72" stroke="#3a342a" stroke-width="1.6"/></svg>
    <div class="sp" style="position:absolute;left:14px;top:68px;width:40px;height:14px;background:#8d949a;border:2.5px solid #23262a;box-shadow:0 3px 5px rgba(0,0,0,0.4);
      background-image:repeating-linear-gradient(90deg, transparent 0 7px, rgba(20,20,20,0.45) 7px 9px);"></div>`;
  PINS.appendChild(el);
  const cn = el.querySelector(".cn"), sp = el.querySelector(".sp"), dur = o.dur || 2.6, f = o.from || [x - 120, y - 300];
  gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, x: f[0] - x, y: f[1] - y + 78, scale: 0.35 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: dur, ease: "sine.out", immediateRender: false }, t);
  tl.fromTo(cn, { rotation: -8, transformOrigin: "50% 90%" }, { rotation: 6, duration: dur / 2, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, t);
  tl.to(cn, { autoAlpha: 0, scaleY: 0.3, y: 30, duration: 0.5 }, t + dur);
  return { el, sp };
};

// ---------- geography ----------
const KOTO = G(40.285, 127.30), CHIN = G(40.17, 127.38);
const ROADPTS = [[1236, -20], [1250, 150], [1264, 238], [1300, 330], [1350, 420], [1335, 520], [1395, 610], [1385, 700], [1440, 810], [1505, 885], [1580, 955], [1655, 1040], [1730, 1114], [1810, 1230], [1880, 1400], [1930, 1660]];
const ROAD = poly(smooth(ROADPTS, 14));
let DB = 0, best = 1e9;
ROAD.pts.forEach((p, i) => { const e = Math.hypot(p[0] - 1440, p[1] - 810); if (e < best) { best = e; DB = ROAD.L[i]; } });
const [BX, BY, BA] = posAt(ROAD, DB), BDEG = BA * 180 / Math.PI;
const north = poly(ROAD.pts.filter((_, i) => ROAD.L[i] <= DB + 1)), south = poly(ROAD.pts.filter((_, i) => ROAD.L[i] >= DB - 1));
const DK = ROAD.L[ROAD.pts.findIndex((p) => Math.hypot(p[0] - KOTO[0], p[1] - KOTO[1]) < 12)] || 260;
const H1081 = [1300, 930]; // Hill 1081, the height south-west of the bridge site that dominated the pass

const S4 = P("breakout-4"), S5 = P("breakout-5"), S6 = P("breakout-6");
const a4 = (s, o = 0) => at("breakout-4", s, o), a5 = (s, o = 0) => at("breakout-5", s, o), a6 = (s, o = 0) => at("breakout-6", s, o);
const T_PASS = a4("the Funchilin Pass"), T_CLIFF = a4("ran along a cliff"), T_BRIDGE = a4("crossed a narrow"), T_PIPES = a4("pipes of a"),
  T_BLOWN = a4("The Chinese had blown"), T_GAP = a4("gap of nearly"), T_DROP = a4("sheer drop"), T_NOWAY = a4("There was no way"), T_GONE = a4("For trucks");
const T_SKY = a5("drop a bridge"), T_DEC7 = a5("On December seventh"), T_C119 = a5("C-119"), T_PUSH = a5("pushed out eight"), T_TONS = a5("two tons"),
  T_CHUTES = a5("giant parachutes"), T_LOST = a5("One fell"), T_DAMAGED = a5("another was damaged"), T_ENOUGH = a5("But there were enough");
const T_STORM = a6("While Marine infantry"), T_BLIZ = a6("in a blizzard"), T_HAUL = a6("the engineers hauled"), T_BUILT = a6("built the new"),
  T_DONE = a6("It was finished"), T_NARROW = a6("It was so narrow"), T_INCH = a6("inches to spare"), T_NIGHT = a6("the crossing went on");

// ---------- camera ----------
const DZ = [KOTO[0] + 20, KOTO[1] + 40]; // drop zone inside the Koto-ri perimeter
B.camera(camSfx([
  [0, 1440, 700, 0.74],
  [T_PASS, 1430, 660, 0.9],
  [T_CLIFF + 0.4, 1370, 580, 1.35],
  [T_BRIDGE + 0.4, BX, BY - 10, 2.2],
  [T_GAP, BX, BY, 2.35],
  [T_DROP + 0.6, BX, BY, 2.55],
  [T_NOWAY + 0.3, 1430, 760, 1.35],
  [T_GONE + 1.0, 1520, 880, 1.02],
  [S5 - 0.2, 1500, 860, 0.95],
  [T_SKY + 0.6, 1600, 800, 0.74],
  [T_C119 - 0.6, 1600, 700, 0.8],
  [T_PUSH + 0.2, DZ[0] + 60, DZ[1] + 60, 1.45],
  [T_LOST - 0.4, DZ[0] - 40, DZ[1] + 60, 1.6],
  [T_ENOUGH + 1.6, DZ[0] - 20, DZ[1] + 60, 1.55],
  [S6 + 0.4, 1380, 760, 1.0],
  [T_HAUL, 1370, 760, 1.05],
  [T_BUILT - 0.5, 1410, 760, 1.4],
  [T_BUILT + 1.0, BX, BY - 5, 2.3],
  [T_NARROW, BX, BY, 2.5],
  [T_INCH + 0.4, BX, BY, 3.1],
  [T_NIGHT + 0.2, BX + 10, BY + 10, 2.2],
  [END, 1470, 840, 1.55],
]));

// ---------- base ----------
K.grid(G, 40.05, 40.4, 127.0, 127.7, 0.02, 0.2);
B.snow(0, END);
B.showDate(0.3);
B.date("DECEMBER 7, 1950", 0.5, T_BLIZ - 0.2, 36);
B.date("DECEMBER 9, 1950", T_BLIZ, null, 36);
const roadN = road(north, { t: 0.4, dur: 1.8, w: 10 });
const roadS = road(south, { t: 1.8, dur: 1.4, w: 10 });
B.label("KOTO-RI", KOTO[0] + 210, KOTO[1] - 40, { cls: "city", size: 34, t: 0.8, until: T_BRIDGE, anchor: [0, -50] });
B.city("CHINHUNG-NI", ...CHIN, { size: 34, t: 1.2, until: T_BRIDGE });
B.label("TO HUNGNAM", 1960, 1340, { cls: "tg", size: 30, t: 2.4, until: T_BRIDGE, anchor: [0, -50] });
B.label("FUNCHILIN PASS", 1180, 560, { cls: "place", size: 52, t: T_PASS - 0.3, until: T_BRIDGE + 0.2, anchor: [-100, -50] });
tl.to(document.querySelectorAll(".place:not(.tg):not(.city):not(.river):not(.sea):not(.country)"), { color: "#e3232f", duration: 0.01 }, 0);

// ---------- the Koto-ri pocket: two-colour front (blue inside, red outside) + territory ----------
const RK = ringPts(DZ[0], DZ[1] - 10, 200, 165, 22, 0.06);
const FK = K.front({ pts: RK, sideA: "rome", sideB: "carth", t: 0.5, dur: 1.6, until: END + 1 });
ringTint(RK, -1, 70, "#4a6a9a", 0.6, { mask: MASK });
ringTint(RK, +1, 130, "#a8503c", 0.8, { mask: MASK });
[["k0", -40, 20, "III", "1ST MARINES"], ["k1", 80, 40, "II"], ["k2", 10, 125, "II"]].forEach(([id, dx, dy, size, label]) =>
  U({ id, side: "carth", x: KOTO[0] + dx, y: KOTO[1] + dy, w: 36, h: 30, icon: "infantry", flag: "us", size, label, fs: 15, t: 1.0 }));

// cliff hachures along the east side of the descent
const cliffPts = [];
for (let d = DK + 200; d < DB - 20; d += 16) { const [x, y, a] = posAt(ROAD, d); cliffPts.push([x - Math.sin(a) * -22, y + Math.cos(a) * -22, a]); }
const cliffD = cliffPts.map(([x, y, a]) => { const ex = x - Math.sin(a) * -20, ey = y + Math.cos(a) * -20; return `M ${x.toFixed(1)} ${y.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`; }).join(" ");
svgEl(`<path d="${lineD(cliffPts.map((p) => [p[0], p[1]]))}" fill="none" stroke="#2a2218" stroke-width="5"/><path d="${cliffD}" stroke="#2a2218" stroke-width="3.5"/>`, T_CLIFF, T_NOWAY);
B.label("CLIFF", ...normAt(ROAD, DK + 400, -80), { cls: "tg", size: 22, t: T_CLIFF + 0.4, until: T_NOWAY, anchor: [-50, -50] });

// penstock pipes of the power plant crossing under the road
const pdx = -290, pdy = 330, pl = Math.hypot(pdx, pdy), ux = pdx / pl, uy = pdy / pl;
const pipes = [-9, -3, 3, 9].map((o) => { const x0 = BX - ux * 170 - uy * o, y0 = BY - uy * 170 + ux * o; return `M ${x0.toFixed(1)} ${y0.toFixed(1)} L ${(x0 + ux * 340).toFixed(1)} ${(y0 + uy * 340).toFixed(1)}`; }).join(" ");
const PX = BX + ux * 190, PY = BY + uy * 190;
const pipesG = svgEl(`<path d="${pipes}" stroke="#20262c" stroke-width="6" stroke-linecap="round"/><path d="${pipes}" stroke="#8a97a3" stroke-width="3" stroke-linecap="round"/>
  <rect x="${PX - 26}" y="${PY - 18}" width="52" height="36" fill="#6e7780" stroke="#20262c" stroke-width="4"/><rect x="${PX - 26}" y="${PY - 24}" width="52" height="8" fill="#3d444b"/>`, T_PIPES - 0.3, null, 0.6);
OV.insertBefore(pipesG, OV.children[1] || null);
B.label("POWER PLANT PIPES", PX + 40, PY + 6, { cls: "tg", size: 18, t: T_PIPES, until: T_BLOWN, anchor: [0, -50] });

// the concrete bridge, then the gap
const brG = svgEl(`<g transform="translate(${BX} ${BY}) rotate(${BDEG})"><rect x="-34" y="-14" width="68" height="28" fill="#e2d8c0" stroke="#1d1a14" stroke-width="4"/>
  <line x1="-34" y1="-14" x2="34" y2="-14" stroke="#1d1a14" stroke-width="6"/><line x1="-34" y1="14" x2="34" y2="14" stroke="#1d1a14" stroke-width="6"/></g>`, T_BRIDGE, null, 0.4);
gsap.set(brG, { svgOrigin: `${BX} ${BY}` });
tl.fromTo(brG, { scale: 1.8 }, { scale: 1, duration: 0.5, ease: "back.out(2)" }, T_BRIDGE);
B.label("THE BRIDGE", BX + 34, BY - 30, { cls: "tg", size: 18, t: T_BRIDGE + 0.3, until: T_BLOWN, anchor: [0, -100] });
// the bridge is blown: three demolition blasts (varied size and spacing), then a smoke column
const TB = T_BLOWN + 0.5;
[[0, 0, 0, 22], [10, -8, 0.27, 17], [-8, 6, 0.6, 19]].forEach(([dx, dy, dt, r], k) => K.impact(BX + dx, BY + dy, TB + dt, { r, puffs: 4 }));
tl.to(brG, { autoAlpha: 0, duration: 0.15 }, TB + 0.1);
smokeCol(BX + 4, BY - 4, TB + 0.8, T_GONE + 3, { r: 9, rise: 36 });
const gapG = svgEl(`<g transform="translate(${BX} ${BY}) rotate(${BDEG})"><path d="M -30 -20 L -22 -11 L -28 -2 L -20 7 L -27 20 L 28 20 L 21 10 L 29 1 L 20 -9 L 27 -20 Z" fill="#17130e" stroke="#c4121f" stroke-width="3.5" stroke-dasharray="7 4"/></g>`, TB + 0.1, T_BUILT + 0.6, 0.2);
for (let i = 0; i < 6; i++) { // debris
  const d = document.createElement("div"), ang = i * 1.05 + 0.4;
  d.style.cssText = `position:absolute;left:${BX - 5}px;top:${BY - 4}px;width:10px;height:8px;background:#cfc4aa;border:2px solid #1d1a14;`;
  PINS.appendChild(d); gsap.set(d, { autoAlpha: 0 });
  tl.set(d, { autoAlpha: 1 }, TB + 0.1);
  tl.fromTo(d, { x: 0, y: 0, rotation: 0 }, { x: Math.cos(ang) * 60, y: Math.sin(ang) * 40 + 70, rotation: 200 + i * 40, duration: 1.1, ease: "power1.in", immediateRender: false }, TB + 0.1);
  tl.to(d, { autoAlpha: 0, duration: 0.3 }, TB + 1.0);
}
// gap measurement
const gm = (s) => { const c = Math.cos(BA), si = Math.sin(BA), nx = -si, ny = c; return [BX + c * s + nx * -38, BY + si * s + ny * -38]; };
svgEl(`<path d="M ${gm(-30).join(" ")} L ${gm(30).join(" ")}" stroke="#f7f3ea" stroke-width="4"/><circle cx="${gm(-30)[0]}" cy="${gm(-30)[1]}" r="4" fill="#f7f3ea"/><circle cx="${gm(30)[0]}" cy="${gm(30)[1]}" r="4" fill="#f7f3ea"/>`, T_GAP, T_NOWAY + 0.2, 0.3);
B.label("~29 FT GAP", BX + 52, BY - 20, { cls: "tg", size: 22, t: T_GAP + 0.2, until: T_NOWAY + 0.2, anchor: [0, -100] });
B.label("SHEER DROP", BX + 40, BY + 26, { cls: "tg", size: 20, t: T_DROP, until: T_NOWAY + 0.2, anchor: [0, 0] });
// Chinese on the heights above the pass
const reds = [["r0", 1215, 700, "II"], ["r1", 1165, 820, "II"], ["r2", 1575, 700, "II"], ["r3", H1081[0], H1081[1] - 6, "II"]];
reds.forEach(([id, x, y, size], i) => U({ id, side: "rome", x, y, w: 40, h: 32, icon: "infantry", flag: "prc", size, label: i === 0 ? "CHINESE" : null, fs: 15, t: T_BLOWN - 1.0 + i * 0.2 }));
B.caption("THE CHINESE BLEW THE BRIDGE", T_BLOWN + 0.8, T_NOWAY - 0.2, "rome");
B.caption("NO WAY AROUND", T_NOWAY + 0.2, T_GONE - 0.1, "rome");
tl.to(roadS.querySelector(".rd"), { stroke: "#8a877f", duration: 0.8 }, T_GONE + 0.6);
tl.to(roadS, { opacity: 0.55, duration: 0.8 }, T_GONE + 0.6);
B.caption("THE ROAD TO THE SEA IS CUT", T_GONE + 0.8, S5 - 0.1, "rome");

// ---------- breakout-5: a bridge from the sky ----------
B.arrow({ side: "carth", pts: [[2860, 1560], [2380, 1060], [1900, 640], [DZ[0] + 260, DZ[1] + 40]], width: 20, t: T_SKY + 0.2, dur: 2.2, until: T_C119 });
B.label("FROM JAPAN", 2250, 1160, { cls: "tg", size: 40, t: T_SKY + 1.2, until: T_C119, anchor: [-50, -50] });
// three C-119 Flying Boxcars cross the drop zone; each pushes out spans as it passes over
const drops = [[-60, -10], [40, -50], [110, 20], [-20, 80], [60, 105], [-90, 70], [130, 110], [-120, -40]];
const lin = (pts, f) => { const Q = poly(pts); return posAt(Q, Q.len * f); }; // K.aircraft moves linearly along its polyline
const CH = [];
[0, 1, 2].forEach((i) => {
  const t0 = T_C119 - 1.4 + i * 1.8, dur = 6.4;
  const pts = [[2700 + i * 60, 1500 + i * 40], [1900, 760 + i * 30], [DZ[0] + 60 - i * 30, DZ[1] + 20 + i * 30], [DZ[0] - 560, DZ[1] - 260 + i * 20]];
  K.aircraft({ kind: "cargo", side: "carth", size: 124, alt: 44, pts, t: t0, dur, until: t0 + dur });
  // release points: while the aircraft crosses the drop zone (about 2/3 of the way along its path)
  const mine = i === 2 ? [6, 7] : [i * 3, i * 3 + 1, i * 3 + 2];
  mine.forEach((j, k) => {
    const f = 0.6 + k * 0.035, tr = Math.max(t0 + dur * f, T_PUSH + 0.2 + j * 0.15), from = lin(pts, f);
    CH[j] = chute(DZ[0] + drops[j][0], DZ[1] + drops[j][1], tr, { dur: 2.6, from });
  });
});
B.label("C-119 FLYING BOXCARS", DZ[0] + 330, DZ[1] - 120, { cls: "tg", size: 26, t: T_C119 + 0.2, until: T_TONS, anchor: [0, -50] });
B.caption("C-119 FLYING BOXCARS · DEC 7", T_C119 + 0.2, T_PUSH - 0.2, "carth");
B.caption("8 TREADWAY BRIDGE SPANS", T_PUSH + 0.8, T_TONS - 0.1, "carth");
B.caption("ABOUT 2 TONS EACH · GIANT PARACHUTES", T_TONS + 0.1, T_LOST - 0.2, "carth");
// one span drifts over the perimeter into Chinese hands, one is damaged
const RC = [DZ[0] - 330, DZ[1] + 20];
U({ id: "rc", side: "rome", x: RC[0], y: RC[1], w: 36, h: 30, icon: "infantry", flag: "prc", size: "II", t: T_PUSH });
tl.to(CH[7].el, { x: RC[0] - (DZ[0] + drops[7][0]) + 10, y: RC[1] - (DZ[1] + drops[7][1]) + 34, duration: 1.6, ease: "power1.inOut" }, T_LOST - 0.3);
tl.to(CH[7].sp, { backgroundColor: "#c4121f", duration: 0.4 }, T_LOST + 1.2);
B.label("CAPTURED", RC[0], RC[1] + 66, { cls: "tg", size: 20, t: T_LOST + 1.2, until: S6, anchor: [-50, -50] });
tl.to(CH[5].sp, { backgroundColor: "#55524c", rotation: 18, duration: 0.5 }, T_DAMAGED + 0.2);
cutX(DZ[0] + drops[5][0], DZ[1] + drops[5][1], T_DAMAGED + 0.3, S6, 12);
B.label("DAMAGED", DZ[0] + drops[5][0], DZ[1] + drops[5][1] + 34, { cls: "tg", size: 20, t: T_DAMAGED + 0.4, until: S6, anchor: [-50, -50] });
[0, 1, 2, 3, 4, 6].forEach((i, k) => tl.fromTo(CH[i].sp, { boxShadow: "0 0 0 0 rgba(255,244,200,0)" }, { boxShadow: "0 0 14px 6px rgba(255,244,200,0.95)", duration: 0.5, yoyo: true, repeat: 1, immediateRender: false }, T_ENOUGH + k * 0.12));
B.caption("ENOUGH SPANS TO BRIDGE THE GAP", T_ENOUGH + 0.2, S6 - 0.1, "carth");
CH.forEach((c) => tl.to(c.el, { autoAlpha: 0, duration: 0.6 }, T_HAUL + 0.2));
B.hideUnits(["rc"], S6, 0.5);

// ---------- breakout-6: Hill 1081 in the snowstorm ----------
B.fog(T_BLIZ - 0.4, T_BUILT, 0.45);
B.label("HILL 1081", H1081[0] - 50, H1081[1] - 40, { cls: "tg", size: 30, t: S6 + 0.2, until: T_BUILT, anchor: [-100, -50] });
K.target(H1081[0], H1081[1], S6 + 0.4, { r: 70, until: T_HAUL + 1.5 });
// the front on the height: blue attacking from the south, red holding the hill; it moves off the height when the hill falls
const F0 = [[1170, 1060], [1260, 1040], [1350, 1020], [1420, 985], [1480, 935]];
const F1 = [[1080, 990], [1130, 930], [1180, 870], [1220, 815], [1265, 770]];
const T_TAKE = T_BLIZ + 1.4;
const FH = K.front({ pts: F0, to: F1, sideA: "rome", sideB: "carth", t: S6 + 0.3, dur: 1.2, moveT: T_TAKE, moveDur: 3.0, until: END + 1 });
K.frontTint({ pts: F0, to: F1, dir: 1, depth: 170, color: "#4a6a9a", t: S6 + 0.3, alpha: 0.34, mask: MASK, moveT: T_TAKE, moveDur: 3.0 });
K.frontTint({ pts: F0, dir: -1, depth: 95, color: "#a8503c", t: S6 + 0.5, alpha: 0.34, mask: MASK }).forEach((pl) => K.lose(pl, T_TAKE - 0.3));
K.frontTint({ pts: F1, dir: -1, depth: 170, color: "#a8503c", t: T_TAKE + 1.5, alpha: 0.34, mask: MASK });
U({ id: "b1", side: "carth", x: CHIN[0] - 50, y: CHIN[1] - 20, w: 40, h: 32, icon: "infantry", flag: "us", size: "II", label: "1/1 MARINES", fs: 15, t: S6 + 0.2 });
B.arrow({ side: "carth", pts: [[CHIN[0] - 90, CHIN[1] - 40], [1520, 1080], [1400, 1010], [H1081[0] + 20, H1081[1] + 20]], width: 16, t: T_STORM + 0.6, dur: 2.4, until: T_HAUL + 3 });
B.arrow({ side: "carth", pts: [[KOTO[0] - 80, KOTO[1] + 190], [1160, 480], [1170, 600], [1205, 670]], width: 14, t: T_STORM + 1.0, dur: 2.4, until: T_HAUL + 3 });
B.arrow({ side: "carth", pts: [[1395, 600], [1480, 640], [1545, 690]], width: 12, t: T_STORM + 1.6, dur: 1.4, until: T_HAUL + 3 });
SFX("mg", T_BLIZ + 0.3); // Marines storm the heights above the pass
[[H1081[0] - 30, H1081[1] - 20, 0, 13], [H1081[0] + 25, H1081[1] + 5, 0.45, 11], [1190, 690, 1.1, 12]].forEach(([x, y, dt, r]) => K.impact(x, y, T_BLIZ + 0.6 + dt, { r })); // supporting mortar rounds on the heights
B.grey(["r0", "r1", "r2", "r3"], T_TAKE, 0.8);
B.caption("HILL 1081 TAKEN IN A BLIZZARD", T_TAKE + 0.2, T_HAUL - 0.2, "carth");
B.hideUnits(["r0", "r1", "r2", "r3"], T_HAUL + 2.5, 0.8);
// engineers haul the spans down the road
["e0", "e1", "e2", "e3"].forEach((id, i) => {
  const d0 = DK + 90 - i * 40, [x, y] = posAt(ROAD, d0);
  U({ id, side: "carth", x, y, w: 32, h: 26, icon: "eng", flag: "us", label: i === 0 ? "ENGINEERS" : null, t: T_HAUL - 0.4 + i * 0.12 });
  follow(id, ROAD, T_HAUL + 0.3 + i * 0.1, (T_BUILT - T_HAUL) + 0.6, d0, DB - 48 - i * 30, "power1.inOut");
  B.hideUnits([id], T_NARROW - 0.3, 0.5);
});
B.units.e0.el.querySelector(".tag").style.cssText += "font-size:14px;position:absolute;left:40px;top:-2px;margin:0;";
const newBr = svgEl(`<g transform="translate(${BX} ${BY}) rotate(${BDEG})"><rect x="-40" y="-14" width="80" height="28" fill="#8d949a" stroke="#1d1a14" stroke-width="4"/>
  <rect x="-40" y="-11" width="80" height="8" fill="#5d646a"/><rect x="-40" y="3" width="80" height="8" fill="#5d646a"/>
  ${[-30, -18, -6, 6, 18, 30].map((x) => `<line x1="${x}" y1="-14" x2="${x}" y2="14" stroke="#1d1a14" stroke-width="1.5"/>`).join("")}</g>`, T_BUILT + 0.6, null, 0.2);
gsap.set(newBr, { svgOrigin: `${BX} ${BY}` });
tl.fromTo(newBr, { scale: 0.2 }, { scale: 1, duration: 0.7, ease: "back.out(1.8)" }, T_BUILT + 0.6); // new bridge swings into place (silent: no library sound for bridges)
tl.to(roadS.querySelector(".rd"), { stroke: "#f4e9cb", duration: 0.8 }, T_BUILT + 0.8);
tl.to(roadS, { opacity: 1, duration: 0.8 }, T_BUILT + 0.8);
B.caption("DEC 9 · THE BRIDGE IS COMPLETE", T_DONE, T_NARROW - 0.2, "carth");
SFX("hit", T_DONE + 0.1); // DEC 9 stamp
B.label("INCHES TO SPARE", BX + 36, BY - 34, { cls: "tg", size: 16, t: T_INCH - 0.2, until: T_NIGHT + 1.0, anchor: [0, -100] });
// the crossing, through the night (locked night palette on the fronts)
B.dim(T_NIGHT - 0.2, END + 1, 0.55);
K.night({ lines: [FK, FH], tOn: T_NIGHT - 0.2 });
B.hideUnits(["b1"], T_HAUL + 3, 0.6);
const conv = ["tank", "truck", "artillery", "truck", "tank", "truck", "infantry", "truck"];
conv.forEach((icon, i) => {
  const id = "x" + i, d0 = DB - 60 - i * 34, [x, y] = posAt(ROAD, d0);
  U({ id, side: "carth", x, y, w: 24, h: 20, icon, flag: "us", t: T_NARROW + 0.2 + i * 0.1 });
  follow(id, ROAD, T_INCH + 0.3 + i * 0.15, END - T_INCH - 0.3, d0, d0 + 330, "none");
});
B.caption("THE CROSSING GOES ON ALL NIGHT", T_NIGHT + 0.3, END - 0.3, "carth");
K.raiseTerritory();
B.finish();
