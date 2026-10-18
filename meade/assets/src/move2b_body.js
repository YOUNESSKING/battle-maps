// MOVE 2b (move2-2 .. move2-4), George G. Meade #12: day 1 + the fishhook, interior lines, Sickles moves forward (2 Jul ~2-3 pm).
// Basemap getty_hd_ref (z14, HD dark). Built with: python3 tools/build_scene.py move2b getty_hd_ref move2-2 move2-4
// Source: assets/src/move2b_body.js + move2_kit.js, assembled by tools/make_move2_scenes.py (edit those, not scenes-src/move2b.js).
// WIDE, option 1: getty_ctl_jul1am -> jul1 -> jul2am -> jul2s (tools/make_getty_control.py, research/FACT_NOTES_getty.md).
// Union = blue (carth), Confederate = red (rome). Flags US 34-star / CSA First National. No mileage numbers (FACT_NOTES: none sourced).
// ==== BODY
const L = GG.proj(14, 1195859, 1589921);
const P2 = "move2-2", P3 = "move2-3", P4 = "move2-4";
const T_WON = at(P2, "the Confederates won"), T_DROVE = at(P2, "drove two Union corps"), T_REY = at(P2, "John Reynolds"), T_HILLS = at(P2, "pushed the survivors"),
  T_ARR = at(P2, "Meade arrived"), T_HOOK = at(P2, "shaped like a fishhook"), T_BARB = at(P2, "The barb curled"), T_SHANK = at(P2, "the shank ran south"),
  T_RT = at(P2, "the Round Tops");
const S3 = PS(P3), T_OUT = at(P3, "wrap around the outside"), T_ARC = at(P3, "long arc of ridges"), T_IN = at(P3, "sat on the inside"),
  T_SHORT = at(P3, "far shorter distance"), T_FLANK = at(P3, "If Lee attacked"), T_FIRST = at(P3, "get help there first"), T_HQ = at(P3, "He set up his headquarters"),
  T_LYDIA = at(P3, "Lydia Leister"), T_BEHIND = at(P3, "right behind the ridge");
const S4 = PS(P4), T_PLAN = at(P4, "Lee's plan"), T_BOTH = at(P4, "attack both ends"), T_LONG = at(P4, "under James Longstreet"), T_SOUTH = at(P4, "against the southern end"),
  T_SICK = at(P4, "Dan Sickles"), T_LOW = at(P4, "did not like his position"), T_WO = at(P4, "Without orders"), T_34 = at(P4, "up to three-quarters"),
  T_PEACH = at(P4, "peach orchard"), T_WROTE = at(P4, "Meade later wrote"), T_RODE = at(P4, "When Meade rode out"), T_3PM = at(P4, "around three o'clock"),
  T_GUNS = at(P4, "Confederate guns opened"), T_LATE = at(P4, "too late to pull back");
const PX = (k) => PL[k];
// ---------- layers ----------
const CA = wimg("assets/media/getty_ctl_jul1am_mx.png", 0, 0, T_DROVE + 0.6, { mx: true, outDur: 1.2 });
const CB = wimg("assets/media/getty_ctl_jul1_mx.png", T_DROVE + 0.2, 1.4, T_ARR + 0.6, { mx: true, outDur: 1.2 });
const CC = wimg("assets/media/getty_ctl_jul2am_mx.png", T_ARR + 0.2, 1.2, T_WO + 0.8, { mx: true, outDur: 1.4 });
const CD = wimg("assets/media/getty_ctl_jul2s_mx.png", T_WO + 0.3, 1.6, null, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.16 }); LV.shimmer(GD.rivers || [], { width: 1.0 }); LV.scaleBar(7.34); LV.north();
wimg("assets/media/getty_geo_ref.png", 0, 0, null);
// ---------- camera ----------
camSet(1400, 520, 1.3);
camTo(0.1, T_HILLS - 0.3, 1420, 560, 1.38);                                  // day 1: west + north of town
camTo(T_HILLS - 0.2, 2.6, 1450, 825, 1.40);                                  // wide: the whole fishhook
camTo(S3 + 0.2, 6.0, 1440, 822, 1.42);
camTo(T_HQ - 0.4, 2.0, 1460, 800, 1.9);                                      // the Leister house
camTo(S4 - 0.2, 2.2, 1440, 830, 1.40);                                       // Lee's plan: both ends
camTo(T_SICK - 0.6, 2.4, 1385, 975, 2.25);                                   // the southern end
const KM = L(39.7990, -77.2420);                                             // = move2c opening frame (getty15 at s 1.35)
camTo(END - 2.6, 2.5, KM[0], KM[1], 2.7, "power1.inOut");
// ---------- dates, legend, flags ----------
B.showDate(0.05);
B.date("1 JULY 1863", 0.1, T_ARR - 0.3, 32); B.date("NIGHT · 1-2 JULY", T_ARR - 0.2, S3 - 0.2, 30); B.date("2 JULY · MORNING", S3 - 0.1, S4 - 0.2, 30);
B.date("2 JULY · AFTERNOON", S4 - 0.1, T_3PM - 0.3, 30); B.date("2 JULY · ~3 PM", T_3PM - 0.2, END + 1, 30);
legend(0.2, END - 1.0);
flag(FL.csa, "CONFEDERATE STATES", ...L(39.826, -77.290), 0.3, T_HILLS - 0.3, 82); flag(FL.us, "UNITED STATES", ...L(39.812, -77.190), 0.35, T_HILLS - 0.3, 82);
flag(FL.csa, "CONFEDERATE STATES", ...L(39.810, -77.263), T_HILLS, T_SICK - 0.6, 80); flag(FL.us, "UNITED STATES", ...L(39.800, -77.205), T_HILLS + 0.05, T_SICK - 0.6, 80);
flag(FL.csa, "CONFEDERATE STATES", ...L(39.7925, -77.2605), T_SICK, END - 2.4, 50); flag(FL.us, "UNITED STATES", ...L(39.8040, -77.2265), T_SICK + 0.05, END - 2.4, 50);
// ---------- move2-2: day 1 ----------
// units in the first second: Buford's cavalry on McPherson's Ridge, Heth coming down the Chambersburg Pike
unit("buf", "carth", ...L(39.8390, -77.2505), "infantry", { t: 0.2, size: "XX", label: "BUFORD", fs: 8 }); cavIcon("buf", { flip: true });
unit("heth", "rome", ...L(39.8470, -77.2800), "infantry", { t: 0.25, size: "XX", label: "HETH" });
unit("pend", "rome", ...L(39.8510, -77.2900), "infantry", { t: 0.35, size: "XX", label: "PENDER" });
go("heth", 0.4, 3.0, L(39.8420, -77.2600)); go("pend", 0.6, 3.6, L(39.8440, -77.2700));
arr([L(39.8490, -77.2880), L(39.8440, -77.2700), L(39.8400, -77.2580)], "rome", 0.3, { w: 6, dur: 1.6, until: T_HILLS });
const hp = L(39.8430, -77.2650);
[[39.8395, -77.2510], [39.8370, -77.2495], [39.8410, -77.2520]].forEach((q, k) => shoot(hp, L(...q), 0.9 + k * 0.5, { r: 6, h: 12 }));
mg(L(39.8395, -77.2515), L(39.8420, -77.2590), 2.0, 4);
// I Corps comes up from the south, XI Corps north of town; Ewell's divisions from the north
unit("ic", "carth", ...L(39.8290, -77.2360), "infantry", { t: 1.4, size: "XXX", label: "I CORPS" }); go("ic", 1.6, 2.0, L(39.8365, -77.2465));
unit("xi", "carth", ...L(39.8320, -77.2310), "infantry", { t: T_WON + 0.4, size: "XXX", label: "XI CORPS" }); go("xi", T_WON + 0.5, 1.8, L(39.8430, -77.2310));
unit("rod", "rome", ...L(39.8620, -77.2480), "infantry", { t: T_WON + 0.2, size: "XX", label: "RODES" }); go("rod", T_WON + 0.4, 2.4, L(39.8480, -77.2430));
unit("ear", "rome", ...L(39.8640, -77.2060), "infantry", { t: T_WON + 0.5, size: "XX", label: "EARLY" }); go("ear", T_WON + 0.7, 2.6, L(39.8480, -77.2230));
arr([L(39.8640, -77.2480), L(39.8500, -77.2440)], "rome", T_WON + 0.3, { w: 6, dur: 1.2, until: T_HILLS + 1 });
arr([L(39.8660, -77.2040), L(39.8500, -77.2210)], "rome", T_WON + 0.6, { w: 6, dur: 1.2, until: T_HILLS + 1 });
const ep = L(39.8500, -77.2250), rp = L(39.8480, -77.2440);
shoot(ep, L(39.8440, -77.2300), T_WON + 1.4, { r: 6 }); shoot(rp, L(39.8410, -77.2350), T_WON + 1.8, { r: 6 }); shoot(hp, L(39.8365, -77.2470), T_WON + 2.2, { r: 6 });
mg(L(39.8470, -77.2240), L(39.8435, -77.2300), T_WON + 2.0, 4);
place("mcpherson_ridge", 0.8, { dx: -70, dy: 4, until: T_HILLS }); place("oak_hill", T_WON + 0.6, { dx: 0, dy: -12, until: T_HILLS }); place("seminary", 1.0, { dx: -78, dy: 10, until: T_HILLS });
// Reynolds killed (small stamp + badge)
badge({ name: "JOHN REYNOLDS", role: "I CORPS · KILLED 1 JULY", photo: "assets/media/reynolds_head.png", flag: FL.us, side: "carth", corner: "tl", t: T_REY - 0.6, until: T_HILLS + 0.8 });
mstamp("REYNOLDS KILLED", ...L(39.8345, -77.2475), T_REY - 0.1, { size: 12, until: T_HILLS + 0.6 });
// the Union lines break back through the town to Cemetery Hill
const TOWN = [L(39.8330, -77.2330), L(39.8300, -77.2315), L(39.8250, -77.2312)];
B.hideUnits(["buf"], T_DROVE - 0.2);
follow("ic", [ux("ic"), L(39.8340, -77.2400), ...TOWN, L(39.8212, -77.2265)], T_DROVE, 3.2, "power1.inOut");
follow("xi", [ux("xi"), L(39.8360, -77.2310), ...TOWN, L(39.8222, -77.2300)], T_DROVE + 0.2, 3.2, "power1.inOut");
arr([L(39.8380, -77.2450), L(39.8320, -77.2340), L(39.8230, -77.2300)], "carth", T_DROVE, { w: 6, dur: 1.8, until: T_ARR });
arr([L(39.8430, -77.2310), L(39.8320, -77.2310), L(39.8235, -77.2290)], "carth", T_DROVE + 0.3, { w: 6, dur: 1.8, until: T_ARR });
go("rod", T_DROVE + 0.6, 3.0, L(39.8285, -77.2360)); go("ear", T_DROVE + 0.8, 3.0, L(39.8275, -77.2265)); go("heth", T_DROVE + 0.6, 3.0, L(39.8330, -77.2480)); go("pend", T_DROVE + 0.6, 3.0, L(39.8250, -77.2470));
arr([L(39.8450, -77.2400), L(39.8300, -77.2340)], "rome", T_DROVE + 0.8, { w: 6, dur: 1.4, until: T_ARR });
const TT = tag("THROUGH THE TOWN", ...L(39.8350, -77.2200), T_DROVE + 0.9, RED, 10, T_ARR);
K.target(...PX("cemetery_hill"), T_HILLS, { r: 22, side: "#ffd54a", until: T_ARR + 0.5 });
place("cemetery_hill", T_HILLS + 0.1, { dx: -64, dy: -6, until: S4 - 0.3 });
// night 1-2 July: Meade arrives at 1 a.m.
GG.night(T_ARR - 0.6, S3 - 0.2, { dur: 1.2, outDur: 1.6 });
clockCard("1 A.M. · MEADE ARRIVES", "left:110px;top:170px;", T_ARR - 0.2, T_HOOK + 0.4);
badge({ name: "GEORGE G. MEADE", role: "ARMY OF THE POTOMAC", photo: "assets/media/meade_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_ARR - 0.3, until: T_BARB });
// the fishhook lights up; corps take their places along it (positions 2 Jul morning: ABT / NPS maps)
B.hideUnits(["ic", "xi"], T_HOOK - 0.4);
const HOOK = glowLine(GD.lines.union_hook_jul2, "#4f86ff", 3.2, T_HOOK - 0.3, S4 - 0.3, { dur: 2.2, pulse: 4 });
const UN = [["u12", 39.8170, -77.2190, "XII"], ["u1", 39.8212, -77.2232, "I"], ["u11", 39.8228, -77.2310, "XI"], ["u2", 39.8115, -77.2352, "II"], ["u3", 39.7995, -77.2352, "III"], ["u5", 39.8085, -77.2205, "V"]];
UN.forEach(([id, la, lo, lb], i) => unit(id, "carth", ...L(la, lo), "infantry", { t: T_HOOK + 0.2 + i * 0.12, size: "XXX", label: lb + " CORPS", fs: 8 }));
const FH = tag("THE FISHHOOK", ...L(39.8040, -77.2230), T_HOOK + 0.3, BLUE, 14, S3 + 2.0);
place("culps_hill", T_BARB, { dx: 48, dy: -2, until: S4 - 0.3 });
K.target(...PX("culps_hill"), T_BARB, { r: 18, side: "#7fb0ff", until: T_SHANK });
K.target(...PX("cemetery_hill"), T_BARB + 0.5, { r: 18, side: "#7fb0ff", until: T_SHANK });
const CR = place("cemetery_ridge", T_SHANK + 0.2, { dx: 58, dy: 0, dot: false, until: S4 - 0.3 });
glowLine([L(39.8170, -77.2347), L(39.8060, -77.2362), L(39.7960, -77.2361)], "#8fb8ff", 2.0, T_SHANK, T_RT + 1.6, { dur: 1.4 });
place("little_round_top", T_RT - 0.3, { dx: 60, dy: 0 }); place("big_round_top", T_RT, { dx: 56, dy: 6 });
// ---------- move2-3: interior lines ----------
GG.dawn(S3 - 0.2, S3 + 3.0);
const CS = [["j", 39.8200, -77.2115, "JOHNSON"], ["e", 39.8268, -77.2262, "EARLY"], ["r", 39.8276, -77.2372, "RODES"], ["p", 39.8215, -77.2470, "PENDER"], ["a", 39.8095, -77.2515, "ANDERSON"], ["h", 39.8310, -77.2540, "HETH"]];
B.hideUnits(["rod", "ear", "heth", "pend"], T_OUT - 0.4);
CS.forEach(([id, la, lo, lb], i) => unit("cs" + id, "rome", ...L(la, lo), "infantry", { t: T_OUT - 0.3 + i * 0.1, size: "XX", label: lb, fs: 8 }));
const ARC = glowLine(GD.lines.csa_arc_jul2, "#ff5a4f", 3.0, T_ARC - 0.4, T_FLANK + 1.0, { dur: 2.4, core: "#ffe0d8", pulse: 2 });
const OUTT = tag("LEE: THE OUTSIDE OF THE HOOK", ...L(39.8150, -77.2700), T_ARC, RED, 11, T_FLANK + 0.8);
const INT = tag("MEADE: THE INSIDE", ...L(39.8090, -77.2275), T_IN, BLUE, 11, T_FLANK + 0.8);
// the race: same speed, blue along the short chord, red along the long outer arc
const CHD = GD.lines.chord, OUT = GD.lines.outer_arc, lc = cumOf(CHD), lo2 = cumOf(OUT);
const vR = lo2[lo2.length - 1] / 6.0, durB = lc[lc.length - 1] / vR;
unit("rb", "carth", ...CHD[0], "infantry", { t: T_SHORT - 0.6, w: 22, h: 15 }); unit("rr", "rome", ...OUT[0], "infantry", { t: T_SHORT - 0.6, w: 22, h: 15 });
glowLine(CHD, "#4f86ff", 2.4, T_SHORT - 0.2, T_FIRST + 2.5, { dur: durB, ease: "none" }); glowLine(OUT, "#ff5a4f", 2.4, T_SHORT - 0.2, T_FIRST + 2.5, { dur: 6.0, ease: "none", core: "#ffe0d8" });
follow("rb", CHD, T_SHORT - 0.2, durB); follow("rr", OUT, T_SHORT - 0.2, 6.0);
clockCard("THE RACE", "left:110px;top:170px;", T_SHORT - 0.4, T_SHORT + 6.4);
K.target(...CHD[CHD.length - 1], T_SHORT - 0.2 + durB, { r: 22, side: "#7fb0ff", until: T_SHORT + 6.4 }); SFX("hit", T_SHORT - 0.1 + durB);
const ARRV = tag("ARRIVES FIRST", CHD[CHD.length - 1][0] + 52, CHD[CHD.length - 1][1] + 26, T_SHORT - 0.1 + durB, BLUE, 12, T_SHORT + 6.4);
B.hideUnits(["rb", "rr"], T_SHORT + 6.2);
sstamp("INTERIOR LINES", 820, T_FIRST - 0.6, { size: 52, color: "#5b8cff", rot: -3, sub: "THE SHORT WAY ROUND IS ON THE INSIDE", until: T_HQ - 0.2 });
// if Lee attacks one flank: help gets there first
arr([L(39.8000, -77.2560), L(39.7950, -77.2440)], "rome", T_FLANK + 0.1, { w: 6, dur: 1.0, until: T_HQ });
arr([L(39.8150, -77.2300), L(39.8050, -77.2330), L(39.7965, -77.2380)], "carth", T_FIRST - 0.6, { w: 6, dur: 1.0, until: T_HQ });
arr([L(39.8080, -77.2215), L(39.8010, -77.2300), L(39.7950, -77.2370)], "carth", T_FIRST - 0.4, { w: 6, dur: 1.0, until: T_HQ });
// headquarters: the Leister house behind the ridge
const LH = PX("leister");
GG.pin(HQF, LH[0], LH[1], { t: T_HQ - 0.2, until: END + 1 }); SFX("ref:pop", T_HQ - 0.1);
place("leister", T_HQ, { dx: 52, dy: 14, txt: "LEISTER HOUSE", until: S4 + 4.0 });
badge({ name: "GEORGE G. MEADE", role: "HQ · THE LEISTER HOUSE", photo: "assets/media/meade_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_HQ - 0.3, until: S4 - 0.3 });
const LYD = tag("WIDOW LYDIA LEISTER'S FARMHOUSE", LH[0] + 40, LH[1] + 34, T_LYDIA - 0.2, "#7a6420", 9, S4 - 0.3);
K.target(LH[0], LH[1], T_BEHIND - 0.3, { r: 14, side: "#ffd54a", until: S4 });
// ---------- move2-4: Lee's plan, Sickles moves forward ----------
badge({ name: "ROBERT E. LEE", role: "ARMY OF NORTHERN VIRGINIA", photo: "assets/media/lee_head.png", flag: FL.csa, side: "rome", corner: "tl", t: T_PLAN - 0.4, until: T_LONG - 0.2 });
arr([L(39.8215, -77.2090), L(39.8195, -77.2175)], "rome", T_BOTH, { w: 6, dur: 1.0, dash: "5 8", until: T_SICK });
// Longstreet: two divisions come round to Warfield Ridge (the long way, out of sight)
unit("hood", "rome", ...L(39.8300, -77.2650), "infantry", { t: T_LONG - 0.2, size: "XX", label: "HOOD", fs: 7 });
unit("mcl", "rome", ...L(39.8330, -77.2620), "infantry", { t: T_LONG - 0.1, size: "XX", label: "McLAWS", fs: 7 });
follow("hood", [L(39.8300, -77.2650), L(39.8100, -77.2650), L(39.7960, -77.2580), L(39.7930, -77.2555)], T_LONG, 3.2, "power1.inOut");
follow("mcl", [L(39.8330, -77.2620), L(39.8150, -77.2620), L(39.8030, -77.2570), L(39.8025, -77.2545)], T_LONG + 0.2, 3.2, "power1.inOut");
badge({ name: "JAMES LONGSTREET", role: "THE MAIN BLOW", photo: "assets/media/longstreet_head.png", flag: FL.csa, side: "rome", corner: "tl", t: T_LONG - 0.1, until: T_SICK - 0.2 });
arr([L(39.8150, -77.2700), L(39.7980, -77.2620), L(39.7930, -77.2470)], "rome", T_SOUTH - 0.3, { w: 10, dur: 1.4, dash: "6 9", until: T_SICK + 0.6 });
B.caption("LEE'S PLAN: HIT BOTH ENDS · THE HEAVIEST BLOW IN THE SOUTH", T_BOTH - 0.2, T_SICK - 0.2, "r");
// Sickles's III Corps leaves its place on the ridge
badge({ name: "DANIEL SICKLES", role: "III CORPS", photo: "assets/media/sickles_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_SICK - 0.3, until: T_RODE - 0.3 });
B.hideUnits(["u3"], T_WO - 0.3);
unit("bir", "carth", ...L(39.7975, -77.2356), "infantry", { t: T_WO - 0.4, size: "XX", label: "BIRNEY", fs: 7 });
unit("hum", "carth", ...L(39.8040, -77.2360), "infantry", { t: T_WO - 0.35, size: "XX", label: "HUMPHREYS", fs: 7 });
const RS = glowLine(GD.lines.ridge_south, "#8fb8ff", 2.2, T_LOW - 0.2, T_WO + 0.4, { dur: 1.0 });
place("peach_orchard", T_LOW, { dx: 58, dy: 14, until: END + 1 }); place("wheatfield", T_LOW + 0.2, { dx: 54, dy: -6, until: END + 1 }); place("devils_den", T_LOW + 0.4, { dx: -48, dy: 10, until: END + 1 });
go("bir", T_WO, 2.6, L(39.7932, -77.2448)); go("hum", T_WO + 0.15, 2.6, L(39.8068, -77.2462));
tArrow([L(39.7975, -77.2370), L(39.7955, -77.2410), L(39.7938, -77.2438)], BLUE, T_WO, T_RODE, 2.6);
tArrow([L(39.8040, -77.2372), L(39.8055, -77.2420), L(39.8065, -77.2448)], BLUE, T_WO + 0.15, T_RODE, 2.6);
const SL = glowLine(GD.lines.sickles_jul2, "#4f86ff", 2.6, T_WO + 1.4, END + 1, { dur: 1.6, pulse: 6 });
sstamp("WITHOUT ORDERS", 760, T_WO + 0.1, { size: 54, rot: -5, until: T_PEACH + 0.6 });
K.target(...PX("peach_orchard"), T_PEACH - 0.2, { r: 20, side: "#ffd54a", until: END });
// the hole left on southern Cemetery Ridge
const RS2 = glowLine(GD.lines.ridge_south, "#ff5a4f", 1.6, T_34 - 0.3, END + 1, { dash: "4 6", core: "#ffd0c8" });
hole(...L(39.7990, -77.2362), T_34 - 0.2, END + 1, 20);
const GAPT = tag("A HOLE IN THE LINE", ...L(39.7985, -77.2300), T_34, RED, 10, END + 1);
B.caption("UP TO 3/4 MILE FORWARD", T_34 - 0.1, T_WROTE - 0.2, "carth");
quote("“not fully apprehending the instructions”", "MEADE, OFFICIAL REPORT, OF SICKLES", "left:110px;top:620px;", T_WROTE - 0.2, T_RODE + 0.2);
// ~3 pm: Meade rides out; the Confederate guns open while they talk
const MR = GG.pin(HQF, LH[0], LH[1], { t: T_RODE - 0.3, until: END + 1 });
tl.to(MR, { left: L(39.8000, -77.2470)[0], top: L(39.8000, -77.2470)[1] - 14, duration: 2.6, ease: "power1.inOut" }, T_RODE);
tArrow([LH, L(39.8060, -77.2400), L(39.8005, -77.2462)], BLUE, T_RODE, END, 1.8, { dash: "4 5" });
badge({ name: "GEORGE G. MEADE", role: "RIDES OUT TO SICKLES", photo: "assets/media/meade_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_RODE - 0.1, until: END - 0.4 });
clockCard("~3 P.M.", "left:110px;top:170px;", T_3PM - 0.3, T_LATE + 0.4);
const GUNS = [[39.7960, -77.2560], [39.8000, -77.2555], [39.8040, -77.2545], [39.8085, -77.2530]];
GUNS.forEach((q, i) => unit("g" + i, "rome", ...L(...q), "artillery", { t: T_GUNS - 1.2 + i * 0.08, w: 24, h: 16 }));
const TGT = [[39.8010, -77.2488], [39.7965, -77.2462], [39.8005, -77.2478], [39.7945, -77.2448], [39.8060, -77.2462], [39.8015, -77.2495], [39.7970, -77.2470], [39.8040, -77.2468]];
TGT.forEach((q, k) => { const g = ux("g" + (k % 4)); shoot([g[0] + 6, g[1] - 4], L(...q), T_GUNS - 0.2 + k * 0.42, { r: 6, h: 12 }); });
B.caption("TOO LATE TO PULL BACK", T_LATE - 0.2, END + 1, "r");
K.raiseTerritory();
B.finish();
