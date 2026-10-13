// HOOK-A (hook-1), Peng Dehuai #10. Basemap nwkorea_hd_ref (z9: Yalu -> Pyongyang, HD relief, dark Frontlines grade).
// Built with: python3 tools/build_scene.py hook-a nwkorea_hd_ref hook-1 hook-1
// LOCKED HOOK (STYLE_LOCK 1a, copied from rokossovsky/scenes-src/hook-a.js): frame 0 = North Korea, NOVEMBER 1950, NIGHT, option 1
// (hknw_ctl_nov24 = the 24 Nov front, tools/make_korea_control.py --nw); red UN columns already marching north up the valleys, blue
// counters sliding through the mountains, Chinese columns crossing the Yalu on dotted trails. 0.3 s: BIG card slams, ticks
// 0 -> 300,000 CHINESE SOLDIERS; IN SECRET stamp; dawn: red recon planes (c47g, prop sound) sweep over, every blue counter freezes
// and fades to a ghost under falling snow; NEVER SEEN stamp; "And the Americans": hard zoom-whoosh DIVE onto the Chongchon valley,
// red columns walk north between the ghost outlines; MacArthur's 24 Nov communique card. Peng = blue (carth), UN = red (rome).
// Facts: research/FACT_NOTES.md (Appleman: 300,000 men, none discovered before contact; MacArthur 24 Nov communique).
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const PR = GG.proj(9, 109971, 48858);
const L = (lat, lon) => PR(lat, lon);
const FL = { prc: "assets/media/prc_flag.png", us: "assets/media/us_flag_48star.png", rok: "assets/media/rok_flag_1949.png", un: "assets/media/un_flag.png" };
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
// ---------- helpers (Rokossovsky hook kit) ----------
const box = (txt, x, y, t, size = 16, until, pop = true) => { if (pop && t > 0) SFX("ref:pop", t); const el = GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${Math.round(size * 0.2)}px ${Math.round(size * 0.35)}px ${Math.round(size * 0.2)}px ${Math.round(size * 0.6)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t: t === 0 ? null : t, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const town = (txt, lat, lon, t, o = {}) => { const [x, y] = L(lat, lon); B.city("", x, y, { r: o.r || 6, t }); return box(txt, x + (o.dx || 0), y + (o.dy != null ? o.dy : -26), t, o.size || 16, o.until, false); };
const flag = (src, name, x, y, t, until, w = 76) => { const el = GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${Math.round(w * 0.05)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(1, Math.round(w / 40))}px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${Math.round(w * 0.22)}px;color:#f7f3ea;text-shadow:0 2px 4px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t: t === 0 ? null : t, pop: true, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const unitXY = (id, side, x, y, icon, flagSrc, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 34, h: o.h || 23, t: o.t, label: o.label });
  K.counter(id, { icon, flag: flagSrc, size: o.size });
  const tg = B.units[id].el.querySelector(".tag"); if (tg && o.tag) tg.style.fontSize = o.tag + "px";
  if (o.t == null) gsap.set(B.units[id].el, { autoAlpha: 1 });
  return id;
};
const unit = (id, side, lat, lon, icon, flagSrc, o = {}) => unitXY(id, side, ...L(lat, lon), icon, flagSrc, o);
const go = (id, t, dur, lat, lon, ease) => { const [x, y] = L(lat, lon); B.move(id, t, dur, x, y, ease || "power1.inOut"); };
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in" }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(4, Math.round(size / 9))}px solid ${c};padding:4px 22px 6px;background:rgba(14,12,10,0.72);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.36)}px;letter-spacing:0.22em;color:#d8cfb8">${sub}</div>` : ""}</div>`;
const legend = (t, until) => { const html = `<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "CHINESE &amp; NORTH KOREAN"], ["#be3a2a", "UN COMMAND"]].map(([sq, nm]) => `<span><b style="display:inline-block;width:20px;height:20px;background:${sq};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`;
  if (t > 0) return GG.card(html, "", 34, t, until);
  const el = document.createElement("div"); el.className = "gg-card"; el.style.top = "34px"; el.innerHTML = `<div class="inner">${html}</div>`;
  scene.insertBefore(el, document.getElementById("credit")); if (until != null) GG.fadeOut(el, until, 0.6); return el; };
const img0 = (src, until, mx) => { const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px" }); if (mx) el.style.mixBlendMode = "multiply";
  worldEl.insertBefore(el, document.getElementById("overlay")); if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.6 }, until); return el; };
const date0 = (text, until) => { const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "32px";
  document.getElementById("date").appendChild(d); if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.3 }, until); };
const CW = 1920, CH = 1080, cam = { cx: 1440, cy: 810, s: 0.667 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
applyCam();
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// a counter freezes and turns into a ghost outline (hidden under camouflage + snow)
const ghost = (ids, t) => ids.forEach((id, k) => { const el = B.units[id].el;
  tl.to(el, { opacity: 0.3, filter: "grayscale(1) brightness(1.7)", duration: 0.5, ease: "power2.out" }, t + k * 0.06); });
// ---------- times (from the spoken words) ----------
const H1 = "hook-1";
const T_SOLD = at(H1, "soldiers."), T_MARCH = at(H1, "Marched"), T_SECRET = at(H1, "in secret"), T_NOT = at(H1, "not one unit"), T_SPOT = at(H1, "spotted"),
  T_AIR = at(H1, "from the air"), T_AND = at(H1, "And the Americans"), T_WALK = at(H1, "walking into"), T_BEL = at(H1, "believed"), T_OVER = at(H1, "almost over");
// ---------- map layers (option 1, 24 Nov 1950) ----------
img0("assets/media/hknw_ctl_nov24_mx.png", null, true);
img0("assets/media/nwkorea_geo_ref.png");   // rivers + big towns (move 1 agent's nwkorea geo layer, read-only)
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.2 }); LV.scaleBar(234.56); LV.north();
const EM = L(41.50, 125.20);   // PRC emblem on Manchuria, clear of the Yalu and the sea
const EMB = document.createElement("img"); EMB.className = "wimg"; EMB.src = "assets/media/emblem_prc.png"; EMB.alt = ""; EMB.onerror = () => { EMB.style.display = "none"; };
Object.assign(EMB.style, { left: EM[0] - 130 + "px", top: EM[1] - 130 + "px", width: "260px", height: "260px", opacity: 0.8 }); worldEl.insertBefore(EMB, document.getElementById("overlay"));
// NIGHT at frame 0 (the Chinese march by night), dawn on "not one unit was spotted"
const NIGHT = GG.night(0, T_NOT - 0.6, { dur: 0.01, outDur: 1.2 }); tl.set(NIGHT, { opacity: 0.62 }, 0.02);
date0("NOVEMBER 1950", T_SPOT - 0.35);
legend(0, null);
const WF = [flag(FL.prc, "CHINA", ...L(40.80, 124.25), 0, T_AND - 0.2, 150), flag(FL.us, "USA", ...L(39.32, 126.55), 0, T_AND - 0.2, 120),
  flag(FL.rok, "SOUTH KOREA", ...L(39.10, 125.30), 0, T_AND - 0.2, 120), flag(FL.un, "UNITED NATIONS", ...L(40.30, 128.25), 0, T_AND - 0.2, 120)];
const WT = [];   // towns + rivers come from nwkorea_geo_ref.png
const YALU = document.createElement("div");
// red UN columns strung out on the valley roads, marching north from frame 0
const RED = [["r1", 39.60, 125.18, 39.80, 125.26, "infantry", FL.us], ["r2", 39.78, 125.62, 39.95, 125.72, "infantry", FL.rok], ["r3", 39.70, 125.92, 39.88, 125.99, "infantry", FL.us],
  ["r4", 39.58, 126.08, 39.76, 126.16, "tank", FL.us], ["r5", 39.62, 126.34, 39.78, 126.42, "infantry", FL.rok], ["r6", 40.20, 127.10, 40.40, 127.10, "infantry", FL.us],
  ["r7", 40.75, 127.55, 41.00, 127.85, "infantry", FL.us]];
RED.forEach(([id, la, lo, la2, lo2, ic, f], i) => { unit(id, "rome", la, lo, ic, f, { w: 64, h: 43 }); go(id, 0, 7.0 + (i % 3) * 0.6, la2, lo2, "none"); });
// blue counters already in the mountains, sliding forward through the dark
const BLUE = [["b1", 40.30, 125.40, 40.12, 125.50], ["b2", 40.35, 125.95, 40.16, 125.98], ["b3", 40.30, 126.40, 40.10, 126.38], ["b4", 40.05, 126.85, 39.92, 126.65],
  ["b5", 40.55, 126.80, 40.40, 126.92], ["b6", 40.80, 127.20, 40.62, 127.30], ["b7", 40.05, 125.05, 39.95, 125.18]];
BLUE.forEach(([id, la, lo, la2, lo2], i) => { unit(id, "carth", la, lo, i % 3 === 1 ? "mech" : "infantry", FL.prc, { w: 64, h: 43 }); go(id, 0, T_NOT - 0.8, la2, lo2, "power1.out"); });
// ---------- 0.3 s: the BIG card slams in and ticks to 300,000 ----------
const BIG = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:14px 56px 16px;background:rgba(14,12,10,0.88);border-top:8px solid #2e5cb2;box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div class="n" style="font-size:150px;line-height:1;color:#f7f3ea;letter-spacing:0.02em">0</div>
  <div style="font-size:40px;letter-spacing:0.26em;color:#9fc0ea;margin-top:2px">CHINESE SOLDIERS</div>
  <div style="font-size:17px;letter-spacing:0.2em;color:#c9b48a;margin-top:6px">OCTOBER - NOVEMBER 1950 · INTO NORTH KOREA</div></div>`, "right:90px;top:560px;transform-origin:50% 40%;");
slam(BIG, 0.3, { from: 1.9, dur: 0.22, shake: 6 });
const cv = { v: 0 }, cn = BIG.querySelector(".n"), T_C0 = 0.55, T_C1 = T_SOLD + 0.45;
tl.to(cv, { v: 300000, duration: T_C1 - T_C0, ease: "power2.out", onUpdate: () => { cn.textContent = (Math.round(cv.v / 1000) * 1000).toLocaleString("en-US"); } }, T_C0);
for (let t = T_C0; t < T_C1 - 0.1; t += 0.14) SFX("tick", t);
// "Marched into North Korea in secret": dotted march trails over the Yalu (Sinuiju, Chosan, Manpojin), new columns at their ends
const TRAILS = [[[40.55, 124.55], [40.25, 124.75], [40.10, 125.05]], [[41.10, 125.55], [40.80, 125.75], [40.50, 125.82]], [[41.45, 126.15], [41.15, 126.30], [40.80, 126.45]]];
TRAILS.forEach((p, k) => B.arrow({ pts: p.map(([a, b]) => L(a, b)), side: "carth", t: T_MARCH + k * 0.3, dur: 1.4, width: 9, dash: "4 14", until: T_SPOT - 0.3 }));
SFX("ref:whoosh", T_MARCH + 0.05);
const NEWB = [unit("n1", "carth", 40.10, 125.05, "infantry", FL.prc, { w: 64, h: 43, t: T_MARCH + 1.3 }), unit("n2", "carth", 40.50, 125.82, "infantry", FL.prc, { w: 64, h: 43, t: T_MARCH + 1.6 }),
  unit("n3", "carth", 40.80, 126.45, "infantry", FL.prc, { w: 64, h: 43, t: T_MARCH + 1.9 })];
SFX("ref:pop", T_MARCH + 1.4);
const SEC = scr(stampHTML("IN SECRET", "#9fc0ea", 50, -5, "BY NIGHT · ON FOOT"), "right:330px;top:885px;");
slam(SEC, T_SECRET + 0.2, { shake: 4 });
// ---------- dawn: a red recon plane sweeps over; the blue columns freeze and become ghosts under the snow ----------
K.aircraft({ kind: "c47g", side: "rome", size: 80, alt: 18, path: false, pts: [L(38.40, 126.70), L(39.70, 126.95), L(40.90, 127.20), L(42.60, 127.50)], t: T_NOT - 0.6, dur: 4.6 });
ghost([...BLUE.map((b) => b[0]), ...NEWB], T_NOT + 0.2);
B.snow(T_NOT, END + 1);
tl.to([BIG, SEC], { autoAlpha: 0, y: -40, duration: 0.35, ease: "power2.in" }, T_SPOT - 0.6);
// ---------- hard zoom-whoosh DIVE onto the Chongchon valley (~6 s) ----------
const TD = T_SPOT - 0.45;
camTo(0, TD, 1440, 790, 0.74, "sine.inOut");
SFX("whoosh", TD - 0.05);
camTo(TD, 0.75, 1450, 875, 1.95, "expo.inOut");
camTo(TD + 0.76, END - TD - 0.76, 1462, 868, 2.12, "sine.inOut");
B.hideUnits([...RED.map((r) => r[0]), ...BLUE.map((b) => b[0]), ...NEWB], TD + 0.05, 0.3);
tl.to([...WF, ...WT, YALU], { autoAlpha: 0, duration: 0.25 }, TD + 0.05);
B.date("24 NOVEMBER 1950", TD + 0.45, null, 32);
// close set: towns, the river, both sides' flags on their own ground
town("UNSAN", 39.96, 125.83, TD + 0.6, { size: 11, r: 4, dx: -40, dy: -16 }); town("KUNU-RI", 39.50, 125.93, TD + 0.65, { size: 11, r: 4, dy: 18 });
town("TOKCHON", 39.75, 126.30, TD + 0.7, { size: 11, r: 4, dx: 52, dy: -16 });
flag(FL.us, "USA", ...L(39.40, 126.18), TD + 0.8, null, 46); flag(FL.rok, "SOUTH KOREA", ...L(39.42, 125.60), TD + 0.85, null, 46);
flag(FL.prc, "CHINA", ...L(40.08, 126.75), TD + 0.9, null, 46);
// the Chinese in the ridges, frozen as the plane passes: ghosts
const GH = [["g1", 40.03, 125.55], ["g2", 40.06, 125.92], ["g3", 40.00, 126.22], ["g4", 39.88, 126.55], ["g5", 39.66, 126.58], ["g6", 39.95, 125.38], ["g7", 40.10, 126.40]];
GH.forEach(([id, la, lo], i) => { unit(id, "carth", la, lo, "infantry", FL.prc, { w: 30, h: 20, t: TD + 0.7 + i * 0.06 }); });
SFX("ref:pop", TD + 0.75);
K.aircraft({ kind: "c47g", side: "rome", size: 70, alt: 16, path: false, pts: [L(39.30, 125.55), L(39.85, 125.90), L(40.60, 126.32), L(41.6, 126.9)], t: T_SPOT - 0.1, dur: 4.6, sfx: false });
GH.forEach(([id], i) => tl.to(B.units[id].el, { opacity: 0.42, filter: "grayscale(1) brightness(1.8)", duration: 0.35 }, T_SPOT + 0.5 + i * 0.07));
SFX("ref:pop", T_SPOT + 0.55);
const NS_ = scr(stampHTML("NEVER SEEN", "#e3232f", 64, -6, "NOT ONE UNIT SPOTTED FROM THE AIR"), "right:110px;top:190px;");
slam(NS_, T_AIR, { shake: 5 });
tl.to(NS_, { autoAlpha: 0, y: -30, duration: 0.3 }, T_WALK - 0.2);
// "And the Americans walking into those mountains": the red columns march north up the valleys
const CR = [["c1", 39.66, 125.42, 39.78, 125.48, FL.us, "24TH DIV"], ["c2", 39.82, 125.70, 39.92, 125.76, FL.rok, "ROK 1ST"], ["c3", 39.72, 125.94, 39.84, 125.99, FL.us, "25TH DIV"],
  ["c4", 39.62, 126.08, 39.76, 126.13, FL.us, "2ND DIV"], ["c5", 39.62, 126.30, 39.70, 126.36, FL.rok, "ROK II CORPS"]];
CR.forEach(([id, la, lo, la2, lo2, f, lb], i) => { unit(id, "rome", la, lo, "infantry", f, { w: 30, h: 20, t: T_AND - 0.1 + i * 0.12, label: lb, tag: 8 }); go(id, T_AND + 0.4, END - T_AND - 0.4, la2, lo2, "none"); });
SFX("ref:pop", T_AND);
CR.forEach(([id, la, lo, la2, lo2], i) => B.arrow({ pts: [L(la, lo), L((la + la2) / 2 + 0.04, (lo + lo2) / 2), L(la2 + 0.09, lo2 + 0.02)], side: "rome", t: T_WALK + i * 0.12, dur: 1.2, width: 6, until: END + 1 }));
// "believed the war was almost over": MacArthur's communique (24 Nov), verbatim words
const MAC = scr(`<div style="display:flex;align-items:center;gap:20px;padding:14px 30px 16px 16px;background:rgba(18,16,12,0.93);border-left:8px solid #c4121f;box-shadow:0 18px 36px rgba(0,0,0,.6);font-family:Oswald;font-weight:700;color:#f7f3ea">
  <div style="position:relative;width:118px;height:118px;border-radius:50%;overflow:hidden;border:5px solid #f3e7c4;box-shadow:0 0 0 3px #c4121f;background:url(${FL.us}) center/cover"><img src="assets/media/macarthur_head.png" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div>
  <div><div style="font-size:20px;letter-spacing:0.28em;color:#ef8a82">MACARTHUR · 24 NOV 1950</div><div style="font-size:50px;letter-spacing:0.05em;line-height:1.08">"FOR ALL PRACTICAL PURPOSES<br>END THE WAR"</div></div></div>`,
  "right:90px;top:170px;transform-origin:80% 40%;");
slam(MAC, T_BEL - 0.1, { from: 1.6, shake: 4 });
// the ghosts in the ridges stir once: they are still there
tl.to(GH.map((g) => B.units[g[0]].el), { scale: 1.35, duration: 0.18, yoyo: true, repeat: 1, stagger: 0.05 }, T_OVER - 0.1);
SFX("ref:pop", T_OVER);
K.raiseTerritory();
B.finish();
