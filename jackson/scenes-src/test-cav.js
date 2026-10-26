// TEST (owner to approve): the NEW cavalry counter icon (scenes-src/cavalry_icon.js) next to the locked infantry + artillery counters,
// both sides, at a big size and at the map size used in the scenes. Not part of the video (test- prefix: sfx_cues.py skips it).
// Built with: python3 tools/build_scene.py test-cav valley_hd_ref move1-6 move1-6
const B = Battle();
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
// @kit-begin
// MOVE 1 shared helpers (Jackson #11; pasted into move1a..e by tools/make_valley_inline.py between the @kit markers; edit HERE).
// Collins / Rokossovsky / Peng kit + the NEW cavalry icon (scenes-src/cavalry_icon.js).
const FL = { csa: "assets/media/csa1_13_flag.png", us: "assets/media/us34_flag.png" };
const HEAD = { jackson: "assets/media/jackson_head.png", banks: "assets/media/banks_head.png", fremont: "assets/media/fremont_head.png",
  shields: "assets/media/shields_head.png", mcdowell: "assets/media/mcdowell_head.png", lincoln: "assets/media/lincoln_head.png", lee: "assets/media/lee_head.png" };
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.pop !== false) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.24em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.6).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const town = (txt, q, t, o = {}) => { B.city("", q[0], q[1], { r: o.r || 5, t, until: o.until }); return box(txt, q[0] + (o.dx || 0), q[1] + (o.dy != null ? o.dy : -20), t, o.size || 13, o.until, { pop: o.pop }); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${Math.round(w * 0.05)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(1, Math.round(w / 40))}px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${Math.round(w * 0.2)}px;color:#f7f3ea;text-shadow:0 2px 4px #000;white-space:nowrap">${name}</div></div>`, x, y, { t, until });
const unit = (id, side, x, y, icon, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 36, h: o.h || 24, t: o.t, label: o.label });
  K.counter(id, { icon: icon === "cavalry" ? "infantry" : icon, flag: o.flag || (side === "carth" ? FL.csa : FL.us), size: o.size });
  if (icon === "cavalry") cavIcon(id, { flip: o.flip });
  if (o.ts && o.label) { const tg = B.units[id].el.querySelector(".tag"); tg.style.fontSize = o.ts + "px"; tg.style.padding = `0 ${o.ts * 0.4}px`; tg.style.marginTop = o.ts * 0.2 + "px"; }
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(4, Math.round(size / 9))}px solid ${c};padding:4px 22px 6px;background:rgba(14,12,10,0.72);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.3)}px;letter-spacing:0.22em;color:#f7f3ea;margin-top:2px">${sub}</div>` : ""}</div>`;
const stamp = (txt, t, until, o = {}) => slam(scr(stampHTML(txt, o.c || "#e3232f", o.size || 76, o.rot || -5, o.sub), `left:0;right:0;top:${o.top || 640}px;display:flex;justify-content:center;`), t, { shake: o.shake || 5, until });
// legend top-centre: option 1 = colour squares, option 2 = two short glowing lines
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "CONFEDERATE"], ["#be3a2a", "#bc2528", "UNION"]].map(([sq, ln, nm]) => opt2
  ? `<span><b style="display:inline-block;width:34px;height:7px;background:${ln};vertical-align:4px;margin-right:9px;border-radius:4px;box-shadow:0 0 9px ${ln},0 0 3px ${ln}"></b>${nm}</span>`
  : `<span><b style="display:inline-block;width:20px;height:20px;background:${sq};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const wimg = (src, t, dIn, tOut, o = {}) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px" }); if (o.mx) el.style.mixBlendMode = "multiply";
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (t > 0) { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: o.a || 1, duration: dIn, immediateRender: false }, t); }
  else if (o.a) gsap.set(el, { autoAlpha: o.a });
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: o.outDur || 1.0 }, tOut);
  return el;
};
const arrow = (side, pts, t, o = {}) => B.arrow({ side, pts, t, dur: o.dur || 1.4, width: Math.round((o.w || 12) * 0.7), until: o.until, dash: o.dash });
const walk = (id, pts, t, dur) => { const n = pts.length - 1; pts.slice(1).forEach((q, i) => B.move(id, t + (dur * i) / n, dur / n, q[0], q[1], "none")); };
const trail = (pts, t, dur, until, col = "#9fc0ea", w = 4) => B.line(pts, { t, dur, until, dash: "3 9", width: w, color: col });
const glowLine = (pts, col, t, until, w = 14, op = 0.85) => {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "path");
  g.setAttribute("d", "M" + pts.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" L")); g.setAttribute("fill", "none");
  g.setAttribute("stroke", col); g.setAttribute("stroke-width", w); g.setAttribute("stroke-linecap", "round"); g.setAttribute("stroke-linejoin", "round");
  g.style.filter = `drop-shadow(0 0 ${w * 0.8}px ${col})`; document.getElementById("overlay").appendChild(g);
  gsap.set(g, { opacity: 0 }); tl.to(g, { opacity: op, duration: 0.8 }, t);
  tl.to(g, { opacity: op * 0.55, duration: 0.9, yoyo: true, repeat: Math.max(1, Math.round((until - t - 1) / 0.9)), ease: "sine.inOut" }, t + 0.8);
  tl.to(g, { opacity: 0, duration: 0.6 }, until); return g;
};
const resampleN = (pts, n) => { const seg = [0]; for (let i = 1; i < pts.length; i++) seg.push(seg[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const out = []; for (let k = 0; k < n; k++) { const d = (seg[seg.length - 1] * k) / (n - 1); let j = 1; while (j < seg.length - 1 && seg[j] < d) j++;
    const f = (d - seg[j - 1]) / ((seg[j] - seg[j - 1]) || 1); out.push([pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * f, pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * f]); } return out; };
// artillery shot: the gun fires (quiet), shell arc, the impact carries the boom + the locked shake (never switched off)
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 0.9;
  GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.6, h: o.h, impact: false });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 7, puffs: 2 });
};
// burning place / bridge: fire glow + a continuous smoke column (K.smoke repeated)
const burn = (x, y, t, until, o = {}) => {
  const r = o.r || 12;
  const f = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,#fff3c0 0%,#ffb030 30%,rgba(255,80,10,0.7) 55%,rgba(200,40,0,0) 72%)"></div>`, x, y, {});
  tl.fromTo(f, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.4, immediateRender: false }, t);
  tl.to(f, { scale: 1.25, duration: 0.35, yoyo: true, repeat: Math.max(1, Math.round((until - t) / 0.35)), ease: "sine.inOut" }, t + 0.4);
  tl.to(f, { autoAlpha: 0, duration: 0.8 }, until);
  for (let tt = t + 0.1; tt < until - 1; tt += 0.9) K.smoke(x, y - r * 0.3, tt, { n: 2, r: r * 0.9, rise: r * 3.5, life: 2.6, alpha: 0.75 });
  if (o.sfx !== false) SFX("ref:boom", t);
};
// count card: rows [label, value-html, colour]
const countCard = (rows, t, until, top = 230, cls = "tr") => {
  const el = GG.card(`<div style="display:flex;gap:56px">${rows.map((r, i) => `<div style="text-align:center"><div class="nv${i}" style="font-size:60px;font-weight:700;letter-spacing:0.04em;line-height:1;color:${r[2] || "#f7f3ea"}">${r[1]}</div><div style="font-size:19px;letter-spacing:0.3em;color:#c9b48a;margin-top:6px">${r[0]}</div></div>`).join("")}</div>`, cls, top, t, until);
  SFX("hit", t + 0.2); return el;
};
// tick a number up inside an element (".nvI" of a countCard)
const tickUp = (el, from, to, t0, t1, fmt = (v) => "~" + v.toLocaleString("en-US")) => {
  const v = { v: 0 }; tl.to(v, { v: 1, duration: t1 - t0, ease: "power1.inOut", onUpdate: () => { el.textContent = fmt(Math.round((from + (to - from) * v.v) / 100) * 100); } }, t0);
  for (let k = 0; k < 8; k++) SFX("tick", t0 + ((t1 - t0) * k) / 8);
};
const badge = (o) => K.badge(Object.assign({ flag: o.side === "rome" ? FL.us : FL.csa }, o));
// NEW cavalry counter icon (Jackson #11, MOVE 1 agent; TEST, owner to approve): side-view horse + rider silhouette (galloping right,
// rider with a raised sabre), same counter style as the locked infantry X / artillery howitzer / tank silhouettes in lib/fx.js
// (ink #f7f3ea on the side colour, flag chip + size mark from K.counter). Copy these lines into your scene file:
//   unit("stuart", "carth", x, y, "infantry", {...});  cavIcon("stuart");      // or: K.counter(id, {icon:"infantry", flag, size}); cavIcon(id);
// Mirror (gallop LEFT, e.g. a retreat or a westward ride): cavIcon(id, { flip: true }).
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
const cavIcon = (id, o = {}) => {
  const sv = B.units[id].el.querySelector(".blk svg");
  sv.setAttribute("viewBox", "0 0 100 80"); sv.setAttribute("preserveAspectRatio", "xMidYMid meet");
  sv.innerHTML = o.flip ? `<g transform="translate(100 0) scale(-1 1)">${CAV_SVG}</g>` : CAV_SVG;
};
// @kit-end
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.18 });
B.camera([[0, 1300, 1000, 1.0], [END, 1300, 1000, 1.0]]);
const T0 = 0.3;
GG.card(`<div style="text-align:center;font-size:40px;font-weight:700;letter-spacing:0.08em">NEW: CAVALRY ICON <span style="color:#c9b48a">(TEST, OWNER TO APPROVE)</span></div>`, "", 120, T0, null);
const COLS = [["infantry", "INFANTRY (LOCKED)"], ["artillery", "ARTILLERY (LOCKED)"], ["cavalry", "CAVALRY (NEW)"]];
COLS.forEach(([ic, lab], i) => {
  const x = 1010 + i * 190;
  unit("bb" + i, "carth", x, 920, ic, { t: T0, size: "X", w: 120, h: 80, label: i === 2 ? "STUART" : undefined, ts: 22 });
  unit("rb" + i, "rome", x, 1120, ic, { t: T0, size: "X", w: 120, h: 80, label: i === 2 ? "PLEASONTON" : undefined, ts: 22, flip: ic === "cavalry" });
  GG.lbl(lab, x, 830, { size: 18, color: "#f7f3ea", t: T0 });
  unit("bs" + i, "carth", 1510 + i * 46, 950, ic, { t: T0, size: "", w: 30, h: 20 });
  unit("rs" + i, "rome", 1510 + i * 46, 1120, ic, { t: T0, size: "", w: 30, h: 20, flip: ic === "cavalry" });
});
GG.lbl("SCENE SIZE", 1556, 880, { size: 16, color: "#c9b48a", t: T0 });
GG.lbl("CONFEDERATE", 800, 920, { size: 20, color: "#9fc0ea", t: T0 }); GG.lbl("UNION", 800, 1120, { size: 20, color: "#ff8a8a", t: T0 });
GG.lbl("red cavalry shown mirrored (cavIcon(id, { flip: true })) = riding west", 1300, 1250, { size: 15, color: "#d8cfb8", t: T0 });
document.getElementById("date").style.display = "none";
B.finish();
