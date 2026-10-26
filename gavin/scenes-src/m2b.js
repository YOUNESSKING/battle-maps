// MOVE 2b: the La Fière causeway, 6-9 June 1944 (move2-2 .. move2-9). Basemap: lafiere (z15) + flood mask (elevation < 4.5 m).
// Iron Mike memorial (east end) 49.4013 N 1.3635 W (legion.org). Causeway ~500 yards; facts: research/FACT_NOTES.md.
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(15, 4161523, 2865687);
const MANOR = [1030, 836], BRIDGE = [1008, 835], CHAPEL = [785, 826], SME = G(49.408, -1.317);
const CAUSE = [[BRIDGE[0], BRIDGE[1]], [940, 833], [880, 831], [CHAPEL[0] + 15, CHAPEL[1] + 2]];
const MASK = "assets/lafiere_land.png";
const p = (n) => "move2-" + n;
const S = [0, 0, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (n >= 2 ? P(p(n)) : 0));
const T_FLOOD = at(p(2), "flooded"), T_ROAD = at(p(2), "one narrow raised road"), T_500 = at(p(2), "five hundred yards"), T_MANOR = at(p(2), "the manor of La");
const T_SEIZED = S[3], T_HELD3 = at(p(3), "for three days"), T_TANKS = at(p(3), "captured French tanks"), T_BAZ = at(p(3), "bazooka teams"), T_DOLAN = at(p(3), "When someone asked"), T_STAYED = at(p(3), "They stayed");
const T_FAR = S[4], T_BARE = at(p(4), "Any attack"), T_IMPOSS = at(p(4), "looked impossible");
const T_SAW = S[5], T_SPEED = at(p(5), "Speed was"), T_HIT = at(p(5), "Hit the far bank"), T_TOOLS = at(p(5), "By now he had"), T_GUNS5 = at(p(5), "heavy guns");
const T_NINTH = S[6], T_1045 = at(p(6), "at a quarter to eleven"), T_THIN = at(p(6), "But the smoke"), T_GROUND = at(p(6), "went to ground"), T_BACK = at(p(6), "Some turned back"), T_DYING = at(p(6), "The attack was dying");
const T_RAE = S[7], T_GO = at(p(7), "All right"), T_CHARGE = at(p(7), "Rae's ninety men"), T_RIDGWAY = at(p(7), "Gavin and his commander");
const T_FAR8 = S[8], T_FOLLOW = at(p(8), "the stalled glider"), T_CHAPEL = at(p(8), "Around the little chapel"), T_OPEN = at(p(8), "By the end of the day");
const T_COST = S[9], T_WEST = at(p(9), "But the road west"), T_LESSON = at(p(9), "Lesson two");

GG.water("assets/lafiere_water.png", 0, { alpha: 0.8, color: "#8fb1cc" });
K.grid(G, 49.38, 49.43, -1.42, -1.27, 0.01, 0);
GG.road([[1700, 760], [1400, 800], [1150, 830], [MANOR[0], MANOR[1]]]);
GG.road([[2093, 595], [1700, 760]]);
GG.road([[CHAPEL[0], CHAPEL[1]], [600, 800], [300, 760], [0, 740]]);
const causeway = GG.road(CAUSE, { w: 6 });
B.camera([
  [0, 950, 830, 0.95],
  [T_ROAD, 930, 830, 1.35],
  [T_MANOR + 1.0, 960, 830, 1.7],
  [S[3] + 0.5, 930, 830, 1.6],
  [S[4] + 1.0, 880, 830, 1.75],
  [S[5] + 0.3, 900, 830, 1.5],
  [T_TOOLS + 0.5, 1050, 860, 1.1],
  [S[6] + 0.5, 920, 830, 1.6],
  [S[7] + 0.5, 930, 830, 1.75],
  [S[8] + 1.0, 820, 820, 1.4],
  [S[9], 900, 830, 1.2],
  [END, 900, 830, 1.25],
]);
// ---------- move2-2: the ground ----------
B.showDate(0.1);
B.date("6 JUNE 1944", 0.3, T_HELD3 - 0.1, 38);
B.caption("THE GERMANS FLOODED THE MERDERET VALLEY", T_FLOOD - 0.3, T_ROAD - 0.2, "rome r");
GG.lbl("MERDERET FLOODS", 930, 690, { size: 22, color: "#e6f2fa", t: T_FLOOD });
B.city("STE-MÈRE-ÉGLISE ▶", 1700, 760, { size: 20, r: 6, t: T_ROAD });
B.highlight(CAUSE, T_ROAD + 0.2, null, 24);
const bar = GG.pin(`<div style="width:${CAUSE[0][0] - CAUSE[3][0]}px;height:14px;border-left:4px solid #fbfaf6;border-right:4px solid #fbfaf6;border-bottom:4px dashed #fbfaf6"></div>`, (CAUSE[0][0] + CAUSE[3][0]) / 2, 790, { t: T_500 - 0.4, until: S[3] + 1 });
GG.lbl("~500 YARDS · NO COVER", (CAUSE[0][0] + CAUSE[3][0]) / 2, 768, { size: 18, t: T_500 - 0.2, until: S[3] + 1 });
GG.pin(`<div style="width:22px;height:22px;background:#e9dfc6;border:3px solid #3b2f1e;transform:rotate(45deg)"></div>`, MANOR[0] + 18, MANOR[1] - 4, { t: T_MANOR - 0.2 });
GG.lbl("MANOR OF LA FIÈRE", MANOR[0] + 40, MANOR[1] - 30, { size: 18, anchor: [0, -50], t: T_MANOR });
GG.lbl("BRIDGE", BRIDGE[0] - 6, BRIDGE[1] + 26, { size: 14, t: T_MANOR + 0.2 });
GG.lbl("CAUQUIGNY CHAPEL", CHAPEL[0] - 10, CHAPEL[1] - 26, { size: 16, anchor: [-100, -50], t: T_MANOR + 0.3 });
// ---------- move2-3: three days holding the manor ----------
const BL = { a1: [1046, 820, "I", "A COY 505TH (DOLAN)"], a2: [1060, 868, "•••", ""], a3: [1050, 780, "•••", ""] };
Object.entries(BL).forEach(([id, [x, y, sz, lb]], i) => { B.unit({ id, side: "carth", x, y, w: 30, h: 20, label: lb || null, t: T_SEIZED + 0.2 + i * 0.2 }); K.counter(id, { icon: "infantry", flag: "us", size: sz }); });
const RD = { g1: [760, 800, "I"], g2: [745, 860, "I"], g3: [770, 760, "•••"] };
Object.entries(RD).forEach(([id, [x, y, sz]], i) => { B.unit({ id, side: "rome", x, y, w: 30, h: 20, t: T_SEIZED + 0.6 + i * 0.2 }); K.counter(id, { icon: "infantry", flag: "ger", size: sz }); });
const FR = [[905, 640], [902, 740], [900, 832], [880, 940], [862, 1060]], FR2 = [[700, 640], [690, 740], [690, 830], [660, 940], [630, 1060]];
const front = K.front({ pts: FR, to: FR2, sideA: "carth", sideB: "rome", t: T_SEIZED + 1.0, dur: 1.6, moveT: T_FOLLOW, moveDur: 3.0, until: END + 1 });
K.frontTint({ pts: FR, to: FR2, side: "carth", dir: -1, depth: 170, alpha: 0.34, mask: MASK, t: T_SEIZED + 1.2, moveT: T_FOLLOW, moveDur: 3.0 });
const redTint = K.frontTint({ pts: FR, side: "rome", dir: 1, depth: 95, alpha: 0.34, mask: MASK, t: T_SEIZED + 1.2 });
B.caption("D-DAY MORNING: PARATROOPERS SEIZE THE MANOR", T_SEIZED + 0.2, T_HELD3 - 0.2, "carth r");
B.date("6 – 8 JUNE", T_HELD3, T_NINTH - 0.1, 38);
// captured French tanks come down the causeway; bazookas knock them out
const tankRun = (id, t, stopX) => {
  B.unit({ id, side: "rome", x: CHAPEL[0] + 20, y: CHAPEL[1] + 4, w: 32, h: 20, t: t - 0.5 });
  K.counter(id, { icon: "tank", flag: "ger" });
  B.move(id, t, 2.4, stopX, 832, "power1.in");
  [0, 1].forEach((k) => { K.gun(stopX, 832, t + 1.4 + k * 0.6, { unit: id, dx: 14, dy: 0 }); K.impact(1030 + k * 12, 826 - k * 10, t + 1.9 + k * 0.6, { r: 11, puffs: 2 }); });
  K.gun(BRIDGE[0] + 20, 822, t + 2.7, { dx: -12, dy: -6 });
  GG.arc(BRIDGE[0] + 10, 822, stopX + 10, 830, t + 2.72, { h: 0, color: "#fff3c4", dash: "10 7", width: 3, dur: 0.35, until: t + 3.4 });
  K.impact(stopX, 830, t + 3.05, { r: 14, puffs: 3 });
  B.grey([id], t + 3.1, 0.4);
  K.smoke(stopX, 826, t + 3.4, { n: 4, r: 10, rise: 26, life: 3 });
};
tankRun("rt1", T_TANKS - 0.4, 952);
tankRun("rt2", T_TANKS + 3.4, 928);
GG.tagbox("CAPTURED FRENCH TANKS", 820, 880, "#c4121f", { size: 15, t: T_TANKS, until: T_DOLAN });
B.caption("BAZOOKA TEAMS STOP THE TANKS ON THE ROAD", T_BAZ, T_DOLAN - 0.2, "carth r");
B.caption("LT. JOHN DOLAN: NO BETTER PLACE TO DIE", T_DOLAN + 0.6, S[4] - 0.2, "carth r");
// ---------- move2-4: the killing ground ----------
const MG = [[760, 800], [745, 860], [770, 760]];
MG.forEach(([x, y], i) => GG.polygon([[x + 10, y], [1000, 790 + i * 6], [1000, 880 - i * 6]], "rgba(196,18,31,0.16)", T_FAR + 0.3 + i * 0.3, S[5] + 0.5, { stroke: "rgba(196,18,31,0.7)", sw: 2, dash: "10 6" }));
[[760, 800, 960, 830], [745, 860, 930, 836], [770, 760, 990, 828]].forEach(([x1, y1, x2, y2], i) => { GG.arc(x1, y1, x2, y2, T_FAR + 1.0 + i * 1.1, { h: 0, color: "#ff6a5a", dash: "10 7", width: 3, dur: 0.5, until: T_FAR + 1.9 + i * 1.1 }); SFX("mg", T_FAR + 1.0 + i * 1.1); });
B.caption("GERMAN MACHINE GUNS COVER EVERY YARD", T_FAR + 0.3, T_BARE - 0.2, "rome r");
B.caption("A BARE ROAD · WATER ON BOTH SIDES · NOWHERE TO HIDE", T_BARE, T_IMPOSS - 0.2, "rome r");
B.bubble("NOBODY CAN CROSS THAT ROAD", 600, 700, T_IMPOSS - 0.5, S[5] + 0.3);
// ---------- move2-5: speed is the only cover ----------
K.badge({ name: "BRIG. GEN. JAMES M. GAVIN", role: "ASSISTANT COMMANDER · 82ND AIRBORNE", photo: "assets/media/gavin_head.png", flag: "us", side: "carth", corner: "tr", t: T_SAW - 0.2, until: T_TOOLS });
B.caption("GAVIN SAW SOMETHING DIFFERENT", T_SAW + 0.2, T_SPEED - 0.2, "carth r");
B.caption("SPEED IS THE ONLY COVER", T_SPEED, T_HIT - 0.2, "carth r");
B.arrow({ side: "carth", pts: [[1000, 832], [900, 831], [790, 828]], width: 14, dash: "18 10", t: T_HIT, dur: 1.0, until: T_TOOLS + 0.5 });
B.caption("HIT THE FAR BANK WITH EVERYTHING AT ONCE · KEEP MOVING", T_HIT + 0.2, T_TOOLS - 0.2, "carth r");
B.unit({ id: "gl", side: "carth", x: 1160, y: 880, w: 40, h: 26, label: "GLIDER INFANTRY BN", t: T_TOOLS + 0.3 });
K.counter("gl", { icon: "infantry", flag: "us", size: "II" });
B.unit({ id: "art", side: "carth", x: 1420, y: 930, w: 36, h: 24, label: "HEAVY GUNS (155 MM)", t: T_GUNS5 });
K.counter("art", { icon: "artillery", flag: "us", size: "II" });
// ---------- move2-6: 9 June, the attack stalls ----------
B.date("9 JUNE · 10:45", T_NINTH + 0.1, null, 38);
for (let i = 0; i < 10; i++) {
  const [tx, ty] = MG[i % 3];
  const t = T_NINTH + 0.6 + i * 0.7;
  K.gun(1420, 922, t, { unit: "art" });
  GG.arc(1420, 922, tx + ((i * 17) % 30) - 15, ty + ((i * 11) % 24) - 12, t + 0.05, { dur: 1.0, width: 3, h: 180 });
  K.impact(tx + ((i * 17) % 30) - 15, ty + ((i * 11) % 24) - 12, t + 1.05, { r: 14, puffs: 2 });
}
B.caption("15 MINUTES OF SHELLING ON THE FAR BANK", T_NINTH + 0.4, T_1045 - 0.2, "carth r");
[[900, 820], [860, 840], [820, 826]].forEach(([x, y], i) => K.smoke(x, y, T_1045 - 0.5 + i * 0.4, { n: 3, r: 18, rise: 20, life: 4, alpha: 0.5 }));
B.move("gl", T_1045, 1.0, 1010, 836);
B.move("gl", T_1045 + 1.0, 2.6, 905, 834, "power1.out");
B.arrow({ side: "carth", pts: [[1000, 834], [940, 833], [905, 832]], width: 14, t: T_1045 + 0.6, dur: 2.2, until: S[7] + 1 });
[[760, 800, 905, 830], [745, 860, 900, 838], [770, 760, 910, 828], [760, 800, 930, 834]].forEach(([x1, y1, x2, y2], i) => { GG.arc(x1, y1, x2, y2, T_THIN + i * 0.8, { h: 0, color: "#ff6a5a", dash: "10 7", width: 3, dur: 0.45, until: T_THIN + 0.9 + i * 0.8 }); SFX("mg", T_THIN + i * 0.8); });
B.caption("THIN SMOKE · FIRE SWEEPS THE ROAD · THE LEADERS GO TO GROUND", T_THIN, T_BACK - 0.2, "rome r");
B.unit({ id: "gl2", side: "carth", x: 905, y: 834, w: 26, h: 18, t: T_BACK - 0.3 });
K.counter("gl2", { icon: "infantry", flag: "us", size: "•••" });
B.move("gl2", T_BACK, 2.0, 1060, 846);
B.caption("THE ATTACK IS DYING ON THE CAUSEWAY", T_DYING, S[7] - 0.2, "rome r");
// ---------- move2-7: "All right, you've got to go." ----------
B.unit({ id: "rae", side: "carth", x: 1040, y: 860, w: 34, h: 22, label: "CAPT. RAE · ~90 MEN", t: T_RAE + 0.3 });
K.counter("rae", { icon: "infantry", flag: "us", size: "I" });
K.badge({ name: "BRIG. GEN. JAMES M. GAVIN", role: "ON THE CAUSEWAY", photo: "assets/media/gavin_head.png", flag: "us", side: "carth", corner: "tr", t: T_RAE, until: S[8] });
B.bubble("“All right, you've got to go.”", 1060, 930, T_GO - 0.2, T_CHARGE + 1.5);
B.move("rae", T_CHARGE, 3.0, 800, 830, "power1.in");
B.move("gl", T_CHARGE + 1.2, 2.6, 810, 845);
B.arrow({ side: "carth", pts: [[1000, 840], [900, 838], [790, 832]], width: 18, t: T_CHARGE, dur: 2.0, until: S[8] + 2 });
GG.tagbox("RIDGWAY", 960, 808, "#1f4fc4", { size: 14, t: T_RIDGWAY, until: S[8] + 0.5 });
GG.tagbox("GAVIN", 930, 860, "#1f4fc4", { size: 14, t: T_RIDGWAY + 0.4, until: S[8] + 0.5 });
B.caption("GAVIN AND RIDGWAY OUT ON THE ROAD, UNDER FIRE", T_RIDGWAY, S[8] - 0.2, "carth r");
// ---------- move2-8: across ----------
B.move("gl2", T_FOLLOW, 3.0, 780, 870);
[["r1", 740, 760], ["r2", 720, 820], ["r3", 730, 880]].forEach(([id, x, y], i) => { B.unit({ id, side: "carth", x: 820, y: 836, w: 28, h: 20, t: T_FOLLOW + i * 0.2 }); K.counter(id, { icon: "infantry", flag: "us", size: "I" }); B.move(id, T_FOLLOW + 0.2 + i * 0.2, 2.6, x - 60, y); });
B.grey(["g1", "g2", "g3"], T_CHAPEL, 0.8);
B.hideUnits(["g1", "g2", "g3"], T_CHAPEL + 2.0, 0.8);
redTint.forEach((pl) => K.lose(pl, T_FOLLOW + 0.4));
K.target(CHAPEL[0], CHAPEL[1], T_CHAPEL, { r: 40, side: "carth", until: T_OPEN + 2 });
B.caption("AROUND CAUQUIGNY THE GERMAN POSITIONS FALL", T_CHAPEL, T_OPEN - 0.2, "carth r");
for (let i = 0; i < 6; i++) { const el = GG.pin(`<div style="width:18px;height:12px;background:#1f4fc4;border:2px solid #f3eee2"></div>`, 1060, 840, { t: T_OPEN + i * 0.3 }); B.tl.to(el, { x: -260, y: -6, duration: 3.0, ease: "none" }, T_OPEN + i * 0.3); }
B.caption("THE CAUSEWAY IS OPEN", T_OPEN + 0.2, S[9] - 0.2, "carth r");
// ---------- move2-9: the cost, the lesson ----------
B.dim(T_COST - 0.1, END + 1, 0.55);
K.casualties({ flagA: "us", headA: "82ND AIRBORNE", flagB: "ger", headB: "GERMAN", rows: [["killed", "~60", "?"], ["wounded", "500+", "?"]], t: T_COST + 0.2, until: T_LESSON - 0.3, top: 300 });
B.caption("6 – 9 JUNE · 500+ WOUNDED, CAPTURED OR MISSING", T_COST + 1.0, T_WEST - 0.2, "r");
B.caption("THE ROAD WEST IS OPEN · PENINSULA CUT ON 18 JUNE", T_WEST, T_LESSON - 0.3, "carth r");
B.dateBox(T_LESSON - 0.3);
GG.method(2, T_LESSON, END + 1, [T_LESSON + 0.2, T_LESSON + 1.0]);
K.raiseTerritory();
B.finish();
