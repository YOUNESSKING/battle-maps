// GM3D world: a real 3D battle-map world (three.js r149) for the Grand Maneuver experiment, Big Black River, 17 May 1863.
// ES module. Needs window.THREE (vendor/three.min.js) and window.GM3D_DATA (assets/world_data.js, from bake_world.py).
//
//   import { initWorld, GM_KEYS } from "./world.js";
//   const world = initWorld(canvas, { base: "assets/", keys: GM_KEYS });   // keys = camera beats (default: the gm_test 66 s timeline)
//   await world.ready;                     // textures + heightmaps decoded, meshes built (register it as window.__hf.buildReady)
//   world.update(t);                       // deterministic: draws the frame for t seconds (pure function of t)
//   world.project(lat, lon, h) / world.projectMap(x, y, h) -> {x, y, visible, depth, ppu}   (screen px of the 1920x1080 canvas)
//   world.onFrame((w, t) => ...)           // called after every update: stick HTML overlays to the ground here
//
// World space = map units of the 2880x1620 'vicksburg_hd_lift' frame (x east, z = map y south, 1 unit = 129.36 m),
// height y = metres * exag / 129.36. Two regions share that space: 'wide' (960 x 540 units) and 'close' (84 x 56 units
// around the Big Black bridge); the camera keys pick the region, so a dive from wide to close is one continuous move
// and the region swap (hidden by the cloud layer) happens mid-dive.
import * as THREE from "three";   // clip copy: three r169 module (shared with fx.js)

// ---------------- camera beats (gm_test audio/timing.json + scene/timing.js) ----------------
// key: {t, region, at:[mapX, mapY], dist (units from target), tilt (deg from straight down), yaw (deg, 0 = north up), fov, night (0..1), ease}
// ease applies to the segment that ENDS at this key: "io" (default, sine in-out), "in", "out", "lin".
export const GM_T = { D: 66.0, p2: 18.26, p3: 28.17, p4: 44.68, p5: 57.78, dive: 17.46, bburn: 35.68, crossing: 24.05 };
export function gmKeys(T = GM_T) {
  const DV = T.dive;
  return [
    { t: 0.0, region: "wide", at: [1565, 715], dist: 640, tilt: 44, yaw: -3, fov: 30 },
    { t: DV - 1.3, region: "wide", at: [1512, 707], dist: 470, tilt: 42, yaw: 2, fov: 30 },
    // the dive: wide -> close straight down onto the bridge, region swap at DV + 0.35 (behind the clouds)
    { t: DV + 0.35, region: "close", at: [1515, 705], dist: 95, tilt: 34, yaw: 1, fov: 31, ease: "in" },
    { t: DV + 1.4, region: "close", at: [1519.1, 704.4], dist: 40, tilt: 30, yaw: 0, fov: 32, ease: "out" },
    { t: T.p3, region: "close", at: [1517.1, 704.85], dist: 36, tilt: 30, yaw: -2, fov: 32 },
    { t: T.p4 - 0.6, region: "close", at: [1515.5, 705.1], dist: 33, tilt: 29, yaw: -4, fov: 32 },
    // flashback: a month earlier, night, Vicksburg on the river (cut at p4 - 0.6)
    { t: T.p4 - 0.6, region: "wide", at: [1401, 690], dist: 330, tilt: 42, yaw: 0, fov: 30, night: 1, ease: "cut" },
    { t: T.p5 - 0.6, region: "wide", at: [1380, 694], dist: 290, tilt: 42, yaw: -3, fov: 30, night: 1 },
    // the next day: back on the close map (cut at p5 - 0.6)
    { t: T.p5 - 0.6, region: "close", at: [1514.6, 704.85], dist: 35, tilt: 30, yaw: 0, fov: 32, ease: "cut" },
    { t: T.D, region: "close", at: [1513.0, 704.6], dist: 32, tilt: 29, yaw: 3, fov: 32 },
  ];
}
export const GM_KEYS = gmKeys();

// ---------------- small helpers ----------------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const EASE = { io: (k) => 0.5 - 0.5 * Math.cos(Math.PI * k), in: (k) => k * k * k, out: (k) => 1 - (1 - k) ** 3, lin: (k) => k };
const hash = (i, s = 0) => { let x = Math.imul((i + 1) ^ (s * 0x9e3779b1), 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; };
const loadImg = (src) => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error("GM3D: cannot load " + src)); im.src = src; });

export function latLonToMap(lat, lon, geo = window.GM3D_DATA.geo) {
  const z = 256 * 2 ** geo.zoom, r = (lat * Math.PI) / 180;
  return [((lon + 180) / 360) * z - geo.origin[0], ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * z - geo.origin[1]];
}
export function mapToLatLon(x, y, geo = window.GM3D_DATA.geo) {
  const z = 256 * 2 ** geo.zoom, wx = x + geo.origin[0], wy = y + geo.origin[1];
  return [(Math.atan(Math.sinh(Math.PI * (1 - (2 * wy) / z))) * 180) / Math.PI, (wx / z) * 360 - 180];
}

// tileable water normal map from integer-frequency sines (deterministic)
function waterNormals(N = 256) {
  const c = document.createElement("canvas"); c.width = c.height = N; const g = c.getContext("2d"); const im = g.createImageData(N, N);
  const W = []; for (let k = 0; k < 14; k++) W.push([Math.round(1 + hash(k, 1) * 9) * (hash(k, 2) < 0.5 ? 1 : -1), Math.round(hash(k, 3) * 7), hash(k, 4) * 6.283, 1 / (1 + k * 0.45)]);
  const hgt = new Float32Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { let s = 0; for (const [fx, fy, ph, a] of W) s += a * Math.sin(((fx * x + fy * y) / N) * 6.283 + ph); hgt[y * N + x] = s; }
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = hgt[y * N + ((x + 1) % N)] - hgt[y * N + ((x + N - 1) % N)], dy = hgt[((y + 1) % N) * N + x] - hgt[((y + N - 1) % N) * N + x];
    const nx = -dx * 0.9, ny = -dy * 0.9, l = Math.hypot(nx, ny, 1), i = (y * N + x) * 4;
    im.data[i] = (nx / l * 0.5 + 0.5) * 255; im.data[i + 1] = (ny / l * 0.5 + 0.5) * 255; im.data[i + 2] = (1 / l * 0.5 + 0.5) * 255; im.data[i + 3] = 255;
  }
  g.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}

// gable roof prism: footprint [-.5,.5]^2, ridge along x, height 1
function roofGeometry() {
  const p = [-0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 1, 0, -0.5, 1, 0, -0.5, 0, 0.5, 0.5, 0, 0.5];
  const idx = [0, 3, 2, 0, 2, 1, 4, 5, 2, 4, 2, 3, 0, 4, 3, 1, 2, 5];   // two slopes + two gables
  const pos = []; for (const i of idx) pos.push(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]);
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
}

// ---------------- the world ----------------
export function initWorld(canvas, opts = {}) {
  const O = { base: "assets/", width: 1920, height: 1080, exag: { wide: 14.0, close: 6.0 }, shadowSize: 2048, shadows: true, antialias: true, meshDiv: { wide: 3, close: 1.6 },
    keys: GM_KEYS, bridgeBurnT: GM_T.bburn, treeScale: 1, pontoonT: (window.EV && window.EV.bridgesNew) || [], ...opts };
  const D = window.GM3D_DATA; if (!D) throw new Error("GM3D: load assets/world_data.js first");
  const MPU = D.geo.mpu;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: O.antialias, preserveDrawingBuffer: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(1); renderer.setSize(O.width, O.height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = O.shadows; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = true;
  const camera = new THREE.PerspectiveCamera(30, O.width / O.height, 1, 5000);

  // sky environment for the water reflections (rendered once)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const skyScene = new THREE.Scene();
  { const g = new THREE.SphereGeometry(100, 32, 16); const col = []; const pos = g.attributes.position; const top = new THREE.Color(0x8fb0cc), hor = new THREE.Color(0xe8e4d6), bot = new THREE.Color(0x5d5a4c);
    for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) / 100; const c = y > 0 ? hor.clone().lerp(top, Math.pow(y, 0.6)) : hor.clone().lerp(bot, Math.min(1, -y * 3)); col.push(c.r, c.g, c.b); }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    skyScene.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide }))); }
  const envMap = pmrem.fromScene(skyScene, 0.02).texture;
  const wnorm = waterNormals();

  const regions = {};
  const hooks = [];
  const world = { renderer, camera, regions, keys: O.keys, region: null, t: 0, onFrame: (f) => hooks.push(f), opts: O, data: D };

  function heightAt(R, x, z) {   // bilinear ground height (world y) of region R at map (x, z)
    const [x0, y0, bw, bh] = R.box, [W, H] = R.hm;
    const fx = clamp(((x - x0) / bw) * W - 0.5, 0, W - 1.001), fy = clamp(((z - y0) / bh) * H - 0.5, 0, H - 1.001);
    const i = Math.floor(fx), j = Math.floor(fy), a = fx - i, b = fy - j, h = R.h;
    return lerp(lerp(h[j * W + i], h[j * W + i + 1], a), lerp(h[(j + 1) * W + i], h[(j + 1) * W + i + 1], a), b);
  }

  async function buildRegion(name) {
    const d = D.regions[name]; const exag = O.exag[name]; const ys = exag / MPU;
    const [x0, y0, bw, bh] = d.box, [W, H] = d.hm;
    const [him, tex] = await Promise.all([loadImg(O.base + `height_${name}.png`), new Promise((res, rej) => new THREE.TextureLoader().load(O.base + `ground_${name}.jpg`, res, undefined, rej))]);
    const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(him, 0, 0);
    const px = g.getImageData(0, 0, W, H).data; const h = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) h[i] = ((px[i * 4] * 256 + px[i * 4 + 1]) / 200 - 20) * ys;
    const R = { name, box: d.box, hm: d.hm, h, ys, data: d };
    const scene = new THREE.Scene(); R.scene = scene;
    // terrain mesh (half the heightmap resolution in vertices)
    const sx = Math.round(W / O.meshDiv[name]), sz = Math.round(H / O.meshDiv[name]);
    const geo = new THREE.PlaneGeometry(bw, bh, sx, sz); geo.rotateX(-Math.PI / 2); geo.translate(x0 + bw / 2, 0, y0 + bh / 2);
    const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, heightAt(R, pos.getX(i), pos.getZ(i)));
    geo.computeVertexNormals();
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
    const tmatG = new THREE.MeshLambertMaterial({ map: tex }); tmatG.userData.uNight = { value: 0 };
    tmatG.onBeforeCompile = (sh) => { sh.uniforms.uNight = tmatG.userData.uNight;   // v6: at night the red roads go dark grey (no glowing veins); fx.patchGround chains after this
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uNight;").replace("#include <map_fragment>",
        "#include <map_fragment>\n{ float rd = clamp((diffuseColor.r - diffuseColor.g) * 7.0 - 0.25, 0.0, 1.0) * uNight; diffuseColor.rgb = mix(diffuseColor.rgb, vec3(dot(diffuseColor.rgb, vec3(0.3, 0.45, 0.25)) * 0.6), rd); }"); };
    const terrain = new THREE.Mesh(geo, tmatG);
    terrain.receiveShadow = true; terrain.castShadow = name === "close"; scene.add(terrain); R.terrain = terrain;
    // skirt: a dark ground plane far below so the box edge never shows a void
    const skirt = new THREE.Mesh(new THREE.PlaneGeometry(bw * 6, bh * 6).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x6e6c56 }));
    skirt.position.set(x0 + bw / 2, -0.5, y0 + bh / 2); scene.add(skirt);
    // lights
    const hemi = new THREE.HemisphereLight(0xe6ecf0, 0x6a5a40, 0.62 * Math.PI); scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff2de, 0.78 * Math.PI); sun.castShadow = O.shadows; scene.add(sun); scene.add(sun.target);
    sun.shadow.mapSize.set(O.shadowSize, O.shadowSize); sun.shadow.bias = -0.0006; sun.shadow.normalBias = name === "close" ? 0.02 : 0.2; sun.shadow.radius = 3;
    R.hemi = hemi; R.sun = sun;
    scene.fog = new THREE.Fog(0xb9bcb0, 100, 1000);
    // rivers: water ribbons on the carved channels
    const wmat = new THREE.MeshStandardMaterial({ color: 0x2f4552, roughness: 0.4, metalness: 0.05, envMap, envMapIntensity: 0.22, side: THREE.DoubleSide, normalMap: wnorm, normalScale: new THREE.Vector2(0.35, 0.35) });
    R.water = [];
    for (const rv of d.rivers) {
      const P = rv.pts, n = P.length, w = rv.w * 1.08, vs = [], uv = [], ix = []; let arc = 0;
      for (let i = 0; i < n; i++) {
        const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)]; let tx = b[0] - a[0], tz = b[1] - a[1]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
        if (i) arc += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
        const y = P[i][2] * ys + 0.002 * exag;
        vs.push(P[i][0] - tz * w / 2, y, P[i][1] + tx * w / 2, P[i][0] + tz * w / 2, y, P[i][1] - tx * w / 2);
        uv.push(arc / w, 0, arc / w, 1);
        if (i) { const k = (i - 1) * 2; ix.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
      }
      const wg = new THREE.BufferGeometry(); wg.setAttribute("position", new THREE.Float32BufferAttribute(vs, 3)); wg.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); wg.setIndex(ix); wg.computeVertexNormals();
      const m = new THREE.Mesh(wg, wmat); m.receiveShadow = true; scene.add(m); R.water.push(m);
    }
    R.wmat = wmat;
    // forests (v4): close = massed canopy. The bake raises a ~3 m canopy blanket under every wood (dark crown-speckle texture), and
    // instanced crown CLUSTERS (2-4 merged, displaced lobes, 4 shape variants, log-normal sizes, colour/hue jitter) sit half sunk in it,
    // so a wood reads as one irregular dark mass with a shadowed edge and a broken outline. Hedgerows / lone / garden trees: smaller clusters
    // standing on the ground. Wide: no instanced crowns (the woods are texture + raised canopy).
    // tree record: [x, z, h_m, kind (0 wood, 1 conifer, 2 hedge, 3 lone), scale, colour 0..1, edge 0..1 (wood edge .. deep inside)]
    const trees = d.trees, ts = (name === "wide" ? 1.3 : 0.125) * O.treeScale;   // v4: smaller crowns (GM canopy grain is fine)
    const tmat = new THREE.MeshLambertMaterial();
    const dummy = new THREE.Object3D(), col = new THREE.Color(), olive = new THREE.Color(0x5e6648), teal = new THREE.Color(0x345e64);
    const GREENS = [0x314f57, 0x35545a, 0x38565c, 0x2f4c55, 0x3a565d, 0x324f57, 0x3b585f, 0x2f5058];   // v6: teal (R -10 %, B +12 %)   // v5: renders GM's teal woods ~(51-58, 68-78, 64-72) (no upward normal bias any more)
    const NV = 4, variants = [];
    for (let v = 0; v < NV; v++) {   // one crown cluster geometry per variant
      const lobes = 2 + (v % 3), P = [], N = [];
      for (let l = 0; l < lobes; l++) {
        const g = new THREE.IcosahedronGeometry(1, 0).toNonIndexed(), p = g.attributes.position;
        const a = hash(v * 7 + l, 31) * 6.283, rr = l === 0 ? 0 : 0.42 + hash(v * 7 + l, 32) * 0.3, sc = l === 0 ? 0.78 : 0.5 + hash(v * 7 + l, 33) * 0.28;
        const cx = Math.cos(a) * rr, cz = Math.sin(a) * rr, cy = l === 0 ? 0 : -0.12 + hash(v * 7 + l, 34) * 0.18;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
          const k = 1 + (Math.sin(x * 5.1 + v * 3 + l) * Math.sin(y * 4.3 + l * 2) * Math.sin(z * 4.7 + v)) * 0.22;   // lumpy
          P.push(cx + x * sc * k, cy + y * sc * k * 0.82, cz + z * sc * k);
          const nn = new THREE.Vector3(x, y + 0.9, z).normalize(); N.push(nn.x, nn.y, nn.z);   // v5: soft canopy normals (low crown-to-crown contrast: one dark mass); the colours carry the darkness
        }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(N, 3));
      variants.push(g);
    }
    const crowns = trees.filter((q) => q[3] !== 1), pines = trees.filter((q) => q[3] === 1);
    if (crowns.length && name === "close") {
      const groups = variants.map(() => []);
      crowns.forEach((q, i) => groups[Math.floor(hash(i, 40) * NV)].push(q));
      R.trees = [];
      groups.forEach((G, v) => { if (!G.length) return;
        const im = new THREE.InstancedMesh(variants[v], tmat, G.length); im.castShadow = true; im.receiveShadow = true;
        G.forEach((q, i) => { const j = i * NV + v, kind = q[3], e = q[6] || 0, wood = kind === 0;
          const s = ts * q[4] * (wood ? 0.85 : kind === 2 ? 0.8 : 0.85), y = heightAt(R, q[0], q[1]);   // v5: smaller flatter wood crowns sunk in the canopy blanket: one fine-grained mass
          dummy.position.set(q[0], y + (wood ? s * (0.02 + 0.1 * e) : s * 0.62), q[1]); dummy.rotation.set(0, hash(j, 7) * 6.28, 0);
          dummy.scale.set(s * (0.9 + hash(j, 8) * 0.3), s * (wood ? 0.42 : 0.85 + hash(j, 11) * 0.3), s * (0.9 + hash(j, 9) * 0.3)); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix);
          col.setHex(GREENS[Math.floor(q[5] * GREENS.length) % GREENS.length]);
          const hv = hash(j, 12); if (hv < 0.12) col.lerp(olive, 0.2 + hv); else if (hv > 0.7) col.lerp(teal, 0.45);
          col.multiplyScalar((0.9 + hash(j, 10) * 0.16) * (wood ? 0.83 + 0.07 * e : 0.82)); im.setColorAt(i, col); });
        R.scene.add(im); R.trees.push(im); });
    }
    if (pines.length && name === "close") {
      const pg = new THREE.ConeGeometry(0.75, 2.6, 7); pg.translate(0, 1.3, 0);
      const im = new THREE.InstancedMesh(pg, tmat, pines.length); im.castShadow = true; im.receiveShadow = true;
      pines.forEach((q, i) => { const s = ts * q[4] * 0.8; dummy.position.set(q[0], heightAt(R, q[0], q[1]) - s * 0.6, q[1]); dummy.rotation.set(0, hash(i, 11) * 6.28, 0); dummy.scale.set(s, s, s); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix);
        col.setHex(0x3a5650).multiplyScalar(0.8 + hash(i, 12) * 0.3); im.setColorAt(i, col); });
      scene.add(im);
    }
    // villages: box houses + gable roofs
    const hs = d.houses;
    if (hs.length) {
      const wallG = new THREE.BoxGeometry(1, 1, 1); wallG.translate(0, 0.5, 0);
      const walls = new THREE.InstancedMesh(wallG, new THREE.MeshLambertMaterial(), hs.length);
      const roofs = new THREE.InstancedMesh(roofGeometry(), new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }), hs.length);
      walls.castShadow = roofs.castShadow = true; walls.receiveShadow = roofs.receiveShadow = true;
      // v4 roofs: GM's varied tile reds / oranges, some brown and slate; kind 1 = church nave (taller), 2 = church tower (tall, steep roof)
      const WALL = [0xe0d6c0, 0xd4c8ac, 0xcabd9f, 0xe8e0cc], ROOF = [0xc4593a, 0xb8533a, 0xcc6844, 0xa84a34, 0x8e5a40, 0x6c6a68, 0xd27a4c];
      const wh = name === "wide" ? 0.34 : 0.085, rh = name === "wide" ? 0.3 : 0.075, hk = name === "wide" ? 1 : 1.0;   // v5: close houses smaller (plan x0.62 in the bake)
      hs.forEach((q, i) => { const [x, z, hm, w, dd, rot, rc] = q, kind = q[7] || 0; const y = heightAt(R, x, z) - 0.01;
        const hh = kind === 3 ? 0.028 : wh * (kind === 2 ? 4.2 : kind === 1 ? 1.7 : 0.85 + hash(i, 3) * 0.5);
        dummy.position.set(x, y, z); dummy.rotation.set(0, rot, 0); dummy.scale.set(w * hk, hh, dd * hk); dummy.updateMatrix(); walls.setMatrixAt(i, dummy.matrix);
        col.setHex(WALL[Math.floor(hash(i, 4) * WALL.length)]); walls.setColorAt(i, col);
        dummy.position.set(x, y + hh, z); dummy.scale.set(w * 1.08 * hk, rh * (kind === 2 ? 2.6 : kind === 1 ? 1.4 : 0.9 + hash(i, 6) * 0.3), dd * 1.12 * hk);
        if (kind === 3) dummy.scale.set(1e-4, 1e-4, 1e-4);   // courtyard wall: no roof
        dummy.updateMatrix(); roofs.setMatrixAt(i, dummy.matrix);
        col.setHex(ROOF[rc % ROOF.length]).multiplyScalar(0.82 + hash(i, 5) * 0.32); roofs.setColorAt(i, col); });
      scene.add(walls, roofs);
    }
    // the Big Black railroad bridge (close): timber trestle, deck, rails; burns at bridgeBurnT
    if (d.bridge) {
      const b = d.bridge, grp = new THREE.Group(), wood = new THREE.MeshStandardMaterial({ color: 0x6a4c32, roughness: 0.9 });
      const deckY = b.deck * ys, wl = b.wl * ys, L = b.len, span = [];
      const nSeg = 6;
      for (let k = 0; k < nSeg; k++) {
        const seg = new THREE.Mesh(new THREE.BoxGeometry(L / nSeg * 1.01, 0.045, 0.2), wood); seg.position.set(-L / 2 + (k + 0.5) * L / nSeg, deckY, 0); seg.castShadow = seg.receiveShadow = true; grp.add(seg); span.push(seg);
        for (const sz of [-0.05, 0.05]) { const rail = new THREE.Mesh(new THREE.BoxGeometry(L / nSeg, 0.012, 0.012), new THREE.MeshStandardMaterial({ color: 0x2c2a28, roughness: 0.6, metalness: 0.4 })); rail.position.set(-L / 2 + (k + 0.5) * L / nSeg, deckY + 0.024, sz); grp.add(rail); seg.userData.rails = (seg.userData.rails || []).concat(rail); }
      }
      for (let k = 0; k <= nSeg; k++) { const x = -L / 2 + k * L / nSeg, hgt = deckY - wl + 0.12;
        for (const sz of [-0.08, 0.08]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.03, hgt, 0.03), wood); p.position.set(x, wl - 0.1 + hgt / 2, sz); p.castShadow = true; grp.add(p); }
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.24), wood); cap.position.set(x, deckY - 0.025, 0); grp.add(cap); }
      grp.position.set(b.x, 0, b.z); grp.rotation.y = -b.angle; scene.add(grp);
      R.bridge = { grp, span, wood, burnt: false };
    }
    // v5 breastworks: a low earth parapet (extruded prism: firing step behind, steep inner face, sloping glacis to the east) that catches the
    // sun and casts a shadow; the bake paints the dark ditch + pale spoil in front of it
    if (d.breastworks) {
      const L = d.breastworks, prof = [[-0.15, -0.012], [-0.06, 0.062], [0.02, 0.07], [0.18, -0.012]], pos = [], idx = [];
      for (let i = 0; i < L.length; i++) {
        const a = L[Math.max(0, i - 1)], b = L[Math.min(L.length - 1, i + 1)]; let tx = b[0] - a[0], tz = b[1] - a[1]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
        const nx = tz, nz = -tx;   // east (front) normal
        for (const [o, hy] of prof) { const x = L[i][0] + nx * o, z = L[i][1] + nz * o; pos.push(x, heightAt(R, x, z) + hy, z); }
        if (i) { const k = (i - 1) * 4; for (let j = 0; j < 3; j++) idx.push(k + j, k + j + 4, k + j + 1, k + j + 1, k + j + 4, k + j + 5); }
      }
      let pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); pg.setIndex(idx); pg = pg.toNonIndexed(); pg.computeVertexNormals();
      { const col = [], P = pg.attributes.position, Nn = pg.attributes.normal; for (let i = 0; i < P.count; i++) { const up = Nn.getY(i);   // v6: pale raw-earth top, darker faces
          const c = new THREE.Color(up > 0.9 ? 0xa48a64 : 0x75603f); col.push(c.r, c.g, c.b); } pg.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); }
      const par = new THREE.Mesh(pg, new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide })); par.castShadow = par.receiveShadow = true;
      scene.add(par); R.parapet = par;
    }
    // v5: the three new bridges of 18 May (pontoon / raft bridges: dark boats under a plank deck), shown from opts.pontoonT[k] (default window.EV.bridgesNew)
    if (d.pontoons) {
      R.pontoons = d.pontoons.map((pb, k) => {
        const g = new THREE.Group(), wl = pb.wl * ys + 0.002 * exag, len = pb.len, nb = Math.max(4, Math.round(len / 0.11));
        const boat = new THREE.MeshLambertMaterial({ color: 0x221e1a }), plank = new THREE.MeshLambertMaterial({ color: 0xc2a77e });   // v6: dark boats, pale plank deck, 2x wider
        for (let j = 0; j < nb; j++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.07), boat); b.position.set(0, 0.004, -len / 2 + (j + 0.5) * len / nb); b.castShadow = true; g.add(b); }
        const deck = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.014, len + 0.2), plank); deck.position.y = 0.026; deck.castShadow = deck.receiveShadow = true; g.add(deck);
        for (const sx of [-0.104, 0.104]) { const rail = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.018, len + 0.14), boat); rail.position.set(sx, 0.036, 0); g.add(rail); }
        g.position.set(pb.x, wl, pb.z); g.rotation.y = pb.angle; scene.add(g); return { g, k };
      });
    }
    regions[name] = R;
  }

  world.heightAt = (x, z, region) => heightAt(regions[region || world.region || "wide"], x, z);
  world.ready = Promise.all([buildRegion("wide"), buildRegion("close")]).then(() => { world.update(0); return world; });

  // ---------------- camera from keys ----------------
  const tmpV = new THREE.Vector3();
  function camState(t) {
    const K = O.keys; let i = 0; while (i < K.length - 1 && K[i + 1].t <= t) i++;
    const a = K[i], b = K[Math.min(i + 1, K.length - 1)];
    if (b === a || b.ease === "cut" || t <= a.t) return { ...a, night: a.night || 0, region: a.region };
    const k = clamp((t - a.t) / (b.t - a.t), 0, 1), e = (EASE[b.ease || "io"])(k);
    const L = (p, q) => lerp(p ?? 0, q ?? 0, e);
    return { region: a.region, at: [L(a.at[0], b.at[0]), L(a.at[1], b.at[1])], dist: Math.exp(lerp(Math.log(a.dist), Math.log(b.dist), e)),
      tilt: L(a.tilt, b.tilt), yaw: L(a.yaw, b.yaw), fov: L(a.fov ?? 30, b.fov ?? 30), night: L(a.night, b.night) };
  }
  world.cameraAt = camState;
  function placeCamera(cs, R) {
    const ty = heightAt(R, cs.at[0], cs.at[1]), tl = (cs.tilt * Math.PI) / 180, yw = (cs.yaw * Math.PI) / 180;
    const back = Math.sin(tl) * cs.dist, up = Math.cos(tl) * cs.dist;
    camera.position.set(cs.at[0] + Math.sin(yw) * back, ty + up, cs.at[1] + Math.cos(yw) * back);
    camera.up.set(0, 1, 0); camera.lookAt(tmpV.set(cs.at[0], ty, cs.at[1]));
    camera.fov = cs.fov; camera.near = Math.max(0.05, cs.dist * 0.05); camera.far = cs.dist * 8; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    return ty;
  }

  const DAY = { sun: new THREE.Color(0xfff2de), sunI: 1.0 * Math.PI, sky: new THREE.Color(0xe6ecf0), gnd: new THREE.Color(0x6a5a40), hemiI: 0.52 * Math.PI, fog: new THREE.Color(0xa9b3b4), water: new THREE.Color(0x2f4552) };   // v5: darker, bluer water (his rivers ~(83,86,88) with a dark edge)
  const HAZE = new THREE.Color(0xb4bcbc);   // v6: depth haze back at ~half (critic B 3)   // round 2: bluer, his blue-grey atmospheric cast
  const NIGHT = { sun: new THREE.Color(0xa8c0ea), sunI: 0.95 * Math.PI, sky: new THREE.Color(0x40507a), gnd: new THREE.Color(0x10141c), hemiI: 0.42 * Math.PI, fog: new THREE.Color(0x141c2c), water: new THREE.Color(0x1c2a40) };   // v6: stronger moon, less fill -> moonlit relief

  world.update = (t, o = {}) => {
    world.t = t; const cs = camState(t); const R = regions[cs.region]; if (!R) return;
    world.region = cs.region; world.cam = cs;
    const ty = placeCamera(cs, R);
    // sun from the north-west, 38 deg high; shadow box follows the view
    const n = cs.night || 0, sd = cs.dist;
    const dir = new THREE.Vector3(-0.7, 0.48, -0.4).normalize();
    R.sun.target.position.set(cs.at[0], ty, cs.at[1] - sd * 0.25); R.sun.position.copy(R.sun.target.position).addScaledVector(dir, sd * 2.5);
    const sc = R.sun.shadow.camera, half = sd * 0.95; sc.left = -half; sc.right = half; sc.top = half; sc.bottom = -half; sc.near = sd * 0.5; sc.far = sd * 5; sc.updateProjectionMatrix();
    const wk = cs.region === "wide" ? 1 : 0;   // clip critic: stronger relief on the wide map (more sun, less sky fill)
    R.sun.color.copy(DAY.sun).lerp(NIGHT.sun, n); R.sun.intensity = lerp(DAY.sunI, NIGHT.sunI, n) * (1 + 0.35 * wk * (1 - n));
    R.hemi.color.copy(DAY.sky).lerp(NIGHT.sky, n); R.hemi.groundColor.copy(DAY.gnd).lerp(NIGHT.gnd, n); R.hemi.intensity = lerp(DAY.hemiI, NIGHT.hemiI, n) * (1 - 0.3 * wk * (1 - n));
    // v4 haze: on the oblique close camera the far ground fades into a pale sky-blue haze (GM 640-700 / 800 / 910-950 s):
    // smoothstep over view depth 0.78 d .. 2.3 d -> ~0 at the frame centre, ~0.45 at the top edge (tilt 52, fov 30)
    const cl = cs.region === "close" ? 1 : 0;
    R.scene.fog.color.copy(cl ? HAZE : DAY.fog).lerp(NIGHT.fog, n); R.scene.fog.near = sd * (cl ? 1.0 : 1.25); R.scene.fog.far = sd * (cl ? 2.6 : 8.0);   // v5: half the wide haze; close top edge ~0.2 (his top band keeps full contrast)
    R.terrain.material.userData.uNight.value = n;
    R.wmat.color.copy(DAY.water).lerp(NIGHT.water, n); R.wmat.envMapIntensity = lerp(0.22, 0.1, n);
    renderer.setClearColor(R.scene.fog.color);
    // water motion: normal map drifts downstream
    const rep = cs.region === "wide" ? 1 / 1.5 : 1 / 0.25; wnorm.repeat.set(1, 1); wnorm.offset.set(-t * 0.12, Math.sin(t * 0.7) * 0.03);
    R.water.forEach((m) => { m.material.normalScale.set(0.35, 0.35); });
    // bridge burn: centre spans gone, the rest charred
    if (R.bridge) { const burnt = O.bridgeBurnT != null && t >= O.bridgeBurnT; const B = R.bridge;
      B.span.forEach((s, k) => { const mid = k >= 2 && k <= 3; s.visible = !(burnt && mid); (s.userData.rails || []).forEach((r) => (r.visible = s.visible)); });
      B.wood.color.setHex(burnt ? 0x2b2118 : 0x6a4c32); }
    if (R.pontoons) for (const p of R.pontoons) { const t0 = O.pontoonT[p.k]; const k = t0 == null ? 0 : clamp((t - t0) / 0.7, 0, 1); p.g.visible = k > 0.001; p.g.scale.set(1, 1, Math.max(0.001, k)); }
    world.scene = R.scene;
    if (o.beforeRender) o.beforeRender(world, t, R);
    renderer.render(R.scene, camera);
    for (const f of hooks) f(world, t);
  };

  // ---------------- overlay hook ----------------
  const pv = new THREE.Vector3();
  world.projectMap = (x, y, h = 0) => {
    const R = regions[world.region || "wide"]; if (!R) return { x: 0, y: 0, visible: false };
    pv.set(x, heightAt(R, x, y) + h, y); const dist = pv.distanceTo(camera.position); pv.project(camera);
    const ppu = O.height / (2 * Math.tan((camera.fov * Math.PI) / 360) * dist);   // screen px per world unit at that point
    return { x: ((pv.x + 1) / 2) * O.width, y: ((1 - pv.y) / 2) * O.height, depth: pv.z, visible: pv.z > -1 && pv.z < 1 && Math.abs(pv.x) < 1.2 && Math.abs(pv.y) < 1.2, ppu };
  };
  world.project = (lat, lon, h = 0) => { const [x, y] = latLonToMap(lat, lon, D.geo); return world.projectMap(x, y, h); };
  world.latLonToMap = (lat, lon) => latLonToMap(lat, lon, D.geo);
  world.mapToLatLon = (x, y) => mapToLatLon(x, y, D.geo);

  // ---------------- hooks for the cloud / fx layers ----------------
  const BR = D.regions.close.bridge;
  world.anchors = {
    bridge: { map: [BR.x, BR.z], latlon: mapToLatLon(BR.x, BR.z, D.geo) },
    vicksburg: { map: D.towns.Vicksburg, latlon: mapToLatLon(...D.towns.Vicksburg, D.geo) },
    // the dive: camera falls from the wide view onto the bridge; the region swap time is when a cloud should fill the frame
    dive: (() => { const K = O.keys; const i = K.findIndex((k, j) => j > 0 && k.region !== K[j - 1].region && k.ease !== "cut");
      return i < 0 ? null : { start: K[i - 1].t, swap: K[i].t, end: (K[i + 1] || K[i]).t, map: K[i].at }; })(),
  };
  world.worldPos = (x, y, h = 0) => { const R = regions[world.region || "wide"]; return new THREE.Vector3(x, (R ? heightAt(R, x, y) : 0) + h, y); };
  world.addToScene = (obj, region = "both") => { for (const n of region === "both" ? ["wide", "close"] : [region]) regions[n].scene.add(region === "both" && n === "close" ? obj.clone() : obj); };
  return world;
}
