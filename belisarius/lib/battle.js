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
    B.METHOD = ["SHAPE THE BATTLEFIELD", "STRIKE WHAT HOLDS THEM TOGETHER", "MAKE TIME FIGHT FOR YOU"];
    B.method = (t, until, rowTimes) => { // rowTimes (optional): absolute time for each row, e.g. from B.at(...)
      const el = screenEl(`<div class="inner">${B.METHOD.map((r) => `<div class="row">${r}</div>`).join("")}</div>`, "card method");
      reveal(el, t, {}, 0.5);
      const rows = el.querySelectorAll(".row");
      rows.forEach((r, i) => tl.fromTo(r, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out" }, rowTimes ? rowTimes[i] : t + 0.2 + i * 1.1));
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

    B.finish = () => {}; // registration happens in the page template
    return B;
  };
})();

// ---------- RomeKit (Belisarius siege of Rome): shared geometry + icons for basemap assets/rome.jpg (z15) ----------
// usage in a scene: const B = Battle(); const R = RomeKit(B); R.tiber(); R.walls({ t: 1, dur: 4 }); ...
// Coordinates are map pixels: wall ring traced from real gate positions, Tiber traced on the relief channel.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const sp = (pts, close) => { // Catmull-Rom -> cubic Bezier
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
      d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}, ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}, ${p2[0]} ${p2[1]}`;
    }
    return d + (close ? " Z" : "");
  };
  const poly = (pts, close) => "M " + pts.map((p) => p.join(" ")).join(" L ") + (close ? " Z" : "");
  const G = {
    tiber: [[982, -30], [988, 100], [995, 200], [1020, 300], [1055, 390], [1050, 440], [1010, 490], [950, 510], [870, 535], [815, 585], [815, 640],
      [845, 690], [900, 745], [960, 800], [1030, 850], [1100, 880], [1185, 915], [1195, 960], [1175, 1010], [1130, 1070], [1060, 1150], [1010, 1210],
      [975, 1265], [980, 1350], [1000, 1440], [1040, 1530], [1075, 1650]],
    // Aurelian Walls, clockwise from Porta Flaminia (incl. the Trastevere loop over the Janiculum and the river stretch)
    wall: [[1123, 250], [1207, 231], [1300, 252], [1417, 319], [1520, 250], [1624, 206], [1703, 294], [1766, 331], [1848, 378], [1871, 497], [1940, 530],
      [2013, 563], [2040, 700], [2030, 854], [2046, 967], [1894, 1089], [1766, 1217], [1708, 1371], [1687, 1418], [1600, 1440], [1522, 1443], [1380, 1390],
      [1235, 1333], [1120, 1305], [997, 1275], [953, 1268], [930, 1215], [850, 1150], [781, 1076], [800, 970], [915, 850], [936, 806], [964, 774],
      [914, 729], [863, 677], [837, 640], [837, 590], [882, 553], [955, 532], [1023, 508], [1072, 448], [1077, 386], [1041, 293], [1027, 250]],
    gates: {
      FLAMINIAN: [1123, 250], PINCIAN: [1417, 319], SALARIAN: [1624, 206], NOMENTAN: [1703, 294], CLAUSA: [1860, 440], TIBURTINE: [2013, 563],
      PRAENESTINE: [2030, 854], ASINARIAN: [1894, 1089], METRONIAN: [1766, 1217], LATIN: [1708, 1371], APPIAN: [1687, 1418], ARDEATINE: [1522, 1443],
      OSTIAN: [1235, 1333], PORTUENSIS: [930, 1215], AURELIAN: [781, 1076], SEPTIMIAN: [915, 850], "ST PETER": [882, 553], FLUMINEA: [1072, 448],
    },
    hadrian: [880, 478],
    camps: [[1150, 100], [1445, 105], [1880, 150], [2190, 380], [2250, 650], [2200, 1100], [650, 370]], // 6 east of the river + Plain of Nero
    aqueducts: [
      [[2880, 1180], [2600, 1060], [2330, 950], [2040, 858]],
      [[2880, 1360], [2560, 1180], [2300, 1000], [2046, 885]],
      [[2880, 470], [2500, 380], [2200, 300], [1900, 240], [1690, 262]],
      [[2880, 1520], [2400, 1360], [2100, 1200], [1900, 1095]],
      [[-20, 1295], [300, 1230], [560, 1140], [781, 1076]],
    ],
    cuts: [[2520, 1027], [2380, 1055], [2330, 345], [2250, 1280], [420, 1188]],
    mills: [[845, 1030], [900, 960], [910, 1090]],
    bridge: [[1012, 880], [1048, 820]], // just above the floating mills
    boatMills: [[1088, 877, 22], [1130, 892, 18], [1170, 908, 15]], // x, y, flow angle (deg)
    chain: [[1052, 890], [1072, 838]],
  };

  window.RomeKit = function (B) {
    const tl = B.tl, svg = document.getElementById("overlay"), scene = document.getElementById("scene");
    const R = { G, camps: [] };
    if (!document.getElementById("rk-style")) {
      const st = document.createElement("style"); st.id = "rk-style";
      st.textContent = `.rk-counter{position:absolute;right:90px;width:470px;padding:14px 24px 16px;background:rgba(20,17,12,0.86);color:#f7f3ea;border-left:12px solid #c4121f;box-shadow:0 10px 24px rgba(0,0,0,0.45);font-family:Oswald,sans-serif}
.rk-counter.blue{border-left-color:#1f4fc4}.rk-counter .t{font-size:26px;letter-spacing:.28em;opacity:.85}.rk-counter .b{font-size:66px;font-weight:700;line-height:1.02;letter-spacing:.02em}
.rk-counter .s{font-family:"Special Elite",monospace;font-size:24px;color:#efe3c4}.rk-counter .r2{font-size:38px;font-weight:700;margin-top:8px;line-height:1.1}.rk-counter .r2 span{font-family:"Special Elite",monospace;font-size:24px;font-weight:400;color:#efe3c4}`;
      document.head.appendChild(st);
    }
    if (!document.getElementById("rk-defs")) {
      const defs = document.createElementNS(NS, "defs"); defs.id = "rk-defs";
      defs.innerHTML = `<filter id="rkGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="rkGlowS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>`;
      svg.insertBefore(defs, svg.firstChild);
    }
    const mk = (html, parent = svg) => { const g = document.createElementNS(NS, "g"); g.innerHTML = html; parent.appendChild(g); return g; };
    const pop = (g, t, s = 1, dur = 0.5) => {
      gsap.set(g, { autoAlpha: 0 });
      tl.fromTo(g, { autoAlpha: 0, scale: s * 1.8 }, { autoAlpha: 1, scale: s, duration: dur, ease: "back.out(2)" }, t);
    };
    const place = (g, x, y, s = 1, rot = 0) => gsap.set(g, { x, y, scale: s, rotation: rot, transformOrigin: "0px 0px" });
    R.sp = sp;

    // dark night wash over the relief (below everything drawn later)
    R.night = (alpha = 0.62) => {
      const g = mk(`<rect x="-50" y="-50" width="2980" height="1720" fill="rgb(6,12,26)" opacity="${alpha}"/>`);
      svg.insertBefore(g, document.getElementById("rk-defs").nextSibling);
      return g;
    };
    R.tiber = (o = {}) => {
      const d = sp(G.tiber);
      const g = mk(`${o.night ? `<path d="${d}" fill="none" stroke="#6fb7d8" stroke-width="44" opacity="0.35" filter="url(#rkGlow)"/>` : ""}
        <path d="${d}" fill="none" stroke="${o.night ? "#1d3a4d" : "#e9dfc4"}" stroke-width="40" stroke-linecap="round" opacity="0.9"/>
        <path d="${d}" fill="none" stroke="${o.night ? "#3f7d9c" : "#7fa3b3"}" stroke-width="30" stroke-linecap="round"/>`);
      if (o.t != null) { gsap.set(g, { autoAlpha: 0 }); tl.to(g, { autoAlpha: 1, duration: 1.2 }, o.t); }
      return g;
    };
    // Aurelian Walls ring drawn on at o.t over o.dur; night = glowing gold, day = dark stone with towers
    R.walls = (o = {}) => {
      const d = poly(G.wall, true);
      const g = o.night
        ? mk(`<path d="${d}" fill="none" stroke="#ffb347" stroke-width="30" stroke-linejoin="round" opacity="0.75" filter="url(#rkGlow)"/>
             <path d="${d}" fill="none" stroke="#ffd98a" stroke-width="10" stroke-linejoin="round"/>
             <path d="${d}" fill="none" stroke="#fff6dc" stroke-width="4" stroke-linejoin="round"/>`)
        : mk(`<path d="${d}" fill="none" stroke="#f3e8cc" stroke-width="${o.w ? o.w + 9 : 21}" stroke-linejoin="round"/>
             <path d="${d}" fill="none" stroke="#3b2f22" stroke-width="${o.w || 12}" stroke-linejoin="round"/>
             <path d="${d}" fill="none" stroke="#3b2f22" stroke-width="${o.w ? o.w + 9 : 21}" stroke-dasharray="6 28" stroke-linejoin="round"/>`);
      const paths = [...g.querySelectorAll("path")];
      const len = paths[0].getTotalLength();
      R.wallLen = len;
      if (o.t == null) return g;
      paths.forEach((p) => { p.style.strokeDasharray = p.getAttribute("stroke-dasharray") || ""; });
      const dashed = paths.filter((p) => p.getAttribute("stroke-dasharray"));
      const solid = paths.filter((p) => !p.getAttribute("stroke-dasharray"));
      gsap.set(solid, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len });
      tl.to(solid, { strokeDashoffset: 0, duration: o.dur || 4, ease: "power1.inOut" }, o.t);
      if (dashed.length) { gsap.set(dashed, { opacity: 0 }); tl.to(dashed, { opacity: 1, duration: 0.8 }, o.t + (o.dur || 4) - 0.4); }
      if (o.pulse) tl.fromTo(paths[0], { opacity: 0.75 }, { opacity: 0.35, duration: 1.6, yoyo: true, repeat: o.pulse, ease: "sine.inOut" }, o.t + (o.dur || 4));
      return g;
    };
    R.gates = (t, o = {}) => Object.entries(G.gates).map(([n, [x, y]], i) => {
      const g = mk(`<rect x="-9" y="-9" width="18" height="18" fill="${o.night ? "#fff1c8" : "#efe3c4"}" stroke="#1b1812" stroke-width="3"/>`);
      place(g, x, y, o.s || 1); pop(g, t + i * (o.stagger ?? 0.08), o.s || 1, 0.35);
      return g;
    });
    // Gothic camp: palisade ring + tents (+ fires at night)
    R.camp = (x, y, t, o = {}) => {
      const r = o.r || 52;
      const g = mk(`${o.night ? `<circle r="${r + 16}" fill="#ff5a1f" opacity="0.38" filter="url(#rkGlow)"/>` : ""}
        <circle r="${r}" fill="rgba(196,18,31,0.22)" stroke="#f7f3ea" stroke-width="12"/>
        <circle r="${r}" fill="none" stroke="#c4121f" stroke-width="8" stroke-dasharray="14 7"/>
        <g fill="#c4121f" stroke="#1b1812" stroke-width="2.5" stroke-linejoin="round">
          <path d="M-26 8 L-14 -14 L-2 8 Z"/><path d="M4 12 L16 -10 L28 12 Z"/><path d="M-12 -12 L0 -32 L12 -12 Z"/><path d="M-8 32 L4 12 L16 32 Z"/></g>
        ${o.night ? `<circle cx="-2" cy="-4" r="5" fill="#ffd36b"/><circle cx="20" cy="22" r="4" fill="#ffd36b"/>` : ""}`);
      place(g, x, y, o.s || 1); pop(g, t, o.s || 1, 0.6);
      R.camps.push(g);
      return g;
    };
    R.aqueduct = (pts, t, o = {}) => {
      const d = poly(pts);
      const g = mk(`<path d="${d}" fill="none" stroke="${o.night ? "#1b1812" : "#f3e8cc"}" stroke-width="14" stroke-linecap="round"/>
        <path d="${d}" fill="none" stroke="${o.night ? "#b9a987" : "#6b5b45"}" stroke-width="8" stroke-linecap="round"/>
        <path d="${d}" fill="none" stroke="${o.night ? "#b9a987" : "#6b5b45"}" stroke-width="16" stroke-dasharray="3 14"/>
        <path class="water" d="${d}" fill="none" stroke="#39a7ea" stroke-width="4.5" stroke-linecap="round"/>`);
      const ps = [...g.querySelectorAll("path")], len = ps[0].getTotalLength();
      gsap.set(ps, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len });
      tl.to(ps, { strokeDashoffset: 0, duration: o.dur || 1.6, ease: "power2.inOut" }, t);
      tl.set(ps[2], { strokeDasharray: "3 14", strokeDashoffset: 0 }, t + (o.dur || 1.6));
      g.water = ps[3];
      return g;
    };
    R.cutX = (x, y, t, s = 1) => {
      const g = mk(`<g stroke-linecap="round"><path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke="#f7f3ea" stroke-width="16"/>
        <path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke="#c4121f" stroke-width="9"/></g>`);
      place(g, x, y, s); pop(g, t, s, 0.4);
      return g;
    };
    R.mill = (x, y, t, s = 1) => { // water wheel; returns {g, wheel}
      const spokes = [0, 45, 90, 135].map((a) => `<line x1="-13" y1="0" x2="13" y2="0" transform="rotate(${a})"/>`).join("");
      const g = mk(`<circle r="21" fill="#f7f3ea" stroke="#1b1812" stroke-width="3"/><g class="wh" stroke="#1f4fc4" stroke-width="3.5">
        <circle r="14" fill="#cfe2f5"/>${spokes}</g>`);
      place(g, x, y, s); pop(g, t, s, 0.45);
      return { g, wheel: g.querySelector(".wh") };
    };
    R.spin = (wheel, t, dur, turns) => tl.fromTo(wheel, { rotation: 0 }, { rotation: 360 * (turns || dur / 2), duration: dur, ease: "none", transformOrigin: "50% 50%" }, t);
    R.boatMill = (x, y, ang, t, s = 1) => {
      const spokes = [0, 60, 120].map((a) => `<line x1="-8" y1="0" x2="8" y2="0" transform="rotate(${a})"/>`).join("");
      const g = mk(`<g transform="rotate(${ang})"><ellipse cx="0" cy="-10" rx="15" ry="4.5" fill="#8a6238" stroke="#1b1812" stroke-width="1.8"/>
        <ellipse cx="0" cy="10" rx="15" ry="4.5" fill="#8a6238" stroke="#1b1812" stroke-width="1.8"/>
        <line x1="-6" y1="-10" x2="-6" y2="10" stroke="#1b1812" stroke-width="2"/><line x1="6" y1="-10" x2="6" y2="10" stroke="#1b1812" stroke-width="2"/>
        <g class="wh" stroke="#1f4fc4" stroke-width="2"><circle r="8" fill="#f7f3ea" stroke="#1b1812"/>${spokes}</g></g>`);
      place(g, x, y, s); pop(g, t, s, 0.45);
      return { g, wheel: g.querySelector(".wh") };
    };
    R.tomb = (t) => { // Mausoleum of Hadrian: square base + drum
      const [x, y] = G.hadrian;
      const g = mk(`<rect x="-24" y="-24" width="48" height="48" fill="#efe6cf" stroke="#1b1812" stroke-width="3"/>
        <circle r="17" fill="#d9ccab" stroke="#1b1812" stroke-width="3"/><circle r="6" fill="#b7a882" stroke="#1b1812" stroke-width="2"/>`);
      place(g, x, y); if (t != null) pop(g, t); return g;
    };
    R.tower = (x, y, t, s = 1) => { // Gothic siege tower (seen from above-front) on wheels
      const g = mk(`<g stroke="#1b1812" stroke-linejoin="round"><rect x="-17" y="-26" width="34" height="46" fill="#c4121f" stroke-width="3"/>
        <line x1="-17" y1="-11" x2="17" y2="-11" stroke-width="2.5"/><line x1="-17" y1="4" x2="17" y2="4" stroke-width="2.5"/>
        <rect x="-8" y="-22" width="16" height="8" fill="#6b1017" stroke-width="2"/>
        <circle cx="-17" cy="20" r="6" fill="#4c3219" stroke-width="2.5"/><circle cx="17" cy="20" r="6" fill="#4c3219" stroke-width="2.5"/></g>`);
      place(g, x, y, s); if (t != null) pop(g, t, s);
      return g;
    };
    R.oxen = (x, y, t, s = 1) => { // a yoked pair seen from above, heads pointing down (+y)
      const ox = (dx) => `<g transform="translate(${dx} 0)"><ellipse rx="6" ry="11" fill="#7a4e26" stroke="#1b1812" stroke-width="2"/>
        <circle cx="0" cy="12" r="4.5" fill="#6a431f" stroke="#1b1812" stroke-width="1.8"/><path d="M-5 13 L-9 10 M5 13 L9 10" stroke="#f3e8cc" stroke-width="2"/></g>`;
      const g = mk(`<g class="ox">${ox(-8)}${ox(8)}<line x1="-15" y1="4" x2="15" y2="4" stroke="#1b1812" stroke-width="2.5"/></g>`);
      place(g, x, y, s); if (t != null) pop(g, t, s);
      return g;
    };
    R.lock = (x, y, t, s = 1) => {
      const g = mk(`<g class="lk"><path d="M-8 -2 L-8 -10 A8 8 0 0 1 8 -10 L8 -2" fill="none" stroke="#1b1812" stroke-width="4"/>
        <rect x="-12" y="-3" width="24" height="19" rx="3" fill="#e0b441" stroke="#1b1812" stroke-width="2.5"/><circle cx="0" cy="5" r="3" fill="#1b1812"/></g>`);
      place(g, x, y, s); pop(g, t, s, 0.4);
      return g;
    };
    // projectile: a short line flying from a to b between t and t+dur, then fading
    R.shot = (a, b, t, dur = 0.4, color = "#1f4fc4") => {
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
      const g = mk(`<line x1="-12" y1="0" x2="4" y2="0" stroke="#f7f3ea" stroke-width="6" stroke-linecap="round"/><line x1="-12" y1="0" x2="4" y2="0" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`);
      gsap.set(g, { x: a[0], y: a[1], rotation: ang, autoAlpha: 0, transformOrigin: "0px 0px" });
      tl.set(g, { autoAlpha: 1 }, t);
      tl.to(g, { x: b[0], y: b[1], duration: dur, ease: "none" }, t);
      tl.to(g, { autoAlpha: 0, duration: 0.15 }, t + dur);
      return g;
    };
    R.chain = (t) => {
      const [[x1, y1], [x2, y2]] = G.chain;
      const g = mk(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f7f3ea" stroke-width="9" stroke-linecap="round"/>
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2a241b" stroke-width="5" stroke-dasharray="6 3"/>`);
      gsap.set(g, { autoAlpha: 0 }); tl.to(g, { autoAlpha: 1, duration: 0.5 }, t);
      return g;
    };
    R.bridge = (t) => {
      const [[x1, y1], [x2, y2]] = G.bridge;
      const g = mk(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1b1812" stroke-width="16" stroke-linecap="butt"/>
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#d8ccae" stroke-width="10" stroke-linecap="butt"/>`);
      if (t != null) { gsap.set(g, { autoAlpha: 0 }); tl.to(g, { autoAlpha: 1, duration: 0.5 }, t); }
      return g;
    };
    R.dimCamps = (t, dur = 2, to = 0.35) => R.camps.forEach((g, i) => tl.to(g, { opacity: to, duration: dur }, t + i * 0.25));
    // screen-space counter box (top right). side "red" | "blue"; returns el; R.counterRow(el, html, t) adds a row later
    R.counter = (o) => {
      const el = document.createElement("div");
      el.className = "rk-counter " + (o.side || "red");
      el.style.top = (o.top || 80) + "px";
      if (o.left != null) { el.style.left = o.left + "px"; el.style.right = "auto"; }
      if (o.width) el.style.width = o.width + "px";
      el.innerHTML = `<div class="t">${o.title}</div><div class="b">${o.big}</div>${o.sub ? `<div class="s">${o.sub}</div>` : ""}`;
      scene.insertBefore(el, document.getElementById("credit"));
      gsap.set(el, { autoAlpha: 0 });
      tl.fromTo(el, { autoAlpha: 0, x: o.left != null ? -60 : 60 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }, o.t);
      if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.4 }, o.until);
      return el;
    };
    R.counterRow = (el, html, t) => {
      const r = document.createElement("div"); r.className = "r2"; r.innerHTML = html; el.appendChild(r);
      gsap.set(r, { autoAlpha: 0 });
      tl.fromTo(r, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5 }, t);
      return r;
    };
    // scale a world-space HTML element (plaque, bubble) so it reads at a given camera zoom
    R.scale = (el, s, origin = "0% 100%") => { gsap.set(el, { scale: s, transformOrigin: origin }); return el; };
    // small flag image for portrait stakes (data URI)
    R.flag = (color) => "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="46" height="28"><rect width="46" height="28" fill="${color}"/><rect y="11" width="46" height="6" fill="#f3eee2"/></svg>`);
    return R;
  };
})();
