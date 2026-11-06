// m3d (m3-6..m3-7), Grant #16: 16-18 Jun at Petersburg, STYLE W (petersburg_w + close), then ONE continuous zoom-out onto the richmond
// close map (assets/ext_richmond.jpg = richmond_w_close.jpg, placed at its true position and scale under the petersburg map, which feathers out).
// Hancock (portrait), Lee's veterans hurry south into the new line; the assaults break (smoke, ink crosses); casualty card ~11,400 (Union only,
// spoken); trenches freeze; Grant's later verdict (indirect speech, no quote marks). m3-7: the whole move (thin solid trail) over the James,
// the siege lines grow, MORE THAN NINE MONTHS, Richmond + Petersburg; method card on the spoken words.
// Built with: python3 tools/build_scene.py m3d petersburg_w m3-6 m3-7 ; then copy assets/richmond_w_close.jpg to scenes/m3d/assets/ext_richmond.jpg
const GEO = {"ric":{"RICHMOND":[1391.4,837.8],"COLD_HARBOR":[1451.5,814.7],"PETERSBURG":[1403.8,981.1],"CITY_POINT":[1449.7,942.2],"BERMUDA_HUNDRED":[1450.8,929.4],"DREWRYS_BLUFF":[1395.4,891.3],"WILCOX_LDG":[1512.7,939.9],"WEYANOKE":[1526.3,952.0],"FT_POWHATAN":[1521.0,961.4],"CHARLES_CITY_CH":[1523.6,928.4],"TREVILIAN":[1158.0,604.5],"LONG_BRIDGE":[1488.3,878.5],"RIDDELLS_SHOP":[1459.1,892.2],"WHITE_HOUSE":[1550.2,823.9],"JONES_BRIDGE":[1539.2,905.5],"CHAFFINS_BLUFF":[1419.1,902.3],"MALVERN_HILL":[1459.5,898.2],"PRINCE_GEORGE_CH":[1445.3,984.3],"WASHINGTON":[1536.7,204.5],"APPOMATTOX":[896.3,912.9],"FREDERICKSBURG":[1382.3,485.9],"VICKSBURG":[-3502.6,3143.8],"MEMPHIS":[-3200.8,1918.8],"NEW_ORLEANS":[-3208.9,4165.7],"PORT_HUDSON":[-3645.4,3854.0],"BATON_ROUGE":[-3615.2,3954.8],"JACKSON":[-3250.3,3167.0],"GRAND_GULF":[-3565.3,3282.6],"BRUINSBURG":[-3603.5,3313.5],"FORT_DONELSON":[-2402.8,1315.3],"FORT_HENRY":[-2465.7,1305.6],"NASHVILLE":[-2011.2,1464.8],"CAIRO":[-2883.2,1082.7],"BATT_5":[1420.2,974.4],"BATT_3":[1419.4,971.0],"BATT_11":[1421.6,983.4],"BATT_9":[1420.7,979.7],"BATT_7":[1420.5,976.9],"BATT_15":[1419.1,989.3],"BAYLORS_FARM":[1430.0,960.9],"HANOVER":[1415.4,734.6],"WINDMILL":[1525.4,957.3],"WEY_PT":[1526.1,952.7],"MILLIKENS":[-3576.2,3110.4],"PORT_GIBSON":[-3539.8,3312.6],"DIMM_C":[1420.5,976.9],"CHICK":[[1360.8,792.2],[1393.6,810.5],[1419.1,824.3],[1440.9,835.8],[1459.1,851.9],[1477.3,870.2],[1488.3,878.5],[1510.1,893.2],[1532.0,911.5],[1557.4,934.4],[1579.3,961.9],[1595.7,977.9]],"JAMES":[[1390.0,842.7],[1397.2,865.6],[1397.2,888.6],[1415.4,902.3],[1430.0,906.9],[1444.6,911.5],[1444.6,920.7],[1455.5,929.8],[1451.9,943.5],[1477.3,941.3],[1506.5,939.0],[1517.4,941.3],[1522.8,952.7],[1532.0,957.3],[1550.2,966.4],[1579.3,975.6],[1623.0,984.7],[1677.6,1016.7]],"APPOM":[[1386.3,980.2],[1404.5,979.2],[1419.1,973.3],[1430.0,961.9],[1440.9,948.1],[1450.0,943.5]],"PAMUNKEY":[[1466.4,750.7],[1502.8,783.0],[1550.2,824.3],[1623.0,842.7]],"CH_FRONT":[[1440.2,792.2],[1443.8,803.6],[1445.7,812.8],[1444.6,820.6],[1440.9,829.8]],"RR_RP":[[1391.8,840.4],[1393.6,893.2],[1400.9,939.0],[1403.1,977.4]],"RR_SS":[[1400.9,981.1],[1349.9,993.9],[1277.1,1003.0],[1113.2,971.0]],"RR_W":[[1404.5,982.4],[1404.5,1016.7],[1397.2,1085.2],[1386.3,1176.2]],"RR_NP":[[1408.2,981.1],[1459.1,1003.0],[1550.2,1085.2],[1695.8,1130.7]],"RR_CP":[[1408.2,977.9],[1430.0,961.9],[1448.2,943.5]],"SHERIDAN":[[1477.3,764.6],[1411.8,718.5],[1339.0,672.4],[1240.7,630.8],[1158.0,604.5]],"HAMPTON":[[1393.6,796.8],[1331.7,741.5],[1240.7,672.4],[1171.5,617.0]],"WARREN":[[1457.3,822.0],[1470.1,847.3],[1482.8,870.2],[1488.3,878.5],[1473.7,884.0],[1461.0,890.9]],"MARCH1":[[1453.7,815.1],[1488.3,842.7],[1513.7,870.2],[1539.2,905.5],[1523.6,928.4],[1513.7,939.0]],"MARCH2":[[1457.3,819.7],[1481.0,856.5],[1490.1,878.5],[1502.8,902.3],[1510.1,925.2],[1511.6,938.1]],"DIMMOCK":[[1416.2,967.3],[1419.4,971.0],[1420.2,974.2],[1420.5,976.9],[1420.7,979.7],[1421.6,983.4],[1420.2,987.0],[1417.3,991.6],[1411.8,996.2],[1404.5,998.4],[1393.6,996.2],[1386.3,989.3],[1384.5,980.2]],"BREACH":[[1419.4,971.0],[1420.2,974.2],[1420.5,976.9],[1420.7,979.7],[1421.6,983.4]],"NEWLINE":[[1414.7,967.8],[1415.8,972.4],[1416.5,977.4],[1415.8,982.4],[1414.0,988.4],[1411.4,993.9],[1408.9,998.4]],"CPROAD":[[1450.0,943.5],[1439.1,952.7],[1430.0,960.9],[1424.2,967.3],[1422.0,971.0]],"LEE_S":[[1419.1,893.2],[1410.0,902.3],[1404.5,916.1],[1400.9,934.4],[1400.9,957.3],[1404.5,973.3]],"HOWLETT":[[1424.5,909.2],[1422.7,920.7],[1422.0,934.4],[1422.7,943.5]],"SIEGE_N":[[1430.0,842.7],[1430.0,870.2],[1426.4,888.6],[1422.7,902.3]],"SIEGE_S":[[1408.2,998.4],[1397.2,1007.6],[1379.0,1012.1],[1360.8,1007.6]],"MOVE":[[1453.7,815.1],[1513.7,870.2],[1523.6,928.4],[1525.8,948.1],[1525.4,955.0],[1513.7,961.9],[1477.3,966.4],[1440.9,971.0],[1420.9,973.3]],"VKS":[[-3576.2,3110.4],[-3619.9,3188.0],[-3627.2,3252.5],[-3590.8,3304.1],[-3603.5,3313.5],[-3539.8,3312.6],[-3456.1,3243.9],[-3335.9,3183.7],[-3248.5,3166.5],[-3376.0,3157.8],[-3503.4,3144.9]],"MISS_R":[[-3204.8,1918.6],[-3397.8,2193.6],[-3583.5,2471.0],[-3568.9,2685.4],[-3609.0,2950.5],[-3510.7,3144.9],[-3619.9,3316.9],[-3692.7,3483.9],[-3645.4,3854.0],[-3616.3,3955.4],[-3208.5,4166.1]]},"jam":{"RICHMOND":[316.3,-72.8],"COLD_HARBOR":[796.9,-257.6],"PETERSBURG":[415.6,1073.9],"CITY_POINT":[782.3,762.4],"BERMUDA_HUNDRED":[791.1,659.8],"DREWRYS_BLUFF":[348.3,355.6],"WILCOX_LDG":[1286.2,744.1],"WEYANOKE":[1395.5,841.1],"FT_POWHATAN":[1353.2,916.2],"CHARLES_CITY_CH":[1373.6,652.5],"TREVILIAN":[-1550.7,-1939.0],"LONG_BRIDGE":[1091.1,252.9],"RIDDELLS_SHOP":[858.1,362.9],"WHITE_HOUSE":[1586.2,-184.1],"JONES_BRIDGE":[1498.9,469.3],"CHAFFINS_BLUFF":[537.7,443.6],"MALVERN_HILL":[861.0,410.6],"PRINCE_GEORGE_CH":[747.4,1099.1],"WASHINGTON":[1478.5,-5138.8],"APPOMATTOX":[-3645.0,527.9],"FREDERICKSBURG":[243.5,-2887.5],"VICKSBURG":[-38836.1,18375.4],"MEMPHIS":[-36421.7,8575.6],"NEW_ORLEANS":[-36485.8,26550.2],"PORT_HUDSON":[-39978.1,24056.6],"BATON_ROUGE":[-39736.7,24863.5],"JACKSON":[-36817.3,18560.8],"GRAND_GULF":[-39337.3,19485.7],"BRUINSBURG":[-39643.2,19733.0],"FORT_DONELSON":[-30037.1,3747.5],"FORT_HENRY":[-30541.0,3669.6],"NASHVILLE":[-26904.7,4943.5],"CAIRO":[-33880.4,1887.0],"BATT_5":[546.4,1020.5],"BATT_3":[540.6,993.0],"BATT_11":[558.1,1091.8],"BATT_9":[550.8,1062.5],"BATT_7":[549.3,1040.6],"BATT_15":[537.7,1139.4],"BAYLORS_FARM":[625.0,912.5],"HANOVER":[508.5,-897.9],"WINDMILL":[1388.2,883.2],"WEY_PT":[1394.0,846.6],"MILLIKENS":[-39424.7,18108.4],"PORT_GIBSON":[-39133.5,19726.1],"DIMM_C":[549.3,1040.6],"CHICK":[[71.6,-437.8],[333.8,-290.7],[537.7,-180.4],[712.4,-88.6],[858.1,40.0],[1003.7,186.8],[1091.1,252.9],[1265.8,370.3],[1440.6,516.9],[1644.5,700.1],[1819.3,919.8],[1950.3,1047.9]],"JAMES":[[304.7,-33.5],[362.9,150.1],[362.9,333.6],[508.5,443.6],[625.0,480.3],[741.6,516.9],[741.6,590.2],[828.9,663.5],[799.8,773.4],[1003.7,755.1],[1236.7,736.8],[1324.1,755.1],[1367.8,846.6],[1440.6,883.2],[1586.2,956.4],[1819.3,1029.6],[2168.8,1102.8],[2605.7,1358.7]],"APPOM":[[275.5,1066.2],[421.2,1058.9],[537.7,1011.3],[625.0,919.8],[712.4,810.0],[785.2,773.4]],"PAMUNKEY":[[916.3,-769.0],[1207.6,-511.3],[1586.2,-180.4],[2168.8,-33.5]],"CH_FRONT":[[706.6,-437.8],[735.7,-345.8],[750.3,-272.3],[741.6,-209.8],[712.4,-136.3]],"RR_RP":[[319.2,-51.8],[333.8,370.3],[392.0,736.8],[409.5,1044.3]],"RR_SS":[[392.0,1073.5],[-15.7,1175.9],[-598.3,1249.1],[-1909.0,993.0]],"RR_W":[[421.2,1084.5],[421.2,1358.7],[362.9,1906.3],[275.5,2634.8]],"RR_NP":[[450.3,1073.5],[858.1,1249.1],[1586.2,1906.3],[2751.3,2270.8]],"RR_CP":[[450.3,1047.9],[625.0,919.8],[770.7,773.4]],"SHERIDAN":[[1003.7,-658.6],[479.4,-1026.9],[-103.1,-1395.8],[-889.6,-1728.2],[-1550.7,-1939.0]],"HAMPTON":[[333.8,-401.0],[-161.4,-842.7],[-889.6,-1395.8],[-1443.0,-1839.1]],"WARREN":[[843.5,-198.8],[945.4,3.3],[1047.4,186.8],[1091.1,252.9],[974.6,296.9],[872.6,351.9]],"MARCH1":[[814.4,-253.9],[1091.1,-33.5],[1295.0,186.8],[1498.9,469.3],[1373.6,652.5],[1295.0,736.8]],"MARCH2":[[843.5,-217.2],[1032.8,76.7],[1105.6,252.9],[1207.6,443.6],[1265.8,626.9],[1277.5,729.4]],"DIMMOCK":[[514.4,963.8],[540.6,993.0],[546.4,1018.6],[549.3,1040.6],[550.8,1062.5],[558.1,1091.8],[546.4,1121.1],[523.1,1157.6],[479.4,1194.2],[421.2,1212.5],[333.8,1194.2],[275.5,1139.4],[261.0,1066.2]],"BREACH":[[540.6,993.0],[546.4,1018.6],[549.3,1040.6],[550.8,1062.5],[558.1,1091.8]],"NEWLINE":[[502.7,967.4],[511.5,1004.0],[517.3,1044.3],[511.5,1084.5],[496.9,1132.0],[476.5,1175.9],[456.1,1212.5]],"CPROAD":[[785.2,773.4],[697.9,846.6],[625.0,912.5],[578.4,963.8],[561.0,993.0]],"LEE_S":[[537.7,370.3],[464.9,443.6],[421.2,553.6],[392.0,700.1],[392.0,883.2],[421.2,1011.3]],"HOWLETT":[[581.4,498.6],[566.8,590.2],[561.0,700.1],[566.8,773.4]],"SIEGE_N":[[625.0,-33.5],[625.0,186.8],[595.9,333.6],[566.8,443.6]],"SIEGE_S":[[450.3,1212.5],[362.9,1285.6],[217.3,1322.2],[71.6,1285.6]],"MOVE":[[814.4,-253.9],[1295.0,186.8],[1373.6,652.5],[1391.1,810.0],[1388.2,864.9],[1295.0,919.8],[1003.7,956.4],[712.4,993.0],[552.2,1011.3]],"VKS":[[-39424.7,18108.4],[-39774.3,18728.9],[-39832.5,19245.1],[-39541.2,19657.4],[-39643.2,19733.0],[-39133.5,19726.1],[-38463.5,19176.3],[-37502.3,18694.5],[-36803.3,18556.7],[-37822.7,18487.7],[-38842.2,18384.3]],"MISS_R":[[-36453.8,8573.8],[-37997.5,10774.1],[-39483.0,12993.2],[-39366.5,14707.8],[-39686.9,16828.9],[-38900.4,18384.3],[-39774.3,19760.4],[-40356.8,21096.4],[-39978.1,24056.6],[-39745.1,24868.5],[-36482.9,26553.6]]},"pet":{"RICHMOND":[1277.3,-291.8],"COLD_HARBOR":[1757.9,-476.6],"PETERSBURG":[1376.6,854.9],"CITY_POINT":[1743.3,543.4],"BERMUDA_HUNDRED":[1752.1,440.8],"DREWRYS_BLUFF":[1309.3,136.6],"WILCOX_LDG":[2247.2,525.1],"WEYANOKE":[2356.5,622.1],"FT_POWHATAN":[2314.2,697.2],"CHARLES_CITY_CH":[2334.6,433.5],"TREVILIAN":[-589.7,-2158.0],"LONG_BRIDGE":[2052.1,33.9],"RIDDELLS_SHOP":[1819.1,143.9],"WHITE_HOUSE":[2547.2,-403.1],"JONES_BRIDGE":[2459.9,250.3],"CHAFFINS_BLUFF":[1498.7,224.6],"MALVERN_HILL":[1822.0,191.6],"PRINCE_GEORGE_CH":[1708.4,880.1],"WASHINGTON":[2439.5,-5357.8],"APPOMATTOX":[-2684.0,308.9],"FREDERICKSBURG":[1204.5,-3106.5],"VICKSBURG":[-37875.1,18156.4],"MEMPHIS":[-35460.7,8356.6],"NEW_ORLEANS":[-35524.8,26331.2],"PORT_HUDSON":[-39017.1,23837.6],"BATON_ROUGE":[-38775.7,24644.5],"JACKSON":[-35856.3,18341.8],"GRAND_GULF":[-38376.3,19266.7],"BRUINSBURG":[-38682.2,19514.0],"FORT_DONELSON":[-29076.1,3528.5],"FORT_HENRY":[-29580.0,3450.6],"NASHVILLE":[-25943.7,4724.5],"CAIRO":[-32919.4,1668.0],"BATT_5":[1507.4,801.5],"BATT_3":[1501.6,774.0],"BATT_11":[1519.1,872.8],"BATT_9":[1511.8,843.5],"BATT_7":[1510.3,821.6],"BATT_15":[1498.7,920.4],"BAYLORS_FARM":[1586.0,693.5],"HANOVER":[1469.5,-1116.9],"WINDMILL":[2349.2,664.2],"WEY_PT":[2355.0,627.6],"MILLIKENS":[-38463.7,17889.4],"PORT_GIBSON":[-38172.5,19507.1],"DIMM_C":[1510.3,821.6],"CHICK":[[1032.6,-656.8],[1294.8,-509.7],[1498.7,-399.4],[1673.4,-307.6],[1819.1,-179.0],[1964.7,-32.2],[2052.1,33.9],[2226.8,151.3],[2401.6,297.9],[2605.5,481.1],[2780.3,700.8],[2911.3,828.9]],"JAMES":[[1265.7,-252.5],[1323.9,-68.9],[1323.9,114.6],[1469.5,224.6],[1586.0,261.3],[1702.6,297.9],[1702.6,371.2],[1789.9,444.5],[1760.8,554.4],[1964.7,536.1],[2197.7,517.8],[2285.1,536.1],[2328.8,627.6],[2401.6,664.2],[2547.2,737.4],[2780.3,810.6],[3129.8,883.8],[3566.7,1139.7]],"APPOM":[[1236.5,847.2],[1382.2,839.9],[1498.7,792.3],[1586.0,700.8],[1673.4,591.0],[1746.2,554.4]],"PAMUNKEY":[[1877.3,-988.0],[2168.6,-730.3],[2547.2,-399.4],[3129.8,-252.5]],"CH_FRONT":[[1667.6,-656.8],[1696.7,-564.8],[1711.3,-491.3],[1702.6,-428.8],[1673.4,-355.3]],"RR_RP":[[1280.2,-270.8],[1294.8,151.3],[1353.0,517.8],[1370.5,825.3]],"RR_SS":[[1353.0,854.5],[945.3,956.9],[362.7,1030.1],[-948.0,774.0]],"RR_W":[[1382.2,865.5],[1382.2,1139.7],[1323.9,1687.3],[1236.5,2415.8]],"RR_NP":[[1411.3,854.5],[1819.1,1030.1],[2547.2,1687.3],[3712.3,2051.8]],"RR_CP":[[1411.3,828.9],[1586.0,700.8],[1731.7,554.4]],"SHERIDAN":[[1964.7,-877.6],[1440.4,-1245.9],[857.9,-1614.8],[71.4,-1947.2],[-589.7,-2158.0]],"HAMPTON":[[1294.8,-620.0],[799.6,-1061.7],[71.4,-1614.8],[-482.0,-2058.1]],"WARREN":[[1804.5,-417.8],[1906.4,-215.7],[2008.4,-32.2],[2052.1,33.9],[1935.6,77.9],[1833.6,132.9]],"MARCH1":[[1775.4,-472.9],[2052.1,-252.5],[2256.0,-32.2],[2459.9,250.3],[2334.6,433.5],[2256.0,517.8]],"MARCH2":[[1804.5,-436.2],[1993.8,-142.3],[2066.6,33.9],[2168.6,224.6],[2226.8,407.9],[2238.5,510.4]],"DIMMOCK":[[1475.4,744.8],[1501.6,774.0],[1507.4,799.6],[1510.3,821.6],[1511.8,843.5],[1519.1,872.8],[1507.4,902.1],[1484.1,938.6],[1440.4,975.2],[1382.2,993.5],[1294.8,975.2],[1236.5,920.4],[1222.0,847.2]],"BREACH":[[1501.6,774.0],[1507.4,799.6],[1510.3,821.6],[1511.8,843.5],[1519.1,872.8]],"NEWLINE":[[1463.7,748.4],[1472.5,785.0],[1478.3,825.3],[1472.5,865.5],[1457.9,913.0],[1437.5,956.9],[1417.1,993.5]],"CPROAD":[[1746.2,554.4],[1658.9,627.6],[1586.0,693.5],[1539.4,744.8],[1522.0,774.0]],"LEE_S":[[1498.7,151.3],[1425.9,224.6],[1382.2,334.6],[1353.0,481.1],[1353.0,664.2],[1382.2,792.3]],"HOWLETT":[[1542.4,279.6],[1527.8,371.2],[1522.0,481.1],[1527.8,554.4]],"SIEGE_N":[[1586.0,-252.5],[1586.0,-32.2],[1556.9,114.6],[1527.8,224.6]],"SIEGE_S":[[1411.3,993.5],[1323.9,1066.6],[1178.3,1103.2],[1032.6,1066.6]],"MOVE":[[1775.4,-472.9],[2256.0,-32.2],[2334.6,433.5],[2352.1,591.0],[2349.2,645.9],[2256.0,700.8],[1964.7,737.4],[1673.4,774.0],[1513.2,792.3]],"VKS":[[-38463.7,17889.4],[-38813.3,18509.9],[-38871.5,19026.1],[-38580.2,19438.4],[-38682.2,19514.0],[-38172.5,19507.1],[-37502.5,18957.3],[-36541.3,18475.5],[-35842.3,18337.7],[-36861.7,18268.7],[-37881.2,18165.3]],"MISS_R":[[-35492.8,8354.8],[-37036.5,10555.1],[-38522.0,12774.2],[-38405.5,14488.8],[-38725.9,16609.9],[-37939.4,18165.3],[-38813.3,19541.4],[-39395.8,20877.4],[-39017.1,23837.6],[-38784.1,24649.5],[-35521.9,26334.6]]},"box_ric_in_pet":[-9854,-6994,23040,12960]};
// @@KITW (Grant #16 move 3, STYLE W kit: copied from cleburne/scenes-src/move1a.js (= reference/style_w/index.html) BATCH 1-3 + Style W
// box/unit/arw/camera/town/lay, plus the move-3 extras (ships, pontoons, clock card, number card, ink trenches) restyled for STYLE_LOCK 2d.
// SIDES (grant/SCENES.md): Union (Grant) = BLUE "carth" + US 35-star flag (June 1864); Confederates = RED "rome" + CSA First National.
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const FL = { us: "assets/media/us35_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = (n) => `assets/media/${n}_head.png`;
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg", NSs = NS;
const tl = B.tl;
const WORLD = document.getElementById("world"), OVL = document.getElementById("overlay");
// STYLE W labels: small white serif + soft shadow, no box (no ref:* sounds, owner 2026-11-03)
const box = (txt, x, y, t, size = 16, until) => { size = Math.round(Math.max(20, Math.min(24, size * 0.85)));
  return GG.pin(`<div style="color:#fbf8ef;font-family:'Liberation Serif',Georgia,serif;font-weight:700;letter-spacing:.02em;font-size:${size}px;white-space:nowrap;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6)">${txt.toLowerCase().replace(/(^|\s)(\S)/g, (m, a, b) => a + b.toUpperCase()).replace(/'S\b/g, "'s")}</div>`, x, y, { t, until }); };
const flag = (src, x, y, t, until, w = 48) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"></div>`, x, y, { t, pop: true, until });
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t > 0 ? o.t : null, label }); if (o.t != null && !(o.t > 0)) gsap.set(B.units[id].el, { autoAlpha: 1 });
  K.counter(id, { icon, flag: side === "carth" ? FL.us : FL.cs, size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
// STYLE W: solid thin arrows only (no dash)
const arw = (o) => { const g = B.arrow({ ...o, dash: undefined }), w = o.width || 22, ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1));
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(1)); return g; };
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
const sub = (pts, f0, f1, n = 16) => [...Array(n + 1)].map((_, k) => posOn(pts, f0 + (f1 - f0) * k / n));
// thin glowing shell trail; width in world px
const shellArc = (a, b, t, dur, o = {}) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, h = o.h != null ? o.h : L * 0.3;
  let nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L; if (ny > 0) { nx = -nx; ny = -ny; }
  const mx = (a[0] + b[0]) / 2 + nx * h, my = (a[1] + b[1]) / 2 + ny * h, w = o.width || 1.2, col = o.color || "#fff3c4";
  const p = document.createElementNS(NS, "path"); p.setAttribute("d", `M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`); p.setAttribute("fill", "none");
  p.setAttribute("stroke", col); p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.style.filter = `drop-shadow(0 0 ${w * 1.5}px ${col})`;
  OVL.appendChild(p); const len = p.getTotalLength(), seg = Math.max(len * 0.35, 4);
  gsap.set(p, { strokeDasharray: `${seg} ${len + seg}`, strokeDashoffset: seg, opacity: 0 });
  tl.set(p, { opacity: 1 }, t); tl.to(p, { strokeDashoffset: -len, duration: dur, ease: "power1.in" }, t); tl.set(p, { opacity: 0 }, t + dur + 0.02); return p; };
// artillery / ship-gun shot: the gun fires (quiet), shell arc, the impact carries the boom + the locked shake (visible guns only)
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 1.0;
  shellArc(from, to, t + 0.05, dur, { width: o.width || 1.2, h: o.h, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: 2 });
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(1, Math.round(size / 9))}px solid ${c};padding:${(size * 0.1).toFixed(1)}px ${(size * 0.5).toFixed(1)}px ${(size * 0.14).toFixed(1)}px;background:rgba(14,12,10,0.78);box-shadow:0 ${size * 0.2}px ${size * 0.5}px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${(size * 0.34).toFixed(1)}px;letter-spacing:0.2em;color:#f7f3ea;margin-top:${size * 0.05}px">${sub}</div>` : ""}</div>`;
const scr = (html, css, t, until, from = { autoAlpha: 0, y: 30 }) => {   // screen-space element (above the map)
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);
  tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el;
};
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
const pinAlong = (el, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n); } };
const ticker = (label, to, suffix, css, t, dur, until, n = 8, o = {}) => {   // a counter that ticks up (screen space)
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    <div style="font-size:18px;letter-spacing:.3em;color:${o.lc || o.col || "#c9b48a"}">${label}</div><div class="v" style="font-size:${o.vs || 54}px;letter-spacing:.04em">${o.pre || ""}0${suffix}</div>${o.sub ? `<div style="font-size:15px;letter-spacing:.22em;color:#a8a294">${o.sub}</div>` : ""}</div>`, css, t, until);
  const v = el.querySelector(".v"), st = { x: 0 };
  tl.to(st, { x: to, duration: dur, ease: "none", onUpdate: () => { v.textContent = (o.pre || "") + Math.round(st.x).toLocaleString("en-US") + suffix; } }, t + 0.2);
  for (let k = 0; k < n; k++) SFX("tick", t + 0.2 + (k * dur) / n);
  return el;
};
const mg = (a, b, t, n = 5, w = 1.1) => { SFX("mg", t);   // musket volley: tracer dashes (mg sound), sparingly
  for (let k = 0; k < n; k++) { const g = document.createElementNS(NS, "line"), j = ((k * 7) % 5 - 2) * 1.5 * w;
    g.setAttribute("x1", a[0]); g.setAttribute("y1", a[1]); g.setAttribute("x2", b[0] + j); g.setAttribute("y2", b[1] - j);
    g.setAttribute("stroke", "#ffe28a"); g.setAttribute("stroke-width", w); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-dasharray", `${3 * w} ${26 * w}`);
    g.style.filter = `drop-shadow(0 0 ${2 * w}px #ffb347)`; OVL.appendChild(g); GG.hide(g);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 29 * w;
    tl.fromTo(g, { autoAlpha: 1, strokeDashoffset: 0 }, { strokeDashoffset: -len, duration: 0.4, ease: "none", immediateRender: false }, t + k * 0.1);
    tl.to(g, { autoAlpha: 0, duration: 0.05 }, t + k * 0.1 + 0.4); } };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const wstamp = (txt, x, y, t, until, c = "#e3232f", size = 9, sub) => { const el = GG.pin(stampHTML(txt, c, size, -6, sub), x, y, {});
  tl.fromTo(el, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
// quote card (screen space): verbatim quote + attribution (quote marks only for verbatim words)
const quote = (txt, who, t, until, o = {}) => scr(`<div style="max-width:${o.mw || 1280}px;padding:22px 46px 22px;background:rgba(18,16,12,0.93);border-left:8px solid ${o.col || "#1f4fc4"};font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:${o.size || 40}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div><div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div></div>`,
  `left:0;right:0;top:${o.top || 230}px;display:flex;justify-content:center;`, t, until);
const fixImgs = () => document.querySelectorAll("img").forEach((im) => { im.addEventListener("error", () => { im.style.display = "none"; }, { once: true }); });
const nightWash = (t, until, a = 0.5, dur = 1.2) => { const el = document.createElement("div"); el.style.cssText = `position:absolute;inset:0;background:rgba(6,10,26,${a});pointer-events:none`;
  document.getElementById("fx").appendChild(el); gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: dur }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 1.5 }, until); return el; };
// cavalry counter icon (owner-approved)
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
// K.front with its OWN blur filter (each front keeps the locked width 15 / glow 0.47 on screen at its own camera scale); t <= 0 = drawn at frame 0
let __FID = 0;
const frontS = (o) => { const g = K.front(o), id = "m3blur" + (++__FID), f = document.createElementNS(NS, "filter");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; OVL.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`));
  if (!(o.t > 0)) { const ps = [...g.querySelectorAll("path")]; tl.getTweensOf(ps).filter((tw) => tw.startTime() < 0.05 && "strokeDashoffset" in tw.vars).forEach((tw) => tw.kill()); gsap.set(ps, { strokeDashoffset: 0 }); }
  if (o.until != null) tl.to(g, { opacity: 0, duration: 0.6 }, o.until);
  return g; };
// ---------- STYLE W camera (A1 counter-scale + the lens transition wide -> close from the screen centre) ----------
const SCL = []; let CAM_S = 1, CAM_X0 = 0, CAM_Y0 = 0;
const setInv = () => { const k = (1 / CAM_S).toFixed(4); SCL.forEach((el) => { el.style.transform = `scale(${k})`; }); };
const lens = (s, cx, cy) => { const kc = Math.min(1, Math.max(0, (s - 1.5) / 0.7)), R2 = document.getElementById("relief2");
  R2.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
  R2.style.webkitMaskImage = R2.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none";
  document.getElementById("vignette").style.opacity = kc.toFixed(3); };
const camHook = () => { if (typeof focApply === "function") { focApply(); curvApply(); inkApply(); } };
const camera = (keys) => {
  const cam = { cx: keys[0][1], cy: keys[0][2], s: keys[0][3] }, clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const apply = () => { const s = Math.max(cam.s, 1920 / 2880), cx = clamp(cam.cx, 960 / s, 2880 - 960 / s), cy = clamp(cam.cy, 540 / s, 1620 - 540 / s);
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); CAM_X0 = 960 - cx * s; CAM_Y0 = 540 - cy * s; lens(s, cx, cy); camHook(); };
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: keys[i][4] || "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0);
};
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); return el; };
const pinS = (el) => { reg(el.firstElementChild); return el; };
const boxS = (txt, x, y, t, until, o = {}) => pinS(box(txt, x, y, t, o.size || 32, until));
const flagS = (src, x, y, t, until, w = 48) => { const el = pinS(flag(src, x, y, t > 0 ? t : null, until, w)); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };
const unitS = (id, side, p, icon, label, o = {}) => {   // A1: counter 54 x 36 px, name 19 px (screen)
  const W0 = o.w || 54, H0 = o.h || 36;
  unit(id, side, p, icon, label, { ...o, w: W0, h: H0, tag: o.tag || 19 });
  const el = B.units[id].el, inner = document.createElement("div");
  inner.style.cssText = `position:relative;width:${W0}px;display:flex;flex-direction:column;align-items:center;overflow:visible`;
  while (el.firstChild) inner.appendChild(el.firstChild); el.appendChild(inner); reg(inner, `50% ${H0 / 2}px`);
  return id;
};
const showU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 1, duration: 0.4 }, t));
const hideU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.4 }, t));
const pulseU = (id, t, k = 1.25) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: k, duration: 0.22, yoyo: true, repeat: 1, immediateRender: false }, t);
const greyU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "grayscale(1) brightness(0.75)", duration: 0.6 }, t));
const AW = (s, px = 9) => +(px / s).toFixed(2);        // STYLE W: thin arrows (~9 px on screen at camera scale s)
const FWw = (s) => +(15 / s).toFixed(2);               // front width 15 on screen (wide)
const FWc = (s) => +(15 * 1.3 / s).toFixed(2);         // front width 15*1.3 on close-ups
// STYLE W town: permanent dark dot + serif name (28 px); the name can shrink / step out when the camera crops it
const town = (nm, p, t, side = "r", o = {}) => { const lft = side === "l";
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><div class="dt" style="position:absolute;left:-5.5px;top:-5.5px;width:11px;height:11px;border-radius:50%;background:#1e1c14;box-shadow:0 0 0 1.5px rgba(160,158,146,.9)"></div><div class="nm" style="position:absolute;top:-17px;${lft ? "right:13px" : "left:13px"};font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:${o.size || 28}px;letter-spacing:.02em;color:#fbf8ef;white-space:nowrap;text-transform:capitalize;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6);transform-origin:${lft ? "100%" : "0%"} 50%">${nm.toLowerCase()}</div></div>`, p[0], p[1], { t: t > 0 ? t : null });
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 });
  pinS(el); const nmEl = el.querySelector(".nm");
  return { el, out: (tt) => tl.to(el, { autoAlpha: 0, duration: 0.4 }, tt), back: (tt) => tl.to(el, { autoAlpha: 1, duration: 0.5 }, tt) }; };
// STYLE W territory: red ink hatching layer (gn_*_mx.png, tools/make_hatch.py), shown only when ground changes hands
document.documentElement.classList.add("terr-on");
const lay = (file, on, off) => { const el = document.createElement("img"); el.className = "wimg terr"; el.src = file; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "normal" });
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 0 });
  tl.set(el, { autoAlpha: 1 }, on); if (off != null) tl.set(el, { autoAlpha: 0 }, off); return el; };
// HUD declutter (1c rule 3): while a big card is up, corner badges / clock step out via filter:opacity()
const declutter = (huds, wins) => {
  const M = []; wins.slice().sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { const L2 = M[M.length - 1]; if (L2 && a - L2[1] < 0.9) L2[1] = Math.max(L2[1], b); else M.push([a, b]); });
  huds.forEach((el) => { gsap.set(el, { filter: "opacity(1)" });
    M.forEach(([a, b]) => { tl.to(el, { filter: "opacity(0)", duration: 0.15, ease: "none", immediateRender: false }, a - 0.15); tl.to(el, { filter: "opacity(1)", duration: 0.3, ease: "none", immediateRender: false }, b + 0.3); }); });
};
const badge = (o) => {   // corner badge (only for commanders with no unit on the map, <= 3.5 s)
  const el = K.badge({ ...o, until: Math.min(o.until, o.t + 3.5) }); if (o.corner && o.corner[0] === "b") el.style.bottom = "215px";
  const ring = el.querySelector("div[style*='border-radius:50%']"), img = ring && ring.querySelector("img");
  if (img) { const ini = document.createElement("div"); ini.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.78) 0%, rgba(10,12,24,0.45) 100%);font-size:60px;font-weight:700;color:#f7f3ea;text-shadow:0 3px 6px #000";
    ini.textContent = o.initials || ""; ini.style.display = "none"; ring.insertBefore(ini, img); img.addEventListener("error", () => { img.style.display = "none"; ini.style.display = "flex"; }); }
  return el;
};
// already on screen at frame 0 (continuing scenes): the date scroll already showing
const dateNow = (text, until) => { const bx = document.getElementById("date"); gsap.set(bx, { autoAlpha: 1 });
  const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "34px"; bx.appendChild(d);
  if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.35 }, until); return d; };
// ---------- ships (top-down counters): Union ferry steamer (blue) ----------
const SHIPCOL = { carth: "#1f4fc4", rome: "#c4121f" };
const shipSVG = (kind, side, L) => { const c = SHIPCOL[side] || side, H = L * 0.34;
  const hull = kind === "steamer" ? `<path d="M6 7 L78 6 Q96 17 78 28 L6 27 Q2 17 6 7 Z" fill="#3a332a" stroke="${c}" stroke-width="3"/><rect x="18" y="10" width="44" height="14" rx="2" fill="#d9cfb8" stroke="#1a1712" stroke-width="1.4"/><rect x="2" y="9" width="8" height="16" fill="#5a4a36" stroke="#1a1712" stroke-width="1"/>`
    : `<path d="M4 6 L80 4 L97 17 L80 30 L4 28 Z" fill="#2b3442" stroke="${c}" stroke-width="3.4"/><path d="M14 9 L70 8 L76 17 L70 26 L14 25 L10 17 Z" fill="#4a5564" stroke="#151a22" stroke-width="1.6"/><rect x="20" y="13" width="44" height="8" fill="#5c6878"/>`;
  return `<svg width="${L}" height="${H}" viewBox="0 0 100 34" style="display:block;overflow:visible;filter:drop-shadow(0 ${L * 0.03}px ${L * 0.04}px rgba(0,0,0,.6))">
    ${hull}<circle cx="44" cy="13" r="3.6" fill="#111"/><circle cx="44" cy="21" r="3.6" fill="#111"/></svg>`; };
const ship = (kind, side, p, ang, t, until, o = {}) => {
  const L = o.L || 64;
  const el = GG.pin(`<div class="shs" style="position:relative;width:0;height:0"><div class="shr" style="position:absolute;left:${-L / 2}px;top:${-L * 0.17}px;width:${L}px;transform:rotate(${ang}deg);transform-origin:50% 50%">${shipSVG(kind, side, L)}</div></div>`, p[0], p[1], { t, until, pop: o.pop });
  pinS(el); return { el, rot: el.querySelector(".shr"), L, side };
};
const sail = (s, pts, t, dur, n = 24, o = {}) => {
  for (let k = 1; k <= n; k++) { const a = posOn(pts, (k - 1) / n), b = posOn(pts, k / n), tt = t + (k - 1) * dur / n;
    tl.to(s.el, { left: b[0], top: b[1], duration: dur / n, ease: "none" }, tt);
    if (!o.keepRot) tl.to(s.rot, { rotation: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI + (o.rev ? 180 : 0), duration: Math.min(0.4, dur / n), ease: "none" }, tt); } };
// pontoon bridge: n small boats appear one by one along a->b between t0 and t1 (world px), sepia ink deck
const pontoons = (a, b, t0, t1, n = 26, o = {}) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, bw = o.bw || 3.2, bl = o.bl || 9;
  const g = document.createElementNS(NS, "g"); OVL.appendChild(g);
  for (let k = 0; k < n; k++) { const f = (k + 0.5) / n, x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f, r = document.createElementNS(NS, "rect");
    r.setAttribute("x", -bw / 2); r.setAttribute("y", -bl / 2); r.setAttribute("width", bw); r.setAttribute("height", bl); r.setAttribute("rx", bw * 0.4);
    r.setAttribute("fill", "#4a3c26"); r.setAttribute("stroke", "#2a2410"); r.setAttribute("stroke-width", bw * 0.18); r.setAttribute("transform", `translate(${x} ${y}) rotate(${ang})`);
    g.appendChild(r); gsap.set(r, { opacity: 0 }); tl.to(r, { opacity: 1, duration: 0.25 }, t0 + (t1 - t0) * k / n); }
  const deck = document.createElementNS(NS, "path"); deck.setAttribute("d", `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`); deck.setAttribute("stroke", "#e6d9b6"); deck.setAttribute("stroke-width", bw * 0.55);
  deck.setAttribute("stroke-linecap", "butt"); deck.setAttribute("fill", "none"); g.appendChild(deck);
  gsap.set(deck, { strokeDasharray: `${L} ${L + 5}`, strokeDashoffset: L }); tl.to(deck, { strokeDashoffset: 0, duration: t1 - t0, ease: "none" }, t0);
  return g; };
// a screen-space clock card: an analogue face whose hour hand turns between the keys [[t, hour, "4 PM"], ...]
const clockCard = (keys, css, t, until) => {
  const el = scr(`<div style="display:flex;align-items:center;gap:16px;padding:10px 22px 10px 14px;background:rgba(18,16,12,0.9);border-top:5px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea">
    <svg width="74" height="74" viewBox="-40 -40 80 80"><circle r="36" fill="#f3eee2" stroke="#c9b48a" stroke-width="4"/>${[...Array(12)].map((_, i) => `<line x1="0" y1="-30" x2="0" y2="-25" stroke="#222" stroke-width="3" transform="rotate(${i * 30})"/>`).join("")}
    <line class="hh" x1="0" y1="4" x2="0" y2="-18" stroke="#111" stroke-width="5" stroke-linecap="round"/><line class="mh" x1="0" y1="5" x2="0" y2="-27" stroke="#111" stroke-width="3" stroke-linecap="round"/><circle r="3.5" fill="#c4121f"/></svg>
    <div class="lab" style="font-size:46px;letter-spacing:.06em;min-width:120px">${keys[0][2]}</div></div>`, css, t, until);
  const hh = el.querySelector(".hh"), mh = el.querySelector(".mh"), lab = el.querySelector(".lab");
  gsap.set(hh, { rotation: keys[0][1] * 30, svgOrigin: "0 0" }); gsap.set(mh, { rotation: 0, svgOrigin: "0 0" });
  for (let i = 1; i < keys.length; i++) { const d = Math.max(0.3, keys[i][0] - keys[i - 1][0] - 0.2), h0 = keys[i - 1][1], h1 = keys[i][1];
    tl.to(hh, { rotation: h1 * 30, duration: d, ease: "power1.inOut" }, keys[i - 1][0] + 0.2); tl.to(mh, { rotation: (h1 - h0) * 360, duration: d, ease: "power1.inOut" }, keys[i - 1][0] + 0.2);
    tl.set(mh, { rotation: 0 }, keys[i - 1][0] + 0.2 + d + 0.01); }
  tl.eventCallback("onUpdate", ((prev) => function () { if (prev) prev.apply(this, arguments); let s = keys[0][2]; keys.forEach((k) => { if (tl.time() >= k[0]) s = k[2]; }); if (lab.textContent !== s) lab.textContent = s; })(tl.eventCallback("onUpdate")));
  return el; };
// small screen-space number card (big value, label above, sub below); spoken words only
const numCard = (label, value, sub, css, t, until, o = {}) => { const el = scr(`<div style="padding:10px 30px 12px;background:rgba(18,16,12,0.92);border-top:6px solid ${o.col || "#2e5cb2"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 16px 34px rgba(0,0,0,.55)">
  <div style="font-size:20px;letter-spacing:.3em;color:${o.lc || "#9fc0ea"}">${label}</div><div class="v" style="font-size:${o.vs || 62}px;letter-spacing:.04em;line-height:1.1">${value}</div>${sub ? `<div style="font-size:19px;letter-spacing:.22em;color:#c9c2b2">${sub}</div>` : ""}</div>`, css, t, until);
  if (o.slam !== false) slam(el, t, { sfx: "hit", shake: 3 }); return el; };
// ink trench line (sepia zig-zag drawn on, world px; w = screen px)
const trench = (pts, t, dur, until, o = {}) => { const zz = [], s0 = o.s || 3;
  for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L * s0 / 9));
    const nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
    for (let k = 0; k < n; k++) { const f = k / n, z = (k % 2 ? 1 : -1) * 2.0 / s0; zz.push([a[0] + (b[0] - a[0]) * f + nx * z, a[1] + (b[1] - a[1]) * f + ny * z]); } }
  zz.push(pts[pts.length - 1]);
  const p = document.createElementNS(NS, "path"); p.setAttribute("d", "M" + zz.map((q) => q.map((v) => v.toFixed(2)).join(" ")).join(" L"));
  Object.entries({ fill: "none", stroke: "#2e2812", "stroke-width": (o.w || 2.2) / s0, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  OVL.appendChild(p); const L = p.getTotalLength(); gsap.set(p, { attr: { "stroke-dasharray": L, "stroke-dashoffset": L } });
  if (t > 0) { tl.to(p, { opacity: 0.85, duration: 0.2 }, t); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: dur, ease: "sine.out" }, t); }
  else gsap.set(p, { opacity: 0.85, attr: { "stroke-dashoffset": 0 } });
  if (until != null) tl.to(p, { opacity: 0, duration: 0.6 }, until); return p; };
// casualty card (K.casualties) with a heading line; one column when only one side's loss is spoken
const casualty = (o) => { const el = K.casualties({ rows: o.rows, flagA: FL.us, flagB: FL.cs, headA: "UNION", headB: "CONFEDERATE", t: o.t, until: o.until, top: o.top || 230 });
  const inner = el.firstElementChild; inner.style.flexWrap = "wrap"; inner.style.maxWidth = "900px";
  if (o.single) { inner.removeChild(inner.lastElementChild); inner.style.maxWidth = "520px"; inner.style.justifyContent = "center"; }
  const h = document.createElement("div"); h.style.cssText = "width:100%;text-align:center;font-size:22px;letter-spacing:.3em;color:#c9b48a;order:-1;margin-bottom:-30px"; h.textContent = o.head;
  inner.insertBefore(h, inner.firstChild);
  if (o.foot) { const f = document.createElement("div"); f.style.cssText = "width:100%;text-align:center;font-size:15px;letter-spacing:.22em;color:#a8a294;margin-top:-26px"; f.textContent = o.foot; inner.appendChild(f); }
  return el; };
// =================== BATCH 2 (three-agent review, owner OK 2026-11-05): map tools ===================
// (1) soft focus wash, screen space: everything outside the place being talked about dims to ~85 %; replaces target rings + colour glows
const FOC = document.createElement("div"); FOC.style.cssText = "position:absolute;inset:0;pointer-events:none;opacity:0";
document.getElementById("scene").insertBefore(FOC, document.getElementById("fx"));
const FS = { x: 1440, y: 810, r: 120, k: 0 };
const focApply = () => { const sx = CAM_X0 + FS.x * CAM_S, sy = CAM_Y0 + FS.y * CAM_S, r = Math.max(70, FS.r * CAM_S);
  FOC.style.background = `radial-gradient(ellipse ${(r * 1.3).toFixed(0)}px ${r.toFixed(0)}px at ${sx.toFixed(0)}px ${sy.toFixed(0)}px, rgba(8,8,4,0) 0%, rgba(8,8,4,0) 45%, rgba(8,8,4,${CAM_S > 2.5 ? 0.22 : 0.16}) 100%)`;
  FOC.style.opacity = FS.k.toFixed(3); };
const focus = (p, r, t, until) => { until = Math.min(until, t + 3.5);
  tl.to(FS, { x: p[0], y: p[1], r, duration: 0.6, ease: "sine.inOut", onUpdate: focApply }, t);
  tl.to(FS, { k: 1, duration: 0.6, onUpdate: focApply }, t);
  tl.to(FS, { k: 0, duration: 0.6, onUpdate: focApply }, until); };
// (2) re-ink the named ground: a sepia ink trace draws along the feature on its word, holds, then fades
const INKS = []; const inkApply = () => INKS.forEach(([p, w]) => p.setAttribute("stroke-width", (w / CAM_S).toFixed(3)));
const inkTrace = (pts, t, until, w = 2.4, dash) => { until = Math.min(until, t + 3.5);
  const p = document.createElementNS(NSs, "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L"));
  Object.entries({ fill: "none", stroke: "#463a1e", "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  OVL.appendChild(p); INKS.push([p, w]);
  if (dash) { p.setAttribute("stroke-dasharray", dash); tl.to(p, { opacity: 0.65, duration: 0.4 }, t); }
  else { const L = p.getTotalLength(); gsap.set(p, { attr: { "stroke-dasharray": L, "stroke-dashoffset": L } });
    tl.to(p, { opacity: 0.65, duration: 0.2 }, t); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.8, ease: "sine.out" }, t); }
  tl.to(p, { opacity: 0, duration: 0.8 }, until - 0.3); return p; };
// every former colour glow becomes focus + ink trace
const glowPath = (pts, t, until, o = {}) => {
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  if (o.focus !== false) focus([cx, cy], Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + (o.pad || 40), t, until);
  return inkTrace(pts, t, until, o.w || 2.4, o.dash); };
K.target = (x, y, t, o = {}) => focus([x, y], o.r || 70, t, o.until != null ? o.until : t + 3);
// (3) map-style curved labels (white serif along the feature), counter-scaled to constant screen size
const CURV = [];
const curveLabel = (txt, pts, t, until, px = 22) => { until = Math.min(until, t + 3.5);
  const id = "m3cl" + CURV.length, g = document.createElementNS(NSs, "g"), path = document.createElementNS(NSs, "path");
  path.setAttribute("id", id); path.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); path.setAttribute("fill", "none");
  const tx = document.createElementNS(NSs, "text"); Object.entries({ fill: "#fbf8ef", "font-family": "'Liberation Serif',Georgia,serif", "font-weight": "700", "text-anchor": "middle" }).forEach(([k, v]) => tx.setAttribute(k, v));
  tx.style.filter = "drop-shadow(0 1px 1.5px rgba(0,0,0,.9))";
  const tp = document.createElementNS(NSs, "textPath"); tp.setAttribute("href", "#" + id); tp.setAttribute("startOffset", "50%"); tp.textContent = txt; tx.appendChild(tp);
  g.appendChild(path); g.appendChild(tx); g.setAttribute("opacity", "0"); OVL.appendChild(g); CURV.push([tx, px]);
  tl.to(g, { opacity: 1, duration: 0.5 }, t); tl.to(g, { opacity: 0, duration: 0.5 }, until); return g; };
const curvApply = () => CURV.forEach(([tx, px]) => tx.setAttribute("font-size", (px / CAM_S).toFixed(2)));
// (5) zoom box: a thin dashed sepia frame of where the camera is about to dive (hw, hh in world px)
const zoomBox = (cx, cy, hw, hh, t) => { const g = document.createElementNS(NSs, "g"), r = document.createElementNS(NSs, "rect");
  Object.entries({ x: cx - hw, y: cy - hh, width: 2 * hw, height: 2 * hh, fill: "none", stroke: "#2a2410", "stroke-width": 2.2, "stroke-dasharray": "10 7", "vector-effect": "non-scaling-stroke" }).forEach(([k, v]) => r.setAttribute(k, v));
  g.appendChild(r); g.setAttribute("opacity", "0"); OVL.appendChild(g);
  tl.to(g, { opacity: 0.9, duration: 0.3 }, t); tl.to(g, { opacity: 0, duration: 0.4 }, t + 1.2); };
// =================== BATCH 3 (owner OK 2026-11-05): story devices ===================
// (a) commander portrait card on a stake at his own unit (Warhawk style); rides with the unit. side: "up" or [dx, dy] = card foot offset (screen px)
const pinPortrait = (id, photo, flag, name, t, until, keep = false, side = "up") => { if (!keep) until = Math.min(until, t + 3.6);
  const host = B.units[id].el.firstElementChild, w = document.createElement("div");
  const [dx, dy] = side === "up" ? [0, -84] : side === "right" ? [96, -10] : side === "left" ? [-96, -10] : side;
  const L = Math.hypot(dx, dy), ang = Math.atan2(dy, dx) * 180 / Math.PI;
  w.style.cssText = "position:absolute;left:50%;top:18px;width:0;height:0;pointer-events:none;z-index:5";
  w.innerHTML = `<div style="position:absolute;left:0;top:0;width:${L.toFixed(1)}px;height:1.5px;background:#463a1e;transform-origin:0 50%;transform:rotate(${ang.toFixed(1)}deg)"></div><div style="position:absolute;left:${(dx - 38).toFixed(1)}px;top:${(dy - 118).toFixed(1)}px;width:76px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 4px 10px rgba(0,0,0,.6)"><img src="${flag}" style="display:block;width:76px;height:15px;object-fit:cover"><img src="${photo}" style="display:block;width:76px;height:82px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:13px;color:#fbf8ef;text-align:center;padding:2px 0 3px;white-space:nowrap">${name}</div></div>`;
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 });
  const tg = B.units[id].el.querySelector(".tag"); if (tg) { tl.to(tg, { autoAlpha: 0, duration: 0.2 }, t - 0.1); if (until != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, until + 0.2); }
  tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); if (until != null) tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); return w; };
// (c) powder smoke: soft grey-sepia puffs drifting east (visual only)
const SMK = document.createElementNS(NSs, "filter"); SMK.setAttribute("id", "smkblur"); SMK.innerHTML = '<feGaussianBlur stdDeviation="1.6"/>';
{ let defs = OVL.querySelector("defs"); if (!defs) { defs = document.createElementNS(NSs, "defs"); OVL.insertBefore(defs, OVL.firstChild); } defs.appendChild(SMK); }
const smoke = (pts, t, k = 1) => pts.slice(0, 5).forEach((q, i) => { const e = document.createElementNS(NSs, "ellipse");
  Object.entries({ cx: q[0], cy: q[1], rx: 5.5 * k, ry: 4 * k, fill: "#6e6a5c", opacity: 0, filter: "url(#smkblur)" }).forEach(([kk, v]) => e.setAttribute(kk, v)); OVL.appendChild(e);
  const t0 = t + i * 0.25; tl.to(e, { opacity: 0.55, duration: 0.4 }, t0); tl.to(e, { attr: { cx: q[0] + 10 * k, cy: q[1] - 3 * k, rx: 9 * k, ry: 6 * k }, duration: 3.6, ease: "sine.out" }, t0);
  tl.to(e, { opacity: 0, duration: 1.4 }, t0 + 2.4); });
// BATCH 1: one passing word item at a time, each at most 3.5 s
{ const _cap = B.caption; B.caption = (txt, t, u, sd) => _cap(txt, t, Math.min(u, t + 3.5), sd); }
const boxP = (txt, x, y, t, u, o = {}) => boxS(txt, x, y, t, o.keep ? u : Math.min(u ?? 1e9, t + 3.5), o);
const stampP = (txt, x, y, t, u, sz = 22) => pinS(wstamp(txt, x, y, t, Math.min(u ?? 1e9, t + 3.5), "#f0e6c8", sz));
// unit name tags only from the moment the name is spoken (null = never in this scene)
const tagAt = (id, t) => { const tg = B.units[id] && B.units[id].el.querySelector(".tag"); if (!tg) return; gsap.set(tg, { autoAlpha: 0 }); if (t != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, t); };
// time-of-day light (cool morning, warm 4 PM) + small ink crosses where attacks broke
const todDiv = (bg) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;inset:0;pointer-events:none;opacity:0;background:${bg};mix-blend-mode:soft-light`; document.getElementById("scene").insertBefore(d, document.getElementById("fx")); return d; };
const crosses = (pts, t, until, a = 3.6) => pts.forEach((q, i) => { const g = document.createElementNS(NSs, "path");
  g.setAttribute("d", `M${q[0] - a} ${q[1] - a} L${q[0] + a} ${q[1] + a} M${q[0] + a} ${q[1] - a} L${q[0] - a} ${q[1] + a}`);
  Object.entries({ stroke: "#322c14", "stroke-width": a / 5, "stroke-linecap": "round", fill: "none", opacity: 0 }).forEach(([k, v]) => g.setAttribute(k, v)); OVL.appendChild(g);
  tl.to(g, { opacity: 0.75, duration: 0.3 }, t + i * 0.15); if (until != null) tl.to(g, { opacity: 0, duration: 0.6 }, until); });
// thin solid trail of a real move (fades ~2 s after arrival): a solid arrow whose `until` = arrival + 2
const trailArw = (pts, side, t, dur, s, px = 7) => arw({ pts, side, t, dur, width: AW(s, px), until: t + dur + 2.0 });
// @@END-KITW

const P6 = "m3-6", P7 = "m3-7", G = GEO.pet, BOX = GEO.box_ric_in_pet;
const T_SMITH = at(P6, "By the time Smith's men"), T_HAN = at(P6, "Hancock's corps"), T_VET = at(P6, "Lee's veterans were arriving"), T_18 = at(P6, "By the eighteenth"),
  T_LOST = at(P6, "eleven thousand four hundred"), T_FOUR = at(P6, "four days of assaults"), T_GONE = at(P6, "the chance was gone"), T_WROTE = at(P6, "Grant wrote years later"),
  T_EASY = at(P6, "easily captured");
const T_EVEN = at(P7, "Even so"), T_CHG = at(P7, "the move changed the war"), T_ACROSS = at(P7, "was across the James"), T_PIN = at(P7, "pinned in a siege"),
  T_NINE = at(P7, "more than nine months"), T_ABAN = at(P7, "abandon both Petersburg and Richmond"), T_STALE = at(P7, "out of a stalemate"), T_RIVER = at(P7, "over a river"),
  T_INIT = at(P7, "the initiative again"), T_ASK = at(P7, "He had stopped asking"), T_FOLLOW = at(P7, "where Lee could not follow");
const T_RICHN = at(P7, "Richmond");
// ---------- camera over BOTH maps (petersburg world px; the richmond close map sits under it at its true place and scale, 8x) ----------
const T_Z0 = T_CHG - 0.4, T_Z1 = T_PIN + 1.0;
const VK = { k: 0 };   // once the petersburg map has feathered out, the richmond close map (seen at ~4x its own scale) keeps the close-look vignette
const camera2 = (keys) => {
  const cam = { cx: keys[0][1], cy: keys[0][2], s: keys[0][3] }, cl = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const apply = () => { const L = BOX[0], T = BOX[1], R = BOX[0] + BOX[2], Bt = BOX[1] + BOX[3], s = Math.max(cam.s, 1920 / (R - L));
    const cx = cl(cam.cx, L + 960 / s, R - 960 / s), cy = cl(cam.cy, T + 540 / s, Bt - 540 / s);
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); CAM_X0 = 960 - cx * s; CAM_Y0 = 540 - cy * s; lens(s, cx, cy);
    const v = document.getElementById("vignette"); v.style.opacity = Math.max(+v.style.opacity, VK.k).toFixed(3); camHook(); };
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: keys[i][4] || "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0); return apply; };
// ---------- maps: richmond close map (under); petersburg relief on top, feathered out on the zoom ----------
{ const el = document.createElement("img"); el.className = "wimg ext"; el.src = "assets/ext_richmond.jpg"; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: BOX[0] + "px", top: BOX[1] + "px", width: BOX[2] + "px", height: BOX[3] + "px", maxWidth: "none" });
  WORLD.insertBefore(el, document.getElementById("relief")); }
const REL = document.getElementById("relief"), REL2 = document.getElementById("relief2");
gsap.set([REL, REL2], { filter: "opacity(1)" });
tl.set(REL, { webkitMaskImage: "radial-gradient(ellipse 62% 62% at 50% 50%, #000 70%, transparent 100%)", maskImage: "radial-gradient(ellipse 62% 62% at 50% 50%, #000 70%, transparent 100%)" }, T_Z0);
tl.to([REL, REL2], { filter: "opacity(0)", duration: 2.0, ease: "sine.inOut" }, T_Z0 + 1.2);
const CAMAPPLY = camera2([[0, 1480, 835, 2.2], [T_VET - 0.6, 1470, 700, 1.6], [T_VET + 1.0, 1440, 560, 1.15], [T_18 + 0.4, 1470, 850, 2.1], [T_GONE, 1460, 850, 2.0], [T_WROTE + 1.0, 1440, 850, 1.75],
  [T_EVEN, 1480, 760, 1.5], [T_Z0 + 0.6, 1500, 700, 1.3], [T_Z1 + 1.4, 1760, 230, 0.55, "power2.inOut"], [T_ABAN + 1.0, 1700, 260, 0.56], [END, 1720, 250, 0.53]]);
tl.to(VK, { k: 1, duration: 2.6, ease: "sine.inOut", onUpdate: CAMAPPLY }, T_Z0 + 1.2);
SFX("whoosh", T_Z0 + 0.8);
dateNow("15 JUNE 1864", T_18 - 0.1); B.date("18 JUNE 1864", T_18, T_PIN, 34); B.date("JUNE 1864 – APRIL 1865", T_PIN + 0.1, null, 30);
// ---------- flags (48 px, behind each side's lines; re-placed for the overview) ----------
flagS(FL.us, 1650, 990, 0, T_VET - 0.8); flagS(FL.cs, 1300, 760, 0, T_VET - 0.8);
flagS(FL.us, 1700, 640, T_VET - 0.6, T_18 + 0.2); flagS(FL.cs, 1290, 520, T_VET - 0.6, T_18 + 0.2);
flagS(FL.us, 1650, 990, T_18 + 0.3, T_Z1 - 1.0); flagS(FL.cs, 1300, 760, T_18 + 0.3, T_Z1 - 1.0);
flagS(FL.us, 2300, 1000, T_Z1 - 0.9, END + 1); flagS(FL.cs, 600, 600, T_Z1 - 0.9, END + 1);
// ---------- 16-18 June: Smith's men and Hancock's corps; Lee's veterans arrive; the assaults break on the new line ----------
const NL = G.NEWLINE;
const FR = frontS({ pts: NL, sideA: "carth", sideB: "rome", t: 0, dur: 0.01, width: FWw(2.1), until: T_Z0 + 1.0 });
[["s1", [1500, 785]], ["s2", [1497, 835]]].forEach(([id, p]) => unitS(id, "carth", p, "infantry", null, { t: 0, size: "XXX" }));
unitS("h2", "carth", [1660, 900], "infantry", "HANCOCK", { t: T_HAN - 0.2, size: "XXX" }); B.move("h2", T_HAN, 3.2, 1500, 900);
pinPortrait("h2", PHOTO("hancock"), FL.us, "Hancock", T_HAN + 0.1, null, true, "right");
unitS("pr", "rome", [1445, 820], "infantry", null, { t: 0, size: "X" });
const VET = [["v1", [1455, 770]], ["v2", [1450, 830]], ["v3", [1440, 890]], ["v4", [1425, 950]]];
VET.forEach(([id, p], k) => { unitS(id, "rome", G.LEE_S[0], "infantry", null, { t: T_VET - 0.3 + k * 0.4, size: "XXX" });
  along(id, [...G.LEE_S, p], T_VET - 0.2 + k * 0.4, 5.0, 22); });
pinPortrait("v1", PHOTO("lee"), FL.cs, "Lee", T_GONE + 0.3, null, true, "left");   // once v1 has arrived (not cropped at the top edge) and the casualty card has left
[0, 1].forEach((k) => trailArw(G.LEE_S.map((q) => [q[0] + (k ? 26 : -20), q[1]]), "rome", T_VET - 0.2 + k * 0.5, 2.6, 1.6, 7));
// the assaults of the 16th-18th break on the line (visible guns, powder smoke, ink crosses where they broke)
[[1560, 790], [1560, 850], [1550, 910]].forEach((p, k) => { const t = T_18 + 0.4 + k * 1.1;
  arw({ pts: [p, [p[0] - 50, p[1] + 2], [p[0] - 78, p[1] + 4]], side: "carth", t, dur: 0.8, width: AW(2.1, 8), until: t + 1.6 }); });
shoot([1452, 790], [1490, 792], T_18 + 0.9, { r: 4, width: 0.6, dur: 0.5, h: 6 });
shoot([1446, 860], [1484, 866], T_18 + 2.0, { r: 4, width: 0.6, dur: 0.5, h: 6 });
shoot([1438, 915], [1478, 916], T_18 + 3.1, { r: 4, width: 0.6, dur: 0.5, h: 6 });
smoke([[1456, 788], [1450, 858], [1442, 913]], T_18 + 0.8, 1.2);
crosses([[1484, 790], [1490, 796], [1480, 866], [1487, 860], [1475, 915], [1482, 920]], T_18 + 1.4, T_EVEN, 4.5);
// casualty card (K.casualties, real numbers only: ~11,400 Union, 15-18 Jun; the Confederate loss is not spoken -> Union column only)
{ const CC = casualty({ head: "FOUR DAYS OF ASSAULTS", rows: [["", "~11,400"]], single: true, foot: "MEN LOST", t: T_LOST - 0.1, until: T_LOST + 3.3, top: 36 });   // top band, off the battle
  const inner = CC.firstElementChild; inner.style.background = "rgba(18,16,12,0.97)"; const hd = inner.firstElementChild; gsap.set(hd, { opacity: 0 }); tl.to(hd, { opacity: 1, duration: 0.3 }, T_FOUR); }
trench(NL.map((q) => [q[0] + 7, q[1]]), T_GONE - 0.2, 2.0, T_Z0 + 1.0, { s: 2.0 }); trench(NL.map((q) => [q[0] - 7, q[1]]), T_GONE, 2.0, T_Z0 + 1.0, { s: 2.0 });
stampP("THE CHANCE WAS GONE", 1590, 990, T_GONE + 0.1, T_GONE + 2.4, 26);
// Grant is not on this map: corner badge (<= 3.5 s), then his later verdict (indirect speech in the script -> no quote marks)
const GB = badge({ name: "ULYSSES S. GRANT", role: "YEARS LATER", initials: "USG", photo: PHOTO("grant"), flag: FL.us, side: "carth", corner: "tr", t: T_GONE + 2.5, until: T_EASY - 0.5 });
const PET = town("Petersburg", G.PETERSBURG, T_EASY - 1.2, "l");
focus(G.PETERSBURG, 50, T_EASY - 1.0, T_EVEN);
quote("PETERSBURG COULD HAVE BEEN EASILY CAPTURED AT THAT TIME", "GRANT WROTE YEARS LATER", T_EASY - 0.3, T_EVEN + 0.2, { col: "#1f4fc4", size: 40 });
// ---------- m3-7: the zoom-out. The army across the James (the whole move as a thin solid trail), the siege lines grow, more than nine months ----------
hideU(["s1", "s2", "h2", "pr", "v1", "v2", "v3", "v4"], T_Z1 - 1.5);
arw({ pts: G.MOVE, side: "carth", t: T_ACROSS - 0.4, dur: 3.0, width: AW(0.55, 7), until: T_ACROSS + 4.6 });
inkTrace([[2347, 657], [2329, 679]], T_ACROSS + 0.4, T_ACROSS + 3.4, 4);
curveLabel("James River", G.JAMES.slice(9, 13).map((q) => [q[0], q[1] - 34]), T_ACROSS + 0.2, T_ACROSS + 3.4, 22);
const W5 = FWw(0.55);
frontS({ pts: G.SIEGE_N, sideA: "carth", sideB: "rome", t: T_PIN, dur: 2.0, width: W5, until: END + 1 });
frontS({ pts: G.HOWLETT, sideA: "carth", sideB: "rome", t: T_PIN + 0.4, dur: 1.6, width: W5, until: END + 1 });
frontS({ pts: [...NL, ...G.SIEGE_S.slice(1)], sideA: "carth", sideB: "rome", t: T_PIN + 0.6, dur: 3.0, width: W5, until: END + 1 });
numCard("A SIEGE", "MORE THAN NINE MONTHS", "", "left:0;right:0;top:250px;display:flex;justify-content:center;", T_NINE - 0.1, T_ABAN - 0.6, { col: "#c4121f", lc: "#ff8a80" });
town("Richmond", G.RICHMOND, T_RICHN + 0.05, "l");
focus([(G.RICHMOND[0] + G.PETERSBURG[0]) / 2, (G.RICHMOND[1] + G.PETERSBURG[1]) / 2], 640, T_ABAN + 0.2, T_STALE - 0.4);
// method card on the spoken words of m3-7 (each move ends on its result card + method card)
GG.METHOD_TITLE = "GRANT'S METHOD";
GG.METHOD = ["OUT OF A STALEMATE", "OVER A RIVER", "WHERE LEE COULD NOT FOLLOW"];   // spoken words only (m3-7)
GG.method(3, T_STALE - 0.3, END + 1, [T_STALE, T_RIVER, T_FOLLOW]);
declutter([GB], [[T_LOST - 0.1, T_LOST + 3.3], [T_EASY - 0.3, T_EVEN + 0.2], [T_NINE - 0.1, T_ABAN - 0.6], [T_STALE - 0.3, END + 1]]);
fixImgs();
B.finish();
