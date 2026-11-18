// S01 cold open (55.32 s). Wide altitude over the bend -> ONE continuous push-in onto Vicksburg (lands on "Vicksburg" 7.74) -> the camera
// settles, the 3D gold title "5 BATTLES · 18 DAYS" lands on "eighteen days" (9.80) and stays readable through "five battles" (13.3) ->
// the cloud dive (push 14.7, swap 18.5) -> emergence over the river at the city, the bluff batteries fire on "guns" -> the river pulses red on
// "closed" -> failed attempts (arrows stopped short) -> cut (new paragraph) to the wide montage: crossing, march inland, the red split, the Big
// Black bridge burning, the march back west, ~29,500 marched out, white flags -> pull back, the river glows blue from Vicksburg south.
// No Grant name or portrait in S01. Times = local scene time (tools/scene_times.py S01 --words).
(() => {
const T = { D: 55.32, spring: 0.72, union: 4.56, miss: 5.42, vicksburg: 7.74, eighteen: 9.80, days: 10.02, army: 11.26, five: 12.44, battles: 12.88,
  reach: 13.58, supply: 14.92, marching: 16.94, armies: 18.66, guns: 20.36, bluffs: 21.66, river: 22.48, held: 23.24, miss2: 24.62, closed: 25.44,
  north: 26.20, confed: 27.30, piece: 28.72, every: 30.26, failed: 32.54, then: 33.84, crossed: 34.78, below: 35.68, city: 36.22, turned: 37.06,
  vb2: 38.14, marched: 39.12, inland: 39.50, nine: 40.88, weeks: 41.26, crossing: 42.18, nearly: 43.46, thirty: 43.93, confed2: 44.70,
  out: 45.90, vb3: 46.88, stacked: 47.52, arms: 48.12, story: 49.50, campaign: 50.70, split: 51.68, two: 53.14 };
const WIDE = "wide", VB = "vicksburg";
const DV = VX.diveTimes(18.5);          // push 14.7, deckIn 16.8, full 17.95, SW 18.5, emerge 19.35, clear 19.65, land 21.85
const CUT = 33.62;                       // paragraph change: cut back to the wide map for the montage
const hsh = VX.hsh, lerp = VX.lerp, sstep = VX.sstep;
const P = (n) => VX.place(n), TW = (n) => VX.town(n, WIDE);
const VBG = TW("Vicksburg");             // (1383.1, 678.9)
const BAT = VX.region(VB).features.batteries;   // 12 river batteries along the bluff, north -> south
const RIVC = VX.river(VB, 0).pts;        // close Mississippi (from the west loop, up the hairpin, south along the city front)
const RIVW = VX.river(WIDE, 0).pts;
const rAtY = (y) => VX.riverAtY(VB, 0, y);   // nearest vertex in map-y (the city front runs north-south; ok for y >= 660)
const frontAt = (y) => { let b = null; for (const p of RIVC) if (p[0] > 1360 && (!b || Math.abs(p[1] - y) < Math.abs(b[1] - y))) b = p; return b; };   // the city front only

// ---------------- world handle for custom sprites (set in build) ----------------
let WW = null;
const waterY = (r, wl) => wl * WW.regions[r].ys + 0.05;

// ---------------- units ----------------
const units = [
  // wide: the Vicksburg garrison (on screen from the first frame), stacks arms on "stacked"
  { region: WIDE, side: "r", type: "inf", n: 4, face: "east", keys: [[0, 1398, 684], [T.out, 1398, 684], [T.stacked - 0.2, 1406, 684]], cap: T.stacked, capN: 4 },
  // wide: Union boxes above the city (Milliken's Bend / Young's Point) on "Union"
  { region: WIDE, side: "u", type: "inf", n: 3, face: "south", t0: T.union, t1: CUT - 0.3, keys: [[0, 1226, 600]] },
  { region: WIDE, side: "u", type: "inf", n: 3, face: "south", t0: T.union + 0.25, t1: CUT - 0.3, keys: [[0, 1290, 640]] },
];
// close: guns on the bluff batteries (Style W gun boxes), garrison in the town behind
BAT.forEach((b, i) => { if (i < 1 || i > 10) return; units.push({ region: VB, side: "r", type: "art", n: 2, face: "west", keys: [[0, b.x + 0.6, b.z]] }); });
[[1389.5, 676.5], [1388.0, 686.5], [1384.5, 697.0]].forEach(([x, y]) => units.push({ region: VB, side: "r", type: "inf", n: 3, face: "west", keys: [[0, x, y]] }));

// ---------------- the montage route (wide) ----------------
const XING = [[1149, 1004], [1163, 1016], [1179, 1027]];   // Louisiana shore -> Bruinsburg, below the city
const INLAND = [TW("Bruinsburg"), [1250, 1028], TW("Port Gibson"), TW("Willow Springs"), TW("Rocky Springs"), [1500, 897], TW("Utica"), [1650, 820], TW("Raymond"), [1800, 735], TW("Jackson")];
const BACK = [TW("Jackson"), TW("Clinton"), TW("Bolton"), [1630, 694], TW("Edwards"), [1540, 688], [1512.4, 683.6], [1470, 682], [1436, 686]];
const ROUTE = [XING[0], ...XING.slice(1), ...INLAND.slice(1), ...BACK.slice(1)];
const tMarch0 = T.crossed + 0.2, tMarch1 = 43.6;
const kMarch = VX.march(ROUTE, tMarch0, VX.len(ROUTE) / (tMarch1 - tMarch0), { step: 6 });
units.push({ region: WIDE, side: "u", type: "inf", n: 3, t0: T.crossed, keys: kMarch, face: "east" });
// Johnston's force at Jackson pushed off north-east; Pemberton's field army at Edwards pushed back west into the city (the split)
units.push({ region: WIDE, side: "r", type: "inf", n: 3, face: "south", t0: CUT, t1: 41.9, keys: [[CUT, 1893, 716], [39.0, 1893, 716], [41.9, 1945, 640]] });
units.push({ region: WIDE, side: "r", type: "inf", n: 4, face: "east", t0: CUT, keys: [[CUT, 1588, 706], [40.2, 1588, 706], [42.6, 1500, 690], [44.4, 1408, 690]], t1: 45.0 });
// the siege ring closes
[[1420, 656], [1428, 714]].forEach(([x, y], i) => units.push({ region: WIDE, side: "u", type: "inf", n: 3, face: "west", t0: 43.4 + i * 0.3, keys: [[0, x + 12, y], [44.6 + i * 0.3, x, y]] }));

// ---------------- arrows ----------------
const ACLOSE = [
  // "Every Union attempt ... had failed": three blue thrusts that stop short of the city and fade
  { region: VB, side: "u", pts: [[1404, 657], [1399, 662], [1394.5, 667]], t0: T.every, dur: 1.1, t1: T.failed + 0.6, width: 1.1 },
  { region: VB, side: "u", pts: VX.sub(VX.river(VB, 2).pts.map((p) => [p[0], p[1] - 1.5]), 0, 22, 2), t0: T.every + 0.7, dur: 1.2, t1: T.failed + 0.7, width: 1.1 },
  { region: VB, side: "u", pts: [[1352, 694], [1360, 684], [1366, 677]], t0: 31.2, dur: 1.0, t1: T.failed + 0.8, width: 1.1 },
];
const arrows = [
  ...ACLOSE,
  { region: WIDE, side: "u", pts: XING, t0: T.crossed, dur: 1.0, t1: T.D + 1, width: 0.42 },
  { region: WIDE, side: "u", pts: INLAND, t0: T.turned, dur: 2.7, t1: T.D + 1, width: 0.42 },
  { region: WIDE, side: "u", pts: BACK, t0: T.inland + 0.5, dur: 3.0, t1: T.D + 1, width: 0.42 },
  { region: WIDE, side: "r", pts: [[1900, 708], [1918, 680], [1940, 650]], t0: 39.2, dur: 1.4, t1: 44.5 },   // Johnston driven off
  { region: WIDE, side: "r", pts: [[1575, 704], [1540, 698], [1505, 692]], t0: 40.4, dur: 1.4, t1: 44.5 },   // Pemberton driven back
];

// ---------------- fx ----------------
const shotTimes = [20.42, 20.86, 21.3, 21.66, 22.12, 22.5, 23.0, 23.6, 24.3, 25.2, 26.4, 27.8];
const shotBat = [5, 6, 4, 7, 3, 8, 5, 6, 4, 7, 2, 8];
const fx = {
  fires: [
    { region: WIDE, at: [1512.4, 683.6, 0.6], t0: 41.3, t1: T.D + 1, preset: "column", opts: { size: 9, smokeRate: 5, smokeS0: 0.5, smokeGrow: 1.2 } },   // the Big Black bridge burning as the march goes past
  ],
  guns: [
    { region: VB, preset: "battery", h: 0.25, boom: false, opts: { dir: [-1, 0.08], size: 2.2, alpha: 0.24, flash: 2.2 },
      shots: shotTimes.map((t, i) => { const b = BAT[shotBat[i]], r = frontAt(b.z + 1.5 + (i % 3)); return { t, at: [b.x, b.z], dir: [-1, 0.06 * ((i % 3) - 1)],
        impact: [r[0] - 1.2 - (i % 4) * 0.6, r[1], 0.05], delay: 0.8 }; }), impactOpts: { size: 0.7 } },
  ],
  _custom: [
    // "the Mississippi was closed": a red pulse running down the river from the city front (close)
    { region: VB, fn: (t, push) => { if (!WW || t < T.closed - 0.2 || t > CUT) return; const e = sstep(T.closed - 0.2, T.closed + 0.6, t) * (1 - sstep(31.5, 32.6, t));
      for (const p of RIVC) { if (p[0] < 1362 || p[1] < 664) continue; const s = (p[1] - 664) / 53, ph = (t - T.closed) * 1.3 - s * 1.6, pulse = 0.55 + 0.45 * Math.cos(ph * 6.283);
push(p[0], waterY(VB, p[2]), p[1], 9, 0.12 * e * pulse * sstep(-0.05, 0.25, (t - T.closed) * 0.9 - s), 1.0, 0.12, 0.06); } } },
    // the end: the river glows blue from Vicksburg south (the river opened)
    { region: WIDE, fn: (t, push) => { if (!WW || t < T.campaign - 0.5) return; const k = sstep(T.campaign - 0.5, T.two, t);
      for (let i = 0; i < RIVW.length; i += 6) { const p = RIVW[i]; if (p[1] < 676 || p[1] > 1110) continue; const s = (p[1] - 676) / 434; if (s > k * 1.05) continue;
        const a = 0.22 * sstep(s, s + 0.06, k * 1.05) * (0.8 + 0.2 * Math.sin(t * 2.1 + p[1] * 0.05)); push(p[0], waterY(WIDE, p[2]) + 0.3, p[1], 16, a * 2.2, 0.35, 0.7, 1.5); } } },
  ],
};

// ---------------- white flags over the city (wide map, on "stacked their arms") ----------------
const FLAGS = [[1386, 676], [1393, 690], [1381, 688]];
const build = async (ctx) => { WW = ctx.world; const { THREE, world } = ctx, sc = world.regions[WIDE].scene;
  for (const c of fx._custom) ctx.FX[c.region].custom(c.fn);   // (fx.custom is not in the engine's grouped fx kinds: added here)
  const poleM = new THREE.MeshLambertMaterial({ color: 0x3a3026 }), clothM = new THREE.MeshLambertMaterial({ color: 0xf4f1e6, side: THREE.DoubleSide, emissive: 0x403c34 });
  ctx._flags = FLAGS.map(([x, y], i) => { const g = new THREE.Group(), h0 = world.heightAt(x, y, WIDE), H = 13;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, H, 6), poleM); pole.position.y = H / 2; g.add(pole);
    const cloth = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 5, 6, 1), clothM); cloth.position.set(3.75, H - 2.6, 0); g.add(cloth);
    g.position.set(x, h0, y); g.rotation.y = 0.5 + i * 0.4; g.visible = false; sc.add(g); return { g, cloth, i }; });
  // set BEFORE the frame renders (S.draw runs after the render): an fx custom emitter of the wide region is updated in beforeRender
  ctx.FX[WIDE].custom((t) => { for (const f of ctx._flags) { const t0 = T.stacked + 0.1 + f.i * 0.25, k = sstep(t0, t0 + 0.5, t);
    f.g.visible = k > 0.01; f.g.scale.set(1, Math.max(0.01, k), 1); f.cloth.rotation.y = 0.18 * Math.sin(t * 2.6 + f.i); } }); };

window.SEQ = {
  name: "S01", D: T.D, T, seed: 1863, date: "1863-04-01",
  regions: [WIDE, VB],
  keys: [
    // ONE continuous push-in from altitude down the river onto the city (lands on "Vicksburg")
    { t: 0.0, region: WIDE, at: [1410, 738], dist: 640, tilt: 33, yaw: 2, fov: 30 },
    { t: 3.6, region: WIDE, at: [1378, 712], dist: 560, tilt: 40, yaw: 0, fov: 30, ease: "in" },
    { t: 8.1, region: WIDE, at: [1394, 690], dist: 300, tilt: 47, yaw: -6, fov: 30, ease: "out" },
    { t: 12.5, region: WIDE, at: [1398, 690], dist: 276, tilt: 48, yaw: -8, fov: 30, ease: "lin" },
    // the emergence (dive) lands at 21.85; the city front, guns on the bluff
    { t: 27.0, region: VB, at: [1379.0, 687.0], dist: 40, tilt: 53, yaw: -60, fov: 32 },
    { t: 30.6, region: VB, at: [1367.0, 690.0], dist: 78, tilt: 34, yaw: -24, fov: 32 },
    { t: CUT, region: VB, at: [1366.0, 690.0], dist: 81, tilt: 34, yaw: -21, fov: 32 },
    // montage on the wide map
    { t: CUT, region: WIDE, at: [1236, 990], dist: 330, tilt: 44, yaw: 0, fov: 30, ease: "cut" },
    { t: 36.6, region: WIDE, at: [1268, 975], dist: 360, tilt: 44, yaw: 0, fov: 30 },
    { t: 40.0, region: WIDE, at: [1650, 820], dist: 700, tilt: 44, yaw: 0, fov: 30 },
    { t: 43.4, region: WIDE, at: [1470, 715], dist: 470, tilt: 46, yaw: -2, fov: 30 },
    { t: 48.6, region: WIDE, at: [1402, 692], dist: 250, tilt: 48, yaw: -4, fov: 30 },
    // pull back over the whole valley
    { t: T.D, region: WIDE, at: [1400, 800], dist: 720, tilt: 37, yaw: 2, fov: 30 },
  ],
  dives: [{ t: DV.SW, over: [1392, 690],
    from: { region: WIDE, at: [1399, 690], dist: 262, tilt: 48, yaw: -9 },
    to: { region: VB, at: [1381.0, 685.0], dist: 42, tilt: 52, yaw: -62, fov: 32 },
    keys: { deck: { yaw: -30 }, swFrom: { yaw: -40 }, swTo: { yaw: -48 }, emerge: { yaw: -56, at: [1376, 684] } } }],
  clouds: {
    [WIDE]: { keepClear: [[1392, 688, 70, 0.9, 0.8], [1240, 1000, 60, 1, 0.6], [1520, 690, 50, 1, 0.6], [1890, 724, 50, 1, 0.6], [1450, 905, 70, 1, 0.7], [1640, 810, 70, 1, 0.7], [1610, 700, 50, 1, 0.6]] },
    [VB]: { shadows: true },
  },
  title: { text: "5 BATTLES · 18 DAYS", font: "cinzel-latin-700-normal.woff2", width: 0.56, tOn: T.eighteen, tGrow: T.days + 0.4, anchorT: 11.0, region: WIDE },
  units, arrows,
  labels: [
    { text: "Mississippi River", at: [1300, 645], size: 20, t0: T.miss, t1: T.miss + 3.6, region: WIDE, river: true },
    { text: "Vicksburg", town: "Vicksburg", size: 28, t0: T.vicksburg, t1: DV.full - 0.3, region: WIDE },
    { text: "Mississippi River", at: [1369.5, 699], size: 18, t0: T.miss2, t1: T.miss2 + 3.6, region: VB, river: true },
    { text: "Vicksburg", town: "Vicksburg", size: 24, t0: T.vb2, t1: T.vb2 + 3.4, region: WIDE },
    { text: "Vicksburg", town: "Vicksburg", size: 24, t0: T.vb3, t1: T.vb3 + 3.5, region: WIDE },
  ],
  boats: [{ region: WIDE, kind: ["gunboat", "steamer", "steamer"], n: 3, path: VX.sub(RIVW.filter((p) => p[1] < 650 && p[1] > 560).map((p) => [p[0], p[1]]), 0, 60, 2), speed: 1.2, spacing: 6, t0: T.union, t1: DV.deckIn, lamp: false }],
  fx, build,
  overlay: [
    ["plaque.date", T.spring + 0.1, { month: "Spring 1863", day: "", weekday: "", note: "the Mississippi valley" }],
    ["plaque.hide", DV.push + 0.4],
    ["plaque.date", CUT + 0.3, { month: "Spring 1863", day: "", weekday: "", note: "the Mississippi valley" }],
    ["number", T.thirty, T.stacked - 0.2, { value: 29500, round: 500, world: [1398, 662], size: 96 }],
    ["plaque.hide", T.story],
  ],
  grade: {},
};
})();
