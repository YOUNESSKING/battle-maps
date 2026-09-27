// Goose Green scene 'hook-isthmus' (isthmus basemap, paragraphs hook-isthmus .. hook-bio-2). Sides: British = blue ("carth"), Argentine = red ("rome").
// Built with: python3 tools/build_scene.py hook-isthmus isthmus hook-isthmus hook-bio-2
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

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

const K1 = "hook-isthmus", K2 = "hook-bio", K3 = "hook-bio-2";
const S2 = P(K2), S3 = P(K3);
const T_2PARA = at(K1, "Second Battalion"), T_500 = at(K1, "known as Two Para"), T_GUNS = at(K1, "three light guns");
const T_1000 = at(K1, "Ahead of them"), T_DUG = at(K1, "open, treeless ground"), T_ART = at(K1, "more artillery"), T_BBC = at(K1, "thanks to the BBC");
const T_DEAD = at(K3, "H Jones would be dead"), T_KEEB = at(K3, "his quiet second") - 0.4, T_YET = at(K3, "So how did");
const T_900 = at(K3, "So how did") + 1.2, T_FIRST = at(K3, "first great land battle"), T_THREE = at(K3, "Let's take");

// ---------- camera ----------
B.camera([
  [0, 1650, 560, 1.5],
  [T_1000 - 1.6, 1640, 590, 1.55],
  [T_1000 + 1.4, 1610, 1000, 1.5],
  [S2 - 0.5, 1610, 990, 1.42],
  [S3 - 0.3, 1610, 980, 1.4],
  [S3 + 1.6, 1640, 830, 1.22],
  [END, 1640, 830, 1.18],
]);

// ---------- places ----------
B.showDate(0.2);
B.date("27 MAY 1982", 0.4, null, 40);
B.city("CAMILLA CREEK HOUSE", ...CCH, { size: 26, r: 7, t: 0.6 });
B.city("BURNTSIDE HOUSE", ...BURNT, { size: 24, r: 7, t: 1.0 });
B.city("BOCA HOUSE", ...BOCA, { size: 24, r: 7, left: true, t: 1.3 });
B.city("DARWIN", ...DARWIN, { size: 24, r: 7, t: 1.6 });
B.city("GOOSE GREEN", GOOSE[0], GOOSE[1], { size: 26, r: 8, t: 1.9 });
GG.lbl("AIRFIELD", AIRF[0] - 30, AIRF[1] + 6, { size: 20, anchor: [-100, -50], t: 2.2 });
GG.lbl("DARWIN HILL", DHILL[0] + 10, DHILL[1] - 38, { size: 20, anchor: [-50, -50], t: 2.4 });
B.label("BRENTON LOCH", 1300, 870, { cls: "sea", size: 28, t: 2.6 });
B.label("DARWIN HARBOUR", 1760, 1085, { cls: "sea", size: 24, t: 2.8 });

// ---------- 2 PARA ----------
B.unit({ id: "para", side: "carth", x: CCH[0], y: CCH[1] + 46, w: 56, h: 38, label: "2 PARA", t: T_2PARA });
B.unit({ id: "guns", side: "carth", x: CCH[0] - 70, y: CCH[1] + 46, w: 40, h: 28, label: "3 GUNS", t: T_GUNS });
GG.icon("guns", "gun");
B.caption("2 PARA · ~500 FIGHTING MEN · 3 LIGHT GUNS", T_500 - 0.3, T_1000 - 0.3, "carth r");

// ---------- Task Force Mercedes ----------
const RED = [
  // forward screen
  ["f1", 1545, 866], ["f2", 1625, 852], ["f3", BURNT[0] + 30, BURNT[1] + 24], ["f4", CORON[0], CORON[1]],
  // main line along the gorse, Boca House -> Darwin Hill
  ["m1", BOCA[0] + 22, BOCA[1] - 12], ["m2", 1526, 974], ["m3", DHILL[0] + 4, DHILL[1] + 4],
  // depth: airfield and settlement
  ["d1", AIRF[0] + 14, AIRF[1] - 18], ["d2", GOOSE[0] - 34, GOOSE[1] - 30], ["d3", GOOSE[0] + 26, GOOSE[1] - 36],
];
RED.forEach(([id, x, y], i) => B.unit({ id, side: "rome", x, y, w: 34, h: 24, t: T_1000 + 0.2 + i * 0.12 }));
GG.icon("d1", "aa"); GG.icon("d3", "gun");
GG.tagbox("TASK FORCE MERCEDES · ~1,000 MEN", 1500, 1250, "#c4121f", { size: 20, anchor: [-100, -50], t: T_1000 + 1.2 });
B.caption("DUG IN ACROSS OPEN, TREELESS GROUND", T_DUG, T_ART - 0.2, "rome r");
B.caption("+ ARTILLERY · ANTI-AIRCRAFT GUNS · AIRCRAFT ON CALL", T_ART, T_BBC - 0.3, "rome r");
GG.lbl("AA GUNS", AIRF[0] + 36, AIRF[1] - 18, { size: 16, anchor: [0, -50], t: T_ART + 0.4, until: S2 });
GG.lbl("ARTILLERY", GOOSE[0] + 48, GOOSE[1] - 36, { size: 16, anchor: [0, -50], t: T_ART + 0.7, until: S2 });
// the BBC warning: radio rings over the Argentine line
const ring = (x, y, t) => {
  for (let i = 0; i < 4; i++) {
    const el = GG.pin(`<div style="width:120px;height:120px;border-radius:50%;border:5px solid rgba(255,235,200,0.9);box-shadow:0 0 10px rgba(0,0,0,0.4)"></div>`, x, y, {});
    B.tl.fromTo(el, { autoAlpha: 0.9, scale: 0.15 }, { autoAlpha: 0, scale: 1.6, duration: 1.6, ease: "power1.out", immediateRender: false }, t + i * 0.55);
  }
};
ring(1545, 960, T_BBC); ring(1545, 960, T_BBC + 2.4);
B.caption("THANKS TO THE BBC, THEY KNEW WHO WAS COMING", T_BBC - 0.1, S2 - 0.2, "rome r");

// ---------- hook-bio: H Jones ----------
B.dim(S2 - 0.3, S3 - 0.3);
B.dateBox(S2 - 0.3, null, S3);
GG.bioT({
  flag: "assets/media/uk_flag.png", unit: "2 PARA",
  name: "LT. COL. H. JONES",
  rows: ["Commanding Officer, 2 PARA", "Herbert 'H' Jones · 1940 – 1982", "Age 42 · fiercely driven", "Threatened to sue the BBC"],
  rowT: [S2 + 1.4, at(K2, "Lieutenant Colonel Herbert"), at(K2, "forty-two"), at(K2, "sue the BBC")],
  t: S2, until: B.end(K2) + 0.1,
});

// ---------- hook-bio-2: Jones falls, Keeble ----------
const jst = GG.stake({ name: "LT. COL. H. JONES", role: "CO, 2 PARA", side: "carth", x: CCH[0] + 190, y: CCH[1] + 230, size: 1.25, t: S3 + 1.0, until: T_KEEB });
B.tl.to(jst, { filter: "grayscale(1)", opacity: 0.75, duration: 0.8 }, T_DEAD + 0.6);
B.caption("28 MAY 1982: H JONES KILLED IN ACTION", T_DEAD + 0.4, T_KEEB, "rome r");
B.dim(T_KEEB - 0.2, T_YET + 0.3);
B.dateBox(T_KEEB - 0.2, null, T_YET + 0.6);
GG.bioT({
  flag: "assets/media/uk_flag.png", unit: "2 PARA", mirror: true,
  name: "MAJ. CHRIS KEEBLE",
  rows: ["Second in Command, 2 PARA", "Took over the battle on 28 May", "Cold · exhausted · short of ammunition"],
  rowT: [at(K3, "second in command") + 0.3, at(K3, "would be leading"), at(K3, "cold, exhausted")],
  t: T_KEEB, until: T_YET + 0.1,
});

// the surrender, and the three moves
B.date("29 MAY 1982", T_YET + 0.6, null, 40);
B.grey(RED.map((r) => r[0]), T_900, 1.2);
B.caption("WITHIN 36 HOURS: 961 ARGENTINE PRISONERS", T_900 - 0.2, T_FIRST - 0.2, "carth r");
B.caption("THE FIRST GREAT LAND BATTLE OF THE FALKLANDS WAR", T_FIRST, T_THREE - 0.3, "r");
B.dim(T_THREE - 0.3, END + 1, 0.6);
GG.card(`<div class="h">2 PARA · GOOSE GREEN</div><div class="row"><b>1</b>THE NIGHT ASSAULT</div><div class="row"><b>2</b>DARWIN HILL &amp; BOCA HOUSE</div><div class="row"><b>3</b>THE GOOSE GREEN BLUFF</div>`, "gg-list", 290, T_THREE, END + 1);
B.finish();
