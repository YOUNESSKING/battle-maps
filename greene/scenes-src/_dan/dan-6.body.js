// ===== MOVE 1 · THE RACE TO THE DAN (II): paragraphs dan-6 .. dan-9 =====
const D6 = P("dan-6"), D7 = P("dan-7"), D8 = P("dan-8"), D9 = P("dan-9");
const T_REUNITE = at("dan-6", "Greene's two wings"), T_WEAK = at("dan-6", "His army was"), T_FORM = at("dan-6", "So he formed"), T_WILL = at("dan-6", "Colonel Otho"),
  T_STAND = at("dan-6", "stand between"), T_WRONG = at("dan-6", "make Cornwallis look");
const T_DANCE = at("dan-7", "Williams danced"), T_UPPER = at("dan-7", "He led Cornwallis"), T_MAIN = at("dan-7", "while Greene's main"), T_SLEPT = at("dan-7", "The men of the light"),
  T_FINAL = at("dan-7", "In the final day"), T_40 = at("dan-7", "they marched forty");
const T_LAST = at("dan-8", "the last of Greene's"), T_NIGHT = at("dan-8", "and that night"), T_MORNING = at("dan-8", "The next morning"), T_VAN = at("dan-8", "the British vanguard"),
  T_HIGH = at("dan-8", "The water was high"), T_LINED = at("dan-8", "the far bank"), T_NOBOAT = at("dan-8", "and there was not");
const T_200 = D9, T_BURNED = at("dan-9", "burned his own"), T_EXH = at("dan-9", "His army was exhausted"), T_BACK = at("dan-9", "He had no choice"), T_NOBATTLE = at("dan-9", "Greene hadn't");

// ---------- camera ----------
B.camera([
  [0, 1560, 930, 1.15],
  [T_REUNITE + 0.6, 1560, 930, 1.15],
  [T_WEAK, 1600, 690, 1.8],
  [T_STAND, 1590, 660, 2.0],
  [D7 - 0.5, 1600, 640, 1.95],
  [D7 + 2.5, 1720, 530, 1.85],
  [T_FINAL, 1760, 500, 1.9],
  [D8 - 0.3, 1850, 450, 2.2],
  [D8 + 2.2, 1935, 385, 2.7],
  [D9 - 0.2, 1930, 390, 2.75],
  [D9 + 3.0, 1500, 700, 1.15],
  [T_BACK, 1520, 690, 1.18],
  [END, 1530, 690, 1.22],
]);

// ---------- base ----------
drawBase({ t: 0, statesUntil: T_WEAK - 0.5 });
B.tl.to(RP.states, { autoAlpha: 1, duration: 0.8 }, D9 + 1.5);
B.showDate(0.1);
B.date("EARLY FEBRUARY 1781", 0.2, D8 - 0.2, 34);
B.date("14 FEBRUARY 1781", D8, T_MORNING - 0.1, 36);
B.date("15 FEBRUARY 1781", T_MORNING, D9 - 0.1, 36);
B.date("FEBRUARY 1781", D9 + 0.1, null, 36);

const tagSize = (id, px, t) => { const tg = B.units[id].el.querySelector(".tag"); if (tg) B.tl.to(tg, { fontSize: px, duration: 0.6 }, t); };
const trail = { brit: [], carth: [] };

// ---------- dan-6: the wings reunite at Guilford ----------
B.unit({ id: "grn", side: "carth", kind: "inf", x: 1574, y: 1215, w: 44, h: 28, label: "GREENE", t: 0.3 });
B.unit({ id: "mor", side: "carth", kind: "light", x: 1470, y: 772, w: 40, h: 26, label: "MORGAN", t: 0.5 });
B.unit({ id: "brit", side: "rome", kind: "inf", x: 1318, y: 915, w: 46, h: 30, label: "CORNWALLIS", t: 0.7 });
B.arrow({ side: "carth", pts: [[1590, 1195], [1640, 1040], [1636, 860], [1615, 690]], width: 12, t: T_REUNITE, dur: 2.6, until: T_WEAK + 0.8 });
B.arrow({ side: "carth", pts: [[1480, 760], [1545, 705], [1588, 668]], width: 12, t: T_REUNITE + 0.3, dur: 2.0, until: T_WEAK + 0.8 });
B.move("grn", T_REUNITE + 0.4, 3.2, 1645, 605);
B.move("mor", T_REUNITE + 0.6, 2.8, 1645, 605);
B.hideUnits(["mor"], T_REUNITE + 3.4, 0.4);
B.city("GUILFORD COURTHOUSE", ...PL.guilford, { size: 17, r: 5, dy: 22, t: T_REUNITE + 1.0, until: D7 + 3.0 });
// the British cross the upper Yadkin (Shallow Ford) and close in from the west
B.arrow({ side: "rome", pts: [[1300, 890], [1312, 780], [1360, 690], [1425, 662]], width: 12, t: T_REUNITE + 0.8, dur: 2.8, until: T_FORM + 0.5 });
B.move("brit", T_REUNITE + 1.0, 3.0, 1440, 662);
B.caption("STILL TOO WEAK TO FIGHT", T_WEAK + 0.2, T_FORM - 0.2, "carth");
// Williams's light corps
B.unit({ id: "wl", side: "carth", kind: "light", x: 1622, y: 612, w: 34, h: 22, label: "WILLIAMS · ~700" });
B.unit({ id: "wc", side: "carth", kind: "cav", x: 1622, y: 612, w: 30, h: 20 });
B.tl.set(B.units.wl.el.querySelector(".tag"), { fontSize: 13 }, 0);
B.show("wl", T_FORM + 0.6); B.show("wc", T_FORM + 0.8);
B.move("wl", T_FORM + 0.8, 1.6, 1650, 722);
B.move("wc", T_FORM + 1.0, 1.6, 1616, 722);
const wPl = person("williams", { name: "O. WILLIAMS", role: "Light corps", side: "carth", x: 1760, y: 835, size: 0.45, t: T_WILL, until: D7 + 2.0 });
if (!HAS.williams_head) gsap.set(wPl, { scale: 0.6, transformOrigin: "19px 240px" });
B.move("wl", T_STAND, 1.8, 1540, 628);
B.move("wc", T_STAND + 0.1, 1.8, 1506, 628);
B.caption("STAND BETWEEN THE ARMIES", T_STAND + 0.2, T_WRONG - 0.1, "carth");
B.caption("MAKE CORNWALLIS LOOK THE WRONG WAY", T_WRONG, D7 - 0.1, "carth");

// ---------- dan-7: the dance toward the upper fords ----------
B.city("DIX'S FERRY", ...PL.dix, { size: 17, r: 5, left: true, dy: -22, t: T_UPPER - 0.4, until: D8 + 3.0 });
B.label("UPPER FORDS", PL.dix[0] + 12, PL.dix[1] + 22, { cls: "tg", size: 13, anchor: [0, -50], t: T_UPPER, until: T_FINAL });
B.city("IRWIN'S FERRY", ...PL.irwin, { size: 15, r: 5, left: true, dy: -30, t: T_MAIN + 0.6, until: D9 + 0.4 });
B.city("BOYD'S FERRY", ...PL.boyd, { size: 15, r: 5, dy: -30, t: T_MAIN + 0.8, until: D9 + 0.4 });
B.label("LOWER FERRIES", 2030, 440, { cls: "tg", size: 13, anchor: [0, -50], t: T_MAIN + 1.2, until: T_FINAL });
// Williams drifts toward the upper fords, the British follow
const wPath = [[1540, 628], [1575, 600], [1622, 572], [1672, 545], [1722, 512]];
const bPath = [[1440, 662], [1480, 634], [1530, 606], [1580, 582], [1632, 556]];
wPath.slice(1).forEach((p, i) => { B.move("wl", T_DANCE + i * 3.6, 3.4, ...p); B.move("wc", T_DANCE + i * 3.6 + 0.2, 3.4, p[0] - 34, p[1] + 2); });
bPath.slice(1).forEach((p, i) => B.move("brit", T_DANCE + 0.8 + i * 3.6, 3.4, ...p));
B.arrow({ side: "rome", pts: [[1440, 648], [1485, 618], [1540, 592], [1600, 566], [1650, 543]], width: 12, t: T_DANCE + 0.6, dur: 14, until: T_FINAL + 1.0 });
for (let i = 0; i < 6; i++) {
  const k = Math.min(i * 0.7, 3.9), a = Math.floor(k), f = k - a, w = wPath[a], w2 = wPath[Math.min(a + 1, 4)];
  puffs(w[0] + (w2[0] - w[0]) * f - 44, w[1] + (w2[1] - w[1]) * f + 22, T_DANCE + 1.0 + i * 2.5, 3, 12);
}
B.caption("ALWAYS SEEN · NEVER CAUGHT", at("dan-7", "always close"), T_UPPER - 0.2, "carth");
// Greene's main army slips away to the lower ferries, unseen
B.line([[1655, 610], [1750, 598], [1860, 545], [1940, 470], [1985, 430]], { dash: "18 12", width: 8, color: "var(--carth)", t: T_MAIN, dur: 6.0, until: D8 + 3.0 });
B.move("grn", T_MAIN + 0.2, 2.0, 1750, 596, "power1.in"); B.move("grn", T_MAIN + 2.2, 2.0, 1860, 543, "none"); B.move("grn", T_MAIN + 4.2, 2.4, 1995, 420, "power1.out");
B.label("UNSEEN", 1880, 600, { cls: "tg", size: 18, anchor: [-50, -50], t: T_MAIN + 1.4, until: T_SLEPT });
B.caption("6 HOURS' SLEEP IN 48", T_SLEPT + 0.2, T_40 - 0.2, "carth");
B.caption("40 MILES IN 24 HOURS", T_40, D8 + 0.4, "carth");
// the final day: Williams breaks east for the ferries
B.move("wl", T_FINAL, 3.2, 1915, 428);
B.move("wc", T_FINAL + 0.1, 3.2, 1880, 430);
B.arrow({ side: "carth", pts: [[1730, 500], [1800, 470], [1860, 445], [1895, 432]], width: 10, t: T_FINAL, dur: 2.6, until: D8 + 2.0 });

// ---------- dan-8: the crossing; NO BOATS ----------
const DAN_N = (x) => { const a = RIV.dan.concat(RIV.roanoke); return a[nearestIdx(a, [x, 385])][1]; };
["grn", "wl", "wc", "brit"].forEach((k) => B.tl.to(B.units[k].el, { scale: 0.62, duration: 0.8 }, D8 - 1.2));
const bx = [1934, 1950, 1966, 1982];
const bts = bx.map((x, k) => boat(x, DAN_N(x) - 11, D8 + 0.2 + k * 0.1, { w: 16 }));
bts.forEach((b, k) => { // shuttle 1: Greene's army at Boyd's
  boatTo(b, T_LAST - 0.6 + k * 0.15, 1.0, [[b.x + 14, DAN_N(b.x + 14) + 11]]);
  boatTo(b, T_LAST + 0.8 + k * 0.15, 1.2, [[b.x - 14, DAN_N(b.x - 14) - 11]]);
});
B.move("grn", T_LAST + 0.7, 1.6, 2002, 296);
const night = document.createElement("div");
night.className = "fx-layer"; night.style.background = "rgba(10,18,40,0.5)";
document.getElementById("fx").appendChild(night);
gsap.set(night, { autoAlpha: 0 });
B.tl.to(night, { autoAlpha: 1, duration: 0.9 }, T_NIGHT);
B.tl.to(night, { autoAlpha: 0, duration: 1.2 }, T_MORNING - 0.6);
bts.forEach((b, k) => { // shuttle 2: Williams at Irwin's, at night
  boatTo(b, T_NIGHT + 0.4 + k * 0.15, 0.9, [[b.x - 10, DAN_N(b.x - 10) + 11]]);
  boatTo(b, T_NIGHT + 1.7 + k * 0.15, 1.1, [[b.x + 10, DAN_N(b.x + 10) - 11]]);
});
B.move("wl", T_NIGHT + 1.5, 1.4, 1912, 296);
B.move("wc", T_NIGHT + 1.6, 1.4, 1878, 298);
B.caption("THE REARGUARD CROSSES AT NIGHT", T_NIGHT + 0.3, T_MORNING - 0.3, "carth");
B.move("brit", T_VAN - 1.2, 2.4, 1872, 448);
B.arrow({ side: "rome", pts: [[1650, 543], [1745, 505], [1830, 460], [1898, 420]], width: 10, t: T_VAN - 1.2, dur: 2.2, until: D9 + 3.0 });
B.tl.to(RP.dan, { attr: { "stroke-width": 15 }, stroke: "#5f8ea6", duration: 1.6 }, T_HIGH);
["grn", "wl", "wc"].forEach((k, i) => B.tl.to(B.units[k].el, { scale: 0.8, duration: 0.3, yoyo: true, repeat: 1 }, T_LINED + i * 0.2));
const lineX = [1850, 2045];
lineX.forEach((x, k) => B.unit({ id: "nb" + k, side: "carth", kind: "inf", x, y: 298, w: 18, h: 12, t: T_LINED + 0.6 + k * 0.2 }));
B.caption("NO BOATS", T_NOBOAT, D9 + 0.2, "rome");
const q = B.bubble("?", 1822, 424, T_NOBOAT + 0.4, D9 + 1.0);
Object.assign(q.style, { fontSize: "16px", padding: "2px 8px", borderWidth: "2px", borderRadius: "10px" });

// ---------- dan-9: 200 miles for nothing ----------
B.hideUnits(["nb0", "nb1", "wc", "wl"], D9 + 0.2, 0.5);
bts.forEach((b) => B.tl.to(b.el, { autoAlpha: 0, duration: 0.5 }, D9 + 0.2));
["grn", "brit"].forEach((k) => B.tl.to(B.units[k].el, { scale: 1.1, duration: 0.8 }, D9 + 0.6));
B.tl.to(RP.dan, { attr: { "stroke-width": 8 }, stroke: "#7fa3b3", duration: 1.6 }, D9 + 0.6);
B.line([[1091, 936], [1200, 954], [1300, 905], [1395, 845], [1340, 700], [1440, 662], [1540, 600], [1650, 543], [1880, 440]], { dash: "20 14", width: 7, color: "var(--rome)", t: D9 + 1.2, dur: 3.6, until: END });
B.caption("~200 MILES", D9 + 1.4, T_EXH - 0.2, "rome");
B.city("RAMSOUR'S MILL", ...PL.ramsour, { size: 18, r: 6, left: true, dy: -16, t: D9 + 1.0, until: T_BACK });
wagonsOnFire(PL.ramsour[0] + 20, PL.ramsour[1] + 6, T_BURNED, T_EXH + 1.2, 4);
B.city("HILLSBOROUGH", ...PL.hillsborough, { size: 22, r: 7, t: T_BACK - 0.6 });
B.arrow({ side: "rome", pts: [[1872, 470], [1900, 560], [1885, 640]], width: 13, t: T_BACK, dur: 2.0 });
B.move("brit", T_BACK + 0.4, 2.2, 1830, 690);
B.caption("EXHAUSTED · FAR FROM SUPPLY · NO TENTS", T_EXH, T_BACK - 0.2, "rome");
B.stat(["~200 MILES CHASED", "0 BATTLES", "NO TENTS · NO FOOD"], T_NOBATTLE, null);
