// SHIP OPTION A = the default (owner pick): proves that plain UNIT(..., "ship") calls (no scene edits) render the painted ship of the line.
//   python3 kit/build_scene.py shipA-capes chesapeake --dur 6 --src test-ship-final --var view=capes   (views: capes | east | lynn | burn)
const V = GD.var.view || "capes";
LIVING({ clouds: 0.1 });
if (V === "capes") {   // 5 Sep: the Battle of the Capes, French line out of the bay heading east, British line to windward; French van broadside
  dateNow("5 SEPTEMBER 1781");
  camera([[0, ...LYT(36.93, -75.72), 2.0], [END, ...LYT(36.93, -75.70), 2.03]]);
  [0, 1, 2, 3, 4, 5].forEach((i) => { const p = LYT(36.875 - i * 0.012, -75.95 + i * 0.075); UNIT("f" + i, "allies", p, "ship", { ech: "" }); B.move("f" + i, 0.2, 5.5, p[0] + 30, p[1] + 3); });
  [0, 1, 2, 3, 4, 5].forEach((i) => { const p = LYT(37.00 - i * 0.012, -75.88 + i * 0.075); UNIT("g" + i, "british", p, "ship", { ech: "" }); B.move("g" + i, 0.2, 5.5, p[0] + 30, p[1] + 3); });
  [0, 1, 2].forEach((i) => BROADSIDE("f" + i, 1.6 + i * 0.25, { n: 6 }));
} else if (V === "east") {   // east wide: de Grasse inside the capes, Graves's fleet sailing back north toward New York
  dateNow("SEPTEMBER 1781");
  camera([[0, ...LYT(38.9, -75.4), 0.9], [END, ...LYT(38.9, -75.4), 0.92]]);
  [0, 1, 2].forEach((i) => UNIT("f" + i, "allies", LYT(37.10 - i * 0.18, -76.20 + i * 0.42), "ship", { ech: "" }));
  [0, 1, 2].forEach((i) => { const p = LYT(37.30 + i * 0.50, -74.95 + i * 0.30); UNIT("g" + i, "british", p, "ship", { ech: "" }); B.move("g" + i, 0.3, 5, ...LYT(37.55 + i * 0.50, -74.80 + i * 0.30)); });
  UNIT("w1", "british", LYT(38.75, -73.40), "ship", { ech: "" }); B.move("w1", 0.3, 5, ...LYT(38.70, -73.95));   // heading west: faces left
} else if (V === "lynn") {   // de Grasse's fleet at anchor in Lynnhaven Bay behind Cape Henry
  dateNow("1 SEPTEMBER 1781");
  camera([[0, ...LYT(36.95, -76.05), 2.6], [END, ...LYT(36.95, -76.05), 2.62]]);
  const L0 = PLACE("lynnhaven_bay");
  [[0, 0, 1], [60, -18, -1], [120, -36, 1], [-30, -52, -1], [40, -74, 1], [100, -92, -1]].forEach(([dx, dy, f], i) => UNIT("a" + i, "allies", [L0[0] + dx * 0.95, L0[1] + dy * 0.75], "ship", { ech: "", facing: f < 0 ? "left" : "right" }));
} else {   // burn: 11 Sep, the British burn the wrecked HMS Terrible (fire, smoke, darken, it sinks), as p2a.js does it
  dateNow("11 SEPTEMBER 1781");
  camera([[0, ...LYT(36.98, -75.70), 2.4], [END, ...LYT(36.98, -75.70), 2.42]]);
  const P = LYT(36.98, -75.72); UNIT("terr", "british", P, "ship", { ech: "" }); UNIT("g2", "british", LYT(37.00, -75.62), "ship", { ech: "" });
  SHIP_BURN("terr", 0.5, { sink: 4.4 });   // fire on the hull and in the rigging, darkens, smoke column; it sinks at 4.4 s
  PLACE_LABEL("HMS Terrible", P, 1.0, { dx: -10, dy: 52, size: 24, hold: 5 });
}
