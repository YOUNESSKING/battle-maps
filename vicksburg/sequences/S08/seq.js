// S08 Jackson (14 May 1863, DAY 15). D = 96.78 s (tools/scene_times.py S08). Regions: wide (rain) -> (cloud dive) jackson -> (hard cut on the
// section change) wide (night of 13 May: the courier) -> wide (day: the army turns west).
// Wide in a downpour: McPherson from the west on the Clinton road, Sherman from the south-west on the Mississippi Springs road; Johnston card;
// red columns start north -> dive into Jackson: the thin rearguard (Colquitt at the O. P. Wright farm, Thompson at Lynch Creek) fights while the
// rest leaves north on the Canton road; Crocker's charge, Sherman's battery at the bridge; the Stars and Stripes rise over the capitol; that night
// (Grant's bed); the factory (Grant + Sherman, tent cloth quote card), the workers leave with cloth, the factory burns -> cut to the wide map
// at night (13 May): Johnston sends three messengers; the dispatch letter card ("Time is all-important"); one rider is a Union man, turns into
// McPherson's lines at Clinton (McPherson card), the paper goes on to Grant -> day: blue arrows swing west toward Bolton and Edwards,
// Pemberton's red mass near Edwards.
// Facts: research/FACT_NOTES.md section 7 (GM ch. XXXV; Johnston's narrative; WP). The courier is not named (FACT_NOTES section 17).
(() => {
const W = "wide", J = "jackson";
const T = { D: 96.78, fourteenth: 0.92, two: 1.95, marched: 2.89, jackson: 3.61, downpour: 4.61, johnston: 6.19, night: 7.39, decided: 9.91, held: 11.63,
  thin: 12.97, fought: 13.93, north: 15.97, afternoon: 17.23, stars: 18.53, flew: 19.69, capital: 20.53, mississippi: 21.23, grant: 22.79, thatNight: 23.19,
  room: 25.37, used: 27.13, before: 29.07, grantSherman: 30.19, factory: 31.61, battle: 34.47, watched: 37.29, csa: 41.63, bolt: 43.73, told: 45.31,
  work: 47.29, workers: 48.41, carry: 50.95, flames: 51.85, but: 54.27, paper: 57.63, nightBefore: 58.87, johnston3: 60.25, pemberton: 61.25,
  three: 62.77, messengers: 64.85, come: 65.45, once: 68.05, time: 69.25, one: 71.65, union2: 73.53, months: 75.23, memphis: 76.89, act: 81.07,
  straight: 83.09, mcp: 83.77, sent: 85.39, grant3: 86.17, now: 87.21, enemy: 89.21, turned: 91.73, west: 93.59, pemberton2: 94.37 };
const D = T.D;
const DV = VX.diveTimes(12.6);   // push 8.8 · full 12.05 · SW 12.6 · emerge 13.45 · land 15.95
const CUT = 54.2, DAY2 = 86.6;
const TW = (n) => VX.town(n, W);
const JKw = TW("Jackson"), CL = TW("Clinton"), MS = TW("Mississippi Springs"), RYw = TW("Raymond"), BOL = TW("Bolton"), ED = TW("Edwards");
const JK = VX.town("Jackson", J), WRIGHT = [1848.2, 711], LYNCH = [1879.5, 742.5];
const CAPITOL = [1894.45, 723.6], FACT = [1887.83, 726.81];
const r13 = VX.road(W, 13), r12 = VX.road(W, 12), r25 = VX.road(W, 25);
const jR0 = VX.road(J, 0), jR1 = VX.road(J, 1), jR2 = VX.road(J, 2);   // Clinton road, Raymond road, Canton road (north)
const U = "u", R = "r";
const BIG = { bw: 1.0, bd: 0.62 };

// ---------------- units ----------------
const units = [
  // ===== wide, in the rain (troopScale 16) =====
  // McPherson from the west on the Clinton road; Sherman from the south-west on the Mississippi Springs road
  { region: W, side: U, type: "inf", n: 3, face: "east", keys: [[0, CL[0] + 8, CL[1] + 10], [1.6, CL[0] + 8, CL[1] + 10], [DV.full, 1846, 716]] },
  { region: W, side: U, type: "inf", n: 3, face: "east", keys: [[0, MS[0] + 10, MS[1] + 10], [1.9, MS[0] + 10, MS[1] + 10], [DV.full, 1850, 754]] },
  // Johnston's force in Jackson; on "decided" the columns start north on the Canton road
  { region: W, side: R, type: "inf", n: 3, face: "west", keys: [[0, JKw[0] - 2, JKw[1] - 14]], escape: { road: r25, t0: T.decided + 0.2, v: 4.0, v2: 4.0, join: "north", fade: "north", from: 1 } },

  // ===== Jackson close (troopScale 1.3) =====
  // Colquitt at the O. P. Wright farm, across the Clinton road, facing west; falls back into the town and away north
  { region: J, side: R, type: "inf", n: 2, face: "west", keys: [[0, WRIGHT[0] + 2.4, WRIGHT[1] + 0.6], [T.fought + 1.4, WRIGHT[0] + 2.4, WRIGHT[1] + 0.6], [T.north + 0.6, 1858.4, 715.6]],
    escape: { road: [...VX.sub(jR0, 0, 40).reverse(), ...jR2.slice(1)], start: [1858.4, 715.6], t0: T.north + 0.7, v: 6.0, v2: 6.0, join: "nearest", fade: "north" }, t1: 23.0 },
  // Thompson at the Lynch Creek bridge, facing south-west; falls back and away north
  { region: J, side: R, type: "inf", n: 2, face: VX.FACE.sw, keys: [[0, LYNCH[0] + 1.4, LYNCH[1] - 1.8]],
    escape: { road: [...VX.sub(jR1, 46, VX.len(jR1)), ...jR2.slice(1)], t0: T.north + 0.2, v: 6.0, v2: 6.0, join: "nearest", fade: "north" }, t1: 23.0 },
  { region: J, side: R, type: "art", n: 1, face: VX.FACE.sw, keys: [[0, LYNCH[0] + 3.2, LYNCH[1] - 3.2]],
    escape: { road: [...VX.sub(jR1, 48, VX.len(jR1)), ...jR2.slice(1)], t0: T.north, v: 6.0, v2: 6.0, join: "nearest", fade: "north" }, t1: 23.0 },
  // the main body already marching north out of the town on the Canton road
  { region: J, side: R, type: "inf", n: 4, face: "north", keys: [[0, JK[0] - 3.0, JK[1] - 3.4]], t1: D + 1,
    escape: { road: jR2, t0: DV.SW + 0.3, v: 1.7, v2: 1.7, join: "nearest", fade: "north" } },
  // Crocker (McPherson) on the Clinton road: charges the farm, then into the town
  { region: J, side: U, type: "inf", n: 3, face: VX.FACE.east, t1: 28.8, keys: [[0, 1841.6, 707.4], [T.fought, 1841.6, 707.4], [T.north + 0.8, 1851.8, 712.6], [T.flew, 1874.0, 719.4], [28.8, 1878.0, 720.6]] },
  { region: J, side: U, type: "inf", n: 3, face: VX.FACE.east, t1: 28.8, keys: [[0, 1838.4, 700.2], [T.north + 0.2, 1838.4, 700.2], [T.flew + 0.6, 1856.0, 713.6]] },
  // Sherman (Steele, Tuttle) on the Raymond road, the battery at the bridge; then into the town; Tuttle right toward the Pearl
  { region: J, side: U, type: "inf", n: 3, face: VX.FACE.ne, t1: 28.8, keys: [[0, 1867.0, 747.0], [T.north + 0.4, 1867.0, 747.0], [T.flew, 1883.2, 735.4], [28.8, 1884.6, 733.0]] },
  { region: J, side: U, type: "inf", n: 2, face: VX.FACE.ne, t1: 28.8, keys: [[0, 1872.4, 750.6], [T.north + 0.8, 1872.4, 750.6], [T.flew + 0.4, 1893.0, 737.6]] },
  { region: J, side: U, type: "art", n: 2, face: VX.FACE.ne, t1: 28.8, keys: [[0, 1873.8, 745.2]] },

  // ===== wide at night (13 May): Johnston at Jackson, McPherson at Clinton, Sherman toward Mississippi Springs =====
  { region: W, side: R, type: "inf", n: 3, face: "west", t0: CUT, t1: DAY2 + 0.3, keys: [[0, JKw[0] - 2, JKw[1] - 14]] },
  { region: W, side: U, type: "inf", n: 3, face: "east", t0: CUT, t1: DAY2 + 0.3, keys: [[0, CL[0] + 4, CL[1] + 12]] },
  { region: W, side: U, type: "inf", n: 3, face: "east", t0: CUT, t1: DAY2 + 0.3, keys: [[0, MS[0] - 4, MS[1] + 12]] },

  // ===== wide, day: the army at Jackson / Clinton / Raymond turns west; Pemberton near Edwards =====
  { region: W, side: U, type: "inf", n: 3, face: "west", ...BIG, t0: DAY2, keys: [[0, CL[0] + 4, CL[1] + 12], [T.turned + 0.3, CL[0] + 4, CL[1] + 12], [D, CL[0] - 30, CL[1] + 2]] },
  { region: W, side: U, type: "inf", n: 3, face: "west", ...BIG, t0: DAY2, keys: [[0, JKw[0] - 22, JKw[1] + 14]] },
  { region: W, side: U, type: "inf", n: 3, face: "west", ...BIG, t0: DAY2, keys: [[0, RYw[0] + 6, RYw[1] + 14], [T.turned + 0.6, RYw[0] + 6, RYw[1] + 14], [D, RYw[0] - 22, RYw[1] + 4]] },
  { region: W, side: R, type: "inf", n: 3, face: "east", ...BIG, t0: T.enemy, keys: [[0, ED[0] + 6, ED[1] + 20]] },
];

// ---------------- arrows ----------------
const arrows = [
  // two corps converge on Jackson
  { region: W, side: U, width: 0.42, pts: VX.sub(r13, 0, 120, 6).reverse().filter((p) => p[0] < 1868 && p[0] > CL[0]), t0: T.two, dur: 2.2, t1: DV.full },
  { region: W, side: U, width: 0.42, pts: VX.sub(r12, 0, 200, 6).filter((p) => p[0] > MS[0] && p[0] < 1876), t0: T.two + 0.5, dur: 2.2, t1: DV.full },
  // the Confederates leave north
  { region: W, side: R, width: 0.38, pts: VX.sub(r25, 4, 70, 6), t0: T.decided + 0.3, dur: 1.8, t1: DV.full },
  // close: Crocker's charge, Sherman's push, the red columns north
  { region: J, side: U, width: 0.24, pts: [[1843.6, 708.4], [1847.2, 710.4], [1850.6, 712.0]], t0: T.fought - 0.1, dur: 1.4, t1: T.afternoon + 0.6 },
  { region: J, side: U, width: 0.24, pts: [[1870.0, 745.6], [1874.6, 742.2], [1878.6, 739.4]], t0: T.fought + 0.5, dur: 1.4, t1: T.afternoon + 0.6 },
  { region: J, side: R, width: 0.24, pts: VX.sub(jR2, 3, 26), t0: T.north - 0.2, dur: 1.6, t1: T.stars },
  // the order goes west (to Pemberton, far beyond Clinton)
  { region: W, color: "#C9766A", width: 0.22, pts: VX.sub(r13, 8, 160, 6), t0: T.pemberton + 0.1, dur: 1.8, t1: T.three + 1.0 },
  // McPherson sends it to Grant
  { region: W, side: U, width: 0.22, pts: [[CL[0] + 2, CL[1] + 18], [1778, 724], [MS[0] + 8, MS[1] - 4]], t0: T.sent + 0.4, dur: 1.0, t1: DAY2 },
  // day: the army turns west toward Bolton and Edwards
  { region: W, side: U, width: 0.46, pts: [[CL[0] - 6, CL[1] + 4], [1756, 684], [1724, 682], [BOL[0] + 10, BOL[1] + 2]], t0: T.turned, dur: 1.8, t1: D + 1 },
  { region: W, side: U, width: 0.46, pts: [[RYw[0] - 8, RYw[1] - 2], [1688, 744], [1660, 728], [1630, 716]], t0: T.turned + 0.35, dur: 1.8, t1: D + 1 },
  { region: W, side: U, width: 0.46, pts: [[JKw[0] - 30, JKw[1] + 4], [1846, 712], [1820, 704], [CL[0] + 16, CL[1] + 8]], t0: T.turned + 0.7, dur: 1.6, t1: D + 1 },
];

// ---------------- fx (only what the camera sees) ----------------
const SMK = (dir, rate = 1.2) => ({ dir, size: 0.95, alpha: 0.24, life: 10, muzzle: 6, windK: 0.4, rate, volley: 1.6 });
const VOL = (pts, t0, t1, dir, every = 1.5) => ({ region: J, pts, t0, t1, every, opts: SMK(dir) });
const fx = {
  fires: [{ region: J, at: [FACT[0], FACT[1], 0.1], t0: T.flames, t1: D + 1, preset: "house", opts: { size: 3.2 } },
    { region: J, at: [FACT[0] + 0.25, FACT[1] - 0.1, 0.1], t0: T.flames + 0.5, t1: D + 1, preset: "house", opts: { size: 2.2 }, cue: false }],
  volleys: [
    VOL([[1849.8, 711.2], [1850.4, 713.0]], DV.emerge, T.north + 0.4, [-1, -0.3], 1.4),     // Colquitt at the Wright farm
    VOL([[1845.0, 709.0], [1845.6, 711.0]], DV.emerge + 0.4, T.north + 0.6, [1, 0.3], 1.5),   // Crocker's line
  ],
};

// ---------------- markers: the three messengers, the workers leaving the factory ----------------
const ROUTE1 = VX.sub(r13, 6, 112, 1.0);                                              // the Clinton road west -> McPherson's lines at Clinton
const ROUTE2 = VX.sub(r12, 0, 200, 1.0).reverse().filter((p) => p[0] < 1888);          // the Raymond road south-west
const ROUTE3 = VX.sub(r25, 2, 120, 1.0);                                              // north
const L1 = VX.len(ROUTE1);
const markers = [
  { icon: "rider", region: W, path: ROUTE1, v: L1 / (T.straight + 0.6 - T.three), t0: T.three, t1: T.mcp + 1.2, size: 5.6, min: 28, max: 42, halo: true, color: "#7a3a2c", colors: [[T.union2, "#3a63b8"]] },
  { icon: "rider", region: W, path: ROUTE2, v: 5.2, t0: T.three + 0.6, t1: 73.0, size: 5.6, min: 28, max: 42, halo: true, color: "#7a3a2c" },
  { icon: "rider", region: W, path: ROUTE3, v: 5.2, t0: T.three + 1.2, t1: 73.0, size: 5.6, min: 28, max: 42, halo: true, color: "#7a3a2c" },
];
// workers leave the factory with what cloth they can carry
[[[FACT[0], FACT[1] + 0.3], [1885.6, 729.6]], [[FACT[0] + 0.2, FACT[1] + 0.2], [1890.4, 729.4]], [[FACT[0] - 0.2, FACT[1]], [1884.6, 726.2]], [[FACT[0], FACT[1] - 0.2], [1886.8, 723.8]],
  [[FACT[0] + 0.3, FACT[1]], [1891.0, 727.2]], [[FACT[0] - 0.1, FACT[1] + 0.3], [1887.0, 730.0]]]
  .forEach(([a, b], i) => markers.push({ icon: "person", region: J, path: [a, b], v: 0.55, t0: T.workers + 0.1 + i * 0.3, t1: CUT + 0.3, size: 0.32, min: 9, max: 18, color: "#6e6656", flip: false }));
const MK = VX.markers(markers);
const PU = VX.pulses([{ region: W, at: CL, t0: T.straight + 0.3, t1: T.now, r: 9, color: [60, 100, 200], period: 1.1 }]);
const RAIN = VX.rain([[0, 0.55], [T.downpour - 0.3, 0.6], [T.downpour + 0.3, 1.0], [T.north, 0.9], [T.afternoon, 0.4], [T.stars, 0]]);

// the Stars and Stripes over the capitol (DOM: a pole pinned to the ground, the flag rises on "Stars and Stripes" and waves)
const FLAG = { build: () => { const PN = document.getElementById("pins"), e = document.createElement("div");
    e.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;opacity:0;pointer-events:none;will-change:transform";
    e.innerHTML = '<div class="p" style="position:absolute;left:-1.5px;bottom:0;width:3px;height:100px;background:linear-gradient(90deg,#2a2418,#8a7a5a,#2a2418);box-shadow:0 0 2px rgba(0,0,0,.6)"></div>' +
      '<img class="f" src="engine/assets/flags/us34_flag.png" style="position:absolute;left:1.5px;bottom:0;width:60px;transform-origin:0 50%;box-shadow:0 1px 3px rgba(0,0,0,.5)">';
    PN.appendChild(e); FLAG.e = e; FLAG.p = e.querySelector(".p"); FLAG.f = e.querySelector(".f"); },
  draw: (t, ctx) => { const e = FLAG.e; if (!e) return; const cs = ctx.world.cameraAt(t);
    if (cs.region !== J || t < T.stars - 0.6 || t > CUT) { e.style.opacity = "0"; return; }
    const s = ctx.world.projectMap(CAPITOL[0], CAPITOL[1], 0); if (!s.visible) { e.style.opacity = "0"; return; }
    const H = VX.clamp(1.8 * s.ppu, 46, 120), fw = H * 0.62, up = VX.sstep(T.stars, T.flew + 0.4, t);
    e.style.transform = `translate(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px)`; e.style.opacity = VX.sstep(T.stars - 0.6, T.stars, t).toFixed(3);
    FLAG.p.style.height = H.toFixed(1) + "px"; FLAG.f.style.width = fw.toFixed(1) + "px";
    FLAG.f.style.bottom = (VX.lerp(0.05, 0.62, up) * H).toFixed(1) + "px";
    FLAG.f.style.transform = `skewY(${(3.5 * Math.sin(t * 3.1)).toFixed(2)}deg) scaleX(${(0.93 + 0.07 * Math.sin(t * 2.3 + 1)).toFixed(3)})`; } };

const LEG = { entries: [{ name: "Union", sub: "Grant", color: "#3C6E9E" }, { name: "Confederates", sub: "Johnston", color: "#9C3A35" }] };
const LEG2 = { entries: [{ name: "Union", sub: "Grant", color: "#3C6E9E" }, { name: "Confederates", sub: "Pemberton", color: "#9C3A35" }] };
const DATE = (day, dn, note) => ({ month: "May 1863", day: String(day), weekday: "Day " + dn, note });

window.SEQ = {
  name: "S08", D, T, seed: 1508, date: "1863-05-14",
  regions: [W, J],
  regionOpts: { [W]: { troopScale: 11 }, [J]: { troopScale: 2.4 } },
  keys: [
    // wide, rain
    { t: 0, region: W, at: [1828, 724], dist: 255, tilt: 46, yaw: -4, fov: 30 },
    { t: 7.4, region: W, at: [1842, 722], dist: 240, tilt: 46, yaw: -3, fov: 30 },
    // (dive 8.8 -> 15.95) close: the rearguard fight, then the town and the flag
    { t: 17.0, region: J, at: [1851.0, 712.6], dist: 36, tilt: 50, yaw: -10, fov: 30 },
    { t: 21.6, region: J, at: [1889.4, 723.4], dist: 30, tilt: 52, yaw: -4, fov: 30 },
    { t: 23.2, region: J, at: [1890.4, 723.6], dist: 28, tilt: 52, yaw: -2, fov: 30, night: 0 },
    { t: 24.0, region: J, at: [1890.6, 723.7], dist: 27.6, tilt: 52, yaw: -1.6, fov: 30, night: 1, ease: "lin" },
    { t: 28.6, region: J, at: [1890.0, 724.6], dist: 24, tilt: 53, yaw: 1, fov: 30, night: 1, ease: "lin" },
    { t: 29.4, region: J, at: [1889.8, 724.9], dist: 23, tilt: 53, yaw: 1.4, fov: 30, night: 0, ease: "lin" },
    // the factory
    { t: 33.0, region: J, at: [1888.0, 726.8], dist: 9, tilt: 55, yaw: 3, fov: 30 },
    { t: 44.0, region: J, at: [1887.9, 727.0], dist: 8.4, tilt: 56, yaw: 12, fov: 30, ease: "lin" },
    { t: 51.4, region: J, at: [1887.8, 727.2], dist: 9.2, tilt: 55, yaw: 16, fov: 30, ease: "lin" },
    { t: CUT, region: J, at: [1887.8, 727.0], dist: 11, tilt: 54, yaw: 18, fov: 30, ease: "lin" },
    // cut: wide, the night before (13 May): the messengers
    { t: CUT, region: W, at: [1846, 712], dist: 190, tilt: 48, yaw: -3, fov: 30, ease: "cut" },
    { t: 58.8, region: W, at: [1844, 712], dist: 182, tilt: 48, yaw: -2, fov: 30, night: 0 },
    { t: 59.7, region: W, at: [1843.6, 712], dist: 180, tilt: 48, yaw: -1.9, fov: 30, night: 1, ease: "lin" },
    { t: 71.2, region: W, at: [1836, 710], dist: 176, tilt: 48, yaw: -1, fov: 30, night: 1 },
    { t: 81.0, region: W, at: [1812, 703], dist: 138, tilt: 50, yaw: -1, fov: 30, night: 1 },
    { t: DAY2, region: W, at: [1798, 704], dist: 150, tilt: 50, yaw: 0, fov: 30, night: 1 },
    { t: DAY2 + 0.8, region: W, at: [1794, 704], dist: 165, tilt: 50, yaw: 0, fov: 30, night: 0, ease: "lin" },
    // day: the army turns west toward Bolton and Edwards
    { t: 89.8, region: W, at: [1728, 708], dist: 330, tilt: 46, yaw: -1, fov: 30 },
    { t: D, region: W, at: [1712, 708], dist: 352, tilt: 46, yaw: -1, fov: 30, ease: "lin" },
  ],
  dives: [{ t: DV.SW, over: [1868, 722],
    from: { region: W, at: [1852, 722], dist: 230, tilt: 45, yaw: -3 },
    to: { region: J, at: [1849.6, 712.0], dist: 38, tilt: 48, yaw: -12, fov: 32 } }],
  clouds: {
    [W]: { scatter: { box: [1640, 600, 360, 220], n: 7, med: 24, seed: 8 },
      keepClear: [[1840, 718, 60, 0.8, 1], [1800, 700, 40, 0.8, 1], [1680, 710, 60, 0.8, 1]], bounds: [1560, 560, 2080, 900], nightErode: 0.4 },
    [J]: { shadows: true },
  },
  units, arrows, fx,
  banners: [
    { general: "grant", region: J, keys: [[0, 1886.2, 728.8]], t0: T.grantSherman + 0.1, t1: CUT + 1 },
    { general: "grant", region: W, keys: [[0, MS[0] + 6, MS[1] - 8]], t0: T.grant3, t1: DAY2 + 0.3 },
    { general: "grant", region: W, keys: [[0, CL[0] - 6, CL[1] - 10]], t0: T.now + 0.4, t1: D + 1 },
    { general: "pemberton", region: W, keys: [[0, ED[0] - 6, ED[1] + 6]], t0: T.pemberton2 + 0.05, t1: D + 1 },
  ],
  labels: [
    { text: "Jackson", town: "Jackson", region: W, size: 24, t0: T.jackson, t1: DV.full - 0.3 },
    { text: "Clinton", town: "Clinton", region: W, size: 18, t0: 2.2, t1: 8.4 },
    { text: "Mississippi Springs", town: "Mississippi Springs", region: W, size: 17, t0: 2.6, t1: 8.4 },
    { text: "O. P. Wright farm", at: [WRIGHT[0], WRIGHT[1] - 1.6], region: J, size: 17, t0: DV.emerge + 0.4, t1: T.north },
    { text: "Pearl River", at: [1909.0, 712.0], region: J, size: 17, river: true, t0: T.afternoon, t1: 21.0 },
    { text: "Jackson", town: "Jackson", region: W, size: 24, t0: CUT + 0.4, t1: 66.0 },
    { text: "Clinton", town: "Clinton", region: W, size: 20, t0: 72.0, t1: DAY2 },
    { text: "Bolton", town: "Bolton", region: W, size: 18, t0: T.turned + 0.6, t1: D + 1 },
    { text: "Edwards", town: "Edwards", region: W, size: 20, t0: T.enemy + 0.2, t1: D + 1 },
    { text: "Jackson", town: "Jackson", region: W, size: 20, t0: DAY2 + 0.4, t1: D + 1 },
  ],
  generals: {},
  overlay: [
    ["plaque.date", T.fourteenth, DATE(14, 15, "Thursday · rain in torrents")],
    ["legend", 1.2, T.decided, LEG],
    ["medallion", { kind: "card", general: "johnston", sub: "arrived the night before", world: [JKw[0] - 2, JKw[1] - 14], offset: [-380, -200], tIn: T.johnston + 0.05, tOut: T.held + 0.2 }],
    ["label", T.held - 0.6, DV.full - 0.2, { name: "Cannot be held", sub: "Johnston orders the city evacuated", world: [JKw[0] + 10, JKw[1] - 22], side: "cs", marker: false }],
    // Jackson close
    ["legend", DV.emerge + 0.6, T.grantSherman - 0.2, LEG],
    ["label", DV.land - 0.2, T.north + 0.4, { name: "The rearguard", sub: "a thin line on the two roads", world: [1853.0, 708.0], side: "cs", marker: false }],
    ["label", T.north, T.afternoon + 0.6, { name: "Away north", sub: "the rest of the garrison leaves", world: [1896.0, 708.0], side: "cs", marker: false }],
    ["plaque.date", T.afternoon, DATE(14, 15, "Thursday · afternoon, the rain stops")],
    ["label", T.capital - 0.2, T.grant - 0.1, { name: "The capitol", sub: "the Stars and Stripes over Mississippi", world: [CAPITOL[0], CAPITOL[1] + 1.6], side: "us", marker: false }],
    ["plaque.date", T.thatNight + 0.2, DATE(14, 15, "Thursday · night")],
    ["label", T.room - 0.2, 28.8, { name: "Grant's bed", sub: "in the room Johnston was said to have used", world: [1890.4, 724.6], side: "us", marker: false }],
    ["plaque.date", T.before, DATE(14, 15, "Thursday · before they left")],
    ["medallion", { kind: "card", general: "sherman", sub: "with Grant in the factory", screen: [1640, 300], tIn: T.grantSherman + 0.2, tOut: T.watched - 0.4 }],
    ["label", T.factory, T.battle + 0.8, { name: "Cotton factory", sub: "still working", world: [FACT[0], FACT[1]], side: "cs" }],
    ["quote", T.watched - 0.1, T.bolt + 0.8, { en: "We looked on for a while to see the tent cloth which they were making roll out of the looms, with ‘C. S. A.’ woven in each bolt.", attr: "Ulysses S. Grant · Personal Memoirs", y: 640 }],
    ["plaque.date", T.work, DATE(14, 15, "Thursday · “done work enough”")],
    ["label", T.workers + 0.1, T.carry + 0.6, { name: "Sent home", sub: "with what cloth they could carry", world: [1886.0, 730.4], side: "us", marker: false }],
    ["plaque.date", T.flames, DATE(14, 15, "Thursday · the factory burns")],
    // the night before
    ["plaque.date", CUT + 0.1, DATE(14, 15, "Thursday · Jackson")],
    ["plaque.date", T.nightBefore + 0.1, DATE(13, 14, "Wednesday · the night before")],
    ["legend", CUT + 0.3, T.come - 0.4, LEG],
    ["label", T.pemberton + 0.2, T.three - 0.1, { name: "An order to Pemberton", sub: "Johnston's dispatch", world: [JKw[0] + 2, JKw[1] - 22], side: "cs", marker: false }],
    ["label", T.three + 0.1, T.come - 0.3, { name: "Three messengers", sub: "three copies", world: [1862, 735], side: "cs", marker: false }],
    ["letter", T.come - 0.05, 71.3, { header: "13 May 1863 · Jackson", title: "Johnston to Pemberton", sub: "sent in three copies", cps: 24, top: 800,
      quote: "If practicable, come up in his rear at once. … Time is all-important." }],
    ["legend", 71.8, DAY2, LEG],
    ["label", T.union2, T.months + 0.6, { name: "A Union man", sub: "one of the three messengers", world: (t) => [...VX.along(ROUTE1, Math.min(L1, (t - T.three) * markers[0].v)), 0], side: "us", marker: false, offset: [-150, 40] }],
    ["label", T.memphis - 0.1, T.act - 0.2, { name: "Thrown out of Memphis", sub: "with great public fuss · for disloyal talk", world: (t) => [...VX.along(ROUTE1, Math.min(L1, (t - T.three) * markers[0].v)), 0], side: "cs", marker: false, offset: [-160, 40] }],
    ["plaque.date", T.act, DATE(13, 14, "Wednesday · it was an act")],
    ["medallion", { kind: "card", general: "mcpherson", sub: "XVII Corps · at Clinton", world: [CL[0] + 4, CL[1] + 12], offset: [160, -230], tIn: T.mcp + 0.05, tOut: T.now - 0.2 }],
    // day: the army turns west
    ["plaque.date", DAY2 + 0.4, DATE(14, 15, "Thursday · the army turns west")],
    ["legend", DAY2 + 0.6, D + 1, LEG2],
    ["label", T.enemy + 0.1, T.turned - 0.1, { name: "Pemberton's army", sub: "near Edwards", world: [ED[0] + 6, ED[1] + 34], side: "cs", marker: false }],
    ["label", T.west - 0.2, D + 1, { name: "West", sub: "to meet Pemberton", world: [1690, 700], side: "us", marker: false }],
  ],
  build: async (ctx) => { MK.build(ctx); PU.build(ctx); RAIN.build(ctx); FLAG.build(ctx); },
  draw: (t, ctx) => { MK.draw(t, ctx); PU.draw(t, ctx); RAIN.draw(t, ctx); FLAG.draw(t, ctx); },
};
})();
