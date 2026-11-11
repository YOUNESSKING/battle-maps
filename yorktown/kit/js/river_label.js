// RIVER NAMES carved into the Style W map (test 2026-11-10, research/style_tests/more_life/living/).
// Italic serif (EB Garamond 500 italic), letter-spaced, each letter set and rotated along the river's own
// centre-line (SVG textPath on a smoothed, offset copy of the polyline), set just OFF the water.
// Look = the carved town labels (roads_towns/towns/label.py render_label_curve): pale ivory/blue face,
// inset bevel (dark inner edge top-left, faint light edge bottom-right), tight soft dark shadow.
// Timing (STYLE_LOCK 1c): appears on its spoken word t, holds, fades out from t + hold (default 3.5 s).
//
//   riverLabel(id, text, polylineMapPx, t, opts) -> <g> (inside the world overlay SVG, so it rides the camera)
//
//   polylineMapPx  [[x, y], ...] map px (e.g. rivers_px.json from extract_rivers.py); any direction
//   t              spoken-word time (s), e.g. B.at(para, "Big Black")
//   opts.s         camera scale while the label is up (sizes are SCREEN px at that scale; default 1)
//   opts.size      font size on screen, px (default 22; towns are 28-34, rivers sit one step under them)
//   opts.track     letter spacing, em (default 0.22)
//   opts.at        where the word's centre sits along the river, 0..1 of its length (default 0.5)
//   opts.near      [x, y] map px: centre the word on the river point nearest to this (overrides at)
//   opts.side      "above" | "below" | "left" | "right": which bank (default "above" = the screen-upper bank)
//   opts.hw        water half-width on screen, px (default 6; Mississippi ~14 at s 1.7)
//   opts.gap       clear grass between water edge and the letters, screen px (default 5)
//   opts.smooth    smoothing window along the river, screen px (default 2.2 x size) so meanders don't jumble it
//   opts.hold      seconds fully shown before the fade (default 3.5); opts.until overrides (absolute time)
//   opts.fade      fade in/out seconds (default 0.5 / 0.7); opts.face colour (default "#d6e2dc");
//   opts.faceAlpha (default 0.93); opts.shadow 0..1 (default 0.55); opts.tl, opts.svg (defaults window.tl, #overlay)
// Font: set riverLabel.fontUrl before the first call (default "assets/fonts/eb-garamond-latin-500-italic.woff2").
(function () {
  const NS = "http://www.w3.org/2000/svg";
  let fontDone = false;
  const ensureFont = () => {
    if (fontDone) return; fontDone = true;
    const st = document.createElement("style");
    st.textContent = `@font-face{font-family:"RL Garamond";font-style:italic;font-weight:500;src:url("${window.riverLabel.fontUrl}") format("woff2");}`;
    document.head.appendChild(st);
  };
  // arc-length resampling of a polyline every `step` px
  const resample = (P, step) => {
    const out = [P[0].slice()]; let carry = 0;
    for (let i = 1; i < P.length; i++) {
      const [x0, y0] = P[i - 1], [x1, y1] = P[i], d = Math.hypot(x1 - x0, y1 - y0); if (d < 1e-9) continue;
      let u = step - carry;
      while (u <= d) { out.push([x0 + (x1 - x0) * u / d, y0 + (y1 - y0) * u / d]); u += step; }
      carry = d - (u - step);
    }
    const last = P[P.length - 1]; if (Math.hypot(last[0] - out[out.length - 1][0], last[1] - out[out.length - 1][1]) > step * 0.3) out.push(last.slice());
    return out;
  };
  // box blur (3 passes ~ gaussian) with clamped ends
  const smooth = (P, r) => {
    let Q = P;
    for (let pass = 0; pass < 3; pass++) {
      Q = Q.map((_, i) => { let sx = 0, sy = 0, n = 0; for (let j = i - r; j <= i + r; j++) { const q = Q[Math.min(Math.max(j, 0), Q.length - 1)]; sx += q[0]; sy += q[1]; n++; } return [sx / n, sy / n]; });
    }
    return Q;
  };
  const tangents = (P) => P.map((_, i) => { const a = P[Math.max(i - 1, 0)], b = P[Math.min(i + 1, P.length - 1)], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; });

  // the baseline path (map px) for a label: crop around `at`, smooth, orient for reading, offset off the water
  const baseline = (poly, text, o) => {
    const s = o.s, step = 2 / s;
    const P = resample(poly, step), n = P.length;
    const estLen = (text.length * 0.47 + (text.length - 1) * o.track) * o.size / s;   // rough text length (map px)
    let c = Math.round(o.at * (n - 1));
    if (o.near) { let best = 1e18; P.forEach((q, i) => { const d = (q[0] - o.near[0]) ** 2 + (q[1] - o.near[1]) ** 2; if (d < best) { best = d; c = i; } }); }
    const half = Math.round((estLen * 0.75 + 3 * o.size / s) / step);
    const r = Math.max(2, Math.round((o.smooth / s) / step / 2));
    const a0 = Math.max(0, c - half), b0 = Math.min(n - 1, c + half);
    const a = Math.max(0, a0 - 3 * r), b = Math.min(n - 1, b0 + 3 * r);
    let Q = smooth(P.slice(a, b + 1), r).slice(a0 - a, b0 - a + 1);   // smoothing pad dropped at both ends
    // reading direction: left -> right; a near-vertical run reads bottom -> top
    const dx = Q[Q.length - 1][0] - Q[0][0], dy = Q[Q.length - 1][1] - Q[0][1];
    if ((Math.abs(dx) >= 0.35 * Math.abs(dy) && dx < 0) || (Math.abs(dx) < 0.35 * Math.abs(dy) && dy > 0)) Q = Q.slice().reverse();
    const T = tangents(Q);
    // normal pointing to the text's "up" side (left of the reading direction in screen coords)
    const up = T.map(([tx, ty]) => [ty, -tx]);
    const mid = up[Math.floor(up.length / 2)];
    let sign = 1;                                  // +1: letters on the "up" side (baseline just off the water)
    if (o.side === "below") sign = -1;
    else if (o.side === "left") sign = mid[0] < 0 ? 1 : -1;
    else if (o.side === "right") sign = mid[0] > 0 ? 1 : -1;
    else if (o.side === "above") sign = mid[1] < 0 ? 1 : -1;
    // above: baseline at hw + gap (+ descender room); below: the cap line clears the water -> baseline further out
    const off = (sign > 0 ? o.hw + o.gap + 0.12 * o.size : -(o.hw + o.gap + 0.62 * o.size)) / s;
    let Bl = Q.map((q, i) => [q[0] + up[i][0] * off, q[1] + up[i][1] * off]);
    // keep clear of the REAL water: the smoothed line cuts the corners of tight bends, so push the letters
    // out wherever their river-side edge (baseline above, cap line below) comes closer than hw + gap
    const raw = P.slice(Math.max(0, a - 20), Math.min(n, b + 21)), need = (o.hw + o.gap) / s, edge = sign > 0 ? 0 : 0.62 * o.size / s;
    const dmin = (x, y) => { let m = 1e18; for (const r of raw) { const d = (r[0] - x) ** 2 + (r[1] - y) ** 2; if (d < m) m = d; } return Math.sqrt(m); };
    let push = Bl.map((q, i) => Math.max(0, need - dmin(q[0] + up[i][0] * edge, q[1] + up[i][1] * edge)));
    const R2 = 2 * r; push = push.map((_, i) => Math.max(...push.slice(Math.max(0, i - R2), i + R2 + 1)));   // widen, then soften
    push = smooth(push.map((p) => [p, 0]), r).map((q) => q[0]);
    const dir = sign > 0 ? 1 : -1;
    Bl = Bl.map((q, i) => [q[0] + up[i][0] * dir * push[i] * 1.15, q[1] + up[i][1] * dir * push[i] * 1.15]);
    return Bl;
  };

  window.riverLabel = function (id, text, poly, t, opts = {}) {
    ensureFont();
    const o = Object.assign({ s: 1, size: 22, track: 0.22, at: 0.5, side: "above", hw: 6, gap: 5, hold: 3.5, fadeIn: 0.5, fadeOut: 0.7,
      face: "#d6e2dc", faceAlpha: 0.93, shadow: 0.55 }, opts);
    if (o.smooth == null) o.smooth = 2.2 * o.size;
    const tl = o.tl || window.tl, svg = o.svg || document.getElementById("overlay"), s = o.s, u = (px) => +(px / s).toFixed(3);
    const B = baseline(poly, text, o);
    let defs = svg.querySelector("defs"); if (!defs) { defs = document.createElementNS(NS, "defs"); svg.insertBefore(defs, svg.firstChild); }
    const path = document.createElementNS(NS, "path");
    path.setAttribute("id", `rl-${id}-path`);
    path.setAttribute("d", "M" + B.map((q) => q[0].toFixed(2) + " " + q[1].toFixed(2)).join(" L"));
    defs.appendChild(path);
    // carved look: shadow (tight + soft halo, toward the bottom-right) | face | inset dark edge top-left | light edge bottom-right
    const f = document.createElementNS(NS, "filter");
    f.setAttribute("id", `rl-${id}-carve`); ["x", "y"].forEach((k) => f.setAttribute(k, "-20%")); ["width", "height"].forEach((k) => f.setAttribute(k, "140%"));
    f.setAttribute("color-interpolation-filters", "sRGB");
    const e = u(0.7);
    f.innerHTML = `
      <feOffset in="SourceAlpha" dx="${u(0.35)}" dy="${u(0.5)}" result="so"/>
      <feGaussianBlur in="so" stdDeviation="${u(0.7)}" result="s1"/>
      <feGaussianBlur in="SourceAlpha" stdDeviation="${u(1.7)}" result="s2"/>
      <feComponentTransfer in="s2" result="s2b"><feFuncA type="linear" slope="0.6"/></feComponentTransfer>
      <feMerge result="sm"><feMergeNode in="s1"/><feMergeNode in="s2b"/></feMerge>
      <feComponentTransfer in="sm" result="sma"><feFuncA type="linear" slope="${(1.6 * o.shadow).toFixed(3)}"/></feComponentTransfer>
      <feFlood flood-color="rgb(24,22,10)" result="shc"/>
      <feComposite in="shc" in2="sma" operator="in" result="shadow"/>
      <feOffset in="SourceAlpha" dx="${e}" dy="${e}" result="sh1"/>
      <feComposite in="SourceAlpha" in2="sh1" operator="out" result="edgeD0"/>
      <feGaussianBlur in="edgeD0" stdDeviation="${u(0.3)}" result="edgeD1"/>
      <feFlood flood-color="rgb(70,70,52)" flood-opacity="0.62" result="dk"/>
      <feComposite in="dk" in2="edgeD1" operator="in" result="edgeD2"/>
      <feComposite in="edgeD2" in2="SourceAlpha" operator="in" result="edgeD"/>
      <feOffset in="SourceAlpha" dx="${-e}" dy="${-e}" result="sh2"/>
      <feComposite in="SourceAlpha" in2="sh2" operator="out" result="edgeL0"/>
      <feGaussianBlur in="edgeL0" stdDeviation="${u(0.3)}" result="edgeL1"/>
      <feFlood flood-color="rgb(250,252,240)" flood-opacity="0.45" result="lt"/>
      <feComposite in="lt" in2="edgeL1" operator="in" result="edgeL2"/>
      <feComposite in="edgeL2" in2="SourceAlpha" operator="in" result="edgeL"/>
      <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/><feMergeNode in="edgeD"/><feMergeNode in="edgeL"/></feMerge>`;
    defs.appendChild(f);
    const g = document.createElementNS(NS, "g");
    g.setAttribute("id", `rl-${id}`); g.setAttribute("filter", `url(#rl-${id}-carve)`); g.setAttribute("pointer-events", "none");
    const tx = document.createElementNS(NS, "text");
    Object.entries({ "font-family": '"RL Garamond", "EB Garamond", Georgia, serif', "font-style": "italic", "font-weight": 500,
      "font-size": u(o.size), "letter-spacing": u(o.track * o.size), fill: o.face, "fill-opacity": o.faceAlpha,
      "text-rendering": "geometricPrecision" }).forEach(([k, v]) => tx.setAttribute(k, v));
    const tp = document.createElementNS(NS, "textPath");
    tp.setAttribute("href", `#rl-${id}-path`); tp.setAttribute("startOffset", "50%"); tp.setAttribute("text-anchor", "middle");
    tp.textContent = text;
    tx.appendChild(tp); g.appendChild(tx); svg.appendChild(g);
    // timing: nothing before the spoken word; fade after ~3.5 s (rule 1c)
    gsap.set(g, { opacity: 0 });
    if (tl && t != null) {
      const until = o.until != null ? o.until : t + o.hold;
      tl.to(g, { opacity: 1, duration: o.fadeIn, ease: "sine.out" }, t);
      tl.to(g, { opacity: 0, duration: o.fadeOut, ease: "sine.in" }, until);
    }
    return g;
  };
  window.riverLabel.fontUrl = "assets/fonts/eb-garamond-latin-500-italic.woff2";
  window.riverLabel.baseline = (poly, text, opts = {}) => baseline(poly, text, Object.assign({ s: 1, size: 22, track: 0.22, at: 0.5, side: "above", hw: 6, gap: 5 }, opts, { smooth: opts.smooth ?? 2.2 * (opts.size || 22) }));
})();
