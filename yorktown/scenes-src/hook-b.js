// HOOK-B (hook-3, hook-4), Yorktown 1781. THE LOCKED HOOK (STYLE_LOCK 1a: back INTO the danger, the general enters as the TURN with one human
// detail, name slam + 3 snap cuts + title; 1c clean screen; 2d/2e/2f main style via the Yorktown map kit).
// Build: python3 kit/build_scene.py hook-b east hook-3 hook-4 --inset peninsula --inset chesapeake --inset yorktown
// hook-3: frame 0 = hook-a's last camera (Yorktown inside the peninsula inset, the British dug in, no trap yet); a hard pull back (zoom whoosh)
//   to `east` wide; "August": date scroll AUG 1781; "The American army ... camped outside New York": the allied camp (focus); "New York": the red
//   fleet box moves in the harbour; "watching the wrong city": focus on New York; "four hundred miles": a thin route line draws south to the
//   Chesapeake and fades; "Virginia": place name; "the strongest British army": more red boxes round New York; "without being stopped": a thin
//   red arrow into New Jersey; "at sea ... a French fleet ... from the Caribbean": a blue ship box + an arrow from the bottom edge of the map up to
//   the capes; "before the Royal Navy did": the red fleet box sails south (thin red arrow); "The man who bet everything": the "?" banner on a pole
//   by the American camp (camera in); "six years": stamp.
// hook-4: "George Washington": BN.reveal on the banner (scale pop) + the name slam card (hit + shake); three snap cuts (black frame, whoosh + hit):
//   1 "To build the trap ... fool the British" (`east`): the columns cross the Hudson, curl toward Staten Island, then wheel south;
//   2 "a battle at sea" (`chesapeake` layer, 5 Sep, clear): two lines of ship boxes off Cape Henry, visible broadsides (boom on impact);
//   3 "a night attack" (`yorktown` layer, 14 Oct, clear night): the assault columns storm Redoubts 9 + 10, taken (blue hatching);
//   title card YORKTOWN 1781 on "Yorktown was won" (hit + shake).
// No Clinton banner (not named in the hook); Washington only as "?" until the slam. Flags: US 13-star + British 1606; the French flag in cut 2.
const H3 = "hook-3", H4 = "hook-4";
const T_AUG = at(H3, "August"), T_ARMY = at(H3, "The American army"), T_NY = at(H3, "New York"), T_WRONG = at(H3, "watching the wrong city"),
  T_MILES = at(H3, "four hundred miles"), T_VA = at(H3, "To reach Virginia", 0.55), T_STRONG = at(H3, "the strongest British army"),
  T_STOP = at(H3, "without being stopped"), T_SEA = at(H3, "And at sea"), T_FLEET = at(H3, "a French fleet"), T_FIRST = at(H3, "get there first"),
  T_CARIB = at(H3, "from the Caribbean"), T_RN = at(H3, "before the Royal Navy"), T_MAN = at(H3, "The man who bet everything"),
  T_SIX = at(H3, "six years");
const T_NAME = at(H4, "His name was"), T_GW = at(H4, "George Washington"), T_BUILD = at(H4, "To build the trap"), T_FOOL = at(H4, "fool the British"),
  T_BSEA = at(H4, "He would need a battle at sea"), T_NIGHT = at(H4, "And he would end it"), T_NATT = at(H4, "a night attack"),
  T_MUSK = at(H4, "unloaded muskets"), T_HOW = at(H4, "This is how"), T_WON = at(H4, "Yorktown was won");
// ---------------------------------------------------------------------------------------------------------------------------------
// maps + camera
// ---------------------------------------------------------------------------------------------------------------------------------
// units that appear at high zoom fade in (the kit drop-in falls from far above at 20x) or appear on a snap cut
const UNITF = (id, side, p, type, o = {}) => { UNIT(id, side, p, type, { ...o, t: 0 }); const el = B.units[id].el; gsap.set(el, { autoAlpha: 0 });
  tl.to(el, { autoAlpha: 1, duration: o.fade ?? 0.35 }, o.t); return id; };
LIVING({ clouds: 0.1 });
const CHI = INSET("chesapeake"), PEN = INSET("peninsula");
const PP = (x, y) => [PEN.box[0] + x * PEN.k, PEN.box[1] + y * PEN.k], SP = (s) => s / PEN.k;
// camera path segments. seg(t0, t1, a, b, ease, path): a/b = [cx, cy, s]; with a path, the scale changes geometrically and the centre runs along the
// path with v = (1/sa - 1/s)/(1/sa - 1/sb) (every point heads straight for its place on screen: one continuous zoom, no swing at high zoom).
const SEGS = [], seg = (t0, t1, a, b, ease = "sine.inOut", path = null) => { SEGS.push({ t0, t1, a, b, e: gsap.parseEase(ease), path }); SEGS.sort((p, q) => p.t0 - q.t0); };
const camAt = (t) => { let c = SEGS[0].a;
  for (const g of SEGS) { if (t < g.t0) break; const u = g.e(Math.min(1, (t - g.t0) / Math.max(g.t1 - g.t0, 1e-3))), a = g.a, b = g.b;
    if (g.path) { const s = a[2] * (b[2] / a[2]) ** u, v = (1 / a[2] - 1 / s) / (1 / a[2] - 1 / b[2]), q = posOn(g.path, v); c = [q[0], q[1], s]; }
    else c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  return c; };
// the kit camera (r3) is one timeline-driven path; it gets this scene's path sampled every 0.05 s (+ both sides of every segment start,
// so the snap cuts jump exactly on their frame)
const camKeys = () => { const ts = new Set(); for (let t = 0; t <= END + 1e-6; t += 0.05) ts.add(+t.toFixed(3));
  SEGS.forEach((g) => { ts.add(g.t0); if (g.t0 > 0.003) ts.add(+(g.t0 - 0.002).toFixed(4)); ts.add(Math.min(END, g.t1)); });
  return [...ts].filter((t) => t >= 0 && t <= END).sort((a, b) => a - b).map((t) => [t, ...camAt(t), "none"]); };
const CA = [...PP(1822, 878), SP(1.58)];            // = hook-a's last camera
const CW = [1350, 800, 0.85], CW2 = [1350, 850, 0.82], CCAMP = [1585, 455, 1.45], CSLAM = [1572, 445, 1.62];
// the hard pull back (zoom whoosh): geometric scale, the centre runs back down the York, out of the capes, up to the wide frame
seg(0.05, 1.5, CA, CW, "power2.inOut", [[CA[0], CA[1]], ...LLYT([[37.13, -76.30], [36.98, -76.02]]), [1230, 1060], [CW[0], CW[1]]]);
SFX("whoosh", 0.05);
seg(T_SEA, T_SEA + 1.6, CW, CW2);
seg(T_MAN, T_MAN + 2.2, CW2, CCAMP, "power2.inOut");
seg(T_MAN + 2.25, T_GW - 0.05, CCAMP, CSLAM);
const T1 = T_BUILD - 0.04, T2 = T_BSEA - 0.04, T3 = T_NIGHT - 0.04, T4 = T_HOW - 0.05;
const C1 = [1478, 470, 1.12], C2 = [1745, 935, 1.3], C3 = [1462, 828, 2.3];
const cseg = (t, c, until, d) => seg(t, until, c, [c[0] + d[0], c[1] + d[1], c[2] * d[2]], "sine.out");
cseg(T1, C1, T2, [-10, 12, 1.05]); cseg(T2, C2, T3, [12, 4, 1.05]); cseg(T3, C3, END + 1, [8, 3, 1.05]);
camera(camKeys());

// clouds + water shimmer of `east` hidden while the frame is inside the peninsula inset or on a snap-cut layer (their masks are east's)
let CUTL = [[1e9, 1e9]]; const inCut = () => CUTL.some(([a, b]) => tl.time() >= a && tl.time() < b);
onCam((s) => { const k = s > SP(0.95) || inCut(); document.querySelectorAll(".lv-water,.lv-clouds,.lv-dust").forEach((l) => { l.style.visibility = k ? "hidden" : "visible"; }); });
// ---------------------------------------------------------------------------------------------------------------------------------
// date scroll (already up from hook-a: 1781) -> AUG 1781 on "August"
// ---------------------------------------------------------------------------------------------------------------------------------
dateNow("1781", T_AUG - 0.05);
B.date("AUG 1781", T_AUG, T_BSEA - 0.08, 32); SFX("tick", T_AUG + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
// hook-3 on `east`
// ---------------------------------------------------------------------------------------------------------------------------------
// Yorktown at frame 0: Cornwallis's army dug in round the town (as in hook-a, before the trap), they ride the pull back into one box
// hook-a's last frame (the ring closed, the works, the hatching, the French ships at the mouth) fades out over ~0.4 s during the pull back,
// while the British boxes of the rewind ("that August, there was no trap") fade in
{ const OUT = [];
  [[1490, 732], [1418, 880], [1450, 1000], [1610, 1080], [1780, 1098], [1890, 1090], [1985, 1020]].forEach((p, i) => { UNIT("al" + i, "allies", PP(...p), ["infantry", "infantry", "infantry", "artillery", "infantry", "engineers", "infantry"][i], { ech: ["XX", "XX", "XX", "", "XX", "", "XX"][i] }); OUT.push(B.units["al" + i].el); });
  [[1990, 815], [2030, 850], [2070, 872]].forEach((p, i) => { UNIT("fs" + i, "allies", PP(...p), "ship", { ech: "" }); OUT.push(B.units["fs" + i].el); });
  OUT.push(TRENCH([[1645, 893], [1665, 950], [1720, 985], [1790, 990], [1860, 1005], [1900, 975], [1905, 945]].map((q) => PP(...q)), 0, { side: "british" }));
  OUT.push(FRONT([[1585, 725], [1475, 790], [1458, 880], [1500, 965], [1640, 1040], [1780, 1058], [1880, 1050], [1935, 922]].map((q) => PP(...q)), 0, { enemy: PP(1761, 900) }));
  const d = HATCH_LAYER([[1645, 893], [1665, 950], [1720, 985], [1790, 990], [1860, 1005], [1900, 975], [1905, 945], [1850, 930], [1800, 892], [1765, 862], [1740, 880]].map((q) => PP(...q)), "#2c57b7", 3, 10, 0.95);
  d.style.webkitMaskImage = d.style.maskImage = "none"; gsap.set(d, { autoAlpha: 1 }); OUT.push(d);
  tl.to(OUT, { autoAlpha: 0, duration: 0.4 }, 0.05); }
UNIT("cw1", "british", PP(1800, 930), "infantry", { ech: "XX" }); UNIT("cw2", "british", PP(1690, 922), "infantry", { ech: "X" });
UNIT("cw3", "british", PP(1852, 958), "infantry", { ech: "X" }); UNIT("rv1", "british", PP(1742, 800), "ship", { ech: "" });
gsap.set(["cw1", "cw2", "cw3"].map((id) => B.units[id].el), { autoAlpha: 0 }); tl.to(["cw1", "cw2", "cw3"].map((id) => B.units[id].el), { autoAlpha: 1, duration: 0.4 }, 0.05);
hideU(["cw2", "cw3", "rv1"], 0.5); B.move("cw1", 0.3, 1.1, 1100, 1262);
// the allied army in camp above New York (east of the Hudson), shuffling (dust)
UNIT("am1", "allies", [1576, 352], "infantry", { ech: "XX" }); UNIT("am2", "allies", [1668, 336], "infantry", { ech: "XX" });
UNIT("amA", "allies", [1622, 300], "artillery", { ech: "" });
march("am1", [[1576, 352], [1582, 362], [1588, 370]], 1.0, 9.0, { dustSize: 48, dustOp: 0.45 });
march("am2", [[1668, 336], [1660, 346], [1652, 356]], 1.2, 9.0, { dustSize: 48, dustOp: 0.45 });
// the British in New York: Staten Island + Manhattan, the fleet in the harbour
UNIT("ny1", "british", [1478, 526], "infantry", { ech: "XX" }); UNIT("ny2", "british", [1505, 440], "infantry", { ech: "XX" });
UNIT("rs1", "british", [1562, 600], "ship", { ech: "" }); UNIT("rs2", "british", [1618, 608], "ship", { ech: "" });
B.move("rs1", T_NY, 4.5, 1548, 592);
const FUS = SIDEFLAG("us", "am2", 0.9), FGB = SIDEFLAG("gb", "ny1", 0.9);
focus([1615, 345], 90, T_ARMY, T_WRONG - 0.2);
focus([1505, 480], 80, T_WRONG, T_MILES - 0.1);
// "more than four hundred miles to the north": a thin route line from the camp south to the Chesapeake and Yorktown (fades)
const ROUTE = [[1585, 372], [1538, 352], [1500, 400], [1463, 468], [1393, 592], [1320, 656], [1284, 680], [1198, 737], [1150, 800], [1120, 900], [1112, 1040], [1105, 1180], [1100, 1250]];
trail(ROUTE, SIDECOL("allies"), 3.4 / CW[2], T_MILES, 1.8, null);
PLACE_LABEL("Virginia", [935, 1150], T_VA, { size: 26 });
// "the strongest British army in America": more red boxes round New York
UNIT("ny3", "british", [1882, 436], "infantry", { ech: "XX", t: T_STRONG }); UNIT("ny4", "british", [1418, 468], "infantry", { ech: "X", t: T_STRONG + 0.25 });
// "without being stopped": a thin red arrow out of New York into New Jersey, across the route
arw({ pts: [[1440, 520], [1405, 560], [1372, 600]], side: "rome", t: T_STOP, dur: 0.8, width: AW(CW[2], 9) });
// "a French fleet ... from the Caribbean": a blue ship box from the south, the arrow from the bottom edge of the map up to the capes
UNIT("ff1", "allies", [1440, 1430], "ship", { ech: "", t: T_FLEET });
B.move("ff1", T_FLEET + 0.2, T_MAN - T_FLEET, 1215, 1352);
focus([1180, 1350], 70, T_FIRST, T_CARIB - 0.1);
arw({ pts: [[1500, 1640], [1440, 1500], [1330, 1410], [1225, 1362]], side: "carth", t: T_CARIB, dur: 1.2, width: AW(CW2[2], 9) });
// "before the Royal Navy did": the red fleet box sails south from New York (race)
B.move("rs2", T_RN, 5.5, 1505, 860);
arw({ pts: [[1612, 630], [1570, 720], [1500, 860]], side: "rome", t: T_RN + 0.1, dur: 1.0, width: AW(CW2[2], 9) });
// "The man who bet everything on it": the "?" banner on a pole by the American camp (revealed on the spoken name)
BANNER("washington", "George Washington", "us", "am1", T_MAN, { myst: T_GW, side: "west" });
wstampL("SIX YEARS", 1760, 330, T_SIX, T_GW - 0.35, null, 26);
// ---------------------------------------------------------------------------------------------------------------------------------
// hook-4: the name slam
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const NAME = scr0(`<div style="padding:12px 46px 16px;background:rgb(18,16,12);border-top:7px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700;text-align:center;box-shadow:0 16px 34px rgba(0,0,0,.6)"><div style="font-size:92px;letter-spacing:0.08em;line-height:1.1">GEORGE WASHINGTON</div></div>`,
  "left:0;right:0;top:790px;display:flex;justify-content:center;transform-origin:50% 40%;");
slam(NAME, T_GW - 0.1, { from: 1.9, shake: 6, until: T_BUILD - 0.2 });
// ---------------------------------------------------------------------------------------------------------------------------------
// the three snap cuts (black frame hides each camera jump; whoosh + hit)
// ---------------------------------------------------------------------------------------------------------------------------------
const CUTB = scr0("", "inset:0;background:#030406;");
const PINS = document.getElementById("pins");
const cut = (t) => { tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  SFX("whoosh", t - 0.25); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25); };
const hideAll = (t) => { const els = [...OVL.children, ...PINS.children].filter((e) => !["defs", "style"].includes(e.tagName.toLowerCase())); tl.set(els, { autoAlpha: 0 }, t - 0.01); };
const layer = (map, close) => { const im = document.createElement("img"); im.src = `assets/inset_${map}${close ? "_close" : ""}.jpg`; im.alt = "";
  im.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;max-width:none;pointer-events:none"; WORLD.insertBefore(im, document.querySelector(".lv-water") || OVL); gsap.set(im, { autoAlpha: 0 }); return im; };
const LT = (map) => (la, lo) => YT.L(la, lo, map);
CUTL = [[T2 - 0.01, 1e9]];
// ---------- CUT 1 (east): the march: across the Hudson at King's Ferry, curling toward Staten Island, then wheeling south ----------
cut(T1);
tl.set(["ny2", "ny3", "ny4", "ff1", "rs2", "cw1"].map((id) => B.units[id].el), { autoAlpha: 0 }, T1 - 0.01);
const MR = [[1588, 370], [1560, 360], [1538, 346], [1512, 362], [1488, 398], [1466, 436], [1452, 466], [1446, 486], [1430, 506], [1410, 540], [1400, 566], [1393, 592]];
march("am1", sub(MR, 0.30, 1.0, 24), T1 + 0.05, T2 - T1 - 0.2, { dustSize: 40, dustOp: 0.5 });
B.move("am1", T1, 0.01, ...posOn(MR, 0.30));
march("am2", sub(MR, 0.12, 0.80, 24), T1 + 0.05, T2 - T1 - 0.2, { dustSize: 40, dustOp: 0.5 });
B.move("am2", T1, 0.01, ...posOn(MR, 0.12));
march("amA", sub(MR, 0.0, 0.60, 24), T1 + 0.05, T2 - T1 - 0.2, { dustSize: 40, dustOp: 0.5 });
B.move("amA", T1, 0.01, ...posOn(MR, 0.0));
wstampL("FOOL THE BRITISH", 1700, 618, T_FOOL, T2 - 0.1, null, 28);
// ---------- CUT 2 (chesapeake layer, 5 Sep 1781, clear): two lines of ships off Cape Henry ----------
hideAll(T2);
const LCH = layer("chesapeake"), CHP = LT("chesapeake");
tl.set(LCH, { autoAlpha: 1 }, T2 - 0.01); tl.set(LCH, { autoAlpha: 0 }, T3 - 0.01);
cut(T2);
B.date("5 SEP 1781", T2, T3 - 0.08, 32);
const SC2 = [];
const FR = [[1590, 990], [1665, 1002], [1740, 1014], [1815, 1026]], GBL = [[1650, 870], [1725, 878], [1800, 886], [1875, 894]];
FR.forEach((p, i) => { const id = "fr" + i; UNITF(id, "allies", p, "ship", { ech: "", t: T2 - 0.02, fade: 0.01 }); B.move(id, T2 + 0.05, T3 - T2, p[0] + 70, p[1] + 10); SC2.push(id); });
GBL.forEach((p, i) => { const id = "gb" + i; UNITF(id, "british", p, "ship", { ech: "", t: T2 - 0.02, fade: 0.01 }); B.move(id, T2 + 0.05, T3 - T2, p[0] + 70, p[1] + 14); SC2.push(id); });
// the two lines facing each other: the two-colour front between them (red toward the British line)
{ const fg = FRONT([[1625, 936], [1795, 952], [1965, 970]], T2 + 0.3, { enemy: [1800, 860], dur: 0.9 }); gsap.set(fg, { autoAlpha: 1 }); tl.set(fg, { autoAlpha: 0 }, T3 - 0.01); }
const posAt = (p, t) => { const k = Math.min(1, Math.max(0, (t - T2 - 0.05) / (T3 - T2))); return [p[0] + 70 * k, p[1] + 12 * k]; };
shoot(posAt(GBL[1], T2 + 0.5), posAt(FR[1], T2 + 1.3), T2 + 0.5, { dur: 0.75, r: 7, h: 30 });
shoot(posAt(FR[2], T2 + 2.2), posAt(GBL[2], T2 + 3.0), T2 + 2.2, { dur: 0.75, r: 7, h: 30 });
SIDEFLAG("fr", "fr0", T2 - 0.02); SIDEFLAG("gb", "gb3", T2 - 0.02);
wstampL("A BATTLE AT SEA", 1745, 1150, at(H4, "a battle at sea"), T3 - 0.1, null, 28);
tl.set(SC2.map((id) => B.units[id].el), { autoAlpha: 0 }, T3 - 0.01);
// ---------- CUT 3 (yorktown layer, night of 14 Oct 1781, clear): the night assault on Redoubts 9 + 10 ----------
const LYK = layer("yorktown", true), YK = LT("yorktown");
tl.set(LYK, { autoAlpha: 1 }, T3 - 0.01);
cut(T3);
B.date("14 OCT 1781", T3, null, 32);   // stays under the title card
LIGHT("night", T3, 0.01, 1.0);
const SC3 = [];
const R9p = YK(...GD.places.redoubt_9), R10p = YK(...GD.places.redoubt_10);
const BLINE = [[37.2385, -76.5178], [37.2332, -76.5155], [37.2305, -76.5105], [37.2309, -76.5060], [37.2330, -76.5030], [37.2356, -76.5008]].map(([a, b]) => YK(a, b));
const PAR2 = [[37.2262, -76.5150], [37.2262, -76.5080], [37.2270, -76.5030], [37.2285, -76.5005]].map(([a, b]) => YK(a, b));
SC3.push(TRENCH(BLINE, T3, { side: "british", dur: 0.01 }), TRENCH(PAR2, T3, { side: "allies", dur: 0.01, front: R10p }));
const R9 = REDOUBT("r9", R9p, T3, { side: "british", rot: 12, px: 62 }), R10 = REDOUBT("r10", R10p, T3, { side: "british", rot: -8, px: 62 });
UNITF("yb1", "british", [1318, 812], "infantry", { ech: "X", t: T3 - 0.02, fade: 0.01 }); UNITF("yb2", "british", [1420, 832], "infantry", { ech: "X", t: T3 - 0.02, fade: 0.01 });
// the two assault columns from the second parallel: Americans on Redoubt 10 (by the river), French on Redoubt 9
const A10 = [R10p[0] + 75, R10p[1] + 115], A9 = [R9p[0] - 30, R9p[1] + 130];
UNITF("as10", "allies", A10, "infantry", { ech: "II", t: T3 - 0.02, fade: 0.01 }); UNITF("as9", "allies", A9, "infantry", { ech: "II", t: T3 - 0.02, fade: 0.01 });
march("as10", [A10, [R10p[0] + 30, R10p[1] + 50], [R10p[0] + 6, R10p[1] + 12]], T3 + 0.3, T_MUSK - T3 + 0.2, { dust: false });
march("as9", [A9, [R9p[0] - 12, R9p[1] + 55], [R9p[0] - 4, R9p[1] + 14]], T3 + 0.45, T_MUSK - T3 + 0.35, { dust: false });
mg(R10p, [R10p[0] + 40, R10p[1] + 60], T_NATT + 0.4, 4, 0.9);
smoke([[R10p[0] + 4, R10p[1] - 2]], T_NATT + 0.45, 0.6);
tl.to(["yb1", "yb2"].map((id) => B.units[id].el), { autoAlpha: 0, duration: 0.4 }, T_MUSK + 0.5);
REDOUBT_TAKEN(R10, T_MUSK + 0.4); REDOUBT_TAKEN(R9, T_MUSK + 0.7);
const hb = (p, r) => [[p[0] - r, p[1] - r * 0.8], [p[0] + r * 1.1, p[1] - r], [p[0] + r, p[1] + r], [p[0] - r * 1.1, p[1] + r * 0.9]];
HATCH([hb(R10p, 30), hb(R9p, 30)], "allies", T_MUSK + 0.4, { hold: 1.6 });
SIDEFLAG("us", "as10", T3 - 0.02); SIDEFLAG("fr", "as9", T3 - 0.02); SIDEFLAG("gb", "yb1", T3 - 0.02);   // Americans on Redoubt 10, French on Redoubt 9
wstampL("A NIGHT ATTACK", ...YK(37.2238, -76.5160), T_NATT, T_MUSK + 0.3, null, 28);
// ---------------------------------------------------------------------------------------------------------------------------------
// the title: the night shot dims, YORKTOWN 1781 slams on "Yorktown was won"
// ---------------------------------------------------------------------------------------------------------------------------------
const TDIM = scr0("", "inset:0;background:linear-gradient(0deg,rgba(5,7,13,0.3) 0%,rgba(5,7,13,0.72) 70%);"); SCN.insertBefore(TDIM, document.getElementById("date"));
tl.fromTo(TDIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, T4);
const TITLE = scr0(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:18px 70px 24px;background:rgb(14,12,10);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:128px;letter-spacing:0.06em;line-height:1.05;color:#f7f3ea">YORKTOWN <span style="color:#c9b48a">1781</span></div></div>`, "left:0;right:0;top:330px;display:flex;justify-content:center;");
slam(TITLE, T_WON - 0.22, { from: 1.7, shake: 6 });

