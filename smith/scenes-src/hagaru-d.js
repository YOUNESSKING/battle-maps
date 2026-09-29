// hagaru-d: method card over the held Hagaru-ri perimeter; the Chinese still hold the mountains; 70 miles to the sea.
// chosin_close basemap (zoom 12). Marines = blue ("carth"), Chinese = red ("rome").
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
// sound: whoosh on big camera zooms (scale x1.6 or more within 6 s), at the fastest point of the move
const camSfx = (keys) => { for (let i = 1; i < keys.length; i++) { const r = keys[i][3] / keys[i - 1][3], d = keys[i][0] - keys[i - 1][0];
  if ((r >= 1.6 || r <= 1 / 1.6) && d <= 6) SFX("whoosh", Math.max(0, keys[i - 1][0] + d / 2 - 0.5)); } return keys; };
const NS = "http://www.w3.org/2000/svg";
const ROAD = [[1179.6,352.6],[1193.7,366.7],[1207.4,381.3],[1216.9,398.8],[1219.9,418.4],[1225.8,437.3],[1225.7,457.3],[1238.1,472.2],[1256.1,480.1],[1275.8,478.9],[1294.0,470.7],[1313.3,468.6],[1328.5,481.5],[1340.6,497.1],[1351.4,513.4],[1366.3,526.7],[1381.0,539.6],[1394.7,554.1],[1411.3,564.7],[1428.1,575.1],[1446.2,578.7],[1465.5,573.2],[1484.5,567.0],[1504.3,565.0],[1523.4,568.9],[1541.2,576.9],[1561.1,577.2],[1576.0,590.3],[1582.1,608.9],[1583.2,628.9],[1586.2,648.6],[1587.0,668.6],[1587.0,688.6],[1589.7,708.1],[1589.0,727.1],[1591.7,746.7],[1596.0,766.2],[1603.9,784.5],[1616.1,800.1],[1630.3,814.3],[1641.9,830.3],[1646.5,849.7],[1655.0,867.8],[1665.5,884.6],[1677.9,900.2],[1686.5,918.1],[1698.8,933.8],[1712.2,948.6],[1707.4,966.6],[1699.0,984.1],[1699.0,1004.1],[1706.3,1022.4],[1721.6,1035.1],[1726.9,1053.5],[1726.0,1073.5],[1729.3,1093.2],[1736.5,1111.8],[1731.7,1130.3],[1736.2,1147.3],[1755.2,1153.6],[1766.2,1169.1],[1770.3,1188.7],[1778.3,1207.0],[1785.7,1225.6],[1791.3,1244.5],[1802.7,1260.1],[1816.7,1274.0],[1823.2,1292.5],[1839.9,1303.4],[1847.9,1319.9],[1842.0,1338.5],[1839.4,1357.5],[1833.9,1375.8],[1817.1,1385.5],[1816.0,1404.4],[1823.7,1422.6],[1829.4,1440.7],[1822.2,1458.2],[1821.6,1476.8],[1817.7,1496.0],[1820.7,1515.5],[1808.4,1530.8],[1811.1,1549.8],[1827.7,1560.5],[1833.0,1579.6],[1839.4,1598.2],[1831.5,1610.4]];
const R = (i) => ROAD[Math.round(i)];
const YUD = [1180, 352], HAG = [1592, 706], KOTO = [1729, 1093];
const STRIP = { x: 1553, y: 752, len: 78, w: 16, rot: -24 };

const T_R1 = at("hagaru-9", "Build the lifeline"), T_R2 = at("hagaru-9", "Refuse to be"), T_R3 = at("hagaru-9", "Keep the division");
const T_TWO = at("hagaru-9", "At Hagaru-ri"), T_FAILED = at("hagaru-9", "The Chinese had failed"), T_MTN = at("hagaru-9", "still held the mountains");
const T_ROAD = at("hagaru-9", "the road to the sea"), T_SUB = at("hagaru-9", "If you're enjoying"), T_OUT = at("hagaru-9", "getting out");

// ---------- camera: held perimeter under the card, then pull back to the mountains and the long road south ----------
B.camera(camSfx([
  [0, 1590, 540, 1.9],
  [T_FAILED - 0.4, 1580, 560, 1.8],
  [T_FAILED + 2.6, 1420, 620, 1.05],
  [T_ROAD, 1520, 880, 0.78],
  [T_SUB + 1.0, 1560, 960, 0.8],
  [END, 1620, 1080, 0.95],
]));

// ---------- base layers: the held perimeter ----------
B.image("assets/chosin_close_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.arrow({ side: "white", pts: ROAD, width: 6, head: false, t: 0, dur: 0.01 });
B.snow(0, END + 1);
const PER = [];
for (let i = 0; i <= 24; i++) {
  const a = (i / 24) * Math.PI * 2, wob = 1 + 0.08 * Math.sin(a * 3 + 1);
  PER.push([+(1580 + 80 * wob * Math.cos(a)).toFixed(1), +(726 + 54 * wob * Math.sin(a)).toFixed(1)]);
}
B.front({ pts: PER, width: 3.5, color: "var(--carth)", t: 0, dur: 0.01 });
const strip = document.createElementNS(NS, "g");
strip.setAttribute("transform", `translate(${STRIP.x} ${STRIP.y}) rotate(${STRIP.rot})`);
strip.innerHTML = `<rect x="${-STRIP.len / 2}" y="${-STRIP.w / 2}" width="${STRIP.len}" height="${STRIP.w}" fill="rgba(247,243,234,0.35)" stroke="#1b1812" stroke-width="5.5"/>
  <rect x="${-STRIP.len / 2}" y="${-STRIP.w / 2}" width="${STRIP.len}" height="${STRIP.w}" fill="none" stroke="#f7f3ea" stroke-width="3"/>
  <rect x="${-STRIP.len / 2}" y="${-STRIP.w / 2}" width="${STRIP.len * 0.45}" height="${STRIP.w}" fill="#d8cfb8" stroke="#1b1812" stroke-width="1"/>`;
svg().appendChild(strip);
function svg() { return document.getElementById("overlay"); }
const GAR = [[1560, 700], [1612, 752], [1545, 742], [1628, 706], [1600, 690]];
GAR.forEach(([x, y], i) => B.unit({ id: "g" + i, side: "carth", x, y, w: 15, h: 15, t: 0.01 }));
B.showDate(T_FAILED + 0.3);
B.date("DECEMBER 1950", T_FAILED + 0.4, null);

// ---------- method card ----------
// (shared design, copied verbatim from inchon-c.js)
const methodCard = (o) => { // o = { t, until, rowT: [t1,t2,t3], hi: index to highlight or -1, hiT }
  const rows = ["BUILD THE LIFELINE FIRST", "REFUSE TO BE RUSHED", "KEEP THE DIVISION WHOLE"];
  const el = document.createElement("div");
  el.style.cssText = "position:absolute;left:50%;top:50%;translate:-50% -50%;width:1180px;padding:44px 64px 50px;background:rgba(16,15,13,0.86);border-top:6px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,0.55);color:#f4f1ea;";
  el.innerHTML = `<div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a;font-weight:500;margin-bottom:20px">SMITH'S METHOD</div>` +
    rows.map((r, i) => `<div class="mrow" style="position:relative;display:flex;align-items:center;gap:30px;padding:14px 20px;margin:6px -20px;border-radius:4px">
      <div class="mhl" style="position:absolute;inset:0;background:rgba(196,18,31,0.28);border-left:8px solid #e3232f;border-radius:4px;opacity:0"></div>
      <div class="mnum" style="position:relative;width:74px;height:74px;flex:none;border-radius:50%;background:#1f4fc4;border:4px solid #f4f1ea;display:flex;align-items:center;justify-content:center;font-size:42px;font-weight:700">${i + 1}</div>
      <div style="position:relative;font-size:62px;font-weight:700;letter-spacing:0.06em;line-height:1.1">${r}</div></div>`).join("");
  document.getElementById("scene").insertBefore(el, document.getElementById("credit"));
  gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, o.t);
  el.querySelectorAll(".mrow").forEach((r, i) => {
    gsap.set(r, { autoAlpha: 0 });
    tl.fromTo(r, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power3.out" }, o.rowT[i]);
    SFX("hit", o.rowT[i] + 0.1); // each method line slams in
  });
  if (o.hi >= 0) {
    const r = el.querySelectorAll(".mrow")[o.hi];
    tl.to(r.querySelector(".mhl"), { opacity: 1, duration: 0.6 }, o.hiT);
    tl.to(r.querySelector(".mnum"), { backgroundColor: "#c4121f", scale: 1.15, duration: 0.5, ease: "back.out(2)" }, o.hiT);
    el.querySelectorAll(".mrow").forEach((x, i) => { if (i !== o.hi) tl.to(x, { opacity: 0.45, duration: 0.6 }, o.hiT); });
  }
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.6 }, o.until);
  return el;
};
B.dim(0, T_FAILED - 0.2, 0.75);
const card = methodCard({ t: 0, until: T_FAILED - 0.5, rowT: [0.15, T_R2 - 0.3, T_R3 - 0.2], hi: 0, hiT: T_TWO });
{ // hagaru-9 highlights the first TWO rules (same highlight styling as the shared card)
  const r = card.querySelectorAll(".mrow")[1];
  tl.to(r, { opacity: 1, duration: 0.6 }, T_TWO + 0.9);
  tl.to(r.querySelector(".mhl"), { opacity: 1, duration: 0.6 }, T_TWO + 0.9);
  tl.to(r.querySelector(".mnum"), { backgroundColor: "#c4121f", scale: 1.15, duration: 0.5, ease: "back.out(2)" }, T_TWO + 0.9);
}

// ---------- the Marines came back together at Hagaru-ri ----------
B.arrow({ side: "carth", pts: ROAD.slice(0, 34), width: 14, t: T_FAILED - 0.2, dur: 2.4 });
["y0", "y1"].forEach((id, i) => {
  B.unit({ id, side: "carth", x: R(2 + i * 6)[0], y: R(2 + i * 6)[1], w: 34, h: 34, label: i ? "5TH MAR." : "7TH MAR.", t: T_FAILED - 0.4 });
  B.move(id, T_FAILED + 0.2 + i * 0.2, 2.6, HAG[0] - 44 + i * 10, HAG[1] - 50 - i * 40);
});
B.caption("THE MARINES STAYED TOGETHER", T_FAILED + 0.3, T_MTN - 0.3, "carth");
B.label("HAGARU-RI", HAG[0] + 90, HAG[1], { cls: "city", size: 34, t: T_FAILED + 0.6, anchor: [0, -50] });

// ---------- ...but the Chinese still held the mountains ----------
const REDS = [[1320, 560], [1430, 470], [1480, 820], [1720, 600], [1790, 800], [1560, 1000], [1840, 1000], [1620, 1180], [1900, 1230],
  [1680, 1330], [1960, 1420], [1730, 1500], [1990, 1560], [1400, 1100], [2050, 700]];
REDS.forEach(([x, y], i) => B.unit({ id: "r" + i, side: "rome", x, y, w: 40, h: 40, t: T_MTN - 0.3 + i * 0.12 }));
B.caption("THE CHINESE STILL HELD THE MOUNTAINS", T_MTN, T_ROAD - 0.2, "rome");

// ---------- 70 miles to the sea ----------
B.arrow({ side: "carth", pts: ROAD.slice(35), width: 10, dash: "22 14", t: T_ROAD, dur: 2.0 });
B.label("KOTO-RI", KOTO[0] + 22, KOTO[1], { cls: "city", size: 34, t: T_ROAD + 0.4, anchor: [0, -50] });
B.label("70 MILES TO THE SEA", 1330, 1250, { cls: "tg", size: 52, t: T_ROAD + 0.8, anchor: [-50, -50] });
B.highlight(ROAD.slice(33), T_ROAD + 0.6, null, 30);
B.caption("NEXT: GETTING OUT", T_OUT - 0.6, END, "carth");
B.finish();
