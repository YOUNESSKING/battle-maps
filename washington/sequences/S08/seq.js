// S08 ENDING (D 65.72 s: ~17.8 s of clean living map after the last word for YouTube's end screen; washington/tools/scene_times.py S08).
// One region: colonies (z9). Structure copied from ajackson S08 (card callback -> method letter -> engage.final -> living map, fade).
//  0.0-9.6   colonies wide, winter: Washington's banner + the blue army march north into the hills to Morristown (blue arrow Princeton ->
//            Pluckemin -> Morristown); the red posts pull back to New Brunswick, Perth Amboy and Paulus Hook; the red-held ground
//            (soft red tint, Jackson S02's land-tint recipe) shrinks to that corridor; MORRISTOWN, NEW JERSEY on their words.
//  9.6-14.8  S01's letter card returns over the dimmed map ("I think the game is pretty near up.").
// 14.8-22.4  a slow push over the map ("the Revolution was alive again").
// 22.4-29.3  the method letter, all three lines typed on their words (Jackson S08 recipe).
// 29.3-48.4  engage.final: 1 BROOKLYN / 2 TRENTON / 3 PRINCETON on "One / Two / three", the commander line, subscribe.
// 48.4-65.7  the living map alone (clouds, water, slow drift); fade over the last 1.5 s.
(() => {
const T = { D: 65.72, washington: 0.90, army: 1.57, winter: 2.33, hills: 3.57, morristown: 4.19, and: 5.54, british: 5.87, pulled: 6.14,
  almost: 7.14, jersey: 8.25, less: 9.71, wrote: 11.09, game: 11.66, up: 12.69, revolution: 13.49, alive: 14.26, again: 14.69,
  war: 15.87, seven: 17.21, army2: 19.21, saved: 20.75, nights: 21.66, method: 22.93, three: 23.47, parts: 23.75, save: 24.31,
  first: 25.50, hit: 26.23, rest: 27.02, go: 27.75, not: 28.49, so: 29.59, which: 29.61, greatest: 31.25, one: 32.78, brooklyn: 34.16,
  two: 35.04, christmas: 35.76, trenton: 36.99, or: 37.87, three2: 38.12, march: 39.14, cornwallis: 39.97, princeton: 40.87,
  tell: 41.90, comments: 42.50, tell2: 43.21, commander: 43.83, next: 45.00, subscribe: 46.62, one2: 47.90 };
const CO = "colonies", P = (n) => VX.place(n, CO);
const lerp2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const MOR = P("Morristown"), PRI = P("Princeton"), PLU = P("Pluckemin"), NB = P("New Brunswick"), PA = P("Perth Amboy"), PH = P("Paulus Hook");
const KIN = P("Kingston"), SOM = P("Somerset Court House"), ETC = P("Elizabeth Town"), NEW = P("Newark");

// ---------------- the red-held ground: December 1776 -> January 1777 (approximate, same vertex count, lerped on "pulled back") ----------------
const HELD0 = [[602, 196], [628, 212], [612, 282], [575, 318], [530, 375], [470, 430], [395, 520], [355, 560], [336, 512], [372, 450], [440, 360], [520, 250]];
const HELD1 = [[608, 262], [616, 270], [612, 284], [575, 322], [530, 386], [484, 400], [456, 400], [446, 394], [448, 382], [478, 372], [528, 352], [588, 284]];
const heldK = (t) => VX.sstep(T.pulled - 0.2, 16.0, t);
const held = { build() { const c = document.createElement("canvas"); c.width = 1280; c.height = 720; c.style.cssText = "position:absolute;inset:0;pointer-events:none";
    const tr = document.getElementById("troops"); tr.parentNode.insertBefore(c, tr); this.g = c.getContext("2d"); },
  draw(t, ctx) { const g = this.g; if (!g) return; g.clearRect(0, 0, 1280, 720); const a = VX.sstep(0.2, 1.2, t) * (1 - VX.sstep(T.so - 0.6, T.so, t)); if (a <= 0.002) return;
    const W = ctx.world, k = heldK(t), poly = HELD0.map((p, i) => lerp2(p, HELD1[i], k)), Q = [];
    for (let i = 0; i < poly.length; i++) { const p0 = poly[i], p1 = poly[(i + 1) % poly.length]; for (let s = 0; s < 8; s++) { const q = W.projectMap(p0[0] + (p1[0] - p0[0]) * s / 8, p0[1] + (p1[1] - p0[1]) * s / 8, 0); Q.push([q.x, q.y]); } }
    g.beginPath(); Q.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
    g.fillStyle = `rgba(190,58,42,${(0.22 * a).toFixed(3)})`; g.fill(); g.strokeStyle = `rgba(150,36,28,${(0.55 * a).toFixed(3)})`; g.lineWidth = 1.6; g.stroke(); } };

// ---------------- units ----------------
const units = [];
const walk = (side, a, b, t0, t1, o = {}) => units.push({ region: CO, side, type: "inf", n: 1, bw: 1.7, skirmish: false, arrive: false, face: Math.atan2(b[1] - a[1], b[0] - a[0]),
  keys: [[0, ...a], [t0, ...a], [t1, ...b]], ...o });
// the blue army north into the hills (Pluckemin -> Morristown)
const B0 = lerp2(PLU, MOR, 0.5), B1 = lerp2(PLU, MOR, 0.9);
walk("u", B0, B1, 0.2, 9.4);
// the red posts pull back east to New Brunswick, Perth Amboy and Paulus Hook (front first)
walk("r", lerp2(KIN, [NB[0] - 5, NB[1] + 8], 0.45), [NB[0] - 5, NB[1] + 8], T.pulled - 0.4, 15.6);
walk("r", lerp2(SOM, [NB[0] - 2, NB[1] - 8], 0.3), [NB[0] - 2, NB[1] - 8], T.pulled - 0.1, 15.0);
walk("r", lerp2(ETC, [PA[0] - 8, PA[1] - 7], 0.55), [PA[0] - 8, PA[1] - 7], T.pulled + 0.2, 15.4);
walk("r", NEW, [PH[0] - 8, PH[1] + 2], T.pulled + 0.5, 14.8);

window.SEQ = {
  grade: { wide: { toe: 14, ct: 1.03, sat: 1.04 } },   // Jackson: richer wide overhead maps (the colonies world is summer-baked; grade as Jackson's ending)
  name: "S08", D: T.D, T, seed: 1777, date: "1777-01-06",
  regions: [CO],
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  regionOpts: { [CO]: { troopScale: 10 } },
  keys: [
    { t: 0, region: CO, at: [462, 338], dist: 540, tilt: 30, yaw: 0, fov: 30 },
    { t: 9.6, region: CO, at: [466, 334], dist: 525, tilt: 30, yaw: 0, fov: 30, ease: "lin" },
    { t: 22.4, region: CO, at: [454, 332], dist: 430, tilt: 33, yaw: 1, fov: 30, ease: "io" },          // the slow push over the map
    { t: 29.6, region: CO, at: [466, 370], dist: 520, tilt: 31, yaw: 0, fov: 30, ease: "io" },
    { t: 48.4, region: CO, at: [478, 368], dist: 545, tilt: 31, yaw: 1, fov: 30, ease: "lin" },
    { t: T.D, region: CO, at: [494, 366], dist: 580, tilt: 30, yaw: 3, fov: 30, ease: "lin" },          // the living map alone for the end screen
  ],
  features: { [CO]: { bridges: Array.from({ length: 60 }, () => ({ hidden: true })) } },
  clouds: { [CO]: { scatter: { seed: 7 }, keepClear: [[460, 350, 190, 1, 1]] } },
  units,
  arrows: [
    { side: "u", region: CO, width: 0.5, maxWidth: 0.5, pts: [[PRI[0] + 4, PRI[1] - 8], [PLU[0] - 2, PLU[1] + 20], lerp2(PLU, MOR, 0.35), [MOR[0] - 3, MOR[1] + 7]], t0: T.washington, dur: 2.6, t1: 9.4 },
  ],
  generals: { washington: { img: "seq/washington.png", flag: "seq/grand_union_flag.png", side: "us", name: "Washington", full: "George Washington", role: "General" } },
  banners: [{ general: "washington", region: CO, keys: [[0, B0[0] + 7, B0[1] + 2], [0.4, B0[0] + 7, B0[1] + 2], [9.4, B1[0] + 7, B1[1] + 2]], t0: T.washington - 0.05, t1: 22.0 }],
  labels: [
    { text: "Morristown", at: [MOR[0] + 16, MOR[1] + 6], size: 24, t0: T.morristown, t1: T.morristown + 3.6, region: CO },
    { text: "New Jersey", at: [430, 420], size: 26, t0: T.jersey, t1: T.jersey + 3.4, region: CO },
  ],
  fx: {},
  overlay: [
    ["plaque.date", 0.35, { month: "January 1777", day: "", weekday: "", note: "" }],
    ["film.dim", T.wrote - 0.5, T.again + 0.1, 0.5],
    ["letter", T.wrote - 0.3, T.again, { header: "A week before Christmas", title: "To his brother", sub: "", quote: "I think the game is pretty near up.", qSize: 34, height: 270,
      cps: 40, qAt: T.wrote - 0.2, lag: 0.05, stagger: 0.06, partDur: 0.35 }],
    ["film.dim", T.method - 0.5, T.not + 0.8, 0.55],
    ["letter", T.method - 0.2, T.not + 0.8, { header: "George Washington", title: "The Washington Method", sub: "", marks: false, quote: "1. Save the army first\n2. Hit them where they rest\n3. Go where they are not", qSize: 34, height: 300,
      cps: 17, qAt: T.save - 0.05, lag: 0.05, stagger: 0.06, partDur: 0.35 }],
    () => { const q = [...document.querySelectorAll("#ov .letter .q")].pop(); if (q) q.style.whiteSpace = "pre-line"; },
    ["plaque.hide", T.not + 0.7],
    ["engage.final", { moves: [["BROOKLYN", "29-30 AUGUST 1776"], ["TRENTON", "26 DECEMBER 1776"], ["PRINCETON", "3 JANUARY 1777"]], q: "WHICH WAS HIS GREATEST MOVE?", sub: "",
      tShow: T.which - 0.1, tNums: [T.one, T.two, T.three2], tAsk: T.princeton + 0.5, extra: "Tell us in the comments, and which commander we should cover next", tExtra: T.tell,
      until: T.subscribe - 0.2, tSub: T.subscribe - 1.25, subUntil: T.one2 + 0.5 }],
  ],
  start: {}, end: { fadeAt: T.D - 1.5, dur: 1.5 },
  build: (ctx) => { held.build(ctx); },
  draw: (t, ctx) => { held.draw(t, ctx); },
};
})();
