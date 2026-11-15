/* GM overlay v2: Grand Maneuver on-screen overlays, rebuilt from REAL frames of their "France 1814" video (measured
   2026-11-15; see OVERLAY_SPEC.md). Elements: date / clock plaque with pocket watch, bottom day-timeline with wax-seal
   markers (+ optional counter), THE ARMIES legend, portrait medallions (ivory card + dark plate) with leader lines,
   oval painting insets with ribbon captions, place cards with an oval inset, dark event labels with map markers,
   full-width cream letter card (typed quote), centred italic quote over a darkened map, title card, 3D gold numbers,
   distance ruler, ledger + stamps (Borodino, AI-described only), grade (day / dusk / night / candle), paper, grain,
   vignette. Deterministic: a function of the GSAP timeline time t only (tweens on `tl` + a pure update(t)).
   1920x1080 stage. API: README.md. Needs window.gsap. */
(function () {
  "use strict";
  const W = 1920, H = 1080;
  const UR = {
    latin: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    "latin-ext": "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
    cyrillic: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116",
  };
  const fontCSS = (b) => {
    let s = ""; const ff = (fam, file, w, st, ur) => { s += `@font-face{font-family:"${fam}";font-weight:${w};font-style:${st};font-display:block;src:url("${b}${file}") format("woff2");unicode-range:${ur};}`; };
    for (const [w, st] of [[500, "normal"], [500, "italic"], [600, "normal"], [600, "italic"], [700, "normal"]])
      for (const sub of ["latin", "latin-ext", "cyrillic"]) ff("GM Cormorant", `cormorant-garamond-${sub}-${w}-${st}.woff2`, w, st, UR[sub]);
    for (const w of [600, 700]) for (const sub of ["latin", "latin-ext"]) ff("GM Cinzel", `cinzel-${sub}-${w}-normal.woff2`, w, "normal", UR[sub]);
    return s;
  };

  // ------------------------------------------------------------------ CSS (px on the 1920x1080 stage; measured values in OVERLAY_SPEC.md)
  const CSS = `
.gmo{position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:hidden;pointer-events:none;font-family:"GM Cormorant",Georgia,serif;color:#1E180E;
 --ink:#1E180E;--ink-2:#2B2210;--caps:#6A5D45;--rule:#5E5440;--navy:#151E25;--goldtxt:#C9B27A;--cream:#EEE7D6;--legend:#DFDBC8;--prog:#8E2B22}
.gmo *{box-sizing:border-box}
.gmo .L{position:absolute;left:0;top:0;width:${W}px;height:${H}px}
.gmo .abs{position:absolute}
.gmo .caps{font-weight:600;text-transform:uppercase;letter-spacing:.26em}
.gmo .it{font-style:italic;font-weight:500}
/* framed plaques: an SVG draws the notched ivory card with a double rule (redrawn when the content size changes) */
.gmo .plq>svg.fr{position:absolute;left:0;top:0;overflow:visible;filter:drop-shadow(0 4px 7px rgba(0,0,0,.42)) drop-shadow(0 1px 1px rgba(0,0,0,.35))}
.gmo .plq>.ct{position:relative}
/* ---- 1. date / clock plaque (top-left) */
.gmo .pdate{left:58px;top:63px}
.gmo .pdate .ct{padding:9px 22px 10px 16px;min-width:224px}
.gmo .pdate .hd{font-size:13.5px;color:var(--caps);letter-spacing:.3em;padding:0 0 6px 4px;border-bottom:1.3px solid var(--rule);white-space:nowrap}
.gmo .pdate .rw{display:flex;align-items:center;min-height:52px}
.gmo .pdate .dn{width:60px;text-align:center;font-weight:500;font-size:42px;line-height:1;color:var(--ink);padding-top:4px;font-variant-numeric:lining-nums}
.gmo .pdate .vr{width:1.3px;align-self:stretch;background:var(--rule);margin:0 14px 0 4px}
.gmo .pdate .wd{font-size:13px;letter-spacing:.24em;color:#5A4F3A;white-space:nowrap}
.gmo .pdate .nt{font-size:18.5px;color:var(--ink-2);white-space:nowrap;margin-top:1px}
.gmo .pclock{left:132px;top:63px}
.gmo .pclock .ct{padding:8px 64px 13px 44px;min-width:318px;height:97px;display:flex;flex-direction:column;justify-content:flex-end}
.gmo .pclock .hd{font-size:13px;letter-spacing:.3em;color:var(--caps);white-space:nowrap;margin-bottom:-1px}
.gmo .pclock .tm{display:flex;align-items:baseline;gap:14px;white-space:nowrap}
.gmo .pclock .tv{font-weight:500;font-size:42px;line-height:.95;color:var(--ink);font-variant-numeric:oldstyle-nums;min-width:72px}
.gmo .pclock .tp{font-size:14.5px;letter-spacing:.26em;color:#5A4F3A}
.gmo .pclock .nt{font-size:20px;color:var(--ink-2);white-space:nowrap;margin-top:1px}
.gmo svg.watch{position:absolute;left:61px;top:36px;width:88px;height:118px;overflow:visible;filter:drop-shadow(0 4px 5px rgba(0,0,0,.45))}
/* ---- 2. timeline (bottom) */
.gmo .tline{left:442px;top:978px}
.gmo .tline .ct{display:flex;height:58px}
.gmo .tline .lb{width:99px;flex:0 0 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;border-right:1.3px solid #B9AE92}
.gmo .tline .lb .m,.gmo .tline .lb .y{font-size:13px;letter-spacing:.2em;color:#5A4F3A}
.gmo .tline .lb svg{width:46px;height:7px;margin:2px 0}
.gmo .tline .cl{position:relative;flex:0 0 auto;border-right:1px solid rgba(150,138,108,.55);padding:6px 0 0 14px}
.gmo .tline .cl:last-of-type{border-right:0}
.gmo .tline .cl .d{font-weight:500;font-size:27px;line-height:1;color:#A39A82;font-variant-numeric:lining-nums}
.gmo .tline .cl.on .d{color:var(--ink)}
.gmo .tline .cl .bn{font-style:italic;font-weight:600;font-size:13.5px;color:var(--ink-2);white-space:nowrap;margin-top:1px}
.gmo .tline .pg{position:absolute;left:99px;top:45px;height:1.6px;background:var(--prog)}
.gmo .tline .pg i{position:absolute;right:-3px;top:-2.2px;width:6px;height:6px;border-radius:50%;background:var(--prog)}
.gmo .tline .cnt{position:absolute;right:18px;top:7px;text-align:right}
.gmo .tline .cnt .k{font-size:11.5px;letter-spacing:.24em;color:#5A4F3A}
.gmo .tline .cnt .v{font-weight:700;font-size:28px;line-height:1;color:var(--ink);font-variant-numeric:lining-nums tabular-nums}
.gmo svg.seal{position:absolute;left:-26px;top:-26px;overflow:visible;filter:drop-shadow(0 3px 3px rgba(0,0,0,.5))}
/* ---- 3. legend (bottom-left) */
.gmo .legend{left:50px;bottom:50px;background:var(--legend);padding:13px 26px 15px 18px;box-shadow:0 4px 12px rgba(0,0,0,.28)}
.gmo .legend .t{font-size:14px;letter-spacing:.26em;color:#6A6455;margin:0 0 6px 2px}
.gmo .legend .e{display:flex;align-items:center;gap:14px;margin-top:3px}
.gmo .legend .e svg{width:56px;height:16px;flex:0 0 auto}
.gmo .legend .n{font-family:"GM Cinzel",serif;font-weight:700;font-size:18px;letter-spacing:.06em;color:#1E1C14;line-height:1.05}
.gmo .legend .s{font-style:italic;font-weight:500;font-size:16px;color:#5A5545;line-height:1.1;white-space:nowrap}
/* ---- 4. medallions */
.gmo svg.lead{position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:visible}
.gmo .med{position:absolute;left:0;top:0;width:0;height:0}
.gmo .med .in{position:absolute;left:0;top:0;display:flex;flex-direction:column;align-items:center}
.gmo .por{border-radius:50%;position:relative;flex:0 0 auto;z-index:2}
.gmo .por .pi{position:absolute;border-radius:50%;overflow:hidden;background:#2B261C}
.gmo .por .pi img{display:block;width:100%;height:100%;object-fit:cover;filter:sepia(.12) saturate(.9)}
.gmo .mcard{position:relative;margin-top:-10px}
.gmo .mcard .ct{padding:12px 30px 11px;text-align:center;min-width:206px}
.gmo .mcard .rl{font-size:11.5px;letter-spacing:.3em;color:var(--caps);white-space:nowrap}
.gmo .mcard .nm{font-weight:600;font-size:31px;line-height:1.08;color:var(--ink);white-space:nowrap}
.gmo svg.orn{display:block;margin:3px auto 3px;width:84px;height:7px}
.gmo .mcard .sb{font-style:italic;font-weight:500;font-size:16.5px;color:var(--ink-2);white-space:nowrap}
.gmo .mcard .nl{font-size:17px;color:var(--ink-2);white-space:nowrap;margin-top:1px}
.gmo .mcard .nl b{font-weight:700;font-size:25px;font-variant-numeric:oldstyle-nums;margin:0 4px}
.gmo .nl i{font-style:italic;font-weight:500}
.gmo .mplate{position:absolute;left:0;top:0;display:flex;align-items:center}
.gmo .mplate .pb{position:relative;background:var(--navy);box-shadow:0 6px 14px rgba(0,0,0,.5),inset 0 0 0 3px var(--navy),inset 0 0 0 4.2px rgba(170,176,172,.55);padding:12px 26px 12px 0;margin-left:-26px;white-space:nowrap}
.gmo .mplate .st{position:absolute;left:0;right:0;top:0;height:3.5px;display:flex}
.gmo .mplate .st i,.gmo .elab .st i{flex:1}
.gmo .mplate .tx{padding-left:44px}
.gmo .mplate .rl{font-size:12.5px;letter-spacing:.3em;color:#B9B4A4}
.gmo .mplate .nm{font-family:"GM Cinzel",serif;font-weight:700;font-size:25px;letter-spacing:.06em;color:var(--goldtxt);line-height:1.15}
.gmo .mplate .nm.tc{font-family:"GM Cormorant",serif;font-weight:600;font-size:36px;letter-spacing:0;color:#EDE8DA;line-height:1.05}
.gmo .mplate .sb{font-style:italic;font-weight:500;font-size:21px;color:#D8D3C4;line-height:1.2}
.gmo .mplate .nl{font-size:21px;color:#D8D3C4;line-height:1.1}
.gmo .mplate .nl b{font-weight:700;font-size:40px;color:#EDE8DA;font-variant-numeric:lining-nums;margin:0 7px 0 4px}
/* ---- 5. oval painting inset + ribbon caption; place card with a small oval */
.gmo .oval .ov{position:absolute;inset:0;border-radius:50%;overflow:hidden;box-shadow:0 0 0 3px #E8E0CB,0 0 0 4.2px rgba(40,34,24,.65),0 10px 22px rgba(0,0,0,.5)}
.gmo .oval .ov img{width:100%;height:100%;object-fit:cover;filter:sepia(.18) contrast(1.02)}
.gmo .rib{position:absolute;left:50%;white-space:nowrap;height:24px;padding:0 30px;display:flex;align-items:center;font-style:italic;font-weight:600;font-size:15.5px;color:#2B2210;
 background:linear-gradient(180deg,#EDE6D2,#DCD2B8);clip-path:polygon(0 0,100% 0,calc(100% - 10px) 50%,100% 100%,0 100%,10px 50%)}
.gmo .place .ct{padding:12px 34px 10px;text-align:center;min-width:300px}
.gmo .place .tt{font-weight:600;font-size:31px;line-height:1.1;color:var(--ink);white-space:nowrap}
.gmo .place .sb{font-style:italic;font-weight:500;font-size:16.5px;color:var(--ink-2);white-space:nowrap}
.gmo .mo{position:absolute;left:50%;border-radius:50%;padding:5px;background:linear-gradient(160deg,#C68A4E,#7A4A26);box-shadow:0 4px 10px rgba(0,0,0,.45)}
.gmo .mo div{width:100%;height:100%;border-radius:50%;overflow:hidden;box-shadow:inset 0 0 0 1.5px rgba(30,20,10,.6)}
.gmo .mo img{width:100%;height:100%;object-fit:cover}
/* ---- 6. dark event label + map marker */
.gmo .elab{position:relative;background:var(--navy);padding:13px 28px 13px 20px;box-shadow:0 6px 14px rgba(0,0,0,.5),inset 0 0 0 3px var(--navy),inset 0 0 0 4.2px rgba(170,176,172,.55);white-space:nowrap}
.gmo .elab .st{position:absolute;right:0;top:0;height:3.5px;display:flex;width:68%}
.gmo .elab .nm{font-family:"GM Cinzel",serif;font-weight:700;font-size:21px;letter-spacing:.07em;color:var(--goldtxt);line-height:1.15}
.gmo .elab .sb{font-style:italic;font-weight:500;font-size:19.5px;color:#D8D3C4;line-height:1.2}
.gmo .elab.sm{padding:8px 16px 8px 14px}.gmo .elab.sm .nm{font-size:16px}.gmo .elab.sm .sb{font-size:15px}
/* ---- 7. letter card (full width) */
.gmo .letter{left:0;width:${W}px;top:693px;height:214px}
.gmo .letter .bg{position:absolute;inset:0;background:linear-gradient(180deg,#E2DABF,#DAD1B3);box-shadow:0 8px 24px rgba(0,0,0,.45)}
.gmo .letter .bg::before,.gmo .letter .bg::after{content:"";position:absolute;left:0;right:0;height:5px}
.gmo .letter .bg::before{top:3px;border-top:2px solid #5D5F4C;border-bottom:1px solid #9A917D}
.gmo .letter .bg::after{bottom:3px;border-top:1px solid #9A917D;border-bottom:2px solid #5D5F4C}
.gmo .letter .tx{position:absolute;left:0;right:0;top:20px;text-align:center}
.gmo .letter .hd{display:flex;align-items:center;justify-content:center;gap:16px;font-size:14px;letter-spacing:.32em;color:#5D5640;font-weight:600}
.gmo .letter .hd i{width:64px;height:1px;background:#8A826C}
.gmo .letter .tt{font-family:"GM Cinzel",serif;font-weight:700;font-size:52px;letter-spacing:.07em;color:#1E1A12;line-height:1.12;margin-top:2px}
.gmo .letter .sb{font-style:italic;font-weight:500;font-size:20px;color:#3A3324}
.gmo .letter .q{font-style:italic;font-weight:600;font-size:18px;color:#2A2512;margin-top:10px;white-space:pre;min-height:22px}
/* ---- 8. centred quote over a darkened map */
.gmo .cq{left:260px;width:1400px;text-align:center}
.gmo .cq .o{font-style:italic;font-weight:500;font-size:33px;line-height:1.28;color:#CFC6B0;text-shadow:0 2px 8px rgba(0,0,0,.85);margin-bottom:10px}
.gmo .cq .q{font-style:italic;font-weight:500;font-size:43px;line-height:1.3;color:var(--cream);text-shadow:0 2px 8px rgba(0,0,0,.85),0 0 24px rgba(0,0,0,.5)}
.gmo .cq .a{font-size:15.5px;letter-spacing:.3em;color:#B79E6A;margin-top:16px;text-shadow:0 1px 4px rgba(0,0,0,.9)}
.gmo .dim{position:absolute;inset:0;background:radial-gradient(ellipse 80% 75% at 50% 55%,rgba(6,10,14,.45),rgba(4,6,9,.7))}
/* ---- 9. title card, 3D gold numbers */
.gmo .title{left:0;width:${W}px;text-align:center}
.gmo .gold{background:linear-gradient(180deg,#F6E7BF 0%,#E3C995 38%,#C09F6C 62%,#9A774A 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.gmo .title .l{font-family:"GM Cinzel",serif;font-weight:600;font-size:104px;letter-spacing:.2em;line-height:1.0;padding-left:.2em;filter:drop-shadow(0 4px 6px rgba(0,0,0,.55)) drop-shadow(0 0 18px rgba(0,0,0,.35))}
.gmo .title .r{width:960px;height:1.4px;margin:22px auto 16px;background:linear-gradient(90deg,transparent,rgba(238,231,214,.85) 15%,rgba(238,231,214,.85) 85%,transparent)}
.gmo .title .s{font-family:"GM Cinzel",serif;font-weight:600;font-size:30px;letter-spacing:.32em;color:#EDE3CC;text-shadow:0 2px 6px rgba(0,0,0,.8)}
.gmo .bign{position:relative;display:inline-block;white-space:nowrap;font-family:"GM Cinzel",serif;font-weight:700;letter-spacing:.02em;line-height:1}
.gmo .bign .f{position:relative}
.gmo .bign .x,.gmo .bign .sh{position:absolute;left:0;top:0}
.gmo .bign .x{color:#6E5228}
.gmo .bign .sh{color:rgba(0,0,0,.4);filter:blur(6px)}
.gmo .bign.fr .f{background:linear-gradient(180deg,#9DB3C9,#5F7E9E);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:2px #E3C995}
/* ---- 10. distance ruler, ledger */
.gmo svg.ruler{position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:visible}
.gmo .ledger{right:58px;top:63px}
.gmo .ledger .ct{padding:14px 26px 12px;width:430px}
.gmo .ledger .t{font-size:15px;letter-spacing:.24em;color:var(--ink);font-weight:700}
.gmo .ledger .t0{font-style:italic;font-weight:500;font-size:19px;color:#5A4F3A;margin:1px 0 6px}
.gmo .ledger .row{overflow:hidden;border-top:1px solid rgba(94,84,64,.4)}
.gmo .ledger .ri{display:flex;align-items:center;gap:12px;padding:6px 0 5px}
.gmo .ledger .n{font-family:"GM Cinzel",serif;font-weight:700;width:18px;color:var(--caps);font-size:18px}
.gmo .ledger .who{font-weight:700;font-size:18.5px;letter-spacing:.12em;text-transform:uppercase;line-height:1.1}
.gmo .ledger .rn{display:block;font-style:italic;font-weight:500;font-size:16px;letter-spacing:0;text-transform:none;color:#5A4F3A}
.gmo .ledger .stp{margin-left:auto}
.gmo .stamp{display:inline-block;font-family:"GM Cinzel",serif;font-weight:700;letter-spacing:.16em;padding:3px 10px 2px;border:2.5px solid currentColor;border-radius:3px;
 box-shadow:inset 0 0 0 1.5px rgba(226,218,190,.9),inset 0 0 0 3px currentColor;-webkit-mask:var(--inkmask) 0 0/220px 220px;mask:var(--inkmask) 0 0/220px 220px;mix-blend-mode:multiply}
.gmo .ledger .stp .stamp{font-size:14px;transform:rotate(-6deg)}
.gmo .ledger .fin{text-align:center;padding:10px 0 2px;border-top:1px solid rgba(94,84,64,.4)}
.gmo .ledger .fin .stamp{font-size:26px;line-height:1.08;padding:6px 18px 4px;transform:rotate(-5deg)}
/* ---- film look */
.gmo .paper{position:absolute;inset:0;background:var(--paperurl) 0 0/512px 512px;mix-blend-mode:multiply;opacity:.1}
.gmo .grain{position:absolute;left:-64px;top:-64px;width:${W + 128}px;height:${H + 128}px;mix-blend-mode:overlay;opacity:.16;background-size:512px 512px}
.gmo .vig{position:absolute;inset:0;background:radial-gradient(ellipse 75% 72% at 50% 50%,rgba(0,0,0,0) 55%,rgba(8,10,12,.32) 80%,rgba(4,5,6,.62) 100%)}
`;

  // ------------------------------------------------------------------ helpers
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const fmtN = (v) => Math.round(v).toLocaleString("en-US");
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const canvasURL = (w, h, paint) => { const c = document.createElement("canvas"); c.width = w; c.height = h; paint(c.getContext("2d"), w, h); return c.toDataURL("image/png"); };
  const vnoise = (R, n) => { const g = []; for (let i = 0; i < n * n; i++) g.push(R()); const at = (x, y) => g[((y % n + n) % n) * n + ((x % n + n) % n)];
    return (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      return lerp(lerp(at(xi, yi), at(xi + 1, yi), u), lerp(at(xi, yi + 1), at(xi + 1, yi + 1), u), v); }; };
  const paperTex = (seed) => canvasURL(512, 512, (x, w, h) => { const R = rng(seed), img = x.createImageData(w, h), n1 = vnoise(R, 8), n2 = vnoise(R, 32), n3 = vnoise(R, 128);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const u = i / w, v = j / h, k = 0.8 + 0.2 * (0.55 * n1(u * 8, v * 8) + 0.3 * n2(u * 32, v * 32) + 0.15 * n3(u * 128, v * 128));
      const o = (j * w + i) * 4; img.data[o] = 255 * k; img.data[o + 1] = 247 * k; img.data[o + 2] = 230 * k; img.data[o + 3] = 255; }
    x.putImageData(img, 0, 0); x.globalAlpha = 0.08; x.strokeStyle = "#5a4320"; x.lineWidth = 0.7;
    for (let f = 0; f < 380; f++) { const px = R() * w, py = R() * h, a = R() * Math.PI, l = 6 + R() * 22; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); } });
  const grainTex = (seed) => canvasURL(512, 512, (x, w, h) => { const R = rng(seed), img = x.createImageData(w, h);
    for (let o = 0; o < w * h * 4; o += 4) { const k = 128 + (R() + R() + R() - 1.5) * 120; img.data[o] = img.data[o + 1] = img.data[o + 2] = clamp(k, 0, 255); img.data[o + 3] = 255; } x.putImageData(img, 0, 0); });
  const inkMask = (seed) => canvasURL(220, 220, (x, w, h) => { const R = rng(seed), n = vnoise(R, 22), img = x.createImageData(w, h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const v = n(i / 10, j / 10), sp = R(); const a = v < 0.18 ? 0.25 : sp < 0.035 ? 0.1 : 0.82 + 0.18 * v; img.data[(j * w + i) * 4 + 3] = 255 * a; }
    x.putImageData(img, 0, 0); });

  // notched ivory card: concave corner notches, dark outer rule + inner hairline, optional scroll curls on the right
  let gid = 0;
  const frameSVG = (w, h, o = {}) => {
    const r = o.notch != null ? o.notch : 8, d = o.inset != null ? o.inset : 4.5, id = "gmoF" + (++gid);
    const P = (x0, y0, x1, y1, rr) => `M${x0 + rr} ${y0} L${x1 - rr} ${y0} A${rr} ${rr} 0 0 0 ${x1} ${y0 + rr} L${x1} ${y1 - rr} A${rr} ${rr} 0 0 0 ${x1 - rr} ${y1} L${x0 + rr} ${y1} A${rr} ${rr} 0 0 0 ${x0} ${y1 - rr} L${x0} ${y0 + rr} A${rr} ${rr} 0 0 0 ${x0 + rr} ${y0} Z`;
    const curl = (x, y, sy) => `<path d="M${x} ${y} c-8 0 -13 ${4 * sy} -13 ${9 * sy} c0 ${5 * sy} 4 ${7 * sy} 7 ${5.5 * sy} c3 -2 2 ${-5.5 * sy} -1.8 ${-4.5 * sy}" fill="none" stroke="#6A5D45" stroke-width="1.3" stroke-linecap="round"/><path d="M${x} ${y} l-20 0" stroke="#6A5D45" stroke-width="1"/>`;
    return `<svg class="fr" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0.25" y2="1"><stop offset="0" stop-color="${o.c1 || "#E6DEC5"}"/><stop offset="1" stop-color="${o.c2 || "#D2C6A3"}"/></linearGradient></defs>
      <path d="${P(0.75, 0.75, w - 0.75, h - 0.75, r)}" fill="url(#${id})" stroke="#4E4532" stroke-width="1.5"/>
      <path d="${P(d, d, w - d, h - d, Math.max(2, r - d * 0.6))}" fill="none" stroke="#7D7158" stroke-width="1"/>
      ${o.curls ? curl(w - d - 6, d + 9, 1) + curl(w - d - 6, h - d - 9, -1) : ""}</svg>`;
  };
  const ornSVG = (c = "#6A5D45") => `<svg class="orn" viewBox="0 0 84 7"><line x1="0" y1="3.5" x2="35" y2="3.5" stroke="${c}" stroke-width=".9"/><line x1="49" y1="3.5" x2="84" y2="3.5" stroke="${c}" stroke-width=".9"/><rect x="39" y="1.4" width="4.2" height="4.2" fill="${c}" transform="rotate(45 41.1 3.5)"/></svg>`;
  // wax seal: irregular red disc, impressed ring, two ribbon tails (timeline battle marker)
  const sealSVG = (seed, r = 26) => { const R = rng(seed); let p = ""; for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2, rr = r * (0.94 + 0.09 * R()); p += `${i ? "L" : "M"}${(Math.cos(a) * rr).toFixed(2)} ${(Math.sin(a) * rr).toFixed(2)}`; }
    const id = "gmoS" + (++gid);
    return `<svg class="seal" width="${r * 2}" height="${r * 3}" viewBox="${-r} ${-r} ${r * 2} ${r * 3}"><defs><radialGradient id="${id}" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#B0463A"/><stop offset=".45" stop-color="#86271F"/><stop offset="1" stop-color="#4E120F"/></radialGradient></defs>
      <path d="M-7 ${r * 0.55} L-15 ${r * 1.55} L-9 ${r * 1.6} L-1 ${r * 0.6}Z" fill="#D2B27A" stroke="#7A5A2A" stroke-width=".8"/><path d="M5 ${r * 0.6} L12 ${r * 1.6} L18 ${r * 1.5} L10 ${r * 0.55}Z" fill="#C9A56A" stroke="#7A5A2A" stroke-width=".8"/>
      <path d="${p}Z" fill="url(#${id})"/><circle r="${r * 0.66}" fill="none" stroke="#5A1510" stroke-width="2.2" opacity=".75"/><circle r="${r * 0.66}" fill="none" stroke="#C25E4E" stroke-width=".8" opacity=".45" transform="translate(.8 .9)"/>
      <ellipse cx="${-r * 0.3}" cy="${-r * 0.42}" rx="${r * 0.32}" ry="${r * 0.14}" fill="#fff" opacity=".18" transform="rotate(-30 ${-r * 0.3} ${-r * 0.42})"/></svg>`; };
  const legArrow = (c) => `<svg viewBox="0 0 56 16"><path d="M2 11 C14 7 30 6 42 7.5" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="4.2" stroke-linecap="round" transform="translate(0 1.4)"/><path d="M2 11 C14 7 30 6 42 7.5" fill="none" stroke="${c}" stroke-width="4.2" stroke-linecap="round"/><path d="M40 2 L54 8 L40 14 Z" fill="${c}"/></svg>`;
  // pocket watch: gold case, bow ring, white enamel dial, blued breguet hands (centre at (105,110) on the stage)
  const watchSVG = () => {
    let s = `<svg class="watch" viewBox="-44 -74 88 118"><defs><radialGradient id="gmoCase" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#F6DFA4"/><stop offset=".35" stop-color="#D2A866"/><stop offset=".7" stop-color="#A9783D"/><stop offset="1" stop-color="#6E4A22"/></radialGradient>
      <radialGradient id="gmoDial" cx=".45" cy=".38" r=".75"><stop offset="0" stop-color="#FBFAF4"/><stop offset=".8" stop-color="#ECEAE0"/><stop offset="1" stop-color="#CFCBBB"/></radialGradient></defs>
      <circle cy="-61" r="9" fill="none" stroke="url(#gmoCase)" stroke-width="3.6"/><circle cy="-61" r="9" fill="none" stroke="#6E4A22" stroke-width=".6"/><rect x="-4.5" y="-53" width="9" height="9" rx="2" fill="url(#gmoCase)" stroke="#6E4A22" stroke-width=".7"/>
      <circle r="44" fill="url(#gmoCase)" stroke="#5E3F1A" stroke-width="1"/><circle r="38.5" fill="url(#gmoDial)" stroke="#8C6A3A" stroke-width="1.2"/>`;
    for (let i = 0; i < 60; i++) s += `<line x1="0" y1="-36.5" x2="0" y2="${i % 5 ? -35 : -33.6}" stroke="#4A4A4A" stroke-width="${i % 5 ? 0.45 : 1}" transform="rotate(${i * 6})"/>`;
    for (let i = 1; i <= 12; i++) { const a = (i * 30 - 90) * Math.PI / 180; s += `<text x="${(Math.cos(a) * 28).toFixed(2)}" y="${(Math.sin(a) * 28 + 2.6).toFixed(2)}" text-anchor="middle" font-family="GM Cormorant, serif" font-weight="600" font-size="7.4" fill="#3A3A3A">${i}</text>`; }
    s += `<g class="hh"><path d="M-1.6 4 L-1.1 -10 L0 -11.5 L1.1 -10 L1.6 4Z" fill="#2F4470"/><circle cy="-14" r="3.4" fill="none" stroke="#2F4470" stroke-width="1.4"/><path d="M-.9 -17 L0 -20 L.9 -17Z" fill="#2F4470"/></g>
      <g class="mh"><path d="M-1.1 5 L-.7 -20 L0 -21 L.7 -20 L1.1 5Z" fill="#2F4470"/><circle cy="-24" r="2.6" fill="none" stroke="#2F4470" stroke-width="1.1"/><path d="M-.7 -26.5 L0 -32 L.7 -26.5Z" fill="#2F4470"/></g>
      <circle r="2.6" fill="#2F4470"/><circle r=".9" fill="#D2A866"/><ellipse cx="-12" cy="-16" rx="17" ry="9" fill="#fff" opacity=".22" transform="rotate(-32 -12 -16)"/></svg>`;
    return s;
  };
  const partOfDay = (m) => { m = ((m % 1440) + 1440) % 1440; const h = Math.floor(m / 60), mm = Math.floor(m % 60);
    return { time: `${((h + 11) % 12) + 1}:${String(mm).padStart(2, "0")}`, part: h === 12 && mm === 0 ? "MIDDAY" : h < 5 ? "AT NIGHT" : h < 12 ? "IN THE MORNING" : h < 17 ? "IN THE AFTERNOON" : h < 20 ? "IN THE EVENING" : "AT NIGHT" }; };
  const toMin = (v) => typeof v === "number" ? v : (() => { const m = String(v).match(/(\d+):(\d+)/); return m ? +m[1] * 60 + +m[2] : 0; })();
  const SIDE = { us: ["#2C4A8A", "#DEE6E3"], cs: ["#9C3A35", "#DEE6E3"], fr: ["#2C4A8A", "#DEE6E3", "#8E2B3A"], uk: ["#9C3A35"], ru: ["#DEE6E3", "#3F6A47"], pr: ["#1E1E1E", "#DEE6E3"], au: ["#C9A24A", "#1E1E1E"] };
  const RING = { us: ["#C8A060", "#7A5428"], cs: ["#B4584A", "#6E2A22"], fr: ["#C8A060", "#7A5428"], uk: ["#B4584A", "#6E2A22"], ru: ["#7FA07E", "#2F4F36"], pr: ["#9A9A92", "#3A3A36"], au: ["#D6B56E", "#7A5A2A"], gold: ["#D2A866", "#6E4A22"] };

  // ================================================================== create
  function create(host, opts = {}) {
    const gsap = window.gsap; if (!gsap) throw new Error("GMOverlay needs gsap");
    const tl = opts.tl || gsap.timeline({ paused: true });
    const project = opts.project || ((p) => ({ x: p[0], y: p[1], visible: true }));
    const fontBase = opts.fontBase || "assets/fonts/", seed = opts.seed || 1814;
    const E = { out: gsap.parseEase("power2.out"), inout: gsap.parseEase("power2.inOut") };
    if (!document.getElementById("gmo-css")) { const st = document.createElement("style"); st.id = "gmo-css"; st.textContent = fontCSS(fontBase) + CSS; document.head.appendChild(st); }
    const root = document.createElement("div"); root.className = "gmo";
    root.style.setProperty("--paperurl", `url(${paperTex(seed)})`); root.style.setProperty("--inkmask", `url(${inkMask(seed + 7)})`);
    host.appendChild(root);
    const layer = () => { const d = document.createElement("div"); d.className = "L"; root.appendChild(d); return d; };
    // z-order (bottom -> top): grade, dim, map-anchored (lines, markers), paper, grain, vignette, medallions, cards, HUD
    // v5 (critic A 10): paper / grain / vignette belong to the MAP only; the plaques, cards and HUD sit clean on top (his plaque paper ~(227,217,193))
    const Lgrade = layer(), Ldim = layer(), Lmap = layer(), Lpaper = layer(), Lgrain = layer(), Lvig = layer(), Lmed = layer(), Lcards = layer(), Lhud = layer();
    const NS = "http://www.w3.org/2000/svg";
    const svgLayer = (parent, cls) => { const s = document.createElementNS(NS, "svg"); s.setAttribute("class", cls); s.setAttribute("viewBox", `0 0 ${W} ${H}`); parent.appendChild(s); return s; };
    const leadSVG = svgLayer(Lmap, "lead");
    const mk = (parent, cls, html, css = "") => { const e = document.createElement("div"); e.className = "abs " + cls; if (css) e.style.cssText = css; e.innerHTML = html; parent.appendChild(e); return e; };
    const fadeIn = (el, t, d = 0.6, from = {}, to = {}) => { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, ...from }, { autoAlpha: 1, duration: d, ease: "power2.out", immediateRender: false, ...to }, t); };
    const fadeOut = (el, t, d = 0.5, to = {}) => { if (t != null) tl.to(el, { autoAlpha: 0, duration: d, ease: "power1.in", ...to }, t); };
    const updaters = [], framed = [];
    // framed plaque: <div class="plq"><svg.fr/><div class="ct">...</div></div>; the frame follows the content size
    const plaque = (parent, cls, inner, fo = {}, css = "") => { const e = mk(parent, "plq " + cls, `<svg class="fr"></svg><div class="ct">${inner}</div>`, css); framed.push({ e, ct: e.lastElementChild, fo, w: 0, h: 0 }); return e; };
    const reframe = () => { for (const f of framed) { const w = f.ct.offsetWidth, h = f.ct.offsetHeight;
      if (w && h && (w !== f.w || h !== f.h)) { f.w = w; f.h = h; f.e.firstElementChild.outerHTML = frameSVG(w, h, f.fo); } } };
    const O = { tl, root };

    // ---------------------------------------------------------------- film look: grade (day / dusk / night / candle), dim, paper, grain, vignette
    const gradeKeys = [{ t: -1, mode: opts.grade || "day", d: 0, o: {} }];
    const gDay = mk(Lgrade, "", "", "inset:0;mix-blend-mode:soft-light;background:linear-gradient(120deg,rgba(255,214,160,.32),rgba(255,214,160,.04) 70%)");
    const gDusk = mk(Lgrade, "", "", "inset:0;mix-blend-mode:multiply;background:linear-gradient(180deg,rgba(150,104,84,.38),rgba(70,52,64,.5))");
    const gNight = mk(Lgrade, "", "", "inset:0;mix-blend-mode:multiply;background:radial-gradient(ellipse at 50% 45%,rgba(40,62,88,.62),rgba(10,18,30,.86))");
    const gCandle = mk(Lgrade, "", "", "inset:0;mix-blend-mode:soft-light");
    const paper = mk(Lpaper, "paper", ""), grain = mk(Lgrain, "grain", ""), vig = mk(Lvig, "vig", "");
    const grainURLs = [0, 1, 2, 3, 4, 5].map((i) => grainTex(seed * 31 + i));
    const GW = { day: [1, 0, 0, 0], dusk: [0.3, 1, 0, 0], night: [0, 0, 0.45, 0],   /* clip: the 3D world already lights the night */ candle: [0, 0, 0, 1], none: [0, 0, 0, 0] };
    O.film = {
      grade(t, mode, d = 1.0, o = {}) { gradeKeys.push({ t, mode, d, o }); gradeKeys.sort((a, b) => a.t - b.t); return O; },
      set(o = {}) { if (o.grain != null) grain.style.opacity = o.grain; if (o.paper != null) paper.style.opacity = o.paper; if (o.vignette != null) vig.style.opacity = o.vignette; return O; },
      dim(tIn, tOut, amt = 1) { const d = mk(Ldim, "dim", ""); gsap.set(d, { autoAlpha: 0 }); tl.fromTo(d, { autoAlpha: 0 }, { autoAlpha: amt, duration: 0.8, immediateRender: false }, tIn); fadeOut(d, tOut, 0.8); return O; },
    };
    updaters.push((t) => {
      let w = GW.day, k = 1, prev = GW.day, at = [W * 0.3, H * 0.75];
      for (let i = 0; i < gradeKeys.length; i++) { const g = gradeKeys[i]; if (g.t > t) break; prev = i ? GW[gradeKeys[i - 1].mode] || GW.none : GW.day; w = GW[g.mode] || GW.none; k = g.d ? clamp((t - g.t) / g.d) : 1; if (g.o && g.o.at) at = g.o.at; }
      const c = w.map((v, i) => lerp(prev[i], v, E.inout(k)));
      gDay.style.opacity = c[0].toFixed(3); gDusk.style.opacity = c[1].toFixed(3); gNight.style.opacity = c[2].toFixed(3); gCandle.style.opacity = c[3].toFixed(3);
      const fl = 0.86 + 0.07 * Math.sin(t * 13.1) + 0.05 * Math.sin(t * 29.7 + 1.3) + 0.03 * Math.sin(t * 51.3 + 0.4);   // deterministic candle flicker
      if (c[3] > 0.001) gCandle.style.background = `radial-gradient(circle 1100px at ${at[0]}px ${at[1]}px,rgba(255,176,90,${(0.55 * fl).toFixed(3)}) 0%,rgba(255,140,60,${(0.22 * fl).toFixed(3)}) 35%,rgba(20,10,4,.55) 75%,rgba(8,4,2,.8) 100%)`;
      // the HUD is graded with the scene: at night the ivory turns a dim warm tan (#AB8964 measured at 9:04 PM)
      const nw = c[2] + 0.5 * c[1], f = nw > 0.001 ? `brightness(${(1 - 0.2 * nw).toFixed(3)}) sepia(${(0.42 * nw).toFixed(3)})` : "";
      Lhud.style.filter = f; Lcards.style.filter = f; Lmed.style.filter = f;
      const fi = Math.floor(t * 24 + 1e-6), R = rng(fi * 7919 + 13);   // grain: new frame every 1/24 s, deterministic
      grain.style.backgroundImage = `url(${grainURLs[fi % 6]})`; grain.style.transform = `translate(${Math.floor(R() * 64)}px,${Math.floor(R() * 64)}px)`;
    });

    // ---------------------------------------------------------------- 1. date / clock plaque (top-left)
    {
      const dateEl = plaque(Lhud, "pdate", `<div class="caps hd"></div><div class="rw"><div class="dn"></div><div class="vr"></div><div><div class="caps wd"></div><div class="it nt"></div></div></div>`, { notch: 8 });
      const clockEl = mk(Lhud, "", watchSVG(), "left:0;top:0;width:0;height:0");
      const clockPl = plaque(Lhud, "pclock", `<div class="caps hd"></div><div class="tm"><span class="tv"></span><span class="caps tp"></span></div><div class="it nt"></div>`, { notch: 8, curls: true });
      Lhud.appendChild(clockEl);   // the watch sits on top of the plaque's left end
      gsap.set([dateEl, clockEl, clockPl], { autoAlpha: 0 });
      const HH = clockEl.querySelector(".hh"), MH = clockEl.querySelector(".mh");
      const dateKeys = [], clockKeys = [], noteKeys = [], hdKeys = [], labelKeys = [];
      let mode = null;
      const els = (m) => m === "clock" ? [clockEl, clockPl] : [dateEl];
      const swap = (t, from, to) => { if (from) tl.to(from, { autoAlpha: 0, duration: 0.35, ease: "power1.in" }, t); tl.fromTo(to, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, t + (from ? 0.3 : 0)); };
      O.plaque = {
        date(t, o) { dateKeys.push({ t, o }); if (mode !== "date") { swap(t, mode ? els(mode) : null, els("date")); mode = "date"; } return O; },
        clock(t, o = {}) { if (o.time != null) clockKeys.push({ type: "set", t, v: toMin(o.time), d: o.d != null ? o.d : 0.8 }); if (o.note != null) noteKeys.push({ t, text: o.note }); hdKeys.push({ t, text: o.header || "" });
          if (mode !== "clock") { swap(t, mode ? els(mode) : null, els("clock")); mode = "clock"; } return O; },
        run(t0, t1, toTime, o = {}) { clockKeys.push({ type: "run", t: t0, t1, v: toMin(toTime), step: o.step || 1 }); return O; },
        set(t, time, d = 0.8) { clockKeys.push({ type: "set", t, v: toMin(time), d }); return O; },
        note(t, text) { noteKeys.push({ t, text }); return O; },
        label(t, text) { labelKeys.push({ t, text }); return O; },
        hide(t) { fadeOut(els(mode || "date"), t, 0.5); mode = null; return O; },
      };
      O.watch = O.plaque;
      let steps = null;
      const build = () => { steps = []; let cur = null;
        for (const e of clockKeys.slice().sort((a, b) => a.t - b.t)) {
          if (e.type === "set" || cur == null) { steps.push({ t: e.t, v: e.v, prev: cur == null ? e.v : cur, d: e.d || 0.8, run: null }); cur = e.v; if (e.type === "set") continue; }
          steps.push({ t: e.t, v: e.v, prev: cur, d: e.t1 - e.t, run: e.step }); cur = e.v; }
        for (const a of [dateKeys, noteKeys, hdKeys, labelKeys]) a.sort((x, y) => x.t - y.t); };
      const last = (arr, t) => { let r = null; for (const k of arr) { if (k.t <= t) r = k; else break; } return r; };
      updaters.push((t) => {
        if (!steps) build();
        const dk = last(dateKeys, t) || dateKeys[0];
        if (dk) { const o = dk.o, set = (s, v) => { const n = dateEl.querySelector(s); if (n.textContent !== String(v)) n.textContent = v; };
          set(".hd", o.month || ""); set(".dn", o.day || ""); set(".wd", o.weekday || ""); set(".nt", o.note || ""); }
        const s = last(steps, t) || steps[0];
        if (s) { let disp, ang;
          if (s.run) { const raw = lerp(s.prev, s.v, clamp((t - s.t) / s.d)); disp = Math.floor(raw / s.run + 1e-6) * s.run; ang = raw; }
          else { disp = s.v; ang = lerp(s.prev, s.v, E.inout(clamp((t - s.t) / s.d))); }
          HH.setAttribute("transform", `rotate(${((ang / 60) % 12) * 30})`); MH.setAttribute("transform", `rotate(${(ang % 60) * 6})`);
          const f = partOfDay(disp), lb = last(labelKeys, t), q = (sel) => clockPl.querySelector(sel);
          const tv = lb && lb.text ? lb.text : f.time, tp = lb && lb.text ? "" : f.part;
          if (q(".tv").textContent !== tv) q(".tv").textContent = tv; if (q(".tp").textContent !== tp) q(".tp").textContent = tp;
          const nk = last(noteKeys, t); if (nk && q(".nt").textContent !== nk.text) q(".nt").textContent = nk.text;
          const hk = last(hdKeys, t), hv = hk ? hk.text : ""; if (q(".hd").textContent !== hv) { q(".hd").textContent = hv; q(".hd").style.display = hv ? "" : "none"; } }
      });
    }

    // ---------------------------------------------------------------- 2. bottom timeline: day cells + red progress line + wax seals (+ optional counter)
    {
      const el = plaque(Lhud, "tline", "", { notch: 7 }); gsap.set(el, { autoAlpha: 0 });
      const ct = el.querySelector(".ct"); let cells = [], cw = 156, counter = null; const keys = [], seals = [], cKeys = [];
      O.timeline = {
        show(t, o = {}) {   // o: {month, year, days:[10,11,..] | cells:['6','8',...], cellW, at, counter}
          const labels = o.cells || o.days || [];
          cw = o.cellW || Math.round((1036 - 99) / Math.max(1, labels.length));
          ct.innerHTML = `<div class="lb"><div class="caps m">${esc(o.month || "")}</div>${ornSVG("#7A6E55")}<div class="caps y">${esc(o.year || "")}</div></div>` +
            labels.map((d) => `<div class="cl" style="width:${cw}px"><div class="d">${esc(d)}</div><div class="bn"></div></div>`).join("") + `<div class="pg"><i></i></div>` +
            (o.counter ? `<div class="cnt"><div class="caps k">${esc(o.counter)}</div><div class="v">0</div></div>` : "");
          cells = [...ct.querySelectorAll(".cl")]; counter = ct.querySelector(".cnt .v");
          if (o.counter && cells.length) cells[cells.length - 1].style.width = `${cw + 170}px`;
          keys.push({ t: t - 0.001, pos: o.at != null ? o.at : 0, d: 0 }); fadeIn(el, t, 0.7, { y: 20 }, { y: 0 }); return O; },
        go(t, o) { keys.push({ t, pos: o.at, d: o.d != null ? o.d : 1.2 }); if (o.cas != null) cKeys.push({ t, v: o.cas, d: o.d != null ? o.d : 1.2 }); return O; },   // at = cell index + fraction
        seal(t, o) { const s = mk(el, "", sealSVG(seed + seals.length * 17, 26), "left:0;top:0;width:0;height:0");
          seals.push({ el: s, at: o.at, name: o.name ? { i: Math.max(0, Math.ceil(o.at) - 1), text: o.name, t } : null }); gsap.set(s, { autoAlpha: 0 });
          tl.fromTo(s, { autoAlpha: 0, scale: 1.9, rotation: -14 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.32, ease: "power4.in", immediateRender: false }, t); return O; },
        hide(t) { fadeOut(el, t, 0.5, { y: 14 }); return O; },
      };
      updaters.push((t) => {
        if (!cells.length) return;
        keys.sort((a, b) => a.t - b.t); let pos = 0, prev = 0;
        for (const k of keys) { if (k.t > t) break; pos = lerp(prev, k.pos, E.inout(k.d ? clamp((t - k.t) / k.d) : 1)); prev = k.pos; }
        ct.querySelector(".pg").style.width = `${(pos * cw).toFixed(1)}px`;
        cells.forEach((c, i) => c.classList.toggle("on", pos > i + 0.001 || i === 0));
        for (const s of seals) { s.el.style.left = `${(99 + s.at * cw).toFixed(1)}px`; s.el.style.top = "26px";
          if (s.name) { const bn = cells[s.name.i] && cells[s.name.i].querySelector(".bn"), v = t >= s.name.t ? s.name.text : ""; if (bn && bn.textContent !== v) bn.textContent = v; } }
        if (counter) { let v = 0, pv = 0; for (const k of cKeys) { if (k.t > t) break; v = lerp(pv, k.v, E.out(clamp((t - k.t) / k.d))); pv = k.v; } const s = fmtN(v >= 1000 ? Math.round(v / 100) * 100 : v); if (counter.textContent !== s) counter.textContent = s; }
      });
    }

    // ---------------------------------------------------------------- 3. THE ARMIES legend (bottom-left)
    O.legend = (tIn, tOut, o) => {
      const el = mk(Lhud, "legend", `<div class="caps t">${esc(o.title || "THE ARMIES")}</div>` + o.entries.map((e) => `<div class="e">${legArrow(e.color || "#3A3A36")}<div><div class="n">${esc(e.name)}</div>${e.sub ? `<div class="s">${esc(e.sub)}</div>` : ""}</div></div>`).join(""));
      fadeIn(el, tIn, 0.6, { y: 12 }, { y: 0 }); fadeOut(el, tOut, 0.5); return O; };

    // ---------------------------------------------------------------- 4. medallions: 'card' (portrait over an ivory plaque, leader line to the map) and 'plate' (portrait + dark plate)
    {
      const meds = [];
      const portrait = (img, d, ring) => { const [a, b] = RING[ring] || RING.gold, ip = Math.round(d * 0.07), iw = d - 2 * ip;
        return `<div class="por" style="width:${d}px;height:${d}px;background:radial-gradient(circle at 35% 30%,${a},${b});box-shadow:0 6px 14px rgba(0,0,0,.5),0 0 0 1.2px rgba(30,20,10,.7)">
          <div class="pi" style="left:${ip}px;top:${ip}px;width:${iw}px;height:${iw}px;box-shadow:0 0 0 1.5px #E8E0CB,inset 0 0 10px rgba(0,0,0,.5)"><img src="${esc(img)}" alt=""></div></div>`; };
      O.medallion = (o) => {
        const kind = o.kind || "card", el = document.createElement("div"); el.className = "med"; Lmed.appendChild(el);
        const d = o.size || (kind === "card" ? 142 : 134), men = o.men ? `<div class="nl">c.<b>${esc(o.men)}</b><i>${esc(o.menUnit || "men")}</i></div>` : "";
        if (kind === "card") {
          el.innerHTML = `<div class="in">${portrait(o.img, d, o.ring || o.side || "gold")}<div class="plq mcard"><svg class="fr"></svg><div class="ct">
            ${o.role ? `<div class="caps rl">${esc(o.role)}</div>` : ""}<div class="nm">${esc(o.name)}</div>${o.sub || o.men ? ornSVG() : ""}${o.sub ? `<div class="it sb">${esc(o.sub)}</div>` : ""}${men}</div></div></div>`;
          { const e = el.querySelector(".mcard"); framed.push({ e, ct: e.querySelector(".ct"), fo: { notch: 7 }, w: 0, h: 0 }); }
        } else {
          const st = (o.stripes || SIDE[o.side] || []).map((c) => `<i style="background:${c}"></i>`).join("");
          el.innerHTML = `<div class="mplate">${portrait(o.img, d, o.ring || o.side || "gold")}<div class="pb"><div class="st">${st}</div><div class="tx">
            ${o.role ? `<div class="caps rl">${esc(o.role)}</div>` : ""}<div class="nm${o.titleCase ? " tc" : ""}">${esc(o.name)}</div>${o.sub ? `<div class="it sb">${esc(o.sub)}</div>` : ""}${men}</div></div></div>`;
        }
        const inner = el.firstElementChild; gsap.set(inner, { autoAlpha: 0 });
        const line = document.createElementNS(NS, "g"); line.innerHTML = `<line stroke="rgba(20,20,18,.75)" stroke-width="1.6"/><circle r="4" fill="#1E1E1A" stroke="#E8E0CB" stroke-width="1.5"/>`; leadSVG.appendChild(line);
        const lead = !!o.world && o.leader !== false;
        tl.fromTo(inner, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, o.tIn + (lead ? 0.3 : 0));
        if (o.tOut != null) tl.to(inner, { autoAlpha: 0, duration: 0.45, ease: "power1.in" }, o.tOut);
        meds.push({ o, el, inner, line, r: d / 2, lead, off: o.offset || [-190, -150] }); return O; };
      updaters.push((t) => {
        for (const m of meds) {
          const pr = m.o.world ? project(m.o.world, t) : null;
          const on = t >= m.o.tIn && (m.o.tOut == null || t < m.o.tOut + 0.5) && (!m.o.world || (pr && pr.visible !== false));
          if (!on) { m.el.style.display = "none"; m.line.setAttribute("display", "none"); continue; }
          m.el.style.display = "";
          // portrait centre = fixed screen point, or anchor + offset; the card / plate hangs off the portrait
          const cx = m.o.screen ? m.o.screen[0] : pr.x + m.off[0], cy = m.o.screen ? m.o.screen[1] : pr.y + m.off[1];
          const por = m.inner.querySelector(".por"), px = por.offsetLeft + m.r, py = por.offsetTop + m.r;
          m.el.style.transform = `translate(${(cx - px).toFixed(1)}px,${(cy - py).toFixed(1)}px)`;
          if (!m.lead) { m.line.setAttribute("display", "none"); continue; }
          m.line.removeAttribute("display");
          const dx = pr.x - cx, dy = pr.y - cy, L = Math.hypot(dx, dy) || 1, ex = cx + dx / L * m.r, ey = cy + dy / L * m.r;
          const k = E.inout(clamp((t - m.o.tIn) / 0.45)), out = m.o.tOut != null ? 1 - clamp((t - m.o.tOut) / 0.45) : 1;
          const l = m.line.firstElementChild; l.setAttribute("x1", pr.x.toFixed(1)); l.setAttribute("y1", pr.y.toFixed(1)); l.setAttribute("x2", lerp(pr.x, ex, k).toFixed(1)); l.setAttribute("y2", lerp(pr.y, ey, k).toFixed(1));
          const c = m.line.lastElementChild; c.setAttribute("cx", pr.x.toFixed(1)); c.setAttribute("cy", pr.y.toFixed(1)); m.line.setAttribute("opacity", Math.min(clamp((t - m.o.tIn) / 0.2), out).toFixed(3));
        }
      });
    }

    // ---------------------------------------------------------------- 5. oval painting inset + ribbon caption; place card with a small oval inset
    const anchored = [];
    O.inset = (tIn, tOut, o) => {   // o: {img, x, y, w, h, caption}  (x, y = top-left of the oval)
      const w = o.w || 480, h = o.h || 358;
      const el = mk(Lcards, "oval", `<div class="ov"><img src="${esc(o.img)}" alt=""></div>${o.caption ? `<div class="rib" style="top:${h - 6}px">${esc(o.caption)}</div>` : ""}`, `left:${o.x}px;top:${o.y}px;width:${w}px;height:${h}px`);
      const rb = el.querySelector(".rib"); if (rb) gsap.set(rb, { xPercent: -50 });
      fadeIn(el, tIn, 0.8, { scale: 0.94 }, { scale: 1 }); fadeOut(el, tOut, 0.6); return O; };
    O.place = (tIn, tOut, o) => {   // o: {title, sub, img?, world | x,y}
      const ow = o.ovalW || 92, oh = o.ovalH || 112;
      const el = mk(Lcards, "", "", "left:0;top:0");
      plaque(el, "place", `<div class="tt">${esc(o.title)}</div>${o.sub ? ornSVG() + `<div class="it sb">${esc(o.sub)}</div>` : ""}`, { notch: 7 }, "position:relative");
      if (o.img) el.insertAdjacentHTML("beforeend", `<div class="mo" style="width:${ow}px;height:${oh}px;top:${-oh + 8}px;margin-left:${-ow / 2}px"><div><img src="${esc(o.img)}" alt=""></div></div>`);
      fadeIn(el, tIn, 0.6, { y: 12 }, { y: 0 }); fadeOut(el, tOut, 0.5);
      anchored.push({ el, o: { ...o, offset: o.offset }, ax: "below" }); return O; };
    // ---------------------------------------------------------------- 6. dark event label + map marker (red dot, cream ring, compass ticks)
    O.label = (tIn, tOut, o) => {   // o: {name, sub, world | x,y, stripes | side, marker, small, offset}
      const st = (o.stripes || SIDE[o.side] || []).map((c) => `<i style="background:${c}"></i>`).join("");
      const el = mk(Lcards, "", `<div class="elab${o.small ? " sm" : ""}">${st ? `<div class="st">${st}</div>` : ""}<div class="nm">${esc(o.name)}</div>${o.sub ? `<div class="it sb">${esc(o.sub)}</div>` : ""}</div>`, "left:0;top:0");
      let mkr = null;
      if (o.marker !== false && o.world) { mkr = document.createElementNS(NS, "g");
        mkr.innerHTML = `<circle r="16" fill="none" stroke="#E8E0CB" stroke-width="1" opacity=".75"/>${[0, 90, 180, 270].map((a) => `<line x1="0" y1="-19" x2="0" y2="-14" stroke="#E8E0CB" stroke-width="1.2" transform="rotate(${a})"/>`).join("")}<circle r="9.5" fill="#E8E0CB"/><circle r="6.5" fill="#B3282B"/><circle r="2" cx="-1.6" cy="-1.6" fill="#fff" opacity=".5"/>`;
        leadSVG.appendChild(mkr); gsap.set(mkr, { autoAlpha: 0 }); tl.fromTo(mkr, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, tIn); fadeOut(mkr, tOut, 0.4); }
      gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power3.out", immediateRender: false }, tIn + (mkr ? 0.15 : 0)); fadeOut(el, tOut, 0.45);
      const a = { el, o, ax: "right", mkr }; anchored.push(a); return a; };
    updaters.push((t) => { for (const a of anchored) {
      let x = a.o.x, y = a.o.y; if (a.o.world) { const p = project(a.o.world, t); if (!p) continue; x = p.x; y = p.y; }
      if (a.mkr) a.mkr.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      const w = a.el.offsetWidth, h = a.el.offsetHeight;
      const off = a.o.offset || (a.ax === "right" ? [32, -h / 2] : a.ax === "below" ? [-w / 2, 28] : [-w / 2, -h / 2]);
      a.el.style.left = `${clamp(x + off[0], 60, W - 60 - w).toFixed(1)}px`; a.el.style.top = `${clamp(y + off[1], 50, H - 110 - h).toFixed(1)}px`; } });

    // ---------------------------------------------------------------- 7. full-width cream letter card (header, Cinzel title, italic sub, typed quote)
    O.letter = (tIn, tOut, o) => {
      const el = mk(Lcards, "letter", `<div class="bg"></div><div class="tx"><div class="hd"><i></i><span>${esc(o.header || "")}</span><i></i></div><div class="tt">${esc(o.title)}</div>
        <div class="sb">${esc(o.sub || "")}</div>${ornSVG("#8A826C")}<div class="q"></div></div>`, o.top != null ? `top:${o.top}px` : "");
      gsap.set(el, { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, tIn);
      tl.fromTo(el.querySelector(".bg"), { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, tIn);
      const parts = el.querySelectorAll(".hd,.tt,.sb,.orn"); gsap.set(parts, { autoAlpha: 0 });
      parts.forEach((p, i) => tl.fromTo(p, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5, immediateRender: false }, tIn + 0.3 + i * 0.15));
      const Q = el.querySelector(".q"), txt = `“${o.quote || ""}”`, cps = o.cps || 28, ty = { n: 0 };
      tl.fromTo(ty, { n: 0 }, { n: txt.length, duration: txt.length / cps, ease: "none", immediateRender: false, onUpdate: () => { const s = txt.slice(0, Math.round(ty.n)); if (Q.textContent !== s) Q.textContent = s; } }, tIn + 1.0);
      if (tOut != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, tOut); return O; };

    // ---------------------------------------------------------------- 8. centred italic quote over a darkened map (optional original-language line)
    O.quote = (tIn, tOut, o) => {
      const qm = (s, lang) => lang === "de" ? `„${s}“` : lang === "ru" || lang === "fr" ? `«${s}»` : `“${s}”`;
      if (o.dim !== false) O.film.dim(tIn - 0.2, tOut, o.dim || 1);
      const el = mk(Lcards, "cq", `${o.orig ? `<div class="o" lang="${esc(o.lang || "fr")}">${esc(qm(o.orig, o.lang))}</div>` : ""}<div class="q">${esc(qm(o.en, "en"))}</div><div class="caps a">${esc(o.attr || "")}</div>`, `top:${o.y != null ? o.y : 640}px`);
      gsap.set(el, { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, tIn);
      [...el.children].forEach((p, i) => { gsap.set(p, { autoAlpha: 0 }); tl.fromTo(p, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out", immediateRender: false }, tIn + i * 0.45); });
      fadeOut(el, tOut, 0.7); return O; };

    // ---------------------------------------------------------------- 9. title card (Cinzel gold caps, rule, subtitle) and 3D gold numbers
    O.title = (tIn, tOut, o) => {
      const el = mk(Lcards, "title", `<div class="l gold">${(o.lines || [o.text]).map(esc).join("<br>")}</div><div class="r"></div><div class="s">${esc(o.sub || "")}</div>`, `top:${o.y != null ? o.y : 250}px`);
      gsap.set(el, { autoAlpha: 0 }); gsap.set(el.querySelector(".s"), { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, tIn);
      tl.fromTo(el.querySelector(".l"), { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 1.6, ease: "power2.out", immediateRender: false }, tIn);
      tl.fromTo(el.querySelector(".r"), { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: "power2.inOut", immediateRender: false }, tIn + 0.7);
      tl.fromTo(el.querySelector(".s"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, immediateRender: false }, tIn + 1.0);
      fadeOut(el, tOut, 0.9); return O; };
    O.number = (tIn, tOut, o) => {   // o: {value, side:'fr' (blue, gold edge) | gold, world | x,y, size, suffix, round}
      const sz = o.size || 112, depth = Math.round(sz * 0.07), ext = [...Array(depth)].map((_, i) => `${i + 1}px ${i + 1}px 0 #5E4520`).join(",");
      const el = mk(Lcards, "", `<div class="bign${o.side === "fr" ? " fr" : ""}" style="font-size:${sz}px"><span class="sh" style="transform:translate(${depth + 4}px,${depth + 12}px)"></span><span class="x" style="text-shadow:${ext}"></span><span class="f${o.side === "fr" ? "" : " gold"}"></span></div>`, "left:0;top:0");
      const spans = el.querySelectorAll("span"), c = { v: 0 }, rd = o.round || 1000, fmt = (v) => fmtN(Math.round(v / rd) * rd) + (o.suffix || "");
      spans.forEach((s) => { s.textContent = fmt(o.value); });
      gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)", immediateRender: false }, tIn);
      tl.fromTo(c, { v: o.from || 0 }, { v: o.value, duration: o.countDur || 1.4, ease: "power3.out", immediateRender: false, onUpdate: () => { const s = fmt(c.v); spans.forEach((x) => { if (x.textContent !== s) x.textContent = s; }); } }, tIn);
      fadeOut(el, tOut, 0.5); anchored.push({ el, o, ax: "center" }); return O; };

    // ---------------------------------------------------------------- 10. distance ruler (dashed cream arc between two world points + dark label) and ledger + stamps
    const rulers = [];
    O.distance = (tIn, tOut, o) => {
      const g = svgLayer(Lmap, "ruler");
      g.innerHTML = `<path fill="none" stroke="rgba(0,0,0,.55)" stroke-width="6" stroke-dasharray="16 12" stroke-linecap="round"/><path fill="none" stroke="#EEE7D6" stroke-width="3.2" stroke-dasharray="16 12" stroke-linecap="round"/>
        <circle class="e0" r="6" fill="#EEE7D6" stroke="#1E1E1A" stroke-width="2"/><circle class="e1" r="6" fill="#EEE7D6" stroke="#1E1E1A" stroke-width="2"/>`;
      gsap.set(g, { autoAlpha: 0 }); tl.set(g, { autoAlpha: 1 }, tIn); fadeOut(g, tOut, 0.5);
      const unit = o.unit || "MILES", c = { v: 0 }, L = O.label(tIn + 0.4, tOut, { name: `${fmtN(o.value)} ${unit}`, sub: o.sub, x: 0, y: 0, marker: false, stripes: o.stripes || [] }), nm = L.el.querySelector(".nm");
      tl.fromTo(c, { v: 0 }, { v: o.value, duration: 1.3, ease: "power2.out", immediateRender: false, onUpdate: () => { nm.textContent = `${fmtN(c.v)} ${unit}`; } }, tIn + 0.4);
      rulers.push({ g, o: { ...o, tIn, tOut }, L }); return O; };
    updaters.push((t) => { for (const r of rulers) { const a = project(r.o.from, t), b = project(r.o.to, t); if (!a || !b) continue;
      const k = E.inout(clamp((t - r.o.tIn) / (r.o.drawDur || 1.4))), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, lift = -Math.hypot(b.x - a.x, b.y - a.y) * 0.12, cx = mx, cy = my + lift;
      const bx = (1 - k) * (1 - k) * a.x + 2 * (1 - k) * k * cx + k * k * b.x, by = (1 - k) * (1 - k) * a.y + 2 * (1 - k) * k * cy + k * k * b.y;
      const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${lerp(a.x, cx, k).toFixed(1)} ${lerp(a.y, cy, k).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
      r.g.querySelectorAll("path").forEach((p) => p.setAttribute("d", d));
      const e0 = r.g.querySelector(".e0"), e1 = r.g.querySelector(".e1"); e0.setAttribute("cx", a.x); e0.setAttribute("cy", a.y); e1.setAttribute("cx", b.x); e1.setAttribute("cy", b.y); e1.setAttribute("opacity", k > 0.98 ? 1 : 0);
      r.L.o.x = mx; r.L.o.y = my + lift * 0.5; r.L.o.offset = [-r.L.el.offsetWidth / 2, -r.L.el.offsetHeight - 26]; } });
    {
      const el = plaque(Lhud, "ledger", `<div class="caps t"></div><div class="t0"></div><div class="rows"></div>`, { notch: 8, curls: true }); gsap.set(el, { autoAlpha: 0 });
      const ct = el.querySelector(".ct"), rows = el.querySelector(".rows"); let n = 0; const R = [];
      const slam = (st, t, rot) => { gsap.set(st, { autoAlpha: 0 }); tl.fromTo(st, { autoAlpha: 0, scale: 2.3, rotation: rot - 8 }, { autoAlpha: 0.92, scale: 1, rotation: rot, duration: 0.24, ease: "power4.in", immediateRender: false }, t);
        tl.fromTo(el, { x: 0, y: 0 }, { keyframes: [{ x: 2, y: 2, duration: 0.04 }, { x: -2, y: -1, duration: 0.05 }, { x: 0, y: 0, duration: 0.08 }], immediateRender: false }, t + 0.24); };
      O.ledger = {
        show(t, o = {}) { if (o.title != null) el.querySelector(".t").textContent = o.title; if (o.sub != null) el.querySelector(".t0").textContent = o.sub; fadeIn(el, t, 0.6, { y: -12 }, { y: 0 }); return O; },
        hide(t) { fadeOut(el, t, 0.5); return O; },
        add(t, o) { n++; const r = document.createElement("div"); r.className = "row";
          r.innerHTML = `<div class="ri"><span class="n">${n}</span><span class="who">${esc(o.who)}${o.note ? `<span class="rn">${esc(o.note)}</span>` : ""}</span>${o.stamp === false ? "" : `<span class="stp"><span class="stamp" style="color:${o.color || "#A8261B"}">${esc(o.stamp || "REFUSED")}</span></span>`}</div>`;
          rows.appendChild(r); gsap.set(r, { height: 0, autoAlpha: 0 });
          tl.fromTo(r, { height: 0, autoAlpha: 0 }, { height: o.note ? 58 : 42, autoAlpha: 1, duration: 0.45, ease: "power2.out", immediateRender: false }, t);
          if (o.stamp !== false) slam(r.querySelector(".stamp"), o.stampAt != null ? o.stampAt : t + 0.9, -6); R.push(r); return O; },
        note(t, i, text) { const w = R[i - 1].querySelector(".who"), s = document.createElement("span"); s.className = "rn"; s.textContent = text; w.appendChild(s); gsap.set(s, { autoAlpha: 0 });
          tl.to(R[i - 1], { height: 58, duration: 0.35 }, t); tl.fromTo(s, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, t + 0.1); return O; },
        final(t, o = {}) { const f = document.createElement("div"); f.className = "fin"; f.innerHTML = `<span class="stamp" style="color:${o.color || "#2A6A2A"}">${(o.lines || ["THE GUARD", "SAVED"]).map(esc).join("<br>")}</span>`;
          ct.appendChild(f); gsap.set(f, { height: 0, autoAlpha: 0 }); tl.fromTo(f, { height: 0, autoAlpha: 0 }, { height: 90, autoAlpha: 1, duration: 0.3, immediateRender: false }, t); slam(f.querySelector(".stamp"), t + 0.35, -5); return O; },
      };
    }

    // ---------------------------------------------------------------- update loop (pure function of t)
    O.update = (t) => { reframe(); for (const u of updaters) u(t); };
    // update after every child tween has rendered: chain onto the timeline's own onUpdate (keeps any callback the host set before)
    if (opts.hook !== false) { const prev = tl.eventCallback("onUpdate"); tl.eventCallback("onUpdate", function () { if (prev) prev.apply(this, arguments); O.update(tl.time()); }); }
    return O;
  }

  window.GMOverlay = { create, version: "2.0.0" };
})();
