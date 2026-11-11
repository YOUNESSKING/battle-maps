// KIT TEST (not a video scene): proves the Yorktown map kit on two frames. Built twice from this one source:
//   python3 kit/build_scene.py test-kit-a east --dur 10 --src test-kit      (frame a, snapshot at 6 s)
//   python3 kit/build_scene.py test-kit-b yorktown --dur 10 --src test-kit  (frame b, snapshot at 6 s)
// (a) east wide: the allied columns marching south with dust, Washington + Rochambeau banners, Clinton banner at New York, permanent towns,
//     rut roads, the Hudson + the Chesapeake named. (b) yorktown close at dusk: the first parallel, the allied guns, Redoubts 9 and 10,
//     the town with its carved name, the ferry, Cornwallis banner, blue hatching on Redoubt 10 (taken).
if (GD.base === "east") {
  LIVING({ clouds: 0.1 });
  dateNow("SEPTEMBER 1781");
  camera([[0, ...LYT(39.58, -75.02), 0.9], [END, ...LYT(39.55, -75.06), 0.92]]);
  // the two nation flags (hidden while that side's general banner is up: one flag per side)
  SIDEFLAG("us", LYT(40.10, -76.60)); SIDEFLAG("gb", LYT(41.25, -72.60));
  // British garrison of New York (Clinton) + the allied army marching south on the post road (Americans ahead, French behind)
  UNIT("ny1", "british", LYT(40.95, -73.85), "infantry", { ech: "XX" }); UNIT("ny2", "british", LYT(40.86, -72.42), "infantry", { ech: "XX" });
  BANNER("clinton", "Henry Clinton", "gb", "ny1", 0, { side: "right" });
  const ROUTE = LLYT([[40.74, -74.38], [40.57, -74.53], [40.35, -74.66], [40.22, -74.76], [40.10, -74.92], [39.952, -75.165], [39.85, -75.36], [39.74, -75.55], [39.608, -75.833], [39.57, -76.00], [39.55, -76.09]]);
  const RT = (f0, f1) => sub(ROUTE, f0, f1, 24);
  // the march runs 0.2 .. 6.6 s (the route is ~350 screen px here, so 5 boxes ~70 px apart): Americans lead to Head of Elk, guns + wagons
  // behind them past Philadelphia, the French behind at Bound Brook (at the snapshot, 6 s, nobody stands on the Philadelphia name)
  UNIT("am1", "allies", ROUTE[3], "infantry", { ech: "XX" }); UNIT("am2", "allies", ROUTE[2], "infantry", { ech: "XX" });
  UNIT("amA", "allies", ROUTE[1], "artillery", { ech: "" }); UNIT("amS", "allies", ROUTE[1], "supply", { ech: "" });
  UNIT("fr1", "allies", ROUTE[0], "infantry", { ech: "XX" });
  march("am1", RT(0.36, 1.0), 0.2, 6.4); march("am2", RT(0.20, 0.76), 0.3, 6.4); march("amA", RT(0.10, 0.45), 0.4, 6.4); march("amS", RT(0.04, 0.29), 0.5, 6.4);
  march("fr1", [LYT(40.85, -74.32), ...RT(0.0, 0.10)], 0.3, 6.4);
  BANNER("washington", "George Washington", "us", "am1", 0, { side: "sw" });
  BANNER("rochambeau", "Rochambeau", "fr", "fr1", 0, { side: "west" });
  // de Grasse's fleet off the Chesapeake capes (ship box; no flags on units)
  UNIT("fl1", "allies", LYT(37.45, -75.20), "ship", { ech: "" }); B.move("fl1", 0.5, 8, ...LYT(37.25, -75.62));
  RIVER("hudson", "Hudson", 1.0, { s: 0.91, size: 22, near: LYT(41.45, -73.96), side: "left", hw: 3, hold: 6 });
  RIVER("chesapeake", "Chesapeake Bay", 1.5, { s: 0.91, size: 22, near: LYT(38.25, -76.30), side: "above", hw: -10, gap: 0, hold: 6, face: "#d6e2ec" });
} else {
  LIVING({ clouds: 0.1, light: "dusk" });
  dateNow("14 OCTOBER 1781");
  camera([[0, ...LYT(37.2318, -76.5055), 2.35], [END, ...LYT(37.2312, -76.5045), 2.42]]);
  SIDEFLAG("us", LYT(37.2190, -76.5150)); SIDEFLAG("gb", LYT(37.2400, -76.5160));
  // the first parallel (dug 6-7 Oct, ~600-800 yd from the British line), from the Yorktown Creek ravine to the river bluff
  const PAR1 = LLYT([[37.2262, -76.5185], [37.2238, -76.5120], [37.2235, -76.5060], [37.2244, -76.5006], [37.2262, -76.4950], [37.2282, -76.4918]]);
  TRENCH(PAR1, 0.3, { dur: 2.4 });
  // the British inner line round the town (hornwork on the Hampton road)
  TRENCH(LLYT([[37.2385, -76.5178], [37.2332, -76.5155], [37.2305, -76.5105], [37.2309, -76.5060], [37.2330, -76.5030], [37.2356, -76.5008]]), 0, { face: 1 });
  const R9 = REDOUBT("r9", PLACE("redoubt_9"), 0, { side: "british", rot: 12 }), R10 = REDOUBT("r10", PLACE("redoubt_10"), 0, { side: "british", rot: -8 });
  // British units inside the line + Cornwallis on a side stake west of the town
  UNIT("b1", "british", LYT(37.2333, -76.5125), "infantry", { ech: "X" }); UNIT("b2", "british", LYT(37.2331, -76.5068), "infantry", { ech: "X" });
  UNIT("bA", "british", LYT(37.2362, -76.5160), "artillery", { ech: "" });
  BANNER("cornwallis", "Lord Cornwallis", "gb", LYT(37.2396, -76.5150), 0, { side: "up" });
  // allied army behind the parallel: French (west), Americans (east, facing Redoubts 9 + 10), siege guns, sappers
  UNIT("f1", "allies", LYT(37.2205, -76.5170), "infantry", { ech: "XX" }); UNIT("f2", "allies", LYT(37.2190, -76.5080), "infantry", { ech: "XX" });
  UNIT("a1", "allies", LYT(37.2200, -76.4990), "infantry", { ech: "XX" }); UNIT("aE", "allies", LYT(37.2178, -76.4930), "engineers", { ech: "" });
  UNIT("g1", "allies", LYT(37.2222, -76.5120), "artillery", { ech: "" }); UNIT("g2", "allies", LYT(37.2219, -76.5040), "artillery", { ech: "" }); UNIT("g3", "allies", LYT(37.2232, -76.4975), "artillery", { ech: "" });
  // one visible shot from the parallel onto the British line (boom on the impact)
  shoot(LYT(37.2232, -76.4975), LYT(37.2330, -76.5045), 4.6, { dur: 0.9, width: 0.5 });
  // Redoubt 10 taken (night 14 Oct): FORM 1 hatching in the taker's colour (allied = blue), ~3 s
  const r10 = PLACE("redoubt_10"), HR = 15;
  HATCH([[r10[0] - HR, r10[1] - HR * 0.8], [r10[0] + HR * 1.1, r10[1] - HR], [r10[0] + HR, r10[1] + HR], [r10[0] - HR * 1.1, r10[1] + HR * 0.9]], "allies", 4.8, { hold: 2.4 });
  REDOUBT_TAKEN(R10, 4.9);
}
