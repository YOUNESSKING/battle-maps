// DETAIL-STYLE DEMO (1 min): Chickamauga, 20 Sept 1863, 11:00-11:45 AM. Paragraphs chick-5 … chick-7.
// New techniques on top of the normal engine: 3D tilt, woods/field textures, brigade-level units in line vs column,
// musket smoke + flashes, shell bursts, losses that thin units, fleeing fragments with trails, clock, minimap, strength bars.
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const NS = "http://www.w3.org/2000/svg";
const OVL = document.getElementById("overlay"), PINS = document.getElementById("pins"), WORLD = document.getElementById("world"), SCENE = document.getElementById("scene");
const G = (lat, lon) => {
  const n = 256 * 2 ** 15, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 2206115).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 3323946).toFixed(1)];
};
const GL = (a) => a.map(([la, lo]) => G(la, lo));
const US = "assets/media/us_flag_35star.png", CSA = "assets/media/csa_battle_flag.png";

// ===== geography (from chick2.js) =====
const ROAD = GL([[34.884, -85.2650], [34.8910, -85.2655], [34.8990, -85.2640], [34.9050, -85.2625], [34.9140, -85.2605], [34.9225, -85.2585],
  [34.9300, -85.2583], [34.9370, -85.2590], [34.9420, -85.2598], [34.9512, -85.2590], [34.9570, -85.2590], [34.9640, -85.2625], [34.9720, -85.2700]]);
const DRYV = [[1440, 1000], [1330, 960], [1190, 930], [1040, 915], [910, 895], [820, 760], [740, 560], [680, 400], [648, 327], [610, 180], [590, -20]];
const CREEK = [[1988, 1678], [1979, 1637], [2057, 1569], [2111, 1556], [2133, 1535], [2116, 1518], [2055, 1511], [2037, 1522], [2023, 1553], [2011, 1556], [1995, 1507], [1946, 1491], [1919, 1444], [1913, 1423], [1931, 1387], [1981, 1374], [2013, 1393], [2059, 1402], [2080, 1400], [2103, 1386], [2124, 1400], [2131, 1416], [2200, 1413], [2343, 1305], [2419, 1265], [2473, 1220], [2516, 1211], [2557, 1145], [2583, 1143], [2605, 1152], [2615, 1144], [2612, 1067], [2594, 1028], [2562, 995], [2490, 934], [2398, 920], [2346, 886], [2330, 861], [2294, 857], [2282, 837], [2324, 789], [2394, 767], [2467, 766], [2476, 751], [2475, 678], [2438, 591], [2398, 542], [2340, 520], [2313, 493], [2320, 445], [2330, 433], [2345, 430], [2392, 460], [2430, 427], [2451, 390], [2439, 362], [2390, 343], [2386, 332], [2392, 323], [2414, 313], [2442, 315], [2507, 347], [2546, 342], [2582, 457], [2604, 487], [2643, 502], [2672, 483], [2657, 459], [2620, 425], [2595, 376], [2602, 336], [2645, 323], [2620, 294], [2634, 256], [2633, 229], [2592, 185], [2590, 172], [2596, 160], [2609, 158], [2644, 175], [2656, 173], [2651, 133], [2640, 113], [2662, 96], [2667, 81], [2658, 57], [2616, 32], [2613, 22], [2623, 11], [2680, -9], [2753, -10], [2761, -40]];
const KELLY = G(34.9360, -85.2565), BROTH = G(34.9230, -85.2585), POE = G(34.9290, -85.2575), DYER = G(34.9212, -85.2640), VIN = G(34.9050, -85.2625);
const SNOD = G(34.9295, -85.2690), MCF = [648, 327], REED = G(34.9298, -85.2178), ALEX = G(34.9068, -85.2296), JAY = G(34.9337, -85.2290);
// Horseshoe Ridge (spur west of Snodgrass Hill), west end = the Union right
const RIDGE = [[1300, 768], [1250, 812], [1185, 836], [1125, 856], [1062, 852], [1018, 822]];


// ---------- times ----------
const S5 = P("chick-5"), S6 = P("chick-6"), S7 = P("chick-7");
const T_WRONG = at("chick-5", "went wrong"), T_WOOD = at("chick-5", "Thomas Wood"), T_NOT = at("chick-5", "was not beside Wood");
const T_BETW = at("chick-5", "Another one stood"), T_OBEY = at("chick-5", "Wood obeyed"), T_GAP = at("chick-5", "leaving a gap");
const T_HIT = at("chick-5", "Longstreet's column hit it");
const T_POUR = at("chick-6", "His men poured through"), T_WHEEL = at("chick-6", "wheeled to the right"), T_THIRD = at("chick-6", "A third of the Union");
const T_ROSE = at("chick-6", "Rosecrans and two"), T_MILES = at("chick-6", "twelve miles away"), T_LOST = at("chick-6", "was lost");
const T_BEL = at("chick-7", "believed the same thing"), T_GONE = at("chick-7", "The Union right was gone"), T_CRUSH = at("chick-7", "crush Thomas"), T_NIGHT = at("chick-7", "before nightfall");

// ---------- 1. TILT: the whole map leans back like a sand table ----------
SCENE.style.background = "#cdbf98";
const tilt = document.createElement("div");
tilt.style.cssText = "position:absolute;inset:0;transform-origin:50% 62%;";
SCENE.insertBefore(tilt, WORLD); tilt.appendChild(WORLD);
gsap.set(tilt, { transformPerspective: 1700, rotationX: 0, scale: 1 });
tl.to(tilt, { rotationX: 22, scale: 1.16, duration: 4, ease: "sine.inOut" }, 0.2);
tl.to(tilt, { rotationX: 32, scale: 1.26, duration: 3, ease: "sine.inOut" }, T_HIT - 1.5);
tl.to(tilt, { rotationX: 16, scale: 1.12, duration: 4, ease: "sine.inOut" }, S7 - 0.5);

// ---------- camera ----------
B.camera([
  [0, 1500, 880, 1.45],
  [T_WOOD, 1470, 900, 1.6],
  [T_BETW, 1500, 860, 1.7],
  [T_GAP, 1540, 940, 1.85],
  [T_HIT, 1580, 960, 1.75],
  [T_WHEEL, 1400, 880, 1.35],
  [T_ROSE, 1100, 700, 1.05],
  [S7, 1350, 760, 1.15],
  [T_CRUSH, 1560, 640, 1.4],
  [END, 1540, 650, 1.45],
]);

// ---------- 2. TERRAIN DETAIL: forest symbols, ploughed fields, roads, farms ----------
const rectLL = (la0, lo0, la1, lo1) => { const [x0, y0] = G(la1, lo0), [x1, y1] = G(la0, lo1); return [x0, y0, x1 - x0, y1 - y0]; };
const FIELDS = [
  ["KELLY", rectLL(34.9335, -85.2600, 34.9395, -85.2540)], ["POE", rectLL(34.9270, -85.2600, 34.9310, -85.2555)],
  ["BROTHERTON", rectLL(34.9215, -85.2600, 34.9245, -85.2565)], ["DYER", rectLL(34.9185, -85.2690, 34.9240, -85.2605)],
  ["VINIARD", rectLL(34.9020, -85.2665, 34.9075, -85.2590)], ["SNODGRASS", rectLL(34.9280, -85.2715, 34.9310, -85.2670)],
  ["GLENN", rectLL(34.9065, -85.2745, 34.9105, -85.2695)], ["WINFREY", rectLL(34.9360, -85.2500, 34.9390, -85.2455)],
  ["BROCK", rectLL(34.9295, -85.2505, 34.9325, -85.2460)], ["McDONALD", rectLL(34.9480, -85.2625, 34.9560, -85.2560)],
];
const tree = (cx, cy, r, o) => `<g opacity="${o}"><ellipse cx="${cx}" cy="${cy + r * 1.05}" rx="${r * 0.9}" ry="${r * 0.3}" fill="rgba(40,36,20,0.22)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#6f7f48"/><circle cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" r="${r * 0.45}" fill="#8c9a5c"/><path d="M${cx - r} ${cy} a${r} ${r} 0 0 0 ${2 * r} 0" fill="none" stroke="#3d4526" stroke-width="1.6"/></g>`;
let rs = 20; const rnd = () => { rs = (rs * 16807) % 2147483647; return rs / 2147483647; };
let trees = ""; for (let y = 0; y < 1640; y += 34) for (let x = (y / 34) % 2 ? 0 : 19; x < 2900; x += 38) trees += tree(x + rnd() * 14 - 7, y + rnd() * 12 - 6, 7 + rnd() * 4, 0.38 + rnd() * 0.25);
OVL.insertAdjacentHTML("afterbegin", `<defs>
  <mask id="clear"><rect width="2880" height="1620" fill="#fff"/>${FIELDS.map(([, [x, y, w, h]]) => `<rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" rx="22" fill="#000"/>`).join("")}</mask>
  <pattern id="furrow" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><rect width="14" height="14" fill="#e6d49c"/><line x1="0" y1="0" x2="0" y2="14" stroke="#b9a266" stroke-width="3"/></pattern></defs>
  <g id="woods" mask="url(#clear)">${trees}</g>
  <g id="fields">${FIELDS.map(([, [x, y, w, h]]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="url(#furrow)" opacity="0.8" stroke="#6b5530" stroke-width="3.5" stroke-dasharray="3 7"/>`).join("")}</g>`);
const road = (pts, w, dash) => { const d = "M " + pts.map((p) => p.join(" ")).join(" L ");
  OVL.insertAdjacentHTML("beforeend", `<g><path d="${d}" fill="none" stroke="#4d3520" stroke-width="${w + 7}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#efdfb4" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ""} stroke-linejoin="round" stroke-linecap="round"/></g>`); };
B.river(CREEK, 16);
road(ROAD, 10); road(DRYV, 7, "22 10");
road(GL([[34.9212, -85.2585], [34.9212, -85.2640], [34.9230, -85.2700], [34.9290, -85.2690]]), 6, "16 8"); // Dyer road to Snodgrass
FIELDS.forEach(([n, [x, y, w, h]]) => {
  const hx = x + w * 0.5, hy = y + h * 0.35;
  PINS.insertAdjacentHTML("beforeend", `<div style="position:absolute;left:${hx - 10}px;top:${hy - 10}px;width:20px;height:16px;background:#5a3d22;border:2.5px solid #f3eee2;clip-path:polygon(50% 0,100% 40%,100% 100%,0 100%,0 40%)"></div>`);
  B.label(n + (n === "KELLY" || n === "DYER" || n === "POE" ? " FIELD" : ""), hx, y + h - 14, { cls: "tg", size: 17, t: 0.3, anchor: [-50, -50] });
});
B.label("LAFAYETTE ROAD", 1600, 1300, { cls: "tg", size: 22, rot: -80, t: 0.3, anchor: [-50, -50] });
B.label("DRY VALLEY ROAD", 860, 820, { cls: "tg", size: 20, rot: -62, t: 0.3, anchor: [-50, -50] });
B.label("TO McFARLAND'S GAP ▲", 700, 290, { cls: "tg", size: 22, t: 0.3, anchor: [-50, -50] });
B.label("HORSESHOE RIDGE", 1150, 800, { cls: "tg", size: 22, rot: -8, t: 0.3, anchor: [-50, -50] });

// ---------- 3. BRIGADE-LEVEL UNITS: lines are long and thin, columns deep ----------
const units = {};
const bde = (id, side, name, x, y, o = {}) => {
  const w = o.col ? 34 : 74, h = o.col ? 30 : 17;
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:0;height:0;`;
  const col = side === "rome" ? "#c4121f" : "#1f4fc4";
  el.innerHTML = `<div class="b" style="position:absolute;left:${-w / 2}px;top:${-h / 2}px;width:${w}px;height:${h}px;background:${col};border:2.5px solid #1a1712;box-shadow:0 3px 5px rgba(0,0,0,.45);rotate:${o.rot || 0}deg;transform-origin:50% 50%">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><line x1="0" y1="0" x2="100" y2="100" stroke="#f7f3ea" stroke-width="7"/><line x1="100" y1="0" x2="0" y2="100" stroke="#f7f3ea" stroke-width="7"/></svg></div>
    <div class="n" style="position:absolute;left:0;top:${h / 2 + 3}px;translate:-50% 0;font:700 13px Oswald,sans-serif;letter-spacing:.05em;color:#fff;background:${col};padding:0 5px;border-radius:2px;white-space:nowrap">${name}</div>`;
  PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  if (o.t != null) tl.fromTo(el, { autoAlpha: 0, y: -26 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(2)" }, o.t);
  units[id] = { el, x, y };
  return el;
};
const mv = (id, t, dur, x, y, ease = "power1.inOut") => { tl.to(units[id].el, { left: x, top: y, duration: dur, ease }, t); units[id].x = x; units[id].y = y; };
const loss = (id, t, k = 0.55) => { const b = units[id].el.querySelector(".b"); tl.to(b, { scaleX: k, backgroundColor: "#77746c", duration: 1.2 }, t); tl.to(units[id].el.querySelector(".n"), { backgroundColor: "#77746c", duration: 1.2 }, t); };
// Union right, north to south along the road (brigades of Brannan, Wood, Davis, Sheridan)
const UNION = [
  ["con", "CONNELL", 1605, 800], ["cro", "CROXTON", 1600, 840], ["buell", "BUELL", 1592, 890], ["harker", "HARKER", 1560, 925],
  ["carlin", "CARLIN", 1580, 975], ["heg", "HEG", 1560, 1010], ["lytle", "LYTLE", 1500, 1085], ["laib", "LAIBOLDT", 1470, 1050], ["brad", "BRADLEY", 1440, 1110],
];
UNION.forEach(([id, n, x, y], i) => bde(id, "carth", n, x, y, { t: 0.5 + i * 0.1, rot: -8 }));
// Kelly Field salient (Thomas) as solid divisions behind the breastworks
[["baird", "BAIRD", 1560, 480], ["johnson", "JOHNSON", 1660, 540], ["palmer", "PALMER", 1665, 650], ["reynolds", "REYNOLDS", 1610, 745]].forEach(([id, n, x, y], i) => bde(id, "carth", n, x, y, { t: 0.4 + i * 0.1, rot: 70 }));
const WORKS = [[1480, 452], [1560, 432], [1640, 452], [1700, 505], [1712, 580], [1706, 660], [1680, 725], [1636, 772], [1590, 790]];
OVL.insertAdjacentHTML("beforeend", `<path d="M ${WORKS.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#4a2f16" stroke-width="13" stroke-linejoin="round"/><path d="M ${WORKS.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#a8743c" stroke-width="5" stroke-dasharray="14 6"/>`);
const thom = B.portraitStake({ img: "assets/media/thomas_head.png", flag: US, name: "THOMAS", x: 1500, y: 640, size: 0.75, t: 0.6 });
// Longstreet's column hidden in the woods east of the road: 3 divisions x brigades, deep
const COL = [["bj1", "FULTON", 0, 0], ["bj2", "McNAIR", 0, 1], ["bj3", "GREGG", 0, 2], ["h1", "LAW", 1, 0], ["h2", "ROBERTSON", 1, 1], ["h3", "BENNING", 1, 2], ["k1", "KERSHAW", 2, 0], ["k2", "HUMPHREYS", 2, 1]];
COL.forEach(([id, n, r, c], i) => bde(id, "rome", n, 1745 + r * 62, 900 + (c - 1) * 46, { col: true, t: T_OBEY + 1.4 + i * 0.1 }));
const lst = B.portraitStake({ img: "assets/media/longstreet_head.png", flag: CSA, name: "LONGSTREET", x: 1960, y: 880, size: 0.75, t: T_OBEY + 1.8 });
lst.querySelector(".face").style.boxShadow = "0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5)"; lst.querySelector(".nm").style.background = "#c4121f";
const rose = B.portraitStake({ img: "assets/media/rosecrans_head.png", flag: US, name: "ROSECRANS", x: 1300, y: 1000, size: 0.75, t: S5 + 0.3 });

// ---------- 4. EFFECTS: smoke, musket flashes, shell bursts ----------
const puff = (x, y, t, r = 34, dur = 3.2) => { const e = document.createElement("div");
  e.style.cssText = `position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:radial-gradient(circle,rgba(245,242,232,.85) 0%,rgba(225,220,205,.55) 45%,rgba(220,215,200,0) 72%)`;
  PINS.appendChild(e); gsap.set(e, { autoAlpha: 0 });
  tl.fromTo(e, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out", immediateRender: false }, t);
  tl.to(e, { autoAlpha: 0, scale: 1.9, x: 26, y: -18, duration: dur, ease: "sine.in" }, t + 0.5); };
const volley = (pts, t, reps = 3, gap = 0.9) => pts.forEach(([x, y], i) => { for (let k = 0; k < reps; k++) { const tt = t + k * gap + (i % 4) * 0.12;
  const f = document.createElement("div"); f.style.cssText = `position:absolute;left:${x - 12}px;top:${y - 12}px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle,#fffbe0 0%,#ffbe4a 40%,rgba(255,120,20,0) 72%)`;
  PINS.appendChild(f); gsap.set(f, { autoAlpha: 0 });
  tl.fromTo(f, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.4, duration: 0.12, immediateRender: false }, tt); tl.to(f, { autoAlpha: 0, duration: 0.35 }, tt + 0.12);
  puff(x + 8, y - 6, tt + 0.1, 26, 2.6); } });
const burst = (x, y, t) => { const e = document.createElement("div");
  e.style.cssText = `position:absolute;left:${x - 40}px;top:${y - 40}px;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,#fff 0%,#ffcf5a 25%,#ff7a1a 45%,rgba(90,60,40,.6) 60%,rgba(0,0,0,0) 72%)`;
  PINS.appendChild(e); gsap.set(e, { autoAlpha: 0 });
  tl.fromTo(e, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1.2, duration: 0.18, immediateRender: false }, t); tl.to(e, { autoAlpha: 0, scale: 1.6, duration: 0.6 }, t + 0.18);
  puff(x, y - 10, t + 0.2, 46, 3.5); };
// background skirmishing along the salient throughout
volley(WORKS.slice(1, 8).map(([x, y]) => [x + 30, y + 10]), 0.8, 6, 2.6);

// ---------- 5. HUD: clock, minimap, strength bars ----------
const hud = (html, css) => { const e = document.createElement("div"); e.innerHTML = html; e.style.cssText = "position:absolute;" + css; SCENE.insertBefore(e, document.getElementById("credit")); gsap.set(e, { autoAlpha: 0 }); return e; };
gsap.set(document.getElementById("date"), { autoAlpha: 0 });
const clock = hud(`<div style="font:700 15px Oswald;letter-spacing:.2em;color:#e9dcb8">20 SEPTEMBER 1863</div><div class="t" style="font:700 54px Oswald;color:#fbfaf6;line-height:1">11:00 AM</div>`,
  "right:40px;top:30px;padding:10px 22px 12px;background:rgba(24,20,14,.82);border:2px solid #b89d68;text-align:right");
tl.to(clock, { autoAlpha: 1, duration: 0.6 }, 0.4);
const clk = { m: 0 }; const tEl = clock.querySelector(".t");
const upd = () => { const m = Math.round(clk.m); tEl.textContent = `11:${String(m).padStart(2, "0")} AM`; };
tl.to(clk, { m: 10, duration: T_HIT - 0.5, ease: "none", onUpdate: upd }, 0.5);
tl.to(clk, { m: 30, duration: S7 - T_HIT, ease: "none", onUpdate: upd }, T_HIT);
tl.to(clk, { m: 45, duration: END - S7, ease: "none", onUpdate: upd }, S7);
const mini = hud(`<img src="assets/media/demo_inset.jpg" style="display:block;width:384px;height:216px"><div style="font:700 13px Oswald;letter-spacing:.18em;color:#e9dcb8;padding:4px 8px">CHICKAMAUGA · 12 MI SOUTH OF CHATTANOOGA</div>`,
  "left:40px;bottom:40px;background:rgba(24,20,14,.85);border:3px solid #b89d68;box-shadow:0 8px 18px rgba(0,0,0,.5)");
tl.to(mini, { autoAlpha: 1, duration: 0.6 }, 0.8); tl.to(mini, { autoAlpha: 0, duration: 0.5 }, T_NOT - 0.5); tl.to(mini, { autoAlpha: 1, duration: 0.5 }, T_ROSE); tl.to(mini, { autoAlpha: 0, duration: 0.5 }, S7);
const bars = hud(`<div style="font:700 17px Oswald;letter-spacing:.16em;color:#e9dcb8;margin-bottom:8px">AT THE GAP · BRIGADES</div>
  <div style="display:flex;align-items:center;gap:10px;margin:6px 0"><div class="r" style="height:26px;width:0;background:#c4121f;border:2px solid #fff"></div><span style="font:700 22px Oswald;color:#fff">LONGSTREET 8</span></div>
  <div style="display:flex;align-items:center;gap:10px;margin:6px 0"><div class="u" style="height:26px;width:0;background:#1f4fc4;border:2px solid #fff"></div><span style="font:700 22px Oswald;color:#fff">DAVIS + SHERIDAN 5</span></div>`,
  "right:40px;top:150px;padding:14px 20px;background:rgba(24,20,14,.82);border:2px solid #b89d68");
tl.to(bars, { autoAlpha: 1, duration: 0.5 }, T_HIT - 0.8);
tl.to(bars.querySelector(".r"), { width: 8 * 34, duration: 1.2, ease: "power2.out" }, T_HIT - 0.4);
tl.to(bars.querySelector(".u"), { width: 5 * 34, duration: 1.2, ease: "power2.out" }, T_HIT);
tl.to(bars, { autoAlpha: 0, duration: 0.5 }, T_ROSE);

// ---------- chick-5: the order, the wrong neighbour, the gap ----------
const note = hud(`<div style="font-size:20px;letter-spacing:.3em;opacity:.8">ORDER TO GENERAL WOOD · 10:45 AM</div><div style="font-size:40px;margin-top:8px">“CLOSE UP ON REYNOLDS AS FAST AS POSSIBLE”</div>`,
  "left:50%;top:190px;translate:-50% 0;padding:16px 30px;background:#efe3c4;border:3px solid #6b4a2b;box-shadow:0 12px 24px rgba(0,0,0,.45);font-family:'Special Elite',monospace;color:#2a241b;text-align:center;white-space:nowrap");
tl.fromTo(note, { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.6 }, T_WOOD + 0.3); tl.to(note, { autoAlpha: 0, duration: 0.4 }, T_NOT + 0.2);
const ring = (x, y, t, until, c) => { const e = document.createElement("div"); e.style.cssText = `position:absolute;left:${x - 60}px;top:${y - 40}px;width:120px;height:80px;border-radius:50%;border:6px solid ${c};box-shadow:0 0 18px ${c}`; PINS.appendChild(e); gsap.set(e, { autoAlpha: 0 });
  tl.fromTo(e, { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, immediateRender: false }, t); tl.to(e, { autoAlpha: 0, duration: 0.4 }, until); };
ring(1610, 745, T_NOT - 0.2, T_OBEY, "#f2c14e");
ring(1602, 820, T_BETW - 0.1, T_OBEY + 0.5, "#e3232f");
B.caption("REYNOLDS IS NOT NEXT TO WOOD · BRANNAN STANDS IN BETWEEN", T_NOT, T_OBEY - 0.1, "rome");
// Wood's two brigades pull out, leaving a trail
const trail = (pts, t) => { const d = "M " + pts.map((p) => p.join(" ")).join(" L "); OVL.insertAdjacentHTML("beforeend", `<path class="tr" d="${d}" fill="none" stroke="#1f4fc4" stroke-width="5" stroke-dasharray="4 12" stroke-linecap="round" opacity="0"/>`);
  const e = OVL.lastElementChild; tl.to(e, { opacity: 0.8, duration: 1.2 }, t); tl.to(e, { opacity: 0, duration: 1 }, t + 9); };
trail([[1592, 890], [1500, 860], [1470, 800], [1500, 770]], T_OBEY + 0.5);
mv("buell", T_OBEY + 0.3, 4.5, 1480, 790); mv("harker", T_OBEY + 0.5, 4.5, 1455, 830);
const gap = document.createElement("div"); gap.style.cssText = "position:absolute;left:1548px;top:860px;width:100px;height:110px;border-radius:50%;background:rgba(242,193,78,.3);border:5px dashed #f2c14e";
PINS.appendChild(gap); gsap.set(gap, { autoAlpha: 0 }); tl.to(gap, { autoAlpha: 1, duration: 0.5 }, T_GAP); tl.to(gap, { opacity: 0.4, duration: 0.45, yoyo: true, repeat: 5 }, T_GAP + 0.5); tl.to(gap, { autoAlpha: 0, duration: 0.4 }, T_POUR + 1);
B.caption("A QUARTER-MILE GAP IN THE LINE", T_GAP + 0.3, T_HIT - 0.1, "carth");

// ---------- the hit (≈11:10) ----------
COL.forEach(([id], i) => { const u = units[id]; mv(id, T_HIT - 0.4 + i * 0.12, 2.6, u.x - 150, u.y + (i % 3 - 1) * 8, "power2.in"); });
B.arrow({ side: "rome", pts: [[1840, 910], [1700, 915], [1590, 915]], width: 34, t: T_HIT - 0.5, dur: 1.4, until: T_ROSE });
volley([[1600, 850], [1585, 975], [1570, 1010], [1640, 900], [1650, 950]], T_HIT, 3, 0.7);
burst(1560, 1000, T_HIT + 0.8); burst(1600, 880, T_HIT + 1.4); burst(1470, 1060, T_HIT + 2.0);
tl.to(lst, { left: "-=140", duration: 3, ease: "power1.inOut" }, T_HIT);
B.caption("11:10 · LONGSTREET'S COLUMN HITS THE GAP", T_HIT, T_WHEEL - 0.1, "rome");

// ---------- chick-6: through, wheel right, the Union right collapses ----------
[["bj1", 1480, 960], ["bj2", 1460, 1010], ["bj3", 1440, 1060], ["h1", 1520, 900], ["h2", 1500, 940], ["h3", 1480, 990], ["k1", 1420, 930], ["k2", 1400, 980]].forEach(([id, x, y], i) => mv(id, T_POUR + i * 0.1, 3.5, x, y));
B.arrow({ side: "rome", pts: [[1560, 930], [1440, 960], [1360, 1060], [1330, 1160]], width: 24, t: T_WHEEL - 0.3, dur: 2, until: T_ROSE + 1 });
B.arrow({ side: "rome", pts: [[1560, 900], [1430, 880], [1300, 860], [1200, 830]], width: 24, t: T_WHEEL, dur: 2, until: S7 });
volley([[1450, 1040], [1420, 1100], [1480, 1080], [1380, 950], [1330, 900]], T_WHEEL + 0.6, 3, 0.8);
burst(1420, 1090, T_WHEEL + 1.2); burst(1350, 930, T_WHEEL + 2.0);
["carlin", "heg", "lytle", "laib", "brad", "con", "cro"].forEach((id, i) => loss(id, T_WHEEL + 0.5 + i * 0.25, 0.5));
// fragments stream away north-west to McFarland's Gap, with trails
const frag = (x0, y0, t, k) => { const pts = [[x0, y0], [x0 - 200, y0 - 60 - k * 20], [900, 700 + k * 25], [700, 400 + k * 30]];
  const e = document.createElement("div"); e.style.cssText = `position:absolute;left:${x0 - 11}px;top:${y0 - 7}px;width:22px;height:14px;background:#6b7fae;border:2px solid #1a1712`; PINS.appendChild(e); gsap.set(e, { autoAlpha: 0 });
  tl.to(e, { autoAlpha: 1, duration: 0.3 }, t); let tt = t; pts.slice(1).forEach((p) => { tl.to(e, { left: p[0] - 11, top: p[1] - 7, duration: 2.2, ease: "none" }, tt); tt += 2.2; }); tl.to(e, { autoAlpha: 0, duration: 0.6 }, tt);
  trail(pts, t + 0.2); };
for (let k = 0; k < 7; k++) frag(1440 + (k % 4) * 40, 900 + Math.floor(k / 2) * 45, T_THIRD - 0.5 + k * 0.3, k % 5);
tl.to(rose, { left: "-=520", top: "-=380", duration: 7, ease: "power1.in" }, T_ROSE);
tl.to(rose, { autoAlpha: 0, duration: 1 }, T_LOST);
B.caption("A THIRD OF THE ARMY COLLAPSES", T_THIRD, T_ROSE - 0.1, "rome");
B.caption("ROSECRANS SWEPT BACK TOWARD CHATTANOOGA", T_ROSE, S7 - 0.2, "rome");

// ---------- chick-7: what the enemy believed ----------
const belief = hud(`<div style="font:700 17px Oswald;letter-spacing:.2em;color:#f7c9c9">WHAT BRAGG AND LONGSTREET BELIEVED</div><div style="font:700 38px Oswald;color:#fff;margin-top:6px">“THE YANKEE ARMY IS BROKEN”</div>`,
  "left:50%;top:190px;translate:-50% 0;padding:16px 30px;background:rgba(150,14,24,.9);border:3px solid #fff;text-align:center;white-space:nowrap");
tl.fromTo(belief, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, T_BEL); tl.to(belief, { autoAlpha: 0, duration: 0.4 }, T_CRUSH - 0.3);
// planned (not yet executed) blows on Thomas: dashed ghost arrows from front and flank
[[[1900, 520], [1740, 560]], [[1880, 720], [1730, 690]], [[1420, 960], [1470, 820], [1540, 790]]].forEach((pts, i) =>
  B.arrow({ side: "rome", pts, width: 20, dash: "20 12", t: T_CRUSH + i * 0.4, dur: 1.4 }));
B.caption("NEXT: CRUSH THOMAS'S ISOLATED WING BEFORE NIGHTFALL", T_CRUSH, END + 1, "rome");
tl.fromTo(thom, { scale: 1 }, { scale: 1.25, duration: 0.6, yoyo: true, repeat: 1, immediateRender: false }, T_CRUSH + 0.3);

B.finish();
