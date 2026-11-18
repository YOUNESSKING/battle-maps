// frustum-corner check: for every 0.25 s of the scene's own camera keys (dive windows skipped), the 4 frame corners hit the ground plane
// inside the region box (margin M). usage: node edges.js S09 [margin]
const fs = require('fs'), vm = require('vm'), path = require('path');
const V = '/home/user/battle-maps/vicksburg', sid = process.argv[2], M = +(process.argv[3] || 0);
const ctx = { console, Math, JSON }; ctx.window = ctx; vm.createContext(ctx);
const run = (f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
run(V + '/worlds/geo.js'); ctx.GM3D_PLACES = JSON.parse(fs.readFileSync(V + '/data/geo.json', 'utf8')).places || [];
for (const d of fs.readdirSync(V + '/worlds')) { const f = path.join(V, 'worlds', d, 'region.js'); if (fs.existsSync(f)) run(f); }
run(V + '/engine/seqlib.js'); run(`${V}/sequences/${sid}/seq.js`);
const S = ctx.SEQ, EASE = { io: (k) => 0.5 - 0.5 * Math.cos(Math.PI * k), in: (k) => k ** 3, out: (k) => 1 - (1 - k) ** 3, lin: (k) => k, cut: (k) => k };
const K = S.keys.map((k) => ({ fov: 30, yaw: 0, tilt: 45, ...k }));
const skip = (S.dives || []).map((d) => { const D = ctx.VX.diveTimes(d.t); return [D.push - 0.1, D.land + 0.05]; });
const lerp = (a, b, k) => a + (b - a) * k;
function cam(t) { let i = 0; while (i < K.length - 1 && K[i + 1].t <= t) i++; const a = K[i], b = K[Math.min(i + 1, K.length - 1)];
  if (b === a || b.ease === 'cut' || t <= a.t) return a; const e = EASE[b.ease || 'io'](Math.min(1, (t - a.t) / (b.t - a.t))), L = (p, q) => lerp(p, q, e);
  return { region: a.region, at: [L(a.at[0], b.at[0]), L(a.at[1], b.at[1])], dist: Math.exp(lerp(Math.log(a.dist), Math.log(b.dist), e)), tilt: L(a.tilt, b.tilt), yaw: L(a.yaw, b.yaw), fov: L(a.fov, b.fov) }; }
const bad = [];
for (let t = 0; t <= S.D + 1e-6; t += 0.25) { if (skip.some(([a, b]) => t > a && t < b)) continue; const c = cam(t), R = ctx.GM3D_REGIONS[c.region]; if (!R) continue;
  const [bx, by, bw, bh] = R.box, tl = c.tilt * Math.PI / 180, yw = c.yaw * Math.PI / 180, back = Math.sin(tl) * c.dist, up = Math.cos(tl) * c.dist;
  const P = [c.at[0] + Math.sin(yw) * back, up, c.at[1] + Math.cos(yw) * back];   // x, height, y(map)
  let f = [c.at[0] - P[0], -up, c.at[1] - P[2]]; const n = (v) => { const l = Math.hypot(...v); return v.map((q) => q / l); }; f = n(f);
  // three: right = f x up(0,1,0) ; in (x, h, y) with y = three z
  let r = n([f[1] * 0 - f[2] * 1, f[2] * 0 - f[0] * 0, f[0] * 1 - f[1] * 0]); const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  const tv = Math.tan(c.fov * Math.PI / 360), th = tv * 16 / 9; const out = [];
  for (const [sx, sy, nm] of [[-1, 1, 'TL'], [1, 1, 'TR'], [-1, -1, 'BL'], [1, -1, 'BR']]) { const d = [0, 1, 2].map((i) => f[i] + r[i] * th * sx + u[i] * tv * sy);
    if (d[1] >= -1e-4) { out.push(nm + ':sky'); continue; } const s = -P[1] / d[1]; const x = P[0] + d[0] * s, y = P[2] + d[2] * s;
    if (s > c.dist * 8) out.push(nm + ':far'); if (x < bx + M || x > bx + bw - M || y < by + M || y > by + bh - M) out.push(`${nm}(${x.toFixed(0)},${y.toFixed(0)})`); }
  if (out.length) bad.push(`${t.toFixed(2)} ${c.region} ${out.join(' ')}`); }
console.log(`${sid}: box check margin ${M}: ${bad.length ? bad.length + ' bad samples' : 'OK'}`); for (const l of bad) console.log('  ' + l);
