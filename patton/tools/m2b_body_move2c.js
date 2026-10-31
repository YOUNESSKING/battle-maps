// MOVE 2c (move2-3), Patton #15: Verdun, 19 Dec 1944, 11:00, and the ONE "What would you do?" card (E.decide, B3 look: lighter dim, the
// map keeps moving under it, options pulse on their words, black outline on the card text). Basemap bastogne_hd_lift (z11), option 1
// (territory 19 Dec: tools/m2b_make_control.py). A = ATTACK IN 3 DAYS WITH WHAT YOU HAVE (the real choice, lights blue), B = WAIT 6 DAYS.
// Then the promise: 22 DEC · 3 DIVISIONS (4th Armd, 26th, 80th; FACTCHECK_B row 14), "Don't be fatuous" (REPORTEDLY, row 15),
// the new-star joke. Built with: python3 tools/m2b_inline.py move2c bastogne && python3 tools/build_scene.py move2c bastogne_hd_lift move2-3 move2-3
// @@KIT
// @@DATA
const GP = GG.proj(11, 269078, 177338);
const L = (la, lo) => GP(la, lo);
const P1 = "move2-3";
const T_ELEV = at(P1, "at eleven"), T_IKE = at(P1, "Eisenhower gathered"), T_CHEER = at(P1, "There will be only cheerful"), T_STOP = at(P1, "Now stop"),
  T_PLACE = at(P1, "put yourself in Patton's place"), T_MEUSE = at(P1, "racing for the Meuse"), T_CUT = at(P1, "paratroopers at Bastogne are cut off"),
  T_THREE = at(P1, "piecemeal attack north in three days"), T_WHAT = at(P1, "with what he has"), T_SIX = at(P1, "A properly coordinated"),
  T_DO = at(P1, "Do you attack in three days"), T_WAIT = at(P1, "or wait six"), T_TELL = at(P1, "Tell us in the comments"), T_ANS = at(P1, "And then Patton gave"),
  T_22 = at(P1, "The morning of the twenty-second"), T_3DIV = at(P1, "with three divisions"), T_4AD = at(P1, "the Fourth Armored"), T_26 = at(P1, "the Twenty-Sixth"),
  T_REP = at(P1, "Reportedly"), T_MEANT = at(P1, "Patton meant it"), T_BROKE = at(P1, "As the meeting broke up"), T_STAR = at(P1, "every time he got a new star"),
  T_PANS = at(P1, "Patton answered"), T_PULL = at(P1, "I pull you out");

// ---------- places (bastogne map px) ----------
const BAS = L(50.0023, 5.7173), ARL = L(49.6834, 5.8167), MAR = L(49.833, 5.740), WIL = L(49.9666, 5.9321), NEU = L(49.8408, 5.435),
  LUX = L(49.611, 6.130), SIB = L(49.9682, 5.6352), HOU = L(50.133, 5.79);
// ---------- layers: territory 19 Dec (multiply), rivers + living map, emblem ----------
ctlImg("assets/media/m2b_bas_ctl_dec19_mx.png", 0, null, 0.01);
drawRivers({ mpp: 49.29 });
emblem(2500, 700, 80);
// ---------- camera: wide (both sides' ground) -> slow push onto Bastogne under the card -> wide again ----------
const CW = [1450, 760, 0.74], CB = [1380, 560, 1.15], CC = [1390, 540, 1.42], CE = [1450, 800, 0.8];
camera([[0, ...CW], [T_STOP - 0.5, 1430, 740, 0.82], [T_MEUSE + 0.4, ...CB], [T_DO - 0.6, 1385, 550, 1.22], [T_ANS + 0.2, ...CC, "none"],
  [T_3DIV + 0.6, 1440, 820, 0.95], [T_PANS, ...CE], [END, CE[0] + 20, CE[1], CE[2] * 0.97]]);
B.showDate(0.05); B.date("19 DEC 1944", 0.1, END + 1, 32);
legend(0.2, END + 1);
// flags: both on every frame (US on Allied ground south-west, Reich flag on German ground north-east), moved per shot
const FS = [[0, T_MEUSE + 0.1, [880, 1060], [2160, 330]], [T_MEUSE + 0.3, T_3DIV + 0.3, [1010, 960], [1840, 640]], [T_3DIV + 0.5, END + 1, [930, 1150], [2250, 620]]];
FS.forEach(([t0, t1, us, de], k) => { flagS(FL.us, "UNITED STATES", ...us, t0 + (k ? 0.1 : 0.2), t1); flagS(FL.de, "GERMANY", ...de, t0 + (k ? 0.2 : 0.3), t1); });
// big towns only (A2): shrink BASTOGNE when the troops close round it
town("BASTOGNE", BAS, "l", 0.3, { shrink: [[T_CUT - 0.4, null]] });
town("ARLON", ARL, "r", 0.35); town("WILTZ", WIL, "r", 0.4, { shrink: [[0.5, null]] }); town("NEUFCHÂTEAU", NEU, "l", 0.45); town("LUXEMBOURG", LUX, "r", 0.5);
// ---------- the German drive (units already moving at frame 0) ----------
const NPATH = [[1760, 250], [1620, 230], [1500, 260], [1420, 330], [1300, 330], [1100, 300], [880, 270], [600, 250], [330, 200]];
unitS("pz2", "rome", NPATH[0], "tank", "2ND PANZER", { t: 0.1, size: "XX" });
along("pz2", NPATH.slice(0, 5), 0.2, T_MEUSE - 0.6, 24);
along("pz2", NPATH.slice(4), T_MEUSE, END - T_MEUSE, 30);
arw({ pts: NPATH.slice(0, 5), side: "rome", t: 0.1, dur: 3.0, width: AW(0.8, 12) });
const SPATH = [[1900, 640], [1760, 600], [1640, 600], [1520, 590], [1420, 580], SIB, [1150, 560], [950, 520]];
unitS("gsouth", "rome", SPATH[0], "tank", "", { t: 0.2 });
along("gsouth", SPATH.slice(0, 4), 0.3, T_CUT - 0.5, 20);
arw({ pts: SPATH.slice(0, 4), side: "rome", t: 0.4, dur: 3.2, width: AW(0.8, 12) });
unitS("gwiltz", "rome", [WIL[0] + 70, WIL[1] - 40], "infantry", "", { t: 0.3 });
// guns keep firing on the east face of Bastogne (impacts carry the boom + shake)
const GUNS = [[1600, 420], [1610, 520], [1560, 330]];
GUNS.forEach((g, k) => unitS("gg" + k, "rome", g, "artillery", "", { t: 0.4 + k * 0.2, w: 40, h: 27 }));
[0.9, 2.6, 4.4, 7.2, 9.6].forEach((tt, k) => shoot(GUNS[k % 3], [BAS[0] + 30 - (k % 3) * 18, BAS[1] - 20 + (k % 2) * 34], tt, { unit: "gg" + (k % 3), r: 7, h: 30 }));
// Bastogne: the paratroopers (101st Airborne)
unitS("ab101", "carth", [BAS[0] - 6, BAS[1] + 42], "infantry", "101ST AIRBORNE", { t: 0.5, size: "XX" });
// ---------- Verdun: the freezing barracks, 11:00 (Verdun is ~95 miles south, off this map) ----------
const STOVE = `<svg width="54" height="54" viewBox="0 0 54 54" style="display:block"><rect x="4" y="30" width="46" height="5" fill="#c9b48a"/><rect x="10" y="35" width="4" height="15" fill="#c9b48a"/><rect x="40" y="35" width="4" height="15" fill="#c9b48a"/>
  <rect x="20" y="10" width="14" height="18" rx="2" fill="none" stroke="#f7f3ea" stroke-width="2.4"/><rect x="25" y="2" width="4" height="8" fill="#f7f3ea"/><circle cx="27" cy="20" r="3" fill="#ff9a3c"/></svg>`;
const VC = placeCard("VERDUN · A FREEZING FRENCH BARRACKS", "19 DEC · 11:00 A.M.", "left:70px;top:780px;", T_ELEV - 0.3, T_STOP + 0.4, STOVE);
for (let k = 0; k < 4; k++) SFX("tick", T_ELEV + k * 0.22);
const ikeB = badge({ name: "DWIGHT D. EISENHOWER", role: "SUPREME COMMANDER", photo: PHOTO("eisenhower"), flag: FL.us, side: "carth", corner: "tl", initials: "DDE", t: T_IKE, until: T_STOP + 0.2 });
const bradB = badge({ name: "OMAR BRADLEY", role: "12TH ARMY GROUP", photo: PHOTO("bradley"), flag: FL.us, side: "carth", corner: "tr", initials: "OB", t: T_IKE + 1.2, until: T_PLACE - 0.4 });
quote("“There will be only cheerful faces at this conference table.”", "EISENHOWER · VERDUN, 19 DECEMBER 1944", T_CHEER - 0.2, T_STOP + 0.5, { top: 470, size: 42, mw: 1150 });
// ---------- the situation: racing for the Meuse, Bastogne cut off ----------
const pb = badge({ name: "GEORGE S. PATTON", role: "THIRD ARMY · YOU ARE IN HIS PLACE", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "tr", initials: "GSP", t: T_PLACE - 0.2, until: T_DO - 0.5 });
arw({ pts: NPATH.slice(4), side: "rome", t: T_MEUSE - 0.2, dur: 2.4, width: AW(1.15, 13) });
boxS("TO THE MEUSE", 700, 420, T_MEUSE + 1.0, END + 1, { size: 15, bg: "#ffd9d2" });
arw({ pts: SPATH.slice(3), side: "rome", t: T_CUT - 0.6, dur: 2.0, width: AW(1.15, 13) });
along("gsouth", SPATH.slice(3), T_CUT - 0.5, END - T_CUT, 24);
K.target(BAS[0], BAS[1], T_CUT - 0.2, { r: 54, side: "#ff3b30", until: END - 1 });
wstampS("CUT OFF", BAS[0] - 40, BAS[1] - 95, T_CUT + 0.3, T_DO - 0.4, "#e3232f", 24);
// the two answers drawn on the map: 3 days with what he has (one thin column) / 6 days with everything (a broad front)
const ROAD = [ARL, [1500, 1060], [1450, 930], MAR, [1410, 790], [1400, 650], [1395, 540]];
unitS("opt3", "carth", [ARL[0] - 4, ARL[1] - 50], "tank", "", { t: T_THREE - 0.1 });
const A3 = arw({ pts: ROAD, side: "carth", t: T_THREE, dur: 1.8, width: AW(1.2, 9), dash: "10 10" });
boxS("3 DAYS · WITH WHAT HE HAS", ARL[0] + 40, ARL[1] - 120, T_WHAT - 0.4, T_DO - 0.4, { size: 15, bg: "#d6e2ff" });
const SIXP = [[[1240, 1180], [1250, 900], [1310, 640]], [[1700, 1190], [1640, 900], [1470, 640]]];
SIXP.forEach((pts, k) => { unitS("opt6" + k, "carth", pts[0], k ? "infantry" : "tank", "", { t: T_SIX - 0.2 + k * 0.2 }); arw({ pts, side: "carth", t: T_SIX + k * 0.2, dur: 1.8, width: AW(1.2, 14), dash: "14 10" }); });
boxS("6 DAYS · EVERYTHING", 1470, 1300, T_SIX + 0.6, T_DO - 0.4, { size: 15, bg: "#d6e2ff" });
// ---------- E.decide (B3: lighter dim, the map keeps moving, option pulses, black text outline) ----------
const DEC = E.decide({ sub: "19 DECEMBER 1944 · YOU ARE PATTON", a: "ATTACK IN 3 DAYS, WITH WHAT YOU HAVE", b: "WAIT 6 DAYS AND HIT WITH EVERYTHING", real: 0,
  t: T_DO - 0.4, tCount: T_TELL, tReveal: T_ANS + 0.2, until: T_22 - 0.1 });
const OA = DEC.querySelector(".o0"), OB = DEC.querySelector(".o1");
DEC.style.webkitTextStroke = "2px #000"; DEC.style.paintOrder = "stroke fill"; DEC.style.textShadow = "0 2px 6px rgba(0,0,0,0.9)";
OA.querySelectorAll("div")[1].style.fontSize = "48px"; OB.querySelectorAll("div")[1].style.fontSize = "48px";
const BACK = DEC.previousElementSibling;
tl.to(BACK, { autoAlpha: 0.56, duration: 0.8 }, T_DO + 0.3);
const pulse = (el, t, col = "#ffd54a") => { tl.to(el, { scale: 1.07, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }, t);
  tl.fromTo(el, { boxShadow: "0 0 0px rgba(255,213,74,0)" }, { boxShadow: `0 0 28px ${col}`, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, t); SFX("tick", t); };
pulse(OA, T_DO + 0.3); pulse(OB, T_WAIT + 0.2); pulse(DEC.querySelector(".cd"), T_TELL + 1.6, "#c9b48a"); pulse(OA, T_TELL + 2.3); pulse(OB, T_TELL + 2.7);
// under the card: the German drive keeps going, a blast every ~2.4 s on the ring
for (let tt = T_DO + 0.6, k = 0; tt < T_ANS - 0.3; tt += 2.4, k++) shoot(GUNS[k % 3], [BAS[0] + 26 - (k % 3) * 16, BAS[1] - 30 + (k % 2) * 40], tt, { unit: "gg" + (k % 3), r: 7, h: 30 });
// ---------- the answer: 22 DEC · 3 DIVISIONS ----------
sstamp("22 DEC · 3 DIVISIONS", 600, T_3DIV - 0.4, { size: 58, sub: "4TH ARMORED · 26TH · 80TH", until: T_REP - 0.2 });
hideU(["opt3", "opt60", "opt61"], T_22);
const DIV = [["d4", "tank", "4TH ARMD", [ARL[0] - 150, ARL[1] - 70], T_4AD], ["d26", "infantry", "26TH", [ARL[0] + 10, ARL[1] - 90], T_26], ["d80", "infantry", "80TH", [ARL[0] + 200, ARL[1] - 120], T_26 + 0.9]];
DIV.forEach(([id, ic, nm, p, t]) => unitS(id, "carth", p, ic, nm, { t, size: "XX" }));
const pb2 = badge({ name: "GEORGE S. PATTON", role: "THIRD ARMY", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "tr", initials: "GSP", t: T_22, until: END - 0.3 });
quote("“Don't be fatuous, George.”", "EISENHOWER, REPORTEDLY", T_REP - 0.1, T_BROKE, { top: 170, size: 44, mw: 900 });
// Patton meant it: the three divisions' axes north toward Bastogne draw on (planned, dashed)
const AX = [[[ARL[0] - 150, ARL[1] - 100], [1290, 900], [1330, 620]], [ROAD[0], ROAD[1], ROAD[2], MAR, [1405, 640]], [[ARL[0] + 200, ARL[1] - 150], [1720, 1000], [1800, 880]]];
AX.forEach((pts, k) => arw({ pts, side: "carth", t: T_MEANT - 0.2 + k * 0.3, dur: 1.8, width: AW(0.95, 12), dash: "12 9" }));
wstampS("III CORPS", ARL[0] + 20, ARL[1] + 60, T_MEANT + 0.3, END + 1, "#9fc0ea", 20);
// the joke as the meeting broke up (no quote marks: paraphrase of the narration)
const j1 = scr(`<div style="padding:12px 30px;background:rgba(18,16,12,0.92);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:30px;letter-spacing:.08em">EISENHOWER: A NEW STAR, AND I GET ATTACKED</div>`, "left:0;right:0;top:950px;display:flex;justify-content:center;", T_STAR - 0.2, T_PANS - 0.1);
const j2 = scr(`<div style="padding:12px 30px;background:rgba(18,16,12,0.92);border-left:6px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:30px;letter-spacing:.08em">PATTON: AND EVERY TIME YOU GET ATTACKED, I PULL YOU OUT</div>`, "left:0;right:0;top:950px;display:flex;justify-content:center;", T_PANS, END + 1);
SFX("ref:pop", T_STAR); SFX("hit", T_PULL);
K.raiseTerritory();
fixImgs();
B.finish();
