// MOVE 2c (move2-5 .. move2-7), George G. Meade #12: Longstreet's attack after 4 pm, Little Round Top, THE MOVE (the interior shuffle),
// the Plum Run gap (1st Minnesota, Meade with Lockwood's brigade, Baldy hit). Basemap getty15_hd_ref (z15, HD dark).
// Built with: python3 tools/build_scene.py move2c getty15_hd_ref move2-5 move2-7
// Source: assets/src/move2c_body.js + move2_kit.js, assembled by tools/make_move2_scenes.py (edit those, not scenes-src/move2c.js).
// CLOSE-UP, option 2: two-colour glowing front (getty_fronts.json jul2s -> jul2pm, Union on the left = sideA "carth"), no fill.
// Facts: research/FACT_NOTES.md (Move 2: ABT, Meade OR, Life and Letters), research/FACT_NOTES_getty.md.
// ==== BODY
const L = GG.proj(15, 2393088, 3180895);
const P5 = "move2-5", P6 = "move2-6", P7 = "move2-7";
const T_FOUR = at(P5, "A little after four"), T_CRASH = at(P5, "crashed into"), T_BRIG = at(P5, "brigade after brigade"), T_SN = at(P5, "from south to north"),
  T_DD = at(P5, "Devil's Den, the Wheatfield"), T_BLOOD = at(P5, "bloodiest ground"), T_FAR = at(P5, "at the far end"), T_LOOK = at(P5, "looked down on everything"),
  T_EMPTY = at(P5, "almost empty"), T_WARREN = at(P5, "Gouverneur Warren"), T_SIG = at(P5, "only a few signalmen");
const S6 = PS(P6), T_QUIET = at(P6, "wherever the line was quiet"), T_RACING = at(P6, "racing across the inside"), T_V = at(P6, "The Fifth Corps"),
  T_TOP = at(P6, "reached the top of Little Round Top"), T_MIN = at(P6, "minutes ahead"), T_II = at(P6, "A whole division"), T_WF = at(P6, "into the Wheatfield"),
  T_XII = at(P6, "stripped most of the Twelfth Corps"), T_RISK = at(P6, "taking the risk"), T_LEFT = at(P6, "to save his left"), T_VI = at(P6, "And the Sixth Corps"),
  T_32 = at(P6, "thirty-two miles"), T_LAST = at(P6, "last reserve");
const S7 = PS(P7), T_EVE = at(P7, "Toward evening"), T_BROKE = at(P7, "broke through north"), T_RIDGE = at(P7, "charged up toward the ridge"),
  T_HOLE = at(P7, "a hole in the line"), T_MINN = at(P7, "Hancock threw in"), T_262 = at(P7, "two hundred and sixty-two"), T_47 = at(P7, "only forty-seven"),
  T_FRESH = at(P7, "Fresh brigades"), T_FAM = at(P7, "by his family's account"), T_HEAD = at(P7, "rode at the head"), T_GAP = at(P7, "up into the gap"),
  T_BALDY = at(P7, "old horse, Baldy"), T_INCH = at(P7, "half an inch");
const PX = (k) => PL[k];
// ---------- layers (no territory fill: option 2) ----------
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 }); LV.shimmer(GD.rivers || [], { width: 1.0 }); LV.scaleBar(3.67); LV.north();
wimg("assets/media/getty15_geo_ref.png", 0, 0, null);
// ---------- camera ----------
const K0 = L(39.7990, -77.2420); camSet(K0[0], K0[1], 1.35);              // = move2b's last frame
camTo(0.2, T_FAR - 0.6, K0[0] - 10, K0[1] + 20, 1.5);                      // the salient under attack
camTo(T_FAR - 0.5, 2.2, 1470, 1150, 2.2);                                  // Little Round Top
camTo(T_WARREN - 0.5, 2.0, 1500, 860, 1.3);                                // Warren rides from HQ to the hill
camTo(S6 - 0.2, 2.6, 1600, 765, 1.2);                                      // the whole inside of the hook
camTo(T_TOP - 1.4, 1.8, 1460, 1170, 2.3);                                  // Vincent on Little Round Top
camTo(T_II - 0.6, 2.2, 1600, 765, 1.2);                                    // Caldwell, XII Corps, VI Corps
camTo(S7 - 0.2, 2.6, 1430, 790, 2.0);                                      // the Plum Run gap
const KE = L(39.8040, -77.2380);                                           // = move2d opening frame (getty at s 1.2)
camTo(END - 2.6, 2.4, KE[0], KE[1], 2.4);
// ---------- dates, legend, flags ----------
B.showDate(0.05);
B.date("2 JULY · AFTER 4 PM", 0.1, S7 - 0.2, 30); B.date("2 JULY · EVENING", S7 - 0.1, END + 1, 30);
legend(0.2, END - 0.6, true);
flag(FL.csa, "CONFEDERATE STATES", ...L(39.7905, -77.2560), 0.3, T_FAR - 0.4, 76); flag(FL.us, "UNITED STATES", ...L(39.7990, -77.2300), 0.35, T_FAR - 0.4, 76);
flag(FL.csa, "CONFEDERATE STATES", ...L(39.8055, -77.2625), T_WARREN, S7 - 0.4, 92); flag(FL.us, "UNITED STATES", ...L(39.8150, -77.2240), T_WARREN + 0.05, S7 - 0.4, 92);
flag(FL.csa, "CONFEDERATE STATES", ...L(39.8070, -77.2520), S7 + 0.4, END - 2.4, 56); flag(FL.us, "UNITED STATES", ...L(39.8085, -77.2300), S7 + 0.45, END - 2.4, 56);
// the front around Sickles's salient (two-coloured), moves back to Plum Run in move2-7
const FR = K.front({ pts: GD.fronts.jul2s, sideA: "carth", sideB: "rome", t: 0.1, dur: 1.4, width: 15, glow: 0.47, to: GD.fronts.jul2pm, moveT: T_BROKE - 0.2, moveDur: 3.6, until: END + 1 });
// places
const LBL = [place("peach_orchard", 0.4, { dx: 58, dy: 16, until: S6 - 0.3 }), place("wheatfield", 0.5, { dx: 54, dy: -10, until: END + 1 }),
  place("devils_den", 0.6, { dx: -48, dy: 14, until: END + 1 }), place("little_round_top", 0.7, { dx: 64, dy: 4, until: END + 1 }), place("big_round_top", 0.8, { dx: 58, dy: 8, until: END + 1 }),
  place("trostle", 0.9, { dx: 46, dy: -12, until: S7 - 0.3 })];
// units on screen at once: III Corps in the salient, II Corps on the ridge, Longstreet's divisions on Warfield Ridge
unit("bir", "carth", ...L(39.7932, -77.2448), "infantry", { size: "XX", label: "BIRNEY", fs: 8 });
unit("hum", "carth", ...L(39.8068, -77.2462), "infantry", { size: "XX", label: "HUMPHREYS", fs: 8 });
unit("gra", "carth", ...L(39.8012, -77.2478), "infantry", { size: "X", label: "GRAHAM", fs: 8 });
unit("u2", "carth", ...L(39.8105, -77.2355), "infantry", { size: "XXX", label: "II CORPS", fs: 8 });
unit("cal", "carth", ...L(39.8072, -77.2352), "infantry", { size: "XX", label: "CALDWELL", fs: 8 });
unit("hood", "rome", ...L(39.7920, -77.2575), "infantry", { size: "XX", label: "HOOD", fs: 8 });
unit("mcl", "rome", ...L(39.8015, -77.2560), "infantry", { size: "XX", label: "McLAWS", fs: 8 });
unit("and", "rome", ...L(39.8090, -77.2540), "infantry", { size: "XX", label: "ANDERSON", fs: 8 });
badge({ name: "JAMES LONGSTREET", role: "ATTACKS AFTER 4 PM", photo: "assets/media/longstreet_head.png", flag: FL.csa, side: "rome", corner: "tl", t: T_FOUR - 0.2, until: T_BLOOD + 0.4 });
// ---------- move2-5: brigade after brigade, south to north ----------
const WAVES = [  // [start, end, label]  Law -> the Round Tops; Robertson + Benning -> Devil's Den; G.T. Anderson -> Rose Woods; Kershaw + Semmes ->
  [[39.7870, -77.2570], [39.7880, -77.2420], "LAW"],                       // the Wheatfield / Stony Hill; Barksdale -> the Peach Orchard
  [[39.7905, -77.2565], [39.7912, -77.2440], "ROBERTSON · BENNING"],
  [[39.7950, -77.2560], [39.7952, -77.2462], "G.T. ANDERSON"],
  [[39.7995, -77.2550], [39.7978, -77.2475], "KERSHAW · SEMMES"],
  [[39.8040, -77.2545], [39.8018, -77.2498], "BARKSDALE"]];
const W0 = T_CRASH - 0.6, WS = (T_DD + 2.6 - W0) / WAVES.length;
WAVES.forEach(([a, b, lb], i) => { const t = W0 + i * WS, A = L(...a), Bp = L(...b);
  tArrow([A, [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2 - 6], Bp], RED, t, T_FAR, 3.0, { dur: 1.1 });
  tag(lb, A[0] - 4, A[1] - 22, t, RED, 9, T_FAR);
  K.impact(Bp[0] + 14, Bp[1] - 6, t + 0.9, { r: 7, puffs: 2 }); K.impact(Bp[0] + 26, Bp[1] + 8, t + 1.2, { r: 6, puffs: 2 });
  mg([Bp[0] + 20, Bp[1]], Bp, t + 0.7, 4); });
B.caption("BRIGADE AFTER BRIGADE · SOUTH TO NORTH", T_BRIG - 0.2, T_DD + 0.2, "r");
[["devils_den", T_DD - 0.1], ["wheatfield", T_DD + 0.5], ["peach_orchard", T_DD + 1.1]].forEach(([k, t]) => K.target(...PX(k), t, { r: 20, side: "#ff6a4d", until: T_FAR }));
B.caption("SOME OF THE BLOODIEST GROUND OF THE WAR", T_BLOOD - 0.2, T_FAR - 0.1, "r");
go("bir", T_BLOOD - 0.4, 2.0, L(39.7942, -77.2430)); go("gra", T_BLOOD - 0.2, 2.0, L(39.8010, -77.2460));
// Little Round Top: almost empty, a few signalmen
const LRT = PX("little_round_top");
K.target(LRT[0], LRT[1], T_EMPTY - 0.3, { r: 30, side: "#ffd54a", until: T_V });
const EMP = tag("ALMOST EMPTY", LRT[0] + 70, LRT[1] + 30, T_EMPTY - 0.1, "#7a6420", 12, T_V);
const SIG = [[-10, -6], [6, -12], [16, 2]].map(([dx, dy], k) => GG.pin(SIGF, LRT[0] + dx, LRT[1] + dy, { t: T_LOOK + k * 0.2, pop: true, until: T_TOP }));
badge({ name: "GOUVERNEUR K. WARREN", role: "CHIEF ENGINEER", photo: "assets/media/warren_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_WARREN - 0.4, until: T_QUIET });
const LH = PX("leister");
GG.pin(HQF, LH[0], LH[1], { t: 0.2, until: END + 1 });
tArrow([LH, L(39.8060, -77.2335), L(39.7990, -77.2350), [LRT[0] + 2, LRT[1] - 14]], BLUE, T_WARREN - 0.2, T_V, 3.0, { dash: "7 6", dur: 2.4 });
const WR = GG.pin(`<div style="width:12px;height:12px;border-radius:50%;background:${BLUE};border:2px solid #f3eee2;box-shadow:0 0 8px #7fb0ff"></div>`, LH[0], LH[1], { t: T_WARREN - 0.2, until: S6 + 1 });
tl.to(WR, { left: LRT[0] + 2, top: LRT[1] - 14, duration: 2.6, ease: "power1.inOut" }, T_WARREN - 0.1);
B.caption("WARREN FINDS ONLY A FEW SIGNALMEN", T_SIG - 0.2, S6 - 0.1, "carth");
// ---------- move2-6: THE MOVE: troops race across the inside of the hook ----------
const MV = sstamp("MEADE'S MOVE", 150, S6 + 0.1, { size: 44, color: "#5b8cff", rot: -3, sub: "TAKE FROM THE QUIET, SEND TO THE FIGHT", until: T_V + 0.4 });
const HKL = glowLine([L(39.8165, -77.2195), L(39.8205, -77.2240), L(39.8215, -77.2295), L(39.8170, -77.2347), L(39.8100, -77.2360), L(39.8000, -77.2360), L(39.7918, -77.2362)], "#4f86ff", 2.6, T_QUIET - 0.4, T_LAST + 1.0, { dur: 1.6, pulse: 6 });
// V Corps from the reserve to the left
unit("v", "carth", ...L(39.8085, -77.2205), "infantry", { t: T_RACING - 0.4, size: "XXX", label: "V CORPS", fs: 8 });
badge({ name: "GEORGE SYKES", role: "V CORPS", photo: "assets/media/sykes_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_V - 0.3, until: T_TOP - 1.4 });
arr([L(39.8085, -77.2205), L(39.8030, -77.2290), L(39.7960, -77.2375)], "carth", T_V - 0.2, { w: 6, dur: 1.5, until: T_II });
go("v", T_V, 1.8, L(39.7965, -77.2385));
// Vincent's brigade up Little Round Top, just ahead of the Confederates (Law's Alabamians + Robertson's Texans)
badge({ name: "STRONG VINCENT", role: "BRIGADE · V CORPS", photo: "assets/media/vincent_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_TOP - 1.2, until: T_II - 0.5 });
unit("vin", "carth", ...L(39.7960, -77.2380), "infantry", { t: T_TOP - 1.2, size: "X", label: "VINCENT", fs: 8 });
follow("vin", [L(39.7960, -77.2380), L(39.7935, -77.2370), [LRT[0] - 4, LRT[1] + 6]], T_TOP - 1.0, 1.3, "power2.out");
const LAW = tArrow([L(39.7865, -77.2420), L(39.7880, -77.2395), L(39.7898, -77.2378)], RED, T_TOP - 0.3, T_II, 2.8, { dur: 1.5 });
K.target(LRT[0], LRT[1], T_TOP + 0.3, { r: 26, side: "#7fb0ff", until: T_II });
[[-10, 24], [8, 30], [-22, 16], [2, 22]].forEach(([dx, dy], k) => K.impact(LRT[0] + dx, LRT[1] + dy, T_MIN - 0.4 + k * 0.4, { r: 6, puffs: 2 }));
mg([LRT[0] - 4, LRT[1] + 8], [LRT[0] - 14, LRT[1] + 34], T_MIN - 0.2, 5);
const M20 = tag("20TH MAINE", ...L(39.7898, -77.2345), T_MIN + 0.2, BLUE, 9, T_II);
const MIN = tag("MINUTES AHEAD", LRT[0] + 76, LRT[1] - 22, T_MIN, BLUE, 11, T_II);
// a division of II Corps (Caldwell) into the Wheatfield
badge({ name: "WINFIELD S. HANCOCK", role: "II CORPS", photo: "assets/media/hancock_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_II - 0.3, until: T_XII - 0.3 });
arr([L(39.8070, -77.2352), L(39.8020, -77.2380), L(39.7975, -77.2428)], "carth", T_II, { w: 6, dur: 1.5, until: S7 });
go("cal", T_II + 0.1, 2.0, L(39.7972, -77.2440));
K.target(...PX("wheatfield"), T_WF, { r: 20, side: "#7fb0ff", until: T_XII });
// XII Corps stripped off Culp's Hill and sent south (Culp's left thin)
unit("u12", "carth", ...L(39.8172, -77.2192), "infantry", { t: T_QUIET, size: "XXX", label: "XII CORPS", fs: 8 });
arr([L(39.8165, -77.2200), L(39.8100, -77.2250), L(39.8050, -77.2320), L(39.8025, -77.2375)], "carth", T_XII - 0.1, { w: 7, dur: 2.0, until: S7 + 2 });
go("u12", T_XII + 0.1, 2.6, L(39.8030, -77.2340));
const CU = PX("culps_hill"); place("culps_hill", T_QUIET, { dx: 50, dy: -2, until: S7 });
hole(CU[0], CU[1] + 10, T_RISK - 0.2, S7, 18);
const THIN = tag("CULP'S HILL LEFT THIN", CU[0] + 40, CU[1] + 44, T_RISK, RED, 10, S7);
B.caption("RISK ON THE RIGHT · TO SAVE THE LEFT", T_RISK - 0.1, T_VI - 0.2, "carth");
// VI Corps comes up the Baltimore Pike: 32 miles through the night
unit("u6", "carth", ...L(39.7950, -77.2000), "infantry", { t: T_VI - 0.4, size: "XXX", label: "VI CORPS", fs: 8 });
follow("u6", [L(39.7950, -77.2000), L(39.8010, -77.2080), L(39.8060, -77.2150)], T_VI - 0.2, 2.6, "power1.out");
arr([L(39.7930, -77.1985), L(39.8010, -77.2080), L(39.8060, -77.2160)], "carth", T_VI - 0.2, { w: 6, dur: 1.8, until: S7 });
badge({ name: "JOHN SEDGWICK", role: "VI CORPS", photo: "assets/media/sedgwick_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_VI - 0.2, until: S7 - 0.2 });
countCard("VI CORPS MARCHED", "MILES THROUGH THE NIGHT", BLUE, "left:110px;top:170px;", T_32 - 0.1, 0, 32, 1.0, S7 - 0.2, { fs: 60 });
const LR = tag("THE LAST RESERVE", ...L(39.8030, -77.2075), T_LAST - 0.2, BLUE, 11, S7);
// ---------- move2-7: the Plum Run gap ----------
const BRK = [[[39.8070, -77.2470], [39.8058, -77.2400], "WILCOX"], [[39.8040, -77.2480], [39.8032, -77.2400], "LANG"], [[39.8020, -77.2462], [39.8005, -77.2405], "BARKSDALE"]];
BRK.forEach(([a, b, lb], i) => { const A = L(...a), Bp = L(...b); tArrow([A, Bp], RED, T_BROKE - 0.4 + i * 0.3, T_GAP + 0.5, 3.0, { dur: 1.4 }); tag(lb, A[0] - 30, A[1] - 16, T_BROKE - 0.2 + i * 0.3, RED, 9, T_HOLE + 1.5);
  K.impact(Bp[0] + 6, Bp[1] - 4, T_BROKE + 1.2 + i * 0.3, { r: 7, puffs: 2 }); });
go("hum", T_BROKE, 2.4, L(39.8080, -77.2385)); go("bir", T_BROKE + 0.1, 2.4, L(39.7975, -77.2375)); B.hideUnits(["gra"], T_BROKE + 0.6);
go("cal", T_BROKE + 0.2, 2.4, L(39.7990, -77.2380));
const GAP = L(39.8048, -77.2372);
hole(GAP[0], GAP[1], T_HOLE - 0.4, T_GAP + 1.0, 26);
const HT = tag("A HOLE IN THE LINE", GAP[0] + 84, GAP[1] - 24, T_HOLE - 0.2, RED, 11, T_FRESH);
badge({ name: "WINFIELD S. HANCOCK", role: "II CORPS", photo: "assets/media/hancock_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_MINN - 0.4, until: T_FAM - 0.4 });
unit("mn", "carth", ...L(39.8075, -77.2357), "infantry", { t: T_MINN - 0.3, size: "III", label: "1ST MINNESOTA", fs: 8 });
go("mn", T_MINN + 0.3, 1.8, L(39.8058, -77.2388), "power2.in");
mg(L(39.8058, -77.2388), L(39.8062, -77.2410), T_262 - 0.2, 5); mg(L(39.8060, -77.2410), L(39.8058, -77.2390), T_262 + 0.4, 4);
[[39.8058, -77.2392], [39.8064, -77.2385], [39.8052, -77.2380]].forEach((q, k) => K.impact(...L(...q), T_262 + k * 0.45, { r: 6, puffs: 2 }));
const MNC = countCard("1ST MINNESOTA", "MEN CHARGED", BLUE, "left:110px;top:170px;", T_262 - 0.1, 0, 262, 1.0, T_FRESH - 0.2, { fs: 60 });
const MNU = countCard("CAME OUT UNHURT", "OF 262", RED, "left:110px;top:330px;", T_47 - 0.1, 262, 47, 1.2, T_FRESH - 0.2, { fs: 60 });
// fresh brigades: Willard (II Corps) + Lockwood (XII Corps) with Meade at its head (family narrative)
unit("wil", "carth", ...L(39.8095, -77.2345), "infantry", { t: T_FRESH - 0.4, size: "X", label: "WILLARD", fs: 8 });
arr([L(39.8095, -77.2345), L(39.8075, -77.2375), L(39.8064, -77.2398)], "carth", T_FRESH - 0.2, { w: 6, dur: 1.4, until: END });
go("wil", T_FRESH, 2.0, L(39.8064, -77.2396));
unit("lock", "carth", ...L(39.8040, -77.2300), "infantry", { t: T_FRESH, size: "X", label: "LOCKWOOD", fs: 8 });
arr([L(39.8040, -77.2305), L(39.8035, -77.2345), L(39.8028, -77.2388)], "carth", T_HEAD - 0.4, { w: 6, dur: 1.6, until: END });
go("lock", T_HEAD - 0.2, 2.4, L(39.8030, -77.2385));
badge({ name: "GEORGE G. MEADE", role: "AT THE HEAD OF A BRIGADE", photo: "assets/media/meade_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_FAM - 0.3, until: END - 0.4 });
const MM = GG.pin(HQF, ...L(39.8045, -77.2290), { t: T_FAM - 0.2, until: END + 1 });
const MP = L(39.8034, -77.2375); tl.to(MM, { left: MP[0], top: MP[1] - 22, duration: 2.6, ease: "power1.inOut" }, T_HEAD - 0.2);
B.caption("BY HIS FAMILY'S ACCOUNT", T_FAM - 0.2, T_BALDY - 0.3, "carth");
const HP = GG.pin(HORSE, MP[0] + 34, MP[1] - 26, { t: T_BALDY - 0.2, pop: true, until: END });
B.hideUnits(["u12"], T_HEAD - 0.4);
mstamp("OLD BALDY HIT", MP[0] + 92, MP[1] + 6, T_BALDY + 0.2, { size: 12, until: END });
B.caption("THE BULLET PASSED WITHIN HALF AN INCH OF MEADE'S LEG", T_INCH - 0.4, END + 1, "carth");
// the red tide stops at Plum Run; dusk
const PRL = glowLine(GD.lines.plum_run_line, "#4f86ff", 2.6, T_GAP - 0.2, END + 1, { dur: 1.2, pulse: 3 });
K.target(...PX("plum_run_gap"), T_GAP + 0.4, { r: 26, side: "#7fb0ff", until: END });
place("plum_run_gap", T_GAP, { dx: -46, dy: 18, txt: "PLUM RUN", until: END + 1 });
GG.layer("background: linear-gradient(to left, rgba(255,120,60,0.30), rgba(120,40,40,0.25) 55%, rgba(20,20,40,0.35));", T_BALDY - 1.0, END + 1, { dur: 4.0 });
K.raiseTerritory();
B.finish();
