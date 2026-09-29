// breakout-b: Dec 6-7 1950, the column fights from Hagaru-ri to Koto-ri. UN = blue ("carth"), Chinese = red ("rome").
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
// sound: whoosh on big camera zooms (scale x1.6 or more within 6 s), at the fastest point of the move
const camSfx = (keys) => { for (let i = 1; i < keys.length; i++) { const r = keys[i][3] / keys[i - 1][3], d = keys[i][0] - keys[i - 1][0];
  if ((r >= 1.6 || r <= 1 / 1.6) && d <= 6) SFX("whoosh", Math.max(0, keys[i - 1][0] + d / 2 - 0.5)); } return keys; };
const tl = B.tl;

// ---------- projection (assets/chosin_close.json: zoom 12) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 12, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 893344).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 394786).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));

// ---------- scene-local helpers (shared by the breakout/ending scenes; no engine change) ----------
const NS = "http://www.w3.org/2000/svg";
const OV = document.getElementById("overlay"), PINS = document.getElementById("pins");
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
const ICON = {
  armor: `<ellipse cx="50" cy="50" rx="33" ry="21" fill="none" stroke="#f7f3ea" stroke-width="9"/>`,
  arty: `<circle cx="50" cy="50" r="15" fill="#f7f3ea"/>`,
  truck: `<line x1="0" y1="0" x2="100" y2="100" stroke="#f7f3ea" stroke-width="7"/><line x1="100" y1="0" x2="0" y2="100" stroke="#f7f3ea" stroke-width="7"/><circle cx="30" cy="84" r="9" fill="#f7f3ea"/><circle cx="70" cy="84" r="9" fill="#f7f3ea"/>`,
  eng: `<path d="M18 72 L18 34 L82 34 L82 72 M50 34 L50 72" fill="none" stroke="#f7f3ea" stroke-width="8"/>`,
};
const setIcon = (id, k) => { B.units[id].el.querySelector("svg").innerHTML = ICON[k]; };
const PLANE = {
  fighter: (c) => `<path d="M50 3 C54 3 56 10 56 20 L56 36 L97 46 L97 55 L56 52 L54 78 L70 86 L70 93 L50 90 L30 93 L30 86 L46 78 L44 52 L3 55 L3 46 L44 36 L44 20 C44 10 46 3 50 3 Z" fill="${c}" stroke="#f7f3ea" stroke-width="3.5" stroke-linejoin="round"/>`,
  cargo: (c) => `<g fill="${c}" stroke="#f7f3ea" stroke-width="3" stroke-linejoin="round"><path d="M1 38 L99 38 L99 47 L1 47 Z"/><path d="M29 30 L35 30 L35 86 L29 86 Z M65 30 L71 30 L71 86 L65 86 Z"/><path d="M24 82 L76 82 L76 90 L24 90 Z"/><path d="M43 14 C43 8 57 8 57 14 L57 62 L43 62 Z"/></g>`,
};
const plane = (o) => { // o: pts (world), t, dur, size, kind, color; o.sfx: engine sound (default prop: Corsair / C-47 / C-119), false = silent
  if (o.sfx !== false) SFX(o.sfx || "prop", Math.max(0, o.t + o.dur / 2 - 2.3)); // flyby clip is loudest mid-flight
  const Q = poly(smooth(o.pts, 10)), s = o.size || 90, el = document.createElement("div");
  el.style.cssText = `position:absolute;left:0;top:0;width:${s}px;height:${s}px;filter:drop-shadow(0 14px 8px rgba(0,0,0,0.45));`;
  el.innerHTML = `<svg viewBox="0 0 100 100" style="width:100%;height:100%;overflow:visible">${PLANE[o.kind || "fighter"](o.color || "#1f3f8f")}</svg>`;
  PINS.appendChild(el);
  const pr = { d: 0 }, place = () => { const [x, y, a] = posAt(Q, pr.d); gsap.set(el, { x: x - s / 2, y: y - s / 2, rotation: a * 180 / Math.PI + 90 }); };
  place(); gsap.set(el, { autoAlpha: 0 });
  tl.to(el, { autoAlpha: 1, duration: 0.3 }, o.t);
  tl.to(pr, { d: Q.len, duration: o.dur, ease: o.ease || "none", onUpdate: place }, o.t);
  tl.to(el, { autoAlpha: 0, duration: 0.4 }, o.t + o.dur - 0.4);
  return el;
};
const flash = (x, y, t, s = 90, sfx = "impact") => { // sfx: impact (shells), explosion (bombs / big blasts), hit, or false
  if (sfx) SFX(sfx, t);
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle, #fffbe0 0, #ffc040 30%, rgba(235,80,20,0.85) 52%, rgba(235,80,20,0) 72%);`;
  PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1.2, duration: 0.18, ease: "power2.out" }, t);
  tl.to(el, { autoAlpha: 0, scale: 1.7, duration: 0.55 }, t + 0.2);
};
const svgEl = (html, t, until, dur = 0.5) => { const g = document.createElementNS(NS, "g"); g.innerHTML = html; OV.appendChild(g); gsap.set(g, { autoAlpha: 0 }); tl.to(g, { autoAlpha: 1, duration: dur }, t); if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.5 }, until); return g; };
const cutX = (x, y, t, until, s = 26) => {
  const d = `M ${x - s} ${y - s} L ${x + s} ${y + s} M ${x + s} ${y - s} L ${x - s} ${y + s}`;
  const g = svgEl(`<path d="${d}" stroke="#f7f3ea" stroke-width="20" stroke-linecap="round"/><path d="${d}" stroke="var(--rome)" stroke-width="11" stroke-linecap="round"/>`, t, until, 0.01);
  gsap.set(g, { transformOrigin: `${x}px ${y}px` });
  tl.fromTo(g, { scale: 2.2 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, t);
  return g;
};
const trench = (x, y, ang, t, until, r = 34) => { // red dug-in arc facing the road
  const a0 = ang - 0.9, a1 = ang + 0.9, p = (a) => `${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}`;
  const d = `M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}`;
  return svgEl(`<path d="${d}" fill="none" stroke="#f7f3ea" stroke-width="13" stroke-linecap="round"/><path d="${d}" fill="none" stroke="var(--rome)" stroke-width="7" stroke-linecap="round" stroke-dasharray="3 9"/>`, t, until);
};

// ---------- the road Hagaru-ri -> Koto-ri ----------
const HAG = G(40.385, 127.253), KOTO = G(40.285, 127.30);
const ROAD = poly(smooth(GL([[40.39, 127.25], [40.37, 127.258], [40.352, 127.262], [40.335, 127.272], [40.318, 127.28], [40.3, 127.292], [40.285, 127.30], [40.27, 127.305]]), 16));
const DK = poly(ROAD.pts.slice(0, ROAD.pts.length - 16)).len; // distance to Koto-ri

const S = P("breakout-3");
const T_DRIVE = at("breakout-3", "It did not"), T_INF = at("breakout-3", "Infantry climbed"), T_AIR = at("breakout-3", "while Marine and Navy");
const T_EVERY = at("breakout-3", "fought for every"), T_KOTO = at("breakout-3", "reached Koto-ri");

// ---------- camera: follow the head of the column ----------
const HEADP = (f) => posAt(ROAD, DK * f);
B.camera(camSfx([
  [0, 1600, 800, 1.35],
  [T_DRIVE - 1.0, HEADP(0.3)[0], HEADP(0.3)[1] - 40, 1.85],
  [T_AIR + 0.6, HEADP(0.55)[0], HEADP(0.55)[1] - 30, 1.95],
  [T_AIR + 1.6, HEADP(0.6)[0], HEADP(0.6)[1] - 20, 1.95],
  [T_EVERY, HEADP(0.8)[0], HEADP(0.8)[1] - 30, 1.9],
  [END, KOTO[0] - 10, KOTO[1] - 60, 1.75],
]));

// ---------- base ----------
B.image("assets/chosin_close_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.snow(0, END);
road(ROAD, { t: 0.1, dur: 1.4, w: 10 });
B.showDate(0.2);
B.date("DECEMBER 6, 1950", 0.4, T_KOTO - 0.2, 36);
B.date("DECEMBER 7, 1950", T_KOTO, null, 36);
B.label("CHOSIN RESERVOIR", ...G(40.43, 127.24), { cls: "river", size: 30, t: 0.3, anchor: [-50, -50], until: T_INF });
B.city("HAGARU-RI", ...HAG, { left: true, size: 32, t: 0.5, dy: -40 });
B.city("KOTO-RI", ...KOTO, { size: 32, t: 0.8, dy: 64 });
B.caption("DEC 6-7 · HAGARU-RI → KOTO-RI · 11 MILES", 0.8, T_INF - 0.3, "carth");

// ---------- the column ----------
const kinds = ["inf", "armor", "truck", "arty", "truck", "inf"];
const GAP = 34, HEAD0 = 5 * GAP + 6;
kinds.forEach((k, i) => {
  const [x, y] = posAt(ROAD, HEAD0 - i * GAP);
  B.unit({ id: "c" + i, side: "carth", x, y, w: 28, h: 24, label: i === 0 ? "1ST MARINE DIV" : null, t: 1.0 + i * 0.12 });
  if (k !== "inf") setIcon("c" + i, k);
});
B.units.c0.el.querySelector(".tag").style.cssText += "font-size:13px;position:absolute;left:34px;top:-2px;margin:0;";
gsap.set(B.units.c0.el, { zIndex: 3 });
// stop-and-go in two legs; at the end the column closes up inside Koto-ri
const legs = [[T_DRIVE - 1.0, T_AIR + 0.6, 0.55], [T_AIR + 1.4, END - 0.6, 1.0]];
kinds.forEach((_, i) => {
  let from = HEAD0 - i * GAP;
  legs.forEach(([a, b, f]) => { const to = f === 1 ? DK + 24 - i * 14 : DK * f - i * GAP; follow("c" + i, ROAD, a + i * 0.06, b - a, from, to, "sine.inOut"); from = to; });
});

// ---------- the Chinese on the ridges ----------
const TR = [];
const reds = [[0.14, -1], [0.2, 1], [0.33, -1], [0.42, 1], [0.55, -1], [0.64, 1], [0.78, -1], [0.86, 1]];
reds.forEach(([f, side], i) => {
  const [x, y] = normAt(ROAD, DK * f, side * (120 + (i % 3) * 18));
  B.unit({ id: "r" + i, side: "rome", x, y, w: 36, h: 30, t: 1.6 + i * 0.15 });
  const [rx, ry, a] = posAt(ROAD, DK * f);
  TR.push(trench(x, y, Math.atan2(ry - y, rx - x), 2.0 + i * 0.15, null, 38));
});
// infantry climbs the ridges on both flanks as the column passes below
const clearT = (f) => f < 0.5 ? T_INF + 0.2 + (f - 0.1) * 8 : T_AIR + 1.6 + (f - 0.5) * 16;
reds.forEach(([f, side], i) => {
  if (i === 2 || i === 5) return; // these two are hit from the air
  const t = clearT(f);
  const [x0, y0] = normAt(ROAD, DK * (f - 0.08), side * 16), [xm, ym] = normAt(ROAD, DK * (f - 0.03), side * 70), [x1, y1] = normAt(ROAD, DK * f, side * 96);
  B.arrow({ side: "carth", pts: [[x0, y0], [xm, ym], [x1, y1]], width: 10, t, dur: 1.0, until: t + 3.2 });
  B.grey(["r" + i], t + 1.0, 0.6);
  SFX("mg", t + 0.8); // infantry fight for the ridge
  B.hideUnits(["r" + i], t + 3.4, 0.6); tl.to(TR[i], { autoAlpha: 0, duration: 0.6 }, t + 3.4);
});
B.caption("INFANTRY CLEARS THE RIDGES", T_INF + 0.3, T_AIR + 0.3, "carth");

// ---------- Marine and Navy fighter-bombers ----------
[2, 5].forEach((ri, k) => {
  const u = B.units["r" + ri], t = T_AIR + 0.3 + k * 1.3;
  plane({ kind: "fighter", color: "#1b3470", size: 70, t, dur: 2.6, pts: [[u.x + 700, u.y - 560], [u.x + 60, u.y - 40], [u.x - 520, u.y + 380]] });
  flash(u.x, u.y, t + 1.25, 110, "explosion"); flash(u.x + 30, u.y + 20, t + 1.45, 80, "explosion"); // Corsair bombs
  B.grey(["r" + ri], t + 1.35, 0.5);
  B.hideUnits(["r" + ri], t + 4.5, 0.6); tl.to(TR[ri], { autoAlpha: 0, duration: 0.6 }, t + 4.5);
});
plane({ kind: "fighter", color: "#1b3470", size: 64, t: T_AIR + 1.0, dur: 2.8, pts: [[KOTO[0] + 600, KOTO[1] - 700], [KOTO[0] - 80, KOTO[1] - 260], [KOTO[0] - 700, KOTO[1] + 100]] });
B.caption("CORSAIRS STRIKE ANYTHING THAT MOVES", T_AIR + 0.7, T_EVERY - 0.2, "carth");
svgEl(`<circle cx="${KOTO[0]}" cy="${KOTO[1] + 10}" r="95" fill="rgba(31,79,196,0.14)" stroke="var(--carth)" stroke-width="7" stroke-dasharray="20 10"/>`, T_KOTO + 0.2, null, 0.8);
B.caption("THE COLUMN KEEPS MOVING", T_EVERY + 0.3, END - 0.3, "carth");
B.finish();
