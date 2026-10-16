// MOVE 2a (move2-1 .. move2-5), Stonewall Jackson #11: the flank march to Manassas, 25-28 Aug 1862. Basemap nova_hd_ref (z10, HD, dark grade).
// Built with: python3 tools/build_scene.py move2a nova_hd_ref move2-1 move2-5
// WIDE, option 1 (control overlays assets/media/nova_ctl_aug25/aug27/aug28_mx.png, tools/make_nova_control.py; sources in
// research/FACT_NOTES_nova.md). Jackson / Confederates = blue (carth), Union = red (rome). Flags: US 34-star / CSA First National 13-star.
// move2-1 title MOVE 2 · MANASSAS · AUGUST 1862; Lee's arrow up from Richmond (Seven Days); Pope's army on the Rappahannock (front draws),
//         Pope badge; the O&A railroad glows back to Manassas Junction (depot) and Washington; McClellan's ships come up the Potomac to
//         Aquia + Alexandria (arrows); count card POPE + McCLELLAN ~70,000 vs LEE ~55,000.
// move2-2 Lee badge; HE SPLIT HIS ARMY stamp; Longstreet holds the river (guns -> impacts); Jackson badge + ~24,000; the dotted plan arc
//         round Pope's right through THOROUGHFARE GAP to the railroad; POPE'S SUPPLY LINE pulses.
// move2-3 25 AUG dawn: the column leaves Jeffersonton, north behind the BULL RUN MTS (ridge glows), mileage counter; night at SALEM (moon);
//         26 AUG Thoroughfare Gap (ring) - Gainesville - Bristoe at sunset; dust seen by a Union scout: belief card; 55 MILES · 2 DAYS.
// move2-4 NIGHT 26-27: trains wrecked at Bristoe (impacts); Trimble's two regiments + Stuart's cavalry (NEW cavalry icon) take Manassas
//         Junction (ring flips blue, ~300 PRISONERS); 27 AUG depot (warehouses, trains), food card + eyewitness quote (NPS); NIGHT 27 the
//         depot burns (fire + K.smoke columns).
// move2-5 Pope badge + BAG THE WHOLE CROWD; red columns converge on Manassas, find smoke (EMPTY); the ghost trail north to STONY RIDGE
//         behind the UNFINISHED RAILROAD (glows); hidden counters; red columns wander (?); the camera dives onto the bullrun framing (move2b).
// Facts: research/FACT_NOTES.md (Move 2) + research/FACT_NOTES_nova.md.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const L = GG.proj(10, 73052, 99749);
const FL = { us: "assets/media/us34_flag.png", csa: "assets/media/csa1_13_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const NV = {"pl":{"jeffersonton":[1284.0,776.1],"hinsons_mill":[1247.6,736.1],"amissville":[1225.3,744.1],"orlean":[1248.4,668.4],"salem":[1325.5,563.6],"the_plains":[1386.6,565.7],"thoroughfare_gap":[1429.1,601.1],"haymarket":[1486.6,612.8],"gainesville":[1504.2,627.8],"bristoe":[1556.7,696.5],"manassas_jct":[1604.2,670.0],"centreville":[1636.0,587.8],"groveton":[1551.1,612.3],"stony_ridge":[1528.0,596.1],"stone_bridge":[1583.7,601.2],"warrenton":[1371.1,704.9],"waterloo":[1290.5,721.2],"sulphur_springs":[1320.4,754.8],"rappahannock_stn":[1361.9,872.5],"kellys_ford":[1381.6,923.4],"catlett":[1483.9,760.7],"warrenton_jct":[1449.3,776.2],"culpeper":[1225.0,928.6],"fredericksburg":[1617.5,1089.6],"falmouth":[1609.5,1067.4],"aquia":[1718.8,1000.5],"alexandria":[1916.1,619.3],"washington":[1923.7,535.3],"fairfax":[1727.2,580.9],"chantilly":[1659.0,552.1],"leesburg":[1539.2,328.7],"whites_ford":[1604.0,282.9],"frederick":[1649.7,46.2],"harpers_ferry":[1412.3,131.4],"winchester":[1103.2,262.7],"front_royal":[1080.5,513.6],"gordonsville":[1085.4,1240.4],"orange":[1141.5,1140.3],"thoroughfare_mtn":[1418.7,577.4]},"march":[[1284.0,776.1],[1262.2,754.8],[1247.6,736.1],[1225.3,744.1],[1233.1,703.5],[1248.4,668.4],[1276.7,624.1],[1305.9,586.7],[1325.5,563.6],[1386.6,565.7],[1407.8,582.1],[1429.1,601.1],[1486.6,612.8],[1504.2,627.8],[1524.3,661.5],[1556.7,696.5]],"mi":[0.0,2.3,4.0,5.8,8.8,11.7,15.6,19.1,21.3,25.8,27.8,29.9,34.2,36.0,38.9,42.4],"oarr":[[1916.1,619.3],[1841.1,633.5],[1761.0,628.8],[1710.0,633.5],[1637.2,646.5],[1604.2,670.0],[1556.7,696.5],[1520.7,728.7],[1483.9,760.7],[1449.3,776.2],[1394.7,836.8],[1361.9,872.5],[1300.8,902.0],[1225.0,928.6],[1200.3,996.8],[1178.4,1075.7],[1141.5,1140.3],[1085.4,1240.4]],"mgrr":[[1604.2,670.0],[1560.7,657.7],[1520.7,638.1],[1505.0,630.2],[1487.2,613.4],[1429.1,601.1],[1386.6,565.7],[1325.5,563.6],[1280.4,530.6],[1222.1,525.9],[1163.9,502.5],[1080.5,513.6],[1011.0,474.4],[961.4,447.3]],"rfp":[[1718.8,1000.5],[1680.9,1024.7],[1637.2,1052.5],[1615.3,1067.4],[1617.5,1089.6],[1629.9,1154.6],[1673.6,1275.0],[1644.5,1459.8],[1615.3,1607.3]],"rivers":[[[795,-60],[818,-54],[837,-57],[866,-50],[881,-49],[886,-62],[894,-70],[888,-75],[889,-82],[903,-70],[902,-81],[908,-82],[918,-79],[901,-95],[888,-113],[912,-115],[932,-110],[922,-125],[906,-147],[934,-143],[950,-137],[944,-154],[960,-152],[960,-161],[978,-164],[1015,-148],[1035,-164],[1057,-182],[1052,-194],[1074,-200],[1091,-219],[1152,-202],[1173,-188],[1195,-164],[1220,-129],[1248,-136],[1259,-132],[1262,-114],[1268,-122],[1263,-140],[1269,-146],[1277,-135],[1294,-128],[1308,-128],[1304,-142],[1324,-136],[1346,-129],[1340,-94],[1304,-88],[1321,-70],[1322,-48],[1338,-54],[1343,-64],[1351,-56],[1336,-32],[1374,-25],[1390,-32],[1388,-22],[1370,-11],[1384,3],[1370,5],[1379,18],[1366,24],[1387,34],[1404,42],[1413,61],[1405,77],[1410,98],[1400,112],[1402,122],[1421,134],[1455,131],[1467,138],[1491,147],[1521,152],[1540,150],[1543,164],[1559,188],[1617,222],[1609,239],[1602,260],[1576,275],[1574,319],[1599,335],[1618,360],[1653,372],[1681,378],[1716,379],[1731,384],[1768,404],[1773,421],[1766,432],[1772,453],[1782,456],[1793,463],[1819,466],[1841,468],[1857,492],[1876,519],[1899,528],[1912,547],[1935,577],[1924,632],[1924,682],[1918,711],[1885,722],[1853,748],[1860,781],[1843,802],[1816,806],[1761,865],[1752,943],[1794,1042],[1837,1022],[1909,991],[1941,994],[1961,1039],[1966,1086],[2014,1114],[2072,1154],[2146,1183],[2240,1197],[2322,1298],[2404,1343],[2518,1385],[2561,1487],[2561,1487]],[[1135,556],[1133,570],[1144,584],[1149,595],[1153,597],[1163,601],[1175,612],[1185,622],[1187,623],[1190,627],[1203,628],[1203,634],[1202,639],[1206,644],[1205,647],[1205,650],[1203,659],[1204,667],[1210,667],[1210,677],[1212,680],[1218,687],[1217,692],[1216,696],[1224,704],[1240,714],[1249,719],[1260,720],[1264,719],[1272,720],[1284,719],[1290,721],[1292,730],[1301,735],[1294,744],[1301,751],[1307,749],[1316,766],[1314,774],[1311,780],[1316,783],[1324,791],[1314,804],[1321,810],[1313,819],[1316,830],[1322,844],[1326,850],[1332,853],[1340,868],[1354,877],[1367,893],[1377,910],[1380,914],[1382,924],[1384,933],[1396,950],[1399,965],[1410,973],[1419,984],[1437,977],[1448,972],[1464,978],[1490,990],[1490,1004],[1498,1013],[1500,1023],[1507,1036],[1509,1056],[1520,1052],[1534,1045],[1539,1057],[1561,1080],[1565,1073],[1576,1066],[1594,1069],[1604,1070],[1614,1080],[1630,1106],[1636,1117],[1655,1132],[1673,1136],[1687,1143],[1705,1135],[1718,1143],[1727,1149],[1738,1145],[1737,1160],[1749,1158],[1752,1137],[1770,1139],[1787,1143],[1781,1151],[1767,1156],[1771,1176],[1777,1196],[1782,1188],[1794,1185],[1810,1198],[1827,1216],[1847,1213],[1864,1226],[1887,1218],[1890,1231],[1899,1233],[1905,1218],[1913,1238],[1925,1281],[1940,1281],[1954,1267],[1957,1281],[1980,1290],[2012,1329],[2019,1380],[2046,1396],[2059,1426],[2102,1455],[2116,1487],[2140,1522],[2215,1581],[2250,1612],[2277,1681],[2325,1708],[2374,1717],[2468,1743],[2468,1743]],[[1085,489],[1090,477],[1101,476],[1114,479],[1107,466],[1132,476],[1155,473],[1158,449],[1175,441],[1182,415],[1201,419],[1218,404],[1230,384],[1236,376],[1221,370],[1223,363],[1248,364],[1253,352],[1241,344],[1250,343],[1275,343],[1296,332],[1313,310],[1328,284],[1327,267],[1338,256],[1332,245],[1347,240],[1339,227],[1342,220],[1356,224],[1360,206],[1359,196],[1376,193],[1382,191],[1375,169],[1389,156],[1408,138],[1422,134],[1422,134]],[[956,1074],[959,1084],[955,1093],[963,1100],[968,1104],[969,1110],[977,1110],[979,1116],[986,1115],[991,1116],[1000,1113],[1010,1115],[1026,1126],[1028,1127],[1026,1133],[1025,1136],[1031,1143],[1039,1151],[1044,1150],[1052,1152],[1063,1150],[1072,1144],[1080,1140],[1089,1132],[1093,1123],[1089,1124],[1090,1120],[1092,1124],[1092,1124]],[[1090,1120],[1098,1122],[1101,1118],[1111,1120],[1114,1104],[1115,1110],[1123,1106],[1131,1110],[1135,1101],[1146,1092],[1152,1080],[1152,1080]],[[1594,728],[1608,732],[1616,724],[1620,719],[1622,716],[1632,713],[1642,714],[1644,706],[1651,710],[1658,700],[1663,703],[1663,691],[1669,694],[1673,696],[1680,708],[1688,696],[1702,699],[1708,707],[1717,709],[1713,716],[1724,712],[1740,718],[1763,733],[1779,752],[1802,818],[1802,818]],[[1474,491],[1484,491],[1494,500],[1501,505],[1505,514],[1511,520],[1524,535],[1533,539],[1541,543],[1549,547],[1549,556],[1549,564],[1551,574],[1553,580],[1561,580],[1564,590],[1580,587],[1577,596],[1586,611],[1590,624],[1603,625],[1614,628],[1620,628],[1624,621],[1632,633],[1650,650],[1650,659],[1648,663],[1650,674],[1656,674],[1658,669],[1668,673],[1674,683],[1673,696],[1673,696]],[[1452,636],[1454,643],[1462,643],[1466,648],[1483,652],[1500,664],[1506,664],[1514,664],[1521,666],[1529,669],[1539,676],[1542,670],[1552,673],[1559,680],[1563,689],[1566,695],[1571,701],[1579,702],[1584,703],[1580,714],[1585,720],[1593,720],[1594,728],[1594,728]],[[989,785],[1002,782],[1011,778],[1022,779],[1024,784],[1029,792],[1035,797],[1037,807],[1048,804],[1055,811],[1058,819],[1062,828],[1067,833],[1072,833],[1074,839],[1079,845],[1082,852],[1085,860],[1089,867],[1092,873],[1099,881],[1104,882],[1110,880],[1121,882],[1125,885],[1133,884],[1135,878],[1139,871],[1136,867],[1140,864],[1141,857],[1143,845],[1145,836],[1149,829],[1153,817],[1161,812],[1172,811],[1182,818],[1188,821],[1194,821],[1206,812],[1213,810],[1219,807],[1219,813],[1228,818],[1237,816],[1242,814],[1254,822],[1265,818],[1271,823],[1276,831],[1289,831],[1285,840],[1295,850],[1305,852],[1319,852],[1328,855],[1333,856]],[[1152,1080],[1159,1079],[1173,1077],[1192,1072],[1213,1064],[1235,1053],[1257,1040],[1280,1030],[1305,1026],[1329,1028],[1351,1033],[1373,1036],[1395,1033],[1416,1026],[1434,1015],[1453,1006],[1473,1000],[1486,997],[1488,997]]],"f25":[[1804.7,1200.9],[1796.0,1195.9],[1787.3,1191.0],[1778.6,1186.0],[1770.0,1181.0],[1761.3,1176.1],[1752.6,1171.1],[1743.9,1166.1],[1735.3,1161.2],[1726.6,1156.2],[1717.9,1151.2],[1709.2,1146.4],[1700.4,1141.6],[1691.6,1136.8],[1682.8,1132.1],[1673.8,1127.6],[1664.9,1123.2],[1655.8,1118.9],[1646.6,1115.1],[1637.3,1111.5],[1627.6,1108.9],[1618.4,1105.1],[1609.5,1100.4],[1601.1,1095.1],[1593.1,1089.0],[1585.8,1082.3],[1578.5,1075.4],[1571.2,1068.6],[1563.9,1061.8],[1556.5,1055.0],[1549.1,1048.3],[1541.7,1041.6],[1534.2,1034.9],[1526.8,1028.3],[1519.3,1021.6],[1511.8,1015.1],[1504.2,1008.5],[1496.5,1002.1],[1488.8,995.7],[1481.1,989.4],[1473.3,983.1],[1465.5,976.9],[1457.6,970.8],[1449.6,964.7],[1441.6,958.7],[1433.5,952.9],[1425.3,947.2],[1417.0,941.6],[1408.4,936.5],[1399.5,931.9],[1391.2,926.5],[1384.1,919.5],[1378.3,911.4],[1373.6,902.6],[1370.0,893.3],[1366.2,884.0],[1362.2,874.8],[1358.0,865.8],[1353.6,856.8],[1348.8,848.0],[1344.3,839.1],[1340.2,830.0],[1336.5,820.7],[1333.3,811.2],[1330.6,801.6],[1328.1,791.9],[1325.9,782.2],[1323.9,772.4],[1321.0,762.8],[1316.8,753.8],[1311.5,745.4],[1305.2,737.6],[1298.2,730.4],[1290.8,723.7],[1282.9,717.6],[1274.6,712.1],[1265.9,707.1],[1258.3,700.6],[1250.8,694.0],[1243.8,686.8],[1236.8,679.7],[1230.0,672.3],[1223.4,664.9],[1216.7,657.4],[1210.2,649.9],[1203.7,642.2],[1197.3,634.6],[1190.9,626.9],[1184.4,619.3],[1177.9,611.7],[1171.4,604.1],[1164.9,596.5],[1158.4,588.9],[1151.8,581.3],[1145.3,573.8],[1138.7,566.2],[1132.1,558.7],[1125.5,551.2],[1118.9,543.7],[1112.3,536.2],[1105.6,528.7],[1099.0,521.3],[1092.3,513.9],[1085.6,506.4],[1078.7,499.2],[1071.4,492.4],[1064.1,485.6],[1056.7,478.8],[1049.2,472.1],[1041.3,466.0],[1033.4,459.9],[1025.5,453.8],[1017.4,447.9],[1009.0,442.5],[1000.6,437.2],[992.1,431.8],[983.6,426.6],[974.7,422.1],[965.8,417.5],[956.9,412.9],[948.0,408.4],[938.6,404.9],[929.3,401.3],[919.9,397.8],[910.6,394.3],[901.1,391.1],[891.4,388.4],[881.8,385.7],[872.2,383.0],[862.6,380.3],[852.9,377.8],[843.1,375.8],[833.3,373.8],[823.5,371.7],[813.7,369.7],[803.9,367.7],[794.1,366.0],[784.2,364.5],[774.3,363.0],[764.4,361.6],[754.5,360.1],[744.6,358.7],[734.7,357.3],[724.7,356.5],[714.8,355.8],[704.8,355.1],[694.8,354.4],[684.8,353.7],[674.9,353.3],[664.9,353.5],[654.9,353.7],[644.9,354.0],[634.9,354.2],[624.9,354.8],[615.0,356.3],[605.1,357.8],[595.2,359.3],[585.3,360.7],[575.8,363.8],[566.3,366.8],[556.8,369.9],[547.2,372.8],[537.4,374.6],[527.5,376.4],[517.7,378.2],[507.9,380.0],[498.0,381.8],[488.2,383.6],[478.3,385.1],[468.4,386.4],[458.5,387.6],[448.6,388.9],[438.6,390.2],[428.7,391.5],[418.8,392.8],[408.9,394.0],[399.0,395.3],[389.0,396.4],[379.1,397.4],[369.1,398.4],[359.2,399.4],[349.2,400.4],[339.3,401.4],[329.3,402.4],[319.4,403.3],[309.4,404.3],[299.5,405.3],[289.5,406.3],[279.6,407.3],[269.6,408.2],[259.6,409.0],[249.7,409.8],[239.7,410.6],[229.7,411.4],[219.8,412.2],[209.8,413.0],[199.8,413.8],[189.9,414.6],[179.9,415.4],[169.9,416.2],[160.0,417.0],[150.0,417.8],[140.0,418.6],[130.1,419.4],[120.1,420.2],[110.1,421.0],[100.2,421.8],[90.2,422.6],[80.2,423.4],[70.3,424.2],[60.3,425.0],[50.3,425.8],[40.4,426.6],[30.4,427.4],[20.4,428.2],[10.5,429.0],[0.5,429.8],[-9.5,430.6],[-19.5,431.4],[-29.4,432.2],[-39.4,433.0],[-49.4,433.8],[-59.3,434.6],[-69.3,435.4],[-79.3,436.2]],"f02":[[1906.6,717.5],[1897.8,712.8],[1889.0,708.1],[1880.2,703.4],[1871.3,698.6],[1862.5,693.9],[1853.7,689.2],[1845.2,684.0],[1836.8,678.6],[1828.4,673.0],[1820.4,667.0],[1812.4,661.1],[1804.6,654.8],[1797.0,648.3],[1789.4,641.8],[1782.1,635.1],[1774.9,628.1],[1767.7,621.2],[1761.3,613.6],[1755.4,605.4],[1749.6,597.3],[1746.0,588.0],[1742.4,578.6],[1740.9,568.8],[1740.3,558.9],[1741.6,549.1],[1744.1,539.4],[1746.8,529.7],[1749.6,520.1],[1752.6,510.6],[1755.7,501.1],[1759.3,491.8],[1763.0,482.5],[1767.3,473.5],[1771.5,464.4]]};
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
const CW = 1920, CH = 1080, cam = { cx: 1500, cy: 770, s: 1.35 };
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
// ---------- times (spoken words) ----------
const P1 = "move2-1", P2 = "move2-2", P3 = "move2-3", P4 = "move2-4", P5 = "move2-5";
const T_SEVEN = at(P1, "Seven Days"), T_SLOW = at(P1, "oddly slow"), T_POPE = at(P1, "under John Pope"), T_RAPP = at(P1, "stood on the Rappahannock"),
  T_SEA = at(P1, "coming north by sea"), T_70 = at(P1, "seventy thousand"), T_55 = at(P1, "fifty-five thousand"), T_WAIT = at(P1, "could not wait");
const S2 = PS(P2), T_RULE = at(P2, "oldest rules of war"), T_SPLIT = at(P2, "he split his army"), T_LONG = at(P2, "Longstreet's wing"), T_BUSY = at(P2, "keep Pope busy"),
  T_24 = at(P2, "twenty-four thousand"), T_FAR = at(P2, "march far around"), T_BEHIND = at(P2, "get behind him"), T_RAIL = at(P2, "onto the railroad");
const S3 = PS(P3), T_DAWN = at(P3, "set off at dawn"), T_WAG = at(P3, "almost no wagons"), T_NORTH = at(P3, "They marched north"), T_HILLS = at(P3, "hidden behind a range"),
  T_SALEM = at(P3, "slept a few hours"), T_EAST = at(P3, "turned east through"), T_SCOUT = at(P3, "Union scouts saw"), T_THOUGHT = at(P3, "Pope thought"),
  T_SUNSET = at(P3, "By sunset"), T_55MI = at(P3, "fifty-five miles"), T_BRIS = at(P3, "at Bristoe Station");
const S4 = PS(P4), T_NIGHT = at(P4, "That night"), T_STUART = at(P4, "Jeb Stuart's cavalry"), T_SEIZE = at(P4, "seized Manassas Junction"), T_BASE = at(P4, "main supply base"),
  T_300 = at(P4, "three hundred prisoners"), T_NEXT = at(P4, "The next day"), T_WARE = at(P4, "walked into warehouses"), T_WROTE = at(P4, "One Confederate wrote"),
  T_EYE = at(P4, "Another eyewitness"), T_CARRY = at(P4, "What they could not carry"), T_BURN = at(P4, "they burned");
const S5 = PS(P5), T_TURN = at(P5, "turned his whole army"), T_BAG = at(P5, "bag the whole crowd"), T_REACH = at(P5, "reached Manassas"), T_RUINS = at(P5, "smoking ruins"),
  T_VAN = at(P5, "vanished again"), T_MOVEDN = at(P5, "he had moved north"), T_CUT = at(P5, "cut of an unfinished railroad"), T_OLD = at(P5, "old Bull Run battlefield"),
  T_WAITED = at(P5, "there he waited"), T_BACK = at(P5, "back and forth");
// ---------- map layers (bottom -> top): territory (multiply, per date), living map, geography ----------
const C25 = wimg("assets/media/nova_ctl_aug25_mx.png", 0, 0, T_NEXT + 0.6, { mx: true });
const C27 = wimg("assets/media/nova_ctl_aug27_mx.png", T_NEXT + 0.2, 1.0, T_MOVEDN + 0.4, { mx: true });
const C28 = wimg("assets/media/nova_ctl_aug28_mx.png", T_MOVEDN, 1.0, END - 1.0, { mx: true });
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.18 }); LV.shimmer(NV.rivers || [], { width: 1.2 }); LV.scaleBar(119.47); LV.north();
wimg("assets/media/nova_geo_ref.png", 0, 0, null);
// ---------- camera ----------
camTo(0, S2 - 1.0, 1520, 760, 1.42);                                   // wide: Rappahannock - Washington - Aquia, slow drift
camTo(S2 - 0.8, 1.8, 1420, 730, 1.7);                                   // the plan
camTo(S3 - 0.4, 2.0, 1370, 690, 2.35);                                  // the march area
camTo(T_EAST - 0.6, 3.0, 1440, 660, 2.6);                               // the gap, Gainesville, Bristoe
camTo(S4 - 0.4, 2.2, 1572, 680, 4.0);                                   // Bristoe + Manassas Junction close
camTo(S5 - 0.2, 2.0, 1500, 690, 2.5);                                   // Pope's columns converge
camTo(T_MOVEDN - 0.3, 2.4, 1555, 625, 3.4);                             // the trail north to Stony Ridge
const KM = L(38.815, -77.56);                                            // = move2b (bullrun z13) opening frame at s 0.667
camTo(END - 1.7, 1.68, KM[0], KM[1], 5.333, "power2.in");
SFX("whoosh", END - 1.4);
// ---------- dates, legend, flags, places ----------
B.showDate(0.05);
B.date("SUMMER 1862", 0.1, T_POPE - 0.2, 32); B.date("22 AUGUST 1862", T_POPE - 0.1, S3 - 0.2, 32); B.date("25 AUGUST · DAWN", S3 - 0.1, T_SALEM - 0.2, 30);
B.date("25 AUGUST · NIGHT", T_SALEM - 0.1, T_EAST - 0.2, 30); B.date("26 AUGUST 1862", T_EAST - 0.1, T_SUNSET - 0.2, 32); B.date("26 AUGUST · SUNSET", T_SUNSET - 0.1, T_NIGHT - 0.2, 30);
B.date("26 AUGUST · NIGHT", T_NIGHT - 0.1, T_NEXT - 0.2, 30); B.date("27 AUGUST 1862", T_NEXT - 0.1, T_CARRY - 0.2, 32); B.date("27 AUGUST · NIGHT", T_CARRY - 0.1, T_REACH - 0.2, 30);
B.date("28 AUGUST 1862", T_REACH - 0.1, END + 1, 32);
legend(0.2, END - 1.4);
// flag sets per camera phase (~115 px on screen)
const FW = [flag(FL.csa, "CONFEDERATE STATES", ...L(38.40, -78.20), 0.3, S3 - 0.2, 80), flag(FL.us, "UNITED STATES", ...L(38.98, -77.30), 0.35, S3 - 0.2, 80)];
const FM = [flag(FL.csa, "CONFEDERATE STATES", ...L(38.58, -78.12), S3 + 0.4, S4 - 0.3, 50), flag(FL.us, "UNITED STATES", ...L(38.62, -77.55), S3 + 0.45, S4 - 0.3, 50)];
const FC = [flag(FL.csa, "CONFEDERATE STATES", ...L(38.77, -77.585), S4 + 1.6, S5 - 0.4, 29), flag(FL.us, "UNITED STATES", ...L(38.70, -77.43), S4 + 1.65, S5 - 0.4, 29)];
const FP = [flag(FL.csa, "CONFEDERATE STATES", ...L(38.86, -77.66), S5 + 1.2, END - 1.6, 44), flag(FL.us, "UNITED STATES", ...L(38.66, -77.47), S5 + 1.25, END - 1.6, 44)];
// story places (wide set, small)
const W1 = [town("MANASSAS JUNCTION", "manassas_jct", 0.9, { dx: 52, dy: -12, until: S3 - 0.2 }), town("JEFFERSONTON", "jeffersonton", 1.0, { dx: -36, dy: 12, until: S3 - 0.2 }),
  town("AQUIA LANDING", "aquia", 1.1, { dx: 40, dy: -10, until: S3 - 0.2 }), town("FALMOUTH", "falmouth", 1.15, { dx: -30, dy: -10, until: S3 - 0.2 })];
const RAPL = box("RAPPAHANNOCK LINE", ...L(38.58, -77.70), 1.3, 9, S3 - 0.2, false);
// the front on the Rappahannock (wide campaign map: two-coloured), fades when the march gets behind it
const F25 = K.front({ pts: NV.f25 || [[1200, 900], [1400, 800]], sideA: "carth", sideB: "rome", t: T_RAPP - 0.4, dur: 1.8, width: 15, glow: 0.47, until: T_NEXT });
// =====================================================================================================================
// move2-1: Seven Days; Pope on the Rappahannock; the railroad; McClellan by sea; 70,000 vs 55,000
// =====================================================================================================================
B.title("MOVE 2", "MANASSAS", "AUGUST 1862", 0.3, T_SEVEN + 1.2); SFX("ref:boom", 0.4);
// units on screen in the first second: Pope's corps on the river, Burnside at Falmouth, Lee's army moving up
const RD = [["sig", 38.70, -77.86, "SIGEL"], ["mcd", 38.665, -77.82, "McDOWELL"], ["bnk", 38.60, -77.80, "BANKS"], ["ren", 38.52, -77.76, "RENO"], ["bur", 38.335, -77.45, "BURNSIDE"]];
RD.forEach(([id, la, lo, lb], i) => unit(id, "rome", ...L(la, lo), "infantry", { t: 0.4 + i * 0.08, size: "XXX", label: lb }));
const LEEU = [["lng", 38.40, -78.00, 38.51, -77.86, "LONGSTREET"], ["jck", 38.30, -78.08, 38.625, -77.93, "JACKSON"], ["stu", 38.36, -77.88, 38.49, -77.84, "STUART"]];
LEEU.forEach(([id, la, lo, , , lb], i) => unit(id, "carth", ...L(la, lo), "infantry", { t: 0.5 + i * 0.08, size: id === "stu" ? "XX" : "XXXX", label: lb }));
cavIcon("stu");
LEEU.forEach(([id, , , la, lo], i) => go(id, 0.8 + i * 0.2, 4.2, L(la, lo), "power1.inOut"));
arr([L(37.80, -77.70), L(38.05, -77.85), L(38.30, -77.98)], "carth", 0.7, { w: 9, dur: 2.0, until: T_RAPP });
const SEV = tag("FROM RICHMOND · AFTER THE SEVEN DAYS", ...L(37.90, -77.62), T_SEVEN - 0.3, "#1f4fc4", 11, T_RAPP);
const SL = scr(`<div style="padding:8px 18px 10px;background:rgba(18,16,12,0.9);border-left:6px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea"><div style="font-size:15px;letter-spacing:0.24em;color:#9fc0ea">SEVEN DAYS · JUNE-JULY 1862</div><div style="font-size:26px;letter-spacing:0.06em">JACKSON: ODDLY SLOW, EXHAUSTED</div></div>`, "left:110px;top:660px;");
slide(SL, T_SLOW - 0.4, T_RAPP - 0.2, -90);
badge({ name: "JOHN POPE", role: "ARMY OF VIRGINIA", photo: "assets/media/pope_head.png", flag: FL.us, side: "rome", corner: "tr", t: T_POPE - 0.2, until: T_SEA + 0.4 });
const AOV = tag("ARMY OF VIRGINIA", ...L(38.74, -77.68), T_POPE + 0.3, "#c4121f", 12, S3 - 0.2);
// the O&A railroad glows from the front back to Manassas Junction and Washington; depot icon at the Junction
const OA = (NV.oarr || []).slice(0, 12).reverse();   // Rappahannock Station -> Manassas Junction -> Alexandria
const RRG = glowLine(OA.length ? OA : [[1360, 870], [1600, 670], [1916, 619]], "#ffd65a", 2.2, T_RAPP + 0.8, S3 - 0.2, { dur: 2.2, pulse: 3 });
const DEP = GG.pin(DEPOT, ...PL.manassas_jct || [1604, 670], { t: T_RAPP + 2.2, pop: true, until: S3 - 0.2 }); SFX("ref:pop", T_RAPP + 2.3);
const ORA = tag("ORANGE &amp; ALEXANDRIA RAILROAD", ...L(38.66, -77.52), T_RAPP + 1.6, "#7a6420", 9, S3 - 0.2);
// McClellan's men by sea: transports up the Potomac to Aquia and Alexandria, then arrows to join Pope
const SHIPS = [[[38.10, -76.62], [38.25, -76.92], [38.37, -77.27]], [[38.12, -76.66], [38.30, -77.00], [38.55, -77.20], [38.76, -77.05]], [[38.08, -76.58], [38.27, -76.96], [38.39, -77.29]]];
SHIPS.forEach((p, i) => { const a = L(...p[0]), el = GG.ship(a[0], a[1], { w: 30, color: "#c4121f", t: T_SEA - 0.4 + i * 0.3, pop: true });
  p.slice(1).forEach((q, k) => { const b = L(...q); tl.to(el, { left: b[0], top: b[1], duration: 2.0, ease: "none" }, T_SEA - 0.2 + i * 0.3 + k * 2.0); });
  tl.to(el, { autoAlpha: 0, duration: 0.5 }, S3 - 0.4); });
arr([L(38.39, -77.33), L(38.37, -77.42), L(38.40, -77.55), L(38.48, -77.68)], "rome", T_SEA + 3.6, { w: 6, dur: 1.4, until: S3 - 0.2 });
arr([L(38.79, -77.10), L(38.77, -77.28), L(38.74, -77.45)], "rome", T_SEA + 4.2, { w: 6, dur: 1.4, until: S3 - 0.2 });
const MCC = tag("McCLELLAN'S CORPS · BY SEA", ...L(38.26, -77.12), T_SEA + 0.6, "#c4121f", 11, S3 - 0.2);
// count card
const CNT = scr(`<div style="display:flex;gap:34px;padding:16px 34px 18px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 18px 36px rgba(0,0,0,.6)">
  <div style="text-align:center"><div style="font-size:18px;letter-spacing:0.26em;color:#ef8a82">POPE + McCLELLAN</div><div class="a" style="font-size:80px;line-height:1">0</div><div style="font-size:16px;letter-spacing:0.2em;color:#d8cfb8">ONCE COMBINED</div></div>
  <div style="width:3px;background:#5c564a"></div>
  <div class="lee" style="text-align:center"><div style="font-size:18px;letter-spacing:0.26em;color:#9fc0ea">LEE</div><div class="b" style="font-size:80px;line-height:1">0</div><div style="font-size:16px;letter-spacing:0.2em;color:#d8cfb8">ARMY OF NORTHERN VIRGINIA</div></div></div>`,
  "left:0;right:0;margin:auto;width:700px;top:170px;");
slam(CNT, T_70 - 0.3, { from: 1.6, shake: 4, until: S2 - 0.2 });
const ca = { v: 0 }, cA = CNT.querySelector(".a"), cB = CNT.querySelector(".b"), LEEB = CNT.querySelector(".lee"); gsap.set(LEEB, { autoAlpha: 0 });
tl.to(ca, { v: 70000, duration: 1.4, ease: "power2.out", onUpdate: () => { cA.textContent = "~" + (Math.round(ca.v / 1000) * 1000).toLocaleString("en-US"); } }, T_70 - 0.1);
for (let t = T_70 - 0.1; t < T_70 + 1.3; t += 0.14) SFX("tick", t);
const cb = { v: 0 }; tl.to(LEEB, { autoAlpha: 1, duration: 0.3 }, T_55 - 0.3);
tl.to(cb, { v: 55000, duration: 1.2, ease: "power2.out", onUpdate: () => { cB.textContent = "~" + (Math.round(cb.v / 1000) * 1000).toLocaleString("en-US"); } }, T_55 - 0.2);
for (let t = T_55 - 0.2; t < T_55 + 1.0; t += 0.14) SFX("tick", t);
B.caption("STRIKE BEFORE THEY COMBINE", T_WAIT - 0.2, S2 - 0.1, "carth r");
// =====================================================================================================================
// move2-2: Lee splits his army; Longstreet holds the river; Jackson goes round Pope's right to the railroad
// =====================================================================================================================
badge({ name: "ROBERT E. LEE", role: "ARMY OF NORTHERN VIRGINIA", photo: "assets/media/lee_head.png", flag: FL.csa, side: "carth", corner: "tl", t: S2 + 0.1, until: T_24 - 0.4 });
sstamp("HE SPLIT HIS ARMY", 700, T_SPLIT - 0.1, { size: 58, sub: "IN THE FACE OF A STRONGER ENEMY", until: T_LONG + 0.6, color: "#2f6fe0" });
// the split: Longstreet stays on the river (guns across it), Jackson's counter pulls back to Jeffersonton
const lp = ux("lng");
[[38.53, -77.80], [38.56, -77.83], [38.66, -77.86]].forEach((q, k) => shoot([lp[0] + 6, lp[1] - 6], L(...q), T_BUSY - 0.6 + k * 0.6, { r: 6, h: 12 }));
const LW = tag("LONGSTREET'S WING · HOLDS THE RIVER", ...L(38.44, -77.92), T_LONG, "#1f4fc4", 10, S3 - 0.2);
badge({ name: "STONEWALL JACKSON", role: "LEE'S LEFT WING", photo: "assets/media/jackson_head.png", flag: FL.csa, side: "carth", corner: "tr", t: T_24 - 0.6, until: S3 + 0.4 });
const J24 = scr(`<div style="padding:10px 26px 12px;background:rgba(14,12,10,0.9);border-top:6px solid #2e5cb2;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 16px 32px rgba(0,0,0,.6)">
  <div style="font-size:18px;letter-spacing:0.3em;color:#9fc0ea">JACKSON'S WING</div><div class="n" style="font-size:64px;line-height:1">0</div><div style="font-size:16px;letter-spacing:0.22em;color:#d8cfb8">MEN</div></div>`, "left:110px;top:640px;");
slam(J24, T_24 - 0.3, { from: 1.6, shake: 3, until: T_RAIL + 0.4 });
const jv = { v: 0 }, jn = J24.querySelector(".n"); tl.to(jv, { v: 24000, duration: 1.2, ease: "power2.out", onUpdate: () => { jn.textContent = "~" + (Math.round(jv.v / 1000) * 1000).toLocaleString("en-US"); } }, T_24 - 0.1);
for (let t = T_24 - 0.1; t < T_24 + 1.1; t += 0.14) SFX("tick", t);
// the plan: a dotted blue arc far round Pope's right, through Thoroughfare Gap, onto the railroad
const PLAN = [PL.jeffersonton, PL.orlean, PL.salem, PL.thoroughfare_gap, PL.gainesville, PL.bristoe].filter(Boolean);
arr(PLAN.length > 2 ? PLAN : [[1284, 776], [1325, 563], [1556, 696]], "carth", T_FAR - 0.2, { w: 8, dur: 3.0, dash: "4 12", until: S3 - 0.3 });
K.target(...(PL.thoroughfare_gap || [1429, 601]), T_FAR + 1.6, { r: 18, side: "#ffd54a", until: S3 - 0.3 });
const TG1 = town("THOROUGHFARE GAP", "thoroughfare_gap", T_FAR + 1.5, { dx: -54, dy: -12, until: S3 - 0.3 });
const BEH = tag("BEHIND POPE", ...L(38.80, -77.50), T_BEHIND, "#1f4fc4", 11, S3 - 0.3);
const SUP = tag("POPE'S SUPPLY LINE", ...L(38.63, -77.60), T_RAIL, "#7a6420", 11, S3 - 0.3);
glowLine(OA.length ? OA : [[1360, 870], [1600, 670]], "#ffb347", 3.2, T_RAIL - 0.2, S3 - 0.2, { dur: 1.0, pulse: 3 });
K.target(...(PL.manassas_jct || [1604, 670]), T_RAIL + 0.6, { r: 20, side: "#ffd54a", until: S3 - 0.2 });
// =====================================================================================================================
// move2-3: the march, 25-26 Aug: Jeffersonton -> Salem (night) -> Thoroughfare Gap -> Gainesville -> Bristoe; mileage counter
// =====================================================================================================================
tl.to([...W1, RAPL, AOV, ORA, MCC], { autoAlpha: 0, duration: 0.4 }, S3 - 0.3);
GG.dawn(S3 - 0.2, T_HILLS);
const M = NV.march || [[1284, 776], [1325, 563], [1429, 601], [1556, 696]], MC = cumOf(M), MT = MC[MC.length - 1];
const MI = NV.mi || [0, 42.4], ML = MI[MI.length - 1];
const dAtPlace = (key) => { const p = PL[key]; let best = 0, bd = 1e9; for (let k = 0; k <= 400; k++) { const q = atLen(M, MC, MT * k / 400), d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = MT * k / 400; } } return best; };
const D_SALEM = dAtPlace("salem"), D_GAP = dAtPlace("thoroughfare_gap");
const T_GO = T_DAWN - 0.2, T_ARR_SALEM = T_SALEM, T_LEAVE = T_EAST - 0.4, T_ARR = T_BRIS - 0.3;
// Jackson's three divisions in column (Ewell, A.P. Hill, Taliaferro = Jackson's own division) + the march trail
B.hideUnits(["jck"], T_GO);
const COL = [["ewl", "EWELL"], ["aph", "A.P. HILL"], ["tal", "TALIAFERRO"]];
COL.forEach(([id, lb], i) => { unit(id, "carth", ...M[0], "infantry", { t: T_GO - 0.3 + i * 0.1, size: "XX", label: lb, w: 24, h: 16, fs: 6.5 }); });
const LAG = [0, 22, 44];
COL.forEach(([id], i) => { follow(id, M, T_GO, T_ARR_SALEM - T_GO, 0, D_SALEM, LAG[i], "sine.inOut");
  follow(id, M, T_LEAVE, T_ARR - T_LEAVE, D_SALEM, MT, LAG[i], "sine.inOut"); });
const TRAIL1 = glowLine(M.filter((q, k) => MC[k] <= D_SALEM + 1).concat([atLen(M, MC, D_SALEM)]), "#2f6fe0", 2.4, T_GO, S5 - 0.4, { dur: T_ARR_SALEM - T_GO, core: "#cfe0ff", ease: "sine.inOut" });
const TRAIL2 = glowLine([atLen(M, MC, D_SALEM)].concat(M.filter((q, k) => MC[k] > D_SALEM)), "#2f6fe0", 2.4, T_LEAVE, S5 - 0.4, { dur: T_ARR - T_LEAVE, core: "#cfe0ff", ease: "sine.inOut" });
// dust above the column (seen by Union scouts)
for (let t = T_GO + 0.6; t < T_ARR; t += 0.9) { if (t > T_ARR_SALEM && t < T_LEAVE) continue;
  const f = t < T_ARR_SALEM ? (t - T_GO) / (T_ARR_SALEM - T_GO) * D_SALEM : D_SALEM + (t - T_LEAVE) / (T_ARR - T_LEAVE) * (MT - D_SALEM);
  const q = atLen(M, MC, f); K.smoke(q[0] + 4, q[1] - 6, t, { n: 2, r: 6, rise: 12, life: 2.0, alpha: 0.45, drift: 6 }); }
const NO_W = tag("ALMOST NO WAGONS", ...L(38.60, -78.02), T_WAG - 0.2, "#1f4fc4", 10, T_HILLS + 0.6);
// mileage counter (scaled to the drawn line; ends on the NPS figure, 55 MILES)
const MIL = scr(`<div style="padding:10px 24px 12px;background:rgba(14,12,10,0.9);border-top:6px solid #2e5cb2;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 16px 32px rgba(0,0,0,.6)">
  <div style="position:relative;height:22px;font-size:16px;letter-spacing:0.3em;color:#9fc0ea"><div class="d1" style="position:absolute;left:0;right:0">DAY 1 · 25 AUGUST</div><div class="d2" style="position:absolute;left:0;right:0;opacity:0">DAY 2 · 26 AUGUST</div></div><div style="font-size:60px;line-height:1"><span class="n">0</span> <span style="font-size:26px;letter-spacing:0.12em">MILES</span></div></div>`, "right:110px;top:300px;");
slide(MIL, T_GO - 0.2, T_NIGHT - 0.4, 90);
const mn = MIL.querySelector(".n"), mv = { v: 0 }, S55 = 55 / MT;
tl.to(mv, { v: D_SALEM * S55, duration: T_ARR_SALEM - T_GO, ease: "sine.inOut", onUpdate: () => { mn.textContent = Math.round(mv.v); } }, T_GO);
tl.to(mv, { v: 55, duration: T_ARR - T_LEAVE, ease: "sine.inOut", onUpdate: () => { mn.textContent = Math.round(mv.v); } }, T_LEAVE);
for (let t = T_GO; t < T_ARR_SALEM; t += 0.5) SFX("tick", t);
for (let t = T_LEAVE; t < T_ARR; t += 0.5) SFX("tick", t);
tl.to(MIL.querySelector(".d1"), { opacity: 0, duration: 0.3 }, T_LEAVE - 0.3); tl.to(MIL.querySelector(".d2"), { opacity: 1, duration: 0.3 }, T_LEAVE - 0.2);
// hidden behind the Bull Run Mountains: the ridge glows as a screen (ghost outline)
const RIDGE = [L(39.02, -77.63), L(38.95, -77.655), L(38.88, -77.69), L(38.835, -77.71), L(38.80, -77.73), L(38.75, -77.76)];
glowLine(RIDGE, "#c9b48a", 3, T_HILLS - 0.2, T_SCOUT + 1.2, { dur: 1.2, core: "#efe2c0", dash: "8 6" });
const BRM = tag("BULL RUN MOUNTAINS · A SCREEN", ...L(38.97, -77.60), T_HILLS, "#7a6420", 10, T_SCOUT + 1.2);
// night at Salem: moon + short night
GG.night(T_SALEM - 0.4, T_EAST - 0.6, { dur: 0.9, outDur: 1.0 });
const SAL = town("SALEM", "salem", T_SALEM - 0.6, { dx: -26, dy: -12, until: S5 - 0.4 });
const MO = GG.pin(MOON, PL.salem[0] + 14, PL.salem[1] - 26, { t: T_SALEM - 0.2, pop: true, until: T_EAST - 0.4 }); SFX("ref:pop", T_SALEM);
const ZZZ = tag("A FEW HOURS' SLEEP", PL.salem[0] - 6, PL.salem[1] + 14, T_SALEM + 0.2, "#1f4fc4", 8, T_EAST - 0.4);
// 26 Aug: east through Thoroughfare Gap (ring), Gainesville, Bristoe
const TG2 = town("THOROUGHFARE GAP", "thoroughfare_gap", T_EAST - 0.4, { dx: 4, dy: 14, until: S5 - 0.4 });
K.target(...PL.thoroughfare_gap, T_EAST, { r: 14, side: "#ffd54a", until: T_SCOUT + 1.0 });
const GV = town("GAINESVILLE", "gainesville", T_EAST + 1.6, { dx: 30, dy: -10, until: S5 - 0.4 });
const BS = town("BRISTOE STATION", "bristoe", T_SUNSET - 0.4, { dx: 4, dy: 13, until: END - 1.6 });
const MJ = town("MANASSAS JUNCTION", "manassas_jct", T_SUNSET - 0.2, { dx: 10, dy: -12, until: END - 1.6 });
// Pope's corps stay facing the river; a Union scout sees the dust
const SC = L(38.80, -77.86);
const SCOUT = GG.pin(`<svg width="14" height="14" viewBox="0 0 14 14" style="display:block;filter:drop-shadow(0 1px 2px #000)"><circle cx="7" cy="7" r="6" fill="#c4121f" stroke="#f3eee2" stroke-width="1.5"/><circle cx="7" cy="7" r="2" fill="#f3eee2"/></svg>`, SC[0], SC[1], { t: T_SCOUT - 0.4, pop: true, until: T_SUNSET });
const SCL = GG.pin(`<svg width="60" height="20" viewBox="0 0 60 20" style="overflow:visible"><path d="M0 10 L58 2 M0 10 L58 18" stroke="#ffd65a" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/></svg>`, SC[0] - 34, SC[1] - 4, { t: T_SCOUT - 0.1, until: T_SUNSET });
const SCT = tag("UNION SCOUTS SEE THE DUST", SC[0] + 6, SC[1] + 16, T_SCOUT, "#c4121f", 8, T_SUNSET);
const BELIEF = scr(`<div style="padding:14px 28px 16px;background:rgba(18,16,12,0.93);border-left:8px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 18px 36px rgba(0,0,0,.6)">
  <div style="font-size:18px;letter-spacing:0.28em;color:#ef8a82">POPE BELIEVES</div><div style="font-size:44px;letter-spacing:0.05em;line-height:1.08">JACKSON IS HEADED FOR<br>THE SHENANDOAH VALLEY</div></div>`, "left:110px;top:640px;");
slam(BELIEF, T_THOUGHT - 0.2, { from: 1.5, shake: 3, sfx: "hit", until: T_SUNSET - 0.2 });
arr([L(38.86, -77.95), L(38.88, -78.08), L(38.90, -78.20)], "rome", T_THOUGHT + 0.3, { w: 5, dur: 1.2, dash: "3 8", until: T_SUNSET });
GG.dawn(T_SUNSET - 0.4, T_NIGHT + 0.6);
sstamp("55 MILES · 2 DAYS", 230, T_55MI - 0.2, { size: 60, sub: "ON POPE'S RAILROAD AT BRISTOE STATION", until: S4 + 0.6, color: "#2f6fe0" });
// =====================================================================================================================
// move2-4: night 26-27: the railroad cut at Bristoe; Manassas Junction seized; 27 Aug the depot; night 27 it burns
// =====================================================================================================================
const NIGHT1 = GG.night(T_NIGHT - 0.6, T_NEXT - 0.2, { dur: 1.4, outDur: 1.6 });
K.night({ lines: [F25], tOn: T_NIGHT - 0.6, tOff: T_NEXT - 0.2 });
// a train runs into Bristoe on the O&A and is wrecked (impacts)
const OAF = (NV.oarr || []).slice(5, 9).reverse();          // Warrenton Jct -> Catlett -> Bristoe direction (from the south-west)
const TR = GG.pin(TRAIN("#c4121f"), ...L(38.70, -77.575), { t: S4 + 0.2, pop: true, until: T_SEIZE + 2.0 });
tl.to(TR, { left: PL.bristoe[0] - 4, top: PL.bristoe[1] + 3, duration: 2.0, ease: "power1.in" }, S4 + 0.4);
tl.to(TR, { rotation: 28, filter: "grayscale(1) brightness(0.6)", duration: 0.3 }, S4 + 2.4);
const ew = ux("ewl");
[[0, 0], [-4, 2], [3, -2], [6, 3]].forEach(([dx, dy], k) => K.impact(PL.bristoe[0] + dx, PL.bristoe[1] + 3 + dy, S4 + 2.3 + k * 0.3, { r: 5, puffs: 2 }));
const CUT = tag("RAILROAD CUT", PL.bristoe[0] - 10, PL.bristoe[1] + 26, S4 + 2.6, "#1f4fc4", 7, T_NEXT);
// Trimble's two regiments + Stuart's cavalry ride to Manassas Junction
unit("trm", "carth", PL.bristoe[0] + 6, PL.bristoe[1] - 8, "infantry", { t: T_NIGHT - 0.2, size: "II", label: "TRIMBLE", w: 18, h: 12, fs: 5 });
B.hideUnits(["stu"], T_NIGHT - 0.3, 0.3);
unit("stu2", "carth", PL.bristoe[0] - 6, PL.bristoe[1] - 16, "infantry", { t: T_STUART - 0.4, size: "XX", label: "STUART", w: 18, h: 12, fs: 5 }); cavIcon("stu2");
go("trm", T_STUART, 2.6, [PL.manassas_jct[0] - 8, PL.manassas_jct[1] + 8], "power1.inOut");
go("stu2", T_STUART + 0.2, 2.4, [PL.manassas_jct[0] + 8, PL.manassas_jct[1] - 10], "power1.inOut");
arr([[PL.bristoe[0] + 8, PL.bristoe[1] - 10], [PL.bristoe[0] + 30, PL.bristoe[1] - 22], [PL.manassas_jct[0] - 12, PL.manassas_jct[1] + 6]], "carth", T_STUART, { w: 4, dur: 2.2, until: T_NEXT });
const MJp = PL.manassas_jct;
unit("gar", "rome", MJp[0] + 2, MJp[1] - 2, "infantry", { t: T_NIGHT, size: "", label: "DEPOT GUARD", w: 16, h: 11, fs: 4.5 });
for (let k = 0; k < 4; k++) mg([MJp[0] - 14, MJp[1] + 12], [MJp[0] + 2, MJp[1]], T_SEIZE - 0.6 + k * 0.7, 4);
[[1, 2], [-3, -1], [4, -3]].forEach(([dx, dy], k) => K.impact(MJp[0] + dx, MJp[1] + dy, T_SEIZE + 0.2 + k * 0.35, { r: 5, puffs: 2 }));
K.target(MJp[0], MJp[1], T_SEIZE - 0.2, { r: 14, side: "rome", until: T_SEIZE + 1.6 });
K.target(MJp[0], MJp[1], T_SEIZE + 1.6, { r: 14, side: "carth", until: T_NEXT + 2.0 });
B.grey(["gar"], T_SEIZE + 1.0, 0.6); B.hideUnits(["gar"], T_300 + 0.6);
const BASE = tag("POPE'S MAIN SUPPLY BASE", MJp[0] + 4, MJp[1] - 30, T_BASE - 0.2, "#7a6420", 7, T_NEXT);
sstamp("~300 PRISONERS", 700, T_300 - 0.1, { size: 56, sub: "MANASSAS JUNCTION · NIGHT 26-27 AUGUST", until: T_NEXT + 0.6 });
// 27 Aug: the depot (warehouses, trains), the hungry column arrives
const DEPS = [[-14, -6], [-4, -12], [8, -8], [14, 2], [-10, 6]].map(([dx, dy], k) => GG.pin(DEPOT, MJp[0] + dx, MJp[1] + dy, { t: T_NEXT + 0.2 + k * 0.12, pop: true }));
const TRS = [[-24, 14], [20, 14], [26, -14]].map(([dx, dy], k) => GG.pin(TRAIN("#8a7a5a"), MJp[0] + dx, MJp[1] + dy, { t: T_NEXT + 0.4 + k * 0.15, pop: true }));
SFX("ref:pop", T_NEXT + 0.3);
COL.forEach(([id], i) => go(id, T_NEXT + 0.4 + i * 0.2, 2.2, [MJp[0] - 16 + i * 12, MJp[1] + 22 - i * 4]));
B.hideUnits(["trm"], T_NEXT + 0.4); go("stu2", T_NEXT + 0.4, 2.0, [MJp[0] + 22, MJp[1] - 20]);
const STK = tag("WAREHOUSES STACKED WITH FOOD", MJp[0], MJp[1] + 40, T_WARE - 0.2, "#7a6420", 8, T_CARRY);
const FOOD = scr(`<div style="padding:12px 26px 14px;background:#ece5d3;color:#1a1712;font-family:Oswald;font-weight:700;box-shadow:0 18px 40px rgba(0,0,0,.65);border-top:8px double #1a1712;transform:rotate(-2deg)">
  <div style="font-size:16px;letter-spacing:0.28em;color:#6b6252">A CONFEDERATE OF THE 21ST VIRGINIA LISTED</div><div style="font-size:40px;letter-spacing:0.06em;line-height:1.1">POTTED HAM · LOBSTER · TONGUE<br>CANDY · CAKES</div></div>`, "left:110px;top:620px;");
slam(FOOD, T_WROTE + 0.2, { from: 1.5, sfx: "ref:pop", shake: false, until: T_EYE - 0.2 });
const QT = scr(`<div style="max-width:1100px;padding:18px 30px 20px;background:rgba(18,16,12,0.93);border-left:8px solid #1f4fc4;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 18px 36px rgba(0,0,0,.6)">
  <div style="font-size:18px;letter-spacing:0.3em;color:#9fc0ea">CONFEDERATE EYEWITNESS · AS QUOTED BY THE NATIONAL PARK SERVICE</div>
  <div style="font-size:38px;letter-spacing:0.03em;line-height:1.15">"TO SEE A STARVING MAN EATING LOBSTER SALAD &amp; DRINKING RHINE WINE, BAREFOOTED &amp; IN TATTERS WAS CURIOUS"</div></div>`, "left:0;right:0;margin:auto;width:1100px;top:660px;");
tl.fromTo(QT, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, T_EYE + 0.1); SFX("ref:pop", T_EYE + 0.2);
tl.to(QT, { autoAlpha: 0, duration: 0.4 }, T_CARRY + 0.2);
// night 27: the depot burns (fire + smoke columns)
const NIGHT2 = GG.night(T_CARRY - 0.2, T_REACH - 0.3, { dur: 1.2, outDur: 1.6 });
const FIRES = [[-14, -6], [-4, -12], [8, -8], [14, 2], [-10, 6], [-24, 14], [20, 14], [26, -14]];
FIRES.forEach(([dx, dy], k) => { const t0 = T_BURN - 0.6 + k * 0.18, el = GG.pin(FIRE(18), MJp[0] + dx, MJp[1] + dy - 2, { t: t0 });
  tl.to(el, { scale: 1.3, opacity: 0.75, duration: 0.35, yoyo: true, repeat: Math.round((T_REACH - t0) / 0.35), ease: "sine.inOut" }, t0 + 0.5);
  tl.to(el, { autoAlpha: 0, duration: 1.2 }, T_REACH + 0.6); });
[...DEPS, ...TRS].forEach((el, k) => tl.to(el, { filter: "grayscale(1) brightness(0.45)", duration: 0.8 }, T_BURN + k * 0.12));
K.impact(MJp[0] + 2, MJp[1] - 4, T_BURN - 0.3, { r: 9, puffs: 3 }); K.impact(MJp[0] - 12, MJp[1] + 8, T_BURN + 0.4, { r: 8, puffs: 2 });
for (let t = T_BURN - 0.4; t < T_VAN + 3; t += 0.7) FIRES.slice(0, 5).forEach(([dx, dy], k) => { if ((Math.round(t * 10) + k) % 2) K.smoke(MJp[0] + dx, MJp[1] + dy - 6, t + k * 0.09, { n: 2, r: 7, rise: 26, life: 3.0, alpha: 0.7, drift: 12 }); });
sstamp("THE DEPOT BURNS", 230, T_BURN + 0.2, { size: 56, sub: "MANASSAS JUNCTION · NIGHT 27 AUGUST", until: S5 + 0.4 });
// =====================================================================================================================
// move2-5: Pope turns round; "bag the whole crowd"; the columns find smoke; Jackson vanished to Stony Ridge
// =====================================================================================================================
badge({ name: "JOHN POPE", role: "ARMY OF VIRGINIA", photo: "assets/media/pope_head.png", flag: FL.us, side: "rome", corner: "tr", t: S5 + 0.1, until: T_REACH });
const BAG = scr(`<div style="padding:14px 28px 16px;background:rgba(18,16,12,0.93);border-left:8px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 18px 36px rgba(0,0,0,.6)">
  <div style="font-size:18px;letter-spacing:0.28em;color:#ef8a82">POPE TO HIS GENERALS · 27 AUG 1862</div><div style="font-size:52px;letter-spacing:0.05em;line-height:1.08">"BAG THE WHOLE CROWD"</div></div>`, "left:110px;top:640px;");
slam(BAG, T_BAG - 0.3, { from: 1.6, shake: 4, until: T_RUINS - 0.2 });
// Pope's corps leave the river and converge on Manassas (arrows), then reach the ruins
const CONV = [["sig", 38.78, -77.60], ["mcd", 38.76, -77.56], ["bnk", 38.66, -77.62], ["ren", 38.75, -77.50]];
CONV.forEach(([id, la, lo], i) => go(id, T_TURN - 0.2 + i * 0.15, 3.4, L(la, lo), "power1.inOut"));
B.hideUnits(["bur", "lng", "jck"], T_TURN);
[[[38.72, -77.80], [38.75, -77.70], [38.775, -77.61]], [[38.66, -77.66], [38.70, -77.60], [38.745, -77.52]], [[38.60, -77.74], [38.64, -77.66], [38.70, -77.58]],
 [[38.83, -77.30], [38.80, -77.40], [38.765, -77.465]]].forEach((p, i) => arr(p.map((q) => L(...q)), "rome", T_TURN + i * 0.2, { w: 6, dur: 1.6, until: T_VAN + 0.4 }));
const EMP = sstamp("EMPTY", 700, T_RUINS - 0.1, { size: 64, sub: "ONLY SMOKING RUINS · 28 AUGUST", until: T_MOVEDN + 0.6 });
// Jackson has vanished: the column ghosts and slips north in the night (dotted ghost trail) to Stony Ridge behind the unfinished railroad
ghost(["ewl", "aph", "tal", "stu2"], T_VAN - 0.3, 0.25);
const SR = L(38.830, -77.580);
const TRL = [[MJp[0], MJp[1] - 6], L(38.80, -77.48), PL.centreville ? [PL.centreville[0] - 10, PL.centreville[1] + 6] : L(38.84, -77.44), L(38.835, -77.52), [SR[0] + 10, SR[1]]];
glowLine(TRL, "#2f6fe0", 1.6, T_MOVEDN - 0.4, END - 1.6, { dur: 2.4, core: "#cfe0ff", dash: "3 6" });
glowLine([[MJp[0] - 4, MJp[1] - 4], L(38.79, -77.53), L(38.815, -77.56), [SR[0] + 4, SR[1] + 4]], "#2f6fe0", 1.6, T_MOVEDN - 0.2, END - 1.6, { dur: 2.4, core: "#cfe0ff", dash: "3 6" });
const HID = [[38.833, -77.565], [38.838, -77.548], [38.826, -77.585]];
COL.forEach(([id], i) => { tl.set(B.units[id].el, { left: L(...HID[i])[0] - 12, top: L(...HID[i])[1] - 8 }, T_MOVEDN + 1.8); });
tl.to(["ewl", "aph", "tal"].map((id) => B.units[id].el), { opacity: 0.55, filter: "grayscale(0.4) brightness(0.9)", duration: 0.6 }, T_MOVEDN + 2.0);
B.hideUnits(["stu2"], T_MOVEDN + 1.0);
const UNF = [L(38.799, -77.620), L(38.816, -77.590), L(38.8235, -77.566), L(38.8255, -77.553), L(38.831, -77.542), L(38.8412, -77.536)];
glowLine(UNF, "#ffd65a", 2.0, T_CUT - 0.3, END - 1.6, { dur: 1.4, pulse: 4 });
const UNFT = tag("UNFINISHED RAILROAD", ...L(38.850, -77.575), T_CUT, "#7a6420", 7, END - 1.6);
const STR = tag("STONY RIDGE · HIDDEN IN THE WOODS", ...L(38.858, -77.62), T_CUT + 0.6, "#1f4fc4", 7, END - 1.6);
const GRV = town("GROVETON", "groveton", T_OLD - 0.4, { dx: 4, dy: 12, size: 7, until: END - 1.6 });
const OLD = tag("FIRST BULL RUN BATTLEFIELD · 1861", ...L(38.800, -77.505), T_OLD, "#5c564a", 7, END - 1.6);
const CV = town("CENTREVILLE", "centreville", T_MOVEDN, { dx: 0, dy: -11, size: 7, until: END - 1.6 });
// Pope's columns wander back and forth (dotted, question marks)
[["sig", 38.80, -77.52, 38.835, -77.45], ["mcd", 38.78, -77.59, 38.765, -77.50], ["ren", 38.79, -77.46, 38.83, -77.44]].forEach(([id, la, lo, la2, lo2], i) => {
  go(id, T_WAITED - 0.4 + i * 0.2, 2.0, L(la, lo)); go(id, T_BACK + i * 0.2, 2.0, L(la2, lo2)); });
[[38.775, -77.52], [38.81, -77.47], [38.77, -77.585]].forEach((q, i) => { const p = L(...q);
  const qm = GG.pin(`<div style="font-family:Oswald;font-weight:700;font-size:16px;color:#ff6b5e;text-shadow:0 0 6px #000,0 0 2px #000">?</div>`, p[0], p[1] - 14, { t: T_BACK - 0.2 + i * 0.25, pop: true, until: END - 1.6 }); SFX("ref:pop", T_BACK + i * 0.25); });
B.caption("POPE'S ARMY HUNTS FOR JACKSON", T_WAITED, END - 1.6, "carth r");
// lead-in to move2b: counters, labels and fills clear as the camera dives onto the battlefield
B.hideUnits(["ewl", "aph", "tal", "sig", "mcd", "bnk", "ren"], END - 1.7, 0.5);
tl.to([BS, MJ, SAL, TG2, GV, ...DEPS, ...TRS], { autoAlpha: 0, duration: 0.4 }, END - 1.7);
K.raiseTerritory();
B.finish();
