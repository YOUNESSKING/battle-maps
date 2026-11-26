// S07 MOVE 3b: THE NIGHT MARCH TO PRINCETON (D 126.74 s, python3 washington/tools/scene_times.py S07 --words).
// Regions: trenton (z11, winter, night = S06's end), jersey (z10 wide, winter), princeton (z11, winter).
// Shots: trenton night: the decision card's B box lights on "He slipped away" (S06 shows the card through its end); two blue blocks + two guns
// stay at the creek by the fires, the rest of the line turns about and walks away into the dark -> dissolve jersey night: the column on the
// back road (Sandtown, Quaker Bridge, Saw Mill road) round the British left, the wind changes, frost spreads, THE MUD FROZE -> dawn on
// 3 January: the column comes up on Princeton, 12 MILES behind the British army, Mawhood's column leaves Princeton south-west on the post
// road -> dissolve princeton: the orchard: Mercer's blocks and Mawhood's face each other, the British volley + bayonet charge, Mercer's
// banner falls, his men about-face and fall back, the militia arrive behind and waver, Washington's banner rides out between the lines
// (30 YARDS), both lines fire, the banner still stands, the Americans advance, the British break -> Nassau Hall: a gun, the block greys ->
// result card -> dissolve trenton dawn: Cornwallis faces empty works, the fires die, the red arrow back north-east (no gun sound) -> method 3.
// Facts: washington/research/FACT_NOTES_jersey.md G2-G4, H1-H6, J (weather).
(() => {
const T = { D: 126.74,
  he: 0.41, slipped: 0.48, away: 0.74, notback: 1.9, river: 3.0, instead: 3.8, marched: 4.56, around: 4.92, behind: 6.44, about: 7.7, five: 8.16,
  stayed: 9.08, creek: 9.7, campfires: 10.56, dig: 12.1, noisily: 12.34, covering: 13.52, brooklyn: 15.44,
  rest: 16.74, marched2: 17.6, dark: 18.72, back: 19.82, road: 20.08, watching: 21.48, night: 22.94, wind: 23.36, changed: 23.62, weather: 24.84,
  bitter: 25.54, cold: 25.88, muddy: 27.0, roads: 27.22, froze: 27.7, hard: 28.04, time: 29.56, guns: 30.22, roll: 30.72,
  sunrise: 32.04, third: 33.2, january: 33.48, americans: 34.54, princeton: 35.88, twelve: 36.74, miles: 37.16, behind2: 37.56, army: 38.46,
  brigade: 40.0, marching: 41.1, out: 41.66, town: 42.1, join: 43.7, cornwallis: 44.04,
  american: 45.76, brigade2: 46.22, general: 47.12, hugh: 47.6, mercer: 47.92, ran: 48.26, orchard: 49.52, british: 50.76, fired: 51.08, volley: 51.72,
  charged: 52.32, bayonet: 53.26, mercers: 54.5, horse: 54.84, shot: 55.4, under: 56.02, surrounded: 57.26, bayoneted: 58.39, dead: 60.94,
  broke: 62.4, militia: 63.62, waver: 65.8,
  then: 66.99, washington: 67.06, rode: 67.66, forward: 68.12, between: 70.22, lines: 70.92, thirty: 72.09, yards: 72.38, britishB: 73.22,
  both: 74.28, fired2: 74.96, smoke: 76.34, cleared: 76.68, still: 77.62, saddle: 78.26,
  rallied: 80.0, drove: 81.66, field: 82.9, some: 83.94, fled: 84.48, college: 85.26, building: 85.64, surrendered: 87.52, broke2: 89.06, door: 89.94,
  lost: 91.34, hundreds: 91.7, killed: 93.04, captured: 94.64, almost: 95.2, two: 96.21, prisoner: 97.24, americans2: 98.58, fewer: 99.48, hundred: 100.28,
  generalM: 101.28, mercer2: 101.74, died: 102.08, nine: 103.24, later: 104.02,
  creek2: 105.5, cornwallis2: 106.22, woke: 106.68, empty: 107.3, dying: 108.38, campfires2: 108.74, heard: 110.18, cannon: 110.44, princeton2: 112.0,
  afraid: 113.22, brunswick: 114.62, rushed: 115.7, north: 116.84,
  third2: 118.64, method: 119.46, enemy: 120.66, trapped: 121.42, expect: 122.84, go: 123.32, not: 124.6 };
const TR = "trenton", JE = "jersey", PR = "princeton";
const N_ = -Math.PI / 2, S_ = Math.PI / 2, E_ = 0, W_ = Math.PI;

// ---------------- units ----------------
const units = [];
const U = (o) => { units.push({ type: "inf", n: 1, arrive: false, ...o }); return units.length - 1; };
// trenton = S06's end: the American line behind the works south of the Assunpink, two guns by the bridge; the British in the town
const BX = [1344.6, 1348.6, 1352.4, 1360.4, 1364.4, 1368.6];
const CUT1 = 16.6, CUT3 = 45.5, CUT4 = 83.9, CUT5 = 105.0;
BX.forEach((x, i) => { const y = 2076.3 + (i === 0 ? 0.5 : 0), stay = i === 2 || i === 3;
  if (stay) U({ side: "u", region: TR, face: N_, keys: [[0, x, y]], t1: CUT5 - 0.3 });   // about 500 men stay with the fires (gone by dawn)
  else U({ side: "u", region: TR, face: N_, keys: [[0, x, y], [6.8 + i * 0.25, x, y], [15.2 + i * 0.25, x + 1.2, y + 5.6]], t1: CUT1 + 0.4 }); });   // turn about, walk off south into the dark
[[1354.4, 2075.0], [1358.4, 2075.0]].forEach((g) => U({ side: "u", region: TR, type: "art", face: N_, keys: [[0, ...g]], t1: CUT5 - 0.3 }));
// the British (all night, and at dawn): S06's final positions; at dawn they turn about and march back north-east
const RPOS = [[1354.4, 2060.4], [1356.6, 2059.5], [1358.8, 2058.6], [1346.0, 2058.0], [1351.0, 2055.0], [1363.0, 2058.6], [1368.4, 2061.0]];
RPOS.forEach((p, i) => U({ side: "r", region: TR, face: S_, keys: [[0, ...p], [117.6 + 0.3 * (i % 4), ...p], [T.D, p[0] + 2.6, p[1] - 4.2]] }));

// jersey: the British army at Trenton (north of the creek), the American column on the back road
const TRj = [677.9, 1027.3], PRj = VX.place("Princeton, NJ", JE);
[[675.0, 1025.0], [681.5, 1022.5]].forEach((p) => U({ side: "r", region: JE, n: 2, face: S_ + 0.5, keys: [[0, ...p]] }));
const SAND = VX.road(JE, "Sandtown road"), QB = VX.road(JE, "Quaker Bridge road"), SAW = VX.road(JE, "Saw Mill road");
const qbi = QB.findIndex((p) => p[1] < 1006.5);
const ROUTE = [...SAND.slice(2), ...QB.slice(qbi + 1), ...SAW.slice(1, -14)];
const RL = VX.len(ROUTE);
const SANDL = VX.len(SAND.slice(2)), QBL = SANDL + VX.len(QB.slice(qbi));
[0, 1, 2].forEach((i) => U({ side: "u", region: JE, face: 0, t0: CUT1 + 0.2 + i * 0.4, t1: 31.6, keys: VX.march(VX.sub(ROUTE, 14 - i * 6, QBL - 4 - i * 6), CUT1 + 0.4, 4.4) }));   // night: Sandtown -> Quaker Bridge
const SAWS = QBL + 2;
[0, 1, 2].forEach((i) => U({ side: "u", region: JE, face: 0, t0: 31.7 + i * 0.3, keys: VX.march(VX.sub(ROUTE, SAWS - i * 6, RL - 2 - i * 6), 32.0, 1.9) }));   // dawn: the Saw Mill road toward Princeton
// Mawhood's brigade leaves Princeton south-west on the post road (3 January)
const POST = VX.road(JE, "New York post road");
const postAt = (s) => { const L = VX.len(POST), g = VX.along(POST, L - s); return [g[0], g[1]]; };   // s = distance from the Princeton end
U({ side: "r", region: JE, n: 2, face: Math.atan2(postAt(14)[1] - postAt(4)[1], postAt(14)[0] - postAt(4)[0]), t0: 40.6, keys: [[0, ...postAt(6)], [T.marching, ...postAt(6)], [CUT3 - 0.2, ...postAt(18)]] });

// princeton: the orchard (William Clarke's), Mercer v Mawhood, the militia, Washington between the lines, Nassau Hall
const OX = 1485.9, RY0 = 1847.0, RY1 = 1850.2, RY2 = 1851.9, BY0 = 1858.6, BY1 = 1853.6, BY2 = 1856.4, MY = 1858.8, AY = 1854.6;
const red = [1484.2, 1487.6].map((x, i) => U({ side: "r", region: PR, face: S_, t0: CUT3 + 0.2, bw: 0.6,
  keys: [[0, x, RY0], [CUT3 + 0.8, x, RY0], [50.4 + i * 0.2, x, RY1], [T.charged, x, RY1], [54.6 + i * 0.2, x, RY2], [81.8 + i * 0.4, x, RY2], [85.6 + i * 0.4, x - 1.0, RY2 - 6.0]], t1: CUT4 + 0.5 }));
const merc = [1484.2, 1487.6].map((x, i) => U({ side: "u", region: PR, face: N_, t0: CUT3 + 0.2,
  keys: [[0, x, BY0], [CUT3 + 0.6, x, BY0], [50.0 + i * 0.2, x, BY1], [63.0 + i * 0.3, x, BY1], [66.8 + i * 0.3, x, BY2], [T.rallied + 0.2 + i * 0.2, x, BY2], [83.4 + i * 0.2, x, AY]], t1: CUT4 + 0.5 }));
const mil = [1481.0, 1490.8].map((x, i) => U({ side: "u", region: PR, face: N_, t0: T.militia - 0.4 + i * 0.3, arrive: true,
  keys: [[0, x, MY + 2.4], [T.militia + 0.2, x, MY + 2.4], [T.waver - 0.2 + i * 0.3, x, MY], [T.rallied + 0.4 + i * 0.2, x, MY], [83.6 + i * 0.2, x, AY]], t1: CUT4 + 0.5 }));
// Nassau Hall: the last British inside, a gun, the white flag (grey)
const NH = [1509.5, 1819.9];
U({ side: "r", region: PR, face: S_, bw: 0.6, t0: CUT4 - 0.4, keys: [[0, NH[0], NH[1] + 1.3]], cap: T.door - 0.1 });
U({ side: "u", region: PR, face: Math.atan2(-0.8, 0.6), t0: CUT4 - 0.4, keys: [[0, 1507.0, 1824.6]] });
U({ side: "u", region: PR, face: Math.atan2(-0.8, -0.6), t0: CUT4 - 0.4, keys: [[0, 1512.2, 1824.8]] });
const NG = [1509.6, 1825.0];
U({ side: "u", region: PR, type: "art", face: N_, t0: CUT4 - 0.4, keys: [[0, ...NG]] });

// ---------------- fx ----------------
const VO = { size: 0.75, alpha: 0.085, life: 9, muzzle: 5, rate: 3.0, roll: 0.6, height: 2.0 };
const line = (x, y, w = 0.45) => [[x - w, y], [x + w, y]];
const fx = {
  volleys: [
    // the orchard: the British volley ("fired a volley"), Mercer's men answer once
    ...[1484.2, 1487.6].map((x, i) => ({ region: PR, pts: line(x, RY1 + 0.35), t0: T.fired + 0.15 + i * 0.25, t1: T.fired + 0.9 + i * 0.25, every: 2, opts: { ...VO, dir: [0, 1], volley: 2 } })),
    ...[1484.2, 1487.6].map((x, i) => ({ region: PR, pts: line(x, BY1 - 0.35), t0: T.bayonet + 0.45 + i * 0.3, t1: T.bayonet + 1.1 + i * 0.3, every: 2, opts: { ...VO, dir: [0, -1], volley: 2 } })),
    // both sides fire with Washington between them
    ...[1484.2, 1487.6].map((x, i) => ({ region: PR, pts: line(x, RY2 + 0.35), t0: T.both + 0.1 + i * 0.2, t1: T.both + 0.8 + i * 0.2, every: 2, opts: { ...VO, dir: [0, 1], volley: 2 } })),
    ...[1481.0, 1490.8].map((x, i) => ({ region: PR, pts: line(x, MY - 0.35), t0: T.both + 0.5 + i * 0.2, t1: T.both + 1.2 + i * 0.2, every: 2, opts: { ...VO, dir: [0, -1], volley: 2 } })),
    ...[1484.2, 1487.6].map((x, i) => ({ region: PR, pts: line(x, BY2 - 0.35), t0: T.both + 0.65 + i * 0.2, t1: T.both + 1.3 + i * 0.2, every: 2, opts: { ...VO, dir: [0, -1], volley: 2 } })),
    // the advance: one more American volley as the British break
    ...[1481.0, 1490.8].map((x, i) => ({ region: PR, pts: line(x, MY - 3.2), t0: 82.0 + i * 0.3, t1: 82.7 + i * 0.3, every: 2, opts: { ...VO, dir: [0, -1], volley: 2 } })),
  ],
  guns: [{ region: PR, h: 0.3, opts: { plume: 0.45, puffs: 7, alpha: 0.2, jet: 1.4 },
    shots: [86.5, 88.55].map((t, i) => ({ t, at: NG, dir: [0, -1], impact: [NH[0] + (i ? 0.4 : -0.3), NH[1] + 0.2], delay: 0.25 })), impactOpts: { size: 0.6 } }],
  campfires: [
    // S06's fires: the town + the fields north of the creek (British) and the south bank (American, kept burning, dying by dawn)
    { region: TR, pts: [[1344.2, 2060.4], [1348.6, 2057.2], [1352.0, 2061.6], [1360.6, 2061.2], [1364.4, 2057.0], [1369.4, 2063.0], [1373.6, 2058.6], [1356.4, 2058.8], [1366.0, 2064.6], [1342.0, 2054.6]],
      t0: -1, t1: 112.0, opts: { size: 2.0, glowSize: 7 } },
    { region: TR, pts: [[1346.0, 2078.2], [1350.6, 2078.8], [1355.6, 2078.6], [1361.4, 2078.4], [1366.2, 2078.6], [1371.0, 2078.0], [1375.6, 2077.6]],
      t0: -1, t1: T.dying + 0.4, opts: { size: 2.0, glowSize: 7 } },
    { region: JE, pts: [[674.0, 1022.0], [679.0, 1020.0], [684.0, 1024.0], [671.0, 1026.0]], t0: -1, t1: 31.5, opts: { glowSize: 4 } },
    { region: JE, pts: [[672.0, 1036.0], [678.0, 1037.6], [684.0, 1038.4]], t0: -1, t1: 31.5, opts: { glowSize: 4 } },
  ],
};

// ---------------- arrows ----------------
const arrows = [
  { side: "u", region: JE, pts: [...VX.sub(ROUTE, 0, RL - 8).filter((_, i, a) => i % Math.max(1, Math.floor(a.length / 14)) === 0)], t0: T.back - 0.05, dur: 2.6, t1: 31.4, width: 0.5, maxWidth: 0.5 },
  { side: "r", region: JE, pts: [postAt(4), postAt(14), postAt(22)], t0: T.marching - 0.05, dur: 1.6, t1: CUT3 - 0.3, width: 0.5, maxWidth: 0.5 },
  { side: "r", region: PR, pts: [[OX, RY1 + 0.9], [OX, RY2 + 1.2], [OX, BY1 - 1.2]], t0: T.charged - 0.05, dur: 1.0, t1: T.mercers, width: 0.18 },
  { side: "u", region: PR, pts: [[OX, MY - 0.6], [OX, BY1 + 0.2], [OX, RY2 + 1.6]], t0: T.rallied + 0.2, dur: 1.4, t1: CUT4 - 0.2, width: 0.18 },
  { side: "r", region: TR, pts: [[1360.0, 2054.0], [1366.0, 2046.0], [1373.0, 2036.0], [1378.0, 2026.0]], t0: T.rushed - 0.05, dur: 1.8, t1: T.D + 1, width: 0.22 },
];

// ---------------- generals ----------------
const US = "seq/grand_union_flag.png", GB = "seq/gb1707_union_flag.png";
const generals = {
  washington: { img: "seq/washington.png", flag: US, side: "us", name: "Washington", full: "George Washington", role: "General" },
  mercer: { img: "seq/mercer.png", flag: US, side: "us", name: "Mercer", full: "Hugh Mercer", role: "Brigadier General" },   // no likeness of the general: initials HM
  cornwallis: { img: "seq/cornwallis.png", flag: GB, side: "cs", name: "Cornwallis", full: "Charles Cornwallis", role: "Lieutenant General" },
};
const banners = [
  { general: "washington", region: TR, keys: [[0, 1356.4, 2079.0], [6.8, 1356.4, 2079.0], [14.0, 1357.4, 2083.6]], t0: -1, t1: CUT1 + 0.3 },
  { general: "washington", region: JE, keys: VX.march(VX.sub(ROUTE, 18, QBL), CUT1 + 0.4, 4.4).map((k) => [k[0], k[1] + 4, k[2] - 3]), t0: CUT1 + 0.6, t1: 31.6 },
  { general: "washington", region: JE, keys: VX.march(VX.sub(ROUTE, SAWS + 4, RL), 32.0, 1.9).map((k) => [k[0], k[1] + 4, k[2] - 3]), t0: 31.8, t1: CUT3 },
  { general: "mercer", region: PR, keys: [[0, 1485.9, BY1 + 1.4]], t0: T.mercer - 0.05, t1: T.broke + 0.8, fall: T.shot + 0.05 },
  { general: "washington", region: PR, keys: [[0, OX, MY + 1.6], [T.rode, OX, MY + 1.6], [T.lines, OX, RY2 + 1.5], [T.rallied + 0.2, OX, RY2 + 1.5], [83.6, OX, AY - 0.6]], t0: T.washington - 0.05, t1: CUT4 + 0.4 },
  { general: "cornwallis", region: TR, keys: [[0, 1361.6, 2063.4], [117.6, 1361.6, 2063.4], [T.D, 1364.0, 2059.6]], t0: T.cornwallis2 - 0.05, t1: T.D + 1 },
];

// ---------------- labels ----------------
const labels = [
  { text: "Princeton", at: [PRj[0], PRj[1] - 5], region: JE, size: 20, t0: T.princeton - 0.05, t1: T.princeton + 3.6 },
  { text: "Nassau Hall", at: [NH[0], NH[1] - 2.0], region: PR, size: 17, t0: T.college - 0.05, t1: T.college + 3.6 },
  { text: "Princeton", at: [1442.0, 2040.0], region: TR, size: 17, t0: T.princeton2 - 0.3, t1: T.princeton2 + 3.0 },
];

// ---------------- frost (the night of 2-3 January), result card, stamp ----------------
const FROST = VX.rain([[0, 0], [T.wind - 0.2, 0], [T.froze + 0.4, 0.9], [31.4, 0.9], [31.6, 0]], { n: 1, veil: "198,214,232", slant: 0 });
const RCSS = `.aj-res{position:absolute;left:330px;top:170px;width:1260px;height:640px;color:#EEE7D6;text-align:center;font-family:"GM Cormorant",Georgia,serif;
  background:linear-gradient(180deg,#232b33 0%,#182027 60%,#141a20 100%);box-shadow:0 14px 40px rgba(0,0,0,.7),inset 0 0 0 4px #151E25,inset 0 0 0 5.5px rgba(201,178,122,.85)}
.aj-res .hd{position:absolute;left:0;right:0;top:44px;font-family:"GM Cinzel",serif;font-weight:700;font-size:28px;letter-spacing:.42em;color:#C9B27A;padding-left:.42em}
.aj-res .col{position:absolute;top:120px;width:560px}.aj-res .c1{left:40px}.aj-res .c2{right:40px}
.aj-res .sd{font-family:"GM Cinzel",serif;font-weight:700;font-size:30px;letter-spacing:.3em;padding-left:.3em}
.aj-res .c1 .sd{color:#D9867A}.aj-res .c2 .sd{color:#9FB8DC}
.aj-res .nb{font-family:"GM Cinzel",serif;font-weight:700;font-size:150px;line-height:1.05;letter-spacing:.02em;
  background:linear-gradient(180deg,#fff1c4,#e8c46c 45%,#b98a35 70%,#f0d28a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 4px rgba(0,0,0,.7))}
.aj-res .nt{font-style:italic;font-weight:600;font-size:31px;color:#E8E0CC;margin-top:4px}
.aj-res .gn{font-family:"GM Cinzel",serif;font-weight:700;font-size:24px;letter-spacing:.22em;color:#D9867A;margin-top:10px}
.aj-res .vr{position:absolute;left:629px;top:130px;width:1.5px;height:300px;background:linear-gradient(180deg,transparent,#C9B27A,transparent)}
.aj-res .ft{position:absolute;left:0;right:0;top:486px;font-family:"GM Cinzel",serif;font-weight:700;font-size:38px;letter-spacing:.2em;padding-left:.2em;color:#EEE7D6}
.aj-res .src{position:absolute;left:0;right:0;top:560px;font-style:italic;font-weight:500;font-size:22px;color:#B7A57C}`;
function buildResult(c) { const st = document.createElement("style"); st.textContent = RCSS; document.head.appendChild(st);
  const host = document.querySelector("#ov .gmo") || document.getElementById("ov"), el = document.createElement("div"); el.className = "aj-res";
  el.innerHTML = `<div class="hd">Princeton · 3 January 1777</div><div class="col c1"><div class="sd">British</div><div class="nb" style="font-size:92px;line-height:1.75">HUNDREDS</div><div class="nt">killed, wounded or captured</div><div class="gn">almost 200 taken prisoner</div></div>
    <div class="vr"></div><div class="col c2"><div class="sd">Americans</div><div class="nb" style="font-size:92px;line-height:1.75">&lt; 100</div><div class="nt">fewer than a hundred lost</div></div>
    <div class="ft" style="font-size:32px">General Mercer died of his wounds</div><div class="src">nine days later · American Battlefield Trust; Fischer, Washington's Crossing</div>`;
  host.appendChild(el); const tl = c.tl, gs = window.gsap, on = (sel, t) => { const e = el.querySelector(sel); gs.set(e, { autoAlpha: 0 }); tl.fromTo(e, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", immediateRender: false }, t); };
  gs.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, T.lost - 0.4); tl.to(el, { autoAlpha: 0, duration: 0.45 }, CUT5 - 0.4);
  on(".c1 .sd", T.lost - 0.3); on(".c1 .nb", T.hundreds); on(".c1 .nt", T.killed); on(".c1 .gn", T.almost); on(".vr", T.americans2 - 0.3); on(".c2 .sd", T.americans2 - 0.2);
  on(".c2 .nb", T.fewer); on(".c2 .nt", T.hundred); on(".ft", T.generalM - 0.05); on(".src", T.nine - 0.05); }
const PINS = [];
function stamp(c, text, t0, t1, world, region) {
  const host = document.querySelector("#ov .gmo") || document.getElementById("ov"), el = document.createElement("div");
  el.style.cssText = "position:absolute;left:0;top:0;z-index:40;pointer-events:none;width:0;height:0";
  el.innerHTML = `<span class="stamp" style="position:absolute;left:0;top:0;transform:translate(-50%,-50%);color:#A8261B;font-size:46px;padding:6px 20px 4px;border-width:4px;white-space:nowrap;background:rgba(240,230,205,.55)">${text}</span>`;
  host.appendChild(el); window.gsap.set(el, { autoAlpha: 0 });
  c.tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, t0);
  c.tl.fromTo(el.firstChild, { scale: 2.3, rotation: -14, opacity: 0 }, { scale: 1, rotation: -6, opacity: 0.94, duration: 0.24, ease: "power4.in", immediateRender: false }, t0);
  c.tl.to(el, { autoAlpha: 0, duration: 0.5 }, t1); PINS.push({ el, world, region }); }

// ---------------- camera ----------------
const NI = 0.8;
const K = (t, region, at0, dist, tilt, yaw, ease = "io", night = 0, o = {}) => ({ t, region, at: at0, dist, tilt, yaw, fov: 30, ease, night, ...o });
window.SEQ = {
  grade: { wide: { toe: 14, ct: 1.03, sat: 1.04 } },
  name: "S07", D: T.D, T, seed: 1777, date: "1777-01-03",
  regions: [TR, JE, PR],
  regionOpts: { [JE]: { troopScale: 6 }, [TR]: { troopScale: 1.6 }, [PR]: { troopScale: 1.6 } },
  features: { [JE]: { bridges: [0, 1, 2, 3, 4, 5, 6].map(() => ({ hidden: true })), houseK: 0.35 } },
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  keys: [
    // 1. trenton night (= S06's last frame), down onto the creek
    K(0, TR, [1353.0, 2071.0], 58, 42, 0, "io", NI),
    K(7.0, TR, [1355.0, 2072.6], 38, 46, 0, "io", NI),
    K(CUT1, TR, [1356.4, 2073.8], 30, 48, 2, "lin", NI),
    // 2. jersey night: the back road round the British left; the frost
    K(CUT1, JE, [708, 1024], 140, 44, 0, "cut", 0.8, { dissolve: 0.9 }),
    K(25.0, JE, [716, 1012], 140, 45, 4, "lin", 0.8),
    K(31.7, JE, [726, 996], 135, 45, 6, "lin", 0.7),
    // 3. dawn, 3 January: up on Princeton; Mawhood's column leaves the town
    K(31.75, JE, [733, 950], 92, 46, -20, "cut", 0.3, { dissolve: 0.9 }),
    K(36.0, JE, [735, 946], 90, 46, -22, "io", 0.1),
    K(CUT3, JE, [740, 936], 85, 47, -24, "lin", 0.05),
    // 4. princeton: the orchard
    K(CUT3, PR, [OX, 1855.0], 13, 55, 0, "cut", 0.05, { dissolve: 0.9 }),
    K(55.0, PR, [OX, 1854.6], 11.5, 57, 2, "io", 0.03),
    K(66.0, PR, [OX, 1855.4], 12.5, 56, 0, "io", 0),
    K(74.0, PR, [OX, 1855.0], 11.5, 57, -2, "io", 0),
    K(CUT4, PR, [OX, 1853.4], 15, 55, 0, "lin", 0),
    // 5. Nassau Hall, then the result card over the town
    K(CUT4, PR, [NH[0], 1822.8], 9.5, 56, 4, "cut", 0, { dissolve: 0.9 }),
    K(91.0, PR, [NH[0], 1823.0], 9.0, 57, 0, "lin", 0),
    K(CUT5, PR, [NH[0] - 2.0, 1826.0], 24, 52, 0, "io", 0),
    // 6. trenton dawn: Cornwallis, empty works, the march back north-east; method card
    K(CUT5, TR, [1357.0, 2066.0], 30, 48, 0, "cut", 0.15, { dissolve: 0.9 }),
    K(113.0, TR, [1358.0, 2064.0], 26, 49, 4, "io", 0.06),
    K(T.D, TR, [1361.0, 2058.0], 32, 47, 6, "io", 0.02),
  ],
  clouds: { [JE]: { scatter: { seed: 7 }, keepClear: [[720, 980, 70, 1, 0.8]] }, [TR]: { shadows: true }, [PR]: { shadows: true } },
  units, arrows, banners, fx, generals, labels,
  overlay: [
    ["plaque.date", 0.4, { month: "January 1777", day: "2", weekday: "Thursday", note: "night" }],
    // the decision card continues from S06 (shown through S06's end): the real choice (B) lights on "He slipped away"
    ["engage.decide", { t: 0, sub: "2 JANUARY 1777 · YOU ARE WASHINGTON", a: "HOLD THE CREEK\nAND FIGHT", b: "SLIP AWAY\nIN THE NIGHT", real: "b",
      tA: 0, tB: 0, tNote: 0, tCount: 0, tReveal: 0.3, until: 2.0, dim: 0.55 }],
    ["label", T.five - 0.05, T.covering + 1.2, { name: "About 500 men", sub: "keep the fires burning and dig", world: [1356.4, 2079.6], side: "us", marker: false }],
    ["plaque.note", T.changed - 0.05, "the wind changes · hard frost"],
    (O, c) => stamp(c, "THE MUD FROZE", T.froze - 0.05, 31.3, [728.0, 990.0], JE),
    ["plaque.date", T.third - 0.05, { month: "January 1777", day: "3", weekday: "Friday", note: "sunrise" }],
    ["distance", T.twelve - 0.05, T.brigade - 0.3, { from: [TRj[0] + 2, TRj[1] - 2], to: [740.0, 934.0], value: 12, countFrom: 12, unit: "MILES", sub: "behind the British army", dash: false }],
    ["plaque.note", CUT3 + 0.6, "Princeton · the orchard"],
    ["distance", T.thirty - 0.05, T.both - 0.2, { from: [OX + 0.2, RY2 + 1.5], to: [OX + 0.2, RY2 + 0.4], value: 30, countFrom: 30, unit: "YARDS", sub: "from the British line", dash: false }],
    ["film.dim", T.lost - 0.6, CUT5 - 0.3, 0.8],
    ["plaque.note", CUT5 + 0.4, "dawn · the creek"],
    ["plaque.note", T.heard - 0.05, "guns heard from Princeton"],
    ["letter", 117.9, T.D + 1, { header: "Move 3 · Princeton", title: "The Washington Method", sub: "1. Save the army first · 2. Hit them where they rest", marks: false, quote: "3. Go where they are not", qSize: 34, height: 300,
      cps: 30, qAt: T.go - 0.05, lag: 0.05, stagger: 0.06, partDur: 0.35 }],
  ],
  build: (c) => { FROST.build(c); buildResult(c); },
  draw: (t, c) => { FROST.draw(t, c); const reg = c.world.cameraAt(t).region, sc = 1920 / c.world.renderer.domElement.width * (c.world.renderer.getPixelRatio ? c.world.renderer.getPixelRatio() : 1);
    for (const p of PINS) { if (p.region !== reg) { p.el.style.visibility = "hidden"; continue; } p.el.style.visibility = "";
      const s = c.world.projectMap(p.world[0], p.world[1], 0.3); p.el.style.transform = `translate(${(s.x * sc).toFixed(1)}px,${(s.y * sc).toFixed(1)}px)`; } },
};
})();
