// _smoke (Battle 21 engine/world check, not a film scene): the colonies wide map (zoom-9 frame), a cloud dive onto the Delaware crossing
// (zoom-12 frame, winter: bare woods, thin snow, shore ice + drifting floes), GM line-block troops: two American units waiting on the PA bank
// at McConkey's Ferry, one already across at Johnson's Ferry walking up the Bear Tavern road, a gun on the NJ bank.
// Coordinates: VX.place(name, region) / VX.ll(lat, lon, region) convert the base-frame geography into each region's frame (never mix them).
const D = 16, SW = 7.0;
const MK = VX.place("McConkey's Ferry", "crossing"), JF = VX.place("Johnson's Ferry", "crossing");
const dir = [JF[0] - MK[0], JF[1] - MK[1]], L = Math.hypot(...dir), u = [dir[0] / L, dir[1] / L], side = [-u[1], u[0]];
const FACE = Math.atan2(u[1], u[0]);                                               // facing across the river, PA -> NJ
const off = (p, d, s = 0) => [p[0] + u[0] * d + side[0] * s, p[1] + u[1] * d + side[1] * s];
const US1 = off(MK, -2.2, -2.0), US2 = off(MK, -2.6, 2.4);                          // waiting on the PA bank (river ~9 units wide here)
const US3a = off(JF, 1.5, 0), US3b = VX.ll(40.3035, -74.8625, "crossing");          // across, up the Bear Tavern road
const GUN = off(JF, 2.0, 3.0);
const OVER = VX.place("McConkey's Ferry", "colonies");                              // the same spot on the zoom-9 colonies map
window.SEQ = {
  name: "_smoke", D, seed: 1776, date: "1776-12-25",
  regions: ["colonies", "crossing"],
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  keys: [
    { t: 0, region: "colonies", at: [OVER[0] + 60, OVER[1] - 60], dist: 520, tilt: 38, yaw: 0 },
    { t: 3.0, region: "colonies", at: [OVER[0] + 8, OVER[1] - 6], dist: 240, tilt: 44, yaw: 0, ease: "io" },
    { t: SW + 3.6, region: "crossing", at: [(MK[0] + JF[0]) / 2, (MK[1] + JF[1]) / 2], dist: 34, tilt: 50, yaw: -12, ease: "out" },
    { t: D, region: "crossing", at: [(MK[0] + JF[0]) / 2 + 2, (MK[1] + JF[1]) / 2 - 1], dist: 30, tilt: 52, yaw: -6, ease: "io" },
  ],
  dives: [{ t: SW, over: OVER, from: { region: "colonies", at: [OVER[0] + 8, OVER[1] - 6], dist: 240, tilt: 44, yaw: 0 },
            to: { region: "crossing", at: [(MK[0] + JF[0]) / 2, (MK[1] + JF[1]) / 2], dist: 40, tilt: 50, yaw: -12, fov: 31 } }],
  clouds: { colonies: { scatter: { seed: 3 } }, crossing: { shadows: true } },
  units: [
    { side: "u", type: "inf", n: 3, region: "crossing", keys: [[0, ...US1]], face: FACE, arrive: false },
    { side: "u", type: "inf", n: 3, region: "crossing", keys: [[0, ...US2]], face: FACE, arrive: false },
    { side: "u", type: "inf", n: 3, region: "crossing", keys: [[9.5, ...US3a], [15.5, ...US3b]], face: FACE, arrive: false },
    { side: "u", type: "art", n: 1, region: "crossing", keys: [[0, ...GUN]], face: FACE, arrive: false },
  ],
  labels: [{ text: "Delaware River", at: off(MK, 4.5, -6), t0: 11.2, t1: 15.0, region: "crossing" },
           { text: "Trenton", at: VX.place("Trenton", "colonies"), t0: 0.6, t1: 4.0, region: "colonies" }],
};
