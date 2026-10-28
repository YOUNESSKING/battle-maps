// MOVE 3c (move3-8), William T. Sherman #13: the end in the Carolinas. Goldsboro (Schofield joins: 88,948 on 10 Apr, Memoirs); 9 Apr Lee
// surrenders at Appomattox (28,231 paroled, NPS); 17 Apr Bennett Place near Durham's Station: Sherman meets Johnston and shows him the
// telegram (Lincoln assassinated; Lincoln's badge greys); 26 Apr SURRENDER: 89,270 (Carolinas, Georgia, Florida; NC Historic Sites), more than
// three times Appomattox (bars); method card line 3: GO WHERE THEY SAY NO ARMY CAN.
// Basemap south_hd_ref (z8, HOOK agent's map, read-only). Built with: python3 tools/build_scene.py move3c south_hd_ref move3-8 move3-8
// Source: assets/src/move3c_body.js + m3_kit.js, assembled by tools/make_m3_scenes.py.
// Option 1: m3_south_ctl_mar23_mx (MOVE 3 variant, tools/make_m3_control.py: 23 Mar - 8 Apr) -> south_ctl_apr65_mx (HOOK agent, read-only: 26 Apr).
// ==== BODY
const L = GG.proj(8, 16491, 25259);
const P8 = "move3-8";
const T_3W = at(P8, "Three weeks later came the news"), T_LEE = at(P8, "Lee had surrendered at Appomattox"), T_17 = at(P8, "On the seventeenth of April"),
  T_FARM = at(P8, "at a small farmhouse near Durham's Station"), T_BENN = at(P8, "called Bennett Place"), T_MET = at(P8, "Sherman met Johnston"),
  T_TEL = at(P8, "showed him a telegram"), T_LINC = at(P8, "Lincoln had been assassinated"), T_9D = at(P8, "Nine days later"),
  T_ALL = at(P8, "surrendered all the troops left under his command"), T_CGF = at(P8, "in the Carolinas, Georgia and Florida"),
  T_89 = at(P8, "eighty-nine thousand"), T_3X = at(P8, "more than three times as many"), T_METH = at(P8, "Go where they say no army can");
// ---------- layers ----------
wimg("assets/media/m3_south_ctl_mar23_mx.png", 0, 0, T_17 + 0.6, { mx: true, outDur: 1.4 });
wimg("assets/media/south_ctl_apr65_mx.png", T_17 - 0.4, 1.4, null, { mx: true });   // Raleigh 13 Apr, Durham's Station, Virginia after Appomattox
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.16 }); LV.shimmer(GD.rivers || [], { width: 1.2 }); LV.scaleBar(503.95); LV.north();
if (GD.geo) wimg(GD.geo, 0, 0, null);
const Q = { SAV: L(32.081, -81.091), COL: L(34.00, -81.035), CHE: L(34.698, -79.883), FAY: L(35.0525, -78.878), BEN: L(35.3488, -78.2969), GOL: L(35.385, -77.993),
  RAL: L(35.78, -78.639), BEN_P: L(36.029, -78.976), DUR: L(35.997, -78.902), GRE: L(36.073, -79.792), APP: L(37.377, -78.796), NB: L(35.107, -77.04), WIL: L(34.235, -77.949) };
const lab = (txt, q, t, o = {}) => { if (o.dot !== false) B.city("", q[0], q[1], { r: o.r || 2.4, t, until: o.until }); return box(txt, q[0] + (o.dx || 0), q[1] + (o.dy != null ? o.dy : -12), t, o.size || 9, o.until, o.pop === true); };
// ---------- camera shots + flags ----------
const SH = [[[Q.GOL[0] - 30, Q.GOL[1] - 10, 2.4], null, 0, [560, 300], [1500, 760]],
  [[1960, 440, 1.25], T_3W + 0.6, 3.0, [880, 560], [1650, 700]],           // Virginia + North Carolina: Appomattox
  [[Q.BEN_P[0] + 10, Q.BEN_P[1] + 10, 3.0], T_17 - 0.3, 2.8, [560, 680], [1460, 760]],   // Bennett Place
  [[1660, 860, 0.9], T_9D - 0.4, 3.2, [700, 500], [1760, 780]]];           // the whole theatre: Carolinas, Georgia, Florida
runShots(SH);
// ---------- date, legend ----------
B.showDate(0.05);
B.date("10 APRIL 1865", 0.1, T_LEE - 0.4, 32); B.date("9 APRIL 1865", T_LEE - 0.3, T_17 - 0.3, 32); B.date("17 APRIL 1865", T_17 - 0.2, T_9D - 0.2, 32);
B.date("26 APRIL 1865", T_9D - 0.1, END + 1, 32);
legend(0.2, END + 1);
// the march just finished: Savannah -> Columbia -> Cheraw -> Fayetteville -> Bentonville -> Goldsboro
const MARCH = [Q.SAV, L(32.70, -81.10), L(33.50, -80.95), Q.COL, L(34.40, -80.75), Q.CHE, Q.FAY, Q.BEN, Q.GOL];
glowLine(MARCH, "#5b8fe8", 3.0, 0.1, END + 1, { dur: 1.6, pulse: 8 });
lab("GOLDSBORO", Q.GOL, 0.2, { dx: 36, dy: 4, size: 8 });
// Goldsboro: Schofield (from Wilmington + New Bern) joins; 88,948 on 10 April (Memoirs)
unit("sh", "carth", Q.GOL[0] - 14, Q.GOL[1] + 6, "infantry", { t: 0.1, size: "XXXX", label: "SHERMAN", w: 16, h: 11, fs: 4.2, until: T_17 + 0.2 });
[[Q.WIL, [Q.GOL[0] + 4, Q.GOL[1] + 14]], [Q.NB, [Q.GOL[0] + 12, Q.GOL[1] + 4]]].forEach(([a, b], k) => arr([a, b], "carth", 0.2 + k * 0.2, { w: 4, dur: 1.0, until: T_17 }));
badge({ name: "JOHN M. SCHOFIELD", role: "JOINS AT GOLDSBORO", photo: "assets/media/schofield_head.png", flag: FL.us, side: "carth", corner: "tr", t: 0.2, until: T_LEE });
countCard("UNION ARMY AT GOLDSBORO · 10 APR 1865", "MEN (MEMOIRS)", BLUE, "left:110px;top:200px;", 0.5, 60079, 88948, 1.4, T_17 - 0.4, { fs: 58 });
// 9 April: Lee surrenders at Appomattox (Virginia, top of the map)
lab("APPOMATTOX", Q.APP, T_LEE - 0.2, { dx: -54, dy: 0, size: 9, until: END + 1 });
K.target(Q.APP[0], Q.APP[1], T_LEE, { r: 18, side: "#5b8fe8", until: T_17 + 0.5 });
mstamp("LEE SURRENDERS", Q.APP[0] + 40, Q.APP[1] + 70, T_LEE + 0.2, { size: 22, color: "#5b8fe8", sub: "APPOMATTOX · 9 APR · 28,231 PAROLED (NPS)", until: T_17 + 0.2 });
// Sherman to Raleigh (13 Apr); Johnston near Greensboro
go("sh", T_LEE + 0.6, 1.6, [Q.RAL[0] + 4, Q.RAL[1] + 14]);
unit("jj", "rome", Q.GRE[0], Q.GRE[1] + 14, "infantry", { t: T_LEE + 0.4, size: "XXXX", label: "JOHNSTON", w: 16, h: 11, fs: 4.2, until: T_9D + 1.4 });
lab("GREENSBORO", Q.GRE, T_LEE + 0.4, { dx: -40, dy: -8, size: 8, until: END + 1 });
// 17 April: Bennett Place near Durham's Station
lab("DURHAM'S STATION", Q.DUR, T_FARM - 0.2, { dx: 30, dy: 12, size: 5, r: 1.2, until: END + 1 });
house(Q.BEN_P[0], Q.BEN_P[1] - 4, T_FARM + 0.2, END + 1, 0.55);
const LBP = box("BENNETT PLACE", Q.BEN_P[0] - 6, Q.BEN_P[1] - 20, T_BENN - 0.1, 6, END + 1, true);
tl.to(LBP, { scale: 1.3, duration: 0.35, yoyo: true, repeat: 1 }, T_BENN + 0.2);
arr([[Q.RAL[0] - 6, Q.RAL[1] - 4], [Q.BEN_P[0] + 6, Q.BEN_P[1] + 4]], "carth", T_MET - 0.3, { w: 3, dur: 0.9, until: T_9D });
arr([[Q.GRE[0] + 10, Q.GRE[1] + 4], [Q.BEN_P[0] - 6, Q.BEN_P[1] + 2]], "rome", T_MET - 0.2, { w: 3, dur: 0.9, until: T_9D });
badge({ name: "WILLIAM T. SHERMAN", role: "BENNETT PLACE · 17 APRIL", photo: "assets/media/sherman_head.png", flag: FL.us, side: "carth", corner: "bl", t: T_MET - 0.3, until: T_9D + 0.2 });
badge({ name: "JOSEPH E. JOHNSTON", role: "BENNETT PLACE · 17 APRIL", photo: "assets/media/johnston_head.png", flag: FL.csa, side: "rome", corner: "br", t: T_MET - 0.1, until: T_9D + 0.2 });
// the telegram he had kept secret all morning: Lincoln assassinated (14 Apr); Lincoln's badge greys
telegram("PRESIDENT LINCOLN ASSASSINATED", "CIPHER TELEGRAM · RALEIGH, 17 APRIL 1865|KEPT SECRET ALL MORNING · SHOWN TO JOHNSTON ALONE", "left:110px;top:170px;", T_TEL - 0.2, T_9D - 0.2);
const LB = badge({ name: "ABRAHAM LINCOLN", role: "SHOT 14 APRIL · DIED 15 APRIL", photo: "assets/media/lincoln_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_TEL + 0.4, until: T_9D + 0.2 });
tl.to(LB, { filter: "grayscale(1) brightness(0.5)", duration: 1.2 }, T_LINC + 0.2);
const ASS = scr(stampHTML("ASSASSINATED", "#c9c2b4", 30, -6), "right:240px;top:300px;"); slam(ASS, T_LINC + 0.1, { shake: 3, until: T_9D + 0.2 });
// 26 April: SURRENDER; 89,270; the Carolinas, Georgia, Florida; more than three times Appomattox
sstamp("SURRENDER", 250, T_ALL - 0.2, { size: 86, sub: "26 APRIL 1865 · BENNETT PLACE · JOHNSTON TO SHERMAN", until: T_89 - 0.1 });
B.hideUnits(["sh"], T_17 + 0.2);
[["CAROLINAS", L(34.70, -79.95)], ["GEORGIA", L(32.75, -83.40)], ["FLORIDA ▼", [1250, 1400]]].forEach(([nm, q], k) => tag(nm, q[0], q[1], T_CGF + k * 0.45, RED, 26, END + 1));
countCard("JOHNSTON SURRENDERS · 26 APR 1865", "MEN · CAROLINAS · GEORGIA · FLORIDA (NC HISTORIC SITES)", RED, "left:0;right:0;margin:auto;width:760px;top:200px;", T_89 - 0.1, 0, 89270, 1.5, T_3X - 0.1, { fs: 72 });
bars([["BENNETT PLACE · 26 APR", 89270, "#c94a3a", "NC HISTORIC SITES"], ["APPOMATTOX · 9 APR", 28231, "#7a6a4c", "NPS"]], "left:110px;top:200px;", T_3X - 0.1, T_METH - 0.3);
// method card line 3
GG.METHOD = ["HIT THE RAILROAD, NOT THE WALL", "THREATEN TWO PLACES AT ONCE", "GO WHERE THEY SAY NO ARMY CAN"]; GG.METHOD_TITLE = "SHERMAN'S METHOD";
GG.method(3, T_METH - 0.5, END + 1, [T_METH - 0.45, T_METH - 0.3, T_METH - 0.1]); SFX("hit", T_METH);
K.raiseTerritory();
B.finish();
