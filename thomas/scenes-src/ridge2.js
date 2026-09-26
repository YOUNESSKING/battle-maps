// Move 2 · Missionary Ridge (2): ridge-2 … ridge-6.
// Reinforcements (Hooker, Sherman); Nov 23 Orchard Knob; Nov 24 Lookout in fog; Nov 25 Sherman stopped by Cleburne at Tunnel Hill.
// Ridge profile inset (3 lines, ~400 ft); Thomas's four divisions take the rifle pits, come under plunging fire, then climb without orders.
// Basemap ridge (z14, 7.82 m/px, origin_world_px [1102127, 1660189]).
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
const S2 = P("ridge-2"), T_PLAN = at("ridge-2", "The plan gave"), T_THOM = at("ridge-2", "Thomas's army"), T_SUPP = at("ridge-2", "supporting part");
const T_25 = at("ridge-2", "But on the twenty-fifth"), T_STOP = at("ridge-2", "stopped cold");
const T_LOOK = T_THOM + 3.2, T_SH = T_25 + 1.2;
const S3 = P("ridge-3"), T_WALL = at("ridge-3", "a steep, rugged wall"), T_BASE = at("ridge-3", "Bragg had lined"), T_CRESTL = at("ridge-3", "its crest with artillery");
const T_CONF = at("ridge-3", "Bragg was confident"), T_NOINF = at("ridge-3", "No infantry"), T_DIFF = at("ridge-3", "But George Thomas");
const T_BEATEN = at("ridge-3", "Grant and Sherman still"), T_HSR = at("ridge-3", "Thomas had watched"), T_FED = at("ridge-3", "he had fed"), T_KNEW = at("ridge-3", "He knew exactly");
const S4 = P("ridge-4"), T_ORDER = at("ridge-4", "Grant ordered Thomas"), T_ONLY = at("ridge-4", "but only as far"), T_340 = at("ridge-4", "At around twenty to four");
const T_SIX = at("ridge-4", "six signal guns"), T_FOUR = at("ridge-4", "four divisions"), T_STEP = at("ridge-4", "stepped out"), T_FRONT = at("ridge-4", "on a front two miles");
const S5 = P("ridge-5"), T_FELL = at("ridge-5", "fell back up the hill"), T_TOOK = at("ridge-5", "Thomas's men took"), T_TRAP = at("ridge-5", "death trap");
const T_POUR = at("ridge-5", "Bragg's artillery"), T_STAY = at("ridge-5", "To stay there"), T_BACK = at("ridge-5", "To go back");
const S6 = P("ridge-6"), T_SAW = at("ridge-6", "saw what their generals"), T_SMALL = at("ridge-6", "Here and there"), T_REGT = at("ridge-6", "Then whole regiments");
const T_BRIG = at("ridge-6", "Then entire brigades"), T_NOBODY = at("ridge-6", "Nobody had ordered"), T_OWN = at("ridge-6", "The men were going up");

// ---------- camera ----------
B.camera([
  [S2, 1440, 810, 0.667],
  [T_PLAN - 1.0, 1440, 810, 0.667],
  [T_PLAN + 1.5, 1600, 520, 0.85],
  [T_THOM - 0.6, 1620, 560, 0.85],
  [T_THOM + 1.2, 1400, 640, 1.0],
  [T_LOOK - 0.6, 1400, 660, 1.0],
  [T_LOOK + 1.2, 1080, 820, 0.8],
  [T_SH - 0.2, 1080, 820, 0.8],
  [T_SH + 1.6, 1720, 520, 0.95],
  [S3 + 0.6, 1740, 540, 0.95],
  [S3 + 4.0, 1660, 700, 1.25],
  [T_BASE - 0.4, 1640, 690, 1.25],
  [T_BASE + 1.4, 1460, 680, 1.2],
  [T_CONF, 1480, 690, 1.2],
  [T_NOINF + 1.5, 1540, 700, 1.25],
  [T_DIFF + 0.4, 1520, 690, 1.25],
  [T_DIFF + 2.4, 1470, 640, 1.2],
  [T_HSR + 1.0, 1500, 650, 1.1],
  [S4, 1540, 660, 0.95],
  [T_ORDER + 1.0, 1480, 620, 1.1],
  [T_340 - 0.5, 1500, 640, 1.05],
  [T_FOUR, 1600, 660, 0.9],
  [S5, 1620, 660, 0.9],
  [T_TRAP, 1650, 660, 1.05],
  [T_POUR + 3, 1660, 670, 1.15],
  [T_BACK, 1600, 650, 0.95],
  [S6, 1600, 650, 0.95],
  [T_SMALL, 1700, 660, 1.35],
  [T_BRIG, 1690, 660, 1.3],
  [END, 1680, 650, 1.12],
]);

// ---------- base map ----------
B.image("assets/ridge_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.label("TENNESSEE RIVER", 1170, 305, { cls: "river", size: 30, rot: -2, t: 0.3, anchor: [-50, -50] });
B.city("CHATTANOOGA", ...CHATT, { size: 30, r: 9, t: 0.3, dy: -2, left: true });
LAB("LOOKOUT MOUNTAIN", LOOKOUT[0] - 40, LOOKOUT[1] + 110, 0.5, { size: 30, rot: -62 });
LAB("MISSIONARY RIDGE", 1905, 900, 0.6, { size: 36, rot: -68 });
LAB("ORCHARD KNOB", 1360, 646, T_THOM - 0.2, { size: 22 });
LAB("TUNNEL HILL", TUNNEL[0] + 95, TUNNEL[1] + 34, T_PLAN + 0.6, { size: 24 });
B.showDate(S2 + 0.3);
B.date("NOVEMBER 1863", S2 + 0.4, T_THOM - 0.3);

// Confederate siege lines: Lookout Mountain + the ridge crest
const lookLine = B.front({ pts: [[600, 1000], [660, 930], [740, 905]], color: "var(--rome)", width: 11, t: S2 + 0.5, dur: 1.2, until: T_LOOK + 2.2 });
const crestPts = [C(1560), C(1350), C(1125), C(900), C(750), C(600), C(480), C(330), C(225), C(120)];
B.front({ pts: crestPts.map(([x, y]) => [x + 8, y]), color: "var(--rome)", width: 11, t: S2 + 0.7, dur: 1.8 });
U({ id: "look", side: "rome", x: 655, y: 1040, w: 64, h: 40, t: S2 + 1.0 });
U({ id: "knobR", side: "rome", x: KNOB[0], y: KNOB[1], w: 50, h: 32, t: S2 + 1.2 });
// Union lines in front of Chattanooga
B.front({ pts: [[1330, 360], [1350, 520], [1335, 680], [1300, 850], [1240, 960]], color: "var(--carth)", width: 11, t: S2 + 0.9, dur: 1.4, until: S3 });

// reinforcements: Hooker from the west, Sherman from the north-west (via Brown's Ferry, behind the hills north of the river)
const hookA = B.arrow({ side: "carth", pts: [[20, 700], [240, 820], [420, 900]], width: 22, t: S2 + 1.6, dur: 2.0, until: T_LOOK + 2.2 });
tag("HOOKER · FROM VIRGINIA", 300, 1000, S2 + 2.4, T_SH + 0.8, { bg: "#1f4fc4", size: 30 });
tag("SHERMAN · FROM MISSISSIPPI", 1000, 225, S2 + 3.4, T_PLAN + 0.3, { bg: "#1f4fc4", size: 30 });
const shA = B.arrow({ side: "carth", pts: [[200, 560], [560, 470], [800, 300], [1020, 150], [1350, 70], [1620, 40]], width: 22, t: S2 + 2.2, dur: 3.2, until: T_25 });
const shS = STK("sherman", "SHERMAN", 1560, 262, T_PLAN + 0.5, { size: 0.85, until: T_STOP + 3.0 });
tag("MAIN ATTACK", 1760, 300, T_PLAN + 1.4, T_THOM - 0.2, { bg: "#1f4fc4", size: 26 });
B.arrow({ side: "carth", pts: [[1680, 70], [1790, 110], [1850, 150]], width: 18, dash: "20 12", t: T_PLAN + 1.0, dur: 1.2, until: T_THOM - 0.2 });
B.caption("THE PLAN: SHERMAN LEADS THE MAIN ATTACK", T_PLAN + 0.4, T_THOM - 0.3, "carth");

// Thomas: supporting part — Nov 23, Orchard Knob
B.date("NOV 23 · ORCHARD KNOB", T_THOM - 0.2, T_LOOK, 34);
B.arrow({ side: "carth", pts: [[1345, 620], [1420, 610], [1478, 604]], width: 22, t: T_THOM + 0.2, dur: 1.2, until: S3 });
B.move("knobR", T_THOM + 1.2, 1.4, C(600, -75)[0], 600);
const thS = STK("thomas", "THOMAS", 1395, 612, T_THOM + 1.6, { size: 0.8 });
B.caption("THOMAS'S ARMY: A SUPPORTING PART", T_THOM + 0.4, T_LOOK - 0.1, "carth");

// Nov 24: Hooker takes Lookout Mountain in the fog
B.date("NOV 24 · LOOKOUT MTN", T_LOOK + 0.1, T_SH, 34);
B.fog(T_LOOK - 0.2, T_SH + 0.6, 0.55);
B.arrow({ side: "carth", pts: [[430, 905], [560, 900], [650, 945], [700, 985]], width: 22, t: T_LOOK + 0.3, dur: 1.5, until: S3 });
B.grey(["look"], T_LOOK + 1.6); B.move("look", T_LOOK + 1.6, 2.0, 900, 1120);
B.hideUnits(["look"], T_SH + 1.5);
B.caption("HOOKER TAKES LOOKOUT MOUNTAIN · 'BATTLE ABOVE THE CLOUDS'", T_LOOK + 0.2, T_SH - 0.1, "carth");

// Nov 25: Sherman stopped at Tunnel Hill by Cleburne
B.date("NOV 25 · TUNNEL HILL", T_SH, S3 + 3, 34);
B.date("NOV 25, 1863", S3 + 3.3, S4 - 0.3, 34);
U({ id: "cleb", side: "rome", x: 1915, y: 150, w: 64, h: 40, t: T_SH - 0.2 });
const clS = STK("cleburne", "CLEBURNE", 2040, 330, T_SH + 0.2, { side: "rome", size: 0.85, until: S3 + 4 });
const shAtt = [[[1560, 40], [1700, 90], [1840, 140]], [[1600, 170], [1720, 180], [1845, 175]], [[1640, 290], [1740, 250], [1835, 215]]]
  .map((pts, i) => B.arrow({ side: "carth", pts, width: 18, t: T_SH + 0.4 + i * 0.35, dur: 1.2 }));
flashes([[1880, 140], [1885, 180], [1875, 215], [1900, 110]], T_SH + 1.4, 3, 0.6, 22);
shAtt.forEach((g) => B.greyArrow(g, T_STOP + 0.6, S3 + 2.5));
[[[1780, 120], [1690, 90]], [[1780, 178], [1690, 180]], [[1775, 240], [1690, 280]]].forEach((pts) => B.arrow({ side: "carth", pts, width: 12, t: T_STOP + 0.8, dur: 0.6, until: S3 + 2.5 }));
xmark(1790, 180, 30, T_STOP + 0.5, S3 + 2.5);
B.caption("SHERMAN'S ATTACKS STOPPED COLD BY CLEBURNE", T_STOP - 0.2, S3 + 2.6, "rome");

// ---------- ridge-3: the ridge itself, three lines ----------
fadeOut(B.highlight(crestPts.slice(1, 8), S3 + 3.2, true, 46), T_BASE + 0.3);
tag("~400 FT · STEEP · CUT BY RAVINES", 1965, 610, T_WALL + 1.0, T_BASE - 0.2, { bg: "#2a241b", size: 26 });
// base rifle pits
const BASEY = [380, 950];
B.front({ pts: [C(960, -112), C(850, -110), C(740, -110), C(620, -110), C(500, -110), C(390, -110)], color: "var(--rome)", width: 8, t: T_BASE + 0.2, dur: 1.4, until: T_TOOK + 1.0 });
const PITY = [480, 640, 800];
PITY.forEach((y, i) => U({ id: "pit" + i, side: "rome", x: C(y, -110)[0], y, w: 44, h: 28, t: T_BASE + 0.6 + i * 0.2 }));
tag("RIFLE PITS", C(900, -200)[0], 930, T_BASE + 0.8, T_TOOK, { size: 22 });
// halfway line (short trench stretches)
[C(700, -55), C(560, -55), C(430, -55), C(830, -55)].forEach(([x, y], i) => {
  const g = svgG(`<line x1="${x - 8}" y1="${y + 26}" x2="${x + 8}" y2="${y - 26}" stroke="var(--white)" stroke-width="12" stroke-linecap="round"/><line x1="${x - 8}" y1="${y + 26}" x2="${x + 8}" y2="${y - 26}" stroke="var(--rome)" stroke-width="7" stroke-linecap="round" stroke-dasharray="8 6"/>`);
  fadeIn(g, T_BASE + 1.4 + i * 0.15);
  fadeOut(g, T_BRIG);
});
// crest: guns + infantry behind the parapet
const GUNY = [430, 540, 660, 770, 880];
GUNY.forEach((y, i) => cannon(C(y, 6)[0], y, T_CRESTL + 0.3 + i * 0.18));
const CRY = [490, 610, 720, 830];
CRY.forEach((y, i) => U({ id: "cr" + i, side: "rome", x: C(y, 64)[0], y, w: 52, h: 32, t: T_CRESTL + 0.8 + i * 0.15 }));
tag("CREST: GUNS + TRENCHES", C(420, 150)[0], 395, T_CRESTL + 1.0, T_CONF + 0.5, { size: 22 });

const insetA = profile({ id: "pa", x: 60, y: 205, w: 960, t: T_BASE - 0.2, until: T_DIFF - 0.3, title: "MISSIONARY RIDGE · CROSS-SECTION" });
insetA.part(`<line x1="120" y1="112" x2="800" y2="112" stroke="#f7f3ea" stroke-width="2" stroke-dasharray="8 7" opacity="0.7"/>
  <line x1="150" y1="366" x2="150" y2="118" stroke="#f7f3ea" stroke-width="4"/><path d="M140 132 L150 114 L160 132 M140 352 L150 368 L160 352" fill="none" stroke="#f7f3ea" stroke-width="4"/>
  ${TXT(168, 250, 34, "~400 FT", { anchor: "start" })}`, T_BASE);
insetA.part(`${TRENCH(330, 364)}${MEN([[318, 350], [342, 350]], "#e0262f")}${TXT(330, 405, 24, "1 · RIFLE PITS")}`, T_BASE + 0.8, { y: -10 });
insetA.part(`${TRENCH(560, 256, "#e0262f", "7 5")}${TXT(575, 300, 24, "2 · HALFWAY")}`, T_BASE + 1.6, { y: -10 });
insetA.part(`${TRENCH(810, 110)}${GUN(776, 100)}${GUN(836, 100)}${TXT(810, 70, 24, "3 · CREST: TRENCH + GUNS")}`, T_CRESTL + 0.4, { y: -10 });
insetA.part(`<rect x="330" y="8" width="340" height="48" fill="#b3121c" stroke="#f7f3ea" stroke-width="3"/>${TXT(500, 44, 32, "3 LINES · ~400 FT")}`, T_CRESTL + 1.6, { scale: 1.3, svgOrigin: "500 32" });

// Bragg confident
const brS = STK("bragg", "BRAGG", HQ[0] + 150, HQ[1] + 40, T_CONF, { side: "rome", size: 0.85, until: S4 + 1.0 });
LAB("BRAGG'S HQ", HQ[0] + 150, HQ[1] + 70, T_CONF + 0.3, { size: 20, until: S4 + 1.0 });
B.caption("BRAGG: 'NO INFANTRY COULD CLIMB THAT SLOPE UNDER FIRE'", T_NOINF - 0.2, T_DIFF - 0.1, "rome");

// Thomas sees something different — the four divisions appear
pulse(1440, 560, T_DIFF + 0.4, 70, "#9fc0ea", 2);
B.caption("GRANT AND SHERMAN SAW 'THE BEATEN ARMY OF CHICKAMAUGA'", T_BEATEN, T_HSR - 0.1);
const DIVS = [["baird", "BAIRD", 470], ["wood", "WOOD", 590], ["sher", "SHERIDAN", 712], ["john", "JOHNSON", 835]];
const START = (y) => C(y, -272), PITS = (y) => C(y, -135), MID = (y) => C(y, -72);
DIVS.forEach(([id, name, y], i) => U({ id, side: "carth", x: START(y)[0], y, w: 56, h: 70, label: name, fs: 18, t: T_HSR + 0.3 + i * 0.25 }));
B.caption("THOMAS HAD WATCHED THEM HOLD HORSESHOE RIDGE · FED AND REBUILT THEM", T_HSR, T_KNEW - 0.1, "carth");
B.caption("HE KNEW WHAT THEY COULD DO", T_KNEW, S4 - 0.2, "carth");
DIVS.forEach(([id], i) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, T_KNEW + 0.3 + i * 0.15));

// ---------- ridge-4: the order, six guns, four divisions step out ----------
B.date("NOV 25 · AFTERNOON", S4 + 0.2, T_340 - 0.2, 34);
const grS = STK("grant", "GRANT", 1298, 612, S4 + 0.4, { size: 0.8 });
B.caption("ORDER: TAKE THE RIFLE PITS AT THE BASE — THEN HALT", T_ORDER + 0.2, T_340 - 0.1, "carth");
B.line([C(960, -150), C(800, -150), C(640, -150), C(480, -150), C(390, -150)], { color: "var(--white)", width: 7, dash: "16 10", t: T_ONLY + 0.2, dur: 1.4, until: T_BACK + 0.3 });
tag("HALT LINE", C(950, -240)[0], 965, T_ONLY + 0.8, T_TRAP, { bg: "#1f4fc4", size: 22 });
B.date("NOV 25 · 3:40 PM", T_340, null, 34);
// six signal guns on Orchard Knob
for (let k = 0; k < 6; k++) {
  flashes([[1400 + (k % 3) * 34, 548 + Math.floor(k / 3) * 30]], T_SIX + k * 0.45, 1, 0.5, 26);
}
pulse(1440, 560, T_SIX + 0.2, 80, "#ffb640", 3);
tag("SIX SIGNAL GUNS", 1420, 480, T_SIX + 0.3, T_FOUR + 1.5, { bg: "#2a241b", size: 24 });
B.caption("4 DIVISIONS · ~23,000 MEN", T_FOUR, T_FRONT, "carth");
// two-mile front measure (drawn west of the divisions)
const mA = [1440, 440], mB = [1280, 875];
const meas = svgG(`<line x1="${mA[0]}" y1="${mA[1]}" x2="${mB[0]}" y2="${mB[1]}" stroke="#f7f3ea" stroke-width="5" stroke-dasharray="14 8"/>
  <line x1="${mA[0] - 22}" y1="${mA[1] - 8}" x2="${mA[0] + 22}" y2="${mA[1] + 8}" stroke="#f7f3ea" stroke-width="6"/><line x1="${mB[0] - 22}" y1="${mB[1] - 8}" x2="${mB[0] + 22}" y2="${mB[1] + 8}" stroke="#f7f3ea" stroke-width="6"/>`);
fadeIn(meas, T_FRONT - 0.3); fadeOut(meas, S5 + 3);
tag("2-MILE FRONT", 1300, 760, T_FRONT, S5 + 3, { bg: "#1f4fc4", size: 26 });
B.caption("A FRONT TWO MILES WIDE", T_FRONT, S5 - 0.1, "carth");
// step out: first stretch across the plain
DIVS.forEach(([id, , y], i) => {
  const [sx] = START(y), [px] = PITS(y);
  B.move(id, T_STEP + i * 0.15, S5 - T_STEP + 0.3, sx + (px - sx) * 0.45, y, "power1.in");
});
DIVS.forEach(([, , y], i) => B.arrow({ side: "carth", pts: [C(y, -235), C(y, -160)], width: 16, t: T_STEP + 0.4 + i * 0.15, dur: 1.4, until: T_TOOK }));

// ---------- ridge-5: the rifle pits fall, then the death trap ----------
flashes(PITY.map((y) => [C(y, -125)[0], y]), S5 + 0.3, 2, 0.8, 18);
DIVS.forEach(([id, , y]) => B.move(id, S5 + 0.1, T_TOOK - S5 + 0.4, PITS(y)[0], y, "power1.out"));
PITY.forEach((y, i) => {
  B.move("pit" + i, T_FELL + 0.2 + i * 0.1, 2.6, C(y, 44)[0] - 8, y - 42, "power1.inOut");
  B.hideUnits(["pit" + i], T_FELL + 3.0);
});
tag("RIFLE PITS TAKEN", C(900, -240)[0], 930, T_TOOK + 0.2, T_TRAP + 1.0, { bg: "#1f4fc4", size: 24 });
B.caption("THOMAS'S MEN TAKE THE PITS IN MINUTES", T_TOOK, T_TRAP - 0.1, "carth");
B.caption("A DEATH TRAP", T_TRAP, T_POUR - 0.1, "rome");
// plunging fire from the crest
GUNY.forEach((y, i) => flashes([C(y, -18)], T_POUR + 0.2 + i * 0.12, 6, 1.1, 24));
CRY.forEach((y, i) => flashes([C(y - 30, 22), C(y + 30, 22)], T_POUR + 0.6 + i * 0.1, 5, 1.2, 14));
const fireL = [];
DIVS.forEach(([, , y], i) => {
  const [cx] = C(y, -5), [px] = PITS(y);
  const g = svgG(`<line x1="${cx}" y1="${y - 20}" x2="${px + 14}" y2="${y + 4}" stroke="#ffb640" stroke-width="7" stroke-dasharray="14 9"/>
    <line x1="${cx}" y1="${y + 26}" x2="${px + 14}" y2="${y + 30}" stroke="#ffb640" stroke-width="7" stroke-dasharray="12 9"/>`);
  fadeIn(g, T_POUR + 0.4 + i * 0.2); fadeOut(g, T_BACK + 1.5); fireL.push(g);
});
DIVS.forEach(([, , y]) => bursts(PITS(y)[0] - 10, y, [120, 110], T_POUR + 0.8, 7, T_BACK - T_POUR + 1.0));
B.caption("FIRE POURS DOWN FROM THE CREST INTO THE CAPTURED PITS", T_POUR + 0.3, T_STAY - 0.1, "rome");
B.caption("TO STAY: SLAUGHTERED", T_STAY, T_BACK - 0.1, "rome");
B.arrow({ side: "carth", pts: [C(650, -175), [1500, 690], [1420, 710]], width: 16, dash: "18 12", t: T_BACK, dur: 1.0, until: S6 + 1.5 });
xmark(1515, 690, 30, T_BACK + 0.6, S6 + 1.5);
B.caption("TO GO BACK ACROSS THE OPEN PLAIN: JUST AS BAD", T_BACK + 0.1, S6 - 0.1, "rome");

// ---------- ridge-6: climbing on their own, up the ravines ----------
const RAV = [405, 522, 540, 644, 662, 766, 784, 900];
const ravPath = (y, i) => { const w = i % 2 ? 7 : -7; return [C(y, -128), [C(y - 4, -90)[0], y - 4 + w], [C(y - 10, -50)[0], y - 10 - w], C(y - 16, -14)]; };
const ravHi = RAV.map((y, i) => {
  const p = document.createElementNS(NSVG, "path");
  const pts = ravPath(y, i);
  p.setAttribute("d", "M " + pts.map((q) => q.join(" ")).join(" L "));
  Object.entries({ fill: "none", stroke: "rgba(247,243,234,0.85)", "stroke-width": 7, "stroke-dasharray": "3 9", "stroke-linecap": "round" }).forEach(([k, v]) => p.setAttribute(k, v));
  OVL.appendChild(p); gsap.set(p, { autoAlpha: 0 });
  fadeIn(p, T_SAW + 1.2 + i * 0.12, 0.5, 0.9);
  fadeOut(p, T_REGT + 1);
  return p;
});
tag("RAVINES AND FOLDS", C(960, -150)[0], 995, T_SAW + 1.4, T_REGT, { bg: "#2a241b", size: 22 });
B.caption("THE MEN SAW WHAT THEIR GENERALS COULD NOT", T_SAW - 0.4, T_SMALL - 0.1, "carth");
// small groups first, then regiments
[[1, 0], [4, 0.6], [6, 1.2]].forEach(([k, d]) => B.arrow({ side: "carth", pts: ravPath(RAV[k], k), width: 12, t: T_SMALL + 0.6 + d, dur: END - T_SMALL - 2 - d }));
B.caption("SMALL GROUPS CLIMB THE RAVINES", T_SMALL + 0.8, T_REGT - 0.1, "carth");
[[0, 0], [3, 0.3], [5, 0.5], [7, 0.8], [2, 1.2]].forEach(([k, d]) => B.arrow({ side: "carth", pts: ravPath(RAV[k], k), width: 16, t: T_REGT + d, dur: END - T_REGT - 1.2 - d }));
B.caption("THEN WHOLE REGIMENTS", T_REGT, T_BRIG - 0.1, "carth");
DIVS.forEach(([id, , y], i) => B.move(id, T_BRIG + i * 0.2, END - T_BRIG - 0.4, MID(y)[0], y, "power1.inOut"));
B.caption("THEN ENTIRE BRIGADES", T_BRIG, T_NOBODY - 0.1, "carth");
tag("NO ORDERS", 1500, 470, T_NOBODY, null, { bg: "#1f4fc4", size: 40 });
B.caption("NOBODY HAD ORDERED IT", T_NOBODY, T_OWN - 0.1, "carth");
B.caption("GOING UP THE MOUNTAIN ON THEIR OWN", T_OWN, END, "carth");

B.finish();
