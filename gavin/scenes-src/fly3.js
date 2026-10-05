// TEST ("Frontlines" style, owner test 2026-10): 3D flyover over south-east Sicily that opens Move 1 (first ~9 s of move1-1).
// three.js terrain: assets/sicily_height.png (sqrt-scaled elevation) + darkened basemap texture; camera driven by the paused GSAP timeline.
const B = Battle();
const END = B.T.duration;
const GG = GGK(B);
Flyover(B, GG, { height: "assets/holland_height.png", tex: "assets/media/holland_dark.jpg", exag: 28,
  labels: [["EINDHOVEN", 1309, 1091], ["GRAVE", 1506, 716], ["NIJMEGEN", 1593, 622], ["ARNHEM", 1630, 457], ["THE WAAL", 1440, 585], ["GERMANY", 2200, 640]],
  C0: [-150, 1000, 1500], C1: [100, 260, 260], L0: [-100, 0, 100], L1: [150, 0, -230], title: ["MOVE 3", "THE WAAL CROSSING", "HOLLAND · SEPTEMBER 1944"] });
B.finish();
