// vicksburg/engine/scene.js: the generic GM3D scene runtime. Builds everything the approved v8 clip (research/style_tests/gm3d/clip/index.html)
// builds, from window.SEQ (the scene's seq.js; schema in README.md), as a pure function of t on ONE paused GSAP timeline (window.__tl, created
// in template.html). Order per frame: world.update(t) (camera, light, water, bridges) -> beforeRender: fx.update (clouds, smoke, fire, cannon) +
// troop boxes / arrows in the scene -> render -> pinned names / banners (DOM) -> overlay (O.update chained on tl).
// NOTE on determinism: fx.js seeds every emitter from its creation order inside one region's fx instance, so the build order below is fixed
// (per region: fires, smoke lines, volleys, guns (cannon, flash, impact per shot), impacts, flashes, campfires). Re-ordering an fx list changes
// the random smoke (still deterministic, but a different frame).
import * as THREE from "three";
import { initWorld } from "./world.js";
import { createFX, loadCloudNoise } from "./fx.js";

const S = window.SEQ, VX = window.VX, tl = window.__tl;
if (!S) throw new Error("scene.js: window.SEQ missing (seq.js)");
const EB = S.engineBase || "engine/", WB = S.worldBase || "worlds/";
const W = 1280, H = 720, SC = 1.5;   // overlay space = 1.5 x canvas px (authored at 1920x1080)
const GEO = window.GM3D_GEO, REG = window.GM3D_REGIONS || {};
const U = 1 / GEO.mpu, M = GEO.mpu;   // world units per metre / metres per unit
const lerp = (a, b, k) => a + (b - a) * k, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const sstep = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const hsh = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const NAMES = S.regions;
const kindOf = (n) => REG[n].kind || (n === "wide" || REG[n].box[2] > 300 ? "wide" : "close");
const isWide = (n) => kindOf(n) === "wide";
const RO = (n) => ({ troopScale: isWide(n) ? 10 : 1, fxScale: isWide(n) ? 40 : 9, seed: isWide(n) ? 1863 : 1517, ...((S.regionOpts || {})[n] || {}) });
const firstClose = NAMES.find((n) => !isWide(n)) || NAMES[0];
const FACE = (f, side) => f == null ? (side === "u" ? Math.PI : 0) : typeof f === "string" ? VX.FACE[f] : f;
const SIDE_COL = { u: "#2c57b7", r: "#be3a2a" }, ARROW_COL = { u: "#4f73c0", r: "#b8574c" };
const D = S.D;

// ---------------- dives (v8 cloud dive, timings relative to the swap t) ----------------
// d.off: per-dive phase offsets relative to the swap that override VX.DIVE_OFF (e.g. { emerge: 0.2, clear: 0.45 } = a shorter white-out)
const DIVES = (S.dives || []).map((d) => { const o = {}; for (const k in d.off || {}) o[k] = d.t + d.off[k]; return { ...d, ...VX.diveTimes(d.t), ...o, over: d.over || d.to.at }; }).sort((a, b) => a.SW - b.SW);
const NODIVE = { ...VX.diveTimes(1e7), over: [0, 0], from: {}, to: {} };
const diveKeys = (d) => { const f = d.from, to = d.to, ov = d.over, k = (to.dist || 40) / 40, K = d.keys || {};
  return [
    { t: d.push, region: f.region, at: f.at, dist: f.dist ?? 545, tilt: f.tilt ?? 44, yaw: f.yaw ?? 0, fov: f.fov ?? 30, night: f.night || 0, ...K.push },
    { t: d.deck, region: f.region, at: [ov[0], ov[1] + 1], dist: 115, tilt: 11, yaw: 1, fov: 30, ease: "in", night: f.night || 0, ...K.deck },
    { t: d.SW, region: f.region, at: [ov[0], ov[1]], dist: 66, tilt: 8, yaw: 1, fov: 30, ease: "lin", night: f.night || 0, ...K.swFrom },   // same log-speed as the end of the cubic
    { t: d.SW, region: to.region, at: [ov[0], ov[1] - 0.4], dist: 93 * k, tilt: 16, yaw: 2, fov: 31, ease: "lin", night: to.night || 0, ...K.swTo },
    { t: d.emerge, region: to.region, at: [lerp(ov[0], to.at[0], 0.31), lerp(ov[1], to.at[1], 0.31)], dist: 61 * k, tilt: 27, yaw: 0.5, fov: 31.5, ease: "lin", night: to.night || 0, ...K.emerge },
    { t: d.land, region: to.region, at: to.at, dist: to.dist ?? 40, tilt: to.tilt ?? 38, yaw: to.yaw ?? -2, fov: to.fov ?? 32, ease: "out", night: to.night || 0, ...K.land },
  ]; };
const KEYS = (S.keys || []).map((k, i) => ({ k, i })).concat(DIVES.flatMap((d) => diveKeys(d)).map((k, i) => ({ k, i: 1e6 + i })))
  .sort((a, b) => a.k.t - b.k.t || a.i - b.i).map((q) => q.k);
// the dive that "owns" time t for a list (the last whose window has started, else the first)
const act = (L, t, lead = 2) => { if (!L.length) return null; let a = L[0]; for (const d of L) if (d.push - lead <= t) a = d; return a; };
const actSW = (L, t) => { if (!L.length) return null; let a = L[0]; for (const d of L) if (d.SW - 1 <= t) a = d; return a; };   // target side: from 1 s before the swap

// ---------------- world ----------------
const FXL = (() => { const F = S.fx || {}; if (Array.isArray(F)) return F.map((e) => ({ ...e }));   // ordered list form [{kind, ...}]
  const L = []; for (const [k, kind] of [["fires", "fire"], ["smokeLines", "smokeLine"], ["volleys", "volleys"], ["guns", "gun"], ["impacts", "impact"], ["flashes", "flash"], ["campfires", "campfire"]])
    for (const e of F[k] || []) L.push({ ...e, kind: e.kind || kind }); return L; })();
for (const e of FXL) if (e.kind === "volleys") e.kind = "smokeLine";
// bridge burn times: features[region].bridges[i].burn, else a fire on that bridge burns it 3.2 s after it catches (burn: false = never)
const FEAT = JSON.parse(JSON.stringify(S.features || {}));
for (const e of FXL) if (e.kind === "fire" && e.bridge != null && e.burn !== false) { const r = e.region || firstClose, f = (FEAT[r] = FEAT[r] || {}), b = (f.bridges = f.bridges || []);
  b[e.bridge] = b[e.bridge] || {}; if (b[e.bridge].burn == null) b[e.bridge].burn = e.burn ?? e.t0 + 3.2; }
const world = initWorld(document.getElementById("gl"), { base: WB, regions: NAMES, keys: KEYS, width: W, height: H, antialias: false, shadowSize: S.shadowSize || 1536, features: FEAT });
await world.ready;
const _t0 = performance.now(), _log = (m) => { if (S.debug) console.log("vx " + ((performance.now() - _t0) / 1000).toFixed(1) + "s " + m); };
_log("world ready");
const HT = (r) => (x, y) => world.heightAt(x, y, r);
const G = (r, p, h0 = 0) => [p[0], world.heightAt(p[0], p[1], r) + (p[2] ?? h0), p[1]];   // map [x, y, h above ground] -> world

// ---------------- fx: one instance per region scene (same camera + renderer) ----------------
const SUN = S.sun || [-0.7, 0.48, -0.4];
const FX = {};
for (const n of NAMES) { const ro = RO(n); FX[n] = createFX({ scene: world.regions[n].scene, camera: world.camera, renderer: world.renderer, unitsPerMeter: U, fxScale: ro.fxScale,
  wind: S.wind || [20, -7], sunDir: SUN, heightAt: HT(n), duration: D, seed: ro.seed }); }
for (const n of NAMES) FX[n].patchGround(world.regions[n].terrain.material);

// ---------------- clouds (v6/v8 look): wide = volumetric fair-weather cumulus + the dive deck; close = the dive's torn stratus sheets ----------------
const NOISE = await loadCloudNoise(EB + "cloudtex/noise128.bin"); _log("noise");
const lnr = (i, k, med, sg, lo, hi) => { const g1 = hsh(i, k), g2 = hsh(i, k + 1), gn = Math.sqrt(-2 * Math.log(Math.max(1e-4, g1))) * Math.cos(6.2832 * g2); return Math.min(hi, Math.max(lo, med * Math.exp(sg * gn))); };
const CW_DAY = { sun: [1.0, 0.95, 0.85], ambTop: [0.50, 0.55, 0.65], ambBot: [0.24, 0.28, 0.36], nSun: [0.12, 0.15, 0.20], nAmbTop: [0.27, 0.32, 0.40], nAmbBot: [0.13, 0.16, 0.21] };
// night erosion ramps from the camera keys: half the wide clouds erode in the 0.4 s before the camera cuts to night in this region
const nightRamps = (n, ne) => { const R = []; let prev = 0; for (const k of KEYS) { if (k.region !== n) continue; const nv = k.night || 0; if (nv !== prev) { R.push([k.t - 0.4, k.t, prev * ne, nv * ne]); prev = nv; } } return R; };
const rampAt = (R, t) => { let v = R.length ? R[0][2] : 0; for (const [a, b, x, y] of R) if (t >= a) v = lerp(x, y, sstep(a, b, t)); return v; };
const VC = {};
for (const n of NAMES) {
  const C = (S.clouds || {})[n] ?? {}; if (C === false) continue;
  const fx = FX[n], box = REG[n].box;
  if (isWide(n)) {
    const DF = DIVES.filter((d) => d.from.region === n);
    const keep = (C.keepClear || []).map((q) => [q[0], q[1], q[2], q[3] ?? 1, q[4] ?? 1]);
    const offWide = (x, z, r) => DF.some((d) => Math.hypot(x - d.over[0], (z - (d.over[1] + 6)) * 1.15) < 118 + 0.5 * r) || keep.some(([cx, cz, R, ky, rk]) => Math.hypot(x - cx, (z - cz) * ky) < R + rk * r);
    // fair-weather cumulus: Poisson clusters of 2-5 clouds (a big parent + children), log-normal radii, clear sky between (v6)
    const sc = { box: [box[0] + 50, box[1] - 30, box[2] - 140, box[3]], med: 30, tries: 600, seed: 0, ...(C.scatter || {}) };
    if (sc.n == null) sc.n = Math.round(14 * (sc.box[2] * sc.box[3]) / (860 * 640));
    const wsp = [], sd = sc.seed;
    for (let c = 0, k = 0; c < sc.tries && k < sc.n; c++) {
      const cx = sc.box[0] + hsh(c + sd, 61) * sc.box[2], cz = sc.box[1] + hsh(c + sd, 62) * sc.box[3], R0 = lnr(c + sd, 63, sc.med, 0.6, 12, 90);
      if (offWide(cx, cz, R0) || wsp.some(([a, b, q]) => Math.hypot(a - cx, b - cz) < q + R0 + 10)) continue;
      k++; wsp.push([cx, cz, R0]); const kids = 1 + Math.floor(hsh(c + sd, 65) * 4);
      for (let j = 0; j < kids; j++) { const i2 = (c + sd) * 7 + j, a = hsh(i2, 66) * 6.283, r = lnr(i2, 67, R0 * 0.45, 0.6, 7, R0 * 0.9), dd = R0 * (0.9 + 0.8 * hsh(i2, 69)) + r * 0.6;
        const x = cx + Math.cos(a) * dd, z = cz + Math.sin(a) * dd * 0.8; if (!offWide(x, z, r)) wsp.push([x, z, r]); } }
    const edge = C.corners || [], wisp = C.wisps || [], deck = [];
    // the dive deck: flat (H/R ~0.3) sheet cumulus around the target, dense in the camera's column (no gap to fall through), ragged towards the rim
    for (const d of DF) { const cx0 = d.over[0], cz0 = d.over[1] + 6;
      for (let i = 0, gx = cx0 - 118; gx < cx0 + 122; gx += 22) for (let gz = cz0 - 112; gz < cz0 + 108; gz += 22, i++) {
        const x = gx + (hsh(i, 5) - 0.5) * 18, z = gz + (hsh(i, 6) - 0.5) * 18, r = Math.hypot(x - cx0, (z - cz0) * 1.15);
        if (hsh(i, 7) < lerp(0.95, 0.5, clamp((r - 30) / 90))) deck.push([x, z, 13 + hsh(i, 8) * 12, d]); }
      for (const [dx, dz, r] of [[0, 0, 30], [-6, 11, 26], [8, -7, 26], [3, 20, 26], [-11, -9, 24], [13, 7, 24]]) deck.push([d.over[0] + dx, d.over[1] + dz, r, d]); }
    const cl = wsp.map(([x, z, r], i) => [x, z, r, 3 + r * (0.18 + 0.16 * hsh(i, 13)), 49 + hsh(i, 11) * 9, 0])
      .concat(edge.map(([x, z, r], i) => [x, z, r, r * 0.2, 58 + i * 4, 0]))
      .concat(wisp.map(([x, z, r], i) => [x, z, r, 4 + r * 0.12, 52 + i * 2, 0]))
      .concat(deck.map(([x, z, r, d], i) => [x, z, r, r * (0.26 + 0.1 * hsh(i, 14) + 0.12 * clamp(1 - Math.hypot(x - d.over[0], z - (d.over[1] + 4)) / 60)), 58 + hsh(i, 12) * 3, 1]))
      .concat(C.extra || []);
    if (!cl.length) continue;
    const NR = C.erode0 || ((R) => (t) => rampAt(R, t))(nightRamps(n, C.nightErode ?? 0.4));
    // after the camera has left a dive (swap + 1 s) the wide clouds go back to their pre-dive look, unless keepDiveLook (v8 kept the inside-cloud
    // parameters for the rest of the clip, incl. the night flashback: the regression scene sets keepDiveLook to reproduce v8 exactly)
    const AD = (t) => { const d = act(DF, t); return !d || (!C.keepDiveLook && t > d.SW + 1) ? NODIVE : d; };
    VC[n] = fx.vclouds({ noise: NOISE, clouds: cl, bounds: C.bounds || [box[0] - 20, box[1] - 70, box[0] + box[2] - 40, box[1] + box[3]], texel: 1, slab: [44, 104], tile: 125, groupScale: 3.0, amp: 5, soft: 1.7, flatPow: 0.3, sigma: 0.75,
      stepIn: 0.25, stepK: 0.0035, lightStep: 1.4, lodDist: 260, nearFade: 3, maxSteps: 260, resolution: 0.7, warp: 0.06, fine: 0.12, wisp: 0.45, inner: 0.8,
      weights: [1.0, 0.5, 1, 0.5], group0: [0.55, 0.3, 1.4, 0.5], blur: 1.0, sharp: 1, shadow: 0.75, shadowDir: [0.3, 1, 0.65], drift: [0.10, -0.035], evolve: 0.0025, floor: 0.05,
      sunK: 1.4, ambK: 0.18, lightK: 3.2,
      // deck: no billow-up; group-1 erosion is a coverage FRONT sweeping from the frame edges in to the camera's column while the deck's density
      // ramps up from translucent grey veils; after the swap the deck is gone; night: half the wide clouds (erosion ramp from the keys)
      erode: (t) => { const d = act(DF, t) || NODIVE; return [NR(t), t > d.SW + 0.5 ? 9 : lerp(1.6, 0, sstep(d.deckIn - 0.1, d.deckIn + 0.6, t))]; },
      deck: (t) => { const d = act(DF, t) || NODIVE; return { x: d.over[0], z: d.over[1], r: 110, front: 3.5 * (1 - sstep(d.deckIn + 0.1, d.full, t)), k: lerp(0, 1, sstep(d.deckIn, d.deckIn + 0.6, t)) }; },
      ms: (t) => { const d = AD(t); return lerp(0.22, 0.42, sstep(d.full - 0.2, d.inside, t)); }, expo: (t) => { const d = AD(t); return lerp(1, 0.93, sstep(d.full - 0.2, d.inside, t)); },
      colors: (t) => { const d = AD(t), k = sstep(d.full - 0.2, d.inside, t);   // inside the cloud: cooler, bright grey with blue-grey mottles (his 637.0 s)
        const c = sstep(d.deckIn, d.deckIn + 0.5, t) * (1 - k), q = Math.max(k, c);   // his deck reads neutral-cool grey-white, his wide clouds warm
        return { sun: [lerp(1.0, 0.95, q), lerp(0.95, 0.97, q), lerp(0.85, 0.94, q)], ambTop: [lerp(0.50, 0.66, q), lerp(0.55, 0.71, q), lerp(0.65, 0.76, q)], ambBot: [lerp(0.24, 0.40, q), lerp(0.28, 0.46, q), lerp(0.36, 0.54, q)],
          nSun: CW_DAY.nSun, nAmbTop: CW_DAY.nAmbTop, nAmbBot: CW_DAY.nAmbBot, ambK: lerp(0.18, 0.36, q), lightK: lerp(3.2, 1.4, k) * lerp(1, 0.8, c), sunK: lerp(1.4, 1.2, q) }; },
      sigmaK: (t) => { const d = AD(t); return lerp(1, 0.5, sstep(d.full, d.inside, t)); }, ...(C.opts || {}) });
  } else {
    // close: 10 separate torn flat stratus sheets with holes just under the landing camera (~35-50 % of the frame at the snap), lit tops +
    // grey-blue cores; they clear off the landing point after ~1.8 s and tear away by ~4 s; the system switches off ~3.8 s after emerge
    const DT = DIVES.filter((d) => d.to.region === n), ccl = [];
    let bx = null;
    for (const d of DT) { const c = d.centre || [Math.round(d.to.at[0]), Math.round(d.to.at[1])]; d._c = c;
      bx = bx ? [Math.min(bx[0], c[0] - 50), Math.min(bx[1], c[1] - 45), Math.max(bx[2], c[0] + 50), Math.max(bx[3], c[1] + 45)] : [c[0] - 50, c[1] - 45, c[0] + 50, c[1] + 45];
      [[-11, -9, 9], [11, -11, 8], [-15, 7, 10], [14, 11, 9], [-1, 19, 8], [0, -17, 7], [-23, -2, 7], [21, 0, 7], [-8, 0, 6], [7, 1, 6]]
        .forEach(([dx, dz, r], i) => ccl.push([c[0] + dx, c[1] + dz, r * 1.25, 2.6 + hsh(i, 24) * 1.2, 16.5 + hsh(i, 25) * 3, 1])); }
    if (ccl.length) {
      const AT = (t) => actSW(DT, t) || NODIVE;
      VC[n] = fx.vclouds({ noise: NOISE, clouds: ccl.concat(C.extra || []), bounds: C.bounds || bx, texel: 0.2, skip: 8, slab: [14, 26], tile: 9, amp: 1.5, soft: 0.8, sigma: 1.1, wisp: 0.8, inner: 0.7, flatPow: 0.35, blobs: 6,
        stepIn: 0.12, stepK: 0.004, lightStep: 0.35, lodDist: 90, nearFade: 1.2, maxSteps: 220, resolution: 0.7, warp: 0.18, fine: 0.1, weights: [1.0, 0.5, 1, 0.6], blur: 1.0, sharp: 1,
        shadow: 0.45, shadowDir: [0.3, 1, 0.65], drift: [0.5, -0.18], evolve: 0.006, sunK: 0.95, ambK: 0.5, lightK: 1.6,
        colors: { sun: [1.0, 0.97, 0.9], ambTop: [0.62, 0.67, 0.74], ambBot: [0.30, 0.35, 0.44] },
        erode: (t) => { const d = AT(t); return [0, lerp(0.35, 0.7, sstep(d.emerge, d.emerge + 1.2, t)) + lerp(0, 2.2, sstep(d.emerge + 1.0, d.emerge + 3.3, t))]; },
        deck: (t) => { const d = AT(t); return { x: (d._c || [0])[0] + 4, z: (d._c || [0, 0])[1], r: 9, front: 3 * sstep(d.emerge + 0.9, d.emerge + 1.6, t), k: 1 }; },   // the landing point clears first
        opacity: (t) => { const d = AT(t); return t < d.SW - 1 ? 0 : 1 - sstep(d.emerge + 3.2, d.emerge + 3.8, t); }, ...(C.opts || {}) });
    }
    // the battle's drifting cloud shadows (as in v3): the old noise layer, shadows only (its own pass stays off)
    if (C.shadows !== false) fx.clouds({ base: 48 * M, top: 104 * M, tile: 260 * M, coverage: 0.36, shadow: 0.40, opacity: 0, detail: 0.5, ...(C.shadowOpts || {}) });
  }
}

_log("clouds");
// ---------------- fx events from SEQ.fx ----------------
const FIRE_GM = { flameColor: [0.62, 0.1, 0.015, 0.1, 0.2, 0.04], glowColor: [1.0, 0.42, 0.12], glowA: 0.16, lightDay: 0.12 };
const FIRE_PRESET = {
  // a bridge burning (v7: unlit warm grey smoke, leaning, wider top; flames x1.8; ramp 1.2 s)
  bridge: { size: 1.0, tongues: 8, flameK: 2.7, flameA: 0.5, glowSize: 2.2, flameRate: 2.4, emberRate: 3, smokeRate: 7.0, smokeLife: 16, rise: 58, ramp: 1.2, fadeOut: 0.5, smoulder: 0, lightIntensity: 2, smokeTint: [0.30, 0.27, 0.24], smokeMode: 4.0, smokeAlpha: 0.35, smokeS0: 0.5, smokeGrow: 2.6, smokeWind: 1.8, smokeTurb: 0.6, smokeFade: 0.15 },
  // the morning after: still smouldering
  smoulder: { size: 0.45, tongues: 3, flameRate: 3, emberRate: 1, glowSize: 1.2, smokeRate: 1.2, smokeLife: 8, rise: 10, ramp: 0.1, light: false, smokeTint: [0.3, 0.29, 0.28], smokeWind: 1.0, smokeTurb: 1.2 },
  // seen from altitude on the wide map: a fleck of fire under a thin dark leaning column (v6)
  column: { size: 6, tongues: 3, flameK: 0.75, flameA: 0.55, flameRate: 7, emberRate: 1, glowSize: 1.6, smokeRate: 3.0, smokeLife: 14, rise: 18, light: false, ramp: 2, smokeTint: [0.12, 0.115, 0.11], smokeAlpha: 0.6, smokeS0: 0.3, smokeGrow: 0.8, smokeWind: 0.5, smokeTurb: 0.5, smokeFade: 0.2 },
  // a burning steamer at night on the wide map (Henry Clay)
  steamer: { tongues: 3, size: 0.55, glowSize: 18, smokeRate: 1.8, smokeLife: 10, rise: 12, smokeWind: 1.0, ramp: 0.8, fadeOut: 0.6, lightIntensity: 3 },
  // a building / town fire on a close map
  house: { size: 0.5, tongues: 4, flameK: 1.6, glowSize: 1.4, flameRate: 3, emberRate: 2, smokeRate: 3.0, smokeLife: 12, rise: 30, ramp: 1.0, lightIntensity: 1.5, smokeTint: [0.28, 0.26, 0.24], smokeMode: 4.0, smokeAlpha: 0.35, smokeS0: 0.4, smokeGrow: 2.0, smokeWind: 1.4, smokeTurb: 0.6, smokeFade: 0.15 },
};
const GUN_PRESET = { field: { size: 1.0 }, battery: { size: 1.8, puffs: 8, dust: 0, life: 5, pool: 0, flash: 1.4, flashLife: 0.13, plume: 0.45, height: 45, alpha: 0.16 } };
const CAMPFIRE = { flameRate: 7, glowSize: 3.2, glowA: 0.3, glowColor: [1.1, 0.42, 0.12], flameColor: [1.05, 0.22, 0.04, 0.2, 0.35, 0.1], poolRadius: 4, smoke: false, visible: () => 1 };
const SMOKE_GM = { cluster: [1.0, 1.0], fadeAfter: 6, fadeTo: 0.12, look: "gmTall" };   // v7: separate battalion curtains, thin to 12 % within 6 s
const bridgeEnds = (r, i) => { const R = world.regions[r], BR = R.features.bridges[i], dir = [Math.cos(-BR.angle), -Math.sin(-BR.angle)], deckY = BR.deck * R.ys, L2 = BR.len / 2;
  return [[BR.x - dir[0] * L2, deckY + 0.05, BR.z - dir[1] * L2], [BR.x + dir[0] * L2, deckY + 0.05, BR.z + dir[1] * L2], BR.wl * R.ys + 0.01]; };
const GLOWS = [], BATTERY_SHOTS = {};
for (const e of FXL) {
  const r = e.region || firstClose, fx = FX[r]; if (!fx) throw new Error("fx entry for unknown region " + r);
  const P = (p, h0) => p && p.abs ? p.abs : G(r, p, h0);
  if (e.kind === "fire") {
    let pos, to = e.to ? P(e.to, 0.4) : undefined, wl = null;
    if (e.bridge != null) { const [A, B, w] = bridgeEnds(r, e.bridge); pos = A; to = B; wl = w; } else pos = P(e.at, 0.4);
    fx.fire(pos, e.t0, e.t1, { ...FIRE_GM, ...(FIRE_PRESET[e.preset] || {}), ...(to ? { to } : {}), ...(e.opts || {}) });
    // v7: a burning bridge lights the water under it (flickering orange glow on the river), until waterGlow.t1
    if (e.waterGlow) GLOWS.push({ fx, A: pos, B: to || pos, y: e.waterGlow.y ?? wl ?? pos[1], t0: e.t0, t1: e.waterGlow.t1 ?? e.t1 });
  } else if (e.kind === "smokeLine") {
    fx.smokeLine(e.pts.map((p) => G(r, p, 0.06)), e.t0, e.t1, { ...SMOKE_GM, ...(e.opts || {}) });
  } else if (e.kind === "gun") {
    (e.shots || []).forEach((s0, i) => { const s = typeof s0 === "number" ? { t: s0 } : s0, at = s.at || e.at;
      fx.cannon(G(r, at, e.h ?? 0.05), s.t, { ...(GUN_PRESET[e.preset] || GUN_PRESET.field), dir: s.dir || e.dir || [1, 0], ...(e.size != null ? { size: e.size } : {}), ...(e.opts || {}) });
      const fl = s.flash !== undefined ? s.flash : e.flash; if (fl) fx.flash(G(r, fl.at || at, fl.h ?? 0.25), s.t, { size: 2.6, life: 0.15, color: [1.1, 0.45, 0.12], alpha: 1.0, pool: 3, ...(fl.opts || {}) });
      const imp = s.impact !== undefined ? s.impact : e.impact; if (imp) fx.impact(G(r, imp, 0), s.t + (s.delay ?? e.delay ?? 0.85), { size: 0.9, ...(e.impactOpts || {}) });
      (BATTERY_SHOTS[r] = BATTERY_SHOTS[r] || []).push({ t: s.t, x: (e.unitAt || at)[0], y: (e.unitAt || at)[1] }); });
  } else if (e.kind === "impact") fx.impact(G(r, e.at, 0), e.t, { size: 0.9, ...(e.opts || {}) });
  else if (e.kind === "flash") fx.flash(G(r, e.at, 0.25), e.t, { size: 2.6, life: 0.15, color: [1.1, 0.45, 0.12], alpha: 1.0, pool: 3, ...(e.opts || {}) });
  else if (e.kind === "campfire") (e.pts || []).forEach((p, i) => fx.campfire(G(r, p, 0.15), { t0: e.t0 ?? 0, t1: e.t1 ?? D + 1, size: 1.1 + hsh(i, 65) * 0.5, ...CAMPFIRE, ...(e.opts || {}) }));
  else if (e.kind === "custom") fx.custom(e.fn);
  else throw new Error("unknown fx kind " + e.kind);
}
for (const g of GLOWS) g.fx.custom((t, push) => { if (t < g.t0 || t > g.t1) return; const e = sstep(g.t0, g.t0 + 1.5, t) * (1 - sstep(g.t1 - 1.0, g.t1 - 0.2, t));
  for (let j = 0; j < 3; j++) { const f = 0.75 + 0.25 * Math.sin(t * (7.3 + j) + j * 2.1) * Math.sin(t * 3.1 + j);
    push(lerp(g.A[0], g.B[0], 0.25 + 0.25 * j), g.y, lerp(g.A[2], g.B[2], 0.25 + 0.25 * j), 1.1, 0.42 * e * f, 1.0, 0.38, 0.08); } });
for (const n of NAMES) FX[n].setNight(0);

// ---------------- the 3D gold title in world space (v5-v8): extruded gold over the map, its shadow on the ground, flies past the lens ----------------
const TBOX = { a: 0, x0: 0, y0: 0, x1: 0, y1: 0 };
let titleAt = () => {}, TREG = null;
if (S.title) {
  const TT = S.title, nextDive = DIVES.find((d) => d.push > TT.tOn) || null;
  const T_ON = TT.tOn, T_GROW = TT.tGrow ?? T_ON + 0.5, T_OFF = TT.tOff ?? (nextDive ? nextDive.deckIn - 0.3 : T_ON + 3), tA = TT.anchorT ?? T_ON + 0.91;
  const BLUR0 = TT.blurFrom ?? (nextDive ? nextDive.push + 0.6 : T_ON + 1.9);
  TREG = TT.region || world.cameraAt(tA).region;
  const TF = new FontFace("CGT", `url(${EB}assets/fonts/${TT.font || "cormorant-garamond-latin-700-normal.woff2"})`, { weight: "700" });   // title.font: another woff2 in assets/fonts (e.g. Cinzel for lining figures) await TF.load(); document.fonts.add(TF);
  const TTXT = TT.text, TCW = 2048, TCH = 640;
  const mkTitleCanvas = (face) => { const c = document.createElement("canvas"); c.width = TCW; c.height = TCH; const g = c.getContext("2d");
    g.textAlign = "center"; g.textBaseline = "middle"; let fs = TT.fontSize || 400; g.font = `700 ${fs}px "CGT", Georgia, serif`; if ("letterSpacing" in g) g.letterSpacing = "18px";
    const wm = g.measureText(TTXT).width; if (wm > TCW * 0.94) { fs = Math.floor(fs * TCW * 0.94 / wm); g.font = `700 ${fs}px "CGT", Georgia, serif`; }
    const X = TCW / 2, Y = TCH / 2 + 16 * fs / 400, kf = fs / 400;
    if (!face) { g.fillStyle = "#fff"; g.fillText(TTXT, X, Y); g.lineJoin = "round"; g.lineWidth = 6 * kf; g.strokeStyle = "#fff"; g.strokeText(TTXT, X, Y); return c; }
    const gr = g.createLinearGradient(0, Y - 170 * kf, 0, Y + 170 * kf); gr.addColorStop(0, "#fff1c4"); gr.addColorStop(0.38, "#e8c46c"); gr.addColorStop(0.62, "#c4923a"); gr.addColorStop(1, "#f2d48a");
    g.lineJoin = "round"; g.fillStyle = gr; g.fillText(TTXT, X, Y); g.lineWidth = 6 * kf; g.strokeStyle = gr; g.strokeText(TTXT, X, Y);
    g.globalCompositeOperation = "source-atop"; g.filter = `blur(${5 * kf}px)`;   // painted bevel, inside the letters only
    g.lineWidth = 22 * kf; g.strokeStyle = "rgba(255,246,214,0.85)"; g.save(); g.translate(-5 * kf, -6 * kf); g.strokeText(TTXT, X, Y); g.restore();
    g.strokeStyle = "rgba(112,74,20,0.85)"; g.save(); g.translate(6 * kf, 7 * kf); g.strokeText(TTXT, X, Y); g.restore();
    g.filter = `blur(${2 * kf}px)`; g.lineWidth = 3 * kf; g.strokeStyle = "rgba(120,84,28,0.9)"; g.strokeText(TTXT, X, Y);   // fine darker-gold edge, not a brown outline
    g.filter = "none"; const sp = g.createLinearGradient(X - 700, 0, X + 700, 0); sp.addColorStop(0.35, "rgba(255,255,240,0)"); sp.addColorStop(0.5, "rgba(255,252,232,0.32)"); sp.addColorStop(0.65, "rgba(255,255,240,0)");
    g.fillStyle = sp; g.fillRect(0, 0, TCW, TCH); g.globalCompositeOperation = "source-over"; return c; };
  const ttex = new THREE.CanvasTexture(mkTitleCanvas(true)); ttex.colorSpace = THREE.SRGBColorSpace; ttex.anisotropy = 4;
  const stex = new THREE.CanvasTexture(mkTitleCanvas(false)); stex.anisotropy = 4;
  // v6: the title is the nearest thing to the lens, so it gets its own pass after the map + clouds (depth cleared): nothing draws over it
  const TSC = new THREE.Scene(), TTL = new THREE.Group(); TSC.add(TTL);
  world.onFrame((w) => { if (w.region !== TREG || !TTL.visible) return; const r = w.renderer, ac = r.autoClear; r.autoClear = false; r.clearDepth(); r.render(TSC, w.camera); r.autoClear = ac; });
  world.update(tA); world.camera.updateMatrixWorld();
  const cq = world.camera.quaternion.clone(), cpos = world.camera.position.clone(), cfw = new THREE.Vector3(0, 0, -1).applyQuaternion(cq), cup = new THREE.Vector3(0, 1, 0).applyQuaternion(cq);
  const tD = (TT.depth ?? 0.28) * world.cameraAt(tA).dist, tW = (TT.width ?? 0.62) * tD, tH = tW * TCH / TCW;
  TTL.position.copy(cpos).addScaledVector(cfw, tD).addScaledVector(cup, (TT.up ?? 0.06) * tD); TTL.quaternion.copy(cq);
  const tMats = [], NL = 40, depth = tW * 0.035;
  for (let k = NL; k >= 0; k--) { const front = k === 0, f = k / NL, sh = 0.75 - 0.3 * f;
    const m = new THREE.MeshBasicMaterial({ map: front ? ttex : stex, transparent: true, alphaTest: 0.4, depthWrite: true, fog: false,
      color: front ? 0xffffff : new THREE.Color().setRGB(0.80 * sh, 0.60 * sh, 0.26 * sh) });
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(tW, tH), m); pl.position.set(-f * tW * 0.006, -f * tW * 0.008, -f * depth); pl.renderOrder = 20 + NL - k; TTL.add(pl); tMats.push(m); }
  // motion blur: ghosts of the face seen from the camera's poses a fraction of a frame earlier (the title is static, the camera rushes past it)
  const GH = 6, ghostMats = [], ghosts = [];
  for (let j = 0; j < GH; j++) { const m = new THREE.MeshBasicMaterial({ map: ttex, transparent: true, depthWrite: false, depthTest: false, fog: false, opacity: 0 });
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(tW, tH), m); pl.renderOrder = 19; pl.matrixAutoUpdate = false; TSC.add(pl); ghosts.push(pl); ghostMats.push(m); }
  const camAtT = new THREE.PerspectiveCamera(), tmpM = new THREE.Matrix4(), tmpM2 = new THREE.Matrix4();
  const camPose = (t, out) => { const cs = world.cameraAt(t), ty = world.heightAt(cs.at[0], cs.at[1], cs.region), tl_ = cs.tilt * Math.PI / 180, yw = cs.yaw * Math.PI / 180;
    out.position.set(cs.at[0] + Math.sin(yw) * Math.sin(tl_) * cs.dist, ty + Math.cos(tl_) * cs.dist, cs.at[1] + Math.cos(yw) * Math.sin(tl_) * cs.dist);
    out.up.set(0, 1, 0); out.lookAt(cs.at[0], ty, cs.at[1]); out.updateMatrixWorld(true); return out.matrixWorld; };
  const tShadow = FX[TREG].planeShadow({ tex: ttex, dir: [-0.22, 1, -0.12] });
  const tAx = new THREE.Vector3(1, 0, 0).applyQuaternion(cq).divideScalar(tW), tAy = new THREE.Vector3(0, 1, 0).applyQuaternion(cq).divideScalar(-tH);
  // v8: it lands ON the spoken words: readable from the start of the word (tOn), grows while it is said (to tGrow), leaves as the deck closes in
  titleAt = (t) => { const a = sstep(T_ON - 0.55, T_ON - 0.05, t) * (1 - sstep(T_OFF, T_OFF + 0.35, t)); TTL.visible = a > 0.002 && world.region === TREG;
    for (const m of tMats) m.opacity = a; TTL.scale.setScalar(0.94 + 0.06 * sstep(T_ON - 0.55, T_GROW, t)); tShadow(TTL.position, tAx, tAy, TTL.visible ? a : 0);
    TTL.updateMatrixWorld(true); const now = camPose(t, camAtT).clone(), blur = TTL.visible ? sstep(BLUR0, BLUR0 + 0.6, t) : 0;
    for (let j = 0; j < GH; j++) { ghosts[j].visible = blur > 0.01; if (!ghosts[j].visible) continue;
      const ts = t - (j + 1) * (0.5 / 30) / GH;   // 180-degree shutter
      tmpM.copy(now).multiply(tmpM2.copy(camPose(ts, camAtT)).invert()).multiply(TTL.matrixWorld);   // where the title sat in the frame at ts
      ghosts[j].matrix.copy(tmpM); ghosts[j].matrixWorldNeedsUpdate = true; ghostMats[j].opacity = a * blur * 0.32 * (1 - j / GH); }
    // screen box of the title (canvas px) + its alpha: pinned names under it fade out
    TBOX.a = TTL.visible ? a : 0; if (TBOX.a > 0) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; camPose(t, camAtT); camAtT.fov = world.cameraAt(t).fov; camAtT.aspect = W / H; camAtT.updateProjectionMatrix();
      for (const [u, v] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) { const q = new THREE.Vector3(u * tW, v * tH * 0.7, 0).applyMatrix4(TTL.matrixWorld).project(camAtT);
        if (q.z > 1) continue; const sx = (q.x + 1) / 2 * W, sy = (1 - q.y) / 2 * H; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
      Object.assign(TBOX, { x0, y0, x1, y1 }); } };
}

// ---------------- boats on rivers: steamers / transports (hull, house, two stacks, deck lamp, moonlit wake) and ironclad gunboats ----------------
const boatMat = new THREE.MeshLambertMaterial({ color: 0x2b2622 }), houseMat = new THREE.MeshLambertMaterial({ color: 0x6a6258 }), ironMat = new THREE.MeshLambertMaterial({ color: 0x2a2d30 });
const hullGeo = (() => { const sh = new THREE.Shape(); sh.moveTo(-1.1, -0.36); sh.lineTo(0.75, -0.36); sh.quadraticCurveTo(1.1, -0.3, 1.35, 0); sh.quadraticCurveTo(1.1, 0.3, 0.75, 0.36); sh.lineTo(-1.1, 0.36); sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: 0.32, bevelEnabled: false }); g.rotateX(-Math.PI / 2); g.translate(0, -0.12, 0); return g; })();
const mkBoat = (kind) => { const b = new THREE.Group(); b.add(new THREE.Mesh(hullGeo, kind === "gunboat" ? ironMat : boatMat));
  if (kind === "gunboat") {   // ironclad: low sloped casemate, one tall stack
    const cg = new THREE.CylinderGeometry(0.42, 0.62, 0.3, 4, 1); cg.rotateY(Math.PI / 4); cg.scale(1.8, 1, 0.75); const cm = new THREE.Mesh(cg, ironMat); cm.position.set(-0.05, 0.3, 0); b.add(cm);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.95, 6), boatMat); st.position.set(0.2, 0.85, 0); b.add(st);
  } else {
    const hs = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.26, 0.5), houseMat); hs.position.set(-0.25, 0.33, 0); b.add(hs);
    for (const sx of [0.15, 0.45]) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.9, 6), boatMat); st.position.set(sx, 0.8, 0); b.add(st); }
  }
  return b; };
const BOATS = [];
for (const B of S.boats || []) { const r = B.region || NAMES[0], R = world.regions[r], sz = B.size ?? (isWide(r) ? 1 : 0.1), n = B.n ?? 1, kinds = [].concat(B.kind || "steamer");
  for (let i = 0; i < n; i++) { const g = mkBoat(kinds[i % kinds.length]); g.scale.setScalar(sz); R.scene.add(g); BOATS.push({ B, i, g, r, R, sz }); } }
const boatAt = (o, t) => { const { B, i, R, sz } = o, on = t > B.t0 && t < B.t1;
  if (B.path) { const s = B.sAt ? B.sAt(t, i) : (B.s0 || 0) + (t - B.t0) * B.speed - i * (B.spacing ?? 4.2 * sz),   // sAt(t, i): any arc-length schedule (stops, drifting)
    p = VX.along(B.path, s), x = p[0], y = p[1]; return { x, y, h: world.heightAt(x, y, o.r) + (typeof B.h === "function" ? B.h(t, i) : (B.h ?? 0.35 * sz)), dx: p[2], dy: p[3], on }; }   // h(t, i): e.g. a boat sinking
  const vy = B.vy ?? 1.6, y = B.y0 + (t - B.t0) * vy - i * (B.dy ?? 4.2 * sz), p = VX.riverAtY(o.r, B.river ?? 0, y), q = VX.riverAtY(o.r, B.river ?? 0, y + Math.sign(vy || 1)), x = p[0] + (i % 2 ? 1 : -1) * (B.lane ?? 0.6 * sz);
  return { x, y: p[1], h: p[2] * R.ys + 0.35 * sz, dx: q[0] - p[0], dy: q[1] - p[1], on }; };
const placeBoats = (t) => { for (const o of BOATS) { const b = boatAt(o, t); o.g.position.set(b.x, b.h, b.y); o.g.rotation.y = Math.atan2(-b.dy, b.dx); o.g.visible = b.on; } };
for (const r of NAMES) { const L = BOATS.filter((o) => o.r === r); if (!L.length) continue;
  FX[r].custom((t, push) => { for (const o of L) { const b = boatAt(o, t), s = o.sz; if (!b.on) continue; const l = Math.hypot(b.dx, b.dy) || 1, dx = b.dx / l, dy = b.dy / l;
    if (o.B.lamp !== false) { push(b.x + dx * 0.5 * s, b.h + 0.6 * s, b.y + dy * 0.5 * s, 1.5 * s, 0.9, 1.3, 0.62, 0.22);   // deck lamp
      push(b.x - dx * 0.2 * s, b.h + 0.5 * s, b.y - dy * 0.2 * s, 4.2 * s, 0.26, 1.0, 0.45, 0.15); }   // its glow on the deck and water
    if (o.B.wake !== false) for (let k = 1; k <= 8; k++) { const d = (1.0 + k * 0.7) * s, sw = (0.15 + k * 0.12) * s, a = 0.45 * (1 - k / 9);   // the wake: two arms of foam behind the stern
      for (const sg of [-1, 1]) push(b.x - dx * d - dy * sg * sw, b.h - 0.1 * s, b.y - dy * d + dx * sg * sw, (0.9 + k * 0.12) * s, a, 0.5, 0.58, 0.68); } } }); }

// ---------------- troops: Style W boxes in the scene (or GM 3D blocks), arrows, generals' banners ----------------
const TR = document.getElementById("troops"), UNITS = [];
const posAt = (K, t) => { if (t <= K[0][0]) return [K[0][1], K[0][2]]; for (let i = 1; i < K.length; i++) if (t < K[i][0]) { const k = K[i][3] === "lin" ? clamp((t - K[i - 1][0]) / (K[i][0] - K[i - 1][0])) : sstep(K[i - 1][0], K[i][0], t); return [lerp(K[i - 1][1], K[i][1], k), lerp(K[i - 1][2], K[i][2], k)]; } const L = K[K.length - 1]; return [L[1], L[2]]; };
// owner 2026-11-18: boxes NEVER rotate; on a road march ("lin" key segments from VX.march) a unit becomes a column: box i follows the
// same path i * spacing behind the head (posAt at an earlier time), so the column bends with the road, crosses on the bridge, keeps its facing.
const marchSeg = (K, t) => { if (t <= K[0][0] || t >= K[K.length - 1][0]) return false; for (let i = 1; i < K.length; i++) if (t < K[i][0]) return K[i][3] === "lin"; return false; };
const marchK = (K, t) => (marchSeg(K, t - 0.6) + marchSeg(K, t - 0.3) + marchSeg(K, t) + marchSeg(K, t + 0.3) + marchSeg(K, t + 0.6)) / 5;
const speedAt = (K, t) => { const a = posAt(K, t - 0.25), b = posAt(K, t + 0.25); return Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.5; };
// withdrawal along a road (v8): joins the road just beyond its start in the join direction, column nose to tail at v (units/s), slows to v2 past slowX/slowY
const mkEscape = (e, start) => { const road = typeof e.road === "string" ? VX.road(e.region, e.road) : e.road, dir = e.join || "west", st = e.start || start;
  const ahead = { west: (p) => p[0] < st[0] - 0.3, east: (p) => p[0] > st[0] + 0.3, north: (p) => p[1] < st[1] - 0.3, south: (p) => p[1] > st[1] + 0.3 }[dir];
  let j; if (ahead) j = Math.max(0, road.findIndex(ahead)); else { j = 0; road.forEach((p, i) => { if (Math.hypot(p[0] - st[0], p[1] - st[1]) < Math.hypot(road[j][0] - st[0], road[j][1] - st[1])) j = i; }); }
  const path = [st, ...road.slice(j)], seg = []; let L = 0, sB = null;
  const before = e.slowX != null ? (p) => (dir === "east" ? p[0] <= e.slowX + 1e-3 : p[0] >= e.slowX - 1e-3) : e.slowY != null ? (p) => (dir === "south" ? p[1] <= e.slowY + 1e-3 : p[1] >= e.slowY - 1e-3) : null;
  for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); seg.push(d); L += d; if (before && before(path[i])) sB = L; }
  if (sB == null) sB = before ? 0 : L;
  const v = e.v ?? 2.1, v2 = e.v2 ?? 1.2, t0 = e.t0, tB = t0 + sB / v;
  return { path, seg, L, t0, from: e.from ?? 0, fade: e.fade !== undefined ? e.fade : ahead ? dir : null, s: (t) => t <= t0 ? 0 : t < tB ? (t - t0) * v : Math.min(L, sB + (t - tB) * v2) }; };
const escAt = (E, s) => { let i = 0; while (i < E.seg.length - 1 && s > E.seg[i]) { s -= E.seg[i]; i++; } const a = E.path[i], b = E.path[i + 1], f = clamp(s / (E.seg[i] || 1)), l = E.seg[i] || 1;
  return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), (b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
const edgeFade = (dir, s, lo, hi) => dir === "west" ? sstep(lo, hi, s.x) : dir === "east" ? sstep(lo, hi, W - s.x) : dir === "north" ? sstep(lo, hi, s.y) : dir === "south" ? sstep(lo, hi, H - s.y) : 1;
for (const u0 of S.units || []) { const r = u0.region || firstClose, ts = RO(r).troopScale, n = u0.n || 4, art = u0.type === "art";
  const u = { ...u0, region: r, n, face: FACE(u0.face, u0.side), bw: (u0.bw || (art ? 0.42 : 0.7)) * ts, bd: (u0.bd || (art ? 0.32 : 0.3)) * ts, gap: (u0.gap || 0.12) * ts,
    t0: u0.t0 ?? 0, t1: u0.t1 ?? 1e9, cap: u0.cap ?? u0.captured, capN: u0.capN ?? n, wob: (u0.wob ?? 1) * ts, march: u0.march ? 1 : 0 };
  if (u0.escape) { u.esc = mkEscape({ region: r, ...u0.escape }, posAt(u.keys, u0.escape.t0)); u.escFrom = u.esc.from; }
  UNITS.push(u); }
const TROOPS = window.TROOPS = window.TROOPS || new URLSearchParams(location.search).get("troops") || S.troops || "boxes";
const TM = await import("./troops3d.js");
const TRO = {};   // per region: boxes / arrows / blocks
for (const r of NAMES) { const hasU = UNITS.some((u) => u.region === r), hasA = (S.arrows || []).some((a) => (a.region || firstClose) === r); if (!hasU && !hasA) continue;
  const sc = world.regions[r].scene;
  TRO[r] = { BX: TROOPS !== "blocks" && hasU ? TM.createBoxes3D({ THREE, scene: sc, sun: SUN, ...(isWide(r) ? { lift: 0.03 * RO(r).troopScale, shadowOff: 0.075 * RO(r).troopScale } : {}) }) : null,
    AR3: TM.createArrows3D({ THREE, scene: sc, heightAt: HT(r), sun: SUN, style: TROOPS === "blocks" ? "gm" : "w" }),
    T3: TROOPS === "blocks" && hasU ? TM.createTroops3D({ THREE, scene: sc, heightAt: HT(r), units: UNITS.filter((u) => u.region === r), posAt, escAt, edgeFade,
      proj: (x, y) => world.projectMap(x, y, 0.02), troopScale: RO(r).troopScale, sun: SUN, shots: BATTERY_SHOTS[r] || [], trees: (world.regions[r].data || {}).trees, ...(S.troopsOpts || {}) }) : null }; }
// GM troops (v2, owner 2026-11-18): GM's movement arrows are a pale tint of the side colour (his French arrows (105,172,192) after his grade)
const ARROW_GM = { u: "#62a3db", r: "#d4705f" };
const ARROWS = (S.arrows || []).map((a) => { const r = a.region || firstClose, col = a.color || (TROOPS === "blocks" ? ARROW_GM : ARROW_COL)[a.side || "u"];
  return { ...a, region: r, w: Math.min(a.width ?? 0.24, 0.24) * RO(r).troopScale * (TROOPS === "blocks" ? 0.55 : 1),   // critic A8: v6/v8 width cap; GM troops v4: -45 %
    a3: TRO[r].AR3.add(a.pts, col) }; });
// generals: banners on poles (banner.js, STYLE_LOCK 2f item 1) + medallion portraits; any portrait: SEQ.generals = { key: { img, flag, name, full, side, role } }
const GENERALS = {
  grant: { img: "grant.png", side: "us", name: "Grant", full: "Ulysses S. Grant", role: "Major General" },
  pemberton: { img: "pemberton.png", side: "cs", name: "Pemberton", full: "John C. Pemberton", role: "Lieutenant General" },
  sherman: { img: "sherman.png", side: "us", name: "Sherman", full: "William T. Sherman", role: "Major General" },
  mcpherson: { img: "mcpherson.png", side: "us", name: "McPherson", full: "James B. McPherson", role: "Major General" },
  porter: { img: "porter.png", side: "us", name: "Porter", full: "David D. Porter", role: "Acting Rear Admiral" },
  grierson: { img: "grierson.png", side: "us", name: "Grierson", full: "Benjamin H. Grierson", role: "Colonel" },
  johnston: { img: "johnston.png", side: "cs", name: "Johnston", full: "Joseph E. Johnston", role: "General" },
  lincoln: { img: "lincoln.png", side: "us", name: "Lincoln", full: "Abraham Lincoln", role: "President" },
  davis: { img: "davis.png", side: "cs", name: "Davis", full: "Jefferson Davis", role: "President" },
  halleck: { img: "halleck.png", side: "us", name: "Halleck", full: "Henry W. Halleck", role: "General-in-Chief" },
};
for (const k in GENERALS) GENERALS[k].img = EB + "assets/generals/" + GENERALS[k].img;
Object.assign(GENERALS, S.generals || {});
const FLAG = (g) => g.flag || EB + "assets/flags/" + (g.side === "cs" ? "csa1_13_flag.png" : S.date >= "1863-07-04" ? "us35_flag.png" : "us34_flag.png");
const gen = (k) => { const g = typeof k === "string" ? GENERALS[k] : k; if (!g) throw new Error("unknown general " + k); return g; };
const BN_HOST = document.createElement("div"); TR.appendChild(BN_HOST);
const BANNERS = (S.banners || []).map((b) => { const g = gen(b.general), r = b.region || firstClose, e = document.createElement("div"); e.className = "bnr";
  const w = BN.build(b.img || g.img, b.flag || FLAG(g), b.name || g.name, "up", (b.side || g.side) !== "cs"); e.appendChild(w); BN.sway(w, b.t0, b.t1, tl); BN_HOST.appendChild(e);
  return { e, keys: b.keys, t0: b.t0, t1: b.t1, region: r, esc: b.escape ? mkEscape({ region: r, ...b.escape }, posAt(b.keys, b.escape.t0)) : null }; });

// ---------------- place names pinned to the ground (towns upright, rivers italic) ----------------
const PINS = [], PN = document.getElementById("pins");
for (const l of S.labels || []) { const r = l.region || NAMES[0], p = l.at || VX.town(l.town || l.text, r), e = document.createElement("div");
  e.className = "pl" + (l.river || l.italic ? " it" : ""); e.style.fontSize = (l.size || (isWide(r) ? 18 : 19)) + "px"; e.textContent = l.text || l.town; PN.appendChild(e);
  PINS.push({ e, x: p[0], y: p[1], h: l.h ?? 0.05, t0: l.t0, t1: l.t1, region: r }); }

// ---------------- GM overlay (1920x1080 space) ----------------
const O = GMOverlay.create(document.getElementById("ov"), { filmHost: document.getElementById("film"), tl, project: (p, t) => { if (typeof p === "function") p = p(t); const s = world.projectMap(p[0], p[1], p[2] || 0);   // world: [x, y, h] or (t) => [x, y, h] (follows a moving boat)
    return { x: s.x * SC, y: s.y * SC, visible: s.visible }; }, fontBase: EB + "assets/fonts/", seed: S.seed ?? 1863 });
O.film.set({ grain: (S.film || {}).grain ?? 0.04 });   // v5: grain <= 0.04 on the final frame
const ctx = { THREE, world, FX, VC, O, tl, S, VX, UNITS, TRO, ARROWS, BANNERS, PINS, GENERALS, G, regions: world.regions, sstep, lerp, clamp, hsh };
const resolveArgs = (a) => { if (!a || typeof a !== "object" || Array.isArray(a)) return a; if (a.general && !a.img) { const g = gen(a.general);
  return { img: g.img, side: g.side, name: g.full, role: g.role, ...a, general: undefined }; } return a; };
for (const e of S.overlay || []) { if (typeof e === "function") { e(O, ctx); continue; }
  const [path, ...args] = e, ks = path.split("."), fn = ks.pop(), host = ks.reduce((o, k) => o[k], O); if (!host || typeof host[fn] !== "function") throw new Error("overlay: no O." + path);
  host[fn](...args.map(resolveArgs)); }
// dives: no warm day grade inside the cloud (his interior is cool, his cream is flat), the target's grade after the emergence
for (const d of DIVES) { O.film.grade(d.deck, "none", 0.5); O.film.grade(d.emerge, d.to.grade || (d.to.night ? "night" : "day"), 0.8); }
// world fade: out at the end (after the HUD), in from black at the start
if (S.end && S.end.fadeAt != null) tl.to("#fade", { opacity: 1, duration: S.end.dur ?? 1.0, ease: "power1.inOut" }, S.end.fadeAt);
if (S.start && S.start.fadeIn) tl.fromTo("#fade", { opacity: 1 }, { opacity: 0, duration: S.start.fadeIn, ease: "power1.out", immediateRender: false }, 0);
if (S.build) await S.build(ctx);

_log("overlay");
// ---------------- per-frame draw (pure function of t) ----------------
// round 3 (critic B N4): unit boxes, arrows and banners step out while the dive's cloud deck / white-out covers the frame (they draw with
// depthTest off and would otherwise sit ON the cloud) and come back as the target clears. S.diveHide = false keeps them.
const diveHide = (t) => S.diveHide === false ? 0 : DIVES.reduce((m, d) => Math.max(m, sstep(d.deckIn + 0.2, d.full - 0.1, t) * (1 - sstep(d.emerge, d.clear + 0.35, t))), 0);
const drawTroops = (t, region) => {
  const L = [], HID = 1 - diveHide(t);
  for (const r in TRO) if (TRO[r].T3) TRO[r].T3.update(t, 1 - HID);   // GM blocks (v2): set before this frame renders, hidden under the dive deck
  for (const u of UNITS) { if (TRO[u.region] && TRO[u.region].T3) continue;
    const on = u.region === region && t >= u.t0 && t < u.t1, op = on ? HID * Math.min(sstep(u.t0, u.t0 + 0.6, t), 1 - sstep(u.t1 - 0.6, u.t1, t)) : 0;
    if (op <= 0.001) continue;
    const [cx, cy] = posAt(u.keys, t), fx = Math.cos(u.face), fy = Math.sin(u.face), px = -fy, py = fx;   // facing + front axis
    const span = u.n * u.bw + (u.n - 1) * u.gap;
    for (let i = 0; i < u.n; i++) {
      const off = -span / 2 + u.bw / 2 + i * (u.bw + u.gap), wob = u.wob * 0.05 * Math.sin(t * 1.3 + i * 1.7 + cx);
      const capd = u.cap != null && i < u.capN ? sstep(u.cap, u.cap + 0.8, t) : 0;
      let x = cx + px * off + fx * wob, y = cy + py * off + fy * wob, bfx = fx, bfy = fy, esc = false, eop = 1;
      const mk = u.column === false ? 0 : sstep(0, 1, marchK(u.keys, t));
      if (mk > 0 && i > 0) { const v = Math.max(speedAt(u.keys, t), speedAt(u.keys, t - 1), 0.05), dt = i * (Math.max(u.bw, u.bd) + u.gap) * 1.15 / v, q = posAt(u.keys, t - dt);
        x = lerp(x, q[0], mk); y = lerp(y, q[1], mk); } else if (mk > 0) { x = lerp(x, cx, mk); y = lerp(y, cy, mk); }
      if (u.esc && i >= u.escFrom && t > u.esc.t0) {   // v8: peel off the line slot into the road column, nose to tail, then march off
        const si = u.esc.s(t) - (i - u.escFrom) * (u.bw + u.gap) * 1.05;
        if (si > 0) { const [ex, ey, hx, hy] = escAt(u.esc, si), k = sstep(0, 0.9, si); x = lerp(x, ex, k); y = lerp(y, ey, k);
          esc = k > 0.5;   // owner 2026-11-18: no rotation on the road (bfx/bfy keep the unit's facing)
          if (u.esc.fade) eop = edgeFade(u.esc.fade, world.projectMap(x, y, 0.02), -30, 170); }   // fades over the frame edge (1.5-2 s at march pace)
      }
      L.push({ u, i, x, y, fx: bfx, fy: bfy, px: -bfy, py: bfx, bw: u.bw, bd: u.bd, op: op * eop * (1 - 0.25 * capd), capd, esc });
    }
  }
  // deterministic push-apart: boxes of different units never overlap (the escaping road column is never shoved off its road)
  const sup = (b, nx, ny) => b.bw / 2 * Math.abs(nx * b.px + ny * b.py) + b.bd / 2 * Math.abs(nx * b.fx + ny * b.fy);
  for (let it = 0; it < 6; it++) for (let a = 0; a < L.length; a++) for (let c = a + 1; c < L.length; c++) { const A = L[a], B = L[c]; if (A.u === B.u || (A.u.group != null && A.u.group === B.u.group) || A.esc || B.esc || A.u.region !== B.u.region) continue;
    let dx = B.x - A.x, dy = B.y - A.y; const d = Math.hypot(dx, dy) || 1e-3; dx /= d; dy /= d; const rr = sup(A, dx, dy) + sup(B, dx, dy) + 0.05 * RO(A.u.region).troopScale;
    if (d >= rr) continue; const k = (rr - d) * 0.5; A.x -= dx * k; A.y -= dy * k; B.x += dx * k; B.y += dy * k; }
  // owner 2026-11-18 + critics A1/B1: every box faces the camera (screen-up projected on the ground), so on screen each box is an
  // upright rectangle like the Style W 2D boxes and never turns with its unit, its road or its line; only positions follow the facing.
  const cu = new THREE.Vector3(0, 1, 0).applyQuaternion(world.camera.quaternion); let cfx = -cu.x, cfy = -cu.z; const cl = Math.hypot(cfx, cfy) || 1; cfx /= cl; cfy /= cl;
  if (S.boxFacing !== "unit") for (const b of L) { b.fx = cfx; b.fy = cfy; b.px = -cfy; b.py = cfx; }
  for (const r in TRO) { const BX = TRO[r].BX; if (!BX) continue; const h = HT(r);
    BX.set(L.filter((b) => b.u.region === r).map((b) => ({ x: b.x, y: b.y, fx: b.fx, fy: b.fy, bw: b.bw, bd: b.bd, art: b.u.type === "art", op: b.op, h: h(b.x, b.y),
      color: b.capd > 0 ? `rgb(${Math.round(lerp(b.u.side === "u" ? 44 : 190, 138, b.capd))},${Math.round(lerp(b.u.side === "u" ? 87 : 58, 133, b.capd))},${Math.round(lerp(b.u.side === "u" ? 183 : 42, 122, b.capd))})` : SIDE_COL[b.u.side] }))); }
  for (const b of BANNERS) { const on = b.region === region && t >= b.t0 && t < b.t1; let op = on ? HID * Math.min(sstep(b.t0, b.t0 + 0.5, t), 1 - sstep(b.t1 - 0.5, b.t1, t)) : 0;
    if (op <= 0) { b.e.style.opacity = 0; continue; }
    const [x, y] = b.esc && t > b.esc.t0 ? escAt(b.esc, b.esc.s(t)) : posAt(b.keys, t), s = world.projectMap(x, y, 0.02);
    if (b.esc && b.esc.fade) op *= edgeFade(b.esc.fade, s, -20, 180);   // leaves over the frame edge, never pops out mid-field
    b.e.style.opacity = op.toFixed(3); b.e.style.transform = `translate(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px) scale(0.6667)`; }
  for (const A of ARROWS) { const k = clamp((t - A.t0) / A.dur), op = A.region === region && t >= A.t0 ? HID * (1 - sstep(A.t1 - 0.6, A.t1, t)) : 0, ke = 1 - (1 - k) ** 2;
    TRO[A.region].AR3.draw(A.a3, ke, op, A.w); }
};
const inDive = (t) => DIVES.some((d) => t >= d.push - 1 && t < d.SW + 5.6);
const drawPins = (t, region) => {
  for (const p of PINS) { const on = region === p.region && t >= p.t0 && t < p.t1, op = on ? Math.min(sstep(p.t0, p.t0 + 0.6, t), 1 - sstep(p.t1 - 0.6, p.t1, t)) : 0;
    if (op <= 0) { p.e.style.opacity = "0"; continue; } const s = world.projectMap(p.x, p.y, p.h); p.e.style.transform = `translate(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px) translate(-50%,-50%)`;
    // v6/v7: a name under the 3D title is hidden; a name under a cloud is dimmed by the cloud's alpha there (his "Saint-Prix")
    let k = 1; if (TBOX.a > 0 && region === TREG) { const ins = Math.min(s.x - TBOX.x0 + 40, TBOX.x1 + 40 - s.x, s.y - TBOX.y0 + 24, TBOX.y1 + 24 - s.y); k *= 1 - clamp(TBOX.a * 4) * clamp(ins / 20); }
    if (inDive(t) || isWide(region)) k *= 1 - 0.9 * FX[region].cloudAlphaAt(s.x, s.y);
    p.e.style.opacity = (op * k).toFixed(3); }
};
// v6 grade on the 3D image only, per region kind / night: saturation (CSS) + per-channel tables (lifted toe, half S-curve, a little blue) +
// a screen-space cool veil that grows with depth; the dive (deck -> haze) keeps the neutral look tuned for the white-out. ?grade=0 = raw.
const GP = {
  close: { sat: 0.98, toe: 4, S: 0.14, bl: 7, gl: 1, veil: [150, 160, 165], vt: 0.15, vb: 0.04, ct: 1.0 },
  wide: { sat: 0.95, toe: 30, S: 0.1,   // critic A7: toe 14 -> 22 lifts the near-black wide woods
            bl: 4, gl: 1, veil: [150, 160, 165], vt: 0.0, vb: 0.0, ct: 0.96 },
  night: { sat: 0.95, toe: 2, S: 0.0, bl: 5, gl: 2, veil: [40, 60, 82], vt: 0.04, vb: 0.0, ct: 1.0 },
  off: { sat: 1.05, toe: 0, S: 0, bl: 0, gl: 0, veil: [150, 160, 165], vt: 0, vb: 0, ct: 1.0 } };
for (const k in S.grade || {}) GP[k] = { ...GP[k], ...S.grade[k] };
const GF = [...document.querySelectorAll("#gmgrade feFuncR, #gmgrade feFuncG, #gmgrade feFuncB")], GL = document.getElementById("gl"), VEIL = document.getElementById("veil");
const GRADE_ON = new URLSearchParams(location.search).get("grade") !== "0";
let gradeKey = "";
const gradeAt = (t) => {
  const cs = world.cameraAt(t), n = cs.night || 0, wide = isWide(cs.region) ? 1 : 0;
  let k = GRADE_ON ? 1 : 0; if (GRADE_ON) for (const d of DIVES) k *= 1 - sstep(d.deckIn, d.deck, t) * (1 - sstep(d.emerge, d.haze, t));
  const mix = (f) => { const day = lerp(GP.close[f], GP.wide[f], wide); return lerp(GP.off[f], lerp(day, GP.night[f], n), k); };
  const mixv = (i) => { const day = lerp(GP.close.veil[i], GP.wide.veil[i], wide); return lerp(day, GP.night.veil[i], n); };
  const P = { sat: mix("sat"), toe: mix("toe"), S: mix("S"), bl: mix("bl"), gl: mix("gl"), vt: mix("vt"), vb: mix("vb"), ct: mix("ct") };
  const key = Object.values(P).map((v) => v.toFixed(3)).join(",") + n.toFixed(2) + wide;
  if (key === gradeKey) return; gradeKey = key;
  GL.style.filter = `saturate(${P.sat.toFixed(3)}) url(#gmgrade)`;
  const y0 = (x) => x * x * (3 - 2 * x);
  const curve = (x, off) => { let y = x + (y0(x) - x) * P.S * 2; y = 0.5 + (y - 0.5) * P.ct; y += (P.toe / 255) * (1 - x) ** 3 + (off / 255) * 4 * x * (1 - x); return clamp(y).toFixed(4); };
  [0, P.gl, P.bl].forEach((off, c) => GF[c].setAttribute("tableValues", Array.from({ length: 33 }, (_, i) => curve(i / 32, off)).join(" ")));
  const vc = [0, 1, 2].map((i) => Math.round(mixv(i))).join(",");
  VEIL.style.background = `linear-gradient(180deg, rgba(${vc},${P.vt.toFixed(3)}) 0%, rgba(${vc},${((P.vt + P.vb) / 2).toFixed(3)}) 45%, rgba(${vc},${P.vb.toFixed(3)}) 100%)`; };
// the white-out (v6 + the v8 cut fix): cool veil as the camera sinks inside the deck, opaque 2 frames either side of the swap with his flat -8 dip,
// warm cream with a radial falloff, then the target snaps in (0.3 s) and a thin haze clears
const WC = document.getElementById("wcool"), WO = document.getElementById("whiteout"), WW = document.getElementById("wwarm"), FOGW = new THREE.Color(0.80, 0.79, 0.74);
const whiteOne = (d, t) => { if (t < d.emerge) { const v6 = t < d.SW + 0.05 ? 0.45 * sstep(d.wIn, d.SW, t) : t < d.warm + 0.1 ? lerp(0.86, 1, sstep(d.warm - 0.05, d.warm + 0.1, t)) : 1;
    return Math.max(v6, sstep(d.SW - 0.12, d.SW - 0.067, t) * (1 - sstep(d.SW + 0.067, d.SW + 0.13, t))); }
  return t < d.clear ? lerp(1, 0.1, 1 - (1 - clamp((t - d.emerge) / (d.clear - d.emerge))) ** 2) : lerp(0.1, 0, sstep(d.clear, d.haze, t)); };
const filmK = (t, a, b) => DIVES.reduce((m, d) => Math.max(m, sstep(d[a[0]] + a[1], d[a[2]] + a[3], t) * (1 - sstep(d[b[0]], d[b[1]], t))), 0);
const GRAIN = (S.film || {}).grain ?? 0.04;
// dissolves: a cut key with dissolve: dur crossfades from the last frame before the cut (frozen) into the new shot over dur seconds
const XFADES = (S.keys || []).filter((k) => k.dissolve > 0).map((k) => ({ t: k.t, dur: k.dissolve }));
let XC = null;
if (XFADES.length) { XC = document.createElement("canvas"); XC.width = GL.width; XC.height = GL.height; XC.style.cssText = "position:absolute;inset:0;width:1280px;height:720px;pointer-events:none;opacity:0";
  GL.parentNode.insertBefore(XC, GL.nextSibling); }
const xfadeAt = (t) => { if (!XC) return; const x = XFADES.find((q) => t >= q.t && t < q.t + q.dur); if (!x) { XC.style.opacity = "0"; return; }
  const ta = x.t - 1 / 60; gradeAt(ta); placeBoats(ta);
  world.update(ta, { beforeRender: (w, tt) => { const fx = FX[w.region]; fx.setNight(w.cam.night || 0); drawTroops(tt, w.region); fx.update(tt, w.camera); } });
  const g = XC.getContext("2d"); g.clearRect(0, 0, XC.width, XC.height); g.drawImage(GL, 0, 0); XC.style.filter = GL.style.filter;
  XC.style.opacity = (1 - sstep(x.t, x.t + x.dur, t)).toFixed(3); gradeKey = ""; };
window.__draw = (t) => {
  xfadeAt(t);
  placeBoats(t); titleAt(t); gradeAt(t);
  O.film.set({ grain: lerp(GRAIN, GRAIN * 0.75, filmK(t, ["full", -0.3, "wIn", 0], ["emerge", "clear"])).toFixed(3) });   // his white-out is smooth
  O.film.set({ vignette: (1 - 0.95 * filmK(t, ["full", -0.4, "wIn", 0], ["emerge", "haze"])).toFixed(3) });   // no dark oval inside the cloud
  let wa = 0, dp = 0; for (const d of DIVES) { wa = Math.max(wa, whiteOne(d, t)); dp += 8 * sstep(d.SW - 0.06, d.SW, t) * (1 - sstep(d.SW + 0.06, d.SW + 0.14, t)); }
  WO.style.opacity = wa.toFixed(3); WC.style.background = `rgb(${208 - dp},${211 - dp},${204 - dp})`;
  { let d = null; for (const q of DIVES) if (q.warm - 1 <= t) d = q; WW.style.opacity = d ? sstep(d.warm - 0.05, d.warm + 0.15, t).toFixed(3) : "0"; }
  world.update(t, { beforeRender: (w, tt, R) => { const fx = FX[w.region]; fx.setNight(w.cam.night || 0);
    for (const d of DIVES) if (w.region === d.to.region && tt > d.SW - 0.1 && tt < d.haze + 0.1) {   // emergence: the target comes out of fog (far ground whiter than near)
      const k = sstep(d.emerge - 0.05, d.clear + 0.1, tt), f = R.scene.fog, dd = w.cam.dist;
      f.color.lerp(FOGW, 1 - k); f.near = lerp(dd * 0.15, f.near, k); f.far = lerp(dd * 1.7, f.far, k); w.renderer.setClearColor(f.color); }
    drawTroops(tt, w.region);   // boxes / arrows are in the scene: set them BEFORE this frame renders
    fx.update(tt, w.camera); } });
  drawPins(t, world.region);
  if (S.draw) S.draw(t, ctx);
};
// (no font / image preload here: awaiting document.fonts.load or image loads inside the build stalls on this SwiftShader set-up; HyperFrames
// waits for fonts and images itself before it captures. The overlay re-measures its plaques on every update.)
_log("fonts"); window.__draw(tl.time()); O.update(tl.time()); _log("first frame");
window.__vx = ctx;
window.__sceneBuilt();
