// Move 3: the battle of Eutaw Springs, 8 September 1781. Americans = blue ("carth"), British = red ("rome").
// Basemap eutaw_field1781: stylised 1781 parchment battlefield painted over the z15 bake (the site is now partly under Lake Marion).
// Painted geometry (map px): Santee along the top, River Road y~905 west->east, clearing x1030-2280, tents x1520-1900,
// EUTAW HOUSE 1925-2010 x 775-840, walled garden 2015-2195 x 750-880, blackjack thicket ~2010-2200 x 450-700, Eutaw Creek x~2170-2330.
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const HAVE_GREENE_HEAD = true, HAVE_STEWART_HEAD = false;

const NS = "http://www.w3.org/2000/svg", SVG = document.getElementById("overlay");
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const R = rng(1781);
const svgEl = (html) => { const g = document.createElementNS(NS, "g"); g.innerHTML = html; SVG.appendChild(g); gsap.set(g, { autoAlpha: 0 }); return g; };
const tagSize = (id, px) => { const t = B.units[id].el.querySelector(".tag"); if (t) t.style.fontSize = px + "px"; };

// musket flashes along a line: pts = [[x,y],...] muzzle positions; bursts repeat from t0 to t1
function volley(pts, t0, t1, o = {}) {
  const period = o.period || 1.1;
  pts.forEach(([x, y], i) => {
    const r = o.r || 20, star = [...Array(16)].map((_, k) => { const a = k * Math.PI / 8, rr = k % 2 ? r * 0.45 : r; return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`; }).join(" ");
    const g = svgEl(`<polygon points="${star}" fill="#ffb627" stroke="#fff3c4" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r * 0.38}" fill="#fffbe8"/>`);
    for (let t = t0 + R() * period; t < t1 - 0.2; t += period * (0.8 + R() * 0.4)) {
      tl.fromTo(g, { autoAlpha: 0, scale: 0.4, svgOrigin: `${x} ${y}` }, { autoAlpha: 1, scale: 1.25, duration: 0.07, ease: "none", immediateRender: false }, t);
      tl.to(g, { autoAlpha: 0, duration: 0.2, ease: "power1.in" }, t + 0.09);
    }
    if (o.smoke !== false) {
      const s = svgEl(`<ellipse cx="${x + (o.dir || 0) * 26}" cy="${y}" rx="26" ry="20" fill="#f4f1e8"/>`);
      tl.fromTo(s, { autoAlpha: 0 }, { autoAlpha: 0.32, duration: 2.5 }, t0 + 0.3);
      tl.to(s, { autoAlpha: 0, duration: 1.5 }, t1);
    }
  });
}
// fire lines (dashed tracers) from sources to targets, flickering between t0 and t1
function fireLines(pairs, t0, t1, color = "#c4121f") {
  pairs.forEach(([[x1, y1], [x2, y2]], i) => {
    const g = svgEl(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f7f3ea" stroke-width="7" stroke-dasharray="14 18" stroke-linecap="round"/>
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="4" stroke-dasharray="14 18" stroke-linecap="round"/>`);
    tl.to(g, { autoAlpha: 1, duration: 0.3 }, t0 + i * 0.15);
    const ls = g.querySelectorAll("line"), reps = Math.max(Math.floor((t1 - t0) / 0.6) - 1, 0);
    tl.fromTo(ls, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -64 }, duration: 0.6, ease: "none", repeat: reps, immediateRender: false }, t0 + i * 0.15);
    tl.to(g, { autoAlpha: 0, duration: 0.5 }, t1);
  });
}

// ---------- key times ----------
const S3 = P("eutaw-3"), S4 = P("eutaw-4"), S5 = P("eutaw-5"), S6 = P("eutaw-6"), S7 = P("eutaw-7");
const T_2000 = at("eutaw-3", "about two thousand"), T_STEW = at("eutaw-3", "Alexander Stewart"), T_50 = at("eutaw-3", "fifty miles");
const T_CAMP = at("eutaw-3", "Their camp"), T_HOUSE = at("eutaw-3", "two-story brick"), T_GARDEN = at("eutaw-3", "high-walled"), T_GREENE = at("eutaw-3", "Greene came");
const T_2200 = at("eutaw-3", "twenty-two hundred");
const T_DAWN = at("eutaw-4", "before dawn"), T_ROAD = at("eutaw-4", "On the road"), T_FORAGE = at("eutaw-4", "foraging party"), T_SCOOP = at("eutaw-4", "scooped it up");
const T_FORM = at("eutaw-4", "Stewart barely");
const T_TWO = at("eutaw-5", "two lines"), T_MIL = at("eutaw-5", "militia in front"), T_CONT = at("eutaw-5", "Continentals behind"), T_GUIL = at("eutaw-5", "Guilford");
const T_ASTON = at("eutaw-5", "astonished"), T_OPEN = at("eutaw-5", "stood in the open"), T_17 = at("eutaw-5", "seventeen rounds"), T_GAVE = at("eutaw-5", "gave way");
const T_SENT = at("eutaw-6", "sent in his Continentals"), T_MDVA = at("eutaw-6", "Maryland and Virginia"), T_BAY = at("eutaw-6", "with the bayonet"), T_COLL = at("eutaw-6", "line collapsed");
const T_FLED = at("eutaw-6", "fled back"), T_VICT = at("eutaw-6", "For a few minutes");
const T_SLIP = at("eutaw-7", "slipped away"), T_BURST = at("eutaw-7", "burst into a camp"), T_DISC = at("eutaw-7", "discipline collapsed"), T_EAT = at("eutaw-7", "Men stopped");
const T_BARR = at("eutaw-7", "barricaded"), T_WIN = at("eutaw-7", "upper windows"), T_FLANK = at("eutaw-7", "on the flank"), T_MARJ = at("eutaw-7", "Marchbanks"), T_OAK = at("eutaw-7", "blackjack oak");

// ---------- camera ----------
B.camera([
  [0, 1440, 810, 0.667],
  [4.6, 1440, 810, 0.667],
  [T_2000 + 1.0, 1760, 820, 1.0],
  [T_50 - 0.8, 1900, 845, 0.93],
  [T_50 + 1.8, 1880, 850, 0.9],
  [T_CAMP, 1850, 820, 1.2],
  [T_GARDEN + 1.5, 1880, 810, 1.25],
  [T_GREENE + 0.2, 1250, 880, 0.8],
  [S4 - 0.2, 1200, 900, 0.82],
  [S4 + 2.2, 900, 960, 1.1],
  [T_FORM, 1000, 950, 1.05],
  [T_FORM + 2.2, 1230, 910, 1.1],
  [S5 + 0.5, 1180, 900, 1.15],
  [T_ASTON, 1230, 885, 1.4],
  [T_GAVE + 1.0, 1210, 885, 1.35],
  [S6 + 1.5, 1300, 900, 1.2],
  [T_FLED + 0.5, 1700, 890, 1.0],
  [S7, 1750, 880, 1.05],
  [T_DISC + 0.5, 1760, 880, 1.3],
  [T_BARR - 0.5, 1850, 840, 1.25],
  [T_FLANK + 0.5, 1900, 760, 1.2],
  [END, 1880, 780, 1.24],
]);

// ---------- setting ----------
B.title("THE BATTLE OF", "EUTAW SPRINGS", "8 September 1781", 0.3, 4.4);
B.showDate(4.4);
B.date("8 SEPTEMBER 1781", 4.6, S4 + 0.3, 36);
B.date("DAWN", S4 + 0.6, T_TWO, 40);
B.date("8 SEPTEMBER 1781", T_TWO + 0.3, null, 36);
B.label("SANTEE RIVER", 900, 150, { cls: "river", size: 40, t: 1.6, anchor: [-50, -50], rot: -2 });
const creek = B.label("EUTAW CREEK", 2232, 330, { cls: "river", size: 26, t: 2.0, anchor: [-50, -50] });
gsap.set(creek, { rotation: -80 });
B.label("RIVER ROAD", 560, 872, { cls: "tg", size: 28, t: 2.4, anchor: [-50, -50], until: T_ROAD });

// British in camp
const REDCAMP = { r1: [1640, 760], r2: [1790, 760], r3: [1640, 1030], r4: [1790, 1030] };
Object.entries(REDCAMP).forEach(([k, [x, y]], i) => B.unit({ id: k, side: "rome", x, y, w: 78, h: 44, t: T_2000 - 0.4 + i * 0.15 }));
B.unit({ id: "rm", side: "rome", x: 2100, y: 590, w: 60, h: 36, t: T_2000 + 0.3 });
const brCount = B.label("BRITISH ~2,000", 1715, 1150, { cls: "tg", size: 36, t: T_2000 + 0.3, anchor: [-50, -50], until: T_FORM });
if (HAVE_STEWART_HEAD) B.portraitStake({ img: "assets/media/stewart_head.png", flag: "assets/media/gb_flag_1606.png", name: "STEWART", x: 2420, y: 1180, size: 1.3, t: T_STEW, until: T_CAMP + 0.5 });
else B.plaque({ name: "LT. COL. ALEXANDER STEWART", role: "British field army", side: "rome", x: 2250, y: 1330, t: T_STEW, until: T_CAMP + 0.5 });
B.arrow({ side: "white", pts: [[2400, 918], [2560, 926], [2720, 936]], width: 12, t: T_50 - 0.3, dur: 1.0, until: T_CAMP + 0.4 });
B.label("CHARLESTON · 50 MILES", 2380, 880, { cls: "tg", size: 26, t: T_50, anchor: [0, -100], until: T_CAMP + 0.4 });

B.label("BRITISH CAMP", 1710, 630, { cls: "tg", size: 30, t: T_CAMP + 0.2, anchor: [-50, -50], until: S5 });
B.label("EUTAW HOUSE", 1968, 858, { cls: "tg", size: 22, t: T_HOUSE, anchor: [-50, -50] });
const houseGlow = svgEl(`<rect x="1915" y="765" width="105" height="85" fill="none" stroke="#f7f3ea" stroke-width="6" rx="6"/>`);
tl.to(houseGlow, { autoAlpha: 1, duration: 0.4, repeat: 3, yoyo: true }, T_HOUSE);
B.label("WALLED GARDEN", 2105, 735, { cls: "tg", size: 20, t: T_GARDEN, anchor: [-50, -100] });
B.label("BLACKJACK OAKS", 2105, 440, { cls: "tg", size: 22, t: T_GARDEN + 1.2, anchor: [-50, -100] });

// Americans on the River Road
const COL = [[180, 918], [300, 914], [420, 910], [540, 907], [660, 905]];
COL.forEach(([x, y], i) => B.unit({ id: "b" + i, side: "carth", x, y, w: 56, h: 32, t: T_GREENE + 0.3 + i * 0.15 }));
B.label("US ~2,200", 420, 1000, { cls: "tg", size: 36, t: T_2200 - 0.2, anchor: [-50, -50], until: T_FORAGE });
if (HAVE_GREENE_HEAD) B.portraitStake({ img: "assets/media/greene_head.png", flag: "assets/media/us_flag_13star.png", name: "GREENE", x: 420, y: 820, size: 1.3, t: T_GREENE + 0.4, until: S4 + 1.5 });
else B.plaque({ name: "MAJ. GEN. NATHANAEL GREENE", side: "carth", x: 300, y: 820, t: T_GREENE + 0.4, until: S4 + 1.5 });

// ---------- 4: dawn march, the rooting party ----------
const dawn = document.createElement("div");
dawn.className = "fx-layer"; dawn.style.background = "linear-gradient(90deg, rgba(20,24,48,0.42), rgba(60,50,70,0.25) 60%, rgba(255,190,120,0.18))";
document.getElementById("fx").appendChild(dawn); gsap.set(dawn, { autoAlpha: 0 });
tl.to(dawn, { autoAlpha: 1, duration: 1.2 }, S4 - 0.4);
tl.to(dawn, { autoAlpha: 0, duration: 3.0 }, T_FORM);
COL.forEach(([x, y], i) => B.move("b" + i, S4 + 0.4 + i * 0.1, 5.0, x + 380 - (i === 4 ? 0 : 0), y + (i < 4 ? 2 : 4)));
B.move("b4", T_ROAD, 2.2, 1030, 912);
B.unit({ id: "root1", side: "rome", x: 930, y: 1170, w: 34, h: 22, t: T_FORAGE - 0.3 });
B.unit({ id: "root2", side: "rome", x: 1010, y: 1210, w: 34, h: 22, t: T_FORAGE - 0.1 });
B.label("ROOTING PARTY", 970, 1265, { cls: "tg", size: 24, t: T_FORAGE, anchor: [-50, -50], until: T_FORM + 1 });
B.arrow({ side: "carth", pts: [[1040, 940], [1010, 1040], [985, 1130]], width: 12, t: T_FORAGE + 1.4, dur: 1.0, until: T_FORM + 1 });
B.grey(["root1", "root2"], T_SCOOP, 0.6);
B.label("CAPTURED", 1060, 1175, { cls: "tg", size: 26, t: T_SCOOP + 0.3, anchor: [0, -50], until: T_FORM + 1 });
B.hideUnits(["root1", "root2"], T_FORM + 0.8);

// Stewart forms his line in front of the camp
const REDLINE = { r1: [1430, 730], r2: [1430, 830], r3: [1430, 990], r4: [1430, 1090] };
// note: B.move centres with u.w (outer element width, unchanged) and u.h (current block height)
Object.entries(REDLINE).forEach(([k, [x, y]], i) => {
  tl.to(B.units[k].el.querySelector(".blk"), { width: 40, height: 84, duration: 1.2 }, T_FORM + i * 0.12);
  B.units[k].h = 84;
  B.move(k, T_FORM + i * 0.12, 1.8, x, y, "power2.out");
});

// ---------- 5: two lines, the militia holds ----------
const MIL = [[1120, 730], [1120, 830], [1120, 990], [1120, 1090]], CON = [[900, 740], [900, 840], [900, 980], [900, 1080]];
// column b0..b3 becomes the Continentals, fresh militia units deploy in front
[0, 1, 2, 3].forEach((i) => {
  tl.to(B.units["b" + i].el.querySelector(".blk"), { width: 40, height: 84, duration: 1.2 }, T_TWO - 0.4 + i * 0.1);
  B.units["b" + i].h = 84;
  B.move("b" + i, T_TWO - 0.4 + i * 0.1, 1.8, ...CON[i]);
});
B.move("b4", T_TWO, 1.6, 1120, 1170);
B.hideUnits(["b4"], T_MIL + 0.4);
MIL.forEach(([x, y], i) => B.unit({ id: "m" + i, side: "carth", x: x, y, w: 40, h: 84, t: T_MIL - 0.2 + i * 0.12 }));
MIL.forEach(([x, y], i) => gsap.set(B.units["m" + i].el.querySelector(".blk"), { backgroundColor: "#5b7fd0" }));
B.label("MILITIA", 1150, 670, { cls: "tg", size: 28, t: T_MIL, anchor: [-50, -50], until: T_17 - 0.4 });
B.label("CONTINENTALS", 900, 670, { cls: "tg", size: 28, t: T_CONT, anchor: [-50, -50], until: T_SENT - 0.2 });
B.label("AS AT GUILFORD", 1010, 1230, { cls: "tg", size: 24, t: T_GUIL - 0.3, anchor: [-50, -50], until: T_ASTON });
MIL.forEach(([x, y], i) => B.move("m" + i, T_OPEN - 1.2, 1.4, x + 60, y));
volley(MIL.flatMap(([x, y]) => [[x + 92, y - 22], [x + 92, y + 22]]), T_OPEN - 0.2, T_GAVE + 0.3, { dir: 1, period: 1.0 });
volley(Object.values(REDLINE).flatMap(([x, y]) => [[x - 36, y - 22], [x - 36, y + 22]]), T_OPEN, T_GAVE + 1.5, { dir: -1, period: 1.15 });
fireLines(MIL.map(([x, y]) => [[x + 100, y - 10], [1400, y - 10]]), T_OPEN, T_GAVE, "#1f4fc4");
fireLines(Object.values(REDLINE).map(([x, y]) => [[x - 30, y + 12], [1200, y + 12]]), T_OPEN + 0.3, T_GAVE + 0.6);
B.caption("THE MILITIA HOLDS", T_ASTON, T_GAVE, "carth");
B.bubble("17 ROUNDS!", 1070, 610, T_17 - 0.3, T_GAVE + 0.8);
MIL.forEach(([x, y], i) => B.move("m" + i, T_GAVE + 0.2 + i * 0.1, 2.2, 700, y + (i < 2 ? -40 : 40)));
tl.to(MIL.map((_, i) => B.units["m" + i].el), { autoAlpha: 0.45, duration: 1 }, T_GAVE + 0.4);
B.hideUnits(MIL.map((_, i) => "m" + i), S6 + 0.5, 1.0);

// ---------- 6: the bayonet charge ----------
const CONCHG = [[1340, 740], [1340, 840], [1340, 980], [1340, 1080]];
[0, 1, 2, 3].forEach((i) => B.move("b" + i, T_BAY - 0.8 + i * 0.08, 1.6, ...CONCHG[i], "power2.in"));
B.label("MARYLAND", 1150, 690, { cls: "tg", size: 26, t: T_MDVA - 0.2, anchor: [-50, -100], until: T_FLED });
B.label("VIRGINIA", 1150, 1135, { cls: "tg", size: 26, t: T_MDVA + 0.5, anchor: [-50, 0], until: T_FLED });
[[[930, 790], [1100, 790], [1310, 790]], [[930, 1030], [1100, 1030], [1310, 1030]]].forEach((pts, i) =>
  B.arrow({ side: "carth", pts, width: 20, t: T_BAY - 0.9 + i * 0.2, dur: 1.2, until: T_FLED + 0.5 }));
B.caption("BAYONETS", T_BAY - 0.2, T_FLED - 0.2, "carth");
const ROUT = { r1: [2400, 700], r2: [2440, 860], r3: [2420, 1010], r4: [2380, 1130] };
Object.entries(ROUT).forEach(([k, [x, y]], i) => {
  tl.to(B.units[k].el.querySelector(".blk"), { width: 60, height: 36, duration: 0.5 }, T_COLL);
  B.units[k].h = 36;
  B.move(k, T_COLL + 0.1 + i * 0.15, 3.2, x, y, "power2.out");
});
[[[1470, 760], [1700, 740], [1950, 700]], [[1470, 1030], [1700, 1050], [1950, 1080]]].forEach((pts, i) =>
  B.arrow({ side: "carth", pts, width: 22, t: T_FLED - 0.2 + i * 0.25, dur: 1.8, until: S7 + 1.0 }));
const CONCAMP = [[1600, 730], [1760, 800], [1620, 1000], [1780, 1060]];
[0, 1, 2, 3].forEach((i) => {
  tl.to(B.units["b" + i].el.querySelector(".blk"), { width: 64, height: 40, duration: 0.6 }, T_FLED);
  B.units["b" + i].h = 40;
  B.move("b" + i, T_FLED + 0.2 + i * 0.1, 3.0, ...CONCAMP[i]);
});
B.caption("VICTORY – FOR A FEW MINUTES", T_VICT, S7 + 0.4, "carth");

// ---------- 7: the camp is plundered; house and thicket hold ----------
B.hideUnits([0, 1, 2, 3].map((i) => "b" + i), T_BURST + 0.6, 0.6);
const SC = [];
for (let i = 0; i < 16; i++) SC.push([1540 + R() * 360, 660 + R() * 440]);
SC.forEach(([x, y], i) => {
  const yy = Math.abs(y - 905) < 30 ? y + 50 : y;
  B.unit({ id: "s" + i, side: "carth", x, y: yy, w: 26, h: 18, t: T_BURST + 0.4 + (i % 5) * 0.08 });
  B.move("s" + i, T_DISC + (i % 4) * 0.3, 2.4, x + (R() - 0.5) * 70, yy + (R() - 0.5) * 60);
  B.move("s" + i, T_EAT + (i % 3) * 0.4, 3.0, x + (R() - 0.5) * 90, yy + (R() - 0.5) * 80);
});
B.caption("THE CAMP IS PLUNDERED", T_DISC - 0.4, T_BARR - 0.4, "rome");
// British into the brick house
const houseRed = svgEl(`<rect x="1925" y="775" width="85" height="65" fill="#c4121f" opacity="0.55"/>`);
B.move("r2", T_BARR - 1.2, 2.2, 1968, 808);
tl.to(B.units.r2.el.querySelector(".blk"), { width: 40, height: 26, duration: 1.2 }, T_BARR);
tl.to(B.units.r2.el, { autoAlpha: 0, duration: 0.5 }, T_BARR + 1.6);
tl.to(houseRed, { autoAlpha: 1, duration: 0.8 }, T_BARR + 1.2);
const WIN = [[1932, 790], [1932, 825], [1968, 778], [1945, 840], [1990, 840]];
const TGT = [[1760, 700], [1720, 800], [1840, 690], [1700, 1000], [1860, 1040]];
fireLines(WIN.map((w, i) => [w, TGT[i]]), T_WIN - 0.6, END - 0.2);
B.label("FIRE FROM THE WINDOWS", 1968, 1150, { cls: "tg", size: 26, t: T_WIN, anchor: [-50, -50], until: END - 0.3 });
// Marjoribanks in the thicket
B.label("MARJORIBANKS", 2100, 640, { cls: "tg", size: 26, t: T_MARJ - 0.3, anchor: [-50, 0] });
tl.fromTo(B.units.rm.el, { scale: 1 }, { scale: 1.35, yoyo: true, repeat: 1, duration: 0.3, immediateRender: false }, T_MARJ);
fireLines([[[2060, 600], [1880, 700]], [[2070, 620], [1850, 780]], [[2040, 660], [1760, 880]]], T_OAK - 0.4, END - 0.2);
// routed British rally east of the house
Object.entries({ r1: [2330, 720], r3: [2360, 1000], r4: [2330, 1110] }).forEach(([k, [x, y]], i) => B.move(k, T_FLANK - 1.0 + i * 0.2, 2.2, x, y));
