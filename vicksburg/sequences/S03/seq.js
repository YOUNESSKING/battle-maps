// S03 the night of 16 April (87.70 s). Night over the hairpin bend at Vicksburg: the fleet in line upstream (Benton leading, six more
// gunboats, three transports; ran dark, no lamps) casts off on "cast off", slides up the bend; the bluff batteries open on "Guns opened"
// (each flash = a gun cue, the shot falls in the river), houses on both shores set on fire + bonfires on the shore light the river,
// the gunboats fire back; close on the transports: the Henry Clay is disabled, abandoned, a shell bursts in her cotton -> she burns and
// drifts down past the fleet; Grant card + quote card on his words; DAWN: a 1 s dissolve to the wide map, the fleet at anchor below the
// city near New Carthage, the route drawn, ledger; "six nights later" more steamers run down the river.
// Facts: research/FACT_NOTES.md (Run of 16 Apr; GM ch. XXXII). The vessel order follows the usual accounts (Benton, Lafayette with the
// General Price lashed alongside, Louisville, Mound City, Pittsburg, Carondelet; Silver Wave, Henry Clay, Forest Queen; Tuscumbia last).
(() => {
const T = { D: 87.70, night: 0.75, sixteenth: 1.43, ten: 3.10, cast: 4.15, admiral: 5.01, porter: 6.09, benton: 8.11, five: 9.19, transports: 13.09,
  cotton: 16.43, barges: 18.23, saw: 20.87, guns: 22.29, shore: 24.49, houses: 25.25, fire: 26.17, bonfires: 26.91, lit: 28.65, river: 29.51,
  view: 32.43, slowing: 33.21, bend: 33.83, twoHours: 35.87, every: 37.51, hit: 38.59, going: 40.43, oneT: 41.63, henry: 42.83, disabled: 43.79,
  abandoned: 45.39, shell: 47.19, burst: 47.47, cottonHC: 48.27, burned: 50.73, edge: 51.97, drifted: 52.51, past: 54.19, dark: 55.61,
  grant: 56.81, transport: 58.41, city: 59.57, quote: 59.87, remembered: 63.61, morning: 65.07, fleet: 65.69, below: 66.19, vb: 66.55,
  lost: 68.51, grantsCount: 70.03, noone: 71.17, killed: 72.85, six: 74.09, later: 74.53, steamers: 75.43, ran: 76.01, supplies: 77.11,
  soldiers: 78.79, volunteered: 79.63, tells: 81.21, fiveTimes: 84.65, over: 85.45 };
const VB = "vicksburg", WIDE = "wide";
const DAWN = 64.55;                           // dissolve night -> dawn on the close world (between the paragraphs, 64.34 / 64.89)
const WIDE0 = 69.55;                          // dissolve dawn close -> the wide map (between "lost." and "And by Grant's count")
const hsh = VX.hsh, lerp = VX.lerp, clamp = VX.clamp, sstep = VX.sstep;
const RIV = VX.river(VB, 0).pts.map((p) => [p[0], p[1]]), WL = VX.river(VB, 0).pts[0][2];
const BAT = VX.region(VB).features.batteries;
const L = VX.len(RIV);

// ---------------- the fleet: arc-length schedule along the river (s = 0 at the west edge of the region, 108 = top of the hairpin, 122-160 the city front)
const KS = [[0, 56], [T.cast, 56], [20.1, 90], [27.0, 104], [34.0, 117], [44.0, 145], [49.0, 151], [DAWN + 0.5, 155], [69.6, 168]];   // below the city the gunboats hold and regroup   // the lead boat (Benton)
const sLead = (t) => { if (t <= KS[0][0]) return KS[0][1]; for (let i = 1; i < KS.length; i++) if (t < KS[i][0]) { const [t0, s0] = KS[i - 1], [t1, s1] = KS[i];
  const k = (t - t0) / (t1 - t0);
  return s0 + (s1 - s0) * k; } return KS[KS.length - 1][1]; };
// smooth the piecewise-linear schedule (moving average over 3 s) so the boats ease through the speed changes
const sSmooth = (t) => { let a = 0; for (let k = -6; k <= 6; k++) a += sLead(t + k * 0.25); return a / 13; };
const GAP = 1.6, LAG = 0.45;                 // at anchor 1.6 units apart; underway ~2.7
const NAMES = ["Benton", "Lafayette", "Louisville", "Mound City", "Pittsburg", "Carondelet", "Silver Wave", "Henry Clay", "Forest Queen", "Tuscumbia"];
const KINDS = ["gunboat", "gunboat", "gunboat", "gunboat", "gunboat", "gunboat", "steamer", "steamer", "steamer", "gunboat"];
const HC = 7;
const sBoat = (i, t) => sSmooth(t - i * LAG) - i * GAP;
// the Henry Clay: disabled on "disabled" (her engines stop; she slows to the current), then drifts down past the fleet burning
const tDis = T.disabled, sDis = sBoat(HC, tDis);
const sHC = (t) => { if (t <= tDis) return sBoat(HC, t); const v0 = (sBoat(HC, tDis) - sBoat(HC, tDis - 0.5)) / 0.5, dt = t - tDis;
  // decelerate to the current (0.55 u/s) over 3 s, then after the fire she swings out and drifts faster down the channel (1.25 u/s)
  const vc = 0.6, a = Math.min(dt, 3), s1 = sDis + v0 * a - (v0 - vc) * a * a / 6;
  if (dt <= 3) return s1; const t2 = dt - 3, tb = T.burst - tDis - 3;   // after the shell: she swings into the current and drifts down fast (2.6 u/s from ~50.5)
  let s = s1 + vc * t2; if (t2 > tb) { const u = t2 - tb, r = 3.0; s += 2.0 * (u < r ? u * u / (2 * r) : r / 2 + (u - r)); } return s; };
const posOn = (path, s) => VX.along(path, s);
// the Henry Clay keeps to the west (right-hand) side of the channel once she is out of control
const offPath = (path, d) => path.map((p, i) => { const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [p[0] - (b[1] - a[1]) / l * d, p[1] + (b[0] - a[0]) / l * d]; });
const RIV_HC = offPath(RIV, 0.7);   // her own lane, a little to the side, so the boats behind can pass her
const hcPath = (t) => posOn(RIV_HC, sHC(t));

let WW = null;
const waterY = () => WL * WW.regions[VB].ys + 0.02;
const boatXY = (i, t) => i === HC ? hcPath(t) : posOn(RIV, sBoat(i, t));

// ---------------- batteries (the bluffs): each fires at the nearest boats inside ~16 units, flash + plume, the shot falls in the river near a boat
const shots = [];
{ let t = T.guns + 0.02, k = 0;
  while (t < DAWN - 0.8) { const lead = posOn(RIV, sBoat(0, t)), tail = posOn(RIV, sBoat(9, t));
    const cand = BAT.map((b, j) => ({ b, j, d: Math.min(Math.hypot(b.x - lead[0], b.z - lead[1]), Math.hypot(b.x - tail[0], b.z - tail[1]), ...[3, 6, 7].map((i) => { const p = boatXY(i, t); return Math.hypot(b.x - p[0], b.z - p[1]); })) }))
      .filter((c) => c.d < (t < 27 ? 34 : 24));
    if (cand.length) { const c = cand[Math.floor(hsh(k, 3) * cand.length)], i = Math.floor(hsh(k, 5) * 10), p = boatXY(i, t + 0.7);
      const miss = 0.5 + hsh(k, 7) * 1.4, ang = hsh(k, 9) * 6.283;
      shots.push({ t: +t.toFixed(2), at: [c.b.x, c.b.z], dir: [p[0] - c.b.x, p[1] - c.b.z].map((v, _, a) => v / Math.hypot(a[0], a[1])), impact: [p[0] + Math.cos(ang) * miss, p[1] + Math.sin(ang) * miss * 0.6], delay: 0.7 }); }
    k++; t += t < 24.5 ? 0.9 + hsh(k, 1) * 0.5 : t < 50 ? 0.48 + hsh(k, 1) * 0.42 : 0.9 + hsh(k, 1) * 0.8; } }
// the gunboats fire back at the town (muzzle flash on the boat, the shot lands on the bluff)
const backShots = [29.4, 31.0, 32.6, 35.1, 37.9, 39.2, 40.6].map((t, k) => { const i = [0, 2, 1, 3, 4, 5, 9][k], p = boatXY(i, t);
  const b = BAT.reduce((m, q) => Math.hypot(q.x - p[0], q.z - p[1]) < Math.hypot(m.x - p[0], m.z - p[1]) ? q : m, BAT[0]);
  return { t, at: [p[0], p[1]], dir: [b.x - p[0], b.z - p[1]].map((v, _, a) => v / Math.hypot(a[0], a[1])), impact: [b.x + 0.8, b.z + (hsh(k, 2) - 0.5) * 2], delay: 0.6 }; });

// ---------------- the shore fires: houses set on fire on both banks (fire cues) + bonfires along the foot of the bluff (campfires)
const HOUSE_FIRES = [[1383.6, 667.4, T.houses + 0.1], [1381.3, 676.0, T.houses + 0.6], [1372.0, 664.0, T.fire], [1379.4, 685.6, T.fire + 0.5], [1367.6, 676.5, T.bonfires], [1377.6, 694.0, T.lit - 0.3], [1356.6, 699.0, T.river]];
const frontAt = (y) => { let b = null; for (const p of RIV) if (p[0] > 1360 && (!b || Math.abs(p[1] - y) < Math.abs(b[1] - y))) b = p; return b; };
const BONFIRES = [662, 669, 674, 681, 688, 695, 702].map((y, i) => { const p = frontAt(y); return [p[0] + 3.4 + hsh(i, 4) * 0.6, y]; });

// ---------------- custom sprites: the shore fires' light on the water, the Henry Clay burning while she drifts (moving fire: flames + glow + smoke)
const custom = [
  { region: VB, fn: (t, push) => { if (!WW || t > 70.0) return; const wy = waterY();
    for (let i = 0; i < 10; i++) { if (i === HC && t > T.burst) continue; const p = boatXY(i, t), dx = p[2], dy = p[3];
      push(p[0], wy + 0.12, p[1], 1.5, 0.24, 0.55, 0.66, 0.85);
      for (let k = 1; k <= 9; k++) push(p[0] - dx * k * 0.45, wy + 0.03, p[1] - dy * k * 0.45, 0.55 + k * 0.1, 0.28 * (1 - k / 10), 0.55, 0.65, 0.8); } } },
  { region: VB, fn: (t, push) => { if (!WW || t > DAWN + 0.2) return; const wy = waterY();
    for (const [x, y, t0] of HOUSE_FIRES) { const e = sstep(t0, t0 + 2, t); if (e <= 0) continue; const r = frontAt(y), dx = r[0] - x, wx = x + dx * 0.55;
      for (let j = 0; j < 3; j++) { const f = 0.75 + 0.25 * Math.sin(t * (6.1 + j) + x) * Math.sin(t * 2.3 + j * 1.7);
        push(wx + (j - 1) * 1.0, wy, y + (j - 1) * 0.9, 3.4, 0.2 * e * f, 1.0, 0.42, 0.12); } }
    for (const [x, y] of BONFIRES) { const e = sstep(T.bonfires, T.bonfires + 2, t), r = frontAt(y); if (e <= 0) continue;
      push(lerp(x, r[0], 0.5), wy, y, 2.6, 0.13 * e * (0.8 + 0.2 * Math.sin(t * 7 + y)), 1.0, 0.45, 0.14); } } },
  { region: VB, fn: (t, push) => { if (!WW || t < T.burst - 0.05 || t > DAWN + 0.2) return; const wy = waterY(), e = sstep(T.burst - 0.05, T.burst + 1.6, t), big = 1 + 0.5 * sstep(T.burned, T.edge + 2, t);
    const p = hcPath(t), dx = p[2], dy = p[3];
    // glow on the water around her + the flame body (additive), embers
    push(p[0], wy + 0.02, p[1], 7 * big, 0.16 * e, 0.9, 0.36, 0.08);   // orange glow on the water
    push(p[0], wy + 0.2, p[1], 2.2 * big, 0.22 * e, 0.97, 0.62, 0.22);
    for (let j = 0; j < 9; j++) { const ph = j * 1.91, u = ((t * (1.4 + 0.25 * j) + ph) % 1), along = (hsh(j, 31) - 0.5) * 1.1, fl = 0.75 + 0.25 * Math.sin(t * (7 + j) + ph);
      push(p[0] + dx * along + Math.sin(t * 3 + ph) * 0.08, wy + 0.18 + u * 0.75 * big, p[1] + dy * along, (0.45 + 0.35 * (1 - u)) * big, 0.42 * e * fl * Math.sin(Math.PI * Math.min(1, u * 1.1 + 0.05)), 0.97, 0.5 + 0.27 * (1 - u), 0.14 + 0.1 * (1 - u), 4 + (j % 2), 1); }
    for (let j = 0; j < 10; j++) { const u = ((t * 0.45 + j * 0.37) % 1); push(p[0] + Math.sin(j * 7.1 + t) * 0.5 - u * 0.6, wy + 0.8 + u * 2.6, p[1] - u * 0.5, 0.12, 0.8 * e * (1 - u), 2.2, 0.9, 0.25, 7, 1); }
    // smoke: puffs born at her position in the past, rising and drifting with the wind (deterministic in t)
    for (let j = 0; j < 30; j++) { const age = ((t - T.burst) * 1.0 + j * 0.4) % 12, tb = t - age; if (tb < T.burst) continue; const q = hcPath(tb), u = age / 12, lit = Math.max(0, 1 - age / 2.5);
      push(q[0] + age * 0.3, wy + 0.9 + age * 0.55, q[1] - age * 0.16, 1.2 + age * 0.45, 0.8 * e * (1 - u) * sstep(0, 0.5, age), 0.42 + 0.5 * lit, 0.4 + 0.16 * lit, 0.39 + 0.02 * lit, 6, 4.0); } } },   // dark grey column, lit orange at its foot
];

// ---------------- dawn: the fleet at anchor below the city (wide map), the route, the second run six nights later
const RW = VX.river(WIDE, 0).pts.map((p) => [p[0], p[1]]);
const idxNear = (x, y, from = 0) => { let b = from; for (let i = from; i < RW.length; i++) if (Math.hypot(RW[i][0] - x, RW[i][1] - y) < Math.hypot(RW[b][0] - x, RW[b][1] - y)) b = i; return b; };
const iCity = idxNear(1377, 681), iAnch = idxNear(1205, 872, iCity);
const ROUTE = RW.slice(iCity, iAnch + 1).filter((_, i) => i % 4 === 0);
const LR = VX.len(ROUTE);
const iAbove = idxNear(1318, 692), RUN2 = RW.slice(iAbove, iAnch + 1).filter((_, i) => i % 4 === 0), LR2 = VX.len(RUN2);
const sCity = (() => { let b = 0, bd = 1e9; for (let s = 0; s < LR2; s += 1) { const p = VX.along(RUN2, s), d = Math.hypot(p[0] - 1377, p[1] - 681); if (d < bd) { bd = d; b = s; } } return b; })();
const sRun = (t, i) => (t - T.steamers) * 14 - i * 6.5;   // ~14 units/s from the foot of the west loop; the lead passes the city ~4 s after "steamers"
const TIG = 2, SINK_S = sCity + 20, T_SINK = T.steamers + (SINK_S + TIG * 6.5) / 14;
const run2Shots = [];
{ let k = 0; for (let t = T.steamers + 1.5; t < 86; t += 0.7 + hsh(k, 4) * 0.6, k++) { const i = Math.floor(hsh(k, 6) * 6), s = sRun(t + 0.8, i); if (s < sCity - 30 || s > sCity + 30) continue;
  const p = VX.along(RUN2, s), b = BAT[2 + Math.floor(hsh(k, 7) * 8)], dx = p[0] - b.x, dy = p[1] - b.z, l = Math.hypot(dx, dy);
  run2Shots.push({ t: +t.toFixed(2), at: [b.x + 1, b.z], dir: [dx / l, dy / l], impact: [p[0] + (hsh(k, 8) - 0.5) * 3, p[1] + (hsh(k, 9) - 0.5) * 3], delay: 0.8 }); } }
const anchorS = (i) => LR - 2 - i * 6.5;            // at anchor along the last stretch, Benton furthest down
const boatsWide = [
  { region: WIDE, kind: KINDS.filter((_, i) => i !== HC), n: 9, size: 2.2, path: ROUTE, sAt: (t, i) => anchorS(i), t0: DAWN - 0.1, t1: T.D + 1, lamp: false, wake: false },   // the Henry Clay is lost
  // six nights later: six steamers run down from above the city past the guns; the Tigress (i = 2) is hit and sinks below the city
  { region: WIDE, kind: "steamer", n: 6, size: 3.4, path: RUN2, sAt: (t, i) => i === TIG ? Math.min(sRun(t, i), SINK_S) : Math.min(LR2 - 4 - i * 6.5, sRun(t, i)), h: (t, i) => i === TIG ? 1.2 - 2.0 * sstep(T_SINK, T_SINK + 2.2, t) : 1.2,
    t0: T.steamers - 0.3, t1: T.D + 1, lamp: true },
];

window.SEQ = {
  name: "S03", D: T.D, T, seed: 1863, date: "1863-04-16",
  regions: [VB, WIDE],
  keys: [
    // night: low behind the fleet at its moorings (boats readable), a slow push down the line as it casts off
    { t: 0.0, region: VB, at: [1334, 694], dist: 18, tilt: 54, yaw: -36, fov: 32, night: 1 },
    { t: 12.0, region: VB, at: [1345, 683], dist: 24, tilt: 54, yaw: -40, fov: 32, night: 1 },
    { t: 20.0, region: VB, at: [1363, 668], dist: 52, tilt: 53, yaw: -50, fov: 32, night: 1 },
    // the batteries open: the whole bend, the city on the bluff, the shore fires
    { t: 29.0, region: VB, at: [1370, 669], dist: 60, tilt: 50, yaw: -56, fov: 32, night: 1 },
    { t: 36.6, region: VB, at: [1374, 671], dist: 54, tilt: 51, yaw: -60, fov: 32, night: 1 },
    // close on the transports (the Henry Clay)
    { t: 41.5, region: VB, at: [1381.5, 666.5], dist: 33, tilt: 54, yaw: -66, fov: 32, night: 1 },
    { t: 49.0, region: VB, at: [1381.0, 671.0], dist: 30, tilt: 55, yaw: -70, fov: 32, night: 1 },
    // she drifts down past the fleet
    { t: 56.5, region: VB, at: [1377.0, 684.0], dist: 40, tilt: 53, yaw: -64, fov: 32, night: 1 },
    { t: DAWN, region: VB, at: [1374.0, 691.0], dist: 44, tilt: 52, yaw: -60, fov: 32, night: 1 },
    // dawn: dissolve to the same world in the morning light, the fleet at anchor below the city
    { t: DAWN, region: VB, at: [1371, 697], dist: 40, tilt: 50, yaw: -20, fov: 32, night: 0.35, ease: "cut", dissolve: 1.0 },
    { t: WIDE0, region: VB, at: [1372, 694], dist: 46, tilt: 49, yaw: -24, fov: 32, night: 0 },
    // the wide map: the route the fleet took; then six nights later the second run past the city (camera follows it south)
    { t: WIDE0, region: WIDE, at: [1290, 770], dist: 330, tilt: 45, yaw: -2, fov: 30, ease: "cut", dissolve: 0.7 },
    { t: 73.6, region: WIDE, at: [1310, 745], dist: 300, tilt: 46, yaw: -3, fov: 30 },
    { t: 75.2, region: WIDE, at: [1380, 688], dist: 200, tilt: 47, yaw: -3, fov: 30, night: 0.55 },
    { t: 81.0, region: WIDE, at: [1382, 702], dist: 190, tilt: 47, yaw: 1, fov: 30, night: 0.55 },
    { t: T.D, region: WIDE, at: [1352, 752], dist: 250, tilt: 46, yaw: 2, fov: 30, night: 0.55 },
  ],
  clouds: { [VB]: { shadows: false }, [WIDE]: { keepClear: [[1260, 820, 90, 1, 0.8], [1383, 680, 50, 1, 0.6], [1330, 740, 80, 1, 0.7]], nightErode: 0 } },
  units: [
    ...BAT.map((b) => ({ region: VB, side: "r", type: "art", n: 2, face: "west", keys: [[0, b.x + 0.6, b.z]] })),
    { region: WIDE, side: "r", type: "inf", n: 3, face: "west", t0: WIDE0, keys: [[0, 1398, 684]] },   // Vicksburg still holds
    { region: WIDE, side: "r", type: "art", n: 2, face: "west", t0: WIDE0, keys: [[0, 1389, 670]] },
  ],
  labels: [{ text: "Vicksburg", at: [1385, 693], size: 24, t0: T.vb, t1: T.vb + 2.9, region: VB }],
  arrows: [
    { region: WIDE, side: "u", pts: ROUTE.filter((_, i) => i % 3 === 0), t0: WIDE0 + 0.4, dur: 2.0, t1: T.six + 0.4, width: 0.3 },
  ],
  boats: [
    { region: VB, kind: KINDS.filter((_, i) => i !== HC), n: 9, size: 0.68, path: RIV, sAt: (t, i) => sBoat(i >= HC ? i + 1 : i, t), t0: -1, t1: WIDE0 + 0.05, lamp: false },
    { region: VB, kind: "steamer", n: 1, size: 0.68, path: RIV_HC, sAt: (t) => sHC(t), t0: -1, t1: T.drifted + 2.4, lamp: false },   // (the hull is gone by then: the fire burns at the waterline)
    ...boatsWide,
  ],
  fx: {
    fires: [
      ...HOUSE_FIRES.map(([x, y, t0]) => ({ region: VB, at: [x, y, 0.1], t0, t1: DAWN + 1, preset: "house", opts: { size: 0.75 } })),
    ],
    guns: [
      { region: VB, preset: "battery", h: 0.25, boom: false, opts: { size: 1.5, alpha: 0.2, flash: 3.2, flashLife: 0.18 }, shots, impactOpts: { size: 0.5 } },
      { region: VB, preset: "field", h: 0.2, boom: false, opts: { size: 0.6, flash: 1.6 }, shots: backShots, impactOpts: { size: 0.5 } },
      { region: WIDE, preset: "battery", h: 0.8, boom: false, opts: { size: 2.6, alpha: 0.3, flash: 1.8, flashLife: 0.2 }, shots: run2Shots, impactOpts: { size: 2.0 } },
    ],
    campfires: [{ region: VB, pts: BONFIRES, t0: T.bonfires, t1: DAWN + 1 }],
  },
  build: async (ctx) => { WW = ctx.world; for (const c of custom) ctx.FX[c.region].custom(c.fn); },
  overlay: [
    ["plaque.date", T.sixteenth + 0.1, { month: "April 1863", day: "16", weekday: "Thursday", note: "night" }],
    ["plaque.clock", T.ten + 0.05, { time: "22:00", note: "the boats cast off", header: "16 April 1863" }],
    ["plaque.run", T.cast + 0.4, 19.5, "22:30", { step: 1 }],
    ["medallion", { kind: "card", general: "porter", sub: "Mississippi Squadron", screen: [1765, 215], tIn: T.porter, tOut: 12.2 }],
    ["label", T.benton, T.benton + 3.6, { name: "Benton", sub: "the flagship", world: (t) => { const p = boatXY(0, t); return [p[0], p[1], 0.3]; }, side: "us" }],
    ["label", T.transports, T.transports + 3.8, { name: "Three transports", sub: "boilers padded with cotton and hay", world: (t) => { const p = boatXY(7, t); return [p[0], p[1], 0.3]; }, side: "us" }],
    ["plaque.note", T.guns, "the batteries open"],
    ["plaque.note", T.twoHours, "under fire for over two hours"],
    ["inset", T.every, T.disabled - 0.4, { img: "seq/inset_run.jpg", x: 1330, y: 175, w: 480, h: 345, caption: "Running the batteries, 16 April 1863 · Library of Congress" }],
    ["label", T.henry, T.abandoned + 1.2, { name: "Henry Clay", sub: "disabled · abandoned", world: (t) => { const p = hcPath(t); return [p[0], p[1], 0.3]; }, side: "us" }],
    ["label", T.burst + 0.2, T.burned + 2.4, { name: "Henry Clay", sub: "a shell in her cotton", world: (t) => { const p = hcPath(t); return [p[0], p[1], 0.3]; }, side: "cs", marker: false }],
    ["medallion", { kind: "card", general: "grant", sub: "watching from a transport above the city", screen: [1765, 215], tIn: T.grant, tOut: T.quote - 0.3 }],
    ["quote", T.quote, T.remembered + 0.6, { en: "The sight was magnificent, but terrible.", attr: "Ulysses S. Grant · Personal Memoirs", y: 380, dim: 0.5 }],
    ["film.grade", DAWN, "day", 1.0],
    ["plaque.date", T.morning, { month: "April 1863", day: "17", weekday: "Friday", note: "by morning" }],
    ["ledger.show", T.fleet, { title: "Running the batteries", sub: "16 - 17 April 1863" }],
    ["ledger.add", T.below, { who: "Fleet below Vicksburg", stamp: false }],
    ["ledger.add", T.lost, { who: "1 transport lost", note: "the Henry Clay", stamp: false }],
    ["ledger.add", T.noone, { who: "None killed", note: "on the transports · by Grant's count", stamp: false }],
    ["film.grade", T.six, "night", 1.2],
    ["plaque.date", T.later, { month: "April 1863", day: "22", weekday: "Wednesday", note: "six nights later" }],
    ["ledger.add", T.ran, { who: "More steamers run the guns", note: "with supplies · volunteer crews", stamp: false }],
    ["ledger.final", T.fiveTimes, { lines: ["Volunteers", "five times over"], color: "#2C4A8A" }],
  ],
};
void L;
})();
