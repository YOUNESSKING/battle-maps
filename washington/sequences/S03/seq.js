// S03 MOVE 1: THE NIGHT ON THE EAST RIVER (29-30 August 1776). D = 153.84 s (python3 washington/tools/scene_times.py S03 --words).
// Regions: colonies (z9 wide), brooklyn (z11 close). Structure = Jackson S03 (dive 2 at the start, result ledger, method letter line 1,
// subscribe): cloud dive colonies -> Brooklyn Heights; Howe's plan (saps creep at the lines, warships at the river mouth, red arrow up the
// East River); "In other words" 9,000 in a sack; rain + north-east wind hold the ships; 29 August, the twist (blue arrow lines -> ferry ->
// New York); boats gather one by one at the ferry, Glover's Marblehead men; night: regiments leave one at a time, break rank on the
// landing and stream onto the boats; separate boats shuttle (against wind and tide, then easier, sail craft after the wind change); the
// covering force out by mistake and back; first light + fog, the last regiments and the last boats, Washington in one of them; the
// British walk into empty forts; ledger; method letter "1. Save the army first"; colonies: the army up Manhattan; subscribe.
// Facts: washington/research/FACT_NOTES_brooklyn.md items 15-17, 21-23, 26, 29 (rain + NE wind 28-29 Aug, ~9,000, ~8 p.m. start, wind
// change ~11 p.m., the Mifflin blunder ~2 a.m., fog just before dawn, last boats ~6-7 a.m., a few stragglers + a handful of guns left).
(() => {
const T = { D: 153.84,
  plan: 0.69, simple: 1.35, howe: 4.17, forts: 6.71, engineers: 7.93, dig: 8.85, trench: 10.23, trench2: 10.67, warships: 11.55, sail: 12.29,
  east: 13.09, cut: 14.21, newyork: 15.67,
  other: 16.97, nine: 18.39, thousand: 18.67, half: 19.79, sack: 21.95, british: 23.01, pull: 23.99, string: 24.37,
  twodays: 25.61, rain: 26.47, ne: 27.23, wind: 27.65, kept: 28.17, last: 30.39,
  but: 32.15, d29: 32.91, general: 34.09, besieged: 35.61, instead: 36.95, take: 38.71, across: 39.93, river: 40.55, onenight: 41.29, nose: 43.11,
  every: 44.27, boat: 44.53, gathered: 46.01, afternoon: 46.67, row: 48.21, regiment: 49.63, fishermen: 50.35, marblehead: 51.83,
  colonel: 54.33, glover: 55.13, lives: 58.01,
  after: 59.41, dark: 59.69, regiments: 60.65, slipped: 60.79, onetime: 61.99, ferry: 64.35, mud: 65.19, many: 66.21, relieve: 69.91,
  covering: 71.29, force: 71.65, stayed: 72.07, front: 72.81, nothing: 75.03,
  allnight: 76.75, boats: 77.47, crossed: 77.75, loaded: 79.05, water: 80.63, first: 81.81, against: 83.61, then: 84.79, late: 85.31,
  died: 86.87, changed: 87.85, sailboats: 88.79, cross: 89.57,
  middle: 91.65, covering2: 92.67, ordered: 93.61, early: 94.51, mistake: 95.25, empty: 97.39, generalS: 98.65, said: 99.29, met: 99.79,
  road: 100.55, sent: 101.79, back: 102.23, noticed: 103.55,
  firstlight: 105.27, thousands: 106.27, still: 107.29, brooklyn: 107.85, thick: 109.67, fog: 109.93, rose: 110.35, under: 112.61,
  lastboats: 113.37, pushed: 114.07, general3: 115.43, crossedG: 115.83, lastof: 117.01,
  soon: 118.47, walked: 119.61, emptyforts: 120.29, about: 121.83, ninek: 122.37, guns: 124.65, crossed2: 125.63, single: 126.79,
  only: 128.05, handful: 128.53, stragglers: 129.27, behind: 130.21,
  that: 131.47, method: 132.83, aslong: 133.65, armylives: 134.29, cause: 135.39, save: 136.21, armyfirst: 137.57,
  beginning: 140.17, howdo: 141.29, home: 144.27, question: 145.95, subscribing: 147.59, nextone: 149.45, heres: 150.55, didit: 151.53 };
const BK = "brooklyn", CO = "colonies";
const lerp2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const sst = (a, b, t) => VX.sstep(a, b, t);

// ---------------- geography (brooklyn z11 units; colonies = brooklyn / 4) ----------------
const WK = VX.work(BK, 0);                                       // the Brooklyn lines, Wallabout Bay (NE) -> Gowanus (SW)
const WL = VX.len(WK);
const OUT = [0.604, 0.797];                                      // outward (south-east) normal of the lines: toward the British
const line = (k, d = 0) => { const p = VX.along(WK, WL * k); return [p[0] + OUT[0] * d, p[1] + OUT[1] * d]; };
const FSE = Math.atan2(OUT[1], OUT[0]), FNW = FSE + Math.PI;    // facing the British / facing the lines
const OVB = [2489.0, 1157.0];                                     // dive point on the Heights (brooklyn units)
const OV = [OVB[0] / 4, OVB[1] / 4];                              // the same point on the zoom-9 colonies map
// the ferry: Brooklyn landing at the foot of the ferry road (shore ~y 1147), Manhattan landing at Peck Slip (shore ~y 1130.8 at x 2467)
const shoreBK = (x) => (x < 2479.5 ? 1147.0 : x < 2483.5 ? 1146.75 : 1146.5);
const shoreMN = (x) => 1130.75 - 0.75 * (x - 2467);
// troop-only decks at the two landing stairs (regionOpts.decks, no mesh): the men break rank, stream down the stairs and into the boats
const PA = { near: [2480.45, 1147.75], far: [2480.25, 1146.45] }, PB = { near: [2477.45, 1147.95], far: [2477.3, 1146.65] };
const deck = (P) => { const dx = P.far[0] - P.near[0], dy = P.far[1] - P.near[1]; return { x: (P.near[0] + P.far[0]) / 2, z: (P.near[1] + P.far[1]) / 2, angle: Math.atan2(dy, dx), len: Math.hypot(dx, dy), deck: 1.2, wl: 0 }; };
const pierRoad = (P) => { const dx = P.far[0] - P.near[0], dy = P.far[1] - P.near[1], l = Math.hypot(dx, dy); return [[P.near[0] - dx / l * 0.7, P.near[1] - dy / l * 0.7], P.near, P.far, [P.far[0] + dx / l * 0.9, P.far[1] + dy / l * 0.9]]; };
const ESC = (P, t0) => ({ road: pierRoad(P), t0, join: "north", fade: null, vanish: [0.1, 0.55], front: true });

// ---------------- units ----------------
const units = [];
const U = (o) => { units.push({ type: "inf", n: 2, region: BK, arrive: false, ...o }); return units.length - 1; };
// the army packed inside the lines (blocks between the works and the ferry), each regiment leaves on its own, nearest the ferry first
const CAMP = [   // [position, pier, escape t0]
  [[2485.0, 1151.4], PA, 59.4], [[2479.0, 1152.4], PB, 60.6], [[2487.6, 1152.6], PA, 63.8], [[2481.4, 1156.0], PB, 65.0],
  [[2485.4, 1156.4], PA, 67.4], [[2477.6, 1158.6], PB, 69.0], [[2489.6, 1156.6], PA, 71.0], [[2483.6, 1160.4], PB, 73.8],
  [[2488.0, 1160.6], PA, 76.8], [[2492.6, 1159.8], PA, 80.0],
];
// round 2 (critic A): each regiment already faces its landing (formed to march), so it walks straight there front first (no crab)
CAMP.forEach(([p, P, t0]) => U({ side: "u", face: Math.atan2(P.near[1] - p[1], P.near[0] - p[0]), keys: [[0, ...p]], escape: ESC(P, t0) }));
// Glover's Marblehead regiment: at the landing on "regiment", first into the boats (they row them)
U({ side: "u", n: 1, face: -Math.PI / 2, t0: T.regiment - 0.2, keys: [[0, 2481.6, 1149.3]], escape: ESC(PA, 53.6) });
// the covering force (Mifflin): stays in the front line; ordered out by mistake (~2 a.m.), stops when met on the road, faces about, back in
// (a ~180 deg turn in place takes ~7 s: out 93.4-96.6, about-face while Washington sends them back, back into the line from 103.8)
const COV = [0.42, 0.56, 0.7];
COV.forEach((k, i) => { const a = line(k, -1.0), b = lerp2(a, [2486.0, 1152.5], 0.22);
  U({ side: "u", face: FSE, t1: 108.5, keys: [[0, ...a], [93.4 + i * 0.25, ...a], [96.6 + i * 0.25, ...b], [103.8 + i * 0.25, ...b], [107.2 + i * 0.25, ...a]] }); });
// the last regiments, still on the Brooklyn side at first light: down to the landing in the fog
[[[2482.6, 1150.4], PA, 110.4], [[2478.4, 1150.9], PB, 111.2], [[2485.6, 1151.2], PA, 111.8]].forEach(([p, P, t0]) =>
  U({ side: "u", face: -Math.PI / 2 - 0.1, t0: 102.0, keys: [[0, ...p]], escape: ESC(P, t0) }));   // already facing the ferry, waiting their turn
// the British camp line facing the works; after the evacuation they walk up to the empty works
const RCAMP = [0.12, 0.3, 0.48, 0.66, 0.84];
RCAMP.forEach((k, i) => { const a = line(k, 8.0), b = line(k, 1.6);
  U({ side: "r", face: FNW, keys: [[0, ...a], [T.walked - 0.4 + i * 0.25, ...a], [T.walked + 4.6 + i * 0.25, ...b]] }); });
// colonies (tail): the army falls back up Manhattan; the British hold Brooklyn
const NYC = VX.place("New York", CO), FW = VX.place("Fort Washington", CO), BKC = [OVB[0] / 4 + 1.5, OVB[1] / 4 + 1.0];
U({ side: "u", region: CO, face: -Math.PI / 2, t0: 139.9, keys: [[0, NYC[0] + 1.0, NYC[1] - 4.0], [140.8, NYC[0] + 1.0, NYC[1] - 4.0], [151.6, 633.6, 241.0]] });
U({ side: "r", region: CO, face: -Math.PI / 2 - 0.6, t0: 139.9, keys: [[0, ...BKC]] });

// ---------------- boats: every boat its own path, speed, dock and timing ----------------
const DOWN = [-0.91, 0.40];                                         // downstream (the ebb runs SW toward the harbour)
const chaikin = (P, it = 3) => { for (let k = 0; k < it; k++) { const N = [P[0]]; for (let i = 0; i < P.length - 1; i++) { const a = P[i], b = P[i + 1];
  N.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]); } N.push(P[P.length - 1]); P = N; } return P; };
const bez = (a, c, b, n = 10) => { const o = []; for (let i = 1; i <= n; i++) { const u = i / n, m = 1 - u; o.push([m * m * a[0] + 2 * m * u * c[0] + u * u * b[0], m * m * a[1] + 2 * m * u * c[1] + u * u * b[1]]); } return o; };
const cumLen = (P) => { const c = [0]; for (let i = 1; i < P.length; i++) c.push(c[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); return c; };
const nearS = (P, C, q, i0, i1) => { let b = 0, bd = 1e9; for (let i = Math.max(0, i0); i <= Math.min(P.length - 1, i1); i++) { const d = Math.hypot(P[i][0] - q[0], P[i][1] - q[1]); if (d < bd) { bd = d; b = i; } } return C[b]; };
// one boat: arrive at its Brooklyn dock, then shuttle Brooklyn -> Manhattan -> Brooklyn ... (legs eased; the wake only while under way)
function shuttle(k, o) {
  const h = (j) => VX.hsh(k * 13 + 7, j), Bd = o.B, Md = o.M, ax0 = [Md[0] - Bd[0], Md[1] - Bd[1]], al = Math.hypot(...ax0), a = [ax0[0] / al, ax0[1] / al], n = [-a[1], a[0]], w = 0.32;
  let pts = [...o.arrive], marks = [];                               // marks: points where the boat is docked ("B" / "M")
  const trips = []; let t = o.tS, at = "B";
  pts.push(Bd); marks.push(pts.length - 1);
  const leg = () => { const rough = t < 85.6, cT = (rough ? 11.0 + 2.4 * h(trips.length + 1) : 7.4 + 1.5 * h(trips.length + 1)) * (o.slow || 1);
    const from = at === "B" ? Bd : Md, to = at === "B" ? Md : Bd, side = at === "B" ? 1 : -1;
    const bul = (rough ? (at === "B" ? 2.4 : 1.3) : (at === "B" ? 0.55 : 0.35)) * (0.75 + 0.5 * h(40 + trips.length));
    const p0 = [from[0] + n[0] * w * side, from[1] + n[1] * w * side], p1 = [to[0] + n[0] * w * side, to[1] + n[1] * w * side];
    const mid = [(p0[0] + p1[0]) / 2 + DOWN[0] * bul, (p0[1] + p1[1]) / 2 + DOWN[1] * bul];
    pts.push(p0, ...bez(p0, mid, p1, 12), to); marks.push(pts.length - 1); trips.push({ t0: t, t1: t + cT }); t += cT; at = at === "B" ? "M" : "B"; };
  for (let g = 0; g < 40; g++) {
    if (at === "B" && o.lastDep != null && t + 30 > o.lastDep) { t = Math.max(t, o.lastDep); leg(); break; }   // wait for the last trip
    leg();
    if (at === "M") { if (o.lastDep == null && (t > o.tEnd || t + o.dM + 9.0 > 113.2)) break; t += o.dM; } else t += o.dB; }   // no boat left at Brooklyn after the last ones
  const P = chaikin(pts, 3), C = cumLen(P), S = marks.map((m) => nearS(P, C, pts[m], m * 8 - 14, m * 8 + 14));   // Chaikin x3: raw point m ~ index 8m
  const legs = [[o.tA0, o.tA1, 0, S[0]], ...trips.map((q, i) => [q.t0, q.t1, S[i], S[i + 1]])];
  const sAt = (tt) => { let s = 0; for (const [a0, a1, s0, s1] of legs) { if (tt < a0) return s; if (tt < a1) return s0 + (s1 - s0) * sst(a0, a1, tt); s = s1; } return s; };
  const moving = (tt) => legs.some(([a0, a1]) => tt > a0 + 0.15 && tt < a1 - 0.2);
  return { region: BK, kind: o.kind || "barge", n: 1, path: P, sAt, wake: moving, t0: o.t0, t1: o.t1 ?? 141.2, size: o.size || 0.6, lamp: false, _legs: legs, _P: P };
}
// docks: Brooklyn along the shore by the ferry (two at the stairs), Manhattan between the Fly Market and Peck Slip
const BX = [2480.25, 2477.3, 2481.6, 2478.6, 2483.0, 2476.0, 2479.6, 2482.3, 2475.0, 2484.2, 2480.9, 2477.9];
const MX = [2467.3, 2465.6, 2468.6, 2466.4, 2469.6, 2464.4, 2467.9, 2465.0, 2470.4, 2463.6, 2466.9, 2469.1];
const boats = [];
const SHUT = BX.map((bx, k) => { const B = [bx, shoreBK(bx) - 0.62 - (k < 2 ? 0.25 : 0.0)], M = [MX[k], shoreMN(MX[k]) + 0.62];
  const up = k % 2 === 0, tA0 = T.boat - 0.2 + k * 0.95 + 0.4 * VX.hsh(k, 3), tA1 = tA0 + 5.0 + 1.4 * VX.hsh(k, 11);
  const st = up ? [2499 + 2 * VX.hsh(k, 4), 1137.0 + 2.0 * VX.hsh(k, 5)] : [2458 + 2 * VX.hsh(k, 4), 1149.5 + 3.0 * VX.hsh(k, 5)];
  const c1 = up ? [B[0] + 5.5, B[1] - 3.0 - 1.5 * VX.hsh(k, 6)] : [B[0] - 5.0, B[1] - 1.8];
  const last = k === 0 || k === 1 || k === 3;                       // the last three boats leave in the fog
  return shuttle(k, { B, M, arrive: [st, ...bez(st, c1, [B[0] + (up ? 0.6 : -0.6), B[1] - 0.3], 10)], tA0, tA1, t0: tA0 - 0.05,
    tS: 59.6 + k * 1.15 + 0.6 * VX.hsh(k, 7), dB: 3.0 + 1.6 * VX.hsh(k, 8), dM: 1.6 + 1.0 * VX.hsh(k, 9), tEnd: last ? 999 : 200,
    lastDep: last ? [116.2, 115.6, 116.8][[0, 1, 3].indexOf(k)] : null }); });
boats.push(...SHUT);
// after the wind change: a few small sail craft come down from up-river and join the crossing
const SAIL = [[2481.0, 2466.2, 87.6], [2484.6, 2468.4, 88.6], [2476.6, 2464.8, 89.8]].map(([bx, mx, ts], j) => {
  const B = [bx, shoreBK(bx) - 1.0], M = [mx, shoreMN(mx) + 0.8], st = [2500 + j * 1.6, 1135.6 + j * 1.2];
  return shuttle(30 + j, { kind: "ship", size: 0.24, B, M, arrive: [st, ...bez(st, [B[0] + 6, B[1] - 4], [B[0] + 0.6, B[1] - 0.2], 10)], tA0: ts - 0.2, tA1: ts + 5.6,
    t0: ts - 0.25, tS: ts + 6.4, dB: 2.4, dM: 1.4, tEnd: 104 + j * 2, slow: 0.82 }); });
boats.push(...SAIL);
// the British warships held at the mouth of the river (anchored, bows into the north-east wind); one tries to work up and falls back
const SHIPS = [[2453.6, 1172.4], [2457.6, 1175.6], [2450.2, 1177.2], [2460.6, 1179.6], [2454.6, 1181.4]];
SHIPS.forEach(([x, y], i) => boats.push({ region: BK, kind: "ship", n: 1, path: [[x - 0.7, y + 0.6], [x + 0.7, y - 0.6]], t0: 7.4, t1: 132.0, size: 0.62 + 0.08 * VX.hsh(i, 2),
  sAt: (t) => 0.99 + 0.12 * Math.sin(t * 0.35 + i * 1.7), wake: false, lamp: false }));

// ---------------- arrows ----------------
// the saps: short red zigzags creeping toward the lines, trench by trench
const sap = (k, i0) => { const a = line(k, 7.2), b = line(k, 2.6), P = []; for (let j = 0; j <= 4; j++) { const q = lerp2(a, b, j / 4), z = (j % 2 ? 0.7 : -0.7) * (j === 0 || j === 4 ? 0 : 1);
  const tg = VX.along(WK, WL * k); P.push([q[0] + tg[2] * z, q[1] + tg[3] * z]); }
  return [0, 1, 2, 3].map((j) => ({ side: "r", region: BK, width: 0.13, pts: [P[j], P[j + 1]], t0: T.dig + i0 * 0.35 + j * 0.95, dur: 0.8, t1: 31.0 })); };
const arrows = [
  ...sap(0.36, 0), ...sap(0.6, 1),
  // the warships' plan: up the East River, between Brooklyn and New York
  { side: "r", region: BK, width: 0.34, maxWidth: 0.34, pts: [[2456.4, 1171.0], [2462.0, 1158.0], [2470.0, 1146.4], [2480.0, 1140.4], [2492.0, 1139.0]], t0: T.sail - 0.1, dur: 2.2, t1: 24.9 },
  // the twist: the whole army from the lines down to the ferry and across the river to New York
  { side: "u", region: BK, width: 0.4, maxWidth: 0.4, pts: [[2497.0, 1163.4], [2489.0, 1155.4], [2482.4, 1149.4], [2476.6, 1142.0], [2469.0, 1133.6]], t0: T.take - 0.1, dur: 2.6, t1: 46.4 },
  // colonies: back up Manhattan
  { side: "u", region: CO, width: 0.85, maxWidth: 0.85, pts: [[615.0, 279.0], [626.0, 266.0], [630.5, 249.0], [636.0, 236.0]], t0: 140.6, dur: 2.0, t1: T.D + 1 },
];

// ---------------- fx ----------------
const fx = { volleys: [], guns: [], fires: [], smokeLines: [] };

// ---------------- generals, banners ----------------
const generals = {
  washington: { img: "seq/washington.png", flag: "seq/grand_union_flag.png", side: "us", name: "Washington", full: "George Washington", role: "General" },
  howe: { img: "seq/howe.png", flag: "seq/gb1707_union_flag.png", side: "cs", name: "Howe", full: "Sir William Howe", role: "General" },
};
// Washington crosses in one of the last boats (boat 3): the banner rides it
const LB = SHUT[3], lbAt = (t) => VX.along(LB._P, LB.sAt(t));
const wBoat = []; for (let t = 116.2; t <= 124.01; t += 0.4) { const p = lbAt(t); wBoat.push([t, p[0], p[1]]); }
const banners = [
  { general: "howe", region: BK, keys: [[0, ...line(0.5, 10.6)]], t0: 7.5, t1: 31.4 },
  { general: "washington", region: BK, keys: [[0, 2486.6, 1155.6]], t0: T.general - 0.05, t1: 58.8 },
  { general: "washington", region: BK, keys: [[0, 2494.4, 1161.6]], t0: T.met - 0.05, t1: 105.2 },
  { general: "washington", region: BK, keys: [[0, 2479.4, 1149.0], [115.4, 2479.4, 1149.0], [116.0, ...lbAt(116.0)], ...wBoat], t0: 105.6, t1: 118.0 },
  { general: "howe", region: BK, keys: [[0, ...line(0.5, 6.4)]], t0: T.walked - 0.2, t1: T.about - 0.3 },   // round 1: out before the result card
];

// ---------------- labels ----------------
const labels = [
  { text: "East River", region: BK, at: [2471.6, 1139.6], size: 18, river: true, t0: T.east - 0.05, t1: T.east + 3.5 },
  { text: "New York", region: BK, at: [2456.0, 1131.4], size: 19, t0: T.newyork - 0.05, t1: T.newyork + 3.5 },
  { text: "covering force", region: BK, at: line(0.56, -3.4), size: 17, t0: T.covering - 0.05, t1: T.covering + 3.6 },
];

// ---------------- weather: rain + the NE wind (28-29 Aug), fog only at first light (30 Aug) ----------------
const RAIN = VX.rain([[25.9, 0], [26.7, 0.8], [31.2, 0.8], [32.6, 0.35], [58.8, 0.3], [61.0, 0.38], [86.6, 0.38], [88.6, 0]], { slant: 0.3 });   // round 1: rain -30 % at night
let FOGC = null;
function fogBuild() { const cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
  const tr = document.getElementById("troops"); tr.parentNode.insertBefore(cv, tr); FOGC = cv.getContext("2d"); }
function fogDraw(t) { if (!FOGC) return; const g = FOGC; g.clearRect(0, 0, 640, 360);
  const k = sst(T.fog - 0.3, T.rose + 1.6, t) * (1 - 0.55 * sst(T.soon, T.walked + 1.0, t)) * (1 - sst(124.0, 128.0, t)); if (k <= 0.002) return;
  const gr = g.createLinearGradient(0, 0, 0, 360); gr.addColorStop(0, `rgba(196,200,198,${(0.7 * k).toFixed(3)})`); gr.addColorStop(0.55, `rgba(188,192,190,${(0.34 * k).toFixed(3)})`);
  gr.addColorStop(1, `rgba(182,186,184,${(0.18 * k).toFixed(3)})`); g.fillStyle = gr; g.fillRect(0, 0, 640, 360);
  for (let i = 0; i < 9; i++) { const x = ((VX.hsh(i, 21) * 900 + t * (6 + 5 * VX.hsh(i, 22))) % 900) - 130, y = 60 + VX.hsh(i, 23) * 260, r = 90 + VX.hsh(i, 24) * 90;
    const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(206,210,207,${(0.16 * k).toFixed(3)})`); rg.addColorStop(1, "rgba(206,210,207,0)"); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); } }
// pulses: the saps' heads and the ships on "pull the string"; the ferry landing glows on "boat"
const pulses = VX.pulses([
  ...[0.36, 0.6].map((k) => ({ region: BK, at: line(k, 2.6), r: 1.4, t0: T.pull - 0.1, t1: 25.4, period: 1.4 })),
  ...SHIPS.slice(0, 3).map((p) => ({ region: BK, at: p, r: 1.4, t0: T.pull - 0.1, t1: 25.4, period: 1.4 })),
  { region: BK, at: [2479.4, 1147.2], r: 1.6, t0: T.boat - 0.05, t1: 48.0, period: 1.4, color: [255, 214, 120] },
]);

// ---------------- result card (round 1, critic B: the big centred card of moves 2-3, S05 recipe) ----------------
const RCSS = `.aj-res{position:absolute;left:330px;top:170px;width:1260px;height:640px;color:#EEE7D6;text-align:center;font-family:"GM Cormorant",Georgia,serif;
  background:linear-gradient(180deg,#232b33 0%,#182027 60%,#141a20 100%);box-shadow:0 14px 40px rgba(0,0,0,.7),inset 0 0 0 4px #151E25,inset 0 0 0 5.5px rgba(201,178,122,.85)}
.aj-res .hd{position:absolute;left:0;right:0;top:44px;font-family:"GM Cinzel",serif;font-weight:700;font-size:28px;letter-spacing:.42em;color:#C9B27A;padding-left:.42em}
.aj-res .col{position:absolute;top:120px;width:560px}.aj-res .c1{left:40px}.aj-res .c2{right:40px}
.aj-res .sd{font-family:"GM Cinzel",serif;font-weight:700;font-size:30px;letter-spacing:.3em;padding-left:.3em}
.aj-res .c1 .sd{color:#9FB8DC}.aj-res .c2 .sd{color:#9FB8DC}
.aj-res .nb{font-family:"GM Cinzel",serif;font-weight:700;font-size:150px;line-height:1.05;letter-spacing:.02em;
  background:linear-gradient(180deg,#fff1c4,#e8c46c 45%,#b98a35 70%,#f0d28a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 4px rgba(0,0,0,.7))}
.aj-res .nt{font-style:italic;font-weight:600;font-size:31px;color:#E8E0CC;margin-top:4px}
.aj-res .gn{font-family:"GM Cinzel",serif;font-weight:700;font-size:24px;letter-spacing:.22em;color:#9FB8DC;margin-top:10px}
.aj-res .vr{position:absolute;left:629px;top:130px;width:1.5px;height:300px;background:linear-gradient(180deg,transparent,#C9B27A,transparent)}
.aj-res .src{position:absolute;left:0;right:0;top:560px;font-style:italic;font-weight:500;font-size:22px;color:#B7A57C}`;
function buildResult(c) { const st = document.createElement("style"); st.textContent = RCSS; document.head.appendChild(st);
  const host = document.querySelector("#ov .gmo") || document.getElementById("ov"), el = document.createElement("div"); el.className = "aj-res";
  el.innerHTML = `<div class="hd">Brooklyn · 29-30 August 1776</div><div class="col c1"><div class="sd">Across</div><div class="nb">9,000</div><div class="nt">crossed in a single night</div><div class="gn">with nearly all their guns</div></div>
    <div class="vr"></div><div class="col c2"><div class="sd">Left behind</div><div class="nb">A FEW</div><div class="nt">a handful of stragglers</div></div>
    <div class="src">Johnston, The Campaign of 1776 around New York and Brooklyn</div>`;
  host.appendChild(el); const tl = c.tl, gs = window.gsap, on = (sel, t) => { const e = el.querySelector(sel); gs.set(e, { autoAlpha: 0 }); tl.fromTo(e, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", immediateRender: false }, t); };
  gs.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, T.about - 0.3); tl.to(el, { autoAlpha: 0, duration: 0.45 }, 131.0);
  on(".c1 .sd", T.crossed2 - 0.1);   /* round 3: "ACROSS" on "crossed" */ on(".c1 .nb", T.ninek); on(".c1 .gn", T.guns - 0.9); on(".c1 .nt", T.crossed2 - 0.1); on(".vr", T.handful - 0.1); on(".c2 .nb", T.handful);
  on(".c2 .nt", T.stragglers - 0.1); on(".c2 .sd", T.behind - 0.25); on(".src", T.behind + 0.2); }

const DS = 4.0, NI = 0.7, NG = 0.45;   // round 1 (critic A): night +15 % lighter than 0.85
window.SEQ = {
  grade: { wide: { toe: 14, ct: 1.03, sat: 1.04 } },   // as Jackson (owner 2026-11-23: richer wide overhead maps)
  name: "S03", D: T.D, T, seed: 1776, date: "1776-08-29",
  regions: [CO, BK],
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  regionOpts: { [BK]: { troopScale: 1.6, decks: [deck(PA), deck(PB)] }, [CO]: { troopScale: 16 } },
  keys: [
    { t: 0, region: CO, at: [OV[0] - 6, OV[1] + 14], dist: 300, tilt: 36, yaw: 0, fov: 30 },
    // dive 2: colonies -> Brooklyn Heights (push 0.2, swap 4.0, land 7.35)
    { t: 11.0, region: BK, at: [2492.0, 1161.6], dist: 72, tilt: 40, yaw: 1, fov: 30, ease: "lin" },
    { t: 16.4, region: BK, at: [2483.0, 1163.0], dist: 80, tilt: 39, yaw: 0, fov: 30, ease: "io" },          // the warships' route up the river
    { t: 24.6, region: BK, at: [2484.0, 1160.0], dist: 84, tilt: 37, yaw: 0, fov: 30, ease: "io" },          // "In other words": up, the sack
    { t: 28.8, region: BK, at: [2459.0, 1171.0], dist: 34, tilt: 50, yaw: 14, fov: 30, ease: "io" },         // the ships in the rain
    { t: 31.8, region: BK, at: [2459.6, 1170.4], dist: 32, tilt: 51, yaw: 10, fov: 30, ease: "lin" },
    { t: 35.0, region: BK, at: [2485.0, 1153.6], dist: 52, tilt: 44, yaw: 0, fov: 30, ease: "io" },          // 29 August: the decision
    { t: 43.8, region: BK, at: [2482.0, 1150.4], dist: 47, tilt: 44, yaw: 0, fov: 30, ease: "lin" },
    { t: 47.2, region: BK, at: [2479.0, 1145.4], dist: 27, tilt: 50, yaw: -6, fov: 30, ease: "io" },         // the ferry: boats gather
    { t: 58.4, region: BK, at: [2479.6, 1146.0], dist: 25, tilt: 51, yaw: -2, fov: 30, ease: "lin" },
    { t: 62.4, region: BK, at: [2481.0, 1148.6], dist: 23, tilt: 50, yaw: -2, fov: 30, night: NI, ease: "io" },   // night: the regiments leave, break rank, board
    { t: 67.4, region: BK, at: [2481.4, 1149.0], dist: 22, tilt: 51, yaw: 2, fov: 30, night: NI, ease: "lin" },
    { t: 70.9, region: BK, at: [2482.4, 1150.6], dist: 25, tilt: 50, yaw: 2, fov: 30, night: NI, ease: "lin" },
    { t: 70.9, region: BK, at: [2499.4, 1165.4], dist: 33, tilt: 48, yaw: 0, fov: 30, night: NI, ease: "cut", dissolve: 0.9 },   // the covering force (round 2: a dissolve, no fast pan over the marching blocks)
    { t: 76.6, region: BK, at: [2498.6, 1164.6], dist: 33, tilt: 48, yaw: 0, fov: 30, night: NI, ease: "lin" },
    { t: 76.6, region: BK, at: [2474.8, 1139.8], dist: 28, tilt: 50, yaw: -8, fov: 30, night: NI, ease: "cut", dissolve: 0.9 },  // the river at night (round 1: 20 % closer)
    { t: 90.9, region: BK, at: [2474.0, 1138.8], dist: 26, tilt: 50, yaw: -4, fov: 30, night: NI, ease: "lin" },
    { t: 90.9, region: BK, at: [2498.6, 1164.4], dist: 29, tilt: 50, yaw: 0, fov: 30, night: NI, ease: "cut", dissolve: 0.9 },   // the covering force goes out and back
    { t: 104.6, region: BK, at: [2497.0, 1163.4], dist: 30, tilt: 50, yaw: 2, fov: 30, night: NI, ease: "lin" },
    { t: 105.3, region: BK, at: [2479.2, 1146.6], dist: 28, tilt: 50, yaw: -6, fov: 30, night: NG, ease: "cut", dissolve: 0.9 },   // first light
    { t: 117.8, region: BK, at: [2477.4, 1143.6], dist: 31, tilt: 49, yaw: -2, fov: 30, night: 0.3, ease: "lin" },
    { t: 118.3, region: BK, at: [2504.0, 1165.0], dist: 30, tilt: 47, yaw: 0, fov: 30, night: 0.16, ease: "cut", dissolve: 0.9 },  // empty forts
    { t: 131.0, region: BK, at: [2502.0, 1162.4], dist: 38, tilt: 46, yaw: 0, fov: 30, night: 0, ease: "lin" },
    { t: 140.2, region: BK, at: [2496.0, 1158.0], dist: 50, tilt: 44, yaw: 0, fov: 30, ease: "io" },
    { t: 140.2, region: CO, at: [606.0, 274.0], dist: 300, tilt: 34, yaw: 0, fov: 30, ease: "cut", dissolve: 0.9 },   // colonies: up Manhattan
    { t: T.D, region: CO, at: [610.0, 264.0], dist: 285, tilt: 35, yaw: 0, fov: 30, ease: "lin" },
  ],
  dives: [{ t: DS, over: OV, overTo: OVB, from: { region: CO, at: [OV[0] - 3, OV[1] + 8], dist: 230, tilt: 38, yaw: 0 },
            to: { region: BK, at: [2493.0, 1161.0], dist: 74, tilt: 40, yaw: 0, fov: 30 },
            whooshAt: 1.4, off: { warm: 0.05, emerge: 0.1, clear: 0.4, haze: 0.85 } }],   // round 4: whoosh back to 1.4 (1.2 covered "simple."); clear 0.4 (no luma snap)   // round 2: whoosh before "General William Howe"; no flat cream hold (S05 values)
  clouds: { [CO]: { scatter: { seed: 5 } }, [BK]: { shadows: true } },
  units, arrows, boats, fx, generals, banners, labels,
  overlay: [
    ["plaque.date", 0.4, { month: "August 1776", day: "", weekday: "", note: "" }],
    ["number", T.nine - 0.05, T.string + 0.4, { value: 9000, round: 1000, world: [2490.0, 1157.0], size: 100 }],
    ["plaque.note", T.ne - 0.05, "rain · north-east wind"],
    ["plaque.date", T.d29 - 0.05, { month: "August 1776", day: "29", weekday: "Thursday", note: "Brooklyn Heights" }],
    ["label", T.marblehead - 0.05, T.glover - 0.25, { name: "Marblehead Regiment", sub: "fishermen and sailors", world: [2483.4, 1149.6], side: "us", marker: false }],
    ["label", T.glover - 0.15, T.lives + 0.6, { name: "Colonel John Glover", sub: "Marblehead, Massachusetts", world: [2483.4, 1149.6], side: "us", marker: false }],
    ["plaque.note", T.dark - 0.1, "after dark · rain"],
    ["plaque.note", T.changed - 0.05, "the wind changes"],
    ["plaque.note", T.middle - 0.1, "the middle of the night"],
    ["plaque.date", T.firstlight - 0.05, { month: "August 1776", day: "", weekday: "", note: "" }],   // round 1: no unspoken day
    ["plaque.note", T.fog - 0.05, "fog"],
    ["film.dim", T.about - 0.3, 131.3, 0.75],
    ["letter", T.method - 0.15, T.beginning - 0.1, { header: "Move 1 · Brooklyn", title: "The Washington Method", sub: "", marks: false, quote: "1. Save the army first", qSize: 34, cps: 30, qAt: T.save - 0.05, lag: 0.05, stagger: 0.06, partDur: 0.35 }],
    ["plaque.date", 140.25, { month: "1776", day: "", weekday: "", note: "" }],   // round 1: no stale August plate over the colonies tail
    ["engage.subscribe", T.subscribing - 0.1, T.subscribing + 4.0],
  ],
  build: (ctx) => { RAIN.build(ctx); fogBuild(); pulses.build(ctx); buildResult(ctx); },
  draw: (t, ctx) => { RAIN.draw(t, ctx); fogDraw(t); pulses.draw(t, ctx); },
};
})();
