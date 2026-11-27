// BW r4 (owner 2026-11-27: "the dive, the clouds and the smoke don't look right like the film"): the REAL 3D engine's clouds, cloud dive and
// musket smoke (vicksburg/engine/fx.js, unchanged except one extra smoke look) rendered as a transparent three.js layer over the 2D Style W map.
// The three camera is solved every frame from the DOM camera: #world translate/scale (the kit camera) inside #bw-tilt
// (perspective(P) rotateX(deg) scale(k), origin 50% 62%), so the clouds' ground shadows and the smoke sit exactly on the map.
// World units = the scene's base-map px (x east, z south, y up, ground y = 0). Scene config: window.BWGL_CFG (BW.gl / BW.smoke in borrow.js).
import * as THREE from "three";
import { createFX, loadCloudNoise } from "./fx.js";

const C = window.BWGL_CFG || {};
const ready = () => { if (window.__bwglReady) window.__bwglReady(); };
const lerp = (a, b, k) => a + (b - a) * k, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const sstep = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const hsh = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const lnr = (i, k, med, sg, lo, hi) => { const g1 = hsh(i, k), g2 = hsh(i, k + 1), gn = Math.sqrt(-2 * Math.log(Math.max(1e-4, g1))) * Math.cos(6.2832 * g2); return Math.min(hi, Math.max(lo, med * Math.exp(sg * gn))); };

if (!C.on) ready();
else {
  const SCN = document.getElementById("scene"), WORLD = document.getElementById("world"), TILT = document.getElementById("bw-tilt");
  const D = window.SCENE_TIMING ? window.SCENE_TIMING.duration : 60;
  // ---------------- canvas (1280x720 drawing buffer, shown at 1920x1080) between the map and the HUD
  const cv = document.createElement("canvas"); cv.width = 1280; cv.height = 720; cv.id = "bwgl";
  cv.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none";
  SCN.insertBefore(cv, TILT.nextSibling);
  // haze over the far side of the map while the camera is steeply tilted (the 2D map ends where a 3D world would continue)
  const HAZE = document.createElement("div"); HAZE.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;opacity:0;background:linear-gradient(180deg,rgba(201,207,206,.96) 0%,rgba(201,207,206,.78) 14%,rgba(201,207,206,.3) 30%,rgba(201,207,206,0) 46%)";
  SCN.insertBefore(HAZE, cv);
  // the v6/v8 white-out (cool veil -> opaque around the swap -> warm cream -> the target comes out of a thin haze)
  const WO = document.createElement("div"); WO.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;opacity:0;overflow:hidden";
  WO.innerHTML = '<div style="position:absolute;inset:0;background:rgb(208,211,204)"></div><div style="position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse farthest-corner at 50% 47%,rgb(220,218,205) 0%,rgb(215,213,200) 34%,rgb(195,194,180) 71%,rgb(184,182,167) 100%)"></div>';
  SCN.insertBefore(WO, cv.nextSibling);
  const [WC, WW] = WO.children;
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(1280, 720, false); renderer.setClearColor(0x000000, 0); renderer.autoClear = false;
  const camera = new THREE.PerspectiveCamera(35, 1920 / 1080, 1, 60000);
  const P = C.persp || 1700, OX = 960, OY = 0.62 * 1080;
  const camSolve = () => {   // DOM camera -> three camera (see the header)
    const wx = gsap.getProperty(WORLD, "x"), wy = gsap.getProperty(WORLD, "y"), ws = gsap.getProperty(WORLD, "scaleX");
    const TS = window.BW ? window.BW.TS : { d: 0, s: 1 }, th = TS.d * Math.PI / 180, k = TS.s, c = Math.cos(th), s = Math.sin(th);
    camera.position.set((OX - wx) / ws, P * c / (k * ws), (OY + P * s / k - wy) / ws);
    camera.up.set(0, s, -c);
    camera.lookAt(camera.position.x, camera.position.y - c, camera.position.z - s);
    const fullH = 2 * OY;
    camera.fov = 2 * Math.atan(OY / P) * 180 / Math.PI; camera.aspect = 1920 / fullH;
    camera.setViewOffset(1920, fullH, 0, 0, 1920, 1080);
    camera.near = Math.max(0.5, camera.position.y * 0.02); camera.far = camera.position.y * 60 + 20000;
    camera.updateProjectionMatrix(); camera.updateMatrixWorld(true);
    return { ws, tilt: TS.d };
  };
  window.__bwglCam = camSolve;
  const MPU = C.mpu || 128, U = 1 / MPU, SUN = C.sun || [-0.7, 0.48, -0.4];
  const NOISE = await loadCloudNoise(C.noise || "gl/noise128.bin");
  const systems = [];
  const mkFX = (o = {}) => { const scene = new THREE.Scene(); const fx = createFX({ scene, camera, renderer, unitsPerMeter: U, fxScale: o.fxScale ?? 1, wind: o.wind || C.wind || [20, -7], sunDir: SUN, duration: D, seed: o.seed ?? 1780 });
    const sys = { scene, fx, on: o.on || (() => true) }; systems.push(sys); return sys; };
  // ground plane that only shows the clouds' shadows (alpha = shadow), the engine's patchGround on a white unlit material
  const ground = (sys, box) => { const m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false });
    sys.fx.patchGround(m); const prev = m.onBeforeCompile;
    m.onBeforeCompile = (sh, r) => { prev(sh, r); const i = sh.fragmentShader.lastIndexOf("}");
      sh.fragmentShader = sh.fragmentShader.slice(0, i) + `\n  gl_FragColor = vec4(0.0, 0.0, 0.0, clamp(1.0 - gl_FragColor.g, 0.0, 1.0) * ${(C.shadowK ?? 0.9).toFixed(2)});\n}`; };
    const g = new THREE.Mesh(new THREE.PlaneGeometry(box[2], box[3]), m); g.rotation.x = -Math.PI / 2; g.position.set(box[0] + box[2] / 2, 0, box[1] + box[3] / 2); g.renderOrder = -20; sys.scene.add(g); return g; };
  // ---------------- dives (v8 timings, VX.DIVE_OFF_V8; an optional land offset)
  const OFF = { push: -3.8, deckIn: -1.7, full: -0.55, deck: -0.45, wIn: -0.35, inside: -0.15, SW: 0, warm: 0.15, emerge: 0.85, clear: 1.15, haze: 1.8, land: 3.35, ...(C.diveOff || {}) };
  const DV = C.dive ? (() => { const o = {}; for (const k in OFF) o[k] = C.dive.t + OFF[k]; return { ...o, over: C.dive.over }; })() : null;
  const NODIVE = (() => { const o = {}; for (const k in OFF) o[k] = 1e7 + OFF[k]; return { ...o, over: [0, 0] }; })();
  const CW_DAY = { sun: [1.0, 0.95, 0.85], ambTop: [0.50, 0.55, 0.65], ambBot: [0.24, 0.28, 0.36], nSun: [0.12, 0.15, 0.20], nAmbTop: [0.27, 0.32, 0.40], nAmbBot: [0.13, 0.16, 0.21] };
  // ---------------- fair-weather cumulus (+ the dive deck): engine scene.js wide-cloud code, every length x F (the camera here is F x farther)
  if (C.fair) {
    const F = C.fair.F || 1, B = C.fair.box, sys = mkFX({ seed: 1863, on: C.fair.on });
    const keep = (C.fair.keep || []).map((q) => [q[0], q[1], q[2], q[3] ?? 1, q[4] ?? 1]), DC = (C.fair.diveClear ?? 118) * F;
    const offWide = (x, z, r) => (DV && Math.hypot(x - DV.over[0], (z - (DV.over[1] + 6 * F)) * 1.15) < DC + 0.5 * r) || keep.some(([cx, cz, R, ky, rk]) => Math.hypot(x - cx, (z - cz) * ky) < R + rk * r)
      || (C.fair.keepLines || []).some(([pts, R]) => pts.some((p) => Math.hypot(x - p[0], z - p[1]) < R + r));
    const sc = { med: 30, tries: 900, seed: 0, n: 12, ...C.fair };
    const wsp = [], sd = sc.seed;
    for (let c = 0, k = 0; c < sc.tries && k < sc.n; c++) {
      const cx = B[0] + hsh(c + sd, 61) * B[2], cz = B[1] + hsh(c + sd, 62) * B[3], R0 = lnr(c + sd, 63, sc.med * F, 0.5, 14 * F, 70 * F);
      if (offWide(cx, cz, R0) || wsp.some(([a, b, q]) => Math.hypot(a - cx, b - cz) < q + R0 + 10 * F)) continue;
      k++; wsp.push([cx, cz, R0, c]); const kids = 1 + Math.floor(hsh(c + sd, 65) * 3);
      for (let j = 0; j < kids; j++) { const i2 = (c + sd) * 7 + j, a = hsh(i2, 66) * 6.283, r = lnr(i2, 67, R0 * 0.45, 0.6, 7 * F, R0 * 0.9), dd = R0 * (0.9 + 0.8 * hsh(i2, 69)) + r * 0.6;
        const x = cx + Math.cos(a) * dd, z = cz + Math.sin(a) * dd * 0.8; if (!offWide(x, z, r)) wsp.push([x, z, r, c]); } }
    // 2-3 heights (parallax while the camera drops): each cluster picks a tier
    const TIERS = C.fair.tiers || [49, 49]; const tierOf = (c) => TIERS[Math.floor(hsh(c, 71) * TIERS.length)];
    const deck = [];
    if (DV && C.fair.deck !== false) { const cx0 = DV.over[0], cz0 = DV.over[1] + 6 * F;
      for (let i = 0, gx = cx0 - 118 * F; gx < cx0 + 122 * F; gx += 22 * F) for (let gz = cz0 - 112 * F; gz < cz0 + 108 * F; gz += 22 * F, i++) {
        const x = gx + (hsh(i, 5) - 0.5) * 18 * F, z = gz + (hsh(i, 6) - 0.5) * 18 * F, r = Math.hypot(x - cx0, (z - cz0) * 1.15);
        if (hsh(i, 7) < lerp(0.95, 0.5, clamp((r - 30 * F) / (90 * F)))) deck.push([x, z, (13 + hsh(i, 8) * 12) * F]); }
      for (const [dx, dz, r] of [[0, 0, 30], [-6, 11, 26], [8, -7, 26], [3, 20, 26], [-11, -9, 24], [13, 7, 24]]) deck.push([DV.over[0] + dx * F, DV.over[1] + dz * F, r * F]); }
    const cl = wsp.map(([x, z, r, c], i) => [x, z, r, 3 * F + r * (0.18 + 0.16 * hsh(i, 13)), (tierOf(c) + hsh(i, 11) * 9) * F, 0])
      .concat(deck.map(([x, z, r], i) => [x, z, r, r * (0.26 + 0.1 * hsh(i, 14) + 0.12 * clamp(1 - Math.hypot(x - DV.over[0], z - (DV.over[1] + 4 * F)) / (60 * F))), 58 * F + hsh(i, 12) * 3 * F, 1]));
    window.__bwglClouds = cl.length;
    const D0 = DV || NODIVE, AD = (t) => (t > D0.SW + 1 ? NODIVE : D0);
    const slabTop = Math.max(104, ...TIERS.map((v) => v + 55)) * F;
    if (cl.length) sys.vc = sys.fx.vclouds({ noise: NOISE, clouds: cl, bounds: [B[0] - 40 * F, B[1] - 70 * F, B[0] + B[2] + 40 * F, B[1] + B[3] + 40 * F], texel: F, skip: 30 * F,
      slab: [44 * F, slabTop], tile: 125 * F, groupScale: 3.0, amp: 5 * F, soft: 1.7 * F, flatPow: 0.3, sigma: 0.75 / F,
      stepIn: 0.25 * F, stepK: 0.0035, lightStep: 1.4 * F, lodDist: 260 * F, nearFade: 3 * F, maxSteps: C.fair.maxSteps ?? 200, resolution: C.fair.res ?? 0.6, warp: 0.06, fine: 0.12, wisp: 0.45, inner: 0.8,
      weights: [1.0, 0.5, 1, 0.5], group0: [0.55, 0.3, 1.4, 0.5], blur: 1.0, sharp: 1, shadow: 0.75, shadowDir: [0.3, 1, 0.65], drift: (C.fair.drift || [0.10, -0.035]).map((v) => v * F), evolve: 0.0025 / F, floor: 0.05,
      sunK: 1.4, ambK: 0.18, lightK: 3.2,
      erode: (t) => { const d = D0; return [C.fair.erode0 ? C.fair.erode0(t) : 0, t > d.SW + 0.5 ? 9 : lerp(1.6, 0, sstep(d.deckIn - 0.1, d.deckIn + 0.6, t))]; },
      deck: (t) => { const d = D0; return { x: d.over[0], z: d.over[1], r: 110 * F, front: 3.5 * (1 - sstep(d.deckIn + 0.1, d.full, t)), k: lerp(0, 1, sstep(d.deckIn, d.deckIn + 0.6, t)) }; },
      ms: (t) => { const d = AD(t); return lerp(0.22, 0.42, sstep(d.full - 0.2, d.inside, t)); }, expo: (t) => { const d = AD(t); return lerp(1, 0.93, sstep(d.full - 0.2, d.inside, t)); },
      colors: (t) => { const d = AD(t), k = sstep(d.full - 0.2, d.inside, t), c = sstep(d.deckIn, d.deckIn + 0.5, t) * (1 - k), q = Math.max(k, c);
        return { sun: [lerp(1.0, 0.95, q), lerp(0.95, 0.97, q), lerp(0.85, 0.94, q)], ambTop: [lerp(0.50, 0.66, q), lerp(0.55, 0.71, q), lerp(0.65, 0.76, q)], ambBot: [lerp(0.24, 0.40, q), lerp(0.28, 0.46, q), lerp(0.36, 0.54, q)],
          nSun: CW_DAY.nSun, nAmbTop: CW_DAY.nAmbTop, nAmbBot: CW_DAY.nAmbBot, ambK: lerp(0.18, 0.36, q), lightK: lerp(3.2, 1.4, k) * lerp(1, 0.8, c), sunK: lerp(1.4, 1.2, q) }; },
      sigmaK: (t) => { const d = AD(t); return lerp(1, 0.5, sstep(d.full, d.inside, t)); },
      opacity: C.fair.opacity || (() => 1) });
    ground(sys, [B[0] - 400 * F, B[1] - 400 * F, B[2] + 800 * F, B[3] + 800 * F]);
    sys.on = C.fair.on || (() => true);
  }
  // ---------------- the landing's torn stratus sheets (engine close-region code, lengths x Fc)
  if (C.stratus && DV) {
    const Fc = C.stratus.F || 1, c = C.stratus.at, sys = mkFX({ seed: 1517, on: (t) => t > DV.SW - 1 && t < DV.emerge + 4 });
    const ccl = [[-11, -9, 9], [11, -11, 8], [-15, 7, 10], [14, 11, 9], [-1, 19, 8], [0, -17, 7], [-23, -2, 7], [21, 0, 7], [-8, 0, 6], [7, 1, 6]]
      .map(([dx, dz, r], i) => [c[0] + dx * Fc, c[1] + dz * Fc, r * 1.25 * Fc, (2.6 + hsh(i, 24) * 1.2) * Fc, (16.5 + hsh(i, 25) * 3) * Fc, 1]);
    sys.vc = sys.fx.vclouds({ noise: NOISE, clouds: ccl, bounds: [c[0] - 50 * Fc, c[1] - 45 * Fc, c[0] + 50 * Fc, c[1] + 45 * Fc], texel: 0.2 * Fc, skip: 8 * Fc, slab: [14 * Fc, 26 * Fc], tile: 9 * Fc, amp: 1.5 * Fc, soft: 0.8 * Fc, sigma: 1.1 / Fc,
      wisp: 0.8, inner: 0.7, flatPow: 0.35, blobs: 6, stepIn: 0.12 * Fc, stepK: 0.004, lightStep: 0.35 * Fc, lodDist: 90 * Fc, nearFade: 1.2 * Fc, maxSteps: 180, resolution: 0.6, warp: 0.18, fine: 0.1,
      weights: [1.0, 0.5, 1, 0.6], blur: 1.0, sharp: 1, shadow: 0.45, shadowDir: [0.3, 1, 0.65], drift: [0.5 * Fc, -0.18 * Fc], evolve: 0.006 / Fc, sunK: 0.95, ambK: 0.5, lightK: 1.6,
      colors: { sun: [1.0, 0.97, 0.9], ambTop: [0.62, 0.67, 0.74], ambBot: [0.30, 0.35, 0.44] },
      erode: (t) => [0, lerp(0.35, 0.7, sstep(DV.emerge, DV.emerge + 1.2, t)) + lerp(0, 2.2, sstep(DV.emerge + 1.0, DV.emerge + 3.3, t))],
      deck: (t) => ({ x: c[0] + 4 * Fc, z: c[1], r: 9 * Fc, front: 3 * sstep(DV.emerge + 0.9, DV.emerge + 1.6, t), k: 1 }),
      opacity: (t) => (t < DV.SW - 1 ? 0 : 1 - sstep(DV.emerge + 3.2, DV.emerge + 3.8, t)) });
  }
  // ---------------- musket smoke: fx.smokeLine with the GM settings (SMOKE_GM) per firing line
  if ((C.smoke || []).length) {
    const sys = mkFX({ seed: 1781, fxScale: C.smokeScale ?? 1, wind: C.smokeWind || [4, -1.5] });
    const SMOKE_GM = { cluster: [1.0, 1.0], fadeAfter: 6, fadeTo: 0.12, look: "gmTall" };
    for (const e of C.smoke) sys.fx.smokeLine(e.pts.map((p) => [p[0], e.h ?? 0.06, p[1]]), e.t0, e.t1, { ...SMOKE_GM, flash: false, ...(e.opts || {}) });
  }
  // ---------------- per frame
  const whiteAt = (t) => { const d = DV; if (!d) return [0, 0];
    let a; if (t < d.emerge) { const v6 = t < d.SW + 0.05 ? 0.45 * sstep(d.wIn, d.SW, t) : t < d.warm + 0.1 ? lerp(0.86, 1, sstep(d.warm - 0.05, d.warm + 0.1, t)) : 1;
      a = Math.max(v6, sstep(d.SW - 0.12, d.SW - 0.067, t) * (1 - sstep(d.SW + 0.067, d.SW + 0.13, t))); }
    else a = t < d.clear ? lerp(1, 0.1, 1 - (1 - clamp((t - d.emerge) / (d.clear - d.emerge))) ** 2) : lerp(0.1, 0, sstep(d.clear, d.haze, t));
    return [a, sstep(d.warm - 0.05, d.warm + 0.15, t)]; };
  const draw = (t) => {
    const cs = camSolve();
    HAZE.style.opacity = (sstep(14, 34, cs.tilt) * (C.hazeK ?? 1)).toFixed(3);
    const [wa, ww] = whiteAt(t); WO.style.opacity = wa.toFixed(3); WW.style.opacity = ww.toFixed(3);
    renderer.setRenderTarget(null); renderer.clear(true, true, true);
    for (const s of systems) { if (!s.on(t)) continue; s.fx.update(t, camera); renderer.render(s.scene, camera); }
  };
  window.__BWGL = { draw, camera, renderer, systems, dive: DV };
  draw(window.tl ? window.tl.time() : 0);
  ready();
}
