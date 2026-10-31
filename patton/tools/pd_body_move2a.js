// MOVE 2a (move2-1), Patton #15: title MOVE 2 · BASTOGNE · DECEMBER 1944. The German offensive of 16 Dec 1944 grows into a salient
// (option 1, territory 16 Dec -> 19 Dec with the E2 pale-before-loss), the 106th Division destroyed on the Schnee Eifel (19 Dec, at least
// 7,000), Antwerp the goal (pulsing ring far north), Bastogne where the road web meets, the garrison (101st Airborne, CCB 10th Armd,
// about 40 tanks). Basemap ardennes_hd_lift (z9). Facts: FACTCHECK_B rows 1, 3, 4, 7, 9 (Cole). Control: tools/pd_make_control.py.
// Built with: python3 tools/pd_inline.py move2a ardennes move2-1 move2-1
// @@KIT
// @@DATA
const GP = GG.proj(9, 66098, 43528), L = (la, lo) => GP(la, lo);
const P1 = "move2-1";
const T_16 = at(P1, "on the sixteenth of December"), T_HID = at(P1, "The Germans had hidden"), T_200 = at(P1, "more than two hundred thousand"),
  T_500 = at(P1, "about five hundred tanks"), T_THIN = at(P1, "hit a thinly held"), T_GOAL = at(P1, "Their goal was Antwerp"),
  T_PORT = at(P1, "the port that fed"), T_DAYS = at(P1, "Within days"), T_106 = at(P1, "the Hundred and Sixth"), T_7000 = at(P1, "at least seven thousand"),
  T_SCH = at(P1, "on the Schnee Eifel"), T_BAS = at(P1, "In the middle of the forest lay Bastogne"), T_MET = at(P1, "where the roads met"),
  T_WHO = at(P1, "Whoever held the town"), T_INS = at(P1, "The Americans inside"), T_101 = at(P1, "the Hundred and First Airborne"),
  T_10 = at(P1, "a combat command of the Tenth Armored"), T_40 = at(P1, "about forty tanks");
const BAS = L(50.0, 5.717), ANT = L(51.22, 4.40), SCH = L(50.25, 6.38), STV = L(50.28, 6.13), LIE = L(50.63, 5.57), BRU = L(50.85, 4.35),
  LUX = L(49.61, 6.13), NAM = L(50.47, 4.87), AAC = L(50.78, 6.08);
// ---------- territory 16 Dec (+ pale-before-loss into 19 Dec), rivers + living map, emblem ----------
ctlImg("assets/media/pd_ard_ctl_dec16_mx.png", 0, T_DAYS + 0.05, 0.01);
loss("pd_ard_ctl", "dec16", "dec19", T_DAYS, T_DAYS + 1.6, null);
drawRivers({ mpp: 195.71, clouds: 0.14 });
emblem(2240, 640, 95);
// ---------- camera: B2 wide (both sides + Antwerp) -> the thin front -> Antwerp -> Schnee Eifel -> Bastogne ----------
const CW = [1430, 690, 0.86], CF = [1660, 830, 1.35], CA = [1330, 620, 0.9], CS = [1700, 800, 1.9], CB = [1535, 915, 2.3], CB2 = [1530, 925, 2.6];
camera([[0, ...CW], [T_HID, 1450, 720, 0.9], [T_THIN, ...CF], [T_GOAL - 0.2, ...CF], [T_GOAL + 1.3, ...CA], [T_DAYS, ...CA], [T_106 + 0.4, ...CS],
  [T_BAS - 0.6, ...CS], [T_BAS + 1.2, ...CB], [T_INS, ...CB], [END, ...CB2]]);
B.showDate(0.05); B.date("16 DECEMBER 1944", 0.1, T_DAYS + 0.4, 32); B.date("19 DECEMBER 1944", T_DAYS + 0.5, null, 32);
legend(0.2, END + 1);
B.title("MOVE 2", "BASTOGNE", "DECEMBER 1944", 0.3, T_16 + 1.2); SFX("hit", 0.4);
// flags on each side's ground, moved with the camera (both visible on every shot)
[[0, T_THIN - 0.1, [1150, 820], [2060, 560]], [T_THIN, T_GOAL + 0.6, [1450, 960], [1960, 700]], [T_GOAL + 0.6, T_DAYS + 2.4, [930, 760], [1880, 470]],
  [T_DAYS + 2.4, T_BAS + 0.4, [1560, 900], [1930, 660]], [T_BAS + 0.4, END + 1, [1260, 1000], [1790, 860]]].forEach(([t0, t1, us, de], k) => {
  flagS(FL.us, "UNITED STATES", ...us, t0 + 0.15, t1); flagS(FL.de, "GERMANY", ...de, t0 + 0.25, t1); });
// big towns (A2), shrink near the fight
town("ANTWERP", ANT, "l", 0.4); town("BRUSSELS", BRU, "l", 0.5); town("LIÈGE", LIE, "l", 0.55); town("NAMUR", NAM, "l", 0.6);
town("LUXEMBOURG", LUX, "r", 0.65); town("AACHEN", AAC, "r", 0.7);
town("BASTOGNE", BAS, "l", 0.75, { shrink: [[T_INS - 0.3, null]] });
// ---------- 16 Dec: the front, the thin American line, the German attack out of the forest ----------
fset([GD.fronts.dec16], 0.9, 0.2, T_THIN, 1.2);
fset([GD.fronts.dec16], 1.35, T_THIN - 0.1, T_GOAL + 1.0, 0.01);
fset([GD.fronts.dec16], 0.9, T_GOAL + 1.0, T_DAYS + 1.7, 0.01);
fset([GD.fronts.dec19], 1.9, T_DAYS + 1.5, T_BAS + 0.6, 1.0);
fset([GD.fronts.dec19], 2.4, T_BAS + 0.5, END + 1, 0.01);
const USL = [["u99", L(50.47, 6.22), "99TH"], ["u106", L(50.25, 6.33), "106TH"], ["u28", L(50.0, 6.08), "28TH"], ["u4", L(49.78, 6.30), "4TH"]];
USL.forEach(([id, p, nm], k) => unitS(id, "carth", p, "infantry", nm, { t: 0.2 + k * 0.1, size: "XX" }));
const DEL = [["d6", L(50.42, 6.55), "tank", "6TH SS PZ ARMY"], ["d5", L(50.15, 6.55), "tank", "5TH PZ ARMY"], ["d7", L(49.92, 6.55), "infantry", "7TH ARMY"]];
DEL.forEach(([id, p, ic, nm], k) => unitS(id, "rome", p, ic, nm, { t: 0.3 + k * 0.1, size: "XXXX" }));
// guns firing on the first morning (impacts: boom + shake)
[[L(50.40, 6.50), L(50.45, 6.27)], [L(50.18, 6.52), L(50.26, 6.36)], [L(49.95, 6.45), L(50.0, 6.13)], [L(50.10, 6.50), L(50.05, 6.20)]].forEach(([a, b], k) =>
  shoot(a, b, 0.9 + k * 1.1, { r: 6, h: 24, dur: 0.8 }));
// the attack: red arrows out of the forest
const AR = [[L(50.42, 6.50), L(50.43, 6.10), L(50.40, 5.85)], [L(50.20, 6.50), L(50.17, 6.05), L(50.08, 5.82)], [L(50.10, 6.48), L(50.02, 6.05), L(50.0, 5.85)],
  [L(49.92, 6.50), L(49.90, 6.20), L(49.93, 5.98)]];
AR.forEach((pts, k) => arw({ side: "rome", pts, width: AW(0.9, 15), t: T_16 + 0.4 + k * 0.5, dur: 2.0, until: T_DAYS + 1.6 }));
B.move("d6", T_16 + 0.6, 4, ...L(50.43, 6.30)); B.move("d5", T_16 + 0.8, 4, ...L(50.15, 6.25)); B.move("d7", T_16 + 1.0, 4, ...L(49.92, 6.28));
// numbers (ticks)
tickCard("THE GERMAN BLOW · 16 DEC", 200000, "left:70px;top:150px;", T_200 - 0.3, 1.8, T_THIN + 2.2, { suffix: "+", col: "#ff6b5e", sub: "MEN" });
const TK = tickCard("TANKS", 500, "left:70px;top:330px;", T_500 - 0.2, 1.4, T_THIN + 2.2, { pre: "~", col: "#ff6b5e", sub: "ON THE FIRST DAY" });
wstampS("THINLY HELD", ...L(50.12, 5.98), T_THIN + 0.3, T_GOAL + 0.6, "#9fc0ea", 22);
USL.forEach(([id], k) => pulseU(id, T_THIN + 0.2 + k * 0.15));
// ---------- the goal: Antwerp ----------
arw({ side: "rome", pts: [L(50.30, 6.10), L(50.45, 5.40), L(50.75, 4.90), L(51.13, 4.48)], width: AW(0.9, 13), t: T_GOAL - 0.1, dur: 2.2, dash: "26 16", until: T_DAYS + 2.0 });
K.target(...ANT, T_GOAL + 0.4, { r: 34, side: "#ff3b30", until: T_DAYS + 2.4 });
sstamp("THE GOAL: ANTWERP", 150, T_GOAL + 0.2, { size: 50, until: T_DAYS - 0.1 });
B.caption("THE PORT THAT FED THE ALLIED ARMIES", T_PORT - 0.1, T_DAYS - 0.1, "rome");
// ---------- 16 -> 19 Dec: the salient grows, the 106th destroyed on the Schnee Eifel ----------
B.move("u106", T_DAYS, 1.0, ...L(50.25, 6.36));
hideU(["u99", "u28", "u4", "d7"], T_DAYS + 1.0);
B.move("d6", T_DAYS + 0.2, 2.2, ...L(50.42, 5.98)); B.move("d5", T_DAYS + 0.3, 2.2, ...L(50.10, 5.95));
arw({ side: "rome", pts: [L(50.37, 6.50), L(50.36, 6.33), L(50.28, 6.22)], width: AW(1.9, 13), t: T_DAYS + 0.3, dur: 1.2, until: T_BAS - 0.2 });
arw({ side: "rome", pts: [L(50.14, 6.52), L(50.15, 6.36), L(50.22, 6.24)], width: AW(1.9, 13), t: T_DAYS + 0.6, dur: 1.2, until: T_BAS - 0.2 });
glowPath([L(50.33, 6.18), L(50.33, 6.33), L(50.30, 6.45), L(50.22, 6.45), L(50.17, 6.33), L(50.20, 6.20), L(50.33, 6.18)], "#ff5a4a", 3.2, T_106 - 0.3, T_BAS - 0.2, 2, 0.9, { draw: 1.0, top: true });
B.grey(["u106"], T_106 + 0.2, 0.6);
wstampS("DESTROYED · 19 DEC", ...L(50.18, 6.62), T_106 + 0.4, T_BAS - 0.2, "#e3232f", 22);
tickCard("THE 106TH DIVISION", 7000, "left:70px;top:150px;", T_7000 - 0.3, 1.6, T_BAS - 0.3, { suffix: "+", col: "#ff6b5e", sub: "MEN LOST ON THE SCHNEE EIFEL" });
region("SCHNEE EIFEL", L(50.36, 6.52), T_SCH - 0.4, T_BAS - 0.2, 26, "rgba(255,190,180,0.95)");
// ---------- Bastogne: where the roads met ----------
const ROADS = [[50.23, 5.34], [50.13, 5.79], [50.03, 5.86], [49.97, 5.93], [49.83, 5.74], [49.84, 5.43], [50.03, 5.37], [50.17, 5.62]];
ROADS.forEach(([la, lo], k) => glowPath([BAS, L(50.0 + (la - 50.0) * 0.55, 5.717 + (lo - 5.717) * 0.55), L(la, lo)], "#f6d36b", 2.2, T_BAS + 0.2 + k * 0.12, END + 1, 2, 0.9, { draw: 0.8, top: true }));
SFX("hit", T_MET + 0.1);
wstampS("WHERE THE ROADS MET", BAS[0] - 130, BAS[1] + 70, T_MET + 0.2, T_WHO + 2.4, "#f6d36b", 22);
// red arrows converge on the town
[[L(50.17, 5.86), L(50.05, 5.76)], [L(50.05, 5.97), L(50.01, 5.79)], [L(49.92, 5.92), L(49.98, 5.79)], [L(50.13, 5.62), L(50.04, 5.70)]].forEach((pts, k) =>
  arw({ side: "rome", pts, width: AW(2.3, 12), t: T_WHO + k * 0.3, dur: 1.0, until: END + 1 }));
// the garrison
unitS("u101", "carth", [BAS[0] - 26, BAS[1] - 6], "infantry", "101ST AIRBORNE", { t: T_101 - 0.1, size: "XX" });
unitS("u10", "carth", [BAS[0] + 30, BAS[1] + 22], "tank", "CCB · 10TH ARMD", { t: T_10 - 0.1 });
K.target(...BAS, T_INS, { r: 22, side: "carth", until: END + 1 });
const NF = scr(`<div style="padding:8px 22px 10px;background:rgba(18,16,12,0.92);border-top:5px solid #5b8fe8;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center"><div style="font-size:36px;letter-spacing:.04em">NEARLY FULL STRENGTH</div><div style="font-size:16px;letter-spacing:.3em;color:#9fc0ea">101ST AIRBORNE</div></div>`,
  "right:70px;top:150px;", T_101 + 0.5, END + 1); SFX("hit", T_101 + 0.6);
tickCard("TANKS THAT COULD STILL RUN", 40, "right:70px;top:300px;", T_40 - 0.2, 1.2, END + 1, { pre: "~", col: "#5b8fe8", sub: "INSIDE BASTOGNE" });
fixImgs();
B.finish();
