// breakout-c: Funchilin Pass, Dec 7-9 1950 - the blown bridge and the bridge dropped from the sky. UN = blue ("carth"), Chinese = red ("rome").
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const tl = B.tl;

// ---------- projection (assets/funchilin.json: zoom 13) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 13, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 1788887).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 791528).toFixed(1)];
};

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

const chute = (x, y, t, o = {}) => { // steel span under a parachute, landing at (x,y)
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - 34}px;top:${y - 78}px;width:68px;height:86px;`;
  el.innerHTML = `<svg class="cn" viewBox="0 0 68 86" style="position:absolute;inset:0;overflow:visible">
      <path d="M4 30 Q34 -10 64 30 Q56 24 49 30 Q41 23 34 30 Q27 23 19 30 Q12 24 4 30 Z" fill="#f2ede0" stroke="#3a342a" stroke-width="2.5"/>
      <path d="M19 30 Q34 -6 49 30" fill="none" stroke="#c9412e" stroke-width="3"/>
      <path d="M4 30 L22 72 M19 30 L28 72 M49 30 L40 72 M64 30 L46 72" stroke="#3a342a" stroke-width="1.6"/></svg>
    <div class="sp" style="position:absolute;left:14px;top:68px;width:40px;height:14px;background:#8d949a;border:2.5px solid #23262a;box-shadow:0 3px 5px rgba(0,0,0,0.4);
      background-image:repeating-linear-gradient(90deg, transparent 0 7px, rgba(20,20,20,0.45) 7px 9px);"></div>`;
  PINS.appendChild(el);
  const cn = el.querySelector(".cn"), sp = el.querySelector(".sp");
  gsap.set(el, { autoAlpha: 0 });
  const dx = o.drift || 0;
  tl.fromTo(el, { autoAlpha: 0, y: -300, x: -120 + dx * 0.2 }, { autoAlpha: 1, y: 0, x: 0, duration: o.dur || 2.6, ease: "sine.out" }, t);
  tl.fromTo(cn, { rotation: -8, transformOrigin: "50% 90%" }, { rotation: 6, duration: 1.3, ease: "sine.inOut", yoyo: true, repeat: 1 }, t);
  tl.to(cn, { autoAlpha: 0, scaleY: 0.3, y: 30, duration: 0.5 }, t + (o.dur || 2.6));
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

const S4 = P("breakout-4"), S5 = P("breakout-5"), S6 = P("breakout-6");
const a4 = (s, o = 0) => at("breakout-4", s, o), a5 = (s, o = 0) => at("breakout-5", s, o), a6 = (s, o = 0) => at("breakout-6", s, o);
const T_PASS = a4("the Funchilin Pass"), T_CLIFF = a4("ran along a cliff"), T_BRIDGE = a4("crossed a narrow"), T_PIPES = a4("pipes of a"),
  T_BLOWN = a4("The Chinese had blown"), T_GAP = a4("gap of nearly"), T_DROP = a4("sheer drop"), T_NOWAY = a4("There was no way"), T_GONE = a4("For trucks");
const T_SKY = a5("drop a bridge"), T_DEC7 = a5("On December seventh"), T_C119 = a5("C-119"), T_PUSH = a5("pushed out eight"), T_TONS = a5("two tons"),
  T_CHUTES = a5("giant parachutes"), T_LOST = a5("One fell"), T_DAMAGED = a5("another was damaged"), T_ENOUGH = a5("But there were enough");
const T_STORM = a6("While Marine infantry"), T_BLIZ = a6("in a blizzard"), T_HAUL = a6("the engineers hauled"), T_BUILT = a6("built the new"),
  T_DONE = a6("It was finished"), T_NARROW = a6("It was so narrow"), T_INCH = a6("inches to spare"), T_NIGHT = a6("the crossing went on");

// ---------- camera ----------
B.camera([
  [0, 1440, 700, 0.74],
  [T_PASS, 1430, 660, 0.9],
  [T_CLIFF + 0.4, 1370, 580, 1.35],
  [T_BRIDGE + 0.4, BX, BY - 10, 2.2],
  [T_GAP, BX, BY, 2.35],
  [T_DROP + 0.6, BX, BY, 2.55],
  [T_NOWAY + 0.3, 1430, 760, 1.35],
  [T_GONE + 1.0, 1520, 880, 1.02],
  [S5 - 0.2, 1500, 860, 0.95],
  [T_SKY + 0.6, 1600, 800, 0.72],
  [T_C119 + 1.0, 1560, 700, 0.74],
  [T_PUSH + 0.2, KOTO[0] + 20, KOTO[1] + 60, 1.75],
  [T_LOST - 0.4, KOTO[0] + 10, KOTO[1] + 60, 1.95],
  [T_ENOUGH + 1.6, KOTO[0] + 20, KOTO[1] + 80, 1.85],
  [S6 + 0.4, 1380, 620, 1.05],
  [T_HAUL, 1370, 600, 1.12],
  [T_BUILT - 0.5, 1410, 720, 1.5],
  [T_BUILT + 1.0, BX, BY - 5, 2.3],
  [T_NARROW, BX, BY, 2.5],
  [T_INCH + 0.4, BX, BY, 3.1],
  [T_NIGHT + 0.2, BX + 10, BY + 10, 2.2],
  [END, 1470, 840, 1.55],
]);

// ---------- base ----------
B.snow(0, END);
B.showDate(0.3);
B.date("DECEMBER 7, 1950", 0.5, T_BLIZ - 0.2, 36);
B.date("DECEMBER 9, 1950", T_BLIZ, null, 36);
const roadN = road(north, { t: 0.4, dur: 1.8, w: 10 });
const roadS = road(south, { t: 1.8, dur: 1.4, w: 10 });
B.city("KOTO-RI", ...KOTO, { size: 34, t: 0.8, until: T_BRIDGE });
B.city("CHINHUNG-NI", ...CHIN, { size: 34, t: 1.2, until: T_BRIDGE });
B.label("TO HUNGNAM", 1960, 1340, { cls: "tg", size: 30, t: 2.4, until: T_BRIDGE, anchor: [0, -50] });
B.label("KOTO-RI PLATEAU", 900, 260, { cls: "tg", size: 34, t: 1.5, until: T_CLIFF, anchor: [-50, -50] });
B.label("FUNCHILIN PASS", 1180, 560, { cls: "place", size: 52, t: T_PASS - 0.3, until: T_BRIDGE + 0.2, anchor: [-100, -50] });
tl.to(document.querySelectorAll(".place:not(.tg):not(.city):not(.river):not(.sea):not(.country)"), { color: "#e3232f", duration: 0.01 }, 0);
// cliff hachures along the east side of the descent
const cliffPts = [];
for (let d = DK + 120; d < DB - 20; d += 16) { const [x, y, a] = posAt(ROAD, d); cliffPts.push([x - Math.sin(a) * -22, y + Math.cos(a) * -22, a]); }
const cliffD = cliffPts.map(([x, y, a]) => { const ex = x - Math.sin(a) * -20, ey = y + Math.cos(a) * -20; return `M ${x.toFixed(1)} ${y.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`; }).join(" ");
const cliffLine = lineD(cliffPts.map((p) => [p[0], p[1]]));
svgEl(`<path d="${cliffLine}" fill="none" stroke="#2a2218" stroke-width="5"/><path d="${cliffD}" stroke="#2a2218" stroke-width="3.5"/>`, T_CLIFF, T_NOWAY);
B.label("CLIFF", ...normAt(ROAD, DK + 330, -80), { cls: "tg", size: 22, t: T_CLIFF + 0.4, until: T_NOWAY, anchor: [-50, -50] });

// penstock pipes of the power plant crossing under the road
const pdx = -290, pdy = 330, pl = Math.hypot(pdx, pdy), ux = pdx / pl, uy = pdy / pl;
const pipes = [-9, -3, 3, 9].map((o) => { const x0 = BX - ux * 170 - uy * o, y0 = BY - uy * 170 + ux * o; return `M ${x0.toFixed(1)} ${y0.toFixed(1)} L ${(x0 + ux * 340).toFixed(1)} ${(y0 + uy * 340).toFixed(1)}`; }).join(" ");
const PX = BX + ux * 190, PY = BY + uy * 190;
const pipesG = svgEl(`<path d="${pipes}" stroke="#20262c" stroke-width="6" stroke-linecap="round"/><path d="${pipes}" stroke="#8a97a3" stroke-width="3" stroke-linecap="round"/>
  <rect x="${PX - 26}" y="${PY - 18}" width="52" height="36" fill="#6e7780" stroke="#20262c" stroke-width="4"/><rect x="${PX - 26}" y="${PY - 24}" width="52" height="8" fill="#3d444b"/>`, T_PIPES - 0.3, null, 0.6);
OV.insertBefore(pipesG, OV.firstChild);
B.label("POWER PLANT PIPES", PX + 40, PY + 6, { cls: "tg", size: 18, t: T_PIPES, until: T_BLOWN, anchor: [0, -50] });

// the concrete bridge, then the gap
const brG = svgEl(`<g transform="translate(${BX} ${BY}) rotate(${BDEG})"><rect x="-34" y="-14" width="68" height="28" fill="#e2d8c0" stroke="#1d1a14" stroke-width="4"/>
  <line x1="-34" y1="-14" x2="34" y2="-14" stroke="#1d1a14" stroke-width="6"/><line x1="-34" y1="14" x2="34" y2="14" stroke="#1d1a14" stroke-width="6"/></g>`, T_BRIDGE, null, 0.4);
gsap.set(brG, { svgOrigin: `${BX} ${BY}` });
tl.fromTo(brG, { scale: 1.8 }, { scale: 1, duration: 0.5, ease: "back.out(2)" }, T_BRIDGE);
B.label("THE BRIDGE", BX + 34, BY - 30, { cls: "tg", size: 18, t: T_BRIDGE + 0.3, until: T_BLOWN, anchor: [0, -100] });
flash(BX, BY, T_BLOWN + 0.5, 110); flash(BX + 10, BY - 8, T_BLOWN + 0.75, 80); flash(BX - 8, BY + 6, T_BLOWN + 0.95, 70);
tl.to(brG, { autoAlpha: 0, duration: 0.15 }, T_BLOWN + 0.6);
const gapG = svgEl(`<g transform="translate(${BX} ${BY}) rotate(${BDEG})"><path d="M -30 -20 L -22 -11 L -28 -2 L -20 7 L -27 20 L 28 20 L 21 10 L 29 1 L 20 -9 L 27 -20 Z" fill="#17130e" stroke="#c4121f" stroke-width="3.5" stroke-dasharray="7 4"/></g>`, T_BLOWN + 0.6, T_BUILT + 0.6, 0.2);
// debris
for (let i = 0; i < 6; i++) {
  const d = document.createElement("div"), ang = i * 1.05 + 0.4;
  d.style.cssText = `position:absolute;left:${BX - 5}px;top:${BY - 4}px;width:10px;height:8px;background:#cfc4aa;border:2px solid #1d1a14;`;
  PINS.appendChild(d); gsap.set(d, { autoAlpha: 0 });
  tl.set(d, { autoAlpha: 1 }, T_BLOWN + 0.6);
  tl.fromTo(d, { x: 0, y: 0, rotation: 0 }, { x: Math.cos(ang) * 60, y: Math.sin(ang) * 40 + 70, rotation: 200 + i * 40, duration: 1.1, ease: "power1.in" }, T_BLOWN + 0.6);
  tl.to(d, { autoAlpha: 0, duration: 0.3 }, T_BLOWN + 1.5);
}
// gap measurement
const gm = (s) => { const c = Math.cos(BA), si = Math.sin(BA), nx = -si, ny = c; return [BX + c * s + nx * -38, BY + si * s + ny * -38]; };
svgEl(`<path d="M ${gm(-30).join(" ")} L ${gm(30).join(" ")}" stroke="#f7f3ea" stroke-width="4"/><circle cx="${gm(-30)[0]}" cy="${gm(-30)[1]}" r="4" fill="#f7f3ea"/><circle cx="${gm(30)[0]}" cy="${gm(30)[1]}" r="4" fill="#f7f3ea"/>`, T_GAP, T_NOWAY + 0.2, 0.3);
B.label("NEARLY 30 FT", BX + 52, BY - 20, { cls: "tg", size: 22, t: T_GAP + 0.2, until: T_NOWAY + 0.2, anchor: [0, -100] });
B.label("SHEER DROP", BX + 40, BY + 26, { cls: "tg", size: 20, t: T_DROP, until: T_NOWAY + 0.2, anchor: [0, 0] });
// red units on the heights above
const reds = [["r0", 1235, 690], ["r1", 1175, 810], ["r2", 1575, 700], ["r3", 1290, 900]];
reds.forEach(([id, x, y], i) => B.unit({ id, side: "rome", x, y, w: 40, h: 34, label: i === 0 ? "CHINESE" : null, t: T_BLOWN - 1.0 + i * 0.2 }));
B.caption("THE BRIDGE IS BLOWN", T_BLOWN + 0.8, T_NOWAY - 0.2, "rome");
B.caption("NO WAY AROUND", T_NOWAY + 0.2, T_GONE - 0.1, "rome");
tl.to(roadS.querySelector(".rd"), { stroke: "#8a877f", duration: 0.8 }, T_GONE + 0.6);
tl.to(roadS, { opacity: 0.55, duration: 0.8 }, T_GONE + 0.6);
B.caption("THE ROAD TO THE SEA IS CUT", T_GONE + 0.8, S5 - 0.1, "rome");

// ---------- breakout-5: a bridge from the sky ----------
const perim = svgEl(`<circle cx="${KOTO[0] + 20}" cy="${KOTO[1] + 40}" r="150" fill="rgba(31,79,196,0.12)" stroke="var(--carth)" stroke-width="8" stroke-dasharray="22 12"/>`, T_SKY - 0.5, END - 1, 0.8);
[["k0", -40, 20], ["k1", 70, 30], ["k2", 20, 120]].forEach(([id, dx, dy], i) => B.unit({ id, side: "carth", x: KOTO[0] + dx, y: KOTO[1] + dy, w: 36, h: 30, label: i === 0 ? "1ST MARINES" : null, t: T_SKY - 0.2 + i * 0.15 }));
B.units.k0.el.querySelector(".tag").style.fontSize = "15px";
B.arrow({ side: "carth", pts: [[2860, 1560], [2380, 1060], [1800, 600], [KOTO[0] + 160, KOTO[1] + 60]], width: 20, t: T_SKY + 0.2, dur: 2.2, until: T_PUSH });
B.label("FROM JAPAN", 2250, 1160, { cls: "tg", size: 40, t: T_SKY + 1.2, until: T_PUSH, anchor: [-50, -50] });
[0, 1, 2].forEach((i) => plane({ kind: "cargo", color: "#566273", size: 130, t: T_C119 - 1.2 + i * 1.0, dur: 6.2, ease: "power1.out",
  pts: [[2700 + i * 60, 1500 + i * 40], [2200, 1000 + i * 30], [1700, 560 + i * 20], [KOTO[0] + 60 - i * 40, KOTO[1] + 30 + i * 40], [KOTO[0] - 520, KOTO[1] - 300]] }));
B.caption("C-119 FLYING BOXCARS · DEC 7", T_C119 + 0.2, T_PUSH - 0.2, "carth");
const drops = [[-60, -10], [40, -50], [110, 20], [-20, 80], [60, 110], [-90, 90], [140, 150], [-130, -60]];
const CH = drops.map(([dx, dy], i) => chute(KOTO[0] + 20 + dx, KOTO[1] + 40 + dy, T_PUSH + 0.3 + i * 0.42, { dur: 2.6 }));
B.caption("8 TREADWAY BRIDGE SPANS", T_PUSH + 0.8, T_TONS - 0.1, "carth");
B.caption("ABOUT 2 TONS EACH · GIANT PARACHUTES", T_TONS + 0.1, T_LOST - 0.2, "carth");
// one span lands among the Chinese, one is damaged
B.unit({ id: "rc", side: "rome", x: KOTO[0] - 250, y: KOTO[1] + 110, w: 40, h: 34, t: T_PUSH });
tl.to(CH[7].el, { x: -100, y: 175, duration: 1.4, ease: "power1.inOut" }, T_LOST - 0.2);
tl.to(CH[7].sp, { backgroundColor: "#c4121f", duration: 0.4 }, T_LOST + 1.0);
B.label("CAPTURED", KOTO[0] - 250, KOTO[1] + 66, { cls: "tg", size: 20, t: T_LOST + 1.0, until: S6, anchor: [-50, -50] });
tl.to(CH[5].sp, { backgroundColor: "#55524c", rotation: 18, duration: 0.5 }, T_DAMAGED + 0.2);
cutX(KOTO[0] + 20 - 90, KOTO[1] + 40 + 90, T_DAMAGED + 0.3, S6, 12);
B.label("DAMAGED", KOTO[0] - 70, KOTO[1] + 175, { cls: "tg", size: 20, t: T_DAMAGED + 0.4, until: S6, anchor: [-50, -50] });
const good = [0, 1, 2, 3, 4, 6];
good.forEach((i, k) => tl.fromTo(CH[i].sp, { boxShadow: "0 0 0 0 rgba(255,244,200,0)" }, { boxShadow: "0 0 14px 6px rgba(255,244,200,0.95)", duration: 0.5, yoyo: true, repeat: 1 }, T_ENOUGH + k * 0.12));
B.caption("6 GOOD SPANS · ENOUGH TO BRIDGE THE GAP", T_ENOUGH + 0.2, S6 - 0.1, "carth");
CH.forEach((c) => tl.to(c.el, { autoAlpha: 0, duration: 0.6 }, T_HAUL + 0.2));
B.hideUnits(["rc"], S6, 0.5);

// ---------- breakout-6: the heights, the blizzard, the new bridge ----------
B.fog(T_BLIZ - 0.4, T_BUILT, 0.45);
B.label("HILL 1081", 1150, 745, { cls: "tg", size: 30, t: S6 + 0.2, until: T_BUILT, anchor: [-100, -50] });
B.unit({ id: "b1", side: "carth", x: CHIN[0] - 40, y: CHIN[1] - 10, w: 40, h: 34, label: "1/1 MARINES", t: S6 + 0.2 });
B.units.b1.el.querySelector(".tag").style.fontSize = "15px";
B.arrow({ side: "carth", pts: [[CHIN[0] - 80, CHIN[1] - 30], [1480, 1010], [1300, 930], [1205, 840]], width: 16, t: T_STORM + 0.6, dur: 2.4, until: T_HAUL + 3 });
B.arrow({ side: "carth", pts: [[KOTO[0] - 40, KOTO[1] + 110], [1180, 450], [1180, 600], [1225, 665]], width: 16, t: T_STORM + 1.0, dur: 2.4, until: T_HAUL + 3 });
B.arrow({ side: "carth", pts: [[1395, 600], [1480, 640], [1545, 690]], width: 14, t: T_STORM + 1.6, dur: 1.4, until: T_HAUL + 3 });
B.grey(["r0", "r1", "r2", "r3"], T_BLIZ + 1.0, 0.8);
B.hideUnits(["r0", "r1", "r2", "r3"], T_HAUL + 2.5, 0.8);
// engineers haul the spans down the road
["e0", "e1", "e2", "e3"].forEach((id, i) => {
  const d0 = DK + 70 - i * 40, [x, y] = posAt(ROAD, d0);
  B.unit({ id, side: "carth", x, y, w: 32, h: 26, label: i === 0 ? "ENGINEERS" : null, t: T_HAUL - 0.4 + i * 0.12 });
  setIcon(id, "eng");
  follow(id, ROAD, T_HAUL + 0.3 + i * 0.1, (T_BUILT - T_HAUL) + 0.6, d0, DB - 48 - i * 30, "power1.inOut");
  B.hideUnits([id], T_NARROW - 0.3, 0.5);
});
B.units.e0.el.querySelector(".tag").style.cssText += "font-size:14px;position:absolute;left:40px;top:-2px;margin:0;";
const newBr = svgEl(`<g transform="translate(${BX} ${BY}) rotate(${BDEG})"><rect x="-40" y="-14" width="80" height="28" fill="#8d949a" stroke="#1d1a14" stroke-width="4"/>
  <rect x="-40" y="-11" width="80" height="8" fill="#5d646a"/><rect x="-40" y="3" width="80" height="8" fill="#5d646a"/>
  ${[-30, -18, -6, 6, 18, 30].map((x) => `<line x1="${x}" y1="-14" x2="${x}" y2="14" stroke="#1d1a14" stroke-width="1.5"/>`).join("")}</g>`, T_BUILT + 0.6, null, 0.2);
gsap.set(newBr, { svgOrigin: `${BX} ${BY}` });
tl.fromTo(newBr, { scale: 0.2 }, { scale: 1, duration: 0.7, ease: "back.out(1.8)" }, T_BUILT + 0.6);
flash(BX, BY, T_BUILT + 0.6, 90);
tl.to(roadS.querySelector(".rd"), { stroke: "#f4e9cb", duration: 0.8 }, T_BUILT + 0.8);
tl.to(roadS, { opacity: 1, duration: 0.8 }, T_BUILT + 0.8);
B.caption("DEC 9 · THE BRIDGE IS COMPLETE", T_DONE, T_NARROW - 0.2, "carth");
B.label("INCHES TO SPARE", BX + 36, BY - 34, { cls: "tg", size: 16, t: T_INCH - 0.2, until: T_NIGHT + 1.0, anchor: [0, -100] });
// the crossing, through the night
B.dim(T_NIGHT - 0.2, END + 1, 0.55);
B.hideUnits(["b1"], T_HAUL + 3, 0.6);
const conv = ["armor", "truck", "arty", "truck", "armor", "truck", "inf", "truck"];
conv.forEach((k, i) => {
  const id = "x" + i, d0 = DB - 60 - i * 34, [x, y] = posAt(ROAD, d0);
  B.unit({ id, side: "carth", x, y, w: 24, h: 20, t: T_NARROW + 0.2 + i * 0.1 });
  if (k !== "inf") setIcon(id, k);
  follow(id, ROAD, T_INCH + 0.3 + i * 0.15, END - T_INCH - 0.3, d0, d0 + 330, "none");
});
B.caption("THE CROSSING GOES ON ALL NIGHT", T_NIGHT + 0.3, END - 0.3, "carth");
B.finish();
