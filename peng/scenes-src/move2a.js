// MOVE 2a (move2-1 .. move2-5), Peng #10: the Second Phase Offensive, 22-28 Nov 1950. Basemap nwkorea_hd_ref (z9, HD relief, dark grade).
// Built with: python3 tools/build_scene.py move2a nwkorea_hd_ref move2-1 move2-5
// WIDE, option 1 (control overlays assets/media/nwk2_ctl_nov24/nov26/nov28_mx.png, tools/make_nwk2_control.py; fronts per date with
// sources in research/FACT_NOTES_move2.md). Peng / PVA = blue (carth), UN / US / ROK = red (rome).
// move2-1 title MOVE 2 · THE CHONGCHON RIVER; the blue armies pull back into the mountains and fade to ghosts (LURE THEM IN arrow);
//         prisoners walk south (22 NOV · 27 PRISONERS FREED); Peng's memoir quote card.
// move2-2 belief card UN ESTIMATE ~70,000 vs OVER 300,000 (ticks), 12 vs 30 divisions; 24 NOV the red arrows go north up the valleys;
//         the gap to X Corps glows; MacArthur badge + communique card; HOME BY CHRISTMAS press card.
// move2-3 Peng badge; XIII ARMY GROUP ~200,000 in a great arc; MAIN BLOW on the 2nd Division; THE OPEN FLANK (ROK II Corps) glows;
//         the arrow at it curls behind the Americans toward Kunu-ri.
// move2-4 25 NOV headline card (HQ bombed, red c47g bomb run on the hut, MAO ANYING KILLED: text only); NIGHT 25 NOV: attacks along
//         the Chongchon (MG + impacts + shake) on the 25th + 2nd Divs (39TH, 40TH ARMIES) and on ROK II Corps (38TH, 42ND ARMIES);
//         26 NOV NOON: ROK counters grey, control 24 -> 26 Nov, front band moves; RIGHT FLANK COLLAPSES.
// move2-5 27-28 NOV: the 38th Army pours through the gap toward Kunu-ri; the Turkish Brigade at Wawon (impacts) pushed back;
//         ring on Kunu-ri; control -> 28 Nov; red withdrawal arrows; ENVELOPMENT; the camera dives onto the kunuri framing (move2b).
// Facts: research/FACT_NOTES.md (Move 2: Mossman ch. IV-VI; Appleman p. 708; Peng's memoir).
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const L = GG.proj(9, 109971, 48858);
const FL = { prc: "assets/media/prc_flag.png", us: "assets/media/us_flag_48star.png", rok: "assets/media/rok_flag_1949.png", un: "assets/media/un_flag.png",
  nk: "assets/media/nk_flag.png", tur: "assets/media/turkey_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const NW = {"f24":[[1039.7,990.5],[1054.6,982.8],[1069.6,975.0],[1084.5,967.2],[1099.4,959.4],[1114.1,951.3],[1128.7,942.9],[1143.1,934.2],[1157.2,924.9],[1170.6,914.8],[1183.2,903.7],[1195.0,891.7],[1205.8,878.8],[1216.3,865.6],[1227.6,853.2],[1240.1,841.9],[1254.1,832.6],[1269.4,825.5],[1285.3,820.2],[1301.6,816.0],[1318.0,812.2],[1334.5,808.7],[1351.0,805.5],[1367.3,801.4],[1383.1,795.7],[1398.2,788.3],[1413.2,780.6],[1428.5,773.6],[1444.2,767.8],[1460.9,766.1],[1477.4,769.2],[1493.2,775.0],[1508.4,782.1],[1523.3,790.0],[1538.3,797.6],[1553.4,805.1],[1568.6,812.4],[1583.1,820.8],[1597.0,830.3],[1609.9,841.0],[1621.4,853.4],[1631.5,866.8],[1640.5,881.0],[1648.8,895.6],[1656.5,910.6],[1664.1,925.6],[1671.8,940.6],[1679.3,955.6],[1686.9,970.6],[1694.4,985.7],[1702.2,1000.6],[1710.4,1015.3],[1719.2,1029.6],[1728.7,1043.5],[1740.1,1055.8],[1754.9,1063.6],[1771.5,1064.9],[1788.0,1061.8],[1800.4,1050.5],[1809.2,1036.3],[1815.8,1020.8],[1820.9,1004.8],[1824.7,988.4],[1827.9,971.9],[1830.4,955.3],[1832.3,938.6],[1834.1,921.8],[1834.6,905.0],[1835.2,888.2],[1835.2,871.4],[1834.6,854.5],[1834.0,837.7],[1832.6,821.0],[1831.0,804.2],[1829.5,787.4],[1828.6,770.6],[1827.9,753.8],[1827.3,737.0],[1827.4,720.2],[1827.6,703.4],[1828.2,686.6],[1829.3,669.8],[1830.4,653.0],[1832.1,636.2],[1834.0,619.5],[1836.1,602.8],[1839.7,586.4],[1843.5,570.0],[1847.9,553.8],[1853.5,537.9],[1859.3,522.1],[1866.5,506.9],[1874.0,491.8],[1882.6,477.4],[1892.1,463.4],[1901.7,449.6],[1911.9,436.3],[1922.1,422.9],[1932.8,409.9],[1943.6,397.0],[1954.5,384.2],[1965.7,371.6],[1977.0,359.2],[1988.3,346.7],[1999.9,334.5],[2011.6,322.4],[2023.4,310.4],[2035.1,298.3],[2046.8,286.2],[2058.5,274.1],[2070.2,262.0],[2081.8,249.8],[2093.5,237.7],[2105.2,225.6],[2116.8,213.5],[2128.5,201.3],[2140.1,189.2],[2151.8,177.0],[2163.4,164.8],[2175.0,152.7],[2187.2,141.1],[2200.4,130.6],[2213.6,120.2],[2227.2,110.3],[2241.6,101.7],[2256.1,93.1],[2270.7,84.8],[2286.1,77.9],[2301.4,71.0],[2316.9,64.3],[2332.8,58.8],[2348.8,53.6],[2364.8,48.5],[2380.7,42.9],[2396.3,36.5],[2411.8,30.2],[2427.4,23.8],[2442.6,16.6],[2457.7,9.2],[2472.8,1.7]],"f26":[[1039.7,990.5],[1054.3,982.3],[1069.0,974.2],[1083.6,966.1],[1098.2,957.9],[1112.7,949.5],[1127.1,940.8],[1141.1,931.7],[1154.7,921.9],[1167.7,911.3],[1179.8,899.7],[1191.4,887.6],[1202.6,875.2],[1213.3,862.3],[1224.8,850.1],[1237.1,838.7],[1251.1,829.5],[1266.5,823.0],[1282.5,818.2],[1298.9,814.9],[1315.5,812.3],[1332.1,810.1],[1348.7,808.3],[1365.3,805.9],[1381.5,801.7],[1397.0,795.3],[1412.6,789.1],[1428.8,785.0],[1444.9,787.2],[1455.7,799.7],[1462.5,815.0],[1467.8,830.9],[1471.9,847.1],[1476.3,863.3],[1481.4,879.3],[1487.2,895.0],[1494.2,910.2],[1502.3,924.8],[1511.5,938.9],[1521.9,952.0],[1533.6,964.0],[1546.2,975.0],[1559.5,985.1],[1573.2,994.8],[1587.2,1004.0],[1601.5,1012.7],[1616.1,1021.0],[1630.9,1028.9],[1645.9,1036.2],[1661.3,1042.9],[1676.9,1049.0],[1692.8,1054.4],[1708.8,1059.1],[1725.1,1063.0],[1741.7,1065.5],[1758.4,1066.4],[1775.1,1064.7],[1790.6,1059.1],[1802.7,1047.8],[1810.9,1033.2],[1816.8,1017.5],[1821.7,1001.5],[1825.3,985.2],[1828.5,968.7],[1830.9,952.1],[1832.6,935.5],[1834.1,918.8],[1834.7,902.1],[1835.3,885.3],[1835.1,868.6],[1834.5,851.8],[1833.9,835.1],[1832.3,818.4],[1830.7,801.7],[1829.3,785.0],[1828.5,768.3],[1827.8,751.5],[1827.3,734.8],[1827.5,718.0],[1827.6,701.3],[1828.3,684.5],[1829.4,667.8],[1830.5,651.1],[1832.3,634.5],[1834.3,617.8],[1836.6,601.2],[1840.1,584.9],[1843.8,568.5],[1848.4,552.4],[1853.9,536.6],[1859.7,520.8],[1867.0,505.8],[1874.6,490.8],[1883.3,476.6],[1892.6,462.7],[1902.3,449.0],[1912.4,435.6],[1922.6,422.3],[1933.2,409.4],[1944.0,396.5],[1954.8,383.8],[1966.0,371.3],[1977.3,358.9],[1988.5,346.5],[2000.1,334.3],[2011.8,322.3],[2023.4,310.3],[2035.1,298.3],[2046.7,286.2],[2058.4,274.2],[2070.0,262.1],[2081.6,250.0],[2093.3,238.0],[2104.9,225.9],[2116.5,213.9],[2128.1,201.8],[2139.6,189.6],[2151.2,177.5],[2162.8,165.4],[2174.4,153.3],[2186.5,141.7],[2199.6,131.3],[2212.7,120.8],[2226.2,111.0],[2240.6,102.3],[2255.0,93.7],[2269.4,85.3],[2284.7,78.5],[2300.0,71.7],[2315.4,64.9],[2331.2,59.3],[2347.1,54.2],[2363.0,49.1],[2378.9,43.6],[2394.4,37.3],[2409.9,31.0],[2425.4,24.6],[2440.7,17.6],[2455.7,10.2],[2470.7,2.8]],"f28":[[1112.1,981.3],[1126.3,973.8],[1140.5,966.5],[1154.7,959.1],[1168.9,951.6],[1183.0,943.9],[1197.1,936.2],[1211.1,928.4],[1224.9,920.3],[1238.5,911.8],[1251.8,902.8],[1264.4,892.9],[1276.5,882.4],[1289.6,873.2],[1303.4,865.1],[1317.8,858.1],[1332.5,851.5],[1347.2,845.1],[1362.0,839.0],[1377.6,835.7],[1393.0,838.8],[1405.3,849.0],[1416.2,860.8],[1426.4,873.2],[1437.4,884.8],[1448.1,896.5],[1452.5,911.9],[1454.4,927.8],[1456.5,943.7],[1459.3,959.5],[1462.9,975.1],[1467.6,990.4],[1474.3,1004.9],[1483.8,1017.8],[1495.8,1028.4],[1508.8,1037.7],[1522.7,1045.7],[1537.1,1052.9],[1551.7,1059.4],[1566.6,1065.3],[1581.7,1070.8],[1596.9,1075.9],[1612.3,1080.4],[1627.8,1084.4],[1643.5,1087.7],[1659.4,1089.5],[1675.4,1089.5],[1691.3,1087.8],[1707.0,1084.4],[1722.2,1079.5],[1737.6,1074.8],[1753.0,1070.5],[1768.5,1066.4],[1784.1,1062.6],[1797.3,1053.8],[1806.7,1040.9],[1813.8,1026.5],[1818.8,1011.3],[1823.2,995.9],[1826.3,980.2],[1829.2,964.4],[1831.2,948.5],[1832.9,932.6],[1834.2,916.6],[1834.8,900.6],[1835.3,884.5],[1835.1,868.5],[1834.5,852.5],[1833.9,836.5],[1832.5,820.5],[1831.0,804.5],[1829.5,788.6],[1828.7,772.6],[1828.0,756.5],[1827.4,740.5],[1827.4,724.5],[1827.6,708.4],[1827.9,692.4],[1828.8,676.4],[1829.9,660.4],[1831.1,644.4],[1833.0,628.5],[1834.9,612.6],[1837.4,596.8],[1841.0,581.1],[1844.5,565.5],[1849.1,550.2],[1854.5,535.1],[1860.1,520.0],[1867.1,505.6],[1874.3,491.3],[1882.5,477.6],[1891.5,464.3],[1900.6,451.1],[1910.3,438.4],[1920.1,425.6],[1930.1,413.1],[1940.4,400.8],[1950.7,388.6],[1961.2,376.5],[1972.0,364.6],[1982.9,352.8],[1993.7,341.0],[2004.8,329.4],[2016.0,317.9],[2027.2,306.4],[2038.3,294.9],[2049.4,283.4],[2060.6,271.9],[2071.8,260.4],[2082.9,248.8],[2094.0,237.3],[2105.1,225.7],[2116.2,214.1],[2127.3,202.5],[2138.4,191.0],[2149.5,179.4],[2160.6,167.8],[2171.6,156.2],[2182.8,144.7],[2195.3,134.7],[2207.9,124.7],[2220.5,114.8],[2234.0,106.3],[2247.8,98.0],[2261.5,89.8],[2275.8,82.5],[2290.5,76.0],[2305.1,69.4],[2319.8,63.0],[2335.0,58.1],[2350.3,53.2],[2365.5,48.2],[2380.7,42.9],[2395.5,36.9],[2410.4,30.8],[2425.2,24.7],[2439.8,18.0],[2454.2,11.0],[2468.5,3.8]],"rivers":[[[1701,564],[1697,571],[1694,579],[1689,586],[1684,592],[1679,599],[1674,608],[1670,616],[1671,624],[1667,627],[1659,626],[1652,631],[1646,629],[1641,631],[1639,639],[1633,634],[1628,641],[1620,645],[1617,649],[1613,659],[1604,662],[1595,666],[1588,661],[1581,666],[1572,671],[1567,680],[1559,681],[1567,684],[1561,692],[1557,693],[1548,689],[1544,697],[1539,704],[1531,706],[1527,713],[1523,723],[1516,729],[1514,737],[1510,741],[1501,744],[1506,751],[1501,757],[1492,761],[1484,770],[1480,778],[1480,783],[1473,788],[1472,796],[1469,804],[1460,806],[1451,815],[1448,823],[1444,831],[1441,840],[1433,844],[1426,851],[1425,861],[1415,865],[1408,874],[1398,881],[1387,881],[1387,890],[1381,894],[1373,897],[1365,906],[1350,915],[1342,920],[1338,929],[1326,936],[1315,939],[1305,941],[1296,941],[1288,947],[1276,954],[1267,956],[1254,965],[1244,964],[1244,964]],[[1348,646],[1348,654],[1349,662],[1348,670],[1349,678],[1353,685],[1362,682],[1365,689],[1373,694],[1381,699],[1389,702],[1394,709],[1402,714],[1401,722],[1393,728],[1390,737],[1383,745],[1391,748],[1399,754],[1396,761],[1396,769],[1394,775],[1385,772],[1384,780],[1387,787],[1387,796],[1378,794],[1373,803],[1371,795],[1364,791],[1366,796],[1367,807],[1360,810],[1351,806],[1357,812],[1359,817],[1356,826],[1363,831],[1365,838],[1357,844],[1349,848],[1352,859],[1345,865],[1347,872],[1355,872],[1357,864],[1363,868],[1363,878],[1372,880],[1376,889],[1372,896],[1373,897]],[[1795,618],[1793,626],[1789,632],[1787,640],[1787,648],[1786,656],[1788,663],[1785,671],[1785,678],[1781,684],[1778,692],[1779,700],[1783,705],[1783,712],[1782,720],[1787,726],[1784,732],[1787,737],[1784,745],[1782,751],[1782,759],[1785,766],[1781,772],[1774,776],[1771,779],[1767,785],[1760,787],[1755,789],[1747,789],[1739,791],[1732,790],[1725,795],[1718,792],[1715,800],[1709,794],[1704,791],[1696,790],[1700,795],[1691,797],[1686,795],[1679,791],[1671,789],[1669,793],[1661,796],[1652,795],[1645,799],[1643,808],[1644,817],[1637,820],[1631,823],[1633,827],[1632,835],[1632,844],[1626,847],[1620,849],[1609,853],[1604,862],[1596,859],[1592,862],[1584,859],[1581,866],[1589,869],[1584,877],[1573,874],[1566,870],[1561,875],[1553,879],[1548,886],[1547,896],[1547,905],[1545,913],[1547,921],[1551,929],[1551,937],[1550,946],[1556,953],[1550,958],[1541,958],[1534,956],[1529,964],[1523,958],[1515,960],[1508,963],[1500,962],[1495,968],[1489,964],[1489,955],[1480,953],[1472,951],[1469,959],[1468,967],[1460,969],[1451,972],[1440,973],[1432,972],[1426,964],[1419,966],[1415,973],[1406,971],[1404,978],[1408,988],[1406,996],[1414,998],[1422,999],[1431,1003],[1431,1013],[1424,1019],[1424,1028],[1421,1036],[1418,1043],[1413,1051],[1420,1056],[1412,1063],[1417,1070],[1426,1074],[1435,1075],[1437,1084],[1433,1092],[1440,1098],[1441,1108],[1448,1116],[1445,1124],[1453,1122],[1451,1130],[1444,1136],[1434,1138],[1425,1141],[1431,1152],[1435,1162],[1436,1171],[1438,1179],[1446,1184],[1442,1190],[1429,1190],[1422,1197],[1419,1206],[1413,1211],[1404,1209],[1398,1213],[1389,1218],[1380,1222],[1372,1219],[1365,1212],[1357,1216],[1353,1226],[1349,1234],[1339,1240],[1330,1235],[1321,1236],[1315,1243],[1308,1251],[1304,1260],[1295,1264],[1292,1272],[1292,1284],[1285,1291],[1275,1295],[1267,1300],[1268,1309],[1270,1318],[1279,1322],[1287,1328],[1288,1339],[1290,1354],[1298,1358],[1302,1365],[1298,1378],[1302,1386],[1304,1395],[1296,1398],[1287,1386],[1280,1375],[1266,1370],[1252,1367],[1239,1364],[1226,1368],[1215,1372],[1183,1382],[1174,1382],[1146,1387],[1142,1387],[1142,1387]],[[1155,661],[1153,668],[1154,676],[1155,684],[1157,693],[1165,692],[1172,693],[1178,696],[1184,694],[1187,703],[1195,700],[1202,704],[1210,705],[1208,713],[1207,719],[1213,722],[1218,729],[1218,738],[1222,730],[1228,734],[1232,740],[1237,745],[1239,755],[1240,760],[1240,767],[1246,766],[1258,760],[1265,761],[1268,769],[1265,778],[1266,789],[1270,797],[1274,803],[1266,808],[1263,818],[1268,823],[1277,824],[1286,826],[1294,831],[1293,842],[1291,849],[1292,860],[1291,869],[1283,878],[1282,887],[1286,895],[1286,904],[1291,915],[1285,921],[1275,925],[1268,931],[1258,926],[1251,938],[1248,946],[1239,957],[1239,957]]]};
// ---------- helpers (Rokossovsky / Collins / hook kit) ----------
const box = (txt, x, y, t, size = 14, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.26em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.6).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const town = (txt, lat, lon, t, o = {}) => { const [x, y] = L(lat, lon); B.city("", x, y, { r: o.r || 4, t, until: o.until }); return box(txt, x + (o.dx || 0), y + (o.dy != null ? o.dy : -16), t, o.size || 11, o.until, false); };
const tag = (txt, x, y, t, c, size = 11, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:${c};color:#f7f3ea;font-family:Oswald;font-weight:700;letter-spacing:.14em;padding:${(size * 0.18).toFixed(1)}px ${(size * 0.5).toFixed(1)}px;font-size:${size}px;white-space:nowrap;border:1px solid #f3eee2;box-shadow:0 2px 6px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 60) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(1, w / 40).toFixed(1)}px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.24).toFixed(1)}px;color:#f7f3ea;text-shadow:0 2px 4px #000">${name}</div></div>`, x, y, { t, until });
const unit = (id, side, lat, lon, icon, fl, o = {}) => {
  const [x, y] = L(lat, lon);
  B.unit({ id, side, x, y, w: o.w || 36, h: o.h || 24, t: o.t, label: o.label });
  K.counter(id, { icon, flag: fl, size: o.size });
  const u = B.units[id], tg = u.el.querySelector(".tag"); if (tg) { tg.style.fontSize = (o.fs || 9) + "px"; tg.style.padding = `0 ${u.h * 0.2}px`; }
  if (o.t == null) gsap.set(u.el, { autoAlpha: 1 });
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const go = (id, t, dur, lat, lon, ease) => { const [x, y] = L(lat, lon); B.move(id, t, dur, x, y, ease || "power1.inOut"); };
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
const slide = (el, t, until, dx = 90) => { tl.fromTo(el, { autoAlpha: 0, x: dx }, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out" }, t); SFX("ref:pop", t + 0.1); if (until != null) tl.to(el, { autoAlpha: 0, x: dx * 0.8, duration: 0.4 }, until); return el; };
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(4, Math.round(size / 9))}px solid ${c};padding:4px 22px 6px;background:rgba(14,12,10,0.74);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.3)}px;letter-spacing:0.22em;color:#f7f3ea;margin-top:2px">${sub}</div>` : ""}</div>`;
const sstamp = (txt, top, t, o = {}) => slam(scr(stampHTML(txt, o.color || "#e3232f", o.size || 64, o.rot || -5, o.sub), `left:0;right:0;top:${top}px;display:flex;justify-content:center;`), t, o);
const legend = (t, until) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "CHINESE &amp; NORTH KOREAN"], ["#be3a2a", "UN COMMAND"]].map(([sq, nm]) => `<span><b style="display:inline-block;width:20px;height:20px;background:${sq};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const wimg = (src, t, dIn, tOut, o = {}) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px" }); if (o.mx) el.style.mixBlendMode = "multiply";
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (t > 0) { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: false }, t); }
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: o.outDur || 1.0 }, tOut);
  return el;
};
// photo badge: K.badge with initials underneath and the licensed photo on top (shows as soon as assets/media/<name>_head.png exists)
const badge = (o) => {
  const el = K.badge(Object.assign({ photo: null }, o)), ring = el.querySelector("div[style*='border-radius:50%']");
  if (ring && o.photoSrc) ring.insertAdjacentHTML("beforeend", `<img src="${o.photoSrc}" onerror="this.style.display='none'" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">`);
  return el;
};
const CW = 1920, CH = 1080, cam = { cx: 1430, cy: 860, s: 1.25 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
applyCam();
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const ghost = (ids, t) => ids.forEach((id, k) => tl.to(B.units[id].el, { opacity: 0.3, filter: "grayscale(1) brightness(1.7)", duration: 0.5 }, t + k * 0.06));
const unghost = (ids, t) => ids.forEach((id, k) => tl.to(B.units[id].el, { opacity: 1, filter: "grayscale(0) brightness(1)", duration: 0.4 }, t + k * 0.06));
const jolt = (ids, t) => ids.forEach((id, k) => tl.to(B.units[id].el, { rotation: k % 2 ? 12 : -12, duration: 0.08, yoyo: true, repeat: 3 }, t + k * 0.12));
const arr = (ll, side, t, o = {}) => B.arrow({ pts: ll.map(([a, b]) => L(a, b)), side, t, dur: o.dur || 1.4, width: o.w || 9, until: o.until, dash: o.dash });
// mortar / shell volley: launch -> arc -> impact (boom + shake on every impact, locked)
const shoot = (from, to, t, o = {}) => { K.gun(from[0], from[1], t, { dx: 0, dy: -2, sfx: o.sfx });
  const dur = o.dur || 0.7; GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 2, h: o.h || 18, impact: false }); K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 9, puffs: 2 }); };
// machine-gun tracers: a burst of short bright dashes from a to b (+ the locked mg sound)
const mg = (a, b, t, n = 5) => { const NS = "http://www.w3.org/2000/svg"; SFX("mg", t);
  for (let k = 0; k < n; k++) { const g = document.createElementNS(NS, "line"), j = ((k * 7) % 5 - 2) * 2.5;
    g.setAttribute("x1", a[0]); g.setAttribute("y1", a[1]); g.setAttribute("x2", b[0] + j); g.setAttribute("y2", b[1] - j);
    g.setAttribute("stroke", "#ffe28a"); g.setAttribute("stroke-width", "2.2"); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-dasharray", "6 60");
    g.style.filter = "drop-shadow(0 0 3px #ffb347)"; document.getElementById("overlay").appendChild(g); GG.hide(g);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 66;
    tl.fromTo(g, { autoAlpha: 1, strokeDashoffset: 0 }, { strokeDashoffset: -len, duration: 0.45, ease: "none", immediateRender: false }, t + k * 0.11);
    tl.to(g, { autoAlpha: 0, duration: 0.05 }, t + k * 0.11 + 0.45); } };
// locked bombing run with the glowing red c47g (US aircraft): the plane passes over the first bomb 1.55 s after the run starts
const run = (tx, ty, ang, t, n = 3, o = {}) => { const v = o.v || 90, c = Math.cos(ang), s = Math.sin(ang), lead = 1.55 * v, len = o.len || 520;
  const p0 = [tx - c * lead, ty - s * lead], p1 = [p0[0] + c * len, p0[1] + s * len];
  const bombs = [...Array(n)].map((_, k) => [tx + c * k * 0.25 * v + (k % 2 ? 2 : -2), ty + s * k * 0.25 * v]);
  K.bombRun({ kind: "c47g", side: "rome", size: o.size || 30, alt: o.alt || 9, pts: [p0, p1], t, dur: len / v, bombs }); return bombs; };
// ---------- times (spoken words) ----------
const P1 = "move2-1", P2 = "move2-2", P3 = "move2-3", P4 = "move2-4", P5 = "move2-5";
const T_HURT = at(P1, "Peng had hurt"), T_SHORT = at(P1, "short of food"), T_PULL = at(P1, "pulled his armies back"), T_FREE = at(P1, "set some American prisoners free"),
  T_SMALL = at(P1, "only a small force"), T_WROTE = at(P1, "Peng later wrote"), T_LURE = at(P1, "lure him deep");
const S2 = PS(P2), T_70 = at(P2, "seventy thousand"), T_4X = at(P2, "more than four times"), T_24 = at(P2, "On the twenty-fourth"), T_NORTH = at(P2, "set off north again"),
  T_FINAL = at(P2, "final offensive"), T_MAC = at(P2, "MacArthur flew"), T_ENDW = at(P2, "for all practical purposes"), T_XMAS = at(P2, "home by Christmas");
const S3 = PS(P3), T_200 = at(P3, "two hundred thousand"), T_HIDDEN = at(P3, "hidden in the mountains"), T_WHOLE = at(P3, "hit the whole line"), T_HEAVY = at(P3, "heaviest blows"),
  T_2ID = at(P3, "Second Infantry Division"), T_RIGHT = at(P3, "But on the right"), T_ROK = at(P3, "South Korean Second Corps"), T_ONCE = at(P3, "broken once"),
  T_GAVE = at(P3, "If that flank gave way"), T_BEHIND = at(P3, "swing in behind");
const S4 = PS(P4), T_HQ = at(P4, "American bombers hit"), T_DEAD = at(P4, "Among the dead"), T_MAO = at(P4, "Mao Anying"), T_NIGHT = at(P4, "That night"), T_ALONG = at(P4, "Along the Chongchon"),
  T_BUGLE = at(P4, "bugles sounded"), T_CENTRE = at(P4, "hit the American divisions"), T_RIGHT4 = at(P4, "Out on the right"), T_TWO = at(P4, "two Chinese armies"),
  T_NOON = at(P4, "By noon the next day"), T_FOLD = at(P4, "its front had folded"), T_GONE = at(P4, "The right flank of the entire");
const S5 = PS(P5), T_POUR = at(P5, "poured through the gap"), T_SW = at(P5, "swung south-west"), T_KUN = at(P5, "crossroads at Kunu-ri"), T_ROADS = at(P5, "roads leading south"),
  T_TURK = at(P5, "A Turkish brigade"), T_HARD = at(P5, "fought hard"), T_PUSHED = at(P5, "pushed back"), T_28 = at(P5, "On the twenty-eighth"), T_RETREAT = at(P5, "began to retreat");
// ---------- map layers (bottom -> top): territory (multiply, per date), living map, emblem, geography ----------
const C24 = wimg("assets/media/nwk2_ctl_nov24_mx.png", 0, 0, T_NOON + 0.6, { mx: true, outDur: 1.0 });
const C26 = wimg("assets/media/nwk2_ctl_nov26_mx.png", T_NOON + 0.4, 1.0, T_28 + 0.3, { mx: true, outDur: 1.0 });
const C28 = wimg("assets/media/nwk2_ctl_nov28_mx.png", T_28 + 0.1, 1.0, END - 1.5, { mx: true, outDur: 1.0 });
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.2 }); LV.shimmer(NW.rivers || [], { width: 1.4 }); LV.scaleBar(234.56); LV.north();
const EM = L(40.80, 124.95);   // PRC emblem on Manchuria (north of the Yalu), fixed for the whole scene
const EMB = document.createElement("img"); EMB.className = "wimg"; EMB.src = "assets/media/emblem_prc.png"; EMB.alt = ""; EMB.onerror = () => { EMB.style.display = "none"; };
Object.assign(EMB.style, { left: EM[0] - 85 + "px", top: EM[1] - 85 + "px", width: "170px", height: "170px", opacity: 0.8 }); worldEl.insertBefore(EMB, document.getElementById("overlay"));
wimg("assets/media/nwkorea_geo_ref.png", 0, 0, null);
// ---------- camera ----------
camTo(0, S2 - 0.5, 1415, 845, 1.36);
camTo(T_NORTH - 0.4, 2.6, 1500, 860, 1.06);                              // wider: the whole UN line, the gap, X Corps
camTo(S3 + 0.4, 2.4, 1440, 860, 1.9);                                    // push in on the Chongchon front
camTo(S4 - 0.2, 1.6, 1330, 770, 2.15);                                   // Peng's HQ in the mountains
camTo(T_NIGHT - 0.3, 2.0, 1450, 845, 2.05);                              // the night attack along the whole line
camTo(T_RIGHT4 - 0.2, 1.8, 1500, 845, 2.2);                             // the right flank (Tokchon)
camTo(S5 + 0.2, 2.2, 1450, 900, 2.25);                                   // the gap, Kunu-ri, the roads south
const KM = L(39.50, 125.93);                                              // = move2b (kunuri z12) opening frame at s 0.667
camTo(END - 1.6, 1.58, KM[0], KM[1], 5.333, "power2.in");
SFX("whoosh", END - 1.3);
// ---------- dates, legend, flags, places ----------
B.showDate(0.05);
B.date("MID-NOVEMBER 1950", 0.1, T_FREE - 0.3, 32); B.date("22 NOVEMBER 1950", T_FREE - 0.2, S2 + 1.2, 32); B.date("LATE NOVEMBER 1950", S2 + 1.3, T_24 - 0.2, 32);
B.date("24 NOVEMBER 1950", T_24 - 0.1, S4 - 0.2, 32); B.date("25 NOVEMBER 1950", S4 - 0.1, T_NIGHT - 0.2, 32); B.date("25 NOVEMBER · NIGHT", T_NIGHT - 0.1, T_NOON - 0.2, 30);
B.date("26 NOVEMBER · NOON", T_NOON - 0.1, S5 - 0.2, 30); B.date("27 NOVEMBER 1950", S5 - 0.1, T_28 - 0.2, 32); B.date("28 NOVEMBER 1950", T_28 - 0.1, END + 1, 32);
legend(0.2, END - 1.4);
const WIDEF = [flag(FL.prc, "CHINA", ...L(40.45, 124.62), 0.3, S3 + 0.6, 70), flag(FL.nk, "NORTH KOREA", ...L(40.25, 126.95), 0.35, S3 + 0.6, 60),
  flag(FL.us, "USA", ...L(39.30, 126.05), 0.4, S3 + 0.6, 70), flag(FL.rok, "SOUTH KOREA", ...L(39.32, 125.45), 0.45, S3 + 0.6, 60),
  flag(FL.un, "UNITED NATIONS", ...L(39.55, 127.55), 0.5, S3 + 0.6, 60)];
// close set (from the push-in): both sides' flags on their own ground
const CLOSEF = [flag(FL.prc, "CHINA", ...L(40.12, 126.25), S3 + 1.4, END - 1.4, 40), flag(FL.us, "USA", ...L(39.52, 125.62), S3 + 1.5, END - 1.4, 40),
  flag(FL.rok, "SOUTH KOREA", ...L(39.55, 126.38), S3 + 1.6, END - 1.4, 34)];
const PL = [town("KUNU-RI", 39.700, 125.900, 0.8, { dx: -38, dy: 14 }), town("TOKCHON", 39.766, 126.313, 0.9, { dx: 30, dy: 14 }), town("UNSAN", 39.96, 125.83, 1.0, { dx: -30, dy: -14 }),
  town("ANJU", 39.617, 125.661, 1.05, { dx: -26, dy: 14 }), town("SUNCHON", 39.420, 125.948, 1.1, { dx: 34, dy: 12 })];
const CHOS = box("CHOSIN RESERVOIR", ...L(40.62, 127.20), 1.2, 11, S3 + 0.6, false);
// the front (wide campaign map: always two-coloured), 24 -> 26 Nov (moves when the ROK II Corps folds), then 26 -> 28 Nov
const FRA = K.front({ pts: NW.f24, to: NW.f26, moveT: T_FOLD - 0.6, moveDur: 3.0, sideA: "carth", sideB: "rome", t: 0.2, dur: 1.6, width: 15, glow: 0.47, until: T_28 - 0.1 });
const FRB = K.front({ pts: NW.f26, to: NW.f28, moveT: T_28 + 0.1, moveDur: 3.0, sideA: "carth", sideB: "rome", t: T_28 - 0.2, dur: 0.01, width: 15, glow: 0.47, until: END - 1.4 });
gsap.set(FRB, { autoAlpha: 0 }); tl.to(FRB, { autoAlpha: 1, duration: 0.01 }, T_28 - 0.2);
// =====================================================================================================================
// move2-1: the Chinese vanish into the mountains (ghosts), prisoners walk south, Peng's memoir
// =====================================================================================================================
B.title("MOVE 2", "THE CHONGCHON RIVER", "NOVEMBER 1950", 0.3, T_SHORT - 0.3); SFX("ref:boom", 0.4);
// blue armies sit close to the UN line (where move 1 left them), then pull back north into the mountains
const BL = [["b50", 39.82, 125.32, 40.05, 125.30], ["b66", 39.97, 125.58, 40.18, 125.55], ["b39", 40.02, 125.86, 40.22, 125.85], ["b40", 40.06, 126.08, 40.28, 126.10],
  ["b38", 39.96, 126.38, 40.15, 126.45], ["b42", 39.78, 126.62, 39.98, 126.75], ["b20", 40.45, 127.00, 40.62, 126.92]];
BL.forEach(([id, la, lo], i) => unit(id, "carth", la, lo, i % 3 === 1 ? "mech" : "infantry", FL.prc, { t: 0.5 + i * 0.07, size: "XXX" }));
SFX("ref:pop", 0.6);
BL.forEach(([id, , , la2, lo2], i) => go(id, T_PULL - 0.2 + i * 0.1, 2.6, la2, lo2, "power2.inOut"));
ghost(BL.map((b) => b[0]), T_PULL + 2.2);
arr([[40.00, 125.55], [40.12, 125.75], [40.24, 125.95]], "carth", T_PULL + 0.3, { w: 8, dur: 1.6, until: S2 + 0.6, dash: "3 12" });
const LURE = tag("PULL BACK · LURE THEM IN", ...L(40.36, 125.92), T_PULL + 1.6, "#1f4fc4", 12, S2 + 0.6);
// UN line on the Chongchon (red, small): they will start north on 24 Nov
const RD = [["u24", 39.60, 125.26, 39.68, 125.30, FL.us, "24TH DIV"], ["r1", 39.74, 125.52, 39.82, 125.52, FL.rok, "ROK 1ST"], ["u25", 39.76, 125.82, 39.88, 125.84, FL.us, "25TH DIV"],
  ["u2", 39.80, 126.02, 39.94, 126.05, FL.us, "2ND DIV"], ["r7", 39.74, 126.20, 39.88, 126.22, FL.rok, "ROK 7TH"], ["r8", 39.66, 126.40, 39.80, 126.42, FL.rok, "ROK 8TH"],
  ["mar", 40.30, 127.30, 40.43, 127.17, FL.us, "1ST MARINES"], ["u7", 40.95, 127.90, 41.15, 128.10, FL.us, "7TH DIV"]];
RD.forEach(([id, la, lo, , , f, lb], i) => unit(id, "rome", la, lo, i === 3 ? "tank" : "infantry", f, { t: 0.6 + i * 0.07, size: "XX", label: lb }));
const R6 = unit("r6", "rome", 39.70, 126.30, "infantry", FL.rok, { t: T_RIGHT, size: "XX", label: "ROK 6TH" });
// prisoners freed (22 Nov): small figures walk south across the line to the UN side
const PRIS = `<svg width="9" height="16" viewBox="0 0 9 16" style="display:block;filter:drop-shadow(0 1px 2px #000)"><circle cx="4.5" cy="2.6" r="2.3" fill="#f7f3ea"/><path d="M1.5 6 L7.5 6 L7 11 L6 16 L4.8 16 L4.5 11.5 L4.2 16 L3 16 L2 11 Z" fill="#f7f3ea"/></svg>`;
for (let k = 0; k < 5; k++) { const a = L(40.02 + (k % 2) * 0.02, 125.80 + k * 0.035), b = L(39.84 + (k % 2) * 0.015, 125.80 + k * 0.03);
  const el = GG.pin(PRIS, a[0], a[1], { t: T_FREE + k * 0.12 }); tl.to(el, { left: b[0], top: b[1], duration: 3.6, ease: "none" }, T_FREE + 0.3 + k * 0.12); tl.to(el, { autoAlpha: 0, duration: 0.5 }, S2 + 0.6); }
const PF = scr(`<div style="padding:12px 24px 14px;background:rgba(18,16,12,0.92);border-left:7px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 14px 30px rgba(0,0,0,.6)">
  <div style="font-size:18px;letter-spacing:0.3em;color:#c9b48a">22 NOV 1950</div><div style="font-size:40px;letter-spacing:0.06em;line-height:1.1">27 PRISONERS FREED</div>
  <div style="font-size:16px;letter-spacing:0.2em;color:#d8cfb8">A SMALL FORCE, ALREADY PULLING OUT?</div></div>`, "left:110px;top:640px;");
slide(PF, T_FREE + 0.4, T_WROTE - 0.3, -90);
// Peng's memoir (verbatim, PB p. 476)
const Q = scr(`<div style="max-width:980px;padding:18px 30px 20px;background:rgba(18,16,12,0.93);border-left:8px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 18px 36px rgba(0,0,0,.6)">
  <div style="font-size:18px;letter-spacing:0.3em;color:#9fc0ea">PENG DEHUAI · MEMOIRS</div>
  <div style="font-size:40px;letter-spacing:0.04em;line-height:1.15">"PURPOSELY SHOWING OURSELVES TO BE WEAK ... LURING HIM DEEP INTO OUR AREAS"</div></div>`, "left:0;right:0;margin:auto;width:980px;top:700px;");
tl.fromTo(Q, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, T_WROTE + 0.2); SFX("ref:pop", T_WROTE + 0.3);
tl.to(Q, { autoAlpha: 0, duration: 0.4 }, S2 - 0.3);
// =====================================================================================================================
// move2-2: the belief (70,000) vs the real number; 24 Nov the UN goes north; MacArthur
// =====================================================================================================================
const BEL = scr(`<div style="display:flex;gap:34px;padding:16px 34px 18px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 18px 36px rgba(0,0,0,.6)">
  <div style="text-align:center"><div style="font-size:18px;letter-spacing:0.26em;color:#ef8a82">UN ESTIMATE</div><div style="font-size:84px;line-height:1">~70,000</div><div style="font-size:18px;letter-spacing:0.2em;color:#d8cfb8">CHINESE IN KOREA</div><div class="d1" style="font-size:22px;letter-spacing:0.16em;color:#ef8a82;margin-top:6px">12 DIVISIONS</div></div>
  <div style="width:3px;background:#5c564a"></div>
  <div class="real" style="text-align:center"><div style="font-size:18px;letter-spacing:0.26em;color:#9fc0ea">IN FACT</div><div class="n" style="font-size:84px;line-height:1">70,000</div><div style="font-size:18px;letter-spacing:0.2em;color:#d8cfb8">AND MORE</div><div class="d2" style="font-size:22px;letter-spacing:0.16em;color:#9fc0ea;margin-top:6px">30 DIVISIONS</div></div></div>`,
  "left:0;right:0;margin:auto;width:640px;top:180px;");
slam(BEL, T_70 - 0.2, { from: 1.6, shake: 4 });
const RL = BEL.querySelector(".real"), RN = BEL.querySelector(".n"), D2 = BEL.querySelector(".d2"); gsap.set([RL], { autoAlpha: 0 });
tl.to(RL, { autoAlpha: 1, duration: 0.3 }, T_4X - 0.3);
const cv = { v: 70000 }; tl.to(cv, { v: 300000, duration: 2.2, ease: "power2.out", onUpdate: () => { RN.textContent = (Math.round(cv.v / 1000) * 1000).toLocaleString("en-US") + (cv.v > 299000 ? "+" : ""); } }, T_4X);
for (let t = T_4X; t < T_4X + 2.1; t += 0.14) SFX("tick", t);
SFX("hit", T_4X + 2.25); K.shake(T_4X + 2.25, 4, 0.3);
tl.fromTo(D2, { scale: 1.6 }, { scale: 1, duration: 0.25, ease: "power4.in", immediateRender: false }, T_4X + 2.4);
tl.to(BEL, { autoAlpha: 0, y: -30, duration: 0.35 }, T_FINAL - 0.2);
// 24 Nov: the red divisions start north again up the valleys (arrows), the X Corps far to the east; the gap glows
RD.slice(0, 6).forEach(([id, , , la2, lo2], i) => go(id, T_NORTH + i * 0.1, 3.0, la2, lo2, "power1.inOut"));
const NA = [[[39.62, 125.24], [39.72, 125.27], [39.80, 125.25]], [[39.76, 125.50], [39.86, 125.50], [39.93, 125.48]], [[39.78, 125.84], [39.90, 125.85], [39.98, 125.86]],
  [[39.82, 126.04], [39.95, 126.08], [40.05, 126.12]], [[39.76, 126.22], [39.88, 126.25], [39.96, 126.28]], [[39.68, 126.42], [39.79, 126.45], [39.87, 126.50]]];
NA.forEach((p, i) => arr(p, "rome", T_NORTH + 0.2 + i * 0.12, { w: 7, dur: 1.4, until: S3 + 1.0 }));
const CORPS = [tag("I CORPS", ...L(39.56, 125.40), T_NORTH + 0.6, "#c4121f", 12, S3 + 0.6), tag("IX CORPS", ...L(39.66, 125.95), T_NORTH + 0.8, "#c4121f", 12, S3 + 0.6),
  tag("ROK II CORPS", ...L(39.58, 126.40), T_NORTH + 1.0, "#c4121f", 12, S3 + 0.6), tag("X CORPS", ...L(40.18, 127.55), T_NORTH + 1.2, "#c4121f", 12, S3 + 0.6),
  tag("EIGHTH ARMY", ...L(39.42, 125.75), T_NORTH + 0.4, "#8e1018", 14, S3 + 0.6)];
// the gap between the Eighth Army and X Corps: a glowing band through the empty mountains
const GAP = (() => { const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g"); const c = L(39.95, 126.85);
  g.innerHTML = `<ellipse cx="${c[0]}" cy="${c[1]}" rx="70" ry="150" transform="rotate(-18 ${c[0]} ${c[1]})" fill="rgba(255,214,90,0.10)" stroke="#ffd65a" stroke-width="3" stroke-dasharray="10 8" style="filter:drop-shadow(0 0 8px #ffd65a)"/>`;
  document.getElementById("overlay").appendChild(g); GG.hide(g); tl.to(g, { autoAlpha: 1, duration: 0.5 }, T_FINAL - 0.2); tl.to(g, { opacity: 0.45, duration: 0.8, yoyo: true, repeat: 5 }, T_FINAL + 0.4); tl.to(g, { autoAlpha: 0, duration: 0.5 }, S3 + 0.6); return g; })();
const GAPT = tag("THE GAP", ...L(39.95, 126.86), T_FINAL + 0.1, "#7a6420", 12, S3 + 0.6);
badge({ name: "DOUGLAS MACARTHUR", role: "UN COMMANDER", photoSrc: "assets/media/macarthur_head_cut.png", initials: "DM", flag: "us", side: "rome", corner: "tr", t: T_MAC - 0.2, until: S3 - 0.2 });
const MQ = scr(`<div style="padding:14px 28px 16px;background:rgba(18,16,12,0.93);border-left:8px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 18px 36px rgba(0,0,0,.6)">
  <div style="font-size:18px;letter-spacing:0.28em;color:#ef8a82">MACARTHUR · COMMUNIQUE · 24 NOV 1950</div><div style="font-size:46px;letter-spacing:0.05em;line-height:1.08">"SHOULD FOR ALL PRACTICAL PURPOSES<br>END THE WAR"</div></div>`, "left:110px;top:640px;");
slam(MQ, T_ENDW - 0.2, { from: 1.6, shake: 4, until: S3 - 0.3 });
const XM = scr(`<div style="transform:rotate(-3deg);padding:8px 20px 10px;background:#ece5d3;color:#1a1712;font-family:Oswald;font-weight:700;box-shadow:0 10px 24px rgba(0,0,0,.6)"><div style="font-size:15px;letter-spacing:0.28em;color:#6b6252">TALK IN THE RANKS</div><div style="font-size:42px;letter-spacing:0.08em;line-height:1.05">HOME BY CHRISTMAS</div></div>`, "left:180px;top:850px;");
slam(XM, T_XMAS, { from: 1.7, shake: 3, sfx: "ref:pop", until: S3 - 0.3 });
tl.to([CHOS], { autoAlpha: 0, duration: 0.4 }, S3 + 0.6);
// =====================================================================================================================
// move2-3: Peng's plan: the XIII Army Group in a great arc; main blow on the 2nd Division; the open flank
// =====================================================================================================================
badge({ name: "PENG DEHUAI", role: "CHINESE PEOPLE'S VOLUNTEERS", photoSrc: "assets/media/peng_head.png", initials: "PD", flag: "prc", side: "carth", corner: "tl", t: S3 + 0.3, until: T_HEAVY - 0.2 });
// the ghosts wake up and move forward into a great arc in the mountains (just north of the UN line)
const ARC = [["b50", 39.86, 125.33], ["b66", 39.99, 125.58], ["b39", 40.04, 125.84], ["b40", 40.10, 126.06], ["b38", 40.01, 126.36], ["b42", 39.80, 126.66]];
unghost(BL.map((b) => b[0]), T_200 - 0.3);
ARC.forEach(([id, la, lo], i) => go(id, T_200 - 0.2 + i * 0.08, 1.8, la, lo, "power2.out"));
B.hideUnits(["b20"], T_200);
const AN = [["50TH", "b50"], ["66TH", "b66"], ["39TH", "b39"], ["40TH", "b40"], ["38TH", "b38"], ["42ND", "b42"]];
const ANL = AN.map(([n, id], i) => { const a = ARC.find((q) => q[0] === id); return tag(n + " ARMY", ...L(a[1] + 0.06, a[2]), T_200 + 1.4 + i * 0.1, "#1f4fc4", 10, T_NOON); });
const XIII = scr(`<div style="padding:10px 26px 12px;background:rgba(14,12,10,0.9);border-top:6px solid #2e5cb2;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 16px 32px rgba(0,0,0,.6)">
  <div style="font-size:18px;letter-spacing:0.3em;color:#9fc0ea">XIII ARMY GROUP</div><div class="n" style="font-size:64px;line-height:1">0</div><div style="font-size:16px;letter-spacing:0.22em;color:#d8cfb8">MEN HIDDEN IN THE MOUNTAINS</div></div>`, "right:120px;top:170px;");
slam(XIII, T_200 - 0.1, { from: 1.6, shake: 4, until: T_WHOLE + 0.2 });
const xv = { v: 0 }, xn = XIII.querySelector(".n"); tl.to(xv, { v: 200000, duration: 1.8, ease: "power2.out", onUpdate: () => { xn.textContent = "~" + (Math.round(xv.v / 1000) * 1000).toLocaleString("en-US"); } }, T_200 + 0.1);
for (let t = T_200 + 0.1; t < T_200 + 1.8; t += 0.14) SFX("tick", t);
// "hit the whole line at once": short arrows all along the front (dashed = the plan)
const PLAN = [[[39.92, 125.33], [39.80, 125.31]], [[40.04, 125.58], [39.90, 125.54]], [[40.09, 125.84], [39.95, 125.84]], [[40.15, 126.06], [40.00, 126.06]],
  [[40.06, 126.36], [39.94, 126.30]], [[39.84, 126.70], [39.78, 126.52]]];
PLAN.forEach((p, i) => arr(p, "carth", T_WHOLE + i * 0.1, { w: 6, dur: 0.9, until: T_NIGHT - 0.4 }));
// heaviest blows: the centre, the US 2nd Division
arr([[40.20, 126.02], [40.08, 126.06], [39.97, 126.05]], "carth", T_HEAVY, { w: 13, dur: 1.2, until: T_NIGHT - 0.4 });
const MB = tag("MAIN BLOW", ...L(40.22, 126.20), T_2ID - 0.3, "#1f4fc4", 13, T_NIGHT - 0.4);
K.target(...ux("u2"), T_2ID, { r: 34, side: "rome", until: T_RIGHT });
// the right flank glows: ROK II Corps
const FLANK = (() => { const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g"); const c = L(39.78, 126.32);
  g.innerHTML = `<ellipse cx="${c[0]}" cy="${c[1]}" rx="62" ry="40" transform="rotate(-25 ${c[0]} ${c[1]})" fill="rgba(255,214,90,0.12)" stroke="#ffd65a" stroke-width="3" stroke-dasharray="9 7" style="filter:drop-shadow(0 0 8px #ffd65a)"/>`;
  document.getElementById("overlay").appendChild(g); GG.hide(g); tl.to(g, { autoAlpha: 1, duration: 0.4 }, T_RIGHT); tl.to(g, { opacity: 0.5, duration: 0.7, yoyo: true, repeat: 7 }, T_RIGHT + 0.4); tl.to(g, { autoAlpha: 0, duration: 0.4 }, T_NIGHT); return g; })();
const OF = tag("THE OPEN FLANK", ...L(39.62, 126.62), T_ROK, "#7a6420", 13, T_NIGHT);
const BR1 = scr(`<div style="padding:8px 18px 10px;background:rgba(18,16,12,0.9);border-left:6px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea"><div style="font-size:15px;letter-spacing:0.24em;color:#ef8a82">ROK II CORPS</div><div style="font-size:26px;letter-spacing:0.06em">ALREADY BROKEN ONCE · NOV 1950</div></div>`, "left:110px;top:640px;");
slide(BR1, T_ONCE - 0.6, T_GAVE + 0.8, -90);
// if it gives way: the arrow at the flank curls in behind the Americans, toward Kunu-ri
arr([[40.03, 126.42], [39.84, 126.36], [39.72, 126.18], [39.70, 125.98]], "carth", T_GAVE + 0.2, { w: 11, dur: 2.2, until: T_NIGHT - 0.4, dash: "14 10" });
const BH = tag("BEHIND THE AMERICANS", ...L(39.62, 126.10), T_BEHIND, "#1f4fc4", 12, T_NIGHT - 0.4);
// =====================================================================================================================
// move2-4: 25 Nov, Peng's HQ bombed; the night attack; noon 26 Nov the right flank folds
// =====================================================================================================================
const HQ = L(40.22, 125.55);
const HUT = GG.pin(`<svg width="34" height="28" viewBox="0 0 34 28" style="display:block;filter:drop-shadow(0 2px 3px #000)"><path d="M2 13 L17 2 L32 13 Z" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2"/><rect x="6" y="13" width="22" height="13" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2"/><rect x="14" y="17" width="6" height="9" fill="#f3eee2"/></svg>`, HQ[0], HQ[1], { t: S4 + 0.2, pop: true, until: T_NIGHT });
const HQL = tag("PENG'S HQ", HQ[0], HQ[1] - 30, S4 + 0.3, "#1f4fc4", 11, T_NIGHT);
const hb = run(HQ[0] - 10, HQ[1] + 4, -0.5, T_HQ - 1.0, 3, { size: 34, v: 80 });
run(HQ[0] + 14, HQ[1] - 8, -0.9, T_HQ + 0.4, 2, { size: 30, v: 80 });
tl.to(HUT, { filter: "grayscale(1) brightness(0.5)", duration: 0.4 }, T_HQ + 0.8);
for (let k = 0; k < 6; k++) K.smoke(HQ[0], HQ[1] - 4, T_HQ + 0.9 + k * 0.9, { n: 3, r: 10, rise: 34, life: 2.6 });
const HL = scr(`<div style="width:720px;padding:16px 28px 18px;background:#ece5d3;color:#1a1712;font-family:Oswald;font-weight:700;box-shadow:0 18px 40px rgba(0,0,0,.65);border-top:8px double #1a1712">
  <div style="font-size:17px;letter-spacing:0.3em;color:#6b6252">25 NOVEMBER 1950</div><div style="font-size:52px;letter-spacing:0.04em;line-height:1.05">PENG'S HQ BOMBED</div>
  <div class="m" style="font-size:30px;letter-spacing:0.08em;color:#8e1018;margin-top:4px">MAO ANYING KILLED · ELDEST SON OF MAO ZEDONG</div></div>`, "left:110px;top:640px;transform-origin:20% 50%;");
slam(HL, T_HQ + 0.6, { from: 1.5, sfx: "ref:pop", shake: false, until: T_NIGHT - 0.3 });
const HLM = HL.querySelector(".m"); gsap.set(HLM, { autoAlpha: 0 }); tl.fromTo(HLM, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power4.in", immediateRender: false }, T_MAO - 0.1); SFX("hit", T_MAO + 0.15);
// NIGHT 25 Nov
const NIGHT = GG.night(T_NIGHT - 0.4, T_NOON - 0.2, { dur: 1.6, outDur: 2.2 });
K.night({ lines: [FRA], tOn: T_NIGHT - 0.4, tOff: T_NOON - 0.2 });
B.snow(T_NIGHT, T_NOON + 1.0);
B.caption("BUGLES IN THE DARK", T_BUGLE - 0.2, T_RIGHT4 - 0.2, "carth r");
// the centre: 39th Army on the 25th Division, 40th Army on the 2nd Division
const CA = [[["b39"], [[40.04, 125.84], [39.93, 125.85]]], [["b40"], [[40.10, 126.06], [39.97, 126.06]]]];
CA.forEach(([, p], i) => arr(p, "carth", T_ALONG + i * 0.2, { w: 12, dur: 1.0, until: T_NOON + 1.0 }));
[["b39", "u25"], ["b40", "u2"], ["b66", "r1"]].forEach(([a, b], i) => { const A = ux(a), Bp = ux(b);
  for (let k = 0; k < 4; k++) mg([A[0] + (k % 2) * 6, A[1] + 8], [Bp[0] + ((k * 5) % 7) - 3, Bp[1] - 4], T_CENTRE - 0.6 + i * 0.5 + k * 1.3, 4);
  for (let k = 0; k < 4; k++) shoot([A[0] + 10, A[1] - 8], [Bp[0] + ((k * 9) % 15) - 7, Bp[1] + ((k * 5) % 9) - 4], T_BUGLE + 0.2 + i * 0.35 + k * 0.9, { r: 8, h: 14 }); });
jolt(["u25", "u2"], T_CENTRE + 0.6);
const C3940 = tag("39TH + 40TH ARMIES", ...L(40.07, 125.96), T_CENTRE - 0.2, "#1f4fc4", 12, T_NOON);
// the right: 38th + 42nd Armies smash into the ROK II Corps at Tokchon
arr([[40.01, 126.36], [39.90, 126.30], [39.82, 126.24]], "carth", T_TWO - 0.3, { w: 13, dur: 1.0, until: T_NOON + 2.0 });
arr([[39.80, 126.66], [39.76, 126.52], [39.74, 126.40]], "carth", T_TWO - 0.1, { w: 13, dur: 1.0, until: T_NOON + 2.0 });
const C3842 = tag("38TH + 42ND ARMIES", ...L(39.95, 126.62), T_TWO, "#1f4fc4", 12, T_NOON);
[["b38", "r7"], ["b42", "r8"], ["b38", "r6"]].forEach(([a, b], i) => { const A = ux(a), Bp = ux(b);
  for (let k = 0; k < 4; k++) shoot([A[0] - 8, A[1] + 6], [Bp[0] + ((k * 7) % 13) - 6, Bp[1] + ((k * 3) % 7) - 3], T_TWO + 0.4 + i * 0.3 + k * 0.7, { r: 9, h: 16 });
  mg([A[0], A[1] + 6], [Bp[0], Bp[1] - 3], T_TWO + 0.8 + i * 0.6, 5); });
jolt(["r7", "r8", "r6"], T_TWO + 1.2);
// 26 Nov noon: the ROK front folds; counters grey and fall back south-west; the band moves (to the 26 Nov line)
B.grey(["r7", "r8", "r6"], T_FOLD - 0.4, 0.8);
go("r7", T_FOLD - 0.2, 2.6, 39.70, 126.08); go("r8", T_FOLD - 0.1, 2.6, 39.56, 126.30); go("r6", T_FOLD, 2.6, 39.62, 126.16);
go("b38", T_FOLD - 0.2, 2.8, 39.84, 126.24); go("b42", T_FOLD - 0.1, 2.8, 39.62, 126.48);
const TK = L(39.766, 126.313); K.target(TK[0], TK[1], T_FOLD, { r: 26, side: "carth", until: S5 + 1.0 });
sstamp("RIGHT FLANK COLLAPSES", 690, T_GONE, { size: 62, sub: "ROK II CORPS · 26 NOV", until: S5 + 1.2 });
// =====================================================================================================================
// move2-5: the 38th Army pours through the gap toward Kunu-ri; the Turks at Wawon; 28 Nov: retreat
// =====================================================================================================================
B.hideUnits(["r7", "r8", "r6"], S5 + 0.4, 0.8);
go("b38", T_POUR - 0.3, 3.4, 39.73, 126.10, "power1.in"); go("b42", T_POUR - 0.1, 3.6, 39.52, 126.24, "power1.in");
arr([[39.88, 126.30], [39.78, 126.20], [39.72, 126.06], [39.70, 125.96]], "carth", T_POUR, { w: 14, dur: 2.0, until: END - 1.4 });
arr([[39.70, 126.40], [39.60, 126.30], [39.50, 126.16], [39.45, 126.02]], "carth", T_SW, { w: 12, dur: 2.0, until: END - 1.4 });
const KUN = L(39.700, 125.900); K.target(KUN[0], KUN[1], T_KUN, { r: 30, side: "#ffd54a", until: END - 1.2 });
const T38 = tag("38TH ARMY", ...L(39.83, 126.12), T_POUR + 0.4, "#1f4fc4", 12, END - 1.4);
const T42 = tag("42ND ARMY · TOWARD SUNCHON", ...L(39.50, 126.38), T_ROADS, "#1f4fc4", 11, END - 1.4);
// the Turkish Brigade: out of Kunu-ri east to Wawon, a hard fight, pushed back west
const TUR = unit("tur", "rome", 39.70, 125.95, "infantry", FL.tur, { t: T_TURK - 0.6, size: "X", label: "TURKISH BDE", fs: 7 });
go("tur", T_TURK - 0.4, 1.6, 39.721, 126.04);
const WAW = town("WAWON", 39.721, 126.069, T_TURK - 0.4, { dx: 26, dy: -14 });
{ const A = ux("b38"), W = L(39.721, 126.045);
  for (let k = 0; k < 6; k++) shoot([A[0] + 12, A[1] - 6], [W[0] + ((k * 9) % 17) - 8, W[1] + ((k * 5) % 9) - 4], T_HARD - 0.6 + k * 0.45, { r: 9, h: 12, dur: 0.5 });
  mg([A[0] + 6, A[1]], [W[0], W[1]], T_HARD - 0.2, 5); }
B.grey(["tur"], T_PUSHED, 0.6); go("tur", T_PUSHED - 0.1, 1.6, 39.71, 125.98, "power2.out");
// 28 Nov: withdrawal arrows south (I Corps to the Chongchon, the IX Corps divisions toward Kunu-ri and the roads south)
RD.slice(0, 4).forEach(([id], i) => go(id, T_RETREAT + i * 0.08, 2.0, ...[[39.62, 125.32], [39.72, 125.55], [39.80, 125.84], [39.76, 125.96]][i]));
[[[39.70, 125.30], [39.60, 125.36], [39.52, 125.42]], [[39.80, 125.52], [39.70, 125.58], [39.62, 125.62]], [[39.86, 125.84], [39.78, 125.86], [39.72, 125.87]],
  [[39.84, 126.02], [39.76, 125.98], [39.68, 125.94], [39.56, 125.93]]].forEach((p, i) => arr(p, "rome", T_RETREAT + 0.1 + i * 0.12, { w: 7, dur: 1.2, until: END - 1.4, dash: "10 7" }));
sstamp("ENVELOPMENT", 690, T_28 - 0.6, { size: 64, sub: "THE CHINESE BEHIND THE EIGHTH ARMY", until: END - 1.5 });
// lead-in to move2b: counters, labels and the fill clear as the camera dives onto Kunu-ri
B.hideUnits([...BL.map((b) => b[0]).filter((x) => x !== "b20"), ...RD.map((r) => r[0]), "tur"], END - 1.6, 0.5);
tl.to([...CLOSEF, ...PL, WAW, T38, T42], { autoAlpha: 0, duration: 0.4 }, END - 1.5);
K.raiseTerritory();
B.finish();
