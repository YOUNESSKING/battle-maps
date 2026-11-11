// P3C (p3-10 .. p3-13), Yorktown 1781, PART 3 THE SIEGE, the end. Main style (STYLE_LOCK 2d/2e/2f via the Yorktown map kit), 1c clean screen.
// Build: python3 kit/build_scene.py p3c yorktown p3-10 p3-13
// Frame 0 = p3b's last frame (15 OCT, morning: both parallels, R9/R10 allied, guns up in the second parallel, French west / Americans east,
//   Hamilton's banner still up, camera [1462, 852, 1.9]).
// p3-10: "Cornwallis wrote": his banner at the town (Hamilton's steps out); the French battery moves up into the second parallel; "Before dawn":
//   night, caption BEFORE DAWN, 16 OCT on "sixteenth"; "three hundred and fifty men": a red sortie box slips out of the hornwork (card ~350 MEN);
//   "to spike the allied guns": bayonet glints, two gun boxes go grey; blue reserves close in, musket flashes, "driven back": it pulls back;
//   "Within hours": morning; "firing again": the two guns light up and fire (visible shots).
// p3-11: night; frame the narrows (both ferry landings, Gloucester); escape arrow across the river ("ferry his army across") and north
//   ("march north") through the French hussars + militia (drop in on their words, French pennant on the hussars); "The first boats crossed":
//   red flatboats land a red box at Gloucester; "around midnight": the STORM (FACT_NOTES 16-17 Oct), the second wave in mid-river is blown
//   downstream and scattered, the arrow breaks; "By morning": light, the storm passes, the boats row back.
// p3-12: 17 OCT, close on the British line; a steady visible barrage (<= 1 shot / 2 s); card 4 YEARS (to the day) + AFTER SARATOGA on its word;
//   "a drummer": a lone red figure box on the hornwork parapet, drum-beat rings on "beat for a parley"; "an officer beside him"; "white
//   handkerchief": a small white flag waves; "The guns stopped": no more shots, the smoke drifts.
// p3-13: 18 OCT; "officers from both sides" walk to the MOORE HOUSE (painted house + label on its word); Washington's banner on "Washington
//   refused"; NO HONORS OF WAR / FLAGS CASED captions on the words; 19 OCT on its date, afternoon light: the French line (pennant) and the
//   American line (US flag) form along the road south; the red column marches out between them; "Cornwallis did not come": his banner, greyed,
//   in the town; O'Hara's banner on his name; the sword passes O'Hara -> Rochambeau -> Washington -> Lincoln (banners on their names) and back;
//   card OVER 7,000 (+ SURRENDER on "laid down their arms"), the red boxes go grey; small caption LEGEND on "Legend says".
//   (Surrender Field is never named in the narration: no label for it, 1c.)
const P10 = "p3-10", P11 = "p3-11", P12 = "p3-12", P13 = "p3-13";
const T_CW = at(P10, "Cornwallis wrote"), T_CRIT = at(P10, "very critical"), T_BDAWN = at(P10, "Before dawn"), T_16 = at(P10, "sixteenth"),
  T_350 = at(P10, "three hundred and fifty men"), T_SPIKE = at(P10, "to spike the allied guns"), T_SEV = at(P10, "They spiked several"),
  T_BACK = at(P10, "driven back"), T_HOURS = at(P10, "Within hours"), T_AGAIN = at(P10, "firing again");
const T_NIGHT = at(P11, "That night"), T_FERRY = at(P11, "ferry his army across the river"), T_GP = at(P11, "Gloucester Point"),
  T_FRENCH = at(P11, "break through the French"), T_MIL = at(P11, "the militia there"), T_NORTH = at(P11, "march north"),
  T_FIRST = at(P11, "The first boats crossed"), T_MID = at(P11, "around midnight"), T_STORMW = at(P11, "a violent storm"),
  T_SWEPT = at(P11, "swept down the river"), T_SCAT = at(P11, "scattered the boats"), T_MORN = at(P11, "By morning"), T_OVER = at(P11, "the escape was over");
const T_17M = at(P12, "On the morning"), T_17 = at(P12, "seventeenth of October"), T_4Y = at(P12, "four years to the day"), T_SARA = at(P12, "Saratoga"),
  T_DRUM = at(P12, "a drummer"), T_CLIMB = at(P12, "climbed onto the British wall"), T_PARLEY = at(P12, "beat for a parley"),
  T_NOHEAR = at(P12, "Nobody could hear him"), T_SEE = at(P12, "But everyone could see him"), T_OFF = at(P12, "an officer beside him"),
  T_HANK = at(P12, "white handkerchief"), T_STOP = at(P12, "The guns stopped");
const T_18 = at(P13, "On the eighteenth"), T_OFFS = at(P13, "officers from both sides"), T_MOORE = at(P13, "Moore House"),
  T_REF = at(P13, "Washington refused"), T_HON = at(P13, "honors of war"), T_CASED = at(P13, "flags cased"), T_TWO = at(P13, "At two in the afternoon"),
  T_19 = at(P13, "nineteenth of October"), T_OUT = at(P13, "the British marched out"), T_LINES = at(P13, "between two long lines"),
  T_FSIDE = at(P13, "the French on one side"), T_ASIDE = at(P13, "the Americans on the other"), T_NOTC = at(P13, "Cornwallis did not come"),
  T_ILL = at(P13, "He said he was ill"), T_OHARA = at(P13, "Charles O'Hara"), T_OFFER = at(P13, "is said to have offered"),
  T_ROCH = at(P13, "to Rochambeau"), T_PW = at(P13, "who pointed to Washington"), T_PD = at(P13, "Washington pointed to his own deputy"),
  T_LINC = at(P13, "Benjamin Lincoln"), T_TOOK = at(P13, "Lincoln took the sword"), T_HANDED = at(P13, "handed it back"),
  T_7K = at(P13, "More than seven thousand"), T_ARMS = at(P13, "laid down their arms"), T_LEG = at(P13, "Legend says"),
  T_DRUMS = at(P13, "the drums beat a British march");
// ---------------------------------------------------------------------------------------------------------------------------------
// camera (yorktown map px)
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1, light: "morning", lightK: 0.5 }); NIGHT_DIM(0, 0.92);
const SEGS = [], seg = (t0, t1, a, b, ease = "sine.inOut") => { SEGS.push({ t0, t1, a, b, e: gsap.parseEase(ease) }); SEGS.sort((p, q) => p.t0 - q.t0); };
const camAt = (t) => { let c = SEGS[0].a;
  for (const g of SEGS) { if (t < g.t0) break; const u = g.e(Math.min(1, (t - g.t0) / Math.max(g.t1 - g.t0, 1e-3))), a = g.a, b = g.b;
    c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  return c; };
const C0 = [1462, 852, 1.9], CSO = [1405, 868, 2.3], CSO2 = [1410, 872, 2.32], CN = [1452, 600, 2.2], CN2 = [1458, 610, 2.24],
  CB = [1405, 800, 2.4], CB2 = [1400, 806, 2.45], CM = [1500, 930, 1.6], CL = [1385, 975, 1.7], CSW = [1380, 1060, 1.95], CE = [1388, 1000, 1.7], CE2 = [1385, 1005, 1.74];
seg(0, T_BDAWN - 0.3, C0, [1455, 856, 1.95]);
seg(T_BDAWN - 0.2, T_BDAWN + 1.8, [1455, 856, 1.95], CSO);
seg(T_BDAWN + 1.9, T_NIGHT - 0.2, CSO, CSO2);
seg(T_NIGHT - 0.1, T_NIGHT + 2.2, CSO2, CN);
seg(T_NIGHT + 2.3, T_17M - 0.4, CN, CN2);
seg(T_17M - 0.3, T_17M + 2.0, CN2, CB);
seg(T_17M + 2.1, T_18 - 0.4, CB, CB2);
seg(T_18 - 0.3, T_18 + 2.4, CB2, CM);
seg(T_TWO - 0.4, T_TWO + 2.2, CM, CL);
seg(T_OHARA - 1.2, T_OHARA + 0.8, CL, CSW);
seg(T_7K - 0.4, T_7K + 2.0, CSW, CE);
seg(T_7K + 2.1, END, CE, CE2);
camera([...Array(Math.ceil(END * 20) + 1)].map((_, i) => { const t = Math.min(END, i / 20); return [t, ...camAt(t), "none"]; }));
// ---------------------------------------------------------------------------------------------------------------------------------
// cards + small marks (same helpers as p3b)
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const CARD = (kick, big, col, t, until, o = {}) => { const el = scr0(`<div style="padding:12px 46px 16px;background:rgb(18,16,12);border-top:6px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    ${kick ? `<div class="k" style="font-size:26px;letter-spacing:.34em;color:#d8c9a3">${kick}</div>` : ""}<div class="b" style="font-size:${o.size || 72}px;letter-spacing:.05em;line-height:1.08">${big}</div></div>`,
    o.css || `left:0;right:0;top:${o.top ?? 150}px;display:flex;justify-content:center;transform-origin:50% 30%;`);
  slam(el, t, { from: o.from || 1.6, shake: o.shake ?? 4, until }); return el; };
const ADDLINE = (card, txt, t, size = 44, col = "#f7f3ea") => { const s = document.createElement("div"); s.style.cssText = `font-size:${size}px;letter-spacing:.08em;color:${col};margin-top:6px`; s.textContent = txt;
  card.firstElementChild.appendChild(s); gsap.set(s, { autoAlpha: 0 }); tl.fromTo(s, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, t); SFX("tick", t + 0.05); return s; };
const CR1 = "right:40px;top:200px;transform-origin:50% 30%;";
const POP = (html, p, t, until) => pinS(GG.pin(html, p[0], p[1], { t, pop: true, until }));
const ABATIS = (p, rot) => now(POP(`<svg width="86" height="24" viewBox="-32 -9 64 18" style="display:block;overflow:visible;transform:rotate(${rot}deg);filter:drop-shadow(0 1px 1px rgba(0,0,0,.7))">${[-26, -18, -10, -2, 6, 14, 22].map((x, i) => `<path d="M${x} 6 L${x + 5} -7 M${x + 6} 6 L${x + 1} -6" stroke="${i % 2 ? "#c9a46a" : "#e0bf86"}" stroke-width="2.2" stroke-linecap="round"/>`).join("")}<path d="M-30 6 L30 6" stroke="#3a2c18" stroke-width="1.6"/></svg>`, p, 0.01));
// a bayonet glint (small bright cross-flash), light only
const GLINT = (p, t) => { const el = pinS(GG.pin(`<svg width="26" height="26" viewBox="-13 -13 26 26" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #fff4c8)"><path d="M0 -11 L2 -2 L11 0 L2 2 L0 11 L-2 2 L-11 0 L-2 -2 Z" fill="#fffbe8"/></svg>`, p[0], p[1], {}));
  gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.1, duration: 0.12, immediateRender: false }, t); tl.to(el, { autoAlpha: 0, scale: 0.6, duration: 0.35 }, t + 0.18); return el; };
const GREY = (id, t) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "grayscale(1) brightness(0.62)", duration: 0.5 }, t);
const UNGREY = (id, t) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "grayscale(0) brightness(1)", duration: 0.5 }, t);
const GREY0 = (id) => gsap.set(B.units[id].el.querySelector(".blk"), { filter: "grayscale(1) brightness(0.62)" });
const UNITF = (id, side, p, type, o = {}) => { UNIT(id, side, p, type, { ...o, t: 0 }); const el = B.units[id].el; gsap.set(el, { autoAlpha: 0 });
  if (o.t != null) tl.to(el, { autoAlpha: 1, duration: o.fade ?? 0.45 }, o.t); return id; };
// red flatboat (the kit BOAT recoloured to the British side)
const RBOAT = (pts, t, dur, o = {}) => { const el = BOAT(pts, t, dur, { px: 34, ...o }), ps = el.querySelectorAll("svg path");
  ps[0].setAttribute("fill", "#4a1612"); ps[1].setAttribute("fill", "#b0292b"); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// date scroll: 15 OCT (from p3b) -> 16 -> 17 -> 18 -> 19 OCT
// ---------------------------------------------------------------------------------------------------------------------------------
dateNow("15 OCT 1781", T_16 - 0.05);
[[T_16, T_17, "16 OCT 1781"], [T_17, T_18, "17 OCT 1781"], [T_18, T_19, "18 OCT 1781"], [T_19, null, "19 OCT 1781"]]
  .forEach(([a, b, txt]) => { B.date(txt, a, b == null ? null : b - 0.08, 32); SFX("tick", a + 0.1); });
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0 = p3b's last frame
// ---------------------------------------------------------------------------------------------------------------------------------
const BLINE = [[1291, 715], [1318, 793], [1376, 832], [1428, 827], [1463, 796], [1489, 758]];
TRENCH(BLINE, 0, { side: "british" });
[[[1162, 770], [1185, 800], [1215, 806]], [[1318, 1002], [1350, 1010], [1384, 1002]], [[1462, 998], [1494, 1004], [1526, 994]]].forEach((pts) => TRENCH(pts, 0, { side: "allies" }));
TRENCH([[1283, 895], [1359, 931], [1428, 935], [1491, 922], [1554, 895], [1590, 878]], 0, { side: "allies", front: [1428, 830] });
TRENCH([[1291, 854], [1359, 884], [1419, 890], [1455, 872]], 0, { side: "allies", front: [1420, 830] });
TRENCH([[1455, 872], [1469, 852], [1498, 812], [1514, 796], [1534, 788]], 0, { side: "allies", front: [1460, 800] });
const R9P = [1469, 852], R10P = [1498, 812];
REDOUBT("r9", R9P, 0, { side: "allies", rot: 12, px: 48 }); REDOUBT("r10", R10P, 0, { side: "allies", rot: -8, px: 48 });
REDOUBT("rfus", [1194, 635], 0, { side: "british", rot: 4, px: 26 });
ABATIS([R9P[0] - 3, R9P[1] + 19], 12); ABATIS([R10P[0] + 3, R10P[1] + 19], -8);
const S5 = { s: 1.45 };
UNIT("bg1", "british", NUDGE([1330, 728], S5), "artillery", { ech: "" }); UNIT("bg3", "british", NUDGE([1455, 718], S5), "artillery", { ech: "" });
UNIT("o1", "british", [1372, 815], "infantry", { ech: "X" }); UNIT("o2", "british", [1425, 800], "infantry", { ech: "X" });
UNIT("o3", "british", [1485, 765], "artillery", { ech: "" });
["bg1", "bg3", "o3"].forEach(GREY0);
UNIT("fa", "allies", [1325, 912], "artillery", { ech: "" }); UNIT("fg2", "allies", [1392, 934], "artillery", { ech: "" });
UNIT("fg0", "allies", [1160, 708], "artillery", { ech: "" });
UNIT("a1", "allies", [1300, 952], "infantry", { ech: "XX" }); UNIT("a2", "allies", [1562, 940], "infantry", { ech: "XX" });
UNIT("aa", "allies", [1522, 860], "artillery", { ech: "" }); UNIT("a3", "allies", [1640, 990], "infantry", { ech: "XX" });
UNIT("ag1", "allies", [1428, 896], "artillery", { ech: "" });
UNIT("fr9", "allies", [1448, 866], "infantry", { ech: "II" }); UNIT("am10", "allies", [1518, 822], "infantry", { ech: "II" });
const FL_FR = SIDEFLAG("fr", "fr9", 0), FL_US = SIDEFLAG("us", "am10", 0), FL_GB = SIDEFLAG("gb", "bg1", 0);
BANNER("hamilton", "Alexander Hamilton", "us", [1610, 915], 0, { until: T_CW + 0.3 });
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-10: the sortie before dawn on 16 Oct
// ---------------------------------------------------------------------------------------------------------------------------------
const BCW = BANNER("cornwallis", "Lord Cornwallis", "gb", [1392, 694], T_CW + 0.15, { side: "nw", until: T_18 - 0.3 });
march("fg2", [[1392, 934], [1378, 914], [1362, 898]], T_CRIT - 2.4, 2.2, { dustOp: 0.25 });   // the French battery moves up into the second parallel
LIGHT("night", T_BDAWN - 0.1, 1.4, 0.85); NIGHT_DIM(T_BDAWN - 0.1, 0.8, 1.4);
wstampL("BEFORE DAWN", 1556, 1012, T_BDAWN + 0.05, T_BDAWN + 3.2, null, 26);
UNITF("so", "british", [1384, 828], "infantry", { ech: "II", t: T_350 - 0.1 });
CARD("", "~350 MEN", "#c4121f", T_350 + 0.1, T_SPIKE + 1.4, { size: 44, css: CR1 });
march("so", [[1384, 828], [1376, 852], [1366, 874]], T_350 + 0.5, T_SPIKE - T_350 - 0.3, { dust: false });
[0, 0.35, 0.7].forEach((d, i) => GLINT([1356 + i * 8, 884 - (i % 2) * 6], T_SPIKE + 0.2 + d));
GREY("fg2", T_SPIKE + 0.7);
march("so", [[1366, 874], [1395, 876], [1420, 878]], T_SPIKE + 0.9, T_SEV - T_SPIKE - 0.6, { dust: false });
[0, 0.35, 0.7].forEach((d, i) => GLINT([1418 + i * 8, 888 - (i % 2) * 6], T_SEV + 0.1 + d));
GREY("ag1", T_SEV + 0.5);
// blue reserves close in from both sides; musket flashes; the sortie is driven back into the hornwork
march("a1", [[1300, 952], [1318, 928], [1334, 910]], T_SEV - 0.6, 1.8, { dustOp: 0.25 });
march("fr9", [[1448, 866], [1450, 880], [1446, 890]], T_SEV - 0.4, 1.4, { dust: false });
mg([1338, 906], [1412, 878], T_BACK - 0.8, 4, 0.8); mg([1444, 886], [1424, 880], T_BACK - 0.5, 4, 0.8); smoke([[1340, 902], [1442, 884]], T_BACK - 0.75, 0.6);
march("so", [[1420, 878], [1402, 856], [1388, 834]], T_BACK - 0.2, 1.4, { dust: false });
hideU(["so"], T_HOURS + 0.2);
B.move("a1", T_HOURS + 0.4, 1.4, 1300, 952); B.move("fr9", T_HOURS + 0.5, 1.2, 1448, 866);
// "Within hours, the guns were firing again"
LIGHT("morning", T_HOURS, 1.6, 0.5); NIGHT_DIM(T_HOURS, 0.92, 1.6);
UNGREY("fg2", T_AGAIN - 0.2); UNGREY("ag1", T_AGAIN - 0.1);
shoot([1428, 896], [1408, 792], T_AGAIN + 0.1, { unit: "ag1", r: 6 });
shoot([1362, 898], [1338, 780], T_AGAIN + 1.3, { unit: "fg2", r: 6 });
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-11: the escape across the York, night 16-17 Oct; the storm from ~midnight
// ---------------------------------------------------------------------------------------------------------------------------------
LIGHT("night", T_NIGHT, 1.6, 0.85); NIGHT_DIM(T_NIGHT, 0.8, 1.6);
UNIT("gR", "british", NUDGE([1484, 562], { s: 2.2 }), "infantry", { ech: "X", t: T_NIGHT + 1.4 });   // the Gloucester garrison (in view as the camera arrives)
const ARWS = (pts, t, dur, head) => { const g = B.arrow({ pts, side: "rome", t, dur, width: 2.6, head, until: T_SCAT + 0.9 }), ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke", "rgba(24,20,10,0.55)"); ps[0].setAttribute("stroke-width", "3.6");
  const hd = g.querySelector("polygon"); if (hd) { hd.setAttribute("stroke", "rgba(24,20,10,0.55)"); hd.setAttribute("stroke-width", "0.8"); } return g; };
const ARA = ARWS([[1404, 712], [1424, 668], [1440, 628], [1450, 600]], T_FERRY + 0.1, 1.6, false);
focus([1462, 585], 70, T_GP - 0.1, T_FRENCH + 2.4);
UNITF("gc", "allies", [1440, 440], "cavalry", { ech: "", t: T_FRENCH + 0.1 });
UNITF("gm", "allies", [1532, 470], "infantry", { ech: "X", t: T_MIL });
const FL_GC = SIDEFLAG("fr", "gc", T_FRENCH + 0.4);
const ARB = ARWS([[1452, 598], [1454, 540], [1452, 480], [1449, 405]], T_NORTH, 1.4, true);
// the first boats cross and land a red box at Gloucester Point
const WV1 = [[[1394, 690], [1424, 612]], [[1416, 704], [1446, 624]], [[1438, 714], [1468, 632]]].map((pts, k) => RBOAT(pts, T_FIRST - 0.4 + k * 0.5, 2.3, { until: T_MORN + 0.2 }));
UNITF("gw", "british", [1448, 580], "infantry", { ech: "X", t: T_FIRST + 2.0 });
// the second wave pulls out; "around midnight" the storm sweeps down the river and scatters it (BOAT drift = blown downstream)
STORM(T_MID - 0.1, T_MORN + 0.3);
NIGHT_DIM(T_MID, 0.7, 1.2);
const WV2 = [[[1398, 696], [1414, 656], [44, 18]], [[1418, 708], [1434, 668], [30, 44]], [[1436, 718], [1452, 678], [72, 30]], [[1450, 726], [1466, 688], [24, 62]]]
  .map(([a, b, dr], k) => RBOAT([a, b], T_MID - 0.8 + k * 0.3, T_SWEPT - T_MID + 0.4, { drift: dr, until: T_MORN + 0.2 }));
[[30, 4, -40], [6, 34, 35], [52, 16, -70], [-10, 30, 60]].forEach(([dx, dy, rot], k) => { tl.to(WV2[k], { left: `+=${dx}`, top: `+=${dy}`, duration: 1.4, ease: "sine.inOut" }, T_SCAT - 0.1 + k * 0.1);
  tl.to(WV2[k].querySelector("svg"), { rotation: `+=${rot}`, duration: 1.4, ease: "sine.inOut" }, T_SCAT - 0.1 + k * 0.1); });
// the escape arrow breaks
[ARA, ARB].forEach((g) => tl.to(g, { x: 6, duration: 0.07, yoyo: true, repeat: 5 }, T_SCAT));
POP(`<svg width="34" height="34" viewBox="-17 -17 34 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.8))"><path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke="#f3eee2" stroke-width="4.5" stroke-linecap="round"/><path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke="#c4121f" stroke-width="2.4" stroke-linecap="round"/></svg>`, [1434, 650], T_SCAT + 0.3, T_OVER + 1.4);
// "By morning, the escape was over": the storm passes, the boats row back across, the landed men go back with them
LIGHT("morning", T_MORN, 1.8, 0.5); NIGHT_DIM(T_MORN, 0.92, 1.8);
[[[1452, 632], [1424, 704]], [[1462, 640], [1436, 712]], [[1484, 700], [1446, 724]], [[1500, 712], [1452, 730]]].forEach((pts, k) => RBOAT(pts, T_MORN + 0.25 + k * 0.25, 2.4, { until: T_17 + 0.6 }));
march("gw", [[1448, 580], [1446, 600]], T_MORN + 0.1, 0.6, { dust: false }); hideU(["gw"], T_MORN + 0.6);
hideU(["gc", "gm"], T_17M + 0.4);
// the British infantry inside the line step aside so the hornwork parapet is free for the drummer (night, off the focus)
B.move("o1", T_NIGHT + 2.0, 1.2, 1338, 790); B.move("o2", T_NIGHT + 2.1, 1.2, 1446, 788);
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-12: 17 Oct: the barrage, the drummer, the white handkerchief
// ---------------------------------------------------------------------------------------------------------------------------------
LIGHT("day", T_17M, 2.0); NIGHT_DIM(T_17M, 1.0, 2.0);
const GUN = { fa: [1325, 912], fg2: [1362, 898], ag1: [1428, 896], aa: [1522, 860] };
const BAR = [["fg2", [1352, 772]], ["aa", [1446, 806]], ["ag1", [1410, 770]], ["fa", [1318, 790]], ["fg2", [1372, 762]], ["aa", [1458, 784]], ["ag1", [1424, 800]], ["fa", [1340, 768]], ["aa", [1440, 812]]];
const BARRAGE_T = [];
for (let t = T_17M + 0.3, k = 0; t < T_STOP - 1.3 && k < 40; t += 2.15, k++) { const [g, to] = BAR[k % BAR.length]; shoot(GUN[g], to, t, { unit: g, r: 6 }); BARRAGE_T.push([to, t + 1.05]); }
// "four years to the day after the British surrender at Saratoga"
const C4 = CARD("TO THE DAY", "4 YEARS", "#c9b48a", T_4Y + 0.05, T_DRUM + 2.2, { size: 70, css: "right:70px;top:170px;transform-origin:50% 30%;" });
ADDLINE(C4, "AFTER SARATOGA", T_SARA + 0.05, 46);
// the drummer: a lone red figure box climbs onto the hornwork parapet and beats for a parley (rings = the drum beat, no sound)
const DRUMMER = `<div style="width:34px;height:34px;margin:-17px 0 0 -17px;background:#bc2528;border:2px solid #f3eee2;box-shadow:0 2px 4px rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center"><svg width="24" height="24" viewBox="-8 -8 16 16"><ellipse cx="0" cy="2" rx="5.5" ry="4" fill="#f3eee2"/><path d="M-6 -7 L-1 -1 M6 -7 L1 -1" stroke="#f3eee2" stroke-width="1.4" stroke-linecap="round"/></svg></div>`;
const DR = pinS(GG.pin(DRUMMER, 1378, 822, { t: T_DRUM, pop: true }));
tl.to(DR, { top: 834, duration: 0.8, ease: "power2.out" }, T_CLIMB);
for (let t = T_PARLEY; t < T_STOP + 0.4; t += 0.62) { const r = pinS(GG.pin(`<div style="width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:2.5px solid rgba(255,244,214,.9)"></div>`, 1378, 834, {}));
  gsap.set(r, { autoAlpha: 0 }); tl.fromTo(r, { autoAlpha: 0.9, scale: 0.7 }, { autoAlpha: 0, scale: 2.4, duration: 0.6, ease: "sine.out", immediateRender: false }, t); }
focus([1385, 832], 46, T_SEE - 0.1, T_STOP + 1.6);
const OFFICER = `<div style="width:30px;height:30px;margin:-15px 0 0 -15px;background:#bc2528;border:2px solid #e8d58a;box-shadow:0 2px 4px rgba(0,0,0,.6)"></div>`;
const OF = pinS(GG.pin(OFFICER, 1400, 834, { t: T_OFF, pop: true }));
const HK = pinS(GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-1.5px;top:-58px;width:3px;height:58px;background:#cdb48a;box-shadow:1px 1px 2px rgba(0,0,0,.6)"></div>
  <div class="hk" style="position:absolute;left:1.5px;top:-58px;width:32px;height:22px;background:#fbfaf3;border:1px solid #9a9480;transform-origin:0 50%;box-shadow:0 1px 3px rgba(0,0,0,.5)"></div></div>`, 1410, 830, { t: T_HANK, pop: true }));
tl.to(HK.querySelector(".hk"), { skewY: 14, scaleX: 0.8, duration: 0.3, yoyo: true, repeat: 40, ease: "sine.inOut" }, T_HANK);
// "The guns stopped": no more shots; the smoke over the town drifts away
BARRAGE_T.slice(-4).forEach(([p]) => { for (let t = T_STOP - 0.4; t < T_STOP + 3.4; t += 0.7) K.smoke(p[0], p[1] - 3, t, { n: 1, r: 9, rise: 26, life: 3.0, alpha: 0.45, drift: 22 }); });
tl.to([DR, OF, HK], { autoAlpha: 0, duration: 0.6 }, T_18 + 0.4);
// ---------------------------------------------------------------------------------------------------------------------------------
// p3-13: 18 Oct the Moore House; 19 Oct the surrender
// ---------------------------------------------------------------------------------------------------------------------------------
const MH = [1664, 1002];
POP(`<svg width="60" height="48" viewBox="-20 -16 40 32" style="display:block;overflow:visible;filter:drop-shadow(1px 2px 1.5px rgba(10,8,4,.7))">
  <rect x="-9" y="-15" width="3" height="7" fill="#6b3a26"/><rect x="6" y="-15" width="3" height="7" fill="#6b3a26"/>
  <path d="M-17 -3 L-12 -12 L12 -12 L17 -3 Z" fill="#5a3a2a" stroke="#2c1d14" stroke-width="0.8"/>
  <rect x="-15" y="-3" width="30" height="15" fill="#e6dcc4" stroke="#6b5a40" stroke-width="0.8"/>
  ${[-11, -5, 3, 9].map((x) => `<rect x="${x}" y="0" width="3" height="4" fill="#3b3226"/>`).join("")}<rect x="-1.5" y="5" width="3.5" height="7" fill="#4a3424"/></svg>`, MH, T_MOORE - 0.05);
PLACE_LABEL("Moore House", MH, T_MOORE, { dx: 0, dy: 34, size: 26 });
UNITF("ofR", "british", [1440, 812], "infantry", { ech: "", t: T_OFFS - 0.1 }); UNITF("ofB", "allies", [1640, 1070], "infantry", { ech: "", t: T_OFFS });
march("ofR", [[1440, 812], [1520, 900], [1590, 950], [1626, 968]], T_OFFS + 0.2, T_MOORE - T_OFFS + 0.2, { dustOp: 0.25 });
march("ofB", [[1640, 1070], [1700, 1030], [1704, 970]], T_OFFS + 0.4, T_MOORE - T_OFFS, { dustOp: 0.25 });
focus(MH, 60, T_MOORE, T_REF + 0.6);
const BW1 = BANNER("washington", "George Washington", "us", [1745, 1035], T_REF + 0.1, { side: "ne", until: T_TWO - 0.2 });
wstampL("NO HONORS OF WAR", 1500, 860, T_HON - 0.05, T_CASED - 0.3, null, 26);
wstampL("FLAGS CASED", 1500, 860, T_CASED, T_TWO - 0.3, null, 26);
hideU(["ofR", "ofB"], T_TWO - 0.2);
// 19 Oct, two in the afternoon: the allied guns step out of the picture; the two lines form along the road south
LIGHT("afternoon", T_TWO, 2.0, 0.6);
hideU(["fa", "fg2", "ag1", "aa", "fg0"], T_TWO + 0.2);
const RX = (y) => y <= 874 ? 1391 : y <= 1034 ? 1391 + (1363 - 1391) * (y - 874) / 160 : y <= 1110 ? 1363 + 3 * (y - 1034) / 76 : 1366 + 5 * (y - 1110) / 85;   // the Hampton road x at y
const LY = [985, 1035, 1085, 1135], OFS = 44;
const FR = LY.map((y) => [RX(y) - OFS, y]), AM = LY.map((y) => [RX(y) + OFS, y]);
// French line (west): fr9 leads (it carries the French pennant), a1 + two more boxes; American line (east): am10 leads (US flag), a2, a3 + one more
march("fr9", [[1448, 866], [1420, 872], [1325, 940], FR[0]], T_19 - 0.6, 2.6, { dustOp: 0.3, trail: false });
march("a1", [[1300, 952], [1300, 1000], FR[1]], T_19 - 0.4, 2.2, { dustOp: 0.3, trail: false });
UNITF("f3", "allies", [1240, 1080], "infantry", { ech: "X", t: T_19 - 0.6 }); march("f3", [[1240, 1080], [1290, 1084], FR[2]], T_19 - 0.3, 2.2, { dustOp: 0.3, trail: false });
UNITF("f4", "allies", [1244, 1140], "infantry", { ech: "X", t: T_19 - 0.5 }); march("f4", [[1244, 1140], [1290, 1136], FR[3]], T_19 - 0.2, 2.2, { dustOp: 0.3, trail: false });
march("am10", [[1518, 822], [1500, 880], [1440, 950], AM[0]], T_19 - 0.6, 2.6, { dustOp: 0.3, trail: false });
march("a2", [[1562, 940], [1500, 1000], AM[1]], T_19 - 0.4, 2.4, { dustOp: 0.3, trail: false });
march("a3", [[1640, 990], [1520, 1060], AM[2]], T_19 - 0.3, 2.6, { dustOp: 0.3, trail: false });
UNITF("a4", "allies", [1560, 1150], "infantry", { ech: "X", t: T_19 - 0.5 }); march("a4", [[1560, 1150], [1480, 1140], AM[3]], T_19 - 0.2, 2.4, { dustOp: 0.3, trail: false });
// the British march out of the works down the road between the lines (they replace the garrison boxes)
hideU(["o1", "o2"], T_OUT - 0.2);
const ROAD = [[1391, 792], [1391, 874], [1378, 950], [1363, 1034], [1366, 1110], [1368, 1160], [1344, 1182]];
const RSLOT = [1.0, 0.86, 0.73, 0.6, 0.47];   // fraction along ROAD where each box stops (head at the field)
RSLOT.forEach((f, k) => { const id = "r" + (k + 1), t0 = T_OUT + k * 1.15;
  UNITF(id, "british", ROAD[0], "infantry", { ech: k === 2 ? "" : "X", t: t0 - 0.05, fade: 0.4 });
  march(id, sub(ROAD, 0, f, 18), t0 + 0.1, 3.6 + f * 7.0, { dustOp: 0.35 }); });
tl.fromTo([FL_FR], { scale: 1 }, { scale: 1.25, duration: 0.25, yoyo: true, repeat: 1, immediateRender: false }, T_FSIDE + 0.1);
tl.fromTo([FL_US], { scale: 1 }, { scale: 1.25, duration: 0.25, yoyo: true, repeat: 1, immediateRender: false }, T_ASIDE + 0.1);
// "Cornwallis did not come. He said he was ill": his banner, greyed, stays in the town
const BCW2 = BANNER("cornwallis", "Lord Cornwallis", "gb", [1300, 800], T_NOTC + 0.1, { side: "west", until: T_7K - 0.4 });
tl.to(BCW2, { filter: "grayscale(1) brightness(0.72)", duration: 0.8 }, T_NOTC + 0.9);
focus([1330, 770], 70, T_NOTC + 0.1, T_ILL + 1.4);
// the sword: O'Hara offers it to Rochambeau, who points to Washington; Washington points to Lincoln; Lincoln takes it and hands it back
const BOH = BANNER("ohara", "Charles O'Hara", "gb", "r1", T_OHARA + 0.05, { side: "sw", until: T_7K - 0.4 });
const BRO = BANNER("rochambeau", "Rochambeau", "fr", FR[1], T_ROCH, { side: "west", until: T_PD + 0.6 });
const BW2 = BANNER("washington", "George Washington", "us", AM[1], T_PW + 0.05, { side: "ne", until: T_TOOK });
const BLI = BANNER("lincoln", "Benjamin Lincoln", "us", AM[3], T_LINC + 0.05, { side: "se", until: T_7K - 0.4 });
const SWORD = pinS(GG.pin(`<svg width="72" height="25" viewBox="-23 -8 46 16" style="display:block;overflow:visible;filter:drop-shadow(0 0 3px rgba(255,236,170,.9)) drop-shadow(0 1px 2px rgba(0,0,0,.8))"><path d="M-12 -1.4 L19 -0.6 L22 0 L19 0.6 L-12 1.4 Z" fill="#eef0f2" stroke="#5a5a5a" stroke-width="0.5"/><rect x="-14" y="-5" width="2.4" height="10" rx="1" fill="#c9a24a"/><rect x="-21" y="-1.6" width="7" height="3.2" rx="1.2" fill="#6b4a2a"/><circle cx="-21.5" cy="0" r="2" fill="#c9a24a"/></svg>`, 1334, 1196, {}));
gsap.set(SWORD, { autoAlpha: 0 });
const SW_O = [1334, 1196], SW_R = [FR[1][0] + 2, FR[1][1] + 22], SW_W = [AM[1][0] - 4, AM[1][1] + 22], SW_L = [AM[3][0] - 4, AM[3][1] + 22];
tl.to(SWORD, { autoAlpha: 1, duration: 0.3 }, T_OFFER);
const SWTO = (p, t, dur = 0.9) => tl.to(SWORD, { left: p[0], top: p[1], duration: dur, ease: "power2.inOut" }, t);
SWTO(SW_R, T_ROCH - 0.3); SWTO([(SW_R[0] + SW_W[0]) / 2, SW_R[1] - 18], T_PW + 0.1, 0.5); SWTO(SW_W, T_PW + 0.6, 0.5);
SWTO([(SW_W[0] + SW_L[0]) / 2 + 10, (SW_W[1] + SW_L[1]) / 2], T_PD + 0.6, 0.8); SWTO(SW_L, T_LINC + 0.1, 0.8);
tl.to(SWORD, { scale: 1.35, duration: 0.3, yoyo: true, repeat: 1 }, T_TOOK + 0.1);
SWTO(SW_O, T_HANDED + 0.05, 1.0);
tl.to(SWORD, { autoAlpha: 0, duration: 0.5 }, T_7K - 0.4);
// "More than seven thousand British and German soldiers laid down their arms"
const C7 = CARD("", "OVER 7,000", "#c9b48a", T_7K, T_LEG - 0.35, { size: 80 });
ADDLINE(C7, "SURRENDER", T_ARMS, 50, "#ff8a80");
["r1", "r2", "r3", "r4", "r5", "bg1", "bg3", "o3", "gR"].forEach((id, k) => GREY(id, T_ARMS + 0.1 + k * 0.08));
wstampL("LEGEND", 1240, 1210, T_LEG + 0.05, T_LEG + 3.3, null, 24);
// ---------------------------------------------------------------------------------------------------------------------------------
// flags: explicit windows (one flag per side while a banner of that side is up)
// ---------------------------------------------------------------------------------------------------------------------------------
const FLAGWIN = (el, wins) => { tl.getTweensOf(el).forEach((tw) => tw.kill()); gsap.set(el, { autoAlpha: wins.length && wins[0][0] <= 0 ? 1 : 0 });
  wins.forEach(([a, b]) => { if (a > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, a); if (b != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, b); }); };
FLAGWIN(FL_GB, [[0, T_CW + 0.15], [T_18 - 0.1, T_NOTC + 0.1], [T_7K - 0.2, null]]);
FLAGWIN(FL_FR, [[0, T_REF + 0.1], [T_TWO, T_ROCH], [T_7K - 0.2, null]]);
FLAGWIN(FL_US, [[0, T_REF + 0.1], [T_TWO, T_ROCH], [T_7K - 0.2, null]]);
FLAGWIN(FL_GC, [[T_FRENCH + 0.4, null]]);
// ---------------------------------------------------------------------------------------------------------------------------------
window.SFX_CUES = (window.SFX_CUES || []).filter(([k]) => !String(k).startsWith("ref:")); document.documentElement.setAttribute("data-sfx", JSON.stringify(window.SFX_CUES));
if (GD.var.audit) LABEL_AUDIT([0.5, 8, 16, 24, 30, 36, 44, 52, 58, 64, 72, 80, 88, 96, 104, 112, 120], { show: true });
