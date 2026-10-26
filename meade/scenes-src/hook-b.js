// HOOK-B (hook-4), George G. Meade #12. Basemap penn_hd_ref (z9, 39.40N 77.60W). THE LOCKED HOOK (STYLE_LOCK 1a; jackson/rokossovsky hook-b kit).
// Built with: python3 tools/build_scene.py hook-b penn_hd_ref hook-4 hook-4
// Dark frame 0 (continuity with the dark twist): the "?" badge turns into the real photo, GEORGE G. MEADE slams in; the badge flies to
// the corner over the overview Fredericksburg -> Gettysburg (option 1, penn_ctl_jul63), IN 7 MONTHS; three snap cuts (whoosh + hit;
// each a crop of a close basemap placed in the penn world at the real place, tools/make_hook_insets.py; option 2 glowing lines):
// FREDERICKSBURG 13 DEC 1862 (blue column into the gap in Jackson's railroad line, fog), GETTYSBURG 2 JULY 1863 (blue arrows along
// the inside of the fishhook, Longstreet hits the left), GETTYSBURG 3 JULY 1863 (red lines break at the stone wall, THE NIGHT BEFORE,
// HE CALLED IT); pull-out to the numbered rings, title card (riser + boom). Previews only: the move agents build the full versions.
// Facts: research/FACT_NOTES.md; control: research/FACT_NOTES_penn.md.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
{ const _arrow = B.arrow; B.arrow = (o) => { const g = _arrow(o); if ((o.width || 22) < 10) { const ps = g.querySelectorAll("path"); ps[0].setAttribute("stroke-width", (o.width * 1.45 + 1).toFixed(1)); const pg = g.querySelector("polygon"); if (pg) pg.setAttribute("stroke-width", Math.min(1, o.width * 0.25)); } return g; }; }   // thin casing on zoomed-in arrows
// SIDES (Meade #12): Union = hero = blue = "carth"; Confederate = red = "rome". Flags A1: US 34-star / Confederate First National.
const FL = { us: "assets/media/us34_flag.png", csa: "assets/media/csa1_13_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
// ---------- helpers (Rokossovsky / jackson hook kit, sides swapped) ----------
const box = (txt, x, y, t, size = 16, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); const el = GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${(size * 0.2).toFixed(2)}px ${(size * 0.35).toFixed(2)}px ${(size * 0.2).toFixed(2)}px ${(size * 0.6).toFixed(2)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${(size * 0.12).toFixed(2)}px ${(size * 0.5).toFixed(2)}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t: t === 0 ? null : t, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const town = (txt, lat, lon, t, o = {}) => { const [x, y] = L(lat, lon); B.city("", x, y, { r: o.r || 4, t, until: o.until }); return box(txt, x + (o.dx || 0), y + (o.dy != null ? o.dy : -14), t, o.size || 9, o.until, false); };
const flag = (src, name, x, y, t, until, w = 76) => { const el = GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(2)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.3, w / 40).toFixed(2)}px solid #1a1712;box-shadow:0 ${(w * 0.03).toFixed(2)}px ${(w * 0.08).toFixed(2)}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.17).toFixed(2)}px;color:#f7f3ea;text-shadow:0 ${(w * 0.02).toFixed(2)}px ${(w * 0.04).toFixed(2)}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t: t === 0 ? null : t, pop: true, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const flags = (s, pU, pC, t, until) => [flag(FL.us, "UNITED STATES", ...pU, t, until, 115 / s), flag(FL.csa, "CONFEDERATE STATES", ...pC, t, until, 115 / s)];
const unitXY = (id, side, x, y, icon, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 34, h: o.h || 23, t: o.t, label: o.label });
  K.counter(id, { icon, flag: o.noFlag ? null : side === "carth" ? FL.us : FL.csa, size: o.size });
  const u = B.units[id], bk = u.el.querySelector(".blk"); bk.style.borderWidth = Math.max(0.3, u.h * 0.1).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg && o.tag) tg.style.fontSize = o.tag + "px";
  if (o.t == null) gsap.set(u.el, { autoAlpha: 1 });
  return id;
};
const go = (id, t, dur, x, y, ease) => B.move(id, t, dur, x, y, ease || "power1.inOut");
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(2, Math.round(size / 9))}px solid ${c};padding:${(size * 0.08).toFixed(1)}px ${(size * 0.42).toFixed(1)}px ${(size * 0.12).toFixed(1)}px;background:rgba(14,12,10,0.72);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.36)}px;letter-spacing:0.22em;color:#d8cfb8">${sub}</div>` : ""}</div>`;
const legend = (t, until, opt2) => { const html = `<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERATE"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`;
  if (t > 0) return GG.card(html, "", 34, t, until);
  const el = document.createElement("div"); el.className = "gg-card"; el.style.top = "34px"; el.innerHTML = `<div class="inner">${html}</div>`;
  scene.insertBefore(el, document.getElementById("credit")); if (until != null) GG.fadeOut(el, until, 0.6); return el; };
const wimg = (src, tIn, dIn, tOut, mx = true, dOut = 0.6, rect = [0, 0, 2880, 1620]) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: rect[0] + "px", top: rect[1] + "px", width: rect[2] + "px", height: rect[3] + "px" }); if (mx) el.style.mixBlendMode = "multiply";
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (tIn > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: true }, tIn);
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: dOut }, tOut);
  return el;
};
const date0 = (text, until) => { const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "32px";
  document.getElementById("date").appendChild(d); if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.3 }, until); };
const CW = 1920, CH = 1080, cam = { cx: 1440, cy: 810, s: 1.0 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// artillery: gun fires (quiet) -> shell arc -> impact (boom + default shake, never switched off)
// shell arc with a casing that scales with the line (GG.arc's fixed +4 px casing is too fat at close zoom)
const arcS = (x1, y1, x2, y2, t, o = {}) => {
  const Lh = Math.hypot(x2 - x1, y2 - y1) || 1, h = o.h != null ? o.h : Lh * 0.35; let nx = (y2 - y1) / Lh, ny = -(x2 - x1) / Lh;
  if (ny > 0.15 || (Math.abs(ny) <= 0.15 && nx > 0)) { nx = -nx; ny = -ny; }
  const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2 + nx * h} ${(y1 + y2) / 2 + ny * h} ${x2} ${y2}`, w = o.width || 1.6, dur = o.dur || 0.6;
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="${w * 2.2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff3c4" stroke-width="${w}" stroke-linecap="round"/>`;
  document.getElementById("overlay").appendChild(g);
  const ps = g.querySelectorAll("path"), len = ps[0].getTotalLength();
  ps.forEach((p) => gsap.set(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len })); gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); tl.to(ps, { strokeDashoffset: 0, duration: dur, ease: "power1.in" }, t); tl.to(g, { autoAlpha: 0, duration: 0.5 }, t + dur + 0.3);
  return g; };
const shell = (x1, y1, x2, y2, t, o = {}) => { K.gun(x1, y1, t, { dx: 0, dy: 0 }); arcS(x1, y1, x2, y2, t + 0.04, { dur: o.fly || 0.6, width: o.w || 1.6, h: o.h }); K.impact(x2, y2, t + (o.fly || 0.6) + 0.04, { r: o.r || 9 }); };
const ux = (id) => [B.units[id].x, B.units[id].y];
// one-colour glowing line (a ridge held by one side; the two-colour band only where the sides touch)
const ridge = (pts, side, t, s, o = {}) => K.front({ pts, sideA: side, sideB: side, t, dur: o.dur || 1.0, width: o.width || 15 / s, until: o.until });
// number card that ticks 0 -> n
const tick = (el, sel, n, t0, t1, fmt) => { const v = { v: 0 }, e = el.querySelector(sel);
  tl.to(v, { v: n, duration: t1 - t0, ease: "power2.out", onUpdate: () => { e.textContent = fmt ? fmt(v.v) : Math.round(v.v).toLocaleString("en-US"); } }, t0);
  for (let t = t0; t < t1 - 0.05; t += 0.13) SFX("tick", t); };
const RED = scr("", "inset:0;background:radial-gradient(ellipse at center, rgba(200,20,30,0) 40%, rgba(200,20,30,0.45) 100%);");
const pulse = (t) => { tl.fromTo(RED, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, t); tl.to(RED, { autoAlpha: 0, duration: 0.5 }, t + 0.08); };
const L = GG.proj(9, 35842, 49095);
// ---------- times (spoken words) ----------
const H = "hook-4";
const T_NAME = at(H, "George Gordon"), T_SEVEN = at(H, "In seven"), T_BROKE = at(H, "broke through"), T_JACK = at(H, "Stonewall"), T_FRED = at(H, "at Fredericksburg"),
  T_HELD = at(H, "held the Union"), T_WORST = at(H, "worst day"), T_GETT = at(H, "at Gettysburg"), T_CALLED = at(H, "and called"), T_FINAL = at(H, "final blow"),
  T_NIGHT = at(H, "the night before"), T_FELL = at(H, "fell."), T_THESE = at(H, "These are"), T_THREE = at(H, "three greatest");
const P = { fred: L(38.303, -77.461), gett: L(39.8309, -77.2311), wash: L(38.895, -77.036) };
// ---------- map (option 1, overview) ----------
const OV = wimg("assets/media/penn_ctl_jul63_mx.png", 0, 0, null, true);
const GEO = wimg("assets/media/penn_geo_ref.png", 0, 0, null, false);
let RIV = []; try { RIV = window.PENN_RIVERS || []; } catch (e) {}
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.2 }); const SB = LV.scaleBar(236.26), NA = LV.north(); gsap.set([SB, NA], { autoAlpha: 0 });
const OVC = [1540, 930], OVS = 1.0;
cam.cx = OVC[0]; cam.cy = OVC[1]; cam.s = OVS; applyCam();
// ---------- the three snap-cut insets: crops of the close basemaps placed at the real places (tools/make_hook_insets.py) ----------
const INS = { fred: { z: 14, ox: 1193563, oy: 1613231, x0: 1022.37, y0: 781.92, w: 1000, at: P.fred },
  getty: { z: 14, ox: 1195859, oy: 1589921, x0: 870.85, y0: 555.28, w: 1150, at: P.gett },
  angle: { z: 15, ox: 2393088, oy: 3180895, x0: 955.2, y0: 299.63, w: 900, at: P.gett } };
const IW = 240, IH = 135, SI = CW / IW;
Object.entries(INS).forEach(([k, o]) => { o.X = o.at[0] - IW / 2; o.Y = o.at[1] - IH / 2; const sp = GG.proj(o.z, o.ox, o.oy);
  o.P = (lat, lon) => { const [x, y] = sp(lat, lon); return [o.X + (x - o.x0) * IW / o.w, o.Y + (y - o.y0) * IW / o.w]; };
  o.el = wimg(`assets/media/hook_inset_${k}.jpg`, 0, 0, null, false, 0.6, [o.X, o.Y, IW, IH]); gsap.set(o.el, { autoAlpha: 0 }); });
// =====================================================================================================================
// dark frame 0 (continuity with the dark twist in hook-a): the "?" badge turns into the real photo, GEORGE G. MEADE slams in
// =====================================================================================================================
const DK = scr("", "inset:0;background:#05070d;"); gsap.set(DK, { autoAlpha: 0.92 });
tl.to(DK, { autoAlpha: 0, duration: 0.7, ease: "power2.out" }, T_SEVEN - 0.2);
const BDG = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:18px">
  <div style="position:relative;width:360px;height:360px;border-radius:50%;overflow:hidden;border:9px solid #f3e7c4;box-shadow:0 0 0 6px #1f4fc4,0 20px 40px rgba(0,0,0,0.75);background:url(${FL.us}) center/cover"><img src="assets/media/meade_head.png" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">
  <div class="q" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,1), rgba(10,12,24,0.94));font-family:Oswald;font-weight:700;font-size:200px;color:#f7f3ea">?</div></div>
  <div class="pl" style="padding:12px 34px 14px;background:rgba(18,16,12,0.94);border-top:6px solid #1f4fc4;color:#f7f3ea;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:60px;letter-spacing:0.08em;line-height:1.1">GEORGE G. MEADE</div><div style="font-size:22px;letter-spacing:0.22em;color:#d8cfb8">UNION GENERAL · 1815 - 1872</div></div></div>`,
  "left:0;right:0;top:170px;display:flex;justify-content:center;transform-origin:50% 25%;");
gsap.set(BDG, { autoAlpha: 1 });
const QM = BDG.querySelector(".q"), PL = BDG.querySelector(".pl"); gsap.set(PL, { autoAlpha: 0 });
tl.to(QM, { autoAlpha: 0, duration: 0.12 }, T_NAME - 0.25); GG.whiteFlash(T_NAME - 0.3); SFX("ref:whoosh", T_NAME - 0.45);
tl.fromTo(PL, { autoAlpha: 0, scale: 1.9 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, T_NAME + 0.1);
SFX("hit", T_NAME + 0.3); K.shake(T_NAME + 0.3, 6, 0.3);
tl.to(BDG, { scale: 0.42, x: -650, y: 480, duration: 0.6, ease: "power3.inOut" }, T_SEVEN);
SFX("ref:whoosh", T_SEVEN - 0.05);
B.showDate(T_SEVEN + 0.1); B.date("DECEMBER 1862 - JULY 1863", T_SEVEN + 0.2, T_BROKE, 30);
legend(T_SEVEN + 0.2, T_BROKE - 0.06, false);
const WFL = flags(OVS, [1960, 720], [1150, 1170], T_SEVEN + 0.3, T_BROKE - 0.06);
const MO = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 24px 12px;background:rgba(18,16,12,0.92);border-left:7px solid #c9b48a;color:#f7f3ea"><div style="font-size:18px;letter-spacing:0.3em;color:#c9b48a">IN</div><div style="font-size:44px;letter-spacing:0.1em">7 MONTHS</div></div>`, "right:110px;top:190px;");
tl.fromTo(MO, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, T_SEVEN + 0.2); tl.to(MO, { autoAlpha: 0, duration: 0.1 }, T_BROKE - 0.06);
SFX("ref:pop", T_SEVEN + 0.25);
const OT = [box("FREDERICKSBURG", P.fred[0] + 70, P.fred[1] + 22, T_SEVEN + 0.4, 11, T_BROKE - 0.06), box("GETTYSBURG", P.gett[0] + 56, P.gett[1] - 16, T_SEVEN + 0.5, 11, T_BROKE - 0.06)];
B.city("", P.gett[0], P.gett[1], { r: 4, t: T_SEVEN + 0.5, until: T_BROKE - 0.06 });
tl.to([SB, NA], { autoAlpha: 1, duration: 0.4 }, T_SEVEN + 0.1); tl.to(SB, { autoAlpha: 0, duration: 0.05 }, T_BROKE - 0.06); tl.to(SB, { autoAlpha: 1, duration: 0.3 }, T_THESE + 0.9);
// hard CUT: a short black frame hides an instant camera jump (whoosh + hit)
const CUTB = scr("", "inset:0;background:#030406;");
const cut = (t, ins, holdTo) => {
  tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  tl.set(ins.el, { autoAlpha: 1 }, t - 0.01); tl.set(ins.el, { autoAlpha: 0 }, holdTo - 0.01);
  camTo(t, 0.01, ins.at[0], ins.at[1], SI); camTo(t + 0.02, holdTo - t - 0.1, ins.at[0] + 3, ins.at[1], SI * 1.05, "sine.out");
  SFX("ref:whoosh", t - 0.2); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25);
};
const k8 = 1 / SI;                       // 1 screen px in world px at the inset zoom
const ib = (txt, p, t, until, sz = 18) => box(txt, p[0], p[1], t, sz * k8, until);
const iu = (id, side, p, t, lab, icon = "infantry") => unitXY(id, side, p[0], p[1], icon, { w: 46 * k8, h: 31 * k8, tag: 15 * k8, label: lab, t });
const ring = (p, name, date, n, t, until, dy = -40) => {
  K.target(p[0], p[1], t, { r: 34 * k8, until });
  GG.pin(`<div style="display:flex;align-items:center;gap:${6 * k8}px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 ${2 * k8}px ${4 * k8}px #000"><span style="display:inline-flex;width:${26 * k8}px;height:${26 * k8}px;border-radius:50%;border:${3 * k8}px solid #ffd54a;align-items:center;justify-content:center;font-size:${15 * k8}px">${n}</span><span style="font-size:${24 * k8}px;letter-spacing:.1em;white-space:nowrap">${name} · ${date}</span></div>`, p[0], p[1] + dy * k8, { t: t + 0.1, pop: true, until });
  SFX("ref:pop", t + 0.12);
};
// ---------- CUT 1: FREDERICKSBURG, 13 DEC 1862: a blue column punches into the wooded gap in Jackson's line, fog drifting ----------
const F = INS.fred;
cut(T_BROKE, F, T_HELD);
legend(T_BROKE + 0.05, T_HELD - 0.05, true);
B.date("13 DECEMBER 1862", T_BROKE + 0.02, T_HELD, 30);
flags(SI, F.P(38.2535, -77.4070), F.P(38.2500, -77.4560), T_BROKE + 0.1, T_HELD - 0.05);
// Jackson's line on the railroad below the wooded ridge (RF&P, OSM alignment), with the 600-yard gap at the tongue of woods
const JN = [F.P(38.2600, -77.4500), F.P(38.2520, -77.4380), F.P(38.2450, -77.4340), F.P(38.2405, -77.4362)];
const JS = [F.P(38.2350, -77.4395), F.P(38.2300, -77.4426), F.P(38.2240, -77.4420), F.P(38.2180, -77.4400)];
ridge(JN, "rome", T_BROKE + 0.05, SI, { dur: 0.4, until: T_HELD + 0.1 }); ridge(JS, "rome", T_BROKE + 0.05, SI, { dur: 0.4, until: T_HELD + 0.1 });
const GAP = F.P(38.2378, -77.4380);
ib("RF&P RAILROAD", F.P(38.2290, -77.4370), T_BROKE + 0.2, T_HELD, 17);
ib("PROSPECT HILL", F.P(38.2255, -77.4500), T_BROKE + 0.25, T_HELD, 17);
ib("JACKSON", F.P(38.2470, -77.4460), T_BROKE + 0.3, T_HELD, 18);
const FR1 = [iu("fj1", "rome", F.P(38.2450, -77.4390), T_BROKE + 0.1), iu("fj2", "rome", F.P(38.2320, -77.4450), T_BROKE + 0.15), iu("fj3", "rome", F.P(38.2370, -77.4480), T_BROKE + 0.2, null)];
const FB = [iu("fm1", "carth", F.P(38.2345, -77.4160), T_BROKE + 0.1, "MEADE"), iu("fm2", "carth", F.P(38.2320, -77.4130), T_BROKE + 0.15), iu("fm3", "carth", F.P(38.2370, -77.4120), T_BROKE + 0.2)];
B.fog(T_BROKE - 0.05, T_HELD - 0.3, 0.32);
const GAPL = ib("THE GAP", [GAP[0] - 14 * k8, GAP[1] - 30 * k8], T_JACK, T_HELD, 15);
K.target(GAP[0], GAP[1], T_JACK - 0.1, { r: 26 * k8, side: "#ffd54a", until: T_HELD });
B.arrow({ pts: [F.P(38.2350, -77.4160), F.P(38.2370, -77.4280), GAP, F.P(38.2385, -77.4440)], side: "carth", t: T_JACK, dur: 1.2, width: 7 * k8, until: T_HELD + 0.1 });
SFX("ref:whoosh", T_JACK + 0.05);
go("fm1", T_JACK + 0.1, 1.3, GAP[0] - 6 * k8, GAP[1], "power1.in"); go("fm2", T_JACK + 0.25, 1.3, GAP[0] + 26 * k8, GAP[1] + 14 * k8, "power1.in");
K.impact(GAP[0] - 30 * k8, GAP[1] - 34 * k8, T_JACK + 0.7, { r: 10 * k8 }); K.impact(GAP[0] - 26 * k8, GAP[1] + 40 * k8, T_JACK + 1.0, { r: 10 * k8 });
B.grey(["fj3"], T_FRED - 0.1, 0.3);
ring(GAP, "FREDERICKSBURG", "DEC 1862", 1, T_FRED, T_HELD, 54);
// ---------- CUT 2: GETTYSBURG, 2 JULY 1863: blue arrows race along the inside of the fishhook to the left flank ----------
const G = INS.getty;
cut(T_HELD, G, T_CALLED);
B.date("2 JULY 1863", T_HELD + 0.02, T_CALLED, 30);
flags(SI, G.P(39.8000, -77.2180), G.P(39.8120, -77.2620), T_HELD + 0.1, T_CALLED - 0.05);
const HOOK = [G.P(39.8150, -77.2120), G.P(39.8195, -77.2190), G.P(39.8225, -77.2235), G.P(39.8215, -77.2290), G.P(39.8180, -77.2335), G.P(39.8126, -77.2361), G.P(39.8060, -77.2365), G.P(39.7990, -77.2370), G.P(39.7917, -77.2367)];
ridge(HOOK, "carth", T_HELD + 0.05, SI, { dur: 0.4, until: T_CALLED + 0.1 });
const OUT2 = [G.P(39.8280, -77.2130), G.P(39.8310, -77.2230), G.P(39.8300, -77.2350), G.P(39.8250, -77.2445), G.P(39.8150, -77.2470), G.P(39.8040, -77.2495), G.P(39.7950, -77.2530)];
ridge(OUT2, "rome", T_HELD + 0.1, SI, { dur: 0.4, until: T_CALLED + 0.1 });
ib("CULP'S HILL", G.P(39.8195, -77.2150), T_HELD + 0.2, T_CALLED, 17); ib("LITTLE ROUND TOP", G.P(39.7900, -77.2300), T_HELD + 0.25, T_CALLED, 17);
ib("CEMETERY RIDGE", G.P(39.8060, -77.2310), T_HELD + 0.3, T_CALLED, 17);
const GB = [iu("gb1", "carth", G.P(39.8190, -77.2200), T_HELD + 0.1), iu("gb2", "carth", G.P(39.8110, -77.2350), T_HELD + 0.15), iu("gb3", "carth", G.P(39.8000, -77.2350), T_HELD + 0.2)];
const GR = [iu("gr1", "rome", G.P(39.7990, -77.2490), T_HELD + 0.1, "LONGSTREET"), iu("gr2", "rome", G.P(39.7930, -77.2460), T_HELD + 0.15)];
// the interior shuffle: three blue arrows along the inside of the hook to the threatened left
[[G.P(39.8170, -77.2200), G.P(39.8120, -77.2290), G.P(39.8020, -77.2320), G.P(39.7950, -77.2340)], [G.P(39.8120, -77.2330), G.P(39.8040, -77.2340), G.P(39.7980, -77.2380)],
  [G.P(39.8100, -77.2250), G.P(39.8000, -77.2290), G.P(39.7930, -77.2330)]].forEach((pts, k) => { B.arrow({ pts, side: "carth", t: T_HELD + 0.4 + k * 0.45, dur: 0.9, width: 6 * k8, until: T_CALLED + 0.1 }); SFX("ref:whoosh", T_HELD + 0.45 + k * 0.45); });
B.arrow({ pts: [G.P(39.8000, -77.2470), G.P(39.7960, -77.2420), G.P(39.7930, -77.2395)], side: "rome", t: T_WORST - 0.3, dur: 0.7, width: 6 * k8, until: T_CALLED + 0.1 });
[0, 0.3, 0.6].forEach((d, k) => K.impact(...G.P(39.7955 + k * 0.002, -77.2400 + k * 0.001), T_WORST + 0.2 + d, { r: 9 * k8 }));
ring(G.P(39.8040, -77.2345), "GETTYSBURG", "2 JULY 1863", 2, T_GETT, T_CALLED, -50);
// ---------- CUT 3: GETTYSBURG, 3 JULY 1863: the red lines break at the stone wall ----------
const A = INS.angle;
cut(T_CALLED, A, T_THESE);
B.date("3 JULY 1863", T_CALLED + 0.02, T_THESE, 30);
flags(SI, A.P(39.8170, -77.2310), A.P(39.8165, -77.2475), T_CALLED + 0.1, T_THESE - 0.05);
const WALL = [A.P(39.8190, -77.2335), A.P(39.8150, -77.2348), A.P(39.8126, -77.2361), A.P(39.8115, -77.2356), A.P(39.8070, -77.2364)];
ridge(WALL, "carth", T_CALLED + 0.05, SI, { dur: 0.4, until: T_THESE + 0.1 });
ib("THE STONE WALL", A.P(39.8140, -77.2310), T_CALLED + 0.2, T_THESE, 17); ib("THE COPSE OF TREES", A.P(39.8105, -77.2318), T_CALLED + 0.25, T_THESE, 17);
const AB = [iu("ab1", "carth", A.P(39.8150, -77.2340), T_CALLED + 0.1), iu("ab2", "carth", A.P(39.8122, -77.2352), T_CALLED + 0.12, null, "artillery"), iu("ab3", "carth", A.P(39.8090, -77.2358), T_CALLED + 0.14)];
const AR0 = [[39.8150, -77.2440], [39.8132, -77.2448], [39.8114, -77.2452], [39.8096, -77.2448], [39.8078, -77.2440]];
const AR = AR0.map((q, k) => iu("ar" + k, "rome", A.P(...q), T_CALLED + 0.1 + k * 0.04, k === 2 ? "PICKETT" : null));
AR.forEach((id, k) => { const [x, y] = A.P(39.8148 - k * 0.0012, -77.2385); go(id, T_CALLED + 0.2, T_NIGHT - T_CALLED - 0.3, x, y, "power1.in"); });
// guns from the wall -> arcs -> impacts in the red lines (shake on every impact), then canister at close range
[0.3, 0.7, 1.1, 1.5].forEach((d, k) => { const [gx, gy] = ux("ab2"); const [tx, ty] = A.P(39.8145 - k * 0.0013, -77.2420 + d * 0.0012); shell(gx, gy, tx, ty, T_CALLED + d, { r: 9 * k8, fly: 0.4, w: 1.4 * k8, h: 20 * k8 }); });
SFX("mg", T_NIGHT - 0.2);
const NB = scr(stampHTML("THE NIGHT BEFORE, HE CALLED IT", "#e8c66a", 40, -3), "right:110px;top:190px;");
slam(NB, T_NIGHT, { shake: 3, until: T_THESE - 0.05 });
// the break: the red counters grey and fall back
const TB = T_FELL - 0.2;
[0, 2, 4].forEach((k) => B.grey(["ar" + k], TB, 0.3));
[1, 3].forEach((k) => { const [x, y] = ux("ar" + k); go("ar" + k, TB + 0.1, 1.0, A.P(39.8130 - k * 0.0008, -77.2440)[0], A.P(39.8130 - k * 0.0008, -77.2440)[1], "power2.out"); });
K.impact(...A.P(39.8128, -77.2380), TB, { r: 12 * k8 });
ring(A.P(39.8126, -77.2361), "GETTYSBURG", "3 JULY 1863", 3, TB + 0.1, T_THESE, -50);
// ---------- pull out to all three, then the title ----------
SFX("ref:whoosh", T_THESE - 0.1); SFX("ref:riser", T_THESE + 0.1);
camTo(T_THESE, 0.9, OVC[0], OVC[1] + 20, OVS, "power3.inOut");
camTo(T_THESE + 0.92, END - T_THESE - 0.9, OVC[0], OVC[1] + 20, OVS * 1.04, "none");
flags(OVS, [1960, 720], [1150, 1170], T_THESE + 0.3, null);
legend(T_THESE + 0.2, null, false);
B.date("1862 - 1863", T_THESE + 0.05, null, 30);
const ringO = (p, lines, n, t, dx, dy) => { K.target(p[0], p[1], t, { r: 26, until: END + 1 });
  GG.pin(`<div style="display:flex;flex-direction:column;gap:4px">${lines.map((l, i) => `<div style="display:flex;align-items:center;gap:6px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 2px 4px #000"><span style="display:inline-flex;width:22px;height:22px;border-radius:50%;border:3px solid #ffd54a;align-items:center;justify-content:center;font-size:13px">${n + i}</span><span style="font-size:18px;letter-spacing:.1em;white-space:nowrap">${l}</span></div>`).join("")}</div>`, p[0] + dx, p[1] + dy, { t: t + 0.15, pop: true }); };
B.city("", P.gett[0], P.gett[1], { r: 4, t: T_THESE + 0.3 }); B.city("", P.fred[0], P.fred[1], { r: 4, t: T_THESE + 0.3 });
ringO(P.fred, ["FREDERICKSBURG · DEC 1862"], 1, T_THESE + 0.25, 150, 0);
ringO(P.gett, ["GETTYSBURG · 2 JULY 1863", "GETTYSBURG · 3 JULY 1863"], 2, T_THESE + 0.45, 250, 10);
tl.to(BDG, { autoAlpha: 0, duration: 0.4 }, T_THREE - 0.6);
const TDIM = scr("", "inset:0;background:linear-gradient(180deg,rgba(5,7,13,0) 35%,rgba(5,7,13,0.78) 75%);");
tl.fromTo(TDIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, T_THREE - 0.5);
const TITLE = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">GEORGE MEADE'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:28px;letter-spacing:0.3em;color:#ffd54a;margin-top:8px">1 FREDERICKSBURG · 2 GETTYSBURG, DAY 2 · 3 GETTYSBURG, DAY 3</div></div>`, "left:0;right:0;top:720px;display:flex;justify-content:center;");
tl.fromTo(TITLE, { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power4.in", immediateRender: false }, T_THREE - 0.26);
SFX("ref:boom", T_THREE); K.shake(T_THREE, 6, 0.4);
K.raiseTerritory();
B.finish();
