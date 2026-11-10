// PORTRAIT CARD v2 (TEST 2026-11-10; research/style_tests/roads_towns/portraits/). Drop-in replacement for the Style W kit's
// pinPortrait (grant/tools/vx_kit.js "BATCH 3 (a)"): same arguments, same returned element, same DOM contract, so a scene swaps it
// without touching its body. Look = owner palette of the R&R cards (ivory #efe3c8, antique gold #c8a86a / hi #ead39a, warm charcoal #15110c),
// Cinzel nameplate. STYLE_LOCK 2d item 6 unchanged: flag strip + sepia photo + name, on a stake at the general's unit.
//
//   - soft drop shadow down-right (two layers) + a small elliptical contact shadow where the stake meets the ground
//   - thin antique-gold frame (bevelled: lit top-left, shaded bottom-right) + fine dark/gold inner keyline + tiny gold corner ornaments
//   - flag strip inset inside the frame (gold hairline), photo warm-sepia on a studio backdrop with a faint vignette
//   - nameplate: Cinzel 700 ivory on warm charcoal under a gold hairline, auto-fitted to the name (measured Cinzel advances)
//   - stake in dark wood with a slight highlight
//
// DOM CONTRACT (kept from the old card, scene bodies rely on it):
//   w.firstElementChild               = the card (scaled for the name reveal: GW.firstElementChild)
//   card.querySelectorAll("img")[0/1] = flag / photo (the reveal swaps img[1].src)
//   card.lastElementChild             = the name (the old reveal copies its cssText into an appended div: that div is styled by CSS too)
//   w.lastElementChild                = the stake
// Footprint: 86 x 119 px (old 79 x ~118; +9 % area), screen px (the pins are counter-scaled by the camera).
//
// API (globals from the kit: B, tl, gsap):
//   pinPortrait(id, photo, flag, name, t, until, keep = false, side = "up")   identical to the kit's
//   PC.reveal(w, photo, name, t)    optional cleaner name reveal (photo + name swap; the scene keeps its own scale pop + SFX)
//   PC.build(photo, flag, name, side) the bare element (no timeline), used by the preview
//   PC.MYST                         an optional mystery "?" image in the card palette (scenes may keep their own MYST)
//   PC_FONT_BASE                    set before this file to change the font folder (default "assets/fonts/")
const PC = (() => {
  const C = { ivory: "#efe3c8", gold: "#c8a86a", goldHi: "#ead39a", goldLo: "#8f6f36", goldDk: "#5e4620", char: "#15110c", char2: "#221b12" };
  const FB = typeof PC_FONT_BASE === "string" ? PC_FONT_BASE : "assets/fonts/";
  const IW = 80, BW = 3, W = IW + 2 * BW;   // inner width, frame width, outer width (86)
  const css = `
@font-face{font-family:"Cinzel";font-weight:700;src:url("${FB}cinzel-latin-700-normal.woff2") format("woff2")}
@font-face{font-family:"Cinzel";font-weight:600;src:url("${FB}cinzel-latin-600-normal.woff2") format("woff2")}
.pc-card{position:absolute;box-sizing:content-box;width:${IW}px;background:linear-gradient(180deg,${C.char2},${C.char});
  border:${BW}px solid #b8955a;border-image:linear-gradient(135deg,#f3dfa8 0%,${C.gold} 22%,#8a6a32 46%,#e2c88e 64%,${C.gold} 78%,#6e5226 100%) 1;
  box-shadow:0 0 0 .75px rgba(28,19,6,.95),2px 3px 3px rgba(12,9,4,.42),6px 10px 14px rgba(12,9,4,.38),11px 18px 26px rgba(12,9,4,.20)}
.pc-card::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:3;
  box-shadow:inset 0 0 0 1px rgba(21,17,12,.95),inset 0 0 0 1.6px rgba(234,211,154,.55)}
.pc-card::after{content:"";position:absolute;inset:-${BW}px;pointer-events:none;z-index:4;
  background:radial-gradient(circle at 50% 50%,${C.goldHi} 0 1.1px,${C.goldLo} 1.5px,transparent 2px) 0 0/7px 7px no-repeat,
    radial-gradient(circle at 50% 50%,${C.goldHi} 0 1.1px,${C.goldLo} 1.5px,transparent 2px) 100% 0/7px 7px no-repeat,
    radial-gradient(circle at 50% 50%,${C.goldHi} 0 1.1px,${C.goldLo} 1.5px,transparent 2px) 0 100%/7px 7px no-repeat,
    radial-gradient(circle at 50% 50%,${C.goldHi} 0 1.1px,${C.goldLo} 1.5px,transparent 2px) 100% 100%/7px 7px no-repeat}
.pc-flag{display:block;width:${IW - 6}px;height:13px;margin:3px 3px 0;object-fit:cover;box-shadow:0 0 0 .75px ${C.gold},0 0 0 1.5px rgba(0,0,0,.6);filter:saturate(.82) contrast(1.02)}
.pc-ph{position:relative;width:${IW - 6}px;height:74px;margin:3px 3px 3px;overflow:hidden;box-shadow:0 0 0 .75px ${C.gold},0 0 0 1.5px rgba(0,0,0,.6);
  background:radial-gradient(ellipse 70% 62% at 50% 38%,#cdb68a 0%,#a88a5a 48%,#5f4828 100%)}
.pc-ph img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 20%;filter:grayscale(1) sepia(.62) contrast(1.12) brightness(.96) saturate(1.05)}
.pc-ph::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 78% 70% at 50% 42%,rgba(40,26,10,0) 52%,rgba(40,26,10,.30) 80%,rgba(28,18,6,.62) 100%),
    linear-gradient(180deg,rgba(255,236,190,.10),rgba(255,236,190,0) 40%)}
.pc-card>.pc-name,.pc-card>.pc-name~div{box-sizing:border-box;height:17px;line-height:16px;padding:1px 2px 0;text-align:center;white-space:nowrap;overflow:visible;
  font-family:"Cinzel","Liberation Serif",Georgia,serif !important;font-weight:700;font-size:var(--pc-fs,11px) !important;letter-spacing:var(--pc-ls,.02em);color:${C.ivory};
  background:linear-gradient(180deg,#1d1710,${C.char});border-top:.75px solid ${C.gold};text-shadow:0 1px 1px rgba(0,0,0,.85)}
.pc-stake{position:absolute;pointer-events:none;background:linear-gradient(90deg,#20150b 0%,#5a3f22 38%,#8a6a44 50%,#4a321b 64%,#1c1209 100%);
  filter:drop-shadow(1.5px 1.5px 1px rgba(10,8,4,.45))}
.pc-stake.pc-h{background:linear-gradient(180deg,#8a6a44 0%,#5a3f22 35%,#2a1c0f 100%)}
.pc-ground{position:absolute;pointer-events:none;width:20px;height:7px;border-radius:50%;
  background:radial-gradient(ellipse at 50% 50%,rgba(14,10,4,.7) 0%,rgba(14,10,4,.36) 45%,rgba(14,10,4,0) 72%)}`;
  let done = false;
  const inject = () => { if (done || typeof document === "undefined") return; done = true; const st = document.createElement("style"); st.id = "pc-css"; st.textContent = css; document.head.appendChild(st); };
  // name size: fit the plate with measured Cinzel 700 advances (em per glyph; lowercase renders as small caps), 8.5-11.5 px, then tighten the tracking
  const ADV = { A: .72, B: .67, C: .78, D: .83, E: .63, F: .6, G: .84, H: .86, I: .39, J: .38, K: .76, L: .62, M: .95, N: .86, O: .88, P: .66, Q: .88, R: .75, S: .58, T: .67,
    U: .82, V: .73, W: .97, X: .73, Y: .7, Z: .66, a: .64, b: .6, c: .68, d: .75, e: .56, f: .53, g: .73, h: .75, i: .35, j: .34, k: .67, l: .55, m: .86, n: .78, o: .78, p: .59,
    q: .77, r: .66, s: .51, t: .6, u: .7, v: .64, w: .87, x: .65, y: .64, z: .61, " ": .25, ".": .22, "'": .2, "-": .38 };
  const fit = (name) => { const s = String(name), n = s.length, em = [...s].reduce((a, ch) => a + (ADV[ch] ?? .7), 0) + 0.02 * n, room = IW - 6;
    const f = Math.max(8.5, Math.min(11.5, room / Math.max(em, 1))), over = f * em - room;
    return `--pc-fs:${f.toFixed(2)}px;--pc-ls:${over > 0 ? (0.02 * f - Math.min(0.9, over / n)).toFixed(2) + "px" : ".02em"}`; };
  const build = (photo, flag, name, side = "up") => { inject();
    const w = document.createElement("div");
    w.style.cssText = "position:absolute;left:50%;top:-44px;width:0;height:0;pointer-events:none;z-index:5";
    w.innerHTML = `<div class="pc-card" style="left:${-W / 2}px;bottom:0;${fit(name)}"><img class="pc-flag" src="${flag}" alt=""><div class="pc-ph"><img src="${photo}" alt=""></div><div class="pc-name">${name}</div></div>`
      + `<div class="pc-ground" style="left:-10px;top:36.5px"></div><div class="pc-stake" style="left:-1.5px;bottom:-40px;width:3px;height:40px;border-radius:1px 1px 0.5px 0.5px"></div>`;
    const card = w.firstElementChild, gnd = w.children[1], stake = w.lastElementChild;
    const horiz = (len, deg) => { stake.classList.add("pc-h"); Object.assign(stake.style, { left: "0px", bottom: "auto", top: "-1.25px", width: len + "px", height: "2.5px", borderRadius: "1px", transformOrigin: "0 1.25px", transform: `rotate(${deg}deg)` });
      Object.assign(gnd.style, { left: "-10px", top: "-3.5px" }); };
    if (side === "right" || side === "left") {   // card beside the unit on a short slanted stake (keeps the action free)
      const R = side === "right"; w.style.top = "4px"; w.style.left = R ? "calc(100% + 0px)" : "0px";
      Object.assign(card.style, R ? { left: "40px", bottom: "auto", top: "56px" } : { left: -(W + 37) + "px", bottom: "auto", top: "56px" });
      horiz(70, R ? 54 : 126);
    }
    if (side === "west" || side === "ne") {   // card level with the unit to the west, or up-right of it
      w.style.top = "4px";
      if (side === "west") { w.style.left = "0px"; Object.assign(card.style, { left: -(W + 79) + "px", bottom: "auto", top: "-64px" }); horiz(82, 180); }
      else { w.style.left = "calc(100% + 0px)"; Object.assign(card.style, { left: "40px", bottom: "auto", top: "-154px" }); horiz(70, -54); }
    }
    return w; };
  const reveal = (w, photo, name, t) => { const card = w.firstElementChild, ph = card.querySelectorAll("img")[1], nm = card.lastElementChild;
    const n2 = document.createElement("div"); n2.textContent = name; n2.style.cssText = `position:absolute;left:0;right:0;bottom:0;${fit(name)}`; card.appendChild(n2);
    gsap.set(n2, { autoAlpha: 0 }); tl.set(ph, { attr: { src: photo } }, t); tl.to(nm, { autoAlpha: 0, duration: 0.15 }, t); tl.to(n2, { autoAlpha: 1, duration: 0.15 }, t); return n2; };
  const MYST = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="76" height="82" viewBox="0 0 76 82"><defs><radialGradient id="g" cx="50%" cy="40%" r="65%"><stop offset="0" stop-color="#5a4a33"/><stop offset="1" stop-color="#1e1810"/></radialGradient></defs><rect width="76" height="82" fill="url(#g)"/><path d="M38 14 C27 14 22 22 22 31 C22 40 27 47 31 50 L31 54 C18 57 10 65 8 82 L68 82 C66 65 58 57 45 54 L45 50 C49 47 54 40 54 31 C54 22 49 14 38 14 Z" fill="#120e09"/><text x="38" y="45" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="30" fill="#d9bd7e">?</text></svg>');
  return { build, reveal, MYST, inject, fit, W };
})();

// same signature + behaviour as the kit's pinPortrait; only the card markup changed
const pinPortrait = (id, photo, flag, name, t, until, keep = false, side = "up") => { if (!keep) until = Math.min(until, t + 3.6);
  const host = typeof id === "string" ? B.units[id].el.firstElementChild : id;   // id = a unit id, or a pinned element (a boat)
  const w = PC.build(photo, flag, name, side);
  host.appendChild(w); gsap.set(w, { autoAlpha: 0 }); { const pe = host.closest(".gg-pin, .unit"); if (pe) pe.style.zIndex = 40; }   // cards above the fire / glow layers
  const tg = typeof id === "string" && B.units[id].el.querySelector(".tag"); if (tg) { tl.to(tg, { autoAlpha: 0, duration: 0.2 }, t - 0.1); if (until != null) tl.to(tg, { autoAlpha: 1, duration: 0.3 }, until + 0.2); }
  tl.fromTo(w, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); if (until != null) tl.to(w, { autoAlpha: 0, duration: 0.35 }, until); return w; };
