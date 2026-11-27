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
    // r5: screen-space keep-clear (spoken places must read): drop whole clusters whose cloud projects into the box (+ its radius) at the sampled times
    const SCL = C.fair.screenClear; let dropC = new Set();
    if (SCL) { const TL = window.__timelines && window.__timelines.main, t0 = TL ? TL.time() : 0, v = new THREE.Vector3();
      const tiers0 = C.fair.tiers || [49, 49];
      for (let tt = SCL.t[0]; tt <= SCL.t[1] + 1e-6; tt += 0.25) { if (TL) TL.seek(tt, false); camSolve();
        for (const [x, z, r, c] of wsp) { for (const yy of tiers0) { v.set(x, (yy + 20) * F, z).project(camera); const sx = (v.x + 1) / 2 * 1920, sy = (1 - v.y) / 2 * 1080;
          const rs = r * 1.3 * 1700 / Math.max(1, camera.position.distanceTo(new THREE.Vector3(x, yy * F, z)));
          const [bx0, by0, bx1, by1] = SCL.box; if (v.z < 1 && sx + rs > bx0 && sx - rs < bx1 && sy + rs > by0 && sy - rs < by1) dropC.add(c); } } }
      if (TL) TL.seek(t0, false); }
    for (let i = wsp.length - 1; i >= 0; i--) if (dropC.has(wsp[i][3])) wsp.splice(i, 1);
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
      erode: (t) => { const d = D0; return [C.fair.erode0 ? C.fair.erode0(t) : 0, t > d.SW + 0.5 ? 9 : lerp(9, lerp(1.6, 0, sstep(d.deckIn - 0.1, d.deckIn + 0.6, t)), sstep(d.deckIn - 0.15, d.deckIn + 0.15, t))]; },   // r5: the deck does not exist before deckIn (spoken places read)
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
    const Fc = C.stratus.F || 1, c = C.stratus.at, K = C.stratus.speed ?? 1, sys = mkFX({ seed: 1517, on: (t) => t > DV.SW - 0.15 && t < DV.emerge + 4 * K });   // r5: one world: the landing stratus only from under the white
    const ccl = [[-11, -9, 9], [11, -11, 8], [-15, 7, 10], [14, 11, 9], [-1, 19, 8], [0, -17, 7], [-23, -2, 7], [21, 0, 7], [-8, 0, 6], [7, 1, 6]]
      .map(([dx, dz, r], i) => [c[0] + dx * Fc, c[1] + dz * Fc, r * 1.25 * Fc, (2.6 + hsh(i, 24) * 1.2) * Fc, (16.5 + hsh(i, 25) * 3) * Fc, 1]);
    sys.vc = sys.fx.vclouds({ noise: NOISE, clouds: ccl, bounds: [c[0] - 50 * Fc, c[1] - 45 * Fc, c[0] + 50 * Fc, c[1] + 45 * Fc], texel: 0.2 * Fc, skip: 8 * Fc, slab: [14 * Fc, 26 * Fc], tile: 9 * Fc, amp: 1.5 * Fc, soft: 0.8 * Fc, sigma: 1.1 / Fc,
      wisp: 0.8, inner: 0.7, flatPow: 0.35, blobs: 6, stepIn: 0.12 * Fc, stepK: 0.004, lightStep: 0.35 * Fc, lodDist: 90 * Fc, nearFade: 1.2 * Fc, maxSteps: 180, resolution: 0.6, warp: 0.18, fine: 0.1,
      weights: [1.0, 0.5, 1, 0.6], blur: 1.0, sharp: 1, shadow: 0.45, shadowDir: [0.3, 1, 0.65], drift: [0.5 * Fc, -0.18 * Fc], evolve: 0.006 / Fc, sunK: 0.95, ambK: 0.5, lightK: 1.6,
      colors: { sun: [1.0, 0.97, 0.9], ambTop: [0.62, 0.67, 0.74], ambBot: [0.30, 0.35, 0.44] },
      erode: (t) => [0, lerp(0.35, 0.7, sstep(DV.emerge, DV.emerge + 1.2 * K, t)) + lerp(0, 2.2, sstep(DV.emerge + 1.0 * K, DV.emerge + 3.3 * K, t))],
      deck: (t) => ({ x: c[0] + 4 * Fc, z: c[1], r: 9 * Fc, front: 3 * sstep(DV.emerge + 0.9 * K, DV.emerge + 1.6 * K, t), k: 1 }),
      opacity: (t) => (t < DV.SW - 0.15 ? 0 : 1 - sstep(DV.emerge + 3.2 * K, DV.emerge + 3.8 * K, t)) });
  }
  // ---------------- musket smoke: fx.smokeLine with the GM settings (SMOKE_GM) per firing line
  if ((C.smoke || []).length) {
    const sys = mkFX({ seed: 1781, fxScale: C.smokeScale ?? 1, wind: C.smokeWind || [4, -1.5] });
    const SMOKE_GM = { cluster: [1.0, 1.0], fadeAfter: 6, fadeTo: 0.12, look: "gmTall" };
    for (const e of C.smoke) sys.fx.smokeLine(e.pts.map((p) => [p[0], e.h ?? 0.06, p[1]]), e.t0, e.t1, { ...SMOKE_GM, flash: false, ...(e.opts || {}) });
  }
  // ---------------- r8: black-powder volley smoke + flintlock flashes (NOTES "musket smoke + flash spec" r8)
  // Smoke = many soft, noise-textured billboard particles per shot (8 procedural fbm smoke textures with domain warp + feathered edges, normals
  // from the density), lit from the screen top (sunlit tops ~(235,232,222), undersides ~(140,145,155)), alpha-blended into their own target,
  // then composited with an alpha cap: <= 0.55 over any unit, <= 0.3 over red boxes, ~0.1 over unit name tags (read from the DOM every frame).
  // A shot = a jet cone thrown 70-110 px forward in ~0.15 s (ease-out, 18 -> 45 px, alpha 0.9) that billows into log-normal 40-140 px puffs
  // with a lumpy top, rising ~10 px/s for 2 s, drifting 12-18 px/s with shear, spreading x2.5 by 6 s, ~0.35 at 6 s, gone by 12-14 s.
  // Flashes on a 2D canvas above the smoke: pan flash (12 px, 1 frame, 2 frames early), muzzle tongue (55-70 x 16-24 px, #FFFBE0 -> #FFB030 ->
  // #E04A10, frame 1 100 % frame 2 60 %), an additive glow (r 45 px, 30 %, 3 frames, screen-blended: lights the map and the smoke), 8 motion-
  // blurred spark streaks over 0.2 s. All sizes are 1080p screen px; K = world px per screen px at the scene's camera scale.
  let SMOKE = null;
  if ((C.vshots || []).length) {
    const V = C.volley || {}, K = V.K || 1, SH = C.vshots.slice().sort((a, b) => a[0] - b[0]);
    const mb = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let q = Math.imul(a ^ (a >>> 15), 1 | a); q = (q + Math.imul(q ^ (q >>> 7), 61 | q)) ^ q; return ((q ^ (q >>> 14)) >>> 0) / 4294967296; };
    // --- 8 procedural smoke textures (128 px cells in a 512 x 256 atlas): RGB = normal, A = density
    const CS = 128, AW = CS * 4, AH = CS * 2, atl = new Uint8Array(AW * AH * 4);
    for (let c = 0; c < 8; c++) { const R = mb(977 + c * 131), G = 32, g = new Float32Array(G * G); for (let i = 0; i < g.length; i++) g[i] = R();
      const vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), at = (a, b) => g[((b % G + G) % G) * G + ((a % G + G) % G)];
        return lerp(lerp(at(xi, yi), at(xi + 1, yi), u), lerp(at(xi, yi + 1), at(xi + 1, yi + 1), u), v); };
      const fbm = (x, y) => { let s_ = 0, a = 0.55, f = 1; for (let o = 0; o < 4; o++) { s_ += a * vn(x * f, y * f); a *= 0.45; f *= 2.1; } return s_ / 0.95; };
      const ox = R() * 20, oy = R() * 20, D = new Float32Array(CS * CS);
      for (let y = 0; y < CS; y++) for (let x = 0; x < CS; x++) { const u = x / CS - 0.5, v = y / CS - 0.5;
        const wx = fbm(u * 2 + ox, v * 2 + oy) - 0.5, wy = fbm(u * 2 + oy + 5, v * 2 + ox + 3) - 0.5;       // domain warp: wisps
        const r = Math.hypot(u + wx * 0.22, v + wy * 0.22) * 2;
        const n = fbm(u * 2.6 + ox + wx * 1.2, v * 2.6 + oy + wy * 1.2);
        const fall = clamp((1 - r) / 0.55);                                                                        // feathered edge
        D[y * CS + x] = clamp((n * 1.5 - 0.42) * Math.pow(fall, 1.6) * 1.9); }
      for (let y = 0; y < CS; y++) for (let x = 0; x < CS; x++) { const i = y * CS + x, hx = D[y * CS + Math.min(CS - 1, x + 1)] - D[y * CS + Math.max(0, x - 1)], hy = D[Math.min(CS - 1, y + 1) * CS + x] - D[Math.max(0, y - 1) * CS + x];
        let nx = -hx * 22, ny = -hy * 22, nz = 1; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
        const o = (((c >> 2) * CS + y) * AW + (c & 3) * CS + x) * 4; atl[o] = (nx * 0.5 + 0.5) * 255; atl[o + 1] = (ny * 0.5 + 0.5) * 255; atl[o + 2] = (nz * 0.5 + 0.5) * 255; atl[o + 3] = D[i] * 255; } }
    const ATL = new THREE.DataTexture(atl, AW, AH, THREE.RGBAFormat); ATL.magFilter = THREE.LinearFilter; ATL.minFilter = THREE.LinearMipmapLinearFilter; ATL.generateMipmaps = true; ATL.flipY = false; ATL.needsUpdate = true;
    // --- particles (precomputed, pure functions of t)
    const W0 = (V.wind || [15, -3]), PL = [], lnorm = (R, med, sg, lo, hi) => { const g1 = Math.max(1e-4, R()), g2 = R(); return clamp(med * Math.exp(sg * Math.sqrt(-2 * Math.log(g1)) * Math.cos(6.2832 * g2)), lo, hi); };
    SH.forEach(([ts, x, z, ax, az], i) => { const R = mb(i * 7919 + 101); let dx = ax - x, dz = az - z; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
      const Lj = (V.jet || [70, 110])[0] + R() * ((V.jet || [70, 110])[1] - (V.jet || [70, 110])[0]), nJ = 9, nB = V.billows ?? 9;
      for (let j = 0; j < nJ; j++) { const u = j / (nJ - 1); PL.push({ t: ts, x, z, dx, dz, kind: 0, s: Lj * (0.12 + 0.88 * u) * (0.9 + 0.2 * R()), lat: (R() - 0.5) * 8 * u, sz0: lerp(18, 45, u), sz1: lerp(40, 85, u) * (0.8 + 0.4 * R()),
        a0: 0.9 * (1 - 0.35 * u), tau: 1.3, life: 4, h: R(), cell: Math.floor(R() * 8), rot: R() * 6.283, spin: (R() - 0.5) * 0.3 }); }
      for (let b = 0; b < nB; b++) { const u = R(); PL.push({ t: ts + 0.04 + 0.35 * R(), x, z, dx, dz, kind: 1, s: Lj * (0.25 + 0.8 * u), lat: (R() - 0.5) * 34, sz0: 22, sz1: lnorm(R, 62, 0.45, 40, 140),
        a0: 0.3, tau: 5.0, life: 11.5 + 2.5 * R(), h: R(), cell: Math.floor(R() * 8), rot: R() * 6.283, spin: (R() - 0.5) * 0.15 }); } });
    PL.sort((a, b) => a.t - b.t);
    const N = PL.length, geo = new THREE.InstancedBufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0], 3)); geo.setIndex([0, 1, 2, 0, 2, 3]);
    const iP = new THREE.InstancedBufferAttribute(new Float32Array(N * 4), 4), iQ = new THREE.InstancedBufferAttribute(new Float32Array(N * 4), 4);   // xyz size | alpha cell rot shade
    iP.setUsage(THREE.DynamicDrawUsage); iQ.setUsage(THREE.DynamicDrawUsage); geo.setAttribute("iP", iP); geo.setAttribute("iQ", iQ); geo.instanceCount = 0;
    const NT = V.night ? [0.42, 0.47, 0.58] : [1, 1, 1];
    const mat = new THREE.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
      uniforms: { uA: { value: ATL }, uR: { value: new THREE.Vector3() }, uU: { value: new THREE.Vector3() }, uNT: { value: new THREE.Vector3(...NT) } },
      vertexShader: `attribute vec4 iP; attribute vec4 iQ; uniform vec3 uR; uniform vec3 uU; varying vec2 vUv; varying vec4 vQ; varying vec2 vL;
        void main(){ float c = cos(iQ.z), s = sin(iQ.z); vec2 q = vec2(c * position.x - s * position.y, s * position.x + c * position.y);
          vec3 wp = iP.xyz + (uR * q.x + uU * q.y) * iP.w; vec2 cell = vec2(mod(iQ.y, 4.0), floor(iQ.y / 4.0));
          vUv = (cell + (position.xy + 0.5) * 0.98 + 0.01) / vec2(4.0, 2.0); vQ = iQ; vL = vec2(-s * -0.35 + c * 0.0, 0.0) ; vL = vec2(c, s);
          gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0); }`,
      fragmentShader: `uniform sampler2D uA; uniform vec3 uNT; varying vec2 vUv; varying vec4 vQ; varying vec2 vL;
        void main(){ vec4 tx = texture2D(uA, vUv); float d = tx.a * vQ.x; if (d < 0.002) discard;
          vec3 n = normalize(tx.rgb * 2.0 - 1.0);
          vec2 Ls = normalize(vec2(-0.35, 0.94));                        // light from the screen top (slightly left), in the sprite's own rotated frame
          vec2 L = vec2(vL.x * Ls.x + vL.y * Ls.y, -vL.y * Ls.x + vL.x * Ls.y);
          float lit = clamp(0.48 + 1.25 * dot(n.xy, L) + 0.35 * (vQ.w - 0.5), 0.0, 1.0);
          vec3 top = vec3(0.922, 0.910, 0.871), mid = vec3(0.784, 0.784, 0.804), und = vec3(0.549, 0.569, 0.608);
          vec3 col = lit < 0.5 ? mix(und, mid, lit * 2.0) : mix(mid, top, lit * 2.0 - 1.0);
          col *= uNT; gl_FragColor = vec4(col * d, d); }` });
    const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; const sScene = new THREE.Scene(); sScene.add(mesh);
    const RT = new THREE.WebGLRenderTarget(1280, 720, { type: THREE.HalfFloatType, depthBuffer: false });
    const MAXR = 24, rects = Array.from({ length: MAXR }, () => new THREE.Vector4(-1, -1, -1, -1)), rmax = new Float32Array(MAXR);
    const comp = new THREE.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
      uniforms: { uT: { value: RT.texture }, uRc: { value: rects }, uRm: { value: rmax }, uCap: { value: V.cap ?? 0.75 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
      fragmentShader: `uniform sampler2D uT; uniform vec4 uRc[${MAXR}]; uniform float uRm[${MAXR}]; uniform float uCap; varying vec2 vUv;
        void main(){ vec4 c = texture2D(uT, vUv); if (c.a < 0.002) discard; vec2 p = vec2(vUv.x * 1920.0, (1.0 - vUv.y) * 1080.0); float m = uCap;
          for (int i = 0; i < ${MAXR}; i++) { vec4 r = uRc[i]; if (r.z < 0.0) continue; vec2 dd = max(r.xy - p, p - r.zw); float e = max(dd.x, dd.y);
            m = min(m, mix(uRm[i], uCap, smoothstep(0.0, 34.0, e))); }
          float a = min(c.a, m); vec3 col = c.rgb / max(c.a, 1e-4); gl_FragColor = vec4(col * a, a); }` });   // colours are already display (sRGB) values
    const cq = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), comp); cq.frustumCulled = false; const cScene = new THREE.Scene(); cScene.add(cq); const oCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    // --- the flash canvases above the smoke (normal + screen-blended glow)
    const mkC = (blend) => { const c = document.createElement("canvas"); c.width = 1920; c.height = 1080; c.style.cssText = `position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;${blend ? "mix-blend-mode:screen;" : ""}`;
      SCN.insertBefore(c, WO); return c; };
    const FC = mkC(false), GC = mkC(true), fg = FC.getContext("2d"), gg = GC.getContext("2d");
    const proj = (x, z) => { const v = new THREE.Vector3(x, 0, z).project(camera); return [(v.x + 1) / 2 * 1920, (1 - v.y) / 2 * 1080]; };
    const unitRects = () => { const out = [], add = (el, m, pad = 3) => { if (!el || out.length >= MAXR) return; const cs = getComputedStyle(el); if (cs.visibility === "hidden") return;
        const r = el.getBoundingClientRect(); if (r.width < 2 || r.right < 0 || r.left > 1920 || r.bottom < 0 || r.top > 1080) return; out.push([r.left - pad, r.top - pad, r.right + pad, r.bottom + pad, m]); };
      document.querySelectorAll("#pins .unit").forEach((u) => { let op = 1; for (let e = u; e && e.id !== "pins"; e = e.parentElement) op *= +getComputedStyle(e).opacity; if (op < 0.05) return;
        const red = /rome|british/.test(u.className); add(u.querySelector(".blk"), red ? 0.3 : 0.55); add(u.querySelector(".tag"), 0.1); });
      document.querySelectorAll(".bn-cloth, .bn-name").forEach((e) => add(e, 0.45)); return out; };
    SMOKE = {
      draw(t) {
        const e = camera.matrixWorld.elements; mat.uniforms.uR.value.set(e[0], e[1], e[2]).normalize(); mat.uniforms.uU.value.set(e[4], e[5], e[6]).normalize();
        let n = 0; const P = iP.array, Q = iQ.array, Wx = W0[0], Wz = W0[1];
        for (const p of PL) { const age = t - p.t; if (age < 0) break; if (age > p.life) continue;
          const eo = 1 - Math.pow(1 - Math.min(1, age / 0.15), 3);                                             // jet: ease-out over 0.15 s
          const fw = p.s * (eo + (p.kind ? 0.12 : 0.05) * Math.min(1, age / 1.5));
          const wk = Math.max(0, age - 0.2), shear = 0.75 + 0.5 * p.h;                                           // the top moves faster
          const rise = 10 * Math.min(age, 2) + 2 * Math.max(0, age - 2);                                           // north on screen (-z)
          const sx = p.dx * fw - p.dz * p.lat * Math.min(1, age / 0.6) + Wx * shear * wk, sz = p.dz * fw + p.dx * p.lat * Math.min(1, age / 0.6) + Wz * shear * wk - rise - p.h * 14;
          const grow = p.kind ? (0.35 + 0.65 * Math.min(1, age / 0.9)) * (1 + 0.16 * age) : lerp(1, p.sz1 / p.sz0, Math.min(1, age / 1.2));
          const size = (p.kind ? p.sz1 : p.sz0) * grow;
          const a = p.a0 * Math.min(1, age / 0.04) * Math.exp(-age / p.tau) * (1 - sstep(p.life * 0.7, p.life, age));
          if (a < 0.003) continue;
          P[n * 4] = p.x + sx * K; P[n * 4 + 1] = (2 + p.h * 6) * K; P[n * 4 + 2] = p.z + sz * K; P[n * 4 + 3] = size * K;
          Q[n * 4] = a; Q[n * 4 + 1] = p.cell; Q[n * 4 + 2] = p.rot + p.spin * age; Q[n * 4 + 3] = p.h; n++; }
        geo.instanceCount = n; iP.needsUpdate = true; iQ.needsUpdate = true;
        const prev = renderer.getRenderTarget(); renderer.setRenderTarget(RT); renderer.setClearColor(0, 0); renderer.clear(true, false, false);
        if (n) renderer.render(sScene, camera);
        renderer.setRenderTarget(prev);
        const ur = unitRects(); for (let i = 0; i < MAXR; i++) { const r = ur[i]; if (r) { rects[i].set(r[0], r[1], r[2], r[3]); rmax[i] = r[4]; } else rects[i].set(-1, -1, -1, -1); }
        if (n) renderer.render(cScene, oCam);
        // flashes
        fg.clearRect(0, 0, 1920, 1080); gg.clearRect(0, 0, 1920, 1080); const F = 1 / 30;
        for (let i = 0; i < SH.length; i++) { const [ts, x, z, ax, az] = SH[i], age = t - ts; if (age < -2.5 * F || age > 0.25) continue;
          const [mx, my] = proj(x, z), [tx, ty] = proj(ax, az), ang = Math.atan2(ty - my, tx - mx), R = mb(i * 31 + 7);
          if (age >= -2 * F - 1e-4 && age < -F - 1e-4) {   // priming pan: 12 px, 1 frame, 2 frames early, just behind the muzzle
            const px = mx - Math.cos(ang) * 8, py = my - Math.sin(ang) * 8, gr = fg.createRadialGradient(px, py, 0, px, py, 7);
            gr.addColorStop(0, "rgba(255,252,225,1)"); gr.addColorStop(0.5, "rgba(255,205,90,.9)"); gr.addColorStop(1, "rgba(255,140,30,0)"); fg.fillStyle = gr; fg.beginPath(); fg.arc(px, py, 7, 0, 7); fg.fill(); }
          if (age >= -1e-4 && age < 2 * F - 1e-4) {        // muzzle tongue: frame 1 100 %, frame 2 60 %
            const A = age < F - 1e-4 ? 1 : 0.6, Lt = 55 + 15 * R(), Wt = 16 + 8 * R();
            fg.save(); fg.translate(mx, my); fg.rotate(ang); fg.globalAlpha = A;
            const lg = fg.createLinearGradient(0, 0, Lt, 0); lg.addColorStop(0, "#FFFBE0"); lg.addColorStop(0.28, "#FFE9A0"); lg.addColorStop(0.55, "#FFB030"); lg.addColorStop(0.85, "#E04A10"); lg.addColorStop(1, "rgba(224,74,16,0)");
            fg.fillStyle = lg; fg.filter = "blur(1.2px)"; fg.beginPath(); fg.moveTo(-2, 0);
            fg.bezierCurveTo(Lt * 0.15, -Wt * 0.62, Lt * 0.55, -Wt * 0.55, Lt, -Wt * 0.08); fg.lineTo(Lt * 0.92, 0); fg.lineTo(Lt, Wt * 0.1); fg.bezierCurveTo(Lt * 0.55, Wt * 0.58, Lt * 0.15, Wt * 0.6, -2, 0); fg.fill();
            fg.filter = "blur(0.8px)"; const cg = fg.createRadialGradient(4, 0, 0, 4, 0, 9); cg.addColorStop(0, "rgba(255,255,255,1)"); cg.addColorStop(1, "rgba(255,251,224,0)"); fg.fillStyle = cg; fg.beginPath(); fg.ellipse(5, 0, 11, 6, 0, 0, 7); fg.fill();
            fg.restore(); fg.filter = "none"; fg.globalAlpha = 1; }
          if (age >= -1e-4 && age < 3 * F - 1e-4) {        // additive glow: lights the map and the smoke (screen blend), 3 frames
            const A = [0.32, 0.22, 0.12][Math.min(2, Math.floor(age / F + 1e-3))], gx = mx + Math.cos(ang) * 14, gy = my + Math.sin(ang) * 14, gr = gg.createRadialGradient(gx, gy, 0, gx, gy, 45);
            gr.addColorStop(0, `rgba(255,190,90,${A})`); gr.addColorStop(0.5, `rgba(255,140,50,${A * 0.45})`); gr.addColorStop(1, "rgba(255,120,40,0)"); gg.fillStyle = gr; gg.fillRect(gx - 46, gy - 46, 92, 92); }
          if (age >= 0 && age < 0.2) {                       // 8 motion-blurred spark streaks over 0.2 s
            for (let k = 0; k < 8; k++) { const a2 = ang + (R() - 0.5) * 0.9, sp = 160 + 200 * R(), d1 = sp * age + 10, d0 = Math.max(6, d1 - 10), al = 1 - age / 0.2;
              const x0 = mx + Math.cos(a2) * d0, y0 = my + Math.sin(a2) * d0, x1 = mx + Math.cos(a2) * d1, y1 = my + Math.sin(a2) * d1, lg = fg.createLinearGradient(x0, y0, x1, y1);
              lg.addColorStop(0, "rgba(255,170,60,0)"); lg.addColorStop(1, `rgba(255,236,170,${al.toFixed(3)})`); fg.strokeStyle = lg; fg.lineWidth = 1.2; fg.beginPath(); fg.moveTo(x0, y0); fg.lineTo(x1, y1); fg.stroke(); } }
        } } };
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
    if (SMOKE) SMOKE.draw(t);
  };
  window.__BWGL = { draw, camera, renderer, systems, dive: DV };
  draw(window.tl ? window.tl.time() : 0);
  ready();
}
