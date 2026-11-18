// S11 The assaults (18-22 May 1863). D = 87.34 s (tools/scene_times.py S11). Regions: wide (Walnut Hills, the twenty-day count) + siege.
// A  0-27.7   wide, north of the city: Sherman's three divisions come in on the Bridgeport road, Steele's swings onto the Walnut Hills (the bluffs
//             of December); a ghost arrow = the failed December attack at Chickasaw Bayou; Sherman card; his line WITHOUT quote marks as Grant
//             remembered it (letter card, marks: false: "I do not claim to quote Sherman's language; but the substance only", GM ch. XXXVI).
// B  24.8-46.6 cloud dive into the siege world (swap 28.6): the seven-mile Confederate line traced in red along the rifle pits, the forts named;
//             19 May (2 p.m.): Sherman's corps down the Graveyard Road at the Stockade Redan, thrown back.
// C  47.1-67.1 22 May (10 a.m., after a four-hour bombardment): all three corps at once; smoke along the whole front; flags on four parapets
//             (Stockade Redan, 3rd Louisiana Redan, 2nd Texas Lunette, Railroad Redoubt); none held; Grant's regret (quote card, GM Cold Harbor ch.).
// D  67.4-87.34 cut to the wide map: the route of the twenty days redrawn, five battle sites, timeline seals + ledger (5 battles, ~180 miles,
//             five days' rations: GM's count), the ring closes round the city ("starve the city out").
// Positions: data/geo.json units "siege" (34-40) + places; FACT_NOTES sections 10-11.
(() => {
const T = { D: 87.34, eighteenth: 0.83, sherman: 1.99, reached: 2.50, bluffs: 3.08, vicksburg: 3.92, same: 5.08, beaten: 6.78, december: 7.32,
  sherman2: 8.60, crest: 9.64, looked: 10.25, ground: 10.99, helpless: 12.40, as: 14.34, remembered: 14.92, minute: 17.76, success: 20.38,
  end: 23.56, history: 25.88, but: 27.20, standing: 28.82, land: 30.16, seven: 31.90, ridges: 33.37, town: 34.30, forts: 35.49, redans: 36.13,
  high: 37.04, joined: 37.82, trenches: 38.80, nineteenth: 41.03, attacked: 41.66, hoping: 43.10, shaken: 44.68, they: 45.76, not: 46.04,
  twentySecond: 47.93, again: 48.66, whole: 50.00, three: 51.14, once: 51.76, flags: 53.18, parapets: 54.87, none: 55.37, held: 56.14,
  grantWrote: 57.50, regretted: 59.12, cold: 60.99, same2: 63.34, vb22: 66.34, by: 67.72, nineteenth2: 68.41, days: 69.18, crossing: 70.00,
  count: 71.16, five: 73.18, battles: 73.62, eighty: 76.70, miles: 76.88, issued: 78.25, five2: 79.02, rations: 80.10, now: 81.18, oneWay: 82.32,
  starve: 84.14, out: 85.10 };
const W = "wide", S = "siege";
const DV = VX.diveTimes(28.6);    // push 24.8, deckIn 26.9, full 28.05, SW 28.6, emerge 29.45, land 31.95
const CUT = 67.4;                 // paragraph change (67.13 / 67.68): back to the wide map
const sstep = VX.sstep, lerp = VX.lerp, hsh = VX.hsh;
const P = (n) => VX.place(n), TW = (n) => VX.town(n, W);
const WALNUT = P("Walnut Hills"), CHICK = P("Chickasaw Bayou battlefield");
const PI = Math.PI, WEST = PI, SWF = 3 * PI / 4;

// ---------------- the works (siege world) ----------------
const WK = (i) => VX.work(S, i);
const LINE = [8, 9, 10, 11, 12].flatMap((i) => WK(i).map((p) => [p[0], p[1]]));   // the Confederate rifle-pit line, north -> south
const STOCKADE = [1406.6, 667.6], LA3 = [1409.2, 672.8], GREAT = [1407.0, 675.0], TEX2 = [1403.3, 680.4], RRR = [1400.5, 686.4];

// ---------------- units ----------------
const units = [
  // ======== A: wide (troopScale 6): Sherman's corps on the Bridgeport road; Steele onto the Walnut Hills; Pemberton's army back inside the lines
  { region: W, side: "u", type: "inf", n: 3, face: -2.4, keys: [[0, 1450, 646], [1.6, 1440, 648], [3.4, 1431, 630], [4.6, 1428.5, 621]] },   // Steele
  { region: W, side: "u", type: "inf", n: 3, face: "west", keys: [[0, 1466, 654], [4.8, 1438, 660, "lin"], [6.4, 1434, 661]] },              // Tuttle
  { region: W, side: "u", type: "inf", n: 3, face: "west", keys: [[0, 1482, 650], [6.0, 1450, 657, "lin"], [7.6, 1444, 659]] },              // Blair
  { region: W, side: "r", type: "inf", n: 3, face: "east", keys: [[0, 1436, 676], [4.2, 1408, 675]] },                                     // into the lines
  { region: W, side: "r", type: "inf", n: 3, face: -0.9, keys: [[0, 1401, 659]] },                                                         // the northern works
  // ======== D: wide (the twenty days): the garrison in its lines, the ring closes (starve the city out)
  { region: W, side: "r", type: "inf", n: 3, face: "east", t0: CUT, keys: [[0, 1401, 668]] },
  { region: W, side: "r", type: "inf", n: 3, face: "east", t0: CUT, keys: [[0, 1398, 688]] },
  ...[[1426, 648, -2.5], [1432, 672, PI], [1428, 696, 2.8], [1408, 714, 2.2]].map(([x, y, f], k) => ({ region: W, side: "u", type: "inf", n: 3, face: f, t0: T.now + 0.2 + k * 0.35,
    keys: [[0, x + 26, y + (k - 1.5) * 4], [T.now + 0.2 + k * 0.35, x + 26, y + (k - 1.5) * 4], [T.starve + 0.4 + k * 0.2, x, y]] })),
];
// ======== siege (troopScale 1.4). Confederates behind the works: M. L. Smith (N), Forney (centre), Stevenson (S)
[[1399.4, 663.9, -1.25], [1405.3, 667.5, -0.55], [1407.9, 672.9, 0.0], [1406.0, 675.3, 0.05], [1402.0, 680.5, 0.25], [1399.3, 686.4, 0.35], [1395.0, 690.9, 0.6], [1386.6, 697.4, 0.9], [1377.2, 705.0, 1.0]]
  .forEach(([x, y, f]) => units.push({ region: S, side: "r", type: "inf", n: 3, face: f, keys: [[0, x, y]] }));
[[1404.6, 669.3, -0.3], [1405.0, 676.6, 0.0], [1399.0, 684.6, 0.35]].forEach(([x, y, f]) => units.push({ region: S, side: "r", type: "art", n: 2, face: f, keys: [[0, x, y]] }));
// Union: Sherman (Graveyard Road, N), McPherson (Jackson road), McClernand (Baldwin's Ferry road + railroad, S). keys: arrive 28-34 (investment),
// 19 May: Sherman's two leading divisions down the road at the Stockade Redan and back; 22 May: everyone to the ditches and back.
const A19 = T.attacked + 0.1, R19 = T.they + 0.1;          // 19 May attack / fall back
const A22 = T.three + 0.1, R22 = T.none + 0.2;              // 22 May
const U = [
  // [start (siege line), 19 May objective or null, 22 May objective, face]
  [[1411.4, 665.4], [1407.5, 667.2], [1407.3, 667.3], 2.85],   // Blair (Sherman)
  [[1412.4, 663.0], [1408.2, 665.9], [1407.9, 665.9], 2.5],    // Tuttle (Sherman)
  [[1400.8, 660.6], null, [1400.4, 662.4], 1.75],               // Steele (Sherman, far right)
  [[1411.4, 672.7], null, [1409.9, 672.9], PI],                 // Logan (McPherson, Jackson road)
  [[1409.8, 676.4], null, [1407.8, 675.4], PI],                 // Quinby (McPherson)
  [[1406.0, 680.9], null, [1404.1, 680.5], PI],                 // A. J. Smith (McClernand, 2nd Texas Lunette)
  [[1403.0, 687.4], null, [1401.2, 686.6], 3.0],                // Carr (McClernand, Railroad Redoubt)
  [[1399.6, 692.4], null, [1398.0, 691.4], 2.6],                // Osterhaus (McClernand)
];
U.forEach(([s, a19, a22, f], k) => { const keys = [[0, s[0] + 7, s[1] + 0.6], [28.0 + k * 0.2, s[0] + 7, s[1] + 0.6], [33.5 + k * 0.4, s[0], s[1]]];
  if (a19) keys.push([A19 + k * 0.3, ...s], [44.6 + k * 0.3, ...a19], [R19 + 0.2, ...a19], [R19 + 2.0, s[0] + 0.3, s[1]]);
  keys.push([A22 + 0.1 * k, ...s], [A22 + 2.3 + 0.12 * k, ...a22], [R22 + 0.1 * k, ...a22], [R22 + 2.6 + 0.1 * k, ...s]);
  units.push({ region: S, side: "u", type: "inf", n: 3, face: f, keys }); });
[[1413.2, 668.4], [1414.2, 674.8], [1409.0, 683.6], [1406.4, 689.4]].forEach(([x, y], k) => units.push({ region: S, side: "u", type: "art", n: 2, face: PI, keys: [[0, x + 6, y], [29.0 + k * 0.3, x + 6, y], [34.5 + k * 0.4, x, y]] }));
const UGUN = [[1413.2, 668.4], [1414.2, 674.8], [1409.0, 683.6], [1406.4, 689.4]];

// ---------------- arrows ----------------
const ROUTE = [[1149, 1004], [1163, 1016], TW("Bruinsburg"), [1250, 1028], TW("Port Gibson"), TW("Willow Springs"), TW("Rocky Springs"), [1500, 897], TW("Utica"), [1650, 820],
  TW("Raymond"), [1800, 735], TW("Jackson"), TW("Clinton"), TW("Bolton"), [1630, 694], TW("Edwards"), [1540, 688], [1512.4, 683.6], [1470, 682], [1438, 680]];
const arrows = [
  // A: December's attack, a pale ghost that stops short of the bluffs
  { region: W, color: "#9aa9c6", pts: [[1393, 600], [1398, 612], [1402, 622]], t0: T.same + 0.1, dur: 1.4, t1: T.helpless + 1.2, width: 0.42 },
  // A: Steele's march onto the hills
  { region: W, side: "u", pts: [[1452, 647], [1440, 646], [1432, 632], [1429, 624]], t0: 0.25, dur: 3.0, t1: 9.4, width: 0.4 },
  // B: 19 May down the Graveyard Road
  { region: S, side: "u", pts: [[1412.2, 664.6], [1410.2, 665.9], [1408.0, 667.0]], t0: A19, dur: 2.4, t1: R19 + 0.6, width: 0.24 },
  // C: 22 May, one per corps
  { region: S, side: "u", pts: [[1412.4, 664.4], [1410.0, 666.0], [1407.9, 667.0]], t0: A22, dur: 2.0, t1: R22 + 0.5, width: 0.24 },
  { region: S, side: "u", pts: [[1412.6, 674.4], [1410.6, 673.6], [1408.6, 673.6]], t0: A22 + 0.25, dur: 2.0, t1: R22 + 0.5, width: 0.24 },
  { region: S, side: "u", pts: [[1406.8, 685.2], [1404.6, 684.6], [1402.2, 685.0]], t0: A22 + 0.5, dur: 2.0, t1: R22 + 0.5, width: 0.24 },
  // D: the route of the twenty days
  { region: W, side: "u", pts: ROUTE, t0: T.days, dur: 3.2, t1: T.D + 1, width: 0.5 },
];

// ---------------- fx (siege only) ----------------
const along = (pts, k) => VX.along(pts, k * VX.len(pts));
const RED_V = { dir: [1, 0], rate: 2.4, volley: 1.7, roll: 0.8, size: 1.1, height: 2.6, muzzle: 6, windK: 0.45 };
const BLUE_V = { dir: [-1, 0], size: 1.0, alpha: 0.2, life: 10, muzzle: 6, windK: 0.45, rate: 1.2 };
const redanPts = (i, n = 4) => { const w = WK(i); return Array.from({ length: n }, (_, j) => w[Math.round(j * (w.length - 1) / (n - 1))]).map((p) => [p[0] - 0.15, p[1]]); };
const fx = {
  volleys: [
    // 19 May: the Stockade Redan and the line beside it fire into the road
    { region: S, pts: redanPts(1), t0: 42.6, t1: 47.0, opts: { ...RED_V, dir: [0.8, -0.4] } },
    { region: S, pts: WK(8).filter((p, i) => i % 40 === 0 && p[0] > 1401 && p[0] < 1409.5).map((p) => [p[0], p[1] + 0.2]), t0: 43.2, t1: 46.6, opts: { ...RED_V, dir: [0.4, -1], rate: 1.6 } },
    // 22 May: the whole front
    { region: S, pts: redanPts(1), t0: 51.6, t1: 57.0, opts: { ...RED_V, dir: [0.8, -0.4] } },
    { region: S, pts: redanPts(2), t0: 51.9, t1: 57.2, opts: { ...RED_V } },
    { region: S, pts: redanPts(9, 3).concat(redanPts(10, 3)), t0: 52.1, t1: 57.0, opts: { ...RED_V } },
    { region: S, pts: redanPts(4), t0: 52.3, t1: 57.4, opts: { ...RED_V } },
    { region: S, pts: redanPts(11, 6), t0: 52.5, t1: 57.2, opts: { ...RED_V, dir: [0.9, 0.4] } },
  ],
  smokeLines: [
    { region: S, pts: [[1408.6, 666.3], [1408.0, 667.4]], t0: 43.6, t1: 45.8, opts: { ...BLUE_V, dir: [-1, 0.2] } },
    { region: S, pts: [[1408.4, 666.6], [1408.0, 667.6]], t0: 52.6, t1: 55.6, opts: { ...BLUE_V, dir: [-1, 0.2] } },
    { region: S, pts: [[1410.4, 672.4], [1410.4, 673.4], [1408.4, 675.0], [1408.4, 676.0]], t0: 52.8, t1: 55.8, opts: { ...BLUE_V } },
    { region: S, pts: [[1404.6, 680.0], [1404.6, 681.2], [1401.8, 686.0], [1401.6, 687.2]], t0: 53.0, t1: 56.0, opts: { ...BLUE_V } },
  ],
  guns: [
    // 19 May: Sherman's batteries on the redan
    { region: S, shots: [41.8, 42.5, 43.3, 44.1].map((t, i) => ({ t, at: UGUN[0], dir: [-1, -0.1], impact: [STOCKADE[0] - 0.5 - (i % 2) * 0.6, STOCKADE[1] + (i - 1.5) * 0.5], delay: 0.7 })) },
    // 22 May: the last of the four-hour bombardment along the whole front
    { region: S, shots: [47.6, 48.1, 48.7, 49.2, 49.8, 50.3, 50.9, 51.4].map((t, i) => { const g = UGUN[i % 4], tg = [STOCKADE, LA3, TEX2, RRR][i % 4];
      return { t, at: g, dir: [tg[0] - g[0], tg[1] - g[1]].map((v, _, a) => v / Math.hypot(a[0], a[1])), impact: [tg[0] - 0.6 - (i % 3) * 0.3, tg[1] + ((i * 37) % 5 - 2) * 0.35], delay: 0.75 }; }) },
  ],
};

// ---------------- custom: the seven-mile line traced in red, blue / white flags on the parapets ----------------
const LINE_L = VX.len(LINE);
let WWD = null;
// flags: DOM markers pinned to the ground (pole base), rise, and fall over when the attack fails
const FLAG_SVG = (kind) => kind === "us"
  ? '<svg viewBox="0 0 30 44"><rect x="1.2" y="0" width="2" height="44" fill="#3a2c1e"/><g transform="translate(3.2 1.5)"><rect width="25" height="16" fill="#f1ebdd"/>' +
    [0, 2, 4, 6].map((i) => `<rect y="${i * 16 / 7 * 1}" width="25" height="${16 / 7}" fill="#b22a2a" transform="translate(0 ${i * 16 / 7})"/>`).join("") +
    '<rect width="11" height="9.2" fill="#2a3f86"/><rect width="25" height="16" fill="none" stroke="#1b1610" stroke-width="0.8"/></g></svg>'
  : '<svg viewBox="0 0 30 44"><rect x="1.2" y="0" width="2" height="44" fill="#3a2c1e"/><path d="M3.2 1.5 L28 2.5 Q25 9 28 17 L3.2 17.5 Z" fill="#f4f1e8" stroke="#2a2418" stroke-width="0.8"/></svg>';
const mkFlags = (list) => { const F = { items: [] };
  F.build = () => { const PN = document.getElementById("pins"); for (const f of list) { const e = document.createElement("div");
    e.style.cssText = "position:absolute;left:0;top:0;opacity:0;pointer-events:none;transform-origin:7% 100%;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))";
    e.innerHTML = FLAG_SVG(f.kind); e.firstChild.style.cssText = "display:block;width:100%;height:100%"; PN.appendChild(e); F.items.push({ f, e }); } };
  F.draw = (t, ctx) => { const reg = ctx.world.cameraAt(t).region; for (const { f, e } of F.items) {
    if (f.region !== reg || t < f.t0 || t > (f.t1 ?? 1e9) + 0.6) { if (e.style.opacity !== "0") e.style.opacity = "0"; continue; }
    const q = ctx.world.projectMap(f.at[0], f.at[1], 0.02); if (!q.visible) { e.style.opacity = "0"; continue; }
    const rise = sstep(f.t0, f.t0 + 0.7, t), fall = f.fall != null ? sstep(f.fall, f.fall + 0.9, t) : 0;
    const hpx = VX.clamp((f.size || 1.3) * q.ppu, 28, 62), wpx = hpx * 30 / 44;
    const sw = 2.5 * Math.sin(t * 2.4 + f.at[0]);
    e.style.width = wpx.toFixed(1) + "px"; e.style.height = hpx.toFixed(1) + "px";
    e.style.transform = `translate(${(q.x - wpx * 0.07).toFixed(1)}px,${(q.y - hpx).toFixed(1)}px) scaleY(${Math.max(0.02, rise).toFixed(3)}) rotate(${(sw - fall * 84).toFixed(1)}deg)`;
    e.style.opacity = (Math.min(1, rise * 1.5) * (1 - sstep(f.fall != null ? f.fall + 0.5 : f.t1, f.fall != null ? f.fall + 1.1 : f.t1 + 0.6, t))).toFixed(3); } };
  return F; };
const FLAGS = mkFlags([
  // 19 May: the 13th US Infantry plants its colours on the redan's outer slope
  { region: S, kind: "us", at: [1407.0, 667.4], t0: 44.9, fall: R19 + 0.4 },
  // 22 May: a few flags reach the parapets; none hold
  { region: S, kind: "us", at: [STOCKADE[0] + 0.25, STOCKADE[1] - 0.15], t0: T.flags + 0.05, fall: T.none + 0.1 },
  { region: S, kind: "us", at: [LA3[0] + 0.15, LA3[1]], t0: T.flags + 0.35, fall: T.none + 0.35 },
  { region: S, kind: "us", at: [TEX2[0] + 0.15, TEX2[1]], t0: T.flags + 0.65, fall: T.none + 0.6 },
  { region: S, kind: "us", at: [RRR[0] + 0.1, RRR[1]], t0: T.flags + 0.95, fall: T.none + 0.85 },
]);
const PULSE = VX.pulses([TW("Port Gibson"), TW("Raymond"), TW("Jackson"), P("Champion Hill crest"), [1509.8, 683.5]].map((p, k) => ({ region: W, at: p, t0: T.five + 0.1 + k * 0.25, t1: T.now + 0.8, r: 38, color: [232, 188, 92], period: 1.8 })));   // round 2: bigger, brighter (critic: tiny pulses)

const build = async (ctx) => { WWD = ctx.world; const { THREE, world } = ctx, sc = world.regions[S].scene;
  // the seven-mile line traced in red: a glowing ribbon draped along the rifle pits, grown north -> south (draw range set before the render)
  const q = []; for (let s = 0; s <= LINE_L; s += 0.12) q.push(VX.along(LINE, s));
  const pos = [], W2 = 0.36; for (let i = 0; i < q.length - 1; i++) { const a = q[i], b = q[i + 1], ux = -a[3], uy = a[2], H = (x, y) => world.heightAt(x, y, S) + 0.12;
    const A1 = [a[0] - ux * W2 / 2, a[1] - uy * W2 / 2], A2 = [a[0] + ux * W2 / 2, a[1] + uy * W2 / 2], B1 = [b[0] - ux * W2 / 2, b[1] - uy * W2 / 2], B2 = [b[0] + ux * W2 / 2, b[1] + uy * W2 / 2];
    pos.push(A1[0], H(...A1), A1[1], B1[0], H(...B1), B1[1], A2[0], H(...A2), A2[1], A2[0], H(...A2), A2[1], B1[0], H(...B1), B1[1], B2[0], H(...B2), B2[1]); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  const mat = new THREE.MeshBasicMaterial({ color: 0xd8382a, side: THREE.DoubleSide, transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 });
  const m = new THREE.Mesh(g, mat); m.renderOrder = 4; sc.add(m); const NQ = q.length - 1;
  ctx.FX[S].custom((t) => { const k = sstep(T.land - 0.2, T.ridges + 0.6, t), out = 1 - sstep(39.4, 40.8, t); m.visible = t > T.land - 0.2 && t < 41;
    g.setDrawRange(0, Math.round(NQ * k) * 6); mat.opacity = 0.72 * out * (0.85 + 0.15 * Math.sin(t * 3)); });
  FLAGS.build(ctx); PULSE.build(ctx); };
const draw = (t, ctx) => { FLAGS.draw(t, ctx); PULSE.draw(t, ctx); };

const LEG = { entries: [{ name: "Union", sub: "Grant", color: "#3C6E9E" }, { name: "Confederates", sub: "Pemberton", color: "#9C3A35" }] };
window.SEQ = {
  name: "S11", D: T.D, T, seed: 1863, date: "1863-05-18",
  regions: [W, S],
  regionOpts: { [W]: { troopScale: 9 }, [S]: { troopScale: 1.4 } },
  grade: { wide: { toe: 30 } },   // round 2 (critic A: the twenty-days wide view too dark): lift the wide shadows
  keys: [
    // A: over the bluffs north of the city, the Chickasaw Bayou flats below to the north-west
    { t: 0.0, region: W, at: [1430, 646], dist: 250, tilt: 44, yaw: -14, fov: 30 },
    { t: 8.0, region: W, at: [1424, 634], dist: 226, tilt: 46, yaw: -20, fov: 30 },
    { t: 13.6, region: W, at: [1414, 628], dist: 205, tilt: 47, yaw: -26, fov: 30 },
    { t: 21.0, region: W, at: [1410, 640], dist: 215, tilt: 46, yaw: -16, fov: 30 },
    // B: the dive lands over the siege lines, looking west at the city; pan south along the line
    { t: 37.6, region: S, at: [1397.0, 683.6], dist: 52, tilt: 38, yaw: 92, fov: 30 },
    { t: 39.6, region: S, at: [1398.4, 681.4], dist: 50, tilt: 39, yaw: 92, fov: 30 },
    // 19 May at the Stockade Redan
    { t: 42.6, region: S, at: [1407.4, 667.6], dist: 25, tilt: 44, yaw: 82, fov: 30 },
    { t: 46.6, region: S, at: [1407.8, 668.0], dist: 23.5, tilt: 45, yaw: 78, fov: 30 },
    // C: 22 May, the three-mile front
    { t: 50.4, region: S, at: [1405.2, 677.2], dist: 41, tilt: 42, yaw: 92, fov: 30 },
    { t: 56.8, region: S, at: [1404.6, 678.0], dist: 39, tilt: 43, yaw: 94, fov: 30 },
    { t: CUT, region: S, at: [1403.8, 679.2], dist: 45, tilt: 42, yaw: 98, fov: 30, ease: "lin" },
    // D: the wide map, the whole campaign; then in on the city
    { t: CUT, region: W, at: [1525, 862], dist: 770, tilt: 35, yaw: 0, fov: 30, ease: "cut" },
    { t: 80.6, region: W, at: [1505, 850], dist: 790, tilt: 35, yaw: 1, fov: 30, ease: "lin" },
    { t: 85.4, region: W, at: [1410, 688], dist: 300, tilt: 46, yaw: -3, fov: 30 },
    { t: T.D, region: W, at: [1408, 686], dist: 288, tilt: 46, yaw: -4, fov: 30, ease: "lin" },
  ],
  dives: [{ t: DV.SW, over: [1402, 676],
    from: { region: W, at: [1408, 652], dist: 222, tilt: 46, yaw: -12 },
    to: { region: S, at: [1397.5, 682.0], dist: 60, tilt: 40, yaw: 88, fov: 30 },
    keys: { emerge: { yaw: 80 } } }],
  clouds: {
    [W]: { keepClear: [[1420, 630, 60, 1, 0.8], [1405, 670, 50, 1, 0.6], [1500, 860, 160, 0.8, 0.5], [1290, 880, 230, 0.9, 0.6], [1335, 765, 110, 1, 0.6], [1730, 760, 130, 1, 0.6]] },   // round 2: no big cloud over the twenty-days view / the final push
    [S]: { shadows: true },
  },
  units, arrows, fx, build, draw,
  labels: [
    { text: "Walnut Hills", at: [WALNUT[0] + 4, WALNUT[1] - 4], size: 19, t0: T.bluffs + 0.1, t1: T.bluffs + 3.6, region: W },
    { text: "Vicksburg", town: "Vicksburg", size: 22, t0: T.vicksburg, t1: T.vicksburg + 3.5, region: W },
    { text: "Chickasaw Bayou", at: [1397, 612], size: 17, river: true, t0: T.looked + 0.2, t1: T.looked + 3.8, region: W },
    { text: "Yazoo River", at: [1388, 592], size: 17, river: true, t0: T.looked + 0.6, t1: T.looked + 3.8, region: W },
    { text: "Vicksburg", town: "Vicksburg", size: 20, t0: 32.4, t1: 35.6, region: S },
    { text: "Stockade Redan", at: [1405.0, 666.2], size: 15, t0: T.forts, t1: 39.6, region: S },
    { text: "3rd Louisiana Redan", at: [1411.2, 671.6], size: 15, t0: T.forts + 0.3, t1: 39.6, region: S },
    { text: "Great Redoubt", at: [1404.2, 674.4], size: 15, t0: T.forts + 0.6, t1: 39.6, region: S },
    { text: "2nd Texas Lunette", at: [1404.8, 681.6], size: 15, t0: T.redans + 0.3, t1: 39.6, region: S },
    { text: "Railroad Redoubt", at: [1399.0, 688.2], size: 15, t0: T.redans + 0.6, t1: 39.6, region: S },
    { text: "Graveyard Road", at: [1410.6, 664.0], size: 14, river: true, t0: T.attacked + 0.2, t1: T.attacked + 3.6, region: S },
    { text: "Sherman", at: [1413.6, 662.4], size: 15, t0: T.three + 0.1, t1: T.three + 3.6, region: S },
    { text: "McPherson", at: [1413.4, 672.8], size: 15, t0: T.three + 0.35, t1: T.three + 3.6, region: S },
    { text: "McClernand", at: [1406.6, 686.2], size: 15, t0: T.three + 0.6, t1: T.three + 3.6, region: S },
  ],
  overlay: [
    ["plaque.date", T.eighteenth, { month: "May 1863", day: "18", weekday: "Day 19", note: "Monday · north of Vicksburg" }],
    ["legend", 1.2, T.as - 0.4, LEG],
    ["label", T.same + 0.2, T.sherman2 - 0.2, { name: "Chickasaw Bayou", sub: "December 1862 · Sherman beaten here", world: [CHICK[0] - 2, CHICK[1] - 6], side: "us", marker: false }],
    ["medallion", { kind: "card", general: "sherman", sub: "XV Corps · on the Walnut Hills", world: [WALNUT[0], WALNUT[1]], offset: [230, -110], tIn: T.sherman2, tOut: T.as - 0.4 }],
    ["letter", T.as + 0.7, T.history + 0.5, { header: "18 May 1863 · the Walnut Hills", title: "Sherman to Grant", sub: "not his words, the substance, as Grant remembered it", marks: false, cps: 14.5,
      qSize: 31, height: 262, top: 662,   // round 2 (critic A: body ~6 px at 720p): 31 px body on two lines
      quote: "Up to this minute he had felt no positive assurance of success.\nThis was the end of one of the greatest campaigns in history." }],
    ["legend", T.land + 1.8, T.grantWrote - 0.3, LEG],
    ["plaque.note", T.land + 0.4, "the Confederate land defences"],
    ["label", T.seven - 0.1, T.ridges + 2.0, { name: "About seven miles", sub: "forts on the ridges, joined by trenches", world: [1384.0, 699.0], side: "cs", marker: false }],
    ["plaque.date", T.nineteenth, { month: "May 1863", day: "19", weekday: "Day 20", note: "Tuesday · the first assault" }],
    ["plaque.clock", T.attacked + 0.4, { time: "14:00", note: "Graveyard Road", header: "19 May 1863 · Day 20" }],
    ["label", T.not + 0.05, T.twentySecond - 0.4, { name: "Thrown back", sub: "19 May · the Stockade Redan holds", world: [1405.6, 668.0], side: "cs", offset: [-330, -40] }],
    ["plaque.date", T.twentySecond, { month: "May 1863", day: "22", weekday: "Day 23", note: "Friday · the general assault" }],
    ["plaque.clock", T.again + 0.4, { time: "10:00", note: "after four hours of bombardment", header: "22 May 1863 · Day 23" }],
    ["plaque.run", T.three, T.held + 1.0, "10:45"],
    ["label", T.held + 0.1, T.grantWrote - 0.3, { name: "None held", sub: "three corps thrown back along three miles", world: [1406.4, 677.0], side: "cs", offset: [-380, 30] }],
    ["quote", T.grantWrote + 0.1, T.vb22 + 0.0, { en: "I have always regretted that the last assault at Cold Harbor was ever made. I might say the same thing of the assault of the 22d of May, 1863, at Vicksburg.", attr: "Ulysses S. Grant · Personal Memoirs", y: 400, dim: 0.4 }],   // round 2: out (fade 0.7) before the cut at 67.4; light dim
    ["plaque.date", T.nineteenth2, { month: "May 1863", day: "19", weekday: "Day 20", note: "twenty days after the crossing" }],
    ["ledger.show", T.nineteenth2 + 0.3, { title: "Twenty days", sub: "30 April - 19 May 1863 · Grant's count" }],
    ["timeline.show", T.days, { month: "Apr-May", year: "1863", cells: ["30 Apr", "1 May", "12 May", "14 May", "16 May", "17 May", "19 May"], at: 0.5 }],
    ["timeline.go", T.crossing, { at: 7, d: 3.0 }],
    ...[["Port Gibson", 1.8], ["Raymond", 2.8], ["Jackson", 3.8], ["Champion Hill", 4.8], ["Big Black", 5.8]].map(([name, at], k) => ["timeline.seal", T.five + 0.1 + k * 0.25, { at, name }]),
    ["ledger.add", T.battles, { who: "Five battles won", stamp: false }],
    ["ledger.add", T.miles + 0.1, { who: "About 180 miles", note: "marched, on average", stamp: false }],
    ["ledger.add", T.rations, { who: "Five days' rations", note: "issued in twenty days", stamp: false }],
    ["timeline.hide", T.now],
    ["ledger.final", T.starve + 0.1, { lines: ["Starve", "the city out"], color: "#2C4A8A" }],
  ],
};
})();
