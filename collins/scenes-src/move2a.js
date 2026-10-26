// MOVE 2a (move2-1), Collins #9: Operation Cobra, July 1944. Basemap normandy_hd_ref (z10, HD relief, dark Frontlines grade).
// Built with: python3 tools/build_scene.py move2a normandy_hd_ref move2-1 move2-1
// move2-1 WIDE, option 1 (24 July control, assets/media/nor_ctl_jul24_mx.png): title card MOVE 2 · OPERATION COBRA · JULY 1944;
//   the Allied lodgement (US west of Caumont, British/Canadian to Caen), the front almost static; the date ticks JUNE -> 24 JULY;
//   artillery duels along the line; the bocage texture (nor_bocage.png) spreads over the American sector; EVERY FIELD A FORTRESS,
//   STALEMATE stamp; the camera ends pushed in on the Cobra sector at exactly the framing move2b (cobra_hd_ref, z12) opens on.
// Fronts per date: research/FACT_NOTES_cobra.md (tools/make_nor_control.py). Americans = blue (carth), Germans = red (rome).
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const L = GG.proj(10, 128794, 88848);
const US = "assets/media/us_flag_48star.png", UK = "assets/media/uk_flag.png", REICH = "assets/media/ger_reich_flag.png";
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const RIVERS = /*@nor_rivers*/[[[2607,738],[2605,735],[2603,732],[2600,729],[2598,726],[2596,723],[2594,720],[2592,717],[2589,714],[2586,711],[2585,708],[2585,705],[2585,702],[2585,699],[2585,696],[2584,693],[2583,690],[2580,687],[2577,687],[2574,684],[2574,681],[2574,678],[2571,677],[2568,678],[2565,679],[2562,680],[2559,681],[2556,682],[2553,682],[2550,682],[2547,683],[2544,685],[2541,686],[2540,687]],[[1377,802],[1380,804],[1383,802],[1386,802],[1389,804],[1392,805],[1394,807]],[[2360,814],[2359,811],[2357,808],[2354,805],[2351,802],[2348,799],[2347,796],[2344,793],[2341,790],[2340,787],[2339,784],[2340,781],[2338,778],[2337,775],[2336,773],[2333,770],[2330,769],[2328,769]],[[1485,825],[1482,823],[1479,820],[1478,817],[1475,815],[1472,813],[1469,815],[1469,815]],[[2101,879],[2104,880],[2107,882],[2110,881],[2110,881]],[[2111,880],[2113,877],[2115,874],[2113,871],[2112,868],[2112,867]],[[1459,881],[1461,878],[1463,875],[1464,872],[1464,869],[1464,869]],[[2156,939],[2155,936],[2154,933],[2154,930],[2153,927],[2153,924],[2153,921],[2155,918],[2157,915],[2158,912],[2160,909],[2163,906],[2165,903],[2167,900],[2169,897],[2169,894],[2169,891],[2168,888],[2165,885],[2162,882],[2159,879],[2157,876],[2154,873],[2152,870],[2149,867],[2146,864],[2145,861],[2145,858],[2145,858]],[[2050,945],[2051,942],[2053,939],[2053,936],[2055,933],[2058,931],[2061,929],[2064,929],[2067,928],[2070,925],[2073,925],[2074,922],[2076,919],[2079,916],[2082,913],[2082,910],[2082,907],[2084,904],[2086,903],[2089,901],[2092,898],[2093,895],[2096,892],[2096,889],[2098,886],[2098,885]],[[2441,1021],[2439,1018],[2439,1015],[2439,1012],[2441,1009],[2439,1006],[2438,1003],[2439,1000],[2439,997],[2438,994],[2436,992],[2435,989],[2435,986],[2435,983],[2435,980],[2435,977],[2435,974],[2436,971],[2434,968],[2436,965],[2438,962],[2438,959],[2438,956],[2439,953],[2438,950],[2438,947],[2438,944],[2437,941],[2438,938],[2435,935],[2436,932],[2437,929],[2436,926],[2436,923],[2437,920],[2435,917],[2434,914],[2433,911],[2433,908],[2433,905],[2434,902],[2433,899],[2432,896],[2432,893],[2433,890],[2433,887],[2434,884],[2434,881],[2431,878],[2428,877],[2426,875],[2423,872],[2420,869],[2417,867],[2414,864],[2411,861],[2408,861],[2405,860],[2402,861],[2400,859],[2400,856],[2398,854],[2396,851],[2393,851],[2390,848],[2387,849],[2384,847],[2382,844],[2380,841],[2377,838],[2376,835],[2374,832],[2371,829],[2369,826],[2366,823],[2363,820],[2361,817],[2360,815]],[[2837,1084],[2834,1081],[2832,1078],[2830,1075],[2828,1072],[2825,1072],[2826,1069],[2825,1066],[2824,1063],[2822,1060],[2819,1058],[2816,1057],[2815,1054],[2812,1052],[2809,1050],[2807,1047],[2806,1044],[2808,1041],[2810,1038],[2809,1035],[2808,1032],[2809,1029],[2808,1026],[2806,1024],[2803,1022],[2803,1019],[2803,1016],[2805,1013],[2806,1010],[2807,1007],[2807,1005],[2806,1002],[2806,999],[2804,996],[2803,993],[2803,990],[2803,987],[2801,984],[2800,982],[2800,979],[2800,976],[2800,973],[2801,970],[2801,967],[2800,964],[2800,961],[2801,958],[2802,955],[2801,952],[2799,949],[2797,946],[2797,943],[2796,940],[2793,937],[2790,935],[2787,934],[2786,931],[2787,928],[2790,925],[2789,922],[2788,919],[2789,916],[2788,913],[2785,911],[2783,909],[2781,907],[2780,904],[2780,901],[2777,900],[2776,897],[2775,895],[2775,892],[2775,889],[2775,886],[2772,883],[2771,880],[2769,877],[2766,875],[2765,872],[2763,869],[2761,867],[2760,864],[2759,861],[2757,859],[2757,856],[2754,853],[2753,851],[2752,848],[2752,845],[2749,844],[2747,842],[2746,839],[2743,836],[2740,834],[2737,834],[2734,832],[2731,829],[2729,827],[2727,824],[2724,821],[2721,820],[2719,818],[2717,815],[2716,812],[2713,809],[2710,807],[2707,807],[2704,808],[2701,806],[2698,804],[2695,803],[2692,802],[2689,800],[2686,798],[2684,795],[2684,792],[2683,790],[2680,789],[2677,789],[2674,787],[2671,787],[2668,787],[2665,786],[2662,785],[2659,784],[2656,784],[2653,786],[2650,787],[2647,785],[2645,784],[2643,783],[2640,781],[2637,778],[2634,775],[2631,773],[2628,772],[2625,770],[2622,767],[2619,765],[2616,763],[2614,760],[2611,757],[2610,754],[2613,751],[2614,748],[2613,745],[2612,744]],[[2260,1122],[2260,1119],[2259,1116],[2258,1113],[2256,1110],[2255,1107],[2252,1104],[2249,1101],[2246,1101],[2246,1098],[2245,1095],[2242,1095],[2241,1092],[2238,1089],[2235,1086],[2233,1083],[2231,1080],[2229,1077],[2228,1074],[2230,1071],[2233,1068],[2236,1065],[2238,1062],[2239,1059],[2238,1056],[2237,1053],[2238,1050],[2241,1049],[2244,1046],[2245,1043],[2242,1040],[2240,1038],[2242,1035],[2243,1033],[2240,1030],[2238,1027],[2236,1024],[2236,1021],[2234,1018],[2233,1015],[2235,1012],[2234,1009],[2231,1007],[2228,1004],[2225,1004],[2222,1003],[2219,1002],[2216,1001],[2213,999],[2210,996],[2207,993],[2204,990],[2201,987],[2198,984],[2195,981],[2192,979],[2189,978],[2186,979],[2183,979],[2180,976],[2177,976],[2174,975],[2171,975],[2168,975],[2165,977],[2162,980],[2159,981],[2156,983],[2153,983],[2151,980],[2151,977],[2152,974],[2153,971],[2153,968],[2153,965],[2154,962],[2155,959],[2157,956],[2159,953],[2159,950],[2158,947],[2156,944],[2156,944]],[[1156,1137],[1155,1139],[1152,1139],[1149,1139],[1146,1142],[1145,1143]],[[1173,1148],[1171,1145],[1168,1144],[1165,1141],[1162,1139],[1159,1137],[1158,1137]],[[1184,1158],[1181,1156],[1179,1153],[1177,1151],[1174,1149],[1174,1149]],[[1525,1246],[1526,1243],[1526,1240],[1526,1237],[1526,1234],[1524,1231],[1523,1228],[1521,1225],[1518,1222],[1515,1220],[1512,1222],[1509,1222],[1508,1219],[1506,1216],[1507,1213],[1507,1210],[1508,1207],[1509,1204],[1508,1201],[1506,1198],[1505,1195],[1503,1192],[1503,1189],[1502,1186],[1502,1183],[1503,1180],[1503,1177],[1504,1174],[1505,1171],[1507,1168],[1509,1165],[1512,1164],[1515,1162],[1517,1159],[1518,1156],[1519,1153],[1518,1150],[1515,1150],[1512,1151],[1509,1152],[1508,1149],[1509,1146],[1511,1143],[1513,1140],[1515,1137],[1517,1134],[1518,1131],[1519,1128],[1516,1125],[1514,1122],[1511,1119],[1509,1116],[1507,1113],[1505,1110],[1504,1107],[1503,1104],[1500,1101],[1497,1098],[1494,1095],[1491,1092],[1488,1089],[1485,1086],[1482,1084],[1479,1082],[1476,1081],[1473,1080],[1470,1080],[1467,1079],[1464,1076],[1461,1073],[1459,1070],[1458,1067],[1458,1064],[1459,1061],[1462,1058],[1465,1055],[1468,1055],[1471,1054],[1474,1051],[1476,1048],[1478,1045],[1475,1042],[1472,1040],[1469,1040],[1466,1041],[1463,1042],[1460,1042],[1457,1040],[1454,1037],[1451,1035],[1448,1033],[1445,1030],[1443,1027],[1441,1024],[1443,1021],[1445,1018],[1447,1015],[1448,1012],[1450,1009],[1453,1006],[1453,1003],[1454,1000],[1456,997],[1457,994],[1460,991],[1461,988],[1462,985],[1463,982],[1466,979],[1469,976],[1472,973],[1475,970],[1477,967],[1478,964],[1479,961],[1480,958],[1481,955],[1482,952],[1482,949],[1483,946],[1483,943],[1484,940],[1486,937],[1488,934],[1489,931],[1488,928],[1485,927],[1482,924],[1481,921],[1480,918],[1478,915],[1478,912],[1478,912]],[[2180,1490],[2177,1490],[2174,1490],[2171,1488],[2168,1485],[2165,1482],[2162,1479],[2159,1476],[2156,1474],[2153,1476],[2150,1477],[2148,1476],[2147,1473],[2147,1470],[2149,1467],[2152,1464],[2155,1464],[2158,1462],[2159,1459],[2156,1457],[2153,1458],[2150,1458],[2147,1459],[2144,1459],[2143,1456],[2142,1453],[2139,1451],[2136,1452],[2133,1453],[2132,1456],[2131,1459],[2132,1462],[2131,1465],[2128,1466],[2125,1463],[2124,1460],[2121,1457],[2119,1455],[2118,1452],[2116,1449],[2114,1449],[2111,1452],[2108,1453],[2106,1450],[2103,1448],[2102,1446],[2099,1443],[2099,1440],[2097,1438],[2094,1439],[2092,1436],[2093,1433],[2091,1431],[2088,1431],[2085,1431],[2082,1428],[2079,1425],[2076,1424],[2073,1422],[2070,1419],[2068,1416],[2065,1413],[2062,1413],[2059,1415],[2056,1412],[2055,1409],[2055,1406],[2052,1404],[2049,1402],[2047,1401],[2047,1398],[2047,1395],[2048,1392],[2050,1389],[2048,1386],[2045,1385],[2042,1383],[2039,1381],[2036,1379],[2033,1377],[2030,1376],[2027,1376],[2024,1373],[2021,1371],[2018,1368],[2015,1365],[2012,1363],[2009,1362],[2007,1360],[2008,1357],[2011,1354],[2014,1351],[2015,1348],[2012,1346],[2009,1348],[2006,1348],[2003,1347],[2000,1347],[1997,1348],[1995,1345],[1993,1342],[1990,1339],[1987,1336],[1985,1333],[1983,1330],[1983,1327],[1982,1324],[1980,1321],[1979,1318],[1978,1315],[1976,1312],[1973,1309],[1971,1306],[1974,1303],[1974,1300],[1971,1299],[1968,1302],[1965,1304],[1962,1306],[1959,1306],[1956,1304],[1954,1301],[1954,1298],[1951,1295],[1948,1295],[1945,1293],[1944,1290],[1944,1287],[1945,1284],[1944,1281],[1941,1280],[1938,1279],[1935,1279],[1933,1277],[1932,1274],[1932,1271],[1932,1268],[1932,1265],[1933,1262],[1932,1259],[1929,1259],[1926,1259],[1923,1259],[1920,1259],[1917,1259],[1914,1259],[1911,1259],[1908,1257],[1906,1254],[1906,1251],[1906,1248],[1907,1245],[1909,1242],[1910,1239],[1910,1236],[1910,1233],[1913,1230],[1916,1229],[1919,1228],[1922,1226],[1925,1224],[1927,1221],[1929,1218],[1929,1215],[1929,1212],[1928,1209],[1927,1206],[1927,1203],[1926,1200],[1926,1197],[1926,1194],[1926,1191],[1926,1188],[1925,1185],[1927,1182],[1930,1180],[1933,1178],[1936,1176],[1937,1173],[1936,1170],[1935,1167],[1934,1164],[1934,1161],[1936,1158],[1938,1155],[1938,1152],[1938,1149],[1938,1146],[1938,1143],[1938,1140],[1938,1137],[1939,1134],[1939,1131],[1940,1128],[1942,1125],[1943,1122],[1943,1119],[1943,1116],[1943,1113],[1943,1110],[1945,1107],[1948,1105],[1951,1105],[1953,1107],[1956,1106],[1958,1103],[1961,1100],[1963,1097],[1964,1094],[1966,1091],[1967,1088],[1967,1085],[1967,1082],[1969,1079],[1972,1076],[1975,1073],[1977,1070],[1980,1070],[1983,1069],[1986,1070],[1989,1070],[1992,1069],[1995,1066],[1997,1063],[1997,1060],[1997,1057],[1997,1054],[1997,1051],[1995,1048],[1993,1045],[1990,1042],[1987,1040],[1984,1037],[1984,1034],[1984,1031],[1985,1028],[1986,1025],[1988,1022],[1989,1019],[1991,1016],[1992,1013],[1994,1010],[1996,1007],[1999,1004],[2002,1001],[2004,998],[2004,995],[2007,992],[2010,989],[2013,986],[2016,983],[2019,981],[2022,979],[2025,978],[2028,977],[2031,977],[2034,976],[2037,976],[2040,976],[2043,974],[2046,971],[2047,968],[2047,965],[2044,966],[2043,963],[2044,960],[2047,957],[2047,954],[2048,951],[2048,948],[2049,946]]];
const F24R = /*@nor_front_jul24*/[[[1025.5,916.6],[1142.0,917.7],[1200.3,931.1],[1251.3,950.0],[1309.5,971.2],[1367.8,993.5],[1411.5,1009.1],[1455.2,1035.8],[1484.3,1063.6],[1528.0,1072.5],[1586.2,1083.6],[1651.8,1078.1],[1702.7,1080.3],[1753.7,1055.8],[1826.5,1042.5],[1899.3,1050.3],[1943.0,1061.4],[2001.3,1046.9],[2052.3,1058.0],[2103.2,1022.4],[2128.7,977.9],[2121.4,911.0],[2139.6,858.6],[2139.6,810.5]]];
const F24 = F24R[0];
// ---------- helpers (Rokossovsky / Collins hook kit) ----------
const box = (txt, x, y, t, size = 16, until, pop = true) => { if (pop) SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${Math.round(size * 0.2)}px ${Math.round(size * 0.35)}px ${Math.round(size * 0.2)}px ${Math.round(size * 0.6)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const town = (txt, lat, lon, t, o = {}) => { const [x, y] = L(lat, lon); B.city("", x, y, { r: o.r || 5, t, until: o.until }); return box(txt, x + (o.dx || 0), y + (o.dy != null ? o.dy : -22), t, o.size || 13, o.until, false); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${Math.round(w * 0.05)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(1, Math.round(w / 40))}px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${Math.round(w * 0.24)}px;color:#f7f3ea;text-shadow:0 2px 4px #000">${name}</div></div>`, x, y, { t, until });
const unitXY = (id, side, x, y, icon, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 40, h: o.h || 27, t: o.t, label: o.label });
  K.counter(id, { icon, flag: side === "carth" ? (o.flag || "us") : "reich", size: o.size });
  if (o.t == null) gsap.set(B.units[id].el, { autoAlpha: 1 });
  return id;
};
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in" }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(4, Math.round(size / 9))}px solid ${c};padding:4px 22px 6px;background:rgba(14,12,10,0.72);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.3)}px;letter-spacing:0.22em;color:#f7f3ea;margin-top:2px">${sub}</div>` : ""}</div>`;
const legend = (t, until) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "ALLIES"], ["#be3a2a", "GERMAN"]].map(([sq, nm]) => `<span><b style="display:inline-block;width:20px;height:20px;background:${sq};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const wimg = (src, t, dIn, tOut, o = {}) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px" }); if (o.mx) el.style.mixBlendMode = "multiply";
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (t > 0) { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: o.a || 1, duration: dIn, immediateRender: false }, t); }
  else if (o.a) gsap.set(el, { autoAlpha: o.a });
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: o.outDur || 0.5 }, tOut);
  return el;
};
const along = (pts, f) => { const seg = []; let tot = 0; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); tot += d; }
  let d = f * tot; for (let j = 0; j < seg.length; j++) { if (d <= seg[j] || j === seg.length - 1) { const k = Math.min(1, d / seg[j]), a = pts[j], b = pts[j + 1]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; } };
const nrm = (pts, f) => { const a = along(pts, Math.max(0, f - 0.01)), b = along(pts, Math.min(1, f + 0.01)); const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dy / l, -dx / l]; };  // -> Allied (north) side
const shoot = (from, to, t, o = {}) => { K.gun(from[0], from[1], t, { dx: 0, dy: -3 });
  const dur = o.dur || 0.8; GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: 2.4, h: o.h || 30, impact: false }); K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 9, puffs: 2 }); };
// ---------- times (spoken words) ----------
const P1 = "move2-1";
const T_STUCK = at(P1, "were stuck"), T_SECTOR = at(P1, "In the American sector"), T_FIELDS = at(P1, "thousands of small fields"), T_HEDGE = at(P1, "ancient hedgerows"),
  T_BOC = at(P1, "the bocage"), T_FORT = at(P1, "Every field was a fortress"), T_PAY = at(P1, "paying for every"), T_CAS = at(P1, "thousands of casualties");
// ---------- map layers (bottom -> top): territory (multiply), bocage texture, living map, emblem, geography ----------
const C24 = wimg("assets/media/nor_ctl_jul24_mx.png", 0, 0, null, { mx: true });
const BOC = wimg("assets/media/nor_bocage.png", T_FIELDS - 0.2, 1.6, null);
const LV = LivingK(B);
LV.clouds({ n: 7, opacity: 0.22 });
LV.shimmer(RIVERS, { width: 1.4 });
LV.scaleBar(99.63); LV.north();
const EMB = [2040, 1300];   // emblem on German-held ground (land, south-east of the front), fixed for the whole scene
B.image("assets/media/emblem_ger.png", EMB[0] - 100, EMB[1] - 100, 200, 200, { t: 0, dur: 0.6, opacity: 0.8 });
wimg("assets/media/nor_geo_ref.png", 0, 0, null);
// ---------- camera: wide -> slow push on the American sector -> push in on the Cobra sector (= move2b's opening frame) ----------
B.camera([[0, 1520, 930, 0.78], [T_SECTOR, 1470, 960, 0.84], [T_FORT, 1400, 1000, 1.0], [END - 2.6, 1390, 1010, 1.08], [END - 0.02, 1426, 1089, 2.67]]);
// ---------- the date scroll ticks from D-Day to the eve of Cobra ----------
B.showDate(0.05);
const DD = document.createElement("div"); DD.className = "d"; DD.style.fontSize = "32px"; DD.textContent = "6 JUNE 1944"; document.getElementById("date").appendChild(DD);
const DAYS = ["6 JUNE 1944", "12 JUNE 1944", "18 JUNE 1944", "25 JUNE 1944", "1 JULY 1944", "7 JULY 1944", "13 JULY 1944", "18 JULY 1944", "24 JULY 1944"], dv = { v: 0 };
tl.to(dv, { v: DAYS.length - 1, duration: T_FIELDS - 1.0, ease: "power1.inOut", onUpdate: () => { DD.textContent = DAYS[Math.round(dv.v)]; } }, 0.8);
for (let k = 0; k < DAYS.length - 1; k++) SFX("tick", 0.8 + (k + 0.5) * (T_FIELDS - 1.0) / (DAYS.length - 1));
// ---------- move2-1: the lodgement, the static front ----------
legend(0.2, END + 1);
B.title("MOVE 2", "OPERATION COBRA", "JULY 1944", 0.3, T_SECTOR - 0.2); SFX("ref:boom", 0.4);
flag(US, "USA", 1190, 640, 0.3, END + 1, 96); flag(UK, "BRITAIN", 1975, 860, 0.4, END + 1, 80); flag(REICH, "GERMANY", 1650, 1350, 0.5, END + 1, 96);
// the front: option 1 (territory) carries it; a thin two-colour band marks where the sides touch (wide campaign map: always two-coloured)
K.front({ pts: F24, sideA: "carth", sideB: "rome", t: 0.2, dur: 1.6, width: 15, until: END - 1.3 });
town("SAINT-LÔ", 49.115, -1.09, 1.0, { dx: 40, dy: 22 });
town("CAEN", 49.183, -0.37, 1.2, { dy: -22 });
// a line of counters on both sides of the front: American west of Caumont, British / Canadian east of it
const FR = [0.05, 0.14, 0.24, 0.34, 0.44, 0.56, 0.68, 0.8, 0.9];
const WR = [], WB = [];
FR.forEach((f, i) => { const [x, y] = along(F24, f), [nx, ny] = nrm(F24, f);
  WR.push(unitXY("wr" + i, "rome", x - nx * 36, y - ny * 36, i % 3 === 1 ? "tank" : "infantry", { t: 0.4 + i * 0.08, size: "XX" }));
  WB.push(unitXY("wb" + i, "carth", x + nx * 46, y + ny * 46, i % 3 === 0 ? "tank" : "infantry", { t: 0.5 + i * 0.08, size: "XX", flag: f > 0.55 ? "uk" : "us" })); });
box("US FIRST ARMY", 1300, 760, T_SECTOR, 18, END + 1);
box("BRITISH &amp; CANADIANS", 2050, 980, T_SECTOR + 0.5, 15, T_FORT);
// the front barely moves: the counters lunge a few pixels forward and are thrown back (stalemate), guns duel along the line
WB.slice(0, 6).forEach((id, k) => { const u = B.units[id], x = parseFloat(u.el.style.left) + 20, y = parseFloat(u.el.style.top) + 13, [nx, ny] = nrm(F24, FR[k]);
  [T_STUCK + 0.3, T_HEDGE + 0.2, T_PAY].forEach((t, j) => { B.move(id, t + k * 0.15, 0.7, x - nx * 12, y - ny * 12, "power2.in"); B.move(id, t + k * 0.15 + 1.0, 1.0, x, y, "power1.out"); }); });
const SH = [];
for (let k = 0; k < 9; k++) { const f = 0.06 + ((k * 5) % 9) * 0.075, [x, y] = along(F24, f), [nx, ny] = nrm(F24, f);
  SH.push([[x + nx * 120, y + ny * 120], [x - nx * 34 + ((k * 13) % 9) - 4, y - ny * 34], 1.2 + k * 2.1]);
  SH.push([[x - nx * 120, y - ny * 120], [x + nx * 40, y + ny * 40], 2.2 + k * 2.1]); }
SH.forEach(([a, b, t]) => { if (t < END - 2.2) shoot(a, b, t); });
// "thousands of small fields ... the bocage": the hedgerow texture spreads over the American sector
box("THE BOCAGE · HEDGEROW COUNTRY", 1470, 900, T_BOC - 0.1, 17, END - 1.6);
B.caption("THOUSANDS OF SMALL FIELDS, EACH WALLED IN BY HEDGEROWS", T_HEDGE - 0.4, T_FORT - 0.1, "rome r");
// "Every field was a fortress": STALEMATE
const ST = scr(stampHTML("STALEMATE", "#e3232f", 82, -5, "EVERY FIELD A FORTRESS"), "left:0;right:0;top:660px;display:flex;justify-content:center;");
slam(ST, T_FORT + 0.1, { shake: 5, until: T_PAY + 0.6 });
B.caption("THOUSANDS OF CASUALTIES FOR A FEW HUNDRED YARDS", T_PAY + 0.2, END - 0.3, "carth r");
// lead-in to move2b: counters + labels clear as the camera pushes in on the Cobra sector
B.hideUnits([...WR, ...WB], END - 2.3, 0.6);
tl.to(C24, { autoAlpha: 0, duration: 1.0 }, END - 1.25);   // option 1 -> option 2: the fill goes as the camera dives (move2b opens without it)
K.raiseTerritory();
B.finish();
