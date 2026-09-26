// Move 1, part 2: Saratoga, Sep-Oct 1777. Bemis Heights, Freeman's Farm (19 Sep), Barber wheatfield (7 Oct).
// Americans = blue ("carth"), British = red ("rome"). Basemap: saratoga (z15, 3.49 m/px).
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const NSVG = "http://www.w3.org/2000/svg";
const OVL = document.getElementById("overlay"), PINS = document.getElementById("pins");

// ---------- projection (assets/saratoga.json: zoom 15, origin_world_px 2477207, 3081641) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 15, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 2477207).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 3081641).toFixed(1)];
};

// portraits available at build time (set by hand after checking assets/media)
const HAS = { gates: true, morgan: true, fraser: false };
const US_FLAG = "assets/media/us_flag_13star.png", GB_FLAG = "assets/media/gb_flag_1707.png";

// ---------- local helpers (kept here, not in lib, to avoid conflicts) ----------
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const svgG = (html) => { const g = document.createElementNS(NSVG, "g"); g.innerHTML = html; OVL.appendChild(g); gsap.set(g, { autoAlpha: 0 }); return g; };
const fadeIn = (el, t, d = 0.5) => tl.to(el, { autoAlpha: 1, duration: d }, t);
const fadeOut = (el, t, d = 0.5) => tl.to(el, { autoAlpha: 0, duration: d }, t);

// range ring: circle drawn on with a stroke sweep
function ring(x, y, r, o) {
  const len = 2 * Math.PI * r;
  const g = svgG(`<circle cx="${x}" cy="${y}" r="${r}" fill="${o.fill || "none"}" stroke="rgba(0,0,0,0.45)" stroke-width="${(o.w || 2) + 1.6}"/>
    <circle class="rc" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${o.color}" stroke-width="${o.w || 2}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""} transform="rotate(-90 ${x} ${y})"/>`);
  const c = g.querySelector(".rc");
  if (!o.dash) { gsap.set(c, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); tl.to(c, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, o.t); }
  fadeIn(g, o.t, 0.3);
  if (o.until != null) fadeOut(g, o.until);
  return g;
}
// crosshair target mark
function target(x, y, t, until, r = 16) {
  const g = svgG(`<g transform="translate(${x} ${y})" fill="none" stroke-linecap="round">
    <circle r="${r}" stroke="rgba(0,0,0,0.55)" stroke-width="6"/><circle r="${r}" stroke="#ffe27a" stroke-width="3"/>
    <path d="M ${-r - 8} 0 H ${-r + 6} M ${r - 6} 0 H ${r + 8} M 0 ${-r - 8} V ${-r + 6} M 0 ${r - 6} V ${r + 8}" stroke="rgba(0,0,0,0.55)" stroke-width="6"/>
    <path d="M ${-r - 8} 0 H ${-r + 6} M ${r - 6} 0 H ${r + 8} M 0 ${-r - 8} V ${-r + 6} M 0 ${r - 6} V ${r + 8}" stroke="#ffe27a" stroke-width="3"/></g>`);
  const inner = g.firstChild;
  gsap.set(inner, { transformOrigin: "50% 50%" });
  tl.fromTo(g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, t);
  tl.fromTo(inner, { scale: 2.2, rotation: -60 }, { scale: 1, rotation: 0, duration: 0.6, ease: "power3.out" }, t);
  if (until != null) fadeOut(g, until, 0.4);
  return g;
}
// red X crossing out a mark
function crossOut(x, y, t, until, r = 15) {
  const g = svgG(`<path d="M ${x - r} ${y - r} L ${x + r} ${y + r} M ${x + r} ${y - r} L ${x - r} ${y + r}" stroke="rgba(0,0,0,0.6)" stroke-width="10" stroke-linecap="round"/>
    <path d="M ${x - r} ${y - r} L ${x + r} ${y + r} M ${x + r} ${y - r} L ${x - r} ${y + r}" stroke="#e3232f" stroke-width="6" stroke-linecap="round"/>`);
  tl.fromTo(g, { autoAlpha: 0, scale: 1.8, svgOrigin: `${x} ${y}` }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, t);
  if (until != null) fadeOut(g, until, 0.4);
  return g;
}
// muzzle-flash fire line: a thin bright streak from shooter to target, flashing n times
function fire(x1, y1, x2, y2, t, n = 1, gap = 0.9, w = 2.5) {
  const g = svgG(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(0,0,0,0.35)" stroke-width="${w + 2}" stroke-linecap="round"/>
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff1b0" stroke-width="${w}" stroke-linecap="round"/>
    <circle cx="${x1}" cy="${y1}" r="${w * 2.6}" fill="#ffd34d" stroke="#fff6d8" stroke-width="1.5"/>`);
  for (let i = 0; i < n; i++) {
    const tt = t + i * gap;
    tl.fromTo(g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, tt);
    tl.to(g, { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, tt + 0.16);
  }
  return g;
}
// small round markers (riflemen / officers) that B.move can move
let dotN = 0;
function dot(x, y, o) {
  const id = o.id || "dot" + (++dotN), r = o.r || 9;
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;
    background:${o.fill};border:${o.bw || 2.5}px solid ${o.stroke || "#f7f3ea"};box-shadow:0 2px 4px rgba(0,0,0,0.5);`;
  PINS.appendChild(el);
  B.units[id] = { el, w: 2 * r, h: 2 * r, x, y };
  gsap.set(el, { autoAlpha: 0 });
  if (o.t != null) tl.fromTo(el, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, o.t);
  if (o.until != null) fadeOut(el, o.until, 0.4);
  return id;
}
// field redoubt: small earthwork polygon with name
function redoubt(x, y, name, side, t, o = {}) {
  const c = side === "rome" ? "var(--rome)" : "var(--carth)";
  const pts = o.pts || [[-46, -30], [40, -36], [50, 22], [-6, 40], [-50, 18]];
  const g = svgG(`<polygon points="${pts.map(([a, b]) => `${x + a},${y + b}`).join(" ")}" fill="rgba(179,38,30,0.22)" stroke="${c}" stroke-width="7" stroke-dasharray="14 6" stroke-linejoin="round"/>`);
  fadeIn(g, t, 0.6);
  const lab = B.label(name, x + (o.lx || 0), y + (o.ly || 50), { size: o.size || 24, cls: "tg", t, anchor: [-50, 0] });
  if (o.until != null) { fadeOut(g, o.until); fadeOut(lab, o.until); }
  return { g, lab, poly: g.querySelector("polygon") };
}
// tree icon (Murphy's tree)
function tree(x, y, t, until) {
  const g = svgG(`<g transform="translate(${x} ${y})"><rect x="-4" y="-6" width="8" height="26" fill="#5a3b1e" stroke="#2a1d10" stroke-width="2"/>
    <circle cx="0" cy="-22" r="20" fill="#4f6b34" stroke="#22301a" stroke-width="3"/><circle cx="-12" cy="-12" r="13" fill="#5b7a3c" stroke="#22301a" stroke-width="2.5"/>
    <circle cx="12" cy="-12" r="13" fill="#5b7a3c" stroke="#22301a" stroke-width="2.5"/></g>`);
  tl.fromTo(g, { autoAlpha: 0, scale: 0.4, svgOrigin: `${x} ${y + 20}` }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, t);
  if (until != null) fadeOut(g, until);
  return g;
}
// small red text tag in world space (e.g. MORTALLY WOUNDED)
function tag(text, x, y, t, until, o = {}) {
  const el = document.createElement("div");
  el.textContent = text;
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;padding:2px 10px;background:${o.bg || "#b3121c"};color:#fff;font-weight:700;
    font-size:${o.size || 22}px;letter-spacing:0.08em;white-space:nowrap;border:2px solid #f3eee2;border-radius:3px;box-shadow:0 3px 6px rgba(0,0,0,0.5);`;
  PINS.appendChild(el);
  gsap.set(el, { xPercent: o.ax != null ? o.ax : -50, autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, t);
  if (until != null) fadeOut(el, until);
  return el;
}
const bigTags = (ids, px) => ids.forEach((k) => { const tg = B.units[k].el.querySelector(".tag"); if (tg) tg.style.fontSize = px + "px"; });
// move along a polyline: one B.move per leg, total duration split by leg length
function follow(id, pts, t, dur, ease = "none") {
  const L = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = L.reduce((a, b) => a + b, 0);
  let tt = t;
  pts.slice(1).forEach((p, i) => { const d = dur * L[i] / tot; B.move(id, tt, d, p[0], p[1], ease); tt += d; });
}

// ---------- key times ----------
const S = {}; ["sar-2", "sar-2b", "sar-3", "sar-4", "sar-5", "sar-6", "sar-7", "sar-8", "sar-9", "sar-10"].forEach((k) => (S[k] = P(k)));
const T_GATES = at("sar-2", "General Horatio Gates"), T_SPECIAL = at("sar-2", "special unit"), T_500 = at("sar-2", "Around five hundred");
const T_MORGAN = at("sar-2", "Colonel Daniel Morgan");
const T_LOAD = at("sar-2b", "It took much longer"), T_BAYO = at("sar-2b", "could not carry a bayonet");
const T_HIT = at("sar-2b", "hit a man at two"), T_80 = at("sar-2b", "beyond eighty");
const T_LINES = at("sar-3", "Stand in close-packed"), T_IRREG = at("sar-3", "American irregulars");
const T_DIFF = at("sar-4", "But Morgan saw"), T_CROWD = at("sar-4", "crowd of targets"), T_OFFIC = at("sar-4", "the officers, in their");
const T_MACHINE = at("sar-4", "Take away the officers");
const T_THREE = at("sar-5", "three columns"), T_FF = at("sar-5", "Freeman's Farm"), T_STRUCK = at("sar-5", "Morgan's riflemen struck");
const T_TREES = at("sar-5", "Firing from behind trees"), T_EVERY = at("sar-5", "almost every officer"), T_RAN = at("sar-5", "The survivors ran");
const T_CHASE = at("sar-6", "chased too far"), T_MAIN = at("sar-6", "main British column"), T_SCAT = at("sar-6", "scattered through");
const T_TURKEY = at("sar-6", "turkey call"), T_SURGE = at("sar-6", "surged back and forth"), T_NIGHT = at("sar-6", "At nightfall");
const T_600 = at("sar-6", "six hundred men");
const T_OCT = at("sar-7", "seventh of October"), T_1500 = at("sar-7", "fifteen hundred"), T_BOTH = at("sar-7", "both ends");
const T_LEFT = at("sar-7", "other brigades struck"), T_WEST = at("sar-7", "Morgan's riflemen swung");
const T_GIVE = at("sar-8", "began to give way"), T_RALLY = at("sar-8", "riding back and forth"), T_FRASER = at("sar-8", "Brigadier General Simon Fraser");
const T_POINT = at("sar-8", "Morgan pointed"), T_MURPHY = at("sar-8", "Timothy Murphy"), T_TREE = at("sar-8", "climbed into a tree");
const T_3RD = at("sar-8", "third shot"), T_FELL = at("sar-8", "Fraser fell"), T_MORT = at("sar-8", "mortally wounded");
const T_COLL = at("sar-9", "the British line collapsed"), T_CHASE9 = at("sar-9", "chased it back"), T_STORM = at("sar-9", "stormed one");
const T_RETREAT = at("sar-9", "Burgoyne retreated"), T_SURR = at("sar-9", "on the seventeenth"), T_6000 = at("sar-9", "Nearly six thousand");
const T_M1 = at("sar-10", "Strike the officers"), T_M2 = at("sar-10", "Bait the enemy"), T_M3 = at("sar-10", "spring the trap");
const T_ONLY = at("sar-10", "At Saratoga, Morgan");

// ---------- places (world px; OSM/Nominatim positions of the Saratoga NHP tour stops) ----------
const NEILSON = G(42.9863, -73.6416);   // American HQ area / Bemis Heights line
const BARBER = G(43.0009, -73.6461);    // Barber wheatfield
const BALC = G(43.0051, -73.6386);      // Balcarres redoubt (on Freeman's farm)
const BREY = [1075, 440];               // Breymann redoubt (NW of Balcarres, spread slightly for legibility)
const GREAT = G(43.0027, -73.6109);     // Great Redoubt, British river bluff
const FF = [1150, 575];                 // Freeman's farm clearing centre

// ---------- camera ----------
B.camera([
  [0, 1480, 880, 0.72],
  [T_GATES - 1.0, 1400, 980, 0.9],
  [T_SPECIAL, 1320, 1040, 1.0],
  [T_MORGAN + 1.0, 1040, 1090, 1.35],
  [S["sar-2b"] - 0.4, 1000, 1070, 1.45],
  [S["sar-2b"] + 2.2, 810, 1000, 3.0],
  [T_80 + 0.5, 800, 990, 3.25],
  [S["sar-3"] + 2.4, 1450, 600, 0.9],
  [B.end("sar-3"), 1400, 620, 0.95],
  [S["sar-4"] + 3.0, 1150, 620, 1.45],
  [B.end("sar-4"), 1160, 600, 1.55],
  [T_FF, 1160, 590, 1.7],
  [T_RAN + 1.5, 1170, 570, 1.75],
  [T_MAIN + 0.6, 1200, 540, 1.35],
  [T_SURGE + 2.0, 1210, 560, 1.3],
  [B.end("sar-6"), 1200, 600, 1.15],
  [S["sar-7"] + 3.0, 1080, 800, 1.05],
  [T_WEST + 3.5, 1000, 820, 1.12],
  [B.end("sar-7"), 1010, 800, 1.2],
  [T_RALLY + 1.0, 980, 740, 1.8],
  [T_FELL + 1.5, 960, 760, 2.0],
  [B.end("sar-8"), 990, 720, 1.7],
  [T_STORM + 2.0, 1150, 580, 1.25],
  [T_RETREAT + 3.5, 1650, 520, 0.9],
  [B.end("sar-9"), 1600, 600, 0.85],
  [END, 1440, 810, 0.72],
]);

// ---------- terrain ----------
const HUDSON = [[2245, -30], [2220, 180], [2170, 400], [2080, 560], [1990, 700], [1950, 880], [1940, 1100], [1925, 1300], [1840, 1440], [1720, 1560], [1640, 1650]];
B.river(HUDSON, 30);
const hudLab = B.label("HUDSON RIVER", 1990, 1080, { cls: "river", size: 34, instant: true });
gsap.set(hudLab, { xPercent: -50, yPercent: -50, rotation: -87 });
const RIVER_ROAD = [[2150, -20], [2110, 250], [2020, 470], [1920, 640], [1880, 800]];

// ---------- sar-2: Bemis Heights, Gates, Morgan ----------
B.title("MOVE 1", "SARATOGA", "September – October 1777", 0.3, 5.0);
B.showDate(0.4);
B.date("SEPTEMBER 1777", 0.6, S["sar-5"] - 0.4);
B.arrow({ side: "rome", pts: [[2175, -40], [2140, 150], [2090, 300]], width: 20, t: 1.2, dur: 1.8, until: S["sar-3"] });
B.label("BURGOYNE", 2130, 330, { cls: "tg", size: 34, t: 2.4, until: S["sar-3"] });
const AMLINE = [[930, 1110], [1060, 1165], [1200, 1200], [1350, 1225], [1500, 1262], [1650, 1300], [1800, 1330], [1905, 1335]];
B.front({ pts: AMLINE, color: "var(--carth)", width: 9, t: at("sar-2", "on the high ground") - 0.3, dur: 2.4, until: S["sar-7"] - 0.2 });
B.label("BEMIS HEIGHTS", 1250, 1085, { cls: "tg", size: 40, t: at("sar-2", "Bemis Heights") - 0.3, anchor: [-50, 0], until: S["sar-2b"] });
[[1180, 1250], [1400, 1285], [1620, 1325], [1820, 1370]].forEach(([x, y], i) =>
  B.unit({ id: "am" + i, side: "carth", kind: "inf", x, y, w: 64, h: 40, t: at("sar-2", "American army") + i * 0.2 }));
B.hideUnits(["am0", "am1", "am2", "am3"], S["sar-2b"] + 0.5);
B.show("am0", S["sar-3"] + 1); B.show("am1", S["sar-3"] + 1.1); B.show("am2", S["sar-3"] + 1.2); B.show("am3", S["sar-3"] + 1.3);
B.hideUnits(["am0", "am1", "am2", "am3"], S["sar-7"] - 0.2);
if (HAS.gates) B.portraitStake({ img: "assets/media/gates_head.png", flag: US_FLAG, name: "GATES", x: 1500, y: 1575, size: 1.0, t: T_GATES, until: S["sar-2b"] });
else B.plaque({ name: "MAJ. GEN. HORATIO GATES", role: "American commander", side: "carth", x: 1250, y: 1560, t: T_GATES, until: T_500 + 1.5 });
B.unit({ id: "morgan", side: "carth", kind: "light", x: 1000, y: 1010, w: 84, h: 50, label: "MORGAN'S RIFLE CORPS · ~500", t: T_500 });
bigTags(["morgan"], 24);
if (HAS.morgan) B.portraitStake({ img: "assets/media/morgan_head.png", flag: US_FLAG, name: "MORGAN", x: 755, y: 1150, size: 0.95, t: T_500 + 2.0, until: S["sar-2b"] + 0.3 });
else B.plaque({ name: "COL. DANIEL MORGAN", role: "Rifle Corps", side: "carth", x: 480, y: 1230, t: T_500 + 2.0, until: S["sar-2b"] + 0.3 });
B.caption("FRONTIERSMEN · LONG RIFLES", at("sar-2", "most of them frontiersmen"), T_MORGAN - 0.2, "carth");
B.hideUnits(["morgan"], S["sar-2b"] + 0.3);

// ---------- sar-2b: range rings close-up (to scale: 3.49 m/px) ----------
const RC = [800, 1000], YD = 0.9144 / 3.49; // px per yard
const R80 = 80 * YD, R200 = 200 * YD, R300 = 300 * YD;
const tR = S["sar-2b"] + 1.6;
dot(RC[0], RC[1], { id: "rifle", r: 6, fill: "var(--carth)", bw: 2, t: tR - 0.6, until: S["sar-3"] });
const ringBand = svgG(`<path fill-rule="evenodd" fill="rgba(31,79,196,0.30)" d="M ${RC[0] - R300} ${RC[1]} a ${R300} ${R300} 0 1 0 ${2 * R300} 0 a ${R300} ${R300} 0 1 0 ${-2 * R300} 0 Z M ${RC[0] - R200} ${RC[1]} a ${R200} ${R200} 0 1 0 ${2 * R200} 0 a ${R200} ${R200} 0 1 0 ${-2 * R200} 0 Z"/>`);
fadeIn(ringBand, T_HIT, 0.8); fadeOut(ringBand, S["sar-3"]);
ring(RC[0], RC[1], R80, { color: "#e3232f", w: 2.2, fill: "rgba(196,18,31,0.22)", t: tR, until: S["sar-3"] });
ring(RC[0], RC[1], R200, { color: "var(--carth)", w: 1.6, dash: "5 4", t: T_HIT - 0.2, until: S["sar-3"] });
ring(RC[0], RC[1], R300, { color: "var(--carth)", w: 2.4, t: T_HIT - 0.2, until: S["sar-3"] });
tag("MUSKET · ~80 YDS", RC[0] - R80 - 5, RC[1] - 9, tR + 0.6, S["sar-3"], { size: 11, bg: "#b3121c", ax: -100 });
tag("LONG RIFLE · 200–300 YDS", RC[0], RC[1] - R300 - 22, T_HIT + 0.3, S["sar-3"], { size: 11, bg: "#1f4fc4" });
// a redcoat at ~250 yards: a rifle can hit him, a musket cannot
dot(RC[0] + 250 * YD * 0.8, RC[1] - 250 * YD * 0.6, { id: "rcoat", r: 5, fill: "var(--rome)", bw: 1.5, t: T_HIT, until: S["sar-3"] });
fire(RC[0], RC[1], RC[0] + 250 * YD * 0.8, RC[1] - 250 * YD * 0.6, T_HIT + 1.0, 2, 1.1, 1.2);
B.caption("SLOW TO LOAD · NO BAYONET", T_LOAD, T_HIT - 0.3, "rome");
B.caption("DEADLY AT 200–300 YARDS", T_HIT + 0.2, S["sar-3"] - 0.2, "carth");

// ---------- sar-3: three British columns through the woods ----------
const COLS = {
  fr: { path: [[1300, 40], [1080, 120], [900, 250], [850, 420]], name: "FRASER" },
  ha: { path: [[1620, 60], [1470, 200], [1330, 330], [1225, 440]], name: "HAMILTON · BURGOYNE" },
  ri: { path: [[2150, -20], [2110, 250], [2020, 470], [1920, 640], [1880, 780]], name: "RIEDESEL" },
};
const tC = S["sar-3"] + 0.2;
Object.entries(COLS).forEach(([k, c], ci) => {
  B.arrow({ side: "rome", pts: c.path, width: 14, t: tC + ci * 0.5, dur: 2.6, until: S["sar-4"] + 1.5 });
  for (let j = 0; j < 3; j++) {
    const id = `${k}${j}`;
    B.unit({ id, side: "rome", kind: "inf", x: c.path[0][0], y: c.path[0][1], w: 46, h: 30, label: j === 0 ? c.name : null, t: tC + 0.4 + ci * 0.5 + j * 0.5 });
    // end positions: file along the last leg, lead unit at the arrow tip
    const n = c.path.length, [ex, ey] = c.path[n - 1], [px, py] = c.path[n - 2], L = Math.hypot(ex - px, ey - py);
    const end = [ex - (ex - px) / L * 58 * j, ey - (ey - py) / L * 58 * j];
    follow(id, [...c.path.slice(0, n - 1), end], tC + 0.6 + ci * 0.5 + j * 0.5, 7.5 - j * 0.4, "none");
  }
  bigTags([`${k}0`], 26);
});
B.caption("THE BRITISH WAY: LINES · VOLLEYS · BAYONETS", T_LINES - 0.3, T_IRREG + 2.5, "rome");
B.hideUnits(["ri0", "ri1", "ri2"], S["sar-5"]);
B.hideUnits(["fr0", "fr1", "fr2"], S["sar-5"] - 0.5);
B.dateBox(S["sar-3"] - 0.3, null, S["sar-5"] - 0.4);

// ---------- sar-4: Morgan's corps breaks into scattered riflemen; officers targeted ----------
B.unit({ id: "morgan2", side: "carth", kind: "light", x: 1060, y: 1080, w: 84, h: 50, label: "MORGAN", t: S["sar-3"] + 1.5 });
bigTags(["morgan2"], 24);
B.move("morgan2", S["sar-4"] + 0.2, 2.2, 1160, 720);
B.hideUnits(["morgan2"], T_CROWD - 0.3, 0.3);
const rr = rng(1777), RIF = [];
for (let i = 0; i < 24; i++) {
  const x = 1000 + (i % 8) * 42 + (rr() - 0.5) * 30, y = 665 + Math.floor(i / 8) * 34 + (rr() - 0.5) * 22;
  RIF.push([x, y]);
  dot(1160, 720, { id: "rf" + i, r: 7, fill: "var(--carth)", bw: 2, t: T_CROWD - 0.4 + i * 0.02 });
  B.move("rf" + i, T_CROWD - 0.3 + i * 0.02, 1.4, x, y, "power2.out");
}
B.label("RIFLEMEN IN THE WOODS", 1170, 800, { cls: "tg", size: 26, t: T_CROWD + 0.8, until: T_OFFIC + 0.3, anchor: [-50, 0] });
// advance pickets and their officers (the head of the centre column)
const PICK = [[1085, 565], [1145, 552], [1205, 560], [1262, 575]];
PICK.forEach(([x, y], i) => B.unit({ id: "pk" + i, side: "rome", kind: "inf", x, y, w: 40, h: 26, t: S["sar-4"] + 1.5 + i * 0.15 }));
const OFF = PICK.map(([x, y]) => [x + 4, y + 30]);
OFF.forEach(([x, y], i) => dot(x, y, { id: "of" + i, r: 7, fill: "#c4121f", stroke: "#ffd34d", bw: 3, t: T_OFFIC + i * 0.15 }));
const COLOFF = [[1180, 420], [1222, 378]];
COLOFF.forEach(([x, y], i) => dot(x, y, { id: "co" + i, r: 7, fill: "#c4121f", stroke: "#ffd34d", bw: 3, t: T_OFFIC + 0.6 + i * 0.15, until: T_CHASE + 1.0 }));
const TGT = OFF.map(([x, y], i) => target(x, y, T_OFFIC + 0.8 + i * 0.3, T_EVERY + 0.2 + i * 0.35));
COLOFF.forEach(([x, y], i) => target(x, y, T_OFFIC + 2.0 + i * 0.3, T_MACHINE + 3.0));
B.caption("THE TARGETS: THE OFFICERS", T_OFFIC + 0.5, T_MACHINE + 0.2, "carth");
B.caption("NO OFFICERS · NO ORDERS", T_MACHINE + 0.4, B.end("sar-4") + 0.3, "carth");

// ---------- sar-5: 19 September, Freeman's Farm ----------
B.date("19 SEPTEMBER 1777", S["sar-5"] - 0.1, S["sar-7"] - 0.3, 36);
const clearing = svgG(`<ellipse cx="${FF[0]}" cy="${FF[1]}" rx="150" ry="62" fill="rgba(240,220,150,0.38)" stroke="#f7f3ea" stroke-width="4" stroke-dasharray="12 7"/>`);
fadeIn(clearing, T_FF - 0.3, 0.8); fadeOut(clearing, S["sar-7"] - 0.2);
tl.fromTo(clearing.firstChild, { attr: { "stroke-width": 4 } }, { attr: { "stroke-width": 9 }, duration: 0.5, yoyo: true, repeat: 3 }, T_FF);
B.label("FREEMAN'S FARM", FF[0] - 170, FF[1] - 48, { cls: "tg", size: 30, t: T_FF - 0.2, until: S["sar-7"] - 0.2, anchor: [-100, -50] });
// volleys from the woods at the pickets and officers
RIF.forEach(([x, y], i) => {
  const tg = OFF[i % 4], p = PICK[(i + 1) % 4];
  fire(x, y, ...(i % 3 === 2 ? p : tg), T_STRUCK + 0.2 + (i % 8) * 0.18, 3, 0.95 + (i % 5) * 0.08, 2.2);
});
OFF.forEach(([x, y], i) => { crossOut(x, y, T_EVERY + 0.2 + i * 0.35, S["sar-6"] + 0.5); tl.to(B.units["of" + i].el, { backgroundColor: "#77746c", duration: 0.3 }, T_EVERY + 0.2 + i * 0.35); B.hideUnits(["of" + i], S["sar-6"] + 0.5); });
B.caption("NEARLY EVERY OFFICER HIT", T_EVERY + 0.6, B.end("sar-5") + 0.2, "carth");
PICK.forEach(([x, y], i) => { B.move("pk" + i, T_RAN + i * 0.1, 1.6, 1190 + i * 18, 470 - i * 6, "power2.in"); B.hideUnits(["pk" + i], T_RAN + 1.7); });

// ---------- sar-6: pursuit, scatter, turkey call, back and forth ----------
// main British column deploys in line north of the clearing
const RLINE = [[1040, 470], [1120, 455], [1200, 450], [1280, 460], [1360, 475]];
RLINE.forEach(([x, y], i) => B.unit({ id: "rl" + i, side: "rome", kind: "inf", x, y: y - 20, w: 60, h: 34, t: T_CHASE + 0.8 + i * 0.12 }));
B.hideUnits(["ha0", "ha1", "ha2"], T_CHASE + 1.2);
RIF.forEach(([x, y], i) => B.move("rf" + i, T_CHASE + (i % 8) * 0.05, 2.4, x + 30, y - 175 - (i % 3) * 12, "power1.in"));
const rs = rng(19);
RIF.forEach(([x, y], i) => B.move("rf" + i, T_SCAT, 1.2, 930 + rs() * 480, 520 + rs() * 220, "power2.out"));
B.caption("CAUGHT BY THE MAIN COLUMN · SCATTERED", T_MAIN, T_TURKEY - 0.3, "rome");
B.bubble("GOBBLE-OBBLE-OBBLE!", 1250, 740, T_TURKEY, T_SURGE - 0.3);
B.caption("TURKEY CALL: MORGAN RALLIES HIS MEN", T_TURKEY + 0.2, T_SURGE - 0.2, "carth");
// regroup at the southern edge of the clearing
RIF.forEach(([x, y], i) => B.move("rf" + i, T_TURKEY + 0.5 + (i % 6) * 0.08, 1.6, 1010 + (i % 12) * 26, 650 + Math.floor(i / 12) * 26 + (i % 2) * 8));
// American brigades arrive and the fight surges across the clearing
[[1090, 710], [1230, 715]].forEach(([x, y], i) => B.unit({ id: "ab" + i, side: "carth", kind: "inf", x, y: y + 20, w: 60, h: 34, t: T_SURGE - 1.5 + i * 0.2 }));
const SW = [[0, 0], [0, 70], [0, -10], [0, 60], [0, 5]];
const tS = T_SURGE + 0.3;
for (let k = 1; k < SW.length; k++) {
  const t0 = tS + (k - 1) * 1.9;
  RLINE.forEach(([x, y], i) => B.move("rl" + i, t0, 1.6, x, y - 20 + SW[k][1], "sine.inOut"));
  RIF.forEach((_, i) => B.move("rf" + i, t0, 1.6, 1010 + (i % 12) * 26, 650 + Math.floor(i / 12) * 26 + (i % 2) * 8 + SW[k][1] * 0.8, "sine.inOut"));
  [[1090, 710], [1230, 715]].forEach(([x, y], i) => B.move("ab" + i, t0, 1.6, x, y + 20 + SW[k][1] * 0.8, "sine.inOut"));
  const down = SW[k][1] > SW[k - 1][1];
  B.arrow({ side: down ? "rome" : "carth", pts: down ? [[1180, 505], [1180, 575]] : [[1180, 650], [1180, 580]], width: 12, t: t0, dur: 0.9, until: t0 + 1.8 });
}
B.stat(["19 SEPTEMBER · BRITISH HOLD THE FIELD", "BRITISH ~600 LOST · AMERICANS ~300"], T_NIGHT + 0.3, B.end("sar-6") + 0.2, "rome");
B.hideUnits([...RIF.map((_, i) => "rf" + i), ...RLINE.map((_, i) => "rl" + i), "ab0", "ab1"], S["sar-7"] - 0.3);

// ---------- sar-7: 7 October, Barber wheatfield ----------
B.date("7 OCTOBER 1777", S["sar-7"] + 0.2, S["sar-9"] + 12, 36);
const rB = redoubt(BALC[0], BALC[1], "BALCARRES REDOUBT", "rome", S["sar-7"] + 0.8, { lx: 185, ly: -12, until: S["sar-10"] });
const rY = redoubt(BREY[0], BREY[1], "BREYMANN REDOUBT", "rome", S["sar-7"] + 1.1, { lx: -30, ly: -84, pts: [[-40, -26], [36, -30], [40, 24], [-36, 28]], until: S["sar-10"] });
const rG = redoubt(GREAT[0], GREAT[1], "GREAT REDOUBT", "rome", S["sar-7"] + 1.4, { lx: -10, ly: 48, until: S["sar-10"] });
B.front({ pts: AMLINE, color: "var(--carth)", width: 9, t: S["sar-7"] + 0.5, dur: 1.4, until: S["sar-10"] });
[[1180, 1265], [1420, 1305]].forEach(([x, y], i) => B.unit({ id: "amo" + i, side: "carth", kind: "inf", x, y, w: 64, h: 40, t: S["sar-7"] + 0.8 + i * 0.2 }));
const WHEAT = svgG(`<polygon points="${[[-190, -52], [170, -70], [200, 40], [-150, 62]].map(([a, b]) => `${BARBER[0] + a},${BARBER[1] + b}`).join(" ")}" fill="rgba(228,196,92,0.42)" stroke="#e9d27a" stroke-width="4" stroke-dasharray="10 6"/>`);
fadeIn(WHEAT, at("sar-7", "Burgoyne tried again"), 0.8); fadeOut(WHEAT, S["sar-10"]);
B.label("BARBER WHEATFIELD", BARBER[0], BARBER[1] + 80, { cls: "tg", size: 28, t: at("sar-7", "Burgoyne tried again"), until: S["sar-8"], anchor: [-50, 0] });
const RECON = [[880, 718], [950, 706], [1020, 700], [1090, 705], [1160, 716]];
RECON.forEach(([x, y], i) => {
  B.unit({ id: "rc" + i, side: "rome", kind: "inf", x: BALC[0] - 60 + i * 16, y: BALC[1] + 40, w: 56, h: 32, label: i === 2 ? "~1,500" : null, t: T_1500 - 1.0 + i * 0.12 });
  B.move("rc" + i, T_1500 - 0.6 + i * 0.12, 2.6, x, y, "power1.inOut");
});
bigTags(["rc2"], 24);
B.caption("RECONNAISSANCE IN FORCE · ~1,500 MEN", T_1500 + 0.4, T_LEFT - 0.3, "rome");
// other brigades hit the British left (east end)
const poorArr = B.arrow({ side: "carth", pts: [[1330, 1140], [1300, 950], [1225, 790], [1180, 735]], width: 20, t: T_LEFT - 0.2, dur: 2.2, until: S["sar-9"] + 3 });
B.label("POOR · LEARNED", 1330, 900, { cls: "tg", size: 26, t: T_LEFT + 0.6, until: S["sar-8"] + 1, anchor: [0, -50] });
// Morgan: long hook west through the woods onto the British right
B.unit({ id: "morgan3", side: "carth", kind: "light", x: 930, y: 1070, w: 70, h: 42, label: "MORGAN", t: S["sar-7"] + 1.2 });
bigTags(["morgan3"], 24);
const HOOK = [[900, 1040], [740, 990], [620, 860], [630, 720], [720, 650], [815, 690]];
const hookArr = B.arrow({ side: "carth", pts: HOOK, width: 20, t: T_WEST - 0.2, dur: 3.4, until: S["sar-9"] + 3 });
follow("morgan3", [[930, 1070], [760, 1010], [650, 880], [650, 760], [700, 690]], T_WEST, 3.6, "power1.inOut");
B.caption("MORGAN HITS THE RIGHT FLANK", T_WEST + 2.2, B.end("sar-7") + 0.3, "carth");

// ---------- sar-8: Fraser and Murphy ----------
RECON.forEach(([x, y], i) => B.move("rc" + i, T_GIVE, 1.4, x + (i < 2 ? 25 : 0), y - (i < 2 ? 30 : 12), "sine.inOut"));
tl.to([poorArr, hookArr], { opacity: 0.35, duration: 0.8 }, T_GIVE);
const FR0 = [1010, 650];
let frEl;
if (HAS.fraser) frEl = B.portraitStake({ img: "assets/media/fraser_head.png", flag: GB_FLAG, name: "FRASER", x: FR0[0], y: FR0[1], size: 0.62, t: T_RALLY - 0.8, until: S["sar-9"] + 2 });
else frEl = B.plaque({ name: "BRIG. GEN. SIMON FRASER", role: "Burgoyne's best field commander", side: "rome", x: FR0[0], y: FR0[1], t: T_RALLY - 0.8, until: S["sar-9"] + 2 });
if (HAS.fraser) { frEl.querySelector(".face").style.boxShadow = "0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5)"; frEl.querySelector(".nm").style.background = "#c4121f"; }
else { frEl.style.transformOrigin = "19px 240px"; frEl.style.scale = "0.72"; }
// riding back and forth along the line
dot(FR0[0], FR0[1], { id: "fraserDot", r: 8, fill: "#c4121f", stroke: "#ffd34d", bw: 3, t: T_RALLY - 0.6, until: S["sar-9"] + 2 });
tl.to([frEl, B.units.fraserDot.el], { x: 120, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: 3 }, T_RALLY);
const MUR = [835, 812];
tree(MUR[0], MUR[1], T_TREE - 0.6, S["sar-9"] + 2);
B.label("MURPHY", MUR[0], MUR[1] + 26, { cls: "tg", size: 22, t: T_MURPHY, until: S["sar-9"] + 2, anchor: [-50, 0] });
dot(MUR[0], MUR[1] - 24, { id: "murphy", r: 5, fill: "var(--carth)", bw: 1.5, t: T_TREE, until: S["sar-9"] + 2 });
tl.to(B.units.morgan3.el, { autoAlpha: 1 }, T_POINT);
B.bubble("THAT MAN!", 590, 600, T_POINT, T_MURPHY + 0.8);
// three shots: two misses, the third hits (Fraser at his resting position)
const fx0 = FR0[0], fy0 = FR0[1];
fire(MUR[0], MUR[1] - 24, fx0 + 40, fy0 - 30, T_3RD - 3.0, 1, 1, 2);
fire(MUR[0], MUR[1] - 24, fx0 - 30, fy0 + 20, T_3RD - 1.6, 1, 1, 2);
fire(MUR[0], MUR[1] - 24, fx0, fy0, T_3RD + 0.2, 1, 1, 3);
tag("MORTALLY WOUNDED", FR0[0] + 18, FR0[1] - 46, T_MORT - 0.3, S["sar-9"] + 2, { size: 24, ax: 0 });
crossOut(fx0, fy0, T_FELL, S["sar-9"] + 2, 16);

// ---------- sar-9: collapse, redoubt stormed, retreat, surrender ----------
RECON.forEach(([x, y], i) => B.move("rc" + i, T_COLL + i * 0.1, 2.4, i < 3 ? BREY[0] - 60 + i * 62 : BALC[0] - 32 + (i - 3) * 64, i < 3 ? BREY[1] + 70 : BALC[1] + 70, "power2.in"));
B.hideUnits(RECON.map((_, i) => "rc" + i), T_STORM + 1.5);
B.arrow({ side: "carth", pts: [[1000, 820], [1060, 720], [1120, 660]], width: 18, t: T_CHASE9 - 0.4, dur: 1.6, until: B.end("sar-9") });
B.arrow({ side: "carth", pts: [[760, 640], [880, 520], [1005, 462]], width: 20, t: T_STORM - 0.3, dur: 1.5, until: B.end("sar-9") });
tl.to(rY.poly, { attr: { stroke: "#1f4fc4", fill: "rgba(31,79,196,0.3)" }, duration: 0.6 }, T_STORM + 1.2);
tag("STORMED", BREY[0], BREY[1] + 40, T_STORM + 1.2, S["sar-10"], { bg: "#1f4fc4", size: 22 });
B.move("morgan3", T_CHASE9, 2.5, 870, 560, "power1.inOut");
B.hideUnits(["morgan3", "amo0", "amo1"], S["sar-10"]);
B.arrow({ side: "rome", pts: [[1330, 530], [1600, 390], [1860, 260], [2060, 120], [2150, -40]], width: 22, t: T_RETREAT - 0.2, dur: 2.6, until: S["sar-10"] + 0.2 });
B.label("TO SARATOGA ▲", 2210, 120, { cls: "tg", size: 36, t: T_RETREAT + 1.2, until: S["sar-10"] + 0.2, anchor: [0, -50] });
B.date("17 OCTOBER 1777", T_SURR - 0.3, null, 36);
B.stat(["17 OCTOBER 1777", "~6,000 BRITISH SURRENDER"], T_SURR + 0.6, S["sar-10"] - 0.1, "carth");

// ---------- sar-10: the method (only the first part so far) ----------
B.dim(S["sar-10"] - 0.2, END + 1, 0.8);
B.method(T_M1 - 0.6, null, { rowT: [T_M1 - 0.1, T_M2 - 0.1, T_M3 - 0.1], dim: [1, 2] });
tl.to(".card.method .row:first-child", { color: "#ffd34d", duration: 0.6 }, T_ONLY);
B.finish();
