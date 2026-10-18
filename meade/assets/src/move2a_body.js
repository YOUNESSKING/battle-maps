// MOVE 2a (move2-1), George G. Meade #12: Lee invades the North, Meade takes command (28 Jun 1863), the armies converge on Gettysburg.
// Basemap penn_hd_ref (z9, HD dark). Built with: python3 tools/build_scene.py move2a penn_hd_ref move2-1 move2-1
// Source: assets/src/move2a_body.js + move2_kit.js, assembled by tools/make_move2_scenes.py (edit those, not scenes-src/move2a.js).
// WIDE, option 1: move2a_ctl_may63_mx (tools/make_move2a_control.py: May 1863, Union lower Valley + north of the Rappahannock) ->
// penn_ctl_jun63_mx (HOOK agent, read-only) (~28 Jun: Lee's army in the Valley, Maryland and Pennsylvania). Union = blue (carth), Confederate = red (rome).
// Facts: research/FACT_NOTES.md (Move 2; ABT strengths 93,921 vs 71,699 -> "~94,000" / "~72,000"), research/FACT_NOTES_penn.md.
// ==== BODY
const L = GG.proj(9, 35842, 49095);
const P1 = "move2-1";
const T_MAY = at(P1, "In May"), T_CHANC = at(P1, "at Chancellorsville"), T_NORTH = at(P1, "Then he marched north"), T_POT = at(P1, "across the Potomac"),
  T_PA = at(P1, "deep into Pennsylvania"), T_72 = at(P1, "seventy-two thousand"), T_28 = at(P1, "On the twenty-eighth"), T_LINC = at(P1, "Lincoln replaced"),
  T_HOOK = at(P1, "Joseph Hooker"), T_MEADE = at(P1, "with Meade"), T_94 = at(P1, "ninety-four thousand"), T_SPREAD = at(P1, "spread out across Maryland"),
  T_NOTIME = at(P1, "no time to learn"), T_3D = at(P1, "Three days later"), T_COLL = at(P1, "collided"), T_GB = at(P1, "called Gettysburg");
// ---------- layers ----------
const C0 = wimg("assets/media/move2a_ctl_may63_mx.png", 0, 0, T_POT + 0.4, { mx: true, outDur: 1.2 });
const C1 = wimg("assets/media/penn_ctl_jun63_mx.png", T_POT, 1.2, null, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.18 }); LV.shimmer(GD.rivers || [], { width: 1.2 }); LV.scaleBar(236.26); LV.north();
wimg("assets/media/penn_geo_ref.png", 0, 0, null);
// ---------- camera ----------
camSet(1500, 900, 1.05);
camTo(0.2, T_POT - 0.2, 1490, 860, 1.12);                                  // Virginia -> Pennsylvania, slow drift
camTo(T_28 - 0.6, 2.2, 1540, 760, 1.55);                                   // Maryland: Frederick, the spread-out army
camTo(T_3D - 0.2, 3.0, 1560, 660, 2.2);                                    // the converging roads
camTo(END - 1.9, 1.85, 1575, 612, 3.6, "power2.in");                       // dive onto Gettysburg (cut to move2b's wide getty frame)
// ---------- date, legend, flags, labels ----------
B.showDate(0.05);
B.date("MAY 1863", 0.1, T_NORTH - 0.2, 32); B.date("JUNE 1863", T_NORTH - 0.1, T_28 - 0.2, 32); B.date("28 JUNE 1863", T_28 - 0.1, T_3D - 0.2, 32);
B.date("1 JULY 1863", T_3D - 0.1, END + 1, 32);
legend(0.2, END - 1.6);
flag(FL.csa, "CONFEDERATE STATES", ...L(38.62, -78.55), 0.3, T_28 - 0.4, 105); flag(FL.us, "UNITED STATES", ...L(39.10, -76.30), 0.35, T_28 - 0.4, 105);
flag(FL.csa, "CONFEDERATE STATES", ...L(39.20, -78.30), T_28 - 0.2, T_3D + 0.2, 72); flag(FL.us, "UNITED STATES", ...L(39.05, -76.95), T_28 - 0.15, T_3D + 0.2, 72);
flag(FL.csa, "CONFEDERATE STATES", ...L(39.93, -77.52), T_3D + 0.4, END - 1.6, 50); flag(FL.us, "UNITED STATES", ...L(39.60, -77.02), T_3D + 0.45, END - 1.6, 50);
const GB = [L(39.831, -77.231)][0];
B.city("", GB[0], GB[1], { r: 3, t: 0.6 });
const GBL = box("GETTYSBURG", GB[0] + 2, GB[1] - 13, 0.6, 9, null, false);
const VL = box("SHENANDOAH VALLEY", ...L(38.95, -78.45), 1.0, 8, T_28 - 0.3, false);
// ---------- move2-1 ----------
B.title("MOVE 2", "GETTYSBURG", "2 JULY 1863", 0.3, 3.3); SFX("ref:boom", 0.4);
// units on screen in the first second: Lee's three corps on the Rappahannock, Hooker's army opposite
const CHV = L(38.311, -77.634);
unit("lng", "rome", ...L(38.36, -77.80), "infantry", { t: 0.4, size: "XXX", label: "LONGSTREET", w: 40, h: 27, fs: 10 });
unit("ewl", "rome", ...L(38.42, -77.95), "infantry", { t: 0.48, size: "XXX", label: "EWELL", w: 40, h: 27, fs: 10 });
unit("hil", "rome", ...L(38.25, -77.62), "infantry", { t: 0.56, size: "XXX", label: "A.P. HILL", w: 40, h: 27, fs: 10 });
unit("aop", "carth", ...L(38.46, -77.42), "infantry", { t: 0.5, size: "XXXX", label: "ARMY OF THE POTOMAC", w: 44, h: 30, fs: 10 });
// Chancellorsville: a burst and the tag
K.impact(CHV[0], CHV[1], T_CHANC - 0.2, { r: 12, puffs: 3 }); K.impact(CHV[0] + 14, CHV[1] - 6, T_CHANC + 0.15, { r: 9, puffs: 2 });
const CHT = tag("CHANCELLORSVILLE · LEE WINS AGAIN", CHV[0] - 90, CHV[1] - 96, T_CHANC, RED, 11, T_NORTH + 1.2);
// the march north: down the Shenandoah, across the Potomac at Williamsport, into Pennsylvania
const ROUTE = [L(38.47, -78.00), L(38.80, -78.20), L(39.10, -78.10), L(39.45, -77.92), L(39.60, -77.80), L(39.75, -77.70), L(39.94, -77.66)];
arr(ROUTE, "rome", T_NORTH - 0.2, { w: 11, dur: 3.2, until: T_3D });
follow("ewl", [ux("ewl"), ...ROUTE, L(40.10, -77.40), L(40.20, -77.19)], T_NORTH, 6.5, "power1.inOut");
follow("lng", [ux("lng"), ...ROUTE, L(39.90, -77.62)], T_NORTH + 0.4, 6.8, "power1.inOut");
follow("hil", [ux("hil"), L(38.47, -77.98), ...ROUTE.slice(1), L(39.88, -77.50)], T_NORTH + 0.8, 7.2, "power1.inOut");
const PT = tag("ACROSS THE POTOMAC", ...L(39.53, -78.25), T_POT, RED, 11, T_28);
// spearheads: Carlisle / Harrisburg (Ewell) and York / the Susquehanna (Early)
arr([L(39.95, -77.62), L(40.12, -77.38), L(40.22, -77.08)], "rome", T_PA - 0.2, { w: 8, dur: 1.6, until: T_3D });
arr([L(39.92, -77.55), L(39.86, -77.25), L(39.96, -76.85), L(40.02, -76.58)], "rome", T_PA + 0.3, { w: 8, dur: 1.8, until: T_3D });
const SQ = tag("TO THE SUSQUEHANNA", ...L(40.12, -76.40), T_PA + 1.4, RED, 10, T_28);
// Stuart's cavalry far to the east (cavalry icon), out of touch
unit("stu", "rome", ...L(38.80, -77.45), "infantry", { t: T_PA + 0.2, size: "XX", label: "STUART", w: 40, h: 27, fs: 10 }); cavIcon("stu");
follow("stu", [L(38.80, -77.45), L(39.08, -77.15), L(39.40, -77.02), L(39.62, -76.98), L(39.80, -76.98)], T_PA + 0.6, 8.0, "power1.inOut");
arr([L(38.80, -77.40), L(39.08, -77.10), L(39.45, -76.97), L(39.80, -76.93)], "rome", T_PA + 0.5, { w: 6, dur: 3.0, dash: "6 10", until: T_3D });
const lc = countCard("LEE'S ARMY", "MEN · ARMY OF NORTHERN VIRGINIA", RED, "left:110px;top:170px;", T_72 - 0.1, 0, 72000, 1.2, T_28 - 0.3, { pre: "~", round: 1000 });
// Hooker's army follows north to Frederick
follow("aop", [ux("aop"), L(38.70, -77.35), L(38.95, -77.40), L(39.10, -77.47), L(39.36, -77.43)], T_PA - 0.4, 5.0, "power1.inOut");
arr([L(38.55, -77.40), L(38.85, -77.37), L(39.10, -77.46), L(39.33, -77.43)], "carth", T_PA - 0.2, { w: 9, dur: 2.6, until: T_28 + 0.6 });
// 28 June: Lincoln replaces Hooker with Meade (real photo badges)
badge({ name: "ABRAHAM LINCOLN", role: "PRESIDENT", photo: "assets/media/lincoln_head.png", flag: FL.us, side: "carth", corner: "tl", t: T_LINC - 0.5, until: T_94 - 0.4 });
const HB = badge({ name: "JOSEPH HOOKER", role: "ARMY OF THE POTOMAC", photo: "assets/media/hooker_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_LINC - 0.3, until: T_MEADE + 0.2 });
tl.to(HB, { filter: "grayscale(1) brightness(0.65)", duration: 0.4 }, T_HOOK + 0.3);
sstamp("REPLACED", 300, T_HOOK + 0.4, { size: 40, rot: -6, left: 1350, until: T_MEADE + 0.1 });
badge({ name: "GEORGE G. MEADE", role: "ARMY OF THE POTOMAC", photo: "assets/media/meade_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_MEADE + 0.3, until: T_3D + 0.4 });
const FR = L(39.414, -77.411);
K.target(FR[0], FR[1], T_MEADE + 0.2, { r: 26, side: "#ffd54a", until: T_NOTIME + 1.2 });
const MT = tag("28 JUNE · MEADE TAKES COMMAND", FR[0] + 30, FR[1] + 38, T_MEADE + 0.4, BLUE, 11, T_3D);
// the army spread across Maryland (corps counters fan out), ~94,000
B.hideUnits(["aop"], T_94 - 0.3);
const CORPS = [["c1", 39.64, -77.35, "I"], ["c2", 39.55, -77.20, "II"], ["c3", 39.68, -77.28, "III"], ["c5", 39.45, -77.22, "V"], ["c6", 39.50, -76.98, "VI"], ["c11", 39.62, -77.45, "XI"], ["c12", 39.48, -77.10, "XII"]];
CORPS.forEach(([id, la, lo, lb], i) => { unit(id, "carth", ...FR, "infantry", { t: T_94 - 0.3 + i * 0.07, size: "XXX", label: lb, w: 30, h: 20, fs: 8 }); go(id, T_94 + i * 0.07, 1.8, L(la, lo), "power2.out"); });
const mc = countCard("MEADE'S ARMY", "MEN · SPREAD ACROSS MARYLAND", BLUE, "left:110px;top:170px;", T_94 - 0.1, 0, 94000, 1.2, T_3D - 0.2, { pre: "~", round: 1000 });
B.caption("NO TIME TO LEARN THE JOB", T_NOTIME - 0.2, T_3D - 0.1, "carth");
// three days later: everyone marches on the crossroads town (dotted blue north to the Pennsylvania line, red from west + north)
CORPS.slice(0, 4).forEach(([id], i) => go(id, T_3D + i * 0.1, 2.6, [GB[0] - 18 + i * 12, GB[1] + 34 + (i % 2) * 14], "power1.in"));
arr([L(39.45, -77.30), L(39.62, -77.28), L(39.79, -77.24)], "carth", T_3D, { w: 7, dur: 1.8, dash: "6 10", until: END });
arr([L(39.55, -77.10), L(39.70, -77.15), L(39.80, -77.21)], "carth", T_3D + 0.2, { w: 7, dur: 1.8, dash: "6 10", until: END });
go("hil", T_3D + 0.2, 2.4, [GB[0] - 48, GB[1] - 4], "power1.in"); go("lng", T_3D + 0.3, 2.6, [GB[0] - 62, GB[1] + 22], "power1.in"); go("ewl", T_3D + 0.1, 2.5, [GB[0] - 6, GB[1] - 46], "power1.in");
arr([L(39.90, -77.50), L(39.85, -77.30)], "rome", T_3D + 0.1, { w: 8, dur: 1.4, until: END });
arr([L(40.10, -77.25), L(39.88, -77.24)], "rome", T_3D + 0.3, { w: 8, dur: 1.4, until: END });
K.target(GB[0], GB[1], T_COLL - 0.2, { r: 22, side: "#ffd54a", until: END });
tl.to(GBL, { scale: 1.5, duration: 0.4, ease: "back.out(2)" }, T_GB - 0.3); SFX("ref:pop", T_GB - 0.2);
K.raiseTerritory();
B.finish();
