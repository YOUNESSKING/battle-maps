// S06 THE MUD LINE (D = 103.93 s, python3 ajackson/tools/scene_times.py S06 --words). One region: chalmette (z10 close, base units), by day.
// Shots: the Rodriguez Canal from above, the rampart rising as the men dig, a one-mile ruler, "five feet high / twenty feet thick", the ditch ->
// eight batteries placed one by one (Latour's order and spacing), Battery 3 = the Baratarians -> the defenders file in, each group labelled on its
// word (regulars, Louisiana militia, free men of colour, Tennessee + Kentucky riflemen, Choctaw at the swamp edge) -> 27 December: British guns
// on the levee set the Carolina on fire across the river -> 28 December: two British columns probe the line, the line's guns and the ship
// Louisiana drive them back -> 1 January 1815: fog, sugar-barrel batteries built in the night, the duel when the fog lifts, the British guns
// silenced -> wide: Pakenham's banner, his three-part plan as arrows (west bank, river column, main column by the swamp), bundles + ladders,
// LADDERS stamp.
// Facts: ajackson/research/FACT_NOTES_neworleans.md items 33-41 (canal, rampart 5 ft / 20 ft, eight batteries + Baratarians at No. 3, defenders,
// Carolina 27 Dec, 28 Dec probe + Louisiana, 1 Jan sugar hogsheads + fog, the plan, fascines and ladders).
(() => {
const T = { D: 103.93,
  dug: 1.12, along: 2.56, rodriguez: 2.78, canal: 3.22, river: 4.34, cypress: 4.88, swamp: 5.28, mile: 6.34, long: 6.54, piled: 7.60, wall: 8.36,
  earth: 8.90, mud: 9.48, five: 11.00, feet: 11.40, high: 11.68, twenty: 12.84, thick: 13.62, ditch: 15.52, front: 16.04,
  along2: 17.10, jackson: 17.86, placed: 18.12, eight: 18.54, batteries: 18.86, guns: 19.64, one: 20.78, baratarians: 22.24, smugglers: 23.72,
  privateers: 24.56, jean: 25.52, lafitte: 25.84, chosen: 27.04, city: 28.26, against: 29.12,
  behind: 30.52, regulars: 31.42, louisiana: 33.14, two: 34.28, battalions: 34.46, free: 35.38, colour: 36.48, tennessee: 36.94, kentucky: 37.64,
  riflemen: 38.20, choctaw: 39.40, warriors: 40.00, edge: 40.84, swamp2: 41.40, strangest: 43.20, armies: 43.84, history: 44.92,
  tested: 46.68, twentyseventh: 48.57, december: 49.02, theirguns: 49.68, carolina: 50.56, fire: 51.36, next: 52.62, day: 52.84, advanced: 53.32,
  line: 54.20, american: 55.12, aguns: 55.52, ship: 56.82, louisianaShip: 57.04, firing: 57.76, river2: 58.88, drove: 59.52, back: 60.08,
  newyear: 61.34, nyday: 61.88, pakenham: 62.42, tried: 62.72, hisguns: 63.26, gunners: 64.46, built: 64.84, night: 66.02, barrels: 67.50,
  sugar: 68.10, fog: 69.34, lifted: 69.66, opened: 70.40, fire2: 70.78, within: 71.94, hours: 72.44, americanG: 73.18, shot: 74.28, pieces: 75.40,
  pakenham2: 76.56, choice: 77.56, storm: 78.62, wall2: 79.22, plan: 80.24, three: 80.82, parts: 81.10, across: 82.04, land: 83.74, west: 84.40,
  bank: 84.64, turn: 85.14, aguns2: 85.96, jline: 87.50, east: 88.70, column: 89.78, attack: 90.44, riverC: 91.38, main: 92.38, mcol: 92.66,
  hit: 93.32, near: 93.98, swampC: 94.42, cross: 95.46, ditch2: 96.02, climb: 96.44, wall3: 97.02, carry: 97.80, bundles: 98.14, sugarcane: 98.82,
  ladders: 99.84, remember: 101.00, ladders2: 101.52 };
const CH = "chalmette", P = (n) => VX.place(n, CH);
const RE = P("Jackson's line, river end"), EL = P("Jackson's line, elbow"), SE = P("Jackson's line, swamp end");
const MAR = P("Marine Battery"), VIL = P("Villere plantation house"), MAC = P("Macarty house");
const ROAD = VX.road(CH, "River road, east bank");
// the straight stretch (river -> wood): unit vector u, front n (ESE, toward the British); the receding leg into the swamp (elbow -> swamp end)
const L1 = Math.hypot(EL[0] - RE[0], EL[1] - RE[1]), uS = [(EL[0] - RE[0]) / L1, (EL[1] - RE[1]) / L1], nS = [-uS[1], uS[0]];
const L2 = Math.hypot(SE[0] - EL[0], SE[1] - EL[1]), uL = [(SE[0] - EL[0]) / L2, (SE[1] - EL[1]) / L2], nL = [uL[1], -uL[0]];
const FS = Math.atan2(nS[1], nS[0]), FL = Math.atan2(nL[1], nL[0]);
const onS = (s, d = 0) => [RE[0] + uS[0] * s + nS[0] * d, RE[1] + uS[1] * s + nS[1] * d];   // s along the straight stretch, d toward the front
const onL = (s, d = 0) => [EL[0] + uL[0] * s + nL[0] * d, EL[1] + uL[1] * s + nL[1] * d];

// ---------------- units ----------------
const units = [];
const add = (o) => { units.push({ type: "inf", n: 1, region: CH, arrive: false, ...o }); return units.length - 1; };
// the eight batteries (Latour pp. 147-148, yards from the previous one: 90, 50, 20, 190, 36, 190, 60; No. 3 and No. 4 and No. 5 / No. 6 are
// spread a little so the gun blocks do not touch), each appearing on the line in turn on "eight batteries of guns"
const BAT = [0.18, 0.74, 1.12, 1.52, 2.42, 2.86, 3.98, 4.42];
const batU = BAT.map((s, i) => add({ side: "u", type: "art", bw: 0.24, bd: 0.2, keys: [[0, ...onS(s, -0.42)]], face: FS, t0: T.eight - 0.3 + i * 0.32 }));   // round 1: guns at ~half size
// the defenders: diggers on the line from the start (they stay and fight), the other groups file in from the rear on their words
const POS = {
  reg1: onS(0.46, -0.95), reg2: onS(1.97, -0.75), lam: onS(3.42, -0.75), fmc1: onS(4.2, -1.0), fmc2: onS(2.6, -1.0),   // round 1: right behind the wall, between the batteries
  tn1: onL(0.9, -0.95), tn2: onL(1.95, -0.95), ky1: onL(3.0, -0.95), ky2: onL(4.05, -0.95), cho: onL(5.6, -0.3),
};
const back = (p, f, d) => [p[0] - Math.cos(f) * d, p[1] - Math.sin(f) * d];
const fileIn = (key, f, t, d = 3.2) => add({ side: "u", face: f, t0: t - 0.5, keys: [[t - 0.4, ...back(POS[key], f, d)], [t + 2.6, ...POS[key]], [T.D, ...POS[key]]] });
add({ side: "u", face: FS, keys: [[0, ...POS.reg1]] });                       // diggers: the regulars by the river
add({ side: "u", face: FS, keys: [[0, ...POS.reg2]] });
add({ side: "u", face: FL, keys: [[0, ...POS.tn1]] });                        // and Carroll's Tennesseans on the receding leg
add({ side: "u", face: FL, keys: [[0, ...POS.tn2]] });
fileIn("lam", FS, T.louisiana);
fileIn("fmc1", FS, T.colour - 0.6); fileIn("fmc2", FS, T.colour - 0.3, 2.4);
fileIn("ky1", FL, T.kentucky); fileIn("ky2", FL, T.kentucky + 0.4);
fileIn("cho", FL, T.choctaw, 2.6);
// 28 December: the reconnaissance in force: a column on the river road and one by the swamp; driven back (escape = about-face, walk off east)
const FRC = Math.atan2(3231.6 - 3233.2, 1258.6 - 1260.8), FSC = Math.atan2(3226.8 - 3228.2, 1258.8 - 1261.2);   // = their walking directions
add({ side: "r", n: 3, face: FRC, t0: T.next - 0.3, keys: [[T.next - 0.4, 1260.8, 3233.2], [T.next + 1.8, 1260.8, 3233.2], [T.line + 3.6, 1258.6, 3231.6], [T.D, 1258.6, 3231.6]],   // round 1: on the bank, not the river
  escape: { road: ROAD, t0: T.line + 3.8, v: 1.1, v2: 1.1, join: "east" }, t1: 68.0 });   // round 1: stop, turn about (~6.5 s), walk off
add({ side: "r", n: 3, face: FSC, t0: T.next - 0.3, keys: [[T.next - 0.4, 1261.2, 3228.2], [T.next + 1.8, 1261.2, 3228.2], [T.line + 3.6, 1258.8, 3226.8], [T.D, 1258.8, 3226.8]],
  escape: { road: [[1258.8, 3226.8], [1262.4, 3228.6], [1266.4, 3230.2], [1271.0, 3231.4]], t0: T.line + 4.0, v: 1.1, v2: 1.1, join: "east" }, t1: 68.0 });
// 1 January: the British batteries behind their sugar-barrel parapet (works[2]), built in the night; silenced (grey) by the American guns
const BB = VX.work(CH, 2), bbAt = (k) => { const p = VX.along(BB, VX.len(BB) * k); return [p[0] + 0.42, p[1] + 0.12]; };
const FB = Math.PI + FS;
const brG = [0.18, 0.5, 0.82].map((k, i) => add({ side: "r", type: "art", n: 2, face: FB, keys: [[0, ...bbAt(k)]], t0: T.night - 0.2 + i * 0.3, cap: T.shot + 0.2 + i * 0.35, t1: 76.2 }));
// the plan: the main column (Gibbs) by the swamp, the river column (Keane), the west-bank force (Thornton) at Villere's landing
const MAINC = [1263.2, 3227.6], RIVC = [1263.0, 3233.9], WB = [1282.4, 3237.4];
add({ side: "r", n: 3, face: Math.PI + 0.42, keys: [[0, ...MAINC]], t0: T.main - 0.2 });
add({ side: "r", n: 2, face: Math.PI + 0.62, keys: [[0, ...RIVC]], t0: T.east - 0.1 });
add({ side: "r", n: 2, face: Math.PI + 0.9, keys: [[0, ...WB]], t0: T.across - 0.1 });

// ---------------- boats: the Carolina (27 Dec), the Louisiana (28 Dec), the west-bank boats (plan) ----------------
const CAROL = [1262.8, 3241.0], LOUIS = [1251.6, 3232.9];
const boats = [
  { region: CH, kind: "ship", n: 1, path: [[CAROL[0] - 0.5, CAROL[1] + 0.05], [CAROL[0] + 0.5, CAROL[1] - 0.05]], sAt: () => 0.5, t0: 45.5, t1: 54.4, size: 0.32, lamp: false, wake: false, h: (t) => 0.11 - 0.55 * VX.sstep(T.fire + 0.4, T.fire + 2.6, t) },   // round 1: burns, then sinks (no pop)
  { region: CH, kind: "ship", n: 1, path: [[LOUIS[0] - 0.5, LOUIS[1] - 0.4], [LOUIS[0] + 0.5, LOUIS[1] + 0.4]], sAt: () => 0.5, t0: T.next + 0.2, t1: 61.0, size: 0.34, lamp: false, wake: false },
  { region: CH, kind: "barge", n: 4, path: [[WB[0] + 0.6, 3239.8], [WB[0] - 0.4, 3242.2], [WB[0] - 2.0, 3244.6], [WB[0] - 3.4, 3246.0]], s0: 0, speed: 0.7, spacing: 1.1, t0: T.land - 0.4, t1: T.D + 1, size: 0.16, lamp: false, wake: true },
];

// ---------------- fx ----------------
const shot = (t, at, imp, delay = 0.55) => ({ t, at, dir: [imp[0] - at[0], imp[1] - at[1]], impact: imp, delay });
const LEVEE_GUN = [1266.6, 3236.4];
const guns = [
  // 27 Dec: British guns on the levee fire hot shot at the Carolina
  { region: CH, opts: { plume: 0.5, puffs: 8, alpha: 0.2, jet: 1.4 }, shots: [T.theirguns, T.theirguns + 0.55, T.carolina - 0.1, T.carolina + 0.5].map((t, i) => shot(t, [LEVEE_GUN[0] + (i % 2) * 0.5, LEVEE_GUN[1]], [CAROL[0] + 0.3 - i * 0.2, CAROL[1] - 0.2], 0.45)) },
  // 28 Dec: the line's guns and the Louisiana drive the columns back
  { region: CH, opts: { plume: 0.45, puffs: 7, alpha: 0.2, jet: 1.6 }, shots: [T.aguns - 0.1, 56.0, 56.6, 57.4, 58.2, 59.0].map((t, i) => shot(t, onS(BAT[[0, 2, 4, 6, 1, 3][i]], -0.42), i % 2 ? [1258.6 + (i % 3) * 0.4, 3227.4] : [1258.0 + (i % 3) * 0.3, 3232.6], 0.6)) },
  { region: CH, h: 0.5, opts: { plume: 0.5, puffs: 8, alpha: 0.2, jet: 1.4 }, shots: [T.louisianaShip, T.firing + 0.2, 58.6, 59.4].map((t, i) => shot(t, LOUIS, [1258.0 + i * 0.4, 3232.6 + (i % 2) * 0.4], 0.55)) },
  // 1 Jan: the British batteries open when the fog lifts; the American guns answer and silence them
  { region: CH, opts: { plume: 0.45, puffs: 7, alpha: 0.2, jet: 1.6 }, shots: [T.opened + 0.05, 70.9, 71.5, 72.2, 72.9, 73.5].map((t, i) => shot(t, bbAt([0.18, 0.5, 0.82][i % 3]), onS(BAT[(i * 3) % 8] + 0.2, -0.1), 0.6)) },
  { region: CH, opts: { plume: 0.45, puffs: 7, alpha: 0.2, jet: 1.6 }, shots: [71.0, 71.6, 72.15, 72.7, 73.2, 73.75].map((t, i) => shot(t, onS(BAT[(i * 5 + 1) % 8], -0.42), bbAt([0.18, 0.5, 0.82][i % 3]).map((v, k) => v + (k ? 0.2 : -0.3) * ((i % 2) - 0.5)), 0.6)) },
];
const fires = [
  { region: CH, at: [CAROL[0], CAROL[1], 0.3], t0: T.carolina + 0.3, t1: T.fire + 2.4, preset: "steamer", opts: { size: 1.3, glowSize: 14 }, cue: T.fire },
  ...[0.18, 0.5, 0.82].map((k, i) => ({ region: CH, at: [...bbAt(k), 0.15], t0: T.shot + 0.3 + i * 0.35, t1: 77.0, preset: "smoulder", cue: false })),
];
const volleys = [
  // 28 Dec: the riflemen on the line fire at the swamp column
  { region: CH, pts: [onL(0.4, -0.55), onL(1.6, -0.55), onL(2.6, -0.55)], t0: T.american + 0.4, t1: T.drove + 0.6, opts: { dir: nL, size: 0.8, alpha: 0.09, life: 10, muzzle: 5, rate: 3.0, volley: 1.6, roll: 0.6, height: 2.0 } },
];
const fx = { fires, volleys, guns };

// ---------------- arrows ----------------
const arrows = [
  { side: "r", pts: [[1263.0, 3236.8], [1260.2, 3234.6], [1257.8, 3232.6]], t0: T.advanced, dur: 1.6, t1: T.drove, width: 0.2 },
  { side: "r", pts: [[1264.2, 3230.0], [1261.4, 3228.3], [1259.0, 3227.0]], t0: T.advanced + 0.3, dur: 1.6, t1: T.drove, width: 0.2 },
  // the plan: 1. across the river to the west bank, up to the American guns there; then those guns turned on the line
  { side: "r", pts: [[WB[0] - 0.6, 3239.6], [1279.0, 3244.4], [1272.0, 3245.8], [1262.0, 3243.6], [1254.0, 3239.4], [MAR[0] + 1.2, MAR[1] + 1.6]], t0: T.across, dur: 3.0, t1: T.D + 1, width: 0.62, maxWidth: 0.7 },
  { side: "r", pts: [[MAR[0] + 0.4, MAR[1] - 0.6], [MAR[0] + 1.4, MAR[1] - 2.6], [RE[0] + 0.2, RE[1] + 0.6]], t0: T.turn, dur: 1.4, t1: T.D + 1, width: 0.45, maxWidth: 0.7 },
  // 2. the river column; 3. the main column by the swamp
  { side: "r", pts: [[RIVC[0] - 1.2, RIVC[1] - 0.6], [1258.6, 3231.6], [RE[0] + 1.4, RE[1] + 0.9]], t0: T.column, dur: 1.8, t1: T.D + 1, width: 0.62, maxWidth: 0.7 },
  { side: "r", pts: [[MAINC[0] - 1.4, MAINC[1] - 0.4], [1259.0, 3226.2], [EL[0] + 1.6, EL[1] + 0.9]], t0: T.mcol, dur: 1.8, t1: T.D + 1, width: 0.75, maxWidth: 0.8 },
];

// ---------------- generals ----------------
const generals = {
  jackson: { img: "seq/jackson.png", flag: "seq/us15_flag.png", side: "us", name: "Jackson", full: "Andrew Jackson", role: "Major General" },
  pakenham: { img: "seq/pakenham.png", flag: "seq/gb1801_union_flag.png", side: "cs", name: "Pakenham", full: "Sir Edward Pakenham", role: "Major General" },
};
const banners = [
  { general: "jackson", keys: [[0, MAC[0] - 0.6, MAC[1] - 1.4]], t0: T.jackson - 0.05, t1: T.tested - 0.4 },
  { general: "pakenham", keys: [[0, 1266.6, 3231.0]], t0: T.pakenham - 0.05, t1: T.D + 1 },
];

// ---------------- labels (small, each on its word, ~3.5 s) ----------------
const lab = (text, at, t0, d = 3.5, o = {}) => ({ text, at, t0, t1: t0 + d, region: CH, size: 15, ...o });
const labels = [
  lab("Rodriguez Canal", onS(2.3, 1.1), T.rodriguez - 0.05, 4.2, { size: 18 }),
  lab("Mississippi", [1255.6, 3236.4], T.river - 0.05, 3.0, { river: true }),
  lab("cypress swamp", onL(5.0, 2.2), T.cypress - 0.05, 3.2, { river: true }),
  lab("the ditch", onS(3.4, 0.55), T.ditch - 0.05, 2.6, { river: true, size: 14 }),
  lab("Baratarians", onS(BAT[2], -1.3), T.baratarians - 0.05, 5.0, { size: 16 }),
  lab("regulars", onS(0.46, -1.9), T.regulars - 0.05),
  lab("Louisiana militia", onS(3.3, -2.0), T.louisiana - 0.05),
  lab("free men of colour", onS(3.4, -3.1), T.colour - 0.6, 3.6),
  lab("Tennessee", onL(1.4, -1.9), T.tennessee - 0.05, 3.2),
  lab("Kentucky", onL(3.5, -1.9), T.kentucky - 0.05, 3.2),
  lab("Choctaw", onL(5.6, -1.4), T.choctaw - 0.05, 3.6),
  lab("Carolina", [CAROL[0], CAROL[1] + 0.9], T.carolina - 0.05, 3.0),
  lab("Louisiana", [LOUIS[0] - 0.4, LOUIS[1] + 1.1], T.louisianaShip - 0.05, 3.0),
  lab("sugar barrels", [bbAt(0.5)[0] + 1.0, bbAt(0.5)[1]], T.barrels - 0.05, 3.2),
  lab("west bank", [1262.0, 3246.2], T.west - 0.05, 3.4, { river: true }),
];

window.SEQ = {
  name: "S06", D: T.D, T, seed: 1815, date: "1814-12-24",
  regions: [CH],
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  keys: [
    // 1. from above the British side, looking back at the line being dug
    { t: 0, region: CH, at: onS(2.4, 1.0), dist: 17, tilt: 48, yaw: 112, fov: 30 },
    { t: 16.6, region: CH, at: onS(3.0, 0.4), dist: 14.5, tilt: 50, yaw: 104, fov: 30, ease: "lin" },
    // 2. down the line: batteries, the Baratarians, the defenders filing in (the leg into the swamp)
    { t: 21.2, region: CH, at: onS(1.6, -0.4), dist: 11.5, tilt: 52, yaw: 96, fov: 30, ease: "io" },
    { t: 30.0, region: CH, at: onS(2.4, -0.8), dist: 12.5, tilt: 52, yaw: 100, fov: 30, ease: "lin" },
    { t: 37.0, region: CH, at: onL(1.8, -0.6), dist: 13.5, tilt: 52, yaw: 112, fov: 30, ease: "io" },
    { t: 45.0, region: CH, at: onL(1.6, 0.2), dist: 17, tilt: 50, yaw: 106, fov: 30, ease: "lin" },
    // 3. 27 Dec: across the river, the Carolina burns
    { t: 48.4, region: CH, at: [1264.2, 3239.2], dist: 12, tilt: 55, yaw: 60, fov: 30, ease: "io" },
    { t: 53.4, region: CH, at: [1263.6, 3239.6], dist: 11, tilt: 56, yaw: 56, fov: 30, ease: "lin" },
    // 4. 28 Dec: the columns probe the line
    { t: 55.0, region: CH, at: [1256.4, 3230.0], dist: 16, tilt: 50, yaw: 72, fov: 30, ease: "io" },
    { t: 60.8, region: CH, at: [1256.8, 3230.0], dist: 15, tilt: 51, yaw: 66, fov: 30, ease: "lin" },
    // 5. 1 January: the British batteries in the fog, the duel
    { t: 64.0, region: CH, at: [1254.6, 3229.0], dist: 17, tilt: 52, yaw: 64, fov: 30, ease: "io" },
    { t: 76.0, region: CH, at: [1254.8, 3229.2], dist: 16, tilt: 53, yaw: 58, fov: 30, ease: "lin" },
    // 6. the plan: up and wide over both banks
    { t: 82.0, region: CH, at: [1265.0, 3235.8], dist: 40, tilt: 44, yaw: 16, fov: 30, ease: "io" },
    { t: 92.0, region: CH, at: [1262.0, 3234.0], dist: 37, tilt: 45, yaw: 10, fov: 30, ease: "lin" },
    { t: T.D, region: CH, at: [1259.0, 3229.4], dist: 27, tilt: 48, yaw: 6, fov: 30, ease: "io" },
  ],
  clouds: { [CH]: { shadows: true } },
  units, arrows, banners, boats, fx, generals, labels,
  overlay: [
    ["plaque.date", 0.4, { month: "December 1814", day: "24", weekday: "Saturday", note: "the Rodriguez Canal" }],
    ["distance", T.mile - 0.15, T.mud + 0.3, { from: RE, to: SE, value: 1, countFrom: 1, unit: "MILE", sub: "river to swamp", dash: false }],
    ["label", T.five - 0.05, T.ditch - 0.4, { name: "Five feet high", sub: "", world: onS(1.2, 0.2), side: "us", marker: false }],
    ["label", T.twenty - 0.05, T.ditch - 0.4, { name: "Twenty feet thick", sub: "", world: onS(3.6, 0.2), side: "us", marker: false }],
    ["number", T.eight - 0.05, T.one - 0.1, { value: 8, round: 1, world: onS(2.4, -0.2), size: 96, countDur: 0.6 }],
    ["label", T.strangest - 0.05, T.history + 0.8, { name: "One of the strangest armies", sub: "", world: onS(2.0, -3.4), side: "us", marker: false }],
    ["plaque.date", T.twentyseventh - 0.05, { month: "December 1814", day: "27", weekday: "Tuesday", note: "the Carolina burns" }],
    ["plaque.date", T.next - 0.05, { month: "December 1814", day: "28", weekday: "Wednesday", note: "a probe in force" }],
    ["plaque.date", T.newyear - 0.05, { month: "January 1815", day: "1", weekday: "Sunday", note: "New Year's Day · fog" }],
    ["plaque.note", T.lifted, "the fog lifts"],
    ["plaque.note", T.plan, "Pakenham's plan"],
    ["label", T.across - 0.05, T.turn + 2.4, { name: "1 · West bank", sub: "", world: [MAR[0] + 1.6, MAR[1] + 2.2], side: "uk", marker: false }],
    ["label", T.east - 0.05, T.column + 3.0, { name: "2 · River column", sub: "", world: [RE[0] + 2.0, RE[1] + 1.8], side: "uk", marker: false }],
    ["label", T.main - 0.05, T.swampC + 2.4, { name: "3 · Main column", sub: "", world: [EL[0] + 2.4, EL[1] - 0.2], side: "uk", marker: false }],
    (O, c) => icon(c, "bundle", T.bundles - 0.05, T.D, [1260.6, 3226.9], 0),
    (O, c) => icon(c, "ladder", T.ladders - 0.05, T.D, [1259.2, 3225.9], 1),
    (O, c) => stamp(c, "LADDERS", T.remember - 0.05, T.D, [1258.8, 3223.6]),
  ],
  // the rampart rises as they dig (24 Dec); the 1 Jan British parapet is built in the night; the redoubt / west-bank works appear when needed
  build: (c) => { const R = c.world.regions[CH], W = R.works || [], ys = R.ys || 1, info = (VX.region(CH).features || {}).works || [];
    const crest = W.map((m, i) => ((info[i] || {}).height_m || 1.5) * ys);   // crest height above the ground (world units)
    const rise = [[0.3, 12.5, 0.15, 0.55], [70.0, 76.0, 0], [T.night - 0.6, T.night + 1.6, 0], [T.across - 1.0, T.across + 1.0, 0], [T.across - 1.0, T.across + 1.0, 0]];
    c.FX[CH].custom((t) => { W.forEach((m, i) => { const [a, b, k0, k1 = 1] = rise[i] || [0, 0, 1]; const k = k0 + (k1 - k0) * c.sstep(a, b, t); m.visible = k > 0.01; m.position.y = -(1 - k) * crest[i] - (k < 0.2 ? (0.2 - k) * 0.6 : 0); }); });
    fogBuild(c); },
  draw: (t, c) => { fogDraw(t, c); const sc = 1920 / c.world.renderer.domElement.width * (c.world.renderer.getPixelRatio ? c.world.renderer.getPixelRatio() : 1);
    for (const p of PINS) { const s = c.world.projectMap(p.world[0], p.world[1], 0.3); p.el.style.transform = `translate(${(s.x * sc).toFixed(1)}px,${(s.y * sc).toFixed(1)}px)`; } },
};

// ---------------- 1 January fog: a pale veil over the map (thicker toward the horizon, drifting soft banks), lifting on "the fog lifted" ----------------
let FOGC = null;
function fogBuild(c) { const cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
  const tr = document.getElementById("troops"); tr.parentNode.insertBefore(cv, tr); FOGC = cv.getContext("2d"); }
function fogDraw(t, c) { if (!FOGC) return; const g = FOGC; g.clearRect(0, 0, 640, 360);
  const k = c.sstep(T.newyear - 0.4, T.newyear + 1.0, t) * (1 - c.sstep(T.fog, T.fire2 + 0.6, t)); if (k <= 0.002) return;
  const gr = g.createLinearGradient(0, 0, 0, 360); gr.addColorStop(0, `rgba(214,216,210,${(0.78 * k).toFixed(3)})`); gr.addColorStop(0.55, `rgba(206,208,203,${(0.5 * k).toFixed(3)})`);
  gr.addColorStop(1, `rgba(200,203,198,${(0.3 * k).toFixed(3)})`); g.fillStyle = gr; g.fillRect(0, 0, 640, 360);
  for (let i = 0; i < 9; i++) { const x = ((VX.hsh(i, 21) * 900 + t * (6 + 5 * VX.hsh(i, 22))) % 900) - 130, y = 60 + VX.hsh(i, 23) * 260, r = 90 + VX.hsh(i, 24) * 90;
    const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(222,224,219,${(0.22 * k).toFixed(3)})`); rg.addColorStop(1, "rgba(222,224,219,0)"); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); } }

// ---------------- pinned overlay bits: icons (bundles of cane, a ladder) and a red stamp ----------------
const PINS = [];
const ICON = {
  bundle: `<svg width="64" height="40" viewBox="0 0 64 40"><g stroke="#3a2a14" stroke-width="2" fill="#c9a764"><rect x="4" y="12" width="56" height="16" rx="8"/></g>
    <g stroke="#6e5226" stroke-width="1.4"><path d="M8 16 L56 16 M8 20 L56 20 M8 24 L56 24"/></g><g stroke="#3a2a14" stroke-width="3"><path d="M20 10 L20 30 M44 10 L44 30"/></g></svg>`,
  ladder: `<svg width="44" height="70" viewBox="0 0 44 70"><g stroke="#3a2a14" stroke-width="7" stroke-linecap="round"><path d="M10 4 L10 66 M34 4 L34 66"/></g>
    <g stroke="#3a2a14" stroke-width="6"><path d="M10 14 L34 14 M10 28 L34 28 M10 42 L34 42 M10 56 L34 56"/></g>
    <g stroke="#c9a764" stroke-width="3.2" stroke-linecap="round"><path d="M10 4 L10 66 M34 4 L34 66 M10 14 L34 14 M10 28 L34 28 M10 42 L34 42 M10 56 L34 56"/></g></svg>`,
};
function pin(c, html, t0, t1, world) {
  const host = document.querySelector("#ov .gmo") || document.getElementById("ov"), el = document.createElement("div");
  el.style.cssText = "position:absolute;left:0;top:0;z-index:40;pointer-events:none;width:0;height:0";
  el.innerHTML = html; host.appendChild(el); window.gsap.set(el, { autoAlpha: 0 });
  c.tl.to(el, { autoAlpha: 0, duration: 0.5 }, t1); PINS.push({ el, world }); return el;
}
function icon(c, kind, t0, t1, world) {
  const el = pin(c, `<div style="position:absolute;transform:translate(-50%,-100%);filter:drop-shadow(0 3px 4px rgba(0,0,0,.5))">${ICON[kind]}</div>`, t0, t1, world);
  c.tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, t0);
  c.tl.fromTo(el.firstChild, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, t0);
}
function stamp(c, text, t0, t1, world) {
  const el = pin(c, `<span class="stamp" style="position:absolute;left:0;top:0;transform:translate(-50%,-50%);color:#A8261B;font-size:68px;padding:8px 26px 5px;border-width:5px;white-space:nowrap;background:rgba(240,230,205,.55)">${text}</span>`, t0, t1, world);
  c.tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, t0);
  c.tl.fromTo(el.firstChild, { scale: 2.3, rotation: -14, opacity: 0 }, { scale: 1, rotation: -6, opacity: 0.94, duration: 0.24, ease: "power4.in", immediateRender: false }, t0);
}
})();
