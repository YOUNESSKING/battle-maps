// breakout-d: Dec 11 1950, the column reaches Hungnam; the 9th Army Group wrecked; method card (rule 3). UN = blue ("carth"), Chinese = red ("rome").
// Note: the scene also spans the ARCHIVE slot between breakout-7 and breakout-8 (covered in assembly); the map just drifts there.
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
  gsap.set(g, { svgOrigin: `${x} ${y}` });
  tl.fromTo(g, { scale: 2.2 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, t);
  return g;
};
const trench = (x, y, ang, t, until, r = 34) => { // red dug-in arc facing the road
  const a0 = ang - 0.9, a1 = ang + 0.9, p = (a) => `${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}`;
  const d = `M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}`;
  return svgEl(`<path d="${d}" fill="none" stroke="#f7f3ea" stroke-width="13" stroke-linecap="round"/><path d="${d}" fill="none" stroke="var(--rome)" stroke-width="7" stroke-linecap="round" stroke-dasharray="3 9"/>`, t, until);
};

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

// ---------- geography ----------
const HAG = G(40.385, 127.253), KOTO = G(40.285, 127.30), CHIN = G(40.17, 127.38), HAM = G(39.92, 127.54), HUNG = G(39.83, 127.62);
const MSR = poly(smooth(GL([[40.385, 127.253], [40.34, 127.268], [40.285, 127.30], [40.25, 127.318], [40.21, 127.335], [40.17, 127.38], [40.12, 127.405],
  [40.06, 127.44], [39.99, 127.49], [39.92, 127.54], [39.87, 127.585], [39.83, 127.62]]), 14));
const dNear = (pt) => { let b = 1e9, d = 0; MSR.pts.forEach((p, i) => { const e = Math.hypot(p[0] - pt[0], p[1] - pt[1]); if (e < b) { b = e; d = MSR.L[i]; } }); return d; };
const DCH = dNear(CHIN);

const S7 = P("breakout-7"), S8 = P("breakout-8");
const a7 = (s, o = 0) => at("breakout-7", s, o), a8 = (s, o = 0) => at("breakout-8", s, o);
const T_BEHIND = a7("Behind them"), T_WRECK = a7("had been wrecked"), T_TENS = a7("tens of thousands"), T_MONTHS = a7("would not be able"),
  T_MAR = a7("The Marines had lost"), T_DIV = a7("But they had come out");
const T_R1 = a8("Build the lifeline"), T_R2 = a8("Refuse to be"), T_R3 = a8("Keep the division"), T_THIRD = a8("put the third"),
  T_HOLD = a8("By holding"), T_RETREAT = a8("turned a retreat");

// ---------- camera ----------
B.camera([
  [0, 1660, 1080, 0.95],
  [T_BEHIND - 0.8, 1740, 1200, 1.05],
  [T_BEHIND + 2.2, 1450, 600, 0.95],
  [T_MONTHS + 1.5, 1450, 590, 1.0],
  [T_MAR, 1740, 1180, 1.0],
  [T_DIV + 1.5, 1830, 1290, 1.25],
  [S8 - 0.5, 1760, 1200, 1.05],
  [T_HOLD, 1580, 840, 0.72],
  [END, 1560, 820, 0.76],
]);

// ---------- base ----------
B.image("assets/chosin_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.snow(0, END);
road(MSR, { t: 0, dur: 0.01, w: 9 });
B.showDate(0.2);
B.date("DECEMBER 11, 1950", 0.4, null, 34);
B.city("HAGARU-RI", ...HAG, { left: true, size: 30, t: 0.2 });
B.city("KOTO-RI", ...KOTO, { size: 28, t: 0.3 });
B.city("CHINHUNG-NI", ...CHIN, { size: 28, t: 0.4 });
B.city("HAMHUNG", ...HAM, { left: true, size: 30, t: 0.5 });
B.city("HUNGNAM", ...HUNG, { left: true, size: 34, t: 0.6 });
B.label("SEA OF JAPAN", 2380, 1180, { cls: "sea", size: 44, t: 0.8 });

// ships waiting offshore
const SHIP = `<svg viewBox="0 0 120 40" style="width:100%;height:100%;overflow:visible"><path d="M4 16 L116 16 L104 34 L14 34 Z" fill="#4c5560" stroke="#f7f3ea" stroke-width="3" stroke-linejoin="round"/>
  <rect x="44" y="4" width="26" height="13" fill="#3a424b" stroke="#f7f3ea" stroke-width="2.5"/><rect x="74" y="9" width="8" height="8" fill="#3a424b" stroke="#f7f3ea" stroke-width="2"/></svg>`;
[[2010, 1440], [2130, 1390], [2110, 1500], [2250, 1450], [1990, 1545], [2230, 1560]].forEach(([x, y], i) => {
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - 45}px;top:${y - 15}px;width:90px;height:30px;filter:drop-shadow(0 4px 4px rgba(0,0,0,0.4));`;
  el.innerHTML = SHIP; PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 1.2, ease: "power2.out" }, 1.0 + i * 0.25);
  tl.to(el, { x: -14, duration: END - 3, ease: "none" }, 2.3 + i * 0.25);
});
B.label("U.S. NAVY", 2140, 1610, { cls: "tg", size: 26, t: 2.4, until: T_BEHIND, anchor: [-50, -100] });

// the column comes down to the coast
const kinds = ["inf", "armor", "truck", "arty", "truck", "inf", "armor", "truck"];
kinds.forEach((k, i) => {
  const d0 = DCH + 120 - i * 48, d1 = MSR.len - 10 - i * 26, [x, y] = posAt(MSR, d0);
  B.unit({ id: "c" + i, side: "carth", x, y, w: 32, h: 26, label: i === 0 ? "1ST MARINE DIV" : null, t: 0.3 + i * 0.1 });
  if (k !== "inf") setIcon("c" + i, k);
  follow("c" + i, MSR, 0.8 + i * 0.15, T_BEHIND + 1.0 - i * 0.1, d0, d1, "sine.inOut");
});
B.units.c0.el.querySelector(".tag").style.cssText += "font-size:15px;position:absolute;left:40px;top:-2px;margin:0;";
gsap.set(B.units.c0.el, { zIndex: 3 });
B.caption("DEC 11 · THE LAST UNITS REACH HUNGNAM", 1.0, T_BEHIND - 0.2, "carth");

// the 9th Army Group left behind in the mountains
const reds = [[40.44, 127.15], [40.36, 127.17], [40.42, 127.34], [40.33, 127.38], [40.27, 127.2], [40.22, 127.26], [40.2, 127.42], [40.12, 127.3], [40.1, 127.5], [40.3, 127.45]];
reds.forEach(([la, lo], i) => B.unit({ id: "r" + i, side: "rome", x: G(la, lo)[0], y: G(la, lo)[1], w: 40, h: 34, label: i === 2 ? "CHINESE 9TH ARMY GROUP" : null, t: 0.5 + i * 0.1 }));
B.units.r2.el.querySelector(".tag").style.fontSize = "15px";
B.grey(reds.map((_, i) => "r" + i), T_WRECK - 0.2, 1.2);
B.caption("CHINESE LOSSES: TENS OF THOUSANDS", T_TENS - 0.2, T_MONTHS - 0.2, "rome");
B.caption("9TH ARMY GROUP · OUT OF ACTION UNTIL SPRING", T_MONTHS, T_MAR - 0.3, "rome");
B.caption("MARINES: ~1,000 DEAD · THOUSANDS WOUNDED & FROSTBITTEN", T_MAR + 0.2, T_DIV - 0.2, "carth");
const ring = svgEl(`<circle cx="${HUNG[0] - 30}" cy="${HUNG[1] - 30}" r="120" fill="rgba(31,79,196,0.15)" stroke="var(--carth)" stroke-width="8" stroke-dasharray="22 12"/>`, T_DIV - 0.4, S8 + 1, 0.6);
B.caption("THEY CAME OUT AS A DIVISION", T_DIV + 0.1, P("breakout-7") + B.T.paras["breakout-7"][1] - S7 + 1.0, "carth");

// ---------- breakout-8: method card, rule 3 ----------
B.dateBox(S8 - 0.4, null);
B.dim(T_R1 - 1.2, T_HOLD + 0.2, 0.75);
methodCard({ t: T_R1 - 1.0, until: T_HOLD - 0.3, rowT: [T_R1 - 0.2, T_R2 - 0.2, T_R3 - 0.2], hi: 2, hiT: T_THIRD - 0.3 });
// a retreat turned into an attack: the whole road lit in blue, the enemy wrecked on both sides
const lit = road(MSR, { t: T_HOLD + 0.3, dur: 3.0, w: 14, color: "#2f63e0", casing: "#f7f3ea" });
B.caption("A RETREAT TURNED INTO AN ATTACK", T_RETREAT - 0.4, END - 0.3, "carth");
B.finish();
