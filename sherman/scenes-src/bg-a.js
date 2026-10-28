// BG-A (bg-1), William T. Sherman #13. Basemap south_hd_ref (z8, 34.50N 81.50W). Option 1 (south_ctl_may64: spring 1864, the front at
// Chattanooga / Dalton). Built with: python3 tools/build_scene.py bg-a south_hd_ref bg-1 bg-1
// Sherman (real photo badge) back under Grant (real photo badge); stamps on their words: SHILOH 1862 (WOUNDED, small), VICKSBURG 1863
// (off the map to the west: edge pointer), CHATTANOOGA 1863; TRUST card; MARCH 1864: Grant's pin slides EAST to Virginia (arrow) to face
// LEE, Sherman's pin stays at Chattanooga: COMMAND IN THE WEST; THE PLAN: two blue arrows at the same time (Grant -> Richmond, Sherman ->
// Atlanta), red reinforcement arrows between them crossed out (NO TROOPS TO SPARE); the empty method card SHERMAN'S METHOD.
// Facts: research/FACT_NOTES.md (Biography); control: research/FACT_NOTES_south.md.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const FL = { us: "assets/media/us35_flag.png", csa: "assets/media/csa1_13_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const box = (txt, x, y, t, size = 16, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); const el = GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${(size * 0.2).toFixed(2)}px ${(size * 0.35).toFixed(2)}px ${(size * 0.2).toFixed(2)}px ${(size * 0.6).toFixed(2)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${(size * 0.12).toFixed(2)}px ${(size * 0.5).toFixed(2)}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t: t === 0 ? null : t, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
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
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in", immediateRender: false }, t);
  const tHit = t + (o.dur || 0.24) - 0.02; if (o.sfx !== false) SFX(o.sfx || "hit", tHit); K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until); return el; };
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(2, Math.round(size / 9))}px solid ${c};padding:${(size * 0.08).toFixed(1)}px ${(size * 0.42).toFixed(1)}px ${(size * 0.12).toFixed(1)}px;background:rgba(14,12,10,0.72);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.36)}px;letter-spacing:0.22em;color:#d8cfb8">${sub}</div>` : ""}</div>`;
const legend = (t, until) => { const html = `<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "UNION"], ["#be3a2a", "CONFEDERATE"]].map(([sq, nm]) => `<span><b style="display:inline-block;width:20px;height:20px;background:${sq};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`;
  const el = document.createElement("div"); el.className = "gg-card"; el.style.top = "34px"; el.innerHTML = `<div class="inner">${html}</div>`;
  scene.insertBefore(el, document.getElementById("credit")); if (until != null) GG.fadeOut(el, until, 0.6); return el; };
const wimg = (src, tIn, dIn, tOut, mx = true, dOut = 0.6) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { position: "absolute", left: "0px", top: "0px", width: "2880px", height: "1620px" }); if (mx) el.style.mixBlendMode = "multiply";
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (tIn > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: true }, tIn);
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: dOut }, tOut); return el; };
const CW = 1920, CH = 1080, cam = { cx: 1440, cy: 810, s: 1.0 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const RED = scr("", "inset:0;background:radial-gradient(ellipse at center, rgba(200,20,30,0) 40%, rgba(200,20,30,0.45) 100%);");
const pulse = (t) => { tl.fromTo(RED, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, t); tl.to(RED, { autoAlpha: 0, duration: 0.5 }, t + 0.08); };
// small round photo pin on the map (a commander's position), moves with B-style tweens
const facePin = (photo, name, x, y, t, side = "carth", until) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:3px"><div style="width:70px;height:70px;border-radius:50%;overflow:hidden;position:relative;border:4px solid #f3e7c4;box-shadow:0 0 0 3px ${side === "carth" ? "#1f4fc4" : "#c4121f"},0 6px 14px rgba(0,0,0,.6);background:url(${side === "carth" ? FL.us : FL.csa}) center/cover"><img src="${photo}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div><div style="font-family:Oswald;font-weight:700;font-size:17px;letter-spacing:0.14em;color:#f7f3ea;background:${side === "carth" ? "#1f4fc4" : "#c4121f"};padding:0 8px;white-space:nowrap">${name}</div></div>`, x, y, { t, pop: true, until });
const L = GG.proj(8, 16491, 25259);
// ---------- times ----------
const H = "bg-1";
const T_GRANT = at(H, "Ulysses Grant"), T_SHI = at(H, "wounded at Shiloh"), T_VIC = at(H, "Vicksburg"), T_CHA = at(H, "and Chattanooga"),
  T_TRUST = at(H, "trust each other"), T_MAR = at(H, "In March"), T_EAST = at(H, "Grant went east"), T_LEE = at(H, "Robert E. Lee"),
  T_LEFT = at(H, "left Sherman"), T_WEST = at(H, "war in the West"), T_PLAN = at(H, "Their plan"), T_SAME = at(H, "at the same time"),
  T_SHIFT = at(H, "could not shift"), T_EITHER = at(H, "either one");
const P = { shi: L(35.15, -88.32), cha: L(35.046, -85.31), atl: L(33.749, -84.388), rich: L(37.541, -77.436), cul: L(37.15, -78.25), nash: L(36.162, -86.781) };
// ---------- map ----------
const OV = wimg("assets/media/south_ctl_may64_mx.png", 0, 0, null, true);
const GEO = wimg("assets/media/south_geo_ref.png", 0, 0, null, false);
const LV = LivingK(B); LV.clouds({ n: 8, opacity: 0.18 }); LV.scaleBar(503.95); LV.north();
const C0 = [1020, 780], S0 = 0.86;
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = S0; applyCam();
camTo(0, T_MAR - 0.2, C0[0] + 30, C0[1] - 10, S0 * 1.04, "sine.inOut");
B.showDate(0.05); B.date("1862 - 1863", 0.1, T_MAR, 32);
legend(0, null);
flags(S0, L(36.25, -85.3), L(33.0, -86.6), 0, T_MAR + 0.2);
// Sherman (real photo, now named) and Grant
const SB = K.badge({ name: "WILLIAM T. SHERMAN", role: "UNDER GRANT · 1862 - 1863", photo: "assets/media/sherman_head.png", flag: FL.us, side: "carth", corner: "br", t: 0.1, until: T_MAR - 0.2 });
const GB = K.badge({ name: "ULYSSES S. GRANT", role: "HIS COMMANDER", photo: "assets/media/grant_head.png", flag: FL.us, side: "carth", corner: "tr", t: T_GRANT - 0.2, until: T_MAR - 0.2 });
SFX("ref:pop", T_GRANT);
// SHILOH 1862 (wounded), VICKSBURG 1863 (off the map to the west), CHATTANOOGA 1863
K.target(...P.shi, T_SHI - 0.1, { r: 30, until: T_MAR });
box("SHILOH · 1862", P.shi[0] + 22, P.shi[1] - 44, T_SHI, 19, T_MAR);
const WD = scr(stampHTML("WOUNDED", "#e3232f", 40, -6), `left:${Math.round((P.shi[0] - C0[0]) * S0 + 960) - 20}px;top:${Math.round((P.shi[1] - C0[1]) * S0 + 540) + 30}px;`);
slam(WD, T_SHI + 0.35, { shake: 3, until: T_VIC + 0.6 }); pulse(T_SHI + 0.55);
const VK = L(32.35, -90.88);
const VIC = GG.pin(`<div style="display:flex;align-items:center;gap:8px;font-family:Oswald;font-weight:700"><div style="width:0;height:0;border-top:16px solid transparent;border-bottom:16px solid transparent;border-right:24px solid #ffd54a;filter:drop-shadow(0 2px 3px #000)"></div><div style="background:#f1eee6;color:#111;padding:3px 10px;font-size:19px;letter-spacing:0.24em;box-shadow:0 2px 8px rgba(0,0,0,.6)">VICKSBURG · 1863</div></div>`, 120, VK[1], { t: T_VIC - 0.05, pop: true, until: T_MAR });
SFX("hit", T_VIC);
K.target(...P.cha, T_CHA, { r: 30, until: T_MAR });
box("CHATTANOOGA · 1863", P.cha[0] + 10, P.cha[1] - 46, T_CHA + 0.05, 19, T_MAR);
SFX("hit", T_CHA + 0.05);
const TR = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 26px 12px;background:rgba(18,16,12,0.92);border-left:8px solid #2e5cb2;color:#f7f3ea"><div style="font-size:20px;letter-spacing:0.3em;color:#9fc0ea">GRANT + SHERMAN</div><div style="font-size:40px;letter-spacing:0.06em">COMPLETE TRUST</div></div>`, "right:90px;top:330px;");
tl.fromTo(TR, { autoAlpha: 0, x: 70 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_TRUST); SFX("ref:pop", T_TRUST + 0.05);
tl.to(TR, { autoAlpha: 0, duration: 0.3 }, T_MAR - 0.2);
// ---------- MARCH 1864: Grant goes east, Sherman takes the West ----------
const SW = 0.70, CWd = [1500, 800];
camTo(T_MAR - 0.15, 1.1, CWd[0], CWd[1], SW, "power2.inOut"); SFX("ref:whoosh", T_MAR - 0.1);
camTo(T_MAR + 0.97, END - T_MAR - 1.0, CWd[0] - 20, CWd[1], SW * 1.03, "sine.inOut");
B.date("MARCH 1864", T_MAR + 0.05, T_PLAN, 32); B.date("MAY 1864", T_PLAN + 0.05, null, 32);
flags(SW, L(36.25, -85.3), L(33.4, -82.3), T_MAR + 0.3, null);
const GP = facePin("assets/media/grant_head.png", "GRANT", P.cha[0] + 40, P.cha[1] - 70, T_MAR + 0.2);
const SP = facePin("assets/media/sherman_head.png", "SHERMAN", P.cha[0] - 50, P.cha[1] + 50, T_MAR + 0.3);
SFX("ref:pop", T_MAR + 0.25);
tl.to(GP, { x: P.cul[0] - P.cha[0] - 40, y: P.cul[1] - P.cha[1] + 70, duration: 1.4, ease: "power2.inOut" }, T_EAST);
B.arrow({ pts: [[P.cha[0] + 60, P.cha[1] - 80], [1400, 320], [P.cul[0] - 50, P.cul[1] + 40]], side: "carth", t: T_EAST, dur: 1.3, width: 14, dash: "14 10", until: T_PLAN + 0.2 });
SFX("ref:whoosh", T_EAST + 0.1);
box("TO VIRGINIA", P.cul[0] - 30, P.cul[1] + 90, T_EAST + 1.0, 18, T_PLAN + 0.2, false);
unitXY("lee", "rome", ...L(37.42, -77.55), "infantry", { w: 54, h: 36, tag: 17, label: "LEE", t: T_LEE - 0.1 }); SFX("ref:pop", T_LEE);
const WEST = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 26px 12px;background:rgba(18,16,12,0.92);border-left:8px solid #2e5cb2;color:#f7f3ea"><div style="font-size:20px;letter-spacing:0.3em;color:#9fc0ea">SHERMAN · MARCH 1864</div><div style="font-size:46px;letter-spacing:0.06em">COMMAND IN THE WEST</div></div>`, "left:90px;top:220px;");
tl.fromTo(WEST, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_LEFT + 0.1); SFX("hit", T_LEFT + 0.2); K.shake(T_LEFT + 0.2, 3, 0.25);
tl.to(WEST, { autoAlpha: 0, duration: 0.3 }, T_PLAN - 0.1);
tl.to(SP, { scale: 1.25, duration: 0.3, yoyo: true, repeat: 1 }, T_WEST);
K.target(P.cha[0] - 50, P.cha[1] + 50, T_WEST, { r: 40, side: "carth", until: T_PLAN + 0.4 });
// ---------- THE PLAN: both attack at the same time ----------
const PLAN = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 26px 12px;background:rgba(18,16,12,0.92);border-left:8px solid #c9b48a;color:#f7f3ea"><div style="font-size:20px;letter-spacing:0.3em;color:#c9b48a">THE PLAN · MAY 1864</div><div style="font-size:40px;letter-spacing:0.06em">ATTACK AT THE SAME TIME</div></div>`, "left:90px;top:220px;");
tl.fromTo(PLAN, { autoAlpha: 0, x: -70 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_PLAN + 0.1); SFX("ref:pop", T_PLAN + 0.15);
B.arrow({ pts: [[P.cul[0] + 30, P.cul[1] - 10], [P.cul[0] + 110, P.cul[1] - 40], [P.rich[0] - 25, P.rich[1] + 15]], side: "carth", t: T_SAME - 0.1, dur: 0.9, width: 16, until: null });
B.arrow({ pts: [[P.cha[0] - 30, P.cha[1] + 70], [P.cha[0] + 40, P.cha[1] + 180], [P.atl[0] - 10, P.atl[1] - 30]], side: "carth", t: T_SAME - 0.1, dur: 0.9, width: 16, until: null });
SFX("whoosh", T_SAME - 0.05); SFX("hit", T_SAME + 0.7); K.shake(T_SAME + 0.7, 4, 0.3);
K.target(...P.rich, T_SAME + 0.6, { r: 30, side: "rome", until: END + 1 }); K.target(...P.atl, T_SAME + 0.6, { r: 30, side: "rome", until: END + 1 });
// the Confederacy cannot shift troops between them: red arrows both ways, crossed out
const RA1 = B.arrow({ pts: [[P.atl[0] + 60, P.atl[1] - 40], [1500, 560], [P.rich[0] - 60, P.rich[1] + 60]], side: "rome", t: T_SHIFT - 0.2, dur: 0.9, width: 11, dash: "12 9", until: null });
B.greyArrow(RA1, T_EITHER - 0.1);
[[1500, 560]].forEach(([x, y]) => { GG.pin(`<div style="font-family:Oswald;font-weight:700;font-size:96px;line-height:1;color:#ff4a3a;text-shadow:0 0 10px #000">✕</div>`, x, y, { t: T_EITHER - 0.05, pop: true }); });
SFX("hit", T_EITHER); pulse(T_EITHER + 0.1);
tl.to(PLAN, { autoAlpha: 0, duration: 0.3 }, END - 2.2);
// the method card appears, still empty: SHERMAN'S METHOD (one line per move later)
GG.METHOD = ["HIT THE RAILROAD, NOT THE WALL", "THREATEN TWO PLACES AT ONCE", "GO WHERE THEY SAY NO ARMY CAN"]; GG.METHOD_TITLE = "SHERMAN'S METHOD";
const MC = GG.method(0, END - 2.0, null); SFX("ref:boom", END - 1.8);
MC.style.justifyContent = "flex-end"; MC.style.paddingRight = "70px";
K.raiseTerritory();
B.finish();
