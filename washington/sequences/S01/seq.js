// S01 HOOK (74.04 s; washington/tools/scene_times.py S01 --words). George Washington film, Battle 21. Structure copied from ajackson S01.
// A  0.0-14.5  colonies from altitude, winter light: red posts settling across New Jersey (Trenton, Bordentown, Princeton, New Brunswick,
//              Perth Amboy, Elizabeth Town, Hackensack), the small blue army walking up to the Pennsylvania bank, separate boats pulled
//              down the Delaware to the PA bank; plate DECEMBER 1776 on "seventeen seventy-six"; NEW YEAR'S EVE tag on its words;
//              the Delaware glows on "Delaware"; ONE continuous push onto McConkey's Ferry -> cloud dive 1 (swap 14.5, emerges at night).
// B 14.5-19.9  crossing, Christmas night, storm: sleet streaks (VX.rain), separate Durham boats with lanterns crossing (and coming back)
//              among the ice floes, blue lines waiting on the PA bank, one landed on the NJ bank; plate 25 on "Christmas night";
//              2,400 on "two thousand four hundred".
// C 19.9-30.1  dissolve to Trenton, grey dawn, sleet: Greene's column down the Pennington road, Sullivan's down the River road, a third
//              line closing the Princeton road; guns at the head of King / Queen St fire down the streets; the Hessians spill out east
//              and are boxed in; 900 on "nine hundred", HESSIAN PRISONERS, NOT ONE AMERICAN KILLED on their words.
// D 30.1-39.5  HARD CUT: colonies, late summer: Brooklyn Heights pulses, a red ring closes round it (red lines + arrows, ships in the
//              bay), the East River glows behind it. Plate unchanged (no date spoken).
// E 39.5-46.2  dissolve: Trenton by day, 2 January: the British army comes down the Princeton road, the blue line behind the Assunpink,
//              the stone bridge glows, the Delaware behind.
// F 46.2-55.5  dissolve: colonies over the PA bank: the general's banner (no portrait, "?"); the letter card on "brother", "I think
//              the game is pretty near up." typed on its words; 3D gold GEORGE WASHINGTON (Cinzel) on "George Washington", the Peale
//              portrait revealed on "Washington".
// G 55.5-74.0  three snap cuts on their words: the East River at night with separate boats shuttling (brooklyn); the Delaware in the
//              storm (crossing); the orchard at Princeton with smoke; THREE GREATEST TACTICAL MOVES on "three".
(() => {
const T = { D: 73.98, december: 0.56, e1776: 1.65, revolution: 3.14, time: 5.38, nye: 6.48, eve: 7.20, army: 8.72, home: 9.70, what: 10.66,
  delaware: 12.60, christmas: 13.90, about: 15.46, two: 15.86, hundred: 16.46, crossed: 17.16, icy: 17.72, storm: 18.72,
  dawn: 19.96, fell: 20.70, hessians: 21.30, trenton: 21.90, hour: 23.60, nine: 24.69, prisoners: 25.64, not: 26.76, american: 27.28,
  killed: 28.26, fight: 29.04, strangest: 30.15, four: 31.90, trapped: 34.78, good: 35.34, hill: 36.28, brooklyn: 36.74, river2: 37.82,
  back: 38.48, week: 39.62, trenton2: 40.40, trapped2: 41.62, again: 41.94, british: 43.14, front: 44.08, river3: 44.74, behind: 44.98,
  weekBefore: 46.36, christmas2: 47.18, general: 48.30, written: 49.06, brother: 49.70, think: 50.54, game: 51.04, up: 52.02,
  his: 53.02, name: 53.24, george: 53.82, washington: 54.24, he1: 55.46, steal: 55.76, trap: 57.14, night: 58.10, he2: 58.46,
  cross: 59.22, icy2: 59.72, storm2: 60.78, fall: 61.48, trenton3: 62.02, dawn2: 62.64, and3: 63.58, slip: 64.00, british3: 64.96,
  dark: 65.96, strike: 66.62, behind2: 66.96, it2: 67.40, these: 68.38, george2: 68.80, three: 70.24, moves: 71.56 };   // round 1: re-voiced "an icy river" (scene_times 2026-11-26)
const CO = "colonieswinter", CR = "crossing", TR = "trenton", BR = "brooklyn", PR = "princeton";
const sstep = VX.sstep, hsh = VX.hsh;
const SWT = 14.5, DOFF = { push: -4.0, deckIn: -1.0, full: -0.45, deck: -0.4, wIn: -0.3, inside: -0.12, warm: 0.08, emerge: 0.35, clear: 0.5, haze: 1.0, land: 2.0 },   // Jackson S01 round 3 profile
  DV = VX.diveTimes(SWT); for (const k in DOFF) DV[k] = SWT + DOFF[k];   // push 10.5, deckIn 13.5, full 14.05, emerge 14.85, clear 15.0, land 16.5
const CUT_C = 19.9, CUT_D = 30.06, CUT_E = 39.5, CUT_F = 46.2;
const SN1 = T.he1, SN2 = T.he2 + 0.35, SN3 = T.and3;   // the three snap cuts
const NI = 1.0;   // V2: a real night (v8 / S09_gm night 1 + the night grade)

// ---------------- geography ----------------
const P = (n, r) => VX.place(n, r);
const lerp2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
// nearest centre point + unit tangent of a river polyline
const riverAt = (r, name, q) => { const R = VX.river(r, name).pts; let b = 0; for (let i = 0; i < R.length; i++) if (Math.hypot(R[i][0] - q[0], R[i][1] - q[1]) < Math.hypot(R[b][0] - q[0], R[b][1] - q[1])) b = i;
  const a = R[Math.max(0, b - 3)], c = R[Math.min(R.length - 1, b + 3)], l = Math.hypot(c[0] - a[0], c[1] - a[1]) || 1; return { p: [R[b][0], R[b][1]], t: [(c[0] - a[0]) / l, (c[1] - a[1]) / l], i: b, pts: R }; };

// colonies (z9)
const MKC = P("McConkey's Ferry", CO), TRC = P("Trenton", CO), PRC = P("Princeton", CO), NBC = P("New Brunswick", CO), PAC = P("Perth Amboy", CO);
const BOC = P("Bordentown", CO), ETC = P("Elizabeth Town", CO), HKC = P("Hackensack", CO), BFC = P("Fulton Ferry landing (Brooklyn ferry)", CO);
const OVER = MKC;
// the Delaware in colonies units: the PA bank from above Coryell's down to McConkey's (boats pulled down to the crossing)
const DLC = riverAt(CO, "Delaware River", MKC);
const DLI = DLC.i, DLR = DLC.pts;

// crossing (z12): the river at the ferry, its tangent (downstream, NW -> SE) and normal (PA -> NJ)
const MK = P("McConkey's Ferry", CR), JF = P("Johnson's Ferry", CR);
const XR = riverAt(CR, "Delaware River", lerp2(MK, JF, 0.5));
const XT = XR.t, XN = (() => { let n = [-XT[1], XT[0]]; if ((JF[0] - MK[0]) * n[0] + (JF[1] - MK[1]) * n[1] < 0) n = [-n[0], -n[1]]; return n; })();
const XWL = XR.pts[XR.i][2], XC = XR.p, xo = (a, b) => [XC[0] + XT[0] * a + XN[0] * b, XC[1] + XT[1] * a + XN[1] * b];   // a along the river (downstream +), b across (NJ +); banks at b = +-5.25
const XFACE = Math.atan2(XN[1], XN[0]);   // facing NJ

// trenton (z11)
const HEAD = P("King Street / Queen Street head", TR), BRIDGE = P("Assunpink bridge", TR), RALLHQ = P("Rall's headquarters", TR);
const SURR = P("Hessian surrender field", TR);
const AL = VX.work(TR, 0).pts || VX.work(TR, 0);   // American line, 2 Jan (south bank of the Assunpink)
const ALP = (k) => VX.along(AL.map((p) => [p[0], p[1]]), VX.len(AL.map((p) => [p[0], p[1]])) * k);

// brooklyn (z11): the ferry track
const BRF = [2479.4, 1146.4], NYL = [2467.6, 1131.6];   // the Brooklyn ferry stairs and Peck Slip at the 1776 waterline (the research points sit in the river)
// princeton (z11)
const ORCH = P("William Clarke orchard", PR);

const lin = (c) => c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
const GOLD = lin([0xe0 / 255, 0xb8 / 255, 0x5a / 255]);
let WW = null;
// boats ride on the water surface (river level h_m x ys), not on the carved bed: h(t, i) = water - ground at the boat
const onWater = (r, wl, path, sAt) => (t, i) => { if (!WW) return 0.1; const p = VX.along(path, sAt(t, i)); return wl * WW.regions[r].ys + 0.06 - WW.heightAt(p[0], p[1], r); };

// ---------------- units ----------------
const units = [];
// V2 (recipe section 1): ONE block per unit; a v1 unit of n blocks becomes n single-block units side by side, 1.25 block widths apart
const TS = { [CO]: 6.5, [CR]: 1.0, [TR]: 1.7, [BR]: 1.3, [PR]: 0.9 };
const U = (o) => { const n = o.type === "art" ? 1 : (o.n || 1), f = typeof o.face === "number" ? o.face : 0, ax = [-Math.sin(f), Math.cos(f)], sp = 1.25 * 0.7 * 1.44 * (TS[o.region] || 1);
  for (let k = 0; k < n; k++) { const d = (k - (n - 1) / 2) * sp; units.push({ arrive: false, ...o, n: 1, keys: o.keys.map((q) => [q[0], q[1] + ax[0] * d, q[2] + ax[1] * d, ...q.slice(3)]),
    ...(o.cap != null ? { cap: o.cap } : {}) }); } };
// A: colonies. Red posts settle across New Jersey (short walks into their posts, done by ~6 s); the small blue army walks up to the PA bank.
const NYC = P("New York", CO);
// each post: the line walks in from the north (front first, straight down the screen) and halts at its post
[[TRC, 1, 3.0], [BOC, 1, 2.5], [PRC, 1, 2.5], [NBC, 1, 2.5]].forEach(([p, n, d], i) => {
  const v0 = [0, -1], l = Math.hypot(...v0), v = [v0[0] / l, v0[1] / l], st = [p[0] + v[0] * (d + 9), p[1] + v[1] * (d + 9)], end = [p[0] + v[0] * d, p[1] + v[1] * d];
  U({ region: CO, side: "r", type: "inf", n, face: Math.atan2(-v[1], -v[0]), t0: -1, t1: DV.full + 0.2, keys: [[0, ...lerp2(st, end, 0.25)], [1.0 + i * 0.4, ...lerp2(st, end, 0.45)], [5.6 + i * 0.4, ...end]] }); });
// the blue army: behind the river on the PA side, walking up to the bank (facing New Jersey)
const DLN = (() => { let n = [-DLC.t[1], DLC.t[0]]; if (n[0] < 0) n = [-n[0], -n[1]]; return n; })(), PFACE = Math.atan2(DLN[1], DLN[0]);
const PAW = [MKC[0] - DLN[0] * 6 - DLC.t[0] * 12, MKC[1] - DLN[1] * 6 - DLC.t[1] * 12], PAW2 = [MKC[0] - DLN[0] * 7 + DLC.t[0] * 10, MKC[1] - DLN[1] * 7 + DLC.t[1] * 10];
[PAW, PAW2].forEach((p, i) => U({ region: CO, side: "u", type: "inf", n: 1, skirmish: false, face: PFACE, t0: -1, t1: DV.full + 0.2, keys: [[0, p[0] - DLN[0] * 5, p[1] - DLN[1] * 5], [6.0 + i * 0.6, ...p]] }));

// B + SN2: crossing. Blue lines waiting on the PA bank (one walks down to the water), one landed on the NJ bank walking up the road.
const xWin = [[SWT - 0.2, CUT_C + 0.1], [SN2 - 0.1, SN3 + 0.1]];
xWin.forEach(([a, b], w) => {
  U({ region: CR, side: "u", type: "inf", n: 2, face: XFACE, t0: a, t1: b, keys: [[0, ...xo(-3.2, -7.4)]] });
  U({ region: CR, side: "u", type: "inf", n: 2, face: XFACE, t0: a, t1: b, keys: [[0, ...xo(2.4, -8.6)]] });
  U({ region: CR, side: "u", type: "art", n: 1, face: XFACE, t0: a, t1: b, keys: [[0, ...xo(-0.4, -7.4)]] });
  U({ region: CR, side: "u", type: "inf", n: 2, face: XFACE, t0: a, t1: b, keys: [[0, ...xo(-1.0, 8.4)]] });   // round 1: landed and formed (no walk: critic A saw a crab)
});

// C: Trenton, 26 December, grey dawn
const CW = [CUT_C - 0.2, CUT_D + 0.1];
const GRE0 = [1351.2, 2043.6], GRE1 = [1351.2, 2048.6];   // round 1: moves straight down / across the screen (no crab on the oblique camera)             // Greene: down the Pennington road toward the head of the streets
const SUL0 = [1339.0, 2061.4], SUL1 = [1344.6, 2061.4];             // Sullivan: down the River road toward the foot of the town
const STE0 = [1367.4, 2043.2], STE1 = [1367.4, 2047.6];             // a third line closes the Princeton road (north-east)
const fSE = Math.atan2(GRE1[1] - GRE0[1], GRE1[0] - GRE0[0]), fSU = Math.atan2(SUL1[1] - SUL0[1], SUL1[0] - SUL0[0]), fST = Math.atan2(STE1[1] - STE0[1], STE1[0] - STE0[0]);
U({ region: TR, side: "u", type: "inf", n: 2, face: fSE, t0: CW[0], t1: CW[1], keys: [[0, ...GRE0], [20.4, ...GRE0], [23.4, ...GRE1]] });
U({ region: TR, side: "u", type: "inf", n: 2, face: fSU, t0: CW[0], t1: CW[1], keys: [[0, ...SUL0], [20.6, ...SUL0], [23.8, ...SUL1]] });
U({ region: TR, side: "u", type: "inf", n: 2, face: fST, t0: CW[0], t1: CW[1], keys: [[0, ...STE1]] });   // round 1: already across the Princeton road (no oblique walk at the frame edge)
U({ region: TR, side: "u", type: "art", n: 1, face: Math.PI / 2, t0: CW[0], t1: CW[1], keys: [[0, HEAD[0] - 0.1, HEAD[1] - 1.3]] });
// the Hessians spill out of the houses east of King St and try for the Princeton road (north-east), then are boxed in
const fNE = 0;
const RH = [[[1358.6, 2057.8], [1362.4, 2057.8]], [[1358.8, 2061.8], [1363.4, 2061.8]], [[1359.0, 2065.8], [1364.2, 2065.8]]];
RH.forEach(([a, b], i) => U({ region: TR, side: "r", type: "inf", n: 1, face: fNE, t0: CW[0], t1: CW[1], cap: T.prisoners - 0.1 + i * 0.15, capN: 1,
  keys: [[0, ...a], [T.hessians - 0.2 + i * 0.3, ...a], [T.hour + 0.2 + i * 0.3, ...b]] }));

// E: Trenton, 2 January: the British army down the Princeton road; the American line behind the Assunpink
const EW = [CUT_E - 0.2, CUT_F + 0.1];
const fSW = Math.PI / 2;   // round 1: straight down the screen
[[1368.0, 2044.0], [1372.4, 2040.6], [1363.6, 2047.4]].forEach((p, i) => { const q2 = [p[0] - 1.0, p[1] + 5.4];
  U({ region: TR, side: "r", type: "inf", n: 2, face: fSW, t0: EW[0], t1: EW[1], keys: [[0, ...p], [CUT_E + 0.4 + i * 0.4, ...p], [CUT_E + 5.2 + i * 0.4, ...q2]] }); });
[0.05, 0.12, 0.2].forEach((k, i) => { const p = ALP(k);
  U({ region: TR, side: "u", type: i === 1 ? "art" : "inf", n: i === 1 ? 1 : 2, face: -Math.PI / 2, t0: EW[0], t1: EW[1], keys: [[0, p[0], p[1] + 2.6], [CUT_E + 0.6, p[0], p[1] + 2.6], [CUT_E + 3.8, p[0], p[1] + 1.2]] }); });

// D: colonies, August: the red ring closes on Brooklyn Heights
const DW = [CUT_D - 0.2, CUT_E + 0.1];
const BHC = [BFC[0] + 2.0, BFC[1] + 5.0];
U({ region: CO, side: "u", type: "inf", n: 2, face: Math.PI / 2 + 0.4, t0: DW[0], t1: DW[1], keys: [[0, BHC[0] + 1.2, BHC[1] + 1.4]] });
[[26, 0.25], [20, 0.85], [15, 1.45], [19, 2.05]].forEach(([d, a], i) => { const p0 = [BHC[0] + Math.cos(a) * (d + 9), BHC[1] + Math.sin(a) * (d + 9)], p1 = [BHC[0] + Math.cos(a) * d, BHC[1] + Math.sin(a) * d];
  U({ region: CO, side: "r", type: "inf", n: 2, face: a + Math.PI, t0: DW[0], t1: DW[1], keys: [[0, ...p0], [T.four + i * 0.4, ...p0], [T.hill + i * 0.3, ...p1]] }); });

// SN1: brooklyn night, the ferry: a blue line waiting at the landing
const SW1 = [SN1 - 0.1, SN2 + 0.1];
const fNYb = Math.atan2(NYL[1] - BRF[1], NYL[0] - BRF[0]);
U({ region: BR, side: "u", type: "inf", n: 2, face: fNYb, t0: SW1[0], t1: SW1[1], keys: [[0, BRF[0] + 3.0, BRF[1] + 4.6], [SN1 + 0.4, BRF[0] + 3.0, BRF[1] + 4.6], [SN2 - 0.2, BRF[0] + 2.0, BRF[1] + 3.4]] });
// SN3: princeton orchard: Mercer's men (blue) against Mawhood's (red), both firing
const SW3 = [SN3 - 0.1, T.D + 0.1];
const PRF = 0.2;   // the lines face across the orchard (red west, blue east)
U({ region: PR, side: "r", type: "inf", n: 3, face: PRF, t0: SW3[0], t1: SW3[1], keys: [[0, ORCH[0] - 3.4, ORCH[1] - 0.6]] });
U({ region: PR, side: "u", type: "inf", n: 3, face: PRF + Math.PI, t0: SW3[0], t1: SW3[1], keys: [[0, ORCH[0] + 0.6, ORCH[1] + 0.6]] });
U({ region: PR, side: "u", type: "art", n: 1, face: PRF + Math.PI, t0: SW3[0], t1: SW3[1], keys: [[0, ORCH[0] + 1.4, ORCH[1] + 3.0]] });

// ---------------- boats ----------------
// separate Durham boats (Jackson's FLEET idea at the river's scale): each boat its own lane, own speed, own start; some cross loaded,
// some come back empty. Deterministic.
const XBOATS = (seed, t0, t1, n) => { const out = [];
  for (let k = 0; k < n; k++) { const h = (j) => hsh(seed * 31 + k, j), a = -6.0 + 12.0 * (k + 0.3 * h(1)) / n, back = h(2) < 0.3;
    const p0 = xo(a, -4.3), p1 = xo(a + 1.6 + 1.2 * h(3), 4.3), path = back ? [p1, p0] : [p0, p1], L = VX.len(path), v = 0.85 + 0.45 * h(4), s0 = L * (0.05 + 0.75 * h(5));
    out.push({ region: CR, kind: "durham", n: 1, t0, t1, size: 0.75, lampK: 0.5, lamp: true, wake: false, wl: XWL, h: 0.03, load: () => !back, path, sAt: (t) => Math.min(L, s0 + (t - t0) * v * 0.5) }); }   // round 2: S05's Durham boats (men aboard when loaded), lamp glow -50 %
  return out; };
// boats pulled down the Delaware to the PA bank (colonies): separate boats, each its own start, lane and speed
const DOWN = (() => { const out = []; const seg = DLR.slice(Math.max(0, DLI - 60), DLI + 1).map((p) => [p[0], p[1]]);
  for (let k = 0; k < 6; k++) { const h = (j) => hsh(77 + k, j), off = -0.5 - 0.5 * h(1), path = seg.map((p, i) => { const a = seg[Math.max(0, i - 1)], b = seg[Math.min(seg.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [p[0] - (b[1] - a[1]) / l * off, p[1] + (b[0] - a[0]) / l * off]; });
    const L = VX.len(path), v = 1.6 + 0.8 * h(2), s0 = L * (0.25 + 0.6 * k / 6) - 6 * h(3);
    out.push({ region: CO, kind: "barge", n: 1, t0: -1, t1: DV.full + 0.2, size: 1.6, lamp: false, wake: true, path, sAt: (t) => Math.min(L - 1.5 - k * 2.2, s0 + t * v) }); out[out.length - 1].h = onWater(CO, DLR[DLI][2], path, out[out.length - 1].sAt); }
  return out; })();
// brooklyn ferry at night: separate boats on their own lanes across the East River, half of them coming back
const BBOATS = (() => { const out = [], v0 = [NYL[0] - BRF[0], NYL[1] - BRF[1]], L0 = Math.hypot(...v0), u = [v0[0] / L0, v0[1] / L0], nn = [-u[1], u[0]];
  for (let k = 0; k < 9; k++) { const h = (j) => hsh(400 + k, j), lat = -5 + 10 * (k + 0.4 * h(1)) / 9, back = k % 2 === 1;
    const a = [BRF[0] - u[0] * 0.6 + nn[0] * lat * 0.5, BRF[1] - u[1] * 0.6 + nn[1] * lat * 0.5], b = [NYL[0] + u[0] * 0.6 + nn[0] * (lat + (h(2) - 0.5) * 3), NYL[1] + u[1] * 0.6 + nn[1] * (lat + (h(2) - 0.5) * 3)];
    const path = back ? [b, a] : [a, b], L = VX.len(path), v = 1.1 + 0.6 * h(3), s0 = L * (0.08 + 0.7 * h(4));
    out.push({ region: BR, kind: k === 4 ? "ship" : "barge", n: 1, t0: SN1 - 0.1, t1: SN2 + 0.1, size: k === 4 ? 0.5 : 0.55, lampK: 0.5, lamp: true, wake: false, path, sAt: (t) => Math.min(L, s0 + (t - SN1) * v) }); out[out.length - 1].h = onWater(BR, 0, path, out[out.length - 1].sAt); }
  return out; })();
// D: British ships in the bay below Brooklyn (separate ships, Jackson's FLEET helper)
const FLEET = (path, n, seed, o) => { const L = VX.len(path), out = [];
  const nrm = (i) => { const a = path[Math.max(0, i - 1)], b = path[Math.min(path.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]; };
  for (let k = 0; k < n; k++) { const h = (j) => VX.hsh(seed * 31 + k, j), off = (h(1) - 0.5) * 2 * o.spread, drift = (h(2) - 0.5) * o.spread * 0.8;
    let acc = 0; const P = path.map((p, i) => { if (i) acc += Math.hypot(p[0] - path[i - 1][0], p[1] - path[i - 1][1]); const d = off + drift * acc / L, nv = nrm(i); return [p[0] + nv[0] * d, p[1] + nv[1] * d]; });
    const speed = o.speed * (0.9 + 0.2 * h(3)), lag = (k === 0 ? 0 : (0.25 + 0.75 * h(4)) * o.depth) + (h(5) > 0.8 ? o.depth * 0.6 : 0);
    out.push({ region: o.region, kind: "ship", n: 1, t0: o.t0, t1: o.t1, size: o.size * (0.9 + 0.2 * h(6)), lamp: false, wake: true, path: P, s0: o.s0 - lag + (o.dt || 0) * speed, speed }); }
  return out; };
const BAYP = [[600, 335], [603, 318], [607, 305], [609, 296]];   // from the Narrows north up the Upper Bay toward the East River mouth
const boats = [...XBOATS(5, SWT - 0.2, CUT_C + 0.1, 7), ...XBOATS(9, SN2 - 0.1, SN3 + 0.1, 7), ...DOWN, ...BBOATS,
  ...FLEET(BAYP, 6, 21, { region: CO, t0: DW[0], t1: DW[1], size: 1.5, spread: 4, depth: 14, speed: 0.9, s0: 16 - (DW[0] + 1) * 0.9 })];

// ---------------- arrows, pulses ----------------
const arrows = [
  // D: the ring closes (Long Island side), on "trapped"
  { region: CO, side: "r", pts: [[BHC[0] + 30, BHC[1] + 14], [BHC[0] + 19, BHC[1] + 13], [BHC[0] + 9, BHC[1] + 7]], t0: T.trapped - 0.1, dur: 1.4, t1: CUT_E, width: 0.34, maxWidth: 0.34 },
  { region: CO, side: "r", pts: [[BHC[0] + 6, BHC[1] + 30], [BHC[0] + 7, BHC[1] + 19], [BHC[0] + 4, BHC[1] + 9]], t0: T.trapped + 0.3, dur: 1.4, t1: CUT_E, width: 0.34, maxWidth: 0.34 },
  { region: CO, side: "r", pts: [[BHC[0] - 13, BHC[1] + 26], [BHC[0] - 9, BHC[1] + 16], [BHC[0] - 6, BHC[1] + 8]], t0: T.trapped + 0.7, dur: 1.4, t1: CUT_E, width: 0.34, maxWidth: 0.34 },
  // E: the British army comes down the road
  { region: TR, side: "r", pts: [[1378.0, 2024.0], [1371.0, 2033.5], [1364.4, 2042.0]], t0: T.british - 0.05, dur: 1.4, t1: CUT_F, width: 0.43, maxWidth: 0.43 },
];
const pulses = VX.pulses([
  { region: CO, at: BHC, t0: T.hill - 0.1, t1: CUT_E, r: 7, color: [232, 196, 108], period: 1.6 },
  { region: TR, at: BRIDGE, t0: T.trapped2, t1: CUT_F, r: 1.6, color: [232, 196, 108], period: 1.6 },
]);
// the East River behind the Heights (D) + the Delaware (A): a soft gold glow along the water, on their words
const ERIV = [[606.5, 291.5], [611.5, 288.5], [616.0, 285.5], [620.0, 283.5], [624.5, 283.0], [628.5, 281.0], [631.0, 275.5], [633.5, 268.0]];

// ---------------- fx ----------------
const KT = 32 / 28.7, KP = 17 / 28.7;   // V2: framing dist / 28.7 (Trenton 30-34, orchard 15-19)
const VO = (K) => ({ size: 0.85, alpha: 0.13, life: 11, muzzle: 5 * K, windK: 1.1, rate: 2.9 / K, volley: 1.6, roll: 0.9, height: 2.4 * K, cluster: [2.6 * K, 1.4 * K] });
const fx = {
  smokeLines: [
    // V2: v14 musketry (S09_gm SMK) scaled by KF = dist / 28.7; each volley line lasts 2.2-2.4 s but fires ONE volley at t0 (the word gap)
    // C: the American lines fire into the town (dawn, sleet)
    { region: TR, pts: [[GRE1[0] - 0.6, GRE1[1] + 0.9], [GRE1[0] + 0.6, GRE1[1] + 0.9]], t0: 22.45, t1: 24.75, cue: true, opts: { ...VO(KT), dir: [0, 1], volley: 2.4 } },
    { region: TR, pts: [[SUL1[0] + 1.0, SUL1[1] - 1.2], [SUL1[0] + 1.0, SUL1[1] + 1.2]], t0: 22.5, t1: 24.8, cue: true, opts: { ...VO(KT), dir: [1, 0], volley: 2.4 } },
    { region: TR, pts: [[1360.6, 2056.8], [1360.6, 2059.0]], t0: 22.55, t1: 24.85, cue: true, opts: { ...VO(KT), dir: [-1, 0], volley: 2.4 } },
    // SN3: the orchard at Princeton (one volley at the cut, one in the gap after "behind it."; quiet under "These are")
    { region: PR, pts: [[ORCH[0] - 2.9, ORCH[1] - 1.6], [ORCH[0] - 2.5, ORCH[1] + 0.6]], t0: T.it2 + 0.3, t1: T.it2 + 2.6, cue: true, opts: { ...VO(KP), dir: [1, 0.2], volley: 2.4 } },
    { region: PR, pts: [[ORCH[0] - 0.1, ORCH[1] - 0.6], [ORCH[0] + 0.3, ORCH[1] + 1.7]], t0: SN3 + 0.05, t1: SN3 + 2.35, cue: true, opts: { ...VO(KP), dir: [-1, -0.2], volley: 2.4 } },
  ],
  guns: [
    // C: Knox's guns at the head of King and Queen streets fire down the streets
    { region: TR, preset: "field", shots: [22.45].map((t, i) => ({ t, at: [HEAD[0] - 0.1 + (i % 2) * 0.9, HEAD[1] - 0.9], dir: [0, 1], impact: [HEAD[0] + (i % 2) * 1.0, HEAD[1] + 5.5 + (i % 3) * 2.4], delay: 0.3 })) },   // round 2: only in the word gaps after "Trenton." and "prisoners,"
  ],
};

// ---------------- the storm (B + SN2) and the sleet at Trenton (C) ----------------
const rain = VX.rain([[DV.emerge - 0.1, 0], [DV.clear + 0.2, 0.8], [CUT_C - 0.02, 0.8], [CUT_C, 0.45], [CUT_D - 0.02, 0.45], [CUT_D, 0], [SN2 - 0.02, 0], [SN2, 0.8], [SN3 - 0.02, 0.8], [SN3, 0]].map(([t, k]) => [t, k * 0.5]), { n: 2000, slant: 0.3 }   /* V2: veil x0.5, streaks x2 */);

// the general's banner: no portrait (a "?" silhouette) until "Washington", then the Peale portrait (Jackson S01 device)
const MYST = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="76" height="100" viewBox="0 0 76 100"><path d="M38 18 C27 18 22 26 22 35 C22 44 27 51 31 54 L31 58 C18 61 8 70 6 100 L70 100 C68 70 58 61 45 58 L45 54 C49 51 54 44 54 35 C54 26 49 18 38 18 Z" fill="#120e09" fill-opacity=".86"/><text x="38" y="49" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="30" fill="#e2c88e">?</text></svg>');
const BANF = [MKC[0] - 5.5, MKC[1] + 3.5];

const build = async (ctx) => { WW = ctx.world;
  const glow = (r, pts, t0, t1, a0, sz) => ctx.FX[r].custom((t, push) => { if (t < t0 - 0.3 || t > t1 + 0.6) return;
    const k = sstep(t0 - 0.2, t0 + 1.0, t) * (1 - sstep(t1, t1 + 0.5, t)), L = VX.len(pts), n = Math.ceil(L / (sz * 0.5));
    for (let i = 0; i <= n; i++) { const p = VX.along(pts, L * i / n), s = i / n; if (s > sstep(t0 - 0.2, t0 + 1.6, t) * 1.05) continue;
      const pulse = 0.85 + 0.15 * Math.sin(t * 2.4 - i * 0.2); push(p[0], WW.heightAt(p[0], p[1], r) + 0.3, p[1], sz, a0 * k * pulse, GOLD[0], GOLD[1], GOLD[2], 6, 2); } });
  // A: the Delaware glows down to the ferry on "Delaware"; D: the East River glows behind the Heights on "a river at its back"
  glow(CO, DLR.slice(Math.max(0, DLI - 70), Math.min(DLR.length, DLI + 40)).map((p) => [p[0], p[1]]), T.delaware - 0.1, DV.full - 0.1, 0.42, 3.2);
  glow(CO, ERIV, T.river2 - 0.1, CUT_E - 0.3, 0.4, 2.6);
  pulses.build(ctx); rain.build(ctx);
  const b = ctx.BANNERS.find((x) => x.region === CO); if (b) BN.reveal(b.e.firstElementChild, "seq/washington.png", "Washington", T.washington);
};

window.SEQ = {
  grade: { wide: { toe: 14, ct: 0.96, sat: 0.95 }, night: { veil: [12, 18, 28], vt: 0.12, vb: 0.5, sat: 0.85 } },   // V2: the v8 clip wide grade + the tested night veil
  name: "S01", D: T.D, T, seed: 1776, date: "1776-12-25",
  regions: [CO, CR, TR, BR, PR],
  troops: "blocks", troopsOpts: { look: "lineblocks", size: 1.44, depthK: 0.44, sideCol: { u: "#3f5aa0", r: "#be3a2a" }, pal: { u: { coat: 0x6e7cab, plate: 0x7d8ec6 } } },   // V2: = v14
  regionOpts: { [CO]: { troopScale: TS[CO] }, [CR]: { troopScale: TS[CR], fxScale: 6.6 }, [TR]: { troopScale: TS[TR], fxScale: 11 }, [BR]: { troopScale: TS[BR], fxScale: 8.4 }, [PR]: { troopScale: TS[PR], fxScale: 5.6 } },   // V2 recipe table (CO 6.5 ~ 0.022 x the opening dist 270-330; the flashback / F framings 100-130 read larger)
  features: { [CO]: { bridges: Array.from({ length: 60 }, () => ({ hidden: true })) } },   // the small road-bridge meshes read as crosses from altitude
  keys: [
    // A: colonies, ONE continuous push from altitude toward McConkey's Ferry (the dive's push takes over at 10.5)
    { t: 0.0, region: CO, at: [354, 462], dist: 330, tilt: 36, yaw: -4, fov: 30 },
    { t: 5.6, region: CO, at: [342, 468], dist: 300, tilt: 38, yaw: -3, fov: 30, ease: "lin" },
    { t: DV.push - 0.01, region: CO, at: [326, 474], dist: 270, tilt: 40, yaw: -2, fov: 30, night: 0.15, ease: "lin" },
    // B: after the emergence (land 16.5): a slow drift over the river in the storm
    { t: CUT_C, region: CR, at: [XC[0] + XT[0] * 1.4, XC[1] + XT[1] * 1.4], dist: 23, tilt: 52, yaw: -30, fov: 30, night: NI, ease: "lin" },
    // C: dissolve to Trenton, grey dawn
    { t: CUT_C, region: TR, at: [1356.0, 2057.0], dist: 34, tilt: 50, yaw: -6, fov: 30, night: 0.1, ease: "cut", dissolve: 0.9 },
    { t: CUT_D, region: TR, at: [1357.6, 2057.2], dist: 30, tilt: 52, yaw: -2, fov: 30, night: 0.06, ease: "lin" },
    // D: HARD CUT: colonies, late summer, Brooklyn
    { t: CUT_D, region: CO, at: [BHC[0] - 1, BHC[1] + 9], dist: 130, tilt: 42, yaw: 0, fov: 30, ease: "cut" },
    { t: CUT_E, region: CO, at: [BHC[0], BHC[1] + 7], dist: 112, tilt: 44, yaw: 0, fov: 30, ease: "lin" },
    // E: dissolve: Trenton, 2 January, by day
    { t: CUT_E, region: TR, at: [1362.0, 2067.0], dist: 50, tilt: 54, yaw: 0, fov: 30, ease: "cut", dissolve: 0.9 },
    { t: CUT_F, region: TR, at: [1362.5, 2066.5], dist: 47, tilt: 55, yaw: 2, fov: 30, ease: "lin" },
    // F: dissolve: colonies over the PA bank, a slow push in under the letter and the name
    { t: CUT_F, region: CO, at: [MKC[0] - 1, MKC[1] + 11], dist: 120, tilt: 42, yaw: -3, fov: 30, ease: "cut", dissolve: 0.9 },
    { t: SN1, region: CO, at: [MKC[0] - 2, MKC[1] + 9], dist: 98, tilt: 44, yaw: -4, fov: 30, ease: "lin" },
    // G1: the East River at night
    { t: SN1, region: BR, at: [BRF[0] * 0.7 + NYL[0] * 0.3 + 2.0, BRF[1] * 0.7 + NYL[1] * 0.3 + 1.4], dist: 28, tilt: 50, yaw: -14, fov: 30, night: 1, ease: "cut" },
    { t: SN2, region: BR, at: [BRF[0] * 0.7 + NYL[0] * 0.3 + 2.4, BRF[1] * 0.7 + NYL[1] * 0.3 + 1.2], dist: 26, tilt: 51, yaw: -10, fov: 30, night: 1, ease: "lin" },
    // G2: the Delaware in the storm
    { t: SN2, region: CR, at: xo(-1.5, -0.5), dist: 22, tilt: 56, yaw: 18, fov: 30, night: NI, ease: "cut" },
    { t: SN3, region: CR, at: xo(-0.5, 0.2), dist: 20, tilt: 57, yaw: 22, fov: 30, night: NI, ease: "lin" },
    // G3: the orchard at Princeton, then a slow pull back as the promise is said
    { t: SN3, region: PR, at: [ORCH[0] - 1.4, ORCH[1] + 0.6], dist: 15, tilt: 52, yaw: 82, fov: 30, ease: "cut" },   // V2 r1: yaw ~90: the N-S lines run across the frame (v14), not as columns
    { t: T.these, region: PR, at: [ORCH[0] - 1.2, ORCH[1] + 0.8], dist: 18, tilt: 51, yaw: 85, fov: 30, ease: "lin" },
    { t: T.D, region: PR, at: [ORCH[0] - 1.0, ORCH[1] + 1.0], dist: 25, tilt: 49, yaw: 89, fov: 30 },
  ],
  dives: [{ t: SWT, over: OVER, overTo: xo(0, 0), off: DOFF, whooshAt: 12.85,   // round 2: whoosh body in the gap before "On Christmas night"   // overTo = the over point in crossing units (z9 -> z12)
    from: { region: CO, at: [MKC[0] + 4, MKC[1] - 2], dist: 230, tilt: 42, yaw: -2, night: 0.35 },
    to: { region: CR, at: XC, dist: 26, tilt: 52, yaw: -30, fov: 30, night: NI } }],
  clouds: {
    [CO]: { scatter: { seed: 11, n: 24, med: 14 },   /* V2: med ~0.045 x the opening dist */ diveClear: 36, keepClear: [[MKC[0], MKC[1], 24, 1, 0.9], [BHC[0], BHC[1], 70, 1, 1]], extra: [[BHC[0] + 36, BHC[1] - 6, 12, 5.2, 54, 0], [BHC[0] - 34, BHC[1] - 4, 12, 5.0, 52, 0], [BHC[0] + 6, BHC[1] - 34, 13, 5.5, 52, 0]] },   // round 2: diveClear (default 118) emptied the whole opening frame   // round 1 (critic A): visible wide clouds
    [CR]: { shadows: false, opts: {
      erode: (t) => { const e = DV.emerge; return [0, VX.lerp(0.35, 0.7, sstep(e, e + 0.6, t)) + VX.lerp(0, 2.2, sstep(e + 0.3, e + 1.5, t))]; },
      deck: (t) => { const e = DV.emerge; return { x: Math.round(XC[0]) + 4, z: Math.round(XC[1]), r: 9, front: 3 * sstep(e + 0.2, e + 0.7, t), k: 1 }; },
      opacity: (t) => t < SWT - 1 ? 0 : 1 - sstep(DV.emerge + 1.5, DV.emerge + 2.0, t) } },
    [TR]: { shadows: false }, [BR]: { shadows: false }, [PR]: { shadows: true },   // V2: storm / night = no cloud shadows
  },
  title: { text: "GEORGE WASHINGTON", font: "cinzel-latin-700-normal.woff2", width: 0.6, tOn: T.george + 0.5, tGrow: T.washington + 0.5, tOff: SN1 - 0.3, anchorT: T.washington, region: CO, depth: 0.3, up: 0.17 },
  units, arrows, boats,
  generals: {
    washington: { img: "seq/washington.png", flag: "seq/grand_union_flag.png", side: "us", name: "Washington", full: "George Washington", role: "General" },
  },
  banners: [
    { general: "washington", img: MYST, name: "?", region: CO, keys: [[0, ...BANF]], t0: T.general, t1: SN1 + 0.2 },
    { general: "washington", region: BR, keys: [[0, BRF[0] + 7.0, BRF[1] + 3.2]], t0: SN1 + 0.05, t1: SN2 + 0.3 },
    { general: "washington", region: CR, keys: [[0, ...xo(1.6, 7.6)]], t0: SN2 + 0.05, t1: SN3 + 0.3 },
    { general: "washington", region: PR, keys: [[0, ORCH[0] + 3.4, ORCH[1] + 2.2]], t0: SN3 + 0.05, t1: T.D + 1 },
  ],
  labels: [
    { text: "Delaware River", at: [DLR[Math.max(0, DLI - 50)][0] + 4, DLR[Math.max(0, DLI - 50)][1] - 3], size: 20, t0: T.delaware + 0.05, t1: DV.full - 0.3, region: CO, river: true },
    { text: "Trenton", at: [HEAD[0] - 5, HEAD[1] + 4], size: 24, t0: T.trenton, t1: T.trenton + 3.4, region: TR },
    { text: "Brooklyn", at: [BHC[0] + 4, BHC[1] - 1], size: 24, t0: T.brooklyn, t1: T.brooklyn + 2.6, region: CO },
    { text: "Delaware River", at: [1336.0, 2072.0], size: 20, t0: T.river3, t1: CUT_F - 0.2, region: TR, river: true },
  ],
  fx, build, draw: (t, ctx) => { pulses.draw(t, ctx); rain.draw(t); },
  overlay: [
    ["plaque.date", T.e1776, { month: "December 1776", day: "", weekday: "", note: "" }],
    // V2: THE ARMIES key (no subs: the general is not named before the name slam) + the wax-seal campaign timeline (Aug 1776 -> Jan 1777)
    ["legend", 1.9, T.brother - 0.4, { entries: [{ name: "Americans", color: "#3C6E9E" }, { name: "British", color: "#9C3A35" }] }],
    ["timeline.show", 1.4, { month: "1776", year: "1777", cells: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"], at: 4.8 }],
    ["timeline.go", T.four, { at: 0.9, d: 1.2 }],          // "Four months earlier" (Brooklyn, August)
    ["timeline.go", T.week + 0.1, { at: 5.1, d: 1.2 }],    // "a week after Trenton" (2 January)
    ["timeline.go", T.weekBefore, { at: 4.55, d: 1.2 }],   // "A week before Christmas" (18 December)
    ["timeline.hide", T.brother - 0.4],                    // both step out for the letter card
    ["label", T.nye, T.what - 0.3, { name: "New Year's Eve", world: [PAW[0], PAW[1], 0], side: "us", marker: false, offset: [60, -150] }],
    // B
    ["plaque.date", T.christmas, { month: "December 1776", day: "25", weekday: "", note: "Christmas night" }],
    ["number", T.two, CUT_C - 0.3, { value: 2400, round: 100, x: 960, y: 250, size: 116 }],
    ["film.grade", CUT_C, "day", 0.1],
    // C
    ["plaque.date", T.dawn + 0.16, { month: "December 1776", day: "", weekday: "", note: "" }],   // round 3: month-only plate on "dawn" (no empty day cell, no unspoken day; S05 gives the 26th)
    ["label", T.hessians, T.hour - 0.2, { name: "Hessians", world: [1362.4, 2061.0, 0], side: "uk", marker: false, offset: [60, -120] }],
    ["number", T.nine - 0.05, CUT_D - 0.5, { value: 900, round: 10, x: 960, y: 250, size: 120 }],
    ["label", T.prisoners - 0.05, CUT_D - 0.5, { name: "Hessian prisoners", x: 960, y: 360, marker: false, side: "uk", offset: [-190, 0] }],
    ["label", T.not, CUT_D - 0.5, { name: "Not one American killed", sub: "in the fight", x: 960, y: 450, marker: false, side: "us", offset: [-240, 0] }],
    ["plaque.hide", CUT_D - 0.1],   // round 1 (critic B): no "25 December" over the August flashback or 2 January; the snap-cut plate brings it back
    // E
    ["label", T.british, CUT_F - 0.3, { name: "British army", world: [1369.0, 2046.0, 0], side: "uk", marker: false, offset: [60, -120] }],
    // F
    ["film.dim", T.brother - 0.3, T.george - 0.1, 0.5],
    ["letter", T.brother - 0.1, T.george - 0.1, { header: "A week before Christmas", title: "To his brother", sub: "", quote: "I think the game is pretty near up.", qSize: 34, height: 270,
      cps: 40, qAt: T.think - 0.05, lag: 0.05, stagger: 0.06, partDur: 0.35 }],   // round 1: complete by ~51.4, held to 53.7
    // G
    ["plaque.date", SN1, { month: "1776 - 1777", day: "", weekday: "", note: "" }],
    ["film.grade", SN1, "night", 0.1],
    ["film.grade", SN3, "day", 0.1],
    ["title", T.three, T.D - 1.8, { lines: ["THREE GREATEST", "TACTICAL MOVES"], y: 250 }],
  ],
};
})();
