window.COW_MEDIA = []; // set by build
// Move 2 · Cowpens (1): the position, the three lines, the bait order. Basemap cowpens (z16, 1.95 m/px).
// Americans = blue ("carth"), British = red ("rome"). Layout shared with cowpens3.js (keep in sync).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const NS = "http://www.w3.org/2000/svg";
const OV = document.getElementById("overlay");
const PINS = document.getElementById("pins");

// ---------- media available at build time (portraits/flags) ----------
const HAS = {};
["morgan_head.png", "tarleton_head.png", "pickens_head.png", "howard_head.png", "washington_w_head.png", "us_flag_13star.png", "gb_flag_1707.png"]
  .forEach((f) => { HAS[f] = (window.COW_MEDIA || []).includes(f); });

// ---------- projection (assets/cowpens.json: zoom 16) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 16, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 4574312).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 6636922).toFixed(1)];
};
// ---------- battle frame: a = metres-ish toward the British (SE), b = toward the American LEFT (NE) ----------
// Militia line centred on the Cowpens Battlefield Trail (~35.1338,-81.8129); Continentals on the rise by the
// Washington Light Infantry monument (35.1350,-81.8149); cavalry behind the second rise (visitor centre, 35.1367,-81.8181).
const O = [1555, 889], F = [0.882, 0.471], L = [0.471, -0.882];
const U = (a, b) => [+(O[0] + a * F[0] + b * L[0]).toFixed(1), +(O[1] + a * F[1] + b * L[1]).toFixed(1)];
const ROT = -62; // unit blocks lie along the lines
const A = { how: -125, mil: 0, sharp: 120, cav: -300, red: 330, res: 480 };

const unit = (id, side, kind, a, b, w, h, t, o = {}) => {
  const [x, y] = U(a, b);
  const el = B.unit({ id, side, kind, x, y, w, h, t, alpha: o.alpha });
  gsap.set(el.querySelector(".blk"), { rotation: o.rot != null ? o.rot : ROT }); // via GSAP (it would wipe a CSS rotate)
  B.units[id].a = a; B.units[id].b = b;
  return el;
};
const mv = (id, t, dur, a, b, ease) => { const [x, y] = U(a, b); B.move(id, t, dur, x, y, ease); B.units[id].a = a; B.units[id].b = b; };
const pathMove = (id, t, dur, pts, ease = "sine.inOut") => { // move through several (a,b) waypoints, time split by distance
  const P0 = [[B.units[id].a, B.units[id].b], ...pts];
  const seg = []; let tot = 0;
  for (let i = 1; i < P0.length; i++) { const d = Math.hypot(P0[i][0] - P0[i - 1][0], P0[i][1] - P0[i - 1][1]); seg.push(d); tot += d; }
  let tt = t;
  for (let i = 1; i < P0.length; i++) {
    const d = dur * seg[i - 1] / tot;
    mv(id, tt, d, P0[i][0], P0[i][1], i === 1 ? "sine.in" : i === P0.length - 1 ? "sine.out" : "none");
    tt += d;
  }
  B.units[id].a = pts[pts.length - 1][0]; B.units[id].b = pts[pts.length - 1][1];
};
const pill = (text, x, y, side, t, until, o = {}) => { // coloured name tag in world space
  const el = B.label(text, x, y, { size: o.size || 17, t, until, anchor: o.anchor || [0, -50] });
  Object.assign(el.style, {
    background: side === "rome" ? "var(--rome)" : side === "carth" ? "var(--carth)" : "rgba(24,20,14,0.86)",
    color: "#fbfaf6", padding: "1px 9px 2px", borderRadius: "3px", textShadow: "none", letterSpacing: "0.07em",
    border: "2px solid #f7f3ea", boxShadow: "0 3px 6px rgba(0,0,0,0.35)",
  });
  return el;
};
const stake = (o) => { // portrait stake if the portrait exists, else a plaque
  const flag = o.side === "rome" ? "gb_flag_1707.png" : "us_flag_13star.png";
  if (HAS[o.img]) {
    const el = B.portraitStake({ img: "assets/media/" + o.img, flag: HAS[flag] ? "assets/media/" + flag : "", name: o.name, x: o.x, y: o.y, size: o.size || 0.5, t: o.t, until: o.until });
    if (!HAS[flag]) el.querySelector(".flag").style.display = "none";
    if (o.side === "rome") {
      el.querySelector(".face").style.boxShadow = "0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5)";
      el.querySelector(".nm").style.background = "#c4121f";
    }
    el._foot = [o.x, o.y]; el._l0 = parseFloat(el.style.left); el._t0 = parseFloat(el.style.top);
    return el;
  }
  const el = B.plaque({ name: o.name, role: o.role, side: o.side, x: o.x, y: o.y + 60, t: o.t, until: o.until });
  gsap.set(el, { scale: 0.62, transformOrigin: "19px 240px" });
  el._foot = [o.x, o.y]; el._l0 = parseFloat(el.style.left); el._t0 = parseFloat(el.style.top);
  return el;
};
const moveStake = (el, t, dur, x, y, ease = "power2.inOut") => { // move a stake's foot to (x, y)
  B.tl.to(el, { left: el._l0 + x - el._foot[0], top: el._t0 + y - el._foot[1], duration: dur, ease }, t);
};
const now = (el) => { B.tl.getTweensOf(el).forEach((tw) => tw.kill()); gsap.set(el, { autoAlpha: 1, y: 0 }); return el; }; // visible from frame 0
// soft glow marking a low rise
const rise = (x, y, rx, ry, rot, t, until) => {
  const e = document.createElementNS(NS, "ellipse");
  const gid = "rg" + Math.round(x);
  const defs = document.createElementNS(NS, "defs");
  defs.innerHTML = `<radialGradient id="${gid}"><stop offset="0" stop-color="#fffbe8" stop-opacity="0.55"/><stop offset="0.6" stop-color="#fffbe8" stop-opacity="0.22"/><stop offset="1" stop-color="#fffbe8" stop-opacity="0"/></radialGradient>`;
  OV.insertBefore(defs, OV.firstChild);
  Object.entries({ cx: x, cy: y, rx, ry, fill: `url(#${gid})`, transform: `rotate(${rot} ${x} ${y})` }).forEach(([k, v]) => e.setAttribute(k, v));
  OV.insertBefore(e, defs.nextSibling);
  gsap.set(e, { autoAlpha: 0 });
  B.tl.to(e, { autoAlpha: 1, duration: 1.2 }, t);
  if (until != null) B.tl.to(e, { autoAlpha: 0, duration: 1 }, until);
  return e;
};
// dashed arrow that draws on along its path (planned routes)
let dN = 0;
const dashArrow = (pts, o) => {
  const g = document.createElementNS(NS, "g");
  const mid = "dm" + (++dN), w = o.width || 9;
  const d = (() => { // Catmull-Rom like the engine
    let s = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
      s += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}, ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}, ${p2[0]} ${p2[1]}`;
    }
    return s;
  })();
  const col = o.side === "rome" ? "var(--rome)" : o.side === "carth" ? "var(--carth)" : "#fbfaf6";
  const [x2, y2] = pts[pts.length - 1], [x1, y1] = pts[pts.length - 2];
  const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 90;
  g.innerHTML = `<mask id="${mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="2880" height="1620"><path d="${d}" fill="none" stroke="#fff" stroke-width="${w * 4}" stroke-linecap="round"/></mask>
    <g mask="url(#${mid})"><path d="${d}" fill="none" stroke="rgba(20,16,10,0.55)" stroke-width="${w + 5}" stroke-dasharray="${w * 2.2} ${w * 1.6}" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-dasharray="${w * 2.2} ${w * 1.6}" stroke-linecap="round"/></g>
    <g transform="translate(${x2} ${y2}) rotate(${ang.toFixed(1)})"><polygon class="hd" points="${-w * 1.9},2 ${w * 1.9},2 0,${-w * 2.8}" fill="${col}" stroke="rgba(20,16,10,0.6)" stroke-width="3" stroke-linejoin="round"/></g>`;
  OV.appendChild(g);
  const mp = g.querySelector("mask path");
  const len = mp.getTotalLength();
  gsap.set(mp, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len });
  gsap.set(g.querySelector(".hd"), { scale: 0, transformOrigin: "50% 100%" });
  gsap.set(g, { autoAlpha: 0 });
  B.tl.to(g, { autoAlpha: 1, duration: 0.01 }, o.t);
  B.tl.to(mp, { strokeDashoffset: 0, duration: o.dur || 2, ease: "power1.inOut" }, o.t);
  B.tl.to(g.querySelector(".hd"), { scale: 1, duration: 0.3, ease: "back.out(2.5)" }, o.t + (o.dur || 2) - 0.1);
  if (o.until != null) B.tl.to(g, { autoAlpha: 0, duration: 0.6 }, o.until);
  return g;
};
// musket volley: flash + smoke at points along a line, firing in direction dir
const R = (() => { let s = 1781; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
const volley = (pts, t, dir, o = {}) => {
  const ang = Math.atan2(dir[1], dir[0]) * 180 / Math.PI;
  pts.forEach(([x, y]) => {
    const dt = R() * (o.spread != null ? o.spread : 0.3);
    const g = document.createElementNS(NS, "g");
    g.setAttribute("transform", `translate(${x} ${y}) rotate(${ang.toFixed(1)})`);
    const sc = o.scale || 1;
    g.innerHTML = `<circle class="sm" cx="${10 * sc}" cy="0" r="${6 * sc}" fill="rgba(246,244,238,0.9)"/>
      <polygon class="fl" points="0,${-6 * sc} ${16 * sc},${-9 * sc} ${22 * sc},${-3 * sc} ${36 * sc},0 ${22 * sc},${3 * sc} ${16 * sc},${9 * sc} 0,${6 * sc}" fill="#ffcf3a" stroke="#fff4c2" stroke-width="2"/>`;
    OV.appendChild(g);
    const fl = g.querySelector(".fl"), sm = g.querySelector(".sm");
    gsap.set(fl, { autoAlpha: 0, scale: 0.3, transformOrigin: "0% 50%" });
    gsap.set(sm, { autoAlpha: 0 });
    B.tl.to(fl, { autoAlpha: 1, scale: 1, duration: 0.07 }, t + dt);
    B.tl.to(fl, { autoAlpha: 0, scale: 0.7, duration: 0.25 }, t + dt + 0.12);
    B.tl.fromTo(sm, { autoAlpha: 0.95, attr: { r: 6 * sc, cx: 10 * sc } }, { autoAlpha: 0, attr: { r: 26 * sc, cx: 34 * sc }, duration: o.smoke || 2.6, ease: "power1.out", immediateRender: false }, t + dt + 0.05);
  });
};
const along = (a, b0, b1, n) => Array.from({ length: n }, (_, i) => U(a, b0 + (b1 - b0) * (n === 1 ? 0.5 : i / (n - 1))));
const pulse = (els, t, n = 2) => els.forEach((el) => B.tl.fromTo(el.querySelector(".blk"), { scale: 1 }, { scale: 1.3, duration: 0.35, yoyo: true, repeat: n * 2 - 1, ease: "sine.inOut", immediateRender: false }, t));
// scattered trees: a lightly wooded pasture with woods around the edges
const trees = (t) => {
  const g = document.createElementNS(NS, "g");
  const r = (() => { let s = 4242; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  let html = "";
  for (let i = 0; i < 900; i++) {
    const x = r() * 2880, y = r() * 1620;
    const dx = (x - 1560) / 820, dy = (y - 880) / 470; // the open pasture
    const inField = dx * dx + dy * dy;
    if (inField < 1 && r() > 0.05) continue;
    if (inField < 1.5 && r() > 0.45) continue;
    const s = 5 + r() * 5;
    html += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s.toFixed(1)}" fill="rgba(74,86,48,0.42)"/>`;
  }
  g.innerHTML = html;
  OV.insertBefore(g, OV.firstChild);
  gsap.set(g, { autoAlpha: 0 });
  B.tl.to(g, { autoAlpha: 1, duration: 1.5 }, t);
  return g;
};
const road = (pts, t) => {
  const g = document.createElementNS(NS, "g");
  const d = "M " + pts.map((p) => p.join(" ")).join(" L ");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(96,70,38,0.45)" stroke-width="11" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="#e9dcb8" stroke-width="5" stroke-dasharray="14 9" stroke-linejoin="round"/>`;
  OV.appendChild(g);
  gsap.set(g, { autoAlpha: 0 });
  B.tl.to(g, { autoAlpha: 1, duration: 1.2 }, t);
  return g;
};
// officer marks (gold stars) riding on a unit block
const officers = (id, t) => {
  const u = B.units[id], out = [];
  [-1, 1].forEach((k) => {
    const d = document.createElement("div");
    d.innerHTML = `<svg viewBox="-10 -10 20 20" width="18" height="18"><polygon points="0,-9 2.6,-3 9,-2.8 4,1.6 5.6,8.4 0,4.6 -5.6,8.4 -4,1.6 -9,-2.8 -2.6,-3" fill="#f4c430" stroke="#2a1d08" stroke-width="1.6"/></svg>`;
    d.style.cssText = `position:absolute;left:${u.w / 2 - 9 + k * 16 * L[0]}px;top:${u.h / 2 - 9 + k * 16 * L[1]}px;width:18px;height:18px;`;
    u.el.appendChild(d); out.push(d);
    gsap.set(d, { autoAlpha: 0 });
    B.tl.fromTo(d, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, t + (k > 0 ? 0.15 : 0));
  });
  return out;
};
const fall = (marks, t) => marks.forEach((d, i) => {
  B.tl.to(d.querySelector("polygon"), { attr: { fill: "#6d6a63" }, duration: 0.2 }, t + i * 0.08);
  B.tl.to(d, { y: 10, rotation: 90, autoAlpha: 0.0, duration: 0.9, ease: "power2.in" }, t + i * 0.08 + 0.2);
});
const measure = (p0, p1, text, t, until, o = {}) => { // dimension line with end ticks + text
  const g = document.createElementNS(NS, "g");
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy), nx = -dy / l * 9, ny = dx / l * 9;
  const ln = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
  g.innerHTML = `<g stroke="rgba(20,16,10,0.6)" stroke-width="7" stroke-linecap="round">${ln(p0, p1)}${ln([p0[0] - nx, p0[1] - ny], [p0[0] + nx, p0[1] + ny])}${ln([p1[0] - nx, p1[1] - ny], [p1[0] + nx, p1[1] + ny])}</g>
    <g stroke="#fbfaf6" stroke-width="3.5" stroke-linecap="round">${ln(p0, p1)}${ln([p0[0] - nx, p0[1] - ny], [p0[0] + nx, p0[1] + ny])}${ln([p1[0] - nx, p1[1] - ny], [p1[0] + nx, p1[1] + ny])}</g>`;
  OV.appendChild(g); gsap.set(g, { autoAlpha: 0 });
  B.tl.to(g, { autoAlpha: 1, duration: 0.3 }, t);
  B.tl.to(g, { autoAlpha: 0, duration: 0.4 }, until);
  pill(text, (p0[0] + p1[0]) / 2 + (o.dx || 18), (p0[1] + p1[1]) / 2 + (o.dy || 0), "", t + 0.1, until, { size: o.size || 18, anchor: o.anchor || [0, -50] });
};
const clash = (x, y, t, s = 1) => { // white starburst where cavalry meets
  const g = document.createElementNS(NS, "g");
  const pts = Array.from({ length: 16 }, (_, i) => { const r = (i % 2 ? 14 : 38) * s, a = i * Math.PI / 8; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(" ");
  g.setAttribute("transform", `translate(${x} ${y})`);
  g.innerHTML = `<polygon points="${pts}" fill="#fff6d0" stroke="#c4121f" stroke-width="4" stroke-linejoin="round"/>`;
  OV.appendChild(g);
  const p = g.querySelector("polygon");
  gsap.set(p, { autoAlpha: 0, scale: 0.2, transformOrigin: "50% 50%" });
  B.tl.to(p, { autoAlpha: 1, scale: 1.1, duration: 0.25, ease: "back.out(3)" }, t);
  B.tl.to(p, { scale: 0.8, rotation: 30, duration: 0.5, yoyo: true, repeat: 3 }, t + 0.25);
  B.tl.to(p, { autoAlpha: 0, duration: 0.5 }, t + 2.4);
};
// Green River Road: OSM "Historic Green River Road" + battlefield trail, extended to the map edges
const ROAD = [[2880, 1265], [2560, 1150], [2300, 1070], [2037, 1004], [1930, 1010], [1814, 981], [1725, 952], [1669, 930], [1560, 890], [1459, 873], [1445, 804], [1310, 707], [1150, 612], [900, 470], [620, 330], [300, 190], [0, 70]];

// =====================================================================================
// cowpens2: cow-4 … cow-6
// =====================================================================================
const T4 = P("cow-4"), T5 = P("cow-5"), T6 = P("cow-6");

B.camera([
  [0, 1500, 800, 0.72],
  [at("cow-4", "No swamp"), 1520, 830, 0.95],
  [at("cow-4", "And a deep river"), 1480, 760, 0.95],
  [at("cow-4", "Every military manual"), 1500, 830, 1.05],
  [T5 + 1.0, 1560, 880, 1.25],
  [at("cow-5", "In front, he placed"), 1640, 920, 1.62],
  [at("cow-5", "Behind them, the militia"), 1590, 900, 1.62],
  [at("cow-5", "And behind them, on the crest"), 1510, 860, 1.58],
  [at("cow-5", "Out of sight"), 1470, 830, 1.5],
  [T6 + 0.5, 1520, 820, 1.4],
  [at("cow-6", "you may retire"), 1520, 800, 1.32],
  [at("cow-6", "Morgan wasn't hiding"), 1530, 810, 1.36],
  [END, 1540, 820, 1.42],
]);

B.showDate(0.2);
B.date("16 JANUARY 1781", 0.4, null, 36);

// ---------- terrain ----------
trees(0);
road(ROAD, 0);
const riseA = rise(...U(-125, 0), 250, 120, ROT, 0.8);
const riseB = rise(...U(-300, 40), 200, 110, ROT, 1.1);
const glR = B.label("GREEN RIVER ROAD", 2330, 1040, { cls: "tg", size: 26, t: 1.2, until: T5 + 1, rot: 16 });
B.label("THE COWPENS", 1560, 560, { cls: "country", size: 64, t: 0.6, until: at("cow-4", "No swamp") - 0.3, anchor: [-50, -50] });
B.label("FIRST RISE", ...U(-150, -170), { cls: "tg", size: 22, t: at("cow-4", "On paper") + 1.2, until: T5 + 1 });
B.label("SECOND RISE", ...U(-340, -130), { cls: "tg", size: 22, t: at("cow-4", "On paper") + 1.6, until: T5 + 1 });

// OPEN GROUND: the empty pasture pulses
const field = document.createElementNS(NS, "ellipse");
Object.entries({ cx: 1600, cy: 900, rx: 560, ry: 330, fill: "rgba(255,250,225,0.16)", stroke: "#fbfaf6", "stroke-width": 5, "stroke-dasharray": "22 14", transform: "rotate(28 1600 900)" }).forEach(([k, v]) => field.setAttribute(k, v));
OV.appendChild(field); gsap.set(field, { autoAlpha: 0 });
B.tl.to(field, { autoAlpha: 1, duration: 0.8 }, at("cow-4", "Open ground"));
B.tl.to(field, { autoAlpha: 0, duration: 0.8 }, at("cow-4", "And a deep river"));
B.caption("OPEN GROUND", at("cow-4", "Open ground"), at("cow-4", "No swamp") - 0.15);
B.caption("OPEN FLANKS", at("cow-4", "No swamp"), at("cow-4", "And a deep river") - 0.15);
B.caption("RIVER BEHIND", at("cow-4", "And a deep river"), at("cow-4", "Every military manual") - 0.1);
B.caption("BY THE BOOK: A MISTAKE", at("cow-4", "Every military manual"), T5 - 0.2, "rome");
// open flanks: cavalry could ride round either end
dashArrow([[2060, 1150], [1900, 1320], [1600, 1330], [1320, 1180], [1180, 1000]], { side: "white", width: 10, t: at("cow-4", "No swamp") + 0.2, dur: 2.2, until: at("cow-4", "And a deep river") + 0.4 });
dashArrow([[2060, 900], [2020, 640], [1800, 470], [1560, 470], [1420, 560]], { side: "white", width: 10, t: at("cow-4", "No swamp") + 0.5, dur: 2.2, until: at("cow-4", "And a deep river") + 0.4 });
// river behind: the Broad River lies ~6 miles to the north
B.arrow({ side: "white", pts: [[1300, 640], [1275, 470], [1262, 300]], width: 18, t: at("cow-4", "And a deep river") + 0.1, dur: 1.4, until: T5 + 0.5 });
B.label("BROAD RIVER ~6 MI", 1262, 245, { cls: "river", size: 34, t: at("cow-4", "And a deep river") + 0.6, until: T6 - 0.5, anchor: [-50, -50] });
const noEsc = B.label("NOWHERE TO RUN", ...U(-420, -60), { cls: "tg", size: 26, t: at("cow-4", "nowhere to run") - 0.2, until: at("cow-4", "Every military manual") + 1.5, anchor: [-50, -50] });

// Morgan's stake: "exactly how Morgan wanted it to look"
const MOR = U(-205, 55);
stake({ img: "morgan_head.png", name: "MORGAN", role: "Brig. Gen. · commanding", side: "carth", x: MOR[0], y: MOR[1], size: 0.52, t: at("cow-4", "That was exactly how") });

// ---------- cow-5: three lines, one after another ----------
B.caption("MILITIA RUN — SO PLAN FOR IT", at("cow-5", "and he knew that militia ran"), at("cow-5", "In front, he placed") - 0.2, "carth");
const tS = at("cow-5", "thin screen of sharpshooters") - 0.6;
[-150, -75, 0, 75, 150].forEach((b, i) => unit("sh" + i, "carth", "light", A.sharp, b, 36, 22, tS + i * 0.12));
pill("SHARPSHOOTERS · ~150", 1775, 800, "carth", tS + 0.7, T6 + 0.3);

const tM = at("cow-5", "the militia under Andrew Pickens") - 0.3;
[-150, -75, 0, 75, 150].forEach((b, i) => unit("mil" + i, "carth", "inf", A.mil, b, 62, 24, tM + i * 0.12));
pill("MILITIA · ~1,000", 1665, 736, "carth", tM + 0.8, T6 + 0.3);
stake({ img: "pickens_head.png", name: "PICKENS", role: "Militia", side: "carth", x: U(A.mil + 10, -220)[0], y: U(A.mil + 10, -220)[1], size: 0.46, t: at("cow-5", "Andrew Pickens"), until: T6 + 0.3 });

const tH = at("cow-5", "his veteran Continentals") - 0.2;
[-105, -35, 35, 105].forEach((b, i) => unit("how" + i, "carth", "inf", A.how, b, 64, 28, tH + i * 0.14));
pill("CONTINENTALS · ~450", 1540, 690, "carth", tH + 0.7, T6 + 0.3);
stake({ img: "howard_head.png", name: "HOWARD", role: "Continentals", side: "carth", x: U(A.how + 10, -185)[0], y: U(A.how + 10, -185)[1], size: 0.46, t: at("cow-5", "John Eager Howard"), until: T6 + 0.3 });

const tC = at("cow-5", "waited William Washington's cavalry") - 0.4;
unit("cav", "carth", "cav", A.cav, 60, 70, 34, tC, { alpha: 0.5 });
pill("WASHINGTON'S CAVALRY · ~100", ...U(A.cav - 20, 100), "carth", tC + 0.6, T6 + 0.3, { anchor: [-100, -50] });
B.label("HIDDEN", ...U(A.cav + 5, -15), { cls: "tg", size: 18, t: tC + 1.0, until: T6 + 0.3, anchor: [-50, -50] });
B.tl.to(riseA, { autoAlpha: 0.55, duration: 1 }, T6);

// ---------- cow-6: the bait order ----------
const milEls = [0, 1, 2, 3, 4].map((i) => B.units["mil" + i].el);
B.highlight([U(0, -190), U(0, 190)], at("cow-6", "gave the militia an order"), null, 54);
B.caption("TWO VOLLEYS — THEN RETIRE", at("cow-6", "Just give me two volleys"), END - 0.3, "carth");
volley(along(A.mil + 14, -150, 150, 10), at("cow-6", "two volleys") + 0.2, F, { spread: 0.25 });
volley(along(A.mil + 14, -150, 150, 10), at("cow-6", "at killing range"), F, { spread: 0.25 });
// planned route: around the American left, to the rear of the hill
dashArrow([U(0, 200), U(-50, 285), U(-170, 300), U(-300, 250), U(-360, 120)], { side: "carth", width: 10, t: at("cow-6", "around our left flank") - 0.3, dur: 2.6 });
B.label("PLANNED ROUTE", ...U(-150, 330), { cls: "tg", size: 20, t: at("cow-6", "to the rear of the hill"), anchor: [-50, -50] });
pulse(milEls, at("cow-6", "use it as bait"), 2);
pill("THE BAIT", 1680, 705, "", at("cow-6", "use it as bait") - 0.2, null, { size: 24 });
B.finish();
