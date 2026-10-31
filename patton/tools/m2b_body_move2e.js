// MOVE 2e (move2-5 .. move2-6), Patton #15: 22-23 Dec 1944. III Corps attacks north from Arlon at 06:00 (4th Armd left: CCB by Burnon -
// Chaumont, CCA on the Arlon - Martelange - Warnach road; 26th centre; 80th right: FACTCHECK_B rows 23-24); inside the ring the German
// surrender demand under a white flag, McAuliffe's NUTS (Kinnard, Harper's "Go to Hell!": vivid detail 8); fog and rain, the prayer cards
// (22 Dec), 23 Dec the sky clears: 241 transport planes drop supplies, 82 P-47s attack the ring (row 45); Chaumont 23 Dec: 11 Shermans,
// about 65 men lost, the liaison officer's wrong turn (rows 25, detail 7), Patton's phone call (detail 6, Cole p. 527).
// Basemap bastogne_hd_lift (z11), option 2 (glowing two-colour fronts only, 22 Dec: tools/m2b_make_control.py), close-up on Chaumont
// with the same map (no assenois basemap needed). Built with: python3 tools/m2b_inline.py move2e bastogne && python3 tools/build_scene.py move2e bastogne_hd_lift move2-5 move2-6
// @@KIT
// @@DATA
const GP = GG.proj(11, 269078, 177338);
const L = (la, lo) => GP(la, lo);
const P5 = "move2-5", P6 = "move2-6";
const T_SAME = at(P5, "That same day"), T_FOUR = at(P5, "four Germans walked"), T_MCA = at(P5, "Anthony McAuliffe answered"), T_NUTS = at(P5, "Nuts."),
  T_MUT = at(P5, "McAuliffe had muttered"), T_ASK = at(P5, "when he asked what to write"), T_KIN = at(P5, "Harry Kinnard"), T_HARD = at(P5, "would be hard to beat"),
  T_COL = at(P5, "The American colonel"), T_HELL = at(P5, "go to hell"), T_WX = at(P5, "The weather was the other enemy"), T_FOG = at(P5, "Fog and rain grounded"),
  T_PRAY = at(P5, "and Patton had asked his chaplain"), T_CARDS = at(P5, "The cards were handed out"), T_23 = at(P5, "On the twenty-third"), T_CLEAR = at(P5, "the sky cleared"),
  T_GOD = at(P5, "God damn"), T_ONEIL = at(P5, "That O'Neill"), T_241 = at(P5, "Two hundred and forty-one"), T_82 = at(P5, "eighty-two Thunderbolts");
const T6 = B.P(P6), T_ICE = at(P6, "The roads were ice"), T_STONE = at(P6, "dug into stone villages"), T_CHAU = at(P6, "At Chaumont"), T_LOST = at(P6, "the Fourth Armored lost eleven"),
  T_WRONG = at(P6, "An officer carrying attack orders"), T_PHONE = at(P6, "Patton picked up the telephone"), T_PIDD = at(P6, "There is too much piddling around"),
  T_BYP = at(P6, "Bypass these towns"), T_TANKS = at(P6, "Tanks can operate");
// ---------- places ----------
const BAS = L(50.0023, 5.7173), ARL = L(49.6834, 5.8167), MAR = L(49.833, 5.740), WAR = L(49.8653, 5.7263), CHA = L(49.9199, 5.6711), BUR = L(49.8904, 5.6612),
  ASS = L(49.9665, 5.6815), WIL = L(49.9666, 5.9321), NEU = L(49.8408, 5.435), ETT = L(49.8508, 6.0897), LUX = L(49.611, 6.130), SIB = L(49.9682, 5.6352);
// ---------- layers (option 2: no fill), rivers + living map, emblem ----------
drawRivers({ mpp: 49.29 });
emblem(1950, 250, 60);
// ---------- camera ----------
const S1 = [1420, 820, 1.25], S2 = [1392, 470, 2.6], S3 = [1420, 700, 1.0], S4 = [1335, 680, 3.0];
camera([[0, ...S1], [T_SAME - 0.6, 1420, 760, 1.3], [T_FOUR + 0.2, ...S2], [T_COL, 1396, 480, 2.75, "none"], [T_WX + 0.9, ...S3], [T_241 - 0.3, 1410, 600, 1.15],
  [T_ICE - 0.3, 1410, 620, 1.2], [T_ICE + 1.6, ...S4], [T_PHONE, 1330, 660, 3.1, "none"], [T_BYP + 0.2, 1340, 640, 2.4], [END, 1345, 630, 2.3]]);
B.showDate(0.05); B.date("22 DEC 1944 · 06:00", 0.1, T_SAME - 0.1, 32); B.date("22 DEC 1944", T_SAME, T_23 - 0.1, 32); B.date("23 DEC 1944", T_23, END + 1, 32);
legend(0.2, END + 1, true);
// flags per shot (both on every frame)
const FS = [[0, T_SAME - 0.7, [1150, 1100], [1800, 480]], [T_SAME - 0.5, T_WX + 0.8, [1338, 512], [1640, 335]], [T_WX + 1.0, T_ICE + 0.6, [1130, 1000], [1760, 430]],
  [T_ICE + 0.8, END + 1, [1235, 810], [1500, 585]]];
FS.forEach(([t0, t1, us, de], k) => { flagS(FL.us, "UNITED STATES", ...us, t0 + (k ? 0.1 : 0.2), t1); flagS(FL.de, "GERMANY", ...de, t0 + (k ? 0.2 : 0.3), t1); });
// fronts 22 Dec (flank + the ring), redrawn at the right width for each camera scale
const F22 = GD.fronts.dec22;
fset(F22, 1.25, 0, T_FOUR + 0.3, 1.6);
fset([F22[1]], 2.6, T_FOUR, T_WX + 1.0);
fset(F22, 1.05, T_WX + 0.6, T_ICE + 0.7);
fset([F22[0]], 3.0, T_ICE + 0.6, END + 1);
// towns (A2: big towns only; story places as small boxes)
town("BASTOGNE", BAS, "r", 0.3, { shrink: [[T6, null]] }); town("ARLON", ARL, "r", 0.35, { shrink: [[0.4, null]] });
town("WILTZ", WIL, "r", 0.4); town("NEUFCHÂTEAU", NEU, "l", 0.45); town("ETTELBRUCK", ETT, "r", 0.5);
// ---------- 06:00, 22 Dec: III Corps attacks north from Arlon ----------
const ck = scr(`<div style="display:flex;align-items:center;gap:14px;padding:8px 20px 10px;background:rgba(14,12,10,0.9);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea">
  <svg width="46" height="46" viewBox="-25 -25 50 50"><circle r="22" fill="#f1eee6" stroke="#c9b48a" stroke-width="3"/><line class="hh" x1="0" y1="0" x2="0" y2="11" stroke="#111" stroke-width="3.5" stroke-linecap="round"/><line class="mh" x1="0" y1="0" x2="0" y2="-17" stroke="#111" stroke-width="2" stroke-linecap="round"/></svg>
  <div style="font-size:30px;letter-spacing:0.08em">06:00 · III CORPS ATTACKS</div></div>`, "left:70px;top:150px;", 0.2, T_SAME + 0.4);
tl.fromTo(ck.querySelector(".mh"), { rotation: 0, svgOrigin: "0 0" }, { rotation: 720, svgOrigin: "0 0", duration: 1.4, ease: "power2.out" }, 0.3); for (let k = 0; k < 6; k++) SFX("tick", 0.3 + k * 0.2);
const III = [["cb", "tank", "4TH ARMD CCB", [ARL[0] - 170, ARL[1] - 120], [[ARL[0] - 170, ARL[1] - 120], [1330, 900], BUR]],
  ["ca", "tank", "4TH ARMD CCA", [ARL[0] - 40, ARL[1] - 60], [[ARL[0] - 40, ARL[1] - 60], [1480, 1000], [MAR[0] + 6, MAR[1] + 18]]],
  ["i26", "infantry", "26TH", [ARL[0] + 120, ARL[1] - 70], [[ARL[0] + 120, ARL[1] - 70], [1660, 1000], [1700, 905]]],
  ["i80", "infantry", "80TH", [ARL[0] + 300, ARL[1] - 70], [[ARL[0] + 300, ARL[1] - 70], [1880, 1000], [1905, 890]]]];
III.forEach(([id, ic, nm, p, path], k) => { unitS(id, "carth", p, ic, nm, { t: 0.1 + k * 0.12, size: id[0] === "i" ? "XX" : "" });
  arw({ pts: path, side: "carth", t: 0.4 + k * 0.25, dur: 2.0, width: AW(1.25, 11), until: T_ICE + 0.4 }); along(id, path, 0.6 + k * 0.25, T_FOUR - 0.6, 20); });
// German blocking positions on the flank + the ring
const GR = [["g1", [1290, 640]], ["g2", [1420, 700]], ["g3", [1640, 820]], ["g4", [1880, 820]]];
GR.forEach(([id, p], k) => unitS(id, "rome", p, k ? "infantry" : "tank", "", { t: 0.3 + k * 0.1 }));
const RG = [["r1", [1320, 400]], ["r2", [1480, 380]], ["r3", [1500, 520]], ["r4", [1290, 520]]];
RG.forEach(([id, p], k) => unitS(id, "rome", p, k % 2 ? "infantry" : "tank", "", { t: T_SAME - 0.3 + k * 0.1, until: T6 }));
unitS("ab101", "carth", [BAS[0] - 10, BAS[1] + 30], "infantry", "101ST AIRBORNE", { t: 0.4, size: "XX" });
// shells on the ring under the whole Bastogne beat (impact = boom + shake)
for (let tt = T_SAME + 0.8, k = 0; tt < T_WX; tt += 3.1, k++) shoot(RG[k % 4][1], [BAS[0] + 30 - (k % 3) * 22, BAS[1] - 20 + (k % 2) * 30], tt, { r: 5, h: 18, dur: 0.8 });
// ---------- the white flag: four Germans walk in from the south-east ----------
const WFP = [[1478, 610], [1455, 575], [1430, 545], [1412, 520]];
const WF = pinS(GG.pin(`<div style="display:flex;align-items:flex-end;gap:5px;filter:drop-shadow(0 2px 3px #000)">${[0, 1, 2, 3].map((k) => `<div style="width:16px;height:${k === 1 ? 34 : 28}px;border-radius:4px 4px 2px 2px;background:#9a968c;border:1.5px solid #1a1712;position:relative">${k === 1 ? `<div style="position:absolute;left:3px;top:-22px;width:2px;height:24px;background:#d8cfb8"></div><div style="position:absolute;left:5px;top:-22px;width:16px;height:11px;background:#fff;border:1px solid #888"></div>` : ""}</div>`).join("")}</div>`, WFP[0][0], WFP[0][1], { t: T_FOUR - 0.2, until: T_MCA + 0.4 }));
pinAlong(WF, WFP, T_FOUR, 3.4, 12); SFX("static", T_FOUR + 0.3);
boxS("WHITE FLAG · SURRENDER DEMAND", 1470, 640, T_FOUR + 0.6, T_MCA + 0.4, { size: 12, bg: "#f1eee6" });
badge({ name: "ANTHONY McAULIFFE", role: "101ST AIRBORNE · BASTOGNE", photo: PHOTO("mcauliffe"), flag: FL.us, side: "carth", corner: "tr", initials: "AM", t: T_MCA - 0.4, until: T_WX - 0.2 });
const NUTS = scr(stampHTML("NUTS!", "#f7f3ea", 150, -4), "left:0;right:0;top:330px;display:flex;justify-content:center;", T_NUTS - 0.3, T_MUT + 1.6, { autoAlpha: 0 });
slam(NUTS, T_NUTS - 0.3, { shake: 6 });
const kn = scr(`<div style="padding:12px 30px;background:rgba(18,16,12,0.92);border-left:6px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:30px;letter-spacing:.06em;text-align:center">KINNARD: WHAT HE SAID AT FIRST WOULD BE HARD TO BEAT<div style="font-size:16px;letter-spacing:.3em;color:#9fc0ea;margin-top:4px">LT. COL. HARRY KINNARD · OPERATIONS OFFICER</div></div>`, "left:0;right:0;top:860px;display:flex;justify-content:center;", T_KIN - 0.4, T_COL - 0.2);
SFX("ref:pop", T_KIN);
const hl = scr(`<div style="padding:14px 34px;background:rgba(18,16,12,0.93);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center"><div style="font-size:17px;letter-spacing:.32em;color:#c9b48a">TRANSLATED FOR THE GERMANS BY COL. HARPER</div><div style="font-size:52px;letter-spacing:.06em;margin-top:4px">NUTS = “GO TO HELL!”</div></div>`, "left:0;right:0;top:820px;display:flex;justify-content:center;", T_HELL - 1.0, T_WX - 0.1);
SFX("hit", T_HELL - 0.6);
// ---------- the weather: fog and rain, every plane grounded; the prayer cards ----------
fogBank(T_FOG - 0.6, T_CLEAR, 0.62); rain(T_FOG - 0.3, T_CLEAR - 0.2, 0.5);
const PLANE_X = `<svg width="64" height="64" viewBox="-50 -50 100 100" style="display:block"><path d="M40 0 L28 -5 L-24 -6 L-34 -4 L-34 4 L-24 6 L28 5 Z M12 -5 L-8 -34 L-18 -34 L-8 -5 Z M12 5 L-8 34 L-18 34 L-8 5 Z" fill="#f7f3ea"/><line x1="-44" y1="-44" x2="44" y2="44" stroke="#e3232f" stroke-width="9"/></svg>`;
const gr = scr(`<div style="display:flex;align-items:center;gap:16px;padding:10px 26px;background:rgba(18,16,12,0.92);border-top:5px solid #e3232f;font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:36px;letter-spacing:.08em">${PLANE_X}EVERY PLANE GROUNDED</div>`, "left:70px;top:150px;", T_FOG + 0.3, T_PRAY + 1.2);
SFX("hit", T_FOG + 0.5);
badge({ name: "GEORGE S. PATTON", role: "THIRD ARMY", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "tr", initials: "GSP", t: T_PRAY - 0.2, until: T_241 - 0.3 });
const CARD = `<svg width="48" height="58" viewBox="0 0 48 58" style="display:block"><rect x="3" y="3" width="42" height="52" rx="3" fill="#efe6cf" stroke="#c9b48a" stroke-width="2"/><line x1="10" y1="16" x2="38" y2="16" stroke="#7a6a4c" stroke-width="2.4"/><line x1="10" y1="24" x2="38" y2="24" stroke="#7a6a4c" stroke-width="2"/><line x1="10" y1="31" x2="34" y2="31" stroke="#7a6a4c" stroke-width="2"/><line x1="10" y1="38" x2="36" y2="38" stroke="#7a6a4c" stroke-width="2"/><line x1="24" y1="44" x2="24" y2="52" stroke="#7a6a4c" stroke-width="2"/><line x1="20" y1="47" x2="28" y2="47" stroke="#7a6a4c" stroke-width="2"/></svg>`;
placeCard("CHAPLAIN JAMES O'NEILL", "A PRAYER FOR GOOD WEATHER", "left:70px;top:330px;", T_PRAY + 0.8, T_23 - 0.2, CARD);
placeCard("22 DEC 1944", "CARDS HANDED OUT TO THE ARMY", "left:70px;top:470px;", T_CARDS - 0.2, T_23 - 0.2, "");
for (let k = 0; k < 6; k++) SFX("tick", T_CARDS + k * 0.18);
// ---------- 23 Dec: the sky clears ----------
const sun = GG.layer("background: radial-gradient(ellipse 70% 60% at 70% 20%, rgba(255,226,160,0.28), rgba(255,226,160,0) 70%);", T_CLEAR - 0.2, T_CHAU, { dur: 1.5 });
quote("“God damn! look at the weather. That O'Neill sure did some potent praying.”", "PATTON, 23 DECEMBER 1944", T_GOD - 0.2, T_241 - 0.2, { top: 800, size: 36, mw: 1300 });
// 241 transport planes (a few glowing C-47s, spaced, they drop and leave)
for (let k = 0; k < 4; k++) { const dy = k * 34 - 50, t = T_241 - 0.6 + k * 1.3;
  transport([[760, 760 + dy], [1392, 470 + dy * 0.5], [2050, 250 + dy]], t, 5.0, [[0.47, -10, 20], [0.5, 8, 26]], 58); }
ticker("TRANSPORT PLANES OVER BASTOGNE", 241, "", "left:70px;top:150px;", T_241, 2.6, T6 - 0.2, 12, { col: "#5b8fe8", sub: "23 DECEMBER · SUPPLIES DROPPED" });
// 82 P-47 Thunderbolts on the German ring (locked bombing runs, shake)
bomber([[1250, 300], [1420, 330], [1600, 400], [1760, 470]], T_82 - 0.3, 4, 3.6, 30);
bomber([[1150, 640], [1300, 600], [1460, 640], [1620, 660]], T_82 + 1.4, 4, 3.6, 30);
ticker("P-47 THUNDERBOLTS", 82, "", "left:70px;top:330px;", T_82 - 0.1, 2.0, T6 - 0.2, 10, { col: "#5b8fe8", sub: "ATTACKED THE GERMAN RING" });
// ---------- 23 Dec, Chaumont: the attack bogs down ----------
glowPath([BUR, [1318, 690], [1322, 668], CHA], "#dfe9ff", 1.6, T_ICE - 0.2, END + 1, 2, 0.8);
boxS("ICE", 1290, 700, T_ICE, T_LOST - 0.2, { size: 11, bg: "#dfe9ff" });
const VIL = [CHA, [1282, 612], ASS, [1380, 640]];
VIL.forEach((p, k) => pinS(GG.pin(`<div style="width:16px;height:16px;background:#7a7468;border:2px solid #e9e1cc;box-shadow:0 0 0 2px rgba(196,18,31,.75),0 2px 4px #000"></div>`, p[0], p[1], { t: T_STONE - 0.2 + k * 0.15, pop: true, until: END + 1 })));
boxS("CHAUMONT", CHA[0] - 44, CHA[1] - 14, T_CHAU - 0.2, END + 1, { size: 12 });
boxS("ASSENOIS", ASS[0] + 28, ASS[1] - 14, T_CHAU, END + 1, { size: 11 });
boxS("WARNACH", WAR[0] + 30, WAR[1] - 14, T_CHAU + 0.2, END + 1, { size: 11 });
B.move("cb", T6 - 0.2, 1.4, BUR[0] + 4, BUR[1] - 22);
unitS("cb2", "carth", [BUR[0] + 22, BUR[1] + 4], "tank", "", { t: T_CHAU - 0.4 });
arw({ pts: [[BUR[0] + 4, BUR[1] - 30], [1318, 685], [CHA[0] - 4, CHA[1] + 14]], side: "carth", t: T_CHAU - 0.2, dur: 1.2, width: AW(3, 11) });
const AG = [["ag1", [1378, 628]], ["ag2", [1392, 652]]];
AG.forEach(([id, p], k) => unitS(id, "rome", p, "tank", k ? "" : "ASSAULT GUNS", { t: T_CHAU + 0.4 + k * 0.2 }));
for (let k = 0; k < 6; k++) shoot(AG[k % 2][1], [BUR[0] + 4 + (k % 3) * 9 - 6, BUR[1] - 26 + (k % 2) * 12], T_CHAU + 1.0 + k * 0.55, { unit: AG[k % 2][0], r: 4, h: 6, dur: 0.35 });
ticker("CHAUMONT · 4TH ARMORED LOST", 11, " SHERMANS", "left:70px;top:150px;", T_LOST - 0.2, 1.8, T_PHONE - 0.2, 8, { col: "#e3232f", sub: "AND ABOUT 65 MEN" });
[[1300, 700], [1324, 708], [1296, 724]].forEach((p, k) => pinS(GG.pin(`<svg width="34" height="17" viewBox="6 38 92 42" style="display:block;opacity:.9;filter:drop-shadow(0 1px 2px #000)"><g fill="#9a968c"><path d="M10 58 L90 58 L84 74 L16 74 Z"/><path d="M30 44 L64 44 L70 58 L26 58 Z"/><rect x="62" y="46" width="34" height="5" rx="2"/></g></svg>`, p[0], p[1], { t: T_LOST + 0.3 + k * 0.3, pop: true, until: END + 1 })));
hideU(["cb2"], T_LOST + 0.3);
// the liaison officer's wrong turn into the German lines
const JP = [[BUR[0] - 30, BUR[1] + 10], [1270, 700], [1262, 676], [1268, 650], [1282, 628]];
vehicle(JP, T_WRONG - 0.2, 2.4, T_PHONE + 0.6, { s: 13, lights: false });
K.target(1282, 628, T_WRONG + 2.0, { r: 22, side: "#ff3b30", until: T_PHONE + 0.6 });
wstampS("WRONG TURN INTO GERMAN LINES", 1250, 598, T_WRONG + 2.1, T_PHONE + 0.6, "#ffb0a8", 22);
// Patton on the telephone: bypass the towns
phone("PATTON ON THE TELEPHONE · 23 DEC", "left:70px;top:150px;", T_PHONE - 0.2, END + 1);
const PQ = scr(`<div style="padding:16px 40px;background:rgba(18,16,12,0.93);border-left:8px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:56px;letter-spacing:.06em;-webkit-text-stroke:2px #000;paint-order:stroke fill;text-shadow:0 2px 6px rgba(0,0,0,.9)">“THERE IS TOO MUCH PIDDLING AROUND.”</div>`, "left:0;right:0;top:820px;display:flex;justify-content:center;", T_PIDD - 0.3, T_TANKS - 0.4);
slam(PQ, T_PIDD - 0.3, { from: 1.5, shake: 4 });
const BY = [[[BUR[0] - 20, BUR[1] - 10], [1268, 680], [1262, 620], [1300, 580], [ASS[0] - 10, ASS[1] + 22]], [[BUR[0] + 30, BUR[1] - 8], [1385, 690], [1405, 630], [1420, 565]]];
BY.forEach((pts, k) => arw({ pts, side: "carth", t: T_BYP - 0.1 + k * 0.4, dur: 1.6, width: AW(2.4, 12), dash: "10 7" }));
wstampS("BYPASS THE TOWNS", 1200, 560, T_BYP + 0.6, END + 1, "#9fc0ea", 22);
const tk = scr(`<div style="padding:10px 28px;background:rgba(18,16,12,0.92);border-left:6px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:34px;letter-spacing:.08em">TANKS CAN OPERATE ON THIS GROUND NOW</div>`, "left:0;right:0;top:900px;display:flex;justify-content:center;", T_TANKS - 0.2, END + 1);
SFX("hit", T_TANKS);
fixImgs();
B.finish();
