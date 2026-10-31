// MOVE 2g (move2-8), Patton #15: 26 Dec 1944, night: the corridor into Bastogne is open (narrow); S/Sgt James Hendrix (Medal of Honor);
// 40 trucks + 70 ambulances roll in, more than 200 vehicles waiting at Rossignol (Cole p. 555-556, FACTCHECK_B vivid detail 10);
// Christmas night: Bradley tells Patton Montgomery wanted to pull back to the Moselle, both found it disgusting (detail 11); Patton reaches
// Bastogne 30 Dec to pin a medal on McAuliffe; RESULT card (no reliable casualty total for the relief: row 39) + PATTON'S METHOD line 2.
// Basemap bastogne_hd_lift (z11), option 1 at night (territory 22 Dec -> 26 Dec with the E2 "ground about to be lost turns paler first"
// layers: tools/make_loss_layers.py m2b_bas_ctl dec22 dec26). Built with: python3 tools/m2b_inline.py move2g bastogne && python3 tools/build_scene.py move2g bastogne_hd_lift move2-8 move2-8
// @@KIT
// @@DATA
const GP = GG.proj(11, 269078, 177338);
const L = (la, lo) => GP(la, lo);
const P8 = "move2-8";
const T_NARROW = at(P8, "though narrow"), T_HEN = at(P8, "Staff Sergeant James Hendrix"), T_MOH = at(P8, "and earned the Medal"), T_NIGHT = at(P8, "That night forty trucks"),
  T_200 = at(P8, "and more than two hundred"), T_BEFORE = at(P8, "Only the night before"), T_BRAD = at(P8, "Bradley had told Patton"), T_DISG = at(P8, "Both men found it"),
  T_30 = at(P8, "Patton himself did not arrive"), T_PIN = at(P8, "to pin a medal"), T_VERD = at(P8, "From the conference in Verdun"), T_7 = at(P8, "it had taken seven days"),
  T_EAST = at(P8, "The army had gone"), T_METH = at(P8, "Patton's method here"), T_STAFF = at(P8, "The staff that drew");
// ---------- places ----------
const BAS = L(50.0023, 5.7173), ASS = L(49.9665, 5.6815), CLO = L(49.9519, 5.667), REM = L(49.937, 5.660), BER = L(49.902, 5.5365), ROS = L(49.7187, 5.4851),
  NEU = L(49.8408, 5.435), ARL = L(49.6834, 5.8167), WIL = L(49.9666, 5.9321);
const CORR = [ROS, [1080, 980], [1110, 860], BER, [1230, 650], REM, CLO, ASS, [1370, 505], BAS];
// ---------- layers: night, then the territory above it (muted for night), rivers, emblem ----------
const NL = GG.night(0, null, { dur: 0.01 });
const REST = ctlImg("assets/media/m2b_bas_ctl_dec22_rest_mx.png", 0, null, 0.01), LR = ctlImg("assets/media/m2b_bas_ctl_dec22_lostR_mx.png", 0, null, 0.01);
tl.to(LR, { opacity: 0.4, duration: 1.3 }, 0.3);                                      // E2: the ground about to change hands turns paler first
const LB = ctlImg("assets/media/m2b_bas_ctl_dec26_lostB_mx.png", 1.6, null, 1.0);   // then takes the winner's colour as the corridor opens
tl.to(LR, { opacity: 0, duration: 1.0 }, 1.6);
[REST, LR, LB].forEach((el) => { el.style.filter = "brightness(1.6) saturate(0.85)"; });
drawRivers({ mpp: 49.29, clouds: 0.08 });
emblem(1860, 430, 30);
// ---------- camera ----------
const C1 = [1340, 540, 1.8], C2 = [1240, 790, 1.0], C3 = [1450, 760, 0.8];
camera([[0, ...C1], [T_HEN + 0.2, 1350, 520, 2.0], [T_NIGHT - 0.6, ...C1], [T_200 - 0.4, ...C2], [T_30, ...C2], [T_30 + 1.8, 1380, 560, 1.45], [T_VERD - 0.4, 1385, 580, 1.4], [T_VERD + 1.2, ...C3], [END, C3[0], C3[1], 0.78]]);
B.showDate(0.05); B.date("26 DEC 1944 · NIGHT", 0.1, T_BEFORE - 0.1, 32); B.date("25 DEC · CHRISTMAS NIGHT", T_BEFORE, T_30 - 0.1, 32);
B.date("30 DEC 1944", T_30, T_VERD - 0.1, 32); B.date("19 - 26 DEC 1944", T_VERD, END + 1, 32);
legend(0.2, END + 1);
flagS(FL.us, "UNITED STATES", 1180, 780, 0.2, END + 1); flagS(FL.de, "GERMANY", 1640, 330, 0.3, END + 1);
town("BASTOGNE", BAS, "r", 0.3, { shrink: [[T_NIGHT, T_30]] }); town("NEUFCHÂTEAU", NEU, "l", 0.35); town("ARLON", ARL, "r", 0.4); town("WILTZ", WIL, "r", 0.45);
boxS("ASSENOIS", ASS[0] - 66, ASS[1] + 4, 0.4, END + 1, { size: 12 });
unitS("ab101", "carth", [BAS[0] + 40, BAS[1] - 30], "infantry", "101ST AIRBORNE", { t: 0.3, size: "XX" });
unitS("ad4", "carth", [ASS[0] - 40, ASS[1] + 40], "tank", "4TH ARMD", { t: 0.4, size: "XX" });
// the road is open, though narrow: the corridor glows, the German ring on both sides
glowPath(CORR.slice(5), "#8fb2ff", 2.4, 0.2, END + 1, 3, 0.95, { draw: 1.4, top: false });
sstamp("THE ROAD IS OPEN", 840, 0.6, { size: 50, color: "#9fc0ea", until: T_HEN - 0.2 });
boxS("NARROW", 1300, 540, T_NARROW, T_NIGHT, { size: 12, bg: "#d6e2ff" });
const GN = [["gn1", [1290, 425]], ["gn2", [1420, 575]], ["gn3", [1250, 590]]];
GN.forEach(([id, p], k) => unitS(id, "rome", p, k === 1 ? "artillery" : "infantry", "", { t: 0.4 + k * 0.1 }));
for (let tt = 1.2, k = 0; tt < T_HEN; tt += 1.6, k++) shoot(GN[1 + (k % 2)][1], [ASS[0] + 12 - k * 6, ASS[1] - 22 + k * 5], tt, { r: 5, h: 10, dur: 0.6 });
// Hendrix: a rifleman against two German gun crews
const H = pinS(GG.pin(`<div style="width:22px;height:32px;border-radius:8px 8px 3px 3px;background:#5b8fe8;border:2px solid #f3eee2;box-shadow:0 0 8px #6f9bff"></div>`, 1370, 530, { t: T_HEN - 0.2, until: T_NIGHT }));
const HG = [[1398, 548], [1404, 512]].map((p, k) => unitS("hg" + k, "rome", p, "artillery", k ? "" : "88 MM", { t: T_HEN - 0.1, w: 40, h: 27 }));
mg([1372, 530], [1396, 546], T_HEN + 0.6, 4, 1.0); mg([1372, 528], [1402, 514], T_HEN + 1.8, 4, 1.0);
B.grey(HG, T_HEN + 2.6);
const MOH = `<svg width="56" height="56" viewBox="-28 -28 56 56" style="display:block"><polygon points="0,-24 6,-8 23,-8 9,2 14,19 0,9 -14,19 -9,2 -23,-8 -6,-8" fill="#ffd54a" stroke="#7a5a10" stroke-width="2"/><circle r="6" fill="#1f4fc4" stroke="#fff" stroke-width="1.5"/></svg>`;
placeCard("S/SGT JAMES HENDRIX · A RIFLE vs TWO GUN CREWS", "MEDAL OF HONOR", "left:70px;top:150px;", T_HEN + 0.2, T_NIGHT - 0.2, MOH);
SFX("hit", T_MOH);
// that night: 40 trucks, 70 ambulances; more than 200 vehicles waiting behind
for (let k = 0; k < 7; k++) vehicle(CORR.slice(4), T_NIGHT - 0.4 + k * 0.7, 6.0, END + 1, { s: 16 });
const CNT = scr(`<div style="display:flex;gap:16px">${[["40", "TRUCKS"], ["70", "AMBULANCES"]].map(([a, b]) => `<div class="c" style="padding:8px 22px 10px;background:rgba(18,16,12,0.92);border-top:5px solid #5b8fe8;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center"><div class="n" style="font-size:52px;letter-spacing:.04em">0</div><div style="font-size:16px;letter-spacing:.3em;color:#9fc0ea">${b}</div></div>`).join("")}</div>`,
  "left:70px;top:150px;", T_NIGHT - 0.2, T_BEFORE - 0.2);
const NN = CNT.querySelectorAll(".n"); [[40, 0], [70, 1]].forEach(([v, i]) => { const st = { x: 0 }; tl.to(st, { x: v, duration: 2.2, ease: "none", onUpdate: () => { NN[i].textContent = Math.round(st.x); } }, T_NIGHT + 0.2 + i * 0.6); });
for (let k = 0; k < 12; k++) SFX("tick", T_NIGHT + 0.2 + k * 0.22);
const WAIT = []; for (let k = 0; k < 14; k++) { const q = posOn(CORR.slice(0, 4), k / 14); WAIT.push(vehicle([[q[0] - 2, q[1] + 2], q], T_200 - 0.3 + k * 0.08, 0.6, END + 1, { s: 10 })); }
boxS("200+ VEHICLES WAITING · ROSSIGNOL", ROS[0] + 10, ROS[1] + 40, T_200 + 0.3, T_30, { size: 13, bg: "#d6e2ff" });
// Christmas night: Bradley and Patton; Montgomery's idea of pulling back to the Moselle
badge({ name: "OMAR BRADLEY", role: "12TH ARMY GROUP", photo: PHOTO("bradley"), flag: FL.us, side: "carth", corner: "tl", initials: "OB", t: T_BRAD - 0.4, until: T_30 - 0.2 });
badge({ name: "GEORGE S. PATTON", role: "THIRD ARMY", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "tr", initials: "GSP", t: T_BRAD - 0.2, until: END + 1 });
const MOS = scr(`<div style="padding:12px 30px;background:rgba(18,16,12,0.92);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:32px;letter-spacing:.06em;text-align:center">MONTGOMERY WANTED TO PULL BACK TO THE MOSELLE<div class="d" style="font-size:40px;color:#ff8a80;letter-spacing:.12em;margin-top:6px">BOTH MEN FOUND IT DISGUSTING</div></div>`, "left:0;right:0;top:820px;display:flex;justify-content:center;", T_BRAD, T_30 - 0.2);
const dd = MOS.querySelector(".d"); gsap.set(dd, { autoAlpha: 0 }); tl.fromTo(dd, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.3, immediateRender: false }, T_DISG); SFX("hit", T_DISG + 0.2);
arw({ pts: [[1700, 900], [1820, 1100], [1950, 1300]], side: "#8a877f", t: T_BRAD + 0.6, dur: 1.6, width: AW(1.0, 10), dash: "10 8", until: T_30 });
// 30 Dec: Patton in Bastogne, a medal for McAuliffe
badge({ name: "ANTHONY McAULIFFE", role: "101ST AIRBORNE", photo: PHOTO("mcauliffe"), flag: FL.us, side: "carth", corner: "tl", initials: "AM", t: T_30, until: T_VERD - 0.2 });
sstamp("30 DEC · PATTON IN BASTOGNE", 820, T_30 + 0.5, { size: 48, color: "#9fc0ea", sub: "A MEDAL FOR McAULIFFE", until: T_VERD - 0.3 });
K.target(BAS[0], BAS[1], T_PIN, { r: 40, side: "#5b8fe8", until: T_VERD });
// RESULT (no reliable casualty total for the relief: FACTCHECK_B row 39) + the method card, line 2
const RES = scr(`<div style="padding:18px 46px 22px;background:rgba(18,16,12,0.93);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:18px;letter-spacing:.34em;color:#c9b48a">RESULT</div><div style="font-size:58px;letter-spacing:.05em;color:#9fc0ea;margin-top:6px">THE SIEGE OF BASTOGNE IS BROKEN</div>
  <div class="r2" style="font-size:36px;letter-spacing:.08em;margin-top:6px">VERDUN TO THE LINK-UP: <span style="color:#ffd54a">7 DAYS</span></div>
  <div class="r3" style="font-size:36px;letter-spacing:.08em;margin-top:4px">FROM ATTACKING EAST TO FIGHTING NORTH</div></div>`, "left:0;right:0;top:250px;display:flex;justify-content:center;", T_VERD - 0.2, T_METH - 0.3, { autoAlpha: 0 });
slam(RES, T_VERD - 0.2, { from: 1.4, shake: 4 });
[[".r2", T_7], [".r3", T_EAST]].forEach(([c, t]) => { const el = RES.querySelector(c); gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4, immediateRender: false }, t - 0.1); SFX("hit", t); });
// the 90-degree turn drawn on the wide map under the result: east-facing arrows grey, the northward arrow glows
glowPath([[1720, 1500], [1640, 1350], [1560, 1180], [1460, 900], [1400, 560]], "#8fb2ff", 3, T_EAST, END + 1, 3, 0.9, { draw: 1.6, top: true });
method(2, T_METH - 0.2, END + 1, T_METH + 0.6);
fixImgs();
B.finish();
