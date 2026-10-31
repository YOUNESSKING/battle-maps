// MOVE 3a (move3-1), Patton #15: title MOVE 3 · THE RHINE · MARCH 1945. Basemap rhine_hd_lift (z9), option 1 (territory 7 Mar ->
// 21 Mar with the E2 pale-before-loss, tools/pd_make_control.py, MacDonald). The Rhine as the last wall; Remagen (7 Mar: First Army's
// 9th Armd takes the Ludendorff bridge intact); Montgomery's Operation Plunder in the north (Wesel - Rees: night of 23 Mar, huge gun
// counters, two airborne divisions to follow); Patton's Third Army in the south. Facts: FACTCHECK_C rows 20-22.
// Built with: python3 tools/pd_inline.py move3a rhine move3-1 move3-1
// @@KIT
// @@DATA
const GP = GG.proj(9, 66790, 43242), L = (la, lo) => GP(la, lo);
const FLUK = "assets/media/uk_flag.png";
const P1 = "move3-1";
const T_MAR = at(P1, "in March nineteen"), T_WALL = at(P1, "The Rhine was the last great wall"), T_7 = at(P1, "On the seventh of March"),
  T_REM = at(P1, "captured an intact bridge"), T_ONE = at(P1, "but one bridge was not an army"), T_BIG = at(P1, "The big crossing"),
  T_PLU = at(P1, "Operation Plunder"), T_23 = at(P1, "planned for the night"), T_BOMB = at(P1, "with an enormous bombardment"),
  T_AIR = at(P1, "and two airborne divisions");
const REM = L(50.578, 7.243), WES = L(51.66, 6.62), REE = L(51.76, 6.40), KOL = L(50.94, 6.96), KOB = L(50.36, 7.59), MAI = L(50.0, 8.27),
  OPP = L(49.855, 8.36), FRA = L(50.11, 8.68), DUI = L(51.43, 6.76), BON = L(50.73, 7.10), TRI = L(49.75, 6.64), AAC = L(50.78, 6.08);
const RHINE = [[51.84, 6.05], [51.835, 6.15], [51.81, 6.28], [51.76, 6.40], [51.70, 6.50], [51.655, 6.62], [51.56, 6.70], [51.45, 6.75], [51.32, 6.77],
  [51.22, 6.78], [51.07, 6.88], [50.94, 6.97], [50.80, 7.05], [50.72, 7.11], [50.63, 7.19], [50.575, 7.24], [50.46, 7.36], [50.40, 7.47], [50.36, 7.59],
  [50.28, 7.64], [50.17, 7.71], [50.07, 7.77], [49.97, 7.90], [49.975, 8.08], [50.0, 8.27], [49.93, 8.33], [49.87, 8.355], [49.80, 8.38], [49.70, 8.37], [49.62, 8.36]].map(([a, b]) => L(a, b));
// ---------- territory (7 Mar, then pale-before-loss to 21 Mar), rivers + living map, emblem ----------
ctlImg("assets/media/pd_rhi_ctl_mar07_mx.png", 0, T_ONE + 0.05, 0.01);
loss("pd_rhi_ctl", "mar07", "mar21", T_ONE, T_ONE + 1.5, null);
drawRivers({ mpp: 193.66, clouds: 0.14 });
emblem(2240, 700, 100);
// ---------- camera: wide (both sides) -> Remagen -> north to Wesel -> wide with Patton in the south ----------
const CW = [1420, 780, 0.8], CR = [1390, 860, 1.9], CN = [1110, 250, 2.2], CE = [1500, 900, 0.82];
camera([[0, ...CW], [T_7 - 0.2, 1400, 800, 0.95], [T_REM, ...CR], [T_ONE + 0.4, ...CR], [T_BIG + 0.6, 1300, 520, 1.0], [T_PLU, ...CN], [T_AIR + 0.4, ...CN], [END, ...CE]]);
B.showDate(0.05); B.date("7 MARCH 1945", 0.1, T_ONE + 1.4, 32); B.date("21 MARCH 1945", T_ONE + 1.5, null, 32);
legend(0.2, END + 1);
B.title("MOVE 3", "THE RHINE", "MARCH 1945", 0.3, T_WALL - 0.2); SFX("hit", 0.4);
// flags (US, UK, Germany) on their ground, re-placed per shot
[[0, T_7 + 0.4, [800, 900], [2050, 520], [700, 300]], [T_7 + 0.4, T_BIG + 0.4, [1180, 950], [1620, 760], null], [T_BIG + 0.4, T_AIR + 0.8, [900, 420], [1380, 200], [820, 280]],
  [T_AIR + 0.8, END + 1, [1250, 1250], [2050, 700], [800, 420]]].forEach(([t0, t1, us, de, uk]) => {
  flagS(FL.us, "UNITED STATES", ...us, t0 + 0.15, t1); flagS(FL.de, "GERMANY", ...de, t0 + 0.25, t1); if (uk) flagS(FLUK, "BRITAIN", ...uk, t0 + 0.35, t1); });
town("COLOGNE", KOL, "l", 0.4, { shrink: [[T_7, T_BIG]] }); town("BONN", BON, "l", 0.45, { shrink: [[T_7, T_BIG]] }); town("KOBLENZ", KOB, "r", 0.5);
town("MAINZ", MAI, "r", 0.55); town("FRANKFURT", FRA, "r", 0.6); town("DUISBURG", DUI, "r", 0.65); town("TRIER", TRI, "l", 0.7); town("AACHEN", AAC, "l", 0.75);
// ---------- fronts (two-colour band, width 15 on screen) ----------
fset(GD.fronts.mar07, 0.8, 0.2, T_7 + 0.2, 1.2); fset(GD.fronts.mar07, 1.9, T_7, T_ONE + 1.6, 0.01);
fset(GD.fronts.mar21, 1.0, T_ONE + 1.5, T_PLU + 0.2, 1.0); fset(GD.fronts.mar21, 2.2, T_PLU, T_AIR + 0.8, 0.01); fset(GD.fronts.mar21, 0.82, T_AIR + 0.6, END + 1, 0.01);
// ---------- units on screen in the first second ----------
unitS("ag1", "carth", L(51.25, 6.45), "infantry", "NINTH ARMY", { t: 0.2, size: "XXXX" });
unitS("ag2", "carth", L(50.75, 6.65), "infantry", "FIRST ARMY", { t: 0.3, size: "XXXX" });
unitS("ag3", "carth", L(50.05, 6.85), "tank", "THIRD ARMY", { t: 0.4, size: "XXXX" });
unitS("br", "carth", L(51.62, 6.10), "infantry", "21ST ARMY GROUP", { t: 0.5, size: "XXXXX", flag: FLUK });
unitS("ge1", "rome", L(51.40, 7.10), "infantry", "", { t: 0.4, size: "XXXX" }); unitS("ge2", "rome", L(50.55, 7.70), "infantry", "", { t: 0.5, size: "XXXX" });
unitS("ge3", "rome", L(49.85, 7.40), "infantry", "", { t: 0.55, size: "XXXX" });
B.move("ag3", 0.4, 6, ...L(50.20, 7.10)); B.move("ag1", 0.5, 5, ...L(51.32, 6.60));
shoot(L(51.40, 7.00), L(51.30, 6.66), 1.0, { r: 6, h: 18 }); shoot(L(50.62, 7.55), L(50.70, 7.00), 2.0, { r: 6, h: 18 });
// ---------- the Rhine: the last wall ----------
glowPath(RHINE, "#8fd0ff", 7, T_WALL - 0.2, T_7 + 0.2, 2, 0.95, { draw: 1.8, top: true });
sstamp("THE LAST WALL", 150, T_WALL + 0.4, { size: 54, color: "#8fd0ff", until: T_7 - 0.1 });
// ---------- 7 March: Remagen ----------
unitS("ad9", "carth", L(50.62, 7.15), "tank", "9TH ARMD · FIRST ARMY", { t: T_7, size: "XX" });
B.move("ad9", T_REM - 0.4, 1.6, REM[0] - 10, REM[1] - 2);
icon("bridge", REM, T_REM - 0.2, END + 1, "#fff", 0.8, 50);
K.target(...REM, T_REM + 0.1, { r: 16, side: "#ffd54a", until: T_BIG + 0.4 });
wstampS("REMAGEN · 7 MARCH · INTACT", REM[0] + 70, REM[1] + 40, T_REM + 0.5, T_BIG, "#8fb4ff", 20);
B.move("ad9", T_ONE - 0.6, 1.0, REM[0] + 12, REM[1] + 2);
[[L(50.66, 7.45), L(50.60, 7.30)], [L(50.47, 7.48), L(50.55, 7.31)]].forEach((pts, k) => arw({ side: "rome", pts, width: AW(1.9, 12), t: T_ONE - 0.2 + k * 0.3, dur: 0.8, until: T_BIG + 0.4 }));
B.caption("ONE BRIDGE IS NOT AN ARMY", T_ONE + 0.1, T_BIG - 0.1, "carth");
// the armies close up to the river by 21 March
B.move("ag3", T_ONE + 1.5, 2.0, ...L(49.95, 8.05)); B.move("ag2", T_ONE + 1.5, 2.0, ...L(50.82, 6.85));
// ---------- Montgomery's Plunder in the north ----------
badge({ name: "BERNARD MONTGOMERY", role: "FIELD MARSHAL · 21ST ARMY GROUP", initials: "BLM", photo: PHOTO("montgomery"), flag: FLUK, side: "carth", corner: "br", t: T_BIG - 0.1, until: T_AIR + 0.6 });
B.move("br", T_BIG, 1.5, ...L(51.74, 6.24));
const GUNS = [[51.78, 6.30], [51.725, 6.37], [51.67, 6.46], [51.61, 6.55]].map(([a, b]) => L(a, b));
GUNS.forEach((p, k) => unitS("gun" + k, "carth", p, "artillery", k === 1 ? "PLUNDER ARTILLERY" : "", { t: T_PLU - 0.2 + k * 0.12, w: 64, h: 42, flag: FLUK, size: "III" }));
sstamp("OPERATION PLUNDER", 150, T_PLU - 0.1, { size: 56, color: "#8fb4ff", sub: "NIGHT OF 23 MARCH 1945", until: T_AIR + 0.4 });
glowPath([L(51.77, 6.33), L(51.70, 6.48), L(51.64, 6.60), L(51.58, 6.68)], "#f6d36b", 4, T_23, T_AIR + 0.8, 2, 0.9, { draw: 1.0, top: true });
// the enormous bombardment (planned): guns flash, shells land on the far bank (boom + shake)
GUNS.forEach((p, k) => shoot(p, L(51.74 - k * 0.04, 6.52 + k * 0.035), T_BOMB + k * 0.3, { r: 7, h: 16, dur: 0.7 }));
// two airborne divisions to follow (icons east of the river)
[[L(51.73, 6.63), "6TH AIRBORNE", FLUK], [L(51.66, 6.70), "17TH AIRBORNE", FL.us]].forEach(([p, nm, fl], k) => {
  pinS(GG.chute(p[0], p[1], T_AIR + k * 0.4, { s: 44, color: "#1f4fc4", until: END - 0.4 })); boxS(nm, p[0] + 80, p[1] + (k ? 20 : -20), T_AIR + 0.2 + k * 0.4, END - 0.4, { size: 13 }); });
SFX("hit", T_AIR + 0.1);
// ---------- Patton in the south (pull-out) ----------
K.target(...L(49.95, 8.05), T_AIR + 0.8, { r: 26, side: "carth", until: END + 1 });
badge({ name: "GEORGE S. PATTON", role: "THIRD ARMY · IN THE SOUTH", initials: "GSP", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "bl", t: T_AIR + 0.8, until: END + 1 });
fixImgs();
B.finish();
