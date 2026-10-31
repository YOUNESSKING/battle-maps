// MOVE 2f (move2-7), Patton #15: the Assenois dash, 26 Dec 1944 (Cole p. 553-555; FACTCHECK_B rows 27-32, vivid detail 9). Abrams (37th Tank
// Bn) and Jaques (53rd AIB) at Clochimont about 15:20; "It's the push!"; thirteen batteries, ten volleys on Assenois ("Concentration Number
// Nine, play it soft and sweet"); the tanks race in, the half-tracks behind; the Germans throw Teller mines on the road behind the first
// tanks, a half-track explodes; Dwight's crews clear the mines by hand; 16:50 Cobra King (Boggess) meets the 326th Airborne Engineers at
// the outer foxholes; twenty minutes later Abrams shakes McAuliffe's hand. Basemap assenois_hd_lift (z13), option 2 (glowing fronts:
// ring + flank before the dash, the corridor after 16:50; tools/m2b_make_control.py assenois). Positions schematic but at the real places.
// Built with: python3 tools/m2b_inline.py move2f assenois && python3 tools/build_scene.py move2f assenois_hd_lift move2-7 move2-7
// @@KIT
// @@DATA
const GP = GG.proj(13, 1080282, 710790);
const L = (la, lo) => GP(la, lo);
const P7 = "move2-7";
const T_ASS = at(P7, "at the village of Assenois"), T_ABR = at(P7, "Lieutenant Colonel Creighton Abrams"), T_PUSH = at(P7, "it's the push"), T_13 = at(P7, "Thirteen batteries"),
  T_SHARP = at(P7, "sharp concentration"), T_SOFT = at(P7, "and the code for it"), T_TEN = at(P7, "Ten volleys"), T_RACE = at(P7, "and the tanks of Abrams"),
  T_HT = at(P7, "with armoured infantry"), T_NOT = at(P7, "Not a hostile shot"), T_UP = at(P7, "Then the Germans got up"), T_MINES = at(P7, "and threw Teller mines"),
  T_BURST = at(P7, "and a half-track burst"), T_HAND = at(P7, "Dwight's tanks cleared"), T_1650 = at(P7, "At ten minutes to five"), T_COBRA = at(P7, "the Sherman called Cobra King"),
  T_MET = at(P7, "reached the outer foxholes"), T_20 = at(P7, "Twenty minutes later"), T_SHOOK = at(P7, "Abrams shook");
// ---------- places (assenois map px) ----------
const BAS = L(50.0023, 5.7173), ASS = L(49.9665, 5.6815), CLO = L(49.9519, 5.667), REM = L(49.937, 5.660), SIB = L(49.9682, 5.6352), HOM = L(49.9437, 5.6866);
const LINK = [1445, 682];
const ROUTE = [[CLO[0] + 6, CLO[1] - 20], [1332, 830], [1362, 790], ASS, [1408, 728], [1428, 704], LINK];
const ONWARD = [LINK, [1475, 640], [1520, 560], [1560, 490], [BAS[0] - 14, BAS[1] + 20]];
// ---------- layers (option 2), rivers + living map, emblem ----------
drawRivers({ mpp: 12.29, rw: 1.5 });
emblem(1700, 820, 22);
// ---------- camera ----------
const C0 = [1450, 660, 1.5], C1 = [1340, 840, 1.55], C2 = [1395, 745, 2.4], C3 = [1440, 700, 2.6], C4 = [1520, 500, 1.6];
camera([[0, ...C0], [T_ABR, ...C0], [T_13 - 0.2, ...C1], [T_RACE - 0.4, ...C1], [T_RACE + 1.4, ...C2], [T_1650 - 0.4, 1405, 735, 2.5, "none"], [T_MET - 0.6, ...C3], [T_20 - 0.2, 1440, 690, 2.7, "none"], [T_20 + 1.6, ...C4], [END, 1525, 495, 1.55]]);
B.showDate(0.05); B.date("26 DEC 1944 · 15:20", 0.1, T_1650 - 0.1, 32); B.date("26 DEC 1944 · 16:50", T_1650, T_20 - 0.1, 32); B.date("26 DEC 1944 · ABOUT 17:10", T_20, END + 1, 32);
legend(0.2, END + 1, true);
const FS = [[0, T_13 - 0.4, [1270, 900], [1200, 600]], [T_13 - 0.2, T_RACE + 0.2, [1440, 1050], [1180, 690]], [T_RACE + 0.4, T_20 + 0.6, [1290, 860], [1300, 640]], [T_20 + 0.8, END + 1, [1250, 900], [1240, 520]]];
FS.forEach(([t0, t1, us, de], k) => { flagS(FL.us, "UNITED STATES", ...us, t0 + (k ? 0.1 : 0.2), t1); flagS(FL.de, "GERMANY", ...de, t0 + (k ? 0.2 : 0.3), t1); });
// fronts: before the dash = the ring + the German line north of Clochimont / Hompre; after 16:50 = the corridor
const FA = GD.fronts.all;
const MORN = [[500, 1010], [800, 960], [1050, 905], [1240, 860], [1300, 846], [1345, 862], [1390, 930], [1450, 1000], [1600, 1050], [1850, 1110], [2200, 1170], [2600, 1220]];
fset([FA.ring, MORN], 1.5, 0, T_13 - 0.2, 1.4);
fset([FA.ring, MORN], 2.0, T_13 - 0.4, T_RACE + 1.0, 0.5);
fset([FA.ring], 2.5, T_RACE + 0.6, T_MET + 0.4, 0.5);
const CW = [[800, 960], [1050, 905], [1240, 860], [1286, 852], [1316, 805], [1350, 765], [1378, 735], [1408, 700], [1428, 676]];
const CE = [[1468, 676], [1452, 720], [1420, 770], [1395, 830], [1400, 900], [1450, 990], [1600, 1050], [1850, 1110], [2200, 1170]];
fset([FA.ring, CW, CE], 2.6, T_MET - 0.2, T_20 + 1.0, 1.2);
fset([FA.ring, CW, CE], 1.6, T_20 + 0.8, END + 1, 0.6);
// places
town("BASTOGNE", BAS, "r", 0.3);
boxS("ASSENOIS", ASS[0] - 70, ASS[1] - 6, 0.4, END + 1, { size: 15 });
boxS("CLOCHIMONT", CLO[0] - 80, CLO[1] + 4, 0.5, END + 1, { size: 12 });
boxS("SIBRET", SIB[0], SIB[1] - 22, 0.6, END + 1, { size: 12 }); boxS("HOMPRÉ", HOM[0] + 50, HOM[1] + 8, 0.7, END + 1, { size: 12 });
// German ring + Assenois garrison; the 101st inside
const GR = [["gr1", [1180, 560]], ["gr2", [1730, 540]], ["gr3", [1560, 700]], ["gas", [ASS[0] + 70, ASS[1] - 18]]];
GR.forEach(([id, p], k) => unitS(id, "rome", p, k === 1 ? "tank" : "infantry", "", { t: 0.3 + k * 0.1 }));
unitS("ab101", "carth", [BAS[0] - 70, BAS[1] + 60], "infantry", "101ST AIRBORNE", { t: 0.4, size: "XX" });
K.target(BAS[0], BAS[1], 0.5, { r: 30, side: "#ff3b30", until: T_MET });
// ---------- Clochimont, about 15:20: Abrams and Jaques; "It's the push!" ----------
unitS("t37", "carth", [CLO[0] - 10, CLO[1] + 30], "tank", "37TH TANK BN", { t: 0.2, size: "II" });
unitS("a53", "carth", [CLO[0] + 50, CLO[1] + 64], "mech", "53RD ARMD INF BN", { t: 0.35, size: "II" });
arw({ pts: [[CLO[0] - 140, CLO[1] + 160], [CLO[0] - 60, CLO[1] + 80], [CLO[0] - 10, CLO[1] + 40]], side: "carth", t: 0.1, dur: 1.4, width: AW(1.5, 11) });
const abr = badge({ name: "CREIGHTON ABRAMS", role: "LT. COL. · 37TH TANK BATTALION", photo: PHOTO("abrams"), flag: FL.us, side: "carth", corner: "tr", initials: "CA", t: T_ABR - 0.2, until: T_20 - 0.4 });
quote("“It's the push!”", "ABRAMS TO CAPT. WILLIAM DWIGHT", T_PUSH - 0.6, T_13 + 0.6, { top: 820, size: 52, mw: 900 });
// ---------- thirteen batteries, ten volleys ----------
const BAT = [];
for (let k = 0; k < 13; k++) { const r = k < 7 ? 0 : 1, c = r ? k - 7 : k; BAT.push([1040 + c * 44 + r * 22, 975 + r * 42]); }
BAT.forEach((p, k) => unitS("b" + k, "carth", p, "artillery", "", { t: T_13 - 0.1 + k * 0.08, w: 40, h: 27 }));
for (let k = 0; k < 13; k++) SFX("tick", T_13 + k * 0.08);
wstampS("13 BATTERIES", 1170, 1060, T_13 + 1.3, T_RACE, "#9fc0ea", 20);
const SOFT = scr(`<div style="padding:16px 40px;background:rgba(18,16,12,0.93);border-left:8px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;-webkit-text-stroke:1.5px #000;paint-order:stroke fill"><div style="font-size:17px;letter-spacing:.32em;color:#9fc0ea">ABRAMS · THE CODE</div><div style="font-size:50px;letter-spacing:.05em;margin-top:4px">“CONCENTRATION NUMBER NINE, PLAY IT SOFT AND SWEET.”</div></div>`, "left:0;right:0;top:150px;display:flex;justify-content:center;", T_SOFT - 0.2, T_RACE - 0.3);
SFX("hit", T_SOFT + 0.1);
const VT = []; for (let v = 0; v < 10; v++) VT.push(T_TEN - 1.4 + v * 0.42);
VT.forEach((tv, v) => { BAT.forEach((p, k) => { if ((k + v) % 4 === 0) K.gun(p[0], p[1], tv, { unit: "b" + k, sfx: k % 8 ? false : "fire" }); });
  [0, 1].forEach((j) => { const g = BAT[(v * 3 + j * 6) % 13], tgt = [ASS[0] - 18 + ((v * 7 + j * 13) % 36), ASS[1] - 14 + ((v * 5 + j * 11) % 30)];
    GG.arc(g[0], g[1], tgt[0], tgt[1], tv + 0.04, { dur: 0.9, width: 1.4, h: 60, impact: false }); if (j === 0) K.impact(tgt[0], tgt[1], tv + 0.94, { r: 12, puffs: 3 }); else K.smoke(tgt[0], tgt[1], tv + 0.94, { n: 2, r: 10, rise: 20 }); }); });
ticker("VOLLEYS ON ASSENOIS", 10, "", "left:70px;top:330px;", VT[0] + 0.9, VT[9] - VT[0], T_HT, 10, { col: "#5b8fe8", sub: "THIRTEEN BATTERIES" });
for (let tt = VT[9] + 1.2; tt < T_RACE + 3; tt += 0.9) K.smoke(ASS[0] - 10 + ((tt * 37) % 24), ASS[1] - 6, tt, { n: 2, r: 12, rise: 26, alpha: 0.6 });
// ---------- the dash: tanks race in behind the barrage, half-tracks close behind ----------
trail(ROUTE, "#8fb2ff", 3, T_RACE - 0.2, 3.4, END + 1, "4 8");
const TANK = (lbl) => `<div style="display:flex;flex-direction:column;align-items:center"><svg width="62" height="30" viewBox="6 38 92 42" style="display:block;filter:drop-shadow(0 0 3px #6f9bff) drop-shadow(0 1px 2px #000)"><g fill="#1f4fc4" stroke="#f3eee2" stroke-width="3"><path d="M10 58 L90 58 L84 74 L16 74 Z"/><path d="M30 44 L64 44 L70 58 L26 58 Z"/><rect x="62" y="46" width="34" height="5" rx="2"/></g></svg>${lbl ? `<div class="lb" style="font-family:Oswald;font-weight:700;font-size:15px;letter-spacing:.1em;color:#fff;background:#1f4fc4;padding:0 5px;margin-top:2px;white-space:nowrap">${lbl}</div>` : ""}</div>`;
const LEAD = [0, 1, 2].map((k) => { const el = pinS(GG.pin(TANK(k === 0 ? "" : ""), ROUTE[0][0], ROUTE[0][1], { t: T_RACE - 0.2 + k * 0.35 }));
  pinAlong(el, ROUTE.slice(0, 5), T_RACE + k * 0.45, 5.2, 24); return el; });
hideU(["t37"], T_RACE + 0.2);
// the half-tracks (armoured infantry) close behind
const HT = [0, 1, 2].map((k) => vehicle(ROUTE.slice(0, 4), T_HT - 0.2 + k * 0.5, 4.4, END + 1, { s: 13, lights: false }));
hideU(["a53"], T_HT);
const nh = scr(`<div style="padding:10px 28px;background:rgba(18,16,12,0.92);border-left:6px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:34px;letter-spacing:.08em">NOT A HOSTILE SHOT AS THE TANKS ENTER THE STREET</div>`, "left:0;right:0;top:900px;display:flex;justify-content:center;", T_NOT - 0.2, T_UP - 0.2);
SFX("ref:pop", T_NOT);
// ---------- the Germans get up behind them: Teller mines, a half-track burns, the mines cleared by hand ----------
[[ASS[0] - 40, ASS[1] + 10], [ASS[0] + 30, ASS[1] + 26], [ASS[0] - 28, ASS[1] + 44]].forEach((p, k) => unitS("gu" + k, "rome", p, "infantry", "", { t: T_UP - 0.1 + k * 0.25, w: 40, h: 27 }));
mg([ASS[0] + 30, ASS[1] + 26], [1352, 800], T_UP + 0.5, 5, 1.2);
const MINES = [[1372, 778], [1366, 784], [1378, 772], [1360, 790]];
const MN = MINES.map((p, k) => pinS(GG.pin(`<div style="width:13px;height:13px;border-radius:50%;background:#2a2620;border:2.5px solid #d8cfb8;box-shadow:0 0 6px #ff6a3c"></div>`, p[0], p[1], { t: T_MINES - 0.1 + k * 0.2, pop: true, until: T_HAND + 2.2 })));
MINES.forEach((p, k) => SFX("tick", T_MINES - 0.1 + k * 0.2));
boxS("TELLER MINES", 1300, 760, T_MINES + 0.4, T_HAND + 2.0, { size: 13, bg: "#ffd9d2" });
K.impact(1356, 796, T_BURST + 0.1, { r: 22, puffs: 5 });
fireGlow(1356, 796, 18, T_BURST + 0.15, END + 1);
for (let tt = T_BURST + 0.6; tt < END - 1; tt += 1.1) K.smoke(1356, 792, tt, { n: 2, r: 9, rise: 30, alpha: 0.7 });
wstampS("HALF-TRACK HIT", 1300, 830, T_BURST + 0.3, T_HAND + 1.0, "#e3232f", 18);
// Dwight's two tanks pull onto the shoulder; the crews (small figures) lift the mines
const DW = [0, 1].map((k) => { const el = pinS(GG.pin(TANK(k ? "" : "DWIGHT"), 1340 + k * 16, 812 + k * 12, { t: T_HAND - 0.6 + k * 0.2 })); return el; });
const CREW = MINES.map((p, k) => pinS(GG.pin(`<div style="width:8px;height:12px;border-radius:4px 4px 2px 2px;background:#5b8fe8;border:1.5px solid #f3eee2"></div>`, 1350 + k * 4, 800 - k * 2, { t: T_HAND - 0.2, until: T_1650 })));
CREW.forEach((el, k) => tl.to(el, { left: MINES[k][0] + 6, top: MINES[k][1] + 4, duration: 1.0, ease: "power1.out" }, T_HAND));
MN.forEach((el, k) => tl.to(el, { autoAlpha: 0, scale: 0.4, duration: 0.3 }, T_HAND + 1.2 + k * 0.25));
DW.forEach((el, k) => pinAlong(el, [[1340 + k * 16, 812 + k * 12], ASS, [1408, 728], [1425, 708]], T_HAND + 2.4 + k * 0.3, 3.0, 12));
const hcap = scr(`<div style="padding:10px 28px;background:rgba(18,16,12,0.92);border-left:6px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:32px;letter-spacing:.08em">DWIGHT'S CREWS CLEAR THE MINES BY HAND</div>`, "left:0;right:0;top:900px;display:flex;justify-content:center;", T_HAND - 0.2, T_1650 - 0.2);
// ---------- 16:50: Cobra King meets the 326th Engineers at the outer foxholes ----------
pinAlong(LEAD[0], [ROUTE[4], ROUTE[5], LINK], T_1650 - 1.6, 2.4, 8);
pinAlong(LEAD[1], [ROUTE[4], ROUTE[5]], T_1650 - 1.2, 2.0, 6); pinAlong(LEAD[2], [ROUTE[3], ROUTE[4]], T_1650 - 1.0, 2.0, 6);
boxS("COBRA KING", LINK[0] - 64, LINK[1] + 18, T_COBRA - 0.2, END + 1, { size: 13, bg: "#d6e2ff" });
unitS("e326", "carth", [LINK[0] + 26, LINK[1] - 26], "infantry", "326TH ENGINEERS", { t: T_MET - 0.4, w: 40, h: 27 });
K.target(LINK[0], LINK[1], T_MET + 0.6, { r: 34, side: "#5b8fe8", until: END + 1 });
sstamp("LINK-UP · 16:50", 820, T_MET + 0.6, { size: 60, color: "#9fc0ea", shake: 6, until: T_20 - 0.2 });
// ---------- twenty minutes later: Abrams shakes McAuliffe's hand ----------
const ONW = [0, 1].map((k) => vehicle(ONWARD, T_20 - 0.4 + k * 0.6, 3.4, END + 1, { s: 13, lights: false }));
badge({ name: "ANTHONY McAULIFFE", role: "101ST AIRBORNE", photo: PHOTO("mcauliffe"), flag: FL.us, side: "carth", corner: "tl", initials: "AM", t: T_20 + 0.2, until: END + 1 });
badge({ name: "CREIGHTON ABRAMS", role: "37TH TANK BATTALION", photo: PHOTO("abrams"), flag: FL.us, side: "carth", corner: "tr", initials: "CA", t: T_20 + 0.2, until: END + 1 });
sstamp("20 MINUTES LATER · ABRAMS MEETS McAULIFFE", 930, T_SHOOK - 0.3, { size: 44, color: "#9fc0ea", until: END + 1 });
fixImgs();
B.finish();
