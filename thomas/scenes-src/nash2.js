// Nashville close-up: Thomas builds an army inside the city while Hood's Confederates dig in on
// the hills to the south, five redoubts anchoring the left along the Hillsboro Pike.
// Basemap: nash.json (zoom 14, origin_world_px [1084418, 1644575]).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

const G = (lat, lon) => {
  const n = 256 * 2 ** 14, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 1084418).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 1644575).toFixed(1)];
};
const HAS = { thomas_head: false, hood_head: false, us_flag_35star: false, csa_battle_flag: false };

const STAKE = (o) => {
  if (HAS[o.key]) return B.portraitStake({ img: `assets/media/${o.key}.png`, flag: o.side === "rome" ? (HAS.csa_battle_flag ? "assets/media/csa_battle_flag.png" : "") : (HAS.us_flag_35star ? "assets/media/us_flag_35star.png" : ""), name: o.name, side: o.side, x: o.x, y: o.y, size: o.size || 0.8, t: o.t });
  return B.plaque({ name: o.name, role: o.role, side: o.side, x: o.x, y: o.y + 60, t: o.t });
};

// ---------- geography ----------
const CITY = G(36.163, -86.782), FORT = G(36.143, -86.776);
const RED = [G(36.115, -86.82), G(36.112, -86.825), G(36.108, -86.83), G(36.104, -86.835), G(36.10, -86.84)];
const HILLTOP = G(36.14, -86.80), HILLBOT = G(36.08, -86.85);
const RIVER = [[2023.2, 17.4], [1650.4, 118.5], [1091.2, 306.1], [625.1, 450.3]];

const N3 = P("nash-3");
const T_SCRATCH = at("nash-3", "almost from scratch");
const T_MISSOURI = at("nash-3", "corps arrived from Missouri");
const T_CAVALRY = at("nash-3", "thousands of fresh horses");
const T_55K = at("nash-3", "fifty-five thousand men");
const T_READY = at("nash-3", "until everything was ready");

// ---------- camera: start on the city, pull back to show the fort ring and the Confederate line ----------
B.camera([
  [N3, CITY[0], CITY[1] + 40, 1.15],
  [T_SCRATCH, CITY[0] - 20, CITY[1] + 120, 1.05],
  [T_MISSOURI, CITY[0] - 60, FORT[1] + 260, 0.85],
  [T_CAVALRY, (HILLTOP[0] + HILLBOT[0]) / 2, (HILLTOP[1] + HILLBOT[1]) / 2 + 100, 0.72],
  [T_55K, 1500, 700, 0.68],
  [END, 1500, 720, 0.7],
]);

B.river(RIVER, 18);
B.label("CUMBERLAND R.", 1750, 200, { cls: "river", size: 18, rot: -38, t: 0.3 });
B.city("NASHVILLE", ...CITY, { size: 24, r: 7, t: N3 + 0.2, dy: 14 });

// ---------- title / date ----------
B.showDate(N3 + 0.1);
B.date("MID-DECEMBER 1864", N3 + 0.2);

// ---------- Union fortification ring around the city ----------
const ring = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
Object.entries({ cx: CITY[0], cy: CITY[1] + 180, rx: 380, ry: 210, fill: "none", stroke: "var(--carth)", "stroke-width": 9, "stroke-dasharray": "22 14" }).forEach(([k, v]) => ring.setAttribute(k, v));
document.getElementById("overlay").appendChild(ring);
gsap.set(ring, { autoAlpha: 0, scale: 1.15, transformOrigin: `${CITY[0]}px ${CITY[1] + 180}px` });
B.tl.to(ring, { autoAlpha: 0.9, scale: 1, duration: 1.3, ease: "power2.out" }, N3 + 0.5);
B.label("UNION FORT RING", CITY[0] - 340, CITY[1] + 30, { cls: "tg", size: 18, t: N3 + 0.9, until: T_MISSOURI, anchor: [-50, -50] });

STAKE({ key: "thomas_head", name: "THOMAS", side: "carth", x: CITY[0] - 40, y: CITY[1] + 90, size: 0.55, t: N3 + 0.3 });
B.caption("THOMAS BUILDS AN ARMY FROM SCRATCH", T_SCRATCH, T_MISSOURI - 0.1, "carth");

// ---------- reinforcements arriving ----------
const U = (o) => {
  const el = B.unit(o);
  const tg = el.querySelector(".tag");
  if (tg) Object.assign(tg.style, { fontSize: (o.fs || 10) + "px", padding: "0 4px", marginTop: "2px", borderRadius: "2px" });
  el.querySelector(".blk").style.borderWidth = "1.5px";
  return el;
};
[["MISSOURI CORPS", 0], ["GARRISON TROOPS", 0.4], ["RAW RECRUITS", 0.8], ["CAVALRY", 1.2]].forEach(([label, dt], i) => {
  U({ id: "rf" + i, side: "carth", kind: i === 3 ? "cav" : "inf", x: CITY[0] - 200 + i * 130, y: CITY[1] + 260, w: 60, h: 24, label, fs: 12, t: T_MISSOURI + dt });
});
B.caption("MISSOURI · CHATTANOOGA GARRISONS · RAW RECRUITS · FRESH HORSES", T_MISSOURI + 1.6, T_55K - 0.4, "carth");

// ---------- Confederate line with five redoubts along the Hillsboro Pike ----------
B.front({ pts: [HILLTOP, ...RED, HILLBOT], color: "var(--rome)", width: 9, t: T_CAVALRY, dur: 1.8 });
RED.forEach((p, i) => {
  B.unit({ id: "rd" + i, side: "rome", kind: "inf", x: p[0], y: p[1], w: 26, h: 26, t: T_CAVALRY + 0.2 + i * 0.12 });
});
B.label("REDOUBTS", RED[2][0] + 40, RED[2][1] - 10, { cls: "tg", size: 18, t: T_CAVALRY + 1.2, until: T_55K, anchor: [-50, -50] });
STAKE({ key: "hood_head", name: "HOOD", side: "rome", x: HILLBOT[0] + 30, y: HILLBOT[1] - 30, size: 0.55, t: T_CAVALRY + 0.4 });

B.stat(["UNION ~55,000", "CONFEDERATE ~30,000"], T_55K, T_READY, "carth");
B.caption("HE REFUSES TO ATTACK UNTIL EVERYTHING IS READY", T_READY, END, "carth");

B.finish();
