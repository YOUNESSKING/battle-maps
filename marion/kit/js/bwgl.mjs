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
  WO.innerHTML = '<div style="position:absolute;inset:0;background:rgb(208,211,204)"></div><div style="position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse farthest-corner at 50% 47%,rgb(226,224,213) 0%,rgb(224,222,211) 50%,rgb(214,212,200) 100%)"></div>';
  SCN.insertBefore(WO, cv.nextSibling);
  const [WC, WW] = WO.children;
  if (C.dive && C.dive.greyCol) WC.style.background = C.dive.greyCol;   // r13c: the inside-the-deck grey (the cream white-out layer WW unchanged)
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
      sh.fragmentShader = sh.fragmentShader.slice(0, i) + `\n  gl_FragColor = vec4(0.0, 0.0, 0.0, clamp(1.0 - gl_FragColor.g, 0.0, 1.0) * ${(C.shadowK ?? 0.9).toFixed(2)} * opacity);   // r13c: * opacity (a fading cloud system fades its shadow)\n}`; };
    const g = new THREE.Mesh(new THREE.PlaneGeometry(box[2], box[3]), m); g.rotation.x = -Math.PI / 2; g.position.set(box[0] + box[2] / 2, 0, box[1] + box[3] / 2); g.renderOrder = -20; sys.scene.add(g); return g; };
  // LOOK-LOCK pending-begin clouds (NOT approved, owner 2026-11-28: the dive, the deck, the white-out and the cumulus are being redone; research/look_lock_stylew/LOCK.md)
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
    // r13c: corridor (road / stamp / spoken place): its clusters live in their own system that fades out only while that corridor is on screen
    const CORR = C.fair.corridor, corrC = new Set(), inCorr = (x, z, r) => !!CORR && ((CORR.keep || []).some(([cx, cz, R]) => Math.hypot(x - cx, z - cz) < R + r)
      || (CORR.keepLines || []).some(([pts, R]) => pts.some((p) => Math.hypot(x - p[0], z - p[1]) < R + r)));
    const sc = { med: 30, tries: 900, seed: 0, n: 12, ...C.fair };
    const wsp = [], sd = sc.seed;
    // r13e: screenPlace {t, px:[x0,y0,x1,y1], med, rMin, rMax (screen px)}: clusters spread evenly over the FRAME at time t (uniform world placement
    // crowded the far top of the tilted view with small clouds and left the near half empty); each is put where its pixel's ray meets its height
    const SPL = C.fair.screenPlace, FT = new Map(); let spAt = null;
    if (SPL) { const TL = window.__timelines && window.__timelines.main, t0 = TL ? TL.time() : 0; if (TL) TL.seek(SPL.t, false); camSolve();
      const P = camera.position.clone(), M = camera.matrixWorld.clone(), PI = camera.projectionMatrixInverse.clone(), T = C.fair.tiers || [49, 49]; if (TL) TL.seek(t0, false);
      // r13f: groups {n, gap, spread}: loose Poisson clusters (group centres >= gap px apart, 2-4 clouds within `spread` px of each), clear sky between
      const GR = SPL.groups, GC = [], UKS = (C.fair.unitKeep ? C.fair.unitKeep.keep : []).map(([x, z]) => { const v = new THREE.Vector3(x, 0, z).project(camera); return [(v.x + 1) * 960, (1 - v.y) * 540]; });   // group centres keep off the British boxes
      if (GR) for (let i = 0; i < 400 && GC.length < GR.n; i++) { const x = SPL.px[0] + hsh(i + sd, 81) * (SPL.px[2] - SPL.px[0]), y = SPL.px[1] + hsh(i + sd, 82) * (SPL.px[3] - SPL.px[1]);
        if (GC.every(([a, b]) => Math.hypot(a - x, (b - y) * 1.3) > GR.gap) && !UKS.some(([a, b]) => Math.hypot(a - x, b - y) < GR.spread + (GR.unitGap ?? 90))) GC.push([x, y]); }
      window.__bwglGroups = GC;
      spAt = (c) => { const h = (T[Math.floor(hsh(c, 71) * T.length)] + 4.5) * F + 10 * F; let sx, sy;
        if (GC.length) { const g = GC[Math.floor(hsh(c + sd, 83) * GC.length)], an = hsh(c + sd, 84) * 6.283, rr = GR.spread * Math.sqrt(hsh(c + sd, 85)); sx = g[0] + Math.cos(an) * rr; sy = g[1] + Math.sin(an) * rr * 0.75; }
        else { sx = SPL.px[0] + hsh(c + sd, 61) * (SPL.px[2] - SPL.px[0]); sy = SPL.px[1] + hsh(c + sd, 62) * (SPL.px[3] - SPL.px[1]); }
        const d = new THREE.Vector3(sx / 960 - 1, 1 - sy / 540, 0.5).applyMatrix4(PI).applyMatrix4(M).sub(P), k = (h - P.y) / d.y, rpx = lnr(c + sd, 63, SPL.med, SPL.sig ?? 0.4, SPL.rMin, SPL.rMax);
        return [P.x + d.x * k, P.z + d.z * k, Math.max((sc.rMin ?? 14) * F, rpx * d.length() * k / 1700), rpx]; };
      // r13h authored [[sx, sy, rpx, lobes, layer 0 far / 1 near], ...]: the gm3d v6 field traced at 10.4 s, placed at screenPlace.t exactly
      if (C.fair.authored) C.fair.authored.forEach(([sx, sy, rpx0, lobes, layer], i) => { const rpx = rpx0 * (C.fair.authoredK ?? 1); const c = 2000 + i, tv = layer ? T[T.length - 1] : T[0]; FT.set(c, tv);
        const h = (tv + 4.5) * F + 10 * F, d = new THREE.Vector3(sx / 960 - 1, 1 - sy / 540, 0.5).applyMatrix4(PI).applyMatrix4(M).sub(P), k = (h - P.y) / d.y;
        const cx = P.x + d.x * k, cz = P.z + d.z * k, Rw = rpx * d.length() * k / 1700, R0 = Math.max((sc.rMin ?? 14) * F, Rw * (lobes > 1 ? 0.62 : 0.9));
        wsp.push([cx, cz, R0, c]);
        for (let j = 1; j < lobes; j++) { const a = (j / (lobes - 1)) * 6.283 + hsh(c, 90 + j) * 1.2, r = R0 * (0.5 + 0.25 * hsh(c, 95 + j)), dd = Math.max(0, Rw - r) * (0.75 + 0.2 * hsh(c, 99 + j));
          wsp.push([cx + Math.cos(a) * dd, cz + Math.sin(a) * dd * (C.fair.kidZ ?? 0.8), Math.max((sc.rMin ?? 14) * F * 0.8, r), c]); } }); }   // world floor: domes under ~2x the noise amplitude are eaten by the noise
    // r13h: v6Field {at:[x,z], k, nudge:{cluster:[dx,dz]}}: the gm3d v6 clip's own field, ported exactly (its seed, 14 Poisson clusters of 2-5,
    // log-normal radii med 30 sigma 0.6, its 3 near-lens corner masses), v6 world units -> ours around the dive target (v6 deck centre 1518,712)
    const V6 = C.fair.v6Field;
    if (V6) { const K = V6.k ?? F, [ox, oz] = V6.at, v = [], off6 = (x, z, r) => Math.hypot(x - 1518, (z - 712) * 1.15) < 118 + 0.5 * r, NG = V6.nudge || {};
      for (let c = 0, n = 0; c < 600 && n < 14; c++) {
        const cx = 1150 + hsh(c, 61) * 860, cz = 340 + hsh(c, 62) * 640, R0 = lnr(c, 63, 30, 0.6, 12, 90);
        if (off6(cx, cz, R0) || v.some(([a, b, q]) => Math.hypot(a - cx, b - cz) < q + R0 + 10)) continue;
        n++; v.push([cx, cz, R0, c]); const kids = 1 + Math.floor(hsh(c, 65) * 4);
        for (let k = 0; k < kids; k++) { const a = hsh(c * 7 + k, 66) * 6.283, r = lnr(c * 7 + k, 67, R0 * 0.45, 0.6, 7, R0 * 0.9), d = R0 * (0.9 + 0.8 * hsh(c * 7 + k, 69)) + r * 0.6;
          const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d * 0.8; if (!off6(x, z, r)) v.push([x, z, r, c]); } }
      [[1290, 915, 95], [1815, 930, 85], [1175, 470, 70]].forEach(([x, z, r], i) => v.push([x, z, r, 1000 + i]));
      for (const [x, z, r, c] of v) { const g = NG[c] || [0, 0]; wsp.push([ox + (x + g[0] - 1518) * K, oz + (z + g[1] - 712) * K, Math.max((sc.rMin ?? 0) * F, r * K), c]); }
      window.__bwglV6 = v.length; }
    if (!V6 && !C.fair.authored) for (let c = 0, k = 0; c < sc.tries && k < sc.n; c++) {
      const [cx, cz, R0, RPX] = spAt ? spAt(c) : [B[0] + hsh(c + sd, 61) * B[2], B[1] + hsh(c + sd, 62) * B[3], lnr(c + sd, 63, sc.med * F, 0.5, (sc.rMin ?? 14) * F, (sc.rMax ?? 70) * F)];   // r13c: radius clamp per scene
      if (offWide(cx, cz, R0) || wsp.some(([a, b, q]) => Math.hypot(a - cx, b - cz) < (q + R0) * (SPL && SPL.groups ? SPL.groups.overlap ?? 1 : 1) + 10 * F)) { (window.__bwglRej = window.__bwglRej || []).push([cx, cz, R0, offWide(cx, cz, R0) ? 1 : 2]); continue; }
      k++; wsp.push([cx, cz, R0, c]); if (inCorr(cx, cz, R0)) corrC.add(c); const hk = hsh(c + sd, 65), kids = SPL && SPL.lobes && RPX ? (RPX > 110 ? 4 + Math.floor(hk * 2) : RPX > 70 ? 2 + Math.floor(hk * 2) : 1 + Math.floor(hk * 1.5)) : 1 + Math.floor(hk * 3);   // r13f lobes: big clouds = more lobes
      for (let j = 0; j < kids; j++) { const i2 = (c + sd) * 7 + j, a = hsh(i2, 66) * 6.283, r = lnr(i2, 67, R0 * 0.45, 0.6, 7 * F, R0 * 0.9), dd = R0 * ((C.fair.kidD || [0.9, 0.8])[0] + (C.fair.kidD || [0.9, 0.8])[1] * hsh(i2, 69)) + r * 0.6;   // r13d: kidD = tighter (rounder) clusters
        const x = cx + Math.cos(a) * dd, z = cz + Math.sin(a) * dd * (C.fair.kidZ ?? 0.8);   /* r13e: kidZ > 1 offsets the tilted view's foreshortening (no wide pillows) */ if (!offWide(x, z, r)) { wsp.push([x, z, r, c]); if (inCorr(x, z, r)) corrC.add(c); } } }
    // r5: screen-space keep-clear (spoken places must read): drop whole clusters whose cloud projects into the box (+ its radius) at the sampled times
    const SCL = C.fair.screenClear; let dropC = new Set();
    if (SCL) { const TL = window.__timelines && window.__timelines.main, t0 = TL ? TL.time() : 0, v = new THREE.Vector3();
      const tiers0 = C.fair.tiers || [49, 49];
      for (let tt = SCL.t[0]; tt <= SCL.t[1] + 1e-6; tt += 0.25) { if (TL) TL.seek(tt, false); camSolve();
        for (const [x, z, r, c] of wsp) { for (const yy of tiers0) { v.set(x, (yy + 20) * F, z).project(camera); const sx = (v.x + 1) / 2 * 1920, sy = (1 - v.y) / 2 * 1080;
          const rs = r * 1.3 * 1700 / Math.max(1, camera.position.distanceTo(new THREE.Vector3(x, yy * F, z)));
          if (v.z < 1 && (SCL.boxes || [SCL.box]).some(([bx0, by0, bx1, by1]) => sx + rs > bx0 && sx - rs < bx1 && sy + rs > by0 && sy - rs < by1)) dropC.add(c); } } }   // r13: several keep-clear boxes (cards, date plate, key)
      if (TL) TL.seek(t0, false); }
    for (let i = wsp.length - 1; i >= 0; i--) if (dropC.has(wsp[i][3])) wsp.splice(i, 1);
    // 2-3 heights (parallax while the camera drops): each cluster picks a tier
    const TIERS = C.fair.tiers || [49, 49];
    // r13c: a fair cluster over a deck mass goes to the top tier (its own system when nearTier is set): on the far map its footprint would replace
    // the deck columns and punch a round hole in the deck
    const MSS = DV && C.fair.masses ? C.fair.masses.map(([mx, mz, MR]) => [DV.over[0] + mx * F, DV.over[1] + mz * F, MR * F]) : [], overDeck = new Set();
    for (const [x, z, r, c] of wsp) if (MSS.some(([a, b, R]) => Math.hypot(x - a, z - b) < R + 1.8 * r)) overDeck.add(c);
    window.__bwglDeckOverlap = overDeck.size;
    const tierOf = (c) => (C.fair.nearTier != null && overDeck.has(c) ? Math.max(...TIERS) : FT.has(c) ? FT.get(c) : TIERS[Math.floor(hsh(c, 71) * TIERS.length)]);   // over a deck mass -> upper layer (no hole in the deck)
    const deck = [];
    if (DV && C.fair.masses) {   // r13b (critic A): the deck = 2-3 big merged masses (+ the centre) of tightly packed lumps, no separate puffs
      const MS = C.fair.massStep || 14, ML = C.fair.massLump || [18, 10];   // r13c: lump spacing + radius (bigger lobes, fewer puffs)
      let i = 0; for (const [mi, [mx, mz, MR]] of C.fair.masses.entries()) for (let gx = -MR; gx <= MR; gx += MS) for (let gz = -MR; gz <= MR; gz += MS, i++) {
        const x = gx + (hsh(i, 5) - 0.5) * MS * 0.57, z = gz + (hsh(i, 6) - 0.5) * MS * 0.57; if (Math.hypot(x, z * 1.1) > MR) continue;
        deck.push([DV.over[0] + (mx + x) * F, DV.over[1] + (mz + z) * F, (ML[0] + hsh(i, 8) * ML[1]) * F, mi]); } }   // r13d: one base height for the whole deck (base steps between lumps showed as a stepped notch, a gap between two heights)
    else if (DV && C.fair.deckV6) {   // r17 (opt-in): the gm3d v6 dive deck exactly (clip index.html), lengths x F round the target: a 22-unit grid of sheet
      // cumulus r 13-25, dense in the camera's column, ragged towards the rim, + the 6 column lumps; heights 58 + 0-3 (mi "v6")
      const cx0 = DV.over[0], cz0 = DV.over[1];
      for (let i = 0, gx = -118; gx < 122; gx += 22) for (let gz = -112; gz < 108; gz += 22, i++) {
        const x = gx + (hsh(i, 5) - 0.5) * 18, z = gz + (hsh(i, 6) - 0.5) * 18, r = Math.hypot(x, (z + 6) * 1.15);
        if (hsh(i, 7) < lerp(0.95, 0.5, clamp((r - 30) / 90))) deck.push([cx0 + x * F, cz0 + z * F, (13 + hsh(i, 8) * 12) * F, "v6"]); }
      for (const [dx, dz, r] of [[0, -6, 30], [-6, 5, 26], [8, -13, 26], [3, 14, 26], [-11, -15, 24], [13, 1, 24]]) deck.push([cx0 + dx * F, cz0 + dz * F, r * F, "v6"]); }
    else if (DV && C.fair.deck !== false) { const cx0 = DV.over[0], cz0 = DV.over[1] + 6 * F;
      for (let i = 0, gx = cx0 - 118 * F; gx < cx0 + 122 * F; gx += 27 * F) for (let gz = cz0 - 112 * F; gz < cz0 + 108 * F; gz += 27 * F, i++) {   // r13: fewer, bigger, merging lumps
        const x = gx + (hsh(i, 5) - 0.5) * 18 * F, z = gz + (hsh(i, 6) - 0.5) * 18 * F, r = Math.hypot(x - cx0, (z - cz0) * 1.15);
        if (hsh(i, 7) < lerp(0.97, 0.55, clamp((r - 30 * F) / (90 * F)))) deck.push([x, z, (20 + hsh(i, 8) * 16) * F]); }
      for (const [dx, dz, r] of [[0, 0, 30], [-6, 11, 26], [8, -7, 26], [3, 20, 26], [-11, -9, 24], [13, 7, 24]]) deck.push([DV.over[0] + dx * F, DV.over[1] + dz * F, r * F]); }
    const HK = C.fair.hK ?? 1, HM = (C.fair.hMin ?? 0) * F, cl = wsp.map(([x, z, r, c], i) => Object.assign([x, z, r, Math.max(HM, 3 * F + HK * r * (0.18 + 0.16 * hsh(i, 13))),   /* r13e: hMin: thin domes vanished in the noise */ (tierOf(c) + hsh(i, 11) * 9) * F, 0], { corr: CORR && CORR.perDome ? inCorr(x, z, r) : corrC.has(c), cid: c }))   // r13c: perDome = only the lumps over the corridor fade
      .concat(deck.map(([x, z, r, mi], i) => [x, z, r, r * (0.26 + 0.1 * hsh(i, 14) + 0.12 * clamp(1 - Math.hypot(x - DV.over[0], z - (DV.over[1] + 4 * F)) / (60 * F))), (mi === "v6" ? (C.fair.deckY ?? 58) * F + hsh(i, 12) * (C.fair.deckJit ?? 3) * F : mi != null ? (C.fair.deckY ?? 62) * F : (hsh(i, 15) < 0.35 ? 72 : 56) * F + hsh(i, 12) * 4 * F), 1]));   // r13: two deck heights -> parallax layers through the dive
    // r13c: corridor test where the lump APPEARS (the camera ray through the lump hits the ground there; tilted, a raised cloud shows north of its
    // ground point), sampled over the corridor's window CORR.t
    if (CORR && CORR.t) { const TL = window.__timelines && window.__timelines.main, t0 = TL ? TL.time() : 0; for (const c of cl) c.corr = false;
      for (let tt = CORR.t[0]; tt <= CORR.t[1] + 1e-6; tt += 0.2) { if (TL) TL.seek(tt, false); camSolve(); const P = camera.position;
        for (const c of cl) { if (c[5] === 1 || c.corr) continue; const h = c[4] + 0.5 * c[3], k = P.y / Math.max(1, P.y - h);
          if (inCorr(P.x + (c[0] - P.x) * k, P.z + (c[1] - P.z) * k, c[2] * k)) c.corr = true; } }
      if (TL) TL.seek(t0, false); }
    // r13d: no fair lump may APPEAR over the units spoken about (unitKeep {t, keep:[[x, z, R]]}): such lumps are dropped
    const UK = C.fair.unitKeep; if (UK) { const TL = window.__timelines && window.__timelines.main, t0 = TL ? TL.time() : 0, drop = new Set();
      for (let tt = UK.t[0]; tt <= UK.t[1] + 1e-6; tt += 0.25) { if (TL) TL.seek(tt, false); camSolve(); const P = camera.position;
        cl.forEach((c, i) => { if (c[5] === 1 || drop.has(i)) return; const h = c[4] + 0.5 * c[3], k = P.y / Math.max(1, P.y - h), gx = P.x + (c[0] - P.x) * k, gz = P.z + (c[1] - P.z) * k;
          if (UK.keep.some(([x, z, R]) => Math.hypot(gx - x, gz - z) < R + c[2] * k)) drop.add(i); }); }
      if (TL) TL.seek(t0, false); window.__bwglDropped = cl.filter((c, i) => drop.has(i)); for (let i = cl.length - 1; i >= 0; i--) if (drop.has(i)) cl.splice(i, 1); window.__bwglUnitDrop = drop.size; }
    // r13g edgeKeep {near, t:[..], maxPx}: upper-layer lumps keep `near` px inside the right edge (at the frame edge the oblique view smeared them
    // into torn paper wings); any fair lump bigger than maxPx on screen (too close to the lens) is dropped too
    const EK = C.fair.edgeKeep; if (EK) { const TL = window.__timelines && window.__timelines.main, t0 = TL ? TL.time() : 0, drop = new Set(), v = new THREE.Vector3();
      for (const tt of EK.t || [0.5, 2.5, 5.0]) { if (TL) TL.seek(tt, false); camSolve();
        cl.forEach((c, i) => { if (c[5] === 1 || drop.has(i)) return; v.set(c[0], c[4] + 0.5 * c[3], c[1]); const d = camera.position.distanceTo(v); v.project(camera);
          const sx = (v.x + 1) * 960, rs = c[2] * 1.2 * 1700 / d, near = c[4] >= (C.fair.nearTier ?? 1e9) * F;
          if (sx + rs > 1920 - (near ? EK.near : EK.far ?? -1e9) || rs > (EK.maxPx ?? 1e9)) drop.add(i); }); }
      if (TL) TL.seek(t0, false); for (let i = cl.length - 1; i >= 0; i--) if (drop.has(i)) cl.splice(i, 1); window.__bwglEdgeDrop = drop.size; }
    window.__bwglDbg = { list: cl, wsp: wsp.length, clusters: new Set(wsp.map((q) => q[3])).size, proj: () => { camSolve(); const v = new THREE.Vector3();   // r13e: debug (probe): fair lumps on screen
      return cl.filter((c) => c[5] === 0).map((c) => { v.set(c[0], c[4] + 0.5 * c[3], c[1]).project(camera); const d = camera.position.distanceTo(new THREE.Vector3(c[0], c[4], c[1]));
        return [Math.round((v.x + 1) * 960), Math.round((1 - v.y) * 540), Math.round(c[2] * 1700 / d), c.corr ? 1 : 0, c[4] >= (C.fair.nearTier || 1e9) * F ? 1 : 0, Math.round(c[3] / c[2] * 100) / 100, c.cid]; }); },
      units: () => { camSolve(); const v = new THREE.Vector3(); return (C.fair.unitWatch || []).map(([x, z]) => { v.set(x, 0, z).project(camera); return [Math.round((v.x + 1) * 960), Math.round((1 - v.y) * 540)]; }); } };
    window.__bwglClouds = cl.length;
    const D0 = DV || NODIVE, AD = (t) => (t > D0.SW + 1 ? NODIVE : D0);
    const slabTop = (C.fair.slabTop ?? Math.max(104, ...TIERS.map((v) => v + 55))) * F;   // r17: slabTop opt-in (big near clouds were cut flat at the slab top)
    const mkVC = (sx, list, dk, opF) => { if (list.length) sx.vc = sx.fx.vclouds({ noise: NOISE, clouds: list, bounds: (C.fair.fitBounds ? (() => { const pd = (c) => c[2] * 1.7 + 32 * F;   // r13d: the map always holds every lump (the deck reached past the box edge: a straight cut at 6.3 s)
        return [Math.min(B[0] - 40 * F, ...list.map((c) => c[0] - pd(c))), Math.min(B[1] - 70 * F, ...list.map((c) => c[1] - pd(c))), Math.max(B[0] + B[2] + 40 * F, ...list.map((c) => c[0] + pd(c))), Math.max(B[1] + B[3] + 40 * F, ...list.map((c) => c[1] + pd(c)))]; })() : [B[0] - 40 * F, B[1] - 70 * F, B[0] + B[2] + 40 * F, B[1] + B[3] + 40 * F]),   // r13e: fitBounds opt-in (it broke the near layer) texel: F, skip: 30 * F,
      slab: [28 * F, slabTop]   /* r13: low enough that no cloud bottom is cut flat */, tile: 125 * F, groupScale: C.fair.groupScale ?? 3.0, amp: 5 * F, soft: (C.fair.soft ?? 1.7) * F, skirtCut: C.fair.skirtCut || 0, lumpK: C.fair.lumpK, baseRound: C.fair.baseRound,   /* r13g: per-lobe rounded bottoms */ baseSharp: C.fair.baseSharp,   /* r13f: softer cloud bases */ flatPow: 0.3, sigma: 0.75 / F,
      stepIn: 0.25 * F, stepK: 0.0035, lightStep: 1.4 * F, lodDist: 260 * F, nearFade: 9 * F,   /* r13: no planar cut where the camera passes through a cloud */ maxSteps: C.fair.maxSteps ?? 200, resolution: C.fair.res ?? 0.75, warp: 0.06, fine: 0.12, wisp: 0.45, inner: 0.8,
      weights: [1.0, 0.5, 1, 0.5], group0: C.fair.group0 || [0.55, 0.3, 1.4, 0.5], blur: 1.0, sharp: 1, shadow: 0.75, shadowDir: C.fair.shadowDir || [0.3, 1, 0.65], drift: (C.fair.drift || [0.10, -0.035]).map((v) => v * F * dk), evolve: 0.0025 / F, floor: 0.05,
      sunK: 1.4, ambK: 0.18, lightK: 3.2,
      erode: (t) => { const d = D0; return [C.fair.erode0 ? C.fair.erode0(t) : 0, C.fair.deckErode ? C.fair.deckErode(t) : t > d.SW + 0.5 ? 9 : lerp(9, lerp(1.6, 0, sstep(d.deckIn - 0.1, d.deckIn + 0.6, t)), sstep(d.deckIn - 0.15, d.deckIn + 0.15, t))]; },   // r5: the deck does not exist before deckIn (spoken places read)
      deck: (t) => { const d = D0; return { x: d.over[0], z: d.over[1], r: 110 * F, front: C.fair.deckFront ? C.fair.deckFront(t) : 3.5 * (1 - sstep(d.deckIn + 0.1, d.full, t)), k: C.fair.deckK ? C.fair.deckK(t) : lerp(0, 1, sstep(d.deckIn, d.deckIn + 0.6, t)) }; },   // r13c: per-scene deck timing overrides
      ms: (t) => { const d = AD(t); return lerp(0.22, 0.42, sstep(d.full - 0.2, d.inside, t)); }, expo: (t) => { const d = AD(t); return lerp(1, 0.93, sstep(d.full - 0.2, d.inside, t)); },
      colors: (t) => { const d = AD(t), k = sstep(d.full - 0.2, d.inside, t), c = sstep(d.deckIn, d.deckIn + 0.5, t) * (1 - k), q = Math.max(k, c);
        const L = C.fair.deckLook; if (L) { const r = deckCol(k, c, q); r.ambBot = r.ambBot.map((v, i) => lerp(v, L.ambBot[i], c)); r.ambTop = r.ambTop.map((v, i) => lerp(v, L.ambTop[i], c)); r.ambK = lerp(r.ambK, L.ambK, c); r.lightK = lerp(r.lightK, L.lightK, c); r.sunK = lerp(r.sunK, L.sunK, c); return r; }   // r13c: deck look (grey hollows) while it builds
        return deckCol(k, c, q); },
      sigmaK: (t) => { const d = AD(t); return lerp(1, 0.5, sstep(d.full, d.inside, t)); },
      opacity: opF || C.fair.opacity || (() => 1) }); };
    const deckCol = (k, c, q) => {
        const S0 = C.fair.sun0 || [1.0, 0.96, 0.88], A0 = C.fair.ambTop0 || [0.58, 0.63, 0.72];   // r13g: warm sunlit tops / cooler shade (per scene)
        return { sun: [lerp(S0[0], 0.95, q), lerp(S0[1], 0.97, q), lerp(S0[2], 0.94, q)], ambTop: [lerp(A0[0], 0.66, q), lerp(A0[1], 0.71, q), lerp(A0[2], 0.76, q)], ambBot: [lerp((C.fair.ambBot || [0.32])[0], 0.40, q), lerp((C.fair.ambBot || [0, 0.36])[1], 0.46, q), lerp((C.fair.ambBot || [0, 0, 0.44])[2] ?? 0.44, 0.54, q)],   // r13: whiter lit tops, softer grey undersides (v6)
          nSun: CW_DAY.nSun, nAmbTop: CW_DAY.nAmbTop, nAmbBot: CW_DAY.nAmbBot, ambK: lerp(C.fair.ambK0 ?? 0.24, 0.36, q), lightK: lerp(3.2, 1.4, k) * lerp(1, 0.8, c), sunK: lerp(C.fair.sunK0 ?? 1.65, 1.2, q) }; };   // r13c: per-scene early-field light
    // r13b (critic A): two heights, the near (higher) layer drifts 1.6x faster (its own vclouds system)
    const NT = C.fair.nearTier; if (NT != null) { const isNear = (c) => !(c[5] === 1 || c[4] < NT * F), CO = CORR ? CORR.op : null, NO = C.fair.nearOp, BO = C.fair.opacity || (() => 1);
      // r13c: up to 3 systems: far (+ the deck), near (drifts nearK x, can fade before the camera reaches its height), the corridor lumps (fade while it is spoken)
      const parts = [[cl.filter((c) => !isNear(c) && !c.corr), 1, null], [cl.filter((c) => isNear(c) && !c.corr), C.fair.nearK ?? 1.6, NO],
        [cl.filter((c) => c.corr), CORR && CORR.dk || 1.3, CO && NO ? (t) => CO(t) * NO(t) : CO]];   // corridor lumps also leave before the camera reaches them   // one corridor system for both heights (each raymarch pass costs a full-screen pass)
      window.__bwglParts = parts.map((q) => q[0].length);
      parts.forEach(([list, dk, opF], i) => { if (!list.length) return; const sx = i === 0 ? sys : mkFX({ seed: 1863 + i, on: C.fair.on });
        mkVC(sx, list, dk, opF ? (t) => opF(t) * BO(t) : null); if (i) { const g = ground(sx, [B[0] - 400 * F, B[1] - 400 * F, B[2] + 800 * F, B[3] + 800 * F]); sx.on = C.fair.on || (() => true); if (opF) sx.pre = (t) => { g.material.opacity = opF(t); }; } }); }
    else mkVC(sys, cl, 1);
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
  // LOOK-LOCK pending-end clouds
  // ---------------- musket smoke: fx.smokeLine with the GM settings (SMOKE_GM) per firing line
  if ((C.smoke || []).length) {
    const sys = mkFX({ seed: 1781, fxScale: C.smokeScale ?? 1, wind: C.smokeWind || [4, -1.5] });
    const SMOKE_GM = { cluster: [1.0, 1.0], fadeAfter: 6, fadeTo: 0.12, look: "gmTall" };
    for (const e of C.smoke) sys.fx.smokeLine(e.pts.map((p) => [p[0], e.h ?? 0.06, p[1]]), e.t0, e.t1, { ...SMOKE_GM, flash: false, ...(e.opts || {}) });
  }
  // ---------------- r9: black-powder volley smoke + flintlock flashes (NOTES "musket smoke + flash spec" r9)
  // Smoke = lit cauliflower puffs: 8 baked textures (a union of 5-7 round lobes, low-frequency noise only: period >= 30 px on screen, edges
  // softened over ~8 px), colour baked from the lobes' height field with light from the screen top: sunlit rims ~(240,236,226), undersides
  // ~(130,135,145). A shot = 5 small jet puffs thrown 60-80 px forward in 0.15 s (alpha 0.85, whiter than the bank, for 0.3 s; clamped >= 10 px
  // short of any red box) + 6-10 puffs (r 25-37 px) that grow to ~1.1x, rise <= 12 px and drift north ~4 px/s (+ a little east), fading out by
  // ~11 s. Composite with an alpha cap (0.6); unit boxes, name tags and banners (read from the DOM every frame) are cut out: drawn above the smoke.
  // Flashes on a 2D canvas above the smoke: an 8 px white core AT the muzzle + a ragged yellow-orange tongue (35 x 10 px with 2-3 side lobes),
  // both x0.7, frame 1 100 % / frame 2 50 %; a pan spark 2 frames early; an additive glow (r 40 px, 30 %); 8 spark streaks over 0.2 s.
  // All sizes are 1080p screen px; K = world px per screen px at the scene's camera scale.
  // LOOK-LOCK pending-begin smoke3d
  // r19 (owner 2026-11-28: "the gun smoke exactly like the 3D film: COPY it, don't re-create it"): the 3D films' own engine smoke, verbatim.
  // Source: vicksburg/engine/fx.js (= gm3d/clip/fx.js + the v8 per-shot muzzle flashes), copied into gl/fx.js by build_scene.py:
  //   musket = fx.smokeLine + SMOKE_GM (gmTall curtains, vicksburg/engine/scene.js) + the gm3d clip v8 volley options (gm3d/clip/index.html 209-212)
  //            + the v8 muzzle flashes (scene.js MZF.musket = {}); cannon = fx.cannon + GUN_PRESET.field + MZF.cannon (flashHold 0.4, flashCore 0.7,
  //            nightPool 7); impact = fx.impact { size: 0.9 } (scene.js / clip index.html 214).
  // The engine runs in the film's own units (the clip's close region: unitsPerMeter 1 / 129.36, fxScale 9, wind [20, -7], the clip's sun, seed 1517).
  // The only change is scale + placement: our map px / Z -> film units, and a copy of our camera with its position / Z (same projection), so one
  // film unit covers Z map px. Z = PPU x K: PPU = film px per unit on screen (~60 at the clip's battle camera: fov 30, dist 30-36) unless
  // --var smoke3dppu=N; K = our map px per screen px (BW.smoke content). Fired from our logged shots: every ripple of BWGL_CFG.vshots (shots
  // < 0.9 s apart) = one smokeLine from its first muzzle to the farthest one (the engine fires the shot at pts[0] exactly on t0, the rest
  // ripple over `roll` = our ripple's span); every BWGL_CFG.vcannon = fx.cannon at the muzzle + fx.impact at its target / impact time.
  // Opt-in: build_scene.py --smoke3d (GD.var.smoke3d); without it nothing here runs and the locked r15 smoke is untouched.
  const GV3 = (typeof GD !== "undefined" && GD.var) || {}, S3V = GV3.smoke3d || C.smoke3d;
  let S3D = null;
  // r21 (owner: every shot aims at its target): shots logged without an explicit aim (the default aim = muzzle + (10, 0)) are re-aimed at
  // window.BW_AIM (borrow.js pending autoaim: the declared target / the nearest enemy box at the shot time), before anything reads them
  if ((S3V || GV3.autoaim) && window.BW_AIM) for (const q of (C.vshots || [])) if (q[3] === q[1] + 10 && q[4] === q[2]) { const p = window.BW_AIM(q[0], q[1], q[2]); if (p) { q[3] = p[0]; q[4] = p[1]; } }
  if (S3V && ((C.vshots || []).length || (C.vcannon || []).length)) {
    // r20 (owner + critic A on r19: "why did you push the smoke of the gun to the house?"): the engine's smoke code, its source / direction /
    // scale fixed for black powder: everything stays at the guns. Engine calls only (fx.smokeLine / fx.cannon / fx.flash), options changed.
    //   muskets: per muzzle (each logged shot) a jet smokeLine (4 puffs thrown ~60-90 px along the aim, life ~1 s) + a haze smokeLine (3 puffs
    //            ~20 px in front of the line, life ~4.2 s -> gone by ~5 s) + the v8 flash core / halo (fx.flash); two engine worlds composited
    //            like r15: jets cap 0.8, haze cap 0.40 with the soft knee (0.6 x cap), unit boxes / tags / banners cut out (drawn above the smoke)
    //   cannon:  fx.cannon (jet x0.5 = ~33-66 px toward the target: the fort ring is ~126 px from the muzzle), in its own world whose wind blows from the target through the gun (the
    //            cloud drifts AWAY from the fort, 20 m/s x windK 0.6 (~6 px/s up-right of the gun box) + the puffs' rise = ~8 px/s), size 1.2 (cloud radius ~80-90 px), life 9 s; the impact = a short dark dust smokeLine
    //            (alpha 0.45, life ~1.2 s, <= 60 px) + the engine's orange impact flash, at the target + smoke3dimpoff (open ground)
    //   scale:   PPU 60 (the film's screen size) for both, --var smoke3dppu / smoke3dcanppu; Z = PPU x K map px per film unit.
    const V3 = C.volley || {}, KK = V3.K || 1, Z = (+GV3.smoke3dppu || 60) * KK, Zc = (+GV3.smoke3dcanppu || +GV3.smoke3dppu || 60) * KK, UF = 1 / 129.36;
    const HIDE = !!GV3.smoke3dhide;   // measurement: the same scene with no gun smoke drawn (references for the contrast / visibility numbers)
    const mk3 = (Zs, seed, wind) => { const cam = new THREE.PerspectiveCamera(), sc = new THREE.Scene(), fx = createFX({ scene: sc, camera: cam, renderer, unitsPerMeter: UF, fxScale: 9, wind, sunDir: [-0.7, 0.48, -0.4], duration: D, seed });
      return { Zs, fx, sc, cam, W: (x, z, h) => [x / Zs, h, z / Zs], prep() { cam.copy(camera); cam.position.divideScalar(Zs); cam.near = camera.near / Zs; cam.far = camera.far / Zs; cam.updateProjectionMatrix(); cam.updateMatrixWorld(true); } }; };
    const MJ = mk3(Z, 1517, [20, -7]), MH = mk3(Z, 1519, [20, -7]), MF = mk3(Z, 1520, [20, -7]);   // MF: the flashes, drawn straight to the canvas (r15 drew them on their own layer: never capped, never cut out)
    const CN3 = C.vcannon || [], g0 = CN3[0], wdir = g0 ? (() => { const dx = g0[1] - g0[6], dz = g0[2] - g0[7], l = Math.hypot(dx, dz) || 1; return [30 * dx / l, 30 * dz / l]; })() : [20, -7];   // r21: 30 m/s (the cloud stretches downwind, away from the fort)
    const CW = mk3(Zc, 1518, wdir);
    const IO = String(GV3.smoke3dimpoff || "0,0").split(",").map(Number);
    // per-muzzle emitter: a 1 map-px line at the muzzle; rate set so the engine spawns exactly n puffs in [t, t + dt]
    const emit = (w, x, z, ax, az, t, n, dt, o) => { const l = Math.hypot(ax - x, az - z) || 1, ux = (ax - x) / l, uz = (az - z) / l, Lu = 1 / w.Zs;
      w.fx.smokeLine([w.W(x, z, 0.06), w.W(x - uz, z + ux, 0.06)], t, t + dt, { dir: [ux, uz], rate: n / ((Lu / (100 * UF)) * dt), flash: false, ...o }); };
    const MUZ = (px, Zs) => px / (Zs / KK) * 1.3 / UF;   // muzzle speed (m/s) that throws a puff ~px screen px (drag k 1.3: distance = v / k)
    for (const [ts, x, z, ax, az] of (C.vshots || [])) {
      emit(MH, x, z, ax, az, ts + 0.05, 3, 0.2, { look: "gm", size: 0.95, alpha: 0.30, life: 4.2, muzzle: MUZ(20, Z), height: 1.6, windK: 0.6 });
    }   // r21: the jets and flashes are r15's again (its burst pass + flash layer, on the logged frames)
    for (const [ts, x, z, ax, az, ti, tx, tz] of CN3) { const l = Math.hypot(ax - x, az - z) || 1;
      const CS = +GV3.smoke3dcansize || 2.1, CL = GV3.smoke3dcanlook || "billow";   // r21: the lit billow look (white tops, shaded undersides), size 2.1: ~100-190 px, centred <= 41 px from the gun (--var to try others); the engine's own flash off (flash 0): r15's fireball is drawn
      const CA = +GV3.smoke3dcanalpha || 0.42, CT = +GV3.smoke3dcantint || 0.70;   // r21 (coordinator: r15's grey-white, see-through-edged cloud, not a white ball): grey tint, lower puff alpha, more drift
      CW.fx.cannon(CW.W(x, z, 0.05), ts, { size: CS, look: CL, jet: 0.5 / CS, flash: 0, alpha: CA, tint: [CT, CT, CT + 0.02], windK: 1.0, dir: [(ax - x) / l, (az - z) / l] });
      if (ti >= 0) { const ix = tx + IO[0], iz = tz + IO[1];
        emit(CW, ix, iz, ix + (ax - x) / l, iz + (az - z) / l, ts + ti, 6, 0.06, { look: "gm", tint: [0.25, 0.22, 0.18], size: 0.45, alpha: 0.45, life: 1.2, muzzle: MUZ(10, Zc), height: 0.3, windK: 0.2 });
        CW.fx.flash(CW.W(ix, iz, 0.03), ts + ti, { size: 0.35, life: 0.08, color: [1.2, 0.55, 0.16], alpha: 0.8 }); } }
    [MJ, MH, MF, CW].forEach((w) => w.fx.setNight(V3.night ? 1 : 0));
    // the r15 composite (copied: alpha cap + soft knee + box / tag / banner cut-outs) for the musket worlds
    const RT3 = new THREE.WebGLRenderTarget(1280, 720, { type: THREE.HalfFloatType, depthBuffer: false }), NR = 24, rc3 = Array.from({ length: NR }, () => new THREE.Vector4(-1, -1, -1, -1)), rm3 = new Float32Array(NR);
    const cmp3 = new THREE.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor, uniforms: { uT: { value: RT3.texture }, uRc: { value: rc3 }, uRm: { value: rm3 }, uCap: { value: 0.4 }, uKn: { value: 0.6 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
      fragmentShader: `uniform sampler2D uT; uniform vec4 uRc[${NR}]; uniform float uRm[${NR}]; uniform float uCap; uniform float uKn; varying vec2 vUv;
        void main(){ vec4 c = texture2D(uT, vUv); if (c.a < 0.002) discard; vec2 p = vec2(vUv.x * 1920.0, (1.0 - vUv.y) * 1080.0); float m = uCap;
          for (int i = 0; i < ${NR}; i++) { vec4 r = uRc[i]; if (r.z < 0.0) continue; vec2 dd = max(r.xy - p, p - r.zw); float e = max(dd.x, dd.y); m = min(m, mix(uRm[i], uCap, smoothstep(0.0, 1.5, e))); }
          float a = min(c.a, m); if (uKn > 0.0) { float k = uKn * m; a = c.a < k ? c.a : m - (m - k) * exp(-(c.a - k) / max(m - k, 1e-4)); }
          vec3 col = c.rgb / max(c.a, 1e-4); col = mix(col * 12.92, 1.055 * pow(max(col, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), col));   // the engine renders linear into a target: to display sRGB (as the canvas pass does)
          gl_FragColor = vec4(col * a, a); }` });
    const cq3 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), cmp3); cq3.frustumCulled = false; const cS3 = new THREE.Scene(); cS3.add(cq3); const oC3 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const rects3 = () => { const out = [], add = (el, m) => { if (!el || out.length >= NR) return; if (getComputedStyle(el).visibility === "hidden") return; const r = el.getBoundingClientRect();
        if (r.width < 2 || r.right < 0 || r.left > 1920 || r.bottom < 0 || r.top > 1080) return; out.push([r.left, r.top, r.right, r.bottom, m]); };
      document.querySelectorAll("#pins .unit").forEach((u) => { let op = 1; for (let e = u; e && e.id !== "pins"; e = e.parentElement) op *= +getComputedStyle(e).opacity; if (op < 0.05) return;
        const cut = 0.4 * (1 - op); add(u.querySelector(".blk"), cut); add(u.querySelector(".tag"), cut); });
      document.querySelectorAll(".bn-cloth, .bn-name").forEach((e) => add(e, 0)); return out; };
    const capped = (w, t, cap, knee) => { w.prep(); w.fx.update(t, w.cam); const prev = renderer.getRenderTarget(); renderer.setRenderTarget(RT3); renderer.setClearColor(0, 0); renderer.clear(true, false, false);
      renderer.render(w.sc, w.cam); renderer.setRenderTarget(prev); const ur = rects3(); for (let i = 0; i < NR; i++) { const r = ur[i]; if (r) { rc3[i].set(r[0], r[1], r[2], r[3]); rm3[i] = r[4] * cap / 0.4; } else rc3[i].set(-1, -1, -1, -1); }
      cmp3.uniforms.uCap.value = cap; cmp3.uniforms.uKn.value = knee; renderer.render(cS3, oC3); };
    let DBG = null;   // --var smoke3ddebug=1: an arrow from each muzzle along its aim for 0.6 s after the shot (a checking copy, never a film)
    if (GV3.smoke3ddebug) { DBG = document.createElement("canvas"); DBG.width = 1920; DBG.height = 1080; DBG.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;z-index:99"; SCN.appendChild(DBG); }
    const prj = (x, z) => { const v = new THREE.Vector3(x, 0, z).project(camera); return [(v.x + 1) / 2 * 1920, (1 - v.y) / 2 * 1080]; };
    S3D = { Z, Zc, draw(t) { if (HIDE) return; capped(MH, t, 0.4, 0.6); capped(CW, t, 0.75, 0.6);
      if (DBG) { const g = DBG.getContext("2d"); g.clearRect(0, 0, 1920, 1080); g.strokeStyle = "#ff00ff"; g.fillStyle = "#ff00ff"; g.lineWidth = 2;
        for (const [ts, x, z, ax, az] of (C.vshots || [])) { if (t < ts - 0.05 || t > ts + 0.6) continue; const [mx, my] = prj(x, z), [tx, ty] = prj(ax, az), l = Math.hypot(tx - mx, ty - my) || 1, ux = (tx - mx) / l, uy = (ty - my) / l, e = [mx + ux * 45, my + uy * 45];
          g.beginPath(); g.moveTo(mx, my); g.lineTo(e[0], e[1]); g.stroke(); g.beginPath(); g.moveTo(e[0], e[1]); g.lineTo(e[0] - ux * 9 - uy * 5, e[1] - uy * 9 + ux * 5); g.lineTo(e[0] - ux * 9 + uy * 5, e[1] - uy * 9 - ux * 5); g.fill(); } } } };   // r21: the gun cloud peak alpha 0.75 with the soft knee (see-through edges)   // r20: the gun's cloud too goes through the cut-out composite (the gun box stays above its smoke)
    window.__S3D = { Z, Zc, wind: wdir, shots: (C.vshots || []).length, cannon: CN3.length };
  }
  // LOOK-LOCK pending-end smoke3d
  let SMOKE = null;
  if ((C.vshots || []).length || (C.vcannon || []).length) {
    const V = C.volley || {}, K = V.K || 1, SH = (C.vshots || []).slice().sort((a, b) => a[0] - b[0]), CN = (C.vcannon || []).slice().sort((a, b) => a[0] - b[0]);
    const mb = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let q = Math.imul(a ^ (a >>> 15), 1 | a); q = (q + Math.imul(q ^ (q >>> 7), 61 | q)) ^ q; return ((q ^ (q >>> 14)) >>> 0) / 4294967296; };
    // --- 8 cauliflower textures (128 px cells in a 512 x 256 atlas): RGB = lit colour, A = density
    const CS = 128, AW = CS * 4, AH = CS * 2, atl = new Uint8Array(AW * AH * 4);
    const RIM = [240, 236, 226], MID = [204, 204, 205], UND = [116, 121, 131], Ld = (() => { const l = Math.hypot(-0.35, 0.8, 0.55); return [-0.35 / l, 0.8 / l, 0.55 / l]; })();
    for (let c = 0; c < 8; c++) { const R = mb(977 + c * 131), G = 8, g = new Float32Array(G * G); for (let i = 0; i < g.length; i++) g[i] = R();
      const vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), at = (a, b) => g[(((b % G) + G) % G) * G + (((a % G) + G) % G)];
        return lerp(lerp(at(xi, yi), at(xi + 1, yi), u), lerp(at(xi, yi + 1), at(xi + 1, yi + 1), u), v); };
      // lobes (cell units, centre 0, y up): a main body + 4-6 lobes round the top and sides, a flatter base
      const L = [[0, -0.03, 0.27 + 0.03 * R()]], nl = 4 + Math.floor(R() * 3);
      for (let k = 0; k < nl; k++) { const a = lerp(-0.25, Math.PI + 0.25, (k + 0.2 + 0.6 * R()) / nl), d = 0.15 + 0.08 * R(); L.push([Math.cos(a) * d * 1.15, Math.sin(a) * d * 0.9 + 0.02, 0.15 + 0.07 * R()]); }
      const ox = R() * 8, oy = R() * 8, H = new Float32Array(CS * CS), SD = new Float32Array(CS * CS);
      for (let y = 0; y < CS; y++) for (let x = 0; x < CS; x++) { const u = (x + 0.5) / CS - 0.5, v = 0.5 - (y + 0.5) / CS;
        const w = (vn(u * 2 + ox, v * 2 + oy) - 0.5) * 0.05;                            // low-frequency wobble of the outline (period = half the sprite)
        let h = 0, sd = -1; for (const [lx, ly, lr] of L) { const d = Math.hypot(u - lx, v - ly), r = lr + w; sd = Math.max(sd, r - d); if (d < r) h = Math.max(h, Math.sqrt(r * r - d * d)); }
        H[y * CS + x] = h; SD[y * CS + x] = sd; }
      for (let y = 0; y < CS; y++) for (let x = 0; x < CS; x++) { const i = y * CS + x, v = 0.5 - (y + 0.5) / CS, u = (x + 0.5) / CS - 0.5;
        const hx = (H[y * CS + Math.min(CS - 1, x + 2)] - H[y * CS + Math.max(0, x - 2)]) * CS / 4, hy = (H[Math.max(0, y - 2) * CS + x] - H[Math.min(CS - 1, y + 2) * CS + x]) * CS / 4;
        let nx = -hx, ny = -hy, nz = 1; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
        const lam = nx * Ld[0] + ny * Ld[1] + nz * Ld[2], glob = clamp(0.5 + 1.4 * v);       // per-lobe form light + the whole puff darker underneath
        const n2 = vn(u * 2.2 + oy + 3, v * 2.2 + ox + 5);                                       // low-frequency tone variation (period >= 30 px)
        const s = clamp(0.6 * clamp((lam + 0.1) / 0.95) + 0.4 * clamp(0.5 + 1.8 * v) + (n2 - 0.5) * 0.1);
        const col = s < 0.5 ? MID.map((m, k) => lerp(UND[k], m, s * 2)) : MID.map((m, k) => lerp(m, RIM[k], clamp((s - 0.5) / 0.32)));
        const dens = sstep(0, 0.075, SD[i]) * (0.86 + 0.14 * n2) * (0.3 + 0.7 * sstep(-0.34, -0.04, v));   // edge softened ~8 px; r10: the lower part feathered (bank bottom ~20 px)
        const o = (((c >> 2) * CS + y) * AW + (c & 3) * CS + x) * 4; atl[o] = col[0]; atl[o + 1] = col[1]; atl[o + 2] = col[2]; atl[o + 3] = Math.round(dens * 255); } }
    const ATL = new THREE.DataTexture(atl, AW, AH, THREE.RGBAFormat); ATL.magFilter = THREE.LinearFilter; ATL.minFilter = THREE.LinearMipmapLinearFilter; ATL.generateMipmaps = true; ATL.flipY = false; ATL.needsUpdate = true;
    // --- particles (precomputed, pure functions of t); offsets in screen px
    const W0 = (V.wind || [3, -4]), PL = [], RV = V.rise ?? 10, GONE = V.gone ?? 1e9;
    SH.forEach(([ts, x, z, ax, az], i) => { const R = mb(i * 7919 + 101); let dx = ax - x, dz = az - z; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
      const J = V.jet || [60, 80], Lj = J[0] + R() * (J[1] - J[0]);
      if (V.burstLen) { const BL = V.burstLen[0] + R() * (V.burstLen[1] - V.burstLen[0]);   // r13c (critic A): the muzzle burst 160-200 x 35-45 px on screen
        for (let j = 0; j < 4; j++) { const u = j / 3; PL.push({ i, t: ts, x, z, dx, dz, jet: 1, s: BL * (0.1 + 0.9 * u), lat: (R() - 0.5) * 10 * u, sz: (15 + 10 * R()) * (0.8 + 0.4 * u) / 0.42, a0: 0.85, life: 1.0, h: R(), cell: Math.floor(R() * 8) }); } }   // r14: one jet per musket, 60-90 px, lumps r 15-25 px
      else for (let j = 0; j < 5; j++) { const u = j / 4; PL.push({ i, t: ts, x, z, dx, dz, jet: 1, s: Lj * (0.12 + 0.88 * u), lat: (R() - 0.5) * 4 * u, sz: (11 + 15 * u) * (0.9 + 0.2 * R()), a0: 0.85 * (1 - 0.25 * u), life: 1.0, h: R(), cell: Math.floor(R() * 8) }); }
      const nB = V.billows ?? (6 + Math.floor(R() * 3));
      // r10: density varies +-40 % along the line (smooth in x), puffs spread over ~20 px across the line, and ~1 shot in 4 adds a big
      // cauliflower lump (r 25-40 px) on the bank's top edge -> a 55-70 px bank with 3-5 lumps on top
      const dm = 1 + 0.4 * Math.sin(x * 0.085 + 1.3) * (0.7 + 0.3 * Math.sin(x * 0.21));
      for (let b = 0; b < nB; b++) { const u = (b + R()) / nB; PL.push({ i, t: ts + 0.03 + 0.22 * R(), x, z, dx, dz, jet: 0, s: Lj * lerp((V.puffSpread || [0.15])[0], (V.puffSpread || [0, 0.85])[1], u), lat: (R() - 0.5) * 20, up: (V.front ? -V.front : 0) + 4 + 8 * R(), sz: ((V.puffR || [26])[0] + ((V.puffR || [0, 35])[1] - (V.puffR || [26])[0]) * R()) / 0.42,   /* r14: V.puffSpread / V.puffR (grouped bursts keep their gaps) */
        a0: (V.a0 ?? 0.55) * (1 + 0.18 * R()) * dm, life: (V.life ?? 10) * (0.85 + 0.15 * R()), h: R(), cell: Math.floor(R() * 8) }); }
      if (R() < (V.lumps ?? 0.24)) PL.push({ i, t: ts + 0.12 + 0.2 * R(), x, z, dx, dz, jet: 0, s: Lj * (0.35 + 0.3 * R()), lat: 0, up: (V.front ? -V.front : 0) + 12 + 30 * R(), sz: (25 + 15 * R()) / 0.42,
        a0: (V.a0 ?? 0.55) * Math.min(1.25, dm), life: (V.life ?? 10) * (0.85 + 0.15 * R()), h: R(), cell: Math.floor(R() * 8) }); });
    // r9 cannon (owner r9): per shot a heavy muzzle cloud, a smoke burst thrown 150-250 px forward, a quick smoke ring, a ground dust ring at the
    // muzzle, and at the target (round shot) a dirt burst + lingering smoke. Darker grey than musket smoke (w = darkness, >= 2 = dust tint),
    // low (rise <= 8 px), slow (V.cwind), lingering 12-19 s. Generic particles: e = thrown offset (screen px) reached with an ease-out over eT.
    const CW_ = V.cwind || [5, -2];
    CN.forEach(([ts, x, z, ax, az, ti, tx, tz], i) => { const R = mb(i * 4421 + 77); let dx = ax - x, dz = az - z; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l; const nx = -dz, nz = dx;
      const G = (o) => PL.push(Object.assign({ i: -1, g: 1, t: ts + 2 / 30, x, z, h: R(), cell: Math.floor(R() * 8), eT: 0.5, g0: 0.4, gT: 0.6, gr: 0.015, ain: 0.04, rise: 6, wind: CW_, white: 0, fo: 4 }, o));
      // r11: a dense jet 180-220 x 70-90 px reached in 0.3 s (alpha ~0.9, big from the start), which then billows into a 140-180 px cloud,
      // tops (235,232,225) / undersides (105,108,115), drifting ~6 px/s, lingering 12-15 s; the dust is a flat ground ring (2D, below)
      for (let k = 0; k < 16; k++) { const u = (k + R()) / 16, f = (170 + 30 * R()) * u, q = (R() - 0.5) * 50 * (0.5 + 0.5 * u);
        G({ ex: dx * f + nx * q, ez: dz * f + nz * q, eT: 0.3, sz: (30 + 20 * R()) / 0.42, g0: 0.75, gT: 1.6, gr: 0.03, a0: 0.9, ain: 0.02, tau: 11, life: V.clife ? V.clife * (0.85 + 0.15 * R()) : 12 + 3 * R(), fo: V.clife ? 3 : 3.5, w: 1, white: 0.04 }); }
      // r12: the jet ends (within 0.4 s) in a heavy head 160-200 px across: 7 big lumps r 40-55 px round the jet's end
      for (let k = 0; k < 7; k++) { const a = (k / 7) * 6.283 + R() * 0.5, rr = 35 + 30 * R(), f = 190 + 25 * R() + Math.cos(a) * rr * 0.6, q = Math.sin(a) * rr;
        G({ t: ts + 2 / 30 + 0.05, ex: dx * f + nx * q, ez: dz * f + nz * q, eT: 0.38, sz: (40 + 15 * R()) / 0.42, g0: 0.6, gT: 1.4, gr: 0.03, a0: 0.9, ain: 0.04, tau: 11, life: V.clife ? V.clife * (0.85 + 0.15 * R()) : 12 + 3 * R(), fo: V.clife ? 3 : 3.5, w: 1, white: 0.03 }); }
      for (let k = 0; k < 6; k++) { const f = 10 + 40 * R(), q = (R() - 0.5) * 30; G({ ex: dx * f + nx * q, ez: dz * f + nz * q, eT: 0.3, sz: (38 + 12 * R()) / 0.42, g0: 0.6, gT: 1.2, gr: 0.02, a0: 0.9, ain: 0.02, tau: 11, life: V.clife ? V.clife * (0.85 + 0.15 * R()) : 12 + 3 * R(), fo: V.clife ? 3 : 3.5, w: 1, white: 0.03 }); }
      if (ti >= 0) { const T1 = ts + ti;
        for (let k = 0; k < 7; k++) { const a = R() * 6.283, f = 10 + 18 * R(); G({ t: T1, x: tx, z: tz, ex: Math.cos(a) * f, ez: Math.sin(a) * f * 0.7 - 6 * R(), eT: 0.3, sz: (12 + 10 * R()) / 0.42, g0: 0.4, gT: 0.4, a0: 0.75, tau: 1.2, life: 3, fo: 1.5, rise: 4, w: 2 }); }
        for (let k = 0; k < 5; k++) { const a = R() * 6.283, f = 6 + 10 * R(); G({ t: T1 + 0.08, x: tx, z: tz, ex: Math.cos(a) * f, ez: Math.sin(a) * f * 0.7, eT: 0.6, sz: (20 + 12 * R()) / 0.42, g0: 0.35, gT: 1.0, a0: 0.55, tau: 6, life: V.clife ? V.clife * 0.8 : 10 + 4 * R(), rise: 10, w: 0.5, white: 0.1 }); } } });
    // r10 (owner: "like the film 3D"): the 3D films' own cannon plume (vicksburg/engine/fx.js fx.cannon, the field-gun preset as in ajackson/
    // washington) at the Fort Motte gun, scaled to the 2D map (jet/size x V.c3), its flash off (the 2D fireball above owns frames 1-2)
    if (CN.length) { const sys3 = mkFX({ seed: 1866, wind: V.c3wind || [5, -2] }), K3 = V.c3 ?? 3;
      CN.forEach(([ts, x, z, ax, az]) => { const l = Math.hypot(ax - x, az - z) || 1;
        sys3.fx.cannon([x, 0.06, z], ts + 2 / 30, { dir: [(ax - x) / l, (az - z) / l], size: K3, jet: K3, plume: 1.1, puffs: 12, dust: 0, life: V.clife ? V.clife * 0.75 : 13, flash: 0, flashCore: 0, nightPool: 0, alpha: 0.25, tint: [0.2, 0.205, 0.22] }); }); }
    // r10: a dark smoke column (burning roof): [x, z, t0, t1, {rise, wind, r}] -> a soot puff every 0.16 s, 16 -> ~50 px, rising up-screen
    (C.vcolumn || []).forEach(([x, z, t0, t1, o = {}], j) => { const R = mb(9001 + j * 17); for (let t = t0; t < t1; t += 0.16) {
      PL.push({ i: -1, g: 1, t, x, z, h: R(), cell: Math.floor(R() * 8), ex: (R() - 0.5) * 8, ez: -6, eT: 0.6, g0: 0.35, gT: 3.0, gr: 0.03, ain: 0.3, rise: o.rise ?? 70,
        wind: o.wind || [10, -4], white: 0, fo: 2.5, sz: (o.r ?? 26) * (0.8 + 0.4 * R()) / 0.42, a0: 0.5 + 0.15 * R(), tau: 3.5, life: 6 + R(), w: 1.2 }); } });
    // LOOK-LOCK pending-begin smoke3d
    // r21 (critics on r20: placement right, punch lost): with --smoke3d r15's own effects stay where the engine has no better one: its flash layer
    // (musket tongues, the cannon fireball, the muzzle dust ring, on the logged frames) and its white jet bursts (cap 0.8, grey by 0.9 s); its
    // musket haze and its cannon cloud are taken out (the engine haze / cannon cloud of the smoke3d block replace them); the roof soot stays
    if (S3D) for (let k = PL.length - 1; k >= 0; k--) { const p = PL[k]; if (p.g ? p.w !== 1.2 : !p.jet) PL.splice(k, 1); }
    // LOOK-LOCK pending-end smoke3d
    PL.sort((a, b) => a.t - b.t || (a.jet || 0) - (b.jet || 0));
    const N = PL.length, geo = new THREE.InstancedBufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0], 3)); geo.setIndex([0, 1, 2, 0, 2, 3]);
    const iP = new THREE.InstancedBufferAttribute(new Float32Array(N * 4), 4), iQ = new THREE.InstancedBufferAttribute(new Float32Array(N * 4), 4);   // xyz size | alpha cell white -
    iP.setUsage(THREE.DynamicDrawUsage); iQ.setUsage(THREE.DynamicDrawUsage); geo.setAttribute("iP", iP); geo.setAttribute("iQ", iQ); geo.instanceCount = 0;
    const NT = V.night ? [0.42, 0.47, 0.58] : [1, 1, 1];
    const mat = new THREE.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
      uniforms: { uA: { value: ATL }, uR: { value: new THREE.Vector3() }, uU: { value: new THREE.Vector3() }, uNT: { value: new THREE.Vector3(...NT) }, uFl: { value: 0 }, uHz: { value: V.haze ? 1 : 0 }, uSq: { value: V.squash ?? 0.82 },
        uRot: { value: (V.cardRot || 0) / 57.2958 }, uK: { value: K }, uFeP: { value: V.cardFeather || 0 }, uBW: { value: new THREE.Vector3(...(V.burstWhite || [240, 238, 232]).map((c) => c / 255)) },   // r15 knobs (opt-in)
        uBG: { value: new THREE.Vector3(...(V.burstGrey || V.burstWhite || [240, 238, 232]).map((c) => c / 255)) }, uHG0: { value: new THREE.Vector3(...(V.hazeGrey || [[150, 149, 146]])[0].map((c) => c / 255)) },
        uHG1: { value: new THREE.Vector3(...(V.hazeGrey || [0, [205, 204, 200]])[1].map((c) => c / 255)) } },
      vertexShader: `attribute vec4 iP; attribute vec4 iQ; uniform vec3 uR; uniform vec3 uU; uniform float uSq; uniform float uRot; uniform float uK; uniform float uFeP; varying vec2 vUv; varying vec4 vQ; varying vec2 vL; varying float vFe;
        void main(){ float ci = floor(iQ.y + 1e-3), ang = uRot > 0.0 && fract(iQ.y + 1e-3) > 0.02 ? (fract(iQ.y + 1e-3) - 0.05) / 0.9 * 2.0 * uRot - uRot : 0.0; vec2 pr = mat2(cos(ang), sin(ang), -sin(ang), cos(ang)) * position.xy;   // r15: rotated card
          vec2 q = vec2(pr.x, pr.y * uSq); vec3 wp = iP.xyz + (uR * q.x + uU * q.y) * iP.w; vec2 cell = vec2(mod(ci, 4.0), floor(ci / 4.0));
          vUv = (cell + vec2(position.x + 0.5, 0.5 - position.y) * 0.98 + 0.01) / vec2(4.0, 2.0); vQ = iQ; vL = position.xy; vFe = uFeP > 0.0 ? clamp(uFeP * uK / max(iP.w, 1e-3), 0.0, 0.5) : 0.0;
          gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0); }`,
      fragmentShader: `uniform sampler2D uA; uniform vec3 uNT; uniform float uFl; uniform float uHz; uniform vec3 uBW; uniform vec3 uBG; uniform vec3 uHG0; uniform vec3 uHG1; varying vec2 vUv; varying vec4 vQ; varying vec2 vL; varying float vFe;
        void main(){ vec4 tx = texture2D(uA, vUv); float d = tx.a * vQ.x; if (vFe > 0.0) d *= 1.0 - smoothstep(0.5 - vFe, 0.5, length(vL)); if (d < 0.002) discard;   // r15: round card mask, feather uFeP px
          vec3 col = tx.rgb; float lum = dot(col, vec3(0.333));
          if (vQ.w > 1.5) col *= vec3(0.9, 0.74, 0.52);                                                   // ground dust
          else if (vQ.w > 1.05) col *= vec3(0.46, 0.45, 0.44) * (0.85 + 0.3 * lum);                    // soot (the burning roof's column)
          else col *= mix(1.0, 0.96, vQ.w) * mix(1.0, 0.72, vQ.w * clamp(1.4 * (1.0 - lum), 0.0, 1.0));   // r12 cannon smoke: tops ~(230,227,220), undersides ~(95,98,105)
          col *= 1.0 + uFl * clamp(1.15 - lum, 0.0, 1.0) * vec3(1.0, 0.9, 0.72);                         // r10: each flash lifts the bank's underside (+20 %, 2 frames)                                  // heavier, darker (cannon) smoke: undersides darken most
          if (uHz > 0.5 && vQ.w < 0.01) {   // r13: the musket haze colour (see-through, capped 0.40; the burst in its own pass)
            float tL = clamp((lum - 0.42) / 0.45, 0.0, 1.0), gy = clamp(-vQ.w, 0.0, 1.0);   // r13b (owner): white while dense, a soft warm grey as it thins
            col = mix(mix(vec3(0.667, 0.667, 0.659), uBW, tL), mix(uHG0, uHG1, tL), gy);   // r15: uniforms (defaults = r13c colours)   // r13c: ~25 levels of lump contrast after the 0.40 cap   // tops 232 -> ~200, undersides 190 -> ~160 (core ~185)
            col = mix(col, mix(uBW, uBG, clamp(vQ.z - 1.0, 0.0, 1.0)), min(vQ.z, 1.0)); }   // the muzzle burst ~(240,238,232); r15: z 1..2 -> uBG (grey)
          else col = mix(col, vec3(0.965, 0.955, 0.93), vQ.z * 0.75);
          col *= uNT; gl_FragColor = vec4(col * d, d); }` });
    const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false; const sScene = new THREE.Scene(); sScene.add(mesh);
    // r13b (critic A): the muzzle burst (jets) in its own pass with its own cap (V.burstCap), so the shot itself reads above the 0.40 haze
    const geo2 = new THREE.InstancedBufferGeometry(); geo2.setAttribute("position", geo.getAttribute("position")); geo2.setIndex(geo.getIndex());
    const iP2 = new THREE.InstancedBufferAttribute(new Float32Array(N * 4), 4), iQ2 = new THREE.InstancedBufferAttribute(new Float32Array(N * 4), 4);
    iP2.setUsage(THREE.DynamicDrawUsage); iQ2.setUsage(THREE.DynamicDrawUsage); geo2.setAttribute("iP", iP2); geo2.setAttribute("iQ", iQ2); geo2.instanceCount = 0;
    const mesh2 = new THREE.Mesh(geo2, mat); mesh2.frustumCulled = false; const sScene2 = new THREE.Scene(); sScene2.add(mesh2); const BC = V.burstCap;
    const RT = new THREE.WebGLRenderTarget(1280, 720, { type: THREE.HalfFloatType, depthBuffer: false });
    const MAXR = 24, rects = Array.from({ length: MAXR }, () => new THREE.Vector4(-1, -1, -1, -1)), rmax = new Float32Array(MAXR), rfe = new Float32Array(MAXR).fill(1.5);
    const comp = new THREE.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
      uniforms: { uT: { value: RT.texture }, uRc: { value: rects }, uRm: { value: rmax }, uRf: { value: rfe }, uCap: { value: V.cap ?? 0.6 }, uKn: { value: V.capKnee || 0 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
      fragmentShader: `uniform sampler2D uT; uniform vec4 uRc[${MAXR}]; uniform float uRm[${MAXR}]; uniform float uRf[${MAXR}]; uniform float uCap; uniform float uKn; varying vec2 vUv;
        void main(){ vec4 c = texture2D(uT, vUv); if (c.a < 0.002) discard; vec2 p = vec2(vUv.x * 1920.0, (1.0 - vUv.y) * 1080.0); float m = uCap;
          for (int i = 0; i < ${MAXR}; i++) { vec4 r = uRc[i]; if (r.z < 0.0) continue; vec2 dd = max(r.xy - p, p - r.zw); float e = max(dd.x, dd.y);
            m = min(m, mix(uRm[i], uCap, smoothstep(0.0, uRf[i], e))); }
          float a = min(c.a, m); if (uKn > 0.0) { float k = uKn * m; a = c.a < k ? c.a : m - (m - k) * exp(-(c.a - k) / max(m - k, 1e-4)); }   // r15: soft knee (no flat-topped, straight-edged slab)
          vec3 col = c.rgb / max(c.a, 1e-4); gl_FragColor = vec4(col * a, a); }` });   // colours are already display (sRGB) values
    const cq = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), comp); cq.frustumCulled = false; const cScene = new THREE.Scene(); cScene.add(cq); const oCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    // --- the flash canvases above the smoke (normal + screen-blended glow)
    const mkC = (blend) => { const c = document.createElement("canvas"); c.width = 1920; c.height = 1080; c.style.cssText = `position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;${blend ? "mix-blend-mode:screen;" : ""}`;
      SCN.insertBefore(c, WO); return c; };
    const FC = mkC(false), GC = mkC(true), fg = FC.getContext("2d"), gg = GC.getContext("2d");
    // r11: the cannon's ground dust = a flat ring on the ground (a canvas BELOW the smoke layer): 120-160 px across, alpha 0.35, (150,130,100), spreads in 0.4 s
    const GD = document.createElement("canvas"); GD.width = 1920; GD.height = 1080; GD.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none"; cv.parentNode.insertBefore(GD, cv); const gd = GD.getContext("2d");
    const proj = (x, z) => { const v = new THREE.Vector3(x, 0, z).project(camera); return [(v.x + 1) / 2 * 1920, (1 - v.y) / 2 * 1080]; };
    const unitRects = () => { const out = [], add = (el, m, red, pad = 2) => { if (!el || out.length >= MAXR) return; const cs = getComputedStyle(el); if (cs.visibility === "hidden") return;
        const r = el.getBoundingClientRect(); if (r.width < 2 || r.right < 0 || r.left > 1920 || r.bottom < 0 || r.top > 1080) return; out.push([r.left - pad, r.top - pad, r.right + pad, r.bottom + pad, m, red]); };
      document.querySelectorAll("#pins .unit").forEach((u) => { let op = 1; for (let e = u; e && e.id !== "pins"; e = e.parentElement) op *= +getComputedStyle(e).opacity; if (op < 0.05) return;
        const red = /rome|british/.test(u.className); const cut = (V.cap ?? 0.6) * (1 - op); add(u.querySelector(".blk"), cut, red, 0); add(u.querySelector(".tag"), cut, red, 0); });   // a fading box lets the smoke back in
      // r9: the boxes, name tags and banners are cut out of the smoke (1.5 px edge): they read as drawn ABOVE the smoke, never pink or veiled
      document.querySelectorAll(".bn-cloth, .bn-name").forEach((e) => add(e, 0, false, 0)); return out; };
    // the jet of one shot stops >= 10 px (+ its own puff radius) short of any red box: ray-march along the screen direction
    const jetLen = (mx, my, ux, uy, L, ur) => { for (let s = 4; s <= L; s += 2) { const px = mx + ux * s, py = my + uy * s, rr = 10 + 12;
        for (const r of ur) if (r[5] && px > r[0] - rr && px < r[2] + rr && py > r[1] - rr && py < r[3] + rr) return Math.max(0, s - 2); } return L; };
    SMOKE = {
      draw(t) {
        const e = camera.matrixWorld.elements; mat.uniforms.uR.value.set(e[0], e[1], e[2]).normalize(); mat.uniforms.uU.value.set(e[4], e[5], e[6]).normalize();
        const ur = unitRects(), JL = new Map(), gone = 1 - sstep(GONE - 0.8, GONE, t);
        let n = 0, n2 = 0; const P = iP.array, Q = iQ.array, P2 = iP2.array, Q2 = iQ2.array, Wx = W0[0], Wz = W0[1];
        for (const p of PL) { const age = t - p.t; if (age < 0) break; if (age > p.life) continue;
          if (p.g) { const eo = 1 - Math.pow(1 - Math.min(1, age / p.eT), 3), wk = Math.max(0, age - 0.4), sh = 0.8 + 0.4 * p.h, rise = p.rise * (1 - Math.exp(-age / 3));
            const sx = p.ex * eo + p.wind[0] * sh * wk, sz = p.ez * eo + p.wind[1] * sh * wk - rise;
            const size = p.sz * (p.g0 + (1 - p.g0) * (1 - Math.pow(1 - Math.min(1, age / p.gT), 2))) * (1 + p.gr * age);
            const A = p.a0 * Math.min(1, age / p.ain) * Math.exp(-age / p.tau) * (1 - sstep(p.life - p.fo, p.life, age)) * gone; if (A < 0.003) continue;
            P[n * 4] = p.x + sx * K; P[n * 4 + 1] = (2 + p.h * 4) * K; P[n * 4 + 2] = p.z + sz * K; P[n * 4 + 3] = size * K;
            Q[n * 4] = A; Q[n * 4 + 1] = p.cell; Q[n * 4 + 2] = p.white * (1 - sstep(0.1, 0.8, age)); Q[n * 4 + 3] = p.w; n++; continue; }
          let Lr = 1; if (p.jet && age < 1.0) { if (!JL.has(p.i)) { const [ts, x, z, ax, az] = SH[p.i], [mx, my] = proj(x, z), [tx, ty] = proj(ax, az), ll = Math.hypot(tx - mx, ty - my) || 1;
              JL.set(p.i, jetLen(mx, my, (tx - mx) / ll, (ty - my) / ll, V.burstLen ? 220 : 90, ur) / 80); } Lr = Math.min(1, JL.get(p.i) / Math.max(0.3, p.s / 80)); }
          const eo = 1 - Math.pow(1 - Math.min(1, age / 0.15), 3), s = p.s * Lr * (p.jet ? eo : lerp(0.35, 1, eo));
          const wk = Math.max(0, age - (p.jet && V.jetWindAt != null ? V.jetWindAt : (V.windAt ?? 0.3))), sh = (V.shear ? 1 - V.shear / 2 + V.shear * p.h : 0.8 + 0.4 * p.h), rise = RV * (1 - Math.exp(-age / 2.5));
          const hj = (k) => { const q = Math.sin(p.i * 12.9898 + p.cell * 78.233 + p.h * 437.585 + k) * 43758.5453; return q - Math.floor(q); };   // r15: per-card hash (no change to the R() stream)
          const jy = !p.jet && V.jitterY ? (hj(1) - 0.5) * 2 * V.jitterY : 0;   // r15 (critic A: a straight-edged haze slab): +-jitterY px vertical jitter per haze card
          const la = p.lat * (p.jet ? 1 : (V.latK ?? 1));   // r15: V.latK narrows each clump's haze (the group gaps hold)
          const sx = p.dx * s - p.dz * la + Wx * sh * wk, sz = p.dz * s + p.dx * la + Wz * sh * wk - rise - (p.up || 0) * Math.min(1, age / 0.6) + jy;
          const size = (p.jet ? 1 : 1 + (V.stretch ?? 0) * Math.max(0, age - 0.5)) * (p.jet ? p.sz * (1 + (V.jetGrow != null ? V.jetGrow - 1 : 0.35) * Math.min(1, age / 0.3)) : p.sz * (0.55 + 0.45 * (1 - Math.pow(1 - Math.min(1, age / 0.8), 2))) * (1 + 0.015 * age));   // r15: V.jetGrow caps a jet's sideways spread (1.3 = 1.3x its starting width)
          const rot = V.cardRot ? (hj(2) - 0.5) * 2 * V.cardRot / 57.2958 : 0, cellR = V.cardRot ? p.cell + 0.05 + 0.9 * (rot / (2 * V.cardRot / 57.2958) + 0.5) : p.cell;   // r15: the rotation rides in the cell's fraction
          const GA = V.greyAt, gq = GA ? sstep(GA[0], GA[1], age) : 0;   // r15: white -> grey from greyAt[0] to greyAt[1] s (jets and haze)
          const a = p.jet ? (BC ? 0.85 : p.a0) * (BC ? 1 - sstep(0.4, 1.0, age) : age < 0.3 ? 1 : 1 - sstep(0.3, 0.9, age)) * Math.min(1, age / 0.03)
                          : p.a0 * Math.min(1, age / 0.25) * Math.exp(-age / (V.tau ?? 2.5)) * (1 - sstep(p.life - (V.fade ?? 3.2), p.life, age));
          const A = a * gone; if (A < 0.003) continue;
          if (BC && p.jet) { const j = n2 * 4; P2[j] = p.x + sx * K; P2[j + 1] = (2 + p.h * 4) * K; P2[j + 2] = p.z + sz * K; P2[j + 3] = size * K; Q2[j] = A; Q2[j + 1] = cellR; Q2[j + 2] = 1 + gq; Q2[j + 3] = 0; n2++; continue; }   // r15: z in 1..2 = the burst white -> grey
          P[n * 4] = p.x + sx * K; P[n * 4 + 1] = (2 + p.h * 4) * K; P[n * 4 + 2] = p.z + sz * K; P[n * 4 + 3] = size * K;
          Q[n * 4] = A; Q[n * 4 + 1] = cellR; Q[n * 4 + 2] = p.jet ? 1 + gq : (BC ? 0.35 : 0.5) * (1 - sstep(0.1, 0.9, age)); Q[n * 4 + 3] = V.haze ? -(GA ? gq : sstep(0.8, 3.0, age)) : 0; n++; }
        geo.instanceCount = n; iP.needsUpdate = true; iQ.needsUpdate = true; geo2.instanceCount = n2; iP2.needsUpdate = true; iQ2.needsUpdate = true;
        { let c = 0; for (const q of SH) { const ag = t - q[0]; if (ag >= -1e-4 && ag < 2 / 30 - 1e-4) c++; } for (const q of CN) { const ag = t - q[0]; if (ag >= -1e-4 && ag < 2 / 30 - 1e-4) c += 3; }
          mat.uniforms.uFl.value = 0.2 * Math.min(1, c / 2); }
        const prev = renderer.getRenderTarget(); renderer.setRenderTarget(RT); renderer.setClearColor(0, 0); renderer.clear(true, false, false);
        if (n) renderer.render(sScene, camera);
        renderer.setRenderTarget(prev);
        for (const [bx, t0, t1, cap, fe, rp = 0.4] of (V.capBoxes || [])) { if (t < t0 || t > t1 || ur.length >= MAXR) continue; const k = sstep(t0, t0 + rp, t) * (1 - sstep(t1 - rp, t1, t)), cv = lerp(V.cap ?? 0.6, cap, k);   // r13: time-windowed soft caps (house front)
          const a = proj(bx[0], bx[1]), b = proj(bx[2], bx[3]); ur.push([Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1]), cv, false, fe ?? 30]); }
        for (let i = 0; i < MAXR; i++) { const r = ur[i]; if (r) { rects[i].set(r[0], r[1], r[2], r[3]); rmax[i] = r[4]; rfe[i] = r[6] ?? 1.5; } else rects[i].set(-1, -1, -1, -1); }
        if (n) renderer.render(cScene, oCam);
        if (n2) { renderer.setRenderTarget(RT); renderer.clear(true, false, false); renderer.render(sScene2, camera); renderer.setRenderTarget(prev);
          const c0 = comp.uniforms.uCap.value; comp.uniforms.uCap.value = BC; renderer.render(cScene, oCam); comp.uniforms.uCap.value = c0; }
        // flashes (x FS = 0.7)
        fg.clearRect(0, 0, 1920, 1080); gg.clearRect(0, 0, 1920, 1080);
        gd.clearRect(0, 0, 1920, 1080);
        for (let i = 0; i < CN.length; i++) { const [ts, x, z] = CN[i], age = t - ts; if (age < 0 || age > 2.0) continue; const [mx, my] = proj(x, z);
          const r = 18 + 60 * (1 - Math.pow(1 - Math.min(1, age / 0.4), 3)), A = 0.35 * Math.min(1, age / 0.05) * (1 - sstep(0.6, 2.0, age));
          gd.save(); gd.translate(mx, my); gd.scale(1, 0.8); const gr = gd.createRadialGradient(0, 0, 0, 0, 0, r);
          gr.addColorStop(0, "rgba(150,130,100,0)"); gr.addColorStop(0.5, `rgba(150,130,100,${(A * 0.35).toFixed(3)})`); gr.addColorStop(0.8, `rgba(150,130,100,${A.toFixed(3)})`); gr.addColorStop(1, "rgba(150,130,100,0)");
          gd.fillStyle = gr; gd.beginPath(); gd.arc(0, 0, r, 0, 7); gd.fill(); gd.restore(); } const F = 1 / 30, FS = V.flashScale ?? 1;
        for (let i = 0; i < SH.length; i++) { const [ts, x, z, ax, az] = SH[i], age = t - ts; if (age < -2.5 * F || age > 0.25) continue;
          const [mx, my] = proj(x, z), [tx, ty] = proj(ax, az), ang = Math.atan2(ty - my, tx - mx), R = mb(i * 31 + 7);
          if (age >= -2 * F - 1e-4 && age < -F - 1e-4) {   // priming pan: a small spark, 1 frame, 2 frames early, just behind the muzzle
            const px = mx - Math.cos(ang) * 6, py = my - Math.sin(ang) * 6, gr = fg.createRadialGradient(px, py, 0, px, py, 3.5);
            gr.addColorStop(0, "rgba(255,252,225,1)"); gr.addColorStop(0.5, "rgba(255,205,90,.85)"); gr.addColorStop(1, "rgba(255,140,30,0)"); fg.fillStyle = gr; fg.beginPath(); fg.arc(px, py, 3.5, 0, 7); fg.fill(); }
          if (age >= -1e-4 && age < 2 * F - 1e-4) {        // tongue + core: frame 1 100 %, frame 2 50 %
            const A = age < F - 1e-4 ? 1 : 0.5, Lt = 40 * (0.9 + 0.2 * R()), Wt = 12 * (0.9 + 0.2 * R());
            fg.save(); fg.translate(mx, my); fg.rotate(ang); fg.scale(FS, FS); fg.globalAlpha = A;
            const lg = fg.createLinearGradient(0, 0, Lt, 0); lg.addColorStop(0, "#FFFFF4"); lg.addColorStop(0.18, "#FFF0B0"); lg.addColorStop(0.45, "#FFC040"); lg.addColorStop(0.75, "#F07A18"); lg.addColorStop(1, "rgba(210,70,16,0)");
            fg.fillStyle = lg; fg.filter = "blur(0.6px)";
            // ragged outline: half-width w(u) widest near the muzzle, tapering with jitter (both sides independent)
            const NP = 9, up = [], dn = []; for (let k = 0; k <= NP; k++) { const u = k / NP, base = Wt * 0.5 * Math.pow(1 - u, 0.7) * (0.75 + 0.5 * Math.sin(Math.PI * Math.min(1, u * 2.2)));
              up.push([u * Lt, -base * (0.75 + 0.5 * R())]); dn.push([u * Lt, base * (0.75 + 0.5 * R())]); }
            fg.beginPath(); fg.moveTo(0, 0); for (const q of up) fg.lineTo(q[0], q[1]); for (let k = dn.length - 1; k >= 0; k--) fg.lineTo(dn[k][0], dn[k][1]); fg.closePath(); fg.fill();
            // 2-3 side lobes: short flame tongues splayed off the main one
            const nl = 2 + (R() < 0.5 ? 1 : 0); for (let k = 0; k < nl; k++) { const u0 = 0.18 + 0.4 * R(), sg = k % 2 ? 1 : -1, la = sg * (0.5 + 0.4 * R()), ll = Lt * (0.25 + 0.15 * R()), lw = Wt * 0.28;
              fg.save(); fg.translate(u0 * Lt * 0.6, sg * Wt * 0.15); fg.rotate(la); const g2 = fg.createLinearGradient(0, 0, ll, 0); g2.addColorStop(0, "#FFE590"); g2.addColorStop(0.6, "#FFA030"); g2.addColorStop(1, "rgba(230,90,20,0)");
              fg.fillStyle = g2; fg.beginPath(); fg.moveTo(0, -lw * 0.5); fg.quadraticCurveTo(ll * 0.5, -lw * 0.6, ll, 0); fg.quadraticCurveTo(ll * 0.5, lw * 0.6, 0, lw * 0.5); fg.closePath(); fg.fill(); fg.restore(); }
            fg.filter = "blur(0.5px)"; const cg = fg.createRadialGradient(0, 0, 0, 0, 0, 4); cg.addColorStop(0, "rgba(255,255,255,1)"); cg.addColorStop(0.7, "rgba(255,255,250,1)"); cg.addColorStop(1, "rgba(255,248,220,0)");
            fg.fillStyle = cg; fg.beginPath(); fg.arc(0, 0, 4, 0, 7); fg.fill();     // 8 px white core AT the muzzle
            fg.restore(); fg.filter = "none"; fg.globalAlpha = 1; }
          if (age >= -1e-4 && age < 3 * F - 1e-4) {        // additive glow centred at the muzzle: r 40 px, 30 %, lights the map and the smoke (screen blend)
            const A = [0.35, 0.2, 0.08][Math.min(2, Math.floor(age / F + 1e-3))], gx = mx + Math.cos(ang) * 8, gy = my + Math.sin(ang) * 8, gr = gg.createRadialGradient(gx, gy, 0, gx, gy, 50);
            gr.addColorStop(0, `rgba(255,200,110,${A})`); gr.addColorStop(0.45, `rgba(255,150,60,${A * 0.45})`); gr.addColorStop(1, "rgba(255,120,40,0)"); gg.fillStyle = gr; gg.fillRect(gx - 51, gy - 51, 102, 102); }   // r10: ground glow r 50 px, 35 %
          if (age >= 0 && age < 0.2) {                       // 8 motion-blurred spark streaks over 0.2 s
            for (let k = 0; k < 8; k++) { const a2 = ang + (R() - 0.5) * 0.9, sp = 140 + 160 * R(), d1 = sp * age + 8, d0 = Math.max(5, d1 - 9), al = 1 - age / 0.2;
              const x0 = mx + Math.cos(a2) * d0, y0 = my + Math.sin(a2) * d0, x1 = mx + Math.cos(a2) * d1, y1 = my + Math.sin(a2) * d1, lg = fg.createLinearGradient(x0, y0, x1, y1);
              lg.addColorStop(0, "rgba(255,170,60,0)"); lg.addColorStop(1, `rgba(255,236,170,${al.toFixed(3)})`); fg.strokeStyle = lg; fg.lineWidth = 1.1; fg.beginPath(); fg.moveTo(x0, y0); fg.lineTo(x1, y1); fg.stroke(); } }
        }
        // cannon flash: 2-3x a musket's: a 16 px white core + an orange fireball (3 overlapping ragged blobs thrown forward), 2 frames (100 %, 50 %);
        // a ground-lighting glow r 110 px for 3 frames (screen blend); 14 spark streaks over 0.25 s
        for (let i = 0; i < CN.length; i++) { const [ts, x, z, ax, az] = CN[i], age = t - ts; if (age < -1e-4 || age > 0.3) continue;
          const [mx, my] = proj(x, z), [tx, ty] = proj(ax, az), ang = Math.atan2(ty - my, tx - mx), R = mb(i * 53 + 11), ca = Math.cos(ang), sa = Math.sin(ang);
          if (age < 2 * F - 1e-4) { const A = age < F - 1e-4 ? 1 : 0.6; fg.save(); fg.globalAlpha = A; fg.filter = "none";   // r10: no canvas filter (frame 2 was dropped on the GPU renderer)
            // r11: ONE ragged cone 110 x 60 px from the muzzle (white -> yellow -> orange -> red edge), jittered outline both sides
            fg.translate(mx, my); fg.rotate(ang); const CL = 110 * (0.95 + 0.1 * R()), CW = 60 * (0.92 + 0.16 * R()), up = [], dn = [];
            const jag = () => (R() < 0.3 ? 1.25 + 0.4 * R() : 0.6 + 0.5 * R());   // r12: ragged, irregular (random tongues, no regular sawtooth)
            for (let k = 0; k <= 26; k++) { const u = k / 26, hw = (CW / 2) * Math.min(1, 0.32 + 1.5 * u) * Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, u - 0.55) / 0.45, 2)));
              up.push([u * CL + (R() - 0.5) * 8, -hw * jag()]); dn.push([u * CL + (R() - 0.5) * 8, hw * jag()]); }
            const lg = fg.createLinearGradient(0, 0, CL, 0); lg.addColorStop(0, "rgba(255,255,245,1)"); lg.addColorStop(0.18, "rgba(255,236,150,1)"); lg.addColorStop(0.45, "rgba(255,178,60,.95)"); lg.addColorStop(0.75, "rgba(236,100,26,.8)"); lg.addColorStop(1, "rgba(190,60,18,0)");
            fg.fillStyle = lg; fg.beginPath(); fg.moveTo(0, 0); for (const q of up) fg.lineTo(q[0], q[1]); for (let k = dn.length - 1; k >= 0; k--) fg.lineTo(dn[k][0], dn[k][1]); fg.closePath(); fg.fill();
            const ns = 4 + Math.floor(R() * 3); for (let k = 0; k < ns; k++) { const a2 = (R() - 0.5) * 1.3, r0 = 30 + 60 * R(), L2 = 20 + 10 * R(), x0 = Math.cos(a2) * r0, y0 = Math.sin(a2) * r0 * 1.4;   // r12: 4-6 spark streaks 20-30 px
              const sg = fg.createLinearGradient(x0, y0, x0 + Math.cos(a2) * L2, y0 + Math.sin(a2) * L2); sg.addColorStop(0, "rgba(255,200,90,0)"); sg.addColorStop(1, "rgba(255,246,200,1)");
              fg.strokeStyle = sg; fg.lineWidth = 1.8; fg.beginPath(); fg.moveTo(x0, y0); fg.lineTo(x0 + Math.cos(a2) * L2, y0 + Math.sin(a2) * L2); fg.stroke(); }
            fg.setTransform(1, 0, 0, 1, 0, 0);
            const cg = fg.createRadialGradient(mx + ca * 4, my + sa * 4, 0, mx + ca * 4, my + sa * 4, 10); cg.addColorStop(0, "rgba(255,255,255,1)"); cg.addColorStop(0.75, "rgba(255,255,248,1)"); cg.addColorStop(1, "rgba(255,250,220,0)");
            fg.fillStyle = cg; fg.beginPath(); fg.arc(mx + ca * 4, my + sa * 4, 10, 0, 7); fg.fill(); fg.restore(); fg.filter = "none"; fg.globalAlpha = 1; }
          if (age < 3 * F - 1e-4) { const A = [0.4, 0.26, 0.11][Math.min(2, Math.floor(age / F + 1e-3))], gx = mx + ca * 20, gy = my + sa * 20, gr = gg.createRadialGradient(gx, gy, 0, gx, gy, 120);   // r11: ground glow r 120 px, 40 %
            gr.addColorStop(0, `rgba(255,205,120,${A})`); gr.addColorStop(0.4, `rgba(255,150,60,${A * 0.45})`); gr.addColorStop(1, "rgba(255,120,40,0)"); gg.fillStyle = gr; gg.fillRect(gx - 121, gy - 121, 242, 242); }
          if (age < 0.25) for (let k = 0; k < 14; k++) { const a2 = ang + (R() - 0.5) * 1.0, sp = 250 + 200 * R(), d1 = sp * age + 16, d0 = Math.max(10, d1 - 14), al = 1 - age / 0.25;
            const x0 = mx + Math.cos(a2) * d0, y0 = my + Math.sin(a2) * d0, x1 = mx + Math.cos(a2) * d1, y1 = my + Math.sin(a2) * d1, lg = fg.createLinearGradient(x0, y0, x1, y1);
            lg.addColorStop(0, "rgba(255,170,60,0)"); lg.addColorStop(1, `rgba(255,236,170,${al.toFixed(3)})`); fg.strokeStyle = lg; fg.lineWidth = 1.4; fg.beginPath(); fg.moveTo(x0, y0); fg.lineTo(x1, y1); fg.stroke(); }
        } } };
  }
  // ---------------- per frame
  // LOOK-LOCK pending-begin clouds-frame (white-out + debug)
  const whiteAt = (t) => { const d = DV; if (!d) return [0, 0];
    let a; if (t < d.emerge) { const v6 = t < d.SW + 0.05 ? (C.dive.grey ? C.dive.grey * sstep(d.wIn, d.wIn + 0.2, t) : 0.45 * sstep(d.wIn, d.SW, t)) :   /* r13b: inside the deck an even grey (WO base ~(208,211,204)) at C.dive.grey */ t < d.warm + 0.1 ? lerp(0.86, 1, sstep(d.warm - 0.05, d.warm + 0.1, t)) : 1;
      a = Math.max(v6, sstep(d.SW - 0.12, d.SW - 0.067, t) * (1 - sstep(d.SW + 0.067, d.SW + 0.13, t))); }
    else a = t < d.clear ? lerp(1, 0.1, 1 - (1 - clamp((t - d.emerge) / (d.clear - d.emerge))) ** 2) : lerp(0.1, 0, sstep(d.clear, d.haze, t));
    return [a, sstep(d.warm - 0.05, d.warm + 0.15, t)]; };
  const VG = document.getElementById("vignette");
  // r13e debug (window.BWGL_DEBUG, mask test copies only): every fair lump as a circle (green kept, yellow corridor, cyan near, red dropped, grey rejected centre)
  let DBGC = null; const dbgDraw = () => { if (!window.BWGL_DEBUG || !window.__bwglDbg) return; if (!DBGC) { DBGC = document.createElement("canvas"); DBGC.width = 1920; DBGC.height = 1080; DBGC.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;z-index:99"; SCN.appendChild(DBGC); }
    const g = DBGC.getContext("2d"), v = new THREE.Vector3(); g.clearRect(0, 0, 1920, 1080); g.lineWidth = 3;
    const pr = (x, y, z, r, col) => { v.set(x, y, z).project(camera); if (v.z > 1) return; const d = camera.position.distanceTo(new THREE.Vector3(x, y, z)); g.strokeStyle = col; g.beginPath(); g.arc((v.x + 1) * 960, (1 - v.y) * 540, Math.max(3, r * 1700 / d), 0, 6.283); g.stroke(); };
    for (const c of window.__bwglDbg.list) if (c[5] === 0) pr(c[0], c[4] + 0.5 * c[3], c[1], c[2], c.corr ? "#ff0" : c[4] >= (C.fair.nearTier || 1e9) * (C.fair.F || 1) ? "#0ff" : "#0f0");
    for (const c of window.__bwglDropped || []) pr(c[0], c[4] + 0.5 * c[3], c[1], c[2], "#f00");
    for (const c of (window.__bwglRej || []).slice(0, 400)) pr(c[0], 60 * (C.fair.F || 1), c[1], c[2] * 0.3, c[3] === 1 ? "#888" : "#444"); };
  // LOOK-LOCK pending-end clouds-frame
  const draw = (t) => {
    const cs = camSolve(); dbgDraw();
    HAZE.style.opacity = (sstep(14, 34, cs.tilt) * (C.hazeK ?? 1)).toFixed(3);
    const [wa, ww] = whiteAt(t); WO.style.opacity = wa.toFixed(3); WW.style.opacity = ww.toFixed(3);
    if (VG) VG.style.filter = wa > 0.002 ? `opacity(${(1 - wa).toFixed(3)})` : "";   // r13: the map vignette fades out inside the white-out (an even cream, no dark oval)
    renderer.setRenderTarget(null); renderer.clear(true, true, true);
    for (const s of systems) { if (!s.on(t)) continue; if (s.pre) s.pre(t); s.fx.update(t, camera); renderer.render(s.scene, camera); }
    if (SMOKE) SMOKE.draw(t);
    // LOOK-LOCK pending-begin smoke3d
    if (S3D) S3D.draw(t);
    // LOOK-LOCK pending-end smoke3d
  };
  window.__BWGL = { draw, camera, renderer, systems, dive: DV };
  draw(window.tl ? window.tl.time() : 0);
  ready();
}
