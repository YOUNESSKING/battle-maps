// P3A (p3-1 .. p3-3), Yorktown 1781, PART 3 THE SIEGE, first scene. Main style (STYLE_LOCK 2d/2e/2f via the Yorktown map kit), 1c clean
// screen, 1d (plan + "in other words" + set-up "Remember that date"). Build:
//   python3 kit/build_scene.py p3a peninsula p3-1 p3-3 --inset yorktown
// p3-1 (`peninsula` -> `yorktown` inset): title card PART 3 · THE SIEGE alone; 28 SEP 1781 on the spoken date; two blue columns march east out of
//   Williamsburg on the two roads (French on the northern road, Americans on the southern branch, dust); card OVER 16,000 on "sixteen thousand";
//   ONE continuous zoom into the yorktown inset while they spread into a half circle river-to-river (French left/west, Americans right/east);
//   FORM 2 stripes once (~2.5 s) when the ring is closed; "The French took the left": French pennant on the west wing; "the Americans the
//   right": US flag on the east wing; "Across the river": camera north, French cavalry + Virginia militia close the Gloucester neck;
//   "Gloucester Point": place name.
// p3-2 (`yorktown` inset): Cornwallis banner in the town lines on his name; 29 SEP; night; a boat brings Clinton's letter to the town wharf;
//   card RESCUE · ABOUT 5 OCTOBER on "about the fifth of October" (held through "Remember that date"); "pulled his men back": the red boxes in
//   the outer works pull back to the inner line; "At dawn": morning light, blue boxes walk into the empty works, FORM 1 blue hatching ~3 s.
// p3-3 (`peninsula`, the Gloucester side): pull back north; 3 OCT; "Banastre Tarleton": his banner; "rode out of Gloucester": red cavalry ride
//   north on the Gloucester road; "French hussars": blue cavalry from the north; "the Duc de Lauzun": his banner (French pennant); "the Hook":
//   place name; "went down": battle mark; "barely escaped": the red cavalry ride back fast inside the Gloucester works; "stayed inside their
//   lines": the camera dives back into the yorktown inset = p3b frame 0 (siege ring of 30 Sep - 3 Oct).
const P1 = "p3-1", P2 = "p3-2", P3 = "p3-3";
const T_28 = at(P1, "twenty-eighth of September"), T_16K = at(P1, "sixteen thousand"), T_OUT = at(P1, "marched out of Williamsburg"),
  T_CLOSED = at(P1, "closed around the town"), T_HALF = at(P1, "in a half circle"), T_BELOW = at(P1, "the river below"),
  T_LEFT = at(P1, "The French took the left"), T_RIGHT = at(P1, "the Americans the right"), T_ACROSS = at(P1, "Across the river"),
  T_CAV = at(P1, "French cavalry"), T_SHUT = at(P1, "shut in"), T_GP = at(P1, "Gloucester Point");
const T_CORN = at(P2, "Cornwallis's plan"), T_29 = at(P2, "twenty-ninth of September"), T_LETTER = at(P2, "a letter from Clinton"),
  T_REACHED = at(P2, "reached him"), T_SAIL = at(P2, "would sail from New York"), T_5OCT = at(P2, "about the fifth of October"),
  T_REM = at(P2, "Remember that date"), T_OW = at(P2, "In other words"), T_NIGHT = at(P2, "So that night"), T_PULL = at(P2, "he pulled his men back"),
  T_DAWN = at(P2, "At dawn"), T_WALK = at(P2, "walked into the empty earthworks");
const T_ACR3 = at(P3, "Across the river"), T_3OCT = at(P3, "third of October"), T_TARL = at(P3, "Banastre Tarleton"), T_RODE = at(P3, "rode out of Gloucester"),
  T_HUSS = at(P3, "French hussars"), T_LAUZ = at(P3, "the Duc de Lauzun"), T_HOOK = at(P3, "the Hook"), T_DOWN = at(P3, "went down"),
  T_ESC = at(P3, "barely escaped"), T_AFTER = at(P3, "After that"), T_STAYED = at(P3, "stayed inside their lines");
// ---------------------------------------------------------------------------------------------------------------------------------
// maps + camera: `peninsula` base, the `yorktown` map nested in its true place (YK = yorktown map px -> peninsula px)
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const YKI = INSET("yorktown");
const YK = (x, y) => [YKI.box[0] + x * YKI.k, YKI.box[1] + y * YKI.k], YKL = (pts) => pts.map(([x, y]) => YK(x, y)), SY = (s) => s / YKI.k;
const UNITF = (id, side, p, type, o = {}) => { UNIT(id, side, p, type, { ...o, t: 0 }); const el = B.units[id].el; gsap.set(el, { autoAlpha: 0 });
  tl.to(el, { autoAlpha: 1, duration: o.fade ?? 0.35 }, o.t); return id; };
const SEGS = [], seg = (t0, t1, a, b, ease = "sine.inOut", geo = false) => { SEGS.push({ t0, t1, a, b, e: gsap.parseEase(ease), geo }); SEGS.sort((p, q) => p.t0 - q.t0); };
const camAt = (t) => { let c = SEGS[0].a;
  for (const g of SEGS) { if (t < g.t0) break; const u = g.e(Math.min(1, (t - g.t0) / Math.max(g.t1 - g.t0, 1e-3))), a = g.a, b = g.b;
    if (g.geo) { const s = a[2] * (b[2] / a[2]) ** u, v = (1 / a[2] - 1 / s) / (1 / a[2] - 1 / b[2]); c = [a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v, s]; }
    else c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  return c; };
const camKeys = () => { const ts = []; for (let t = 0; t <= END + 1e-6; t += 0.05) ts.push(+t.toFixed(3)); if (ts[ts.length - 1] < END) ts.push(END);
  return ts.map((t) => [t, ...camAt(t), "none"]); };
const CY = (x, y, s) => [...YK(x, y), SY(s)];                  // camera key in yorktown map px + yorktown scale
const C0 = [1470, 822, 1.32], C1 = [1525, 840, 1.4];
const CRING = CY(1385, 800, 1.45), CGLO = CY(1430, 725, 1.32), CTOWN = CY(1400, 800, 1.5), CDAWN = CY(1370, 860, 1.45);
const CHOOK = [1812, 735, 1.5], CEND = CY(1440, 830, 1.6);     // CEND = p3b frame 0
seg(0, 5.4, C0, C1);
seg(5.5, 9.3, C1, CRING, "power2.inOut", true);                // the one continuous zoom into the siege
seg(T_ACROSS - 0.2, T_ACROSS + 1.6, CRING, CGLO, "sine.inOut");
seg(T_CORN - 0.3, T_CORN + 1.8, CGLO, CTOWN, "sine.inOut");
seg(T_PULL - 0.3, T_PULL + 2.0, CTOWN, CDAWN, "sine.inOut");
seg(T_ACR3 - 0.2, T_ACR3 + 2.2, CDAWN, CHOOK, "power2.inOut", true);   // pull back to the Gloucester side (the Hook lies north of the yorktown map)
seg(T_STAYED - 0.6, END - 0.05, CHOOK, CEND, "power2.inOut", true);    // dive back into the siege = p3b frame 0
camera(camKeys());
// ---------------------------------------------------------------------------------------------------------------------------------
// screen cards (cream on dark, one big card at a time)
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const CARD = (kick, big, col, t, until, o = {}) => { const el = scr0(`<div style="padding:12px 46px 16px;background:rgb(18,16,12);border-top:6px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    ${kick ? `<div class="k" style="font-size:26px;letter-spacing:.34em;color:#d8c9a3">${kick}</div>` : ""}<div class="b" style="font-size:${o.size || 72}px;letter-spacing:.05em;line-height:1.08">${big}</div></div>`,
    o.css || `left:0;right:0;top:${o.top ?? 150}px;display:flex;justify-content:center;transform-origin:50% 30%;`);
  slam(el, t, { from: o.from || 1.6, shake: o.shake ?? 4, until }); return el; };
const TITLE = scr0(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgb(14,12,10);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">PART 3</div><div style="font-size:104px;letter-spacing:0.08em;line-height:1.05;color:#f7f3ea">THE SIEGE</div></div>`,
  "left:0;right:0;top:350px;display:flex;justify-content:center;transform-origin:50% 40%;");
slam(TITLE, 0.3, { from: 1.6, shake: 4, until: T_16K - 0.3 });
// battle mark (crossed sabres ink mark, grant s12 kit) + powder smoke
const SAB = `<svg width="46" height="46" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.6))"><g stroke="#2a2410" stroke-width="3.2" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><g stroke="#f3eee2" stroke-width="1.4" stroke-linecap="round" fill="none"><path d="M-12 -12 L12 12 M12 -12 L-12 12"/></g><path d="M-14 -6 L-6 -14 M14 -6 L6 -14" stroke="#2a2410" stroke-width="2.4"/></svg>`;
const MARK = (p, t, until) => { const el = pinS(GG.pin(SAB, p[0], p[1], { t, pop: true, until })); SFX("hit", t + 0.1); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// date scroll: SEP 1781 (from p2b) -> 28 SEP -> 29 SEP -> 3 OCT
// ---------------------------------------------------------------------------------------------------------------------------------
dateNow("SEP 1781", T_28 - 0.05);
B.date("28 SEP 1781", T_28 + 0.1, T_29 - 0.08, 32); SFX("tick", T_28 + 0.2);
B.date("29 SEP 1781", T_29, T_3OCT - 0.08, 32); SFX("tick", T_29 + 0.1);
B.date("3 OCT 1781", T_3OCT, null, 32); SFX("tick", T_3OCT + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
// the British at Yorktown (yorktown map px): inner line + guns, outer works (held until the night of 29 Sep), Redoubts 9 + 10,
// the Fusiliers' Redoubt upriver, the Gloucester works across the narrows
// ---------------------------------------------------------------------------------------------------------------------------------
const BLINE = YKL([[1291, 715], [1318, 793], [1376, 832], [1428, 827], [1463, 796], [1489, 758]]);
TRENCH(BLINE, 0, { face: 1 });
const OW = [YKL([[1162, 770], [1185, 800], [1215, 806]]), YKL([[1318, 1002], [1350, 1010], [1384, 1002]]), YKL([[1462, 998], [1494, 1004], [1526, 994]])];
OW.forEach((pts) => TRENCH(pts, 0, { face: 1 }));
TRENCH(YKL([[1432, 486], [1468, 474], [1500, 484]]), 0, { face: -1 });   // Gloucester works across the neck
REDOUBT("r9", YK(1469, 852), 0, { side: "british", rot: 12, px: 26 }); REDOUBT("r10", YK(1498, 812), 0, { side: "british", rot: -8, px: 26 });
REDOUBT("rfus", YK(1194, 635), 0, { side: "british", rot: 4, px: 26 });
const S5 = { s: SY(1.45) };
UNIT("bg1", "british", NUDGE(YK(1330, 728), S5), "artillery", { ech: "" }); UNIT("bg3", "british", NUDGE(YK(1455, 718), S5), "artillery", { ech: "" });
UNIT("o1", "british", YK(1190, 782), "infantry", { ech: "X" }); UNIT("o2", "british", YK(1350, 988), "infantry", { ech: "X" });
UNIT("o3", "british", YK(1494, 982), "artillery", { ech: "" });
UNIT("g1", "british", NUDGE(YK(1466, 506), S5), "infantry", { ech: "X" });
const BRIT = ["bg1", "bg3", "o1", "o2", "o3", "g1"];
BRIT.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 0 })); showU(BRIT, 7.6);
UNIT("yw", "british", [1800, 884], "infantry", { ech: "XX" }); hideU(["yw"], 6.6);
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-1: the allied army marches out of Williamsburg on the two roads and closes the ring
// ---------------------------------------------------------------------------------------------------------------------------------
const NROAD = LLYT([[37.2707, -76.7075], [37.2640, -76.6800], [37.2520, -76.6400]]);
const SROAD = [...LLYT([[37.2707, -76.7075], [37.2640, -76.6800], [37.2520, -76.6400]]), [1398, 852], ...LLYT([[37.2140, -76.5780], [37.2040, -76.5480], [37.2035, -76.5250]])];   // swings south at Halfway House, clear of the carved Yorktown name
// the French leave the road west of Yorktown and come in north of the carved name (it is hidden only once the inset covers the frame)
const NWAY = [[1420, 772], [1540, 752], [1690, 815]];
const RING = { f1: [1120, 650], f2: [1050, 760], fa: [1080, 880], a1: [1300, 1060], a2: [1450, 1040], aa: [1580, 1035], a3: [1640, 990] };
const T_M0 = 0.6, T_M1 = 9.3;
// each column = two boxes on ONE path, the second 0.65 s behind the first (same speed: they never bunch); at the staging point (the frame is
// inside the siege map by then) each walks on to its place in the ring
const FPATH = [...NROAD, ...NWAY], SPATH = [...SROAD];
const TRAIN = (id, type, path, f0, t0, tStage, tgt) => { const pts = sub(path, f0, 1, 30); UNIT(id, "allies", pts[0], type, { ech: type === "infantry" ? "XX" : "" });
  march(id, pts, t0, tStage - t0, { dustSize: 34, dustOp: 0.45 }); march(id, [path[path.length - 1], YK(...tgt)], tStage + 0.05, T_M1 + 0.4 - tStage, { dustSize: 8, dustOp: 0.4 }); };
const PLEN = (pts) => pts.reduce((acc, q, i) => i ? acc + Math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1]) : acc, 0);
const LF = PLEN(FPATH), LSP = PLEN(SPATH);   // on the shared road out of Williamsburg the Americans lead (they turn off first at Halfway House)
TRAIN("f1", "infantry", FPATH, 135 / LF, T_M0, 7.6, RING.f1);
TRAIN("f2", "infantry", FPATH, 60 / LF, T_M0, 8.25, RING.f2);
TRAIN("a2", "infantry", SPATH, 288 / LSP, T_M0, 7.6, RING.a2);
TRAIN("a1", "infantry", SPATH, 212 / LSP, T_M0, 8.25, RING.a1);
const TFILL = 7.9;
UNITF("fa", "allies", YK(...RING.fa), "artillery", { ech: "", t: TFILL, fade: 0.5 });
UNITF("aa", "allies", YK(...RING.aa), "artillery", { ech: "", t: TFILL + 0.15, fade: 0.5 });
UNITF("a3", "allies", YK(...RING.a3), "infantry", { ech: "XX", t: TFILL + 0.3, fade: 0.5 });
const ALL = ["f1", "f2", "fa", "a1", "a2", "aa", "a3"];
CARD("", "OVER 16,000", "#1f4fc4", T_16K - 0.05, Math.min(T_16K + 3.0, T_CLOSED - 0.2), { size: 76, top: 170 });
// FORM 2 (once): the whole siege map in two-side stripes when the ring is closed (allied ground blue, the British pocket red)
const REDP = [[1100, 560], [1140, 800], [1250, 965], [1400, 1015], [1560, 1005], [1720, 935], [1850, 800], [1700, 560], [1600, 520], [1500, 462], [1420, 462], [1380, 560]];
const RECT = [[600, 150], [2300, 150], [2300, 1400], [600, 1400]];
const BLUEP = [...RECT, RECT[0], ...REDP, REDP[0], RECT[0]];   // keyhole: REDP runs counter to RECT, so it is a hole (nonzero rule)
STRIPES(YKL(BLUEP), YKL(REDP), T_BELOW + 0.4);
// the nation flags ride with the wings: French pennant west, US flag east
SIDEFLAG("fr", "f2", T_LEFT + 0.1); SIDEFLAG("us", "a2", T_RIGHT + 0.1);
SIDEFLAG("gb", "bg1", T_CLOSED);
// "Across the river, French cavalry and Virginia militia shut in Gloucester Point"
UNITF("gc", "allies", YK(1478, 360), "cavalry", { ech: "", t: T_CAV - 0.1 }); UNITF("gm", "allies", YK(1585, 372), "infantry", { ech: "X", t: T_CAV + 0.2 });
march("gc", YKL([[1478, 360], [1474, 390], [1470, 418]]), T_CAV + 0.2, T_SHUT - T_CAV + 0.6, { dustSize: 8, dustOp: 0.4 });
march("gm", YKL([[1585, 372], [1578, 405], [1570, 436]]), T_CAV + 0.4, T_SHUT - T_CAV + 0.6, { dustSize: 8, dustOp: 0.4 });
PLACE_LABEL("Gloucester Point", YK(1610, 618), T_GP, { size: 28 });
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-2: Cornwallis holds on; Clinton's letter by boat at night; the pull back from the outer works; at dawn the allies walk in
// ---------------------------------------------------------------------------------------------------------------------------------
const BK = BANNER("cornwallis", "Lord Cornwallis", "gb", YK(1392, 694), T_CORN + 0.3, { side: "nw", until: T_ACR3 - 0.1 });
LIGHT("night", T_29 + 0.4, 1.8, 0.85); NIGHT_DIM(T_29 + 0.4, 0.8, 1.8);
BOAT(YKL([[1760, 780], [1660, 745], [1560, 712], [1468, 700]]), T_29 + 0.6, T_REACHED - T_29 + 0.2, { until: T_SAIL + 1.0, px: 22 });
// the letter: a small sealed dispatch pops at the wharf when the boat comes in
const LET = pinS(GG.pin(`<svg width="40" height="30" viewBox="-20 -15 40 30" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.7))"><rect x="-17" y="-12" width="34" height="24" rx="1.5" fill="#efe3c2" stroke="#6b5532" stroke-width="1.4"/><path d="M-17 -12 L0 2 L17 -12" fill="none" stroke="#6b5532" stroke-width="1.3"/><circle cx="0" cy="3" r="4.2" fill="#a3221b"/></svg>`, ...YK(1466, 672), { t: T_REACHED, pop: true, until: T_REACHED + 2.6 }));
SFX("hit", T_REACHED + 0.1);
CARD("RESCUE", "ABOUT 5 OCTOBER", "#c4121f", T_5OCT - 0.05, T_OW - 0.3, { size: 72, css: "right:110px;top:330px;transform-origin:50% 30%;" });
focus(YK(1400, 760), 120, T_OW, T_NIGHT - 0.2);
// "he pulled his men back from his outer works into a tighter line around the town"
const PIN = { o1: [1372, 815], o2: [1425, 800], o3: [1485, 765] };
march("o1", YKL([[1190, 782], [1250, 800], [1320, 818], PIN.o1]), T_PULL, 2.6, { dustSize: 8, dustOp: 0.35 });
march("o2", YKL([[1350, 988], [1385, 900], PIN.o2]), T_PULL + 0.2, 2.6, { dustSize: 8, dustOp: 0.35 });
march("o3", YKL([[1494, 982], [1500, 880], PIN.o3]), T_PULL + 0.35, 2.6, { dustSize: 8, dustOp: 0.35 });
// "At dawn, the French and Americans walked into the empty earthworks without a fight"
LIGHT("morning", T_DAWN - 0.2, 1.6, 0.6); NIGHT_DIM(T_DAWN - 0.2, 1.0, 1.6);
const DAWNP = { f2: [1190, 778], a1: [1350, 988], a2: [1494, 980] };
march("f2", YKL([RING.f2, [1120, 772], DAWNP.f2]), T_WALK - 0.3, 2.4, { dustSize: 8, dustOp: 0.4 });
march("a1", YKL([RING.a1, [1325, 1025], DAWNP.a1]), T_WALK - 0.2, 2.4, { dustSize: 8, dustOp: 0.4 });
march("a2", YKL([RING.a2, [1478, 1012], DAWNP.a2]), T_WALK - 0.1, 2.4, { dustSize: 8, dustOp: 0.4 });
HATCH(YKL([[1120, 690], [1250, 690], [1300, 800], [1370, 860], [1440, 885], [1530, 865], [1600, 900], [1640, 960], [1560, 1030], [1400, 1040], [1250, 1020], [1120, 880]]), "allies", T_WALK + 0.6, { hold: 2.2 });
LIGHT("day", T_WALK + 2.8, 2.5);
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-3: the Gloucester side at the peninsula scale (the siege boxes stand aside; two boxes keep the siege on screen)
// ---------------------------------------------------------------------------------------------------------------------------------
const SIEGE = [...ALL, ...BRIT, "gc", "gm"];
hideU(SIEGE, T_ACR3 - 0.1);
const TB = T_ACR3 + 1.4;
UNITF("ys1", "allies", [1728, 912], "infantry", { ech: "XXX", t: TB, fade: 0.5 }); UNITF("ys2", "allies", [1818, 922], "infantry", { ech: "XXX", t: TB, fade: 0.5 });
UNITF("yr1", "british", [1790, 868], "infantry", { ech: "XX", t: TB, fade: 0.5 });
UNITF("gr1", "british", [1792, 814], "infantry", { ech: "X", t: TB, fade: 0.5 });
const HOOK = PLACE("the_hook");
UNITF("tc1", "british", [1786, 772], "cavalry", { ech: "", t: TB + 0.2, fade: 0.5 }); UNITF("tc2", "british", [1840, 784], "cavalry", { ech: "", t: TB + 0.3, fade: 0.5 });
const GROAD = LLYT([[37.2580, -76.5040], [37.2760, -76.4950], [37.2917, -76.4847]]);
BANNER("tarleton", "Banastre Tarleton", "gb", "tc1", T_TARL + 0.4, { side: "west", until: T_STAYED + 0.6 });
march("tc1", [[1786, 772], ...GROAD.slice(0, 2), [HOOK[0] - 10, HOOK[1] + 14]], T_RODE, 3.0, { dustSize: 26, dustOp: 0.5 });
march("tc2", [[1840, 784], [1858, 735], [1866, 700], [HOOK[0] + 30, HOOK[1] + 26]], T_RODE + 0.2, 3.0, { dustSize: 26, dustOp: 0.5 });
UNITF("lz1", "allies", [1872, 520], "cavalry", { ech: "", t: T_HUSS - 0.1 }); UNITF("lz2", "allies", [1820, 506], "cavalry", { ech: "", t: T_HUSS + 0.15 });
BANNER("lauzun", "Duc de Lauzun", "fr", "lz1", T_LAUZ + 0.4, { side: "east", until: T_STAYED + 0.6 });
march("lz1", [[1872, 520], [1860, 580], [HOOK[0] + 20, HOOK[1] - 22]], T_HOOK - 0.6, 1.8, { dustSize: 26, dustOp: 0.55 });
march("lz2", [[1820, 506], [1818, 570], [HOOK[0] - 22, HOOK[1] - 24]], T_HOOK - 0.5, 1.8, { dustSize: 26, dustOp: 0.55 });
PLACE_LABEL("The Hook", HOOK, T_HOOK + 0.1, { dx: 125, dy: 30, size: 26 });
mg([HOOK[0] + 18, HOOK[1] - 18], [HOOK[0] - 6, HOOK[1] + 10], T_HOOK + 1.3, 4, 0.8);
MARK([HOOK[0] + 4, HOOK[1] - 4], T_DOWN, T_AFTER + 1.0); smoke([[HOOK[0] + 4, HOOK[1] - 2], [HOOK[0] - 6, HOOK[1] + 4]], T_DOWN + 0.05, 0.7);
// "he barely escaped": the red cavalry ride back fast inside the Gloucester works; the hussars follow to the neck and stop
march("tc1", [[HOOK[0] - 10, HOOK[1] + 14], ...GROAD.slice(0, 2).reverse(), [1786, 772]], T_ESC, 1.3, { dustSize: 26, dustOp: 0.55 });
march("tc2", [[HOOK[0] + 30, HOOK[1] + 26], [1862, 712], [1842, 786]], T_ESC + 0.1, 1.3, { dustSize: 26, dustOp: 0.55 });
march("lz1", [[HOOK[0] + 20, HOOK[1] - 22], [1846, 690], [1838, 720]], T_ESC + 0.4, 1.8, { dustSize: 26, dustOp: 0.5 });
march("lz2", [[HOOK[0] - 22, HOOK[1] - 24], [1806, 690], [1796, 718]], T_ESC + 0.5, 1.8, { dustSize: 26, dustOp: 0.5 });
focus([1790, 795], 70, T_STAYED - 0.4, T_STAYED + 1.8);
// the dive back: the peninsula-scale boxes leave, the siege boxes come back (p3b frame 0 = the ring of 30 Sep - 3 Oct)
const TD = T_STAYED - 0.6;
hideU(["ys1", "ys2", "yr1", "gr1", "tc1", "tc2", "lz1", "lz2"], END - 2.4);
showU([...ALL, ...BRIT.filter((id) => id !== "g1")], END - 2.0);   // the Gloucester boxes stay off (out of the p3b frame)
BANNER("cornwallis", "Lord Cornwallis", "gb", YK(1392, 694), END - 1.5, { side: "nw" });
// ---------------------------------------------------------------------------------------------------------------------------------
window.SFX_CUES = (window.SFX_CUES || []).filter(([k]) => !String(k).startsWith("ref:")); document.documentElement.setAttribute("data-sfx", JSON.stringify(window.SFX_CUES));
if (GD.var.audit) LABEL_AUDIT([1, 4, 8, 10, 12, 16, 20, 24, 30, 36, 44, 48, 52, 58, 64, 70, 76], { show: true });
