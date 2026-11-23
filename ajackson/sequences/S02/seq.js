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
const NAT = P("Natchez"), MIMS = P("Fort Mims"), MOB = P("Mobile"), HSB = P("Horseshoe Bend (Tohopeka"), FW = P("Fort Williams");
const TRACE = [[NAT[0] + 6, NAT[1] - 6], [150, 352], [236, 252], [318, 150]];            // the Natchez Trace toward Tennessee (north-east)
const SOUTH = [[1004, 34], [982, 80], [FW[0] + 4, FW[1] - 6], [1018, 146], [HSB[0] - 14, HSB[1] - 3]];   // Fort Strother -> Fort Williams -> the bend
const RSB = VX.ll(32.36, -86.72, G);   // the Red Stick banner over the Red Stick towns on the Alabama (Holy Ground area)

let WW = null;
const lin = (c) => c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)), GOLD = lin([0xe0 / 255, 0xb8 / 255, 0x5a / 255]);
// the Creek Nation's lands in 1813 (approximate, soft ochre tint on "Creek Nation"; S03 hatches the 1814 cession): from the Choctaw line
// near the Tombigbee east to the Georgia frontier (the map edge), north of the Mobile / Tensaw settlements
const CREEK = [[33.62, -87.6], [33.0, -87.65], [32.4, -87.85], [31.9, -87.9], [31.6, -87.6], [31.35, -87.1], [31.05, -86.3], [31.05, -85.02], [33.62, -85.02]].map(([la, lo]) => VX.ll(la, lo, G));
const creek = { build() { const c = document.createElement("canvas"); c.width = 1280; c.height = 720; c.style.cssText = "position:absolute;inset:0;pointer-events:none";
    const tr = document.getElementById("troops"); tr.parentNode.insertBefore(c, tr); this.g = c.getContext("2d"); },
  draw(t, ctx) { const g = this.g; if (!g) return; g.clearRect(0, 0, 1280, 720); const k = VX.sstep(T.civil - 0.1, T.civil + 1.4, t) * (1 - VX.sstep(T.D - 3.2, T.D - 2.3, t)); if (k <= 0.002) return;
    const W = ctx.world, P = []; for (let i = 0; i < CREEK.length; i++) { const a = CREEK[i], b = CREEK[(i + 1) % CREEK.length];
      for (let s = 0; s < 8; s++) { const p = W.projectMap(a[0] + (b[0] - a[0]) * s / 8, a[1] + (b[1] - a[1]) * s / 8, 0); P.push([p.x, p.y]); } }
    g.beginPath(); P.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
    g.fillStyle = `rgba(214,170,84,${(0.16 * k).toFixed(3)})`; g.fill(); g.strokeStyle = `rgba(150,104,40,${(0.55 * k).toFixed(3)})`; g.lineWidth = 1.6; g.stroke(); } };

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
    // high and wide first (the Gulf coast, Mobile Bay, Pensacola, the river system), then a drift north-east to the bend
    { t: 0.0, region: G, at: [430, 490], dist: 820, tilt: 36, yaw: 0, fov: 30 },
    { t: T.hickory, region: G, at: [400, 385], dist: 760, tilt: 36, yaw: 0, fov: 30, ease: "lin" },
    { t: T.creek + 1.0, region: G, at: [770, 450], dist: 800, tilt: 31, yaw: 0, fov: 30 },
    { t: T.mims + 1.0, region: G, at: [745, 525], dist: 690, tilt: 32, yaw: 0, fov: 30 },
    { t: T.jackson2, region: G, at: [800, 430], dist: 690, tilt: 32, yaw: 0, fov: 30, ease: "lin" },
    { t: T.tohopeka, region: G, at: [1010, 250], dist: 430, tilt: 34, yaw: 0, fov: 30 },
    // the last ~2.2 s hold S03's first camera exactly (S03 keys[0]: [OV-10, OV+26], dist 300, tilt 36, yaw 0, fov 30)
    { t: T.D - 2.2, region: G, at: [HSB[0] - 10, HSB[1] + 26], dist: 300, tilt: 36, yaw: 0, fov: 30 },
    { t: T.D, region: G, at: [HSB[0] - 10, HSB[1] + 26], dist: 300, tilt: 36, yaw: 0, fov: 30, ease: "lin" },
  ],
  clouds: { [G]: { scatter: { seed: 5, n: 9, med: 24 }, keepClear: [[NAT[0] + 120, NAT[1] - 120, 120, 1, 0.8], [MIMS[0], MIMS[1], 80, 1, 0.8], [1040, 180, 90, 1, 0.85], [RSB[0], RSB[1], 70, 1, 0.8]] } },
  units, arrows,
  generals: {
    jackson: { img: "seq/jackson.png", flag: "seq/us15_flag.png", side: "us", name: "Jackson", full: "Andrew Jackson", role: "Major General" },
    redsticks: { img: "seq/rs_cloth.png", flag: "seq/rs_pennant.png", side: "cs", name: "Red Sticks", full: "The Red Sticks", role: "Creek" },
  },
  banners: [
    { general: "jackson", region: G, keys: [[0, ...VX.along(TRACE, 150).slice(0, 2)], [T.home, ...VX.along(TRACE, 150).slice(0, 2)], [T.hickory + 1.2, ...VX.along(TRACE, 225).slice(0, 2)]], t0: T.jackson, t1: T.sameYear + 1.4 },
    { general: "redsticks", region: G, keys: [[0, ...RSB], [T.thousand - 0.6, ...RSB], [T.warriors + 1.8, HSB[0] + 16, HSB[1] + 28]], t0: T.red + 0.2, t1: T.D + 1 },
    { general: "jackson", region: G, keys: [[0, FW[0] + 4, FW[1] - 6], [T.south + 0.2, FW[0] + 4, FW[1] - 6], [T.tohopeka, 1040, 176]], t0: T.jackson2, t1: T.D + 1 },
  ],
  labels: [
    { text: "Creek Nation", at: [985, 335], size: 22, t0: T.creek, t1: T.creek + 3.4, region: G },
    { text: "Fort Mims", town: "Fort Mims", size: 22, t0: T.mims + 0.05, t1: T.mims + 3.6, region: G },
    { text: "Mobile", town: "Mobile", size: 22, t0: T.mobile, t1: T.mobile + 3.4, region: G },
    { text: "Tohopeka", at: [1066, 172], size: 22, t0: T.tohopeka, t1: T.tohopeka + 3.6, region: G },
    { text: "Tallapoosa River", at: [1116, 118], size: 20, t0: T.tallapoosa, t1: T.D + 1, region: G, river: true },
  ],
  build: (ctx) => { WW = ctx.world; pulses.build(ctx); creek.build(ctx);
    // the Tallapoosa glows softly on its name (as the Mississippi in S01), the Alabama while Fort Mims is named
    const glow = (riv, t0, t1, col) => { const R = VX.river(G, riv).pts; ctx.FX[G].custom((t, push) => { if (t < t0 - 0.2 || t > t1 + 0.6) return;
      const k = VX.sstep(t0 - 0.2, t0 + 1.2, t) * (1 - VX.sstep(t1, t1 + 0.6, t)); for (let i = 0; i < R.length; i += 4) { const p = R[i];
        push(p[0], p[2] * WW.regions[G].ys + 0.35, p[1], 6, 0.3 * k, col[0], col[1], col[2], 6, 2); } }); };
    glow("Tallapoosa River", T.tallapoosa, T.D + 1, GOLD); glow("Alabama River", T.mims, T.mims + 3.6, GOLD); },
  draw: (t, ctx) => { pulses.draw(t, ctx); creek.draw(t, ctx); },
  overlay: [
    ["label", T.tennessee, T.tennessee + 3.2, { name: "Tennessee militia", world: (t) => [...VX.along(TRACE, 150).slice(0, 2), 0], side: "us", marker: false, offset: [70, -120] }],
    ["plaque.date", T.e1813, { month: "1813", day: "", weekday: "", note: "" }],
    ["label", T.hickory, T.sameYear - 0.2, { name: "Old Hickory", world: (t) => [...VX.along(TRACE, 225).slice(0, 2), 0], side: "us", marker: false, offset: [60, -150] }],
    ["plaque.date", T.august, { month: "August 1813", day: "", weekday: "", note: "" }],
    ["plaque.date", T.e1814, { month: "Spring 1814", day: "", weekday: "", note: "" }],
  ],
};
})();
