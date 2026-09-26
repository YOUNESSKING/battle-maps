// Move 1 · Chickamauga (2): the main battlefield, 19-20 Sept 1863. chick-3 … chick-9.
// Sept 19 fighting, Kelly Field breastworks, Wood's gap, Longstreet's breakthrough, Horseshoe Ridge, Steedman.
// Union = blue ("carth"), Confederate = red ("rome"). Basemap chick (z15, 3.92 m/px).
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const NSVG = "http://www.w3.org/2000/svg";
const OVL = document.getElementById("overlay"), PINS = document.getElementById("pins");

// ---------- projection (assets/chick.json: zoom 15, origin 2206115, 3323946) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 15, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 2206115).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 3323946).toFixed(1)];
};
const GL = (a) => a.map(([la, lo]) => G(la, lo));

// portraits available in assets/media (checked by hand before the final build)
const HAS = { thomas: true, rosecrans: true, bragg: true, longstreet: true, steedman: true, wood: true };
const US = "assets/media/us_flag_35star.png", CSA = "assets/media/csa_battle_flag.png";

// ---------- local helpers ----------
const svgG = (html, before) => { const g = document.createElementNS(NSVG, "g"); g.innerHTML = html; if (before) OVL.insertBefore(g, before); else OVL.appendChild(g); gsap.set(g, { autoAlpha: 0 }); return g; };
const fadeIn = (el, t, d = 0.5, a = 1) => tl.to(el, { autoAlpha: a, duration: d }, t);
const fadeOut = (el, t, d = 0.5) => tl.to(el, { autoAlpha: 0, duration: d }, t);
const U = (o) => {
  const el = B.unit(o);
  const tg = el.querySelector(".tag");
  if (tg) Object.assign(tg.style, { fontSize: (o.fs || 17) + "px", padding: "0 6px", marginTop: "3px" });
  return el;
};
// portrait stake (or plaque when the portrait is missing); o.side "rome" recolours the ring and name
const STK = (key, name, x, y, t, o = {}) => {
  let el;
  if (HAS[key]) {
    el = B.portraitStake({ img: `assets/media/${key}_head.png`, flag: o.side === "rome" ? CSA : US, name, x, y, size: o.size || 0.8, t, until: o.until });
    const nm = el.querySelector(".nm");
    if (nm) nm.style.fontSize = (o.fs || 15) + "px";
    if (o.side === "rome") { el.querySelector(".face").style.boxShadow = "0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5)"; if (nm) nm.style.background = "#c4121f"; }
  } else {
    el = B.plaque({ name, role: o.role, side: o.side || "carth", x, y, t, until: o.until });
    el.style.transformOrigin = "19px 240px"; el.style.scale = String(o.psc || 0.55);
  }
  el._foot = [x, y];
  return el;
};
const slide = (el, t, dur, x, y, ease = "power1.inOut") => {
  const w = parseFloat(el.style.width) || 38, h = parseFloat(el.style.height) || 240;
  const dx = el.classList.contains("gstake") ? w / 2 : 19;
  tl.to(el, { left: x - dx, top: y - h, duration: dur, ease }, t);
};
// muzzle flashes (world coords)
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
// move along a polyline
function follow(id, pts, t, dur, ease = "none") {
  const L = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = L.reduce((a, b) => a + b, 0);
  let tt = t;
  pts.slice(1).forEach((p, i) => { const d = dur * L[i] / tot; B.move(id, tt, d, p[0], p[1], i === 0 ? "power1.in" : i === pts.length - 2 ? "power1.out" : "none"); tt += d; });
}
// pulse ring around a point (world)
const pulse = (x, y, t, r = 50, color = "#f2c14e", reps = 2) => {
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;border:6px solid ${color};box-shadow:0 0 18px ${color}`;
  PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  for (let k = 0; k < reps; k++) {
    tl.fromTo(el, { autoAlpha: 1, scale: 0.4 }, { autoAlpha: 0, scale: 1.3, duration: 1.2, ease: "power2.out", immediateRender: false }, t + k * 1.0);
  }
};
// small world text tag
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

// ---------- times ----------
const S3 = P("chick-3"), T_PLAN = at("chick-3", "His plan"), T_CUT = at("chick-3", "cut the road"), T_TRAP = at("chick-3", "trap the whole");
const T_FIGHT = at("chick-3", "The fighting that day"), T_WOODS = at("chick-3", "in woods so dense"), T_THOM = at("chick-3", "Thomas's corps held");
const T_ROADHOME = at("chick-3", "covering the road home");
const S4 = P("chick-4"), T_LOGS = at("chick-4", "built breastworks"), T_MORN = at("chick-4", "The next morning"), T_AGAIN = at("chick-4", "again and again");
const T_REINF = at("chick-4", "Thomas kept sending"), T_SHIFT = at("chick-4", "Rosecrans kept shifting");
const S5 = P("chick-5"), T_ORDER = at("chick-5", "Rosecrans sent an order"), T_TWOOD = at("chick-5", "Thomas Wood"), T_NOT = at("chick-5", "But the division he named");
const T_BETW = at("chick-5", "Another one stood"), T_OBEY = at("chick-5", "Wood obeyed"), T_GAP = at("chick-5", "leaving a gap"), T_HIT = at("chick-5", "Minutes later");
const S6 = P("chick-6"), T_POUR = at("chick-6", "His men poured"), T_WHEEL = at("chick-6", "wheeled to the right"), T_THIRD = at("chick-6", "A third of the Union");
const T_ROSE = at("chick-6", "Rosecrans and two"), T_12 = at("chick-6", "twelve miles"), T_LOST = at("chick-6", "As far as they knew");
const S7 = P("chick-7"), T_BELIEF = at("chick-7", "The Union right was gone"), T_SWING = at("chick-7", "All that remained"), T_CRUSH = at("chick-7", "crush Thomas");
const S8 = P("chick-8"), T_SPUR = at("chick-8", "Just behind"), T_HSR = at("chick-8", "Horseshoe Ridge"), T_SNOD = at("chick-8", "Snodgrass");
const T_REAL = at("chick-8", "Thomas realised"), T_HOLD = at("chick-8", "If he could hold"), T_ROUT = at("chick-8", "turn a rout"), T_GATH = at("chick-8", "So he gathered");
const S9 = P("chick-9"), T_BACK = at("chick-9", "Each time"), T_DANGER = at("chick-9", "At the most dangerous"), T_AROUND = at("chick-9", "worked their way around");
const T_STEED = at("chick-9", "a reserve division"), T_NOORD = at("chick-9", "without orders"), T_FILL = at("chick-9", "filled the gap"), T_BAYO = at("chick-9", "Some regiments");

// ---------- geography ----------
const ROAD = GL([[34.884, -85.2650], [34.8910, -85.2655], [34.8990, -85.2640], [34.9050, -85.2625], [34.9140, -85.2605], [34.9225, -85.2585],
  [34.9300, -85.2583], [34.9370, -85.2590], [34.9420, -85.2598], [34.9512, -85.2590], [34.9570, -85.2590], [34.9640, -85.2625], [34.9720, -85.2700]]);
const DRYV = [[1440, 1000], [1330, 960], [1190, 930], [1040, 915], [910, 895], [820, 760], [740, 560], [680, 400], [648, 327], [610, 180], [590, -20]];
const CREEK = [[1988, 1678], [1979, 1637], [2057, 1569], [2111, 1556], [2133, 1535], [2116, 1518], [2055, 1511], [2037, 1522], [2023, 1553], [2011, 1556], [1995, 1507], [1946, 1491], [1919, 1444], [1913, 1423], [1931, 1387], [1981, 1374], [2013, 1393], [2059, 1402], [2080, 1400], [2103, 1386], [2124, 1400], [2131, 1416], [2200, 1413], [2343, 1305], [2419, 1265], [2473, 1220], [2516, 1211], [2557, 1145], [2583, 1143], [2605, 1152], [2615, 1144], [2612, 1067], [2594, 1028], [2562, 995], [2490, 934], [2398, 920], [2346, 886], [2330, 861], [2294, 857], [2282, 837], [2324, 789], [2394, 767], [2467, 766], [2476, 751], [2475, 678], [2438, 591], [2398, 542], [2340, 520], [2313, 493], [2320, 445], [2330, 433], [2345, 430], [2392, 460], [2430, 427], [2451, 390], [2439, 362], [2390, 343], [2386, 332], [2392, 323], [2414, 313], [2442, 315], [2507, 347], [2546, 342], [2582, 457], [2604, 487], [2643, 502], [2672, 483], [2657, 459], [2620, 425], [2595, 376], [2602, 336], [2645, 323], [2620, 294], [2634, 256], [2633, 229], [2592, 185], [2590, 172], [2596, 160], [2609, 158], [2644, 175], [2656, 173], [2651, 133], [2640, 113], [2662, 96], [2667, 81], [2658, 57], [2616, 32], [2613, 22], [2623, 11], [2680, -9], [2753, -10], [2761, -40]];
const KELLY = G(34.9360, -85.2565), BROTH = G(34.9230, -85.2585), POE = G(34.9290, -85.2575), DYER = G(34.9212, -85.2640), VIN = G(34.9050, -85.2625);
const SNOD = G(34.9295, -85.2690), MCF = [648, 327], REED = G(34.9298, -85.2178), ALEX = G(34.9068, -85.2296), JAY = G(34.9337, -85.2290);
// Horseshoe Ridge (spur west of Snodgrass Hill), west end = the Union right
const RIDGE = [[1300, 768], [1250, 812], [1185, 836], [1125, 856], [1062, 852], [1018, 822]];

// woods texture everywhere, with the farm clearings cut out
const rectLL = (la0, lo0, la1, lo1) => { const [x0, y0] = G(la1, lo0), [x1, y1] = G(la0, lo1); return [x0, y0, x1 - x0, y1 - y0]; };
const FIELDS = [
  rectLL(34.9335, -85.2600, 34.9395, -85.2540), // Kelly
  rectLL(34.9270, -85.2600, 34.9310, -85.2555), // Poe
  rectLL(34.9215, -85.2600, 34.9245, -85.2565), // Brotherton
  rectLL(34.9185, -85.2690, 34.9240, -85.2605), // Dyer
  rectLL(34.9020, -85.2665, 34.9075, -85.2590), // Viniard
  rectLL(34.9360, -85.2500, 34.9390, -85.2455), // Winfrey
  rectLL(34.9295, -85.2505, 34.9325, -85.2460), // Brock
  rectLL(34.9280, -85.2715, 34.9310, -85.2670), // Snodgrass
  rectLL(34.9065, -85.2745, 34.9105, -85.2695), // Glenn
  rectLL(34.9480, -85.2625, 34.9560, -85.2560), // McDonald / Cloud Church
];
OVL.insertAdjacentHTML("afterbegin", `<defs><pattern id="trees" width="40" height="36" patternUnits="userSpaceOnUse">
  <circle cx="10" cy="10" r="8" fill="rgba(58,78,40,0.17)"/><circle cx="30" cy="27" r="7.5" fill="rgba(58,78,40,0.15)"/><circle cx="30" cy="6" r="4.5" fill="rgba(58,78,40,0.11)"/></pattern>
  <mask id="clear"><rect x="0" y="0" width="2880" height="1620" fill="#fff"/>${FIELDS.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#000"/>`).join("")}</mask></defs>
  <g id="woods" mask="url(#clear)"><rect x="0" y="0" width="2880" height="1620" fill="rgba(86,104,58,0.10)"/><rect x="0" y="0" width="2880" height="1620" fill="url(#trees)"/></g>
  <g id="fields">${FIELDS.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="rgba(226,205,140,0.35)" stroke="rgba(120,96,50,0.55)" stroke-width="3" stroke-dasharray="8 6"/>`).join("")}</g>`);
const roadPath = (pts, w = 1) => {
  const d = "M " + pts.map((p) => p.join(" ")).join(" L ");
  const g = document.createElementNS(NSVG, "g");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(92,66,38,0.75)" stroke-width="${14 * w}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#e2d0a4" stroke-width="${7 * w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  OVL.insertBefore(g, document.getElementById("fields").nextSibling);
  return g;
};
const roadG = roadPath(ROAD);
roadPath(DRYV, 0.8);
OVL.insertBefore(B.river(CREEK, 16), document.getElementById("fields").nextSibling);
// farm houses
const house = (x, y) => { const h = document.createElement("div"); h.style.cssText = `position:absolute;left:${x - 9}px;top:${y - 9}px;width:18px;height:18px;background:#5a3d22;border:3px solid #f3eee2;box-shadow:0 2px 5px rgba(0,0,0,.5)`; PINS.appendChild(h); return h; };
house(...G(34.9365, -85.2585)); house(...G(34.9232, -85.2592)); house(...G(34.9296, -85.2688)); house(...G(34.9290, -85.2590));

B.label("WEST CHICKAMAUGA CREEK", 2395, 1080, { cls: "river", size: 30, rot: -52, instant: true, anchor: [-50, -50] });
LAB("LAFAYETTE ROAD", 1600, 1330, 0.2, { size: 28, rot: -78 });
LAB("TO CHATTANOOGA ▲", 1700, 250, 0.4, { size: 30 });
LAB("KELLY FIELD", 1625, 615, 0.6, { size: 24 });
LAB("BROTHERTON", BROTH[0] + 60, BROTH[1] + 2, 0.7, { size: 18, until: S5 - 0.2 });
LAB("POE FIELD", POE[0] - 90, POE[1] - 2, 0.7, { size: 18, until: S4 });
LAB("DYER FIELD", 1395, 952, 0.8, { size: 22 });
LAB("VINIARD FIELD", VIN[0] + 110, VIN[1] + 40, 0.8, { size: 26 });
LAB("REED'S BRIDGE", REED[0] + 60, REED[1] - 46, 0.9, { size: 26 });
LAB("ALEXANDER'S BRIDGE", ALEX[0] + 30, ALEX[1] + 46, 0.9, { size: 26 });
LAB("DENSE WOODS", 2000, 1000, 1.0, { size: 32, until: T_THOM });
LAB("DRY VALLEY ROAD", 830, 690, 1.0, { size: 24, rot: -62 });
B.label("McFARLAND'S GAP", MCF[0] + 30, MCF[1], { cls: "tg", size: 30, t: 1.2, anchor: [0, -50] });
B.label("MISSIONARY RIDGE", 250, 420, { cls: "tg", size: 30, t: 1.2, rot: -52, anchor: [-50, -50] });
// state of the camera
B.camera([
  [0, 1800, 860, 0.8],
  [T_PLAN, 1860, 800, 0.85],
  [T_FIGHT, 1780, 900, 0.95],
  [T_THOM - 1, 1650, 740, 1.05],
  [S4 + 0.8, 1640, 640, 1.5],
  [T_AGAIN, 1680, 620, 1.55],
  [T_REINF + 0.5, 1560, 780, 1.25],
  [S5 + 0.4, 1520, 860, 1.6],
  [T_BETW, 1540, 880, 1.8],
  [T_GAP, 1570, 930, 1.9],
  [T_HIT + 0.5, 1580, 930, 1.75],
  [T_WHEEL, 1420, 900, 1.3],
  [T_ROSE + 0.5, 1060, 660, 1.0],
  [T_LOST + 1, 1080, 680, 0.98],
  [S7 + 0.4, 1560, 600, 1.4],
  [T_SWING, 1560, 640, 1.35],
  [T_CRUSH + 0.3, 1520, 760, 1.0],
  [S8 + 0.3, 1480, 760, 1.05],
  [T_HSR + 0.5, 1170, 800, 1.75],
  [T_REAL, 1200, 790, 1.7],
  [T_HOLD + 1, 1380, 740, 1.2],
  [T_GATH, 1250, 800, 1.45],
  [S9 + 0.3, 1180, 850, 1.6],
  [T_DANGER, 1120, 830, 1.55],
  [T_STEED - 0.3, 1180, 560, 1.0],
  [T_FILL, 1130, 800, 1.5],
  [END, 1180, 810, 1.65],
]);

// ---------- chick-3: 19 September ----------
B.showDate(0.2);
B.date("19 SEPT 1863", 0.3, T_MORN - 0.1);
// Confederates crossed the creek on the 18th; on the 19th they push west
const RED19 = [["c1", REED[0] - 40, REED[1] + 70], ["c2", JAY[0] + 40, JAY[1] + 70], ["c3", ALEX[0] - 40, ALEX[1] - 30], ["c4", 2150, 1200], ["c5", 2050, 1400]];
RED19.forEach(([id, x, y], i) => U({ id, side: "rome", x, y, w: 60, h: 36, t: 0.3 + i * 0.15 }));
const bragg = STK("bragg", "BRAGG", 2230, 1150, 1.0, { side: "rome", size: 0.9, fs: 16 });
[[REED, [2280, 650]], [ALEX, [2120, 1250]], [[2000, 1470], [1880, 1330]]].forEach(([a, b], i) =>
  B.arrow({ side: "rome", pts: [[a[0] + 60, a[1]], b], width: 18, t: 1.2 + i * 0.25, dur: 1.2, until: T_FIGHT + 2 }));
// the plan: around the Union left, onto the road to Chattanooga
const planArrow = B.arrow({ side: "rome", pts: [[2300, 600], [2080, 440], [1850, 380], [1650, 380]], width: 26, t: T_PLAN + 0.8, dur: 2.2, until: T_WOODS });
B.highlight(GL([[34.9420, -85.2598], [34.9512, -85.2590], [34.9570, -85.2590], [34.9640, -85.2625], [34.9720, -85.2700]]), T_CUT - 0.2, T_WOODS, 48);
tag("CUT THE ROAD", 1560, 450, T_CUT, T_WOODS, { size: 24 });
B.caption("BRAGG'S PLAN: TURN THE UNION LEFT · CUT THE ROAD TO CHATTANOOGA", T_PLAN + 0.3, T_FIGHT - 0.2, "rome");
B.caption("TRAP THE ARMY IN THE MOUNTAINS", T_TRAP, T_FIGHT - 0.2, "rome").style.bottom = "190px";
// fighting in the woods: Union divisions fed in piecemeal from the south
RED19.forEach(([id], i) => B.move(id, T_FIGHT - 0.5 + i * 0.3, 5, ...[[1990, 520], [1920, 700], [1900, 880], [1830, 1050], [1760, 1260]][i]));
const FEED = [["vancleve", "VAN CLEVE", [1640, 1120]], ["davis", "DAVIS", [1640, 1240]], ["wood", "WOOD", [1700, 980]], ["sheridan", "SHERIDAN", [1590, 1380]]];
FEED.forEach(([id, label, p], i) => {
  U({ id, side: "carth", label, x: 1560 + i * 12, y: 1660, w: 60, h: 36, t: T_FIGHT + i * 1.5 });
  B.move(id, T_FIGHT + i * 1.5 + 0.1, 3.2, ...p, "power2.out");
});
flashes([[1840, 560], [1860, 700], [1800, 880], [1760, 1060], [1700, 1250], [1880, 620]], T_WOODS - 1, 4, 0.8, 22);
B.caption("SAVAGE, CONFUSED FIGHTING IN DENSE WOODS", T_FIGHT + 0.2, T_THOM - 0.2);
// Thomas's XIV Corps: the night march north to the Union left
const xiv = B.arrow({ side: "carth", pts: [[1100, 1640], [1150, 1350], [1330, 1050], [1480, 800], [1540, 600]], width: 26, t: T_FIGHT + 1.5, dur: 3.2, until: S4 + 1 });
LAB("XIV CORPS · NIGHT MARCH", 1180, 1180, T_FIGHT + 3.2, { size: 22, until: S4 + 1, rot: -58 });
const SAL = { baird: ["BAIRD", G(34.9398, -85.2565)], johnson: ["JOHNSON", G(34.9372, -85.2522)], palmer: ["PALMER", G(34.9335, -85.2520)], reynolds: ["REYNOLDS", G(34.9303, -85.2542)] };
Object.entries(SAL).forEach(([id, [label, p]], i) => U({ id, side: "carth", label, x: p[0], y: p[1], w: 60, h: 36, t: T_THOM + 0.2 + i * 0.25 }));
const thomas = STK("thomas", "THOMAS", 1470, 690, T_THOM - 0.1, { size: 1.0, fs: 17 });
B.caption("THOMAS HOLDS THE LEFT · THE ROAD HOME", T_THOM + 0.4, S4 - 0.2, "carth");
pulse(1600, 330, T_ROADHOME - 0.2, 70, "#9fc0ea", 2);

// ---------- chick-4: the night; breastworks; 20 September ----------
const night = document.createElement("div");
night.className = "fx-layer"; night.style.background = "radial-gradient(ellipse at 50% 45%, rgba(12,22,48,0.35), rgba(8,14,34,0.62))";
document.getElementById("fx").appendChild(night); gsap.set(night, { autoAlpha: 0 });
fadeIn(night, S4 - 0.3, 1.2); fadeOut(night, T_MORN - 0.3, 1.8);
// Sept 20 positions: red wings close in, Union right wing settles along the road
const RED20 = [[1560, 360], [1790, 520], [1800, 680], [1760, 820], [1640, 1150]];
RED19.forEach(([id], i) => B.move(id, S4 + 0.5 + i * 0.2, 3.5, ...RED20[i]));
slide(bragg, S4 + 0.5, 3, 2000, 930);
const RIGHT = { brannan: ["BRANNAN", G(34.9262, -85.2583)], wood: ["WOOD", G(34.9232, -85.2594)], davis: ["DAVIS", G(34.9200, -85.2602)], sheridan: ["SHERIDAN", G(34.9155, -85.2628)], vancleve: ["VAN CLEVE", G(34.9210, -85.2650)] };
U({ id: "brannan", side: "carth", label: "BRANNAN", x: RIGHT.brannan[1][0], y: RIGHT.brannan[1][1], w: 60, h: 36, t: S4 + 1.5 });
["wood", "davis", "sheridan", "vancleve"].forEach((id, i) => B.move(id, S4 + 0.8 + i * 0.2, 3.5, ...RIGHT[id][1]));
// log breastworks around the Kelly Field salient
const WORKS = [[1480, 452], [1560, 432], [1640, 452], [1700, 505], [1712, 580], [1706, 660], [1680, 725], [1636, 772], [1590, 790]];
const worksD = WORKS.map((p, i) => (i ? "L " : "M ") + p.join(" ")).join(" ");
const works = svgG(`<path d="${worksD}" fill="none" stroke="#f3e6c4" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="${worksD}" fill="none" stroke="#4a2f16" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="${worksD}" fill="none" stroke="#8a5a2b" stroke-width="6" stroke-dasharray="16 7" stroke-linejoin="round"/>`);
const worksLen = 1100;
works.querySelectorAll("path").forEach((p) => gsap.set(p, { strokeDasharray: p.getAttribute("stroke-dasharray") ? "16 7" : `${worksLen} ${worksLen}`, strokeDashoffset: p.getAttribute("stroke-dasharray") ? 0 : worksLen }));
fadeIn(works, T_LOGS - 0.8, 0.2);
tl.to(works.querySelectorAll("path"), { strokeDashoffset: 0, duration: 3.2, ease: "power1.inOut" }, T_LOGS - 0.8);
// Salient units tuck in behind the works
[["baird", [1560, 480]], ["johnson", [1660, 540]], ["palmer", [1665, 650]], ["reynolds", [1610, 745]]].forEach(([id, p], i) => B.move(id, S4 + 1 + i * 0.15, 3, ...p));
slide(thomas, S4 + 1, 3, 1490, 700);
B.caption("BREASTWORKS BUILT OVERNIGHT", T_LOGS + 0.4, T_MORN - 0.3, "carth");
B.date("20 SEPT 1863", T_MORN, T_ORDER - 0.2);
// the morning attacks break on the log walls
const ASL = [[[1600, 250], [1575, 400]], [[1900, 500], [1740, 530]], [[1920, 690], [1750, 660]], [[1850, 830], [1690, 760]]];
ASL.forEach(([a, b], i) => {
  const t = T_MORN + 1.0 + i * 0.7;
  const g = B.arrow({ side: "rome", pts: [a, b], width: 20, t, dur: 1.0 });
  B.greyArrow(g, T_AGAIN + 0.6 + i * 0.2, T_REINF + 0.5);
});
flashes(WORKS.slice(0, 8).map(([x, y]) => [x + 6, y + 6]), T_MORN + 1.6, 4, 0.75, 20);
B.caption("ATTACKS BREAK ON THE LOG WALLS", T_AGAIN - 0.8, T_REINF - 0.2, "carth");
// Rosecrans shifts units north to Thomas
B.arrow({ side: "carth", pts: [[1440, 1160], [1450, 960], [1480, 830], [1540, 790]], width: 16, t: T_SHIFT, dur: 2.2, until: S5 + 1 });
B.arrow({ side: "carth", pts: [[1330, 1080], [1360, 900], [1430, 800], [1500, 780]], width: 16, t: T_SHIFT + 0.6, dur: 2.2, until: S5 + 1 });
B.caption("UNITS SHIFTED NORTH TO HELP THOMAS", T_SHIFT, S5 - 0.2, "carth");

// ---------- chick-5: the order, the gap, the column ----------
B.date("20 SEPT · 11:00 AM", T_ORDER, S7 - 0.2, 36);
const rose = STK("rosecrans", "ROSECRANS", 1250, 1110, S5 + 0.2, { size: 0.95, fs: 16 });
const wstake = STK("wood", "WOOD", 1455, 1000, T_TWOOD - 0.4, { size: 0.7, fs: 14, until: T_OBEY + 1.0 });
// the order, as a paper note on screen
const note = document.createElement("div");
note.innerHTML = `<div style="font-size:22px;letter-spacing:.3em;opacity:.8">ORDER TO GENERAL WOOD · 10:45 AM</div><div style="font-size:44px;margin-top:8px">“CLOSE UP ON REYNOLDS AS FAST AS POSSIBLE”</div>`;
note.style.cssText = "position:absolute;left:50%;top:215px;translate:-50% 0;padding:18px 34px;background:#efe3c4;border:3px solid #6b4a2b;box-shadow:0 12px 24px rgba(0,0,0,.45);font-family:'Special Elite',monospace;color:#2a241b;text-align:center;white-space:nowrap";
document.getElementById("scene").insertBefore(note, document.getElementById("credit"));
gsap.set(note, { autoAlpha: 0 });
tl.fromTo(note, { autoAlpha: 0, y: -30, rotation: -2 }, { autoAlpha: 1, y: 0, rotation: -1, duration: 0.6, ease: "power2.out" }, T_TWOOD + 0.4);
fadeOut(note, T_OBEY - 0.2);
// wrong neighbour: Reynolds is NOT next to Wood; Brannan stands in between
const [rx, ry] = [1610, 745], [bx, by] = RIGHT.brannan[1], [wx, wy] = RIGHT.wood[1];
pulse(rx, ry, T_NOT - 0.3, 55, "#f2c14e", 2);
tag("REYNOLDS", rx + 40, ry - 55, T_NOT - 0.2, T_OBEY, { bg: "#1f4fc4", size: 20 });
pulse(bx, by, T_BETW - 0.1, 55, "#e3232f", 2);
tag("BRANNAN IN BETWEEN", bx + 150, by + 5, T_BETW, T_OBEY + 0.6, { size: 20 });
// Wood pulls out and marches north behind Brannan
follow("wood", [[wx, wy], [1440, 930], [1430, 840], [1480, 790]], T_OBEY + 0.3, 5.2);
B.arrow({ side: "carth", pts: [[wx - 30, wy - 20], [1440, 900], [1440, 830], [1470, 800]], width: 12, t: T_OBEY + 0.2, dur: 2.0, until: T_HIT + 1, dash: "18 10" });
// the gap
const GAPC = [wx + 6, wy + 12];
const gapEl = svgG(`<ellipse cx="${GAPC[0]}" cy="${GAPC[1]}" rx="46" ry="62" fill="rgba(242,193,78,0.35)" stroke="#f2c14e" stroke-width="5" stroke-dasharray="12 7"/>`);
fadeIn(gapEl, T_GAP, 0.5); tl.to(gapEl, { opacity: 0.5, duration: 0.5, yoyo: true, repeat: 5 }, T_GAP + 0.5); fadeOut(gapEl, T_POUR + 1.5);
tag("GAP · ¼ MILE", GAPC[0] - 120, GAPC[1] - 40, T_GAP + 0.3, T_POUR + 1, { bg: "#6b4a2b", size: 22 });
// Longstreet's column, hidden in the woods east of the road
const COL = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) COL.push([1700 + r * 46, 922 + (c ? 26 : -18)]);
COL.forEach(([x, y], i) => U({ id: "col" + i, side: "rome", x, y, w: 36, h: 20, t: T_OBEY + 1.5 + i * 0.08 }));
LAB("LONGSTREET · 8 BRIGADES", 1790, 990, T_OBEY + 2.2, { size: 20, until: T_WHEEL });
const long = STK("longstreet", "LONGSTREET", 1900, 900, T_OBEY + 2.0, { side: "rome", size: 0.8, fs: 15 });
B.caption("A QUARTER-MILE GAP IN THE LINE", T_GAP + 0.3, T_HIT - 0.2, "carth");
B.caption("11:10 AM · LONGSTREET HITS THE GAP", T_HIT, S6 + 2.5, "rome");
COL.forEach(([x, y], i) => B.move("col" + i, T_HIT + 0.2 + (i >> 1) * 0.12, 2.0, x - 180, y, "power2.in"));
B.arrow({ side: "rome", pts: [[1700, 930], [1600, 935], [1500, 950]], width: 30, t: T_HIT, dur: 1.3, until: T_THIRD });

// ---------- chick-6: pour through, wheel right, the rout ----------
const FAN = [[[1500, 950], [1430, 910], [1370, 850]], [[1500, 955], [1410, 975], [1300, 1000]], [[1500, 965], [1450, 1040], [1400, 1120]]];
FAN.forEach((p, i) => B.arrow({ side: "rome", pts: p, width: 22, t: T_POUR + i * 0.25, dur: 1.2, until: S7 + 0.5 }));
const WHEELTO = [[1420, 900], [1380, 940], [1340, 975], [1300, 1010], [1440, 850], [1390, 880], [1330, 910], [1270, 945]];
COL.forEach((_, i) => B.move("col" + i, T_POUR + 0.3 + i * 0.1, 2.6, ...WHEELTO[i]));
B.arrow({ side: "rome", pts: [[1340, 1030], [1270, 960], [1250, 880]], width: 26, t: T_WHEEL, dur: 1.6, until: S7 + 0.5 });
B.move("c5", T_POUR, 3, 1480, 1150);
B.arrow({ side: "rome", pts: [[1600, 1170], [1500, 1160], [1400, 1180]], width: 20, t: T_POUR + 0.4, dur: 1.4, until: S7 + 0.5 });
tag("WHEEL RIGHT", 1300, 850, T_WHEEL + 0.6, T_THIRD + 1.5, { size: 22 });
const ROUTED = ["davis", "sheridan", "vancleve"];
B.grey(ROUTED, T_THIRD - 0.4, 0.8);
const FLEE = { davis: [[1180, 960], [920, 880], [760, 560], [640, 300]], sheridan: [[1250, 1150], [950, 930], [800, 640], [660, 360]], vancleve: [[1120, 920], [880, 820], [720, 470], [620, 250]] };
Object.entries(FLEE).forEach(([id, pts], i) => follow(id, [RIGHT[id][1], ...pts], T_THIRD - 0.4 + i * 0.3, 7));
B.hideUnits(ROUTED, T_LOST + 1.2, 1.0);
const flight = [[[1250, 1000], [1000, 920], [820, 700], [700, 420], [620, 150]], [[1300, 1130], [1050, 1000], [860, 820], [730, 520], [660, 330]]];
flight.forEach((p, i) => B.arrow({ side: "carth", pts: p, width: 22, dash: "26 14", t: T_THIRD + 0.3 + i * 0.4, dur: 3.0, until: S7 + 0.6 }));
B.caption("A THIRD OF THE ARMY ROUTED", T_THIRD, T_ROSE - 0.1);
// the army commander and two corps commanders swept away
slide(rose, T_ROSE - 0.4, 0.01, 1250, 1110);
const mcc = STK("mccook", "McCOOK", 1200, 1120, T_ROSE + 0.3, { role: "XX CORPS", psc: 0.75 });
const cri = STK("crittenden", "CRITTENDEN", 1060, 990, T_ROSE + 0.6, { role: "XXI CORPS", psc: 0.75 });
[[rose, 0], [mcc, 0.4], [cri, 0.8]].forEach(([el, d]) => { slide(el, T_ROSE + 1.2 + d, 6.5, 600 + d * 40, 190 - d * 30, "power1.in"); fadeOut(el, T_LOST - 0.2 + d * 0.3, 0.8); });
LAB("TO CHATTANOOGA · 12 MILES", 560, 110, T_12 - 0.4, { size: 26, until: S8 });
B.caption("ROSECRANS · McCOOK · CRITTENDEN SWEPT AWAY", T_ROSE + 0.1, T_LOST - 0.1);
B.caption("THE BATTLE — AND PERHAPS THE ARMY — LOST?", T_LOST, S7 - 0.1);

// ---------- chick-7: the enemy's belief ----------
pulse(1490, 540, S7 + 0.5, 70, "#9fc0ea", 2);
slide(bragg, S7, 1.5, 1860, 880);
slide(long, S7, 1.5, 1230, 1130);
const bub = B.bubble("“THE YANKEE ARMY IS BROKEN”", 1780, 560, T_BELIEF - 0.4, T_CRUSH + 3.5);
Object.assign(bub.style, { fontSize: "28px", color: "#b3121c", borderColor: "#b3121c" });
// front and flank
B.arrow({ side: "rome", pts: [[1830, 520], [1720, 560]], width: 22, t: T_CRUSH - 0.2, dur: 1.0, until: S8 + 1 });
B.arrow({ side: "rome", pts: [[1840, 690], [1730, 660]], width: 22, t: T_CRUSH, dur: 1.0, until: S8 + 1 });
B.arrow({ side: "rome", pts: [[1300, 900], [1360, 800], [1460, 740]], width: 24, t: T_CRUSH + 0.3, dur: 1.4, until: S8 + 1 });
B.arrow({ side: "rome", pts: [[1250, 920], [1200, 800], [1300, 720], [1450, 690]], width: 24, t: T_CRUSH + 0.6, dur: 1.8, until: S8 + 1 });
B.caption("CRUSH THOMAS FROM FRONT AND FLANK BEFORE NIGHTFALL", T_SWING + 0.2, S8 - 0.2, "rome");

// ---------- chick-8: Horseshoe Ridge ----------
B.highlight(RIDGE, T_HSR - 0.3, S9, 44);
const ridgeLine = svgG(`<path d="M ${RIDGE.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#6b4a2b" stroke-width="8" stroke-dasharray="4 10" stroke-linecap="round"/>`);
fadeIn(ridgeLine, T_HSR, 0.8);
LAB("HORSESHOE RIDGE", 1150, 905, T_HSR + 0.1, { size: 24 });
LAB("SNODGRASS HILL", SNOD[0] - 20, SNOD[1] - 70, T_SNOD - 0.2, { size: 20 });
tag("HIGH GROUND", 1160, 900, T_REAL - 0.3, T_HOLD + 1, { bg: "#1f4fc4", size: 20 });
// ridge + breastworks = one defensive position
const link = B.front({ pts: [[1018, 822], [1062, 852], [1125, 856], [1185, 836], [1250, 812], [1300, 768], [1420, 770], [1560, 790]], width: 10, color: "var(--carth)", t: T_HOLD + 0.2, dur: 2.4 });
tl.to(link, { opacity: 0.85, duration: 0.3 }, T_HOLD + 2.8);
B.caption("HOLD THE RIDGE + THE KELLY FIELD BREASTWORKS", T_HOLD + 0.2, T_GATH - 0.2, "carth");
B.caption("A ROUT INTO A FIGHT · A FIGHT INTO AN ORDERLY RETREAT", T_ROUT + 0.5, T_GATH - 0.2, "carth").style.bottom = "190px";
// every unbroken regiment fed onto the ridge
B.move("brannan", T_GATH - 0.5, 3.5, 1190, 812);
B.move("wood", T_GATH - 0.3, 3.5, 1285, 745);
const FRAG = [[1045, 815], [1090, 835], [1140, 840], [1238, 800], [1330, 770], [1380, 772]];
const FROM = [[1250, 1000], [1320, 960], [1380, 900], [1420, 860], [1460, 820], [1480, 860]];
FRAG.forEach((p, i) => { U({ id: "f" + i, side: "carth", x: FROM[i][0], y: FROM[i][1], w: 30, h: 20, t: T_GATH + i * 0.35 }); B.move("f" + i, T_GATH + 0.2 + i * 0.35, 3.2, ...p); });
B.caption("STRAGGLERS AND FRAGMENTS FED ONTO THE RIDGE", T_GATH + 0.3, S9 - 0.2, "carth");
slide(thomas, T_GATH, 3, 1400, 640);
// Confederates regroup below the ridge
COL.forEach((_, i) => B.move("col" + i, T_GATH + 0.3 + i * 0.1, 4, ...[[1020, 1030], [1080, 1040], [1140, 1030], [1200, 1015], [1260, 995], [1320, 975], [1380, 960], [1440, 960]][i]));

// ---------- chick-9: the afternoon assaults; Steedman ----------
B.date("20 SEPT · AFTERNOON", S7 - 0.2, END + 1, 34);
const waves = [0, 1, 2].map((w) => [[1080, 1010, 1085, 885], [1200, 1000, 1190, 870], [1320, 960, 1290, 820]].map(([x0, y0, x1, y1], i) => {
  const t = S9 + 0.4 + w * 2.4 + i * 0.25;
  const g = B.arrow({ side: "rome", pts: [[x0 + w * 12, y0], [x1 + w * 6, y1 + 12]], width: 18, t, dur: 0.9 });
  B.greyArrow(g, t + 1.3, t + 2.3);
  return g;
}));
flashes([[1060, 845], [1125, 858], [1190, 838], [1250, 812], [1300, 768], [1030, 815]], S9 + 1.0, 8, 0.7, 18);
B.caption("WAVE AFTER WAVE UP THE SLOPES", S9 + 0.2, T_BACK - 0.1, "rome");
B.caption("EACH ONE THROWN BACK", T_BACK, T_DANGER - 0.1, "carth");
// the Confederates work round the right (west) end of the ridge
const wrap = B.arrow({ side: "rome", pts: [[940, 1000], [900, 880], [940, 760], [1010, 720]], width: 22, t: T_AROUND - 0.2, dur: 2.2 });
U({ id: "wrapper", side: "rome", x: 960, y: 1010, w: 40, h: 24, t: T_AROUND - 0.4 });
B.move("wrapper", T_AROUND, 3.0, 950, 800);
tag("THE RIGHT END TURNED", 900, 660, T_AROUND + 1.5, T_FILL + 0.6, { size: 20 });
// Steedman (Granger's Reserve Corps) marches to the guns without orders
const STPATH = [[1500, -30], [1350, 150], [1200, 350], [1080, 550], [1010, 690], [990, 745]];
U({ id: "steed", side: "carth", label: "STEEDMAN", x: 1500, y: 10, w: 64, h: 38, t: T_STEED - 0.2, fs: 16 });
follow("steed", [[1500, 10], ...STPATH.slice(1)], T_STEED + 0.2, T_FILL - T_STEED + 0.6);
B.arrow({ side: "carth", pts: STPATH, width: 24, t: T_STEED, dur: T_FILL - T_STEED + 0.6, until: END + 1 });
const stk = STK("steedman", "STEEDMAN", 1420, 240, T_STEED + 0.3, { size: 0.9, fs: 15 });
slide(stk, T_NOORD, T_FILL - T_NOORD + 0.6, 900, 690); fadeOut(stk, T_BAYO - 0.3, 0.6);
B.caption("STEEDMAN'S RESERVE DIVISION · MARCHED TO THE GUNS WITHOUT ORDERS", T_STEED + 0.2, T_BAYO - 0.2, "carth");
B.greyArrow(wrap, T_FILL + 0.4, T_FILL + 2.5);
B.move("wrapper", T_FILL + 0.6, 2.5, 920, 980);
flashes([[990, 770], [1010, 740], [960, 790]], T_FILL, 4, 0.6, 20);
// out of ammunition: the crest held with the bayonet
B.caption("OUT OF AMMUNITION · THE CREST HELD WITH BAYONETS", T_BAYO, END + 1, "carth");
tag("BAYONETS", 1160, 765, T_BAYO + 0.6, END + 1, { bg: "#1f4fc4", size: 20 });
B.finish();
