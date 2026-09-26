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
    // B.at("trebia-4", "stream bed") = estimated moment that phrase is spoken (sentence timing + proportional position inside the sentence)
    B.at = (key, phrase, off = 0) => {
      const [s0, s1] = T.paras[key], text = T.text[key], i = text.indexOf(phrase);
      if (i < 0) throw new Error(`phrase "${phrase}" not in ${key}`);
      const ss = T.sents && T.sents[key]; // [[charStart, t0, t1], ...] per sentence (scene-relative)
      if (ss && ss.length) {
        let k = 0;
        while (k + 1 < ss.length && ss[k + 1][0] <= i) k++;
        const c0 = ss[k][0], c1 = k + 1 < ss.length ? ss[k + 1][0] : text.length;
        return ss[k][1] + (ss[k][2] - ss[k][1]) * ((i - c0) / Math.max(1, c1 - c0)) + off;
      }
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
      pins.appendChild(el);
      // anchoring through GSAP (xPercent/yPercent) so it survives the reveal tween; centred for tg/country/sea labels
      const cls = o.cls || "";
      const anc = o.anchor || (/\b(tg|country|sea)\b/.test(cls) ? [-50, -50] : /\bcity\b/.test(cls) ? [0, -50] : [0, 0]);
      gsap.set(el, { xPercent: anc[0], yPercent: anc[1], rotation: o.rot || 0 });
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
      const edge = a.side === "white" ? "rgba(22,20,16,0.7)" : "var(--white)";
      const casing = document.createElementNS(NS, "path");
      casing.setAttribute("d", d); casing.setAttribute("fill", "none"); casing.setAttribute("stroke", edge);
      casing.setAttribute("stroke-width", width + (a.side === "white" ? 8 : 10)); casing.setAttribute("stroke-linecap", "round");
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
      head.setAttribute("fill", color); head.setAttribute("stroke", edge); head.setAttribute("stroke-width", "5"); head.setAttribute("stroke-linejoin", "round");
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
    // B.method(t, until, { rowT: [t1, t2, t3], dim: [1, 2] }): rows appear at rowT (default staggered); rows listed in dim stay at 35 %
    B.METHOD = ["REFUSE TO BE HURRIED", "HOLD THE GROUND THAT MATTERS", "STRIKE TO DESTROY"];
    B.method = (t, until, o = {}) => {
      const el = screenEl(`<div class="inner">${B.METHOD.map((r) => `<div class="row">${r}</div>`).join("")}</div>`, "card method");
      reveal(el, t, {}, 0.5);
      const rows = el.querySelectorAll(".row");
      rows.forEach((r, i) => tl.fromTo(r, { autoAlpha: 0, x: -30 }, { autoAlpha: (o.dim || []).includes(i) ? 0.35 : 1, x: 0, duration: 0.5, ease: "power3.out" }, o.rowT ? o.rowT[i] : t + 0.2 + i * 1.1));
      if (until != null) out(el, until, 0.5);
      return el;
    };
    B.date = (text, t, until, size) => {
      const box = document.getElementById("date");
      const d = document.createElement("div");
      d.className = "d"; d.textContent = text; if (size) d.style.fontSize = size + "px"; box.appendChild(d);
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


    // ---------- Ridgway additions ----------
    // label centred on (x,y) when o.cls includes tg/country/sea
    B.city = (name, x, y, o = {}) => {
      const d = document.createElement("div");
      const r = o.r || 9;
      d.className = "dot"; d.style.left = (x - r) + "px"; d.style.top = (y - r) + "px"; d.style.width = d.style.height = 2 * r + "px";
      pins.appendChild(d);
      const lx = o.left ? x - r - 8 : x + r + 8;
      const el = B.label(name, lx, y + (o.dy || 0), { size: o.size || 30, cls: "city", t: o.t, until: o.until, anchor: o.left ? [-100, -50] : [0, -50] });
      hide(d); reveal(d, o.t || 0, { from: { scale: 0 }, to: { scale: 1 } }, 0.4);
      if (o.until != null) out(d, o.until);
      return el;
    };
    B.image = (src, x, y, w, h, o = {}) => { // image in world coordinates (e.g. territory overlays)
      const el = document.createElement("img");
      el.className = "wimg"; el.src = src; el.alt = "";
      Object.assign(el.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
      world.insertBefore(el, svg);
      hide(el);
      reveal(el, o.t || 0, {}, o.dur || 1.2);
      if (o.opacity != null) tl.to(el, { opacity: o.opacity, duration: 0.01 }, (o.t || 0) + (o.dur || 1.2));
      if (o.until != null) out(el, o.until, 1.0);
      return el;
    };
    let clipN = 0;
    B.line = (pts, o = {}) => { // (dashed) line revealed left-to-right with an animated clip
      const g = document.createElementNS(NS, "g");
      const cid = "clip" + (++clipN);
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const x0 = Math.min(...xs) - 40, y0 = Math.min(...ys) - 40, x1 = Math.max(...xs) + 40, y1 = Math.max(...ys) + 40;
      g.innerHTML = `<clipPath id="${cid}"><rect x="${x0}" y="${y0}" width="0" height="${y1 - y0}"/></clipPath>
        <path d="${smoothPath(pts)}" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="${(o.width || 7) + 5}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""} stroke-linecap="butt"/>
        <path d="${smoothPath(pts)}" fill="none" stroke="${o.color || "var(--white)"}" stroke-width="${o.width || 7}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""} stroke-linecap="butt"/>`;
      g.setAttribute("clip-path", `url(#${cid})`);
      svg.appendChild(g);
      tl.to(g.querySelector("rect"), { attr: { width: x1 - x0 }, duration: o.dur || 1.5, ease: "power2.inOut" }, o.t || 0);
      if (o.until != null) out(g, o.until, 0.6);
      return g;
    };
    B.front = (o) => { // thick line that draws on at o.t, then morphs to o.to (same point count) at o.moveT over o.moveDur
      const p = document.createElementNS(NS, "path"), cas = document.createElementNS(NS, "path");
      const cur = o.pts.map((q) => q.slice());
      const setD = () => { const d = smoothPath(cur.map((q) => [+q[0].toFixed(1), +q[1].toFixed(1)])); p.setAttribute("d", d); cas.setAttribute("d", d); };
      setD();
      [[cas, "var(--white)", (o.width || 12) + 8], [p, o.color || "var(--carth)", o.width || 12]].forEach(([el, c, w]) => {
        el.setAttribute("fill", "none"); el.setAttribute("stroke", c); el.setAttribute("stroke-width", w);
        el.setAttribute("stroke-linecap", "round"); el.setAttribute("stroke-linejoin", "round");
        el.setAttribute("stroke-dasharray", "6000 6000"); el.setAttribute("stroke-dashoffset", "6000");
      });
      const g = document.createElementNS(NS, "g"); g.appendChild(cas); g.appendChild(p); svg.appendChild(g);
      const len = p.getTotalLength();
      tl.to([p, cas], { strokeDashoffset: 6000 - len, duration: o.dur || 1.6, ease: "power2.inOut" }, o.t);
      tl.set([p, cas], { strokeDashoffset: 0 }, o.t + (o.dur || 1.6) + 0.02);
      if (o.to) {
        const proxy = { k: 0 };
        tl.to(proxy, { k: 1, duration: o.moveDur || 3, ease: "power1.inOut", onUpdate: () => {
          o.pts.forEach((q, i) => { cur[i][0] = q[0] + (o.to[i][0] - q[0]) * proxy.k; cur[i][1] = q[1] + (o.to[i][1] - q[1]) * proxy.k; });
          setD();
        } }, o.moveT);
      }
      if (o.until != null) out(g, o.until, 0.6);
      return g;
    };
    B.greyArrow = (g, t, until) => {
      const paths = g.querySelectorAll("path");
      tl.to(paths[1], { stroke: "#8a877f", duration: 0.6 }, t);
      const head = g.querySelector("polygon"); if (head) tl.to(head, { fill: "#8a877f", duration: 0.6 }, t);
      tl.to(g, { opacity: 0.55, duration: 0.6 }, t);
      if (until != null) out(g, until, 0.6);
    };
    B.portraitStake = (o) => { // wooden stake + round portrait + small flag, dropped in with a bounce. (x,y) = foot of the pole
      const s = o.size || 1, el = document.createElement("div");
      el.className = "gstake";
      const poleH = 120 * s, faceD = 84 * s, fpH = 64 * s, flagW = 46 * s, flagH = 28 * s;
      const W0 = Math.max(faceD, flagW * 2) + 20, H0 = poleH + faceD + fpH;
      el.style.cssText = `left:${o.x - W0 / 2}px;top:${o.y - H0}px;width:${W0}px;height:${H0}px;`;
      const cx = W0 / 2;
      el.innerHTML = `<div class="fpole" style="left:${cx - 1.5 * s}px;top:0;width:${3 * s}px;height:${fpH + 10}px"></div>
        <img class="flag" src="${o.flag}" alt="" style="left:${cx + 1.5 * s}px;top:${2 * s}px;width:${flagW}px;height:${flagH}px">
        <div class="pole" style="left:${cx - 5 * s}px;top:${fpH + faceD / 2}px;width:${10 * s}px;height:${poleH + faceD / 2}px"></div>
        <div class="face" style="left:${cx - faceD / 2}px;top:${fpH}px;width:${faceD}px;height:${faceD}px;border-width:${4 * s}px"><img src="${o.img}" alt=""></div>
        ${o.name ? `<div class="nm" style="top:${fpH + faceD + 8 * s}px;font-size:${15 * s}px">${o.name}</div>` : ""}`;
      pins.appendChild(el);
      if (o.side === "rome") { // Confederate/enemy commander: red ring + red name tag
        const f = el.querySelector(".face"), n = el.querySelector(".nm");
        if (f) f.style.boxShadow = "0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5)";
        if (n) n.style.background = "#c4121f";
      }
      hide(el);
      tl.fromTo(el, { autoAlpha: 0, y: -160 * s }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "bounce.out" }, o.t);
      if (o.until != null) out(el, o.until);
      return el;
    };
    B.dim = (t, until, alpha = 1) => {
      const el = screenEl("", ""); el.id = "dim";
      scene.insertBefore(el, document.getElementById("vignette"));
      reveal(el, t, {}, 0.8);
      if (alpha !== 1) tl.to(el, { opacity: alpha, duration: 0.01 }, t + 0.8);
      out(el, until, 0.8);
      return el;
    };
    B.bio = (o) => { // screen-space photo cut-out + translucent bio card
      const photo = screenEl("", "bio-photo-wrap");
      photo.innerHTML = `<img class="bio-photo" src="${o.photo}" alt="">`;
      photo.style.cssText = "position:absolute;inset:0;";
      const card = screenEl(`<div class="h">${o.name}</div><div class="rule"></div>${o.rows.map((r) => `<div class="row">${r}</div>`).join("")}`, "bio-card");
      const rows = card.querySelectorAll(".row");
      tl.fromTo(photo, { autoAlpha: 0, x: -140 }, { autoAlpha: 1, x: 0, duration: 1.0, ease: "power3.out" }, o.t);
      tl.to(photo, { x: 40, duration: o.until - o.t - 1.0, ease: "none" }, o.t + 1.0);
      tl.fromTo(card, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out" }, o.t + 0.4);
      tl.to(card, { x: -30, duration: o.until - o.t - 1.3, ease: "none" }, o.t + 1.3);
      rows.forEach((r, i) => tl.fromTo(r, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, o.rowT ? o.rowT[i] : o.t + 1 + i * 0.6));
      tl.to([photo, card], { autoAlpha: 0, duration: 0.7 }, o.until);
      return { photo, card };
    };
    B.dateBox = (t, until, back) => { // hide / re-show the date scroll
      const box = document.getElementById("date");
      tl.to(box, { autoAlpha: 0, duration: 0.5 }, t);
      if (back != null) tl.to(box, { autoAlpha: 1, duration: 0.5 }, back);
    };

    // =====================================================================================================
    // DETAILED MAP STYLE (owner-approved, HANDOVER §9; reference scene scenes-src/demo3.js)
    // =====================================================================================================
    const SIDE = { carth: "#1f4fc4", rome: "#c4121f" };
    const SIDE_A = (side, a) => (side === "rome" ? `rgba(196,18,31,${a})` : `rgba(31,79,196,${a})`);
    const OVL = svg, PINS = pins, SCENE = scene;

    // ---- screen-space overlay element (HUD), hidden until revealed ----
    B.hud = (html, css) => {
      const e = document.createElement("div"); e.innerHTML = html; e.style.cssText = "position:absolute;" + css;
      SCENE.insertBefore(e, document.getElementById("credit")); gsap.set(e, { autoAlpha: 0 }); return e;
    };

    // ---- 3D tilt: the map leans back like a sand table. keys = [[t, rotationX, scale, dur], ...] ----
    B.tilt = (keys) => {
      if (!B._tilt) {
        const tw = document.createElement("div");
        tw.style.cssText = "position:absolute;inset:0;transform-origin:50% 62%;";
        SCENE.style.background = "#cdbf98"; // parchment behind the tilted plane: never black edges
        SCENE.insertBefore(tw, world); tw.appendChild(world);
        gsap.set(tw, { transformPerspective: 1700, rotationX: 0, scale: 1 });
        B._tilt = tw;
      }
      keys.forEach(([t, rx, sc, dur]) => tl.to(B._tilt, { rotationX: rx, scale: sc, duration: dur || 3, ease: "sine.inOut" }, t));
    };

    // ---- battlefield ground: tree-symbol woods with farm fields cut out, ploughed fields, farmhouses ----
    // fields: [{ name, rect: [x, y, w, h], label?: "KELLY FIELD" }]; o.density (px between trees, default 36)
    B.terrain = (fields, o = {}) => {
      let rs = o.seed || 20; const rnd = () => { rs = (rs * 16807) % 2147483647; return rs / 2147483647; };
      const tree = (cx, cy, r, op) => `<g opacity="${op}"><ellipse cx="${cx}" cy="${cy + r * 1.05}" rx="${r * 0.9}" ry="${r * 0.3}" fill="rgba(40,36,20,0.22)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#6f7f48"/><circle cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" r="${r * 0.45}" fill="#8c9a5c"/><path d="M${cx - r} ${cy} a${r} ${r} 0 0 0 ${2 * r} 0" fill="none" stroke="#3d4526" stroke-width="1.6"/></g>`;
      const dx = o.density || 38, dy = Math.round(dx * 0.9);
      let trees = "";
      if (o.woods !== false) for (let y = 0; y < 1640; y += dy) for (let x = (y / dy) % 2 ? 0 : dx / 2; x < 2900; x += dx) trees += tree(x + rnd() * 14 - 7, y + rnd() * 12 - 6, 7 + rnd() * 4, 0.38 + rnd() * 0.25);
      OVL.insertAdjacentHTML("afterbegin", `<defs>
        <mask id="clear"><rect width="2880" height="1620" fill="#fff"/>${fields.map((f) => { const [x, y, w, h] = f.rect; return `<rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" rx="22" fill="#000"/>`; }).join("")}</mask>
        <pattern id="furrow" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><rect width="14" height="14" fill="#e6d49c"/><line x1="0" y1="0" x2="0" y2="14" stroke="#b9a266" stroke-width="3"/></pattern></defs>
        <g id="woods" mask="url(#clear)">${trees}</g>
        <g id="fields">${fields.map((f) => { const [x, y, w, h] = f.rect; return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="url(#furrow)" opacity="0.8" stroke="#6b5530" stroke-width="3.5" stroke-dasharray="3 7"/>`; }).join("")}</g>`);
      fields.forEach((f) => {
        const [x, y, w, h] = f.rect, hx = x + w * 0.5, hy = y + h * 0.35;
        if (f.house !== false) PINS.insertAdjacentHTML("beforeend", `<div style="position:absolute;left:${hx - 10}px;top:${hy - 10}px;width:20px;height:16px;background:#5a3d22;border:2.5px solid #f3eee2;clip-path:polygon(50% 0,100% 40%,100% 100%,0 100%,0 40%)"></div>`);
        if (f.name) B.label(f.label || f.name, hx, y + h - 14, { cls: "tg", size: o.labelSize || 17, t: o.t || 0.3, anchor: [-50, -50] });
      });
    };
    // period road in ink (dash for tracks)
    B.road = (pts, w = 10, dash) => {
      const d = "M " + pts.map((p) => p.join(" ")).join(" L ");
      const f = document.getElementById("fields");
      const g = document.createElementNS(NS, "g");
      g.innerHTML = `<path d="${d}" fill="none" stroke="#4d3520" stroke-width="${w + 7}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#efdfb4" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ""} stroke-linejoin="round" stroke-linecap="round"/>`;
      if (f) f.after(g); else OVL.appendChild(g);
      return g;
    };

    // ---- territory control: ground tinted by side; on a retreat the loser's colour FADES, then the winner's spreads ----
    // line = polyline from top edge to bottom edge (extend 20 px past the map); o.west = side holding the ground west (left) of it
    B.territory = (line, o = {}) => {
      const west = o.west || "carth", east = west === "carth" ? "rome" : "carth", a = o.alpha || 0.2;
      const curW = line.map((p) => p.slice()), curE = line.map((p) => p.slice()), L = line.length - 1;
      const g = document.createElementNS(NS, "g");
      g.innerHTML = `<path class="zg"/><path class="zw" fill="${SIDE_A(west, a)}"/><path class="ze" fill="${SIDE_A(east, a)}"/><path class="zl" fill="none" stroke="#f7f3ea" stroke-width="5" stroke-dasharray="2 10" stroke-linecap="round" opacity="0.8"/>`;
      const f = document.getElementById("fields"); if (f) f.after(g); else OVL.insertBefore(g, OVL.firstChild);
      const zd = (pts) => "M " + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L ") + " Z";
      const draw = () => {
        g.querySelector(".zw").setAttribute("d", zd([[-20, -20], ...curW, [-20, 1640]]));
        g.querySelector(".ze").setAttribute("d", zd([[curE[0][0], -20], [2900, -20], [2900, 1640], [curE[L][0], 1640], ...curE.slice().reverse()]));
        g.querySelector(".zl").setAttribute("d", "M " + curE.map((p) => p.join(" ")).join(" L "));
      };
      draw(); gsap.set(g, { autoAlpha: 0 }); tl.to(g, { autoAlpha: 1, duration: 1.5 }, o.t || 1);
      if (o.labels) o.labels.forEach(([txt, x, y, until]) => B.label(txt, x, y, { cls: "tg", size: 30, t: (o.t || 1) + 0.6, until, anchor: [-50, -50] }));
      const api = { el: g, line: line.map((p) => p.slice()) };
      // r = { to, loser, tFade, tSpread, spreadDur, lost: [text, x, y, until] }
      api.retreat = (r) => {
        const from = api.line.map((p) => p.slice()), to = r.to; api.line = to.map((p) => p.slice());
        const ghost = g.querySelector(".zg");
        const i0 = from.findIndex((p, i) => p[0] !== to[i][0] || p[1] !== to[i][1]), s = Math.max(0, i0 - 1);
        const gh = document.createElementNS(NS, "path");
        gh.setAttribute("d", zd([...from.slice(s), ...to.slice(s).reverse()])); gh.setAttribute("fill", SIDE_A(r.loser, a)); ghost.after(gh);
        gsap.set(gh, { opacity: 0 });
        const lerp = (arr, k) => arr.forEach((p, i) => { p[0] = from[i][0] + (to[i][0] - from[i][0]) * k; p[1] = from[i][1] + (to[i][1] - from[i][1]) * k; });
        const loserArr = r.loser === west ? curW : curE, winnerArr = r.loser === west ? curE : curW;
        const k1 = { k: 0 }, k2 = { k: 0 };
        tl.set(gh, { opacity: 1 }, r.tFade);
        tl.to(k1, { k: 1, duration: 0.6, onUpdate: () => { lerp(loserArr, k1.k); draw(); } }, r.tFade);
        tl.to(gh, { opacity: 0, duration: r.fadeDur || 5, ease: "sine.inOut" }, r.tFade + 0.4);
        tl.to(k2, { k: 1, duration: r.spreadDur || 7, ease: "power1.inOut", onUpdate: () => { lerp(winnerArr, k2.k); draw(); } }, r.tSpread);
        if (r.lost) {
          const lostP = document.createElementNS(NS, "path");
          lostP.setAttribute("d", gh.getAttribute("d")); lostP.setAttribute("fill", SIDE_A(r.loser === "carth" ? "rome" : "carth", 0.35));
          lostP.setAttribute("stroke", SIDE[r.loser === "carth" ? "rome" : "carth"]); lostP.setAttribute("stroke-width", "4");
          g.after(lostP); gsap.set(lostP, { autoAlpha: 0 });
          tl.to(lostP, { autoAlpha: 1, duration: 0.5, yoyo: true, repeat: 3 }, r.tSpread + 0.8);
          const [txt, x, y, until] = r.lost;
          const lab = B.label(txt, x, y, { cls: "tg", size: 34, t: r.tSpread + 1.0, until, anchor: [-50, -50] });
          Object.assign(lab.style, { color: "#fff", background: SIDE[r.loser === "carth" ? "rome" : "carth"], padding: "2px 12px", textShadow: "none" });
        }
      };
      return api;
    };

    // ---- brigade-level units: long thin block = in line, deep narrow block = in column ----
    B.bdes = {};
    B.brigade = (o) => { // { id, side, name, x, y, col, rot, t }
      const w = o.col ? 34 : 74, h = o.col ? 30 : 17, col = SIDE[o.side] || SIDE.carth;
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;left:${o.x}px;top:${o.y}px;width:0;height:0;`;
      el.innerHTML = `<div class="b" style="position:absolute;left:${-w / 2}px;top:${-h / 2}px;width:${w}px;height:${h}px;background:${col};border:2.5px solid #1a1712;box-shadow:0 3px 5px rgba(0,0,0,.45);rotate:${o.rot || 0}deg;transform-origin:50% 50%">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><line x1="0" y1="0" x2="100" y2="100" stroke="#f7f3ea" stroke-width="7"/><line x1="100" y1="0" x2="0" y2="100" stroke="#f7f3ea" stroke-width="7"/></svg></div>
        ${o.name ? `<div class="n" style="position:absolute;left:0;top:${h / 2 + 3}px;translate:-50% 0;font:700 13px Oswald,sans-serif;letter-spacing:.05em;color:#fff;background:${col};padding:0 5px;border-radius:2px;white-space:nowrap">${o.name}</div>` : ""}`;
      PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
      if (o.t != null) tl.fromTo(el, { autoAlpha: 0, y: -26 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(2)" }, o.t);
      B.bdes[o.id] = { el, x: o.x, y: o.y };
      return el;
    };
    B.march = (id, t, dur, x, y, ease = "power1.inOut") => { const u = B.bdes[id]; tl.to(u.el, { left: x, top: y, duration: dur, ease }, t); u.x = x; u.y = y; };
    B.brigadeLoss = (id, t, k = 0.5) => { // casualties: block thins and greys
      const u = B.bdes[id], n = u.el.querySelector(".n");
      tl.to(u.el.querySelector(".b"), { scaleX: k, backgroundColor: "#77746c", duration: 1.2 }, t);
      if (n) tl.to(n, { backgroundColor: "#77746c", duration: 1.2 }, t);
    };
    // faint dotted trail (where a unit came from / fled along)
    B.trail = (pts, t, o = {}) => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", "M " + pts.map((q) => q.join(" ")).join(" L ")); p.setAttribute("fill", "none");
      p.setAttribute("stroke", o.color || SIDE.carth); p.setAttribute("stroke-width", "5"); p.setAttribute("stroke-dasharray", "4 12"); p.setAttribute("stroke-linecap", "round");
      OVL.appendChild(p); gsap.set(p, { opacity: 0 });
      tl.to(p, { opacity: 0.8, duration: 1.2 }, t); tl.to(p, { opacity: 0, duration: 1 }, t + (o.life || 9));
      return p;
    };
    // routed fragment: small greyed block running along pts, leaving a trail
    B.flee = (pts, t, o = {}) => {
      const seg = o.seg || 2.2, side = o.side || "carth";
      const e = document.createElement("div");
      e.style.cssText = `position:absolute;left:${pts[0][0] - 11}px;top:${pts[0][1] - 7}px;width:22px;height:14px;background:${side === "rome" ? "#b07a7e" : "#6b7fae"};border:2px solid #1a1712`;
      PINS.appendChild(e); gsap.set(e, { autoAlpha: 0 });
      tl.to(e, { autoAlpha: 1, duration: 0.3 }, t);
      let tt = t; pts.slice(1).forEach((p) => { tl.to(e, { left: p[0] - 11, top: p[1] - 7, duration: seg, ease: "none" }, tt); tt += seg; });
      tl.to(e, { autoAlpha: 0, duration: 0.6 }, tt);
      B.trail(pts, t + 0.2, { color: SIDE[side] });
    };

    // ---- combat effects ----
    B.puff = (x, y, t, r = 34, dur = 3.2) => {
      const e = document.createElement("div");
      e.style.cssText = `position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:radial-gradient(circle,rgba(245,242,232,.85) 0%,rgba(225,220,205,.55) 45%,rgba(220,215,200,0) 72%)`;
      PINS.appendChild(e); gsap.set(e, { autoAlpha: 0 });
      tl.fromTo(e, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out", immediateRender: false }, t);
      tl.to(e, { autoAlpha: 0, scale: 1.9, x: 26, y: -18, duration: dur, ease: "sine.in" }, t + 0.5);
    };
    B.volley = (pts, t, reps = 3, gap = 0.9) => pts.forEach(([x, y], i) => {
      for (let k = 0; k < reps; k++) {
        const tt = t + k * gap + (i % 4) * 0.12;
        const f = document.createElement("div");
        f.style.cssText = `position:absolute;left:${x - 12}px;top:${y - 12}px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle,#fffbe0 0%,#ffbe4a 40%,rgba(255,120,20,0) 72%)`;
        PINS.appendChild(f); gsap.set(f, { autoAlpha: 0 });
        tl.fromTo(f, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.4, duration: 0.12, immediateRender: false }, tt);
        tl.to(f, { autoAlpha: 0, duration: 0.35 }, tt + 0.12);
        B.puff(x + 8, y - 6, tt + 0.1, 26, 2.6);
      }
    });
    B.burst = (x, y, t) => {
      const e = document.createElement("div");
      e.style.cssText = `position:absolute;left:${x - 40}px;top:${y - 40}px;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,#fff 0%,#ffcf5a 25%,#ff7a1a 45%,rgba(90,60,40,.6) 60%,rgba(0,0,0,0) 72%)`;
      PINS.appendChild(e); gsap.set(e, { autoAlpha: 0 });
      tl.fromTo(e, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1.2, duration: 0.18, immediateRender: false }, t);
      tl.to(e, { autoAlpha: 0, scale: 1.6, duration: 0.6 }, t + 0.18);
      B.puff(x, y - 10, t + 0.2, 46, 3.5);
    };
    B.cannonSvg = (fill, w = 40) => `<svg viewBox="0 0 40 24" style="width:${w}px;height:${w * 0.6}px;display:block"><rect x="4" y="6" width="28" height="6" rx="3" fill="#2a2016" transform="rotate(-8 18 9)"/><circle cx="12" cy="16" r="7" fill="none" stroke="${fill}" stroke-width="3"/><circle cx="12" cy="16" r="1.8" fill="${fill}"/></svg>`;
    B.cannon = (x, y, side, t = 0.5) => {
      const e = document.createElement("div"); e.style.cssText = `position:absolute;left:${x}px;top:${y}px`; e.innerHTML = B.cannonSvg(SIDE[side] || side);
      PINS.appendChild(e); gsap.set(e, { autoAlpha: 0 }); tl.to(e, { autoAlpha: 1, duration: 0.5 }, t); return e;
    };

    // ---- HUD ----
    // clock: keys [[t, "11:10"], ...] (first key = start); o.date line above; hides the date scroll
    B.clock = (keys, o = {}) => {
      gsap.set(document.getElementById("date"), { autoAlpha: 0 });
      const e = B.hud(`<div style="font:700 15px Oswald;letter-spacing:.2em;color:#e9dcb8">${o.date || ""}</div><div class="t" style="font:700 54px Oswald;color:#fbfaf6;line-height:1">${keys[0][1]}</div>`,
        "right:40px;top:30px;padding:10px 22px 12px;background:rgba(24,20,14,.82);border:2px solid #b89d68;text-align:right");
      tl.to(e, { autoAlpha: 1, duration: 0.6 }, o.t != null ? o.t : keys[0][0]);
      const toM = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
      const c = { m: toM(keys[0][1]) }, tEl = e.querySelector(".t");
      const upd = () => { const m = Math.round(c.m), h = Math.floor(m / 60), mm = m % 60, h12 = ((h + 11) % 12) + 1; tEl.textContent = `${h12}:${String(mm).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; };
      upd();
      for (let i = 1; i < keys.length; i++) tl.to(c, { m: toM(keys[i][1]), duration: Math.max(0.01, keys[i][0] - keys[i - 1][0]), ease: "none", onUpdate: upd }, keys[i - 1][0]);
      return e;
    };
    // locator minimap (image from tools/minimap.py or any picture); shows = [[t0, t1], ...]
    B.minimap = (src, caption, shows, o = {}) => {
      const e = B.hud(`<img src="${src}" style="display:block;width:${o.w || 384}px;height:${(o.w || 384) * 9 / 16}px"><div style="font:700 13px Oswald;letter-spacing:.18em;color:#e9dcb8;padding:4px 8px">${caption}</div>`,
        "left:40px;bottom:40px;background:rgba(24,20,14,.85);border:3px solid #b89d68;box-shadow:0 8px 18px rgba(0,0,0,.5)");
      shows.forEach(([a, b]) => { tl.to(e, { autoAlpha: 1, duration: 0.5 }, a); if (b != null) tl.to(e, { autoAlpha: 0, duration: 0.5 }, b); });
      return e;
    };
    // strength bars: rows [[label, value, side]], bar length value * unit px
    B.bars = (title, rows, t, until, o = {}) => {
      const u = o.unit || 34;
      const e = B.hud(`<div style="font:700 17px Oswald;letter-spacing:.16em;color:#e9dcb8;margin-bottom:8px">${title}</div>` +
        rows.map(([l, v, s], i) => `<div style="display:flex;align-items:center;gap:10px;margin:6px 0"><div class="bar${i}" style="height:26px;width:0;background:${SIDE[s]};border:2px solid #fff"></div><span style="font:700 22px Oswald;color:#fff">${l}</span></div>`).join(""),
        `right:40px;top:${o.top || 150}px;padding:14px 20px;background:rgba(24,20,14,.82);border:2px solid #b89d68`);
      tl.to(e, { autoAlpha: 1, duration: 0.5 }, t);
      rows.forEach(([, v], i) => tl.to(e.querySelector(".bar" + i), { width: v * u, duration: 1.2, ease: "power2.out" }, t + 0.4 + i * 0.4));
      if (until != null) tl.to(e, { autoAlpha: 0, duration: 0.5 }, until);
      return e;
    };
    // red card: what the enemy believed
    B.belief = (title, quote, t, until) => {
      const e = B.hud(`<div style="font:700 17px Oswald;letter-spacing:.2em;color:#f7c9c9">${title}</div><div style="font:700 38px Oswald;color:#fff;margin-top:6px">${quote}</div>`,
        "left:50%;top:190px;translate:-50% 0;padding:16px 30px;background:rgba(150,14,24,.9);border:3px solid #fff;text-align:center;white-space:nowrap");
      tl.fromTo(e, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, t); tl.to(e, { autoAlpha: 0, duration: 0.4 }, until);
      return e;
    };
    // paper note (orders, telegrams)
    B.note = (kicker, text, t, until) => {
      const e = B.hud(`<div style="font-size:20px;letter-spacing:.3em;opacity:.8">${kicker}</div><div style="font-size:40px;margin-top:8px">${text}</div>`,
        "left:50%;top:190px;translate:-50% 0;padding:16px 30px;background:#efe3c4;border:3px solid #6b4a2b;box-shadow:0 12px 24px rgba(0,0,0,.45);font-family:'Special Elite',monospace;color:#2a241b;text-align:center;white-space:nowrap");
      tl.fromTo(e, { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.6 }, t); tl.to(e, { autoAlpha: 0, duration: 0.4 }, until);
      return e;
    };
    // picture inside the map: framed portrait / painting pops in top-left while the map keeps moving
    B.pip = (src, title, t, until, o = {}) => {
      const w = o.w || 300, h = o.h || 360;
      const e = B.hud(`<div style="width:${w}px;height:${h}px;background:#2a241b url(${src}) center/${o.fit || "cover"} no-repeat;filter:sepia(.35) contrast(1.05)"></div>
        <div style="font:700 17px Oswald;letter-spacing:.08em;color:#2a241b;margin-top:8px;text-align:center;max-width:${w}px">${title}</div>`,
        `left:40px;top:40px;padding:12px 12px 10px;background:#efe3c4;border:3px solid #6b4a2b;box-shadow:0 14px 30px rgba(0,0,0,.55)`);
      tl.fromTo(e, { autoAlpha: 0, rotation: -4, scale: 0.85, x: -30 }, { autoAlpha: 1, rotation: -1.5, scale: 1, x: 0, duration: 0.55, ease: "back.out(1.6)" }, t);
      tl.to(e, { autoAlpha: 0, x: -30, duration: 0.4 }, until);
      return e;
    };
    // cartography
    B.compass = (t) => {
      const e = B.hud(`<svg viewBox="-60 -60 120 120" width="120" height="120"><circle r="44" fill="rgba(239,227,196,.8)" stroke="#6b4a2b" stroke-width="3"/>
        <circle r="36" fill="none" stroke="#6b4a2b" stroke-width="1" stroke-dasharray="3 4"/>
        <path d="M0 -52 L9 0 L0 10 L-9 0 Z" fill="#c4121f" stroke="#2a241b" stroke-width="1.5"/><path d="M0 52 L9 0 L0 -10 L-9 0 Z" fill="#2a241b"/>
        <path d="M-40 0 L0 6 L40 0 L0 -6 Z" fill="#6b4a2b" opacity=".7"/><text y="-30" x="-6" font-size="14" font-family="Oswald" fill="#fff" font-weight="700">N</text></svg>`, "right:44px;bottom:110px");
      tl.to(e, { autoAlpha: 1, duration: 0.6 }, t); return e;
    };
    // scale bar drawn on the ground (tilts with the map). metersPerPx from assets/BASEMAP.json
    B.scaleBar = (x, y, metersPerPx, o = {}) => {
      const miles = o.miles || 1, L = miles * 1609 / metersPerPx, q = L / 4;
      OVL.insertAdjacentHTML("beforeend", `<g transform="translate(${x} ${y})"><rect width="${L}" height="16" fill="#efe3c4" stroke="#2a241b" stroke-width="3"/>
        <rect width="${q}" height="16" fill="#2a241b"/><rect x="${2 * q}" width="${q}" height="16" fill="#2a241b"/>
        <text x="0" y="-10" font-family="Oswald" font-weight="700" font-size="26" fill="#2a241b">0</text><text x="${L - 40}" y="-10" font-family="Oswald" font-weight="700" font-size="26" fill="#2a241b">${miles} MILE${miles > 1 ? "S" : ""}</text></g>`);
    };
    // legend: items [[swatchHtml, label]]; B.legendItems() gives the standard set
    B.legendItems = () => [
      [`<div style="width:40px;height:12px;background:${SIDE.carth};border:2px solid #1a1712"></div>`, "UNION BRIGADE IN LINE"],
      [`<div style="width:22px;height:20px;margin:0 9px;background:${SIDE.rome};border:2px solid #1a1712"></div>`, "CONFEDERATE BRIGADE IN COLUMN"],
      [`<div style="width:40px">${B.cannonSvg("#e9dcb8")}</div>`, "ARTILLERY"],
      [`<div style="width:40px;height:14px;background:repeating-linear-gradient(45deg,#e6d49c 0 4px,#b9a266 4px 7px);border:1px solid #6b5530"></div>`, "FARM FIELD · WOODS ELSEWHERE"]];
    B.legend = (items, t, until) => {
      const e = B.hud(`<div style="font:700 14px Oswald;letter-spacing:.2em;color:#e9dcb8;margin-bottom:6px">LEGEND</div>` +
        items.map(([sw, l]) => `<div style="display:flex;align-items:center;gap:8px;margin:5px 0">${sw}<span style="font:700 16px Oswald;color:#fff">${l}</span></div>`).join(""),
        "right:40px;bottom:250px;padding:10px 16px;background:rgba(24,20,14,.8);border:2px solid #b89d68");
      tl.to(e, { autoAlpha: 1, duration: 0.6 }, t); if (until != null) tl.to(e, { autoAlpha: 0, duration: 0.5 }, until);
      return e;
    };
    B.scorched = (t = 0) => {
      const e = document.createElement("div");
      e.style.cssText = "position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 90px 30px rgba(60,34,12,.55), inset 0 0 22px 6px rgba(30,16,6,.7);";
      SCENE.insertBefore(e, document.getElementById("vignette")); gsap.set(e, { autoAlpha: 0 }); tl.to(e, { autoAlpha: 1, duration: 1.5 }, t);
      return e;
    };

    // ---- satellite zoom-in opening (images from: python3 tools/sat.py --intro BASEMAP) ----
    // o = { base: "chick", zoom: 15 (basemap zoom), cam: [cx, cy, s] (camera at t=0 — keep s <= ~1 so the satellite stays sharp),
    //       title, sub, date }. Hides map overlays until ~3.9 s; returns the time the map is fully revealed (~4.7 s).
    B.satIntro = (o) => {
      const [cx, cy, s] = o.cam, D = 1920 / 2880; // images are 2880x1620 shown with background-size:cover
      const org = (dz) => [960 + ((cx - 1440) / 2 ** dz) * D, 540 + ((cy - 810) / 2 ** dz) * D];
      const layer = (src, dz, below) => {
        const [ox, oy] = org(dz), e = document.createElement("div");
        e.style.cssText = `position:absolute;inset:0;background:url(${src}) center/cover;transform-origin:${ox}px ${oy}px;`;
        SCENE.insertBefore(e, below || fx); return e;
      };
      const satW = B.image(`assets/media/${o.base}_sat.jpg`, 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
      world.insertBefore(satW, OVL);
      gsap.set([OVL, PINS], { autoAlpha: 0 });
      const satR = layer(`assets/media/${o.base}_sat_region.jpg`, 4);
      const satM = layer(`assets/media/${o.base}_sat_mid.jpg`, 2, satR);
      gsap.set(satM, { autoAlpha: 0 });
      tl.fromTo(satR, { scale: 1 }, { scale: 4, duration: 1.8, ease: "power1.in", immediateRender: true }, 0.2);
      tl.set(satM, { autoAlpha: 1 }, 1.5); tl.to(satR, { autoAlpha: 0, duration: 0.5 }, 1.5);
      tl.fromTo(satM, { scale: 1 }, { scale: (s * 4) / D, duration: 1.8, ease: "power2.in", immediateRender: false }, 1.9);
      tl.to(satM, { autoAlpha: 0, duration: 0.4 }, 3.55);
      tl.to(satW, { autoAlpha: 0, duration: 1.0, ease: "sine.inOut" }, 3.7);
      tl.to([OVL, PINS], { autoAlpha: 1, duration: 1.0 }, 3.9);
      const lab = B.hud(`<div style="font:700 44px Oswald;letter-spacing:.12em;color:#fff;text-shadow:0 3px 10px #000">${o.title}</div><div style="font:400 22px 'Special Elite';color:#f3e6c2;text-shadow:0 2px 6px #000">${o.sub || "SATELLITE VIEW · TODAY"}</div>`, "left:50%;top:42%;translate:-50% -50%;text-align:center");
      tl.to(lab, { autoAlpha: 1, duration: 0.5 }, 0.2); tl.to(lab, { autoAlpha: 0, duration: 0.5 }, 2.6);
      if (o.date) {
        const d = B.hud(`<div style="font:700 60px Oswald;letter-spacing:.2em;color:#2a241b">${o.date}</div>`, "left:50%;top:40%;translate:-50% -50%;padding:6px 26px;background:rgba(239,227,196,.85);border:3px solid #6b4a2b");
        tl.to(d, { autoAlpha: 1, duration: 0.5 }, 4.3); tl.to(d, { autoAlpha: 0, duration: 0.5 }, 6.2);
      }
      return 4.7;
    };

    B.finish = () => {}; // registration happens in the page template
    return B;
  };
})();
