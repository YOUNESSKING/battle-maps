// S07 Raymond (12 May 1863, DAY 13). Regions: wide -> (cloud dive) raymond -> (hard cut on the section change) wide.
// Wide: Raymond on the map, Gregg's brigade at the creek, McPherson's column coming up from the south-west -> dive ->
// Gregg's brigade along Fourteenmile Creek (Gregg card), one blue brigade on the road (what Gregg expected), then the dust of the whole
// corps (McPherson card) -> Gregg attacks across the creek, the fight sways in the creek woods (smoke + dust), the corps' weight tells ->
// Gregg falls back through Raymond toward Jackson -> wide: ledger 66 / 339 / 39, Jackson pulses red, "First Jackson" (blue arrow
// Raymond -> Jackson), "Then Vicksburg" (pull back, arrow Jackson -> Vicksburg along the railroad).
// Facts: research/FACT_NOTES.md section 6 (McPherson's XVII Corps, Logan leading, Crocker behind; Gregg thought he faced one brigade;
// 7th Texas + 3rd Tennessee struck Logan across the creek; heavy smoke and dust; Gregg retreated through Raymond).
(() => {
const T = { D: 52.42, twelfth: 0.93, raymond: 3.33, brigade: 4.49, creek: 7.07, gregg: 9.35, single: 11.67, fact: 14.25, mcp: 15.59, several: 17.43,
  attacked: 19.77, hours: 21.71, woods: 24.69, smoke: 26.67, dust: 27.65, weight: 32.81, told: 34.25, fell: 35.71, raymond2: 36.63, jacksonW: 37.81,
  small: 39.71, gathering: 44.47, jackson: 45.17, behind: 46.95, first: 48.35, then: 49.75, vicksburg: 49.89 };
const D = T.D, WD = "wide", RY = "raymond";
const DV = VX.diveTimes(8.0);                       // push 4.2 · full 7.45 · SW 8.0 · emerge 8.85 · land 11.35
const CUT = 39.0;                                     // hard cut back to the wide map on the section change (39.18)
const UT = VX.road(RY, "Port Gibson - Grindstone Ford - Willow Springs - Rocky Springs - Utica - Raymond");
const JR = VX.road(RY, "Raymond - Mississippi Springs - Jackson (Sherman, 14 May)");
const RAY = VX.town("Raymond", RY), BRG = VX.bridge(RY, 0);
const N = VX.FACE.north, S_ = VX.FACE.south;
const WR = VX.town("Raymond", WD), WJ = VX.town("Jackson", WD), WV = VX.town("Vicksburg", WD), WE = VX.town("Edwards", WD);

// ---------------- close: units ----------------
// round 2: the creek stays between the lines (owner rule: water only on bridges); "several times his strength" is shown: 19 blue boxes
// (Logan 3 x 3, Crocker 4 + 3, 2 guns) against Gregg's 5; the Union crosses only at the road bridge, after Gregg has gone.
const units = [];
// the road column (from the south-west edge up the Utica road) -> deploy south of the creek
const roadIn = UT.filter((p) => p[1] > 789.5);
const colKeys = (t0, deployT, at, speed = 3.0) => { const K = VX.march(roadIn, t0, speed); const e = K[K.length - 1]; return [...K, [Math.max(deployT, e[0] + 0.8), at[0], at[1]]]; };
const U = { side: "u", type: "inf", face: N, region: RY };
// over the road bridge (after Gregg has gone): from a south-bank slot onto the Utica road, across, up toward Raymond
const BRIDGE_PATH = (from) => [from, [1687.9, 787.6], [1688.6, 785.8], [1689.6, 784.6], [BRG.x, BRG.z], [1690.6, 783.3], [1691.6, 782.1], [1692.5, 780.9], [1693.4, 779.6], [1694.1, 778.2]];
const crossKeys = (from, t0, speed = 2.6) => VX.march(BRIDGE_PATH(from), t0, speed);
// U1: the leading brigade (what Gregg expected): already on the road below the creek on "a single brigade"
const U1a = [1681.8, 787.6], U1b = [1682.0, 786.7];
units.push({ ...U, n: 3, t0: T.single - 0.9, keys: [...colKeys(T.single - 4.6, 13.0, U1a), [T.attacked + 2.0, ...U1a], [24.4, U1a[0] - 0.2, 788.6], [27.6, U1a[0] - 0.2, 788.6], [29.0, ...U1a], [32.9, ...U1a], [34.6, ...U1b], [37.4, ...U1b], ...crossKeys(U1b, 37.6).slice(1)] });
// U2 + U3: the rest of Logan's division
const U2a = [1690.6, 790.6], U2b = [1690.8, 789.95];
units.push({ ...U, n: 3, t0: T.fact, keys: [...colKeys(T.fact - 1.6, 16.6, U2a), [T.attacked + 2.6, ...U2a], [25.0, U2a[0], 791.2], [28.0, U2a[0], 791.2], [29.6, ...U2a], [33.0, ...U2a], [34.8, ...U2b], [35.8, ...U2b], ...crossKeys(U2b, 36.0).slice(1)] });
units.push({ ...U, n: 3, t0: T.fact + 0.8, keys: [...colKeys(T.fact - 0.8, 18.0, [1698.8, 789.8]), [33.2, 1698.8, 789.8], [35.0, 1699.0, 788.7]] });
// Crocker's division behind (two bodies), arriving under the dust while McPherson's name is spoken
units.push({ ...U, n: 4, t0: T.mcp + 0.4, keys: [...colKeys(T.mcp - 0.6, 19.2, [1685.4, 791.0], 3.2), [32.8, 1685.4, 791.0], [36.0, 1685.8, 789.8]] });
units.push({ ...U, n: 3, t0: T.several - 0.3, keys: [...colKeys(T.several - 1.2, 20.4, [1694.4, 792.0], 3.4), [33.0, 1694.4, 792.0], [36.2, 1694.6, 791.2]] });
// guns
units.push({ ...U, type: "art", n: 2, t0: 16.8, keys: [...colKeys(16.2, 20.2, [1686.6, 789.6], 3.4)] });
// Gregg's brigade (red) on the high ground north of the creek; attacks down to the north bank, sways, then leaves by the road north
const R = { side: "r", type: "inf", face: S_, region: RY };
const escRoad = [...UT.filter((p) => p[1] < 780.6), ...JR.slice(1)];
const ESC = (t0, from = 0) => ({ road: escRoad, t0, v: 3.4, v2: 3.4, join: "north", fade: false, from });
units.push({ ...R, n: 2, t0: 4.6, keys: [[0, 1685.5, 778.0], [T.attacked + 0.1, 1685.5, 778.0], [21.8, 1685.0, 781.2], [26.6, 1685.0, 781.2], [28.4, 1685.2, 779.8], [29.6, 1685.2, 779.8], [30.8, 1685.0, 781.0], [33.2, 1685.0, 781.0], [34.8, 1686.6, 778.6]], escape: ESC(35.0) });   // 7th Texas
units.push({ ...R, n: 2, t0: 4.6, keys: [[0, 1697.0, 777.4], [T.attacked + 0.3, 1697.0, 777.4], [22.2, 1694.2, 784.4], [27.0, 1694.2, 784.4], [28.8, 1695.2, 782.0], [30.0, 1695.2, 782.0], [31.2, 1694.4, 784.0], [33.4, 1694.4, 784.0], [35.0, 1695.4, 779.4]], escape: ESC(35.5) });   // 3rd Tennessee
units.push({ ...R, type: "art", n: 1, t0: 4.6, keys: [[0, 1691.6, 776.0]], escape: ESC(34.6) });
// ---------------- wide: units (troopScale 10) ----------------
units.push({ side: "r", type: "inf", n: 1, region: WD, face: S_, t0: T.brigade, t1: DV.SW, keys: [[0, 1704, 772]] });                                   // Gregg at the creek
units.push({ side: "u", type: "inf", n: 1, region: WD, face: N, t0: 1.2, t1: DV.SW, keys: [[0, 1660, 812], [DV.SW, 1683, 790]] });                    // McPherson's column
units.push({ side: "u", type: "inf", n: 3, region: WD, face: VX.FACE.ne, t0: CUT, keys: [[CUT, WR[0] + 4, WR[1] + 4], [D, WR[0] + 8, WR[1] + 1]] });   // McPherson at Raymond
units.push({ side: "u", type: "inf", n: 3, region: WD, face: VX.FACE.ne, t0: CUT, keys: [[CUT, 1648, 790]] });                                      // the rest of Grant's army, south-west
units.push({ side: "u", type: "inf", n: 3, region: WD, face: VX.FACE.ne, t0: CUT, keys: [[CUT, 1616, 768]] });   // round 3: inside the left edge
units.push({ side: "r", type: "inf", n: 1, region: WD, face: Math.PI, t0: CUT, keys: [[CUT, 1748, 752], [46.0, 1846, 733]] });                      // Gregg falls back to Jackson
units.push({ side: "r", type: "inf", n: 3, region: WD, face: VX.FACE.sw, t0: T.gathering + 0.2, keys: [[0, WJ[0] + 4, WJ[1] + 2]] });                // the force at Jackson
units.push({ side: "r", type: "inf", n: 3, region: WD, face: VX.FACE.se, t0: CUT, keys: [[CUT, WE[0] - 6, WE[1] + 4]] });                           // Pemberton near Edwards

// ---------------- arrows ----------------
// a path shifted sideways by d units (left of the walking direction > 0), so an arrow runs beside a road column, not over it
const offsetPath = (P, d) => P.map((p, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [p[0] + dy / l * d, p[1] - dx / l * d]; });
const rail = VX.reverse(VX.region(WD).railroads[0].pts.map((p) => [p[0], p[1]])).filter((p) => p[0] < WJ[0] - 14 && p[0] > WV[0] + 12);
const arrows = [
  // Gregg attacks across the creek
  // (all arrows stop at the creek bank: no water without a bridge)
  { side: "r", region: RY, pts: [[1685.6, 776.6], [1685.4, 778.8], [1685.2, 780.8]], t0: T.attacked, dur: 1.4, t1: 24.4 },
  { side: "r", region: RY, pts: [[1697.4, 776.4], [1696.2, 779.4], [1694.8, 782.6]], t0: T.attacked + 0.3, dur: 1.4, t1: 24.4 },
  // the weight of the corps (round 3: short pushes from just in front of each line to the creek bank, thinner, gone before the boxes step up)
  { side: "u", region: RY, width: 0.2, pts: [[1681.8, 786.9], [1681.8, 786.0], [1681.9, 785.2]], t0: T.weight, dur: 1.0, t1: 34.5 },
  { side: "u", region: RY, width: 0.2, pts: [[1689.0, 789.5], [1689.3, 788.0], [1689.6, 786.4]], t0: T.weight + 0.3, dur: 1.0, t1: 34.6 },
  { side: "u", region: RY, width: 0.2, pts: [[1700.1, 787.2], [1700.3, 785.6], [1700.5, 784.0]], t0: T.weight + 0.6, dur: 1.0, t1: 34.8 },
  // Gregg falls back through Raymond, toward Jackson
  { side: "r", region: RY, pts: offsetPath(VX.sub(escRoad, 4, 26), 1.7), t0: T.fell, dur: 2.0, t1: 38.0 },   // round 3: fades before its tail leaves the frame
  { side: "r", region: RY, pts: offsetPath(VX.sub(JR, 2, 30), -1.7), t0: T.jacksonW - 0.1, dur: 1.4, t1: CUT + 1 },
  // wide: forces gathering at Jackson (by rail from the east, from the north)
  { side: "r", region: WD, pts: [[1928, 733.6], [1920, 731], [1911, 728]], t0: T.gathering, dur: 1.2, t1: 47.4 },   // round 3: inside the safe frame; fade before the pull-back
  { side: "r", region: WD, pts: [[1912, 672], [1905, 692], [1899, 708]], t0: T.gathering + 0.3, dur: 1.2, t1: 47.6 },
  // First Jackson. Then Vicksburg.
  { side: "u", region: WD, pts: [[WR[0] + 12, WR[1] - 4], [1764, 749], [1820, 740], [WJ[0] - 14, WJ[1] + 6]], t0: T.first, dur: 1.2, t1: D + 1, width: 0.42 },
  { side: "u", region: WD, pts: rail.filter((_, i, a) => i % 2 === 0 || i === a.length - 1), t0: T.then + 0.05, dur: 2.0, t1: D + 1, width: 0.42 },
];

// ---------------- fx ----------------
// round 3 (critic A): battalion CURTAINS (engine gmTall look, grey, thinning 6 s after the last volley), each seated just IN FRONT of its
// line on its own bank (never on the boxes, never over the creek)
const LEG = { entries: [{ name: "Union", color: "#3C6E9E" }, { name: "Confederates", sub: "Gregg", color: "#9C3A35" }] };
const SMK = { size: 0.55, alpha: 0.22, life: 12, muzzle: 1.2, windK: 0.45, rate: 22, cluster: [1.4, 0.35], tint: [0.25, 0.26, 0.275], fadeAfter: 6, fadeTo: 0.12 };
const vl = (pts, t0, t1, dir, every = 1.8, o = {}) => ({ region: RY, pts, t0, t1, cue: true, every, opts: { ...SMK, dir, volley: every, roll: 0.7, ...o } });
const DUST = { look: "gmOld", tint: [0.62, 0.55, 0.44], flash: false, size: 0.55, alpha: 0.13, life: 10, muzzle: 0.5, height: 0.3, windK: 0.8, rate: 7, cluster: [0.6, 0.2] };
const fx = {
  smokeLines: [
    // the dust of a whole corps on the road
    { region: RY, pts: roadIn.filter((_, i) => i % 6 === 0), t0: T.fact - 0.6, t1: 24.0, opts: { ...DUST, dir: [0.3, -1] } },
  ],
  volleys: [
    vl([[1683.6, 781.9], [1686.4, 781.9]], T.hours - 0.2, 26.4, [0, 1], 1.7),          // 7th Texas on the north bank
    vl([[1692.8, 785.3], [1695.6, 785.5]], T.hours + 0.4, 26.8, [0, 1], 1.9),          // 3rd Tennessee
    vl([[1680.0, 787.0], [1683.6, 787.0]], T.hours + 0.2, 28.4, [0, -1], 1.8),         // Logan's line on the south bank
    vl([[1689.0, 789.6], [1692.4, 789.6]], T.hours + 0.8, 29.0, [0, -1], 2.0),
    vl([[1683.8, 780.6], [1686.4, 780.6]], 28.6, 30.6, [0, 1], 1.0),                    // back and forth
    vl([[1680.2, 786.8], [1683.4, 786.8]], 29.0, 31.0, [0, -1], 1.0),
    vl([[1683.8, 781.8], [1686.2, 781.8]], 31.0, 33.4, [0, 1], 1.2),
    vl([[1680.0, 785.9], [1683.6, 785.9]], T.weight, 35.0, [0, -1], 1.4),                // the whole corps line fires
    vl([[1688.6, 788.95], [1692.2, 788.95]], T.weight + 0.3, 35.2, [0, -1], 1.5),
    vl([[1697.6, 787.7], [1700.4, 787.7]], T.weight + 0.6, 35.4, [0, -1], 1.6),
  ],
  guns: [
    { region: RY, size: 0.6, impactOpts: { size: 0.45 }, shots: [21.0, 23.2, 25.6, 28.0, 30.6, 33.4].map((t, i) => ({ t, at: [1686.6 + (i % 2 ? 0.5 : -0.5), 789.6], dir: [0.15, -1], impact: [1686.0 + (i % 3) * 4.2, 777.4 + (i % 2) * 1.2], delay: 0.85 })) },
    { region: RY, size: 0.6, impactOpts: { size: 0.45 }, shots: [20.4, 22.8, 25.0, 27.6, 31.0].map((t, i) => ({ t, at: [1691.6, 776.0], dir: [-0.1, 1], impact: [1682.0 + (i % 3) * 5.0, 789.6 + (i % 2) * 1.0], delay: 0.85 })) },
  ],
};

window.SEQ = {
  name: "S07", D, T, seed: 1507, date: "1863-05-12",
  regions: [WD, RY],
  regionOpts: { [RY]: { troopScale: 1.9 }, [WD]: { troopScale: 20 } },
  generals: { gregg: { img: "seq/gregg.png", side: "cs", name: "Gregg", full: "John Gregg", role: "Brigadier General" } },
  keys: [
    { t: 0, region: WD, at: [1700, 770], dist: 250, tilt: 46, yaw: -4, fov: 30 },
    // (the dive inserts push 4.2 -> land 11.35)
    // round 2: every key keeps the four frame corners inside the raymond box (south edge y 798): lower tilt, yaw -10..-16
    { t: 15.0, region: RY, at: [1689.6, 785.6], dist: 33, tilt: 38, yaw: -12, fov: 30 },
    { t: 21.0, region: RY, at: [1690.0, 786.0], dist: 32, tilt: 36, yaw: -10, fov: 30 },
    { t: 31.0, region: RY, at: [1690.6, 785.6], dist: 30, tilt: 37, yaw: -11, fov: 30 },
    { t: 35.6, region: RY, at: [1691.2, 784.4], dist: 31.5, tilt: 40, yaw: -12, fov: 30 },   // round 3: the south line stays in frame
    { t: CUT, region: RY, at: [1707.0, 765.0], dist: 36, tilt: 42, yaw: -12, fov: 30 },
    { t: CUT, region: WD, at: [1786, 738], dist: 318, tilt: 46, yaw: -4, fov: 30, ease: "cut" },
    { t: 46.4, region: WD, at: [1812, 733], dist: 318, tilt: 46, yaw: -3, fov: 30 },   // round 3: Jackson and its arrows well inside the frame
    { t: 50.6, region: WD, at: [1636, 714], dist: 600, tilt: 44, yaw: 0, fov: 30 },
    { t: D, region: WD, at: [1630, 713], dist: 615, tilt: 44, yaw: 0, fov: 30 },
  ],
  dives: [{ t: DV.SW, over: [1694, 782],
    from: { region: WD, at: [1700, 776], dist: 235, tilt: 45, yaw: -4 },
    to: { region: RY, at: [1689.0, 785.0], dist: 33, tilt: 40, yaw: -14, fov: 30 } }],
  clouds: {
    [WD]: { scatter: { box: [1560, 640, 400, 200], n: 6, med: 22 }, keepClear: [[1710, 770, 70, 0.8, 1], [1880, 726, 55, 0.8, 1], [1600, 705, 60, 0.8, 1], [1420, 690, 70, 0.8, 1]],
      bounds: [1300, 560, 2080, 900] },
    [RY]: { shadows: true },
  },
  units, arrows,
  labels: [
    { text: "Raymond", town: "Raymond", size: 24, t0: T.raymond, t1: DV.full - 0.3, region: WD },
    { text: "Fourteenmile Creek", at: [1677.4, 782.0], size: 18, t0: DV.SW + 1.0, t1: DV.SW + 4.6, region: RY, river: true },
    { text: "Raymond", at: [RAY[0], RAY[1] - 2.2], size: 22, t0: T.raymond2, t1: CUT + 0.5, region: RY },
    { text: "Raymond", town: "Raymond", size: 20, t0: CUT + 0.2, t1: 44.4, region: WD },
    { text: "Jackson", town: "Jackson", size: 26, t0: T.jackson, t1: D + 1, region: WD },
    { text: "Vicksburg", town: "Vicksburg", size: 26, t0: T.vicksburg, t1: D + 1, region: WD },
  ],
  fx,
  overlay: [
    ["plaque.date", T.twelfth, { month: "May 1863", day: "12", weekday: "Tuesday", note: "DAY 13 · dusty" }],
    ["medallion", { kind: "card", general: "gregg", sub: "one brigade, from Port Hudson", screen: [1660, 300], tIn: T.gregg, tOut: 13.7 }],
    ["label", T.single, T.single + 2.4, { name: "A single brigade?", sub: "what Gregg had been told", world: [1683.0, 789.6], side: "us", marker: false }],
    ["medallion", { kind: "card", general: "mcpherson", sub: "XVII Corps", screen: [1660, 300], tIn: T.mcp, tOut: 19.4 }],
    ["label", T.several, T.several + 2.6, { name: "Several times his strength", sub: "most of a Union corps", world: [1699.6, 793.0], side: "us", marker: false }],
    ["legend", DV.emerge + 0.6, 34.9, LEG],   // round 3: steps out while the Union boxes cross under its corner
    ["legend", 44.6, D - 1, LEG],   // after the ledger (one big card at a time)
    ["label", T.attacked + 0.1, T.attacked + 2.8, { name: "Gregg attacks", sub: "across the creek", world: [1691.0, 773.6], side: "cs", marker: false }],
    ["plaque.date", T.hours, { month: "May 1863", day: "12", weekday: "Tuesday", note: "DAY 13 · smoke and dust" }],
    ["ledger.show", T.small, { title: "Raymond", sub: "12 May 1863 · Union loss" }],
    ["ledger.add", T.small + 0.4, { who: "66 killed", stamp: false }],
    ["ledger.add", T.small + 0.8, { who: "339 wounded", stamp: false }],
    ["ledger.add", T.small + 1.2, { who: "39 missing", note: "Grant's Memoirs", stamp: false }],
    ["ledger.hide", 44.2],
  ],
  // Jackson pulses red on the wide map: a soft red disc + ring pinned to the ground under the name (DOM layer, a pure function of t)
  build: async (ctx) => { const PN = document.getElementById("pins"), e = document.createElement("div");
    e.style.cssText = "position:absolute;left:0;top:0;border-radius:50%;opacity:0;pointer-events:none;background:radial-gradient(circle, rgba(200,40,28,0.75) 0%, rgba(200,40,28,0.45) 40%, rgba(196,44,32,0) 70%);box-shadow:0 0 0 2px rgba(170,30,22,0.55) inset";
    PN.insertBefore(e, PN.firstChild); ctx.pulse = e; },
  draw: (t, ctx) => { const e = ctx.pulse; if (!e) return; const cs = ctx.world.cameraAt(t);
    if (cs.region !== WD || t < T.jackson - 0.3) { e.style.opacity = "0"; return; }
    const ph = Math.max(0, Math.sin((t - T.jackson) * 2 * Math.PI / 1.5)), k = VX.sstep(T.jackson - 0.3, T.jackson + 0.5, t);
    const s = ctx.world.projectMap(WJ[0], WJ[1], 0), d = Math.max(30, 26 * s.ppu * (1 + 0.22 * ph));
    e.style.width = e.style.height = d.toFixed(1) + "px"; e.style.transform = `translate(${(s.x - d / 2).toFixed(1)}px,${(s.y - d / 2).toFixed(1)}px) scaleY(0.72)`;
    e.style.opacity = (k * (0.55 + 0.45 * ph)).toFixed(3); },
};
})();

// owner 2026-11-18 ("don't overdo the dive, maybe 2-3"): no cloud dive here; the wide shot dissolves into the close map at the old swap time
(() => { const S = window.SEQ, d = (S.dives || []).splice(0)[0]; if (!d) return; const f = d.from, o = d.to;
  S.keys.push({ t: d.t, region: f.region, at: f.at, dist: f.dist * 0.8, tilt: f.tilt, yaw: f.yaw ?? 0, fov: f.fov ?? 30 },
    { t: d.t, region: o.region, at: o.at, dist: o.dist * 0.92, tilt: o.tilt, yaw: o.yaw ?? 0, fov: o.fov ?? 30, ease: "cut", dissolve: 0.9 });
  S.keys.sort((a, b) => a.t - b.t); })();
