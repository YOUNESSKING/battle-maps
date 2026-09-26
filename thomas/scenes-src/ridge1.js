// Move 2 opener: the siege of Chattanooga (ridge-1), then Thomas takes command and opens the Cracker Line
// through Brown's Ferry (ridge-1b, a map instead of an archive slot). Basemap: chatt.json (zoom 13, origin [550285, 829938]).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

const G = (lat, lon) => {
  const n = 256 * 2 ** 13, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 550285).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 829938).toFixed(1)];
};
const U = (o) => { // unit block with readable tag
  const el = B.unit(o);
  const tg = el.querySelector(".tag");
  if (tg) Object.assign(tg.style, { fontSize: (o.fs || 16) + "px", padding: "0 5px", marginTop: "3px" });
  return el;
};

// ---------- geography (river = assets/chatt_water.png traced from the elevation data) ----------
const CHATT = G(35.046, -85.310), LOOKOUT = G(35.010, -85.344), BROWN = G(35.050, -85.350);
const KELLEY = G(35.017, -85.43), WAUH = G(35.00, -85.38);
const RIDGE_N = G(35.075, -85.238), RIDGE_S = G(34.985, -85.286);
const FLAG_US = "assets/media/us_flag_35star.png";

const R0 = P("ridge-1"), R1 = P("ridge-1b");
const T_SIEGE = at("ridge-1", "under siege in Chattanooga");
const T_GUNS = at("ridge-1", "close the river and the roads");
const T_TRACK = at("ridge-1", "sixty miles long");
const T_STARVE = at("ridge-1", "starve to death");
const T_CRACKERS = at("ridge-1", "a few crackers a day");
const T_REMOVED = at("ridge-1b", "Rosecrans was removed");
const T_THOMAS = at("ridge-1b", "Thomas was given command");
const T_GRANT = at("ridge-1b", "Ulysses Grant");
const T_COSTS = at("ridge-1b", "at all costs");
const T_REPLY = at("ridge-1b", "we will hold the town");
const T_MORE = at("ridge-1b", "He did more than that");
const T_OP = at("ridge-1b", "daring river operation");
const T_NEW = at("ridge-1b", "opened a new supply line");
const T_CRACK = at("ridge-1b", "the Cracker Line");

// ---------- camera ----------
B.camera([
  [R0, CHATT[0] - 40, CHATT[1] + 120, 1.35],
  [T_SIEGE, CHATT[0] - 20, CHATT[1] + 110, 1.5],
  [T_GUNS, 1380, 560, 1.0],
  [T_TRACK, 1150, 420, 1.1],
  [T_STARVE, CHATT[0] - 60, CHATT[1] + 120, 1.3],
  [R1, CHATT[0] - 40, CHATT[1] + 90, 1.55],
  [T_GRANT + 0.5, CHATT[0], CHATT[1] + 80, 1.6],
  [T_MORE, 1150, 520, 1.3],
  [T_OP + 3.0, 1110, 500, 1.55],
  [T_NEW + 0.5, 900, 560, 1.05],
  [END, 930, 560, 1.1],
]);

B.image("assets/chatt_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.label("TENNESSEE RIVER", 1390, 250, { cls: "river", size: 24, rot: -28, t: 0.4 });
B.city("CHATTANOOGA", ...CHATT, { size: 28, r: 8, t: R0 + 0.3, dy: -14 });
B.label("LOOKOUT MOUNTAIN", LOOKOUT[0] - 40, LOOKOUT[1] + 150, { cls: "tg", size: 26, t: T_GUNS - 0.4, rot: -62, anchor: [-50, -50] });
B.label("MISSIONARY RIDGE", 1660, 480, { cls: "tg", size: 26, t: T_GUNS - 0.2, rot: -66, anchor: [-50, -50] });

B.title("MOVE 2", "MISSIONARY RIDGE", "November 1863", R0 + 0.2, T_SIEGE);
B.showDate(R0 + 0.3);
B.date("OCTOBER 1863", R0 + 0.4, R1 + 0.2);
B.date("LATE OCTOBER 1863", R1 + 0.5);

// ---------- Confederate lines: Lookout Mountain and the ridge crest ----------
B.front({ pts: [[LOOKOUT[0] + 20, LOOKOUT[1] - 40], [LOOKOUT[0] - 20, LOOKOUT[1] + 80], [LOOKOUT[0] - 80, LOOKOUT[1] + 230]], color: "var(--rome)", width: 11, t: T_SIEGE + 0.2, dur: 1.4 });
B.front({ pts: [[RIDGE_S[0], RIDGE_S[1]], [1600, 520], [RIDGE_N[0], RIDGE_N[1]]], color: "var(--rome)", width: 11, t: T_SIEGE + 0.5, dur: 1.6 });
[[LOOKOUT[0] + 40, LOOKOUT[1] + 30], [1520, 700], [1600, 520], [1690, 340]].forEach(([x, y], i) =>
  U({ id: "cs" + i, side: "rome", kind: "inf", x: x + 40, y, w: 50, h: 32, t: T_SIEGE + 0.8 + i * 0.15 }));
// the besieged Union line south of the town, river to river
B.front({ pts: [[1215, 470], [1290, 540], [1400, 530], [1460, 440]], color: "var(--carth)", width: 11, t: T_SIEGE + 0.9, dur: 1.2 });
[[1270, 500], [1350, 505], [1420, 470]].forEach(([x, y], i) => U({ id: "us" + i, side: "carth", kind: "inf", x, y, w: 46, h: 30, t: T_SIEGE + 1.2 + i * 0.12 }));
B.caption("THE ARMY OF THE CUMBERLAND, UNDER SIEGE", T_SIEGE, T_GUNS - 0.2, "carth");

// ---------- guns close the river; one mountain track left ----------
const xmark = (x, y, s, t, until) => {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.innerHTML = `<line x1="${x - s}" y1="${y - s}" x2="${x + s}" y2="${y + s}" stroke="var(--rome)" stroke-width="9" stroke-linecap="round"/>
    <line x1="${x - s}" y1="${y + s}" x2="${x + s}" y2="${y - s}" stroke="var(--rome)" stroke-width="9" stroke-linecap="round"/>`;
  document.getElementById("overlay").appendChild(g);
  gsap.set(g, { autoAlpha: 0, scale: 0.3, transformOrigin: `${x}px ${y}px` });
  B.tl.to(g, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, t);
  if (until != null) B.tl.to(g, { autoAlpha: 0, duration: 0.4 }, until);
  return g;
};
xmark(1150, 585, 24, T_GUNS + 0.6, T_OP);      // river under the guns at the tip of Lookout
xmark(WAUH[0] + 40, WAUH[1] - 40, 24, T_GUNS + 0.9, T_NEW); // road through Lookout Valley
B.caption("CONFEDERATE GUNS CLOSE THE RIVER AND THE ROADS", T_GUNS, T_TRACK - 0.2, "rome");
B.line([[1330, 390], [1250, 260], [1060, 130], [760, 20]], { width: 8, dash: "12 8", t: T_TRACK - 0.3, dur: 1.8, until: R1, color: "#f3e6c2" });
B.label("OVER WALDEN'S RIDGE", 1020, 110, { cls: "tg", size: 22, t: T_TRACK, until: R1, rot: 24, anchor: [-50, -50] });
B.caption("ONE MOUNTAIN TRACK · 60 MILES LONG", T_TRACK, T_STARVE - 0.1, "carth");
B.caption("HORSES AND MULES STARVE TO DEATH", T_STARVE, T_CRACKERS - 0.1, "rome");
B.caption("MEN DOWN TO A FEW CRACKERS A DAY", T_CRACKERS, R1 - 0.1, "rome");

// ---------- ridge-1b: change of command ----------
B.portraitStake({ img: "assets/media/rosecrans_head.png", flag: FLAG_US, name: "ROSECRANS", x: CHATT[0] + 210, y: CHATT[1] - 10, size: 0.9, t: R1 - 0.6, until: T_THOMAS - 0.2 });
B.caption("ROSECRANS REMOVED", T_REMOVED + 0.3, T_THOMAS, "rome");
B.portraitStake({ img: "assets/media/thomas_head.png", flag: FLAG_US, name: "THOMAS", x: CHATT[0] + 210, y: CHATT[1] - 10, size: 1.0, t: T_THOMAS });
B.caption("THOMAS TAKES COMMAND OF THE ARMY", T_THOMAS + 0.4, T_GRANT - 0.1, "carth");
B.portraitStake({ img: "assets/media/grant_head.png", flag: FLAG_US, name: "GRANT", x: CHATT[0] - 150, y: CHATT[1] - 10, size: 0.9, t: T_GRANT, until: T_MORE + 1 });
B.caption("GRANT: HOLD CHATTANOOGA AT ALL COSTS", T_COSTS - 1.2, T_REPLY - 0.2, "carth");
B.bubble("WE WILL HOLD THE TOWN TILL WE STARVE", CHATT[0] + 150, CHATT[1] - 170, T_REPLY, T_MORE + 0.6);

// ---------- the Brown's Ferry operation (night of 26-27 Oct) ----------
B.city("BROWN'S FERRY", ...BROWN, { size: 22, r: 7, t: T_MORE, dy: -10, left: true });
B.arrow({ side: "carth", pts: [[1300, 355], [1240, 375], [1212, 450], [1205, 535], [1160, 560], [1115, 520], [1098, 440], [BROWN[0] + 6, BROWN[1] + 14]], width: 12, t: T_OP - 0.3, dur: 3.0, until: T_CRACK + 2 });
B.caption("NIGHT OF 26–27 OCT: PONTOON BOATS DRIFT PAST THE GUNS", T_OP, T_NEW - 0.2, "carth");
U({ id: "bf", side: "carth", kind: "inf", x: BROWN[0] - 60, y: BROWN[1] + 40, w: 48, h: 30, label: "BRIDGEHEAD", fs: 15, t: T_OP + 2.8 });
// Hooker's column up from Bridgeport through Lookout Valley
B.arrow({ side: "carth", pts: [[0, 770], [480, 790], [860, 750], [1000, 610], [BROWN[0] - 30, BROWN[1] + 90]], width: 12, t: T_OP + 2.2, dur: 2.6, until: T_CRACK + 2 });
B.label("HOOKER FROM BRIDGEPORT", 420, 840, { cls: "tg", size: 22, t: T_OP + 3.0, until: END, anchor: [-50, -50] });
B.city("KELLEY'S FERRY", ...KELLEY, { size: 20, r: 6, t: T_NEW - 0.6, dy: 18 });
// the Cracker Line itself
B.line([[0, 610], [KELLEY[0], KELLEY[1]], [880, 540], [BROWN[0], BROWN[1]], [1180, 380], [CHATT[0], CHATT[1]]], { width: 10, dash: "20 10", t: T_NEW, dur: 2.4, color: "#f2c14e" });
B.label("THE CRACKER LINE", 860, 500, { cls: "tg", size: 34, t: T_CRACK - 0.2, anchor: [-50, -50] });
B.caption("SUPPLIES FLOW INTO CHATTANOOGA AGAIN", T_CRACK + 0.8, END, "carth");

B.finish();
