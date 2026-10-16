// MOVE 2c (move2-9), Stonewall Jackson #11: the result of Second Manassas, Sep 1862. Basemap nova_hd_ref (z10).
// Built with: python3 tools/build_scene.py move2c nova_hd_ref move2-9 move2-9
// Opens on move2b's last frame (bullrun s=0.667 = nova s=5.333 at 38.815N 77.56W) and zooms out to the wide option-1 map (control
// aug28 -> sep02, tools/make_nova_control.py). Pope's army back into Washington's defences; CASUALTY card (campaign, ABT: UNION ~14,500
// incl. ~4,300 missing · CONFEDERATE ~7,400); Pope REMOVED (12 Sep 1862); blue arrow into MARYLAND (SEPT 1862); method card line 2 MYSTIFY.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const L = GG.proj(10, 73052, 99749);
const FL = { us: "assets/media/us34_flag.png", csa: "assets/media/csa1_13_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const NV = {"pl":{"jeffersonton":[1284.0,776.1],"hinsons_mill":[1247.6,736.1],"amissville":[1225.3,744.1],"orlean":[1248.4,668.4],"salem":[1325.5,563.6],"the_plains":[1386.6,565.7],"thoroughfare_gap":[1429.1,601.1],"haymarket":[1486.6,612.8],"gainesville":[1504.2,627.8],"bristoe":[1556.7,696.5],"manassas_jct":[1604.2,670.0],"centreville":[1636.0,587.8],"groveton":[1551.1,612.3],"stony_ridge":[1528.0,596.1],"stone_bridge":[1583.7,601.2],"warrenton":[1371.1,704.9],"waterloo":[1290.5,721.2],"sulphur_springs":[1320.4,754.8],"rappahannock_stn":[1361.9,872.5],"kellys_ford":[1381.6,923.4],"catlett":[1483.9,760.7],"warrenton_jct":[1449.3,776.2],"culpeper":[1225.0,928.6],"fredericksburg":[1617.5,1089.6],"falmouth":[1609.5,1067.4],"aquia":[1718.8,1000.5],"alexandria":[1916.1,619.3],"washington":[1923.7,535.3],"fairfax":[1727.2,580.9],"chantilly":[1659.0,552.1],"leesburg":[1539.2,328.7],"whites_ford":[1604.0,282.9],"frederick":[1649.7,46.2],"harpers_ferry":[1412.3,131.4],"winchester":[1103.2,262.7],"front_royal":[1080.5,513.6],"gordonsville":[1085.4,1240.4],"orange":[1141.5,1140.3],"thoroughfare_mtn":[1418.7,577.4]},"march":[[1284.0,776.1],[1262.2,754.8],[1247.6,736.1],[1225.3,744.1],[1233.1,703.5],[1248.4,668.4],[1276.7,624.1],[1305.9,586.7],[1325.5,563.6],[1386.6,565.7],[1407.8,582.1],[1429.1,601.1],[1486.6,612.8],[1504.2,627.8],[1524.3,661.5],[1556.7,696.5]],"mi":[0.0,2.3,4.0,5.8,8.8,11.7,15.6,19.1,21.3,25.8,27.8,29.9,34.2,36.0,38.9,42.4],"oarr":[[1916.1,619.3],[1841.1,633.5],[1761.0,628.8],[1710.0,633.5],[1637.2,646.5],[1604.2,670.0],[1556.7,696.5],[1520.7,728.7],[1483.9,760.7],[1449.3,776.2],[1394.7,836.8],[1361.9,872.5],[1300.8,902.0],[1225.0,928.6],[1200.3,996.8],[1178.4,1075.7],[1141.5,1140.3],[1085.4,1240.4]],"mgrr":[[1604.2,670.0],[1560.7,657.7],[1520.7,638.1],[1505.0,630.2],[1487.2,613.4],[1429.1,601.1],[1386.6,565.7],[1325.5,563.6],[1280.4,530.6],[1222.1,525.9],[1163.9,502.5],[1080.5,513.6],[1011.0,474.4],[961.4,447.3]],"rfp":[[1718.8,1000.5],[1680.9,1024.7],[1637.2,1052.5],[1615.3,1067.4],[1617.5,1089.6],[1629.9,1154.6],[1673.6,1275.0],[1644.5,1459.8],[1615.3,1607.3]],"rivers":[[[795,-60],[818,-54],[837,-57],[866,-50],[881,-49],[886,-62],[894,-70],[888,-75],[889,-82],[903,-70],[902,-81],[908,-82],[918,-79],[901,-95],[888,-113],[912,-115],[932,-110],[922,-125],[906,-147],[934,-143],[950,-137],[944,-154],[960,-152],[960,-161],[978,-164],[1015,-148],[1035,-164],[1057,-182],[1052,-194],[1074,-200],[1091,-219],[1152,-202],[1173,-188],[1195,-164],[1220,-129],[1248,-136],[1259,-132],[1262,-114],[1268,-122],[1263,-140],[1269,-146],[1277,-135],[1294,-128],[1308,-128],[1304,-142],[1324,-136],[1346,-129],[1340,-94],[1304,-88],[1321,-70],[1322,-48],[1338,-54],[1343,-64],[1351,-56],[1336,-32],[1374,-25],[1390,-32],[1388,-22],[1370,-11],[1384,3],[1370,5],[1379,18],[1366,24],[1387,34],[1404,42],[1413,61],[1405,77],[1410,98],[1400,112],[1402,122],[1421,134],[1455,131],[1467,138],[1491,147],[1521,152],[1540,150],[1543,164],[1559,188],[1617,222],[1609,239],[1602,260],[1576,275],[1574,319],[1599,335],[1618,360],[1653,372],[1681,378],[1716,379],[1731,384],[1768,404],[1773,421],[1766,432],[1772,453],[1782,456],[1793,463],[1819,466],[1841,468],[1857,492],[1876,519],[1899,528],[1912,547],[1935,577],[1924,632],[1924,682],[1918,711],[1885,722],[1853,748],[1860,781],[1843,802],[1816,806],[1761,865],[1752,943],[1794,1042],[1837,1022],[1909,991],[1941,994],[1961,1039],[1966,1086],[2014,1114],[2072,1154],[2146,1183],[2240,1197],[2322,1298],[2404,1343],[2518,1385],[2561,1487],[2561,1487]],[[1135,556],[1133,570],[1144,584],[1149,595],[1153,597],[1163,601],[1175,612],[1185,622],[1187,623],[1190,627],[1203,628],[1203,634],[1202,639],[1206,644],[1205,647],[1205,650],[1203,659],[1204,667],[1210,667],[1210,677],[1212,680],[1218,687],[1217,692],[1216,696],[1224,704],[1240,714],[1249,719],[1260,720],[1264,719],[1272,720],[1284,719],[1290,721],[1292,730],[1301,735],[1294,744],[1301,751],[1307,749],[1316,766],[1314,774],[1311,780],[1316,783],[1324,791],[1314,804],[1321,810],[1313,819],[1316,830],[1322,844],[1326,850],[1332,853],[1340,868],[1354,877],[1367,893],[1377,910],[1380,914],[1382,924],[1384,933],[1396,950],[1399,965],[1410,973],[1419,984],[1437,977],[1448,972],[1464,978],[1490,990],[1490,1004],[1498,1013],[1500,1023],[1507,1036],[1509,1056],[1520,1052],[1534,1045],[1539,1057],[1561,1080],[1565,1073],[1576,1066],[1594,1069],[1604,1070],[1614,1080],[1630,1106],[1636,1117],[1655,1132],[1673,1136],[1687,1143],[1705,1135],[1718,1143],[1727,1149],[1738,1145],[1737,1160],[1749,1158],[1752,1137],[1770,1139],[1787,1143],[1781,1151],[1767,1156],[1771,1176],[1777,1196],[1782,1188],[1794,1185],[1810,1198],[1827,1216],[1847,1213],[1864,1226],[1887,1218],[1890,1231],[1899,1233],[1905,1218],[1913,1238],[1925,1281],[1940,1281],[1954,1267],[1957,1281],[1980,1290],[2012,1329],[2019,1380],[2046,1396],[2059,1426],[2102,1455],[2116,1487],[2140,1522],[2215,1581],[2250,1612],[2277,1681],[2325,1708],[2374,1717],[2468,1743],[2468,1743]],[[1085,489],[1090,477],[1101,476],[1114,479],[1107,466],[1132,476],[1155,473],[1158,449],[1175,441],[1182,415],[1201,419],[1218,404],[1230,384],[1236,376],[1221,370],[1223,363],[1248,364],[1253,352],[1241,344],[1250,343],[1275,343],[1296,332],[1313,310],[1328,284],[1327,267],[1338,256],[1332,245],[1347,240],[1339,227],[1342,220],[1356,224],[1360,206],[1359,196],[1376,193],[1382,191],[1375,169],[1389,156],[1408,138],[1422,134],[1422,134]],[[956,1074],[959,1084],[955,1093],[963,1100],[968,1104],[969,1110],[977,1110],[979,1116],[986,1115],[991,1116],[1000,1113],[1010,1115],[1026,1126],[1028,1127],[1026,1133],[1025,1136],[1031,1143],[1039,1151],[1044,1150],[1052,1152],[1063,1150],[1072,1144],[1080,1140],[1089,1132],[1093,1123],[1089,1124],[1090,1120],[1092,1124],[1092,1124]],[[1090,1120],[1098,1122],[1101,1118],[1111,1120],[1114,1104],[1115,1110],[1123,1106],[1131,1110],[1135,1101],[1146,1092],[1152,1080],[1152,1080]],[[1594,728],[1608,732],[1616,724],[1620,719],[1622,716],[1632,713],[1642,714],[1644,706],[1651,710],[1658,700],[1663,703],[1663,691],[1669,694],[1673,696],[1680,708],[1688,696],[1702,699],[1708,707],[1717,709],[1713,716],[1724,712],[1740,718],[1763,733],[1779,752],[1802,818],[1802,818]],[[1474,491],[1484,491],[1494,500],[1501,505],[1505,514],[1511,520],[1524,535],[1533,539],[1541,543],[1549,547],[1549,556],[1549,564],[1551,574],[1553,580],[1561,580],[1564,590],[1580,587],[1577,596],[1586,611],[1590,624],[1603,625],[1614,628],[1620,628],[1624,621],[1632,633],[1650,650],[1650,659],[1648,663],[1650,674],[1656,674],[1658,669],[1668,673],[1674,683],[1673,696],[1673,696]],[[1452,636],[1454,643],[1462,643],[1466,648],[1483,652],[1500,664],[1506,664],[1514,664],[1521,666],[1529,669],[1539,676],[1542,670],[1552,673],[1559,680],[1563,689],[1566,695],[1571,701],[1579,702],[1584,703],[1580,714],[1585,720],[1593,720],[1594,728],[1594,728]],[[989,785],[1002,782],[1011,778],[1022,779],[1024,784],[1029,792],[1035,797],[1037,807],[1048,804],[1055,811],[1058,819],[1062,828],[1067,833],[1072,833],[1074,839],[1079,845],[1082,852],[1085,860],[1089,867],[1092,873],[1099,881],[1104,882],[1110,880],[1121,882],[1125,885],[1133,884],[1135,878],[1139,871],[1136,867],[1140,864],[1141,857],[1143,845],[1145,836],[1149,829],[1153,817],[1161,812],[1172,811],[1182,818],[1188,821],[1194,821],[1206,812],[1213,810],[1219,807],[1219,813],[1228,818],[1237,816],[1242,814],[1254,822],[1265,818],[1271,823],[1276,831],[1289,831],[1285,840],[1295,850],[1305,852],[1319,852],[1328,855],[1333,856]],[[1152,1080],[1159,1079],[1173,1077],[1192,1072],[1213,1064],[1235,1053],[1257,1040],[1280,1030],[1305,1026],[1329,1028],[1351,1033],[1373,1036],[1395,1033],[1416,1026],[1434,1015],[1453,1006],[1473,1000],[1486,997],[1488,997]]],"f25":[[1804.7,1200.9],[1796.0,1195.9],[1787.3,1191.0],[1778.6,1186.0],[1770.0,1181.0],[1761.3,1176.1],[1752.6,1171.1],[1743.9,1166.1],[1735.3,1161.2],[1726.6,1156.2],[1717.9,1151.2],[1709.2,1146.4],[1700.4,1141.6],[1691.6,1136.8],[1682.8,1132.1],[1673.8,1127.6],[1664.9,1123.2],[1655.8,1118.9],[1646.6,1115.1],[1637.3,1111.5],[1627.6,1108.9],[1618.4,1105.1],[1609.5,1100.4],[1601.1,1095.1],[1593.1,1089.0],[1585.8,1082.3],[1578.5,1075.4],[1571.2,1068.6],[1563.9,1061.8],[1556.5,1055.0],[1549.1,1048.3],[1541.7,1041.6],[1534.2,1034.9],[1526.8,1028.3],[1519.3,1021.6],[1511.8,1015.1],[1504.2,1008.5],[1496.5,1002.1],[1488.8,995.7],[1481.1,989.4],[1473.3,983.1],[1465.5,976.9],[1457.6,970.8],[1449.6,964.7],[1441.6,958.7],[1433.5,952.9],[1425.3,947.2],[1417.0,941.6],[1408.4,936.5],[1399.5,931.9],[1391.2,926.5],[1384.1,919.5],[1378.3,911.4],[1373.6,902.6],[1370.0,893.3],[1366.2,884.0],[1362.2,874.8],[1358.0,865.8],[1353.6,856.8],[1348.8,848.0],[1344.3,839.1],[1340.2,830.0],[1336.5,820.7],[1333.3,811.2],[1330.6,801.6],[1328.1,791.9],[1325.9,782.2],[1323.9,772.4],[1321.0,762.8],[1316.8,753.8],[1311.5,745.4],[1305.2,737.6],[1300.4,729.1],[1300.5,719.4],[1305.0,710.7],[1311.6,703.3],[1319.2,696.8],[1327.0,690.5],[1334.8,684.2],[1342.8,678.2],[1350.8,672.3],[1359.0,666.5],[1367.2,660.8],[1375.5,655.2],[1383.5,649.3],[1391.6,643.3],[1399.3,636.9],[1406.9,630.4],[1414.2,623.6],[1421.2,616.5],[1427.8,609.0],[1433.8,601.0],[1439.1,592.5],[1444.1,583.9],[1448.5,574.9],[1452.4,565.7],[1456.0,556.4],[1459.4,547.0],[1462.7,537.5],[1465.8,528.0],[1468.8,518.5],[1471.6,508.9],[1474.2,499.2],[1476.7,489.5],[1479.2,479.9],[1481.7,470.2],[1484.1,460.5],[1486.6,450.8],[1489.0,441.1],[1491.5,431.4],[1493.9,421.7],[1496.3,412.0],[1498.7,402.3],[1501.1,392.6],[1503.5,382.9],[1505.9,373.1],[1508.2,363.4],[1510.6,353.7],[1512.9,344.0],[1515.2,334.2],[1517.5,324.5],[1519.8,314.8],[1522.0,305.0],[1524.3,295.3],[1526.6,285.5],[1528.8,275.8],[1531.0,266.0],[1533.2,256.3],[1535.5,246.5],[1537.7,236.8],[1539.9,227.0],[1542.1,217.3],[1544.3,207.5],[1546.6,197.8],[1548.8,188.0]],"f02":[[1906.6,717.5],[1897.8,712.8],[1889.0,708.1],[1880.2,703.4],[1871.3,698.6],[1862.5,693.9],[1853.7,689.2],[1845.2,684.0],[1836.8,678.6],[1828.4,673.0],[1820.4,667.0],[1812.4,661.1],[1804.6,654.8],[1797.0,648.3],[1789.4,641.8],[1782.1,635.1],[1774.9,628.1],[1767.7,621.2],[1761.3,613.6],[1755.4,605.4],[1749.6,597.3],[1746.0,588.0],[1742.4,578.6],[1740.9,568.8],[1740.3,558.9],[1741.6,549.1],[1744.1,539.4],[1746.8,529.7],[1749.6,520.1],[1752.6,510.6],[1755.7,501.1],[1759.3,491.8],[1763.0,482.5],[1767.3,473.5],[1771.5,464.4]]};
const PL = NV.pl || {};
// ---------- helpers (Peng / Rokossovsky kit) ----------
const box = (txt, x, y, t, size = 14, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.24em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.6).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const town = (txt, key, t, o = {}) => { const [x, y] = PL[key]; B.city("", x, y, { r: o.r || 3, t, until: o.until }); return box(txt, x + (o.dx || 0), y + (o.dy != null ? o.dy : -12), t, o.size || 9, o.until, o.pop !== false); };
const tag = (txt, x, y, t, c, size = 10, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:${c};color:#f7f3ea;font-family:Oswald;font-weight:700;letter-spacing:.14em;padding:${(size * 0.18).toFixed(1)}px ${(size * 0.5).toFixed(1)}px;font-size:${size}px;white-space:nowrap;border:1px solid #f3eee2;box-shadow:0 2px 6px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 60) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(1, w / 40).toFixed(1)}px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.17).toFixed(1)}px;color:#f7f3ea;text-shadow:0 2px 4px #000">${name}</div></div>`, x, y, { t, until });
const unit = (id, side, x, y, icon, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 30, h: o.h || 20, t: o.t, label: o.label });
  K.counter(id, { icon, flag: side === "carth" ? FL.csa : FL.us, size: o.size });
  const u = B.units[id], tg = u.el.querySelector(".tag"); if (tg) { tg.style.fontSize = (o.fs || 8) + "px"; tg.style.padding = `0 ${u.h * 0.2}px`; }
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
const slide = (el, t, until, dx = 90) => { tl.fromTo(el, { autoAlpha: 0, x: dx }, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out" }, t); SFX("ref:pop", t + 0.1); if (until != null) tl.to(el, { autoAlpha: 0, x: dx * 0.8, duration: 0.4 }, until); return el; };
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(4, Math.round(size / 9))}px solid ${c};padding:4px 22px 6px;background:rgba(14,12,10,0.74);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.3)}px;letter-spacing:0.22em;color:#f7f3ea;margin-top:2px">${sub}</div>` : ""}</div>`;
const sstamp = (txt, top, t, o = {}) => slam(scr(stampHTML(txt, o.color || "#e3232f", o.size || 64, o.rot || -5, o.sub), `left:0;right:0;top:${top}px;display:flex;justify-content:center;`), t, o);
const legend = (t, until) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "CONFEDERATE"], ["#be3a2a", "UNION"]].map(([sq, nm]) => `<span><b style="display:inline-block;width:20px;height:20px;background:${sq};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const wimg = (src, t, dIn, tOut, o = {}) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px" }); if (o.mx) el.style.mixBlendMode = "multiply";
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (t > 0) { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: false }, t); }
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: o.outDur || 1.0 }, tOut);
  return el;
};
const badge = (o) => K.badge(o);
const KM0 = GG.proj(10, 73052, 99749)(38.815, -77.56);
const CW = 1920, CH = 1080, cam = { cx: KM0[0], cy: KM0[1], s: 5.333 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
applyCam();
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const ghost = (ids, t, op = 0.3) => ids.forEach((id, k) => tl.to(B.units[id].el, { opacity: op, filter: "grayscale(1) brightness(1.7)", duration: 0.5 }, t + k * 0.06));
const unghost = (ids, t) => ids.forEach((id, k) => tl.to(B.units[id].el, { opacity: 1, filter: "grayscale(0) brightness(1)", duration: 0.4 }, t + k * 0.06));
const arr = (pts, side, t, o = {}) => B.arrow({ pts, side, t, dur: o.dur || 1.4, width: o.w || 7, until: o.until, dash: o.dash });
// artillery: launch -> arc -> impact (boom + shake on every impact, locked)
const shoot = (from, to, t, o = {}) => { K.gun(from[0], from[1], t, { dx: 0, dy: -2 });
  const dur = o.dur || 0.7; GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.6, h: o.h || 14, impact: false }); K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 6, puffs: 2 }); };
const mg = (a, b, t, n = 5) => { const NS = "http://www.w3.org/2000/svg"; SFX("mg", t);
  for (let k = 0; k < n; k++) { const g = document.createElementNS(NS, "line"), j = ((k * 7) % 5 - 2) * 1.2;
    g.setAttribute("x1", a[0]); g.setAttribute("y1", a[1]); g.setAttribute("x2", b[0] + j); g.setAttribute("y2", b[1] - j);
    g.setAttribute("stroke", "#ffe28a"); g.setAttribute("stroke-width", "1.2"); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-dasharray", "3 30");
    g.style.filter = "drop-shadow(0 0 2px #ffb347)"; document.getElementById("overlay").appendChild(g); GG.hide(g);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 33;
    tl.fromTo(g, { autoAlpha: 1, strokeDashoffset: 0 }, { strokeDashoffset: -len, duration: 0.45, ease: "none", immediateRender: false }, t + k * 0.11);
    tl.to(g, { autoAlpha: 0, duration: 0.05 }, t + k * 0.11 + 0.45); } };
// glowing polyline (railroad pulse, march trail, ridge); draws on
const glowLine = (pts, col, w, t, until, o = {}) => { const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");
  if (!document.getElementById("fxk-blur")) { const defs = document.createElementNS(NS, "defs"); defs.innerHTML = `<filter id="fxk-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>`; document.getElementById("overlay").insertBefore(defs, document.getElementById("overlay").firstChild); }
  g.innerHTML = `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w * 3}" stroke-linecap="round" stroke-linejoin="round" opacity="0.4" filter="url(#fxk-blur)"/><path d="${d}" fill="none" stroke="${o.core || "#fff6dc"}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""}/>`;
  document.getElementById("overlay").appendChild(g);
  const ps = [...g.querySelectorAll("path")], len = ps[1].getTotalLength(); if (!o.dash) gsap.set(ps, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); GG.hide(g);
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); if (!o.dash) tl.to(ps, { strokeDashoffset: 0, duration: o.dur || 1.4, ease: o.ease || "power1.inOut" }, t); else tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.6 }, t);
  if (o.pulse) tl.to(ps[0], { opacity: 0.9, duration: 0.6, yoyo: true, repeat: o.pulse }, t + (o.dur || 1.4));
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.5 }, until); return g; };
// thin arrow for the close views (B.arrow's casing is too heavy at s > 2)
const tArrow = (pts, col, t, until, w = 2.2) => { const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L");
  const [x2, y2] = pts[pts.length - 1], [x1, y1] = pts[pts.length - 2], ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  g.innerHTML = `<path d="${d}" fill="none" stroke="#f3eee2" stroke-width="${w + 1.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<polygon points="0,${-w * 2.2} ${w * 3.4},0 0,${w * 2.2}" fill="${col}" stroke="#f3eee2" stroke-width="0.8" transform="translate(${x2} ${y2}) rotate(${ang.toFixed(1)})"/>`;
  document.getElementById("overlay").appendChild(g); const ps = [...g.querySelectorAll("path")], len = ps[1].getTotalLength(), hd = g.querySelector("polygon");
  gsap.set(ps, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); gsap.set(hd, { opacity: 0 }); GG.hide(g);
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); tl.to(ps, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, t); tl.to(hd, { opacity: 1, duration: 0.2 }, t + 1.3);
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.5 }, until); return g; };
// polyline helpers (march column follows the road)
const cumOf = (pts) => { const c = [0]; for (let j = 1; j < pts.length; j++) c.push(c[j - 1] + Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1])); return c; };
const atLen = (pts, cum, d) => { d = Math.max(0, Math.min(cum[cum.length - 1], d)); let j = 1; while (j < cum.length - 1 && cum[j] < d) j++;
  const a = pts[j - 1], b = pts[j], k = (d - cum[j - 1]) / ((cum[j] - cum[j - 1]) || 1); return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; };
const follow = (id, pts, t, dur, d0, d1, lag = 0, ease = "none") => { const cum = cumOf(pts), u = B.units[id], p = { d: d0 };
  tl.to(p, { d: d1, duration: dur, ease, onUpdate: () => { const q = atLen(pts, cum, Math.max(0, p.d - lag)); u.el.style.left = q[0] - u.w / 2 + "px"; u.el.style.top = q[1] - u.h / 2 + "px"; } }, t); };
// icons
const DEPOT = `<svg width="26" height="18" viewBox="0 0 26 18" style="display:block;filter:drop-shadow(0 1px 2px #000)"><path d="M1 8 L7 3 L13 8 Z M13 8 L19 3 L25 8 Z" fill="#c9b48a" stroke="#1a1712" stroke-width="1"/><rect x="1" y="8" width="24" height="9" fill="#c9b48a" stroke="#1a1712" stroke-width="1"/><rect x="5" y="11" width="4" height="6" fill="#1a1712"/><rect x="16" y="11" width="4" height="6" fill="#1a1712"/></svg>`;
const TRAIN = (c) => `<svg width="30" height="12" viewBox="0 0 30 12" style="display:block;filter:drop-shadow(0 1px 2px #000)"><rect x="1" y="3" width="11" height="6" fill="${c}" stroke="#f3eee2" stroke-width="0.8"/><rect x="13" y="3" width="7" height="6" fill="${c}" stroke="#f3eee2" stroke-width="0.8"/><path d="M21 9 L21 4 L25 4 L25 1 L27 1 L27 4 L29 6 L29 9 Z" fill="#2a2620" stroke="#f3eee2" stroke-width="0.8"/><circle cx="4" cy="10.5" r="1.3" fill="#f3eee2"/><circle cx="9" cy="10.5" r="1.3" fill="#f3eee2"/><circle cx="16" cy="10.5" r="1.3" fill="#f3eee2"/><circle cx="23" cy="10.5" r="1.3" fill="#f3eee2"/><circle cx="27" cy="10.5" r="1.3" fill="#f3eee2"/></svg>`;
const FIRE = (s) => `<div style="width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle, #fffbe6 0%, #ffd34d 25%, rgba(255,120,20,0.85) 50%, rgba(200,40,0,0.35) 66%, rgba(120,20,0,0) 74%)"></div>`;
const MOON = `<svg width="20" height="20" viewBox="0 0 20 20" style="display:block;filter:drop-shadow(0 0 6px #e8eeff)"><path d="M13 2 A8 8 0 1 0 18 14 A6.5 6.5 0 1 1 13 2 Z" fill="#e8eeff"/></svg>`;
// cavalry counter icon (NEW, copied from scenes-src/cavalry_icon.js, MOVE 1 agent; owner to approve)
const CAV_SVG = `<g fill="#f7f3ea" stroke="none">
  <path d="M25 43 C16 41 9 47 5 56 C11 52 17 50 24 50 Z"/>
  <path d="M24 44 C28 37 40 36 52 38 L66 37 C70 34 74 28 78 22 L84 17 L86 11 L88.5 18.5 L96 29 L94.5 34.5 L88 33 L82.5 32 C80.5 38 78.5 44 76.5 48 C76.5 54 72 58 66 58 L36 58 C30 58 25 54 24 48 Z"/>
  <path d="M46 38.5 L54 38.5 L58 23 L47.5 20 Z"/>
  <circle cx="52" cy="14" r="5"/><ellipse cx="51.5" cy="9.6" rx="7" ry="2.2"/></g>
  <g fill="none" stroke="#f7f3ea" stroke-linecap="round" stroke-linejoin="round">
  <path d="M69 55 L81 63 L90 61" stroke-width="5"/><path d="M64 56 L73 66 L72 75" stroke-width="5"/>
  <path d="M35 55 L23 63 L13 65" stroke-width="5"/><path d="M41 56 L37 68 L41 76" stroke-width="5"/>
  <path d="M51 35 L59 43 L57 51" stroke-width="5"/>
  <path d="M54 25 L65 20" stroke-width="4.5"/><path d="M65 20 L79 3" stroke-width="2.6"/></g>`;
const cavIcon = (id, o = {}) => { const sv = B.units[id].el.querySelector(".blk svg");
  sv.setAttribute("viewBox", "0 0 100 80"); sv.setAttribute("preserveAspectRatio", "xMidYMid meet");
  sv.innerHTML = o.flip ? `<g transform="translate(100 0) scale(-1 1)">${CAV_SVG}</g>` : CAV_SVG; };
// ---------- times ----------
const P9 = "move2-9";
const T_U = at(P9, "fourteen and a half"), T_C = at(P9, "seventy-four hundred"), T_WEEKS = at(P9, "Within two weeks"), T_REM = at(P9, "removed from command"),
  T_MD = at(P9, "marching north into Maryland"), T_DIS = at(P9, "Jackson had disappeared"), T_HELD = at(P9, "held it in place"), T_MYS = at(P9, "Mystify");
// ---------- layers ----------
const C28 = wimg("assets/media/nova_ctl_aug28_mx.png", 0, 0, 2.6, { mx: true, outDur: 1.2 });
const C02 = wimg("assets/media/nova_ctl_sep02_mx.png", 2.2, 1.2, null, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.18 }); LV.shimmer(NV.rivers || [], { width: 1.2 }); LV.scaleBar(119.47); LV.north();
wimg("assets/media/nova_geo_ref.png", 0, 0, null);
// ---------- camera: zoom out from the battlefield (continues move2b's pull-back) ----------
camTo(0, 2.4, 1680, 560, 1.45, "power2.out"); SFX("whoosh", 0.1);
camTo(T_MD - 0.6, 3.0, 1620, 470, 1.35);
B.showDate(0.05);
B.date("EARLY SEPTEMBER 1862", 0.1, T_MD - 0.3, 30); B.date("SEPTEMBER 1862", T_MD - 0.2, END + 1, 32);
legend(0.3, END - 0.4);
flag(FL.csa, "CONFEDERATE STATES", ...L(38.62, -77.95), 2.2, END, 80); flag(FL.us, "UNITED STATES", ...L(39.30, -77.10), 2.25, END, 80);
town("WASHINGTON DEFENCES", "alexandria", 2.4, { dx: 70, dy: 18, size: 10 }); town("MANASSAS", "manassas_jct", 2.3, { dx: 0, dy: -12, size: 10 });
// Sep 1862 front: only the Washington defences are Union in northern Virginia
K.front({ pts: NV.f02 || [[1830, 600], [1900, 520]], sideA: "carth", sideB: "rome", t: 2.4, dur: 1.4, width: 15, glow: 0.47, until: END + 1 });
// Pope's army back into Washington's defences
[[PL.centreville, PL.fairfax, [PL.alexandria[0] - 70, PL.alexandria[1] - 25]], [[PL.centreville[0] + 10, PL.centreville[1] - 20], PL.chantilly, [PL.washington[0] - 90, PL.washington[1] + 10]]]
  .forEach((p, i) => arr(p, "rome", 1.2 + i * 0.3, { w: 6, dur: 1.8, until: T_MD }));
// casualty card (campaign, ABT)
const CAS = scr(`<div style="display:flex;gap:46px;padding:22px 44px 24px;background:rgba(18,16,12,0.92);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="min-width:280px"><div style="display:flex;align-items:center;gap:12px;padding-bottom:8px;margin-bottom:8px;border-bottom:3px solid #c4121f"><img src="${FL.us}" style="height:30px;border:1px solid #f7f3ea"><div style="font-size:28px;letter-spacing:0.08em">UNION</div></div>
    <div class="u" style="font-size:64px;line-height:1.1">~14,500</div><div style="font-size:18px;letter-spacing:0.16em;color:#d8cfb8">KILLED, WOUNDED, MISSING<br>(INCL. ~4,300 MISSING)</div></div>
  <div class="cc" style="min-width:280px"><div style="display:flex;align-items:center;gap:12px;padding-bottom:8px;margin-bottom:8px;border-bottom:3px solid #1f4fc4"><img src="${FL.csa}" style="height:30px;border:1px solid #f7f3ea"><div style="font-size:28px;letter-spacing:0.08em">CONFEDERATE</div></div>
    <div style="font-size:64px;line-height:1.1">~7,400</div><div style="font-size:18px;letter-spacing:0.16em;color:#d8cfb8">KILLED, WOUNDED, MISSING</div></div></div>
  <div style="text-align:center;font-family:Oswald;font-size:14px;letter-spacing:0.22em;color:#c9b48a;margin-top:6px">SECOND MANASSAS CAMPAIGN · AMERICAN BATTLEFIELD TRUST</div>`, "left:0;right:0;margin:auto;width:760px;top:200px;");
slam(CAS, T_U - 0.4, { from: 1.4, shake: 4, until: T_REM - 0.2 });
gsap.set(CAS.querySelector(".cc"), { autoAlpha: 0 }); tl.to(CAS.querySelector(".cc"), { autoAlpha: 1, duration: 0.3 }, T_C - 0.3); SFX("hit", T_C - 0.1);
// Pope removed
const PB = K.badge({ name: "JOHN POPE", role: "ARMY OF VIRGINIA", photo: "assets/media/pope_head.png", flag: FL.us, side: "rome", corner: "tr", t: T_WEEKS - 0.2, until: T_DIS });
tl.to(PB, { filter: "grayscale(1) brightness(0.7)", duration: 0.4 }, T_REM);
sstamp("REMOVED FROM COMMAND", 300, T_REM, { size: 44, sub: "WITHIN TWO WEEKS · SEPTEMBER 1862", until: T_DIS, left: 1180 });
// Lee's army north into Maryland (White's Ford)
arr([L(38.86, -77.62), L(39.00, -77.58), PL.whites_ford, L(39.26, -77.43)], "carth", T_MD - 0.3, { w: 12, dur: 2.2, until: END + 1 });
tag("INTO MARYLAND · SEPTEMBER 1862", ...L(39.20, -77.28), T_MD + 0.6, "#1f4fc4", 14, END + 1);
// the method card: line 2 lights on "Mystify"
GG.METHOD = ["MOVE FAST", "MYSTIFY", "HIT THE WEAKEST PART"]; GG.METHOD_TITLE = "JACKSON'S METHOD";
GG.method(2, T_HELD - 0.4, END + 1, [T_HELD - 0.1, T_MYS - 0.1]); SFX("hit", T_HELD); SFX("hit", T_MYS);
K.raiseTerritory();
B.finish();
