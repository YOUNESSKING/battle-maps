// m3b (m3-3..m3-4), Grant #16: the James crossing, 14 Jun 1864. Wide (option 1, 14 JUN) -> push in (colours dissolve ~2.8 s, option 2 close-up):
// the first troops ferried across at Wilcox's Landing; at Weyanoke the engineers build the bridge, 101 pontoons, ~2,100 ft, up to 90 ft of water,
// 4 PM -> 11 PM (clock), ready. m3-4: ~115,000 men (Grant's count) cross with guns and wagons; zoom out (colours back ~2.2 s): Lee near Richmond,
// guessed Petersburg on the 14th but kept his army north of the river; 16th still asking; 17th the wire to Beauregard (verbatim card).
// NOTE: Weyanoke is DOWNstream of Wilcox's Landing (the script says "Upriver"); nothing on screen says up/down river.
// Basemap jamesriver_hd_lift (z12, v11; preview ghx_jam until baked). Built with: python3 tools/m3_build.py m3b jamesriver m3-3 m3-4
window.M3_BASE = "jamesriver_hd_lift";
const GEO = {"ric":{"RICHMOND":[1391.4,837.8],"COLD_HARBOR":[1451.5,814.7],"PETERSBURG":[1403.8,981.1],"CITY_POINT":[1449.7,942.2],"BERMUDA_HUNDRED":[1450.8,929.4],"DREWRYS_BLUFF":[1395.4,891.3],"WILCOX_LDG":[1512.7,939.9],"WEYANOKE":[1526.3,952.0],"FT_POWHATAN":[1521.0,961.4],"CHARLES_CITY_CH":[1523.6,928.4],"TREVILIAN":[1158.0,604.5],"LONG_BRIDGE":[1488.3,878.5],"RIDDELLS_SHOP":[1459.1,892.2],"WHITE_HOUSE":[1550.2,823.9],"JONES_BRIDGE":[1539.2,905.5],"CHAFFINS_BLUFF":[1419.1,902.3],"MALVERN_HILL":[1459.5,898.2],"PRINCE_GEORGE_CH":[1445.3,984.3],"WASHINGTON":[1536.7,204.5],"APPOMATTOX":[896.3,912.9],"FREDERICKSBURG":[1382.3,485.9],"VICKSBURG":[-3502.6,3143.8],"MEMPHIS":[-3200.8,1918.8],"NEW_ORLEANS":[-3208.9,4165.7],"PORT_HUDSON":[-3645.4,3854.0],"BATON_ROUGE":[-3615.2,3954.8],"JACKSON":[-3250.3,3167.0],"GRAND_GULF":[-3565.3,3282.6],"BRUINSBURG":[-3603.5,3313.5],"FORT_DONELSON":[-2402.8,1315.3],"FORT_HENRY":[-2465.7,1305.6],"NASHVILLE":[-2011.2,1464.8],"CAIRO":[-2883.2,1082.7],"BATT_5":[1420.2,974.4],"BATT_3":[1419.4,971.0],"BATT_11":[1421.6,983.4],"BATT_9":[1420.7,979.7],"BATT_7":[1420.5,976.9],"BATT_15":[1419.1,989.3],"BAYLORS_FARM":[1430.0,960.9],"HANOVER":[1415.4,734.6],"WINDMILL":[1525.4,957.3],"WEY_PT":[1526.1,952.7],"MILLIKENS":[-3576.2,3110.4],"PORT_GIBSON":[-3539.8,3312.6],"DIMM_C":[1420.5,976.9],"CHICK":[[1360.8,792.2],[1393.6,810.5],[1419.1,824.3],[1440.9,835.8],[1459.1,851.9],[1477.3,870.2],[1488.3,878.5],[1510.1,893.2],[1532.0,911.5],[1557.4,934.4],[1579.3,961.9],[1595.7,977.9]],"JAMES":[[1390.0,842.7],[1397.2,865.6],[1397.2,888.6],[1415.4,902.3],[1430.0,906.9],[1444.6,911.5],[1444.6,920.7],[1455.5,929.8],[1451.9,943.5],[1477.3,941.3],[1506.5,939.0],[1517.4,941.3],[1522.8,952.7],[1532.0,957.3],[1550.2,966.4],[1579.3,975.6],[1623.0,984.7],[1677.6,1016.7]],"APPOM":[[1386.3,980.2],[1404.5,979.2],[1419.1,973.3],[1430.0,961.9],[1440.9,948.1],[1450.0,943.5]],"PAMUNKEY":[[1466.4,750.7],[1502.8,783.0],[1550.2,824.3],[1623.0,842.7]],"CH_FRONT":[[1440.2,792.2],[1443.8,803.6],[1445.7,812.8],[1444.6,820.6],[1440.9,829.8]],"RR_RP":[[1391.8,840.4],[1393.6,893.2],[1400.9,939.0],[1403.1,977.4]],"RR_SS":[[1400.9,981.1],[1349.9,993.9],[1277.1,1003.0],[1113.2,971.0]],"RR_W":[[1404.5,982.4],[1404.5,1016.7],[1397.2,1085.2],[1386.3,1176.2]],"RR_NP":[[1408.2,981.1],[1459.1,1003.0],[1550.2,1085.2],[1695.8,1130.7]],"RR_CP":[[1408.2,977.9],[1430.0,961.9],[1448.2,943.5]],"SHERIDAN":[[1477.3,764.6],[1411.8,718.5],[1339.0,672.4],[1240.7,630.8],[1158.0,604.5]],"HAMPTON":[[1393.6,796.8],[1331.7,741.5],[1240.7,672.4],[1171.5,617.0]],"WARREN":[[1457.3,822.0],[1470.1,847.3],[1482.8,870.2],[1488.3,878.5],[1473.7,884.0],[1461.0,890.9]],"MARCH1":[[1453.7,815.1],[1488.3,842.7],[1513.7,870.2],[1539.2,905.5],[1523.6,928.4],[1513.7,939.0]],"MARCH2":[[1457.3,819.7],[1481.0,856.5],[1490.1,878.5],[1502.8,902.3],[1510.1,925.2],[1511.6,938.1]],"DIMMOCK":[[1416.2,967.3],[1419.4,971.0],[1420.2,974.2],[1420.5,976.9],[1420.7,979.7],[1421.6,983.4],[1420.2,987.0],[1417.3,991.6],[1411.8,996.2],[1404.5,998.4],[1393.6,996.2],[1386.3,989.3],[1384.5,980.2]],"BREACH":[[1419.4,971.0],[1420.2,974.2],[1420.5,976.9],[1420.7,979.7],[1421.6,983.4]],"NEWLINE":[[1414.7,967.8],[1415.8,972.4],[1416.5,977.4],[1415.8,982.4],[1414.0,988.4],[1411.4,993.9],[1408.9,998.4]],"CPROAD":[[1450.0,943.5],[1439.1,952.7],[1430.0,960.9],[1424.2,967.3],[1422.0,971.0]],"LEE_S":[[1419.1,893.2],[1410.0,902.3],[1404.5,916.1],[1400.9,934.4],[1400.9,957.3],[1404.5,973.3]],"HOWLETT":[[1424.5,909.2],[1422.7,920.7],[1422.0,934.4],[1422.7,943.5]],"SIEGE_N":[[1430.0,842.7],[1430.0,870.2],[1426.4,888.6],[1422.7,902.3]],"SIEGE_S":[[1408.2,998.4],[1397.2,1007.6],[1379.0,1012.1],[1360.8,1007.6]],"MOVE":[[1453.7,815.1],[1513.7,870.2],[1523.6,928.4],[1525.8,948.1],[1525.4,955.0],[1513.7,961.9],[1477.3,966.4],[1440.9,971.0],[1420.9,973.3]],"VKS":[[-3576.2,3110.4],[-3619.9,3188.0],[-3627.2,3252.5],[-3590.8,3304.1],[-3603.5,3313.5],[-3539.8,3312.6],[-3456.1,3243.9],[-3335.9,3183.7],[-3248.5,3166.5],[-3376.0,3157.8],[-3503.4,3144.9]],"MISS_R":[[-3204.8,1918.6],[-3397.8,2193.6],[-3583.5,2471.0],[-3568.9,2685.4],[-3609.0,2950.5],[-3510.7,3144.9],[-3619.9,3316.9],[-3692.7,3483.9],[-3645.4,3854.0],[-3616.3,3955.4],[-3208.5,4166.1]]},"jam":{"RICHMOND":[316.3,-72.8],"COLD_HARBOR":[796.9,-257.6],"PETERSBURG":[415.6,1073.9],"CITY_POINT":[782.3,762.4],"BERMUDA_HUNDRED":[791.1,659.8],"DREWRYS_BLUFF":[348.3,355.6],"WILCOX_LDG":[1286.2,744.1],"WEYANOKE":[1395.5,841.1],"FT_POWHATAN":[1353.2,916.2],"CHARLES_CITY_CH":[1373.6,652.5],"TREVILIAN":[-1550.7,-1939.0],"LONG_BRIDGE":[1091.1,252.9],"RIDDELLS_SHOP":[858.1,362.9],"WHITE_HOUSE":[1586.2,-184.1],"JONES_BRIDGE":[1498.9,469.3],"CHAFFINS_BLUFF":[537.7,443.6],"MALVERN_HILL":[861.0,410.6],"PRINCE_GEORGE_CH":[747.4,1099.1],"WASHINGTON":[1478.5,-5138.8],"APPOMATTOX":[-3645.0,527.9],"FREDERICKSBURG":[243.5,-2887.5],"VICKSBURG":[-38836.1,18375.4],"MEMPHIS":[-36421.7,8575.6],"NEW_ORLEANS":[-36485.8,26550.2],"PORT_HUDSON":[-39978.1,24056.6],"BATON_ROUGE":[-39736.7,24863.5],"JACKSON":[-36817.3,18560.8],"GRAND_GULF":[-39337.3,19485.7],"BRUINSBURG":[-39643.2,19733.0],"FORT_DONELSON":[-30037.1,3747.5],"FORT_HENRY":[-30541.0,3669.6],"NASHVILLE":[-26904.7,4943.5],"CAIRO":[-33880.4,1887.0],"BATT_5":[546.4,1020.5],"BATT_3":[540.6,993.0],"BATT_11":[558.1,1091.8],"BATT_9":[550.8,1062.5],"BATT_7":[549.3,1040.6],"BATT_15":[537.7,1139.4],"BAYLORS_FARM":[625.0,912.5],"HANOVER":[508.5,-897.9],"WINDMILL":[1388.2,883.2],"WEY_PT":[1394.0,846.6],"MILLIKENS":[-39424.7,18108.4],"PORT_GIBSON":[-39133.5,19726.1],"DIMM_C":[549.3,1040.6],"CHICK":[[71.6,-437.8],[333.8,-290.7],[537.7,-180.4],[712.4,-88.6],[858.1,40.0],[1003.7,186.8],[1091.1,252.9],[1265.8,370.3],[1440.6,516.9],[1644.5,700.1],[1819.3,919.8],[1950.3,1047.9]],"JAMES":[[304.7,-33.5],[362.9,150.1],[362.9,333.6],[508.5,443.6],[625.0,480.3],[741.6,516.9],[741.6,590.2],[828.9,663.5],[799.8,773.4],[1003.7,755.1],[1236.7,736.8],[1324.1,755.1],[1367.8,846.6],[1440.6,883.2],[1586.2,956.4],[1819.3,1029.6],[2168.8,1102.8],[2605.7,1358.7]],"APPOM":[[275.5,1066.2],[421.2,1058.9],[537.7,1011.3],[625.0,919.8],[712.4,810.0],[785.2,773.4]],"PAMUNKEY":[[916.3,-769.0],[1207.6,-511.3],[1586.2,-180.4],[2168.8,-33.5]],"CH_FRONT":[[706.6,-437.8],[735.7,-345.8],[750.3,-272.3],[741.6,-209.8],[712.4,-136.3]],"RR_RP":[[319.2,-51.8],[333.8,370.3],[392.0,736.8],[409.5,1044.3]],"RR_SS":[[392.0,1073.5],[-15.7,1175.9],[-598.3,1249.1],[-1909.0,993.0]],"RR_W":[[421.2,1084.5],[421.2,1358.7],[362.9,1906.3],[275.5,2634.8]],"RR_NP":[[450.3,1073.5],[858.1,1249.1],[1586.2,1906.3],[2751.3,2270.8]],"RR_CP":[[450.3,1047.9],[625.0,919.8],[770.7,773.4]],"SHERIDAN":[[1003.7,-658.6],[479.4,-1026.9],[-103.1,-1395.8],[-889.6,-1728.2],[-1550.7,-1939.0]],"HAMPTON":[[333.8,-401.0],[-161.4,-842.7],[-889.6,-1395.8],[-1443.0,-1839.1]],"WARREN":[[843.5,-198.8],[945.4,3.3],[1047.4,186.8],[1091.1,252.9],[974.6,296.9],[872.6,351.9]],"MARCH1":[[814.4,-253.9],[1091.1,-33.5],[1295.0,186.8],[1498.9,469.3],[1373.6,652.5],[1295.0,736.8]],"MARCH2":[[843.5,-217.2],[1032.8,76.7],[1105.6,252.9],[1207.6,443.6],[1265.8,626.9],[1277.5,729.4]],"DIMMOCK":[[514.4,963.8],[540.6,993.0],[546.4,1018.6],[549.3,1040.6],[550.8,1062.5],[558.1,1091.8],[546.4,1121.1],[523.1,1157.6],[479.4,1194.2],[421.2,1212.5],[333.8,1194.2],[275.5,1139.4],[261.0,1066.2]],"BREACH":[[540.6,993.0],[546.4,1018.6],[549.3,1040.6],[550.8,1062.5],[558.1,1091.8]],"NEWLINE":[[502.7,967.4],[511.5,1004.0],[517.3,1044.3],[511.5,1084.5],[496.9,1132.0],[476.5,1175.9],[456.1,1212.5]],"CPROAD":[[785.2,773.4],[697.9,846.6],[625.0,912.5],[578.4,963.8],[561.0,993.0]],"LEE_S":[[537.7,370.3],[464.9,443.6],[421.2,553.6],[392.0,700.1],[392.0,883.2],[421.2,1011.3]],"HOWLETT":[[581.4,498.6],[566.8,590.2],[561.0,700.1],[566.8,773.4]],"SIEGE_N":[[625.0,-33.5],[625.0,186.8],[595.9,333.6],[566.8,443.6]],"SIEGE_S":[[450.3,1212.5],[362.9,1285.6],[217.3,1322.2],[71.6,1285.6]],"MOVE":[[814.4,-253.9],[1295.0,186.8],[1373.6,652.5],[1391.1,810.0],[1388.2,864.9],[1295.0,919.8],[1003.7,956.4],[712.4,993.0],[552.2,1011.3]],"VKS":[[-39424.7,18108.4],[-39774.3,18728.9],[-39832.5,19245.1],[-39541.2,19657.4],[-39643.2,19733.0],[-39133.5,19726.1],[-38463.5,19176.3],[-37502.3,18694.5],[-36803.3,18556.7],[-37822.7,18487.7],[-38842.2,18384.3]],"MISS_R":[[-36453.8,8573.8],[-37997.5,10774.1],[-39483.0,12993.2],[-39366.5,14707.8],[-39686.9,16828.9],[-38900.4,18384.3],[-39774.3,19760.4],[-40356.8,21096.4],[-39978.1,24056.6],[-39745.1,24868.5],[-36482.9,26553.6]]},"pet":{"RICHMOND":[1277.3,-291.8],"COLD_HARBOR":[1757.9,-476.6],"PETERSBURG":[1376.6,854.9],"CITY_POINT":[1743.3,543.4],"BERMUDA_HUNDRED":[1752.1,440.8],"DREWRYS_BLUFF":[1309.3,136.6],"WILCOX_LDG":[2247.2,525.1],"WEYANOKE":[2356.5,622.1],"FT_POWHATAN":[2314.2,697.2],"CHARLES_CITY_CH":[2334.6,433.5],"TREVILIAN":[-589.7,-2158.0],"LONG_BRIDGE":[2052.1,33.9],"RIDDELLS_SHOP":[1819.1,143.9],"WHITE_HOUSE":[2547.2,-403.1],"JONES_BRIDGE":[2459.9,250.3],"CHAFFINS_BLUFF":[1498.7,224.6],"MALVERN_HILL":[1822.0,191.6],"PRINCE_GEORGE_CH":[1708.4,880.1],"WASHINGTON":[2439.5,-5357.8],"APPOMATTOX":[-2684.0,308.9],"FREDERICKSBURG":[1204.5,-3106.5],"VICKSBURG":[-37875.1,18156.4],"MEMPHIS":[-35460.7,8356.6],"NEW_ORLEANS":[-35524.8,26331.2],"PORT_HUDSON":[-39017.1,23837.6],"BATON_ROUGE":[-38775.7,24644.5],"JACKSON":[-35856.3,18341.8],"GRAND_GULF":[-38376.3,19266.7],"BRUINSBURG":[-38682.2,19514.0],"FORT_DONELSON":[-29076.1,3528.5],"FORT_HENRY":[-29580.0,3450.6],"NASHVILLE":[-25943.7,4724.5],"CAIRO":[-32919.4,1668.0],"BATT_5":[1507.4,801.5],"BATT_3":[1501.6,774.0],"BATT_11":[1519.1,872.8],"BATT_9":[1511.8,843.5],"BATT_7":[1510.3,821.6],"BATT_15":[1498.7,920.4],"BAYLORS_FARM":[1586.0,693.5],"HANOVER":[1469.5,-1116.9],"WINDMILL":[2349.2,664.2],"WEY_PT":[2355.0,627.6],"MILLIKENS":[-38463.7,17889.4],"PORT_GIBSON":[-38172.5,19507.1],"DIMM_C":[1510.3,821.6],"CHICK":[[1032.6,-656.8],[1294.8,-509.7],[1498.7,-399.4],[1673.4,-307.6],[1819.1,-179.0],[1964.7,-32.2],[2052.1,33.9],[2226.8,151.3],[2401.6,297.9],[2605.5,481.1],[2780.3,700.8],[2911.3,828.9]],"JAMES":[[1265.7,-252.5],[1323.9,-68.9],[1323.9,114.6],[1469.5,224.6],[1586.0,261.3],[1702.6,297.9],[1702.6,371.2],[1789.9,444.5],[1760.8,554.4],[1964.7,536.1],[2197.7,517.8],[2285.1,536.1],[2328.8,627.6],[2401.6,664.2],[2547.2,737.4],[2780.3,810.6],[3129.8,883.8],[3566.7,1139.7]],"APPOM":[[1236.5,847.2],[1382.2,839.9],[1498.7,792.3],[1586.0,700.8],[1673.4,591.0],[1746.2,554.4]],"PAMUNKEY":[[1877.3,-988.0],[2168.6,-730.3],[2547.2,-399.4],[3129.8,-252.5]],"CH_FRONT":[[1667.6,-656.8],[1696.7,-564.8],[1711.3,-491.3],[1702.6,-428.8],[1673.4,-355.3]],"RR_RP":[[1280.2,-270.8],[1294.8,151.3],[1353.0,517.8],[1370.5,825.3]],"RR_SS":[[1353.0,854.5],[945.3,956.9],[362.7,1030.1],[-948.0,774.0]],"RR_W":[[1382.2,865.5],[1382.2,1139.7],[1323.9,1687.3],[1236.5,2415.8]],"RR_NP":[[1411.3,854.5],[1819.1,1030.1],[2547.2,1687.3],[3712.3,2051.8]],"RR_CP":[[1411.3,828.9],[1586.0,700.8],[1731.7,554.4]],"SHERIDAN":[[1964.7,-877.6],[1440.4,-1245.9],[857.9,-1614.8],[71.4,-1947.2],[-589.7,-2158.0]],"HAMPTON":[[1294.8,-620.0],[799.6,-1061.7],[71.4,-1614.8],[-482.0,-2058.1]],"WARREN":[[1804.5,-417.8],[1906.4,-215.7],[2008.4,-32.2],[2052.1,33.9],[1935.6,77.9],[1833.6,132.9]],"MARCH1":[[1775.4,-472.9],[2052.1,-252.5],[2256.0,-32.2],[2459.9,250.3],[2334.6,433.5],[2256.0,517.8]],"MARCH2":[[1804.5,-436.2],[1993.8,-142.3],[2066.6,33.9],[2168.6,224.6],[2226.8,407.9],[2238.5,510.4]],"DIMMOCK":[[1475.4,744.8],[1501.6,774.0],[1507.4,799.6],[1510.3,821.6],[1511.8,843.5],[1519.1,872.8],[1507.4,902.1],[1484.1,938.6],[1440.4,975.2],[1382.2,993.5],[1294.8,975.2],[1236.5,920.4],[1222.0,847.2]],"BREACH":[[1501.6,774.0],[1507.4,799.6],[1510.3,821.6],[1511.8,843.5],[1519.1,872.8]],"NEWLINE":[[1463.7,748.4],[1472.5,785.0],[1478.3,825.3],[1472.5,865.5],[1457.9,913.0],[1437.5,956.9],[1417.1,993.5]],"CPROAD":[[1746.2,554.4],[1658.9,627.6],[1586.0,693.5],[1539.4,744.8],[1522.0,774.0]],"LEE_S":[[1498.7,151.3],[1425.9,224.6],[1382.2,334.6],[1353.0,481.1],[1353.0,664.2],[1382.2,792.3]],"HOWLETT":[[1542.4,279.6],[1527.8,371.2],[1522.0,481.1],[1527.8,554.4]],"SIEGE_N":[[1586.0,-252.5],[1586.0,-32.2],[1556.9,114.6],[1527.8,224.6]],"SIEGE_S":[[1411.3,993.5],[1323.9,1066.6],[1178.3,1103.2],[1032.6,1066.6]],"MOVE":[[1775.4,-472.9],[2256.0,-32.2],[2334.6,433.5],[2352.1,591.0],[2349.2,645.9],[2256.0,700.8],[1964.7,737.4],[1673.4,774.0],[1513.2,792.3]],"VKS":[[-38463.7,17889.4],[-38813.3,18509.9],[-38871.5,19026.1],[-38580.2,19438.4],[-38682.2,19514.0],[-38172.5,19507.1],[-37502.5,18957.3],[-36541.3,18475.5],[-35842.3,18337.7],[-36861.7,18268.7],[-37881.2,18165.3]],"MISS_R":[[-35492.8,8354.8],[-37036.5,10555.1],[-38522.0,12774.2],[-38405.5,14488.8],[-38725.9,16609.9],[-37939.4,18165.3],[-38813.3,19541.4],[-39395.8,20877.4],[-39017.1,23837.6],[-38784.1,24649.5],[-35521.9,26334.6]]},"mis":{"RICHMOND":[3873.2,-202.1],"COLD_HARBOR":[3903.2,-213.7],"PETERSBURG":[3879.4,-130.4],"CITY_POINT":[3902.3,-149.9],"BERMUDA_HUNDRED":[3902.9,-156.3],"DREWRYS_BLUFF":[3875.2,-175.3],"WILCOX_LDG":[3933.8,-151.1],"WEYANOKE":[3940.7,-145.0],"FT_POWHATAN":[3938.0,-140.3],"CHARLES_CITY_CH":[3939.3,-156.8],"TREVILIAN":[3756.5,-318.7],"LONG_BRIDGE":[3921.6,-181.8],"RIDDELLS_SHOP":[3907.1,-174.9],"WHITE_HOUSE":[3952.6,-209.1],"JONES_BRIDGE":[3947.1,-168.2],"CHAFFINS_BLUFF":[3887.0,-169.8],"MALVERN_HILL":[3907.2,-171.9],"PRINCE_GEORGE_CH":[3900.1,-128.9],"WASHINGTON":[3945.8,-518.7],"APPOMATTOX":[3625.6,-164.6],"FREDERICKSBURG":[3868.7,-378.0],"VICKSBURG":[1426.2,950.9],"MEMPHIS":[1577.1,338.4],"NEW_ORLEANS":[1573.1,1461.8],"PORT_HUDSON":[1354.8,1306.0],"BATON_ROUGE":[1369.9,1356.4],"JACKSON":[1552.4,962.5],"GRAND_GULF":[1394.9,1020.3],"BRUINSBURG":[1375.7,1035.7],"FORT_DONELSON":[1976.1,36.7],"FORT_HENRY":[1944.6,31.8],"NASHVILLE":[2171.9,111.4],"CAIRO":[1735.9,-79.6],"BATT_5":[3887.6,-133.8],"BATT_3":[3887.2,-135.5],"BATT_11":[3888.3,-129.3],"BATT_9":[3887.9,-131.2],"BATT_7":[3887.8,-132.5],"BATT_15":[3887.0,-126.4],"BAYLORS_FARM":[3892.5,-140.5],"HANOVER":[3885.2,-253.7],"WINDMILL":[3940.2,-142.4],"WEY_PT":[3940.6,-144.6],"MILLIKENS":[1389.4,934.2],"PORT_GIBSON":[1407.6,1035.3],"DIMM_C":[3887.8,-132.5],"CHICK":[[3857.9,-224.9],[3874.3,-215.7],[3887.0,-208.8],[3898.0,-203.1],[3907.1,-195.1],[3916.2,-185.9],[3921.6,-181.8],[3932.6,-174.4],[3943.5,-165.3],[3956.2,-153.8],[3967.1,-140.1],[3975.3,-132.1]],"JAMES":[[3872.5,-199.7],[3876.1,-188.2],[3876.1,-176.7],[3885.2,-169.8],[3892.5,-167.5],[3899.8,-165.3],[3899.8,-160.7],[3905.2,-156.1],[3903.4,-149.2],[3916.2,-150.4],[3930.7,-151.5],[3936.2,-150.4],[3938.9,-144.6],[3943.5,-142.4],[3952.6,-137.8],[3967.1,-133.2],[3989.0,-128.6],[4016.3,-112.6]],"APPOM":[[3870.7,-130.9],[3879.8,-131.4],[3887.0,-134.4],[3892.5,-140.1],[3898.0,-146.9],[3902.5,-149.2]],"PAMUNKEY":[[3910.7,-245.6],[3928.9,-229.5],[3952.6,-208.8],[3989.0,-199.7]],"CH_FRONT":[[3897.6,-224.9],[3899.4,-219.2],[3900.3,-214.6],[3899.8,-210.7],[3898.0,-206.1]],"RR_RP":[[3873.4,-200.8],[3874.3,-174.4],[3877.9,-151.5],[3879.0,-132.3]],"RR_SS":[[3877.9,-130.5],[3852.5,-124.1],[3816.0,-119.5],[3734.1,-135.5]],"RR_W":[[3879.8,-129.8],[3879.8,-112.6],[3876.1,-78.4],[3870.7,-32.9]],"RR_NP":[[3881.6,-130.5],[3907.1,-119.5],[3952.6,-78.4],[4025.4,-55.6]],"RR_CP":[[3881.6,-132.1],[3892.5,-140.1],[3901.6,-149.2]],"SHERIDAN":[[3916.2,-238.7],[3883.4,-261.7],[3847.0,-284.8],[3797.8,-305.6],[3756.5,-318.7]],"HAMPTON":[[3874.3,-222.6],[3843.4,-250.2],[3797.8,-284.8],[3763.3,-312.5]],"WARREN":[[3906.2,-210.0],[3912.5,-197.4],[3918.9,-185.9],[3921.6,-181.8],[3914.3,-179.0],[3908.0,-175.6]],"MARCH1":[[3904.3,-213.4],[3921.6,-199.7],[3934.4,-185.9],[3947.1,-168.2],[3939.3,-156.8],[3934.4,-151.5]],"MARCH2":[[3906.2,-211.1],[3918.0,-192.8],[3922.5,-181.8],[3928.9,-169.8],[3932.6,-158.4],[3933.3,-152.0]],"DIMMOCK":[[3885.6,-137.3],[3887.2,-135.5],[3887.6,-133.9],[3887.8,-132.5],[3887.9,-131.2],[3888.3,-129.3],[3887.6,-127.5],[3886.1,-125.2],[3883.4,-122.9],[3879.8,-121.8],[3874.3,-122.9],[3870.7,-126.4],[3869.7,-130.9]],"BREACH":[[3887.2,-135.5],[3887.6,-133.9],[3887.8,-132.5],[3887.9,-131.2],[3888.3,-129.3]],"NEWLINE":[[3884.9,-137.1],[3885.4,-134.8],[3885.8,-132.3],[3885.4,-129.8],[3884.5,-126.8],[3883.2,-124.1],[3881.9,-121.8]],"CPROAD":[[3902.5,-149.2],[3897.1,-144.6],[3892.5,-140.5],[3889.6,-137.3],[3888.5,-135.5]],"LEE_S":[[3887.0,-174.4],[3882.5,-169.8],[3879.8,-163.0],[3877.9,-153.8],[3877.9,-142.4],[3879.8,-134.4]],"HOWLETT":[[3889.8,-166.4],[3888.9,-160.7],[3888.5,-153.8],[3888.9,-149.2]],"SIEGE_N":[[3892.5,-199.7],[3892.5,-185.9],[3890.7,-176.7],[3888.9,-169.8]],"SIEGE_S":[[3881.6,-121.8],[3876.1,-117.2],[3867.0,-114.9],[3857.9,-117.2]],"MOVE":[[3904.3,-213.4],[3934.4,-185.9],[3939.3,-156.8],[3940.4,-146.9],[3940.2,-143.5],[3934.4,-140.1],[3916.2,-137.8],[3898.0,-135.5],[3888.0,-134.4]],"VKS":[[1389.4,934.2],[1367.5,973.0],[1363.9,1005.3],[1382.1,1031.0],[1375.7,1035.7],[1407.6,1035.3],[1449.5,1001.0],[1509.5,970.8],[1553.2,962.2],[1489.5,957.9],[1425.8,951.5]],"MISS_R":[[1575.1,338.3],[1478.6,475.8],[1385.8,614.5],[1393.0,721.7],[1373.0,854.2],[1422.2,951.5],[1367.5,1037.5],[1331.1,1121.0],[1354.8,1306.0],[1369.4,1356.7],[1573.3,1462.0]]},"ten":{"RICHMOND":[5250.4,426.8],"COLD_HARBOR":[5310.5,403.7],"PETERSBURG":[5262.8,570.1],"CITY_POINT":[5308.7,531.2],"BERMUDA_HUNDRED":[5309.8,518.4],"DREWRYS_BLUFF":[5254.4,480.3],"WILCOX_LDG":[5371.7,528.9],"WEYANOKE":[5385.3,541.0],"FT_POWHATAN":[5380.0,550.4],"CHARLES_CITY_CH":[5382.6,517.4],"TREVILIAN":[5017.0,193.5],"LONG_BRIDGE":[5347.3,467.5],"RIDDELLS_SHOP":[5318.1,481.2],"WHITE_HOUSE":[5409.2,412.9],"JONES_BRIDGE":[5398.2,494.5],"CHAFFINS_BLUFF":[5278.1,491.3],"MALVERN_HILL":[5318.5,487.2],"PRINCE_GEORGE_CH":[5304.3,573.3],"WASHINGTON":[5395.7,-206.5],"APPOMATTOX":[4755.3,501.9],"FREDERICKSBURG":[5241.3,74.9],"VICKSBURG":[356.4,2732.8],"MEMPHIS":[658.2,1507.8],"NEW_ORLEANS":[650.1,3754.7],"PORT_HUDSON":[213.6,3443.0],"BATON_ROUGE":[243.8,3543.8],"JACKSON":[608.7,2756.0],"GRAND_GULF":[293.7,2871.6],"BRUINSBURG":[255.5,2902.5],"FORT_DONELSON":[1456.2,904.3],"FORT_HENRY":[1393.3,894.6],"NASHVILLE":[1847.8,1053.8],"CAIRO":[975.8,671.7],"BATT_5":[5279.2,563.4],"BATT_3":[5278.4,560.0],"BATT_11":[5280.6,572.4],"BATT_9":[5279.7,568.7],"BATT_7":[5279.5,565.9],"BATT_15":[5278.1,578.3],"BAYLORS_FARM":[5289.0,549.9],"HANOVER":[5274.4,323.6],"WINDMILL":[5384.4,546.3],"WEY_PT":[5385.1,541.7],"MILLIKENS":[282.8,2699.4],"PORT_GIBSON":[319.2,2901.6],"DIMM_C":[5279.5,565.9],"CHICK":[[5219.8,381.2],[5252.6,399.5],[5278.1,413.3],[5299.9,424.8],[5318.1,440.9],[5336.3,459.2],[5347.3,467.5],[5369.1,482.2],[5391.0,500.5],[5416.4,523.4],[5438.3,550.9],[5454.7,566.9]],"JAMES":[[5249.0,431.7],[5256.2,454.6],[5256.2,477.6],[5274.4,491.3],[5289.0,495.9],[5303.6,500.5],[5303.6,509.7],[5314.5,518.8],[5310.9,532.5],[5336.3,530.3],[5365.5,528.0],[5376.4,530.3],[5381.8,541.7],[5391.0,546.3],[5409.2,555.4],[5438.3,564.6],[5482.0,573.7],[5536.6,605.7]],"APPOM":[[5245.3,569.2],[5263.5,568.2],[5278.1,562.3],[5289.0,550.9],[5299.9,537.1],[5309.0,532.5]],"PAMUNKEY":[[5325.4,339.7],[5361.8,372.0],[5409.2,413.3],[5482.0,431.7]],"CH_FRONT":[[5299.2,381.2],[5302.8,392.6],[5304.7,401.8],[5303.6,409.6],[5299.9,418.8]],"RR_RP":[[5250.8,429.4],[5252.6,482.2],[5259.9,528.0],[5262.1,566.4]],"RR_SS":[[5259.9,570.1],[5208.9,582.9],[5136.1,592.0],[4972.2,560.0]],"RR_W":[[5263.5,571.4],[5263.5,605.7],[5256.2,674.2],[5245.3,765.2]],"RR_NP":[[5267.2,570.1],[5318.1,592.0],[5409.2,674.2],[5554.8,719.7]],"RR_CP":[[5267.2,566.9],[5289.0,550.9],[5307.2,532.5]],"SHERIDAN":[[5336.3,353.6],[5270.8,307.5],[5198.0,261.4],[5099.7,219.8],[5017.0,193.5]],"HAMPTON":[[5252.6,385.8],[5190.7,330.5],[5099.7,261.4],[5030.5,206.0]],"WARREN":[[5316.3,411.0],[5329.1,436.3],[5341.8,459.2],[5347.3,467.5],[5332.7,473.0],[5320.0,479.9]],"MARCH1":[[5312.7,404.1],[5347.3,431.7],[5372.7,459.2],[5398.2,494.5],[5382.6,517.4],[5372.7,528.0]],"MARCH2":[[5316.3,408.7],[5340.0,445.5],[5349.1,467.5],[5361.8,491.3],[5369.1,514.2],[5370.6,527.1]],"DIMMOCK":[[5275.2,556.3],[5278.4,560.0],[5279.2,563.2],[5279.5,565.9],[5279.7,568.7],[5280.6,572.4],[5279.2,576.0],[5276.3,580.6],[5270.8,585.2],[5263.5,587.4],[5252.6,585.2],[5245.3,578.3],[5243.5,569.2]],"BREACH":[[5278.4,560.0],[5279.2,563.2],[5279.5,565.9],[5279.7,568.7],[5280.6,572.4]],"NEWLINE":[[5273.7,556.8],[5274.8,561.4],[5275.5,566.4],[5274.8,571.4],[5273.0,577.4],[5270.4,582.9],[5267.9,587.4]],"CPROAD":[[5309.0,532.5],[5298.1,541.7],[5289.0,549.9],[5283.2,556.3],[5281.0,560.0]],"LEE_S":[[5278.1,482.2],[5269.0,491.3],[5263.5,505.1],[5259.9,523.4],[5259.9,546.3],[5263.5,562.3]],"HOWLETT":[[5283.5,498.2],[5281.7,509.7],[5281.0,523.4],[5281.7,532.5]],"SIEGE_N":[[5289.0,431.7],[5289.0,459.2],[5285.4,477.6],[5281.7,491.3]],"SIEGE_S":[[5267.2,587.4],[5256.2,596.6],[5238.0,601.1],[5219.8,596.6]],"MOVE":[[5312.7,404.1],[5372.7,459.2],[5382.6,517.4],[5384.8,537.1],[5384.4,544.0],[5372.7,550.9],[5336.3,555.4],[5299.9,560.0],[5279.9,562.3]],"VKS":[[282.8,2699.4],[239.1,2777.0],[231.8,2841.5],[268.2,2893.1],[255.5,2902.5],[319.2,2901.6],[402.9,2832.9],[523.1,2772.7],[610.5,2755.5],[483.0,2746.8],[355.6,2733.9]],"MISS_R":[[654.2,1507.6],[461.2,1782.6],[275.5,2060.0],[290.1,2274.4],[250.0,2539.5],[348.3,2733.9],[239.1,2905.9],[166.3,3072.9],[213.6,3443.0],[242.7,3544.4],[650.5,3755.1]]},"box_ric_in_pet":[-9854,-6994,23040,12960]};
// @@KIT (Grant #16 move-1 scenes m1a-m1f; inlined into scenes-src/<scene>.js by tools/m1_build.py)
// Source: cleburne/scenes-src/move1e.js kit (sherman move1_kit + the 2026-10-29 approved layers) + templates/clean_screen_v11.js,
// sides for THIS video: Union (Grant) = hero = BLUE "carth"; Confederates = RED "rome". Flags A1: US 35-star (June 1864) + CSA First National.
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const FL = { us: "assets/media/us35_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = (n) => `assets/media/${n}_head.png`;
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg";
const tl = B.tl;
const WORLD = document.getElementById("world"), OVL = document.getElementById("overlay");
const LBL_LIFE = 3.5;   // clean screen v11: words on screen leave after ~3.5 s
{ const _cap0 = B.caption.bind(B); B.caption = (txt, t, until, ...r) => _cap0(txt, t, Math.min(until ?? 1e9, t + LBL_LIFE), ...r); }
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.2em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.55).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
// v11: the flag only, no country name under it
const flag = (src, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"></div>`, x, y, { t, pop: true, until });
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t > 0 ? o.t : null, label }); if (o.t != null && !(o.t > 0)) gsap.set(B.units[id].el, { autoAlpha: 1 });
  K.counter(id, { icon, flag: o.flag || (side === "carth" ? FL.us : FL.cs), size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1)); if (o.dash) ps[0].setAttribute("stroke-dasharray", o.dash);
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(1)); return g; };
// legend (UNION blue / CONFEDERACY red); opt2 = two short glowing lines instead of squares
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERACY"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
const sub = (pts, f0, f1, n = 16) => [...Array(n + 1)].map((_, k) => posOn(pts, f0 + (f1 - f0) * k / n));
// thin glowing shell trail (GG.arc's dark casing reads too heavy on close-ups); width in world px
const shellArc = (a, b, t, dur, o = {}) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, h = o.h != null ? o.h : L * 0.3;
  let nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L; if (ny > 0) { nx = -nx; ny = -ny; }
  const mx = (a[0] + b[0]) / 2 + nx * h, my = (a[1] + b[1]) / 2 + ny * h, w = o.width || 1.2, col = o.color || "#fff3c4";
  const p = document.createElementNS(NS, "path"); p.setAttribute("d", `M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`); p.setAttribute("fill", "none");
  p.setAttribute("stroke", col); p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.style.filter = `drop-shadow(0 0 ${w * 1.5}px ${col})`;
  document.getElementById("overlay").appendChild(p); const len = p.getTotalLength(), seg = Math.max(len * 0.35, 4);
  gsap.set(p, { strokeDasharray: `${seg} ${len + seg}`, strokeDashoffset: seg, opacity: 0 });
  tl.set(p, { opacity: 1 }, t); tl.to(p, { strokeDashoffset: -len, duration: dur, ease: "power1.in" }, t); tl.set(p, { opacity: 0 }, t + dur + 0.02); return p; };
// artillery / ship-gun shot: the gun fires (quiet), shell arc, the impact carries the boom + the locked shake (never switched off)
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 1.0;
  shellArc(from, to, t + 0.05, dur, { width: o.width || 1.2, h: o.h, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: 2 });
};
const badge = (o) => {   // K.badge + initials (shown if the photo file is missing)
  const el = K.badge(o); if (o.corner && o.corner[0] === "b") el.style.bottom = "215px"; const ring = el.querySelector("div[style*='border-radius:50%']"), img = ring.querySelector("img");
  if (img) { const ini = document.createElement("div"); ini.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.78) 0%, rgba(10,12,24,0.45) 100%);font-size:60px;font-weight:700;color:#f7f3ea;text-shadow:0 3px 6px #000";
    ini.textContent = o.initials || ""; ini.style.display = "none"; ring.insertBefore(ini, img); img.addEventListener("error", () => { img.style.display = "none"; ini.style.display = "flex"; }); }
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(1, Math.round(size / 9))}px solid ${c};padding:${(size * 0.1).toFixed(1)}px ${(size * 0.5).toFixed(1)}px ${(size * 0.14).toFixed(1)}px;background:rgba(14,12,10,0.78);box-shadow:0 ${size * 0.2}px ${size * 0.5}px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${(size * 0.34).toFixed(1)}px;letter-spacing:0.2em;color:#f7f3ea;margin-top:${size * 0.05}px">${sub}</div>` : ""}</div>`;
const badgeStamp = (el, txt, t, o = {}) => {   // grey a badge + slam a small stamp on it (WOUNDED)
  const ring = el.querySelector("div[style*='border-radius:50%']");
  if (o.grey !== false) tl.to(ring, { filter: "grayscale(1) brightness(0.6)", duration: 0.4 }, t);
  const st = document.createElement("div"); st.innerHTML = stampHTML(txt, o.color || "#e3232f", o.size || 30, -8);
  st.style.cssText = "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5";
  ring.appendChild(st); gsap.set(st, { autoAlpha: 0 });
  tl.fromTo(st, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.2); K.shake(t + 0.2, 3, 0.25); return st;
};
const glowPath = (pts, col, w, t, until, pulses = 3, op = 0.95, o = {}) => {   // glowing stroke (river, road, line)
  const p = document.createElementNS(NS, "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); p.style.filter = `drop-shadow(0 0 ${w}px ${col})`;
  if (o.dash) p.setAttribute("stroke-dasharray", o.dash);
  if (o.top) svg.appendChild(p); else svg.insertBefore(p, svg.firstChild); gsap.set(p, { opacity: 0 });
  if (o.draw) { let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
    gsap.set(p, { strokeDasharray: `${Lt} ${Lt + 10}`, strokeDashoffset: Lt }); tl.to(p, { strokeDashoffset: 0, duration: o.draw, ease: "power1.inOut" }, t); }
  tl.to(p, { opacity: op, duration: 0.5 }, t); if (pulses) tl.to(p, { opacity: op * 0.45, duration: 0.5, yoyo: true, repeat: pulses, ease: "sine.inOut" }, t + 0.5 + (o.draw || 0));
  if (until != null) tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const scr = (html, css, t, until, from = { autoAlpha: 0, y: 30 }) => {   // screen-space element (above the map, under the credit)
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);
  tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el;
};
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
const pinAlong = (el, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n); } };
const ticker = (label, to, suffix, css, t, dur, until, n = 8, o = {}) => {   // a counter that ticks up (screen space)
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    <div style="font-size:18px;letter-spacing:.3em;color:${o.col || "#c9b48a"}">${label}</div><div class="v" style="font-size:${o.vs || 54}px;letter-spacing:.04em">${o.pre || ""}0${suffix}</div>${o.sub ? `<div style="font-size:15px;letter-spacing:.22em;color:#a8a294">${o.sub}</div>` : ""}</div>`, css, t, until);
  const v = el.querySelector(".v"), st = { x: 0 };
  tl.to(st, { x: to, duration: dur, ease: "none", onUpdate: () => { v.textContent = (o.pre || "") + Math.round(st.x).toLocaleString("en-US") + suffix; } }, t + 0.2);
  for (let k = 0; k < n; k++) SFX("tick", t + 0.2 + (k * dur) / n);
  return el;
};
const mg = (a, b, t, n = 5, w = 1.1) => { SFX("mg", t);   // musket volley: tracer dashes (mg sound), sparingly
  for (let k = 0; k < n; k++) { const g = document.createElementNS(NS, "line"), j = ((k * 7) % 5 - 2) * 1.5 * w;
    g.setAttribute("x1", a[0]); g.setAttribute("y1", a[1]); g.setAttribute("x2", b[0] + j); g.setAttribute("y2", b[1] - j);
    g.setAttribute("stroke", "#ffe28a"); g.setAttribute("stroke-width", w); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-dasharray", `${3 * w} ${26 * w}`);
    g.style.filter = `drop-shadow(0 0 ${2 * w}px #ffb347)`; document.getElementById("overlay").appendChild(g); GG.hide(g);
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
const sstamp = (txt, top, t, o = {}) => { const el = scr(stampHTML(txt, o.color || "#e3232f", o.size || 60, o.rot || -5, o.sub), `left:0;right:0;top:${top}px;display:flex;justify-content:center;`, t, null, { autoAlpha: 0 }); return slam(el, t, o); };
const wstamp = (txt, x, y, t, until, c = "#e3232f", size = 9, sub) => { const el = GG.pin(stampHTML(txt, c, size, -6, sub), x, y, {});
  tl.fromTo(el, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
// quote card (screen space): verbatim quote + attribution (quote marks only for verbatim words)
const quote = (txt, who, t, until, o = {}) => scr(`<div style="max-width:${o.mw || 1280}px;padding:22px 46px 22px;background:rgba(18,16,12,0.93);border-left:8px solid ${o.col || "#1f4fc4"};font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:${o.size || 40}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div><div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div></div>`,
  `left:0;right:0;top:${o.top || 230}px;display:flex;justify-content:center;`, t, until);
const belief = (txt, subt, t, until, o = {}) => scr(`<div style="padding:16px 40px 18px;background:rgba(18,16,12,0.93);border-top:6px solid ${o.col || "#c4121f"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:17px;letter-spacing:.32em;color:${o.subc || "#ff8a80"}">${subt}</div><div style="font-size:${o.size || 46}px;letter-spacing:.08em;margin-top:4px">${txt}</div></div>`,
  `left:0;right:0;top:${o.top || 230}px;display:flex;justify-content:center;`, t, until);
const fixImgs = () => document.querySelectorAll("img").forEach((im) => { im.addEventListener("error", () => { im.style.display = "none"; }, { once: true }); });
const fireGlow = (x, y, r, t, until) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,90,.85) 0%,rgba(255,110,20,.55) 35%,rgba(200,40,0,.25) 60%,rgba(120,20,0,0) 75%);mix-blend-mode:screen"></div>`, x, y, { t, until });
  tl.to(el.firstElementChild, { scale: 1.15, opacity: 0.75, duration: 0.35, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 8) - t) / 0.35)), ease: "sine.inOut" }, t + 0.5); return el; };
const nightWash = (t, until, a = 0.5, dur = 1.2) => { const el = document.createElement("div"); el.style.cssText = `position:absolute;inset:0;background:rgba(6,10,26,${a});pointer-events:none`;
  document.getElementById("fx").appendChild(el); gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: dur }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 1.5 }, until); return el; };
const dawnWash = (t, until) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;inset:0;background:linear-gradient(to left, rgba(255,160,80,0.30), rgba(255,190,130,0.12) 55%, rgba(255,210,160,0.03));pointer-events:none;mix-blend-mode:soft-light";
  document.getElementById("fx").appendChild(el); gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: 2.0 }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 2.0 }, until); return el; };
// cavalry counter icon (owner-approved, sherman/scenes-src/cavalry_icon.js)
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
// K.front with its OWN blur filter (each front keeps the locked width 15 / glow 0.47 on screen at its own camera scale)
let __FID = 0;
const frontS = (o) => { const g = K.front(o), id = "m1blur" + (++__FID), f = document.createElementNS(NS, "filter"), ov = document.getElementById("overlay");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; ov.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`));
  if (!(o.t > 0)) { const ps = [...g.querySelectorAll("path")]; tl.getTweensOf(ps).filter((tw) => tw.startTime() < 0.05 && "strokeDashoffset" in tw.vars).forEach((tw) => tw.kill()); gsap.set(ps, { strokeDashoffset: 0 }); }
  return g; };
// ================= approved 2026-10-29 layers (A1 / A2 / E2), copied =================
const SCL = []; let CAM_S = 1;
const setInv = () => { const k = (1 / CAM_S).toFixed(4); SCL.forEach((el) => { el.style.transform = `scale(${k})`; }); };
const camera = (keys) => {
  const cam = { cx: keys[0][1], cy: keys[0][2], s: keys[0][3] }, clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const apply = () => { const s = Math.max(cam.s, 1920 / 2880), cx = clamp(cam.cx, 960 / s, 2880 - 960 / s), cy = clamp(cam.cy, 540 / s, 1620 - 540 / s);
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); };
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0);
};
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); return el; };
const pinS = (el) => { reg(el.firstElementChild); return el; };
const boxS = (txt, x, y, t, until, o = {}) => pinS(box(txt, x, y, t, o.size || 32, o.keep ? until : Math.min(until ?? 1e9, t + LBL_LIFE), o));   // v11: leaves after ~3.5 s
const flagS = (src, x, y, t, until, w = 104) => { const el = pinS(flag(src, x, y, t > 0 ? t : null, until, w)); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };
const wstampS = (txt, x, y, t, until, c, size = 22) => pinS(wstamp(txt, x, y, t, Math.min(until ?? 1e9, t + LBL_LIFE), c, size));
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
const ungreyU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "grayscale(0) brightness(1)", duration: 0.6 }, t));
const AW = (s, px = 13) => +(px / s).toFixed(2);       // arrow ~13 px on screen at camera scale s
const FWw = (s) => +(15 / s).toFixed(2);               // front width 15 on screen (wide)
const FWc = (s) => +(15 * 1.3 / s).toFixed(2);         // front width 15*1.3 on close-ups
const town = (nm, p, t, side = "r", o = {}) => { const lft = side === "l";   // A2 big-town label; v11: leaves after LBL_LIFE
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><div class="dt" style="position:absolute;left:-7px;top:-7px;width:14px;height:14px;border-radius:50%;background:#f0ece2;box-shadow:0 0 0 3px rgba(10,14,16,.75)"></div><div class="nm" style="position:absolute;top:-24px;${lft ? "right:16px" : "left:16px"};font-family:Oswald;font-weight:700;font-size:${o.size || 36}px;letter-spacing:.06em;color:#f0ece2;white-space:nowrap;text-shadow:0 0 6px #0a0e10,0 0 3px #0a0e10,0 2px 4px #000;transform-origin:${lft ? "100%" : "0%"} 50%">${nm}</div></div>`, p[0], p[1], { t });
  pinS(el); const nmEl = el.querySelector(".nm");
  if (o.keep !== true) tl.to(nmEl, { autoAlpha: 0, duration: 0.8 }, (o.life != null ? o.life : t + LBL_LIFE + 0.5));
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.6 }, o.until);
  return { el, shrink: (tt) => tl.to(nmEl, { scale: 0.5, opacity: 0.75, duration: 0.6 }, tt), grow: (tt) => tl.to(nmEl, { scale: 1, opacity: 1, duration: 0.6 }, tt) }; };
// v11 territory layer (option 1) with a cross-fade in and a smooth dissolve out (sine.inOut)
const terr = (file, t, until, dur = 1.0, outDur = dur) => { const el = document.createElement("img"); el.className = "wimg terr"; el.src = file; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "multiply" });
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: t > 0 ? 0 : 1 });
  if (t > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur, ease: "sine.inOut", immediateRender: false }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: outDur, ease: "sine.inOut" }, until); return el; };
// E2: ground about to be lost turns PALER first (to 40 % over ~1.3 s on the cue), then the winner's layer cross-fades in (~1 s)
const terrLoss = (before, after, cue, move, until) => {
  const A = terr(before, 0, null, 0.01);
  tl.to(A, { opacity: 0.4, duration: 1.3, ease: "sine.inOut" }, cue);
  const Bn = terr(after, move, until, 1.0, 2.2);
  tl.to(A, { autoAlpha: 0, duration: 1.0 }, move + 0.2); return [A, Bn]; };
// HUD declutter (STYLE_LOCK 1c rule 3): while a big card is up, the legend / corner badges step out via filter:opacity()
const declutter = (huds, wins) => {
  const M = []; wins.slice().sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { const L2 = M[M.length - 1]; if (L2 && a - L2[1] < 0.9) L2[1] = Math.max(L2[1], b); else M.push([a, b]); });
  huds.forEach((el) => { gsap.set(el, { filter: "opacity(1)" });
    M.forEach(([a, b]) => { tl.to(el, { filter: "opacity(0)", duration: 0.15, ease: "none", immediateRender: false }, a - 0.15); tl.to(el, { filter: "opacity(1)", duration: 0.3, ease: "none", immediateRender: false }, b + 0.3); }); });
};
// ---------- ships (top-down counters, drawn inline): Union ironclad / timberclad (blue), Confederate river steamer (red) ----------
const SHIPCOL = { carth: "#1f4fc4", rome: "#c4121f" };
const shipSVG = (kind, side, L) => { const c = SHIPCOL[side] || side, H = L * 0.34;
  const hull = kind === "steamer" ? `<path d="M6 7 L78 6 Q96 17 78 28 L6 27 Q2 17 6 7 Z" fill="#3a332a" stroke="${c}" stroke-width="3"/><rect x="18" y="10" width="44" height="14" rx="2" fill="#d9cfb8" stroke="#1a1712" stroke-width="1.4"/><rect x="2" y="9" width="8" height="16" fill="#5a4a36" stroke="#1a1712" stroke-width="1"/>`
    : kind === "timber" ? `<path d="M4 7 L80 6 Q97 17 80 28 L4 27 Z" fill="#4a3c2c" stroke="${c}" stroke-width="3.2"/><rect x="16" y="9" width="50" height="16" rx="2" fill="#7a654a" stroke="#1a1712" stroke-width="1.4"/>`
    : `<path d="M4 6 L80 4 L97 17 L80 30 L4 28 Z" fill="#2b3442" stroke="${c}" stroke-width="3.4"/><path d="M14 9 L70 8 L76 17 L70 26 L14 25 L10 17 Z" fill="#4a5564" stroke="#151a22" stroke-width="1.6"/><rect x="20" y="13" width="44" height="8" fill="#5c6878"/>`;
  return `<svg width="${L}" height="${H}" viewBox="0 0 100 34" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${L * 0.05}px ${c}) drop-shadow(0 ${L * 0.03}px ${L * 0.04}px rgba(0,0,0,.6))">
    ${hull}<circle cx="${kind === "steamer" ? 44 : 38}" cy="${kind === "steamer" ? 13 : 17}" r="3.6" fill="#111"/><circle cx="${kind === "steamer" ? 44 : 49}" cy="${kind === "steamer" ? 21 : 17}" r="3.6" fill="#111"/>
    <line x1="8" y1="17" x2="-6" y2="17" stroke="#f3eee2" stroke-width="1.6"/><path d="M-6 17 L-20 12 L-20 22 Z" fill="${c}" stroke="#f3eee2" stroke-width="1"/></svg>`; };
// ship(kind, side, p, ang, t, until, o): world-pinned, constant screen size (L px), heading ang (deg, 0 = east). Returns { el, rot, label }.
const ship = (kind, side, p, ang, t, until, o = {}) => {
  const L = o.L || 64;
  const el = GG.pin(`<div class="shs" style="position:relative;width:0;height:0"><div class="shr" style="position:absolute;left:${-L / 2}px;top:${-L * 0.17}px;width:${L}px;transform:rotate(${ang}deg);transform-origin:50% 50%">${shipSVG(kind, side, L)}</div>${o.name ? `<div class="shn" style="position:absolute;left:${o.nx != null ? o.nx : -60}px;top:${o.ny != null ? o.ny : L * 0.28}px;width:120px;text-align:center;font-family:Oswald;font-weight:700;font-size:${o.ns || 17}px;letter-spacing:.08em;color:#f7f3ea;white-space:nowrap;text-shadow:0 0 5px #000,0 1px 3px #000">${o.name}</div>` : ""}</div>`, p[0], p[1], { t, until, pop: o.pop });
  pinS(el); return { el, rot: el.querySelector(".shr"), name: el.querySelector(".shn"), L, side };
};
const sail = (s, pts, t, dur, n = 24, o = {}) => {   // move along a polyline, turning to the heading of each leg
  for (let k = 1; k <= n; k++) { const a = posOn(pts, (k - 1) / n), b = posOn(pts, k / n), tt = t + (k - 1) * dur / n;
    tl.to(s.el, { left: b[0], top: b[1], duration: dur / n, ease: "none" }, tt);
    if (!o.keepRot) tl.to(s.rot, { rotation: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI + (o.rev ? 180 : 0), duration: Math.min(0.4, dur / n), ease: "none" }, tt); } };
const stackSmoke = (p, t, until, every = 1.6) => { for (let tt = t; tt < until; tt += every) K.smoke(p[0], p[1], tt, { n: 2, r: 5, rise: 14, life: 2.0, alpha: 0.55 }); };
// small fort (star outline) world-pinned, constant screen size
const fortIcon = (p, t, until, o = {}) => { const s = o.s || 30, col = o.col || "#e3232f";
  return pinS(GG.pin(`<svg width="${s * 2}" height="${s * 2}" viewBox="-20 -20 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.18}px ${col})">
    <polygon points="0,-17 5,-6 17,-6 8,2 12,15 0,8 -12,15 -8,2 -17,-6 -5,-6" fill="rgba(60,10,10,.55)" stroke="${col}" stroke-width="3.2" stroke-linejoin="round"/></svg>`, p[0], p[1], { t, pop: true, until })); };
// a world-pinned mini flag on a pole (over a fort), constant size
const poleFlag = (src, p, t, until, w = 46) => pinS(GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-1.5px;top:${-w * 1.25}px;width:3px;height:${w * 1.25}px;background:#efe6cf;box-shadow:0 0 3px #000"></div><img src="${src}" style="position:absolute;left:1px;top:${-w * 1.25}px;width:${w}px;border:1px solid #1a1712;box-shadow:0 2px 5px rgba(0,0,0,.6)"></div>`, p[0], p[1], { t, pop: true, until }));
// mini commander chip (screen space): round photo + name, for naming several generals in a row without a big badge each
const chip = (key, name, side, css, t, until, o = {}) => { const c = SHIPCOL[side];
  const el = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:6px;font-family:Oswald;font-weight:700;color:#f7f3ea"><div class="ring" style="position:relative;width:${o.d || 110}px;height:${o.d || 110}px;border-radius:50%;overflow:hidden;border:4px solid #f3e7c4;box-shadow:0 0 0 3px ${c},0 8px 18px rgba(0,0,0,.6);background:url(${side === "carth" ? FL.us : FL.cs}) center/cover"><img src="${PHOTO(key)}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div><div style="padding:3px 12px;background:rgba(18,16,12,.9);border-bottom:4px solid ${c};font-size:${o.fs || 22}px;letter-spacing:.08em;white-space:nowrap">${name}</div></div>`, css, t, until, { autoAlpha: 0, y: 20 });
  SFX("ref:pop", t); return el; };
// already on screen at frame 0 (continuing scenes): kill the entry tween of a card/legend; dateNow = the date scroll already showing
const now = (el) => { tl.getTweensOf(el).filter((tw) => tw.startTime() < 0.05).forEach((tw) => tw.kill()); gsap.set(el, { autoAlpha: 1, y: 0, x: 0 }); return el; };
const dateNow = (text, until) => { const box = document.getElementById("date"); gsap.set(box, { autoAlpha: 1 });
  const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "34px"; box.appendChild(d);
  if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.35 }, until); return d; };
// ---------- end of kit ----------
// @@END-KIT
// @@KITX (move-3 agent additions, appended after tools/m1_kit.js by tools/m3_build.py; FL.us is the 35-star flag for June 1864)
// phrase lookup that never throws: first paragraph (of the scene) whose text has the phrase; null if none (the re-voiced ending may add a paragraph)
const atAny = (phrase, off = 0) => { for (const k of Object.keys(B.T.paras)) if (B.T.text[k].indexOf(phrase) >= 0) return at(k, phrase, off); return null; };
// another basemap (or a world-sized image) as a layer in the world, under the territory layers + overlay. box = [left, top, width, height] in world px
const extImg = (src, t, until, o = {}) => { const el = document.createElement("img"); el.className = "wimg ext"; el.src = src; el.alt = "";
  const [l, tp, w, h] = o.box || [0, 0, 2880, 1620];
  Object.assign(el.style, { position: "absolute", left: l + "px", top: tp + "px", width: w + "px", height: h + "px", maxWidth: "none" });
  if (o.mx) el.style.mixBlendMode = "multiply";
  if (o.under) WORLD.insertBefore(el, document.getElementById("relief")); else { const first = WORLD.querySelector(".terr"); WORLD.insertBefore(el, first || OVL); }
  gsap.set(el, { autoAlpha: t > 0 ? 0 : 1 }); if (t > 0) tl.to(el, { autoAlpha: 1, duration: o.dur || 1.0, ease: "sine.inOut" }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: o.outDur || o.dur || 1.0, ease: "sine.inOut" }, until); return el; };
// trench line: dark zig-zag strip that draws on (world px; w = screen px at camera scale s)
const trench = (pts, t, dur, until, s = 1, o = {}) => { const zz = [];
  for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L * s / 10));
    const nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
    for (let k = 0; k < n; k++) { const f = k / n, z = (k % 2 ? 1 : -1) * 2.2 / s; zz.push([a[0] + (b[0] - a[0]) * f + nx * z, a[1] + (b[1] - a[1]) * f + ny * z]); } }
  zz.push(pts[pts.length - 1]);
  return glowPath(zz, o.col || "#2a2118", (o.w || 2.6) / s, t, until, 0, o.op || 0.9, { draw: dur, top: true }); };
// a screen-space clock card: label + an analogue face whose hour hand turns between the keys [[t, hour, "4 PM"], ...]
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
// pontoon bridge: n small boats appear one by one along a->b between t0 and t1 (world px); returns the deck path
const pontoons = (a, b, t0, t1, n = 26, o = {}) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, bw = o.bw || 3.2, bl = o.bl || 9;
  const g = document.createElementNS(NS, "g"); OVL.appendChild(g);
  for (let k = 0; k < n; k++) { const f = (k + 0.5) / n, x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f, r = document.createElementNS(NS, "rect");
    r.setAttribute("x", -bw / 2); r.setAttribute("y", -bl / 2); r.setAttribute("width", bw); r.setAttribute("height", bl); r.setAttribute("rx", bw * 0.4);
    r.setAttribute("fill", o.fill || "#e2d3ad"); r.setAttribute("stroke", "#1f4fc4"); r.setAttribute("stroke-width", bw * 0.3); r.setAttribute("transform", `translate(${x} ${y}) rotate(${ang})`);
    g.appendChild(r); gsap.set(r, { opacity: 0 }); tl.to(r, { opacity: 1, duration: 0.25 }, t0 + (t1 - t0) * k / n); }
  const deck = document.createElementNS(NS, "path"); deck.setAttribute("d", `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`); deck.setAttribute("stroke", "#f3ead2"); deck.setAttribute("stroke-width", bw * 0.6);
  deck.setAttribute("stroke-linecap", "round"); deck.setAttribute("fill", "none"); g.appendChild(deck);
  gsap.set(deck, { strokeDasharray: `${L} ${L + 5}`, strokeDashoffset: L }); tl.to(deck, { strokeDashoffset: 0, duration: t1 - t0, ease: "none" }, t0);
  return g; };
// small screen-space number card (big value, label above, sub below) with an optional tick-up; spoken words only
const numCard = (label, value, sub, css, t, until, o = {}) => { const el = scr(`<div style="padding:10px 30px 12px;background:rgba(18,16,12,0.92);border-top:6px solid ${o.col || "#2e5cb2"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 16px 34px rgba(0,0,0,.55)">
  <div style="font-size:20px;letter-spacing:.3em;color:${o.lc || "#9fc0ea"}">${label}</div><div class="v" style="font-size:${o.vs || 62}px;letter-spacing:.04em;line-height:1.1">${value}</div>${sub ? `<div style="font-size:19px;letter-spacing:.22em;color:#c9c2b2">${sub}</div>` : ""}</div>`, css, t, until);
  if (o.slam !== false) slam(el, t, { sfx: "hit", shake: 3 }); return el; };
// ---------- end of move-3 additions ----------

const P3 = "m3-3", P4 = "m3-4", G = GEO.jam;
const T_MORN = at(P3, "On the morning of the fourteenth"), T_FERRY = at(P3, "ferried across the James"), T_WIL = at(P3, "Wilcox's Landing"),
  T_WEY = at(P3, "at Weyanoke"), T_ENG = at(P3, "army engineers began"), T_101 = at(P3, "a hundred and one pontoon"), T_FT = at(P3, "twenty-one hundred feet"),
  T_TIDE = at(P3, "across a tidal river"), T_90 = at(P3, "ninety feet of water"), T_FOUR = at(P3, "four in the afternoon"), T_ELEV = at(P3, "eleven o'clock that night"),
  T_READY = at(P3, "it was ready");
const T_TWO = at(P4, "Over the next two days"), T_115 = at(P4, "a hundred and fifteen thousand"), T_COUNT = at(P4, "by Grant's own count"),
  T_GUNS = at(P4, "with their guns and wagons"), T_GUESS = at(P4, "Lee had guessed"), T_PETE = at(P4, "might go for Petersburg"), T_BELIEVE = at(P4, "would not believe it"),
  T_KEPT = at(P4, "kept most of his army"), T_16 = at(P4, "On the sixteenth"), T_ASK = at(P4, "still asking"), T_17 = at(P4, "On the seventeenth"),
  T_WIRED = at(P4, "he wired Beauregard"), T_HAVE = at(P4, "Have no information");
// ---------- places (jamesriver px; river traced on the basemap) ----------
const RIV = [[860, 640], [1000, 775], [1240, 778], [1330, 782], [1340, 830], [1350, 880], [1400, 886], [1450, 860], [1480, 822], [1600, 812], [1700, 800]];
const BR_N = [1386, 876], BR_S = [1378, 924], WIL = [1290, 764], FERRY_S = [1296, 797];
const ROAD_S = [[1375, 930], [1330, 945], [1200, 950], [1050, 960], [900, 975], [760, 990], [620, 1010], [520, 1040]];
// ---------- map: option 1 wide, dissolving into the close-up (v11), back on the zoom-out ----------
terr("assets/media/m3_jam_jun14_mx.png", 0, T_FERRY + 0.2, 1.0, 2.8);
terr("assets/media/m3_jam_jun14_mx.png", T_GUESS - 0.6, null, 2.2);
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 }); LV.shimmer([RIV, G.APPOM], { width: 1.4 }); LV.scaleBar(30.4); LV.north();
camera([[0, 1180, 640, 1.6], [T_FERRY, 1250, 700, 2.1], [T_WIL + 0.8, 1310, 780, 3.2], [T_WEY + 0.6, 1360, 830, 3.4], [T_101, 1385, 860, 4.2], [T_90, 1385, 870, 4.0],
  [T_ELEV, 1380, 865, 3.8], [T_TWO, 1360, 870, 3.0], [T_GUNS + 1.0, 1250, 880, 2.4], [T_GUESS + 1.6, 940, 720, 1.05], [T_16, 920, 730, 1.0], [END, 930, 735, 1.02]]);
dateNow("12 JUNE 1864", T_MORN + 0.8); B.date("14 JUNE 1864", T_MORN + 0.9, T_16 - 0.1, 34); B.date("16 JUNE 1864", T_16, T_17 - 0.1, 34); B.date("17 JUNE 1864", T_17, null, 34);
// dawn of the 14th (the night of m3a fades)
nightWash(0, 1.2, 0.42, 0.01); dawnWash(0.2, T_FERRY + 3);
// ---------- flags ----------
flagS(FL.us, 1500, 560, 0, T_WIL + 1.2, 110); flagS(FL.cs, 640, 520, 0, T_FERRY + 1.2, 110);
flagS(FL.cs, 1080, 690, T_FERRY + 0.8, T_WIL + 1.5, 100);
flagS(FL.us, 1470, 740, T_WIL + 0.8, T_GUNS + 1.6, 100); flagS(FL.cs, 1250, 920, T_WIL + 1.2, T_GUNS + 1.6, 100);
flagS(FL.us, 1150, 600, T_GUNS + 1.0, END + 1, 110); flagS(FL.cs, 300, 560, T_GUNS + 1.0, END + 1, 110);
const LGD = now(legend(0, END + 1, false));
// ---------- the columns arrive at the James; the first troops ferried across at Wilcox's Landing ----------
const COLS = [["c1", [1205, 420], [[1205, 420], [1250, 560], [1275, 700], WIL]], ["c2", [1330, 470], [[1330, 470], [1370, 600], [1320, 700], [WIL[0] + 18, WIL[1] - 8]]],
  ["c3", [1120, 480], [[1120, 480], [1180, 620], [1250, 720], [WIL[0] - 16, WIL[1] - 6]]]];
COLS.forEach(([id, p, pts], k) => { unitS(id, "carth", p, "infantry", null, { t: 0, size: "XXX" }); along(id, pts, 0, T_FERRY + 1.2 + k * 0.6, 20); });
arw({ pts: [[1180, 380], [1240, 560], [1278, 720]], side: "carth", t: 0.3, dur: 2.4, width: AW(1.6, 13), dash: "10 7", until: T_WIL + 1.0 });
boxS("WILCOX'S LANDING", WIL[0] - 150, WIL[1] - 30, T_WIL, null, { size: 26 });
const FB = [0, 1, 2].map((k) => { const s = ship("steamer", "carth", [WIL[0] - 14 + k * 18, WIL[1] + 8], 90, T_FERRY + 0.2 + k * 0.3, T_TWO + 4, { L: 40 });
  [0, 1, 2, 3].forEach((r) => { const t0 = T_FERRY + 0.5 + k * 0.5 + r * 4.6;
    sail(s, [[WIL[0] - 14 + k * 18, WIL[1] + 8], [FERRY_S[0] - 10 + k * 16, FERRY_S[1]]], t0, 2.0, 6); sail(s, [[FERRY_S[0] - 10 + k * 16, FERRY_S[1]], [WIL[0] - 14 + k * 18, WIL[1] + 8]], t0 + 2.3, 2.0, 6, { rev: false }); });
  return s; });
unitS("f1", "carth", [FERRY_S[0] + 6, FERRY_S[1] + 18], "infantry", null, { t: T_FERRY + 2.6, size: "XX" });
unitS("f2", "carth", [FERRY_S[0] + 40, FERRY_S[1] + 24], "infantry", null, { t: T_WEY, size: "XX" });
B.caption("THE FIRST TROOPS FERRIED ACROSS THE JAMES", T_FERRY + 0.3, T_WEY - 0.2, "carth");
// ---------- Weyanoke: the engineers build the bridge (101 pontoons, ~2,100 ft, up to 90 ft of water), 4 PM -> 11 PM ----------
boxS("WEYANOKE", BR_N[0] + 40, BR_N[1] - 26, T_WEY, null, { size: 26 });
unitS("en1", "carth", [BR_N[0] + 26, BR_N[1] - 14], "infantry", "ENGINEERS", { t: T_ENG, size: "II" });
unitS("en2", "carth", [BR_S[0] + 28, BR_S[1] + 14], "infantry", null, { t: T_ENG + 0.3, size: "II" });
pontoons(BR_N, BR_S, T_ENG + 0.4, T_READY, 22, { bw: 2.2, bl: 5.5 });
const TK = ticker("PONTOON BOATS", 101, "", "left:0;right:0;top:250px;display:flex;justify-content:center;", T_101 - 0.1, 2.0, T_FT - 0.1, 8, { col: "#2e5cb2" });
boxS("ABOUT 2,100 FEET", BR_N[0] - 150, (BR_N[1] + BR_S[1]) / 2 - 6, T_FT, null, { size: 26, bg: "#dcecf8" });
const CH = glowPath([[1338, 820], [1345, 870], [1376, 888], [1430, 878], [1470, 840]], "#3c74d8", 2.2, T_TIDE, T_FOUR, 2, 0.8);
B.caption("UP TO NINETY FEET OF WATER IN THE CHANNEL", T_90 - 0.4, T_FOUR - 0.2, "carth");
const CK = clockCard([[T_FOUR, 4, "4 PM"], [T_ELEV, 11, "11 PM"]], "left:60px;top:150px;", T_FOUR - 0.1, T_READY + 2.2);
nightWash(T_FOUR + 1.0, T_TWO, 0.38, 2.2);
const BRG = glowPath([BR_N, BR_S], "#6f9bff", 2.6, T_READY, END + 1, 3, 0.95, { top: true });
wstampS("READY", BR_S[0] + 60, BR_S[1] + 10, T_READY + 0.3, null, "#9fc0ea", 30);
// ---------- m3-4: about 115,000 men cross with their guns and wagons ----------
const XS = [];
for (let k = 0; k < 6; k++) { const id = "x" + k; unitS(id, "carth", BR_N, k % 3 === 2 ? "artillery" : "infantry", null, { t: T_TWO + k * 0.9, size: k % 3 === 2 ? "" : "XX" });
  along(id, [BR_N, BR_S, ...ROAD_S.slice(0, 3 + (k % 3))], T_TWO + k * 0.9, 7.0, 20); hideU([id], T_GUESS + 3 + k * 0.2); XS.push(id); }
const N115 = numCard("CROSSED THE RIVER", "ABOUT 115,000 MEN", "BY GRANT'S OWN COUNT", "left:0;right:0;top:240px;display:flex;justify-content:center;", T_115, T_GUNS + 1.8);
B.caption("WITH THEIR GUNS AND WAGONS", T_GUNS + 0.1, T_GUESS - 0.2, "carth");
arw({ pts: [[BR_S[0] - 10, BR_S[1] + 10], [1200, 950], [900, 975], [760, 992]], side: "carth", t: T_GUNS + 0.4, dur: 4.0, width: AW(1.2, 14), dash: "12 8", until: END + 1 });
// ---------- Lee: guessed Petersburg on the 14th, would not believe it, kept his army around Richmond ----------
const LB = badge({ name: "ROBERT E. LEE", role: "", initials: "REL", photo: PHOTO("lee"), flag: FL.cs, side: "rome", corner: "br", t: T_GUESS + 0.1, until: END + 1 });
[["l1", [470, 480]], ["l2", [570, 440]], ["l3", [660, 410]], ["l4", [420, 570]]].forEach(([id, p]) => unitS(id, "rome", p, "infantry", null, { t: T_GUESS - 0.4, size: "XXX" }));
unitS("pb", "rome", [470, 1010], "infantry", null, { t: T_GUESS - 0.2, size: "X" });
town("PETERSBURG", G.PETERSBURG, T_PETE - 0.3, "l", { size: 32 });
const GQ = arw({ pts: [[470, 530], [440, 700], [430, 900], [440, 1000]], side: "rome", t: T_PETE, dur: 2.0, width: AW(1.05, 12), dash: "6 9", until: T_BELIEVE + 0.6 });
K.target(G.PETERSBURG[0], G.PETERSBURG[1], T_PETE + 0.3, { r: 34, side: "#ffd54a", until: T_KEPT + 1 });
B.caption("LEE GUESSED THAT GRANT MIGHT GO FOR PETERSBURG", T_PETE - 0.3, T_BELIEVE - 0.1, "rome");
B.caption("BUT HE WOULD NOT BELIEVE IT", T_BELIEVE, T_KEPT - 0.1, "rome");
["l1", "l2", "l3", "l4"].forEach((id, k) => pulseU(id, T_KEPT + 0.2 + k * 0.2));
B.caption("KEPT MOST OF HIS ARMY AROUND RICHMOND", T_KEPT, T_16 - 0.1, "rome");
B.caption("HAD GRANT BEEN SEEN CROSSING THE JAMES?", T_ASK, T_17 - 0.2, "rome");
// the wire to Beauregard (verbatim, 17 June): card only on its spoken words
const Q = quote(`"Have no information of Grant's crossing James River."`, "LEE TO BEAUREGARD", T_HAVE - 0.1, END + 1, { col: "#c4121f", size: 44 });
for (let k = 0; k < 6; k++) SFX("tick", T_HAVE + k * 0.18);
// ---------- clean screen ----------
declutter([LGD, LB, CK], [[T_101 - 0.1, T_FT - 0.1], [T_115, T_GUNS + 1.8], [T_HAVE - 0.1, END + 1]]);
fixImgs();
K.raiseTerritory();
B.finish();
