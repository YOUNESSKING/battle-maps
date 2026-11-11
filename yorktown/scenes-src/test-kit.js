// KIT TEST (not a video scene): proves the Yorktown map kit. Built from this one source:
//   python3 kit/build_scene.py test-kit-a east --dur 10 --src test-kit                          (frame a, snapshot at 6 s)
//   python3 kit/build_scene.py test-kit-b yorktown --dur 10 --src test-kit                      (frame b, snapshot at 6 s)
//   python3 kit/build_scene.py test-kit-storm yorktown --dur 6 --src test-kit --var mode=storm  (16-17 Oct night storm, snapshot at 3 s)
// (a) east wide: the allied columns marching south with dust, Washington + Rochambeau banners, Clinton banner at New York, painted towns,
//     rut post roads, the Hudson + the Chesapeake named, de Grasse inside the capes (Lynnhaven Bay).
// (b) yorktown close at dusk, 14 Oct: both parallels with the batteries ON them, the second parallel joined to Redoubts 9 + 10 and the river,
//     French wing west (French flag), Americans east (US flag), the town + its carved name, the York ferry, Cornwallis inside the lines,
//     blue hatching on Redoubt 10 (taken). Storm variant: the same siege at night in the storm (works + units dimmed, not gone).
if (GD.base === "east") {
  LIVING({ clouds: 0.1 });
  dateNow("SEPTEMBER 1781");
  camera([[0, ...LYT(39.33, -75.20), 0.86], [END, ...LYT(39.31, -75.24), 0.88]]);
  // the two nation flags (hidden while that side's general banner is up: one flag per side)
  SIDEFLAG("us", LYT(40.10, -76.60)); SIDEFLAG("gb", LYT(41.25, -72.60));
  // British garrison of New York (Clinton) + the allied army marching south on the post road (Americans ahead, French behind)
  UNIT("ny1", "british", NUDGE(LYT(41.03, -73.90)), "infantry", { ech: "XX" }); UNIT("ny2", "british", NUDGE(LYT(40.90, -72.15)), "infantry", { ech: "XX" });
  BANNER("clinton", "Henry Clinton", "gb", "ny1", 0, { side: "right" });
  const ROUTE = LLYT([[40.74, -74.38], [40.57, -74.53], [40.35, -74.66], [40.22, -74.76], [40.10, -74.92], [39.952, -75.165], [39.85, -75.36], [39.74, -75.55], [39.608, -75.833], [39.57, -76.00], [39.55, -76.09], [39.42, -76.35]]);
  const RT = (f0, f1) => sub(ROUTE, f0, f1, 24);
  // the march runs 0.2 .. 6.6 s; at the snapshot (6 s) the lead division is past Head of Elk, Washington rides with the second, guns + wagons
  // behind them north of Philadelphia, the French behind at Bound Brook; nobody stands on a town name (LABEL_AUDIT)
  UNIT("am1", "allies", ROUTE[3], "infantry", { ech: "XX" }); UNIT("am2", "allies", ROUTE[2], "infantry", { ech: "XX" });
  UNIT("amA", "allies", ROUTE[1], "artillery", { ech: "" }); UNIT("amS", "allies", ROUTE[1], "supply", { ech: "" });
  UNIT("fr1", "allies", ROUTE[0], "infantry", { ech: "XX" });
  march("am1", RT(0.42, 1.0), 0.2, 5.8); march("am2", RT(0.30, 0.86), 0.3, 5.7); march("amA", RT(0.12, 0.43), 0.4, 6.4); march("amS", RT(0.05, 0.33), 0.5, 6.4);
  march("fr1", [LYT(40.85, -74.32), ...RT(0.0, 0.14)], 0.3, 6.4);
  BANNER("washington", "George Washington", "us", "am1", 0, { side: "sw" });
  BANNER("rochambeau", "Rochambeau", "fr", "fr1", 0, { side: "west" });
  // de Grasse's fleet at anchor inside the capes, in Lynnhaven Bay behind Cape Henry (ship box; no flags on units)
  UNIT("fl1", "allies", LYT(37.05, -75.70), "ship", { ech: "" }); B.move("fl1", 0.5, 4.5, ...NUDGE(LYT(37.00, -76.03)));   // inside the capes, off Lynnhaven Bay
  RIVER("hudson", "Hudson", 1.0, { s: 0.88, size: 22, near: LYT(41.72, -73.95), side: "left", hw: 3, hold: 6 });   // up the river, clear of Clinton
  RIVER("chesapeake", "Chesapeake Bay", 1.5, { s: 0.91, size: 22, near: LYT(38.25, -76.30), side: "above", hw: -10, gap: 0, hold: 6, face: "#d6e2ec" });
  if (GD.var.audit) LABEL_AUDIT([2, 6], { show: true });
} else {
  const STORMV = GD.var.mode === "storm";
  LIVING({ clouds: 0.1, light: STORMV ? "night" : "dusk", lightK: STORMV ? 0.8 : 0.45 });
  dateNow(STORMV ? "16 OCTOBER 1781" : "14 OCTOBER 1781");
  // storm night: frame the narrows (Yorktown <-> Gloucester Point, both ferry landings); 14 Oct: the siege lines
  if (STORMV) camera([[0, ...LYT(37.2385, -76.5060), 2.25], [END, ...LYT(37.2388, -76.5058), 2.3]]);
  else camera([[0, ...LYT(37.2302, -76.5068), 2.35], [END, ...LYT(37.2298, -76.5062), 2.4]]);
  // the first parallel (6-7 Oct) and the second (11 Oct, ~300 yd closer), the second joined to Redoubts 9 + 10 and the river bluff after the 14th
  const PAR1 = LLYT([[37.2262, -76.5185], [37.2238, -76.5120], [37.2235, -76.5060], [37.2244, -76.5006], [37.2262, -76.4952]]);
  const PAR2 = LLYT([[37.2290, -76.5178], [37.2270, -76.5120], [37.2266, -76.5068], [37.2278, -76.5037]]);
  const LINK = LLYT([[37.2278, -76.5037], [37.2292, -76.5025], [37.2319, -76.5000], [37.2329, -76.4988]]);
  TRENCH(PAR1, 0); TRENCH(PAR2, 0); TRENCH(LINK, STORMV ? 0 : 5.2, { dur: 0.8 });
  // the British inner line round the town (hornwork on the Hampton road)
  TRENCH(LLYT([[37.2385, -76.5178], [37.2332, -76.5155], [37.2305, -76.5105], [37.2309, -76.5060], [37.2330, -76.5030], [37.2356, -76.5008]]), 0, { face: 1 });
  const R9 = REDOUBT("r9", PLACE("redoubt_9"), 0, { side: STORMV ? "allies" : "british", rot: 12 }), R10 = REDOUBT("r10", PLACE("redoubt_10"), 0, { side: STORMV ? "allies" : "british", rot: -8 });
  // 14 Oct: everybody up in the trenches. French wing (west): infantry + guns on both parallels; Americans (east) toward Redoubts 9 + 10, sappers in front
  UNIT("f1", "allies", LYT(37.2284, -76.5160), "infantry", { ech: "XX" }); UNIT("gF2", "allies", LYT(37.2268, -76.5100), "artillery", { ech: "" });
  UNIT("f2", "allies", LYT(37.2251, -76.5165), "infantry", { ech: "XX" }); UNIT("gF1", "allies", LYT(37.2237, -76.5100), "artillery", { ech: "" });
  UNIT("gA2", "allies", LYT(37.2268, -76.5058), "artillery", { ech: "" }); UNIT("gA1", "allies", LYT(37.2240, -76.5030), "artillery", { ech: "" });
  UNIT("a1", "allies", LYT(37.2262, -76.4962), "infantry", { ech: "XX" }); UNIT("aE", "allies", LYT(37.2300, -76.4972), "engineers", { ech: "" });
  SIDEFLAG("fr", "f2"); SIDEFLAG("us", "a1");   // the nation flags ride with the wings (French pennant west, US flag east)
  // British inside the line, clear of the carved name; Cornwallis on a stake inside the works west of the town
  UNIT("b1", "british", NUDGE(LYT(37.2322, -76.5128)), "infantry", { ech: "X" }); UNIT("b2", "british", NUDGE(LYT(37.2318, -76.5075)), "infantry", { ech: "X" });
  UNIT("bA", "british", NUDGE(LYT(37.2330, -76.5052)), "artillery", { ech: "" });
  BANNER("cornwallis", "Lord Cornwallis", "gb", NUDGE(LYT(37.2333, -76.5143)), 0, { side: "nw" });
  if (!STORMV) {
    shoot(PLACE("first_parallel"), LYT(37.2309, -76.5070), 4.6, { dur: 0.9, width: 0.5 });   // one visible shot from the American battery (boom on impact)
    const r10 = PLACE("redoubt_10"), HR = 15;   // Redoubt 10 taken (night 14 Oct): FORM 1 hatching in the taker's colour, ~3 s
    HATCH([[r10[0] - HR, r10[1] - HR * 0.8], [r10[0] + HR * 1.1, r10[1] - HR], [r10[0] + HR, r10[1] + HR], [r10[0] - HR * 1.1, r10[1] + HR * 0.9]], "allies", 4.8, { hold: 2.4 });
    REDOUBT_TAKEN(R10, 4.9); REDOUBT_TAKEN(R9, 4.9);
  } else {   // night 16-17 Oct: the escape across the York in the flatboats, scattered by the storm from ~midnight
    STORM(0.2, END);
    const YL = LYT(37.2398, -76.5072), GL = LYT(37.2452, -76.5042);
    const X = (f, dx, dy) => [YL[0] + (GL[0] - YL[0]) * f + dx, YL[1] + (GL[1] - YL[1]) * f + dy];   // f across the narrows, dx/dy map px (downstream = +x)
    BOAT([X(0, -10, 2), X(0.85, -14, 0)], 0, 2.6, { drift: [4, 2] });              // the first wave nearly across
    BOAT([X(0.05, 8, 2), X(0.5, 34, 6)], 0, 2.6, { drift: [26, 10] });             // blown downstream in mid-river
    BOAT([X(0.05, 14, 6), X(0.25, 62, 22)], 0.2, 2.4, { drift: [22, 10] });         // driven back toward the Yorktown shore
  }
  if (GD.var.audit) LABEL_AUDIT([3, 6], { show: true });
}
