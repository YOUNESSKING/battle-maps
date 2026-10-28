// Nashville, Dec 8-28 1864: ice storm and the relief order; Hood's belief; Dec 15 feint + great wheel;
// the redoubts fall; Dec 16 Peach Orchard Hill repulse, Wilson behind Shy's Hill, Shy's Hill stormed;
// rout, pursuit to the Tennessee River; stats; method card.
// Basemap: nash.json (zoom 14, origin_world_px [1084418, 1644575]).
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const NS = "http://www.w3.org/2000/svg";
const OV = document.getElementById("overlay");
const PINS = document.getElementById("pins");
const WORLD = document.getElementById("world");
const SCENE = document.getElementById("scene");

// =====================================================================================
// ===== GEOGRAPHY (nash basemap, z14) — shared block, copy as-is into other Nashville scenes =====
// Checked against the relief and Nominatim (Capitol, Fort Negley, Shy's Hill, Overton Hill, pikes).
const G = (lat, lon) => {
  const n = 256 * 2 ** 14, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 1084418).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 1644575).toFixed(1)];
};
const GL = (a) => a.map(([la, lo]) => G(la, lo));
// Cumberland River (pixel centreline traced on the relief; three pieces, it loops north off the map)
const RIVER_W = [[405, -30], [406, 150], [396, 280], [366, 390], [312, 455], [230, 488], [120, 492], [-30, 468]];
const RIVER_N = [[785, -30], [840, 35], [930, 58], [1000, 22], [1012, -30]];
const RIVER_E = [[1722, -30], [1745, 90], [1790, 150], [1880, 178], [1990, 170], [2120, 145], [2260, 115], [2410, 82], [2520, 42], [2575, -30]];
const CITY = G(36.1658, -86.7842);            // Tennessee State Capitol / downtown
const FORT_NEGLEY = G(36.1450, -86.7745);
// Union fortified line (Dec 1-14), river west of town -> Fort Negley -> river east of town
const UNION_LINE = GL([[36.172, -86.834], [36.160, -86.826], [36.150, -86.812], [36.142, -86.795], [36.1445, -86.7745], [36.143, -86.760], [36.150, -86.748], [36.159, -86.743]]);
// Hood's Dec 15 main line: railroad (right, Granbury's lunette) west via Montgomery Hill to the Hillsboro Pike, then south along the pike
const HOOD_LINE_15 = GL([[36.132, -86.752], [36.127, -86.765], [36.124, -86.782], [36.121, -86.795], [36.119, -86.803], [36.116, -86.810], [36.106, -86.8135], [36.097, -86.822]]);
const HOOD_CAV_SCREEN = GL([[36.132, -86.752], [36.142, -86.743], [36.158, -86.735]]); // cavalry screen from the right to the river
const REDOUBTS = GL([[36.115, -86.82], [36.112, -86.825], [36.108, -86.83], [36.104, -86.835], [36.10, -86.84]]); // Redoubts 1-5, west of the Hillsboro Pike
const MONTGOMERY_HILL = G(36.119, -86.803);
// Hood's Dec 16 line: Peach Orchard (Overton) Hill -> Franklin Pike -> Granny White Pike -> Shy's Hill, left refused south (same point count as HOOD_LINE_15)
const HOOD_LINE_16 = GL([[36.077, -86.760], [36.080, -86.768], [36.083, -86.777], [36.085, -86.788], [36.087, -86.799], [36.0883, -86.809], [36.083, -86.812], [36.075, -86.809]]);
const PEACH_ORCHARD = G(36.080, -86.768);
const SHYS_HILL = G(36.0883, -86.809);
const FRANKLIN_PIKE = GL([[36.160, -86.779], [36.140, -86.780], [36.124, -86.782], [36.105, -86.778], [36.085, -86.775], [36.065, -86.782], [36.045, -86.789]]);
const GRANNY_WHITE_PIKE = GL([[36.145, -86.790], [36.1066, -86.7948], [36.0956, -86.8013], [36.080, -86.806], [36.060, -86.813], [36.045, -86.817]]);
const HILLSBORO_PIKE = GL([[36.150, -86.797], [36.120, -86.806], [36.1066, -86.8134], [36.0974, -86.8236], [36.080, -86.830], [36.045, -86.842]]);
const RAILROAD = GL([[36.158, -86.778], [36.150, -86.770], [36.132, -86.752], [36.110, -86.728], [36.090, -86.705]]); // Nashville & Chattanooga RR
// ===== end GEOGRAPHY =====
// =====================================================================================

const HAS = { thomas_head: true, hood_head: true, grant_head: true, steedman_head: true, wilson_head: true, wood_head: true, schofield_head: true, us_flag_35star: true, csa_battle_flag: true };

// ---------- styles for local elements ----------
const st = document.createElement("style");
st.textContent = `
.tele { position:absolute; right:110px; top:120px; width:640px; padding:26px 34px 30px; background:linear-gradient(180deg,#f4ead0,#e6d6ae);
  box-shadow:0 18px 34px rgba(0,0,0,0.55); font-family:"Special Elite",monospace; color:#2a241b; border:2px solid #b89d68; }
.tele .hd { font-size:24px; letter-spacing:0.18em; border-bottom:3px double #6b5530; padding-bottom:8px; margin-bottom:14px; }
.tele .ln { font-size:25px; line-height:1.45; }
.tele .big { font-size:38px; line-height:1.2; margin:12px 0; font-weight:700; }
.tele .stamp { position:absolute; left:140px; top:112px; padding:6px 22px; border:7px solid #c4121f; color:#c4121f; font-family:"Oswald",sans-serif;
  font-weight:700; font-size:66px; letter-spacing:0.12em; rotate:-14deg; background:rgba(244,234,208,0.35); mix-blend-mode:multiply; }
.inset { position:absolute; left:1120px; top:36px; width:720px; height:640px; background:#eadfbf; border:4px solid #3a3020;
  box-shadow:0 18px 40px rgba(0,0,0,0.6); overflow:hidden; }
.inset svg { position:absolute; inset:0; }
.inset .ttl { position:absolute; left:0; right:0; top:0; padding:8px 0; text-align:center; background:rgba(24,20,14,0.88); color:#f7f3ea;
  font-weight:700; font-size:28px; letter-spacing:0.14em; }
`;
document.head.appendChild(st);

// ---------- local helpers (copied from morgan/scenes-src, adapted) ----------
const svgG = (html, before) => {
  const g = document.createElementNS(NS, "g"); g.innerHTML = html;
  if (before) OV.insertBefore(g, OV.firstChild); else OV.appendChild(g);
  return g;
};
const U = (o) => { // unit block with a readable tag
  const el = B.unit({ w: 62, h: 34, ...o });
  const tg = el.querySelector(".tag");
  if (tg) Object.assign(tg.style, { fontSize: (o.fs || 20) + "px", padding: "0 7px", marginTop: "3px", letterSpacing: "0.05em", border: "2px solid #f7f3ea" });
  el.querySelector(".blk").style.borderWidth = "2.5px";
  return el;
};
const mv = (id, t, dur, p, ease) => B.move(id, t, dur, p[0], p[1], ease);
const pill = (text, x, y, side, t, until, o = {}) => {
  const el = B.label(text, x, y, { size: o.size || 22, t, until, anchor: o.anchor || [-50, -50] });
  Object.assign(el.style, {
    background: side === "rome" ? "var(--rome)" : side === "carth" ? "var(--carth)" : "rgba(24,20,14,0.86)",
    color: "#fbfaf6", padding: "2px 11px 3px", borderRadius: "3px", textShadow: "none", letterSpacing: "0.07em",
    border: "2px solid #f7f3ea", boxShadow: "0 3px 6px rgba(0,0,0,0.35)",
  });
  return el;
};
const stake = (o) => { // portrait stake (all needed portraits exist except Logan -> plaque)
  const key = o.img;
  if (HAS[key]) {
    const flag = o.side === "rome" ? "assets/media/csa_battle_flag.png" : "assets/media/us_flag_35star.png";
    const el = B.portraitStake({ img: `assets/media/${key}.png`, flag, name: o.name, x: o.x, y: o.y, size: o.size || 0.7, t: o.t, until: o.until });
    el.querySelector(".nm").style.fontSize = (o.fs || 21) + "px";
    if (o.side === "rome") {
      el.querySelector(".face").style.boxShadow = "0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5)";
      el.querySelector(".nm").style.background = "#c4121f";
    }
    el._foot = [o.x, o.y]; el._l0 = parseFloat(el.style.left); el._t0 = parseFloat(el.style.top);
    return el;
  }
  const el = B.plaque({ name: o.name, role: o.role, side: o.side, x: o.x, y: o.y + 60, t: o.t, until: o.until });
  gsap.set(el, { scale: o.scale || 0.7, transformOrigin: "19px 240px" });
  el._foot = [o.x, o.y]; el._l0 = parseFloat(el.style.left); el._t0 = parseFloat(el.style.top);
  return el;
};
const moveStake = (el, t, dur, x, y, ease = "power2.inOut") =>
  tl.to(el, { left: el._l0 + x - el._foot[0], top: el._t0 + y - el._foot[1], duration: dur, ease }, t);
const R = (() => { let s = 1864; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
const volley = (pts, t, dir, o = {}) => {
  const ang = Math.atan2(dir[1], dir[0]) * 180 / Math.PI, sc = o.scale || 1.2;
  pts.forEach(([x, y]) => {
    const dt = R() * (o.spread != null ? o.spread : 0.3);
    const g = svgG(`<g transform="translate(${x} ${y}) rotate(${ang.toFixed(1)})"><circle class="sm" cx="${10 * sc}" cy="0" r="${6 * sc}" fill="rgba(246,244,238,0.9)"/>
      <polygon class="fl" points="0,${-6 * sc} ${16 * sc},${-9 * sc} ${22 * sc},${-3 * sc} ${36 * sc},0 ${22 * sc},${3 * sc} ${16 * sc},${9 * sc} 0,${6 * sc}" fill="#ffcf3a" stroke="#fff4c2" stroke-width="2"/></g>`);
    const fl = g.querySelector(".fl"), sm = g.querySelector(".sm");
    gsap.set(fl, { autoAlpha: 0, scale: 0.3, transformOrigin: "0% 50%" }); gsap.set(sm, { autoAlpha: 0 });
    tl.to(fl, { autoAlpha: 1, scale: 1, duration: 0.07 }, t + dt);
    tl.to(fl, { autoAlpha: 0, scale: 0.7, duration: 0.25 }, t + dt + 0.12);
    tl.fromTo(sm, { autoAlpha: 0.95, attr: { r: 6 * sc, cx: 10 * sc } }, { autoAlpha: 0, attr: { r: 26 * sc, cx: 34 * sc }, duration: 2.4, ease: "power1.out", immediateRender: false }, t + dt + 0.05);
  });
};
const clash = (x, y, t, s = 1, hold = 2.0) => { // starburst
  const pts = Array.from({ length: 16 }, (_, i) => { const r = (i % 2 ? 14 : 38) * s, a = i * Math.PI / 8; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(" ");
  const g = svgG(`<g transform="translate(${x} ${y})"><polygon points="${pts}" fill="#fff6d0" stroke="#c4121f" stroke-width="4" stroke-linejoin="round"/></g>`);
  const p = g.querySelector("polygon");
  gsap.set(p, { autoAlpha: 0, scale: 0.2, transformOrigin: "50% 50%" });
  tl.to(p, { autoAlpha: 1, scale: 1.1, duration: 0.25, ease: "back.out(3)" }, t);
  tl.to(p, { scale: 0.8, rotation: 30, duration: 0.4, yoyo: true, repeat: 3 }, t + 0.25);
  tl.to(p, { autoAlpha: 0, duration: 0.5 }, t + hold);
};
const crossOut = (x, y, t, until, r = 18) => {
  const g = svgG(`<path d="M ${x - r} ${y - r} L ${x + r} ${y + r} M ${x + r} ${y - r} L ${x - r} ${y + r}" stroke="rgba(0,0,0,0.6)" stroke-width="11" stroke-linecap="round"/>
    <path d="M ${x - r} ${y - r} L ${x + r} ${y + r} M ${x + r} ${y - r} L ${x - r} ${y + r}" stroke="#e3232f" stroke-width="6" stroke-linecap="round"/>`);
  tl.fromTo(g, { autoAlpha: 0, scale: 1.8, svgOrigin: `${x} ${y}` }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, t);
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.4 }, until);
  return g;
};
const fire = (x1, y1, x2, y2, t, n = 1, gap = 0.9, w = 3.5) => { // artillery streak + shell burst
  const g = svgG(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(0,0,0,0.35)" stroke-width="${w + 3}" stroke-linecap="round"/>
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff1b0" stroke-width="${w}" stroke-linecap="round"/>
    <circle cx="${x1}" cy="${y1}" r="${w * 3}" fill="#ffd34d" stroke="#fff6d8" stroke-width="2"/>`);
  const burst = svgG(`<circle cx="${x2}" cy="${y2}" r="10" fill="rgba(250,240,220,0.9)" stroke="#ffb020" stroke-width="4"/>`);
  const c = burst.querySelector("circle");
  gsap.set([g, burst], { autoAlpha: 0 });
  for (let i = 0; i < n; i++) {
    const tt = t + i * gap;
    tl.fromTo(g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, tt);
    tl.to(g, { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, tt + 0.16);
    tl.fromTo(burst, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.9, ease: "power1.in", immediateRender: false }, tt + 0.18);
    tl.fromTo(c, { attr: { r: 8 } }, { attr: { r: 30 }, duration: 0.9, ease: "power2.out", immediateRender: false }, tt + 0.18);
  }
};
const ring = (x, y, t, n = 3, r = 60, color = "#fff3c4") => { // expanding glow rings
  for (let i = 0; i < n; i++) {
    const g = svgG(`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${color}" stroke-width="6"/>`);
    const c = g.firstChild; gsap.set(g, { autoAlpha: 0 });
    tl.fromTo(g, { autoAlpha: 0.95 }, { autoAlpha: 0, duration: 1.4, ease: "power1.in", immediateRender: false }, t + i * 0.6);
    tl.fromTo(c, { attr: { r: r * 0.3 } }, { attr: { r }, duration: 1.4, ease: "power2.out", immediateRender: false }, t + i * 0.6);
  }
};
const measure = (p0, p1, text, t, until) => {
  const dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy), nx = -dy / l * 14, ny = dx / l * 14;
  const ln = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
  const body = `${ln(p0, p1)}${ln([p0[0] - nx, p0[1] - ny], [p0[0] + nx, p0[1] + ny])}${ln([p1[0] - nx, p1[1] - ny], [p1[0] + nx, p1[1] + ny])}`;
  const g = svgG(`<g stroke="rgba(20,16,10,0.6)" stroke-width="9" stroke-linecap="round">${body}</g><g stroke="#fbfaf6" stroke-width="4.5" stroke-linecap="round">${body}</g>`);
  gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 1, duration: 0.4 }, t); tl.to(g, { autoAlpha: 0, duration: 0.4 }, until);
  pill(text, (p0[0] + p1[0]) / 2 + 26, (p0[1] + p1[1]) / 2, "", t + 0.2, until, { size: 24, anchor: [0, -50] });
};
const road = (pts) => svgG(`<path d="${"M " + pts.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="rgba(96,70,38,0.5)" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${"M " + pts.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#efe3c2" stroke-width="5" stroke-dasharray="16 10" stroke-linejoin="round"/>`, true);
const redoubt = (x, y, n, t) => { // small star fort with its number
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - 26}px;top:${y - 26}px;width:52px;height:52px;`;
  el.innerHTML = `<svg viewBox="-26 -26 52 52" width="52" height="52" style="overflow:visible"><polygon class="rf" points="-15,-15 -5,-15 0,-24 5,-15 15,-15 15,-5 24,0 15,5 15,15 5,15 0,24 -5,15 -15,15 -15,5 -24,0 -15,-5"
    fill="#c4121f" stroke="#f7f3ea" stroke-width="3.5" stroke-linejoin="round"/><text x="0" y="8" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="22" fill="#fff">${n}</text></svg>`;
  PINS.appendChild(el);
  gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: 1.8 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, t);
  return el;
};
const greyRedoubt = (el, t) => { tl.to(el.querySelector(".rf"), { attr: { fill: "#77746c" }, duration: 0.5 }, t); tl.to(el, { opacity: 0.75, duration: 0.5 }, t); };
const pulseUnit = (id, t, n = 2) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: 1.35, duration: 0.3, yoyo: true, repeat: n * 2 - 1, ease: "sine.inOut", immediateRender: false }, t);
const screenDiv = (html, cls) => { const el = document.createElement("div"); el.className = cls; el.innerHTML = html; SCENE.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const rain = (t, until) => { // deterministic diagonal rain streaks
  const layer = document.createElement("div"); layer.className = "fx-layer";
  const tall = document.createElement("div"); tall.style.cssText = "position:absolute;left:0;top:0;width:2100px;height:2160px;";
  for (let i = 0; i < 300; i++) {
    const x = R() * 2100, y = R() * 1080, h = 22 + R() * 26, o = 0.25 + R() * 0.35;
    for (const dy of [0, 1080]) {
      const f = document.createElement("div");
      f.style.cssText = `position:absolute;left:${x.toFixed(0)}px;top:${(y + dy).toFixed(0)}px;width:2px;height:${h.toFixed(0)}px;background:rgba(225,235,245,${o.toFixed(2)});rotate:14deg;`;
      tall.appendChild(f);
    }
  }
  layer.appendChild(tall); document.getElementById("fx").appendChild(layer);
  gsap.set(layer, { autoAlpha: 0 });
  const period = 1.2, reps = Math.max(Math.ceil((until - t) / period) - 1, 0);
  tl.to(layer, { autoAlpha: 1, duration: 0.8 }, t);
  tl.fromTo(tall, { y: -1080, x: 0 }, { y: 0, x: -260, duration: period, ease: "none", repeat: reps }, t);
  tl.to(layer, { autoAlpha: 0, duration: 0.8 }, until);
};

// ---------- times ----------
const N4 = P("nash-4"), N5 = P("nash-5"), N6 = P("nash-6"), N7 = P("nash-7"), N8 = P("nash-8"), N9 = P("nash-9"), N10 = P("nash-10"), N11 = P("nash-11");
const T_SUSP = at("nash-4", "suspended"), T_AGAIN = at("nash-4", "prepared again"), T_LOGAN = at("nash-4", "John Logan"), T_GRANT = at("nash-4", "he was about to set out");
const T_DAYS = at("nash-4", "Thomas had perhaps"), T_MELT = at("nash-4", "the ice began to melt");
const T_STUDENT = at("nash-5", "He had been Thomas's student"), T_TROT = at("nash-5", "Slow Trot"), T_WALLS = at("nash-5", "stay behind his walls");
const T_THIN = at("nash-5", "His line was long"), T_FIVE = at("nash-5", "five small");
const T_SAW = at("nash-6", "But Thomas saw"), T_EVERY = at("nash-6", "He did not need"), T_FOG = at("nash-6", "On the foggy morning"), T_FEINT = at("nash-6", "he opened with a feint");
const T_STEED = at("nash-6", "led by Steedman"), T_USCT = at("nash-6", "United States Colored Troops"), T_EAST = at("nash-6", "As Hood looked east");
const T_BLOW = at("nash-6", "main blow fell"), T_WHEEL = at("nash-6", "a huge wheeling movement"), T_DOOR = at("nash-6", "like a door");
const T_STORM = at("nash-7", "One by one"), T_CAVED = at("nash-7", "The Confederate left caved in"), T_BACK = at("nash-7", "driven back about two miles");
const T_PEACH = at("nash-7", "Peach Orchard Hill"), T_SHY = at("nash-7", "Shy's Hill");
const T_16 = at("nash-8", "On the sixteenth"), T_ATTACK = at("nash-8", "An attack on Peach Orchard"), T_PINNED = at("nash-8", "but it pinned");
const T_WILSON = at("nash-8", "Meanwhile, on the left"), T_REAR = at("nash-8", "into the rear"), T_ARTY = at("nash-8", "while Union artillery");
const T_4PM = at("nash-9", "At about four"), T_STORMED = at("nash-9", "stormed Shy's Hill"), T_BEHIND = at("nash-9", "while the cavalry fired");
const T_FELL = at("nash-9", "The hill fell"), T_UNRAVEL = at("nash-9", "unravelled from left to right"), T_FLED = at("nash-9", "Hood's army broke");
const T_PURSUIT = at("nash-10", "The pursuit lasted"), T_USLOST = at("nash-10", "The Union lost"), T_CSLOST = at("nash-10", "The Confederates lost");
const T_PRIS = at("nash-10", "well over four thousand"), T_GUNS = at("nash-10", "dozens of cannon"), T_RESIGN = at("nash-10", "Hood resigned");
const T_ARMY = at("nash-10", "The army that had fought"), T_COMPLETE = at("nash-10", "It was one of the most");
const T_METHOD = at("nash-11", "This was Thomas's method"), T_HURRY = at("nash-11", "He refused to be hurried"), T_HELD = at("nash-11", "He held the ground");
const T_NASHV = at("nash-11", "Nashville, the great"), T_STRUCK = at("nash-11", "And when he finally struck"), T_DESTROY = at("nash-11", "He struck to destroy");

// ---------- camera ----------
const HOODSTAKE = G(36.100, -86.779);
B.camera([
  [0, 1700, 330, 1.35],
  [T_LOGAN - 0.5, 1760, 360, 1.3],
  [T_GRANT, 1980, 380, 1.28],
  [T_DAYS, 1820, 420, 1.25],
  [T_MELT, 1720, 520, 1.1],
  [N5 - 0.2, 1500, 720, 0.92],
  [T_STUDENT, HOODSTAKE[0] - 40, HOODSTAKE[1] - 60, 1.4],
  [T_TROT + 1, HOODSTAKE[0] - 60, HOODSTAKE[1] - 70, 1.45],
  [T_WALLS + 1.5, 1650, 420, 1.3],
  [T_THIN - 0.2, 1700, 470, 1.3],
  [T_THIN + 2.5, 1900, 600, 1.55],
  [T_FIVE, 1450, 740, 1.5],
  [N6 - 0.3, 1120, 900, 1.65],
  [T_EVERY, 1480, 650, 0.95],
  [T_FOG + 1, 1500, 600, 1.0],
  [T_STEED + 0.3, 1950, 470, 1.45],
  [T_EAST, 2000, 500, 1.45],
  [T_BLOW + 1.2, 1150, 700, 1.05],
  [N7 - 0.4, 1180, 760, 1.12],
  [T_STORM + 1.2, 1100, 900, 1.6],
  [T_CAVED + 1.5, 1160, 880, 1.55],
  [T_BACK + 2.5, 1450, 950, 1.0],
  [N8 - 0.3, 1500, 1150, 1.15],
  [T_ATTACK + 0.2, 1760, 1220, 1.55],
  [T_WILSON + 0.4, 1720, 1200, 1.5],
  [T_WILSON + 3.5, 1260, 1180, 1.4],
  [N9 - 0.2, 1300, 1170, 1.45],
  [T_STORMED, 1320, 1150, 1.75],
  [T_FELL + 1.2, 1320, 1160, 1.7],
  [T_UNRAVEL + 1.5, 1520, 1180, 1.2],
  [T_FLED + 3.5, 1520, 1250, 0.95],
  [N10, 1500, 1200, 0.92],
  [T_ARMY, 1450, 1000, 0.85],
  [N11 + 1, 1450, 820, 0.8],
  [END, 1450, 800, 0.72],
]);

// ---------- static geography ----------
[RIVER_W, RIVER_N, RIVER_E].forEach((r) => B.river(r, 30));
B.label("CUMBERLAND RIVER", 2150, 180, { cls: "river", size: 26, rot: -12, instant: true, anchor: [-50, -50] });
B.label("CUMBERLAND R.", 280, 530, { cls: "river", size: 24, rot: 2, instant: true, anchor: [-50, -50] });
[FRANKLIN_PIKE, GRANNY_WHITE_PIKE, HILLSBORO_PIKE].forEach((r) => road(r));
svgG(`<path d="M ${RAILROAD.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#2a241b" stroke-width="5"/>
  <path d="M ${RAILROAD.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#efe3c2" stroke-width="10" stroke-dasharray="3 14" opacity="0.9"/>`, true);
const rl = (text, p, rot, size = 20) => B.label(text, p[0], p[1], { size, rot, instant: true, anchor: [-50, -50] });
rl("FRANKLIN PIKE", G(36.100, -86.7735), 84);
rl("GRANNY WHITE PIKE", G(36.1015, -86.7995), 104);
rl("HILLSBORO PIKE", G(36.112, -86.8145), 112);
rl("N&C RAILROAD", G(36.117, -86.7295), 47);
B.city("NASHVILLE", ...CITY, { size: 30, r: 9, t: 0.2 });
B.label("FORT NEGLEY", FORT_NEGLEY[0] + 20, FORT_NEGLEY[1] + 28, { cls: "tg", size: 20, t: 0.4, until: N5, anchor: [0, -50] });
svgG(`<path d="M ${UNION_LINE.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#f7f3ea" stroke-width="15" stroke-linejoin="round" opacity="0.7"/>
  <path d="M ${UNION_LINE.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="var(--carth)" stroke-width="9" stroke-dasharray="24 12" stroke-linejoin="round"/>`);

// Hood's line (Dec 15) morphs into the Dec 16 line when he is driven back
const hoodLine = B.front({ pts: HOOD_LINE_15, to: HOOD_LINE_16, color: "var(--rome)", width: 10, t: 0.3, dur: 1.2, moveT: T_BACK - 0.3, moveDur: 5 });
const cavScreen = svgG(`<path d="M ${HOOD_CAV_SCREEN.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="var(--rome)" stroke-width="6" stroke-dasharray="12 10" opacity="0.85"/>`);
gsap.set(cavScreen, { autoAlpha: 0 }); tl.to(cavScreen, { autoAlpha: 1, duration: 0.6 }, 0.8); tl.to(cavScreen, { autoAlpha: 0, duration: 0.8 }, T_CAVED);
const RD = REDOUBTS.map((p, i) => redoubt(p[0], p[1], i + 1, 0.6 + i * 0.1));

// ---------- units ----------
const PS = {
  smith0: G(36.1635, -86.8165), wood0: G(36.1515, -86.7985), schof0: G(36.1545, -86.7815), steed0: G(36.1535, -86.7585), wil0: G(36.1685, -86.8255),
  cheat0: G(36.1345, -86.761), lee0: G(36.1275, -86.785), stew0: G(36.119, -86.8165),
};
U({ id: "smith", side: "carth", label: "SMITH · XVI", ...{ x: PS.smith0[0], y: PS.smith0[1] }, t: 0.5 });
U({ id: "wood", side: "carth", label: "WOOD · IV", x: PS.wood0[0], y: PS.wood0[1], t: 0.6 });
U({ id: "schof", side: "carth", label: "SCHOFIELD · XXIII", x: PS.schof0[0], y: PS.schof0[1], t: 0.7 });
U({ id: "steed", side: "carth", label: "STEEDMAN", x: PS.steed0[0], y: PS.steed0[1], t: 0.8 });
U({ id: "wil", side: "carth", kind: "cav", label: "WILSON · CAV.", x: PS.wil0[0], y: PS.wil0[1], t: 0.9 });
U({ id: "cheat", side: "rome", label: "CHEATHAM", x: PS.cheat0[0], y: PS.cheat0[1], t: 0.7 });
U({ id: "lee", side: "rome", label: "S.D. LEE", x: PS.lee0[0], y: PS.lee0[1], t: 0.8 });
U({ id: "stew", side: "rome", label: "STEWART", x: PS.stew0[0], y: PS.stew0[1], t: 0.9 });

// =====================================================================================
// nash-4: ice storm, the relief order, Logan sent; the ice melts
// =====================================================================================
B.showDate(0.1);
B.date("DEC 8–14, 1864", 0.2, T_MELT);
B.date("DEC 14, 1864", T_MELT + 0.1, T_FOG);
const ice = document.createElement("div");
ice.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;background:linear-gradient(160deg,rgba(226,240,250,0.4),rgba(200,222,240,0.3));mix-blend-mode:screen;pointer-events:none;";
WORLD.insertBefore(ice, OV);
tl.to(ice, { autoAlpha: 0, duration: 3.5, ease: "sine.inOut" }, T_MELT + 0.2);
B.snow(0, T_MELT + 1.2);
B.caption("ICE STORM · DEC 8–14", 0.3, T_LOGAN - 0.4, "carth");

const sThomas = stake({ img: "thomas_head", name: "THOMAS", side: "carth", x: CITY[0] - 70, y: CITY[1] + 150, t: 0.4 });
const tele = screenDiv(`<div class="hd">U.S. MILITARY TELEGRAPH</div><div class="ln">TO: MAJ. GEN. G. H. THOMAS</div>
  <div class="big">RELIEVED OF COMMAND</div><div class="ln">— GRANT, DEC. 9, 1864</div><div class="stamp">SUSPENDED</div>`, "tele");
const stamp = tele.querySelector(".stamp");
gsap.set(stamp, { autoAlpha: 0 });
tl.fromTo(tele, { autoAlpha: 0, y: -40, rotation: -3 }, { autoAlpha: 1, y: 0, rotation: 1.5, duration: 0.5, ease: "power3.out" }, 0.05);
tl.fromTo(stamp, { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 0.92, scale: 1, duration: 0.22, ease: "power4.in" }, T_SUSP + 0.1);
tl.to(tele, { x: 6, duration: 0.05, yoyo: true, repeat: 3 }, T_SUSP + 0.32);
tl.to(stamp, { autoAlpha: 0, duration: 0.4 }, T_AGAIN + 0.1);
tl.to(tele, { rotation: -1, x: -6, duration: 0.08, yoyo: true, repeat: 3 }, T_AGAIN + 0.2);
tl.to(tele, { autoAlpha: 0, x: 260, duration: 0.6, ease: "power2.in" }, T_LOGAN - 0.6);

const sLogan = stake({ img: "logan_head", name: "LOGAN", role: "SENT TO REPLACE THOMAS", side: "carth", x: 2800, y: 560, t: T_LOGAN - 0.3, scale: 0.92 });
moveStake(sLogan, T_LOGAN + 0.4, 6.5, 2250, 600, "power1.inOut");
const sGrant = stake({ img: "grant_head", name: "GRANT", side: "carth", x: 2400, y: 300, t: T_GRANT, size: 0.72 });
pill("ABOUT TO COME HIMSELF", 2400, 330, "", T_GRANT + 0.6, T_MELT, { size: 22 });
tl.to([sLogan, sGrant], { autoAlpha: 0, duration: 0.6 }, T_MELT + 1.5);
B.caption("GRANT SENDS LOGAN TO TAKE OVER", T_LOGAN, T_DAYS - 0.1, "carth");
B.caption("THOMAS HAS A DAY OR TWO LEFT", T_DAYS, T_MELT - 0.1, "rome");
B.caption("DEC 14: THE ICE MELTS", T_MELT + 0.2, N5 - 0.1, "carth");

// =====================================================================================
// nash-5: Hood's belief — "Thomas is slow"; the thin line and its five isolated redoubts
// =====================================================================================
const sHood = stake({ img: "hood_head", name: "HOOD", side: "rome", x: HOODSTAKE[0], y: HOODSTAKE[1], t: N5 + 0.1 });
B.caption("HOOD: “THOMAS IS SLOW. HE WILL NOT ATTACK IN WINTER.”", N5 + 0.4, T_WALLS - 0.2, "rome");
pill("WEST POINT: CADET HOOD, INSTRUCTOR THOMAS", HOODSTAKE[0], HOODSTAKE[1] + 36, "", T_STUDENT + 0.3, T_WALLS - 0.3, { size: 21 });
const bTrot = B.bubble("“OLD SLOW TROT”", HOODSTAKE[0] - 110, HOODSTAKE[1] - 330, T_TROT, T_WALLS - 0.3);
bTrot.style.fontSize = "30px";
// "stay behind his walls": the Union line pulses
const walls = svgG(`<path d="M ${UNION_LINE.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#fff3c4" stroke-width="30" stroke-linejoin="round" stroke-linecap="round"/>`, false);
gsap.set(walls, { autoAlpha: 0 });
tl.to(walls, { autoAlpha: 0.7, duration: 0.5, yoyo: true, repeat: 3 }, T_WALLS);
pill("BEHIND HIS WALLS?", 1600, 190, "rome", T_WALLS + 0.4, T_THIN - 0.1, { size: 24 });
B.caption("TIME ON THE CONFEDERATE SIDE?", T_WALLS + 0.3, T_THIN - 0.2, "rome");
// the long thin line: highlight travelling east -> west, then the five redoubts
const thin = svgG(`<path d="M ${HOOD_LINE_15.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#fff3c4" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>`, false);
const thinP = thin.firstChild; const thinLen = thinP.getTotalLength();
gsap.set(thin, { autoAlpha: 0 }); gsap.set(thinP, { strokeDasharray: `${thinLen} ${thinLen}`, strokeDashoffset: thinLen });
tl.to(thin, { autoAlpha: 0.6, duration: 0.3 }, T_THIN);
tl.to(thinP, { strokeDashoffset: 0, duration: 4, ease: "sine.inOut" }, T_THIN);
tl.to(thin, { autoAlpha: 0, duration: 0.8 }, N6);
pill("LONG, THINLY HELD", G(36.128, -86.772)[0], G(36.128, -86.772)[1] + 70, "rome", T_THIN + 0.5, N6 - 0.2, { size: 24 });
RD.forEach((el, i) => tl.fromTo(el, { scale: 1 }, { scale: 1.5, duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, T_FIVE + 0.3 + i * 0.35));
REDOUBTS.forEach((p, i) => ring(p[0], p[1], T_FIVE + 0.3 + i * 0.35, 1, 55));
B.label("5 ISOLATED REDOUBTS", REDOUBTS[2][0] - 150, REDOUBTS[2][1] + 30, { cls: "tg", size: 26, t: T_FIVE + 0.8, until: T_EVERY, anchor: [-50, -50] });
B.caption("HIS LEFT: FIVE SMALL, ISOLATED REDOUBTS", T_THIN + 0.2, N6 - 0.1, "rome");

// =====================================================================================
// nash-6: Dec 15 — Steedman's feint on the right, then the great wheel on the left
// =====================================================================================
B.caption("THOMAS SEES A WEAK FLANK", T_SAW + 0.1, T_EVERY - 0.1, "carth");
B.caption("NO NEED TO ATTACK EVERYWHERE", T_EVERY, T_FOG - 0.1, "carth");
B.date("DEC 15, 1864", T_FOG, T_BACK);
B.fog(T_FOG, T_BLOW + 2, 0.6);
// feint
const sSteed = stake({ img: "steedman_head", name: "STEEDMAN", side: "carth", x: PS.steed0[0] + 110, y: PS.steed0[1] - 30, t: T_STEED - 0.3, until: N7 });
B.arrow({ side: "carth", pts: [G(36.1485, -86.7555), G(36.141, -86.7525), G(36.1355, -86.7505)], width: 18, t: T_FEINT + 0.2, dur: 1.6, until: N7 });
B.arrow({ side: "carth", pts: [G(36.147, -86.7665), G(36.140, -86.7645), G(36.1365, -86.7625)], width: 18, t: T_FEINT + 0.6, dur: 1.6, until: N7 });
mv("steed", T_FEINT + 0.4, 2.5, G(36.1425, -86.757));
B.label("FEINT", G(36.137, -86.742)[0], G(36.137, -86.742)[1], { cls: "tg", size: 40, t: T_FEINT + 1.4, until: T_BLOW, anchor: [-50, -50] });
pill("U.S. COLORED TROOPS", G(36.1435, -86.771)[0] - 40, G(36.1435, -86.771)[1] - 10, "carth", T_USCT - 0.2, T_BLOW, { size: 22, anchor: [-100, -50] });
volley([G(36.1335, -86.7555), G(36.1325, -86.7595), G(36.1345, -86.7515), G(36.131, -86.763)], T_FEINT + 1.9, [0.1, -1], { spread: 0.5 });
volley([G(36.1335, -86.7555), G(36.1325, -86.7595), G(36.131, -86.763)], T_FEINT + 3.6, [0.1, -1], { spread: 0.5 });
B.caption("DEC 15, FOG: FEINT AGAINST THE CONFEDERATE RIGHT", T_FEINT + 0.2, T_EAST - 0.1, "carth");
pulseUnit("cheat", T_EAST, 3);
const eye = B.bubble("HOOD LOOKS EAST", G(36.129, -86.745)[0] - 60, G(36.129, -86.745)[1] + 40, T_EAST + 0.1, T_BLOW + 0.8);
eye.style.fontSize = "26px";
// the great wheel: a door hinged near Montgomery Hill swings from west-northwest to southwest
const HINGE = G(36.130, -86.806), DOOR_L = 640;
const door = svgG(`<g><line x1="${HINGE[0]}" y1="${HINGE[1]}" x2="${HINGE[0] - DOOR_L}" y2="${HINGE[1]}" stroke="rgba(20,16,10,0.45)" stroke-width="16" stroke-linecap="round"/>
  <line x1="${HINGE[0]}" y1="${HINGE[1]}" x2="${HINGE[0] - DOOR_L}" y2="${HINGE[1]}" stroke="#f7f3ea" stroke-width="8" stroke-dasharray="26 14" stroke-linecap="round"/>
  <circle cx="${HINGE[0]}" cy="${HINGE[1]}" r="16" fill="var(--carth)" stroke="#f7f3ea" stroke-width="5"/></g>`);
const doorG = door.firstChild;
gsap.set(door, { autoAlpha: 0 });
const doorRot = { a: 18 };
const setDoor = () => doorG.setAttribute("transform", `rotate(${doorRot.a.toFixed(2)} ${HINGE[0]} ${HINGE[1]})`);
setDoor();
tl.to(door, { autoAlpha: 1, duration: 0.5 }, T_WHEEL - 0.2);
tl.to(doorRot, { a: -44, duration: 7, ease: "sine.inOut", onUpdate: setDoor }, T_WHEEL + 0.2);
tl.to(door, { autoAlpha: 0, duration: 0.8 }, N7 + 0.2);
B.label("THE GREAT WHEEL", HINGE[0] - 330, HINGE[1] + 90, { cls: "tg", size: 34, t: T_WHEEL + 0.6, until: N7 + 0.2, anchor: [-50, -50] });
// corps swing south-east against the Confederate left
B.arrow({ side: "carth", pts: [PS.wil0, G(36.150, -86.853), G(36.128, -86.868), G(36.110, -86.862), G(36.100, -86.848)], width: 20, t: T_WHEEL + 0.5, dur: 3.2, until: N7 + 1 });
B.arrow({ side: "carth", pts: [PS.smith0, G(36.146, -86.830), G(36.130, -86.838), G(36.114, -86.836)], width: 22, t: T_WHEEL + 0.2, dur: 2.8, until: N7 + 1 });
B.arrow({ side: "carth", pts: [G(36.147, -86.799), G(36.1355, -86.801), G(36.126, -86.803)], width: 22, t: T_WHEEL, dur: 1.4, until: N7 + 1 });
mv("wil", T_WHEEL + 0.8, 5, G(36.107, -86.8565));
mv("smith", T_WHEEL + 0.5, 4.5, G(36.1165, -86.8365));
mv("wood", T_WHEEL + 0.3, 3.5, G(36.1275, -86.8035));
mv("schof", T_WHEEL + 0.8, 5, G(36.1395, -86.8445));
pill("DISMOUNTED CAVALRY", G(36.107, -86.8565)[0], G(36.107, -86.8565)[1] + 58, "carth", T_DOOR - 0.5, N7 + 1, { size: 20 });
pill("RESERVE", G(36.1395, -86.8445)[0], G(36.1395, -86.8445)[1] - 44, "", T_DOOR, N7 + 1, { size: 20 });
const sWood = stake({ img: "wood_head", name: "WOOD", side: "carth", x: G(36.132, -86.793)[0] + 20, y: G(36.132, -86.793)[1], t: T_WHEEL + 0.4, until: N8, size: 0.62 });
const sWilson = stake({ img: "wilson_head", name: "WILSON", side: "carth", x: G(36.118, -86.872)[0], y: G(36.118, -86.872)[1], t: T_WHEEL + 1.5, size: 0.62 });
B.caption("MAIN BLOW: INFANTRY AND CAVALRY SWING LIKE A DOOR", T_BLOW, N7 - 0.1, "carth");

// =====================================================================================
// nash-7: the redoubts fall one by one; Hood driven back 2 miles to Peach Orchard Hill – Shy's Hill
// =====================================================================================
const ORDER = [3, 4, 2, 1, 0]; // Redoubt 4 first, then 5, 3, 2, 1
ORDER.forEach((k, i) => {
  const t = T_STORM + 0.1 + i * 1.25, [x, y] = REDOUBTS[k];
  clash(x, y, t, 0.9, 1.3);
  greyRedoubt(RD[k], t + 0.35);
  crossOut(x, y, t + 0.5, T_BACK + 1, 20);
});
mv("smith", T_STORM, 2.5, G(36.1085, -86.8295));
mv("wil", T_STORM + 0.4, 2.5, G(36.1005, -86.848));
mv("wood", T_STORM + 2.2, 2.5, G(36.1225, -86.806));
ring(...MONTGOMERY_HILL, T_STORM + 3.6, 2, 70);
pill("MONTGOMERY HILL", MONTGOMERY_HILL[0] + 90, MONTGOMERY_HILL[1] - 40, "carth", T_STORM + 3.2, T_BACK, { size: 21, anchor: [0, -50] });
B.caption("THE REDOUBTS ARE STORMED ONE BY ONE", T_STORM + 0.2, T_CAVED + 3, "carth");
pulseUnit("stew", T_CAVED, 2);
mv("stew", T_CAVED + 0.8, 2.2, G(36.109, -86.8105));
B.arrow({ side: "carth", pts: [G(36.106, -86.832), G(36.104, -86.822), G(36.103, -86.814)], width: 18, t: T_CAVED + 0.6, dur: 1.4, until: T_BACK + 1 });
// driven back two miles
B.date("DEC 15 · NIGHTFALL", T_BACK, N8);
const DEC16 = { lee: G(36.0765, -86.7715), stew: G(36.0815, -86.790), cheat: G(36.0855, -86.8045) };
mv("lee", T_BACK, 5, DEC16.lee);
mv("stew", T_BACK + 0.2, 4.6, DEC16.stew);
mv("cheat", T_BACK + 0.4, 5.2, DEC16.cheat);
moveStake(sHood, T_BACK, 5, ...G(36.069, -86.757));
const blueDec16 = { steed: G(36.0915, -86.7585), wood: G(36.0965, -86.778), smith: G(36.1005, -86.8095), schof: G(36.0925, -86.8295), wil: G(36.0885, -86.843) };
mv("steed", T_BACK + 0.8, 5, blueDec16.steed);
mv("wood", T_BACK + 0.6, 5, blueDec16.wood);
mv("smith", T_BACK + 0.6, 4.6, blueDec16.smith);
mv("schof", T_BACK + 0.9, 4.6, blueDec16.schof);
mv("wil", T_BACK + 1.0, 4.6, blueDec16.wil);
moveStake(sWilson, T_BACK + 1, 4.6, ...G(36.094, -86.856));
measure(G(36.118, -86.745), G(36.083, -86.745), "~2 MILES", T_BACK + 0.6, N8 - 0.2);
B.caption("HOOD DRIVEN BACK ABOUT TWO MILES", T_BACK + 0.3, N8 - 0.1, "carth");
const hPeach = B.label("PEACH ORCHARD HILL", PEACH_ORCHARD[0] + 210, PEACH_ORCHARD[1] - 40, { cls: "tg", size: 28, t: T_PEACH, anchor: [-50, -50] });
const hShy = B.label("SHY'S HILL", SHYS_HILL[0] - 170, SHYS_HILL[1] + 44, { cls: "tg", size: 30, t: T_SHY, anchor: [-50, -50] });
ring(...PEACH_ORCHARD, T_PEACH, 2, 80);
ring(...SHYS_HILL, T_SHY, 2, 80);

// =====================================================================================
// nash-8: Dec 16 — Peach Orchard Hill repulse; Wilson into the rear; artillery from three sides
// =====================================================================================
B.date("DEC 16, 1864", N8, T_4PM);
const aPeach = B.arrow({ side: "carth", pts: [G(36.0925, -86.7705), G(36.0875, -86.7685), G(36.0835, -86.7675)], width: 22, t: T_ATTACK, dur: 1.4 });
const aPeach2 = B.arrow({ side: "carth", pts: [G(36.0905, -86.7585), G(36.0855, -86.7605), G(36.0815, -86.7625)], width: 18, t: T_ATTACK + 0.3, dur: 1.4 });
volley([G(36.0815, -86.7715), G(36.0805, -86.7665), G(36.0795, -86.7625), G(36.0820, -86.7745)], T_ATTACK + 1.4, [0, -1], { spread: 0.4 });
volley([G(36.0815, -86.7715), G(36.0805, -86.7665), G(36.0795, -86.7625)], T_ATTACK + 2.8, [0, -1], { spread: 0.4 });
B.greyArrow(aPeach, T_ATTACK + 2.4, T_WILSON + 1);
B.greyArrow(aPeach2, T_ATTACK + 2.6, T_WILSON + 1);
B.label("REPULSED", G(36.0975, -86.7445)[0], G(36.0915, -86.7525)[1], { cls: "tg", size: 38, t: T_ATTACK + 2.6, until: T_WILSON + 1, anchor: [-50, -50] });
B.caption("DEC 16: ASSAULT ON PEACH ORCHARD HILL THROWN BACK", T_ATTACK, T_PINNED - 0.1, "rome");
B.caption("…BUT HOOD'S EYES ARE ON HIS RIGHT", T_PINNED, T_WILSON - 0.1, "carth");
pulseUnit("lee", T_PINNED + 0.2, 3);
B.arrow({ side: "rome", pts: [G(36.0925, -86.797), G(36.0895, -86.785), G(36.0865, -86.775)], width: 14, t: T_PINNED + 0.6, dur: 1.5, until: T_ARTY });
// Wilson behind Shy's Hill
const WIL_PATH = [blueDec16.wil, G(36.078, -86.842), G(36.0695, -86.830), G(36.0690, -86.816), G(36.0765, -86.8085)];
B.arrow({ side: "carth", pts: WIL_PATH, width: 20, t: T_WILSON + 1.8, dur: 4.5, until: N10 });
mv("wil", T_WILSON + 2.2, 4.5, G(36.0745, -86.8235));
moveStake(sWilson, T_WILSON + 2.2, 4.5, ...G(36.0665, -86.840));
pill("WILSON: INTO HOOD'S REAR", G(36.066, -86.8215)[0], G(36.066, -86.8215)[1] + 60, "carth", T_REAR, T_4PM + 3, { size: 22 });
B.caption("WILSON'S CAVALRY WORKS AROUND SHY'S HILL", T_WILSON, T_ARTY - 0.1, "carth");
// artillery from three sides
const GUNS = [G(36.0985, -86.8205), G(36.0995, -86.8045), G(36.0935, -86.7965)];
GUNS.forEach((g, i) => U({ id: "gun" + i, side: "carth", kind: "light", x: g[0], y: g[1], w: 40, h: 24, t: T_ARTY - 0.4 + i * 0.2 }));
for (let k = 0; k < 4; k++) GUNS.forEach((g, i) => fire(g[0], g[1], SHYS_HILL[0] + (i - 1) * 14, SHYS_HILL[1] + (k % 2) * 10 - 4, T_ARTY + 0.6 + k * 1.5 + i * 0.35, 1, 0, 4));
fire(G(36.0745, -86.8235)[0], G(36.0745, -86.8235)[1], SHYS_HILL[0] + 6, SHYS_HILL[1] + 16, T_ARTY + 1.6, 3, 1.7, 3);
B.caption("UNION ARTILLERY POUNDS SHY'S HILL FROM THREE SIDES", T_ARTY, N9 - 0.1, "carth");

// =====================================================================================
// nash-9: 4 PM — Shy's Hill stormed; the line unravels left to right; flight south in the rain
// =====================================================================================
B.date("DEC 16 · 4 PM", T_4PM, N10);
pill("McARTHUR'S DIVISION", G(36.1005, -86.8095)[0] - 60, G(36.1005, -86.8095)[1] - 44, "carth", T_4PM + 0.5, T_FELL + 1, { size: 21, anchor: [-50, -50] });
B.arrow({ side: "carth", pts: [G(36.0995, -86.8125), G(36.094, -86.8115), G(36.0895, -86.8095)], width: 24, t: T_STORMED - 0.4, dur: 1.6, until: T_FLED });
mv("smith", T_STORMED + 1.2, 2.5, G(36.0925, -86.8135));
volley([G(36.0785, -86.8110), G(36.0775, -86.8065), G(36.0790, -86.8150)], T_BEHIND, [0.1, -1], { spread: 0.5 });
volley([G(36.0785, -86.8110), G(36.0775, -86.8065), G(36.0790, -86.8150)], T_BEHIND + 1.6, [0.1, -1], { spread: 0.5 });
B.caption("4 PM: A UNION DIVISION STORMS SHY'S HILL", T_4PM + 0.2, T_FELL - 0.1, "carth");
clash(SHYS_HILL[0], SHYS_HILL[1] - 10, T_FELL, 1.3, 2.2);
tl.to(hShy, { color: "#9fc0ea", duration: 0.4 }, T_FELL + 0.3);
// unravel: grey west -> east
B.grey(["cheat"], T_FELL + 0.3, 0.6);
B.grey(["stew"], T_UNRAVEL + 0.8, 0.6);
B.grey(["lee"], T_UNRAVEL + 2.0, 0.6);
const hp = hoodLine.querySelectorAll("path")[1];
tl.fromTo(hp, { stroke: "#c4121f" }, { stroke: "#77746c", duration: 3.2, ease: "none", immediateRender: false }, T_UNRAVEL - 0.3);
[[36.075, -86.809], [36.0883, -86.809], [36.087, -86.799], [36.085, -86.788], [36.083, -86.777], [36.080, -86.768]].forEach(([la, lo], i) => clash(...G(la, lo), T_FELL + 0.3 + i * 0.75, 0.55, 1.1));
B.caption("THE LINE UNRAVELS FROM LEFT TO RIGHT", T_UNRAVEL - 0.3, T_FLED - 0.1, "rome");
tl.to(hoodLine, { autoAlpha: 0, duration: 1.2 }, T_FLED + 0.5);
// flight south
rain(T_FLED - 0.3, N10 + 3);
const flee = [
  B.arrow({ side: "rome", pts: [G(36.0845, -86.776), G(36.070, -86.781), G(36.052, -86.788), G(36.040, -86.790)], width: 20, t: T_FLED + 0.2, dur: 2.6, until: N11 }),
  B.arrow({ side: "rome", pts: [G(36.0850, -86.800), G(36.072, -86.807), G(36.055, -86.814), G(36.040, -86.817)], width: 18, t: T_FLED + 0.5, dur: 2.6, until: N11 }),
];
mv("cheat", T_FLED + 0.4, 4.5, G(36.061, -86.8125), "power1.in");
mv("stew", T_FLED + 0.5, 4.5, G(36.066, -86.797), "power1.in");
mv("lee", T_FLED + 0.3, 4.5, G(36.063, -86.7835), "power1.in");
moveStake(sHood, T_FLED + 0.3, 4.5, ...G(36.062, -86.768), "power1.in");
pill("FRANKLIN PIKE — SOUTH", G(36.055, -86.767)[0], G(36.055, -86.767)[1], "rome", T_FLED + 2, N10 + 3, { size: 22, anchor: [0, -50] });
B.arrow({ side: "carth", pts: [G(36.0745, -86.8235), G(36.064, -86.826), G(36.050, -86.826)], width: 16, t: T_FLED + 1.6, dur: 2.2, until: N11 });
B.arrow({ side: "carth", pts: [G(36.090, -86.7585), G(36.074, -86.768), G(36.058, -86.776)], width: 16, t: T_FLED + 2.0, dur: 2.2, until: N11 });
B.caption("HOOD'S ARMY BREAKS AND FLEES SOUTH IN THE RAIN", T_FLED, N10 - 0.1, "rome");

// =====================================================================================
// nash-10: pursuit to the Tennessee River (inset), the butcher's bill, the army broken
// =====================================================================================
B.date("DEC 17–28, 1864", N10, N11);
// inset: middle Tennessee / north Alabama, equirectangular
const IX = (lat, lon) => [+(((lon + 88.75) * 0.815 * 262)).toFixed(1), +((36.62 - lat) * 262).toFixed(1)];
const IL = (a) => a.map(([la, lo]) => IX(la, lo));
const pth = (pts) => "M " + pts.map((p) => p.join(" ")).join(" L ");
const TN_R = IL([[34.62, -85.85], [34.45, -86.12], [34.36, -86.30], [34.45, -86.58], [34.61, -86.98], [34.70, -87.28], [34.79, -87.67], [34.86, -87.97], [35.00, -88.17], [35.22, -88.25], [35.60, -88.06], [36.00, -88.08], [36.40, -88.05], [36.70, -88.10]]);
const CUM_R = IL([[36.35, -85.85], [36.28, -86.30], [36.22, -86.60], [36.163, -86.77], [36.24, -86.95], [36.32, -87.12], [36.45, -87.28], [36.53, -87.36], [36.70, -87.50]]);
const ROUTE = IL([[36.10, -86.79], [35.925, -86.869], [35.615, -87.035], [35.199, -87.031], [34.95, -87.40], [34.80, -87.56]]);
const PURSUE = IL([[36.14, -86.80], [35.925, -86.88], [35.615, -87.05], [35.199, -87.05], [35.02, -87.30]]);
const TOWNS = [["NASHVILLE", 36.163, -86.782, 1], ["FRANKLIN", 35.925, -86.869, 1], ["COLUMBIA", 35.615, -87.035, 1], ["PULASKI", 35.199, -87.031, 1], ["FLORENCE", 34.80, -87.68, -1], ["DECATUR", 34.606, -86.983, 1]];
const inset = screenDiv(`<svg viewBox="0 0 720 640" width="720" height="640">
  <path d="${pth(TN_R)}" fill="none" stroke="#7fa3b3" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="${pth(CUM_R)}" fill="none" stroke="#7fa3b3" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
  <text x="${IX(34.52, -86.2)[0]}" y="${IX(34.52, -86.2)[1] + 42}" font-family="Oswald" font-size="24" font-style="italic" fill="#2f4e5c" text-anchor="middle">TENNESSEE RIVER</text>
  <text x="${IX(36.4, -87.25)[0] + 10}" y="${IX(36.4, -87.25)[1] - 8}" font-family="Oswald" font-size="20" font-style="italic" fill="#2f4e5c" text-anchor="middle">CUMBERLAND R.</text>
  <text x="${IX(35.45, -86.05)[0]}" y="${IX(35.45, -86.05)[1]}" font-family="Oswald" font-weight="700" font-size="26" letter-spacing="5" fill="rgba(42,36,27,0.45)" text-anchor="middle">TENNESSEE</text>
  <text x="${IX(34.40, -87.40)[0]}" y="${IX(34.40, -87.40)[1]}" font-family="Oswald" font-weight="700" font-size="26" letter-spacing="5" fill="rgba(42,36,27,0.45)" text-anchor="middle">ALABAMA</text>
  <line x1="0" y1="${IX(34.99, -87)[1]}" x2="720" y2="${IX(34.99, -87)[1]}" stroke="rgba(42,36,27,0.4)" stroke-width="3" stroke-dasharray="10 8"/>
  <path class="pur" d="${pth(PURSUE)}" fill="none" stroke="#1f4fc4" stroke-width="7" stroke-dasharray="14 10" stroke-linecap="round"/>
  <path class="ret" d="${pth(ROUTE)}" fill="none" stroke="#c4121f" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  ${TOWNS.map(([n, la, lo, s]) => { const [x, y] = IX(la, lo); return `<circle cx="${x}" cy="${y}" r="7" fill="#fbfaf6" stroke="#1b1812" stroke-width="3"/><text x="${x + s * 14}" y="${y + 8}" font-family="Oswald" font-weight="700" font-size="22" fill="#1f1b14" text-anchor="${s > 0 ? "start" : "end"}">${n}</text>`; }).join("")}
  <g class="xing" transform="translate(${IX(34.80, -87.56)[0]} ${IX(34.80, -87.56)[1]})"><circle r="22" fill="none" stroke="#c4121f" stroke-width="5"/></g>
</svg><div class="ttl">PURSUIT: 10 DAYS TO THE TENNESSEE</div>`, "inset");
const retP = inset.querySelector(".ret"), purP = inset.querySelector(".pur");
tl.fromTo(inset, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: "power3.out" }, N10 - 0.2);
const retLen = 900;
gsap.set(retP, { strokeDasharray: `${retLen} ${retLen}`, strokeDashoffset: retLen });
tl.to(retP, { strokeDashoffset: 0, duration: 3.6, ease: "power1.inOut" }, N10 + 0.4);
gsap.set(purP, { autoAlpha: 0 });
tl.to(purP, { autoAlpha: 1, duration: 1.5 }, N10 + 1.6);
tl.fromTo(inset.querySelector(".xing"), { autoAlpha: 0, scale: 2.5 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, N10 + 3.8);
tl.to(inset, { autoAlpha: 0, x: 60, duration: 0.6 }, T_RESIGN - 0.3);
const stat = B.stat(["UNION: ~3,000 CASUALTIES", "CONFEDERATE: ~6,000 LOST", "4,400+ TAKEN PRISONER", "DOZENS OF CANNON CAPTURED"], T_USLOST - 0.3, T_RESIGN - 0.4, "carth");
const statRows = stat.querySelectorAll(".row");
[T_USLOST, T_CSLOST, T_PRIS, T_GUNS].forEach((t, i) => tl.fromTo(statRows[i], { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: true }, t - 0.2));
tl.to(sHood.querySelector(".face"), { filter: "grayscale(1)", duration: 0.8 }, T_RESIGN);
crossOut(G(36.062, -86.768)[0], G(36.062, -86.768)[1] - 118, T_RESIGN + 0.4, N11, 44);
B.caption("HOOD RESIGNS HIS COMMAND · JANUARY 1865", T_RESIGN, T_ARMY - 0.1, "rome");
B.caption("THE ARMY OF TENNESSEE IS BROKEN", T_ARMY, N11 - 0.1, "rome");
[["cheat"], ["stew"], ["lee"]].forEach((k) => B.hideUnits(k, T_ARMY + 0.5, 1.2));

// =====================================================================================
// nash-11: the method
// =====================================================================================
B.dateBox(N11, null);
B.dim(N11 + 0.1, END + 1, 0.9);
ring(...CITY, T_NASHV, 3, 110);
B.method(N11 + 0.3, END + 1, { rowT: [T_HURRY, T_HELD, T_STRUCK] });

B.finish();
