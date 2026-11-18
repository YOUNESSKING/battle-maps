// S06 Cut loose (3-11 May 1863, DAY 4 -> DAY 12). D = 95.22 s (tools/scene_times.py S06). Region: wide only (no dive).
// Grand Gulf in Union hands + a thin blue supply line back to the river; Banks medallion + the news (not before 10 May, ~15,000 men);
// Pemberton's red masses appear (Vicksburg, the Big Black); Grant card + quote "cut loose from my base"; Sherman's corps comes over the river,
// the one road jams with wagons, Sherman's warning letter ("as sure as life"); Grant's reply quote ("make the country furnish the balance");
// foraging: a short wagon train, cattle driven in from the plantations, corn mills turning (quick night dip on "day and night");
// THE TWIST: a pale ghost arrow north to Vicksburg (what Pemberton expected) fades; the real arrow bends north-east toward the railroad and
// Jackson; the railroad that fed the city; red reinforcements gather at Jackson (Johnston card); stakes: Grant's army between two red
// masses, no supply line, two red arrows threaten to close on "crushed between them".
// Facts: research/FACT_NOTES.md section 5 (GM ch. XXXIV) + 7 (Johnston). Banks portrait: Library of Congress, Brady-Handy collection
// LC-BH82-... "Gen. N.P. Banks" (cwpbh 01071), public domain, cut with rembg.
(() => {
const W = "wide";
const T = { D: 95.22, grant0: 0.35, banks: 2.89, portHudson: 5.65, word: 7.33, tenth: 10.11, fifteen: 12.63, waiting: 14.09, month: 17.51,
  waiting2: 18.85, enemy: 19.61, grant: 21.31, q1: 23.61, cut: 26.09, city: 32.27, sherman: 33.73, oneRoad: 36.55, warned: 38.85, jammed: 40.65,
  sure: 41.51, reply: 43.19, bread: 46.31, make: 48.91, balance: 50.95, army: 52.29, two: 54.19, plantation: 56.43, mill: 57.89, mules: 58.83,
  grinding: 60.81, day: 61.23, night: 61.85, pem: 62.99, north: 64.57, vicksburg: 66.05, but: 67.33, turned: 68.21, away: 69.69, railroad: 71.77,
  jackson: 73.75, capital: 74.93, conf: 76.09, gathering: 77.99, joseph: 80.23, other: 82.15, two2: 84.93, noSupply: 86.97, deep: 88.53,
  ifThey: 90.67, joined: 91.03, crushed: 92.37 };
const D = T.D;
const TW = (n) => VX.town(n, W);
const GG = TW("Grand Gulf"), WS = TW("Willow Springs"), VB = TW("Vicksburg"), JK = TW("Jackson"), ED = TW("Edwards"), RY = TW("Raymond");
const HF = [1382.5, 883];   // Hankinson's Ferry (end of the Willow Springs - Hankinson's Ferry road)
const R8 = VX.road(W, 8);   // Grand Gulf - Willow Springs road (the one road)
const R7 = VX.road(W, 7);   // Willow Springs - Hankinson's Ferry
const R6 = VX.road(W, 6);   // Port Gibson - Willow Springs - Rocky Springs - Utica - Raymond
const MISS = VX.river(W, 0).pts.filter((p) => p[1] > 957 && p[1] < 1062).map((p) => [p[0], p[1]]).filter((_, i, a) => i % 6 === 0 || i === a.length - 1);
const SUP = [...R8, ...R7.slice(1)].filter((_, i, a) => i % 8 === 0 || i === a.length - 1);
const U = "u", R = "r", NE = VX.FACE.ne;

// ---------------- units (wide, troopScale 16: fewer, bigger groups) ----------------
// On the far shots (from the twist on, camera 360-470 units out) each blue corps swaps for a thicker copy of itself (same keys, group =
// no push between the two) so the boxes still read at 1280x720; the red masses are thick from the start.
const SWAP = 64.6, BIG = { bw: 1.0, bd: 0.62 }, RBIG = { bw: 0.95, bd: 0.58 };
const far = (u, g) => [{ ...u, group: g, t1: SWAP + 0.5 }, { ...u, ...BIG, group: g, t0: SWAP }];
const units0 = [
  // Grand Gulf garrison (in Union hands)
  { region: W, side: U, type: "inf", n: 1, face: "west", t0: 0.5, keys: [[0, GG[0] + 8, GG[1] - 10]] },
  // McClernand (XIII) at Willow Springs -> inland -> the line toward Dillon's
  { region: W, side: U, type: "inf", n: 3, face: "north", keys: [[0, WS[0] + 12, WS[1] + 9], [T.army, WS[0] + 12, WS[1] + 9], [60.0, 1452, 902], [T.turned + 0.3, 1452, 902], [79.0, 1566, 816]] },
  // McPherson (XVII) at Hankinson's Ferry -> Utica road -> toward Raymond
  { region: W, side: U, type: "inf", n: 3, face: "north", keys: [[0, HF[0] + 8, HF[1] + 12], [T.army + 0.4, HF[0] + 8, HF[1] + 12], [60.4, 1496, 905], [T.turned + 0.6, 1496, 905], [79.6, 1684, 792]] },
  // Sherman (XV) comes over from Hard Times at Grand Gulf, up the one road, then inland behind
  { region: W, side: U, type: "inf", n: 2, face: "east", t0: 37.4, keys: [[0, GG[0] + 2, GG[1] + 6], [37.6, GG[0] + 2, GG[1] + 6], ...VX.march(VX.sub(R8, 6, 46), 37.8, 6.0).map((k) => [k[0], k[1], k[2] + 6, "lin"]),
    [60.8, 1410, 925], [T.turned + 0.9, 1410, 925], [80.2, 1626, 808]] },
  // Pemberton: Vicksburg + the Big Black (appear on "enemy"); the Big Black mass edges toward Edwards for the stakes
  { region: W, side: R, type: "inf", n: 3, face: "south", t0: T.enemy, keys: [[0, VB[0] + 24, VB[1] + 24], [83.0, VB[0] + 24, VB[1] + 24], [86.0, VB[0] + 40, VB[1] + 32]] },
  { region: W, side: R, type: "inf", n: 3, face: "south", t0: T.enemy + 0.3, keys: [[0, 1530, 724], [83.0, 1530, 724], [86.0, 1566, 728]] },
  // Johnston's force gathering at Jackson
  { region: W, side: R, type: "inf", n: 3, face: "west", t0: T.conf + 0.6, keys: [[0, JK[0] + 12, JK[1] + 15]] },
];
const units = units0.flatMap((u, i) => u.side === R ? [{ ...u, ...RBIG }] : i === 0 ? [u] : far(u, "c" + i));

// ---------------- arrows ----------------
const arrows = [
  // the thin supply line back to the river (Grand Gulf -> the army); cut loose
  { region: W, color: "#7E9BD0", width: 0.15, pts: SUP, t0: 0.9, dur: 1.8, t1: T.cut + 0.3 },
  // Banks's target: Port Hudson, far down the river
  { region: W, color: "#8FA6CF", width: 0.24, pts: MISS, t0: T.portHudson + 0.05, dur: 1.6, t1: T.tenth },
  // Sherman crosses at Grand Gulf
  { region: W, side: U, width: 0.22, pts: [[1210, 906], [1220, 914], [1229, 922]], t0: T.sherman + 0.2, dur: 1.0, t1: 38.6 },
  // the ghost arrow: what Pemberton expected (north, straight at Vicksburg)
  { region: W, color: "#B7C4DC", width: 0.4, pts: [[1398, 872], [1400, 830], [1402, 786], [1404, 744], [VB[0] + 22, VB[1] + 42]], t0: T.north - 0.2, dur: 1.8, t1: T.but + 0.5 },
  // the real arrow: north-east, toward the railroad and Jackson
  { region: W, side: U, width: 0.5, pts: [[1430, 902], [1478, 884], [1524, 850], [1580, 812], [1640, 784], [1694, 758], [1736, 728], [1764, 702]], t0: T.turned, dur: 4.8, t1: D + 1 },
  // the railroad that fed the city (Jackson -> Vicksburg)
  { region: W, color: "#A8452F", width: 0.2, pts: VX.reverse(VX.region(W).railroads[0].pts.map((p) => [p[0], p[1]])).filter((p) => p[0] < JK[0] - 12 && p[0] > VB[0] + 16).filter((_, i, a) => i % 6 === 0 || i === a.length - 1),
    t0: T.railroad, dur: 2.0, t1: 77.0 },
  // reinforcements into Jackson (by rail from the east, from the north)
  { region: W, side: R, pts: [[2016, 748], [1966, 738], [1916, 726]], t0: T.conf + 0.2, dur: 1.4, t1: D + 1 },
  { region: W, side: R, pts: [[1930, 620], [1918, 662], [1906, 698]], t0: T.conf + 0.5, dur: 1.4, t1: D + 1 },
  // if they joined: two red arrows close on the army
  { region: W, side: R, width: 0.46, pts: [[1548, 740], [1570, 768], [1592, 790]], t0: T.joined - 0.1, dur: 1.6, t1: D + 1 },
  { region: W, side: R, width: 0.46, pts: [[1886, 742], [1820, 756], [1754, 772], [1708, 786]], t0: T.joined + 0.3, dur: 1.8, t1: D + 1 },
];

// ---------------- markers: wagons on the jammed road, a short train inland, cattle, corn mills ----------------
const markers = [];
const R8s = VX.sub(R8, 0, VX.len(R8));
for (let i = 0; i < 11; i++) markers.push({ icon: "wagon", region: W, path: R8s, s0: 8 - i * 3.0, v: 2.6, sMax: 38 - i * 1.7, t0: T.oneRoad - 0.2 + i * 0.12, t1: 47.0, size: 4.4, min: 18, max: 30 });
const R6in = VX.sub(R6, 112, 230);   // Willow Springs -> Rocky Springs -> toward Utica
for (let i = 0; i < 5; i++) markers.push({ icon: "wagon", region: W, path: R6in, s0: 4 - i * 4.2, v: 2.2, t0: T.bread - 0.6, t1: 63.0, size: 4.2, min: 17, max: 28 });
const MILLS = [[1414, 920], [1446, 878], [1474, 920], [1505, 878], [1530, 912], [1556, 878]];
MILLS.forEach((p, i) => markers.push({ icon: "mill", region: W, at: p, t0: T.plantation + 0.1 + i * 0.25, t1: 64.0, size: 4.6, min: 20, max: 34, spin: 110 + i * 12, anchor: "center" }));
// cattle driven in from the plantations to the columns
[[[1420, 930], [1446, 912]], [[1462, 872], [1458, 896]], [[1484, 930], [1474, 912]], [[1510, 868], [1500, 896]], [[1540, 920], [1518, 906]], [[1438, 886], [1450, 900]]]
  .forEach(([a, b], i) => { for (let k = 0; k < 2; k++) markers.push({ icon: "cow", region: W, path: [[a[0] + k * 1.6, a[1] + k * 1.2], [b[0] + k * 1.6, b[1] + k * 1.2]], v: 1.1, t0: T.army + 0.2 + i * 0.35, t1: 63.2, size: 3.2, min: 14, max: 22 }); });

const MK = VX.markers(markers);
const PU = VX.pulses([
  { region: W, at: JK, t0: T.jackson, t1: D + 1, r: 14 },
  { region: W, at: [1632, 800], t0: T.crushed, t1: D + 1, r: 22, color: [210, 50, 36], period: 1.2, alpha: 0.8 },
]);

const LEG = { entries: [{ name: "Union", sub: "Grant", color: "#3C6E9E" }, { name: "Confederates", sub: "Pemberton", color: "#9C3A35" }] };
const DATE = (day, dn, note) => ({ month: "May 1863", day: String(day), weekday: "Day " + dn, note });

window.SEQ = {
  name: "S06", D, T, seed: 1506, date: "1863-05-03",
  regions: [W],
  regionOpts: { [W]: { troopScale: 16 } },
  generals: { banks: { img: "seq/banks.png", side: "us", name: "Banks", full: "Nathaniel P. Banks", role: "Major General" } },
  keys: [
    { t: 0, region: W, at: [1318, 938], dist: 300, tilt: 46, yaw: -4, fov: 30 },
    { t: 13.5, region: W, at: [1326, 935], dist: 288, tilt: 46, yaw: -3, fov: 30 },
    { t: 18.6, region: W, at: [1336, 928], dist: 282, tilt: 46, yaw: -2, fov: 30 },
    { t: 22.6, region: W, at: [1428, 830], dist: 350, tilt: 45, yaw: 0, fov: 30 },
    { t: 32.6, region: W, at: [1434, 826], dist: 342, tilt: 45, yaw: 1, fov: 30 },
    { t: 36.2, region: W, at: [1282, 944], dist: 232, tilt: 48, yaw: -2, fov: 30 },
    { t: 43.2, region: W, at: [1312, 944], dist: 214, tilt: 49, yaw: 0, fov: 30 },
    { t: 47.4, region: W, at: [1442, 904], dist: 252, tilt: 48, yaw: 1, fov: 30 },
    { t: 56.2, region: W, at: [1474, 888], dist: 222, tilt: 49, yaw: 3, fov: 30 },
    { t: 60.8, region: W, at: [1480, 886], dist: 218, tilt: 49, yaw: 4, fov: 30, night: 0 },
    { t: 61.5, region: W, at: [1481, 885.6], dist: 217, tilt: 49, yaw: 4.2, fov: 30, night: 0.75, ease: "lin" },
    { t: 62.5, region: W, at: [1482, 885], dist: 218, tilt: 49, yaw: 4.4, fov: 30, night: 0, ease: "lin" },
    { t: 66.2, region: W, at: [1430, 784], dist: 368, tilt: 45, yaw: 0, fov: 30 },
    { t: 74.8, region: W, at: [1690, 768], dist: 470, tilt: 44, yaw: -1, fov: 30 },
    { t: 81.6, region: W, at: [1752, 752], dist: 425, tilt: 44, yaw: -1, fov: 30 },
    { t: 86.2, region: W, at: [1722, 770], dist: 440, tilt: 44, yaw: 0, fov: 30 },
    { t: D, region: W, at: [1720, 772], dist: 456, tilt: 44, yaw: 0.5, fov: 30, ease: "lin" },
  ],
  clouds: {
    [W]: { scatter: { box: [1180, 600, 900, 460], n: 8, med: 22, seed: 6 },
      keepClear: [[1310, 940, 80, 0.8, 1], [1470, 890, 80, 0.8, 1], [1400, 705, 60, 0.8, 1], [1545, 725, 55, 0.8, 1], [1895, 722, 60, 0.8, 1], [1630, 790, 80, 0.8, 1], [1720, 740, 60, 0.8, 1]],
      bounds: [1150, 560, 2090, 1090] },
  },
  units, arrows,
  // Sherman's men come over the Mississippi from Hard Times by steamer (no box ever crosses water)
  boats: [{ region: W, kind: "steamer", n: 2, path: [[1236.5, 930], [1240.5, 938], [1245, 945], [GG[0] - 6, GG[1] - 2]], speed: 3.6, spacing: 5, size: 2.2, t0: 34.4, t1: 38.4, lamp: false }],
  banners: [
    { general: "grant", region: W, keys: [[0, GG[0] + 22, GG[1] - 18], [T.army, GG[0] + 22, GG[1] - 18], [60.0, 1470, 890], [T.turned + 0.6, 1470, 890], [79.6, 1640, 792]], t0: T.grant0 + 0.1, t1: D + 1 },
    { general: "pemberton", region: W, keys: [[0, VB[0] + 10, VB[1] + 6]], t0: T.pem + 0.1, t1: D + 1 },
  ],
  labels: [
    { text: "Grand Gulf", town: "Grand Gulf", region: W, size: 22, t0: 0.6, t1: 13.4 },
    { text: "Willow Springs", town: "Willow Springs", region: W, size: 17, t0: 1.3, t1: 5.2 },
    { text: "Vicksburg", town: "Vicksburg", region: W, size: 22, t0: T.enemy + 0.2, t1: 31.0 },
    { text: "Edwards", town: "Edwards", region: W, size: 17, t0: T.enemy + 0.6, t1: 31.0 },
    { text: "Grand Gulf", town: "Grand Gulf", region: W, size: 20, t0: 36.4, t1: 40.0 },
    { text: "Rocky Springs", town: "Rocky Springs", region: W, size: 17, t0: 48.0, t1: 56.0 },
    { text: "Vicksburg", town: "Vicksburg", region: W, size: 24, t0: T.vicksburg - 0.1, t1: D + 1 },
    { text: "Jackson", town: "Jackson", region: W, size: 26, t0: T.jackson, t1: D + 1 },
    { text: "Raymond", town: "Raymond", region: W, size: 17, t0: 70.6, t1: 80.0 },
    { text: "Edwards", town: "Edwards", region: W, size: 18, t0: 83.4, t1: D + 1 },
  ],
  overlay: [
    ["plaque.date", 0.35, DATE(3, 4, "Sunday · Grand Gulf in Union hands")],
    ["legend", 0.9, T.word - 0.2, LEG],
    ["label", 1.0, 4.4, { name: "Supply line", sub: "the one road back to the river", world: [1318, 952], side: "us", marker: false }],
    ["medallion", { kind: "card", general: "banks", sub: "Department of the Gulf", screen: [1640, 300], tIn: T.banks + 0.05, tOut: T.word - 0.3 }],
    ["label", T.portHudson + 0.1, T.tenth - 0.3, { name: "Port Hudson", sub: "far down the river · Banks's target", world: [1162, 1040], side: "us", marker: false }],
    ["letter", T.word + 0.05, T.waiting - 0.2, { header: "3 May 1863 · Grand Gulf", title: "News from Banks", sub: "Major General Nathaniel P. Banks", marks: false, cps: 22, top: 800,
      quote: "Not at Port Hudson before the 10th of May, and then with only some 15,000 men." }],
    ["legend", T.waiting, T.q1 - 0.4, LEG],
    ["label", T.waiting + 1.9, T.waiting2 - 0.1, { name: "A month lost", sub: "if he waited, Grant reckoned", world: [1300, 962], side: "us", marker: false }],
    ["medallion", { kind: "card", general: "grant", sub: "Army of the Tennessee", screen: [1640, 300], tIn: T.grant + 0.05, tOut: T.q1 - 0.3 }],
    ["quote", T.q1 - 0.1, T.city + 0.75, { en: "To move independently of Banks, cut loose from my base, destroy the rebel force in rear of Vicksburg and invest or capture the city.", attr: "Ulysses S. Grant · Personal Memoirs", y: 640 }],
    ["plaque.date", T.cut + 0.1, DATE(3, 4, "Sunday · cut loose from the base")],
    ["legend", T.sherman, T.warned - 0.3, LEG],
    ["medallion", { kind: "card", general: "sherman", sub: "XV Corps · coming up from the river", screen: [1640, 300], tIn: T.sherman + 0.05, tOut: T.oneRoad + 2.0 }],
    ["label", T.oneRoad + 0.3, T.warned - 0.2, { name: "One road", sub: "Grand Gulf to the army", world: [1330, 956], side: "us", marker: false }],
    ["letter", T.warned - 0.05, T.reply + 0.4, { header: "May 1863 · Hankinson's Ferry", title: "Sherman to Grant", sub: "a warning", marks: false, cps: 40, top: 800,
      quote: "Stop all troops till your army is supplied with wagons: this road will be jammed, “as sure as life.”" }],
    ["legend", T.reply + 0.8, T.make - 0.4, LEG],
    ["plaque.date", T.bread, DATE(3, 4, "Sunday · hard bread, coffee, salt")],
    ["quote", T.make - 0.15, T.army - 0.1, { en: "…and make the country furnish the balance.", attr: "Ulysses S. Grant to Sherman · 9 May 1863", y: 660 }],
    ["legend", T.army + 0.3, D + 1, LEG],
    ["plaque.date", T.army + 0.1, DATE(7, 8, "Thursday · living off the country")],
    ["label", T.two, T.plantation - 0.2, { name: "Two days' rations", sub: "when the army left the river", world: [1452, 904], side: "us", marker: false }],
    ["label", T.mill, T.night + 0.6, { name: "Corn mills", sub: "turned by mules · grinding day and night", world: [1505, 872], side: "us", marker: false }],
    ["label", T.north - 0.1, T.but + 0.1, { name: "What Pemberton expected", sub: "a march north, straight at Vicksburg", world: [1402, 800], side: "cs", marker: false }],
    ["label", T.turned + 0.4, T.railroad - 0.2, { name: "North-east", sub: "away from the city", world: [1560, 826], side: "us", marker: false }],
    ["label", T.railroad + 0.1, T.capital + 0.5, { name: "The railroad", sub: "the line that fed Vicksburg", world: [1660, 676], side: "cs", marker: false }],
    ["label", T.capital + 0.1, T.joseph - 0.3, { name: "The state capital", sub: "Confederate reinforcements gathering", world: [JK[0] + 4, JK[1] - 30], side: "cs", marker: false }],
    ["medallion", { kind: "card", general: "johnston", sub: "coming to take command at Jackson", world: [JK[0] + 12, JK[1] + 15], offset: [-380, -260], tIn: T.joseph + 0.05, tOut: T.other + 1.2 }],
    ["plaque.date", T.other + 0.1, DATE(11, 12, "Monday · between two armies")],
    ["label", T.two2, T.deep + 0.6, { name: "Pemberton", sub: "Vicksburg and the Big Black", world: [1560, 752], side: "cs", marker: false }],
    ["label", T.two2 + 0.4, T.deep + 0.9, { name: "Johnston", sub: "Jackson", world: [JK[0] + 14, JK[1] - 30], side: "cs", marker: false }],
    ["label", T.noSupply, T.ifThey - 0.1, { name: "No supply line", sub: "deep in their own country", world: [1600, 836], side: "us", marker: false }],
    ["plaque.date", T.joined, DATE(11, 12, "Monday · if they joined")],
  ],
  build: async (ctx) => { MK.build(ctx); PU.build(ctx); },
  draw: (t, ctx) => { MK.draw(t, ctx); PU.draw(t, ctx); },
};
})();
