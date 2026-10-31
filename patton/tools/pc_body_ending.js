// ENDING (end-1 .. end-2), George S. Patton #15. Map agent C. Built with: python3 tools/pc_inline.py ending europe_hd_lift end-1 end-2
// `europe` (z7), option 1, territory 22-24 March 1945 (tools/pc_make_control.py; ALLIES / GERMANY / NEUTRAL).
// end-1: "Three moves, one method": rings 1 AVRANCHES / 2 BASTOGNE / 3 THE RHINE + Third Army's dashed road; PATTON'S METHOD complete,
//   each line lights on its words while its ring acts on the map (the breakout fans out / the 90-degree turn north / boats over the Rhine);
//   "far from perfect": the badge greys, SICILY · AUGUST 1943 card (the slapping, reprimanded: script background, FACTCHECK_A row 12);
//   "no one faster": the whole road lights and runs; "a year after Bastogne": the map dims (post-war, no territory, no flags: a locator
//   beat), 9 DEC 1945 · MANNHEIM ring, DIED 21 DECEMBER 1945 · HEIDELBERG (FACTCHECK_A row 23).
// end-2: E.final (1 AVRANCHES 1944 / 2 BASTOGNE 1944 / 3 OPPENHEIM 1945, 1, 2 OR 3?, the family-story line, corner subscribe); the whole
//   paragraph lies in the last ~22 s, so (C3) the card shrinks into the top band right after the question; the map stays alive under it.
// @@KIT
// @@DATA
const EU = GG.proj(7, 15217, 10331);
const E1 = "end-1", E2 = "end-2", S2 = B.P(E2);
const T_THREE = at(E1, "Three moves"), T_KEEP = at(E1, "Keep moving"), T_NET = at(E1, "walk into your net"), T_PLAN = at(E1, "Plan the turn"), T_STRIKE = at(E1, "And strike"),
  T_FAR = at(E1, "Patton was far"), T_TEMPER = at(E1, "His temper"), T_SICILY = at(E1, "in Sicily"), T_BUT = at(E1, "But when an army"), T_FASTER = at(E1, "no one faster"),
  T_YEAR = at(E1, "A year after"), T_DEAD = at(E1, "he was dead"), T_CAR = at(E1, "car accident");
const T_ONE = at(E2, "One, the breakout"), T_TWO = at(E2, "Two, the relief"), T_THR = at(E2, "Or three"), T_TELL = at(E2, "Tell us in the comments"),
  T_FAM = at(E2, "And if someone"), T_SUB = at(E2, "Subscribe");
const A1 = EU(48.684, -1.357), A2 = EU(50.002, 5.717), A3 = EU(49.856, 8.357), MAN = EU(49.49, 8.47), HEI = EU(49.40, 8.69);
// ---------- map ----------
const CTL = ctlImg("assets/media/pc_eur_ctl_mar45_mx.png", 0, null, 0.01);
const RV = document.createElementNS(NS, "g"); OVL.insertBefore(RV, OVL.firstChild);
RV.innerHTML = GD.rivers.map((pts) => `<path d="M${pts.map((q) => q.join(" ")).join(" L")}" fill="none" stroke="rgba(120,170,215,0.8)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.14 }); LV.scaleBar(789.39); LV.north();
const SE = 1.35, EC = EU(49.2, 3.6), EC2 = EU(50.1, 3.8);
camera([[0, EC[0], EC[1], SE], [T_YEAR - 0.4, EC[0] + 30, EC[1] - 10, SE * 1.04], [T_DEAD, ...EU(49.6, 6.4), SE * 1.25, "power2.inOut"], [S2 - 0.3, ...EU(49.6, 6.4), SE * 1.28],
  [S2 + 0.8, EC2[0], EC2[1], SE, "power2.inOut"], [END, EC2[0] + 40, EC2[1] - 10, SE * 1.05]]);
B.showDate(0.05); B.date("1944 - 1945", 0.1, T_YEAR, 32); B.date("DECEMBER 1945", T_YEAR + 0.05, S2 - 0.1, 32); B.date("1944 - 1945", S2, END + 1, 32);
const LGN = GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "ALLIES"], ["#be3a2a", "GERMANY"], ["#9a968a", "NEUTRAL"]].map(([sq, nm]) => `<span><b style="display:inline-block;width:20px;height:20px;background:${sq};vertical-align:-3px;border:1px solid #f7f3ea;margin-right:8px"></b>${nm}</span>`).join("")}</div>`, "", 34, 0.1, null);
const FLS = [flagS(FL.us, "UNITED STATES", ...EU(48.15, 1.6), 0.1, null), flagS(FL.de, "GERMANY", ...EU(50.6, 10.2), 0.15, null)];
const EMB = emblem(...EU(48.5, 10.4), 34);
const TWN = [["PARIS", 48.857, 2.352, "r"], ["BRUSSELS", 50.85, 4.35, "r"], ["METZ", 49.12, 6.18, "l"]].map(([n, la, lo, sd]) => town(n, EU(la, lo), sd, 0.1));
const PB = badge({ name: "GEORGE S. PATTON", role: "U.S. THIRD ARMY · 1885 - 1945", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "bl", initials: "GSP", t: 0.2, until: S2 - 0.3 });
const RING = PB.querySelector("div[style*='border-radius:50%']");
// ---------- the three numbered rings + Third Army's road ----------
const ringN = (p, txt, n, t, until, dx, dy) => { K.target(p[0], p[1], t, { r: 30 / SE, until });
  const el = GG.pin(`<div style="display:flex;align-items:center;gap:8px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 2px 4px #000,0 0 3px #000"><span style="display:inline-flex;width:34px;height:34px;border-radius:50%;border:3px solid #ffd54a;align-items:center;justify-content:center;font-size:19px">${n}</span><span style="font-size:32px;letter-spacing:.1em;white-space:nowrap">${txt}</span></div>`, p[0] + dx, p[1] + dy, { t: t + 0.1, pop: true, until });
  pinS(el); SFX("ref:pop", t + 0.12); return el; };
const UN = T_YEAR - 0.3;
const R1 = ringN(A1, "AVRANCHES", 1, T_THREE + 0.1, UN, -10, 40), R2 = ringN(A2, "BASTOGNE", 2, T_THREE + 0.35, UN, 0, -40), R3 = ringN(A3, "THE RHINE", 3, T_THREE + 0.6, UN, 30, 38);
const ROAD = [A1, EU(48.3, 0.5), EU(48.95, 1.7), EU(48.9, 4.0), EU(48.95, 6.0), EU(49.3, 6.4), EU(49.75, 5.95), A2, EU(49.85, 6.6), EU(49.75, 7.6), A3];
arw({ pts: ROAD, side: "carth", t: T_THREE, dur: 1.8, width: AW(SE, 8), dash: "12 9", until: UN });
// line 1 (keep moving): the breakout fans out of the Avranches corner; the counterattack at Mortain stalls
const pulseR = (el, t) => { tl.to(el, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }, t); SFX("hit", t + 0.05); };
pulseR(R1, T_KEEP);
[[A1, EU(48.20, -2.6)], [A1, EU(48.0, 0.2)]].forEach((pts, k) => arw({ pts, side: "carth", t: T_KEEP + k * 0.2, dur: 0.9, width: AW(SE, 10), until: T_FAR }));
arw({ pts: [EU(48.75, -0.3), EU(48.68, -0.85)], side: "rome", t: T_NET - 0.6, dur: 0.6, width: AW(SE, 9), until: T_FAR });
K.impact(...EU(48.66, -0.95), T_NET, { r: 5, puffs: 2 });
// line 2 (plan the turn): the 90-degree swing from the Saar north to Bastogne
pulseR(R2, T_PLAN);
arw({ pts: [EU(49.05, 6.6), EU(49.15, 6.15), EU(49.55, 5.85), A2], side: "carth", t: T_PLAN - 0.1, dur: 1.0, width: AW(SE, 11), until: T_FAR });
K.impact(A2[0] + 3, A2[1] - 3, T_PLAN + 1.0, { r: 5, puffs: 2 });
// line 3 (strike before they think you can): across the Rhine at night
pulseR(R3, T_STRIKE);
arw({ pts: [EU(49.86, 8.15), EU(49.86, 8.55), EU(49.9, 8.85)], side: "carth", t: T_STRIKE, dur: 0.8, width: AW(SE, 11), until: T_FAR });
K.impact(A3[0] + 4, A3[1], T_STRIKE + 0.8, { r: 5, puffs: 2 });
// PATTON'S METHOD, complete (one line lights on its words)
GG.METHOD = ["KEEP MOVING", "PLAN THE TURN BEFORE THE ORDER COMES", "STRIKE BEFORE THEY THINK YOU CAN"]; GG.METHOD_TITLE = "PATTON'S METHOD";
const MC = GG.method(3, T_KEEP - 0.5, T_FAR - 0.2, [T_KEEP - 0.1, T_PLAN - 0.1, T_STRIKE - 0.1]);
MC.style.top = "130px"; MC.firstElementChild.style.zoom = "0.7";
SFX("ref:boom", T_STRIKE + 0.6);
// ---------- "far from perfect ... his temper ... Sicily" ----------
tl.to(RING, { filter: "grayscale(1) brightness(0.6)", duration: 0.4 }, T_TEMPER);
const SIC = scr(`<div style="display:flex;align-items:center;gap:18px;padding:12px 30px 14px;background:rgba(18,16,12,0.94);border-top:6px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 18px 40px rgba(0,0,0,.6)"><div><div style="font-size:20px;letter-spacing:.32em;color:#ef8a82">SICILY · AUGUST 1943</div><div style="font-size:44px;letter-spacing:.06em;line-height:1.1">SLAPPED TWO HOSPITALISED SOLDIERS</div><div style="font-size:22px;letter-spacing:.2em;color:#d8cfb8">REPRIMANDED BY EISENHOWER · HIS CAREER NEARLY OVER</div></div></div>`,
  "left:0;right:0;top:150px;display:flex;justify-content:center;", T_TEMPER - 0.1, T_BUT - 0.1, { autoAlpha: 0, y: 30 });
SFX("hit", T_SICILY); K.shake(T_SICILY, 3, 0.25);
// ---------- "no one faster": the badge comes back, the whole road lights and runs ----------
tl.to(RING, { filter: "grayscale(0) brightness(1)", duration: 0.4 }, T_BUT);
trail(ROAD, "#9fc0ea", 5 / SE, T_BUT + 0.1, 2.6, UN, "5 7");
glowPath(ROAD, "#6f9bff", 9 / SE, T_FASTER - 0.2, UN, 2, 0.8);
sstamp("NO ONE FASTER", 860, T_FASTER, { size: 72, sub: "IN THE WHOLE AMERICAN ARMY", color: "#9fc0ea", shake: 4, until: T_YEAR - 0.2 });
[[A1, 0], [A2, 0.4], [A3, 0.8]].forEach(([p, d]) => K.impact(p[0], p[1] - 4, T_FASTER + 0.4 + d, { r: 5, puffs: 2 }));
// ---------- "A year after Bastogne, he was dead, from a car accident in Germany" (post-war: no territory, no flags; a locator beat) ----------
const DIM = document.createElement("div"); DIM.style.cssText = "position:absolute;left:-3000px;top:-3000px;width:9000px;height:8000px;background:rgba(5,7,13,0.66);"; WORLD.insertBefore(DIM, OVL); gsap.set(DIM, { autoAlpha: 0 });
tl.to(DIM, { autoAlpha: 1, duration: 0.5 }, T_YEAR - 0.2); tl.to(DIM, { autoAlpha: 0, duration: 0.6 }, S2 - 0.2);
tl.to([CTL, ...FLS, EMB, LGN, ...TWN], { autoAlpha: 0, duration: 0.5 }, T_YEAR - 0.2);
tl.to([CTL, ...FLS, EMB, LGN, ...TWN], { autoAlpha: 1, duration: 0.6 }, S2 - 0.2);
tl.to(CTL, { opacity: 1, duration: 0.01 }, S2 + 0.45);
const CAL = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700"><div style="font-size:22px;letter-spacing:0.4em;color:#c9b48a">A YEAR AFTER BASTOGNE</div><div style="font-size:100px;line-height:1;color:#f7f3ea;letter-spacing:0.05em">21 DECEMBER 1945</div></div>`,
  "left:0;right:0;top:150px;display:flex;justify-content:center;", T_YEAR - 0.1, S2 - 0.2, { autoAlpha: 0, y: 30 });
for (let k = 0; k < 5; k++) SFX("tick", T_YEAR + k * 0.15);
tl.to(RING, { filter: "grayscale(1) brightness(0.5)", duration: 0.6 }, T_DEAD);
K.target(MAN[0], MAN[1], T_CAR - 0.4, { r: 14, side: "#d8cfb8", until: S2 - 0.2 });
const LOCT = GG.pin(`<div style="font-family:Oswald;font-weight:700;color:#f7f3ea;text-shadow:0 2px 6px #000;white-space:nowrap"><div style="font-size:30px;letter-spacing:.12em">MANNHEIM · 9 DEC 1945</div><div style="font-size:19px;letter-spacing:.2em;color:#c9b48a">CAR ACCIDENT · DIED IN HEIDELBERG, 21 DEC</div></div>`, MAN[0] + 22, MAN[1], { t: T_CAR - 0.3, pop: true, until: S2 - 0.2, anchor: [0, -50] }); reg(LOCT.firstElementChild, "0% 50%");
SFX("hit", T_CAR - 0.2); B.city("", HEI[0], HEI[1], { r: 3, t: T_CAR });
// =====================================================================================================================
// end-2: the final question; C3: the card moves into the top band right after the question, the map stays alive under it
// =====================================================================================================================
const EF = E.final({ moves: [["AVRANCHES", "1944"], ["BASTOGNE", "1944"], ["OPPENHEIM", "1945"]], tShow: S2 - 0.1,
  tNums: [T_ONE, T_TWO, T_THR], tAsk: T_TELL - 0.3, tFamily: T_FAM - 0.2, tSub: T_SUB - 0.6, until: END - 0.2 });
const PILL = document.getElementById("credit").previousElementSibling;
EF.querySelector(".fam").innerHTML = `FAMILY SERVED IN EUROPE IN WWII, ON EITHER SIDE?<div style="font-size:24px;letter-spacing:0.3em;color:#c9b48a;margin-top:4px">TELL US THEIR STORY · WE READ EVERY ONE</div>`;
EF.querySelector(".q").textContent = "WHICH WAS PATTON'S GREATEST MOVE?"; EF.querySelector(".q").style.fontSize = "68px";
const BACK = EF.previousElementSibling;
const TL3 = S2 + 1.6;
tl.to(BACK, { autoAlpha: 0, duration: 0.8 }, TL3 - 0.2);
tl.to(["#date", LGN], { autoAlpha: 0, duration: 0.4 }, TL3 - 0.3);
tl.to(EF, { scale: 0.42, y: -142, transformOrigin: "50% 0%", duration: 0.7, ease: "power3.inOut" }, TL3); SFX("ref:whoosh", TL3 + 0.05);
Object.assign(PILL.style, { right: "50px", top: "34px", bottom: "auto" });
// the map stays alive: rings pulse, a small fight flares at each place on its number
[[A1, "AVRANCHES", 1, -10, 40], [A2, "BASTOGNE", 2, 0, -40], [A3, "OPPENHEIM", 3, 30, 38]].forEach(([p, nm, n, dx, dy], i) => ringN(p, nm, n, S2 + 0.4 + i * 0.25, END + 1, dx, dy));
arw({ pts: ROAD, side: "carth", t: S2 + 0.5, dur: 1.8, width: AW(SE, 8), dash: "12 9", until: END + 1 });
[[A1, T_ONE], [A2, T_TWO], [A3, T_THR]].forEach(([p, t]) => [0, 0.3].forEach((d) => K.impact(p[0] - 3 + d * 10, p[1] - 3, t + 0.3 + d, { r: 5, puffs: 2 })));
K.raiseTerritory();
B.finish();
