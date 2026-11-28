// TEST COPY of hook-a for the Style W borrow test (research/style_tests/stylew_borrow/NOTES.md); build with --borrow. Changes are marked BW.
// HOOK-A (hook-1, hook-2), Francis Marion #18. THE LOCKED HOOK (STYLE_LOCK 1a stakes -> one continuous zoom -> number; 1c clean screen;
// 2d/2e/2f main style via the Marion map kit). Build: python3 kit/build_scene.py hook-a lowcountry hook-1 hook-2 --inset santee
// hook-1: frame 0 = `lowcountry` wide, clean: red supply wagons already rolling up the Charleston - Nelson's Ferry road, the Charleston + Camden
//   garrisons, the two flags. "seventeen eighty": the date plate lands with a hit + shake (the first-second beat). "Britain's grip": two red road
//   posts drop in. "one road": a sepia ink trace runs Charleston -> Nelson's Ferry -> Camden + stamp ONE ROAD. "from Charleston": soft focus on the
//   town. "across the Santee": ONE continuous zoom (zoom whoosh) down the road onto the Santee crossing (lowcountry -> santee INSET, one camera,
//   no cut, no flash), arriving on "Nelson's Ferry" (carved place label on the word); the wagons roll up to the south landing.
// hook-2 (inside the santee inset): "There, before dawn": night falls; the red guard + two grey prisoner boxes at the Great Savannah house up the
//   road; blue riders come out of the cypress swamp; SEVENTY / MEN ON HORSEBACK card on "seventy men"; 150 / AMERICAN PRISONERS card (ticks) on
//   "a hundred and fifty"; the prisoners turn blue on "free"; the guard fires (musket flashes, visible) on "under the guns", then is taken.
//   "Within four months": hard pull back to `lowcountry` wide (zoom whoosh), day; "between two rivers": the two rivers inked + blue FORM 1
//   hatching on the ground between the Santee and the Pee Dee; quote card SCARCE AN INHABITANT NOT IN ARMS; blue militia boxes rise there.
// No hero name, no banner here (1c): the general is only "seventy men on horseback".
const H1 = "hook-1", H2 = "hook-2";
const T_DATE = at(H1, "seventeen eighty"), T_GRIP = at(H1, "Britain"), T_ROAD = at(H1, "one road"), T_CHS = at(H1, "from Charleston"),
  T_SANTEE = at(H1, "across the Santee"), T_NF = at(H1, "Nelson's Ferry");
const T_THERE = at(H2, "There"), T_DAWN = at(H2, "before dawn"), T_70 = at(H2, "seventy men"), T_150 = at(H2, "a hundred and fifty"),
  T_FREE = at(H2, "free"), T_GUNS = at(H2, "under the guns"), T_GUARD = at(H2, "British guard"), T_4M = at(H2, "Within four months"),
  T_CMDR = at(H2, "the British commander"), T_RIVERS = at(H2, "between two rivers", -0.6), T_SCARCE = at(H2, "scarce an inhabitant", -0.58), T_ARMS = at(H2, "not in arms", -0.55);
// (critic r1) the last sentence has no measured anchor after 17.96 s; its pauses in voice.wav (19.04-19.41, 21.52-21.68, 23.15-23.33) put "that between
// two rivers" at ~21.7-23.1 and "there was scarce an inhabitant" from ~23.4: the three phrases above are shifted onto those pauses
// ---------------------------------------------------------------------------------------------------------------------------------
// maps + camera (one camera over `lowcountry`; the santee map sits in its true place inside it, 8x)
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const SAN = INSET("santee", { s0: 2.2, s1: 2.8 });
const PP = (x, y) => [SAN.box[0] + x * SAN.k, SAN.box[1] + y * SAN.k];          // santee map px -> lowcountry map px
const SP = (s) => s / SAN.k;                                                      // santee camera scale -> lowcountry camera scale
// camera path segments (as yorktown hook-a): seg(t0, t1, a, b, ease, path); with a path the scale changes geometrically and the centre runs
// along the path with v = (1/sa - 1/s)/(1/sa - 1/sb): every point heads straight for its place on screen (one continuous zoom, no swing)
const SEGS = [], seg = (t0, t1, a, b, ease = "sine.inOut", path = null) => { SEGS.push({ t0, t1, a, b, e: gsap.parseEase(ease), path }); SEGS.sort((p, q) => p.t0 - q.t0); };
const camAt = (t) => { let c = SEGS[0].a;
  for (const g of SEGS) { if (t < g.t0) break; const u = g.e(Math.min(1, (t - g.t0) / Math.max(g.t1 - g.t0, 1e-3))), a = g.a, b = g.b;
    if (g.path) { const s = a[2] * (b[2] / a[2]) ** u, v = (1 / a[2] - 1 / s) / (1 / a[2] - 1 / b[2]), q = posOn(g.path, v); c = [q[0], q[1], s]; }
    else c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  return c; };
const camKeys = () => { const ts = new Set(); for (let t = 0; t <= END + 1e-6; t += 0.05) ts.add(+t.toFixed(3));
  SEGS.forEach((g) => { ts.add(g.t0); if (g.t0 > 0.003) ts.add(+(g.t0 - 0.002).toFixed(4)); ts.add(Math.min(END, g.t1)); });
  return [...ts].filter((t) => t >= 0 && t <= END).sort((a, b) => a - b).map((t) => [t, ...camAt(t), "none"]); };
const C0 = [1352, 850, 0.72], C1 = [1345, 858, 0.76];
const CEND = [...PP(1575, 950), SP(1.62)];          // the ferry (bottom) + the Great Savannah house (top) in one frame
const CH2 = [...PP(1535, 745), SP(1.9)];            // hook-2: slow push up the road onto the house
const CW = [1440, 780, 0.74];                       // the wide frame after the pull back (= hook-b frame 0)
// BW r4: the v8 cloud dive with the real engine (kit/js/bwgl.mjs): a high oblique view over the whole Lowcountry (tilt ~38 deg) drifting down
// while "one road ... Charleston ... Santee River" is spoken, then the fall into the deck over Nelson's Ferry, the white-out around the swap
// (SW), the landing on the santee map under it, emerging through torn stratus; settled by ~8.9 s ("There, before dawn" 9.0 s)
const SW = 7.0, NFL = PP(1581.8, 1085.8);   // r5: short white-out ~6.6-7.1 s, swap under it; landed clear by ~7.6 s
const TZ0 = T_SANTEE - 0.35, TZ1 = SW + 0.75;
const A0 = [1395, 985, 1.05], A1 = [1440, 1005, 1.15], AD = [NFL[0], NFL[1] - 6, 8.0];
seg(0, 5.6, A0, A1, "sine.inOut");
seg(5.6, SW, A1, AD, "power2.in", [[A1[0], A1[1]], [AD[0], AD[1]]]);
seg(SW, TZ1, [AD[0], AD[1], 9.2], CEND, "power2.out");
SFX("whoosh", TZ0 - 0.1);
seg(TZ1 + 0.02, T_DAWN + 1.4, CEND, CH2, "sine.inOut");
seg(T_DAWN + 1.42, T_4M - 0.05, CH2, [CH2[0] + 2, CH2[1] - 1, CH2[2] * 1.05]);
const TP0 = T_4M - 0.15, TP1 = T_4M + 1.6;
seg(TP0, TP1, CH2, CW, "power2.inOut", [[CH2[0], CH2[1]], [1360, 880], [CW[0], CW[1]]]);
SFX("whoosh", TP0 - 0.1);
seg(TP1 + 0.02, END, CW, [CW[0] + 6, CW[1] - 4, CW[2] * 1.02]);
camera(camKeys());
// ---------------------------------------------------------------------------------------------------------------------------------
// the date plate: "seventeen eighty" -> 1780 lands with a hit + shake (the stamp of the first second)
// ---------------------------------------------------------------------------------------------------------------------------------
{ const d = B.date("1780", T_DATE + 0.05, null, 32);
  tl.fromTo(d, { scale: 1.7, transformOrigin: "0% 50%" }, { scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, T_DATE + 0.05);
  SFX("hit", T_DATE + 0.27); K.shake(T_DATE + 0.27, 3, 0.25); }
// ---------------------------------------------------------------------------------------------------------------------------------
// hook-1 (lowcountry wide): units already moving, the two flags
// ---------------------------------------------------------------------------------------------------------------------------------
// a light ink trace (parchment line with a dark casing, constant ~4 px on screen) drawn along a feature on its word, then fades
const TRACE = (pts, t, until, w = 4, draw = 1.0) => { const g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" L");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(20,16,8,.6)" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#f3e6b8" stroke-linecap="round" stroke-linejoin="round"/>`;
  OVL.appendChild(g); const [a, b] = g.querySelectorAll("path"), L = b.getTotalLength();
  onCam((s) => { a.setAttribute("stroke-width", ((w + 3) / s).toFixed(3)); b.setAttribute("stroke-width", (w / s).toFixed(3)); });
  [a, b].forEach((p) => gsap.set(p, { attr: { "stroke-dasharray": L + 1, "stroke-dashoffset": L } })); gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 0.9, duration: 0.2 }, t); tl.to([a, b], { attr: { "stroke-dashoffset": 0 }, duration: draw, ease: "sine.inOut" }, t);
  tl.to(g, { autoAlpha: 0, duration: 0.6 }, until); return g; };
const ROAD = (id) => GD.bake.roads.find((r) => r.id === id).paths[0];
const R_CN = ROAD("chs_nelson"), R_NC = ROAD("nelson_camden");
UNIT("pC", "british", NUDGE(LYT(32.99, -80.10)), "infantry", { ech: "XX" });       // Charleston garrison
UNIT("pK", "british", NUDGE(LYT(34.12, -80.70)), "infantry", { ech: "XX" });       // Camden
UNIT("pM", "british", NUDGE(LYT(33.24, -80.08)), "infantry", { ech: "II", t: T_GRIP });          // Monck's Corner post
UNIT("pN", "british", NUDGE(LYT(33.40, -80.37)), "infantry", { ech: "II", t: T_GRIP + 0.35 });   // the post below Nelson's Ferry
SIDEFLAG("gb", LYT(32.98, -80.52)); SIDEFLAG("sc", LYT(33.86, -79.55));
// the wagons: up the lowcountry road, then (inside the santee map) on the santee road to the south landing of Nelson's Ferry
{ const NF = PP(1581.8, 1085.8);           // south landing (santee px)
  const lo = R_CN.filter((p) => Math.hypot(p[0] - NF[0], p[1] - NF[1]) > 22);
  const W1 = [...sub(lo, 0.55, 1.0, 30), PP(1600, 1140), PP(1590, 1112)], W2 = [...sub(lo, 0.38, 0.98, 30), PP(1612, 1170)];
  UNIT("w1", "british", W1[0], "supply", { ech: "" }); UNIT("w2", "british", W2[0], "supply", { ech: "" });
  march("w1", W1.slice(0, 22), 0, 4.6, { trail: false, dustSize: 70, dustOp: 0.45 }); along("w1", W1.slice(21), 4.6, TZ1 - 4.6 + 0.6);
  march("w2", W2.slice(0, 22), 0.2, 4.4, { trail: false, dustSize: 70, dustOp: 0.45 }); along("w2", W2.slice(21), 4.6, TZ1 - 4.6 + 0.8);
  hideU(["w1", "w2"], T_THERE + 0.1); }
// "one road": a thin sepia ink trace Charleston -> Nelson's Ferry -> Camden (fades) + the stamp ONE ROAD on empty ground west of it
TRACE([...R_CN, ...R_NC], T_ROAD - 0.1, TZ0 + 0.2, 4, 1.1);
wstampL("ONE ROAD", 860, 1110, T_ROAD, TZ0 + 0.1, null, 46);
focus(LYT(32.80, -79.95), 150, T_CHS, TZ0 + 0.3);
// units of hook-1 that would sit as huge-spaced boxes at the frame edge in the dive fade out
hideU(["pC", "pK", "pM", "pN"], TZ0 + 0.5);
// "Nelson's Ferry": the carved place name on the word (the camera arrives on it)
PLACE_LABEL("Nelson's Ferry", PP(1582, 1081), T_NF, { dy: 30, size: 40, hold: 4.2 });   // r4: on its word (under the white-out), held to ~11.6 s
// ---------------------------------------------------------------------------------------------------------------------------------
// hook-2 (santee inset): the Great Savannah raid, before dawn
// ---------------------------------------------------------------------------------------------------------------------------------
LIGHT("night", T_THERE, 1.4, 0.7);
// units that appear at high zoom fade in (the kit drop-in falls from far above at 13x)
const UNITF = (id, side, p, type, o = {}) => { UNIT(id, side, p, type, { ...o, t: 0 }); const el = B.units[id].el; gsap.set(el, { autoAlpha: 0 });
  tl.to(el, { autoAlpha: 1, duration: o.fade ?? 0.4 }, o.t); return id; };
UNITF("g1", "british", PP(1478, 702), "infantry", { ech: "II", t: T_THERE + 0.2 });               // the guard at the house
UNITF("q1", "allies", PP(1585, 606), "infantry", { ech: "", t: T_THERE + 0.35 });                 // the prisoners (grey until freed)
UNITF("q2", "allies", PP(1640, 652), "infantry", { ech: "", t: T_THERE + 0.45 });
["q1", "q2"].forEach((id) => { const blk = B.units[id].el.querySelector(".blk"); gsap.set(blk, { filter: "grayscale(1) brightness(0.85)" });
  tl.to(blk, { filter: "grayscale(0) brightness(1)", duration: 0.5 }, T_FREE); });
// seventy riders out of the cypress swamp (no trail at night: they come unseen)
const RID = [["r1", [[33.468, -80.372], [33.478, -80.356], [33.4885, -80.3455]]], ["r2", [[33.461, -80.362], [33.472, -80.348], [33.4835, -80.3355]]],
  ["r3", [[33.465, -80.350], [33.474, -80.337], [33.4848, -80.3240]]], ["r4", [[33.457, -80.371], [33.466, -80.360], [33.4785, -80.3470]]]];
const REND = [[1405, 690], [1470, 772], [1560, 765], [1392, 775]];
RID.forEach(([id, ll], i) => { const P = [...LLYT(ll.slice(0, 2)), PP(...REND[i])]; UNITF(id, "allies", P[0], "cavalry", { ech: "", t: T_DAWN + 0.1 * i });
  march(id, P, T_DAWN + 0.3 + 0.12 * i, T_FREE - T_DAWN - 0.5 - 0.1 * i, { trail: false, dust: false }); });
// "seventy men on horseback": the big number card (slam + hit + shake)
// BW r2: one design language: the number cards are ivory/gold plaques (~300 x 130, Cinzel), the watch plaque's style, top-right
const CARD = (big, l1, l2, col) => `<div style="box-sizing:border-box;width:300px;min-height:130px;padding:12px 18px 12px;background:linear-gradient(170deg,#E6DEC5,#D2C6A3);border:1.5px solid #4E4532;border-radius:3px;box-shadow:inset 0 0 0 4px #DED5BA,inset 0 0 0 5px #7D7158,0 10px 24px rgba(0,0,0,.45);font-family:'GM Cinzel',serif;font-weight:700;color:#1E180E;text-align:center">
  <div class="v" style="font-size:62px;line-height:1;letter-spacing:.04em;font-variant-numeric:lining-nums">${big}</div><div style="font-size:16px;letter-spacing:.2em;color:#2a4a8e;margin-top:6px">${l1}</div>${l2 ? `<div style="font-size:14px;letter-spacing:.24em;color:#5A4F3A;margin-top:3px">${l2}</div>` : ""}</div>`;
const T70 = T_70 + 0.02;   // r3: the plaque starts on "seventy" (10.50 s), not before
{ const el = scr(CARD("70", "MEN ON HORSEBACK"), "right:58px;top:63px;display:flex;justify-content:center;transform-origin:50% 30%;", T70, null, { autoAlpha: 0 });
  slam(el, T70, { from: 1.35, shake: 4, until: T_150 - 0.3 }); }
{ const el = scr(CARD("0", "AMERICAN PRISONERS", "SET FREE"), "right:58px;top:63px;display:flex;justify-content:center;transform-origin:50% 30%;", T_150, null, { autoAlpha: 0 });
  slam(el, T_150, { from: 1.35, shake: 4, until: Math.min(T_GUARD, 16.9) });
  const sf = el.firstElementChild.lastElementChild; gsap.set(sf, { autoAlpha: 0 }); tl.fromTo(sf, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_FREE);
  const v = el.querySelector(".v"), st = { x: 0 };
  tl.fromTo(st, { x: 0 }, { x: 150, duration: 0.9, ease: "power2.out", immediateRender: false, onUpdate: () => { v.textContent = String(Math.round(st.x / 10) * 10); } }, T_150 + 0.2);
  for (let k = 0; k < 7; k++) SFX("tick", T_150 + 0.25 + k * 0.12); }
// "under the guns of their British guard": the guard fires at the riders (visible musket flashes), powder smoke, then the guard is taken
mg(PP(1478, 702), PP(...REND[0]), T_GUNS + 0.05, 5, 1.3 / CH2[2]);
mg(PP(1478, 702), PP(...REND[1]), T_GUNS + 1.1, 4, 1.3 / CH2[2]);
// muzzle flashes at the guard (constant size on screen; visual only, the mg sound carries them)
// BW: every shot of the guard = one muzzle flash + one flintlock shot cue (6 shots, ragged)
[0.05, 0.27, 0.42, 1.1, 1.31, 1.58].forEach((dt, i) => BW.musketShot(PP(1478 - 16 + 7 * i, 702 + (i % 2 ? 8 : -6)), T_GUNS + dt, { aim: PP(1478 - 60 - 7 * i, 702 - 70) }));   // r8: fired north-west over the riders' approach: the smoke stays clear of every box
// r4: two short tall smoke curtains beside the guard (engine fx.smokeLine, GM settings), clear of the prisoners (east)
// r5: real curtains: wider (gmTall), leaning downwind (west-north), from the guard's muzzles east of the box; boxes stay >= 50 % visible
// r7: the smoke is the engine volley smoke from each shot (pan puff + jet + billows -> bank), see NOTES "musket smoke + flash spec"
// BW r3: the kit smoke is replaced by the per-shot puffs (<= 6 per volley)
B.move("r1", T_GUARD - 0.25, 0.45, ...PP(1440, 698)); B.move("r2", T_GUARD - 0.15, 0.45, ...PP(1478, 740));
// r9 (owner: the effect of fire / the fight on the target): on "British guard" the riders hit the guard: it shudders, dims, loses a chunk,
// its edges go ragged (shaken) and it staggers back; then it is overrun = captured (grey with its red edge, STYLE rule), and leaves with the pull back
BW.hit("g1", T_GUARD + 0.15, { from: PP(1440, 698), at: PP(1478, 702), loss: 0.15, shaken: true, marks: 0 });
BW.captured("g1", at(H2, "guard") + 0.02, 0.05);   // r10: grey at ~17.03 s, right after "guard" (16.98 s)
hideU(["g1"], T_4M + 0.15);
// ---------------------------------------------------------------------------------------------------------------------------------
// "Within four months": the pull back to the wide map, daylight; "between two rivers": the ground between the Santee and the Pee Dee
// ---------------------------------------------------------------------------------------------------------------------------------
LIGHT("day", T_4M + 0.2, 1.4);
hideU(["q1", "q2", "r2", "r3", "r4"], T_4M + 0.15);
// (critic r1) the riders stay on screen as ONE blue box at the Great Savannah through the pull back (Marion's men; the Moultrie side flag stays up on the wide map)
B.move("r1", T_4M - 0.1, 1.2, ...PP(1540, 735));
// "the British commander in the South": the red garrisons of Charleston and Camden come back on the wide map
tl.to([B.units.pC.el, B.units.pK.el], { autoAlpha: 1, duration: 0.4 }, T_CMDR); SFX("hit", T_CMDR + 0.1);
const RS = GD.rivers.santee, RPD = GD.rivers.pee_dee, RWL = GD.rivers.wateree_low, YTOP = 330;
TRACE(RS, T_RIVERS - 0.15, T_RIVERS + 3.0, 4, 0.9);
TRACE(RPD.filter((p) => p[1] >= 300), T_RIVERS - 0.05, T_RIVERS + 3.0, 4, 0.9);
// the ground between them (Wateree / Santee / Pee Dee / Lynches Creek), FORM 1 blue, a touch stronger at this wide scale (2d.3)
{ const RL = GD.rivers.lynches_creek, conf = RL[RL.length - 1];
  const pd = RPD.slice().reverse(); const iC = pd.reduce((bi, p, i) => (Math.hypot(p[0] - conf[0], p[1] - conf[1]) < Math.hypot(pd[bi][0] - conf[0], pd[bi][1] - conf[1]) ? i : bi), 0);
  const poly = [...RWL.filter((p) => p[1] >= YTOP), ...RS, ...pd.slice(0, iC + 1), ...RL.slice().reverse().filter((p) => p[1] >= YTOP)];
  const d = HATCH_LAYER(poly, "#2c57b7", 2.4, 10, 0.9); tl.to(d, { autoAlpha: 1, duration: 0.5 }, T_RIVERS + 0.15); tl.to(d, { autoAlpha: 0, duration: 0.8, ease: "sine.inOut" }, T_RIVERS + 2.9); }
// quote card on the spoken words (no credit line: only spoken words)
{ const el = scr(`<div style="padding:18px 46px 20px;background:rgb(18,16,12);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55);text-align:center">
    <div style="font-size:44px;font-weight:600;line-height:1.2;letter-spacing:.05em">SCARCE AN INHABITANT &hellip;<br>NOT IN ARMS</div></div>`,
    "left:0;right:0;top:820px;display:flex;justify-content:center;", T_SCARCE - 0.05, END - 0.35);
  SFX("hit", T_SCARCE + 0.2); }
// "not in arms against him": blue militia boxes rise between the two rivers
[[1395, 640], [1545, 820], [1700, 590], [1790, 790], [1560, 480], [1870, 655]].forEach((p, i) =>
  UNIT("m" + i, "allies", NUDGE(p, { s: CW[2] }), "cavalry", { ech: "", t: T_ARMS + 0.12 * i }));

// ================================================================================================================================
// BW (borrowed from the 3D films): cloud dive, pocket-watch plaque, THE ARMIES, tilt
// ================================================================================================================================
// r4: the real engine (fx.vclouds + the v8 dive + the close stratus + cloud shadows on the ground), camera solved from the DOM camera
if (!GD.var.paint) { const ROADP = [...R_CN, ...R_NC].filter((q, i) => i % 2 === 0), CHS = LYT(32.80, -79.95);
  // r5 timing (critic B: the spoken places must read): deck from 6.4 s, white ~6.6-7.1 s, emerge 7.1, clear 7.25, haze gone 7.55, land 7.6
  BW.gl({ mpu: 128, dive: { t: SW, over: NFL, grey: 0.8, greyCol: "rgb(205,205,200)" }, hazeK: 0.6, shadowK: 0.25,   // r13b (critic A): ground shadows 25 %; inside the deck an even grey 6.6-7.1 s
    diveOff: { push: -1.4, deckIn: -1.3, full: -0.5, deck: -0.45, wIn: -0.4, inside: -0.2, warm: 0.05, emerge: 0.2, clear: 0.35, haze: 0.6, land: 0.75 },   // r6: the deck closes in from the frame edges from 5.8 s (clear window over the crossing to ~6.45), full by 6.75
    fair: { F: 3.3, box: [0, 0, 2900, 1800], n: 21, med: 28, rMin: 22, rMax: 48, hMin: 10, drift: [0.8, -0.27], edgeKeep: { near: 120, far: 40 }, baseRound: 0.3, sun0: [1.0, 0.95, 0.85], ambTop0: [0.50, 0.55, 0.64], shadowDir: [-0.22, 1, 0.56],   /* r13g: no edge wings, rounded bottoms, warm lit tops vs cooler shade, shadows down-right */   /* r13f: 12-16 cumulus in 5 loose groups; visible drift (near 1.6x) */ kidD: [0.75, 0.6], kidZ: 1.3, erode0: () => -0.4,   /* r13e: fair lumps rendered far smaller than placed (the noise ate them): grow them */ lumpK: 0.22,   // r13d: rounder (<= 1.6:1) cumulus; r13e: smoother outlines (no radial ridges)
      screenPlace: { t: 2.6, px: [-60, -30, 1980, 1110], med: 124, sig: 0.45, rMin: 40, rMax: 160, lobes: true, groups: { n: 6, gap: 460, spread: 160, overlap: 0.55, unitGap: -40 } },   // r13e: clusters spread evenly over the frame (incl. the middle third)
      sunK0: 2.05, ambK0: 0.24, skirtCut: 3, seed: 5, tiers: [52, 74], nearTier: 66,   /* r13e: the 100 x F upper layer rendered almost nothing (its thin lumps vanished); 74 renders */
      nearK: 1.6, ambBot: [0.46, 0.50, 0.58],   // r13b: 10-14 bigger cumulus on 2 heights, the near layer drifts 1.6x
      masses: [[-64, -30, 76], [62, -26, 74], [2, 58, 74], [8, 6, 80], [-56, 52, 54], [58, 52, 54]], massStep: 22, massLump: [28, 12], groupScale: 2.2,   // r13b: the deck = 3 big merged masses + the centre
      diveClear: 40,   // r13c: the field reaches the middle third too
      // r13c deck (critic A): the masses fade in from 5.3 s (density + erosion, no pop-in): ~30 % at 5.9, ~65 % at 6.3, ~95 % at 6.6; soft edges
      // r13d (critic A): a smooth ramp (11/18/26/35/45/57/99 % at 5.3/5.5/5.7/5.9/6.1/6.3/6.6 s); the side masses lead a little (small centre
      // erosion gone by 5.8 s: no ring, no hole round the target), undersides grade to ~(120,126,136)
      deckK: (t) => BW.sstep(5.25, 5.8, t), nearOp: (t) => 1 - BW.sstep(5.8, 6.1, t),   /* r13e: the upper clouds stay until the deck is under them (white on white), no see-through ghosts */ deckFront: (t) => 0.7 * (1 - BW.sstep(5.3, 5.8, t)),
      deckLook: { ambBot: [0.34, 0.37, 0.43], ambTop: [0.55, 0.58, 0.64], ambK: 0.30, lightK: 3.4, sunK: 1.25 },   // r13c: grey hollows, tops ~10 % under the fair cumulus
      deckErode: (t) => { if (t < 5.25 || t > SW + 0.5) return 9; const P = [[5.25, 1.6], [5.5, 1.3], [5.7, 1.0], [5.9, 0.6], [6.1, 0.32], [6.3, 0.14], [6.5, 0]]; for (let i = 1; i < P.length; i++) if (t < P[i][0]) return BW.lerp(P[i - 1][1], P[i][1], (t - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return 0; },
      // r13c: the road / ONE ROAD stamp / Charleston corridor is cleared only while the trace + stamp + focus are on screen (its clusters fade out, then back)
      corridor: { perDome: true, t: [T_ROAD - 0.6, TZ0 + 0.4], keepLines: [[ROADP, 25]], keep: [[CHS[0], CHS[1] + 40, 120], [860, 1110, 120]], op: (t) => 1 - 0.6 * (BW.sstep(T_ROAD - 0.7, T_ROAD - 0.1, t) - BW.sstep(TZ0 + 0.3, TZ0 + 0.9, t)) }   /* r13h: a soft alpha dip only */,
      unitWatch: [LYT(32.99, -80.10), LYT(34.12, -80.70), LYT(33.24, -80.08), LYT(33.40, -80.37)],   /* r13h: no unit culling; the authored field is nudged off the boxes */
      // r13h: AUTHORED field = the gm3d v6 clip's clouds traced at 10.4 s (our ~1 s): [screen x, y, radius px, lobes, layer 0 far / 1 near];
      // the v6 cloud at x 645 / y 145 moved to x 520 (it sat on the Camden box); two small additions (1250/230, 1350/760) keep ~13 %
      authoredK: 1.6, authored: [[960, 40, 70, 2, 0], [520, 150, 95, 3, 0], [230, 225, 95, 3, 1], [70, 440, 105, 3, 1], [110, 620, 125, 4, 1], [670, 640, 105, 3, 0],
        [1680, 390, 130, 4, 0], [1590, 320, 35, 1, 0], [1690, 600, 30, 1, 0], [1780, 650, 65, 2, 0], [1250, 230, 55, 2, 0], [1350, 760, 70, 2, 1]],   // r13d: >= 40 px off the British boxes
      on: (t) => t < SW + 1.2 },   // r13c: no screenClear cluster deletion (it emptied the middle of the field); the date plate is HUD (drawn above the clouds)
    stratus: { F: 3.1, at: [CEND[0], CEND[1]], speed: 0.45 }, volley: BW.smoke("musket.night", { K: 1 / 15.2, wind: [-14, -36], gone: 17.0 }) }); }   // LOOK LOCK v1: BW.LOCK.smoke["musket.night"]   // r13: thinner, carried off north-west, gone in ~5 s   // r9: gone 0.5 s before it reaches the riders   // r8: the guard smoke blows north, away from every box
// r16 (owner 2026-11-28: "the clouds should be suited for a 2D film"): PAINTED clouds (kit/js/paint_clouds.js, build --paint): gouache sprites in
// 3 parallax layers over the map + their soft painted shadows, a painted deck round Nelson's Ferry that the lens falls into, and a painted
// cloud wipe (the near layer fills the frame around the swap SW and parts outward onto the ferry) in place of the grey white-out.
// The engine layer stays for the guard's musket smoke only (no fair clouds, no deck, no stratus, no white-out, no grey haze band).
else { BW.gl({ mpu: 128, hazeK: 0, shadowK: 0, volley: BW.smoke("musket.night", { K: 1 / 15.2, wind: [-14, -36], gone: 17.0 }) });
  const L0 = 0, L1 = 1, L2 = 2;   // far / mid / near layers (altitudes in map px: the push-in passes them at different times)
  PC.dive({ layers: [330, 640, 1150], fieldAt: 2.6, wind: [1.1, -0.35], shadowK: 0.2, shadowOff: [70, 55],
    fieldTint: [0.983, 0.975, 0.956],   // r16c polish: the field warmed toward the map grade (lit tops ~(238,232,218), ~4 % darker)
    // r16c (old illustrated map): lobed painted cumulus groups seen from above + 3 long low wisps; log-normal sizes (sprite radius 72-361 px,
    // 5x), ~12-15 % cover over the frame, off the road / ONE ROAD / Charleston / the British boxes; [screen x, y, radius px at 2.6 s, layer, sprite]
    field: [[560, 150, 137, L0, "pc_g3"], [1490, 110, 102, L0, "pc_g5"], [1770, 470, 216, L0, "pc_g1"], [1540, 940, 159, L0, "pc_g4"], [300, 330, 87, L0, "pc_g2"], [1300, 260, 72, L0, "pc_g6"],
      [1350, 330, 331, L0, "pc_w0"], [420, 480, 361, L0, "pc_w1"], [1700, 1010, 346, L0, "pc_w2"],
      [190, 200, 233, L1, "pc_g0"], [1680, 260, 209, L1, "pc_g2"], [1620, 720, 270, L1, "pc_g7"], [330, 960, 172, L1, "pc_g8"],
      [-30, 560, 263, L2, "pc_b0"], [1980, 880, 283, L2, "pc_b2"], [1890, 40, 231, L2, "pc_g9"]],
    fieldOp: (t, c) => (c.layer === 2 ? 0.9 : 1),
    // the BANK + the wipe (screen space round the ferry): 9 big lobed masses [from angle, scale, sprite, flip, enter time, radius px when closed]
    // grow in from all edges from 6.0 s (>= 70 % cover by 6.6 s with a hole over the wagons), close by ~6.92 s, the painted backing <= ~0.13 s
    // round SW, then part outward into soft wisps (the ferry clear by ~7.6 s)
    wipe: { t: SW, track: NFL, dx: 60, dy: 110, jitter: true,   /* r16c polish: the hole centred on the wagons */   /* r16c polish: per-mass mirror / +-20 deg / +-15 % / small hue + brightness jitter */ outDur: 0.6, part: 1500, rIn: 1450, rMid: 980, tMid: 6.6, closeLead: 0.08, masses: [[0.20, 1.6, "pc_b0", 0, 6.000, 450], [0.90, 1.7, "pc_b1", 1, 6.025, 480], [1.60, 1.55, "pc_b2", 0, 6.050, 430], [2.29, 1.65, "pc_b3", 1, 6.075, 470], [2.99, 1.6, "pc_b4", 0, 6.100, 460], [3.69, 1.6, "pc_b0", 1, 6.125, 450], [4.39, 1.7, "pc_b1", 0, 6.150, 480], [5.09, 1.55, "pc_b2", 1, 6.175, 430], [5.79, 1.65, "pc_b3", 0, 6.200, 470]]},
    haze: (t, c) => 0.85 * BW.sstep(0.35, 0.62, c.th),   // a warm painted haze over the far edge while the view is steeply tilted
    until: TZ1 + 0.4 }); }
// hook-2: "before dawn" is the script's only time: the pocket watch comes in (hands ~4:30, no clock time is spoken)
BW.time(T_DAWN, { label: "Before dawn", header: "1780" });   // r2: no clock time is spoken: text only, no watch
BW.date("1780", T_4M + 0.1);
// THE ARMIES (replaces the side-colour key plate)
// r2: enters after the dive lands; "Americans" in the hook (no hero name before the name slam); steps out 0.15 s before the number cards
{ const ENT = [{ name: "Americans", sub: "militia", color: "#2c57b7" }, { name: "British", sub: "and Loyalists", color: "#bc2528" }];
  BW.legend(8.5, T70 - 0.15, ENT); BW.legend(Math.min(T_GUARD, 16.9) + 0.5, END + 1, ENT); }
// gentle tilt: flat while falling, then a slow push with ~8 deg of perspective once the lens is below the clouds
// r4: high oblique (38 deg) for the overview, straightening during the fall (10 deg at the swap), 7 deg on the landed 2D map
BW.tilt([[0, 38, 1.0], [5.6, 36, 1.0], [SW - 0.02, 10, 1.0, "power2.in"], [SW, 14, 1.0, "none"], [TZ1, 7, 1.05, "power2.out"], [END, 7, 1.06]]);
