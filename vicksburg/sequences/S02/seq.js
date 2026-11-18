// S02 the fortress and the plan (136.71 s). Regions: wide -> (cut on the paragraph change) vicksburg -> (cut on the stakes line) wide.
// A  0-20.4   wide: the river from Milliken's Bend to the south edge; the Union-held river north glows blue, the Confederate stretch from
//             Vicksburg south (to Port Hudson, off the map) glows red; Port Hudson label at the south edge; supply arrows from the West
//             cross the river and are cut on "cut in two".
// B  20.4-39.5 vicksburg close: the hairpin bend under the town (inset: Harper's Weekly view of the city from the river), a steamer
//             slows to round the bend, the bluff batteries appear one by one and fire at it; the Yazoo swamps north, Grand Gulf south.
// C  39.5-56.9 the city: Pemberton's banner at his HQ, red boxes in the city lines, Pemberton card, Davis card (hold Vicksburg), legend.
// D  56.9-64.9 wide (cut): the stakes line, the map tilts, the red stretch pulses, a blue arrow down the river stopped above the city.
// E  64.9-87.0 the winter of failures: Sherman card, Chickasaw Bayou (attack + recoil), Grant's Canal, the Yazoo routes; ledger with
//             FAILED stamps; no Grant name yet.
// F  87.4-103.2 NAME MOMENT over the Union camps at Young's Point: Grant card on "Ulysses", Grant banner on "Grant", plaque Spring 1863.
// G  103.7-124.8 the plan step by step: march down the west bank to Hard Times, the fleet past the guns, the crossing arrow, the enemy's
//             side, Vicksburg pulses red between Grant and his supplies.
// H  125.4-136.7 Sherman card; a ghost arrow back north; letter card (Sherman to Rawlins, 8 April 1863, "zealous co-operation").
// Facts: research/FACT_NOTES.md sections 1-3; FACTCHECK_SCRIPT rows 6-18; grant/research/FACTCHECK_B_vicksburg.md #12 (the letter).
(() => {
const T = { D: 136.71, winter: 0.64, union: 2.68, held: 3.02, miss: 3.50, only: 6.42, confed: 7.88, vb: 9.10, port: 10.34, louisiana: 11.14,
  across: 11.78, men: 13.50, supplies: 14.90, west: 15.92, close: 16.90, cut: 19.18,
  vb2: 20.82, river: 23.02, hairpin: 24.18, bend: 24.52, town: 25.34, slow: 27.20, round: 28.14, above: 29.16, batteries: 30.82, bluffs: 31.48,
  miles: 31.94, north: 33.40, yazoo: 35.00, south: 36.38, guns: 37.40, grandGulf: 38.14,
  man: 39.88, holding: 40.14, john: 41.04, pem: 41.50, penn: 42.70, virginian: 44.48, south2: 46.08, orders: 47.38, davis: 48.06, hold: 50.22,
  ground: 51.92, side: 52.94, riverFront: 53.96, swamps: 55.24,
  other: 57.34, while: 58.04, vb3: 58.30, northU: 60.00, use: 60.88, river3: 61.38, southC: 62.42, cut2: 63.48,
  general: 65.46, everything: 67.74, december: 69.16, friend: 70.28, sherman: 71.00, attacked: 71.38, bluffs2: 72.26, chickasaw: 73.58,
  thrown: 75.42, losses: 76.68, allWinter: 77.92, dug: 79.66, canals: 80.02, bends: 81.42, cutThrough: 82.04, flooded: 82.54, forests: 82.96,
  round2: 83.94, every: 85.48, failed: 86.12,
  northP: 87.80, newspapers: 88.54, removal: 90.08, name: 91.40, ulysses: 92.00, grant: 93.26, fortyone: 95.63, spring: 96.52,
  generals: 98.26, shermanAmong: 99.24, riskiest: 102.14,
  march: 104.06, westBank: 105.46, louisiana2: 107.46, swampsL: 108.00, far: 109.20, below: 109.58, city: 110.16, navy: 111.38, run: 112.24,
  boats: 112.62, gunsV: 113.68, vb4: 114.24, night: 115.00, carry: 115.74, acrossA: 116.58, over: 118.18, enemy: 120.08, fortress: 121.70,
  between: 122.14, supply: 123.62,
  shermanH: 125.64, backNorth: 127.02, land: 128.80, but: 129.84, grantH: 130.44, wrote: 131.62, zealous: 133.16, coop: 133.78 };
const D = T.D, WD = "wide", VB = "vicksburg";
const CUT1 = 20.42, CUT2 = 56.95;          // paragraph changes (20.17 -> 20.72, 56.64 -> 57.19)
const hsh = VX.hsh, sstep = VX.sstep, lerp = VX.lerp;
const TW = (n) => VX.town(n, WD), P = (n) => VX.place(n);
const VBG = TW("Vicksburg"), YP = TW("Young's Point"), MB = TW("Milliken's Bend"), HT = TW("Hard Times"), GG = TW("Grand Gulf"), NC = TW("New Carthage");
const HB = TW("Haynes' Bluff"), CHB = P("Chickasaw Bayou"), WH = P("Walnut Hills"), CANAL = P("Grant's canal");

// ---------------- the wide Mississippi (north -> south) ----------------
const RW = VX.river(WD, 0).pts;
const RWxy = RW.map((p) => [p[0], p[1]]);
const idxNear = (x, y, from = 0, to = RW.length) => { let b = from; for (let i = from; i < to; i++) if (Math.hypot(RW[i][0] - x, RW[i][1] - y) < Math.hypot(RW[b][0] - x, RW[b][1] - y)) b = i; return b; };
const iVB = idxNear(1377, 681), iYP = idxNear(1300, 642, 0, iVB), iTop = idxNear(1215, 470, 0, iYP), iHT = idxNear(1222, 930, iVB), iBot = RW.length - 1;
const thin = (a, b, k) => RWxy.slice(a, b + 1).filter((_, i, arr) => i % k === 0 || i === arr.length - 1);
const RIV_S = thin(iVB, iBot, 30);            // Vicksburg -> the south edge (the Confederate stretch on the map)
const RIV_N = thin(iTop, iVB - 40, 30);       // the north (Union river) down to just above the city
const RIV_RUN = thin(iYP, iHT, 12);           // Young's Point -> past the city -> Hard Times (the run)
const BOTTOM = RW[iBot - 60];                 // where Port Hudson is pointed at (south edge)
const yBot = RW[iBot][1];

// ---------------- close: river, batteries ----------------
const RIVC = VX.river(VB, 0).pts.map((p) => [p[0], p[1]]);
const BAT = VX.region(VB).features.batteries;
// a steamer coming down the river, slowing to round the hairpin (arc length along RIVC: 108 = top of the hairpin, 122-160 the city front)
const KS = [[23.2, 52], [26.6, 86], [29.0, 99], [31.6, 105], [33.6, 107], [CUT2, 107]];   // she rounds into the bend, comes under the guns and holds there
const sBoat = (t) => { if (t <= KS[0][0]) return KS[0][1] - (KS[0][0] - t) * 10; for (let i = 1; i < KS.length; i++) if (t < KS[i][0]) { const [t0, s0] = KS[i - 1], [t1, s1] = KS[i];
  const k = (t - t0) / (t1 - t0); return s0 + (s1 - s0) * k; } return KS[KS.length - 1][1]; };
const sSm = (t) => { let a = 0; for (let k = -6; k <= 6; k++) a += sBoat(t + k * 0.25); return a / 13; };
const boatXY = (t) => VX.along(RIVC, sSm(t));
const SHOTS = [[31.0, 3], [31.9, 5], [32.7, 2], [33.6, 6]].map(([t, b], k) => { const c = BAT[b], p = boatXY(t + 0.7), ang = hsh(k, 9) * 6.283, miss = 0.6 + hsh(k, 3) * 0.9;
  const dx = p[0] - c.x, dy = p[1] - c.z, l = Math.hypot(dx, dy); return { t, at: [c.x, c.z], dir: [dx / l, dy / l], impact: [p[0] + Math.cos(ang) * miss, p[1] + Math.sin(ang) * miss * 0.6], delay: 0.7 }; });

// ---------------- world handle + custom glows ----------------
let WW = null;
const waterY = (r, wl) => wl * WW.regions[r].ys + 0.05;
const glow = (pts, t, k, col, size, a) => { for (const p of pts) a(p, t, k, col, size); };
void glow;
const RW_S = RW.slice(iVB, iBot + 1).filter((_, i) => i % 5 === 0);
const RW_N = RW.slice(iTop - 400 < 0 ? 0 : iTop - 400, iVB - 30).filter((_, i) => i % 5 === 0);
const redK = (t) => Math.max(sstep(T.confed - 0.3, T.confed + 1.4, t) * (1 - sstep(CUT1 - 0.4, CUT1, t)),
  sstep(CUT2, CUT2 + 0.8, t) * (1 - sstep(64.6, 66.4, t)));
const blueK = (t) => sstep(T.miss - 0.2, T.miss + 1.4, t) * (1 - sstep(CUT1 - 0.4, CUT1, t));
const customs = [
  { region: WD, fn: (t, push) => { if (!WW) return;
    const kr = redK(t); if (kr > 0.002) for (const p of RW_S) { const s = (p[1] - RW[iVB][1]) / (yBot - RW[iVB][1]), ph = (t - T.confed) * 0.9 - s * 1.2,
      pulse = 0.62 + 0.38 * Math.cos(ph * 6.283), grow = sstep(s - 0.08, s, (t - T.confed + 0.4) * 0.8);
      push(p[0], waterY(WD, p[2]) + 0.3, p[1], 15, 0.26 * kr * pulse * Math.max(grow, t > CUT2 ? 1 : 0), 1.0, 0.16, 0.08); }
    const kb = blueK(t); if (kb > 0.002) for (const p of RW_N) push(p[0], waterY(WD, p[2]) + 0.3, p[1], 13, 0.2 * kb * (0.85 + 0.15 * Math.sin(t * 2 + p[1] * 0.05)), 0.3, 0.55, 1.4); } },
];

// ---------------- units ----------------
const U = "u", R = "r";
const units = [
  // wide: the garrison + the river guns (all wide shots)
  { region: WD, side: R, type: "inf", n: 3, face: "east", t0: T.vb - 0.2, keys: [[0, 1402, 682]] },
  { region: WD, side: R, type: "art", n: 1, face: "west", t0: T.vb - 0.2, keys: [[0, 1389, 668]] },
  { region: WD, side: R, type: "art", n: 1, face: "west", t0: T.vb - 0.2, keys: [[0, 1385, 693]] },
  // wide: Grand Gulf guns (spoken in B; on the wide map from the stakes line on)
  { region: WD, side: R, type: "art", n: 1, face: "west", t0: CUT2, keys: [[0, GG[0] + 5, GG[1] + 2]] },
  // wide: the Union above the city (Milliken's Bend, Young's Point) on "Union held"
  { region: WD, side: U, type: "inf", n: 3, face: "south", t0: T.union, keys: [[0, MB[0] - 14, MB[1] + 10]] },
  { region: WD, side: U, type: "inf", n: 3, face: "south", t0: T.union + 0.3, keys: [[0, YP[0] - 40, YP[1] + 8]] },
  // Chickasaw Bayou (December): Sherman's men land on the Yazoo, attack the bluffs, are thrown back
  { region: WD, side: U, type: "inf", n: 3, face: VX.FACE.se, t0: T.december + 0.4, t1: T.allWinter + 1.0,
    keys: [[0, 1386, 608], [T.attacked, 1386, 608], [T.chickasaw + 0.4, 1404, 624], [T.thrown, 1404, 624], [T.thrown + 1.4, 1388, 610]] },
  { region: WD, side: R, type: "inf", n: 3, face: VX.FACE.nw, t0: T.december + 0.6, keys: [[0, 1421, 632]] },
  // the plan: the army marches down the west bank (Milliken's Bend -> Hard Times)
];
// the west-bank road (Louisiana): Milliken's Bend - Richmond - Roundaway Bayou - round the river's western loop - New Carthage - Hard Times,
// 12-30 units (1.5-4 km) west of the channel everywhere (the baked road 0/1 runs ON the channel between New Carthage and Perkins')
const WB = [MB, [1199, 609], [1180, 629], TW("Richmond"), [1172, 662], [1186, 676], [1199, 690], [1205, 706], [1204, 726], [1197, 746], [1186, 765], [1172, 782],
  [1161, 800], [1155, 822], [1156, 846], [1163, 866], [1176, 882], NC, [1209, 903], HT];
const WBthin = WB;
const WBL = VX.len(WB);
const kWB = VX.march(WBthin, T.march, WBL / (T.city + 0.4 - T.march), { step: 6 });
units.push({ region: WD, side: U, type: "inf", n: 3, face: "south", t0: T.march - 0.1, t1: D + 1, keys: kWB });
// close: the bluff guns appear one by one along the bluffs on "batteries lined the bluffs for miles"; garrison in the city lines
BAT.forEach((b, i) => { if (i > 10) return; units.push({ region: VB, side: R, type: "art", n: 2, face: "west", t0: 29.4 + i * 0.22, keys: [[0, b.x + 0.6, b.z]] }); });
[[1398.5, 667.5], [1401.0, 681.5], [1396.0, 694.0]].forEach(([x, y], i) => units.push({ region: VB, side: R, type: "inf", n: 3, face: "east", t0: T.holding + i * 0.35, keys: [[0, x, y]] }));

// ---------------- arrows ----------------
const arrows = [
  // A: supplies from the West across the Confederate stretch (cut on "cut in two")
  { region: WD, side: R, pts: [[1046, 792], [1130, 790], [1230, 778], [1318, 742], [1366, 700]], t0: T.across, dur: 1.6, t1: T.cut + 0.2, width: 0.38 },
  { region: WD, side: R, pts: [[1046, 905], [1120, 912], [1196, 930], [1252, 950]], t0: T.across + 0.5, dur: 1.6, t1: T.cut + 0.2, width: 0.38 },
  { region: WD, side: R, pts: [[1046, 1012], [1110, 1024], [1170, 1032], [1232, 1022], [1300, 1018]], t0: T.across + 1.0, dur: 1.6, t1: T.cut + 0.2, width: 0.38 },
  // A: the Confederate river runs on south to Port Hudson (off the map)
  { region: WD, side: R, pts: thin(iBot - 420, iBot - 8, 30), t0: T.port, dur: 1.4, t1: CUT1, width: 0.36 },
  // D: stakes: the North cannot use the river (blue down the river, stopped above the city); the South still joined (red across)
  { region: WD, side: U, pts: RIV_N, t0: T.northU - 0.1, dur: 1.4, t1: 64.6, width: 0.42 },
  { region: WD, side: R, pts: [[1060, 742], [1180, 730], [1290, 712], [1372, 694]], t0: T.southC, dur: 1.2, t1: 65.6, width: 0.42 },
  // E: Chickasaw Bayou: the attack on the bluffs
  { region: WD, side: U, pts: [[1382, 600], [1392, 612], [1402, 624], [1410, 632]], t0: T.attacked, dur: 1.2, t1: T.thrown + 0.6, width: 0.42 },
  // E: Grant's Canal across De Soto Point; the Yazoo routes from the north through the flooded forests (stopped short)
  { region: WD, side: U, pts: [[1323, 694], [1334, 700], [1346, 707], [1358, 714]], t0: T.canals, dur: 1.2, t1: T.failed + 0.6, width: 0.24 },
  { region: WD, side: U, pts: [[1492, 424], [1482, 458], [1468, 490], [1454, 516]], t0: T.cutThrough, dur: 1.6, t1: T.failed + 0.6, width: 0.4 },
  // G: the plan: down the west bank; the fleet past the guns; the crossing
  { region: WD, side: U, pts: WB, t0: T.march, dur: T.city + 0.4 - T.march, t1: D + 1, width: 0.28 },
  { region: WD, color: "#86AEDC", pts: RIV_RUN, t0: T.run, dur: 3.2, t1: D + 1, width: 0.2 },
  { region: WD, side: U, pts: [[HT[0] - 4, HT[1] + 16], [HT[0] + 12, HT[1] + 30], [GG[0] + 4, GG[1] + 6]], t0: T.carry - 0.2, dur: 1.0, t1: D + 1, width: 0.48 },
  // H: Sherman's alternative: back north and try again by land (a thin ghost arrow off the top of the map)
  { region: WD, side: U, pts: [[MB[0] + 6, MB[1] - 4], [MB[0] + 10, MB[1] - 50], [MB[0] + 2, MB[1] - 110], [MB[0] - 6, MB[1] - 170]], t0: T.backNorth, dur: 1.4, t1: T.but + 0.6, width: 0.3 },
];

// ---------------- fx ----------------
const fx = {
  volleys: [
    // Chickasaw Bayou: the Confederate line on the bluffs fires on the attack (on screen, small)
    { region: WD, pts: [[1414, 634], [1426, 628]], t0: T.attacked + 0.8, t1: T.thrown + 1.0, cue: true, every: 1.4, opts: { dir: [-1, -0.6], size: 5, alpha: 0.22, life: 7, muzzle: 6, volley: 1.4, rate: 2.0, windK: 0.4 } },
  ],
  guns: [
    { region: VB, preset: "battery", h: 0.25, boom: false, opts: { size: 1.6, alpha: 0.2, flash: 2.2 }, shots: SHOTS, impactOpts: { size: 0.6 } },
  ],
};

// ---------------- the boats ----------------
const boats = [
  { region: VB, kind: "steamer", n: 1, size: 0.95, path: RIVC, sAt: () => 0, t0: 22.6, t1: CUT2, lamp: false },   // (sAt replaced below)
  // G: the fleet runs down past the city to Hard Times (plan, wide)
  { region: WD, kind: ["gunboat", "gunboat", "gunboat", "steamer", "steamer"], n: 5, size: 3.6, path: RIV_RUN,
    sAt: (t, i) => Math.max(0, (t - T.run) * 34 - i * 9), t0: T.navy, t1: D + 1, lamp: false },
];
boats[0].sAt = (t) => sSm(t);

// ---------------- camera ----------------
const keys = [
  // A: the river from altitude
  { t: 0, region: WD, at: [1352, 812], dist: 545, tilt: 34, yaw: 0, fov: 30 },
  { t: 10.8, region: WD, at: [1352, 816], dist: 530, tilt: 35, yaw: 0, fov: 30 },
  { t: CUT1, region: WD, at: [1354, 808], dist: 505, tilt: 37, yaw: -1, fov: 30 },
  // B: the bend + the bluffs
  { t: CUT1, region: VB, at: [1360, 686], dist: 56, tilt: 46, yaw: 6, fov: 32, ease: "cut" },
  { t: 28.0, region: VB, at: [1366, 684], dist: 54, tilt: 47, yaw: 10, fov: 32 },
  { t: 33.0, region: VB, at: [1372, 684], dist: 50, tilt: 48, yaw: 12, fov: 32 },
  { t: 39.2, region: VB, at: [1372, 686], dist: 54, tilt: 47, yaw: 8, fov: 32 },
  // C: the city + Pemberton
  { t: 44.0, region: VB, at: [1385, 684], dist: 38, tilt: 50, yaw: -12, fov: 32 },
  { t: 51.6, region: VB, at: [1386, 683], dist: 36, tilt: 51, yaw: -16, fov: 32 },
  { t: CUT2, region: VB, at: [1380, 682], dist: 44, tilt: 48, yaw: -12, fov: 32 },
  // D: the stakes line (wide, the map tilts)
  { t: CUT2, region: WD, at: [1352, 816], dist: 530, tilt: 35, yaw: 0, fov: 30, ease: "cut" },
  { t: 64.4, region: WD, at: [1352, 814], dist: 520, tilt: 30, yaw: 3, fov: 30 },
  // E: the north of the city: Chickasaw Bayou, Grant's Canal, the Yazoo
  { t: 68.4, region: WD, at: [1366, 628], dist: 330, tilt: 44, yaw: 0, fov: 30 },
  { t: 76.6, region: WD, at: [1376, 626], dist: 300, tilt: 46, yaw: -2, fov: 30 },
  { t: 79.0, region: WD, at: [1356, 662], dist: 330, tilt: 45, yaw: -1, fov: 30 },
  { t: 81.4, region: WD, at: [1360, 664], dist: 326, tilt: 45, yaw: -1, fov: 30 },
  { t: 84.6, region: WD, at: [1412, 596], dist: 360, tilt: 44, yaw: 0, fov: 30 },
  { t: 87.0, region: WD, at: [1400, 606], dist: 380, tilt: 44, yaw: 0, fov: 30 },
  // F: the Union camps at Young's Point / Milliken's Bend (name moment)
  { t: 91.0, region: WD, at: [1282, 646], dist: 250, tilt: 47, yaw: -2, fov: 30 },
  { t: 102.6, region: WD, at: [1272, 660], dist: 236, tilt: 48, yaw: -4, fov: 30 },
  // G: the plan
  { t: 107.0, region: WD, at: [1330, 790], dist: 440, tilt: 44, yaw: 0, fov: 30 },
  { t: 116.8, region: WD, at: [1320, 860], dist: 420, tilt: 45, yaw: -1, fov: 30 },
  { t: 124.2, region: WD, at: [1345, 800], dist: 480, tilt: 43, yaw: 0, fov: 30 },
  // H: Sherman's letter
  { t: D, region: WD, at: [1360, 790], dist: 480, tilt: 42, yaw: 2, fov: 30 },
];

const W1 = "#3C6E9E", R1 = "#9C3A35";
window.SEQ = {
  name: "S02", D, T, seed: 1862, date: "1863-03-01",
  regions: [WD, VB],
  regionOpts: { [WD]: { troopScale: 17 }, [VB]: { troopScale: 3.2 } },
  keys,
  clouds: {
    [WD]: { scatter: { seed: 5 }, keepClear: [[1260, 840, 160, 1, 0.9], [1200, 760, 120, 1, 0.9], [1383, 680, 60, 1, 0.6], [1380, 620, 70, 1, 0.6], [1280, 650, 60, 1, 0.6], [1230, 900, 70, 1, 0.6]] },
    [VB]: { shadows: true },
  },
  units, arrows, boats, fx,
  banners: [
    { general: "pemberton", region: VB, keys: [[0, 1384.4, 683.4]], t0: T.pem, t1: CUT2 + 0.2 },
    { general: "grant", region: WD, keys: [[0, 1262, 664], [T.march + 0.4, 1262, 664], ...kWB.filter((k) => k[0] > T.march + 2.6).map((k) => [k[0] + 0.3, k[1] + 8, k[2] - 6])], t0: T.grant + 0.05, t1: T.but + 0.2 },
  ],
  labels: [
    { text: "Mississippi River", at: [1238, 700], size: 20, t0: T.miss, t1: T.miss + 3.6, region: WD, river: true },
    { text: "Vicksburg", town: "Vicksburg", size: 24, t0: T.vb, t1: CUT1 + 0.2, region: WD },
    { text: "Vicksburg", town: "Vicksburg", size: 24, t0: T.vb2, t1: T.vb2 + 3.6, region: VB },
    { text: "Mississippi River", at: [1352, 702], size: 19, t0: T.river, t1: T.river + 3.6, region: VB, river: true },
    { text: "Yazoo River", at: [1352, 646], size: 18, t0: T.yazoo, t1: T.yazoo + 3.4, region: VB, river: true },
    { text: "Vicksburg", town: "Vicksburg", size: 22, t0: T.vb3, t1: T.vb3 + 3.6, region: WD },
    { text: "Chickasaw Bayou", at: [CHB[0] - 2, CHB[1] - 8], size: 18, t0: T.chickasaw, t1: T.chickasaw + 3.6, region: WD, river: true },
    { text: "Grant's Canal", at: [CANAL[0] - 4, CANAL[1] + 8], size: 17, t0: T.canals + 0.3, t1: T.canals + 3.8, region: WD },
    { text: "Yazoo River", at: [1436, 520], size: 18, t0: T.flooded, t1: T.flooded + 3.6, region: WD, river: true },
    { text: "Young's Point", town: "Young's Point", size: 18, t0: T.grant + 0.4, t1: T.grant + 3.8, region: WD },
    { text: "Vicksburg", town: "Vicksburg", size: 22, t0: T.vb4, t1: T.vb4 + 3.6, region: WD },
    { text: "Milliken's Bend", town: "Milliken's Bend", size: 18, t0: T.supply, t1: D + 1, region: WD },
  ],
  overlay: [
    // A
    ["plaque.date", T.winter + 0.1, { month: "Winter 1862-63", day: "", weekday: "", note: "the Mississippi" }],
    ["label", T.only + 0.2, T.only + 3.6, { name: "The last Confederate stretch", sub: "Vicksburg to Port Hudson", world: [1300, 900], side: "cs", marker: false }],
    ["label", T.port, T.port + 3.8, { name: "Port Hudson", sub: "Louisiana · further downriver", world: [BOTTOM[0], BOTTOM[1]], side: "cs", marker: false, offset: [24, -70] }],
    ["label", T.men - 0.2, T.west + 2.4, { name: "Men, cattle, supplies", sub: "from the West", world: [1110, 905], side: "cs", marker: false }],
    // B
    ["inset", T.vb2 + 0.4, T.round - 0.2, { img: "seq/inset_vicksburg.jpg", x: 1310, y: 150, w: 500, h: 323, caption: "Vicksburg from the river · Harper's Weekly 1861 · Library of Congress" }],
    ["label", T.hairpin, T.hairpin + 3.4, { name: "The hairpin bend", sub: "every boat slows to round it", world: [1372, 651], marker: false, offset: [-150, -90] }],
    ["label", T.batteries, T.batteries + 3.4, { name: "River batteries", sub: "along the bluffs for miles", world: [1392, 690], side: "cs", marker: false }],
    ["label", T.yazoo, T.yazoo + 3.2, { name: "The Yazoo swamps", sub: "to the north", world: [1368, 648], marker: false, offset: [28, -40] }],
    ["label", T.grandGulf, T.grandGulf + 2.8, { name: "Grand Gulf", sub: "more guns · downriver", world: [1369, 706], side: "cs", marker: false, offset: [28, -60] }],
    // C
    ["medallion", { kind: "card", general: "pemberton", sub: "a Pennsylvanian who chose the South", screen: [1765, 215], tIn: T.john, tOut: 46.6 }],
    ["legend", T.penn, 129.4, { entries: [{ name: "Union", color: W1 }, { name: "Confederates", sub: "Pemberton", color: R1 }] }],
    ["medallion", { kind: "card", general: "davis", role: "Confederate President", sub: "orders: hold Vicksburg", screen: [1765, 215], tIn: T.davis, tOut: 51.4 }],
    ["label", T.riverFront, CUT2 - 0.1, { name: "The river in front", world: [1377, 690], marker: false, offset: [-300, -20] }],
    ["label", T.swamps, CUT2 - 0.1, { name: "The swamps to the north", world: [1392, 648], marker: false }],
    // D
    ["plaque.note", T.other, "Vicksburg holds the river"],
    // E
    ["plaque.date", T.december + 0.05, { month: "December 1862", day: "29", weekday: "Monday", note: "Chickasaw Bayou" }],
    ["medallion", { kind: "card", general: "sherman", sub: "Grant's friend", screen: [1765, 215], tIn: T.friend, tOut: 74.2 }],
    ["ledger.show", 74.5, { title: "A winter of failures", sub: "December 1862 - March 1863" }],
    ["ledger.add", 74.8, { who: "Chickasaw Bayou", note: "Sherman thrown back", stamp: "FAILED", stampAt: 85.7 }],
    ["plaque.date", T.allWinter, { month: "Winter 1862-63", day: "", weekday: "", note: "canals and bayous" }],
    ["ledger.add", T.canals, { who: "Grant's Canal", note: "across De Soto Point", stamp: "FAILED", stampAt: 85.95 }],
    ["ledger.add", T.flooded, { who: "The Yazoo routes", note: "through the flooded forests", stamp: "FAILED", stampAt: 86.2 }],
    ["ledger.final", 86.5, { lines: ["Every attempt", "failed"], color: "#A8261B" }],
    ["ledger.hide", 89.6],
    // F
    ["label", T.newspapers, T.removal + 1.0, { name: "In the Northern papers", sub: "calls for his removal", world: [YP[0] - 40, YP[1] + 8], marker: false, stripes: [], offset: [-150, 40] }],
    ["medallion", { kind: "card", general: "grant", sub: "about to turn forty-one", screen: [1765, 215], tIn: T.ulysses, tOut: 97.4 }],
    ["plaque.date", T.spring, { month: "Spring 1863", day: "", weekday: "", note: "a new idea" }],
    ["label", T.riskiest - 0.3, T.riskiest + 2.4, { name: "The riskiest idea yet", sub: "some of his own generals", world: [1250, 740], side: "us", marker: false }],
    // G
    ["label", T.louisiana2, T.louisiana2 + 3.0, { name: "Through the Louisiana swamps", sub: "down the west bank", world: [1180, 760], side: "us", marker: false, offset: [-360, -20] }],
    ["label", T.below, T.below + 3.6, { name: "Far below the city", sub: "Hard Times, Louisiana", world: [HT[0] - 2, HT[1] + 2], side: "us", marker: false, offset: [-330, 10] }],
    ["label", T.run, T.run + 3.4, { name: "The navy runs the guns", sub: "at night", world: [1350, 760], side: "us", marker: false }],
    ["label", T.carry, T.carry + 3.2, { name: "Across the river", world: [GG[0] + 6, GG[1] + 8], side: "us", marker: false }],
    ["label", T.enemy, T.enemy + 3.0, { name: "On the enemy's side", world: [1300, 900], side: "cs", marker: false }],
    ["label", T.supply, D - 3.4, { name: "Every supply he had", sub: "behind the fortress", world: [MB[0], MB[1]], side: "us", marker: false, offset: [36, 18] }],
    // H
    ["medallion", { kind: "card", general: "sherman", sub: "go back north · try again by land", screen: [1765, 215], tIn: T.shermanH, tOut: T.but - 0.3 }],
    ["letter", T.but, D + 1, { header: "8 April 1863 · near Vicksburg", title: "Sherman to Grant's staff", sub: "Sherman's Memoirs", cps: 56, qSize: 30, height: 236,
      quote: "Whatever plan of action he may adopt will receive from me the same zealous co-operation and energetic support as though conceived by myself." }],
  ],
  // Vicksburg pulses red on the wide map on "fortress" (DOM disc pinned to the ground, a pure function of t, as in S07)
  build: async (ctx) => { WW = ctx.world; for (const c of customs) ctx.FX[c.region].custom(c.fn);
    const PN = document.getElementById("pins"), e = document.createElement("div");
    e.style.cssText = "position:absolute;left:0;top:0;border-radius:50%;opacity:0;pointer-events:none;background:radial-gradient(circle, rgba(200,40,28,0.75) 0%, rgba(200,40,28,0.45) 40%, rgba(196,44,32,0) 70%);box-shadow:0 0 0 2px rgba(170,30,22,0.55) inset";
    PN.insertBefore(e, PN.firstChild); ctx.pulse = e; },
  draw: (t, ctx) => { const e = ctx.pulse; if (!e) return; const cs = ctx.world.cameraAt(t), t0 = T.fortress;
    if (cs.region !== WD || t < t0 - 0.3 || t > T.but + 0.6) { e.style.opacity = "0"; return; }
    const ph = Math.max(0, Math.sin((t - t0) * 2 * Math.PI / 1.5)), k = sstep(t0 - 0.3, t0 + 0.5, t) * (1 - sstep(T.but, T.but + 0.6, t));
    const s = ctx.world.projectMap(VBG[0], VBG[1], 0), d = Math.max(30, 30 * s.ppu * (1 + 0.22 * ph));
    e.style.width = e.style.height = d.toFixed(1) + "px"; e.style.transform = `translate(${(s.x - d / 2).toFixed(1)}px,${(s.y - d / 2).toFixed(1)}px) scaleY(0.72)`;
    e.style.opacity = (k * (0.55 + 0.45 * ph)).toFixed(3); },
};
void lerp; void NC; void HB; void WH;
})();
