// GM TROOPS TEST COPY of S10 (troops v3, owner 2026-11-18): Union lines stop at the works (no marching through the captured line),
// guns re-sited so nothing overlaps, the flanks leave as the line falls (a steady walk, queue over the bridge before the fire). Film S10 untouched.
// S10 Big Black River Bridge (17 May 1863). D = 45.77 s (tools/scene_times.py S10). Region: bigblack_new (the TRUE bridge, 1509.8,683.5).
// The v8 Big Black staging (sequences/test_v8) translated onto the corrected world: the bridgehead in the bend behind the cotton-bale
// breastworks (works[0], x ~1521.5, y 678.6-691.3) with the bayou in front, Lawler's brigade out of the meander scar on the northern flank,
// the line overrun and captured grey in place, the flanks escape over the bridge, the railroad bridge and the steamboat Dot burn,
// 18 guns / 1,751 prisoners, three new bridges next morning (features.pontoons). Positions: data/geo.json units "bigblack", FACT_NOTES section 9.
(() => {
const T = { D: 45.77, morning: 0.73, pem: 1.59, bigblack: 4.05, rearguard: 6.27, east: 7.49, loop: 8.79, breastworks: 10.33, backs: 11.47,
  minutes: 14.07, lawler: 17.03, charged: 17.47, northern: 19.01, through: 20.45, nine: 23.28, grant: 23.71, taken: 25.55, ran: 27.41, fire: 31.45,
  eighteen: 32.42, guns: 32.93, prisoners: 34.84, stopped: 38.15, single: 39.39, nextMorning: 40.97, three: 42.07, crossed: 43.01 };
const BB = "bigblack_new";
const BR = VX.bridge(BB, 0), BRW = VX.work(BB, 0), RD = VX.road(BB, "Jackson road"), PONT = VX.region(BB).features.pontoons;
const DOT = VX.place("Steamboat 'Dot' bridge");
const bwX = (y) => { let b = BRW[0]; for (const p of BRW) if (Math.abs(p[1] - y) < Math.abs(b[1] - y)) b = p; return b[0]; };
const SLOWX = BR.x - 0.8;   // the west end of the bridge
const ESC = (t0, v = 2.1, from = 0) => ({ road: RD, t0, v, v2: 1.6, slowX: SLOWX, join: "west", from });
// round 2 (owner rule: never cross a bridge after its fire starts): the flanks and the reserve start for the bridge as the line falls
// (24.8-25.6) and the last red box is past the west end by ~31.0 (tools: esc_sim); the fire starts at FIRE_T = 31.3 ("set them on fire")
const ESC_T = [16.9, 16.8, 15.6], FIRE_T = 31.3;   // (GM test) earlier, so a steady walk clears the bridge before the fire
const TK = 21.2;   // Lawler reaches the works (north first)
const SWF = 3 * Math.PI / 4;

// ---------------- units ----------------
const units = [];
// the Confederate line behind the breastworks, north (Green) to south (Cockrell); captured grey in place from the north; the flanks run for the bridge
[[679.9, 0], [683.3, 1], [686.7, 2], [690.0, 3]].forEach(([y, i]) => { const flank = i === 0 || i === 3;
  units.push({ side: "r", type: "inf", n: 3, keys: [[0, bwX(y) - 0.35, y]], cap: TK + i * 0.7, capN: flank ? 1 : 3, t1: T.D + 1,
    ...(flank ? { escape: ESC(ESC_T[i === 3 ? 1 : 0], 3.4, 1) } : {}) }); });
// 18 guns: three batteries just behind the parapet, all taken
[[686.0], [684.5]].forEach(([y], i) =>   // (GM test) two batteries clear of the escape roads (the north one sat on the flank's way out)
  units.push({ side: "r", type: "art", n: 2, keys: [[0, bwX(y) - 1.2, y]], cap: TK + 0.6 + i * 0.5, t1: T.D + 1 }));
// the reserve by the bridge: first across
units.push({ side: "r", type: "inf", n: 3, face: 0, keys: [[0, BR.x + 2.6, 685.4]], escape: ESC(ESC_T[2], 2.0, 0), escDelay: 2.65 });   // (v14) its break-ranks inside the excerpt (from ~20.3 s)
// Union: Lawler's brigade out of the meander scar on the northern flank, straight through the works, on toward the bridge
units.push({ side: "u", type: "inf", n: 3, face: SWF, keys: [[0, 1527.8, 679.4], [T.charged - 2.0, 1527.8, 679.4], [TK - 0.3, bwX(679.6) + 2.4, 679.0]] });   // (GM test) to the works, not through them
// Benton (Carr) and Osterhaus (Garrard, Lindsey): the rest of the line follows the breach
[[683.6, 0], [687.2, 1], [690.6, 2]].forEach(([y, i]) => units.push({ side: "u", type: "inf", n: 3, keys: [[0, 1527.6 + i * 0.4, y], [19.4 + i * 0.4, 1527.6 + i * 0.4, y],
  [TK + 1.2 + i * 0.6, bwX(y) + 2.0, y]] }));   // (GM test) they close round the works, not through the captured line
// supports + guns on the open ground east of the bayou
[[1532.6, 681.2], [1533.4, 686.2], [1533.0, 691.0]].forEach(([x, y], i) => units.push({ side: "u", type: "inf", n: 3, keys: [[0, x, y], [TK + 1 + i * 0.4, x - 2.6, y]] }));
const usGuns = [[1535.6, 684.0], [1535.8, 688.6]];   // (GM test) behind the supports (they sat inside Benton's line)
usGuns.forEach((g) => units.push({ side: "u", type: "art", n: 2, keys: [[0, g[0] + 0.2, g[1]]] }));
// next morning: one column per new bridge, nose to tail on the bridge axis, waiting on the east bank until its bridge is down (as v8)
const TB = [42.1, 42.5, 42.9];
const axis = (k) => { const P = PONT[k]; let ex = Math.sin(P.angle), ey = Math.cos(P.angle); if (ex < 0) { ex = -ex; ey = -ey; } return { b: [P.x, P.z], ex, ey }; };
PONT.forEach((_, k) => { const { b, ex, ey } = axis(k), P = (d) => [b[0] + ex * d, b[1] + ey * d], tb = TB[k];
  units.push({ side: "u", type: "inf", n: 4, march: true, face: Math.atan2(ey, ex) + Math.PI / 2, t0: T.nextMorning - 0.4, bw: 0.56, bd: 0.3, gap: 0.07, wob: 0,
    keys: [[T.nextMorning - 0.6, ...P(3.4)], [tb + 0.7, ...P(3.4)], [tb + 2.8, ...P(-2.2)], [T.D + 1, ...P(-3.2)]] }); });

// ---------------- arrows ----------------
const arrows = [
  { side: "u", pts: [[1528.4, 678.9], [1525.4, 679.6], [1522.2, 680.8], [1519.0, 682.2]], t0: T.charged, dur: 2.6, t1: T.ran },
  { side: "u", pts: [[1527.2, 687.0], [1524.8, 687.0], [1522.4, 686.8]], t0: 19.8, dur: 2.2, t1: T.ran },
  { side: "r", color: "#a8392b", width: 0.13, pts: (() => { const east = [1511.6, 684.75], west = [1510.34, 683.77];   /* the deck ends (world bridge data: x 1510.97, z 684.26, angle 3.8, len 1.61) */
    const near = (x) => RD.reduce((m, p) => Math.abs(p[0] - x) < Math.abs(m[0] - x) ? p : m, RD[0]), a0 = near(1517.4), ad = [east[0] - west[0], east[1] - west[1]], al = Math.hypot(ad[0], ad[1]) || 1, c = [east[0] + ad[0] / al * 1.8, east[1] + ad[1] / al * 1.8], P = [];
    for (let k = 0; k <= 12; k++) { const u = k / 12, m = 1 - u; P.push([m * m * a0[0] + 2 * m * u * c[0] + u * u * east[0], m * m * a0[1] + 2 * m * u * c[1] + u * u * east[1]]); } return P; })(),   /* v12: two road points, the bridge axis, a short run past it (no V) */ t0: 19.6, dur: 1.8, t1: 23.8 },   // (v12) along the road and over the bridge   // (GM test v8) beside the road (north), gone before the columns reach the bridge   // (GM test v7) narrow, unit red   // gone before the fire
];
for (let k = 0; k < PONT.length; k++) { const { b, ex, ey } = axis(k); arrows.push({ side: "u", pts: [[b[0] + ex * 4.4, b[1] + ey * 4.4], [b[0] + ex * 2.4, b[1] + ey * 2.4], [b[0] + ex * 0.75, b[1] + ey * 0.75]], t0: TB[k] + 0.8, dur: 1.0, t1: T.D + 1, width: 0.2 }); }
// round 3 (critic A: the upper arrow crossed the river where its bridge was hidden under the head): each arrow runs up the east-bank
// approach and stops at its bridge's east end, so the new bridge stays visible and only the column crosses the water, on the bridge

// ---------------- fx ----------------
const bw3 = BRW.filter((_, i) => i % 6 === 0).map((p) => [p[0] + 0.12, p[1]]);
const SMK = { dir: [-1, 0], size: 0.7, alpha: 0.085, life: 8, muzzle: 6, windK: 0.7, cluster: [3.2, 1.6] };   // v5: thinner, broken   // (GM test v4) wispier
const csGuns = [[bwX(681.6) - 1.2, 681.6], [bwX(685.0) - 1.2, 685.0], [bwX(688.6) - 1.2, 688.6]];
const fx = {
  fires: [
    { region: BB, bridge: 0, t0: FIRE_T, t1: 40.4, preset: "bridge", waterGlow: { t1: 40.8 } },   // burns the trestle at t0 + 3.2
    { region: BB, at: [DOT[0], DOT[1], 0.2], t0: FIRE_T + 0.4, t1: 40.2, preset: "steamer" },           // the steamboat Dot, turned across the river as a bridge
    { region: BB, bridge: 0, burn: false, t0: 40.4, t1: T.D + 2, preset: "smoulder", cue: false },
  ],
  smokeLines: [
    { region: BB, pts: bw3, t0: 15.2, t1: TK + 0.4, cue: true, opts: { dir: [1, 0.05], rate: 0.8, volley: 2.2, roll: 0.9, size: 0.6, alpha: 0.07, life: 6, height: 3, muzzle: 6, windK: 0.8, cluster: [4.0, 2.0] } },   // v6: separate puffs, no column
    { region: BB, pts: [[1524.0, 679.8], [1524.8, 680.6]], t0: 19.0, t1: TK, opts: { ...SMK, dir: [-1, 0.3], rate: 2.6 } },
    { region: BB, pts: [[1525.6, 682.8], [1525.4, 686.6], [1525.6, 690.4]], t0: 19.8, t1: 23.4, opts: { ...SMK, rate: 2.5 } },
  ],
  guns: [
    { region: BB, shots: [13.7, 14.9, 16.0, 17.2, 18.3, 19.5].map((t, i) => { const g = usGuns[i % 2]; return { t, at: g, dir: [-1, 0.03 * (i % 3 - 1)], impact: [bwX(g[1]) - 0.6 - (i % 3) * 0.4, g[1] + ((i * 53) % 7 - 3) * 0.6], delay: 0.85 }; }) },
    { region: BB, shots: [14.3, 15.5, 16.7, 17.9, 19.1].map((t, i) => { const g = csGuns[i % 3]; return { t, at: g, dir: [1, 0], impact: [1527.0 + (i % 3) * 0.5, g[1] + ((i * 41) % 7 - 3) * 0.5], delay: 0.8 }; }) },
  ],
};

window.SEQ = {
  name: "S10", D: T.D, T, seed: 1863, date: "1863-05-17", troopsOpts: { look: "lineblocks", vesc: 2.0, turnMax: 0.62 },   // (GM test) the rout is a brisk walk
  regions: [BB],
  regionOpts: { [BB]: { troopScale: 1.4 } },   // round 2: boxes ~3 % of the frame width like v8 (with the v8 distances below)
  features: { [BB]: { bridges: [{ burn: FIRE_T + 3.2 }], pontoons: TB.map((at) => ({ at })) } },
  keys: [
    { t: 0.0, region: BB, at: [1518.4, 686.4], dist: 40, tilt: 46, yaw: -4, fov: 30 },
    { t: 12.9, region: BB, at: [1517.6, 684.6], dist: 32, tilt: 48, yaw: -8, fov: 30 },
    { t: 16.6, region: BB, at: [1521.6, 682.2], dist: 28, tilt: 50, yaw: -12, fov: 30 },
    { t: 20.0, region: BB, at: [1513.3, 684.6], dist: 13.4, tilt: 52, yaw: -8, fov: 30 },   // (box test v10) ONE still framing (works, fields, bridge, exit) while the boxes walk
    { t: 32.6, region: BB, at: [1513.3, 684.6], dist: 13.4, tilt: 52, yaw: -8, fov: 30 },
    { t: 37.6, region: BB, at: [1513.8, 686.0], dist: 29, tilt: 52, yaw: -2, fov: 30 },
    // round 2: "By the next morning" = a dip through dark (film.dim 40.5-42.1) with a CUT at its darkest point to the new-bridge sites,
    // the plaque rolls to 18 May 8:00 and the grade goes warm (morning sun), back to day before the dissolve into S11
    { t: 41.22, region: BB, at: [1512.8, 688.4], dist: 30, tilt: 51, yaw: 0, fov: 30 },
    { t: 41.22, region: BB, at: [1511.4, 693.0], dist: 33, tilt: 47, yaw: 2, fov: 30, ease: "cut" },
    { t: T.D, region: BB, at: [1510.8, 694.4], dist: 31.5, tilt: 48, yaw: 5, fov: 30, ease: "lin" },
  ],
  clouds: { [BB]: { shadows: true } },
  units, arrows,
  banners: [
    { general: "pemberton", keys: [[0, BR.x - 3.4, 682.6]], t0: T.pem + 0.1, t1: T.D + 1, escape: { road: RD, t0: T.ran + 0.6, v: 1.1, v2: 1.1, join: "west" } },
    { general: "grant", keys: [[0, 1527.2, 682.4], [T.ran + 1.0, 1527.2, 682.4], [32.6, 1518.3, 684.9], [41.18, 1518.3, 684.9], [41.26, 1516.2, 689.4]], t0: T.grant + 0.1, t1: T.D + 1 },
  ],
  labels: [
    { text: "Bovina", town: "Bovina", size: 18, t0: 2.4, t1: 9.6 },
    { text: "Big Black River", at: [1533.0, 678.2], size: 20, river: true, t0: T.bigblack + 0.1, t1: 9.4 },
    { text: "breastworks", at: [bwX(688.0) + 1.8, 688.0], size: 16, river: true, t0: T.breastworks + 0.1, t1: 14.6 },
    { text: "Big Black River", at: [1508.2, 694.6], size: 18, river: true, t0: 41.6, t1: 44.6 },
  ],
  fx,
  generals: { lawler: { img: "seq/lawler.png", side: "us", name: "Lawler", full: "Michael K. Lawler", role: "Brigadier General" } },
  overlay: [
    ["plaque.date", 0.35, { month: "May 1863", day: "17", weekday: "Day 18", note: "Sunday · Big Black River" }],
    ["legend", 0.9, T.eighteen - 0.5, { entries: [{ name: "Union", sub: "Grant", color: "#3C6E9E" }, { name: "Confederates", sub: "Pemberton", color: "#9C3A35" }] }],
    ["timeline.show", 1.2, { month: "May", year: "1863", days: ["14", "15", "16", "17", "18", "19"], at: 3.0 }],
    ["timeline.seal", 1.5, { at: 3.0, name: "Champion Hill" }],
    ["label", T.loop + 0.1, T.backs - 0.3, { name: "A loop of the river", sub: "the rearguard on the east bank", world: [1516.8, 686.4], side: "cs", marker: false }],
    ["label", T.backs + 0.1, T.minutes + 0.3, { name: "The river at their backs", sub: "the bridges behind the line", world: [BR.x, BR.z], side: "cs" }],
    ["plaque.clock", 13.5, { time: "8:55", note: "Big Black River bridge", header: "17 May 1863 · Day 18" }],
    ["plaque.run", 15.2, T.nine, "9:05"],
    ["medallion", { kind: "card", general: "lawler", sub: "Lawler's brigade · Carr's division", world: [1527.8, 679.4], offset: [240, 40], tIn: T.lawler + 0.1, tOut: T.through + 1.2 }],
    ["plaque.note", T.charged, "Lawler's charge on the northern flank"],
    ["label", T.taken - 0.6, T.ran - 0.2, { name: "The line is taken", sub: "a little after nine · Grant's Memoirs", world: [1520.6, 686.0], side: "us" }],
    ["timeline.seal", T.taken, { at: 4.0, name: "Big Black" }],
    ["timeline.hide", 27.8],   // round 3: the bar out before the boxes reach the bottom of the frame and the ledger comes in (one big card at a time)
    ["plaque.note", T.ran, "The defenders run for the bridges"],
    ["label", T.fire + 0.1, T.guns - 0.3, { name: "The bridges burn", sub: "fired by the retreating Confederates", world: [BR.x - 0.6, BR.z + 0.8], side: "cs", marker: false }],
    ["ledger.show", T.eighteen - 0.3, { title: "Big Black River", sub: "17 - 18 May 1863" }],
    ["ledger.add", T.guns, { who: "18 guns taken", stamp: false }],
    ["ledger.add", T.prisoners + 0.6, { who: "1,751 prisoners", note: "by Grant's count", stamp: false }],
    ["number", T.prisoners + 0.6, T.stopped - 0.2, { value: 1751, round: 1, world: [1516.6, 687.6], size: 104 }],
    ["ledger.add", T.single, { who: "Grant stopped", note: "a single day", stamp: false }],
    ["film.dim", 40.5, 41.35, 0.9],
    ["film.grade", 41.22, "dusk", 0.4],
    ["film.grade", 44.4, "day", 1.0],
    ["plaque.clock", 41.22, { time: "8:00", note: "Monday · three new bridges", header: "18 May 1863 · Day 19" }],
    ["ledger.add", T.three + 0.5, { who: "Three new bridges", note: "by 8 a.m., 18 May", stamp: false }],
  ],
};
})();
