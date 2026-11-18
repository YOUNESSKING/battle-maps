// usage: node arrows_in_frame.js S06 [margin=0.06] : projects every arrow point (ground h=0) while the arrow is shown; reports points outside the safe frame
const fs = require('fs'), vm = require('vm'), path = require('path');
const V = '/home/user/battle-maps/vicksburg', sid = process.argv[2], M = +(process.argv[3] || 0.06);
const ctx = { console, Math, JSON }; ctx.window = ctx; vm.createContext(ctx);
const run = (f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
run(V + '/worlds/geo.js'); ctx.GM3D_PLACES = JSON.parse(fs.readFileSync(V + '/data/geo.json', 'utf8')).places || [];
for (const d of fs.readdirSync(V + '/worlds')) { const f = path.join(V, 'worlds', d, 'region.js'); if (fs.existsSync(f)) run(f); }
run(V + '/engine/seqlib.js'); run(`${V}/sequences/${sid}/seq.js`);
const S = ctx.SEQ, EASE = { io: (k) => 0.5 - 0.5 * Math.cos(Math.PI * k), in: (k) => k ** 3, out: (k) => 1 - (1 - k) ** 3, lin: (k) => k, cut: (k) => k };
const K = S.keys.map((k) => ({ fov: 30, yaw: 0, tilt: 45, ...k }));
const lerp = (a, b, k) => a + (b - a) * k;
function cam(t) { let i = 0; while (i < K.length - 1 && K[i + 1].t <= t) i++; const a = K[i], b = K[Math.min(i + 1, K.length - 1)];
  if (b === a || b.ease === 'cut' || t <= a.t) return a; const e = EASE[b.ease || 'io'](Math.min(1, (t - a.t) / (b.t - a.t))), L = (p, q) => lerp(p, q, e);
  return { region: a.region, at: [L(a.at[0], b.at[0]), L(a.at[1], b.at[1])], dist: Math.exp(lerp(Math.log(a.dist), Math.log(b.dist), e)), tilt: L(a.tilt, b.tilt), yaw: L(a.yaw, b.yaw), fov: L(a.fov, b.fov) }; }
const n = (v) => { const l = Math.hypot(...v); return v.map((q) => q / l); };
function proj(c, q) { const tl = c.tilt * Math.PI / 180, yw = c.yaw * Math.PI / 180, back = Math.sin(tl) * c.dist, up = Math.cos(tl) * c.dist;
  const P = [c.at[0] + Math.sin(yw) * back, up, c.at[1] + Math.cos(yw) * back]; const f = n([c.at[0] - P[0], -up, c.at[1] - P[2]]);
  const r = n([-f[2], 0, f[0]]); const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  const tv = Math.tan(c.fov * Math.PI / 360), th = tv * 16 / 9; const d = [q[0] - P[0], 0 - P[1], q[1] - P[2]]; const z = d[0] * f[0] + d[1] * f[1] + d[2] * f[2];
  return [(d[0] * r[0] + d[1] * r[1] + d[2] * r[2]) / (z * th), (d[0] * u[0] + d[1] * u[1] + d[2] * u[2]) / (z * tv)]; }
const lim = 1 - 2 * M; let bad = 0;
(S.arrows || []).forEach((a, ai) => { const ta = a.t0 + (a.dur || 1), tb = Math.min(a.t1 ?? S.D, S.D); const hits = {};
  for (let t = ta; t <= tb; t += 0.5) { const c = cam(t); if (a.region && c.region !== a.region) continue; a.pts.forEach((p, pi) => { const [x, y] = proj(c, p); if (Math.abs(x) > lim || Math.abs(y) > lim) { const k = pi; (hits[k] = hits[k] || []).push(`${t.toFixed(1)}:(${((x + 1) * 960).toFixed(0)},${((1 - y) * 540).toFixed(0)})`); } }); }
  const ks = Object.keys(hits); if (ks.length) { bad++; console.log(`arrow ${ai} [${a.t0.toFixed(1)}-${tb.toFixed(1)}] side=${a.side || a.color}`); ks.forEach((k) => console.log(`   pt ${k} ${JSON.stringify(a.pts[k].map((v) => +v.toFixed(1)))} out: ${hits[k].slice(0, 4).join(' ')}${hits[k].length > 4 ? ' ...' + hits[k].length : ''}`)); } });
console.log(`${sid}: ${bad ? bad + ' arrows leave the ' + M * 100 + '% safe frame' : 'all arrows inside the safe frame'}`);
