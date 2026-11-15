/* GM overlay: Grand Maneuver-style on-screen overlays (watch box, timeline + casualty counter, medallions with leader
   lines, quote cards, event tags, REFUSED ledger, title / distance / number cards, grain + vignette + paper + grade).
   Spec: OVERLAY_SPEC.md (values are vidIQ-AI estimates until measured on real frames). API: README.md.
   Deterministic: everything is a function of the GSAP timeline time t (tweens on `tl` + a pure update(t) for the
   data-driven parts). No Date.now, no unseeded random, no timers. Needs window.gsap. 1920x1080 stage. */
(function () {
  "use strict";
  const W = 1920, H = 1080;
  const LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
  const LATINX = "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";
  const CYR = "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116";
  const fontCSS = (b) => {
    const ff = (fam, file, w, st, ur) => `@font-face{font-family:"${fam}";font-weight:${w};font-style:${st};font-display:block;src:url("${b}${file}") format("woff2");unicode-range:${ur};}`;
    let s = "";
    for (const [w, st] of [[400, "normal"], [400, "italic"], [500, "normal"], [500, "italic"], [600, "normal"], [700, "normal"]]) {
      s += ff("GM Garamond", `eb-garamond-latin-${w}-${st}.woff2`, w, st, LATIN) + ff("GM Garamond", `eb-garamond-latin-ext-${w}-${st}.woff2`, w, st, LATINX) + ff("GM Garamond", `eb-garamond-cyrillic-${w}-${st}.woff2`, w, st, CYR);
    }
    for (const [w, st] of [[400, "normal"], [400, "italic"], [700, "normal"]]) s += ff("GM Caslon", `libre-caslon-text-latin-${w}-${st}.woff2`, w, st, LATIN) + ff("GM Caslon", `libre-caslon-text-latin-ext-${w}-${st}.woff2`, w, st, LATINX);
    for (const w of [600, 700]) s += ff("GM Cinzel", `cinzel-latin-${w}-normal.woff2`, w, "normal", LATIN) + ff("GM Cinzel", `cinzel-latin-ext-${w}-normal.woff2`, w, "normal", LATINX);
    return s;
  };

  // ---------------------------------------------------------------- CSS (all sizes in px on the 1920x1080 stage)
  const CSS = `
.gmo{position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:hidden;pointer-events:none;
 --cream:#F4EEDD;--ink:#1A1712;--gold:#C9A24A;--gold-d:#7A5A1C;--gold-l:#F3DC9A;--parch-1:#F1E6C8;--parch-2:#E4D3A9;--parch-3:#D6C291;
 --brown:#6B4B1E;--brown-2:#4B3820;--dark:rgba(14,12,9,.88);--red:#A8261B;--green:#2A6A2A;--play:#D8322A;
 font-family:"GM Garamond",Georgia,serif;color:var(--ink);}
.gmo *{box-sizing:border-box}
.gmo .L{position:absolute;left:0;top:0;width:${W}px;height:${H}px}
.gmo .abs{position:absolute}
.gmo .sc{font-family:"GM Garamond",serif;font-weight:600;text-transform:uppercase;letter-spacing:.2em}
.gmo .cz{font-family:"GM Cinzel",serif;font-weight:700}
.gmo .it{font-style:italic;font-weight:500}
/* parchment + dark plates */
.gmo .parch{background:linear-gradient(162deg,var(--parch-1) 0%,var(--parch-2) 58%,var(--parch-3) 100%);border:1.5px solid #8A6D38;
 box-shadow:0 10px 26px rgba(0,0,0,.42),0 2px 4px rgba(0,0,0,.35),inset 0 0 0 4px rgba(244,236,214,.55),inset 0 0 0 5px rgba(138,109,56,.45),inset 0 0 26px rgba(120,85,30,.32);color:#2A2016;position:relative;overflow:hidden}
.gmo .parch::after{content:"";position:absolute;inset:0;background:var(--paperurl) 0 0/512px 512px;mix-blend-mode:multiply;opacity:.55;pointer-events:none}
.gmo .darkp{background:var(--dark);color:var(--cream);box-shadow:0 10px 24px rgba(0,0,0,.5),inset 0 0 0 1px rgba(201,162,74,.35)}
/* ---- watch box (top-left) */
.gmo .watch{left:46px;top:40px;width:452px;height:132px;display:flex;align-items:center;gap:18px;padding:0 24px 0 16px}
.gmo .watch svg.pw{flex:0 0 auto;width:110px;height:118px;overflow:visible;filter:drop-shadow(0 3px 3px rgba(0,0,0,.4))}
.gmo .watch .txt{position:relative;flex:1;height:104px}
.gmo .watch .mode{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;white-space:nowrap}
.gmo .watch .l1{font-size:17px;color:var(--brown);letter-spacing:.22em}
.gmo .watch .l2{font-family:"GM Cinzel",serif;font-weight:700;font-size:34px;letter-spacing:.05em;line-height:1.08;color:#21180F}
.gmo .watch .l2c{font-family:"GM Cinzel",serif;font-weight:700;font-size:36px;letter-spacing:.03em;line-height:1.02;color:#21180F}
.gmo .watch .l3{font-size:21px;color:var(--brown-2);display:flex;align-items:center;gap:7px;margin-top:2px}
.gmo .watch .l3 svg{width:22px;height:16px;flex:0 0 auto}
/* ---- bottom timeline + counter */
.gmo .tline{left:300px;width:1320px;bottom:30px;height:78px;display:flex;align-items:center;gap:26px;padding:8px 28px 8px 26px;
 background:linear-gradient(180deg,rgba(18,15,11,.86),rgba(10,8,6,.9));border-top:2px solid var(--gold);color:var(--cream);box-shadow:0 8px 22px rgba(0,0,0,.45)}
.gmo .tline .dt{font-family:"GM Cinzel",serif;font-weight:700;font-size:21px;letter-spacing:.14em;color:var(--gold);white-space:nowrap}
.gmo .tline .trk{position:relative;flex:1;height:46px}
.gmo .tline .base{position:absolute;left:0;right:0;top:13px;height:3px;background:rgba(244,238,221,.35)}
.gmo .tline .fill{position:absolute;left:0;top:13px;height:3px;background:linear-gradient(90deg,rgba(216,50,42,.35),var(--play));transform-origin:0 50%}
.gmo .tline .tk{position:absolute;top:6px;width:2px;height:17px;margin-left:-1px;background:rgba(244,238,221,.55)}
.gmo .tline .tk.mn{top:10px;height:9px;width:1px;background:rgba(244,238,221,.4)}
.gmo .tline .tl{position:absolute;top:26px;transform:translateX(-50%);font-family:"GM Garamond",serif;font-weight:600;font-size:15px;letter-spacing:.12em;color:#D9CFB4;white-space:nowrap}
.gmo .tline .ph{position:absolute;left:0;top:0;width:0;height:0}
.gmo .tline .ph i{position:absolute;left:-2px;top:0;width:4px;height:30px;background:var(--play);box-shadow:0 0 8px var(--play),0 0 2px #fff}
.gmo .tline .ph b{position:absolute;left:-7px;top:-7px;width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid var(--play)}
.gmo .tline .rw{position:absolute;left:12px;top:-30px;font-family:"GM Cinzel",serif;font-weight:700;font-size:15px;letter-spacing:.14em;color:var(--play);white-space:nowrap;opacity:0}
.gmo .tline .cnt{text-align:right;white-space:nowrap;min-width:190px}
.gmo .tline .cnt .k{font-size:14px;letter-spacing:.22em;color:#D9CFB4}
.gmo .tline .cnt .v{font-family:"GM Cinzel",serif;font-weight:700;font-size:33px;line-height:1;color:var(--cream);font-variant-numeric:tabular-nums}
.gmo .tline .cnt .s{font-size:15px;color:#BFB293}
/* ---- medallions */
.gmo svg.lead{position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:visible}
.gmo .med{position:absolute;left:0;top:0;width:0;height:0}
.gmo .med .in{position:absolute;display:flex;flex-direction:column;align-items:center}
.gmo .med .ring{border-radius:50%;padding:6px;background:radial-gradient(circle at 34% 28%,#FFF0B8 0%,#E4C26A 22%,#C9A24A 48%,#8C6A22 78%,#5E4512 100%);
 box-shadow:0 12px 24px rgba(0,0,0,.55),0 0 0 1.5px #3B2A0C,inset 0 0 0 1px rgba(255,240,190,.6)}
.gmo .med .ring2{border-radius:50%;padding:3px;background:#2A1E0A;box-shadow:inset 0 0 0 1px rgba(255,230,160,.35)}
.gmo .med .face{border-radius:50%;overflow:hidden;background:radial-gradient(circle,#6F6450,#2B261C)}
.gmo .med .face img{display:block;width:100%;height:100%;object-fit:cover;filter:sepia(.18) saturate(.85) contrast(1.04)}
.gmo .med .plate{margin-top:-14px;position:relative;background:linear-gradient(180deg,#17140F,#0C0A07);border:1.5px solid var(--gold);padding:6px 18px 7px;text-align:center;
 box-shadow:0 6px 12px rgba(0,0,0,.5),inset 0 0 0 3px #0C0A07,inset 0 0 0 4px rgba(201,162,74,.45);white-space:nowrap}
.gmo .med .role{font-size:13px;letter-spacing:.24em;color:var(--gold)}
.gmo .med .nm{font-family:"GM Garamond",serif;font-weight:600;font-size:25px;line-height:1.1;color:var(--cream)}
.gmo .med .side{position:absolute;top:50%;width:5px;height:60%;transform:translateY(-50%)}
/* ---- quote card */
.gmo .quote{left:50%;max-width:1180px;min-width:760px;padding:22px 56px 18px;text-align:center}
.gmo .quote .o{font-style:italic;font-weight:500;font-size:35px;line-height:1.2;color:#2A2016}
.gmo .quote .orn{display:flex;align-items:center;justify-content:center;gap:12px;margin:9px 0 7px}
.gmo .quote .orn i{display:block;width:110px;height:1px;background:linear-gradient(90deg,transparent,#8A6D38)}
.gmo .quote .orn i+b+i{background:linear-gradient(90deg,#8A6D38,transparent)}
.gmo .quote .orn b{display:block;width:7px;height:7px;background:#8A6D38;transform:rotate(45deg)}
.gmo .quote .e{font-weight:500;font-size:28px;line-height:1.25;color:#3A2C1A}
.gmo .quote .a{font-size:15px;letter-spacing:.24em;color:var(--brown);margin-top:10px}
/* ---- event tags */
.gmo .tag{padding:12px 26px 13px 24px;max-width:860px}
.gmo .tag.dark{background:var(--dark);border-left:5px solid var(--gold);color:var(--cream);box-shadow:0 10px 24px rgba(0,0,0,.5)}
.gmo .tag .h{font-family:"GM Cinzel",serif;font-weight:700;letter-spacing:.17em;font-size:23px;line-height:1.15}
.gmo .tag .s{font-style:italic;font-weight:500;font-size:24px;margin-top:3px}
.gmo .tag.dark .s{color:#E2D6B8}
.gmo .tag.cream{border-left:5px solid #8A6D38}
.gmo .tag.cream .s{color:var(--brown-2)}
.gmo .tag.red{border-left-color:#C8442C}
.gmo .tag .ptr{position:absolute;left:30px;bottom:-12px;width:0;height:0;border-left:11px solid transparent;border-right:11px solid transparent;border-top:12px solid rgba(14,12,9,.88)}
.gmo .tag.cream .ptr{border-top-color:#DCC99A}
.gmo .flash{left:0;width:${W}px;top:58px;display:flex;flex-direction:column;align-items:center;text-align:center}
.gmo .flash .h{font-family:"GM Cinzel",serif;font-weight:700;font-size:40px;letter-spacing:.3em;color:var(--cream);text-shadow:0 3px 10px #000,0 0 22px rgba(0,0,0,.6)}
.gmo .flash .r{width:420px;height:1.5px;margin:8px 0 6px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.gmo .flash .s{font-style:italic;font-weight:500;font-size:27px;color:#E9DFC4;text-shadow:0 2px 6px #000}
/* ---- ledger + stamp (top-right) */
.gmo .ledger{right:46px;top:40px;width:440px;padding:18px 24px 16px}
.gmo .ledger .t{font-size:18px;letter-spacing:.18em;color:#2A2016;font-weight:700}
.gmo .ledger .st0{font-style:italic;font-weight:500;font-size:20px;color:#5B4526;margin:2px 0 8px}
.gmo .ledger .row{overflow:hidden;border-top:1px solid rgba(90,64,30,.35)}
.gmo .ledger .ri{display:flex;align-items:center;gap:12px;padding:7px 0 6px;min-height:44px}
.gmo .ledger .n{font-family:"GM Cinzel",serif;font-weight:700;width:20px;color:#6B4B1E;font-size:19px}
.gmo .ledger .who{font-weight:600;font-size:19px;letter-spacing:.1em;text-transform:uppercase;line-height:1.1}
.gmo .ledger .rn{display:block;font-style:italic;font-weight:500;font-size:16px;letter-spacing:0;text-transform:none;color:#5B4526}
.gmo .ledger .stp{margin-left:auto;position:relative}
.gmo .stamp{display:inline-block;font-family:"GM Cinzel",serif;font-weight:700;letter-spacing:.16em;padding:3px 10px 2px;border:2.5px solid currentColor;border-radius:3px;
 box-shadow:inset 0 0 0 1.5px rgba(241,230,200,.9),inset 0 0 0 3px currentColor;-webkit-mask:var(--inkmask) 0 0/220px 220px;mask:var(--inkmask) 0 0/220px 220px;mix-blend-mode:multiply}
.gmo .ledger .stp .stamp{font-size:15px;transform:rotate(-6deg)}
.gmo .ledger .fin{text-align:center;padding:12px 0 2px;border-top:1px solid rgba(90,64,30,.35)}
.gmo .ledger .fin .stamp{font-size:28px;line-height:1.08;padding:6px 18px 4px;transform:rotate(-5deg);text-align:center}
/* ---- title / distance / number cards */
.gmo .title{left:0;width:${W}px;top:0;height:${H}px;display:flex;align-items:center;justify-content:center}
.gmo .title .scrim{position:absolute;left:260px;right:260px;top:300px;bottom:330px;background:radial-gradient(ellipse at 50% 50%,rgba(10,8,5,.74) 0%,rgba(10,8,5,.5) 52%,rgba(10,8,5,0) 72%)}
.gmo .title .box{position:relative;text-align:center}
.gmo .title .l{font-family:"GM Caslon",serif;font-weight:700;font-size:74px;letter-spacing:.05em;line-height:1.12;color:var(--cream);text-shadow:0 4px 14px rgba(0,0,0,.9),0 0 30px rgba(0,0,0,.5);text-transform:uppercase}
.gmo .title .r{width:560px;height:2px;margin:20px auto 16px;background:linear-gradient(90deg,transparent,var(--gold),transparent);transform-origin:50% 50%}
.gmo .title .s{font-size:27px;letter-spacing:.42em;color:var(--gold);text-shadow:0 2px 6px #000}
.gmo .dist{padding:14px 34px 15px;text-align:center;background:rgba(10,9,7,.9);border-top:3px solid var(--gold);color:var(--cream);box-shadow:0 12px 28px rgba(0,0,0,.55)}
.gmo .dist .v{font-family:"GM Cinzel",serif;font-weight:700;font-size:46px;letter-spacing:.1em;line-height:1.05;font-variant-numeric:tabular-nums}
.gmo .dist .s{font-style:italic;font-weight:500;font-size:24px;color:#E2D6B8;margin-top:2px}
.gmo svg.ruler{position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:visible}
.gmo .num{text-align:center;padding:20px 60px 22px}
.gmo .num .k{font-size:19px;letter-spacing:.26em;color:var(--brown)}
.gmo .num .v{font-family:"GM Caslon",serif;font-weight:700;font-size:120px;line-height:1.02;color:#21180F;font-variant-numeric:lining-nums tabular-nums}
.gmo .num .s{font-style:italic;font-weight:500;font-size:27px;color:var(--brown-2)}
.gmo .pair{display:flex;gap:26px}
.gmo .pair .c{min-width:330px;text-align:center;padding:14px 30px 16px}
.gmo .pair .c .k{font-size:17px;letter-spacing:.24em}
.gmo .pair .c .v{font-family:"GM Caslon",serif;font-weight:700;font-size:66px;line-height:1.08;font-variant-numeric:lining-nums}
.gmo .pair .c .s{font-style:italic;font-weight:500;font-size:21px}
/* ---- film look */
.gmo .grade{position:absolute;inset:0}
.gmo .paper{position:absolute;inset:0;background:var(--paperurl) 0 0/512px 512px;mix-blend-mode:multiply;opacity:.16}
.gmo .grain{position:absolute;left:-64px;top:-64px;width:${W + 128}px;height:${H + 128}px;mix-blend-mode:overlay;opacity:.2;background-size:512px 512px}
.gmo .vig{position:absolute;inset:0;background:radial-gradient(ellipse 72% 70% at 50% 48%,rgba(0,0,0,0) 52%,rgba(12,9,5,.38) 78%,rgba(8,6,3,.72) 100%)}
`;

  // ---------------------------------------------------------------- helpers
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const fmtN = (v) => Math.round(v).toLocaleString("en-US");
  // seeded PRNG (mulberry32): textures are generated once at init, identical every render
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const canvasURL = (w, h, paint) => { const c = document.createElement("canvas"); c.width = w; c.height = h; paint(c.getContext("2d"), w, h); return c.toDataURL("image/png"); };
  // value noise, tileable
  const vnoise = (R, n) => { const g = []; for (let i = 0; i < n * n; i++) g.push(R()); return (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const a = g[((yi % n + n) % n) * n + ((xi % n + n) % n)], b = g[((yi % n + n) % n) * n + (((xi + 1) % n + n) % n)], c = g[(((yi + 1) % n + n) % n) * n + ((xi % n + n) % n)], d = g[(((yi + 1) % n + n) % n) * n + (((xi + 1) % n + n) % n)];
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return lerp(lerp(a, b, u), lerp(c, d, u), v); }; };
  const paperTex = (seed) => canvasURL(512, 512, (x, w, h) => { const R = rng(seed), img = x.createImageData(w, h), n1 = vnoise(R, 8), n2 = vnoise(R, 32), n3 = vnoise(R, 128);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const u = i / w, v = j / h; let k = 0.55 * n1(u * 8, v * 8) + 0.3 * n2(u * 32, v * 32) + 0.15 * n3(u * 128, v * 128); k = 0.78 + 0.22 * k;
      const o = (j * w + i) * 4; img.data[o] = 255 * k; img.data[o + 1] = 246 * k; img.data[o + 2] = 226 * k; img.data[o + 3] = 255; }
    x.putImageData(img, 0, 0); x.globalAlpha = 0.09; x.strokeStyle = "#5a4320"; x.lineWidth = 0.7;   // fibres
    for (let f = 0; f < 420; f++) { const px = R() * w, py = R() * h, a = R() * Math.PI, l = 6 + R() * 22; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a) * l * 0.5 + (R() - 0.5) * 4, py + Math.sin(a) * l * 0.5 + (R() - 0.5) * 4, px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); } });
  const grainTex = (seed) => canvasURL(512, 512, (x, w, h) => { const R = rng(seed), img = x.createImageData(w, h);
    for (let o = 0; o < w * h * 4; o += 4) { const g = R(), k = 128 + (g + R() + R() - 1.5) * 120; img.data[o] = img.data[o + 1] = img.data[o + 2] = clamp(k, 0, 255); img.data[o + 3] = 255; } x.putImageData(img, 0, 0); });
  const inkMask = (seed) => canvasURL(220, 220, (x, w, h) => { const R = rng(seed), n = vnoise(R, 22), img = x.createImageData(w, h);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const v = n(i / 10, j / 10), sp = R(); const a = v < 0.18 ? 0.25 : sp < 0.035 ? 0.1 : 0.82 + 0.18 * v; const o = (j * w + i) * 4; img.data[o] = img.data[o + 1] = img.data[o + 2] = 0; img.data[o + 3] = 255 * a; }
    x.putImageData(img, 0, 0); });

  // weather / condition icons for the watch note line (ink line drawings)
  const ICON = {
    sun: `<svg viewBox="-11 -8 22 16"><circle r="4" fill="none" stroke="#4B3820" stroke-width="1.6"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="0" y1="-6" x2="0" y2="-8" stroke="#4B3820" stroke-width="1.4" transform="rotate(${a})"/>`).join("")}</svg>`,
    mist: `<svg viewBox="0 0 22 16"><g stroke="#4B3820" stroke-width="1.6" fill="none" stroke-linecap="round"><path d="M2 4 Q6 2 10 4 T20 4"/><path d="M2 8.5 Q6 6.5 10 8.5 T20 8.5"/><path d="M4 13 Q8 11 12 13 T20 13"/></g></svg>`,
    smoke: `<svg viewBox="0 0 22 16"><g fill="none" stroke="#4B3820" stroke-width="1.5"><circle cx="7" cy="10" r="4"/><circle cx="13" cy="7" r="5"/><circle cx="17" cy="11" r="3.5"/></g></svg>`,
    rain: `<svg viewBox="0 0 22 16"><path d="M5 8 a4 4 0 0 1 4-4 a5 5 0 0 1 9 2 a3 3 0 0 1 0 6 H6 a3 3 0 0 1 -1-4z" fill="none" stroke="#4B3820" stroke-width="1.4"/><g stroke="#4B3820" stroke-width="1.3"><line x1="8" y1="13" x2="7" y2="16"/><line x1="12" y1="13" x2="11" y2="16"/><line x1="16" y1="13" x2="15" y2="16"/></g></svg>`,
    moon: `<svg viewBox="0 0 22 16"><path d="M13 1.5 a6.5 6.5 0 1 0 5 10.5 a5.2 5.2 0 0 1 -5 -10.5z" fill="none" stroke="#4B3820" stroke-width="1.6"/></svg>`,
    fire: `<svg viewBox="0 0 22 16"><path d="M11 1 C14 5 17 7 16 11 C15 14.5 7 14.5 6 11 C5.5 8.5 8 7.5 8 5 C10 6.5 10 8 11 8.5 C12 6 11 3 11 1z" fill="none" stroke="#4B3820" stroke-width="1.5"/></svg>`,
    none: "",
  };

  // the pocket watch (case, bow, crown, enamel dial, roman numerals, hands)
  const watchSVG = () => {
    const R = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    let s = `<svg class="pw" viewBox="-55 -70 110 128"><defs><radialGradient id="gmoCase" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFF0B8"/><stop offset=".3" stop-color="#E0BC62"/><stop offset=".65" stop-color="#B08A35"/><stop offset="1" stop-color="#6E5216"/></radialGradient>
      <radialGradient id="gmoDial" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#FBF5E6"/><stop offset=".8" stop-color="#EEE3C6"/><stop offset="1" stop-color="#D8C89F"/></radialGradient></defs>
      <circle cy="-62" r="7.5" fill="none" stroke="url(#gmoCase)" stroke-width="3.2"/><rect x="-5" y="-57" width="10" height="7" rx="2" fill="url(#gmoCase)" stroke="#5E4512" stroke-width=".8"/>
      <circle r="51" fill="url(#gmoCase)" stroke="#4B3812" stroke-width="1.2"/><circle r="45.5" fill="none" stroke="#7A5A1C" stroke-width="1"/>
      <circle r="44" fill="url(#gmoDial)" stroke="#6E5216" stroke-width="1"/><circle r="35" fill="none" stroke="#6B5530" stroke-width=".5"/>`;
    for (let i = 0; i < 60; i++) s += `<line x1="0" y1="-42" x2="0" y2="${i % 5 ? -40 : -38}" stroke="#2A2016" stroke-width="${i % 5 ? 0.6 : 1.4}" transform="rotate(${i * 6})"/>`;
    R.forEach((r, i) => { const a = (i * 30 - 90) * Math.PI / 180; s += `<text x="${(Math.cos(a) * 30).toFixed(2)}" y="${(Math.sin(a) * 30 + 3).toFixed(2)}" text-anchor="middle" font-family="GM Garamond, serif" font-weight="600" font-size="${r.length > 2 ? 7.2 : 8.5}" fill="#2A2016">${r}</text>`; });
    s += `<g class="hh"><path d="M-2.2 5 L-1.6 -14 L0 -21 L1.6 -14 L2.2 5 Z" fill="#1A1712"/><circle cy="-15" r="2.6" fill="none" stroke="#1A1712" stroke-width="1.2"/></g>
      <g class="mh"><path d="M-1.4 7 L-1 -26 L0 -36 L1 -26 L1.4 7 Z" fill="#1A1712"/></g><circle r="3.2" fill="#1A1712"/><circle r="1.2" fill="#C9A24A"/>
      <ellipse cx="-14" cy="-20" rx="20" ry="11" fill="#fff" opacity=".18" transform="rotate(-30 -14 -20)"/></svg>`;
    return s;
  };

  const ampm = (m) => { m = ((m % 1440) + 1440) % 1440; const h = Math.floor(m / 60), mm = Math.round(m % 60);
    const time = `${((h + 11) % 12) + 1}:${String(mm).padStart(2, "0")}`;
    const part = h === 12 && mm === 0 ? "MIDDAY" : h === 0 && mm === 0 ? "MIDNIGHT" : h < 5 ? "IN THE NIGHT" : h < 12 ? "IN THE MORNING" : h < 18 ? "IN THE AFTERNOON" : h < 22 ? "IN THE EVENING" : "AT NIGHT";
    return { time, part }; };
  const toMin = (v) => typeof v === "number" ? v : (() => { const m = String(v).match(/(\d+):(\d+)/); return m ? +m[1] * 60 + +m[2] : 0; })();

  // ================================================================ create
  function create(host, opts = {}) {
    const gsap = window.gsap; if (!gsap) throw new Error("GMOverlay needs gsap");
    const tl = opts.tl || gsap.timeline({ paused: true });
    const project = opts.project || ((p) => ({ x: p[0], y: p[1], visible: true }));
    const fontBase = opts.fontBase || "assets/fonts/";
    const seed = opts.seed || 1812;
    const ease = (n) => gsap.parseEase(n);
    const E = { out: ease("power2.out"), inout: ease("power2.inOut"), back: ease("back.out(1.6)"), in: ease("power1.in"), p3: ease("power3.out") };

    if (!document.getElementById("gmo-css")) { const st = document.createElement("style"); st.id = "gmo-css"; st.textContent = fontCSS(fontBase) + CSS; document.head.appendChild(st); }
    const root = document.createElement("div"); root.className = "gmo";
    root.style.setProperty("--paperurl", `url(${paperTex(seed)})`); root.style.setProperty("--inkmask", `url(${inkMask(seed + 7)})`);
    host.appendChild(root);
    const layer = (cls = "") => { const d = document.createElement("div"); d.className = "L " + cls; root.appendChild(d); return d; };
    // z-order: grade < paper < leader lines < medallions < cards < grain < vignette
    const Lgrade = layer(), Lpaper = layer(), Lmap = layer(), Lmed = layer(), Lcards = layer(), Lhud = layer(), Lgrain = layer(), Lvig = layer();
    const NS = "http://www.w3.org/2000/svg";
    const leadSVG = document.createElementNS(NS, "svg"); leadSVG.setAttribute("class", "lead"); leadSVG.setAttribute("viewBox", `0 0 ${W} ${H}`); Lmap.appendChild(leadSVG);
    const mk = (parent, cls, html, css = "") => { const e = document.createElement("div"); e.className = "abs " + cls; if (css) e.style.cssText = css; e.innerHTML = html; parent.appendChild(e); return e; };
    const fadeIn = (el, t, d = 0.6, from = {}, to = {}) => { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, ...from }, { autoAlpha: 1, duration: d, ease: "power2.out", immediateRender: false, ...to }, t); };
    const fadeOut = (el, t, d = 0.5, to = {}) => { if (t != null) tl.to(el, { autoAlpha: 0, duration: d, ease: "power1.in", ...to }, t); };
    const updaters = [];
    const O = { tl, root, update: null };

    // ------------------------------------------------------------ film look: grade, paper, grain, vignette
    const grade = mk(Lgrade, "grade", "", "inset:0");
    const gradeKeys = [{ t: -1, mode: "day", d: 0 }];
    const GR = { day: ["rgba(255,196,120,.16)", "soft-light", "rgba(0,0,0,0)"], night: ["rgba(30,52,96,.55)", "multiply", "rgba(255,160,70,.0)"], dusk: ["rgba(150,90,70,.28)", "multiply", "rgba(0,0,0,0)"], none: ["rgba(0,0,0,0)", "normal", "rgba(0,0,0,0)"] };
    const gWarm = mk(grade, "", "", "inset:0;mix-blend-mode:soft-light;background:linear-gradient(115deg,rgba(255,190,110,.42),rgba(255,190,110,.06) 70%)");
    const gNight = mk(grade, "", "", "inset:0;mix-blend-mode:multiply;background:radial-gradient(ellipse at 50% 45%,rgba(44,66,110,.55),rgba(14,24,52,.82))");
    const gDusk = mk(grade, "", "", "inset:0;mix-blend-mode:multiply;background:linear-gradient(180deg,rgba(150,96,80,.35),rgba(80,52,60,.45))");
    const paper = mk(Lpaper, "paper", "", "");
    const grainURLs = [0, 1, 2, 3, 4, 5].map((i) => grainTex(seed * 31 + i));
    const grain = mk(Lgrain, "grain", "", ""); const vig = mk(Lvig, "vig", "", "");
    O.film = {
      grade(t, mode, d = 1.0) { gradeKeys.push({ t, mode, d }); gradeKeys.sort((a, b) => a.t - b.t); return O; },
      set(o = {}) { if (o.grain != null) grain.style.opacity = o.grain; if (o.paper != null) paper.style.opacity = o.paper; if (o.vignette != null) vig.style.opacity = o.vignette; return O; },
    };
    const gradeW = (mode) => ({ day: [1, 0, 0], night: [0, 1, 0], dusk: [0.4, 0, 1], none: [0, 0, 0] }[mode] || [0, 0, 0]);
    updaters.push((t) => {
      let prev = gradeW("day"), cur = prev, k = 1;
      for (let i = 0; i < gradeKeys.length; i++) { const g = gradeKeys[i]; if (g.t > t) break; prev = (i ? (() => { const p = gradeKeys[i - 1]; return gradeW(p.mode); })() : gradeW("day")); cur = gradeW(g.mode); k = g.d ? clamp((t - g.t) / g.d) : 1; }
      const w = prev.map((p, i) => lerp(p, cur[i], E.inout(k)));
      gWarm.style.opacity = w[0].toFixed(3); gNight.style.opacity = w[1].toFixed(3); gDusk.style.opacity = w[2].toFixed(3);
      const f = Math.floor(t * 24 + 1e-6), R = rng(f * 7919 + 13);   // grain changes every 1/24 s, deterministic
      grain.style.backgroundImage = `url(${grainURLs[f % 6]})`; grain.style.transform = `translate(${Math.floor(R() * 64)}px,${Math.floor(R() * 64)}px)`;
    });

    // ------------------------------------------------------------ 1. watch box
    {
      const el = mk(Lhud, "parch watch", `${watchSVG()}<div class="txt"></div>`);
      const txt = el.querySelector(".txt"), HH = el.querySelector(".hh"), MH = el.querySelector(".mh");
      gsap.set(el, { autoAlpha: 0 });
      const modes = []; // {el, t}
      const clockKeys = []; // raw events: {type:'set'|'run', t, t1, v, step}
      const noteKeys = []; // {t, text, icon}
      let clockMode = null; const labelKeys = []; // {t, text|null}
      const addMode = (t, html) => { const m = mk(txt, "mode", html); m.style.position = "absolute"; gsap.set(m, { autoAlpha: 0 });
        const last = modes[modes.length - 1]; if (last) { tl.to(last.el, { autoAlpha: 0, duration: 0.35 }, t); tl.fromTo(m, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, immediateRender: false }, t + 0.3); }
        else tl.fromTo(m, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, t);
        modes.push({ el: m, t }); return m; };
      const W_ = {
        show(t, d = 0.7) { fadeIn(el, t, d, { y: -10 }, { y: 0 }); return O; },
        hide(t, d = 0.5) { fadeOut(el, t, d); return O; },
        date(t, o) { addMode(t, `<div class="sc l1">${esc(o.month)}</div><div class="l2">${esc(o.day)}</div><div class="it l3">${ICON[o.icon] || ""}<span>${esc(o.place || "")}</span></div>`); tl.to([HH, MH], { opacity: 0.22, duration: 0.4 }, t); return O; },
        clock(t, o = {}) {
          if (!clockMode) clockMode = true;
          const m = addMode(t, `<div class="l2c"></div><div class="sc l1" style="margin-top:2px"></div><div class="it l3"><span class="ic"></span><span class="nt"></span></div>`);
          m.dataset.clock = "1"; tl.to([HH, MH], { opacity: 1, duration: 0.4 }, t);
          if (o.time != null) clockKeys.push({ type: "set", t, v: toMin(o.time), d: o.d || 0.8 });
          if (o.note != null) noteKeys.push({ t, text: o.note, icon: o.icon || "none" });
          return O; },
        set(t, time, d = 0.8) { clockKeys.push({ type: "set", t, v: toMin(time), d }); return O; },
        run(t0, t1, toTime, o = {}) { clockKeys.push({ type: "run", t: t0, t1, v: toMin(toTime), step: o.step || 15 }); return O; },
        note(t, text, icon = "none") { noteKeys.push({ t, text, icon }); return O; },
        label(t, text) { labelKeys.push({ t, text }); return O; },   // override the big line ("AND NIGHT"); null restores
      };
      O.watch = W_;
      // build the step list lazily (all API calls are done by then)
      let steps = null;
      const build = () => { steps = []; let cur = null; const ev = clockKeys.slice().sort((a, b) => a.t - b.t);
        for (const e of ev) {
          if (e.type === "set" || cur == null) { steps.push({ t: e.t, v: e.v, prev: cur == null ? e.v : cur, d: e.d || 0.8 }); cur = e.v; if (e.type === "set") continue; }
          const v0 = cur, v1 = e.v, q = e.step, dir = Math.sign(v1 - v0); if (!dir) continue;
          const vals = []; for (let v = dir > 0 ? Math.floor(v0 / q) * q + q : Math.ceil(v0 / q) * q - q; dir > 0 ? v < v1 : v > v1; v += dir * q) vals.push(v); vals.push(v1);
          const iv = (e.t1 - e.t) / vals.length;
          vals.forEach((v, i) => { steps.push({ t: e.t + (i + 1) * iv - Math.min(0.35, iv * 0.8), v, prev: i ? vals[i - 1] : v0, d: Math.min(0.35, iv * 0.8) }); });
          cur = v1; }
        steps.sort((a, b) => a.t - b.t); noteKeys.sort((a, b) => a.t - b.t); labelKeys.sort((a, b) => a.t - b.t); };
      updaters.push((t) => {
        if (!steps) build();
        let s = null; for (const x of steps) { if (x.t <= t) s = x; else break; }
        let disp, ang;
        if (!s) { disp = steps.length ? steps[0].v : 360; ang = disp; }
        else { const k = clamp((t - s.t) / s.d); disp = s.v; ang = lerp(s.prev, s.v, s.d > 0.5 ? E.inout(k) : E.back(k)); }
        HH.setAttribute("transform", `rotate(${((ang / 60) % 12) * 30})`); MH.setAttribute("transform", `rotate(${ang * 6})`);
        const f = ampm(disp); let lab = null; for (const l of labelKeys) { if (l.t <= t) lab = l.text; else break; }
        let note = null; for (const n of noteKeys) { if (n.t <= t) note = n; else break; }
        for (const m of modes) if (m.el.dataset.clock) {
          const a = m.el.querySelector(".l2c"), b = m.el.querySelector(".l1"), nt = m.el.querySelector(".nt"), ic = m.el.querySelector(".ic");
          const A = lab || f.time, B = lab ? "" : f.part; if (a.textContent !== A) a.textContent = A; if (b.textContent !== B) b.textContent = B;
          if (note && nt.textContent !== note.text) { nt.textContent = note.text; ic.innerHTML = ICON[note.icon] || ""; } }
      });
    }

    // ------------------------------------------------------------ 2. bottom timeline + casualty counter
    {
      const H0 = opts.hourFrom || 6, H1 = opts.hourTo || 22;   // 6 AM .. 10 PM ("NIGHT")
      const hx = (h) => clamp((h - H0) / (H1 - H0)) * 100;
      let ticks = "";
      for (let h = H0; h <= H1; h++) { const lbl = h === H1 ? "NIGHT" : h === 12 ? "NOON" : (h - H0) % 2 === 0 ? String(((h + 11) % 12) + 1) : null;
        ticks += `<div class="tk${lbl ? "" : " mn"}" style="left:${hx(h)}%"></div>` + (lbl ? `<div class="tl" style="left:${hx(h)}%">${lbl}</div>` : ""); }
      const el = mk(Lhud, "tline", `<div class="dt"></div><div class="trk"><div class="base"></div><div class="fill"></div>${ticks}<div class="ph"><b></b><i></i></div><div class="rw">◂◂ EARLIER THAT DAY</div></div>
        <div class="cnt"><div class="sc k">CASUALTIES</div><div class="v">0</div><div class="it s">est., both armies</div></div>`);
      gsap.set(el, { autoAlpha: 0 });
      const PH = el.querySelector(".ph"), FILL = el.querySelector(".fill"), V = el.querySelector(".v"), RW = el.querySelector(".rw"), TRK = el.querySelector(".trk");
      const keys = []; let trkW = null;
      O.timeline = {
        show(t, o = {}) { el.querySelector(".dt").textContent = o.date || ""; if (o.counterLabel) el.querySelector(".k").textContent = o.counterLabel; if (o.counterNote != null) el.querySelector(".s").textContent = o.counterNote;
          keys.push({ t: t - 0.001, hour: o.hour != null ? o.hour : H0, cas: o.cas || 0, d: 0 }); fadeIn(el, t, 0.7, { y: 24 }, { y: 0 }); return O; },
        go(t, o) { keys.push({ t, hour: o.hour, cas: o.cas, d: o.d != null ? o.d : 1.4, plus: o.plus }); return O; },
        rewind(t, o) { keys.push({ t, hour: o.hour, cas: o.cas, d: o.d || 1.1, rewind: true }); return O; },
        hide(t) { fadeOut(el, t, 0.5, { y: 16 }); return O; },
      };
      updaters.push((t) => {
        if (trkW == null) trkW = TRK.offsetWidth || 1040;
        keys.sort((a, b) => a.t - b.t);
        let ph = H0, cas = 0, plus = false, rw = 0; let prev = { hour: H0, cas: 0 };
        for (const k of keys) { if (k.t > t) break; const p = k.d ? clamp((t - k.t) / k.d) : 1, e = E.inout(p);
          ph = lerp(prev.hour, k.hour, e); cas = lerp(prev.cas, k.cas, k.rewind ? e : E.out(p)); plus = !!k.plus && p >= 1;
          rw = k.rewind ? (p < 1 ? 1 : clamp(1 - (t - k.t - k.d) / 1.2)) : 0; prev = { hour: k.hour, cas: k.cas }; }
        const x = hx(ph) / 100 * trkW; PH.style.transform = `translateX(${x.toFixed(1)}px)`; FILL.style.width = `${x.toFixed(1)}px`;
        const shown = cas >= 1000 ? Math.round(cas / 100) * 100 : Math.round(cas); const s = fmtN(shown) + (plus ? "+" : "");
        if (V.textContent !== s) V.textContent = s; RW.style.opacity = rw.toFixed(3);
      });
    }

    // ------------------------------------------------------------ 3. commander medallions + leader lines
    {
      const meds = [];
      O.medallion = (o) => {
        const size = o.size || 150, el = document.createElement("div"); el.className = "med";
        const sideCol = o.side === "fr" ? "#2C57B7" : o.side === "ru" ? "#2F6B3A" : o.side ? o.side : null;
        el.innerHTML = `<div class="in"><div class="ring"><div class="ring2"><div class="face" style="width:${size}px;height:${size}px"><img src="${esc(o.img)}" alt=""></div></div></div>
          <div class="plate">${sideCol ? `<div class="side" style="left:-1.5px;background:${sideCol}"></div>` : ""}<div class="sc role">${esc(o.role || "")}</div><div class="nm">${esc(o.name || "")}</div></div></div>`;
        Lmed.appendChild(el); const inner = el.querySelector(".in"); gsap.set(inner, { autoAlpha: 0, xPercent: -50, yPercent: -50 });
        const line = document.createElementNS(NS, "g"); line.innerHTML = `<line class="sh" stroke="rgba(0,0,0,.55)" stroke-width="4" stroke-linecap="round"/><line class="ln" stroke="#F1E3B8" stroke-width="2" stroke-linecap="round"/>
          <circle class="dot" r="6.5" fill="#C9A24A" stroke="#1A1712" stroke-width="2"/><circle class="dot2" r="12" fill="none" stroke="#F1E3B8" stroke-width="1.5"/>`;
        leadSVG.appendChild(line);
        const m = { o, el, inner, line, size, tIn: o.tIn, tOut: o.tOut, off: o.offset || [150, -230] };
        // GSAP entrance of the portrait (line draws first, then the medallion pops); exit fades both
        tl.fromTo(inner, { autoAlpha: 0, scale: 0.82, y: 24 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.5)", immediateRender: false }, o.tIn + 0.35);
        if (o.tOut != null) tl.to(inner, { autoAlpha: 0, scale: 0.94, duration: 0.5, ease: "power1.in" }, o.tOut);
        meds.push(m); return O;
      };
      updaters.push((t) => {
        for (const m of meds) {
          const pr = project(m.o.world, t), on = t >= m.tIn && (m.tOut == null || t < m.tOut + 0.55) && pr && pr.visible !== false;
          if (!on) { m.el.style.display = "none"; m.line.setAttribute("display", "none"); continue; }
          m.el.style.display = ""; m.line.removeAttribute("display");
          const ax = pr.x, ay = pr.y;
          // medallion centre: fixed screen point, or anchor + offset, clamped into the action-safe box
          let cx = m.o.screen ? m.o.screen[0] : ax + m.off[0], cy = m.o.screen ? m.o.screen[1] : ay + m.off[1];
          const r = m.size / 2 + 9; cx = clamp(cx, 96 + r, W - 96 - r); cy = clamp(cy, 54 + r, H - 160 - r);
          m.el.style.transform = `translate(${cx.toFixed(1)}px,${(cy + 22).toFixed(1)}px)`;   // .in is centred; +22 = plate below the ring
          // the leader line runs from the anchor to the rim of the ring
          const dx = ax - cx, dy = ay - cy, L = Math.hypot(dx, dy) || 1, ex = cx + dx / L * r, ey = cy + dy / L * r;
          const kIn = E.inout(clamp((t - m.tIn) / 0.5)), kOut = m.tOut != null ? 1 - clamp((t - m.tOut) / 0.5) : 1;
          const lx = lerp(ax, ex, kIn), ly = lerp(ay, ey, kIn);
          for (const l of m.line.querySelectorAll("line")) { l.setAttribute("x1", ax.toFixed(1)); l.setAttribute("y1", ay.toFixed(1)); l.setAttribute("x2", lx.toFixed(1)); l.setAttribute("y2", ly.toFixed(1)); }
          for (const c of m.line.querySelectorAll("circle")) { c.setAttribute("cx", ax.toFixed(1)); c.setAttribute("cy", ay.toFixed(1)); }
          const pulse = 1 + 0.25 * Math.sin((t - m.tIn) * 3.2);
          m.line.querySelector(".dot2").setAttribute("r", (12 * pulse).toFixed(2));
          m.line.setAttribute("opacity", (Math.min(clamp((t - m.tIn) / 0.25), kOut)).toFixed(3));
        }
      });
    }

    // ------------------------------------------------------------ 4. quote card (original language + translation + attribution)
    O.quote = (tIn, tOut, o) => {
      const q = (s, lang) => { const L = lang || "fr"; return L === "de" ? `„${s}“` : L === "ru" ? `«${s}»` : L === "en" ? `“${s}”` : `« ${s} »`; };
      const bottom = o.bottom != null ? o.bottom : 136;   // sits above the bottom timeline
      const el = mk(Lcards, "parch quote", `${o.orig ? `<div class="o" lang="${esc(o.lang || "fr")}">${esc(q(o.orig, o.lang))}</div><div class="orn"><i></i><b></b><i></i></div>` : ""}
        <div class="e">${esc(q(o.en, "en"))}</div><div class="sc a">${esc(o.attr || "")}</div>`, `bottom:${bottom}px;`);
      gsap.set(el, { xPercent: -50, autoAlpha: 0 });
      tl.fromTo(el, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out", immediateRender: false }, tIn);
      const parts = el.querySelectorAll(".o,.orn,.e,.a"); gsap.set(parts, { autoAlpha: 0 });
      parts.forEach((p, i) => tl.fromTo(p, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, tIn + 0.25 + i * (o.orig ? 0.32 : 0.25) + (p.classList.contains("e") && o.orig ? 0.5 : 0)));
      fadeOut(el, tOut, 0.55, { y: 10 }); return O; };

    // ------------------------------------------------------------ 5. event tags (dark / cream / red) + "EARLIER THAT DAY" banner
    const tags = [];
    O.tag = (tIn, tOut, o) => {
      const tone = o.tone || "dark";
      const el = mk(Lcards, `tag ${tone === "cream" ? "parch cream" : "dark"}${tone === "red" ? " red" : ""}`, `<div class="h">${esc(o.head)}</div>${o.sub ? `<div class="s">${esc(o.sub)}</div>` : ""}${o.world ? `<div class="ptr"></div>` : ""}`,
        o.world ? "" : `left:${o.x != null ? o.x : 560}px;top:${o.y != null ? o.y : 44}px;`);
      gsap.set(el, { autoAlpha: 0 });
      tl.fromTo(el, { autoAlpha: 0, x: -22, clipPath: "inset(0 100% 0 0)" }, { autoAlpha: 1, x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power3.out", immediateRender: false }, tIn);
      fadeOut(el, tOut, 0.45);
      if (o.world) tags.push({ el, o });
      return O; };
    updaters.push((t) => { for (const g of tags) { const p = project(g.o.world, t); if (!p) continue; const w = g.el.offsetWidth, h = g.el.offsetHeight;
      g.el.style.left = `${clamp(p.x - 41, 96, W - 96 - w).toFixed(1)}px`; g.el.style.top = `${clamp(p.y - h - 22, 54, H - 160 - h).toFixed(1)}px`; } });
    O.flashback = (tIn, tOut, o) => {
      const el = mk(Lcards, "flash", `<div class="h">${esc(o.head || "EARLIER THAT DAY")}</div><div class="r"></div>${o.sub ? `<div class="it s">${esc(o.sub)}</div>` : ""}`);
      fadeIn(el, tIn, 0.6, { y: -12 }, { y: 0 }); tl.fromTo(el.querySelector(".r"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out", immediateRender: false }, tIn + 0.2);
      fadeOut(el, tOut, 0.5); return O; };

    // ------------------------------------------------------------ 6. ledger + REFUSED stamps + final stamp
    {
      const el = mk(Lhud, "parch ledger", `<div class="sc t"></div><div class="st0"></div><div class="rows"></div>`); gsap.set(el, { autoAlpha: 0 });
      const rows = el.querySelector(".rows"); let n = 0; const R = [];
      const slam = (st, t, rot) => { gsap.set(st, { autoAlpha: 0 }); tl.fromTo(st, { autoAlpha: 0, scale: 2.3, rotation: rot - 8 }, { autoAlpha: 0.92, scale: 1, rotation: rot, duration: 0.24, ease: "power4.in", immediateRender: false }, t);
        tl.fromTo(el, { x: 0, y: 0 }, { keyframes: [{ x: 2, y: 2, duration: 0.04 }, { x: -2, y: -1, duration: 0.05 }, { x: 0, y: 0, duration: 0.08 }], immediateRender: false }, t + 0.24); };
      O.ledger = {
        show(t, o = {}) { if (o.title != null) el.querySelector(".t").textContent = o.title; if (o.sub != null) el.querySelector(".st0").textContent = o.sub; fadeIn(el, t, 0.6, { y: -14 }, { y: 0 }); return O; },
        hide(t) { fadeOut(el, t, 0.5); return O; },
        add(t, o) { n++; const r = document.createElement("div"); r.className = "row";
          r.innerHTML = `<div class="ri"><span class="n">${n}</span><span class="who">${esc(o.who)}${o.note ? `<span class="rn">${esc(o.note)}</span>` : ""}</span><span class="stp"><span class="stamp" style="color:${o.color || "var(--red)"}">${esc(o.stamp || "REFUSED")}</span></span></div>`;
          rows.appendChild(r); const h = o.note ? 62 : 46; gsap.set(r, { height: 0, autoAlpha: 0 });
          tl.fromTo(r, { height: 0, autoAlpha: 0 }, { height: h, autoAlpha: 1, duration: 0.45, ease: "power2.out", immediateRender: false }, t);
          const st = r.querySelector(".stamp"); const ts = o.stampAt != null ? o.stampAt : t + 0.9; if (o.stamp !== false) slam(st, ts, -6); else gsap.set(st, { autoAlpha: 0 });
          R.push(r); return O; },
        note(t, i, text) { const w = R[i - 1].querySelector(".who"); const s = document.createElement("span"); s.className = "rn"; s.textContent = text; w.appendChild(s); gsap.set(s, { autoAlpha: 0 });
          tl.to(R[i - 1], { height: 62, duration: 0.35 }, t); tl.fromTo(s, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, t + 0.1); return O; },
        final(t, o = {}) { const f = document.createElement("div"); f.className = "fin"; f.innerHTML = `<span class="stamp" style="color:${o.color || "var(--green)"}">${(o.lines || ["THE GUARD", "SAVED"]).map(esc).join("<br>")}</span>`;
          el.appendChild(f); gsap.set(f, { height: 0, autoAlpha: 0 }); tl.fromTo(f, { height: 0, autoAlpha: 0 }, { height: 96, autoAlpha: 1, duration: 0.3, immediateRender: false }, t);
          slam(f.querySelector(".stamp"), t + 0.35, -5); return O; },
      };
    }

    // ------------------------------------------------------------ 7. title card (end of the cold open, over the map)
    O.title = (tIn, tOut, o) => {
      const el = mk(Lcards, "title", `<div class="scrim"></div><div class="box"><div class="l">${(o.lines || [o.text]).map(esc).join("<br>")}</div><div class="r"></div><div class="sc s">${esc(o.sub || "")}</div></div>`);
      gsap.set(el, { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, tIn);
      tl.fromTo(el.querySelector(".scrim"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, immediateRender: false }, tIn);
      tl.fromTo(el.querySelector(".l"), { autoAlpha: 0, scale: 1.05, letterSpacing: "0.1em" }, { autoAlpha: 1, scale: 1, letterSpacing: "0.05em", duration: 1.4, ease: "power2.out", immediateRender: false }, tIn + 0.1);
      tl.fromTo(el.querySelector(".r"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut", immediateRender: false }, tIn + 0.6);
      tl.fromTo(el.querySelector(".s"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.7, immediateRender: false }, tIn + 0.9);
      fadeOut(el, tOut, 0.8); return O; };

    // ------------------------------------------------------------ 8. distance card (+ optional dashed ruler between two world points)
    const rulers = [];
    O.distance = (tIn, tOut, o) => {
      o = { ...o, tIn, tOut };
      const el = mk(Lcards, "dist", `<div class="v">0</div><div class="s">${esc(o.sub || "")}</div>`, o.from ? "" : `left:50%;top:${o.y != null ? o.y : 250}px;`);
      if (!o.from) gsap.set(el, { xPercent: -50 });
      gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, tIn); fadeOut(el, tOut, 0.5);
      const V = el.querySelector(".v"), num = o.value, unit = o.unit || "MILES", cnt = { v: 0 };
      tl.fromTo(cnt, { v: 0 }, { v: num, duration: o.countDur || 1.3, ease: "power2.out", immediateRender: false, onUpdate: () => { V.textContent = `${fmtN(cnt.v)} ${unit}`; } }, tIn + 0.1);
      V.textContent = `${fmtN(num)} ${unit}`;
      if (o.from && o.to) { const g = document.createElementNS(NS, "svg"); g.setAttribute("class", "ruler"); g.setAttribute("viewBox", `0 0 ${W} ${H}`);
        g.innerHTML = `<path class="sh" fill="none" stroke="rgba(0,0,0,.6)" stroke-width="7" stroke-dasharray="18 13" stroke-linecap="round"/><path class="ln" fill="none" stroke="#F4EEDD" stroke-width="4" stroke-dasharray="18 13" stroke-linecap="round"/>
          <circle class="e0" r="8" fill="#F4EEDD" stroke="#1A1712" stroke-width="2.5"/><circle class="e1" r="8" fill="#F4EEDD" stroke="#1A1712" stroke-width="2.5"/>`;
        Lmap.appendChild(g); rulers.push({ g, el, o }); }
      return O; };
    updaters.push((t) => { for (const r of rulers) { const a = project(r.o.from, t), b = project(r.o.to, t); if (!a || !b) continue;
      const k = E.inout(clamp((t - r.o.tIn - 0.05) / (r.o.drawDur || 1.4))), out = r.o.tOut != null ? 1 - clamp((t - r.o.tOut) / 0.5) : 1;
      const ex = lerp(a.x, b.x, k), ey = lerp(a.y, b.y, k), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, lift = -Math.hypot(b.x - a.x, b.y - a.y) * 0.12;
      const cx = mx, cy = my + lift, d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${lerp(a.x, cx, k).toFixed(1)} ${lerp(a.y, cy, k).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      r.g.querySelectorAll("path").forEach((p) => p.setAttribute("d", d));
      r.g.querySelector(".e0").setAttribute("cx", a.x); r.g.querySelector(".e0").setAttribute("cy", a.y); r.g.querySelector(".e1").setAttribute("cx", b.x); r.g.querySelector(".e1").setAttribute("cy", b.y);
      r.g.querySelector(".e1").setAttribute("opacity", k >= 0.98 ? 1 : 0); r.g.style.opacity = (Math.min(t >= r.o.tIn ? 1 : 0, out)).toFixed(3);
      const w = r.el.offsetWidth; r.el.style.left = `${clamp(mx - w / 2, 96, W - 96 - w).toFixed(1)}px`; r.el.style.top = `${clamp(my + lift - 150, 54, H - 300).toFixed(1)}px`; } });

    // ------------------------------------------------------------ 9. number card (big serif numeral) + paired loss cards
    O.number = (tIn, tOut, o) => {
      const el = mk(Lcards, "parch num", `<div class="sc k">${esc(o.kicker || "")}</div><div class="v">0</div><div class="it s">${esc(o.sub || "")}</div>`, `left:50%;top:${o.y != null ? o.y : 300}px;`);
      gsap.set(el, { xPercent: -50, autoAlpha: 0 });
      tl.fromTo(el, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "power2.out", immediateRender: false }, tIn);
      const V = el.querySelector(".v"), c = { v: 0 }; V.textContent = fmtN(o.value) + (o.suffix || "");
      tl.fromTo(c, { v: 0 }, { v: o.value, duration: o.countDur || 1.6, ease: "power3.out", immediateRender: false, onUpdate: () => { V.textContent = fmtN(Math.round(c.v / (o.round || 1)) * (o.round || 1)) + (c.v >= o.value ? (o.suffix || "") : ""); } }, tIn + 0.15);
      fadeOut(el, tOut, 0.55); return O; };
    O.pair = (tIn, tOut, cards, o = {}) => {
      const el = mk(Lcards, "pair", cards.map((c) => `<div class="c ${c.tone === "cream" ? "parch" : "darkp"}" style="border-top:4px solid ${c.color || "#C9A24A"}"><div class="sc k" style="color:${c.kColor || (c.tone === "cream" ? "#6B4B1E" : "#D9CFB4")}">${esc(c.kicker)}</div><div class="v">${esc(c.value)}</div><div class="it s" style="color:${c.tone === "cream" ? "#4B3820" : "#E2D6B8"}">${esc(c.sub || "")}</div></div>`).join(""),
        `left:50%;top:${o.y != null ? o.y : 380}px;`);
      gsap.set(el, { xPercent: -50, autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, tIn);
      el.querySelectorAll(".c").forEach((c, i) => { gsap.set(c, { autoAlpha: 0 }); tl.fromTo(c, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out", immediateRender: false }, tIn + i * 0.35); });
      fadeOut(el, tOut, 0.5); return O; };

    // ------------------------------------------------------------ update loop (pure function of t)
    O.update = (t) => { for (const u of updaters) u(t); };
    if (opts.hook !== false) { const D = opts.duration || 60, px = { k: 0 }; tl.to(px, { k: 1, duration: D, ease: "none", onUpdate: () => O.update(tl.time()) }, 0); }
    return O;
  }

  window.GMOverlay = { create, version: "1.0.0" };
})();
