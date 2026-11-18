// S04 Grand Gulf and Bruinsburg (88.59 s). Regions: wide -> (cloud dive) bruinsburg.
// A  0-17.7   wide over Grand Gulf, 29 April: Porter's eight gunboats come down and engage the two forts (Fort Cobun, Fort Wade) on the
//             bluffs, the transports with ~10,000 men wait upstream off Hard Times; the clock runs 8:00 -> 13:30; not a single gun silenced.
// B  18.2-35.1 that night (0.8 s dissolve to night): the boats pull back; the guide = a small marker on the Louisiana shore (unnamed);
//             Bruinsburg, the road inland to Port Gibson (distance ruler, ~12 miles); "found correct".
// C  35.6-54.8 day again, wide pull-out: Sherman's boats up the Yazoo to Haynes' Bluff, a show of attack (gunboat shots), Pemberton looks
//             north (red force moves north); far east Grierson's thin cavalry arrow down the length of Mississippi, red boxes follow it.
// D  55.1-68.7 cut (section change) to the wide map over the crossing, plaque 30 APRIL · DAY 1; transports run down to Bruinsburg; cloud
//             dive into `bruinsburg` (swap 59.6): transports at the landing, boxes come ashore, form, the column moves inland; ~17,000.
// E  69.3-88.6 Grant banner at the landing; quote card (two sentences joined by an ellipsis, FACTCHECK_SCRIPT row 32).
// Facts: research/FACT_NOTES.md section 3 (Grand Gulf 8 a.m. - ~1:30 p.m., eight gunboats, ~10,000 on transports, the unnamed guide,
// Sherman's feint with ten regiments + eight gunboats, Grierson 17 Apr - 2 May, ~17,000 landed on 30 April).
(() => {
const T = { D: 88.59, landing: 1.87, ninth: 3.50, porter: 4.65, gunboats: 4.93, attacked: 5.45, forts: 6.15, gg: 6.67, ten: 8.41, waited: 9.29,
  transports: 9.95, five: 12.21, fired: 14.07, silence: 15.81, gun: 17.11,
  night: 18.45, black: 20.57, news: 21.95, good: 23.51, landing2: 23.71, further: 24.97, bruinsburg: 26.83, road: 29.25, inland: 29.61, pg: 30.49,
  info: 32.07, correct: 34.37,
  meanwhile: 36.17, shermans: 36.73, steamed: 37.27, yazoo: 38.13, north: 38.63, show: 40.23, attacking: 40.57, pem: 42.03, lookingN: 42.91,
  far: 44.19, east: 44.81, cavalry: 46.25, benjamin: 47.65, grierson: 48.13, rode: 48.73, length: 49.59, mississippi: 50.03, tearing: 51.37,
  railroads: 51.77, drawing: 52.69, troops: 53.67,
  morning: 55.73, thirtieth: 56.76, began: 58.41, bruinsburg2: 59.23, nobody: 60.79, waiting: 61.43, end: 63.13, seventeen: 64.78, soldiers: 66.01,
  shore: 67.97, quote: 69.41, grantW: 73.25, now: 74.75, enemyC: 75.47, vast: 77.05, stronghold: 78.39, vb: 79.27, base: 81.15, but: 82.13,
  dry: 83.55, same: 84.81, enemy: 86.39, quote2: 74.39 };
const D = T.D, WD = "wide", BR = "bruinsburg";
const NIGHT0 = 17.85, DAY0 = 35.25, CUT = 55.1;
const DV = VX.diveTimes(59.6);              // push 55.8 · deckIn 57.9 · full 59.05 · SW 59.6 · emerge 60.45 · land 62.95
const hsh = VX.hsh, sstep = VX.sstep;
const TW = (n) => VX.town(n, WD), P = (n) => VX.place(n);
const GG = TW("Grand Gulf"), HT = TW("Hard Times"), BRW = TW("Bruinsburg"), PGW = TW("Port Gibson"), VBG = TW("Vicksburg"), HB = TW("Haynes' Bluff"), JX = TW("Jackson");
const COBUN = P("Fort Cobun"), WADE = P("Fort Wade"), DIS = P("Disharoon's");

// ---------------- the wide Mississippi ----------------
const RW = VX.river(WD, 0).pts;
const idxNear = (x, y, from = 0, to = RW.length) => { let b = from; for (let i = from; i < to; i++) if (Math.hypot(RW[i][0] - x, RW[i][1] - y) < Math.hypot(RW[b][0] - x, RW[b][1] - y)) b = i; return b; };
const iHT = idxNear(1237, 922), iGG = idxNear(1242, 953), iDIS = idxNear(1236, 975), iBR = idxNear(1170, 1021);
const sl = (a, b, k = 4) => RW.slice(a, b + 1).filter((_, i, arr) => i % k === 0 || i === arr.length - 1).map((p) => [p[0], p[1]]);
const GGPATH = sl(iHT - 60, iGG + 50);             // Hard Times -> past the forts
const LG = VX.len(GGPATH);
const sOf = (x, y) => { let best = 0, bd = 1e9; for (let s = 0; s <= LG; s += 0.5) { const p = VX.along(GGPATH, s), d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = s; } } return best; };
const sFort = sOf(1242, 953);
// eight gunboats: come down on "Porter's gunboats", hold in front of the forts (circling slightly), pull back upstream that night
const gbS = (t, i) => { const st = sFort - 30 + i * 8.6 + 0.8 * Math.sin(t * 0.35 + i * 1.7);   // in line, ~1.4 boat lengths apart (no comb)
  const arrive = sstep(T.porter - 0.4, T.porter + 3.6, t), back = sstep(NIGHT0 - 0.4, 22.0, t);
  return Math.max(0, (st - 30) + 30 * arrive - 24 * back); };
const tpS = (t, i) => 4 + i * 7.5;                 // the transports wait off Hard Times
const DISPATH = sl(iDIS - 8, iBR + 10, 4);         // Disharoon's -> Bruinsburg (the crossing morning)
const LDP = VX.len(DISPATH);

// ---------------- close: the landing ----------------
const RC = VX.river(BR, 0).pts.map((p) => [p[0], p[1]]);
const ROAD = VX.road(BR, 0).map((p) => [p[0], p[1]]);
const LAND = P("Bruinsburg landing");                       // (1180.4, 1031.3)
// anchor line along the east bank of the Mississippi below the landing bluff
const bankPt = (s) => { const a = VX.along(RC, s), b = VX.along(RC, s + 0.5), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [a[0] - dy / l * 1.9, a[1] + dx / l * 1.9]; };
const sNear = (x, y) => { let best = 0, bd = 1e9; const L = VX.len(RC); for (let s = 0; s <= L; s += 0.25) { const p = VX.along(RC, s), d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = s; } } return best; };
const sLand = sNear(1168.5, 1024);
const BANK = (() => { const L = VX.len(RC), out = []; for (let s = 0; s <= L; s += 0.5) out.push(bankPt(s)); return out; })();
const sBankLand = sLand;                                     // same parametrisation (offset path)
const trS = (t, i) => sBankLand - 9 + i * 2.6 + Math.max(0, 6 - (t - (DV.SW - 2)) * 2.2) * -1;   // still drawing in for a moment after the swap

// ---------------- units ----------------
const U = "u", R = "r";
const FIELD = [[1186.2, 1036.0], [1192.6, 1037.6], [1189.0, 1041.6], [1196.4, 1041.0]];
const ROAD_IN = ROAD.filter((p) => p[0] >= 1188);
const units = [
  // A: the forts (Bowen's guns + infantry) on the Grand Gulf bluffs
  { region: WD, side: R, type: "art", n: 2, face: "west", keys: [[0, COBUN[0] + 2, COBUN[1]]] },
  { region: WD, side: R, type: "art", n: 2, face: "west", keys: [[0, WADE[0] + 2, WADE[1]]] },
  { region: WD, side: R, type: "inf", n: 3, face: "west", t0: 0.6, keys: [[0, GG[0] + 14, GG[1] + 4]] },
  // the men on the transports (boxes over the waiting steamers) off Hard Times; back to the Louisiana shore that night
  { region: WD, side: U, type: "inf", n: 3, face: "south", t0: T.ten, keys: [[0, 1229, 913], [NIGHT0 + 1, 1229, 913], [24.0, 1214, 916]] },
  { region: WD, side: U, type: "inf", n: 3, face: "south", t0: T.ten + 0.3, keys: [[0, 1226, 900], [NIGHT0 + 1, 1226, 900], [24.0, 1210, 904]], t1: CUT },
  // C: Sherman's feint at Haynes' Bluff
  { region: WD, side: U, type: "inf", n: 3, face: VX.FACE.ne, t0: T.show - 0.6, t1: CUT, keys: [[0, 1420, 562], [T.attacking + 1, 1428, 556]] },
  { region: WD, side: R, type: "art", n: 2, face: VX.FACE.sw, t0: DAY0, keys: [[0, HB[0] + 3, HB[1] - 2]] },
  // Pemberton looks north: a red force from the city toward Haynes' Bluff
  { region: WD, side: R, type: "inf", n: 3, face: "north", t0: DAY0, keys: [[0, VBG[0] + 18, VBG[1] + 2], [T.pem, VBG[0] + 18, VBG[1] + 2], [T.lookingN + 2.4, 1452, 596]] },
  { region: WD, side: R, type: "inf", n: 3, face: "east", t0: DAY0, keys: [[0, VBG[0] + 18, VBG[1] + 18]] },
  // C: Confederates drawn east after Grierson
  { region: WD, side: R, type: "inf", n: 2, face: "east", t0: T.drawing - 0.4, t1: CUT, keys: [[T.drawing - 0.4, JX[0] + 10, JX[1] + 6], [CUT, JX[0] + 80, JX[1] + 30]] },
  // D: the army on the transports runs down to Bruinsburg (wide)
  { region: WD, side: U, type: "inf", n: 3, face: "south", t0: CUT, keys: [[CUT, DIS[0] - 6, DIS[1] - 4], [DV.full, 1178, 1024]] },
];
// close: four divisions + guns come ashore from the transports and form on the fields; the first two take the road inland
const COL = (k, t0) => { const K = VX.march(ROAD_IN, t0, 1.25); return K; };
[[0, 60.9, 64.2], [1, 62.0, 66.4], [2, 63.4, null], [3, 65.0, null]].forEach(([k, ta, tm]) => {
  const start = bankPt(sBankLand - 3 + k * 2.2), keys = [[ta, start[0], start[1]], [ta + 1.8, LAND[0] + 0.6, LAND[1] + 0.4], [ta + 3.4, FIELD[k][0], FIELD[k][1]]];
  if (tm) { const c = COL(k, Math.max(tm, ta + 3.6) + 0.6); keys.push([c[0][0] - 0.6, ROAD_IN[0][0], ROAD_IN[0][1]], ...c); }
  units.push({ region: BR, side: U, type: "inf", n: 4, face: tm ? "east" : VX.FACE.ne, t0: ta, keys });
});
units.push({ region: BR, side: U, type: "art", n: 2, face: "east", t0: 66.2, keys: [[66.2, bankPt(sBankLand + 2)[0], bankPt(sBankLand + 2)[1]], [68.0, LAND[0] + 1, LAND[1] + 1.2], [70.0, 1190.6, 1033.8]] });
units.push({ region: BR, side: U, type: "inf", n: 4, face: VX.FACE.ne, t0: 70.5, keys: [[70.5, bankPt(sBankLand - 1)[0], bankPt(sBankLand - 1)[1]], [72.4, LAND[0] + 0.4, LAND[1] - 0.2], [74.4, 1186.0, 1036.2]] });

// ---------------- arrows ----------------
// round 3 (critic B N6, critic A): Grierson's raid inside the frame (camera pans east), a rider at the arrow's head, rail-break sparks on "tearing up"
const GRIER = [[1980, 650], [1974, 700], [1984, 750], [1974, 800], [1978, 850], [1970, 886]];
const G0 = T.cavalry, GDUR = 4.6;   // drawn 46.25 -> 50.85 (the rider reaches the south on "Mississippi")
// the rider at the head of the raid arrow (the engine draws an arrow to the fraction 1 - (1 - k)^2 of its length)
const GL = VX.len(GRIER), headS = (t) => { const k = VX.clamp((t - G0) / GDUR); return GL * (1 - (1 - k) ** 2); };
const MK = VX.markers([{ icon: "rider", region: "wide", path: GRIER, v: 0, t0: G0 + 0.15, t1: CUT - 0.1, size: 9, min: 44, max: 64, halo: "rgba(255,226,160,.8)", color: "#3a63b8", grierson: true }]);
{ const pos0 = MK.pos; MK.pos = (m, L, t) => m.grierson ? { p: VX.along(m.path, Math.max(0.5, headS(t))), s: headS(t) } : pos0(m, L, t); }
const SPARKS = [[51.4, 1981, 744], [51.75, 1976, 800], [52.1, 1977, 850]];
const arrows = [
  // B: the transports pull back (night)
  // C: Sherman up the Yazoo; Pemberton's men north; Grierson far east; the chase
  { region: WD, side: U, pts: VX.reverse(VX.river(WD, "Yazoo River").pts.map((p) => [p[0], p[1]])).filter((_, i, a) => i % 20 === 0 || i === a.length - 1), t0: T.steamed, dur: 2.2, t1: 44.6, width: 0.24 },
  { region: WD, side: R, pts: [[VBG[0] + 20, VBG[1] - 8], [1430, 640], [1446, 606]], t0: T.pem, dur: 1.4, t1: 44.6, width: 0.24 },
  { region: WD, side: U, pts: GRIER, t0: G0, dur: GDUR, t1: CUT, width: 0.24 },
  { region: WD, side: R, pts: [[JX[0] + 16, JX[1] + 8], [1934, 744], [1966, 762]], t0: T.drawing, dur: 1.4, t1: CUT, width: 0.24 },
  // D: the crossing (wide) down to Bruinsburg
  { region: WD, side: U, pts: DISPATH.filter((_, i, a) => i % 3 === 0 || i === a.length - 1), t0: CUT + 0.3, dur: 2.4, t1: DV.full, width: 0.24 },
  // D: the column inland from the landing (close)
  { region: BR, side: U, pts: ROAD_IN.filter((_, i, a) => i % 6 === 0 || i === a.length - 1).slice(0, 11), t0: T.end, dur: 2.4, t1: D + 1, width: 0.24 },
];

// ---------------- fx: the duel at Grand Gulf (every shot on screen) ----------------
const gbXY = (t, i) => VX.along(GGPATH, gbS(t, i));
const gbShots = [], fortShots = [];
{ let t = T.attacked + 0.1, k = 0;
  while (t < 17.6) { const i = Math.floor(hsh(k, 1) * 8), p = gbXY(t, i), f = hsh(k, 2) < 0.5 ? COBUN : WADE, dx = f[0] + 2 - p[0], dy = f[1] - p[1], l = Math.hypot(dx, dy);
    gbShots.push({ t: +t.toFixed(2), at: [p[0], p[1]], dir: [dx / l, dy / l], impact: [f[0] + 2 + (hsh(k, 3) - 0.5) * 6, f[1] + (hsh(k, 4) - 0.5) * 6], delay: 0.7 });
    const tf = t + 0.35 + hsh(k, 5) * 0.3, j = Math.floor(hsh(k, 6) * 8), q = gbXY(tf + 0.7, j), g = hsh(k, 7) < 0.5 ? COBUN : WADE, ex = q[0] - g[0] - 2, ey = q[1] - g[1], m = Math.hypot(ex, ey);
    fortShots.push({ t: +tf.toFixed(2), at: [g[0] + 2, g[1]], dir: [ex / m, ey / m], impact: [q[0] + (hsh(k, 8) - 0.5) * 4, q[1] + (hsh(k, 9) - 0.5) * 3], delay: 0.7 });
    k++; t += 0.75 + hsh(k, 0) * 0.55; } }
// Sherman's gunboats on the Yazoo make a show of attacking Haynes' Bluff
const YZ = VX.reverse(VX.river(WD, "Yazoo River").pts.map((p) => [p[0], p[1]]));
const LY = VX.len(YZ);
const yzS = (t, i) => Math.min(LY - 10 - i * 5, Math.max(0, (t - T.steamed) * 26 - i * 5));
const yzShots = [40.3, 41.0, 41.7, 42.5].map((t, k) => { const p = VX.along(YZ, yzS(t, k % 3)), dx = HB[0] + 3 - p[0], dy = HB[1] - 2 - p[1], l = Math.hypot(dx, dy);
  return { t, at: [p[0], p[1]], dir: [dx / l, dy / l], impact: [HB[0] + 3 + (hsh(k, 2) - 0.5) * 6, HB[1] - 2 + (hsh(k, 3) - 0.5) * 5], delay: 0.7 }; });
const fx = {
  guns: [
    { region: WD, preset: "field", h: 0.6, boom: false, size: 4, opts: { size: 1.6, alpha: 0.2, flash: 2.6 }, shots: gbShots, impactOpts: { size: 1.4 } },
    { region: WD, preset: "battery", h: 0.6, boom: false, size: 4, opts: { size: 1.8, alpha: 0.2, flash: 2.8 }, shots: fortShots, impactOpts: { size: 1.2 } },
    { region: WD, preset: "field", h: 0.6, boom: false, size: 4, opts: { size: 1.6, alpha: 0.2, flash: 2.6 }, shots: yzShots, impactOpts: { size: 1.4 } },
  ],
  // rail breaks: a puff of dust where the raid tears up the line (silent: no gun cue); the sparks themselves are custom sprites (build)
  impacts: SPARKS.map(([t, x, y]) => ({ region: WD, at: [x, y], t: t + 0.05, opts: { size: 2.0 } })),
};

// ---------------- boats ----------------
const boats = [
  { region: WD, kind: "gunboat", n: 8, size: 3.0, path: GGPATH, sAt: (t, i) => gbS(t, i), t0: T.porter - 0.3, t1: DAY0 + 0.5, lamp: false, wake: false },
  { region: WD, kind: "steamer", n: 6, size: 3.0, path: GGPATH, sAt: (t, i) => tpS(t, i), t0: 0, t1: DAY0 + 0.5, lamp: false, wake: false },
  { region: WD, kind: ["gunboat", "gunboat", "steamer", "steamer", "steamer", "steamer"], n: 6, size: 3.4, path: YZ, sAt: (t, i) => yzS(t, i), t0: T.steamed - 0.3, t1: CUT, lamp: false, wake: false },
  { region: WD, kind: ["gunboat", "steamer", "steamer", "steamer", "steamer", "steamer"], n: 6, size: 3.4, path: DISPATH,
    sAt: (t, i) => Math.max(0, Math.min(LDP - 4 - i * 7, (t - CUT) * 18 - i * 7)), t0: CUT, t1: DV.full, lamp: false, wake: false },
  // close: the transports at the landing + two gunboats standing by
  { region: BR, kind: ["steamer", "steamer", "gunboat", "steamer", "steamer", "gunboat"], n: 6, size: 0.75, path: BANK, sAt: (t, i) => trS(t, i), t0: DV.SW - 0.1, t1: D + 1, lamp: false },
];

// ---------------- camera ----------------
const keys = [
  { t: 0, region: WD, at: [1232, 936], dist: 230, tilt: 47, yaw: -4, fov: 30 },
  { t: 6.0, region: WD, at: [1240, 946], dist: 205, tilt: 48, yaw: -6, fov: 30 },
  { t: NIGHT0, region: WD, at: [1246, 954], dist: 190, tilt: 49, yaw: -7, fov: 30, night: 0 },
  { t: NIGHT0 + 0.8, region: WD, at: [1245, 956], dist: 196, tilt: 49, yaw: -7, fov: 30, night: 1, ease: "lin" },
  { t: 24.0, region: WD, at: [1232, 990], dist: 300, tilt: 47, yaw: -4, fov: 30, night: 1 },
  { t: DAY0, region: WD, at: [1246, 990], dist: 312, tilt: 47, yaw: -3, fov: 30, night: 1 },
  { t: DAY0 + 0.8, region: WD, at: [1250, 980], dist: 340, tilt: 47, yaw: -3, fov: 30, night: 0, ease: "lin" },
  { t: 38.6, region: WD, at: [1400, 640], dist: 420, tilt: 45, yaw: -1, fov: 30 },
  { t: 43.0, region: WD, at: [1420, 620], dist: 400, tilt: 45, yaw: 0, fov: 30 },
  { t: 47.2, region: WD, at: [1832, 775], dist: 440, tilt: 36, yaw: 0, fov: 30 },
  { t: CUT, region: WD, at: [1836, 777], dist: 435, tilt: 36, yaw: 0, fov: 30 },
  { t: CUT, region: WD, at: [1212, 1002], dist: 250, tilt: 46, yaw: -6, fov: 30, ease: "cut" },
  // (the dive inserts push 55.8 -> land 62.95)
  { t: 67.0, region: BR, at: [1183.0, 1031.0], dist: 36, tilt: 50, yaw: -58, fov: 31 },
  { t: 76.0, region: BR, at: [1188.0, 1033.0], dist: 40, tilt: 46, yaw: -66, fov: 31 },
  { t: D, region: BR, at: [1192.0, 1031.0], dist: 44, tilt: 44, yaw: -74, fov: 31 },
];

const W1 = "#3C6E9E", R1 = "#9C3A35";
window.SEQ = {
  name: "S04", D, T, seed: 1504, date: "1863-04-29",
  regions: [WD, BR],
  regionOpts: { [WD]: { troopScale: 13 }, [BR]: { troopScale: 1.6 } },
  keys,
  dives: [{ t: DV.SW, over: [1182, 1028],
    from: { region: WD, at: [1196, 1014], dist: 236, tilt: 46, yaw: -8 },
    to: { region: BR, at: [1180.0, 1030.0], dist: 40, tilt: 50, yaw: -54, fov: 31 } }],
  clouds: {
    [WD]: { scatter: { seed: 3 }, keepClear: [[1240, 950, 70, 1, 0.9], [1220, 1000, 70, 1, 0.9], [1410, 600, 70, 1, 0.8], [1960, 740, 200, 1, 1], [1880, 730, 90, 1, 0.9], [1395, 690, 100, 1, 0.9], [1340, 650, 70, 1, 0.8], [1560, 700, 140, 1, 0.9], [1700, 760, 120, 1, 0.9]], nightErode: 0.4 },
    [BR]: { shadows: true },
  },
  units, arrows, boats, fx,
  build: async (ctx) => { MK.build(ctx);
    // rail-break sparks on "tearing up": a hot orange flash + a fan of embers at each break, 0.8 s each (flat additive sprites, wide units)
    ctx.FX[WD].custom((t, push) => { for (const [t0, x, y] of SPARKS) { const u = t - t0; if (u < 0 || u > 0.9) continue; const h = ctx.world.heightAt(x, y, WD) + 1.2,
      f = sstep(0, 0.05, u) * (1 - sstep(0.15, 0.6, u));
      push(x, h, y, 24, 0.6 * f, 1.1, 0.42, 0.1); push(x, h + 0.5, y, 9, 1.0 * f, 1.3, 0.85, 0.45);
      for (let j = 0; j < 9; j++) { const a = hsh(j, t0) * 6.283, r = 4 + 10 * u * (0.6 + 0.6 * hsh(j, 3)); push(x + Math.cos(a) * r, h + 2 + 14 * u - 18 * u * u, y + Math.sin(a) * r * 0.6, 2.4, (1 - sstep(0.3, 0.9, u)), 1.4, 0.7, 0.2); } } }); },
  draw: (t, ctx) => { MK.draw(t, ctx); },
  banners: [
    { general: "pemberton", region: WD, keys: [[0, VBG[0] + 4, VBG[1] - 4]], t0: T.pem + 0.05, t1: CUT },
    { general: "grant", region: BR, keys: [[0, LAND[0] + 2.4, LAND[1] - 2.0]], t0: T.grantW + 0.05, t1: D + 1 },
  ],
  labels: [
    { text: "Grand Gulf", town: "Grand Gulf", size: 20, t0: T.gg, t1: T.gg + 3.6, region: WD },
    { text: "Bruinsburg", town: "Bruinsburg", size: 20, t0: T.bruinsburg, t1: T.bruinsburg + 5.0, region: WD },
    { text: "Port Gibson", town: "Port Gibson", size: 20, t0: T.pg, t1: T.pg + 4.0, region: WD },
    { text: "Yazoo River", at: [1386, 598], size: 18, t0: T.yazoo, t1: T.yazoo + 3.6, region: WD, river: true },
    { text: "Haynes' Bluff", town: "Haynes' Bluff", size: 18, t0: T.show - 0.2, t1: T.show + 3.4, region: WD },
    { text: "Vicksburg", town: "Vicksburg", size: 20, t0: T.pem - 0.2, t1: T.pem + 3.4, region: WD },
    { text: "Jackson", town: "Jackson", size: 20, t0: T.east, t1: T.benjamin - 0.2, region: WD },
    { text: "Jackson", town: "Jackson", size: 20, t0: T.drawing, t1: CUT, region: WD },
    { text: "Bruinsburg", town: "Bruinsburg", size: 20, t0: CUT + 0.3, t1: DV.full - 0.3, region: WD },
    { text: "Bruinsburg", at: [1186.0, 1027.6], size: 22, t0: DV.SW + 1.0, t1: DV.SW + 4.6, region: BR },
    { text: "Mississippi River", at: [1160.5, 1030.0], size: 19, t0: T.shore - 0.4, t1: T.shore + 1.4, region: BR, river: true },
  ],
  overlay: [
    // A
    ["plaque.date", T.ninth, { month: "April 1863", day: "29", weekday: "Wednesday", note: "Grand Gulf" }],
    ["medallion", { kind: "card", general: "porter", sub: "eight gunboats", screen: [1765, 215], tIn: T.porter, tOut: 8.3 }],
    ["label", T.ten, T.ten + 3.4, { name: "10,000 men", sub: "waiting on the transports", world: [1222, 905], side: "us", marker: false, offset: [-330, -30] }],
    ["plaque.clock", T.five - 0.1, { time: "8:00", note: "the bombardment", header: "29 April 1863" }],
    ["plaque.run", T.five + 0.2, 14.8, "13:30", { step: 5 }],
    ["label", T.silence, T.silence + 3.0, { name: "Not a single gun silenced", sub: "after five and a half hours", world: [COBUN[0] + 6, COBUN[1] - 2], side: "cs", marker: false }],
    // B
    ["film.grade", NIGHT0, "night", 0.8],
    ["plaque.date", T.night, { month: "April 1863", day: "29", weekday: "Wednesday", note: "that night" }],
    ["label", T.black, T.news + 3.0, { name: "A local man", sub: "comes in with news", world: [HT[0] - 9, HT[1] - 2] }],
    ["label", T.good + 0.1, T.bruinsburg + 0.4, { name: "A good landing", sub: "a few miles further down", world: [BRW[0] + 2, BRW[1]], side: "us", marker: false, offset: [-330, -60] }],
    ["distance", T.road, T.correct + 0.6, { from: [BRW[0] + 2, BRW[1]], to: [PGW[0], PGW[1]], value: 12, unit: "MILES", sub: "a good road inland", dash: false }],
    ["plaque.note", T.correct - 0.3, "the news is found correct"],
    // C
    ["film.grade", DAY0, "day", 0.8],
    ["plaque.date", T.meanwhile, { month: "April 1863", day: "29", weekday: "Wednesday", note: "feints" }],
    ["medallion", { kind: "card", general: "sherman", sub: "a show of attack on the Yazoo", screen: [1765, 215], tIn: T.shermans, tOut: 41.2 }],
    ["label", T.attacking, T.attacking + 2.8, { name: "A show of attack", sub: "to keep Pemberton looking north", world: [1422, 556], side: "us", marker: false, offset: [36, 40] }],
    ["legend", T.pem, CUT - 0.2, { entries: [{ name: "Union", color: W1 }, { name: "Confederates", sub: "Pemberton", color: R1 }] }],
    ["medallion", { kind: "card", general: "grierson", sub: "a cavalry raid · 17 April - 2 May", screen: [1240, 215], tIn: T.benjamin, tOut: 51.15 }],
    ["label", T.tearing + 0.35, T.tearing + 3.4, { name: "Railroads torn up", sub: "far to the east", world: [1978, 724], side: "us", marker: false, offset: [-300, 90] }],
    // D
    ["plaque.date", T.thirtieth, { month: "April 1863", day: "30", weekday: "Thursday", note: "DAY 1 · morning" }],
    ["label", T.nobody, T.nobody + 3.0, { name: "Nobody waiting", sub: "the landing is unopposed", world: [1198, 1024], side: "us", marker: false }],
    ["number", T.seventeen, T.shore + 0.4, { value: 17000, round: 1000, world: [1192, 1032], size: 92 }],
    ["plaque.note", T.end, "DAY 1 · by the end of the day"],
    // E
    ["quote", T.quote + 0.05, 73.6, { en: "I felt a degree of relief scarcely ever equalled since.", attr: "Ulysses S. Grant · Personal Memoirs", y: 840, dim: 0.45 }],
    ["quote", T.quote2, 81.7, { en: "I was now in the enemy's country, with a vast river and the stronghold of Vicksburg between me and my base of supplies.", attr: "Ulysses S. Grant · Personal Memoirs", y: 820, dim: 0.45 }],
    ["quote", T.but, 87.9, { en: "But I was on dry ground on the same side of the river with the enemy.", attr: "Ulysses S. Grant · Personal Memoirs", y: 840, dim: 0.45 }],
  ],
};
void sstep; void HT; void tpS; void COL;
})();
