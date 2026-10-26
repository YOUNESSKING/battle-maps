// Move 1 · Chickamauga (3): dusk withdrawal via McFarland's Gap to Rossville and Chattanooga, 3 regiments captured,
// casualties, the method card. Basemap chatt (z13). chick-10 … chick-11.
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const NSVG = "http://www.w3.org/2000/svg";
const OVL = document.getElementById("overlay"), PINS = document.getElementById("pins");

// ---------- projection (assets/chatt.json: zoom 13, origin 550285, 829938) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 13, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 550285).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 829938).toFixed(1)];
};
const C = ([x, y]) => [+(x / 4 + 1244).toFixed(1), +(y / 4 + 1048).toFixed(1)]; // z15 chick map px -> this map
const US = "assets/media/us_flag_35star.png";

// ---------- local helpers ----------
const svgG = (html) => { const g = document.createElementNS(NSVG, "g"); g.innerHTML = html; OVL.appendChild(g); gsap.set(g, { autoAlpha: 0 }); return g; };
const fadeIn = (el, t, d = 0.5) => tl.to(el, { autoAlpha: 1, duration: d }, t);
const fadeOut = (el, t, d = 0.5) => tl.to(el, { autoAlpha: 0, duration: d }, t);
const U = (o) => {
  const el = B.unit({ w: 22, h: 14, ...o });
  el.querySelector(".blk").style.borderWidth = "2px";
  const tg = el.querySelector(".tag");
  if (tg) Object.assign(tg.style, { fontSize: (o.fs || 9) + "px", padding: "0 3px", marginTop: "1px", borderRadius: "2px" });
  return el;
};
function follow(id, pts, t, dur) {
  const L = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = L.reduce((a, b) => a + b, 0);
  let tt = t;
  pts.slice(1).forEach((p, i) => { const d = dur * L[i] / tot; B.move(id, tt, d, p[0], p[1], "none"); tt += d; });
}
const tag = (text, x, y, t, until, o = {}) => {
  const el = document.createElement("div");
  el.innerHTML = text;
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;padding:1px 5px;background:${o.bg || "#b3121c"};color:#fff;font-weight:700;
    font-size:${o.size || 10}px;letter-spacing:0.08em;white-space:nowrap;border:1px solid #f3eee2;border-radius:2px;box-shadow:0 2px 4px rgba(0,0,0,0.5);`;
  PINS.appendChild(el);
  gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, t);
  if (until != null) fadeOut(el, until);
  return el;
};
const pulse = (x, y, t, r = 20, color = "#f2c14e", reps = 2) => {
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;border:4px solid ${color};box-shadow:0 0 10px ${color}`;
  PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  for (let k = 0; k < reps; k++) tl.fromTo(el, { autoAlpha: 1, scale: 0.4 }, { autoAlpha: 0, scale: 1.3, duration: 1.2, ease: "power2.out", immediateRender: false }, t + k * 1.0);
};

// ---------- times ----------
const T_NEXT = at("chick-10", "and the next day"), T_CAPT = at("chick-10", "A few regiments"), T_VICT = at("chick-10", "Chickamauga was a Confederate");
const T_16 = at("chick-10", "over sixteen thousand"), T_18 = at("chick-10", "more than eighteen thousand"), T_SURV = at("chick-10", "But the Army");
const S11 = P("chick-11"), T_R1 = at("chick-11", "He refused"), T_R2 = at("chick-11", "He held the ground"), T_RIDGE = at("chick-11", "one curved ridge");
const T_PRIZE = at("chick-11", "And by holding it"), T_FIELD = at("chick-11", "They won the field");

// ---------- geography (same as hook1) ----------
const RIVER = [[1790, -20], [1700, 30], [1600, 70], [1540, 120], [1505, 200], [1488, 285], [1450, 325], [1360, 330], [1270, 342], [1225, 395], [1208, 480], [1198, 560], [1172, 580], [1145, 530], [1140, 420], [1148, 290], [1146, 170], [1120, 70], [1070, -20]];
const CREEK = [[1540, 1480], [1601, 1617], [1606, 1520], [1651, 1483], [1683, 1522], [1734, 1532], [1764, 1494], [1739, 1458], [1777, 1432], [1730, 1421], [1726, 1395], [1794, 1402], [1862, 1353], [1897, 1334], [1897, 1315], [1866, 1282], [1814, 1259], [1863, 1236], [1853, 1196], [1822, 1169], [1856, 1142], [1840, 1132], [1880, 1134], [1904, 1174], [1893, 1142], [1902, 1106], [1904, 1077], [1897, 1054], [1932, 1046], [1929, 1006], [1899, 992], [1902, 957], [1929, 914], [1915, 899], [1970, 882], [1992, 845], [2003, 786], [1971, 758], [1948, 737], [1929, 733], [1937, 705], [1968, 705]];
B.river(RIVER, 26, { text: "TENNESSEE RIVER", x: 1560, y: 150, size: 26, rot: -48 });
B.river(CREEK, 7);
B.label("CHICKAMAUGA CREEK", 1935, 1180, { cls: "river", size: 16, rot: -80, instant: true, anchor: [-50, -50] });
const roadPts = [[1590, 1640], [1604, 1415], [1633, 1280], [1636, 1200], [1648, 1100], [1656, 1045], [1630, 960], [1500, 885], [1464, 860], [1420, 720], [1380, 600], [1335, 470]];
const rp = "M " + roadPts.map((p) => p.join(" ")).join(" L ");
OVL.insertAdjacentHTML("beforeend", `<g><path d="${rp}" fill="none" stroke="rgba(92,66,38,0.7)" stroke-width="7" stroke-linejoin="round"/><path d="${rp}" fill="none" stroke="#e2d0a4" stroke-width="3.5" stroke-linejoin="round"/></g>`);
OVL.insertAdjacentHTML("afterbegin", `<defs><pattern id="trees" width="12" height="11" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2.4" fill="rgba(58,78,40,0.22)"/><circle cx="9" cy="8" r="2.2" fill="rgba(58,78,40,0.18)"/></pattern></defs><ellipse cx="1640" cy="1250" rx="230" ry="200" fill="url(#trees)"/>`);
B.city("CHATTANOOGA", 1324, 430, { size: 34, r: 10, t: 0.2 });
B.city("ROSSVILLE", 1464, 860, { size: 22, r: 7, t: 0.2 });
B.label("McFARLAND'S GAP", 1398, 1122, { cls: "tg", size: 16, t: 0.4, anchor: [-100, -50] });
B.label("MISSIONARY RIDGE", 1545, 640, { cls: "tg", size: 24, t: 0.2, rot: -68, anchor: [-50, -50] });
B.label("LOOKOUT MOUNTAIN", 820, 1060, { cls: "tg", size: 30, t: 0.2, rot: -56, anchor: [-50, -50] });
const RIDGE = [[1300, 768], [1250, 812], [1185, 836], [1125, 856], [1062, 852], [1018, 822]].map(C);
const rl = svgG(`<path d="M ${RIDGE.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#6b4a2b" stroke-width="3" stroke-dasharray="2 4" stroke-linecap="round"/>`);
fadeIn(rl, 0.1, 0.3);
B.label("HORSESHOE RIDGE", ...C([1150, 905]), { cls: "tg", size: 11, t: 0.3, anchor: [-50, -50], until: T_CAPT });
const works = [[1480, 452], [1560, 432], [1640, 452], [1700, 505], [1712, 580], [1706, 660], [1680, 725], [1636, 772], [1590, 790]].map(C);
const wg = svgG(`<path d="M ${works.map((p) => p.join(" ")).join(" L ")}" fill="none" stroke="#4a2f16" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`);
fadeIn(wg, 0.1, 0.3);

// dusk
const dusk = document.createElement("div");
dusk.className = "fx-layer"; dusk.style.background = "linear-gradient(180deg, rgba(60,30,60,0.35), rgba(120,60,20,0.35))";
document.getElementById("fx").appendChild(dusk); gsap.set(dusk, { autoAlpha: 0 });
fadeIn(dusk, 0, 0.01); fadeOut(dusk, T_VICT, 2.0);

// ---------- camera ----------
B.camera([
  [0, 1575, 1210, 2.4],
  [3.5, 1540, 1120, 2.0],
  [T_NEXT, 1450, 850, 1.05],
  [T_CAPT + 0.3, 1545, 1225, 2.7],
  [T_VICT + 0.5, 1540, 1180, 2.2],
  [T_SURV, 1420, 800, 1.1],
  [S11 + 1, 1440, 860, 1.0],
  [T_RIDGE, 1560, 1085, 1.9],
  [T_PRIZE + 0.5, 1520, 1080, 1.4],
  [END, 1470, 900, 1.05],
]);

// ---------- chick-10: withdrawal at dusk ----------
B.showDate(0.1);
B.date("20 SEPT 1863 · DUSK", 0.2, T_SURV - 0.6, 34);
B.date("22 SEPT · CHATTANOOGA", T_SURV - 0.5, END + 1, 32);
const BLUE = { reynolds: [1610, 745], palmer: [1665, 650], johnson: [1660, 540], baird: [1560, 480], brannan: [1190, 812], wood: [1285, 745], steed: [1010, 780] };
Object.entries(BLUE).forEach(([id, p]) => { const q = C(p); U({ id, side: "carth", x: q[0], y: q[1], t: 0.05 }); });
const CAP = [[1060, 820], [1130, 842], [1235, 800]];
CAP.forEach((p, i) => { const q = C(p); U({ id: "cap" + i, side: "carth", x: q[0], y: q[1], w: 14, h: 9, t: 0.05 }); });
const REDP = [[1560, 330], [1800, 520], [1810, 690], [1760, 820], [1020, 1010], [1140, 1000], [1260, 980], [1380, 950], [1470, 900]];
REDP.forEach((p, i) => { const q = C(p); U({ id: "r" + i, side: "rome", x: q[0], y: q[1], w: 16, h: 10, t: 0.05 }); });
const thomasS = B.portraitStake({ img: "assets/media/thomas_head.png", flag: US, name: "THOMAS", x: C([1380, 640])[0], y: C([1380, 640])[1], size: 0.42, t: 0.1 });
thomasS.querySelector(".nm").style.fontSize = "8px";
B.caption("AT DUSK, ON THOMAS'S ORDERS: PULL BACK UNIT BY UNIT", 0.4, T_NEXT - 0.2, "carth");
// unit by unit through McFarland's Gap to Rossville
const OUT = [[1500, 1215], [1406, 1130], [1430, 1010], [1464, 880]];
const order = ["reynolds", "palmer", "johnson", "baird", "wood", "brannan", "steed"];
order.forEach((id, i) => {
  const u = B.units[id];
  follow(id, [[u.x, u.y], ...OUT.slice(0, 3), [1470 + (i % 3 - 1) * 26, 850 - Math.floor(i / 3) * 22]], 1.0 + i * 0.9, 6.5);
});
tl.to(thomasS, { left: 1470 - parseFloat(thomasS.style.width) / 2 + 40, top: 830 - parseFloat(thomasS.style.height), duration: 6.5, ease: "power1.inOut" }, 5.5);
B.arrow({ side: "carth", pts: [C([1560, 760]), [1500, 1215], [1406, 1130], [1430, 1010], [1462, 890]], width: 9, dash: "14 8", t: 0.8, dur: 3.5, until: T_CAPT });
B.arrow({ side: "carth", pts: [[1455, 840], [1415, 710], [1375, 590], [1338, 470]], width: 12, t: T_NEXT, dur: 2.2, until: T_CAPT + 1 });
// three regiments left on the ridge are captured
B.grey(["cap0", "cap1", "cap2"], T_CAPT + 1.2, 0.8);
[[1040, 960], [1130, 960], [1240, 930]].forEach((p, i) => B.move("r" + (4 + i), T_CAPT + 0.2, 2.2, ...C([p[0], p[1] - 70])));
tag("3 REGIMENTS CAPTURED", ...C([1150, 700]), T_CAPT + 1.4, T_VICT, { size: 11 });
B.caption("CAPTURED ON THE RIDGE IN THE DARK", T_CAPT + 0.3, T_VICT - 0.2, "rome");
B.hideUnits(["cap0", "cap1", "cap2"], T_VICT + 0.5, 1);
// the field: a Confederate victory
REDP.forEach((p, i) => i < 4 && B.move("r" + i, T_VICT, 3, ...C([p[0] - 120, p[1] + 20])));
tag("CONFEDERATE VICTORY", ...C([1560, 380]), T_VICT + 0.3, T_SURV, { size: 11 });
B.caption("THE BLOODIEST BATTLE OF THE WAR IN THE WEST", T_VICT + 0.2, T_16 - 0.4, "rome");
const st = B.stat([`<span style="color:var(--carth-light)">UNION: 16,170 CASUALTIES</span>`, `<span style="color:#f08a84">CONFEDERATE: 18,454 CASUALTIES</span>`], T_16 - 0.3, T_SURV - 0.2, "rome");
st.querySelectorAll(".row").forEach((r, i) => tl.fromTo(r, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: true }, [T_16, T_18][i] - 0.1));
// the army survived: all units gathered at Chattanooga
order.forEach((id, i) => B.move(id, T_SURV - 1.5 + i * 0.1, 3.5, 1300 + (i % 4) * 26, 470 + Math.floor(i / 4) * 22 + 20));
tl.to(thomasS, { left: 1270 - parseFloat(thomasS.style.width) / 2, top: 470 - parseFloat(thomasS.style.height), duration: 3.5 }, T_SURV - 1.5);
pulse(1340, 490, T_SURV + 0.8, 60, "#9fc0ea", 3);
B.caption("BUT THE ARMY OF THE CUMBERLAND SURVIVED", T_SURV, S11 - 0.2, "carth");

// ---------- chick-11: the method ----------
B.method(S11 + 0.3, T_PRIZE - 0.2, { rowT: [T_R1 - 0.2, T_R2 - 0.2, T_R2 + 2.5], dim: [2] });
B.highlight(RIDGE, T_RIDGE - 0.2, T_PRIZE, 10);
B.highlight(works, T_RIDGE + 0.8, T_PRIZE, 10);
B.caption("THEY PAID 18,000 MEN FOR THE FIELD", T_PRIZE, T_FIELD - 0.2, "rome");
B.caption("THEY WON THE FIELD · BUT THE ARMY GOT AWAY", T_FIELD, END + 1, "carth");
pulse(1340, 490, T_FIELD + 0.5, 60, "#9fc0ea", 3);
B.finish();
