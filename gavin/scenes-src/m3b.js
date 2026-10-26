// MOVE 3b: the Waal crossing, Nijmegen, 18-20 September 1944 (move3-3 .. move3-10). Basemap: nijmegen (z15) + water mask (the Waal).
// Sides: US / British = blue, German = red. Facts: research/FACT_NOTES.md (26 boats, ~260 men, ~15:00, 48 killed, tanks over at ~19:00).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const RAIL_N = [1382, 682], RAIL_S = [1400, 808], ROAD_N = [1744, 752], ROAD_S = [1760, 908];
const LAUNCH = [1085, 640], PSTATION = [1010, 720], MASK = "assets/nijmegen_land.png";
GG.water("assets/nijmegen_water.png", 0, { alpha: 0.85 });
K.grid(GG.proj(15, 4329295, 2775666), 51.83, 51.875, 5.80, 5.93, 0.01, 0);
GG.road([RAIL_N, RAIL_S], { w: 7 }); GG.road([ROAD_N, ROAD_S], { w: 10 });
GG.road([ROAD_S, [1800, 1000], [1900, 1200], [2000, 1620]]);
GG.lbl("RAILWAY BRIDGE", RAIL_S[0] + 20, RAIL_S[1] + 30, { size: 18, anchor: [0, -50], t: 0 });
GG.lbl("ROAD BRIDGE", ROAD_S[0] + 24, ROAD_S[1] + 26, { size: 22, color: "#fff6d8", anchor: [0, -50], t: 0 });
B.label("THE WAAL", 1230, 640, { cls: "river", size: 34, rot: 28, t: 0, instant: true });
GG.lbl("NIJMEGEN", 1960, 1180, { size: 30, t: 0 });
GG.lbl("LENT", 1560, 470, { size: 20, t: 0 });
GG.lbl("ARNHEM ▲ 10 MILES", 1740, 60, { size: 22, t: 0 });
const p = (n) => "move3-" + n;
const S = [0, 0, 0, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (n >= 3 ? P(p(n)) : 0));
const T_NIGHT1 = at(p(3), "On the first night"), T_TWO = at(p(3), "Two days later"), T_SS = at(p(3), "German SS troops"), T_ARN = at(p(3), "the paratroopers at Arnhem");
const T_EXPECT = S[4], T_GUARD = at(p(4), "The river guarded"), T_300 = at(p(4), "Three hundred metres"), T_NOONE = at(p(4), "No one would");
const T_SAW = S[5], T_BOTH = at(p(5), "from both ends"), T_CROSS = at(p(5), "cross the river downstream");
const T_BOATS = S[6], T_26 = at(p(6), "Twenty-six"), T_NEVER = at(p(6), "None of the"), T_TEN = at(p(6), "Each boat"), T_3PM = at(p(6), "At about three"), T_COOK = at(p(6), "Major Julian Cook");
const T_FIRE = S[7], T_WIND = at(p(7), "but the wind"), T_GER = at(p(7), "The Germans opened"), T_HIT = at(p(7), "Boats were hit"), T_PRAY = at(p(7), "Cook prayed");
const T_HALF = S[8], T_DIKE = at(p(8), "The survivors"), T_EAST = at(p(8), "then turned east"), T_ROOF = at(p(8), "British officers");
const T_FERRY = S[9], T_RAIL = at(p(9), "the paratroopers fought"), T_ROADB = at(p(9), "then the road bridge"), T_SEVEN = at(p(9), "At about seven"), T_STOOD = at(p(9), "it stayed standing");
const T_48 = S[10], T_BRAVE = at(p(10), "It was one of"), T_ARNHEM = at(p(10), "But Arnhem"), T_FAILED = at(p(10), "Market Garden failed"), T_LESSON = at(p(10), "Lesson three");
B.camera([
  [0, 1800, 1000, 1.3],
  [T_SS, 1780, 960, 1.45],
  [T_ARN + 0.5, 1700, 700, 0.95],
  [S[4] + 1.0, 1350, 640, 1.0],
  [S[5] + 0.5, 1400, 620, 1.0],
  [S[6] + 0.5, 1080, 650, 1.6],
  [T_3PM + 1.0, 1100, 600, 1.5],
  [S[8] + 1.0, 1200, 560, 1.3],
  [S[9] + 0.5, 1450, 700, 1.05],
  [T_SEVEN + 0.5, 1700, 800, 1.4],
  [S[10], 1500, 700, 1.0],
  [END, 1500, 700, 1.05],
]);
// ---------- move3-3: three days of failed attacks from the south ----------
B.showDate(0.1);
B.date("17 – 19 SEPTEMBER", 0.3, T_3PM - 0.1, 34);
const SS = { ss1: [1790, 960, "I"], ss2: [1870, 990, "I"], ss3: [1740, 935, "•••"] };
Object.entries(SS).forEach(([id, [x, y, sz]], i) => { B.unit({ id, side: "rome", x, y, w: 30, h: 20, label: i ? null : "SS (VALKHOF / HUNNER PARK)", t: 0.2 + i * 0.15 }); K.counter(id, { icon: "infantry", flag: "ger", size: sz }); });
B.unit({ id: "us1", side: "carth", x: 1950, y: 1350, w: 34, h: 22, label: "82ND AIRBORNE", t: 0.4 });
K.counter("us1", { icon: "infantry", flag: "us", size: "II" });
const a1 = B.arrow({ side: "carth", pts: [[1950, 1320], [1890, 1150], [1840, 1030]], width: 14, t: T_NIGHT1, dur: 1.6 });
[[1830, 1040], [1850, 1060], [1820, 1020]].forEach(([x, y], i) => K.impact(x, y, T_NIGHT1 + 1.6 + i * 0.5, { r: 12, puffs: 2 }));
B.greyArrow(a1, T_NIGHT1 + 3.2, T_TWO);
B.caption("NIGHT ATTACK INTO THE CITY: STOPPED", T_NIGHT1 + 0.3, T_TWO - 0.2, "rome r");
[["bt1", 2000, 1250], ["bt2", 2040, 1290]].forEach(([id, x, y], i) => { B.unit({ id, side: "carth", x, y, w: 34, h: 22, label: i ? null : "BRITISH TANKS", t: T_TWO - 0.3 }); K.counter(id, { icon: "tank", flag: "uk" }); });
const a2 = B.arrow({ side: "carth", pts: [[2010, 1230], [1950, 1100], [1890, 1020]], width: 16, t: T_TWO + 0.2, dur: 1.6 });
[["ss1", 1885, 1030], ["ss2", 1900, 1040], ["ss3", 1870, 1020]].forEach(([u, x, y], i) => { const [ux, uy] = SS[u]; K.gun(ux, uy, T_TWO + 1.4 + i * 0.6, { unit: u }); K.impact(x + 40, y + 60, T_TWO + 1.7 + i * 0.6, { r: 12, puffs: 2 }); });
B.greyArrow(a2, T_TWO + 3.6, T_SS + 1);
B.caption("TANKS + PARATROOPERS THROUGH THE PARKS: STOPPED AGAIN", T_TWO + 0.3, T_SS - 0.2, "rome r");
B.caption("SS TROOPS DUG IN AROUND THE SOUTH END", T_SS, T_ARN - 0.2, "rome r");
B.caption("AT ARNHEM, THE BRITISH PARATROOPERS ARE RUNNING OUT OF TIME", T_ARN, S[4] - 0.2, "rome r");
// ---------- move3-4: the river guards the north end ----------
const RED = [["r1", 1120, 455, "artillery"], ["r2", 1270, 560, "infantry"], ["r3", 1400, 640, "aa"], ["r4", 1560, 690, "infantry"], ["r5", ROAD_N[0] + 30, ROAD_N[1] - 30, "artillery"]];
RED.forEach(([id, x, y, icon], i) => { B.unit({ id, side: "rome", x, y, w: 32, h: 22, t: T_EXPECT + 0.2 + i * 0.15 }); K.counter(id, { icon, flag: "ger", size: icon === "infantry" ? "I" : undefined }); });
const FR = [[980, 470], [1100, 560], [1200, 630], [1350, 745], [1500, 800], [1650, 828], [1800, 833], [1950, 735], [2050, 560]];
const FR2 = [[980, 350], [1100, 440], [1200, 510], [1350, 610], [1500, 660], [1650, 690], [1800, 690], [1950, 600], [2050, 440]];
K.front({ pts: FR, to: FR2, sideA: "rome", sideB: "carth", t: T_GUARD, dur: 1.6, moveT: T_RAIL, moveDur: 3.0, until: END + 1 });
K.frontTint({ pts: FR, to: FR2, side: "carth", dir: 1, depth: 170, alpha: 0.34, mask: MASK, t: T_GUARD + 0.4, moveT: T_RAIL, moveDur: 3.0 });
const redTint = K.frontTint({ pts: FR, side: "rome", dir: -1, depth: 95, alpha: 0.34, mask: MASK, t: T_GUARD + 0.4 });
B.caption("THE RIVER GUARDS THE NORTH END", T_GUARD, T_300 - 0.2, "rome r");
GG.lbl("~300 M OF OPEN WATER", 1250, 520, { size: 18, anchor: [0, -50], t: T_300, until: S[5] + 1 });
B.highlight([[1000, 500], [1200, 640], [1400, 760], [1600, 820], [1800, 840]], T_300, null, 30);
B.bubble("THEY WILL COME FROM THE SOUTH", 1250, 330, T_NOONE - 0.6, S[5] + 0.4);
// ---------- move3-5: take it from both ends ----------
K.badge({ name: "BRIG. GEN. JAMES M. GAVIN", role: "COMMANDER · 82ND AIRBORNE", photo: "assets/media/gavin_head.png", flag: "us", side: "carth", corner: "tr", t: T_SAW - 0.2, until: S[6] });
B.caption("GAVIN SAW SOMETHING DIFFERENT", T_SAW + 0.2, T_BOTH - 0.2, "carth r");
B.arrow({ side: "carth", pts: [[1800, 1020], [1770, 940]], width: 14, t: T_BOTH, dur: 0.8, until: S[6] + 0.5 });
B.arrow({ side: "carth", pts: [LAUNCH, [1150, 520], [1210, 440], [1330, 560], [RAIL_N[0], RAIL_N[1] - 10], [1600, 720], [ROAD_N[0] - 6, ROAD_N[1] - 14]], width: 12, dash: "18 12", t: T_CROSS, dur: 3.2, until: S[6] + 0.5 });
B.caption("TAKE THE BRIDGE FROM BOTH ENDS", T_BOTH, S[6] - 0.2, "carth r");
// ---------- move3-6: 26 canvas boats ----------
GG.pin(`<div style="width:26px;height:26px;background:#d8d2c2;border:3px solid #3b2f1e"></div>`, PSTATION[0], PSTATION[1], { t: T_BOATS });
GG.lbl("POWER STATION", PSTATION[0] - 20, PSTATION[1] + 30, { size: 16, anchor: [-100, -50], t: T_BOATS + 0.2 });
const boat = (x, y, t) => GG.pin(`<svg width="30" height="16" viewBox="0 0 30 16" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.6))"><path d="M1 3 L29 3 L24 14 L6 14 Z" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2"/></svg>`, x, y, { t });
const BOATS = [];
for (let i = 0; i < 26; i++) { const x = 980 + (i % 13) * 22 + (i > 12 ? 11 : 0), y = 640 + (i % 13) * 9 + (i > 12 ? 22 : 0); BOATS.push([boat(x, y, T_26 + (i % 13) * 0.06), x, y]); }
GG.tagbox("26 BOATS · PLYWOOD + CANVAS · 3 PADDLES EACH", 1100, 820, "#1f4fc4", { size: 16, t: T_26 + 0.3, until: T_FIRE });
B.caption("NONE OF THE PARATROOPERS HAD EVER USED ONE", T_NEVER, T_TEN - 0.2, "rome r");
B.caption("~10 PARATROOPERS + 3 ENGINEERS PER BOAT", T_TEN, T_3PM - 0.2, "carth r");
B.date("20 SEPT · ~15:00", T_3PM, T_SEVEN - 0.1, 38);
B.unit({ id: "cook", side: "carth", x: 1160, y: 760, w: 36, h: 24, label: "3/504 · MAJ. JULIAN COOK", t: T_COOK - 0.3 });
K.counter("cook", { icon: "infantry", flag: "us", size: "II" });
// ---------- move3-7: the crossing under fire ----------
[["sb1", 1250, 760, "tank", "uk"], ["sb2", 1320, 790, "tank", "uk"], ["sb3", 1180, 840, "artillery", "us"]].forEach(([id, x, y, icon, fl], i) => { B.unit({ id, side: "carth", x, y, w: 32, h: 22, t: T_FIRE + i * 0.2 }); K.counter(id, { icon, flag: fl }); });
[[1120, 455], [1270, 560], [1400, 640], [1120, 455], [1270, 560], [1400, 640]].forEach(([x, y], i) => {
  const from = [[1250, 760], [1320, 790], [1180, 840]][i % 3];
  const t = T_FIRE + 0.6 + i * 0.8;
  K.gun(from[0], from[1], t, { unit: ["sb1", "sb2", "sb3"][i % 3] });
  GG.arc(from[0], from[1], x + 10, y + 10, t + 0.05, { dur: 0.6, width: 3, h: i % 3 === 2 ? 120 : 10 });
  K.impact(x + 10, y + 10, t + 0.65, { r: 13, puffs: 2 });
});
[[1050, 600], [1110, 570], [1170, 600]].forEach(([x, y], i) => K.smoke(x, y, T_FIRE + 1.0 + i * 0.4, { n: 4, r: 22, rise: 10, drift: 80, life: 4.5, alpha: 0.55 }));
B.caption("SMOKE ON THE RIVER · THE WIND BLOWS IT AWAY", T_WIND - 0.3, T_GER - 0.2, "rome r");
BOATS.forEach(([el, x, y], i) => B.tl.to(el, { x: 120 + ((i * 17) % 40) - 20, y: -185 + ((i * 11) % 30) - 15, duration: 9.0, ease: "none" }, T_GER - 0.6 + (i % 13) * 0.12));
[[1120, 455], [1270, 560], [1400, 640], [1270, 560], [1120, 455], [1400, 640], [1270, 560]].forEach(([x, y], i) => { const t = T_GER + 0.4 + i * 0.8; GG.arc(x, y, 1060 + (i * 23) % 90, 570 - (i * 17) % 80, t, { h: 0, color: "#ff6a5a", dash: "10 7", width: 3, dur: 0.5, until: t + 0.9 }); SFX("mg", t); });
[[1060, 560], [1120, 520], [1010, 520], [1090, 480], [1150, 560], [1040, 470], [1130, 500]].forEach(([x, y], i) => { const t = T_GER + 1.0 + i * 0.9; K.gun(1120, 455, t - 0.5, { unit: "r1", sfx: "mortar" }); K.impact(x, y, t, { r: 12, puffs: 2 }); });
[3, 9, 17, 6, 21, 12, 24].forEach((k, i) => B.tl.to(BOATS[k][0], { autoAlpha: 0.2, duration: 0.6 }, T_HIT + i * 0.6));
B.caption("MACHINE GUNS · MORTARS · FLAK", T_GER, T_HIT - 0.2, "rome r");
B.caption("BOATS HIT · MEN IN THE RIVER", T_HIT, T_PRAY - 0.2, "rome r");
B.caption("COOK, PADDLING: HAIL MARY, FULL OF GRACE", T_PRAY, S[8] - 0.2, "carth r");
// ---------- move3-8: about half get across ----------
B.caption("ONLY ABOUT HALF THE BOATS MADE IT", T_HALF + 0.2, T_DIKE - 0.2, "rome r");
const LANDED = { l1: [1170, 430], l2: [1230, 470], l3: [1110, 410] };
Object.entries(LANDED).forEach(([id, [x, y]], i) => { B.unit({ id, side: "carth", x, y, w: 30, h: 20, t: T_HALF + 0.5 + i * 0.2 }); K.counter(id, { icon: "infantry", flag: "us", size: "I" }); });
BOATS.forEach(([el]) => GG.fadeOut(el, T_DIKE, 0.6));
B.move("l1", T_DIKE, 2.0, 1200, 360); B.move("l2", T_DIKE + 0.2, 2.0, 1280, 420);
B.grey(["r1", "r2"], T_DIKE + 1.4, 0.6); B.hideUnits(["r1", "r2"], T_EAST + 1, 0.6);
B.caption("UP THE DIKE · INLAND · THEN EAST TOWARD THE BRIDGES", T_DIKE, T_ROOF - 0.2, "carth r");
B.arrow({ side: "carth", pts: [[1230, 430], [1320, 520], [1380, 600]], width: 14, t: T_EAST, dur: 1.6, until: S[10] });
GG.tagbox("BRITISH OFFICERS WATCHING FROM THE ROOF", PSTATION[0], PSTATION[1] + 64, "#1f4fc4", { size: 14, t: T_ROOF, until: S[9] + 1 });
// ---------- move3-9: the bridges ----------
for (let k = 0; k < 4; k++) { const b = boat(1110, 440, T_FERRY + k * 0.8); B.tl.to(b, { x: -60, y: 190, duration: 1.6, yoyo: true, repeat: 1, ease: "none" }, T_FERRY + k * 0.8); GG.fadeOut(b, T_FERRY + k * 0.8 + 3.4, 0.3); }
B.caption("THE ENGINEERS PADDLE BACK AGAIN AND AGAIN", T_FERRY + 0.2, T_RAIL - 0.2, "carth r");
B.move("l2", T_RAIL, 2.4, RAIL_N[0] - 20, RAIL_N[1] - 20);
B.move("l1", T_RAIL + 0.3, 2.6, RAIL_N[0] + 20, RAIL_N[1] - 40);
B.grey(["r3"], T_RAIL + 1.6, 0.6); B.hideUnits(["r3"], T_ROADB, 0.6);
B.move("l2", T_ROADB, 3.0, ROAD_N[0] - 20, ROAD_N[1] - 30);
B.grey(["r4", "r5"], T_ROADB + 1.6, 0.6); B.hideUnits(["r4", "r5"], T_SEVEN, 0.6);
redTint.forEach((pl) => K.lose(pl, T_RAIL + 0.5));
B.date("20 SEPT · ~19:00", T_SEVEN, null, 38);
GG.layer("background: linear-gradient(to left, rgba(255,140,60,0.34), rgba(255,180,120,0.14) 55%, rgba(255,210,160,0.04));", T_SEVEN - 0.5, END + 2, { dur: 2.0 });
[["tk1", 0], ["tk2", 1], ["tk3", 2]].forEach(([id, i]) => {
  B.unit({ id, side: "carth", x: ROAD_S[0] + 20, y: ROAD_S[1] + 60 + i * 34, w: 36, h: 22, label: i ? null : "BRITISH TANKS", t: T_SEVEN - 0.4 + i * 0.2 });
  K.counter(id, { icon: "tank", flag: "uk" });
  B.move(id, T_SEVEN + 0.3 + i * 0.6, 3.0, ROAD_N[0] + 4 + i * 6, ROAD_N[1] - 70 - i * 30);
});
B.hideUnits(["ss1", "ss2", "ss3"], T_SEVEN, 0.8);
B.caption("~19:00 · BRITISH TANKS CROSS THE WAAL BRIDGE · IT STANDS", T_SEVEN + 0.2, S[10] - 0.2, "carth r");
// ---------- move3-10: the cost, Arnhem, the lesson ----------
B.dim(T_48 - 0.1, END + 1, 0.55);
K.casualties({ flagA: "us", headA: "THE CROSSING", flagB: "ger", headB: "GERMAN", rows: [["killed", "48", "?"], ["wounded", "100+", "?"]], t: T_48 + 0.2, until: T_ARNHEM - 0.3, top: 300 });
B.caption("ONE OF THE BRAVEST ATTACKS OF THE WAR · IT TOOK THE BRIDGE", T_BRAVE, T_ARNHEM - 0.2, "carth r");
GG.stamp("ARNHEM NEVER REACHED", T_ARNHEM, T_LESSON - 0.3, { top: 300 });
B.caption("MARKET GARDEN FAILED", T_FAILED - 0.2, T_LESSON - 0.3, "rome r");
B.dateBox(T_LESSON - 0.3);
GG.method(3, T_LESSON, END + 1, [T_LESSON + 0.2, T_LESSON + 0.8, T_LESSON + 1.6]);
K.raiseTerritory();
B.finish();
