// Gavin 1-minute TEST scene 'biazza' (biazza basemap, paragraphs bz-1 .. bz-5). Sides: US = blue ("carth"), German = red ("rome").
// Built with: python3 tools/build_scene.py biazza biazza bz-1 bz-5
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

// ---------- projection (assets/biazza.json: zoom 14, origin_world_px 2263542, 1632249) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 14, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 2263542).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 1632249).toFixed(1)];
};
// Places: Ponte Dirillo memorial 37.0318 N 14.4044 E (uswarmemorials.org); Acate (Biscari) 37.025 N 14.494 E;
// Biazza Ridge = the scarp on the east side of the Acate (Dirillo) valley (terrain: edge rises 30 m -> 90-150 m), see research/FACT_NOTES.md
const ACATE = G(37.025, 14.494);
const BRIDGE = [1452, 578];                       // Route 115 crosses the Dirillo
const CREST = [[1440, 700], [1560, 690], [1680, 668], [1800, 650], [1910, 612], [2020, 588]];
const FRONT = [[1430, 668], [1560, 654], [1690, 634], [1810, 616], [1920, 580], [2035, 553]];   // where the sides touch
const FRONT2 = [[1430, 548], [1560, 532], [1690, 514], [1810, 494], [1920, 462], [2035, 432]];  // after the counterattack
const ROAD = [[0, 300], [500, 372], [1000, 452], [1300, 520], [BRIDGE[0], BRIDGE[1]], [1560, 662], [1700, 800], [1950, 1030], [2250, 1290], [2560, 1620]];
const RIVER = [[2880, 205], [2700, 250], [2550, 302], [2400, 382], [2250, 470], [2100, 505], [1950, 556], [1800, 606], [1650, 606], [1540, 590], [BRIDGE[0], BRIDGE[1]], [1350, 600], [1200, 640], [1050, 662], [900, 640], [750, 570], [600, 525], [430, 505], [330, 500]];
const SHIPS = [[470, 1070], [650, 1290], [380, 1330]];
const ASSY = [2060, 1060];                        // where Gavin gathered his men (the tomato field, east of the ridge road)
const MASK = "assets/biazza_land.png";

K.grid(G, 36.94, 37.07, 14.27, 14.54, 0.02, 0.2);
// shot: gun fires (quiet), shell arc flies, impact carries the boom
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || 0, sfx: o.sfx });
  const dur = o.dur || 1.0;
  GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 3, h: o.h, color: o.color, impact: false });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 13, puffs: 2 });
};
const tracer = (from, to, t, col) => GG.arc(from[0], from[1], to[0], to[1], t, { h: 0, color: col || "#ff6a5a", dash: "10 7", width: 3, dur: 0.5, impact: false, until: t + 0.9 });

const p = (n) => "bz-" + n;
const S = [0, 1, 2, 3, 4, 5].map((n) => (n ? P(p(n)) : 0));
// key moments (spoken phrases)
const T_ROLL = at(p(1), "Rolling toward"), T_HEAVY = at(p(1), "the heaviest"), T_NIGHT = at(p(1), "By nightfall"), T_RUN = at(p(1), "running");
const T_SIC = S[2], T_SCAT = at(p(2), "scattered"), T_GAVIN = at(p(2), "Colonel James Gavin"), T_DAWN = at(p(2), "At dawn"), T_EVERY = at(p(2), "every man");
const T_830 = at(p(2), "half past eight"), T_STORM = at(p(2), "stormed"), T_HIGH = at(p(2), "the high ground"), T_BEACH = at(p(2), "American beaches");
const T_AFT = S[3], T_HG = at(p(3), "Hermann"), T_BAZ = at(p(3), "Bazooka"), T_PACK = at(p(3), "Two small pack"), T_SIGHTS = at(p(3), "open sights"), T_ORDER = at(p(3), "Gavin's order");
const T_ENS = S[4], T_WARSHIPS = at(p(4), "the warships"), T_SHELLS = at(p(4), "Their shells"), T_SIX = at(p(4), "At six"), T_SHERM = at(p(4), "six Shermans");
const T_EVERYONE = at(p(4), "threw in everyone"), T_FLED = at(p(4), "The Germans fled");
const T_HELD = S[5], T_COST = at(p(5), "It cost"), T_SAFE = at(p(5), "But the beaches");

// ---------- camera (cx, cy, scale); clamped by the engine ----------
B.camera([
  [0, 1740, 620, 1.7],
  [T_ROLL - 0.3, 1760, 610, 1.78],
  [T_NIGHT - 0.2, 1800, 600, 1.85],
  [T_NIGHT + 0.25, 1840, 560, 1.45],          // flash-forward: the snap out (zoom sound)
  [S[2] - 0.2, 1840, 560, 1.45],
  [T_SCAT + 0.6, 1440, 830, 0.72],            // the whole beachhead: drop scattered everywhere
  [T_EVERY + 0.5, 1500, 840, 0.75],
  [T_830 + 0.6, 1820, 820, 1.25],
  [T_HIGH, 1820, 800, 1.25],
  [T_BEACH + 0.8, 1640, 1080, 0.95],          // the ridge and the beaches behind it
  [S[3] - 0.3, 1640, 1060, 0.95],
  [S[3] + 1.8, 1760, 620, 1.55],
  [T_PACK, 1740, 640, 1.65],
  [T_ORDER + 1.0, 1730, 650, 1.7],
  [S[4] + 0.2, 1730, 650, 1.65],
  [T_WARSHIPS + 0.2, 1180, 900, 0.82],        // pull out to the fleet offshore
  [T_SHELLS + 2.2, 1250, 860, 0.84],
  [T_SIX + 0.6, 1820, 760, 1.2],
  [T_FLED + 0.5, 1800, 640, 1.3],
  [S[5], 1780, 660, 1.25],
  [END, 1780, 660, 1.3],
]);

// ---------- terrain features (on from the first frame) ----------
B.river(RIVER, 9);
const roadG = document.createElementNS("http://www.w3.org/2000/svg", "g");
const roadD = ROAD.map((q, i) => (i ? "L" : "M") + q[0] + " " + q[1]).join(" ");
roadG.innerHTML = `<path d="${roadD}" fill="none" stroke="rgba(40,30,16,0.55)" stroke-width="11" stroke-linejoin="round"/><path d="${roadD}" fill="none" stroke="#efe6cf" stroke-width="5" stroke-linejoin="round"/>`;
document.getElementById("overlay").insertBefore(roadG, document.getElementById("overlay").children[1] || null);
GG.lbl("ROUTE 115", 1040, 432, { size: 18, color: "#f3ead2", t: 0.2 });
GG.lbl("◄ TO GELA", 150, 300, { size: 20, t: 0.2 });
GG.lbl("TO VITTORIA ►", 2390, 1430, { size: 20, t: 0.2 });
GG.lbl("PONTE DIRILLO", BRIDGE[0] - 16, BRIDGE[1] - 26, { size: 18, anchor: [-100, -50], t: 0.3 });
GG.lbl("ACATE RIVER", 2330, 400, { size: 17, color: "#d8ecf4", t: 0.3 });
GG.pin(`<div style="width:16px;height:16px;border-radius:50%;background:#fbfaf6;border:3px solid #222"></div>`, ACATE[0], ACATE[1], { t: 0.3 });
GG.lbl("BISCARI", ACATE[0] + 18, ACATE[1], { size: 20, anchor: [0, -50], t: 0.3 });
const ridgeL = GG.lbl("BIAZZA RIDGE", 1770, 735, { size: 26, color: "#fff6d8", t: 0.2 });
B.label("GULF OF GELA", 470, 1180, { cls: "sea", size: 30, t: 0.2 });

// ---------- bz-1: the stakes (units on screen in the first second) ----------
const BLUE = { b1: [1520, 724, "I"], b2: [1650, 704, "I"], b3: [1790, 684, "I"], b4: [1925, 646, "I"] };
Object.entries(BLUE).forEach(([id, [x, y, sz]], i) => {
  B.unit({ id, side: "carth", x, y, w: 34, h: 24, t: 0.05 + i * 0.12 });
  K.counter(id, { icon: "infantry", flag: "us", size: sz });
});
GG.tagbox("A FEW HUNDRED PARATROOPERS", 1720, 790, "#1f4fc4", { size: 18, t: 0.6, until: T_NIGHT });
// the Tigers roll in from the north-east (hook preview units)
const HT = [["ht1", 1680, 586], ["ht2", 1830, 566], ["ht3", 1980, 524]];
HT.forEach(([id, x, y], i) => {
  B.unit({ id, side: "rome", x: 2300 + i * 40, y: 380 + i * 18, w: 36, h: 24, t: T_ROLL - 0.4 + i * 0.25 });
  K.counter(id, { icon: "tank", flag: "ger" });
  B.move(id, T_ROLL + 0.1 + i * 0.25, 3.4, x, y, "power1.out");
});
const hookArrow = B.arrow({ side: "rome", pts: [[2290, 400], [2120, 470], [1960, 540]], width: 13, t: T_ROLL, dur: 1.6, until: T_NIGHT });
GG.tagbox("TIGER TANKS · 88 MM GUNS", 2140, 400, "#c4121f", { size: 18, t: T_HEAVY - 0.3, until: T_NIGHT });
// odds card
SFX("hit", T_HEAVY + 0.1);
const odds = GG.card(`<div style="display:flex;align-items:center;gap:34px;font-weight:700;letter-spacing:0.04em">
  <div style="text-align:center"><div style="font-size:64px;line-height:1.05;color:#6f9bff">RIFLES<br>BAZOOKAS</div><div style="font-size:24px;letter-spacing:0.3em;color:#c9d6ff;margin-top:6px">PARATROOPERS</div></div>
  <div class="vs" style="font-size:48px;color:#c9b48a">VS</div>
  <div class="red" style="text-align:center"><div style="font-size:64px;line-height:1.05;color:#ff5b5b">TIGER<br>TANKS</div><div style="font-size:24px;letter-spacing:0.3em;color:#ffc4c4;margin-top:6px">HERMANN GÖRING DIV.</div></div></div>`,
  "gg-odds", 800, T_ROLL + 0.4, T_NIGHT - 0.1);
odds.querySelector(".inner").style.padding = "18px 54px 22px";
[odds.querySelector(".vs"), odds.querySelector(".red")].forEach((el) => GG.hide(el));
B.tl.fromTo(odds.querySelector(".vs"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, T_HEAVY - 0.2);
B.tl.fromTo(odds.querySelector(".red"), { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power4.in" }, T_HEAVY);
// first shots of the fight
shoot([1830, 566], [1790, 690], T_HEAVY + 0.6, { r: 13 });
shoot([1680, 586], [1650, 712], T_HEAVY + 1.4, { r: 13 });
// flash-forward: nightfall, the Germans pull back
const white = document.createElement("div");
white.style.cssText = "position:absolute;inset:0;background:#fffdf6;pointer-events:none;";
document.getElementById("scene").insertBefore(white, document.getElementById("credit")); GG.hide(white);
B.tl.fromTo(white, { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.12 }, T_NIGHT);
B.tl.to(white, { autoAlpha: 0, duration: 0.6 }, T_NIGHT + 0.14);
SFX("whoosh", T_NIGHT - 0.2); SFX("hit", T_NIGHT + 0.05);   // the one zoom sound of the clip (biggest move)
const dusk = GG.layer("background: linear-gradient(to left, rgba(255,140,60,0.40), rgba(120,60,90,0.22) 55%, rgba(30,30,70,0.18));", T_NIGHT, S[2] - 0.2, { dur: 0.4, outDur: 0.4 });
HT.forEach(([id], i) => { B.move(id, T_NIGHT + 0.4 + i * 0.15, 2.6, 2350 + i * 50, 360 + i * 20, "power2.in"); });
B.arrow({ side: "carth", pts: [[1760, 650], [1840, 560], [1960, 470]], width: 13, t: T_NIGHT + 0.3, dur: 1.2, until: S[2] - 0.2 });
const stamp = GG.card(`<div style="font-size:60px;font-weight:700;letter-spacing:0.12em;color:#e3232f;border:6px solid #e3232f;padding:6px 30px;transform:rotate(-4deg)">BY NIGHTFALL: THE GERMANS RAN</div>`, "gg-stamp", 840, T_RUN - 0.6, S[2] - 0.15);
stamp.querySelector(".inner").style.cssText = "background:rgba(18,16,12,0.78);padding:18px 28px;border-top:none;";
B.tl.fromTo(stamp, { scale: 1.6 }, { scale: 1, duration: 0.35, ease: "power4.in" }, T_RUN - 0.6);
SFX("hit", T_RUN - 0.3);
// rewind to the morning: the hook preview clears
B.hideUnits(["ht1", "ht2", "ht3", "b1", "b2", "b3", "b4"], S[2] - 0.3, 0.3);

// ---------- bz-2: Sicily, 11 July 1943 ----------
B.showDate(T_SIC);
B.date("11 JULY 1943", T_SIC + 0.2, T_830 - 0.1, 38);
// the scattered drop: small blue parachute marks all over the map
const DROP = [[300, 220], [620, 160], [980, 260], [1250, 130], [1580, 330], [1900, 240], [2240, 180], [2620, 300], [2760, 640], [2500, 820],
  [2250, 960], [2700, 1180], [2400, 1450], [1900, 1300], [1600, 1480], [1500, 1000], [1250, 780], [1080, 1060], [880, 760], [700, 620], [2050, 760], [2300, 640]];
const chutes = DROP.map(([x, y], i) => GG.pin(`<svg width="52" height="52" viewBox="0 0 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.6))">
  <path d="M4 18 Q20 -4 36 18 Z" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2.5"/><line x1="5" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.6"/><line x1="35" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.6"/><line x1="20" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.6"/><circle cx="20" cy="35" r="3.2" fill="#f3eee2"/></svg>`,
  x, y, { t: T_SCAT - 0.4 + (i % 11) * 0.12, pop: true }));
B.caption("THE NIGHT DROP: SCATTERED ALL OVER SOUTHERN SICILY", T_SCAT + 0.3, T_DAWN - 0.2, "carth r");
K.badge({ name: "COL. JAMES M. GAVIN", role: "505TH PARACHUTE INFANTRY · AGE 36", photo: "assets/media/gavin_head.png", flag: "us", side: "carth", corner: "tr", t: T_GAVIN - 0.2, until: T_830 + 0.4 });
// at dawn: the nearest ones converge on Gavin (the rest stay lost)
const NEAR = [10, 11, 13, 14, 15, 20, 21, 8, 9];
NEAR.forEach((k, i) => B.tl.to(chutes[k], { x: ASSY[0] - DROP[k][0] + ((i * 23) % 40) - 20, y: ASSY[1] - DROP[k][1] + ((i * 17) % 30) - 15, duration: 2.6, ease: "power1.inOut" }, T_DAWN + 0.2 + i * 0.12));
NEAR.forEach((k) => GG.fadeOut(chutes[k], T_830 - 0.3, 0.4));
chutes.forEach((c, k) => { if (!NEAR.includes(k)) B.tl.to(c, { autoAlpha: 0.35, duration: 0.8 }, T_DAWN + 0.4); });
chutes.forEach((c, k) => { if (!NEAR.includes(k)) GG.fadeOut(c, T_HIGH, 0.6); });
B.unit({ id: "force", side: "carth", x: ASSY[0], y: ASSY[1], w: 44, h: 30, label: "GAVIN'S FORCE", t: T_830 - 0.4 });
K.counter("force", { icon: "infantry", flag: "us", size: "II" });
B.caption("PARATROOPERS · ENGINEERS · GUNNERS · ANYONE HE COULD FIND", T_EVERY - 0.2, T_830 - 0.2, "carth r");
B.date("11 JULY · 08:30", T_830 + 0.1, T_AFT - 0.1, 38);
const stormArrow = B.arrow({ side: "carth", pts: [[ASSY[0] - 20, ASSY[1] - 30], [1920, 900], [1800, 760]], width: 16, t: T_STORM - 0.2, dur: 1.8, until: T_AFT + 1 });
B.move("force", T_STORM, 2.0, 1790, 740);
B.hideUnits(["force"], T_STORM + 2.0, 0.3);
Object.entries(BLUE).forEach(([id], i) => B.show(id, T_STORM + 2.0 + i * 0.12));
K.target(1740, 676, T_STORM + 0.6, { r: 60, until: T_BEACH + 1.5 });
B.tl.to(ridgeL, { scale: 1.25, duration: 0.4, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_STORM + 0.8);
B.caption("08:30 · BIAZZA RIDGE TAKEN", T_STORM + 0.6, T_HIGH - 0.1, "carth r");
const beachL = GG.lbl("▼ US 45TH DIVISION BEACHES", 1420, 1560, { size: 24, color: "#cfe0ff", t: T_HIGH + 0.4 });
B.tl.to(beachL, { scale: 1.2, duration: 0.45, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_BEACH);
B.arrow({ side: "white", pts: [[1700, 760], [1600, 1100], [1450, 1500]], width: 8, dash: "16 12", t: T_BEACH - 0.4, dur: 1.0, until: S[3] + 0.6 });
B.caption("THE HIGH GROUND ABOVE THE BEACHES", T_HIGH, S[3] - 0.2, "carth r");

// ---------- bz-3: the Hermann Göring Division strikes back ----------
B.date("11 JULY · AFTERNOON", T_AFT + 0.1, T_SIX - 0.1, 34);
const GER = { t1: [1610, 600, "tank", ""], t2: [1760, 584, "tank", ""], t3: [1900, 548, "tank", ""], g1: [1470, 612, "infantry", "II"], g2: [2010, 520, "infantry", "II"] };
Object.entries(GER).forEach(([id, [x, y, icon, sz]], i) => {
  B.unit({ id, side: "rome", x: 2330 + (i % 3) * 30, y: 400 + i * 14, w: icon === "tank" ? 38 : 34, h: 24, t: T_AFT + 0.4 + i * 0.2 });
  K.counter(id, sz ? { icon, flag: "ger", size: sz } : { icon, flag: "ger" });
  B.move(id, T_AFT + 0.8 + i * 0.25, 3.2, x, y);
});
B.arrow({ side: "rome", pts: [[2360, 380], [2150, 450], [1950, 520], [1780, 580]], width: 16, t: T_AFT + 0.3, dur: 2.2, until: T_BAZ + 1 });
B.arrow({ side: "rome", pts: [[2300, 430], [1900, 520], [1500, 600]], width: 12, t: T_AFT + 0.8, dur: 2.4, until: T_BAZ + 1 });
GG.tagbox("700+ INFANTRY", 1470, 650 - 92, "#c4121f", { size: 16, t: T_HG + 0.2, until: T_ORDER });
GG.tagbox("TIGERS", 1900, 548 - 40, "#c4121f", { size: 16, t: T_HG + 0.4, until: T_ORDER });
B.caption("HERMANN GÖRING DIVISION · 700+ INFANTRY · TIGER TANKS", T_HG - 0.2, T_BAZ - 0.2, "rome r");
const front = K.front({ pts: FRONT, to: FRONT2, sideA: "rome", sideB: "carth", t: T_HG, dur: 1.6, moveT: T_EVERYONE + 0.3, moveDur: 3.0, until: END + 1 });
K.frontTint({ pts: FRONT, to: FRONT2, side: "carth", dir: 1, depth: 170, alpha: 0.34, mask: MASK, t: T_HG + 0.4, moveT: T_EVERYONE + 0.3, moveDur: 3.0 });
const redTint = K.frontTint({ pts: FRONT, side: "rome", dir: -1, depth: 95, alpha: 0.34, mask: MASK, t: T_HG + 0.4 });
// Tigers and German infantry fire on the ridge
[[1610, 600, 1650, 708], [1760, 584, 1790, 688], [1900, 548, 1925, 650], [1760, 584, 1660, 712], [1610, 600, 1525, 730], [1900, 548, 1800, 690]].forEach(([x1, y1, x2, y2], i) => shoot([x1, y1], [x2 + ((i * 13) % 20) - 10, y2], T_HG + 1.8 + i * 0.9, { unit: ["t1", "t2", "t3"][i % 3], dur: 0.5, h: 10, r: 12 }));
[[1470, 612, 1520, 718], [2010, 520, 1930, 640], [1470, 612, 1600, 700]].forEach(([x1, y1, x2, y2], i) => { tracer([x1, y1], [x2, y2], T_HG + 2.2 + i * 1.3); SFX("mg", T_HG + 2.2 + i * 1.3); });
// bazookas: small rockets bounce off the Tigers' front plates
[["b2", 1650, 704, 1610, 600], ["b3", 1790, 684, 1760, 584], ["b4", 1925, 646, 1900, 548]].forEach(([u, x1, y1, x2, y2], i) => {
  const t = T_BAZ + 0.2 + i * 0.7;
  K.gun(x1, y1, t, { dx: 0, dy: -10, unit: u });
  tracer([x1, y1 - 10], [x2, y2 + 10], t + 0.02, "#fff3c4");
  K.impact(x2, y2 + 8, t + 0.5, { r: 9, puffs: 1 });
});
B.caption("BAZOOKAS: BARELY A DENT IN THE TIGERS", T_BAZ, T_PACK - 0.2, "rome r");
// two 75 mm pack howitzers fire over open sights
const HOW = { h1: [1585, 752], h2: [1730, 734] };
Object.entries(HOW).forEach(([id, [x, y]], i) => { B.unit({ id, side: "carth", x, y, w: 34, h: 24, t: T_PACK - 0.4 + i * 0.25 }); K.counter(id, { icon: "artillery", flag: "us" }); });
GG.tagbox("2 × 75 MM PACK HOWITZERS", 1660, 800, "#1f4fc4", { size: 16, t: T_PACK + 0.2, until: S[4] });
[["h1", 1610, 600], ["h2", 1760, 584], ["h1", 1620, 606], ["h2", 1900, 548], ["h1", 1610, 600]].forEach(([u, x2, y2], i) => {
  const [x1, y1] = HOW[u];
  shoot([x1, y1 - 8], [x2, y2], T_SIGHTS - 0.6 + i * 0.9, { unit: u, dur: 0.45, h: 6, r: 14, color: "#fff3c4" });
});
B.caption("2 PACK HOWITZERS · FIRING OVER OPEN SIGHTS", T_PACK + 0.2, T_ORDER - 0.2, "carth r");
B.caption("GAVIN: WE STAY ON THIS RIDGE, NO MATTER WHAT", T_ORDER, S[4] - 0.2, "carth r");
K.target(1740, 676, T_ORDER + 0.2, { r: 54, side: "carth", until: S[4] + 0.5 });

// ---------- bz-4: the Navy, the Shermans, the counterattack ----------
const radio = GG.pin(`<svg width="40" height="35" viewBox="0 0 46 40" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.8))">
  <rect x="3" y="12" width="40" height="26" rx="4" fill="#2b2a26" stroke="#f3eee2" stroke-width="2.5"/>
  <circle cx="15" cy="25" r="7" fill="none" stroke="#f3eee2" stroke-width="2.5"/><rect x="27" y="19" width="11" height="3" fill="#f3eee2"/><rect x="27" y="26" width="11" height="3" fill="#f3eee2"/>
  <line x1="33" y1="12" x2="41" y2="1" stroke="#f3eee2" stroke-width="2.5" stroke-linecap="round"/></svg>`, 1690, 770, { t: T_ENS + 0.1, pop: true, until: T_SIX });
GG.tagbox("NAVY ENSIGN · RADIO", 1690, 805, "#1f4fc4", { size: 15, t: T_ENS + 0.4, until: T_SIX });
SFX("static", T_ENS + 0.2);
for (let i = 0; i < 3; i++) {
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${1690 - 50}px;top:${770 - 50}px;width:100px;height:100px;border-radius:50%;border:5px solid rgba(255,214,90,0.9);box-shadow:0 0 18px rgba(255,200,60,0.6);`;
  document.getElementById("pins").appendChild(el); GG.hide(el);
  B.tl.fromTo(el, { autoAlpha: 0.95, scale: 0.2 }, { autoAlpha: 0, scale: 7, duration: 2.6, ease: "power1.out", immediateRender: false }, T_ENS + 0.4 + i * 0.7);
}
const ships = SHIPS.map(([x, y], i) => GG.ship(x, y, { w: 165, t: T_WARSHIPS - 0.8 + i * 0.25 }));
GG.lbl("US NAVY", 520, 1170 - 210, { size: 26, color: "#cfe0ff", t: T_WARSHIPS - 0.4, until: T_SIX + 2 });
// naval gunfire: trial round, then the concentration on the German tanks and infantry
const NTGT = [[1760, 584], [1610, 600], [1900, 548], [1470, 612], [2010, 520], [1760, 590], [1640, 596], [1880, 552], [1500, 600]];
NTGT.forEach(([x, y], i) => {
  const [sx, sy] = SHIPS[i % 3];
  shoot([sx + 40, sy - 14], [x + ((i * 19) % 24) - 12, y + ((i * 11) % 16) - 8], (i ? T_SHELLS - 0.4 + i * 0.55 : T_WARSHIPS + 0.2), { dur: 1.3, width: 5, h: 260, r: 17 });
});
B.caption("THE FLEET OFFSHORE OPENS FIRE", T_WARSHIPS + 0.4, T_SIX - 0.2, "carth r");
B.grey(["t1"], T_SHELLS + 1.4, 0.8);
B.grey(["g1"], T_SHELLS + 2.4, 0.8);
// 18:00: six Shermans come up Route 115
B.date("11 JULY · 18:00", T_SIX + 0.1, null, 38);
GG.layer("background: linear-gradient(to left, rgba(255,150,70,0.34), rgba(255,180,120,0.14) 55%, rgba(255,210,160,0.04));", T_SIX, END + 2, { dur: 3.0 });
const SH = { s1: [1700, 760], s2: [1830, 740] };
Object.entries(SH).forEach(([id, [x, y]], i) => {
  B.unit({ id, side: "carth", x: 2140 + i * 40, y: 1200 + i * 30, w: 38, h: 24, label: i ? null : "6 SHERMANS", t: T_SIX + 0.2 + i * 0.25 });
  K.counter(id, { icon: "tank", flag: "us" });
  B.move(id, T_SIX + 0.5 + i * 0.25, 2.6, x, y);
});
B.arrow({ side: "carth", pts: [[2160, 1180], [1990, 1020], [1830, 820]], width: 14, t: T_SHERM - 0.6, dur: 1.6, until: T_FLED + 2 });
B.caption("18:00 · SIX SHERMANS ARRIVE", T_SHERM - 0.3, T_EVERYONE - 0.2, "carth r");
// the counterattack: everyone who can carry a rifle goes forward
[["b1", 1500, 600], ["b2", 1640, 580], ["b3", 1790, 560], ["b4", 1930, 520], ["s1", 1700, 610], ["s2", 1850, 580], ["h1", 1585, 740], ["h2", 1730, 720]].forEach(([id, x, y], i) => B.move(id, T_EVERYONE + 0.3 + (i % 4) * 0.15, 3.0, x, y));
[[[1520, 710], [1500, 620], [1480, 540]], [[1790, 680], [1800, 590], [1810, 500]], [[1930, 640], [1960, 550], [1990, 460]]].forEach((pts, i) => B.arrow({ side: "carth", pts, width: 14, t: T_EVERYONE + 0.2 + i * 0.25, dur: 1.4, until: S[5] + 0.5 }));
B.caption("COUNTERATTACK · EVEN THE COOKS AND CLERKS", T_EVERYONE, T_FLED - 0.2, "carth r");
["t2", "t3", "g2"].forEach((id, i) => { B.move(id, T_EVERYONE + 1.2 + i * 0.2, 3.2, 2330 + i * 40, 380 + i * 20, "power1.in"); });
B.hideUnits(["t2", "t3", "g2"], T_FLED + 1.4, 0.8);
B.hideUnits(["t1", "g1"], T_FLED + 0.8, 0.8);
redTint.forEach((pl) => K.lose(pl, T_EVERYONE + 1.0));
B.arrow({ side: "rome", pts: [[1900, 500], [2100, 440], [2320, 380]], width: 12, dash: "18 12", t: T_FLED - 0.2, dur: 1.0, until: S[5] + 0.5 });
B.caption("THE GERMANS FLED", T_FLED, S[5] - 0.2, "carth r");

// ---------- bz-5: the cost ----------
B.dim(T_HELD - 0.1, END + 1, 0.55);
const held = GG.card(`<div style="font-size:58px;font-weight:700;letter-spacing:0.12em;color:#6f9bff;border:6px solid #6f9bff;padding:6px 30px;transform:rotate(-3deg)">THE RIDGE HELD</div>`, "gg-stamp", 120, T_HELD + 0.05, END + 1);
held.querySelector(".inner").style.cssText = "background:rgba(18,16,12,0.78);padding:14px 24px;border-top:none;";
B.tl.fromTo(held, { scale: 1.6 }, { scale: 1, duration: 0.35, ease: "power4.in" }, T_HELD + 0.05);
SFX("hit", T_HELD + 0.35);
K.casualties({ flagA: "us", headA: "AMERICAN", flagB: "ger", headB: "GERMAN", rows: [["killed", "~50", "?"], ["wounded", "100+", "?"]], t: T_COST - 0.2, until: END + 1, top: 330 });
B.caption("GERMAN LOSSES UNRECORDED · 12 HEAVY MORTARS CAPTURED", T_COST + 1.2, END + 1, "r");
K.raiseTerritory();
B.finish();
