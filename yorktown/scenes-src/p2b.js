// P2B (p2-8), Yorktown 1781, PART 2 THE SEA, the land side + cliffhanger. Main style (STYLE_LOCK 2d/2e/2f via the Yorktown map kit), 1c, 1d.
// Build: python3 kit/build_scene.py p2b east p2-8 p2-8 --inset chesapeake --inset peninsula
// Frame 0 = p2a's last frame (the chesapeake inset inside `east`: French ships across the bay mouth, de Grasse + Cornwallis banners, the method
//   card leaving). "On land": one continuous zoom into the `peninsula` inset (Williamsburg .. Yorktown); a blue box marches east (Lafayette's
//   small army), "the Marquis de Lafayette": his banner; "de Grasse landed ... French soldiers": boats on the James, two French boxes land and
//   march up across the Williamsburg-Yorktown road (focus on the road). "And the main armies were coming": pull back to `east` wide; boats sail
//   down the bay ("in boats"); "Washington rode": his banner rides south from the head of the bay; "Mount Vernon": place name + soft warm glow
//   (~3 s), date 9 SEP; "On the fourteenth of September": 14 SEP, he rides on and the camera dives back into the peninsula, arriving on
//   "he reached Williamsburg"; cliffhanger: "twelve miles from Yorktown": the camera turns toward Yorktown; "Cornwallis was still waiting":
//   the red works are dug round the town.
const P8 = "p2-8";
const T_LAND = at(P8, "On land"), T_CLOSING = at(P8, "the trap was already closing"), T_SUMMER = at(P8, "All summer"), T_YOUNG = at(P8, "a young French general"),
  T_LAFA = at(P8, "the Marquis de Lafayette"), T_SHADOW = at(P8, "shadowed Cornwallis"), T_SMALL = at(P8, "with a small army"), T_NOW = at(P8, "Now de Grasse landed"),
  T_3000 = at(P8, "more than three thousand French soldiers"), T_JOIN = at(P8, "to join him at Williamsburg"), T_ROAD = at(P8, "across the only road"),
  T_MAIN = at(P8, "And the main armies were coming"), T_MOST = at(P8, "Most of the troops"), T_BOATS = at(P8, "in boats"), T_RODE = at(P8, "Washington rode"),
  T_WAY = at(P8, "On the way"), T_MV = at(P8, "he stopped at Mount Vernon"), T_HOME = at(P8, "his home"), T_SIX = at(P8, "for the first time in six years"),
  T_THREE = at(P8, "stayed three nights"), T_14 = at(P8, "On the fourteenth of September"), T_REACH = at(P8, "he reached Williamsburg"),
  T_12 = at(P8, "twelve miles from Yorktown"), T_STILL = at(P8, "Cornwallis was still waiting"), T_NAVY = at(P8, "for his navy");
// ---------------------------------------------------------------------------------------------------------------------------------
// maps + camera (one camera over `east`; the chesapeake + peninsula insets in their true place)
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const CH = INSET("chesapeake"), PEN = INSET("peninsula");
const CP = (x, y) => [CH.box[0] + x * CH.k, CH.box[1] + y * CH.k], CS = (s) => s / CH.k;
const PP = (x, y) => [PEN.box[0] + x * PEN.k, PEN.box[1] + y * PEN.k], SP = (s) => s / PEN.k, PPL = (pts) => pts.map(([x, y]) => PP(x, y));
const SEGS = [], seg = (t0, t1, a, b, ease = "sine.inOut", path = null) => { SEGS.push({ t0, t1, a, b, e: gsap.parseEase(ease), path }); SEGS.sort((p, q) => p.t0 - q.t0); };
const camAt = (t) => { let c = SEGS[0].a;
  for (const g of SEGS) { if (t < g.t0) break; const u = g.e(Math.min(1, (t - g.t0) / Math.max(g.t1 - g.t0, 1e-3))), a = g.a, b = g.b;
    if (g.path) { const s = a[2] * (b[2] / a[2]) ** u, v = (1 / a[2] - 1 / s) / (1 / a[2] - 1 / b[2]), q = posOn(g.path, v); c = [q[0], q[1], s]; }
    else c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  return c; };
const camApply = () => { const c = camAt(tl.time()); CAM.cx = c[0]; CAM.cy = c[1]; CAM.s = c[2];
  const s = Math.max(CAM.s, 1920 / 2880), cx = Math.min(Math.max(CAM.cx, 960 / s), 2880 - 960 / s), cy = Math.min(Math.max(CAM.cy, 540 / s), 1620 - 540 / s);
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); lens(cx, cy, s); };
const C0 = [...CP(1392, 826), CS(1.14)];                                  // = p2a's last camera
const PA = [...PP(1290, 790), SP(0.84)], PA2 = [...PP(1275, 795), SP(0.86)];
const EW = [1075, 1000, 1.05], EW2 = [1060, 1012, 1.08];
const PB = [...PP(1250, 760), SP(0.92)], PC = [...PP(1560, 782), SP(1.0)], PC2 = [...PP(1580, 788), SP(1.03)];
const geo = (t0, t1, a, b, ease = "power2.inOut") => seg(t0, t1, a, b, ease, [[a[0], a[1]], [b[0], b[1]]]);
camera([[0, ...C0]]);
seg(0, T_LAND + 0.15, C0, C0);
geo(T_LAND + 0.2, T_SUMMER - 0.1, C0, PA);
seg(T_SUMMER, T_MAIN - 0.2, PA, PA2);
geo(T_MAIN - 0.1, T_MAIN + 2.6, PA2, EW);
seg(T_MAIN + 2.7, T_14 - 0.1, EW, EW2);
geo(T_14, T_REACH + 0.4, EW2, PB);
seg(T_REACH + 0.5, T_12 - 0.2, PB, [...PP(1265, 765), SP(0.93)]);
seg(T_12 - 0.1, T_12 + 2.4, [...PP(1265, 765), SP(0.93)], PC, "power2.inOut");
seg(T_12 + 2.5, END, PC, PC2);
CAM_KEYS = [...Array(Math.ceil(END * 20) + 1)].map((_, i) => { const t = i / 20, c = camAt(t); return [t, c[0], c[1], c[2], "none"]; });
tl.eventCallback("onUpdate", ((prev) => function () { if (prev) prev.apply(this, arguments); camApply(); })(tl.eventCallback("onUpdate")));
tl.fromTo({ k: 0 }, { k: 0 }, { k: 1, duration: END, ease: "none", immediateRender: false, onUpdate: camApply }, 0);
const UNITF = (id, side, p, type, o = {}) => { UNIT(id, side, p, type, { ...o, t: 0 }); const el = B.units[id].el; gsap.set(el, { autoAlpha: 0 });
  if (o.t != null) tl.to(el, { autoAlpha: 1, duration: o.fade ?? 0.45 }, o.t); return id; };
const UNIT0 = (id, side, p, type, o = {}) => { UNITF(id, side, p, type, o); gsap.set(B.units[id].el, { autoAlpha: 1 }); return id; };
const STAKE = (w, dx, dy) => { w.style.left = `calc(50% + ${dx}px)`; w.style.top = dy + "px"; return w; };
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0 = p2a's last frame (chesapeake px via CP): the French across the bay mouth, ships at anchor, Cornwallis at Yorktown, method card leaving
// ---------------------------------------------------------------------------------------------------------------------------------
dateNow("13 SEP 1781", T_LAND + 0.25);
B.date("SEP 1781", T_LAND + 0.3, T_MV - 0.08, 32);
B.date("9 SEP 1781", T_MV, T_14 - 0.08, 32); SFX("tick", T_MV + 0.1);
B.date("14 SEP 1781", T_14, null, 32); SFX("tick", T_14 + 0.1);
const F0 = { x3: [1548, 948], x2: [1598, 912], x0: [1626, 868], x1: [1626, 820], b5: [1415, 815], b4: [1340, 870], b6: [1375, 925] };
Object.entries(F0).forEach(([id, p]) => UNIT0(id, "allies", CP(...p), "ship", { ech: "" }));
UNIT0("xa", "allies", CP(1415, 870), "artillery", { ech: "" });
UNIT0("cw0", "british", CP(1185, 760), "infantry", { ech: "XX" });
const BDG0 = BANNER("degrasse", "Comte de Grasse", "fr", "b5", 0, { side: "up", until: T_LAND + 0.35 });
const BCW0 = BANNER("cornwallis", "Lord Cornwallis", "gb", CP(1152, 622), 0, { side: "up", until: T_LAND + 0.35 });
hideU([...Object.keys(F0), "xa", "cw0"], T_LAND + 0.3);
GG.METHOD = ["FOOL NEW YORK", "CLOSE THE SEA", "CLOSE THE LAND"]; GG.METHOD_TITLE = "THE TRAP";
{ const MC = GG.method(2, 0, 0.9, [0, 0]); MC.querySelector(".inner").style.background = "rgba(18,16,12,0.97)"; MC.style.top = "210px";
  now(MC); MC.querySelectorAll(".row.lit").forEach((r) => now(r)); }
// ---------------------------------------------------------------------------------------------------------------------------------
// the peninsula (peninsula px via PP): Cornwallis at Yorktown, Lafayette's small army, the French landing from the James
// ---------------------------------------------------------------------------------------------------------------------------------
const TIN = T_SUMMER - 0.9;                                                // the zoom has arrived
UNITF("cw1", "british", PP(1800, 888), "infantry", { ech: "XX", t: TIN }); UNITF("cw2", "british", PP(1690, 940), "infantry", { ech: "X", t: TIN + 0.1 });
UNITF("cwA", "british", PP(1832, 940), "artillery", { ech: "", t: TIN + 0.2 });
const BCW1 = BANNER("cornwallis", "Lord Cornwallis", "gb", "cw1", TIN + 0.2, { side: "east", until: T_MAIN + 0.3 });
// "All summer, a young French general ... shadowed Cornwallis across Virginia with a small army": a blue box marches in from the west
const LFR = [[560, 610], [800, 615], [1000, 630], [1150, 655], [1275, 690]];
UNITF("lf", "allies", PP(...LFR[0]), "infantry", { ech: "X", t: TIN + 0.1 });
march("lf", PPL(LFR), TIN + 0.3, T_SMALL + 0.6 - TIN, { dustSize: 34, dustOp: 0.42 });
const BLF = BANNER("lafayette", "Marquis de Lafayette", "fr", "lf", T_LAFA + 0.05, { side: "up", until: T_MAIN + 0.3 });
focus(PP(1000, 630), 120, T_SHADOW - 0.1, T_SMALL + 0.8);
// "Now de Grasse landed more than three thousand French soldiers to join him at Williamsburg, across the only road off the peninsula"
[[[1440, 1160], [1330, 1060], [1215, 965]], [[1480, 1120], [1360, 1030], [1245, 955]], [[1400, 1200], [1290, 1090], [1185, 975]]]
  .forEach((pts, k) => BOAT(PPL(pts), T_NOW + k * 0.4, 3.0, { until: T_JOIN + 0.6 + k * 0.2, px: 32 }));
UNITF("fr1", "allies", PP(1200, 912), "infantry", { ech: "X", t: T_3000 });
UNITF("fr2", "allies", PP(1250, 905), "infantry", { ech: "X", t: T_3000 + 0.3 });
march("fr1", PPL([[1200, 912], [1215, 860], [1235, 800]]), T_JOIN - 0.4, 2.6, { dustSize: 30, dustOp: 0.42 });
march("fr2", PPL([[1250, 905], [1290, 840], [1335, 770]]), T_JOIN - 0.2, 2.8, { dustSize: 30, dustOp: 0.42 });
focus(PP(1290, 760), 110, T_ROAD - 0.1, T_MAIN - 0.3);
// ---------------------------------------------------------------------------------------------------------------------------------
// `east` wide: the armies come down the bay in boats, Washington rides south, stops at Mount Vernon (9-12 Sep), on to Williamsburg (14 Sep)
// ---------------------------------------------------------------------------------------------------------------------------------
hideU(["cw1", "cw2", "cwA", "lf", "fr1", "fr2"], T_MAIN + 0.1);
UNITF("ewR", "british", [1100, 1290], "infantry", { ech: "XX", t: T_MAIN + 1.6 });
UNITF("ewB", "allies", [1018, 1262], "infantry", { ech: "XX", t: T_MAIN + 1.7 });
UNITF("ewF", "allies", [1185, 1306], "ship", { ech: "", t: T_MAIN + 1.8 });
const BAY = [[1160, 772], [1128, 805], [1104, 850], [1100, 900], [1100, 950], [1098, 1000], [1125, 1050], [1135, 1110], [1130, 1170], [1125, 1215], [1135, 1245]];
[0, 1, 2, 3].forEach((k) => BOAT(sub(BAY, 0, 1, 20), T_MOST - 0.3 + k * 0.9, 8.0, { until: T_14 - 0.2, px: 30 }));
BOAT([[1080, 893], [1098, 905], ...sub(BAY, 0.33, 1, 14)], T_BOATS - 1.4, 6.0, { until: T_14 - 0.2, px: 30 });
// "Most of the troops sailed down the bay in boats": the troop transports as blue boxes sailing down the bay (with their trails)
[0, 1, 2, 3, 4].forEach((k) => { const id = "tb" + k, f0 = 0.11 * k, pts = sub(BAY, f0, 0.48 + 0.11 * k, 16);   /* spaced ~60 px apart */ UNIT(id, "allies", pts[0], "ship", { ech: "", t: T_MOST - 0.2 + k * 0.25 });
  march(id, pts, T_MOST + k * 0.25, T_14 - T_MOST - 0.6, { dust: false, trail: false }); });
hideU(["tb0", "tb1", "tb2", "tb3", "tb4"], T_14 - 0.1);
// "Washington rode": his banner rides south from the head of the bay (the rider box carries it)
const R1 = [[1185, 748], [1125, 782], [1060, 812], [1012, 872], [982, 922], [972, 944]];
const R2 = [[972, 944], [955, 1010], [958, 1100], [985, 1185], [1015, 1245], PP(1080, 645)];
UNITF("wr", "allies", R1[0], "cavalry", { ech: "", t: T_RODE - 0.2 });
along("wr", R1, T_RODE, T_MV + 0.6 - T_RODE, 16);
// the ride on to Williamsburg follows the camera's geometric zoom (same progress v), so the rider + banner stay in frame (no empty frame mid-zoom)
{ const u = B.units.wr, s0 = EW2[2], s1 = PB[2], P = { k: 0 };
  tl.fromTo(P, { k: 0 }, { k: 1, duration: T_REACH + 0.4 - T_14, ease: "none", immediateRender: false, onUpdate: () => { const sc = camAt(tl.time())[2];
    const v = Math.min(1, Math.max(0, (1 / s0 - 1 / sc) / (1 / s0 - 1 / s1))), q = posOn(R2, v); gsap.set(u.el, { x: q[0] - u.x, y: q[1] - u.y }); } }, T_14); }
const BWR = BANNER("washington", "George Washington", "us", "wr", T_RODE + 0.05, { side: "west" });   // stays on screen through the ride to Williamsburg (no empty frame)
// "he stopped at Mount Vernon, his home": place name + a soft warm glow (~3 s)
PLACE_LABEL("Mount Vernon", [969, 948], T_MV + 0.2, { dx: -10, dy: 34, size: 24 });
{ const g = pinS(GG.pin(`<div style="width:150px;height:150px;margin:-75px 0 0 -75px;border-radius:50%;background:radial-gradient(circle,rgba(255,214,140,.55) 0%,rgba(255,190,110,.28) 40%,rgba(255,170,90,0) 72%);mix-blend-mode:screen"></div>`, 969, 948, {}));
  gsap.set(g, { autoAlpha: 0 }); tl.to(g, { autoAlpha: 1, duration: 0.7 }, T_MV + 0.3); tl.to(g, { autoAlpha: 0, duration: 0.8 }, T_MV + 3.3); }
// ---------------------------------------------------------------------------------------------------------------------------------
// back on the peninsula: Williamsburg on the 14th; cliffhanger toward Yorktown, the red works round the town
// ---------------------------------------------------------------------------------------------------------------------------------
hideU(["ewR", "ewB", "ewF"], T_14 + 0.8);
showU(["cw1", "cw2", "cwA", "lf", "fr1", "fr2"], T_REACH - 0.6);
const BLF2 = BANNER("lafayette", "Marquis de Lafayette", "fr", "lf", T_REACH - 0.3, { side: "up" });
// the cut to p3a: Washington and Lafayette fade out over ~0.4 s instead of popping off
tl.to([BWR, BLF2], { autoAlpha: 0, duration: 0.4 }, END - 0.45);
BANNER("cornwallis", "Lord Cornwallis", "gb", "cw1", T_12 + 0.6, { side: "east" });
focus(PP(1761, 880), 110, T_12 + 0.8, T_NAVY + 0.6);
TRENCH(PPL([[1722, 905], [1758, 942], [1810, 950], [1852, 918], [1866, 878]]), T_STILL - 0.1, { dur: 2.0, side: "british" });
TRENCH(PPL([[1745, 790], [1772, 775], [1800, 784]]), T_STILL + 0.6, { dur: 1.2, side: "british" });
// ---------------------------------------------------------------------------------------------------------------------------------
camApply();
dropCues(0, 0.2);
if (GD.var.audit) LABEL_AUDIT([1, 4, 8, 12, 16, 20, 24, 28, 32, 36, 39, 42], { show: true });
