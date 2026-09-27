// FX kit v2 (Kings-and-Generals-inspired, kept flat and simple): detailed top-down aircraft with ground
// shadows, spinning rotors/props and dotted flight paths; artillery that fires (muzzle flash, smoke, recoil);
// impacts with fireball, rising smoke and a small camera shake; unit counters with icons, flags and size marks.
// Usage in a scene:  const K = FXK(B);  then K.aircraft({...}), K.gun(...), K.impact(...), K.counter(...).
// Everything is placed on the one paused timeline (B.tl), so renders stay deterministic.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const COL = { carth: "#1f4fc4", rome: "#c4121f" }; // same as --carth / --rome in battle.css
  const INK = "#f7f3ea";

  // ---- aircraft art: top-down, nose pointing +x, drawn around (0,0) in a -50..50 box ----
  const ART = {
    heli: (c) => `
      <path d="M-4 -2.2 L-40 -1.4 L-40 1.4 L-4 2.2 Z" fill="${c}" stroke="${INK}" stroke-width="1.4"/>
      <rect x="-44" y="-8" width="5" height="16" rx="1.5" fill="${c}" stroke="${INK}" stroke-width="1.2"/>
      <line x1="-2" y1="-12.5" x2="24" y2="-12.5" stroke="#1b1812" stroke-width="2.4" stroke-linecap="round"/>
      <line x1="-2" y1="12.5" x2="24" y2="12.5" stroke="#1b1812" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M-12 0 C-12 -9 0 -11.5 12 -10.5 C22 -9.5 29 -5 29 0 C29 5 22 9.5 12 10.5 C0 11.5 -12 9 -12 0 Z" fill="${c}" stroke="${INK}" stroke-width="1.6"/>
      <path d="M17 -6.5 C24 -5.5 28 -3 28 0 C28 3 24 5.5 17 6.5 C19 3 19 -3 17 -6.5 Z" fill="#bfe3ff" opacity="0.9"/>
      <g class="trotor" transform="translate(-41.5 9)"><rect x="-6" y="-1" width="12" height="2" fill="#1b1812"/></g>
      <g class="rotor" transform="translate(8 0)">
        <circle r="31" fill="rgba(235,235,230,0.16)" stroke="rgba(255,255,255,0.45)" stroke-width="0.8"/>
        <g class="blades"><rect x="-31" y="-1.1" width="62" height="2.2" rx="1" fill="#3b3833" opacity="0.85"/><rect x="-1.1" y="-31" width="2.2" height="62" rx="1" fill="#3b3833" opacity="0.85"/></g>
        <circle r="3" fill="#3a3a3a"/></g>`,
    jet: (c) => `
      <path d="M36 0 L26 -3.2 L-18 -4.2 L-30 -3 L-30 3 L-18 4.2 L26 3.2 Z" fill="${c}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M10 -3.5 L-8 -26 L-16 -26 L-8 -3.8 Z M10 3.5 L-8 26 L-16 26 L-8 3.8 Z" fill="${c}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M-20 -3.6 L-30 -13 L-35 -13 L-28 -3.4 Z M-20 3.6 L-30 13 L-35 13 L-28 3.4 Z" fill="${c}" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/>
      <ellipse cx="20" cy="0" rx="7" ry="2.3" fill="#bfe3ff"/>
      <circle class="burn" cx="-32" cy="0" r="3.6" fill="#ffb347"/>`,
    turboprop: (c) => `
      <path d="M32 0 C30 -3 24 -3.4 18 -3.4 L-30 -2.4 L-30 2.4 L18 3.4 C24 3.4 30 3 32 0 Z" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
      <rect x="-3" y="-34" width="11" height="68" rx="2.5" fill="${c}" stroke="${INK}" stroke-width="1.5"/>
      <rect x="-32" y="-11" width="6" height="22" rx="1.5" fill="${c}" stroke="${INK}" stroke-width="1.3"/>
      <rect x="0" y="-17" width="18" height="6" rx="2.5" fill="${c}" stroke="${INK}" stroke-width="1.3"/>
      <rect x="0" y="11" width="18" height="6" rx="2.5" fill="${c}" stroke="${INK}" stroke-width="1.3"/>
      <ellipse cx="22" cy="0" rx="6.5" ry="2.3" fill="#bfe3ff"/>
      <g class="prop" transform="translate(19 -14)"><circle r="8.5" fill="rgba(235,235,230,0.25)"/><g class="blades"><rect x="-1" y="-8.5" width="2" height="17" fill="#1b1812"/><rect x="-8.5" y="-1" width="17" height="2" fill="#1b1812"/></g></g>
      <g class="prop" transform="translate(19 14)"><circle r="8.5" fill="rgba(235,235,230,0.25)"/><g class="blades"><rect x="-1" y="-8.5" width="2" height="17" fill="#1b1812"/><rect x="-8.5" y="-1" width="17" height="2" fill="#1b1812"/></g></g>`,
  };
  // ---- counter icons (side view silhouettes, like K&G counters) ----
  const ICON = {
    artillery: `<g fill="${INK}"><rect x="30" y="44" width="58" height="11" rx="3" transform="rotate(-24 36 52)"/><circle cx="38" cy="64" r="15" fill="none" stroke="${INK}" stroke-width="7"/><circle cx="38" cy="64" r="4"/><path d="M36 60 L10 82 L16 86 L40 66 Z"/></g>`,
    aa: `<g fill="${INK}"><rect x="46" y="16" width="7" height="46" rx="2" transform="rotate(28 50 62)"/><rect x="58" y="16" width="7" height="46" rx="2" transform="rotate(28 62 62)"/><path d="M22 84 L78 84 L70 64 L30 64 Z"/><circle cx="50" cy="64" r="9"/></g>`,
    infantry: `<line x1="4" y1="4" x2="96" y2="96" stroke="${INK}" stroke-width="8"/><line x1="96" y1="4" x2="4" y2="96" stroke="${INK}" stroke-width="8"/>`,
    hq: `<g fill="${INK}"><rect x="30" y="16" width="5" height="70"/><path d="M35 18 L78 30 L35 44 Z"/></g>`,
  };

  window.FXK = function (B) {
    const tl = B.tl, pins = document.getElementById("pins"), ov = document.getElementById("overlay"), scene = document.getElementById("scene");
    if (!document.getElementById("fxk-css")) {
      const css = document.createElement("style"); css.id = "fxk-css";
      css.textContent = `
        .fxk-air { position:absolute; left:0; top:0; width:0; height:0; }
        .fxk-air svg { position:absolute; overflow:visible; }
        .fxk-puff { position:absolute; border-radius:50%; background: radial-gradient(circle, rgba(70,66,60,0.75) 0%, rgba(90,86,80,0.45) 45%, rgba(110,106,100,0) 72%); }
        .fxk-fire { position:absolute; border-radius:50%; background: radial-gradient(circle, #fffbe6 0%, #ffd34d 22%, rgba(255,120,20,0.9) 48%, rgba(200,40,0,0.5) 62%, rgba(120,20,0,0) 74%); }
        .fxk-ring { position:absolute; border-radius:50%; border: 2px solid rgba(255,230,180,0.9); }
        .fxk-flag { position:absolute; border:1px solid ${INK}; box-shadow:0 1px 3px rgba(0,0,0,0.6); z-index:2; }
        .fxk-size { position:absolute; left:0; right:0; text-align:center; font-weight:700; color:#1b1812; letter-spacing:0.05em; text-shadow: 0 0 2px #f7f3ea, 0 0 2px #f7f3ea; }`;
      document.head.appendChild(css);
    }
    const hide = (el) => gsap.set(el, { autoAlpha: 0 });
    const K = {};
    const div = (cls, x, y, w, h) => {
      const el = document.createElement("div"); el.className = cls;
      Object.assign(el.style, { left: x - w / 2 + "px", top: y - h / 2 + "px", width: w + "px", height: h + "px" });
      pins.appendChild(el); hide(el); return el;
    };

    // rising, spreading smoke puffs
    K.smoke = (x, y, t, o = {}) => {
      const n = o.n || 4, r = o.r || 14, life = o.life || 2.6;
      for (let i = 0; i < n; i++) {
        const el = div("fxk-puff", x + ((i * 7) % 11) - 5, y, r * 2, r * 2);
        const t0 = t + i * (o.gap || 0.18);
        tl.fromTo(el, { autoAlpha: 0, scale: 0.4, x: 0, y: 0 }, { autoAlpha: o.alpha || 0.85, scale: 1, duration: 0.35, ease: "power1.out", immediateRender: false }, t0);
        tl.to(el, { autoAlpha: 0, scale: 2.2, x: (o.drift || 10) + i * 3, y: -(o.rise || 30) - i * 6, duration: life, ease: "sine.out" }, t0 + 0.35);
      }
    };
    // small camera shake (screen space, does not fight the camera)
    K.shake = (t, amp = 5, dur = 0.35) => {
      const n = Math.max(3, Math.round(dur / 0.05));
      for (let i = 0; i < n; i++) tl.to(scene, { x: (i % 2 ? -1 : 1) * amp * (1 - i / n), y: ((i * 3) % 2 ? 1 : -1) * amp * 0.6 * (1 - i / n), duration: 0.05, ease: "none" }, t + i * 0.05);
      tl.to(scene, { x: 0, y: 0, duration: 0.05 }, t + n * 0.05);
    };
    // explosion: fireball + shock ring + smoke (+ shake + sound)
    K.impact = (x, y, t, o = {}) => {
      const r = o.r || 16;
      const f = div("fxk-fire", x, y, r * 2, r * 2);
      tl.fromTo(f, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1.15, duration: 0.14, ease: "power2.out", immediateRender: false }, t);
      tl.to(f, { autoAlpha: 0, scale: 1.6, duration: 0.55, ease: "power1.in" }, t + 0.16);
      const ring = div("fxk-ring", x, y, r * 2, r * 2);
      tl.fromTo(ring, { autoAlpha: 0.9, scale: 0.3 }, { autoAlpha: 0, scale: 2.4, duration: 0.5, ease: "power2.out", immediateRender: false }, t);
      K.smoke(x, y - r * 0.2, t + 0.15, { n: o.puffs || 3, r: r * 0.9, rise: r * 2, life: o.life || 2.4 });
      if (o.shake !== false) K.shake(t, o.shake || (r >= 20 ? 6 : 3));
      if (window.SFX && o.sfx !== false) SFX(o.sfx || (r >= 20 ? "explosion" : "impact"), t);
    };
    // artillery piece firing: muzzle flash, smoke and a little recoil on its counter
    K.gun = (x, y, t, o = {}) => {
      const f = div("fxk-fire", x + (o.dx || 10), y + (o.dy || -8), 16, 16);
      tl.fromTo(f, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.06, immediateRender: false }, t);
      tl.to(f, { autoAlpha: 0, scale: 1.4, duration: 0.25 }, t + 0.07);
      K.smoke(x + (o.dx || 10), y + (o.dy || -8), t + 0.05, { n: 2, r: 8, rise: 14, life: 1.8, alpha: 0.7 });
      if (o.unit && B.units[o.unit]) {
        const blk = B.units[o.unit].el.querySelector(".blk");
        tl.to(blk, { x: -3, duration: 0.05 }, t); tl.to(blk, { x: 0, duration: 0.3, ease: "power2.out" }, t + 0.05);
      }
      if (window.SFX && o.sfx !== false) SFX(o.sfx || "fire", t);
    };

    // counter styling: icon, flag chip, size marker ("I" company, "II" battalion, "III" regiment)
    K.counter = (id, o = {}) => {
      const u = B.units[id]; if (!u) return;
      const blk = u.el.querySelector(".blk"), sv = blk.querySelector("svg");
      if (o.icon && ICON[o.icon]) { sv.setAttribute("preserveAspectRatio", o.icon === "infantry" ? "none" : "xMidYMid meet"); sv.innerHTML = ICON[o.icon]; }
      if (o.flag) {
        const img = document.createElement("img"); img.className = "fxk-flag";
        img.src = o.flag === "uk" ? "assets/media/uk_flag.png" : "assets/media/arg_flag.png";
        Object.assign(img.style, { height: u.h * 0.55 + "px", left: -u.h * 0.35 + "px", top: -u.h * 0.3 + "px" });
        u.el.appendChild(img);
      }
      if (o.size) {
        const s = document.createElement("div"); s.className = "fxk-size"; s.textContent = o.size;
        s.style.fontSize = Math.max(7, u.h * 0.42) + "px"; s.style.top = -(u.h * 0.55) + "px";
        u.el.insertBefore(s, u.el.firstChild); u.el.style.overflow = "visible";
      }
    };

    // aircraft flying a polyline: o = { kind: heli|jet|turboprop, side, pts, t, dur, size, alt, path: true,
    //   until, down: time it is hit (smoke trail, spin, crash explosion), land: true (shadow meets the aircraft) }
    K.aircraft = (o) => {
      const size = o.size || 40, c = COL[o.side] || o.side, alt = o.alt != null ? o.alt : size * 0.35;
      const pts = o.pts, segs = [];
      let total = 0;
      for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); total += d; }
      const t0 = o.t, dur = o.dur || 4, tEnd = t0 + dur;
      const posAt = (tt) => { // position + heading at time tt (linear along the polyline)
        let d = Math.max(0, Math.min(1, (tt - t0) / dur)) * total;
        for (let i = 0; i < segs.length; i++) {
          if (d <= segs[i] || i === segs.length - 1) {
            const a = pts[i], b = pts[i + 1], f = Math.min(1, d / (segs[i] || 1));
            return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI];
          }
          d -= segs[i];
        }
      };
      // dotted flight path
      if (o.path !== false) {
        const pl = document.createElementNS(NS, "polyline");
        pl.setAttribute("points", pts.map((p) => p.join(",")).join(" "));
        pl.setAttribute("fill", "none"); pl.setAttribute("stroke", c); pl.setAttribute("stroke-width", Math.max(1.5, size * 0.05));
        pl.setAttribute("stroke-dasharray", `${size * 0.12} ${size * 0.18}`); pl.setAttribute("opacity", "0");
        ov.appendChild(pl);
        tl.to(pl, { opacity: 0.8, duration: 0.4 }, t0 - 0.4);
        tl.to(pl, { opacity: 0, duration: 0.6 }, (o.down || tEnd) + 0.6);
      }
      const wrap = document.createElement("div"); wrap.className = "fxk-air"; pins.appendChild(wrap); hide(wrap);
      const k = size / 100;
      const shadow = document.createElementNS(NS, "svg"), body = document.createElementNS(NS, "svg");
      [shadow, body].forEach((s) => { s.setAttribute("viewBox", "-50 -50 100 100"); s.setAttribute("width", size); s.setAttribute("height", size); s.style.left = -size / 2 + "px"; s.style.top = -size / 2 + "px"; });
      shadow.innerHTML = `<g fill="rgba(0,0,0,0.38)" stroke="none" style="filter:blur(1.2px)">${ART[o.kind](c).replace(/fill="[^"]*"/g, 'fill="rgba(0,0,0,0.38)"').replace(/stroke="[^"]*"/g, 'stroke="none"')}</g>`;
      body.innerHTML = ART[o.kind](c);
      body.style.filter = "drop-shadow(0 1px 1.5px rgba(0,0,0,0.6))";
      wrap.appendChild(shadow); wrap.appendChild(body);
      gsap.set(shadow, { x: alt * 0.9, y: alt });
      // movement: sample every 0.1 s (straight segments keep their heading)
      const last = o.down ? Math.min(o.down, tEnd) : tEnd;
      const p0 = posAt(t0);
      gsap.set(wrap, { left: p0[0], top: p0[1] });
      gsap.set([shadow, body], { rotation: p0[2] });
      tl.to(wrap, { autoAlpha: 1, duration: 0.3 }, t0);
      let prevRot = p0[2];
      for (let tt = t0; tt < last - 1e-6; tt += 0.1) {
        const step = Math.min(0.1, last - tt), p = posAt(tt + step);
        let r = p[2]; while (r - prevRot > 180) r -= 360; while (r - prevRot < -180) r += 360; prevRot = r;
        tl.to(wrap, { left: p[0], top: p[1], duration: step, ease: "none" }, tt);
        tl.to([shadow, body], { rotation: r, duration: step, ease: "none" }, tt);
      }
      // rotor / prop spin + jet burner flicker
      const spinEnd = o.down ? o.down + 1.4 : (o.until || tEnd + 3);
      body.querySelectorAll(".rotor .blades, .prop .blades").forEach((g) => {
        gsap.set(g, { svgOrigin: "0 0" });
        tl.to(g, { rotation: 360 * 5 * (spinEnd - t0), duration: spinEnd - t0, ease: "none" }, t0);
      });
      body.querySelectorAll(".burn").forEach((b) => tl.to(b, { opacity: 0.35, duration: 0.08, yoyo: true, repeat: Math.round((spinEnd - t0) / 0.08), ease: "none" }, t0));
      if (o.land) tl.to(shadow, { x: 0, y: 0, duration: Math.min(1.5, dur * 0.4), ease: "power1.in" }, tEnd - Math.min(1.5, dur * 0.4));
      if (o.down) { // hit: smoke trail, spiral down, crash
        const p = posAt(o.down);
        K.impact(p[0], p[1], o.down, { r: size * 0.35, puffs: 2, shake: false, sfx: "impact" });
        for (let i = 0; i < 8; i++) {
          const q = [p[0] + Math.cos((p[2] * Math.PI) / 180) * i * size * 0.12, p[1] + Math.sin((p[2] * Math.PI) / 180) * i * size * 0.12];
          K.smoke(q[0], q[1], o.down + 0.1 + i * 0.12, { n: 1, r: size * 0.18, rise: 6, life: 2.2, alpha: 0.7 });
        }
        const crash = [p[0] + Math.cos((p[2] * Math.PI) / 180) * size, p[1] + Math.sin((p[2] * Math.PI) / 180) * size];
        tl.to(wrap, { left: crash[0], top: crash[1], duration: 1.2, ease: "power1.in" }, o.down);
        tl.to(body, { rotation: prevRot + 400, scale: 0.55, duration: 1.2, ease: "power1.in" }, o.down);
        tl.to(shadow, { x: 0, y: 0, scale: 0.55, duration: 1.2, ease: "power1.in" }, o.down);
        K.impact(crash[0], crash[1], o.down + 1.2, { r: size * 0.6, puffs: 4, shake: 5 });
        tl.to(wrap, { autoAlpha: 0, duration: 0.15 }, o.down + 1.25);
      } else if (o.until != null) tl.to(wrap, { autoAlpha: 0, duration: 0.5 }, o.until);
      return wrap;
    };

    // K&G-style front: crisp centre line with a soft glowing colour band on each side (sideA = left of travel
    // direction, sideB = right), drawn on like an arrow; o.to (same point count) morphs it at o.moveT.
    K.front = (o) => {
      const w = o.width || 26, A = COL[o.sideA] || o.sideA || COL.carth, Bc = COL[o.sideB] || o.sideB || COL.rome;
      const off = (pts, d) => pts.map((p, i) => { // offset each vertex along the averaged normal
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
        const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
        return [p[0] - (dy / L) * d, p[1] + (dx / L) * d];
      });
      const dStr = (pts) => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
      if (!document.getElementById("fxk-blur")) {
        const defs = document.createElementNS(NS, "defs");
        defs.innerHTML = `<filter id="fxk-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${w * 0.35}"/></filter>`;
        ov.insertBefore(defs, ov.firstChild);
      }
      const g = document.createElementNS(NS, "g");
      const layer = (d, col, sw, op, blur) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}" ${blur ? 'filter="url(#fxk-blur)"' : ""}/>`;
      const build = (pts) => [layer(dStr(off(pts, -w * 0.55)), A, w, 0.55, true), layer(dStr(off(pts, w * 0.55)), Bc, w, 0.55, true),
        layer(dStr(pts), "rgba(20,16,10,0.55)", w * 0.3, 1, false), layer(dStr(off(pts, -w * 0.09)), A, w * 0.16, 1, false), layer(dStr(off(pts, w * 0.09)), Bc, w * 0.16, 1, false)];
      g.innerHTML = build(o.pts).join("");
      ov.insertBefore(g, ov.children[1] || null);
      const paths = [...g.querySelectorAll("path")];
      const lens = paths.map((p) => p.getTotalLength() + w * 2);
      paths.forEach((p, i) => gsap.set(p, { strokeDasharray: `${lens[i]} ${lens[i]}`, strokeDashoffset: lens[i] }));
      tl.to(paths, { strokeDashoffset: 0, duration: o.dur || 2.0, ease: "power1.inOut" }, o.t);
      // gentle glow pulse
      tl.to(paths.slice(0, 2), { opacity: 0.8, duration: 1.2, yoyo: true, repeat: Math.max(1, Math.round(((o.until || o.t + 20) - o.t) / 1.2)), ease: "sine.inOut" }, o.t + (o.dur || 2));
      if (o.to) {
        const nd = build(o.to).map((h) => h.match(/ d="([^"]*)"/)[1]);
        paths.forEach((p, i) => tl.to(p, { attr: { d: nd[i] }, duration: o.moveDur || 2, ease: "power1.inOut" }, o.moveT));
      }
      if (o.until != null) tl.to(g, { opacity: 0, duration: 0.8 }, o.until);
      return g;
    };

    // screen-space element helper (above the map, under the credit)
    const screen = (html, style) => {
      const el = document.createElement("div"); el.style.cssText = "position:absolute;" + style; el.innerHTML = html;
      scene.insertBefore(el, document.getElementById("credit")); hide(el); return el;
    };
    // commander badge (K&G): round portrait (or initials) on the side's flag, name plate; slides in at a corner.
    // o = { name, role, photo: "assets/media/x.png" | null, flag: "uk"|"arg", side, corner: "tl"|"tr"|"bl"|"br", t, until }
    K.badge = (o) => {
      const c = COL[o.side] || COL.carth, flag = o.flag === "arg" ? "assets/media/arg_flag.png" : "assets/media/uk_flag.png";
      const face = o.photo ? `<img src="${o.photo}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">`
        : `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:62px;font-weight:700;color:#f7f3ea;text-shadow:0 3px 6px rgba(0,0,0,0.8)">${o.initials || ""}</div>`;
      const pos = { tl: "left:60px;top:150px;", tr: "right:60px;top:110px;", bl: "left:60px;bottom:140px;", br: "right:60px;bottom:140px;" }[o.corner || "tr"];
      const el = screen(`<div style="display:flex;align-items:center;gap:18px;${o.corner && o.corner[1] === "l" ? "" : "flex-direction:row-reverse;"}">
        <div style="position:relative;width:170px;height:170px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px ${c},0 12px 26px rgba(0,0,0,0.6);background:url(${flag}) center/cover">${face}</div>
        <div style="padding:10px 20px 12px;background:rgba(18,16,12,0.9);border-${o.corner && o.corner[1] === "l" ? "left" : "right"}:6px solid ${c};color:#f7f3ea;font-weight:700">
          <div style="font-size:34px;letter-spacing:0.06em;white-space:nowrap">${o.name}</div><div style="font-size:20px;letter-spacing:0.14em;color:#d8cfb8;white-space:nowrap">${o.role || ""}</div></div></div>`, pos);
      const dx = o.corner && o.corner[1] === "l" ? -80 : 80;
      tl.fromTo(el, { autoAlpha: 0, x: dx }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }, o.t);
      if (o.until != null) tl.to(el, { autoAlpha: 0, x: dx, duration: 0.5, ease: "power2.in" }, o.until);
      if (window.SFX) SFX("whoosh", o.t);
      return el;
    };
    // casualty card (K&G): two columns (sideA / sideB) of rows with pictograms. rows: [["killed", "18", "45–55"], ...]
    const PICT = {
      killed: `<svg width="34" height="34" viewBox="0 0 100 100"><path d="M50 8 C24 8 12 26 12 46 C12 60 20 68 28 72 L28 88 L72 88 L72 72 C80 68 88 60 88 46 C88 26 76 8 50 8 Z" fill="#f7f3ea"/><circle cx="35" cy="46" r="10" fill="#1b1812"/><circle cx="65" cy="46" r="10" fill="#1b1812"/><path d="M50 58 L44 68 L56 68 Z" fill="#1b1812"/></svg>`,
      wounded: `<svg width="34" height="34" viewBox="0 0 100 100"><rect x="38" y="10" width="24" height="80" rx="6" fill="#f7f3ea"/><rect x="10" y="38" width="80" height="24" rx="6" fill="#f7f3ea"/><rect x="42" y="42" width="16" height="16" fill="#c4121f"/></svg>`,
      captured: `<svg width="34" height="34" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="6" fill="none" stroke="#f7f3ea" stroke-width="8"/><g fill="#f7f3ea"><rect x="28" y="10" width="8" height="80"/><rect x="46" y="10" width="8" height="80"/><rect x="64" y="10" width="8" height="80"/></g></svg>`,
      aircraft: `<svg width="34" height="34" viewBox="-50 -50 100 100"><path d="M40 0 L28 -5 L-24 -6 L-34 -4 L-34 4 L-24 6 L28 5 Z M12 -5 L-8 -34 L-18 -34 L-8 -5 Z M12 5 L-8 34 L-18 34 L-8 5 Z" fill="#f7f3ea"/></svg>`,
    };
    K.casualties = (o) => {
      const col = (flag, head, c, vals) => `<div style="min-width:230px"><div style="display:flex;align-items:center;gap:12px;padding-bottom:10px;margin-bottom:10px;border-bottom:3px solid ${c}">
          <img src="${flag}" style="height:34px;border:1px solid #f7f3ea"><div style="font-size:30px;letter-spacing:0.08em">${head}</div></div>
          ${o.rows.map((r, i) => `<div style="display:flex;align-items:center;gap:14px;font-size:38px;line-height:1.5">${PICT[r[0]] || ""}<span>${vals[i]}</span></div>`).join("")}</div>`;
      const el = screen(`<div style="display:flex;gap:60px;padding:28px 50px 30px;background:rgba(18,16,12,0.92);border-top:6px solid #c9b48a;color:#f7f3ea;font-weight:700;box-shadow:0 20px 40px rgba(0,0,0,0.55)">
        ${col("assets/media/uk_flag.png", o.headA || "BRITISH", COL.carth, o.rows.map((r) => r[1]))}${col("assets/media/arg_flag.png", o.headB || "ARGENTINE", COL.rome, o.rows.map((r) => r[2]))}</div>`,
        `left:0;right:0;top:${o.top || 250}px;display:flex;justify-content:center;`);
      tl.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, o.t);
      if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, o.until);
      if (window.SFX) SFX("hit", o.t + 0.2);
      return el;
    };
    // pulsing objective ring (world space)
    K.target = (x, y, t, o = {}) => {
      const r = o.r || 40, c = COL[o.side] || o.side || "#ffd54a";
      const els = [0, 1].map((k) => {
        const el = div("", x, y, r * 2, r * 2);
        el.style.cssText += `border-radius:50%;border:${Math.max(2, r * 0.08)}px solid ${c};box-shadow:0 0 ${r * 0.4}px ${c};`;
        tl.fromTo(el, { autoAlpha: 0.95, scale: 0.6 }, { autoAlpha: 0, scale: 1.6, duration: 1.6, repeat: Math.max(0, Math.round(((o.until || t + 6) - t) / 1.6) - 1), ease: "sine.out", immediateRender: false }, t + k * 0.8);
        return el;
      });
      return els;
    };
    // faint lat/long grid over the map (world space); pass the scene's projection G and bounds
    K.grid = (G, lat0, lat1, lon0, lon1, step, t) => {
      const g = document.createElementNS(NS, "g");
      let h = "";
      for (let la = Math.ceil(lat0 / step) * step; la <= lat1; la += step) { const a = G(la, lon0), b = G(la, lon1); h += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`; }
      for (let lo = Math.ceil(lon0 / step) * step; lo <= lon1; lo += step) { const a = G(lat0, lo), b = G(lat1, lo); h += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`; }
      g.innerHTML = h; g.setAttribute("stroke", "rgba(60,50,30,0.22)"); g.setAttribute("stroke-width", "1.5"); g.setAttribute("stroke-dasharray", "6 8");
      ov.insertBefore(g, ov.firstChild); gsap.set(g, { opacity: 0 }); tl.to(g, { opacity: 1, duration: 1.5 }, t || 0);
      return g;
    };
    return K;
  };
})();
