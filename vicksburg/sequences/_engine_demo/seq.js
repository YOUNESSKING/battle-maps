// _engine_demo: a small 24 s feature test of the engine beyond the v8 regression (NOT a film scene; positions are the clip bundles').
// Wide map with units at wide scale + a gunboat flotilla on a path + the 3D title without a dive + a cut to the close map with a column marching
// a road (VX.march), a line deployed with VX.line, a house fire, a guns entry, an any-portrait banner (Sherman) and a place label.
(() => {
const WIDE = "_clip_wide", BB = "bigblack", RD = VX.road(BB, "main"), BR = VX.bridge(BB, 0);
const MISS = VX.river(WIDE, "mississippi").pts.filter((p) => p[1] > 600 && p[1] < 760).map((p) => [p[0], p[1]]);
const line = VX.line([1523.5, 700.5], [1523.5, 710.5], 3);
window.SEQ = {
  name: "_engine_demo", D: 24, debug: true, date: "1863-05-17",
  regions: [WIDE, BB],
  keys: [
    { t: 0, region: WIDE, at: [1420, 700], dist: 420, tilt: 46, yaw: 0, fov: 30 },
    { t: 9.5, region: WIDE, at: [1440, 705], dist: 380, tilt: 44, yaw: 3, fov: 30 },
    { t: 9.5, region: BB, at: [1512, 704], dist: 34, tilt: 50, yaw: -4, fov: 30, ease: "cut" },
    { t: 24, region: BB, at: [1515, 705], dist: 30, tilt: 52, yaw: 2, fov: 30 },
  ],
  title: { text: "VICKSBURG", tOn: 2.0, tOff: 6.5, anchorT: 3.0, region: WIDE },
  clouds: { [WIDE]: { keepClear: [[1400, 700, 90, 0.8, 1]] } },
  units: [
    { region: WIDE, side: "u", type: "inf", n: 3, keys: VX.march([[1470, 760], [1500, 740], [1530, 730]], 0.5, 6), face: "north" },
    { region: WIDE, side: "r", type: "inf", n: 3, keys: [[0, 1440, 690]], face: "east" },
    { side: "u", type: "inf", n: 4, march: true, keys: VX.march(VX.reverse(RD).slice(0, 18).reverse(), 10, 1.0), face: "west" },
    ...line.map((p, i) => ({ side: "r", type: i === 1 ? "art" : "inf", n: i === 1 ? 2 : 4, keys: [[9.5, p[0] + 1.5, p[1]], VX.deploy([[1521.5, 700.5], [1521.5, 710.5]], 13, i, 3)], face: "east", cap: i === 2 ? 20 : undefined })),
  ],
  arrows: [{ side: "r", pts: [[1525, 705.5], [1522, 705.5]], t0: 11, dur: 2, t1: 22 }],
  banners: [{ general: "sherman", keys: [[0, 1527, 703.5]], t0: 10.2, t1: 30 }],
  labels: [{ text: "Mississippi River", at: [1360, 690], river: true, t0: 0.5, t1: 9, region: WIDE }, { text: "Bovina", town: "Bovina", t0: 10.5, t1: 22, region: BB }],
  boats: [{ region: WIDE, kind: ["gunboat", "gunboat", "steamer"], n: 3, path: MISS, speed: 4, spacing: 5, t0: 0, t1: 9.6, lamp: false }],
  fx: {
    fires: [{ region: BB, at: [1496, 701.5, 0.1], t0: 10, t1: 30, preset: "house" }],
    guns: [{ region: BB, at: [1521.6, 705.3], dir: [1, 0], shots: [12, 14.5, 17], impact: [1526, 705.5], delay: 0.8 }],
    volleys: [{ region: BB, pts: [[1521.9, 700.5], [1521.9, 703], [1521.9, 708], [1521.9, 710.5]], t0: 14, t1: 19, opts: { dir: [1, 0], rate: 2.4, volley: 1.6, size: 1.4, height: 3, muzzle: 6, windK: 0.45 } }],
  },
  overlay: [
    ["plaque.date", 0.4, { month: "May 1863", day: "17", weekday: "Sunday", note: "engine demo" }],
    ["medallion", { kind: "card", general: "sherman", sub: "XV Corps", screen: [1765, 215], tIn: 11, tOut: 16 }],
    ["legend", 10.5, 23, { entries: [{ name: "Union", sub: "Sherman", color: "#3C6E9E" }, { name: "Confederates", sub: "Pemberton", color: "#9C3A35" }] }],
  ],
  end: { fadeAt: 23 },
};
})();
