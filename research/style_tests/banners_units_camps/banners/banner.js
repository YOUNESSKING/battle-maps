// GENERAL'S BANNER ON A POLE (TEST 2026-11-10; research/style_tests/banners_units_camps/banners/).
// The owner's reference (Yarmouk video: research/style_tests/roads_towns/owner_ref_yarmouk.png, crops ../ref_banner_vahan.png,
// ../ref_banner_khalid.png) adapted to 1863: a rope-wrapped pole planted at the general's position, crest finial (Union gilt eagle,
// Confederate gilt spear point), cream scroll-edged name plaque hanging on two chains, rope crossbar with gilt ends, cloth in the
// side's colour with the portrait painted on it + two swallowtail streamers, a second crossbar and a lower pennant carrying the
// national flag of the date (US 34 stars to 30 Jun 1863, 35 stars from 4 Jul 1863; CS First National "Stars and Bars"; NEVER the
// battle flag). Soft cast shadow on the ground + contact shadow; gentle cloth sway (~3.6 s loop) driven by the scene timeline
// (seekable, so the render is deterministic).
// Palette: ivory #efe3c8, antique gold #c8a86a / #ead39a, warm charcoal #15110c; Cinzel 700 on the plaque.
//
// DROP-IN for pinPortrait (same arguments, same returned element, same DOM contract):
//   w.firstElementChild               = the banner ("card"; the scenes' scale pop grows it from the pole foot)
//   card.querySelectorAll("img")[0/1] = flag (pennant) / photo (the reveal swaps img[1].src)
//   card.lastElementChild             = the name plaque (an old-style reveal's appended div is styled as a plaque by CSS)
//   w.lastElementChild                = the cast shadow on the ground
// Footprint (screen px, counter-scaled by the camera like every pin): 124 x 209 (finial tip 9 px above the 200 px box), pole foot at the anchor.
//
// API (globals from the kit: B, tl, gsap):
//   pinBanner(id, photo, flag, name, t, until, keep = false, side = "up")   same as pinPortrait (side: up/right/left/west/ne)
//   BN.reveal(w, photo, name, t)   name reveal: photo swap + plaque text change at t (the scene keeps its own pop + SFX)
//   BN.build(photo, flag, name, side, union?)  bare element, no timeline (preview); union guessed from the flag file name
//   BN.sway(w, t, end)             add the cloth sway to tl from t to end (pinBanner calls it; end null = the scene #root data-duration)
//   BN.flagFor(side, iso, base)    "us"/"cs" + "1863-07-04" -> the right flag file (us34 / us35 / csa1_13)
//   BN.MYST                         transparent "?" silhouette painted on the cloth (scenes may keep their own MYST)
//   BN_FONT_BASE                    set before this file to change the font folder (default "assets/fonts/")
const BN = (() => {
  const C = { ivory: "#efe3c8", gold: "#c8a86a", goldHi: "#ead39a", goldLo: "#8f6f36", goldDk: "#5e4620", char: "#15110c", ink: "#2a1c0d" };
  const SIDE = {
    us: { cloth: "#25407e", clothHi: "#3a5ca3", clothLo: "#132551", str: "#1b3168", strLo: "#0f1d40", pen: "#1d356c" },
    cs: { cloth: "#8c2520", clothHi: "#b23a30", clothLo: "#55130f", str: "#8f8b80", strLo: "#55524a", pen: "#7a201c" },
  };
  const FB = typeof BN_FONT_BASE === "string" ? BN_FONT_BASE : (typeof PC_FONT_BASE === "string" ? PC_FONT_BASE : "assets/fonts/");
  // layout (px, card coordinates; card = 124 x 200, pole axis at X, foot at the bottom)
  const CW = 124, CH = 200, X = 62;
  const L = { finT: -9, plT: 25, plH: 25, bar1: 55, clT: 58, clW: 66, clH: 92, bar2: 150, peT: 153, peW: 46, peH: 23, stW: 9, stH: 70, stGap: 4, bar1W: 102, bar2W: 86 };
  const rope = (ang) => `repeating-linear-gradient(${ang}deg,#f3e7c6 0 1.5px,#d6c296 1.5px 2.3px,#8f7650 2.3px 3.1px)`;
  const css = `
@font-face{font-family:"Cinzel";font-weight:700;src:url("${FB}cinzel-latin-700-normal.woff2") format("woff2")}
@font-face{font-family:"Cinzel";font-weight:600;src:url("${FB}cinzel-latin-600-normal.woff2") format("woff2")}
.bn{--bn-sw:0;--bn-a:calc(var(--bn-sw) * 1.74533rad);position:absolute;width:${CW}px;height:${CH}px;transform-origin:50% 100%;
  filter:drop-shadow(.8px 1px .5px rgba(10,7,3,.55)) drop-shadow(4px 6px 4px rgba(10,7,3,.32))}
.bn>*{position:absolute;z-index:1}
.bn-pole{z-index:0 !important;left:${X - 2.4}px;width:4.8px;top:18px;height:${CH - 18}px;border-radius:2px 2px 1px 1px;
  background:linear-gradient(90deg,rgba(40,26,8,.55),rgba(255,255,255,0) 30%,rgba(255,250,230,.25) 48%,rgba(40,26,8,.0) 62%,rgba(40,26,8,.6)),${rope(-58)}}
.bn-pole::after{content:"";position:absolute;left:.3px;right:.3px;bottom:-3px;height:5px;background:linear-gradient(90deg,#3a2a14,#6b5230 50%,#2a1c0d);clip-path:polygon(0 0,100% 0,50% 100%)}
.bn-bar{height:4.4px;border-radius:2px;
  background:linear-gradient(180deg,rgba(255,250,230,.3),rgba(255,255,255,0) 40%,rgba(40,26,8,.55)),${rope(32)}}
.bn-end{width:12px;height:12px;margin:-4px 0 0 0}
.bn-svg{overflow:visible;pointer-events:none}
.bn-cloth,.bn-str,.bn-pen{transform-origin:50% 0}
.bn .bn-cloth{transform:rotate(calc(sin(var(--bn-a)) * .9deg)) skewX(calc(sin(var(--bn-a)) * -.7deg))}
.bn .bn-str{transform:rotate(calc(sin(var(--bn-a) - .7rad) * 2.3deg))}
.bn .bn-str+.bn-str{transform:rotate(calc(sin(var(--bn-a) - 1.1rad) * 2.3deg))}
.bn .bn-pen{transform:rotate(calc(sin(var(--bn-a) - .5rad) * -2.2deg)) skewX(calc(sin(var(--bn-a) - .5rad) * 1deg))}
.bn .bn-sheen{background-position-x:calc(-5px + sin(var(--bn-a) - .3rad) * 35px)}
.bn-cloth{left:${X - L.clW / 2}px;top:${L.clT}px;width:${L.clW}px;height:${L.clH}px;overflow:hidden;
  background:var(--bn-cloth)}
.bn-cloth::before{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;
  background:linear-gradient(90deg,rgba(0,0,0,.34),rgba(255,255,255,.07) 14%,rgba(0,0,0,.10) 33%,rgba(255,255,255,.09) 55%,rgba(0,0,0,.14) 76%,rgba(255,255,255,.05) 88%,rgba(0,0,0,.36)),
    linear-gradient(180deg,rgba(0,0,0,.35),rgba(0,0,0,0) 9%,rgba(0,0,0,0) 90%,rgba(0,0,0,.25))}
.bn-cloth::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;z-index:3;
  background:repeating-linear-gradient(90deg,${C.goldHi} 0 1px,${C.goldLo} 1px 2px),${C.gold};box-shadow:0 -0.75px 0 ${C.goldDk}}
.bn-sheen{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(100deg,rgba(255,250,235,0) 30%,rgba(255,250,235,.13) 46%,rgba(255,250,235,0) 62%) -40px 0/160% 100% no-repeat;mix-blend-mode:screen}
.bn-ph{position:absolute;left:4px;right:4px;top:4px;bottom:7px;overflow:hidden;z-index:1;
  background:radial-gradient(ellipse 75% 62% at 50% 38%,var(--bn-hi) 0%,var(--bn-cloth) 62%,var(--bn-lo) 100%);
  box-shadow:inset 0 0 0 .8px rgba(234,211,154,.75),inset 0 0 0 1.8px rgba(20,12,4,.45),inset 0 0 8px rgba(10,6,2,.55)}
.bn-ph img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 16%;
  filter:grayscale(1) sepia(.62) contrast(1.3) brightness(.86) saturate(1.15) drop-shadow(0 0 2px rgba(10,6,2,.35))}
.bn-ph::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 80% 72% at 50% 42%,rgba(20,12,4,0) 55%,rgba(20,12,4,.38) 100%),
    repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 1px,rgba(0,0,0,.035) 1px 2px)}
.bn-str{top:${L.clT}px;width:${L.stW}px;height:${L.stH}px;
  background:linear-gradient(90deg,rgba(0,0,0,.35),rgba(255,255,255,.12) 45%,rgba(0,0,0,.3)),var(--bn-str);
  clip-path:polygon(0 0,100% 0,100% 100%,50% 86%,0 100%);box-shadow:inset 0 0 0 .6px var(--bn-strLo)}
.bn-pen{left:${X - L.peW / 2}px;top:${L.peT}px;width:${L.peW}px;height:${L.peH}px;
  background:linear-gradient(90deg,rgba(0,0,0,.3),rgba(255,255,255,.08) 40%,rgba(0,0,0,.3)),var(--bn-pen);
  clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}
.bn-pen img{position:absolute;left:4px;top:2.5px;width:${L.peW - 8}px;height:${L.peH - 6}px;object-fit:cover;
  box-shadow:0 0 0 .7px ${C.gold},0 0 0 1.4px rgba(0,0,0,.55);filter:saturate(.85) contrast(1.03) brightness(.97)}
.bn-pen::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:repeating-linear-gradient(90deg,${C.goldHi} 0 1px,${C.goldLo} 1px 2px)}
.bn-name,.bn-name~div{position:absolute !important;top:${L.plT}px !important;bottom:auto !important;right:auto !important;left:var(--pl-l) !important;width:var(--pl-w) !important;
  height:${L.plH}px !important;box-sizing:border-box;padding:0 !important;line-height:${L.plH + 1}px !important;text-align:center;white-space:nowrap;
  font-family:"Cinzel","Liberation Serif",Georgia,serif !important;font-weight:700 !important;font-size:var(--pl-fs,13.5px) !important;letter-spacing:var(--pl-ls,.03em);
  color:${C.ink} !important;background:none !important;border:0 !important;text-shadow:0 .6px 0 rgba(255,250,235,.55) !important;isolation:isolate;
  filter:drop-shadow(0 0 .45px #3a2812) drop-shadow(0 0 .45px #3a2812) drop-shadow(1px 2px 1.5px rgba(10,7,3,.45))}
.bn-name::before,.bn-name~div::before{content:"";position:absolute;inset:0;z-index:-1;
  background:linear-gradient(180deg,#f7eed7 0%,${C.ivory} 45%,#dccbaa 100%);
  -webkit-mask:radial-gradient(circle at 0 0,#0000 4.2px,#000 4.8px) 0 0/51% 51% no-repeat,radial-gradient(circle at 100% 0,#0000 4.2px,#000 4.8px) 100% 0/51% 51% no-repeat,
    radial-gradient(circle at 0 100%,#0000 4.2px,#000 4.8px) 0 100%/51% 51% no-repeat,radial-gradient(circle at 100% 100%,#0000 4.2px,#000 4.8px) 100% 100%/51% 51% no-repeat;
  mask:radial-gradient(circle at 0 0,#0000 4.2px,#000 4.8px) 0 0/51% 51% no-repeat,radial-gradient(circle at 100% 0,#0000 4.2px,#000 4.8px) 100% 0/51% 51% no-repeat,
    radial-gradient(circle at 0 100%,#0000 4.2px,#000 4.8px) 0 100%/51% 51% no-repeat,radial-gradient(circle at 100% 100%,#0000 4.2px,#000 4.8px) 100% 100%/51% 51% no-repeat}
.bn-name::after,.bn-name~div::after{content:"";position:absolute;inset:2.4px 6px;z-index:-1;border-top:.6px solid rgba(120,88,44,.45);border-bottom:.6px solid rgba(120,88,44,.45)}
.bn-gnd{position:absolute;pointer-events:none;width:26px;height:8px;border-radius:50%;
  background:radial-gradient(ellipse at 50% 50%,rgba(14,10,4,.72) 0%,rgba(14,10,4,.3) 45%,rgba(14,10,4,0) 72%)}
.bn-cast{position:absolute;pointer-events:none;width:92px;height:16px;transform-origin:0 50%;transform:rotate(24deg) skewX(-10deg);
  background:radial-gradient(ellipse 100% 50% at 0% 50%,rgba(14,10,4,.30) 0%,rgba(14,10,4,.16) 45%,rgba(14,10,4,0) 100%);filter:blur(1.5px)}`;
  let done = false;
  const inject = () => { if (done || typeof document === "undefined") return; done = true; const st = document.createElement("style"); st.id = "bn-css"; st.textContent = css; document.head.appendChild(st); };
  // plaque fit: measured Cinzel 700 advances (em), font 13.5 px down to 12 px (phone-readable), plaque 58-150 px wide (wider than the crossbar only for long names)
  const ADV = { A: .72, B: .67, C: .78, D: .83, E: .63, F: .6, G: .84, H: .86, I: .39, J: .38, K: .76, L: .62, M: .95, N: .86, O: .88, P: .66, Q: .88, R: .75, S: .58, T: .67,
    U: .82, V: .73, W: .97, X: .73, Y: .7, Z: .66, a: .64, b: .6, c: .68, d: .75, e: .56, f: .53, g: .73, h: .75, i: .35, j: .34, k: .67, l: .55, m: .86, n: .78, o: .78, p: .59,
    q: .77, r: .66, s: .51, t: .6, u: .7, v: .64, w: .87, x: .65, y: .64, z: .61, " ": .25, ".": .22, "'": .2, "-": .38, "?": .55 };
  const fit = (name) => { const s = String(name), n = s.length, em = [...s].reduce((a, ch) => a + (ADV[ch] ?? .7), 0) + 0.03 * n, PAD = 20, MAXW = 150;
    const fs = Math.max(12, Math.min(13.5, (MAXW - PAD) / Math.max(em, 1))), w = Math.max(58, Math.min(MAXW, fs * em + PAD));
    const over = fs * em + PAD - MAXW, ls = over > 0 ? (0.03 * fs - Math.min(1, over / n)).toFixed(2) + "px" : ".03em";
    return { w, s: `--pl-fs:${fs.toFixed(2)}px;--pl-ls:${ls};--pl-w:${w.toFixed(1)}px;--pl-l:${(X - w / 2).toFixed(1)}px` }; };
  // gilt gradient defs (unique ids per banner)
  let uid = 0;
  const gilt = (id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e4ad"/><stop offset=".35" stop-color="${C.gold}"/><stop offset=".6" stop-color="#8a6a32"/><stop offset=".8" stop-color="#e2c88e"/><stop offset="1" stop-color="#6e5226"/></linearGradient></defs>`;
  // crest finials, drawn 30 x 24, shown at 40 x 32 (pole tip at the bottom centre)
  const EAGLE = (g) => `<svg class="bn-svg" width="40" height="32" viewBox="0 0 30 24">${gilt(g)}<g fill="url(#${g})" stroke="#3b2a12" stroke-width=".5" stroke-linejoin="round">
    <circle cx="15" cy="20.6" r="2.7"/>
    <path d="M13.4 11.2 C10.5 10.6 6.8 8 2.6 2.4 L4.4 6.6 L1.4 6.2 L5.2 9.4 L2.6 10.2 L7.4 12.1 L5.6 13.4 L10.6 13.6 L13.2 14.6 Z"/>
    <path d="M16.6 11.2 C19.5 10.6 23.2 8 27.4 2.4 L25.6 6.6 L28.6 6.2 L24.8 9.4 L27.4 10.2 L22.6 12.1 L24.4 13.4 L19.4 13.6 L16.8 14.6 Z"/>
    <path d="M15 8.6 C16.9 8.6 17.4 11 17.1 13.4 C16.9 15.4 16 16.6 15 17.6 C14 16.6 13.1 15.4 12.9 13.4 C12.6 11 13.1 8.6 15 8.6 Z"/>
    <path d="M13.6 16.4 L15 18.6 L16.4 16.4 Z"/>
    <path d="M15 5.2 C16.4 5.2 17 6.1 17 7 L18.9 7.6 L16.9 8.3 C16.4 9.2 13.6 9.2 13.2 8 C12.9 6.6 13.6 5.2 15 5.2 Z"/></g>
    <circle cx="15.6" cy="6.7" r=".45" fill="#2a1c0d"/></svg>`;
  const SPEAR = (g) => `<svg class="bn-svg" width="40" height="32" viewBox="0 0 30 24">${gilt(g)}<g fill="url(#${g})" stroke="#3b2a12" stroke-width=".5" stroke-linejoin="round">
    <path d="M15 0 C18 4.6 18.6 9.6 15 15.6 C11.4 9.6 12 4.6 15 0 Z"/>
    <rect x="13.2" y="15.4" width="3.6" height="2.4" rx=".6"/><circle cx="15" cy="20.4" r="2.5"/></g>
    <path d="M15 1.6 L15 14.2" stroke="#6e5226" stroke-width=".55"/></svg>`;
  // crossbar ends, 12 x 12, centred on the bar end: Union gilt ball + point, Confederate small spear point (pointing out)
  const END_US = (g, flip) => `<svg class="bn-svg" width="15" height="15" viewBox="0 0 12 12" style="transform:scaleX(${flip ? -1 : 1})">${gilt(g)}<g fill="url(#${g})" stroke="#3b2a12" stroke-width=".5">
    <rect x="7.4" y="4.6" width="2.2" height="2.8" rx=".5"/><circle cx="5.4" cy="6" r="2.6"/><path d="M2.9 5.2 L.4 6 L2.9 6.8 Z"/></g></svg>`;
  const END_CS = (g, flip) => `<svg class="bn-svg" width="15" height="15" viewBox="0 0 12 12" style="transform:scaleX(${flip ? -1 : 1})">${gilt(g)}<g fill="url(#${g})" stroke="#3b2a12" stroke-width=".5">
    <rect x="8" y="4.8" width="2" height="2.4" rx=".4"/><path d="M8.2 6 C6 3.9 3.4 4 .2 6 C3.4 8 6 8.1 8.2 6 Z"/></g></svg>`;
  const isUnion = (flag) => !/csa|cs_|conf|_cs|cs\d/i.test(String(flag));
  const build = (photo, flag, name, side = "up", union) => { inject();
    const U = union ?? isUnion(flag), P = SIDE[U ? "us" : "cs"], k = "bn" + (++uid), f = fit(name);
    const w = document.createElement("div");
    w.style.cssText = "position:absolute;left:50%;top:-1px;width:0;height:0;pointer-events:none;z-index:5";
    const vars = `--bn-cloth:${P.cloth};--bn-hi:${P.clothHi};--bn-lo:${P.clothLo};--bn-str:${P.str};--bn-strLo:${P.strLo};--bn-pen:${P.pen};${f.s}`;
    const b1 = (L.bar1W) / 2, b2 = (L.bar2W) / 2, end = U ? END_US : END_CS, sx = L.clW / 2 + L.stGap;
    const plY = L.plT + 1, plHalf = f.w / 2 - 6;
    w.innerHTML = `<div class="bn" style="left:${-X}px;top:${-CH}px;${vars}">`
      // DOM order: pennant (flag = img[0]; above the pole, below the bars), pole, chains, finial, streamers, cloth (photo = img[1]), bars + ends, plaque (last)
      + `<div class="bn-pen" style=""><img src="${flag}" alt=""></div>`
      + `<div class="bn-pole"></div>`
      + `<svg class="bn-svg" style="left:0;top:0" width="${CW}" height="${CH}" viewBox="0 0 ${CW} ${CH}"><g fill="none" stroke="#3a2a14" stroke-width="1" stroke-dasharray="1.6 .9" stroke-linecap="round">`
      + `<path d="M${X - 1.5} 21 L${X - plHalf} ${plY}"/><path d="M${X + 1.5} 21 L${X + plHalf} ${plY}"/></g>`
      + `<g fill="none" stroke="#d6bf86" stroke-width=".45" stroke-dasharray="1.6 .9" stroke-dashoffset=".3"><path d="M${X - 1.5} 21 L${X - plHalf} ${plY}"/><path d="M${X + 1.5} 21 L${X + plHalf} ${plY}"/></g></svg>`
      + `<div style="left:${X - 20}px;top:${L.finT}px">${U ? EAGLE(k + "f") : SPEAR(k + "f")}</div>`
      + `<div class="bn-str" style="left:${X - sx - L.stW}px"></div><div class="bn-str" style="left:${X + sx}px"></div>`
      + `<div class="bn-cloth"><div class="bn-ph"><img src="${photo}" alt=""></div><div class="bn-sheen"></div></div>`
      + `<div class="bn-bar" style="left:${X - b1}px;top:${L.bar1}px;width:${2 * b1}px"></div>`
      + `<div style="left:${X - b1 - 11.5}px;top:${L.bar1 - 5.3}px">${end(k + "a", false)}</div><div style="left:${X + b1 - 3.5}px;top:${L.bar1 - 5.3}px">${end(k + "b", true)}</div>`
      + `<div class="bn-bar" style="left:${X - b2}px;top:${L.bar2}px;width:${2 * b2}px"></div>`
      + `<div style="left:${X - b2 - 11.5}px;top:${L.bar2 - 5.3}px">${end(k + "c", false)}</div><div style="left:${X + b2 - 3.5}px;top:${L.bar2 - 5.3}px">${end(k + "d", true)}</div>`
      + `<div class="bn-name">${name}</div></div>`
      + `<div class="bn-gnd" style="left:-13px;top:-4px"></div><div class="bn-cast" style="left:0;top:-8px"></div>`;
    const off = { up: [0, -1], right: [58, 38], left: [-58, 38], west: [-92, 18], ne: [64, -6] }[side] || [0, -1];
    if (side !== "up") { w.style.left = `calc(50% + ${off[0]}px)`; w.style.top = off[1] + "px"; }
    return w; };
  // the cloth sway: ONE linear tween of the card's --bn-sw (seconds since t) on the scene timeline; CSS turns it into sin() poses
  // (cloth +-0.9 deg + tiny skew, streamers +-2.3 deg and pennant +-2.2 deg out of phase, a sheen drifting across; period 3.6 s).
  // Seekable and deterministic; never inserted before t (a negative position would shift the whole scene timeline).
  const swayEnd = () => { const r = typeof document !== "undefined" && document.getElementById("root"); const d = r && parseFloat(r.dataset.duration); return isFinite(d) ? d : 120; };
  const sway = (w, t, end, T = typeof tl !== "undefined" ? tl : null) => { if (!T) return; const span = Math.max(1, (end ?? swayEnd()) - t);
    T.fromTo(w.firstElementChild, { "--bn-sw": 0 }, { "--bn-sw": span, duration: span, ease: "none", immediateRender: false }, Math.max(0, t)); };
  // name reveal: photo swap + a new plaque (refitted to the new name) cross-faded in at t
  const reveal = (w, photo, name, t) => { const card = w.firstElementChild, ph = card.querySelectorAll("img")[1], nm = card.lastElementChild, f = fit(name);
    const n2 = document.createElement("div"); n2.textContent = name; n2.style.cssText = f.s; card.appendChild(n2);
    gsap.set(n2, { autoAlpha: 0 }); tl.set(ph, { attr: { src: photo } }, t); tl.to(nm, { autoAlpha: 0, duration: 0.15 }, t); tl.to(n2, { autoAlpha: 1, duration: 0.15 }, t); return n2; };
  const flagFor = (side, iso, base = "assets/media/") => base + (side === "cs" ? "csa1_13_flag.png" : String(iso) >= "1863-07-04" ? "us35_flag.png" : "us34_flag.png");
  const MYST = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="76" height="100" viewBox="0 0 76 100"><path d="M38 18 C27 18 22 26 22 35 C22 44 27 51 31 54 L31 58 C18 61 8 70 6 100 L70 100 C68 70 58 61 45 58 L45 54 C49 51 54 44 54 35 C54 26 49 18 38 18 Z" fill="#120e09" fill-opacity=".86"/><text x="38" y="49" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="30" fill="#e2c88e">?</text></svg>');
  return { build, reveal, sway, fit, flagFor, MYST, inject, CW, CH };
})();

// same signature + behaviour as the kit's pinPortrait; the banner replaces the card
const pinBanner = (id, photo, flag, name, t, until, keep = false, side = "up") => { if (!keep) until = Math.min(until, t + 3.6);
  const host = typeof id === "string" ? B.units[id].el.firstElementChild : id;   // id = a unit id, or a pinned element (a boat)
  const w = BN.build(photo, flag, name, side);
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 }); { const pe = host.closest(".gg-pin, .unit"); if (pe) pe.style.zIndex = 40; }
  const tg = typeof id === "string" && B.units[id].el.querySelector(".tag"); if (tg) { tl.to(tg, { autoAlpha: 0, duration: 0.2 }, t - 0.1); if (until != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, until + 0.2); }
  tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); if (until != null) tl.to(w, { autoAlpha: 0, duration: 0.35 }, until);
  BN.sway(w, t, until); return w; };
