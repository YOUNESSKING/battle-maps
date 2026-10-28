// MOVE 3a (move3-1..5), William T. Sherman #13: the Carolinas, Feb - Mar 1865. Title; by land, not by sea; 60,079 men · 68 guns; the
// rivers across the path one after another + the flooded swamps (A MILE WIDE, IMPASSABLE); the two-place feint again (Charleston + Augusta
// held, HE IS COMING HERE x2) and both wings north between them; Rivers' Bridge 3 Feb (schematic close-up, option 2: two divisions wade the
// Salkehatchie swamp onto the flank, LINE BROKEN); CORDUROY ROADS laid log by log ahead of every column (+ close-up card) and the attributed
// Julius Caesar line; Columbia 17 Feb + the night fire (honest, neutral); Charleston given up; North Carolina: Fayetteville, Johnston back,
// Averasboro, the two wings apart, ~20,000 gathered at Bentonville.
// Basemap carolinas_hd_ref (z9, 34.25N 79.90W). Built with: python3 tools/build_scene.py move3a carolinas_hd_ref move3-1 move3-5
// Source: assets/src/move3a_body.js + m3_kit.js, assembled by tools/make_m3_scenes.py (edit those, not scenes-src/move3a.js).
// Option 1: carolinas_ctl_feb01 -> band1 -> band2 -> band2b -> band3 -> band3b (tools/make_m3_control.py: fixed Union ground per date + the
// army's swath); geo + swamp from tools/make_m3_geo.py, rivers from tools/make_m3_rivers.py. Facts: FACT_NOTES.md (Move 3), FACT_NOTES_carolinas.md.
// ==== BODY
const L = GG.proj(9, 35005, 51439);
const P1 = "move3-1", P2 = "move3-2", P3 = "move3-3", P4 = "move3-4", P5 = "move3-5";
const T_GRANT = at(P1, "Grant wanted"), T_SEA = at(P1, "by sea"), T_ASK = at(P1, "Sherman asked"), T_LAND = at(P1, "by land instead"), T_60 = at(P1, "sixty thousand men"),
  T_RIV = at(P1, "river after river"), T_SWAMP = at(P1, "miles of swamp"), T_RAIN = at(P1, "swollen by winter rain"), T_CROSS = at(P1, "At one crossing"),
  T_MILE = at(P1, "a full mile wide"), T_IMP = at(P1, "He called it impassable");
const T2 = B.P(P2), T_TRICK = at(P2, "the same trick again"), T_CHS = at(P2, "One wing threatened Charleston"), T_AUG = at(P2, "the other Augusta"), T_HELD = at(P2, "held on to both"),
  T_NORTH = at(P2, "Then both wings turned north"), T_BETW = at(P2, "into the swamps between them"), T_RB = at(P2, "At Rivers' Bridge"), T_DIVS = at(P2, "two Union divisions"),
  T_SHLD = at(P2, "up to their shoulders"), T_FLANK = at(P2, "came out on the flank"), T_GAVE = at(P2, "It gave way");
const T3 = B.P(P3), T_VAN = at(P3, "Where the roads vanished under water"), T_NEW = at(P3, "built new ones"), T_TREES = at(P3, "Whole regiments cut down trees"),
  T_RAILS = at(P3, "split fence rails"), T_SIDE = at(P3, "laid them side by side"), T_MILES = at(P3, "mile after mile"), T_WAG = at(P3, "so the wagons and the guns could follow"),
  T_WROTE = at(P3, "Sherman wrote that nearly every mile"), T_JJ = at(P3, "Joseph Johnston"), T_CAES = at(P3, "no such army since the days of Julius Caesar");
const T4 = B.P(P4), T_17 = at(P4, "On the seventeenth of February"), T_TOOK = at(P4, "took Columbia"), T_CAP = at(P4, "the capital of South Carolina"),
  T_NIGHT = at(P4, "That night, about a third of the city burned"), T_THIRD = at(P4, "about a third"), T_WHO = at(P4, "Who started the fire"), T_COT = at(P4, "cotton bales"),
  T_WIND = at(P4, "a howling wind"), T_DRUNK = at(P4, "drunken Union soldiers"), T_SAME = at(P4, "The same night"), T_CUT = at(P4, "cut off from the interior"),
  T_GAVEUP = at(P4, "gave up Charleston"), T_BEGUN = at(P4, "where the war had begun"), T_NOFIGHT = at(P4, "without a fight");
const T5 = B.P(P5), T_NC = at(P5, "In North Carolina"), T_BACK = at(P5, "Johnston was back in command"), T_CHANCE = at(P5, "he saw his chance"),
  T_ROADS = at(P5, "two wings were marching on separate roads"), T_FAR = at(P5, "far apart"), T_CATCH = at(P5, "If Johnston could catch one of them alone"),
  T_DESTROY = at(P5, "destroy it before the other came up"), T_GATH = at(P5, "He gathered every man"), T_20K = at(P5, "about twenty thousand"), T_BV = at(P5, "near a village called Bentonville");
// ---------- layers: territory (option 1) + the army's swath by stage ----------
const CT = (n, t, tOut, o = {}) => wimg(`assets/media/carolinas_ctl_${n}_mx.png`, t, o.dIn || 1.2, tOut, { mx: true, outDur: o.outDur || 1.2 });
const C0 = CT("feb01", 0, T_NORTH + 0.6);
const C1 = CT("band1", T_NORTH + 0.2, T3 + 18);
tl.to(C1, { autoAlpha: 0, duration: 0.8 }, T_RB + 0.3); tl.to(C1, { autoAlpha: 1, duration: 0.8 }, T3 - 0.3);   // Rivers' Bridge close-up: option 2
const C2 = CT("band2", T3 + 17.5, T_GAVEUP + 0.6);
const C2b = CT("band2b", T_GAVEUP, T5 + 0.8);
const C3 = CT("band3", T5 + 0.2, T_FAR + 0.6);
const C3b = CT("band3b", T_FAR, null);
const LV = LivingK(B); LV.clouds({ n: 8, opacity: 0.16 }); LV.shimmer(GD.rivers || [], { width: 1.3 }); LV.scaleBar(252.73); LV.north();
// flooded swamp (winter 1865): mottled water along the low river courses, pulsing
const SW = wimg("assets/media/carolinas_swamp.png", T_SWAMP - 0.3, 1.4, null);
tl.to(SW, { opacity: 0.55, duration: 1.1, yoyo: true, repeat: 41, ease: "sine.inOut" }, T_SWAMP + 1.2);
const GEO = GD.geo ? wimg(GD.geo, 0, 0, null) : null;
if (GEO) { tl.to(GEO, { autoAlpha: 0.35, duration: 0.8 }, T_RB + 0.3); tl.to(GEO, { autoAlpha: 1, duration: 0.8 }, T3 - 0.3); }
// ---------- places ----------
const PLC = { POC: [32.637, -80.863], RB: [33.0565, -81.0941], AUG: [33.471, -81.975], CHS: [32.776, -79.931], ORB: [33.49, -80.86], COL: [34.00, -81.035],
  CHE: [34.698, -79.883], FAY: [35.0525, -78.878], AVB: [35.266, -78.672], BEN: [35.3488, -78.2969], GOL: [35.385, -77.993], SMI: [35.511, -78.346], RAL: [35.78, -78.639],
  SIS: [32.47, -81.27], SAV: [32.081, -81.091], SUM: [32.752, -79.875], KIN: [35.263, -77.582] };
const Q = {}; Object.keys(PLC).forEach((k) => { Q[k] = L(...PLC[k]); });
const lab = (txt, q, t, o = {}) => { if (o.dot !== false) B.city("", q[0], q[1], { r: o.r || 2.6, t, until: o.until }); return box(txt, q[0] + (o.dx || 0), q[1] + (o.dy != null ? o.dy : -13), t, o.size || 10, o.until, o.pop === true); };
// ---------- camera (stretches: [cx, cy, s]) ----------
const RBK = 2.4;   // Rivers' Bridge schematic enlargement (the ~2 km fight drawn ~2.4x around the real spot)
const RBX = (() => { const pts = GD.named.SALKEHATCHIE, r = Q.RB; let j = 0, dm = 1e9; pts.forEach((p, i) => { const dd = Math.hypot(p[0] - r[0], p[1] - r[1]); if (dd < dm) { dm = dd; j = i; } });
  const a = pts[Math.max(0, j - 3)], b = pts[Math.min(pts.length - 1, j + 3)], n = Math.hypot(b[0] - a[0], b[1] - a[1]); let tx = (b[0] - a[0]) / n, ty = (b[1] - a[1]) / n;
  let nx = -ty, ny = tx; if (nx < 0) { nx = -nx; ny = -ny; } return { c: pts[j], tx, ty, nx, ny }; })();
const rb = (u, v) => [RBX.c[0] + RBK * (u * RBX.tx + v * RBX.nx), RBX.c[1] + RBK * (u * RBX.ty + v * RBX.ny)];   // u along the river, v across (+ = east bank)
const CS = { s0: [Q.POC[0] - 20, Q.POC[1] - 120, 1.35], wide: [1440, 900, 0.75], salk: [Q.RB[0] + 10, Q.RB[1] - 20, 2.6], sc: [1080, 1150, 1.15],
  rb: [...rb(0, 2), 5.5], cord: [1010, 1215, 2.2], cord2: [1050, 1080, 1.6], col: [Q.COL[0] + 6, Q.COL[1] + 4, 3.2], night: [1230, 1170, 1.15],
  nc: [1800, 430, 1.5], ben: [Q.BEN[0] - 60, Q.BEN[1] + 20, 2.4] };
// [stretch, camera start, duration, CSA screen slot, US screen slot]; both flags switch to the next stretch's pair halfway through each move
const SHOTS = [[CS.wide, null, 0, [560, 400], [1700, 470]],
  [CS.salk, T_CROSS - 0.5, 2.6, [520, 300], [1330, 850]],                 // the mile-wide Salkehatchie
  [CS.sc, T_TRICK - 0.6, 2.6, [1230, 230], [1720, 760]],                  // SC wide: Augusta - Charleston - the gap
  [CS.rb, T_RB - 0.4, 2.6, [1560, 420], [300, 620]],                      // Rivers' Bridge push-in (schematic)
  [CS.cord, T3 - 0.3, 2.8, [1560, 520], [560, 800]],                      // the corduroy columns crawl north
  [CS.cord2, T_JJ - 0.6, 3.0, [1560, 560], [700, 760]],
  [CS.col, T4 - 0.1, 2.8, [1560, 420], [640, 650]],                       // Columbia
  [CS.night, T_SAME - 0.4, 2.8, [1100, 300], [1640, 740]],                // the same night: Charleston
  [CS.nc, T5 - 0.2, 3.2, [700, 300], [1700, 560]],                        // North Carolina
  [CS.ben, T_GATH - 0.2, 3.4, [330, 560], [1640, 640]]];                  // Bentonville (hand-off to move3b)
camSet(...CS.wide); camAt(0.2, T_CROSS - 0.8, [1440, 900, 0.79]);        // WIDE: Savannah (just below) to Raleigh, slow push
SHOTS.forEach(([c, t, d], i) => { if (t != null) camAt(t, d, c); });
// switch moment: zoom-in -> at the start of the move (the old pair flies off), zoom-out -> at its end (the new pair would be off-screen), pan -> halfway
const swT = (i) => { const [c, t, d] = SHOTS[i], p = SHOTS[i - 1][0]; return c[2] > p[2] * 1.15 ? t + 0.25 : c[2] < p[2] / 1.15 ? t + d - 0.35 : t + d * 0.5; };
SHOTS.forEach(([c, t, d, cs, us], i) => flagsAt(c, cs, us, i ? swT(i) : 0.2, i + 1 < SHOTS.length ? swT(i + 1) + 0.2 : END + 1));
// ---------- date, legend, flags ----------
B.showDate(0.05);
B.date("JANUARY 1865", 0.1, T2 - 0.2, 32); B.date("FEBRUARY 1865", T2 - 0.1, T_RB - 0.3, 32); B.date("3 FEBRUARY 1865", T_RB - 0.2, T3 - 0.3, 32);
B.date("FEBRUARY 1865", T3 - 0.2, T4 - 0.2, 32); B.date("17 FEBRUARY 1865", T4 - 0.1, T_NIGHT - 0.3, 32); B.date("17-18 FEBRUARY 1865 · NIGHT", T_NIGHT - 0.2, T5 - 0.3, 32);
B.date("MARCH 1865", T5 - 0.2, T_FAR - 0.3, 32); B.date("16-18 MARCH 1865", T_FAR - 0.2, END + 1, 32);
legend(0.2, T_RB + 0.2); legend(T_RB + 0.3, T3 - 0.3, true); legend(T3 - 0.2, END + 1);
// ---------- move3-1: title; by sea or by land; 60,079; the rivers; the swamps; a mile wide ----------
B.title("MOVE 3", "THE CAROLINAS", "FEBRUARY - APRIL 1865", 0.3, 3.4); SFX("ref:boom", 0.4);
const SAVL = box("SAVANNAH ▼", Q.SAV[0] + 10, 1600, 0.3, 14, T_TRICK, false);
lab("POCOTALIGO", Q.POC, 0.4, { dx: 46, dy: 0, size: 10, until: T3 });
unit("arm", "carth", Q.POC[0] - 30, Q.POC[1] + 30, "infantry", { t: 0.3, size: "XXXX", label: "SHERMAN", w: 26, h: 17, fs: 7, until: T_TRICK + 0.2 });
badge({ name: "ULYSSES S. GRANT", role: "GENERAL-IN-CHIEF", photo: "assets/media/grant_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_GRANT - 0.3, until: T_ASK + 0.2 });
const SEA = [[Q.POC[0] + 40, 1640], [1500, 1600], [2150, 1180], [2600, 700], [2860, 200]];
tArrow(SEA, "#9fc0ea", T_GRANT + 0.3, T_LAND + 0.6, 3.2, { dash: "10 10", dur: 1.2 });
tag("BY SEA TO VIRGINIA?", 2290, 1000, T_SEA - 0.1, "#5b6f8f", 24, T_LAND + 0.5);
badge({ name: "WILLIAM T. SHERMAN", role: "60,079 MEN · 68 GUNS", photo: "assets/media/sherman_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_ASK, until: T_RIV + 0.3 });
const LANDP = [Q.POC, Q.RB, Q.ORB, Q.COL, Q.CHE, Q.FAY, Q.BEN, Q.RAL, [Q.RAL[0] + 20, 0]];
const LANDA = tArrow(LANDP, BLUE, T_LAND - 0.1, T_CROSS, 5, { dur: 2.4 });
tag("BY LAND", 1560, 760, T_LAND + 0.6, BLUE, 24, T_RIV);
countCard("SHERMAN'S ARMY · 1 FEB 1865", "MEN · 68 GUNS (MEMOIRS)", BLUE, "left:110px;top:200px;", T_60 - 0.1, 0, 60079, 1.4, T_RIV + 0.4, { fs: 60 });
// the rivers across his path, one after another (Savannah, Salkehatchie, Edisto, Congaree, Pee Dee, Cape Fear)
const RIVS = [["SAVANNAH", "SAVANNAH", 0.30], ["SALKEHATCHIE", "SALKEHATCHIE", 0.55], ["EDISTO", "EDISTO", 0.45], ["CONGAREE", "CONGAREE", 0.40], ["PEE DEE", "PEE DEE", 0.45], ["CAPE FEAR", "CAPE FEAR", 0.42]];
RIVS.forEach(([key, txt, f], k) => { const pts = GD.named[key]; if (!pts) return; const tt = T_RIV - 0.2 + k * 0.62;
  riverGlow(pts, tt, T_CROSS + (key === "SALKEHATCHIE" ? 9 : 0.6), { w: 3.2, dur: 1.0 }); const p = pts[Math.floor(pts.length * f)];
  tag(txt, p[0] + 46, p[1], tt + 0.3, "#2b6a8f", 15, T_CROSS + 0.4); });
B.caption("RIVER AFTER RIVER · MILES OF FLOODED SWAMP · WINTER 1865", T_SWAMP + 0.2, T_CROSS - 0.2);
// a full mile wide (the Salkehatchie, Memoirs) -> he called it impassable
const SK = GD.named.SALKEHATCHIE, skp = SK[Math.floor(SK.length * 0.62)];
tag("SALKEHATCHIE", skp[0] - 70, skp[1] - 30, T_CROSS + 0.4, "#2b6a8f", 7, T_TRICK - 0.2);
const MW = svgG(`<path d="M${skp[0] - 15} ${skp[1] + 4} L${skp[0] + 15} ${skp[1] - 4}" stroke="#f7f3ea" stroke-width="1.6" marker-start="" /><path d="M${skp[0] - 15} ${skp[1] + 4} l4 -4 M${skp[0] - 15} ${skp[1] + 4} l5 2 M${skp[0] + 15} ${skp[1] - 4} l-5 -2 M${skp[0] + 15} ${skp[1] - 4} l-4 4" stroke="#f7f3ea" stroke-width="1.4" fill="none"/>`); GG.hide(MW);
tl.to(MW, { autoAlpha: 1, duration: 0.4 }, T_MILE - 0.2); tl.to(MW, { autoAlpha: 0, duration: 0.4 }, T_TRICK - 0.2);
tag("A MILE WIDE", skp[0] + 36, skp[1] + 22, T_MILE, "#1f3f5c", 9, T_TRICK - 0.2);
ripple(skp[0] - 6, skp[1] + 2, T_MILE + 0.2, 3, 5, T_TRICK); ripple(skp[0] + 8, skp[1] - 3, T_MILE + 0.6, 3, 5, T_TRICK);
mstamp("IMPASSABLE?", skp[0] + 4, skp[1] - 56, T_IMP, { size: 13, until: T_TRICK - 0.3, sub: "THE RIVERS · SHERMAN, MEMOIRS" });
// ---------- move3-2: the same trick again; Rivers' Bridge ----------
unit("rw", "carth", Q.POC[0] - 10, Q.POC[1] - 10, "infantry", { t: T_TRICK - 0.3, size: "XXXX", label: "RIGHT WING", w: 26, h: 17, fs: 6 });
unit("lw", "carth", Q.SIS[0] + 10, Q.SIS[1] - 20, "infantry", { t: T_TRICK - 0.2, size: "XXXX", label: "LEFT WING", w: 26, h: 17, fs: 6 });
unit("hard", "rome", Q.CHS[0] - 12, Q.CHS[1] - 18, "infantry", { t: T_CHS - 0.2, size: "XXX", label: "HARDEE", w: 22, h: 15, fs: 6, until: T_RB + 0.2 });
unit("augd", "rome", Q.AUG[0] + 14, Q.AUG[1] + 20, "infantry", { t: T_AUG - 0.2, size: "XX", label: "AUGUSTA", w: 20, h: 13, fs: 5, until: T_RB + 0.2 });
badge({ name: "WILLIAM J. HARDEE", role: "HOLDS CHARLESTON", photo: "assets/media/hardee_head.png", flag: FL.csa, side: "rome", corner: "tr", t: T_CHS + 0.2, until: T_NORTH });
arr([Q.POC, [Q.POC[0] + 120, Q.POC[1] - 20], [Q.CHS[0] - 90, Q.CHS[1] - 10]], "carth", T_CHS - 0.1, { w: 7, dur: 1.2, dash: "8 9", until: T_NORTH + 0.4 });
arr([Q.SIS, [Q.SIS[0] - 100, Q.SIS[1] - 200], [Q.AUG[0] + 70, Q.AUG[1] + 90]], "carth", T_AUG - 0.1, { w: 7, dur: 1.2, dash: "8 9", until: T_NORTH + 0.4 });
K.target(Q.CHS[0], Q.CHS[1], T_CHS + 0.3, { r: 34, side: "#ff3b30", until: T_RB });
K.target(Q.AUG[0], Q.AUG[1], T_AUG + 0.2, { r: 34, side: "#ff3b30", until: T_RB });
belief("HE IS COMING HERE", Q.CHS[0] + 10, Q.CHS[1] - 50, T_HELD - 0.6, T_RB, 13);
belief("HE IS COMING HERE", Q.AUG[0] + 6, Q.AUG[1] - 50, T_HELD - 0.2, T_RB, 13);
mstamp("HELD", Q.CHS[0] + 64, Q.CHS[1] + 8, T_HELD + 0.5, { size: 12, until: T_RB }); mstamp("HELD", Q.AUG[0] - 56, Q.AUG[1] + 12, T_HELD + 0.8, { size: 12, until: T_RB });
const GAP = GG.pin(`<div style="width:220px;height:220px;border-radius:50%;background:radial-gradient(circle, rgba(255,214,90,0.5) 0%, rgba(255,200,60,0.2) 45%, rgba(255,200,60,0) 70%)"></div>`, Q.ORB[0] - 20, Q.ORB[1] + 70, { t: T_HELD + 0.8, until: T_RB });
tl.to(GAP, { scale: 1.15, duration: 0.7, yoyo: true, repeat: 5, ease: "sine.inOut" }, T_HELD + 1.2);
arr([[Q.POC[0] - 10, Q.POC[1] - 30], [Q.RB[0] + 30, Q.RB[1] + 30], [Q.ORB[0] - 10, Q.ORB[1] + 40]], "carth", T_NORTH - 0.1, { w: 9, dur: 1.6, until: T_RB + 0.3 });
arr([[Q.SIS[0] + 10, Q.SIS[1] - 40], [Q.SIS[0] + 10, Q.SIS[1] - 220], [Q.ORB[0] - 120, Q.ORB[1] + 30]], "carth", T_NORTH + 0.2, { w: 9, dur: 1.6, until: T_RB + 0.3 });
go("rw", T_NORTH, 2.2, [Q.RB[0] + 18, Q.RB[1] + 30]); go("lw", T_NORTH + 0.2, 2.2, [Q.SIS[0] + 20, Q.SIS[1] - 200]);
B.hideUnits(["rw", "lw"], T_RB + 0.2);
// Rivers' Bridge, 3 Feb (SCHEMATIC close-up on the z9 map: the ~2 km fight drawn ~3x enlarged around the real spot; Confederates dug in on
// the east bank at the causeway; Mower's and G. A. Smith's divisions (XVII Corps) wade the swamp above and below the bridge onto the flank)
const FW = fw(5.5);   // locked on-screen width at s 5.5
lab("RIVERS' BRIDGE", rb(0, 0), T_RB + 0.3, { dx: -60, dy: -40, size: 6, r: 1.4, until: T3 - 0.3 });
const CAUSE = svgG(`<path d="${dOf([rb(-1, -14), rb(0, 14)])}" stroke="#b08a58" stroke-width="3.2" stroke-dasharray="3 1.5"/>`); GG.hide(CAUSE);
tl.to(CAUSE, { autoAlpha: 1, duration: 0.4 }, T_RB + 0.3); tl.to(CAUSE, { autoAlpha: 0, duration: 0.4 }, T3 - 0.3);
const RBF = [-16, -8, 0, 8, 16].map((u) => rb(u, 5));
const sideAEast = (() => { const a = RBF[0], b = RBF[RBF.length - 1], dx = b[0] - a[0], dy = b[1] - a[1]; return (dy * RBX.nx - dx * RBX.ny) > 0; })();   // left of travel = east bank?
const FR1 = frontS({ pts: RBF, sideA: sideAEast ? "rome" : "carth", sideB: sideAEast ? "carth" : "rome", width: FW, t: T_RB + 0.4, dur: 1.0, until: T_GAVE + 0.3 });
unit("mcl", "rome", ...rb(0, 12), "infantry", { t: T_RB + 0.5, size: "XX", label: "~1,200", w: 18, h: 12, fs: 3.6, until: T3 - 0.3 });
unit("x17", "carth", ...rb(1, -12), "infantry", { t: T_RB + 0.6, size: "XXX", label: "XVII CORPS", w: 18, h: 12, fs: 3.6, until: T3 - 0.3 });
[0, 1].forEach((k) => { shoot(rb(3 + k, 12), rb(-2 + k * 3, -9), T_RB + 1.1 + k * 0.6, { r: 4, h: 8, dur: 0.35 }); shoot(rb(0, -14), rb(2 - k * 4, 8), T_RB + 1.4 + k * 0.6, { r: 4, h: 8, dur: 0.35 }); });
badge({ name: "JOSEPH A. MOWER", role: "DIVISION · XVII CORPS", photo: "assets/media/mower_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_DIVS - 0.3, until: T_GAVE + 0.8 });
const WADE = [[[-15, -12], [-15, 0], [-13, 9], [-9, 16]], [[15, -12], [15, 0], [13, 9], [10, 16]]];
WADE.forEach((w, k) => { const pts = w.map(([u, v]) => rb(u, v));
  unit("wd" + k, "carth", ...pts[0], "infantry", { t: T_DIVS - 0.2, size: "XX", label: k ? "G. A. SMITH" : "MOWER", w: 16, h: 11, fs: 3.2, until: T3 - 0.3 });
  follow("wd" + k, pts, T_DIVS + 0.3, T_FLANK - T_DIVS + 0.4, "power1.inOut");
  tArrow(pts, BLUE, T_DIVS, T3 - 0.4, 1.8, { dur: T_FLANK - T_DIVS + 0.4 });
  [0.15, 0.35, 0.55].forEach((f, i) => { const q = atLen(pts, cumOf(pts), cumOf(pts).slice(-1)[0] * (0.25 + f * 0.6)); ripple(q[0], q[1], T_DIVS + 0.5 + i * 0.6, 2, 4.5, T3); }); });
tag("WATER UP TO THEIR SHOULDERS", ...rb(0, -26), T_SHLD - 0.1, "#1f3f5c", 6, T3 - 0.4);
mg(rb(-4, 13), rb(1, 11), T_FLANK + 0.1, 5); mg(rb(6, 13), rb(2, 11), T_FLANK + 0.3, 5);
K.impact(...rb(2, 10), T_FLANK + 0.5, { r: 5, puffs: 2 });
go("mcl", T_GAVE, 1.2, rb(5, 26), "power2.in");
frontS({ pts: [rb(-14, 14), rb(-6, 18), rb(0, 20), rb(6, 18), rb(14, 14)], sideA: sideAEast ? "rome" : "carth", sideB: sideAEast ? "carth" : "rome", width: FW, t: T_GAVE + 0.2, dur: 0.9, until: T3 - 0.4 });
mstamp("LINE BROKEN", ...fpos(CS.rb, 1330, 800), T_GAVE + 0.1, { size: 8, until: T3 - 0.3 });
// ---------- move3-3: CORDUROY ROADS ----------
const COLS = [["c17", "XVII", [[33.06, -81.08], [33.20, -81.04], [33.33, -80.98], [33.49, -80.88], [33.62, -80.92]]],
  ["c15", "XV", [[32.95, -80.90], [33.10, -80.86], [33.27, -80.80], [33.42, -80.74], [33.58, -80.78]]],
  ["c20", "XX", [[32.92, -81.22], [33.08, -81.24], [33.24, -81.22], [33.40, -81.18], [33.58, -81.16]]],
  ["c14", "XIV", [[32.88, -81.42], [33.03, -81.40], [33.24, -81.36], [33.40, -81.36], [33.58, -81.32]]]];
const ROADS = svgG(COLS.map(([, , p]) => `<path d="${dOf(p.map((q) => L(...q)))}" fill="none" stroke="#d8c39a" stroke-width="1.4" stroke-dasharray="4 3" opacity="0.8"/>`).join("")); GG.hide(ROADS);
tl.to(ROADS, { autoAlpha: 1, duration: 0.5 }, T3 - 0.2); tl.to(ROADS, { autoAlpha: 0.15, duration: 1.2 }, T_VAN + 0.4);          // roads vanish under water
tl.to(SW, { autoAlpha: 1, duration: 0.6 }, T_VAN);
COLS.forEach(([id, lb, p], i) => { const pts = p.map((q) => L(...q)), t0 = T_NEW + i * 0.25, dur = T_WROTE - T_NEW + 1.5;
  unit(id, "carth", ...pts[0], "infantry", { t: T3 - 0.2 + i * 0.1, size: "XXX", label: lb, w: 15, h: 10, fs: 4.2, until: T4 - 0.2 });
  corduroy(pts, t0, dur, T4 + 0.2, { w: 8.5, gap: 2.6, th: 1.8, sfx: i === 0 });
  follow(id, [...pts.slice(0, -1), atLen(pts, cumOf(pts), cumOf(pts).slice(-1)[0] - 10)], t0 + 0.6, dur, "none");
  const ah = atLen(pts, cumOf(pts), 18); axe(ah[0] + 8, ah[1] - 6, T_TREES - 0.1 + i * 0.15, T_SIDE + 1, 0.55);
  [[-10, -4], [9, -8], [-8, 6]].forEach(([dx, dy], k) => tree(ah[0] + dx, ah[1] + dy - 6, T_TREES + 0.2 + i * 0.3 + k * 0.5, 0.55));
  const w0 = pts[0]; wagon(w0[0] - 2, w0[1] + 10, T_WAG - 0.2 + i * 0.1, T4 - 0.2, 0.45);
  const g1 = GG.pin(`<div style="transform:scale(0.45)"><svg width="30" height="16" viewBox="0 0 30 16" style="display:block;filter:drop-shadow(0 1px 2px #000)"><rect x="9" y="3" width="20" height="4.5" rx="2" fill="#2a2420" stroke="#efe6cf" stroke-width="1" transform="rotate(-12 19 5)"/><circle cx="10" cy="11" r="4.4" fill="#2a2420" stroke="#efe6cf" stroke-width="1.2"/></svg></div>`, w0[0] + 9, w0[1] + 14, { t: T_WAG + i * 0.1, until: T4 - 0.2 });
  follow2(g1, pts.map((q) => [q[0] + 9, q[1] + 14]), T_WAG + 0.4, T4 - T_WAG - 1, "none"); });
tag("CORDUROY ROADS", ...fpos(CS.cord, 700, 300), T_NEW + 0.3, "#7a5a36", 14, T4 - 0.3);
corduroyCard("right:70px;top:150px;", T_SIDE - 0.4, T_WROTE + 2.2);
B.caption("NEARLY EVERY MILE CORDUROYED · SHERMAN, MEMOIRS", T_WROTE - 0.1, T_JJ - 0.2);
badge({ name: "JOSEPH E. JOHNSTON", role: "WOULD SOON FACE HIM AGAIN", photo: "assets/media/johnston_head.png", flag: FL.csa, side: "rome", corner: "tr", t: T_JJ - 0.3, until: T4 + 0.2 });
const CAES = scr(`<div style="max-width:900px;padding:10px 24px 12px;background:rgba(18,16,12,0.9);border-left:6px solid ${RED};font-family:Oswald;color:#f7f3ea;text-align:left">
  <div style="font-size:26px;font-weight:600;letter-spacing:0.06em">NO SUCH ARMY SINCE THE DAYS OF JULIUS CAESAR</div><div style="font-size:15px;letter-spacing:0.24em;color:#c9b48a;margin-top:4px">- ATTRIBUTED TO J. E. JOHNSTON</div></div>`, "left:110px;bottom:130px;");
slide(CAES, T_CAES - 0.3, T4 + 0.3, -90);
// ---------- move3-4: Columbia 17 Feb; the night fire; Charleston given up ----------
const CCOL = Q.COL;

K.target(CCOL[0], CCOL[1], T4 + 0.2, { r: 16, side: "#5b8fe8", until: T_NIGHT });
[["e15", [10, 34]], ["e17", [34, 22]]].forEach(([id, [dx, dy]], k) => { unit(id, "carth", CCOL[0] + dx, CCOL[1] + dy, "infantry", { t: T4 + 0.1 + k * 0.1, size: "XXX", label: k ? "XVII" : "XV", w: 12, h: 8, fs: 3.6, until: T_SAME });
  go(id, T_TOOK - 0.2 + k * 0.2, 1.6, [CCOL[0] + 8 + k * 12, CCOL[1] + 10 + k * 3]); });
mstamp("COLUMBIA TAKEN", CCOL[0] + 30, CCOL[1] + 52, T_CAP, { size: 9, color: "#5b8fe8", sub: "STATE CAPITAL · 17 FEB 1865", until: T_NIGHT + 0.6 });
const NT = GG.night(T_NIGHT - 0.4, T5 - 0.6, { dur: 1.6, outDur: 1.6 });
[[0, 0], [6, -4], [-7, 3], [3, 7], [-4, -7], [9, 4], [-10, -3], [1, -10], [11, -6], [-8, 9], [5, 11], [-12, 7]].forEach(([dx, dy], k) => fire(CCOL[0] + dx, CCOL[1] + dy, T_NIGHT + 0.2 + k * 0.3, T_SAME + 3, 4.6, 0.8));
SFX("fire", T_NIGHT + 0.3);
[[[-30, -14], [-10, -8], [8, -10]], [[-30, 4], [-10, 8], [10, 4]], [[-28, 18], [-8, 20], [10, 16]]].forEach((p, k) => tArrow(p.map(([dx, dy]) => [CCOL[0] + dx, CCOL[1] + dy]), "#e8eef5", T_WIND - 0.2 + k * 0.2, T_SAME + 0.3, 0.9, { dur: 0.9 }));
const THIRD = scr(`<div style="padding:12px 30px 14px;background:rgba(14,12,10,0.92);border-top:6px solid #ff8a3c;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 16px 32px rgba(0,0,0,.6)">
  <div style="font-size:46px;letter-spacing:0.06em;line-height:1.1">ABOUT ONE-THIRD OF THE CITY BURNED</div><div style="font-size:16px;letter-spacing:0.24em;color:#d8cfb8">17-18 FEB 1865 · SOUTH CAROLINA ENCYCLOPEDIA</div></div>`, "left:0;right:0;margin:auto;width:1000px;top:190px;");
slam(THIRD, T_THIRD - 0.2, { from: 1.4, shake: 3, until: T_WHO + 0.2 });
const WHO = scr(`<div style="padding:12px 26px 14px;background:rgba(14,12,10,0.92);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 16px 32px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.1em">WHO STARTED IT IS STILL DISPUTED</div>
  <div style="display:flex;gap:12px;margin-top:10px;font-size:20px;letter-spacing:0.14em">${["BURNING COTTON", "HIGH WIND", "DRUNKEN SOLDIERS"].map((s, k) => `<span class="ch" style="padding:4px 12px;border:1.5px solid #c9b48a;background:rgba(201,180,138,0.12)">${s}</span>`).join("")}</div></div>`, "left:110px;top:760px;");
slide(WHO, T_WHO - 0.2, T_SAME + 0.2, -90);
const CHP = [...WHO.querySelectorAll(".ch")]; gsap.set(CHP, { opacity: 0 });
[T_COT, T_WIND, T_DRUNK].forEach((tt, k) => { tl.fromTo(CHP[k], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, immediateRender: false }, tt - 0.1); SFX("ref:pop", tt); });
// the same night: Charleston given up (Hardee out north), the city where the war began
lab("CHARLESTON", Q.CHS, T_SAME - 0.2, { dx: 46, dy: 0, size: 11, until: T5 });
unit("hard2", "rome", Q.CHS[0] - 10, Q.CHS[1] - 16, "infantry", { t: T_SAME - 0.2, size: "XXX", label: "HARDEE", w: 22, h: 15, fs: 6, until: T5 - 0.2 });
go("hard2", T_GAVEUP + 0.2, 3.4, L(33.55, -79.95), "power1.inOut");
arr([[Q.CHS[0] - 10, Q.CHS[1] - 30], L(33.30, -80.05), L(33.75, -79.95)], "rome", T_CUT, { w: 7, dur: 2.0, until: T5 });
mstamp("CHARLESTON GIVEN UP", Q.CHS[0] - 260, Q.CHS[1] - 60, T_GAVEUP + 0.3, { size: 15, sub: "WITHOUT A FIGHT · 17-18 FEB 1865", until: T5 - 0.2 });
const SUMQ = Q.SUM; B.city("", SUMQ[0], SUMQ[1], { r: 3, t: T_BEGUN - 0.2, until: T5 });
box("FORT SUMTER · APRIL 1861", SUMQ[0] + 40, SUMQ[1] + 40, T_BEGUN - 0.1, 11, T5, true);
// ---------- move3-5: North Carolina; Johnston back; the wings apart; ~20,000 at Bentonville ----------
lab("CHERAW", Q.CHE, T5 - 0.1, { dx: -36, dy: 0, size: 10, until: END + 1 });
lab("FAYETTEVILLE", Q.FAY, T5 + 0.2, { dx: -54, dy: 4, size: 10, until: END + 1 });
lab("GOLDSBORO", Q.GOL, T5 + 0.2, { dx: 42, dy: -6, size: 10, until: END + 1 });
const LBEN = lab("BENTONVILLE", Q.BEN, T5 + 0.2, { dx: 0, dy: -34, size: 10, until: END + 1 });
lab("SMITHFIELD", Q.SMI, T_BACK, { dx: 38, dy: -4, size: 8, until: END + 1 });
fire(Q.FAY[0] + 4, Q.FAY[1] + 2, T_NC + 0.4, T_FAR + 1, 6, 0.9);
mstamp("FAYETTEVILLE TAKEN", Q.FAY[0] - 10, Q.FAY[1] + 40, T_NC + 0.3, { size: 10, color: "#5b8fe8", sub: "11 MAR · ARSENAL DESTROYED", until: T_ROADS });
badge({ name: "JOSEPH E. JOHNSTON", role: "BACK IN COMMAND · 23 FEB 1865", photo: "assets/media/johnston_head.png", flag: FL.csa, side: "rome", corner: "bl", t: T_BACK - 0.3, until: T_GATH });
mstamp("BACK IN COMMAND", Q.SMI[0] - 150, Q.SMI[1] + 10, T_BACK + 0.4, { size: 11, until: T_CATCH });
const LWR = [Q.FAY, L(35.18, -78.74), Q.AVB, L(35.30, -78.50), [Q.BEN[0] - 14, Q.BEN[1] + 6]];
const RWR = [[Q.FAY[0] + 10, Q.FAY[1] + 14], L(35.02, -78.55), L(35.08, -78.25), L(35.20, -78.05), [Q.GOL[0] - 6, Q.GOL[1] + 14]];
unit("lw2", "carth", ...Q.FAY, "infantry", { t: T5 + 0.2, size: "XXXX", label: "LEFT WING · SLOCUM", w: 22, h: 15, fs: 4.4 });
unit("rw2", "carth", Q.FAY[0] + 10, Q.FAY[1] + 16, "infantry", { t: T5 + 0.3, size: "XXXX", label: "RIGHT WING · HOWARD", w: 22, h: 15, fs: 4.4 });
arr(LWR, "carth", T_ROADS - 0.2, { w: 7, dur: 2.2, until: END + 1 }); follow("lw2", LWR.slice(0, 3), T_ROADS, 3.0, "power1.inOut");
arr(RWR, "carth", T_ROADS + 0.2, { w: 7, dur: 2.2, until: END + 1 }); follow("rw2", RWR.slice(0, 4), T_ROADS + 0.2, 3.4, "power1.inOut");
unit("hard3", "rome", ...L(35.33, -78.62), "infantry", { t: T_ROADS + 0.6, size: "XXX", label: "HARDEE", w: 18, h: 12, fs: 5, until: T_GATH + 0.4 });
[0, 1, 2].forEach((k) => shoot(L(35.31, -78.63), [Q.AVB[0] - 10 + k * 6, Q.AVB[1] + 8 - k * 4], T_ROADS + 1.6 + k * 0.45, { r: 4, h: 10, dur: 0.5 }));
tag("AVERASBORO · 16 MAR", Q.AVB[0] - 60, Q.AVB[1] + 26, T_ROADS + 1.4, RED, 9, T_GATH);
const MID = L(35.18, -78.42);
ruler(L(35.30, -78.52), L(35.06, -78.30), "FAR APART", T_FAR + 0.2, T_GATH, "#ffb4a8");
hole(MID[0], MID[1], T_FAR + 0.3, T_GATH + 1, 26);
// Johnston gathers every man (Hardee, Bragg, the Army of Tennessee) toward Bentonville
[[L(35.62, -78.55), "rome"], [L(35.42, -77.75), "rome"], [L(35.55, -78.20), "rome"]].forEach(([a], k) => arr([a, [Q.BEN[0] + (k - 1) * 8, Q.BEN[1] - 10]], "rome", T_CATCH + k * 0.3, { w: 6, dur: 1.6, until: END + 1 }));
go("hard3", T_CATCH, 2.0, [Q.BEN[0] - 18, Q.BEN[1] - 4]);
[["j1", [35.62, -78.55], "ARMY OF TENNESSEE"], ["j2", [35.42, -77.75], "BRAGG"]].forEach(([id, q, lb], k) => { unit(id, "rome", ...L(...q), "infantry", { t: T_CATCH - 0.2, size: "XXX", label: lb, w: 18, h: 12, fs: 4 });
  go(id, T_CATCH + 0.3 + k * 0.2, 2.2, [Q.BEN[0] + 6 + k * 14, Q.BEN[1] - 14 + k * 10]); });
countCard("JOHNSTON GATHERS", "MEN · NEAR BENTONVILLE (NCPEDIA / ABT)", RED, "left:110px;top:200px;", T_20K - 0.1, 0, 20000, 1.3, END + 1, { fs: 60, pre: "~", round: 100 });
K.target(Q.BEN[0], Q.BEN[1], T_BV - 0.2, { r: 30, side: "#ff3b30", until: END + 1 });
tag("HIDDEN IN THE WOODS", Q.BEN[0] - 4, Q.BEN[1] + 34, T_BV + 0.3, RED, 8, END + 1);
tl.to(LBEN, { scale: 1.4, duration: 0.4, ease: "back.out(2)" }, T_BV); SFX("ref:pop", T_BV + 0.1);
K.raiseTerritory();
B.finish();
