// S01 cold open (55.32 s), round 2. Action from frame 1: the wide map over the bend, the bluff batteries at Vicksburg flash at a Union
// gunboat rounding the bend (every shot visible, splash at the boat); ONE continuous push-in onto the city (lands on "Vicksburg" 7.74);
// the cloud dive starts on "eighteen" (push 9.5) with the 3D gold title "5 BATTLES · 18 DAYS" riding it (on 9.80, past the lens ~14.5);
// white-out <= 0.3 s (swap 16.4); emergence over the city front at a GM close tilt (52 deg, yaw within 15 deg for the whole close shot);
// the batteries fire on "guns"; the river pulses truly red on "closed"; the camera drifts west over De Soto Point: two blue thrusts stop
// short, a red FAILED stamp on "failed"; a 0.6 s dissolve to the montage = short close shots joined by 0.4 s dissolves: the crossing
// below the city, the march inland, the split (Jackson / Edwards), the Big Black bridge burning, the ring round the city, 29,500,
// white flags; pull back while the Mississippi glows Union blue from Vicksburg south. The date plaque never leaves.
// No Grant name or portrait in S01. Times = local scene time (tools/scene_times.py S01 --words).
(() => {
const T = { D: 55.32, spring: 0.72, union: 4.56, miss: 5.42, vicksburg: 7.74, eighteen: 9.80, days: 10.02, army: 11.26, five: 12.44, battles: 12.88,
  reach: 13.58, supply: 14.92, marching: 16.94, armies: 18.66, guns: 20.36, bluffs: 21.66, river: 22.48, held: 23.24, miss2: 24.62, closed: 25.44,
  north: 26.20, confed: 27.30, piece: 28.72, every: 30.26, failed: 32.54, then: 33.84, crossed: 34.78, below: 35.68, city: 36.22, turned: 37.06,
  vb2: 38.14, marched: 39.12, inland: 39.50, nine: 40.88, weeks: 41.26, crossing: 42.18, nearly: 43.46, thirty: 43.93, confed2: 44.70,
  out: 45.90, vb3: 46.88, stacked: 47.52, arms: 48.12, story: 49.50, campaign: 50.70, split: 51.68, two: 53.14 };
const WIDE = "wide", VB = "vicksburg";
const SWT = 16.4, OFF = { push: 9.5 - SWT, warm: 0.05, emerge: 0.15, clear: 0.4, haze: 1.05 };
const DV = VX.diveTimes(SWT); for (const k in OFF) DV[k] = SWT + OFF[k];   // push 9.5, deckIn 14.7, full 15.85, SW 16.4, emerge 16.6, land 19.75
const CUT = 33.62;                       // paragraph change: dissolve to the montage on the wide map
const X1 = 39.3, X2 = 41.25, X3 = 43.3;  // montage cuts (0.4 s dissolves): the split, the Big Black bridge, the ring round the city
const hsh = VX.hsh, sstep = VX.sstep;
const TW = (n) => VX.town(n, WIDE);
const BAT = VX.region(VB).features.batteries;   // 12 river batteries along the bluff, north -> south
const RIVC = VX.river(VB, 0).pts;        // close Mississippi (west loop, up the hairpin, south along the city front)
const RIVW = VX.river(WIDE, 0).pts;
const frontAt = (y) => { let b = null; for (const p of RIVC) if (p[0] > 1360 && (!b || Math.abs(p[1] - y) < Math.abs(b[1] - y))) b = p; return b; };
const idxW = (x, y) => { let b = 0; for (let i = 0; i < RIVW.length; i++) if (Math.hypot(RIVW[i][0] - x, RIVW[i][1] - y) < Math.hypot(RIVW[b][0] - x, RIVW[b][1] - y)) b = i; return b; };
const lin = (c) => c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));   // sRGB -> linear (flat unlit sprites)
const RED = lin([0xbe / 255, 0x3a / 255, 0x2a / 255]), BLUE = lin([0x2c / 255, 0x57 / 255, 0xb7 / 255]);

let WW = null;
const waterY = (r, wl) => wl * WW.regions[r].ys + 0.05;

// ---------------- the opening action (wide): a Union gunboat rounds the bend above the city, the bluff batteries fire at it ----------------
const GBPATH = RIVW.slice(idxW(1322, 696), idxW(1372, 652) + 1).filter((_, i, a) => i % 3 === 0 || i === a.length - 1).map((p) => [p[0], p[1]]);
const gbS = (t) => 4 + t * 2.3;          // slow, steady: the boat is still short of the hairpin when the dive starts
const gbXY = (t) => VX.along(GBPATH, gbS(t));
const WSHOT = [0.25, 1.15, 2.05, 3.0, 3.85, 4.9, 5.9, 6.95, 8.0, 9.0];
const wideShots = WSHOT.map((t, k) => { const b = BAT[[3, 1, 5, 2, 4, 0, 6, 3, 1, 5][k]], p = gbXY(t + 0.8), ang = hsh(k, 9) * 6.283, miss = 1.5 + hsh(k, 3) * 2.5;
  const dx = p[0] - b.x, dy = p[1] - b.z, l = Math.hypot(dx, dy); return { t, at: [b.x + 1.5, b.z], dir: [dx / l, dy / l], impact: [p[0] + Math.cos(ang) * miss, p[1] + Math.sin(ang) * miss], delay: 0.8 }; });

// ---------------- units ----------------
const units = [
  // wide: the Vicksburg garrison (on screen from the first frame), stacks arms on "stacked"
  { region: WIDE, side: "r", type: "inf", n: 4, face: "east", keys: [[0, 1398, 684], [T.out, 1398, 684], [T.stacked - 0.2, 1406, 684]], cap: T.stacked, capN: 4 },
  // wide: the river guns on the bluffs (the flashes come from them)
  { region: WIDE, side: "r", type: "art", n: 2, face: "west", keys: [[0, 1391, 666]] },
  { region: WIDE, side: "r", type: "art", n: 2, face: "west", keys: [[0, 1388, 682]] },
  // wide: Union boxes above the city (Milliken's Bend / Young's Point) on "Union"
  { region: WIDE, side: "u", type: "inf", n: 3, face: "south", t0: T.union, t1: CUT, keys: [[0, 1236, 604]] },
  { region: WIDE, side: "u", type: "inf", n: 3, face: "south", t0: T.union + 0.25, t1: CUT, keys: [[0, 1282, 640]] },
];
// close: guns on the bluff batteries (Style W gun boxes), garrison in the town behind
BAT.forEach((b, i) => { if (i < 1 || i > 10) return; units.push({ region: VB, side: "r", type: "art", n: 2, face: "west", keys: [[0, b.x + 0.6, b.z]] }); });
[[1389.5, 676.5], [1388.0, 686.5], [1384.5, 697.0]].forEach(([x, y]) => units.push({ region: VB, side: "r", type: "inf", n: 3, face: "west", keys: [[0, x, y]] }));

// ---------------- the montage route (wide) ----------------
const XING = [[1149, 1004], [1163, 1016], [1179, 1027]];   // Louisiana shore -> Bruinsburg, below the city
const INLAND = [TW("Bruinsburg"), [1250, 1028], TW("Port Gibson"), TW("Willow Springs"), TW("Rocky Springs"), [1500, 897], TW("Utica"), [1650, 820], TW("Raymond"), [1800, 735], TW("Jackson")];
const BACK = [TW("Jackson"), TW("Clinton"), TW("Bolton"), [1630, 694], TW("Edwards"), [1540, 688], [1512.4, 683.6], [1470, 682], [1436, 686]];
const kIn = VX.march(INLAND, 35.6, VX.len(INLAND) / (39.9 - 35.6), { step: 6 });
const kBack = VX.march(BACK, 40.0, VX.len(BACK) / (44.2 - 40.0), { step: 6 }).filter((k) => k[0] > 40.0);
units.push({ region: WIDE, side: "u", type: "inf", n: 3, t0: T.crossed, face: "east", keys: [[T.crossed, ...XING[0]], [35.5, ...XING[2]], ...kIn, ...kBack] });
// the split: Johnston's force at Jackson pushed off north-east; Pemberton's field army at Edwards driven back west over the Big Black into the city
units.push({ region: WIDE, side: "r", type: "inf", n: 3, face: "south", t0: CUT, t1: X2, keys: [[CUT, 1880, 716], [39.5, 1880, 716], [41.2, 1925, 668]] });
units.push({ region: WIDE, side: "r", type: "inf", n: 4, face: "east", t0: CUT, t1: 45.2, keys: [[CUT, 1600, 702], [39.8, 1600, 702], [41.4, 1545, 690], [42.2, 1505, 684], [44.6, 1412, 690]] });
// the siege ring closes
[[1420, 656], [1428, 714]].forEach(([x, y], i) => units.push({ region: WIDE, side: "u", type: "inf", n: 3, face: "west", t0: X3 + 0.2 + i * 0.3, keys: [[0, x + 12, y], [44.6 + i * 0.3, x, y]] }));

// ---------------- arrows ----------------
const CANAL = VX.river(VB, 2).pts.map((p) => [p[0], p[1] - 2.0]);
const arrows = [
  // "Every Union attempt ... had failed": Grant's canal across the point + the thrust at the point, both stop short and fade before the cut
  { region: VB, side: "u", pts: VX.sub(CANAL, 0, 15, 2), t0: T.every, dur: 1.2, t1: 33.0, width: 1.0 },
  { region: VB, side: "u", pts: [[1350, 694], [1357, 686], [1362, 680]], t0: 31.0, dur: 1.0, t1: 33.0, width: 1.0 },
  { region: WIDE, side: "u", pts: XING, t0: T.crossed, dur: 1.0, t1: 50.6, width: 0.22 },
  { region: WIDE, side: "u", pts: INLAND, t0: T.turned, dur: 2.7, t1: 50.6, width: 0.22 },
  { region: WIDE, side: "u", pts: BACK, t0: 40.0, dur: 3.6, t1: 50.6, width: 0.22 },
  { region: WIDE, side: "r", pts: [[1888, 708], [1906, 686], [1925, 662]], t0: X1 + 0.3, dur: 1.2, t1: X2, width: 0.24 },   // Johnston driven off
  { region: WIDE, side: "r", pts: [[1592, 698], [1565, 693], [1540, 688]], t0: X1 + 0.6, dur: 1.2, t1: 43.0, width: 0.24 },   // Pemberton driven back
];

// ---------------- fx ----------------
const shotTimes = [20.42, 20.86, 21.3, 21.66, 22.12, 22.5, 23.0, 23.6, 24.3, 25.2, 26.4, 27.8];
const shotBat = [5, 6, 4, 7, 3, 8, 5, 6, 4, 7, 2, 8];
const fx = {
  fires: [
    // the Big Black bridge burning (the retreating Confederates fire it) as the march comes up
    { region: WIDE, at: [1512.4, 683.6, 0.6], t0: 38.2, t1: T.D + 1, cue: 41.3, preset: "column", opts: { size: 24, flameK: 1.3, tongues: 4, smokeRate: 7, smokeS0: 0.4, smokeGrow: 1.2, smokeAlpha: 0.7 } },
  ],
  guns: [
    // frame 1: the bluff batteries fire at the gunboat in the bend (wide)
    { region: WIDE, preset: "battery", h: 0.8, boom: false, opts: { size: 4.2, alpha: 0.4, flash: 2.3, flashLife: 0.2 }, shots: wideShots, impactOpts: { size: 3.4 } },
    // close: "Its guns stood on high bluffs over the river" (flash + plume x3, shot falls in the river)
    { region: VB, preset: "battery", h: 0.25, boom: false, opts: { dir: [-1, 0.08], size: 2.2, alpha: 0.3, flash: 1.3, flashLife: 0.16 },
      shots: shotTimes.map((t, i) => { const b = BAT[shotBat[i]], r = frontAt(b.z + 1.5 + (i % 3)); return { t, at: [b.x, b.z], dir: [-1, 0.06 * ((i % 3) - 1)],
        impact: [r[0] - 1.2 - (i % 4) * 0.6, r[1], 0.05], delay: 0.8 }; }), impactOpts: { size: 0.9 } },
  ],
  _custom: [
    // "the Mississippi was closed": a red band running down the river from the hairpin past the city front (flat unlit sprites, #be3a2a)
    { region: VB, fn: (t, push) => { if (!WW || t < T.closed - 0.2 || t > CUT + 0.1) return; const e = sstep(T.closed - 0.2, T.closed + 0.6, t) * (1 - sstep(31.2, 32.4, t));
      for (let i = 0; i < RIVC.length; i++) { const p = RIVC[i]; if (p[0] < 1340 || p[1] > 716) continue; const s = i / RIVC.length, run = sstep(-0.05, 0.1, (t - T.closed) * 0.55 - (s - 0.45));
        const pulse = 0.8 + 0.2 * Math.cos(((t - T.closed) * 1.1 - s * 3) * 6.283);
        push(p[0], waterY(VB, p[2]) + 0.05, p[1], 7.5, 0.2 * e * run * pulse, RED[0], RED[1], RED[2], 6, 2); } } },
    // the end: the river glows Union blue from Vicksburg south (#2c57b7, flat unlit sprites, not additive)
    { region: WIDE, fn: (t, push) => { if (!WW || t < T.campaign - 0.5) return; const k = sstep(T.campaign - 0.5, T.two, t);
      for (let i = 0; i < RIVW.length; i += 4) { const p = RIVW[i]; if (p[1] < 676 || p[1] > 1110) continue; const s = (p[1] - 676) / 434; if (s > k * 1.05) continue;
        const a = 0.5 * sstep(s, s + 0.06, k * 1.05) * (0.9 + 0.1 * Math.sin(t * 2.1 + p[1] * 0.05)); push(p[0], waterY(WIDE, p[2]) + 0.3, p[1], 20, a, BLUE[0], BLUE[1], BLUE[2], 6, 2); } } },
  ],
};

// ---------------- white flags over the city (wide map, on "stacked their arms") + the FAILED stamp ----------------
const FLAGS = [[1386, 676], [1393, 690], [1381, 688]];
const build = async (ctx) => { WW = ctx.world; const { THREE, world } = ctx, sc = world.regions[WIDE].scene;
  for (const c of fx._custom) ctx.FX[c.region].custom(c.fn);   // (fx.custom is not in the engine's grouped fx kinds: added here)
  const poleM = new THREE.MeshLambertMaterial({ color: 0x3a3026 }), clothM = new THREE.MeshBasicMaterial({ color: 0xece8dc, side: THREE.DoubleSide });
  ctx._flags = FLAGS.map(([x, y], i) => { const g = new THREE.Group(), h0 = world.heightAt(x, y, WIDE), H = 11;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, H, 6), poleM); pole.position.y = H / 2; g.add(pole);
    const cloth = new THREE.Mesh(new THREE.PlaneGeometry(6, 4, 6, 1), clothM); cloth.position.set(3.0, H - 2.1, 0); g.add(cloth);
    g.position.set(x, h0, y); g.rotation.y = -0.25 + i * 0.2; g.visible = false; sc.add(g); return { g, cloth, i }; });
  // set BEFORE the frame renders (S.draw runs after the render): an fx custom emitter of the wide region is updated in beforeRender
  ctx.FX[WIDE].custom((t) => { for (const f of ctx._flags) { const t0 = T.stacked + 0.1 + f.i * 0.25, k = sstep(t0, t0 + 0.5, t);
    f.g.visible = k > 0.01; f.g.scale.set(1, Math.max(0.01, k), 1); f.cloth.rotation.y = 0.18 * Math.sin(t * 2.6 + f.i); } });
  // the red FAILED stamp over the stopped thrusts (DOM, pinned to the ground, a pure function of t)
  const st = document.createElement("div");
  st.style.cssText = "position:absolute;left:0;top:0;font-family:'GM Cinzel',Cinzel,serif;font-weight:700;letter-spacing:.16em;font-size:30px;color:#B3261C;padding:4px 14px 2px;border:3px solid #B3261C;border-radius:4px;background:rgba(236,228,206,.82);opacity:0;pointer-events:none;white-space:nowrap";
  st.textContent = "FAILED"; document.getElementById("pins").appendChild(st); ctx._stamp = st; };
const draw = (t, ctx) => { const st = ctx._stamp; if (!st) return; const t0 = T.failed, a = sstep(t0, t0 + 0.12, t) * (1 - sstep(33.05, 33.45, t));
  if (a <= 0.001 || ctx.world.cameraAt(t).region !== VB) { st.style.opacity = "0"; return; }
  const p = ctx.world.projectMap(1352, 690, 0), sc = 1 + 1.3 * (1 - sstep(t0, t0 + 0.24, t));
  st.style.opacity = a.toFixed(3); st.style.transform = `translate(${(p.x - 70).toFixed(1)}px,${(p.y - 26).toFixed(1)}px) rotate(-7deg) scale(${sc.toFixed(3)})`; };

window.SEQ = {
  name: "S01", D: T.D, T, seed: 1863, date: "1863-04-01",
  regions: [WIDE, VB],
  regionOpts: { [WIDE]: { troopScale: 16 }, [VB]: { troopScale: 1.3 } },
  keys: [
    // ONE continuous push-in from altitude down the river onto the city (lands on "Vicksburg"), still drifting in when the dive starts
    { t: 0.0, region: WIDE, at: [1400, 730], dist: 540, tilt: 36, yaw: 1, fov: 30 },
    { t: 3.6, region: WIDE, at: [1384, 712], dist: 450, tilt: 41, yaw: -1, fov: 30, ease: "in" },
    { t: 7.9, region: WIDE, at: [1394, 693], dist: 300, tilt: 47, yaw: -6, fov: 30, ease: "out" },
    // (dive push key at 9.5 = from), then a slow straight push under the title, then the dive accelerates into the deck
    { t: 12.8, region: WIDE, at: [1396, 691], dist: 222, tilt: 45, yaw: -8, fov: 30, ease: "lin" },
    // the emergence lands at 19.75 on the city front; drift south along the river (the red river), then west over De Soto Point
    { t: 24.6, region: VB, at: [1377, 688], dist: 47, tilt: 51, yaw: -10, fov: 32 },
    { t: 29.8, region: VB, at: [1355, 696], dist: 50, tilt: 49, yaw: -1, fov: 32 },
    { t: CUT, region: VB, at: [1354, 697], dist: 50, tilt: 49, yaw: 0, fov: 32 },
    // montage: short close shots joined by dissolves
    { t: CUT, region: WIDE, at: [1172, 1010], dist: 200, tilt: 46, yaw: 0, fov: 30, ease: "cut", dissolve: 0.6 },
    { t: 36.9, region: WIDE, at: [1200, 1006], dist: 230, tilt: 46, yaw: 0, fov: 30 },
    { t: X1 - 0.05, region: WIDE, at: [1400, 920], dist: 420, tilt: 45, yaw: 0, fov: 30 },
    { t: X1, region: WIDE, at: [1756, 712], dist: 390, tilt: 46, yaw: 0, fov: 30, ease: "cut", dissolve: 0.4 },
    { t: X2 - 0.05, region: WIDE, at: [1746, 710], dist: 370, tilt: 46, yaw: -1, fov: 30 },
    { t: X2, region: WIDE, at: [1522, 686], dist: 190, tilt: 48, yaw: -4, fov: 30, ease: "cut", dissolve: 0.4 },
    { t: X3 - 0.05, region: WIDE, at: [1512, 687], dist: 180, tilt: 48, yaw: -5, fov: 30 },
    { t: X3, region: WIDE, at: [1412, 690], dist: 270, tilt: 47, yaw: -3, fov: 30, ease: "cut", dissolve: 0.4 },
    { t: 48.6, region: WIDE, at: [1402, 692], dist: 245, tilt: 48, yaw: -4, fov: 30 },
    // pull back over the whole valley
    { t: T.D, region: WIDE, at: [1420, 805], dist: 600, tilt: 38, yaw: 1, fov: 30 },
  ],
  dives: [{ t: SWT, off: OFF, over: [1392, 690],
    from: { region: WIDE, at: [1395, 692], dist: 268, tilt: 47, yaw: -7 },
    to: { region: VB, at: [1379.0, 686.0], dist: 44, tilt: 52, yaw: -14, fov: 32 },
    keys: { push: { ease: "lin" }, deck: { yaw: -6 }, swFrom: { yaw: -8 }, swTo: { yaw: -10 }, emerge: { yaw: -12, tilt: 40 } } }],
  clouds: {
    [WIDE]: { keepClear: [[1392, 688, 80, 0.9, 0.8], [1340, 670, 60, 1, 0.8], [1190, 1000, 90, 1, 0.8], [1520, 690, 60, 1, 0.7], [1890, 724, 60, 1, 0.6], [1450, 905, 70, 1, 0.7], [1740, 712, 90, 1, 0.8], [1610, 700, 50, 1, 0.6], [1505, 715, 70, 1, 0.8]] },
    [VB]: { shadows: true },
  },
  title: { text: "5 BATTLES · 18 DAYS", font: "cinzel-latin-700-normal.woff2", width: 0.56, tOn: T.eighteen, tGrow: T.days + 0.4, anchorT: 10.0, region: WIDE },
  units, arrows,
  labels: [
    { text: "Mississippi River", at: [1300, 645], size: 20, t0: T.miss, t1: T.miss + 3.6, region: WIDE, river: true },
    { text: "Vicksburg", town: "Vicksburg", size: 28, t0: T.vicksburg, t1: T.eighteen - 0.3, region: WIDE },
    { text: "Mississippi River", at: [1369.5, 699], size: 18, t0: T.miss2, t1: T.miss2 + 3.4, region: VB, river: true },
    { text: "Vicksburg", town: "Vicksburg", size: 24, t0: T.vb3, t1: T.vb3 + 3.5, region: WIDE },
  ],
  boats: [{ region: WIDE, kind: "gunboat", n: 1, size: 6.0, path: GBPATH, sAt: (t) => gbS(t), t0: -1, t1: DV.deckIn, lamp: false, wake: true }],
  fx, build, draw,
  overlay: [
    ["plaque.date", T.spring, { month: "Spring 1863", day: "", weekday: "", note: "the Mississippi valley" }],
    ["number", T.thirty, T.stacked - 0.2, { value: 29500, round: 500, world: [1398, 662], size: 96 }],
  ],
  grade: {},
};
})();
