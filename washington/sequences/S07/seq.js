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
  else U({ side: "u", region: TR, face: N_, keys: [[0, x, y], [6.8 + i * 0.25, x, y], [17.4 + i * 0.25, +(x + 1.2 + Math.max(0, x - 1356.4) * 5.6 * 0.025).toFixed(2), y + 5.6]], t1: CUT1 - 0.05 }); });   // turn about, walk off south into the dark; v2 r3: fade out WHILE walking, before the 16.6 dissolve (no turn-back inside it), slight inward walk (frame edge)
[[1354.4, 2075.0], [1358.4, 2075.0]].forEach((g) => U({ side: "u", region: TR, type: "art", face: N_, keys: [[0, ...g]], t1: CUT5 - 0.3 }));
// the British (all night, and at dawn): S06's final positions; at dawn they turn about and march back north-east
const RCX = 1360.0, RKR = 0.04;
const RPOS = [[1354.4, 2060.4], [1356.6, 2059.5], [1358.8, 2058.6], [1346.0, 2058.0], [1351.0, 2055.0], [1363.0, 2058.6], [1368.4, 2061.0]];
RPOS.forEach((p, i) => U({ side: "r", region: TR, face: S_, keys: [[0, ...p], [117.6 + 0.3 * (i % 4), ...p], [T.D, +(p[0] + (p[0] - RCX) * 4.6 * RKR).toFixed(2), p[1] - 4.6]] }));   // v2 r3: walk slightly outward (front on velocity at the frame edges)

// jersey: the British army at Trenton (north of the creek), the American column on the back road
const TRj = [677.9, 1027.3], PRj = VX.place("Princeton, NJ", JE);
[[673.0, 1025.8], [676.4, 1024.6], [680.0, 1023.2], [683.4, 1022.0]].forEach((p) => U({ side: "r", region: JE, n: 1,   /* V2: one block per unit */ face: S_ + 0.5, keys: [[0, ...p]] }));
const SAND = VX.road(JE, "Sandtown road"), QB = VX.road(JE, "Quaker Bridge road"), SAW = VX.road(JE, "Saw Mill road");
const qbi = QB.findIndex((p) => p[1] < 1006.5);
const ROUTE = [...SAND.slice(2), ...QB.slice(qbi + 1), ...SAW.slice(1, -14)];
const RL = VX.len(ROUTE);
const SANDL = VX.len(SAND.slice(2)), QBL = SANDL + VX.len(QB.slice(qbi));
// owner rule: no columns. Night: ONE wide line block (2 boxes) out of Trenton east on the Sandtown road (stop -> turn in place -> walk)
const NA = [690.0, 1042.6], NB = [712.0, 1046.4];
const fA = Math.atan2(NB[1] - NA[1], NB[0] - NA[0]);
const pA = [-Math.sin(fA) * 1.25, Math.cos(fA) * 1.25];   // V2: two single-block units abreast (1.25 block widths apart)
[-1, 1].forEach((sg, i) => { const o = (p) => [p[0] + pA[0] * sg, p[1] + pA[1] * sg];
  U({ side: "u", region: JE, n: 1, face: fA, t0: CUT1 + 0.2 + i * 0.12, t1: 31.6, keys: [[0, ...o(NA)], [CUT1 + 0.8 + i * 0.12, ...o(NA)], [27.0 + i * 0.12, ...o(NB)], [T.D, ...o(NB)]] }); });
// dawn: the same wide line block up the Saw Mill road toward Princeton (a new shot after the dissolve)
const DA = [734.4, 956.0], DB = [739.4, 938.4], fD = Math.atan2(DB[1] - DA[1], DB[0] - DA[0]);
const pD = [-Math.sin(fD) * 1.25, Math.cos(fD) * 1.25];
[-1, 1].forEach((sg, i) => { const o = (p) => [p[0] + pD[0] * sg, p[1] + pD[1] * sg];
  U({ side: "u", region: JE, n: 1, face: fD, t0: 31.7 + i * 0.12, keys: [[0, ...o(DA)], [32.4 + i * 0.12, ...o(DA)], [CUT3 - 1.6 + i * 0.12, ...o(DB)]] }); });   // v2 r3: halt + turn-back done before the dissolve
// Mawhood's brigade leaves Princeton south-west on the post road (3 January)
const POST = VX.road(JE, "New York post road");
const postAt = (s) => { const L = VX.len(POST), g = VX.along(POST, L - s); return [g[0], g[1]]; };   // s = distance from the Princeton end
const MW0 = postAt(38), MWR = 0.45, MW1 = (() => { const q = postAt(43), dx = q[0] - MW0[0], dy = q[1] - MW0[1], c = Math.cos(MWR), s = Math.sin(MWR); return [MW0[0] + dx * c - dy * s, MW0[1] + dx * s + dy * c]; })();   // v2 r3: turned MWR rad off the road line so the front stays on the velocity (wide-frame perspective)
U({ side: "r", region: JE, n: 1, face: Math.atan2(MW1[1] - MW0[1], MW1[0] - MW0[0]), t0: 40.0, keys: [[0, ...MW0], [41.3, ...MW0], [44.3, ...MW1]] });   // v2 r3: face = the walk, halts before the 45.5 dissolve

// princeton: the orchard (William Clarke's), Mercer v Mawhood, the militia, Washington between the lines, Nassau Hall
const MY2 = 1857.0;   // v2 r3: the militia's advance (behind Mercer's men, ends by CUT4 - 1.3)
const OX = 1485.9, RY0 = 1848.0, RY1 = 1850.2, RY2 = 1851.3, BY0 = 1858.6, BY1 = 1853.6, BY2 = 1856.4, MY = 1858.8, AY = 1854.6;
// V2 r3: ONE block per unit (multi-block units spiked the wheel rate to 86-119 deg/s at small troopScale; single blocks <= 41 deg/s),
// three single-block units side by side per v1 line (1.07 u apart), staggered 0.12 s
// v2 r3 (critic A #15 / #17): a N-S walk off the frame centre keeps its front on its velocity only if it walks slightly outward
// (the engine sets the front so the long side is square to the ON-SCREEN velocity; perspective splays the screen verticals):
// RX(x, dy) = the x a unit starting at x reaches after dy units north (dy < 0 = south), KR tuned on check_troops_motion
const KR = 0.06, RX = (x, dy) => +(x + (x - OX) * dy * KR).toFixed(3);
const LX = (a, dx = 1.07) => a.flatMap((x0, i0) => [-1, 0, 1].map((k) => [x0 + k * dx, i0 + (k + 1) * 0.12]));
const red = LX([1483.95, 1487.85], 1.19).map(   // v2 r3 fix (A R6): +0.12 u per block (they touched)
  ([x, i]) => U({ side: "r", region: PR, face: S_, t0: CUT3 + 0.2, n: 1,
  keys: [[0, x, RY0], [CUT3 + 1.5 + i * 0.1, x, RY0], [50.6 + i * 0.1, RX(x, RY0 - RY1), RY1], [T.charged, RX(x, RY0 - RY1), RY1], [54.6 + i * 0.2, RX(x, RY0 - RY2), RY2]], t1: 83.4 }));   // v2 r3 (A #16 / #17): faded in facing south, a 1 s hold, then walk in; driven off = fade on "field" (no about-face across the 83.9 dissolve)
const merc = LX([1484.2, 1487.6]).map(([x, i]) => U({ side: "u", region: PR, face: N_, t0: CUT3 + 0.2, n: 1,
  keys: [[0, x, BY0], [CUT3 + 0.6, x, BY0], [50.0 + i * 0.2, x, BY1], [63.0 + i * 0.3, x, BY1], [66.8 + i * 0.3, x, BY2], [79.4 + i * 0.1, x, BY2], [82.5 + i * 0.1, RX(x, BY2 - AY), AY]], t1: CUT4 + 0.5 }));   // v2 r3 (A #16): the advance ends by CUT4 - 1.3
const mil = LX([1481.0, 1490.8]).map(([x, i]) => U({ side: "u", region: PR, face: N_, t0: T.militia - 0.4 + i * 0.3, arrive: false, n: 1,
  keys: [[0, x, MY + 2.4], [T.militia + 0.2, x, MY + 2.4], [T.waver - 0.2 + i * 0.3, RX(x, 2.4), MY], [79.4 + i * 0.1, RX(x, 2.4), MY], [82.5 + i * 0.1, RX(x, 2.4 + MY - MY2), MY2]], t1: CUT4 + 0.5 }));
// Nassau Hall: the last British inside, a gun, the white flag (grey)
const NH = [1509.5, 1819.9];
U({ side: "r", region: PR, face: S_, t0: CUT4 - 0.4, keys: [[0, NH[0], NH[1] + 1.3]], cap: 90.55 });
U({ side: "u", region: PR, face: Math.atan2(-0.8, 0.6), t0: CUT4 - 0.4, keys: [[0, 1507.0, 1824.6]] });
U({ side: "u", region: PR, face: Math.atan2(-0.8, -0.6), t0: CUT4 - 0.4, keys: [[0, 1512.2, 1824.8]] });
const NG = [1509.6, 1825.0];
U({ side: "u", region: PR, type: "art", face: N_, t0: CUT4 - 0.4, keys: [[0, ...NG]] });   // v2 r1: default size (v14 scale)

// ---------------- fx ----------------
// V2: the v14 musketry (vicksburg/sequences/S09_gm SMK) scaled to this framing: k = our frame width / v14's (11 u / 27.3 u = 0.4);
// fxScale 9 x k in regionOpts shrinks the puffs; clusters / height / muzzle x k; rate / k (same puffs per on-screen length); each volley
// lasts >= 2.2 s (one 1.6 s ripple + the next) so the curtain builds (a 0.7 s volley gave ONE puff: rate x length x time)
const KF = 0.63;   // dist 18: 17.1 u / 27.3 u
const VO = { size: 0.85, alpha: 0.13, life: 11, muzzle: 5 * KF, windK: 1.1, rate: 2.9 / KF, volley: 1.6, roll: 0.9, height: 2.4 * KF, cluster: [2.6 * KF, 1.4 * KF] };
const line = (x, y, w = 1.1) => [[x - w, y], [x + w, y]];
const fx = {
  volleys: [
    // the orchard: the British volley ("fired a volley"), Mercer's men answer once
    ...[1484.2, 1487.6].map((x, i) => ({ region: PR, pts: line(x, RY1 + 0.35), t0: T.fired + 0.15 + i * 0.25, t1: T.fired + 2.4 + i * 0.25, opts: { ...VO, dir: [0, 1] } })),
    ...[1484.2, 1487.6].map((x, i) => ({ region: PR, pts: line(x, BY1 - 0.35), t0: T.bayonet + 0.45 + i * 0.3, t1: T.bayonet + 2.6 + i * 0.3, opts: { ...VO, dir: [0, -1] } })),
    // both sides fire with Washington between them
    ...[1484.2, 1487.6].map((x, i) => ({ region: PR, pts: line(x, RY2 + 0.35), t0: T.both + 0.1 + i * 0.2, t1: T.both + 2.4 + i * 0.2, opts: { ...VO, dir: [0, 1] } })),
    ...[1481.0, 1490.8].map((x, i) => ({ region: PR, pts: line(x, MY - 0.35), t0: T.both + 0.5 + i * 0.2, t1: T.both + 2.6 + i * 0.2, opts: { ...VO, dir: [0, -1] } })),
    ...[1484.2, 1487.6].map((x, i) => ({ region: PR, pts: line(x, BY2 - 0.35), t0: T.both + 0.65 + i * 0.2, t1: T.both + 2.7 + i * 0.2, opts: { ...VO, dir: [0, -1] } })),
    // the advance: one more American volley as the British break
    ...[1484.2, 1487.6].map((x, i) => ({ region: PR, pts: line(x, AY - 0.35), t0: 82.4 + i * 0.3, t1: 84.6 + i * 0.3, opts: { ...VO, dir: [0, -1] } })),   // v2 r3: from Mercer's halted front line
  ],
  guns: [{ region: PR, h: 0.3, opts: { plume: 0.45, puffs: 7, alpha: 0.2, jet: 1.4 },
    shots: [87.0, 90.4].map((t, i) => ({ t, at: NG, dir: [0, -1], impact: [NH[0] + (i ? 0.4 : -0.3), NH[1] + 0.2], delay: 0.25 })), impactOpts: { size: 0.6 } }],
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
  { side: "u", region: JE, pts: [[NA[0] - 4, NA[1] - 1], [NB[0] + 2, NB[1] + 0.6], [722.0, 1036.0], [726.0, 1020.0]], t0: T.back - 0.05, dur: 2.6, t1: 31.4, width: 1.0, maxWidth: 1.0 },
  { side: "u", region: JE, pts: [[DA[0] - 1, DA[1] + 6], DA, DB, [741.0, 931.0]], t0: 33.4, dur: 2.0, t1: CUT3 - 0.3, width: 1.0, maxWidth: 1.0 },
  { side: "r", region: JE, pts: [postAt(36), postAt(43), postAt(50)], t0: T.marching - 0.05, dur: 1.6, t1: CUT3 - 0.3, width: 1.0, maxWidth: 1.0 },
  { side: "r", region: PR, pts: [[OX, RY1 + 0.9], [OX, RY2 + 1.2], [OX, BY1 - 1.2]], t0: T.charged - 0.05, dur: 1.0, t1: T.mercers, width: 0.4, maxWidth: 0.4 },
  { side: "u", region: PR, pts: [[OX, MY - 0.6], [OX, BY1 + 0.2], [OX, RY2 + 1.6]], t0: T.rallied + 0.2, dur: 1.4, t1: CUT4 - 0.2, width: 0.4, maxWidth: 0.4 },
  { side: "r", region: TR, pts: [[1360.0, 2054.0], [1366.0, 2046.0], [1373.0, 2036.0], [1378.0, 2026.0]], t0: T.rushed - 0.05, dur: 1.8, t1: T.D + 1, width: 0.43, maxWidth: 0.43 },
];

// ---------------- generals ----------------
const US = "seq/grand_union_flag.png", GB = "seq/gb1707_union_flag.png";
const generals = {
  washington: { img: "seq/washington.png", flag: US, side: "us", name: "Washington", full: "George Washington", role: "General" },
  mercer: { img: "seq/mercer.png", flag: US, side: "us", name: "Mercer", full: "Hugh Mercer", role: "Brigadier General" },   // no likeness of the general: initials HM
  cornwallis: { img: "seq/cornwallis.png", flag: GB, side: "cs", name: "Cornwallis", full: "Charles Cornwallis", role: "Lieutenant General" },
};
const banners = [
  { general: "washington", region: TR, keys: [[0, 1356.4, 2079.0], [6.8, 1356.4, 2079.0], [14.0, 1357.4, 2083.6]], t0: 2.1, t1: CUT1 + 0.3 },
  { general: "washington", region: JE, keys: [[0, NA[0] - 2, NA[1] - 4], [CUT1 + 0.8, NA[0] - 2, NA[1] - 4], [27.0, NB[0] - 2, NB[1] - 4]], t0: CUT1 + 0.6, t1: 31.6 },
  { general: "washington", region: JE, keys: [[0, DA[0] - 4, DA[1] + 1], [32.4, DA[0] - 4, DA[1] + 1], [CUT3 - 1.0, DB[0] - 4, DB[1] + 1]], t0: 31.8, t1: CUT3 },
  { general: "mercer", region: PR, keys: [[0, 1485.9, BY1 + 2.4]], t0: T.mercer - 0.05, t1: T.under + 0.5 },   // v2 r1: fades out (v8 banners never tilt)
  { general: "washington", region: PR, keys: [[0, OX, MY + 1.6], [T.rode, OX, MY + 1.6], [T.lines, OX, RY2 + 3.4], [79.4, OX, RY2 + 3.4], [82.5, OX, AY - 0.6]], t0: T.washington - 0.05, t1: CUT4 + 0.4 },
  { general: "cornwallis", region: TR, keys: [[0, 1361.6, 2063.4], [117.6, 1361.6, 2063.4], [T.D, 1364.0, 2059.6]], t0: T.cornwallis2 - 0.05, t1: T.D + 1 },
];

// ---------------- labels ----------------
const labels = [
  { text: "Princeton", at: [PRj[0], PRj[1] - 5], region: JE, size: 20, t0: T.princeton - 0.05, t1: T.princeton + 3.6 },
  { text: "college", at: [NH[0], NH[1] - 2.0], region: PR, size: 17, t0: T.college - 0.05, t1: T.college + 3.6 },
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
const NI = 1.0;   // V2: night 1 + grade.night
const K = (t, region, at0, dist, tilt, yaw, ease = "io", night = 0, o = {}) => ({ t, region, at: at0, dist, tilt, yaw, fov: 30, ease, night, ...o });
window.SEQ = {
  grade: { wide: { toe: 14, ct: 0.96, sat: 0.95 }, night: { veil: [12, 18, 28], vt: 0.12, vb: 0.5, sat: 0.85 } },   // V2 r3 night veil   // V2: = the v8 clip wide grade (close = engine default = v8)
  name: "S07", D: T.D, T, seed: 1777, date: "1777-01-03",
  regions: [TR, JE, PR],
  regionOpts: { [JE]: { troopScale: 2.2 }, [TR]: { troopScale: 1.4, fxScale: 9 }, [PR]: { troopScale: 0.86, fxScale: 5.6 } },   // V2: v14 on-screen block size
  features: { [JE]: { bridges: [0, 1, 2, 3, 4, 5, 6].map(() => ({ hidden: true })), houseK: 0.35 } },
  troops: "blocks", troopsOpts: { look: "lineblocks", size: 1.44, depthK: 0.44, sideCol: { u: "#3f5aa0", r: "#be3a2a" }, pal: { u: { coat: 0x6e7cab, plate: 0x7d8ec6 } } },   // V2 r2: steel blue as v14 (critic 1 #16)   // V2: = v14 (S09_gm): 12 files x 6 ranks, +44 %
  keys: [
    // 1. trenton night (= S06's last frame), down onto the creek
    K(0, TR, [1353.0, 2071.0], 58, 42, 0, "io", NI),
    K(7.0, TR, [1355.0, 2072.6], 38, 46, 0, "io", NI),
    K(CUT1, TR, [1356.4, 2073.8], 30, 48, 2, "lin", NI),
    // 2. jersey night: the back road round the British left; the frost
    K(CUT1, JE, [698, 1036], 100, 44, 0, "cut", 0.85, { dissolve: 0.9 }),
    K(25.0, JE, [703, 1036], 98, 45, 2, "lin", 0.85),
    K(31.7, JE, [708, 1034], 96, 45, 2, "lin", 0.8),
    // 3. dawn, 3 January: up on Princeton; Mawhood's column leaves the town
    K(31.75, JE, [728, 952], 78, 46, 0, "cut", 0.3, { dissolve: 0.9 }),
    K(36.0, JE, [731, 944], 78, 46, 0, "io", 0.1),
    K(CUT3, JE, [734, 938], 74, 47, 0, "lin", 0.05),
    // 4. princeton: the orchard
    K(CUT3, PR, [OX, 1855.0], 19, 55.5, 0, "cut", 0.05, { dissolve: 0.9 }),   // V2: wider (v14 framing: ~2.4 block widths between the lines)
    K(55.0, PR, [OX, 1854.6], 18, 55.5, 0, "io", 0.03),   // V2 r2: tilt 55.5 (less horizon haze), yaw held
    K(66.0, PR, [OX, 1855.4], 18.5, 55.5, 0, "io", 0),
    K(74.0, PR, [OX, 1855.0], 18, 55.5, 0, "io", 0),
    K(CUT4, PR, [OX, 1853.4], 20, 52, 0, "lin", 0),
    // 5. Nassau Hall, then the result card over the town
    K(CUT4, PR, [NH[0], 1823.4], 18.5, 52.5, 2, "cut", 0, { dissolve: 0.9 }),   // v2 r1: v14 framing (was dist 9.5)
    K(91.0, PR, [NH[0], 1823.6], 18, 53, 0, "lin", 0),
    K(CUT5, PR, [NH[0] - 2.0, 1826.0], 24, 52, 0, "io", 0),
    // 6. trenton dawn: Cornwallis, empty works, the march back north-east; method card
    K(CUT5, TR, [1357.0, 2066.0], 30, 48, 0, "cut", 0.08, { dissolve: 0.9 }),
    K(113.0, TR, [1358.0, 2064.0], 26, 49, 4, "io", 0.04),
    K(T.D, TR, [1361.0, 2058.0], 32, 47, 6, "io", 0.02),
  ],
  clouds: { [JE]: { scatter: { seed: 7, box: [560, 874, 220, 255], n: 9, med: 40 }, diveClear: 40, keepClear: [[720, 980, 35, 1, 0.8]] }, [TR]: { shadows: true }, [PR]: { shadows: true } },
  units, arrows, banners, fx, generals, labels,
  overlay: [
    ["plaque.date", 0, { month: "January 1777", day: "2", weekday: "Thursday", note: "night" }],
    // the decision card continues from S06 (shown through S06's end): the real choice (B) lights on "He slipped away"
    ["engage.decide", { t: 0, instant: true, sub: "2 JANUARY 1777 · YOU ARE WASHINGTON", a: "HOLD THE CREEK\nAND FIGHT", b: "SLIP AWAY\nIN THE NIGHT", real: "b",
      tReveal: 0.3, until: 2.0, dim: 0.55 }],
    ["label", T.five - 0.05, T.covering + 1.2, { name: "About 500 men", sub: "keep the fires burning and dig", world: [1356.4, 2079.6], side: "us", marker: false }],
    ["plaque.clock", T.road - 0.05, { time: "2:00", note: "the back road", header: "2 - 3 January 1777" }],   // V2: on the road by 2 a.m. (FACT G3)
    // v2 r2 critic B: "froze" once on screen (the plate below)
    ["label", T.froze - 0.05, 31.3, { name: "The mud froze", sub: "", world: [702.0, 1021.0], marker: false }],   // v2 r1: dark v8 plate, not a stamp
    ["plaque.clock", T.third - 0.05, { time: "7:25", note: "sunrise", header: "3 January 1777" }],   // V2: sun up ~7:25 (FACT J)
    ["distance", T.twelve - 0.05, T.brigade - 0.3, { from: [TRj[0] + 2, TRj[1] - 2], to: [740.0, 934.0], value: 12, countFrom: 12, unit: "MILES", sub: "behind the British army", dash: false }],
    // V2: pocket-watch time plate (FACT_NOTES_jersey H2: the clash just before 8 a.m.), THE ARMIES key, the wax-seal campaign timeline
    ["plaque.clock", T.orchard - 0.05, { time: "8:00", note: "an orchard", header: "3 January 1777" }],
    ["plaque.clock", T.college - 0.05, { time: "8:00", note: "the college", header: "3 January 1777" }],   // v2 r3 fix (B4-3)
    // v2 r3 (A N6): key + timeline on EVERY map shot (v8), in once the decision card has gone, out only for the ledger / method card
    ["legend", 2.2, CUT3 - 0.2, { entries: [{ name: "Americans", sub: "Washington", color: "#3C6E9E" }, { name: "British", sub: "Cornwallis", color: "#9C3A35" }] }],
    ["legend", CUT3 + 0.4, CUT5 - 0.4,   /* v2 r3 fix (A R5): kept under the ledger (v8) */ { entries: [{ name: "Americans", sub: "Washington", color: "#3C6E9E" }, { name: "British", sub: "", color: "#9C3A35" }] }],
    ["legend", CUT5 + 0.4, 119.0, { entries: [{ name: "Americans", sub: "Washington", color: "#3C6E9E" }, { name: "British", sub: "Cornwallis", color: "#9C3A35" }] }],
    ["timeline.show", 2.1, { month: "1776", year: "1777", cells: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"], at: 5.1 }],
    ["timeline.seal", 2.2, { at: 0.95, name: "Brooklyn" }],
    ["timeline.seal", 2.2, { at: 4.72, name: "Trenton" }],
    ["timeline.go", T.january, { at: 5.25, d: 1.2 }],
    ["distance", T.thirty - 0.05, T.both - 0.2, { from: [OX + 0.2, RY2 + 3.4], to: [OX + 0.2, RY2 + 0.4], value: 30, countFrom: 30, unit: "YARDS", sub: "from the British line", dash: false }],
    ["timeline.seal", T.surrendered, { at: 5.6, name: "Princeton" }],   // v2 r3 (A #18): right of "Jan" so the month and "Princeton" read (v8 "Champion Hill")
    // V2: the small parchment result list top-right (v8) INSTEAD of the big dark centred result card; spoken numbers only
    ["ledger.show", T.lost - 0.4, { title: "Princeton", sub: "3 January 1777" }],
    ["ledger.add", T.hundreds, { who: "British: hundreds lost", stamp: false }],
    ["ledger.note", T.killed - 0.05, 1, "killed, wounded or captured"],
    ["ledger.add", T.prisoner - 0.05, { who: "Almost 200 prisoners", stamp: false }],
    ["ledger.add", T.fewer, { who: "Americans: under 100 lost", stamp: false }],
    ["ledger.add", T.generalM - 0.05, { who: "General Mercer", stamp: false }],
    ["ledger.note", T.nine - 0.05, 4, "died nine days later"],
    ["ledger.hide", CUT5 - 0.4],
    ["plaque.date", CUT5 + 0.4, { month: "January 1777", day: "3", weekday: "Friday", note: "dawn at the creek" }],
    ["plaque.date", T.heard - 0.05, { month: "January 1777", day: "3", weekday: "Friday", note: "guns heard from Princeton" }],
    ["timeline.hide", 119.0],   // V2: steps out for the method card
    ["letter", 119.3, T.D + 1, { header: "Move 3 · Princeton", title: "The Washington Method", sub: "1. Save the army first · 2. Hit them where they rest", marks: false, quote: "3. Go where they are not", qSize: 34, height: 300,
      cps: 30, qAt: T.go - 0.05, lag: 0.05, stagger: 0.06, partDur: 0.35 }],
  ],
  build: (c) => { FROST.build(c); },   // V2: no big result card (ledger)
  draw: (t, c) => { FROST.draw(t, c); const reg = c.world.cameraAt(t).region, sc = 1920 / c.world.renderer.domElement.width * (c.world.renderer.getPixelRatio ? c.world.renderer.getPixelRatio() : 1);
    for (const p of PINS) { if (p.region !== reg) { p.el.style.visibility = "hidden"; continue; } p.el.style.visibility = "";
      const s = c.world.projectMap(p.world[0], p.world[1], 0.3); p.el.style.transform = `translate(${(s.x * sc).toFixed(1)}px,${(s.y * sc).toFixed(1)}px)`; } },
};
})();
