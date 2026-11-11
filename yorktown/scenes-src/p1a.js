// P1A (p1-1, p1-2), Yorktown 1781, PART 1 THE MARCH, opening. Main style (STYLE_LOCK 2d/2e/2f via the Yorktown map kit), 1c clean screen,
// 1d (enemy plan first + "in other words"). Build: python3 kit/build_scene.py p1a east p1-1 p1-2 --inset chesapeake --inset peninsula
// p1-1 (`east` wide): frame 0 = clean map, units moving (the allied camp above New York with Washington's banner, named in hook-4; the
//   British garrison + ships in New York; Cornwallis's red army marching east down the Virginia peninsula with a small blue force behind it,
//   unnamed). Title card PART 1 · THE MARCH alone; "Sir Henry Clinton": Clinton banner at New York; "coming for him": focus on the camp;
//   "in July": date JUL 1781; "Cornwallis": Cornwallis banner in Virginia; "deep water ... big warships": red ships sail into the bay;
//   the quoted warning: quote card "A TEMPORARY SUPERIORITY AT SEA" (verbatim, ~3.5 s); "He chose Yorktown": ONE continuous zoom (east ->
//   chesapeake -> peninsula insets) arriving on "Yorktown"; "York River": carved river name; "Gloucester Point": place name + red box across
//   the narrows; "first of August": date 1 AUG 1781; "dig in": the British works are dug round the town and at Gloucester Point.
// p1-2 (`peninsula`): red ships sail in and out of the river mouth freely; "supply line": ink trace from the bay up the river to the town;
//   "escape route": ink trace from the town down the river out to sea; "Every British plan": the camera pulls back to `east` wide (red ships
//   on the open sea); "the sea was theirs": stamp THE SEA on the empty Atlantic. The last camera = p1b's first camera.
const P1 = "p1-1", P2 = "p1-2";
const T_PLAN = at(P1, "The British plan"), T_NY = at(P1, "In New York"), T_CLIN = at(P1, "Sir Henry Clinton"), T_COMING = at(P1, "coming for him"),
  T_JULY = at(P1, "in July"), T_CORN = at(P1, "he told Cornwallis", 0.45), T_CHASE = at(P1, "stop chasing"), T_DEEP = at(P1, "deep water"),
  T_SHIPS = at(P1, "big warships"), T_DISL = at(P1, "Cornwallis did not like it"), T_POST = at(P1, "A post like that"), T_TEMP = at(P1, "a temporary superiority"), T_FOE = at(P1, "a foreign enemy"),
  T_OBEY = at(P1, "But he obeyed"), T_CHOSE = at(P1, "He chose Yorktown"), T_YT = at(P1, "Yorktown, on the York"), T_YR = at(P1, "the York River"),
  T_GP = at(P1, "Gloucester Point"), T_NARR = at(P1, "across the narrows"), T_AUG1 = at(P1, "first of August"), T_DIG = at(P1, "dig in");
const T_OW = at(P2, "In other words"), T_CHOSEN = at(P2, "He had chosen the spot"), T_RULED = at(P2, "ruled the sea"), T_SUPPLY = at(P2, "supply line"),
  T_ESCAPE = at(P2, "escape route"), T_EVERY = at(P2, "Every British plan"), T_IDEA = at(P2, "that one idea"), T_SEA = at(P2, "the sea was theirs");
// ---------------------------------------------------------------------------------------------------------------------------------
// maps + camera (one camera over `east`; the chesapeake + peninsula insets sit in their true place inside it)
// ---------------------------------------------------------------------------------------------------------------------------------
const UNITF = (id, side, p, type, o = {}) => { UNIT(id, side, p, type, { ...o, t: 0 }); const el = B.units[id].el; gsap.set(el, { autoAlpha: 0 });
  tl.to(el, { autoAlpha: 1, duration: o.fade ?? 0.35 }, o.t); return id; };
LIVING({ clouds: 0.1 });
const CH = INSET("chesapeake"), PEN = INSET("peninsula");
const PP = (x, y) => [PEN.box[0] + x * PEN.k, PEN.box[1] + y * PEN.k], SP = (s) => s / PEN.k;
const PPL = (pts) => pts.map(([x, y]) => PP(x, y));
{ const L2 = LivingW({ tl, world: WORLD, before: OVL, box: PEN.box }); const c2 = L2.clouds({ n: 6, opacity: 0.1, seed: 5, size: [380 * PEN.k, 760 * PEN.k], wind: [9 * PEN.k, -2.5 * PEN.k] });
  c2.className = "lv2-clouds"; onCam((s) => { c2.style.opacity = Math.max(0, Math.min(1, (s - SP(0.7)) / SP(0.3))).toFixed(3); }); }
const SEGS = [], seg = (t0, t1, a, b, ease = "sine.inOut", path = null) => { SEGS.push({ t0, t1, a, b, e: gsap.parseEase(ease), path }); SEGS.sort((p, q) => p.t0 - q.t0); };
const camAt = (t) => { let c = SEGS[0].a;
  for (const g of SEGS) { if (t < g.t0) break; const u = g.e(Math.min(1, (t - g.t0) / Math.max(g.t1 - g.t0, 1e-3))), a = g.a, b = g.b;
    if (g.path) { const s = a[2] * (b[2] / a[2]) ** u, v = (1 / a[2] - 1 / s) / (1 / a[2] - 1 / b[2]), q = posOn(g.path, v); c = [q[0], q[1], s]; }
    else c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  return c; };
const camApply = () => { const c = camAt(tl.time()); CAM.cx = c[0]; CAM.cy = c[1]; CAM.s = c[2];
  const s = Math.max(CAM.s, 1920 / 2880), cx = Math.min(Math.max(CAM.cx, 960 / s), 2880 - 960 / s), cy = Math.min(Math.max(CAM.cy, 540 / s), 1620 - 540 / s);
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); lens(cx, cy, s); };
const C0 = [1400, 735, 0.76], C1 = [1370, 752, 0.79];
camera([[0, ...C0]]);
seg(0, T_OBEY, C0, C1);
// THE DIVE (one continuous zoom): down the coast, through the capes, up the York River, arriving on "Yorktown"
const PEN_C = [1800, 860], S_PEN = 1.4, CEND = PP(...PEN_C), SEND = SP(S_PEN);
const ZPATH = [[C1[0], C1[1]], [1215, 1180], ...LLYT([[36.98, -76.02], [37.13, -76.30]]), CEND];
const TZ0 = T_OBEY + 0.1, TZ1 = T_YT + 0.4;
seg(TZ0, TZ1, C1, [...CEND, SEND], "power2.inOut", ZPATH);
// p1-1 end + p1-2: drift east to show the narrows and the river mouth (s 1.15 on the peninsula map)
const PEN_C2 = [1830, 845], S_PEN2 = 1.5, PEN_C3 = [2060, 820], S_PEN3 = 1.12;
seg(TZ1 + 0.02, T_OW - 0.2, [...CEND, SEND], [...PP(...PEN_C2), SP(S_PEN2)]);
seg(T_OW - 0.15, T_SUPPLY - 0.3, [...PP(...PEN_C2), SP(S_PEN2)], [...PP(...PEN_C3), SP(S_PEN3)]);
// the pull back to `east` wide on "Every British plan" (out of the river, through the capes, up to the open sea)
const CW = [1400, 735, 0.76];   // = p1b frame 0
const TP0 = T_EVERY - 0.1, TP1 = T_IDEA + 0.35;
seg(TP0, TP1, [...PP(...PEN_C3), SP(S_PEN3)], CW, "power2.inOut", [PP(...PEN_C3), ...LLYT([[37.13, -76.30], [36.98, -76.02]]), [1215, 1180], [CW[0], CW[1]]]);
CAM_KEYS = [...Array(Math.ceil(END * 4) + 1)].map((_, i) => { const t = i / 4, c = camAt(t); return [t, c[0], c[1], c[2], "none"]; });
tl.eventCallback("onUpdate", ((prev) => function () { if (prev) prev.apply(this, arguments); camApply(); })(tl.eventCallback("onUpdate")));
tl.fromTo({ k: 0 }, { k: 0 }, { k: 1, duration: END, ease: "none", immediateRender: false, onUpdate: camApply }, 0);
// ---------------------------------------------------------------------------------------------------------------------------------
// title card PART 1 · THE MARCH (alone, on the opening words), the date scroll (1781 from the hook) -> JUL 1781 -> 1 AUG 1781
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const TITLE = scr0(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgb(14,12,10);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">PART 1</div><div style="font-size:104px;letter-spacing:0.08em;line-height:1.05;color:#f7f3ea">THE MARCH</div></div>`,
  "left:0;right:0;top:350px;display:flex;justify-content:center;transform-origin:50% 40%;");
slam(TITLE, 0.35, { from: 1.6, shake: 4, until: Math.min(3.0, T_CLIN - 0.3) });
dateNow("1781", T_JULY - 0.05);
B.date("JUL 1781", T_JULY, T_AUG1 - 0.08, 32); SFX("tick", T_JULY + 0.1);
B.date("1 AUG 1781", T_AUG1, null, 32); SFX("tick", T_AUG1 + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
// p1-1 on `east`: the two armies at frame 0, moving
// ---------------------------------------------------------------------------------------------------------------------------------
// the allied camp above New York (Philipsburg, east of the Hudson): Americans, French, guns; columns shuffling (dust)
UNIT("am1", "allies", [1572, 352], "infantry", { ech: "XX" }); UNIT("amA", "allies", [1640, 360], "artillery", { ech: "" });
UNIT("fr1", "allies", [1730, 352], "infantry", { ech: "XX" });
march("am1", [[1572, 352], [1566, 362], [1560, 372]], 0, 7.0, { dustSize: 44, dustOp: 0.42 });
march("fr1", [[1730, 352], [1725, 356], [1720, 360]], 0.3, 7.0, { dustSize: 44, dustOp: 0.42 });
// Washington (named in hook-4) rides with the American army on a side stake (NE, over empty Connecticut ground)
// banners on free stakes (the same stake points as p1b frame 0): BFREE = banner on its own pin (moved with pinAlong when the army moves)
const BFREE = (key, name, nation, p, t, o = {}) => { const w = BANNER(key, name, nation, p, t, { side: "up", ...o }); return { w, pin: w.closest(".gg-pin") }; };
const BW = BFREE("washington", "George Washington", "us", [1500, 335], 0);
// the British: New York garrison (Staten Island shore, Manhattan, Long Island), ships in the harbour
UNIT("ny1", "british", [1488, 528], "infantry", { ech: "XX" }); UNIT("ny2", "british", [1505, 458], "infantry", { ech: "XX" });
UNIT("ny3", "british", [1850, 410], "infantry", { ech: "X" });
UNIT("rs1", "british", [1572, 598], "ship", { ech: "" }); UNIT("rs2", "british", [1640, 610], "ship", { ech: "" });
B.move("rs1", 0, 9, 1556, 588);
SIDEFLAG("gb", "ny1", 0);
// "Sir Henry Clinton": his banner at New York (west stake, over the empty New Jersey ground)
const BC = BANNER("clinton", "Sir Henry Clinton", "gb", "ny3", T_CLIN + 0.35, { side: "se" });
focus([1610, 355], 95, T_COMING - 0.1, T_JULY + 1.2);
// Virginia: Cornwallis's army marching east down the peninsula, a small blue force shadowing it (Lafayette, not named in Part 1)
UNIT("cwE", "british", [968, 1250], "infantry", { ech: "XX" }); UNIT("cwE2", "british", [925, 1238], "infantry", { ech: "X" });
UNIT("lf1", "allies", [790, 1150], "infantry", { ech: "X" });
march("cwE", [[968, 1250], [1000, 1258], [1035, 1262], [1062, 1262]], 0.2, T_CHOSE - 0.6, { dustSize: 40, dustOp: 0.42 });
march("cwE2", [[925, 1238], [960, 1250], [975, 1254], [990, 1256]], 0.4, T_CHOSE - 0.8, { dustSize: 40, dustOp: 0.42 });
march("lf1", [[790, 1150], [808, 1160], [824, 1168]], 1.0, T_CHOSE - 2.0, { dustSize: 36, dustOp: 0.38 });
const BK1 = BANNER("cornwallis", "Lord Cornwallis", "gb", "cwE", T_CORN, { side: "up", until: TZ0 + 0.5 });
focus([1010, 1255], 90, T_CHASE, T_DEEP - 0.1);
// "a base on deep water, where the navy's big warships could shelter": red ships sail from the sea into the bay
UNIT("rs3", "british", [1330, 1420], "ship", { ech: "", t: T_SHIPS - 0.1 });
march("rs3", [[1330, 1420], [1250, 1345], [1160, 1325]], T_SHIPS + 0.2, 4.5, { dust: false });
focus([1130, 1300], 90, T_DEEP, T_DISL);
// the quoted warning (verbatim): quote card while Cornwallis's words are spoken
const Q = quote("&ldquo;&hellip;a temporary superiority at sea&rdquo;", "CORNWALLIS", T_TEMP - 0.15, Math.min(T_TEMP + 3.35, T_OBEY - 0.15), { col: "#c4121f", size: 46, top: 620, mw: 1000 });
Object.assign(Q.style, { left: "860px", right: "auto", justifyContent: "flex-start" });
// "a prey to a foreign enemy": a ghosted blue ship box comes up from the south toward the capes (the threat, not yet real), gone on "obeyed"
UNIT("ghost", "allies", [1420, 1560], "ship", { ech: "", t: T_FOE });
march("ghost", [[1420, 1560], [1330, 1450], [1255, 1385]], T_FOE + 0.3, 3.4, { dust: false });
gsap.set(B.units.ghost.el.querySelector(".blk"), { opacity: 0.6 }); hideU(["ghost"], T_OBEY);
// the units of p1-1 that leave the frame in the dive fade out (they would sit as huge-spaced boxes at the frame edge)
hideU(["am1", "amA", "fr1", "ny1", "ny2", "ny3", "rs1", "rs2", "lf1"], TZ0 + 0.3); tl.to(BW.pin, { autoAlpha: 0, duration: 0.4 }, TZ0 + 0.3);
hideU(["cwE", "cwE2", "rs3"], TZ1 - 1.0);
// ---------------------------------------------------------------------------------------------------------------------------------
// Yorktown (peninsula map px via PP)
// ---------------------------------------------------------------------------------------------------------------------------------
UNITF("cw1", "british", PP(1800, 935), "infantry", { ech: "XX", t: TZ1 - 0.9 });
UNITF("cw2", "british", PP(1700, 958), "infantry", { ech: "X", t: TZ1 - 0.8 });
UNITF("cwA", "british", PP(1748, 902), "artillery", { ech: "", t: TZ1 - 0.6 });
UNITF("cw3", "british", PP(1880, 960), "infantry", { ech: "X", t: TZ1 - 0.7 });
const BK2 = BANNER("cornwallis", "Lord Cornwallis", "gb", "cw2", TZ1 - 0.3, { side: "sw", until: TP0 + 0.4 });
RLB.push([riverLabel("yorkP", "York River", PPL([[1200, 200], [1400, 420], [1550, 600], [1700, 760], [1770, 830]]), T_YR, { s: SP(S_PEN), size: 30, near: PP(1640, 712), side: "right", hw: 40, tl }), "York River"]);
// "Gloucester Point across the narrows": the place name + a red box crosses the ferry to the Gloucester side
PLACE_LABEL("Gloucester Point", PP(1935, 748), T_GP, { dy: -10, size: 26 });
UNITF("cwG", "british", PP(1790, 862), "infantry", { ech: "X", t: T_GP - 0.1 });
B.move("cwG", T_NARR - 0.1, 1.6, ...PP(1812, 776));
// red ships in the river at the town
UNITF("rv1", "british", PP(1712, 792), "ship", { ech: "", t: TZ1 - 0.5 });
B.move("rv1", TZ1, 12, ...PP(1700, 782));
// "dig in": the British works dug round the town (south side) and at Gloucester Point
const WK1 = PPL([[1648, 902], [1676, 928], [1730, 952], [1790, 966], [1846, 950], [1876, 922]]);
const WK2 = PPL([[1792, 752], [1812, 740], [1834, 746], [1842, 764]]);
TRENCH(WK1, T_DIG - 0.1, { dur: 2.2, side: "british", until: TP0 + 0.3 });
TRENCH(WK2, T_DIG + 0.5, { dur: 1.4, side: "british", until: TP0 + 0.3 });
B.move("cw1", T_DIG, 2.0, ...PP(1800, 924)); B.move("cw3", T_DIG + 0.2, 2.0, ...PP(1866, 940)); B.move("cw2", T_DIG + 0.1, 2.0, ...PP(1712, 934));
// ---------------------------------------------------------------------------------------------------------------------------------
// p1-2: "In other words": the ships come and go freely; supply line + escape route as ink traces along the water
// ---------------------------------------------------------------------------------------------------------------------------------
UNITF("rs4", "british", PP(2560, 760), "ship", { ech: "", t: T_OW - 0.6 });
B.move("rs4", T_OW - 0.4, 9.0, ...PP(1930, 852));
UNITF("rs5", "british", PP(1900, 870), "ship", { ech: "", t: T_OW - 0.2 });
B.move("rs5", T_OW, 10.0, ...PP(2560, 960));
UNITF("rs6", "british", PP(2700, 1060), "ship", { ech: "", t: T_RULED - 0.3 });
B.move("rs6", T_RULED, 9.0, ...PP(2290, 905));
focus(PP(1790, 900), 70, T_CHOSEN, T_RULED - 0.2);
// supply line: from the bay up the river to the town; escape route: from the town down the river and out to sea
inkTrace(PPL([[2760, 860], [2450, 840], [2180, 846], [1990, 852], [1880, 848], [1800, 832]]), T_SUPPLY - 0.1, T_ESCAPE + 0.6, 4.2);
inkTrace(PPL([[1790, 838], [1900, 860], [2080, 890], [2300, 940], [2560, 1020], [2840, 1130]]), T_ESCAPE - 0.1, T_EVERY + 1.0, 4.2);
// the pull back: the peninsula boxes leave, one red box stands for the army at Yorktown on the wide map
hideU(["cw1", "cw2", "cw3", "cwA", "cwG", "rv1", "rs4", "rs5", "rs6"], TP0 + 0.2);
UNITF("cwW", "british", [1092, 1258], "infantry", { ech: "XX", t: TP1 - 1.0, fade: 0.5 });
const BK3 = BANNER("cornwallis", "Lord Cornwallis", "gb", "cwW", TP1 - 0.6, { side: "west" });
// the wide map after the pull back: the garrison at New York and the allied camp are back, red ships sail the open sea freely
showU(["am1", "amA", "fr1", "ny1", "ny2", "ny3", "rs1", "rs2"], TP1 - 1.2); tl.to(BW.pin, { autoAlpha: 1, duration: 0.4 }, TP1 - 1.2);
UNITF("rs7", "british", [1640, 700], "ship", { ech: "", t: TP1 - 1.0, fade: 0.5 }); B.move("rs7", TP1 - 1.0, END - TP1 + 1.0, 1560, 880);
UNITF("rs8", "british", [1400, 1260], "ship", { ech: "", t: TP1 - 1.0, fade: 0.5 }); B.move("rs8", TP1 - 1.0, END - TP1 + 1.0, 1470, 1150);
wstampL("THE SEA", 1900, 1000, T_SEA - 0.05, END - 0.35, null, 34);
// ---------------------------------------------------------------------------------------------------------------------------------
camApply();
if (GD.var.audit) LABEL_AUDIT([2, 6, 10, 14, 18, 22, 26, 30, 33, 36, 39, 44, 48, 52, 56], { show: true });
