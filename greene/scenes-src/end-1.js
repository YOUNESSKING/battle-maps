// End 1: Yorktown, October 1781. Americans + French = blue ("carth") / white fleet arrows, British = red ("rome").
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const K = "end-1";

const G = (lat, lon) => { // assets/greene_east.json (zoom 8, origin 17529,24306)
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 17529).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 24306).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));
const PL = { york: G(37.24, -76.51), ny: G(40.71, -74.0), phil: G(39.95, -75.16), wburg: G(37.27, -76.71), elk: G(39.6, -75.9),
  capeH: G(36.93, -76.01), capeC: G(37.12, -75.97) };

const T_WORN = at(K, "worn down"), T_TRAP = at(K, "trapped"), T_WASH = at(K, "George Washington"), T_FLEET = at(K, "a French fleet");
const T_19 = at(K, "On the nineteenth"), T_SURR = at(K, "Lord Cornwallis");

B.camera([
  [0, 1500, 760, 0.86],
  [T_TRAP, 1480, 800, 0.92],
  [T_19 - 0.4, 1470, 850, 0.95],
  [T_19 + 2.8, 1300, 1120, 2.0],
  [END, 1300, 1125, 2.15],
]);

B.showDate(0.2);
B.date("SEPTEMBER 1781", 0.4, T_19 - 0.1);
B.date("OCTOBER 1781", T_19 + 0.2);
B.label("VIRGINIA", ...G(37.75, -78.4), { cls: "country", size: 48, t: 0.8, until: T_19 + 1.5 });
B.label("ATLANTIC OCEAN", ...G(37.6, -72.6), { cls: "sea", size: 44, t: 1.0, until: T_19 + 1.2 });
B.city("NEW YORK", ...PL.ny, { size: 28, left: true, t: 1.2, until: T_19 + 1.2 });
B.city("PHILADELPHIA", ...PL.phil, { size: 26, left: true, t: 1.4, until: T_19 + 1.2 });
B.city("YORKTOWN", ...PL.york, { size: 30, left: true, t: 0.6 });

// Cornwallis's army, worn down in the Carolinas, digs in at Yorktown
B.arrow({ side: "rome", pts: [[1040, 1640], [1090, 1400], [1200, 1230], [1285, 1165]], width: 18, t: 0.6, dur: 2.4, until: T_19 - 0.2 });
B.label("FROM THE CAROLINAS", 1110, 1420, { cls: "tg", size: 26, t: T_WORN - 0.6, until: T_TRAP + 1.2, anchor: [0, -50] });
const RED = [[PL.york[0] + 16, PL.york[1] - 6], [PL.york[0] + 34, PL.york[1] + 8], [PL.york[0] + 20, PL.york[1] + 22]];
RED.forEach(([x, y], i) => B.unit({ id: "r" + i, side: "rome", kind: "inf", x, y, w: 20, h: 20, t: 2.6 + i * 0.15 }));

// Washington and Rochambeau come down from New York
B.arrow({ side: "carth", pts: [[PL.ny[0] - 10, PL.ny[1] + 20], [1600, 470], [PL.elk[0] + 10, PL.elk[1] + 5], [1350, 800], [1290, 1010], [PL.wburg[0] - 8, PL.wburg[1] - 20]], width: 15, t: T_TRAP + 0.4, dur: 2.8, until: T_19 + 1.0 });
B.arrow({ side: "carth", pts: [[PL.ny[0] + 20, PL.ny[1] + 40], [1640, 500], [PL.elk[0] + 50, PL.elk[1] + 30], [1390, 820], [1325, 1000], [PL.wburg[0] + 18, PL.wburg[1] - 30]], width: 11, t: T_TRAP + 0.8, dur: 2.8, until: T_19 + 1.0 });
B.label("WASHINGTON & ROCHAMBEAU", 1480, 700, { cls: "tg", size: 28, t: T_WASH - 0.2, until: T_19 + 0.6, anchor: [0, -50] });
const BLUE = [[PL.york[0] - 14, PL.york[1] + 18], [PL.york[0] + 2, PL.york[1] + 34], [PL.york[0] + 26, PL.york[1] + 44]];
BLUE.forEach(([x, y], i) => B.unit({ id: "b" + i, side: "carth", kind: "inf", x, y, w: 20, h: 20, t: T_WASH + 2.4 + i * 0.15 }));

// the French fleet closes the Chesapeake
B.arrow({ side: "white", pts: [[2350, 1470], [1900, 1330], [1530, 1235]], width: 16, t: T_FLEET - 0.6, dur: 1.8, until: T_19 + 1.0 });
B.arrow({ side: "white", pts: [[2350, 1150], [1900, 1170], [1535, 1195]], width: 16, t: T_FLEET - 0.3, dur: 1.8, until: T_19 + 1.0 });
B.line([[PL.capeC[0] + 4, PL.capeC[1] - 6], [PL.capeH[0] + 4, PL.capeH[1] + 4]], { dash: "10 8", width: 6, color: "var(--white)", t: T_FLEET + 1.2, dur: 0.8, until: T_19 + 1.0 });
B.caption("THE FRENCH FLEET CLOSES THE CHESAPEAKE", T_FLEET + 0.4, T_19 - 0.1, "carth");

// 19 October 1781: surrender
B.caption("19 OCTOBER 1781", T_19 + 0.3, T_SURR - 0.2);
B.grey(["r0", "r1", "r2"], T_SURR + 0.3, 0.8);
B.caption("CORNWALLIS SURRENDERS AT YORKTOWN", T_SURR + 0.2, null, "carth");
B.finish();
