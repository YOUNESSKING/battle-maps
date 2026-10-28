// MOVE 3b (move3-6..7), William T. Sherman #13: BENTONVILLE, 19-21 March 1865 (option 2: glowing two-colour fronts, no territory fill).
// 19 Mar: the hook-shaped Confederate line in the woods; Slocum's left wing (XIV Corps) marches into it; afternoon: the attack drives part of
// the Union line back; the line re-forms and holds until dark; couriers ride; the right wing marches through the night (K.night).
// 21 Mar: Johnston almost surrounded (three sides), Mill Creek + one bridge behind him; Mower's division through the swamp, overruns
// Johnston's HQ, close to the bridge; PULL BACK; quote card (Memoirs 1875); night: Johnston escapes over Mill Creek; CASUALTIES 1,527 / 2,606.
// Basemap bentonville_hd_ref (z13, 35.30N 78.32W, 15.6 m/px). Built with: python3 tools/build_scene.py move3b bentonville_hd_ref move3-6 move3-7
// Source: assets/src/move3b_body.js + m3_kit.js, assembled by tools/make_m3_scenes.py. Geo/swamp: tools/make_m3_geo.py (Mill Creek DEM-traced,
// checked against OSM). Positions: OSM/NC Historic Sites markers (Harper House, Morris farm, Cole plantation, Johnston's HQ, Sherman's HQ,
// Bentonville village); lines schematic after the ABT / NC Historic Sites maps. Facts: FACT_NOTES.md (Move 3), FACT_NOTES_carolinas.md.
// ==== BODY
const L = GG.proj(13, 590888, 827729);
const P6 = "move3-6", P7 = "move3-7";
const T_19 = at(P6, "On the nineteenth of March"), T_TRAP = at(P6, "walked straight into the trap"), T_AFT = at(P6, "In the afternoon"),
  T_DROVE = at(P6, "drove part of the Union line back"), T_HELD = at(P6, "But the veterans re-formed and held"), T_AAA = at(P6, "attack after attack"),
  T_DARK = at(P6, "until dark"), T_COUR = at(P6, "Slocum's couriers rode through the night"), T_TURN = at(P6, "turned his whole right wing around"),
  T_MARCH = at(P6, "marched it to the battlefield");
const T7 = B.P(P7), T_21 = at(P7, "By the twenty-first"), T_SURR = at(P7, "almost surrounded"), T_CREEK = at(P7, "a flooded creek and a single bridge"),
  T_DIV = at(P7, "One Union division broke through the swamp"), T_HQ = at(P7, "overran Johnston's headquarters"), T_CLOSE = at(P7, "got close to that bridge"),
  T_CALL = at(P7, "Sherman called it back"), T_BIG = at(P7, "He did not want a big battle"), T_YEARS = at(P7, "Years later, he wrote"),
  T_MIST = at(P7, "I think I made a mistake there"), T_ESC = at(P7, "That night, Johnston escaped");
// ---------- layers (option 2: no territory fill; the flooded creek bottoms) ----------
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 }); LV.shimmer(GD.rivers || [], { width: 1.6 }); LV.scaleBar(15.6); LV.north();
const SW = wimg("assets/media/bentonville_swamp.png", 0, 0, null); gsap.set(SW, { opacity: 0.75 });
tl.to(SW, { opacity: 1, duration: 1.2, yoyo: true, repeat: 17, ease: "sine.inOut" }, 0.5);
if (GD.geo) wimg(GD.geo, 0, 0, null);
// ---------- places (map px; OSM / NC Historic Sites markers) ----------
const Q = { VIL: L(35.3488, -78.2969), JHQ: L(35.347, -78.2928), BR: L(35.3618, -78.2901), HAR: L(35.302, -78.3231), MOR: L(35.3084, -78.309),
  COLE: L(35.3163, -78.3024), SHQ: L(35.3305, -78.2721) };
const lab = (txt, q, t, o = {}) => { if (o.dot !== false) B.city("", q[0], q[1], { r: o.r || 3, t, until: o.until }); return box(txt, q[0] + (o.dx || 0), q[1] + (o.dy != null ? o.dy : -14), t, o.size || 10, o.until, o.pop === true); };
// the Goldsboro road (west -> east through the field) + the road north over the Mill Creek bridge (Johnston's only way out)
const RD = [[900, 930], [1250, 860], [Q.HAR[0] + 6, Q.HAR[1] - 8], [Q.MOR[0], Q.MOR[1] - 6], [Q.COLE[0] + 10, Q.COLE[1] + 4], [1700, 640], [1900, 590], [2300, 520], [2880, 470]];
const RDN = [[Q.COLE[0] + 10, Q.COLE[1] + 4], [Q.VIL[0] + 4, Q.VIL[1] + 60], Q.VIL, [Q.BR[0] - 4, Q.BR[1] + 30], Q.BR, [Q.BR[0] - 30, Q.BR[1] - 120], [Q.BR[0] - 60, 0]];
const roads = svgG(`<path d="${dOf(RD)}" fill="none" stroke="#d8c39a" stroke-width="2.6" stroke-dasharray="7 4" opacity="0.85"/><path d="${dOf(RDN)}" fill="none" stroke="#d8c39a" stroke-width="2.2" stroke-dasharray="6 4" opacity="0.8"/>`, true);
box("GOLDSBORO ROAD", 1180, 905, 0.4, 9, END + 1, false);
lab("BENTONVILLE", Q.VIL, 0.3, { dx: -60, dy: -6, size: 11 });
lab("HARPER HOUSE", Q.HAR, 0.5, { dx: -54, dy: 16, size: 8 });
const LMC = box("MILL CREEK", Q.BR[0] - 150, Q.BR[1] - 6, 0.4, 10, END + 1, false);
const BRI = GG.pin(`<svg width="22" height="12" viewBox="0 0 22 12" style="display:block;filter:drop-shadow(0 1px 2px #000)"><rect x="1" y="3" width="20" height="6" fill="#8a6a44" stroke="#f3eee2" stroke-width="1.2"/>${[5, 9, 13, 17].map((x) => `<line x1="${x}" y1="3" x2="${x}" y2="9" stroke="#f3eee2" stroke-width="0.8"/>`).join("")}</svg>`, Q.BR[0], Q.BR[1], { t: 0.4 });
// ---------- camera shots + flags ----------
const SH = [[[1440, 810, 0.6667], null, 0, [700, 300], [1450, 820]],
  [[1490, 720, 2.2], 0.4, 3.6, [1500, 330], [520, 850]],                  // 19 Mar: the hook in the woods
  [[1680, 760, 1.15], T_COUR - 0.6, 2.6, [880, 300], [1700, 880]],         // night: the right wing marches up
  [[1600, 600, 1.75], T7 - 0.2, 2.6, [1150, 290], [300, 860]],             // 21 Mar: almost surrounded
  [[1660, 470, 2.7], T_DIV - 0.4, 2.4, [700, 330], [1560, 800]],           // Mower toward the bridge
  [[1610, 560, 1.9], T_YEARS - 0.2, 2.4, [1500, 360], [460, 840]]];        // that night: Johnston escapes
runShots(SH);
// ---------- date, legend ----------
B.showDate(0.05);
B.date("19 MARCH 1865", 0.1, T_DARK - 0.2, 32); B.date("19-20 MARCH 1865 · NIGHT", T_DARK - 0.1, T7 - 0.2, 32); B.date("21 MARCH 1865", T7 - 0.1, T_ESC - 0.3, 32);
B.date("21 MARCH 1865 · NIGHT", T_ESC - 0.2, END + 1, 32);
legend(0.2, END + 1, true);
// ---------- move3-6: 19 March ----------
const FW1 = fw(2.2);
badge({ name: "HENRY W. SLOCUM", role: "LEFT WING · XIV + XX CORPS", photo: "assets/media/slocum_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_19 - 0.2, until: T_COUR + 1.2 });
// the hook-shaped Confederate line in the woods (Hoke across the road, the Army of Tennessee bent back to the north-west)
const HOOK = [[Q.COLE[0] + 44, Q.COLE[1] + 120], [Q.COLE[0] + 36, Q.COLE[1] + 50], [Q.COLE[0] + 30, Q.COLE[1] - 10], [Q.COLE[0] - 10, Q.COLE[1] - 70], [Q.COLE[0] - 80, Q.COLE[1] - 120], [Q.COLE[0] - 160, Q.COLE[1] - 150]];
const HOOKG = svgG(`<path d="${dOf(HOOK)}" fill="none" stroke="#ff5a4a" stroke-width="4" stroke-dasharray="9 6" opacity="0.95" style="filter:drop-shadow(0 0 5px #ff3b30)"/>`); GG.hide(HOOKG);
tl.to(HOOKG, { autoAlpha: 1, duration: 0.6 }, 1.0); tl.to(HOOKG, { autoAlpha: 0, duration: 0.6 }, T_TRAP + 1.6);
tag("HIDDEN IN THE WOODS", Q.COLE[0] - 40, Q.COLE[1] - 170, 1.3, RED, 10, T_AFT);
[["hk", [Q.COLE[0] + 52, Q.COLE[1] + 60], "HOKE"], ["aot", [Q.COLE[0] - 50, Q.COLE[1] - 120], "ARMY OF TENNESSEE"], ["hd", [Q.COLE[0] + 30, Q.COLE[1] - 50], "HARDEE"]].forEach(([id, q, lb], k) =>
  unit(id, "rome", ...q, "infantry", { t: 1.2 + k * 0.15, size: "XX", label: lb, w: 26, h: 17, fs: 5.4, until: T7 - 0.3 }));
badge({ name: "JOSEPH E. JOHNSTON", role: "~20,000 MEN", photo: "assets/media/johnston_head.png", flag: FL.csa, side: "rome", corner: "bl", t: 1.0, until: T_19 + 3.4 });
// XIV Corps marches east on the road into the angle
const CAR0 = [1180, 875], MOR0 = [1230, 890];
unit("car", "carth", ...CAR0, "infantry", { t: T_19, size: "XX", label: "CARLIN", w: 26, h: 17, fs: 5.4, until: T7 - 0.3 });
unit("mrg", "carth", ...MOR0, "infantry", { t: T_19 + 0.1, size: "XX", label: "MORGAN", w: 26, h: 17, fs: 5.4, until: T7 - 0.3 });
tag("XIV CORPS", 1250, 820, T_19 + 0.3, BLUE, 10, T_AFT);
arr([[1150, 870], [1300, 840], [Q.MOR[0] - 20, Q.MOR[1] - 30], [Q.COLE[0] - 30, Q.COLE[1] - 30]], "carth", T_TRAP - 0.6, { w: 9, dur: 1.6, until: T_AFT + 0.4 });
go("car", T_TRAP - 0.4, 2.0, [Q.COLE[0] - 50, Q.COLE[1] - 30]); go("mrg", T_TRAP - 0.3, 2.0, [Q.COLE[0] - 20, Q.COLE[1] + 50]);
mstamp("TRAP", ...fpos(SH[1][0], 1380, 800), T_TRAP + 0.6, { size: 16, until: T_AFT + 0.6 });
// the line where they touch (option 2): first contact, then the afternoon attack bends the Union left back
const F0 = [[Q.COLE[0] + 6, Q.COLE[1] + 110], [Q.COLE[0] - 2, Q.COLE[1] + 40], [Q.COLE[0] - 16, Q.COLE[1] - 20], [Q.COLE[0] - 60, Q.COLE[1] - 64], [Q.COLE[0] - 120, Q.COLE[1] - 100]];
const F1 = [[Q.COLE[0] + 6, Q.COLE[1] + 110], [Q.COLE[0] - 10, Q.COLE[1] + 50], [Q.MOR[0] - 30, Q.MOR[1] - 10], [Q.MOR[0] - 90, Q.MOR[1] - 30], [Q.MOR[0] - 150, Q.MOR[1] - 30]];
const FR19 = frontS({ pts: F0, sideA: "carth", sideB: "rome", width: FW1, t: T_TRAP + 0.8, dur: 1.2, to: F1, moveT: T_DROVE - 0.2, moveDur: 2.4, until: T7 - 0.4 });
// the afternoon attack: red sweeps down on the Union left (Carlin) -> falls back through the woods to the Morris farm
[[Q.COLE[0] - 120, Q.COLE[1] - 170], [Q.COLE[0] - 40, Q.COLE[1] - 150]].forEach((a, k) => arr([a, [Q.MOR[0] - 70 + k * 40, Q.MOR[1] - 50]], "rome", T_AFT - 0.2 + k * 0.2, { w: 9, dur: 1.4, until: T_HELD + 0.6 }));
go("aot", T_AFT, 2.4, [Q.MOR[0] - 70, Q.MOR[1] - 70], "power2.in");
go("car", T_DROVE - 0.1, 1.8, [Q.MOR[0] - 70, Q.MOR[1] + 4], "power2.out");
[0, 1, 2, 3].forEach((k) => shoot([Q.COLE[0] - 60 + k * 18, Q.COLE[1] - 150], [Q.MOR[0] - 60 + k * 22, Q.MOR[1] - 30 + k * 6], T_AFT + 0.2 + k * 0.35, { r: 7, h: 22, dur: 0.5 }));
mg([Q.MOR[0] - 40, Q.MOR[1] - 70], [Q.MOR[0] - 50, Q.MOR[1] - 26], T_DROVE, 5); mg([Q.MOR[0] + 10, Q.MOR[1] - 60], [Q.MOR[0] - 10, Q.MOR[1] - 22], T_DROVE + 0.3, 5);
tag("THE UNION LEFT DRIVEN BACK", Q.MOR[0] - 170, Q.MOR[1] - 120, T_DROVE + 0.2, RED, 10, T_HELD + 0.4);
// re-formed and held: XX Corps line at the Morris farm; ring holds; attack after attack thrown back
unit("x20", "carth", Q.MOR[0] - 40, Q.MOR[1] + 34, "infantry", { t: T_HELD - 0.4, size: "XXX", label: "XX CORPS", w: 28, h: 19, fs: 5.6, until: T7 - 0.3 });
K.target(Q.MOR[0] - 30, Q.MOR[1] - 10, T_HELD, { r: 70, side: "#5b8fe8", until: T_DARK + 0.8 });
[0, 1, 2].forEach((k) => { const tt = T_AAA - 0.3 + k * 0.9;
  tArrow([[Q.COLE[0] - 70 + k * 20, Q.COLE[1] - 120 + k * 10], [Q.MOR[0] - 40 + k * 18, Q.MOR[1] - 44]], RED, tt, tt + 1.2, 3.2, { dur: 0.6 });
  mg([Q.MOR[0] - 50 + k * 14, Q.MOR[1] - 10], [Q.MOR[0] - 46 + k * 18, Q.MOR[1] - 46], tt + 0.5, 4);
  shoot([Q.HAR[0] + 20, Q.HAR[1] - 10], [Q.MOR[0] - 30 + k * 20, Q.MOR[1] - 70], tt + 0.4, { r: 7, h: 20, dur: 0.5 }); });
mstamp("HELD", Q.MOR[0] + 70, Q.MOR[1] + 70, T_AAA + 1.2, { size: 16, color: "#5b8fe8", sub: "ATTACK AFTER ATTACK · UNTIL DARK", until: T_COUR + 0.2 });
// night: couriers ride to Sherman; the right wing turns around and marches through the dark
const NT1 = GG.night(T_DARK - 0.2, T7 - 0.2, { dur: 1.6, outDur: 1.4 });
K.night({ lines: [FR19], tOn: T_DARK - 0.2, tOff: T7 - 0.4 });
const COUR = [[Q.HAR[0] + 10, Q.HAR[1] + 10], [1700, 900], [2100, 1050], [2600, 1250], [2880, 1350]];
const cg = svgG(`<path d="${dOf(COUR)}" fill="none" stroke="#f2e6b8" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`); GG.hide(cg);
tl.to(cg, { autoAlpha: 1, duration: 0.5 }, T_COUR - 0.2); tl.to(cg, { autoAlpha: 0, duration: 0.5 }, T7);
[0, 1].forEach((k) => { const h = GG.pin(`<div style="transform:scale(0.9)">${HORSE}</div>`, COUR[0][0], COUR[0][1], { t: T_COUR - 0.1 + k * 0.4, until: T_TURN + 1.6 }); follow2(h, COUR, T_COUR + k * 0.4, 2.6, "power1.in"); });
tag("COURIERS TO SHERMAN", 2050, 1000, T_COUR + 0.3, "#5b6f8f", 11, T_MARCH + 0.4);
badge({ name: "OLIVER O. HOWARD", role: "RIGHT WING · XV + XVII CORPS", photo: "assets/media/howard_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_TURN - 0.3, until: T7 + 0.6 });
const RWP = [[[2700, 1500], [2300, 1120], [1950, 880], [1760, 720]], [[2860, 1300], [2450, 980], [2050, 760], [1800, 640]]];
RWP.forEach((p, k) => { arr(p, "carth", T_TURN + k * 0.3, { w: 12, dur: 2.6, until: T7 + 0.4 });
  unit("rw" + k, "carth", ...p[0], "infantry", { t: T_TURN + k * 0.2, size: "XXX", label: k ? "XVII" : "XV", w: 30, h: 20, fs: 6, until: END + 1 }); follow("rw" + k, p, T_TURN + 0.2 + k * 0.3, 3.0, "power1.inOut"); });
tag("MARCHING ALL NIGHT", 2000, 1020, T_MARCH, BLUE, 12, T7);
// ---------- move3-7: 21 March ----------
const FW3 = fw(1.75), FW4 = fw(2.7);
// Johnston's U-shaped line: Hoke across the road (south), the line north to Bentonville, the left refused to Mill Creek; the creek + ONE bridge behind
const U21 = [[Q.HAR[0] + 120, Q.HAR[1] + 40], [Q.COLE[0] + 20, Q.COLE[1] + 70], [Q.COLE[0] + 70, Q.COLE[1] - 10], [Q.SHQ[0] - 60, Q.SHQ[1] - 40], [Q.JHQ[0] + 90, Q.JHQ[1] + 20], [Q.JHQ[0] + 60, Q.JHQ[1] - 60]];
const U21b = [[Q.HAR[0] + 120, Q.HAR[1] + 40], [Q.COLE[0] + 20, Q.COLE[1] + 70], [Q.COLE[0] + 70, Q.COLE[1] - 10], [Q.SHQ[0] - 60, Q.SHQ[1] - 40], [Q.JHQ[0] + 60, Q.JHQ[1] + 40], [Q.JHQ[0] + 20, Q.JHQ[1] - 30]];
const W21 = [[Q.HAR[0] - 40, Q.HAR[1] - 40], [Q.MOR[0] - 120, Q.MOR[1] - 120], [Q.COLE[0] - 220, Q.COLE[1] - 230], [Q.VIL[0] - 150, Q.VIL[1] + 40]];
const FR21 = frontS({ pts: U21, sideA: "rome", sideB: "carth", width: FW3, t: T7 + 0.2, dur: 1.4, to: U21b, moveT: T_HQ - 0.2, moveDur: 1.4, until: END + 0.5 });
const FR21w = frontS({ pts: W21, sideA: "carth", sideB: "rome", width: FW3, t: T7 + 0.4, dur: 1.4, until: END + 0.5 });
unit("jo", "rome", Q.COLE[0] + 10, Q.COLE[1] - 100, "infantry", { t: T7 + 0.2, size: "XXXX", label: "JOHNSTON", w: 30, h: 20, fs: 6, until: END + 1 });
unit("w14", "carth", Q.MOR[0] - 150, Q.MOR[1] - 80, "infantry", { t: T7 + 0.3, size: "XXX", label: "XIV", w: 26, h: 17, fs: 6, until: END + 1 });
unit("w20", "carth", Q.HAR[0] - 30, Q.HAR[1] + 20, "infantry", { t: T7 + 0.3, size: "XXX", label: "XX", w: 26, h: 17, fs: 6, until: END + 1 });
go("rw0", T7 + 0.2, 1.4, [Q.COLE[0] + 150, Q.COLE[1] + 40]); go("rw1", T7 + 0.2, 1.4, [Q.SHQ[0] - 10, Q.SHQ[1] - 10]);
[[[Q.HAR[0] - 160, Q.HAR[1] - 120], [Q.MOR[0] - 120, Q.MOR[1] - 140]], [[Q.HAR[0] + 40, Q.HAR[1] + 160], [Q.COLE[0] + 10, Q.COLE[1] + 110]], [[Q.SHQ[0] + 160, Q.SHQ[1] + 90], [Q.SHQ[0] - 30, Q.SHQ[1] - 20]]].forEach((a, k) =>
  arr(a, "carth", T_SURR - 0.4 + k * 0.25, { w: 9, dur: 1.2, until: T_DIV + 0.2 }));
tag("THREE SIDES", Q.COLE[0] + 100, Q.COLE[1] + 160, T_SURR + 0.3, BLUE, 12, T_DIV);
tl.to(LMC, { scale: 1.35, duration: 0.4, ease: "back.out(2)" }, T_CREEK); SFX("ref:pop", T_CREEK + 0.1);
K.target(Q.BR[0], Q.BR[1], T_CREEK + 0.4, { r: 26, side: "#ff3b30", until: END + 1 });
const ONEB = tag("THE ONLY BRIDGE", Q.BR[0] + 90, Q.BR[1] - 30, T_CREEK + 0.6, RED, 10, T_CALL);
tl.to(SW, { opacity: 1, duration: 0.5 }, T_CREEK);
// Mower: through the swamp into Johnston's rear, overruns the HQ, close to the bridge; PULL BACK
const FW4u = FW4;
badge({ name: "JOSEPH A. MOWER", role: "DIVISION · XVII CORPS", photo: "assets/media/mower_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_DIV - 0.4, until: T_CALL });
const MOWP = [[Q.SHQ[0] + 160, Q.SHQ[1] - 90], [Q.JHQ[0] + 120, Q.JHQ[1] - 30], [Q.JHQ[0] + 40, Q.JHQ[1] - 40], [Q.BR[0] + 22, Q.BR[1] + 26]];
unit("mow", "carth", ...MOWP[0], "infantry", { t: T_DIV - 0.4, size: "XX", label: "MOWER", w: 22, h: 15, fs: 5, until: END + 1 });
const MOWA = arr(MOWP, "carth", T_DIV - 0.1, { w: 8, dur: T_CLOSE - T_DIV + 0.6, until: T_CALL + 0.6 });
follow("mow", MOWP, T_DIV, T_CLOSE - T_DIV + 0.8, "power1.inOut");
[0.25, 0.45, 0.65].forEach((f, i) => { const q = atLen(MOWP, cumOf(MOWP), cumOf(MOWP).slice(-1)[0] * f); ripple(q[0], q[1], T_DIV + 0.3 + i * 0.5, 2, 6, T_CALL); });
const HQ = GG.pin(`<div style="transform:scale(1.1)">${HQF.replace(BLUE, RED)}</div>`, Q.JHQ[0], Q.JHQ[1], { t: T7 + 0.4 });
tl.to(HQ, { left: Q.BR[0] - 10, top: Q.BR[1] - 50, duration: 1.4, ease: "power2.in" }, T_HQ + 0.1);
mstamp("HQ OVERRUN", Q.JHQ[0] - 70, Q.JHQ[1] + 40, T_HQ + 0.3, { size: 11, until: T_CALL + 0.4 });
[0, 1].forEach((k) => { K.impact(Q.JHQ[0] + 10 - k * 14, Q.JHQ[1] + 6 + k * 10, T_HQ + 0.2 + k * 0.35, { r: 6, puffs: 2 }); });
mg([Q.JHQ[0] + 40, Q.JHQ[1] - 8], [Q.JHQ[0] - 4, Q.JHQ[1] + 2], T_HQ + 0.1, 5);
// Hardee's countercharge near the village (OSM marker "Hardee's Countercharge")
arr([[Q.VIL[0] - 80, Q.VIL[1] - 40], [Q.JHQ[0] + 10, Q.JHQ[1] - 40]], "rome", T_CLOSE + 0.2, { w: 8, dur: 1.0, until: T_BIG + 0.6 });
badge({ name: "WILLIAM T. SHERMAN", role: "CALLS MOWER BACK", photo: "assets/media/sherman_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_CALL - 0.3, until: T_YEARS + 0.4 });
sstamp("PULL BACK", 360, T_CALL + 0.1, { size: 74, color: "#9fc0ea", sub: "SHERMAN · 21 MARCH 1865", until: T_YEARS - 0.2 });
const BACKP = [[Q.BR[0] + 22, Q.BR[1] + 26], [Q.JHQ[0] + 110, Q.JHQ[1] - 20], [Q.SHQ[0] + 60, Q.SHQ[1] - 60]];
tArrow(BACKP, BLUE, T_CALL + 0.4, END + 0.5, 5, { dur: 1.2, dash: "9 7" }); follow("mow", BACKP, T_CALL + 0.5, 1.8, "power1.inOut");
B.caption("NOT A BIG BATTLE BEFORE HIS REINFORCEMENTS ARRIVED", T_BIG - 0.1, T_YEARS - 0.1);
quote("“I THINK I MADE A MISTAKE THERE”", "SHERMAN · MEMOIRS (1875)", "left:110px;top:640px;", T_YEARS + 0.2, T_ESC - 0.1);
// that night: Johnston crosses Mill Creek and is gone
const NT2 = GG.night(T_ESC - 0.4, null, { dur: 1.2 });
K.night({ lines: [FR21, FR21w], tOn: T_ESC - 0.4 });
[[Q.COLE[0] + 10, Q.COLE[1] - 100], [Q.JHQ[0] + 40, Q.JHQ[1] + 30]].forEach((a, k) => arr([a, [Q.BR[0] - 6 + k * 10, Q.BR[1] + 20], [Q.BR[0] - 24 + k * 10, Q.BR[1] - 70]], "rome", T_ESC + k * 0.25, { w: 5, dur: 1.4 }));
go("jo", T_ESC + 0.2, 1.6, [Q.BR[0] - 20, Q.BR[1] - 120], "power1.in");
casCard("1,527", "2,606", "CASUALTIES · BENTONVILLE, 19-21 MAR 1865 · OFFICIAL RETURNS / ABT", "left:0;right:0;margin:auto;width:640px;top:760px;", T_ESC + 0.6, END + 1);
K.raiseTerritory();
B.finish();
