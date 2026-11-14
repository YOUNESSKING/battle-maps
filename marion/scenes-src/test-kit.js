// KIT TEST (not a video scene): proves the Marion map kit. Built from this one source (from marion/):
//   python3 kit/build_scene.py test-kit-a lowcountry --dur 8 --src test-kit    (a) snapshot 5 s
//   python3 kit/build_scene.py test-kit-b santee --dur 8 --src test-kit        (b) snapshot 5 s
//   python3 kit/build_scene.py test-kit-c blackriver --dur 8 --src test-kit    (c) snapshot 3.5 s
// (a) lowcountry wide, the opening framing: the Charleston - Nelson's Ferry - Camden road, red supply wagons rolling up it, red posts,
//     the two flags (Moultrie / Union 1606); no labels except the baked permanent towns (Charleston, Camden, Georgetown).
// (b) santee close at night, 25 Aug 1780: Nelson's Ferry + the Great Savannah house above it; a red guard box at the house; a blue cavalry
//     group (Marion's partisans) coming out of the cypress swamp; Marion's banner (Moultrie pennant).
// (c) blackriver close, 8 Nov 1780: Tarleton's Legion column (cavalry, infantry, two light guns) on the road at Ox Swamp; Marion at Benbow's Ferry.
if (GD.base === "lowcountry") {
  LIVING({ clouds: 0.1 });
  dateNow("AUGUST 1780");
  camera([[0, ...LYT(33.505, -80.27), 0.715], [END, ...LYT(33.50, -80.265), 0.725]]);
  SIDEFLAG("gb", LYT(32.98, -80.52)); SIDEFLAG("sc", LYT(33.86, -79.55));
  // red posts on the chain (Charleston, Monck's Corner, Nelson's Ferry, Camden), wagons rolling up the road from Charleston toward Camden
  UNIT("pC", "british", NUDGE(LYT(32.99, -80.10)), "infantry", { ech: "XX" });
  UNIT("pN", "british", NUDGE(LYT(33.40, -80.36)), "infantry", { ech: "II" });
  UNIT("pK", "british", NUDGE(LYT(34.12, -80.70)), "infantry", { ech: "XX" });
  const ROAD = LLYT([[33.08, -80.03], [33.196, -80.013], [33.25, -80.10], [33.33, -80.20], [33.385, -80.27], [33.408, -80.304], [33.428, -80.326]]);
  UNIT("w1", "british", ROAD[1], "supply", { ech: "" }); UNIT("w2", "british", ROAD[0], "supply", { ech: "" });
  march("w1", ROAD.slice(1, 6), 0.3, 7.0); march("w2", ROAD.slice(0, 4), 0.6, 7.0);
  if (GD.var.audit) LABEL_AUDIT([5], { show: true });
} else if (GD.base === "santee") {
  LIVING({ clouds: 0.06, light: "night" });
  dateNow("25 AUGUST 1780");
  camera([[0, ...LYT(33.468, -80.336), 1.55], [END, ...LYT(33.469, -80.335), 1.6]]);
  SIDEFLAG("gb", LYT(33.418, -80.300));
  // the British guard + prisoners at the Great Savannah house, by the road above the ferry
  UNIT("g1", "british", NUDGE(LYT(33.4915, -80.3255), { s: 2.1 }), "infantry", { ech: "II" });
  // Marion's horsemen come out of the swamp toward the house (no trail drawn at night: they come unseen)
  UNIT("c1", "allies", LYT(33.468, -80.372), "cavalry", { ech: "" }); UNIT("c2", "allies", LYT(33.461, -80.362), "cavalry", { ech: "" });
  UNIT("c3", "allies", LYT(33.474, -80.360), "cavalry", { ech: "" });
  march("c1", LLYT([[33.468, -80.372], [33.476, -80.354], [33.4805, -80.344]]), 0.3, 6.5, { trail: false, dust: false });
  march("c2", LLYT([[33.461, -80.362], [33.470, -80.346], [33.4785, -80.333]]), 0.4, 6.0, { trail: false, dust: false });
  march("c3", LLYT([[33.474, -80.360], [33.479, -80.350], [33.4835, -80.338]]), 0.5, 6.5, { trail: false, dust: false });
  BANNER("marion", "Francis Marion", "sc", "c1", 0, { side: "nw", pop: 1.4, bright: 1.18 });
  if (GD.var.audit) LABEL_AUDIT([5], { show: true });
} else if (GD.base === "blackriver") {
  LIVING({ clouds: 0.1, light: "morning", lightK: 0.35 });
  dateNow("8 NOVEMBER 1780");
  camera([[0, ...LYT(33.703, -80.112), 1.9], [END, ...LYT(33.704, -80.105), 1.95]]);
  // Tarleton's Legion on Marion's trail: cavalry ahead, infantry, the two light guns; it reaches Ox Swamp
  const R = LLYT([[33.700, -80.262], [33.705, -80.246], [33.716, -80.198], [33.722, -80.150], [33.718, -80.100]]);
  UNIT("L1", "british", R[0], "cavalry", { ech: "II" }); UNIT("L2", "british", R[0], "cavalry", { ech: "II" }); UNIT("L3", "british", R[0], "infantry", { ech: "II" });
  UNIT("G1", "british", R[0], "artillery", { ech: "" }); UNIT("G2", "british", R[0], "artillery", { ech: "" });
  const P = (f0, f1) => sub(R, f0, f1, 20);
  march("L1", P(0.0, 0.62), 0.2, 5.5); march("L2", P(0.0, 0.52), 0.4, 5.5); march("L3", P(0.0, 0.42), 0.6, 5.5);
  march("G1", P(0.0, 0.32), 0.8, 5.5); march("G2", P(0.0, 0.22), 1.0, 5.5);
  BANNER("tarleton", "Banastre Tarleton", "gb", "L1", 0, { side: "nw" });
  // Marion's camp at Benbow's Ferry, the south (Kingstree) bank of the Black River
  UNIT("m1", "allies", NUDGE(LYT(33.6905, -80.0060), { s: 1.9 }), "cavalry", { ech: "" });
  SIDEFLAG("sc", "m1");
  PLACE_LABEL("Ox Swamp", LYT(33.686, -80.200), 1.2, { hold: 5 });
  PLACE_LABEL("Benbow's Ferry", PLACE("benbows_ferry"), 1.6, { dy: -60, hold: 5 });
  RIVER("black_river", "Black River", 1.0, { s: 1.92, near: LYT(33.712, -80.050), side: "left", hw: 6, hold: 6 });
  if (GD.var.audit) LABEL_AUDIT([3.5], { show: true });
}
