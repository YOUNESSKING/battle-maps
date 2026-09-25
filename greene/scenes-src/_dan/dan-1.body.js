// ===== MOVE 1 · THE RACE TO THE DAN: paragraphs dan-1 .. dan-5 =====
const D1 = P("dan-1"), D2 = P("dan-2"), D3 = P("dan-3"), D4 = P("dan-4"), D5 = P("dan-5");
const T_SPLIT = at("dan-1", "he has split"), T_COW = at("dan-1", "the Cowpens"), T_WIN = at("dan-1", "Morgan wins"), T_DESTROY = at("dan-1", "and destroys");
const T_HUNT = at("dan-2", "hunt down"), T_RAM = at("dan-2", "Ramsour"), T_BURN = at("dan-2", "he burns"), T_TENTS = at("dan-2", "Tents"), T_2500 = at("dan-2", "Around two");
const T_BELIEVE = at("dan-3", "Cornwallis believed"), T_CAT = at("dan-3", "the Catawba"), T_YAD = at("dan-3", "the Yadkin"), T_DAN = at("dan-3", "and the Dan");
const T_CAUGHT = at("dan-3", "Somewhere");
const T_SURVEY = at("dan-4", "he had sent"), T_EVERY = at("dan-4", "find every boat"), T_GATHER = at("dan-4", "He ordered"), T_ANVIL = at("dan-4", "To Cornwallis"), T_SHIELD = at("dan-4", "To Greene");
const T_CROSS = at("dan-5", "Morgan's men"), T_YADB = at("dan-5", "the Yadkin by boat"), T_RAIN = at("dan-5", "the rain kept"), T_VAN = at("dan-5", "When the British"), T_RISEN = at("dan-5", "the river had risen"), T_CANNON = at("dan-5", "Cornwallis could only");

// ---------- camera ----------
B.camera([
  [0, 1430, 880, 0.9],
  [T_SPLIT - 1.5, 1400, 960, 1.0],
  [T_COW - 1.6, 1330, 1050, 1.05],
  [T_COW + 1.2, 1010, 1130, 1.7],
  [T_DESTROY + 4, 990, 1130, 1.8],
  [D2 - 0.2, 990, 1130, 1.8],
  [D2 + 2.4, 1170, 1090, 1.3],
  [T_RAM - 0.6, 1150, 1030, 1.4],
  [T_BURN + 0.8, 1110, 945, 2.7],
  [T_2500 - 0.4, 1105, 945, 2.9],
  [T_2500 + 2.0, 1100, 960, 2.2],
  [D3, 1100, 960, 2.2],
  [T_BELIEVE + 3.2, 1430, 780, 1.0],
  [T_CAUGHT, 1440, 770, 1.03],
  [D4 + 0.2, 1480, 700, 1.08],
  [D4 + 3.0, 1880, 440, 2.3],
  [T_GATHER, 1900, 430, 2.4],
  [D5 - 0.4, 1920, 420, 2.5],
  [D5 + 2.4, 1310, 880, 1.9],
  [T_VAN, 1330, 870, 2.0],
  [END, 1350, 860, 2.15],
]);

// ---------- base ----------
drawBase({ t: 0, statesT: 6.0, statesUntil: D4 + 0.8 });
B.tl.to(RP.states, { autoAlpha: 0, duration: 0.5 }, T_COW - 0.6);
B.tl.to(RP.states, { autoAlpha: 1, duration: 0.6 }, D3 + 1.5);
B.title("MOVE 1", "THE RACE TO THE DAN", "JANUARY – FEBRUARY 1781", 0.3, 5.9);
B.showDate(0.4);
B.date("JANUARY 1781", 0.6, T_WIN - 0.2);
B.date("17 JANUARY 1781", T_WIN, D2 + 0.4, 36);
B.date("LATE JANUARY 1781", D2 + 0.6, D4 + 2.0, 34);
B.date("WEEKS EARLIER", D4 + 2.2, D5, 36);
B.date("EARLY FEBRUARY 1781", D5 + 0.2, null, 32);

const smallTag = (id, px) => { const tg = B.units[id].el.querySelector(".tag"); if (tg) tg.style.fontSize = px + "px"; };

// ---------- dan-1: Greene splits, Cowpens ----------
B.city("CHARLOTTE", ...PL.charlotte, { size: 24, r: 7, t: 6.0, until: T_SPLIT + 3.5 });
B.unit({ id: "grn", side: "carth", kind: "inf", x: PL.charlotte[0], y: PL.charlotte[1] - 34, w: 46, h: 30, label: "GREENE", t: 6.2 });
B.unit({ id: "mor", side: "carth", kind: "light", x: PL.charlotte[0], y: PL.charlotte[1] - 34, w: 40, h: 26, label: "MORGAN" });
B.unit({ id: "brit", side: "rome", kind: "inf", x: PL.winnsboro[0], y: PL.winnsboro[1], w: 48, h: 30, label: "CORNWALLIS", t: at("dan-1", "Facing a stronger") });
B.show("mor", T_SPLIT);
B.move("grn", T_SPLIT + 0.3, 2.6, PL.cheraw[0] - 20, PL.cheraw[1] - 62);
B.move("mor", T_SPLIT + 0.3, 2.8, 975, 1175);
B.arrow({ side: "carth", pts: [[1262, 1060], [1400, 1140], [1520, 1190], [1560, 1205]], width: 12, t: T_SPLIT + 0.1, dur: 2.4, until: T_COW - 0.5 });
B.arrow({ side: "carth", pts: [[1215, 1040], [1120, 1100], [1010, 1160]], width: 12, t: T_SPLIT + 0.3, dur: 2.0, until: T_COW + 0.8 });
B.city("CHERAW", ...PL.cheraw, { size: 24, r: 7, t: T_SPLIT + 2.2, until: T_COW - 0.5 });
person("greene", { name: "GREENE", role: "Southern Army", side: "carth", x: PL.cheraw[0] + 210, y: PL.cheraw[1] + 60, size: 0.75, t: T_SPLIT + 2.5, until: T_COW - 0.6 });
// Tarleton's legion rides in, and is destroyed at Cowpens
B.unit({ id: "tarl", side: "rome", kind: "cav", x: 800, y: 1330, w: 42, h: 26, label: "TARLETON", t: T_COW - 0.2 });
B.move("tarl", T_COW + 0.2, 2.4, 868, 1178);
B.move("mor", T_COW, 1.2, 978, 1068);
B.city("COWPENS", ...PL.cowpens, { size: 26, r: 7, t: T_COW + 0.3, left: true, dy: 0, until: D2 + 3 });
burst(912, 1128, T_WIN, 32, D2 + 2.0);
puffs(915, 1125, T_WIN - 0.6, 5, 28);
B.grey(["tarl"], T_DESTROY, 0.8);
B.move("tarl", T_DESTROY + 0.6, 2.4, 790, 1330, "power2.in");
B.hideUnits(["tarl"], T_DESTROY + 2.6, 0.6);
B.caption("COWPENS · TARLETON ROUTED", T_DESTROY + 0.2, D2 - 0.1, "carth");

// ---------- dan-2: Cornwallis burns his baggage ----------
person("cornwallis", { name: "CORNWALLIS", role: "British commander", side: "rome", x: PL.winnsboro[0] - 420, y: PL.winnsboro[1] - 10, size: 0.8, t: D2 + 0.3, until: T_RAM - 0.4 });
B.arrow({ side: "rome", pts: GL([[34.46, -81.1], [34.85, -81.38], [35.2, -81.42], [35.4, -81.3]]), width: 13, t: T_HUNT, dur: 2.6, until: T_RAM + 0.6 });
B.move("brit", T_HUNT + 0.4, 3.6, 1050, 985);
B.move("mor", T_HUNT + 0.6, 3.4, 1245, 848);
B.arrow({ side: "carth", pts: [[990, 1040], [1080, 960], [1170, 880], [1225, 855]], width: 11, t: T_HUNT + 0.6, dur: 2.4, until: T_RAM + 0.6 });
B.city("RAMSOUR'S MILL", ...PL.ramsour, { size: 20, r: 6, t: T_RAM - 0.3, left: true, dy: -18, until: D3 + 3.2 });
B.tl.to(B.units.brit.el.querySelector(".tag"), { fontSize: 14, duration: 0.8 }, T_RAM);
wagonsOnFire(PL.ramsour[0] + 30, PL.ramsour[1] + 6, T_BURN - 0.2, D3 + 2.4, 6);
B.caption("BAGGAGE, TENTS, RUM BURNED", T_TENTS, T_2500 - 0.3, "rome");
B.caption("~2,500 BRITISH REGULARS · STRIPPED DOWN TO RUN", T_2500 + 0.2, D3 - 0.1, "rome");
B.tl.to(B.units.brit.el.querySelector(".tag"), { fontSize: 20, duration: 0.8 }, D3 + 0.5);

// ---------- dan-3: trap them against the rivers ----------
person("cornwallis", { name: "CORNWALLIS", role: "British commander", side: "rome", x: 880, y: 1000, size: 0.8, t: T_BELIEVE + 1.6, until: D4 + 0.4 });
B.bubble("TRAP THEM AGAINST THE RIVERS", 560, 668, T_BELIEVE + 2.6, T_CAT - 0.6);
pulseRiver("catawba", T_CAT);
pulseRiver("yadkin", T_YAD);
pulseRiver("dan", T_DAN);
B.caption("THREE RIVERS · SWOLLEN WITH WINTER RAIN", at("dan-3", "all swollen") - 0.2, T_CAUGHT + 0.5);
B.arrow({ side: "rome", pts: [[1110, 975], [1320, 905], [1560, 690], [1780, 520], [1880, 455]], width: 16, t: T_CAUGHT + 0.2, dur: 3.2, until: D4 + 1.0 });
B.bubble("?", 1905, 330, at("dan-3", "the British would") + 0.3, D4 + 0.6);

// ---------- dan-4: every boat on the Dan ----------
const g4 = person("greene", { name: "GREENE", role: "Southern Army", side: "carth", x: 2150, y: 580, size: 0.42, t: D4 + 1.2, until: D5 - 0.2 });
if (!HAS.greene_head) gsap.set(g4, { scale: 0.45, transformOrigin: "19px 240px" });
B.label("VIRGINIA", 1760, 300, { cls: "country", size: 30, t: D4 + 2.2, until: D5 + 0.4 });
B.label("NORTH CAROLINA", 1760, 560, { cls: "country", size: 30, t: D4 + 2.4, until: D5 + 0.4 });
B.city("IRWIN'S FERRY", ...PL.irwin, { size: 17, r: 5, left: true, dy: -30, t: T_EVERY - 1.0 });
B.city("BOYD'S FERRY", ...PL.boyd, { size: 17, r: 5, dy: -30, t: T_EVERY - 0.8 });
B.line(RIV.dan.slice(8), { dash: "12 9", width: 3, t: T_SURVEY + 0.3, dur: 3.6, until: T_GATHER + 1.0 });
B.caption("EVERY BOAT ON THE DAN", T_EVERY + 0.4, T_ANVIL - 0.3, "carth");
const iIrw = nearestIdx(RIV.dan, PL.irwin);
const dockX = [1884, 1906, 1928, 1950, 1972, 1994, 2016, 2038];
const dock = dockX.map((x) => { // north-bank berths: river centerline minus 13 px
  const i = nearestIdx(RIV.dan.concat(RIV.roanoke), [x, 385]), q = RIV.dan.concat(RIV.roanoke)[i];
  return [x, q[1] - 13];
});
const startIdx = [[ "dan", 15 ], [ "dan", 22 ], [ "dan", 28 ], [ "dan", 34 ], [ "dan", 40 ], [ "roanoke", 5 ], [ "roanoke", 10 ], [ "roanoke", 14 ]];
startIdx.forEach(([r, i], k) => {
  const s = RIV[r][i], b = boat(s[0], s[1], T_EVERY + 0.3 + k * 0.18, { w: 24 });
  let path;
  const tgt = dock[k];
  if (r === "dan") {
    const j = nearestIdx(RIV.dan, [tgt[0], 386]);
    path = RIV.dan.slice(i + 1, j + 1);
  } else {
    const j = nearestIdx(RIV.roanoke, [tgt[0], 390]);
    path = RIV.roanoke.slice(Math.min(j, i), i).reverse();
    if (!path.length) path = [];
  }
  path.push(tgt);
  boatTo(b, T_GATHER + 0.2 + (k % 4) * 0.25, 3.0 + (k % 3) * 0.4, path);
});
B.caption("TO CORNWALLIS: AN ANVIL", T_ANVIL, T_SHIELD - 0.2, "rome");
B.caption("TO GREENE: A SHIELD", T_SHIELD, D5 - 0.1, "carth");

// ---------- dan-5: the Yadkin rises ----------
B.city("COWAN'S FORD", ...PL.cowan, { size: 20, r: 6, dy: 22, t: D5 + 1.0, until: END });
B.label("TRADING FORD", 1446, 848, { cls: "tg", size: 20, t: D5 + 1.6, anchor: [0, -50] });
B.tl.to(B.units.mor.el.querySelector(".tag"), { fontSize: 16, duration: 0.6 }, D5);
B.move("mor", T_CROSS + 0.4, 3.2, 1392, 852);
B.arrow({ side: "carth", pts: [[1175, 872], [1250, 846], [1320, 830], [1392, 830], [1440, 806], [1485, 782]], width: 11, t: T_CROSS, dur: 3.8, until: T_VAN + 1.0 });
const ferry = [[1398, 840], [1405, 846], [1392, 832]].map(([x, y], k) => boat(x + 4, y, T_YADB - 0.8 + k * 0.15, { w: 20, rot: -45 }));
ferry.forEach((b, k) => boatTo(b, T_YADB + 0.4 + k * 0.2, 1.6, [[1432 + k * 7, 810 + k * 6]]));
B.move("mor", T_YADB + 0.5, 1.8, 1470, 770);
// British follow: Ramsour's -> Cowan's Ford -> the south bank at Trading Ford
B.move("brit", T_CROSS + 1.2, 3.2, 1190, 985);
B.move("brit", T_VAN - 1.6, 2.4, 1345, 905);
B.arrow({ side: "rome", pts: [[1085, 960], [1150, 975], [1215, 950], [1290, 905], [1350, 872], [1390, 850]], width: 13, t: T_CROSS + 1.2, dur: T_VAN - T_CROSS - 0.6 });
rain(T_RAIN - 0.3, END, 0.85);
B.tl.to(RP.yadkin, { attr: { "stroke-width": 22 }, duration: 2.4, ease: "power1.inOut" }, T_RISEN - 0.4);
B.tl.to(RP.yadkin, { stroke: "#5f8ea6", duration: 2.4 }, T_RISEN - 0.4);
B.caption("THE RIVER RISES · THE BOATS ARE GONE", T_RISEN, T_CANNON - 0.2, "carth");
[0, 1.2, 2.4].forEach((d) => puffs(1372, 868, T_CANNON + d, 3, 14, "#f6c04a"));
