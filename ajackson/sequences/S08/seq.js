// S08 ENDING (D 65.61 s, ajackson/tools/scene_times.py S08). One region: gulf (z8). Fades out at the very end.
// The British sail away (Jan 1815) -> 16 Feb 1815: the Senate approves the Treaty of Ghent (S01's Ghent card returns: APPROVED) -> Jackson's
// banner over New Orleans, fame, the White House -> the Indian Removal Act: the remaining Native lands in the South shaded (muted) and
// thin muted arrows west across the Mississippi, the Cherokee named (respectful, no drama) -> the scar card callback (S01's design) + the
// method card with all three lines -> engage.final (1 / 2 / 3, "1, 2 OR 3?", subscribe) -> the living map alone, fade.
// Facts: FACT_NOTES_neworleans.md 56 (withdrawal 18-27 Jan), treaty ratified 16 Feb 1815 (Senate); FACT_NOTES_horseshoe.md (Cherokee allies).
(() => {
const T = { D: 65.61, ten: 0.43, later: 0.81, slipped: 2.11, ships: 3.23, d16: 4.94, february: 5.29, senate: 7.09, approved: 7.41, treaty: 8.15,
  ghent: 8.75, battle: 9.73, change: 10.57, word: 11.21, made: 12.63, andrew: 12.85, jackson: 13.31, famous: 14.21, america: 15.21,
  white: 18.11, house: 18.33, signed: 20.21, indian: 20.73, removal: 21.17, act: 21.53, tens: 23.45, thousands: 23.83, native: 24.49,
  forced: 25.65, lands: 26.47, south: 27.25, cherokee: 28.87, fought: 30.09, horseshoe: 30.99, bend: 31.57,
  boy: 32.79, cut: 33.61, sword: 34.41, fourteen: 35.26, beaten: 35.83, army: 36.47, method: 37.73, three: 38.31, parts: 38.61,
  close: 39.73, strike: 41.05, make: 41.89, you: 42.71, which: 43.75, greatest: 45.27, move: 45.47, one: 46.69, trap: 47.19, hb: 47.65,
  two: 49.05, night: 49.73, dec23: 50.92, three2: 52.39, wall: 53.17, mud: 53.71, no: 54.29, tell: 55.29, comments: 56.01, cover: 58.17,
  next: 58.47, subscribe: 59.99, miss: 60.69, one2: 61.27 };
const GF = "gulf";
const NOG = VX.place("New Orleans", GF), BORG = VX.place("Lake Borgne", GF);
const CSS = `
.aj-bk{position:absolute;left:0;top:0;width:1920px;height:1080px;background:radial-gradient(ellipse 70% 70% at 50% 46%,rgba(12,9,6,.5),rgba(6,4,3,.8))}
.aj-card{position:absolute;color:#EEE7D6;font-family:"GM Cormorant",Georgia,serif;text-align:center;
  background:linear-gradient(180deg,#2b2216 0%,#1d160e 55%,#171109 100%);box-shadow:0 14px 40px rgba(0,0,0,.7),inset 0 0 0 4px #15110c,inset 0 0 0 5.5px rgba(201,178,122,.85),inset 0 0 70px rgba(0,0,0,.55)}
.aj-card .tex{position:absolute;inset:0;opacity:.16;mix-blend-mode:screen;background:repeating-linear-gradient(97deg,rgba(255,240,210,.0) 0 7px,rgba(255,240,210,.05) 7px 8px),repeating-linear-gradient(3deg,rgba(255,240,210,.0) 0 11px,rgba(255,240,210,.04) 11px 12px)}
.aj-ghent{left:410px;top:230px;width:1100px;height:560px}
.aj-ghent .hd{position:absolute;left:0;right:0;top:52px;font-family:"GM Cinzel",serif;font-weight:700;font-size:27px;letter-spacing:.46em;color:#C9B27A;padding-left:.46em}
.aj-ghent .tt{position:absolute;left:0;right:0;top:118px;font-family:"GM Cinzel",serif;font-weight:700;font-size:124px;letter-spacing:.14em;padding-left:.14em;line-height:1;
  background:linear-gradient(180deg,#fff1c4,#e8c46c 45%,#b98a35 70%,#f0d28a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 4px rgba(0,0,0,.7))}
.aj-ghent .pt{position:absolute;left:0;right:0;top:268px;font-family:"GM Cinzel",serif;font-weight:700;font-size:40px;letter-spacing:.3em;padding-left:.3em;color:#EEE7D6}
.aj-ghent .rule{position:absolute;left:330px;right:330px;top:252px;height:1.5px;background:linear-gradient(90deg,transparent,#C9B27A,transparent)}
.aj-seal{position:absolute;top:150px;width:132px;height:132px;border-radius:50%;font-family:"GM Cinzel",serif;font-weight:700;font-size:40px;line-height:132px;color:rgba(255,214,190,.55);letter-spacing:.04em;
  background:radial-gradient(circle at 38% 34%,#d2503c 0%,#a8261b 38%,#7a1610 70%,#5a0f0a 100%);
  box-shadow:0 5px 10px rgba(0,0,0,.6),inset 0 0 0 9px rgba(120,20,14,.55),inset 0 0 0 11px rgba(255,170,140,.18),inset 0 -6px 12px rgba(0,0,0,.35);text-shadow:0 -1px 1px rgba(0,0,0,.5),0 1px 0 rgba(255,190,160,.25)}
.aj-seal.l{left:92px}.aj-seal.r{right:92px}
.aj-seal::after{content:"";position:absolute;inset:-7px;border-radius:47% 53% 50% 50%/52% 46% 54% 48%;background:radial-gradient(circle at 40% 35%,#b8352a,#7a1610);z-index:-1}
.aj-stamp{position:absolute;left:50%;top:352px;margin-left:-160px;width:320px;font-family:"GM Cinzel",serif;font-weight:700;font-size:58px;letter-spacing:.16em;padding:6px 0 2px .16em;color:#C8382A;
  border:5px solid #C8382A;border-radius:6px;text-shadow:0 0 1px #C8382A;box-shadow:0 0 0 2px rgba(200,56,42,.25)}
.aj-ghent .nr{position:absolute;left:0;right:0;top:482px;font-family:"GM Cinzel",serif;font-weight:700;font-size:30px;letter-spacing:.2em;padding-left:.2em;color:#E9A090}
.aj-scar{left:1190px;top:236px;width:600px;height:470px}
.aj-scar svg{position:absolute;left:0;top:0;width:600px;height:300px;overflow:visible}
.aj-scar .cap{position:absolute;left:0;right:0;top:262px;font-family:"GM Cinzel",serif;font-weight:700;font-size:30px;letter-spacing:.14em;padding-left:.14em;color:#EEE7D6}
.aj-scar .age{position:absolute;left:0;right:0;top:318px;font-family:"GM Cinzel",serif;font-weight:700;font-size:92px;letter-spacing:.12em;padding-left:.12em;line-height:1;
  background:linear-gradient(180deg,#fff1c4,#e8c46c 45%,#b98a35 70%,#f0d28a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 3px rgba(0,0,0,.7))}
.aj-scar .src{position:absolute;left:0;right:0;top:420px;font-style:italic;font-weight:600;font-size:27px;letter-spacing:.06em;color:#C9B27A}
`;
const SCARP = "M70 196 C150 172 230 142 300 118 C370 94 450 70 532 52";   // a sabre cut across the card, rising left -> right
const CSS2 = `.aj-ghent .stp2{color:#2E6B3A;border-color:#2E6B3A;box-shadow:0 0 0 2px rgba(46,107,58,.25);text-shadow:0 0 1px #2E6B3A;width:420px;margin-left:-210px}`;
// the cards (S01's design: same Ghent card, APPROVED this time; same scar card)
const buildCards = (ctx) => { const { tl } = ctx;
  const st = document.createElement("style"); st.textContent = CSS + CSS2; document.head.appendChild(st);
  const host = document.querySelector("#ov .gmo") || document.getElementById("ov");
  const mk = (cls, html) => { const e = document.createElement("div"); e.className = cls; e.innerHTML = html; host.appendChild(e); gsap.set(e, { autoAlpha: 0 }); return e; };
  const q = (e, s) => e.querySelector(s), on = (e, t, d = 0.35, from = { y: 10 }) => { gsap.set(e, { autoAlpha: 0 }); tl.fromTo(e, { autoAlpha: 0, ...from }, { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: d, ease: "power2.out", immediateRender: false }, t); };
  const bk = mk("aj-bk", "");
  tl.fromTo(bk, { autoAlpha: 0 }, { autoAlpha: 0.8, duration: 0.5, immediateRender: false }, T.senate - 0.4); tl.to(bk, { autoAlpha: 0, duration: 0.6 }, 12.0);
  const gh = mk("aj-card aj-ghent", `<div class="tex"></div><div class="hd">16 February 1815</div><div class="aj-seal l">GB</div><div class="aj-seal r">US</div>
    <div class="tt">GHENT</div><div class="rule"></div><div class="pt">PEACE TREATY</div><div class="aj-stamp stp2">APPROVED</div><div class="nr" style="color:#C9B27A">BY THE UNITED STATES SENATE</div>`);
  tl.fromTo(gh, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power2.out", immediateRender: false }, T.senate - 0.3); tl.to(gh, { autoAlpha: 0, duration: 0.45 }, 12.0);
  gh.querySelectorAll(".aj-seal").forEach((s) => gsap.set(s, { autoAlpha: 1 }));
  ["hd", "tt", "rule", "pt"].forEach((c) => gsap.set(q(gh, "." + c), { autoAlpha: 1 }));
  on(q(gh, ".nr"), T.senate + 0.1, 0.4);
  const stp = q(gh, ".aj-stamp"); gsap.set(stp, { autoAlpha: 0 });
  tl.fromTo(stp, { autoAlpha: 0, scale: 2.3, rotation: -14 }, { autoAlpha: 0.95, scale: 1, rotation: -7, duration: 0.22, ease: "power4.in", immediateRender: false }, T.approved - 0.05);
  tl.fromTo(gh, { x: 0, y: 0 }, { keyframes: [{ x: 3, y: 2, duration: 0.04 }, { x: -2, y: -1, duration: 0.05 }, { x: 0, y: 0, duration: 0.08 }], immediateRender: false }, T.approved + 0.17);
  // the scar card (callback): the cut draws on "cut", the sword on "sword", AGE 14 on "fourteen"
  const sc = mk("aj-card aj-scar", `<div class="tex"></div><svg viewBox="0 0 600 300"><path class="g" d="${SCARP}" fill="none" stroke="rgba(200,40,28,.35)" stroke-width="22" stroke-linecap="round" style="filter:blur(6px)"/>
    <path class="c" d="${SCARP}" fill="none" stroke="#9e1d14" stroke-width="9" stroke-linecap="round"/><path class="h" d="${SCARP}" fill="none" stroke="#e46a52" stroke-width="2.4" stroke-linecap="round"/></svg>
    <div class="cap">A BRITISH OFFICER'S SWORD</div><div class="age">AGE 14</div><div class="src">by his own account</div>`);
  tl.fromTo(sc, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: "power2.out", immediateRender: false }, T.boy - 0.1); tl.to(sc, { autoAlpha: 0, duration: 0.35 }, 37.2);
  sc.querySelectorAll("path").forEach((p, i) => { const L = 520; p.style.strokeDasharray = `${L}`; gsap.set(p, { strokeDashoffset: L });
    tl.fromTo(p, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.28, ease: "power3.in", immediateRender: false }, T.cut + 0.05 + (i === 0 ? 0.12 : 0)); });
  ["cap", "age", "src"].forEach((c) => gsap.set(q(sc, "." + c), { autoAlpha: 0 }));
  on(q(sc, ".cap"), T.sword); on(q(sc, ".age"), T.fourteen - 0.05, 0.4, { y: 0, scale: 1.15 }); on(q(sc, ".src"), T.fourteen + 0.2); };

// the British fleet away to sea (S04's ships, reversed)
const AWAY = [[BORG[0] + 70, BORG[1] - 18], [560, 800], [680, 880], [820, 960], [980, 1030]];
// the remaining Native lands in the South (muted shading, approximate): the Creek lands left after 1814 and the Choctaw lands in Mississippi
const LANDS = [
  [[33.62, -86.33], [32.52, -86.21], [32.3, -85.75], [32.05, -85.3], [31.9, -85.06], [33.62, -85.02]],
  [[33.62, -90.2], [33.62, -88.45], [32.6, -88.4], [31.75, -88.45], [31.85, -89.3], [32.3, -90.0], [32.9, -90.4]],
].map((poly) => poly.map(([la, lo]) => VX.ll(la, lo, GF)));
const shade = { build() { const c = document.createElement("canvas"); c.width = 1280; c.height = 720; c.style.cssText = "position:absolute;inset:0;pointer-events:none";
    const tr = document.getElementById("troops"); tr.parentNode.insertBefore(c, tr); this.g = c.getContext("2d"); },
  draw(t, ctx) { const g = this.g; if (!g) return; g.clearRect(0, 0, 1280, 720); const W = ctx.world, k = VX.sstep(T.removal - 0.2, T.act + 0.8, t) * (1 - VX.sstep(32.0, 33.0, t)); if (k <= 0.001) return;
    for (const poly of LANDS) { const P = poly.map((q) => { const p = W.projectMap(q[0], q[1], 0); return [p.x, p.y]; });
      g.save(); g.beginPath(); P.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = `rgba(120,104,86,${(0.22 * k).toFixed(3)})`; g.fill(); g.clip();
      g.strokeStyle = `rgba(150,132,110,${(0.35 * k).toFixed(3)})`; g.lineWidth = 1.2; g.beginPath(); for (let x = -800; x < 1400; x += 12) { g.moveTo(x, 0); g.lineTo(x + 720, 720); } g.stroke(); g.restore();
      g.beginPath(); P.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.strokeStyle = `rgba(90,76,62,${(0.7 * k).toFixed(3)})`; g.lineWidth = 1.6; g.stroke(); } } };
const MUTE = "#8a7a66";
window.SEQ = {
  name: "S08", D: T.D, T, seed: 1815, date: "1815-02-16",
  regions: [GF],
  troops: "blocks", troopsOpts: { look: "lineblocks" },
  regionOpts: { [GF]: { troopScale: 12 } },
  keys: [
    { t: 0, region: GF, at: [470, 800], dist: 720, tilt: 40, yaw: 0, fov: 30 },
    { t: 11.8, region: GF, at: [520, 830], dist: 760, tilt: 40, yaw: 0, fov: 30, ease: "lin" },
    { t: 18.6, region: GF, at: [360, 790], dist: 520, tilt: 42, yaw: 0, fov: 30, ease: "io" },        // Jackson over New Orleans: a soft push
    { t: 24.6, region: GF, at: [560, 560], dist: 1180, tilt: 20, yaw: 0, fov: 30, ease: "io" },       // the South: the lands, west across the Mississippi
    { t: 32.0, region: GF, at: [560, 570], dist: 1160, tilt: 21, yaw: 0, fov: 30, ease: "lin" },
    { t: 43.4, region: GF, at: [430, 760], dist: 700, tilt: 38, yaw: 0, fov: 30, ease: "io" },
    { t: T.D, region: GF, at: [470, 740], dist: 760, tilt: 37, yaw: 2, fov: 30, ease: "lin" },          // the living map for the end screen
  ],
  clouds: { [GF]: { scatter: { seed: 7 }, keepClear: [[400, 790, 160, 1, 1]] } },
  units: [],
  boats: [{ region: GF, kind: "ship", n: 6, t0: -1, t1: 13.0, size: 3.4, lamp: false, wake: true, path: AWAY, s0: 30, speed: 7.0, spacing: 12 }],
  arrows: [
    { side: "r", region: GF, width: 0.5, maxWidth: 0.5, pts: AWAY.slice(1, 4), t0: T.slipped, dur: 1.6, t1: 6.4 },
    // removal: thin muted arrows west across the Mississippi (Creek, Choctaw, and from the Cherokee country north-east, off the map)
    ...[[[1010, 300], [700, 250], [380, 215], [60, 190]], [[640, 430], [420, 400], [200, 380], [40, 360]], [[1180, 60], [820, 80], [420, 100], [50, 110]]]
      .map((pts, i) => ({ color: MUTE, region: GF, width: 0.32, maxWidth: 0.32, pts, t0: T.forced + i * 0.5, dur: 2.6, t1: 32.2 })),
  ],
  generals: { jackson: { img: "seq/jackson.png", flag: "seq/us15_flag.png", side: "us", name: "Jackson", full: "Andrew Jackson", role: "Major General" } },
  banners: [{ general: "jackson", region: GF, keys: [[0, NOG[0] + 8, NOG[1] - 6]], t0: T.jackson - 0.05, t1: 23.6 }],
  labels: [
    { text: "Cherokee", region: GF, at: [900, 92], size: 18, t0: T.cherokee, t1: 32.0 },
    { text: "Mississippi River", region: GF, at: [140, 330], size: 17, river: true, t0: T.forced + 0.6, t1: 31.2 },
  ],
  fx: {},
  overlay: [
    ["plaque.date", 0.35, { month: "January 1815", day: "", weekday: "", note: "the British leave" }],
    ["plaque.date", T.february, { month: "February 1815", day: "16", weekday: "Thursday", note: "the treaty approved" }],
    ["label", T.act + 0.1, 25.4, { name: "Indian Removal Act", sub: "signed by President Jackson", screen: true, x: 1180, y: 200, marker: false, side: "us" }],
    ["film.dim", T.boy - 0.3, 43.3, 0.55],
    ["letter", T.method - 0.2, 43.3, { header: "Andrew Jackson", title: "The Old Hickory Method", sub: "", marks: false, quote: "1. Close every door\n2. Strike first\n3. Make them come to you", qSize: 34, height: 300,
      cps: 15, qAt: T.close - 0.05, lag: 0.05, stagger: 0.06, partDur: 0.35 }],
    () => { const q = [...document.querySelectorAll("#ov .letter .q")].pop(); if (q) q.style.whiteSpace = "pre-line"; },
    ["plaque.hide", 43.2],
    ["engage.final", { moves: [["HORSESHOE BEND", "1814"], ["THE NIGHT ATTACK", "1814"], ["NEW ORLEANS", "1815"]], q: "WHICH WAS HIS GREATEST MOVE?", sub: "",
      tShow: T.which - 0.1, tNums: [T.one, T.two, T.three2], tAsk: T.no + 0.2, extra: "Tell us in the comments, and which commander we should cover next", tExtra: T.tell,
      until: 59.0, tSub: T.subscribe - 1.25, subUntil: 63.4 }],
  ],
  start: {}, end: { fadeAt: 64.4, dur: 1.2 },
  build: (ctx) => { buildCards(ctx); shade.build(ctx); },
  draw: (t, ctx) => { shade.draw(t, ctx); },
};
})();
