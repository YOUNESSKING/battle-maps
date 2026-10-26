// Battle-map engine for HyperFrames: one paused GSAP timeline, deterministic, no network.
// A scene file calls Battle(opts) and then adds units, arrows, cards etc. at times taken
// from the narration timing (window.SCENE_TIMING, written by tools/build_scene.py).
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const W = 1920, H = 1080;

  function rng(seed) { // mulberry32, seeded so every render is identical
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function smoothPath(pts) { // Catmull-Rom through points -> cubic Bezier SVG path
    if (pts.length === 2) return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`;
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
      d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}, ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}, ${p2[0]} ${p2[1]}`;
    }
    return d;
  }

  const ICONS = {
    inf: `<line x1="0" y1="0" x2="100" y2="100" stroke="#f7f3ea" stroke-width="7"/><line x1="100" y1="0" x2="0" y2="100" stroke="#f7f3ea" stroke-width="7"/>`,
    cav: `<line x1="0" y1="100" x2="100" y2="0" stroke="#f7f3ea" stroke-width="8"/>`,
    light: `<circle cx="30" cy="50" r="9" fill="#f7f3ea"/><circle cx="70" cy="50" r="9" fill="#f7f3ea"/>`,
    eleph: `<g fill="#f7f3ea"><ellipse cx="52" cy="50" rx="26" ry="18"/><circle cx="26" cy="40" r="13"/><path d="M16 44 Q8 62 14 78 L20 76 Q16 62 24 50 Z"/><rect x="34" y="60" width="8" height="22"/><rect x="60" y="60" width="8" height="22"/></g>`,
  };

  window.Battle = function (opts) {
    const T = window.SCENE_TIMING;
    const tl = gsap.timeline({ paused: true });
    const world = document.getElementById("world");
    const svg = document.getElementById("overlay");
    const pins = document.getElementById("pins");
    const scene = document.getElementById("scene");
    const fx = document.getElementById("fx");
    const B = { tl, T, units: {} };
    let uid = 0;
    const id = (p) => `${p}-${++uid}`;

    // time helper: P("trebia-4") = start of that paragraph (scene-relative); P("trebia-4", 2.5) = +2.5 s
    B.P = (key, off = 0) => {
      const p = T.paras[key];
      if (!p) throw new Error("unknown paragraph " + key);
      return p[0] + off;
    };
    B.end = (key, off = 0) => T.paras[key][1] + off;
    // B.at("trebia-4", "stream bed") = estimated moment that phrase is spoken (proportional to text position)
    B.at = (key, phrase, off = 0) => {
      const [s0, s1] = T.paras[key], text = T.text[key], i = text.indexOf(phrase);
      if (i < 0) throw new Error(`phrase "${phrase}" not in ${key}`);
      return s0 + (s1 - s0) * (i / text.length) + off;
    };

    const hide = (el) => gsap.set(el, { autoAlpha: 0 });
    const reveal = (el, t, extra = {}, dur = 0.5) =>
      tl.fromTo(el, { autoAlpha: 0, ...extra.from }, { autoAlpha: 1, duration: dur, ease: "power2.out", ...extra.to }, t);
    const out = (el, t, dur = 0.4) => tl.to(el, { autoAlpha: 0, duration: dur }, t);

    // ---------- camera ----------
    B.camera = (keys) => {
      const cam = { cx: keys[0][1], cy: keys[0][2], s: keys[0][3] };
      const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
      const apply = () => { // keep the viewport inside the map so no black edges show
        const s = Math.max(cam.s, W / 2880), cx = clamp(cam.cx, W / 2 / s, 2880 - W / 2 / s), cy = clamp(cam.cy, H / 2 / s, 1620 - H / 2 / s);
        gsap.set(world, { x: W / 2 - cx * s, y: H / 2 - cy * s, scale: s });
      };
      apply();
      for (let i = 1; i < keys.length; i++) {
        const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
        tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: "sine.inOut", onUpdate: apply }, t0);
      }
    };

    // ---------- world elements ----------
    B.river = (pts, width = 22, label) => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", smoothPath(pts));
      p.setAttribute("fill", "none"); p.setAttribute("stroke", "var(--river)");
      p.setAttribute("stroke-width", width); p.setAttribute("stroke-linecap", "round"); p.setAttribute("opacity", "0.9");
      svg.insertBefore(p, svg.firstChild);
      if (label) B.label(label.text, label.x, label.y, { cls: "river", size: label.size || 30, t: 0, rot: label.rot || 0, instant: true });
      return p;
    };

    B.label = (text, x, y, o = {}) => {
      const el = document.createElement("div");
      el.className = "place " + (o.cls || "");
      el.textContent = text;
      el.style.left = x + "px"; el.style.top = y + "px"; el.style.fontSize = (o.size || 34) + "px";
      if (o.rot) el.style.rotate = o.rot + "deg";
      pins.appendChild(el);
      if (!o.instant) { hide(el); reveal(el, o.t || 0, { from: { y: 10 }, to: { y: 0 } }, 0.6); }
      if (o.until != null) out(el, o.until);
      return el;
    };

    B.unit = (u) => {
      const el = document.createElement("div");
      el.className = `unit ${u.side}`;
      const w = u.w || 110, h = u.h || 60;
      el.style.left = (u.x - w / 2) + "px"; el.style.top = (u.y - h / 2) + "px"; el.style.width = w + "px";
      el.innerHTML = `<div class="blk" style="width:${w}px;height:${h}px;${u.rot ? `rotate:${u.rot}deg;` : ""}">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">${ICONS[u.kind || "inf"]}</svg></div>` +
        (u.label ? `<div class="tag">${u.label}</div>` : "");
      pins.appendChild(el);
      B.units[u.id] = { el, w, h, x: u.x, y: u.y };
      hide(el);
      if (u.t != null) {
        tl.fromTo(el, { autoAlpha: 0, y: -45, scale: 1.25 }, { autoAlpha: u.alpha || 1, y: 0, scale: 1, duration: 0.6, ease: "bounce.out" }, u.t);
      }
      return el;
    };
    B.show = (uidKey, t, alpha = 1) => tl.to(B.units[uidKey].el, { autoAlpha: alpha, duration: 0.5 }, t);
    B.move = (uidKey, t, dur, x, y, ease = "power1.inOut") => {
      const u = B.units[uidKey];
      tl.to(u.el, { left: x - u.w / 2, top: y - u.h / 2, duration: dur, ease }, t);
    };
    B.grey = (keys, t, dur = 1.0) => keys.forEach((k) => {
      const el = B.units[k].el;
      tl.to(el.querySelector(".blk"), { backgroundColor: "#77746c", duration: dur }, t);
      if (el.querySelector(".tag")) tl.to(el.querySelector(".tag"), { backgroundColor: "#77746c", duration: dur }, t);
      tl.to(el, { opacity: 0.6, duration: dur }, t);
    });
    B.hideUnits = (keys, t, dur = 0.6) => keys.forEach((k) => out(B.units[k].el, t, dur));

    B.arrow = (a) => {
      const g = document.createElementNS(NS, "g");
      const d = smoothPath(a.pts);
      const width = a.width || 22;
      const color = a.side === "rome" ? "var(--rome)" : a.side === "carth" ? "var(--carth)" : "var(--white)";
      const casing = document.createElementNS(NS, "path");
      casing.setAttribute("d", d); casing.setAttribute("fill", "none"); casing.setAttribute("stroke", "var(--white)");
      casing.setAttribute("stroke-width", width + 10); casing.setAttribute("stroke-linecap", "round");
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", d); p.setAttribute("fill", "none"); p.setAttribute("stroke", color);
      p.setAttribute("stroke-width", width); p.setAttribute("stroke-linecap", "round");
      if (a.dash) p.setAttribute("stroke-dasharray", a.dash);
      const [x2, y2] = a.pts[a.pts.length - 1], [x1, y1] = a.pts[a.pts.length - 2];
      const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 90;
      const hw = width * 1.9, hl = width * 2.6;
      const hg = document.createElementNS(NS, "g");
      hg.setAttribute("transform", `translate(${x2} ${y2}) rotate(${ang.toFixed(1)})`);
      const head = document.createElementNS(NS, "polygon");
      head.setAttribute("points", `${-hw},2 ${hw},2 0,${-hl}`);
      head.setAttribute("fill", color); head.setAttribute("stroke", "var(--white)"); head.setAttribute("stroke-width", "5"); head.setAttribute("stroke-linejoin", "round");
      hg.appendChild(head);
      g.appendChild(casing); g.appendChild(p); if (a.head !== false) g.appendChild(hg);
      svg.appendChild(g);
      const len = p.getTotalLength();
      hide(g);
      if (!a.dash) gsap.set([p, casing], { strokeDasharray: `${len} ${len}`, strokeDashoffset: len });
      gsap.set(head, { scale: 0, transformOrigin: "50% 100%" });
      const dur = a.dur || 1.4;
      tl.to(g, { autoAlpha: 1, duration: 0.01 }, a.t);
      if (!a.dash) tl.to([p, casing], { strokeDashoffset: 0, duration: dur, ease: "power2.inOut" }, a.t);
      tl.to(head, { scale: 1, duration: 0.25, ease: "back.out(2.5)" }, a.t + dur - 0.1);
      if (a.until != null) out(g, a.until, 0.6);
      return g;
    };

    B.highlight = (pts, t, until, width = 60) => { // glowing stroke along a feature (e.g. stream bed)
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", smoothPath(pts)); p.setAttribute("fill", "none"); p.setAttribute("stroke", "var(--white)");
      p.setAttribute("stroke-width", width); p.setAttribute("stroke-linecap", "round"); p.setAttribute("opacity", "0");
      svg.insertBefore(p, svg.firstChild.nextSibling);
      tl.fromTo(p, { opacity: 0 }, { opacity: 0.75, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, t);
      if (until != null) tl.to(p, { opacity: 0.35, duration: 0.5 }, t + 2.5);
      return p;
    };

    B.camp = (x, y, side, label, t) => { // palisade square + name
      const g = document.createElementNS(NS, "g");
      g.innerHTML = `<rect x="${x - 80}" y="${y - 60}" width="160" height="120" fill="${side === "rome" ? "rgba(179,38,30,0.18)" : "rgba(47,95,168,0.18)"}"
        stroke="${side === "rome" ? "var(--rome)" : "var(--carth)"}" stroke-width="8" stroke-dasharray="18 8"/>`;
      svg.appendChild(g);
      hide(g); reveal(g, t, {}, 0.6);
      B.label(label, x - 80, y + 66, { size: 26, t });
      return g;
    };

    B.plaque = (o) => {
      const el = document.createElement("div");
      el.className = `stake ${o.side || ""}`;
      el.style.left = (o.x - 19) + "px"; el.style.top = (o.y - 240) + "px";
      el.innerHTML = `<div class="pole"></div><div class="board"><div class="name">${o.name}</div>${o.role ? `<div class="role">${o.role}</div>` : ""}</div>`;
      pins.appendChild(el);
      hide(el);
      tl.fromTo(el, { autoAlpha: 0, y: -110 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "bounce.out" }, o.t);
      if (o.until != null) out(el, o.until);
      return el;
    };

    B.bubble = (text, x, y, t, until) => {
      const el = document.createElement("div");
      el.className = "bubble"; el.textContent = text;
      el.style.left = x + "px"; el.style.top = y + "px";
      pins.appendChild(el);
      hide(el);
      tl.fromTo(el, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, t);
      if (until != null) out(el, until);
      return el;
    };

    // ---------- screen elements ----------
    const screenEl = (html, cls) => {
      const el = document.createElement("div");
      el.className = cls; el.innerHTML = html;
      scene.insertBefore(el, document.getElementById("credit"));
      hide(el);
      return el;
    };
    B.caption = (text, t, until, side = "") => {
      const el = screenEl(`<span>${text}</span>`, `caption ${side}`);
      reveal(el, t, {}, 0.4); if (until != null) out(el, until, 0.3);
      return el;
    };
    B.title = (kicker, name, date, t, until) => {
      const el = screenEl(`<div class="inner"><div class="kicker">${kicker}</div><div class="h">${name}</div><div class="s">${date}</div></div>`, "card title");
      reveal(el, t, { from: { y: 30 }, to: { y: 0 } }, 0.7); if (until != null) out(el, until, 0.5);
      return el;
    };
    B.stat = (rows, t, until, side = "") => {
      const el = screenEl(`<div class="inner" style="border-top-color:var(--${side || "paper-edge"})">${rows.map((r) => `<div class="row">${r}</div>`).join("")}</div>`, "card stat");
      reveal(el, t, { from: { y: 30 }, to: { y: 0 } }, 0.6); if (until != null) out(el, until, 0.4);
      return el;
    };
    B.method = (t, until) => {
      const el = screenEl(`<div class="inner"><div class="row">CHOOSE THE GROUND</div><div class="row">CHOOSE THE MOMENT</div><div class="row">TURN THE ENEMY'S STRENGTH AGAINST HIM</div></div>`, "card method");
      reveal(el, t, {}, 0.5);
      const rows = el.querySelectorAll(".row");
      rows.forEach((r, i) => tl.fromTo(r, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out" }, t + 0.2 + i * 1.1));
      if (until != null) out(el, until, 0.5);
      return el;
    };
    B.date = (text, t, until) => {
      const box = document.getElementById("date");
      const d = document.createElement("div");
      d.className = "d"; d.textContent = text; box.appendChild(d);
      hide(d);
      tl.fromTo(d, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, t);
      if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.35 }, until);
    };
    B.showDate = (t) => { const box = document.getElementById("date"); hide(box); reveal(box, t, { from: { x: -40 }, to: { x: 0 } }, 0.7); };

    // snow: deterministic falling flakes, finite repeats
    B.snow = (t, until) => {
      const layer = document.createElement("div");
      layer.className = "fx-layer";
      const r = rng(218);
      const tall = document.createElement("div");
      tall.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:2160px;";
      for (let i = 0; i < 260; i++) {
        const x = r() * 1920, y = r() * 1080, s = 2 + r() * 4, o = 0.35 + r() * 0.5;
        for (const dy of [0, 1080]) {
          const f = document.createElement("div");
          f.style.cssText = `position:absolute;left:${x.toFixed(0)}px;top:${(y + dy).toFixed(0)}px;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;border-radius:50%;background:#fff;opacity:${o.toFixed(2)}`;
          tall.appendChild(f);
        }
      }
      layer.appendChild(tall); fx.appendChild(layer);
      hide(layer);
      const period = 7, span = until - t, reps = Math.max(Math.ceil(span / period) - 1, 0);
      reveal(layer, t, {}, 1.0);
      tl.fromTo(tall, { y: -1080, x: 0 }, { y: 0, x: -60, duration: period, ease: "none", repeat: reps }, t);
      out(layer, until, 1.0);
    };
    B.fog = (t, until, opacity = 0.75) => {
      const layer = document.createElement("div");
      layer.className = "fx-layer";
      layer.style.background = "radial-gradient(ellipse 60% 40% at 30% 60%, rgba(236,236,230,0.95), rgba(236,236,230,0) 70%), radial-gradient(ellipse 60% 45% at 75% 45%, rgba(236,236,230,0.9), rgba(236,236,230,0) 70%), rgba(230,230,224,0.35)";
      fx.appendChild(layer);
      hide(layer);
      tl.fromTo(layer, { autoAlpha: 0, x: -120 }, { autoAlpha: opacity, x: 0, duration: 2.5, ease: "sine.out" }, t);
      if (until != null) out(layer, until, 1.5);
    };

    B.finish = () => {}; // registration happens in the page template
    return B;
  };
})();
