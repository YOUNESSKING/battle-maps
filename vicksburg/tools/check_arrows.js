// (based on check_edges.js) frustum-corner check: for every 0.25 s of the scene's own camera keys (dive windows skipped), the 4 frame corners hit the ground plane
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

// arrows inside the frame: for every arrow, every 0.25 s from the moment it is fully drawn to t1 (and its head while drawing), project each
// point (ground plane, h = 0) and report points outside a safe margin (default 6 % of the frame). usage: node check_arrows.js S02 [margin 0.06]
const MG = +(process.argv[3] || 0.06), bad = [];
const proj = (c, x, y) => { const tl = c.tilt * Math.PI / 180, yw = c.yaw * Math.PI / 180, back = Math.sin(tl) * c.dist, up = Math.cos(tl) * c.dist;
  const P = [c.at[0] + Math.sin(yw) * back, up, c.at[1] + Math.cos(yw) * back], n = (v) => { const l = Math.hypot(...v); return v.map((q) => q / l); };
  const f = n([c.at[0] - P[0], -up, c.at[1] - P[2]]), r = n([-f[2], 0, f[0]]), u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  const v = [x - P[0], -P[1], y - P[2]], z = v[0] * f[0] + v[1] * f[1] + v[2] * f[2], tv = Math.tan(c.fov * Math.PI / 360), th = tv * 16 / 9;
  const sx = (v[0] * r[0] + v[1] * r[1] + v[2] * r[2]) / (z * th), sy = (v[0] * u[0] + v[1] * u[1] + v[2] * u[2]) / (z * tv); return [(sx + 1) / 2, (1 - sy) / 2]; };
const along = (pts, k) => { const L = []; let T = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); T += d; }
  let s = k * T, out = [pts[0]]; for (let i = 1; i < pts.length; i++) { if (s >= L[i - 1]) { out.push(pts[i]); s -= L[i - 1]; } else { const f = s / L[i - 1]; out.push([lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]); break; } } return out; };
(S.arrows || []).forEach((a, ai) => { const reg = a.region || S.regions.find((n) => ctx.GM3D_REGIONS[n].kind === 'close') || S.regions[0]; const t1 = Math.min(a.t1 ?? S.D, S.D), seen = new Set();
  for (let t = a.t0; t <= t1 - 0.6; t += 0.25) { if (skip.some(([p, q]) => t > p && t < q)) continue; const c = cam(t); if (c.region !== reg) continue;
    const k = Math.min(1, (t - a.t0) / (a.dur || 1)), pts = along(a.pts, 1 - (1 - k) ** 2);
    pts.forEach((p, i) => { const [sx, sy] = proj(c, p[0], p[1]); if (sx < MG || sx > 1 - MG || sy < MG || sy > 1 - MG) { const key = i === pts.length - 1 ? 'head' : 'pt' + i;
      if (!seen.has(key)) { seen.add(key); bad.push(`arrow#${ai} ${a.side || a.color || ''} t=${t.toFixed(2)} ${key} (${p[0].toFixed(0)},${p[1].toFixed(0)}) -> screen ${(sx * 100).toFixed(0)}%,${(sy * 100).toFixed(0)}%`); } } }); } });
console.log(`${sid}: arrows inside a ${MG * 100}% margin: ${bad.length ? bad.length + ' findings (first time each point leaves)' : 'OK'}`); for (const l of bad) console.log('  ' + l);
