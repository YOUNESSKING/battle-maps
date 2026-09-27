// Move 3 opener: Belisarius takes Sicily, Naples, Rome (536); Vitiges marches south from Ravenna. Romans blue ("carth"), Goths red ("rome").
const B = Battle();
const R = RomeKit(B);
const { P, at } = B;
const END = B.T.duration;
const HAS = { belisarius: true, vitiges: false };

const G = (lat, lon) => { // assets/italy.json: zoom 7, origin 16218,11535
  const n = 256 * 2 ** 7, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 16218).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 11535).toFixed(1)];
};
const ROME = G(41.9, 12.5), NAPLES = G(40.85, 14.27), RAVENNA = G(44.42, 12.2);
const T_SIC = at("rome-1", "took Sicily"), T_NAP = at("rome-1", "stormed Naples"), T_DEC = at("rome-1", "in December"), T_ROME = at("rome-1", "marched into Rome");
const T_KING = at("rome-1", "But the Gothic"), T_GATH = at("rome-1", "gathered"), T_SOUTH = at("rome-1", "marched south"), T_5K = at("rome-1", "Belisarius had"), T_NOT = at("rome-1", "It was not");

B.camera([
  [0, 1420, 800, 0.98],
  [T_ROME, 1400, 760, 1.05],
  [T_KING + 0.5, 1330, 560, 1.1],
  [T_SOUTH + 2.5, 1320, 520, 1.25],
  [END, 1310, 540, 1.32],
]);

B.title("MOVE 3", "THE SIEGE OF ROME", "537–538 AD", 0.1, T_SIC + 0.3);
B.showDate(T_SIC - 0.3);
B.date("536 AD", T_SIC - 0.1, T_DEC);
B.date("DECEMBER 536 AD", T_DEC + 0.1, null, 34);

B.label("TYRRHENIAN SEA", 1060, 870, { cls: "sea", size: 34, t: 0.6 });
B.label("ADRIATIC SEA", 1560, 520, { cls: "sea", size: 30, t: 0.8, rot: 38, anchor: [-50, -50] });
B.label("SICILY", 1450, 1150, { cls: "country", size: 40, t: T_SIC - 0.4 });

// ---------- Belisarius: Sicily -> Naples -> Rome ----------
B.arrow({ side: "carth", pts: [[1470, 1140], [1575, 1080], [1640, 955], [1580, 850], [1492, 790]], width: 20, t: T_SIC + 0.1, dur: 2.0 });
B.city("NAPLES", ...NAPLES, { size: 30, t: T_NAP, dy: 18 });
B.label("STORMED", NAPLES[0] + 22, NAPLES[1] + 48, { cls: "tg", size: 22, t: T_NAP + 0.8 });
B.arrow({ side: "carth", pts: [[1462, 758], [1400, 705], [1330, 660]], width: 20, t: T_ROME - 1.2, dur: 1.4 });
B.city("ROME", ...ROME, { size: 36, dy: 14, t: T_ROME - 0.6 });
if (HAS.belisarius) {
  const st = B.portraitStake({ img: "assets/media/belisarius.png", flag: R.flag("#1f4fc4"), name: "BELISARIUS", x: ROME[0] - 55, y: ROME[1] + 70, size: 0.72, t: T_ROME + 0.2 });
  Object.assign(st.querySelector(".face img").style, { width: "180%", height: "180%", maxWidth: "none", marginLeft: "-18%", marginTop: "-49%", objectFit: "cover" });
} else {
  B.plaque({ side: "carth", name: "BELISARIUS", x: ROME[0] + 60, y: ROME[1], t: T_ROME + 0.2 });
}

// ---------- the Ostrogothic kingdom and Vitiges ----------
B.image("assets/italy_goths.png", 0, 0, 2880, 1620, { t: T_KING - 0.3, dur: 1.4 });
B.label("OSTROGOTHIC KINGDOM", 1010, 300, { cls: "country", size: 42, t: T_KING + 0.3, anchor: [-50, -50] });
B.city("RAVENNA", ...RAVENNA, { size: 30, left: true, t: T_KING + 0.5 });
B.label("CAPITAL", RAVENNA[0] - 18, RAVENNA[1] + 26, { cls: "tg", size: 20, t: T_KING + 0.9, anchor: [-100, 0] });
if (HAS.vitiges) {
  B.portraitStake({ img: "assets/media/vitiges.png", flag: R.flag("#c4121f"), name: "VITIGES", x: RAVENNA[0] + 90, y: RAVENNA[1] - 10, size: 0.72, t: T_KING + 1.0 });
} else {
  R.scale(B.plaque({ side: "rome", name: "VITIGES", role: "King of the Goths", x: RAVENNA[0] + 40, y: RAVENNA[1] + 20, t: T_KING + 1.0 }), 0.9);
}
// Gothic host gathers, then marches on Rome
[[1150, 250], [1215, 300], [1300, 395], [1245, 360]].forEach(([x, y], i) => B.unit({ id: "g" + i, side: "rome", kind: "inf", x, y, w: 34, h: 34, t: T_GATH + i * 0.2 }));
B.arrow({ side: "rome", pts: [[1280, 370], [1330, 425], [1343, 488]], width: 34, t: T_SOUTH, dur: 2.2 });
[[1235, 470], [1420, 505], [1425, 560], [1480, 530]].forEach(([x, y], i) => B.move("g" + i, T_SOUTH + 0.3 + i * 0.15, 2.6, x, y));

// ---------- the odds ----------
R.counter({ side: "blue", title: "ROMANS", big: "5,000", t: T_5K + 0.2 });
B.caption("TOO FEW TO FIGHT IN THE OPEN", T_NOT + 0.2, END - 0.2, "carth");
