// Goose Green scene 'hook-atlantic' (atlantic basemap, paragraphs hook-falklands .. hook-falklands). Sides: British = blue ("carth"), Argentine = red ("rome").
// Built with: python3 tools/build_scene.py hook-atlantic atlantic hook-falklands hook-falklands
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

// ---------- projection (assets/atlantic.json: zoom 7, origin_world_px 9164, 21178) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 7, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 9164).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 21178).toFixed(1)];
};
const KP = "hook-falklands";
const K = FXK(B);
const T_INV = at(KP, "Argentina had invaded"), T_TERR = at(KP, "a British territory"), T_TF = at(KP, "Britain had sent");
const T_SC = at(KP, "The landings at San Carlos"), T_PRICE = at(KP, "terrible price"), T_COV = at(KP, "The destroyer Coventry");
const T_AC = at(KP, "Atlantic Conveyor"), T_HELI = at(KP, "heavy helicopters");

// Places (verified: OSM / Wikipedia) -> atlantic px
const STANLEY = G(-51.693, -57.857), SANC = G(-51.505, -59.031), GG_ = G(-51.8277, -58.9728);
const COVENTRY = G(-51.07, -59.67);          // sunk 25 May 1982 north of Pebble Island (approx.)
const CONVEYOR = G(-50.65, -56.6);           // hit 25 May 1982 ~90 nm NE of Stanley (approx.)

// ---------- camera: whole region, then down onto East Falkland ----------
B.camera([
  [0, 1440, 810, 0.667],
  [T_TF - 1.0, 1500, 790, 0.72],
  [T_SC - 1.2, 1560, 780, 0.8],
  [T_SC + 2.6, 1880, 712, 2.35],
  [T_AC - 0.5, 1905, 690, 2.2],
  [END, 1905, 700, 2.35],
]);

// ---------- wide: region ----------
K.grid(G, -58, -46, -80, -47, 1, 0);
B.showDate(0.2);
B.date("APRIL – MAY 1982", 0.4, null, 38);
B.label("ARGENTINA", 760, 470, { cls: "country", size: 64, t: T_INV - 0.3, until: T_SC });
B.label("SOUTH ATLANTIC OCEAN", 2060, 1150, { cls: "sea", size: 46, t: 1.0, until: T_SC - 0.4 });
B.label("FALKLAND ISLANDS", 1860, 590, { cls: "country", size: 38, t: T_TERR - 0.2, until: T_SC });
B.city("RÍO GALLEGOS", 919, 710, { size: 28, left: true, t: T_INV, until: T_SC });
const inv = B.arrow({ side: "rome", pts: [[960, 700], [1300, 640], [1620, 660], [1790, 715]], width: 18, t: T_INV + 0.3, dur: 2.2, until: T_SC });
B.label("2 APRIL: ARGENTINA INVADES", 1290, 590, { cls: "tg", size: 34, t: T_INV + 1.4, until: T_SC });
B.arrow({ side: "carth", pts: [[2860, 40], [2600, 180], [2300, 400], [2080, 610]], width: 18, t: T_TF + 0.2, dur: 2.2, until: T_SC });
B.label("BRITISH TASK FORCE", 2560, 470, { cls: "tg", size: 34, t: T_TF + 1.0, until: T_SC });
B.label("8,000 MILES FROM HOME", 2560, 515, { cls: "tg", size: 26, t: T_TF + 1.3, until: T_SC });

// ---------- close: East Falkland ----------
B.image("assets/gg_eastfalkland.png", 0, 0, 2880, 1620, { t: T_SC + 1.2, dur: 1.4 });
GG.lbl("EAST FALKLAND", 1928, 690, { size: 17, t: T_SC + 2.2 });
GG.lbl("WEST FALKLAND", 1720, 745, { size: 14, color: "#e9e4d6", t: T_SC + 2.4 });
// San Carlos landings (21 May)
B.arrow({ side: "carth", pts: [[1832, 624], [1836, 660], [1842, 688]], width: 5, t: T_SC + 2.4, dur: 1.2 });
GG.lbl("SAN CARLOS", SANC[0] - 6, SANC[1] + 4, { size: 12, anchor: [-100, -50], t: T_SC + 2.6 });
GG.tagbox("LANDINGS · 21 MAY", SANC[0] - 6, SANC[1] + 18, "#1f4fc4", { size: 8, anchor: [-100, -50], t: T_SC + 3.0 });
// Argentine garrisons
B.unit({ id: "stanley", side: "rome", x: STANLEY[0], y: STANLEY[1], w: 14, h: 10, t: T_SC + 3.4 });
B.unit({ id: "gg", side: "rome", x: GG_[0], y: GG_[1], w: 14, h: 10, t: T_SC + 3.7 });
K.counter("stanley", { icon: "infantry", flag: "arg", size: "X" });
K.counter("gg", { icon: "infantry", flag: "arg", size: "III" });
GG.lbl("STANLEY", STANLEY[0], STANLEY[1] + 13, { size: 11, t: T_SC + 3.5 });
GG.lbl("GOOSE GREEN", GG_[0], GG_[1] + 13, { size: 11, t: T_SC + 3.8 });
GG.tagbox("ARGENTINE GARRISONS", STANLEY[0], STANLEY[1] + 29, "#c4121f", { size: 8, t: T_SC + 4.3 });

// ---------- losses ----------
const wreck = (x, y, name, lx, ly, t, anchor) => {
  const ship = GG.ship(x, y - 8, { w: 40, color: "#1f4fc4", t: t - 2.2 });
  K.impact(x - 4, y - 10, t, { r: 15, puffs: 3 });
  K.impact(x + 8, y - 9, t + 0.45, { r: 11, puffs: 2, shake: false });
  // the burning hull turns grey, lists and goes down under a smoke column
  B.tl.to(ship, { filter: "grayscale(1) brightness(0.75)", rotation: -14, y: 4, duration: 2.2, ease: "power1.in" }, t + 0.5);
  B.tl.to(ship, { autoAlpha: 0, duration: 1.2 }, t + 3.2);
  for (let i = 0; i < 9; i++) K.smoke(x, y - 16, t + 0.9 + i * 1.1, { n: 1, r: 9, rise: 30, drift: 8, life: 3.0, alpha: 0.6 });
  GG.pin(`<svg width="16" height="16" viewBox="0 0 10 10" style="display:block"><path d="M1 1 L9 9 M9 1 L1 9" stroke="#c4121f" stroke-width="2.6" stroke-linecap="round"/></svg>`, x, y, { t: t + 3.4, pop: true });
  GG.lbl(name, lx, ly, { size: 11, anchor, t: t + 0.3 });
  GG.tagbox("SUNK · 25 MAY", lx, ly + 12, "#c4121f", { size: 7, anchor, t: t + 0.6 });
};
// Skyhawks bomb HMS Coventry north of Pebble Island
[0, 1].forEach((i) => K.aircraft({ kind: "jet", side: "rome", size: 26, alt: 7, pts: [[1610 + i * 12, 690 + i * 16], [COVENTRY[0] - 2 + i * 6, COVENTRY[1] - 8 + i * 6], [1930 + i * 12, 562 + i * 16]],
  t: T_COV - 0.9 + i * 0.25, dur: 2.3, until: T_COV + 2.2 }));
GG.lbl("A-4 SKYHAWKS", 1640, 718, { size: 10, color: "#ffc4c4", t: T_COV - 0.8, until: T_COV + 2.2 });
// an Exocet (Super Étendard) runs into Atlantic Conveyor
const T_EXO = T_AC + 0.6 - 0.9;
B.arrow({ side: "rome", pts: [[CONVEYOR[0] - 150, CONVEYOR[1] - 44], [CONVEYOR[0] - 70, CONVEYOR[1] - 18], [CONVEYOR[0] - 4, CONVEYOR[1] - 7]], width: 3, t: T_EXO, dur: 0.9, until: T_EXO + 1.8 });
SFX("missile", T_EXO);
GG.lbl("EXOCET", CONVEYOR[0] - 110, CONVEYOR[1] - 50, { size: 10, color: "#ffc4c4", t: T_EXO + 0.1, until: T_EXO + 2.2 });
wreck(COVENTRY[0], COVENTRY[1], "HMS COVENTRY", COVENTRY[0] - 24, COVENTRY[1] - 4, T_COV + 0.8, [-100, -50]);
wreck(CONVEYOR[0], CONVEYOR[1], "ATLANTIC CONVEYOR", CONVEYOR[0] - 12, CONVEYOR[1] + 4, T_AC + 0.6, [-100, -50]);
B.caption("MOST OF THE HEAVY-LIFT HELICOPTERS LOST", T_HELI - 0.6, END + 1, "rome");
B.finish();
