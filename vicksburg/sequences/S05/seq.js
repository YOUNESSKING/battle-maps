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
const ESC_N = [...NR.filter((p) => p[0] > 1290), [1305.6, 1014.6], ...gm6Rev.slice(1)];

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

// Union divisions (deployed by dawn): Hovey + Carr astride the Rodney road, A. J. Smith behind, Osterhaus on the Bruinsburg road
const uLine = (n, dy, xs, road, o = {}) => ({ side: "u", type: "inf", n, face: E, t0: 17.6, ...o,
  keys: xs.map(([t, x]) => { const p = road === "R" ? onR(x, dy) : onN(x, dy); return [t, p[0], p[1]]; }) });
// Rodney road (south ridge): steps forward, recoil on the counterattack, forward again, then pursuit into town
const RX = [[0, 1266], [19.6, 1272.5], [36.0, 1272.5], [37.6, 1277.5], [38.6, 1277.5], [40.0, 1281.5], [40.8, 1281.5], [42.0, 1279.6], [44.6, 1279.6], [46.4, 1286.0], [48.6, 1288.5], [53.5, 1294.5], [D, 1297.5]];
units.push(uLine(4, -2.7, RX, "R"));                                   // Hovey (north half of the ridge)
units.push(uLine(4, 2.7, RX.map(([t, x]) => [t + 0.25, x - 0.4]), "R"));   // Carr (south half)
units.push(uLine(4, 0, [[0, 1262], [19.6, 1266.5], [36.4, 1266.5], [38.6, 1271.0], [44.6, 1273.0], [47.0, 1279.5], [53.5, 1287.5], [D, 1291.0]], "R", { t0: 18.4 }));   // A. J. Smith (support)
// Bruinsburg road (north ridge): Osterhaus held up until the flank is turned
const NX = [[0, 1266.5], [19.6, 1273.0], [36.2, 1273.0], [38.0, 1277.0], [39.6, 1278.5], [40.8, 1278.5], [41.9, 1276.6], [45.2, 1276.6], [47.0, 1283.5], [49.0, 1286.5], [54.0, 1292.0], [D, 1295.0]];
units.push(uLine(4, 0, NX, "N"));
// Logan's brigade (J. E. Smith): along a third ridge north of the road, turns Tracy's flank
units.push({ side: "u", type: "inf", n: 2, face: E, t0: T.pressed - 0.4, keys: [[T.pressed - 0.4, 1279.0, 1005.8], [47.0, 1285.0, 1006.0], [49.5, 1289.0, 1007.2], [D, 1294.0, 1008.6]] });
// Union guns
units.push({ side: "u", type: "art", n: 2, face: E, t0: 18.6, keys: [[0, ...onR(1275.0, -0.2)], [47.5, ...onR(1275.0, -0.2)], [52.0, ...onR(1284.0, -0.2)]] });
units.push({ side: "u", type: "art", n: 2, face: E, t0: 18.6, keys: [[0, ...onN(1275.4, 1.0)], [48.0, ...onN(1275.4, 1.0)], [52.5, ...onN(1283.0, 1.0)]] });

// Bowen's division (red): Green astride the Rodney road at Magnolia Church, Tracy on the Bruinsburg road, Baldwin + Cockrell come up behind
const T_OUT = 46.66, rLine = (n, at, o = {}) => ({ side: "r", type: "inf", n, face: Wf, t0: 9.6, keys: [[0, ...at]], ...o });
const greenAt = onR(1289.6, -0.2), tracyAt = onN(1283.8, 0.2);
units.push(rLine(2, greenAt, { keys: [[0, ...greenAt], [44.2, ...greenAt], [T_OUT - 0.2, greenAt[0] + 2.2, greenAt[1]]],
  escape: { road: ESC_S, t0: T_OUT, v: 3.6, v2: 3.6, join: "east", fade: false } }));                                  // Green
units.push({ side: "r", type: "art", n: 1, face: Wf, t0: 9.6, keys: [[0, ...onR(1291.2, -1.6)]], escape: { road: ESC_S, t0: T_OUT - 0.4, v: 3.6, v2: 3.6, join: "east", fade: false } });
units.push(rLine(2, tracyAt, { keys: [[0, ...tracyAt], [40.6, ...tracyAt], [41.8, tracyAt[0] - 1.6, tracyAt[1]], [45.4, tracyAt[0] - 1.6, tracyAt[1]], [T_OUT - 0.2, tracyAt[0] + 2.4, tracyAt[1] + 0.6]],
  escape: { road: ESC_N, t0: T_OUT + 0.3, v: 4.4, v2: 4.4, join: "east", fade: false } }));                            // Tracy
units.push({ side: "r", type: "art", n: 1, face: Wf, t0: 9.6, keys: [[0, ...onN(1285.6, 1.4)]], escape: { road: ESC_N, t0: T_OUT - 0.2, v: 4.4, v2: 4.4, join: "east", fade: false } });
// Cockrell: comes up from town and counterattacks south of the Rodney road, then falls back
units.push({ side: "r", type: "inf", n: 2, face: Wf, t0: 36.4, keys: [[36.4, 1298.0, 1021.2], [39.4, 1292.4, 1021.6], [40.8, 1291.0, 1021.6], [42.0, 1285.6, 1021.2], [43.6, 1286.4, 1021.2], [T_OUT - 0.4, 1292.8, 1020.8]],
  escape: { road: ESC_S, t0: T_OUT + 0.5, v: 3.6, v2: 3.6, join: "east", fade: false } });
// Baldwin: second line behind Tracy, steps into the gap
units.push({ side: "r", type: "inf", n: 1, face: Wf, t0: 36.0, keys: [[36.0, 1294.0, 1011.6], [39.0, 1288.6, 1011.4], [44.0, 1288.6, 1011.4], [T_OUT - 0.3, 1292.0, 1011.6]],
  escape: { road: ESC_N, t0: T_OUT + 0.8, v: 4.4, v2: 4.4, join: "east", fade: false } });
units.forEach((u) => { if (u.side === "r" && u.escape) u.t1 = 60.5; });

// ---------------- arrows ----------------
const arrows = [
  // Bowen rushed down from Grand Gulf (north): his division comes down the road into the town and out onto the ridges
  { side: "r", pts: [[1294.6, 998.7], [1299.8, 1005.6], [1303.0, 1010.6], [1300.0, 1014.6], [1294.0, 1016.6]], t0: T.grandGulf, dur: 2.0, t1: 17.4 },
  // only along the ridge tops
  { side: "u", pts: VX.sub(NR, 1.0, 16.5), t0: 31.7, dur: 2.0, t1: 36.6 },
  { side: "u", pts: VX.sub(RR, 1.5, 17.0), t0: 32.3, dur: 2.0, t1: 36.6 },
  // the counterattack
  { side: "r", pts: [[1293.2, 1022.6], [1289.6, 1022.4], [1286.0, 1021.8]], t0: T.counter, dur: 1.2, t1: 43.4 },
  { side: "r", pts: [[1287.0, 1009.0], [1283.6, 1009.2], [1280.4, 1009.6]], t0: T.counter + 0.3, dur: 1.2, t1: 43.4 },
  // the flank turned: Logan's brigade on the third ridge
  { side: "u", pts: [[1279.6, 1004.6], [1284.0, 1004.4], [1288.0, 1005.4], [1290.6, 1007.4]], t0: T.pressed, dur: 2.0, t1: 49.6 },
  // the road inland is open
  { side: "u", pts: [[1294.0, 1018.6], [1300.5, 1019.0], [TOWN[0], TOWN[1] - 0.3], ...NE_RD.slice(1, 40)].filter((p, i, a) => i < 4 || i % 6 === 0 || i === a.length - 1), t0: T.open + 0.1, dur: 2.4, t1: D + 1 },
];

// ---------------- fx ----------------
const BRG0 = VX.bridge(PG, 0), BRG2 = VX.bridge(PG, 2);
const SMK = { dir: [-1, 0], size: 0.9, alpha: 0.24, life: 11, muzzle: 6, windK: 0.4, rate: 2.2 };
const vline = (pts, t0, t1, dir, o = {}) => ({ region: PG, pts, t0, t1, cue: true, every: o.every || 2.0, opts: { ...SMK, dir, volley: o.every || 2.0, roll: 0.7, ...o } });
const fx = {
  fires: [
    { region: PG, bridge: 0, t0: T.burned + 0.1, t1: D + 1, preset: "bridge", waterGlow: { t1: D + 1 } },   // the South Fork bridge
    { region: PG, bridge: 2, t0: 55.4, t1: D + 1, preset: "bridge", waterGlow: { t1: D + 1 } },
  ],
  volleys: [
    // first shots at night near the Shaifer house
    { region: PG, pts: [[SH[0] + 3.0, SH[1] + 0.3], [SH[0] + 3.4, SH[1] + 1.8]], t0: 7.7, t1: 9.4, every: 0.9, opts: { ...SMK, dir: [-1, 0], rate: 4, volley: 0.9, size: 0.7 } },
    { region: PG, pts: [[SH[0] - 0.4, SH[1] - 0.6], [SH[0] - 0.2, SH[1] + 0.8]], t0: 8.2, t1: 9.4, every: 1.2, opts: { ...SMK, dir: [1, 0], rate: 3, volley: 1.2, size: 0.7 } },
    // the day battle: Union lines (moving forward in steps: one curtain per halt)
    vline([onR(1278.3, -3.6), onR(1278.3, 3.6)], 37.8, 40.6, [1, 0]),
    vline([onN(1278.0, -1.6), onN(1278.0, 1.6)], 38.2, 40.8, [1, 0]),
    vline([onR(1280.6, -3.6), onR(1280.6, 3.6)], 42.2, 46.2, [1, 0], { every: 1.8 }),
    vline([onR(1287.0, -3.4), onR(1287.0, 3.4)], 46.6, 49.0, [1, 0], { every: 2.2 }),
    // Bowen's lines
    vline([onR(1288.8, -1.4), onR(1288.8, 1.4)], 37.4, 46.0, [-1, 0], { every: 1.7 }),
    vline([onN(1283.0, -1.2), onN(1283.0, 1.4)], 37.9, 40.6, [-1, 0]),
    vline([[1290.4, 1020.6], [1290.4, 1022.6]], 39.6, 43.8, [-1, 0], { every: 1.6 }),   // Cockrell
    vline([onN(1281.4, -1.2), onN(1281.4, 1.4)], 41.8, 45.4, [-1, 0], { every: 1.8 }),
    vline([[1288.6, 1005.0], [1289.4, 1007.2]], 47.0, 49.0, [1, 0.1], { every: 1.0 }),   // the flank turned
  ],
  guns: [
    { region: PG, shots: [36.4, 38.4, 40.2, 43.0, 44.6, 46.0].map((t, i) => ({ t, at: onR(1275.0, -0.2 + (i % 2 ? 0.45 : -0.45)), dir: [1, 0.02], impact: onR(1289.0 + (i % 3) * 0.6, -1.4 + (i % 3) * 1.2), delay: 0.9 })) },
    { region: PG, shots: [37.4, 39.5, 42.4, 45.0].map((t, i) => ({ t, at: onN(1275.4, 1.0 + (i % 2 ? 0.45 : -0.45)), dir: [1, -0.03], impact: onN(1283.6 + (i % 2) * 0.8, -0.8 + (i % 3) * 0.8), delay: 0.9 })) },
    { region: PG, shots: [37.0, 39.0, 41.2, 43.8].map((t, i) => ({ t, at: onR(1291.2, -1.6), dir: [-1, 0.02], impact: onR(1278.5 + (i % 2) * 1.6, -2.4 + (i % 3) * 1.8), delay: 0.9 })) },
  ],
};

window.SEQ = {
  name: "S05", D, T, seed: 1505, date: "1863-05-01",
  regions: [PG],
  regionOpts: { [PG]: { troopScale: 1.45 } },
  generals: { bowen: { img: "seq/bowen.png", side: "cs", name: "Bowen", full: "John S. Bowen", role: "Brigadier General" } },
  keys: [
    // night: low over the Bruinsburg road, looking east toward the farmhouse
    { t: 0, region: PG, at: [1252.0, 1016.6], dist: 30, tilt: 60, yaw: -66, fov: 30, night: 1 },
    { t: 8.6, region: PG, at: [1262.0, 1014.0], dist: 27, tilt: 58, yaw: -72, fov: 30, night: 1 },
    // Bowen's division astride both roads
    { t: 15.0, region: PG, at: [1278.0, 1014.4], dist: 36, tilt: 56, yaw: -80, fov: 30, night: 1 },
    { t: 19.4, region: PG, at: [1276.0, 1014.6], dist: 39, tilt: 58, yaw: -82, fov: 30, night: 1 },
    // dawn: low across the ridges
    { t: 20.3, region: PG, at: [1275.6, 1014.6], dist: 39, tilt: 59, yaw: -82, fov: 30, night: 0, ease: "lin" },
    { t: 27.6, region: PG, at: [1281.0, 1014.6], dist: 42, tilt: 62, yaw: -86, fov: 30 },
    { t: 35.2, region: PG, at: [1279.5, 1014.4], dist: 34, tilt: 58, yaw: -84, fov: 30 },
    // the battle
    { t: 44.0, region: PG, at: [1285.5, 1013.2], dist: 31, tilt: 55, yaw: -84, fov: 30 },
    { t: 48.0, region: PG, at: [1292.5, 1013.4], dist: 32, tilt: 54, yaw: -84, fov: 30 },
    { t: 52.2, region: PG, at: [1300.0, 1015.4], dist: 31, tilt: 54, yaw: -82, fov: 30 },
    // ledger, the road open
    { t: 58.0, region: PG, at: [1299.5, 1015.0], dist: 38, tilt: 54, yaw: -78, fov: 30 },
    { t: D, region: PG, at: [1301.5, 1014.6], dist: 42, tilt: 53, yaw: -75, fov: 30 },
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
    { text: "Port Gibson", at: [TOWN[0], TOWN[1] - 2.2], size: 21, t0: T.pg, t1: T.pg + 3.4, region: PG },
    { text: "Bayou Pierre", at: [1312.4, 1020.8], size: 17, t0: T.burned + 0.6, t1: T.burned + 4.2, region: PG, river: true },
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
    ["legend", T.ground, D - 1.0, { entries: [{ name: "Union", color: "#3C6E9E" }, { name: "Confederates", sub: "Bowen", color: "#9C3A35" }] }],
    ["label", T.ravines, T.ravines + 3.6, { name: "Ravines", sub: "choked with cane and vines", world: [1277.0, 1014.6], marker: false, stripes: [] }],
    ["plaque.date", T.allDay, { month: "May 1863", day: "1", weekday: "Friday", note: "DAY 2 · morning" }],
    ["label", T.counter, T.counter + 2.6, { name: "Counterattack", sub: "Bowen strikes back", world: [1289.0, 1023.6], side: "cs", marker: false }],
    ["plaque.date", T.late, { month: "May 1863", day: "1", weekday: "Friday", note: "DAY 2 · late afternoon" }],
    ["label", T.pressed + 0.3, T.pressed + 3.4, { name: "The flank turned", sub: "a third ridge, north of the road", world: [1291.0, 1004.0], side: "us", marker: false }],
    ["label", T.burned + 0.2, T.burned + 3.4, { name: "Bridges burned", sub: "behind the Confederate retreat", world: [BRG0.x + 1.0, BRG0.z + 2.4], side: "cs", marker: false }],
    ["ledger.show", T.grantLost + 0.2, { title: "Port Gibson", sub: "1 May 1863 · Union loss" }],
    ["ledger.add", T.eight, { who: "131 killed", stamp: false }],
    ["ledger.add", T.eight + 0.45, { who: "719 wounded", stamp: false }],
    ["ledger.add", T.eight + 0.9, { who: "25 missing", note: "Grant's Memoirs", stamp: false }],
    ["ledger.final", T.seventy + 0.4, { lines: ["About 870", "men lost"], color: "#A8261B" }],
    ["ledger.hide", T.question - 0.4],
    ["label", T.open + 0.2, T.open + 3.6, { name: "The road inland is open", sub: "", world: [1313.0, 1011.0], side: "us", marker: false }],
  ],
};
})();
