// INTRO v2 (hook-3 .. hook-4), Gavin #7. Basemap europe (z6). Follows STYLE_LOCK 1a (Rokossovsky hook v2 beats) in the current Gavin look.
// hook-3: hard cut to dark; Gavin's real photo badge (assets/media/gavin_head.png, US Army portrait, public domain) with a "?" plate;
//         one stamp per spoken detail (hit + small shake + red pulse): ORPHAN / PRIVATE AT 17 / LITTLE SCHOOLING, "20 YEARS LATER · GENERAL"
//         counter, RIFLE IN HAND (boom).
// hook-4: the NAME slams in over the badge; the map lights up (territory per date + flags), 4 COMBAT JUMPS IN 14 MONTHS (ticks 1-4,
//         a parachute on each jump); 3 snap cuts (black frame + hit + shake): 1 SICILY JUL 1943, 2 NORMANDY JUN 1944, 3 HOLLAND SEP 1944;
//         pull-out to all three, title card JAMES GAVIN'S 3 GREATEST TACTICAL MOVES (boom + shake). v1 kept in scenes-src/old/intro_v1.js.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const PR = GG.proj(6, 7093, 5051);
const US = "assets/media/us_flag_48star.png", UK = "assets/media/uk_flag.png", REICH = "assets/media/ger_reich_flag.png", ITA = "assets/media/italy_flag.png";
const PHOTO = "assets/media/gavin_head.png";
// ---------- helpers (from the locked reference rokossovsky hook-a / hook-b) ----------
const scr = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const slam = (el, t, o = {}) => {
  tl.fromTo(el, { autoAlpha: 0, scale: o.from || 2.2 }, { autoAlpha: 1, scale: 1, duration: o.dur || 0.24, ease: "power4.in" }, t);
  const tHit = t + (o.dur || 0.24) - 0.02;
  if (o.sfx !== false) SFX(o.sfx || "hit", tHit);
  if (o.boom) SFX("explosion", tHit);
  if (o.shake !== false) K.shake(tHit, o.shake || 4, 0.3);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.35 }, o.until);
  return el;
};
const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);display:inline-block;text-align:center;font-family:Oswald;font-weight:700;color:${c};border:${Math.max(4, Math.round(size / 9))}px solid ${c};padding:4px 22px 6px;background:rgba(14,12,10,0.74);box-shadow:0 10px 26px rgba(0,0,0,.55);white-space:nowrap"><div style="font-size:${size}px;letter-spacing:0.12em;line-height:1.1">${txt}</div>${sub ? `<div style="font-size:${Math.round(size * 0.36)}px;letter-spacing:0.22em;color:#d8cfb8">${sub}</div>` : ""}</div>`;
const legendHTML = (rows) => `<div style="display:flex;gap:26px;font-size:21px;letter-spacing:0.1em;align-items:center">${rows.map(([c, nm]) => `<span><b style="display:inline-block;width:20px;height:20px;background:${c};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`;
const flagPin = (src, name, lat, lon, t, until, w = 110) => { const [x, y] = PR(lat, lon); return GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:6px"><img src="${src}" style="width:${w}px;display:block;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${Math.round(w * 0.22)}px;color:#f7f3ea;letter-spacing:0.08em">${name}</div></div>`, x, y, { t, pop: true, until }); };
const chuteSVG = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.6))"><path d="M4 18 Q20 -4 36 18 Z" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2.5"/><line x1="5" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.6"/><line x1="35" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.6"/><line x1="20" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.6"/><circle cx="20" cy="35" r="3.2" fill="#f3eee2"/></svg>`;
const chute = (lat, lon, t, s = 26, until) => { const [x, y] = PR(lat, lon); return GG.pin(chuteSVG(s), x, y, { t, pop: true, until }); };
// world image (territory overlay) visible from frame 0 or cross-faded in/out
const wimg = (src, tIn, dIn, tOut) => {
  const el = document.createElement("img"); el.className = "wimg"; el.src = src; el.alt = "";
  Object.assign(el.style, { left: "0px", top: "0px", width: "2880px", height: "1620px" });
  worldEl.insertBefore(el, document.getElementById("overlay"));
  if (tIn > 0) tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: dIn, immediateRender: true }, tIn);
  if (tOut != null) tl.to(el, { autoAlpha: 0, duration: 0.25 }, tOut);
  return el;
};
// camera with explicit eases (snap cuts, pull-out)
const CW = 1920, CH = 1080, cam = { cx: 1400, cy: 850, s: 0.79 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
applyCam();
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// hard CUT: a 0.1 s black frame hides an instant camera jump (hit + shake; the locked zoom whoosh stays on the hook's 3 big moves)
const CUTB = scr("", "inset:0;background:#030406;");
const cut = (t, cx, cy, s, holdTo, drift = [20, 0, 1.05]) => {
  tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  camTo(t, 0.01, cx, cy, s); camTo(t + 0.02, holdTo - t - 0.1, cx + drift[0], cy + drift[1], s * drift[2], "sine.out");
  SFX("ref:whoosh", t - 0.2); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25);
};
// ---------- times (all from the spoken words) ----------
const H3 = "hook-3", H4 = "hook-4";
const T_ORPHAN = at(H3, "orphan"), T_PRIV = at(H3, "as a private"), T_LITTLE = at(H3, "with little"), T_TWENTY = at(H3, "Twenty years"), T_GENERAL = at(H3, "was a general");
const T_RIFLE = at(H3, "rifle"), S4 = PS(H4), T_JG = at(H4, "James Gavin."), T_FOUR = at(H4, "Four combat"), T_THREE_T = at(H4, "And three"), T_SLIP = at(H4, "slipping");
const T_TURN = at(H4, "turned it"), T_THESE = at(H4, "These are"), T_GREAT = at(H4, "three greatest");
const T_C1 = T_FOUR + 1.35, T_C2 = T_C1 + 2.05, T_C3 = T_C2 + 2.05;   // three snap cuts ~2.2 s each, the pull-out on "These are"
// =====================================================================================================================
// the map underneath (lit up in hook-4): September 1944 control map, grid, legend, big flags
// =====================================================================================================================
K.grid(PR, 32, 60, -22, 40, 5, 0);
const OV44 = wimg("assets/media/europe_ctl_sep44.png", 0, 0, null);
// =====================================================================================================================
// hook-3: hard cut to dark, the mystery badge, one stamp per spoken detail
// =====================================================================================================================
const BLK = scr("", "inset:0;background:#05070d;");
gsap.set(BLK, { autoAlpha: 1 });
tl.to(BLK, { autoAlpha: 0.86, duration: 0.5, ease: "power1.out" }, 0.25);
SFX("hit", 0.02);
const BD = scr(`<div style="display:flex;flex-direction:column;align-items:center;gap:18px">
  <div style="position:relative;width:380px;height:380px;border-radius:50%;overflow:hidden;border:9px solid #f3e7c4;box-shadow:0 0 0 6px #1f4fc4,0 20px 40px rgba(0,0,0,0.75);background:url(${US}) center/cover"><img src="${PHOTO}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)"></div>
  <div style="position:relative;width:640px;height:118px">
    <div class="q" style="position:absolute;left:0;right:0;top:0;padding:8px 34px 12px;background:rgba(18,16,12,0.94);border-top:6px solid #c4121f;color:#f7f3ea;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:64px;line-height:1.05;color:#ef6b62">?</div><div style="font-size:22px;letter-spacing:0.3em;color:#d8cfb8">WHO WAS HE?</div></div>
    <div class="pl" style="position:absolute;left:-60px;right:-60px;top:0;padding:12px 34px 14px;background:rgba(18,16,12,0.94);border-top:6px solid #1f4fc4;color:#f7f3ea;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:62px;letter-spacing:0.08em;line-height:1.1">JAMES M. GAVIN</div><div style="font-size:22px;letter-spacing:0.22em;color:#d8cfb8">US ARMY · 82ND AIRBORNE DIVISION</div></div></div></div>`,
  "left:0;right:0;top:170px;display:flex;justify-content:center;transform-origin:50% 30%;");
tl.fromTo(BD, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" }, 0.12);
tl.to(BD, { scale: 1.05, duration: S4 - 0.6, ease: "none" }, 0.55);
const PL = BD.querySelector(".pl"), Q = BD.querySelector(".q"); gsap.set(PL, { autoAlpha: 0 });
// stamps on each spoken beat (hit + small shake + red pulse)
const RED = scr("", "inset:0;background:radial-gradient(ellipse at center, rgba(200,20,30,0) 40%, rgba(200,20,30,0.45) 100%);");
const pulse = (t) => { tl.fromTo(RED, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, t); tl.to(RED, { autoAlpha: 0, duration: 0.5 }, t + 0.08); };
const STAMPS = [];
const sst = (txt, css, t, rot, size = 60, o = {}) => { pulse(t + 0.22); const el = slam(scr(stampHTML(txt, o.color || "#e3232f", size, rot, o.sub), css), t, { shake: o.shake || 5, boom: o.boom }); STAMPS.push(el); return el; };
sst("ORPHAN", "left:150px;top:300px;", T_ORPHAN + 0.1, -7, 76);
sst("PRIVATE AT 17", "right:130px;top:300px;", T_PRIV + 0.05, 5, 62);
sst("LITTLE SCHOOLING", "left:110px;top:600px;", T_LITTLE + 0.35, 4, 56);
// "Twenty years later he was a general": 0 -> 20 years, then GENERAL
const YR = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:6px 30px 10px;background:rgba(14,12,10,0.8)"><div style="font-size:20px;letter-spacing:0.4em;color:#c9b48a">YEARS LATER</div><div class="y" style="font-size:84px;line-height:1;color:#f7f3ea;letter-spacing:0.06em">0</div><div class="g" style="font-size:34px;letter-spacing:0.3em;color:#9fc0ff">GENERAL</div></div>`, "right:150px;top:90px;");
tl.fromTo(YR, { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power3.out" }, T_TWENTY - 0.05);
const yv = { v: 0 }, ye = YR.querySelector(".y"), yg = YR.querySelector(".g"); gsap.set(yg, { autoAlpha: 0 });
tl.to(yv, { v: 20, duration: 1.1, ease: "power1.inOut", onUpdate: () => { ye.textContent = Math.round(yv.v); } }, T_TWENTY + 0.15);
for (let k = 0; k < 8; k++) SFX("tick", T_TWENTY + 0.2 + k * 0.14);
tl.fromTo(yg, { autoAlpha: 0, scale: 1.8 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in" }, T_GENERAL + 0.05);
SFX("hit", T_GENERAL + 0.23); K.shake(T_GENERAL + 0.23, 3, 0.25);
sst("RIFLE IN HAND", "right:110px;top:600px;", T_RIFLE - 0.1, -4, 66, { boom: true, shake: 7 });
tl.to([...STAMPS, YR], { autoAlpha: 0, duration: 0.35 }, S4 - 0.3);
// =====================================================================================================================
// hook-4: the NAME slams in, the map lights up, 4 combat jumps, 3 snap cuts, title
// =====================================================================================================================
tl.to(Q, { autoAlpha: 0, duration: 0.1 }, T_JG - 0.15);
slam(PL, T_JG - 0.1, { from: 1.9, dur: 0.22, shake: 6 });
tl.to(BLK, { autoAlpha: 0, duration: 0.6, ease: "power2.out" }, T_FOUR - 0.45);
tl.to(BD, { scale: 0.4, x: -700, y: 360, duration: 0.55, ease: "power3.inOut" }, T_FOUR - 0.2);
const LEG = GG.card(legendHTML([["#2e5cb2", "ALLIES"], ["#be3a2a", "AXIS"], ["#807c72", "NEUTRAL"]]), "", 34, T_FOUR - 0.3, END + 1);
LEG.querySelector(".inner").style.cssText += "padding:12px 30px 14px;";
B.showDate(T_FOUR - 0.2); B.date("1943 – 1944", T_FOUR - 0.1, T_C1, 34);
const FG = flagPin(REICH, "GERMANY", 49.0, 13.5, T_FOUR, null, 120), FB = flagPin(UK, "BRITAIN", 51.8, -1.0, T_FOUR + 0.1, null, 120);
// 4 COMBAT JUMPS IN 14 MONTHS: the count ticks 1 -> 4, a parachute pops on each jump
const CNT = scr(`<div style="font-family:Oswald;font-weight:700;padding:10px 34px 12px;background:rgba(14,12,10,0.9);border-top:6px solid #6f9bff;color:#f7f3ea;box-shadow:0 18px 36px rgba(0,0,0,.55);white-space:nowrap;font-size:48px;letter-spacing:0.08em"><span class="n" style="color:#9fc0ff">1</span> COMBAT JUMPS IN 14 MONTHS</div>`, "left:0;right:0;top:880px;display:flex;justify-content:center;");
slam(CNT, T_FOUR + 0.05, { from: 1.7, dur: 0.22, shake: 4 });
const cnn = CNT.querySelector(".n");
const JUMPS = [[37.15, 14.35, "SICILY"], [40.55, 14.95, "SALERNO"], [49.42, -1.32, "NORMANDY"], [51.78, 5.92, "HOLLAND"]];
JUMPS.forEach(([la, lo], k) => { const t = T_FOUR + 0.3 + k * 0.32; chute(la, lo, t, 56, T_C1 - 0.06); SFX("tick", t); });
const cvv = { v: 1 }; tl.to(cvv, { v: 4, duration: 0.96, ease: "steps(3)", onUpdate: () => { cnn.textContent = String(Math.round(cvv.v)); } }, T_FOUR + 0.3);
tl.to(CNT, { autoAlpha: 0, duration: 0.3 }, T_THESE - 0.3);
// cut tag (screen, under the date): "1 · SICILY · JULY 1943" with a parachute
const tag = (n, txt, sub, t, until) => slam(scr(`<div style="display:flex;align-items:center;gap:16px;padding:10px 26px 12px 18px;background:rgba(18,16,12,0.92);border-left:8px solid #ffd54a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 12px 26px rgba(0,0,0,.6)">${chuteSVG(54)}
  <span style="display:inline-flex;width:52px;height:52px;border-radius:50%;border:5px solid #ffd54a;align-items:center;justify-content:center;font-size:30px;color:#ffd54a">${n}</span>
  <div><div style="font-size:46px;letter-spacing:0.1em;line-height:1.05">${txt}</div><div style="font-size:22px;letter-spacing:0.26em;color:#d8cfb8">${sub}</div></div></div>`, "left:90px;top:220px;transform-origin:0 50%;"), t + 0.05, { from: 1.5, dur: 0.2, sfx: false, shake: false, until });
// screen flag pair for the close cuts (both sides' period flags on every map shot)
const flagPair = (left, right, t, until) => { const f = (src, nm) => `<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><img src="${src}" style="width:92px;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,.55)"><div class="gg-lbl" style="position:relative;font-size:20px">${nm}</div></div>`;
  const el = scr(`<div style="display:flex;align-items:flex-start;gap:22px">${left.map((q) => f(...q)).join("")}<div style="font-family:Oswald;font-weight:700;font-size:30px;color:#f7f3ea;text-shadow:0 2px 4px #000;margin-top:14px">VS</div>${right.map((q) => f(...q)).join("")}</div>`, "right:90px;top:200px;");
  tl.fromTo(el, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.25 }, t); tl.to(el, { autoAlpha: 0, duration: 0.1 }, until); return el; };
const strike = (pts, t, dur, side = "rome", width = 7) => B.arrow({ pts, side, t, dur, width, until: T_THESE - 0.2 });
const P = (la, lo) => PR(la, lo);
tl.to([FG, FB], { autoAlpha: 0, duration: 0.05 }, T_C1 - 0.06); tl.to([FG, FB], { autoAlpha: 1, duration: 0.3 }, T_THESE + 0.3);
// ---------- CUT 1: SICILY, July 1943: scattered drop, German tanks driven at the beaches and stopped ----------
const S = P(37.08, 14.33);
const OV43 = wimg("assets/media/europe_ctl_jul43.png", T_C1 - 0.05, 0.05, T_C2);
cut(T_C1, S[0] + 10, S[1] - 20, 4.5, T_C2);
B.date("JULY 1943", T_C1 + 0.02, T_C2, 34);
tag(1, "SICILY", "JULY 1943 · MOVE 1", T_C1, T_C2 - 0.05);
flagPair([[US, "USA"]], [[REICH, "GERMANY"], [ITA, "ITALY"]], T_C1 + 0.1, T_C2 - 0.05);
[[37.35, 14.20], [37.12, 14.62], [37.28, 14.88], [36.92, 14.95], [37.48, 14.55]].forEach(([la, lo], k) => chute(la, lo, T_C1 + 0.15 + k * 0.12, 12, T_C2));
const AS = strike([P(37.40, 14.46), P(37.24, 14.40), P(37.12, 14.34)], T_C1 + 0.25, 0.7, "rome", 4);
K.impact(...P(37.12, 14.34), T_C1 + 1.0, { r: 6 }); K.impact(...P(37.17, 14.37), T_C1 + 1.2, { r: 5, shake: false, sfx: false });
B.greyArrow(AS, T_C1 + 1.15);
K.target(...S, T_C1 + 1.0, { r: 12, until: END + 1 });
// ---------- CUT 2: NORMANDY, June 1944: the German attack on the La Fiere causeway is held ----------
const N = P(49.40, -1.37);
const OV44a = wimg("assets/media/europe_ctl_jun44.png", T_C2 - 0.05, 0.05, T_C3);
tl.to(OV44, { autoAlpha: 0, duration: 0.01 }, T_C1 - 0.05); tl.to(OV44, { autoAlpha: 1, duration: 0.01 }, T_C3 - 0.05);
cut(T_C2, N[0] + 5, N[1] + 5, 4.5, T_C3, [-12, 0, 1.05]);
B.date("JUNE 1944", T_C2 + 0.02, T_C3, 34);
tag(2, "NORMANDY", "JUNE 1944 · MOVE 2", T_C2, T_C3 - 0.05);
flagPair([[US, "USA"]], [[REICH, "GERMANY"]], T_C2 + 0.1, T_C3 - 0.05);
[[49.47, -1.20], [49.32, -1.45], [49.58, -1.38], [49.28, -1.18], [49.50, -1.55]].forEach(([la, lo], k) => chute(la, lo, T_C2 + 0.15 + k * 0.12, 12, T_C3));
const AN = strike([P(49.37, -1.72), P(49.39, -1.56), P(49.40, -1.41)], T_C2 + 0.25, 0.7, "rome", 4);
K.impact(...P(49.40, -1.42), T_C2 + 1.0, { r: 6 }); K.impact(...P(49.39, -1.47), T_C2 + 1.2, { r: 5, shake: false, sfx: false });
B.greyArrow(AN, T_C2 + 1.15);
K.target(...N, T_C2 + 1.0, { r: 12, until: END + 1 });
// ---------- CUT 3: HOLLAND, September 1944: across the Waal at Nijmegen ----------
const H = P(51.84, 5.86);
cut(T_C3, H[0], H[1] + 8, 4.5, T_THESE, [0, -6, 1.05]);
B.date("SEPTEMBER 1944", T_C3 + 0.02, T_THESE + 0.2, 30);
tag(3, "HOLLAND", "SEPTEMBER 1944 · MOVE 3", T_C3, T_THESE);
flagPair([[US, "USA"], [UK, "BRITAIN"]], [[REICH, "GERMANY"]], T_C3 + 0.1, T_THESE - 0.05);
[[51.76, 5.98], [51.68, 5.84], [51.79, 6.10], [51.62, 6.02], [51.72, 5.72]].forEach(([la, lo], k) => chute(la, lo, T_C3 + 0.15 + k * 0.12, 12, T_THESE));
strike([P(51.74, 5.86), P(51.82, 5.86), P(51.92, 5.86)], T_C3 + 0.3, 0.6, "carth", 4);
["h1", "h2"].forEach((id, k) => { const [x, y] = P(51.93 + k * 0.02, 5.76 + k * 0.2); B.unit({ id, side: "rome", x, y, w: 12, h: 8 }); K.counter(id, { icon: "infantry", flag: "ger" }); tl.fromTo(B.units[id].el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, T_C3); });
K.impact(...P(51.93, 5.76), T_C3 + 0.95, { r: 6 }); K.impact(...P(51.95, 5.96), T_C3 + 1.15, { r: 6, shake: false, sfx: false });
B.grey(["h1", "h2"], T_C3 + 1.1, 0.3); B.hideUnits(["h1", "h2"], T_THESE - 0.1, 0.2);
K.target(...H, T_C3 + 1.0, { r: 12, until: END + 1 });
// ---------- pull out to all three (numbered rings), then the title ----------
camTo(T_THESE, 0.9, 1400, 850, 0.79, "power3.inOut");
camTo(T_THESE + 0.92, END - T_THESE - 0.9, 1400, 850, 0.82, "none");
B.date("1943 – 1944", T_THESE + 0.25, null, 34);
const mark = (n, lat, lon, dx, dy, anchor) => { const [x, y] = PR(lat, lon); return GG.pin(`<div style="display:flex;align-items:center;gap:8px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 2px 4px #000"><span style="display:inline-flex;width:52px;height:52px;border-radius:50%;border:5px solid #ffd54a;align-items:center;justify-content:center;font-size:30px;background:rgba(14,12,10,.7)">${n}</span><span style="font-size:30px;letter-spacing:.1em">${["", "SICILY", "NORMANDY", "HOLLAND"][n]}</span></div>`, x + dx, y + dy, { t: T_THESE + 0.6 + n * 0.12, pop: true, anchor }); };
mark(1, 37.08, 14.33, 30, 0, [0, -50]); mark(2, 49.40, -1.37, -30, 0, [-100, -50]); mark(3, 51.84, 5.86, 30, 10, [0, -50]);
tl.to(BD, { autoAlpha: 0, duration: 0.4 }, T_THESE + 0.2);
const TDIM = scr("", "inset:0;background:linear-gradient(200deg,rgba(5,7,13,0) 45%,rgba(5,7,13,0.8) 80%);");
tl.fromTo(TDIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, T_THESE + 0.4);
const TITLE = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">JAMES GAVIN'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:28px;letter-spacing:0.3em;color:#ffd54a;margin-top:8px">1 SICILY · 2 NORMANDY · 3 HOLLAND</div></div>`, "left:70px;top:700px;transform-origin:30% 50%;");
slam(TITLE, T_THESE + 0.95, { from: 1.7, dur: 0.26, shake: 6, boom: true });
B.finish();
