// test_v8: the approved 66 s v8 clip (research/style_tests/gm3d/clip/index.html) rebuilt from DATA on the generic engine (regression test).
// Regions: _clip_wide (the clip's wide map, kept for this test) + bigblack (the clip's close map). Times = the gm_test narration beats.
// Everything Big-Black-specific that used to live in the clip's code (the withdrawal road, the guns, the breastwork smoke, the bridge fire,
// the steamer, the batteries, the camps, the boats, the pontoons) is plain data here.
(() => {
const T = { D: 66.0, p1: 0.0, p2: 18.26, p3: 28.17, p4: 44.68, p5: 57.78, end5: 63.2, burned: 4.83, grant: 8.69, oneday1: 9.73, story: 11.66,
  dive: 17.46, ch: 19.46, pem: 20.4, crossing: 24.05, back: 26.31, midm: 28.17, nine: 30.33, memoirs: 33.0, taken: 34.19, bburn: 35.68,
  guns: 37.91, pris: 39.02, six: 41.33, fire2: 44.68, april: 47.34, steamer: 51.16, drift: 53.88, deck: 55.37, nextday: 57.78, three: 58.79, oneday2: 61.77 };
const EV = {
  csGuns: [[1520.9, 700.6], [1521.3, 706.2], [1521.0, 709.9]], usGuns: [[1527.6, 701.4], [1527.9, 704.3], [1527.5, 708.6]],
  usShots: [22.4, 24.6, 25.8, 27.0, 28.4, 29.1, 29.9, 30.8, 31.6, 32.5], csShots: [23.3, 25.2, 26.4, 28.7, 29.5, 30.3, 31.2, 32.0, 33.0],
  volleyCS: [28.3, 34.0], volleyUS: [29.0, 33.6], bridgeFireWide: 4.6, bridgeFire: 35.68, steamer: 51.16,
  batteryShots: [47.9, 48.6, 49.5, 50.3, 51.0, 52.1, 53.0], bridgesNew: [58.79, 59.3, 59.8] };
const WIDE = "_clip_wide", BB = "bigblack";
const DV = VX.diveTimes(16.4);                       // the cloud dive: swap at 16.4 s (push 12.6, deck 14.7 .. land 19.75)
const SW = DV.SW, ARR = SW + 0.6, TK = T.taken;
const BR = VX.bridge(BB, 0), BRW = VX.work(BB, 0), ESC_RD = VX.road(BB, "main"), RIV = VX.river(BB, 0).pts, PONT = VX.region(BB).features.pontoons;
const VB = VX.town("Vicksburg"), riverAt = (y) => VX.riverAtY(WIDE, 0, y), lerp = VX.lerp, hsh = VX.hsh;
const bwX = (y) => { let b = BRW[0]; for (const p of BRW) if (Math.abs(p[1] - y) < Math.abs(b[1] - y)) b = p; return b[0]; };
const ESC = (start, t0, v = 2.1, v2 = 1.2, from = 0) => ({ road: ESC_RD, start, t0, v, v2, slowX: 1512.26, join: "west", from });   // slowX: west end of the bridge

// ---------------- units (order matters: the push-apart iterates in this order) ----------------
const units = [];
[[699.4, 0], [702.9, 1], [706.6, 2], [710.4, 3]].forEach(([y, i]) => { const flank = i === 0 || i === 3;
  units.push({ side: "r", type: "inf", n: 4, keys: [[0, bwX(y) - 0.25, y]], cap: TK - 0.2 + i * 0.25, capN: flank ? 2 : 4, t1: T.p4,
    ...(flank ? { escape: ESC([bwX(y) - 0.9, y], i === 0 ? 28.7 : 29.0, 2.1, 1.2, 2) } : {}) }); });
EV.csGuns.forEach((g, i) => units.push({ side: "r", type: "art", n: 2, keys: [[0, g[0] - 0.15, g[1]]], cap: TK + 0.1 * i, capN: 2, t1: T.p4 }));
units.push({ side: "r", type: "inf", n: 3, face: 0, keys: [[0, BR.x - 1.6, 703.6]], t1: T.p4, escape: ESC([BR.x - 1.6, 703.9], 31.2, 1.2, 1.2, 0) });   // the reserve marches off first
[[699.0, 0], [702.6, 1], [706.4, 2], [710.6, 3]].forEach(([y, i]) => units.push({ side: "u", type: "inf", n: 4, t0: ARR - 0.2, t1: T.p5 - 1,
  keys: [[ARR, 1534.5 + i * 0.6, y], [T.crossing + 1, 1526.6 + (i % 2) * 0.3, y], [30.4 + i * 0.3, 1526.0, y], [TK - 0.3 + i * 0.15, bwX(y) + 0.5, y], [TK + 1.4, bwX(y) - 1.0, y], [T.p4, BR.x + 2.4 + (i % 2) * 1.1, 699.2 + i * 3.5]] }));
[[1529.2, 699.6], [1529.4, 704.8], [1529.0, 710.2], [1535.0, 702.0], [1535.4, 708.0]].forEach(([x, y], i) => units.push({ side: "u", type: "inf", n: 3, t0: ARR - 0.2,
  keys: [[ARR, x + 6, y], [T.crossing + 2 + i * 0.3, x, y], [TK + 1, x - 3, y]] }));
EV.usGuns.forEach((g, i) => units.push({ side: "u", type: "art", n: 2, t0: ARR - 0.2, keys: [[ARR, g[0] + 5, g[1]], [T.crossing - 0.6 + i * 0.4, g[0] + 0.2, g[1]]] }));
// next day: ONE column per pontoon bridge, nose to tail along the bridge axis, waiting on the east bank until its bridge is down
const posAtRiver = (y) => { let b = RIV[0]; for (const p of RIV) if (Math.abs(p[1] - y) + (p[0] < 1500 ? 99 : 0) < Math.abs(b[1] - y) + (b[0] < 1500 ? 99 : 0)) b = p; return b; };
const bridgeAxis = (y, k) => { const P = PONT[k];
  if (P) { let ex = Math.sin(P.angle), ey = Math.cos(P.angle); if (ex < 0) { ex = -ex; ey = -ey; } return { b: [P.x, P.z], ex, ey }; }
  const b = posAtRiver(y), i = RIV.indexOf(b), a = RIV[Math.max(0, i - 3)], c = RIV[Math.min(RIV.length - 1, i + 3)], l = Math.hypot(c[0] - a[0], c[1] - a[1]);
  let ex = (c[1] - a[1]) / l, ey = -(c[0] - a[0]) / l; if (ex < 0) { ex = -ex; ey = -ey; } return { b, ex, ey }; };
const NEWBR = [[702.0, 0], [707.8, 1], [709.6, 2]];
NEWBR.forEach(([y, k]) => { const { b, ex, ey } = bridgeAxis(y, k), P = (d) => [b[0] + ex * d, b[1] + ey * d], tb = EV.bridgesNew[k];
  units.push({ side: "u", type: "inf", n: 4, march: true, face: Math.atan2(ey, ex) + Math.PI / 2, t0: T.p5 - 0.6, bw: 0.56, bd: 0.3, gap: 0.07, wob: 0,
    keys: [[T.p5 - 1, ...P(3.6)], [tb + 0.7, ...P(3.6)], [tb + 4.2, ...P(-2.4)], [T.D, ...P(-3.4)]] }); });
[[1523.0, 700.5], [1524.5, 706.0], [1522.5, 711.0]].forEach(([x, y]) => units.push({ side: "u", type: "inf", n: 4, t0: T.p5 - 0.6, keys: [[T.p5 - 1, x, y]] }));

// ---------------- arrows ----------------
const arrows = [
  { side: "u", pts: [[1527.4, 710.8], [1525.0, 711.0], [1522.2, 710.4]], t0: 30.4, dur: 2.6, t1: T.bburn },
  { side: "u", pts: [[1527.4, 706.6], [1524.8, 706.6], [1522.4, 706.2]], t0: 31.2, dur: 2.4, t1: T.bburn },
  { side: "u", pts: [[1527.4, 702.4], [1524.8, 702.6], [1522.4, 702.6]], t0: 31.8, dur: 2.2, t1: T.bburn },
  { side: "r", pts: [[1518.2, 704.4], [1515.3, 704.05], [1512.6, 703.75], [1509.6, 703.3]], t0: 30.2, dur: 3.0, t1: T.bburn + 1.0 },   // the withdrawal, just north of the road
];
for (const [y, k] of NEWBR) { const { b, ex, ey } = bridgeAxis(y, k); arrows.push({ side: "u", pts: [[b[0] + ex * 3.6, b[1] + ey * 3.6], [b[0] + ex * 0.75, b[1] + ey * 0.75]], t0: EV.bridgesNew[k] + 0.4, dur: 1.4, t1: T.D + 1 }); }

// ---------------- fx (close: bridge fire, smoke, guns; wide: the burning bridge from altitude, the steamer, the batteries, the camps) ----------------
const st0 = riverAt(684), st1 = riverAt(703), stM = [lerp(st0[0], st1[0], 0.35), lerp(st0[1], st1[1], 0.35), 0.4];
const bw3 = BRW.filter((_, i) => i % 3 === 0).map((p) => [p[0] + 0.12, p[1]]);
const SMK = { dir: [-1, 0], size: 1.4, alpha: 0.22, life: 12, muzzle: 6, windK: 0.45 };
const camps = []; { const camp = (cx, cy, n, s) => { for (let j = 0; j < n; j++) camps.push([cx + (hsh(s + j, 66) - 0.5) * 2.4, cy + (hsh(s + j, 67) - 0.5) * 1.8]); };
  [[684, 4.5], [690, 3.6], [696, 4.2], [702, 5.0], [676, 7.0]].forEach(([y, dx], i) => camp(riverAt(y)[0] + dx + 2, y, 4, i * 10));
  camp(VB[0] + 6, VB[1] + 3, 4, 60); camp(VB[0] + 5, VB[1] - 6, 3, 70);
  [[672, -6], [679, -9], [686, -7], [692, -11], [698, -8], [705, -10]].forEach(([y, dx], i) => camp(riverAt(y)[0] + dx, y, 4, 100 + i * 10)); }
const fx = {
  fires: [
    { region: WIDE, at: [BR.x, BR.z, 0.6], t0: EV.bridgeFireWide - 3, t1: T.dive + 1, preset: "column", cue: EV.bridgeFireWide },   // cold open: the bridge already burning
    { region: BB, bridge: 0, t0: EV.bridgeFire, t1: T.p4 - 1.2, preset: "bridge", waterGlow: { t1: T.p4 - 0.6 } },   // burns the trestle at t0 + 3.2
    { region: BB, bridge: 0, burn: false, t0: T.p5 - 1, t1: T.D + 2, preset: "smoulder", cue: false },   // still smouldering next day
    { region: WIDE, at: [st0[0], st0[1], 0.4], to: stM, t0: EV.steamer, t1: EV.steamer + 2.6, preset: "steamer" },   // Henry Clay burns, drifting
    { region: WIDE, at: stM, to: [st1[0], st1[1], 0.4], t0: EV.steamer + 2.4, t1: T.p5, preset: "steamer", cue: false, opts: { ramp: 0.4, fadeOut: undefined } },   // no fade-out (undefined = the fx default, as in v8)
  ],
  smokeLines: [
    { region: BB, pts: bw3, t0: EV.volleyCS[0], t1: EV.volleyCS[1], cue: true, opts: { dir: [1, 0.05], rate: 2.9, volley: 1.6, roll: 0.9, size: 1.45, height: 3, muzzle: 6, windK: 0.45 } },
    { region: BB, pts: [[1525.8, 698.6], [1525.4, 703.5], [1525.6, 708.0], [1525.1, 712.0]], t0: EV.volleyUS[0], t1: EV.volleyUS[1] - 1.8, opts: { ...SMK, rate: 1.26 } },
    { region: BB, pts: [[1523.0, 706.5], [1522.6, 709.5], [1522.4, 712.0]], t0: 31.8, t1: EV.volleyUS[1], opts: { ...SMK, rate: 1.44 } },
  ],
  guns: [
    { region: BB, shots: EV.usShots.map((t, i) => { const g = EV.usGuns[i % 3]; return { t, at: g, dir: [-1, 0.05 * (i % 3 - 1)], impact: [1520.2 + ((i * 37) % 7) * 0.15, g[1] + ((i * 53) % 9 - 4) * 0.35], delay: 0.85 }; }) },
    { region: BB, shots: EV.csShots.map((t, i) => { const g = EV.csGuns[i % 3]; return { t, at: g, dir: [1, -0.04 * (i % 3 - 1)], impact: [1526.3 + ((i * 29) % 7) * 0.25, g[1] + ((i * 41) % 9 - 4) * 0.4], delay: 0.8 }; }) },
    // the Vicksburg batteries on the bluff edge fire on the boats at night: 3x orange flash, a glow on the water, the shot falls in the river (no boom cue)
    { region: WIDE, preset: "battery", h: 0.3, boom: false, opts: { dir: [-1, 0.1] }, shots: EV.batteryShots.map((t, i) => { const r0 = riverAt(VB[1] - 6 + i * 2.6), r = riverAt(VB[1] - 3 + i * 3);
      return { t, at: [r0[0] + 3.2 + (i % 3) * 0.8, r0[1]], flash: { at: [r0[0] + 0.4, r0[1]], h: 0.25 }, impact: [r[0], r[1], 0.1], delay: 0.9 }; }), impactOpts: { size: 0.5 } },
  ],
  campfires: [{ region: WIDE, pts: camps, t0: T.p4 - 1, t1: T.p5 }],
};

window.SEQ = {
  name: "test_v8", debug: true, D: T.D, T, seed: 1863, date: "1863-05-17",
  regions: [WIDE, BB],
  features: { [BB]: { bridges: [{ burn: EV.bridgeFire + 3.2 }], pontoons: EV.bridgesNew.map((at) => ({ at })) } },
  keys: [
    { t: 0.0, region: WIDE, at: [1560, 712], dist: 640, tilt: 46, yaw: -3, fov: 30 },
    { t: T.p3 - 0.5, region: BB, at: [1520.2, 705.4], dist: 36, tilt: 50, yaw: -5, fov: 30 },
    { t: T.taken + 0.4, region: BB, at: [1520.0, 706.2], dist: 30, tilt: 52, yaw: -10, fov: 30 },
    { t: T.bburn + 2.2, region: BB, at: [1515.0, 705.4], dist: 25, tilt: 54, yaw: -14, fov: 30 },
    { t: T.p4 - 0.6, region: BB, at: [1514.6, 705.3], dist: 27.5, tilt: 53, yaw: -12, fov: 30 },
    { t: T.p4 - 0.6, region: WIDE, at: [1392, 690], dist: 280, tilt: 52, yaw: 0, fov: 30, night: 1, ease: "cut" },
    { t: T.p5 - 0.6, region: WIDE, at: [1376, 694], dist: 215, tilt: 56, yaw: -4, fov: 30, night: 1 },
    { t: T.p5 - 0.6, region: BB, at: [1514.0, 705.0], dist: 34, tilt: 50, yaw: -4, fov: 30, ease: "cut" },
    { t: T.D - 1.4, region: BB, at: [1512.6, 705.2], dist: 30, tilt: 52, yaw: 4, fov: 30 },
    { t: T.D, region: BB, at: [1512.6, 705.2], dist: 30, tilt: 52, yaw: 4, fov: 30, ease: "lin" },
  ],
  dives: [{ t: SW, over: [1518, 706],
    from: { region: WIDE, at: [1532, 709], dist: 545, tilt: 44, yaw: 0 },
    to: { region: BB, at: [1519.6, 704.6], dist: 40, tilt: 38, yaw: -2, fov: 32 },
    keys: { emerge: { at: [1518.5, 705.2] } } }],
  clouds: {
    [WIDE]: { scatter: { box: [1150, 340, 860, 640], n: 14, med: 30 }, keepClear: [[1388, 690, 95, 0.8, 1]],   // Vicksburg (the night frame) stays clear
      corners: [[1290, 915, 95], [1815, 930, 85], [1175, 470, 70]], wisps: [[1318, 625, 34], [1290, 735, 40], [1440, 600, 30], [1335, 790, 32], [1470, 790, 26]],
      bounds: [1080, 300, 2060, 1010], keepDiveLook: true },
    [BB]: { shadows: true },
  },
  title: { text: "ONE DAY", tOn: 11.29, tGrow: 11.81, anchorT: 12.2 },   // 'one' 11.29-11.52, 'day' to 11.81 in gm_test/audio/voice.wav
  units, arrows,
  banners: [
    { general: "grant", keys: [[ARR, 1537, 704.2], [T.crossing + 2, 1530.6, 705.6]], t0: ARR + 0.5, t1: T.p4 - 0.6 },
    { general: "pemberton", keys: [[0, BR.x - 1.2, 706.2]], t0: T.pem - 0.2, t1: T.p4, escape: ESC([BR.x - 1.2, 705.4], 31.0, 1.1, 1.1) },   // rides off west with the column
    { general: "grant", keys: [[T.p5 - 1, 1517.4, 705.5]], t0: T.p5 - 0.5, t1: T.D + 1 },
  ],
  labels: [
    { text: "Vicksburg", town: "Vicksburg", size: 26, t0: 0.8, t1: DV.full - 0.3, region: WIDE },
    { text: "Edwards", town: "Edwards", size: 20, t0: 1.2, t1: DV.full - 0.3, region: WIDE },
    { text: "Big Black River", at: [1506, 676], size: 19, t0: 2.0, t1: DV.full - 0.2, region: WIDE, river: true },
    ...[["Bovina", 17, 2.6], ["Champion Hill", 17, 3.0], ["Warrenton", 16, 3.4], ["Bolton", 16, 3.8]].map(([n, size, t0]) => ({ text: n, town: n, size, t0, t1: DV.full - 0.3, region: WIDE })),
    { text: "Bovina", at: [1495.5, 700.4], size: 19, t0: SW + 1, t1: T.p4 - 1, region: BB },
    { text: "Big Black River", at: [1512.2, 696.0], size: 18, t0: SW + 1.2, t1: 27, region: BB, river: true },
    { text: "Vicksburg", at: [1392, 683], size: 24, t0: T.p4 + 0.4, t1: T.p4 + 5, region: WIDE },
    { text: "Mississippi River", at: [1362, 688], size: 18, t0: T.p4 + 0.8, t1: T.p4 + 5.5, region: WIDE, river: true },
    { text: "Big Black River", at: [1512.2, 699.0], size: 18, t0: T.p5 - 0.2, t1: T.p5 + 4, region: BB, river: true },
  ],
  boats: [{ region: WIDE, kind: "steamer", n: 6, river: 0, y0: 662, vy: 1.6, dy: 4.2, t0: T.p4 - 1, t1: T.p5 }],   // Grant's transports run the batteries
  fx,
  overlay: [
    ["plaque.date", 0.4, { month: "May 1863", day: "17", weekday: "Sunday", note: "east of Vicksburg" }],
    ["label", T.burned, T.burned + 4.2, { name: "Big Black bridge", sub: "burned behind the Confederate army", world: [BR.x + 9, BR.z + 14], side: "cs", marker: false }],
    ["medallion", { kind: "card", general: "grant", sub: "Army of the Tennessee", world: [1600, 716], offset: [150, -150], tIn: T.grant, tOut: 11.29 - 0.75 }],   // off before the title lands
    ["plaque.clock", DV.SW + 0.05, { time: "8:30", note: "Big Black River bridge", header: "17 May 1863" }],
    ["timeline.show", 1.4, { month: "May", year: "1863", days: ["15", "16", "17", "18", "19", "20"], at: 1.0 }],
    ["timeline.seal", T.ch + 0.7, { at: 2.0, name: "Champion Hill" }],
    ["legend", 1.9, T.p4 - 0.8, { entries: [{ name: "Union", sub: "Grant", color: "#3C6E9E" }, { name: "Confederates", sub: "Pemberton", color: "#9C3A35" }] }],
    ["medallion", { kind: "card", general: "grant", sub: "Army of the Tennessee", screen: [1765, 215], tIn: DV.warm + 0.25, tOut: T.crossing + 2.6 }],
    ["medallion", { kind: "card", general: "pemberton", sub: "holds the crossing", world: [BR.x - 1.2, 706.2], offset: [-330, -170], tIn: T.pem, tOut: T.crossing + 2.6 }],
    ["label", T.back, T.p3 + 0.6, { name: "The river at their back", sub: "one bridge behind the line", world: [BR.x, BR.z], side: "cs" }],
    ["timeline.go", T.p3, { at: 2.6, d: 1.2 }],
    ["plaque.run", T.p3, T.taken, "9:05"],
    ["plaque.note", T.p3 + 0.5, "Assault on the breastworks"],
    ["label", T.taken - 0.2, T.bburn - 0.3, { name: "The line is taken", sub: "a little after nine · Grant's Memoirs", world: [1521.2, 709.6], side: "us" }],
    ["label", T.bburn, T.guns - 0.2, { name: "Big Black bridge burned", sub: "fired by the retreating Confederates", world: [BR.x + 2.2, BR.z + 2.0], side: "cs", marker: false }],
    ["ledger.show", T.guns - 0.6, { title: "Big Black River", sub: "17 - 18 May 1863" }],
    ["ledger.add", T.guns, { who: "18 guns taken", stamp: false }],
    ["ledger.add", T.pris, { who: "1,751 prisoners", note: "by Grant's count", stamp: false }],
    ["number", T.pris, T.six - 0.3, { value: 1751, round: 1, world: [1519.0, 706.5], size: 104 }],
    ["ledger.add", T.six, { who: "276 Union hit", note: "six prisoners for each", stamp: false }],
    ["ledger.hide", T.p4 - 0.6],
    // (the dive adds film.grade none at its deck time and day after the emergence)
    ["film.grade", T.p4 - 0.6, "night", 0.8],
    ["plaque.date", T.p4, { month: "April 1863", day: "16", weekday: "Thursday", note: "a month earlier · night" }],
    ["timeline.hide", T.p4 - 0.6],
    ["inset", T.april, T.drift + 1.0, { img: "seq/inset_run.jpg", x: 1300, y: 170, w: 500, h: 360, caption: "Grant's transports running the batteries · Library of Congress" }],
    ["quote", T.deck - 1.4, T.p5 - 0.7, { en: "The sight was magnificent, but terrible.", attr: "Ulysses S. Grant · Personal Memoirs", y: 700 }],
    ["film.grade", T.p5 - 0.6, "day", 0.8],
    ["plaque.date", T.p5 - 0.3, { month: "May 1863", day: "18", weekday: "Monday", note: "three new bridges" }],
    ["timeline.show", T.p5, { month: "May", year: "1863", days: ["15", "16", "17", "18", "19", "20"], at: 3.0 }],
    ["timeline.seal", T.p5 + 0.4, { at: 3.0, name: "Big Black" }],
    ["ledger.show", T.three - 0.4, {}],
    ["ledger.add", T.three, { who: "Three new bridges", note: "18 May", stamp: false }],
    ["ledger.final", T.oneday2, { lines: ["Stopped", "one day"], color: "#A8261B" }],
    ["plaque.hide", T.D - 2.1], ["timeline.hide", T.D - 2.1], ["ledger.hide", T.D - 2.0],
  ],
  start: { fadeIn: 0.8 }, end: { fadeAt: T.D - 1.05 },
};
})();
