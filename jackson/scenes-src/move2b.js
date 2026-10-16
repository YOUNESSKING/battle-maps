// MOVE 2b (move2-6 .. move2-8), Stonewall Jackson #11: Second Manassas, 28-30 Aug 1862. Basemap bullrun_hd_ref (z13, HD relief, dark grade).
// Built with: python3 tools/build_scene.py move2b bullrun_hd_ref move2-6 move2-8
// Opens on the framing move2a ends on (nova z10 s=5.333 at 38.815N 77.56W = bullrun z13 s=0.667), so the cut is seamless.
// Close-up battle = option 2 (STYLE_LOCK 2a): two-colour glowing fronts only (K.front width 15, glow 0.47), flags US 34-star / CSA 13-star.
// Geography: tools/make_bullrun_geo.py (Warrenton Turnpike, Manassas Gap RR, the unfinished railroad, Bull Run; coordinates checked,
// research/FACT_NOTES_nova.md).
// move2-6 28 AUG evening: King's division marches east on the Warrenton Turnpike across Jackson's front; Jackson badge; blue guns on Stony
//         Ridge fire -> impacts (shake); the blue lines come down to the Brawner farm, the close-range fire line (front + MG), dusk falls;
//         NEARLY ONE THIRD OF 7,000 ENGAGED HIT (NPS); EWELL LOSES A LEG (small stamp).
// move2-7 29 AUG: Jackson's line on the unfinished railroad (front); Union attacks one after another (arrows, impacts, MG), REPULSED x3;
//         NOON: wide shot, Longstreet's column through THOROUGHFARE GAP deploys on Jackson's right (one-colour line, glow), THE JAW;
//         NOBODY TELLS POPE; 30 AUG dawn card POPE TO HALLECK "THE ENEMY IS RETREATING TOWARDS THE MOUNTAINS".
// move2-8 30 AUG 3 PM: Porter's 6,000+ against the DEEP CUT (arrows, MG, guns from the Brawner ridge -> impacts); OUT OF AMMUNITION: ROCKS
//         (rocks fly); 4 PM: the Longstreet jaw swings shut (huge arrow, gun rows -> impacts, shake), LONGSTREET ~25,000, NPS quote card;
//         the front pivots to Henry Hill; red lines fall back over the Stone Bridge to Centreville in the dark; RETREAT.
// Facts: research/FACT_NOTES.md (Move 2) + research/FACT_NOTES_nova.md. Jackson / Confederates = blue (carth), Union = red (rome).
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const L = GG.proj(13, 595316, 802062);
const FL = { us: "assets/media/us34_flag.png", csa: "assets/media/csa1_13_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const BR = {"pl":{"gainesville":[1133.8,952.0],"haymarket":[992.9,832.4],"thoroughfare_gap":[532.7,739.0],"groveton":[1508.4,828.7],"brawner":[1408.2,803.3],"deep_cut":[1481.0,732.2],"stone_house":[1627.8,830.2],"stone_bridge":[1769.4,739.7],"henry_hill":[1665.7,824.2],"henry_house":[1657.5,812.3],"chinn_ridge":[1599.3,851.9],"matthews_hill":[1602.8,734.5],"sudley_church":[1568.4,618.6],"sudley_springs":[1569.6,614.8],"battery_heights":[1456.6,833.9],"dogan_house":[1502.6,826.5],"centreville":[2188.2,632.8],"manassas_jct":[1933.7,1289.8],"bristoe":[1553.8,1501.9],"catharpin":[1369.8,516.1],"stony_ridge":[1323.7,698.6],"new_market":[1323.7,885.5]},"rivers":[[[1988,948],[1984,940],[1975,929],[1968,920],[1973,920],[1973,920]],[[1969,918],[1967,904],[1959,864],[1959,864],[1959,864]],[[1965,858],[1972,837],[1934,823],[1920,801],[1949,789],[1979,775],[2002,759],[2025,736],[2032,709],[2005,688],[1989,669],[2001,648],[1998,631],[1996,618],[2000,612],[1991,582],[1954,562],[1942,579],[1922,547],[1919,509],[1909,464],[1922,447],[1933,418],[1937,392],[1939,378],[1957,356],[1966,304],[1976,290],[1968,264],[1966,236],[1978,210],[1967,208],[1975,197],[1975,187],[1977,166],[1976,152],[1991,134],[1982,115],[1982,96],[1984,78],[1979,63],[1991,50],[1997,36],[1997,36]],[[712,1020],[727,1042],[725,1077],[730,1061],[743,1032],[769,1051],[803,1076],[813,1087],[826,1108],[931,1141],[1055,1172],[1098,1219],[1104,1239],[1118,1254],[1155,1262],[1158,1218],[1194,1221],[1226,1235],[1214,1246],[1221,1274],[1246,1265],[1268,1259],[1302,1281],[1325,1286],[1353,1318],[1411,1338],[1439,1332],[1419,1311],[1453,1286],[1480,1307],[1518,1325],[1533,1337],[1547,1328],[1563,1365],[1577,1390],[1597,1405],[1603,1471],[1612,1481],[1622,1490],[1662,1496],[1657,1528],[1667,1538],[1699,1556],[1732,1543],[1752,1517],[1756,1529],[1776,1558],[1768,1597],[1754,1626],[1763,1656],[1767,1671],[1780,1703],[1791,1725],[1846,1724],[1845,1705],[1864,1682],[1884,1697],[1856,1757],[1856,1757]],[[896,-141],[931,-136],[947,-140],[963,-145],[977,-138],[1004,-116],[1021,-91],[1036,-76],[1056,-70],[1093,-61],[1108,-42],[1110,-29],[1114,-25],[1121,-15],[1130,-8],[1131,0],[1135,9],[1138,21],[1140,40],[1148,51],[1154,66],[1162,82],[1189,92],[1196,112],[1203,126],[1215,141],[1223,155],[1258,181],[1259,195],[1256,200],[1290,211],[1311,234],[1327,239],[1357,241],[1385,255],[1423,276],[1443,268],[1468,262],[1486,276],[1489,305],[1500,338],[1488,363],[1490,387],[1500,408],[1497,422],[1482,442],[1510,453],[1495,476],[1484,502],[1514,525],[1496,558],[1508,572],[1524,573],[1517,562],[1530,547],[1563,563],[1586,574],[1587,629],[1652,646],[1718,619],[1741,622],[1746,645],[1727,651],[1728,672],[1724,703],[1770,738],[1753,768],[1758,784],[1787,820],[1841,838],[1846,887],[1832,940],[1877,944],[1904,947],[1930,931],[1944,950],[1974,949],[1988,948],[2014,955],[2027,940],[2040,954],[2067,950],[2081,917],[2093,895],[2124,899],[2143,931],[2160,977],[2173,1010],[2177,1066],[2187,1071],[2217,1081],[2251,1105],[2289,1127],[2287,1146],[2282,1172],[2298,1202],[2286,1205],[2279,1233],[2332,1266],[2310,1302],[2307,1336],[2329,1326],[2351,1323],[2349,1284],[2378,1293],[2396,1299],[2440,1304],[2432,1338],[2445,1357],[2489,1394],[2503,1451],[2486,1500],[2486,1500]]],"pike":[[624.7,1139.6],[629.2,1138.1],[638.3,1135.1],[652.0,1130.5],[670.2,1124.4],[693.0,1116.9],[720.3,1107.7],[752.1,1097.1],[788.5,1085.0],[823.8,1072.9],[857.9,1061.0],[890.9,1049.2],[922.7,1037.5],[953.4,1025.8],[982.9,1014.3],[1011.3,1002.9],[1038.5,991.6],[1064.4,980.9],[1088.9,970.8],[1112.1,961.3],[1134.0,952.5],[1154.5,944.2],[1173.6,936.5],[1191.4,929.5],[1207.9,923.0],[1224.1,916.8],[1240.1,910.9],[1255.8,905.2],[1271.4,899.7],[1286.6,894.5],[1301.7,889.5],[1316.5,884.8],[1331.0,880.3],[1344.9,876.0],[1358.0,872.0],[1370.3,868.3],[1382.0,864.8],[1392.9,861.5],[1403.1,858.5],[1412.6,855.8],[1421.3,853.2],[1429.8,850.8],[1438.2,848.4],[1446.3,846.1],[1454.2,843.8],[1461.9,841.7],[1469.4,839.6],[1476.6,837.5],[1483.7,835.6],[1490.8,833.9],[1498.0,832.4],[1505.2,831.2],[1512.5,830.2],[1519.8,829.4],[1527.2,828.9],[1534.7,828.7],[1542.2,828.7],[1549.7,828.7],[1557.1,828.8],[1564.6,828.8],[1572.1,828.9],[1579.5,829.0],[1587.0,829.2],[1594.4,829.4],[1601.8,829.5],[1609.2,829.4],[1616.6,828.9],[1623.9,828.1],[1631.2,827.0],[1638.4,825.6],[1645.6,823.8],[1652.8,821.7],[1659.9,819.3],[1667.0,816.5],[1674.0,813.4],[1680.9,809.9],[1687.8,806.2],[1694.5,802.0],[1701.2,797.6],[1707.9,792.8],[1714.4,787.6],[1720.6,782.7],[1726.6,777.9],[1732.2,773.3],[1737.4,768.8],[1742.4,764.6],[1747.0,760.5],[1751.4,756.5],[1755.4,752.8],[1760.1,749.0],[1765.6,745.2],[1771.8,741.2],[1778.7,737.3],[1786.3,733.2],[1794.7,729.2],[1803.8,725.0],[1813.6,720.8],[1824.0,716.7],[1835.1,712.6],[1846.7,708.5],[1858.9,704.6],[1871.7,700.6],[1885.0,696.8],[1899.0,693.0],[1913.6,689.3],[1928.3,685.5],[1943.2,681.8],[1958.4,678.0],[1973.6,674.3],[1989.1,670.6],[2004.8,666.8],[2020.6,663.1],[2036.6,659.3],[2052.1,655.9],[2067.1,652.6],[2081.6,649.7],[2095.6,647.0],[2109.1,644.5],[2122.0,642.3],[2134.5,640.4],[2146.4,638.7],[2159.8,636.4],[2174.5,633.4],[2190.6,629.8],[2208.0,625.6],[2226.9,620.8],[2247.1,615.3],[2268.8,609.2],[2291.8,602.5],[2315.6,595.6],[2340.1,588.4],[2365.4,581.0],[2391.5,573.5],[2418.3,565.7],[2445.9,557.7],[2474.3,549.5],[2503.4,541.1],[2528.9,533.7],[2550.7,527.4],[2568.9,522.1],[2583.5,517.9],[2594.4,514.8],[2601.7,512.7],[2605.3,511.6]],"sudley":[[1933.7,1289.8],[1932.8,1288.1],[1931.0,1284.8],[1928.4,1279.9],[1924.8,1273.3],[1920.4,1265.1],[1915.1,1255.2],[1908.9,1243.7],[1901.9,1230.5],[1894.4,1217.3],[1886.6,1203.9],[1878.3,1190.4],[1869.7,1176.8],[1860.7,1163.1],[1851.3,1149.3],[1841.5,1135.4],[1831.3,1121.4],[1821.2,1107.4],[1811.2,1093.4],[1801.2,1079.4],[1791.4,1065.4],[1781.7,1051.3],[1772.0,1037.3],[1762.5,1023.3],[1753.0,1009.3],[1743.8,995.9],[1734.9,983.0],[1726.2,970.8],[1717.9,959.1],[1709.8,948.0],[1701.9,937.5],[1694.4,927.6],[1687.1,918.2],[1680.2,909.2],[1673.7,900.4],[1667.6,892.0],[1661.8,883.9],[1656.4,876.1],[1651.4,868.5],[1646.8,861.3],[1642.6,854.4],[1638.5,847.5],[1634.6,840.5],[1630.8,833.5],[1627.2,826.5],[1623.7,819.5],[1620.3,812.4],[1617.1,805.3],[1614.1,798.2],[1611.1,790.8],[1608.3,783.2],[1605.5,775.2],[1602.9,767.0],[1600.4,758.5],[1598.0,749.7],[1595.7,740.7],[1593.5,731.3],[1591.4,721.8],[1589.2,712.2],[1587.1,702.4],[1585.0,692.5],[1582.9,682.5],[1580.8,672.3],[1578.8,662.0],[1576.7,651.5],[1571.8,640.8],[1564.0,629.8],[1553.4,618.7],[1539.9,607.3],[1523.5,595.6],[1504.3,583.8],[1482.2,571.6],[1457.2,559.3],[1435.3,548.5],[1416.6,539.2],[1401.0,531.5],[1388.5,525.4],[1379.1,520.7],[1372.9,517.6],[1369.8,516.1]],"mgrr":[[1933.7,1289.8],[1760.7,1251.7],[1585.9,1191.9],[1411.1,1117.2],[1265.5,1035.0],[1140.2,971.5],[1055.8,893.0],[997.5,836.9],[857.7,788.3],[682.9,758.4],[532.7,739.0],[391.7,698.6],[275.2,608.9],[193.0,455.5]],"unf":[[1090.7,930.4],[1092.1,929.4],[1094.8,927.6],[1098.9,924.8],[1104.4,921.0],[1111.2,916.4],[1119.4,910.7],[1129.0,904.2],[1139.9,896.7],[1150.8,889.1],[1161.7,881.4],[1172.6,873.6],[1183.6,865.7],[1194.5,857.6],[1205.4,849.4],[1216.3,841.1],[1227.3,832.7],[1237.9,824.8],[1248.3,817.3],[1258.4,810.3],[1268.2,803.7],[1277.8,797.7],[1287.1,792.1],[1296.1,786.9],[1304.8,782.3],[1313.5,777.9],[1322.3,773.8],[1331.0,770.0],[1339.8,766.5],[1348.5,763.3],[1357.2,760.3],[1366.0,757.7],[1374.7,755.4],[1383.1,753.2],[1391.1,751.1],[1398.7,749.1],[1406.0,747.2],[1412.9,745.5],[1419.5,743.8],[1425.7,742.3],[1431.5,740.9],[1437.1,739.6],[1442.3,738.4],[1447.4,737.4],[1452.1,736.5],[1456.5,735.6],[1460.7,734.9],[1464.6,734.4],[1468.3,733.9],[1472.0,733.2],[1475.8,732.4],[1479.8,731.4],[1483.8,730.3],[1487.9,728.9],[1492.0,727.4],[1496.3,725.7],[1500.7,723.8],[1505.0,721.8],[1509.2,719.6],[1513.3,717.2],[1517.3,714.6],[1521.2,711.9],[1525.0,708.9],[1528.7,705.8],[1532.4,702.6],[1535.8,699.1],[1539.0,695.5],[1541.9,691.7],[1544.7,687.7],[1547.2,683.6],[1549.4,679.3],[1551.5,674.8],[1553.3,670.1],[1555.2,665.4],[1557.2,660.7],[1559.3,655.9],[1561.5,651.2],[1563.8,646.4],[1566.1,641.6],[1568.6,636.7],[1571.1,631.9],[1573.7,627.2],[1576.4,622.6],[1579.1,618.3],[1581.8,614.0],[1584.6,610.0],[1587.4,606.1],[1590.3,602.4],[1593.2,598.9],[1595.7,595.7],[1597.9,593.1],[1599.7,590.9],[1601.2,589.1],[1602.3,587.7],[1603.0,586.9],[1603.4,586.4]]};
const PL = BR.pl || {};
// ---------- helpers ----------
const box = (txt, x, y, t, size = 7, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.22em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.6).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const town = (txt, key, t, o = {}) => { const [x, y] = PL[key]; B.city("", x, y, { r: o.r || 2, t, until: o.until }); return box(txt, x + (o.dx || 0), y + (o.dy != null ? o.dy : -9), t, o.size || 7, o.until, o.pop !== false); };
const tag = (txt, x, y, t, c, size = 7, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:${c};color:#f7f3ea;font-family:Oswald;font-weight:700;letter-spacing:.14em;padding:${(size * 0.18).toFixed(1)}px ${(size * 0.5).toFixed(1)}px;font-size:${size}px;white-space:nowrap;border:0.8px solid #f3eee2;box-shadow:0 1px 4px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 44) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 40).toFixed(1)}px solid #1a1712;box-shadow:0 2px 6px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.17).toFixed(1)}px;color:#f7f3ea;text-shadow:0 1px 3px #000">${name}</div></div>`, x, y, { t, until });
const unit = (id, side, x, y, icon, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 22, h: o.h || 15, t: o.t, label: o.label });
  K.counter(id, { icon, flag: side === "carth" ? FL.csa : FL.us, size: o.size });
  const u = B.units[id], tg = u.el.querySelector(".tag"); if (tg) { tg.style.fontSize = (o.fs || 5.5) + "px"; tg.style.padding = `0 ${u.h * 0.2}px`; }
  if (o.t == null) gsap.set(u.el, { autoAlpha: 1 });
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const go = (id, t, dur, xy, ease) => B.move(id, t, dur, xy[0], xy[1], ease || "power1.inOut");
const ux = (id) => { const u = B.units[id]; return [parseFloat(u.el.style.left) + u.w / 2, parseFloat(u.el.style.top) + u.h / 2]; };
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in" }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(4, Math.round(size / 9))}px solid ${c};padding:4px 22px 6px;background:rgba(14,12,10,0.74);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.3)}px;letter-spacing:0.22em;color:#f7f3ea;margin-top:2px">${sub}</div>` : ""}</div>`;
const sstamp = (txt, top, t, o = {}) => slam(scr(stampHTML(txt, o.color || "#e3232f", o.size || 64, o.rot || -5, o.sub), `left:${o.left != null ? o.left + "px" : "0"};right:${o.left != null ? "auto" : "0"};top:${top}px;display:flex;justify-content:center;`), t, o);
// world-space mini stamp (REPULSED at the attack point)
const wstamp = (txt, x, y, t, until, c = "#2f6fe0") => { const el = GG.pin(stampHTML(txt, c, 9, -6), x, y, {}); tl.fromTo(el, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in" }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
const legend = (t, until) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2c57b7", "CONFEDERATE"], ["#bc2528", "UNION"]].map(([ln, nm]) => `<span><b style="display:inline-block;width:26px;height:6px;background:${ln};box-shadow:0 0 8px ${ln};vertical-align:5px;margin-right:8px"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const wimg = (src, t, dIn, tOut) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px" });
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (t > 0) { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: false }, t); }
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: 0.8 }, tOut);
  return el;
};
const CW = 1920, CH = 1080, cam = { cx: 1440, cy: 810, s: 0.667 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
applyCam();
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const NS = "http://www.w3.org/2000/svg";
// thin arrow (close-up scale)
const tArrow = (pts, col, t, until, w = 2.4, dur = 1.4) => { const g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");
  const [x2, y2] = pts[pts.length - 1], [x1, y1] = pts[pts.length - 2], ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  g.innerHTML = `<path d="${d}" fill="none" stroke="#f3eee2" stroke-width="${w + 1.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<polygon points="0,${-w * 2.2} ${w * 3.4},0 0,${w * 2.2}" fill="${col}" stroke="#f3eee2" stroke-width="0.8" transform="translate(${x2} ${y2}) rotate(${ang.toFixed(1)})"/>`;
  document.getElementById("overlay").appendChild(g); const ps = [...g.querySelectorAll("path")], len = ps[1].getTotalLength(), hd = g.querySelector("polygon");
  gsap.set(ps, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); gsap.set(hd, { opacity: 0 }); GG.hide(g);
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); tl.to(ps, { strokeDashoffset: 0, duration: dur, ease: "power2.inOut" }, t); tl.to(hd, { opacity: 1, duration: 0.2 }, t + dur - 0.1);
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.5 }, until); return g; };
const glowLine = (pts, col, w, t, until, o = {}) => { const g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");
  g.innerHTML = `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w * 3}" stroke-linecap="round" stroke-linejoin="round" opacity="0.4" filter="url(#fxk-blur)"/><path d="${d}" fill="none" stroke="${o.core || "#fff6dc"}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""}/>`;
  document.getElementById("overlay").appendChild(g);
  const ps = [...g.querySelectorAll("path")], len = ps[1].getTotalLength(); if (!o.dash) gsap.set(ps, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); GG.hide(g);
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); if (!o.dash) tl.to(ps, { strokeDashoffset: 0, duration: o.dur || 1.4, ease: "power1.inOut" }, t); else tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.6 }, t);
  if (o.pulse) tl.to(ps[0], { opacity: 0.9, duration: 0.6, yoyo: true, repeat: o.pulse }, t + (o.dur || 1.4));
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.5 }, until); return g; };
const shoot = (from, to, t, o = {}) => { K.gun(from[0], from[1], t, { dx: 0, dy: -2 });
  const dur = o.dur || 0.6; GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.2, h: o.h || 10, impact: false }); K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: 2 }); };
const mg = (a, b, t, n = 5) => { SFX("mg", t);
  for (let k = 0; k < n; k++) { const g = document.createElementNS(NS, "line"), j = ((k * 7) % 5 - 2) * 1.5;
    g.setAttribute("x1", a[0]); g.setAttribute("y1", a[1]); g.setAttribute("x2", b[0] + j); g.setAttribute("y2", b[1] - j);
    g.setAttribute("stroke", "#ffe28a"); g.setAttribute("stroke-width", "1.1"); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-dasharray", "3 26");
    g.style.filter = "drop-shadow(0 0 2px #ffb347)"; document.getElementById("overlay").appendChild(g); GG.hide(g);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 29;
    tl.fromTo(g, { autoAlpha: 1, strokeDashoffset: 0 }, { strokeDashoffset: -len, duration: 0.4, ease: "none", immediateRender: false }, t + k * 0.1);
    tl.to(g, { autoAlpha: 0, duration: 0.05 }, t + k * 0.1 + 0.4); } };
// a volley line: muzzle flashes along a line of men (close-range musketry)
const volley = (pts, t, n = 6) => { SFX("mg", t); for (let k = 0; k < n; k++) { const f = k / (n - 1), i = Math.min(pts.length - 2, Math.floor(f * (pts.length - 1))), a = pts[i], b = pts[i + 1], r = f * (pts.length - 1) - i;
  const el = GG.pin(`<div style="width:5px;height:5px;border-radius:50%;background:#fff3b0;box-shadow:0 0 5px 2px #ffb347"></div>`, a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r, {});
  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t + (k % 3) * 0.08); tl.to(el, { autoAlpha: 0, duration: 0.25 }, t + 0.12 + (k % 3) * 0.08); } };
const RES = (pts, n) => { const c = [0]; for (let j = 1; j < pts.length; j++) c.push(c[j - 1] + Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]));
  return [...Array(n)].map((_, k) => { const d = c[c.length - 1] * k / (n - 1); let j = 1; while (j < c.length - 1 && c[j] < d) j++; const a = pts[j - 1], b = pts[j], r = (d - c[j - 1]) / ((c[j] - c[j - 1]) || 1); return [+(a[0] + (b[0] - a[0]) * r).toFixed(1), +(a[1] + (b[1] - a[1]) * r).toFixed(1)]; }); };
const LL = (arr) => arr.map((q) => L(...q));
const ROCK = `<svg width="6" height="5" viewBox="0 0 6 5" style="display:block"><path d="M0.5 3 L1.5 0.8 L4 0.5 L5.6 2.4 L4.6 4.6 L1.6 4.5 Z" fill="#b8b2a4" stroke="#3a352c" stroke-width="0.5"/></svg>`;
// ---------- times (spoken words) ----------
const P6 = "move2-6", P7 = "move2-7", P8 = "move2-8";
const T_WAITN = at(P6, "He did not wait"), T_EVE = at(P6, "On the evening"), T_DIV = at(P6, "a Union division"), T_UNAWARE = at(P6, "unaware he was there"),
  T_ATT = at(P6, "Jackson attacked it"), T_BRAW = at(P6, "Brawner's Farm"), T_LEE = at(P6, "before Lee arrived"), T_DUSK = at(P6, "In the dusk"),
  T_CLOSE = at(P6, "close range"), T_THIRD = at(P6, "Nearly a third"), T_EWELL = at(P6, "Ewell lost his leg"), T_KNEW = at(P6, "now Pope knew"), T_BAIT = at(P6, "took the bait");
const S7 = PS(P7), T_HURL = at(P7, "hurled attack after attack"), T_ONE = at(P7, "one division at a time"), T_BACKW = at(P7, "every one was thrown back"),
  T_NOON = at(P7, "Around noon"), T_GAP = at(P7, "through Thoroughfare Gap"), T_RIGHT = at(P7, "on Jackson's right"), T_JAW = at(P7, "half of a jaw"),
  T_SOME = at(P7, "Some Union officers"), T_NOBODY = at(P7, "nobody told Pope"), T_MORN = at(P7, "The next morning"), T_RETR = at(P7, "retreating towards");
const S8 = PS(P8), T_BIG = at(P8, "biggest attack of all"), T_6000 = at(P8, "six thousand men"), T_DEEP = at(P8, "called the Deep Cut"), T_CLOSE8 = at(P8, "so close"),
  T_ROCKS = at(P8, "threw rocks"), T_FOUR = at(P8, "four o'clock"), T_25 = at(P8, "twenty-five thousand"), T_SWEPT = at(P8, "swept forward"),
  T_LARGEST = at(P8, "largest simultaneous"), T_FELL = at(P8, "fell back across Bull Run"), T_DARK = at(P8, "in the dark");
// ---------- map layers: living map + geography (option 2: no territory fill) ----------
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.16 }); LV.shimmer(BR.rivers || [], { width: 1.0 }); LV.scaleBar(14.89); LV.north();
wimg("assets/media/bullrun_geo_ref.png", 0, 0, null);
if (!document.getElementById("fxk-blur")) { const defs = document.createElementNS(NS, "defs"); defs.innerHTML = `<filter id="fxk-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>`; document.getElementById("overlay").insertBefore(defs, document.getElementById("overlay").firstChild); }
// ---------- camera ----------
camTo(0, 3.0, 1440, 800, 2.5, "power2.out");                          // push in from the dive: the turnpike + the Brawner farm
camTo(T_DUSK - 0.4, 3.0, 1430, 790, 3.0);                              // close on the fire line
camTo(S7 - 0.3, 2.2, 1500, 745, 2.3);                                   // 29 Aug: the railroad line
camTo(T_NOON - 0.5, 2.2, 1130, 800, 1.15);                              // wide: Thoroughfare Gap -> the battlefield
camTo(T_SOME - 0.6, 2.0, 1470, 780, 2.2);                               // the jaw
camTo(S8 - 0.2, 2.0, 1500, 760, 2.7);                                   // 30 Aug: the Deep Cut
camTo(T_FOUR - 0.5, 2.4, 1560, 800, 2.0);                               // Longstreet's attack
camTo(T_FELL - 0.6, 2.6, 1800, 760, 1.55);                              // the retreat over Bull Run
const KM = [1440, 810];
camTo(END - 1.3, 1.25, KM[0], KM[1], 0.667, "power2.in");             // = move2c (nova) opening frame at s 5.333
SFX("whoosh", END - 1.1);
// ---------- dates, legend, flags, places ----------
B.showDate(0.05);
B.date("28 AUGUST · EVENING", 0.1, T_DUSK - 0.2, 30); B.date("28 AUGUST · DUSK", T_DUSK - 0.1, S7 - 0.2, 30); B.date("29 AUGUST 1862", S7 - 0.1, T_NOON - 0.2, 32);
B.date("29 AUGUST · NOON", T_NOON - 0.1, T_MORN - 0.2, 30); B.date("30 AUGUST · DAWN", T_MORN - 0.1, S8 - 0.2, 30); B.date("30 AUGUST · 3 PM", S8 - 0.1, T_FOUR - 0.2, 30);
B.date("30 AUGUST · 4 PM", T_FOUR - 0.1, T_FELL - 0.2, 30); B.date("30 AUGUST · NIGHT", T_FELL - 0.1, END + 1, 30);
legend(0.3, END - 1.2);
const FLC = [flag(FL.csa, "CONFEDERATE STATES", ...L(38.845, -77.600), 0.6, T_NOON - 0.4, 44), flag(FL.us, "UNITED STATES", ...L(38.795, -77.520), 0.65, T_NOON - 0.4, 44)];
const FLW = [flag(FL.csa, "CONFEDERATE STATES", ...L(38.865, -77.700), T_NOON + 1.2, T_SOME - 0.4, 96), flag(FL.us, "UNITED STATES", ...L(38.775, -77.470), T_NOON + 1.25, T_SOME - 0.4, 96)];
const FL2 = [flag(FL.csa, "CONFEDERATE STATES", ...L(38.845, -77.595), T_SOME + 1.0, T_FELL - 0.4, 44), flag(FL.us, "UNITED STATES", ...L(38.800, -77.505), T_SOME + 1.05, T_FELL - 0.4, 44)];
const FL3 = [flag(FL.csa, "CONFEDERATE STATES", ...L(38.835, -77.600), T_FELL + 1.0, END - 1.3, 72), flag(FL.us, "UNITED STATES", ...L(38.855, -77.450), T_FELL + 1.05, END - 1.3, 72)];
const PLS = [town("BRAWNER FARM", "brawner", 0.9, { dx: -2, dy: 9 }), town("GROVETON", "groveton", 1.0, { dx: 6, dy: 9 }), town("GAINESVILLE", "gainesville", 1.1, { dx: 0, dy: -9 }),
  town("STONE HOUSE", "stone_house", 1.2, { dx: 0, dy: 9 }), town("SUDLEY CHURCH", "sudley_church", 1.3, { dx: 26, dy: -6 })];
const SRL = box("STONY RIDGE", ...L(38.836, -77.598), 1.4, 6, null, false);
// =====================================================================================================================
// move2-6: Brawner's Farm, 28 Aug evening: King's division on the turnpike; Jackson attacks; the close-range fire fight at dusk
// =====================================================================================================================
const PIKE = BR.pike || [[1038, 991], [1421, 853], [1542, 829]];
// Jackson's men hidden on Stony Ridge (blue counters, half-seen) + guns
const JB = [["tal", 38.8295, -77.578, "JACKSON'S DIV."], ["ewl", 38.8325, -77.560, "EWELL'S DIV."], ["aph", 38.840, -77.545, "A.P. HILL"]];
JB.forEach(([id, la, lo, lb], i) => unit(id, "carth", ...L(la, lo), "infantry", { t: 0.5 + i * 0.1, size: "XX", label: lb }));
tl.set(JB.map(([id]) => B.units[id].el), { opacity: 0.55 }, 1.2);
const GUNS = [["g1", 38.8240, -77.5880], ["g2", 38.8255, -77.5730]];
GUNS.forEach(([id, la, lo], i) => unit(id, "carth", ...L(la, lo), "artillery", { t: T_ATT - 0.4 + i * 0.1, w: 18, h: 12 }));
K.badge({ name: "STONEWALL JACKSON", role: "STONY RIDGE · 28 AUGUST", photo: "assets/media/jackson_head.png", flag: FL.csa, side: "carth", corner: "tl", t: T_WAITN, until: T_BRAW });
// King's division column marching east on the turnpike (Gibbon's brigade leading)
const cum = [0]; for (let j = 1; j < PIKE.length; j++) cum.push(cum[j - 1] + Math.hypot(PIKE[j][0] - PIKE[j - 1][0], PIKE[j][1] - PIKE[j - 1][1]));
const atP = (d) => { let j = 1; while (j < cum.length - 1 && cum[j] < d) j++; const a = PIKE[j - 1], b = PIKE[j], r = (d - cum[j - 1]) / ((cum[j] - cum[j - 1]) || 1); return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r]; };
const dOf = (x) => { let best = 0, bd = 1e9; for (let k = 0; k < 600; k++) { const d = cum[cum.length - 1] * k / 600, q = atP(d); if (Math.abs(q[0] - x) < bd) { bd = Math.abs(q[0] - x); best = d; } } return best; };
const D0 = dOf(1150), D1 = dOf(1440);
const KC = [["k1", "GIBBON"], ["k2", "DOUBLEDAY"], ["k3", "HATCH"]];
KC.forEach(([id, lb], i) => { const q = atP(D0 - i * 38); unit(id, "rome", q[0], q[1], "infantry", { t: T_EVE - 0.6 + i * 0.12, size: "X", label: lb });
  const u = B.units[id], p = { d: D0 - i * 38 }; tl.to(p, { d: D1 - i * 38, duration: T_BRAW - T_EVE, ease: "none", onUpdate: () => { const q2 = atP(p.d); u.el.style.left = q2[0] - u.w / 2 + "px"; u.el.style.top = q2[1] - u.h / 2 + "px"; } }, T_EVE); });
const KING = tag("KING'S DIVISION · MARCHING EAST", ...L(38.800, -77.590), T_DIV - 0.2, "#c4121f", 7, T_DUSK);
const UNAW = tag("UNAWARE", ...L(38.795, -77.574), T_UNAWARE, "#5c564a", 6, T_ATT + 0.6);
// Jackson attacks on purpose: guns fire at the column, then the blue lines come down to the farm
GUNS.forEach(([id], i) => { const g = ux(id); for (let k = 0; k < 3; k++) shoot([g[0] + 6, g[1] - 4], [atP(D1 - 40 * k)[0] + (k % 2 ? 6 : -6), atP(D1 - 40 * k)[1] - 4], T_ATT - 0.2 + i * 0.35 + k * 0.8, { r: 5 }); });
const ONP = tag("ON PURPOSE · HOLD POPE UNTIL LEE ARRIVES", ...L(38.836, -77.548), T_LEE - 0.6, "#1f4fc4", 6, T_DUSK + 0.5);
tl.to(JB.map(([id]) => B.units[id].el), { opacity: 1, duration: 0.4 }, T_ATT);
go("tal", T_BRAW - 0.3, 2.4, L(38.8195, -77.571)); go("ewl", T_BRAW - 0.1, 2.4, L(38.8200, -77.559));
go("k1", T_BRAW + 0.6, 1.4, L(38.8125, -77.566)); go("k2", T_BRAW + 0.8, 1.4, L(38.8128, -77.556)); go("k3", T_BRAW + 1.0, 1.4, L(38.8095, -77.580));
// the fire line at the farm: two-colour front between the lines (~100 yards apart, NPS)
const F28 = LL([[38.8150, -77.5800], [38.8168, -77.5720], [38.8172, -77.5640], [38.8166, -77.5560], [38.8152, -77.5500]]);
const FR28 = K.front({ pts: F28, sideA: "carth", sideB: "rome", t: T_DUSK - 0.6, dur: 1.4, width: 15, glow: 0.47, until: S7 + 0.2 });
const BLINE = LL([[38.8190, -77.578], [38.8195, -77.568], [38.8195, -77.558], [38.8185, -77.551]]), RLINE = LL([[38.8130, -77.578], [38.8145, -77.568], [38.8145, -77.558], [38.8135, -77.551]]);
for (let k = 0; k < 7; k++) { volley(k % 2 ? BLINE : RLINE, T_DUSK + 0.2 + k * 0.95, 7); }
for (let k = 0; k < 4; k++) mg(BLINE[1 + (k % 2)], RLINE[1 + ((k + 1) % 2)], T_CLOSE - 0.4 + k * 1.1, 4);
for (let k = 0; k < 3; k++) mg(RLINE[1 + (k % 2)], BLINE[(k + 1) % 3], T_CLOSE + 0.2 + k * 1.2, 4);
K.impact(...L(38.8160, -77.5655), T_CLOSE + 0.6, { r: 5 }); K.impact(...L(38.8140, -77.5600), T_CLOSE + 1.3, { r: 5 });
const DUSK = GG.layer("background: linear-gradient(to bottom, rgba(40,28,60,0.55), rgba(90,50,40,0.35));", T_DUSK - 0.6, S7 - 0.4, { dur: 3.0, outDur: 1.4 });
const CTH = scr(`<div style="padding:12px 26px 14px;background:rgba(18,16,12,0.93);border-left:8px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 18px 36px rgba(0,0,0,.6)">
  <div style="font-size:16px;letter-spacing:0.28em;color:#c9b48a">BRAWNER'S FARM · NATIONAL PARK SERVICE</div><div style="font-size:42px;letter-spacing:0.05em;line-height:1.08">NEARLY ONE THIRD OF<br><span class="n">0</span> ENGAGED HIT</div></div>`, "left:110px;top:640px;");
slam(CTH, T_THIRD - 0.3, { from: 1.5, shake: 3, until: T_KNEW - 0.1 });
const cn = { v: 0 }, cnn = CTH.querySelector(".n"); tl.to(cn, { v: 7000, duration: 1.0, ease: "power2.out", onUpdate: () => { cnn.textContent = (Math.round(cn.v / 100) * 100).toLocaleString("en-US"); } }, T_THIRD - 0.1);
for (let t = T_THIRD - 0.1; t < T_THIRD + 0.9; t += 0.14) SFX("tick", t);
sstamp("EWELL LOSES A LEG", 470, T_EWELL - 0.1, { size: 34, until: T_KNEW + 0.6, left: 110 });
B.grey(["ewl"], T_EWELL, 0.5); tl.to(B.units.ewl.el, { opacity: 0.85, duration: 0.3 }, T_EWELL + 0.6);
B.caption("POPE TAKES THE BAIT", T_BAIT - 0.4, S7 - 0.1, "carth r");
// =====================================================================================================================
// move2-7: 29 Aug: attacks one after another on the railroad line; noon: Longstreet arrives on Jackson's right; nobody tells Pope
// =====================================================================================================================
B.hideUnits(["k1", "k2", "k3"], S7 - 0.4);
const UNF = BR.unf || [[1406, 747], [1468, 734], [1539, 695], [1582, 614]];
const RRL = UNF.filter((q) => q[0] >= 1380 && q[1] >= 610);
const F29 = RES(RRL.map((q) => [q[0] + 4, q[1] + 6]), 40);                                     // just SE of the railroad bed
const F30 = RES(LL([[38.7960, -77.5280], [38.8040, -77.5320], [38.8110, -77.5350], [38.8180, -77.5400], [38.8240, -77.5450], [38.8300, -77.5430], [38.8360, -77.5390], [38.8412, -77.5360]]), 40);
const FR29 = K.front({ pts: F29, to: F30, moveT: T_SWEPT + 1.2, moveDur: 5.0, sideA: "carth", sideB: "rome", t: S7 - 0.2, dur: 1.6, width: 15, glow: 0.47, until: T_DARK + 0.3 });
glowLine(RRL, "#ffd65a", 1.6, S7 + 0.2, S7 + 6, { dur: 1.2, pulse: 2 });
const RRT = tag("THE UNFINISHED RAILROAD", ...L(38.8335, -77.5640), S7 + 0.6, "#7a6420", 6, T_NOON - 0.4);
JB.forEach(([id], i) => go(id, S7 - 0.2 + i * 0.1, 1.6, [RRL[Math.round((i + 0.5) * (RRL.length - 1) / 3)][0] - 8, RRL[Math.round((i + 0.5) * (RRL.length - 1) / 3)][1] - 12]));
// the Union attacks, one division at a time (SE -> NW), each thrown back
const ATT = [[[38.8180, -77.5380], [38.8270, -77.5420], 0, "SIGEL"], [[38.8130, -77.5470], [38.8235, -77.5545], 1, "HOOKER"], [[38.8250, -77.5310], [38.8350, -77.5395], 2, "KEARNY"], [[38.8100, -77.5570], [38.8210, -77.5640], 3, "RENO"]];
const TA = [T_HURL - 0.4, T_ONE - 0.2, T_ONE + 2.6, T_BACKW - 0.2];
ATT.forEach(([a, b, k, lb], i) => { const A = L(...a), Bp = L(...b), t0 = TA[i]; const id = "u" + i;
  unit(id, "rome", A[0], A[1], "infantry", { t: t0 - 0.5, size: "XX", label: lb });
  tArrow([A, [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2 + 3], Bp], "#c4121f", t0, t0 + 3.0, 2.4, 1.0);
  go(id, t0 + 0.2, 1.0, [A[0] + (Bp[0] - A[0]) * 0.6, A[1] + (Bp[1] - A[1]) * 0.6], "power2.out");
  for (let j = 0; j < 3; j++) mg([Bp[0] - 6, Bp[1] - 6], [A[0] + (Bp[0] - A[0]) * 0.6, A[1] + (Bp[1] - A[1]) * 0.6], t0 + 0.6 + j * 0.5, 4);
  for (let j = 0; j < 2; j++) K.impact(A[0] + (Bp[0] - A[0]) * 0.55 + (j ? 5 : -4), A[1] + (Bp[1] - A[1]) * 0.55 + (j ? -3 : 3), t0 + 0.9 + j * 0.45, { r: 5 });
  go(id, t0 + 1.9, 1.0, A, "power2.in"); B.grey([id], t0 + 1.9, 0.6);
  if (i < 3) wstamp("REPULSED", Bp[0] + 18, Bp[1] + 14, t0 + 2.0, i === 2 ? T_NOON - 0.5 : t0 + 3.4);
  B.hideUnits([id], T_NOON - 0.5); });
// NOON: Longstreet's column through Thoroughfare Gap, along the turnpike, deploying on Jackson's right (one-colour line: not yet in contact)
const WL = [town("THOROUGHFARE GAP", "thoroughfare_gap", T_NOON + 0.2, { dx: 0, dy: -18, size: 13, until: T_SOME - 0.4 }), town("HAYMARKET", "haymarket", T_NOON + 0.3, { dx: 0, dy: -18, size: 11, until: T_SOME - 0.4 })];
tl.to([...PLS, SRL], { autoAlpha: 0, duration: 0.4 }, T_NOON - 0.4); tl.to([...PLS, SRL], { autoAlpha: 1, duration: 0.4 }, T_SOME + 0.8);
const LCOL = LL([[38.8246, -77.7158], [38.8185, -77.6800], [38.8121, -77.6368], [38.7990, -77.6120], [38.8030, -77.5900], [38.8070, -77.5780]]);
glowLine(LCOL, "#2f6fe0", 3, T_GAP - 0.4, T_RIGHT + 4, { dur: 2.6, core: "#cfe0ff" });
const LS = LL([[38.8200, -77.5760], [38.8140, -77.5790], [38.8070, -77.5815], [38.8000, -77.5840], [38.7920, -77.5870]]);
const LSU = [["l1", "HOOD"], ["l2", "KEMPER"], ["l3", "JONES"], ["l4", "WILCOX"]];
LSU.forEach(([id, lb], i) => { unit(id, "carth", ...LCOL[0], "infantry", { t: T_GAP - 0.4 + i * 0.25, size: "XX", label: lb, w: 26, h: 18, fs: 7 });
  const p = { d: 0 }, u = B.units[id], c = [0]; for (let j = 1; j < LCOL.length; j++) c.push(c[j - 1] + Math.hypot(LCOL[j][0] - LCOL[j - 1][0], LCOL[j][1] - LCOL[j - 1][1]));
  tl.to(p, { d: c[c.length - 1], duration: 3.2, ease: "power1.inOut", onUpdate: () => { let j = 1; while (j < c.length - 1 && c[j] < p.d) j++; const a = LCOL[j - 1], b = LCOL[j], r = (p.d - c[j - 1]) / ((c[j] - c[j - 1]) || 1);
    u.el.style.left = a[0] + (b[0] - a[0]) * r - u.w / 2 + "px"; u.el.style.top = a[1] + (b[1] - a[1]) * r - u.h / 2 + "px"; } }, T_GAP - 0.2 + i * 0.35);
  go(id, T_RIGHT + 0.2 + i * 0.15, 1.4, [LS[i + 1][0] - 14, LS[i + 1][1]]); });
const LSF = K.front({ pts: LS, sideA: "carth", sideB: "carth", t: T_RIGHT, dur: 1.4, width: 15, glow: 0.47, until: T_FOUR + 1.2 });
K.badge({ name: "JAMES LONGSTREET", role: "LEE'S RIGHT WING · NOON 29 AUG", photo: "assets/media/longstreet_head.png", flag: FL.csa, side: "carth", corner: "tr", t: T_NOON - 0.2, until: T_SOME - 0.3 });
const JAWT = tag("THE JAW", ...L(38.8040, -77.5960), T_JAW - 0.3, "#1f4fc4", 9, T_MORN);
const JAW = (() => { const g = document.createElementNS(NS, "g"), a = L(38.8412, -77.536), h = L(38.8205, -77.5765), z = L(38.7920, -77.5870);
  g.innerHTML = `<path d="M${a[0]} ${a[1]} L${h[0]} ${h[1]} L${z[0]} ${z[1]}" fill="none" stroke="#ffd65a" stroke-width="2" stroke-dasharray="5 4" style="filter:drop-shadow(0 0 4px #ffd65a)"/>`;
  document.getElementById("overlay").appendChild(g); GG.hide(g); tl.to(g, { autoAlpha: 1, duration: 0.4 }, T_JAW - 0.2); tl.to(g, { opacity: 0.4, duration: 0.6, yoyo: true, repeat: 5 }, T_JAW + 0.3); tl.to(g, { autoAlpha: 0, duration: 0.4 }, T_MORN); return g; })();
const NOB = scr(`<div style="padding:12px 26px 14px;background:rgba(18,16,12,0.93);border-left:8px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 18px 36px rgba(0,0,0,.6)">
  <div style="font-size:16px;letter-spacing:0.28em;color:#ef8a82">SOME UNION OFFICERS KNEW</div><div style="font-size:46px;letter-spacing:0.05em;line-height:1.08">NOBODY TELLS POPE</div></div>`, "left:110px;top:640px;");
slam(NOB, T_NOBODY - 0.3, { from: 1.5, shake: 3, until: T_MORN - 0.1 });
GG.dawn(T_MORN - 0.4, S8 + 1.0);
const HAL = scr(`<div style="max-width:1000px;padding:16px 30px 18px;background:#ece5d3;color:#1a1712;font-family:Oswald;font-weight:700;box-shadow:0 18px 40px rgba(0,0,0,.65);border-top:8px double #1a1712">
  <div style="font-size:17px;letter-spacing:0.28em;color:#6b6252">POPE TO HALLECK, WASHINGTON · DAWN, 30 AUGUST 1862</div><div style="font-size:46px;letter-spacing:0.04em;line-height:1.08">"THE ENEMY IS RETREATING<br>TOWARDS THE MOUNTAINS"</div></div>`, "left:0;right:0;margin:auto;width:760px;top:600px;");
slam(HAL, T_MORN + 0.4, { from: 1.4, sfx: "ref:pop", shake: false, until: S8 - 0.1 });
K.badge({ name: "JOHN POPE", role: "ARMY OF VIRGINIA", photo: "assets/media/pope_head.png", flag: FL.us, side: "rome", corner: "tr", t: T_MORN, until: S8 + 0.2 });
// =====================================================================================================================
// move2-8: 30 Aug: Porter at the Deep Cut; rocks; 4 pm Longstreet's assault; Pope falls back over Bull Run
// =====================================================================================================================
const DC = PL.deep_cut || [1481, 732];
const DCL = town("DEEP CUT", "deep_cut", S8 - 0.2, { dx: -24, dy: -8 });
K.target(DC[0], DC[1], T_DEEP - 0.3, { r: 14, side: "#ffd54a", until: T_ROCKS + 2 });
const POR = [["p1", 38.8105, -77.5470], ["p2", 38.8110, -77.5410], ["p3", 38.8085, -77.5500]];
POR.forEach(([id, la, lo], i) => unit(id, "rome", ...L(la, lo), "infantry", { t: S8 + 0.2 + i * 0.1, size: "XX", label: i === 0 ? "PORTER" : "" }));
const P6K = scr(`<div style="padding:10px 24px 12px;background:rgba(14,12,10,0.9);border-top:6px solid #be3a2a;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 16px 32px rgba(0,0,0,.6)">
  <div style="font-size:16px;letter-spacing:0.3em;color:#ef8a82">PORTER'S ATTACK · 3 PM</div><div style="font-size:58px;line-height:1"><span class="n">0</span>+</div><div style="font-size:15px;letter-spacing:0.22em;color:#d8cfb8">MEN AGAINST THE DEEP CUT</div></div>`, "right:110px;top:300px;");
slam(P6K, T_6000 - 0.3, { from: 1.5, shake: 3, until: T_FOUR - 0.6 });
const pv = { v: 0 }, pn = P6K.querySelector(".n"); tl.to(pv, { v: 6000, duration: 1.1, ease: "power2.out", onUpdate: () => { pn.textContent = (Math.round(pv.v / 100) * 100).toLocaleString("en-US"); } }, T_6000 - 0.1);
for (let t = T_6000 - 0.1; t < T_6000 + 1.0; t += 0.14) SFX("tick", t);
[[[38.8115, -77.5470], [38.8170, -77.5500], [38.8225, -77.5525]], [[38.8118, -77.5410], [38.8180, -77.5440], [38.8238, -77.5480]], [[38.8092, -77.5500], [38.8160, -77.5545], [38.8215, -77.5585]]]
  .forEach((p, i) => tArrow(LL(p), "#c4121f", T_BIG + i * 0.25, T_FOUR, 2.8, 1.4));
POR.forEach(([id], i) => go(id, T_BIG + 0.4 + i * 0.2, 2.6, L(38.8195 + (i === 1 ? 0.001 : 0), [-77.5505, -77.5455, -77.5560][i]), "power1.out"));
// Confederate guns on the Brawner ridge enfilade the attack (gun row -> impacts, shake)
const BG = [["bg1", 38.8190, -77.5720], ["bg2", 38.8170, -77.5745], ["bg3", 38.8150, -77.5770]];
BG.forEach(([id, la, lo], i) => unit(id, "carth", ...L(la, lo), "artillery", { t: S8 + 0.6 + i * 0.1, w: 18, h: 12 }));
BG.forEach(([id], i) => { const g = ux(id); for (let k = 0; k < 4; k++) shoot([g[0] + 6, g[1] - 3], L(38.8150 + (k % 2) * 0.004, -77.552 + ((k + i) % 3) * 0.004), T_DEEP - 0.6 + i * 0.3 + k * 0.85, { r: 5, h: 8 }); });
for (let k = 0; k < 5; k++) mg([DC[0] - 6 + k * 3, DC[1] - 2], L(38.8200, -77.5500 + (k % 3) * 0.002), T_CLOSE8 - 0.6 + k * 0.7, 5);
// out of ammunition: rocks fly over the embankment
const RT = tag("OUT OF AMMUNITION: ROCKS", DC[0] - 40, DC[1] - 22, T_ROCKS - 0.3, "#1f4fc4", 7, T_FOUR);
for (let k = 0; k < 10; k++) { const a = [DC[0] - 20 + k * 5, DC[1] - 2], b = L(38.8205 - (k % 3) * 0.0008, -77.5525 + (k % 4) * 0.0012);
  const r = GG.pin(ROCK, a[0], a[1], {}), t0 = T_ROCKS - 0.2 + k * 0.22;
  tl.fromTo(r, { autoAlpha: 1, left: a[0], top: a[1], rotation: 0 }, { left: b[0], top: b[1], rotation: 240, duration: 0.7, ease: "none", immediateRender: false }, t0);
  tl.fromTo(r, { y: 0 }, { y: -14, duration: 0.35, ease: "sine.out", yoyo: true, repeat: 1, immediateRender: false }, t0); tl.to(r, { autoAlpha: 0, duration: 0.2 }, t0 + 0.75); if (k % 3 === 0) SFX("ref:pop", t0 + 0.7); }
POR.forEach(([id], i) => { go(id, T_FOUR - 1.0 + i * 0.1, 1.2, L(38.8130 + i * 0.001, [-77.5480, -77.5420, -77.5520][i]), "power2.in"); });
// 4 PM: Longstreet's jaw swings shut on the open Union flank
K.badge({ name: "JAMES LONGSTREET", role: "4 PM · 30 AUGUST", photo: "assets/media/longstreet_head.png", flag: FL.csa, side: "carth", corner: "tl", t: T_FOUR - 0.3, until: T_LARGEST - 0.3 });
const L25 = scr(`<div style="padding:10px 24px 12px;background:rgba(14,12,10,0.9);border-top:6px solid #2e5cb2;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 16px 32px rgba(0,0,0,.6)">
  <div style="font-size:16px;letter-spacing:0.3em;color:#9fc0ea">LONGSTREET'S WING</div><div style="font-size:58px;line-height:1"><span class="n">0</span></div><div style="font-size:15px;letter-spacing:0.22em;color:#d8cfb8">MEN · AGAINST THE OPEN FLANK</div></div>`, "right:110px;top:300px;");
slam(L25, T_25 - 0.3, { from: 1.5, shake: 4, until: T_FELL - 0.3 });
const lv = { v: 0 }, ln = L25.querySelector(".n"); tl.to(lv, { v: 25000, duration: 1.2, ease: "power2.out", onUpdate: () => { ln.textContent = "~" + (Math.round(lv.v / 1000) * 1000).toLocaleString("en-US"); } }, T_25 - 0.1);
for (let t = T_25 - 0.1; t < T_25 + 1.1; t += 0.14) SFX("tick", t);
const UF = [["f1", 38.8085, -77.5440, "McDOWELL"], ["f2", 38.8095, -77.5350, ""], ["f3", 38.8030, -77.5390, ""]];
UF.forEach(([id, la, lo, lb], i) => unit(id, "rome", ...L(la, lo), "infantry", { t: T_FOUR - 0.4 + i * 0.1, size: "XX", label: lb }));
tArrow(LL([[38.8040, -77.5800], [38.8010, -77.5650], [38.8020, -77.5480], [38.8080, -77.5340]]), "#1f4fc4", T_SWEPT - 0.4, T_DARK, 6, 2.4);
tArrow(LL([[38.7960, -77.5820], [38.7930, -77.5660], [38.7960, -77.5470], [38.8020, -77.5320]]), "#1f4fc4", T_SWEPT - 0.1, T_DARK, 5, 2.4);
LSU.forEach(([id], i) => go(id, T_SWEPT + i * 0.15, 4.0, L(38.8050 - i * 0.004, -77.5440 + i * 0.002), "power1.inOut"));
// gun rows -> impacts on the Union flank (shake every impact)
const GR = [L(38.8120, -77.5650), L(38.8070, -77.5670), L(38.8020, -77.5690)];
GR.forEach((g, i) => { for (let k = 0; k < 4; k++) shoot(g, L(38.8060 + (k % 2) * 0.004, -77.5420 + ((k + i) % 3) * 0.004), T_SWEPT + 0.2 + i * 0.25 + k * 0.8, { r: 6, h: 10 }); });
for (let k = 0; k < 4; k++) mg(L(38.8040, -77.5520 + k * 0.002), L(38.8075, -77.5420 + k * 0.002), T_LARGEST + k * 0.7, 4);
const NPSQ = scr(`<div style="max-width:1000px;padding:16px 30px 18px;background:rgba(18,16,12,0.93);border-left:8px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 18px 36px rgba(0,0,0,.6)">
  <div style="font-size:17px;letter-spacing:0.3em;color:#9fc0ea">NATIONAL PARK SERVICE</div><div style="font-size:44px;letter-spacing:0.04em;line-height:1.1">"THE LARGEST SIMULTANEOUS MASS ASSAULT OF THE WAR"</div></div>`, "left:0;right:0;margin:auto;width:1000px;top:660px;");
tl.fromTo(NPSQ, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, T_LARGEST - 0.2); SFX("ref:boom", T_LARGEST); K.shake(T_LARGEST + 0.1, 5, 0.4);
tl.to(NPSQ, { autoAlpha: 0, duration: 0.4 }, T_FELL - 0.2);
const CHN = town("CHINN RIDGE", "chinn_ridge", T_SWEPT + 1.0, { dx: 0, dy: 10 }), HEN = town("HENRY HILL", "henry_hill", T_SWEPT + 1.4, { dx: 20, dy: 9 });
// the Union lines collapse back over Bull Run (Stone Bridge) in the dark
B.grey(["f1", "f2", "f3", "p1", "p2", "p3"], T_FELL - 0.4, 0.6);
const SB = PL.stone_bridge || [1769, 740], CV = PL.centreville || [2188, 633];
["f1", "f2", "f3", "p1", "p2", "p3"].forEach((id, i) => { go(id, T_FELL - 0.2 + i * 0.12, 2.2, [SB[0] - 10 + (i % 3) * 8, SB[1] + 6 - (i % 2) * 8]); go(id, T_FELL + 2.2 + i * 0.12, 2.0, [CV[0] - 30 + (i % 3) * 14, CV[1] + 8 - (i % 2) * 12]); });
tArrow([L(38.8100, -77.5300), [SB[0] - 20, SB[1] + 20], SB, [SB[0] + 120, SB[1] - 40], [CV[0] - 40, CV[1]]], "#c4121f", T_FELL, END - 1.2, 3.4, 2.4);
tArrow([L(38.8050, -77.5250), L(38.8000, -77.5050), L(38.8150, -77.4800), [CV[0] - 40, CV[1] + 14]], "#c4121f", T_FELL + 0.3, END - 1.2, 2.8, 2.4);
const SBL = town("STONE BRIDGE", "stone_bridge", T_FELL - 0.4, { dx: 0, dy: -10, size: 9 }), CVL = town("CENTREVILLE", "centreville", T_FELL, { dx: 0, dy: -12, size: 10 });
GG.night(T_FELL + 0.4, null, { dur: 2.4 });
K.night({ lines: [FR29], tOn: T_FELL + 0.4 });
sstamp("RETREAT", 700, T_DARK - 0.2, { size: 64, sub: "POPE'S ARMY ACROSS BULL RUN · NIGHT 30 AUGUST", until: END - 1.2 });
K.raiseTerritory();
B.finish();
