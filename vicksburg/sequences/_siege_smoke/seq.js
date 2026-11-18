// _siege_smoke: load test of the baker's bundles (wide + siege) on the engine; not a film scene.
window.SEQ = { name: "_siege_smoke", D: 6, regions: ["wide", "siege"],
  keys: [{ t: 0, region: "wide", at: VX.place("Vicksburg"), dist: 300, tilt: 46, yaw: 0 }, { t: 3, region: "siege", at: VX.place("Vicksburg"), dist: 40, tilt: 50, yaw: 0, ease: "cut" }, { t: 6, region: "siege", at: VX.place("Vicksburg"), dist: 36, tilt: 52, yaw: 3 }],
  labels: [{ text: "Vicksburg", town: "Vicksburg", t0: 0.2, t1: 2.8, region: "wide" }],
  units: [{ side: "r", type: "inf", n: 4, keys: [[3, VX.place("Vicksburg")[0] + 3, VX.place("Vicksburg")[1] + 4]], face: "east" }] };
