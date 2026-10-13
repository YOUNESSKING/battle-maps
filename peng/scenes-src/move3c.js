// MOVE 3c (move3-7 .. move3-8), Peng #10: Peng halts (7-8 Jan 1951) + the result + the method. Basemap korea_hd_ref (z7), option 1
// (korea_ctl_jan7 from the hook agent, read-only). Winter.
//   move3-7  close on Seoul - Line D: the blue arrows stop short (stamp HALT · 7-8 JAN); the ghost chase south; Peng's memoir card
//            STRENGTH "REDUCED BY NEARLY 50 PER CENT" (verbatim, FACT_NOTES); zoom out: the supply line to the Yalu flickers and breaks under
//            US air attack (K.bombRun, red c47g, shake); ghost landing arrow at Inchon (ANOTHER INCHON?); PUSHED BACK, NOT BEATEN
//   move3-8  the road from the Yalu to south of Seoul; rings on Unsan / Chongchon / Seoul; RESULT card (no reliable casualty total);
//            PENG'S METHOD complete: OWN THE NIGHT · BAIT THE TRAP · HIT THE SEAMS
// Built with: python3 tools/build_scene.py move3c korea_hd_ref move3-7 move3-8
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const PR = GG.proj(7, 26503, 11759);
const L = (lat, lon) => PR(lat, lon);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
// @@KIT
// @@END-KIT
// @@DATA
// @@END-DATA
const PHOTO = { peng: "assets/media/peng_head.png" };
const M7 = "move3-7", M8 = "move3-8", S8 = PS(M8);
const T_STOP = at(M7, "And then Peng stopped"), T_CHASE = at(M7, "He could have chased"), T_EXP = at(M7, "many expected him"),
  T_KNEW = at(M7, "But Peng knew"), T_ACC = at(M7, "By his own account"), T_HALF = at(M7, "nearly half their strength"),
  T_SUP = at(M7, "His supply lines were"), T_LAND = at(M7, "he feared another American"), T_INCH = at(M7, "like Inchon"),
  T_PUSH = at(M7, "He knew the Americans"), T_REST = at(M7, "So he halted");
const T_3M = at(M8, "In less than three months"), T_YALU = at(M8, "from the Yalu River"), T_UNSAN = at(M8, "At Unsan"),
  T_CHONG = at(M8, "On the Chongchon"), T_SEOUL = at(M8, "And at Seoul"), T_OWN = at(M8, "Own the night."),
  T_BAIT = at(M8, "Bait the trap."), T_HIT = at(M8, "Hit the seams.");

// ---------- map layers ----------
ctlImg("assets/media/korea_ctl_jan7_mx.png", 0, null, 0.01);
GG.layer("background:rgba(225,236,248,0.10);", 0, null, { dur: 0.01 });
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.22 }); LV.scaleBar(955.79); LV.north();
const EM = L(42.6, 124.6);
B.image("assets/media/emblem_prc.png", EM[0] - 45, EM[1] - 45, 90, 90, { t: 0, dur: 0.6, opacity: 0.85 });
B.snow(0.1, END + 1);
const P38 = [L(38, 124.6), L(38, 128.7)];
const par = document.createElementNS("http://www.w3.org/2000/svg", "path"); par.setAttribute("d", `M${P38[0][0]} ${P38[0][1]} L${P38[1][0]} ${P38[1][1]}`);
par.setAttribute("stroke", "#f7f3ea"); par.setAttribute("stroke-width", "1.6"); par.setAttribute("stroke-dasharray", "7 5"); par.setAttribute("fill", "none"); par.setAttribute("opacity", "0.8");
document.getElementById("overlay").appendChild(par);
GG.lbl("38TH PARALLEL", L(38.0, 124.95)[0], L(38.0, 124.95)[1] - 7, { size: 9, t: 0.2 });
const FJ = K.front({ pts: KF_JAN7, sideA: "carth", sideB: "rome", t: 0.1, dur: 1.2, width: 6, until: END + 1 });

// ---------- camera: Seoul - Line D close -> the whole peninsula to the Yalu -> overview ----------
B.camera([[0, 1470, 965, 2.9], [T_KNEW, 1468, 970, 2.85], [T_SUP - 0.6, 1460, 960, 2.7], [T_SUP + 1.4, 1330, 800, 1.75], [T_PUSH, 1335, 810, 1.75],
  [T_REST + 1.6, 1380, 830, 1.3], [END, 1380, 830, 1.3]]);
B.showDate(0.1); B.date("7 – 8 JANUARY 1951", 0.2, T_3M - 0.2, 32); B.date("OCTOBER 1950 – JANUARY 1951", T_3M - 0.1, null, 28);
legend(0.2, S8 + 0.2, false);
// flags per camera
const CLU = T_SUP + 0.4;
flag(FL.prc, "CHINA", ...L(37.62, 127.45), 0.3, CLU, 28); flag(FL.us, "USA", ...L(36.72, 127.15), 0.4, CLU, 26);
flag(FL.rok, "SOUTH KOREA", ...L(36.72, 127.75), 0.5, CLU, 26);
flag(FL.prc, "CHINA", ...L(40.35, 124.05), T_SUP + 1.2, END + 1, 46); flag(FL.nk, "NORTH KOREA", ...L(39.7, 127.0), T_SUP + 1.3, END + 1, 42);
flag(FL.un, "UN COMMAND", ...L(36.4, 128.15), T_SUP + 1.4, END + 1, 40); flag(FL.us, "USA", ...L(35.75, 127.4), T_SUP + 1.5, END + 1, 38);
// the UN on Line D, the Chinese below Seoul
const UD = [["d1", 36.93, 126.95, FL.us], ["d2", 36.96, 127.25, FL.rok], ["d3", 37.07, 127.6, FL.us], ["d4", 37.24, 127.92, FL.us]];
UD.forEach(([id, la, lo, f], k) => unit(id, "rome", L(la, lo), k === 2 ? "tank" : "infantry", null, { t: 0.2 + k * 0.1, w: 13, h: 9, flag: f }));
const CA = [["a1", 37.42, 126.95], ["a2", 37.42, 127.25], ["a3", 37.45, 127.6]];
CA.forEach(([id, la, lo], k) => unit(id, "carth", L(la, lo), "infantry", null, { t: 0.15 + k * 0.1, w: 13, h: 9 }));
const ADV = [[[37.55, 126.97], [37.3, 126.99], [37.18, 127.02]], [[37.55, 127.2], [37.32, 127.27], [37.18, 127.3]], [[37.55, 127.5], [37.36, 127.58], [37.24, 127.62]]];
const AG = ADV.map((p, k) => arw({ pts: LL(p), side: "carth", t: 0.2 + k * 0.2, dur: 1.4, width: 4.5, until: T_SUP }));
CA.forEach(([id], k) => B.move(id, 0.4, 2.0, ...L(...[[37.24, 126.98], [37.24, 127.27], [37.3, 127.6]][k]), "power2.out"));
// the halt: the arrows stop, a stop bar across their heads
const BAR = glowPath(LL([[37.17, 126.9], [37.17, 127.3], [37.22, 127.68]]), "#f7f3ea", 2.2, T_STOP, T_SUP, 2);
BAR.setAttribute("stroke-dasharray", "6 4");
GG.stamp("HALT · 7 – 8 JAN", T_STOP + 0.3, T_CHASE + 1.2, { size: 62, top: 840, color: "#8fb2ff" });
// could have chased: ghost arrows south (faded) + question
const GH = [[[37.1, 127.05], [36.6, 127.25], [36.3, 127.4]], [[37.1, 127.6], [36.6, 127.95], [36.2, 128.3]]].map((p, k) =>
  arw({ pts: LL(p), side: "carth", t: T_CHASE + k * 0.3, dur: 1.2, width: 4, dash: "8 6", until: T_KNEW + 0.6 }));
GH.forEach((g) => B.tl.set(g, { opacity: 0.45 }, T_CHASE));
box("CHASE THEM SOUTH?", ...L(36.45, 126.75), T_EXP - 0.3, 5.5, T_KNEW + 0.6);
B.caption("MANY EXPECTED HIM TO KEEP GOING", T_EXP, T_KNEW - 0.1, "carth r");
badge({ name: "PENG DEHUAI", role: "KNEW HIS OWN MEN", initials: "PDH", photo: PHOTO.peng, flag: FL.prc, side: "carth", corner: "bl", t: T_KNEW - 0.3, until: T_REST + 0.4 });
// Peng's memoir card: strength reduced by nearly half (verbatim quote, FACT_NOTES move 3)
const MEM = scr(`<div style="width:900px;padding:22px 40px 26px;background:rgba(18,16,12,0.94);border-top:6px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 18px 40px rgba(0,0,0,.6)">
  <div style="font-size:20px;letter-spacing:.32em;color:#9fc0ea">PENG DEHUAI · MEMOIRS</div>
  <div style="font-size:30px;letter-spacing:.12em;margin-top:8px;color:#c9c4b4">HIS ARMIES' STRENGTH</div>
  <div style="font-size:50px;letter-spacing:.05em;line-height:1.15">"REDUCED BY NEARLY 50 PER CENT"</div>
  <div style="margin:16px auto 6px;width:640px;height:26px;border:3px solid #f7f3ea;position:relative;background:rgba(255,255,255,0.06)"><div class="bar" style="position:absolute;left:0;top:0;bottom:0;width:100%;background:#2e5cb2;box-shadow:0 0 14px #4f7fff"></div></div>
  <div style="font-size:18px;letter-spacing:.24em;color:#c9c4b4">BATTLE · COLD · HUNGER · SINCE THE AUTUMN</div></div>`,
  "left:0;right:0;top:140px;display:flex;justify-content:center;", T_ACC - 0.3, T_SUP + 0.2);
B.tl.fromTo(MEM.querySelector(".bar"), { width: "100%" }, { width: "50%", duration: 1.6, ease: "power2.inOut", immediateRender: false }, T_HALF - 0.4);
for (let k = 0; k < 5; k++) SFX("tick", T_HALF - 0.3 + k * 0.32);
SFX("hit", T_HALF + 1.3);
// supply lines at breaking point: the line to the Yalu flickers and breaks under air attack
const SUP = LL([[40.11, 124.39], [39.85, 125.0], [39.6, 125.65], [39.03, 125.75], [38.5, 125.76], [38.0, 126.55], [37.57, 126.98], [37.3, 127.1]]);
const SL = glowPath(SUP, "#ffd36a", 2.6, T_SUP - 0.2, END + 1, 0, 0.9); SL.setAttribute("stroke-dasharray", "7 5");
B.tl.to(SL, { opacity: 0.2, duration: 0.15, yoyo: true, repeat: 17, ease: "steps(1)" }, T_SUP + 0.4);
const YA = L(40.11, 124.39); box("YALU", YA[0] - 14, YA[1] - 10, T_SUP + 0.6, 7, END + 1, { bg: "#dcecf8" });
[[39.3, 125.72], [38.25, 126.15]].forEach(([la, lo], k) => xMark(...L(la, lo), T_SUP + 1.6 + k * 0.4, T_PUSH, 18));
bomber(LL([[39.7, 126.6], [39.25, 125.7], [38.85, 124.9]]), T_SUP + 0.6, 3, 3.6, 22, 6, 3);
box("SUPPLY LINES AT BREAKING POINT", ...L(39.55, 124.5), T_SUP + 1.0, 6.5, T_LAND + 0.4);
// another landing behind him, like Inchon: UN ships + a ghost landing arrow (dashed red)
const SH = [GG.ship(...L(37.35, 125.55), { w: 26, color: "#c4121f", t: T_LAND, pop: true, until: T_PUSH + 0.6 }), GG.ship(...L(37.6, 125.4), { w: 22, color: "#c4121f", t: T_LAND + 0.2, pop: true, until: T_PUSH + 0.6 })];
const LND = arw({ pts: LL([[37.4, 125.8], [37.45, 126.2], [37.47, 126.58]]), side: "rome", t: T_LAND + 0.3, dur: 1.2, width: 4, dash: "8 6", until: T_PUSH + 0.6 });
B.tl.set(LND, { opacity: 0.75 }, T_LAND + 0.3);
const IN = L(37.47, 126.63); K.target(IN[0], IN[1], T_INCH - 0.2, { r: 9, until: T_PUSH + 0.6 }); box("ANOTHER INCHON?", IN[0] - 8, IN[1] + 12, T_INCH, 6, T_PUSH + 0.6);
// pushed back, not beaten
B.tl.to(UD.map(([id]) => B.units[id].el), { scale: 1.6, duration: 0.35, yoyo: true, repeat: 3 }, T_PUSH + 0.2);
B.caption("THE AMERICANS: PUSHED BACK, NOT BEATEN", T_PUSH, T_REST - 0.1, "rome r");
B.caption("PENG HALTS HIS ARMY TO REST", T_REST, S8 - 0.1, "carth r");
// ============ move3-8: from the Yalu to south of Seoul; the three moves; RESULT; the method ============
const ROAD = LL([[40.3, 124.7], [40.05, 125.6], [39.6, 125.85], [39.0, 125.9], [38.3, 126.5], [37.6, 126.95], [37.2, 127.1]]);
arw({ pts: ROAD, side: "carth", t: T_REST + 0.6, dur: 2.6, width: 9, until: END + 1 });
const RG = [["UNSAN · NOV 1950", 39.98, 125.85, -16], ["CHONGCHON · NOV 1950", 39.5, 125.93, 16], ["SEOUL · JAN 1951", 37.57, 126.98, -16]];
RG.forEach(([nm, la, lo, dy], k) => { const p = L(la, lo); K.target(p[0], p[1], T_3M + k * 0.4, { r: 14, side: "carth", until: END + 1 }); box(nm, p[0] + 52, p[1] + dy, T_3M + 0.2 + k * 0.4, 7, END + 1); });
// RESULT card (no reliable casualty total for the Third Phase: FACT_NOTES)
const RES = scr(`<div style="width:820px;padding:20px 40px 24px;background:rgba(18,16,12,0.94);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:22px;letter-spacing:.32em;color:#c9b48a;text-align:center;margin-bottom:10px">RESULT · THE THIRD PHASE OFFENSIVE</div>
  ${["SEOUL TAKEN · 4 JAN 1951", "UN LINE PUSHED BACK TO LINE D", "US DIVISIONS ESCAPE"].map((r) => `<div class="rr" style="font-size:42px;letter-spacing:.06em;line-height:1.4;display:flex;gap:16px;align-items:center"><span style="color:#8fb2ff">▸</span>${r}</div>`).join("")}</div>`,
  "left:0;right:0;top:150px;display:flex;justify-content:center;", S8 - 0.1, T_UNSAN - 0.5);
RES.querySelectorAll(".rr").forEach((r, i) => { const t = S8 + 0.3 + i * 0.9; B.tl.fromTo(r, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.35 }, t); SFX("tick", t); });
SFX("hit", S8 + 0.1);
// the method, complete
GG.METHOD = ["OWN THE NIGHT", "BAIT THE TRAP", "HIT THE SEAMS"];
GG.METHOD_TITLE = "PENG'S METHOD";
const mc = GG.method(3, T_UNSAN - 0.6, END + 1, [T_UNSAN, T_CHONG, T_SEOUL]);
mc.querySelector(".k").textContent = "PENG'S METHOD";
mc.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "56px"; });
[T_UNSAN, T_CHONG, T_SEOUL].forEach((t) => SFX("hit", t + 0.1));
const rows = mc.querySelectorAll(".row");
[T_OWN, T_BAIT, T_HIT].forEach((t, i) => B.tl.fromTo(rows[i], { scale: 1 }, { scale: 1.07, color: "#8fb2ff", duration: 0.3, yoyo: true, repeat: 1, immediateRender: false }, t));
SFX("ref:boom", T_HIT + 0.3);
fixImgs();
K.raiseTerritory();
B.finish();
