// QA (owner 2026-11-18): every unit key path and escape road must cross water ONLY at a bridge or pontoon.
// usage: node vicksburg/tools/check_paths.js S05 [S07 ...]   -> prints every crossing of a river ribbon farther than TOL from a bridge.
const fs = require('fs'), vm = require('vm'), path = require('path');
const V = '/home/user/battle-maps/vicksburg', worlds = V + '/worlds', engine = V + '/engine', TOL = 1.6;
for (const sid of process.argv.slice(2)) {
  const ctx = { console, Math, JSON }; ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
  const run = (f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
  run(path.join(worlds, 'geo.js')); ctx.GM3D_PLACES = JSON.parse(fs.readFileSync(V + '/data/geo.json', 'utf8')).places || [];
  for (const d of fs.readdirSync(worlds)) { const f = path.join(worlds, d, 'region.js'); if (fs.existsSync(f)) run(f); }
  run(path.join(engine, 'seqlib.js')); run(`${V}/sequences/${sid}/seq.js`);
  const S = ctx.SEQ, out = [];
  const regOf = (u) => u.region || S.regions.find((r) => ctx.GM3D_REGIONS[r].kind !== 'wide') || S.regions[0];
  const test = (r, pts, what) => { const R = ctx.GM3D_REGIONS[r]; if (!R) return; const isWide = R.kind === 'wide';
    const br = [...(R.features?.bridges || []), ...(R.features?.pontoons || [])].map((b) => [b.x ?? b[0], b.z ?? b.y ?? b[1]]);
    for (const rv of R.rivers || []) { const hw = (rv.w || rv.width || (isWide ? 1.2 : 0.6)) * 0.5 + 0.15;
      for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.2));
        for (let k = 0; k <= n; k++) { const p = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n];
          let dm = 1e9; for (const q of rv.pts) dm = Math.min(dm, Math.hypot(p[0] - q[0], p[1] - q[1]));
          if (dm < hw && !br.some((c) => Math.hypot(c[0] - p[0], c[1] - p[1]) < TOL * (isWide ? 4 : 1))) { out.push(`${what} crosses ${rv.name || 'river'} at (${p[0].toFixed(1)},${p[1].toFixed(1)}) [${r}]`); i = pts.length; break; } } } } };
  (S.units || []).forEach((u, j) => { const r = regOf(u), nm = `unit#${j} ${u.side}${u.name ? ' ' + u.name : ''}`;
    if (u.keys && u.keys.length > 1) test(r, u.keys.map((k) => [k[1], k[2]]), nm + ' keys');
    if (u.escape && Array.isArray(u.escape.road)) test(r, u.escape.road, nm + ' escape'); });
  const uniq = [...new Set(out)];
  console.log(`${sid}: ${uniq.length ? uniq.length + ' crossing(s) away from a bridge' : 'OK'}`); for (const l of uniq.slice(0, 25)) console.log('  ' + l);
}
