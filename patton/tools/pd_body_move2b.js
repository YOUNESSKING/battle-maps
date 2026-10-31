// MOVE 2b (move2-2), Patton #15: Patton misreads the attack (16-17 Dec 1944), then plans the turn (18-19 Dec). Basemap lorraine_hd_lift
// (z10), option 2 (two-colour glowing fronts only): Third Army on the Saar facing EAST, VIII Corps (First Army) on the Our / Sauer hit
// from the east. 16 Dec night: the 10th Armd ordered north (Patton protested; WAKI line, no quote marks as a caption); 17 Dec: the 4th
// Armd kept in his own fight (Eddy); his later diary line (verbatim, WAKI); 18 Dec: Bradley calls him to a conference (Luxembourg);
// night 18-19 Dec: three plans north (Neufchateau - St-Hubert, Arlon - Bastogne, Luxembourg - Diekirch), a simple code left with
// his chief of staff (Gay) at Nancy, so one call from Verdun starts the army. Facts: FACTCHECK_B rows 18, 30, 32, vivid detail 1;
// FACT_NOTES corrections 2 and 4 (no "Play ball", no code words). Built with: python3 tools/pd_inline.py move2b lorraine move2-2 move2-2
// @@KIT
// @@DATA
const GP = GG.proj(10, 134219, 88882), L = (la, lo) => GP(la, lo);
const P1 = "move2-2";
const T_MIS = at(P1, "Patton misread it"), T_NIGHT = at(P1, "On the night of the sixteenth"), T_PROT = at(P1, "he protested"),
  T_10 = at(P1, "his Tenth Armored Division was ordered north"), T_NEXT = at(P1, "and the next day"), T_4 = at(P1, "the Fourth Armored was kept"),
  T_WROTE = at(P1, "He wrote later"), T_18 = at(P1, "On the eighteenth"), T_CONF = at(P1, "called him to a conference"),
  T_MORN = at(P1, "By the next morning"), T_PLANS = at(P1, "three plans for a drive north"), T_CODE = at(P1, "he had left a simple code"),
  T_COS = at(P1, "with his chief of staff"), T_CALL = at(P1, "one telephone call from Verdun"), T_MOVE = at(P1, "could start an army moving");
const NAN = L(48.69, 6.18), MET = L(49.12, 6.18), LUX = L(49.61, 6.13), VER = L(49.16, 5.39), SAB = L(49.23, 7.0), ARL = L(49.68, 5.82),
  NEU = L(49.84, 5.43), DIE = L(49.87, 6.16), BAS = L(50.0, 5.717), THI = L(49.36, 6.17), TRI = L(49.75, 6.64);
// ---------- layers: rivers + living map, emblem on German land ----------
drawRivers({ mpp: 99.69, clouds: 0.14 });
emblem(2480, 560, 95);
// ---------- camera: the whole Third Army front -> the Saar -> back wide for the turn north ----------
const CW = [1560, 790, 0.92], CS = [1720, 930, 1.3], CN = [1180, 560, 0.95], CV = [1100, 960, 0.9];
camera([[0, ...CW], [T_PROT - 0.4, ...CW], [T_10 + 0.6, 1520, 760, 1.15], [T_4 - 0.4, ...CS], [T_WROTE + 1.5, ...CS], [T_18 + 0.2, ...CN],
  [T_COS - 0.5, ...CN], [T_CALL + 0.4, ...CV], [END, CV[0] + 10, CV[1] - 20, 0.95]]);
B.showDate(0.05); B.date("16 DECEMBER 1944", 0.1, T_NEXT, 32); B.date("17 DECEMBER 1944", T_NEXT + 0.05, T_18, 32);
B.date("18 DECEMBER 1944", T_18 + 0.05, T_MORN, 32); B.date("19 DECEMBER 1944 · DAWN", T_MORN + 0.05, null, 32);
legend(0.2, END + 1, true);
// flags on each side's ground (both on every shot)
[[0, T_10 + 0.5, [1000, 700], [2300, 900]], [T_10 + 0.5, T_18 + 0.3, [1450, 1250], [2250, 760]], [T_18 + 0.3, T_CALL, [820, 820], [1880, 560]], [T_CALL, END + 1, [860, 1250], [1700, 640]]].forEach(([t0, t1, us, de]) => {
  flagS(FL.us, "UNITED STATES", ...us, t0 + 0.15, t1); flagS(FL.de, "GERMANY", ...de, t0 + 0.25, t1); });
// big towns (A2)
town("NANCY", NAN, "r", 0.4); town("METZ", MET, "l", 0.45); town("LUXEMBOURG", LUX, "l", 0.5); town("VERDUN", VER, "l", 0.55);
town("SAARBRÜCKEN", SAB, "r", 0.6, { shrink: [[T_4 - 0.4, T_18]] }); town("ARLON", ARL, "l", 0.65); town("TRIER", TRI, "r", 0.7);
// ---------- the front (option 2), Third Army facing EAST ----------
fset([GD.fronts.dec16], 0.92, 0.2, T_10 + 0.7, 1.2);
fset([GD.fronts.dec16], 1.15, T_10 + 0.5, T_4 - 0.2, 0.01);
fset([GD.fronts.dec16], 1.3, T_4 - 0.4, T_18 + 0.4, 0.01);
fset([GD.fronts.dec16], 0.93, T_18 + 0.2, END + 1, 0.01);
const XX = L(49.30, 6.62), XII = L(49.06, 6.92), VIII = L(49.92, 5.98);
unitS("c20", "carth", XX, "infantry", "XX CORPS", { t: 0.2, size: "XXX" });
unitS("c12", "carth", XII, "infantry", "XII CORPS", { t: 0.3, size: "XXX" });
unitS("c8", "carth", VIII, "infantry", "VIII CORPS · FIRST ARMY", { t: 0.4, size: "XXX" });
unitS("a10", "carth", L(49.40, 6.36), "tank", "10TH ARMD", { t: 0.5, size: "XX" });
unitS("a4", "carth", L(48.93, 6.98), "tank", "4TH ARMD", { t: 0.6, size: "XX" });
unitS("g1", "rome", L(49.36, 6.92), "infantry", "", { t: 0.4, size: "XX" });
unitS("g2", "rome", L(49.15, 7.20), "infantry", "", { t: 0.5, size: "XX" });
unitS("g3", "rome", L(49.95, 6.50), "tank", "", { t: 0.55, size: "XXXX" });
const EA = [[XX, 0.3], [XII, 0.45]].map(([p, t]) => arw({ side: "carth", pts: [[p[0] + 34, p[1] - 4], [p[0] + 120, p[1] - 4]], width: AW(0.92, 12), t, dur: 0.8, until: T_18 + 0.4 }));
wstampS("THIRD ARMY · FACING EAST", ...L(48.95, 6.55), 1.0, T_10 - 0.2, "#9fc0ea", 22);
// the Saar front alive (guns, impacts: boom + shake)
[[L(49.33, 6.98), L(49.31, 6.70)], [L(49.13, 7.26), L(49.08, 6.97)], [L(49.31, 6.66), L(49.35, 6.88)], [L(49.06, 6.88), L(49.13, 7.16)]].forEach(([a, b], k) =>
  shoot(a, b, 1.2 + k * 1.4, { r: 6, h: 20, dur: 0.8 }));
// the Germans hit VIII Corps in the north (the south shoulder of the Bulge)
[[L(49.98, 6.55), L(49.93, 6.20)], [L(49.82, 6.55), L(49.85, 6.25)]].forEach((pts, k) => arw({ side: "rome", pts, width: AW(0.92, 13), t: T_MIS + 0.3 + k * 0.4, dur: 1.4, until: T_18 + 0.5 }));
B.move("g3", T_MIS + 0.4, 2.5, ...L(49.95, 6.30));
// ---------- 16-17 Dec: Patton misreads it ----------
const BP = badge({ name: "GEORGE S. PATTON", role: "THIRD ARMY", initials: "GSP", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "bl", t: T_MIS - 0.2, until: T_PROT - 0.3 });
// 10th Armd ordered north: he protests (his own words as a caption, no quote marks); the arrow goes grey
const A10 = arw({ side: "carth", pts: [L(49.43, 6.34), L(49.55, 6.22), L(49.66, 6.13), L(49.80, 6.08)], width: AW(1.15, 13), t: T_10 - 0.2, dur: 1.6, until: T_18 + 0.4 });
B.move("a10", T_10, 2.4, ...L(49.70, 6.12));
B.greyArrow(A10, T_PROT + 1.4, T_18 + 0.4);
B.caption("PATTON PROTESTS: IT PLAYS INTO THE HANDS OF THE GERMANS", T_PROT - 0.2, T_NEXT - 0.1, "carth");
wstampS("ORDERED NORTH", ...L(49.62, 6.32), T_10 + 0.4, T_NEXT + 0.6, "#9fc0ea", 20);
// 17 Dec: the 4th Armd kept in his own fight (ring)
K.target(...L(48.93, 6.98), T_4 - 0.1, { r: 26, side: "carth", until: T_18 + 0.4 });
wstampS("KEPT IN THE SAAR FIGHT", ...L(48.99, 7.30), T_4 + 0.3, T_18 + 0.3, "#9fc0ea", 20);
arw({ side: "carth", pts: [L(48.95, 7.05), L(49.03, 7.12), L(49.10, 7.16)], width: AW(1.3, 12), t: T_4 + 0.2, dur: 1.0, until: T_18 + 0.3 });
quote("“The fact that I did this shows how little I appreciated the seriousness of the enemy attack on that date.”", "PATTON, WAR AS I KNEW IT", T_WROTE - 0.1, T_18 - 0.1, { size: 34, mw: 1180 });
// ---------- 18 Dec: Bradley's summons ----------
const BB = badge({ name: "OMAR BRADLEY", role: "12TH ARMY GROUP · LUXEMBOURG", initials: "OB", photo: PHOTO("bradley"), flag: FL.us, side: "carth", corner: "br", t: T_18 - 0.1, until: T_MORN - 0.2 });
phone("18 DEC · BRADLEY: COME TO A CONFERENCE", "left:70px;top:150px;", T_CONF - 0.4, T_MORN - 0.2);
glowPath([NAN, MET, THI, LUX], "#c9b48a", 5, T_CONF - 0.2, T_MORN, 1, 0.9, { draw: 1.4, dash: "6 9", top: true });
K.target(...LUX, T_CONF + 0.4, { r: 18, side: "#c9b48a", until: T_MORN + 0.4 });
// ---------- night 18-19 Dec: three plans north ----------
EA.forEach((g) => B.greyArrow(g, T_MORN, END + 1));
sstamp("THREE PLANS NORTH", 860, T_PLANS - 0.2, { size: 50, color: "#8fb4ff", until: T_CODE + 0.2 });
const PL3 = [[[L(49.25, 5.70), L(49.55, 5.55), NEU], "1 · NEUFCHÂTEAU"], [[L(49.28, 5.95), ARL, L(49.88, 5.76), L(49.98, 5.72)], "2 · ARLON - BASTOGNE"],
  [[L(49.30, 6.16), LUX, L(49.80, 6.15), DIE], "3 · LUXEMBOURG - DIEKIRCH"]];
PL3.forEach(([pts, nm], k) => { ghost(pts, T_PLANS + k * 0.45, AW(0.95, 13), END + 1);
  const q = posOn(pts, [0.45, 0.2, 0.6][k]), od = [[-150, 0], [-140, 30], [170, 0]][k]; boxS(nm, q[0] + od[0], q[1] + od[1], T_PLANS + 0.3 + k * 0.45, END + 1, { size: 14 }); });
town("BASTOGNE", BAS, "l", T_PLANS + 0.6);
// the simple code, left with the chief of staff at Nancy
placeCard("A SIMPLE CODE", "LEFT WITH HIS CHIEF OF STAFF", "left:70px;top:150px;", T_CODE - 0.1, T_CALL - 0.2,
  `<svg width="46" height="46" viewBox="0 0 40 40"><rect x="5" y="4" width="30" height="32" rx="2" fill="#efe6cf" stroke="#1a1712" stroke-width="2"/><path d="M10 12 H30 M10 18 H26 M10 24 H30 M10 30 H22" stroke="#1a1712" stroke-width="2.4" stroke-dasharray="3 2"/></svg>`);
SFX("hit", T_CODE + 0.1);
K.target(...NAN, T_COS, { r: 18, side: "carth", until: END + 1 });
// one call from Verdun starts the army moving
glowPath([VER, L(48.95, 5.75), NAN], "#f6d36b", 5.5, T_CALL - 0.2, END + 1, 2, 0.95, { draw: 1.2, dash: "6 9", top: true });
phone("ONE CALL FROM VERDUN", "left:70px;top:150px;", T_CALL - 0.1, END + 1);
K.target(...VER, T_CALL, { r: 20, side: "#f6d36b", until: END + 1 });
[["c20", L(49.45, 6.40)], ["c12", L(49.25, 6.55)], ["a4", L(49.20, 6.25)]].forEach(([id, p], k) => B.move(id, T_MOVE + k * 0.2, 2.5, ...p));
fixImgs();
B.finish();
