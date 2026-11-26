// V2 LOOK TEST (a) = copy of S04 (film S04 untouched): wide map with legend + timeline + date plate + v8 clouds/grade.
// S04 THE LONG RETREAT (Sep - Dec 1776). D = 66.32 s (python3 washington/tools/scene_times.py S04 --words). Regions: colonies (z9 wide),
// jersey (z10 wide, winter). No dive (structure = Jackson S04: wide map shots joined by dissolves).
// colonies (starts on S03's last camera): off Manhattan, WHITE PLAINS stamp, 16 November: Fort Washington stormed (stamp, the garrison
// greys, 3,000 on "three thousand"), the chase across New Jersey to the Delaware -> dissolve jersey (winter): 7-8 December, the army crosses
// at Trenton (break rank onto the boats), every boat for miles pulled over to the Pennsylvania bank (separate boats, one by one); the
// British winter posts (Trenton, Bordentown, Princeton); three Hessian regiments at Trenton labelled on their words; Rall banner (initials);
// the blue camp across the river thins out; ENLISTMENTS END 31 December.
// Facts: FACT_NOTES_brooklyn.md 30-35 (White Plains, Fort Washington 16 Nov ~2,800-2,900 prisoners, the retreat), FACT_NOTES_jersey.md
// (crossing 7-8 Dec, boats removed for ~60 miles, Congress to Baltimore, posts, Rall's brigade ~1,400, enlistments 31 Dec).
(() => {
const T = { D: 66.32,
  plan: 0.69, winter: 2.67, drove: 3.93, manhattan: 5.11, beat: 5.97, white: 6.85, sixteenth: 9.07, stormed: 10.29, fortw: 10.73, hudson: 12.47,
  took: 13.45, nearly: 13.61, three: 14.33, thousand: 14.65, prisoner: 15.45,
  then: 16.71, chased: 17.03, across: 18.97, newjersey: 19.37, delaware: 21.69,
  seventh: 23.79, eighth: 24.31, december: 24.55, crossed: 25.41, penn: 26.03, every: 27.61, boat: 27.99, miles: 28.53, follow: 31.71,
  congress: 32.93, fled: 33.37, phila: 33.75,
  settled: 35.69, posts: 36.81, jerseyW: 37.61, trenton: 40.09, three2: 40.95, hessian: 41.35, regiments: 41.81, ralls: 43.14, lossberg: 43.91,
  knyp: 45.27, fourteen: 46.27, men: 46.79, colonel: 47.99, rall: 49.16,
  bank: 50.61, army: 51.97, melting: 52.57, thousands: 54.23, sick: 54.89, shoes: 56.33, enlist: 57.51, thirtyfirst: 60.29, dec31: 60.77,
  month: 62.63, gone: 64.09 };
const CO = "colonies", JE = "jersey";
const P = (n, r) => VX.place(n, r);
// ---------------- colonies geography (z9) ----------------
const FW = P("Fort Washington", CO), FL = P("Fort Lee", CO), NB = P("New Brunswick", CO), TRc = P("Trenton", CO), WP = VX.ll(41.033, -73.763, CO);
const HARLEM = [633.6, 241.0];                                      // where S03 left the army
// ---------------- jersey geography (z10): the Delaware, its banks ----------------
const DEL = VX.river(JE, "Delaware River").pts;
const RV = (k) => { const L = VX.len(DEL), p = VX.along(DEL, L * k); let h = 0, bd = 1e9; for (const q of DEL) { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; h = q[2] || 0; } }
  return { x: p[0], y: p[1], dx: p[2], dy: p[3], h }; };            // flow NW -> SE; NJ = left bank (dy, -dx), PA = right bank (-dy, dx)
const bank = (k, side, d) => { const r = RV(k), s = side === "NJ" ? 1 : -1; return [r.x + r.dy * s * d, r.y - r.dx * s * d]; };
const kOf = (x, y) => { const L = VX.len(DEL); let bk = 0, bd = 1e9; for (let k = 0; k <= 1; k += 0.002) { const p = VX.along(DEL, L * k), d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; bk = k; } } return bk; };
const TRj = VX.town("Trenton", JE), BOR = VX.town("Bordentown", JE), PRI = VX.town("Princeton", JE), MCK = VX.town("McConkey's Ferry", JE);
const kT = kOf(668, 1033);                                          // the river at Trenton (the ferry)
const HW = 1.3;                                                     // half the river's width (w 2.6)

// ---------------- units ----------------
const units = [];
const U = (o) => { units.push({ type: "inf", n: 1, arrive: false, ...o }); return units.length - 1; };
// colonies: the army off Manhattan to White Plains; the Fort Washington garrison (taken); the army across NJ to Trenton
U({ side: "u", region: CO, n: 2, face: -Math.PI / 2, keys: [[0, ...HARLEM], [0.6, ...HARLEM], [12.0, 662.0, 216.0]], t1: 12.4 });   // round 1: <= 4 u/s, the arrow carries the rest
U({ side: "u", region: CO, n: 1, face: Math.PI, keys: [[0, FW[0] + 1.5, FW[1] + 2.0]], t0: T.sixteenth - 0.4, cap: T.stormed + 1.2, t1: T.D });
U({ side: "r", region: CO, n: 2, face: -Math.PI / 2, keys: [[0, HARLEM[0] - 2, HARLEM[1] + 22], [0.8, HARLEM[0] - 2, HARLEM[1] + 22], [12.0, 652.0, 234.0]], t0: 1.0, t1: 12.4 });
U({ side: "u", region: CO, n: 2, face: Math.PI * 0.75, keys: [[0, TRc[0] + 6, TRc[1] - 6]], t0: T.delaware - 0.3 });
U({ side: "r", region: CO, n: 2, face: Math.PI * 0.75, keys: [[0, NB[0] - 6, NB[1] + 8], [T.delaware + 0.4, NB[0] - 40, NB[1] + 44]], t0: T.chased + 0.4 });
// jersey: the army on the NJ bank at Trenton crosses (break rank onto the boats at three landings), reappears on the PA bank
const LAND = [kT - 0.032, kT, kT + 0.032];   // round 1: wider spacing for the bigger wide-map blocks
const decks = [], ESC = [];
LAND.forEach((k, i) => { const r = RV(k), near = bank(k, "NJ", HW + 0.55), far = bank(k, "NJ", HW - 0.35), out = bank(k, "NJ", HW - 1.0), back = bank(k, "NJ", HW + 1.6);
  decks.push({ x: (near[0] + far[0]) / 2, z: (near[1] + far[1]) / 2, angle: Math.atan2(far[1] - near[1], far[0] - near[0]), len: Math.hypot(far[0] - near[0], far[1] - near[1]), deck: r.h + 1.5, wl: r.h });
  ESC.push({ road: [back, near, far, out], join: "nearest", fade: null, vanish: [0.1, 0.7], front: true }); });
const toPA = (k) => Math.atan2(-RV(k).dx, RV(k).dy);                // facing across the river toward PA (right bank)
LAND.forEach((k, i) => { const p = bank(k, "NJ", HW + 4.2 + (i % 2) * 1.2);
  U({ side: "u", region: JE, face: toPA(k), keys: [[0, ...p]], escape: { ...ESC[i], t0: 23.0 + i * 0.7 } }); });
// the PA bank: the army that crossed + the camp along the river up to McConkey's (blocks thin out from "melting away")
const CAMPK = [[kT - 0.032, 4.2, 27.4], [kT, 5.4, 28.0], [kT + 0.032, 4.2, 28.6], [kT - 0.07, 4.0, 0], [kT - 0.12, 4.6, 0], [kT - 0.17, 4.2, 0], [kT - 0.22, 4.8, 0], [kT - 0.27, 4.4, 0]];
const FADE = [null, 62.6, null, 56.2, null, 58.4, 60.9, null];
CAMPK.forEach(([k, d, t0], i) => { const p = bank(k, "PA", HW + d), inl = bank(k, "PA", HW + d + 1.6), f = Math.atan2(RV(k).dx, -RV(k).dy);
  U({ side: "u", region: JE, face: f, t0: t0 || 23.0, t1: FADE[i] || 1e9, keys: t0 ? [[0, ...p], [t0, ...p], [t0 + 3.4, ...inl]] : [[0, ...inl]] }); });
// the British winter posts: three Hessian regiments into Trenton (Rall, Lossberg, Knyphausen), Bordentown, Princeton
const HESS = [[TRj[0] - 4.4, TRj[1] - 5.2], [TRj[0] + 4.8, TRj[1] - 5.0], [TRj[0] + 0.6, TRj[1] - 11.4]];
const PN = (p, dx, dy) => [p[0] + dx, p[1] + dy];
HESS.forEach((p, i) => U({ side: "r", region: JE, face: Math.PI * 0.75, t0: T.settled - 0.6 + i * 0.4, keys: [[0, p[0] + 7, p[1] - 9], [T.settled - 0.4 + i * 0.4, p[0] + 7, p[1] - 9], [T.posts + 3.6 + i * 0.4, ...p]] }));
U({ side: "r", region: JE, face: 2.24, t0: T.settled - 0.2, keys: [[0, ...PN(BOR, 2, -3)]] });   // round 1: settles in place (no oblique walk)
U({ side: "r", region: JE, n: 2, face: 2.19, t0: T.settled, keys: [[0, ...PN(PRI, 1, 1)]] });

// ---------------- boats: every boat on the river pulled over to the PA bank, one by one ----------------
const BK_ = [0.08, 0.16, 0.24, 0.31, 0.37, kT - 0.03, kT + 0.03, kT + 0.08, kT + 0.13, 0.03];
const boats = BK_.map((k, i) => { const a = bank(k, "NJ", HW - 0.45), b = bank(k + 0.004 * (i % 3), "PA", HW - 0.45), r = RV(k), m = [(a[0] + b[0]) / 2 + r.dx * 0.6, (a[1] + b[1]) / 2 + r.dy * 0.6];
  const path = [a, m, b], L = VX.len(path), t0 = T.every - 0.3 + [3, 5, 1, 7, 0, 2, 4, 6, 8, 9][i] * 0.42, dur = 2.6 + 0.6 * VX.hsh(i, 2);
  return { region: JE, kind: "barge", n: 1, path, sAt: (t) => 0.02 + (L - 0.04) * VX.sstep(t0, t0 + dur, t), wake: (t) => t > t0 + 0.1 && t < t0 + dur - 0.2, t0: 23.0, t1: T.D + 1, size: 1.3, lamp: false }; });
// the boats that took the army over at Trenton (the three landings): cross loaded, stay on the PA bank
LAND.forEach((k, i) => { const a = bank(k, "NJ", HW - 0.9), b = bank(k, "PA", HW - 0.5), path = [a, b], L = VX.len(path), t0 = 26.0 + i * 0.6;
  boats.push({ region: JE, kind: "barge", n: 1, path, sAt: (t) => 0.02 + (L - 0.04) * VX.sstep(t0, t0 + 2.4, t), wake: (t) => t > t0 + 0.1 && t < t0 + 2.2, t0: 23.0, t1: T.D + 1, size: 1.3, lamp: false }); });

// ---------------- arrows ----------------
const arrows = [
  { side: "r", region: CO, width: 0.28, maxWidth: 0.28, pts: [[HARLEM[0] - 8, HARLEM[1] + 24], [HARLEM[0] - 4, HARLEM[1] - 26], [WP[0] - 22, WP[1] + 30]], t0: T.drove, dur: 2.2, t1: 9.6 },
  ...[[[FW[0] + 6, FW[1] - 22], FW], [[FW[0] + 22, FW[1] + 4], FW], [[FW[0] - 3, FW[1] + 26], FW]].map(([a, b], i) =>
    ({ side: "r", region: CO, width: 0.25, maxWidth: 0.25, pts: [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], [b[0] + (a[0] - b[0]) * 0.12, b[1] + (a[1] - b[1]) * 0.12]], t0: T.stormed - 0.1 + i * 0.25, dur: 1.2, t1: 16.4 })),
  // the retreat across New Jersey, the British close behind
  { side: "u", region: CO, width: 0.3, maxWidth: 0.3, pts: [[FL[0] - 4, FL[1] + 6], [560, 300], [NB[0] + 4, NB[1] - 4], [(NB[0] + TRc[0]) / 2 + 26, (NB[1] + TRc[1]) / 2 - 26]],   /* V2 r2: GM-width line, head short of Trenton (clear of the legend) */ t0: T.across - 0.2, dur: 2.8, t1: T.D },
  { side: "r", region: CO, width: 0.28, maxWidth: 0.28, pts: [[FL[0] - 10, FL[1] + 26], [575, 318], [NB[0] + 14, NB[1] - 2]], t0: T.chased + 0.1, dur: 2.4, t1: T.D },
];

// ---------------- generals, banners, labels ----------------
const generals = {
  washington: { img: "seq/washington.png", flag: "seq/grand_union_flag.png", side: "us", name: "Washington", full: "George Washington", role: "General" },
  rall: { img: "seq/rall.png", flag: "seq/gb1707_union_flag.png", side: "cs", name: "Rall", full: "Johann Rall", role: "Colonel" },   // no likeness: initials (as Jackson's Keane)
};
const banners = [
  { general: "washington", region: CO, keys: [[0, HARLEM[0] + 4, HARLEM[1] - 4], [T.drove, HARLEM[0] + 4, HARLEM[1] - 4], [12.0, 666.0, 208.0]], t0: T.drove - 0.05, t1: 9.0 },
  { general: "washington", region: JE, keys: [[0, ...bank(kT, "PA", HW + 7.4)]], t0: 28.4, t1: 34.6 },
  { general: "rall", region: JE, keys: [[0, TRj[0] + 5.6, TRj[1] - 11.4]], t0: T.colonel - 0.05, t1: 51.0 },
  { general: "washington", region: JE, keys: [[0, ...bank(kT - 0.15, "PA", HW + 7.6)]], t0: T.army - 0.05, t1: T.D + 1 },
];
const lab = (text, at, t0, d = 3.5, o = {}) => ({ text, at, t0, t1: t0 + d, region: JE, size: 15, ...o });
const labels = [
  { text: "Fort Washington", region: CO, at: [FW[0] - 14, FW[1] - 4], size: 17, t0: T.fortw - 0.05, t1: T.fortw + 3.5 },   // V2 r2: on its word
  { text: "Hudson River", region: CO, at: [FW[0] - 11, FW[1] + 20], size: 17, river: true, t0: T.hudson - 0.05, t1: T.hudson + 3.5 },
  { text: "Manhattan", region: CO, at: P("Manhattan", CO), size: 20, t0: T.manhattan - 0.05, t1: T.manhattan + 3.6 },   // V2: carved place name on its word
  { text: "Delaware River", region: CO, at: [TRc[0] - 14, TRc[1] + 10], size: 18, river: true, t0: T.delaware - 0.05, t1: T.D },
  lab("Delaware River", bank(kT - 0.2, "PA", HW + 2.5), 24.0, 4.0, { river: true, size: 17 }),
  lab("Trenton", [TRj[0] + 1.0, TRj[1] + 2.2], T.trenton - 0.05, 4.0, { size: 18 }),
  lab("Rall", [HESS[0][0], HESS[0][1] + 2.4], T.ralls - 0.05, 4.6, { size: 16 }),
  lab("Lossberg", [HESS[1][0], HESS[1][1] + 2.4], T.lossberg - 0.05, 4.2, { size: 16 }),
  lab("Knyphausen", [HESS[2][0], HESS[2][1] - 2.0], T.knyp - 0.05, 4.0, { size: 16 }),
];
const pulses = VX.pulses([
  { region: JE, at: TRj, r: 4.0, t0: T.trenton - 0.05, t1: 46.0, period: 1.6, color: [255, 214, 120] },
]);

window.SEQ = {
  grade: { wide: { toe: 14, ct: 0.96, sat: 0.95 } },   // V2: = the v8 clip wide grade
  name: "_v2test_a", D: T.D, T, seed: 1776, date: "1776-11-16",
  regions: [CO, JE],
  troops: "blocks", troopsOpts: { look: "lineblocks", size: 1.44, depthK: 0.44, sideCol: { u: "#3f5aa0", r: "#be3a2a" }, pal: { u: { coat: 0x6e7cab, plate: 0x7d8ec6 } } },   // V2 r2: steel blue as v14 (critic 1 #16)   // V2: = v14
  regionOpts: { [CO]: { troopScale: 6 }, [JE]: { troopScale: 3, decks } },   // V2: wide blocks ~2.5 % of the frame width (v8 wide)
  features: { [JE]: { bridges: [0, 1, 2, 3, 4, 5, 6].map(() => ({ hidden: true })), houseK: 0.35 } },   // creek bridges hidden; smaller houses (long houses on crossed streets read as crosses from far away)
  keys: [
    { t: 0, region: CO, at: [610.0, 264.0], dist: 285, tilt: 35, yaw: 0, fov: 30 },                    // = S03's last camera
    { t: 7.6, region: CO, at: [650.0, 196.0], dist: 250, tilt: 24, yaw: 0, fov: 30, ease: "io" },         // White Plains
    { t: 12.6, region: CO, at: [636.0, 222.0], dist: 200, tilt: 30, yaw: 0, fov: 30, ease: "io" },        // Fort Washington
    { t: 16.2, region: CO, at: [634.0, 226.0], dist: 196, tilt: 31, yaw: 0, fov: 30, ease: "lin" },
    { t: 21.0, region: CO, at: [482.0, 372.0], dist: 440, tilt: 32, yaw: 0, fov: 30, ease: "io" },        // across New Jersey
    { t: 23.2, region: CO, at: [470.0, 384.0], dist: 430, tilt: 32, yaw: 0, fov: 30, ease: "lin" },
    { t: 23.2, region: JE, at: [652.0, 1022.0], dist: 92, tilt: 44, yaw: 0, fov: 30, ease: "cut", dissolve: 0.9 },   // jersey: the crossing at Trenton
    { t: 30.0, region: JE, at: [640.0, 1010.0], dist: 128, tilt: 42, yaw: 0, fov: 30, ease: "io" },       // the boats along the river
    { t: 34.6, region: JE, at: [636.0, 1004.0], dist: 134, tilt: 42, yaw: 0, fov: 30, ease: "lin" },
    { t: 38.4, region: JE, at: [682.0, 1010.0], dist: 166, tilt: 36, yaw: 0, fov: 30, ease: "io" },       // the winter posts
    { t: 42.0, region: JE, at: [679.0, 1024.0], dist: 66, tilt: 46, yaw: 0, fov: 30, ease: "io" },        // Trenton: the Hessians
    { t: 49.6, region: JE, at: [677.0, 1024.0], dist: 62, tilt: 47, yaw: 0, fov: 30, ease: "lin" },
    { t: 53.0, region: JE, at: [632.0, 1004.0], dist: 104, tilt: 43, yaw: 0, fov: 30, ease: "io" },       // the blue camp across the river
    { t: T.D, region: JE, at: [640.0, 1010.0], dist: 112, tilt: 42, yaw: 0, fov: 30, ease: "lin" },
  ],
  clouds: { [CO]: { scatter: { seed: 11, n: 24, med: 15 }, keepClear: [[480, 380, 40, 1, 1], [636, 224, 30, 1, 1]] }, [JE]: { scatter: { seed: 7, n: 8, med: 40 } } },   // round 2 (author A for the lead): visible wide clouds
  units, arrows, boats, generals, banners, labels,
  overlay: [
    ["plaque.date", 0.4, { month: "1776", day: "", weekday: "", note: "" }],   // = S03's last plate (round 1: no stale 30 August)
    // V2: THE ARMIES key + the wax-seal campaign timeline on every map shot (v8: legend 1.9 s, timeline 1.4 s)
    ["legend", 0.9, T.D + 1, { entries: [{ name: "Americans", sub: "Washington", color: "#3C6E9E" }, { name: "British", sub: "Howe", color: "#9C3A35" }] }],
    ["timeline.show", 0.6, { month: "1776", year: "1777", cells: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"], at: 1.5 }],
    ["timeline.seal", 0.7, { at: 0.95, name: "Brooklyn" }],
    ["timeline.go", T.sixteenth, { at: 3.5, d: 1.2 }],
    ["timeline.go", T.eighth, { at: 4.25, d: 1.2 }],
    (O, c) => stamp(c, "WHITE PLAINS", T.white - 0.05, T.white + 3.4, [WP[0] - 6, WP[1] + 16]),
    ["plaque.date", T.sixteenth - 0.05, { month: "November 1776", day: "16", weekday: "Saturday", note: "Fort Washington" }],
    (O, c) => stamp(c, "FORT WASHINGTON", T.fortw - 0.05, T.nearly - 0.2, [FW[0] + 4, FW[1] + 8]),
    ["number", T.three - 0.05, T.then - 0.2, { value: 3000, round: 1000, world: [FW[0] + 6, FW[1] + 12], size: 100 }],
    ["label", T.prisoner - 0.05, T.then + 0.2, { name: "Nearly 3,000 prisoners", sub: "", world: [FW[0] + 10, FW[1] + 30], side: "us", marker: false }],
    ["plaque.date", T.eighth - 0.05, { month: "December 1776", day: "8", weekday: "Sunday", note: "into Pennsylvania" }],
    ["plaque.note", T.congress - 0.05, "Congress flees Philadelphia"],
    ["plaque.date", T.settled - 0.1, { month: "December 1776", day: "", weekday: "", note: "" }],   // round 2: no "8 December" over the winter posts
    ["label", T.hessian - 0.05, T.ralls - 0.3, { name: "Hessians", sub: "three regiments", world: [TRj[0] + 0.6, TRj[1] - 14.0], side: "uk", marker: false }],
    ["label", T.fourteen - 0.05, T.colonel - 0.3, { name: "About 1,400 men", sub: "", world: [TRj[0] + 0.6, TRj[1] - 14.0], side: "uk", marker: false }],
    ["label", T.thirtyfirst - 0.05, T.D, { name: "Enlistments end", sub: "31 December", world: bank(kT - 0.15, "PA", HW + 12.0), side: "us", marker: false }],
  ],
  build: (ctx) => { pulses.build(ctx); },
  draw: (t, c) => { pulses.draw(t, c); const sc = 1920 / c.world.renderer.domElement.width * (c.world.renderer.getPixelRatio ? c.world.renderer.getPixelRatio() : 1);
    for (const p of PINS) { const s = c.world.projectMap(p.world[0], p.world[1], 0.3); p.el.style.transform = `translate(${(s.x * sc).toFixed(1)}px,${(s.y * sc).toFixed(1)}px)`; } },
};
// ---------------- red ink stamp pinned to the ground (Jackson S06 recipe) ----------------
const PINS = [];
function stamp(c, text, t0, t1, world) {
  const host = document.querySelector("#ov .gmo") || document.getElementById("ov"), el = document.createElement("div");
  el.style.cssText = "position:absolute;left:0;top:0;z-index:40;pointer-events:none;width:0;height:0";
  el.innerHTML = `<span class="stamp" style="position:absolute;left:0;top:0;transform:translate(-50%,-50%);color:#A8261B;font-size:68px;padding:8px 26px 5px;border-width:5px;white-space:nowrap;background:rgba(240,230,205,.55)">${text}</span>`;
  host.appendChild(el); window.gsap.set(el, { autoAlpha: 0 });
  c.tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, t0);
  c.tl.fromTo(el.firstChild, { scale: 2.3, rotation: -14, opacity: 0 }, { scale: 1, rotation: -6, opacity: 0.94, duration: 0.24, ease: "power4.in", immediateRender: false }, t0);
  c.tl.to(el, { autoAlpha: 0, duration: 0.5 }, t1);
  PINS.push({ el, world });
}
})();
