// MOVE 1b: Biazza Ridge, 11 July 1943 (move1-4 .. move1-8). Basemap: biazza (z14). Same look as the approved 1-minute test.
// Sides: US = blue ("carth"), German = red ("rome"). Facts: research/FACT_NOTES.md (Gavin's own account, American Heritage).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);

const G = GG.proj(14, 2263542, 1632249);
// Places: Ponte Dirillo memorial 37.0318 N 14.4044 E (uswarmemorials.org); Acate (Biscari) 37.025 N 14.494 E;
// Biazza Ridge = the scarp on the east side of the Acate (Dirillo) valley (terrain: edge rises 30 m -> 90-150 m), see research/FACT_NOTES.md
const ACATE = G(37.025, 14.494);
const BRIDGE = [1452, 578];                       // Route 115 crosses the Dirillo
const CREST = [[1440, 700], [1560, 690], [1680, 668], [1800, 650], [1910, 612], [2020, 588]];
const FRONT = [[1430, 668], [1560, 654], [1690, 634], [1810, 616], [1920, 580], [2035, 553]];   // where the sides touch
const FRONT2 = [[1430, 548], [1560, 532], [1690, 514], [1810, 494], [1920, 462], [2035, 432]];  // after the counterattack
const ROAD = [[0, 300], [500, 372], [1000, 452], [1300, 520], [BRIDGE[0], BRIDGE[1]], [1560, 662], [1700, 800], [1950, 1030], [2250, 1290], [2560, 1620]];
const RIVER = [[2880, 205], [2700, 250], [2550, 302], [2400, 382], [2250, 470], [2100, 505], [1950, 556], [1800, 606], [1650, 606], [1540, 590], [BRIDGE[0], BRIDGE[1]], [1350, 600], [1200, 640], [1050, 662], [900, 640], [750, 570], [600, 525], [430, 505], [330, 500]];
const SHIPS = [[470, 1070], [650, 1290], [380, 1330]];
const ASSY = [2060, 1060];                        // where Gavin gathered his men (the tomato field, east of the ridge road)
const MASK = "assets/biazza_land.png";

K.grid(G, 36.94, 37.07, 14.27, 14.54, 0.02, 0.2);
// shot: gun fires (quiet), shell arc flies, impact carries the boom
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || 0, sfx: o.sfx });
  const dur = o.dur || 1.0;
  GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 3, h: o.h, color: o.color, impact: false });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 13, puffs: 2 });
};
const tracer = (from, to, t, col) => GG.arc(from[0], from[1], to[0], to[1], t, { h: 0, color: col || "#ff6a5a", dash: "10 7", width: 3, dur: 0.5, impact: false, until: t + 0.9 });


// ---------- terrain features (on from the first frame) ----------
B.river(RIVER, 9);
const roadG = document.createElementNS("http://www.w3.org/2000/svg", "g");
const roadD = ROAD.map((q, i) => (i ? "L" : "M") + q[0] + " " + q[1]).join(" ");
roadG.innerHTML = `<path d="${roadD}" fill="none" stroke="rgba(40,30,16,0.55)" stroke-width="11" stroke-linejoin="round"/><path d="${roadD}" fill="none" stroke="#efe6cf" stroke-width="5" stroke-linejoin="round"/>`;
document.getElementById("overlay").insertBefore(roadG, document.getElementById("overlay").children[1] || null);
GG.lbl("ROUTE 115", 1040, 432, { size: 18, color: "#f3ead2", t: 0.2 });
GG.lbl("◄ TO GELA", 150, 300, { size: 20, t: 0.2 });
GG.lbl("TO VITTORIA ►", 2390, 1430, { size: 20, t: 0.2 });
GG.lbl("PONTE DIRILLO", BRIDGE[0] - 16, BRIDGE[1] - 26, { size: 18, anchor: [-100, -50], t: 0.3 });
GG.lbl("ACATE RIVER", 2330, 400, { size: 17, color: "#d8ecf4", t: 0.3 });
GG.pin(`<div style="width:16px;height:16px;border-radius:50%;background:#fbfaf6;border:3px solid #222"></div>`, ACATE[0], ACATE[1], { t: 0.3 });
GG.lbl("BISCARI", ACATE[0] + 18, ACATE[1], { size: 20, anchor: [0, -50], t: 0.3 });
const ridgeL = GG.lbl("BIAZZA RIDGE", 1770, 735, { size: 26, color: "#fff6d8", t: 0.2 });
B.label("GULF OF GELA", 470, 1180, { cls: "sea", size: 30, t: 0.2 });


const p = (n) => "move1-" + n;
const S = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (n >= 4 ? P(p(n)) : 0));
const T_SAW = S[4], T_SCAT = at(p(4), "His scattered men"), T_ROAD = at(p(4), "But the road"), T_BIAZZA = at(p(4), "Biazza Ridge"), T_BRIDGE = at(p(4), "overlooked the bridge");
const T_WHO = at(p(4), "Whoever held it"), T_OPEN = at(p(4), "If the Germans took it");
const T_DAWN = S[5], T_EVERY = at(p(5), "every man"), T_TOMATO = at(p(5), "tomato field"), T_830 = at(p(5), "half past eight"), T_ENG = at(p(5), "led by a platoon"), T_OFF = at(p(5), "drove the German outposts");
const T_AFT = S[6], T_700 = at(p(6), "more than seven hundred"), T_AWE = at(p(6), "Gavin later wrote"), T_FINGER = at(p(6), "bazookas left holes"), T_PACK = at(p(6), "Two small pack"), T_FALL = at(p(6), "Men were falling"), T_ORDER = at(p(6), "Gavin's order");
const T_ENS = S[7], T_TRIAL = at(p(7), "single trial round"), T_LANDED = at(p(7), "It landed"), T_ALL = at(p(7), "Then he called for everything"), T_CHANGE = at(p(7), "From then on");
const T_SIX = at(p(7), "At six in the evening"), T_WAIT = at(p(7), "Gavin did not wait"), T_EVERYONE = at(p(7), "He threw in everyone"), T_MORT = at(p(7), "captured a dozen"), T_FLED = at(p(7), "the Germans fled");
const T_HELD = S[8], T_COST = at(p(8), "It cost"), T_COLUMN = at(p(8), "that German column"), T_LESSON = at(p(8), "Gavin's first lesson"), T_DSC = at(p(8), "Distinguished Service Cross");

// ---------- camera ----------
B.camera([
  [0, 1700, 760, 1.15],
  [T_ROAD, 1680, 820, 1.05],
  [T_BIAZZA + 0.5, 1740, 680, 1.6],
  [T_WHO + 1.0, 1700, 700, 1.4],
  [T_OPEN + 0.5, 1640, 1000, 0.95],
  [S[5] + 0.3, 1640, 1000, 0.95],
  [T_TOMATO + 0.5, 1820, 880, 1.25],
  [T_830 + 1.5, 1800, 760, 1.35],
  [S[6] - 0.3, 1780, 700, 1.4],
  [S[6] + 2.0, 1760, 620, 1.55],
  [T_PACK, 1740, 640, 1.65],
  [T_ORDER + 1.0, 1730, 650, 1.7],
  [S[7] + 0.2, 1730, 680, 1.6],
  [T_TRIAL + 0.5, 1180, 900, 0.82],          // pull out to the fleet offshore
  [T_CHANGE + 1.0, 1250, 860, 0.84],
  [T_SIX + 0.8, 1820, 760, 1.2],
  [T_FLED + 0.5, 1800, 640, 1.3],
  [S[8], 1780, 660, 1.25],
  [END, 1780, 660, 1.3],
]);

// ---------- move1-4: the key ground ----------
B.showDate(0.2);
B.date("11 JULY 1943", 0.4, T_830 - 0.1, 38);
K.badge({ name: "COL. JAMES M. GAVIN", role: "505TH PARACHUTE INFANTRY", photo: "assets/media/gavin_head.png", flag: "us", side: "carth", corner: "tr", t: 0.3, until: T_ROAD - 0.2 });
B.caption("GAVIN SAW SOMETHING DIFFERENT", 0.4, T_SCAT - 0.2, "carth r");
B.caption("SCATTERED PARATROOPERS CAN'T STOP TANKS IN THE OPEN", T_SCAT, T_ROAD - 0.2, "rome r");
const roadHi = B.highlight(ROAD, T_ROAD + 0.2, null, 26);
B.tl.to(ridgeL, { scale: 1.3, duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_BIAZZA);
K.target(1740, 676, T_BIAZZA, { r: 60, until: T_OPEN + 2 });
B.caption("BIAZZA RIDGE: THE HIGH GROUND ON THE ROAD TO THE BEACHES", T_BIAZZA + 0.2, T_WHO - 0.2, "carth r");
GG.pin(`<div style="width:64px;height:64px;border-radius:50%;border:5px solid #fff3c4;box-shadow:0 0 12px rgba(255,200,80,0.9)"></div>`, BRIDGE[0], BRIDGE[1], { t: T_BRIDGE, until: T_WHO + 1 });
// field of view from the crest
GG.polygon([[1740, 676], [1150, 300], [2350, 250]], "rgba(255,240,190,0.16)", T_WHO, T_OPEN + 1.5, { stroke: "rgba(255,240,190,0.6)", sw: 3, dash: "12 8" });
B.caption("WHOEVER HELD IT COULD SEE, AND SHOOT, FOR MILES", T_WHO, T_OPEN - 0.2, "carth r");
const beachL = GG.lbl("▼ US 45TH DIVISION BEACHES", 1420, 1560, { size: 24, color: "#cfe0ff", t: T_OPEN - 0.4 });
B.tl.to(beachL, { scale: 1.2, duration: 0.45, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_OPEN + 0.4);
B.arrow({ side: "rome", pts: [[2250, 470], [1900, 600], [1650, 900], [1450, 1480]], width: 12, dash: "18 12", t: T_OPEN, dur: 1.4, until: S[5] + 0.5 });
B.caption("LOSE THE RIDGE AND THE WAY TO THE BEACHES IS OPEN", T_OPEN + 0.2, S[5] - 0.2, "rome r");

// ---------- move1-5: dawn, the scramble, 08:30 ----------
GG.dawn(S[5] - 0.5, S[6]);
const STRAYS = [[2300, 1180], [2500, 980], [2150, 1350], [2600, 1250], [1950, 1250], [2400, 860]];
const strays = STRAYS.map(([x, y], i) => GG.chute(x, y, T_EVERY - 0.4 + i * 0.15, { s: 40 }));
const ASSY2 = [2060, 1060];
strays.forEach((c, k) => B.tl.to(c, { x: ASSY2[0] - STRAYS[k][0], y: ASSY2[1] - STRAYS[k][1], duration: 2.4, ease: "power1.inOut" }, T_EVERY + 0.6 + k * 0.1));
strays.forEach((c) => GG.fadeOut(c, T_TOMATO + 0.4, 0.4));
B.caption("PARATROOPERS · ENGINEERS · GUNNERS · LOST INFANTRYMEN", T_EVERY, T_TOMATO - 0.2, "carth r");
B.unit({ id: "force", side: "carth", x: ASSY2[0], y: ASSY2[1], w: 44, h: 30, label: "~250 IN A TOMATO FIELD", t: T_TOMATO });
K.counter("force", { icon: "infantry", flag: "us", size: "II" });
B.date("11 JULY · 08:30", T_830, T_AFT - 0.1, 38);
B.arrow({ side: "carth", pts: [[ASSY2[0] - 20, ASSY2[1] - 30], [1920, 900], [1800, 760]], width: 16, t: T_830 + 0.2, dur: 1.8, until: T_AFT + 1 });
B.move("force", T_ENG, 2.0, 1790, 740);
B.hideUnits(["force"], T_ENG + 2.0, 0.3);
const BLUE = { b1: [1520, 724, "I"], b2: [1650, 704, "I"], b3: [1790, 684, "I"], b4: [1925, 646, "I"] };
Object.entries(BLUE).forEach(([id, [x, y, sz]], i) => { B.unit({ id, side: "carth", x, y, w: 34, h: 24, t: T_ENG + 2.0 + i * 0.12 }); K.counter(id, { icon: "infantry", flag: "us", size: sz }); });
// German outposts on the crest driven off
[["o1", 1700, 660], ["o2", 1850, 640]].forEach(([id, x, y], i) => { B.unit({ id, side: "rome", x, y, w: 26, h: 18, t: T_830 - 0.3 + i * 0.2 }); K.counter(id, { icon: "infantry", flag: "ger", size: "•••" }); });
[[1700, 660], [1850, 640]].forEach(([x, y], i) => { tracer([1800 + i * 40, 760], [x, y + 6], T_ENG + 0.6 + i * 0.5, "#fff3c4"); SFX("mg", T_ENG + 0.6 + i * 0.5); });
B.move("o1", T_OFF, 2.0, 1680, 560); B.move("o2", T_OFF + 0.2, 2.0, 1880, 520);
B.hideUnits(["o1", "o2"], T_OFF + 2.0, 0.6);
B.caption("08:30 · THE RIDGE IS TAKEN", T_OFF, S[6] - 0.2, "carth r");

// ---------- move1-6: the Hermann Göring Division strikes back ----------
B.date("11 JULY · AFTERNOON", T_AFT + 0.1, T_SIX - 0.1, 34);
const GER = { t1: [1610, 600, "tank", ""], t2: [1760, 584, "tank", ""], t3: [1900, 548, "tank", ""], g1: [1470, 612, "infantry", "II"], g2: [2010, 520, "infantry", "II"] };
Object.entries(GER).forEach(([id, [x, y, icon, sz]], i) => {
  B.unit({ id, side: "rome", x: 2330 + (i % 3) * 30, y: 400 + i * 14, w: icon === "tank" ? 38 : 34, h: 24, t: T_AFT + 0.3 + i * 0.2 });
  K.counter(id, sz ? { icon, flag: "ger", size: sz } : { icon, flag: "ger" });
  B.move(id, T_AFT + 0.7 + i * 0.25, 3.2, x, y);
});
B.arrow({ side: "rome", pts: [[2360, 380], [2150, 450], [1950, 520], [1780, 580]], width: 16, t: T_AFT + 0.2, dur: 2.2, until: T_AWE + 1 });
B.arrow({ side: "rome", pts: [[2300, 430], [1900, 520], [1500, 600]], width: 12, t: T_AFT + 0.7, dur: 2.4, until: T_AWE + 1 });
GG.tagbox("700+ INFANTRY", 1470, 558, "#c4121f", { size: 16, t: T_700, until: T_ORDER });
GG.tagbox("TIGERS", 1900, 508, "#c4121f", { size: 16, t: T_700 + 0.3, until: T_ORDER });
B.caption("HERMANN GÖRING DIVISION · 700+ INFANTRY · TIGER TANKS", T_700 - 0.2, T_AWE - 0.2, "rome r");
const front = K.front({ pts: FRONT, to: FRONT2, sideA: "rome", sideB: "carth", t: T_700, dur: 1.6, moveT: T_EVERYONE + 0.3, moveDur: 3.0, until: END + 1 });
K.frontTint({ pts: FRONT, to: FRONT2, side: "carth", dir: 1, depth: 170, alpha: 0.34, mask: MASK, t: T_700 + 0.4, moveT: T_EVERYONE + 0.3, moveDur: 3.0 });
const redTint = K.frontTint({ pts: FRONT, side: "rome", dir: -1, depth: 95, alpha: 0.34, mask: MASK, t: T_700 + 0.4 });
// Tigers + German infantry fire on the ridge (boom + locked shake on every impact)
[[1610, 600, 1650, 708], [1760, 584, 1790, 688], [1900, 548, 1925, 650], [1760, 584, 1660, 712], [1610, 600, 1525, 730], [1900, 548, 1800, 690], [1760, 584, 1700, 716], [1610, 600, 1560, 728]].forEach(([x1, y1, x2, y2], i) => shoot([x1, y1], [x2 + ((i * 13) % 20) - 10, y2], T_700 + 1.6 + i * 1.1, { unit: ["t1", "t2", "t3"][i % 3], dur: 0.5, h: 10, r: 12 }));
[[1470, 612, 1520, 718], [2010, 520, 1930, 640], [1470, 612, 1600, 700], [2010, 520, 1800, 680]].forEach(([x1, y1, x2, y2], i) => { tracer([x1, y1], [x2, y2], T_700 + 2.0 + i * 1.6); SFX("mg", T_700 + 2.0 + i * 1.6); });
B.caption("GAVIN: A TIGER WAS AN AWESOME THING TO ENCOUNTER IN COMBAT", T_AWE, T_FINGER - 0.2, "rome r");
[["b2", 1650, 704, 1610, 600], ["b3", 1790, 684, 1760, 584], ["b4", 1925, 646, 1900, 548]].forEach(([u, x1, y1, x2, y2], i) => {
  const t = T_FINGER + 0.2 + i * 0.7;
  K.gun(x1, y1, t, { dx: 0, dy: -10, unit: u });
  tracer([x1, y1 - 10], [x2, y2 + 10], t + 0.02, "#fff3c4");
  K.impact(x2, y2 + 8, t + 0.5, { r: 9, puffs: 1 });
});
B.caption("BAZOOKAS: HOLES NO BIGGER THAN A LITTLE FINGER", T_FINGER, T_PACK - 0.2, "rome r");
const HOW = { h1: [1585, 752], h2: [1730, 734] };
Object.entries(HOW).forEach(([id, [x, y]], i) => { B.unit({ id, side: "carth", x, y, w: 34, h: 24, t: T_PACK - 0.4 + i * 0.25 }); K.counter(id, { icon: "artillery", flag: "us" }); });
GG.tagbox("2 × 75 MM PACK HOWITZERS", 1660, 800, "#1f4fc4", { size: 16, t: T_PACK + 0.2, until: S[7] });
[["h1", 1610, 600], ["h2", 1760, 584], ["h1", 1620, 606], ["h2", 1900, 548], ["h1", 1610, 600]].forEach(([u, x2, y2], i) => {
  const [x1, y1] = HOW[u];
  shoot([x1, y1 - 8], [x2, y2], T_PACK + 1.2 + i * 0.9, { unit: u, dur: 0.45, h: 6, r: 14, color: "#fff3c4" });
});
B.caption("2 PACK HOWITZERS · FIRING OVER OPEN SIGHTS", T_PACK + 0.2, T_FALL - 0.2, "carth r");
B.caption("MEN FALLING ALL ALONG THE CREST", T_FALL, T_ORDER - 0.2, "rome r");
B.caption("GAVIN: WE STAY ON THIS RIDGE, NO MATTER WHAT", T_ORDER, S[7] - 0.2, "carth r");
K.target(1740, 676, T_ORDER + 0.2, { r: 54, side: "carth", until: S[7] + 0.5 });

// ---------- move1-7: the Navy, the Shermans, the counterattack ----------
GG.pin(`<svg width="40" height="35" viewBox="0 0 46 40" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.8))">
  <rect x="3" y="12" width="40" height="26" rx="4" fill="#2b2a26" stroke="#f3eee2" stroke-width="2.5"/>
  <circle cx="15" cy="25" r="7" fill="none" stroke="#f3eee2" stroke-width="2.5"/><rect x="27" y="19" width="11" height="3" fill="#f3eee2"/><rect x="27" y="26" width="11" height="3" fill="#f3eee2"/>
  <line x1="33" y1="12" x2="41" y2="1" stroke="#f3eee2" stroke-width="2.5" stroke-linecap="round"/></svg>`, 1690, 770, { t: T_ENS + 0.1, pop: true, until: T_SIX });
GG.tagbox("NAVY ENSIGN · RADIO", 1690, 805, "#1f4fc4", { size: 15, t: T_ENS + 0.4, until: T_SIX });
SFX("static", T_ENS + 0.2);
for (let i = 0; i < 3; i++) {
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${1690 - 50}px;top:${770 - 50}px;width:100px;height:100px;border-radius:50%;border:5px solid rgba(255,214,90,0.9);box-shadow:0 0 18px rgba(255,200,60,0.6);`;
  document.getElementById("pins").appendChild(el); GG.hide(el);
  B.tl.fromTo(el, { autoAlpha: 0.95, scale: 0.2 }, { autoAlpha: 0, scale: 7, duration: 2.6, ease: "power1.out", immediateRender: false }, T_ENS + 0.4 + i * 0.7);
}
SHIPS.forEach(([x, y], i) => GG.ship(x, y, { w: 165, t: T_ENS + 1.0 + i * 0.25 }));
GG.lbl("US NAVY", 520, 960, { size: 26, color: "#cfe0ff", t: T_ENS + 1.2, until: T_SIX + 2 });
// one trial round, then the concentration
shoot([SHIPS[0][0] + 40, SHIPS[0][1] - 14], [1765, 590], T_TRIAL + 0.3, { dur: 1.3, width: 5, h: 260, r: 17 });
B.caption("ONE TRIAL ROUND: RIGHT WHERE THE TIGER HAD BEEN", T_LANDED, T_ALL - 0.2, "carth r");
const NTGT = [[1760, 584], [1610, 600], [1900, 548], [1470, 612], [2010, 520], [1760, 590], [1640, 596], [1880, 552], [1500, 600], [1700, 580]];
NTGT.forEach(([x, y], i) => {
  const [sx, sy] = SHIPS[i % 3];
  shoot([sx + 40, sy - 14], [x + ((i * 19) % 24) - 12, y + ((i * 11) % 16) - 8], T_ALL + 0.2 + i * 0.6, { dur: 1.3, width: 5, h: 260, r: 17 });
});
B.caption("THEN EVERYTHING THE FLEET HAD", T_ALL + 0.3, T_CHANGE - 0.2, "carth r");
B.caption("GAVIN: FROM THEN ON THE BATTLE SEEMED TO CHANGE", T_CHANGE, T_SIX - 0.2, "carth r");
B.grey(["t1"], T_ALL + 1.6, 0.8);
B.grey(["g1"], T_ALL + 2.8, 0.8);
B.date("11 JULY · 18:00", T_SIX + 0.1, null, 38);
GG.layer("background: linear-gradient(to left, rgba(255,150,70,0.34), rgba(255,180,120,0.14) 55%, rgba(255,210,160,0.04));", T_SIX, END + 2, { dur: 3.0 });
const SH = { s1: [1700, 760], s2: [1830, 740] };
Object.entries(SH).forEach(([id, [x, y]], i) => {
  B.unit({ id, side: "carth", x: 2140 + i * 40, y: 1200 + i * 30, w: 38, h: 24, label: i ? null : "6 SHERMANS", t: T_SIX + 0.2 + i * 0.25 });
  K.counter(id, { icon: "tank", flag: "us" });
  B.move(id, T_SIX + 0.5 + i * 0.25, 2.6, x, y);
});
B.arrow({ side: "carth", pts: [[2160, 1180], [1990, 1020], [1830, 820]], width: 14, t: T_SIX - 0.4, dur: 1.6, until: T_FLED + 2 });
B.caption("18:00 · SIX SHERMANS ARRIVE", T_SIX + 0.3, T_EVERYONE - 0.2, "carth r");
[["b1", 1500, 600], ["b2", 1640, 580], ["b3", 1790, 560], ["b4", 1930, 520], ["s1", 1700, 610], ["s2", 1850, 580], ["h1", 1585, 740], ["h2", 1730, 720]].forEach(([id, x, y], i) => B.move(id, T_EVERYONE + 0.3 + (i % 4) * 0.15, 3.0, x, y));
[[[1520, 710], [1500, 620], [1480, 540]], [[1790, 680], [1800, 590], [1810, 500]], [[1930, 640], [1960, 550], [1990, 460]]].forEach((pts, i) => B.arrow({ side: "carth", pts, width: 14, t: T_EVERYONE + 0.2 + i * 0.25, dur: 1.4, until: S[8] + 0.5 }));
B.caption("COUNTERATTACK · COOKS, CLERKS, TRUCK DRIVERS", T_EVERYONE, T_MORT - 0.2, "carth r");
B.caption("12 HEAVY MORTARS CAPTURED", T_MORT, T_FLED - 0.2, "carth r");
["t2", "t3", "g2"].forEach((id, i) => { B.move(id, T_EVERYONE + 1.2 + i * 0.2, 3.2, 2330 + i * 40, 380 + i * 20, "power1.in"); });
B.hideUnits(["t2", "t3", "g2"], T_FLED + 1.4, 0.8);
B.hideUnits(["t1", "g1"], T_FLED + 0.8, 0.8);
redTint.forEach((pl) => K.lose(pl, T_EVERYONE + 1.0));
B.arrow({ side: "rome", pts: [[1900, 500], [2100, 440], [2320, 380]], width: 12, dash: "18 12", t: T_FLED - 0.2, dur: 1.0, until: S[8] + 0.5 });
B.caption("THE GERMANS FLED", T_FLED, S[8] - 0.2, "carth r");

// ---------- move1-8: the cost, the lesson ----------
B.dim(T_HELD - 0.1, END + 1, 0.55);
GG.stamp("THE RIDGE HELD", T_HELD + 0.05, T_LESSON - 0.3, { color: "#6f9bff", size: 58, top: 120, rot: -3 });
K.casualties({ flagA: "us", headA: "AMERICAN", flagB: "ger", headB: "GERMAN", rows: [["killed", "~50", "?"], ["wounded", "100+", "?"]], t: T_COST - 0.2, until: T_LESSON - 0.3, top: 330 });
B.caption("THE GERMAN COLUMN NEVER REACHED THE BEACHES", T_COLUMN, T_LESSON - 0.3, "r");
B.dateBox(T_LESSON - 0.3);
GG.method(1, T_LESSON, END + 1, [T_LESSON + 0.6]);
B.caption("DISTINGUISHED SERVICE CROSS", T_DSC - 0.2, END + 1, "carth r");
K.raiseTerritory();
B.finish();
