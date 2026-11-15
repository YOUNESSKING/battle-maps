// gm3d/fx/fx.js -- deterministic 3D smoke, fire, clouds and campfires for three.js.
//
// Every effect is a pure function of timeline time t: emitters precompute a seeded
// spawn list at creation, and fx.update(t) evaluates the particles alive at t from
// that list (no frame-to-frame state, no Math.random, no requestAnimationFrame).
// Seek to any t in any order and the frame is identical.
//
//   import { createFX } from './fx.js';
//   const fx = createFX({ scene, camera, renderer, unitsPerMeter: 1, wind: [6, 2] });
//   fx.smokeLine([[x,y,z],...], t0, t1, opts);  fx.cannon([x,y,z], tBurst, opts);
//   fx.fire([x,y,z], t0, t1, opts);  fx.campfire([x,y,z], opts);  fx.clouds(opts);
//   fx.patchGround(terrainMaterial);   // cloud shadows + firelight pools on the ground
//   fx.update(t); renderer.render(scene, camera);
//
// See README.md for the API, sources and licences.

import * as THREE from 'three';

// ---------------------------------------------------------------- seeded helpers
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash1(i, s) { // integer hash -> [0,1)
  let h = (Math.imul(i | 0, 374761393) + Math.imul(s | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
function lowerBound(arr, n, v) { let lo = 0, hi = n; while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m] < v) lo = m + 1; else hi = m; } return lo; }
// deterministic flicker in [0,1], smooth
function flicker(t, ph) {
  return clamp01(0.62 + 0.18 * Math.sin(t * 11.3 + ph) + 0.12 * Math.sin(t * 23.9 + ph * 2.1) + 0.08 * Math.sin(t * 5.7 + ph * 3.7));
}

// ---------------------------------------------------------------- procedural textures
// 2D value-noise fbm for the sprite atlas
function makeNoise2(seed) {
  const P = 256, g = new Float32Array(P * P), r = mulberry32(seed);
  for (let i = 0; i < g.length; i++) g[i] = r();
  const n = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = g[((yi & 255) << 8) | (xi & 255)], b = g[((yi & 255) << 8) | ((xi + 1) & 255)];
    const c = g[(((yi + 1) & 255) << 8) | (xi & 255)], d = g[(((yi + 1) & 255) << 8) | ((xi + 1) & 255)];
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  return (x, y, oct = 5) => { let s = 0, a = 0.5, f = 1, w = 0; for (let o = 0; o < oct; o++) { s += a * n(x * f, y * f); w += a; a *= 0.5; f *= 2.03; } return s / w; };
}

// Atlas 4x2 cells of 256 px. Cells 0-3: smoke puffs (RGB = packed normal, A = density).
// 4,5: flame tongues (R = core heat, A = alpha). 6: soft glow. 7: spark.
function makeAtlas(seed) {
  const C = 256, W = C * 4, H = C * 2, data = new Uint8Array(W * H * 4);
  const fbm = makeNoise2(seed);
  const h = new Float32Array(C * C);
  for (let cell = 0; cell < 8; cell++) {
    const cx0 = (cell % 4) * C, cy0 = Math.floor(cell / 4) * C, rnd = mulberry32(seed * 31 + cell * 977);
    if (cell < 4) {
      // cauliflower puff: soft union of spherical caps, eroded by fbm
      const blobs = [];
      const nb = 6 + Math.floor(rnd() * 4);
      for (let b = 0; b < nb; b++) {
        const ang = rnd() * Math.PI * 2, d = b === 0 ? 0 : 0.08 + rnd() * 0.17;
        blobs.push([0.5 + Math.cos(ang) * d, 0.5 + Math.sin(ang) * d, b === 0 ? 0.27 : 0.12 + rnd() * 0.12]);
      }
      const ox = rnd() * 50, oy = rnd() * 50;
      for (let y = 0; y < C; y++) for (let x = 0; x < C; x++) {
        const u = (x + 0.5) / C, v = (y + 0.5) / C;
        let s = 0;
        for (const [bx, by, br] of blobs) {
          const dd = ((u - bx) ** 2 + (v - by) ** 2) / (br * br);
          if (dd < 1) s += Math.sqrt(1 - dd) * br;
        }
        const nz = fbm(u * 7 + ox, v * 7 + oy, 5);
        let hv = s * (0.55 + 0.9 * nz) - 0.035;
        const rr = Math.hypot(u - 0.5, v - 0.5);
        hv *= smooth(0.5, 0.36, rr);
        h[y * C + x] = Math.max(0, hv);
      }
      for (let y = 0; y < C; y++) for (let x = 0; x < C; x++) {
        const i = y * C + x;
        const hx = h[y * C + Math.min(C - 1, x + 1)] - h[y * C + Math.max(0, x - 1)];
        const hy = h[Math.min(C - 1, y + 1) * C + x] - h[Math.max(0, y - 1) * C + x];
        const k = C * 0.9;
        let nx = -hx * k, ny = -hy * k, nz = 1; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
        const dens = smooth(0.0, 0.09, h[i]);
        const o = ((cy0 + y) * W + cx0 + x) * 4;
        data[o] = (nx * 0.5 + 0.5) * 255; data[o + 1] = (ny * 0.5 + 0.5) * 255; data[o + 2] = (nz * 0.5 + 0.5) * 255; data[o + 3] = dens * 255;
      }
    } else if (cell < 6) {
      const ox = rnd() * 80, oy = rnd() * 80;
      for (let y = 0; y < C; y++) for (let x = 0; x < C; x++) {
        const u = (x + 0.5) / C, v = (y + 0.5) / C; // v = 0 bottom
        const nz = fbm(u * 5 + ox, v * 4 - oy, 4);
        const xx = (u - 0.5) + (nz - 0.5) * 0.22 * v;
        const width = 0.30 * Math.pow(1 - v, 0.7) * Math.pow(smooth(0.0, 0.35, v), 0.5) + 0.02;
        const shape = smooth(1.0, 0.55, Math.abs(xx) / width) * smooth(0.0, 0.1, v) * smooth(1.0, 0.75, v + (nz - 0.5) * 0.4);
        const core = smooth(0.6, 0.0, Math.abs(xx) / width) * smooth(0.95, 0.2, v);
        const o = ((cy0 + y) * W + cx0 + x) * 4;
        data[o] = clamp01(core) * 255; data[o + 1] = 0; data[o + 2] = 0; data[o + 3] = clamp01(shape * (0.6 + 0.6 * nz)) * 255;
      }
    } else {
      const k = cell === 6 ? 7.0 : 60.0;
      for (let y = 0; y < C; y++) for (let x = 0; x < C; x++) {
        const u = (x + 0.5) / C - 0.5, v = (y + 0.5) / C - 0.5, r2 = (u * u + v * v) * 4;
        let a = Math.exp(-r2 * k) * smooth(1.0, 0.85, Math.sqrt(r2));
        if (cell === 6) a = 0.75 * a + 0.25 * Math.exp(-r2 * 40);
        const o = ((cy0 + y) * W + cx0 + x) * 4;
        data[o] = 255 * Math.exp(-r2 * k * 3); data[o + 3] = clamp01(a) * 255;
      }
    }
  }
  const tex = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  tex.magFilter = THREE.LinearFilter; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.generateMipmaps = true;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping; tex.needsUpdate = true;
  return tex;
}

// Tileable 3D noise for the clouds: R = perlin-worley style base, G = worley fbm detail.
function makeCloudNoise3D(N, seed) {
  const rnd = mulberry32(seed);
  const lattices = [];
  function valueNoiseTile(P) {
    const g = new Float32Array(P * P * P); for (let i = 0; i < g.length; i++) g[i] = rnd();
    return (x, y, z) => {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
      const xf = x - xi, yf = y - yi, zf = z - zi;
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
      const m = (a) => ((a % P) + P) % P;
      const X0 = m(xi), X1 = m(xi + 1), Y0 = m(yi), Y1 = m(yi + 1), Z0 = m(zi), Z1 = m(zi + 1);
      const G = (X, Y, Z) => g[(Z * P + Y) * P + X];
      const a = G(X0, Y0, Z0) + (G(X1, Y0, Z0) - G(X0, Y0, Z0)) * u;
      const b = G(X0, Y1, Z0) + (G(X1, Y1, Z0) - G(X0, Y1, Z0)) * u;
      const c = G(X0, Y0, Z1) + (G(X1, Y0, Z1) - G(X0, Y0, Z1)) * u;
      const d = G(X0, Y1, Z1) + (G(X1, Y1, Z1) - G(X0, Y1, Z1)) * u;
      const e = a + (b - a) * v, f = c + (d - c) * v;
      return e + (f - e) * w;
    };
  }
  function worleyTile(C) {
    const pts = new Float32Array(C * C * C * 3); for (let i = 0; i < pts.length; i++) pts[i] = rnd();
    return (x, y, z) => { // x,y,z in [0,1)
      const fx = x * C, fy = y * C, fz = z * C, cx = Math.floor(fx), cy = Math.floor(fy), cz = Math.floor(fz);
      let best = 9;
      for (let dz = -1; dz <= 1; dz++) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const X = cx + dx, Y = cy + dy, Z = cz + dz;
        const wx = ((X % C) + C) % C, wy = ((Y % C) + C) % C, wz = ((Z % C) + C) % C;
        const k = ((wz * C + wy) * C + wx) * 3;
        const px = X + pts[k], py = Y + pts[k + 1], pz = Z + pts[k + 2];
        const d = (px - fx) ** 2 + (py - fy) ** 2 + (pz - fz) ** 2;
        if (d < best) best = d;
      }
      return Math.min(1, Math.sqrt(best));
    };
  }
  const v4 = valueNoiseTile(4), v8 = valueNoiseTile(8), v16 = valueNoiseTile(16), v32 = valueNoiseTile(32);
  const w3 = worleyTile(3), w6 = worleyTile(6), w12 = worleyTile(12), w24 = worleyTile(24);
  const data = new Uint8Array(N * N * N * 4);
  for (let z = 0; z < N; z++) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const u = x / N, v = y / N, w = z / N;
    const perlin = (v4(u * 4, v * 4, w * 4) * 0.5 + v8(u * 8, v * 8, w * 8) * 0.28 + v16(u * 16, v * 16, w * 16) * 0.14 + v32(u * 32, v * 32, w * 32) * 0.08);
    const wor = 1 - (w3(u, v, w) * 0.6 + w6(u, v, w) * 0.3 + w12(u, v, w) * 0.1);
    // perlin-worley: remap perlin by the inverted worley (billowy shapes)
    let base = clamp01((perlin - (1 - wor) * 0.55) / (1 - (1 - wor) * 0.55));
    base = clamp01(base * 1.15 - 0.05);
    const det = 1 - (w6(u, v, w) * 0.5 + w12(u, v, w) * 0.3 + w24(u, v, w) * 0.2);
    const o = ((z * N + y) * N + x) * 4;
    data[o] = base * 255; data[o + 1] = clamp01(det) * 255; data[o + 2] = perlin * 255; data[o + 3] = 255;
  }
  const tex = new THREE.Data3DTexture(data, N, N, N);
  tex.format = THREE.RGBAFormat; tex.type = THREE.UnsignedByteType;
  tex.minFilter = tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = tex.wrapR = THREE.RepeatWrapping;
  tex.unpackAlignment = 1; tex.needsUpdate = true;
  return tex;
}

// ---------------------------------------------------------------- GLSL shared by clouds + ground
const CLOUD_GLSL = /* glsl */`
uniform highp sampler3D fxCloudTex;
uniform vec4 fxCloudP;      // base, top, 1/tile, coverage
uniform vec4 fxCloudQ;      // density, detail amount, shadow strength, enabled
uniform vec3 fxCloudWind;   // wind offset in tile space
uniform vec3 fxSunDir;
float fxCloudDensity(vec3 p, bool detail) {
  float h = (p.y - fxCloudP.x) / (fxCloudP.y - fxCloudP.x);
  if (h <= 0.0 || h >= 1.0) return 0.0;
  vec3 q = vec3(p.x, p.y * 0.6, p.z) * fxCloudP.z + fxCloudWind;
  vec4 n = texture(fxCloudTex, q);
  float base = clamp((n.r * 0.75 + texture(fxCloudTex, q * 0.31 + 0.17).b * 0.45 - 0.25) / 0.55, 0.0, 1.0);
  // flat-ish bottoms, rounded (narrower) tops
  float prof = smoothstep(0.0, 0.07, h) * mix(1.0, smoothstep(1.0, 0.35, h), 0.85);
  float cov = fxCloudP.w;
  float d = (base * mix(prof, 1.0, 0.25) - (1.0 - cov) * 0.72 - h * 0.12) / 0.10;   // clip: crisper cloud edges
  d *= prof;
  if (detail && d > -0.2) {
    float det = texture(fxCloudTex, q * 6.3 + vec3(0.0, fxCloudWind.x * 2.0, 0.0)).g;
    d -= (det - 0.28) * fxCloudQ.y * 4.0 * (1.0 - clamp(d, 0.0, 1.0) * 0.55);
  }
  return clamp(d, 0.0, 1.0) * fxCloudQ.x;
}
`;

// ---------------------------------------------------------------- sprite batch (one sorted draw call)
const SPRITE_VS = /* glsl */`
attribute vec4 iA; // world pos, size
attribute vec4 iB; // rotation, alpha, cell, mode (0 lit smoke, 1 emissive additive)
attribute vec4 iC; // tint rgb, ground height
uniform vec3 uCamRight; uniform vec3 uCamUp;
varying vec2 vUv; varying vec4 vB; varying vec3 vCol; varying vec3 vTx; varying vec3 vTy;
varying vec3 vW; varying float vSoft;
void main() {
  float c = cos(iB.x), s = sin(iB.x);
  vec2 q = vec2(c * position.x - s * position.y, s * position.x + c * position.y);
  vec3 wp = iA.xyz + (uCamRight * q.x + uCamUp * q.y) * iA.w;
  vW = wp;
  vTx = uCamRight * c + uCamUp * s;
  vTy = -uCamRight * s + uCamUp * c;
  float cell = iB.z;
  vec2 o = vec2(mod(cell, 4.0), floor(cell / 4.0));
  vUv = (o + (uv * 0.98 + 0.01)) / vec2(4.0, 2.0);
  vB = iB; vCol = iC.rgb;
  // soft intersection with the ground: fade the part of the quad below ground + a band above it
  vSoft = (wp.y - iC.w) / max(iA.w * 0.22, 1e-3);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}
`;
const SPRITE_FS = /* glsl */`
uniform sampler2D uAtlas;
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uShadeCol; uniform vec3 uCamBack;
uniform float uScatter;
varying vec2 vUv; varying vec4 vB; varying vec3 vCol; varying vec3 vTx; varying vec3 vTy;
varying vec3 vW; varying float vSoft;
vec3 fxOut(vec3 c) {
#ifdef TONE_MAPPING
  c = toneMapping(c);
#endif
  return linearToOutputTexel(vec4(c, 1.0)).rgb;
}
void main() {
  float haze = step(2.5, vB.w);
  vec4 tx = haze > 0.5 ? texture2D(uAtlas, vUv, 2.6) : texture2D(uAtlas, vUv);
  float soft = clamp(vSoft, 0.0, 1.0);
  if (vB.w > 1.5 && vB.w < 2.5) { // flat unlit (snow flakes)
    float a = tx.a * vB.y;
    if (a < 0.003) discard;
    gl_FragColor = vec4(fxOut(vCol) * a, a);
  } else if (vB.w < 0.5 || haze > 0.5) {
    float dens = haze > 0.5 ? smoothstep(0.02, 0.75, tx.a) : tx.a;
    vec3 n = normalize(vTx * (tx.r * 2.0 - 1.0) + vTy * (tx.g * 2.0 - 1.0) + uCamBack * (tx.b * 2.0 - 1.0));
    float ndl = dot(n, uSunDir) * (haze > 0.5 ? 0.45 : 1.0) + (haze > 0.5 ? 0.2 : 0.0);
    float lit = clamp(ndl * 0.55 + 0.45, 0.0, 1.0);
    lit = lit * lit * (3.0 - 2.0 * lit);
    vec3 col = mix(uShadeCol, uSunCol, lit) * vCol;
    vec3 V = normalize(cameraPosition - vW);
    float fwd = pow(max(dot(-V, uSunDir), 0.0), 6.0) * (1.0 - dens) * uScatter;
    col += uSunCol * fwd * vCol;
    float a = dens * vB.y * soft;
    if (a < 0.003) discard;
    gl_FragColor = vec4(fxOut(col) * a, a);
  } else {
    float a = tx.a * vB.y * mix(1.0, soft, 0.6);
    if (a < 0.003) discard;
    vec3 col = vCol * (0.55 + 0.9 * tx.r);
    gl_FragColor = vec4(fxOut(col) * a, 0.0); // alpha 0 -> purely additive under premultiplied blending
  }
}
`;

class SpriteBatch {
  constructor(cap, atlas, uniforms) {
    this.cap = cap; this.n = 0;
    this.stage = new Float32Array(cap * 12);
    this.depth = new Float32Array(cap);
    this.order = new Uint32Array(cap);
    const g = new THREE.InstancedBufferGeometry();
    const quad = new THREE.PlaneGeometry(1, 1);
    g.index = quad.index; g.setAttribute('position', quad.attributes.position); g.setAttribute('uv', quad.attributes.uv);
    this.aA = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4).setUsage(THREE.DynamicDrawUsage);
    this.aB = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4).setUsage(THREE.DynamicDrawUsage);
    this.aC = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4).setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('iA', this.aA); g.setAttribute('iB', this.aB); g.setAttribute('iC', this.aC);
    g.instanceCount = 0;
    this.geometry = g;
    this.material = new THREE.ShaderMaterial({
      vertexShader: SPRITE_VS, fragmentShader: SPRITE_FS,
      uniforms: Object.assign({ uAtlas: { value: atlas } }, uniforms),
      transparent: true, depthWrite: false, depthTest: true,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    });
    this.mesh = new THREE.Mesh(g, this.material);
    this.mesh.frustumCulled = false; this.mesh.renderOrder = 10;
  }
  clear() { this.n = 0; }
  push(x, y, z, size, rot, alpha, cell, mode, r, g, b, ground) {
    if (this.n >= this.cap || alpha <= 0.002 || size <= 0) return;
    const o = this.n * 12, s = this.stage;
    s[o] = x; s[o + 1] = y; s[o + 2] = z; s[o + 3] = size;
    s[o + 4] = rot; s[o + 5] = alpha; s[o + 6] = cell; s[o + 7] = mode;
    s[o + 8] = r; s[o + 9] = g; s[o + 10] = b; s[o + 11] = ground;
    this.n++;
  }
  flush(camera) {
    const n = this.n, s = this.stage, e = camera.matrixWorld.elements;
    const cx = e[12], cy = e[13], cz = e[14], fx = -e[8], fy = -e[9], fz = -e[10];
    for (let i = 0; i < n; i++) { const o = i * 12; this.depth[i] = (s[o] - cx) * fx + (s[o + 1] - cy) * fy + (s[o + 2] - cz) * fz; this.order[i] = i; }
    const dep = this.depth;
    const ord = this.order.subarray(0, n);
    ord.sort((a, b) => dep[b] - dep[a] || a - b); // far to near, stable tie-break
    const A = this.aA.array, B = this.aB.array, C = this.aC.array;
    for (let k = 0; k < n; k++) {
      const o = ord[k] * 12, j = k * 4;
      A[j] = s[o]; A[j + 1] = s[o + 1]; A[j + 2] = s[o + 2]; A[j + 3] = s[o + 3];
      B[j] = s[o + 4]; B[j + 1] = s[o + 5]; B[j + 2] = s[o + 6]; B[j + 3] = s[o + 7];
      C[j] = s[o + 8]; C[j + 1] = s[o + 9]; C[j + 2] = s[o + 10]; C[j + 3] = s[o + 11];
    }
    for (const a of [this.aA, this.aB, this.aC]) { a.clearUpdateRanges(); a.addUpdateRange(0, Math.max(1, n) * 4); a.needsUpdate = true; }
    this.geometry.instanceCount = n;
  }
}

// ---------------------------------------------------------------- particle store
// A spawn list sorted by birth time; per-particle parameters in flat arrays.
class Spawns {
  constructor(list, maxLife, fields) {
    list.sort((a, b) => a.t - b.t);
    this.n = list.length; this.maxLife = maxLife;
    this.t = new Float64Array(this.n);
    for (let i = 0; i < this.n; i++) this.t[i] = list[i].t;
    for (const f of fields) { const arr = new Float32Array(this.n); for (let i = 0; i < this.n; i++) arr[i] = list[i][f] ?? 0; this[f] = arr; }
  }
  range(t) { return [lowerBound(this.t, this.n, t - this.maxLife), lowerBound(this.t, this.n, t + 1e-9)]; }
}
const SMOKE_FIELDS = ['mode', 'x', 'y', 'z', 'vx', 'vy', 'vz', 'k', 'rise', 'wk', 'turb', 'ph', 's0', 'grow', 'life', 'a0', 'rot', 'spin', 'cell', 'r', 'g', 'b', 'gy', 'fin'];

// Smoke looks. 'gm' = Grand Maneuver (France 1814): soft, translucent, cool blue-grey haze plumes
// that rise and drift; 'billow' = dense sunlit white cauliflower powder smoke (Borodino paintings).
const LOOKS = {
  gm:     { tint: [0.66, 0.66, 0.67], alpha: 0.15, s0: 4.2, grow: 7.0, rise: 1.0, turb: 3.0, life: 16, mode: 3 },   // clip: greyer, thinner
  billow: { tint: [0.93, 0.93, 0.92], alpha: 0.50, s0: 3.2, grow: 5.8, rise: 0.35, turb: 2.2, life: 16, mode: 0 },
};

// ---------------------------------------------------------------- main factory
export function createFX(cfg = {}) {
  const scene = cfg.scene, renderer = cfg.renderer;
  let camera = cfg.camera;
  const U = cfg.unitsPerMeter ?? 1;              // world units per metre
  const S = (cfg.fxScale ?? 1) * U;              // size multiplier (exaggeration for map scale)
  const seed = cfg.seed ?? 1812;
  const duration = cfg.duration ?? 120;
  const heightAt = cfg.heightAt || (() => 0);
  const wind = new THREE.Vector2(...(cfg.wind || [5, 1.5])).multiplyScalar(U); // units / s
  const sunDir = new THREE.Vector3(...(cfg.sunDir || [0.55, 0.62, 0.35])).normalize();
  let seedCounter = 0;
  const nextSeed = () => (seed * 7919 + (++seedCounter) * 104729) | 0;

  const atlas = makeAtlas(seed);
  const spriteU = {
    uCamRight: { value: new THREE.Vector3() }, uCamUp: { value: new THREE.Vector3() }, uCamBack: { value: new THREE.Vector3() },
    uSunDir: { value: sunDir }, uSunCol: { value: new THREE.Color(1.0, 0.95, 0.86) }, uShadeCol: { value: new THREE.Color(0.50, 0.53, 0.60) },
    uScatter: { value: 0.6 },
  };
  const batch = new SpriteBatch(cfg.maxSprites ?? 24000, atlas, spriteU);
  scene.add(batch.mesh);

  // shared uniforms for clouds / cloud shadows / light pools
  const MAXPOOL = 24;
  const shared = {
    fxCloudTex: { value: null }, fxCloudP: { value: new THREE.Vector4(900 * U, 1350 * U, 1 / (6000 * U), 0.45) },
    fxCloudQ: { value: new THREE.Vector4(1, 0.35, 0.0, 0) }, fxCloudWind: { value: new THREE.Vector3() },
    fxSunDir: { value: sunDir },
    fxPoolPos: { value: Array.from({ length: MAXPOOL }, () => new THREE.Vector4()) },
    fxPoolCol: { value: Array.from({ length: MAXPOOL }, () => new THREE.Vector4()) },
    fxPoolN: { value: 0 },
  };

  const emitters = [];   // { update(t, batch, ctx) }
  const pools = [];      // per-frame light pools {x,y,z,r,cr,cg,cb,i}
  const lights = [];     // { light, fn(t) }
  let night = 0;

  // ---------------- generic smoke particle evaluation
  function evalSmoke(P, i, age) {
    const life = P.life[i]; if (age >= life || age < 0) return;
    const k = P.k[i], e = k > 0 ? (1 - Math.exp(-k * age)) / k : age;
    let x = P.x[i] + P.vx[i] * e, y = P.y[i] + P.vy[i] * e, z = P.z[i] + P.vz[i] * e;
    y += P.rise[i] * Math.pow(age, 0.85);
    const wf = P.wk[i] * age; x += wind.x * wf; z += wind.y * wf;
    const ph = P.ph[i], ta = Math.sqrt(age) * P.turb[i];
    x += Math.sin(age * 0.71 + ph) * ta; z += Math.sin(age * 0.53 + ph * 1.7) * ta; y += Math.sin(age * 0.61 + ph * 2.3) * ta * 0.35;
    const size = P.s0[i] + P.grow[i] * Math.sqrt(age);
    const u = age / life;
    const a = P.a0[i] * Math.min(1, age / Math.max(P.fin[i], 1e-3)) * (1 - smooth(0.35, 1.0, u));
    batch.push(x, y + size * 0.15, z, size, P.rot[i] + P.spin[i] * age, a, P.cell[i], P.mode[i], P.r[i], P.g[i], P.b[i], P.gy[i]);
  }
  function smokeEmitter(list, maxLife, extra) {
    const P = new Spawns(list, maxLife, SMOKE_FIELDS);
    emitters.push({ update(t) { const [lo, hi] = P.range(t); for (let i = lo; i < hi; i++) evalSmoke(P, i, t - P.t[i]); if (extra) extra(t); } });
    return P;
  }
  function puff(rnd, t, x, y, z, o) {
    return {
      t, x, y, z, vx: o.vx || 0, vy: o.vy || 0, vz: o.vz || 0, k: o.k ?? 1.5,
      rise: (o.rise ?? 0.4) * U * (0.7 + 0.6 * rnd()), wk: (o.wk ?? 1) * (0.8 + 0.4 * rnd()), turb: (o.turb ?? 2) * U * (0.6 + 0.8 * rnd()),
      ph: rnd() * 100, s0: o.s0 * (0.75 + 0.5 * rnd()), grow: o.grow * (0.75 + 0.5 * rnd()), life: o.life * (0.75 + 0.5 * rnd()),
      a0: o.a0 * (0.75 + 0.5 * rnd()), rot: rnd() * 6.283, spin: (rnd() - 0.5) * (o.spin ?? 0.25), cell: Math.floor(rnd() * 4),
      r: o.tint[0] * (0.94 + 0.08 * rnd()), g: o.tint[1] * (0.94 + 0.08 * rnd()), b: o.tint[2] * (0.94 + 0.08 * rnd()),
      gy: heightAt(x, z), fin: o.fin ?? 0.25, mode: o.mode ?? 0,
    };
  }

  // ---------------- flashes: short emissive sprites (precomputed list)
  function flashEmitter(list) {
    const F = new Spawns(list, 0.5, ['x', 'y', 'z', 'size', 'life', 'r', 'g', 'b', 'a0', 'rot', 'cell', 'pool', 'gy']);
    emitters.push({
      update(t) {
        const [lo, hi] = F.range(t);
        for (let i = lo; i < hi; i++) {
          const age = t - F.t[i], u = age / F.life[i]; if (u >= 1) continue;
          const a = F.a0[i] * (1 - u) * (1 - u);
          batch.push(F.x[i], F.y[i], F.z[i], F.size[i] * (0.7 + 0.5 * u), F.rot[i], a, F.cell[i], 1, F.r[i], F.g[i], F.b[i], F.gy[i] - 1e3);
          if (F.pool[i] > 0) pools.push({ x: F.x[i], y: F.y[i], z: F.z[i], r: F.pool[i], cr: 1, cg: 0.75, cb: 0.45, i: 2.2 * a });
        }
      },
    });
  }

  // ================================================================ API: musketry smoke line
  function smokeLine(points, t0, t1, o = {}) {
    const rnd = mulberry32(o.seed ?? nextSeed());
    const pts = points.map((p) => new THREE.Vector3(...p));
    const segL = []; let L = 0;
    for (let i = 0; i < pts.length - 1; i++) { const l = pts[i].distanceTo(pts[i + 1]); segL.push(l); L += l; }
    const at = (s) => { let i = 0; while (i < segL.length - 1 && s > segL[i]) { s -= segL[i]; i++; } const f = segL[i] > 0 ? s / segL[i] : 0; return [pts[i].clone().lerp(pts[i + 1], f), i]; };
    const side = o.side ?? 1;
    const dirAt = (i) => { if (o.dir) return new THREE.Vector2(...o.dir).normalize(); const d = pts[i + 1].clone().sub(pts[i]); return new THREE.Vector2(-d.z, d.x).normalize().multiplyScalar(side); };
    const rate = (o.rate ?? 18) * (L / (100 * U));                    // puffs per second for the whole line
    const L0 = LOOKS[o.look || 'gm'];
    const life = o.life ?? L0.life, tint = o.tint || L0.tint;
    const sz = (o.size ?? 1) * S;
    const list = [], flashes = [];
    const N = Math.max(1, Math.round(rate * (t1 - t0)));
    for (let k = 0; k < N; k++) {
      let t, s;
      if (o.volley) { // volleys rolling along the line
        const nv = Math.max(1, Math.floor((t1 - t0) / o.volley)), v = k % nv;
        s = rnd() * L; t = t0 + v * o.volley + (s / L) * (o.roll ?? 0.8) + rnd() * 0.25;
      } else { t = t0 + rnd() * (t1 - t0); s = rnd() * L; }
      const [p, si] = at(s); const d = dirAt(si);
      const mv = (o.muzzle ?? 14) * U * (0.6 + 0.8 * rnd());
      const h = (o.height ?? 1.6) * U;
      list.push(puff(rnd, t, p.x, p.y + h, p.z, { vx: d.x * mv, vz: d.y * mv, vy: 0.5 * U, k: 1.3, rise: L0.rise, turb: L0.turb, s0: L0.s0 * sz, grow: L0.grow * sz, life, a0: o.alpha ?? L0.alpha, tint, wk: o.windK ?? 1, mode: L0.mode }));
      if (o.flash !== false && rnd() < 0.7) flashes.push({ t, x: p.x + d.x * 1.2 * U, y: p.y + h, z: p.z + d.y * 1.2 * U, size: 3.5 * sz, life: 0.09, r: 1.6, g: 1.05, b: 0.5, a0: 0.9, rot: rnd() * 6, cell: 6, pool: 0, gy: 0 });
    }
    smokeEmitter(list, life * 1.3);
    if (flashes.length) flashEmitter(flashes);
  }

  // ================================================================ API: cannon burst
  function cannon(pos, tBurst, o = {}) {
    const rnd = mulberry32(o.seed ?? nextSeed());
    const d = new THREE.Vector2(...(o.dir || [1, 0])).normalize();
    const sz = (o.size ?? 1) * S, [px, py, pz] = pos, h = (o.height ?? 1.2) * U;
    const L0 = LOOKS[o.look || 'gm'];
    const list = [], life = o.life ?? L0.life + 2;
    const n = o.puffs ?? 11;
    for (let k = 0; k < n; k++) {
      const spread = (rnd() - 0.5) * 0.9, c = Math.cos(spread), s = Math.sin(spread);
      const dx = d.x * c - d.y * s, dz = d.x * s + d.y * c;
      const v = (25 + 55 * rnd()) * U;
      list.push(puff(rnd, tBurst + rnd() * 0.06, px, py + h, pz, { vx: dx * v, vz: dz * v, vy: (1 + 4 * rnd()) * U, k: 2.6, rise: L0.rise, turb: L0.turb, s0: L0.s0 * 1.2 * sz, grow: L0.grow * 1.15 * sz, life, a0: o.alpha ?? L0.alpha * 1.1, tint: o.tint || L0.tint, fin: 0.06, spin: 0.4, mode: L0.mode }));
    }
    for (let k = 0; k < (o.dust ?? 6); k++) { // ground dust kicked up around the gun
      const a = rnd() * 6.283, v = (6 + 10 * rnd()) * U;
      list.push(puff(rnd, tBurst + 0.02, px, py + 0.3 * U, pz, { vx: Math.cos(a) * v - d.x * 4 * U, vz: Math.sin(a) * v - d.y * 4 * U, vy: 0.5 * U, k: 2.0, rise: 0.15, turb: 1.2, s0: 2.5 * sz, grow: 3.5 * sz, life: 7, a0: 0.45, tint: [0.78, 0.70, 0.58], fin: 0.1 }));
    }
    smokeEmitter(list, life * 1.3);
    const fl = [];
    fl.push({ t: tBurst, x: px + d.x * 3 * U, y: py + h, z: pz + d.y * 3 * U, size: 14 * sz, life: 0.16, r: 2.0, g: 1.4, b: 0.7, a0: 1, rot: 0, cell: 6, pool: 45 * sz, gy: 0 });
    for (let k = 0; k < 3; k++) fl.push({ t: tBurst, x: px + d.x * (3 + 4 * k) * U, y: py + h, z: pz + d.y * (3 + 4 * k) * U, size: (6 - k) * sz, life: 0.09, r: 2.2, g: 1.6, b: 0.9, a0: 1, rot: rnd() * 6, cell: 4 + (k & 1), pool: 0, gy: 0 });
    flashEmitter(fl);
  }

  // ================================================================ API: fire (point, line e.g. a bridge, or area e.g. a building)
  function fire(pos, t0, t1, o = {}) {
    const rnd = mulberry32(o.seed ?? nextSeed());
    const p0 = new THREE.Vector3(...pos), p1 = o.to ? new THREE.Vector3(...o.to) : p0.clone();
    const area = o.area ? [o.area[0] * U, o.area[1] * U] : [0, 0];
    const sz = (o.size ?? 1) * S;
    const L = p0.distanceTo(p1) / U + Math.max(area[0], area[1]) / U;
    const span = Math.max(1, L / 10);
    const ramp = o.ramp ?? 3, fade = o.fadeOut ?? 4, tEnd = t1 + fade;
    const env = (t) => smooth(t0, t0 + ramp, t) * (1 - smooth(t1, tEnd, t));
    const at = () => { const f = rnd(); const p = p0.clone().lerp(p1, f); p.x += (rnd() - 0.5) * area[0]; p.z += (rnd() - 0.5) * area[1]; return p; };
    // flames
    const flames = [], nf = Math.round((o.flameRate ?? 30) * span * (tEnd - t0));
    for (let k = 0; k < nf; k++) {
      const t = t0 + rnd() * (tEnd - t0), p = at();
      flames.push({ t, x: p.x, y: p.y, z: p.z, life: 0.45 + 0.7 * rnd(), s0: (2.6 + 2.2 * rnd()) * sz * (o.flameK ?? 1), vy: (3 + 3 * rnd()) * U * (o.size ?? 1), ph: rnd() * 50, cell: 4 + (rnd() < 0.5 ? 0 : 1), e: env(t), rot: (rnd() - 0.5) * 0.35 });
    }
    const F = new Spawns(flames, 1.2, ['x', 'y', 'z', 'life', 's0', 'vy', 'ph', 'cell', 'e', 'rot']);
    // embers
    const embers = [], ne = Math.round((o.emberRate ?? 10) * span * (tEnd - t0));
    for (let k = 0; k < ne; k++) {
      const t = t0 + rnd() * (tEnd - t0), p = at();
      embers.push({ t, x: p.x, y: p.y + 2 * U, z: p.z, life: 1.5 + 2.5 * rnd(), vy: (4 + 6 * rnd()) * U, ph: rnd() * 50, e: env(t), s0: (0.5 + 0.6 * rnd()) * sz });
    }
    const E = new Spawns(embers, 4.1, ['x', 'y', 'z', 'life', 'vy', 'ph', 'e', 's0']);
    // smoke column (dark), keeps smouldering after the flames die
    const smoke = [], tSm = tEnd + (o.smoulder ?? 6), ns = Math.round((o.smokeRate ?? 3.5) * span * (tSm - t0));
    const life = o.smokeLife ?? 22;
    for (let k = 0; k < ns; k++) {
      const t = t0 + rnd() * (tSm - t0), p = at(), e = Math.max(env(t), 0.35 * (1 - smooth(tEnd, tSm, t)) * smooth(t0, t0 + ramp, t));
      const dark = o.smokeTint || [0.16, 0.15, 0.14];
      const q = puff(rnd, t, p.x, p.y + 3 * U * (o.size ?? 1), p.z, { vy: 2 * U, k: 0.5, rise: (o.rise ?? 5.5) * (o.size ?? 1), wk: o.smokeWind ?? 1.1, turb: 3, s0: (o.smokeS0 ?? 5) * sz, grow: (o.smokeGrow ?? 9.5) * sz, life, a0: (o.smokeAlpha ?? 0.78) * e, tint: dark, fin: 0.6, spin: 0.15 });
      q.fireLit = 1; smoke.push(q);
    }
    const SP = new Spawns(smoke, life * 1.3, SMOKE_FIELDS);
    const ph0 = rnd() * 100, center = p0.clone().lerp(p1, 0.5);
    let light = null;
    if (o.light !== false) {
      light = new THREE.PointLight(0xff8a3a, 0, (o.lightRange ?? 140) * sz, 1.6);
      light.position.copy(center).add(new THREE.Vector3(0, 6 * sz, 0));
      scene.add(light);
    }
    const lightPower = o.lightIntensity ?? 6;
    emitters.push({
      update(t) {
        if (t < t0 - 0.01 || t > tSm + life * 1.3) { if (light) light.intensity = 0; return; }
        const e = env(t), fl = flicker(t, ph0);
        // smoke first (lit by the fire from below at dusk/night)
        const [slo, shi] = SP.range(t);
        for (let i = slo; i < shi; i++) {
          const age = t - SP.t[i];
          const glow = (1 - smooth(0, 6, age)) * e * (0.04 + 0.96 * night);   // clip: no orange tan smoke by day
          const r0 = SP.r[i], g0 = SP.g[i], b0 = SP.b[i];
          SP.r[i] = r0 + glow * 1.6; SP.g[i] = g0 + glow * 0.6; SP.b[i] = b0 + glow * 0.15;
          evalSmoke(SP, i, age);
          SP.r[i] = r0; SP.g[i] = g0; SP.b[i] = b0;
        }
        const [lo, hi] = F.range(t);
        for (let i = lo; i < hi; i++) {
          const age = t - F.t[i], u = age / F.life[i]; if (u >= 1) continue;
          const ph = F.ph[i];
          const x = F.x[i] + Math.sin(age * 6 + ph) * 0.8 * U + wind.x * age * 0.35;
          const z = F.z[i] + Math.cos(age * 5 + ph) * 0.8 * U + wind.y * age * 0.35;
          const size = F.s0[i] * (1 - 0.55 * u);
          const y = F.y[i] + F.vy[i] * age + size * 0.4;
          const heat = 1 - u;
          const r = 1.5 + 0.7 * heat, g = 0.25 + 1.0 * heat * heat, b = 0.05 + 0.45 * heat * heat * heat;
          const a = F.e[i] * Math.sin(Math.PI * Math.min(1, u * 1.15 + 0.05)) * (o.flameA ?? 0.95);
          batch.push(x, y, z, size, F.rot[i], a, F.cell[i], 1, r, g, b, F.y[i] - 1e3);
        }
        const [elo, ehi] = E.range(t);
        for (let i = elo; i < ehi; i++) {
          const age = t - E.t[i], u = age / E.life[i]; if (u >= 1) continue;
          const ph = E.ph[i];
          const x = E.x[i] + Math.sin(age * 2.1 + ph) * 3 * U * age + wind.x * age * 1.2;
          const z = E.z[i] + Math.cos(age * 1.7 + ph) * 3 * U * age + wind.y * age * 1.2;
          const y = E.y[i] + E.vy[i] * age - 0.6 * U * age * age;
          const tw = 0.6 + 0.4 * Math.sin(age * 19 + ph);
          batch.push(x, y, z, E.s0[i], 0, E.e[i] * (1 - u) * tw, 7, 1, 2.2, 0.9, 0.25, -1e9);
        }
        // glow halo + light
        const ext = Math.max(p0.distanceTo(p1), area[0], area[1]);
        const gs = (o.glowSize ?? 30) * sz + ext * 0.6;
        const nseg = Math.max(1, Math.round(ext / (25 * U)));
        for (let s = 0; s < nseg; s++) {
          const p = p0.clone().lerp(p1, nseg === 1 ? 0.5 : s / (nseg - 1));
          batch.push(p.x, p.y + 4 * sz, p.z, gs / Math.sqrt(nseg) * 1.4, 0, e * (0.35 + 0.35 * night) * (0.75 + 0.25 * fl), 6, 1, 1.6, 0.62, 0.22, -1e9);
        }
        pools.push({ x: center.x, y: center.y, z: center.z, r: (o.poolRadius ?? 60) * sz + ext * 0.6, cr: 1, cg: 0.5, cb: 0.18, i: e * (0.45 + 1.1 * night) * (0.7 + 0.3 * fl) });
        if (light) light.intensity = e * lightPower * (0.7 + 0.3 * fl) * (0.5 + night) * U * U * 250;
      },
    });
    return { light };
  }

  // ================================================================ API: campfire (cheap: few flames, a glow, a light pool, a wisp)
  function campfire(pos, o = {}) {
    const rnd = mulberry32(o.seed ?? nextSeed());
    const [px, py, pz] = pos;
    const t0 = o.t0 ?? 0, t1 = o.t1 ?? duration, sz = (o.size ?? 1) * S;
    const flames = [], nf = Math.round((o.flameRate ?? 9) * (t1 - t0 + 1));
    for (let k = 0; k < nf; k++) flames.push({ t: t0 - 1 + rnd() * (t1 - t0 + 1), life: 0.45 + 0.4 * rnd(), ph: rnd() * 30, ox: (rnd() - 0.5) * 0.8 * sz, oz: (rnd() - 0.5) * 0.8 * sz, s0: (1.1 + 0.8 * rnd()) * sz, cell: 4 + (k & 1) });
    const F = new Spawns(flames, 0.9, ['life', 'ph', 'ox', 'oz', 's0', 'cell']);
    const wisps = [];
    if (o.smoke !== false) for (let k = 0, n = Math.round(0.8 * (t1 - t0 + 12)); k < n; k++) {
      wisps.push(puff(rnd, t0 - 12 + rnd() * (t1 - t0 + 12), px, py + 1.2 * sz, pz, { vy: 0.5 * U, k: 0.5, rise: 1.4, wk: 0.8, turb: 1, s0: 1.4 * sz, grow: 2.6 * sz, life: 12, a0: o.smokeAlpha ?? 0.22, tint: [0.55, 0.55, 0.56], fin: 1.0 }));
    }
    const W = new Spawns(wisps, 16, SMOKE_FIELDS);
    const ph0 = rnd() * 100;
    emitters.push({
      update(t) {
        if (t < t0 || t > t1) return;
        const vis = o.visible ? o.visible(t) : 1; if (vis <= 0) return;
        const fl = flicker(t, ph0);
        const [lo, hi] = F.range(t);
        for (let i = lo; i < hi; i++) {
          const age = t - F.t[i], u = age / F.life[i]; if (u >= 1) continue;
          const size = F.s0[i] * (1 - 0.5 * u), heat = 1 - u;
          batch.push(px + F.ox[i] + Math.sin(age * 9 + F.ph[i]) * 0.15 * sz, py + size * 0.45 + age * 1.6 * sz, pz + F.oz[i], size, 0,
            vis * Math.sin(Math.PI * Math.min(1, u + 0.08)), F.cell[i], 1, 1.5 + 0.7 * heat, 0.3 + 0.9 * heat * heat, 0.06 + 0.4 * heat * heat * heat, -1e9);
        }
        batch.push(px, py + 1.2 * sz, pz, (o.glowSize ?? 5) * sz, 0, vis * (0.4 + 0.5 * night) * (0.7 + 0.3 * fl), 6, 1, 1.5, 0.6, 0.2, -1e9);
        const [wlo, whi] = W.range(t);
        for (let i = wlo; i < whi; i++) evalSmoke(W, i, t - W.t[i]);
        pools.push({ x: px, y: py, z: pz, r: (o.poolRadius ?? 9) * sz, cr: 1, cg: 0.42, cb: 0.12, i: vis * (0.25 + 0.7 * night) * (0.75 + 0.25 * fl) });
      },
    });
  }

  // ================================================================ API: shell impact (bonus): dirt fountain + dust
  function impact(pos, tHit, o = {}) {
    const rnd = mulberry32(o.seed ?? nextSeed()), sz = (o.size ?? 1) * S, [px, py, pz] = pos, list = [];
    for (let k = 0; k < 10; k++) {
      const a = rnd() * 6.283, v = (4 + 10 * rnd()) * U;
      list.push(puff(rnd, tHit + rnd() * 0.05, px, py + 0.5 * U, pz, { vx: Math.cos(a) * v, vz: Math.sin(a) * v, vy: (8 + 18 * rnd()) * U, k: 1.8, rise: -0.3, turb: 1.5, s0: 3 * sz, grow: 4.5 * sz, life: 8, a0: 0.6, tint: [0.62, 0.55, 0.45], fin: 0.05 }));
    }
    smokeEmitter(list, 11);
    flashEmitter([{ t: tHit, x: px, y: py + 2 * U, z: pz, size: 10 * sz, life: 0.12, r: 2, g: 1.3, b: 0.6, a0: 1, rot: 0, cell: 6, pool: 25 * sz, gy: 0 }]);
  }

  // ================================================================ API: falling snow (camera-anchored, world-stable flakes)
  // Each flake lives in a wrapping box around a focus point ahead of the camera; its world position is
  // focus + wrap(base + velocity * t - focus), so flakes stay put in the world while the box follows the shot.
  function snow(o = {}) {
    const rnd = mulberry32(o.seed ?? nextSeed());
    const n = o.count ?? 2500, t0 = o.t0 ?? -1e9, t1 = o.t1 ?? 1e9;
    const B = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) { B[i * 4] = rnd(); B[i * 4 + 1] = rnd(); B[i * 4 + 2] = rnd(); B[i * 4 + 3] = rnd(); }
    const fall = (o.fall ?? 1.6) * U, sway = (o.sway ?? 1.2) * U;
    const fwd = new THREE.Vector3(), cp = new THREE.Vector3(), focus = new THREE.Vector3();
    emitters.push({
      update(t) {
        if (t < t0 || t > t1) return;
        const k = (o.intensity ? o.intensity(t) : 1) * smooth(t0, t0 + 1, t) * (1 - smooth(t1 - 1, t1, t));
        if (k <= 0) return;
        camera.getWorldPosition(cp); camera.getWorldDirection(fwd);
        const range = Math.max(30 * U, cp.y - heightAt(cp.x, cp.z)) * (o.depth ?? 1.4);
        focus.copy(cp).addScaledVector(fwd, range * 0.5);
        const bx = range * 1.6, by = range * 1.1, bz = range * 1.6;
        const wrap = (v, b) => v - b * Math.floor(v / b + 0.5);
        const sizeK = (o.size ?? 1) * 0.0055;
        for (let i = 0; i < n; i++) {
          const r0 = B[i * 4], r1 = B[i * 4 + 1], r2 = B[i * 4 + 2], r3 = B[i * 4 + 3];
          const vf = fall * (0.7 + 0.6 * r3);
          const x = focus.x + wrap(r0 * bx + wind.x * 0.6 * t + Math.sin(t * 0.9 + r3 * 40) * sway - focus.x, bx);
          const y = focus.y + wrap(r1 * by - vf * t * (range / (60 * U)) - focus.y, by);
          const z = focus.z + wrap(r2 * bz + wind.y * 0.6 * t + Math.cos(t * 0.7 + r3 * 30) * sway - focus.z, bz);
          const dist = Math.hypot(x - cp.x, y - cp.y, z - cp.z);
          batch.push(x, y, z, dist * sizeK * (0.6 + 0.8 * r3), 0, k * (o.alpha ?? 0.85), 6, 2, o.color?.[0] ?? 0.95, o.color?.[1] ?? 0.97, o.color?.[2] ?? 1.0, -1e9);
        }
      },
    });
  }

  // ================================================================ API: volumetric cloud layer
  let cloud = null;
  function clouds(o = {}) {
    const P = shared.fxCloudP.value, Q = shared.fxCloudQ.value;
    P.set((o.base ?? 900) * U, (o.top ?? 1350) * U, 1 / ((o.tile ?? 6000) * U), typeof o.coverage === 'function' ? o.coverage(0) : (o.coverage ?? 0.45));
    Q.set(o.density ?? 1, o.detail ?? 0.35, o.shadow ?? 0.35, 1);
    if (!shared.fxCloudTex.value) shared.fxCloudTex.value = makeCloudNoise3D(o.noiseSize ?? 64, seed + 7);
    const res = o.resolution ?? 0.5;
    const cu = Object.assign({
      uInvProj: { value: new THREE.Matrix4() }, uCamWorld: { value: new THREE.Matrix4() }, uCam: { value: new THREE.Vector3() },
      uSunCol: { value: new THREE.Color(1.0, 0.96, 0.9) }, uAmbTop: { value: new THREE.Color(0.80, 0.85, 0.95) }, uAmbBot: { value: new THREE.Color(0.42, 0.46, 0.55) },
      uSigma: { value: (o.sigma ?? 0.012) / U }, uLightStep: { value: (o.lightStep ?? 110) * U }, uMaxDist: { value: (o.maxDist ?? 30000) * U },
      uMaxSeg: { value: (o.maxSeg ?? 6000) * U }, uOpacity: { value: 1 }, uSteps: { value: o.steps ?? 48 },
    }, shared);
    const vs = /* glsl */`
      uniform mat4 uInvProj; uniform mat4 uCamWorld; varying vec3 vDir;
      void main() { vec4 v = uInvProj * vec4(position.xy, 1.0, 1.0); v /= v.w; vDir = (uCamWorld * vec4(v.xyz, 0.0)).xyz; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
    const fs = /* glsl */`
      precision highp float;
      ${CLOUD_GLSL}
      uniform vec3 uCam; uniform vec3 uSunCol; uniform vec3 uAmbTop; uniform vec3 uAmbBot;
      uniform float uSigma; uniform float uLightStep; uniform float uMaxDist; uniform float uMaxSeg; uniform float uOpacity; uniform float uSteps;
      varying vec3 vDir;
      float hg(float c, float g) { float g2 = g * g; return (1.0 - g2) / (12.566 * pow(1.0 + g2 - 2.0 * g * c, 1.5)); }
      void main() {
        vec3 rd = normalize(vDir);
        float y0 = fxCloudP.x, y1 = fxCloudP.y, ta, tb;
        if (abs(rd.y) < 1e-4) { if (uCam.y < y0 || uCam.y > y1) { gl_FragColor = vec4(0.0); return; } ta = 0.0; tb = uMaxDist; }
        else { float a = (y0 - uCam.y) / rd.y, b = (y1 - uCam.y) / rd.y; ta = max(min(a, b), 0.0); tb = max(a, b); }
        tb = min(min(tb, ta + uMaxSeg), uMaxDist);
        if (tb <= ta) { gl_FragColor = vec4(0.0); return; }
        float dt = (tb - ta) / uSteps;
        float jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
        float cosT = dot(rd, fxSunDir);
        float phase = mix(hg(cosT, 0.55), hg(cosT, -0.15), 0.5) * 6.0 + 0.35;
        float T = 1.0; vec3 col = vec3(0.0);
        for (int i = 0; i < 96; i++) {
          if (float(i) >= uSteps) break;
          float t = ta + (float(i) + jit) * dt;
          vec3 p = uCam + rd * t;
          float d = fxCloudDensity(p, true);
          if (d > 0.003) {
            float ld = fxCloudDensity(p + fxSunDir * uLightStep * 0.7, false) * 1.2
                     + fxCloudDensity(p + fxSunDir * uLightStep * 2.6, false) * 1.8;
            float sunT = exp(-ld * uLightStep * uSigma * 0.9);
            float powder = 1.0 - exp(-d * 8.0);
            float h = (p.y - y0) / (y1 - y0);
            vec3 amb = mix(uAmbBot, uAmbTop, clamp(h * 1.2, 0.0, 1.0));
            vec3 S = uSunCol * sunT * phase * mix(0.55, 1.0, powder) * 1.15 + amb * (0.30 + 0.40 * h);
            float a = exp(-d * uSigma * dt);
            col += T * S * (1.0 - a);
            T *= a;
            if (T < 0.015) break;
          }
        }
        float alpha = (1.0 - T) * uOpacity * (1.0 - smoothstep(uMaxDist * 0.55, uMaxDist, ta));
        gl_FragColor = vec4(col * uOpacity * (1.0 - smoothstep(uMaxDist * 0.55, uMaxDist, ta)), alpha);
      }`;
    const mat = new THREE.ShaderMaterial({ vertexShader: vs, fragmentShader: fs, uniforms: cu, depthTest: false, depthWrite: false, transparent: true, blending: THREE.NoBlending });
    const quadGeo = new THREE.PlaneGeometry(2, 2);
    const rtScene = new THREE.Scene(), rtCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const rq = new THREE.Mesh(quadGeo, mat); rq.frustumCulled = false; rtScene.add(rq);
    const rt = new THREE.WebGLRenderTarget(16, 16, { type: THREE.HalfFloatType, depthBuffer: false });
    const compMat = new THREE.ShaderMaterial({
      uniforms: { uTex: { value: rt.texture } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: `uniform sampler2D uTex; varying vec2 vUv;
        void main(){ vec4 c = texture2D(uTex, vUv); if (c.a < 0.002) discard; vec3 col = c.rgb / max(c.a, 1e-4);
        #ifdef TONE_MAPPING
          col = toneMapping(col);
        #endif
        col = linearToOutputTexel(vec4(col, 1.0)).rgb; gl_FragColor = vec4(col * c.a, c.a); }`,
      transparent: true, depthTest: false, depthWrite: false,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    });
    const comp = new THREE.Mesh(quadGeo, compMat); comp.frustumCulled = false;
    scene.add(comp);
    cloud = { o, cu, rt, rtScene, rtCam, comp, res, opacity: o.opacity ?? 1 };
    return cloud;
  }

  // ================================================================ ground patch: cloud shadows + light pools
  function patchGround(material) {
    const prev = material.onBeforeCompile;
    material.onBeforeCompile = (shader, r) => {
      if (prev) prev(shader, r);
      Object.assign(shader.uniforms, shared);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vFxWorld;')
        .replace('#include <project_vertex>', '#include <project_vertex>\nvFxWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\nvarying vec3 vFxWorld;\n${CLOUD_GLSL}\nuniform vec4 fxPoolPos[${MAXPOOL}];\nuniform vec4 fxPoolCol[${MAXPOOL}];\nuniform int fxPoolN;`)
        .replace('#include <opaque_fragment>', `
          {
            if (fxCloudQ.w > 0.5 && fxCloudQ.z > 0.0) {
              float ym = mix(fxCloudP.x, fxCloudP.y, 0.35);
              vec3 sp = vFxWorld + fxSunDir * (ym - vFxWorld.y) / max(fxSunDir.y, 0.08);
              float cd = fxCloudDensity(sp, false);
              outgoingLight *= 1.0 - fxCloudQ.z * smoothstep(0.0, 0.7, cd);
            }
            vec3 fxPl = vec3(0.0);
            for (int i = 0; i < ${MAXPOOL}; i++) {
              if (i >= fxPoolN) break;
              vec3 dd = vFxWorld - fxPoolPos[i].xyz;
              float r2 = dot(dd, dd) / (fxPoolPos[i].w * fxPoolPos[i].w);
              float f = max(0.0, 1.0 - r2); f *= f;
              fxPl += fxPoolCol[i].rgb * fxPoolCol[i].a * f / (1.0 + 6.0 * r2);
            }
            outgoingLight += diffuseColor.rgb * fxPl * 2.2;
          }
          #include <opaque_fragment>`);
    };
    const key = material.customProgramCacheKey ? material.customProgramCacheKey.bind(material) : () => '';
    material.customProgramCacheKey = () => key() + '|fxground' + MAXPOOL;
    material.needsUpdate = true;
    return material;
  }

  // ================================================================ environment
  function setNight(k) {
    night = clamp01(k);
    const day = 1 - night;
    spriteU.uSunCol.value.setRGB(1.0 * day + 0.07 * night, 0.95 * day + 0.09 * night, 0.86 * day + 0.14 * night);
    spriteU.uShadeCol.value.setRGB(0.50 * day + 0.025 * night, 0.53 * day + 0.03 * night, 0.60 * day + 0.05 * night);
    spriteU.uScatter.value = 0.6 * day;
    if (cloud) {
      cloud.cu.uSunCol.value.setRGB(1.0 * day + 0.12 * night, 0.96 * day + 0.14 * night, 0.9 * day + 0.2 * night);
      cloud.cu.uAmbTop.value.setRGB(0.80 * day + 0.05 * night, 0.85 * day + 0.06 * night, 0.95 * day + 0.10 * night);
      cloud.cu.uAmbBot.value.setRGB(0.42 * day + 0.02 * night, 0.46 * day + 0.03 * night, 0.55 * day + 0.06 * night);
    }
  }

  // ================================================================ per-frame
  const tmpV = new THREE.Vector3(), tmpD = new THREE.Vector3();
  function update(t, cam) {
    if (cam) camera = cam;
    camera.updateMatrixWorld(); camera.updateProjectionMatrix();
    const e = camera.matrixWorld.elements;
    spriteU.uCamRight.value.set(e[0], e[1], e[2]).normalize();
    spriteU.uCamUp.value.set(e[4], e[5], e[6]).normalize();
    spriteU.uCamBack.value.set(e[8], e[9], e[10]).normalize();
    const P = shared.fxCloudP.value;
    shared.fxCloudWind.value.set(-wind.x * t * P.z * 1.6, 0, -wind.y * t * P.z * 1.6);
    batch.clear(); pools.length = 0;
    for (const em of emitters) em.update(t);
    batch.flush(camera);
    // light pools: keep the strongest near the camera, deterministic order
    camera.getWorldPosition(tmpV);
    pools.forEach((p, idx) => { p.k = p.i * p.r / (p.r + 0.08 * Math.hypot(p.x - tmpV.x, p.y - tmpV.y, p.z - tmpV.z)) - idx * 1e-9; });
    pools.sort((a, b) => b.k - a.k);
    const n = Math.min(MAXPOOL, pools.length);
    for (let i = 0; i < n; i++) { const p = pools[i]; shared.fxPoolPos.value[i].set(p.x, p.y, p.z, p.r); shared.fxPoolCol.value[i].set(p.cr, p.cg, p.cb, p.i); }
    shared.fxPoolN.value = n;
    // clouds: march at reduced resolution into a target, composite in the main pass
    if (cloud) {
      const op = typeof cloud.opacity === 'function' ? cloud.opacity(t) : cloud.opacity;
      if (typeof cloud.o.coverage === 'function') P.w = cloud.o.coverage(t);
      cloud.cu.uOpacity.value = op;
      // skip the whole pass when no view ray can reach the slab (camera under the deck, looking down)
      let reach = tmpV.y >= P.x;
      if (!reach) {
        for (const [sx, sy] of [[-1, 1], [1, 1], [-1, -1], [1, -1], [0, 1]]) {
          tmpD.set(sx, sy, 1).unproject(camera).sub(tmpV);
          if (tmpD.y > 0) { reach = true; break; }
        }
      }
      cloud.comp.visible = op > 0.001 && reach;
      cloud.comp.renderOrder = (tmpV.y > (P.x + P.y) * 0.5) ? 1000 : -10; // above the deck: clouds cover the smoke
      if (cloud.comp.visible && renderer) {
        const size = renderer.getDrawingBufferSize(new THREE.Vector2());
        const w = Math.max(16, Math.round(size.x * cloud.res)), h = Math.max(16, Math.round(size.y * cloud.res));
        if (cloud.rt.width !== w || cloud.rt.height !== h) cloud.rt.setSize(w, h);
        cloud.cu.uInvProj.value.copy(camera.projectionMatrixInverse);
        cloud.cu.uCamWorld.value.copy(camera.matrixWorld);
        cloud.cu.uCam.value.copy(tmpV);
        const prevT = renderer.getRenderTarget(), prevC = renderer.getClearColor(new THREE.Color()), prevA = renderer.getClearAlpha();
        const prevAuto = renderer.autoClear;
        renderer.setRenderTarget(cloud.rt); renderer.setClearColor(0x000000, 0); renderer.clear(true, false, false);
        renderer.autoClear = false;
        renderer.render(cloud.rtScene, cloud.rtCam);
        renderer.autoClear = prevAuto;
        renderer.setRenderTarget(prevT); renderer.setClearColor(prevC, prevA);
      }
    }
    return batch.n;
  }

  return {
    smokeLine, cannon, fire, campfire, impact, snow, clouds, patchGround, setNight, update,
    get spriteCount() { return batch.n; },
    sunDir, wind, shared, batch,
  };
}
