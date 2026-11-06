// m3a (m3-1..m3-2), Grant #16 MOVE 3 opens. STYLE W (STYLE_LOCK 2d, restyled 2026-11-06; story, beats and every at() phrase of the approved v2
// kept): one green ink map (richmond_w z9 + close twin: the camera works at s 2.3-6, so the close battle look carries the scene).
// The armies in their trenches at Cold Harbor outside Richmond (Lee's lines hold; Grant = corner badge only, he has no unit here; Lee's card on
// a stake at his line); south across the James lies Petersburg where the railroads meet (title card on "the wide James River"); m3-2: the plan
// to disappear: Sheridan's cavalry west (his card rides with it), Lee's cavalry after it; after dark on the 12th Warren's Fifth Corps crosses
// the Chickahominy and faces Richmond (his card at his corps) while the rest slips out south by back roads, Meade's Army of the Potomac in the lead.
// Clean map: nothing changes hands here (no territory). Built with: python3 tools/m3_build.py m3a richmond_w m3-1 m3-2
// @@BODY
const P1 = "m3-1", P2 = "m3-2", G = GEO.ric;
const T_JUNE = at(P1, "second week of June"), T_TRENCH = at(P1, "sat in trenches"), T_RICH = at(P1, "outside Richmond"), T_GRANT = at(P1, "Grant could not"),
  T_LEE = at(P1, "Lee's lines"), T_NOT = at(P1, "So he decided not to try"), T_SOUTH = at(P1, "South of Richmond"), T_JAMES = at(P1, "the wide James River"),
  T_PET = at(P1, "lay Petersburg"), T_RR = at(P1, "where the railroads"), T_FED = at(P1, "fed Lee's army"), T_TOG = at(P1, "came together"),
  T_IF = at(P1, "If Grant could take it"), T_STARVE = at(P1, "Richmond would starve");
const T_PLAN = at(P2, "The plan was to disappear"), T_TELL = at(P2, "Grant did not tell the enemy"), T_NEED = at(P2, "he did not need to"),
  T_LOOK = at(P2, "He only needed Lee"), T_WRONG = at(P2, "in the wrong place"), T_SHER = at(P2, "Philip Sheridan"), T_WEST = at(P2, "off to the west"),
  T_LCAV = at(P2, "Lee sent his own cavalry"), T_DARK = at(P2, "After dark"), T_12 = at(P2, "twelfth of June"), T_WAR = at(P2, "Gouverneur Warren"),
  T_CHICK = at(P2, "crossed the Chickahominy"), T_FACED = at(P2, "faced toward Richmond"), T_REST = at(P2, "the rest of the army slipped out"),
  T_SOUTH2 = at(P2, "marched south by back roads"), T_MEADE = at(P2, "General Meade"), T_LEAD = at(P2, "in the lead");
// ---------- map: clean (no fills), living map ----------
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 });
camera([[0, 1432, 812, 5.6], [T_TRENCH, 1430, 816, 6.0], [T_GRANT + 1.0, 1436, 818, 6.2], [T_SOUTH, 1432, 872, 4.7], [T_PET, 1428, 890, 4.5], [T_TOG, 1428, 890, 4.5],
  [T_STARVE + 0.6, 1430, 888, 4.5], [T_TELL + 1.0, 1428, 840, 4.9], [T_LOOK + 0.8, 1400, 800, 3.6], [T_SHER, 1320, 740, 2.35], [T_LCAV + 2.2, 1318, 744, 2.3],
  [T_12 + 0.4, 1470, 840, 4.3], [T_CHICK + 1.5, 1475, 855, 4.5], [T_REST + 0.6, 1490, 865, 4.0], [T_LEAD, 1495, 858, 3.9], [END, 1497, 860, 3.85]]);   // critic 2: Lee's card clear of the date scroll in the night section
// date scroll on the spoken date (clean first frame: nothing before it)
dateNow("JUNE 1864", T_12 - 0.1); B.date("12 JUNE 1864", T_12, null, 34);   // critic r1: the date scroll is filled from frame 0
// ---------- flags (48 px, behind each side's lines, both on every frame) ----------
flagS(FL.us, 1488, 806, 0, T_LOOK + 1.2); flagS(FL.cs, 1380, 800, 0, T_SOUTH + 1.0);
flagS(FL.cs, 1350, 930, T_SOUTH + 0.6, T_LOOK + 1.2);
flagS(FL.us, 1530, 792, T_LOOK + 0.9, T_DARK + 1.4);   // off the start of Sheridan's trail flagS(FL.cs, 1250, 800, T_LOOK + 0.9, T_DARK + 1.4);
flagS(FL.us, 1520, 860, T_DARK + 1.1, END + 1); flagS(FL.cs, 1405, 905, T_DARK + 1.1, END + 1);
// ---------- Cold Harbor: the two lines (the locked two-colour front where the sides touch) + the ink trenches ----------
const FR = frontS({ pts: G.CH_FRONT, sideA: "carth", sideB: "rome", t: 0, dur: 0.01, width: FWw(5.6), until: T_REST + 2.0 });
const TR1 = trench(G.CH_FRONT.map((q) => [q[0] + 5.5, q[1]]), T_TRENCH - 0.1, 1.4, T_REST + 2.0, 5.6);
const TR2 = trench(G.CH_FRONT.map((q) => [q[0] - 5.5, q[1]]), T_TRENCH + 0.2, 1.4, T_REST + 6.0, 5.6);
const BU = [["u2", [1456, 796]], ["u6", [1458, 812.5]], ["u18", [1455, 829]]], RU = [["r1", [1426, 794]], ["r2", [1429, 811]], ["r3", [1426, 828]]];
BU.forEach(([id, p]) => unitS(id, "carth", p, "infantry", null, { t: 0, size: "XXX" }));
RU.forEach(([id, p]) => unitS(id, "rome", p, "infantry", null, { t: 0, size: "XXX" }));
unitS("v5", "carth", [1470, 822], "infantry", null, { t: 0, size: "XXX" });            // Warren's Fifth Corps in reserve
unitS("rr", "rome", [1398, 822], "infantry", null, { t: 0, size: "XXX" }); B.move("rr", 0, 4.0, 1414, 818);   // moving at frame 0
B.move("v5", 0.3, 3.5, 1468, 818);
// Grant cannot break through Lee's lines: a probe that bounces, the guns of the line fire (visible, powder smoke)
badgeC({ name: "ULYSSES S. GRANT", role: "", initials: "USG", photo: PHOTO("grant"), flag: FL.us, side: "carth", corner: "tr", t: T_GRANT - 0.1, until: T_NOT + 1.2 });   // no unit of his on this map
pinPortrait("r1", PHOTO("lee"), FL.cs, "Lee", T_LEE - 0.1, END + 1, true, "west");   // Lee's card at his line while his part of the story runs (steps out before the night shot crops it at the top edge)
arw({ pts: [[1466, 806], [1452, 808], [1444, 810]], side: "carth", t: T_GRANT + 0.1, dur: 0.9, width: AW(6.2, 9), until: T_NOT + 0.4 });
shoot([1426, 802], [1450, 808], T_GRANT + 0.9, { r: 2.2, width: 0.35, dur: 0.5, h: 3 }); smoke([[1426, 801], [1427, 799]], T_GRANT + 0.9, 1.0);
shoot([1428, 820], [1453, 815], T_LEE + 0.5, { r: 2.2, width: 0.35, dur: 0.5, h: 3 }); smoke([[1428, 819], [1429, 817]], T_LEE + 0.5, 1.0);
crosses([[1446, 809]], T_NOT, T_NOT + 3.0, 1.2);
stampP("COULD NOT BREAK THROUGH", 1448, 848, T_GRANT + 1.3, T_GRANT + 4.6, 24);
// ---------- south across the wide James lies Petersburg; the railroads meet there ----------
const RICH = town("RICHMOND", G.RICHMOND, T_RICH, "l", { keep: true });
glowPath(G.JAMES, "", 1.3, T_JAMES - 0.2, T_JAMES + 3.0);                     // STYLE W: focus + ink trace along the James on its word
const TT = B.title("MOVE 3", "THE JAMES RIVER", "JUNE 1864", T_JAMES, T_JAMES + 2.6); SFX("ref:boom", T_JAMES + 0.15);
const PETL = town("PETERSBURG", G.PETERSBURG, T_PET, "l", { keep: true });
tl.to(PETL.el, { autoAlpha: 0, duration: 0.4 }, T_LOOK + 0.4); tl.to(PETL.el, { autoAlpha: 1, duration: 0.5 }, T_REST + 0.6);   // steps out while the camera crops it at the bottom edge
focus(G.PETERSBURG, 40, T_PET + 0.2, T_PET + 3.4);
// critic r1: the railroads as railroads (ink rail + cross ties), drawn in after "railroads", clear of the title card, held to "Richmond would starve"
const RAILS = [G.RR_RP, G.RR_SS, G.RR_W, G.RR_NP, G.RR_CP].map((pts, k) => railInk(pts.slice().reverse(), T_RR + 0.1 + k * 0.25, T_STARVE + 1.2, 4.5));
focus(G.PETERSBURG, 60, T_TOG, T_TOG + 3.0);
// if Grant could take it, Richmond would starve (the one caption of this paragraph: the claim to remember)
RICH.grow(T_STARVE);
stampP("RICHMOND WOULD STARVE", 1478, 930, T_STARVE - 0.1, T_PLAN - 0.2, 26);   // the claim to remember, on empty ground east of Petersburg
// ---------- m3-2: the plan was to disappear ----------
stampP("THE PLAN WAS TO DISAPPEAR", 1418, 862, T_PLAN + 0.1, T_PLAN + 3.4, 24);
BU.concat([["v5"]]).forEach(([id], k) => tl.to(B.units[id].el, { opacity: 0.45, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, T_PLAN + 0.2 + k * 0.15));
// Lee looks in the wrong place: question marks over the empty ground to the north-west (<= 3.5 s)
[[1386, 770], [1414, 760]].forEach((p, k) => { const q = pinS(GG.pin(`<div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:40px;color:#fbf8ef;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6)">?</div>`, p[0], p[1], { t: T_WRONG - 0.3 + k * 0.25 }));
  tl.to(q, { autoAlpha: 0, duration: 0.5 }, Math.min(T_SHER - 0.2, T_WRONG + 3.0)); });
// Sheridan's cavalry off to the west (his card rides with it); Lee's cavalry after it; thin trails fade ~2 s after arrival
unitS("sh", "carth", G.SHERIDAN[0], "infantry", "SHERIDAN", { t: T_SHER - 0.3, size: "XX" }); cavIcon("sh", { flip: true });
pinPortrait("sh", PHOTO("sheridan"), FL.us, "Sheridan", T_SHER, END + 1, true, "up");
along("sh", G.SHERIDAN, T_SHER + 0.2, 5.5, 20);
arw({ pts: G.SHERIDAN, side: "carth", t: T_SHER + 0.2, dur: 5.0, width: AW(2.35, 8), until: T_DARK - 0.5 });   // fades before the camera dives back (~2 s after the riders leave the frame)
const HMP = G.HAMPTON.slice(1);   // critic 2: the trail starts clear of Lee's card
unitS("hc", "rome", HMP[0], "infantry", null, { t: T_LCAV - 0.2, size: "XX" }); cavIcon("hc", { flip: true });
along("hc", HMP, T_LCAV + 0.2, 4.4, 18);
arw({ pts: HMP, side: "rome", t: T_LCAV + 0.2, dur: 4.0, width: AW(2.35, 8), until: T_DARK - 0.5 });
// critic r1: at the wide scale one box per side at Cold Harbor (the others step out, back when the camera returns)
hideU(["u6", "u18", "v5", "r2", "r3", "rr"], T_LOOK + 0.3); showU(["u6", "u18", "v5", "r2", "r3", "rr"], T_12 + 0.2);
// ---------- after dark on the 12th: Warren crosses the Chickahominy and faces Richmond; the rest slips out south ----------
nightWash(T_DARK, null, 0.42, 1.6);
K.night({ lines: [FR], tOn: T_DARK });
pinPortrait("v5", PHOTO("warren"), FL.us, "Warren", T_WAR, END + 1, true, "right");
glowPath(G.CHICK.slice(2, 9), "", 1.3, T_CHICK - 0.2, T_CHICK + 3.2);
curveLabel("Chickahominy River", G.CHICK.slice(8, 12).map((q) => [q[0] + 5, q[1] - 6]), T_CHICK, T_CHICK + 3.3, 22);   // downstream of Warren's card
along("v5", [[1468, 818], ...G.WARREN.slice(1)], T_CHICK - 0.3, 4.2, 18);
arw({ pts: G.WARREN.slice(0, 5), side: "carth", t: T_CHICK - 0.2, dur: 3.6, width: AW(4.6, 8), until: T_CHICK + 5.4 });
const WF = frontS({ pts: [[1452, 878], [1449, 890], [1451, 902]], sideA: "carth", sideB: "rome", t: T_FACED, dur: 1.2, width: FWw(4.6), until: END + 1 });
K.night({ lines: [WF], tOn: T_FACED });
unitS("rw", "rome", [1432, 889], "infantry", null, { t: T_FACED + 0.3, size: "XXX" });
arw({ pts: [[1460, 892], [1446, 890], [1436, 887]], side: "carth", t: T_FACED + 0.2, dur: 0.9, width: AW(4.6, 8), until: T_FACED + 3.1 });
// the rest of the army slips out of the trenches and marches south by back roads (thin trails, fade ~2 s after arrival)
[["u2", G.MARCH1], ["u6", G.MARCH2], ["u18", G.MARCH1.map((q) => [q[0] - 6, q[1] + 4])]].forEach(([id, pts], k) => along(id, [[BU[k][1][0], BU[k][1][1]], ...pts.slice(1)], T_REST + 0.2 + k * 0.6, 6.0, 22));
arw({ pts: G.MARCH1, side: "carth", t: T_SOUTH2 - 0.6, dur: 3.0, width: AW(4.3, 8), until: T_SOUTH2 + 4.4 });
pinPortrait("u2", PHOTO("meade"), FL.us, "Meade", T_MEADE, END + 1, true, "right");
pulseU("u2", T_LEAD); pulseU("u2", T_LEAD + 0.6);
fixImgs();
K.raiseTerritory();
B.finish();
