// ending-1: the Marines back in the fight; Ridgway turns the war around (Korea, Dec 1950 - Mar 1951). UN = blue ("carth"), Chinese = red ("rome").
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const tl = B.tl;

// ---------- projection (assets/korea.json: zoom 8) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 54556).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 24399).toFixed(1)];
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
const plane = (o) => { // o: pts (world), t, dur, size, kind, color
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
const flash = (x, y, t, s = 90) => {
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
  gsap.set(g, { svgOrigin: `${x} ${y}` });
  tl.fromTo(g, { scale: 2.2 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, t);
  return g;
};
const trench = (x, y, ang, t, until, r = 34) => { // red dug-in arc facing the road
  const a0 = ang - 0.9, a1 = ang + 0.9, p = (a) => `${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}`;
  const d = `M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}`;
  return svgEl(`<path d="${d}" fill="none" stroke="#f7f3ea" stroke-width="13" stroke-linecap="round"/><path d="${d}" fill="none" stroke="var(--rome)" stroke-width="7" stroke-linecap="round" stroke-dasharray="3 9"/>`, t, until);
};

const S = P("ending-1");
const T_BACK = at("ending-1", "back in the fight"), T_WEEKS = at("ending-1", "Only weeks later"), T_RIDG = at("ending-1", "Matthew Ridgway"),
  T_TURN = at("ending-1", "turn the war around"), T_SURV = at("ending-1", "He did it with"), T_BEST = at("ending-1", "the First Marine Division");
const HUNG = G(39.83, 127.62), PUSAN = G(35.1, 129.04);

// ---------- camera ----------
B.camera([
  [0, 1460, 820, 0.7],
  [T_WEEKS, 1480, 900, 0.8],
  [T_RIDG + 0.5, 1420, 960, 1.25],
  [T_TURN + 3.0, 1440, 900, 1.3],
  [T_BEST, 1480, 900, 1.45],
  [END, 1490, 890, 1.55],
]);

// ---------- base ----------
B.image("assets/korea_north.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.image("assets/korea_south.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
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

// by sea to the south, then back into the line
B.arrow({ side: "white", pts: [[HUNG[0] + 20, HUNG[1] + 10], [1640, 520], [1820, 760], [1860, 1120], [1800, 1430], [PUSAN[0] + 14, PUSAN[1] - 6]], width: 16, t: 0.9, dur: 3.0, until: T_RIDG });
B.label("BY SEA", 1900, 900, { cls: "tg", size: 30, t: 2.4, until: T_RIDG, anchor: [0, -50] });
B.caption("THE 1ST MARINE DIVISION IS BACK IN THE FIGHT", T_BACK + 0.3, T_WEEKS + 0.6, "carth");

// Ridgway takes over the battered UN army
const frontA = [[36.98, 126.75], [37.02, 127.15], [37.1, 127.55], [37.25, 128.0], [37.4, 128.6], [37.5, 129.15]];
const frontB = [[37.75, 126.6], [37.85, 127.0], [37.95, 127.45], [38.05, 127.9], [38.15, 128.3], [38.3, 128.62]];
B.front({ pts: GL(frontA), to: GL(frontB), width: 10, t: T_WEEKS + 0.6, dur: 1.6, moveT: T_TURN + 0.4, moveDur: 4.2 });
B.portraitStake({ img: "assets/media/ridgway_head.png", flag: "assets/media/us_flag_48star.png", name: "RIDGWAY", x: G(36.72, 127.3)[0], y: G(36.72, 127.3)[1], size: 0.62, t: T_RIDG - 0.4 });
B.city("SEOUL", ...G(37.57, 126.98), { size: 20, r: 6, t: T_WEEKS + 0.8 });
const blue = [[36.93, 126.95], [37.02, 127.7], [37.12, 128.1], [37.27, 128.5], [37.4, 128.95]];
const blueB = [[37.68, 126.8], [37.85, 127.6], [37.93, 127.95], [38.05, 128.3], [38.18, 128.52]];
blue.forEach(([la, lo], i) => {
  B.unit({ id: "b" + i, side: "carth", x: G(la, lo)[0], y: G(la, lo)[1], w: 28, h: 26, label: i === 2 ? "1ST MARINE DIV" : null, t: T_WEEKS + 1.2 + i * 0.15 });
  B.move("b" + i, T_TURN + 0.5 + i * 0.1, 4.0, ...G(...blueB[i]));
});
B.units.b2.el.querySelector(".tag").style.fontSize = "13px";
gsap.set(B.units.b2.el, { zIndex: 3 });
const red = [[37.5, 126.9], [37.45, 127.4], [37.55, 127.85], [37.62, 128.3], [37.75, 128.5]];
red.forEach(([la, lo], i) => {
  B.unit({ id: "r" + i, side: "rome", x: G(la, lo)[0], y: G(la, lo)[1], w: 28, h: 26, t: T_WEEKS + 1.0 + i * 0.12 });
  B.move("r" + i, T_TURN + 0.3 + i * 0.1, 4.0, ...G(la + 0.95, lo));
  B.grey(["r" + i], T_TURN + 4.4, 0.8);
});
[[[37.2, 126.85], [37.5, 126.82], [37.75, 126.78]], [[37.25, 127.8], [37.55, 127.77], [37.85, 127.75]], [[37.4, 128.3], [37.7, 128.3], [37.98, 128.33]]]
  .forEach((pts, i) => B.arrow({ side: "carth", pts: GL(pts), width: 12, t: T_TURN + 0.5 + i * 0.3, dur: 2.4, until: T_BEST }));
B.caption("RIDGWAY TURNS THE WAR AROUND", T_TURN - 0.4, T_BEST - 0.3, "carth");
// the Marines: among the best
const mx = G(...blueB[2]);
const ring = svgEl(`<circle cx="${mx[0]}" cy="${mx[1]}" r="34" fill="none" stroke="#f7f3ea" stroke-width="6"/><circle cx="${mx[0]}" cy="${mx[1]}" r="34" fill="none" stroke="var(--carth)" stroke-width="3"/>`, T_BEST + 0.2, null, 0.3);
gsap.set(ring, { svgOrigin: `${mx[0]} ${mx[1]}` });
tl.fromTo(ring, { scale: 2.2 }, { scale: 1, duration: 0.6, ease: "back.out(2)" }, T_BEST + 0.2);
B.caption("1ST MARINE DIVISION · AMONG THE BEST", T_BEST + 0.2, END - 0.3, "carth");
B.finish();
