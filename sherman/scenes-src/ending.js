// ENDING (end-1 .. end-2), William T. Sherman #13. Basemap south_hd_ref (z8, 34.50N 81.50W). Option 1: south_ctl_apr65 (April 1865).
// Built with: python3 tools/build_scene.py ending south_hd_ref end-1 end-2
// end-1: theatre; the INSANE headline as a greyed ghost; the three moves light in turn with their method lines (1 the swing round
//        Atlanta, 2 the two wings across Georgia, 3 the log roads north through the Carolinas), LINCOLN RE-ELECTED · 212 TO 21; the
//        destruction (smoke columns, fire glow on Atlanta, Milledgeville, Columbia) NEVER FORGIVEN IN THE SOUTH; SHERMAN'S METHOD full card;
//        WAR IS ALL HELL (no quote marks) with COLUMBUS, OHIO, 1880 · AS REPORTED.
// end-2: E.final (three numbered cards, 1, 2 OR 3?, "TELL US WHICH COMMANDER WE SHOULD COVER NEXT" instead of the family line),
//        NEXT: GEORGE THOMAS AT NASHVILLE card (Thomas real photo), corner subscribe; the map stays for YouTube's end screen.
// Facts: research/FACT_NOTES.md (Quotes summary: "war is all hell" = 1880 Columbus veterans' speech, as reported); control:
// research/FACT_NOTES_south.md.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const E = EngageK(B);
const FL = { us: "assets/media/us35_flag.png", csa: "assets/media/csa1_13_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const box = (txt, x, y, t, size = 16, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); const el = GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${(size * 0.2).toFixed(2)}px ${(size * 0.35).toFixed(2)}px ${(size * 0.2).toFixed(2)}px ${(size * 0.6).toFixed(2)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${(size * 0.12).toFixed(2)}px ${(size * 0.5).toFixed(2)}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t: t === 0 ? null : t, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const flag = (src, name, x, y, t, until, w = 76) => { const el = GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(2)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.3, w / 40).toFixed(2)}px solid #1a1712;box-shadow:0 ${(w * 0.03).toFixed(2)}px ${(w * 0.08).toFixed(2)}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.17).toFixed(2)}px;color:#f7f3ea;text-shadow:0 ${(w * 0.02).toFixed(2)}px ${(w * 0.04).toFixed(2)}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t: t === 0 ? null : t, pop: true, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const flags = (s, pU, pC, t, until) => [flag(FL.us, "UNITED STATES", ...pU, t, until, 115 / s), flag(FL.csa, "CONFEDERATE STATES", ...pC, t, until, 115 / s)];
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
const L = GG.proj(8, 16491, 25259);
// ---------- times ----------
const E1 = "end-1", E2 = "end-2";
const T_INS = at(E1, "called insane"), T_ATL = at(E1, "took Atlanta"), T_ELEC = at(E1, "helped win"), T_MARCH = at(E1, "marched an army"),
  T_HEART = at(E1, "heart of the South"), T_NEVER = at(E1, "never forgave"), T_DEST = at(E1, "the destruction"), T_YEARS = at(E1, "And years later"),
  T_CROWD = at(E1, "a crowd of old soldiers"), T_HELL = at(E1, "war is all hell");
const S2 = PS(E2), T_ONE = at(E2, "One, the swing"), T_TWO = at(E2, "Two, the march"), T_THR = at(E2, "Or three"), T_TELL = at(E2, "Tell us in the comments"),
  T_CMDR = at(E2, "which commander"), T_NEXT = at(E2, "And next, watch"), T_SUB = at(E2, "Subscribe");
const P = { atl: L(33.749, -84.388), sav: L(32.081, -81.091), mill: L(33.08, -83.23), colum: L(34.0, -81.035), bennett: L(36.03, -78.98), jones: L(33.521, -84.354) };
// ---------- map ----------
const OV = wimg("assets/media/south_ctl_apr65_mx.png", 0, 0, null, true);
const GEO = wimg("assets/media/south_geo_ref.png", 0, 0, null, false);
const LV = LivingK(B); LV.clouds({ n: 8, opacity: 0.18 }); LV.scaleBar(503.95); LV.north();
const C0 = [1420, 905], S0 = 0.95;
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = S0 * 0.97; applyCam();
camTo(0, S2, C0[0] + 20, C0[1] - 10, S0, "sine.inOut");
B.showDate(0.05); B.date("1864 - 1865", 0.1, null, 32);
legend(0, null);
flags(S0, L(35.95, -85.0), L(33.55, -85.35), 0, null);
const SB = K.badge({ name: "WILLIAM T. SHERMAN", role: "1864 - 1865", photo: "assets/media/sherman_head.png", flag: FL.us, side: "carth", corner: "bl", t: 0.1, until: T_YEARS - 0.2 });
// the man a newspaper had called insane: the 1861 headline as a greyed ghost
const GH = scr(`<div style="width:520px;background:linear-gradient(180deg,#d9d2c0,#bfb59c);color:#2a251c;padding:10px 18px 12px;transform:rotate(-3deg);font-family:Oswald;box-shadow:0 14px 30px rgba(0,0,0,.6);filter:grayscale(1)"><div style="font-family:'Special Elite',monospace;font-size:12px;border-bottom:2px double #3b3224">CINCINNATI · DECEMBER 11, 1861</div><div style="font-weight:700;font-size:44px;line-height:1.05;text-align:center;margin-top:6px">GEN. WILLIAM T. SHERMAN INSANE</div></div>`, "right:110px;top:170px;");
tl.fromTo(GH, { autoAlpha: 0, y: -20 }, { autoAlpha: 0.85, y: 0, duration: 0.4, immediateRender: false }, T_INS - 0.4); SFX("ref:pop", T_INS - 0.35);
tl.to(GH, { autoAlpha: 0, duration: 0.3 }, T_ATL + 0.4);
// the three moves light in turn, each with its method line (gold numbered labels like the hook rings)
const ringE = (p, txt, n, t, dx, dy, until) => { K.target(p[0], p[1], t, { r: 26, until }); SFX("hit", t + 0.05);
  return GG.pin(`<div style="display:flex;align-items:center;gap:8px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 2px 4px #000"><span style="display:inline-flex;width:28px;height:28px;border-radius:50%;border:3px solid #ffd54a;align-items:center;justify-content:center;font-size:16px">${n}</span><span style="font-size:21px;letter-spacing:.1em;white-space:nowrap">${txt}</span></div>`, p[0] + dx, p[1] + dy, { t: t + 0.15, pop: true, until }); };
const UNTIL = T_YEARS - 0.2;
// 1: the swing round the west side of Atlanta onto the railroad at Jonesboro
B.arrow({ pts: [L(33.95, -84.55), L(33.72, -84.75), L(33.50, -84.55), L(33.47, -84.38)], side: "carth", t: T_ATL - 0.2, dur: 0.9, width: 9, until: UNTIL });
const R1 = ringE(P.atl, "HIT THE RAILROAD, NOT THE WALL", 1, T_ATL, -40, -56, UNTIL);
const LW = scr(`<div style="font-family:Oswald;font-weight:700;padding:8px 22px 10px;background:rgba(18,16,12,0.9);border-left:7px solid #2e5cb2;color:#f7f3ea"><div style="font-size:18px;letter-spacing:0.3em;color:#9fc0ea">8 NOVEMBER 1864</div><div style="font-size:30px;letter-spacing:0.06em">LINCOLN RE-ELECTED · 212 TO 21</div></div>`, "right:110px;top:180px;");
tl.fromTo(LW, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.35, immediateRender: false }, T_ELEC); SFX("ref:pop", T_ELEC + 0.05);
tl.to(LW, { autoAlpha: 0, duration: 0.3 }, T_NEVER - 0.2);
// 2: two wings across Georgia to the sea
B.arrow({ pts: [L(33.70, -84.25), L(33.05, -83.60), L(32.55, -82.40), L(32.15, -81.25)], side: "carth", t: T_MARCH - 0.2, dur: 1.0, width: 9, until: UNTIL });
B.arrow({ pts: [L(33.75, -84.20), L(33.50, -83.20), L(33.05, -82.10), L(32.20, -81.20)], side: "carth", t: T_MARCH - 0.05, dur: 1.0, width: 9, until: UNTIL });
const R2 = ringE(P.sav, "THREATEN TWO PLACES AT ONCE", 2, T_MARCH + 0.6, -360, 30, UNTIL);
// 3: the log roads north through the Carolinas
const C3 = [L(32.25, -81.05), L(33.10, -81.05), L(33.95, -80.95), L(34.70, -79.85), L(35.30, -78.70), L(35.95, -78.95)];
B.arrow({ pts: C3, side: "carth", t: T_HEART - 0.4, dur: 1.2, width: 9, until: UNTIL });
for (let i = 0; i < 14; i++) { const f = i / 13, k = Math.min(C3.length - 2, Math.floor(f * (C3.length - 1))), u = f * (C3.length - 1) - k;
  const x = C3[k][0] + (C3[k + 1][0] - C3[k][0]) * u + 14, y = C3[k][1] + (C3[k + 1][1] - C3[k][1]) * u;
  GG.pin(`<div style="width:16px;height:4px;background:#a0784a;border:1px solid #2a1c0e;border-radius:1px"></div>`, x, y, { t: T_HEART - 0.3 + f * 1.1, pop: true, until: UNTIL }); }
const R3 = ringE(P.bennett, "GO WHERE THEY SAY NO ARMY CAN", 3, T_HEART + 0.5, 30, -50, UNTIL);
// the South never forgave the destruction: smoke columns + fire glow along the path
const glow = (p, t, r, until) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle, rgba(255,140,40,0.75) 0%, rgba(255,90,20,0.35) 40%, rgba(255,60,0,0) 70%);mix-blend-mode:screen"></div>`, p[0], p[1]);
  tl.fromTo(el, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.5, immediateRender: false }, t); tl.to(el, { scale: 1.15, duration: 0.4, yoyo: true, repeat: 8, ease: "sine.inOut" }, t + 0.5); tl.to(el, { autoAlpha: 0, duration: 0.6 }, until); };
[[P.atl, 0], [P.mill, 0.35], [L(32.7, -82.3), 0.6], [P.colum, 0.85], [L(34.7, -79.88), 1.1]].forEach(([p, d]) => { glow(p, T_NEVER + d, 40, UNTIL); K.smoke(p[0], p[1] - 6, T_NEVER + d + 0.1, { n: 5, r: 14, rise: 70, life: 3.2, alpha: 0.8 }); });
SFX("ref:boom", T_NEVER + 0.2);
const NF = scr(stampHTML("NEVER FORGIVEN", "#d8cfb8", 50, -3, "IN THE SOUTH"), "right:150px;top:200px;");
slam(NF, T_DEST - 0.1, { shake: 3, until: T_YEARS - 0.2 });
// SHERMAN'S METHOD, full; then the reported line (no quote marks), COLUMBUS, OHIO, 1880 · AS REPORTED
GG.METHOD = ["HIT THE RAILROAD, NOT THE WALL", "THREATEN TWO PLACES AT ONCE", "GO WHERE THEY SAY NO ARMY CAN"]; GG.METHOD_TITLE = "SHERMAN'S METHOD";
const MC = GG.method(3, T_YEARS - 0.3, S2 - 0.2, [T_YEARS - 0.1, T_YEARS + 0.1, T_YEARS + 0.3]);
MC.style.top = "150px"; MC.firstElementChild.style.zoom = "0.78";
SFX("ref:boom", T_YEARS - 0.1);
const HELL = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:12px 44px 14px;background:rgba(14,12,10,0.93);border-top:7px solid #c9b48a;color:#f7f3ea;box-shadow:0 18px 40px rgba(0,0,0,.6)"><div style="font-size:66px;letter-spacing:0.1em;line-height:1.05">WAR IS ALL HELL</div><div style="font-size:19px;letter-spacing:0.24em;color:#c9b48a;margin-top:6px">TO A CROWD OF OLD SOLDIERS · COLUMBUS, OHIO, 1880 · AS REPORTED</div></div>`, "left:0;right:0;top:760px;display:flex;justify-content:center;transform-origin:50% 50%;");
slam(HELL, T_HELL - 0.15, { from: 1.6, shake: 5, sfx: "ref:boom", until: S2 - 0.2 });
tl.fromTo(HELL.querySelector("div div:last-child"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, T_CROWD);
// =====================================================================================================================
// end-2: the final question (E.final; 19th-century war: "which commander next" instead of the family line), the next video
// =====================================================================================================================
const EF = E.final({ moves: [["ATLANTA", "1864"], ["MARCH TO THE SEA", "1864"], ["THE CAROLINAS", "1865"]], tShow: S2 - 0.1,
  tNums: [T_ONE, T_TWO, T_THR], tAsk: T_TELL - 0.3, tFamily: T_CMDR - 0.3, tSub: T_SUB - 0.6, until: END - 0.2 });
EF.querySelector(".fam").innerHTML = `TELL US WHICH COMMANDER WE SHOULD COVER NEXT<div style="font-size:22px;letter-spacing:0.3em;color:#c9b48a;margin-top:4px">WE READ EVERY ONE</div>`;
const NX = scr(`<div style="display:flex;align-items:center;gap:16px;padding:10px 26px 10px 10px;background:rgba(14,16,22,0.94);border:2px solid rgba(201,180,138,0.7);border-left:8px solid #2e5cb2;border-radius:10px;box-shadow:0 14px 30px rgba(0,0,0,.6)">
  <div style="width:96px;height:96px;border-radius:50%;overflow:hidden;position:relative;border:4px solid #f3e7c4;background:url(${FL.us}) center/cover"><img src="assets/media/thomas_head.png" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div>
  <div style="font-family:Oswald;font-weight:700;color:#f7f3ea"><div style="font-size:20px;letter-spacing:0.34em;color:#ffd54a">NEXT</div><div style="font-size:36px;letter-spacing:0.05em;line-height:1.05">GEORGE THOMAS AT NASHVILLE</div><div style="font-size:17px;letter-spacing:0.2em;color:#c9b48a">HOW HE DESTROYED HOOD'S ARMY · DECEMBER 1864</div></div></div>`, "left:90px;bottom:70px;");
tl.fromTo(NX, { autoAlpha: 0, x: -80 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, T_NEXT); SFX("hit", T_NEXT + 0.1);
K.raiseTerritory();
B.finish();
