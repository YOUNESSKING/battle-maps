// S05 MOVE 2: CHRISTMAS NIGHT AND TRENTON (D 163.54 s, python3 washington/tools/scene_times.py S05 --words).
// Regions: jersey (z10 wide, winter = base units), crossing (z12 close, winter, night), trenton (z11 close, winter), colonies (z9 wide).
// Shots: jersey day: the chain of red posts, Trenton glows, Rall, NO FORTIFICATIONS -> the plan: three blue crossing arrows, dusk ->
// cloud dive 3 into the crossing at night (McConkey's Ferry): blocks break rank onto separate Durham boats, ferry flats with guns + horses,
// the boats shuttle, the men come off at Johnson's Ferry and walk up the road; the storm breaks at eleven (sleet + grey veil, floes),
// clock plates, 18 GUNS -> dissolve jersey night storm: the two failed crossings (grey arrows stopping at the river), Washington, the
// 9-mile march, the split at Birmingham -> dissolve trenton grey dawn: the picket, guns at the head of King + Queen streets firing down
// both, Hessians forming in the streets, Rall's banner falls, the fields east of town, surrender (grey), some stream over the Assunpink
// bridge before it closes -> result card -> method card 2 -> dissolve colonies: Cornwallis in New York, the red arrow to Trenton.
// Facts: washington/research/FACT_NOTES_jersey.md B1-B4, C1-C7, D1-D4.
(() => {
const T = { D: 163.54,
  plan: 0.75, winter: 2.25, chain: 2.93, posts: 3.43, jersey: 4.19, spring: 6.81, trenton: 8.11, closest: 9.55, enemy: 10.39, colonel: 11.53, rall: 11.79,
  build: 12.73, fortifications: 13.07,
  other: 15.05, british: 15.91, nothing: 18.05, spring2: 18.87, but: 19.91, washington: 20.15, wait: 21.29, instead: 22.81, cross: 24.37, river: 25.37,
  christmas: 25.91, night: 26.29, three: 27.11, places: 27.37, attack: 28.47, trenton2: 28.83, dawn: 29.55,
  after: 30.85, dark: 31.05, christmasDay: 31.73, main: 33.23, two: 34.71, thousand: 34.93, men: 35.59, began: 36.15, cross2: 36.77, mcconkeys: 37.67,
  nine: 39.05, miles: 39.27, above: 39.75,
  boats: 41.45, long: 42.01, black: 42.65, durham: 43.03, iron: 45.03, river2: 46.17, oars: 47.53, fishermen: 48.55, marblehead: 49.43, brooklyn: 51.71,
  around: 52.97, eleven: 53.54, storm: 53.99, snow: 55.21, sleet: 56.31, hail: 56.95, wind: 58.79, ice: 60.17, floes: 60.43, boats2: 61.69,
  three2: 63.23, morning: 63.85, horse: 65.31, eighteen: 66.52, cannon: 66.79, across: 67.17,
  hours: 68.81, schedule: 69.59, downriver: 70.75, other2: 71.59, failed: 72.59, ice2: 73.43, washington2: 74.59, alone: 75.57,
  marched: 77.31, nine2: 77.87, miles2: 78.19, storm2: 79.67, dark2: 80.71, crossroads: 82.01, split: 83.41, hit: 85.07, sides: 86.29,
  eight: 88.49, morning2: 89.11, twentysixth: 90.6, burst: 92.07, storm3: 92.79, hessian: 93.71, outposts: 93.99,
  american: 95.59, guns: 95.99, raced: 96.49, top: 97.19, streets: 98.67, fired: 99.33, down: 100.15, them: 100.49, hessians: 101.55, form: 102.43,
  streets2: 103.17, raked: 104.41, cannon2: 104.97, shot: 106.31, houses: 107.23,
  colonel2: 108.85, rall2: 109.09, counterattack: 109.77, shot2: 110.71, horse2: 111.47, men2: 112.65, driven: 113.15, fields: 114.15, east: 114.53,
  surrounded: 115.87, laid: 117.17, arms: 117.97,
  several: 119.27, away: 120.29, bridge: 121.31, creek: 122.05, south: 122.33, before: 123.43, closed: 124.55, rest: 126.01, trapped: 126.53,
  about: 127.75, ninehundred: 128.21, captured: 129.39, more: 130.47, hundred: 131.05, killed: 131.43, wounded: 132.25, notone: 133.31, american2: 133.83,
  killed2: 134.63, battle: 135.39, among: 136.33, handful: 136.75, lieutenant: 138.37, james: 139.21, monroe: 139.63, president: 141.05,
  second: 142.93, method: 143.75, settles: 145.29, winter2: 146.35, hit2: 147.07, rest2: 147.93,
  but2: 149.03, letgo: 150.85, newyork: 152.13, general: 153.21, cornwallis: 153.85, sail: 155.25, england: 156.19, instead2: 157.19, sent: 158.31,
  racing: 158.55, trenton3: 159.23, finish: 160.17, good: 161.39 };
const JE = "jersey", CR = "crossing", TR = "trenton", CO = "colonieswinter";
const sstep = VX.sstep, lerp = VX.lerp;
const P = (n, r) => VX.place(n, r);

// ---------------- jersey (base units) ----------------
const TRj = [677.9, 1027.3], BORj = P("Bordentown", JE), PRj = P("Princeton, NJ", JE), MKj = P("McConkey's Ferry (Pennsylvania", JE), JFj = P("Johnson's Ferry landing", JE);
const BIRj = P("Birmingham", JE), MAIj = P("Maidenhead", JE);

// ---------------- crossing (z12) geometry: the Delaware between McConkey's (PA) and Johnson's (NJ) ----------------
const RIV = VX.river(CR, "Delaware River").pts.map((p) => [p[0], p[1]]);
const RL = VX.len(RIV);
const rivS0 = (() => { let b = 0, bs = 0, s = 0; for (let i = 1; i < RIV.length; i++) { s += Math.hypot(RIV[i][0] - RIV[i - 1][0], RIV[i][1] - RIV[i - 1][1]);
  if (Math.hypot(RIV[i][0] - 2403.8, RIV[i][1] - 3835.5) < Math.hypot(RIV[b][0] - 2403.8, RIV[b][1] - 3835.5)) { b = i; bs = s; } } return bs; })();
const HW = 5.25;                                                      // half the river width (10.5 units)
const RC = (ds) => { const g = VX.along(RIV, rivS0 + ds); let n = [g[3], -g[2]]; if (n[0] * 13.7 + n[1] * -12.6 < 0) n = [-n[0], -n[1]]; return { c: [g[0], g[1]], t: [g[2], g[3]], n }; };   // n points to NJ
const at = (ds, d, s = 0) => { const R = RC(ds); return [R.c[0] + R.n[0] * d + R.t[0] * s, R.c[1] + R.n[1] * d + R.t[1] * s]; };   // d across (PA < 0 < NJ), s downstream
const RX0 = RC(0), FN = Math.atan2(RX0.n[1], RX0.n[0]), FP = FN + Math.PI;   // facing NJ, facing PA
const NI = 1.0;   // V2: night 1 + the scene night grade (grade.night)
// three boarding lanes along the PA bank (each its own deck, boat and queue), one ferry flat lane further downstream
const LANES = [-5.2, -0.6, 4.0];
const FLAT = 8.6;
const decks = LANES.map((ds) => { const a = at(ds, -HW - 1.7), b = at(ds, -HW - 0.15); return { x: (a[0] + b[0]) / 2, z: (a[1] + b[1]) / 2, angle: FN, len: 1.55 }; });

// boat schedules: [load start, leave PA, arrive NJ, leave NJ, back at PA] per trip; s along the path 0 (PA) -> L (NJ)
const TC = 6.6;   // crossing time
const trip = (t0) => ({ a: t0, b: t0 + 4.6, c: t0 + 4.6 + TC, d: t0 + 4.6 + TC + 2.2, e: t0 + 4.6 + 2 * TC + 2.2 });
const SCHED = [[trip(38.8), trip(58.4)], [trip(42.6), trip(62.0)], [trip(47.4), trip(66.6)]];
const bpath = (ds, k) => { const p0 = at(ds, -HW + 0.65), p2 = at(ds + 0.6, HW - 0.65), p1 = at(ds + 1.4 + 0.3 * k, 0); return [p0, p1, p2]; };
const ease = (x) => x * x * (3 - 2 * x);
const sOf = (L, tr, t) => { for (const q of tr) { if (t < q.b) return 0; if (t < q.c) return L * ease((t - q.b) / (q.c - q.b)); if (t < q.d) return L; if (t < q.e) return L * (1 - ease((t - q.d) / (q.e - q.d))); } return 0; };
const loaded = (tr, t) => tr.some((q) => t > q.b - 1.2 && t < q.c + 0.6);

// ---------------- units ----------------
const units = [];
const add = (o) => { units.push({ type: "inf", n: 1, arrive: false, ...o }); return units.length - 1; };
// PA bank: the blocks waiting in a queue behind each landing (facing inland: the men about-face and stream onto the boat)
// v2 r3 (critic A #2 checks): the first block of lanes 0 / 2 waits straight up-screen of its deck (its walk onto the deck runs down / up the
// screen, measured with the scene camera), lane 0's steps off after the dive has landed; the second block of each lane leaves the picture with
// the camera (faded out off-screen at 53 s: its later boats still carry their men)
const QD = { 0: -64.3 * Math.PI / 180, 2: -Math.PI / 2 };
LANES.forEach((ds, k) => SCHED[k].forEach((q, j) => {
  const land = at(ds, -HW - 1.7), pos = j === 0 && QD[k] != null ? [land[0] - Math.cos(QD[k]) * 1.3, land[1] - Math.sin(QD[k]) * 1.3] : at(ds, -HW - 3.0 - 1.15 * j, 0.25 * j);
  add({ side: "u", region: CR, face: FN, keys: [[0, ...pos]], t1: j ? 53.0 : q.b + 1.0,
    escape: { road: [pos, land, at(ds, -HW - 0.15), at(ds, -HW + 0.9), at(ds, -HW + 1.6)], join: "nearest", t0: q.a - (k === 0 && j === 0 ? 2.4 : 3.4), from: 0, vanish: [0.35, 0.95], front: true } }); }));
// more men waiting on the PA bank (in the back, framed at the edge): they stay
[[-2.9, -HW - 6.2], [1.7, -HW - 6.6]].forEach(([ds, d]) => add({ side: "u", region: CR, face: FN, keys: [[0, ...at(ds, d)]] }));
// NJ bank: the advance guard up the Bear Tavern road; each boatload comes off at Johnson's Ferry and walks up to the assembly ground
const BT = VX.road(CR, "Bear Tavern road"), BTp = (s) => { const g = VX.along(BT, s); return [g[0], g[1]]; };
add({ side: "u", region: CR, face: Math.atan2(-0.75, 0.66), keys: [[0, ...BTp(6.5)]] });
const ASM = [[3.2, 1.2], [3.6, -0.6], [5.0, 0.4], [5.4, -1.4], [6.8, -0.4], [7.0, 1.6]];
const AUP = [-55.4, -49.0].map((d) => d * Math.PI / 180);   // v2 r3: the first two landings walk straight up the screen (camera at 53 / 57 s)   // [across from the NJ edge, along the bank (downstream +)]
let asmI = 0;
LANES.forEach((ds, k) => SCHED[k].forEach((q) => { if (q.c > 68.4) return; const ia = asmI++, A = ASM[ia % ASM.length], p0 = at(ds + 0.6, HW + 0.7), p1x = at(ds + 0.6, HW + A[0], 0), Lw = Math.hypot(p1x[0] - p0[0], p1x[1] - p0[1]), p1 = AUP[ia] != null ? [p0[0] + Math.cos(AUP[ia]) * Lw, p0[1] + Math.sin(AUP[ia]) * Lw] : p1x;   // round 2: straight up the bank, along the facing (no crab)
  add({ side: "u", region: CR, face: Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), t0: q.c + 0.3, keys: [[0, ...p0], [q.c + 1.0, ...p0], [q.c + 1.0 + Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 0.55, ...p1]], arrive: false }); }));
// guns: on the flats, then off on the NJ bank one by one
const FTR = [trip(46.0), trip(55.0)].map((q) => ({ ...q, b: q.b + 1.0, c: q.c + 2.6, d: q.d + 2.6, e: q.e + 2.6 }));
FTR.forEach((q, j) => { const p0 = at(FLAT + 0.6 - 1.4 * j, HW + 0.8), p1x = at(FLAT + 0.6 - 1.4 * j, HW + 3.0), GD = -19.7 * Math.PI / 180,   // v2 r3: the first gun walks off straight down the screen (camera at 63 s)
    p1 = j === 0 ? [p0[0] + Math.cos(GD) * 2.2, p0[1] + Math.sin(GD) * 2.2] : p1x;
  add({ side: "u", type: "art", region: CR, face: Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), t0: q.c + 0.4, keys: [[0, ...p0], [q.c + 1.2, ...p0], [q.c + 5.0, ...p1]], arrive: false }); });
add({ side: "u", type: "art", region: CR, face: FN, keys: [[0, ...at(FLAT - 3.2, HW + 3.4)]], t0: 58.0, arrive: true });   // already over (earlier flats)

// jersey wide: the red posts (Trenton, Bordentown, Princeton); later the American march (troopScale 3)
const JU = [];
JU.push({ side: "r", n: 2, region: JE, face: Math.PI * 0.75, keys: [[0, TRj[0] + 1.5, TRj[1] + 1.0]], t1: 76.4 });
JU.push({ side: "r", n: 2, region: JE, face: Math.PI * 0.9, keys: [[0, BORj[0] + 0.5, BORj[1] - 3.0]] });
JU.push({ side: "r", n: 2, region: JE, face: Math.PI * 0.75, keys: [[0, PRj[0] - 2.0, PRj[1] + 2.0]] });
units.push(...JU.map((u) => ({ type: "inf", arrive: false, ...u })));
// the march (night, storm): Johnson's Ferry -> Bear Tavern road -> Birmingham -> split: Greene (Pennington road), Sullivan (River road)
const BTj = VX.road(JE, "Bear Tavern road"), RRj = VX.road(JE, "River road (NJ)");
const GREENE = [[638.6, 981.2], [648.0, 986.0], [657.0, 989.5], [663.6, 993.0], [665.8, 1002.0]];
const SULL = [[638.0, 981.6], [631.0, 988.6], [626.0, 992.0], [632.6, 999.4], [640.0, 1005.0]];
const marchU = (path, t0, v, i, face, t1) => units.push({ side: "u", type: "inf", n: 1, region: JE, arrive: false, face, t0: T.washington2 + 0.3,
  keys: VX.march(path, t0, v), t1 });
// four blocks on the Bear Tavern road from Johnson's Ferry, splitting at Birmingham
const BTsub = (s0, s1) => VX.sub(BTj, s0, s1);
const LBT = VX.len(BTj);
// critic round 1: two WIDE line blocks (2 boxes each), well spaced, long side first: Johnson's Ferry -> Birmingham side by side, then each
// stops, turns in place and walks its own road (Greene east toward the Pennington road, Sullivan south toward the River road)
const JB0 = [JFj[0] + 3.0, JFj[1] + 1.0], JB1 = [BIRj[0] - 1.0, BIRj[1] - 0.6], dJ = [JB1[0] - JB0[0], JB1[1] - JB0[1]], lJ = Math.hypot(...dJ), pJ = [-dJ[1] / lJ * 3.0, dJ[0] / lJ * 3.0];
const uJ = [dJ[0] / lJ, dJ[1] / lJ], JBm = [JB0[0] + uJ[0] * 8.0 + uJ[1] * 5.2, JB0[1] + uJ[1] * 8.0 - uJ[0] * 5.2];   // round 2: <= 2 u/s, only the first part of the march (the arrows carry the rest)
const G2d = [0.87, 0.49], S2d = [0.62, 0.78];
[[-1, G2d], [1, S2d]].forEach(([sg, dd]) => { const a = [JB0[0] + pJ[0] * sg + uJ[1] * 5.2, JB0[1] + pJ[1] * sg - uJ[0] * 5.2], b = [JBm[0] + pJ[0] * sg, JBm[1] + pJ[1] * sg], end = [b[0] + dd[0] * 10.0, b[1] + dd[1] * 10.0];
  units.push({ side: "u", type: "inf", n: 1, region: JE, arrive: false, face: Math.atan2(dJ[1], dJ[0]), t0: T.washington2 - 0.2, t1: 88.6,
    keys: [[0, ...a], [T.marched - 0.3, ...a], [81.0, ...b], [82.4, ...b], [87.6, ...end]] }); });   // round 3: each walks ~ the first quarter of its arrow

// trenton: grey dawn, 26 Dec
const HEAD = [1355.9, 2054.5], KING = (y) => [1355.3, y], QUEEN = (y) => [lerp(1356.3, 1356.8, (y - 2054.7) / 15.5), y], FIELD = [1364.3, 2053.2], BR = [1356.3, 2069.3];
const PEN = VX.road(TR, "Pennington road"), RVR = VX.road(TR, "River road");
const N = -Math.PI / 2, S_ = Math.PI / 2, E = 0, W = Math.PI;
// the picket on the Pennington road
add({ side: "r", region: TR, face: Math.atan2(-0.95, -0.3), keys: [[0, 1338.0, 2028.0]], t1: 96.0 });   // v2 r1: the picket in the 8 a.m. frame
// Greene's blocks down the Pennington road, deploying at the head of the town; Sullivan's from the River road into the lower town
// round 3 (critic A): Greene's blocks stay on open ground WEST of the ring wood: abreast west of the Pennington road, straight south past
// the wood (facing south), hold, turn in place toward their deploy spots at the head of the town, walk
// v2 r3 (critic A #2): each block walks straight along its front normal (south), steps off on "burst", stops (and settles) before the 95.4 dissolve
const DG = [65.0, 78.0, 93.1].map((d) => d * Math.PI / 180);   // the on-screen 'down' direction at each block (camera at 93 s; r3 fix: re-measured for the closer approach camera)
[0, 1, 2].forEach((i) => { const s0 = [1333.0 + i * 2.2 - (i === 0 ? 1.5 : 0) + (i === 2 ? 1.6 : 0), 2033.0], p = [s0[0] + Math.cos(DG[i]) * 1.3, s0[1] + Math.sin(DG[i]) * 1.3];   /* v2 r2 critic B: west block clear of the farm; v2 r3 (critic A N5): east block clear of the wood clump */
  add({ side: "u", region: TR, face: DG[i], t0: 88.0, keepTimes: true, keys: [[0, ...s0], [91.4 + i * 0.1, ...s0], [94.0 + i * 0.1, ...p], [T.D, ...p]] }); });
const sPos = [[1353.4, 2062.4], [1352.0, 2067.8]];   // v2 r3: the second block clear of the clock plate in the bridge shot   // v2 r2 critic B: Sullivan's lead block in the frame, among the houses
// v2 r3 (critic A #2): up from the River road into the lower town, straight north (front first, long side across the screen), after the dissolve
const DS = (77.0 + 180) * Math.PI / 180;   // on-screen 'up' at the lower town (camera at 103 s)
add({ side: "u", region: TR, face: DS, t0: 95.4, arrive: false, keys: [[0, sPos[0][0] - Math.cos(DS) * 2.4, sPos[0][1] - Math.sin(DS) * 2.4], [103.2, sPos[0][0] - Math.cos(DS) * 2.4, sPos[0][1] - Math.sin(DS) * 2.4], [107.4, ...sPos[0]], [T.D, ...sPos[0]]] });
add({ side: "u", region: TR, face: N, t0: 95.4, arrive: false, keys: [[0, ...sPos[1]]] });   // the second brigade waits below the frame (no walk)
// Knox's guns race to the head of King and Queen streets
const G1 = [1355.2, 2053.2], G2 = [1356.6, 2053.3];
// v2 r3 (critic A #2): straight down to the street heads along their front (south), after the 95.4 dissolve, in place before "fired"
[G1, G2].forEach((g, i) => add({ side: "u", type: "art", region: TR, face: S_, t0: 95.4, arrive: false, keepTimes: true, keys: [[0, g[0], g[1] - 2.0], [96.4 + i * 0.2, g[0], g[1] - 2.0], [98.9 + i * 0.2, ...g], [T.D, ...g]] }));
// V2 r3 (critic 2 R2-4): Greene's leading brigade at the head of the town on the Pennington road, behind Knox's guns
[-1, 0, 1].forEach((k) => add({ side: "u", region: TR, face: S_, t0: 95.4 + (k + 1) * 0.12, arrive: false, keys: [[0, 1350.6 + k * 0.86, 2051.2]] }));   // v2 r1: one block per unit, west of the guns' run
// the Hessians form in the two streets, are raked, leave the streets east into the fields, are driven to the orchard, surrender
const H1 = KING(2058.8), H2 = QUEEN(2059.8),   /* V2 r2: up the streets, in the 8 a.m. frame */ F1 = [1360.6, 2061.0], F2 = [1361.4, 2063.4], O1 = [1363.2, 2055.0], O2 = [1364.8, 2057.2];
// v2 round 1: ONE block per unit: three single blocks abreast per street group (0.8 u apart), the King St group a little west, Queen St east
const HG = [[1354.0, 2057.8], [1357.8, 2058.8]];   // v2 r3 (critic A #12): 1 u north, clear of the timeline
// v2 r3 (critic A #2): the groups hold where they formed (the Queen St group already stands in the fields east of the town); the ring closes round them
const rH = HG.flatMap((h, i) => [-1, 0, 1].map((k) => add({ side: "r", region: TR, face: N, t0: 95.4 + i * 0.3 + (k + 1) * 0.12, arrive: false,
  keys: [[0, h[0] + k * 0.8, h[1]]], cap: T.laid + 0.2 + i * 0.25 + (k + 1) * 0.08 })));
// the blue blocks close round the orchard (north, east, south-west)
// v2 r3: round the Queen St group (x 1356.65-1358.95, y 2058.8); each walks in along its front = the on-screen vertical / horizontal (camera at 114 s)
const RING = [[1357.8, 2056.4, 82.8], [1359.9, 2056.6, 88.3], [1358.4, 2060.8, 79.0 + 180]].map(([x, y, d]) => [x, y, d * Math.PI / 180]);
RING.forEach(([x, y, f], i) => { const L = 2.6, ts0 = T.driven + i * 0.3, b0 = [x + Math.cos(f + Math.PI) * L, y + Math.sin(f + Math.PI) * L];   // NW + NE blocks from the north, one from the south (no east block: walking across the screen it read as a column)
  add({ side: "u", region: TR, face: f, t0: 110.0 + i * 0.4, arrive: false, keys: [[0, ...b0], [ts0, ...b0], [T.surrounded + 0.2 + i * 0.3, x, y], [T.D, x, y]] }); });
// by the Assunpink bridge: one block streams away over the bridge, one is trapped; a blue block closes the bridge from the west
const KN1 = [1355.65, 2066.13], KN2 = [1354.6, 2064.4];   // v2 r3: KN1 straight up-screen of the bridge mouth (its walk onto the deck runs down the screen)
const ESCR = [[1355.65, 2066.13], [1356.8, 2068.4], [1357.2, 2072.0], [1357.7, 2073.4], [1358.4, 2076.0], [1359.0, 2079.0], [1359.6, 2082.5]];   // v2 r3: off the bridge straight down the screen
add({ side: "r", region: TR, face: S_, t0: 118.4, keys: [[0, ...KN1]], escape: { road: ESCR, join: "nearest", t0: T.several + 0.2, from: 0, front: true } });   // round 2: walks front first (no backing)
add({ side: "r", region: TR, face: Math.atan2(-0.4, -0.9), t0: 118.4, keys: [[0, ...KN2]], cap: T.trapped - 0.1 });
const DB = 76.5 * Math.PI / 180, BB = [1354.2, 2068.3];   // v2 r3: down the screen to the bridge's west end (camera at 122 s), after the 118.65 dissolve
add({ side: "u", region: TR, face: DB, t0: 118.4, keepTimes: true, keys: [[0, BB[0] - Math.cos(DB) * 2.5, BB[1] - Math.sin(DB) * 2.5], [120.4, BB[0] - Math.cos(DB) * 2.5, BB[1] - Math.sin(DB) * 2.5], [T.closed + 0.2, ...BB], [T.D, ...BB]] });

// colonies: Washington's army at Trenton (blue), Cornwallis's men in New York (red)
const NYc = P("New York", CO), TRc = P("Trenton, NJ", CO), NBc = P("New Brunswick (British", CO), PRc = P("Princeton, NJ", CO);
units.push({ side: "u", type: "inf", n: 1, region: CO, arrive: false, face: 0, keys: [[0, TRc[0] - 3, TRc[1] + 4]], t0: 148.2 });
units.push({ side: "r", type: "inf", n: 1, region: CO, arrive: false, face: Math.PI, keys: [[0, NYc[0] - 10, NYc[1] + 4]], t0: 148.2 });

// ---------------- boats ----------------
const boats = [];
LANES.forEach((ds, k) => SCHED[k].forEach((q, j) => { const path = bpath(ds, k), L = VX.len(path);
  boats.push({ region: CR, kind: "durham", n: 1, path, sAt: (t) => sOf(L, [q], t), t0: q.a - 2.5, t1: (j === SCHED[k].length - 1 ? 200 : SCHED[k][j + 1].a - 2.5), size: 0.75, lampK: 0.5, lamp: true, wake: false, wl: 6.85, h: 0.03,
    load: (t) => loaded([q], t) }); }));
// a few more Durham boats out on the river already (each its own lane, speed and spacing)
[[-9.0, 36.0, 0.9], [11.6, 30.0, 0.55], [-2.8, 48.8, 0.0]].forEach(([ds, t0, k]) => { const path = bpath(ds, 1), L = VX.len(path), q = trip(t0);
  boats.push({ region: CR, kind: "durham", n: 1, path, sAt: (t) => sOf(L, [q, trip(t0 + 2 * TC + 7.0)], t), t0: 30, t1: 200, size: 0.75, lampK: 0.5, lamp: true, wake: false, wl: 6.85, h: 0.03,
    load: (t) => loaded([q, trip(t0 + 2 * TC + 7.0)], t) }); });
// the ferry flats (guns + horses)
FTR.forEach((q) => { const path = bpath(FLAT, 0), L = VX.len(path);
  boats.push({ region: CR, kind: "flat", n: 1, path, sAt: (t) => sOf(L, [q], t), t0: 30, t1: 200, size: 0.45, lampK: 0.5, lamp: true, wake: false, wl: 6.85, h: 0.03, load: (t) => loaded([q], t) }); });

// ---------------- fx ----------------
// V2: the v14 musketry scaled to the Trenton framing (dist ~14: KF = 14 / 28.7); each volley's smoke builds over >= 2.2 s but ONE ripple
// (volley interval 2.4 > the duration), so the sound cues stay in the word gaps
const KF = 0.5;
const VO = { size: 0.85, alpha: 0.13, life: 11, muzzle: 5 * KF, windK: 1.1, rate: 2.9 / KF, volley: 2.4, roll: 0.9, height: 2.4 * KF, cluster: [2.6 * KF, 1.4 * KF] };
const gShots = [];
// the guns at the head of the streets fire straight down King and Queen streets: each shot a flash + an impact in the street
[[99.45, 0, 2061.0], [100.9, 1, 2062.4], [103.55, 0, 2063.4], [107.65, 1, 2061.8], [108.2, 0, 2060.6]].forEach(([t, g, y]) => {
  const at0 = g ? G2 : G1, imp = g ? QUEEN(y) : KING(y);
  gShots.push({ t, at: at0, dir: [imp[0] - at0[0], imp[1] - at0[1]], impact: imp, delay: 0.3, ...(t < 100 ? { boom: false } : {}) }); });   // round 2 (critic B N2): no boom on "fired", the rest in word gaps
const fx = {
  volleys: [
    // the picket fires into the storm as Greene's men burst out of it
    { region: TR, pts: [[1337.6, 2028.2], [1338.4, 2028.4]], t0: 92.5, t1: 94.7, opts: { ...VO, dir: [-0.3, -0.95] } },
    // Greene's leading block answers
    // the Hessians in the streets fire back up the streets
    { region: TR, pts: [[HG[0][0] - 1.1, HG[0][1] - 0.2], [HG[0][0] + 1.1, HG[0][1] - 0.2]], t0: 103.5, t1: 105.70, opts: { ...VO, dir: [0, -1] } },
    { region: TR, pts: [[HG[1][0] - 1.1, HG[1][1] - 0.2], [HG[1][0] + 1.1, HG[1][1] - 0.2]], t0: 103.6, t1: 105.80, opts: { ...VO, dir: [0, -1] } },
    // Sullivan's men fire from the houses into the lower town
    { region: TR, pts: [[1353.3, 2062.0], [1353.7, 2062.8]], t0: 107.75, t1: 109.95, opts: { ...VO, dir: [1, 0] } },
    // round the orchard: the ring fires once
    { region: TR, pts: [[RING[0][0] - 0.5, RING[0][1] + 0.2], [RING[0][0] + 0.5, RING[0][1] + 0.2]], t0: 116.35, t1: 118.55, opts: { ...VO, dir: [0, 1], muzzle: 5 * KF * 1.6 } },
    { region: TR, pts: [[RING[1][0] - 0.5, RING[1][1] + 0.2], [RING[1][0] + 0.5, RING[1][1] + 0.2]], t0: 116.65, t1: 118.85, opts: { ...VO, dir: [0, 1], muzzle: 5 * KF * 1.6 } },
  ],
  guns: [{ region: TR, h: 0.3, opts: { plume: 0.45, puffs: 7, alpha: 0.2, jet: 1.4 }, shots: gShots, impactOpts: { size: 0.6 } }],
  campfires: [
    // the American landing fires (lanterns and fires at McConkey's) and the NJ bank
    { region: CR, pts: [at(-7.0, -HW - 2.2), at(2.2, -HW - 2.0), at(6.6, -HW - 3.4), at(-1.2, HW + 2.4), at(6.4, HW + 2.0)], t0: 0, t1: 80, opts: { glowSize: 2.0 } },
  ],
};

// ---------------- arrows ----------------
const BLUEW = 1.0;   // V2: jersey arrows (w = width x ts x 0.66)
const arrows = [
  // the plan: three crossings (McConkey's the main one, Trenton Ferry, and downriver toward Bordentown)
  { side: "u", region: JE, pts: [[MKj[0] - 3.0, MKj[1] + 3.0], [MKj[0] + 1.2, MKj[1] - 1.6], [JFj[0] + 3.4, JFj[1] - 2.4]], t0: T.three - 0.05, dur: 1.2, t1: T.after - 0.5, width: BLUEW, maxWidth: BLUEW },
  { side: "u", region: JE, pts: [[664.0, 1043.0], [669.4, 1038.6], [674.8, 1035.6]], t0: T.three + 0.3, dur: 1.2, t1: T.after - 0.5, width: BLUEW, maxWidth: BLUEW },
  { side: "u", region: JE, pts: [[680.0, 1084.0], [684.6, 1077.6], [689.6, 1072.4]], t0: T.three + 0.6, dur: 1.2, t1: T.after - 0.5, width: BLUEW, maxWidth: BLUEW },
  // ... and attack Trenton at dawn
  { side: "u", region: JE, pts: [[JFj[0] + 4.0, JFj[1] - 1.0], [628.0, 966.0], [646.0, 994.0], [664.0, 1014.0], [674.0, 1024.0]], t0: T.attack - 0.05, dur: 1.8, t1: T.after - 0.5, width: BLUEW, maxWidth: BLUEW },
  // the two failed crossings: grey arrows that stop at the river ice
  { color: "#9aa3ad", region: JE, pts: [[662.0, 1046.0], [667.0, 1041.6], [670.2, 1039.4]], t0: T.downriver - 0.05, dur: 1.4, t1: T.marched - 0.2, width: BLUEW, maxWidth: BLUEW },
  { color: "#9aa3ad", region: JE, pts: [[679.0, 1086.0], [682.4, 1081.0], [685.6, 1076.6]], t0: T.other2 - 0.05, dur: 1.4, t1: T.marched - 0.2, width: BLUEW, maxWidth: BLUEW },
  // the march: the two columns from Birmingham
  { side: "u", region: JE, pts: [[620.0, 959.0], [640.0, 973.0], [660.0, 993.0], [668.4, 1012.0], [674.6, 1022.4]], t0: T.split - 0.05, dur: 2.2, t1: 88.6, width: BLUEW, maxWidth: BLUEW },
  { side: "u", region: JE, pts: [[616.0, 969.0], [624.0, 984.0], [628.0, 993.0], [640.0, 1004.0], [656.0, 1016.0], [670.0, 1027.0], [673.6, 1031.0]], t0: T.split + 0.3, dur: 2.2, t1: 88.6, width: BLUEW, maxWidth: BLUEW },
  // trenton: the guns race to the head of the streets; the counterattack; colonies: Cornwallis races to Trenton
  { side: "u", region: TR, pts: [[1350.8, 2050.1], [1353.1, 2050.9], [1355.4, 2052.4]], t0: T.raced - 0.05, dur: 1.4, t1: T.hessians - 0.3, width: 0.43, maxWidth: 0.43 },
  { side: "r", region: TR, pts: [[1360.6, 2059.6], [1360.9, 2057.4], [1361.4, 2055.4]], t0: T.counterattack - 0.05, dur: 1.0, t1: T.men2 + 0.4, width: 0.43, maxWidth: 0.43 },
  { side: "r", region: CO, pts: [[NYc[0] - 8, NYc[1] + 6], [NBc[0] + 6, NBc[1] - 2], [PRc[0] + 2, PRc[1] + 3], [TRc[0] + 4, TRc[1] - 2]], t0: T.racing - 0.05, dur: 2.6, t1: T.D + 1, width: 0.34, maxWidth: 0.34 },
];

// ---------------- generals ----------------
const US = "seq/grand_union_flag.png", GB = "seq/gb1707_union_flag.png";
const generals = {
  washington: { img: "seq/washington.png", flag: US, side: "us", name: "Washington", full: "George Washington", role: "General" },
  rall: { img: "seq/rall.png", flag: GB, side: "cs", name: "Rall", full: "Johann Rall", role: "Colonel" },   // no reliable likeness: initials JR
  cornwallis: { img: "seq/cornwallis.png", flag: GB, side: "cs", name: "Cornwallis", full: "Charles Cornwallis", role: "Lieutenant General" },
};
const banners = [
  { general: "rall", region: JE, keys: [[0, TRj[0] + 3.4, TRj[1] - 3.0]], t0: T.colonel - 0.05, t1: T.other - 0.2 },
  { general: "washington", region: JE, keys: [[0, MKj[0] - 6.0, MKj[1] + 3.0]], t0: T.washington - 0.05, t1: T.after - 0.4 },
  { general: "washington", region: JE, keys: [[0, JFj[0] + 3.0, JFj[1] - 4.0], [T.marched + 1.0, JFj[0] + 3.0, JFj[1] - 4.0], [T.split, 616.0, 947.6], [87.0, 619.0, 949.0]], t0: T.washington2 - 0.05, t1: 88.3 },
  // v2 r3 fix (critic A R1 / R2): fades in ON screen behind Greene's blocks in the approach shot; at the head of the town it stands by the arrow's start, in frame, and steps out before the pan south
  { general: "washington", region: TR, keys: [[0, 1333.6, 2031.4]], t0: T.burst - 0.05, t1: 95.4 },
  { general: "washington", region: TR, keys: [[0, 1350.4, 2050.0]], t0: 95.4, t1: 102.4 },
  { general: "rall", region: TR, keys: [[0, 1360.4, 2060.2], [T.counterattack + 0.1, 1360.4, 2060.2], [T.shot2, 1361.0, 2057.6]], t0: T.colonel2 - 0.05, t1: T.men2 + 2.0, fall: T.shot2 + 0.05 },
  { general: "cornwallis", region: CO, keys: [[0, NYc[0] - 4, NYc[1] - 6]], t0: T.cornwallis - 0.05, t1: T.D + 1 },
];

// ---------------- labels ----------------
const labels = [
  { text: "New Jersey", at: [712, 990], region: JE, size: 26, t0: T.jersey - 0.05, t1: T.jersey + 3.4 },
  { text: "Trenton", at: [TRj[0] + 0.5, TRj[1] + 6.0], region: JE, size: 20, t0: T.trenton - 0.05, t1: T.trenton + 4.0 },
  { text: "Delaware River", at: [616, 990], region: JE, size: 17, river: true, t0: T.river - 0.05, t1: T.river + 3.4 },
  { text: "McConkey's Ferry", at: at(-1.0, -HW - 4.6, -2.4), region: CR, size: 17, t0: T.mcconkeys - 0.1, t1: T.mcconkeys + 3.4 },
  { text: "Delaware River", at: at(-3.4, 0.6), region: CR, size: 16, river: true, t0: T.river2 - 0.05, t1: T.river2 + 3.2 },
  { text: "Trenton", at: [TRj[0] + 0.5, TRj[1] + 6.0], region: JE, size: 20, t0: T.trenton2 - 0.3, t1: T.trenton2 + 3.0 },   // the march's goal ("Trenton" 78.89)
  { text: "Birmingham", at: [BIRj[0] - 9, BIRj[1] + 4], region: JE, size: 15, t0: T.crossroads - 0.05, t1: T.crossroads + 3.4 },
  { text: "Trenton", at: [1355.0, 2056.6], region: TR, size: 20, t0: 97.6, t1: 101.1 },   // V2 r2: carved on "the town's two main streets"
  { text: "Assunpink Creek", at: [1364.0, 2071.4], region: TR, size: 15, river: true, t0: T.creek - 0.05, t1: T.creek + 3.4 },
  { text: "New York", at: [NYc[0] + 2, NYc[1] - 10], region: CO, size: 20, t0: T.newyork - 0.05, t1: T.newyork + 3.6 },
  { text: "Trenton", at: [TRc[0] + 2, TRc[1] + 8], region: CO, size: 18, t0: T.trenton3 - 0.05, t1: T.D + 1 },
];
labels[5].t0 = 78.85; labels[5].t1 = 82.0;

// ---------------- storm (from "Around eleven"), Trenton glow, result card, stamp ----------------
const RAIN = VX.rain([[0, 0], [T.around - 0.1, 0], [T.storm + 0.4, 0.75], [T.sleet, 0.95], [68.3, 0.95], [68.5, 0.85], [87.9, 0.85], [88.1, 0.5], [107.5, 0.45], [127.5, 0.3], [150.7, 0.3], [150.8, 0]].map(([t, k]) => [t, k * 0.5])   /* V2: veil halved, n x 2 */,
  { slant: 0.55, n: 2200, speed: 1150, veil: "64,72,84" });
const PU = VX.pulses([{ at: TRj, t0: T.trenton, t1: T.fortifications + 1.6, r: 7, color: [200, 40, 28], period: 1.6, region: JE }]);
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
  el.innerHTML = `<div class="hd">Trenton · 26 December 1776</div><div class="col c1"><div class="sd">Hessians</div><div class="nb">900</div><div class="nt">about 900 captured</div><div class="gn">more than 100 killed or wounded</div></div>
    <div class="vr"></div><div class="col c2"><div class="sd">Americans</div><div class="nb">NONE</div><div class="nt">killed in the battle</div><div class="gn" style="color:#9FB8DC">a handful wounded</div></div>
    <div class="ft">Among the wounded: James Monroe</div><div class="src">American Battlefield Trust; Fischer, Washington's Crossing</div>`;
  host.appendChild(el); const tl = c.tl, gs = window.gsap, on = (sel, t) => { const e = el.querySelector(sel); gs.set(e, { autoAlpha: 0 }); tl.fromTo(e, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", immediateRender: false }, t); };
  gs.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, T.about - 0.3); tl.to(el, { autoAlpha: 0, duration: 0.45 }, 141.7);
  on(".c1 .sd", T.hessians > 0 ? T.about - 0.1 : 0); on(".c1 .nb", T.ninehundred); on(".c1 .nt", T.captured - 0.2); on(".c1 .gn", T.more); on(".vr", T.notone - 0.4); on(".c2 .sd", T.notone - 0.2);
  on(".c2 .nb", T.notone); on(".c2 .nt", T.killed2 - 0.1); on(".c2 .gn", T.handful - 0.05); on(".ft", T.james - 0.1); on(".src", T.monroe + 0.4); }
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
const SW = 34.55, DV = VX.diveTimes(SW);   // push 30.75 (on "After dark"), land ~37.9
const MID = at(0.4, 0.4, 0);
// v2 r3 (critic A #2): in the close regions (crossing, Trenton: x > 1200) the engine's on-screen heading correction is OFF (a flat stand-in
// projection: it turned the walking blocks up to 59 deg off their path and, being camera-dependent, snapped them at the cuts); instead every
// close walk runs along the on-screen vertical (QD / AUP / GD / DG / DS / DB / RING angles, measured with the scene camera), so front =
// velocity in the world AND on screen. Wide regions (jersey, colonies): as before.
let WORLD = null;
const TPROJ = (x, y, h = 0.02) => (!WORLD || x > 1200) ? { x: x * 60, y: y * 60 } : WORLD.projectMap(x, y, h);
const K = (t, region, at0, dist, tilt, yaw, ease = "io", night = 0, o = {}) => ({ t, region, at: at0, dist, tilt, yaw, fov: 30, ease, night, ...o });
const CUT1 = 68.4, CUT2 = 88.0, CUT3 = 150.8;   // round 1: the colonies cut after method card 2 (held to 150.7)
window.SEQ = {
  grade: { wide: { toe: 14, ct: 0.96, sat: 0.95 }, night: { veil: [12, 18, 28], vt: 0.12, vb: 0.5, sat: 0.85 } },   // V2 r3: night veil   // V2: = the v8 clip wide grade
  name: "S05", D: T.D, T, seed: 1776, date: "1776-12-25",
  regions: [JE, CR, TR, CO],
  regionOpts: { [JE]: { troopScale: 3.5 }, [CO]: { troopScale: 8 }, [CR]: { troopScale: 0.67, fxScale: 4.4, decks }, [TR]: { troopScale: 0.68, fxScale: 4.4 } },   // V2: 0.048 x dist (close), 0.022 x dist (wide)
  features: { [JE]: { bridges: [0, 1, 2, 3, 4, 5, 6].map(() => ({ hidden: true })), houseK: 0.35 } },   // houseK as S06; the small wide-map bridge meshes read as crosses from far away
  troops: "blocks", troopsOpts: { proj: TPROJ,   /* v2 r3 (critic A #2): see TPROJ */ look: "lineblocks", size: 1.44, depthK: 0.44, sideCol: { u: "#3f5aa0", r: "#be3a2a" }, pal: { u: { coat: 0x6e7cab, plate: 0x7d8ec6 } } },   // V2 r2: steel blue as v14 (critic 1 #16)   // V2: = v14
  keys: [
    // 1. jersey, winter day: the chain of posts; Trenton
    K(0, JE, [690, 1004], 150, 44, 4),
    K(9.0, JE, [690, 1012], 140, 46, 2, "io"),
    K(14.6, JE, [684, 1018], 128, 47, 0, "lin"),
    // 2. the plan: over the river, dusk falls
    K(21.0, JE, [648, 1012], 165, 45, -54, "io", 0.08),
    K(27.0, JE, [640, 1000], 158, 44, -60, "io", 0.25),
    K(29.4, JE, [640, 990], 150, 44, -40, "io", 0.32),
    // (dive keys from push 30.75 to land ~37.9)
    // 3. the crossing at night: the PA bank, the boats, the NJ bank
    K(41.0, CR, at(-2.4, -3.0, 0), 13.6, 58, -40, "io", NI),
    K(52.4, CR, at(-0.8, -0.6, 1.4), 14, 58, -46, "lin", NI),
    K(60.0, CR, at(3.4, 6.2, 1.0), 14.5, 57, -52, "io", NI),
    K(CUT1, CR, at(6.6, 7.2, 0.4), 14.5, 58, -56, "lin", NI),
    // 4. jersey night storm: the failed crossings, the march, the split
    K(CUT1, JE, [640, 1030], 175, 46, -60, "cut", 0.85, { dissolve: 0.9 }),
    K(75.8, JE, [640, 1006], 160, 46, -58, "lin", 0.85),
    K(80.5, JE, [626, 970], 96, 48, -44, "io", 0.85),
    K(CUT2, JE, [630, 974], 90, 49, -40, "lin", 0.85),
    // 5. trenton grey dawn: the picket, Greene down the Pennington road
    K(CUT2, TR, [1334.9, 2031.6], 12.4, 52, 14, "cut", 0.10, { dissolve: 0.9 }),   // v2 r3 fix (critic A R2): ~30 % closer (dist 16.5 -> 12.4), framed on the picket + Greene's blocks
    K(95.0, TR, [1335.6, 2032.8], 12.4, 52, 10, "lin", 0.08),
    // 6. the head of the town: guns down both streets, the Hessians in the streets
    K(95.4, TR, [1352.8, 2054.9], 16.8, 58, 8, "cut", 0.06, { dissolve: 0.9 }),   // v2 r3 (critic A #12): pulled out, blocks ~70 px; r3 fix (A R1): 0.7 u north + the banner 1.6 u south: inside the frame
    K(102.8, TR, [1353.3, 2055.6], 16.6, 58, 7, "lin", 0.06),
    K(108.0, TR, [1355.6, 2059.6], 15, 57, 4, "io", 0.05),   // r3 fix (A R3): pans south to Sullivan after the banner steps out
    // 7. Rall, the fields east of the town, the surrender
    K(110.5, TR, [1360.2, 2059.6], 13.5, 56, 0, "io", 0.04),   // v2 r3: 1.2 u west (the ring round the Hessians nearer the frame centre)
    K(118.6, TR, [1362.0, 2057.0], 14, 56, -4, "lin", 0.03),
    // 8. the Assunpink bridge
    K(118.65, TR, [1356.6, 2069.4], 9.5, 57, 6, "cut", 0.03, { dissolve: 0.9 }),
    K(127.4, TR, [1357.0, 2069.6], 9.0, 58, 2, "lin", 0.03),
    // 9. result + method card over the town
    K(129.0, TR, [1359.0, 2061.0], 22, 53, 0, "io", 0.03),
    K(CUT3, TR, [1359.6, 2060.4], 24, 52, -2, "lin", 0.03),
    // 10. colonies: New York -> Trenton
    K(CUT3, CO, [490, 392], 400, 44, 0, "cut", 0, { dissolve: 0.9 }),
    K(156.0, CO, [496, 388], 390, 45, 2, "io", 0),
    K(T.D, CO, [452, 414], 410, 44, 0, "io", 0),
  ],
  dives: [{ t: SW, over: [MKj[0] + 8, MKj[1] + 1], overTo: MID,   /* v2 r3 (critic A #7): dive point 8 u east of the ferry: the jersey world edge stays out of the frame before the whiteout */ whooshAt: 32.25,   // round 2 (critic B N6): whoosh body in the gap before "main force"
            off: { warm: 0.05, emerge: 0.1, clear: 0.28, haze: 0.85 },   // round 1 (critic A): shorter flat grey
            from: { region: JE, at: [640, 990], dist: 150, tilt: 44, yaw: -40, night: 0.32 },
            to: { region: CR, at: at(-2.0, -3.4, -0.6), dist: 18, tilt: 57, yaw: -36, fov: 30, night: NI } }],
  clouds: { [JE]: { scatter: { seed: 9, box: [560, 874, 220, 255], n: 9, med: 40 }, diveClear: 60, keepClear: [[680, 1020, 50, 1, 1.0], [672, 1050, 60, 1, 1.0], [620, 990, 40, 1, 0.95], [650, 1015, 45, 1, 0.95]] }, [CR]: { shadows: false }, [TR]: { shadows: false },
            [CO]: { scatter: { seed: 11, n: 24, med: 15 }, keepClear: [[500, 380, 120, 1, 0.8], [360, 480, 110, 1, 0.9]] } },
  units, arrows, banners, boats, fx, generals, labels,
  overlay: [
    ["plaque.date", 0.4, { month: "December 1776", day: "8", weekday: "Sunday", note: "" }],   // v2 r3 (critic A N7): = S04's last plate (the last spoken day) until "Christmas"
    ["label", T.fortifications - 0.05, T.other - 0.3, { name: "No fortifications", sub: "", world: [TRj[0] + 7.0, TRj[1] - 3.0], marker: false }],   // v2 r3 (critic A #21): dark v8 plate, not a rubber stamp
    // v2 r3 (critic A N6): THE ARMIES key + the wax-seal timeline from the first frame (S04 ends with both up), through the night shots
    ["legend", 0.0, CUT2 + 0.1, { entries: [{ name: "Americans", sub: "Washington", color: "#3C6E9E" }, { name: "British", sub: "Howe", color: "#9C3A35" }] }],
    ["timeline.show", 0.0, { month: "1776", year: "1777", cells: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"], at: 4.25 }],
    ["timeline.seal", 0.0, { at: 0.95, name: "Brooklyn" }],
    ["timeline.go", T.christmas - 0.05, { at: 4.8, d: 1.2 }],
    ["plaque.date", T.christmas - 0.05, { month: "December 1776", day: "25", weekday: "Wednesday", note: "Christmas night" }],
    ["plaque.clock", T.dark + 0.3, { time: "18:00", note: "after dark", header: "25 December 1776" }],   // V2: the crossing 6 p.m. - 3 a.m. (FACT C2)
    ["label", T.durham - 0.05, T.iron + 1.2, { name: "Durham boats", sub: "built to carry iron ore", world: (t) => { const B = boats[0], p = VX.along(B.path, B.sAt(t)); return [p[0], p[1], 0.6]; }, side: "us", marker: false }],
    ["label", 50.5, T.brooklyn + 0.9, { name: "The Marblehead men", sub: "who saved the army at Brooklyn", world: (t) => { const B = boats[2], p = VX.along(B.path, B.sAt(t)); return [p[0], p[1], 0.6]; }, side: "us", marker: false }],
    ["plaque.clock", T.around - 0.05, { time: "23:00", note: "the storm breaks", header: "25 December 1776" }],
    ["plaque.clock", T.three2 - 0.05, { time: "3:00", note: "the last guns across", header: "Christmas night" }],
    ["number", T.eighteen - 0.05, CUT1 - 0.2, { value: 18, from: 18, round: 1, suffix: " GUNS", world: at(FLAT - 2.0, HW + 4.6), size: 90 }],
    ["plaque.date", T.schedule - 0.2, { month: "December 1776", day: "26", weekday: "Thursday", note: "hours behind schedule" }],
    ["distance", T.nine2 - 0.05, T.crossroads - 0.3, { from: [JFj[0] + 1.0, JFj[1] + 1.0], to: [TRj[0] - 1.0, TRj[1] - 1.0], value: 9, countFrom: 9, unit: "MILES", sub: "to Trenton", dash: false }],
    ["plaque.clock", T.eight - 0.05, { time: "8:00", note: "the storm still blowing", header: "26 December 1776" }],
    // V2 r3: no "Trenton" note (the carved name says it); the watch keeps "the storm still blowing"   // V2: the watch stays through the fight (v8); only the note changes
    // V2: THE ARMIES key + the wax-seal campaign timeline on the map shots
    ["legend", CUT2 + 0.6, T.about - 0.6, { entries: [{ name: "Americans", sub: "Washington", color: "#3C6E9E" }, { name: "Hessians", sub: "Rall", color: "#9C3A35" }] }],
    ["timeline.seal", T.about - 0.6, { at: 4.72, name: "Trenton" }],
    // V2: the small parchment result list top-right (v8) INSTEAD of the big dark result card; spoken numbers only
    ["plaque.clock", T.about - 0.5, { time: "9:30", note: "the battle over", header: "26 December 1776" }],   // v2 r2 critic B
    ["ledger.show", T.about - 0.3, { title: "Trenton", sub: "26 December 1776" }],
    ["ledger.add", T.captured - 0.05, { who: "About 900 captured", stamp: false }],
    ["ledger.add", T.killed - 0.05, { who: "Over 100 killed or wounded", stamp: false }],
    ["ledger.add", T.killed2 - 0.05, { who: "No American killed", stamp: false }],
    ["ledger.note", T.battle - 0.05, 3, "in the battle"],
    ["ledger.add", T.james - 0.1, { who: "James Monroe wounded", stamp: false }],
    ["ledger.note", 140.65, 4, "a future president"],   // on "future" (140.69)
    ["ledger.hide", 142.2],
    ["timeline.hide", 141.9],   // V2: steps out for the method card (one big card at a time); not on the colonies shot
    // method card (Jackson recipe): line 1 static in the sub, line 2 types on "hit them where they rest"
    ["letter", 142.5, 150.7, { header: "Move 2 · Trenton", title: "The Washington Method", sub: "1. Save the army first", marks: false, quote: "2. Hit them where they rest", qSize: 34, height: 270,
      cps: 20, qAt: T.hit2 - 0.05, lag: 0.05, stagger: 0.06, partDur: 0.35 }],
    ["plaque.date", T.newyork - 0.05, { month: "December 1776", day: "", weekday: "", note: "New York" }],
    // v2 r3 (critic A N6): key + timeline back on the colonies map shot (the key's sub waits for "Cornwallis")
    ["timeline.show", CUT3 + 0.4, { month: "1776", year: "1777", cells: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"], at: 4.8 }],
    ["legend", T.cornwallis - 0.05, T.D + 1, { entries: [{ name: "Americans", sub: "Washington", color: "#3C6E9E" }, { name: "British", sub: "Cornwallis", color: "#9C3A35" }] }],
  ],
  build: (c) => { WORLD = c.world; RAIN.build(c);   // v2 r1: no red pulse   // V2: no big result card
    // the American works south of the Assunpink were dug on 2 January: hidden here
    const R = c.world.regions[TR], Wk = R.works || []; c.FX[TR].custom(() => { for (const m of Wk) m.visible = false; }); },
  draw: (t, c) => { RAIN.draw(t, c); const reg = c.world.cameraAt(t).region, sc = 1920 / c.world.renderer.domElement.width * (c.world.renderer.getPixelRatio ? c.world.renderer.getPixelRatio() : 1);
    for (const p of PINS) { if (p.region !== reg) { p.el.style.visibility = "hidden"; continue; } p.el.style.visibility = "";
      const s = c.world.projectMap(p.world[0], p.world[1], 0.3); p.el.style.transform = `translate(${(s.x * sc).toFixed(1)}px,${(s.y * sc).toFixed(1)}px)`; } },
};
})();
