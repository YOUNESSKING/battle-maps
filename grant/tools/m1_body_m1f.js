// m1f (m1-9 + move1-sub), Grant #16: zoom out from the two fallen forts over the theatre (tennessee map, option 1): the two rivers glow
// blue and the gunboats steam far into Tennessee; the Kentucky line collapses (E2: the lost ground turns pale first, then blue);
// method card line 1 on "attacked the moment the enemy hesitated". move1-sub: woven subscribe (E.subscribe on the subscribing clause),
// a dark-to-bluff transition on the question (a fortress on a high bluff, the supply river under its guns; no place name: it is not spoken),
// NEXT: MOVE 2.  STYLE W (STYLE_LOCK 2d, restyle 2026-11-06): basemap tennessee_w (z9; rivers rebuilt from the traced Ohio / Tennessee /
// Cumberland / Mississippi, no 20th-century lakes: tools/stylew_ten/README.txt). Clean map; the ground the Confederates give up hatches BLUE
// on the wide view (gn_ten_ctl_marcap, stronger hatch for the far-out view, ~3.5 s). Rivers: ink trace on "steam far into Tennessee".
// Built with: python3 tools/m1_build.py m1f tennessee_w m1-9 move1-sub
// @@BODY
const P9 = "m1-9", PS = "move1-sub";
const T_TWO = at(P9, "Two river forts had fallen"), T_TEN = at(P9, "in ten days"), T_GONE = at(P9, "Grant had gone from"), T_SNUB = at(P9, "a snubbed brigadier"),
  T_TALK = at(P9, "the man the whole North"), T_BOATS = at(P9, "The Union gunboats could now"), T_INTO = at(P9, "far into Tennessee"),
  T_FALL = at(P9, "The Confederates had to fall back"), T_KY = at(P9, "from Kentucky"), T_MIDT = at(P9, "much of middle Tennessee"),
  T_WAIT = at(P9, "Grant had not won by waiting"), T_FAST = at(P9, "He moved fast"), T_HIT2 = at(P9, "hit the second fort"), T_ATT = at(P9, "attacked the moment");
const T_ONLY = at(PS, "Donelson was only the beginning"), T_HOW = at(PS, "So how do you take a fortress"), T_BLUFF = at(PS, "built on a high bluff"),
  T_RIVER = at(PS, "the river that carries your supplies"), T_GUNS = at(PS, "runs right under its guns"), T_KIND = at(PS, "That's the kind of question"),
  T_SUBS = at(PS, "and subscribing is how"), T_HERE = at(PS, "Here's how Grant did it");
// ---------- places (tennessee map px, tools/m1_proj.py) ----------
const FH = [1402, 895], FD = [1462, 906], CLK = [1637, 888], NSH = [1848, 1054], BG = [1957, 689], COL = [1002, 783], PAD = [1186, 636], CAI = [976, 672];
// the rivers as drawn on tennessee_w (tools/stylew_ten/main_rivers.json, map px)
const TENN_S = [[1205, 649], [1266, 646], [1323, 692], [1352, 756], [1378, 820], [1390, 884], [1396, 948], [1424, 1012], [1427, 1076], [1404, 1140], [1420, 1195], [1392, 1259], [1404, 1322], [1401, 1385], [1363, 1400], [1327, 1449], [1336, 1532], [1336, 1612]];
const CUMB_E = [[1253, 606], [1324, 624], [1353, 668], [1393, 693], [1412, 757], [1433, 820], [1448, 882], [1473, 902], [1505, 917], [1533, 946], [1565, 927], [1597, 924], [1618, 893], [1657, 910], [1683, 974], [1744, 1010], [1802, 1043], [1843, 1038]];
// ---------- map: option 1 (16 Feb -> March 1862, E2 pale-first) ----------
hand("assets/media/gn_ten_ctl_marcap_mx.png", T_KY + 0.6, 3.6);   // the ground given up (Kentucky + middle Tennessee): wide view, stronger hatch
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 });
camera([[0, 1430, 900, 2.1], [T_TEN + 0.6, 1440, 905, 1.9], [T_TALK, 1500, 930, 1.6], [T_INTO + 0.6, 1520, 1000, 1.05], [T_KY + 0.8, 1470, 920, 0.85],
  [T_MIDT + 1.2, 1460, 940, 0.82], [T_ONLY, 1400, 960, 0.9], [T_HOW + 2.5, 1000, 1250, 1.25], [END, 980, 1270, 1.3]]);
dateNow("16 FEBRUARY 1862", T_FALL - 0.1); B.date("FEBRUARY–MARCH 1862", T_FALL, null, 30);
// ---------- flags ----------
flagS(FL.us, 1430, 820, 0, T_TALK + 0.5); flagS(FL.cs, 1500, 1010, 0, T_TALK + 0.5);
flagS(FL.us, 1500, 580, T_TALK + 0.3, END + 1); flagS(FL.cs, 1300, 1320, T_TALK + 0.4, T_HOW + 1.8);
flagS(FL.cs, 860, 1380, T_HOW + 1.6, END + 1);
// ---------- the two forts, both Union now ----------
[FH, FD].forEach((p, k) => { fortIcon(p, 0, null, { s: 20, col: "#4f8bff" }); });
B.caption("TWO RIVER FORTS · TEN DAYS", T_TEN, T_TEN + 2.6, "carth");
const GB = badge({ name: "GRANT", role: "", initials: "USG", photo: PHOTO("grant"), flag: FL.us, side: "carth", corner: "tr", t: T_SNUB - 0.1, until: T_SNUB + 3.3 });   // no unit of his on this map
// ---------- the rivers open: the gunboats steam far into Tennessee ----------
glowPath(TENN_S.slice(5, 14), "", 0, T_INTO - 0.2, T_INTO + 3.3, 0, 0, { focus: false });   // ink trace along both rivers, deep into Tennessee
glowPath(CUMB_E.slice(7), "", 0, T_INTO, T_INTO + 3.4, 0, 0, { focus: false });
const GT = ship("iron", "carth", TENN_S[5], 90, null, null, { L: 46 }); tl.set(GT.el, { autoAlpha: 1 }, 0); tl.to(GT.el, { autoAlpha: 0, duration: 0.5 }, T_HOW + 1.0);   // on the river from frame 0 sail(GT, TENN_S.slice(5, 14), T_BOATS + 0.2, 9.0, 24);
const GC = ship("iron", "carth", CUMB_E[7], 20, null, null, { L: 46 }); tl.set(GC.el, { autoAlpha: 1 }, 0); tl.to(GC.el, { autoAlpha: 0, duration: 0.5 }, T_HOW + 1.0); sail(GC, CUMB_E.slice(7), T_BOATS + 0.5, 8.0, 24);
curveLabel("Tennessee River", [[1446, 1150], [1440, 1230], [1428, 1300]], T_BOATS + 0.4, T_BOATS + 3.8, 22);
// ---------- the Kentucky line collapses ----------
const KYL = glowPath([COL, [1200, 840], FH, FD, [1700, 830], BG], "", 0, T_FALL, T_FALL + 3.4);   // the old Kentucky line: focus + ink trace
boxS("KENTUCKY", 1640, 560, T_KY, null, { size: 30 }); boxS("MIDDLE TENNESSEE", 1720, 1250, T_MIDT, null, { size: 30 });
[[BG, [1880, 900], [1840, 1060], [1880, 1300]], [COL, [990, 900], [960, 1050]], [[1840, 1060], [1860, 1220], [1900, 1380]]].forEach((pts, k) =>
  arw({ pts, side: "rome", t: T_FALL + 0.2 + k * 0.5, dur: 2.2, width: AW(0.85, 10), until: T_FALL + 7.0 }));
[["r1", BG, [1880, 1330]], ["r2", COL, [960, 1060], T_TALK], ["r3", [1600, 1040], [1720, 1330]]].forEach(([id, a, b, t0], k) => { unitS(id, "rome", a, "infantry", null, { t: t0 || 0, size: "XXX" }); B.move(id, T_FALL + 0.4 + k * 0.5, 4.0, b[0], b[1]); });
hideU(["r1", "r2", "r3"], T_WAIT);   // they have fallen back off the stage before the method card
// ---------- method card: line 1 lit on "attacked the moment the enemy hesitated" ----------
GG.METHOD_TITLE = "GRANT'S METHOD";
GG.METHOD = ["HE MOVED FAST", "HIT THE SECOND FORT BEFORE HELP COULD COME", "ATTACKED THE MOMENT THE ENEMY HESITATED"];   // spoken words only (m1-9)
const MC = GG.method(3, T_FAST - 0.1, T_ATT + 3.0, [T_FAST, T_HIT2, T_ATT]);   // holds ~3 s after line 3 MC.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "50px"; });
SFX("ref:pop", T_FAST + 0.1); SFX("ref:pop", T_HIT2 + 0.1); SFX("ref:boom", T_ATT + 0.2);
// ---------- move1-sub: only the beginning; the question (dark-to-bluff transition); subscribe; NEXT ----------
const DK = document.createElement("div"); DK.style.cssText = "position:absolute;inset:0;background:url(assets/relief_close.jpg) 0px -640px / 5760px 3240px no-repeat;pointer-events:none";   // STYLE W: the question scene on the Style W turf (a clear patch of tennessee_w_close)   // STYLE W: the question scene on the same green ground
document.getElementById("fx").appendChild(DK); gsap.set(DK, { autoAlpha: 0 }); tl.to(DK, { autoAlpha: 1, duration: 1.6, ease: "sine.inOut" }, T_HOW - 0.2);
// the bluff scene (screen space): a river bending under a high bluff, guns on the crest, a supply steamer under them
const RIV = "M -40 250 C 400 300 700 200 860 420 C 1000 610 760 760 900 900 C 1000 1000 1300 980 1960 1040";
const BLF = "M 820 160 C 980 300 1100 420 1060 600 C 1030 720 980 800 1060 880 C 1140 950 1300 930 1500 960";
const BS = scr(`<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="display:block">
  <defs><filter id="bfg" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter></defs>
  <path d="${RIV}" fill="none" stroke="#2a2410" stroke-width="96" stroke-linecap="round" opacity=".8"/><path d="${RIV}" fill="none" stroke="#3c6378" stroke-width="92" stroke-linecap="round"/><path d="${RIV}" fill="none" stroke="#4d7d9a" stroke-width="80" stroke-linecap="round"/>
  <path class="rsh" d="${RIV}" fill="none" stroke="rgba(200,220,232,.35)" stroke-width="2" stroke-dasharray="14 60"/>
  <path d="M 900 120 C 1080 280 1190 420 1150 600 C 1120 730 1080 800 1150 860 C 1240 920 1400 900 1960 900 L 1960 120 Z" fill="rgba(52,50,22,.32)"/>
  <path class="bg" d="${BLF}" fill="none" stroke="#2a2410" stroke-width="18" stroke-dasharray="2 7" transform="translate(-10 2)" opacity="0"/>
  <path class="bl" d="${BLF}" fill="none" stroke="#2a2410" stroke-width="3.5" stroke-linecap="round" opacity="0"/>
  <g class="guns">${[[930, 270], [1040, 400], [1075, 560], [1020, 760], [1110, 905]].map(([x, y]) => `<g transform="translate(${x} ${y})"><rect x="-16" y="-9" width="32" height="18" fill="#c4121f" stroke="#f7f3ea" stroke-width="2.5"/><circle class="fl" cx="-24" cy="0" r="14" fill="#ffd27a" opacity="0"/></g>`).join("")}</g>
  </svg>`, "left:0;top:0;width:1920px;height:1080px;", T_HOW + 0.4, END + 1, { autoAlpha: 0 });
tl.to(BS.querySelector(".rsh"), { strokeDashoffset: -300, duration: 12, ease: "none" }, T_HOW + 0.4);
gsap.set(BS.querySelector(".guns"), { autoAlpha: 0 });
tl.to([BS.querySelector(".bg"), BS.querySelector(".bl")], { opacity: 1, duration: 0.8 }, T_BLUFF - 0.1);
tl.to(BS.querySelector(".bg"), { opacity: 0.4, duration: 0.6, yoyo: true, repeat: 5, ease: "sine.inOut" }, T_BLUFF + 0.8);
const FLB = flag(FL.cs, 0, 0, null, null, 48); SCN.insertBefore(FLB, document.getElementById("credit")); FLB.classList.remove("gg-pin");
Object.assign(FLB.style, { position: "absolute", left: "1360px", top: "330px" }); gsap.set(FLB, { autoAlpha: 0, xPercent: 0, yPercent: 0 }); tl.to(FLB, { autoAlpha: 1, duration: 0.5 }, T_BLUFF);
const FLU = flag(FL.us, 0, 0, null, null, 48); SCN.insertBefore(FLU, document.getElementById("credit")); FLU.classList.remove("gg-pin");
Object.assign(FLU.style, { position: "absolute", left: "300px", top: "560px" }); gsap.set(FLU, { autoAlpha: 0, xPercent: 0, yPercent: 0 }); tl.to(FLU, { autoAlpha: 1, duration: 0.5 }, T_RIVER);
B.caption("A FORTRESS ON A HIGH BLUFF", T_BLUFF, T_BLUFF + 2.6, "rome");
// the supply steamer (blue) comes down the river, right under the guns
const SUP = document.createElement("div"); SUP.style.cssText = "position:absolute;left:0;top:0;width:0;height:0"; SUP.innerHTML = `<div style="position:absolute;left:-55px;top:-19px;width:110px">${shipSVG("steamer", "carth", 110)}</div>`;
SCN.insertBefore(SUP, document.getElementById("credit")); gsap.set(SUP, { autoAlpha: 0 });
const RP = [[-60, 252], [300, 285], [600, 260], [800, 360], [880, 520], [820, 700], [880, 880], [1050, 990], [1300, 1010]];
tl.set(SUP, { autoAlpha: 1, left: RP[0][0], top: RP[0][1] }, T_RIVER - 0.2);
for (let k = 1; k <= 24; k++) { const a = posOn(RP, (k - 1) / 24), b = posOn(RP, k / 24), tt = T_RIVER - 0.2 + (k - 1) * 0.3;
  tl.to(SUP, { left: b[0], top: b[1], duration: 0.3, ease: "none" }, tt); tl.to(SUP.firstElementChild, { rotation: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, duration: 0.3, ease: "none" }, tt); }
tl.to(SUP, { autoAlpha: 0, duration: 0.6 }, END - 0.4);
tl.to(BS.querySelector(".guns"), { autoAlpha: 1, duration: 0.4 }, T_GUNS - 0.3);
[...BS.querySelectorAll(".fl")].forEach((f, k) => { [0, 1.6, 3.2].forEach((d) => { const t = T_GUNS + 0.2 + k * 0.28 + d;
  tl.fromTo(f, { opacity: 1, scale: 0.4 }, { opacity: 0, scale: 1.6, duration: 0.35, immediateRender: false, transformOrigin: "50% 50%" }, t); if (d === 0) SFX("fire", t); }); });
// woven subscribe: small button bottom-right, cursor click, bell; never a full-screen card
const E = EngageK(B); E.subscribe(T_SUBS - 1.0, T_HERE + 0.2);
// critic r1: no "NEXT: MOVE 2" label (never spoken)
SFX("ref:pop", T_HERE + 0.3);
// ---------- clean screen ----------
fixImgs();
K.raiseTerritory();
B.finish();
