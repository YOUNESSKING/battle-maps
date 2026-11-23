// S04 THE BRITISH COME (Nov - 23 Dec 1814). D = 71.11 s (ajackson/tools/scene_times.py S04). Regions: gulf (z8), neworleans (z10), chalmette (z10).
// No dive: gulf -> neworleans -> chalmette by 0.9 s dissolves. The fleet from Jamaica (continues S03's ships), Jackson at Mobile, Pensacola
// taken back from the British (Nov), Jackson in New Orleans (1 Dec), Lake Borgne (14 Dec: five gunboats taken), martial law + the call to arms,
// the British boats up Bayou Bienvenue and the Villeré canal, the advance guard out of the cypress swamp onto Villeré's (23 Dec, late
// morning), the owner's son escapes by the river. Facts: ajackson/research/FACT_NOTES_neworleans.md.
(() => {
const T = { D: 71.11, plan: 0.69, bold: 1.37, fleet: 2.61, jamaica: 3.13, land: 3.91, neworleans: 4.99, city: 6.61, mouth: 8.03, miss: 8.71,
  jackson: 10.15, guessed: 10.47, mobile: 11.81, november: 13.45, marched: 14.11, pensacola: 14.77, spanish: 15.89, florida: 16.37, british: 17.55,
  landed: 17.99, drove: 18.77, out: 19.27, first: 20.77, december: 20.99, reached: 21.83, no: 22.09, few: 24.55, soldiers: 24.83, forts: 26.03,
  dozen: 27.25, ways: 27.51, bayous: 28.83, lakes: 29.45, d14: 31.12, rowed: 32.75, lake: 33.87, borgne: 34.41, captured: 35.17, five: 35.79,
  gunboats: 36.61, now: 38.51, blind: 39.75, lake2: 40.71, martial: 42.59, law: 42.99, called: 44.01, every: 44.55, gun: 46.05,
  words: 47.19, wherever: 48.87, liked: 49.53, found: 50.63, bayou: 51.07, blocked: 52.03, rowed2: 52.86, marsh: 54.09, late: 55.09,
  d23: 56.62, december2: 57.03, advance: 57.97, walked: 58.75, cypress: 59.65, swamp: 59.93, sugar: 60.87, plantation: 61.19, river: 62.23,
  captured2: 63.31, son: 64.35, slipped: 65.31, window: 65.99, crossed: 66.65, river2: 67.11, raced: 67.83, warn: 68.41, jacksonE: 68.71 };
const GF = "gulf", NO = "neworleans", CH = "chalmette";
const lerp2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const MOB = VX.place("Mobile", GF), PEN = VX.place("Pensacola", GF), NOG = VX.place("New Orleans", GF), BORG = VX.place("Lake Borgne", GF);
const CITY = VX.place("New Orleans", NO), VILLERE = VX.place("Villere plantation house", CH);
const CUT1 = 19.95, CUT2 = 56.35;   // dissolves gulf -> neworleans, neworleans -> chalmette

// ---------------- the fleet (S03's ships go on) ----------------
const SHIP_PATH = [[1215, 1015], [1060, 950], [905, 885], [760, 830], [620, 800], [520, 772], [470, 758]];
const S0 = 300 + (177.09 - 158.5) * 4.0;   // lead ship's arc length at S03's last shared frame (S03: s0 300, t0 158.5, speed 4)

// ---------------- neworleans: Lake Borgne ----------------
const GB = VX.line([1532.0, 3112.0], [1558.0, 3124.0], 5);   // Jones's five gunboats in line (true site ~8 km further east, off this map: see NOTES)
const BOAT_ICON = '<svg viewBox="0 0 40 22"><path d="M2 12 L38 12 L33 19 L7 19 Z" fill="currentColor" stroke="#0e0c08" stroke-width="1.4"/><path d="M20 12 L20 1" stroke="#0e0c08" stroke-width="1.6"/><path d="M21 2 L31 10 L21 10 Z" fill="#efe6d2" stroke="#0e0c08" stroke-width="1"/></svg>';
const BARGE_ICON = '<svg viewBox="0 0 40 16"><path d="M2 6 L38 6 L34 12 L6 12 Z" fill="currentColor" stroke="#0e0c08" stroke-width="1.3"/><path d="M9 6 L5 1 M16 6 L12 1 M23 6 L19 1 M30 6 L26 1 M9 12 L5 16 M16 12 L12 16 M23 12 L19 16 M30 12 L26 16" stroke="#0e0c08" stroke-width="1.2"/></svg>';
const BRITISH_BOATS = [];   // ~45 boats: 10 icons in three waves rowing in from the east
for (let i = 0; i < 10; i++) { const row = i % 3, lane = (i - 4.5) * 2.6, a = [1590.0, 3092.0 + lane * 0.9], g = GB[Math.min(4, Math.floor(i / 2))], b = [g[0] + 4.2 + row * 1.6, g[1] - 2.4 + (i % 2) * 1.8];
  BRITISH_BOATS.push({ icon: BARGE_ICON, region: NO, path: [a, lerp2(a, b, 0.6), b], v: 5.2 + (i % 3) * 0.5, t0: T.rowed - 0.6 + row * 0.35, t1: 46.4, size: 3.2, min: 15, max: 26, color: "#b53a2c", anchor: "center", fadeIn: 0.4 }); }
const GUNBOATS = GB.map((g, i) => ({ icon: BOAT_ICON, region: NO, at: g, t0: 30.6, t1: 46.4, size: 4.4, min: 22, max: 34, color: "#2f5bc0", colors: [[T.captured + 0.15 + i * 0.25, "#8c8984"]], anchor: "center", fadeIn: 0.4, flip: false }));
// the call to arms: militia companies gather in the city
const MIL = [[1196.0, 3207.5], [1209.5, 3206.0], [1203.0, 3219.8]];
// the boats up the bayou: Lake Borgne -> Bayou Bienvenue -> the Villeré canal head (neworleans units)
const BAYOU = (() => { const B = VX.river(NO, "Bayou Bienvenue").pts.map((p) => [p[0], p[1]]); if (B[0][0] < B[B.length - 1][0]) B.reverse(); return B; })();
const CANAL = VX.river(NO, "Villere canal").pts.map((p) => [p[0], p[1]]);
const CANAL_N = CANAL[0][1] < CANAL[CANAL.length - 1][1] ? CANAL : CANAL.slice().reverse();   // north (canal head) -> south (the swamp edge)
const ROUTE = [[1452.0, 3168.0], [1428.0, 3176.0], [1408.2, 3179.8], [1380.0, 3177.0], ...BAYOU.filter((p) => p[0] < 1356), CANAL_N[0], ...CANAL_N.slice(1, 8)];

// ---------------- chalmette: the canal, the swamp edge, Villeré's ----------------
const CANAL_C = (() => { const C = VX.river(CH, "Villere canal").pts.map((p) => [p[0], p[1]]); return C[0][1] < C[C.length - 1][1] ? C : C.slice().reverse(); })();
const EDGE_Y = 3231.6;   // the plantation edge of the cypress swamp at the canal's south end
const units = [];
// the advance guard (Thornton's brigade: 4th, 85th, 95th, ~1,600-1,800 men) out of the swamp, line facing the river (south)
[1282.6, 1286.4, 1290.2].forEach((x, i) => units.push({ side: "r", type: "inf", n: 2, region: CH, face: Math.PI / 2, arrive: false, t0: T.walked - 0.4 + i * 0.35,
  keys: [[T.walked - 0.4 + i * 0.35, x, EDGE_Y - 0.2], [61.6 + i * 0.35, x, EDGE_Y + 3.0 - (i === 1 ? 0.4 : 0)]] }));
// Gulf: the British at Pensacola (driven out in November), the militia in the city (neworleans)
units.push({ side: "r", type: "inf", n: 2, region: GF, face: -Math.PI / 2, arrive: false, t0: T.british, t1: 21.5, keys: [[T.british, PEN[0] + 2, PEN[1] - 9], [T.drove + 0.1, PEN[0] + 2, PEN[1] - 9], [21.5, PEN[0] + 2, PEN[1] - 5]] });   // driven out: about-face, back toward the bay (the dissolve takes it)
MIL.forEach((p, i) => units.push({ side: "u", type: "inf", n: 1, region: NO, face: Math.PI / 2, arrive: false, t0: T.every + i * 0.4, t1: CUT2 + 1, keys: [[T.every + i * 0.4, ...p]] }));
units.push({ side: "u", type: "inf", n: 1, region: NO, face: Math.PI / 2, arrive: false, t0: T.few, t1: CUT2 + 1, keys: [[T.few, CITY[0] - 1.5, CITY[1] + 1.5]] });

// the owner's son: out of a window, to the river, across in a pirogue, up the west bank toward the city
const HOUSE = [VILLERE[0], VILLERE[1]], BANK_E = [HOUSE[0] + 0.3, 3240.4], BANK_W = [HOUSE[0] - 0.9, 3246.4];
const SON = { icon: "person", region: CH, size: 0.55, min: 9, max: 16, color: "#efe6d2", halo: "rgba(255,236,190,.55)", fadeIn: 0.25, fadeOut: 0.3 };
const markers = VX.markers([
  ...BRITISH_BOATS, ...GUNBOATS,
  { ...SON, path: [[HOUSE[0] + 0.2, HOUSE[1] + 0.2], BANK_E], v: 2.2, t0: T.slipped + 0.1, t1: T.crossed + 0.05, fadeOut: 0.05 },
  { ...SON, at: BANK_E, path: [BANK_E, BANK_W], v: 4.6, t0: T.crossed, t1: 68.0, fadeIn: 0.05, fadeOut: 0.1, h: 0.15 },
  { ...SON, path: [BANK_W, [BANK_W[0] - 4.0, BANK_W[1] + 0.1], [BANK_W[0] - 9.0, BANK_W[1] - 0.6]], v: 3.4, t0: 67.95, t1: T.D + 1, fadeIn: 0.05 },
]);
const pulses = VX.pulses([
  { region: NO, at: VX.place("Fort Petites Coquilles", NO), r: 5, t0: T.forts, t1: 29.4, color: [255, 214, 120] },
  { region: CH, at: HOUSE, r: 1.1, t0: T.son, t1: 65.6, color: [255, 214, 120], period: 1.2 },
]);
// the bayou route, lit on its word
const bayouGlow = VX.pulses(BAYOU.filter((_, i) => i % 3 === 0).map((p, i) => ({ region: NO, at: p, r: 2.2, t0: T.bayou + i * 0.08, t1: 54.6, color: [255, 214, 120], period: 1.6, alpha: 0.7 })));

window.SEQ = {
  name: "S04", D: T.D, T, seed: 1815, date: "1814-12-23",
  regions: [GF, NO, CH],
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  regionOpts: { [GF]: { troopScale: 12 }, [NO]: { troopScale: 9 }, [CH]: { troopScale: 1.8 } },
  keys: [
    { t: 0, region: GF, at: [640, 760], dist: 860, tilt: 38, yaw: 0, fov: 30 },                       // = S03's last frame
    { t: 8.6, region: GF, at: [560, 790], dist: 820, tilt: 39, yaw: 0, fov: 30, ease: "io" },          // the fleet toward New Orleans, the river mouth
    { t: 12.4, region: GF, at: [700, 720], dist: 560, tilt: 42, yaw: 0, fov: 30, ease: "io" },         // Mobile, Pensacola
    { t: CUT1, region: GF, at: [720, 724], dist: 540, tilt: 42, yaw: 1, fov: 30, ease: "io" },
    { t: CUT1, region: NO, at: [1236, 3184], dist: 250, tilt: 40, yaw: 0, fov: 30, ease: "cut", dissolve: 0.9 },   // New Orleans, the lakes, the bayous
    { t: 30.0, region: NO, at: [1262, 3172], dist: 270, tilt: 41, yaw: 0, fov: 30, ease: "io" },
    { t: 33.4, region: NO, at: [1536, 3122], dist: 100, tilt: 46, yaw: -4, fov: 30, ease: "io" },      // Lake Borgne: the gunboats
    { t: 38.2, region: NO, at: [1542, 3122], dist: 90, tilt: 47, yaw: -2, fov: 30, ease: "io" },
    { t: 42.2, region: NO, at: [1250, 3188], dist: 200, tilt: 42, yaw: 0, fov: 30, ease: "io" },       // the city: martial law, the call to arms
    { t: 46.6, region: NO, at: [1240, 3195], dist: 190, tilt: 43, yaw: 0, fov: 30, ease: "io" },
    { t: 50.4, region: NO, at: [1380, 3176], dist: 120, tilt: 45, yaw: 0, fov: 30, ease: "io" },       // the bayou no one had blocked
    { t: CUT2, region: NO, at: [1314, 3184], dist: 92, tilt: 47, yaw: -3, fov: 30, ease: "io" },
    { t: CUT2, region: CH, at: [1286.6, 3229.0], dist: 30, tilt: 47, yaw: -6, fov: 30, ease: "cut", dissolve: 0.9 },   // Villeré's, 23 December
    { t: 62.6, region: CH, at: [1287.4, 3236.0], dist: 25, tilt: 49, yaw: -4, fov: 30, ease: "io" },
    { t: 66.2, region: CH, at: [1287.6, 3240.4], dist: 21, tilt: 51, yaw: -2, fov: 30, ease: "io" },     // the escape: house, river, west bank
    { t: T.D, region: CH, at: [1284.0, 3242.2], dist: 23, tilt: 50, yaw: 0, fov: 30, ease: "io" },
  ],
  clouds: { [GF]: { scatter: { seed: 5 }, keepClear: [[700, 720, 240, 1, 1], [560, 790, 200, 1, 1]] }, [NO]: { scatter: { seed: 4 }, keepClear: [[1300, 3170, 140, 1, 1], [1540, 3120, 60, 1, 1]] }, [CH]: { shadows: true } },
  units,
  arrows: [
    // the fleet from Jamaica (south-east, off the map) toward New Orleans
    { side: "r", region: GF, width: 0.6, maxWidth: 0.6, pts: [[1222, 1040], [1000, 930], [780, 850], [560, 800], [420, 790]], t0: T.jamaica - 0.1, dur: 2.6, t1: 9.9 },
    // Jackson: Mobile -> Pensacola (November)
    { side: "u", region: GF, width: 0.5, maxWidth: 0.5, pts: [[MOB[0] + 6, MOB[1] + 2], [740, 668], [PEN[0] - 8, PEN[1] - 6]], t0: T.marched, dur: 1.8, t1: 19.4 },
    // the fleet on to Lake Borgne
    { side: "r", region: GF, width: 0.55, maxWidth: 0.55, pts: [[700, 812], [580, 790], [470, 772], [BORG[0] + 10, BORG[1] - 6]], t0: 18.9, dur: 1.2, t1: 21.4 },
    // "a dozen ways in through the bayous and the lakes": short red threat lines toward the city
    ...[[[1185, 3060], [1192, 3130], [1198, 3196]], [[1390, 3124], [1320, 3160], [1236, 3196]], [[1420, 3180], [1350, 3186], [1262, 3205]], [[1300, 3300], [1270, 3262], [1232, 3226]]]
      .map((pts, i) => ({ side: "r", region: NO, width: 0.8, pts, t0: T.dozen + i * 0.32, dur: 1.0, t1: 30.4 })),
    // the British boats: up the bayou through the marsh to the canal head
    { side: "r", region: NO, width: 0.15, pts: ROUTE.filter((_, i) => i % 2 === 0 || i === ROUTE.length - 1), t0: T.rowed2 - 0.1, dur: 3.2, t1: CUT2 + 0.6 },
  ],
  boats: [
    { region: GF, kind: "ship", n: 5, t0: -1, t1: T.D + 1, size: 3.4, lamp: false, wake: true, path: SHIP_PATH, s0: S0, speed: 4.0, spacing: 12 },
    { region: NO, kind: "barge", n: 6, t0: T.rowed2 - 0.4, t1: CUT2 + 1, size: 0.55, lamp: false, wake: false, path: ROUTE, s0: 8, speed: 9.5, spacing: 2.4 },
    { region: CH, kind: "barge", n: 3, t0: CUT2 - 0.2, t1: 60.5, size: 0.07, lamp: false, wake: false, path: CANAL_C.filter((p) => p[1] < EDGE_Y - 1.5), s0: 14, speed: 1.6, spacing: 0.8 },
    { region: CH, kind: "canoe", n: 1, t0: T.crossed - 0.6, t1: T.D + 1, size: 0.16, lamp: false, wake: false, h: 0.08, path: [BANK_E, BANK_W],
      sAt: (t) => { const L = Math.hypot(BANK_W[0] - BANK_E[0], BANK_W[1] - BANK_E[1]); return t < T.crossed ? 0.05 : t < 68.0 ? L * Math.min(1, (t - T.crossed) / (68.0 - T.crossed)) : L - 0.05; } },
  ],
  generals: { jackson: { img: "seq/jackson.png", flag: "seq/us15_flag.png", side: "us", name: "Jackson", full: "Andrew Jackson", role: "Major General" } },
  banners: [
    { general: "jackson", region: GF, keys: [[0, ...MOB], [T.marched + 0.2, ...MOB], [17.2, PEN[0] - 6, PEN[1] - 8]], t0: T.jackson, t1: CUT1 + 0.2 },
    { general: "jackson", region: NO, keys: [[0, 1262, 3186], [T.reached + 0.3, CITY[0] + 9, CITY[1] - 4]], t0: T.december - 0.2, t1: 33.0 },
    { general: "jackson", region: NO, keys: [[0, CITY[0] + 9, CITY[1] - 4]], t0: 41.6, t1: 50.4 },
  ],
  labels: [
    { text: "New Orleans", region: GF, at: [NOG[0] - 4, NOG[1] - 10], size: 18, t0: T.neworleans, t1: 9.4 },
    { text: "Mississippi River", region: GF, at: [392, 900], size: 17, river: true, t0: T.miss, t1: 11.6 },
    { text: "Mobile", region: GF, at: [MOB[0] - 2, MOB[1] - 11], size: 18, t0: T.mobile, t1: 15.6 },
    { text: "New Orleans", region: NO, at: [CITY[0] - 8, CITY[1] + 8], size: 19, t0: T.no + 0.1, t1: 26.0 },
    { text: "Lake Borgne", region: NO, at: [1508, 3160], size: 19, river: true, t0: T.lake, t1: 38.0 },
  ],
  fx: {
    smokeLines: [],
    guns: [
      // the gunboats fire on the boats as they close (flash + smoke on each shot)
      { region: NO, preset: "field", size: 0.55, impactOpts: { size: 0.5 }, shots: [33.9, 34.5, 35.0, 35.6, 36.2].map((t, i) => ({ t, at: GB[[2, 0, 4, 1, 3][i]], dir: [1, -0.35], impact: [GB[[2, 0, 4, 1, 3][i]][0] + 5.5, GB[[2, 0, 4, 1, 3][i]][1] - 2.6], delay: 0.5 })) },
    ],
  },
  overlay: [
    ["plaque.date", 0.35, { month: "Autumn 1814", day: "", weekday: "", note: "the Gulf coast" }],
    ["plaque.date", T.november, { month: "November 1814", day: "", weekday: "", note: "Pensacola" }],
    ["label", T.florida + 0.1, 19.0, { name: "Pensacola", sub: "Spanish Florida", world: [PEN[0], PEN[1] - 2], side: "us", offset: [30, -70] }],
    ["plaque.date", T.december, { month: "December 1814", day: "1", weekday: "Thursday", note: "New Orleans" }],
    ["plaque.date", T.d14, { month: "December 1814", day: "14", weekday: "Wednesday", note: "Lake Borgne" }],
    ["label", T.captured + 0.3, 39.4, { name: "Five gunboats captured", sub: "Lake Borgne", world: GB[2], side: "cs", marker: false, offset: [-150, -110] }],
    ["label", T.martial + 0.1, 46.4, { name: "Martial law", sub: "New Orleans", world: CITY, side: "us", offset: [40, -90] }],
    ["label", T.blocked + 0.1, 55.6, { name: "A bayou no one had blocked", world: [1340, 3184], side: "cs", marker: false, offset: [-120, -100] }],
    ["plaque.date", T.d23, { month: "December 1814", day: "23", weekday: "Friday", note: "late morning · the river" }],
    ["label", T.son + 0.1, 66.6, { name: "The owner's son", sub: "captured at the house", world: HOUSE, side: "cs", marker: false, offset: [60, -120] }],
    ["label", T.raced + 0.05, T.D + 1, { name: "To warn Jackson", sub: "across the river", world: BANK_W, side: "us", marker: false, offset: [-200, 60] }],
  ],
  build: (ctx) => { pulses.build(ctx); bayouGlow.build(ctx); markers.build(ctx); },
  draw: (t, ctx) => { pulses.draw(t, ctx); bayouGlow.draw(t, ctx); markers.draw(t, ctx); },
};
})();
