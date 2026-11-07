// m1f (m1-9 + move1-sub), Grant #16: zoom out from the two fallen forts over the theatre (tennessee map, option 1): the two rivers glow
// blue and the gunboats steam far into Tennessee; the Kentucky line collapses (E2: the lost ground turns pale first, then blue);
// method card line 1 on "attacked the moment the enemy hesitated". move1-sub: woven subscribe (E.subscribe on the subscribing clause),
// a dark-to-bluff transition on the question (a fortress on a high bluff, the supply river under its guns; no place name: it is not spoken),
// NEXT: MOVE 2.  STYLE W (STYLE_LOCK 2d, restyle 2026-11-06): basemap tennessee_w (z9; rivers rebuilt from the traced Ohio / Tennessee /
// Cumberland / Mississippi, no 20th-century lakes: tools/stylew_ten/README.txt). Clean map; the ground the Confederates give up hatches BLUE
// on the wide view (gn_ten_ctl_marcap, stronger hatch for the far-out view, ~3.5 s). Rivers: ink trace on "steam far into Tennessee".
// Built with: python3 tools/m1_build.py m1f tennessee_w m1-9 move1-sub
window.CARDPOS = {};
// @@KIT (Grant #16 move-1 scenes m1a-m1f; inlined into scenes-src/<scene>.js by tools/m1_build.py)
// STYLE W (STYLE_LOCK 2d, restyle 2026-11-06, grant/STYLEW_BRIEF.md): box/flag/arw/legend/badge/stamps/camera/town redefined as in
// cleburne/scenes-src/move1a.js; territory fills are gone (terr/terrLoss are no-ops, hand() = ink hatching on hand-over); Style W block below.
// Source: cleburne/scenes-src/move1e.js kit (sherman move1_kit + the 2026-10-29 approved layers) + templates/clean_screen_v11.js,
// sides for THIS video: Union (Grant) = hero = BLUE "carth"; Confederates = RED "rome". Flags A1: US 34-star (Feb 1862) + CSA First National.
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const FL = { us: "assets/media/us34_flag.png", cs: "assets/media/csa1_13_flag.png" };
const PHOTO = (n) => `assets/media/${n}_head.png`;
const SCN = document.getElementById("scene");
const NS = "http://www.w3.org/2000/svg";
const tl = B.tl;
const WORLD = document.getElementById("world"), OVL = document.getElementById("overlay");
const LBL_LIFE = 3.5;   // clean screen v11: words on screen leave after ~3.5 s
{ const _cap0 = B.caption.bind(B); let nCap = 0; B.caption = (txt, t, until, ...r) => { const u = Math.min(until ?? 1e9, t + LBL_LIFE), el = _cap0(txt, t, u, ...r), k = "cap" + (nCap++);
  const P = (window.CARDPOS || {})[k]; if (P === "left") Object.assign(el.style, { justifyContent: "flex-start", paddingLeft: "70px" }); if (P === "right") Object.assign(el.style, { justifyContent: "flex-end", paddingRight: "70px" });
  (window.__CAPS = window.__CAPS || []).push({ key: k, el, t, until: u }); return el; }; }   // critic r2: caption side solved by tools/m1_place.js (off counters and cards)
const box = (txt, x, y, t, size = 16, until, o = {}) => { size = Math.round(Math.max(20, Math.min(28, size * 0.85)));   // STYLE W: Warhawk labels (white serif + soft shadow, no box); no ref:pop (owner: no synthesized sounds)
  return GG.pin(`<div style="color:#fbf8ef;font-family:'Liberation Serif',Georgia,serif;font-weight:700;letter-spacing:.02em;font-size:${size}px;white-space:nowrap;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6)">${txt.toLowerCase().replace(/(^|\s)(\S)/g, (m, a, b) => a + b.toUpperCase())}</div>`, x, y, { t, until }); };
// v11: the flag only, no country name under it
const flag = (src, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"></div>`, x, y, { t, pop: true, until });
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t > 0 ? o.t : null, label }); if (o.t != null && !(o.t > 0)) gsap.set(B.units[id].el, { autoAlpha: 1 });
  K.counter(id, { icon, flag: o.flag || (side === "carth" ? FL.us : FL.cs), size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const arw = (o) => { delete o.dash;   // STYLE W (critic r1): thin solid trail, thin dark edge (no white casing), fades ~2 s after arrival
  o.until = Math.min(o.until != null ? o.until : 1e9, o.t + (o.dur || 1) + 2.2);
  const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path"); g.classList.add("arwg");
  ps[0].setAttribute("stroke", "rgba(30,26,14,0.55)"); ps[0].setAttribute("stroke-width", (w * 1.35).toFixed(2));
  const hd = g.querySelector("polygon"); if (hd) { hd.setAttribute("stroke", "rgba(30,26,14,0.55)"); hd.setAttribute("stroke-width", (w * 0.25).toFixed(2)); } return g; };
// legend (UNION blue / CONFEDERACY red); opt2 = two short glowing lines instead of squares
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERACY"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, Math.min(until, t + 6));   // STYLE W: ~6 s, only when a symbol is new
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
const sub = (pts, f0, f1, n = 16) => [...Array(n + 1)].map((_, k) => posOn(pts, f0 + (f1 - f0) * k / n));
// thin glowing shell trail (GG.arc's dark casing reads too heavy on close-ups); width in world px
const shellArc = (a, b, t, dur, o = {}) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, h = o.h != null ? o.h : L * 0.3;
  let nx = (b[1] - a[1]) / L, ny = -(b[0] - a[0]) / L; if (ny > 0) { nx = -nx; ny = -ny; }
  const mx = (a[0] + b[0]) / 2 + nx * h, my = (a[1] + b[1]) / 2 + ny * h, w = o.width || 1.2, col = o.color || "#fff3c4";
  const p = document.createElementNS(NS, "path"); p.setAttribute("d", `M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`); p.setAttribute("fill", "none");
  p.setAttribute("stroke", col); p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.style.filter = `drop-shadow(0 0 ${w * 1.5}px ${col})`;
  document.getElementById("overlay").appendChild(p); const len = p.getTotalLength(), seg = Math.max(len * 0.35, 4);
  gsap.set(p, { strokeDasharray: `${seg} ${len + seg}`, strokeDashoffset: seg, opacity: 0 });
  tl.set(p, { opacity: 1 }, t); tl.to(p, { strokeDashoffset: -len, duration: dur, ease: "power1.in" }, t); tl.set(p, { opacity: 0 }, t + dur + 0.02); return p; };
// artillery / ship-gun shot: the gun fires (quiet), shell arc, the impact carries the boom + the locked shake (never switched off)
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 1.0;
  shellArc(from, to, t + 0.05, dur, { width: o.width || 1.2, h: o.h, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: 2 });
};
const badge = (o) => {   // STYLE W: corner badge only for a commander with NO unit on the map: top right, <= 3.5 s, one per person
  o = { ...o, corner: "tr", until: Math.min(o.until != null ? o.until : 1e9, o.t + 3.5) };
  const el = K.badge(o); const ring = el.querySelector("div[style*='border-radius:50%']"), img = ring.querySelector("img");
  if (img) { const ini = document.createElement("div"); ini.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.78) 0%, rgba(10,12,24,0.45) 100%);font-size:60px;font-weight:700;color:#f7f3ea;text-shadow:0 3px 6px #000";
    ini.textContent = o.initials || ""; ini.style.display = "none"; ring.insertBefore(ini, img); img.addEventListener("error", () => { img.style.display = "none"; ini.style.display = "flex"; }); }
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(1, Math.round(size / 9))}px solid ${c};padding:${(size * 0.1).toFixed(1)}px ${(size * 0.5).toFixed(1)}px ${(size * 0.14).toFixed(1)}px;background:rgba(14,12,10,0.78);box-shadow:0 ${size * 0.2}px ${size * 0.5}px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${(size * 0.34).toFixed(1)}px;letter-spacing:0.2em;color:#f7f3ea;margin-top:${size * 0.05}px">${sub}</div>` : ""}</div>`;
const badgeStamp = (el, txt, t, o = {}) => {   // grey a badge + slam a small stamp on it (WOUNDED)
  const ring = el.querySelector("div[style*='border-radius:50%']");
  if (o.grey !== false) tl.to(ring, { filter: "grayscale(1) brightness(0.6)", duration: 0.4 }, t);
  const st = document.createElement("div"); st.innerHTML = stampHTML(txt, o.color || "#e3232f", o.size || 30, -8);
  st.style.cssText = "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:5";
  ring.appendChild(st); gsap.set(st, { autoAlpha: 0 });
  tl.fromTo(st, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.2); K.shake(t + 0.2, 3, 0.25); return st;
};
const glowPathOld = (pts, col, w, t, until, pulses = 3, op = 0.95, o = {}) => {   // glowing stroke (river, road, line)
  const p = document.createElementNS(NS, "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); p.style.filter = `drop-shadow(0 0 ${w}px ${col})`;
  if (o.dash) p.setAttribute("stroke-dasharray", o.dash);
  if (o.top) svg.appendChild(p); else svg.insertBefore(p, svg.firstChild); gsap.set(p, { opacity: 0 });
  if (o.draw) { let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
    gsap.set(p, { strokeDasharray: `${Lt} ${Lt + 10}`, strokeDashoffset: Lt }); tl.to(p, { strokeDashoffset: 0, duration: o.draw, ease: "power1.inOut" }, t); }
  tl.to(p, { opacity: op, duration: 0.5 }, t); if (pulses) tl.to(p, { opacity: op * 0.45, duration: 0.5, yoyo: true, repeat: pulses, ease: "sine.inOut" }, t + 0.5 + (o.draw || 0));
  if (until != null) tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const scr = (html, css, t, until, from = { autoAlpha: 0, y: 30 }) => {   // screen-space element (above the map, under the credit)
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; el.classList.add("scrcard");
  SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);
  tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el;
};
const along = (id, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); B.move(id, t + (k - 1) * dur / n, dur / n, q[0], q[1], "none"); } };
const pinAlong = (el, pts, t, dur, n = 24) => { for (let k = 1; k <= n; k++) { const q = posOn(pts, k / n); tl.to(el, { left: q[0], top: q[1], duration: dur / n, ease: "none" }, t + (k - 1) * dur / n); } };
const ticker = (label, to, suffix, css, t, dur, until, n = 8, o = {}) => {   // STYLE W (critic r1): the spoken number only (no count-up, no sub line), <= 3.5 s
  const el = scr(`<div style="padding:10px 26px 12px;background:rgba(18,16,12,0.9);border-top:5px solid ${o.col || "#c9b48a"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center">
    ${label ? `<div style="font-size:18px;letter-spacing:.3em;color:${o.col || "#c9b48a"}">${label}</div>` : ""}<div class="v" style="font-size:${o.vs || 54}px;letter-spacing:.04em">${o.pre || ""}${Number(to).toLocaleString("en-US")}${suffix}</div></div>`, css, t, Math.min(until, t + 3.5));
  SFX("tick", t + 0.2); return el;
};
const mg = (a, b, t, n = 5, w = 1.1) => { SFX("mg", t);   // musket volley: tracer dashes (mg sound), sparingly
  for (let k = 0; k < n; k++) { const g = document.createElementNS(NS, "line"), j = ((k * 7) % 5 - 2) * 1.5 * w;
    g.setAttribute("x1", a[0]); g.setAttribute("y1", a[1]); g.setAttribute("x2", b[0] + j); g.setAttribute("y2", b[1] - j);
    g.setAttribute("stroke", "#ffe28a"); g.setAttribute("stroke-width", w); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-dasharray", `${3 * w} ${26 * w}`);
    g.style.filter = `drop-shadow(0 0 ${2 * w}px #ffb347)`; document.getElementById("overlay").appendChild(g); GG.hide(g);
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + 29 * w;
    tl.fromTo(g, { autoAlpha: 1, strokeDashoffset: 0 }, { strokeDashoffset: -len, duration: 0.4, ease: "none", immediateRender: false }, t + k * 0.1);
    tl.to(g, { autoAlpha: 0, duration: 0.05 }, t + k * 0.1 + 0.4); } };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const sstamp = (txt, top, t, o = {}) => { const u = Math.min(o.until != null ? o.until : 1e9, t + 3.5);   // STYLE W: level, cream on dark, <= 3.5 s
  const el = scr(stampHTML(txt, "#f0e6c8", o.size || 60, 0, o.sub), o.pos || `left:0;right:0;top:${top}px;display:flex;justify-content:center;`, t, null, { autoAlpha: 0 }); return slam(el, t, { ...o, from: 1.4, shake: o.shake || 3, until: u }); };
const wstamp = (txt, x, y, t, until, c = "#e3232f", size = 9, sub) => { const el = GG.pin(stampHTML(txt, c, size, -6, sub), x, y, {});
  tl.fromTo(el, { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
// quote card (screen space): verbatim quote + attribution (quote marks only for verbatim words)
const quote = (txt, who, t, until, o = {}) => scr(`<div style="max-width:${o.mw || 1280}px;padding:22px 46px 22px;background:rgba(18,16,12,0.93);border-left:8px solid ${o.col || "#1f4fc4"};font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  <div style="font-size:${o.size || 40}px;font-weight:500;line-height:1.28;letter-spacing:.02em">${txt}</div>${who ? `<div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">${who}</div>` : ""}</div>`,
  o.pos || `left:0;right:0;top:${o.top || 230}px;display:flex;justify-content:center;`, t, until);
const belief = (txt, subt, t, until, o = {}) => scr(`<div style="padding:16px 40px 18px;background:rgba(18,16,12,0.93);border-top:6px solid ${o.col || "#c4121f"};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
  ${subt ? `<div style="font-size:17px;letter-spacing:.32em;color:${o.subc || "#ff8a80"}">${subt}</div>` : ""}<div style="font-size:${o.size || 46}px;letter-spacing:.08em;margin-top:4px">${txt}</div></div>`,
  o.pos || `left:0;right:0;top:${o.top || 230}px;display:flex;justify-content:center;`, t, until);
const fixImgs = () => document.querySelectorAll("img").forEach((im) => { im.addEventListener("error", () => { im.style.display = "none"; }, { once: true }); });
const fireGlow = (x, y, r, t, until) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,90,.85) 0%,rgba(255,110,20,.55) 35%,rgba(200,40,0,.25) 60%,rgba(120,20,0,0) 75%);mix-blend-mode:screen"></div>`, x, y, { t, until });
  tl.to(el.firstElementChild, { scale: 1.15, opacity: 0.75, duration: 0.35, yoyo: true, repeat: Math.max(1, Math.round(((until || t + 8) - t) / 0.35)), ease: "sine.inOut" }, t + 0.5); return el; };
const nightWash = (t, until, a = 0.5, dur = 1.2) => { const el = document.createElement("div"); el.style.cssText = `position:absolute;inset:0;background:rgba(6,10,26,${a});pointer-events:none`;
  document.getElementById("fx").appendChild(el); gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: dur }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 1.5 }, until); return el; };
const dawnWash = (t, until) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;inset:0;background:linear-gradient(to left, rgba(255,160,80,0.30), rgba(255,190,130,0.12) 55%, rgba(255,210,160,0.03));pointer-events:none;mix-blend-mode:soft-light";
  document.getElementById("fx").appendChild(el); gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: 2.0 }, t); if (until != null) tl.to(el, { autoAlpha: 0, duration: 2.0 }, until); return el; };
// cavalry counter icon (owner-approved, sherman/scenes-src/cavalry_icon.js)
const CAV_SVG = `<g fill="#f7f3ea" stroke="none">
  <path d="M25 43 C16 41 9 47 5 56 C11 52 17 50 24 50 Z"/>
  <path d="M24 44 C28 37 40 36 52 38 L66 37 C70 34 74 28 78 22 L84 17 L86 11 L88.5 18.5 L96 29 L94.5 34.5 L88 33 L82.5 32 C80.5 38 78.5 44 76.5 48 C76.5 54 72 58 66 58 L36 58 C30 58 25 54 24 48 Z"/>
  <path d="M46 38.5 L54 38.5 L58 23 L47.5 20 Z"/>
  <circle cx="52" cy="14" r="5"/><ellipse cx="51.5" cy="9.6" rx="7" ry="2.2"/></g>
  <g fill="none" stroke="#f7f3ea" stroke-linecap="round" stroke-linejoin="round">
  <path d="M69 55 L81 63 L90 61" stroke-width="5"/><path d="M64 56 L73 66 L72 75" stroke-width="5"/>
  <path d="M35 55 L23 63 L13 65" stroke-width="5"/><path d="M41 56 L37 68 L41 76" stroke-width="5"/>
  <path d="M51 35 L59 43 L57 51" stroke-width="5"/>
  <path d="M54 25 L65 20" stroke-width="4.5"/><path d="M65 20 L79 3" stroke-width="2.6"/></g>`;
const cavIcon = (id, o = {}) => { const sv = B.units[id].el.querySelector(".blk svg");
  sv.setAttribute("viewBox", "0 0 100 80"); sv.setAttribute("preserveAspectRatio", "xMidYMid meet");
  sv.innerHTML = o.flip ? `<g transform="translate(100 0) scale(-1 1)">${CAV_SVG}</g>` : CAV_SVG; };
// K.front with its OWN blur filter (each front keeps the locked width 15 / glow 0.47 on screen at its own camera scale)
let __FID = 0;
const frontS = (o) => { const g = K.front(o); g.classList.add("frontg"); const id = "m1blur" + (++__FID), f = document.createElementNS(NS, "filter"), ov = document.getElementById("overlay");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; ov.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`));
  if (!(o.t > 0)) { const ps = [...g.querySelectorAll("path")]; tl.getTweensOf(ps).filter((tw) => tw.startTime() < 0.05 && "strokeDashoffset" in tw.vars).forEach((tw) => tw.kill()); gsap.set(ps, { strokeDashoffset: 0 }); }
  return g; };
// ================= approved 2026-10-29 layers (A1 / A2 / E2), copied =================
const SCL = []; let CAM_S = 1;
const setInv = () => { const k = (1 / CAM_S).toFixed(4); SCL.forEach((el) => { el.style.transform = `scale(${k})`; }); };
let CAM_X0 = 0, CAM_Y0 = 0;
const camera = (keys) => {   // STYLE W camera (cleburne move1a): lens transition wide -> close (#relief2), focus / ink / curve labels follow
  const cam = { cx: keys[0][1], cy: keys[0][2], s: keys[0][3] }, clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const apply = () => { const s = Math.max(cam.s, 1920 / 2880), cx = clamp(cam.cx, 960 / s, 2880 - 960 / s), cy = clamp(cam.cy, 540 / s, 1620 - 540 / s);
    gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv();
    const kc = Math.min(1, Math.max(0, (s - 1.5) / 0.7)); const R2 = document.getElementById("relief2");
    if (R2) { R2.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
      R2.style.webkitMaskImage = R2.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none"; }
    CAM_X0 = 960 - cx * s; CAM_Y0 = 540 - cy * s; if (typeof focApply === "function") { focApply(); curvApply(); inkApply(); }
    (window.__CARDS || []).forEach((c) => { const r = c.card.getBoundingClientRect(); if (!r.width) return;
      const dr = document.getElementById("date").getBoundingClientRect(), md = dr.width ? Math.max(r.left - dr.right, dr.left - r.right, r.top - dr.bottom, dr.top - r.bottom) : 99;
      const m = Math.min(r.left, r.top, 1920 - r.right, 1080 - r.bottom, md + 28), capHit = [...document.querySelectorAll(".caption span")].some((sp) => { const q = sp.getBoundingClientRect(), cs = getComputedStyle(sp.parentElement); return q.width && cs.visibility !== "hidden" && +cs.opacity > 0.1 && r.right > q.left - 12 && r.left < q.right + 12 && r.bottom > q.top - 12 && r.top < q.bottom + 12; }),
        k = capHit ? "0" : Math.max(0, Math.min(1, (m - 40) / 6)).toFixed(3);   // fully out while cropped (< 40 px), under the date scroll or under a caption
      c.card.style.opacity = k; c.stake.style.opacity = k; });   // critic r2: a card steps out only while the camera crops it
    { const dr = document.getElementById("date").getBoundingClientRect();   // critic r2: counters step out under the date scroll or at the frame edge
      document.querySelectorAll(".unit .blk").forEach((b) => { const r = b.getBoundingClientRect(); if (!r.width) return;
        const under = r.right > dr.left - 12 && r.left < dr.right + 12 && r.bottom > dr.top - 12 && r.top < dr.bottom + 12 && dr.width > 0;
        const edge = Math.min(r.left, r.top, 1920 - r.right, 1080 - r.bottom) < 30;
        const o = under || edge ? "0" : ""; [...b.parentElement.children].forEach((ch) => { if (!ch.querySelector(".pcard")) ch.style.opacity = o; }); }); }   // the whole counter (box, echelon mark, tag), not the card
    document.getElementById("vignette").style.opacity = kc.toFixed(3); };
  apply();
  for (let i = 1; i < keys.length; i++) { const [t0] = keys[i - 1], [t1, cx, cy, s] = keys[i];
    tl.to(cam, { cx, cy, s, duration: Math.max(t1 - t0, 0.01), ease: "sine.inOut", onUpdate: apply }, t0); }
  tl.call(apply, null, 0);
};
const reg = (el, origin = "50% 50%") => { el.style.transformOrigin = origin; SCL.push(el); return el; };
const pinS = (el) => { reg(el.firstElementChild); return el; };
const boxS = (txt, x, y, t, until, o = {}) => { const el = pinS(box(txt, x, y, t, o.size || 26, o.keep ? until : Math.min(until ?? 1e9, t + LBL_LIFE), o)); el.classList.add("wlabel"); return el; };   // STYLE W label; passing labels <= 3.5 s
const flagS = (src, x, y, t, until, w) => { const el = pinS(flag(src, x, y, t > 0 ? t : null, until, 48)); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); el.classList.add("sflag"); return el; };   // STYLE W: 48 px, no names
const wstampS = (txt, x, y, t, until, c, size = 22) => { until = Math.min(until ?? 1e9, t + LBL_LIFE);   // STYLE W stamp: level, cream on dark, on empty ground, <= 3.5 s
  const el = pinS(GG.pin(stampHTML(txt, "#f0e6c8", 28, 0), x, y, {})); el.classList.add("wstamp");
  tl.fromTo(el, { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  SFX("hit", t + 0.18); K.shake(t + 0.18, 3, 0.25); tl.to(el, { autoAlpha: 0, duration: 0.3 }, until); return el; };
const unitS = (id, side, p, icon, label, o = {}) => {   // A1: counter 54 x 36 px, name 19 px (screen)
  const W0 = o.w || 54, H0 = o.h || 36;
  unit(id, side, p, icon, label, { ...o, w: W0, h: H0, tag: o.tag || 19 });
  const el = B.units[id].el, inner = document.createElement("div");
  inner.style.cssText = `position:relative;width:${W0}px;display:flex;flex-direction:column;align-items:center;overflow:visible`;
  while (el.firstChild) inner.appendChild(el.firstChild); el.appendChild(inner); reg(inner, `50% ${H0 / 2}px`);
  return id;
};
const showU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 1, duration: 0.4 }, t));
const hideU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el, { autoAlpha: 0, duration: 0.4 }, t));
const pulseU = (id, t, k = 1.25) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: k, duration: 0.22, yoyo: true, repeat: 1, immediateRender: false }, t);
const greyU = () => null;   // STYLE W (critic r1, C10): side colours only, units never turn grey
const ungreyU = (ids, t) => ids.forEach((id) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "grayscale(0) brightness(1)", duration: 0.6 }, t));
const AW = (s, px = 6) => +(Math.min(px, 6) / s).toFixed(2);       // STYLE W (critic r1): thin trails, <= 6 px on screen at camera scale s
const FWw = (s) => +(15 / s).toFixed(2);               // front width 15 on screen (wide)
const FWc = (s) => +(15 * 1.3 / s).toFixed(2);         // front width 15*1.3 on close-ups
const town = (nm, p, t, side = "r") => { const lft = side === "l";   // STYLE W: permanent town symbol (dark dot + serif name), towns the armies head for
  const el = GG.pin(`<div style="position:relative;width:0;height:0"><div class="dt" style="position:absolute;left:-5.5px;top:-5.5px;width:11px;height:11px;border-radius:50%;background:#1e1c14;box-shadow:0 0 0 1.5px rgba(160,158,146,.9)"></div><div class="nm" style="position:absolute;top:-17px;${lft ? "right:13px" : "left:13px"};font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:28px;letter-spacing:.02em;color:#fbf8ef;white-space:nowrap;text-transform:capitalize;text-shadow:0 2px 3px rgba(0,0,0,.8),0 0 5px rgba(0,0,0,.6);transform-origin:${lft ? "100%" : "0%"} 50%">${nm.toLowerCase()}</div></div>`, p[0], p[1], { t: t > 0 ? t : null });
  pinS(el); if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); const nmEl = el.querySelector(".nm");
  return { el, shrink: (tt) => tl.to(nmEl, { scale: 0.5, opacity: 0.75, duration: 0.6 }, tt), grow: (tt) => tl.to(nmEl, { scale: 1, opacity: 1, duration: 0.6 }, tt) }; };
// v11 territory layer (option 1) with a cross-fade in and a smooth dissolve out (sine.inOut)
const terr = () => document.createElement("div");   // STYLE W: no territory fills (clean map); ground changing hands = hand() ink hatching
// E2: ground about to be lost turns PALER first (to 40 % over ~1.3 s on the cue), then the winner's layer cross-fades in (~1 s)
const terrLoss = () => [terr(), terr()];
// HUD declutter (STYLE_LOCK 1c rule 3): while a big card is up, the legend / corner badges step out via filter:opacity()
const declutter = (huds, wins) => {
  const M = []; wins.slice().sort((a, b) => a[0] - b[0]).forEach(([a, b]) => { const L2 = M[M.length - 1]; if (L2 && a - L2[1] < 0.9) L2[1] = Math.max(L2[1], b); else M.push([a, b]); });
  huds.forEach((el) => { gsap.set(el, { filter: "opacity(1)" });
    M.forEach(([a, b]) => { tl.to(el, { filter: "opacity(0)", duration: 0.15, ease: "none", immediateRender: false }, a - 0.15); tl.to(el, { filter: "opacity(1)", duration: 0.3, ease: "none", immediateRender: false }, b + 0.3); }); });
};
// ---------- ships (top-down counters, drawn inline): Union ironclad / timberclad (blue), Confederate river steamer (red) ----------
const SHIPCOL = { carth: "#1f4fc4", rome: "#c4121f" };
const shipSVG = (kind, side, L) => { const c = SHIPCOL[side] || side, H = L * 0.34;
  const hull = kind === "steamer" ? `<path d="M6 7 L78 6 Q96 17 78 28 L6 27 Q2 17 6 7 Z" fill="#3a332a" stroke="${c}" stroke-width="3"/><rect x="18" y="10" width="44" height="14" rx="2" fill="#d9cfb8" stroke="#1a1712" stroke-width="1.4"/><rect x="2" y="9" width="8" height="16" fill="#5a4a36" stroke="#1a1712" stroke-width="1"/>`
    : kind === "timber" ? `<path d="M4 7 L80 6 Q97 17 80 28 L4 27 Z" fill="#4a3c2c" stroke="${c}" stroke-width="3.2"/><rect x="16" y="9" width="50" height="16" rx="2" fill="#7a654a" stroke="#1a1712" stroke-width="1.4"/>`
    : `<path d="M4 6 L80 4 L97 17 L80 30 L4 28 Z" fill="#2b3442" stroke="${c}" stroke-width="3.4"/><path d="M14 9 L70 8 L76 17 L70 26 L14 25 L10 17 Z" fill="#4a5564" stroke="#151a22" stroke-width="1.6"/><rect x="20" y="13" width="44" height="8" fill="#5c6878"/>`;
  return `<svg width="${L}" height="${H}" viewBox="0 0 100 34" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${L * 0.05}px ${c}) drop-shadow(0 ${L * 0.03}px ${L * 0.04}px rgba(0,0,0,.6))">
    ${hull}<circle cx="${kind === "steamer" ? 44 : 38}" cy="${kind === "steamer" ? 13 : 17}" r="3.6" fill="#111"/><circle cx="${kind === "steamer" ? 44 : 49}" cy="${kind === "steamer" ? 21 : 17}" r="3.6" fill="#111"/>
    <line x1="8" y1="17" x2="-6" y2="17" stroke="#f3eee2" stroke-width="1.6"/><path d="M-6 17 L-20 12 L-20 22 Z" fill="${c}" stroke="#f3eee2" stroke-width="1"/></svg>`; };
// ship(kind, side, p, ang, t, until, o): world-pinned, constant screen size (L px), heading ang (deg, 0 = east). Returns { el, rot, label }.
const ship = (kind, side, p, ang, t, until, o = {}) => {
  const L = o.L || 64;
  const el = GG.pin(`<div class="shs" style="position:relative;width:0;height:0"><div class="shr" style="position:absolute;left:${-L / 2}px;top:${-L * 0.17}px;width:${L}px;transform:rotate(${ang}deg);transform-origin:50% 50%">${shipSVG(kind, side, L)}</div>${o.name ? `<div class="shn" style="position:absolute;left:${o.nx != null ? o.nx : -60}px;top:${o.ny != null ? o.ny : L * 0.28}px;width:120px;text-align:center;font-family:Oswald;font-weight:700;font-size:${o.ns || 17}px;letter-spacing:.08em;color:#f7f3ea;white-space:nowrap;text-shadow:0 0 5px #000,0 1px 3px #000">${o.name}</div>` : ""}</div>`, p[0], p[1], { t, until, pop: o.pop });
  pinS(el); return { el, rot: el.querySelector(".shr"), name: el.querySelector(".shn"), L, side };
};
const sail = (s, pts, t, dur, n = 24, o = {}) => {   // move along a polyline, turning to the heading of each leg
  for (let k = 1; k <= n; k++) { const a = posOn(pts, (k - 1) / n), b = posOn(pts, k / n), tt = t + (k - 1) * dur / n;
    tl.to(s.el, { left: b[0], top: b[1], duration: dur / n, ease: "none" }, tt);
    if (!o.keepRot) tl.to(s.rot, { rotation: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI + (o.rev ? 180 : 0), duration: Math.min(0.4, dur / n), ease: "none" }, tt); } };
const stackSmoke = (p, t, until, every = 1.6) => { for (let tt = t; tt < until; tt += every) K.smoke(p[0], p[1], tt, { n: 2, r: 5, rise: 14, life: 2.0, alpha: 0.55 }); };
// small fort (star outline) world-pinned, constant screen size
const fortIcon = (p, t, until, o = {}) => { const s = o.s || 30, col = o.col || "#e3232f";
  const el = pinS(GG.pin(`<svg width="${s * 2}" height="${s * 2}" viewBox="-20 -20 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 0 ${s * 0.18}px ${col})">
    <polygon points="0,-17 5,-6 17,-6 8,2 12,15 0,8 -12,15 -8,2 -17,-6 -5,-6" fill="rgba(60,10,10,.55)" stroke="${col}" stroke-width="3.2" stroke-linejoin="round"/></svg>`, p[0], p[1], { t: t > 0 ? t : null, pop: t > 0, until }));
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); el.classList.add("fortico");
  el.toBlue = (tt) => { const pg = el.querySelector("polygon"); tl.to(pg, { attr: { stroke: "#4f8bff", fill: "rgba(10,20,60,.55)" }, duration: 0.4 }, tt); tl.to(el.querySelector("svg"), { filter: "drop-shadow(0 0 4px #4f8bff)", duration: 0.4 }, tt); };   // captured fort turns blue
  return el; };   // on the map from frame 0
// a world-pinned mini flag on a pole (over a fort), constant size
const poleFlag = (src, p, t, until, w = 46) => pinS(GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-1.5px;top:${-w * 1.25}px;width:3px;height:${w * 1.25}px;background:#efe6cf;box-shadow:0 0 3px #000"></div><img src="${src}" style="position:absolute;left:1px;top:${-w * 1.25}px;width:${w}px;border:1px solid #1a1712;box-shadow:0 2px 5px rgba(0,0,0,.6)"></div>`, p[0], p[1], { t, pop: true, until }));
// mini commander chip (screen space): round photo + name, for naming several generals in a row without a big badge each
const chip = (key, name, side, css, t, until, o = {}) => { const c = SHIPCOL[side];
  const el = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:6px;font-family:Oswald;font-weight:700;color:#f7f3ea"><div class="ring" style="position:relative;width:${o.d || 110}px;height:${o.d || 110}px;border-radius:50%;overflow:hidden;border:4px solid #f3e7c4;box-shadow:0 0 0 3px ${c},0 8px 18px rgba(0,0,0,.6);background:url(${side === "carth" ? FL.us : FL.cs}) center/cover"><img src="${PHOTO(key)}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div><div style="padding:3px 12px;background:rgba(18,16,12,.9);border-bottom:4px solid ${c};font-size:${o.fs || 22}px;letter-spacing:.08em;white-space:nowrap">${name}</div></div>`, css, t, until, { autoAlpha: 0, y: 20 });
  SFX("ref:pop", t); return el; };
// already on screen at frame 0 (continuing scenes): kill the entry tween of a card/legend; dateNow = the date scroll already showing
const now = (el) => { tl.getTweensOf(el).filter((tw) => tw.startTime() < 0.05).forEach((tw) => tw.kill()); gsap.set(el, { autoAlpha: 1, y: 0, x: 0 }); return el; };
const dateNow = (text, until) => { const box = document.getElementById("date"); gsap.set(box, { autoAlpha: 1 });
  const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "34px"; box.appendChild(d);
  if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.35 }, until); return d; };
// ================= STYLE W kit (STYLE_LOCK 2d; copied from cleburne/scenes-src/move1a.js + move3b.js, owner-approved 2026-11-05) =================
// clean map by default: territory only as ink hatching at the moment ground changes hands (tools/make_hatch.py gn_* layers, ~3 s)
document.documentElement.classList.add("terr-on");
const lay = (file, on, off) => { const el = document.createElement("img"); el.className = "wimg"; el.src = file; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px", mixBlendMode: "normal", filter: "none" });
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 0 });
  tl.set(el, { autoAlpha: 1 }, on); if (off != null) tl.set(el, { autoAlpha: 0 }, off); return el; };
// hand(file, on): the captured ground hatches in (0.8 s), holds, dissolves (1.2 s) ~3 s later. Union gains = blue ink, Confederate gains = red ink.
const hand = (file, on, hold = 3.0) => { const el = lay(file, on, on + hold + 1.4); tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, immediateRender: false }, on);
  tl.to(el, { opacity: 0, duration: 1.2, ease: "sine.inOut" }, on + hold); return el; };
// living map: clouds only (no scale bar, no north arrow, no river shimmer on the Style W map)
{ const _LK = LivingK; window.LivingK = (b) => { const lv = _LK(b); lv.scaleBar = () => null; lv.north = () => null; lv.shimmer = () => null; return lv; }; }
// (1) soft focus wash (screen space): everything outside the named place dims to ~84 %; replaces target rings + colour glows
const NSs = NS;
const FOC = document.createElement("div"); FOC.style.cssText = "position:absolute;inset:0;pointer-events:none;opacity:0";
document.getElementById("scene").insertBefore(FOC, document.getElementById("fx"));
const FS = { x: 1440, y: 810, r: 120, k: 0 };
const focApply = () => { const sx = CAM_X0 + FS.x * CAM_S, sy = CAM_Y0 + FS.y * CAM_S, r = Math.max(70, FS.r * CAM_S);
  FOC.style.background = `radial-gradient(ellipse ${(r * 1.3).toFixed(0)}px ${r.toFixed(0)}px at ${sx.toFixed(0)}px ${sy.toFixed(0)}px, rgba(8,8,4,0) 0%, rgba(8,8,4,0) 45%, rgba(8,8,4,${CAM_S > 2.5 ? 0.22 : 0.16}) 100%)`;
  FOC.style.opacity = FS.k.toFixed(3); };
const focus = (p, r, t, until) => { until = Math.min(until, t + 3.5);
  tl.to(FS, { x: p[0], y: p[1], r, duration: 0.6, ease: "sine.inOut", onUpdate: focApply }, t);
  tl.to(FS, { k: 1, duration: 0.6, onUpdate: focApply }, t);
  tl.to(FS, { k: 0, duration: 0.6, onUpdate: focApply }, until); };
// (2) thin sepia ink trace along a named feature: draws on its word, holds, fades (<= 3.5 s)
const INKS = []; const inkApply = () => INKS.forEach((p) => p.setAttribute("stroke-width", (2.0 / CAM_S).toFixed(3)));
const inkTrace = (pts, t, until, w = 2.4, dash) => { until = Math.min(until, t + 3.5);
  const p = document.createElementNS(NSs, "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L"));
  Object.entries({ fill: "none", stroke: "#463a1e", "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  OVL.appendChild(p); INKS.push(p);
  if (dash) { p.setAttribute("stroke-dasharray", dash); tl.to(p, { opacity: 0.65, duration: 0.4 }, t); }
  else { const L = p.getTotalLength(); gsap.set(p, { attr: { "stroke-dasharray": L, "stroke-dashoffset": L } });
    tl.to(p, { opacity: 0.65, duration: 0.2 }, t); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.8, ease: "sine.out" }, t); }
  tl.to(p, { opacity: 0, duration: 0.8 }, until - 0.3); return p; };
// every former colour glow = focus + ink trace; every former target ring = focus
const glowPath = (pts, col, w, t, until, pulses, op, o = {}) => {
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  if (o.focus !== false) focus([cx, cy], Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 40, t, until ?? t + 3.5);
  return inkTrace(pts, t, until ?? t + 3.5, 2.4, o.inkDash || null); };
K.target = (x, y, t, o = {}) => focus([x, y], (o.r || 20) * 2 + 30, t, o.until != null ? o.until : t + 3);
// (3) curved map labels (white serif along the feature), constant screen size, <= 3.5 s
const CURV = [];
const curveLabel = (txt, pts, t, until, px = 24) => { until = Math.min(until, t + 3.5);
  const id = "cl" + CURV.length, g = document.createElementNS(NSs, "g"), path = document.createElementNS(NSs, "path");
  path.setAttribute("id", id); path.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); path.setAttribute("fill", "none");
  const tx = document.createElementNS(NSs, "text"); Object.entries({ fill: "#fbf8ef", "font-family": "'Liberation Serif',Georgia,serif", "font-weight": "700", "text-anchor": "middle" }).forEach(([k, v]) => tx.setAttribute(k, v));
  tx.style.filter = "drop-shadow(0 1px 1.5px rgba(0,0,0,.9))";
  const tp = document.createElementNS(NSs, "textPath"); tp.setAttribute("href", "#" + id); tp.setAttribute("startOffset", "50%"); tp.textContent = txt; tx.appendChild(tp);
  g.appendChild(path); g.appendChild(tx); g.setAttribute("opacity", "0"); OVL.appendChild(g); CURV.push([tx, px]);
  tl.to(g, { opacity: 1, duration: 0.5 }, t); tl.to(g, { opacity: 0, duration: 0.5 }, until); return g; };
const curvApply = () => CURV.forEach(([tx, px]) => tx.setAttribute("font-size", (px / CAM_S).toFixed(2)));
// (4) zoom box: thin dashed sepia frame of where the camera is about to dive (~1.5 s); hw/hh in map px
const zoomBox = (cx, cy, t, hw = 190, hh = 110) => { const g = document.createElementNS(NSs, "g"), r = document.createElementNS(NSs, "rect");
  Object.entries({ x: cx - hw, y: cy - hh, width: 2 * hw, height: 2 * hh, fill: "none", stroke: "#2a2410", "stroke-width": 2.2 * hw / 190, "stroke-dasharray": `${10 * hw / 190} ${7 * hw / 190}` }).forEach(([k, v]) => r.setAttribute(k, v));
  g.appendChild(r); g.setAttribute("opacity", "0"); OVL.appendChild(g);
  tl.to(g, { opacity: 0.9, duration: 0.3 }, t); tl.to(g, { opacity: 0, duration: 0.4 }, t + 1.2); };
// (5) commander portrait on a stake at HIS unit (or a world-pinned element such as his ship / HQ), for the whole battle once named
const pinPortrait = (id, photo, flagSrc, name, t, until, keep = false, side = "up") => { if (!keep) until = Math.min(until, t + 3.6);
  const host = typeof id === "string" ? B.units[id].el.firstElementChild : id.firstElementChild, w = document.createElement("div");
  w.style.cssText = "position:absolute;left:50%;top:-44px;width:0;height:0;pointer-events:none;z-index:5";
  w.innerHTML = `<div style="position:absolute;left:-38px;bottom:0;width:76px;background:#1a1712;border:1.5px solid #e9dfc6;box-shadow:0 4px 10px rgba(0,0,0,.6)"><img src="${flagSrc}" style="display:block;width:76px;height:15px;object-fit:cover"><img src="${photo}" style="display:block;width:76px;height:82px;object-fit:cover;object-position:50% 20%;filter:sepia(.35) contrast(1.05)"><div style="font-family:'Liberation Serif',Georgia,serif;font-weight:700;font-size:13px;color:#fbf8ef;text-align:center;padding:2px 0 3px;white-space:nowrap">${name}</div></div><div style="position:absolute;left:-1px;bottom:-40px;width:1.5px;height:40px;background:#463a1e"></div>`;
  const card = w.firstElementChild, stake = w.lastElementChild;
  if (side === "right") { w.style.top = "4px"; w.style.left = "calc(100% + 0px)";
    Object.assign(card.style, { left: "40px", bottom: "auto", top: "56px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "70px", height: "1.5px", transformOrigin: "0 0", transform: "rotate(54deg)" }); }
  if (side === "upright") { w.style.top = "4px"; w.style.left = "calc(100% + 0px)";
    Object.assign(card.style, { left: "56px", bottom: "auto", top: "-175px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: "95px", height: "1.5px", transformOrigin: "0 0", transform: "rotate(-39deg)" }); }
  if (side === "left" || side === "upleft") { w.style.top = "4px"; w.style.left = "0px"; const up = side === "upleft";
    Object.assign(card.style, { left: up ? "-150px" : "-116px", bottom: "auto", top: up ? "-175px" : "56px" });
    Object.assign(stake.style, { left: "0px", bottom: "auto", top: "0px", width: up ? "95px" : "69px", height: "1.5px", transformOrigin: "0 0", transform: `rotate(${up ? -141 : 125.5}deg)` }); }
  // critic r2: placement pass. tools/m1_place.js solves a screen offset per card (window.CARDPOS[key] = [dx, dy] from the unit centre):
  // the card stands on a side stake clear of counters, fort stars, front lines, the date scroll and the other cards
  const key = name + "@" + (typeof id === "string" ? id : (id.dataset.pk || (id.dataset.pk = "el" + (window.__PK = (window.__PK || 0) + 1))));
  const P = Array.isArray(side) ? side : (window.CARDPOS || {})[key];   // a fixed [dx, dy] side stake wins over the solver
  if (P) { const [dx, dy] = P, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, hostRect = typeof id === "string";
    w.style.left = "50%"; w.style.top = hostRect ? "18px" : "0px";
    Object.assign(card.style, { left: (dx - 38).toFixed(1) + "px", top: (dy - 59).toFixed(1) + "px", bottom: "auto" });
    Object.assign(stake.style, { left: (ux * 20).toFixed(1) + "px", top: (uy * 20).toFixed(1) + "px", bottom: "auto", width: Math.max(4, L - 20).toFixed(1) + "px", height: "1.5px", transformOrigin: "0 0", transform: `rotate(${(Math.atan2(dy, dx) * 180 / Math.PI).toFixed(1)}deg)` }); }
  card.style.zIndex = "2"; card.classList.add("pcard"); stake.classList.add("pstake");
  (window.__CARDS = window.__CARDS || []).push({ key, fixed: Array.isArray(side) ? side : null, t, until, card, stake, unit: typeof id === "string" ? B.units[id].el.querySelector(".blk") : id.firstElementChild });
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 });
  const tg = typeof id === "string" ? B.units[id].el.querySelector(".tag") : null;
  if (tg) { if (t <= 0.05) gsap.set(tg, { autoAlpha: 0 }); tl.to(tg, { autoAlpha: 0, duration: 0.2 }, Math.max(0, t - 0.1)); tl.to(tg, { autoAlpha: 1, duration: 0.3 }, until + 0.2); }
  if (t <= 0.05) gsap.set(w, { autoAlpha: 1 }); else tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t);
  tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); return w; };
// (6) powder smoke puffs at the firing beats (visual only; the locked shot sounds stay as they are)
const SMK = document.createElementNS(NSs, "filter"); SMK.setAttribute("id", "smkblur"); SMK.innerHTML = '<feGaussianBlur stdDeviation="1.6"/>';
{ let defs = OVL.querySelector("defs"); if (!defs) { defs = document.createElementNS(NSs, "defs"); OVL.insertBefore(defs, OVL.firstChild); } defs.appendChild(SMK); }
const smoke = (pts, t, k = 1) => pts.slice(0, 5).forEach((q, i) => { const e = document.createElementNS(NSs, "ellipse");
  Object.entries({ cx: q[0], cy: q[1], rx: 5.5 * k, ry: 4 * k, fill: "#6e6a5c", opacity: 0, filter: "url(#smkblur)" }).forEach(([kk, v]) => e.setAttribute(kk, v)); OVL.appendChild(e);
  const t0 = t + i * 0.25; tl.to(e, { opacity: 0.55, duration: 0.4 }, t0); tl.to(e, { attr: { cx: q[0] + 10 * k, cy: q[1] - 3 * k, rx: 9 * k, ry: 6 * k }, duration: 3.6, ease: "sine.out" }, t0);
  tl.to(e, { opacity: 0, duration: 1.4 }, t0 + 2.4); });
// (7) side-view profile strip, once per move on the terrain beat (inner = svg body drawn in a 480 x 124 box)
const profileStrip = (inner, t, until) => scr(`<div style="width:480px;height:124px;background:rgba(233,223,198,.95);border:1.5px solid #463a1e;box-shadow:0 8px 20px rgba(0,0,0,.5)">
  <svg width="480" height="124" viewBox="0 0 480 124">${inner}</svg></div>`, "left:56px;bottom:56px;", t, Math.min(until, t + 3.5));
// (8) unit name tags only from the moment the name is spoken (null = never in this scene)
const tagAt = (id, t) => { const tg = B.units[id] && B.units[id].el.querySelector(".tag"); if (!tg) return; gsap.set(tg, { autoAlpha: 0 }); if (t != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, t); };
// (9) time-of-day light (cool morning, warm 4 PM) and small ink crosses where an attack broke
const todDiv = (bg) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;inset:0;pointer-events:none;opacity:0;background:${bg};mix-blend-mode:soft-light`; document.getElementById("scene").insertBefore(d, document.getElementById("fx")); return d; };
const crosses = (pts, t, until, a = 3.6) => pts.forEach((q, i) => { const g = document.createElementNS(NSs, "path");
  g.setAttribute("d", `M${q[0] - a} ${q[1] - a} L${q[0] + a} ${q[1] + a} M${q[0] + a} ${q[1] - a} L${q[0] - a} ${q[1] + a}`);
  Object.entries({ stroke: "#322c14", "stroke-width": 0.7 * a / 3.6, "stroke-linecap": "round", fill: "none", opacity: 0 }).forEach(([k, v]) => g.setAttribute(k, v)); OVL.appendChild(g);
  tl.to(g, { opacity: 0.7, duration: 0.3 }, t + i * 0.15); tl.to(g, { opacity: 0, duration: 0.6 }, until); });
const nowU = (...ids) => ids.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));   // a unit already on the map at t = 0
// water on the Style W map (floodwater, backwater): the map's own water colour, soft edge, world space
const water = (p, rx, ry, rot, t, until, op = 1) => { const el = pinS(GG.pin(`<div style="width:${rx * 2}px;height:${ry * 2}px;border-radius:50%;opacity:${op};transform:rotate(${rot}deg);background:radial-gradient(ellipse at center, rgba(77,125,154,.92) 0%, rgba(77,125,154,.88) 52%, rgba(77,125,154,0) 71%)"></div>`, p[0], p[1], { t: t > 0 ? t : null, until }));
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };
// ---------- end of kit ----------
// @@END-KIT

const P9 = "m1-9", PS = "move1-sub";
const T_TWO = at(P9, "Two river forts had fallen"), T_TEN = at(P9, "in ten days"), T_GONE = at(P9, "Grant had gone from"), T_SNUB = at(P9, "a snubbed brigadier"),
  T_TALK = at(P9, "the man the whole North"), T_BOATS = at(P9, "The Union gunboats could now"), T_INTO = at(P9, "far into Tennessee"),
  T_FALL = at(P9, "The Confederates had to fall back"), T_KY = at(P9, "from Kentucky"), T_MIDT = at(P9, "much of middle Tennessee"),
  T_WAIT = at(P9, "Grant had not won by waiting"), T_FAST = at(P9, "He moved fast"), T_HIT2 = at(P9, "hit the second fort"), T_ATT = at(P9, "attacked the moment");
const T_ONLY = at(PS, "Donelson was only the beginning"), T_HOW = at(PS, "So how do you take a fortress"), T_BLUFF = at(PS, "built on a high bluff"),
  T_RIVER = at(PS, "the river that carries your supplies"), T_GUNS = at(PS, "runs right under its guns"), T_KIND = at(PS, "That's the kind of question"),
  T_SUBS = at(PS, "and subscribing is how"), T_HERE = at(PS, "Here's how Grant did it");
// ---------- places (tennessee map px, tools/m1_proj.py) ----------
const FH = [1402, 895], FD = [1462, 906], CLK = [1637, 888], NSH = [1848, 1054], BG = [1957, 689], COL = [1002, 783], PAD = [1186, 636], CAI = [976, 672];
// the rivers as drawn on tennessee_w (tools/stylew_ten/main_rivers.json, map px)
const TENN_S = [[1205, 649], [1266, 646], [1323, 692], [1352, 756], [1378, 820], [1390, 884], [1396, 948], [1424, 1012], [1427, 1076], [1404, 1140], [1420, 1195], [1392, 1259], [1404, 1322], [1401, 1385], [1363, 1400], [1327, 1449], [1336, 1532], [1336, 1612]];
const CUMB_E = [[1253, 606], [1324, 624], [1353, 668], [1393, 693], [1412, 757], [1433, 820], [1448, 882], [1473, 902], [1505, 917], [1533, 946], [1565, 927], [1597, 924], [1618, 893], [1657, 910], [1683, 974], [1744, 1010], [1802, 1043], [1843, 1038]];
// ---------- map: option 1 (16 Feb -> March 1862, E2 pale-first) ----------
hand("assets/media/gn_ten_ctl_marcap_mx.png", T_KY + 0.6, 3.6);   // the ground given up (Kentucky + middle Tennessee): wide view, stronger hatch
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.14 });
camera([[0, 1430, 900, 2.1], [T_TEN + 0.6, 1440, 905, 1.9], [T_TALK, 1500, 930, 1.6], [T_INTO + 0.6, 1520, 1000, 1.05], [T_KY + 0.8, 1470, 920, 0.85],
  [T_MIDT + 1.2, 1460, 940, 0.82], [T_ONLY, 1400, 960, 0.9], [T_HOW + 2.5, 1000, 1250, 1.25], [END, 980, 1270, 1.3]]);
dateNow("16 FEBRUARY 1862");   // critic r2: one date only (no other date is spoken in this scene)
// ---------- flags ----------
flagS(FL.us, 1430, 820, 0, T_TALK + 0.5); flagS(FL.cs, 1500, 1010, 0, T_TALK + 0.5);
flagS(FL.us, 1440, 700, T_TALK + 0.3, END + 1); flagS(FL.cs, 1300, 1410, T_TALK + 0.4, T_HOW + 1.8);   // clear of the method card
flagS(FL.cs, 860, 1380, T_HOW + 1.6, END + 1);
// ---------- the two forts, both Union now ----------
[FH, FD].forEach((p, k) => { fortIcon(p, 0, null, { s: 20, col: "#4f8bff" }); });
B.caption("TWO RIVER FORTS · TEN DAYS", T_TEN, T_TEN + 2.6, "carth");
const GB = badge({ name: "GRANT", role: "", initials: "USG", photo: PHOTO("grant"), flag: FL.us, side: "carth", corner: "tr", t: T_SNUB - 0.1, until: T_SNUB + 3.3 });   // no unit of his on this map
// ---------- the rivers open: the gunboats steam far into Tennessee ----------
glowPath(TENN_S.slice(5, 14), "", 0, T_INTO - 0.2, T_INTO + 3.3, 0, 0, { focus: false });   // ink trace along both rivers, deep into Tennessee
glowPath(CUMB_E.slice(7), "", 0, T_INTO, T_INTO + 3.4, 0, 0, { focus: false });
const GT = ship("iron", "carth", TENN_S[5], 90, null, null, { L: 46 }); tl.set(GT.el, { autoAlpha: 1 }, 0); tl.to(GT.el, { autoAlpha: 0, duration: 0.5 }, T_HOW + 1.0);   // on the river from frame 0 sail(GT, TENN_S.slice(5, 14), T_BOATS + 0.2, 9.0, 24);
const GC = ship("iron", "carth", CUMB_E[7], 20, null, null, { L: 46 }); tl.set(GC.el, { autoAlpha: 1 }, 0); tl.to(GC.el, { autoAlpha: 0, duration: 0.5 }, T_HOW + 1.0); sail(GC, CUMB_E.slice(7), T_BOATS + 0.5, 8.0, 24);
curveLabel("Tennessee River", [[1446, 1150], [1440, 1230], [1428, 1300]], T_BOATS + 0.4, T_BOATS + 3.8, 22);
// ---------- the Kentucky line collapses ----------
const KYL = glowPath([COL, [1200, 840], FH, FD, [1700, 830], BG], "", 0, T_FALL, T_FALL + 3.4);   // the old Kentucky line: focus + ink trace
boxS("KENTUCKY", 1640, 560, T_KY, null, { size: 30 }); boxS("MIDDLE TENNESSEE", 1500, 1250, T_MIDT, null, { size: 30 });
[[BG, [1880, 900], [1840, 1060], [1880, 1300]], [COL, [990, 900], [960, 1050]], [[1840, 1060], [1860, 1220], [1900, 1380]]].forEach((pts, k) =>
  arw({ pts, side: "rome", t: T_FALL + 0.2 + k * 0.5, dur: 2.2, width: AW(0.85, 10), until: T_FALL + 7.0 }));
[["r1", BG, [1880, 1330], T_FALL - 0.4], ["r2", COL, [960, 1060], T_TALK], ["r3", [1600, 1040], [1720, 1330]]].forEach(([id, a, b, t0], k) => { unitS(id, "rome", a, "infantry", null, { t: t0 || 0, size: "XXX" }); B.move(id, T_FALL + 0.4 + k * 0.5, 4.0, b[0], b[1]); });
hideU(["r1", "r2", "r3"], T_WAIT);   // they have fallen back off the stage before the method card
// ---------- method card: line 1 lit on "attacked the moment the enemy hesitated" ----------
GG.METHOD_TITLE = "GRANT'S METHOD";
GG.METHOD = ["HE MOVED FAST", "HIT THE SECOND FORT BEFORE HELP COULD COME", "ATTACKED THE MOMENT THE ENEMY HESITATED"];   // spoken words only (m1-9)
const MC = GG.method(3, T_FAST - 0.1, T_ATT + 3.0, [T_FAST, T_HIT2, T_ATT]);   // holds ~3 s after line 3
MC.style.top = "600px"; MC.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "32px"; r.style.lineHeight = "1.25"; }); { const inr = MC.querySelector(".inner"); if (inr) inr.style.padding = "14px 34px 16px"; }   // critic r2: <= 25 % of the frame
SFX("ref:pop", T_FAST + 0.1); SFX("ref:pop", T_HIT2 + 0.1); SFX("ref:boom", T_ATT + 0.2);
// ---------- move1-sub: only the beginning; the question (dark-to-bluff transition); subscribe; NEXT ----------
const DK = document.createElement("div"); DK.style.cssText = "position:absolute;inset:0;background:url(assets/media/m1f_bluff_w.jpg) center / cover no-repeat;pointer-events:none";   // critic r2: the question scene on the REAL Style W map (crop of vicksburg_siege_w: the river bend under the hachured bluff)
document.getElementById("fx").appendChild(DK); gsap.set(DK, { autoAlpha: 0 }); tl.to(DK, { autoAlpha: 1, duration: 1.6, ease: "sine.inOut" }, T_HOW - 0.2);
// overlays in the crop's screen px: an ink trace along the bluff crest on "high bluff", guns on the crest on "under its guns"
const BLF = "M 1333 168 L 1293 355 L 1267 541 L 1213 728 L 1147 861 L 1067 1008";
const BS = scr(`<svg width="1920" height="1080" viewBox="0 0 1920 1080" style="display:block">
  <path class="bl" d="${BLF}" fill="none" stroke="#463a1e" stroke-width="3" stroke-linecap="round" stroke-dasharray="1400" stroke-dashoffset="1400" opacity="0"/>
  <g class="guns">${[[1372, 250], [1342, 420], [1312, 590], [1263, 740], [1196, 890]].map(([x, y]) => `<g transform="translate(${x} ${y})"><rect x="-27" y="-18" width="54" height="36" fill="#c4121f" stroke="#1a1712" stroke-width="2"/><circle cx="0" cy="0" r="7" fill="#f7f3ea"/><circle class="fl" cx="-36" cy="0" r="13" fill="#ffd27a" opacity="0"/></g>`).join("")}</g>
  </svg>`, "left:0;top:0;width:1920px;height:1080px;", T_HOW + 0.4, END + 1, { autoAlpha: 0 });
gsap.set(BS.querySelector(".guns"), { autoAlpha: 0 });
{ const bl = BS.querySelector(".bl"); tl.to(bl, { opacity: 0.75, duration: 0.2 }, T_BLUFF); tl.to(bl, { attr: { "stroke-dashoffset": 0 }, duration: 1.0, ease: "sine.out" }, T_BLUFF); tl.to(bl, { opacity: 0, duration: 0.8 }, T_BLUFF + 3.2); }
const FLB = flag(FL.cs, 0, 0, null, null, 48); SCN.insertBefore(FLB, document.getElementById("credit")); FLB.classList.remove("gg-pin");
Object.assign(FLB.style, { position: "absolute", left: "1560px", top: "430px" }); gsap.set(FLB, { autoAlpha: 0, xPercent: 0, yPercent: 0 }); tl.to(FLB, { autoAlpha: 1, duration: 0.5 }, T_HOW + 0.4);   // both flags from the cut
const FLU = flag(FL.us, 0, 0, null, null, 48); SCN.insertBefore(FLU, document.getElementById("credit")); FLU.classList.remove("gg-pin");
Object.assign(FLU.style, { position: "absolute", left: "420px", top: "640px" }); gsap.set(FLU, { autoAlpha: 0, xPercent: 0, yPercent: 0 }); tl.to(FLU, { autoAlpha: 1, duration: 0.5 }, T_HOW + 0.4);
{ const c = B.caption("A FORTRESS ON A HIGH BLUFF", T_BLUFF, T_BLUFF + 2.6, "rome"); Object.assign(c.style, { justifyContent: "flex-start", paddingLeft: "90px" }); }   // empty ground west of the river
// the supply steamer (blue) comes down the river, right under the guns
const SUP = document.createElement("div"); SUP.style.cssText = "position:absolute;left:0;top:0;width:0;height:0"; SUP.innerHTML = `<div style="position:absolute;left:-55px;top:-19px;width:110px">${shipSVG("steamer", "carth", 110)}</div>`;
SCN.insertBefore(SUP, document.getElementById("credit")); gsap.set(SUP, { autoAlpha: 0 });
const RP = [[800, 168], [1040, 261], [1187, 355], [1147, 488], [1040, 675], [907, 808], [827, 968], [787, 1120]];   // the river in the crop
tl.set(SUP, { left: RP[0][0], top: RP[0][1] }, 0); tl.to(SUP, { autoAlpha: 1, duration: 0.5 }, T_HOW + 0.4);   // the supply steamer on the river from the cut
for (let k = 1; k <= 24; k++) { const a = posOn(RP, (k - 1) / 24), b = posOn(RP, k / 24), tt = T_RIVER - 0.2 + (k - 1) * 0.3;
  tl.to(SUP, { left: b[0], top: b[1], duration: 0.3, ease: "none" }, tt); tl.to(SUP.firstElementChild, { rotation: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, duration: 0.3, ease: "none" }, tt); }
tl.to(SUP, { autoAlpha: 0, duration: 0.6 }, END - 0.4);
tl.to(BS.querySelector(".guns"), { autoAlpha: 1, duration: 0.4 }, T_HOW + 0.4);   // batteries from the cut; they fire on "under its guns"
[...BS.querySelectorAll(".fl")].forEach((f, k) => { [0, 1.6, 3.2].forEach((d) => { const t = T_GUNS + 0.2 + k * 0.28 + d;
  tl.fromTo(f, { opacity: 1, scale: 0.4 }, { opacity: 0, scale: 1.6, duration: 0.35, immediateRender: false, transformOrigin: "50% 50%" }, t); if (d === 0) SFX("fire", t); }); });
// woven subscribe: small button bottom-right, cursor click, bell; never a full-screen card
const E = EngageK(B); E.subscribe(T_SUBS - 1.0, T_HERE + 0.2);
// critic r1: no "NEXT: MOVE 2" label (never spoken)
SFX("ref:pop", T_HERE + 0.3);
// ---------- clean screen ----------
fixImgs();
K.raiseTerritory();
B.finish();
