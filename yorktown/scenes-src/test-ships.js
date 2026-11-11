// SHIP OPTIONS test (owner: "I don't like the symbol of the ships"). One source, built per style (A/B/C) and view:
//   python3 kit/build_scene.py ships-A-capes chesapeake --dur 6 --src test-ships --var style=A --var view=capes   (also view=big; east base: view=east)
const ST = GD.var.style || "A", V = GD.var.view || "capes";
LIVING({ clouds: 0.1 });
dateNow("5 SEPTEMBER 1781");
if (V === "big") {
  camera([[0, ...LYT(36.85, -75.60), 1.6], [END, ...LYT(36.85, -75.60), 1.6]]);
  SHIPV("s1", "allies", LYT(36.90, -75.78), { style: ST, px: 240, heading: 0, facing: "right" });
  SHIPV("s2", "british", LYT(36.90, -75.40), { style: ST, px: 240, heading: 180, facing: "left" });
} else if (V === "capes") {   // the Battle of the Capes: the French line comes out of the bay heading east, the British line to windward (north-east)
  camera([[0, ...LYT(36.93, -75.72), 2.3], [END, ...LYT(36.93, -75.72), 2.33]]);
  const FR = [0, 1, 2, 3, 4, 5].map((i) => LYT(36.875 - i * 0.012, -75.93 + i * 0.062)), GB = [0, 1, 2, 3, 4, 5].map((i) => LYT(36.99 - i * 0.012, -75.86 + i * 0.062));
  FR.forEach((p, i) => SHIPV("f" + i, "allies", p, { style: ST, heading: 11, facing: "right" }));
  GB.forEach((p, i) => SHIPV("g" + i, "british", p, { style: ST, heading: 11, facing: "right" }));
  [0, 1, 2].forEach((i) => BROADSIDE("f" + i, 1.2 + i * 0.25, { n: 5, dy: -4 }));   // broadside smoke from the French van (toward the British line)
} else {   // east wide: the two fleets at the Chesapeake capes
  camera([[0, ...LYT(38.6, -75.6), 0.9], [END, ...LYT(38.6, -75.6), 0.9]]);
  [0, 1, 2].forEach((i) => SHIPV("f" + i, "allies", LYT(36.97 - i * 0.12, -75.55 + i * 0.55), { style: ST, heading: 15, facing: "right" }));
  [0, 1, 2].forEach((i) => SHIPV("g" + i, "british", LYT(37.62 - i * 0.12, -75.10 + i * 0.55), { style: ST, heading: 195, facing: "left" }));
}
