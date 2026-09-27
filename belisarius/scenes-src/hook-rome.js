// Cold open: Rome at night, March 537. Romans = blue ("carth"), Goths = red ("rome"). Shared geometry: RomeKit (lib/battle.js).
const B = Battle();
const R = RomeKit(B);
const { P, at } = B;
const END = B.T.duration;
const HAS = { vitiges: false };
const G = R.G;

const T_SUR = at("hook-rome", "surrounded"), T_KING = at("hook-rome", "king of"), T_150 = at("hook-rome", "a hundred and fifty");
const T_MOD = at("hook-rome", "Modern"), T_12 = at("hook-rome", "twelve miles"), T_5K = at("hook-rome", "five thousand soldiers");
const S2 = P("hook-rome-2"), T_CUT = at("hook-rome-2", "cut the"), T_BUILD = at("hook-rome-2", "They build"), T_RULE = at("hook-rome-2", "By every");

// ---------- camera: night push, pull out as the camps ring the city, slide along the walls ----------
B.camera([
  [0, 1400, 640, 1.0],
  [4.2, 1450, 780, 0.94],
  [12.5, 1509, 771, 0.7],
  [S2, 1509, 771, 0.7],
  [S2 + 2.2, 2170, 930, 1.35],
  [S2 + 4.6, 2170, 960, 1.38],
  [S2 + 7.6, 1660, 330, 1.6],
  [S2 + 10.2, 1620, 380, 1.45],
  [END, 1480, 780, 0.76],
]);

// ---------- night Rome ----------
R.night(0.52);
R.tiber({ night: true });
R.walls({ night: true, t: 0.8, dur: 4.2, pulse: 8 });
R.gates(3.6, { night: true, stagger: 0.07 });
B.showDate(0.2);
B.date("MARCH 537 AD", 0.4);
B.dateBox(S2 + 0.5, null);
B.label("ROME", 1480, 760, { cls: "country", size: 96, t: 2.2, until: T_5K - 0.6 });
B.label("TIBER", 1236, 1005, { cls: "river", size: 40, t: 2.8, rot: -72, anchor: [-50, -50] });
B.label("AURELIAN WALLS · 12 MILES", 1480, 1245, { cls: "tg", size: 40, t: T_12, until: S2 + 1.0, anchor: [-50, -50] });

// ---------- the Gothic camps close the ring ----------
const order = [0, 1, 2, 3, 4, 5, 6];
order.forEach((k, i) => R.camp(G.camps[k][0], G.camps[k][1], T_SUR + 0.3 + i * 0.55, { night: true }));
// war bands around the camps
if (HAS.vitiges) {
  B.portraitStake({ img: "assets/media/vitiges.png", flag: R.flag("#c4121f"), name: "VITIGES", x: 2400, y: 470, size: 1.6, t: T_KING, until: T_MOD + 3.5 });
} else {
  R.scale(B.plaque({ side: "rome", name: "VITIGES", role: "King of the Ostrogoths", x: 2330, y: 470, t: T_KING, until: T_MOD + 3.5 }), 1.5);
}

// ---------- counters ----------
const red = R.counter({ side: "red", title: "GOTHS", big: "150,000?", sub: "Procopius, eyewitness", left: 40, width: 340, top: 470, t: T_150 + 0.2, until: S2 + 0.4 });
R.counterRow(red, "20,000–30,000 <span>(modern)</span>", T_MOD + 0.6);
R.counter({ side: "blue", title: "ROMANS", big: "5,000", left: 40, width: 340, top: 745, t: T_5K, until: S2 + 0.4 });
const inside = ["FLAMINIAN", "SALARIAN", "TIBURTINE", "PRAENESTINE", "APPIAN", "OSTIAN", "AURELIAN"];
const inset = { FLAMINIAN: [1150, 300], SALARIAN: [1630, 270], TIBURTINE: [1960, 590], PRAENESTINE: [1975, 860], APPIAN: [1680, 1360], OSTIAN: [1250, 1280], AURELIAN: [835, 1080] };
inside.forEach((k, i) => B.unit({ id: "bl" + i, side: "carth", kind: "inf", x: inset[k][0], y: inset[k][1], w: 46, h: 46, t: T_5K + 0.2 + i * 0.12 }));
B.hideUnits(inside.map((_, i) => "bl" + i), S2 + 0.6);

// ---------- hook-rome-2: aqueducts cut, siege engines ----------
const aqs = [0, 1, 3, 2].map((k, i) => ({ k, g: R.aqueduct(G.aqueducts[k], S2 + 0.4 + i * 0.3, { night: true, dur: 1.6 }) }));
const cutT = [T_CUT + 0.9, T_CUT + 1.5, T_CUT + 2.1, S2 + 6.3];
aqs.forEach(({ k, g }, i) => {
  R.cutX(G.cuts[k][0], G.cuts[k][1], cutT[i], 1.3);
  B.tl.to(g.water, { stroke: "#77746c", opacity: 0.4, duration: 0.8 }, cutT[i] + 0.2);
});
B.caption("AQUEDUCTS CUT", T_CUT + 1.0, T_BUILD + 0.8, "rome");
[[1570, 105], [1655, 95], [1745, 140]].forEach(([x, y], i) => R.tower(x, y, T_BUILD + 0.9 + i * 0.3, 1.25));
B.caption("SIEGE TOWERS · RAMS · LADDERS", T_BUILD + 1.1, T_RULE - 0.1, "rome");
B.caption("ROME SHOULD FALL WITHIN WEEKS", T_RULE + 0.2, END - 0.3, "rome");
