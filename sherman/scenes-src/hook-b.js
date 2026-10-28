// HOOK-B (hook-4), William T. Sherman #13. Basemap south_hd_ref (z8, 34.50N 81.50W). THE LOCKED HOOK (STYLE_LOCK 1a; meade hook-b kit).
// Built with: python3 tools/build_scene.py hook-b south_hd_ref hook-4 hook-4
// Dark frame 0 (continuity with the INSANE headline of hook-3): the headline flies off, the "?" badge turns into the real photo,
// WILLIAM TECUMSEH SHERMAN slams in (hit + shake); the badge flies to the corner over the theatre (option 1, south_ctl_apr65), IN LESS
// THAN A YEAR; three snap cuts (whoosh + hit; each a crop of a closer basemap placed in the south world at its real place,
// tools/make_hook_insets.py; option 2 glowing lines): 1 ATLANTA 1864 (blue arrow swinging round the west side onto the railroad at
// Jonesboro, JOHNSTON + HOOD outmanoeuvred), 2 MARCH TO THE SEA 1864 (two blue wings fan toward MACON and AUGUSTA, then on to SAVANNAH),
// 3 THE CAROLINAS 1865 (blue columns on log roads through the flooded swamps); pull-out to the numbered rings, title card (riser + boom).
// Previews only: the move agents build the full versions. Facts: research/FACT_NOTES.md; control: research/FACT_NOTES_south.md.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
{ const _arrow = B.arrow; B.arrow = (o) => { const g = _arrow(o); if ((o.width || 22) < 10) { const ps = g.querySelectorAll("path"); ps[0].setAttribute("stroke-width", (o.width * 1.45 + 1).toFixed(1)); const pg = g.querySelector("polygon"); if (pg) pg.setAttribute("stroke-width", Math.min(1, o.width * 0.25)); } return g; }; }   // thin casing on zoomed-in arrows
// SIDES (Sherman #13): Union = hero = blue = "carth"; Confederate = red = "rome". Flags A1: US 35-star / Confederate First National.
const FL = { us: "assets/media/us35_flag.png", csa: "assets/media/csa1_13_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const box = (txt, x, y, t, size = 16, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); const el = GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${(size * 0.2).toFixed(2)}px ${(size * 0.35).toFixed(2)}px ${(size * 0.2).toFixed(2)}px ${(size * 0.6).toFixed(2)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${(size * 0.12).toFixed(2)}px ${(size * 0.5).toFixed(2)}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t: t === 0 ? null : t, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const flag = (src, name, x, y, t, until, w = 76) => { const el = GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(2)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.3, w / 40).toFixed(2)}px solid #1a1712;box-shadow:0 ${(w * 0.03).toFixed(2)}px ${(w * 0.08).toFixed(2)}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.17).toFixed(2)}px;color:#f7f3ea;text-shadow:0 ${(w * 0.02).toFixed(2)}px ${(w * 0.04).toFixed(2)}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t: t === 0 ? null : t, pop: true, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const flags = (s, pU, pC, t, until) => [flag(FL.us, "UNITED STATES", ...pU, t, until, 115 / s), flag(FL.csa, "CONFEDERATE STATES", ...pC, t, until, 115 / s)];
const unitXY = (id, side, x, y, icon, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 34, h: o.h || 23, t: o.t, label: o.label });
  K.counter(id, { icon, flag: o.noFlag ? null : side === "carth" ? FL.us : FL.csa, size: o.size });
  const u = B.units[id], bk = u.el.querySelector(".blk"); bk.style.borderWidth = Math.max(0.3, u.h * 0.1).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg && o.tag) { tg.style.fontSize = o.tag + "px"; tg.style.marginTop = (o.tag * 0.25).toFixed(2) + "px"; tg.style.padding = `${(o.tag * 0.05).toFixed(2)}px ${(o.tag * 0.45).toFixed(2)}px`; }
  if (o.t == null) gsap.set(u.el, { autoAlpha: 1 });
  return id;
};
const go = (id, t, dur, x, y, ease) => B.move(id, t, dur, x, y, ease || "power1.inOut");
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(2, Math.round(size / 9))}px solid ${c};padding:${(size * 0.08).toFixed(1)}px ${(size * 0.42).toFixed(1)}px ${(size * 0.12).toFixed(1)}px;background:rgba(14,12,10,0.72);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.36)}px;letter-spacing:0.22em;color:#d8cfb8">${sub}</div>` : ""}</div>`;
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02; if (o.sfx !== false) SFX(o.sfx || "hit", tHit); K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until); return el; };
const legend = (t, until, opt2) => { const html = `<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "UNION"], ["#be3a2a", "#bc2528", "CONFEDERATE"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`;
  return GG.card(html, "", 34, t, until); };
const wimg = (src, tIn, dIn, tOut, mx = true, dOut = 0.6, rect = [0, 0, 2880, 1620]) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: rect[0] + "px", top: rect[1] + "px", width: rect[2] + "px", height: rect[3] + "px" }); if (mx) el.style.mixBlendMode = "multiply";
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (tIn > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: true }, tIn);
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: dOut }, tOut);
  return el; };
const CW = 1920, CH = 1080, cam = { cx: 1440, cy: 810, s: 1.0 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const NS = "http://www.w3.org/2000/svg", ov = document.getElementById("overlay");
let FID = 0;   // K.front shares one blur filter sized by the first front: give each front its own (fronts at three scales here)
const frontS = (o) => { const g = K.front(o), id = "hbblur" + (++FID), f = document.createElementNS(NS, "filter");
  f.setAttribute("id", id); f.setAttribute("x", "-20%"); f.setAttribute("y", "-20%"); f.setAttribute("width", "140%"); f.setAttribute("height", "140%");
  f.innerHTML = `<feGaussianBlur stdDeviation="${((o.width || 15) * 0.35).toFixed(2)}"/>`; ov.querySelector("defs").appendChild(f);
  g.querySelectorAll("[filter]").forEach((p) => p.setAttribute("filter", `url(#${id})`)); return g; };
const ridge = (pts, side, t, k, o = {}) => frontS({ pts, sideA: side, sideB: side, t, dur: o.dur || 0.5, width: 15 * k, until: o.until });
const dpath = (pts) => pts.map((q, i) => (i ? "L" : "M") + q[0].toFixed(2) + " " + q[1].toFixed(2)).join(" ");
const rail = (pts, t, k, until, glowT) => { const g = document.createElementNS(NS, "g"), d = dpath(pts);
  g.innerHTML = `<path class="gl" d="${d}" fill="none" stroke="#ffd54a" stroke-width="${9 * k}" stroke-linecap="round" opacity="0" style="filter:blur(${3 * k}px)"/>
    <path d="${d}" fill="none" stroke="#14110c" stroke-width="${3.2 * k}" stroke-linecap="round" opacity="0.9"/><path d="${d}" fill="none" stroke="#d9cfb6" stroke-width="${4.6 * k}" stroke-dasharray="${0.8 * k} ${3.2 * k}" opacity="0.85"/>
    <path d="${d}" fill="none" stroke="#3a342a" stroke-width="${1.3 * k}" stroke-linecap="round"/>`;
  ov.appendChild(g); gsap.set(g, { autoAlpha: 0 }); tl.to(g, { autoAlpha: 1, duration: 0.05 }, t); tl.to(g, { autoAlpha: 0, duration: 0.05 }, until);
  if (glowT != null) tl.to(g.querySelector(".gl"), { opacity: 0.9, duration: 0.3 }, glowT);
  return g; };
const L = GG.proj(8, 16491, 25259);
// ---------- times ----------
const H = "hook-4";
const T_NAME = at(H, "William Tecumseh"), T_LESS = at(H, "In less than a year"), T_OUT = at(H, "outmanoeuvred"), T_TWO = at(H, "two Confederate"),
  T_ALL = at(H, "all the way to Atlanta"), T_VAN = at(H, "vanished into Georgia"), T_SEA = at(H, "came out on the sea"), T_THEN = at(H, "and then marched"),
  T_SWAMP = at(H, "swamps"), T_IMP = at(H, "impassable"), T_WIN = at(H, "middle of winter"), T_THESE = at(H, "These are"), T_THREE = at(H, "three greatest");
const P = { atl: L(33.749, -84.388), sav: L(32.081, -81.091), bennett: L(36.03, -78.98), macon: L(32.841, -83.632), aug: L(33.471, -81.975),
  milledge: L(33.08, -83.23), salke: L(32.95, -81.10), colum: L(34.0, -81.035) };
// ---------- map (option 1 theatre, April 1865 = the end of the story) ----------
const OV = wimg("assets/media/south_ctl_apr65_mx.png", 0, 0, null, true);
const GEO = wimg("assets/media/south_geo_ref.png", 0, 0, null, false);
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.18 }); const SB = LV.scaleBar(503.95), NA = LV.north(); gsap.set([SB, NA], { autoAlpha: 0 });
const OVC = [1330, 830], OVS = 0.80;
cam.cx = OVC[0]; cam.cy = OVC[1]; cam.s = OVS; applyCam();
// ---------- the three insets (crops of the close basemaps at their real places; tools/make_hook_insets.py) ----------
const IJ = { atl: { z: 11, ox: 137758, oy: 209257, x0: 815.46, y0: 354.05, w: 1250, h: 703.12 }, ga: { z: 9, ox: 33985, oy: 52007, x0: 630.85, y0: 367.85, w: 1620, h: 911.25 },
  sc: { z: 9, ox: 35005, oy: 51439, x0: 738.0, y0: 1111.59, w: 640, h: 360.0 } };
const INS = {};
Object.entries(IJ).forEach(([k, o]) => { const f = 2 ** (o.z - 8), sp = GG.proj(o.z, o.ox, o.oy);
  const X = (o.x0 + o.ox) / f - 16491, Y = (o.y0 + o.oy) / f - 25259, W = o.w / f, Hh = o.h / f;
  INS[k] = { X, Y, W, H: Hh, S: CW / W, at: [X + W / 2, Y + Hh / 2], P: (lat, lon) => { const [x, y] = sp(lat, lon); return [X + (x - o.x0) * W / o.w, Y + (y - o.y0) * W / o.w]; } };
  INS[k].el = wimg(`assets/media/hook_inset_${k}.jpg`, 0, 0, null, false, 0.6, [X, Y, W, Hh]); gsap.set(INS[k].el, { autoAlpha: 0 }); });
// =====================================================================================================================
// dark frame 0: the INSANE headline (end of hook-3) flies off; the "?" badge becomes the real photo; WILLIAM TECUMSEH SHERMAN slams
// =====================================================================================================================
const DK = scr("", "inset:0;background:#05070d;"); gsap.set(DK, { autoAlpha: 0.94 });
tl.to(DK, { autoAlpha: 0, duration: 0.7, ease: "power2.out" }, T_LESS - 0.2);
const NEWS = scr(`<div style="width:1180px;background:linear-gradient(180deg,#ece3cc,#d8cba8);color:#16130e;box-shadow:0 30px 60px rgba(0,0,0,.75);padding:22px 40px 26px;transform:rotate(-2deg);font-family:Oswald">
  <div style="display:flex;justify-content:space-between;font-family:'Special Elite',monospace;font-size:18px;color:#3b3224;border-bottom:3px double #3b3224;padding-bottom:6px"><span>CINCINNATI, OHIO</span><span>WEDNESDAY, DECEMBER 11, 1861</span></div>
  <div style="font-weight:700;font-size:118px;letter-spacing:0.02em;line-height:1.02;text-align:center;margin-top:14px">GEN. WILLIAM T. SHERMAN <span style="color:#b0121c">INSANE</span></div>
  <div style="display:flex;gap:26px;margin-top:16px">${[0, 1, 2].map(() => `<div style="flex:1">${[...Array(5)].map((_, i) => `<div style="height:7px;margin:7px 0;background:rgba(40,32,20,${0.18 + (i % 2) * 0.07});width:${92 - (i * 13) % 30}%"></div>`).join("")}</div>`).join("")}</div></div>`,
  "left:0;right:0;top:300px;display:flex;justify-content:center;transform-origin:50% 40%;");
gsap.set(NEWS, { autoAlpha: 1, scale: 1.04 });
tl.to(NEWS, { x: 1500, rotation: 25, autoAlpha: 0, duration: 0.45, ease: "power3.in" }, Math.max(0.2, T_NAME - 0.75)); SFX("ref:whoosh", Math.max(0.2, T_NAME - 0.75));
const BDG = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:18px">
  <div style="position:relative;width:360px;height:360px;border-radius:50%;overflow:hidden;border:9px solid #f3e7c4;box-shadow:0 0 0 6px #1f4fc4,0 20px 40px rgba(0,0,0,0.75);background:url(${FL.us}) center/cover"><img src="assets/media/sherman_head.png" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">
  <div class="q" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,1), rgba(10,12,24,0.94));font-family:Oswald;font-weight:700;font-size:200px;color:#f7f3ea">?</div></div>
  <div class="pl" style="padding:12px 34px 14px;background:rgba(18,16,12,0.94);border-top:6px solid #1f4fc4;color:#f7f3ea;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:60px;letter-spacing:0.08em;line-height:1.1">WILLIAM TECUMSEH SHERMAN</div><div style="font-size:22px;letter-spacing:0.22em;color:#d8cfb8">UNION GENERAL · 1820 - 1891</div></div></div>`,
  "left:0;right:0;top:170px;display:flex;justify-content:center;transform-origin:50% 25%;");
gsap.set(BDG, { autoAlpha: 1, x: -722, y: 404, scale: 0.61 });   // starts where hook-3 left the "?" badge
tl.to(BDG, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power3.inOut" }, Math.max(0.15, T_NAME - 0.6));
const QM = BDG.querySelector(".q"), PL = BDG.querySelector(".pl"); gsap.set(PL, { autoAlpha: 0 });
tl.to(QM, { autoAlpha: 0, duration: 0.12 }, T_NAME - 0.05); SFX("ref:whoosh", T_NAME - 0.2);
tl.fromTo(PL, { autoAlpha: 0, scale: 1.9 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, T_NAME + 0.1);
SFX("hit", T_NAME + 0.3); K.shake(T_NAME + 0.3, 6, 0.3);
tl.to(BDG, { scale: 0.42, x: -650, y: 480, duration: 0.6, ease: "power3.inOut" }, T_LESS);
SFX("ref:whoosh", T_LESS - 0.05);
// the theatre: in less than a year (Sept 1864 - April 1865), rings appear on the three places
B.showDate(T_LESS + 0.1); B.date("1864 - 1865", T_LESS + 0.2, T_TWO, 30);
legend(T_LESS + 0.2, T_TWO - 0.06, false);
const WF = flags(OVS, L(36.05, -85.6), L(33.0, -83.0), T_LESS + 0.3, T_TWO - 0.06);
const YR = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 24px 12px;background:rgba(18,16,12,0.92);border-left:7px solid #c9b48a;color:#f7f3ea"><div style="font-size:18px;letter-spacing:0.3em;color:#c9b48a">IN</div><div style="font-size:44px;letter-spacing:0.1em">LESS THAN A YEAR</div></div>`, "right:110px;top:190px;");
tl.fromTo(YR, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, T_LESS + 0.2); tl.to(YR, { autoAlpha: 0, duration: 0.1 }, T_TWO - 0.06);
SFX("ref:pop", T_LESS + 0.25);
tl.to([SB, NA], { autoAlpha: 1, duration: 0.4 }, T_LESS + 0.1); tl.to(SB, { autoAlpha: 0, duration: 0.05 }, T_TWO - 0.06); tl.to(SB, { autoAlpha: 1, duration: 0.3 }, T_THESE + 0.9);
B.arrow({ pts: [L(35.0, -85.25), L(34.4, -84.95), L(33.85, -84.45)], side: "carth", t: T_LESS + 0.4, dur: 0.9, width: 14, until: T_TWO - 0.06 });
// hard CUT: a short black frame hides an instant camera jump (whoosh + hit)
const CUTB = scr("", "inset:0;background:#030406;");
const cut = (t, ins, holdTo, s = ins.S, c = ins.at) => {
  tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  if (ins.el) { tl.set(ins.el, { autoAlpha: 1 }, t - 0.01); tl.set(ins.el, { autoAlpha: 0 }, holdTo - 0.01); }
  camTo(t, 0.01, c[0], c[1], s); camTo(t + 0.02, holdTo - t - 0.1, c[0] + 0.2 / s * 40, c[1], s * 1.05, "sine.out");
  SFX("ref:whoosh", t - 0.2); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25);
};
const ringN = (p, name, n, t, until, k, dy = -40) => {
  K.target(p[0], p[1], t, { r: 34 * k, until });
  GG.pin(`<div style="display:flex;align-items:center;gap:${6 * k}px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 ${2 * k}px ${4 * k}px #000"><span style="display:inline-flex;width:${30 * k}px;height:${30 * k}px;border-radius:50%;border:${3 * k}px solid #ffd54a;align-items:center;justify-content:center;font-size:${17 * k}px">${n}</span><span style="font-size:${28 * k}px;letter-spacing:.1em;white-space:nowrap">${name}</span></div>`, p[0], p[1] + dy * k, { t: t + 0.1, pop: true, until });
  SFX("ref:pop", t + 0.12); };
// ---------- CUT 1: ATLANTA 1864 (atlanta inset): the swing round the west side onto the Macon & Western at Jonesboro ----------
const A = INS.atl, kA = 1 / A.S;
cut(T_TWO, A, T_VAN);
legend(T_TWO + 0.05, T_VAN - 0.05, true);
B.date("AUGUST 1864", T_TWO + 0.02, T_VAN, 30);
flags(A.S, A.P(33.80, -84.66), A.P(33.60, -84.18), T_TWO + 0.1, T_VAN - 0.05);
const ib = (txt, p, t, until, sz = 18) => box(txt, p[0], p[1], t, sz * kA, until);
const iu = (id, side, p, t, lab, k = kA) => unitXY(id, side, p[0], p[1], "infantry", { w: 46 * k, h: 31 * k, tag: 15 * k, label: lab, t });
rail([[33.749, -84.395], [33.715, -84.418], [33.679, -84.44], [33.640, -84.425], [33.610, -84.41], [33.560, -84.37], [33.521, -84.354], [33.45, -84.32]].map((q) => A.P(...q)), T_TWO, kA * 1.5, T_VAN, T_ALL - 0.2);
rail([[33.749, -84.392], [33.785, -84.425], [33.83, -84.455], [33.865, -84.47]].map((q) => A.P(...q)), T_TWO, kA * 1.5, T_VAN);
const RINGP = []; for (let a = 0; a <= 360; a += 24) RINGP.push(A.P(33.749 + 0.03 * Math.sin((a * Math.PI) / 180) * 0.85, -84.388 + 0.03 * Math.cos((a * Math.PI) / 180)));
ridge(RINGP, "rome", T_TWO + 0.05, kA, { until: T_VAN + 0.1 });
B.city("", ...A.P(33.749, -84.388), { r: 5 * kA, t: T_TWO + 0.05, until: T_VAN });
ib("ATLANTA", A.P(33.775, -84.388), T_TWO + 0.15, T_VAN, 20); ib("JONESBORO", A.P(33.515, -84.30), T_TWO + 0.25, T_VAN, 18);
iu("ah", "rome", A.P(33.745, -84.40), T_TWO + 0.1, "HOOD");
// the two Confederate commanders he outmanoeuvred (name plates; Johnston relieved in July, Hood in Atlanta)
const OUTM = scr(`<div style="display:flex;gap:14px">${[["JOSEPH E. JOHNSTON", "RELIEVED · JULY 1864", "johnston"], ["JOHN BELL HOOD", "LOSES ATLANTA · SEPT 1864", "hood"]].map(([n, r, f]) => `<div style="display:flex;align-items:center;gap:10px;padding:6px 16px 6px 6px;background:rgba(18,16,12,0.92);border-left:6px solid #c4121f"><div style="width:64px;height:64px;border-radius:50%;overflow:hidden;position:relative;border:3px solid #f3e7c4;background:url(${FL.csa}) center/cover"><img src="assets/media/${f}_head.png" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div><div style="font-family:Oswald;font-weight:700;color:#f7f3ea"><div style="font-size:22px;letter-spacing:0.06em">${n}</div><div style="font-size:14px;letter-spacing:0.18em;color:#ef8a82">${r}</div></div></div>`).join("")}</div>`, "right:90px;bottom:130px;");
tl.fromTo(OUTM, { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_TWO + 0.3); tl.to(OUTM, { autoAlpha: 0, duration: 0.1 }, T_VAN - 0.06); SFX("ref:pop", T_TWO + 0.35);
B.arrow({ pts: [A.P(33.80, -84.43), A.P(33.70, -84.53), A.P(33.60, -84.50), A.P(33.53, -84.39)], side: "carth", t: T_TWO + 0.3, dur: 1.3, width: 9 * kA, until: T_VAN + 0.1 });
B.arrow({ pts: [A.P(33.765, -84.47), A.P(33.66, -84.57), A.P(33.57, -84.48), A.P(33.51, -84.38)], side: "carth", t: T_TWO + 0.55, dur: 1.3, width: 9 * kA, until: T_VAN + 0.1 });
SFX("ref:whoosh", T_TWO + 0.4);
[0, 0.3, 0.6].forEach((d) => K.impact(...A.P(33.525 - d * 0.01, -84.36 + d * 0.01), T_ALL - 0.2 + d, { r: 12 * kA }));
ringN(A.P(33.521, -84.354), "ATLANTA · 1864", 1, T_ALL, T_VAN, kA, -48);
// ---------- CUT 2: MARCH TO THE SEA 1864 (georgia inset): two wings fan toward Macon and Augusta, then on to Savannah ----------
const G = INS.ga, kG = 1 / G.S;
cut(T_VAN, G, T_THEN);
B.date("NOVEMBER - DECEMBER 1864", T_VAN + 0.02, T_THEN, 30);
flags(G.S, G.P(33.30, -83.80), G.P(33.25, -81.55), T_VAN + 0.1, T_THEN - 0.05);
const gb = (txt, p, t, until, sz = 17) => box(txt, p[0], p[1], t, sz * kG, until);
[["ATLANTA", 33.749, -84.388, 33.80, -84.22], ["MACON", 32.841, -83.632, 32.80, -83.45], ["AUGUSTA", 33.471, -81.975, 33.52, -82.15], ["SAVANNAH", 32.081, -81.091, 32.16, -81.30], ["MILLEDGEVILLE", 33.08, -83.23, 33.15, -83.05]]
  .forEach(([n, la, lo, la2, lo2], k) => { B.city("", ...G.P(la, lo), { r: 4 * kG, t: T_VAN + 0.05, until: T_THEN }); gb(n, G.P(la2, lo2), T_VAN + 0.1 + k * 0.05, T_THEN); });
// option 2: a red ring at Macon and at Augusta (the Confederates guard both); the wings fan out between them
K.target(...G.P(32.841, -83.632), T_VAN + 0.4, { r: 30 * kG, side: "rome", until: T_THEN }); K.target(...G.P(33.471, -81.975), T_VAN + 0.55, { r: 30 * kG, side: "rome", until: T_THEN });
B.arrow({ pts: [G.P(33.70, -84.30), G.P(33.25, -83.95), G.P(32.95, -83.55), G.P(32.60, -82.60)], side: "carth", t: T_VAN + 0.2, dur: 1.2, width: 11 * kG, until: T_THEN + 0.1 });
B.arrow({ pts: [G.P(33.75, -84.25), G.P(33.60, -83.60), G.P(33.35, -82.70), G.P(32.95, -82.10)], side: "carth", t: T_VAN + 0.35, dur: 1.2, width: 11 * kG, until: T_THEN + 0.1 });
SFX("ref:whoosh", T_VAN + 0.3);
B.arrow({ pts: [G.P(32.75, -82.30), G.P(32.45, -81.70), G.P(32.15, -81.20)], side: "carth", t: T_SEA - 0.3, dur: 0.9, width: 13 * kG, until: T_THEN + 0.1 });
gb("RIGHT WING", G.P(32.70, -83.30), T_VAN + 0.9, T_THEN, 14); gb("LEFT WING", G.P(33.55, -82.95), T_VAN + 1.0, T_THEN, 14);
ringN(G.P(32.081, -81.091), "MARCH TO THE SEA · 1864", 2, T_SEA, T_THEN, kG, -50);
// ---------- CUT 3: THE CAROLINAS 1865 (sc inset): blue columns on log roads through the flooded swamps ----------
const C = INS.sc, kC = 1 / C.S;
cut(T_THEN, C, T_THESE);
B.date("FEBRUARY 1865", T_THEN + 0.02, T_THESE, 30);
flags(C.S, C.P(33.32, -81.45), C.P(33.30, -80.60), T_THEN + 0.1, T_THESE - 0.05);
// flooded swamp: a blue-grey shimmer over the low ground along the rivers
const SWP = GG.pin(`<div style="width:${C.W * 1.1}px;height:${C.H * 1.1}px;background:radial-gradient(ellipse 30% 22% at 30% 62%, rgba(120,170,205,0.55), rgba(120,160,190,0) 70%),radial-gradient(ellipse 26% 20% at 62% 40%, rgba(120,170,205,0.5), rgba(120,160,190,0) 70%),radial-gradient(ellipse 22% 18% at 80% 72%, rgba(120,170,205,0.45), rgba(120,160,190,0) 70%);mix-blend-mode:screen"></div>`, C.at[0], C.at[1], { t: T_THEN + 0.05, until: T_THESE });
tl.to(SWP, { opacity: 0.6, duration: 0.6, yoyo: true, repeat: 6, ease: "sine.inOut" }, T_THEN + 0.3);
// corduroy roads: log stripes laid ahead of each blue column (north), the columns crawl behind them
const cord = (p0, p1, t0, dur) => { const n = 16; for (let i = 0; i <= n; i++) { const f = i / n, x = p0[0] + (p1[0] - p0[0]) * f, y = p0[1] + (p1[1] - p0[1]) * f;
  const el = GG.pin(`<div style="width:${14 * kC}px;height:${3 * kC}px;background:#a0784a;border:${0.4 * kC}px solid #2a1c0e;border-radius:${1 * kC}px"></div>`, x, y, { t: t0 + f * dur, pop: true, until: T_THESE }); } SFX("ref:pop", t0); };
[[33.00, -81.20, 33.28, -81.12], [32.98, -80.95, 33.27, -80.88]].forEach(([la, lo, la2, lo2], k) => {
  const p0 = C.P(la, lo), p1 = C.P(la2, lo2); cord(p0, p1, T_THEN + 0.2 + k * 0.15, T_THESE - T_THEN - 0.6);
  const id = iu("cc" + k, "carth", p0, T_THEN + 0.15, k ? "RIGHT WING" : "LEFT WING", kC);
  go(id, T_THEN + 0.4, T_THESE - T_THEN - 0.6, p1[0] - (p1[0] - p0[0]) * 0.12, p1[1] - (p1[1] - p0[1]) * 0.12, "none"); });
box("SALKEHATCHIE SWAMP", C.P(33.08, -81.33)[0], C.P(33.08, -81.33)[1], T_THEN + 0.3, 16 * kC, T_THESE);
box("CORDUROY ROADS", C.P(33.18, -80.70)[0], C.P(33.18, -80.70)[1], T_SWAMP + 0.2, 15 * kC, T_THESE);
const IMPS = scr(stampHTML("IMPASSABLE?", "#e8c66a", 56, -4, "IN THE MIDDLE OF WINTER"), "right:120px;top:190px;");
slam(IMPS, T_IMP - 0.05, { shake: 4, until: T_THESE - 0.05 });
ringN(C.P(33.20, -81.00), "THE CAROLINAS · 1865", 3, T_WIN, T_THESE, kC, -46);
// ---------- pull out to all three, then the title ----------
SFX("ref:whoosh", T_THESE - 0.1); SFX("ref:riser", T_THESE + 0.1);
camTo(T_THESE, 0.9, OVC[0], OVC[1], OVS, "power3.inOut");
camTo(T_THESE + 0.92, END - T_THESE - 0.9, OVC[0], OVC[1] - 10, OVS * 1.04, "none");
flags(OVS, L(36.05, -85.6), L(34.6, -82.6), T_THESE + 0.3, null);
legend(T_THESE + 0.2, null, false);
B.date("1864 - 1865", T_THESE + 0.05, null, 30);
const ringO = (p, txt, n, t, dx, dy) => { K.target(p[0], p[1], t, { r: 24, until: END + 1 });
  GG.pin(`<div style="display:flex;align-items:center;gap:6px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 2px 4px #000"><span style="display:inline-flex;width:24px;height:24px;border-radius:50%;border:3px solid #ffd54a;align-items:center;justify-content:center;font-size:14px">${n}</span><span style="font-size:19px;letter-spacing:.1em;white-space:nowrap">${txt}</span></div>`, p[0] + dx, p[1] + dy, { t: t + 0.15, pop: true }); };
ringO(P.atl, "ATLANTA · 1864", 1, T_THESE + 0.25, -110, -34);
ringO(L(32.95, -82.6), "MARCH TO THE SEA · 1864", 2, T_THESE + 0.4, 0, 40);
ringO(P.colum, "THE CAROLINAS · 1865", 3, T_THESE + 0.55, 140, -34);
B.arrow({ pts: [L(33.70, -84.30), L(33.10, -83.20), L(32.15, -81.20)], side: "carth", t: T_THESE + 0.3, dur: 0.8, width: 12, until: null });
B.arrow({ pts: [L(32.25, -81.05), L(33.95, -81.00), L(35.05, -78.90), L(35.95, -78.95)], side: "carth", t: T_THESE + 0.5, dur: 0.9, width: 12, until: null });
tl.to(BDG, { autoAlpha: 0, duration: 0.4 }, T_THREE - 0.6);
const TDIM = scr("", "inset:0;background:linear-gradient(180deg,rgba(5,7,13,0) 35%,rgba(5,7,13,0.78) 75%);");
tl.fromTo(TDIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, T_THREE - 0.5);
const TITLE = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">WILLIAM T. SHERMAN'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:28px;letter-spacing:0.3em;color:#ffd54a;margin-top:8px">1 ATLANTA · 2 MARCH TO THE SEA · 3 THE CAROLINAS</div></div>`, "left:0;right:0;top:720px;display:flex;justify-content:center;");
tl.fromTo(TITLE, { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power4.in", immediateRender: false }, T_THREE - 0.26);
SFX("ref:boom", T_THREE); K.shake(T_THREE, 6, 0.4);
K.raiseTerritory();
B.finish();
