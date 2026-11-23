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
  // Round 3 (critic B N4): the DEFAULT is now S01's short white-out (warm +0.05, emerge +0.15, clear +0.4, haze +1.05: ~0.7 s fully covered
  // instead of 1.3-1.5 s). VX.DIVE_OFF_V8 keeps the original v8 profile (the regression scene passes it as dives[].off).
  VX.DIVE_OFF_V8 = { push: -3.8, deckIn: -1.7, full: -0.55, deck: -0.45, wIn: -0.35, inside: -0.15, SW: 0, warm: 0.15, emerge: 0.85, clear: 1.15, haze: 1.8, land: 3.35 };
  VX.DIVE_OFF_SHORT = { ...VX.DIVE_OFF_V8, warm: 0.05, emerge: 0.15, clear: 0.4, haze: 1.05 };
  VX.DIVE_OFF = { ...VX.DIVE_OFF_V8 };   // owner 2026-11-18: back to the approved v6/v8 white-out (the short one felt like no dive)
  VX.diveTimes = (t) => { const o = {}; for (const k in VX.DIVE_OFF) o[k] = R6(t + VX.DIVE_OFF[k]); return o; };

  // ---------------- world data ----------------
  VX.region = (name) => { const r = (G.GM3D_REGIONS || {})[name]; if (!r) throw new Error("VX: region '" + name + "' not loaded"); return r; };
  VX.town = (name, region) => { const r = region && VX.region(region); const p = (r && r.towns && r.towns[name]) || ((G.GM3D_GEO || {}).towns || {})[name]; if (!p) throw new Error("VX: no town '" + name + "'"); return p.slice(0, 2); };
  // research places (vicksburg/data/geo.json, shipped as worlds/places.js by make_scene.py): place("Raymond") -> [x, y]. Matches the full name,
  // the name before " (", or a case-insensitive prefix; the first match wins. VX.placeInfo(name) returns the whole record (lat, lon, acc_m, note).
  VX.placeInfo = (name) => { const P = G.GM3D_PLACES || [], n = name.toLowerCase(), short = (q) => q.name.split(" (")[0].toLowerCase();
    const r = P.find((q) => q.name === name) || P.find((q) => short(q) === n) || P.find((q) => q.name.toLowerCase().startsWith(n));
    if (!r) throw new Error("VX: no place '" + name + "' in data/geo.json"); return r; };
  // Multi-frame projects (vicksburg/tools/vx_project.py): places / geo.js are in the project's BASE frame; a region baked at another zoom
  // carries region.frame.k (= 2^(zoom - base zoom)): VX.place(name, region) / VX.ll(lat, lon, region) / VX.toRegion(region, [x, y]) give
  // that region's map units (gulf z8: k 0.25, horseshoe z11: k 2). Without `region` they return base units (Vicksburg: unchanged).
  VX.frameK = (region) => { const r = (G.GM3D_REGIONS || {})[region]; return r && r.frame && r.frame.k ? r.frame.k : 1; };
  VX.toRegion = (region, p) => { const k = VX.frameK(region); return [p[0] * k, p[1] * k]; };
  VX.fromRegion = (region, p) => { const k = VX.frameK(region); return [p[0] / k, p[1] / k]; };
  VX.ll = (lat, lon, region) => { const g = G.GM3D_GEO || {}, N = 256 * Math.pow(2, g.zoom), la = lat * Math.PI / 180;
    const p = [(lon + 180) / 360 * N - g.origin[0], (1 - Math.log(Math.tan(la) + 1 / Math.cos(la)) / Math.PI) / 2 * N - g.origin[1]];
    return region ? VX.toRegion(region, p) : p; };
  VX.place = (name, region) => { const r = VX.placeInfo(name); return region ? VX.toRegion(region, [r.x, r.y]) : [r.x, r.y]; };
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
    const each = (kind, fn) => { if (list) { for (const e of list) if (e.kind === kind || e.kind + "s" === kind || (kind === "smokeLines" && e.kind === "volleys")) fn(e); }
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

  // ---------------- small map markers + rain (DOM / 2D canvas over the 3D image, pure functions of t; S06 / S08) ----------------
  // VX.markers(list) -> { build(ctx), draw(t, ctx) }: call both from SEQ.build / SEQ.draw. Item: { icon: wagon | cow | mill | rider | person | flag
  // | svg string, halo: true | css colour (soft light disc behind the icon, for night), region, at: [x, y] | path: [[x, y]...] + s0 (arc length at t0), v (units/s), sMax (stop: a jam), t0, t1, size (units),
  // min / max (px), color (rider / person fill), colors: [[t, color]], spin (deg/s, mill), h (height above ground, units), flip: true }
  const ICON = {
    wagon: '<svg viewBox="0 0 40 30"><path d="M7 18 Q8 4 20 4 Q32 4 33 18 Z" fill="#EFE7D2" stroke="#2a2418" stroke-width="2"/><path d="M12 6 L11 18 M20 4 L20 18 M28 6 L29 18" stroke="#b9ac8c" stroke-width="1.2"/><rect x="4" y="17" width="32" height="4.5" fill="#6a5236" stroke="#2a2418" stroke-width="1.5"/><circle cx="11" cy="24.5" r="4.5" fill="#d8ccad" fill-opacity=".35" stroke="#2a2418" stroke-width="2.4"/><circle cx="29" cy="24.5" r="4.5" fill="#d8ccad" fill-opacity=".35" stroke="#2a2418" stroke-width="2.4"/></svg>',
    cow: '<svg viewBox="0 0 40 26"><g fill="#5a3e28" stroke="#1e150d" stroke-width="1.3"><ellipse cx="18" cy="12" rx="12" ry="6.5"/><path d="M28 9 L35 7.5 L38.5 11.5 L34 15 L29 14 Z"/><rect x="9" y="16" width="3" height="8.5"/><rect x="14" y="17" width="3" height="7.5"/><rect x="21" y="17" width="3" height="7.5"/><rect x="25.5" y="16" width="3" height="8.5"/><path d="M6.5 10 Q3 13 4 19" fill="none"/></g><ellipse cx="16" cy="10" rx="4" ry="2.6" fill="#efe6d2"/><path d="M33.5 7.8 l0.6 -3.2 M36 8.4 l1.8 -2.8" stroke="#efe6d2" stroke-width="1.5"/></svg>',
    mill: '<svg viewBox="-24 -26 52 46"><path d="M2 -6 L14 -16 L26 -6 L26 14 L2 14 Z" fill="#d9cba6" stroke="#2a2418" stroke-width="2"/><path d="M0 -6 L14 -18 L28 -6" fill="none" stroke="#5c3a24" stroke-width="3"/><g class="rot"><circle r="12" fill="none" stroke="#2a2418" stroke-width="3.2"/><circle r="12" fill="none" stroke="#e2d3a8" stroke-width="1.2"/><path d="M-12 0 H12 M0 -12 V12 M-8.5 -8.5 L8.5 8.5 M-8.5 8.5 L8.5 -8.5" stroke="#2a2418" stroke-width="2"/><circle r="2.6" fill="#2a2418"/></g></svg>',
    rider: '<svg viewBox="0 0 40 36"><g fill="currentColor" stroke="#0e0c08" stroke-width="1.3" stroke-linejoin="round"><path d="M5 21 Q7 15 15 15 L27 15 Q30 11 33 9 L37 11 L35.5 15 Q34 19 31 20 L31.5 33 L28.5 33 L27.5 22 L16 22 L13.5 33 L10.5 33 L11 23 Q7.5 24 4.5 27.5 L3 25.5 Z"/><path d="M18 15.5 L19 7 Q20 4.5 23 5.5 L23.5 10 L21.5 15.5 Z"/><circle cx="21.2" cy="3.4" r="2.8"/></g><rect x="23" y="9" width="6" height="4.2" fill="#f4ecd6" stroke="#0e0c08" stroke-width="0.9"/></svg>',
    person: '<svg viewBox="0 0 14 30"><g fill="currentColor" stroke="#0e0c08" stroke-width="1"><circle cx="7" cy="4.5" r="3.4"/><path d="M3 10 Q7 7.5 11 10 L12 20 L9.5 20 L9 29 L5 29 L4.5 20 L2 20 Z"/></g><rect x="7.5" y="12" width="6" height="4" fill="#efe6d2" stroke="#0e0c08" stroke-width="0.7"/></svg>',
  };
  VX.ICONS = ICON;
  VX.markers = (list) => {
    const M = { items: [] };
    M.build = (ctx) => { const PN = document.getElementById("pins");
      for (const m of list) { const e = document.createElement("div"); e.style.cssText = "position:absolute;left:0;top:0;opacity:0;pointer-events:none;will-change:transform;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.55))";
        e.innerHTML = ICON[m.icon] || m.icon || ""; const sv = e.firstChild; if (sv && sv.style) { sv.style.display = "block"; sv.style.width = "100%"; sv.style.height = "100%"; sv.style.overflow = "visible"; }
        if (m.halo) e.style.background = `radial-gradient(closest-side, ${m.halo === true ? "rgba(255,236,190,.55)" : m.halo}, rgba(255,236,190,0))`;
        PN.appendChild(e); const vb = (sv && sv.viewBox && sv.viewBox.baseVal) || { width: 40, height: 30 };
        M.items.push({ m, e, ar: vb.height / vb.width, rot: e.querySelector(".rot"), L: m.path ? VX.len(m.path) : 0 }); } };
    M.pos = (m, L, t) => { if (!m.path) return { p: m.at, s: 0 }; let s = (m.s0 || 0) + (m.v || 0) * Math.max(0, t - (m.t0 ?? 0)); if (m.sMax != null) s = Math.min(s, m.sMax); s = clamp(s, 0, L); return { p: VX.along(m.path, s), s }; };
    M.draw = (t, ctx) => { const W = ctx.world, reg = W.cameraAt(t).region;
      for (const it of M.items) { const m = it.m, e = it.e, t0 = m.t0 ?? -1e9, t1 = m.t1 ?? 1e9;
        if (t < t0 - 0.01 || t > t1 + 0.01 || (m.region && m.region !== reg)) { if (e.style.opacity !== "0") e.style.opacity = "0"; continue; }
        const { p, s } = M.pos(m, it.L, t), q = W.projectMap(p[0], p[1], m.h || 0);
        if (!q.visible) { e.style.opacity = "0"; continue; }
        const fi = m.fadeIn ?? 0.5, fo = m.fadeOut ?? 0.5, a = (fi > 0 ? VX.sstep(t0, t0 + fi, t) : 1) * (fo > 0 ? 1 - VX.sstep(t1 - fo, t1, t) : 1) * (m.alpha ?? 1);
        const w = clamp((m.size || 4) * q.ppu, m.min || 9, m.max || 34), h = w * it.ar;
        let fl = 1; if (m.path && m.flip !== false) { const p2 = VX.along(m.path, Math.min(it.L, s + 0.6)), p1 = VX.along(m.path, Math.max(0, s - 0.6)), a1 = W.projectMap(p1[0], p1[1], 0), a2 = W.projectMap(p2[0], p2[1], 0); fl = a2.x < a1.x ? -1 : 1; }
        if (m.mirror) fl = -fl;
        e.style.width = w.toFixed(1) + "px"; e.style.height = h.toFixed(1) + "px";
        e.style.transform = `translate(${(q.x - w / 2).toFixed(1)}px,${(q.y - (m.anchor === "center" ? h / 2 : h)).toFixed(1)}px) scaleX(${fl})`;
        e.style.opacity = a.toFixed(3);
        let col = m.color; for (const [tc, c] of m.colors || []) if (t >= tc) col = c; if (col) e.style.color = col;
        if (it.rot) it.rot.setAttribute("transform", `rotate(${(((m.spin ?? 90) * t) % 360).toFixed(1)})`); } };
    return M; };
  // VX.pulses(list): soft discs pinned to the ground that pulse (S07's Jackson glow). Item: { at, t0, t1, r (units), color: [r, g, b], period, region }
  VX.pulses = (list) => { const P = { items: [] };
    P.build = () => { const PN = document.getElementById("pins"); for (const p of list) { const e = document.createElement("div"), c = (p.color || [200, 40, 28]).join(",");
      e.style.cssText = `position:absolute;left:0;top:0;border-radius:50%;opacity:0;pointer-events:none;background:radial-gradient(circle, rgba(${c},0.75) 0%, rgba(${c},0.42) 40%, rgba(${c},0) 70%);box-shadow:0 0 0 2px rgba(${c},0.5) inset`;
      PN.insertBefore(e, PN.firstChild); P.items.push({ p, e }); } };
    P.draw = (t, ctx) => { const reg = ctx.world.cameraAt(t).region; for (const { p, e } of P.items) {
      if ((p.region && p.region !== reg) || t < p.t0 - 0.3 || t > (p.t1 ?? 1e9) + 0.3) { e.style.opacity = "0"; continue; }
      const per = p.period || 1.5, ph = Math.max(0, Math.sin((t - p.t0) * 2 * Math.PI / per)), k = VX.sstep(p.t0 - 0.3, p.t0 + 0.5, t) * (1 - VX.sstep((p.t1 ?? 1e9) - 0.6, p.t1 ?? 1e9, t));
      const s = ctx.world.projectMap(p.at[0], p.at[1], 0); if (!s.visible) { e.style.opacity = "0"; continue; }
      const d = Math.max(24, (p.r || 13) * 2 * s.ppu * (1 + 0.22 * ph));
      e.style.width = e.style.height = d.toFixed(1) + "px"; e.style.transform = `translate(${(s.x - d / 2).toFixed(1)}px,${(s.y - d / 2).toFixed(1)}px) scaleY(0.72)`;
      e.style.opacity = (k * (0.55 + 0.45 * ph) * (p.alpha ?? 1)).toFixed(3); } };
    return P; };
  // VX.rain(keys): slanted streaks + a cool grey veil on a canvas over the map (under banners, labels and the GM overlay). keys: [[t, intensity 0..1], ...]
  // (linear between keys; 0 = off). Deterministic: streak positions are a function of t only.
  VX.rain = (keys, o = {}) => { const R = {};
    R.build = () => { const c = document.createElement("canvas"); c.width = 1280; c.height = 720; c.style.cssText = "position:absolute;inset:0;pointer-events:none";
      const tr = document.getElementById("troops"); tr.parentNode.insertBefore(c, tr); R.c = c; R.g = c.getContext("2d"); };
    R.k = (t) => { if (!keys.length) return 0; if (t <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [a, va] = keys[i - 1], [b, vb] = keys[i]; return lerp(va, vb, (t - a) / (b - a)); } return keys[keys.length - 1][1]; };
    R.draw = (t) => { const g = R.g; if (!g) return; g.clearRect(0, 0, 1280, 720); const k = R.k(t); if (k <= 0.001) return;
      g.fillStyle = `rgba(${o.veil || "70,80,92"},${(0.2 * k).toFixed(3)})`; g.fillRect(0, 0, 1280, 720);
      const n = Math.round((o.n || 900) * k), sl = o.slant ?? 0.22, sp = o.speed || 1500;
      for (let layer = 0; layer < 2; layer++) { const len = layer ? 26 : 15, a = (layer ? 0.3 : 0.2) * Math.min(1, k * 1.4);
        g.strokeStyle = `rgba(214,222,228,${a.toFixed(3)})`; g.lineWidth = layer ? 1.2 : 0.8; g.beginPath();
        for (let i = layer; i < n; i += 2) { const sx = VX.hsh(i, 1) * 1400 - 60, sy0 = VX.hsh(i, 2) * 800, v = sp * (0.75 + 0.5 * VX.hsh(i, 3)) * (layer ? 1.2 : 0.85);
          const y = ((sy0 + v * t) % 800) - 40, x = sx - sl * (y + 40); g.moveTo(x, y); g.lineTo(x - sl * len, y + len); }
        g.stroke(); } };
    return R; };

  G.VX = VX;
  if (typeof module !== "undefined") module.exports = VX;
})(typeof window !== "undefined" ? window : globalThis);
