// MOVE 3b (move3-2..move3-5), Patton #15: the Oppenheim crossing, 21-23 March 1945. Basemap oppenheim_hd_lift (z13), option 2 (the
// two-colour glowing front on the Rhine, then round the bridgehead; a faint blue fill once it is 5 miles deep = option 2 -> 1).
// The Rhine is drawn as a ribbon traced off the relief (tools/pd_make_control.py: the DEM misses the river on this flat plain).
// Facts (FACTCHECK_C, MacDonald + Patton's diary): 5th Inf Div "conqueror of 22 rivers"; ~500 boats (204th Engr Bn), 7,500 engineers,
// Navy LCVPs on trucks, hidden two days in a bight among trees; Eddy -> Irwin midmorning 22 Mar ("some sort of bridgehead"); ~100 Cub
// planes idea killed by German aircraft; Felber's Seventh Army: 4 divisions on 50 miles, most far south; no artillery preparation
// (Bradley's release, verbatim); K Co 3rd Bn 11th Inf at Nierstein ~22:30, 1st Lt Irven Jacobs, 7 Germans paddle back without escort;
// A and B Cos at Oppenheim under MG fire; Maj Stiller "at his own request"; moonlit, "disturbing brightness"; 11th Inf 20 casualties,
// Patton's tally 28; bridgehead radius 5+ miles; Kesselring + Hausser at Grossgerau watch Felber's counterattack fail; class 40
// treadway bridge late 23 Mar; German planes: Patton claimed 33, official 19; Patton's call to Bradley (caption, no quote marks).
// Built with: python3 tools/pd_inline.py move3b oppenheim move3-2 move3-5
// @@KIT
// @@DATA
const GP = GG.proj(13, 1095661, 711514), L = (la, lo) => GP(la, lo);
const P2 = "move3-2", P3 = "move3-3", P4 = "move3-4", P5 = "move3-5";
const t2 = (s) => at(P2, s), t3 = (s) => at(P3, s), t4 = (s) => at(P4, s), t5 = (s) => at(P5, s);
const T_SWEPT = t2("His Third Army swept"), T_5ID = t2("with the Fifth Infantry Division"), T_22R = t2("crossed twenty-two rivers"),
  T_ENG = t2("Engineers had brought up"), T_500 = t2("about five hundred assault boats"), T_NAVY = t2("and Navy landing craft"),
  T_HID = t2("and hidden them for two days"), T_MOR = t2("On the morning of the twenty-second"), T_EDDY = t2("General Eddy told"),
  T_IRW = t2("General Irwin,"), T_NIGHT = t2("that the crossing would be that night"), T_PROT = t2("Irwin protested"),
  T_NOTH = t2("Patton wanted nothing more"), T_23R = t2("the twenty-third river"), T_CUB = t2("He had even planned"), T_KILL = t2("until German aircraft");
const T_NOEXP = B.P(P3), T_FEL = t3("General Felber's"), T_FOUR = t3("only four organised divisions"), T_SOUTH = t3("most of them were far to the south"),
  T_BEL = t3("Everyone believed"), T_DIFF = t3("Patton saw something different"), T_SIL = t3("A silent crossing"), T_MARCH = t3("straight off the march"),
  T_UNR = t3("would catch them unready"), T_NOART = t3("There was no artillery preparation"), T_BRAD = t3("Bradley announced it");
const T_BOATS = B.P(P4), T_MOON = t4("under a bright moon"), T_LATE = t4("They were half an hour late"), T_K = t4("K Company of the Eleventh"),
  T_JAC = t4("First Lieutenant Irven Jacobs"), T_SEVEN = t4("seven stunned German soldiers"), T_BACK = t4("and paddled themselves back"),
  T_UP = t4("Farther upstream"), T_MG = t4("two more companies crossed"), T_STIL = t4("Patton's own aide"), T_REQ = t4("at his own request"),
  T_LIT = t4("The night was moonlit"), T_DIST = t4("a disturbing brightness");
const T_MORN = B.P(P5), T_28 = t5("and Patton's own tally"), T_DEEP = t5("Within a day the bridgehead"), T_CA = t5("when the Germans did counterattack"),
  T_KES = t5("Field Marshal Kesselring"), T_LATE23 = t5("Late on the twenty-third"), T_TREAD = t5("engineers opened a heavy treadway bridge"),
  T_AIR = t5("while German aircraft"), T_33 = t5("Patton claimed thirty-three"), T_19 = t5("The official count was nineteen"),
  T_PHONE = t5("That day he telephoned Bradley"), T_SNEAK = t5("He had sneaked a division"), T_WORLD = t5("and he wanted the world told");
// ---------- geography (map px) ----------
const RH = GD.fronts.rhine, NIE = L(49.870, 8.338), OPN = L(49.855, 8.359), GGR = L(49.921, 8.484), TRE = L(49.927, 8.408), GUN = L(49.80, 8.35);
const CEN = [1610, 965];
const xAt = (y) => { for (let j = 1; j < RH.length; j++) if (RH[j][1] >= y) { const a = RH[j - 1], b = RH[j], k = (y - a[1]) / (b[1] - a[1]); return a[0] + (b[0] - a[0]) * k; } return RH[RH.length - 1][0]; };
const cut = (y0, y1) => { const out = [[xAt(y0), y0]]; RH.forEach((p) => { if (p[1] > y0 && p[1] < y1) out.push(p); }); out.push([xAt(y1), y1]); return out; };
const arc = (yN, yS, n = 24) => { const pN = [xAt(yN), yN], pS = [xAt(yS), yS], aN = Math.atan2(pN[1] - CEN[1], pN[0] - CEN[0]), aS = Math.atan2(pS[1] - CEN[1], pS[0] - CEN[0]);
  const rN = Math.hypot(pN[0] - CEN[0], pN[1] - CEN[1]), rS = Math.hypot(pS[0] - CEN[0], pS[1] - CEN[1]);
  return [...Array(n + 1)].map((_, k) => { const f = k / n, a = aN + (aS - aN) * f, r = rN + (rS - rN) * f; return [CEN[0] + r * Math.cos(a), CEN[1] + r * Math.sin(a)]; }); };
const ARC_S = arc(880, 1035), ARC_B = arc(272, 1590);
const NB = [1505, 885], NE = [1590, 868], OB = [1655, 1045], OE = [1742, 992];       // crossing sites: Nierstein (K Co), Oppenheim (A + B Cos)
const BR0 = [1672, 1027], BR1 = [1722, 993];                                          // the treadway bridge at Oppenheim
// ---------- base layers: the Rhine ribbon + living map, emblem on the east bank ----------
ribbon(RH, 30);
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 }); LV.scaleBar(12.31); LV.north();
emblem(2560, 1180, 90);
// ---------- camera ----------
const C0 = [1600, 860, 0.72], CBEND = [1500, 900, 1.5], C22 = [1560, 920, 1.35], CCUB = [1380, 820, 0.9], C3 = [1650, 840, 0.7], CDIF = [1600, 950, 1.1],
  CN = [1590, 935, 1.75], CUP = [1675, 990, 1.85], CMN = [1620, 950, 1.4], CDW = [1640, 960, 1.25], CW = [1760, 880, 0.7], CK = [1980, 700, 0.95],
  CBR = [1700, 1005, 1.65], CAIR = [1700, 990, 1.25];
camera([[0, ...C0], [T_ENG - 0.6, ...C0], [T_500 + 0.4, ...CBEND], [T_MOR, ...CBEND], [T_EDDY + 0.4, ...C22], [T_CUB - 0.4, ...C22], [T_CUB + 1.6, ...CCUB],
  [T_NOEXP - 0.2, ...CCUB], [T_NOEXP + 1.8, ...C3], [T_DIFF, ...C3], [T_DIFF + 1.6, ...CDIF], [T_BOATS - 0.3, ...CDIF], [T_BOATS + 1.8, ...CN],
  [T_UP - 0.3, ...CN], [T_UP + 1.4, ...CUP], [T_LIT, ...CUP], [T_LIT + 1.8, ...CMN], [T_MORN + 0.4, ...CMN], [T_MORN + 2.2, ...CDW], [T_DEEP, ...CDW],
  [T_DEEP + 2.0, ...CW], [T_CA, ...CW], [T_KES + 0.6, ...CK], [T_LATE23 - 0.4, ...CK], [T_TREAD + 0.6, ...CBR], [T_AIR + 0.6, ...CAIR], [END, CAIR[0] - 20, CAIR[1], 1.2]]);
B.showDate(0.05); B.date("21 MARCH 1945", 0.1, T_MOR, 32); B.date("22 MARCH 1945 · MORNING", T_MOR + 0.05, T_BOATS, 32);
B.date("22 MARCH 1945 · NIGHT", T_BOATS + 0.05, T_MORN, 32); B.date("23 MARCH 1945 · DAWN", T_MORN + 0.05, T_LATE23, 32); B.date("23 MARCH 1945", T_LATE23 + 0.05, null, 32);
legend(0.2, END + 1, true);
// flags: US on the west bank, Germany on the east bank, at fixed screen spots for each camera hold (both on every shot)
const FLS = [[0, T_ENG - 0.2, C0], [T_500 + 0.4, T_CUB - 0.2, CBEND], [T_CUB + 1.6, T_NOEXP + 1.4, CCUB], [T_NOEXP + 1.8, T_DIFF + 1.2, C3],
  [T_DIFF + 1.6, T_BOATS + 1.2, CDIF], [T_BOATS + 1.8, T_UP + 1.0, CN], [T_UP + 1.4, T_LIT + 1.4, CUP], [T_LIT + 1.8, T_MORN + 1.8, CMN],
  [T_MORN + 2.2, T_DEEP + 1.6, CDW], [T_DEEP + 2.0, T_CA + 0.2, CW], [T_KES + 0.6, T_TREAD + 0.4, CK], [T_TREAD + 0.6, T_AIR + 0.2, CBR], [T_AIR + 0.6, END + 1, CAIR]];
FLS.forEach(([a, b, c]) => { const us = W2(c, 300, 600), de = W2(c, 1660, 480); flagS(FL.us, "UNITED STATES", ...us, a + 0.15, b); flagS(FL.de, "GERMANY", ...de, a + 0.25, b); });
town("GROSS-GERAU", GGR, "r", 0.4); town("TREBUR", TRE, "r", 0.45);
const lNie = boxS("NIERSTEIN", NIE[0] - 150, NIE[1] - 34, 0.5, null, { size: 15 }), lOpp = boxS("OPPENHEIM", OPN[0] - 120, OPN[1] + 40, 0.55, null, { size: 15 });
region("RHINE", [1585, 560], 0.6, T_BOATS, 26, "rgba(170,210,240,0.9)");
// ---------- fronts (option 2): the river, then the bridgehead ----------
const RIV = [[0.2, T_ENG - 0.2, 0.72], [T_ENG - 0.4, T_CUB + 0.2, 1.45], [T_CUB, T_DIFF + 0.4, 0.8], [T_DIFF + 0.2, T_BOATS + 0.6, 1.1], [T_BOATS + 0.4, T_JAC + 0.4, 1.75]];
RIV.forEach(([a, b, s], k) => fset([RH], s, a, b, k ? 0.01 : 1.4));
// first boats ashore: the bridgehead begins (small arc), the river splits
fset([cut(-20, 880), ARC_S, cut(1035, 1650)], 1.75, T_JAC + 0.2, T_UP + 0.6, 0.6);
fset([cut(-20, 880), ARC_S, cut(1035, 1650)], 1.85, T_UP + 0.4, T_LIT + 1.0, 0.01);
fset([cut(-20, 880), ARC_S, cut(1035, 1650)], 1.3, T_LIT + 0.8, T_DEEP + 0.8, 0.01);
// within a day: more than 5 miles deep
fset([cut(-20, 272), ARC_B, cut(1590, 1650)], 0.7, T_DEEP + 0.6, T_KES + 1.0, 1.4);
fset([cut(-20, 272), ARC_B, cut(1590, 1650)], 0.95, T_KES + 0.8, T_LATE23 - 0.2, 0.01);
fset([cut(-20, 272), ARC_B, cut(1590, 1650)], 1.4, T_LATE23 - 0.4, END + 1, 0.01);
GG.polygon([...ARC_B, ...cut(272, 1590).reverse()], "rgba(110,160,255,0.16)", T_DEEP + 0.8, END + 1);
// ======================= move3-2: the Palatinate sweep, the boats hidden, the order for tonight =======================
const BPT = badge({ name: "GEORGE S. PATTON", role: "THIRD ARMY · CROSS FIRST", initials: "GSP", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "bl", t: 0.1, until: T_5ID - 0.2 });
[[[0, 560], [700, 640], [1300, 760]], [[0, 980], [700, 960], [1350, 960]], [[0, 1400], [700, 1330], [1420, 1220]]].forEach((pts, k) =>
  arw({ side: "carth", pts, width: AW(0.72, 16), t: T_SWEPT + k * 0.4, dur: 2.4, until: T_ENG }));
unitS("d5", "carth", [300, 960], "infantry", "5TH INF DIV", { t: 0.3, size: "XX" });
unitS("d90", "carth", [300, 560], "infantry", "90TH INF DIV", { t: 0.4, size: "XX" });
unitS("a4", "carth", [300, 1380], "tank", "4TH ARMD", { t: 0.5, size: "XX" });
B.move("d5", T_SWEPT + 0.4, 3, 1300, 950); B.move("d90", T_SWEPT + 0.6, 3, 1180, 640); B.move("a4", T_SWEPT + 0.8, 3, 1200, 1300);
unitS("gx1", "rome", [1850, 640], "infantry", "", { t: 0.4, size: "III" }); unitS("gx2", "rome", [2050, 1250], "infantry", "", { t: 0.5, size: "II" });
shoot([1980, 740], [1450, 820], 1.4, { r: 6, h: 60, dur: 1.0 }); shoot([2050, 1230], [1480, 1150], 3.2, { r: 6, h: 60, dur: 1.0 });
placeCard("THIRD ARMY", "5TH INFANTRY DIVISION", "left:70px;top:150px;", T_5ID - 0.1, T_ENG - 0.2);
tickCard("CONQUEROR OF", 22, "left:70px;top:290px;", T_22R - 0.3, 1.2, T_ENG - 0.2, { suffix: " RIVERS", col: "#5b8fe8" });
// ~500 boats hidden in the bight among the trees
const BEND = [[1520, 925], [1545, 945], [1570, 962], [1530, 975], [1590, 988], [1560, 1005], [1620, 1012], [1500, 955], [1585, 1030]];
BEND.forEach((p, k) => boat([p, p], T_500 + k * 0.18, 0, T_BOATS + 1.6, { n: 0, col: "#1f4fc4" }));
tickCard("ASSAULT BOATS", 500, "left:70px;top:150px;", T_500 - 0.2, 1.6, T_MOR - 0.2, { pre: "~", col: "#5b8fe8", sub: "AND 7,500 ENGINEERS" });
[[[1000, 980], [1250, 975], [1480, 990]], [[1000, 1040], [1260, 1030], [1500, 1035]]].forEach((pts, k) => { const v = vehicle(pts, T_NAVY - 0.2 + k * 0.6, 2.6, T_MOR, { s: 16, lights: false }); });
wstampS("NAVY LANDING CRAFT · ON TRUCKS", 1150, 1120, T_NAVY + 0.3, T_HID + 1.6, "#9fc0ea", 18);
[[1505, 935], [1535, 960], [1560, 985], [1595, 1005], [1515, 990], [1550, 1030], [1610, 990], [1485, 970]].forEach((p, k) => brush(p[0], p[1], T_HID + k * 0.12, T_BOATS + 1.6, 40));
wstampS("HIDDEN · TWO DAYS", 1300, 800, T_HID + 1.0, T_MOR + 0.8, "#c9e3a8", 22);
// 22 March, morning: Eddy -> Irwin: tonight
nameCard("GEN. MANTON EDDY", "XII CORPS", "left:70px;top:150px;", T_EDDY - 0.2, T_NOTH - 0.2);
nameCard("GEN. S. LEROY IRWIN", "5TH INFANTRY DIVISION", "left:70px;top:270px;", T_IRW - 0.2, T_NOTH - 0.2);
sstamp("TONIGHT", 160, T_NIGHT + 0.1, { size: 60, color: "#8fb4ff", until: T_PROT + 0.4 });
B.caption("IRWIN: SOME SORT OF BRIDGEHEAD", T_PROT + 0.1, T_NOTH + 0.4, "carth");
badge({ name: "GEORGE S. PATTON", role: "NOTHING MORE NEEDED", initials: "GSP", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "bl", t: T_NOTH - 0.1, until: T_CUB - 0.2 });
tickCard("RIVER NUMBER", 23, "left:70px;top:150px;", T_23R - 0.2, 0.9, T_CUB - 0.2, { col: "#5b8fe8", sub: "FOR THE 5TH DIVISION", n: 4 });
// the Cub idea: ~100 small spotter planes (a few icons), killed by German aircraft over the site
const CUBS = [[1050, 760], [1110, 820], [1040, 870], [1150, 900], [1080, 950], [1170, 780]];
CUBS.forEach((p, k) => cub(p[0], p[1], T_CUB + 0.6 + k * 0.15, T_NOEXP + 0.4, 1.1));
placeCard("THE CUB IDEA", "~100 SPOTTER PLANES", "left:70px;top:150px;", T_CUB + 0.4, T_NOEXP - 0.1);
raider([[2300, 500], [1500, 700], [700, 1050]], T_KILL - 1.2, 3.2, { size: 30 });
xout(1110, 860, T_KILL + 1.0, T_NOEXP + 0.4, 120);
// ======================= move3-3: the Germans did not expect it =======================
belief("THE GERMANS DID NOT EXPECT IT", "OPPENHEIM", T_NOEXP + 0.1, T_FEL - 0.1, { size: 40 });
nameCard("GEN. HANS FELBER", "GERMAN SEVENTH ARMY", "right:70px;top:150px;", T_FEL - 0.1, T_BEL - 0.2, "#c4121f");
tickCard("ORGANISED DIVISIONS", 4, "left:70px;top:150px;", T_FOUR - 0.2, 0.8, T_BEL - 0.2, { col: "#ff6b5e", sub: "ON 50 MILES OF RIVER", n: 4 });
unitS("gd1", "rome", [2150, 1250], "infantry", "", { t: T_FOUR + 0.2, size: "XX" }); unitS("gd2", "rome", [2350, 1380], "infantry", "", { t: T_FOUR + 0.4, size: "XX" });
B.move("gd1", T_SOUTH, 2.4, 2150, 1720); B.move("gd2", T_SOUTH + 0.2, 2.4, 2350, 1760);
arw({ side: "rome", pts: [[2250, 1150], [2250, 1560]], width: AW(0.7, 14), t: T_SOUTH - 0.1, dur: 1.2, until: T_DIFF });
wstampS("MOST OF THEM FAR TO THE SOUTH", 2240, 1080, T_SOUTH + 0.4, T_DIFF, "#ff8a80", 20);
belief("NOBODY CROSSES THE RHINE WITHOUT A BUILD-UP", "WHAT EVERYONE BELIEVED", T_BEL - 0.1, T_DIFF - 0.1, { size: 40 });
// three likely sites pulse; the German divisions are elsewhere
[[1470, 120], [1600, 960], [1760, 1480]].forEach((p, k) => K.target(p[0], p[1], T_BEL + 1.2 + k * 0.3, { r: 50, side: "#ff8a80", until: T_DIFF + 0.4 }));
// Patton's idea: a silent crossing straight off the march, at Nierstein - Oppenheim
const ARRS = arw({ side: "carth", pts: [[1250, 960], [1450, 940], [1640, 930]], width: AW(1.1, 18), t: T_DIFF + 0.4, dur: 1.4, until: T_BOATS + 0.4 });
boxS("NIERSTEIN · OPPENHEIM", 1600, 830, T_DIFF + 1.2, T_BRAD + 1.0, { size: 16 });
sstamp("SILENT", 840, T_SIL - 0.1, { size: 48, color: "#8fb4ff", until: T_MARCH - 0.1, shake: 2 });
sstamp("STRAIGHT OFF THE MARCH", 840, T_MARCH, { size: 48, color: "#8fb4ff", until: T_UNR - 0.1, shake: 2 });
sstamp("CATCH THEM UNREADY", 840, T_UNR, { size: 48, color: "#8fb4ff", until: T_NOART - 0.1, shake: 2 });
const GUNS = [[1250, 1150], [1320, 1200], [1220, 1230]];
GUNS.forEach((p, k) => unitS("gun" + k, "carth", p, "artillery", k ? "" : "13 BATTALIONS", { t: T_NOART - 1.4 + k * 0.1, w: 48, h: 32, size: "II" }));
B.grey(GUNS.map((_, k) => "gun" + k), T_NOART + 0.3, 0.5);
xout(1265, 1195, T_NOART + 0.3, T_BOATS, 110);
sstamp("NO ARTILLERY PREPARATION", 830, T_NOART + 0.1, { size: 54, until: T_BRAD - 0.1 });
badge({ name: "OMAR BRADLEY", role: "12TH ARMY GROUP", initials: "OB", photo: PHOTO("bradley"), flag: FL.us, side: "carth", corner: "br", t: T_BRAD - 0.1, until: T_BOATS - 0.2 });
quote("“...without even so much as an artillery preparation.”", "BRADLEY'S ANNOUNCEMENT", T_BRAD + 0.3, T_BOATS - 0.2, { size: 38 });
hideU(["gun0", "gun1", "gun2", "d90", "a4"], T_BOATS);
// ======================= move3-4: night, 22 March: the first boats =======================
GG.night(T_BOATS - 0.3, T_MORN + 0.6, { dur: 1.6, outDur: 3.0 });
const MOON = scr(`<div style="width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fffbe8,#e9e2c4 60%,#cfc6a2);box-shadow:0 0 60px 20px rgba(255,250,220,.35)"></div>`, "right:120px;top:120px;", T_MOON - 0.2, T_MORN, { autoAlpha: 0 });
clock("BOATS DUE", "22:00", "22:00", "left:70px;top:150px;", T_BOATS + 0.1, T_LATE - 0.1, 0.1);
clock("HALF AN HOUR LATE", "22:00", "22:30", "left:70px;top:150px;", T_LATE, T_JAC - 0.2, 1.4);
// K Company paddles out from Nierstein
const KP = [[[1500, 905], NB, [1548, 878], NE], [[1490, 925], [1515, 908], [1553, 893], [1596, 884]], [[1500, 872], [1520, 868], [1550, 862], [1588, 852]]];
KP.forEach((pts, k) => { boat(pts, T_K - 0.2 + k * 0.5, 4.6, T_MORN + 1, { n: 4 }); trail(pts, "#8fb2ff", 1.6, T_K + 0.1 + k * 0.5, 4.4, T_UP + 0.4, "2 7"); });
boxS("K CO · 3RD BN · 11TH INF", 1360, 830, T_K + 0.6, T_SEVEN - 0.2, { size: 14 });
nameCard("1ST LT. IRVEN JACOBS", "K COMPANY · FIRST BOAT ASHORE", "left:70px;top:270px;", T_JAC - 0.1, T_BACK + 0.6);
K.target(NE[0], NE[1], T_JAC + 0.3, { r: 16, side: "carth", until: T_UP }); SFX("hit", T_JAC + 0.4);
unitS("k", "carth", [NE[0] + 18, NE[1] - 4], "infantry", "K CO", { t: T_JAC + 0.6, size: "I", w: 44, h: 30, tag: 16 });
// seven Germans surrender and paddle themselves back, no escort
const SEV = [...Array(7)].map((_, k) => [NE[0] + 26 + (k % 4) * 10, NE[1] + 18 + Math.floor(k / 4) * 10]);
const sevEls = SEV.map((p, k) => pinS(GG.pin(`<div style="width:13px;height:13px;border-radius:50%;background:#a8a294;border:2px solid #1e1a14;box-shadow:0 0 4px rgba(0,0,0,.8)"></div>`, p[0], p[1], { t: T_SEVEN + k * 0.08, pop: true, until: T_BACK + 0.3 })));
wstampS("7 SURRENDER", NE[0] + 120, NE[1] + 50, T_SEVEN + 0.6, T_BACK + 1.6, "#d8d4c8", 18);
boat([[NE[0] + 10, NE[1] + 22], [1550, 905], [1505, 915]], T_BACK + 0.1, 3.4, T_UP + 0.6, { n: 7, grey: true, col: "#a8a294" });
wstampS("PADDLING BACK · NO ESCORT", 1440, 960, T_BACK + 1.2, T_UP + 0.4, "#d8d4c8", 18);
// farther upstream at Oppenheim: two companies cross under machine-gun fire
const OP = [[[1640, 1060], OB, [1700, 1020], OE], [[1625, 1075], [1668, 1062], [1712, 1035], [1752, 1008]]];
OP.forEach((pts, k) => { boat(pts, T_UP + 0.6 + k * 0.5, 4.6, T_MORN + 1, { n: 4 }); trail(pts, "#8fb2ff", 1.6, T_UP + 0.9 + k * 0.5, 4.4, T_LIT, "2 7"); });
boxS("A + B COMPANIES · 1ST BN", 1560, 1130, T_MG - 0.2, T_STIL + 1, { size: 14 });
unitS("mg1", "rome", [1800, 975], "infantry", "MG", { t: T_UP + 0.4, size: "", w: 40, h: 27, tag: 15 }); unitS("mg2", "rome", [1810, 1040], "infantry", "", { t: T_UP + 0.5, w: 40, h: 27 });
[0, 1.4, 2.8, 4.0].forEach((d, k) => { mg([1795, 978 + (k % 2) * 60], [1712 + k * 6, 1030 - k * 6], T_MG + d, 5, 1.2); K.impact(1708 + k * 8, 1030 - k * 7, T_MG + d + 0.4, { r: 4, puffs: 1 }); });
B.grey(["mg1", "mg2"], T_STIL + 1.0, 0.6);
nameCard("MAJ. AL STILLER", "PATTON'S AIDE · FIRST WAVE", "left:70px;top:150px;", T_STIL - 0.1, T_LIT - 0.1);
B.caption("“AT HIS OWN REQUEST” · PATTON'S DIARY", T_REQ - 0.1, T_LIT - 0.1, "carth");
quote("“a disturbing brightness”", "PATTON, ON THE MOONLIT NIGHT", T_DIST - 0.2, T_MORN - 0.1, { size: 40 });
tl.to(MOON.firstElementChild, { scale: 1.25, boxShadow: "0 0 90px 40px rgba(255,250,220,.5)", duration: 1.2, yoyo: true, repeat: 1 }, T_LIT);
// ======================= move3-5: dawn, 23 March: the bridgehead =======================
GG.dawn(T_MORN, T_DEEP + 2);
tickCard("11TH INFANTRY", 20, "left:70px;top:150px;", T_MORN + 0.2, 1.2, T_DEEP - 0.2, { col: "#5b8fe8", sub: "CASUALTIES IN THE CROSSING", n: 6 });
tickCard("PATTON'S TALLY", 28, "left:70px;top:330px;", T_28 - 0.1, 1.2, T_DEEP - 0.2, { col: "#5b8fe8", sub: "KILLED AND WOUNDED, THE WHOLE NIGHT", n: 6 });
// LCVPs and DUKWs ferry vehicles across (shuttles)
[[[1520, 905], [1595, 880]], [[1660, 1050], [1745, 1000]], [[1540, 935], [1610, 905]]].forEach((pts, k) => { for (let r = 0; r < 3; r++) boat(r % 2 ? [...pts].reverse() : pts, T_MORN + 1 + k * 0.7 + r * 3.4, 2.6, T_MORN + 1 + k * 0.7 + r * 3.4 + 3.0, { n: 0, col: "#5b8fe8" }); });
boxS("LCVPs · DUKWs", 1450, 1110, T_MORN + 1.4, T_DEEP + 1.2, { size: 14 });
B.move("k", T_MORN + 0.6, 6, 1760, 860); B.move("d5", T_MORN + 0.4, 3, 1490, 935);
unitS("b11", "carth", [1700, 1000], "infantry", "11TH INF", { t: T_MORN + 0.6, size: "III" });
B.move("b11", T_DEEP, 3, 1980, 980); hideU(["gx1", "gx2", "mg1", "mg2"], T_DEEP + 0.4); B.move("k", T_DEEP, 3, 1900, 700); B.move("d5", T_DEEP + 0.4, 3, 1800, 1300);
sstamp("MORE THAN 5 MILES DEEP", 840, T_DEEP + 1.4, { size: 50, color: "#8fb4ff", until: T_CA - 0.1 });
// the counterattack fails under Kesselring's and Hausser's eyes at Grossgerau
unitS("oc", "rome", [2300, 520], "infantry", "", { t: T_CA - 0.4, size: "III" });
arw({ side: "rome", pts: [[2290, 540], [2200, 640], [2110, 720]], width: AW(0.95, 14), t: T_CA, dur: 1.4, until: T_LATE23 });
nameCard("KESSELRING · HAUSSER", "WATCHING FROM GROSS-GERAU", "right:70px;top:150px;", T_KES - 0.1, T_LATE23 - 0.2, "#c4121f");
K.target(GGR[0], GGR[1], T_KES + 0.2, { r: 30, side: "#ff3b30", until: T_LATE23 });
shoot([1960, 820], [2130, 700], T_KES + 1.0, { r: 6, h: 30, dur: 0.8 }); shoot([1990, 760], [2160, 660], T_KES + 2.2, { r: 6, h: 30, dur: 0.8 });
B.grey(["oc"], T_KES + 3.0, 0.6); wstampS("FAILED", 2210, 620, T_KES + 3.2, T_LATE23, "#e3232f", 22);
// late on the 23rd: the heavy treadway bridge
glowPath([BR0, BR1], "#f3eee2", 7, T_TREAD - 0.2, END + 1, 1, 1, { draw: 1.6, top: true });
unitS("eng", "carth", [1640, 1060], "infantry", "ENGINEERS", { t: T_TREAD - 0.4, w: 46, h: 30, size: "II" });
boxS("TREADWAY BRIDGE", BR1[0] + 60, BR1[1] - 40, T_TREAD + 0.8, END + 1, { size: 15 });
sstamp("HEAVY TREADWAY BRIDGE · OPEN", 840, T_TREAD + 1.0, { size: 44, color: "#8fb4ff", until: T_AIR - 0.1, shake: 2 });
// German aircraft attack the bridge; AA fires (few planes, spaced; two shot down)
const AA = [[1600, 1020], [1770, 1010], [1690, 1080]];
AA.forEach((p, k) => unitS("aa" + k, "carth", p, "aa", "", { t: T_AIR - 0.4 + k * 0.1, w: 40, h: 27 }));
raider([[2500, 600], [1700, 1000], [1000, 1400]], T_AIR, 3.6, { down: T_AIR + 2.0 });
raider([[2400, 1500], [1700, 1010], [1100, 500]], T_AIR + 2.2, 3.6);
raider([[2600, 900], [1700, 1000], [900, 1100]], T_AIR + 4.6, 3.6, { down: T_AIR + 6.4 });
[0.6, 1.4, 3.0, 4.8, 5.8].forEach((d, k) => { const a = AA[k % 3]; mg(a, [a[0] + 60 - k * 25, a[1] - 90], T_AIR + d, 4, 1.4); });
K.impact(1660, 1060, T_AIR + 2.0, { r: 10 }); K.impact(1745, 965, T_AIR + 4.0, { r: 10 });
tickCard("PATTON CLAIMED", 33, "left:70px;top:150px;", T_33 - 0.2, 1.4, T_PHONE - 0.2, { col: "#c9b48a", sub: "GERMAN PLANES SHOT DOWN" });
tickCard("OFFICIAL COUNT", 19, "left:70px;top:330px;", T_19 - 0.2, 1.2, T_PHONE - 0.2, { col: "#a8a294", sub: "THE ARMY HISTORY" });
// the call to Bradley (caption, no quote marks)
phone("PATTON CALLS BRADLEY", "left:70px;top:340px;", T_PHONE - 0.1, END + 1);
badge({ name: "OMAR BRADLEY", role: "12TH ARMY GROUP", initials: "OB", photo: PHOTO("bradley"), flag: FL.us, side: "carth", corner: "tl", t: T_PHONE + 0.2, until: END + 1 });
B.caption("I SNUCK A DIVISION ACROSS · TELL THE WORLD", T_SNEAK - 0.1, END + 1, "carth");
wstampS("BEFORE MONTGOMERY", 1830, 1180, T_WORLD + 0.6, END + 1, "#8fb4ff", 24);
// the Rhine under every front band; dimmed at night
const RIB = [...OVL.querySelectorAll(".ribbon")]; [...RIB].reverse().forEach((p) => OVL.insertBefore(p, OVL.firstChild));
tl.to(RIB, { opacity: 0.6, duration: 1.6 }, T_BOATS - 0.3); tl.to(RIB, { opacity: 1, duration: 3 }, T_MORN + 0.6);
fixImgs();
B.finish();
