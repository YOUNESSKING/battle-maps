// S05 Port Gibson (1 May 1863, DAY 2). Region portgibson only. Camera looks EAST along the two ridge roads (yaw ~ -80: north = screen left).
// Night approach on the Bruinsburg road -> pickets at the Shaifer house -> Bowen's division astride both roads (Bowen card) -> dawn ->
// the two ridges + ravines read -> Union divisions press along both ridges in steps, Confederate counterattack, held again ->
// Logan's brigade (J. E. Smith) turns the north flank -> red falls back through Port Gibson, both bridges over the South Fork burn ->
// ledger 131 / 719 / 25, the road inland opens.
// Facts: research/FACT_NOTES.md section 4 (Hovey, Carr, A. J. Smith on the Rodney road; Osterhaus on the Bruinsburg road;
// Green at Magnolia Church, Tracy on the Bruinsburg road, Baldwin + Cockrell later; Logan's brigade crossed a ravine to a third ridge about noon).
(() => {
const T = { D: 65.30, midnight: 2.96, pickets: 7.62, bowen: 11.22, grandGulf: 12.58, seven: 15.18, twice: 18.58, ground: 20.76, roads: 23.52,
  ridges: 25.28, town: 26.32, ravines: 28.16, ridgeTops: 33.94, allDay: 35.48, held: 39.74, counter: 40.76, heldAgain: 41.9, late: 43.3,
  pressed: 44.82, fell: 47.28, pg: 48.16, burned: 49.14, grantLost: 52.52, eight: 53.4, seventy: 54.4, open: 55.88, question: 58.62, campaign: 62.74 };
const PG = "portgibson", D = T.D;
const NR = VX.road(PG, "Bruinsburg (north) road: Shaifer house - ridge - Port Gibson");
const RR = VX.road(PG, "Rodney Road: Shaifer house - Magnolia Church - Port Gibson");
const BR = VX.road(PG, "Bruinsburg - bluffs - Shaifer house (Bruinsburg road)");
const NE_RD = VX.road(PG, "Port Gibson - Grindstone Ford - Willow Springs - Rocky Springs - Utica - Raymond");
const GM6 = VX.road(PG, "gm6");
const SH = VX.town("Shaifer house", PG), TOWN = VX.town("Port Gibson", PG), MAG = [1292.3, 1019.0];
// y of a road at map x (roads run west -> east here)
const yAt = (road, x) => { for (let i = 1; i < road.length; i++) { const a = road[i - 1], b = road[i]; if ((a[0] - x) * (b[0] - x) <= 0 && a[0] !== b[0]) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return road[road.length - 1][1]; };
const onN = (x, dy = 0) => [x, yAt(NR, x) + dy], onR = (x, dy = 0) => [x, yAt(RR, x) + dy];
const E = VX.FACE.east, Wf = VX.FACE.west;

// ---------------- escape roads ----------------
// south group: the Rodney road into town, then the Grindstone Ford road north-east over the South Fork bridge (bridge 0)
const ESC_S = [...RR.filter((p) => p[0] > 1293), TOWN, ...NE_RD.slice(1)];
// north group: the Bruinsburg road into town, then gm6 north over the Little Bayou Pierre bridge (bridge 2) toward Grand Gulf
const gm6Rev = VX.reverse(GM6);
// owner 2026-11-18: gm6 hugs (and crosses) Little Bayou Pierre with no bridge: the north group now follows the south group over the South Fork bridge
const ESC_N = [...NR.filter((p) => p[0] > 1290), TOWN, ...NE_RD.slice(1)];

// ---------------- units ----------------
const units = [];
// night: the Union column on the Bruinsburg road (single boxes nose to tail), the head reaches the Shaifer house about midnight
const colPath = [...BR, SH];
for (let i = 0; i < 6; i++) {
  const K = VX.march(colPath, -6 + i * 0.75, 2.4, { to: VX.len(colPath) - 1.2 - i * 1.15 });
  units.push({ side: "u", type: "inf", n: 1, keys: K, face: VX.faceTo(BR[BR.length - 3], SH), t0: 0, t1: 19.9 });
}
// Confederate pickets near the farmhouse: they fire, then fall back to the line
units.push({ side: "r", type: "inf", n: 1, face: Wf, keys: [[0, SH[0] + 3.4, SH[1] + 1.0], [9.2, SH[0] + 3.4, SH[1] + 1.0], [14.5, 1286.5, 1015.4]], t0: 0, t1: 15.2 });

// Union divisions (deployed by dawn) as COLUMNS ON THE RIDGE TOPS (critic B: "only along the ridge tops"): each road carries its
// divisions two boxes wide, one behind the other; the ravines between the roads stay empty.
// Rodney road (south ridge): Hovey leads, Carr behind him, A. J. Smith in support; Bruinsburg road (north ridge): Osterhaus.
const uCol = (xs, lag, road, o = {}) => ({ side: "u", type: "inf", n: 2, face: E, t0: 17.6, ...o,
  keys: xs.map(([t, x]) => { const p = road === "R" ? onR(x - lag) : onN(x - lag); return [t, p[0], p[1]]; }) });
// front of the Rodney road column: steps forward, recoils on the counterattack, forward again, then the pursuit into town
const RX = [[0, 1266], [19.6, 1273.5], [36.0, 1273.5], [37.6, 1277.5], [38.6, 1277.5], [40.0, 1280.5], [40.8, 1280.5], [42.0, 1278.6], [44.6, 1278.6], [46.6, 1282.5], [48.6, 1286.0], [53.5, 1293.0], [D, 1296.5]];
[0, 1.75, 3.5, 5.25, 7.0, 8.75].forEach((lag, k) => units.push(uCol(RX.map(([t, x]) => [t + k * 0.08, x]), lag, "R", { t0: 17.6 + k * 0.15 })));   // Hovey (2 rows), Carr (2), A. J. Smith (2)
// front of the Bruinsburg road column (Osterhaus): held up until the flank is turned
const NX = [[0, 1266.5], [19.6, 1273.0], [36.2, 1273.0], [38.0, 1276.5], [39.6, 1277.6], [40.8, 1277.6], [41.9, 1275.8], [45.4, 1275.8], [47.4, 1279.5], [49.4, 1283.5], [54.0, 1291.0], [D, 1294.5]];
[0, 1.75, 3.5].forEach((lag, k) => units.push(uCol(NX.map(([t, x]) => [t + k * 0.08, x]), lag, "N", { t0: 17.8 + k * 0.15 })));
// Logan's brigade (J. E. Smith): along a third ridge north of the road, turns Tracy's flank (red has already gone when it arrives)
units.push({ side: "u", type: "inf", n: 2, face: E, t0: T.pressed - 0.4, keys: [[T.pressed - 0.4, 1278.6, 1005.4], [47.0, 1282.6, 1005.8], [49.5, 1286.8, 1007.0], [D, 1292.5, 1008.0]] });
// Union guns (behind the heads of the columns, on the ridge)
units.push({ side: "u", type: "art", n: 1, face: E, t0: 18.6, keys: [[0, ...onR(1271.0)], [47.5, ...onR(1271.0)], [52.0, ...onR(1280.0)]] });
units.push({ side: "u", type: "art", n: 1, face: E, t0: 18.6, keys: [[0, ...onN(1270.6)], [48.0, ...onN(1270.6)], [52.5, ...onN(1279.0)]] });

// Bowen's division (red): Green astride the Rodney road at Magnolia Church, Tracy astride the Bruinsburg road, Baldwin + Cockrell come up behind
const T_OUT = 46.2, rLine = (n, at, o = {}) => ({ side: "r", type: "inf", n, face: Wf, t0: 9.6, keys: [[0, ...at]], ...o });
const greenAt = onR(1289.6), tracyAt = onN(1284.6);
units.push(rLine(3, greenAt, { keys: [[0, ...greenAt], [44.2, ...greenAt], [T_OUT - 0.2, greenAt[0] + 2.2, greenAt[1]]],
  escape: { road: ESC_S, t0: T_OUT, v: 4.2, v2: 4.2, join: "east", fade: false } }));                                  // Green
units.push({ side: "r", type: "art", n: 1, face: Wf, t0: 9.6, keys: [[0, ...onR(1292.0)]], escape: { road: ESC_S, t0: T_OUT - 0.4, v: 4.2, v2: 4.2, join: "east", fade: false } });
units.push(rLine(3, tracyAt, { keys: [[0, ...tracyAt], [40.6, ...tracyAt], [41.8, tracyAt[0] - 1.6, tracyAt[1]], [44.6, tracyAt[0] - 1.6, tracyAt[1]], [T_OUT - 0.2, tracyAt[0] + 2.2, tracyAt[1]]],
  escape: { road: ESC_N, t0: T_OUT, v: 4.2, v2: 4.2, join: "east", fade: false } }));                                   // Tracy
units.push({ side: "r", type: "art", n: 1, face: Wf, t0: 9.6, keys: [[0, ...onN(1287.4)]], escape: { road: ESC_N, t0: T_OUT - 0.4, v: 4.2, v2: 4.2, join: "east", fade: false } });
// Cockrell: comes up from town and counterattacks on the south shoulder of the Rodney ridge, then falls back
units.push({ side: "r", type: "inf", n: 2, face: Wf, t0: 36.4, keys: [[36.4, ...onR(1298.0, 2.4)], [39.4, ...onR(1292.6, 2.6)], [40.8, ...onR(1291.2, 2.6)], [42.0, ...onR(1285.6, 2.6)], [43.6, ...onR(1286.4, 2.6)], [T_OUT - 0.4, ...onR(1292.0, 2.2)]],
  escape: { road: ESC_S, t0: T_OUT + 0.5, v: 4.2, v2: 4.2, join: "east", fade: false } });
// Baldwin: second line behind Tracy, steps into the gap
units.push({ side: "r", type: "inf", n: 2, face: Wf, t0: 36.0, keys: [[36.0, ...onN(1295.0)], [39.0, ...onN(1289.6)], [44.0, ...onN(1289.6)], [T_OUT - 0.3, ...onN(1291.6)]],
  escape: { road: ESC_N, t0: T_OUT + 0.4, v: 4.2, v2: 4.2, join: "east", fade: false } });
units.forEach((u) => { if (u.side === "r" && u.escape) u.t1 = 60.5; });

// ---------------- arrows ----------------
const arrows = [
  // Bowen rushed down from Grand Gulf (north): his division comes down the road into the town and out onto the ridges
  { side: "r", pts: [[1294.6, 998.7], [1299.8, 1005.6], [1303.0, 1010.6], [1300.0, 1014.6], [1294.0, 1016.6]], t0: T.grandGulf, dur: 2.0, t1: 17.4 },
  // only along the ridge tops
  { side: "u", pts: VX.sub(NR, 6.0, 18.5), t0: 31.7, dur: 2.0, t1: 36.6 },
  { side: "u", pts: VX.sub(RR, 6.5, 19.0), t0: 32.3, dur: 2.0, t1: 36.6 },
  // the counterattack
  { side: "r", pts: [[1293.2, 1022.6], [1289.6, 1022.4], [1286.0, 1021.8]], t0: T.counter, dur: 1.2, t1: 43.4 },
  { side: "r", pts: [[1287.0, 1009.0], [1283.6, 1009.2], [1280.4, 1009.6]], t0: T.counter + 0.3, dur: 1.2, t1: 43.4 },
  // pressed on both ridges: Logan's brigade on the third ridge
  { side: "u", pts: [[1280.0, 1004.4], [1284.0, 1004.4], [1287.6, 1005.4], [1290.0, 1007.0]], t0: T.pressed, dur: 2.0, t1: 49.6 },
  // the road inland is open
  // owner rule: no arrow over a burning bridge -> it ends on the town's bank of the bayou, short of the burnt South Fork bridge
  { side: "u", pts: [[1293.0, 1018.4], [1297.5, 1018.9], [1301.5, 1019.4], [1305.0, 1019.6], [1307.0, 1018.9], [1307.8, 1018.1]], t0: T.open + 0.1, dur: 2.0, t1: D + 1 },
];

// ---------------- fx ----------------
const BRG0 = VX.bridge(PG, 0), BRG2 = VX.bridge(PG, 2);
// round 3 (critic A N-smoke): battalion CURTAINS (v7/v8 gmTall look from the engine: grey, alpha ~0.26, thinning 6 s after the last volley),
// each one seated ~1 unit IN FRONT of its line (never on the boxes), two battalion clusters per brigade front, moving with the halts.
const SMK = { size: 1.25, alpha: 0.26, life: 12, muzzle: 3, windK: 0.45, rate: 5.0, cluster: [1.3, 0.7], fadeAfter: 6, fadeTo: 0.12 };
const cur = (road, x, t0, t1, dir, o = {}) => { const on = road === "R" ? onR : onN, a = o.dy0 ?? -1.8, b = o.dy1 ?? 1.8;
  return { region: PG, pts: [on(x, a), on(x, (a + b) / 2), on(x, b)], t0, t1, cue: true, every: o.every || 1.8, opts: { ...SMK, dir, volley: o.every || 1.8, roll: 0.7 } }; };
const fx = {
  fires: [
    { region: PG, bridge: 2, t0: T.burned + 0.1, t1: D + 1, preset: "bridge", waterGlow: { t1: D + 1 } },   // the Grand Gulf road bridge (nobody uses it): fired on "burned"
    { region: PG, bridge: 0, t0: 53.4, t1: D + 1, preset: "bridge", waterGlow: { t1: D + 1 } },   // the South Fork bridge: fired after the last column is over (owner 2026-11-18: nobody crosses a burning bridge)
  ],
  volleys: [
    // first shots at night near the Shaifer house (pickets: small)
    { region: PG, pts: [[SH[0] + 2.6, SH[1] + 0.3], [SH[0] + 2.8, SH[1] + 1.8]], t0: 7.7, t1: 9.4, every: 0.9, opts: { ...SMK, cluster: null, size: 0.9, dir: [-1, 0], rate: 4, volley: 0.9 } },
    { region: PG, pts: [[SH[0] + 0.4, SH[1] - 0.6], [SH[0] + 0.5, SH[1] + 0.8]], t0: 8.2, t1: 9.4, every: 1.2, opts: { ...SMK, cluster: null, size: 0.9, dir: [1, 0], rate: 3, volley: 1.2 } },
    // the day battle: Union fronts (one curtain per halt, ahead of the leading boxes)
    cur("R", 1279.0, 37.8, 39.8, [1, 0]),
    cur("R", 1281.8, 40.0, 40.9, [1, 0], { every: 0.9 }),
    cur("R", 1280.0, 42.2, 46.2, [1, 0]),
    cur("R", 1287.4, 48.4, 49.6, [1, 0], { every: 1.2 }),
    cur("N", 1278.7, 38.2, 40.8, [1, 0]),
    cur("N", 1277.0, 42.2, 45.4, [1, 0], { every: 2.0 }),
    // Bowen's lines (west of each red line)
    cur("R", 1288.3, 37.4, 44.2, [-1, 0], { every: 1.7, dy0: -2.0, dy1: 1.2 }),   // Green
    cur("N", 1283.4, 37.9, 40.6, [-1, 0]),                                          // Tracy
    cur("N", 1281.8, 41.8, 45.4, [-1, 0]),                                          // Tracy, after the counterattack
    cur("R", 1290.0, 39.6, 40.9, [-1, 0], { every: 0.9, dy0: 1.4, dy1: 3.8 }),      // Cockrell coming in
    cur("R", 1284.4, 42.0, 43.6, [-1, 0], { every: 0.8, dy0: 1.4, dy1: 3.8 }),      // Cockrell's counterattack at its furthest
    { region: PG, pts: [[1285.4, 1005.0], [1285.6, 1006.0], [1285.8, 1007.0]], t0: 48.0, t1: 49.4, cue: true, every: 1.2, opts: { ...SMK, cluster: null, dir: [1, 0.1], volley: 1.2, roll: 0.7 } },   // Logan on the third ridge
  ],
  guns: [
    { region: PG, size: 0.6, impactOpts: { size: 0.45 }, shots: [36.4, 38.4, 40.2, 43.0, 44.6, 46.0].map((t, i) => ({ t, at: onR(1271.0), dir: [1, 0.02], impact: onR(1290.0 + (i % 3) * 0.6, -1.4 + (i % 3) * 1.2), delay: 0.9 })) },
    { region: PG, size: 0.6, impactOpts: { size: 0.45 }, shots: [37.4, 39.5, 42.4, 45.0].map((t, i) => ({ t, at: onN(1270.6), dir: [1, -0.03], impact: onN(1285.6 + (i % 2) * 0.8, -0.8 + (i % 3) * 0.8), delay: 0.9 })) },
    { region: PG, size: 0.6, impactOpts: { size: 0.45 }, shots: [37.0, 39.0, 41.2, 43.8].map((t, i) => ({ t, at: onR(1292.0), dir: [-1, 0.02], impact: onR(1277.0 + (i % 2) * 1.6, -2.4 + (i % 3) * 1.8), delay: 0.9 })) },
  ],
};

window.SEQ = {
  name: "S05", D, T, seed: 1505, date: "1863-05-01",
  regions: [PG],
  regionOpts: { [PG]: { troopScale: 1.9 } },
  generals: { bowen: { img: "seq/bowen.png", side: "cs", name: "Bowen", full: "John S. Bowen", role: "Brigadier General" } },
  keys: [
    // night: low over the Bruinsburg road, looking east toward the farmhouse
    { t: 0, region: PG, at: [1253.0, 1016.4], dist: 25, tilt: 60, yaw: -66, fov: 30, night: 1 },
    { t: 8.6, region: PG, at: [1263.0, 1014.0], dist: 24, tilt: 58, yaw: -72, fov: 30, night: 1 },
    // Bowen's division astride both roads
    { t: 15.0, region: PG, at: [1279.0, 1014.4], dist: 32, tilt: 56, yaw: -80, fov: 30, night: 1 },
    { t: 19.4, region: PG, at: [1276.0, 1014.6], dist: 39, tilt: 58, yaw: -82, fov: 30, night: 1 },
    // dawn: low across the ridges
    { t: 20.3, region: PG, at: [1275.6, 1014.6], dist: 39, tilt: 59, yaw: -82, fov: 30, night: 0, ease: "lin" },
    { t: 27.6, region: PG, at: [1281.0, 1014.6], dist: 42, tilt: 62, yaw: -86, fov: 30 },
    { t: 35.2, region: PG, at: [1278.8, 1014.4], dist: 35, tilt: 58, yaw: -84, fov: 30 },
    // the battle
    { t: 44.0, region: PG, at: [1284.0, 1013.4], dist: 33.5, tilt: 55, yaw: -84, fov: 30 },   // round 3: frame up (the rear boxes stay in frame)
    { t: 48.0, region: PG, at: [1290.8, 1013.6], dist: 34, tilt: 54, yaw: -84, fov: 30 },
    { t: 52.2, region: PG, at: [1298.0, 1015.4], dist: 34, tilt: 54, yaw: -82, fov: 30 },
    // ledger, the road open
    { t: 58.0, region: PG, at: [1296.8, 1015.6], dist: 39, tilt: 50, yaw: -78, fov: 30 },
    { t: D, region: PG, at: [1296.5, 1015.6], dist: 39, tilt: 46, yaw: -76, fov: 30 },
  ],
  clouds: { [PG]: { shadows: true } },
  units, arrows,
  banners: [
    { general: "grant", keys: [[T.grantLost, 1292.6, 1015.6], [D, 1295.6, 1015.8]], t0: T.grantLost + 0.1, t1: D + 1 },
  ],
  labels: [
    { text: "Shaifer house", at: [SH[0] - 0.4, SH[1] - 1.4], size: 17, t0: 4.1, t1: 8.2, region: PG },
    { text: "Bruinsburg Road", at: onN(1277.0, -1.4), size: 18, t0: T.roads + 0.1, t1: T.roads + 4.0, region: PG },
    { text: "Rodney Road", at: onR(1277.0, 2.0), size: 18, t0: T.roads + 0.5, t1: T.roads + 4.4, region: PG },
    { text: "Port Gibson", at: [TOWN[0], TOWN[1] - 2.2], size: 21, t0: T.town, t1: T.town + 4.0, region: PG },
    { text: "Port Gibson", at: [TOWN[0], TOWN[1] - 2.2], size: 21, t0: T.pg, t1: T.pg + 1.9, region: PG },
    { text: "Little Bayou Pierre", at: [1313.4, 1021.4], size: 17, t0: 50.3, t1: 53.6, region: PG, river: true },
  ],
  fx,
  overlay: [
    ["film.grade", 0, "night", 0.1],
    ["plaque.date", 0.4, { month: "April 1863", day: "30", weekday: "Thursday", note: "DAY 1 · night march" }],
    ["plaque.date", T.midnight, { month: "May 1863", day: "1", weekday: "Friday", note: "DAY 2 · after midnight" }],
    ["label", T.pickets, T.pickets + 3.2, { name: "First shots", sub: "Confederate pickets near the Shaifer house", world: [SH[0] + 3.4, SH[1] + 1.0], side: "cs", marker: false }],
    ["medallion", { kind: "card", general: "bowen", sub: "rushed down from Grand Gulf", screen: [1660, 300], tIn: T.bowen, tOut: 14.7 }],
    ["label", T.seven, T.seven + 3.3, { name: "7,000 - 8,000 men", sub: "Bowen's division, astride both roads", world: [1288.0, 1014.6], side: "cs", marker: false }],
    ["label", T.twice, T.twice + 3.0, { name: "More than twice their size", sub: "the Union army on the road", world: [1264.0, 1015.0], side: "us", marker: false }],
    ["film.grade", 19.6, "day", 0.8],
    ["plaque.date", 19.8, { month: "May 1863", day: "1", weekday: "Friday", note: "DAY 2 · dawn" }],
    ["legend", T.ground, T.grantLost - 0.2, {   // round 3: steps out for the ledger (one big card) and for the units under its corner
      entries: [{ name: "Union", color: "#3C6E9E" }, { name: "Confederates", sub: "Bowen", color: "#9C3A35" }] }],
    ["label", T.ravines, T.ravines + 3.6, { name: "Ravines", sub: "choked with cane and vines", world: [1277.0, 1014.6], marker: false, stripes: [] }],
    ["plaque.date", T.allDay, { month: "May 1863", day: "1", weekday: "Friday", note: "DAY 2 · morning" }],
    ["label", T.counter, T.counter + 2.6, { name: "Counterattack", sub: "Bowen strikes back", world: [1289.0, 1023.6], side: "cs", marker: false }],
    ["plaque.date", T.late, { month: "May 1863", day: "1", weekday: "Friday", note: "DAY 2 · late afternoon" }],
    ["label", T.pressed + 0.2, T.pressed + 3.4, { name: "Pressed on both ridges", sub: "Logan's brigade on a third ridge, north of the road", world: [1288.0, 1003.6], side: "us", marker: false }],
    ["label", 50.1, 53.4, { name: "Over the bayou", sub: "the bridges burned behind the retreat", world: [BRG2.x - 2.0, BRG2.z - 3.0], side: "cs", marker: false }],
    ["ledger.show", T.grantLost + 0.2, { title: "Port Gibson", sub: "1 May 1863 · Union loss" }],
    ["ledger.add", T.eight, { who: "131 killed", stamp: false }],
    ["ledger.add", T.eight + 0.45, { who: "719 wounded", stamp: false }],
    ["ledger.add", T.eight + 0.9, { who: "25 missing", note: "Grant's Memoirs", stamp: false }],
    ["ledger.final", T.seventy + 0.4, { lines: ["About 870", "men lost"], color: "#A8261B" }],
    ["ledger.hide", T.question - 0.4],
    ["label", T.open + 0.2, T.open + 3.6, { name: "The road inland is open", sub: "", world: [1301.0, 1023.0], side: "us", marker: false }],
  ],
};
})();
