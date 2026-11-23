// S07 MOVE 3: 8 JANUARY 1815 (D 152.86 s, ajackson/tools/scene_times.py S07). One region: chalmette (z10 close).
// Opening state = S06's end (same line, eight batteries, defenders, positions copied from S06's helpers), the next morning before dawn.
// Shots: pre-dawn fog; the boats stuck in the collapsed canal at Villeré's, the west-bank force late -> eye level along the silent wall ->
// the rocket, the British lines advancing in the fog, the fog lifts at ~500 yards -> the batteries, then rank fire along the parapet ->
// the main column at the ditch with no ladders (NO LADDERS) -> Pakenham's banner rides forward and falls -> the 93rd crosses the field
// obliquely and stands under grape -> the river column storms the advanced redoubt, is driven out -> HALF AN HOUR, the lines stream back
// -> the west bank: Thornton's small force breaks Morgan's line, halts, is ordered back -> centred result card 2,037 / 71 (both banks) / 6 killed
// behind the wall -> method card line 3. Facts: ajackson/research/FACT_NOTES_neworleans.md 37-54 (Latour, Butler's return, WP-BNO).
(() => {
const T = { D: 152.86, dawn: 0.57, eighth: 1.53, january: 1.77, wrong: 3.97, canal: 5.13, boats: 6.51, river: 7.11, collapsed: 8.05,
  west: 9.35, force: 9.93, late: 10.99, across: 12.15, fraction: 13.37, jackson: 15.55, simple: 16.95, notattack: 18.37, instead: 19.47,
  come: 20.79, open: 23.53, guns: 24.91, first: 26.35, light: 26.61, rocket: 27.15, british: 28.47, advanced: 28.71, fog: 29.95,
  crossed: 32.01, fogLift: 33.17, lifted: 33.47, view: 36.17, five: 37.40, yards: 37.89, batteries: 40.53, opened: 41.07,
  killing: 45.45, closer: 47.87, men: 48.93, wall: 49.73, fire2: 50.53, rank: 51.45, sheet: 53.21, parapet: 54.99,
  ladders: 56.49, behind: 60.29, main: 61.65, ditch: 63.11, cross: 64.63, stood: 65.91, canal2: 66.55, hands: 68.89,
  pakenham: 70.31, rode: 70.65, hit: 72.95, again: 73.95, killed: 74.71, general: 75.99, mortally: 77.95, third: 79.71, badly: 80.75, wounded: 81.23,
  ninety3: 84.01, highlanders: 84.43, marched: 84.83, halted: 87.23, guns3: 88.35, grapeshot: 90.41, orders: 92.07, colonel: 94.25, killed3: 94.91,
  river4: 97.19, storm: 99.27, battery: 100.39, officers: 102.69, shot: 103.59, driven: 106.43,
  broken: 108.79, half: 109.89, hour: 110.39, last: 111.47, called: 113.31,
  across5: 114.85, landed: 117.85, broke: 118.41, weak: 119.25, wbank: 120.93, late5: 122.41, generals: 123.67, ordered: 125.85, back: 126.39,
  lost: 128.01, two: 129.03, thousand: 129.28, captured: 131.39, three: 132.27, generals2: 132.49, army: 134.81, seventy: 135.80,
  missing: 137.67, both: 138.35, banks: 138.57, behindwall: 140.23, six: 141.97, killed6: 142.57,
  third2: 144.31, method: 145.15, never: 146.13, strongest: 147.75, choose: 149.03, ground: 149.43, make: 150.03, you: 150.81 };
const CH = "chalmette", P = (n) => VX.place(n, CH);
// ---- the line (S06's helpers, unchanged) ----
const RE = P("Jackson's line, river end"), EL = P("Jackson's line, elbow"), SE = P("Jackson's line, swamp end");
const MAC = P("Macarty house"), VIL = P("Villere plantation house");
const L1 = Math.hypot(EL[0] - RE[0], EL[1] - RE[1]), uS = [(EL[0] - RE[0]) / L1, (EL[1] - RE[1]) / L1], nS = [-uS[1], uS[0]];
const L2 = Math.hypot(SE[0] - EL[0], SE[1] - EL[1]), uL = [(SE[0] - EL[0]) / L2, (SE[1] - EL[1]) / L2], nL = [uL[1], -uL[0]];
const FS = Math.atan2(nS[1], nS[0]), FL = Math.atan2(nL[1], nL[0]), FB = FS + Math.PI;   // Americans face ESE; the British face WNW
const onS = (s, d = 0) => [RE[0] + uS[0] * s + nS[0] * d, RE[1] + uS[1] * s + nS[1] * d];
const onL = (s, d = 0) => [EL[0] + uL[0] * s + nL[0] * d, EL[1] + uL[1] * s + nL[1] * d];
const BAT = [0.18, 0.74, 1.12, 1.52, 2.42, 2.86, 3.98, 4.42];
const GUN = (i) => onS(BAT[i], -0.42);
const POS = { reg1: onS(0.46, -0.95), reg2: onS(1.97, -0.75), lam: onS(3.42, -0.75), fmc1: onS(4.2, -1.25), fmc2: onS(2.7, -1.25),   // round 1: = S06, right behind the wall
  tn1: onL(0.9, -0.5), tn2: onL(1.95, -0.5), ky1: onL(3.0, -0.5), ky2: onL(4.05, -0.5), cho: onL(5.6, -0.3) };
const REDOUBT = (() => { const w = VX.work(CH, 1); const m = w[Math.floor(w.length / 2)]; return [m[0], m[1]]; })();

// ---------------- units ----------------
const units = [];
const add = (o) => { units.push({ type: "inf", n: 1, region: CH, arrive: false, ...o }); return units.length - 1; };
BAT.forEach((s, i) => add({ side: "u", type: "art", bw: 0.24, bd: 0.2, face: FS, keys: [[0, ...GUN(i)]] }));   // round 1: guns at ~half size
for (const k of ["reg1", "reg2", "lam", "fmc1", "fmc2"]) add({ side: "u", face: FS, keys: [[0, ...POS[k]]] });
for (const k of ["tn1", "tn2", "ky1", "ky2", "cho"]) add({ side: "u", face: FL, keys: [[0, ...POS[k]]] });
// the company of the 7th in the advanced redoubt: taken for a moment (grey), retaken
add({ side: "u", face: FS, keys: [[0, REDOUBT[0] - nS[0] * 0.25, REDOUBT[1] - nS[1] * 0.25]], caps: [[T.storm + 0.3, T.driven + 0.2]] });
// British lines form in the dark (fade in), advance on the rocket; the main column (Gibbs: 4th, 21st, 44th) by the swamp end of the
// straight stretch, three lines in depth; the 44th (the ladders) late behind them
const MS = 3.9, FOR = 0.6;
const MAIN = [0, 1, 2].map((i) => add({ side: "r", n: 2, face: FB, t0: FOR + i * 0.4,
  keys: [[0, ...onS(MS, 10.2 + i * 1.3)], [T.british, ...onS(MS, 10.2 + i * 1.3)], [T.five, ...onS(MS, 4.3 + i * 1.3)], [T.ditch, ...onS(MS, 1.05 + i * 1.25)],
         [T.broken, ...onS(MS, 1.05 + i * 1.25)], [119.0, ...onS(MS, 10.6 + i * 1.3)]] }));   // round 2: they stay at the ditch through the Pakenham shot, turn about off screen, walk back in the wide shot
add({ side: "r", n: 2, face: FB, t0: FOR + 1.2, keys: [[0, ...onS(2.0, 14.0)], [T.D, ...onS(2.0, 14.0)]] });   // round 2: the 44th waits far back with the ladders left behind (no drift at 52-62, no backing)
// the river column: Rennie's light companies by the road (they storm the redoubt), the 93rd (cross obliquely to Gibbs' right, then stand)
const RS = 0.32, RD0 = 10.6, RD1 = 4.6, RIN = 1.45;
add({ side: "r", n: 2, face: FB, t0: FOR + 0.6,
  keys: [[0, ...onS(RS, RD0)], [T.british, ...onS(RS, RD0)], [T.five, ...onS(RS, RD1)], [97.2, ...onS(RS, RD1)], [T.storm + 0.2, ...onS(RS, RIN)], [110.6, ...onS(RS, RIN)], [116.0, ...onS(RS, 4.6)]] });   // round 1: turns about, then walks back
const H93a = onS(1.5, 11.0), H93b = onS(1.5, 5.6), H93c = onS(2.7, 2.7);
add({ side: "r", n: 2, face: FB, t0: FOR + 0.8,
  keys: [[0, ...H93a], [T.british, ...H93a], [T.five, ...H93b], [T.marched - 0.4, ...H93b], [T.halted, ...H93c], [T.broken - 0.4, ...H93c], [114.0, ...onS(2.7, 5.8)]] });
// Lambert's reserve, ~650 yards back
add({ side: "r", n: 2, face: FB, t0: FOR + 1.6, keys: [[0, ...onS(2.2, 14.6)]] });
// the west bank: Morgan's two small lines behind his breastwork; Thornton's few hundred break through, halt, are ordered back
const MW = VX.work(CH, 4), mw = (k) => { const p = VX.along(MW, VX.len(MW) * k); return [p[0], p[1]]; };
const mwD = (() => { const a = MW[0], b = MW[MW.length - 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; })();
const mwN = [-mwD[1], mwD[0]];   // the breastwork's front (downstream / east)
const FM = Math.atan2(mwN[1], mwN[0]);
const wbo = (k, d) => { const p = mw(k); return [p[0] + mwN[0] * d, p[1] + mwN[1] * d]; };
[0.32, 0.72].forEach((k, i) => add({ side: "u", face: FM, t1: 125.0, keys: [[0, ...wbo(k, -0.5)], [126.0 + i * 0.3, ...wbo(k, -0.5)], [131.0, ...wbo(k, -3.6)]] }));   // round 1: they turn about as the line breaks (the shot ends at 127)
add({ side: "r", n: 2, face: FM + Math.PI, t0: 113.0,
  keys: [[113.0, ...wbo(0.5, 4.0)], [114.4, ...wbo(0.5, 4.0)], [T.broke - 0.2, ...wbo(0.5, 1.0)], [T.late5 - 0.3, ...wbo(0.5, -1.6)], [T.D, ...wbo(0.5, -1.6)]] });   // round 1: halts (no backward walk inside the shot)

// ---------------- boats: stuck in the collapsed canal at Villeré's; the few that crossed ----------------
const CUT = [[VIL[0] - 0.5, 3232.6], [VIL[0] - 0.1, 3239.6]];   // the new cut from the Villeré canal to the river
const XR = [[VIL[0] - 1.0, 3240.8], [VIL[0] - 2.4, 3243.4], [VIL[0] - 3.8, 3246.4]];
const boats = [
  ...[0.12, 0.32, 0.5, 0.7].map((k) => ({ region: CH, kind: "barge", n: 1, path: CUT, sAt: () => VX.len(CUT) * k, t0: -1, t1: 26.0, size: 0.16, lamp: false, wake: false, h: 0.05 })),
  { region: CH, kind: "barge", n: 2, path: XR, s0: 0.4, speed: 0.55, spacing: 0.9, t0: T.across - 0.6, t1: 26.0, size: 0.26, lamp: false, wake: true },
];

// ---------------- fx ----------------
const imp = (i, d) => onS(MS + ((i * 37) % 7 - 3) * 0.18, d);
const gShots = [];
// the batteries open as the fog lifts: Nos. 6, 7, 8 rake the main column, 1-4 the river side; impacts where the lines are
[[41.1, 6, 4.2], [41.7, 7, 4.4], [42.4, 5, 4.6], [43.1, 6, 4.0], [43.8, 4, 4.8], [44.5, 7, 3.9], [45.3, 6, 3.6], [46.2, 3, 4.6], [47.0, 7, 3.2],
 [47.8, 5, 3.0], [48.7, 6, 2.8], [55.8, 7, 1.8], [59.9, 7, 1.5], [65.55, 7, 2.4], [72.25, 6, 4.4], [72.9, 7, 4.2], [73.9, 5, 4.5]].forEach(([t, g, d], i) => gShots.push({ t, at: GUN(g), dir: nS, impact: imp(i, d), delay: 0.55 }));
// grape on the 93rd
[89.5, 90.4, 91.5, 93.1, 94.9].forEach((t, i) => gShots.push({ t, at: GUN([4, 5, 3, 4, 3][i]), dir: nS, impact: [H93c[0] + ((i % 3) - 1) * 0.35, H93c[1] + 0.3], delay: i === 3 ? 0.25 : 0.45 }));   // round 2: none on "Their" (93.5)
// Nos. 1 and 2 on the redoubt's attackers
[101.0, 102.4, 104.95].forEach((t, i) => gShots.push({ t, at: GUN(i % 2 ? 1 : 2), dir: nS, impact: onS(RS + 0.6, RIN + 1.4 + i * 0.3), delay: i === 2 ? 0.3 : 0.4 }));   // round 2: the last one after "it,"
const VO = { dir: nS, size: 0.75, alpha: 0.085, life: 9, muzzle: 5, rate: 3.0, roll: 0.8, height: 2.0, cluster: [3.0, 1.5] };
const fx = {
  fires: [],
  volleys: [
    // rank after rank: the riflemen along the parapet (straight stretch + the receding leg), each volley a ripple of visible flashes
    { region: CH, pts: [onS(2.3, -0.45), onS(3.3, -0.45), onS(4.4, -0.45), onS(4.8, -0.45)], t0: 52.45, t1: 56.0, every: 1.5,   /* round 2: after "rank." */ opts: { ...VO, volley: 1.5 } },   // round 1: stops before the ladders payoff (56.2-68.9)
    { region: CH, pts: [onL(0.2, -0.45), onL(1.2, -0.45), onL(2.2, -0.45)], t0: 52.95, t1: 56.2, every: 1.7, opts: { ...VO, dir: nL, volley: 1.7 } },
    { region: CH, pts: [onS(3.3, -0.45), onS(4.4, -0.45)], t0: 63.4, t1: 66.6, every: 3.0, opts: { ...VO, volley: 3.0 } },   // one sparse volley on the column at the ditch
    // on the 93rd and on the redoubt's attackers
    { region: CH, pts: [onS(2.0, -0.45), onS(3.0, -0.45), onS(3.6, -0.45)], t0: 89.8, t1: 95.4, every: 1.8, opts: { ...VO, volley: 1.8 } },
    { region: CH, pts: [onS(0.3, -0.5), onS(1.0, -0.5), onS(1.8, -0.5)], t0: 102.0, t1: T.driven + 0.4, every: 1.6, opts: { ...VO, volley: 1.6 } },
    // the west bank: Morgan's men fire once, then break
    { region: CH, pts: [wbo(0.2, -0.2), wbo(0.5, -0.2), wbo(0.85, -0.2)], t0: 116.8, t1: T.broke + 0.2, every: 1.6, opts: { ...VO, dir: mwN, volley: 1.6 } },
  ],
  guns: [{ region: CH, opts: { plume: 0.45, puffs: 7, alpha: 0.2, jet: 1.6 }, shots: gShots, impactOpts: { size: 0.7 } }],
};

// ---------------- arrows ----------------
const arrows = [
  { side: "r", pts: [[VIL[0] - 0.9, 3240.9], [VIL[0] - 2.3, 3243.3], [VIL[0] - 3.5, 3245.9]], t0: T.west - 0.2, dur: 2.2, t1: 15.0, width: 0.24 },   // the boats' route over the river
  { side: "r", pts: [onS(MS, 9.6), onS(MS, 6.8), onS(MS, 4.4)], t0: T.advanced, dur: 2.4, t1: 37.0, width: 0.24 },
  { side: "r", pts: [onS(RS, 10.0), onS(RS, 7.4), onS(RS, 5.0)], t0: T.advanced + 0.3, dur: 2.4, t1: 37.0, width: 0.2 },
  { side: "r", pts: [H93b, [(H93b[0] + H93c[0]) / 2 + 0.3, (H93b[1] + H93c[1]) / 2 - 0.1], H93c], t0: T.marched, dur: 2.0, t1: T.guns3 + 1.0, width: 0.2 },
  { side: "r", pts: [onS(RS, 4.4), onS(RS, 2.6), onS(RS, 1.2)], t0: T.storm - 0.3, dur: 1.2, t1: T.officers, width: 0.2 },
  { side: "r", pts: [wbo(0.5, 4.6), wbo(0.5, 1.6), wbo(0.5, -2.2)], t0: T.broke - 0.2, dur: 1.4, t1: T.late5 + 0.6, width: 0.22 },
];

// ---------------- banners ----------------
const generals = {
  jackson: { img: "seq/jackson.png", flag: "seq/us15_flag.png", side: "us", name: "Jackson", full: "Andrew Jackson", role: "Major General" },
  pakenham: { img: "seq/pakenham.png", flag: "seq/gb1801_union_flag.png", side: "cs", name: "Pakenham", full: "Sir Edward Pakenham", role: "Major General" },
};
const banners = [
  { general: "jackson", keys: [[0, MAC[0] - 0.6, MAC[1] - 1.4]], t0: T.jackson - 0.05, t1: 26.0 },
  { general: "pakenham", keys: [[0, ...onS(3.6, 8.6)], [T.rode + 0.1, ...onS(3.6, 8.6)], [T.hit, ...onS(3.8, 5.6)]], t0: T.pakenham - 0.05, t1: T.killed + 0.45 },
];

// ---------------- labels (small, on their words) ----------------
const lab = (text, at, t0, d = 3.5, o = {}) => ({ text, at, t0, t1: t0 + d, region: CH, size: 15, ...o });
const labels = [
  lab("collapsed canal", [VIL[0] + 1.4, 3236.0], T.collapsed - 0.05, 3.4),
  lab("west bank", [VIL[0] - 4.6, 3247.4], T.west - 0.05, 3.6, { river: true }),
  lab("hours late", [VIL[0] - 2.2, 3244.4], T.late - 0.05, 3.6, { size: 24 }),   // round 1 (critic B): the late boats
  lab("the ditch", onS(3.4, 0.5), T.ditch - 0.05, 3.0, { river: true, size: 14 }),
  lab("93rd Highlanders", [H93c[0] + 0.8, H93c[1] + 0.9], T.ninety3 - 0.05, 4.2, { size: 16 }),
  lab("advanced redoubt", onS(RS - 0.2, 2.2), 100.0, 3.4),   // on "advanced battery" (99.95)
  lab("Morgan's line", wbo(0.9, -1.4), T.weak - 0.05, 3.2),
];

// ---------------- the morning: fog + the rocket ----------------
// 8 Jan fog (owner fix): an even low veil + long horizontal bands lying along the river (world-anchored, blurred), densest by the river
// (NPS: the fog lasted longer near the river), lifting smoothly as the British close (crossed -> lifted + 1.2)
const RIVP = (() => { const R = VX.river(CH, "Mississippi River").pts.map((p) => [p[0], p[1]]); const out = [];
  for (let i = 0; i < R.length; i += 3) { const a = R[Math.max(0, i - 1)], b = R[Math.min(R.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; let n = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
    if (n[0] * (RE[0] - R[i][0]) + n[1] * (RE[1] - R[i][1]) < 0) n = [-n[0], -n[1]]; out.push({ p: R[i], n }); } return out; })();
const fogK = (t) => (1 - VX.sstep(T.crossed, T.lifted + 1.2, t)) * (1 - 0.45 * VX.sstep(8.0, 9.3, t) * (1 - VX.sstep(14.4, 15.0, t)));   // round 2: thinner over the late boats (9.3-15)
const fog = { build() { const c = document.createElement("canvas"); c.width = 1280; c.height = 720; c.style.cssText = "position:absolute;inset:0;pointer-events:none";
    const tr = document.getElementById("troops"); tr.parentNode.insertBefore(c, tr); this.g = c.getContext("2d"); },
  draw(t, ctx) { const g = this.g; if (!g) return; g.clearRect(0, 0, 1280, 720); const k = fogK(t); if (k <= 0.003) return; const W = ctx.world;
    g.fillStyle = `rgba(214,218,216,${(0.16 * k).toFixed(3)})`;   // round 1: -25 % g.fillRect(0, 0, 1280, 720);
    g.save(); g.filter = "blur(22px)"; g.lineCap = "round"; g.lineJoin = "round";
    for (let b = 0; b < 12; b++) { const d = -3 + b * 2.2 + Math.sin(t * 0.05 + b) * 0.5, a = (0.15 - b * 0.0105) * k, lift = (1 - k) * 0.8;
      if (a <= 0.005) continue; g.beginPath(); let started = false, ppu = 10;
      for (const { p, n } of RIVP) { const q = W.projectMap(p[0] + n[0] * d, p[1] + n[1] * d, 0.4 + lift); if (!q.visible) { started = false; continue; } ppu = q.ppu || ppu;
        if (!started) { g.moveTo(q.x, q.y); started = true; } else g.lineTo(q.x, q.y); }
      g.strokeStyle = `rgba(222,225,222,${a.toFixed(3)})`; g.lineWidth = Math.max(40, Math.min(260, ppu * 4.4)); g.stroke(); }
    g.restore(); } };
const ROCK0 = onL(4.2, 2.6);   // fired from the wood's edge (Latour)
function rocketBuild(c) {
  const H = (x, y) => c.world.heightAt(x, y, CH), t0 = T.rocket - 0.25, t1 = t0 + 1.9;
  c.FX[CH].custom((t, push) => { if (t < t0 || t > t1 + 1.4) return;
    const pos = (u) => [ROCK0[0] - 6.0 * u, H(ROCK0[0], ROCK0[1]) + 0.3 + 9.0 * Math.sin(u * Math.PI * 0.62), ROCK0[1] + 2.4 * u];
    const u = Math.min(1, (t - t0) / (t1 - t0));
    if (t <= t1) { const p = pos(u); push(p[0], p[1], p[2], 0.9, 1.0, 1.4, 1.0, 0.55, 7, 1);
      for (let k = 1; k <= 14; k++) { const q = pos(Math.max(0, u - k * 0.018)); push(q[0], q[1], q[2], 0.5 + k * 0.03, 0.55 * (1 - k / 15), 1.2, 0.75, 0.35, 7, 1); } }
    else { const p = pos(1), a = 1 - (t - t1) / 1.4; for (let k = 0; k < 18; k++) { const ang = k / 18 * Math.PI * 2, r = (t - t1) * 2.2;
      push(p[0] + Math.cos(ang) * r, p[1] - (t - t1) * 1.2 + Math.sin(ang) * r * 0.6, p[2], 0.5, 0.8 * a, 1.4, 0.9, 0.5, 7, 1); } } });
}
// the result: one big centred card (dark plate, gold hairline, Cinzel), each figure on its words
const RCSS = `.aj-res{position:absolute;left:330px;top:170px;width:1260px;height:640px;color:#EEE7D6;text-align:center;font-family:"GM Cormorant",Georgia,serif;
  background:linear-gradient(180deg,#232b33 0%,#182027 60%,#141a20 100%);box-shadow:0 14px 40px rgba(0,0,0,.7),inset 0 0 0 4px #151E25,inset 0 0 0 5.5px rgba(201,178,122,.85)}
.aj-res .hd{position:absolute;left:0;right:0;top:44px;font-family:"GM Cinzel",serif;font-weight:700;font-size:28px;letter-spacing:.42em;color:#C9B27A;padding-left:.42em}
.aj-res .col{position:absolute;top:120px;width:560px}.aj-res .c1{left:40px}.aj-res .c2{right:40px}
.aj-res .sd{font-family:"GM Cinzel",serif;font-weight:700;font-size:30px;letter-spacing:.3em;padding-left:.3em}
.aj-res .c1 .sd{color:#D9867A}.aj-res .c2 .sd{color:#9FB8DC}
.aj-res .nb{font-family:"GM Cinzel",serif;font-weight:700;font-size:150px;line-height:1.05;letter-spacing:.02em;
  background:linear-gradient(180deg,#fff1c4,#e8c46c 45%,#b98a35 70%,#f0d28a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 4px rgba(0,0,0,.7))}
.aj-res .nt{font-style:italic;font-weight:600;font-size:31px;color:#E8E0CC;margin-top:4px}
.aj-res .gn{font-family:"GM Cinzel",serif;font-weight:700;font-size:24px;letter-spacing:.22em;color:#D9867A;margin-top:10px}
.aj-res .vr{position:absolute;left:629px;top:130px;width:1.5px;height:300px;background:linear-gradient(180deg,transparent,#C9B27A,transparent)}
.aj-res .ft{position:absolute;left:0;right:0;top:486px;font-family:"GM Cinzel",serif;font-weight:700;font-size:38px;letter-spacing:.2em;padding-left:.2em;color:#EEE7D6}
.aj-res .src{position:absolute;left:0;right:0;top:560px;font-style:italic;font-weight:500;font-size:22px;color:#B7A57C}`;
function buildResult(c) { const st = document.createElement("style"); st.textContent = RCSS; document.head.appendChild(st);
  const host = document.querySelector("#ov .gmo") || document.getElementById("ov"), el = document.createElement("div"); el.className = "aj-res";
  el.innerHTML = `<div class="hd">8 January 1815</div><div class="col c1"><div class="sd">British</div><div class="nb">2,037</div><div class="nt">killed, wounded or captured</div><div class="gn">three generals among them</div></div>
    <div class="vr"></div><div class="col c2"><div class="sd">American</div><div class="nb">71</div><div class="nt">killed, wounded or missing · both banks</div></div>
    <div class="ft">Behind the wall: 6 killed</div><div class="src">Lambert's return; Butler's return, 16 January 1815</div>`;
  host.appendChild(el); const tl = c.tl, gs = window.gsap, on = (sel, t) => { const e = el.querySelector(sel); gs.set(e, { autoAlpha: 0 }); tl.fromTo(e, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", immediateRender: false }, t); };
  gs.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, T.lost - 0.3); tl.to(el, { autoAlpha: 0, duration: 0.45 }, 143.3);
  on(".c1 .sd", T.lost - 0.1); on(".c1 .nb", T.thousand); on(".c1 .nt", T.captured - 0.9); on(".c1 .gn", T.generals2); on(".vr", T.army - 0.4); on(".c2 .sd", T.army - 0.4);
  on(".c2 .nb", T.seventy); on(".c2 .nt", T.missing); on(".ft", T.six - 0.05); on(".src", T.killed6 + 0.2); }
// pinned stamps (S06's stamp look)
const PINS = [];
function pin(c, html, t0, t1, world) {
  const host = document.querySelector("#ov .gmo") || document.getElementById("ov"), el = document.createElement("div");
  el.style.cssText = "position:absolute;left:0;top:0;z-index:40;pointer-events:none;width:0;height:0"; el.innerHTML = html; host.appendChild(el); window.gsap.set(el, { autoAlpha: 0 });
  c.tl.to(el, { autoAlpha: 0, duration: 0.5 }, t1); PINS.push({ el, world }); return el; }
function stamp(c, text, t0, t1, world) {
  const el = pin(c, `<span class="stamp" style="position:absolute;left:0;top:0;transform:translate(-50%,-50%);color:#A8261B;font-size:46px;padding:6px 20px 4px;border-width:4px;white-space:nowrap;background:rgba(240,230,205,.55)">${text}</span>`, t0, t1, world);
  c.tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, t0);
  c.tl.fromTo(el.firstChild, { scale: 2.3, rotation: -14, opacity: 0 }, { scale: 1, rotation: -6, opacity: 0.94, duration: 0.24, ease: "power4.in", immediateRender: false }, t0); }

const CUT1 = 4.6, CUT2 = 15.0, CUT3 = 26.0, CUT4 = 114.6, CUT5 = 127.0;
const NIGHT = (t) => t < 15 ? 0.5 : t < 27 ? 0.32 : t < 34 ? 0.12 : 0;
const K = (t, at, dist, tilt, yaw, ease = "io", night) => ({ t, region: CH, at, dist, tilt, yaw, fov: 30, ease, night: night ?? NIGHT(t) });
window.SEQ = {
  name: "S07", D: T.D, T, seed: 1815, date: "1815-01-08",
  regions: [CH],
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  regionOpts: { [CH]: { troopScale: 1.15 } },
  keys: [
    K(0, [1259.0, 3229.4], 27, 48, 6, "io", 0.5),                                   // = S06's last frame, now before dawn
    K(CUT1, [1260.6, 3230.0], 25, 49, 8, "lin", 0.5),
    { ...K(CUT1, [VIL[0] - 0.4, 3235.6], 15, 50, 12, "cut", 0.5), dissolve: 0.9 },   // the collapsed canal, the boats stuck
    K(9.3, [VIL[0] - 1.2, 3239.4], 13, 52, 6, "io", 0.5),
    K(CUT2, [VIL[0] - 2.4, 3243.0], 12, 55, 2, "lin", 0.48),   // round 2: closer, lower on the late boats                          // the west-bank force crossing late
    { ...K(CUT2, onS(1.6, -1.2), 7.5, 72, -33, "cut", 0.42), dissolve: 0.9 },           // eye level along the silent wall
    K(CUT3, onS(3.0, -1.2), 7.5, 71, -30, "lin", 0.3),
    { ...K(CUT3, onS(2.8, 5.0), 30, 49, -122, "cut", 0.25), dissolve: 0.9 },          // from behind the line across the field
    K(33.6, onS(3.0, 4.6), 29, 50, -120, "io", 0.08),
    K(39.9, onS(3.0, 4.0), 27, 50, -118, "lin", 0),
    { ...K(39.9, onS(2.7, 0.6), 12, 64, -60, "cut", 0), dissolve: 0.9 },           // low along the wall: the batteries, then rank fire
    K(55.9, onS(3.3, 0.9), 11.5, 63, -56, "lin", 0),
    { ...K(55.9, onS(3.9, 1.6), 10.5, 60, -24, "cut", 0), dissolve: 0.9 },           // close oblique down the front: the main column at the ditch
    K(69.9, onS(3.9, 1.8), 10, 61, -20, "lin", 0),
    { ...K(69.9, onS(3.5, 7.0), 13, 60, 78, "cut", 0), dissolve: 0.9 },            // from behind the British: Pakenham rides forward
    K(75.2, onS(3.6, 5.4), 12.5, 61, 74, "io", 0),
    K(83.3, onS(3.7, 4.4), 14, 60, 70, "lin", 0),
    { ...K(83.3, onS(2.2, 3.8), 12, 62, -20, "cut", 0), dissolve: 0.9 },           // from the side: the 93rd crosses and stands under grape
    K(88.0, [H93c[0] - 0.2, H93c[1] - 0.2], 11, 63, -18, "io", 0),
    K(96.7, [H93c[0] - 0.3, H93c[1] - 0.1], 10.5, 63, -16, "lin", 0),
    { ...K(96.7, onS(0.5, 1.8), 11, 60, 30, "cut", 0), dissolve: 0.9 },            // by the river: the redoubt
    K(107.5, onS(0.5, 2.0), 10.5, 61, 26, "lin", 0),
    { ...K(107.5, onS(2.8, 5.2), 30, 49, -118, "cut", 0), dissolve: 0.9 },         // the field from above: half an hour
    K(CUT4, onS(2.8, 5.4), 31, 49, -117, "lin", 0),
    { ...K(CUT4, wbo(0.5, 1.0), 17, 51, 180, "cut", 0), dissolve: 0.9 },              // the west bank, from over the river
    K(CUT5, wbo(0.45, 0.6), 18, 51, 176, "lin", 0),
    { ...K(CUT5, onS(2.8, 4.6), 31, 49, -118, "cut", 0), dissolve: 0.9 },             // the result over the still field
    K(T.D, onS(2.8, 4.4), 32, 49, -116, "lin", 0),
  ],
  clouds: { [CH]: { shadows: true } },
  units, arrows, banners, boats, fx, generals, labels,
  overlay: [
    ["plaque.date", 0.4, { month: "January 1815", day: "8", weekday: "Sunday", note: "before dawn" }],
    ["plaque.date", T.light, { month: "January 1815", day: "8", weekday: "Sunday", note: "first light" }],
    ["plaque.date", T.lifted, { month: "January 1815", day: "8", weekday: "Sunday", note: "the fog lifts" }],
    ["distance", T.five - 0.25, 40.0, { from: onS(MS, -0.2), to: onS(MS, 3.6), value: 500, unit: "YARDS", sub: "from the guns", dash: false }],
    (O, c) => stamp(c, "NO LADDERS", T.behind - 0.05, T.hands + 0.6, onS(3.7, 3.6)),
    ["label", T.mortally - 0.05, T.third - 0.2, { name: "The main column's general", sub: "mortally wounded", world: onS(4.4, 5.8), side: "uk", marker: false }],
    ["label", T.badly - 0.05, 83.0, { name: "A third general", sub: "badly wounded", world: onS(2.4, 6.6), side: "uk", marker: false }],
    (O, c) => stamp(c, "HALF AN HOUR", T.hour - 0.05, 114.2, onS(3.0, 4.4)),
    ["film.dim", T.lost - 0.6, 143.4, 0.8],
    ["letter", 143.6, T.D + 1, { header: "Move 3 · New Orleans", title: "The Old Hickory Method", sub: "1. Close every door · 2. Strike first", marks: false, quote: "3. Make them come to you", qSize: 34, height: 300,
      cps: 30, qAt: T.make - 0.05, lag: 0.05, stagger: 0.06, partDur: 0.35 }],
  ],
  build: (c) => { fog.build(c); rocketBuild(c); buildResult(c);
    // round 1 (critic A): Jackson's rampart as the same thin parapet as S06's end (55 % of the baked crest height)
    const R = c.world.regions[CH], Wk = R.works || [], ys = R.ys || 1, info = (VX.region(CH).features || {}).works || [];
    if (Wk[0]) Wk[0].position.y = -0.45 * ((info[0] || {}).height_m || 1.5) * ys; },
  draw: (t, c) => { fog.draw(t, c); const sc = 1920 / c.world.renderer.domElement.width * (c.world.renderer.getPixelRatio ? c.world.renderer.getPixelRatio() : 1);
    for (const p of PINS) { const s = c.world.projectMap(p.world[0], p.world[1], 0.3); p.el.style.transform = `translate(${(s.x * sc).toFixed(1)}px,${(s.y * sc).toFixed(1)}px)`; } },
};
})();
