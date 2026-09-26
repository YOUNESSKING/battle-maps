// Move 2 opener: the siege of Chattanooga. Confederates hold Lookout Mountain and Missionary Ridge,
// the river and roads are closed, one mountain track feeds the starving garrison.
// Basemap: chatt.json (zoom 13, origin_world_px [550285, 829938]).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

const G = (lat, lon) => {
  const n = 256 * 2 ** 13, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 550285).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 829938).toFixed(1)];
};

// ---------- geography ----------
const CHATT = G(35.046, -85.310), LOOKOUT = G(35.010, -85.344), ORCHARD = G(35.040, -85.276);
const RIDGE_N = G(35.075, -85.238), RIDGE_S = G(34.985, -85.286), BRAGGHQ = G(35.028, -85.255);
const BROWN = G(35.050, -85.350), MOCCASIN = G(35.025, -85.33);
// short Tennessee River trace around Moccasin Bend
const RIVER = [[1965.0, 27.8], [1732.0, 170.2], [1499.0, 312.5], [1266.0, 526.0], [1091.2, 739.4],
  [974.7, 597.1], [1091.2, 383.7], [1382.5, 383.7], [1615.5, 312.5]];

const R0 = P("ridge-1");
const T_SIEGE = at("ridge-1", "under siege in Chattanooga");
const T_GUNS = at("ridge-1", "close the river and the roads");
const T_TRACK = at("ridge-1", "sixty miles long");
const T_STARVE = at("ridge-1", "starve to death");
const T_CRACKERS = at("ridge-1", "a few crackers a day");

// ---------- camera ----------
B.camera([
  [R0, CHATT[0], CHATT[1] + 40, 1.1],
  [T_SIEGE, CHATT[0] - 20, CHATT[1] + 20, 1.25],
  [T_GUNS, (LOOKOUT[0] + RIDGE_N[0]) / 2, (LOOKOUT[1] + RIDGE_N[1]) / 2 + 20, 0.78],
  [T_TRACK, LOOKOUT[0] + 60, LOOKOUT[1] + 40, 0.95],
  [T_STARVE, CHATT[0], CHATT[1] + 60, 0.85],
  [END, CHATT[0] - 10, CHATT[1] + 30, 0.85],
]);

B.river(RIVER, 20);
B.label("TENNESSEE RIVER", 1560, 220, { cls: "river", size: 20, rot: -25, t: 0.4 });
B.city("CHATTANOOGA", ...CHATT, { size: 24, r: 7, t: R0 + 0.3, dy: -12 });
B.label("LOOKOUT MOUNTAIN", LOOKOUT[0], LOOKOUT[1] - 30, { cls: "tg", size: 20, t: T_GUNS - 0.4, anchor: [-50, -50] });
B.label("MISSIONARY RIDGE", (RIDGE_N[0] + RIDGE_S[0]) / 2, (RIDGE_N[1] + RIDGE_S[1]) / 2, { cls: "tg", size: 20, t: T_GUNS - 0.2, rot: -66, anchor: [-50, -50] });

// ---------- title ----------
B.title("MOVE 2", "MISSIONARY RIDGE", "November 1863", R0 + 0.2, T_SIEGE);
B.showDate(R0 + 0.3);
B.date("OCTOBER 1863", R0 + 0.4);

// ---------- Confederate lines: Lookout Mountain and the ridge crest ----------
B.front({ pts: [[LOOKOUT[0] - 40, LOOKOUT[1] - 90], [LOOKOUT[0] + 20, LOOKOUT[1] - 10], [LOOKOUT[0] + 60, LOOKOUT[1] + 90]], color: "var(--rome)", width: 10, t: T_SIEGE + 0.2, dur: 1.4 });
B.front({ pts: [[RIDGE_S[0] - 10, RIDGE_S[1] + 20], [BRAGGHQ[0], BRAGGHQ[1]], [RIDGE_N[0] + 10, RIDGE_N[1] - 20]], color: "var(--rome)", width: 10, t: T_SIEGE + 0.5, dur: 1.6 });

// ---------- blue pocket around the town (encircled) ----------
const ring = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
const rc = CHATT;
Object.entries({ cx: rc[0], cy: rc[1] + 20, rx: 260, ry: 170, fill: "none", stroke: "var(--carth)", "stroke-width": 8, "stroke-dasharray": "20 12" }).forEach(([k, v]) => ring.setAttribute(k, v));
document.getElementById("overlay").appendChild(ring);
gsap.set(ring, { autoAlpha: 0, scale: 1.2, transformOrigin: `${rc[0]}px ${rc[1] + 20}px` });
B.tl.to(ring, { autoAlpha: 0.9, scale: 1, duration: 1.4, ease: "power2.out" }, T_SIEGE + 0.8);
B.caption("THE ARMY OF THE CUMBERLAND, UNDER SIEGE", T_SIEGE, T_GUNS - 0.2, "carth");

// ---------- red X on the supply roads ----------
const xmark = (x, y, s, t) => {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.innerHTML = `<line x1="${x - s}" y1="${y - s}" x2="${x + s}" y2="${y + s}" stroke="var(--rome)" stroke-width="7" stroke-linecap="round"/>
    <line x1="${x - s}" y1="${y + s}" x2="${x + s}" y2="${y - s}" stroke="var(--rome)" stroke-width="7" stroke-linecap="round"/>`;
  document.getElementById("overlay").appendChild(g);
  gsap.set(g, { autoAlpha: 0, scale: 0.3, transformOrigin: `${x}px ${y}px` });
  B.tl.to(g, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, t);
  return g;
};
B.line([[LOOKOUT[0] + 30, LOOKOUT[1] + 60], [BROWN[0] + 20, BROWN[1] + 10], [CHATT[0] - 200, CHATT[1] + 40]], { width: 6, dash: "12 8", t: T_GUNS, dur: 1.6, until: END, color: "#e9dcb8" });
xmark(BROWN[0] + 40, BROWN[1] + 30, 20, T_GUNS + 0.8);
xmark(LOOKOUT[0] + 90, LOOKOUT[1] + 20, 20, T_GUNS + 1.1);
B.caption("CONFEDERATE GUNS CLOSE THE RIVER AND THE ROADS", T_GUNS, T_TRACK - 0.2, "rome");

// ---------- the single mountain supply track (dashed, sixty miles) ----------
B.line([[CHATT[0] - 40, CHATT[1] + 100], [900, 1500], [200, 1600]], { width: 6, dash: "10 8", t: T_TRACK - 0.3, dur: 1.8, until: T_STARVE, color: "#e9dcb8" });
B.caption("ONE MOUNTAIN TRACK · 60 MILES LONG", T_TRACK, T_STARVE - 0.1, "carth");
B.caption("HORSES AND MULES STARVE TO DEATH", T_STARVE, T_CRACKERS - 0.1, "rome");
B.caption("MEN DOWN TO A FEW CRACKERS A DAY", T_CRACKERS, END, "rome");

B.finish();
