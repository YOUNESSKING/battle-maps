// S06 MOVE 3: THE TRAP AT THE CREEK (30 Dec 1776 - 2 Jan 1777). D = 82.49 s (python3 washington/tools/scene_times.py S06 --words).
// Regions: jersey (z10 wide, winter), trenton (z11 close, winter). Structure = Jackson S05's first half (wide -> close -> the decision card).
// jersey: the army crosses back to Trenton (separate boats, break rank onto them), SIX MORE WEEKS / TEN DOLLARS on their words; 2 January:
// Cornwallis's column down the post road from Maidenhead (5,500), the plan arrow (trap him against the river); Hand's riflemen fire and fall
// back along the road (visible volleys only; stop -> about-face -> walk) -> dissolve trenton dusk: the blue line SOUTH of the Assunpink
// behind the 2 Jan works, guns covering the stone bridge; the red army comes through the town; three assaults on the bridge, each thrown
// back by cannon + muskets (stop, about-face, walk back); night: campfires both sides, the Delaware behind the blue line; WHAT WOULD YOU DO?
// (A: hold the creek and fight / B: slip away in the night) through the end of the scene: the reveal ("He slipped away") opens S07.
// Facts: FACT_NOTES_jersey.md E2 (six weeks, $10), F1 (Cornwallis 5,500), F2 (Hand's delaying action: Five Mile Run, Shabakunk, Stockton
// Hollow), F3 (three assaults on the bridge, cannon + muskets, the American line on the south bank), F5 (Cornwallis waits for the morning).
(() => {
const T = { D: 82.49,
  washington: 0.41, crossed: 1.29, back: 1.63, nj: 2.25, end: 3.73, december: 4.47, asked: 4.67, stay: 5.57, six: 5.81, weeks: 6.43, bounty: 7.47,
  ten: 8.24, dollars: 8.39, many: 9.91, stayed: 10.45,
  second: 12.06, january: 12.31, cornwallis: 13.35, marched: 13.79, trenton: 14.49, five: 15.70, thousand: 15.97, men: 16.77, plan: 18.89,
  trap: 20.73, river: 21.99, destroy: 22.45, but: 23.79, allday: 24.19, small: 24.99, riflemen: 26.35, fought: 27.01, woods: 27.93, creeks: 28.43,
  road: 29.35, fell: 30.21, again: 31.37,
  dark: 33.03, reached: 34.01, trentonT: 34.43, army: 36.35, behind: 37.01, assunpink: 37.92, south: 38.49, guns: 40.67, covering: 41.11, bridge: 42.17,
  tried: 43.77, storm: 44.37, three: 45.17, times: 45.45, each: 46.67, thrown: 47.51, cannon: 48.33, musket: 48.95,
  stopped: 51.45, night: 52.13, tired: 53.53, nowhere: 55.41, words: 57.35, morning: 58.97,
  now: 60.09, place: 63.13, british: 64.17, trained: 65.99, more: 66.77, coming: 67.51, behindY: 68.65, riverI: 69.43, ice: 70.17,
  hold: 71.23, slip: 74.31, tell: 76.07, comments: 76.73, listen: 78.93, did: 80.15 };
const JE = "jersey", TR = "trenton";
const lerp2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

// ---------------- jersey (z10): the Delaware at Trenton, the post road to Maidenhead ----------------
const DEL = VX.river(JE, "Delaware River").pts;
const RV = (k) => { const L = VX.len(DEL), p = VX.along(DEL, L * k); let h = 0, bd = 1e9; for (const q of DEL) { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; h = q[2] || 0; } } return { x: p[0], y: p[1], dx: p[2], dy: p[3], h }; };
const bank = (k, side, d) => { const r = RV(k), s = side === "NJ" ? 1 : -1; return [r.x + r.dy * s * d, r.y - r.dx * s * d]; };
const kOf = (x, y) => { const L = VX.len(DEL); let bk = 0, bd = 1e9; for (let k = 0; k <= 1; k += 0.002) { const p = VX.along(DEL, L * k), d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; bk = k; } } return bk; };
const kT = kOf(668, 1033), HW = 1.3, TRj = VX.town("Trenton", JE);
const PR = VX.road(JE, "New York post road");                     // from the head of Trenton (s 0) north-east to Princeton
const RD = (s, lat = 0) => { const p = VX.along(PR, s); return [p[0] - p[3] * lat, p[1] + p[2] * lat]; };
const FRD = (s) => { const p = VX.along(PR, s); return Math.atan2(p[3], p[2]); };   // facing up the road (north-east, toward Princeton)

// ---------------- trenton (z11): the Assunpink, the stone bridge, the 2 Jan works on the south bank ----------------
const BR = [1356.3, 2069.3];                                       // the stone bridge (Queen St foot); its north end ~[1356.0, 2068.5]
const N_ = -Math.PI / 2, S_ = Math.PI / 2;

// ---------------- units ----------------
const units = [];
const U = (o) => { units.push({ type: "inf", n: 1, arrive: false, ...o }); return units.length - 1; };
// jersey: back over the river at Trenton (30-31 Dec): three regiments board on the PA bank, the boats cross, they land on the NJ bank
const LAND = [kT - 0.032, kT, kT + 0.032], decks = [];
LAND.forEach((k, i) => { const r = RV(k), near = bank(k, "PA", HW + 0.55), far = bank(k, "PA", HW - 0.35), out = bank(k, "PA", HW - 1.0), back = bank(k, "PA", HW + 1.6);
  decks.push({ x: (near[0] + far[0]) / 2, z: (near[1] + far[1]) / 2, angle: Math.atan2(far[1] - near[1], far[0] - near[0]), len: Math.hypot(far[0] - near[0], far[1] - near[1]), deck: r.h + 1.5, wl: r.h });
  const toNJ = Math.atan2(RV(k).dx, -RV(k).dy);
  U({ side: "u", region: JE, face: toNJ, keys: [[0, ...bank(k, "PA", HW + 3.8 + (i % 2) * 1.0)]], escape: { road: [back, near, far, out], join: "nearest", fade: null, vanish: [0.1, 0.7], front: true, t0: 0.2 + i * 0.7 } });
  U({ side: "u", region: JE, face: Math.atan2(-RV(k).dx, RV(k).dy) + Math.PI, t0: 4.6 + i * 0.7, keys: [[0, ...bank(k, "NJ", HW + 1.4)], [4.8 + i * 0.7, ...bank(k, "NJ", HW + 1.4)], [8.6 + i * 0.7, ...bank(k, "NJ", HW + 4.6)]] }); });
// 2 January: Cornwallis's column down the post road (head at s 62 -> halts in front of each rifle group -> s 40)
// V2: one block per unit: each rank of the column = two single blocks side by side (1.25 block widths apart)
const RED = [0, 1, 2, 3].flatMap((i) => [-1.3, 1.3].map((lat) => U({ side: "r", region: JE, n: 1, face: FRD(46 + i * 5.4) + Math.PI, t0: 11.8,
  keys: [[0, ...RD(64 + i * 5.4, lat)], [13.4, ...RD(64 + i * 5.4, lat)], [17.6, ...RD(52 + i * 5.4, lat), "lin"], [25.4, ...RD(52 + i * 5.4, lat)], [29.6, ...RD(41 + i * 5.4, lat), "lin"]] })));
// Hand's riflemen: G1 at Five Mile Run fires, about-faces (~7 s in place) and falls back; G2 at the Shabakunk fires twice
const G1a = RD(44, 1.0), G1b = RD(33, 3.0), G2 = RD(29, -2.4);
U({ side: "u", region: JE, face: FRD(44), t0: 12.0, keys: [[0, ...G1a], [24.4, ...G1a], [28.4, ...G1b]] });
U({ side: "u", region: JE, face: FRD(29), t0: 12.0, keys: [[0, ...G2]] });

// trenton: the American line behind the works on the south bank; two guns covering the bridge; the British through the town
const BLUE = [1344.6, 1348.6, 1352.4, 1360.4, 1364.4, 1368.6].map((x, i) => U({ side: "u", region: TR, face: N_, t0: 32.0, keys: [[0, x, (x === 1352.4 || x === 1360.4) ? 2075.0 : 2076.3 + (i === 0 ? 0.5 : 0)]] }));   // v2 r1: the two bridge firing blocks just behind the works (out of the bottom 12 %)
const GUNS = [[1355.0, 2071.5], [1358.2, 2071.4]];   // round 1: at the south end of the bridge
GUNS.forEach((g) => U({ side: "u", region: TR, type: "art", face: N_, t0: 32.0, keys: [[0, ...g]] }));
// three assaults: each regiment walks down to the creek by the bridge, is thrown back (holds while it about-faces ~7 s), walks back
// round 1 (critic B): one short fire wave per attack in the word gaps (43.0-43.4, 45.6-46.5, 49.4-50.3), nothing after 50.3
const AS = [[1356.15, 2068.75, 39.4], [1354.4, 2067.6, 41.2], [1358.0, 2067.6, 44.6]];   // v2 r4 (critic B): block 1 arrives on "storm"   // [x, y, start]; arrive start + 5
const WAVE = [[43.0, 43.4], [46.1, 46.6], [49.85, 50.4]];   // round 2: after the word ends
AS.forEach(([x, y, ta], i) => { const st = [x, 2064.4 - i * 0.4];   // V2: 4 u from the creek (ts 1.0 walks at ~1 u/s)
  U({ side: "r", region: TR, face: S_, t0: 32.6, keys: [[0, ...st], [ta, ...st], [ta + 5.0, x, y], [ta + 14.4, x, y], [ta + 19.4, st[0], st[1] - 0.4]] }); });
// the rest of the red army in the town (comes in at dusk, camps for the night)
[[1346.0, 2058.0], [1351.0, 2055.0], [1363.0, 2058.6], [1368.4, 2061.0]].forEach((p, i) => U({ side: "r", region: TR, face: S_, t0: 33.6 + i * 0.5, keys: [[0, ...p]] }));   // round 1: no oblique walk

// ---------------- boats (jersey): the crossing back, each boat its own track ----------------
const boats = LAND.map((k, i) => { const a = bank(k, "PA", HW - 0.5), b = bank(k, "NJ", HW - 0.5), r = RV(k), m = [(a[0] + b[0]) / 2 + r.dx * 0.5, (a[1] + b[1]) / 2 + r.dy * 0.5], path = [a, m, b], L = VX.len(path), t0 = 2.0 + i * 0.75 + 0.3 * VX.hsh(i, 2);
  return { region: JE, kind: "barge", n: 1, path, sAt: (t) => 0.02 + (L - 0.04) * VX.sstep(t0, t0 + 2.4, t), wake: (t) => t > t0 + 0.1 && t < t0 + 2.2, t0: 0, t1: 32.6, size: 1.3, lamp: false }; });
[kT - 0.05, kT - 0.03, kT + 0.03, kT + 0.05].forEach((k, i) => { const a = bank(k, "PA", HW - 0.5), b = bank(k, "NJ", HW - 0.5), path = [a, b], L = VX.len(path), t0 = 3.0 + i * 0.9;
  boats.push({ region: JE, kind: "barge", n: 1, path, sAt: (t) => 0.02 + (L - 0.04) * VX.sstep(t0, t0 + 2.6, t), wake: (t) => t > t0 + 0.1 && t < t0 + 2.4, t0: 0, t1: 32.6, size: 1.3, lamp: false }); });

// ---------------- arrows ----------------
const arrows = [
  { side: "u", region: JE, width: 0.32, pts: [bank(kT, "PA", HW + 2.6), bank(kT, "NJ", HW + 3.6)], t0: T.crossed - 0.1, dur: 1.4, t1: 9.6 },
  // Cornwallis's plan: down the road, pin Washington against the river
  { side: "r", region: JE, width: 0.4, maxWidth: 0.4, pts: [RD(58), RD(36), RD(14), [TRj[0] - 2.0, TRj[1] + 4.0], bank(kT, "NJ", HW + 1.8)], t0: T.trap - 0.1, dur: 2.2, t1: T.but },
  // the bridge assaults (short red pushes onto the bridge)
  // v2 r3 fix (B4-2): the first push on "storm", the second on "three", the third on "Each"
  ...AS.map(([x, y, ta], i) => { const t0 = [T.storm - 0.05, T.three - 0.05, T.each - 0.05][i]; return { side: "r", region: TR, width: 0.16, pts: [[x, y - 3.2], [x + (BR[0] - x) * 0.6, y + 0.6], [BR[0], BR[1] + 0.3]], t0, dur: 1.6, t1: Math.max(ta + 8.0, t0 + 4.0) }; }),
];

// ---------------- fx: visible volleys + cannon only ----------------
const VOL = (region, pts, t0, t1, dir, o = {}) => ({ region, pts, t0, t1, opts: { dir, size: 0.8, alpha: 0.09, life: 10, muzzle: 5, windK: 0.9, rate: 3.0, volley: 1.5, roll: 0.5, height: 2.0, ...o } });
const seg = (c, ang, h) => [[c[0] - Math.cos(ang) * h, c[1] - Math.sin(ang) * h], [c[0] + Math.cos(ang) * h, c[1] + Math.sin(ang) * h]];
const fdir = (a) => [Math.cos(a), Math.sin(a)];
const KJ = 2.7, JK = { size: 0.85, alpha: 0.13, life: 11, muzzle: 5 * KJ, windK: 1.1, rate: 2.9 / KJ, roll: 0.9, height: 2.4, cluster: [2.6, 1.4] };   // v2 r3 fix (B4-1): unscaled cluster/height (scaled ones threw the flashes off the block)   // v2 r1: v14 musketry scaled to the jersey framing (dist ~78, fxScale 24)
const KF = 0.63, VO = { size: 0.85, alpha: 0.13, life: 11, muzzle: 5 * KF, windK: 1.1, rate: 2.9 / KF, roll: 0.9, height: 2.4 * KF, cluster: [2.6 * KF, 1.4 * KF] };   // V2: v14 musketry at dist ~18                      // jersey wide (fxScale 40 is the default for wide)
const E05 = (c) => [c[0] + 0.5, c[1]];   // v2 r2 critic B: first skirmish flashes on the block   // v2 r3 fix (B4-1): segs ~1 u back onto the blocks (the lift puts the flash ahead), red on the moving front rank
const volleys = [
  VOL(JE, seg(E05(RD(43.4, 1.0)), FRD(44) + Math.PI / 2, 0.7), 15.8, 18.0, fdir(FRD(44)), { ...JK, volley: 2.4 }),
  VOL(JE, seg(RD(53.0), FRD(53) + Math.PI / 2, 2.0), 16.6, 18.8, fdir(FRD(51) + Math.PI), { ...JK, volley: 2.4, cluster: [1.2, 1.4] }),
  VOL(JE, seg(E05(RD(28.4, -2.4)), FRD(29) + Math.PI / 2, 0.7), 28.4, 30.6, fdir(FRD(29)), { ...JK, volley: 2.4 }),
  VOL(JE, seg(RD(40.7), FRD(40) + Math.PI / 2, 2.0), 29.4, 31.6, fdir(FRD(40) + Math.PI), { ...JK, volley: 2.4, cluster: [1.2, 1.4] })   /* red: one cluster per block of the front pair */,
  VOL(JE, seg(E05(RD(28.4, -2.4)), FRD(29) + Math.PI / 2, 0.7), 30.95, 33.15, fdir(FRD(29)), { ...JK, volley: 2.4, roll: 0.6 }),
  // the bridge (round 1): one short wave per attack, inside the word gaps: the guns + the line, the attackers answer once
  // V2: v14 musketry (S09_gm SMK x KF), each volley lasts 2.2 s (a real ripple of smoke) but fires ONCE (volley 2.4 > 2.2: one cue at
  // its start, inside the word gap; roll 0.4 keeps the last flash + its shot sound before 50.4)
  ...WAVE.map(([w0, w1], i) => VOL(TR, [[1351.9, 2074.6], [1352.9, 2074.6]], w0, w0 + 2.2,   /* v2 r1: on the block front */ [0, -1], { ...VO, volley: 2.4, roll: 0.4 })),
  ...WAVE.map(([w0, w1], i) => VOL(TR, [[1359.9, 2074.6], [1360.9, 2074.6]], w0 + 0.15, w0 + 2.35, [0, -1], { ...VO, volley: 2.4, roll: 0.35 })),
  ...WAVE.map(([w0, w1], i) => VOL(TR, [[AS[i][0] - 0.45, AS[i][1] + 0.2], [AS[i][0] + 0.45, AS[i][1] + 0.2]], Math.min(w1 - 0.3, w0 + 0.3), Math.min(w1 - 0.3, w0 + 0.3) + 2.2, [0, 1], { ...VO, volley: 2.4, roll: 0.15 })),
];
const shot = (t, at, imp, delay = 0.5) => ({ t, at, dir: [imp[0] - at[0], imp[1] - at[1]], impact: imp, delay });
const guns = [{ region: TR, opts: { plume: 0.45, puffs: 7, alpha: 0.2, jet: 1.6 },
  shots: WAVE.flatMap(([w0, w1], i) => [shot(w0 + 0.02, GUNS[0], [AS[i][0] - 0.3, AS[i][1] - 0.6], 0.25)].concat(w1 - w0 > 0.6 ? [shot(w1 - 0.45, GUNS[1], [AS[i][0] + 0.4, AS[i][1] - 1.0], 0.25)] : [])) }];
// night: campfires of both armies (the town and the fields north of the creek / the south bank behind the works)
const campfires = [
  { region: TR, pts: [[1344.2, 2060.4], [1348.6, 2057.2], [1352.0, 2061.6], [1360.6, 2061.2], [1364.4, 2057.0], [1369.4, 2063.0], [1373.6, 2058.6], [1356.4, 2058.8], [1366.0, 2064.6], [1342.0, 2054.6]],
    t0: T.stopped - 0.2, t1: T.D + 1, opts: { size: 2.0, glowSize: 7 } },
  { region: TR, pts: [[1346.0, 2078.2], [1350.6, 2078.8], [1355.6, 2078.6], [1361.4, 2078.4], [1366.2, 2078.6], [1371.0, 2078.0], [1375.6, 2077.6]],
    t0: T.night - 0.1, t1: T.D + 1, opts: { size: 2.0, glowSize: 7 } },
];
const fx = { volleys, guns, campfires };

// ---------------- generals, banners, labels ----------------
const generals = {
  washington: { img: "seq/washington.png", flag: "seq/grand_union_flag.png", side: "us", name: "Washington", full: "George Washington", role: "General" },
  cornwallis: { img: "seq/cornwallis.png", flag: "seq/gb1707_union_flag.png", side: "cs", name: "Cornwallis", full: "Charles, Earl Cornwallis", role: "Lieutenant General" },
};
const banners = [
  { general: "washington", region: JE, keys: [[0, ...bank(kT, "NJ", HW + 6.0)]], t0: T.washington + 0.1, t1: 11.4 },
  { general: "cornwallis", region: JE, keys: [[0, ...RD(61, -3.0)], [13.4, ...RD(61, -3.0)], [29.6, ...RD(44, -3.0)]], t0: T.cornwallis - 0.05, t1: 32.6 },
  { general: "washington", region: TR, keys: [[0, 1351.6, 2077.4]], t0: 51.0, t1: T.now - 0.2 },   // round 3: only once the night shot frames him (the dusk/bridge shots cut him at the bottom edge)   // round 1: no banners under the choice card
  { general: "cornwallis", region: TR, keys: [[0, 1357.4, 2059.4]], t0: 54.2,   /* round 5: 3 u south + in once the rising camera frames it (52.8 still cut) */ t1: T.now - 0.2 },
];
const labels = [
  { text: "Trenton", region: JE, at: [TRj[0] + 1.0, TRj[1] + 2.4], size: 18, t0: T.trenton - 0.05, t1: T.trenton + 3.5 },
  { text: "Trenton", region: TR, at: [1356.4, 2052.6], size: 19, t0: T.trentonT - 0.05, t1: T.trentonT + 3.4 },
  { text: "Assunpink Creek", region: TR, at: [1369.0, 2071.2], size: 17, river: true, t0: T.assunpink - 0.05, t1: T.assunpink + 3.6 },
  { text: "stone bridge", region: TR, at: [1357.6, 2070.4], size: 15, t0: T.bridge - 0.1, t1: T.bridge + 3.0 },
];

const NI = 1.0;   // V2: a real night (v8) + grade.night + film.grade night
window.SEQ = {
  grade: { wide: { toe: 14, ct: 0.96, sat: 0.95 }, night: { veil: [12, 18, 28], vt: 0.12, vb: 0.5, sat: 0.85 } },   // V2: v8 wide grade + the tested night veil
  name: "S06", D: T.D, T, seed: 1777, date: "1777-01-02",
  regions: [JE, TR],
  troops: "blocks", troopsOpts: { look: "lineblocks", size: 1.44, depthK: 0.44, sideCol: { u: "#3f5aa0", r: "#be3a2a" }, pal: { u: { coat: 0x6e7cab, plate: 0x7d8ec6 } } },   // V2: = v14
  regionOpts: { [JE]: { troopScale: 2.0, fxScale: 24, decks }, [TR]: { troopScale: 1.0, fxScale: 6.2 } },   // V2 recipe table
  features: { [JE]: { bridges: [0, 1, 2, 3, 4, 5, 6].map(() => ({ hidden: true })), houseK: 0.35 } },
  keys: [
    { t: 0, region: JE, at: [654.0, 1024.0], dist: 88, tilt: 44, yaw: 0, fov: 30 },                       // back over the river to Trenton
    { t: 10.6, region: JE, at: [660.0, 1022.0], dist: 84, tilt: 45, yaw: 0, fov: 30, ease: "lin" },
    { t: 13.6, region: JE, at: [RD(52)[0], RD(52)[1]], dist: 60, tilt: 44, yaw: 0, fov: 30, ease: "io" },   // 2 January: the post road
    { t: 19.0, region: JE, at: [RD(47)[0], RD(47)[1]], dist: 60, tilt: 43, yaw: 0, fov: 30, ease: "io" },
    { t: 22.4, region: JE, at: [RD(30)[0] - 4, RD(30)[1] + 4], dist: 100, tilt: 42, yaw: 0, fov: 30, ease: "io" },   // the plan: against the river
    { t: 26.0, region: JE, at: [RD(36)[0], RD(36)[1]], dist: 56, tilt: 45, yaw: 0, fov: 30, ease: "io" },    // Hand's riflemen
    { t: 32.45, region: JE, at: [RD(34)[0], RD(34)[1]], dist: 54, tilt: 46, yaw: 0, fov: 30, ease: "lin" },
    { t: 32.45, region: TR, at: [1357.0, 2067.5], dist: 46, tilt: 45, yaw: 0, fov: 30, night: 0.3, ease: "cut", dissolve: 0.9 },   // dusk: the creek, the town   // v2 r3: 3.5 u south (the timeline stays up: the blue block on the right was in the bottom 12 %)
    { t: 40.0, region: TR, at: [1356.8, 2071.6], dist: 18.5, tilt: 48, yaw: 0, fov: 30, night: 0.4, ease: "io" },
    { t: 44.8, region: TR, at: [1356.6, 2071.8], dist: 17, tilt: 49, yaw: 0, fov: 30, night: 0.45, ease: "io" },   // the bridge: three assaults
    { t: 50.4, region: TR, at: [1356.8, 2071.6], dist: 18, tilt: 49, yaw: 2, fov: 30, night: 0.5, ease: "lin" },
    { t: 55.4, region: TR, at: [1357.0, 2067.6], dist: 44, tilt: 45, yaw: 0, fov: 30, night: NI, ease: "io" },     // night: campfires both sides
    { t: 62.0, region: TR, at: [1354.0, 2070.0], dist: 54, tilt: 43, yaw: 0, fov: 30, night: NI, ease: "io" },
    { t: T.D, region: TR, at: [1353.0, 2071.0], dist: 58, tilt: 42, yaw: 0, fov: 30, night: NI, ease: "lin" },
  ],
  clouds: { [JE]: { scatter: { seed: 7, box: [560, 874, 220, 255], n: 9, med: 40 }, diveClear: 40, keepClear: [[656, 1024, 35, 1, 1], [700, 985, 30, 1, 1]] }, [TR]: { shadows: true } },   // round 2 (lead): visible wide clouds
  units, arrows, boats, fx, generals, banners, labels,
  overlay: [
    ["plaque.date", 0.4, { month: "December 1776", day: "", weekday: "", note: "" }],
    // V2: THE ARMIES key on the map shots (out for the decision card); the wax-seal timeline on the jersey map (Brooklyn + Trenton sealed)
    ["legend", 0.9, T.now - 0.4, { entries: [{ name: "Americans", sub: "Washington", color: "#3C6E9E" }, { name: "British", sub: "Cornwallis", color: "#9C3A35" }] }],
    ["timeline.show", 0.6, { month: "1776", year: "1777", cells: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"], at: 4.9 }],
    ["timeline.seal", 0.7, { at: 0.95, name: "Brooklyn" }],
    ["timeline.seal", 0.8, { at: 4.72, name: "Trenton" }],
    ["timeline.go", T.second - 0.05, { at: 5.1, d: 1.2 }],
    ["timeline.hide", T.now - 0.4],   // v2 r3 (A N6): kept on every map shot (dusk + night too, v8); steps out only for the decision card
    ["label", T.six - 0.05, T.ten - 0.3, { name: "Six more weeks", sub: "", world: bank(kT, "NJ", HW + 9.0), side: "us", marker: false }],
    ["label", T.ten - 0.05, 11.2, { name: "Ten dollars each", sub: "to stay", world: bank(kT, "NJ", HW + 9.0), side: "us", marker: false }],
    ["plaque.date", T.second - 0.05, { month: "January 1777", day: "2", weekday: "Thursday", note: "the road from Princeton" }],
    ["number", T.five - 0.05, T.plan - 0.3, { value: 5500, round: 500, world: RD(68, 9.0), size: 96 }],
    ["label", T.riflemen - 0.05, T.fell + 0.6, { name: "American riflemen", sub: "", world: RD(36, -6.0), side: "us", marker: false }],
    ["plaque.date", T.dark - 0.2, { month: "January 1777", day: "2", weekday: "Thursday", note: "dusk" }],
    ["label", T.three - 0.05, T.cannon, { name: "Three attacks", sub: "", world: [1356.4, 2063.0], side: "uk", marker: false }],
    ["plaque.date", T.night - 0.1, { month: "January 1777", day: "2", weekday: "Thursday", note: "night" }],
    ["film.grade", T.stopped - 0.6, "night", 0.8],   // V2 (v8 night)
    ["engage.decide", { t: T.now - 0.05, sub: "2 JANUARY 1777 · YOU ARE WASHINGTON", a: "HOLD THE CREEK\nAND FIGHT", b: "SLIP AWAY\nIN THE NIGHT", real: "b",
      tA: T.hold - 0.05, tB: T.slip - 0.05, tNote: T.tell - 0.05, tCount: T.comments, tReveal: T.D + 50, until: T.D + 1, dim: 0.55 }],   // the reveal opens S07
    ["label", T.riverI - 0.05, T.hold - 0.3, { name: "A river full of ice", sub: "", world: [1346.0, 2086.0], side: "us", marker: false }],
  ],
  // v2 r1: no pulse / glow effects (not in the v8 tests)
};
})();
