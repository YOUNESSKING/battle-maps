// vicksburg/engine/world.js: the GM3D 3D map world, generalised from research/style_tests/gm3d/clip/world.js (v8, the approved look).
// ES module (three r169, shared with fx.js). Data = the world bundles of vicksburg/worlds/ (see AGENT_BRIEF.md "World bundle contract"):
//   window.GM3D_GEO = { zoom, origin:[x,y], mpu, towns:{} }                      (worlds/geo.js)
//   window.GM3D_REGIONS[name] = { kind:"wide"|"close", box, hm, exag, rivers, roads, houses, trees, towns, features:{bridges, works, pontoons} }
//   + worlds/<name>/height.png (16-bit in R/G: h_m = (R*256+G)/200 - 20) + worlds/<name>/ground.jpg
//
//   const world = initWorld(canvas, { regions: ["wide", "bigblack"], base: "worlds/", keys, features: { bigblack: { bridges: [{ burn: 38.9 }], pontoons: [{ at: 58.8 }] } } });
//   await world.ready; world.update(t, { beforeRender });   // pure function of t
//   world.projectMap(x, y, h) -> {x, y, visible, depth, ppu} (canvas px), world.heightAt(x, y, region), world.cameraAt(t)
//
// World space = map units of the 2880x1620 'vicksburg_hd_lift' frame (x east, z = map y south, 1 unit = 129.36 m), height y = metres * exag / mpu.
// All regions share that space; the camera keys pick the region ({t, region, at:[x,y], dist, tilt, yaw, fov, night, ease}), so a dive is one
// continuous move and the region swap hides in the cloud white-out. "kind" switches the look exactly as the clip's "wide" / "close" did.
import * as THREE from "three";

// ---------------- small helpers ----------------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const EASE = { io: (k) => 0.5 - 0.5 * Math.cos(Math.PI * k), in: (k) => k * k * k, out: (k) => 1 - (1 - k) ** 3, lin: (k) => k };
const hash = (i, s = 0) => { let x = Math.imul((i + 1) ^ (s * 0x9e3779b1), 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; };
const loadImg = (src) => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error("GM3D: cannot load " + src)); im.src = src; });

export function latLonToMap(lat, lon, geo = window.GM3D_GEO) {
  const z = 256 * 2 ** geo.zoom, r = (lat * Math.PI) / 180;
  return [((lon + 180) / 360) * z - geo.origin[0], ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * z - geo.origin[1]];
}
export function mapToLatLon(x, y, geo = window.GM3D_GEO) {
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
  // opts: regions (names, loaded from window.GM3D_REGIONS), base (folder holding <region>/height.png + ground.jpg), keys (camera keys),
  // features: { <region>: { bridges: [{ burn: t }], pontoons: [{ at: t } | null] } } (bridge burn times, pontoon unroll times; scene data)
  const O = { base: "worlds/", width: 1920, height: 1080, shadowSize: 2048, shadows: true, antialias: true, regions: null, keys: [], features: {}, treeScale: 1, ...opts };
  O.keys = O.keys.map((k) => ({ fov: 30, yaw: 0, tilt: 45, night: 0, ...k }));   // key defaults (a key without fov gave NaN projections)
  for (let i = 1; i < O.keys.length; i++) if (O.keys[i].t < O.keys[i - 1].t) throw new Error("GM3D: camera keys not sorted at t=" + O.keys[i].t);
  const GEO = window.GM3D_GEO, REG = window.GM3D_REGIONS || {}; if (!GEO) throw new Error("GM3D: load worlds/geo.js first");
  const names = O.regions || Object.keys(REG);
  for (const n of names) if (!REG[n]) throw new Error("GM3D: region '" + n + "' not loaded (worlds/" + n + "/region.js)");
  const D = { geo: GEO, regions: REG, towns: GEO.towns || {} };
  const MPU = GEO.mpu;
  // region kind: "wide" (campaign map look) or "close" (battlefield look); exag + mesh density per kind unless the bundle says otherwise
  const kindOf = (n) => REG[n].kind || (n === "wide" || REG[n].box[2] > 300 ? "wide" : "close");
  // normalised features: legacy clip fields (bridge, breastworks, pontoons) or features:{bridges, works, pontoons}
  const featuresOf = (d) => { const f = d.features || {};
    return { bridges: f.bridges || (d.bridge ? [d.bridge] : []), works: f.works || (d.breastworks ? [{ kind: "breastwork", pts: d.breastworks }] : []), pontoons: f.pontoons || d.pontoons || [] }; };
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
    const d = REG[name], kind = kindOf(name), wideK = kind === "wide", F = featuresOf(d), FO = O.features[name] || {};
    const exag = d.exag ?? (wideK ? 14.0 : 6.0), ys = exag / MPU;
    const [x0, y0, bw, bh] = d.box, [W, H] = d.hm;
    const [him, tex] = await Promise.all([loadImg(O.base + `${name}/height.png`), new Promise((res, rej) => new THREE.TextureLoader().load(O.base + `${name}/ground.jpg`, res, undefined, rej))]);
    const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(him, 0, 0);
    const px = g.getImageData(0, 0, W, H).data; const h = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) h[i] = ((px[i * 4] * 256 + px[i * 4 + 1]) / 200 - 20) * ys;
    const R = { name, kind, box: d.box, hm: d.hm, h, ys, exag, data: d, features: F };
    const scene = new THREE.Scene(); R.scene = scene;
    // terrain mesh (half the heightmap resolution in vertices)
    const mdiv = d.meshDiv ?? (wideK ? 3 : 1.6), sx = Math.round(W / mdiv), sz = Math.round(H / mdiv);
    const geo = new THREE.PlaneGeometry(bw, bh, sx, sz); geo.rotateX(-Math.PI / 2); geo.translate(x0 + bw / 2, 0, y0 + bh / 2);
    const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, heightAt(R, pos.getX(i), pos.getZ(i)));
    geo.computeVertexNormals();
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
    const tmatG = new THREE.MeshLambertMaterial({ map: tex }); tmatG.userData.uNight = { value: 0 };
    tmatG.onBeforeCompile = (sh) => { sh.uniforms.uNight = tmatG.userData.uNight;   // v6: at night the red roads go dark grey (no glowing veins); fx.patchGround chains after this
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uNight;").replace("#include <map_fragment>",
        "#include <map_fragment>\n{ float rd = clamp((diffuseColor.r - diffuseColor.g) * 7.0 - 0.25, 0.0, 1.0) * uNight; diffuseColor.rgb = mix(diffuseColor.rgb, vec3(dot(diffuseColor.rgb, vec3(0.3, 0.45, 0.25)) * 0.6), rd); }"); };
    const terrain = new THREE.Mesh(geo, tmatG);
    terrain.receiveShadow = true; terrain.castShadow = !wideK; scene.add(terrain); R.terrain = terrain;
    // skirt: a dark ground plane far below so the box edge never shows a void
    const skirt = new THREE.Mesh(new THREE.PlaneGeometry(bw * 6, bh * 6).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x6e6c56 }));
    skirt.position.set(x0 + bw / 2, -0.5, y0 + bh / 2); scene.add(skirt);
    // lights
    const hemi = new THREE.HemisphereLight(0xe6ecf0, 0x6a5a40, 0.62 * Math.PI); scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff2de, 0.78 * Math.PI); sun.castShadow = O.shadows; scene.add(sun); scene.add(sun.target);
    sun.shadow.mapSize.set(O.shadowSize, O.shadowSize); sun.shadow.bias = -0.0006; sun.shadow.normalBias = wideK ? 0.2 : 0.02; sun.shadow.radius = 3;
    R.hemi = hemi; R.sun = sun;
    scene.fog = new THREE.Fog(0xb9bcb0, 100, 1000);
    // rivers: water ribbons on the carved channels
    const wmat = new THREE.MeshStandardMaterial({ color: 0x2f4552, roughness: 0.4, metalness: 0.05, envMap, envMapIntensity: 0.22, side: THREE.DoubleSide, normalMap: wnorm, normalScale: new THREE.Vector2(0.35, 0.35) });
    R.water = [];
    for (const rv of d.rivers || []) {
      const P = rv.pts, n = P.length, w = rv.w * 1.08, vs = [], uv = [], ix = []; let arc = 0;
      // round 2 (critic A "silver foil" on the siege / vicksburg Mississippi): a broad river in a close world tiles the ripple normal map
      // every ~0.9 units instead of once per river width (fine faint ripples, not metre-sized scales); narrow rivers unchanged
      const broad = d.kind !== "wide" && (rv.w || rv.width || 0) >= 2.5, uvK = broad ? w / 0.9 : 1;
      for (let i = 0; i < n; i++) {
        const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)]; let tx = b[0] - a[0], tz = b[1] - a[1]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
        if (i) arc += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
        const y = P[i][2] * ys + 0.002 * exag;
        vs.push(P[i][0] - tz * w / 2, y, P[i][1] + tx * w / 2, P[i][0] + tz * w / 2, y, P[i][1] - tx * w / 2);
        uv.push(arc / w * uvK, 0, arc / w * uvK, uvK);
        if (i) { const k = (i - 1) * 2; ix.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
      }
      const wg = new THREE.BufferGeometry(); wg.setAttribute("position", new THREE.Float32BufferAttribute(vs, 3)); wg.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); wg.setIndex(ix); wg.computeVertexNormals();
      const m = new THREE.Mesh(wg, wmat); m.receiveShadow = true; scene.add(m); R.water.push(m);
      m.userData.ns = broad ? 0.1 : 0.35;
      if (broad) { m.material = wmat.clone(); m.material.roughness = 0.78; m.userData.envK = 0.45; }   // + matte: the specular sheet read as foil   // own material: wmat is shared, its normalScale is set per mesh each frame   // critic A4: broad rivers in close worlds read as foil at 0.35
    }
    R.wmat = wmat;
    // forests (v4): close = massed canopy. The bake raises a ~3 m canopy blanket under every wood (dark crown-speckle texture), and
    // instanced crown CLUSTERS (2-4 merged, displaced lobes, 4 shape variants, log-normal sizes, colour/hue jitter) sit half sunk in it,
    // so a wood reads as one irregular dark mass with a shadowed edge and a broken outline. Hedgerows / lone / garden trees: smaller clusters
    // standing on the ground. Wide: no instanced crowns (the woods are texture + raised canopy).
    // tree record: [x, z, h_m, kind (0 wood, 1 conifer, 2 hedge, 3 lone), scale, colour 0..1, edge 0..1 (wood edge .. deep inside)]
    const trees = d.trees || [], ts = (wideK ? 1.3 : 0.125) * O.treeScale;   // v4: smaller crowns (GM canopy grain is fine)
    const tmat = new THREE.MeshLambertMaterial();
    const dummy = new THREE.Object3D(), col = new THREE.Color(), olive = new THREE.Color(0x5e6648), teal = new THREE.Color(0x345e64);
    const GREENS = [0x314f52, 0x355455, 0x385656, 0x2f4c50, 0x3a5657, 0x324f51, 0x3b5858, 0x2f5052];   // v6: teal (R -10 %, B +12 %)   // v5: renders GM's teal woods ~(51-58, 68-78, 64-72) (no upward normal bias any more)
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
    if (crowns.length && !wideK) {
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
          col.multiplyScalar((0.9 + hash(j, 10) * 0.16) * (wood ? 0.73 + 0.06 * e : 0.72)); im.setColorAt(i, col); });   // v7: x0.88
        R.scene.add(im); R.trees.push(im); });
    }
    if (pines.length && !wideK) {
      const pg = new THREE.ConeGeometry(0.75, 2.6, 7); pg.translate(0, 1.3, 0);
      const im = new THREE.InstancedMesh(pg, tmat, pines.length); im.castShadow = true; im.receiveShadow = true;
      pines.forEach((q, i) => { const s = ts * q[4] * 0.8; dummy.position.set(q[0], heightAt(R, q[0], q[1]) - s * 0.6, q[1]); dummy.rotation.set(0, hash(i, 11) * 6.28, 0); dummy.scale.set(s, s, s); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix);
        col.setHex(0x3a5650).multiplyScalar(0.8 + hash(i, 12) * 0.3); im.setColorAt(i, col); });
      scene.add(im);
    }
    // villages: box houses + gable roofs
    const hs = d.houses || [];
    if (hs.length) {
      const wallG = new THREE.BoxGeometry(1, 1, 1); wallG.translate(0, 0.5, 0);
      const walls = new THREE.InstancedMesh(wallG, new THREE.MeshLambertMaterial(), hs.length);
      const roofs = new THREE.InstancedMesh(roofGeometry(), new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }), hs.length);
      walls.castShadow = roofs.castShadow = true; walls.receiveShadow = roofs.receiveShadow = true;
      // v4 roofs: GM's varied tile reds / oranges, some brown and slate; kind 1 = church nave (taller), 2 = church tower (tall, steep roof)
      const WALL = [0xe0d6c0, 0xd4c8ac, 0xcabd9f, 0xe8e0cc], ROOF = [0xc4593a, 0xb8533a, 0xcc6844, 0xa84a34, 0x8e5a40, 0x6c6a68, 0xd27a4c];
      // critics A2/B (round 1): on the wide map red roofs read as Confederate units: muted brown-slate roofs, 0.65x footprint
      if (wideK) ROOF.splice(0, ROOF.length, 0x7a5c4c, 0x6e5446, 0x806a58, 0x5c5652, 0x6a6460, 0x74604e, 0x5e584e);
      const wh = wideK ? 0.34 : 0.055, rh = wideK ? 0.3 : 0.05, hk = wideK ? 0.65 : 1.0;   // v5: close houses smaller (plan x0.62 in the bake)
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
    // timber trestle bridges (features.bridges: {x, z, angle, len, wl, deck} metres for wl/deck): deck, rails, bents; burns at features[region].bridges[i].burn
    // (the two centre spans fall, the rest is charred). Any number per region; FO.bridges[i] = { burn: t } or { hidden: true }.
    R.bridges = F.bridges.map((b, bi) => {
      const grp = new THREE.Group(), wood = new THREE.MeshStandardMaterial({ color: 0x6a4c32, roughness: 0.9 });
      const deckY = b.deck * ys, wl = b.wl * ys, L = b.len, span = [];
      const nSeg = b.spans || 6;
      for (let k = 0; k < nSeg; k++) {
        const seg = new THREE.Mesh(new THREE.BoxGeometry(L / nSeg * 1.01, 0.045, 0.2), wood); seg.position.set(-L / 2 + (k + 0.5) * L / nSeg, deckY, 0); seg.castShadow = seg.receiveShadow = true; grp.add(seg); span.push(seg);
        for (const sz of [-0.05, 0.05]) { const rail = new THREE.Mesh(new THREE.BoxGeometry(L / nSeg, 0.012, 0.012), new THREE.MeshStandardMaterial({ color: 0x2c2a28, roughness: 0.6, metalness: 0.4 })); rail.position.set(-L / 2 + (k + 0.5) * L / nSeg, deckY + 0.024, sz); grp.add(rail); seg.userData.rails = (seg.userData.rails || []).concat(rail); }
      }
      for (let k = 0; k <= nSeg; k++) { const x = -L / 2 + k * L / nSeg, hgt = deckY - wl + 0.12;
        for (const sz of [-0.08, 0.08]) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.03, hgt, 0.03), wood); p.position.set(x, wl - 0.1 + hgt / 2, sz); p.castShadow = true; grp.add(p); }
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.24), wood); cap.position.set(x, deckY - 0.025, 0); grp.add(cap); }
      grp.position.set(b.x, 0, b.z); grp.rotation.y = -b.angle; scene.add(grp);
      const fo = (FO.bridges || [])[bi] || {}; grp.visible = !fo.hidden;
      return { grp, span, wood, nSeg, burnT: fo.burn ?? null };
    });
    R.bridge = R.bridges[0] || null;
    // earthworks (features.works: [{kind, pts:[[x,y],...], closed?}]): an extruded earth parapet (firing step behind, steep inner face, sloping
    // glacis in FRONT = the right-hand side walking along pts) that catches the sun and casts a shadow; the bake paints ditch + spoil.
    // kind "breastwork" (the clip's v5 profile), "fort" / "redan" / "lunette" (taller, wider: the Vicksburg siege forts), "rifle" (low rifle pits)
    const PROF = { breastwork: [[-0.15, -0.012], [-0.06, 0.062], [0.02, 0.07], [0.18, -0.012]], fort: [[-0.24, -0.015], [-0.1, 0.12], [0.04, 0.13], [0.34, -0.015]],
      rifle: [[-0.08, -0.01], [-0.03, 0.035], [0.01, 0.038], [0.1, -0.01]] };
    R.works = F.works.map((wk) => {
      const L0 = wk.pts || wk, L = wk.closed ? L0.concat([L0[0]]) : L0, prof = wk.profile || PROF[wk.kind] || PROF[{ redan: "fort", lunette: "fort", redoubt: "fort", earthwork: "breastwork", pits: "rifle" }[wk.kind]] || PROF.breastwork, pos = [], idx = [], np = prof.length;
      // height_m (bundle): scale the profile so its crest stands that many metres above the ground (in exaggerated world units)
      const hk = wk.height_m ? (wk.height_m * ys) / Math.max(...prof.map((q) => q[1])) : 1, prof2 = prof.map(([o, hy]) => [o, hy > 0 ? hy * hk : hy]);
      for (let i = 0; i < L.length; i++) {
        const a = L[Math.max(0, i - 1)], b = L[Math.min(L.length - 1, i + 1)]; let tx = b[0] - a[0], tz = b[1] - a[1]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
        const nx = tz, nz = -tx;   // front normal (right-hand side of the walking direction; the clip's line runs north -> south and faces east)
        for (const [o, hy] of prof2) { const x = L[i][0] + nx * o, z = L[i][1] + nz * o; pos.push(x, heightAt(R, x, z) + hy, z); }
        if (i) { const k = (i - 1) * np; for (let j = 0; j < np - 1; j++) idx.push(k + j, k + j + np, k + j + 1, k + j + 1, k + j + np, k + j + np + 1); }
      }
      let pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); pg.setIndex(idx); pg = pg.toNonIndexed(); pg.computeVertexNormals();
      { const col = [], P = pg.attributes.position, Nn = pg.attributes.normal; for (let i = 0; i < P.count; i++) { const up = Nn.getY(i);   // v6: pale raw-earth top, darker faces
          const c = new THREE.Color(up > 0.9 ? 0xa48a64 : 0x75603f); col.push(c.r, c.g, c.b); } pg.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); }
      const par = new THREE.Mesh(pg, new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide })); par.castShadow = par.receiveShadow = true;
      scene.add(par); return par;
    });
    R.parapet = R.works[0] || null;
    // pontoon / raft bridges (features.pontoons: {x, z, angle, len, wl}): dark boats under a plank deck. Shown from features[region].pontoons[k].at
    // (unrolls over 0.7 s; at <= 0 or missing entry = there from the start; { hidden: true } = never)
    { const PT = FO.pontoons || [];
      R.pontoons = F.pontoons.map((pb, k) => {
        const g = new THREE.Group(), wl = pb.wl * ys + 0.002 * exag, len = pb.len, nb = Math.max(4, Math.round(len / 0.11));
        const boat = new THREE.MeshLambertMaterial({ color: 0x221e1a }), plank = new THREE.MeshLambertMaterial({ color: 0xc2a77e });   // v6: dark boats, pale plank deck, 2x wider
        for (let j = 0; j < nb; j++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.07), boat); b.position.set(0, 0.004, -len / 2 + (j + 0.5) * len / nb); b.castShadow = true; g.add(b); }
        const deck = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.014, len + 0.2), plank); deck.position.y = 0.026; deck.castShadow = deck.receiveShadow = true; g.add(deck);
        for (const sx of [-0.104, 0.104]) { const rail = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.018, len + 0.14), boat); rail.position.set(sx, 0.036, 0); g.add(rail); }
        g.position.set(pb.x, wl, pb.z); g.rotation.y = pb.angle; scene.add(g); const po = PT[k] || {}; return { g, k, at: po.hidden ? 1e9 : (po.at ?? -1) };
      });
    }
    regions[name] = R;
  }

  world.heightAt = (x, z, region) => heightAt(regions[region || world.region || names[0]], x, z);
  world.kindOf = kindOf; world.names = names;
  world.ready = Promise.all(names.map(buildRegion)).then(() => { world.update(0); return world; });

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
  const WIDEWATER = new THREE.Color(0x587080);   // v7: the wide river reads as a filled blue-grey band
  const HAZE = new THREE.Color(0xb9bcb4);   // v7: lighter, warmer (the far band must be lighter than the near ground)   // v6: depth haze back at ~half (critic B 3)   // round 2: bluer, his blue-grey atmospheric cast
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
    const wk = R.kind === "wide" ? 1 : 0;   // clip critic: stronger relief on the wide map (more sun, less sky fill)
    R.sun.color.copy(DAY.sun).lerp(NIGHT.sun, n); R.sun.intensity = lerp(DAY.sunI, NIGHT.sunI, n) * (1 + 0.35 * wk * (1 - n));
    R.hemi.color.copy(DAY.sky).lerp(NIGHT.sky, n); R.hemi.groundColor.copy(DAY.gnd).lerp(NIGHT.gnd, n); R.hemi.intensity = lerp(DAY.hemiI, NIGHT.hemiI, n) * (1 - 0.3 * wk * (1 - n));
    // v4 haze: on the oblique close camera the far ground fades into a pale sky-blue haze (GM 640-700 / 800 / 910-950 s):
    // smoothstep over view depth 0.78 d .. 2.3 d -> ~0 at the frame centre, ~0.45 at the top edge (tilt 52, fov 30)
    const cl = R.kind === "wide" ? 0 : 1;
    R.scene.fog.color.copy(cl ? HAZE : DAY.fog).lerp(NIGHT.fog, n); R.scene.fog.near = sd * (cl ? 0.9 : 1.25); R.scene.fog.far = sd * (cl ? 2.6 : 8.0);   // v5: half the wide haze; close top edge ~0.2 (his top band keeps full contrast)
    R.terrain.material.userData.uNight.value = n;
    R.wmat.color.copy(R.kind === "wide" ? WIDEWATER : DAY.water).lerp(NIGHT.water, n); R.wmat.envMapIntensity = lerp(0.22, 0.1, n);
    renderer.setClearColor(R.scene.fog.color);
    // water motion: normal map drifts downstream
    wnorm.repeat.set(1, 1); wnorm.offset.set(-t * 0.12, Math.sin(t * 0.7) * 0.03);
    R.water.forEach((m) => { const s = m.userData.ns ?? 0.35; m.material.normalScale.set(s, s);
      if (m.material !== R.wmat) { m.material.color.copy(R.wmat.color); m.material.envMapIntensity = R.wmat.envMapIntensity * (m.userData.envK ?? 1); } });   // clones follow day / night
    // bridge burn: centre spans gone, the rest charred
    for (const B of R.bridges) { const burnt = B.burnT != null && t >= B.burnT, m0 = Math.floor((B.nSeg - 1) / 2), m1 = Math.ceil((B.nSeg - 1) / 2);   // the centre span(s) fall
      B.span.forEach((s, k) => { const mid = k >= m0 && k <= m1; s.visible = !(burnt && mid); (s.userData.rails || []).forEach((r) => (r.visible = s.visible)); });
      B.wood.color.setHex(burnt ? 0x2b2118 : 0x6a4c32); }
    if (R.pontoons) for (const p of R.pontoons) { const k = p.at < 0 ? 1 : clamp((t - p.at) / 0.7, 0, 1); p.g.visible = k > 0.001; p.g.scale.set(1, 1, Math.max(0.001, k)); }
    world.scene = R.scene;
    if (o.beforeRender) o.beforeRender(world, t, R);
    renderer.render(R.scene, camera);
    for (const f of hooks) f(world, t);
  };

  // ---------------- overlay hook ----------------
  const pv = new THREE.Vector3();
  world.projectMap = (x, y, h = 0) => {
    const R = regions[world.region || names[0]]; if (!R) return { x: 0, y: 0, visible: false };
    pv.set(x, heightAt(R, x, y) + h, y); const dist = pv.distanceTo(camera.position); pv.project(camera);
    const ppu = O.height / (2 * Math.tan((camera.fov * Math.PI) / 360) * dist);   // screen px per world unit at that point
    return { x: ((pv.x + 1) / 2) * O.width, y: ((1 - pv.y) / 2) * O.height, depth: pv.z, visible: pv.z > -1 && pv.z < 1 && Math.abs(pv.x) < 1.2 && Math.abs(pv.y) < 1.2, ppu };
  };
  world.project = (lat, lon, h = 0) => { const [x, y] = latLonToMap(lat, lon, D.geo); return world.projectMap(x, y, h); };
  world.latLonToMap = (lat, lon) => latLonToMap(lat, lon, D.geo);
  world.mapToLatLon = (x, y) => mapToLatLon(x, y, D.geo);

  world.worldPos = (x, y, h = 0, region) => { const R = regions[region || world.region || names[0]]; return new THREE.Vector3(x, (R ? heightAt(R, x, y) : 0) + h, y); };
  world.addToScene = (obj, region) => regions[region].scene.add(obj);
  return world;
}
