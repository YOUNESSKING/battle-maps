window.COW_MEDIA = ["burgoyne_head.png", "cornwallis_head.png", "gates_head.png", "gb_flag_1707.png", "greene_head.png", "howard_head.png", "morgan_full.png", "morgan_head.png", "pickens_head.png", "tarleton_head.png", "us_flag_13star.png"]; // set by build
// Move 2 · Cowpens (2): the battle, the double envelopment, stats, method. Basemap cowpens (z16, 1.95 m/px).
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
// cowpens3: cow-7 … cow-15 (the battle, the double envelopment, stats, method)
// =====================================================================================
const T7 = P("cow-7"), T8 = P("cow-8"), T9 = P("cow-9"), T10 = P("cow-10"), T11 = P("cow-11"),
  T12 = P("cow-12"), T13 = P("cow-13"), T14 = P("cow-14"), T15 = P("cow-15");
const UI = (x, y) => { const dx = x - O[0], dy = y - O[1]; return [dx * F[0] + dy * F[1], dx * L[0] + dy * L[1]]; };
const vis = (id, alpha = 1) => gsap.set(B.units[id].el, { autoAlpha: alpha });
const blk = (id) => B.units[id].el.querySelector(".blk");

// ---------- terrain (as at the end of cowpens2) ----------
now(trees(0));
now(road(ROAD, 0));
const riseA = now(rise(...U(-125, 0), 250, 120, ROT, 0));
now(rise(...U(-300, 40), 200, 110, ROT, 0));
gsap.set(riseA, { autoAlpha: 0.55 });

// ---------- the American position (final layout of cowpens2) ----------
const SH = [-150, -75, 0, 75, 150], MIL = [-150, -75, 0, 75, 150], HOW = [-105, -35, 35, 105];
SH.forEach((b, i) => { unit("sh" + i, "carth", "light", A.sharp, b, 36, 22, null); vis("sh" + i); });
MIL.forEach((b, i) => { unit("mil" + i, "carth", "inf", A.mil, b, 62, 24, null); vis("mil" + i); });
HOW.forEach((b, i) => { unit("how" + i, "carth", "inf", A.how, b, 64, 28, null); vis("how" + i); });
unit("cav", "carth", "cav", A.cav, 60, 70, 34, null); vis("cav", 0.5);
const MOR0 = U(-205, 55);
const morgan = stake({ img: "morgan_head.png", name: "MORGAN", role: "Brig. Gen.", side: "carth", x: MOR0[0], y: MOR0[1], size: 0.8, t: 0 });
now(morgan);

// ---------- camera ----------
B.camera([
  [0, 2040, 1090, 1.45],
  [at("cow-7", "When they came out") + 0.5, 1990, 1070, 1.4],
  [at("cow-7", "saw the Americans") + 0.3, 1740, 960, 1.22],
  [at("cow-7", "He formed his line"), 1770, 990, 1.3],
  [T8 + 0.5, 1760, 980, 1.35],
  [at("cow-8", "Then they fell back"), 1700, 930, 1.45],
  [at("cow-8", "the militia fired"), 1650, 900, 1.5],
  [T9 + 0.5, 1640, 880, 1.45],
  [at("cow-9", "To the British"), 1600, 820, 1.32],
  [at("cow-9", "They raised a cheer"), 1600, 830, 1.32],
  [at("cow-9", "straight into") + 1, 1560, 740, 1.4],
  [T10 + 0.5, 1560, 860, 1.42],
  [at("cow-10", "Tarleton threw in"), 1500, 1060, 1.35],
  [at("cow-10", "Howard ordered"), 1440, 990, 1.5],
  [at("cow-10", "The company turned"), 1450, 950, 1.45],
  [T11 + 0.5, 1420, 900, 1.4],
  [at("cow-11", "broke ranks"), 1400, 910, 1.45],
  [at("cow-11", "Morgan rode up"), 1330, 870, 1.5],
  [T12 + 0.5, 1360, 870, 1.65],
  [at("cow-12", "The effect"), 1370, 875, 1.72],
  [at("cow-12", "Before the stunned"), 1390, 890, 1.6],
  [T13 + 0.8, 1470, 860, 1.28],
  [at("cow-13", "And the militia"), 1430, 890, 1.28],
  [at("cow-13", "Morgan rode among"), 1400, 900, 1.34],
  [at("cow-13", "Attacked from the front"), 1460, 880, 1.3],
  [T14 + 0.5, 1650, 960, 1.15],
  [at("cow-14", "He escaped") + 4.5, 1760, 990, 1.1],
  [at("cow-14", "He escaped") + 9, 1620, 940, 1.2],
  [T15, 1520, 800, 1.15],
  [END, 1480, 740, 1.05],
]);

// ---------- cow-7: dawn, Tarleton forms his line ----------
B.showDate(0.2);
B.date("17 JANUARY 1781 · DAWN", 0.4, null, 30);
const dawn = document.createElement("div");
dawn.className = "fx-layer";
dawn.style.background = "radial-gradient(ellipse 80% 70% at 100% 100%, rgba(255,170,90,0.55), rgba(255,170,90,0) 70%), linear-gradient(180deg, rgba(60,50,90,0.28), rgba(255,160,90,0.10))";
document.getElementById("fx").appendChild(dawn);
B.tl.fromTo(dawn, { autoAlpha: 1 }, { autoAlpha: 0, duration: 14, ease: "sine.in" }, 1);

const COL = [[2090, 1017], [2150, 1032], [2210, 1047], [2270, 1062], [2330, 1079], [2390, 1097], [2450, 1116], [2510, 1135], [2570, 1153], [2630, 1178]];
const RED = { // id: [kind, a, b, w, h, column slot]
  drR: ["cav", A.red, 215, 50, 26, 0], lt: ["light", A.red, 110, 80, 28, 1], g1: ["gun", A.red + 5, 55, 22, 22, 2], leg: ["inf", A.red, 0, 80, 28, 3],
  g2: ["gun", A.red + 5, -55, 22, 22, 4], f7: ["inf", A.red, -110, 80, 28, 5], drL: ["cav", A.red, -215, 50, 26, 6],
  h71: ["inf", A.res, -90, 76, 28, 7], lcav: ["cav", A.res, 130, 72, 30, 8],
};
const tArrive = 0.8;
Object.entries(RED).forEach(([id, [kind, a, b, w, h, slot]], i) => {
  const [a0, b0] = UI(...COL[slot]);
  unit(id, "rome", kind === "gun" ? "light" : kind, a0 + 60, b0, w, h, tArrive + i * 0.3);
  if (kind === "gun") blk(id).querySelector("svg").innerHTML = `<circle cx="50" cy="50" r="24" fill="#f7f3ea"/>`;
  gsap.set(blk(id), { rotation: 16 }); // along the road
  mv(id, tArrive + i * 0.3, 9, a0 - 30, b0, "none"); // marching up the road
  mv(id, at("cow-7", "He formed his line") + (slot % 5) * 0.15, 2.4, a, b, "power2.inOut");
  B.tl.to(blk(id), { rotation: ROT, duration: 1.2 }, at("cow-7", "He formed his line") + 0.5 + (slot % 5) * 0.15);
});
B.arrow({ side: "rome", pts: [[2860, 1255], [2640, 1175], [2420, 1100], [2240, 1050]], width: 20, t: 0.5, dur: 2.5, until: at("cow-7", "He formed his line") });
B.label("FROM THICKETTY CREEK", 2560, 1235, { cls: "tg", size: 24, t: 1.2, until: at("cow-7", "He formed his line"), rot: 17, anchor: [-50, -50] });
B.caption("MARCHING SINCE 2 A.M.", 0.6, at("cow-7", "When they came out") + 0.8, "rome");
B.caption("NO REST · NO SCOUTING", at("cow-7", "Tarleton did not stop"), at("cow-7", "He formed his line") - 0.2, "rome");
const TAR = U(575, 0);
const tarleton = stake({ img: "tarleton_head.png", name: "TARLETON", role: "Lt. Col. · British Legion", side: "rome", x: TAR[0], y: TAR[1], size: 0.8, t: at("cow-7", "Tarleton did not stop") - 0.4 });
const tForm = at("cow-7", "He formed his line") + 2.2;
const redTags = [
  pill("LIGHT INF.", ...U(A.red + 32, 110 + 26), "rome", tForm, T8 + 2.5),
  pill("LEGION INF.", ...U(A.red + 32, 26), "rome", tForm + 0.15, T8 + 2.5),
  pill("7TH FOOT", ...U(A.red + 32, -110 + 26), "rome", tForm + 0.3, T8 + 2.5),
  pill("DRAGOONS", ...U(A.red + 30, 215 + 22), "rome", tForm + 0.45, T8 + 2.5),
  pill("DRAGOONS", ...U(A.red + 30, -215 + 22), "rome", tForm + 0.45, T8 + 2.5),
  pill("71ST HIGHLANDERS", ...U(A.res + 34, -90 + 26), "rome", tForm + 0.6, T8 + 2.5),
  pill("LEGION CAVALRY", ...U(A.res + 34, 130 + 26), "rome", tForm + 0.75, T8 + 2.5),
];
B.caption("~1,100 · ATTACK AT ONCE", at("cow-7", "ordered an immediate attack") - 0.3, T8 + 0.2, "rome");
[-110, 0, 110].forEach((b, i) => B.arrow({ side: "rome", pts: [U(A.red - 40, b), U(A.red - 150, b)], width: 16, t: at("cow-7", "ordered an immediate attack") + i * 0.2, dur: 0.9, until: T8 + 2.5 }));

// ---------- cow-8: sharpshooters, officers, two militia volleys ----------
const FRONT = ["lt", "leg", "f7"];
const tShoot = at("cow-8", "The sharpshooters opened fire");
FRONT.concat(["drR", "drL", "g1", "g2"]).forEach((id) => mv(id, T8 + 0.2, 8.5, 205, B.units[id].b, "none"));
mv("h71", T8 + 0.2, 9, 400, -90, "none"); mv("lcav", T8 + 0.2, 9, 420, 130, "none");
pill("SHARPSHOOTERS", ...U(A.sharp + 26, 180), "carth", T8 + 0.3, at("cow-8", "Then they fell back") + 1);
[0, 1.4, 2.8, 4.2].forEach((dt, k) => volley(SH.filter((_, i) => (i + k) % 2 === 0).map((b) => U(A.sharp + 12, b + 8 * (k - 1.5))), tShoot + 0.6 + dt, F, { spread: 0.5, scale: 0.8 }));
const marks = {};
FRONT.forEach((id, i) => { marks[id] = officers(id, at("cow-8", "the men with epaulettes") - 0.3 + i * 0.2); });
B.caption("AIM FOR THE EPAULETTES", at("cow-8", "aiming"), at("cow-8", "Then they fell back") - 0.1, "carth");
fall([marks.leg[0], marks.lt[1]], at("cow-8", "the men with epaulettes") + 1.4);
// sharpshooters fall back into the militia line
SH.forEach((b, i) => mv("sh" + i, at("cow-8", "Then they fell back") + i * 0.1, 2.2, A.mil + 22, [-112, -37, 37, 112, 185][i]));
B.hideUnits(SH.map((_, i) => "sh" + i), at("cow-8", "The British came on") + 1.2, 0.8);
const tV1 = at("cow-8", "the militia fired"), tV2 = at("cow-8", "and then fired again");
FRONT.concat(["g1", "g2"]).forEach((id) => mv(id, at("cow-8", "The British came on") - 0.4, tV1 - at("cow-8", "The British came on") + 0.2, 92, B.units[id].b, "power1.out"));
mv("drR", at("cow-8", "The British came on"), 3, 150, 235); mv("drL", at("cow-8", "The British came on"), 3, 150, -235);
measure(U(14, 268), U(78, 268), "~50 YARDS", tV1 - 1.6, T9 + 0.4);
volley(along(A.mil + 14, -165, 165, 13), tV1, F, { spread: 0.3 });
volley(along(A.mil + 14, -165, 165, 13), tV2, F, { spread: 0.3 });
B.caption("TWO VOLLEYS AT ~50 YARDS", tV1 - 0.2, at("cow-8", "Those volleys cut down") - 0.1, "carth");
fall([marks.lt[0], marks.leg[1], marks.f7[0]], tV1 + 0.3);
fall([marks.f7[1]], tV2 + 0.3);
B.caption("BRITISH OFFICERS CUT DOWN", at("cow-8", "Those volleys cut down"), T9 - 0.1, "carth");
FRONT.forEach((id) => B.tl.to(blk(id), { x: 6, duration: 0.08, yoyo: true, repeat: 5 }, tV2 + 0.2));

// ---------- cow-9: the militia "runs"; the dragoons chase into Washington ----------
const tRun = at("cow-9", "the militia turned");
const RALLY = [[-390, -10], [-390, 60], [-390, 130], [-450, 25], [-450, 95]];
dashArrow([U(0, 200), U(-50, 285), U(-170, 305), U(-300, 260), U(-400, 150)], { side: "carth", width: 10, t: tRun - 0.4, dur: 2.2, until: at("cow-9", "Tarleton's dragoons galloped") });
[4, 3, 2, 1, 0].forEach((i, k) => pathMove("mil" + i, tRun + k * 0.45, 7.2, [[-20, 205 + k * 6], [-80, 275], [-200, 290], [-330, 235], RALLY[i]]));
B.caption("IT LOOKED LIKE PANIC", at("cow-9", "To the British"), at("cow-9", "They raised a cheer") - 0.1, "rome");
const tRush = at("cow-9", "They raised a cheer");
B.bubble("HUZZAH!", ...U(170, 40), tRush - 0.2, tRush + 2.4).style.fontSize = "20px";
FRONT.concat(["g1", "g2"]).forEach((id, i) => mv(id, tRush + 0.3 + i * 0.1, 3.6, id[0] === "g" ? 60 : -20, B.units[id].b, "power1.in"));
mv("drL", tRush + 0.3, 3.6, -10, -250); mv("h71", tRush, 4, 280, -90); mv("lcav", tRush, 4, 330, 130);
[-110, 0, 110].forEach((b, i) => B.arrow({ side: "rome", pts: [U(75, b), U(-5, b)], width: 16, t: tRush + 0.2 + i * 0.15, dur: 1.0, until: T10 + 0.2 }));
const tDrag = at("cow-9", "Tarleton's dragoons galloped");
pathMove("drR", tDrag, 4.2, [[40, 270], [-50, 295], [-120, 285]]);
B.arrow({ side: "rome", pts: [U(140, 245), U(40, 280), U(-50, 302), U(-105, 290)], width: 14, t: tDrag, dur: 3.6, until: at("cow-9", "cut them to pieces") + 1 });
const tWash = at("cow-9", "straight into William Washington's cavalry");
B.show("cav", tWash - 0.8, 1);
pathMove("cav", tWash - 0.5, 3.4, [[-290, 170], [-220, 260], [-150, 282]]);
B.arrow({ side: "carth", pts: [U(-305, 90), U(-290, 180), U(-225, 262), U(-165, 282)], width: 16, t: tWash - 0.5, dur: 3.0, until: T10 + 0.5 });
const cavTag = pill("WASHINGTON'S CAVALRY", ...U(-260, 330), "carth", tWash, T10 + 1, { anchor: [-50, -50] });
clash(...U(-135, 286), at("cow-9", "cut them to pieces") - 0.8, 0.9);
B.grey(["drR"], at("cow-9", "cut them to pieces"), 0.8);
B.hideUnits(["drR"], at("cow-9", "cut them to pieces") + 1.8, 0.8);
mv("cav", at("cow-9", "cut them to pieces") + 1.5, 3, -250, 240);

// ---------- cow-10: the real fight; the 71st; the misunderstood order ----------
const tReach = T10 + 0.3;
FRONT.forEach((id, i) => mv(id, tReach + i * 0.1, 3, -62, B.units[id].b, "power1.out"));
mv("drL", tReach, 3, -40, -240);
const HOWF = A.how + 14, REDF = -62 - 14;
[0.6, 2.4, 4.4, 6.6].forEach((dt) => volley(along(HOWF, -120, 120, 9), tReach + 2.4 + dt, F, { spread: 0.5, scale: 0.9 }));
[1.4, 3.4, 5.6].forEach((dt) => volley(along(REDF, -130, 130, 9), tReach + 2.4 + dt, [-F[0], -F[1]], { spread: 0.5, scale: 0.9 }));
B.caption("THE REAL FIGHT BEGINS", at("cow-10", "the real fight began") - 0.6, at("cow-10", "Tarleton threw in") - 0.1);
const t71 = at("cow-10", "the Scottish Highlanders");
pathMove("h71", t71 - 0.6, 5.2, [[160, -250], [10, -275], [-95, -235]]);
B.arrow({ side: "rome", pts: [U(250, -120), U(160, -255), U(20, -285), U(-80, -250)], width: 18, t: t71 - 0.6, dur: 3.8, until: T11 + 1 });
pill("71ST HIGHLANDERS", ...U(-40, -300), "rome", t71 + 3.2, T11 + 3, { anchor: [0, -50] });
B.caption("RESERVE: AROUND THE AMERICAN RIGHT", t71 + 0.6, at("cow-10", "Howard ordered") - 0.1, "rome");
const tOrd = at("cow-10", "Howard ordered");
pulse([B.units.how0.el], tOrd, 2);
B.tl.to(blk("how0"), { rotation: ROT + 90, duration: 0.8, ease: "power2.inOut" }, tOrd + 1.2);
const bub1 = B.bubble("RIGHT COMPANY — FACE THE 71ST!", 1010, 990, tOrd + 0.4, at("cow-10", "But in the smoke") + 1);
bub1.style.fontSize = "17px";
B.caption("THE ORDER IS MISUNDERSTOOD", at("cow-10", "misunderstood") - 0.4, T11 - 0.1);
volley(along(HOWF + 8, -120, 120, 12), at("cow-10", "But in the smoke"), F, { spread: 1.2, scale: 1.1, smoke: 4 });
B.tl.to(blk("how0"), { rotation: ROT + 180, duration: 0.8, ease: "power2.inOut" }, at("cow-10", "The company turned") - 0.3);
const tBack = at("cow-10", "began to walk to the rear");
mv("how0", tBack - 1.2, 11, -270, -105, "power1.inOut");
[1, 2, 3].forEach((i) => {
  B.tl.to(blk("how" + i), { rotation: ROT + 180, duration: 0.8 }, tBack + 0.2 + i * 0.3);
  mv("how" + i, tBack + 0.4 + i * 0.3, 10.5, -270, HOW[i], "power1.inOut");
});
// Morgan moves back out of the way
moveStake(morgan, tBack - 1, 4, ...U(-350, 20));
// red follows slowly
FRONT.forEach((id, i) => mv(id, tBack + 1, 5, -110, B.units[id].b, "power1.inOut"));
mv("h71", tBack + 1, 5, -140, -230);

// ---------- cow-11: the British break ranks ----------
B.caption("A DISASTER?", T11 + 0.1, at("cow-11", "But the Continentals") - 0.1, "rome");
B.caption("WITHDRAWING IN GOOD ORDER", at("cow-11", "But the Continentals") + 0.3, at("cow-11", "broke ranks") - 0.2, "carth");
dashArrow([U(-145, -170), U(-230, -175)], { side: "white", width: 8, t: at("cow-11", "walking back") - 0.8, dur: 1.2, until: T12 });
dashArrow([U(-145, 150), U(-230, 150)], { side: "white", width: 8, t: at("cow-11", "walking back") - 0.6, dur: 1.2, until: T12 });
const tBreak = at("cow-11", "broke ranks");
const DIS = { lt: [-172, 120, 34], leg: [-180, -8, -28], f7: [-170, -118, 22], h71: [-160, -225, -40], drL: [-120, -290, 30] };
Object.entries(DIS).forEach(([id, [a, b, r]], i) => {
  mv(id, tBreak + i * 0.15, 3.6, a, b, "power2.out");
  B.tl.to(blk(id), { rotation: ROT + r, duration: 1.2 }, tBreak + i * 0.15);
});
const CROWD = [[-150, 70, 40], [-160, -60, -25], [-182, 55, 15], [-140, -150, 55], [-185, -70, -50], [-130, 170, 20], [-180, 175, -35], [-185, -150, 30], [-135, 20, -15], [-150, -210, 45]];
CROWD.forEach(([a, b, r], i) => {
  unit("cr" + i, "rome", "inf", a + 70, b, 26, 18, tBreak + 0.3 + i * 0.12, { rot: ROT + r });
  mv("cr" + i, tBreak + 0.4 + i * 0.12, 3.2, a, b, "power2.out");
});
B.caption("THE BRITISH BREAK RANKS", tBreak + 0.4, at("cow-11", "Morgan rode up") - 0.1, "rome");
const tMorg = at("cow-11", "Morgan rode up");
moveStake(morgan, tMorg, 2.2, ...U(-330, -60));
const bub2 = B.bubble("“FACE ABOUT, AND GIVE THEM ONE FIRE!”", 820, 800, at("cow-11", "when I give the word") - 0.4, T12 + 3);
bub2.style.fontSize = "19px";

// ---------- cow-12: about face, one fire, bayonets ----------
const tTurn = T12 + 0.1;
HOW.forEach((b, i) => B.tl.to(blk("how" + i), { rotation: ROT + 360, duration: 0.6, ease: "back.out(1.6)" }, tTurn + i * 0.12));
B.caption("ABOUT FACE!", tTurn, at("cow-12", "fired a volley") - 0.1, "carth");
const tFire = at("cow-12", "fired a volley");
volley(along(-270 + 16, -130, 130, 16), tFire, F, { spread: 0.12, scale: 1.35, smoke: 3.5 });
B.caption("ONE VOLLEY AT 30 YARDS", tFire + 0.2, at("cow-12", "Before the stunned") - 0.1, "carth");
const hitNow = ["leg", "lt", "f7", "cr0", "cr1", "cr2", "cr4", "cr6", "cr8"];
B.grey(hitNow, at("cow-12", "The effect") - 0.4, 0.6);
hitNow.slice(3).forEach((id) => B.tl.to(B.units[id].el, { autoAlpha: 0.3, scale: 0.8, duration: 0.8 }, at("cow-12", "The effect")));
const tBay = at("cow-12", "charged with the bayonet") - 0.8;
HOW.forEach((b, i) => { mv("how" + i, tBay + i * 0.08, 3.4, -185, b, "power2.in"); });
[-105, -35, 35, 105].forEach((b, i) => B.arrow({ side: "carth", pts: [U(-250, b), U(-140, b)], width: 18, t: tBay + i * 0.1, dur: 0.8, until: T13 + 3 }));
B.caption("BAYONETS!", tBay + 0.4, T13 - 0.1, "carth");
Object.entries(DIS).forEach(([id, [a, b]]) => { if (id !== "h71" && id !== "drL") mv(id, tBay + 0.6, 3.2, a + 55, b, "power1.out"); });
CROWD.forEach(([a, b], i) => mv("cr" + i, tBay + 0.6, 3.2, a + 55, b, "power1.out"));

// ---------- cow-13: the double envelopment ----------
B.caption("DOUBLE ENVELOPMENT", at("cow-13", "the trap closed") - 0.6, T14 - 0.2, "carth");
const tCav = at("cow-13", "Washington's cavalry swept");
pathMove("cav", tCav, 4.2, [[-130, 330], [0, 290], [30, 160], [-40, 95]], "sine.inOut");
B.arrow({ side: "carth", pts: [U(-250, 270), U(-130, 345), U(10, 300), U(45, 160), U(-20, 90)], width: 24, t: tCav - 0.2, dur: 3.2, until: T15 + 0.3 });
pill("WASHINGTON'S CAVALRY", ...U(95, 270), "carth", tCav + 1.4, T14 + 1, { anchor: [0, -50] });
const tMil = at("cow-13", "And the militia");
[0, 1, 2, 3, 4].forEach((i) => pathMove("mil" + i, tMil + i * 0.3, 5, [[-400, -130], [-300, -300], [-170, -340], [-100 + i * 12, -310 + i * 20]]));
B.arrow({ side: "carth", pts: [U(-420, -60), U(-360, -250), U(-230, -345), U(-120, -330), U(-70, -275)], width: 24, t: tMil - 0.2, dur: 3.6, until: T15 + 0.3 });
pill("PICKENS'S MILITIA — RALLIED", ...U(-470, -80), "carth", tMil + 1.8, T14 + 1, { anchor: [-50, -50] });
moveStake(morgan, tMil + 0.4, 3, ...U(-250, -260));
const bub3 = B.bubble("“FORM, FORM, MY BRAVE FELLOWS!”", 850, 815, at("cow-13", "Morgan rode among"), at("cow-13", "Attacked from the front") + 0.3);
bub3.style.fontSize = "21px";
const tDis = at("cow-13", "simply dissolved") - 1;
const ALLRED = ["lt", "leg", "f7", "h71", "drL", "g1", "g2", ...CROWD.map((_, i) => "cr" + i)];
B.grey(ALLRED.filter((id) => !hitNow.includes(id)), tDis, 1.0);
const ring = document.createElementNS(NS, "ellipse");
const RC = U(-120, -20);
Object.entries({ cx: RC[0], cy: RC[1], rx: 270, ry: 125, fill: "none", stroke: "var(--carth)", "stroke-width": 9, "stroke-dasharray": "26 14", transform: `rotate(${ROT} ${RC[0]} ${RC[1]})` }).forEach(([k, v]) => ring.setAttribute(k, v));
OV.appendChild(ring);
gsap.set(ring, { autoAlpha: 0, scale: 1.3, transformOrigin: "50% 50%" });
B.tl.to(ring, { autoAlpha: 0.9, scale: 1, duration: 1.6, ease: "power2.inOut" }, at("cow-13", "Attacked from the front"));
B.tl.to(ring, { autoAlpha: 0, duration: 0.8 }, T15);
ALLRED.forEach((id, i) => B.tl.to(B.units[id].el, { rotation: i % 2 ? 70 : -60, duration: 1.4, ease: "power2.out" }, at("cow-13", "Men threw down") + (i % 5) * 0.12));
B.label("SURRENDER", ...U(-40, -80), { cls: "tg", size: 30, t: at("cow-13", "Men threw down") + 0.3, until: T15 - 0.2, anchor: [-50, -50] });

// ---------- cow-14: Tarleton escapes; the butcher's bill ----------
const tOrd2 = T14 + 0.3;
mv("lcav", tOrd2, 2, 300, 130);
const bub4 = B.bubble("CHARGE!", TAR[0] - 30, TAR[1] - 190, tOrd2, at("cow-14", "but they refused") + 0.4);
bub4.style.fontSize = "22px";
pill("THEY REFUSE", ...U(300, 205), "rome", at("cow-14", "but they refused"), at("cow-14", "He escaped") + 1.5);
const tEsc = at("cow-14", "He escaped");
B.arrow({ side: "rome", pts: [U(330, 130), [2140, 1060], [2400, 1100], [2660, 1180], [2880, 1262]], width: 20, t: tEsc, dur: 3, until: T15 });
mv("lcav", tEsc + 0.2, 4.5, UI(2960, 1290)[0], UI(2960, 1290)[1], "power1.in");
moveStake(tarleton, tEsc + 0.4, 5, 3000, 1330, "power1.in");
pill("TARLETON ESCAPES", 2380, 1040, "rome", tEsc + 1.0, T15, { anchor: [-50, -50] });
const stat = B.stat(["BRITISH: ~110 KILLED", "800+ CAPTURED (200+ WOUNDED)", "AMERICANS: ~25 KILLED", "UNDER 1 HOUR"], at("cow-14", "Behind him") - 0.2, T15 - 0.3, "carth");
const statRows = stat.querySelectorAll(".row");
[at("cow-14", "a hundred and ten"), at("cow-14", "more than eight hundred"), at("cow-14", "The Americans lost"), at("cow-14", "The whole battle")]
  .forEach((t, i) => B.tl.fromTo(statRows[i], { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: true }, t - 0.2));

// ---------- cow-15: the method ----------
const rowT = [at("cow-15", "Strike the officers"), at("cow-15", "Bait the enemy"), at("cow-15", "Spring the trap")];
B.method(T15 + 0.2, END - 0.2, { rowT });
pulse([0, 1, 2, 3, 4].map((i) => B.units["mil" + i].el), rowT[1] + 0.3, 2);
pulse(["how0", "how1", "how2", "how3", "cav", "mil0", "mil2", "mil4"].map((k) => B.units[k].el), rowT[2] + 0.3, 2);
B.finish();
