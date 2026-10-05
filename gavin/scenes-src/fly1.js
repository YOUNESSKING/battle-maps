// TEST ("Frontlines" style, owner test 2026-10): 3D flyover over south-east Sicily that opens Move 1 (first ~9 s of move1-1).
// three.js terrain: assets/sicily_height.png (sqrt-scaled elevation) + darkened basemap texture; camera driven by the paused GSAP timeline.
const B = Battle();
const END = B.T.duration;
const GG = GGK(B);
Flyover(B, GG, { height: "assets/sicily_height.png", tex: "assets/media/sicily_dark.jpg", exag: 95,
  labels: [["GELA", 1186, 750], ["SCOGLITTI", 1318, 911], ["BIAZZA RIDGE", 1309, 799], ["NISCEMI", 1289, 676], ["SYRACUSE", 1940, 742], ["CATANIA", 1797, 353], ["MOUNT ETNA", 1700, 250]],
  C0: [150, 1150, 1500], C1: [-60, 260, 360], L0: [150, 0, -150], L1: [-125, 20, -20], title: ["MOVE 1", "BIAZZA RIDGE", "SICILY · JULY 1943"] });
B.finish();
