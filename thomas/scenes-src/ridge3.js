// Move 2 · Missionary Ridge (3): ridge-7 … ridge-9.
// Cross-section inset: crest trench on the topographic crest, dead ground, guns cannot depress, retreating men mask the fire.
// Breakthrough in six places ~4:30 pm, Bragg's army flees east; losses; method card.
// Basemap ridge (z14, origin_world_px [1102127, 1660189]). Helpers copied from ridge2.js.
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const NSVG = "http://www.w3.org/2000/svg";
const OVL = document.getElementById("overlay"), PINS = document.getElementById("pins");

const G = (lat, lon) => {
  const n = 256 * 2 ** 14, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 1102127).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 1660189).toFixed(1)];
};

const HAS = { grant: true, sherman: true, thomas: true, bragg: true, cleburne: true, hooker: false };
const US = "assets/media/us_flag_35star.png", CSA = "assets/media/csa_battle_flag.png";

// ---------- local helpers (from chick2 / ridge1) ----------
const svgG = (html, before) => { const g = document.createElementNS(NSVG, "g"); g.innerHTML = html; if (before) OVL.insertBefore(g, before); else OVL.appendChild(g); gsap.set(g, { autoAlpha: 0 }); return g; };
const fadeIn = (el, t, d = 0.5, a = 1) => tl.to(el, { autoAlpha: a, duration: d }, t);
const fadeOut = (el, t, d = 0.5) => tl.to(el, { autoAlpha: 0, duration: d }, t);
const U = (o) => {
  const el = B.unit(o);
  const tg = el.querySelector(".tag");
  if (tg) Object.assign(tg.style, { fontSize: (o.fs || 18) + "px", padding: "0 7px", marginTop: "3px" });
  return el;
};
const STK = (key, name, x, y, t, o = {}) => {
  let el;
  if (HAS[key]) {
    el = B.portraitStake({ img: `assets/media/${key}_head.png`, flag: o.side === "rome" ? CSA : US, name, x, y, size: o.size || 0.8, t, until: o.until });
    const nm = el.querySelector(".nm");
    if (nm) nm.style.fontSize = (o.fs || 16) + "px";
    if (o.side === "rome") { el.querySelector(".face").style.boxShadow = "0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5)"; if (nm) nm.style.background = "#c4121f"; }
  } else {
    el = B.plaque({ name, role: o.role, side: o.side || "carth", x, y, t, until: o.until });
    el.style.transformOrigin = "19px 240px"; el.style.scale = String(o.psc || 0.6);
  }
  return el;
};
const flashes = (pts, t, reps = 2, gap = 0.8, r = 16) => pts.forEach(([x, y], i) => {
  const f = document.createElement("div");
  f.style.cssText = `position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:radial-gradient(circle, #fff6c8 0%, #ffb640 40%, rgba(255,120,20,0) 72%)`;
  PINS.appendChild(f); gsap.set(f, { autoAlpha: 0 });
  for (let k = 0; k < reps; k++) {
    const tt = t + k * gap + (i % 3) * 0.09;
    tl.fromTo(f, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.3, duration: 0.15, immediateRender: false }, tt);
    tl.to(f, { autoAlpha: 0, scale: 0.8, duration: 0.45 }, tt + 0.15);
  }
});
const R = (() => { let s = 4711; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
const bursts = (cx, cy, spread, t, n, dur) => { // shell bursts (smoke puff + flash) scattered around a point
  for (let i = 0; i < n; i++) {
    const x = cx + (R() - 0.5) * spread[0], y = cy + (R() - 0.5) * spread[1], tt = t + R() * dur, r = 30 + R() * 16;
    const f = document.createElement("div");
    f.style.cssText = `position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;
      background:radial-gradient(circle, #fff3c0 0%, #ff9a2e 30%, rgba(90,80,70,0.75) 55%, rgba(90,80,70,0) 75%)`;
    PINS.appendChild(f); gsap.set(f, { autoAlpha: 0 });
    tl.fromTo(f, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1.2, duration: 0.2, immediateRender: false }, tt);
    tl.to(f, { autoAlpha: 0, scale: 1.7, duration: 0.9 }, tt + 0.2);
  }
};
const pulse = (x, y, t, r = 50, color = "#f2c14e", reps = 2) => {
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;border:6px solid ${color};box-shadow:0 0 18px ${color}`;
  PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  for (let k = 0; k < reps; k++) tl.fromTo(el, { autoAlpha: 1, scale: 0.4 }, { autoAlpha: 0, scale: 1.3, duration: 1.2, ease: "power2.out", immediateRender: false }, t + k * 1.0);
};
const tag = (text, x, y, t, until, o = {}) => {
  const el = document.createElement("div");
  el.innerHTML = text;
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;padding:2px 10px;background:${o.bg || "#b3121c"};color:#fff;font-weight:700;
    font-size:${o.size || 22}px;letter-spacing:0.08em;white-space:nowrap;border:2px solid #f3eee2;border-radius:3px;box-shadow:0 3px 6px rgba(0,0,0,0.5);`;
  PINS.appendChild(el);
  gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, t);
  if (until != null) fadeOut(el, until);
  return el;
};
const LAB = (txt, x, y, t, o = {}) => B.label(txt, x, y, { cls: "tg", size: o.size || 22, t, until: o.until, rot: o.rot || 0, anchor: o.anchor || [-50, -50] });
const xmark = (x, y, s, t, until) => {
  const g = document.createElementNS(NSVG, "g");
  g.innerHTML = `<line x1="${x - s}" y1="${y - s}" x2="${x + s}" y2="${y + s}" stroke="#f7f3ea" stroke-width="13" stroke-linecap="round"/><line x1="${x - s}" y1="${y + s}" x2="${x + s}" y2="${y - s}" stroke="#f7f3ea" stroke-width="13" stroke-linecap="round"/>
    <line x1="${x - s}" y1="${y - s}" x2="${x + s}" y2="${y + s}" stroke="var(--rome)" stroke-width="7" stroke-linecap="round"/><line x1="${x - s}" y1="${y + s}" x2="${x + s}" y2="${y - s}" stroke="var(--rome)" stroke-width="7" stroke-linecap="round"/>`;
  OVL.appendChild(g);
  gsap.set(g, { autoAlpha: 0, scale: 0.3, svgOrigin: `${x} ${y}` });
  tl.to(g, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, t);
  if (until != null) fadeOut(g, until);
  return g;
};
const cannon = (x, y, t, until) => { // small field gun icon facing west (world)
  const g = svgG(`<g transform="translate(${x} ${y})"><rect x="-30" y="-7" width="38" height="12" rx="4" fill="#c4121f" stroke="#f7f3ea" stroke-width="3"/>
    <circle cx="2" cy="7" r="10" fill="#2a241b" stroke="#f7f3ea" stroke-width="3"/></g>`);
  gsap.set(g, { scale: 0.3, svgOrigin: `${x} ${y}` });
  tl.to(g, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2.5)" }, t);
  if (until != null) fadeOut(g, until);
  return g;
};
const flag = (x, y, t) => { // small US flag on a pole planted at (x, y)
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - 2}px;top:${y - 58}px;width:48px;height:58px;`;
  el.innerHTML = `<div style="position:absolute;left:0;top:0;width:4px;height:58px;background:#e9e4d6;box-shadow:0 1px 3px rgba(0,0,0,.6)"></div><img src="${US}" style="position:absolute;left:4px;top:2px;width:44px;height:27px;box-shadow:0 2px 4px rgba(0,0,0,.5)">`;
  PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "bounce.out" }, t);
  return el;
};

// ---------- ridge cross-section inset (screen space) ----------
const GROUND = [[0, 370], [300, 370], [380, 358], [460, 325], [560, 260], [640, 190], [700, 148], [760, 122], [800, 114], [840, 114], [900, 140], [1000, 200]];
const profile = (o) => {
  const p = o.id, w = o.w, sh = (w - 40) * 0.42;
  const wrap = document.createElement("div");
  wrap.style.cssText = `position:absolute;left:${o.x}px;top:${o.y}px;width:${w}px;height:${sh + 78}px;background:rgba(20,17,12,0.9);border-top:5px solid var(--paper-edge);box-shadow:0 14px 30px rgba(0,0,0,0.55);`;
  const gp = GROUND.map((q) => q.join(",")).join(" ");
  wrap.innerHTML = `<div style="position:absolute;left:22px;top:10px;font-size:${o.fs || 28}px;font-weight:700;letter-spacing:0.14em;color:#f7f3ea">${o.title}</div>
  <svg viewBox="0 0 1000 420" style="position:absolute;left:20px;top:58px;width:${w - 40}px;height:${sh}px" xmlns="${NSVG}">
    <defs><linearGradient id="${p}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46505c"/><stop offset="1" stop-color="#6d7072"/></linearGradient>
      <pattern id="${p}hatch" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="16" height="16" fill="rgba(255,200,80,0.25)"/><line x1="0" y1="0" x2="0" y2="16" stroke="rgba(255,205,90,0.85)" stroke-width="5"/></pattern></defs>
    <rect width="1000" height="420" fill="url(#${p}sky)"/>
    <polygon points="${gp} 1000,420 0,420" fill="#8a7250" stroke="#eadcb4" stroke-width="4" stroke-linejoin="round"/>
    <g class="parts"></g>
  </svg>`;
  document.getElementById("scene").insertBefore(wrap, document.getElementById("credit"));
  gsap.set(wrap, { autoAlpha: 0 });
  tl.fromTo(wrap, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, o.t);
  if (o.until != null) tl.to(wrap, { autoAlpha: 0, duration: 0.5 }, o.until);
  const parts = wrap.querySelector("g.parts");
  const part = (html, t, from = {}) => { // add an SVG group that fades in at t
    const g = document.createElementNS(NSVG, "g"); g.innerHTML = html; parts.appendChild(g);
    gsap.set(g, { autoAlpha: 0 });
    tl.fromTo(g, { autoAlpha: 0, ...from }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }, t);
    return g;
  };
  return { wrap, part };
};
const TXT = (x, y, s, text, o = {}) => `<text x="${x}" y="${y}" font-family="Oswald" font-weight="700" font-size="${s}" letter-spacing="2" fill="${o.fill || "#f7f3ea"}" text-anchor="${o.anchor || "middle"}" ${o.stroke ? `stroke="${o.stroke}" stroke-width="5" paint-order="stroke"` : ""}>${text}</text>`;
const TRENCH = (x, y, c = "#e0262f", dash = "") => `<path d="M ${x - 22} ${y - 4} L ${x - 15} ${y + 8} L ${x + 15} ${y + 8} L ${x + 22} ${y - 4}" fill="none" stroke="${c}" stroke-width="8" stroke-linejoin="round" ${dash ? `stroke-dasharray="${dash}"` : ""}/>`;
const GUN = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-36" y="-7" width="42" height="13" rx="4" fill="#e0262f" stroke="#f7f3ea" stroke-width="2.5"/><circle cx="2" cy="7" r="11" fill="#1d1a14" stroke="#f7f3ea" stroke-width="3"/></g>`;
const MEN = (pts, c) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}" stroke="#f7f3ea" stroke-width="2.5"/>`).join("");

// ---------- geography ----------
const CHATT = G(35.046, -85.310), LOOKOUT = G(35.010, -85.344);
const KNOB = [1510, 600];
// Missionary Ridge crest traced from the relief (south -> north)
const CREST = [[1387, 1590], [1477, 1350], [1540, 1125], [1622, 900], [1702, 750], [1760, 600], [1785, 480], [1830, 330], [1867, 225], [1905, 30]];
const crestX = (y) => {
  for (let i = 0; i < CREST.length - 1; i++) {
    const [x0, y0] = CREST[i], [x1, y1] = CREST[i + 1];
    if (y <= y0 && y >= y1) return x0 + (x1 - x0) * (y - y0) / (y1 - y0);
  }
  return y > CREST[0][1] ? CREST[0][0] : CREST[CREST.length - 1][0];
};
const C = (y, dx = 0) => [+(crestX(y) + dx).toFixed(1), y]; // point on / west of (dx<0) / east of the crest
const TUNNEL = [1893, 95], HQ = [1720, 760];


// ---------- times ----------
const S7 = P("ridge-7"), T_TOP = at("ridge-7", "Bragg's engineers"), T_INST = at("ridge-7", "instead of a little way"), T_SEE = at("ridge-7", "From up there");
const T_TILT = at("ridge-7", "and their cannon"), T_RETR = at("ridge-7", "And the men retreating"), T_OWNC = at("ridge-7", "so the defenders");
const S8 = P("ridge-8"), T_COLL = at("ridge-8", "Bragg's centre collapsed"), T_LOSS = at("ridge-8", "In the fighting around"), T_CAPT = at("ridge-8", "over four thousand");
const T_GUNS = at("ridge-8", "around forty cannon"), T_UNION = at("ridge-8", "The Union lost"), T_OPEN = at("ridge-8", "The siege was broken");
const S9 = P("ridge-9"), T_REF = at("ridge-9", "He had refused"), T_HELD = at("ridge-9", "He had held the ground"), T_BLOW = at("ridge-9", "struck the blow");

// ---------- camera ----------
B.camera([
  [0, 1680, 650, 1.12],
  [S8 - 1.0, 1700, 650, 1.2],
  [S8 + 0.5, 1700, 650, 1.2],
  [T_COLL, 1720, 650, 1.05],
  [T_COLL + 3.5, 1960, 700, 0.85],
  [T_OPEN, 1900, 780, 0.8],
  [S9, 1800, 800, 0.75],
  [END, 1440, 810, 0.667],
]);

// ---------- map state carried over from ridge2 ----------
B.image("assets/ridge_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.label("TENNESSEE RIVER", 1170, 305, { cls: "river", size: 30, rot: -2, instant: true, anchor: [-50, -50] });
B.city("CHATTANOOGA", ...CHATT, { size: 30, r: 9, t: 0, dy: -2, left: true });
LAB("LOOKOUT MOUNTAIN", LOOKOUT[0] - 40, LOOKOUT[1] + 110, 0, { size: 30, rot: -62 });
LAB("MISSIONARY RIDGE", 1905, 900, 0, { size: 36, rot: -68 });
LAB("ORCHARD KNOB", 1360, 646, 0, { size: 22 });
LAB("TUNNEL HILL", TUNNEL[0] + 95, TUNNEL[1] + 34, 0, { size: 24 });
B.showDate(0);
B.date("NOV 25 · 3:40 PM", 0, S8 - 0.2, 34);
const crestPts = [C(1560), C(1350), C(1125), C(900), C(750), C(600), C(480), C(330), C(225), C(120)];
const crestLine = B.front({ pts: crestPts.map(([x, y]) => [x + 8, y]), color: "var(--rome)", width: 11, t: 0, dur: 0.01 });
const GUNY = [430, 540, 660, 770, 880];
const guns = GUNY.map((y) => cannon(C(y, 6)[0], y, 0));
const CRY = [490, 610, 720, 830];
CRY.forEach((y, i) => U({ id: "cr" + i, side: "rome", x: C(y, 64)[0], y, w: 52, h: 32, t: 0 }));
CRY.forEach((y, i) => gsap.set(B.units["cr" + i].el, { autoAlpha: 1, y: 0, scale: 1 }));
const DIVS = [["baird", "BAIRD", 470], ["wood", "WOOD", 590], ["sher", "SHERIDAN", 712], ["john", "JOHNSON", 835]];
DIVS.forEach(([id, name, y]) => U({ id, side: "carth", x: C(y, -72)[0], y, w: 56, h: 70, label: name, fs: 18, t: 0 }));
const RAV = [405, 522, 540, 644, 662, 766, 784, 900];
const ravPath = (y, i) => { const w = i % 2 ? 7 : -7; return [C(y, -128), [C(y - 4, -90)[0], y - 4 + w], [C(y - 10, -50)[0], y - 10 - w], C(y - 16, -14)]; };
const ravA = RAV.map((y, i) => B.arrow({ side: "carth", pts: ravPath(y, i), width: [1, 4, 6].includes(i) ? 12 : 16, t: 0, dur: 0.01 }));
STK("grant", "GRANT", 1298, 612, 0, { size: 0.8 });
STK("thomas", "THOMAS", 1395, 612, 0, { size: 0.8 });
// the ridge keeps climbing behind the inset
DIVS.forEach(([id, , y]) => B.move(id, 1, S8 - 1.5, C(y, -40)[0], y));

// ---------- ridge-7: cross-section ----------
B.dim(0.2, S8 - 0.4, 0.75);
B.dateBox(0.2, S8 - 0.3);
const pr = profile({ id: "pb", x: 190, y: 150, w: 1540, t: 0.3, until: S8 - 0.4, title: "WHY THE 'IMPOSSIBLE' SLOPE WAS THE WEAKNESS", fs: 34 });
pr.part(`<rect x="0" y="0" width="1" height="1" fill="none"/>`, 0.3);
// blue climbers and retreating red men (animated inner groups)
const blueG = pr.part(`<g class="m">${MEN([[400, 338], [450, 317], [500, 287], [545, 256]], "#2f6be0")}</g>`, 0.6);
const redG = pr.part(`<g class="m">${MEN([[612, 204], [655, 170], [690, 146]], "#e0262f")}</g>`, T_RETR - 0.2);
tl.fromTo(blueG.querySelector(".m"), { x: -200, y: 50 }, { x: 0, y: 0, duration: T_SEE + 2 - 0.6, ease: "none", immediateRender: false }, 0.6);
tl.fromTo(redG.querySelector(".m"), { x: -140, y: 90 }, { x: 0, y: 0, duration: 2.5, ease: "power1.out", immediateRender: false }, T_RETR - 0.2);
pr.part(`${TRENCH(810, 110)}<g class="gun">${GUN(776, 100)}</g>${GUN(840, 100)}`, 0.5);
pr.part(`<line x1="810" y1="90" x2="810" y2="36" stroke="#f7f3ea" stroke-width="3"/>${TXT(985, 30, 26, "MAIN TRENCH: THE VERY TOP", { stroke: "#2a241b", anchor: "end" })}`, T_TOP + 0.3, { y: -10 });
pr.part(`${TRENCH(692, 150, "#f7f3ea", "6 5")}<line x1="680" y1="138" x2="600" y2="112" stroke="#f7f3ea" stroke-width="3"/>
  ${TXT(500, 80, 24, "MILITARY CREST: A LITTLE WAY DOWN", { stroke: "#2a241b" })}${TXT(500, 106, 20, "(COULD SEE THE WHOLE SLOPE — NOT USED)", { fill: "#e8dcc0", stroke: "#2a241b" })}`, T_INST + 0.2, { y: -10 });
// line of sight + dead ground
const DEAD = [[300, 370], [380, 358], [460, 325], [560, 260], [640, 190]];
pr.part(`<polygon points="${DEAD.map((q) => q.join(",")).join(" ")}" fill="url(#pbhatch)"/>`, T_SEE + 1.5);
pr.part(`<line x1="802" y1="104" x2="140" y2="453" stroke="#ffd35a" stroke-width="4" stroke-dasharray="14 9"/>${TXT(250, 330, 22, "LINE OF SIGHT", { fill: "#ffd35a", stroke: "#2a241b" })}`, T_SEE + 0.3);
pr.part(`<line x1="470" y1="330" x2="470" y2="392" stroke="#ffd35a" stroke-width="3"/>${TXT(470, 412, 26, "DEAD GROUND: UNSEEN, CAN'T BE HIT", { fill: "#ffd35a" })}`, T_SEE + 1.8, { y: 10 });
// guns tilt but cannot aim down
const gunG = pr.wrap.querySelector(".gun");
tl.to(gunG, { rotation: -9, svgOrigin: "776 100", duration: 1.0, ease: "power2.inOut" }, T_TILT + 0.3);
tl.to(gunG, { rotation: -6, svgOrigin: "776 100", duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_TILT + 1.3);
pr.part(`<line x1="740" y1="106" x2="60" y2="214" stroke="#ff9a2e" stroke-width="4" stroke-dasharray="10 8"/>${TXT(160, 180, 22, "LOWEST AIM: SHOTS FLY OVER", { fill: "#ffb640", stroke: "#2a241b" })}`, T_TILT + 1.0);
pr.part(`<line x1="740" y1="108" x2="520" y2="270" stroke="#ff9a2e" stroke-width="3" stroke-dasharray="5 7" opacity="0.8"/>
  <g stroke="#e0262f" stroke-width="7" stroke-linecap="round"><line x1="610" y1="178" x2="646" y2="214"/><line x1="610" y1="214" x2="646" y2="178"/></g>`, T_TILT + 2.2, { scale: 1.4, svgOrigin: "628 196" });
// own men masking the fire
pr.part(`<rect x="600" y="240" width="340" height="44" fill="#b3121c" stroke="#f7f3ea" stroke-width="3"/>${TXT(770, 272, 24, "OWN MEN IN THE LINE OF FIRE")}`, T_OWNC, { y: 10 });
B.caption("MAIN TRENCHES ON THE VERY TOP OF THE RIDGE", T_TOP + 0.2, T_SEE - 0.1, "rome");
B.caption("BELOW THEM: DEAD GROUND THE DEFENDERS COULD NOT SEE OR HIT", T_SEE + 1.5, T_RETR - 0.1, "rome");
B.caption("RETREATING CONFEDERATES MASK THEIR OWN GUNS", T_RETR + 0.6, S8 - 0.4, "rome");

// ---------- ridge-8: breakthrough in six places ----------
B.date("NOV 25 · 4:30 PM", S8, null, 34);
const BRK = [455, 530, 605, 690, 765, 850];
BRK.forEach((y, i) => {
  const t = S8 + 0.6 + i * 0.35 + (i % 2) * 0.1;
  B.arrow({ side: "carth", pts: [C(y, -45), C(y, 20), C(y - 6, 95)], width: 18, t, dur: 0.9 });
  flag(C(y - 22, 22)[0], y - 22, t + 1.3);
});
DIVS.forEach(([id, , y], i) => B.move(id, S8 + 0.8 + i * 0.2, 2.5, C(y, 8)[0], y));
tag("BLUE FLAGS ON THE CREST · 6 PLACES AT ONCE", 1500, 380, S8 + 1.6, T_COLL + 1.2, { bg: "#1f4fc4", size: 26 });
B.caption("~4:30 PM: THE CREST BROKEN IN HALF A DOZEN PLACES", S8 + 0.4, T_COLL - 0.1, "carth");
// Bragg's centre collapses; the army flees east
fadeOut(crestLine, T_COLL + 0.8, 1.0);
guns.forEach((g) => fadeOut(g, T_COLL + 0.8, 0.8));
CRY.forEach((y, i) => { B.grey(["cr" + i], T_COLL); B.move("cr" + i, T_COLL + 0.2, 3.5, C(y, 330)[0], y + 30); B.hideUnits(["cr" + i], T_COLL + 4.2); });
const flee = [[C(480, 90), [2150, 520], [2480, 600]], [C(640, 90), [2100, 700], [2500, 760]], [C(800, 90), [2050, 880], [2450, 960]]]
  .map((pts, i) => B.arrow({ side: "rome", pts, width: 20, t: T_COLL + 0.4 + i * 0.25, dur: 1.6 }));
flee.forEach((g) => B.greyArrow(g, T_COLL + 2.4, T_LOSS + 6));
tag("TO GEORGIA ►", 2600, 760, T_COLL + 1.8, T_LOSS + 6, { bg: "#2a241b", size: 34 });
B.caption("BRAGG'S ARMY FLEES EAST INTO GEORGIA", T_COLL, T_LOSS - 0.3, "rome");
// losses (rows timed to the narration)
const st = B.stat(["CONFEDERATE LOSSES ~6,700", "4,000+ CAPTURED · ~40 CANNON", "UNION LOSSES ~5,800", "SIEGE OF CHATTANOOGA BROKEN"], T_LOSS, S9 - 0.3, "rome");
const rows = st.querySelectorAll(".row");
rows.forEach((r) => gsap.set(r, { autoAlpha: 0 }));
[T_LOSS + 0.2, T_CAPT, T_UNION, T_OPEN].forEach((t, i) => tl.fromTo(rows[i], { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.5, immediateRender: false }, t));
tl.to(rows[3], { color: "#9fc0ea", duration: 0.3 }, T_OPEN);
B.arrow({ side: "carth", pts: [[1900, 900], [2200, 1100], [2560, 1300]], width: 26, t: T_OPEN + 0.8, dur: 2.0, until: S9 + 2 });
tag("THE ROAD INTO THE CONFEDERACY ►", 2560, 1200, T_OPEN + 1.8, S9 + 2, { bg: "#1f4fc4", size: 28 });

// ---------- ridge-9: the method ----------
B.method(T_REF - 0.6, END - 0.4, { rowT: [T_REF, T_HELD, T_BLOW] });
pulse(...CHATT, T_HELD + 0.2, 90, "#9fc0ea", 2);

B.finish();
