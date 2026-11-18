// S12 The siege and the surrender (June - 9 July 1863) + the END. D = 142.19 s (tools/scene_times.py S12). Regions: siege + wide.
// A  0-21.65  siege world from above: the Union approach trenches zigzag up the slopes toward the forts (time-lapse, JUNE); night: gunboats
//             and mortar boats on the river shell the town (high arcing fuses, bursts, two houses burn); the town's hillsides: caves with lamp
//             light, townspeople; "mule meat" on the plaque.
// B  21.65-39.4 25 June, a little after 3 p.m.: the mine under the 3rd Louisiana Redan (engineer's journal 2,200 lb): blast, dirt thrown up,
//             crater; two Union regiments rush into the crater and are held there by the inner Confederate line.
// C  39.4-54.6 the town's newspaper on wallpaper (custom card): "First ketch your rabbit." (as Grant quotes it, GM ch. XXXVIII)
// D  54.6-78.5 3 July: white flags along the Confederate works; 3 p.m. Grant and Pemberton meet near a stunted oak between the lines
//             (cards facing); night: the terms (parole) as a letter card (the substance, no quote marks).
// E  78.5-99.8 4 July 10 a.m.: the garrison marches out, stacks arms (boxes turn grey + grey stacks left), marches back; the blue line silent;
//             ~29,500; "Without a cheer" (GM); the last issue: "caught our rabbit".
// F  99.8-119.6 wide: 9 July Port Hudson (bottom-edge label), the whole river glows blue, "cut in two", Gettysburg (small label far east),
//             Lincoln's line (letter to James C. Conkling, 26 August 1863).
// G  119.6-142.19 END: dusk, slow pull-up over the river; Grant medallion; seven gunboats run past the city again (memory); the campaign
//             ledger; fade to black over the last 2.5 s.
// Facts: research/FACT_NOTES.md sections 12-13 (siege, mine, newspaper, meeting, parole, numbers, Port Hudson, Lincoln).
(() => {
const T = { D: 142.19, dug: 1.06, trenches: 2.28, zig: 2.70, forts: 4.60, closer: 5.28, week: 5.96, while: 6.68, gunboats: 6.92, mortar: 7.75,
  shelled: 8.48, town: 9.00, river: 9.70, inside: 10.68, people: 11.54, dug2: 12.56, hillsides: 13.76, living: 14.76, caves: 15.28, shells: 16.58,
  food: 17.90, ranOut: 18.25, garrison: 19.66, mule: 20.40, meat: 20.80,
  june25: 22.59, little: 23.88, three: 24.36, afternoon: 25.16, union: 25.70, engineers: 26.56, blew: 27.36, mine: 27.88, forts2: 28.96,
  explosion: 30.26, threw: 30.75, top: 31.42, hill: 31.94, air: 32.66, crater: 33.62, rushed: 35.54, held: 36.64, siege: 37.98, on: 38.62,
  newspaper: 40.47, printed: 41.66, wallpaper: 42.84, mocked: 44.32, yankee: 44.86, dine: 46.26, fourth: 48.09, best: 49.82, recipe: 50.12,
  rabbit: 51.50, first: 52.92, catch: 53.25, rabbit2: 53.84,
  third: 55.38, july3: 55.69, white: 56.60, flags: 56.73, works: 58.42, afternoon3: 59.80, grant: 60.88, pemberton: 61.19, met: 61.66,
  hillside: 62.19, lines: 63.23, near: 64.08, stunted: 64.50, oak: 64.92, served: 66.50, mexican: 68.34, war: 68.73, night: 69.95, terms: 71.14,
  parole: 72.40, each: 73.23, promise: 74.45, exchanged: 76.21, home: 77.58,
  ten: 79.25, fourth4: 80.73, garrison4: 82.12, marched: 83.38, out: 83.78, stacked: 85.10, arms: 85.66, back: 86.82, some: 88.19,
  twentyNine: 88.73, men: 90.08, grant4: 91.25, watched: 93.02, cheer: 94.04, last: 95.26, newspaper4: 96.28, caught: 98.50, rabbit4: 98.99,
  five: 100.23, port: 101.28, surrendered: 101.76, whole: 103.47, union9: 104.45, confederacy: 105.73, cut: 106.64, two: 107.06,
  sameDays: 108.34, far: 109.38, east: 109.84, lee: 110.90, beaten: 111.92, gettysburg: 112.49, father: 113.92, lincoln: 115.42, sea: 118.88,
  for: 119.97, grantE: 120.14, road: 121.54, command: 123.82, army: 124.66, appomattox: 127.32, began: 128.92, dark: 129.73, seven: 130.99,
  gunboatsE: 131.38, burning: 132.52, cotton: 133.64, idea: 134.86, madness: 137.45, hands: 104.78 };
const S = "siege", W = "wide";
const CUT_B = 21.65, CUT_E = 78.5, CUT_F = 99.8;   // paragraph changes (21.38/21.93, 78.22/78.77, 99.53/100.08)
const FADE = T.D - 2.5;
const CB0 = 129.55, CB1 = 135.0;
// round 3 (critic A N3: giant toy gunboats, the last cut by the edge): size 0.3 (x0.4), 2.0 units nose to nose, the column (12 units)
// centred on the camera's track (camera y 670 -> 676 over the shot)
const CB_S = (t, i) => S_CITY + (t - 132.3) * 1.2 + 5.0 - i * 2.0;   // round 2: the callback (16 April: the gunboats run past the city at night) on "It began on a dark river"
const sstep = VX.sstep, lerp = VX.lerp, hsh = VX.hsh, clamp = VX.clamp;
const P = (n) => VX.place(n), TW = (n) => VX.town(n, W);
const PI = Math.PI;
const WK = (i) => VX.work(S, i);
const STOCKADE = [1406.6, 667.6], LA3 = [1409.0, 672.9], GREAT = [1407.0, 675.0], TEX2 = [1403.3, 680.4], RRR = [1400.5, 686.4];
const OAK = P("Surrender interview site");   // (1407.9, 674.4)

// ---------------- the approach trenches (A: grow over the weeks; stay for the rest of the siege) ----------------
const zig = (a, b, amp = 0.26, leg = 0.5) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(2, Math.round(L / leg)), dx = (b[0] - a[0]) / L, dy = (b[1] - a[1]) / L;
  const out = [a]; for (let i = 1; i < n; i++) { const s = i / n, side = i % 2 ? 1 : -1; out.push([a[0] + (b[0] - a[0]) * s - dy * amp * side, a[1] + (b[1] - a[1]) * s + dx * amp * side]); } out.push(b); return out; };
const APPROACH = [
  zig([1411.2, 664.4], [1407.4, 666.9]), zig([1412.6, 672.2], [1409.7, 672.85]), zig([1410.6, 676.8], [1407.7, 675.3]),
  zig([1406.8, 681.8], [1404.0, 680.6]), zig([1403.8, 688.6], [1401.1, 686.9]), zig([1398.8, 695.0], [1395.6, 693.1]),
];
const growK = (i, t) => sstep(0.8 + 0.22 * i, 6.0 + 0.12 * i, t);

// ---------------- units ----------------
const RED_LINE = [[1399.4, 663.9, -1.25], [1405.3, 667.5, -0.55], [1407.7, 672.9, 0.0], [1406.0, 675.3, 0.05], [1402.0, 680.5, 0.25], [1399.3, 686.4, 0.35], [1395.0, 690.9, 0.6], [1386.6, 697.4, 0.9], [1377.2, 705.0, 1.0]];
const RED_GUNS = [[1404.6, 669.3, -0.3], [1405.0, 676.6, 0.0], [1399.0, 684.6, 0.35]];
const BLUE_LINE = [[1411.4, 665.4, 2.85], [1412.4, 663.0, 2.5], [1400.8, 660.6, 1.75], [1411.6, 670.8, PI], [1409.8, 676.6, PI], [1406.0, 680.9, PI], [1403.0, 687.4, 3.0], [1399.6, 692.4, 2.6]];
const BLUE_GUNS = [[1413.2, 668.4], [1414.2, 674.8], [1409.0, 683.6], [1406.4, 689.4]];
const T_OUT = T.marched - 0.1, T_STACK = T.stacked, T_BACK = T.marched + 3.3;   // 4 July
const units = [];
// the garrison: in its works all siege long; 4 July: out ~1.5 units, arms stacked (grey), back again (grey: disarmed, paroled)
RED_LINE.forEach(([x, y, f], k) => { const ox = Math.cos(f) * 1.5, oy = Math.sin(f) * 1.5, d = k * 0.12;
  // the 3rd Louisiana Redan: its front garrison goes up with the mine (25 June); the inner line holds
  if (k === 2) { units.push({ region: S, side: "r", type: "inf", n: 2, face: f, keys: [[0, x + 0.7, y]], t1: T.mine + 0.25 }); }
  units.push({ region: S, side: "r", type: "inf", n: 3, face: f, cap: T_STACK + d, keys: [[0, x, y], [T_OUT + d, x, y], [T_STACK - 0.3 + d, x + ox, y + oy], [T.back + d, x + ox, y + oy], [T_BACK + 1.2 + d, x, y]] });
  // the stacked arms, left on the ground in front of the works
  units.push({ region: S, side: "r", type: "art", n: 3, face: f, t0: T_STACK + d, cap: T_STACK - 1 + d, keys: [[0, x + ox * 1.25, y + oy * 1.25]], bw: 0.32, bd: 0.22, wob: 0 }); });
RED_GUNS.forEach(([x, y, f], k) => units.push({ region: S, side: "r", type: "art", n: 2, face: f, cap: T_STACK + 0.4 + k * 0.2, keys: [[0, x, y]] }));
BLUE_LINE.forEach(([x, y, f]) => units.push({ region: S, side: "u", type: "inf", n: 3, face: f, keys: [[0, x, y]] }));
for (const u of units) if (u.region === S && (u.t1 == null || u.t1 > CUT_F)) u.t1 = CUT_F + 0.3;   // nothing of the siege in the April callback
BLUE_GUNS.forEach(([x, y]) => units.push({ region: S, side: "u", type: "art", n: 2, face: PI, keys: [[0, x, y]] }));
// the sap heads: a blue box at the head of each approach, digging forward with it
APPROACH.forEach((Z, i) => { const L = VX.len(Z), keys = []; for (let t = 0; t <= 6.6; t += 0.3) { const p = VX.along(Z, growK(i, t) * L); keys.push([+t.toFixed(2), p[0], p[1], "lin"]); }
  units.push({ region: S, side: "u", type: "inf", n: 1, face: Math.atan2(Z[Z.length - 1][1] - Z[0][1], Z[Z.length - 1][0] - Z[0][0]), keys, t1: 7.0, bw: 0.55 }); });
// 25 June: Leggett's brigade in the sap; two regiments rush the crater and are held there
units.push({ region: S, side: "u", type: "inf", n: 3, face: PI, t0: CUT_B - 0.1, t1: 39.6, keys: [[0, 1411.4, 673.6]] });
units.push({ region: S, side: "u", type: "inf", n: 2, face: PI, t0: CUT_B - 0.1, t1: 39.6, keys: [[0, 1410.6, 672.5], [T.rushed - 0.1, 1410.6, 672.5], [T.held - 0.2, 1409.25, 672.9]] });

// ---------------- boats + mortar shells (A, night) ----------------
const RIV = VX.river(S, 0).pts.map((p) => [p[0], p[1]]);
const sNear = (x, y) => { let best = 0, bd = 1e9, s = 0; for (let i = 1; i < RIV.length; i++) { s += Math.hypot(RIV[i][0] - RIV[i - 1][0], RIV[i][1] - RIV[i - 1][1]); const d = Math.hypot(RIV[i][0] - x, RIV[i][1] - y); if (d < bd) { bd = d; best = s; } } return best; };
const MORTAR_S = [sNear(1376.6, 683.5), sNear(1375.6, 688.0), sNear(1374.4, 692.4)], GUNBOAT_S = [sNear(1373.2, 697.6), sNear(1371.6, 701.4)];
const boatXY = (s) => VX.along(RIV, s);
const S_CITY = sNear(1381.0, 670.6);
const TOWN_HITS = [[1385.6, 676.4], [1388.2, 682.0], [1384.4, 686.4], [1389.6, 673.0], [1386.4, 690.2], [1390.6, 678.6], [1383.2, 681.2], [1387.6, 687.6], [1385.0, 671.8], [1389.0, 684.8], [1386.0, 679.4], [1388.4, 675.2]];
const SHOT_T = [7.1, 7.8, 8.5, 9.1, 9.9, 10.6, 11.5, 12.3, 13.4, 14.5, 15.7, 16.9];
const SHELLS = SHOT_T.map((t, i) => { const mortar = i % 4 !== 3, s = mortar ? MORTAR_S[i % 3] : GUNBOAT_S[i % 2], b = boatXY(s), tg = TOWN_HITS[i];
  return { t, at: [b[0], b[1]], impact: tg, delay: mortar ? 2.2 : 0.9, arc: mortar ? 7.5 : 1.2 }; });

// ---------------- custom sprites ----------------
let WD = null;
const gh = (x, y, h = 0) => WD.heightAt(x, y, S) + h;
const lamp = (t, push, x, y, a) => push(x, gh(x, y, 0.15), y, 0.7, a * (0.85 + 0.15 * Math.sin(t * 9 + x * 7)), 1.0, 0.6, 0.25);
let CAVES = [];
const custom = [
  // the mortar shells' burning fuses on their high arcs (silent: the gun / boom cues come from fx.guns)
  { region: S, fn: (t, push) => { if (!WD || t < 7 || t > CUT_B) return; for (const sh of SHELLS) { const u = (t - sh.t) / sh.delay; if (u < 0 || u > 1) continue;
    for (let k = 0; k < 7; k++) { const uu = u - k * 0.022; if (uu < 0) break; const x = lerp(sh.at[0], sh.impact[0], uu), y = lerp(sh.at[1], sh.impact[1], uu);
      const h = lerp(gh(sh.at[0], sh.at[1], 0.3), gh(sh.impact[0], sh.impact[1], 0.1), uu) + sh.arc * 4 * uu * (1 - uu);
      push(x, h, y, k ? 0.55 - k * 0.05 : 0.9, (k ? 0.6 * (1 - k / 7) : 1.0), 1.3, 0.75, 0.3); } } } },
  // lamps in the caves (night) and the river reflections of the burning houses
  { region: S, fn: (t, push) => { if (!WD || t < 12.4 || t > CUT_B + 0.1) return; for (const c of CAVES) { const e = sstep(c.t0, c.t0 + 0.8, t); if (e > 0) lamp(t, push, c.at[0], c.at[1], 0.55 * e); } } },
  // the mine (round 2, critic A: was a static pale pillar for ~15 s): a burst of dark earth and clods thrown up and falling back within ~3 s,
  // then grey smoke that drifts off east with the wind and thins out over ~6 s, leaving the crater (decal) by ~36 s
  { region: S, fn: (t, push) => { const tb = 27.95; if (!WD || t < tb || t > tb + 9) return; const age = t - tb, c = LA3, g0 = gh(c[0], c[1], 0.1);
    for (let j = 0; j < 60; j++) { const a = hsh(j, 1) * 6.283, sp = 0.3 + hsh(j, 2) * 1.0, vu = 3.0 + hsh(j, 3) * (j < 25 ? 6.0 : 3.0), dl = hsh(j, 4) * 0.15, ag = age - dl; if (ag < 0) continue;
      const h = vu * ag - 2.9 * ag * ag; if (h < -0.1 || ag > 3.4) continue;   // ballistic: up and back down
      const r = sp * (1 - Math.exp(-ag * 1.6)), x = c[0] + Math.cos(a) * r, y = c[1] + Math.sin(a) * r * 0.8;
      const col = 0.1 + hsh(j, 5) * 0.06, al = 0.9 * sstep(0, 0.08, ag) * (1 - sstep(1.8, 3.2, ag));
      push(x, g0 + Math.max(0, h), y, 0.45 + ag * 0.35 + hsh(j, 7) * 0.35, al, col + 0.05, col + 0.02, col - 0.02, 6, 4.0); }
    for (let j = 0; j < 22; j++) { const a = hsh(j, 11) * 6.283, v = 0.8 + hsh(j, 12) * 1.8, vu = 5 + hsh(j, 13) * 5, ag = age; const h = vu * ag - 4.9 * ag * ag; if (h < -0.05) continue;
      push(c[0] + Math.cos(a) * v * ag, g0 + h, c[1] + Math.sin(a) * v * ag * 0.8, 0.12, 0.95, 0.12, 0.1, 0.08, 6, 4.0); }
    for (let j = 0; j < 36; j++) { const ag = age - 0.4 - hsh(j, 21) * 1.4; if (ag < 0) continue;   // the smoke: grey, rising slowly, drifting east, thinning
      const a = hsh(j, 22) * 6.283, r = 0.3 + hsh(j, 23) * 0.9, x = c[0] + Math.cos(a) * r + ag * 0.42, y = c[1] + Math.sin(a) * r * 0.8 - ag * 0.08;
      const h = 0.6 + hsh(j, 24) * 2.2 + ag * 0.45, g = 0.36 + hsh(j, 25) * 0.08, al = 0.5 * sstep(0, 0.6, ag) * (1 - sstep(2.5, 6.5, ag));
      push(x, g0 + h, y, 1.0 + ag * 0.45, al, g, g, g + 0.02, 6, 4.0); }
    if (age < 0.5) push(c[0], g0 + 0.6, c[1], 3.5 * (1 - age), 1.0 * (1 - age * 2), 1.3, 0.75, 0.35); } },
];

// ---------------- 3D extras (build): the approach-trench ribbons, the crater ----------------
const build = async (ctx) => { WD = ctx.world; const { THREE, world } = ctx, sc = world.regions[S].scene;
  for (const c of custom) ctx.FX[c.region].custom(c.fn);
  // caves: the steepest spots of the town's hillsides (deterministic search on the height field)
  { const cand = []; for (let x = 1383.0; x <= 1394.5; x += 0.35) for (let y = 669.0; y <= 692.0; y += 0.35) {
      const gx = world.heightAt(x + 0.2, y, S) - world.heightAt(x - 0.2, y, S), gy = world.heightAt(x, y + 0.2, S) - world.heightAt(x, y - 0.2, S); if (gx < -0.4 * Math.hypot(gx, gy)) cand.push([Math.hypot(gx, gy), x, y]); }
    cand.sort((a, b) => b[0] - a[0]); const pick = [];
    for (const [, x, y] of cand) { if (pick.length >= 14) break; if (pick.every((p) => Math.hypot(p[0] - x, p[1] - y) > 1.3)) pick.push([x, y]); }
    CAVES = pick.map((p, i) => ({ at: p, t0: T.dug2 + 0.2 + (i % 7) * 0.32 + Math.floor(i / 7) * 0.9 }));
    CAVE_M = VX.markers([...CAVES.map((c) => ({ region: S, icon: CAVE_SVG, at: c.at, t0: c.t0, t1: CUT_B + 0.05, size: 0.36, min: 10, max: 30, fadeOut: 0.2 })),
      ...CAVES.filter((_, i) => i % 3 === 0).map((c, i) => ({ region: S, icon: "person", color: "#d8c8a4", at: [c.at[0] + 0.3, c.at[1] + 0.25], t0: T.living + 0.2 + i * 0.25, t1: CUT_B + 0.05, size: 0.3, min: 8, max: 20, fadeOut: 0.2 }))]);
    CAVE_M.build(ctx); }
  OAK_M.build(ctx); FLAGS.build(ctx);
  // trench ribbons: a dark cut + a pale parapet on the enemy side, draped on the ground; grown by draw range in a custom emitter (before render)
  const dark = new THREE.MeshLambertMaterial({ color: 0x3e3123, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
  const pale = new THREE.MeshLambertMaterial({ color: 0xcfbb92, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
  const ribbon = (pts, w, off) => { const q = []; const L = VX.len(pts); for (let s = 0; s <= L + 1e-6; s += 0.05) q.push(VX.along(pts, Math.min(s, L)));
    const pos = []; for (let i = 0; i < q.length - 1; i++) { const a = q[i], b = q[i + 1], nx = -a[3], ny = a[2], l = Math.hypot(nx, ny) || 1;
      const ux = nx / l, uy = ny / l, P0 = (p, s) => [p[0] + ux * (off + s * w / 2), p[1] + uy * (off + s * w / 2)];
      const A1 = P0(a, -1), A2 = P0(a, 1), B1 = P0(b, -1), B2 = P0(b, 1), H = (p) => world.heightAt(p[0], p[1], S) + 0.045;
      pos.push(A1[0], H(A1), A1[1], B1[0], H(B1), B1[1], A2[0], H(A2), A2[1], A2[0], H(A2), A2[1], B1[0], H(B1), B1[1], B2[0], H(B2), B2[1]); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return { g, n: q.length - 1 }; };
  const TR = APPROACH.map((Z, i) => { const r1 = ribbon(Z, 0.22, 0), r2 = ribbon(Z, 0.14, 0.2); const m1 = new THREE.Mesh(r1.g, dark), m2 = new THREE.Mesh(r2.g, pale);
    m1.renderOrder = 2; m2.renderOrder = 2; sc.add(m1); sc.add(m2); return { i, r1, r2 }; });
  // the crater: a dark bowl with a pale thrown-up rim (canvas texture on a flat disc just above the ground)
  const cv = document.createElement("canvas"); cv.width = cv.height = 128; const g2 = cv.getContext("2d"), gr = g2.createRadialGradient(64, 64, 4, 64, 64, 62);
  gr.addColorStop(0, "rgba(38,28,20,0.95)"); gr.addColorStop(0.5, "rgba(70,54,38,0.9)"); gr.addColorStop(0.72, "rgba(176,150,112,0.85)"); gr.addColorStop(0.86, "rgba(150,126,92,0.55)"); gr.addColorStop(1, "rgba(150,126,92,0)");
  g2.fillStyle = gr; g2.fillRect(0, 0, 128, 128);
  const crater = new THREE.Mesh(new THREE.CircleGeometry(0.75, 40), new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }));
  crater.rotation.x = -PI / 2; crater.position.set(LA3[0], world.heightAt(LA3[0], LA3[1], S) + 0.12, LA3[1]); crater.renderOrder = 3; crater.visible = false; sc.add(crater);
  ctx.FX[S].custom((t) => { for (const r of TR) { const k = growK(r.i, t); r.r1.g.setDrawRange(0, Math.round(r.r1.n * k) * 6); r.r2.g.setDrawRange(0, Math.round(r.r2.n * k) * 6); }
    const kc = sstep(28.2, 29.6, t); crater.visible = kc > 0; crater.material.opacity = kc; crater.scale.setScalar(0.6 + 0.4 * kc); });
  // the newspaper cards (DOM, over the overlay)
  PAPER.build(ctx);
  // round 2 (critic B: "the whole river in Union hands" read white/cyan): a Union-blue (#2c57b7) ribbon on the wide river, north of the city
  // at once, then grown south from the city to the Gulf edge on "the whole river ... Union hands"
  { const ww = world.regions[W], RWp = VX.river(W, 0).pts, q = []; for (let i = 0; i < RWp.length; i += 2) q.push(RWp[i]);
    const iC = q.reduce((b, p, i) => (Math.hypot(p[0] - 1377, p[1] - 672) < Math.hypot(q[b][0] - 1377, q[b][1] - 672) ? i : b), 0);
    const mk = (pts) => { const pos = [], Wd = 3.6; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ux = -dy / l * Wd / 2, uy = dx / l * Wd / 2;
        const H = (p) => p[2] * ww.ys + 0.35; pos.push(a[0] - ux, H(a), a[1] - uy, b[0] - ux, H(b), b[1] - uy, a[0] + ux, H(a), a[1] + uy, a[0] + ux, H(a), a[1] + uy, b[0] - ux, H(b), b[1] - uy, b[0] + ux, H(b), b[1] + uy); }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); return { g, n: pts.length - 1 }; };
    const north = mk(q.slice(0, iC + 1)), south = mk(q.slice(iC));
    const mat = new THREE.MeshBasicMaterial({ color: 0x2c57b7, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 });
    const mN = new THREE.Mesh(north.g, mat), mS = new THREE.Mesh(south.g, mat); mN.renderOrder = mS.renderOrder = 4; ww.scene.add(mN); ww.scene.add(mS);
    ctx.FX[W].custom((t) => { const on = t > T.whole - 0.5; mN.visible = mS.visible = on; if (!on) return;   // stays to the end ("the Mississippi open")
      const k = sstep(T.whole - 0.2, T.hands + 0.6, t); south.g.setDrawRange(0, Math.round(south.n * k) * 6);
      mat.opacity = 0.75 * sstep(T.whole - 0.5, T.whole + 0.4, t) * (0.9 + 0.1 * Math.sin(t * 2.4)); }); }
  // round 2 (critics A/B: finale muddy dark, no sunset): a warm low sun from the west (upper left) over the wide dusk shots
  SUN = document.createElement("div"); SUN.style.cssText = "position:absolute;inset:0;pointer-events:none;opacity:0;mix-blend-mode:screen;" +
    "background:radial-gradient(ellipse 75% 85% at 4% 10%,rgba(255,176,96,.62) 0%,rgba(240,140,70,.26) 38%,rgba(200,110,60,.08) 62%,rgba(0,0,0,0) 80%)";
  document.getElementById("veil").after(SUN);
};
let SUN = null;
const draw = (t, ctx) => { if (CAVE_M) CAVE_M.draw(t, ctx); OAK_M.draw(t, ctx); FLAGS.draw(t, ctx); PAPER.draw(t);
  if (SUN) SUN.style.opacity = (sstep(T.for - 0.4, T.road + 1.0, t) * (1 - sstep(CB0 - 0.4, CB0, t)) + sstep(CB1, CB1 + 0.8, t)).toFixed(3); };
let CAVE_M = null;
const CAVE_SVG = '<svg viewBox="0 0 22 15"><path d="M1 15 Q1 2.5 11 2.5 Q21 2.5 21 15 Z" fill="#17100b" stroke="#bfa57a" stroke-width="1.4"/><ellipse cx="11" cy="12" rx="4.6" ry="2.6" fill="#ffb052" opacity=".6"/></svg>';
const OAK_SVG = '<svg viewBox="0 0 40 40"><path d="M19 40 L19.5 26 Q17 22 13 21 M20 27 Q23 22 27 20" stroke="#3b2a1a" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
  '<g fill="#4f6a35" stroke="#24301a" stroke-width="1"><circle cx="13" cy="18" r="7"/><circle cx="26" cy="17" r="7.5"/><circle cx="20" cy="12" r="8"/><circle cx="29" cy="22" r="4.5"/></g>' +
  '<g fill="#6f8a4a"><circle cx="17" cy="9" r="3"/><circle cx="24" cy="12" r="2.6"/></g></svg>';
const OAK_M = VX.markers([{ region: S, icon: OAK_SVG, at: OAK, t0: T.near, t1: 69.6, size: 0.9, min: 26, max: 70, h: 0 }]);

// ---------------- flags (DOM markers pinned to the pole base; rise, fall) ----------------
const FLAG_SVG = '<svg viewBox="0 0 30 44"><rect x="1.2" y="0" width="2" height="44" fill="#3a2c1e"/><path d="M3.2 1.5 L28 2.5 Q25 9 28 17 L3.2 17.5 Z" fill="#f4f1e8" stroke="#2a2418" stroke-width="0.8"/></svg>';
const FLAGS = (() => { const list = [[1399.0, 664.6], [1405.8, 668.4], [1408.5, 672.0], [1406.4, 674.4], [1402.6, 679.8], [1399.8, 685.6], [1395.0, 692.0], [1386.4, 698.4]]
  .map((p, i) => ({ at: p, t0: T.white + 0.05 + i * 0.22, t1: 95.5 })); const F = { items: [] };
  F.build = () => { const PN = document.getElementById("pins"); for (const f of list) { const e = document.createElement("div");
    e.style.cssText = "position:absolute;left:0;top:0;opacity:0;pointer-events:none;transform-origin:7% 100%;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))";
    e.innerHTML = FLAG_SVG; e.firstChild.style.cssText = "display:block;width:100%;height:100%"; PN.appendChild(e); F.items.push({ f, e }); } };
  F.draw = (t, ctx) => { const reg = ctx.world.cameraAt(t).region; for (const { f, e } of F.items) {
    if (reg !== S || t < f.t0 || t > f.t1) { if (e.style.opacity !== "0") e.style.opacity = "0"; continue; }
    const q = ctx.world.projectMap(f.at[0], f.at[1], 0.02); if (!q.visible) { e.style.opacity = "0"; continue; }
    const rise = sstep(f.t0, f.t0 + 0.7, t), hpx = clamp(0.8 * q.ppu, 16, 44), wpx = hpx * 30 / 44, sw = 3 * Math.sin(t * 2.2 + f.at[1]);
    e.style.width = wpx.toFixed(1) + "px"; e.style.height = hpx.toFixed(1) + "px";
    e.style.transform = `translate(${(q.x - wpx * 0.07).toFixed(1)}px,${(q.y - hpx).toFixed(1)}px) scaleY(${Math.max(0.02, rise).toFixed(3)}) rotate(${sw.toFixed(1)}deg)`;
    e.style.opacity = (Math.min(1, rise * 1.5) * (1 - sstep(f.t1 - 0.6, f.t1, t))).toFixed(3); } };
  return F; })();

// ---------------- the newspaper on wallpaper (custom DOM card in the overlay's 1920x1080 space) ----------------
const PAPER = (() => { const cards = [
  { tIn: T.newspaper - 0.1, tOut: T.rabbit2 + 0.55, x: 470, y: 150, s: 1, date: "Vicksburg, Mississippi · July 1863",
    lines: [[T.mocked, "On the Yankee boast that they would dine in Vicksburg on the Fourth of July:", "cap"], [T.best, "the best recipe for cooking a rabbit was", "cap2"], [T.first - 0.05, "First ketch your rabbit.", "q"]],
    corner: T.wallpaper - 0.1, ribbon: [T.wallpaper - 0.1, "printed on the back of wallpaper"] },
  { tIn: T.last - 0.1, tOut: CUT_F - 0.2, x: 600, y: 210, s: 0.8, date: "Vicksburg, Mississippi · Thursday, July 2, 1863",
    lines: [[T.newspaper4, "The last issue announced that the Yankees had", "cap"], [T.caught - 0.05, "Caught our rabbit.", "q"]], corner: T.last + 0.2,
    ribbon: [T.newspaper4, "the 2 July issue, reprinted by Union soldiers on 4 July"] }];   // FACT_NOTES: last issue 2 July, reissued 4 July
  const P = { els: [] };
  const wallURL = () => { const c = document.createElement("canvas"); c.width = c.height = 120; const g = c.getContext("2d");
    g.fillStyle = "#d6bfa8"; g.fillRect(0, 0, 120, 120); g.fillStyle = "#c7a892"; for (let x = 0; x < 120; x += 30) g.fillRect(x, 0, 9, 120);
    const fl = (x, y) => { g.fillStyle = "#7c8a5a"; g.beginPath(); g.ellipse(x - 6, y + 4, 6, 2.6, -0.6, 0, 6.283); g.ellipse(x + 6, y + 4, 6, 2.6, 0.6, 0, 6.283); g.fill();
      g.fillStyle = "#9a4c46"; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x + Math.cos(k * 1.257) * 3.4, y + Math.sin(k * 1.257) * 3.4, 3, 0, 6.283); g.fill(); } g.fillStyle = "#e8cf9c"; g.beginPath(); g.arc(x, y, 2, 0, 6.283); g.fill(); };
    fl(15, 18); fl(75, 18); fl(45, 70); fl(105, 70); fl(15, 112); fl(75, 112); return c.toDataURL(); };
  // round 2 (critic A: grey placeholder bars): real small period type in the columns. Generic siege-town items in the paper's manner,
  // nothing quoted as the paper's actual words (the only quoted words are Grant's, in the box); too small to read at 720p, reads as print
  const COLS = [
    ["THE SITUATION.", "The enemy continue their works before our lines, and the shelling from the river has been kept up through the night. Our men in the trenches are cheerful and determined. Every man is at his post, and the garrison awaits the relief so long expected from without.",
      "PROVISIONS.", "We are told that mule meat is found palatable by those who have tried it. Flour is scarce and dear. Corn meal has given out in many families, and peas are ground for bread."],
    ["CITY ITEMS.", "Many families have removed to the caves dug in the hills, where they live in tolerable safety from the shells. Ladies and children pass the day underground and come out at evening when the firing slackens.",
      "THE NEWSPAPER.", "Our readers will excuse the appearance of this sheet. We print upon such paper as can be had, and are thankful to have any at all."],
    ["FROM THE LINES.", "The sharpshooters on both sides keep up a constant fire, and a head shown above the parapet is a mark for a dozen rifles. At night the pickets are so near that they converse across the works.",
      "NOTICE.", "Persons having stores of any kind are requested to report the same. All are urged to economize their supplies, as no man can say how long the siege may last."]];
  const greek = (seed, n, w) => { const C = COLS[Math.abs(Math.round(seed)) % 3]; let h = ""; for (let k = 0; k < 2; k++) h += `<b>${C[k * 2]}</b><p>${C[k * 2 + 1]} ${C[(k * 2 + 3) % 4]}</p>`;
    return `<div class="gk" style="width:${w}px">${h}</div>`; };
  P.build = () => { const host = document.getElementById("ov"), wall = wallURL();
    const css = document.createElement("style"); css.textContent = `
      .np{position:absolute;width:980px;height:640px;transform-origin:0 0;opacity:0;pointer-events:none}
      .np .sh{position:absolute;inset:0;background:#e6dcc4;box-shadow:0 18px 40px rgba(0,0,0,.55);clip-path:polygon(0 1%,3% 0,40% .6%,71% 0,100% .8%,99.4% 40%,100% 74%,99.6% 100%,62% 99.3%,30% 100%,0 99.4%,.5% 60%);overflow:hidden}
      .np .sh::before{content:"";position:absolute;inset:0;background-image:url(${wall});background-size:120px;opacity:.09;mix-blend-mode:multiply}
      .np .sh::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(255,250,235,0) 55%,rgba(120,90,50,.28) 100%)}
      .np .in{position:absolute;inset:34px 46px;color:#1f1a12}
      .np .mh{font-family:"GM Cinzel",serif;font-weight:700;font-size:66px;letter-spacing:.06em;text-align:center;line-height:1}
      .np .rl{border-top:3px double #2a2418;border-bottom:1px solid #2a2418;margin:12px 0 0;padding:5px 0 4px;text-align:center;font-family:"GM Cormorant",serif;font-weight:600;font-size:19px;letter-spacing:.3em;text-transform:uppercase}
      .np .cols{display:flex;gap:26px;margin-top:18px}
      .np .gk{font-family:"GM Cormorant",serif;color:#2a2418;text-align:justify;hyphens:auto;overflow:hidden;height:420px}
      .np .gk b{display:block;font-weight:700;font-size:13px;letter-spacing:.12em;text-align:center;margin:2px 0 3px;border-bottom:1px solid rgba(42,36,24,.5)}
      .np .gk p{margin:0 0 8px;font-size:13px;line-height:1.24;text-indent:1.2em}
      .np .ex{position:absolute;left:250px;right:250px;top:178px;padding:20px 26px 22px;background:#ece3cd;border:1.6px solid #2a2418;box-shadow:0 0 0 5px #ece3cd,0 0 0 6.5px #2a2418;text-align:center}
      .np .ex .cap,.np .ex .cap2{font-family:"GM Cormorant",serif;font-style:italic;font-weight:500;font-size:27px;line-height:1.25;color:#3a3020}
      .np .ex .q{font-family:"GM Cormorant",serif;font-weight:700;font-size:50px;line-height:1.1;margin-top:12px;color:#1a140c}
      .np .cn{position:absolute;right:0;bottom:0;width:0;height:0;background-image:url(${wall});background-size:120px;clip-path:polygon(100% 0,0 100%,100% 100%);box-shadow:-6px -6px 14px rgba(0,0,0,.4)}
      .np .cnf{position:absolute;right:0;bottom:0;width:0;height:0;background:linear-gradient(135deg,#efe6d0 0%,#cbbd9e 100%);clip-path:polygon(0 100%,100% 0,0 0);filter:drop-shadow(-3px -3px 4px rgba(0,0,0,.35))}
      .np .rib{position:absolute;left:50%;bottom:-26px;transform:translateX(-50%);white-space:nowrap;background:#1d1a14;color:#e8dcbf;font-family:"GM Cormorant",serif;font-style:italic;font-weight:600;font-size:24px;padding:6px 26px 7px;opacity:0;box-shadow:0 4px 10px rgba(0,0,0,.5)}`;
    document.head.appendChild(css);
    for (const c of cards) { const e = document.createElement("div"); e.className = "np"; e.style.left = c.x + "px"; e.style.top = c.y + "px";
      e.innerHTML = `<div class="sh"><div class="in"><div class="mh">THE DAILY CITIZEN</div><div class="rl">${c.date}</div>
        <div class="cols">${greek(11 + c.s * 7, 40, 270)}${greek(57 + c.s * 7, 40, 270)}${greek(93 + c.s * 7, 40, 270)}</div>
        <div class="ex">${c.lines.map(([, txt, k]) => `<div class="${k}" style="opacity:0">${k === "q" ? "“" + txt + "”" : txt}</div>`).join("")}</div></div>
        <div class="cn"></div><div class="cnf"></div></div><div class="rib">${c.ribbon[1]}</div>`;
      host.appendChild(e); P.els.push({ c, e, L: [...e.querySelectorAll(".ex > div")], cn: e.querySelector(".cn"), cnf: e.querySelector(".cnf"), rib: e.querySelector(".rib"), exs: e.querySelector(".ex") }); } };
  P.draw = (t) => { for (const { c, e, L, cn, cnf, rib, exs } of P.els) { const a = sstep(c.tIn, c.tIn + 0.6, t) * (1 - sstep(c.tOut - 0.5, c.tOut, t));
    e.style.opacity = a.toFixed(3); if (a <= 0) continue; const sc = c.s * (0.96 + 0.04 * sstep(c.tIn, c.tIn + 0.8, t));
    e.style.transform = `scale(${sc.toFixed(4)}) rotate(${(-1.2 + 0.3 * Math.sin(t * 0.3)).toFixed(3)}deg)`;
    L.forEach((l, i) => { l.style.opacity = sstep(c.lines[i][0], c.lines[i][0] + 0.6, t).toFixed(3); });
    exs.style.opacity = sstep(c.lines[0][0] - 0.3, c.lines[0][0] + 0.3, t).toFixed(3);   // round 2: the excerpt box comes in with its first line (was an empty box)
    const k = sstep(c.corner, c.corner + 0.9, t), s = (150 * k).toFixed(1) + "px"; cn.style.width = cn.style.height = s; cnf.style.width = cnf.style.height = s;
    cnf.style.transform = `translate(${(-150 * k).toFixed(1)}px,${(-150 * k).toFixed(1)}px)`;
    rib.style.opacity = sstep(c.ribbon[0], c.ribbon[0] + 0.5, t).toFixed(3); } };
  return P; })();

// ---------------- fx ----------------
const fx = {
  fires: [
    { region: S, at: [1386.6, 682.6, 0.3], t0: 9.6, t1: CUT_B + 0.5, preset: "house", opts: { size: 0.45 } },
    { region: S, at: [1388.6, 676.0, 0.3], t0: 12.7, t1: CUT_B + 0.5, preset: "house", opts: { size: 0.4 } },
    // callback: houses fired on De Soto Point to light the river, and the Henry Clay burning with her cotton
    { region: S, at: [1371.2, 664.2, 0.3], t0: CB0 - 2.5, t1: CB1, preset: "house", opts: { size: 0.9 }, cue: false },
    { region: S, at: [1370.8, 671.6, 0.3], t0: CB0 - 2.0, t1: CB1, preset: "house", opts: { size: 0.8 }, cue: false },
    { region: S, at: [1380.4, 667.0, 0.15], t0: CB0 - 1.5, t1: CB1, preset: "steamer", opts: { size: 1.2 } },   // the Henry Clay, west of the boats' lane
  ],
  smokeLines: [
    // 25 June: the fight in the crater (both sides throw shells and grenades by hand; musketry from the inner line)
    { region: S, pts: [[1409.4, 672.5], [1409.3, 673.3]], t0: T.held - 0.2, t1: 39.6, cue: true, opts: { dir: [-1, 0], size: 0.9, alpha: 0.22, life: 9, muzzle: 6, windK: 0.45, rate: 1.4, volley: 1.9 } },
  ],
  volleys: [
    { region: S, pts: [[1407.5, 672.4], [1407.5, 673.4]], t0: T.rushed + 0.4, t1: 39.6, opts: { dir: [1, 0], rate: 2.2, volley: 1.7, roll: 0.8, size: 1.0, height: 2.4, muzzle: 6, windK: 0.45 } },
  ],
  guns: [
    { region: S, preset: "battery", h: 0.25, opts: { size: 1.4, alpha: 0.2, flash: 2.0 }, impactOpts: { size: 1.1 },
      shots: SHELLS.map((s) => ({ t: s.t, at: s.at, dir: [s.impact[0] - s.at[0], s.impact[1] - s.at[1]].map((v, _, a) => v / Math.hypot(a[0], a[1])), impact: s.impact, delay: s.delay })) },
    // callback: the bluff batteries fire on the boats (flash on the bluff, the shot falls in the river; no boom, as S03)
    { region: S, preset: "battery", h: 0.25, boom: false, opts: { size: 1.3, alpha: 0.2, flash: 2.6, flashLife: 0.18 }, impactOpts: { size: 0.45 },
      shots: [[130.4, 1385.6, 664.6], [131.3, 1384.4, 671.0], [132.2, 1383.4, 677.2], [133.0, 1385.0, 667.8], [133.9, 1383.8, 674.0]].map(([t, x, y], i) => { const b = boatXY(CB_S(t + 0.8, i % 3));
        return { t, at: [x, y], dir: [b[0] - x, b[1] - y].map((v, _, a) => v / Math.hypot(a[0], a[1])), impact: [b[0] + 0.6 - (i % 2) * 1.2, b[1] + 0.4], delay: 0.8 }; }) },
  ],
  impacts: [{ region: S, at: LA3, t: 27.95, cue: true, opts: { size: 6.5 } }],
  flashes: [{ region: S, at: LA3, t: 27.95, opts: { size: 12, life: 0.45, alpha: 1.0, pool: 8 } }],
  campfires: [
    { region: S, pts: [[1413.0, 666.4], [1413.8, 671.6], [1412.2, 677.8], [1408.6, 682.4], [1405.6, 688.6], [1401.6, 694.0]], t0: 69.4, t1: CUT_E + 0.1 },
    { region: S, pts: [[1402.2, 666.0], [1404.2, 672.4], [1403.4, 677.4], [1399.6, 682.0], [1396.6, 688.0]], t0: 69.6, t1: CUT_E + 0.1, opts: { size: 0.9 } },
  ],
};

// ---------------- wide map (F, G) ----------------
const RW = VX.river(W, 0).pts.map((p) => [p[0], p[1]]);
const iNear = (x, y) => { let b = 0; RW.forEach((p, i) => { if (Math.hypot(p[0] - x, p[1] - y) < Math.hypot(RW[b][0] - x, RW[b][1] - y)) b = i; }); return b; };
const iBot = RW.reduce((b, p, i) => (p[1] > RW[b][1] ? i : b), 0), BOTTOM = RW[Math.max(0, iBot - 40)];
const iCity = iNear(1377, 670), RUN = RW.slice(iCity - 260, iCity + 900).filter((_, i) => i % 3 === 0);
const LUN = VX.len(RUN);

const LEG = { entries: [{ name: "Union", sub: "Grant", color: "#3C6E9E" }, { name: "Confederates", sub: "Pemberton", color: "#9C3A35" }] };
window.SEQ = {
  name: "S12", D: T.D, T, seed: 1863, date: "1863-07-03",
  regions: [S, W],
  regionOpts: { [S]: { troopScale: 1.4 }, [W]: { troopScale: 9 } },
  grade: { wide: { toe: 30 } },   // round 2 (critic A: wide finale too dark): lift the wide shadows
  keys: [
    // A: from above, the approaches grow; night: swing west over the town to the river; the hillsides
    { t: 0.0, region: S, at: [1405.6, 677.0], dist: 33, tilt: 30, yaw: 84, fov: 30 },
    { t: 6.3, region: S, at: [1404.4, 677.8], dist: 35, tilt: 33, yaw: 86, fov: 30, night: 0 },
    { t: 7.4, region: S, at: [1393.0, 683.0], dist: 40, tilt: 44, yaw: 80, fov: 30, night: 0.9 },
    { t: 10.6, region: S, at: [1382.5, 686.0], dist: 31, tilt: 50, yaw: 72, fov: 30, night: 0.9 },
    { t: 14.2, region: S, at: [1387.0, 681.0], dist: 17, tilt: 56, yaw: 72, fov: 30, night: 0.9 },
    { t: 18.4, region: S, at: [1387.6, 680.0], dist: 16, tilt: 57, yaw: 70, fov: 30, night: 0.9 },
    { t: CUT_B, region: S, at: [1389.0, 679.0], dist: 20, tilt: 55, yaw: 72, fov: 30, night: 0.9, ease: "lin" },
    // B: 25 June at the 3rd Louisiana Redan (cut + night -> day dissolve)
    { t: CUT_B, region: S, at: [1409.8, 673.6], dist: 18, tilt: 46, yaw: 74, fov: 30, night: 0.9, ease: "cut" },
    { t: CUT_B + 0.9, region: S, at: [1409.8, 673.5], dist: 17.8, tilt: 46, yaw: 73.5, fov: 30, night: 0, ease: "lin" },
    { t: 27.6, region: S, at: [1409.6, 673.1], dist: 15.5, tilt: 47, yaw: 70, fov: 30 },
    { t: 32.4, region: S, at: [1409.4, 673.0], dist: 19.5, tilt: 43, yaw: 68, fov: 30 },
    { t: 36.8, region: S, at: [1409.4, 672.9], dist: 15.5, tilt: 47, yaw: 66, fov: 30 },
    { t: 39.4, region: S, at: [1408.4, 673.4], dist: 18, tilt: 47, yaw: 68, fov: 30 },
    // C: the town by day under the newspaper card
    { t: 46.0, region: S, at: [1398.0, 677.0], dist: 30, tilt: 45, yaw: 78, fov: 30 },
    { t: 54.6, region: S, at: [1401.0, 676.6], dist: 36, tilt: 45, yaw: 82, fov: 30 },
    // D: 3 July: white flags along the line, the oak between the lines, then night
    { t: 59.4, region: S, at: [1404.4, 676.2], dist: 52.9, tilt: 45, yaw: 82, fov: 21 },
    { t: 62.8, region: S, at: [1408.0, 674.5], dist: 20.7, tilt: 48, yaw: 76, fov: 21 },
    { t: 69.3, region: S, at: [1408.0, 674.5], dist: 18.6, tilt: 49, yaw: 70, fov: 21, night: 0 },
    { t: 70.2, region: S, at: [1407.6, 674.8], dist: 22.9, tilt: 48, yaw: 71, fov: 21, night: 1 },
    { t: CUT_E, region: S, at: [1405.0, 676.6], dist: 45.7, tilt: 46, yaw: 80, fov: 21, night: 1 },
    // round 3: 59.4-99.8 at fov 21 (dist x1.43, same framing) = less perspective shear on off-centre boxes (critic A N7)
    // E: 4 July (cut + night -> day). Round 2 (critic B: the surrender read as specks): CLOSE on the 3rd Louisiana Redan / Jackson road
    // for march out - stack arms - march back (79-90), then pull back for the 29,500 and the newspaper
    { t: CUT_E, region: S, at: [1408.4, 673.6], dist: 22.1, tilt: 46, yaw: 80, fov: 21, night: 1, ease: "cut" },
    { t: CUT_E + 0.9, region: S, at: [1408.4, 673.6], dist: 21.9, tilt: 46, yaw: 79.5, fov: 21, night: 0, ease: "lin" },
    { t: 87.6, region: S, at: [1408.2, 673.8], dist: 20.0, tilt: 47, yaw: 76, fov: 21 },
    { t: 93.2, region: S, at: [1404.6, 676.8], dist: 48.6, tilt: 44, yaw: 84, fov: 21 },
    { t: CUT_F, region: S, at: [1403.6, 677.6], dist: 48.6, tilt: 44, yaw: 88, fov: 21, ease: "lin" },
    // F: the wide map pulls up the whole river (kept inside the baked region: no world edge at the left)
    { t: CUT_F, region: W, at: [1392, 700], dist: 330, tilt: 44, yaw: -2, fov: 30, ease: "cut" },
    { t: 101.2, region: W, at: [1390, 712], dist: 350, tilt: 43, yaw: -2, fov: 30 },
    { t: 107.6, region: W, at: [1440, 868], dist: 560, tilt: 34, yaw: 0, fov: 30 },
    { t: 119.4, region: W, at: [1446, 850], dist: 580, tilt: 33, yaw: 1, fov: 30, ease: "lin" },
    // G: the warm low-sun dusk, in toward the city
    { t: 128.6, region: W, at: [1404, 720], dist: 380, tilt: 40, yaw: 2, fov: 30, night: 0.08 },
    { t: CB0, region: W, at: [1402, 714], dist: 360, tilt: 41, yaw: 2, fov: 30, night: 0.1, ease: "lin" },
    // the callback: 16 April at night, the gunboats run down past the city, De Soto Point burning, the Henry Clay on fire
    { t: CB0, region: S, at: [1379.2, 670.0], dist: 23, tilt: 56, yaw: 96, fov: 30, night: 1, ease: "cut" },
    { t: CB1, region: S, at: [1378.0, 676.0], dist: 21, tilt: 57, yaw: 92, fov: 30, night: 1, ease: "lin" },
    // back to the dusk over the city, slow pull-up to the end
    { t: CB1, region: W, at: [1398, 700], dist: 250, tilt: 44, yaw: 0, fov: 30, night: 0, ease: "cut" },
    { t: T.D, region: W, at: [1402, 708], dist: 300, tilt: 42, yaw: 2, fov: 30, night: 0.05, ease: "lin" },
  ],
  clouds: {
    [S]: { shadows: true },
    [W]: { keepClear: [[1380, 690, 70, 1, 0.8], [1330, 900, 120, 0.6, 0.5]], nightErode: 0.3 },
  },
  units: [...units,
    // F: the city in Union hands; the river line
    { region: W, side: "u", type: "inf", n: 3, face: "east", t0: CUT_F, keys: [[0, 1398, 680]] },
    { region: W, side: "u", type: "inf", n: 3, face: "south", t0: CUT_F, keys: [[0, 1416, 700]] }],
  boats: [
    { region: S, kind: "gunboat", n: 3, size: 0.55, path: RIV, sAt: (t, i) => MORTAR_S[i], t0: 6.0, t1: CUT_B, lamp: false, wake: false },   // the mortar boats
    { region: S, kind: "gunboat", n: 2, size: 0.75, path: RIV, sAt: (t, i) => GUNBOAT_S[i], t0: 6.0, t1: CUT_B, lamp: false, wake: false },
    // F: the river open: steamers down past the city to the Gulf
    { region: W, kind: "steamer", n: 3, size: 5, path: RUN, sAt: (t, i) => 200 + (t - T.whole) * 12 - i * 26, t0: T.whole, t1: T.D + 1, lamp: false },
    // G (callback, round 2): seven gunboats run dark down past the city (16 April), nose to tail
    { region: S, kind: "gunboat", n: 7, size: 0.3, path: RIV, sAt: CB_S, t0: CB0 - 0.1, t1: CB1 + 0.2, lamp: false, wake: true },
  ],
  fx, build, draw,
  labels: [
    { text: "Mississippi River", at: [1375.0, 700.0], size: 16, river: true, t0: T.river, t1: T.river + 3.4 },
    { text: "Vicksburg", town: "Vicksburg", size: 19, t0: T.people + 0.3, t1: T.people + 3.6 },
    { text: "3rd Louisiana Redan", at: [1408.0, 671.4], size: 16, t0: T.june25 + 0.4, t1: T.engineers - 0.2 },
    { text: "the mine", at: [1410.4, 674.0], size: 15, river: true, t0: T.mine + 0.0, t1: T.mine + 2.8 },
    { text: "Vicksburg", town: "Vicksburg", size: 22, t0: CUT_F + 0.4, t1: CUT_F + 3.8, region: W },
    { text: "Mississippi River", at: [1262, 960], size: 22, river: true, t0: T.whole, t1: T.whole + 3.8, region: W },
  ],
  overlay: [
    ["plaque.date", T.dug, { month: "June 1863", day: "", weekday: "", note: "the siege" }],
    ["legend", 1.6, T.newspaper - 0.6, LEG],
    ["plaque.note", T.closer, "closer every week"],
    ["film.grade", 6.5, "night", 0.8],
    ["label", T.caves, T.food - 0.2, { name: "Caves in the hillsides", sub: "families lived in the clay banks", world: [1386.2, 683.6], side: "us", stripes: ["#c8b48a"], marker: false, offset: [40, 30] }],
    ["plaque.note", T.ranOut, "food runs out · mule meat"],
    // B
    ["film.grade", CUT_B, "day", 0.9],
    ["plaque.date", T.june25, { month: "June 1863", day: "25", weekday: "Day 57", note: "Thursday · the 3rd Louisiana Redan" }],
    ["plaque.clock", T.three, { time: "15:00", note: "a little after three", header: "25 June 1863 · Day 57" }],
    ["plaque.run", T.three + 0.9, T.mine, "15:20"],
    ["label", T.held + 0.3, T.on + 0.9, { name: "Held in the crater", sub: "about 26 hours of close fighting", world: [1409.3, 672.9], side: "us", offset: [-360, -120] }],
    // C: the newspaper (custom card PAPER) over a dimmed map
    ["plaque.date", T.newspaper - 0.3, { month: "Summer 1863", day: "", weekday: "", note: "the town's newspaper" }],
    ["film.dim", T.newspaper - 0.2, T.rabbit2 + 0.3, 0.8],
    // D
    ["plaque.date", T.third, { month: "July 1863", day: "3", weekday: "Day 65", note: "Friday · white flags" }],
    ["legend", T.third + 0.4, T.grant - 0.3, LEG],
    ["plaque.clock", T.afternoon3, { time: "15:00", note: "between the lines", header: "3 July 1863 · Day 65" }],
    ["medallion", { kind: "card", general: "pemberton", sub: "under a flag of truce", world: [OAK[0] - 0.5, OAK[1] + 0.1], offset: [-360, -230], tIn: T.pemberton, tOut: T.near - 0.1 }],   // round 3: one card at a time
    ["medallion", { kind: "card", general: "grant", sub: "near a stunted oak", world: [OAK[0], OAK[1]], offset: [380, 110], tIn: T.stunted - 0.1, tOut: T.served - 0.3 }],   // round 3: after Pemberton's, dot on the oak
    ["label", T.served, 69.3, { name: "Mexico, 1846-48", sub: "they had served in the same division", x: 1420, y: 680, offset: [-190, -40], marker: false, side: "us", stripes: ["#3C6E9E", "#9C3A35"] }],
    ["film.grade", 69.4, "night", 0.8],
    ["plaque.clock", T.night + 0.1, { time: "22:00", note: "that night", header: "3 July 1863 · Day 65" }],   // FACT: terms by 10 p.m. (GM)
    ["letter", T.terms - 0.35, CUT_E - 0.2, { header: "3 July 1863 · that night", title: "Grant's terms", sub: "the substance, not the letter's words", marks: false, cps: 24, lag: 0.05, stagger: 0.06, partDur: 0.35,   // round 3: no empty band
      quote: "Parole: each man signs a promise not to fight again until exchanged, and goes home." }],
    // E
    ["film.grade", CUT_E, "day", 0.9],
    ["plaque.date", T.ten, { month: "July 1863", day: "4", weekday: "Day 66", note: "Saturday · the surrender" }],
    ["plaque.clock", T.fourth4 + 0.4, { time: "10:00", note: "the garrison marches out", header: "4 July 1863 · Day 66" }],
    ["legend", CUT_E + 1.0, T.last - 0.4, LEG],
    ["number", T.twentyNine, T.grant4 - 0.1, { value: 29500, round: 500, world: [1401.0, 674.0, 1.2], size: 100 }],
    ["label", T.grant4 + 0.1, T.last - 0.4, { name: "Without a cheer", sub: "Grant's whole army watched", world: [1408.6, 676.0], side: "us", marker: false, offset: [40, 40] }],
    ["film.dim", T.last - 0.2, CUT_F - 0.3, 0.45],
    // F
    ["plaque.date", T.five + 0.2, { month: "July 1863", day: "9", weekday: "Day 71", note: "Thursday · Port Hudson" }],
    ["label", T.port, T.whole - 0.2, { name: "Port Hudson", sub: "9 July · surrenders: nearly 6,000 prisoners", world: [BOTTOM[0], BOTTOM[1]], side: "cs", marker: false, offset: [30, -80] }],
    ["label", T.cut - 0.2, T.far - 0.3, { name: "Cut in two", sub: "Texas, Arkansas and Louisiana cut off from the East", world: [1150, 790], side: "cs", marker: false }],
    ["label", T.gettysburg - 0.05, T.father - 0.4, { name: "Gettysburg", sub: "1-3 July · Lee's army beaten, far to the north-east", x: 1500, y: 260, offset: [0, 0], marker: false, side: "us" }],
    ["quote", T.father - 0.1, T.grantE - 0.5, { en: "The Father of Waters again goes unvexed to the sea.", attr: "Abraham Lincoln · letter to James C. Conkling, 26 August 1863", y: 440, dim: 0.4 }],
    // G
    ["film.grade", T.for - 0.4, "dusk", 2.5],
    ["medallion", { kind: "card", general: "grant", sub: "the road east: every Union army, then Appomattox", screen: [1690, 232], tIn: T.grantE, tOut: T.began - 0.4 }],   // round 2: inside the frame (was cut at the right edge)
    ["ledger.show", T.began, { title: "The Vicksburg campaign", sub: "16 April - 4 July 1863" }],
    ["ledger.add", T.seven, { who: "Seven gunboats", note: "past the guns, 16 April", stamp: false }],
    ["ledger.add", T.cotton - 0.3, { who: "Five battles, 18 days", note: "1 - 17 May", stamp: false }],
    ["ledger.add", T.idea + 0.2, { who: "29,500 surrendered", note: "4 July", stamp: false }],
    ["ledger.add", T.madness - 0.4, { who: "The Mississippi open", note: "Port Hudson, 9 July", stamp: false }],
    // round 2: the callback to the night run (dip through dark, night grade), then back to the warm dusk
    ["film.dim", CB0 - 0.75, CB0 + 0.05, 1.0],
    ["film.grade", CB0, "night", 0.3],
    ["plaque.date", CB0 + 0.15, { month: "April 1863", day: "16", weekday: "", note: "where it began · the night run" }],
    ["film.dim", CB1 - 0.75, CB1 + 0.05, 1.0],
    ["film.grade", CB1, "dusk", 0.3],
    ["plaque.date", CB1 + 0.15, { month: "July 1863", day: "9", weekday: "", note: "the Mississippi open" }],
    ["plaque.hide", FADE - 0.6],
  ],
  end: { fadeAt: FADE, dur: 2.5 },
};
})();
