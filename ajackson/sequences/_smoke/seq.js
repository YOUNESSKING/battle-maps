// _smoke (Battle 20 engine/world check, not a film scene): the gulf wide map (zoom-8 frame), a cloud dive into Chalmette (zoom-10 frame),
// GM line-block troops: two American units on Jackson's line, a battery, two British units walking up to the line, one gun firing.
// Coordinates: VX.place(name, region) / VX.ll(lat, lon, region) convert the base-frame geography into each region's frame.
const D = 16, SW = 7.0;
const RE = VX.place("Jackson's line, river end", "chalmette"), EL = VX.place("Jackson's line, elbow", "chalmette");
const lerp2 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const dir = [EL[0] - RE[0], EL[1] - RE[1]], L = Math.hypot(...dir), u = [dir[0] / L, dir[1] / L], front = [-u[1], u[0]];   // front = right of river -> wood = downstream
const FACE = Math.atan2(front[1], front[0]);                                       // the Americans face the British (downstream)
const off = (p, d, s = 0) => [p[0] + front[0] * d + u[0] * s, p[1] + front[1] * d + u[1] * s];
const US1 = off(lerp2(RE, EL, 0.3), -0.35), US2 = off(lerp2(RE, EL, 0.72), -0.35), GUN = off(lerp2(RE, EL, 0.5), -0.25);
const GB1a = off(lerp2(RE, EL, 0.75), 9), GB1b = off(lerp2(RE, EL, 0.75), 3.2), GB2a = off(lerp2(RE, EL, 0.35), 10), GB2b = off(lerp2(RE, EL, 0.35), 4.0);
const OVER = VX.place("Jackson's line, river end", "gulf");                          // the same spot on the zoom-8 gulf map
window.SEQ = {
  name: "_smoke", D, seed: 1815, date: "1815-01-08",
  regions: ["gulf", "chalmette"],
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  keys: [
    { t: 0, region: "gulf", at: [OVER[0] - 30, OVER[1] - 20], dist: 420, tilt: 40, yaw: 0 },
    { t: 3.0, region: "gulf", at: [OVER[0] - 6, OVER[1] - 4], dist: 260, tilt: 44, yaw: 0, ease: "io" },
    { t: SW + 3.6, region: "chalmette", at: [RE[0] + 3.5, RE[1] - 1.5], dist: 34, tilt: 50, yaw: -12, ease: "out" },
    { t: D, region: "chalmette", at: [RE[0] + 4.5, RE[1] - 2.0], dist: 30, tilt: 52, yaw: -6, ease: "io" },
  ],
  dives: [{ t: SW, over: OVER, from: { region: "gulf", at: [OVER[0] - 6, OVER[1] - 4], dist: 260, tilt: 44, yaw: 0 },
            to: { region: "chalmette", at: [RE[0] + 3.0, RE[1] - 1.2], dist: 40, tilt: 50, yaw: -12, fov: 31 } }],
  clouds: { gulf: { scatter: { seed: 3 } }, chalmette: { shadows: true } },
  units: [
    { side: "u", type: "inf", n: 3, region: "chalmette", keys: [[0, ...US1]], face: FACE, arrive: false },
    { side: "u", type: "inf", n: 3, region: "chalmette", keys: [[0, ...US2]], face: FACE, arrive: false },
    { side: "u", type: "art", n: 1, region: "chalmette", keys: [[0, ...GUN]], face: FACE, arrive: false },
    { side: "r", type: "inf", n: 3, region: "chalmette", keys: [[9.5, ...GB1a], [15.5, ...GB1b]], face: FACE + Math.PI, arrive: false },
    { side: "r", type: "inf", n: 3, region: "chalmette", keys: [[9.5, ...GB2a], [15.5, ...GB2b]], face: FACE + Math.PI, arrive: false },
  ],
  labels: [{ text: "Rodriguez Canal", at: off(lerp2(RE, EL, 0.55), 0.6), t0: 11.2, t1: 15.0, region: "chalmette" },
           { text: "New Orleans", at: VX.place("New Orleans", "gulf"), t0: 0.6, t1: 4.0, region: "gulf" }],
  fx: { guns: [{ region: "chalmette", at: GUN, dir: front, shots: [12.2, 14.0], impact: off(lerp2(RE, EL, 0.6), 7) }] },
};
