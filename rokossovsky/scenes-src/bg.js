// BG (bg-1 .. bg-2): Eastern Front overview, option 1. 22 June 1941: the invasion (Army Groups North / Centre / South), the
// Luftwaffe hits the 9th Mechanized Corps near Dubno, 316 -> 64 tanks; October 1941: Vyazma + Bryansk pockets, OVER HALF A
// MILLION ENCIRCLED, the road to Moscow, Rokossovsky's HQ escapes to the Volokolamsk highway. Control maps jun41 -> oct41.
// Built with: python3 tools/build_scene.py bg east_hd_ref bg-1 bg-2
const RIVERS = [[[2707,-531],[2681,-502],[2682,-467],[2686,-426],[2693,-389],[2694,-340],[2676,-275],[2746,-274],[2786,-300],[2814,-346],[2872,-371],[2891,-333],[2889,-299],[2898,-272],[2908,-240],[2926,-214],[2935,-171],[2926,-149],[2926,-130],[2899,-107],[2870,-71],[2866,-46],[2855,-22],[2870,13],[2883,59],[2889,85],[2899,102],[2919,108],[2939,87],[2977,83],[3001,76],[3001,76]],[[2971,945],[2972,979],[2940,989],[2896,972],[2861,961],[2835,944],[2798,940],[2770,948],[2742,955],[2717,960],[2695,963],[2682,965],[2666,971],[2652,978],[2639,994],[2631,1011],[2631,1027],[2632,1051],[2639,1073],[2648,1090],[2661,1109],[2667,1130],[2665,1146],[2656,1169],[2652,1178],[2651,1190],[2654,1208],[2652,1228],[2664,1246],[2665,1267],[2657,1277]],[[2615,-157],[2606,-139],[2593,-131],[2575,-156],[2567,-158],[2561,-147],[2557,-142],[2550,-134],[2545,-125],[2544,-105],[2548,-91],[2552,-82],[2554,-65],[2544,-60],[2535,-60],[2521,-73],[2514,-90],[2505,-102],[2509,-123],[2514,-129],[2525,-136],[2524,-152],[2523,-159],[2513,-172],[2496,-178],[2480,-191],[2462,-206],[2456,-215],[2418,-220],[2382,-219],[2380,-227],[2374,-245],[2360,-258],[2347,-279],[2328,-292],[2314,-320]],[[1345,1122],[1350,1107],[1388,1103],[1403,1107],[1418,1122],[1430,1132],[1446,1141],[1451,1149],[1460,1148],[1470,1156],[1477,1160],[1489,1163],[1498,1170],[1515,1172],[1519,1166],[1527,1169],[1542,1168],[1553,1167],[1582,1187],[1593,1194],[1601,1198],[1606,1204],[1622,1230],[1630,1251],[1630,1266],[1638,1266],[1640,1278],[1649,1287],[1654,1293],[1661,1301],[1672,1312],[1682,1318],[1681,1319]],[[1763,538],[1773,549],[1768,569],[1764,581],[1763,597],[1747,609],[1737,608],[1730,616],[1736,640],[1723,643],[1709,655],[1685,666],[1662,676],[1646,687],[1635,677],[1628,671],[1624,660],[1602,650],[1577,638],[1573,627],[1539,622],[1529,623],[1521,622],[1510,624],[1502,601],[1495,590],[1489,577],[1468,565],[1455,564],[1427,551],[1407,541],[1398,524]],[[1086,1202],[1102,1217],[1127,1222],[1158,1218],[1173,1220],[1170,1244],[1162,1264],[1166,1278],[1166,1287],[1162,1298],[1163,1328],[1159,1345],[1161,1352],[1166,1361],[1166,1369],[1172,1371],[1169,1382],[1192,1388],[1206,1389],[1216,1393],[1228,1409],[1242,1419],[1263,1421],[1276,1416],[1293,1425],[1307,1433],[1322,1424],[1339,1433],[1329,1436],[1327,1442],[1347,1462],[1343,1476],[1364,1476]],[[1165,1072],[1173,1068],[1176,1063],[1187,1066],[1203,1069],[1214,1064],[1229,1060],[1246,1050],[1256,1046],[1267,1044],[1271,1038],[1289,1027],[1296,1002],[1296,993],[1298,976],[1297,959],[1286,951],[1278,939],[1270,924],[1268,915],[1254,896],[1226,894],[1200,884],[1168,870],[1154,850],[1131,833],[1153,815],[1159,794],[1161,783],[1164,756],[1166,744]],[[2412,200],[2421,179],[2423,164],[2421,147],[2403,126],[2372,105],[2364,94],[2355,76],[2343,56],[2320,48],[2300,39],[2284,20],[2243,-12],[2242,-18],[2219,-27],[2216,-43],[2217,-50],[2209,-70],[2210,-77],[2201,-84],[2188,-94],[2198,-107],[2198,-111],[2203,-124],[2202,-133],[2209,-136],[2209,-140],[2175,-157],[2148,-178],[2148,-178]],[[2017,1721],[1981,1729],[1962,1737],[1944,1756],[1935,1765],[1921,1770],[1907,1779],[1892,1788],[1867,1781],[1859,1773],[1843,1766],[1823,1749],[1826,1736],[1826,1726],[1824,1718],[1831,1702],[1834,1696],[1847,1692],[1856,1685],[1874,1676],[1883,1670],[1890,1662],[1889,1658],[1870,1646],[1887,1643],[1894,1634],[1903,1634],[1916,1634],[1931,1631],[1934,1626],[1938,1615]],[[1823,700],[1809,695],[1796,699],[1785,712],[1778,718],[1759,710],[1723,718],[1699,727],[1690,729],[1681,749],[1684,759],[1688,779],[1682,792],[1683,811],[1684,824],[1682,839],[1671,848],[1671,856],[1674,866],[1676,870],[1680,880],[1684,888],[1694,899],[1697,911],[1702,920],[1705,928],[1700,934],[1697,944],[1692,953],[1694,958],[1696,965],[1693,979],[1691,980]],[[2746,115],[2746,106],[2740,103],[2731,98],[2728,104],[2724,96],[2713,92],[2708,91],[2704,93],[2697,90],[2664,96],[2657,100],[2653,97],[2643,98],[2638,99],[2627,106],[2615,107],[2615,100],[2613,91],[2609,82],[2598,83],[2590,76],[2598,65],[2594,59],[2577,61],[2564,70],[2553,76],[2539,69],[2536,66],[2526,74],[2520,78],[2510,85],[2507,89],[2498,106],[2483,126],[2472,130],[2462,141],[2437,145],[2423,149],[2423,149]],[[1105,1086],[1121,1092],[1133,1079],[1133,1065],[1134,1054],[1134,1050],[1123,1036],[1121,1028],[1116,1014],[1105,1009],[1098,1004],[1088,993],[1081,989],[1069,977],[1055,979],[1052,971],[1053,958],[1047,950],[1033,946],[1026,943],[1020,939],[1021,929],[1017,924],[1003,919],[980,919],[972,907],[968,888],[958,869],[948,856],[958,837],[960,828],[965,819],[968,805],[967,803]],[[2747,428],[2744,415],[2743,410],[2737,401],[2738,395],[2732,385],[2729,378],[2724,365],[2725,352],[2722,348],[2718,343],[2711,326],[2710,320],[2703,310],[2698,306],[2697,298],[2700,293],[2709,287],[2711,278],[2713,276],[2725,268],[2736,260],[2747,255],[2754,250],[2761,238],[2778,242],[2810,252],[2818,248],[2838,225],[2858,234],[2859,243],[2858,251],[2864,259],[2865,266],[2868,276],[2868,276]],[[2322,842],[2333,851],[2322,869],[2314,877],[2306,878],[2284,891],[2275,905],[2273,922],[2280,928],[2277,940],[2268,946],[2257,957],[2246,952],[2239,966],[2230,977],[2215,972],[2203,976],[2198,988],[2204,996],[2208,1008],[2209,1014],[2210,1028],[2211,1034],[2211,1041],[2213,1047],[2232,1059],[2230,1074],[2239,1079],[2234,1089],[2229,1096],[2229,1096]],[[2285,1102],[2273,1111],[2261,1112],[2252,1105],[2250,1099],[2237,1097],[2210,1096],[2201,1094],[2184,1098],[2180,1088],[2166,1081],[2158,1070],[2151,1066],[2144,1056],[2136,1061],[2123,1060],[2123,1044],[2124,1034],[2120,1023],[2112,1013],[2114,999],[2090,998],[2084,993],[2090,986],[2086,974],[2082,970],[2078,962],[2079,956],[2079,944],[2083,926],[2082,922]],[[1985,997],[1974,1011],[1969,1026],[1978,1041],[1980,1050],[1981,1067],[1981,1081],[1968,1082],[1962,1089],[1956,1095],[1965,1102],[1975,1107],[1983,1109],[1992,1114],[1992,1117],[1984,1122],[1989,1125],[1998,1126],[2004,1129],[2009,1134],[2016,1136],[2015,1140],[2023,1144],[2032,1144],[2043,1141],[2044,1136],[2063,1154],[2075,1156],[2080,1162],[2088,1158],[2092,1154],[2095,1160],[2102,1166],[2117,1168],[2116,1172],[2120,1181],[2120,1181]],[[2129,732],[2136,739],[2142,743],[2148,738],[2158,746],[2163,745],[2164,739],[2171,728],[2170,724],[2170,720],[2170,716],[2169,710],[2174,705],[2181,697],[2186,698],[2197,710],[2205,711],[2208,714],[2208,707],[2204,697],[2206,678],[2212,671],[2214,666],[2220,657],[2218,650],[2220,644],[2222,636],[2232,630],[2249,615],[2264,605],[2267,599],[2280,595],[2293,596],[2304,585],[2304,585]],[[2218,1516],[2218,1502],[2220,1492],[2211,1486],[2211,1480],[2217,1452],[2212,1443],[2212,1430],[2206,1419],[2184,1412],[2174,1398],[2170,1392],[2170,1385],[2168,1378],[2157,1377],[2150,1378],[2146,1380],[2139,1382],[2131,1382],[2121,1386],[2116,1391],[2103,1393],[2093,1403],[2084,1406],[2077,1406],[2073,1402],[2069,1406],[2055,1399],[2045,1394],[2039,1396],[2030,1396],[2022,1395],[2004,1390],[2004,1385]],[[2115,312],[2132,317],[2135,328],[2136,332],[2152,330],[2156,324],[2169,322],[2193,321],[2207,316],[2212,307],[2231,299],[2244,282],[2248,274],[2258,271],[2266,265],[2284,256],[2303,246],[2308,240],[2312,235],[2318,230],[2325,226],[2341,223],[2376,213],[2385,205],[2394,205],[2399,204],[2402,204],[2411,200],[2412,200]],[[518,1239],[516,1228],[511,1216],[508,1209],[500,1197],[490,1188],[475,1170],[470,1168],[462,1172],[458,1174],[448,1177],[431,1179],[428,1176],[424,1170],[416,1166],[413,1152],[407,1144],[401,1146],[398,1138],[386,1139],[379,1132],[371,1131],[364,1124],[359,1122],[349,1117],[350,1108],[344,1104],[341,1110],[338,1102],[328,1105],[325,1103]],[[2381,1052],[2370,1063],[2367,1076],[2367,1082],[2360,1094],[2354,1106],[2351,1116],[2350,1123],[2343,1137],[2334,1154],[2326,1166],[2332,1170],[2339,1173],[2359,1175],[2369,1179],[2373,1174],[2384,1181],[2392,1184],[2396,1188],[2404,1195],[2402,1207],[2408,1214],[2413,1221],[2421,1224],[2424,1230],[2433,1242],[2446,1251],[2447,1260],[2460,1272],[2468,1275],[2468,1283],[2475,1283],[2480,1291],[2480,1291]],[[1422,1186],[1421,1178],[1436,1166],[1443,1173],[1465,1176],[1478,1181],[1494,1190],[1517,1188],[1527,1193],[1530,1196],[1536,1203],[1540,1208],[1542,1216],[1545,1223],[1552,1236],[1554,1241],[1557,1246],[1565,1255],[1568,1264],[1577,1271],[1583,1283],[1588,1302],[1588,1312],[1586,1319],[1582,1325],[1582,1336],[1583,1347],[1585,1364],[1585,1371],[1587,1376]],[[803,1033],[788,1035],[774,1018],[771,1010],[757,1006],[762,997],[768,995],[770,992],[774,990],[771,988],[766,985],[758,978],[756,974],[749,969],[742,964],[740,958],[738,950],[733,949],[731,942],[733,934],[734,928],[731,919],[725,911],[706,905],[712,893],[717,887],[718,879],[721,871],[722,864],[722,859],[721,854],[713,848],[705,843],[695,834],[690,821],[690,821]],[[1364,1476],[1379,1479],[1386,1480],[1412,1483],[1418,1481],[1439,1484],[1452,1487],[1457,1490],[1462,1490],[1466,1489],[1469,1488],[1471,1486],[1477,1484],[1480,1481],[1483,1477],[1490,1470],[1497,1467],[1516,1463],[1518,1462],[1522,1461],[1533,1457],[1542,1461],[1552,1460],[1554,1459],[1558,1456],[1565,1455],[1574,1452],[1580,1443],[1582,1440],[1582,1437],[1579,1436],[1578,1434],[1578,1431],[1579,1428],[1576,1425],[1573,1424],[1572,1420],[1570,1419],[1569,1417],[1571,1414],[1572,1410],[1572,1404],[1574,1400],[1575,1396],[1574,1391],[1578,1383],[1579,1379],[1581,1377],[1585,1378],[1586,1376],[1589,1376],[1591,1382],[1594,1385],[1604,1389],[1611,1390],[1611,1390]]];  // main rivers (map px) for the shimmer, from assets/media/east_rivers.json
// ---------- EAST overview kit (same block in hook-b / bg / ending; basemap east_hd_ref, z6 origin 7889,4489) ----------
// Option 1 look (STYLE_LOCK 2 + 2a): multiply territory overlays per date (tools/make_east_control.py), emblem fixed on Germany,
// geography layer above the territory (tools/make_east_geo.py), living map, period flags USSR + Reich, legend top-centre.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(6, 7889, 4489);
const FL = { su: "assets/media/ussr_flag.png", de: "assets/media/ger_reich_flag.png" };
// control overlay for a date, cross-faded (1 s) in at t and out at until
const ctl = (state, t, until) => { const el = B.image(`assets/media/east_ctl_${state}_mx.png`, 0, 0, 2880, 1620, { t, dur: t > 0 ? 1.0 : 0.6, until }); el.style.mixBlendMode = "multiply"; return el; };
const EMBLEM = G(51.0, 10.6);  // centred on Germany, 300 px: clear of the sea and of the BERLIN / PRAGUE labels
const geo = () => B.image("assets/media/east_geo_ref.png", 0, 0, 2880, 1620, { t: 0, dur: 0.6 });
const emblem = () => B.image("assets/media/emblem_ger.png", EMBLEM[0] - 150, EMBLEM[1] - 150, 300, 300, { t: 0, dur: 0.6, opacity: 0.8 });
const living = () => { const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.22 }); LV.shimmer(RIVERS, { width: 2 }); LV.scaleBar(1454.93); LV.north(); return LV; };
// small white-box story label (Frontlines look) with a dry pop
const box = (txt, x, y, t, size = 16, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${Math.round(size * 0.2)}px ${Math.round(size * 0.35)}px ${Math.round(size * 0.2)}px ${Math.round(size * 0.6)}px;font-size:${size}px;box-shadow:0 2px 8px rgba(0,0,0,.6);white-space:nowrap">${txt}</div>`, x, y, { t, until }); };
// period flag with the nation's name under it (world px; w ~ 115 px on screen)
const flag = (src, name, x, y, t, until, w = 120) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${Math.round(w * 0.05)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(1, Math.round(w / 60))}px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${Math.round(w * 0.2)}px;color:#f7f3ea;text-shadow:0 2px 4px #000;letter-spacing:0.08em">${name}</div></div>`, x, y, { t, pop: true, until });
const neutral = (name, x, y, t, until, size = 18) => GG.pin(`<div class="gg-lbl" style="position:relative;text-align:center;font-size:${size}px;line-height:1.1;color:#e9e6dc">${name}<br><span style="font-size:${Math.round(size * 0.65)}px;letter-spacing:.32em;color:#c9c4b4">NEUTRAL</span></div>`, x, y, { t, until });
const legend = (t, until) => {
  const sw = (c) => `<b style="display:inline-block;width:20px;height:20px;background:${c};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>`;
  const el = GG.card(`<div style="display:flex;gap:26px;font-size:21px;letter-spacing:0.08em;align-items:center"><span>${sw("#2e5cb2")}SOVIET UNION</span><span>${sw("#8c0c14")}GERMANY &amp; ALLIES</span><span>${sw("#6d766c")}NEUTRAL</span></div>`, "", 34, t, until);
  el.querySelector(".inner").style.cssText += "padding:12px 30px 14px;border-top-color:#9fc0ea;"; return el;
};
// unit counter with its flag chip (FLAGS in lib/fx.js has no USSR key: patch the chip's src)
const counter = (id, icon, side, size) => { K.counter(id, { icon, flag: "ger", size }); if (side === "carth") B.units[id].el.querySelector(".fxk-flag").src = FL.su; };
// commander badge on the USSR flag (TODO: use assets/media/rokossovsky_head.png once the photo agent has a licensed cut-out)
const badge = (o) => { const el = K.badge(Object.assign({ side: "carth", initials: "KR" }, o)); el.querySelector('div[style*="border-radius:50%"]').style.backgroundImage = `url(${FL.su})`; return el; };
// point a fraction f along a polyline (to drop each bomb right under the plane)
const along = (pts, f) => { const seg = []; let L = 0; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); L += d; }
  let d = f * L; for (let j = 0; j < seg.length; j++) { if (d <= seg[j] || j === seg.length - 1) { const k = Math.min(1, d / seg[j]); return [pts[j][0] + (pts[j + 1][0] - pts[j][0]) * k, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * k]; } d -= seg[j]; } };
// locked bombing run with the glowing C-47 symbol (red = Luftwaffe): K.bombRun drops at t+1.55+k*0.25, so the bombs sit there on the path
const raid = (pts, t, n = 3, dur = 3.4) => K.bombRun({ kind: "c47g", side: "rome", size: 30, alt: 9, pts, t, dur, bombs: [...Array(n)].map((_, k) => along(pts, (1.55 + k * 0.25) / dur)) });
const PLACE = { moscow: G(55.756, 37.617), kursk: G(51.73, 36.19), bobruisk: G(53.14, 29.22), dubno: G(50.42, 25.74), vyazma: G(55.21, 34.3), bryansk: G(53.25, 34.37),
  volok: G(56.03, 35.95), warsaw: G(52.23, 21.01) };
const B1 = "bg-1", B2 = "bg-2", S2 = PS(B2);
const T_INV = at(B1, "Germany invaded"), T_LED = at(B1, "Rokossovsky led"), T_DUB = at(B1, "near Dubno"), T_TWO = at(B1, "Within two weeks"),
  T_64 = at(B1, "sixty-four"), T_LEARN = at(B1, "But he had learned"), T_AMB = at(B1, "It had to be ambushed");
const T_DRIVE = at(B2, "driving on Moscow"), T_ENC = at(B2, "double encirclement"), T_HALF = at(B2, "more than half a million"),
  T_ROAD = at(B2, "The road to the capital"), T_HQ = at(B2, "headquarters escaped"), T_SCRATCH = at(B2, "scratch force"), T_JOB = at(B2, "hold the Volokolamsk highway");
ctl("jun41", 0, S2 + 0.2); ctl("oct41", S2 + 0.2);
living(); emblem(); geo();
B.camera([[0, 1560, 860, 0.9], [T_INV + 2.6, 1545, 865, 0.95], [T_LED + 0.2, 1482, 1022, 2.1], [T_TWO, 1478, 1028, 2.3], [T_LEARN, 1488, 1020, 2.2],
  [S2 - 0.2, 1490, 1018, 2.2], [S2 + 1.6, 1830, 742, 1.55], [T_ROAD, 1870, 722, 1.6], [T_HQ + 0.4, 1900, 680, 1.95], [END, 1918, 655, 2.25]]);
SFX("ref:whoosh", T_LED - 0.2); SFX("ref:whoosh", S2 - 0.1);
B.showDate(0.2); B.date("22 JUNE 1941", 0.4, S2 + 0.2, 34); B.date("OCTOBER 1941", S2 + 0.3, null, 34);
legend(0.4, END + 1);
// flags: wide shot, Dubno close-up, Moscow approaches (each pair sized for its camera)
flag(FL.de, "GERMANY", ...G(53.4, 17.0), 0.5, T_LED + 0.3); flag(FL.su, "USSR", ...G(55.0, 45.0), 0.7, T_LED + 0.3);
neutral("SWEDEN", ...G(56.35, 14.1), 0.9, T_LED + 0.3);
GG.lbl("FINLAND", ...G(61.6, 26.4), { size: 18, color: "#f0c8c0", t: T_INV + 0.6, until: T_LED + 0.3 });
GG.lbl("ROMANIA", ...G(45.6, 24.6), { size: 18, color: "#f0c8c0", t: T_INV + 0.8, until: T_LED + 0.3 });
GG.lbl("HUNGARY", ...G(47.0, 19.6), { size: 18, color: "#f0c8c0", t: T_INV + 1.0, until: T_LED + 0.3 });
flag(FL.de, "GERMANY", ...G(51.25, 23.3), T_LED + 0.6, S2 + 0.4, 52); flag(FL.su, "USSR", ...G(51.15, 27.5), T_LED + 0.8, S2 + 0.4, 52);
flag(FL.de, "GERMANY", ...G(55.25, 31.0), S2 + 1.2, END + 1, 62); flag(FL.su, "USSR", ...G(55.0, 39.2), S2 + 1.4, END + 1, 62);
// ---------- 22 June 1941: the border, the dawn barrage, three army groups ----------
const RED0 = [[54.45, 21.9, "tank"], [53.0, 21.9, "infantry"], [52.15, 22.9, "tank"], [51.2, 23.2, "infantry"], [50.35, 23.5, "tank"], [49.6, 22.3, "infantry"]];
const BLUE0 = [[55.1, 23.6], [53.4, 23.9], [52.0, 24.4], [50.9, 24.6], [49.9, 24.9]];
RED0.forEach(([la, lo, ic], i) => { const [x, y] = G(la, lo); B.unit({ id: "r" + i, side: "rome", x, y, w: 38, h: 26, t: 0.15 + i * 0.08 }); counter("r" + i, ic, "rome", "XX"); });
BLUE0.forEach(([la, lo], i) => { const [x, y] = G(la, lo); B.unit({ id: "b" + i, side: "carth", x, y, w: 38, h: 26, t: 0.25 + i * 0.08 }); counter("b" + i, "infantry", "carth", "XX"); });
BLUE0.forEach(([la, lo], i) => { const [x, y] = G(la, lo); K.impact(x + 6, y - 4, T_INV - 0.5 + i * 0.32, { r: 14 }); });
SFX("ref:boom", T_INV);
const AG = [
  { pts: [G(54.6, 21.6), G(55.6, 24.3), G(57.3, 27.6), G(59.2, 29.6)], tag: "ARMY GROUP NORTH", at: G(55.15, 21.3) },
  { pts: [G(52.4, 23.3), G(53.6, 26.6), G(54.4, 29.6), G(54.75, 31.6)], tag: "ARMY GROUP CENTRE", at: G(52.75, 22.0) },
  { pts: [G(50.6, 23.6), G(50.5, 26.4), G(50.4, 29.4)], tag: "ARMY GROUP SOUTH", at: G(49.9, 22.3) },
];
AG.forEach((a, i) => { B.arrow({ side: "rome", pts: a.pts, width: 24, t: T_INV + 0.15 + i * 0.4, dur: 1.7, until: T_LED + 0.4 });
  GG.tagbox(a.tag, a.at[0], a.at[1], "#c4121f", { size: 17, t: T_INV + 0.7 + i * 0.4, until: T_LED + 0.4 }); });
RED0.forEach((r, i) => B.move("r" + i, T_INV + 0.6, 2.4, B.units["r" + i].x + 70, B.units["r" + i].y + (i < 2 ? -20 : 0)));
B.grey(["b0", "b1", "b2", "b3", "b4"], T_INV + 1.4, 0.8); B.hideUnits(["r0", "r1", "r2", "r3", "r4", "r5", "b0", "b1", "b2", "b3", "b4"], T_LED - 0.1, 0.5);
// ---------- Dubno: the 9th Mechanized Corps counter-attacks into the panzers, the Luftwaffe hammers it ----------
const DUB = PLACE.dubno;
badge({ name: "ROKOSSOVSKY", role: "9TH MECHANIZED CORPS", corner: "bl", t: T_LED + 0.3, until: T_LEARN - 0.2 });
box("DUBNO", DUB[0] - 4, DUB[1] + 22, T_DUB - 0.2, 12);
const PZ = [G(50.66, 25.05), G(50.27, 25.25)];
PZ.forEach(([x, y], i) => { B.unit({ id: "pz" + i, side: "rome", x, y, w: 40, h: 26, label: "PANZERS", t: T_LED + 0.4 + i * 0.15 }); counter("pz" + i, "tank", "rome", "XX"); });
const M9 = G(50.72, 26.75), M9b = G(50.52, 26.0);
B.unit({ id: "m9", side: "carth", x: M9[0], y: M9[1], w: 46, h: 30, label: "9 MECH CORPS", t: T_LED + 0.5 }); counter("m9", "tank", "carth", "XXX");
B.move("m9", T_DUB, 3.2, M9b[0], M9b[1]);
B.arrow({ side: "carth", pts: [G(50.74, 26.85), G(50.62, 26.35), G(50.5, 25.95)], width: 12, t: T_DUB - 0.1, dur: 1.4, until: T_LEARN });
raid([[M9b[0] - 230, M9b[1] - 260], [M9b[0] + 40, M9b[1] + 30], [M9b[0] + 300, M9b[1] + 320]], T_DUB + 0.6);
raid([[M9b[0] + 340, M9b[1] - 230], [M9b[0] - 10, M9b[1] + 6], [M9b[0] - 330, M9b[1] + 250]], T_64 - 1.9);
[0, 1, 2, 3].forEach((k) => K.impact(M9b[0] - 16 + k * 11, M9b[1] + (k % 2 ? 10 : -8), T_64 - 1.2 + k * 0.35, { r: 12 }));   // German guns finish the job
// tank count: 316 -> 64 (ticks)
const cnt = GG.card(`<div style="display:flex;align-items:center;gap:22px"><img src="${FL.su}" style="height:46px;border:1px solid #f7f3ea"><div><div style="font-size:20px;letter-spacing:0.3em;color:#c9d6ff">9TH MECHANIZED CORPS · TANKS</div><div class="n" style="font-size:84px;font-weight:700;line-height:1;color:#6f9bff">316</div></div></div>`, "", 150, T_TWO - 0.3, T_LEARN + 0.4);
cnt.querySelector(".inner").style.padding = "16px 44px 18px"; cnt.querySelector(".inner").style.borderTopColor = "#6f9bff";
const nEl = cnt.querySelector(".n"), num = { v: 316 }, CD = Math.max(1.2, T_64 - T_TWO - 0.4);
B.tl.to(num, { v: 64, duration: CD, ease: "power1.in", onUpdate: () => { nEl.textContent = Math.round(num.v); } }, T_TWO + 0.4);
B.tl.to(nEl, { color: "#e3232f", duration: 0.3 }, T_TWO + 0.4 + CD);
for (let k = 0; k <= 9; k++) SFX("tick", T_TWO + 0.4 + (CD * k) / 9);
SFX("hit", T_TWO + 0.45 + CD);
B.tl.to(B.units.m9.el, { opacity: 0.55, duration: 0.6 }, T_TWO + 0.4 + CD);
// the lesson: head-on, the corps is ground down; ambushed, the panzers bleed
B.move("pz0", T_LEARN + 0.3, 2.0, M9b[0] - 26, M9b[1] - 12); B.move("pz1", T_LEARN + 0.5, 2.0, M9b[0] - 22, M9b[1] + 16);
[0, 1, 2].forEach((k) => K.impact(M9b[0] + 4 - k * 9, M9b[1] + (k - 1) * 9, T_LEARN + 1.9 + k * 0.4, { r: 12 }));
B.grey(["m9"], T_LEARN + 2.2, 0.8); B.hideUnits(["m9"], T_AMB - 0.6, 0.5);
const AMB = [G(50.82, 26.0), G(50.28, 26.05)];
AMB.forEach(([x, y], i) => { B.unit({ id: "at" + i, side: "carth", x, y, w: 30, h: 20, t: T_AMB - 0.3 + i * 0.2 }); counter("at" + i, "artillery", "carth", "III"); });
for (let k = 0; k < 6; k++) {
  const [gx, gy] = AMB[k % 2], tg = [M9b[0] - 24 + (k % 3) * 8, M9b[1] - 10 + (k % 2) * 24], t = T_AMB + 0.6 + k * 0.7;
  K.gun(gx, gy, t, { unit: "at" + (k % 2), dx: 0, dy: -8 }); GG.arc(gx, gy - 6, tg[0], tg[1], t + 0.05, { dur: 0.6, width: 2, h: 30, impact: false });
  K.impact(tg[0], tg[1], t + 0.65, { r: 12 });
}
B.tl.to([B.units.pz0.el, B.units.pz1.el], { opacity: 0.6, duration: 0.8 }, T_AMB + 4.0);
B.caption("ARMOUR CAN'T BE STOPPED HEAD-ON", T_LEARN + 0.2, T_AMB - 0.2, "carth");
B.caption("AMBUSH IT · WEAR IT DOWN · MAKE IT BLEED", T_AMB, S2 - 0.1, "carth");
B.hideUnits(["pz0", "pz1", "at0", "at1"], S2 - 0.3, 0.5);
// ---------- October 1941: Typhoon, the Vyazma + Bryansk pockets ----------
const POCK = [[55.1, 33.8, "vy"], [53.62, 34.25, "bn"], [52.6, 33.35, "bs"]];
POCK.forEach(([la, lo, id], i) => { const [x, y] = G(la, lo); B.unit({ id, side: "carth", x, y, w: 30, h: 20, t: S2 + 0.9 + i * 0.12 }); counter(id, "infantry", "carth", "XXXX"); });
[[G(55.75, 32.0), G(55.55, 33.4), G(55.3, 34.2)], [G(54.1, 32.7), G(54.6, 33.7), G(55.05, 34.35)],
 [G(51.75, 33.9), G(52.5, 34.6), G(53.15, 34.5)], [G(53.95, 32.6), G(53.55, 33.7), G(53.32, 34.25)]]
  .forEach((pts, i) => B.arrow({ side: "rome", pts, width: 16, t: T_DRIVE + 0.1 + i * 0.3, dur: 1.4, until: T_ROAD + 0.6 }));
SFX("ref:boom", T_ENC);
box("VYAZMA", PLACE.vyazma[0] + 50, PLACE.vyazma[1] - 26, T_ENC + 0.1, 13, END + 1);
box("BRYANSK", PLACE.bryansk[0] + 58, PLACE.bryansk[1] - 2, T_ENC + 0.3, 13, END + 1);
POCK.forEach(([la, lo], i) => { const [x, y] = G(la, lo); K.target(x, y, T_ENC + 0.2 + i * 0.25, { r: i ? 50 : 66, side: "rome", until: T_HQ + 0.5 }); SFX("hit", T_ENC + 0.2 + i * 0.25); });
B.grey(["vy", "bn", "bs"], T_HALF, 0.8);
const STAMP = GG.stamp("OVER HALF A MILLION ENCIRCLED", T_HALF + 0.1, T_ROAD + 1.0, { size: 54 });
// the road to Moscow lies open
box("MOSCOW", PLACE.moscow[0] + 66, PLACE.moscow[1] + 2, T_ROAD - 0.2, 14, END + 1);
B.arrow({ side: "rome", pts: [G(55.25, 34.7), G(55.45, 35.8), G(55.62, 36.95)], width: 18, t: T_ROAD, dur: 1.6, until: END + 1 });
B.arrow({ side: "rome", pts: [G(53.1, 36.25), G(53.75, 37.0), G(54.05, 37.45)], width: 16, t: T_ROAD + 0.4, dur: 1.4, until: END + 1 });
SFX("ref:whoosh", T_ROAD);
B.caption("THE ROAD TO MOSCOW: ALMOST EMPTY", T_ROAD + 0.3, T_HQ - 0.1, "rome");
// Rokossovsky's HQ slips out and takes the Volokolamsk highway
const HQ0 = G(55.15, 34.55), VOL = PLACE.volok;
B.unit({ id: "hq", side: "carth", x: HQ0[0], y: HQ0[1], w: 30, h: 20, label: "ROKOSSOVSKY HQ", t: T_HQ }); counter("hq", null, "carth");
GG.icon("hq", "hq");
B.move("hq", T_HQ + 0.6, 3.0, VOL[0] + 8, VOL[1] + 14);
GG.road([VOL, G(55.97, 36.45), G(55.87, 36.95), G(55.8, 37.35), PLACE.moscow], { w: 4, t: T_SCRATCH - 0.2 });
box("VOLOKOLAMSK", VOL[0] - 70, VOL[1] - 22, T_SCRATCH, 12, END + 1);
[[56.12, 35.75], [55.93, 35.85], [56.05, 36.2]].forEach(([la, lo], i) => { const [x, y] = G(la, lo); B.unit({ id: "s" + i, side: "carth", x, y, w: 22, h: 15, t: T_SCRATCH + 0.4 + i * 0.25 }); counter("s" + i, i === 1 ? "tank" : "infantry", "carth"); });
K.target(VOL[0], VOL[1], T_JOB, { r: 34, side: "carth", until: END + 1 }); SFX("hit", T_JOB + 0.1);
B.caption("ONE JOB: HOLD THE VOLOKOLAMSK HIGHWAY", T_JOB - 0.1, END + 1, "carth");
K.raiseTerritory();
B.finish();
