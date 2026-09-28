// breakout-a: Dec 4 1950, the whole road Hagaru-ri -> Hungnam; the Chinese on every ridge. UN = blue ("carth"), Chinese = red ("rome").
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const tl = B.tl;

// ---------- projection (assets/chosin.json: zoom 11) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 11, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 446141).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 197446).toFixed(1)];
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
  gsap.set(g, { transformOrigin: `${x}px ${y}px` });
  tl.fromTo(g, { scale: 2.2 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, t);
  return g;
};
const trench = (x, y, ang, t, until, r = 34) => { // red dug-in arc facing the road
  const a0 = ang - 0.9, a1 = ang + 0.9, p = (a) => `${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}`;
  const d = `M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}`;
  return svgEl(`<path d="${d}" fill="none" stroke="#f7f3ea" stroke-width="13" stroke-linecap="round"/><path d="${d}" fill="none" stroke="var(--rome)" stroke-width="7" stroke-linecap="round" stroke-dasharray="3 9"/>`, t, until);
};

// ---------- the road Hagaru-ri -> Hungnam ----------
const HAG = G(40.385, 127.253), KOTO = G(40.285, 127.30), CHIN = G(40.17, 127.38), HAM = G(39.92, 127.54), HUNG = G(39.83, 127.62);
const MSR = poly(smooth(GL([[40.385, 127.253], [40.34, 127.268], [40.285, 127.30], [40.25, 127.318], [40.21, 127.335], [40.17, 127.38], [40.12, 127.405],
  [40.06, 127.44], [39.99, 127.49], [39.92, 127.54], [39.87, 127.585], [39.83, 127.62]]), 14));

const S1 = P("breakout-1"), S2 = P("breakout-2");
const T_FORCE = at("breakout-1", "the whole of Smith"), T_DIVS = at("breakout-1", "several Chinese"), T_MILE = at("breakout-1", "every mile");
const T_AIR = at("breakout-1", "airlifted out"), T_ABAND = at("breakout-1", "abandoning");
const T_CHI = S2 + 0.3, T_TRUCKS = at("breakout-2", "trucks, tanks"), T_ROAD = at("breakout-2", "use the road");
const T_CUT = at("breakout-2", "cut that road"), T_LEAVE = at("breakout-2", "leave their guns"), T_CROWD = at("breakout-2", "a division without");

// ---------- camera ----------
B.camera([
  [0, 1560, 820, 0.72],
  [T_FORCE, 1530, 780, 0.78],
  [T_DIVS, 1420, 560, 1.05],
  [T_MILE - 0.3, 1420, 560, 1.05],
  [T_MILE + 4.2, 1560, 850, 0.82],
  [T_AIR - 0.4, 1520, 760, 0.86],
  [T_AIR + 1.8, 1420, 520, 1.3],
  [S2, 1400, 500, 1.36],
  [T_TRUCKS, 1390, 440, 1.7],
  [T_CUT - 0.2, 1380, 470, 1.62],
  [T_CUT + 2.2, 1470, 640, 1.12],
  [T_LEAVE, 1450, 600, 1.2],
  [END, 1420, 560, 1.36],
]);

// ---------- base ----------
B.image("assets/chosin_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.snow(0.2, END);
B.title("MOVE 3", "THE BREAKOUT", "DECEMBER 1950", 0.4, 4.4);
B.showDate(4.6);
B.date("DECEMBER 4, 1950", 4.8, null, 36);
road(MSR, { t: 1.2, dur: 3.2, w: 9 });
B.label("CHOSIN RESERVOIR", ...G(40.47, 127.2), { cls: "river", size: 30, t: 4.4, anchor: [-50, -50], until: T_AIR });
B.city("HAGARU-RI", ...HAG, { left: true, size: 32, t: 4.6, dy: -52 });
B.city("KOTO-RI", ...KOTO, { size: 30, t: 4.9 });
B.city("HAMHUNG", ...HAM, { left: true, size: 30, t: 5.2, until: T_AIR + 1 });
B.city("HUNGNAM", ...HUNG, { size: 30, t: 5.4, until: T_AIR + 1 });
B.label("SEA OF JAPAN", 2380, 1360, { cls: "sea", size: 44, t: 5.6, until: T_AIR + 1 });
B.label("78 MILES TO THE SEA", ...normAt(MSR, MSR.len * 0.55, -150), { cls: "tg", size: 30, t: 6.0, until: T_DIVS + 0.5, anchor: [-50, -50] });

// ---------- the Marines massed at Hagaru-ri ----------
const blue = [[0, 0], [-46, -30], [44, -26], [-40, 34], [46, 30]];
blue.forEach(([dx, dy], i) => B.unit({ id: "b" + i, side: "carth", x: HAG[0] + dx, y: HAG[1] + dy + 12, w: 40, h: 34, label: i === 0 ? "1ST MARINE DIV" : null, t: T_FORCE + 0.3 + i * 0.15 }));
B.units.b0.el.querySelector(".tag").style.fontSize = "15px";
gsap.set(B.units.b0.el, { zIndex: 3 });

// ---------- Chinese divisions around Hagaru-ri ----------
const ring = [[40.44, 127.14], [40.34, 127.11], [40.43, 127.34], [40.33, 127.40], [40.28, 127.16]];
ring.forEach(([la, lo], i) => B.unit({ id: "rr" + i, side: "rome", x: G(la, lo)[0], y: G(la, lo)[1], w: 44, h: 36, label: i === 2 ? "CHINESE 9TH ARMY GROUP" : null, t: T_DIVS + 0.2 + i * 0.2 }));
B.units.rr2.el.querySelector(".tag").style.fontSize = "15px";
// every mile of the road south: ridges on both sides
const ridge = [];
for (let k = 0; k < 13; k++) {
  const d = MSR.len * (0.1 + k * 0.066), side = k % 2 ? 1 : -1;
  const [x, y] = normAt(MSR, d, side * (58 + (k % 3) * 14));
  ridge.push([x, y, d, side]);
  B.unit({ id: "rd" + k, side: "rome", x, y, w: 30, h: 26, t: T_MILE + 0.3 + k * 0.26 });
}
B.caption("CHINESE ON EVERY RIDGE", T_MILE + 1.4, T_AIR - 0.3, "rome");

// ---------- the expected airlift ----------
const veh = [["v0", "armor", -118, 70], ["v1", "truck", -70, 96], ["v2", "arty", -22, 104]];
veh.forEach(([id, k, dx, dy], i) => { B.unit({ id, side: "carth", x: HAG[0] + dx, y: HAG[1] + dy, w: 38, h: 30, t: T_AIR - 0.4 + i * 0.15 }); setIcon(id, k); });
[0, 1].forEach((i) => plane({ kind: "cargo", color: "#3a4a66", size: 84, t: T_AIR + 0.3 + i * 0.9, dur: 4.2, pts: [[HAG[0] + 30, HAG[1] - 10], [HAG[0] + 260, HAG[1] + 60 + i * 50], [HAG[0] + 620, HAG[1] + 260 + i * 60], [HAG[0] + 1000, HAG[1] + 560]] }));
B.grey(["v0", "v1", "v2"], T_ABAND + 0.3, 0.8);
B.caption("FLY OUT, LEAVE THE GUNS BEHIND?", T_AIR + 0.6, S2 - 0.2, "");

// ---------- breakout-2: the Chinese view ----------
ridge.forEach(([x, y, d, side], k) => { const [rx, ry, a] = posAt(MSR, d); trench(x, y, Math.atan2(ry - y, rx - x), T_CHI + 0.4 + k * 0.12); });
// vehicles come back to colour: they need the road
["v0", "v1", "v2"].forEach((id) => {
  const el = B.units[id].el;
  tl.to(el.querySelector(".blk"), { backgroundColor: "#1f4fc4", duration: 0.6 }, T_TRUCKS);
  tl.to(el, { opacity: 1, duration: 0.6 }, T_TRUCKS);
});
B.label("TANKS · TRUCKS · GUNS", HAG[0] - 70, HAG[1] + 138, { cls: "tg", size: 18, t: T_TRUCKS + 0.2, until: T_CUT + 0.4, anchor: [-50, -50] });
const glow = document.createElementNS(NS, "path");
glow.setAttribute("d", lineD(MSR.pts)); glow.setAttribute("fill", "none"); glow.setAttribute("stroke", "#fff6d8");
glow.setAttribute("stroke-width", 30); glow.setAttribute("stroke-linecap", "round"); glow.setAttribute("opacity", 0);
OV.insertBefore(glow, OV.firstChild);
tl.to(glow, { opacity: 0.6, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_ROAD - 0.3);
B.label("THE ONLY ROAD OUT", ...normAt(MSR, MSR.len * 0.2, 80), { cls: "tg", size: 26, t: T_ROAD, until: T_CUT + 0.2, anchor: [0, -50] });

// the Chinese can cut the road anywhere
const cuts = [0.12, 0.26, 0.42, 0.6];
cuts.forEach((f, i) => {
  const d = MSR.len * f, side = i % 2 ? 1 : -1, [x0, y0] = normAt(MSR, d - 30, side * 200), [xm, ym] = normAt(MSR, d - 8, side * 100), [x1, y1] = posAt(MSR, d);
  const tt = T_CUT + 0.2 + i * 0.45;
  B.arrow({ side: "rome", pts: [[x0, y0], [xm, ym], [x1 + (xm - x1) * 0.4, y1 + (ym - y1) * 0.4]], width: 12, t: tt, dur: 0.8, until: END - 0.5 });
  flash(x1, y1, tt + 0.8, 70);
  cutX(x1, y1, tt + 0.85, END - 0.5, 16);
});
B.bubble("THEY MUST ABANDON EVERYTHING", ...normAt(MSR, MSR.len * 0.3, -250), T_LEAVE - 0.6, END - 0.2);
B.caption("A DIVISION WITHOUT ITS GUNS IS JUST A CROWD", T_CROWD, END - 0.3, "rome");
B.finish();
