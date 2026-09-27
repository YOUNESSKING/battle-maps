// Goose Green scene 'hook-bbc' (isthmus basemap, paragraph hook-bbc only): the cold open on a map.
// Sides: British = blue ("carth"), Argentine = red ("rome").
// Built with: python3 tools/build_scene.py hook-bbc isthmus hook-bbc hook-bbc
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
    .unit .tag { font-size: 15px; padding: 0 6px; margin-top: 3px; }
    .gg-pin { position: absolute; left: 0; top: 0; }
    .gg-lbl { position: absolute; white-space: nowrap; font-weight: 700; letter-spacing: 0.08em; color: #fbfaf6; text-shadow: 0 2px 4px rgba(0,0,0,0.9), 0 0 2px #000; }
    .gg-tagbox { position: absolute; white-space: nowrap; padding: 1px 8px; font-weight: 700; letter-spacing: 0.06em; color: #fff; border-radius: 3px; border: 2px solid #f3eee2; }
    .gg-card { position: absolute; left: 0; right: 0; display: flex; justify-content: center; }
    .gg-card .inner { padding: 30px 70px 34px; background: rgba(18, 16, 12, 0.9); color: #f4f1ea; border-top: 6px solid #c9b48a; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .gg-method .k { font-size: 30px; letter-spacing: 0.4em; color: #c9b48a; text-align: center; margin-bottom: 14px; }
    .gg-method .row { display: flex; align-items: center; gap: 28px; font-size: 58px; font-weight: 700; letter-spacing: 0.08em; line-height: 1.4; }
    .gg-method .n { width: 60px; height: 60px; border-radius: 50%; border: 4px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 36px; flex: none; }
    .gg-method .row.off { color: rgba(244,241,234,0.22); }
    .gg-method .row.off .bar { width: 520px; height: 14px; background: rgba(244,241,234,0.14); border-radius: 7px; }
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
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - h;
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
  G.fadeIn = fadeIn; G.fadeOut = fadeOut; G.hide = hide;
  return G;
})();

// ---------- projection (assets/isthmus.json: zoom 13, origin_world_px 703494, 1401591) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 13, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 703494).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 1401591).toFixed(1)];
};
const CCH = G(-51.7435, -58.962), BOCA = G(-51.8009, -58.9847), DARWIN = G(-51.807, -58.9588);
const GOOSE = G(-51.8277, -58.9728), DHILL = G(-51.8035, -58.966), BURNT = G(-51.7858, -58.9419);

const K = "hook-bbc";
const T_PARAS = at(K, "British paratroopers"), T_RADIO = at(K, "around a radio"), T_FARM = at(K, "in a farmhouse");
const T_BBC = at(K, "BBC World Service"), T_ANN = at(K, "the newsreader announce"), T_WORLD = at(K, "the entire world");
const T_POISED = at(K, "poised to attack"), T_GG = at(K, "Goose Green"), T_BN = at(K, "their battalion");
const T_TGT = at(K, "their target"), T_SECRET = at(K, "supposed to be a secret");

// ---------- camera: open tight on the farmhouse, pull back as the broadcast spreads, then down the isthmus ----------
B.camera([
  [0, CCH[0] + 20, CCH[1] + 40, 2.6],
  [T_BBC, CCH[0] + 10, CCH[1] + 60, 2.3],
  [T_WORLD + 1.2, 1600, 720, 1.05],
  [T_POISED + 0.6, 1600, 780, 1.1],
  [T_GG + 1.4, 1590, 1000, 1.9],
  [T_BN, 1590, 980, 1.85],
  [T_TGT + 0.3, 1560, 1215, 2.2],
  [END, 1560, 1225, 2.3],
]);

// dusk tint over the whole map for mood
GG.layer("background: radial-gradient(ellipse 75% 65% at 50% 45%, rgba(20,24,40,0.18), rgba(6,8,20,0.55));", 0, null, { dur: 0.01 });

B.showDate(0.3);
B.date("27 MAY 1982", 0.5, null, 38);
GG.lbl("CAMILLA CREEK HOUSE", CCH[0] + 20, CCH[1] - 4, { size: 20, anchor: [0, -50], t: 0.3 });
GG.pin(`<div style="width:14px;height:14px;border-radius:50%;background:#fbfaf6;border:3px solid #222"></div>`, CCH[0], CCH[1], { t: 0.2 });
B.unit({ id: "para", side: "carth", x: CCH[0], y: CCH[1] + 44, w: 46, h: 32, label: "2 PARA", t: 0.4 });

// radio icon beside the farmhouse
GG.pin(`<svg width="46" height="40" viewBox="0 0 46 40" style="display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.8))">
  <rect x="3" y="12" width="40" height="26" rx="4" fill="#2b2a26" stroke="#f3eee2" stroke-width="2.5"/>
  <circle cx="15" cy="25" r="7" fill="none" stroke="#f3eee2" stroke-width="2.5"/><rect x="27" y="19" width="11" height="3" fill="#f3eee2"/><rect x="27" y="26" width="11" height="3" fill="#f3eee2"/>
  <line x1="33" y1="12" x2="41" y2="1" stroke="#f3eee2" stroke-width="2.5" stroke-linecap="round"/></svg>`, CCH[0] - 52, CCH[1] + 40, { t: 0.9, pop: true });

// broadcast rings expanding out from the radio across the whole map
const ringsAt = (t0, n, maxR, gap) => {
  for (let i = 0; i < n; i++) {
    const el = document.createElement("div");
    el.style.cssText = `position:absolute;left:${CCH[0] - 52 - 50}px;top:${CCH[1] + 40 - 50}px;width:100px;height:100px;border-radius:50%;border:5px solid rgba(255,214,90,0.9);box-shadow:0 0 18px rgba(255,200,60,0.6);`;
    document.getElementById("pins").appendChild(el); GG.hide(el);
    const t = t0 + i * gap;
    B.tl.fromTo(el, { autoAlpha: 0.95, scale: 0.2 }, { autoAlpha: 0, scale: maxR / 50, duration: 3.2, ease: "power1.out", immediateRender: false }, t);
  }
};
ringsAt(1.8, Math.floor((T_BBC - 1.8) / 1.3), 110, 1.3);
ringsAt(T_BBC, 3, 160, 0.8);
GG.flash(CCH[0], CCH[1] + 44, T_PARAS + 0.1, { r: 26, n: 1 });
ringsAt(T_WORLD - 0.2, 6, 1400, 0.55);
B.caption("BBC WORLD SERVICE · LIVE TO THE WORLD", T_BBC + 0.3, T_POISED - 0.3, "r");

// the target: Argentine garrison lights up as the news reaches it
GG.lbl("DARWIN", DARWIN[0] + 16, DARWIN[1], { size: 22, anchor: [0, -50], t: T_POISED + 0.2 });
GG.lbl("GOOSE GREEN", GOOSE[0] + 16, GOOSE[1] + 4, { size: 22, anchor: [0, -50], t: T_GG });
GG.lbl("BOCA HOUSE", BOCA[0] - 16, BOCA[1], { size: 16, anchor: [-100, -50], color: "#e9e4d6", t: T_GG + 0.4 });
const RED = [[DARWIN[0] - 34, DARWIN[1] - 30], [DHILL[0] - 10, DHILL[1] - 22], [BOCA[0] + 30, BOCA[1] - 8], [GOOSE[0] - 30, GOOSE[1] - 26],
  [GOOSE[0] + 34, GOOSE[1] - 40], [BURNT[0] - 40, BURNT[1] + 60]];
RED.forEach(([x, y], i) => {
  B.unit({ id: "r" + i, side: "rome", x, y, w: 26, h: 18, t: T_POISED + 0.5 + i * 0.22 });
  GG.flash(x, y, T_GG + 0.8 + i * 0.12, { r: 18, n: 1 });
});
GG.tagbox("ALERTED · ~1,000 MEN DUG IN", GOOSE[0], GOOSE[1] + 48, "#c4121f", { size: 15, t: T_GG + 1.4, until: T_SECRET - 0.3 });

// "their battalion" pulse on 2 PARA, "their target" reticle on Goose Green
GG.flash(CCH[0], CCH[1] + 44, T_BN + 0.1, { r: 30, n: 2, gap: 0.4 });
GG.pin(`<svg width="150" height="150" viewBox="0 0 100 100" style="display:block;overflow:visible">
  <circle cx="50" cy="50" r="40" fill="none" stroke="#e3232f" stroke-width="4"/><circle cx="50" cy="50" r="6" fill="#e3232f"/>
  <line x1="50" y1="0" x2="50" y2="28" stroke="#e3232f" stroke-width="4"/><line x1="50" y1="72" x2="50" y2="100" stroke="#e3232f" stroke-width="4"/>
  <line x1="0" y1="50" x2="28" y2="50" stroke="#e3232f" stroke-width="4"/><line x1="72" y1="50" x2="100" y2="50" stroke="#e3232f" stroke-width="4"/></svg>`,
  GOOSE[0], GOOSE[1] - 10, { t: T_TGT, pop: true });

// the stamp
const stamp = GG.card(`<div style="font-size:64px;font-weight:700;letter-spacing:0.12em;color:#e3232f;border:6px solid #e3232f;padding:6px 30px;transform:rotate(-4deg)">SUPPOSED TO BE A SECRET</div>`, "gg-stamp", 850, T_SECRET, null);
stamp.querySelector(".inner").style.cssText = "background:rgba(18,16,12,0.78);padding:18px 28px;border-top:none;";
B.tl.fromTo(stamp, { scale: 1.6 }, { scale: 1, duration: 0.35, ease: "power4.in" }, T_SECRET);
B.finish();
