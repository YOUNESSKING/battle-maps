// ending (end-1 [+ the final-question paragraph once it is voiced]), Grant #16: the three moves in a row on their own maps:
// `tennessee` (Donelson, Feb 1862, 34-star flag) -> `mississippi` (Vicksburg 1863, the river Union) -> `richmond` (the James, June 1864),
// each with its spoken method line; the nickname = his initials (U. S. GRANT, 1862); "By 1865 it described a method" -> GRANT'S METHOD card.
// If the final-question paragraph is voiced (it is NOT in audio/timing.json yet: narrate.py skips a paragraph without a [tag]), the scene adds
// Appomattox on its words, E.final (three numbered moves, 1, 2 OR 3?, the family line, subscribe) and shrinks it to the top band for the last
// 20 s so YouTube's end-screen elements fit (owner C3), the map alive under it.
// Built with: python3 tools/m3_build.py ending tennessee end-1 end-2 mississippi richmond   (tennessee_hd_lift is the relief; the others ext_*.jpg)
// @@BODY
const G = GEO, P1 = "end-1";
const T_DON = at(P1, "At Donelson"), T_STRUCK = at(P1, "he struck while"), T_VICK = at(P1, "At Vicksburg"), T_WENT = at(P1, "he went where"),
  T_LAND = at(P1, "lived off the land"), T_JAMES = at(P1, "On the James"), T_SLIP = at(P1, "he slipped a hundred thousand"), T_BREATH = at(P1, "no time to catch his breath"),
  T_NICK = at(P1, "The nickname the North"), T_1862 = at(P1, "eighteen sixty-two"), T_INIT = at(P1, "a joke about his initials"), T_1865 = at(P1, "By eighteen sixty-five"),
  T_METH = at(P1, "it described a method");
// final-question paragraph (optional until re-voiced)
const F_SURR = atAny("Grant took the surrender"), F_APP = atAny("Appomattox"), F_Q = atAny("So which was Grant's greatest move"), F_1 = atAny("One, the two river forts"),
  F_2 = atAny("Two, Vicksburg"), F_3 = atAny("Or three"), F_TELL = atAny("Tell us in the comments"), F_FAM = atAny("served in the Civil War"), F_SUB = atAny("Subscribe, so you");
const HAS_FINAL = F_Q != null && F_TELL != null;
const T_X1 = T_DON - 0.9, T_X2 = T_VICK - 0.6, T_X3 = T_JAMES - 0.5;        // map dissolves (each lands on the spoken place)
// ---------- maps: tennessee relief (Feb 1862 layer) -> mississippi (July 1863) -> richmond (June 1864) ----------
const FL34 = "assets/media/us34_flag.png";
terr("assets/media/m1_ten_feb16_mx.png", 0, T_X2 + 0.2, 1.0, 0.9);
extImg("assets/ext_mississippi.jpg", T_X2, T_X3 + 1.0, { dur: 0.9, outDur: 0.01 });
extImg("assets/ext_richmond.jpg", T_X3, null, { dur: 0.9 });
terr("assets/media/m3_mis_jul_mx.png", T_X2, T_X3 + 0.9, 0.9, 0.9);
terr("assets/media/m3_ric_jun18_mx.png", T_X3, null, 0.9);
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 }); LV.north();
const KEYS = [[0, 1440, 905, 1.7], [T_X1 + 0.6, 1440, 900, 2.1], [T_X2 - 0.1, 1440, 905, 2.25], [T_X2 + 0.6, 1440, 990, 1.75], [T_X3 - 0.1, 1420, 980, 1.95],
  [T_X3 + 0.8, 1470, 905, 3.4], [T_NICK, 1470, 900, 3.7], [T_METH, 1460, 905, 3.4]];
if (HAS_FINAL) KEYS.push([F_APP != null ? F_APP - 0.6 : F_Q - 3, 1260, 880, 2.0], [F_Q, 1240, 880, 1.9], [END, 1250, 885, 1.85]); else KEYS.push([END, 1458, 905, 3.3]);
camera(KEYS);
dateNow("JUNE 1864 – APRIL 1865", T_DON - 0.1); B.date("FEBRUARY 1862", T_DON, T_VICK - 0.1, 34); B.date("1863", T_VICK, T_JAMES - 0.1, 34); B.date("JUNE 1864", T_JAMES, T_1865 - 0.1, 34);
B.date("1865", T_1865, null, 34);
const LGD = now(legend(0, END + 1, false));
// ---------- 1: Donelson (tennessee map) ----------
flagS(FL34, 1430, 800, 0, T_X2 + 0.6, 100); flagS(FL.cs, 1500, 1030, 0, T_X2 + 0.6, 100);
const TEN_S = [[1390, 890], [1400, 1000], [1420, 1100], [1400, 1200]], CUMB = [[1456, 900], [1500, 920], [1560, 940], [1637, 888], [1700, 970], [1760, 1020], [1848, 1054]];
glowPath(TEN_S, "#6f9bff", 2.6, 0, T_X2 + 0.6, 2, 0.8); glowPath(CUMB, "#6f9bff", 2.6, 0, T_X2 + 0.6, 2, 0.8);
const GT = ship("iron", "carth", [1460, 905], 20, 0, T_X2 + 0.6, { L: 40 }); sail(GT, CUMB, 0, T_X2, 20);
[G.ten.FORT_HENRY, G.ten.FORT_DONELSON].forEach((p) => { fortIcon(p, 0, T_X2 + 0.6, { s: 18, col: "#4f8bff" }); });
poleFlag(FL34, [G.ten.FORT_DONELSON[0] + 3, G.ten.FORT_DONELSON[1] - 6], T_DON, T_X2 + 0.6, 30);
boxS("DONELSON", G.ten.FORT_DONELSON[0] + 30, G.ten.FORT_DONELSON[1] + 34, T_DON, null, { size: 28 });
K.target(G.ten.FORT_DONELSON[0], G.ten.FORT_DONELSON[1], T_DON + 0.1, { r: 30, side: "#ffd54a", until: T_X2 });
B.caption("HE STRUCK WHILE THE ENEMY WAS STILL DECIDING", T_STRUCK, T_VICK - 0.2, "carth");
// ---------- 2: Vicksburg (mississippi map) ----------
flagS(FL.us, 1392, 885, T_X2 + 0.4, T_X3 + 0.8, 100); flagS(FL.cs, 1600, 1010, T_X2 + 0.4, T_X3 + 0.8, 100);
const VK = G.mis.VICKSBURG;
boxS("VICKSBURG", VK[0] + 40, VK[1] - 40, T_VICK, null, { size: 28 });
arw({ pts: G.mis.VKS, side: "carth", t: T_WENT - 0.2, dur: 3.2, width: AW(1.9, 13), until: T_X3 + 0.8 });
unitS("va", "carth", G.mis.VKS[0], "infantry", null, { t: T_X2 + 0.3, size: "XXXX" }); along("va", G.mis.VKS, T_WENT - 0.1, 5.6, 24); hideU(["va"], T_X3 + 0.6);
unitS("vr", "rome", [VK[0] + 10, VK[1] + 4], "infantry", null, { t: T_X2 + 0.4, size: "XXX" });
B.caption("WHERE THE ENEMY SAID NO ARMY COULD GO", T_WENT + 0.2, T_LAND - 0.2, "carth");
B.caption("AND LIVED OFF THE LAND TO DO IT", T_LAND, T_JAMES - 0.2, "carth");
// ---------- 3: the James (richmond map) ----------
flagS(FL.us, 1590, 960, T_X3 + 0.5, HAS_FINAL ? (F_APP ?? F_Q) - 0.3 : END + 1, 100); flagS(FL.cs, 1350, 820, T_X3 + 0.5, HAS_FINAL ? (F_APP ?? F_Q) - 0.3 : END + 1, 100);
const R = G.ric;
arw({ pts: R.MOVE, side: "carth", t: T_JAMES - 0.1, dur: 2.6, width: AW(3.4, 13), dash: "9 6", until: END + 1 });
glowPath([R.WEYANOKE, [R.WEYANOKE[0] - 1, R.WEYANOKE[1] + 5]], "#6f9bff", 2.0, T_JAMES + 0.8, END + 1, 3, 0.95, { top: true });
boxS("THE JAMES", R.WEYANOKE[0] + 14, R.WEYANOKE[1] + 14, T_JAMES, null, { size: 28, bg: "#dcecf8" });
frontS({ pts: R.CH_FRONT, sideA: "carth", sideB: "rome", t: T_X3 + 0.4, dur: 0.6, width: FWw(3.4), until: T_SLIP + 2.0 });
frontS({ pts: [[1440, 948], [1437, 962], [1430, 975], [1420, 985]], sideA: "carth", sideB: "rome", t: T_SLIP + 1.2, dur: 1.5, width: FWw(3.6), until: END + 1 });
B.caption("A HUNDRED THOUSAND MEN AWAY FROM A STALEMATE", T_SLIP + 0.2, T_BREATH - 0.2, "carth");
B.caption("NO TIME TO CATCH HIS BREATH", T_BREATH, T_NICK - 0.2, "rome");
// ---------- the nickname: his initials (1862) ----------
const NK = scr(`<div style="padding:16px 46px 18px;background:rgba(18,16,12,0.93);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:84px;letter-spacing:.08em"><span class="i1">U.</span> <span class="i2">S.</span> GRANT</div><div style="font-size:24px;letter-spacing:.3em;color:#c9b48a">1862</div></div>`,
  "left:0;right:0;top:240px;display:flex;justify-content:center;", T_NICK + 0.2, T_1865 - 0.1, { autoAlpha: 0, y: 20 });
SFX("hit", T_NICK + 0.4);
tl.to([NK.querySelector(".i1"), NK.querySelector(".i2")], { color: "#ffd54a", textShadow: "0 0 18px rgba(255,213,74,.8)", duration: 0.4 }, T_INIT);
SFX("ref:pop", T_INIT);
// ---------- by 1865 it described a method: the three lines, spoken words of end-1 ----------
GG.METHOD_TITLE = "GRANT'S METHOD";
GG.METHOD = ["STRUCK WHILE THE ENEMY WAS STILL DECIDING", "WENT WHERE THE ENEMY SAID NO ARMY COULD GO", "NO TIME TO CATCH HIS BREATH"];
const M_END = HAS_FINAL ? (F_SURR != null ? F_SURR + 1.5 : F_Q - 0.4) : END + 1;
const MC = GG.method(3, T_METH - 0.3, M_END, [T_METH, T_METH + 0.25, T_METH + 0.5]); MC.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "48px"; });
SFX("ref:boom", T_METH + 0.1);
const WIN = [[T_NICK + 0.2, T_1865 - 0.1], [T_METH - 0.3, M_END]];
// ---------- the final question (only once its paragraph is voiced) ----------
if (HAS_FINAL) {
  if (F_APP != null) { const AP = R.APPOMATTOX; boxS("APPOMATTOX", AP[0] - 120, AP[1] - 36, F_APP, null, { size: 28 }); wstampS("1865", AP[0] + 20, AP[1] + 30, F_APP + 0.4, null, "#9fc0ea", 30);
    flagS(FL.us, 1450, 980, F_APP - 0.6, END + 1, 100); flagS(FL.cs, 1000, 760, F_APP - 0.6, END + 1, 100); }
  const E = EngageK(B);
  const tNums = [F_1, F_2, F_3].map((t, i) => t ?? F_Q + 1 + i);
  const FC = E.final({ moves: [["FORT DONELSON", "FEB 1862"], ["VICKSBURG", "1863"], ["THE JAMES RIVER", "JUN 1864"]], tShow: F_Q, tNums, tAsk: F_TELL,
    tFamily: F_FAM ?? F_TELL + 1.5, tSub: F_SUB ?? END - 3, until: END + 1 });
  const fam = FC.querySelector(".fam"); if (fam) fam.innerHTML = `FAMILY SERVED IN THE CIVIL WAR? <span style="color:#c9b48a">TELL US THEIR STORY · WE READ EVERY ONE</span>`;
  // C3: the last ~20 s the card shrinks to the top band so the end-screen elements fit; the dark backing lifts so the map stays alive
  const tBand = Math.max(F_Q + 3, END - 20);
  tl.to(FC, { scale: 0.52, y: -140, duration: 0.8, ease: "power2.inOut", transformOrigin: "50% 0%" }, tBand);
  const back = FC.previousElementSibling; if (back) tl.to(back, { autoAlpha: 0.15, duration: 0.8 }, tBand);
  WIN.push([F_Q, END + 1]);
}
// ---------- clean screen ----------
declutter([LGD], WIN);
fixImgs();
K.raiseTerritory();
B.finish();
