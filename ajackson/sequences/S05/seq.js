// S05 MOVE 2: THE NIGHT ATTACK, 23 DECEMBER 1814 (D = 148.07 s, python3 ajackson/tools/scene_times.py S05 --words).
// Regions: neworleans (z10 wide, = base units) and chalmette (z10 close, = base units): the SAME coordinates in both.
// Shots: neworleans wide (British at Villere, 9-mile ruler to the city) -> dissolve -> chalmette day (Keane's camp, fires lit) -> dissolve ->
// neworleans (Jackson in the city, quote, WHAT WOULD YOU DO? while dusk falls) -> cloud dive 3 into the night plain (chalmette, night 1) ->
// the Carolina drifts down and anchors off the camp, broadside, fires out -> Jackson's line down the river road + Coffee by the swamp edge ->
// the melee (small mixed groups, flashes, smoke, camera low) -> grey dawn: the Americans fall back to the Rodriguez Canal, result ledger ->
// dissolve -> neworleans: the British halted 9 miles out, HALTED stamp, method card 2 -> dissolve -> chalmette day, Christmas: Pakenham,
// reinforcements out of the swamp, 8,000.
// Facts: ajackson/research/FACT_NOTES_neworleans.md items 24-32 (times, 2,131 US vs ~1,680 GB, Carolina 7:30 p.m., Coffee's swing by the
// swamp, 213 / 277, withdrawal 4 a.m. 24 Dec two miles to the Rodriguez Canal), 8 + 9 (Pakenham 25 Dec, ~8,000), 25 (nine miles).
(() => {
const T = { D: 148.07,
  plan: 0.71, rest: 2.89, march: 4.05, city: 4.79, guard: 6.37, seventeen: 7.35, tired: 8.97, boats: 10.63, fires: 12.07, night0: 13.75,
  incity: 15.05, jackson: 15.67, afternoon: 17.41, said: 18.91, gentlemen: 21.19, below: 22.55, tonight: 24.39,
  stop: 25.75, place: 28.37, militia: 30.13, volunteers: 31.73, regulars: 32.41, enemy: 33.67, bregs: 34.67, landing: 36.17, hour: 36.91,
  dig: 38.17, wait: 39.49, attack: 41.01, tonight2: 41.33, tell: 43.33, comments: 43.99, listen: 46.21, did: 47.35,
  notwait: 48.37, instead: 50.09, marched: 50.93, road: 52.25, evening: 53.43, first: 54.67, sent: 55.63, schooner: 56.15, carolina: 56.61,
  drifting: 57.19, anchored: 60.03, camp: 61.63,
  halfpast: 63.11, seven: 63.73, guns: 64.81, opened: 65.13, fire: 65.63, campfires: 66.51, threw: 68.21, levee: 70.01, out: 71.47,
  then: 72.53, attacked: 73.05, regulars2: 74.45, volunteers2: 75.77, road2: 77.23, coffee: 78.82, swung: 79.73, swamp: 80.87, struck: 81.47, side: 82.59,
  dark: 83.93, smoke: 84.61, hundred: 86.59, fights: 87.33, friend: 89.51, muskets: 91.75, bayonets: 92.55, cane: 93.87, hours: 95.29, dark2: 96.23,
  neither: 97.45, broke: 98.05, each: 99.07, lost: 99.27, men: 101.21, dawn: 102.41, pulled: 103.51, miles: 104.51, canal: 105.57, rodriguez: 106.55,
  stung: 108.95, attackedCamp: 110.33, night: 111.87, count: 113.83, commander: 115.07, decided: 115.49, wait2: 116.27, army: 117.29, moved: 118.27,
  bought: 119.57, time: 121.89,
  method: 124.49, lands: 126.03, hit: 126.57, first2: 127.03, feet: 128.73,
  christmas: 129.99, arrived: 131.93, pakenham: 133.95, wellington: 134.73, salamanca: 138.11, january: 140.63, regiments: 141.99, eight: 143.45,
  thousand: 143.79, attack3: 145.81 };
const NO = "neworleans", CH = "chalmette";
const P = (n) => VX.place(n, CH);
const CITY = VX.place("New Orleans 1815", NO), VIL = P("Villere plantation house"), LAC = P("Lacoste plantation"), DLR = P("De la Ronde plantation"),
  CAR = P("USS Carolina anchorage"), CANAL = P("Villere canal head"), RRE = P("Jackson's line, river end"), REL = P("Jackson's line, elbow"),
  MAC = P("Macarty house");
const E = 0, W = Math.PI, S_ = Math.PI / 2;        // facings: east, west, south (y grows south)
const ROAD = VX.road(CH, "River road, east bank");
const roadY = (x) => { let b = ROAD[0]; for (const p of ROAD) if (Math.abs(p[0] - x) < Math.abs(b[0] - x)) b = p; return b[1]; };

// ---------------- dive 3 + night ----------------
const SW = 49.3, DV = VX.diveTimes(SW);              // push 45.5 (on "listen"), white-out ~47.6-49.8, land 52.65
const NI = 0.85;                                     // night strength (readable blocks at 720p)

// ---------------- units ----------------
// Lanes (map y) along the plantation strip at the battle: the Americans in lanes BL, the British in lanes RL in between, so the two sides
// can mix in the melee without one block sitting on another (n = 1 blocks, 0.84 wide, lanes 0.95 apart).
const BL = [3238.3, 3236.4, 3234.5], RL = [3237.35, 3235.45, 3233.55], CL = [3232.4, 3231.45];
const units = [];
const u = (side, n, keys, face, o = {}) => { units.push({ side, type: "inf", n, region: CH, keys, face, arrive: false, ...o }); return units.length - 1; };
// the British advance guard: front row (lanes RL) in Lacoste's fields, a second row behind at Villere; they rest all day (fires at dusk)
const RX = 1280.4, RX2 = 1285.6;
// broadside: the front row goes to ground behind the levee road (shifts toward the river and back a little), then turns to meet the attack
// forward moves only (owner: blocks walk long side first; no backing): in the melee each side pushes THROUGH the other's lanes, so the
// colours end up mixed in small groups; before dawn the Americans leave by the river road (escape = about-face, column, walk off west)
const rFront = RL.map((y, i) => {
  const xm = [1278.4, 1278.8, 1278.2][i], xm2 = [1276.6, 1277.2, 1276.9][i];
  return u("r", 1, [[0, RX, y], [T.dark + 0.4, RX, y], [T.hundred + 0.4, xm, y], [T.muskets, xm, y], [T.cane + 0.6, xm2, y], [T.D, xm2, y]], W, { t1: 107.6 }); });
const rBack = [3236.9, 3234.3].map((y, i) => u("r", 1, [[0, RX2, y], [T.hundred, RX2, y], [T.muskets + 1.0, RX2 - 2.0 - i * 0.6, y], [T.D, RX2 - 2.0 - i * 0.6, y]], W, { t1: 107.6 }));
// the Americans (regulars, Marines, Plauche's + Daquin's battalions) come down the river road from the city at dusk, deploy at Bienvenu's,
// attack east at "Then Jackson attacked"; melee; pull back west before dawn (escape up the river road)
const ESC = (t0, from = 0) => ({ road: ROAD, t0, v: 1.0, v2: 1.0, join: "west", from });
const bLine = BL.map((y, i) => {
  const xm = [1277.0, 1276.6, 1277.2][i], xm2 = [1279.0, 1278.4, 1279.3][i];
  return u("u", 1, [[0, 1258.6, y], [T.road, 1258.6, y], [T.camp + 0.6, 1266.2, y], [T.then, 1266.2, y], [T.side - 0.2, 1274.6, y],
    [T.dark + 0.4, 1274.6, y], [T.hundred + 0.4, xm, y], [T.muskets, xm, y], [T.cane + 0.6, xm2, y], [T.D, xm2, y]], E,
    { t0: T.marched - 0.2, t1: 107.6, escape: ESC(T.pulled - 0.6 + i * 0.5) }); });
// Coffee's Tennesseans: out of the swamp edge from the north-west, along the wood toward the British right, then into their flank
const cLine = CL.map((y, i) => u("u", 1, [[0, 1265.0 - i * 0.4, y], [T.coffee - 0.4, 1265.0 - i * 0.4, y], [T.struck + 0.3, 1278.6 + i * 1.4, y],
  [T.dark + 0.4, 1278.6 + i * 1.4, y], [T.friend + 0.6, 1281.4 + i * 1.2, y], [T.D, 1281.4 + i * 1.2, y]],
  E, { t0: T.coffee - 0.7, t1: 107.6, escape: ESC(T.pulled + 1.0 + i * 0.5) }));
// Christmas: Pakenham's reinforcements file out of the swamp onto Villere's (walk south, broadside, long side first)
const reinf = [[1283.2, 3233.6], [1286.0, 3234.8], [1288.8, 3233.4], [1291.4, 3234.6], [1284.4, 3236.8], [1290.2, 3237.0]].map(([x, y], i) =>
  u("r", i < 4 ? 2 : 1, [[T.christmas - 0.4 + i * 1.6, x, 3229.6], [T.christmas + 5.4 + i * 1.6, x, y], [T.D, x, y]], S_, { t0: T.christmas - 0.5 + i * 1.6 }));
// Christmas morning: the advance guard still in its camp (the same ground, by day)
const rDay = [[1280.4, 3237.35], [1280.4, 3235.45], [1280.6, 3233.55]].map(([x, y]) => u("r", 1, [[0, x, y]], W, { t0: 129.6 }));

// the wide map (neworleans): the British advance guard at Villere as one army marker (troopScale 3), Jackson's men at the city
const NOU = [];
NOU.push({ side: "r", type: "inf", n: 2, region: NO, keys: [[0, VIL[0] - 2.4, VIL[1] - 1.6]], face: W, arrive: false });
NOU.push({ side: "u", type: "inf", n: 2, region: NO, keys: [[0, CITY[0] + 4.0, CITY[1] + 2.4], [T.listen, CITY[0] + 4.0, CITY[1] + 2.4], [SW - 0.6, CITY[0] + 9.0, CITY[1] + 4.6]], face: E, arrive: false, t0: T.militia });
NOU.push({ side: "u", type: "inf", n: 2, region: NO, keys: [[0, MAC[0] - 3.6, MAC[1] - 1.4], [T.D, MAC[0] - 3.6, MAC[1] - 1.4]], face: E, arrive: false, t0: 107.6 });   // at the Rodriguez line (24 Dec)
units.push(...NOU);

// ---------------- boats: the Carolina drifts down and anchors; British boats on Villere's canal (more landing every hour) ----------------
const CPATH = [[1257.6, 3237.0], [1262.0, 3239.0], [1266.0, 3240.4], [1271.8, 3241.3], [1278.0, 3241.6], [CAR[0], CAR[1]]];
const CL_ = VX.len(CPATH), C0 = 47.0, C1 = T.anchored + 0.2;
const carS = (t) => { const k = Math.min(1, Math.max(0, (t - C0) / (C1 - C0))); return CL_ * (1 - Math.pow(1 - k, 2)); };   // slows to a stop at her anchorage
const carAt = (t) => { const p = VX.along(CPATH, carS(t)); return [p[0], p[1], 0.5]; };
const boats = [
  { region: CH, kind: "ship", n: 1, path: CPATH, sAt: (t) => carS(t), t0: C0, t1: 108, size: 0.32, lamp: false, wake: true },
  // barges up the Villere canal on the wide map during the decision card ("more of them are landing every hour")
  { region: NO, kind: "barge", n: 4, path: [[CANAL[0] + 0.6, CANAL[1] - 6], [CANAL[0], CANAL[1]], [1287.4, 3228.5]], s0: 0, speed: 1.1, spacing: 3.2,
    t0: T.enemy, t1: SW, size: 0.9, lamp: false, wake: false },
];

// ---------------- fx ----------------
const VOL = (pts, t0, t1, dir, o = {}) => ({ region: CH, pts, t0, t1, opts: { dir, size: 0.8, alpha: 0.09, life: 10, muzzle: 5, windK: 0.9, rate: 3.0, volley: 1.5, roll: 0.5, height: 2.0, ...o } });
const lane = (x, y, w = 0.4) => [[x, y - w], [x, y + w]];
const volleys = [];
// the attack: Jackson's line fires as it closes, the British front answers (night), Coffee's men fire into the flank
BL.forEach((y, i) => volleys.push(VOL(lane(1273.9, y), T.attacked + 2.6 + i * 0.37, T.side + 0.8, [1, 0])));
RL.forEach((y, i) => volleys.push(VOL(lane(RX - 0.4, y), T.regulars2 + 1.3 + i * 0.41, T.side + 0.9, [-1, 0])));
CL.forEach((y, i) => volleys.push(VOL([[1277.0 + i * 1.4, y - 0.35], [1278.2 + i * 1.4, y + 0.35]], T.struck + 0.1 + i * 0.3, T.side + 1.0, [0.5, 1])));
// the melee: short ragged volleys all over the field, both colours (each one a visible burst of flashes = one sound event)
const MF = [[1277.6, 3238.0, 1], [1278.4, 3236.9, -1], [1277.1, 3235.9, 1], [1278.9, 3234.9, -1], [1277.8, 3234.1, 1], [1279.6, 3233.2, -1], [1281.4, 3232.4, 1],
  [1278.2, 3237.4, -1], [1276.9, 3236.6, 1], [1279.3, 3235.4, -1], [1282.6, 3231.8, 1], [1278.6, 3233.8, -1]];
MF.forEach(([x, y, s], i) => { const t0 = T.dark + 0.8 + (i * 1.03) % 11.4; volleys.push(VOL([[x - 0.15 * s, y - 0.3], [x + 0.15 * s, y + 0.3]], t0, t0 + 3.2, [s, 0], { volley: 1.05 + (i % 3) * 0.2, roll: 0.25, rate: 2.2 })); });
const smokeLines = [];
// the Carolina's broadside: her guns from the river into the camp, each shot a flash + plume + an impact among the fires
const carShots = [T.opened, T.fire + 0.35, T.campfires - 0.1, 66.95, 67.6, 68.35, 69.1, 69.9].map((t, i) => {
  const at = [CAR[0] - 0.3 + (i % 3) * 0.3, CAR[1] - 0.15];
  const imp = [[1283.6, 3236.4], [1280.8, 3238.2], [1285.4, 3234.6], [1281.9, 3236.0], [1286.6, 3237.3], [1279.6, 3236.6], [1284.8, 3237.9], [1282.6, 3234.2]][i];
  return { t, at, dir: [imp[0] - at[0], imp[1] - at[1]], impact: imp, delay: 0.45 }; });
const guns = [{ region: CH, h: 0.55, opts: { plume: 0.5, puffs: 8, alpha: 0.2, jet: 1.4 }, shots: carShots }];
// campfires along the British lines, lit at dusk, out under the broadside
const campfires = [
  { region: CH, pts: [[1281.8, 3237.9], [1282.4, 3236.1], [1281.6, 3234.3], [1283.6, 3238.6], [1284.4, 3235.4], [1286.9, 3238.0], [1287.4, 3235.6], [1286.6, 3233.3], [1283.0, 3232.8], [1289.6, 3236.6]],
    t0: T.fires, t1: T.out - 0.3, opts: { glowSize: 3.4 } },
  { region: NO, pts: [[VIL[0] - 2.0, VIL[1] - 0.6], [VIL[0] - 4.0, VIL[1] - 2.6], [VIL[0] + 0.8, VIL[1] - 2.0]], t0: T.tonight, t1: SW, opts: { glowSize: 4 } },
];
const fx = { smokeLines, volleys, guns, campfires };

// ---------------- arrows ----------------
const arrows = [
  // "bring up the rest of the army": the boats' route up Villere's canal (wide map)
  { side: "r", region: NO, pts: [[CANAL[0] + 4, CANAL[1] - 14], [CANAL[0] + 0.6, CANAL[1] - 4], [1287.2, 3226.0], [VIL[0] - 1.0, VIL[1] - 3.6]], t0: T.rest - 0.3, dur: 1.8, t1: T.guard - 0.4, width: 0.16 },
  // the attack: down the river road, and Coffee's swing by the swamp edge
  { side: "u", region: CH, pts: [[1266.8, 3237.4], [1270.6, 3237.3], [1273.8, 3237.1]], t0: T.attacked + 0.1, dur: 1.6, t1: T.dark - 0.3, width: 0.2 },
  { side: "u", region: CH, pts: [[1266.0, 3231.6], [1271.0, 3230.9], [1275.6, 3231.2], [1278.4, 3232.6]], t0: T.swung, dur: 2.0, t1: T.dark - 0.3, width: 0.2 },
  // before dawn: back two miles to the Rodriguez Canal
  { side: "u", region: CH, pts: [[1272.4, 3236.0], [1266.0, 3234.6], [1259.0, 3232.0], [1255.4, 3229.8]], t0: T.pulled, dur: 2.2, t1: T.stung - 0.2, width: 0.2 },
];

// ---------------- generals ----------------
const US15 = "seq/us15_flag.png", GB = "seq/gb1801_union_flag.png";
const generals = {
  jackson: { img: "seq/jackson.png", flag: US15, side: "us", name: "Jackson", full: "Andrew Jackson", role: "Major General" },
  coffee: { img: "seq/coffee.png", flag: US15, side: "us", name: "Coffee", full: "John Coffee", role: "Brigadier General" },
  pakenham: { img: "seq/pakenham.png", flag: GB, side: "cs", name: "Pakenham", full: "Sir Edward Pakenham", role: "Major General" },
};
const banners = [
  { general: "jackson", region: NO, keys: [[0, CITY[0] + 1.2, CITY[1] - 2.4]], t0: T.jackson - 0.05, t1: T.stop - 0.2 },
  { general: "jackson", region: CH, keys: [[0, 1262.6, 3235.8], [T.side, 1268.4, 3235.9], [T.pulled, 1268.4, 3235.9], [T.canal + 3, 1262.0, 3234.4]], t0: T.then + 0.1, t1: T.coffee - 0.3 },
  { general: "coffee", region: CH, keys: [[0, 1264.0, 3230.6], [T.struck, 1274.6, 3230.6]], t0: T.coffee, t1: T.dark + 2.0 },
  { general: "jackson", region: NO, keys: [[0, MAC[0] - 4.4, MAC[1] - 4.2]], t0: 107.8, t1: 129.5 },
  { general: "pakenham", region: CH, keys: [[0, 1290.0, 3231.8]], t0: T.pakenham - 0.05, t1: T.D + 1 },
];

// ---------------- labels (each on its word) ----------------
const labels = [
  { text: "New Orleans", at: [CITY[0], CITY[1] - 3.0], region: NO, size: 20, t0: T.city - 0.1, t1: T.guard + 0.2 },
  { text: "Villere plantation", at: [VIL[0] + 1.0, VIL[1] - 6.0], region: NO, size: 16, t0: 1.2, t1: 4.6 },
  { text: "Mississippi River", at: [1266.8, 3244.6], region: CH, size: 15, river: true, t0: 7.6, t1: 11.0 },
  { text: "New Orleans", at: [CITY[0], CITY[1] - 3.0], region: NO, size: 18, t0: T.incity - 0.1, t1: 18.4 },
  { text: "river road", at: [1262.6, 3236.9], region: CH, size: 14, river: true, t0: T.road - 0.2, t1: T.road + 3.2 },
  { text: "Rodriguez Canal", at: [REL[0] + 2.6, REL[1] + 2.6], region: CH, size: 16, t0: T.rodriguez - 0.05, t1: T.D },
  { text: "New Orleans", at: [CITY[0], CITY[1] - 3.0], region: NO, size: 18, t0: 108.4, t1: 112.6 },
];

window.SEQ = {
  name: "S05", D: T.D, T, seed: 1815, date: "1814-12-23",
  regions: [NO, CH],
  regionOpts: { [NO]: { troopScale: 3.2 } },
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  keys: [
    // 1. wide: the British at Villere, nine miles below the city
    { t: 0, region: NO, at: [1251, 3229.5], dist: 112, tilt: 46, yaw: 6, fov: 30 },
    { t: 6.2, region: NO, at: [1259, 3231.0], dist: 98, tilt: 48, yaw: 9, fov: 30, ease: "lin" },
    // 2. close: Keane's camp in the fields, low, looking upriver; fires at dusk
    { t: 6.25, region: CH, at: [1283.4, 3235.8], dist: 20, tilt: 54, yaw: 66, fov: 30, ease: "cut", dissolve: 0.9 },
    { t: 14.6, region: CH, at: [1282.6, 3235.6], dist: 16.5, tilt: 57, yaw: 76, fov: 30, night: 0.3, ease: "lin" },
    // 3. wide: the city, Jackson; the quote; the decision card while the light goes
    { t: 14.65, region: NO, at: [1214, 3218.5], dist: 72, tilt: 50, yaw: 4, fov: 30, night: 0.1, ease: "cut", dissolve: 0.9 },
    { t: 25.4, region: NO, at: [1222, 3221.0], dist: 80, tilt: 50, yaw: 6, fov: 30, night: 0.15, ease: "lin" },
    { t: 41.0, region: NO, at: [1248, 3227.0], dist: 104, tilt: 47, yaw: 8, fov: 30, night: 0.3, ease: "io" },
    { t: 44.2, region: NO, at: [1258, 3229.5], dist: 112, tilt: 46, yaw: 8, fov: 30, night: 0.35, ease: "io" },
    // (dive keys inserted by the engine from push 45.5 to land 52.65)
    // 4. night: down the river (the Carolina), along the camp
    { t: 57.0, region: CH, at: [1272.6, 3239.6], dist: 21, tilt: 58, yaw: -74, fov: 30, night: NI, ease: "io" },
    { t: 62.4, region: CH, at: [1281.4, 3238.6], dist: 17, tilt: 56, yaw: -62, fov: 30, night: NI, ease: "io" },
    { t: 71.9, region: CH, at: [1282.0, 3238.0], dist: 15.5, tilt: 57, yaw: -54, fov: 30, night: NI, ease: "lin" },
    // 5. the attack: wider, from the north-west, both prongs in frame
    { t: 75.6, region: CH, at: [1273.8, 3235.4], dist: 22, tilt: 54, yaw: -12, fov: 30, night: NI, ease: "io" },
    { t: 83.2, region: CH, at: [1275.8, 3235.2], dist: 21, tilt: 55, yaw: -16, fov: 30, night: NI, ease: "lin" },
    // 6. the melee, the camera low
    { t: 85.2, region: CH, at: [1278.4, 3235.4], dist: 14, tilt: 60, yaw: -32, fov: 30, night: NI, ease: "io" },
    { t: 96.6, region: CH, at: [1278.8, 3235.3], dist: 13, tilt: 62, yaw: -50, fov: 30, night: NI, ease: "lin" },
    // 7. grey dawn: pull up and back west along the strip to the Rodriguez Canal
    { t: 101.6, region: CH, at: [1274.0, 3234.8], dist: 22, tilt: 56, yaw: -24, fov: 30, night: 0.5, ease: "io" },
    { t: 107.75, region: CH, at: [1266.0, 3233.0], dist: 30, tilt: 54, yaw: -10, fov: 30, night: 0.32, ease: "io" },
    // 8. wide: the British halted, nine miles out; the method card
    { t: 107.8, region: NO, at: [1252, 3229.0], dist: 104, tilt: 47, yaw: 6, fov: 30, ease: "cut", dissolve: 0.9 },
    { t: 129.5, region: NO, at: [1262, 3231.0], dist: 92, tilt: 49, yaw: 10, fov: 30, ease: "lin" },
    // 9. Christmas: reinforcements out of the swamp onto Villere's; Pakenham
    { t: 129.55, region: CH, at: [1286.8, 3234.8], dist: 22, tilt: 54, yaw: -12, fov: 30, ease: "cut", dissolve: 0.9 },
    { t: 140.0, region: CH, at: [1286.4, 3235.0], dist: 21, tilt: 55, yaw: -6, fov: 30, ease: "lin" },
    { t: T.D, region: CH, at: [1285.4, 3235.4], dist: 27, tilt: 53, yaw: 2, fov: 30, ease: "io" },
  ],
  dives: [{ t: SW, over: [1276, 3237], from: { region: NO, at: [1258, 3229.5], dist: 112, tilt: 46, yaw: 8, night: 0.35 },
            to: { region: CH, at: [1267.0, 3238.8], dist: 23, tilt: 58, yaw: -78, fov: 30, night: NI } }],
  clouds: { [NO]: { scatter: { seed: 5 }, keepClear: [[1214, 3219, 22, 1, 0], [1270, 3233, 30, 1, 0]] }, [CH]: { shadows: false } },
  units, arrows, banners, boats, fx, generals,
  // Jackson's line did not exist before 24 Dec: the rampart starts to rise at dawn (digging from 4 a.m.); the redoubt, the 1 Jan British
  // batteries and the west-bank works stay hidden in this scene
  build: (c) => { const R = c.world.regions[CH], W = R.works || [], ys = R.ys || 1, info = (VX.region(CH).features || {}).works || [];
    const sink = W.map((m, i) => ((info[i] || {}).height_m || 1.5) * ys * 1.6 + 0.08);
    c.FX[CH].custom((t) => { W.forEach((m, i) => { const k = i === 0 ? 0.45 * c.sstep(T.pulled, 112, t) + 0.2 * c.sstep(129, 131, t) : 0; m.visible = k > 0.01; m.position.y = -(1 - k) * sink[i]; }); }); },
  labels,
  overlay: [
    ["plaque.date", 0.4, { month: "December 1814", day: "23", weekday: "Friday", note: "Villere plantation" }],
    ["distance", T.march + 0.1, T.guard - 0.3, { from: [VIL[0] - 2.0, VIL[1] - 2.0], to: [CITY[0] + 2.0, CITY[1]], value: 9, unit: "MILES", sub: "to the city", dash: false }],
    ["label", T.seventeen, T.boats + 0.4, { name: "About 1,700 men", sub: "the British advance guard", world: [1283.0, 3232.4], side: "uk", marker: false }],
    ["plaque.note", T.incity + 0.2, "news reaches the city"],
    ["plaque.note", T.afternoon - 0.1, "early afternoon"],
    ["quote", T.gentlemen - 0.15, T.tonight + 0.7, { en: "Gentlemen, the British are below. We must fight them tonight.", attr: "Andrew Jackson · as later told", y: 680, dim: 0.45 }],
    ["engage.decide", { t: T.stop - 0.1, sub: "23 DECEMBER 1814 · YOU ARE JACKSON", a: "DIG IN AND\nWAIT FOR THEM", b: "ATTACK\nTONIGHT", real: "b", tA: T.dig - 0.05, tB: T.attack - 0.05,
      tNote: T.tell - 0.05, tCount: T.comments, tReveal: T.notwait + 0.05, until: SW + 0.2, dim: 0.55 }],
    ["plaque.note", SW + 1.0, "evening · no moon"],
    ["label", T.carolina - 0.05, T.anchored + 0.6, { name: "Carolina", sub: "US Navy schooner", world: (t) => { const p = carAt(t); return [p[0], p[1], 0.8]; }, side: "us", marker: false }],
    ["plaque.clock", T.halfpast - 0.05, { time: "19:30", note: "the Carolina opens fire", header: "23 December 1814" }],
    ["plaque.note", T.then + 0.2, "Jackson attacks"],
    ["plaque.date", T.dawn - 0.2, { month: "December 1814", day: "24", weekday: "Saturday", note: "before dawn" }],
    ["ledger.show", T.each - 0.1, { title: "The night battle", sub: "23 December 1814 · losses" }],
    ["ledger.add", T.lost + 0.2, { who: "British: 277", note: "killed, wounded or missing", stamp: false }],
    ["ledger.add", T.lost + 0.9, { who: "Americans: 213", note: "killed, wounded or missing", stamp: false }],
    ["ledger.hide", T.dawn + 0.6],
    ["label", T.stung, T.night + 0.8, { name: "Stung", sub: "attacked in their own camp, at night", world: [VIL[0] - 2.6, VIL[1] - 5.0], side: "uk", marker: false }],
    (O, c) => stamp(O, c, "HALTED", T.wait2 - 0.1, T.time + 0.6, [VIL[0] - 9.0, VIL[1] - 3.4]),
    ["label", T.time - 0.1, 123.0, { name: "Time", sub: "to dig in at the Rodriguez Canal", world: [MAC[0] - 2.0, MAC[1] - 6.0], side: "us", marker: false }],
    // method card: the same letter card as S03 (move 1), line 1 typed fast, line 2 typed on "hit him first"
    ["letter", 123.1, 129.35, { header: "Move 2 · The night attack", title: "The Old Hickory Method", sub: "", marks: false, quote: "1. Close every door\n2. Strike first", qSize: 34, height: 270,
      cps: 20, qAt: T.hit - 0.05 - 20 / 20, lag: 0.05, stagger: 0.06, partDur: 0.35 }],
    () => { const q = [...document.querySelectorAll("#ov .letter .q")].pop(); if (q) q.style.whiteSpace = "pre-line"; },   // keep the \n (two method lines)
    ["plaque.date", T.christmas - 0.05, { month: "December 1814", day: "25", weekday: "Sunday", note: "Christmas Day" }],
    ["medallion", { kind: "card", general: "pakenham", sub: "Wellington's brother-in-law", world: [1290.0, 3231.8], offset: [-380, -20], tIn: T.wellington, tOut: T.january - 0.3 }],
    ["plaque.date", T.january - 0.1, { month: "1815", day: "Jan", weekday: "early January", note: "fresh regiments land" }],
    ["number", T.eight, T.D - 0.4, { value: 8000, round: 1000, world: [1281.4, 3233.0], size: 100 }],
  ],
};

const PINS = [];
window.SEQ.draw = (t, c) => { if (!PINS.length) return; const sc = 1920 / c.world.renderer.domElement.width * (c.world.renderer.getPixelRatio ? c.world.renderer.getPixelRatio() : 1);
  for (const p of PINS) { const s = c.world.projectMap(p.world[0], p.world[1], 0); p.el.style.transform = `translate(${(s.x * sc).toFixed(1)}px,${(s.y * sc).toFixed(1)}px)`; } };
// ---------------- custom overlay: a red ink stamp pinned to the ground; the method card (2. STRIKE FIRST) ----------------
function stamp(O, c, text, t0, t1, world) {   // pinned to the ground (positioned in SEQ.draw); slams in like the ledger stamps
  const host = document.querySelector("#ov .gmo") || document.getElementById("ov"), el = document.createElement("div");
  el.style.cssText = "position:absolute;left:0;top:0;z-index:40;pointer-events:none;width:0;height:0";
  el.innerHTML = `<span class="stamp" style="position:absolute;left:0;top:0;transform:translate(-50%,-50%);color:#A8261B;font-size:46px;padding:6px 20px 4px;border-width:4px;white-space:nowrap">${text}</span>`;
  host.appendChild(el); const st = el.firstChild, G = window.gsap; G.set(el, { autoAlpha: 0 });
  c.tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, t0);
  c.tl.fromTo(st, { scale: 2.3, rotation: -14, opacity: 0 }, { scale: 1, rotation: -6, opacity: 0.94, duration: 0.24, ease: "power4.in", immediateRender: false }, t0);
  c.tl.to(el, { autoAlpha: 0, duration: 0.5 }, t1);
  PINS.push({ el, world });
}
})();
