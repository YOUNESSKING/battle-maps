// S02 BACKGROUND: NEW YORK, 1776 (44.74 s; washington/tools/scene_times.py S02 --words). Structure as ajackson S02 (one wide map, slow camera).
//  0.0-18.6  colonies, summer: the British fleet as many separate ships (anchored off Staten Island, more sailing in past Sandy Hook,
//            a group in Gravesend Bay); plate SUMMER 1776 on "seventeen seventy-six"; NEW YORK on its word; 32,000 on "thirty-two
//            thousand" + SOLDIERS; HESSIANS tag on the ships on "the Hessians".
// 18.6-31.2  the camera drifts onto the west end of Long Island: plate 27 AUGUST 1776; LONG ISLAND; the American line on the wooded ridge
//            (three blue lines facing south), Grant + Heister in front of it; night falls on "through the night": the red arrow of the
//            flank march round the American left through the pass (A PASS ALMOST UNGUARDED); at first light a red line comes in
//            behind the left (from the east) on "fell on the Americans from behind".
// 31.2-37.4  the line breaks: the blue lines turn about and fall back north toward the Heights; 1,000 + MEN CAPTURED on their words.
// 37.4-42.8  dissolve to brooklyn: the survivors walk into the works on Brooklyn Heights, the East River behind them (BROOKLYN HEIGHTS,
//            EAST RIVER on their words).
// 42.8-44.7  dissolve to the colonies hand-over camera = S03's first camera (S03 NOTES / S02 NOTES "HAND-OVER").
(() => {
const T = { D: 44.74, four: 0.32, summer: 1.88, e1776: 3.05, britain: 4.48, largest: 5.32, york: 8.30, hundreds: 9.90, ships: 10.14,
  thirty: 11.57, thousand: 12.02, soldiers: 12.48, among: 13.06, germans: 15.06, hired: 15.36, princes: 16.46, hessians: 17.36,
  on: 18.56, twenty7: 19.23, august: 19.74, long: 20.48, british: 21.92, marched: 22.18, night: 23.12, around: 23.36, left: 24.40,
  pass: 25.74, unguarded: 26.94, fell: 28.32, americans: 29.02, behind: 29.84, line: 31.34, broke: 32.18, about: 33.30, thousand2: 33.62,
  captured: 34.52, hundreds2: 35.50, killed: 36.18, rest: 38.12, fell2: 38.36, forts: 39.42, brooklyn: 40.00, heights: 40.40,
  east: 41.50, river: 41.74, backs: 42.48 };
const CO = "colonies", BR = "brooklyn";
const P = (n, r) => VX.place(n, r);
const lerp2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const CUT_B = 37.4, CUT_H = 42.75;
const BF = P("Fulton Ferry landing (Brooklyn ferry)", CO);   // hand-over anchor (S03's dive starts here)
const OVS3 = [2489.0 / 4, 1157.0 / 4];   // S03's dive point (brooklyn OVB / 4)
const HAND = { region: CO, at: [OVS3[0] - 6, OVS3[1] + 14], dist: 300, tilt: 36, yaw: 0, fov: 30 };   // = S03 keys[0] exactly

// ---------------- the fleet (Jackson's FLEET helper: separate ships, own path, start and speed) ----------------
const FLEET = (path, n, seed, o) => { const L = VX.len(path), out = [];
  const nrm = (i) => { const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]; };
  for (let k = 0; k < n; k++) { const h = (j) => VX.hsh(seed * 31 + k, j), off = (h(1) - 0.5) * 2 * o.spread, drift = (h(2) - 0.5) * o.spread * 0.8;
    let acc = 0; const P = path.map((p, i) => { if (i) acc += Math.hypot(p[0] - path[i - 1][0], p[1] - path[i - 1][1]); const d = off + drift * acc / L, nv = nrm(i); return [p[0] + nv[0] * d, p[1] + nv[1] * d]; });
    const speed = o.speed * (0.9 + 0.2 * h(3)), lag = (k === 0 ? 0 : (0.25 + 0.75 * h(4)) * o.depth) + (h(5) > 0.8 ? o.depth * 0.6 : 0);
    out.push({ region: o.region, kind: "ship", n: 1, t0: o.t0, t1: o.t1, size: o.size * (0.9 + 0.2 * h(6)), lamp: false, wake: o.wake !== false, path: P, s0: o.s0 - lag + (o.dt || 0) * speed, speed }); }
  return out; };
const SANDY = [[618, 412], [614, 392], [609, 372], [604, 354], [600, 343]];          // in past Sandy Hook, north toward the Narrows
const boats = [
  ...FLEET(SANDY, 9, 41, { region: CO, t0: -1, t1: T.on + 1.2, size: 2.2, spread: 7, depth: 40, speed: 1.6, s0: 40 }),
  ...FLEET([[592, 352], [597, 341], [600, 333]], 10, 43, { region: CO, t0: -1, t1: T.on + 1.2, size: 2.0, spread: 6, depth: 14, speed: 0.12, s0: 16, wake: false }),   // anchored off Staten Island
  ...FLEET([[607, 352], [612, 343], [615, 338]], 6, 47, { region: CO, t0: -1, t1: T.on + 1.2, size: 2.0, spread: 4, depth: 8, speed: 0.1, s0: 10, wake: false }),     // Gravesend Bay
];

// ---------------- 27 August (colonies) ----------------
const RIDGE = [[617.4, 306.6], [627.4, 305.8], [636.4, 302.2]];                     // Heights of Guan: Battle Hill, Flatbush pass, Bedford pass
const WORKS = [[615.4, 294.4], [624.0, 292.8], [632.6, 291.4]];                     // behind the Brooklyn works
const units = [];
RIDGE.forEach((p, i) => units.push({ region: CO, side: "u", type: "inf", n: 1, bw: 0.56, skirmish: false, face: Math.PI / 2, t0: 17.8, t1: CUT_B + 0.2, arrive: false,
  keys: [[0, ...p], [T.broke + i * 0.25, ...p], [T.broke + 4.6 + i * 0.35, ...WORKS[i]]] }));
// Grant (Gowanus road) and Heister's Hessians (Flatbush) in front of the ridge: close up on "fell on", halt
[[617.4, 313.8], [627.4, 313.2]].forEach((p, i) => units.push({ region: CO, side: "r", type: "inf", n: 1, bw: 0.56, skirmish: false, face: -Math.PI / 2, t0: 17.8, t1: CUT_B + 0.2, arrive: false,
  keys: [[0, ...p], [T.fell + i * 0.3, ...p], [T.line + 0.2 + i * 0.3, p[0], p[1] - 1.0]] }));
// the flank column comes in behind the American left (from the east) at first light
units.push({ region: CO, side: "r", type: "inf", n: 1, bw: 0.56, skirmish: false, face: Math.PI, t0: T.unguarded + 0.1, t1: CUT_B + 0.2, arrive: false, keys: [[0, 650.0, 297.0], [T.unguarded + 0.4, 650.0, 297.0], [T.behind, 645.0, 297.0]] });
const JPASS = P("Jamaica Pass", CO), FLAT = P("Flatlands", CO);
const arrows = [
  { region: CO, side: "r", pts: [[FLAT[0] + 1, FLAT[1] - 2], [651, 310], [JPASS[0] - 1, JPASS[1] + 2.5], [652, 297.4], [645, 297.6]], t0: T.marched, dur: 3.6, t1: T.line, width: 0.5, maxWidth: 0.5 },
];

// ---------------- brooklyn (z11): the survivors walk into the works ----------------
const BRU = [[2490.0, 1180.0, 2488.6, 1162.0], [2499.6, 1178.6, 2498.6, 1160.2], [2508.8, 1173.6, 2508.0, 1155.4]];
BRU.forEach(([x0, y0, x1, y1], i) => units.push({ region: BR, side: "u", type: "inf", n: 2, face: Math.atan2(y1 - y0, x1 - x0), t0: CUT_B - 0.3, t1: T.D + 1, arrive: false,
  keys: [[0, x0, y0], [CUT_B - 1.2 + i * 0.3, x0, y0], [CUT_B + 4.6 + i * 0.3, x1, y1]] }));

const pulses = VX.pulses([{ region: CO, at: [JPASS[0], JPASS[1]], t0: T.pass - 0.05, t1: T.fell, r: 5, color: [232, 196, 108], period: 1.6 }]);

window.SEQ = {
  grade: { wide: { toe: 14, ct: 1.03, sat: 1.04 } },   // Jackson: richer wide overhead maps
  name: "S02", D: T.D, T, seed: 1776, date: "1776-08-27",
  regions: [CO, BR],
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  regionOpts: { [CO]: { troopScale: 10 }, [BR]: { troopScale: 3.0 } },
  keys: [
    // the harbour from altitude: the fleet below Staten Island, then New York
    { t: 0.0, region: CO, at: [604, 352], dist: 300, tilt: 38, yaw: 0, fov: 30 },
    { t: T.york, region: CO, at: [606, 336], dist: 272, tilt: 39, yaw: 0, fov: 30, ease: "lin" },
    { t: T.hessians + 0.4, region: CO, at: [610, 334], dist: 240, tilt: 40, yaw: 0, fov: 30, ease: "lin" },
    // drift onto the west end of Long Island (the ridge, the passes); night falls for the flank march, first light for "fell on"
    { t: T.long + 0.8, region: CO, at: [632, 309], dist: 150, tilt: 40, yaw: 0, fov: 30, night: 0 },
    { t: T.night + 0.8, region: CO, at: [636, 307], dist: 146, tilt: 40, yaw: 0, fov: 30, night: 0.55, ease: "lin" },
    { t: T.unguarded + 0.6, region: CO, at: [637, 306], dist: 142, tilt: 41, yaw: 0, fov: 30, night: 0.5, ease: "lin" },
    { t: T.behind, region: CO, at: [634, 305], dist: 136, tilt: 41, yaw: 0, fov: 30, night: 0, ease: "lin" },
    { t: CUT_B, region: CO, at: [627, 301], dist: 128, tilt: 42, yaw: 0, fov: 30, ease: "lin" },
    // brooklyn: into the works, the East River behind them
    { t: CUT_B, region: BR, at: [2496, 1170], dist: 58, tilt: 47, yaw: -6, fov: 30, ease: "cut", dissolve: 0.9 },
    { t: CUT_H, region: BR, at: [2492, 1160], dist: 70, tilt: 45, yaw: -4, fov: 30, ease: "lin" },
    // the hand-over (S03 starts here)
    { t: CUT_H, ...HAND, ease: "cut", dissolve: 0.9 },
    { t: T.D, ...HAND, ease: "lin" },
  ],
  clouds: { [CO]: { scatter: { seed: 3, n: 10, med: 18 }, keepClear: [[619, 288, 40, 1, 0.9], [604, 350, 45, 1, 0.8], [632, 306, 40, 1, 0.9]] }, [BR]: { shadows: true } },
  units, arrows, boats,
  labels: [
    { text: "New York", at: [P("New York", CO)[0] - 2, P("New York", CO)[1] - 3], size: 24, t0: T.york, t1: T.york + 3.6, region: CO },
    { text: "Long Island", at: [646, 300], size: 24, t0: T.long, t1: T.long + 3.4, region: CO },
    { text: "Brooklyn Heights", at: [2484, 1156], size: 22, t0: T.brooklyn, t1: CUT_H - 0.1, region: BR },
    { text: "East River", at: [2486, 1137], size: 20, t0: T.east, t1: CUT_H - 0.1, region: BR, river: true },
  ],
  build: (ctx) => { pulses.build(ctx); },
  draw: (t, ctx) => { pulses.draw(t, ctx); },
  overlay: [
    ["plaque.date", T.e1776, { month: "Summer 1776", day: "", weekday: "", note: "" }],
    ["number", T.thirty - 0.1, T.hessians - 0.4, { value: 32000, round: 1000, x: 960, y: 250, size: 116 }],
    ["label", T.soldiers - 0.05, T.hessians - 0.4, { name: "Soldiers", x: 960, y: 360, marker: false, side: "uk", offset: [-110, 0] }],
    ["label", T.hessians, T.on + 0.5, { name: "The Hessians", sub: "Germans hired from their princes", world: [597, 339, 0], side: "uk", marker: false, offset: [60, -130] }],
    ["plaque.date", T.august, { month: "August 1776", day: "27", weekday: "", note: "" }],
    ["label", T.pass, T.fell - 0.2, { name: "A pass almost unguarded", world: [JPASS[0], JPASS[1], 0], side: "uk", marker: false, offset: [40, -120] }],
    ["number", T.thousand2 - 0.05, CUT_B - 0.4, { value: 1000, round: 10, x: 960, y: 250, size: 116 }],
    ["label", T.captured - 0.05, CUT_B - 0.4, { name: "Men captured", x: 960, y: 360, marker: false, side: "us", offset: [-150, 0] }],
  ],
};
})();
