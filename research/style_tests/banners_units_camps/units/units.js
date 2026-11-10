// units.js : painted troop formations for Style W / 2e battle maps (TEST, research/style_tests/banners_units_camps/units/).
// Replaces the single kit box (B.unit + K.counter + echelon) with formations drawn like the owner's Yarmouk reference:
// a battle line = a LONG ROW of small bevelled blocks (side colour, NATO infantry X, dark outline, drop shadow) laid edge to
// edge along the line; skirmishers / light horse = loose round dots; batteries = small blocks with a gun; cavalry = dots + slash.
// One echelon mark (XX, XXX) per formation, never per block. Name tag only from U.tag(t) (the spoken word). No flags on units.
//
// API (all times are timeline seconds; every size is in SCREEN px at the reference camera scale, multiplied by U.k):
//   U.init({ tl, parent, k })                 tl = the scene's GSAP timeline, parent = the world layer, k = world px per screen px
//   const h = U.formation(id, side, kind, geom, n, opts)
//        side  "carth" | "union" | "blue"  -> Union blue #1f4fc4      "rome" | "cs" | "red" -> Confederate red #c4121f
//        kind  "line" | "column" | "skirmish" | "cavalry" | "battery"
//        geom  { x, y, face, len? }  face = direction the troops face / march, degrees (0 = east, 90 = south, -90 = north)
//              { x, y, angle, len? } angle = direction the front runs (face = angle - 90)
//              [[x,y], [x,y], ...]   a polyline the front follows (blocks follow its bends); opts.faceSide "left" | "right"
//        n     number of blocks / dots / guns
//        opts  { mark: "XX", t: appear time (null = from frame 0), groups: [4,4] brigade sizes, gap: px between brigades,
//                w, d: block size (default 40 x 38), seam: px between blocks (5), files: 1 | 2 (column width, default 1), markAt: "rear" | "front" | "up" | [dx,dy],
//                seed, until }
//   U.move(h, t, dur, geom, { kind, ease })    translate + rotate the whole formation (rigid when both geoms are {x,y,face})
//   U.morph(h, t, kind, { dur, geom, ease })   line <-> column (blocks slide into their new places, head first)
//   U.tag(h, text, t, until)                   name tag beside the echelon mark, only from t
//   U.show(h, t) / U.hide(h, t)                fade the formation in / out
//   U.skirmishers(h, n, { ahead, side })       a skirmish screen of n dots in front of a line formation
//   U.center(h) -> [x, y]                      current (last scheduled) centre; h.hq is a div that rides with the formation
//                                              (attach portrait stakes / anything else to it)
// Ops on one formation must be scheduled in time order and must not overlap (each starts from the previous end state).
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const SIDES = {
    carth: { base: "#1f4fc4", hi: "#4d79dc", lo: "#163a95", ink: "#0a1636", chip: "#dfe6f4" },
    rome: { base: "#c4121f", hi: "#de3a44", lo: "#8f0c17", ink: "#2c0609", chip: "#f2dcd4" },
  };
  const SIDE_ALIAS = { union: "carth", blue: "carth", us: "carth", cs: "rome", red: "rome", confederate: "rome" };
  const INK = "#1b1812";
  const CSS = `
.uf-layer { position:absolute; left:0; top:0; width:0; height:0; overflow:visible; pointer-events:none;
  filter: drop-shadow(calc(var(--uk) * 3px) calc(var(--uk) * 3.5px) calc(var(--uk) * 2px) rgba(14,10,2,.6)); }
.uf-b { position:absolute; left:0; top:0; width:0; height:0; will-change:transform; }
.uf-b > .in { position:absolute; left:0; top:0; }
.uf-b svg { position:absolute; overflow:visible; display:block; }
.uf-hq { position:absolute; left:0; top:0; width:0; height:0; z-index:5; }
.uf-mark { position:absolute; transform:translate(-50%,-50%); white-space:nowrap; font-family:Oswald,'Liberation Sans Narrow','Arial Narrow',sans-serif;
  font-weight:700; color:${INK}; letter-spacing:.06em; line-height:1; text-shadow:0 0 2px #f7f3ea,0 0 2px #f7f3ea,0 0 3px rgba(247,243,234,.8); }
.uf-tag { position:absolute; white-space:nowrap; font-family:Oswald,'Liberation Sans Narrow','Arial Narrow',sans-serif; font-weight:700; letter-spacing:.06em;
  color:#f7f3ea; line-height:1.15; border-radius:2px; box-shadow:0 2px 4px rgba(0,0,0,.45); }
`;
  const U = (window.U = { k: 1, tl: null, parent: null, list: {} });

  // ---------- helpers ----------
  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const hash = (s) => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const rad = (a) => (a * Math.PI) / 180, deg = (a) => (a * 180) / Math.PI;
  const lerp = (a, b, p) => a + (b - a) * p;
  const lerpAng = (a, b, p) => { let d = ((b - a) % 360 + 540) % 360 - 180; return a + d * p; };
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const easeFn = (e) => (e && window.gsap ? gsap.parseEase(e) : (p) => p);

  function defs() {   // shared paint texture (seeded noise) used by every block
    if (document.getElementById("uf-defs")) return;
    const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    const c = document.createElement("canvas"); c.width = c.height = 96; const g = c.getContext("2d"), r = rng(7), im = g.createImageData(96, 96);
    for (let i = 0; i < 96 * 96; i++) { const v = 128 + (r() - 0.5) * 120 + (r() < 0.04 ? -70 : 0); im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; }
    g.putImageData(im, 0, 0); g.globalAlpha = 0.25; for (let i = 0; i < 40; i++) { g.fillStyle = r() < 0.5 ? "#fff" : "#000"; g.fillRect(r() * 96, r() * 96, 2 + r() * 10, 1 + r() * 2); }
    const svg = document.createElementNS(NS, "svg"); svg.id = "uf-defs"; svg.setAttribute("width", 0); svg.setAttribute("height", 0); svg.style.position = "absolute";
    svg.innerHTML = `<defs><pattern id="uf-noise" patternUnits="userSpaceOnUse" width="48" height="48"><image href="${c.toDataURL()}" width="48" height="48"/></pattern></defs>`;
    document.body.appendChild(svg);
  }

  U.init = (o = {}) => { U.tl = o.tl; U.parent = o.parent; U.k = o.k || 1; defs(); };

  // ---------- geometry -> slots ----------
  function normGeom(g, opts) {
    if (Array.isArray(g)) return { poly: g.map((p) => [p[0], p[1]]), faceSide: opts.faceSide || "left" };
    const face = g.face != null ? g.face : g.angle != null ? g.angle - 90 : 0;
    return { x: g.x, y: g.y, face, len: g.len };
  }
  function polyInfo(pts) {   // cumulative arc length
    const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { cum, L: cum[cum.length - 1] };
  }
  function polyAt(pts, info, s) {
    s = Math.max(0, Math.min(info.L, s)); let i = 1; while (i < pts.length - 1 && info.cum[i] < s) i++;
    const a = pts[i - 1], b = pts[i], seg = info.cum[i] - info.cum[i - 1] || 1, p = (s - info.cum[i - 1]) / seg;
    return { x: lerp(a[0], b[0], p), y: lerp(a[1], b[1], p), ang: deg(Math.atan2(b[1] - a[1], b[0] - a[0])) };
  }
  function centreOf(G) { if (!G.poly) return [G.x, G.y]; const info = polyInfo(G.poly), m = polyAt(G.poly, info, info.L / 2); return [m.x, m.y]; }
  function faceOf(G) { if (!G.poly) return G.face; const info = polyInfo(G.poly), m = polyAt(G.poly, info, info.L / 2); return m.ang + (G.faceSide === "right" ? 90 : -90); }

  // offsets of n blocks along a front, centred on 0 (in px), honouring brigade groups and gaps
  function frontOffsets(n, pitch, groups, gap) {
    const out = []; let s = 0, gi = 0, left = groups ? groups[0] : n;
    for (let i = 0; i < n; i++) { out.push(s); s += pitch; if (groups && --left === 0 && i < n - 1) { gi++; left = groups[gi] || n; s += gap; } }
    const mid = (out[0] + out[n - 1]) / 2; return out.map((v) => v - mid);
  }
  // center-out rank of each line slot (deploy order: column head -> centre of the line)
  function centreOutRank(n) { const idx = [...Array(n).keys()].sort((a, b) => Math.abs(a - (n - 1) / 2) - Math.abs(b - (n - 1) / 2) || b - a);
    const rank = Array(n); idx.forEach((b, r) => (rank[b] = r)); return rank; }

  function slotsFor(h, kind, G) {   // -> { s: [{x,y,rot}], mark: [x,y] }  in world px
    const k = U.k, o = h.opts, n = h.n, r = rng(h.seed + 11), w = h.w, d = h.d;
    const S = [];
    if (kind === "line" || kind === "battery" || kind === "column") {
      const pitch = (kind === "battery" ? w + 12 * k : w + (h.opts.seam != null ? h.opts.seam : 5) * k), gap = o.gap != null ? o.gap * k : w * 0.55;
      if (kind === "column") {
        const face = faceOf(G), [cx, cy] = centreOf(G), fv = [Math.cos(rad(face)), Math.sin(rad(face))], av = [-fv[1], fv[0]];
        const files = h.files, rows = Math.ceil(n / files), rp = d + (h.opts.seam != null ? h.opts.seam : 5) * k, fp = w + 6 * k;
        for (let b = 0; b < n; b++) { const rk = h.rank[b], row = Math.floor(rk / files), fl = files === 1 ? 0 : (rk % files) - (files - 1) / 2;
          const along = ((rows - 1) / 2 - row) * rp; S.push({ x: cx + fv[0] * along + av[0] * fl * fp, y: cy + fv[1] * along + av[1] * fl * fp, rot: face + 90 }); }
        const side = av[1] < 0 ? 1 : -1;   // mark on the side of the column that is up on screen
        const off = (files * fp) / 2 + 14 * k; return { s: S, mark: [cx + av[0] * off * side, cy + av[1] * off * side] };
      }
      if (G.poly) {
        const info = polyInfo(G.poly), nat = frontOffsets(n, pitch, o.groups, gap), natL = nat[n - 1] - nat[0] + pitch;
        const st = info.L / natL; const fill = st;   // spread evenly over the whole polyline
        for (let b = 0; b < n; b++) { const p = polyAt(G.poly, info, info.L / 2 + nat[b] * fill); S.push({ x: p.x, y: p.y, rot: p.ang + (G.faceSide === "right" ? 180 : 0) }); }
        h.stretch = Math.min(1.25, Math.max(0.75, fill));
      } else {
        let off = frontOffsets(n, pitch, o.groups, gap);
        if (G.len) { const natL = off[n - 1] - off[0] + pitch, f = G.len / natL; off = off.map((v) => v * f); }
        const rot = G.face + 90, av = [Math.cos(rad(rot)), Math.sin(rad(rot))];
        for (let b = 0; b < n; b++) S.push({ x: G.x + av[0] * off[b], y: G.y + av[1] * off[b], rot });
      }
      return { s: S, mark: markPos(h, G, S, d) };
    }
    // dots: skirmish (loose clusters along a front) / cavalry (compact staggered ranks)
    const face = faceOf(G), [cx, cy] = centreOf(G), fv = [Math.cos(rad(face)), Math.sin(rad(face))], av = [-fv[1], fv[0]];
    const R = h.dot;
    if (kind === "skirmish") {
      const per = o.cluster || 3, nc = Math.ceil(n / per), L = G.len || (G.poly ? polyInfo(G.poly).L : nc * 70 * k);
      const info = G.poly ? polyInfo(G.poly) : null;
      for (let b = 0; b < n; b++) { const c = Math.floor(b / per), j = b % per, cs = nc === 1 ? 0 : (c / (nc - 1) - 0.5) * L;
        let px, py; if (info) { const p = polyAt(G.poly, info, info.L / 2 + cs); px = p.x; py = p.y; } else { px = cx + av[0] * cs; py = cy + av[1] * cs; }
        const inC = Math.min(per, n - c * per), a = (j / inC) * Math.PI * 2 + c * 1.7 + (r() - 0.5) * 0.35, rr = inC === 1 ? 0 : (2 * R + 7 * k) / (2 * Math.sin(Math.PI / Math.max(2, inC))) + r() * 2.5 * k;
        S.push({ x: px + Math.cos(a) * rr + (r() - 0.5) * 2 * k, y: py + Math.sin(a) * rr + (r() - 0.5) * 2 * k, rot: 0 }); }
    } else {   // cavalry: ranks of 3, every other rank shifted half a dot (hex packing), loose by a few px
      const per = o.perRank || 3, ranks = Math.ceil(n / per), pp = R * 2 + 5 * k;
      for (let b = 0; b < n; b++) { const rk = Math.floor(b / per), j = b % per, inRank = Math.min(per, n - rk * per);
        const a = (j - (inRank - 1) / 2) * pp + (rk % 2 ? pp * 0.25 : -pp * 0.25), f = ((ranks - 1) / 2 - rk) * pp * 0.88;
        S.push({ x: cx + av[0] * a + fv[0] * f + (r() - 0.5) * 3 * k, y: cy + av[1] * a + fv[1] * f + (r() - 0.5) * 3 * k, rot: 0 }); }
    }
    let minY = 1e9, sx = 0; S.forEach((p) => { minY = Math.min(minY, p.y); sx += p.x; });
    return { s: S, mark: typeof o.markAt === "object" && o.markAt ? [cx + o.markAt[0] * k, cy + o.markAt[1] * k] : [sx / n, minY - R - 11 * k] };
  }
  function markPos(h, G, S, d) {
    const k = U.k, o = h.opts; let sx = 0, sy = 0; S.forEach((p) => { sx += p.x; sy += p.y; }); const c = [sx / S.length, sy / S.length];
    if (Array.isArray(o.markAt)) return [c[0] + o.markAt[0] * k, c[1] + o.markAt[1] * k];
    const face = faceOf(G), fv = [Math.cos(rad(face)), Math.sin(rad(face))];
    if (o.markAt === "up") { let minY = 1e9; S.forEach((p) => (minY = Math.min(minY, p.y))); return [c[0], minY - d * 0.6 - 12 * k]; }
    const sgn = o.markAt === "front" ? 1 : -1, off = d / 2 + 15 * k;
    return [c[0] + fv[0] * off * sgn, c[1] + fv[1] * off * sgn];
  }

  // ---------- drawing ----------
  function blockSVG(h, b, kind) {
    // drawn square to the formation (x = along the front, -y = the facing side); place() then skews it so the cross
    // edges lie on the screen axis like the reference (sides follow the line, top/bottom stay level on screen)
    const k = U.k, C = h.col, r = rng(h.seed * 31 + b * 977 + 3), bat = kind === "battery", w = h.w * (bat ? 0.8 : 1), d = h.d * (bat ? 0.8 : 1);
    const m = 8 * k, W = w * 2 + 2 * m, H = d * 2 + 2 * m, cx = W / 2, cy = H / 2;   // generous box: the skew can push corners out
    const j = () => (r() - 0.5) * 1.0 * k;
    const corner = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]];
    // ragged outline: 4 points per edge with small jitter; 1-2 "bites" torn out of a side or the rear edge (painted piece look)
    const bites = {}; const nb = r() < 0.55 ? 1 : r() < 0.6 ? 2 : 0; for (let i = 0; i < nb; i++) bites[[1, 2, 3][Math.floor(r() * 3)]] = 0.2 + r() * 0.5;
    const pts = [];
    for (let e = 0; e < 4; e++) { const a = corner[e], c2 = corner[(e + 1) % 4], L = Math.hypot(c2[0] - a[0], c2[1] - a[1]);
      const nx = -(c2[1] - a[1]) / L, ny = (c2[0] - a[0]) / L;   // inward normal (clockwise winding on screen)
      const P = (p, inset = 0) => [lerp(a[0], c2[0], p) + nx * inset, lerp(a[1], c2[1], p) + ny * inset];
      let E = [[0, 0, 0], [0.3, j(), j()], [0.65, j(), j()]];
      if (bites[e] != null) { const p = bites[e], q = 0.14 + r() * 0.1, dd = (2.8 + r() * 2.4) * k;
        E = E.filter((x) => x[0] < p - 0.02 || x[0] > p + q + 0.02).concat([[p, 0, 0, 0], [p + q * 0.25, 0, 0, dd], [p + q * 0.75, 0, 0, dd * (0.55 + r() * 0.4)], [p + q, 0, 0, 0]]); }
      E.sort((u, v) => u[0] - v[0]).forEach(([pp, jx, jy, ins]) => { const q = P(pp, ins || 0); pts.push([q[0] + jx, q[1] + jy]); });
    }
    const pt = pts.map((p) => `${(p[0] + cx).toFixed(2)},${(p[1] + cy).toFixed(2)}`).join(" ");
    const gid = `uf-g-${h.id}-${b}`, sid = `uf-s-${h.id}-${b}`;
    const ins = 2.2 * k, TL = [-w / 2 + ins + cx, -d / 2 + ins + cy], TR = [w / 2 - ins + cx, -d / 2 + ins + cy], BR = [w / 2 - ins + cx, d / 2 - ins + cy], BL = [-w / 2 + ins + cx, d / 2 - ins + cy];
    let sym = "";
    if (bat) {   // gun: wheel dot + barrel pointing to the front
      sym = `<line x1="${cx}" y1="${cy + d * 0.14}" x2="${cx}" y2="${cy - d * 0.34}" stroke="${C.ink}" stroke-width="${2.8 * k}" stroke-linecap="round"/>` +
        `<circle cx="${cx}" cy="${cy + d * 0.14}" r="${d * 0.19}" fill="${C.ink}"/>`;
    } else {
      sym = `<g stroke="${C.ink}" stroke-width="${2 * k}" stroke-linecap="round" opacity=".92"><line x1="${TL[0]}" y1="${TL[1]}" x2="${BR[0]}" y2="${BR[1]}"/><line x1="${TR[0]}" y1="${TR[1]}" x2="${BL[0]}" y2="${BL[1]}"/></g>`;
    }
    return { W, H, html: `<svg width="${W}" height="${H}" style="left:${-W / 2}px;top:${-H / 2}px">
<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.hi}"/><stop offset=".5" stop-color="${C.base}"/><stop offset="1" stop-color="${C.lo}"/></linearGradient>
<linearGradient id="${sid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient></defs>
<polygon points="${pt}" fill="url(#${gid})"/>
<polygon points="${pt}" fill="url(#uf-noise)" opacity=".26" style="mix-blend-mode:multiply"/>
<polygon points="${pt}" fill="none" stroke="url(#${sid})" stroke-width="${3.6 * k}" transform="translate(${cx} ${cy}) scale(.86) translate(${-cx} ${-cy})"/>
${sym}
<polygon points="${pt}" fill="none" stroke="${C.ink}" stroke-width="${2.4 * k}" stroke-linejoin="round"/></svg>`, gids: [gid, sid] };
  }
  function dotSVG(h, b, kind) {
    const k = U.k, C = h.col, R = h.dot, m = 4 * k, S = 2 * (R + m), c = S / 2, gid = `uf-g-${h.id}-${b}`;
    const slash = kind === "cavalry" ? `<line x1="${c - R * 0.62}" y1="${c + R * 0.62}" x2="${c + R * 0.62}" y2="${c - R * 0.62}" stroke="${INK}" stroke-width="${1.9 * k}" stroke-linecap="round"/>` : "";
    return { W: S, H: S, html: `<svg width="${S}" height="${S}" style="left:${-S / 2}px;top:${-S / 2}px">
<defs><radialGradient id="${gid}" cx=".36" cy=".32" r=".75"><stop offset="0" stop-color="${C.hi}"/><stop offset=".55" stop-color="${C.base}"/><stop offset="1" stop-color="${C.lo}"/></radialGradient></defs>
<circle cx="${c}" cy="${c}" r="${R}" fill="url(#${gid})"/><circle cx="${c}" cy="${c}" r="${R}" fill="url(#uf-noise)" opacity=".24" style="mix-blend-mode:multiply"/>
<path d="M ${c - R * 0.7} ${c + R * 0.05} A ${R * 0.72} ${R * 0.72} 0 0 1 ${c + R * 0.05} ${c - R * 0.7}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="${1.3 * k}" stroke-linecap="round"/>
${slash}<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="${C.ink}" stroke-width="${2 * k}"/></svg>`, gids: [gid] };
  }

  // ---------- formation ----------
  const isDots = (kind) => kind === "skirmish" || kind === "cavalry";
  U.formation = (id, side, kind, geom, n, opts = {}) => {
    const k = U.k, sd = SIDE_ALIAS[side] || side;
    const h = { id: String(id).replace(/[^\w-]/g, "_"), side: sd, col: SIDES[sd], kind, n, opts, seed: opts.seed != null ? opts.seed : hash(id),
      w: (opts.w || 40) * k, d: (opts.d || 38) * k, dot: (opts.r || (kind === "cavalry" ? 12 : 10.5)) * k,
      files: opts.files || 1, rank: centreOutRank(n), ops: [], tagEl: null };
    const layer = document.createElement("div"); layer.className = "uf-layer"; layer.style.setProperty("--uk", k); layer.dataset.id = id;
    (U.parent || document.body).appendChild(layer); h.layer = layer;
    h.isBlk = !isDots(kind) && opts.skew !== false;
    h.blocks = []; h.blockKind = isDots(kind) ? kind : kind === "battery" ? "battery" : "block";
    for (let b = 0; b < n; b++) {
      const el = document.createElement("div"); el.className = "uf-b"; const inn = document.createElement("div"); inn.className = "in";
      const s = isDots(kind) ? dotSVG(h, b, kind) : blockSVG(h, b, kind === "battery" ? "battery" : "line");
      inn.innerHTML = s.html; el.appendChild(inn); layer.appendChild(el);
      h.blocks.push({ el, inn, grads: s.gids.map((g) => inn.querySelector("#" + g)), rot: null });
    }
    const hq = document.createElement("div"); hq.className = "uf-hq"; layer.appendChild(hq); h.hq = hq;
    if (opts.mark) { const m = document.createElement("div"); m.className = "uf-mark"; m.textContent = opts.mark; m.style.fontSize = (opts.markSize || 17) * k + "px"; hq.appendChild(m); h.markEl = m; }
    const G = normGeom(geom, opts); h.state = { kind, G, ...slotsFor(h, kind, G) }; h.state0 = h.state;
    U.list[id] = h; place(h, h.state.s, h.state.mark);
    // appear: blocks pop in one after another along the line (or from frame 0)
    if (opts.t != null && U.tl) {
      gsap.set(layer, { autoAlpha: 0 }); U.tl.set(layer, { autoAlpha: 1 }, opts.t);
      const order = [...Array(n).keys()];
      order.forEach((b, i) => U.tl.fromTo(h.blocks[b].inn, { autoAlpha: 0, scale: 1.35 }, { autoAlpha: 1, scale: 1, duration: 0.32, ease: "back.out(2)", immediateRender: false }, opts.t + (i / Math.max(1, n - 1)) * 0.45));
      U.tl.fromTo(hq, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, opts.t + 0.3);
    }
    if (opts.until != null) U.hide(h, opts.until);
    return h;
  };

  // skew that puts a block's cross edges on the nearest screen axis (horizontal when the line runs up/down, vertical when it runs
  // across), as in the reference; clamped so a line near 45 deg never flips hard
  function skewFor(rot) { const a = rad(rot), ax = Math.cos(a), ay = Math.sin(a), c = Math.abs(ay) > Math.abs(ax) ? [1, 0] : [0, 1];
    const sx = c[0] * ax + c[1] * ay, sy = -c[0] * ay + c[1] * ax; if (Math.abs(sy) < 1e-3) return 0;
    return Math.max(-U.maxSkew, Math.min(U.maxSkew, deg(Math.atan(sx / sy)))); }
  U.maxSkew = 34;
  function place(h, S, mark) {
    for (let b = 0; b < h.n; b++) {
      const B = h.blocks[b], p = S[b];
      B.el.style.transform = `translate(${p.x.toFixed(2)}px,${p.y.toFixed(2)}px) rotate(${p.rot.toFixed(2)}deg)` + (h.isBlk ? ` skewX(${skewFor(p.rot).toFixed(2)}deg)` : "");
      if (B.rot == null || Math.abs(B.rot - p.rot) > 0.8) {   // keep the light coming from the top-left of the SCREEN
        B.grads.forEach((g) => g && g.setAttribute("gradientTransform", `rotate(${(-p.rot).toFixed(1)} .5 .5)`)); B.rot = p.rot; }
    }
    h.hq.style.transform = `translate(${mark[0].toFixed(2)}px,${mark[1].toFixed(2)}px)`;
  }

  // one op = a tween from the previous state to a new one; rigid when both ends are {x,y,face} geoms of the same kind
  function schedule(h, t, dur, kind, G, o = {}) {
    const A = h.state, B = { kind, G, ...slotsFor(h, kind, G) };
    const rigid = A.kind === kind && !A.G.poly && !G.poly && !o.slide;
    const polyLerp = A.kind === kind && A.G.poly && G.poly && A.G.poly.length === G.poly.length;
    const ease = easeFn(o.ease || "power1.inOut"), stag = o.stagger != null ? o.stagger : A.kind !== kind ? 0.3 : 0;
    const delay = (b) => (stag ? (h.rank[b] / Math.max(1, h.n - 1)) * stag : 0);
    const twoPhase = (A.kind === "column" && kind === "line") || (A.kind === "line" && kind === "column"), toLine = kind === "line";
    const fB = faceOf(G), ff = [Math.cos(rad(fB)), Math.sin(rad(fB))], fa = [-ff[1], ff[0]];
    const proxy = { p: 0 };
    const render = () => {
      const p = proxy.p; let S, M;
      if (rigid) { const g = { x: lerp(A.G.x, G.x, ease(p)), y: lerp(A.G.y, G.y, ease(p)), face: lerpAng(A.G.face, G.face, ease(p)), len: G.len != null && A.G.len != null ? lerp(A.G.len, G.len, ease(p)) : G.len };
        const r = slotsFor(h, kind, g); S = r.s; M = r.mark; }
      else if (polyLerp) { const e = ease(p), g = { poly: A.G.poly.map((q, i) => [lerp(q[0], G.poly[i][0], e), lerp(q[1], G.poly[i][1], e)]), faceSide: G.faceSide };
        const r = slotsFor(h, kind, g); S = r.s; M = r.mark; }
      else if (twoPhase) { S = A.s.map((a, b) => { const q = clamp01((p - delay(b)) / (1 - stag)), z = B.s[b];
          // column -> line: slide sideways first, then step up into the line; line -> column: step back first, then file in
          const dx = z.x - a.x, dy = z.y - a.y, lat = dx * fa[0] + dy * fa[1], dep = dx * ff[0] + dy * ff[1];
          const q1 = ease(clamp01(q / 0.62)), q2 = ease(clamp01((q - 0.38) / 0.62)), ql = toLine ? q1 : q2, qd = toLine ? q2 : q1;
          return { x: a.x + fa[0] * lat * ql + ff[0] * dep * qd, y: a.y + fa[1] * lat * ql + ff[1] * dep * qd, rot: lerpAng(a.rot, z.rot, ease(q)) }; });
        M = [lerp(A.mark[0], B.mark[0], ease(p)), lerp(A.mark[1], B.mark[1], ease(p))]; }
      else { S = A.s.map((a, b) => { const q = ease(clamp01((p - delay(b)) / (1 - stag))), z = B.s[b];
          return { x: lerp(a.x, z.x, q), y: lerp(a.y, z.y, q), rot: lerpAng(a.rot, z.rot, q) }; });
        const e = ease(p); M = [lerp(A.mark[0], B.mark[0], e), lerp(A.mark[1], B.mark[1], e)]; }
      place(h, S, M);
    };
    U.tl.to(proxy, { p: 1, duration: Math.max(0.01, dur), ease: "none", onUpdate: render, onStart: render, immediateRender: false }, t);
    h.state = B; h.kind = kind; return h;
  }
  U.move = (h, t, dur, geom, o = {}) => schedule(h, t, dur, o.kind || h.state.kind, normGeom(geom, Object.assign({}, h.opts, o)), o);
  U.morph = (h, t, kind, o = {}) => schedule(h, t, o.dur || 1.6, kind, o.geom ? normGeom(o.geom, h.opts) : h.state.G, Object.assign({ ease: "power2.inOut" }, o));
  U.bmove = (h, t, dur, x, y, ease) => U.move(h, t, dur, { x, y, face: faceOf(h.state.G) }, { ease });   // drop-in for B.move(id, t, dur, x, y)
  U.center = (h) => centreOf(h.state.G);
  U.show = (h, t) => U.tl.fromTo(h.layer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, t);
  U.hide = (h, t) => U.tl.to(h.layer, { autoAlpha: 0, duration: 0.5 }, t);
  U.tag = (h, text, t, until) => {
    const k = U.k, el = document.createElement("div"); el.className = "uf-tag"; el.textContent = text;
    Object.assign(el.style, { background: h.col.base, fontSize: (h.opts.tagSize || 18) * k + "px", padding: `${1 * k}px ${8 * k}px ${1.5 * k}px`,
      left: (h.markEl ? (h.markEl.textContent.length * 4.6 + 8) * k : 0) + "px", top: -11 * k + "px", border: `${1 * k}px solid ${h.col.ink}` });
    if (!h.markEl) Object.assign(el.style, { left: "0", transform: "translateX(-50%)" });
    h.hq.appendChild(el); gsap.set(el, { autoAlpha: 0 });
    U.tl.to(el, { autoAlpha: 1, duration: 0.3 }, t); if (until != null) U.tl.to(el, { autoAlpha: 0, duration: 0.3 }, until);
    h.tagEl = el; return el;
  };
  U.skirmishers = (h, n, o = {}) => {   // a screen of dots o.ahead px in front of line h (same side unless o.side)
    const k = U.k, G = h.state.G, face = faceOf(G), [cx, cy] = centreOf(G), fv = [Math.cos(rad(face)), Math.sin(rad(face))], ah = (o.ahead || 58) * k;
    let len = o.len; if (len == null) { const xs = h.state.s; len = Math.hypot(xs[0].x - xs[h.n - 1].x, xs[0].y - xs[h.n - 1].y) * 0.92; }
    const geom = { x: cx + fv[0] * ah, y: cy + fv[1] * ah, face, len };
    return U.formation(h.id + "_sk", o.side || h.side, "skirmish", geom, n, Object.assign({ t: h.opts.t }, o));
  };
})();
