// TEST ("Frontlines" style, owner test 2026-10): 3D flyover over south-east Sicily that opens Move 1 (first ~9 s of move1-1).
// three.js terrain: assets/sicily_height.png (sqrt-scaled elevation) + darkened basemap texture; camera driven by the paused GSAP timeline.
const B = Battle();
const END = B.T.duration;
const GG = GGK(B);
Flyover(B, GG, { height: "assets/normandy_height.png", tex: "assets/media/normandy_dark.jpg", exag: 32,
  labels: [["CHERBOURG", 1098, 463], ["UTAH BEACH", 1422, 715], ["STE-MÈRE-ÉGLISE", 1319, 723], ["LA FIÈRE", 1285, 731], ["CARENTAN", 1368, 844], ["OMAHA BEACH", 1637, 766]],
  C0: [-60, 1050, 1350], C1: [-170, 230, 250], L0: [-60, 0, -200], L1: [-155, 10, -90], title: ["MOVE 2", "THE LA FIÈRE CAUSEWAY", "NORMANDY · JUNE 1944"] });
B.finish();
