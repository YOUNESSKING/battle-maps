// S03 MOVE 1: HORSESHOE BEND (27 March 1814). D = 177.69 s (ajackson/tools/scene_times.py S03). Regions: gulf (z8), horseshoe (z11).
// Cloud dive 2 (gulf -> the bend) at the start; the plan (wall across the neck, canoes behind the town), Jackson arrives from the north,
// the twist (Coffee + the Cherokee / Lower Creek allies ring the far bank), two guns on the wall, the Cherokee take the canoes and fire
// the town, the charge over the wall, the Red Sticks driven back to the river; result ledger over a dimmed still map; the Treaty of
// Fort Jackson on the gulf map (cession hatched), method card line 1, Jackson to Mobile, the British coming, subscribe bridge.
// Facts: ajackson/research/FACT_NOTES_horseshoe.md (C. 17-26). Respect (SCENES.md): no fire on fleeing people, no lingering, no celebration.
(() => {
const T = { D: 177.69, plan: 0.48, river: 2.72, town: 3.58, fourth: 5.84, neck: 6.90, wall: 8.74, logs: 9.22, holes: 15.10, canoes: 17.04,
  words: 21.02, zigzag: 25.22, crossfire: 25.98, fall: 28.24, slip: 30.28, canoes2: 32.24, d27: 34.17, jackson: 37.00, men: 39.16, cherokee: 41.58,
  allies: 44.02, but: 45.26, wall2: 47.28, instead: 48.20, door: 50.00, coffee: 52.42, across: 55.86, bank: 57.68, bend: 58.94,
  then: 60.18, half: 60.70, cannon: 63.70, fire: 64.08, hours: 66.54, pounded: 67.20, held: 68.72, farbank: 70.52, cherokee2: 71.10,
  swam: 73.58, took: 75.52, canoesT: 76.50, paddled: 77.38, crossed: 79.24, force: 79.86, landed: 80.84, set: 82.30, fireT: 82.74,
  saw: 84.36, smoke: 84.92, charge: 87.56, thirty9: 89.25, over: 91.46, first: 91.72, major: 92.88, shot: 93.54, parapet: 94.68,
  houston: 97.06, arrow: 98.34, kept: 99.68, fought: 101.70, afternoon: 102.66, surrender: 107.04, ran: 108.48, rivr: 109.10, coffees: 109.83,
  eight: 113.15, killed: 115.12, thousand: 116.60, women: 118.82, prisoner: 120.70, army: 122.66, fortynine: 123.65, cherokee3: 125.82,
  broke: 127.38, summer: 130.22, treaty: 131.04, forced: 133.28, acres: 136.70, half2: 138.18, beside: 141.80,
  method: 144.60, before: 145.46, close: 147.26, door2: 148.08, made: 149.84, majorgen: 150.28, gulf: 154.72, coast: 155.02, autumn: 156.58,
  british: 158.72, coming: 159.26, beginning: 162.02, nine: 166.90, city: 168.22, subscribing: 171.58, next: 173.44, heres: 174.62 };
const HS = "horseshoe", GF = "gulf";
const lerp2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
// the log wall across the neck (world works[0]): W0 west bank -> W1 east bank; N = unit normal pointing NORTH (Jackson's side)
const WK = VX.work(HS, 0), W0 = [WK[0][0], WK[0][1]], W1 = [WK[WK.length - 1][0], WK[WK.length - 1][1]];
const WU = (() => { const d = [W1[0] - W0[0], W1[1] - W0[1]], l = Math.hypot(...d); return [d[0] / l, d[1] / l]; })(), N = [WU[1], -WU[0]];
const wall = (k, d = 0) => { const p = lerp2(W0, W1, k); return [p[0] + N[0] * d, p[1] + N[1] * d]; };
const FN = Math.atan2(N[1], N[0]), FS = FN + Math.PI;            // facing north (Red Sticks at the wall) / south (Jackson's lines)
const fc = (from, to) => Math.atan2(to[1] - from[1], to[0] - from[0]);
const TOWN = VX.town("Tohopeka", HS), GUNHILL = VX.place("Gun Hill", HS);
const OV = VX.place("Horseshoe Bend (Tohopeka", GF);              // the bend on the zoom-8 gulf map
const CANOE_BANK = [[8697.2, 1289.05], [8698.4, 1289.2], [8699.6, 1289.2], [8700.8, 1289.0]];   // inner bank of the toe, behind the town
const SWIM = [8699.3, 1292.2];                                    // the south (far) bank opposite the toe

// ---------------- units ----------------
const units = [];
// the Red Stick warriors behind the wall (about 1,000): four lines facing north; at the charge they about-face and fall back toward the toe
const RS = [0.14, 0.38, 0.62, 0.86].map((k, i) => ({ side: "r", type: "inf", n: 2, face: FN, arrive: false, t0: 7.0, t1: 113.6,
  keys: [[0, ...wall(k, -0.75)], [[90.6, 89.4, 89.6, 90.4][i], ...wall(k, -0.75)], [100.5 + i * 0.4, ...[[8700.0, 1283.6], [8702.2, 1284.3], [8705.2, 1284.0], [8706.0, 1282.1]][i]],
         [110.6 + i * 0.3, ...[[8697.9, 1285.6], [8699.9, 1286.4], [8703.4, 1286.0], [8705.0, 1284.7]][i]]] }));
units.push(...RS);
// Jackson's lines (about 2,000 foot: the 39th US Infantry in the centre, Tennessee militia either side) walk in from Cotton Patch Hill,
// halt ~300 yards north of the wall, charge at the drum (87.6), the 39th over first (91.5), then all across, on into the bend
const JL = [0.2, 0.5, 0.8].map((k, i) => { const halt = wall(k, 5.0), atWall = wall(k, 0.95), over = wall(k, -1.6), deep = [[over[0], 1281.2], [over[0], 1281.4], [over[0] - 0.5, 1280.3]][i];
  const tw = i === 1 ? 90.4 : 91.2, to = i === 1 ? 93.0 : 95.6 + (i === 0 ? 0 : 0.5);
  return { side: "u", type: "inf", n: 2, face: FS, arrive: false, t0: 35.4,
    keys: [[35.4, halt[0], halt[1] - 5.2], [40.8 + i * 0.3, ...halt], [T.charge, ...halt], [tw, ...atWall], [to, ...over], [104.5 + i * 0.5, ...deep], [111.2, deep[0], deep[1] + 0.8]] }; });
units.push(...JL);
// two guns (a 6-pounder and a 3-pounder) on Gun Hill, ~80-250 yards from the wall, in the gaps between the lines
const G1 = wall(0.35, 1.5), G2 = wall(0.65, 1.5);
[G1, G2].forEach((g, i) => units.push({ side: "u", type: "art", n: 1, face: FS, arrive: false, t0: 36.2, keys: [[36.2, g[0], g[1] - 4.2], [41.6 + i * 0.4, ...g]] }));
// Coffee's mounted brigade (~700) and the Cherokee / Lower Creek allies (~600): with the army at 41.6, then off west (fade at the frame
// edge) at the twist, then on the far bank all round the bend (they crossed two miles below; shown by the wide arrow)
const AL0 = [[8697.2, 1268.2], [8700.4, 1266.8]];
AL0.forEach((p, i) => units.push({ side: "u", type: i ? "cav" : "inf", n: 2, face: FS, arrive: false, t0: T.cherokee, t1: 54.6,
  keys: [[T.cherokee, ...p], [50.4, ...p], [54.6, p[0] - 4.0, p[1]]] }));
const FAR = [   // [position, facing (toward the bend), type, t0]
  [[8693.9, 1274.6], fc([8693.9, 1274.6], [8699, 1274.6]), "cav", 55.2],
  [[8691.6, 1283.4], fc([8691.6, 1283.4], [8697, 1283.4]), "inf", 55.6],
  [[8694.4, 1291.6], fc([8694.4, 1291.6], [8698, 1288]), "cav", 56.0],
  [[8699.3, 1293.3], fc([8699.3, 1293.3], [8699.3, 1288]), "inf", 56.3],
  [[8706.6, 1290.0], fc([8706.6, 1290.0], [8702.6, 1286]), "cav", 56.7],
  [[8711.0, 1284.2], fc([8711.0, 1284.2], [8706, 1284.2]), "inf", 57.0],
];
FAR.forEach(([p, f, ty, t0]) => units.push({ side: "u", type: ty, n: 2, face: f, arrive: false, t0, keys: [[t0, ...p]] }));
// the Cherokee who crossed in force: landed behind the town (80.8), on into the bend
units.push({ side: "u", type: "inf", n: 2, face: -Math.PI / 2, arrive: false, t0: 80.7, keys: [[80.7, 8701.6, 1288.5], [83.2, 8701.6, 1287.6]] });

// ---------------- arrows ----------------
const arrows = [
  // "a zigzag of crossfire": short red lines crossing in front of the wall
  ...[[0.12, 0.58], [0.88, 0.42], [0.38, 0.86], [0.62, 0.14]].map(([a, b], i) => ({ side: "r", width: 0.12, pts: [wall(a, 0.2), lerp2(wall(a, 0.2), wall(b, 3.4), 0.5), wall(b, 3.4)],
    t0: T.zigzag - 0.1 + i * 0.22, dur: 0.7, t1: 28.2 })),
  // "slip away across the river in their canoes"
  { side: "r", width: 0.14, pts: [[8699.2, 1288.7], [8698.6, 1290.6], [8697.9, 1292.6]], t0: T.slip, dur: 1.2, t1: 33.3 },
  // the twist: the back door closed - Coffee and the allies cross two miles below and ring the far bank
  { side: "u", width: 0.3, pts: [[8697.0, 1268.6], [8691.4, 1271.4], [8689.2, 1279.0], [8690.6, 1287.6], [8695.6, 1293.6], [8702.4, 1294.6], [8708.4, 1291.0], [8711.8, 1286.2]],
    t0: T.door - 0.6, dur: 4.2, t1: 60.0 },
  // the charge
  ...[0.2, 0.5, 0.8].map((k, i) => ({ side: "u", width: 0.18, pts: [wall(k, 4.2), wall(k, 1.6), wall(k, -1.4)], t0: T.charge + 0.1 + i * 0.15, dur: 1.4, t1: 92.6 })),
];

// ---------------- boats: the Red Stick canoes ----------------
// on the inner bank from the start; taken by the swimmers (75.5) and paddled to the south bank (77.4-78.6); back across loaded (79.3-80.7)
const CANOE_PATH = (i) => { const a = CANOE_BANK[i], b = [SWIM[0] - 1.2 + i * 0.8, 1290.95]; return [a, lerp2(a, b, 0.5), b]; };
const CL = VX.len(CANOE_PATH(0));
const canoeS = (t, k) => { const L = VX.len(CANOE_PATH(k)), d = k * 0.12;
  if (t < 77.2 + d) return 0.01; if (t < 78.6 + d) return L * VX.sstep(77.2 + d, 78.6 + d, t);
  if (t < 79.3 + d) return L - 0.01; if (t < 80.7 + d) return L * (1 - VX.sstep(79.3 + d, 80.7 + d, t)); return 0.01; };
const boats = CANOE_BANK.map((_, k) => ({ region: HS, kind: "canoe", n: 1, t0: 6.8, t1: 127.0, size: 0.26, lamp: false, wake: false, h: 0.12,
  path: (() => { const p = CANOE_PATH(k); return p; })(), sAt: (t) => canoeS(t, k) }));

// ---------------- fx ----------------
const houses = [[8698.4, 1287.85], [8699.4, 1288.1], [8700.2, 1287.7]];
const WSM = { dir: [N[0], N[1]], size: 0.5, alpha: 0.075, life: 6, muzzle: 6, windK: 0.6, height: 2, cluster: [3.0, 1.5] };
const fx = {
  fires: [...houses.map((h, i) => ({ region: HS, at: [h[0], h[1], 0.1], t0: T.set + i * 0.35, t1: 127.5, preset: "house", cue: i === 0 ? T.set : false })),
    { region: HS, at: [8699.3, 1287.9, 0.1], t0: T.set + 0.6, t1: 127.5, preset: "column", opts: { size: 2.2 }, cue: false }],   // the smoke Jackson saw behind the wall
  smokeLines: [],
  volleys: [
    // the Red Sticks fire through the port-holes at the charge; Jackson's lines answer at the wall
    { region: HS, pts: [wall(0.08, 0.1), wall(0.5, 0.1), wall(0.92, 0.1)], t0: 88.1, t1: 92.4, every: 1.4, opts: { ...WSM, rate: 1.6, volley: 1.4 } },
    { region: HS, pts: [wall(0.2, 1.2), wall(0.5, 1.2), wall(0.84, 1.2)], t0: 89.6, t1: 92.0, every: 1.2, opts: { ...WSM, dir: [-N[0], -N[1]], rate: 1.6, volley: 1.2 } },
    // inside the bend: the fight through the afternoon (behind logs and brush)
    { region: HS, pts: [[8699.6, 1282.3], [8702.0, 1282.9], [8704.4, 1281.8]], t0: 101.4, t1: 106.8, every: 1.7, opts: { ...WSM, dir: [0, 1], rate: 1.2, volley: 1.7 } },
  ],
  guns: [
    // two hours on the wall: flash, smoke, impact on the logs, little damage
    { region: HS, shots: [64.15, 65.25, 66.4, 67.45, 68.4].map((t, i) => { const g = i % 2 ? G2 : G1, k = [0.48, 0.62, 0.36, 0.7, 0.55][i];
      return { t, at: g, dir: [-N[0], -N[1]], impact: wall(k, 0.15), delay: 0.45 }; }), impactOpts: { size: 0.5 } },
  ],
};

// ---------------- the Treaty of Fort Jackson cession on the gulf map (red hatching; approximate: Royce cession 75 within the map) ----------------
const CESSION = [[33.62, -86.33], [33.2, -86.27], [32.8, -86.25], [32.52, -86.21], [32.3, -85.75], [32.05, -85.3], [31.9, -85.06], [31.0, -85.0],
  [31.0, -86.3], [31.0, -87.55], [31.25, -87.95], [31.7, -88.05], [32.3, -87.95], [32.9, -87.75], [33.62, -87.55]].map(([la, lo]) => VX.ll(la, lo, GF));
const hatch = { build(ctx) { const c = document.createElement("canvas"); c.width = 1280; c.height = 720; c.style.cssText = "position:absolute;inset:0;pointer-events:none";
    const tr = document.getElementById("troops"); tr.parentNode.insertBefore(c, tr); this.c = c; this.g = c.getContext("2d"); },
  draw(t, ctx) { const g = this.g; if (!g) return; g.clearRect(0, 0, 1280, 720); const W = ctx.world, cam = W.cameraAt(t);
    const t0 = T.treaty + 0.25, t1 = 148.9, k = VX.sstep(t0, t0 + 1.4, t) * (1 - VX.sstep(t1 - 0.8, t1, t)); if (k <= 0.001 || cam.region !== GF) return;
    const P = []; for (let i = 0; i < CESSION.length; i++) { const a = CESSION[i], b = CESSION[(i + 1) % CESSION.length];
      for (let s = 0; s < 6; s++) { const q = lerp2(a, b, s / 6), p = W.projectMap(q[0], q[1], 0); P.push([p.x, p.y]); } }
    g.save(); g.beginPath(); P.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
    g.fillStyle = `rgba(168,38,28,${(0.09 * k).toFixed(3)})`; g.fill(); g.clip();
    g.strokeStyle = `rgba(190,44,32,${(0.5 * k).toFixed(3)})`; g.lineWidth = 1.6; g.beginPath();
    for (let x = -800; x < 1400; x += 14) { g.moveTo(x, 0); g.lineTo(x + 720, 720); } g.stroke(); g.restore();
    g.beginPath(); P.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
    g.strokeStyle = `rgba(120,22,16,${(0.9 * k).toFixed(3)})`; g.lineWidth = 2.4; g.stroke(); } };
// wall pulses (red) and canoe glows (gold) on their words
const pulses = VX.pulses([
  ...[0.2, 0.5, 0.8].map((k) => ({ region: HS, at: wall(k, 0), r: 1.3, t0: T.wall, t1: 14.6, period: 1.6 })),
  ...[0.2, 0.5, 0.8].map((k) => ({ region: HS, at: wall(k, 0), r: 1.6, t0: T.words + 0.4, t1: 27.0, period: 1.6, alpha: 0.8 })),
  ...CANOE_BANK.map((p) => ({ region: HS, at: p, r: 0.55, t0: T.canoes, t1: 20.6, period: 1.2, color: [255, 214, 120] })),
  ...CANOE_BANK.map((p) => ({ region: HS, at: p, r: 0.7, t0: T.slip - 0.2, t1: 33.2, period: 1.2, color: [255, 214, 120] })),
  ...CANOE_BANK.map((p) => ({ region: HS, at: p, r: 0.7, t0: 56.4, t1: 59.8, period: 1.2, color: [255, 214, 120] })),
]);
// swimmers (75.5) and the men in the canoes
const PERSON = { icon: "person", region: HS, size: 0.32, min: 6, max: 14, color: "#2f5bc0", fadeIn: 0.3, fadeOut: 0.3 };
const markers = VX.markers([
  ...[-0.6, 0, 0.6].map((dx, i) => ({ ...PERSON, path: [[SWIM[0] + dx, SWIM[1] - 0.15], [SWIM[0] + dx * 1.3 - 0.3, 1290.0], [CANOE_BANK[i + 1][0], CANOE_BANK[i + 1][1] - 0.05]], t0: T.swam + i * 0.25, t1: 75.9 + i * 0.2, v: 1.75 })),
]);

const SS = 2, DS = 4.0;   // dive swap time
window.SEQ = {
  name: "S03", D: T.D, T, seed: 1814, date: "1814-03-27",
  regions: [GF, HS],
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  regionOpts: { [HS]: { troopScale: 1.6 }, [GF]: { troopScale: 12 } },
  keys: [
    { t: 0, region: GF, at: [OV[0] - 10, OV[1] + 26], dist: 300, tilt: 36, yaw: 0, fov: 30 },
    // dive 2: gulf -> the bend (push 0.2, swap 4.0, land 7.35)
    { t: 7.35 + 4.6, region: HS, at: [8704.4, 1278.2], dist: 36, tilt: 48, yaw: -8, fov: 30, ease: "io" },   // toward the neck: the wall
    { t: 17.6, region: HS, at: [8701.8, 1282.6], dist: 38, tilt: 47, yaw: -5, fov: 30, ease: "io" },          // the town + the canoes behind it
    { t: 27.5, region: HS, at: [8703.6, 1279.6], dist: 60, tilt: 42, yaw: -3, fov: 30, ease: "io" },          // rise: the whole bend, one neck
    { t: 33.0, region: HS, at: [8703.8, 1278.8], dist: 58, tilt: 43, yaw: -2, fov: 30, ease: "io" },
    { t: 38.5, region: HS, at: [8704.6, 1273.6], dist: 34, tilt: 49, yaw: 0, fov: 30, ease: "io" },           // Jackson arrives from the north
    { t: 45.0, region: HS, at: [8704.4, 1274.4], dist: 33, tilt: 50, yaw: 3, fov: 30, ease: "io" },
    { t: 50.0, region: HS, at: [8701.6, 1280.8], dist: 66, tilt: 43, yaw: 0, fov: 30, ease: "io" },           // the twist: the whole bend + far banks
    { t: 59.4, region: HS, at: [8701.4, 1281.2], dist: 63, tilt: 44, yaw: 1, fov: 30, ease: "io" },
    { t: 62.0, region: HS, at: [8705.2, 1276.0], dist: 19, tilt: 52, yaw: -8, fov: 30, ease: "io" },          // close on the neck: the guns
    { t: 69.6, region: HS, at: [8705.0, 1276.4], dist: 17.5, tilt: 53, yaw: -3, fov: 30, ease: "io" },
    { t: 69.6, region: HS, at: [8699.6, 1290.0], dist: 21, tilt: 49, yaw: 2, fov: 30, ease: "cut", dissolve: 0.9 },   // the toe: the Cherokee
    { t: 83.6, region: HS, at: [8699.6, 1289.2], dist: 19.5, tilt: 50, yaw: -2, fov: 30, ease: "lin" },
    { t: 83.6, region: HS, at: [8704.2, 1280.0], dist: 31, tilt: 47, yaw: -4, fov: 30, ease: "cut", dissolve: 0.9 },   // the smoke + the charge
    { t: 92.0, region: HS, at: [8704.0, 1279.0], dist: 27, tilt: 49, yaw: -2, fov: 30, ease: "io" },
    { t: 100.4, region: HS, at: [8703.0, 1281.0], dist: 33, tilt: 48, yaw: 0, fov: 30, ease: "io" },
    { t: 108.0, region: HS, at: [8701.6, 1283.4], dist: 46, tilt: 45, yaw: 0, fov: 30, ease: "io" },          // inside the bend, the far bank lined
    { t: 113.2, region: HS, at: [8701.5, 1283.4], dist: 50, tilt: 44, yaw: 0, fov: 30, ease: "io" },
    { t: 126.9, region: HS, at: [8701.5, 1283.3], dist: 52, tilt: 44, yaw: 0, fov: 30, ease: "lin" },         // still, dimmed: the result
    { t: 126.9, region: GF, at: [756, 540], dist: 1000, tilt: 12, yaw: 0, fov: 30, ease: "cut", dissolve: 0.9 },   // the gulf map: the treaty
    { t: 148.6, region: GF, at: [752, 545], dist: 980, tilt: 13, yaw: 0, fov: 30, ease: "lin" },
    { t: 156.5, region: GF, at: [720, 700], dist: 900, tilt: 36, yaw: 0, fov: 30, ease: "io" },              // Jackson to Mobile, the Gulf coast
    { t: T.D, region: GF, at: [640, 760], dist: 860, tilt: 38, yaw: 0, fov: 30, ease: "io" },                  // drifting toward New Orleans (S04 starts here)
  ],
  dives: [{ t: DS, over: OV, from: { region: GF, at: [OV[0] - 4, OV[1] + 10], dist: 230, tilt: 38, yaw: 0 },
            to: { region: HS, at: [8703.0, 1280.8], dist: 50, tilt: 46, yaw: -6, fov: 30 },
            keys: { swTo: { at: [8703.2, 1280.0] }, emerge: { at: [8703.1, 1280.4] } } }],   // the gulf "over" point is in z8 units: aim the close side at the bend
  clouds: { [GF]: { scatter: { seed: 5 }, keepClear: [[930, 520, 260, 1, 1], [700, 700, 220, 1, 1]] }, [HS]: { shadows: true } },
  units, arrows, boats,
  generals: {
    jackson: { img: "seq/jackson.png", flag: "seq/us15_flag.png", side: "us", name: "Jackson", full: "Andrew Jackson", role: "Major General" },
    coffee: { img: "seq/coffee.png", flag: "seq/us15_flag.png", side: "us", name: "Coffee", full: "John Coffee", role: "Brigadier General" },
    redsticks: { img: "seq/rs_cloth.png", flag: "seq/rs_pennant.png", side: "cs", name: "Red Sticks", full: "The Red Sticks", role: "Creek" },
  },
  banners: [
    { general: "redsticks", region: HS, keys: [[0, 8703.4, 1285.8]], t0: 7.6, t1: 45.0 },
    { general: "jackson", region: HS, keys: [[0, 8706.4, 1270.6]], t0: T.jackson, t1: 50.6 },
    { general: "coffee", region: HS, keys: [[0, 8697.4, 1294.2]], t0: T.coffee, t1: 60.0 },
    { general: "jackson", region: HS, keys: [[0, 8708.6, 1272.2]], t0: T.saw, t1: 108.4 },
    { general: "coffee", region: HS, keys: [[0, 8695.6, 1293.8]], t0: T.coffees, t1: 113.0 },
    { general: "jackson", region: GF, keys: [[0, ...VX.place("Fort Jackson (Hickory", GF)], [151.2, ...VX.place("Fort Jackson (Hickory", GF)], [156.0, ...VX.place("Mobile", GF)]], t0: T.made - 0.4, t1: 162.0 },
  ],
  labels: [
    { text: "Tallapoosa River", region: HS, at: [8713.6, 1270.0], size: 18, river: true, t0: 7.6, t1: 11.2 },
    { text: "Tohopeka", region: HS, at: [TOWN[0] + 0.4, TOWN[1] - 1.0], size: 19, t0: 7.8, t1: 11.4 },
    { text: "log wall", region: HS, at: wall(0.55, 1.3), size: 18, t0: T.wall, t1: 12.6 },
    { text: "canoes", region: HS, at: [8701.6, 1290.6], size: 17, t0: T.canoes, t1: 20.6 },
    { text: "Gun Hill", region: HS, at: [GUNHILL[0], GUNHILL[1] - 1.1], size: 17, t0: T.fire, t1: 67.6 },
  ],
  fx,
  overlay: [
    ["plaque.date", 0.4, { month: "Spring 1814", day: "", weekday: "", note: "Tohopeka" }],
    ["plaque.date", T.d27, { month: "March 1814", day: "27", weekday: "Sunday", note: "the Horseshoe" }],
    ["legend", T.allies + 0.3, 59.0, { entries: [{ name: "Jackson's army", sub: "with Cherokee and Lower Creek allies", color: "#3C6E9E" }, { name: "Red Sticks", sub: "Creek", color: "#9C3A35" }] }],
    ["plaque.clock", T.half, { time: "10:30", note: "two guns on the wall", header: "27 March 1814" }],
    ["plaque.run", T.hours, 68.6, "12:30"],
    ["plaque.note", T.charge, "the charge"],
    ["label", T.thirty9 + 0.1, 92.8, { name: "39th U.S. Infantry", sub: "over the wall first", world: wall(0.5, 2.2), side: "us", marker: false }],
    ["label", T.houston, 100.6, { name: "Sam Houston", sub: "39th U.S. Infantry", world: wall(0.45, -1.4), side: "us", marker: false }],
    ["plaque.note", T.afternoon, "the afternoon"],
    ["film.dim", T.eight - 0.3, 126.8, 0.75],
    ["ledger.show", T.eight - 0.2, { title: "Horseshoe Bend", sub: "27 March 1814" }],
    ["ledger.add", T.killed, { who: "About 800 Red Stick warriors killed", note: "out of about 1,000", stamp: false }],
    ["ledger.add", T.prisoner, { who: "About 350 women and children taken prisoner", stamp: false }],
    ["ledger.add", T.fortynine + 0.35, { who: "Jackson's army: 49 killed", note: "18 of them Cherokee", stamp: false }],
    ["ledger.hide", 126.4],
    ["plaque.date", T.summer, { month: "Summer 1814", day: "", weekday: "", note: "Fort Jackson" }],
    ["letter", T.treaty - 0.1, 142.8, { header: "Summer 1814", title: "Treaty of Fort Jackson", sub: "", marks: false, quote: "some 22 million acres: about half the Creek Nation's land", qSize: 30, cps: 24, qAt: 136.0, lag: 0.05, stagger: 0.06, partDur: 0.35 }],
    ["label", T.beside - 1.0, 143.0, { name: "Even the allies' land", sub: "taken from the Creeks who fought beside him", world: VX.ll(31.55, -85.35, GF), side: "us", marker: false }],
    ["letter", 143.6, 148.9, { header: "Move 1 · Horseshoe Bend", title: "The Old Hickory Method", sub: "", marks: false, quote: "1. Close every door", qSize: 34, cps: 14, qAt: T.close - 0.05, lag: 0.05, stagger: 0.06, partDur: 0.35 }],
    ["plaque.date", T.autumn, { month: "Autumn 1814", day: "", weekday: "", note: "the Gulf coast" }],
    ["label", T.gulf, 158.4, { name: "The whole Gulf coast", sub: "Jackson's command", world: VX.ll(30.55, -88.4, GF), side: "us", marker: false }],
    ["engage.subscribe", 171.0, 175.6],
    ["label", T.heres + 0.05, T.D + 1, { name: "Next: the night attack", screen: true, x: 1480, y: 940, marker: false, side: "us" }],
  ],
  build: (ctx) => { hatch.build(ctx); pulses.build(ctx); markers.build(ctx); },
  draw: (t, ctx) => { hatch.draw(t, ctx); pulses.draw(t, ctx); markers.draw(t, ctx); },
};
// the British coming: ships + a red arrow from the south-east (gulf), continued in S04
const SHIP_PATH = [[1215, 1015], [1060, 950], [905, 885], [760, 830], [620, 800], [520, 772], [470, 758]];   // = S04's
window.SEQ.boats.push({ region: GF, kind: "ship", n: 5, t0: T.british - 0.2, t1: T.D + 1, size: 3.4, lamp: false, wake: true, path: SHIP_PATH, s0: 300, speed: 4.0, spacing: 12 });
window.SEQ.arrows.push({ side: "r", width: 0.6, maxWidth: 0.6, pts: [[1222, 1040], [1060, 950], [930, 895], [850, 862]], t0: T.british - 0.1, dur: 1.8, t1: 170.0, region: GF });
})();
