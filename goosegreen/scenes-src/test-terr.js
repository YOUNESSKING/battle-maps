// Goose Green scene 'move1' (isthmus basemap, paragraphs move1-1 .. move1-10). Sides: British = blue ("carth"), Argentine = red ("rome").
// Built with: python3 tools/build_scene.py move1 isthmus move1-1 move1-10
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = FXK(B); // locked style FX kit (lib/fx.js)

// ---------- Goose Green helpers (same block in hook-atlantic / hook-isthmus / move1 / ending) ----------
const GG = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const tl = B.tl, pins = document.getElementById("pins"), world = document.getElementById("world");
  const svg = document.getElementById("overlay"), scene = document.getElementById("scene");
  const css = document.createElement("style");
  css.textContent = `
    .unit .tag { font-size: 12px; padding: 0 5px; margin-top: 2px; border-width: 0; }
    .bubble { font-size: 24px; padding: 10px 18px; }
    .gg-pin { position: absolute; left: 0; top: 0; }
    .gg-card.tr { left: auto; right: 70px; }
    .gg-card.tl { right: auto; left: 90px; }
    .gg-card.tr .inner { padding: 18px 36px; border-top-color: #9fc0ea; }
    #dim { background: rgba(8, 8, 10, 0.72); }
    .caption.r { justify-content: flex-end; padding-right: 70px; bottom: 70px; }
    .caption.r span { font-size: 38px; }
    .gg-lbl { position: absolute; white-space: nowrap; font-weight: 700; letter-spacing: 0.08em; color: #fbfaf6; text-shadow: 0 2px 4px rgba(0,0,0,0.9), 0 0 2px #000; }
    .gg-tagbox { position: absolute; white-space: nowrap; padding: 1px 8px; font-weight: 700; letter-spacing: 0.06em; color: #fff; border-radius: 3px; border: 2px solid #f3eee2; }
    .gg-card { position: absolute; left: 0; right: 0; display: flex; justify-content: center; }
    .gg-card .inner { padding: 30px 70px 34px; background: rgba(18, 16, 12, 0.9); color: #f4f1ea; border-top: 6px solid #c9b48a; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .gg-method .k { font-size: 30px; letter-spacing: 0.4em; color: #c9b48a; text-align: center; margin-bottom: 14px; }
    .gg-method .row { display: flex; align-items: center; gap: 28px; font-size: 66px; font-weight: 700; letter-spacing: 0.08em; line-height: 1.4; }
    .gg-method .n { width: 60px; height: 60px; border-radius: 50%; border: 4px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 36px; flex: none; }
    .gg-method .row.off { color: rgba(244,241,234,0.22); }
    .gg-method .row.off .bar { width: 640px; height: 14px; background: rgba(244,241,234,0.14); border-radius: 7px; }
    .gg-method .row.lit { color: #fbfaf6; }
    .gg-list .row { font-size: 44px; font-weight: 700; letter-spacing: 0.08em; line-height: 1.5; }
    .gg-list .row b { color: #e3232f; margin-right: 18px; }
    .gg-list .h { font-size: 34px; letter-spacing: 0.4em; color: #c9b48a; text-align: center; margin-bottom: 10px; }
    .gstake.arg .face { box-shadow: 0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5); }
    .gstake.arg .nm { background: #c4121f; }
  `;
  document.head.appendChild(css);
  const hide = (el) => gsap.set(el, { autoAlpha: 0 });
  const fadeIn = (el, t, dur = 0.5, to = 1) => tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: to, duration: dur, ease: "power2.out" }, t);
  const fadeOut = (el, t, dur = 0.5) => tl.to(el, { autoAlpha: 0, duration: dur }, t);
  const G = {};
  // world-space element centred on (x, y)
  G.pin = (html, x, y, o = {}) => {
    const el = document.createElement("div");
    el.className = "gg-pin " + (o.cls || "");
    el.innerHTML = html;
    el.style.left = x + "px"; el.style.top = y + "px";
    pins.appendChild(el);
    gsap.set(el, { xPercent: o.anchor ? o.anchor[0] : -50, yPercent: o.anchor ? o.anchor[1] : -50 });
    hide(el);
    if (o.t != null) tl.fromTo(el, { autoAlpha: 0, scale: o.pop ? 0.4 : 1 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: o.pop ? "back.out(2)" : "power2.out" }, o.t);
    if (o.until != null) fadeOut(el, o.until);
    return el;
  };
  // small label (world px size); anchor default centred
  G.lbl = (text, x, y, o = {}) => G.pin(`<div class="gg-lbl" style="position:relative;font-size:${o.size || 20}px;${o.color ? `color:${o.color};` : ""}">${text}</div>`, x, y, o);
  G.tagbox = (text, x, y, color, o = {}) => G.pin(`<div class="gg-tagbox" style="position:relative;font-size:${o.size || 16}px;background:${color}">${text}</div>`, x, y, o);
  // ship silhouette (world coords), facing left or right
  G.ship = (x, y, o = {}) => {
    const w = o.w || 90, col = o.color || "#1f4fc4";
    return G.pin(`<svg width="${w}" height="${w * 0.36}" viewBox="0 0 100 36" style="display:block;overflow:visible;${o.flip ? "transform:scaleX(-1)" : ""}">
      <path d="M2 22 L96 22 L88 33 L10 33 Z" fill="${col}" stroke="#f3eee2" stroke-width="2.5"/>
      <path d="M30 22 L30 13 L46 13 L46 7 L56 7 L56 13 L66 13 L66 22 Z" fill="${col}" stroke="#f3eee2" stroke-width="2.5"/>
      <line x1="51" y1="7" x2="51" y2="0" stroke="#f3eee2" stroke-width="2.5"/><line x1="12" y1="22" x2="4" y2="17" stroke="#f3eee2" stroke-width="3"/></svg>`, x, y, o);
  };
  // muzzle flash / explosion pulses
  G.flash = (x, y, t, o = {}) => {
    const snd = o.sfx === undefined ? "impact" : o.sfx;
    for (let i = 0; i < (o.n || 3); i++) SFX(snd, t + i * (o.gap || 0.55));
    const r = o.r || 22, n = o.n || 3, gap = o.gap || 0.55;
    const el = document.createElement("div");
    el.style.cssText = `position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;
      background:radial-gradient(circle, #fffbe6 0%, #ffd34d 30%, rgba(255,120,20,0.75) 55%, rgba(255,80,0,0) 72%);`;
    pins.appendChild(el); hide(el);
    for (let i = 0; i < n; i++) {
      tl.fromTo(el, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.1, duration: 0.12, ease: "power2.out", immediateRender: false }, t + i * gap);
      tl.to(el, { autoAlpha: 0, scale: 1.4, duration: 0.3, ease: "power1.in" }, t + i * gap + 0.12);
    }
    return el;
  };
  // ballistic arc (quadratic curve) drawn from A to B, impact flash, then fades
  G.arc = (x1, y1, x2, y2, t, o = {}) => {
    const h = o.h != null ? o.h : Math.hypot(x2 - x1, y2 - y1) * 0.35;
    const L = Math.hypot(x2 - x1, y2 - y1) || 1;
    let nx = (y2 - y1) / L, ny = -(x2 - x1) / L;              // unit normal
    if (ny > 0.15 || (Math.abs(ny) <= 0.15 && nx > 0)) { nx = -nx; ny = -ny; } // bulge up (or left when firing north-south)
    const mx = (x1 + x2) / 2 + nx * h, my = (y1 + y2) / 2 + ny * h;
    const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
    const g = document.createElementNS(NS, "g");
    const col = o.color || "#fff3c4", w = o.width || 4;
    g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="${w + 4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" ${o.dash ? `stroke-dasharray="${o.dash}"` : ""}/>`;
    svg.appendChild(g);
    const ps = g.querySelectorAll("path"), len = ps[0].getTotalLength(), dur = o.dur || 1.1;
    gsap.set(ps[0], { strokeDasharray: `${len} ${len}`, strokeDashoffset: len });
    if (!o.dash) gsap.set(ps[1], { strokeDasharray: `${len} ${len}`, strokeDashoffset: len });
    hide(g);
    tl.to(g, { autoAlpha: 1, duration: 0.01 }, t);
    tl.to(o.dash ? [ps[0]] : [ps[0], ps[1]], { strokeDashoffset: 0, duration: dur, ease: "power1.in" }, t);
    if (o.dash) { gsap.set(ps[1], { opacity: 0 }); tl.to(ps[1], { opacity: 1, duration: dur * 0.5 }, t); }
    if (o.impact !== false) G.flash(x2, y2, t + dur - 0.05, { r: o.r || 20, n: 1 });
    tl.to(g, { autoAlpha: 0, duration: 0.6 }, o.until != null ? o.until : t + dur + 0.5);
    return g;
  };
  // straight "missile" line with a travelling head
  G.polygon = (pts, fill, t, until, o = {}) => {
    const p = document.createElementNS(NS, "polygon");
    p.setAttribute("points", pts.map((q) => q.join(",")).join(" "));
    p.setAttribute("fill", fill); if (o.stroke) { p.setAttribute("stroke", o.stroke); p.setAttribute("stroke-width", o.sw || 4); p.setAttribute("stroke-dasharray", o.dash || "none"); }
    svg.insertBefore(p, svg.firstChild);
    hide(p); fadeIn(p, t, o.dur || 1.0, o.alpha || 1);
    if (until != null) fadeOut(p, until, 0.8);
    return p;
  };
  // gorse hedge: dark green dotted band
  G.gorse = (pts, t, until) => {
    const d = pts.map((q, i) => (i ? "L" : "M") + q[0] + " " + q[1]).join(" ");
    const g = document.createElementNS(NS, "g");
    g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(20,40,16,0.55)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="#4f7a2e" stroke-width="12" stroke-linecap="round" stroke-dasharray="1 15" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="#8fbf4a" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 15" stroke-linejoin="round"/>`;
    svg.insertBefore(g, svg.firstChild);
    hide(g); fadeIn(g, t, 1.2);
    if (until != null) fadeOut(g, until, 0.8);
    return g;
  };
  // world-space full-map layer between the relief and the overlay (units stay bright above it)
  G.layer = (style, t, until, o = {}) => {
    const el = document.createElement("div");
    el.style.cssText = `position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none;${style}`;
    if (o.html) el.innerHTML = o.html;
    world.insertBefore(el, svg);
    hide(el);
    tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: o.alpha || 1, duration: o.dur || 2.0, ease: "sine.inOut" }, t);
    if (until != null) tl.to(el, { autoAlpha: 0, duration: o.outDur || 2.0, ease: "sine.inOut" }, until);
    return el;
  };
  G.night = (t, until, o = {}) => {
    let seed = 7; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    let stars = "";
    for (let i = 0; i < 170; i++) {
      const x = r() * 2880, y = r() * 1620, s = 1.5 + r() * 2.5;
      stars += `<div style="position:absolute;left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;border-radius:50%;background:#e8eeff;opacity:${(0.35 + r() * 0.55).toFixed(2)}"></div>`;
    }
    return G.layer("background: radial-gradient(ellipse 70% 60% at 55% 50%, rgba(10,18,44,0.62), rgba(4,8,22,0.82));", t, until, { html: stars, dur: o.dur || 3.0, outDur: o.outDur || 3.0 });
  };
  G.dawn = (t, until) => G.layer("background: linear-gradient(to left, rgba(255,160,80,0.42), rgba(255,190,130,0.18) 55%, rgba(255,210,160,0.05));", t, until, { dur: 4.0, outDur: 4.0 });
  G.sun = (x, y, o = {}) => {
    const s = o.s || 90;
    let rays = "";
    for (let i = 0; i < 12; i++) rays += `<line x1="50" y1="6" x2="50" y2="18" stroke="#ffcf33" stroke-width="5" stroke-linecap="round" transform="rotate(${i * 30} 50 50)"/>`;
    return G.pin(`<svg width="${s}" height="${s}" viewBox="0 0 100 100" style="display:block;filter:drop-shadow(0 0 10px rgba(255,200,40,0.8))">${rays}<circle cx="50" cy="50" r="24" fill="#ffd84a" stroke="#fff4c2" stroke-width="3"/></svg>`, x, y, { ...o, pop: true });
  };
  // screen-space card
  G.card = (html, cls, top, t, until) => {
    const el = document.createElement("div");
    el.className = "gg-card " + cls; el.style.top = top + "px"; el.innerHTML = `<div class="inner">${html}</div>`;
    scene.insertBefore(el, document.getElementById("credit"));
    hide(el);
    tl.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, t);
    if (until != null) fadeOut(el, until, 0.6);
    return el;
  };
  G.METHOD = ["OWN THE DARK", "MATCH THE WEAPON TO THE WALL", "ATTACK THE MIND, NOT THE MAN"];
  // method card: rowsLit = number of lines shown lit; rowT = reveal times for lit lines
  G.method = (lit, t, until, rowT = []) => {
    const rows = G.METHOD.map((txt, i) => i < lit
      ? `<div class="row lit"><div class="n">${i + 1}</div><div>${txt}</div></div>`
      : `<div class="row off"><div class="n">${i + 1}</div><div class="bar"></div></div>`).join("");
    const el = G.card(`<div class="k">2 PARA'S METHOD</div>${rows}`, "gg-method", lit === 3 ? 300 : 320, t, until);
    el.querySelectorAll(".row.lit").forEach((r, i) => tl.fromTo(r, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }, rowT[i] != null ? rowT[i] : t + 0.4 + i * 0.8));
    return el;
  };
  // artillery (NATO: filled dot) / mortar icons for an existing unit
  G.icon = (uidKey, kind) => {
    const s = B.units[uidKey].el.querySelector("svg");
    s.innerHTML = kind === "gun" ? `<circle cx="50" cy="50" r="17" fill="#f7f3ea"/>`
      : kind === "mortar" ? `<circle cx="50" cy="66" r="11" fill="none" stroke="#f7f3ea" stroke-width="8"/><line x1="50" y1="55" x2="50" y2="14" stroke="#f7f3ea" stroke-width="8"/><polyline points="34,30 50,12 66,30" fill="none" stroke="#f7f3ea" stroke-width="8"/>`
      : kind === "aa" ? `<path d="M10 90 Q50 5 90 90" fill="none" stroke="#f7f3ea" stroke-width="8"/><circle cx="50" cy="62" r="11" fill="#f7f3ea"/>`
      : kind === "hq" ? `<rect x="0" y="0" width="100" height="100" fill="none"/><line x1="0" y1="0" x2="100" y2="100" stroke="#f7f3ea" stroke-width="7"/><line x1="100" y1="0" x2="0" y2="100" stroke="#f7f3ea" stroke-width="7"/>`
      : s.innerHTML;
  };

  // typographic bio (no photo): flag + big NATO unit marker on one side, bio card on the other
  G.bioT = (o) => {
    const side = document.createElement("div");
    side.style.cssText = `position:absolute;top:170px;${o.mirror ? "right:130px" : "left:150px"};width:600px;height:760px;`;
    side.innerHTML = `<img src="${o.flag}" alt="" style="position:absolute;left:20px;top:0;width:560px;height:auto;box-shadow:0 14px 34px rgba(0,0,0,0.6);border:4px solid #f3eee2;transform:rotate(${o.mirror ? 3 : -3}deg)">
      <svg viewBox="0 0 300 200" style="position:absolute;left:120px;top:400px;width:360px;height:240px;filter:drop-shadow(0 10px 18px rgba(0,0,0,0.6))">
        <rect x="6" y="6" width="288" height="188" fill="${o.color || "#1f4fc4"}" stroke="#f3eee2" stroke-width="8"/>
        <line x1="6" y1="6" x2="294" y2="194" stroke="#f3eee2" stroke-width="9"/><line x1="294" y1="6" x2="6" y2="194" stroke="#f3eee2" stroke-width="9"/>
        ${o.airborne !== false ? `<path d="M110 186 Q150 146 190 186" fill="none" stroke="#f3eee2" stroke-width="9"/>` : ""}
      </svg>
      <div style="position:absolute;left:0;right:0;top:660px;text-align:center;font-size:44px;font-weight:700;letter-spacing:0.2em;color:#f4f1ea;text-shadow:0 3px 8px rgba(0,0,0,0.8)">${o.unit || ""}</div>`;
    scene.insertBefore(side, document.getElementById("credit")); hide(side);
    const card = document.createElement("div");
    card.className = "bio-card";
    card.innerHTML = `<div class="h">${o.name}</div><div class="rule"></div>${o.rows.map((r) => `<div class="row">${r}</div>`).join("")}`;
    if (o.mirror) Object.assign(card.style, { left: "110px", borderLeft: "none", borderRight: "10px solid var(--rome)" });
    card.style.top = (o.top || 300) + "px";
    scene.insertBefore(card, document.getElementById("credit")); hide(card);
    const dx = o.mirror ? 1 : -1;
    tl.fromTo(side, { autoAlpha: 0, x: 140 * dx }, { autoAlpha: 1, x: 0, duration: 1.0, ease: "power3.out" }, o.t);
    tl.to(side, { x: -30 * dx, duration: o.until - o.t - 1.0, ease: "none" }, o.t + 1.0);
    tl.fromTo(card, { autoAlpha: 0, x: -80 * dx }, { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out" }, o.t + 0.4);
    tl.to(card, { x: 30 * dx, duration: o.until - o.t - 1.3, ease: "none" }, o.t + 1.3);
    card.querySelectorAll(".row").forEach((r, i) => tl.fromTo(r, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, o.rowT ? o.rowT[i] : o.t + 1 + i * 0.6));
    tl.to([side, card], { autoAlpha: 0, duration: 0.7 }, o.until);
    return { side, card };
  };
  // small name plaque on a stake (world coords, (x,y) = foot of the pole)
  G.stake = (o) => {
    const col = o.side === "rome" ? "#c4121f" : "#1f4fc4", s = o.size || 1;
    const el = G.pin(`<div style="position:relative;width:${260 * s}px;height:${150 * s}px">
      <div style="position:absolute;left:${24 * s}px;top:${30 * s}px;width:${8 * s}px;height:${120 * s}px;background:linear-gradient(90deg,#4c3219,#8a6238 50%,#4c3219);border-radius:2px;box-shadow:0 3px 5px rgba(0,0,0,0.4)"></div>
      <div style="position:absolute;left:0;top:0;padding:${8 * s}px ${12 * s}px;background:var(--paper);border:${3 * s}px solid var(--stake);border-left:${9 * s}px solid ${col};box-shadow:0 6px 12px rgba(0,0,0,0.4);font-family:'Special Elite',monospace;color:var(--ink);white-space:nowrap">
        <div style="font-size:${22 * s}px;line-height:1.1">${o.name}</div>${o.role ? `<div style="font-size:${15 * s}px;margin-top:${4 * s}px;opacity:0.85">${o.role}</div>` : ""}</div></div>`, o.x, o.y, { anchor: [-10, -100] });
    tl.fromTo(el, { autoAlpha: 0, y: -80 * s }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "bounce.out" }, o.t);
    if (o.until != null) fadeOut(el, o.until);
    return el;
  };
  G.fadeIn = fadeIn; G.fadeOut = fadeOut; G.hide = hide;
  return G;
})();

// ---------- projection (assets/isthmus.json: zoom 13, origin_world_px 703494, 1401591) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 13, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 703494).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 1401591).toFixed(1)];
};
// Places (OpenStreetMap / Wikipedia coordinates, checked against the relief)
const CCH = G(-51.7435, -58.962), BURNT = G(-51.7858, -58.9419), BOCA = G(-51.8009, -58.9847), DARWIN = G(-51.807, -58.9588);
const GOOSE = G(-51.8277, -58.9728), AIRF = G(-51.8196, -58.9802), DHILL = G(-51.8035, -58.966), CORON = G(-51.800, -58.948);
const ARROW = [1215, 105];   // HMS Arrow, offshore to the north-west (towards Grantham Sound)
const GUNS = [CCH[0] - 64, CCH[1] + 40];

K.grid(G, -51.90, -51.66, -59.26, -58.72, 0.02, 0.3); // faint lat/long grid
// artillery / naval / mortar shot: gun fires (quiet), shell arc flies, impact carries the boom
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || 0, sfx: o.sfx });
  const dur = o.dur || 1.1;
  GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 3, h: o.h, impact: false });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 13, shake: o.shake != null ? o.shake : 2, puffs: 2 });
};
// close-quarters night fighting (grenades, trench clearing): small spread-out blasts with smoke
const melee = (x, y, t, pts, gap = 0.6) => pts.forEach(([dx, dy, r], i) => K.impact(x + dx, y + dy, t + i * gap, { r: r || 12, shake: false, puffs: 2, life: 2.0 }));

const p = (n) => "move1-" + n;
const S = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (n ? P(p(n)) : 0));

// key moments (spoken phrases)
const T_WALK = at(p(1), "They marched"), T_CCH = at(p(1), "Camilla Creek House"), T_SOUTH = at(p(1), "stretched away");
const T_GIFT = at(p(2), "gift to any defender"), T_WIDE = at(p(2), "little more than a mile"), T_WATER = at(p(2), "water on both sides");
const T_TREES = at(p(2), "no trees"), T_GORSE = at(p(2), "thick lines of gorse"), T_LAYERS = at(p(2), "defences in layers");
const T_PIAG = at(p(3), "Lieutenant Colonel"), T_TFM = at(p(3), "Task Force Mercedes"), T_SCREEN = at(p(3), "screen of outposts");
const T_MAIN = at(p(3), "main line"), T_DH = at(p(3), "from Darwin Hill"), T_BEHIND = at(p(3), "Behind it"), T_AA = at(p(3), "anti-aircraft guns");
const T_IDEA = at(p(4), "simple idea"), T_TRENCH = at(p(4), "prepared trenches"), T_DAY = at(p(4), "In daylight"), T_ALERT = at(p(4), "after the BBC");
const T_SAW = S[5], T_TRAIN = at(p(5), "best-trained"), T_CONS = at(p(5), "young conscripts"), T_DARK = at(p(5), "In the dark");
const T_NUM = at(p(5), "numbers mattered"), T_PLAN = at(p(5), "Jones planned"), T_SIX = at(p(5), "six-phase");
const T_335 = S[6], T_ARROW = at(p(6), "HMS Arrow"), T_THREE = at(p(6), "three British guns"), T_ACOY = at(p(6), "A Company");
const T_CLEAR = S[7], T_BCOY = at(p(7), "B Company pushed"), T_TBT = at(p(7), "trench by trench"), T_FELL = at(p(7), "some fell back"), T_GAVE = at(p(7), "gave way");
const T_DCOY = S[8], T_MORT = at(p(8), "mortar crews"), T_PEAT = at(p(8), "soft peat"), T_GUNS = at(p(8), "three light guns"), T_EMPTY = at(p(8), "nearly empty");
const T_LIGHT = S[9], T_OVER = at(p(9), "overrun"), T_LATE = at(p(9), "hours behind"), T_HMS = at(p(9), "HMS Arrow"), T_LEAVE = at(p(9), "had to leave");
const T_SUN = at(p(9), "as the sun came up"), T_OPEN = at(p(9), "in the open"), T_GONE = at(p(9), "The darkness that");
const T_METH = S[10], T_OWN = at(p(10), "Own the dark");

// ---------- camera (cx, cy, scale); clamped by the engine ----------
B.camera([
  [0, 1660, 420, 1.3],
  [T_SOUTH - 1.0, 1650, 440, 1.3],
  [S[2] + 1.5, 1600, 900, 1.9],
  [T_WATER + 1.0, 1590, 910, 1.95],
  [T_LAYERS - 1.0, 1590, 960, 1.75],
  [S[3] + 1.5, 1600, 1060, 1.8],
  [S[4] + 1.0, 1600, 950, 2.0],
  [S[5] - 0.5, 1600, 950, 2.0],
  [S[5] + 3.0, 1620, 690, 1.6],
  [S[6] - 0.5, 1630, 700, 1.6],
  [S[6] + 2.5, 1480, 560, 1.02],
  [T_ACOY - 0.5, 1500, 580, 1.02],
  [T_ACOY + 2.5, 1660, 790, 1.9],
  [S[7] + 1.0, 1640, 820, 2.1],
  [T_GAVE, 1630, 830, 2.1],
  [S[8] + 1.0, 1620, 830, 1.75],
  [S[9] - 0.5, 1610, 840, 1.7],
  [S[9] + 2.5, 1470, 640, 0.95],
  [T_SUN - 1.0, 1480, 650, 0.95],
  [T_SUN + 2.5, 1575, 945, 2.3],
  [S[10], 1580, 950, 2.25],
  [END, 1580, 950, 2.4],
]);

// ---------- move1-1: title, the march ----------
B.dim(0, 5.4, 0.6);
B.title("MOVE 1", "THE NIGHT ASSAULT", "28 May 1982", 0.4, 5.2);
B.showDate(5.4);
B.date("26 – 27 MAY 1982", 5.6, T_335 - 0.2, 38);
B.city("CAMILLA CREEK HOUSE", ...CCH, { size: 24, r: 7, t: 5.8 });
B.arrow({ side: "carth", pts: [[1720, -10], [1715, 120], [1680, 260], [1630, 380]], width: 12, t: T_WALK, dur: 4.0, until: T_GIFT });
GG.lbl("▲ FROM SAN CARLOS", 1735, 40, { size: 22, anchor: [0, -50], t: T_WALK + 0.4, until: T_GIFT });
GG.tagbox("13 MILES ON FOOT · WET PEAT", 1740, 200, "#1f4fc4", { size: 20, anchor: [0, -50], t: T_WALK + 1.4, until: T_GIFT });
B.unit({ id: "para", side: "carth", x: CCH[0], y: CCH[1] + 46, w: 50, h: 34, label: "2 PARA", t: T_CCH });
K.counter("para", { icon: "infantry", flag: "uk", size: "II" });
B.caption("CARRYING EVERYTHING ON THEIR BACKS", at(p(1), "carrying everything"), T_SOUTH - 0.2, "carth r");
B.unit({ id: "guns", side: "carth", x: GUNS[0], y: GUNS[1], w: 36, h: 26, label: "3 GUNS", t: T_SOUTH });
K.counter("guns", { icon: "artillery", flag: "uk" });

// ---------- move1-2: the ground ----------
B.city("BURNTSIDE HOUSE", ...BURNT, { size: 18, r: 6, t: S[2] + 0.6 });
B.city("BOCA HOUSE", ...BOCA, { size: 18, r: 6, left: true, t: S[2] + 1.0 });
B.city("DARWIN", ...DARWIN, { size: 18, r: 6, t: S[2] + 1.3 });
B.city("GOOSE GREEN", ...GOOSE, { size: 20, r: 7, t: S[2] + 1.6 });
GG.lbl("AIRFIELD", AIRF[0] - 10, AIRF[1] - 50, { size: 16, anchor: [-50, -50], t: S[2] + 1.9 });
const lochL = B.label("BRENTON LOCH", 1310, 800, { cls: "sea", size: 22, t: S[2] + 2.2 });
const hbrL = B.label("DARWIN HARBOUR", 1810, 1150, { cls: "sea", size: 18, t: S[2] + 2.4 });
B.tl.to([lochL, hbrL], { scale: 1.18, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_WATER);
// the neck: measurement bar
const neck = GG.pin(`<svg width="200" height="40" viewBox="0 0 200 40" style="display:block;overflow:visible">
  <line x1="4" y1="20" x2="196" y2="20" stroke="#1b1812" stroke-width="7"/><line x1="4" y1="20" x2="196" y2="20" stroke="#fbfaf6" stroke-width="3.5" stroke-dasharray="10 6"/>
  <line x1="4" y1="6" x2="4" y2="34" stroke="#fbfaf6" stroke-width="4"/><line x1="196" y1="6" x2="196" y2="34" stroke="#fbfaf6" stroke-width="4"/></svg>`, 1582, 905, { t: T_WIDE - 0.6, until: T_LAYERS });
GG.lbl("~1 MILE WIDE", 1582, 882, { size: 16, t: T_WIDE - 0.3, until: T_LAYERS });
B.caption("NO TREES · NO WALLS · ALMOST NO COVER", T_TREES - 0.3, T_GORSE - 0.3, "r");
const GORSE = [[BOCA[0] + 8, BOCA[1] + 8], [1520, 975], [1560, 992], [DHILL[0] + 14, DHILL[1] + 16], [1616, 1006]];
GG.gorse(GORSE, T_GORSE);
GG.lbl("GORSE LINE", 1462, 1004, { size: 16, color: "#d9f2b0", anchor: [-100, -50], t: T_GORSE + 0.3 });
B.caption("BOGGY GRASS · GULLIES · THICK GORSE", T_GORSE, T_LAYERS - 0.2, "r");
// defensive layers
const FWD = [[1500, 872], [1560, 858], [1640, 846], [1700, 842], [1770, 848]];
const MAIN = [[BOCA[0] + 6, BOCA[1] - 20], [1522, 956], [1570, 968], [1608, 982], [1628, 998]];
const DEPTH = [[1462, 1150], [1500, 1170], [1540, 1182], [1578, 1190]];
// glowing two-colour fronts (drawn west -> east: sideA = north = British blue, sideB = south = Argentine red)
K.front({ pts: FWD, sideA: "carth", sideB: "rome", width: 16, t: T_LAYERS, dur: 1.2, until: T_GAVE + 0.4 });
K.front({ pts: MAIN, sideA: "carth", sideB: "rome", width: 18, t: T_LAYERS + 0.8, dur: 1.2, until: END + 1 });
K.front({ pts: DEPTH, sideA: "carth", sideB: "rome", width: 16, t: T_LAYERS + 1.6, dur: 1.2, until: END + 1 });
// ---------- TERRITORY TEST: each side's ground tinted; lost ground fades away ----------
const MASK = "assets/isthmus_land.png";
const BLUE0 = [[0, 150], [2880, 150], [2880, 852], [1770, 848], [1640, 846], [1560, 858], [1500, 872], [0, 884]];
const BLUE1 = [[0, 150], [2880, 150], [2880, 940], [1770, 925], [1640, 950], [1560, 930], [1500, 925], [0, 945]];   // forward zone taken
const BLUE2 = [[0, 150], [2880, 150], [2880, 975], [1780, 960], [1628, 980], [1570, 952], [1500, 922], [0, 950]];   // up to the gorse line
const blueT = K.territory({ pts: BLUE0, side: "carth", t: T_LAYERS - 0.5, alpha: 0.3, mask: MASK, soft: 14 });
const fwdZone = K.territory({ pts: [[0, 884], [1500, 872], [1560, 858], [1640, 846], [1770, 848], [2880, 852], [2880, 975], [1628, 998], [1570, 968], [1522, 956], [0, 960]], side: "rome", t: T_LAYERS + 0.2, alpha: 0.26, mask: MASK });
const mainZone = K.territory({ pts: [[1300, 960], [1522, 956], [1570, 968], [1628, 998], [1850, 975], [1700, 1100], [1660, 1300], [1560, 1420], [1380, 1400], [1300, 1250]], side: "rome", t: T_LAYERS + 0.9, alpha: 0.26, mask: MASK });
// the forward positions give way: their ground fades, British ground moves in
K.lose(fwdZone, T_GAVE - 0.3);
K.shift(blueT, BLUE1, T_GAVE + 0.2, 3.0);
// D Company leapfrogs through the centre: British ground reaches the gorse line
K.shift(blueT, BLUE2, T_DCOY + 1.0, 3.5);


// ---------- move1-3: Piaggi and Task Force Mercedes ----------
K.badge({ name: "LT. COL. ÍTALO PIAGGI", role: "TASK FORCE MERCEDES · ~1,000 MEN", photo: "assets/media/piaggi_head.png", flag: "arg", side: "rome", corner: "bl", t: T_PIAG - 0.3, until: T_BEHIND + 0.2 });
const RED = {
  f1: [1540, 870, ""], f2: [1628, 856, ""], f3: [BURNT[0] + 30, BURNT[1] + 26, ""], f4: [CORON[0], CORON[1] + 2, ""],
  m1: [BOCA[0] + 26, BOCA[1] - 16, ""], m2: [1532, 978, "12th REGT"], m3: [DHILL[0] + 6, DHILL[1] + 2, ""],
  d1: [AIRF[0] + 16, AIRF[1] - 20, "AIR FORCE AA GUNS"], d2: [GOOSE[0] - 30, GOOSE[1] - 36, "C COY 25th REGT"], d3: [GOOSE[0] + 34, GOOSE[1] - 40, ""],
};
const RT = { f: T_SCREEN, m: T_MAIN, d: T_BEHIND };
Object.entries(RED).forEach(([id, [x, y, label]], i) => B.unit({ id, side: "rome", x, y, w: 26, h: 18, label: label || null, t: RT[id[0]] + 0.3 + (i % 4) * 0.25 }));
["f1", "f2", "f3", "f4"].forEach((id) => K.counter(id, { icon: "infantry", flag: "arg", size: "•••" }));
K.counter("m1", { icon: "infantry", flag: "arg", size: "I" });
K.counter("m2", { icon: "infantry", flag: "arg", size: "III" });
K.counter("m3", { icon: "infantry", flag: "arg", size: "I" });
K.counter("d1", { icon: "aa", flag: "arg" });
K.counter("d2", { icon: "infantry", flag: "arg", size: "I" });
K.counter("d3", { icon: "artillery", flag: "arg" });
B.caption("A SCREEN OF OUTPOSTS FORWARD", T_SCREEN, T_MAIN - 0.2, "rome r");
GG.lbl("DARWIN HILL", 1562, 1034, { size: 15, t: T_DH - 0.2 });
B.caption("MAIN LINE: DARWIN HILL TO BOCA HOUSE", T_MAIN + 0.4, T_BEHIND - 0.2, "rome r");
[[1440, 990], [1500, 1000], [1560, 1010], [1470, 1030], [1540, 1040]].forEach(([x, y], i) => K.gun(AIRF[0] + 16, AIRF[1] - 24, T_AA + 0.3 + i * 0.35, { dx: 0, dy: 0, sfx: "mg" }));
[[1440, 990], [1500, 1000], [1560, 1010], [1470, 1030], [1540, 1040]].forEach(([x, y], i) => GG.arc(AIRF[0] + 16, AIRF[1] - 24, x, y, T_AA + 0.3 + i * 0.35, { h: 0, color: "#ff6a5a", dash: "10 7", width: 3, dur: 0.6, impact: false, until: T_IDEA + 1 }));
B.caption("AA GUNS COULD FIRE ALONG THE GROUND", T_AA + 0.4, S[4] - 0.2, "rome r");

// ---------- move1-4: what the defender believed ----------
GG.sun(1780, 720, { s: 110, t: T_IDEA, until: T_SAW });
const bub = B.bubble("THEY WILL COME IN DAYLIGHT.", 1180, 1040, T_IDEA + 0.6, T_SAW);
const KZ = [[1492, 890], [1560, 874], [1640, 866], [1700, 872], [1690, 930], [1640, 965], [1600, 972], [1565, 962], [1522, 950], [1490, 940]];
GG.polygon(KZ, "rgba(196,18,31,0.32)", T_TRENCH, T_SAW + 1, { stroke: "rgba(196,18,31,0.9)", sw: 3, dash: "12 8" });
B.caption("PREPARED TRENCHES · HEAVY MACHINE GUNS · ARTILLERY", T_TRENCH, T_DAY - 0.2, "rome r");
GG.lbl("KILLING FIELD", 1600, 912, { size: 18, color: "#ffd9d4", t: T_DAY, until: T_SAW + 1 });
B.caption("IN DAYLIGHT: A KILLING FIELD", T_DAY + 0.2, T_ALERT - 0.2, "rome r");
B.caption("ALERT AND WAITING", T_ALERT + 0.3, S[5] - 0.2, "rome r");

// ---------- move1-5: night ----------
GG.night(T_SAW, T_LIGHT + 0.5, { dur: 3.0, outDur: 4.0 });
B.caption("BUT H JONES SAW SOMETHING DIFFERENT", T_SAW + 0.2, T_TRAIN - 0.2, "carth r");
K.badge({ name: "LT. COL. H. JONES", role: "CO, 2 PARA", initials: "H", flag: "uk", side: "carth", corner: "tr", t: T_SAW + 0.2, until: S[6] - 0.4 });
B.caption("2 PARA: TRAINED TO FIGHT AT NIGHT", T_TRAIN, T_CONS - 0.2, "carth r");
B.caption("DEFENDERS: YOUNG CONSCRIPTS · COLD · POORLY SUPPLIED", T_CONS, T_DARK - 0.2, "rome r");
B.caption("IN THE DARK: NO OBSERVATION · NO TARGETS", T_DARK, T_PLAN - 0.2, "carth r");
GG.card(`<div style="font-size:40px;font-weight:700;letter-spacing:0.12em;padding:0">NIGHT = BRITISH ADVANTAGE</div>`, "tl", 210, T_NUM - 0.5, T_335 - 0.3);
B.caption("6-PHASE NIGHT ATTACK · COMPANY LEAPFROGS COMPANY", T_SIX, S[6] - 0.3, "carth r");
// 2 PARA splits into companies at the start line
const CO = { A: [1668, 740], B: [1532, 742], C: [1606, 690], D: [1590, 628] };
Object.entries(CO).forEach(([k, [x, y]], i) => {
  B.unit({ id: "c" + k, side: "carth", x: CCH[0], y: CCH[1] + 46, w: 28, h: 20, label: k + " COY", t: null });
  K.counter("c" + k, { icon: "infantry", flag: "uk", size: "I" });
  B.show("c" + k, T_SIX - 0.2);
  B.move("c" + k, T_SIX + 0.2 + i * 0.3, 2.6, x, y);
});
B.hideUnits(["para"], T_SIX + 0.2);

// ---------- move1-6: 03:35, the barrage ----------
B.date("28 MAY · 03:35", T_335 + 0.2, T_LIGHT, 38);
const arrowShip = GG.ship(ARROW[0], ARROW[1], { w: 110, t: T_ARROW - 0.8 });
const arrowL = GG.lbl("HMS ARROW", ARROW[0], ARROW[1] + 34, { size: 22, t: T_ARROW - 0.6 });
const arrowT = GG.tagbox("4.5-INCH GUN", ARROW[0], ARROW[1] + 62, "#1f4fc4", { size: 15, t: T_ARROW + 0.2 });
const ARROW_GUN = [ARROW[0] - 48, ARROW[1] - 2]; // 4.5-inch gun on the bow
const TGT = [[RED.f1[0], RED.f1[1]], [RED.f3[0], RED.f3[1]], [RED.f2[0], RED.f2[1]], [RED.m1[0], RED.m1[1]]];
for (let i = 0; i < 9; i++) {
  const t = T_ARROW + 0.5 + i * 1.5;
  const [tx, ty] = TGT[i % TGT.length];
  shoot(ARROW_GUN, [tx + ((i * 37) % 30) - 15, ty + ((i * 23) % 20) - 10], t, { dur: 1.3, width: 3.5, r: 16 });
}
for (let i = 0; i < 12; i++) {
  const t = T_THREE + 0.3 + i * 0.95;
  const [tx, ty] = TGT[(i + 1) % 3];
  shoot([GUNS[0], GUNS[1] - 8], [tx + ((i * 29) % 36) - 18, ty + ((i * 17) % 24) - 12], t, { unit: "guns", dur: 1.1, h: 120, r: 13 });
}
B.caption("HMS ARROW AND 3 LIGHT GUNS OPEN FIRE", T_ARROW + 1.0, T_ACOY - 0.2, "carth r");
const aArrow1 = B.arrow({ side: "carth", pts: [[1672, 758], [1700, 785], [BURNT[0] + 4, BURNT[1] - 6]], width: 12, t: T_ACOY + 0.6, dur: 2.0, until: T_DCOY + 2 });
B.move("cA", T_ACOY + 0.8, 3.5, BURNT[0] - 26, BURNT[1] - 22);
K.target(BURNT[0], BURNT[1], T_ACOY + 0.4, { r: 38, until: T_CLEAR + 1.0 });

// ---------- move1-7: Burntside House, west side ----------
melee(BURNT[0] + 30, BURNT[1] + 26, T_CLEAR - 1.6, [[-10, -8, 12], [12, 6, 11], [-4, 16, 13], [18, -10, 10]], 0.55);
B.grey(["f3"], T_CLEAR + 0.5, 1.0);
B.hideUnits(["f3"], T_FELL + 1.5, 1.0);
B.caption("A COY: BURNTSIDE HOUSE CLEARED", T_CLEAR + 0.4, T_BCOY - 0.2, "carth r");
GG.lbl("BURNTSIDE HILL", 1500, 890, { size: 15, anchor: [-100, -50], t: T_BCOY - 0.2, until: T_LIGHT });
const bArrow1 = B.arrow({ side: "carth", pts: [[1530, 760], [1514, 805], [1528, 848]], width: 12, t: T_BCOY + 0.2, dur: 2.2, until: T_DCOY + 2 });
B.move("cB", T_BCOY + 0.4, 3.5, 1520, 830);
B.caption("TRENCH BY TRENCH · GRENADES AND RIFLES AT CLOSE RANGE", T_TBT, T_FELL - 0.2, "carth r");
melee(RED.f1[0], RED.f1[1], T_TBT - 0.5, [[-14, -6, 12], [8, 10, 14], [16, -8, 11], [-4, 14, 12]], 0.7);
melee(RED.f2[0], RED.f2[1], T_TBT + 0.85, [[10, -8, 12], [-12, 8, 13], [4, 14, 10]], 0.7);
B.move("f2", T_FELL, 2.5, 1610, 918);          // some outposts fell back
B.grey(["f1"], T_FELL + 0.3, 1.0);
B.hideUnits(["f1"], T_GAVE + 1.0, 1.0);
B.caption("THE FORWARD POSITIONS GAVE WAY", T_GAVE - 0.2, S[8] - 0.2, "carth r");

// ---------- move1-8: D Company, mortars, guns ----------
B.arrow({ side: "carth", pts: [[1590, 650], [1596, 740], [1604, 830], [1610, 880]], width: 14, t: T_DCOY + 0.3, dur: 2.6, until: T_LIGHT + 1 });
B.move("cD", T_DCOY + 0.5, 4.0, 1612, 872);
B.grey(["f2"], T_DCOY + 3.0, 1.0);
B.hideUnits(["f2"], T_MORT + 1.0, 1.0);
B.caption("D COY LEAPFROGS THROUGH THE CENTRE", T_DCOY + 0.4, T_MORT - 0.2, "carth r");
B.arrow({ side: "carth", pts: [[BURNT[0] - 6, BURNT[1] + 20], [1712, 880], [CORON[0] + 20, CORON[1] - 26]], width: 11, t: T_DCOY + 1.2, dur: 2.4, until: T_LIGHT + 1 });
B.move("cA", T_DCOY + 1.4, 4.0, CORON[0] + 26, CORON[1] - 34);
B.move("cB", T_DCOY + 1.8, 4.0, 1508, 900);
B.move("cC", T_DCOY + 2.0, 4.0, 1600, 800);
B.grey(["f4"], T_MORT, 1.0);
B.hideUnits(["f4"], T_PEAT, 1.0);
B.unit({ id: "mort", side: "carth", x: 1665, y: 718, w: 26, h: 18, label: "MORTARS", t: T_MORT - 0.6 });
GG.icon("mort", "mortar");
K.counter("mort", { flag: "uk" });
for (let i = 0; i < 8; i++) {
  const t = T_MORT + 0.2 + i * 0.8;
  shoot([1665, 710], [1540 + (i * 23) % 90, 950 + (i * 13) % 30], t, { unit: "mort", sfx: "mortar", dur: 0.9, width: 2.5, h: 90, r: 12 });
}
B.caption("MORTAR BASEPLATES DRIVEN DEEP INTO THE PEAT", T_PEAT - 1.2, T_GUNS - 0.2, "carth r");
for (let i = 0; i < 7; i++) {
  const t = T_GUNS + 0.2 + i * 0.9;
  shoot([GUNS[0], GUNS[1] - 8], [1500 + (i * 31) % 120, 940 + (i * 19) % 40], t, { unit: "guns", dur: 1.2, h: 140, r: 13 });
}
B.caption("3 LIGHT GUNS · HUNDREDS OF ROUNDS", T_GUNS + 0.2, T_EMPTY - 0.2, "carth r");
GG.tagbox("NEARLY EMPTY", GUNS[0], GUNS[1] + 44, "#8a877f", { size: 15, t: T_EMPTY, until: S[10] });
B.caption("BY DAWN: NEARLY OUT OF SHELLS", T_EMPTY, S[9] - 0.2, "rome r");
const bf = K.front({ pts: [[1500, 760], [1560, 752], [1610, 740], [1680, 752]], to: [[1500, 902], [1560, 878], [1612, 868], [1700, 900]], sideA: "carth", sideB: "rome", width: 16, t: T_DCOY + 0.2, dur: 1.2, moveT: T_DCOY + 1.4, moveDur: 4.5, until: T_SUN + 0.3 });

// ---------- move1-9: first light ----------
GG.dawn(T_LIGHT, S[10] + 4);
B.date("28 MAY · FIRST LIGHT", T_LIGHT + 0.4, null, 38);
B.caption("FORWARD SCREEN OVERRUN", T_OVER - 0.3, T_LATE - 0.2, "carth r");
B.caption("BUT HOURS BEHIND SCHEDULE", T_LATE, T_HMS - 0.2, "rome r");
GG.tagbox("GUN FAULT", ARROW[0], ARROW[1] - 40, "#c4121f", { size: 16, t: T_HMS + 0.3, until: T_SUN });
B.tl.to([arrowL, arrowT], { autoAlpha: 0, duration: 0.6 }, T_LEAVE);
B.tl.to(arrowShip, { x: -120, y: -150, autoAlpha: 0, duration: 4.5, ease: "power1.in" }, T_LEAVE + 0.3);
B.caption("HMS ARROW LEAVES BEFORE DAWN", T_LEAVE, T_SUN - 0.2, "rome r");
GG.sun(1790, 760, { s: 120, t: T_SUN + 1.0, until: S[10] });
// A and B halted in the open, short of the gorse line
B.move("cA", T_SUN + 0.5, 3.0, 1628, 935);
B.move("cB", T_SUN + 0.5, 3.0, 1492, 896);
B.move("cD", T_SUN + 0.8, 3.0, 1575, 900);
B.hideUnits(["cC", "mort"], T_SUN + 0.5);
B.caption("A AND B COMPANIES: IN THE OPEN, IN FRONT OF THE MAIN LINE", T_OPEN - 0.3, T_GONE - 0.2, "rome r");
GG.pin(`<div style="width:70px;height:70px;border-radius:50%;border:5px solid #fff3c4;box-shadow:0 0 12px rgba(255,200,80,0.9)"></div>`, 1628, 935, { t: T_OPEN, until: S[10] });
GG.pin(`<div style="width:70px;height:70px;border-radius:50%;border:5px solid #fff3c4;box-shadow:0 0 12px rgba(255,200,80,0.9)"></div>`, 1492, 896, { t: T_OPEN + 0.3, until: S[10] });
K.target(DHILL[0], DHILL[1] + 6, T_OPEN - 0.2, { r: 46, until: S[10] });
B.caption("THE DARKNESS WAS GONE", T_GONE, S[10] - 0.2, "rome r");

// ---------- move1-10: method ----------
B.dim(T_METH - 0.2, END + 1, 0.8);
B.dateBox(T_METH - 0.2);
GG.method(1, T_METH + 0.2, END + 1, [T_OWN - 0.2]);
K.raiseTerritory();
B.finish();
