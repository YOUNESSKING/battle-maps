// ending-1: the Marines back in the fight; Ridgway turns the war around (Korea, Dec 1950 - Mar 1951). UN = blue ("carth"), Chinese = red ("rome").
// Locked style: Hungnam -> Pusan by sea (a ship sails the route), the early-1951 front as a two-colour day front with "E"-look
// territory (assets/korea_land.png) that moves north (to + moveT), Ridgway badge (K.badge), counters with flags + size marks.
// ---------- projection (assets/korea.json: zoom 8) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 54556).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 24399).toFixed(1)];
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
const MASK = "assets/korea_land.png";

const S = P("ending-1");
const T_BACK = at("ending-1", "back in the fight"), T_WEEKS = at("ending-1", "Only weeks later"), T_RIDG = at("ending-1", "Matthew Ridgway"),
  T_TURN = at("ending-1", "turn the war around"), T_SURV = at("ending-1", "He did it with"), T_BEST = at("ending-1", "the First Marine Division");
const HUNG = G(39.83, 127.62), PUSAN = G(35.1, 129.04);

// ---------- camera ----------
B.camera(camSfx([
  [0, 1460, 820, 0.7],
  [T_WEEKS, 1480, 900, 0.8],
  [T_RIDG + 0.5, 1420, 960, 1.2],
  [T_TURN + 3.0, 1440, 900, 1.25],
  [T_BEST, 1480, 900, 1.4],
  [END, 1490, 890, 1.5],
]));

// ---------- base ----------
K.grid(G, 33, 43, 123, 132, 0.5, 0.1);
B.showDate(0.2);
B.date("DECEMBER 1950", 0.4, T_WEEKS, 38);
B.date("JANUARY – MARCH 1951", T_WEEKS + 0.3, null, 32);
B.label("NORTH KOREA", ...G(39.35, 126.6), { cls: "country", size: 46, t: 0.3, until: T_RIDG });
B.label("SOUTH KOREA", ...G(36.15, 128.05), { cls: "country", size: 46, t: 0.5, until: T_RIDG });
B.label("SEA OF JAPAN", ...G(38.9, 131.1), { cls: "sea", size: 44, t: 0.6, until: T_RIDG });
B.label("YELLOW SEA", ...G(36.4, 124.2), { cls: "sea", size: 44, t: 0.7, until: T_RIDG });
B.line([[860, 880], [1705, 880]], { dash: "34 22", width: 6, t: 0.5, dur: 1.4 });
B.label("38TH PARALLEL", 1722, 880, { cls: "tg", size: 30, t: 1.4, until: T_RIDG, anchor: [0, -50] });

// the Chosin road, glowing
const route = GL([[40.385, 127.253], [40.285, 127.30], [40.17, 127.38], [39.92, 127.54], [39.83, 127.62]]);
const glow = document.createElementNS(NS, "path");
glow.setAttribute("d", lineD(route)); glow.setAttribute("fill", "none"); glow.setAttribute("stroke", "#fff6d8");
glow.setAttribute("stroke-width", 26); glow.setAttribute("stroke-linecap", "round"); glow.setAttribute("opacity", 0);
OV.appendChild(glow);
tl.to(glow, { opacity: 0.8, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.4);
tl.to(glow, { opacity: 0, duration: 0.5 }, T_RIDG);
road(poly(smooth(route, 8)), { t: 0.3, dur: 1.0, w: 8, color: "#2f63e0", casing: "#f7f3ea", until: T_RIDG });
B.label("CHOSIN", route[0][0] - 20, route[0][1], { cls: "tg", size: 30, t: 0.6, until: T_RIDG, anchor: [-100, -50] });
B.city("HUNGNAM", ...HUNG, { size: 26, t: 0.8, until: T_RIDG });
B.city("PUSAN", ...PUSAN, { left: true, size: 26, t: 1.0, until: T_RIDG });

// by sea to the south: the route, and a transport sailing it
const SEA = [[HUNG[0] + 20, HUNG[1] + 10], [1640, 520], [1820, 760], [1860, 1120], [1800, 1430], [PUSAN[0] + 14, PUSAN[1] - 6]];
B.arrow({ side: "white", pts: SEA, width: 16, t: 0.9, dur: 3.0, until: T_RIDG });
const SQ = poly(smooth(SEA, 10)), boat = ship(0, 0, { w: 64, color: "#1f4fc4", t: 1.0, until: T_RIDG - 0.3, dx: 0 });
const bp = { d: 0 };
tl.to(bp, { d: SQ.len * 0.97, duration: T_RIDG - 1.6, ease: "sine.inOut", onUpdate: () => { const [x, y] = posAt(SQ, bp.d); gsap.set(boat, { left: x - 32, top: y - 30 }); } }, 1.0);
B.label("BY SEA", 1900, 900, { cls: "tg", size: 30, t: 2.4, until: T_RIDG, anchor: [0, -50] });
B.caption("THE 1ST MARINE DIVISION IS BACK IN THE FIGHT", T_BACK + 0.3, T_WEEKS + 0.6, "carth");

// Ridgway takes over the battered UN army; the front (two-colour: blue south, red north) moves north
const frontA = GL([[36.98, 126.75], [37.02, 127.15], [37.1, 127.55], [37.25, 128.0], [37.4, 128.6], [37.5, 129.15]]);
const frontB = GL([[37.75, 126.6], [37.85, 127.0], [37.95, 127.45], [38.05, 127.9], [38.15, 128.3], [38.3, 128.62]]);
const TF = T_WEEKS + 0.6, TM = T_TURN + 0.4;
K.front({ pts: frontA, to: frontB, sideA: "rome", sideB: "carth", t: TF, dur: 1.6, moveT: TM, moveDur: 3.0, until: END + 1 });
K.frontTint({ pts: frontA, to: frontB, dir: 1, depth: 170, color: "#4a6a9a", t: TF, alpha: 0.34, mask: MASK, moveT: TM, moveDur: 3.0 });
K.frontTint({ pts: frontA, to: frontB, dir: -1, depth: 170, color: "#a8503c", t: TF + 0.3, alpha: 0.34, mask: MASK, moveT: TM, moveDur: 3.0 });
K.badge({ name: "LT. GEN. MATTHEW RIDGWAY", role: "EIGHTH ARMY · FROM DEC 1950", photo: "assets/media/ridgway_head.png", flag: "us", side: "carth", corner: "tr", t: T_RIDG - 0.3, until: T_SURV });
B.city("SEOUL", ...G(37.57, 126.98), { size: 20, r: 6, t: T_WEEKS + 0.8 });
const blue = [[36.8, 126.95], [36.9, 127.7], [37.0, 128.1], [37.15, 128.5], [37.25, 128.95]];
const blueB = [[37.45, 126.95], [37.6, 127.6], [37.7, 127.95], [37.82, 128.3], [37.95, 128.55]];
blue.forEach(([la, lo], i) => {
  U({ id: "b" + i, side: "carth", x: G(la, lo)[0], y: G(la, lo)[1], w: 28, h: 24, icon: "infantry", flag: "us", size: i === 2 ? "XX" : "XXX", label: i === 2 ? "1ST MARINE DIV" : null, fs: 13, t: T_WEEKS + 1.2 + i * 0.15 });
  B.move("b" + i, TM + 0.1 + i * 0.1, 3.0, ...G(...blueB[i]));
});
gsap.set(B.units.b2.el, { zIndex: 3 });
const red = [[37.3, 126.9], [37.3, 127.4], [37.4, 127.85], [37.55, 128.3], [37.7, 128.8]];
red.forEach(([la, lo], i) => {
  U({ id: "r" + i, side: "rome", x: G(la, lo)[0], y: G(la, lo)[1], w: 28, h: 24, icon: "infantry", flag: "prc", size: "XXX", t: T_WEEKS + 1.0 + i * 0.12 });
  B.move("r" + i, TM + i * 0.1, 3.0, ...G(la + 0.9, lo));
});
SFX("tick", T_WEEKS + 1.1); // counters drop in
[[[37.0, 126.85], [37.3, 126.82], [37.55, 126.78]], [[37.05, 127.8], [37.35, 127.77], [37.62, 127.75]], [[37.2, 128.3], [37.5, 128.3], [37.8, 128.33]]]
  .forEach((pts, i) => B.arrow({ side: "carth", pts: GL(pts), width: 12, t: TM + 0.1 + i * 0.3, dur: 2.4, until: T_BEST }));
B.caption("RIDGWAY TURNS THE WAR AROUND", T_TURN - 0.4, T_BEST - 0.3, "carth");
// the Marines: among the best
const mx = G(...blueB[2]);
K.target(mx[0], mx[1], T_BEST + 0.2, { r: 30, side: "#f7f3ea", until: END });
B.caption("1ST MARINE DIVISION · AMONG THE BEST", T_BEST + 0.2, END - 0.3, "carth");
K.raiseTerritory();
B.finish();
