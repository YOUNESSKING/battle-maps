// HOOK-A (hook-1 .. hook-2), Ulysses S. Grant #16. THE LOCKED HOOK (STYLE_LOCK 1a + 1c). STYLE W restyle (STYLE_LOCK 2d, 2026-11-06,
// grant/STYLEW_BRIEF.md; model cleburne/scenes-src/hook-a.js): same story, beats, cards, camera story and B.at phrases as v2; only the LOOK
// changes (one green ink map, clean screen: no territory at the opening, no unit flags, thin solid arrows, white serif labels, cream stamps,
// focus wash / ink trace / zoom box instead of glows and rings, neutral vignette pulse, the "?" badge top right <= 3.5 s).
// Built with:  python3 tools/gh_inline.py hook-a donelson_w hook-1 hook-2      (kit tools/gh_kitw.js)
// ONE world = donelson map px (z13). Three Style W maps on ONE camera at their true place and scale: `tennessee_w` (z9, 16x, the overview,
//   ghw_ten.jpg), `henry_w` (z11, 4x, feathered, fades in 0.12x-0.24x, ghw_hen.jpg) and `donelson_w` (z13, the relief + #relief2 close
//   look by the lens transition above ~2x, feathered, fades in 0.38x-0.72x).
// hook-1 (stakes): frame 0 = the theatre, clean (map + units moving, two flags, the date scroll WINTER 1862 already filled); WINTER 1862
//   stamp in the first second; "two rivers": the Tennessee and the Cumberland are re-inked from the Ohio; "open doors": thin blue arrows up
//   both rivers (OPEN DOORS); "heart of the Confederacy": focus on Nashville; "two forts": two red forts slam on the rivers; "held them
//   shut": short red booms across both rivers, the boats stop (HELD SHUT); zoom box on the fort; ONE continuous zoom (whoosh, no cut, no
//   flash) down the Cumberland onto FORT DONELSON, landing on the words "Fort Donelson".
// hook-2: blue columns march over from the Tennessee and close the ring (the locked two-colour front), gunboats fire on the water batteries;
//   12,000+ card on "twelve thousand" (ticks); SURRENDERED: the pocket passes to the Union = BLUE ink hatching ~3 s (gn_don_ctl_feb16cap,
//   the only hand-over in this scene), the garrison greys, a white flag, prisoners; the "?" badge on "a general" (top right, <= 3.5 s);
//   FIRST MAJOR VICTORY; "a disaster": neutral pulse, the camera pushes in on the Union right (hook-b starts on this frame).
// Facts: research/FACT_NOTES.md + FACTCHECK_A (forts, ring, 12,000-15,000 prisoners). Nothing on screen before it is spoken (1c).
// @@KIT
// @@DATA
const LD = GG.proj(13, 535372, 819244);
const go = (id, t, dur, p, ease) => B.move(id, t, dur, p[0], p[1], ease || "power1.inOut");
const H1 = "hook-1", H2 = "hook-2", S2 = B.P(H2);
const T_1862 = at(H1, "eighteen sixty-two"), T_RIV = at(H1, "two rivers"), T_DOORS = at(H1, "open doors"), T_HEART = at(H1, "heart of the Confederacy"),
  T_FORTS = at(H1, "two forts"), T_SHUT = at(H1, "held them shut"), T_ONE = at(H1, "One of them"), T_CUMB = at(H1, "Cumberland River"), T_FD = at(H1, "Fort Donelson");
const T_WEEK = at(H2, "Within a week"), T_12 = at(H2, "twelve thousand"), T_CSOL = at(H2, "Confederate soldiers"), T_SURR = at(H2, "surrendered"),
  T_GEN = at(H2, "to a general"), T_NOBODY = at(H2, "almost nobody"), T_NORTH = at(H2, "It was the North"), T_FIRST = at(H2, "first major victory"),
  T_BEGAN = at(H2, "began as a disaster"), T_DIS = at(H2, "disaster");
// =====================================================================================================================
// THE WORLD: three Style W maps, one camera
// =====================================================================================================================
const RELIEF = document.getElementById("relief"), RELIEF2 = document.getElementById("relief2");
const group = (r, fe) => { const g = document.createElement("div");
  g.style.cssText = `position:absolute;left:${r[0]}px;top:${r[1]}px;width:${r[2]}px;height:${r[3]}px;isolation:isolate;`;
  if (fe) { const F = `linear-gradient(to right, transparent 0%, #000 ${fe}%, #000 ${100 - fe}%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 ${fe * 1.6}%, #000 ${100 - fe * 1.6}%, transparent 100%)`;
    g.style.webkitMaskImage = F; g.style.maskImage = F; g.style.webkitMaskComposite = "source-in"; g.style.maskComposite = "intersect"; }
  WORLD.insertBefore(g, RELIEF); return g; };
const gimg = (src, parent) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"; parent.appendChild(i); return i; };
const TEN = group([-21900, -13756, 46080, 25920], 0); gimg("assets/media/ghw_ten.jpg", TEN);
const HEN = group([-4904, -2576, 11520, 6480], 6); gimg("assets/media/ghw_hen.jpg", HEN);
const DON = group([0, 0, 2880, 1620], 5); RELIEF.style.cssText += "position:absolute;left:0;top:0;width:100%;height:100%;"; DON.appendChild(RELIEF);
DON.appendChild(RELIEF2); RELIEF2.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;opacity:0";
// ---------- the camera (+ the STYLE W lens transition wide -> close, cleburne hook-a) ----------
const cam = { cx: 0, cy: 0, s: 1 }, VIG = document.getElementById("vignette");
const smooth = (a) => a * a * (3 - 2 * a), ramp = (s, a, b) => smooth(Math.min(Math.max(Math.log(s / a) / Math.log(b / a), 0), 1));
const lens = (el, kc, lx, ly) => { el.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
  el.style.webkitMaskImage = el.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${lx.toFixed(0)}px ${ly.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none"; };
const applyCam = () => { const s = cam.s; gsap.set(WORLD, { x: 960 - cam.cx * s, y: 540 - cam.cy * s, scale: s });
  HEN.style.opacity = ramp(s, 0.12, 0.24).toFixed(3); DON.style.opacity = ramp(s, 0.38, 0.72).toFixed(3);
  const kc = Math.min(Math.max((s - 1.95) / 0.45, 0), 1); lens(RELIEF2, kc, cam.cx, cam.cy); VIG.style.opacity = kc.toFixed(3);
  CAM_S = s; setInv(); camHook(s, 960 - cam.cx * s, 540 - cam.cy * s); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// continuous geographic zoom: the scale changes log-linearly, the anchor P slides on a straight screen path (no cut, no flash)
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], q = { u: 0 };
  tl.fromTo(q, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => { const u = q.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t); };
// ---------- places (world = donelson map px) ----------
const FD = [1395, 758], WB = [1425, 742], FH = LD(36.515, -88.035), NASH = LD(36.1627, -86.7816), PAD = LD(37.0834, -88.60),
  CLK = LD(36.5298, -87.3595), BGR = LD(36.9685, -86.48), COL = LD(36.76, -89.10), CAI = LD(37.0053, -89.1765);
const TW = (pts) => pts.map(([x, y]) => [-21900 + 16 * x, -13756 + 16 * y]);           // tennessee map px -> world
const RCUM = TW(GD.riv.cumberland).reverse(), RTEN = TW(GD.riv.tennessee).reverse();   // both upstream: from the Ohio into the South
const near = (pts, p) => { let bi = 0, bd = 1e18; pts.forEach((q, i) => { const d = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2; if (d < bd) { bd = d; bi = i; } }); return bi; };
const upTo = (pts, p) => pts.slice(0, near(pts, p) + 1);
const iFH = near(RTEN, FH), iFD = near(RCUM, FD);
const FHR = RTEN[iFH], FDR = RCUM[iFD];                                                     // the forts' points on the overview rivers
// the Cumberland at the fort, traced on the donelson relief (map px)
const CUMB_D = [[1150, 150], [1200, 300], [1245, 410], [1290, 520], [1335, 605], [1385, 660], [1450, 695], [1520, 705], [1600, 690], [1700, 665], [1830, 625]];
// =====================================================================================================================
// hook-1 (0 - S2): THE THEATRE, WINTER 1862, clean map; the rivers; ONE continuous zoom onto Fort Donelson
// =====================================================================================================================
const C0 = [1600, 0], S0 = 0.1, C0b = [1450, 150], S0b = 0.112;
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = S0; applyCam();
const TZ0 = T_ONE - 0.3, TZ1 = T_FD + 0.05;                 // the dive: lands on "Fort Donelson"
const CF = [1395, 745], SF = 1.1;                           // arrival: the fort and the river
camTo(0, TZ0, C0b, S0b, "sine.inOut");
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 });
// date scroll: filled from frame 0 and never blank (critic fix, cleburne hook-a); the spoken season + year
const D0 = document.createElement("div"); D0.className = "d"; D0.textContent = "WINTER 1862"; D0.style.fontSize = "32px"; document.getElementById("date").appendChild(D0);
tl.to(D0, { autoAlpha: 0, y: -14, duration: 0.35 }, T_SURR + 0.05);
// stamp in the first second, in the narrator's words ("In the winter of eighteen sixty-two"); top band, clear of the scroll
sstamp("WINTER 1862", 205, 0.55, { size: 72, until: T_RIV - 0.15, shake: 5 });
// flags (48 px, no names): one pair on each side's ground, on screen from frame 0
const F0 = [flagS(FL.us, "", ...LD(37.05, -87.60), 0, TZ0 + 0.9), flagS(FL.csa, "", ...LD(36.15, -87.25), 0, TZ0 + 0.9)];
// ---------- units already moving at frame 0 (no names: nothing spoken yet) ----------
const B1 = upTo(RTEN, FH), B2 = upTo(RCUM, FD);
const GBT = [gunboat(B1.slice(0, Math.round(B1.length * 0.75)), 0, T_SHUT + 0.3, TZ0 + 0.8, { s: 18 }),
  gunboat(B1.slice(0, Math.round(B1.length * 0.62)), 0, T_SHUT + 0.2, TZ0 + 0.8, { s: 18 }),
  gunboat(B2.slice(0, Math.round(B2.length * 0.78)), 0, T_SHUT + 0.3, TZ0 + 0.8, { s: 18 })];
gsap.set(GBT, { autoAlpha: 1 });
const UB = [unitS("ub1", "carth", CAI, "infantry", ""), unitS("ub2", "carth", LD(37.05, -88.75), "infantry", "")];
UB.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));
along("ub1", [CAI, PAD, B1[Math.round(B1.length * 0.3)]], 0, TZ0 - 0.4, 20);
along("ub2", [LD(37.05, -88.75), ...B1.slice(0, Math.round(B1.length * 0.5))], 0, TZ0 - 0.4, 20);
const UR = [unitS("ur1", "rome", COL, "infantry", ""), unitS("ur2", "rome", BGR, "infantry", ""), unitS("ur3", "rome", FH, "infantry", "")];
UR.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));
along("ur2", [BGR, LD(36.80, -86.95), CLK, LD(36.50, -87.60)], 0, TZ0 + 0.3, 20);   // Bowling Green -> Clarksville -> the fort (reinforcing)
go("ur3", 0, 4, [FH[0] - 120, FH[1] + 250]);
B.hideUnits([...UB, ...UR], TZ0 + 0.5, 0.4);
// ---------- "two rivers": the Tennessee and the Cumberland are re-inked from the Ohio (thin sepia ink trace, drawn upstream) ----------
inkTrace(RTEN, T_RIV - 0.2, T_RIV + 3.2, 2.6); inkTrace(RCUM, T_RIV, T_RIV + 3.3, 2.6);
// ---------- "open doors": thin solid blue arrows run up both rivers into the South ----------
arw({ pts: RTEN.filter((_, i) => i % 6 === 0).slice(0, Math.round(RTEN.length / 6 * 0.7)), side: "carth", t: T_DOORS - 0.1, dur: 1.5, width: AW(S0, 9), until: T_SHUT - 0.05 });
arw({ pts: RCUM.filter((_, i) => i % 6 === 0), side: "carth", t: T_DOORS + 0.1, dur: 1.5, width: AW(S0, 9), until: T_SHUT - 0.05 });
SFX("ref:whoosh", T_DOORS - 0.1);
sstamp("OPEN DOORS", 205, T_DOORS + 0.05, { size: 66, until: T_FORTS - 0.25, shake: 3 });
// "heart of the Confederacy": the soft focus wash on Nashville (no ring, no glow)
focus(NASH, 75 / S0, T_HEART, T_FORTS - 0.1);
// ---------- "two forts": two red forts slam onto the rivers; "held them shut": short red booms across both rivers ----------
const FTH = fortIcon(...FHR, T_FORTS - 0.05, TZ0 + 1.0, { s: 40 }), FTD = fortIcon(...FDR, T_FORTS + 0.15, null, { s: 40 });
tl.to(FTD, { left: FD[0], top: FD[1], duration: 2.0, ease: "sine.inOut" }, TZ0 + 1.5);   // onto the fort itself as the donelson map comes in
[FTH, FTD].forEach((el, k) => { tl.fromTo(el.querySelector(".fi"), { scale: 2.4 }, { scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, T_FORTS - 0.05 + k * 0.2); });
SFX("hit", T_FORTS + 0.15); K.shake(T_FORTS + 0.15, 4, 0.3);
const bar = (pts, i) => { const a = pts[Math.max(0, i - 3)], b = pts[Math.min(pts.length - 1, i + 3)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, h = 22 / S0;
  const p = pts[i]; return [[p[0] - dy / L * h, p[1] + dx / L * h], [p[0] + dy / L * h, p[1] - dx / L * h]]; };
const boom = (pts, t, until) => { const g = document.createElementNS(NS, "g");   // solid red boom (dark casing), no glow
  g.innerHTML = `<path d="M${pts[0].join(" ")} L${pts[1].join(" ")}" stroke="#1a1712" stroke-width="${(9 / S0).toFixed(1)}" stroke-linecap="round"/><path d="M${pts[0].join(" ")} L${pts[1].join(" ")}" stroke="#c4121f" stroke-width="${(5.5 / S0).toFixed(1)}" stroke-linecap="round"/>`;
  OVL.appendChild(g); gsap.set(g, { autoAlpha: 0 }); tl.fromTo(g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, immediateRender: false }, t); tl.to(g, { autoAlpha: 0, duration: 0.4 }, until); return g; };
[bar(RTEN, iFH), bar(RCUM, iFD)].forEach((pts, k) => boom(pts, T_SHUT - 0.05 + k * 0.12, k ? TZ0 + 1.4 : TZ0 + 0.8));
SFX("hit", T_SHUT + 0.1);
sstamp("HELD SHUT", 205, T_SHUT + 0.05, { size: 70, until: TZ0 - 0.05, shake: 5 });
pulse(T_SHUT + 0.25);
// zoom box: the dive target (the fort on the Cumberland), ~1.5 s before and into the dive
zoomBox(FDR, 80, 48, S0b, T_ONE - 0.9, TZ0 + 0.7);
// ---------- ONE CONTINUOUS ZOOM (whoosh) from the theatre down the Cumberland onto Fort Donelson ----------
SFX("whoosh", TZ0 - 0.05);
zoom(TZ0, TZ1 - TZ0, C0b, S0b, CF, SF, FD, "power2.inOut");
// the Cumberland is named on its words: re-inked at the donelson scale + a white serif river label (<= 3.5 s)
inkTrace(CUMB_D, T_CUMB - 0.1, T_CUMB + 3.0, 2.4);
boxL("CUMBERLAND RIVER", 1385, 470, T_CUMB, null, { size: 13 });
// mid-zoom flags: the Union flag rides the gunboats coming up the Cumberland; the Confederate flag on Tennessee ground east of the river
const BOATR2 = [[1150, 150], [1200, 300], [1240, 400], [1275, 480], [1300, 545]];
const GB2 = [0, 1].map((k) => gunboat(BOATR2.map(([x, y]) => [x - k * 22, y - k * 60]), TZ0 + 0.8, T_WEEK + 3.0 - (TZ0 + 0.8), T_BEGAN - 0.5, { s: 17 }));
const FB = flagS(FL.us, "", 1060, 230, TZ0 + 0.8, TZ1 - 0.3); pinAlong(FB, [[1060, 230], [1110, 380]], TZ0 + 0.8, 6.0, 8);
const FM = flagS(FL.csa, "", ...LD(36.40, -87.72), TZ0 + 0.8, TZ1 + 0.4);
// arriving on Fort Donelson: the fort (named objective, permanent small serif label), flags behind each side's lines
const F2 = [flagS(FL.us, "", 900, 690, TZ1 - 0.5, null), flagS(FL.csa, "", 1745, 445, TZ1 - 0.5, null)];
const FDL = pinS(box("FORT DONELSON", FD[0] - 150, FD[1] - 44, T_FD - 0.05, 26, T_BEGAN - 0.3));
focus(FD, 70, T_FD + 0.05, T_FD + 3.2);
SFX("hit", TZ1); K.shake(TZ1, 4, 0.3);
// the garrison in the fort and round Dover (red), the batteries above the river
const GR = [unitS("g1", "rome", [1320, 810], "infantry", "", { t: TZ1 - 0.5 }), unitS("g2", "rome", [1440, 845], "infantry", "", { t: TZ1 - 0.4 }),
  unitS("g3", "rome", [1545, 815], "infantry", "", { t: TZ1 - 0.3 }), unitS("g4", "rome", [1482, 726], "artillery", "", { t: TZ1 - 0.35, w: 44, h: 29 })];
// the colour key: first map of the video, the unit colours are new; ~3.5 s, out before the number card
legend(TZ1 - 0.2, T_12 - 0.4);
// =====================================================================================================================
// hook-2: within a week -- the ring closes; 12,000+; SURRENDERED; the "?" general; first major victory; a disaster
// =====================================================================================================================
// the Union columns march over from the Tennessee (Fort Henry) and take their places round the fort (no names: none spoken here)
const CW = [1060, 730], SW = 0.95, CR = [1430, 800], SR = 1.55;
camTo(TZ1 + 0.02, T_WEEK - TZ1 + 0.1, [CF[0] - 25, CF[1] + 5], SF * 1.04, "sine.out");
camTo(T_WEEK + 0.1, 2.2, CW, SW, "sine.inOut");
const RD1 = [[FH[0] + 60, FH[1] + 30], [700, 640], [1000, 700], [1180, 760], [1250, 760]], RD2 = [[FH[0] + 60, FH[1] + 60], [700, 700], [1000, 820], [1200, 870], [1290, 880]],
  RD3 = [[FH[0] + 40, FH[1] + 90], [650, 780], [950, 920], [1250, 960], [1420, 945]];
const UC = [unitS("uSm", "carth", RD1[0], "infantry", "", { t: T_WEEK - 0.4, size: "XX" }), unitS("uWa", "carth", RD2[0], "infantry", "", { t: T_WEEK - 0.3, size: "XX" }),
  unitS("uMc", "carth", RD3[0], "infantry", "", { t: T_WEEK - 0.2, size: "XX" })];
[RD1, RD2, RD3].forEach((pts, k) => { along(UC[k], pts, T_WEEK - 0.2 + k * 0.15, 3.6, 16); arw({ pts, side: "carth", t: T_WEEK - 0.1 + k * 0.15, dur: 1.6, width: AW(SR, 9), until: T_12 - 0.3 }); });
SFX("ref:whoosh", T_WEEK);
const FH_I = fortIcon(FH[0] + 25, FH[1] - 10, T_WEEK - 0.2, T_SURR + 1.0, { s: 36, side: "carth" });     // Fort Henry already taken (blue)
// the gunboats come up the river and fire on the water batteries (visible, on screen); powder smoke at the batteries
shoot([1290, 520], [WB[0] - 6, WB[1] - 8], T_WEEK + 3.1, { r: 7, h: 30, width: 1.4, dur: 0.6 });
smoke([[1290, 520], [1300, 528], [WB[0] + 10, WB[1] - 4]], T_WEEK + 3.15, 1 / SR);
// push in on the fort as the ring closes; the locked two-colour front round the pocket (where the sides touch)
camTo(T_12 - 0.6, 2.4, CR, SR, "sine.inOut");
const RING = [[1300, 735], [1290, 790], [1305, 850], [1360, 885], [1440, 900], [1520, 892], [1580, 860], [1600, 800]];
front2(RING, SR, T_WEEK + 2.2, { dur: 1.4, until: T_SURR + 0.4 });
// the big number card (top right, clear of the scroll and the pocket): slams on "twelve thousand", ticks; CONFEDERATE SOLDIERS lights on its words
const BIG = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:14px 56px 18px;background:rgba(14,12,10,0.9);border-top:8px solid #c4121f;box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div style="font-size:26px;letter-spacing:0.36em;color:#d8cfb8">MORE THAN</div>
  <div class="n" style="font-size:132px;line-height:1;color:#f7f3ea;letter-spacing:0.02em">0</div>
  <div class="w0" style="font-size:38px;letter-spacing:0.14em;color:#6e675c">CONFEDERATE SOLDIERS</div></div>`, "right:60px;top:150px;transform-origin:50% 40%;", T_12 - 0.15, T_SURR - 0.2, { autoAlpha: 0 });
slam(BIG, T_12 - 0.15, { from: 1.9, dur: 0.22, shake: 6 });
const tickN = (el, sel, n, t0, t1, fmt) => { const v = { v: 0 }, e = el.querySelector(sel);
  tl.to(v, { v: n, duration: t1 - t0, ease: "power2.out", onUpdate: () => { e.textContent = fmt(v.v); } }, t0); for (let t = t0; t < t1 - 0.05; t += 0.13) SFX("tick", t); };
tickN(BIG, ".n", 12000, T_12 + 0.1, T_CSOL + 0.2, (v) => (Math.round(v / 100) * 100).toLocaleString("en-US"));
tl.to(BIG.querySelector(".w0"), { color: "#ef8a82", duration: 0.15 }, T_CSOL);
// "surrendered": the ground passes to the Union = blue ink hatching ~3 s (the one hand-over of this scene), the garrison greys,
// a white flag over the fort, prisoners
sstamp("SURRENDERED", 205, T_SURR - 0.05, { size: 86, shake: 6, until: T_GEN - 0.05 });
pulse(T_SURR + 0.2);
dateSet("16 FEBRUARY 1862", T_SURR + 0.1, null);
hand("assets/media/gn_don_ctl_feb16cap_mx.png", T_SURR + 0.1, 2.8);
B.grey(GR, T_SURR + 0.1, 0.8);
const WF = pinS(GG.pin(`<svg width="40" height="54" viewBox="0 0 40 54" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.8))"><path d="M6 54 L6 2" stroke="#2a2420" stroke-width="3.5"/><path d="M7 3 C18 0 26 8 38 4 L38 24 C26 28 18 20 7 23 Z" fill="#fbfaf5" stroke="#2a2420" stroke-width="1.6"/></svg>`, FD[0] + 8, FD[1] - 48, { t: T_SURR + 0.2, pop: true }));
const PRI = bars(FD[0] + 95, FD[1] + 40, T_SURR + 0.6, T_SURR + 0.6 + LBL_LIFE, 40);
// the ring closes on the river: the counters step up to the works
[["uSm", [1270, 760]], ["uWa", [1300, 870]], ["uMc", [1450, 925]]].forEach(([id, p], k) => go(id, T_SURR - 0.6 + k * 0.1, 1.4, p));
// "to a general almost nobody in the North had heard of": the "?" badge (top right, <= 3.5 s), focus on the Union line
const QB = qBadge("A GENERAL", "", T_GEN + 0.25, Math.min(T_FIRST - 0.25, T_GEN + 3.6));
tl.to(QB, { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1, transformOrigin: "100% 0%" }, T_NOBODY);
focus([1270, 760], 90, T_GEN + 0.3, T_NORTH);
// "the North's first major victory of the war"
sstamp("FIRST MAJOR VICTORY", 205, T_FIRST - 0.05, { size: 72, sub: "OF THE WAR", until: T_BEGAN - 0.2, shake: 5 });
SFX("ref:boom", T_FIRST + 0.2);
focus(FD, 110, T_FIRST + 0.1, T_BEGAN);
// "it began as a disaster": neutral pulse, the camera pushes in on the Union right, where it began (hook-b starts on this frame)
const CE = [1430, 800], SE = 1.9;                          // hook-b's first camera (keep in sync with gh_body_hook-b.js)
camTo(T_BEGAN - 0.4, END - T_BEGAN + 0.4, CE, SE, "sine.inOut");
sstamp("A DISASTER", 205, T_DIS - 0.1, { size: 80, until: END + 1, shake: 6 });   // stays over the cut: hook-b frame 0 shows it and takes it out (>= 2 s in all)
pulse(T_DIS + 0.15);
// flags for the close push (both on the screen to the end; hook-b starts with this pair)
tl.to(F2, { autoAlpha: 0, duration: 0.4 }, T_12 + 0.6);
const F3 = [flagS(FL.us, "", 1190, 905, T_12 + 0.5, null), flagS(FL.csa, "", 1680, 760, T_12 + 0.5, null)];
// the HUD steps out while a big card is up (1c); the date scroll stays
declutter([QB], [[T_FIRST - 0.05, T_BEGAN - 0.2]]);
B.finish();
