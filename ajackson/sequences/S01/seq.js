// S01 HOOK (83.69 s; tools/scene_times.py S01 --words). Andrew Jackson film, Battle 20.
// A  0.0-12.2  gulf from altitude, late light: the British fleet (ships) already sailing north-west for Lake Borgne in frame 1; plate
//              NOVEMBER 1814 on "eighteen fourteen"; "British fleet" tag on "fleet"; NEW ORLEANS on its word; the Mississippi glows gold from
//              its mouth up to the city on "mouth of the Mississippi", then on up the valley and out of the frame on "the whole American West";
//              ONE continuous push onto the plain below the city -> cloud dive 1 (swap 12.15, emerges on "eighth").
// B 12.3-31.5  chalmette, 8 Jan 1815: the British lines on the open fields facing Jackson's ditch + mud wall; plate on "eighteen fifteen";
//              they advance on "five thousand"; the guns and then the whole American line fire (flashes + smoke); they stop short and fall
//              back on "killed"; 2,000+ ticks on "two thousand", 71 on "seventy-one".
// C 31.5-41.3  HARD CUT: the city, dimmed; the Ghent card (dark parchment): TWO WEEKS EARLIER / GHENT / two seals / SIGNED / PEACE TREATY /
//              NOT YET RATIFIED BY AMERICA, each on its words.
// D 41.3-66.4  neworleans (wide): the city on "New Orleans"; plate 23 DECEMBER 1814 on "Two weeks before the battle"; the camera pulls back
//              down the river; red blocks walk out of the swamp at Villere on "come out of the swamps"; 9 MILES ruler on "nine miles"; the
//              general's banner (no portrait, "?") rides into the city on "The general"; tag "worn down by illness"; the scar card (a red cut
//              drawn on "scar", A BRITISH OFFICER'S SWORD on "sword", AGE 14 on "fourteen"); 3D gold ANDREW JACKSON on "Andrew Jackson",
//              the portrait revealed on "Jackson".
// E 66.4-83.7  three snap cuts on their words: Horseshoe Bend from above (the wall, the guns on Gun Hill, the bend ringed), the night of
//              23 Dec (campfires, the Carolina's broadside, blue lines firing in the dark), the mud line with smoke on 8 Jan; THREE
//              GREATEST TACTICAL MOVES on "three"; the last 0.6 s dissolves into S02 (gulf).
(() => {
const T = { D: 79.89, winter: 0.62, eighteen: 1.71, british0: 2.86, burned: 3.74, washington: 4.14, take: 5.46, orleans: 5.66, mouth: 7.80, miss: 8.46,
  prize: 9.74, peace0: 11.40, table: 11.64,
  eighth: 13.30, january: 13.56, e1815: 14.85, five: 16.76, regulars: 17.64, attacked: 18.20, ditch: 18.90, wall: 19.84, mud: 20.32,
  half: 22.64, two: 24.01, killed: 24.94, captured: 26.40, americans: 27.74, seventy: 29.25, killed2: 29.86, missing: 31.22,
  strangest: 32.64, weeks: 34.38, ghent: 35.24, both: 35.96, signed: 36.76, peace: 37.22, america: 38.52, not: 39.16, ratified: 39.66,
  war: 40.96, noone: 42.16, orleans2: 42.78, knew: 43.36, twoWeeks: 44.48, river2: 45.0, british: 45.90, come: 46.84, swamps: 47.46,
  unseen: 47.82, nine: 49.20, miles: 49.42, general: 51.50, illness: 53.98, thin: 54.88, scar: 55.62, british2: 56.40, sword: 57.46,
  fourteen: 59.18, name: 60.32, andrew: 60.92, jackson: 61.40, trap: 62.68, bend: 65.00, attack: 66.10, dark: 67.64,
  landed: 69.02, stop: 70.38, veteran: 71.26, mud2: 73.22, these: 74.28, andrew2: 74.84, three: 76.16, moves: 77.44 };   // owner fixes: new narration (re-voiced opening, two trimmed paragraphs)
const GULF = "gulf", CH = "chalmette", NO = "neworleans", HB = "horseshoe";
const sstep = VX.sstep, hsh = VX.hsh;
const SWT = 12.8, DOFF = { emerge: 0.5, clear: 0.8, haze: 1.45 }, DV = VX.diveTimes(SWT); for (const k in DOFF) DV[k] = SWT + DOFF[k];   // round 1: v8 white-out, flat phase trimmed ~0.35 s          // (v8 white-out) push 7.95, deckIn 10.05, full 11.2, SW 11.75, emerge 12.6, clear 12.9, land 15.1
const CUT_G = 32.34, CUT_N = 42.16;                  // hard cut to the Ghent card (over the city); the card leaves, the city comes up
const SN1 = T.trap, SN2 = T.attack, SN3 = T.stop;    // the three snap cuts

// ---------------- geography ----------------
const P = (n, r) => VX.place(n, r);
const RE = P("Jackson's line, river end", CH), EL = P("Jackson's line, elbow", CH), SWE = P("Jackson's line, swamp end", CH);
const lerp2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const dirv = [EL[0] - RE[0], EL[1] - RE[1]], Lv = Math.hypot(...dirv), U = [dirv[0] / Lv, dirv[1] / Lv], FR = [-U[1], U[0]];   // FR = toward the British (ESE)
const FACE = Math.atan2(FR[1], FR[0]);
const off = (s, d) => { const p = lerp2(RE, EL, s); return [p[0] + FR[0] * d, p[1] + FR[1] * d]; };   // s along the river->wood stretch, d in front (+) / behind (-)
const OVER = P("Jackson's line, river end", GULF);
const CITY = P("New Orleans 1815", NO), VIL = P("Villere plantation house", NO), CANAL = P("Villere canal head", NO);
const CAROL = P("USS Carolina anchorage", CH);
const CLASHC = (() => { const p = lerp2(RE, EL, 0.52); return [p[0] + FR[0] * 2.7, p[1] + FR[1] * 2.7]; })();   // the clash framing centre

// ---------------- A: the gulf ----------------
const RIVG = VX.river(GULF, 2).pts;                  // the Mississippi from the west edge (11, 595) down past New Orleans to the mouth (448, 971)
const idxG = (x, y) => { let b = 0; for (let i = 0; i < RIVG.length; i++) if (Math.hypot(RIVG[i][0] - x, RIVG[i][1] - y) < Math.hypot(RIVG[b][0] - x, RIVG[b][1] - y)) b = i; return b; };
const iNO = idxG(300.6, 803.5), iEND = RIVG.length - 1;
const FLEETP = [[515, 1000], [484, 912], [468, 864], [458, 815], [452, 776]];   // from the south-east toward the Lake Borgne / Cat Island anchorage
const FLV = 3.2, FLS0 = 97;   // the leader's arc length at t = -1 (the stragglers start up to ~50 units further back on the extended route)
const fleetLead = (t) => VX.along(FLEETP, FLS0 + (t + 1) * FLV);
// owner fix: separate ships in a loose irregular formation, never one column. The S03 / S04 / S08 helper (ajackson/sequences/S03/seq.js),
// copied verbatim: each ship its own path (the route offset sideways, the offset drifting = slightly different headings), its own
// start and speed (leaders, stragglers).
const FLEET = (path, n, seed, o) => { const L = VX.len(path), out = [];
  const nrm = (i) => { const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]; };
  for (let k = 0; k < n; k++) { const h = (j) => VX.hsh(seed * 31 + k, j), off = (h(1) - 0.5) * 2 * o.spread, drift = (h(2) - 0.5) * o.spread * 0.8;
    let acc = 0; const P = path.map((p, i) => { if (i) acc += Math.hypot(p[0] - path[i - 1][0], p[1] - path[i - 1][1]); const d = off + drift * acc / L, nv = nrm(i); return [p[0] + nv[0] * d, p[1] + nv[1] * d]; });
    const speed = o.speed * (0.9 + 0.2 * h(3)), lag = (k === 0 ? 0 : (0.25 + 0.75 * h(4)) * o.depth) + (h(5) > 0.8 ? o.depth * 0.6 : 0);   // a straggler now and then
    out.push({ region: o.region, kind: "ship", n: 1, t0: o.t0, t1: o.t1, size: o.size * (0.9 + 0.2 * h(6)), lamp: false, wake: true, path: P, s0: o.s0 - lag + (o.dt || 0) * speed, speed }); }
  return out; };
const shift = (path, d) => path.map((p, i) => { const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [p[0] - dy / l * d, p[1] + dx / l * d]; });
const lin = (c) => c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
const GOLD = lin([0xe0 / 255, 0xb8 / 255, 0x5a / 255]);
let WW = null;
const waterY = (r, wl) => wl * WW.regions[r].ys + 0.05;

// ---------------- B: 8 January (chalmette) ----------------
const units = [];
// the American line behind the rampart (there all scene): infantry + guns, Coffee's men on the swamp leg
[[0.14, "inf", 2], [0.33, "art", 1], [0.52, "inf", 2], [0.74, "art", 1], [0.92, "inf", 2]].forEach(([s, type, n]) =>
  units.push({ region: CH, side: "u", type, n, face: FACE, arrive: false, keys: [[0, ...off(s, type === "art" ? -0.45 : -0.6)]] }));
{ const p = lerp2(EL, SWE, 0.42); units.push({ region: CH, side: "u", type: "inf", n: 2, face: FACE - 0.35, arrive: false, keys: [[0, p[0] - 0.55, p[1] + 0.2]] }); }
// the British lines: in place at the emergence, advance on "five thousand", stop short of the ditch, fall back on "killed"; off screen they
// close up again (d 4-5) for the third snap cut, where they stand in the smoke and fall back once more
const RED = [[-0.06, 5.5, 2.0, 2], [0.42, 6.4, 2.4, 2], [0.84, 5.7, 2.0, 2], [1.04, 6.6, 2.7, 2]];   // [s, start d, closest d, boxes]
const GB_ADV = 17.9, GB_HALT = 21.3, GB_BACK = 28.7, GB_OUT = 32.7;   // round 1: retreatTurn (engine) turns the whole block about in ~7 s before the walk back   // the halt >= 3.3 s (runs closer than 3.2 s merge: no about-face)
RED.forEach(([s, d0, d1, n], i) => units.push({ region: CH, side: "r", type: "inf", n, face: FACE + Math.PI, arrive: false,
  keys: [[0, ...off(s, d0)], [GB_ADV + i * 0.25, ...off(s, d0)], [GB_HALT + i * 0.2, ...off(s, d1)], [GB_BACK + i * 0.15, ...off(s, d1)],
         [GB_OUT + i * 0.2, ...off(s, d0 + 0.6)], [SN3 + 0.4 + i * 0.3, ...off(s, d0 + 0.6)], [SN3 + 3.0 + i * 0.3, ...off(s, d1 + 1.4)]] }));   // round 1: halted before the title line (calm shot)
const arrows = [
  { region: CH, side: "r", pts: [off(0.45, 8.6), off(0.45, 6.0), off(0.45, 3.6)], t0: T.five + 0.1, dur: 1.4, t1: T.killed, width: 0.3 },
  { region: CH, side: "r", pts: [off(0.82, 9.6), off(0.82, 6.6), off(0.82, 3.8)], t0: T.five + 0.4, dur: 1.4, t1: T.killed, width: 0.3 },
];
const GUNS_US = [off(0.33, -0.25), off(0.74, -0.25)];
const lineFront = (s0, s1, n, d = 0.05) => Array.from({ length: n }, (_, k) => off(s0 + (s1 - s0) * k / (n - 1), d));
const legFront = () => [0.1, 0.35, 0.6].map((k) => { const p = lerp2(EL, SWE, k); return [p[0] + 0.15, p[1] + 0.1]; });

// ---------------- D: 23 December (neworleans, wide z10) ----------------
const NOU = (x, y) => [x, y];
// the advance guard out of the cypress swamp onto Villere's fields (south toward the river)
const NOF = Math.PI / 2 + 0.12;   // out of the swamp toward the river (a touch west of south: on screen straight down)
[[-3.4, 0], [3.2, 0.5]].forEach(([dx, dd], i) => { const a = [VIL[0] + dx - Math.cos(NOF) * 3, VIL[1] - 6.0 + dd - Math.sin(NOF) * 3], b = [a[0] + Math.cos(NOF) * 6, a[1] + Math.sin(NOF) * 6];
  units.push({ region: NO, side: "r", type: "inf", n: 2, face: NOF, t0: T.come - 0.9 + i * 0.35, arrive: false, keys: [[0, ...a], [T.come + 0.3 + i * 0.35, ...a], [T.nine + 1.2 + i * 0.3, ...b]] }); });
arrows.push({ region: NO, side: "r", pts: [[CANAL[0] + 0.6, CANAL[1] + 20], [CANAL[0] + 1.8, CANAL[1] + 32], [VIL[0] - 0.4, VIL[1] - 8.4]], t0: T.come, dur: 1.4, t1: T.general + 0.4, width: 0.3 });

// ---------------- E: the snap cuts ----------------
// 1. Horseshoe Bend (z11): the wall across the neck, the guns on Gun Hill, the bend ringed by Coffee's men and the allies
const BW = P("Breastwork (barricade) centre", HB), GH = P("Gun Hill", HB), TOH = P("Tohopeka village site", HB);
units.push({ region: HB, side: "u", type: "inf", n: 2, face: Math.PI / 2, arrive: false, keys: [[0, BW[0] - 3.4, BW[1] - 3.1]] });
units.push({ region: HB, side: "u", type: "inf", n: 2, face: Math.PI / 2, arrive: false, keys: [[0, BW[0] + 2.4, BW[1] - 2.7]] });
units.push({ region: HB, side: "u", type: "art", n: 1, face: Math.PI / 2 + 0.2, arrive: false, keys: [[0, GH[0] - 0.2, GH[1] - 0.9]] });
units.push({ region: HB, side: "u", type: "inf", n: 2, face: -Math.PI / 4, arrive: false, keys: [[0, 8689.6, 1293.2]] });     // Coffee's south bank
units.push({ region: HB, side: "u", type: "inf", n: 2, face: -Math.PI / 2, arrive: false, keys: [[0, 8696.4, 1298.3]] });
units.push({ region: HB, side: "u", type: "inf", n: 2, face: Math.PI, arrive: false, keys: [[0, 8714.6, 1285.4]] });         // Hammond's rangers, east bank
units.push({ region: HB, side: "r", type: "inf", n: 2, face: -Math.PI / 2, arrive: false, keys: [[0, BW[0] - 0.8, BW[1] + 2.2]] });
units.push({ region: HB, side: "r", type: "inf", n: 2, face: -Math.PI / 2, arrive: false, keys: [[0, BW[0] - 4.6, BW[1] + 5.6]] });
// 2. the night of 23 December (chalmette): the British camp on Lacoste's and Villere's fields, the Carolina, Jackson's lines coming in
const LAC = P("Lacoste plantation", CH), DLR = P("De la Ronde plantation", CH);
const N0 = SN2 - 1.4, N1 = SN3 + 0.9;   // visible only in the night shot (camera x 1266-1290)
units.push({ region: CH, side: "r", type: "inf", n: 2, face: Math.PI, t0: N0, t1: N1, arrive: false, keys: [[0, LAC[0] - 2.2, LAC[1] - 1.6]] });
units.push({ region: CH, side: "r", type: "inf", n: 2, face: Math.PI + 0.3, t0: N0, t1: N1, arrive: false, keys: [[0, LAC[0] - 1.4, LAC[1] - 4.4]] });
units.push({ region: CH, side: "u", type: "inf", n: 2, face: 0.12, t0: N0, t1: N1, arrive: false, keys: [[0, DLR[0] - 0.8, DLR[1] - 0.6], [SN2 + 0.3, DLR[0] - 0.8, DLR[1] - 0.6], [SN2 + 3.2, DLR[0] - 0.8 + 2.4 * Math.cos(0.12), DLR[1] - 0.6 + 2.4 * Math.sin(0.12)]] });
units.push({ region: CH, side: "u", type: "inf", n: 2, face: 0.3, t0: N0, t1: N1, arrive: false, keys: [[0, DLR[0] + 1.0, DLR[1] - 5.6], [SN2 + 0.6, DLR[0] + 1.0, DLR[1] - 5.6], [SN2 + 3.4, DLR[0] + 1.0 + 2.2 * Math.cos(0.3), DLR[1] - 5.6 + 2.2 * Math.sin(0.3)]] });
const RIVC = VX.river(CH, 0).pts;
const idxC = (x, y) => { let b = 0; for (let i = 0; i < RIVC.length; i++) if (Math.hypot(RIVC[i][0] - x, RIVC[i][1] - y) < Math.hypot(RIVC[b][0] - x, RIVC[b][1] - y)) b = i; return b; };
const iCar = idxC(CAROL[0], CAROL[1]), CARP = [RIVC[Math.max(0, iCar - 6)].slice(0, 2), RIVC[iCar].slice(0, 2), RIVC[Math.min(RIVC.length - 1, iCar + 6)].slice(0, 2)];

// ---------------- fx ----------------
const usShots = [15.3, 16.4, 17.5, 18.5, 19.6, 20.8, 21.8, 22.9, 23.9];   // round 1: first shot after the cloud has cleared
const SMK = { dir: FR, rate: 0.9, volley: 1.5, roll: 0.8, size: 0.55, alpha: 0.075, life: 6, height: 2.6, muzzle: 6, windK: 0.7, cluster: [3.6, 1.8] };
const fx = {
  smokeLines: [
    // 8 Jan: the American line fires (river -> wood, then the swamp leg)
    { region: CH, pts: lineFront(0.04, 0.96, 9), t0: T.mud + 0.1, t1: 26.2, cue: true, opts: { ...SMK } },   // round 1: muskets after "mud" (the hook's key lines stay clear)
    { region: CH, pts: legFront(), t0: T.mud + 0.4, t1: 25.4, cue: true, opts: { ...SMK, rate: 0.7 } },
    // snap 2, night: Jackson's lines fire into the camp
    { region: CH, pts: [[DLR[0] + 2.4, DLR[1] - 0.9], [DLR[0] + 2.2, DLR[1] + 0.4]], t0: SN2 + 3.3, t1: SN3, cue: true, opts: { dir: [1, 0.05], rate: 1.2, volley: 1.1, size: 0.5, alpha: 0.06, life: 5, height: 2.2, muzzle: 6, cluster: [2.4, 1.2] } },
    { region: CH, pts: [[DLR[0] + 3.4, DLR[1] - 5.0], [DLR[0] + 3.8, DLR[1] - 3.8]], t0: SN2 + 3.0, t1: SN3, cue: true, opts: { dir: [0.95, 0.3], rate: 1.2, volley: 1.3, size: 0.5, alpha: 0.06, life: 5, height: 2.2, muzzle: 6, cluster: [2.4, 1.2] } },
    // snap 3: the mud line firing again in the smoke
    { region: CH, pts: lineFront(0.04, 0.96, 9), t0: SN3 + 0.05, t1: T.these - 0.3, cue: true, opts: { ...SMK, rate: 1.0, volley: 1.4 } },   // round 1: quiet under the title line
  ],
  guns: [
    // 8 Jan: the American guns fire into the advancing lines
    { region: CH, preset: "battery", shots: usShots.map((t, i) => { const g = GUNS_US[i % 2], s = i % 2 ? 0.8 : 0.36, d = 4.2 + ((i * 37) % 5) * 0.5;
        return { t, at: g, dir: FR, impact: off(s + ((i * 13) % 5 - 2) * 0.03, d), delay: 0.55 }; }) },
    // snap 1: the two small cannon on Gun Hill pound the log wall
    { region: HB, shots: [SN1 + 0.35, SN1 + 1.35, SN1 + 2.3].map((t, i) => ({ t, at: [GH[0] - 0.2, GH[1] - 0.6], dir: [0.1, 1], impact: [BW[0] - 1.2 + i * 1.1, BW[1] + 0.1], delay: 0.45 })) },
    // snap 2: the Carolina's broadside into the camp
    { region: CH, preset: "battery", h: 0.4, shots: [SN2 + 0.4, SN2 + 0.9, SN2 + 1.6, SN2 + 2.7, SN2 + 3.6].map((t, i) => ({ t, at: [CAROL[0] - 0.6 + i * 0.3, CAROL[1] - 0.5], dir: [-0.15, -1],
        impact: [LAC[0] - 2.8 + i * 0.9, LAC[1] - 2.2 - (i % 2) * 1.6], delay: 0.5 })) },
    // snap 3: the guns on the line
    { region: CH, preset: "battery", shots: [SN3 + 0.3, SN3 + 1.5, SN3 + 2.6].map((t, i) => ({ t, at: GUNS_US[i % 2], dir: FR,
        impact: off(i % 2 ? 0.78 : 0.38, 5.0 + (i % 3) * 0.6), delay: 0.55 })) },
  ],
  campfires: [{ region: CH, pts: [[LAC[0] - 3.4, LAC[1] - 0.4], [LAC[0] - 1.0, LAC[1] - 0.2], [LAC[0] + 1.2, LAC[1] - 2.6], [LAC[0] - 2.6, LAC[1] - 3.4], [LAC[0] + 3.0, LAC[1] - 0.8], [LAC[0] + 0.4, LAC[1] - 4.6]],
    t0: N0, t1: SN2 + 1.8 }],   // the British put their fires out under the Carolina's guns
};

// ---------------- overlay cards (DOM, 1920 space, pure functions of the timeline) ----------------
const CSS = `
.aj-bk{position:absolute;left:0;top:0;width:1920px;height:1080px;background:radial-gradient(ellipse 70% 70% at 50% 46%,rgba(12,9,6,.5),rgba(6,4,3,.8))}
.aj-card{position:absolute;color:#EEE7D6;font-family:"GM Cormorant",Georgia,serif;text-align:center;
  background:linear-gradient(180deg,#2b2216 0%,#1d160e 55%,#171109 100%);box-shadow:0 14px 40px rgba(0,0,0,.7),inset 0 0 0 4px #15110c,inset 0 0 0 5.5px rgba(201,178,122,.85),inset 0 0 70px rgba(0,0,0,.55)}
.aj-card .tex{position:absolute;inset:0;opacity:.16;mix-blend-mode:screen;background:repeating-linear-gradient(97deg,rgba(255,240,210,.0) 0 7px,rgba(255,240,210,.05) 7px 8px),repeating-linear-gradient(3deg,rgba(255,240,210,.0) 0 11px,rgba(255,240,210,.04) 11px 12px)}
.aj-ghent{left:410px;top:230px;width:1100px;height:560px}
.aj-ghent .hd{position:absolute;left:0;right:0;top:52px;font-family:"GM Cinzel",serif;font-weight:700;font-size:27px;letter-spacing:.46em;color:#C9B27A;padding-left:.46em}
.aj-ghent .tt{position:absolute;left:0;right:0;top:118px;font-family:"GM Cinzel",serif;font-weight:700;font-size:124px;letter-spacing:.14em;padding-left:.14em;line-height:1;
  background:linear-gradient(180deg,#fff1c4,#e8c46c 45%,#b98a35 70%,#f0d28a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 4px rgba(0,0,0,.7))}
.aj-ghent .pt{position:absolute;left:0;right:0;top:268px;font-family:"GM Cinzel",serif;font-weight:700;font-size:40px;letter-spacing:.3em;padding-left:.3em;color:#EEE7D6}
.aj-ghent .rule{position:absolute;left:330px;right:330px;top:252px;height:1.5px;background:linear-gradient(90deg,transparent,#C9B27A,transparent)}
.aj-seal{position:absolute;top:150px;width:132px;height:132px;border-radius:50%;font-family:"GM Cinzel",serif;font-weight:700;font-size:40px;line-height:132px;color:rgba(255,214,190,.55);letter-spacing:.04em;
  background:radial-gradient(circle at 38% 34%,#d2503c 0%,#a8261b 38%,#7a1610 70%,#5a0f0a 100%);
  box-shadow:0 5px 10px rgba(0,0,0,.6),inset 0 0 0 9px rgba(120,20,14,.55),inset 0 0 0 11px rgba(255,170,140,.18),inset 0 -6px 12px rgba(0,0,0,.35);text-shadow:0 -1px 1px rgba(0,0,0,.5),0 1px 0 rgba(255,190,160,.25)}
.aj-seal.l{left:92px}.aj-seal.r{right:92px}
.aj-seal::after{content:"";position:absolute;inset:-7px;border-radius:47% 53% 50% 50%/52% 46% 54% 48%;background:radial-gradient(circle at 40% 35%,#b8352a,#7a1610);z-index:-1}
.aj-stamp{position:absolute;left:50%;top:352px;margin-left:-160px;width:320px;font-family:"GM Cinzel",serif;font-weight:700;font-size:58px;letter-spacing:.16em;padding:6px 0 2px .16em;color:#C8382A;
  border:5px solid #C8382A;border-radius:6px;text-shadow:0 0 1px #C8382A;box-shadow:0 0 0 2px rgba(200,56,42,.25)}
.aj-ghent .nr{position:absolute;left:0;right:0;top:482px;font-family:"GM Cinzel",serif;font-weight:700;font-size:30px;letter-spacing:.2em;padding-left:.2em;color:#E9A090}
.aj-pseal{position:absolute;left:1330px;top:250px;width:300px;text-align:center}
.aj-pseal .aj-seal{position:relative;display:inline-block;left:auto;right:auto;top:auto;width:104px;height:104px;line-height:104px;font-size:30px}
.aj-pseal .rb{position:absolute;left:50%;top:84px;width:70px;height:56px;margin-left:-35px;background:linear-gradient(90deg,#7a1610 0 46%,transparent 46% 54%,#7a1610 54%);clip-path:polygon(0 0,46% 0,30% 100%,18% 80%,6% 100%,0 0,54% 0,100% 0,94% 100%,82% 80%,70% 100%,54% 0);z-index:-2}
.aj-pseal .cap{margin-top:30px;font-family:"GM Cinzel",serif;font-weight:700;font-size:28px;letter-spacing:.2em;color:#EEE7D6;text-shadow:0 2px 6px rgba(0,0,0,.9),0 0 14px rgba(0,0,0,.6)}
.aj-scar{left:1190px;top:236px;width:600px;height:470px}
.aj-scar svg{position:absolute;left:0;top:0;width:600px;height:300px;overflow:visible}
.aj-scar .cap{position:absolute;left:0;right:0;top:262px;font-family:"GM Cinzel",serif;font-weight:700;font-size:30px;letter-spacing:.14em;padding-left:.14em;color:#EEE7D6}
.aj-scar .age{position:absolute;left:0;right:0;top:318px;font-family:"GM Cinzel",serif;font-weight:700;font-size:92px;letter-spacing:.12em;padding-left:.12em;line-height:1;
  background:linear-gradient(180deg,#fff1c4,#e8c46c 45%,#b98a35 70%,#f0d28a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 3px rgba(0,0,0,.7))}
.aj-scar .src{position:absolute;left:0;right:0;top:420px;font-style:italic;font-weight:600;font-size:27px;letter-spacing:.06em;color:#C9B27A}
`;
const SCARP = "M70 196 C150 172 230 142 300 118 C370 94 450 70 532 52";   // a sabre cut across the card, rising left -> right
let CARDS = null;
const buildCards = (ctx) => { const { tl } = ctx;
  const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
  const host = document.querySelector("#ov .gmo") || document.getElementById("ov");
  const mk = (cls, html) => { const e = document.createElement("div"); e.className = cls; e.innerHTML = html; host.appendChild(e); gsap.set(e, { autoAlpha: 0 }); return e; };
  const bk = mk("aj-bk", "");
  // owner fix: "a prize to bargain with at the peace table": a small wax seal + PEACE TABLE (over the closing cloud deck)
  const ps = mk("aj-pseal", `<div class="rb"></div><div class="aj-seal"></div><div class="cap">PEACE TABLE</div>`);
  tl.fromTo(ps, { autoAlpha: 0, scale: 1.5, rotation: -10 }, { autoAlpha: 1, scale: 1, rotation: -4, duration: 0.24, ease: "power4.in", immediateRender: false }, T.peace0 - 0.05);
  tl.fromTo(ps, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, immediateRender: false }, SWT - 0.35);
  const gh = mk("aj-card aj-ghent", `<div class="tex"></div><div class="hd">Two weeks earlier</div><div class="aj-seal l">GB</div><div class="aj-seal r">US</div>
    <div class="tt">GHENT</div><div class="rule"></div><div class="pt">PEACE TREATY</div><div class="aj-stamp">SIGNED</div><div class="nr">NOT YET RATIFIED BY AMERICA</div>`);
  const sc = mk("aj-card aj-scar", `<div class="tex"></div><svg viewBox="0 0 600 300"><path class="g" d="${SCARP}" fill="none" stroke="rgba(200,40,28,.35)" stroke-width="22" stroke-linecap="round" style="filter:blur(6px)"/>
    <path class="c" d="${SCARP}" fill="none" stroke="#9e1d14" stroke-width="9" stroke-linecap="round"/><path class="h" d="${SCARP}" fill="none" stroke="#e46a52" stroke-width="2.4" stroke-linecap="round"/></svg>
    <div class="cap">A BRITISH OFFICER'S SWORD</div><div class="age">AGE 14</div><div class="src">by his own account</div>`);
  const q = (e, s) => e.querySelector(s), on = (e, t, d = 0.35, from = { y: 10 }) => { gsap.set(e, { autoAlpha: 0 }); tl.fromTo(e, { autoAlpha: 0, ...from }, { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: d, ease: "power2.out", immediateRender: false }, t); };
  // Ghent (hard cut at CUT_G): the backdrop and the plate are there on the cut frame
  tl.fromTo(bk, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, T.weeks - 0.5);   // round 1: dim 0.3 s before the card
  tl.fromTo(bk, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.6, immediateRender: false }, CUT_N - 0.35);   // fromTo: exact when the renderer seeks out of order
  tl.fromTo(gh, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out", immediateRender: false }, T.weeks - 0.2); tl.to(gh, { autoAlpha: 0, duration: 0.4 }, CUT_N - 0.4);
  ["hd", "tt", "rule", "pt", "nr"].forEach((c) => gsap.set(q(gh, "." + c), { autoAlpha: 0 }));
  on(q(gh, ".hd"), T.weeks); on(q(gh, ".tt"), T.ghent, 0.45, { y: 0, scale: 1.08 }); on(q(gh, ".rule"), T.peace, 0.4, { y: 0 }); on(q(gh, ".pt"), T.peace, 0.45); on(q(gh, ".nr"), T.not, 0.45);
  gh.querySelectorAll(".aj-seal").forEach((s, i) => { gsap.set(s, { autoAlpha: 0 }); tl.fromTo(s, { autoAlpha: 0, scale: 1.7, rotation: -14 + i * 22 }, { autoAlpha: 1, scale: 1, rotation: -6 + i * 10, duration: 0.22, ease: "power4.in", immediateRender: false }, T.both + i * 0.16); });
  const stp = q(gh, ".aj-stamp"); gsap.set(stp, { autoAlpha: 0 });
  tl.fromTo(stp, { autoAlpha: 0, scale: 2.3, rotation: -14 }, { autoAlpha: 0.95, scale: 1, rotation: -7, duration: 0.22, ease: "power4.in", immediateRender: false }, T.signed - 0.05);
  tl.fromTo(gh, { x: 0, y: 0 }, { keyframes: [{ x: 3, y: 2, duration: 0.04 }, { x: -2, y: -1, duration: 0.05 }, { x: 0, y: 0, duration: 0.08 }], immediateRender: false }, T.signed + 0.17);
  // the scar card (right side, the map dimmed a little)
  tl.fromTo(sc, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power2.out", immediateRender: false }, T.scar - 0.12); tl.to(sc, { autoAlpha: 0, duration: 0.35 }, T.name - 0.2);
  sc.querySelectorAll("path").forEach((p, i) => { const L = 520; p.style.strokeDasharray = `${L}`; gsap.set(p, { strokeDashoffset: L });
    tl.fromTo(p, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.28, ease: "power3.in", immediateRender: false }, T.scar + 0.05 + (i === 0 ? 0.12 : 0)); });
  ["cap", "age", "src"].forEach((c) => gsap.set(q(sc, "." + c), { autoAlpha: 0 }));
  on(q(sc, ".cap"), T.sword); on(q(sc, ".age"), T.fourteen - 0.05, 0.4, { y: 0, scale: 1.15 }); on(q(sc, ".src"), T.fourteen + 0.2);
  CARDS = { bk, gh, sc }; };

// 8 Jan morning fog: a light ground veil over the field (canvas under the troops' DOM and the overlay; the 3D blocks stay readable
// through it at <= 0.3 alpha), drifting slowly, thinning from "five thousand" until it is gone as the British reach the ditch
const fog = { build() { const c = document.createElement("canvas"); c.width = 640; c.height = 360; c.style.cssText = "position:absolute;inset:0;width:1280px;height:720px;pointer-events:none";
    const tr = document.getElementById("troops"); tr.parentNode.insertBefore(c, tr); this.c = c; this.g = c.getContext("2d"); },
  draw(t, ctx) { const g = this.g; if (!g) return; g.clearRect(0, 0, 640, 360);
    const k = VX.sstep(DV.clear, DV.clear + 0.9, t) * (1 - VX.sstep(T.five - 0.3, GB_HALT - 0.6, t)) * (t < CUT_G ? 1 : 0); if (k <= 0.002 || ctx.world.cameraAt(t).region !== CH) return;
    for (let i = 0; i < 26; i++) { const x = ((hsh(i, 1) * 820 + t * (6 + hsh(i, 2) * 6)) % 820) - 90, y = 120 + hsh(i, 3) * 230, r = 70 + hsh(i, 4) * 90;
      const gr = g.createRadialGradient(x, y, 0, x, y, r), a = 0.26 * k * (0.6 + 0.4 * hsh(i, 5));
      gr.addColorStop(0, `rgba(226,228,222,${a.toFixed(3)})`); gr.addColorStop(1, "rgba(226,228,222,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    const lg = g.createLinearGradient(0, 80, 0, 360); lg.addColorStop(0, "rgba(220,222,216,0)"); lg.addColorStop(1, `rgba(220,222,216,${(0.22 * k).toFixed(3)})`); g.fillStyle = lg; g.fillRect(0, 80, 640, 280); } };

// the general's banner: no portrait (a "?" silhouette) until "Jackson", then the Jarvis portrait
const MYST = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="76" height="100" viewBox="0 0 76 100"><path d="M38 18 C27 18 22 26 22 35 C22 44 27 51 31 54 L31 58 C18 61 8 70 6 100 L70 100 C68 70 58 61 45 58 L45 54 C49 51 54 44 54 35 C54 26 49 18 38 18 Z" fill="#120e09" fill-opacity=".86"/><text x="38" y="49" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="30" fill="#e2c88e">?</text></svg>');
const BAN0 = [CITY[0] + 7.5, CITY[1] - 10.5], BAN1 = [CITY[0] + 1.2, CITY[1] - 1.4];

const build = async (ctx) => { WW = ctx.world;
  // the Mississippi glows gold: from the mouth up to the city on "mouth of the Mississippi", then on up the valley on "the whole American West"
  ctx.FX[GULF].custom((t, push) => { if (!WW || t < T.mouth - 0.3 || t > DV.full + 0.2) return;
    const fade = 1 - sstep(DV.deckIn + 0.2, DV.full, t), k1 = sstep(T.mouth - 0.2, T.miss + 0.5, t), k2 = sstep(T.miss + 0.3, DV.deckIn + 0.1, t);
    for (let i = 0; i < RIVG.length; i += 3) { const p = RIVG[i]; let a = 0;
      if (i >= iNO) { const s = (iEND - i) / (iEND - iNO); a = sstep(s - 0.08, s, k1 * 1.08); }                    // mouth -> city
      else { const s = (iNO - i) / iNO; a = sstep(s - 0.06, s, k2 * 1.06); }                                         // city -> the west edge
      if (a <= 0.01) continue; const pulse = 0.85 + 0.15 * Math.sin(t * 2.4 - i * 0.02);
      push(p[0], waterY(GULF, p[2]) + 0.3, p[1], 9, 0.42 * a * fade * pulse, GOLD[0], GOLD[1], GOLD[2], 6, 2); } });
  buildCards(ctx); fog.build(ctx);
  // the banner reveal on "Jackson": the portrait swaps in, the plaque reads JACKSON (banner.js BN.reveal)
  const b = ctx.BANNERS.find((x) => x.region === NO); if (b) BN.reveal(b.e.firstElementChild, "seq/jackson.png", "Jackson", T.jackson);
};

window.SEQ = {
  name: "S01", D: T.D, T, seed: 1815, date: "1815-01-08",
  regions: [GULF, CH, NO, HB],
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  regionOpts: { [GULF]: { troopScale: 12 }, [CH]: { troopScale: 1.4 }, [NO]: { troopScale: 4.2 }, [HB]: { troopScale: 1.6 } },
  keys: [
    // A: the gulf, ONE continuous push from altitude toward the plain below the city (the dive's push takes over at 8.35)
    { t: 0.0, region: GULF, at: [420, 852], dist: 540, tilt: 34, yaw: -6, fov: 30 },
    { t: 4.6, region: GULF, at: [418, 856], dist: 490, tilt: 37, yaw: -5, fov: 30, ease: "lin" },
    // B: after the emergence (land 15.5): a slow drift over the field while the lines meet
    { t: 21.5, region: CH, at: [CLASHC[0] - 0.4, CLASHC[1] - 0.2], dist: 19.5, tilt: 51, yaw: -26, fov: 30 },
    { t: CUT_G, region: CH, at: [CLASHC[0] - 0.9, CLASHC[1] - 0.4], dist: 18.5, tilt: 52, yaw: -29, fov: 30, ease: "lin" },
    // C: HARD CUT to the city (dimmed under the Ghent card)
    { t: CUT_G, region: NO, at: [CITY[0] + 7, CITY[1] + 2], dist: 92, tilt: 46, yaw: -4, fov: 30, ease: "cut" },
    { t: CUT_N, region: NO, at: [CITY[0] + 5, CITY[1] + 1.5], dist: 86, tilt: 47, yaw: -4, fov: 30, ease: "lin" },
    // D: New Orleans on its word, then down the river to Villere's (the British come out of the swamp), pull back for the 9 miles,
    // back up to the city for the general, a slow push in under the name
    { t: T.twoWeeks - 0.3, region: NO, at: [CITY[0] + 6, CITY[1] + 2], dist: 84, tilt: 47, yaw: -3, fov: 30, ease: "lin" },
    { t: T.come + 0.4, region: NO, at: [VIL[0] - 6, VIL[1] - 3.5], dist: 74, tilt: 50, yaw: -2, fov: 30 },
    { t: T.nine - 0.1, region: NO, at: [1247, 3226], dist: 110, tilt: 49, yaw: -1, fov: 30 },
    { t: T.general, region: NO, at: [1245, 3225.5], dist: 112, tilt: 49, yaw: -1, fov: 30, ease: "lin" },
    { t: T.thin + 0.8, region: NO, at: [CITY[0] + 6, CITY[1] - 1], dist: 82, tilt: 48, yaw: -4, fov: 30 },
    { t: SN1, region: NO, at: [CITY[0] + 4.6, CITY[1] - 1.2], dist: 75, tilt: 49, yaw: -5, fov: 30, ease: "lin" },
    // E1: Horseshoe Bend from above
    { t: SN1, region: HB, at: [8703.6, 1281.8], dist: 33, tilt: 40, yaw: 0, fov: 30, ease: "cut" },
    { t: SN2, region: HB, at: [8703.8, 1281.2], dist: 29, tilt: 42, yaw: -4, fov: 30, ease: "lin" },
    // E2: the night of 23 December
    { t: SN2, region: CH, at: [1277.8, 3238.0], dist: 23, tilt: 52, yaw: -8, fov: 30, night: 1, ease: "cut" },
    { t: SN3, region: CH, at: [1277.2, 3237.8], dist: 21, tilt: 53, yaw: -5, fov: 30, night: 1, ease: "lin" },
    // E3: the mud line in the smoke, then a slow pull back as the promise is said
    { t: SN3, region: CH, at: [1254.6, 3226.2], dist: 21, tilt: 50, yaw: 8, fov: 30, ease: "cut" },
    { t: T.these, region: CH, at: [1255.2, 3226.4], dist: 25, tilt: 50, yaw: 4, fov: 30, ease: "lin" },
    { t: T.D, region: CH, at: [1256.2, 3226.6], dist: 34, tilt: 48, yaw: 0, fov: 30 },
  ],
  dives: [{ t: SWT, over: OVER, off: DOFF,
    from: { region: GULF, at: [356, 838], dist: 400, tilt: 42, yaw: -4 },
    to: { region: CH, at: CLASHC, dist: 21, tilt: 50, yaw: -24, fov: 30 } }],
  clouds: {
    [GULF]: { scatter: { seed: 3 }, keepClear: [[312, 807, 75, 1, 0.8], [560, 915, 70, 1, 0.8], [200, 760, 60, 1, 0.6]] },
    [CH]: { shadows: true },
    [NO]: { keepClear: [[1244, 3224, 80, 1, 0.85], [1205, 3210, 50, 1, 0.9]] },
    [HB]: { shadows: true },
  },
  title: { text: "ANDREW JACKSON", font: "cinzel-latin-700-normal.woff2", width: 0.6, tOn: T.andrew + 0.5, tGrow: T.jackson + 0.5, tOff: SN1 - 0.3, anchorT: T.jackson, region: NO, depth: 0.3, up: 0.17 },
  units, arrows,
  generals: {
    jackson: { img: "seq/jackson.png", flag: "seq/us15_flag.png", side: "us", name: "Jackson", full: "Andrew Jackson", role: "Major General" },
  },
  banners: [
    { general: "jackson", img: MYST, name: "?", region: NO, keys: [[0, ...BAN0], [T.general + 0.2, ...BAN0], [T.thin + 0.4, ...BAN1]], t0: T.general, t1: SN1 + 0.2 },
    { general: "jackson", region: HB, keys: [[0, BW[0] - 0.6, BW[1] - 4.6]], t0: SN1 + 0.05, t1: SN2 + 0.3 },
    { general: "jackson", region: CH, keys: [[0, DLR[0] - 2.6, DLR[1] - 2.6]], t0: SN2 + 0.05, t1: SN3 - 0.02 },
  ],
  labels: [
    { text: "New Orleans", town: "New Orleans", size: 26, t0: T.orleans, t1: T.orleans + 3.6, region: GULF },
    { text: "Mississippi River", at: [208, 752], size: 20, t0: T.miss + 0.05, t1: DV.full - 0.35, region: GULF, river: true },
    { text: "New Orleans", at: [CITY[0], CITY[1] - 2.4], size: 24, t0: T.orleans2, t1: T.orleans2 + 3.6, region: NO },
    { text: "Mississippi River", at: [1226, 3226.5], size: 18, t0: T.river2, t1: T.river2 + 3.4, region: NO, river: true },
  ],
  boats: FLEET(FLEETP, 9, 7, { region: GULF, t0: -1, t1: SWT, size: 5.0, spread: 24, depth: 52, speed: FLV, s0: FLS0 })
    .concat([{ region: CH, kind: "ship", n: 1, size: 0.75, path: CARP, sAt: () => VX.len(CARP) * 0.5, t0: N0, t1: N1, lamp: true, wake: false }]),
  fx, build, draw: (t, ctx) => fog.draw(t, ctx),
  overlay: [
    ["plaque.date", T.eighteen, { month: "Winter 1814", day: "", weekday: "", note: "" }],
    ["label", T.burned, T.burned + 3.4, { name: "Washington burned", world: (t) => { const p = fleetLead(t); return [p[0] + 6, p[1] - 4, 0]; }, side: "uk", marker: false }],
    // B
    ["plaque.date", T.eighth, { month: "January", day: "8", weekday: "", note: "" }],   // round 1: day + month on "eighth", the year on "eighteen fifteen"
    ["plaque.date", T.e1815, { month: "January 1815", day: "8", weekday: "", note: "" }],
    ["number", T.five, T.ditch - 0.1, { value: 5000, round: 1, suffix: "+", x: 960, y: 250, size: 116 }],   // round 1: the first hard number, on its word
    ["label", T.regulars, T.ditch - 0.1, { name: "British regulars", x: 960, y: 360, marker: false, side: "uk", offset: [-150, 0] }],
    ["label", T.ditch + 0.05, T.half - 0.2, { name: "A ditch and a wall of mud", world: off(0.18, -1.2), side: "us", marker: false, offset: [-470, -30] }],
    ["plaque.note", T.half - 0.25, "about half an hour"],
    ["number", T.two, T.americans - 0.3, { value: 2000, round: 1, suffix: "+", x: 960, y: 250, size: 120 }],
    ["label", T.killed, T.americans - 0.3, { name: "British", sub: "killed, wounded or captured", x: 960, y: 360, marker: false, side: "uk", offset: [-190, 0] }],
    ["number", T.seventy, CUT_G - 0.15, { value: 71, round: 1, side: "fr", x: 960, y: 250, size: 120 }],
    ["label", T.killed2 - 0.1, CUT_G - 0.15, { name: "Americans", sub: "killed, wounded or missing", x: 960, y: 360, marker: false, side: "us", offset: [-190, 0] }],
    // D
    ["plaque.date", T.twoWeeks, { month: "December 1814", day: "23", weekday: "", note: "" }],
    ["distance", T.nine - 0.1, T.general + 0.6, { from: [VIL[0] - 0.5, VIL[1] - 2.0, 0], to: [CITY[0] + 1.5, CITY[1] + 0.6, 0], value: 9, unit: "MILES", sub: "from the city", dash: false }],
    ["label", T.illness, T.scar - 0.3, { name: "The general", sub: "worn down by illness", world: [BAN1[0], BAN1[1], 0], side: "us", marker: false, offset: [70, -150] }],
    ["film.dim", T.scar - 0.25, T.name - 0.3, 0.5],
    // E
    ["plaque.date", SN1, { month: "1814 - 1815", day: "", weekday: "", note: "" }],
    ["film.grade", SN2, "night", 0.1],
    ["film.grade", SN3, "day", 0.1],
    ["title", T.three, T.D - 1.8, { lines: ["THREE GREATEST", "TACTICAL MOVES"], y: 250 }],
  ],
};
})();
