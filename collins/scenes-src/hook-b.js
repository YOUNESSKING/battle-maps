// HOOK-B (hook-4), Collins #9: Western Front overview (europe_hd_ref, option 1 = territory per date), name slam with Collins's real photo,
// three snap cuts CHERBOURG June 1944 / SAINT-LO July 1944 / CELLES December 1944, pull-out to all three, title card.
// Copied from rokossovsky/scenes-src/hook-b.js (the locked hook). Built with: python3 tools/build_scene.py hook-b europe_hd_ref hook-4 hook-4
// Territory: assets/media/hooknorm_eu_ctl_<date>_mx.png (tools/make_hooknorm_control.py; fronts logged in research/FACT_NOTES_hook.md).
const B = Battle();
const { at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(6, 7093, 5051);
const FL = { us: "assets/media/us_flag_48star.png", uk: "assets/media/uk_flag.png", de: "assets/media/ger_reich_flag.png" };
const PHOTO = "assets/media/collins_head.png";   // licensed head shot (credits: assets/media/CREDITS.md)
const box = (txt, x, y, t, size = 16, until, pop = true) => { if (pop) SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${Math.round(size * 0.2 * 10) / 10}px ${Math.round(size * 0.35 * 10) / 10}px ${Math.round(size * 0.2 * 10) / 10}px ${Math.round(size * 0.6 * 10) / 10}px;font-size:${size}px;box-shadow:0 2px 8px rgba(0,0,0,.6);white-space:nowrap">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 120) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${Math.max(1, Math.round(w * 0.05))}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, Math.round(w / 60))}px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${Math.max(5, Math.round(w * 0.2))}px;color:#f7f3ea;text-shadow:0 2px 4px #000;letter-spacing:0.08em">${name}</div></div>`, x, y, { t, pop: true, until });
const neutral = (name, x, y, t, until, size = 14) => GG.pin(`<div class="gg-lbl" style="position:relative;text-align:center;font-size:${size}px;line-height:1.1;color:#e9e6dc">${name}<br><span style="font-size:${Math.round(size * 0.65)}px;letter-spacing:.32em;color:#c9c4b4">NEUTRAL</span></div>`, x, y, { t, until });
const legend = (t, until) => {
  const sw = (c) => `<b style="display:inline-block;width:20px;height:20px;background:${c};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>`;
  const el = GG.card(`<div style="display:flex;gap:26px;font-size:21px;letter-spacing:0.08em;align-items:center"><span>${sw("#2e5cb2")}ALLIES</span><span>${sw("#8c0c14")}GERMANY</span><span>${sw("#6d766c")}NEUTRAL</span></div>`, "", 34, t, until);
  el.querySelector(".inner").style.cssText += "padding:12px 30px 14px;border-top-color:#9fc0ea;"; return el;
};
const H = "hook-4", tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const T_JOE = at(H, "Joseph Lawton"), T_LJ = at(H, "Lightning Joe"), T_SIX = at(H, "In six months"), T_TOOK = at(H, "he took"), T_CHER = at(H, "the port of Cherbourg");
const T_BROKE = at(H, "broke the German"), T_NORM = at(H, "Normandy"), T_DEST = at(H, "and destroyed"), T_SPEAR = at(H, "the spearhead"), T_HIT = at(H, "Hitler's last");
const T_FEW = at(H, "a few miles"), T_MEUSE = at(H, "the Meuse"), T_THESE = at(H, "These are"), T_THREE = at(H, "three greatest");
const wimg = (src, tIn, dIn, tOut, mx = true) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px" }); if (mx) el.style.mixBlendMode = "multiply";
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (tIn > 0) { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: false }, tIn); }
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: 0.25 }, tOut);
  return el;
};
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const CW = 1920, CH = 1080, cam = { cx: 1200, cy: 540, s: 1.3 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
applyCam();
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// hard CUT: a 0.1 s black frame hides an instant camera jump (cinematic whoosh + hit)
const CUTB = scr("", "inset:0;background:#030406;");
const cut = (t, cx, cy, s, holdTo, drift = [6, 0, 1.06]) => {
  tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  camTo(t, 0.01, cx, cy, s); camTo(t + 0.02, holdTo - t - 0.1, cx + drift[0], cy + drift[1], s * drift[2], "sine.out");
  SFX("ref:whoosh", t - 0.2); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25);
};
const PLACE = { cherbourg: G(49.64, -1.62), stlo: G(49.115, -1.09), avranches: G(48.684, -1.357), celles: G(50.23, 4.94), dinant: G(50.26, 4.91),
  namur: G(50.47, 4.87), givet: G(50.14, 4.83), marche: G(50.23, 5.35), paris: G(48.86, 2.35), london: G(51.5, -0.12), berlin: G(52.52, 13.4), brussels: G(50.85, 4.35) };
// ---------- map (option 1, period overlays per date) ----------
const OV6 = wimg("assets/media/hooknorm_eu_ctl_jun26_mx.png", 0, 0, T_BROKE);
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.22 }); LV.scaleBar(1714.41); LV.north();
const EMB = G(51.1, 10.4);   // centred on Germany, 190 px: clear of the sea, the flags and the labels
B.image("assets/media/emblem_ger.png", EMB[0] - 95, EMB[1] - 95, 190, 190, { t: 0, dur: 0.6, opacity: 0.8 });
legend(0.6, END + 1);
const FG = flag(FL.de, "GERMANY", ...G(53.2, 13.6), 0.6, null, 64), FU = flag(FL.us, "USA", ...G(47.2, 1.2), 0.7, null, 64), FB = flag(FL.uk, "BRITAIN", ...G(52.6, -1.7), 0.8, null, 60);
neutral("SWITZERLAND", ...G(46.75, 8.1), 0.9, null, 11); neutral("SPAIN", ...G(40.6, -3.8), 0.9, null, 13);
[["PARIS", PLACE.paris, 0, -12], ["LONDON", PLACE.london, 0, -12], ["BERLIN", PLACE.berlin, 0, -12], ["BRUSSELS", PLACE.brussels, 0, -12]].forEach(([n, p, dx, dy]) => {
  B.city("", p[0], p[1], { r: 2.4, t: 0.5 }); box(n, p[0] + dx, p[1] + dy, 0.5, 8, null, false); });
SFX("ref:pop", 0.65);
// dark at frame 0 (continuity with the end of hook-a), lifting as the badge appears
const DK = scr("", "inset:0;background:#05070d;"); gsap.set(DK, { autoAlpha: 0.8 });
tl.to(DK, { autoAlpha: 0, duration: 0.9, ease: "power2.out" }, 0.15);
// the badge: real photo, the name SLAMS in, LIGHTNING JOE, then it flies to the corner
const BDG = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:18px">
  <div style="position:relative;width:380px;height:380px;border-radius:50%;overflow:hidden;border:9px solid #f3e7c4;box-shadow:0 0 0 6px #1f4fc4,0 20px 40px rgba(0,0,0,0.75);background:url(${FL.us}) center/cover">
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,12,24,0.7);font-family:Oswald;font-weight:700;font-size:110px;color:#f7f3ea">JLC</div>
    <img src="${PHOTO}" onerror="this.style.display='none'" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div>
  <div class="pl" style="padding:12px 34px 14px;background:rgba(18,16,12,0.94);border-top:6px solid #1f4fc4;color:#f7f3ea;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:60px;letter-spacing:0.08em;line-height:1.1">J. LAWTON COLLINS</div><div style="font-size:22px;letter-spacing:0.22em;color:#d8cfb8">MAJOR GENERAL · US VII CORPS</div></div>
  <div class="lj" style="transform:rotate(-4deg);font-family:Oswald;font-weight:700;font-size:46px;letter-spacing:0.16em;color:#ffd54a;border:5px solid #ffd54a;padding:2px 22px 4px;background:rgba(14,12,10,0.8);box-shadow:0 10px 26px rgba(0,0,0,.55)">⚡ LIGHTNING JOE</div></div>`,
  "left:0;right:0;top:150px;display:flex;justify-content:center;transform-origin:50% 25%;");
gsap.set(BDG, { autoAlpha: 1, scale: 1.0 });
const PL = BDG.querySelector(".pl"), LJ = BDG.querySelector(".lj"); gsap.set([PL, LJ], { autoAlpha: 0 });
tl.fromTo(PL, { autoAlpha: 0, scale: 1.9 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in" }, T_JOE - 0.1);
SFX("hit", T_JOE + 0.1); K.shake(T_JOE + 0.1, 5, 0.3);
tl.fromTo(LJ, { autoAlpha: 0, scale: 2.0 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in" }, T_LJ - 0.05);
SFX("hit", T_LJ + 0.15); K.shake(T_LJ + 0.15, 4, 0.3);
tl.to(LJ, { autoAlpha: 0, duration: 0.2 }, T_SIX - 0.1);
tl.to(BDG, { scale: 0.42, x: -700, y: 470, duration: 0.6, ease: "power3.inOut" }, T_SIX);
SFX("ref:whoosh", T_SIX - 0.05);
camTo(0, T_TOOK - 0.1, 1150, 520, 1.45, "sine.inOut");
B.showDate(T_SIX + 0.1); B.date("1944", T_SIX + 0.2, T_TOOK, 34);
const SIX = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 24px 12px;background:rgba(18,16,12,0.92);border-left:7px solid #c9b48a;color:#f7f3ea"><div style="font-size:18px;letter-spacing:0.3em;color:#c9b48a">JUNE – DECEMBER 1944</div><div style="font-size:36px;letter-spacing:0.1em">IN SIX MONTHS</div></div>`, "left:90px;top:230px;");
tl.fromTo(SIX, { autoAlpha: 0, x: -80 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power3.out" }, T_SIX + 0.1); tl.to(SIX, { autoAlpha: 0, duration: 0.1 }, T_TOOK - 0.06);
SFX("ref:pop", T_SIX + 0.15);
// target ring + white-box place + numbered date tag (stays to the end)
const ring = (p, name, date, n, t, dx, dy = -2) => {
  K.target(p[0], p[1], t, { r: 13, until: END + 1 });
  box(name, p[0] + dx, p[1] + dy, t + 0.1, 6.5);
  GG.pin(`<div style="display:flex;align-items:center;gap:2px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 1px 2px #000"><span style="display:inline-flex;width:10px;height:10px;border-radius:50%;border:1.4px solid #ffd54a;align-items:center;justify-content:center;font-size:6px">${n}</span><span style="font-size:8px;letter-spacing:.1em">${date}</span></div>`, p[0] + dx, p[1] + dy + 11, { t: t + 0.25, pop: true });
};
// slim arrow for the deep zooms (B.arrow's white casing is width + 10 map px, far too fat at 3.6x): body, thin casing, head, drawn on
const arrow = (pts, side, t, dur, w, until) => { const NS = "http://www.w3.org/2000/svg", g = document.createElementNS(NS, "g"), d = "M" + pts.map((q) => q.join(" ")).join(" L"), c = side === "rome" ? "#c4121f" : "#1f4fc4";
  const [x2, y2] = pts[pts.length - 1], [x1, y1] = pts[pts.length - 2], ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 90;
  g.innerHTML = `<path d="${d}" fill="none" stroke="#f7f3ea" stroke-width="${w + 0.9}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><polygon class="h" transform="translate(${x2} ${y2}) rotate(${ang.toFixed(1)})" points="${-w * 1.6},0.5 ${w * 1.6},0.5 0,${-w * 2.2}" fill="${c}" stroke="#f7f3ea" stroke-width="0.45"/>`;
  document.getElementById("overlay").appendChild(g); GG.hide(g);
  const ps = [...g.querySelectorAll("path")], len = ps[0].getTotalLength(); gsap.set(ps, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); gsap.set(g.querySelector(".h"), { scale: 0, transformOrigin: "50% 100%" });
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); tl.to(ps, { strokeDashoffset: 0, duration: dur, ease: "power2.inOut" }, t); tl.to(g.querySelector(".h"), { scale: 1, duration: 0.2 }, t + dur - 0.1);
  if (until != null) tl.to(g, { autoAlpha: 0, duration: 0.4 }, until); return g; };
// the overview flags step aside during the close cuts (each cut has its own small flags), back for the pull-out
tl.to([FG, FU, FB], { autoAlpha: 0, duration: 0.05 }, T_TOOK - 0.06); tl.to([FG, FU, FB], { autoAlpha: 1, duration: 0.4 }, T_THESE + 0.3);
// ---------- CUT 1: CHERBOURG, June 1944: arrows converge up the Cotentin, the fortress blows ----------
const CH0 = PLACE.cherbourg;
cut(T_TOOK, CH0[0] + 10, CH0[1] + 14, 3.6, T_BROKE);
B.date("JUNE 1944", T_TOOK + 0.02, T_BROKE, 34);
const fC = [flag(FL.us, "USA", ...G(49.33, -0.75), T_TOOK + 0.1, T_BROKE - 0.05, 14), flag(FL.de, "GERMANY", ...G(48.85, -0.6), T_TOOK + 0.15, T_BROKE - 0.05, 14)];
[[[1022, 553], [1022, 545], [1023, 537]], [[1040, 548], [1033, 541], [1028, 535]], [[1010, 545], [1015, 540], [1020, 535]]].forEach((p, k) => arrow(p, "carth", T_TOOK + 0.2 + k * 0.15, 0.8, 2.4, END + 1));
[[1025, 531], [1029, 530], [1022, 532]].forEach((q, k) => K.impact(q[0], q[1], T_CHER - 0.1 + k * 0.2, { r: 3.5 }));
ring(CH0, "CHERBOURG", "JUNE 1944", 1, T_CHER + 0.3, -26, -6); SFX("ref:pop", T_CHER + 0.45);
// ---------- CUT 2: SAINT-LO, July 1944: blue arrows burst south through the broken line ----------
const SL = PLACE.stlo;
cut(T_BROKE, SL[0] - 4, SL[1] + 10, 3.6, T_DEST, [0, 4, 1.05]);
const OV7 = wimg("assets/media/hooknorm_eu_ctl_jul25_mx.png", T_BROKE - 0.05, 0.1, T_DEST);
B.date("JULY 1944", T_BROKE + 0.02, T_DEST, 34);
const fS = [flag(FL.us, "USA", ...G(49.36, -0.6), T_BROKE + 0.1, T_DEST - 0.05, 14), flag(FL.de, "GERMANY", ...G(48.7, -0.55), T_BROKE + 0.15, T_DEST - 0.05, 14)];
[[[1049, 566], [1046, 580], [1040, 594]], [[1043, 565], [1036, 576], [1033, 590]], [[1055, 567], [1056, 578], [1052, 588]]].forEach((p, k) => arrow(p, "carth", T_BROKE + 0.25 + k * 0.15, 0.9, 2.6, END + 1));
[[1047, 571], [1040, 573], [1054, 572]].forEach((q, k) => K.impact(q[0], q[1], T_BROKE + 0.35 + k * 0.18, { r: 3.2 }));
ring(SL, "SAINT-LÔ", "JULY 1944", 2, T_NORM - 0.3, 24, -4); SFX("ref:pop", T_NORM - 0.15);
// ---------- CUT 3: CELLES, December 1944: the panzer spearhead stopped short of the Meuse, the ring closes ----------
const CE = PLACE.celles;
cut(T_DEST, CE[0] + 14, CE[1] - 2, 3.8, T_THESE, [-4, 0, 1.05]);
const OV12 = wimg("assets/media/hooknorm_eu_ctl_dec24_mx.png", T_DEST - 0.05, 0.1, null);
B.date("DECEMBER 1944", T_DEST + 0.02, null, 34);
const fE = [flag(FL.uk, "BRITAIN", ...G(50.42, 4.35), T_DEST + 0.12, T_THESE + 0.2, 13), flag(FL.us, "USA", ...G(50.62, 5.25), T_DEST + 0.1, T_THESE + 0.2, 13),
  flag(FL.de, "GERMANY", ...G(50.05, 5.95), T_DEST + 0.15, T_THESE + 0.2, 13)];
// the Meuse (Namur - Dinant - Givet), glowing
const MEU = [[1320.6, 466], [1320.6, 472.1], [1321.6, 480], [1322.5, 487.1], [1320.8, 492], [1318.8, 495.6], [1318, 501]];
const mp = document.createElementNS("http://www.w3.org/2000/svg", "path"); mp.setAttribute("d", "M" + MEU.map((q) => q.join(" ")).join(" L"));
mp.setAttribute("fill", "none"); mp.setAttribute("stroke", "#8fc4ee"); mp.setAttribute("stroke-width", "1.4"); mp.setAttribute("stroke-linecap", "round"); mp.style.filter = "drop-shadow(0 0 1.5px #8fc4ee)";
document.getElementById("overlay").appendChild(mp); gsap.set(mp, { opacity: 0 }); tl.to(mp, { opacity: 1, duration: 0.2 }, T_DEST + 0.05); tl.to(mp, { opacity: 0.55, duration: 0.5 }, T_THESE);
GG.lbl("MEUSE", 1312.5, 478, { size: 4.6, t: T_DEST + 0.2, color: "#bfe0f8" });
B.city("", ...PLACE.dinant, { r: 1.2, t: T_DEST + 0.15 }); box("DINANT", PLACE.dinant[0] - 9, PLACE.dinant[1] - 4, T_DEST + 0.15, 3.6, T_THESE, false);
// the red spearhead drives west from the Ardennes and stops just short of the river
const SP = arrow([[1380, 492], [1356, 491], [1338, 490], [1327.5, 489.5]], "rome", T_DEST + 0.2, 1.1, 3.2, END + 1);
SFX("ref:whoosh", T_DEST + 0.2);
const STOP = GG.pin(`<div style="width:2px;height:12px;background:#ffd54a;box-shadow:0 0 4px #ffd54a"></div>`, 1325.2, 489.4, { t: T_SPEAR + 0.3 });
SFX("hit", T_SPEAR + 0.35); K.shake(T_SPEAR + 0.35, 3, 0.25);
[[1327, 489], [1331, 491], [1329, 487.5], [1334, 489.5]].forEach((q, k) => K.impact(q[0], q[1], T_HIT - 0.3 + k * 0.22, { r: 2.6 }));
// the ring closes: blue arrows from the north (US 2nd Armored) and west (British tanks at the Meuse)
arrow([[1340, 477], [1336, 483], [1333, 487]], "carth", T_HIT + 0.2, 0.7, 1.8, END + 1);
arrow([[1345, 497], [1338, 495], [1333, 492]], "carth", T_HIT + 0.4, 0.7, 1.8, END + 1);
const RG = (() => { const c = document.createElementNS("http://www.w3.org/2000/svg", "circle"); c.setAttribute("cx", 1329.5); c.setAttribute("cy", 489.5); c.setAttribute("r", 5.2);
  c.setAttribute("fill", "none"); c.setAttribute("stroke", "#2c57b7"); c.setAttribute("stroke-width", "1.3"); c.style.filter = "drop-shadow(0 0 1.2px #6f9cf0)";
  document.getElementById("overlay").appendChild(c); const L0 = 2 * Math.PI * 5.2; gsap.set(c, { strokeDasharray: `${L0} ${L0}`, strokeDashoffset: L0, opacity: 0 });
  tl.to(c, { opacity: 1, duration: 0.01 }, T_FEW - 0.6); tl.to(c, { strokeDashoffset: 0, duration: 0.5, ease: "power2.in" }, T_FEW - 0.6); return c; })();   // the pocket ring slams shut
SFX("ref:boom", T_FEW - 0.1); K.shake(T_FEW - 0.1, 5, 0.35);
const FEW = box("STOPPED 4-5 MILES FROM THE MEUSE", CE[0] + 2, CE[1] + 11, T_MEUSE - 0.3, 3.8, T_THESE);
ring(CE, "CELLES", "DECEMBER 1944", 3, T_MEUSE + 0.15, 26, -6); SFX("ref:pop", T_MEUSE + 0.3);
// ---------- pull out to all three, then the title ----------
SFX("ref:whoosh", T_THESE - 0.1); SFX("ref:riser", T_THESE + 0.1);
camTo(T_THESE, 0.9, 1190, 520, 1.85, "power3.inOut");
camTo(T_THESE + 0.92, END - T_THESE - 0.9, 1190, 522, 1.95, "none");
tl.to(BDG, { autoAlpha: 0, duration: 0.4 }, T_THREE - 0.6);
const TDIM = scr("", "inset:0;background:linear-gradient(180deg,rgba(5,7,13,0) 35%,rgba(5,7,13,0.78) 75%);");
tl.fromTo(TDIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, T_THREE - 0.5);
const TITLE = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">COLLINS'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:28px;letter-spacing:0.3em;color:#ffd54a;margin-top:8px">1 CHERBOURG · 2 SAINT-LÔ · 3 CELLES</div></div>`, "left:0;right:0;top:720px;display:flex;justify-content:center;");
tl.fromTo(TITLE, { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power4.in" }, T_THREE - 0.26);
SFX("ref:boom", T_THREE); K.shake(T_THREE, 6, 0.4);
K.raiseTerritory();
B.finish();
