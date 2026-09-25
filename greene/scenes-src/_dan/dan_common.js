// ===== shared Race-to-the-Dan basemap helpers (assets/dan_region.json: zoom 9, origin 34859,50772) =====
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const SVGNS = "http://www.w3.org/2000/svg";
const G = (lat, lon) => {
  const n = 256 * 2 ** 9, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 34859).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 50772).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));
// rivers traced from Natural Earth 10m centerlines (public domain), projected to this basemap
__RIV__
const PL = { // places
  cowpens: G(35.13, -81.82), ramsour: G(35.47, -81.26), cowan: G(35.43, -80.96), trading: G(35.69, -80.39),
  salisbury: G(35.67, -80.47), guilford: G(36.13, -79.85), hillsborough: G(36.08, -79.10), boyd: G(36.69, -78.87),
  irwin: G(36.70, -78.93), dix: G(36.60, -79.35), cheraw: G(34.70, -79.88), charlotte: G(35.23, -80.84),
  winnsboro: G(34.38, -81.09), salem: G(36.09, -80.24), sherrill: G(35.62, -80.99),
};
const HAS = __HAS__; // media present at build time
const US_FLAG = "assets/media/us_flag_13star.png", GB_FLAG = "assets/media/gb_flag_1606.png";
const person = (key, o) => HAS[key + "_head"]
  ? B.portraitStake({ img: `assets/media/${key}_head.png`, flag: o.side === "rome" ? GB_FLAG : US_FLAG, name: o.name, x: o.x, y: o.y, size: o.size, t: o.t, until: o.until })
  : B.plaque({ name: o.name, role: o.role, side: o.side, x: o.x, y: o.y, t: o.t, until: o.until });

const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  (parent || document.getElementById("overlay")).appendChild(e);
  return e;
};
const smooth = (pts) => { // same Catmull-Rom as the engine
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}, ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
};

// ---------- base map: state lines, rivers, river labels ----------
const RP = {};
{ const st = document.createElement("style"); st.textContent = ".unit .tag{font-size:17px;padding:0 7px}"; document.head.appendChild(st); }
function drawBase(o = {}) {
  const ov = document.getElementById("overlay");
  const border = (ll) => {
    const p = document.createElementNS(SVGNS, "path");
    p.setAttribute("d", smooth(GL(ll))); p.setAttribute("fill", "none"); p.setAttribute("stroke", "rgba(58,44,28,0.55)");
    p.setAttribute("stroke-width", "4"); p.setAttribute("stroke-dasharray", "16 10");
    ov.insertBefore(p, ov.firstChild);
  };
  border([[36.55, -83.2], [36.56, -81.7], [36.54, -79.5], [36.55, -77.2], [36.55, -75.87]]); // VA / NC
  border([[33.85, -78.54], [34.33, -79.1], [34.81, -79.67], [34.82, -80.79], [35.08, -80.93], [35.15, -81.04], [35.17, -82.3], [35.2, -83.1]]); // NC / SC
  RP.roanoke = B.river(RIV.roanoke, 8);
  RP.catawba = B.river(RIV.catawba, 7);
  RP.yadkin = B.river(RIV.yadkin, 8);
  RP.dan = B.river(RIV.dan, 8);
  ["roanoke", "catawba", "yadkin", "dan"].forEach((k) => { RP[k].removeAttribute("stroke"); RP[k].style.stroke = "#7fa3b3"; });
  const t = o.t || 0;
  const rl = (txt, x, y, rot, size) => B.label(txt, x, y, { cls: "river", size: size || 24, rot, anchor: [-50, -50], t, instant: t === 0 });
  RP.lab = {
    catawba: rl("CATAWBA", 1262, 1300, 86),
    yadkin: rl("YADKIN", 1300, 560, -8),
    peedee: rl("PEE DEE", 1655, 1345, 66),
    dan: rl("DAN", 1556, 500, -30),
  };
  if (o.states !== false) {
    const sl = (txt, x, y, size) => B.label(txt, x, y, { cls: "country", size: size || 46, t: o.statesT != null ? o.statesT : t + 0.4, until: o.statesUntil });
    RP.states = [sl("NORTH CAROLINA", 1880, 820), sl("SOUTH CAROLINA", 1560, 1450), sl("VIRGINIA", 1700, 290)];
  }
}

// ---------- small world objects ----------
const BOAT_SVG = `<svg viewBox="0 0 40 18" width="100%" height="100%" style="overflow:visible">
  <path d="M1 7 L39 7 L35 15 L5 15 Z" fill="#5b3b1f" stroke="#1b1812" stroke-width="1.6" stroke-linejoin="round"/>
  <line x1="5" y1="10.5" x2="35" y2="10.5" stroke="#a07a4a" stroke-width="1.2"/>
  <line x1="28" y1="-6" x2="22" y2="13" stroke="#2a1c10" stroke-width="1.6" stroke-linecap="round"/></svg>`;
function boat(x, y, t, o = {}) {
  const w = o.w || 30, h = w * 0.45, el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.5));${o.rot ? `rotate:${o.rot}deg;` : ""}`;
  el.innerHTML = BOAT_SVG;
  document.getElementById("pins").appendChild(el);
  gsap.set(el, { autoAlpha: 0 });
  if (t != null) B.tl.fromTo(el, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2.2)" }, t);
  if (o.until != null) B.tl.to(el, { autoAlpha: 0, duration: 0.4 }, o.until);
  return { el, w, h, x, y };
}
function boatTo(b, t, dur, pts, ease = "sine.inOut") { // move along a list of points (pre-sampled, no DOM measuring)
  const segs = [];
  let prev = [b.x, b.y], tot = 0;
  pts.forEach((p) => { const d = Math.hypot(p[0] - prev[0], p[1] - prev[1]); segs.push([p, d]); tot += d; prev = p; });
  let tt = t;
  segs.forEach(([p, d], i) => {
    const dd = dur * (d / (tot || 1));
    B.tl.to(b.el, { left: p[0] - b.w / 2, top: p[1] - b.h / 2, duration: Math.max(dd, 0.01), ease: segs.length === 1 ? ease : i === 0 ? "sine.in" : i === segs.length - 1 ? "sine.out" : "none" }, tt);
    tt += dd;
  });
  b.x = pts[pts.length - 1][0]; b.y = pts[pts.length - 1][1];
}
const mid = (arr, a, b) => arr.slice(a, b); // helper for river sub-paths
function nearestIdx(arr, p) { let bi = 0, bd = 1e9; arr.forEach((q, i) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; bi = i; } }); return bi; }

// burst star for a victory
function burst(x, y, t, r = 60, until) {
  const g = svgEl("g", { transform: `translate(${x} ${y})` });
  const pts = [];
  for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8, rr = i % 2 ? r * 0.45 : r; pts.push(`${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`); }
  const star = svgEl("polygon", { points: pts.join(" "), fill: "#f4d35e", stroke: "#1b1812", "stroke-width": 4, "stroke-linejoin": "round" }, g);
  const ring = svgEl("circle", { r: r * 0.6, fill: "none", stroke: "#f7f3ea", "stroke-width": 6 }, g);
  gsap.set([star, ring], { autoAlpha: 0, transformOrigin: "50% 50%" });
  B.tl.fromTo(star, { autoAlpha: 0, scale: 0.1, rotation: -40 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.5)" }, t);
  B.tl.fromTo(ring, { autoAlpha: 0.9, scale: 0.4 }, { autoAlpha: 0, scale: 2.6, duration: 1.2, ease: "power2.out", immediateRender: false }, t);
  if (until != null) B.tl.to(star, { autoAlpha: 0, scale: 0.6, duration: 0.5 }, until);
  return g;
}

// fire + smoke over a baggage park (seek-safe: finite repeats on the main timeline)
function wagonsOnFire(cx, cy, t, until, n = 5) {
  const g = svgEl("g", {});
  const glow = svgEl("ellipse", { cx, cy: cy + 4, rx: 70, ry: 42, fill: "rgba(255,120,20,0.35)", filter: "" }, g);
  const smokeG = svgEl("g", {}, g);
  const offs = [[-44, -6], [-14, 10], [16, -8], [44, 8], [0, -26], [-30, 26], [30, 28]].slice(0, n);
  const wagons = [], flames = [];
  offs.forEach(([dx, dy], i) => {
    const x = cx + dx, y = cy + dy, w = svgEl("g", { transform: `translate(${x} ${y})` }, g);
    svgEl("rect", { x: -11, y: -4, width: 22, height: 8, fill: "#6b4a2b", stroke: "#1b1812", "stroke-width": 1.5 }, w);
    svgEl("path", { d: "M -10 -4 Q -10 -14 0 -14 Q 10 -14 10 -4 Z", fill: "#e9dfc6", stroke: "#1b1812", "stroke-width": 1.5 }, w);
    svgEl("circle", { cx: -6, cy: 5, r: 3.4, fill: "#2a1c10" }, w); svgEl("circle", { cx: 6, cy: 5, r: 3.4, fill: "#2a1c10" }, w);
    wagons.push(w);
    [[-5, "#e8531b", 1.0], [3, "#f39a1e", 0.8], [0, "#ffd84a", 0.55]].forEach(([fx, col, s], k) => {
      const f = svgEl("path", { d: `M ${fx} -4 C ${fx - 9 * s} ${-12 * s - 4} ${fx - 3 * s} ${-22 * s - 4} ${fx + 1} ${-30 * s - 4} C ${fx + 4 * s} ${-20 * s - 4} ${fx + 9 * s} ${-12 * s - 4} ${fx} -4 Z`, fill: col }, w);
      flames.push([f, i, k]);
    });
  });
  const span = until - t;
  gsap.set(flames.map((f) => f[0]), { autoAlpha: 0, scaleY: 0.1, transformOrigin: "50% 100%" });
  flames.forEach(([f, i, k]) => {
    const t0 = t + i * 0.35 + k * 0.08, per = 0.32 + ((i * 3 + k) % 5) * 0.05;
    B.tl.to(f, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: "power2.out" }, t0);
    B.tl.fromTo(f, { scaleY: 1, scaleX: 1 }, { scaleY: 1.35, scaleX: 0.85, duration: per, yoyo: true, repeat: Math.max(Math.floor((until - t0 - 0.5) / per) - 1, 0), ease: "sine.inOut" }, t0 + 0.5);
  });
  wagons.forEach((w, i) => B.tl.to(w.querySelectorAll("rect,path:nth-of-type(1)"), { fill: "#2b2118", duration: 3 }, t + 1.5 + i * 0.4));
  gsap.set(glow, { autoAlpha: 0 });
  B.tl.to(glow, { autoAlpha: 1, duration: 1.0 }, t + 0.3);
  B.tl.fromTo(glow, { opacity: 1 }, { opacity: 0.55, duration: 0.45, yoyo: true, repeat: Math.max(Math.floor((span - 1.5) / 0.45) - 1, 0), ease: "sine.inOut" }, t + 1.3);
  for (let i = 0; i < 12; i++) { // smoke puffs rising and drifting east
    const s = svgEl("circle", { cx: cx + ((i * 37) % 90) - 45, cy: cy - 18, r: 12 + (i % 3) * 4, fill: "rgba(70,64,58,0.4)" }, smokeG);
    gsap.set(s, { autoAlpha: 0, transformOrigin: "50% 50%" });
    const per = 2.6 + (i % 4) * 0.3, t0 = t + 0.6 + i * 0.28;
    const reps = Math.max(Math.floor((until - t0) / per) - 1, 0);
    B.tl.fromTo(s, { autoAlpha: 0.85, x: 0, y: 0, scale: 0.6 }, { autoAlpha: 0, x: 40 + (i % 3) * 14, y: -110 - (i % 4) * 12, scale: 2.4, duration: per, ease: "power1.out", repeat: reps, immediateRender: false }, t0);
  }
  gsap.set(g, { autoAlpha: 0 });
  B.tl.to(g, { autoAlpha: 1, duration: 0.6 }, t - 0.6);
  B.tl.to(g, { autoAlpha: 0, duration: 1.0 }, until);
  return g;
}

// rain: deterministic streaks, finite repeats
function rain(t, until, opacity = 0.8) {
  const layer = document.createElement("div");
  layer.className = "fx-layer";
  layer.style.background = "rgba(40,52,64,0.22)";
  const tall = document.createElement("div");
  tall.style.cssText = "position:absolute;left:0;top:0;width:2100px;height:2160px;";
  let seed = 77;
  const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  let html = "";
  for (let i = 0; i < 320; i++) {
    const x = r() * 2100, y = r() * 1080, l = 26 + r() * 30, o = 0.25 + r() * 0.4;
    for (const dy of [0, 1080]) html += `<div style="position:absolute;left:${x.toFixed(0)}px;top:${(y + dy).toFixed(0)}px;width:2px;height:${l.toFixed(0)}px;background:rgba(220,232,240,${o.toFixed(2)});transform:rotate(14deg)"></div>`;
  }
  tall.innerHTML = html;
  layer.appendChild(tall); document.getElementById("fx").appendChild(layer);
  gsap.set(layer, { autoAlpha: 0 });
  const period = 1.1, reps = Math.max(Math.ceil((until - t) / period), 0);
  B.tl.to(layer, { autoAlpha: opacity, duration: 1.2 }, t);
  B.tl.fromTo(tall, { y: -1080, x: 0 }, { y: 0, x: -260, duration: period, ease: "none", repeat: reps }, t);
  B.tl.to(layer, { autoAlpha: 0, duration: 0.8 }, until);
  return layer;
}

// river pulse: glow under the river + thicker, brighter stroke
function pulseRiver(key, t) {
  B.highlight(RIV[key], t, null, 30);
  B.tl.to(RP[key], { attr: { "stroke-width": 16 }, stroke: "#9fd0ea", duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, t);
  const lab = RP.lab[key];
  if (lab) B.tl.to(lab, { scale: 1.35, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, t);
}
// musket / cannon puffs
function puffs(x, y, t, n = 3, spread = 30, col = "#f7f3ea") {
  for (let i = 0; i < n; i++) {
    const c = svgEl("circle", { cx: x + ((i * 53) % (2 * spread)) - spread, cy: y + ((i * 29) % spread) - spread / 2, r: 7, fill: col, stroke: "rgba(0,0,0,0.3)", "stroke-width": 1 });
    gsap.set(c, { autoAlpha: 0, transformOrigin: "50% 50%" });
    B.tl.fromTo(c, { autoAlpha: 1, scale: 0.4 }, { autoAlpha: 0, scale: 2.4, duration: 1.1, ease: "power2.out", immediateRender: false }, t + i * 0.22);
  }
}
// ===== end shared =====
