// S02 BACKGROUND: THE CREEK WAR (46.51 s; tools/scene_times.py S02 --words). Gulf map only, one slow continuous camera.
//  0.0-13.0  the lower Mississippi valley: plate 1813 on "eighteen thirteen"; Jackson's banner at Natchez on "Jackson"; on "a hard march
//            home" a blue arrow up the Natchez Trace and the banner walks north; tag OLD HICKORY on "Old Hickory".
// 13.0-30.0  the camera drifts east to the Creek country: CREEK NATION on "Creek Nation"; the Red Stick banner (no portrait, plain red
//            pennant) on "Red Sticks"; plate AUGUST 1813 on "August"; a red arrow to Fort Mims and a red pulse on "Fort Mims"; MOBILE on
//            "Mobile". No casualty number on screen (said in words only).
// 30.0-46.5  "Jackson marched south": banner + blue arrow down the Coosa past Fort Williams toward the Tallapoosa; plate SPRING 1814;
//            the Red Stick banner and a red block at the bend ("a thousand Red Stick warriors"); TOHOPEKA, TALLAPOOSA RIVER and a gold
//            pulse on "the Horseshoe"; the camera ends looking at the bend (S03's dive starts on the gulf).
(() => {
const T = { D: 46.51, e1813: 1.06, jackson: 2.19, tennessee: 3.55, spring: 5.49, march: 6.85, home: 7.13, hickory: 9.67, tough: 11.69,
  sameYear: 13.49, civil: 14.51, creek: 15.91, red: 18.41, americans: 20.47, creeks: 21.81, august: 24.03, stormed: 24.75, mims: 25.23,
  mobile: 26.85, killed: 27.61, jackson2: 30.39, south: 31.09, e1814: 33.51, thousand: 34.83, warriors: 36.11, tohopeka: 39.20,
  loop: 40.71, tallapoosa: 41.72, horseshoe: 44.17 };
const G = "gulf", P = (n) => VX.place(n, G);
const NAT = P("Natchez"), MIMS = P("Fort Mims"), MOB = P("Mobile"), HSB = P("Horseshoe Bend"), FW = P("Fort Williams");
const TRACE = [[NAT[0] + 6, NAT[1] - 6], [150, 352], [236, 252], [318, 150]];            // the Natchez Trace toward Tennessee (north-east)
const SOUTH = [[1004, 34], [982, 80], [FW[0] + 4, FW[1] - 6], [1018, 146], [HSB[0] - 14, HSB[1] - 3]];   // Fort Strother -> Fort Williams -> the bend
const RSB = [1010, 288];   // the Red Stick banner over the upper Creek towns

const units = [
  { region: G, side: "r", type: "inf", n: 1, face: -Math.PI / 2, arrive: false, t0: T.thousand - 0.2, keys: [[0, HSB[0] + 2, HSB[1] + 9]] },
];
const arrows = [
  { region: G, side: "u", pts: TRACE, t0: T.march, dur: 2.6, t1: T.sameYear + 1.5, width: 0.26 },
  { region: G, side: "r", pts: [[RSB[0] - 40, RSB[1] + 70], [900, 390], [800, 480], [MIMS[0] + 7, MIMS[1] - 8]], t0: T.stormed - 0.1, dur: 1.4, t1: T.jackson2, width: 0.26 },
  { region: G, side: "u", pts: SOUTH, t0: T.south, dur: 3.0, t1: T.D + 1, width: 0.26 },
];
const pulses = VX.pulses([
  { region: G, at: MIMS, t0: T.mims, t1: T.jackson2 - 0.4, r: 24, color: [200, 40, 28], period: 1.6 },
  { region: G, at: [1086, 166], t0: T.horseshoe, t1: T.D + 1, r: 11, color: [232, 196, 108], period: 1.6 },
]);

window.SEQ = {
  name: "S02", D: T.D, T, seed: 1813, date: "1813-08-30",
  regions: [G],
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  regionOpts: { [G]: { troopScale: 12 } },
  keys: [
    { t: 0.0, region: G, at: [345, 405], dist: 600, tilt: 33, yaw: -3, fov: 30 },
    { t: T.hickory, region: G, at: [360, 375], dist: 590, tilt: 33, yaw: -2, fov: 30, ease: "lin" },
    { t: T.red + 0.5, region: G, at: [870, 355], dist: 590, tilt: 34, yaw: 0, fov: 30 },
    { t: T.mims + 1.0, region: G, at: [800, 440], dist: 560, tilt: 35, yaw: 1, fov: 30 },
    { t: T.jackson2, region: G, at: [840, 400], dist: 560, tilt: 35, yaw: 1, fov: 30, ease: "lin" },
    { t: T.tohopeka, region: G, at: [1010, 250], dist: 400, tilt: 34, yaw: 0, fov: 30 },
    { t: T.D, region: G, at: [1045, 205], dist: 340, tilt: 31, yaw: 0, fov: 30, ease: "lin" },
  ],
  clouds: { [G]: { scatter: { seed: 5, n: 9, med: 24 }, keepClear: [[NAT[0] + 120, NAT[1] - 120, 120, 1, 0.8], [MIMS[0], MIMS[1], 80, 1, 0.8], [1040, 180, 90, 1, 0.85], [RSB[0], RSB[1], 70, 1, 0.8]] } },
  units, arrows,
  generals: {
    jackson: { img: "seq/jackson.png", flag: "seq/us15_flag.png", side: "us", name: "Jackson", full: "Andrew Jackson", role: "Major General" },
    redsticks: { img: "seq/rs_cloth.png", flag: "seq/rs_pennant.png", side: "cs", name: "Red Sticks", full: "The Red Sticks", role: "Creek" },
  },
  banners: [
    { general: "jackson", region: G, keys: [[0, ...VX.along(TRACE, 95).slice(0, 2)], [T.home, ...VX.along(TRACE, 95).slice(0, 2)], [T.hickory + 1.2, ...VX.along(TRACE, 190).slice(0, 2)]], t0: T.jackson, t1: T.sameYear + 1.4 },
    { general: "redsticks", region: G, keys: [[0, ...RSB], [T.thousand - 0.6, ...RSB], [T.warriors + 1.8, HSB[0] + 16, HSB[1] + 28]], t0: T.red + 0.2, t1: T.D + 1 },
    { general: "jackson", region: G, keys: [[0, ...SOUTH[0]], [T.south + 0.2, ...SOUTH[0]], [T.tohopeka, ...SOUTH[3]]], t0: T.jackson2, t1: T.D + 1 },
  ],
  labels: [
    { text: "Creek Nation", at: [985, 335], size: 22, t0: T.creek, t1: T.creek + 3.4, region: G },
    { text: "Fort Mims", town: "Fort Mims", size: 22, t0: T.mims + 0.05, t1: T.mims + 3.6, region: G },
    { text: "Mobile", town: "Mobile", size: 22, t0: T.mobile, t1: T.mobile + 3.4, region: G },
    { text: "Tohopeka", at: [1066, 172], size: 22, t0: T.tohopeka, t1: T.tohopeka + 3.6, region: G },
    { text: "Tallapoosa River", at: [1116, 118], size: 20, t0: T.tallapoosa, t1: T.D + 1, region: G, river: true },
  ],
  build: (ctx) => pulses.build(ctx), draw: (t, ctx) => pulses.draw(t, ctx),
  overlay: [
    ["plaque.date", T.e1813, { month: "1813", day: "", weekday: "", note: "" }],
    ["label", T.hickory, T.sameYear - 0.2, { name: "Old Hickory", world: (t) => [...VX.along(TRACE, 190).slice(0, 2), 0], side: "us", marker: false, offset: [60, -150] }],
    ["plaque.date", T.august, { month: "August 1813", day: "", weekday: "", note: "" }],
    ["plaque.date", T.e1814, { month: "Spring 1814", day: "", weekday: "", note: "" }],
  ],
};
})();
