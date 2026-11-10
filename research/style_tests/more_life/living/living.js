// LIVING MAP details for the Style W painted map (test 2026-11-10, research/style_tests/more_life/living/).
// Subtle, deterministic overlays: every motion is a tween on the GSAP timeline (no rAF, no Math.random,
// no callbacks), so seeking/scrubbing the timeline in any order gives the same frame.
//
//   const L = LivingW({ tl, world, before, box })
//     tl      the scene timeline (default window.tl)
//     world   the camera world element (default #world); layers live in map px and ride the camera
//     before  element inside world the layers are inserted before (default #overlay: under hatching,
//             arrows, labels and units, which stay full strength)
//     box     [x, y, w, h] of the map in map px (default [0, 0, 2880, 1620])
//   Layer order (fixed, bottom -> top): water shimmer, cloud shadows, dust, light.
//
//   L.clouds({ t0, t1, n, opacity, wind, size, seed })   drifting cloud shadows (soft dark blobs, 6-10 %)
//   L.water(maskUrl, { t0, t1, paths, opacity, speed })  faint moving shimmer along the flow, masked to the water
//   L.dust(unitEl, t0, t1, { pos, every, life, ... })    soft tan dust puffs left behind a marching column
//   L.light(preset, t, { dur, k })                       time-of-day light: "day" | "morning" | "afternoon" | "dusk" | "night"
//                                                        blends from whatever preset is on into the new one over dur s
window.LivingW = function (cfg = {}) {
  const tl = cfg.tl || window.tl, world = cfg.world || document.getElementById("world");
  const before = cfg.before || document.getElementById("overlay");
  const [BX, BY, BW, BH] = cfg.box || [0, 0, 2880, 1620];
  const L = {};
  const mkLayer = (name) => { const d = document.createElement("div"); d.className = "lv-" + name;
    d.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;pointer-events:none"; world.insertBefore(d, before); return d; };
  const LAY = { water: mkLayer("water"), clouds: mkLayer("clouds"), dust: mkLayer("dust"), light: mkLayer("light") };
  // seeded PRNG (mulberry32): same layout on every load
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const T_END = () => (tl && tl.duration ? Math.max(tl.duration(), 1) : 60);

  // ---------------------------------------------------------------- 1. cloud shadows
  // Each cloud = 3-5 overlapping soft ellipses in one group; the GROUP carries the opacity, so overlaps never
  // get darker than `opacity` (default 0.08 = 8 %). They drift with the wind (map px / s) in a straight line.
  L.clouds = (o = {}) => {
    const t0 = o.t0 ?? 0, t1 = o.t1 ?? T_END(), dur = Math.max(0.1, t1 - t0);
    const op = o.opacity ?? 0.08, wind = o.wind || [9, -2.5], R = rng(o.seed ?? 7);
    const [smin, smax] = o.size || [380, 760];
    // spawn area = the map box extended upwind by the whole drift, so the map stays covered to the end
    const ex = wind[0] * dur, ey = wind[1] * dur;
    const x0 = BX - Math.max(0, ex) - smax * 0.5, x1 = BX + BW - Math.min(0, ex) + smax * 0.2;
    const y0 = BY - Math.max(0, ey) - smax * 0.4, y1 = BY + BH - Math.min(0, ey) + smax * 0.2;
    const n = o.n ?? Math.max(4, Math.round(((x1 - x0) * (y1 - y0)) / (smax * smax * 1.6)));
    const out = [];
    for (let i = 0; i < n; i++) {
      const w = smin + R() * (smax - smin), h = w * (0.42 + R() * 0.25);
      const cx = x0 + R() * (x1 - x0), cy = y0 + R() * (y1 - y0);
      const g = document.createElement("div");
      g.style.cssText = `position:absolute;left:${(cx - w / 2).toFixed(1)}px;top:${(cy - h / 2).toFixed(1)}px;width:${w.toFixed(1)}px;height:${h.toFixed(1)}px;opacity:${(op * (0.75 + R() * 0.25)).toFixed(4)};will-change:transform`;
      const k = 3 + Math.floor(R() * 3);
      for (let j = 0; j < k; j++) {
        const ew = w * (0.45 + R() * 0.45), eh = h * (0.5 + R() * 0.5), ex0 = R() * (w - ew), ey0 = R() * (h - eh);
        const e = document.createElement("div");
        e.style.cssText = `position:absolute;left:${ex0.toFixed(1)}px;top:${ey0.toFixed(1)}px;width:${ew.toFixed(1)}px;height:${eh.toFixed(1)}px;border-radius:50%;` +
          "background:radial-gradient(closest-side, rgba(14,14,8,1) 0%, rgba(14,14,8,.92) 40%, rgba(14,14,8,.45) 72%, rgba(14,14,8,0) 100%)";
        g.appendChild(e);
      }
      LAY.clouds.appendChild(g);
      const v = 0.8 + R() * 0.4;   // small per-cloud speed difference (parallax of the cloud deck)
      tl.fromTo(g, { x: 0, y: 0 }, { x: ex * v, y: ey * v, duration: dur, ease: "none", immediateRender: true }, t0);
      out.push(g);
    }
    return LAY.clouds;
  };

  // ---------------------------------------------------------------- 2. water shimmer
  // maskUrl = an RGBA PNG of the water at the map box size (alpha = water), e.g. mask_water.png from
  // extract_rivers.py. Two parts, both masked to the water:
  //  a) flow streaks: short pale dashes running down each path (paths = centre-lines, upstream -> downstream),
  //     extra lanes on wide rivers (o.lanes = {pathIndex: [offsets in map px]});
  //  b) a faint broad glint band sweeping slowly across all water.
  L.water = (maskUrl, o = {}) => {
    const t0 = o.t0 ?? 0, t1 = o.t1 ?? T_END(), dur = Math.max(0.1, t1 - t0), op = o.opacity ?? 0.2, speed = o.speed ?? 12;
    const box = document.createElement("div");
    const m = `url("${maskUrl}")`;
    box.style.cssText = `position:absolute;left:${BX}px;top:${BY}px;width:${BW}px;height:${BH}px;overflow:hidden;` +
      `-webkit-mask-image:${m};mask-image:${m};-webkit-mask-size:${BW}px ${BH}px;mask-size:${BW}px ${BH}px;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat`;
    LAY.water.appendChild(box);
    const NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `${BX} ${BY} ${BW} ${BH}`); svg.setAttribute("width", BW); svg.setAttribute("height", BH);
    svg.style.cssText = "position:absolute;left:0;top:0;overflow:visible";
    svg.innerHTML = `<defs><filter id="lv-wblur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="${o.blur ?? 1.3}"/></filter></defs>`;
    box.appendChild(svg);
    const offsetPath = (P, d) => P.map((q, i) => { const a = P[Math.max(i - 1, 0)], b = P[Math.min(i + 1, P.length - 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      return [q[0] + (b[1] - a[1]) / l * d, q[1] - (b[0] - a[0]) / l * d]; });
    const R = rng(o.seed ?? 3);
    (o.paths || []).forEach((P, pi) => {
      const lanes = (o.lanes && o.lanes[pi]) || [0];
      lanes.forEach((off, li) => {
        const Q = off ? offsetPath(P, off) : P;
        [[26, 70, 1.0, 1.0], [14, 93, 0.75, 0.7]].forEach(([dash, gap, a, w], k) => {   // two dash rhythms -> no visible pattern
          const p = document.createElementNS(NS, "path");
          p.setAttribute("d", "M" + Q.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" L"));
          Object.entries({ fill: "none", stroke: o.color || "rgb(226,238,236)", "stroke-opacity": (op * a).toFixed(3), "stroke-width": (o.width ?? 1.6) * w,
            "stroke-linecap": "round", "stroke-dasharray": `${dash} ${gap}`, filter: "url(#lv-wblur)" }).forEach(([kk, v]) => p.setAttribute(kk, v));
          svg.appendChild(p);
          const ph = R() * (dash + gap), v = speed * (k ? 0.72 : 1) * (1 - 0.12 * li);
          tl.fromTo(p, { attr: { "stroke-dashoffset": -ph } }, { attr: { "stroke-dashoffset": -ph - v * dur }, duration: dur, ease: "none", immediateRender: true }, t0);
        });
      });
    });
    if (o.glint !== false) {
      const gl = document.createElement("div");
      const gw = 900;
      gl.style.cssText = `position:absolute;left:${-gw}px;top:0;width:${gw}px;height:${BH}px;` +
        `background:linear-gradient(100deg, rgba(240,248,244,0) 0%, rgba(240,248,244,${(o.glintOpacity ?? 0.16).toFixed(3)}) 50%, rgba(240,248,244,0) 100%)`;
      box.appendChild(gl);
      const per = o.glintPeriod ?? 26, sweeps = Math.max(1, Math.ceil(dur / per));
      tl.fromTo(gl, { x: 0 }, { x: BW + gw, duration: per, ease: "none", repeat: sweeps - 1, immediateRender: true }, t0);
    }
    return box;
  };

  // ---------------------------------------------------------------- 3. dust behind a marching column
  // Puffs are spawned every `every` s from t0 to t1 at the column's REAR (opposite its direction of motion),
  // only while it moves. Each puff: grows, drifts downwind, fades over `life` s. Positions come from
  // o.pos(t) -> [x, y] (map px) or, by default, from the unit's own tweens: the timeline is sampled once at
  // build time (seek + restore, events suppressed), so call L.dust AFTER the unit's B.move tweens.
  L.dust = (unitEl, t0, t1, o = {}) => {
    const every = o.every ?? 0.2, life = o.life ?? 2.4, op = o.opacity ?? 0.34, size = o.size ?? 46, wind = o.wind || [6, -2];
    const col = o.color || "196,168,116", R = rng(o.seed ?? 11);
    const w = o.w ?? (parseFloat(unitEl.style.width) || unitEl.offsetWidth || 110);
    const blk = unitEl.querySelector(".blk"), h = o.h ?? ((blk && parseFloat(blk.style.height)) || unitEl.offsetHeight || 60);
    let pos = o.pos;
    if (!pos) {
      const cache = new Map();
      pos = (tt) => { const key = tt.toFixed(3); if (cache.has(key)) return cache.get(key);
        const cur = tl.time(); tl.seek(tt, true);
        const p = [gsap.getProperty(unitEl, "left") + w / 2, gsap.getProperty(unitEl, "top") + h / 2];
        tl.seek(cur, true); cache.set(key, p); return p; };
    }
    const back = o.back ?? w * 0.5, out = [];
    for (let ts = t0; ts <= t1 + 1e-6; ts += every) {
      const p = pos(ts), q = pos(Math.max(t0 - 0.25, ts - 0.25));
      const vx = p[0] - q[0], vy = p[1] - q[1], v = Math.hypot(vx, vy);
      if (v < (o.minMove ?? 1.5)) continue;                  // standing still: no dust
      const ux = vx / v, uy = vy / v, j = (R() - 0.5) * h * 0.6;
      const x = p[0] - ux * back - uy * j, y = p[1] - uy * back + ux * j;
      const sz = size * (0.7 + R() * 0.6);
      const d = document.createElement("div");
      d.style.cssText = `position:absolute;left:${(x - sz / 2).toFixed(1)}px;top:${(y - sz / 2).toFixed(1)}px;width:${sz.toFixed(1)}px;height:${(sz * 0.8).toFixed(1)}px;border-radius:50%;opacity:0;` +
        `background:radial-gradient(closest-side, rgba(${col},1) 0%, rgba(${col},.55) 45%, rgba(${col},0) 100%)`;
      LAY.dust.appendChild(d);
      const dx = wind[0] * life - ux * sz * 0.35, dy = wind[1] * life - uy * sz * 0.35;
      tl.fromTo(d, { opacity: 0, scale: 0.45, x: 0, y: 0 }, { opacity: op * (0.7 + R() * 0.3), scale: 0.9, x: dx * 0.25, y: dy * 0.25, duration: life * 0.22, ease: "sine.out", immediateRender: false }, ts);
      tl.to(d, { opacity: 0, scale: 1.7, x: dx, y: dy, duration: life * 0.78, ease: "sine.in" }, ts + life * 0.22);
      out.push(d);
    }
    return out;
  };

  // ---------------------------------------------------------------- 4. time-of-day light
  // Reuses the kit's locked washes (grant/tools/m3_kitw.js todDiv + nightWashMap; the m1/m3 bodies' values):
  //   morning   = cool soft-light  rgba(100,135,205,.55) at .45  (TOD / TODC, "cool morning light")
  //   afternoon = warm soft-light  rgba(255,165,80,.6)  at .20  (TODW, "warm 4 PM")
  //   night     = map-only wash    rgba(6,10,26)        at .40  (nightWashMap a = 0.4)
  //   dusk      = NEW, between the two: low warm sun from the west (soft-light gradient) + a light violet dim
  //   day       = all off
  // The layers sit on the MAP only (under the overlay), so units, labels, stamps and cards keep full strength,
  // like nightWashMap. k scales a preset's strength (e.g. k: 0.7).
  const PRESETS = {
    morning: [{ bg: "rgba(100,135,205,.55)", blend: "soft-light", op: 0.45 }],
    afternoon: [{ bg: "rgba(255,165,80,.6)", blend: "soft-light", op: 0.2 }],
    dusk: [{ bg: "linear-gradient(to left, rgba(255,130,60,.75), rgba(240,115,85,.5) 55%, rgba(170,100,140,.35))", blend: "soft-light", op: 0.7 },
           { bg: "rgb(34,22,48)", blend: "normal", op: 0.22 }],
    night: [{ bg: "rgb(6,10,26)", blend: "normal", op: 0.4 }, { bg: "rgba(70,100,170,.6)", blend: "soft-light", op: 0.25 }],
    day: [],
  };
  const lightEls = {};
  Object.entries(PRESETS).forEach(([name, layers]) => {
    lightEls[name] = layers.map((ly) => { const d = document.createElement("div");
      d.style.cssText = `position:absolute;left:${BX - 3000}px;top:${BY - 3000}px;width:${BW + 6000}px;height:${BH + 6000}px;background:${ly.bg};mix-blend-mode:${ly.blend};opacity:0`;
      LAY.light.appendChild(d); return { el: d, op: ly.op }; });
  });
  L.light = (preset, t, o = {}) => {
    if (!(preset in PRESETS)) throw new Error("LivingW.light: unknown preset " + preset);
    const dur = o.dur ?? 2.0, k = o.k ?? 1;
    Object.entries(lightEls).forEach(([name, arr]) => arr.forEach(({ el, op }) => {
      const target = name === preset ? op * k : 0;
      if (dur <= 0) tl.set(el, { opacity: target }, t); else tl.to(el, { opacity: target, duration: dur, ease: "sine.inOut" }, t);
    }));
  };
  L.presets = PRESETS; L.layers = LAY;
  return L;
};
