// ending-2: final map - the Chosin road lit in blue from the reservoir to the sea; the three method lines; title (ending-2).
// Locked style: grid, grey Chinese counters (flags + size marks), Smith badge (K.badge), method card shared with inchon-9 / hagaru-9 / breakout-8.
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

const MSR = poly([[1861.4,1361.4],[1836.1,1351.6],[1821.3,1330.1],[1806.0,1307.0],[1786.2,1287.3],[1764.8,1269.4],[1745.8,1248.8],[1726.1,1229.0],[1711.8,1205.2],[1698.0,1181.7],[1686.0,1156.9],[1677.0,1130.9],[1666.3,1105.1],[1653.4,1080.3],[1641.6,1055.2],[1632.0,1029.4],[1613.5,1008.6],[1591.5,991.5],[1570.8,972.8],[1547.2,958.0],[1526.6,939.0],[1504.4,922.1],[1488.4,899.3],[1481.9,872.2],[1471.9,847.0],[1452.5,826.8],[1450.7,799.1],[1460.5,774.1],[1457.0,748.0],[1441.5,725.5],[1439.8,701.2],[1442.8,673.4],[1451.2,647.5],[1450.0,628.0],[1454.2,601.6],[1437.3,581.1],[1423.2,558.3],[1414.1,532.0],[1395.9,514.3],[1394.5,488.1],[1388.9,462.4],[1380.6,437.5],[1380.7,414.2],[1365.3,391.1],[1353.2,366.4],[1336.5,344.5],[1326.3,318.8],[1324.5,291.7],[1323.0,263.8],[1315.1,238.1],[1289.5,229.8],[1262.2,234.1],[1237.0,229.5],[1216.3,211.4],[1198.3,190.9],[1174.8,184.1],[1148.8,182.2],[1141.0,156.6],[1129.6,132.1],[1120.8,123.3]].reverse()); // Yudam-ni -> Hungnam (assets/msr_roads.json "chosin")
const HAG = G(40.385, 127.253), KOTO = G(40.285, 127.30), HUNG = G(39.83, 127.62), YUD = G(40.48, 127.11);
const S = P("ending-2");
const T_R1 = at("ending-2", "Build the lifeline"), T_R2 = at("ending-2", "Refuse to be"), T_R3 = at("ending-2", "Keep the division"),
  T_THREE = at("ending-2", "Three simple rules"), T_WHICH = at("ending-2", "Which of Smith"), T_NEXT = at("ending-2", "And which commander");

// ---------- camera: one slow pull-back over the whole road ----------
B.camera(camSfx([
  [0, 1500, 700, 0.95],
  [T_THREE, 1560, 800, 0.78],
  [END, 1560, 820, 0.72],
]));

B.image("assets/chosin_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
K.grid(G, 39.5, 40.8, 126.2, 128.5, 0.1, 0.1);
B.snow(0, END);
// the Chinese left wrecked in the mountains
[[40.44, 127.2], [40.36, 127.14], [40.42, 127.36], [40.3, 127.4], [40.24, 127.2], [40.12, 127.3], [40.08, 127.52]].forEach(([la, lo], i) =>
  U({ id: "r" + i, side: "rome", x: G(la, lo)[0], y: G(la, lo)[1], w: 34, h: 28, icon: "infantry", flag: "prc", size: "XX", t: 0.2 + i * 0.08 }));
B.grey([0, 1, 2, 3, 4, 5, 6].map((i) => "r" + i), 0.3, 0.01);
// the road, lit in blue from the reservoir to the sea
road(MSR, { t: 0.2, dur: 4.5, w: 14, color: "#2f63e0", casing: "#f7f3ea", ease: "power1.inOut" });
const glow = document.createElementNS(NS, "path");
glow.setAttribute("d", lineD(MSR.pts)); glow.setAttribute("fill", "none"); glow.setAttribute("stroke", "#9fc0ea");
glow.setAttribute("stroke-width", 44); glow.setAttribute("stroke-linecap", "round"); glow.setAttribute("opacity", 0);
OV.insertBefore(glow, OV.children[1] || null);
tl.to(glow, { opacity: 0.55, duration: 1.2, ease: "sine.inOut" }, 4.4);
B.city("YUDAM-NI", ...YUD, { left: true, size: 28, t: 0.3 });
B.city("HAGARU-RI", ...HAG, { left: true, size: 30, t: 0.8 });
B.city("KOTO-RI", ...KOTO, { size: 28, t: 1.6 });
B.city("HUNGNAM", ...HUNG, { size: 32, t: 4.2 });
B.label("SEA OF JAPAN", 2380, 1360, { cls: "sea", size: 44, t: 4.4 });
B.label("CHOSIN RESERVOIR", ...G(40.5, 127.26), { cls: "river", size: 30, t: 0.4, anchor: [0, -50] });

// the three rules, one by one
gsap.set(document.getElementById("date"), { autoAlpha: 0 });
B.dim(T_R1 - 1.0, T_THREE + 2.6, 0.55);
methodCard({ t: T_R1 - 0.8, until: T_THREE + 2.2, rowT: [T_R1 - 0.2, T_R2 - 0.2, T_R3 - 0.2], hi: -1 });
// title + Smith badge
K.badge({ name: "MAJ. GEN. O.P. SMITH", role: "1ST MARINE DIVISION", photo: "assets/media/smith_head.png", flag: "us", side: "carth", corner: "tr", t: T_THREE + 2.4 });
B.title("MAJOR GENERAL", "O.P. SMITH", "THE PROFESSOR", T_THREE + 2.8, T_WHICH + 0.4);
SFX("hit", T_THREE + 2.9); // final title card
B.caption("WHICH MOVE IMPRESSED YOU MOST?", T_WHICH + 0.5, T_NEXT - 0.1, "carth");
B.caption("WHO SHOULD I COVER NEXT? TELL ME IN THE COMMENTS", T_NEXT + 0.1, END - 0.2, "carth");
B.finish();
