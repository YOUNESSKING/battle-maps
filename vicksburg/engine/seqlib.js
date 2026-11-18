// vicksburg/engine/seqlib.js: helpers for scene authors (window.VX), loaded BEFORE seq.js, and the sound-cue builder (VX.cues) that both the
// page (window.CUES) and tools/make_scene.py (cues.json, via node) use. Classic script, no DOM, no three: runs in node too.
// Region data (window.GM3D_REGIONS, window.GM3D_GEO) is loaded before this file, so seq.js can read rivers, roads, towns and features.
(function (G) {
  "use strict";
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const R6 = (x) => Math.round(x * 1e6) / 1e6;
  const VX = {};
  VX.clamp = clamp; VX.lerp = lerp;
  VX.sstep = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  // deterministic hash in [0,1) (the clip's hsh)
  VX.hsh = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

  // ---------------- the cloud dive: every phase time relative to the region swap t (= the moment hidden in the white), exactly v8 ----------------
  // push = camera push-in starts (the 3D title flies past the lens ~1.7 s later), deckIn = the deck starts closing in, full = frame covered,
  // wIn = cool veil starts, SW = region swap (inside the opaque white), warm = cream phase, emerge = battlefield starts to come out,
  // clear = mostly clear, haze = last haze gone, land = camera lands (ease-out ends). Whoosh cue at deckIn + 0.15.
  VX.DIVE_OFF = { push: -3.8, deckIn: -1.7, full: -0.55, deck: -0.45, wIn: -0.35, inside: -0.15, SW: 0, warm: 0.15, emerge: 0.85, clear: 1.15, haze: 1.8, land: 3.35 };
  VX.diveTimes = (t) => { const o = {}; for (const k in VX.DIVE_OFF) o[k] = R6(t + VX.DIVE_OFF[k]); return o; };

  // ---------------- world data ----------------
  VX.region = (name) => { const r = (G.GM3D_REGIONS || {})[name]; if (!r) throw new Error("VX: region '" + name + "' not loaded"); return r; };
  VX.town = (name, region) => { const r = region && VX.region(region); const p = (r && r.towns && r.towns[name]) || ((G.GM3D_GEO || {}).towns || {})[name]; if (!p) throw new Error("VX: no town '" + name + "'"); return p.slice(0, 2); };
  VX.river = (region, which = 0) => { const rs = VX.region(region).rivers || []; const r = typeof which === "number" ? rs[which] : rs.find((q) => q.name === which); if (!r) throw new Error("VX: no river " + which + " in " + region); return r; };
  // the clip's riverAt: the river vertex nearest in map-y to y (rivers that run north-south); returns [x, y, h_m]
  VX.riverAtY = (region, which, y) => { const P = VX.river(region, which).pts; let b = P[0]; for (const p of P) if (Math.abs(p[1] - y) < Math.abs(b[1] - y)) b = p; return b; };
  VX.road = (region, name = 0) => { const rs = VX.region(region).roads || []; const r = typeof name === "number" ? rs[name] : rs.find((q) => q.name === name); if (!r) throw new Error("VX: no road " + name + " in " + region); return (r.pts || r).map((p) => [p[0], p[1]]); };
  VX.feature = (region, kind, i = 0) => { const f = (VX.region(region).features || {})[kind] || []; if (!f[i]) throw new Error("VX: no " + kind + "[" + i + "] in " + region); return f[i]; };
  VX.bridge = (region, i = 0) => VX.feature(region, "bridges", i);
  VX.work = (region, i = 0) => { const w = VX.feature(region, "works", i); return w.pts || w; };

  // ---------------- geometry ----------------
  VX.len = (path) => { let L = 0; for (let i = 1; i < path.length; i++) L += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); return L; };
  // point at arc length s along path -> [x, y, dirx, diry]
  VX.along = (path, s) => { let i = 0; const seg = []; for (let k = 1; k < path.length; k++) seg.push(Math.hypot(path[k][0] - path[k - 1][0], path[k][1] - path[k - 1][1]));
    s = Math.max(0, s); while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; } const a = path[i], b = path[i + 1] || a, l = seg[i] || 1, f = clamp(s / l);
    return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), (b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
  VX.sub = (path, s0, s1, step = 0.5) => { const out = []; for (let s = s0; s < s1; s += step) out.push(VX.along(path, s).slice(0, 2)); out.push(VX.along(path, s1).slice(0, 2)); return out; };
  VX.reverse = (path) => path.slice().reverse();
  // facing (radians in the map plane, the direction a line faces): 0 = east, PI/2 = south, PI = west, -PI/2 = north
  VX.FACE = { east: 0, south: Math.PI / 2, west: Math.PI, north: -Math.PI / 2, ne: -Math.PI / 4, se: Math.PI / 4, sw: 3 * Math.PI / 4, nw: -3 * Math.PI / 4 };
  VX.faceTo = (from, to) => Math.atan2(to[1] - from[1], to[0] - from[0]);
  // n evenly spaced points on the segment a -> b (centres of n units deployed along a line)
  VX.line = (a, b, n) => Array.from({ length: n }, (_, i) => { const k = n === 1 ? 0.5 : i / (n - 1); return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]; });
  // deploy(line, t): unit centre k of n on a line [a, b] at time t -> a key [t, x, y]
  VX.deploy = (line, t, k = 0, n = 1) => { const p = VX.line(line[0], line[1], n)[k]; return [t, p[0], p[1]]; };
  // march(path, t0, speed[, o]): keys [[t, x, y, "lin"], ...] for a unit marching along path at speed (map units / s), constant pace
  // (the 4th key field "lin" = linear segment; default segments ease in-out). o.hold = seconds to wait at the start, o.from/o.to = arc range.
  VX.march = (path, t0, speed, o = {}) => { const s0 = o.from || 0, s1 = o.to ?? VX.len(path), h = o.hold || 0, step = o.step || 0.5, p0 = VX.along(path, s0), K = [[R6(t0), p0[0], p0[1]]];
    if (h) K.push([R6(t0 + h), p0[0], p0[1]]);
    for (let s = s0 + step; ; s += step) { const ss = Math.min(s, s1), p = VX.along(path, ss); K.push([R6(t0 + h + (ss - s0) / speed), p[0], p[1], "lin"]); if (ss >= s1) break; }
    return K; };
  VX.marchEnd = (path, t0, speed, o = {}) => t0 + (o.hold || 0) + ((o.to ?? VX.len(path)) - (o.from || 0)) / speed;

  // ---------------- sound cues: [kind, t] for every VISIBLE shot / volley / fire / dive (assemble mixes only these) ----------------
  // gun = cannon (muzzle flash on screen), boom = impact, volley = musketry burst, fire = something catches fire, whoosh = cloud dive
  VX.cues = (S) => { const c = [], F = S.fx || {}, list = Array.isArray(F) ? F : null;
    const each = (kind, fn) => { if (list) { for (const e of list) if (e.kind === kind || (kind === "smokeLines" && e.kind === "volleys")) fn(e); }
      else { for (const e of F[kind] || []) if (e) fn(e); if (kind === "smokeLines") for (const e of F.volleys || []) if (e) fn(e); } };
    each("guns", (g) => { for (const s0 of g.shots || []) { const s = typeof s0 === "number" ? { t: s0 } : s0; if (g.cue === false || s.cue === false) continue; c.push(["gun", s.t]);
      const imp = s.impact !== undefined ? s.impact : g.impact; if (imp && g.boom !== false && s.boom !== false) c.push(["boom", R6(s.t + (s.delay ?? g.delay ?? 0.85))]); } });
    each("fires", (f) => { if (f.cue === false) return; c.push(["fire", f.cue ?? f.t0]); });
    each("impacts", (f) => { if (f.cue) c.push(["boom", f.t]); });
    // musketry: every entry of fx.volleys (or list kind "volleys") cues a volley every `every` s (default opts.volley or 1.6) from t0 to cueEnd/t1;
    // fx.smokeLines only with cue: true
    each("smokeLines", (l) => { const isV = l.kind === "volleys" || (F.volleys || []).includes(l); if (l.cue === false || (!isV && l.cue !== true)) return;
      const every = l.every || (l.opts && l.opts.volley) || 1.6; for (let t = l.t0; t < (l.cueEnd ?? l.t1); t += every) c.push(["volley", R6(t)]); });
    for (const d of S.dives || []) c.push(["whoosh", VX.diveTimes(d.t).deckIn + 0.15]);
    for (const x of S.cues || []) c.push(x);
    return c.map(([k, t]) => [k, R6(t)]); };

  G.VX = VX;
  if (typeof module !== "undefined") module.exports = VX;
})(typeof window !== "undefined" ? window : globalThis);
