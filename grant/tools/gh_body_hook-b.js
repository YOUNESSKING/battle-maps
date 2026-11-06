// HOOK-B (hook-3 .. hook-4), Ulysses S. Grant #16. THE LOCKED HOOK (STYLE_LOCK 1a: back INTO the danger, the twist as action, the general
// enters as the TURN, name slam + 3 snap cuts + title; 1c: nothing before it is spoken, one big card at a time, visible fire only).
// STYLE W restyle (STYLE_LOCK 2d, 2026-11-06, grant/STYLEW_BRIEF.md; models cleburne/scenes-src/hook-a.js + hook-b.js): same story, beats,
// cards, cuts and B.at phrases as v2; only the LOOK changes (one green ink map + close look by the lens, no territory fills, no unit flags,
// thin solid arrows and trails, white serif labels, cream stamps, focus wash / ink trace, neutral pulse, "?" badge top right <= 3.5 s,
// Grant's and Lee's portrait cards on stakes at their own units in the cuts instead of corner badges).
// Built with:  python3 tools/gh_inline.py hook-b donelson_w hook-3 hook-4      (kit tools/gh_kitw.js)
// World = the donelson map px (relief donelson_w + #relief2 close look). Snap-cut maps are full-size Style W layers at the world origin,
// each shown only inside its cut (a black frame hides every camera jump): `henry_w` (Feb 1862), `vicksburg_siege_w` (Apr 1863, night),
// `jamesriver_w` (Jun 1864), each with its close twin for the lens.
// hook-3: frame 0 = hook-a's last frame (16 Feb, the garrison grey, the white flag, A DISASTER); the clock rolls back (16 -> 15 FEB, ticks),
//   the white flag drops, the garrison comes back to life; "At dawn": cool morning light, push in to the Union right (the close look spreads
//   from the centre), the locked two-colour front; "burst out": red columns break out south, musket volleys where the lines touch, powder
//   smoke, the ground the breakout takes hatches RED ~3 s (gn_don_ctl_feb15acap: Confederate gain); "broken the Union right": the three
//   brigades fall back (BROKEN); "the road out stood open": ink trace + focus along the Forge road, a thin red arrow down it; "The Union
//   commander": the "?" badge (top right, <= 3.5 s); "not even there": the empty headquarters (NOT EVEN THERE); "away on a gunboat ... the
//   admiral": up the river to the flagship, a small "?" marker rides on it; "when he rode back": the "?" rides back along the line (thin
//   solid trail that fades); "standing in knots, holding muskets": the broken brigades bunch up; NO AMMUNITION; "tons of it, close at
//   hand": ammunition crates just behind the line (TONS OF IT · CLOSE AT HAND).
// hook-4: the map dims, the "?" comes to the centre and turns into the real photo, ULYSSES S. GRANT slams; "a few weeks earlier his own
//   superior had brushed off his plan": the unnamed superior, the plan sketch + BRUSHED OFF; 3 snap cuts (whoosh + hit), each with Grant's
//   portrait card on a stake at his own column and a numbered place marker: 1 Fort Donelson · 1862 (henry_w: gunboats up both rivers, both
//   forts blue), 2 Vicksburg · 1863 (night: the gunboats run past the bluff batteries, visible shots), 3 James River · 1864 (the pontoon
//   bridge, the columns crossing; Lee's portrait at his army facing the other way); title card below the date scroll on "three greatest".
// Facts: FACTCHECK_A #17 (Grant away at Foote's flagship, men "standing in knots", "tons of it close at hand"), FACT_NOTES (Halleck brushed
// him off in January; Vicksburg run 16 Apr 1863; James River bridge 14 Jun 1864). No unspoken names: the superior is not named.
// @@KIT
// @@DATA
const HP = GG.proj(11, 132617, 204167), VP = GG.proj(...GD.maps.vicksburg_siege), JP = GG.proj(...GD.maps.jamesriver);
const go = (id, t, dur, p, ease) => B.move(id, t, dur, p[0], p[1], ease || "power1.inOut");
const H3 = "hook-3", H4 = "hook-4", S4 = B.P(H4);
const T_MORN = at(H3, "the morning"), T_15 = at(H3, "fifteenth of February"), T_DAWN = at(H3, "At dawn"), T_BURST = at(H3, "burst out"),
  T_BROKE = at(H3, "broken the Union right"), T_ROAD = at(H3, "the road out"), T_OPEN = at(H3, "stood open"), T_CMDR = at(H3, "The Union commander"),
  T_NOT = at(H3, "not even there"), T_AWAY = at(H3, "away on a gunboat"), T_ADM = at(H3, "the admiral"), T_RODE = at(H3, "when he rode back"),
  T_KNOTS = at(H3, "standing in knots"), T_MUSK = at(H3, "holding muskets"), T_NOAMMO = at(H3, "no ammunition"), T_TONS = at(H3, "tons of it"),
  T_HAND = at(H3, "close at hand");
const T_NAME = at(H4, "Ulysses S. Grant"), T_FEW = at(H4, "a few weeks earlier"), T_SUP = at(H4, "his own superior"), T_BRUSH = at(H4, "brushed off"),
  T_PLAN = at(H4, "his plan"), T_TWO = at(H4, "He took two rivers"), T_CITY = at(H4, "He took the city"), T_MISS = at(H4, "the Mississippi"),
  T_MARCH = at(H4, "And he marched"), T_ACROSS = at(H4, "across a river"), T_LEE = at(H4, "Robert E. Lee"), T_OTHER = at(H4, "looking the other way"),
  T_THESE = at(H4, "These are"), T_GREAT = at(H4, "three greatest");
// =====================================================================================================================
// THE WORLD
// =====================================================================================================================
const RELIEF = document.getElementById("relief"), RELIEF2 = document.getElementById("relief2");
const CLOSE = [RELIEF2];   // every close-look image (lens)
const layer = (src, close) => { const g = document.createElement("div"); g.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;isolation:isolate;";
  [src, close].forEach((f, k) => { const i = document.createElement("img"); i.src = f; i.alt = ""; i.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;${k ? "opacity:0" : ""}`; g.appendChild(i); if (k) CLOSE.push(i); });
  WORLD.insertBefore(g, OVL); gsap.set(g, { autoAlpha: 0 }); return g; };
const LHE = layer("assets/media/ghw_hen.jpg", "assets/media/ghw_hen_close.jpg"), LVK = layer("assets/media/ghw_vks.jpg", "assets/media/ghw_vks_close.jpg"),
  LJA = layer("assets/media/ghw_jam.jpg", "assets/media/ghw_jam_close.jpg");
const LV = LivingK(B); LV.clouds({ n: 6, opacity: 0.12 });
// ---------- camera (every map is 2880 x 1620: clamped inside) + the STYLE W lens transition (cleburne hook-a: close look from ~2x) ----------
const cam = { cx: 1430, cy: 800, s: 1.9 }, VIG = document.getElementById("vignette");     // = hook-a's last camera
const lens = (el, kc, lx, ly) => { el.style.opacity = Math.min(1, kc * 3).toFixed(3); const rad = 150 + kc * 2400;
  el.style.webkitMaskImage = el.style.maskImage = kc > 0 && kc < 1 ? `radial-gradient(circle at ${lx.toFixed(0)}px ${ly.toFixed(0)}px, #000 ${rad.toFixed(0)}px, transparent ${(rad + 380).toFixed(0)}px)` : "none"; };
const applyCam = () => { const s = Math.max(cam.s, 1920 / 2880), cx = Math.min(Math.max(cam.cx, 960 / s), 2880 - 960 / s), cy = Math.min(Math.max(cam.cy, 540 / s), 1620 - 540 / s);
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv();
  const kc = Math.min(Math.max((s - 1.95) / 0.45, 0), 1); CLOSE.forEach((el) => lens(el, kc, cx, cy)); VIG.style.opacity = kc.toFixed(3);
  camHook(s, 960 - cx * s, 540 - cy * s); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
applyCam();
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
const vis = (t0, t1) => (el) => { gsap.set(el, { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, t0); if (t1 != null) tl.set(el, { autoAlpha: 0 }, t1 - 0.01); return el; };
const PINS = document.getElementById("pins");
const snap = () => new Set([...OVL.children, ...PINS.children]);
const endScope = (s0, until) => { const els = [...OVL.children, ...PINS.children].filter((e) => !s0.has(e) && e.tagName.toLowerCase() !== "defs"); tl.set(els, { autoAlpha: 0 }, until - 0.01); };
// ---------- places (donelson map px) ----------
const FD = [1395, 758], HQ = [1170, 700], BOATP = [1300, 470], LAND = [1255, 560];
const RING = [[1300, 735], [1290, 790], [1305, 850], [1360, 885], [1440, 900], [1520, 892], [1580, 860], [1600, 800]];
const RING2 = [[1300, 735], [1290, 790], [1300, 860], [1335, 930], [1405, 975], [1490, 995], [1565, 955], [1600, 800]];
const FORGE = [[1510, 775], [1525, 850], [1532, 930], [1522, 1010], [1502, 1090], [1484, 1180], [1474, 1290], [1470, 1400]];
// =====================================================================================================================
// FRAME 0 = hook-a's last frame (16 Feb 1862, after the surrender; A DISASTER still up)
// =====================================================================================================================
const DS = document.getElementById("date"), d16 = document.createElement("div"); d16.className = "d"; d16.textContent = "16 FEBRUARY 1862"; d16.style.fontSize = "32px"; DS.appendChild(d16);
const DIS0 = scr0(stampHTML("A DISASTER", "#f0e6c8", 80, 0), "left:340px;right:0;top:205px;display:flex;justify-content:center;"); gsap.set(DIS0, { autoAlpha: 1 });
tl.to(DIS0, { autoAlpha: 0, duration: 0.35 }, 1.5);
SCN.appendChild(DS);   // the date scroll sits above every overlay (snap-cut darkening, night wash, dims): always full brightness (critic 2)
const FT = fortIcon(...FD, null, null, { s: 40 }); gsap.set(FT, { autoAlpha: 1 });
// frame 0: the fort star is blue (surrendered, hook-a); the rewind turns it red again
{ const fi = FT.querySelector(".fi"), fp = fi.querySelector("path"); gsap.set(fp, { attr: { fill: "#1f4fc4" } }); gsap.set(fi, { filter: "drop-shadow(0px 0px 4.8px #1f4fc4) drop-shadow(0px 3px 4px rgba(0,0,0,0.7))" });
  tl.to(fp, { attr: { fill: "#c4121f" }, duration: 0.6 }, 1.1); tl.to(fi, { filter: "drop-shadow(0px 0px 4.8px #c4121f) drop-shadow(0px 3px 4px rgba(0,0,0,0.7))", duration: 0.6 }, 1.1); }
const GR = [unitS("g1", "rome", [1320, 810], "infantry", ""), unitS("g2", "rome", [1440, 845], "infantry", ""), unitS("g3", "rome", [1545, 815], "infantry", ""),
  unitS("g4", "rome", [1482, 726], "artillery", "", { w: 44, h: 29 })];
GR.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));   // the garrison stays red (no grey units)
const UB = [unitS("uSm", "carth", [1270, 760], "infantry", "", { size: "XX" }), unitS("uWa", "carth", [1300, 870], "infantry", "", { size: "XX" }), unitS("uMc", "carth", [1450, 925], "infantry", "", { size: "XX" })];
UB.forEach((id) => gsap.set(B.units[id].el, { autoAlpha: 1 }));
const WF = pinS(GG.pin(`<svg width="40" height="54" viewBox="0 0 40 54" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.8))"><path d="M6 54 L6 2" stroke="#2a2420" stroke-width="3.5"/><path d="M7 3 C18 0 26 8 38 4 L38 24 C26 28 18 20 7 23 Z" fill="#fbfaf5" stroke="#2a2420" stroke-width="1.6"/></svg>`, FD[0] + 8, FD[1] - 48, {}));
gsap.set(WF, { autoAlpha: 1 });
const F3 = [flagS(FL.us, "", 1190, 905, 0, null), flagS(FL.csa, "", 1680, 760, 0, null)];
// =====================================================================================================================
// hook-3: "But a week is not how it looked..." -- the clock rolls back to dawn, 15 February
// =====================================================================================================================
SFX("ref:whoosh", 0.25);
tl.to(WF, { autoAlpha: 0, scale: 0.4, duration: 0.4 }, 0.5);
const RW = scr0(`<div style="font-family:Oswald;font-weight:700;font-size:64px;letter-spacing:0.2em;color:#f7f3ea;text-shadow:0 4px 14px #000">◀◀</div>`, "left:0;right:0;top:470px;display:flex;justify-content:center;");
tl.fromTo(RW, { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.1, immediateRender: false }, T_15 - 0.6); tl.to(RW, { autoAlpha: 0, duration: 0.2 }, T_15 + 0.1);
// the date scroll rolls back with ticks (16 -> 15 FEB on "the fifteenth of February"), DAWN on "At dawn"; never blank
tl.to(d16, { autoAlpha: 0, y: -14, duration: 0.3 }, T_15 - 0.35);
for (let k = 0; k < 3; k++) SFX("tick", T_15 - 0.6 + k * 0.13);
dateSet("15 FEBRUARY 1862", T_15 - 0.05, T_DAWN - 0.05);
dateSet("15 FEB 1862 · DAWN", T_DAWN, T_FEW - 0.05, 28);
// the units step back to their dawn places (rewind), McClernand's division (not named) shows its three brigades on the right
go("uSm", 0.6, 1.6, [1250, 772]); go("uWa", 0.6, 1.6, [1268, 880]);
const MC = [unitS("m1", "carth", [1340, 935], "infantry", "", { t: 2.0, size: "X" }), unitS("m2", "carth", [1420, 950], "infantry", "", { t: 2.1, size: "X" }),
  unitS("m3", "carth", [1505, 940], "infantry", "", { t: 2.2, size: "X" })];
go("uMc", 0.6, 1.4, [1420, 950]); B.hideUnits(["uMc"], 1.9, 0.3);
// the camera: hold, then push in on the Union right at dawn (the close look spreads from the centre); cool morning light
const CC = [1440, 905], SC = 2.7, KC = 1 / SC;
camTo(0, T_15 - 0.2, [1432, 815], 1.92, "sine.inOut");
camTo(T_15 - 0.2, T_BURST - T_15 + 0.2, CC, SC, "sine.inOut");
const TOD = todDiv("rgba(100,135,205,0.55)"); tl.to(TOD, { opacity: 0.45, duration: 1.4 }, T_DAWN - 0.2); tl.to(TOD, { opacity: 0, duration: 1.6 }, T_CMDR + 1.0);
const RF = front2(RING, SC, T_DAWN, { dur: 1.2, to: RING2, moveT: T_BURST + 0.2, moveDur: 2.6 });
// flags for the close-up, behind each side's lines
tl.to(F3, { autoAlpha: 0, duration: 0.35 }, T_DAWN + 0.05);   // one flag pair at a time (critic 2)
const F4 = [flagS(FL.us, "", 1230, 1000, T_DAWN + 0.5, T_CMDR - 0.2), flagS(FL.csa, "", 1530, 860, T_DAWN + 0.5, T_CMDR - 0.2)];
// the Confederate columns (the attack on the Union right; horse on the flank) -- no names: none spoken
const CP = [unitS("cP1", "rome", [1420, 872], "infantry", "", { t: T_DAWN - 0.4 }), unitS("cP2", "rome", [1500, 862], "infantry", "", { t: T_DAWN - 0.3 }),
  unitS("cF", "rome", [1565, 880], "infantry", "", { t: T_DAWN - 0.2 })];
cavIcon("cF");
B.hideUnits(["g2", "g3", "g4", "uSm"], T_DAWN - 0.4, 0.4);   // off the close-up frame / under the date scroll
B.hideUnits(["g1"], T_RODE, 0.4);
// "burst out of the fort": thin red arrows break out south, the columns follow; volleys where the lines touch (visible, no artillery)
const BA = [[[1420, 875], [1400, 945], [1350, 995]], [[1500, 868], [1490, 950], [1445, 1012]], [[1565, 885], [1568, 960], [1540, 1040]]];
BA.forEach((pts, k) => arw({ pts, side: "rome", t: T_BURST - 0.15 + k * 0.18, dur: 1.2, width: AW(SC, 9), until: T_ROAD + 0.2 }));
SFX("ref:whoosh", T_BURST - 0.15);
go("cP1", T_BURST, 3.0, [1395, 968]); go("cP2", T_BURST + 0.1, 3.0, [1480, 995]); go("cF", T_BURST + 0.2, 3.0, [1562, 1012]);
[[T_BURST + 0.2, [1395, 935], [1445, 950]], [T_BURST + 1.3, [1460, 945], [1515, 945]], [T_BROKE + 0.5, [1360, 965], [1405, 985]], [T_ROAD + 0.2, [1440, 1000], [1490, 1010]]]
  .forEach(([t, a, b]) => volley(a, b, t, 6, 0.9));
smoke([[1400, 938], [1425, 944], [1462, 946], [1500, 946]], T_BURST + 0.25, KC);
smoke([[1365, 968], [1400, 982], [1450, 1002]], T_BROKE + 0.55, KC);
// the ground the breakout takes = RED ink hatching ~3 s (Confederate gain), then it dissolves
hand("assets/media/gn_don_ctl_feb15acap_mx.png", T_BURST + 0.6, 3.0);
// "broken the Union right": the three brigades fall back west, BROKEN
// the brigades give way as the columns come (they move first, so red and blue never sit on each other)
go("m1", T_BURST + 0.3, 2.4, [1240, 950]); go("m2", T_BURST + 0.4, 2.4, [1272, 1000]); go("m3", T_BURST + 0.5, 2.6, [1318, 1040]);
sstamp("BROKEN", 205, T_BROKE + 0.15, { top: 180, size: 80, sub: "THE UNION RIGHT", until: T_ROAD - 0.15, shake: 5 });
pulse(T_BROKE + 0.35);
// "the road out stood open": focus + thin ink trace down the Forge road toward Nashville, a thin red arrow runs down it
glowPath(FORGE, "", 0, T_ROAD - 0.05, T_ROAD + 3.3);
boxL("THE ROAD OUT", 1610, 1030, T_ROAD, null, { size: 16 });
arw({ pts: FORGE.slice(2), side: "rome", t: T_OPEN, dur: 1.0, width: AW(SC, 8), until: T_CMDR + 1.0 });
// =====================================================================================================================
// "The Union commander was not even there": the "?" badge, the empty headquarters
// =====================================================================================================================
const CH = [1300, 800], SH = 2.15;
camTo(T_CMDR - 0.5, 1.4, CH, SH, "sine.inOut");
const QB = qBadge("THE UNION COMMANDER", "", T_CMDR + 0.05, T_AWAY + 0.2);
const F5 = [flagS(FL.us, "", 1110, 820, T_CMDR - 0.3, T_RODE + 0.2), flagS(FL.csa, "", 1455, 815, T_CMDR - 0.3, T_RODE + 0.2)];
const HQU = unitS("hq", "carth", HQ, "hq", "", { t: T_CMDR + 0.2 });
tl.to(B.units.hq.el, { autoAlpha: 0.35, duration: 0.5 }, T_NOT);
focus(HQ, 90, T_NOT, T_AWAY);
wstampL("NOT EVEN THERE", HQ[0], HQ[1] + 62, T_NOT + 0.05, T_AWAY - 0.1, null, 26);
// "away on a gunboat, in a conference with the admiral": up the river to the flagship; a small "?" marker sits on it
const CB = [1280, 565], SB = 2.0;
camTo(T_AWAY - 0.6, 1.5, CB, SB, "sine.inOut");
const FLG = [gunboat([[BOATP[0] - 8, BOATP[1] - 70], BOATP], T_AWAY - 0.7, 1.2, T_RODE + 2.5, { s: 17 }), gunboat([[BOATP[0] - 30, BOATP[1] - 150], [BOATP[0] - 22, BOATP[1] - 80]], T_AWAY - 0.6, 1.2, T_RODE + 2.5, { s: 15 })];
const QM = pinS(GG.pin(`<div style="width:54px;height:54px;border-radius:50%;background:radial-gradient(circle, rgba(10,12,24,0.95), rgba(10,12,24,0.8));border:4px solid #f3e7c4;box-shadow:0 0 0 3px #1f4fc4,0 6px 14px rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;font-family:Oswald;font-weight:700;font-size:34px;color:#f7f3ea">?</div>`, BOATP[0], BOATP[1] - 46, { t: T_AWAY + 0.05, pop: true, until: T_KNOTS + 1.2 }));
focus(BOATP, 70, T_AWAY + 0.1, T_RODE);
boxL("A GUNBOAT", BOATP[0] + 110, BOATP[1] + 8, T_AWAY + 0.2, T_ADM - 0.1, { size: 16 });
boxL("THE ADMIRAL", BOATP[0] + 115, BOATP[1] + 8, T_ADM, T_RODE - 0.1, { size: 16 });
// "when he rode back": the "?" rides back along the line to the broken right (thin solid trail that fades ~2 s after), the camera follows
const RIDE = [[BOATP[0], BOATP[1] - 46], [LAND[0], LAND[1] - 30], [1215, 640], [HQ[0] + 10, HQ[1] - 30], [1205, 800], [1250, 880], [1290, 915]];
pinAlong(QM, RIDE, T_RODE, T_KNOTS - T_RODE + 0.1, 24);
trail(RIDE.map(([x, y]) => [x, y + 46]), "#2c57b7", 0, T_RODE, T_KNOTS - T_RODE + 0.1, null);
SFX("ref:whoosh", T_RODE);
const CK = [1305, 930], SK = 2.55;
camTo(T_RODE + 0.2, T_KNOTS - T_RODE, CK, SK, "sine.inOut");
const F6 = [flagS(FL.us, "", 1150, 1010, T_RODE + 0.4, T_NAME - 1.0), flagS(FL.csa, "", 1450, 885, T_RODE + 0.4, S4 - 0.25)];
tl.to(F6[0], { autoAlpha: 0, duration: 0.3 }, S4 - 0.25);
tl.to(Object.values(B.units).map((u) => u.el), { autoAlpha: 0, duration: 0.3 }, S4 - 0.25);   // the map clears for the name slam (nothing under the big "?")
// "standing in knots, holding muskets": the broken brigades bunch up and stand (no units split into dots), focus on them
[["m1", [1262, 942]], ["m2", [1290, 972]], ["m3", [1318, 996]]].forEach(([id, p], k) => go(id, T_KNOTS - 0.2 + k * 0.08, 0.9, p));
tl.to(["m1", "m2", "m3"].map((id) => B.units[id].el), { autoAlpha: 0.55, duration: 0.5 }, T_MUSK);
["m1", "m2", "m3"].forEach((id, k) => tl.fromTo(B.units[id].el.querySelector(".blk"), { x: 0 }, { x: 2, duration: 0.09, yoyo: true, repeat: 5, immediateRender: false }, T_MUSK + k * 0.08));
focus([1290, 970], 80, T_KNOTS, T_NOAMMO + 0.2);
sstamp("NO AMMUNITION", 205, T_NOAMMO - 0.05, { size: 72, until: T_TONS - 0.15, shake: 5 });
pulse(T_NOAMMO + 0.2);
// "while tons of it lay close at hand": ammunition crates just behind the line (no glow), a short thin arrow toward the men
const CRATE = `<svg width="34" height="26" viewBox="0 0 34 26" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(0,0,0,.8))"><rect x="1" y="4" width="32" height="20" fill="#8a6a44" stroke="#2a2420" stroke-width="2"/><path d="M1 4 L33 24 M33 4 L1 24" stroke="#5a4428" stroke-width="1.6"/><rect x="1" y="1" width="32" height="5" fill="#a07c50" stroke="#2a2420" stroke-width="1.5"/></svg>`;
const CR = [[1190, 925], [1212, 950], [1182, 952], [1205, 975]];
CR.forEach(([x, y], k) => pinS(GG.pin(CRATE, x, y, { t: T_TONS + k * 0.1, pop: true, until: T_NAME - 1.0 })));
focus([1200, 950], 60, T_TONS + 0.1, S4 - 0.3);
sstamp("TONS OF IT", 205, T_TONS + 0.05, { size: 72, sub: "CLOSE AT HAND", until: S4 - 0.3, shake: 4 });
arw({ pts: [[1220, 945], [1240, 950], [1258, 955]], side: "carth", t: T_HAND, dur: 0.6, width: AW(SK, 7), until: T_NAME - 1.0 });
// =====================================================================================================================
// hook-4: the name slam (the "?" turns into the real photo)
// =====================================================================================================================
const DK = scr0("", "inset:0;background:rgba(5,7,13,0.62);");
tl.fromTo(DK, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, S4 - 0.2);
const BDG = scr0(`<div style="position:relative;width:300px;height:300px;border-radius:50%;overflow:hidden;border:9px solid #f3e7c4;box-shadow:0 0 0 7px #1f4fc4,0 24px 48px rgba(0,0,0,0.75);background:url(${FL.us}) center/cover">
  <img src="${PHOTO("grant")}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">
  <div class="q" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,1), rgba(10,12,24,0.94));font-family:Oswald;font-weight:700;font-size:180px;color:#f7f3ea">?</div></div>`,
  "left:810px;top:180px;transform-origin:50% 50%;");
tl.fromTo(BDG, { autoAlpha: 0, scale: 0.4, x: 520, y: -100 }, { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: 0.55, ease: "power3.out", immediateRender: false }, S4 - 0.1);
SFX("ref:whoosh", T_NAME - 0.5);
tl.to(BDG.querySelector(".q"), { autoAlpha: 0, duration: 0.15 }, T_NAME - 0.2);
const NAME = scr(`<div style="padding:12px 44px 14px;background:rgba(18,16,12,0.95);border-top:7px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:90px;letter-spacing:0.08em;line-height:1.1">ULYSSES S. GRANT</div></div>`,
  "left:0;right:0;top:520px;display:flex;justify-content:center;transform-origin:50% 40%;", T_NAME - 0.1, null, { autoAlpha: 0 });
slam(NAME, T_NAME - 0.1, { from: 1.9, shake: 6, until: T_FEW - 0.1 }); pulse(T_NAME + 0.15);
// "a few weeks earlier his own superior had brushed off his plan" (one big card at a time: the portrait leaves before the superior)
tl.to(BDG, { x: -560, y: 60, scale: 0.72, duration: 0.5, ease: "power3.inOut" }, T_FEW - 0.1);
tl.to(BDG, { autoAlpha: 0, duration: 0.3 }, T_SUP - 0.35);
dateSet("JANUARY 1862", T_FEW, T_TWO - 0.1);
const PLAN = scr(`<div style="position:relative;width:640px;height:400px;background:#ece3cc;border:2px solid #b9a77f;box-shadow:0 22px 46px rgba(0,0,0,.7);transform:rotate(-2deg);font-family:'Special Elite',monospace;color:#2a2420">
  <svg width="640" height="400" viewBox="0 0 640 400" style="position:absolute;left:0;top:0">
    <path d="M40 70 C160 60 260 80 360 70 C470 60 560 75 610 60" fill="none" stroke="#6f8fb5" stroke-width="7"/>
    <path d="M250 75 C245 150 230 220 238 300 C242 340 236 370 230 395" fill="none" stroke="#6f8fb5" stroke-width="6"/>
    <path d="M420 68 C430 140 470 190 520 240 C560 280 590 330 600 395" fill="none" stroke="#6f8fb5" stroke-width="6"/>
    <path class="a1" d="M250 90 C246 150 236 210 238 280" fill="none" stroke="#1f4fc4" stroke-width="5"/><path d="M226 270 L238 300 L252 270 Z" fill="#1f4fc4"/>
    <path class="a2" d="M425 85 C440 150 480 195 520 235" fill="none" stroke="#1f4fc4" stroke-width="5"/><path d="M503 236 L528 248 L522 220 Z" fill="#1f4fc4"/>
    <g fill="#c4121f" stroke="#2a2420" stroke-width="1.5"><path d="M238 205 l7 14 15 1 -11 10 4 15 -15 -8 -15 8 4 -15 -11 -10 15 -1 Z"/><path d="M462 182 l7 14 15 1 -11 10 4 15 -15 -8 -15 8 4 -15 -11 -10 15 -1 Z"/></g>
  </svg>
  <div class="tt" style="position:absolute;left:24px;top:330px;font-size:44px;letter-spacing:.06em">HIS PLAN</div></div>`,
  "left:640px;top:330px;", T_BRUSH - 0.25, T_TWO - 0.12, { autoAlpha: 0, x: 120 });
gsap.set(PLAN.querySelector(".tt"), { autoAlpha: 0 }); tl.to(PLAN.querySelector(".tt"), { autoAlpha: 1, duration: 0.2 }, T_PLAN - 0.05);
const BOFF = scr(stampHTML("BRUSHED OFF", "#f0e6c8", 66, 0), "left:800px;top:480px;transform-origin:50% 50%;", T_BRUSH, null, { autoAlpha: 0 });
slam(BOFF, T_BRUSH, { from: 1.6, shake: 5, until: T_TWO - 0.12 }); pulse(T_BRUSH + 0.2);
// "his own superior": an unnamed officer (no name is spoken, so no photo and no name plate)
const SUP = scr(`<div style="display:flex;align-items:center;gap:18px;flex-direction:row-reverse"><div style="position:relative;width:170px;height:170px;border-radius:50%;overflow:hidden;border:6px solid #f3e7c4;box-shadow:0 0 0 4px #1f4fc4,0 12px 26px rgba(0,0,0,0.6);background:radial-gradient(circle at 50% 40%, #3a4458, #10141c)">
  <svg width="170" height="170" viewBox="0 0 100 100" style="position:absolute;left:0;top:0"><circle cx="50" cy="40" r="17" fill="#0a0d13"/><path d="M14 100 C16 72 32 62 50 62 C68 62 84 72 86 100 Z" fill="#0a0d13"/><path d="M30 70 L36 64 M70 70 L64 64" stroke="#c9b48a" stroke-width="3"/></svg></div>
  <div style="padding:10px 20px 12px;background:rgba(18,16,12,0.9);border-right:6px solid #1f4fc4;color:#f7f3ea;font-weight:700;font-family:Oswald"><div style="font-size:34px;letter-spacing:0.06em;white-space:nowrap">HIS OWN SUPERIOR</div></div></div>`,
  "right:90px;top:330px;", T_SUP - 0.05, T_BRUSH - 0.3, { autoAlpha: 0, x: 80 });
// =====================================================================================================================
// the three snap cuts (whoosh + hit; a black frame hides each camera jump); Grant's portrait card on a stake at his own column in each
// =====================================================================================================================
const CUTB = scr0("", "inset:0;background:#030406;");
const cut = (t, lay, until, c, s, drift) => {
  tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  if (lay) { tl.set(lay, { autoAlpha: 1 }, t - 0.01); tl.set(lay, { autoAlpha: 0 }, until - 0.01); }
  camTo(t, 0.01, c, s); camTo(t + 0.02, until - t - 0.05, [c[0] + drift[0], c[1] + drift[1]], s * (drift[2] || 1.06), "sine.out");
  SFX("ref:whoosh", t - 0.2); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25); };
const T1 = T_TWO - 0.08, T2 = T_CITY - 0.08, T3 = T_MARCH - 0.08, T4 = T_THESE - 0.1;
tl.set([DK, BDG, PLAN, BOFF, SUP, RELIEF, RELIEF2], { autoAlpha: 0 }, T1 - 0.01);
// everything of the Donelson story leaves at the first cut
const S0 = snap(); tl.set([...S0].filter((e) => e.tagName.toLowerCase() !== "defs"), { autoAlpha: 0 }, T1 - 0.01);
tl.set(Object.values(B.units).map((u) => u.el), { autoAlpha: 0 }, T1 - 0.01);
// ---------- CUT 1: Fort Donelson · 1862 (henry_w): gunboats up both rivers, both forts blue, Grant's column marches between them ----------
const FHh = HP(36.515, -88.035), FDh = HP(36.4935, -87.861), S1c = 1.2, C1 = [(FHh[0] + FDh[0]) / 2 + 20, FDh[1] - 10];
cut(T1, LHE, T2, C1, S1c, [6, -4, 1.07]);
dateSet("FEBRUARY 1862", T1, T2 - 0.05);
const SC1 = snap();
[flagS(FL.us, "", (FHh[0] + FDh[0]) / 2 - 40, FHh[1] - 170, T1, T2), flagS(FL.csa, "", FDh[0] + 330, FDh[1] + 210, T1, T2)].forEach(vis(T1, T2));
[[FHh, [FHh[0] - 12, FHh[1] - 330]], [FDh, [FDh[0] - 60, FDh[1] - 320]]].forEach(([p, a], k) => {
  [0, 1].forEach((j) => { const el = gunboat([[a[0] + j * 6, a[1] - 60 - j * 40], [p[0] - 6 + j * 4, p[1] - 30 - j * 26]], T1 + j * 0.15, 1.3, T2 - 0.01, { s: 15 }); vis(T1, T2)(el); });
  vis(T1, T2)(fortIcon(p[0], p[1], null, null, { s: 36, side: "carth" })); });
const GC1 = unitS("gc1", "carth", [FHh[0] + 50, FHh[1] + 40], "infantry", "", { t: T1 }); vis(T1, T2)(B.units.gc1.el);
along("gc1", [[FHh[0] + 50, FHh[1] + 40], [(FHh[0] + FDh[0]) / 2, FHh[1] + 70], [FDh[0] - 70, FDh[1] + 30]], T1 + 0.1, T2 - T1 - 0.2, 12);
arw({ pts: [[FHh[0] + 60, FHh[1] + 50], [(FHh[0] + FDh[0]) / 2, FHh[1] + 80], [FDh[0] - 60, FDh[1] + 35]], side: "carth", t: T1 + 0.05, dur: 0.9, width: AW(S1c, 9), until: T2 - 0.01 });
pinPortrait("gc1", PHOTO("grant"), FL.us, "Grant", T1 + 0.15, T2 - 0.02, "right");
placeN(FDh, "Fort Donelson · 1862", 1, T_TWO + 0.3, T2 - 0.01, "r");
endScope(SC1, T2);
// ---------- CUT 2: Vicksburg · 1863 (vicksburg_siege_w, night): the gunboats run past the bluff batteries ----------
const VKS = VP(32.3526, -90.8779), S2c = 1.5, RUN = GD.vrun;   // the run on the river as drawn on the map (tools/gh_inline.py)
const C2 = [VKS[0] - 70, VKS[1] + 10];
cut(T2, LVK, T3, C2, S2c, [-8, 10, 1.06]);
dateSet("APRIL 1863", T2, T3 - 0.05);
const SC2 = snap();
const NW = scr0("", "inset:0;background:rgba(6,10,30,0.5);"); vis(T2, T3)(NW);
[flagS(FL.us, "", RUN[20][0] - 300, RUN[20][1] + 40, T2, T3), flagS(FL.csa, "", VKS[0] + 260, VKS[1] - 40, T2, T3)].forEach(vis(T2, T3));
town("", VKS, "r", T2, { until: T3 - 0.01 });
[0, 1, 2].forEach((k) => { const el = gunboat(sub(RUN, 0.18 + k * 0.08, 0.66 + k * 0.08), T2 + k * 0.25, T3 - T2 - 0.3, T3 - 0.01, { s: 19 }); vis(T2, T3)(el); });
const BAT = [[VKS[0] + 70, VKS[1] - 50], [VKS[0] + 80, VKS[1] + 60]];
BAT.forEach((p, k) => { unitS("bat" + k, "rome", p, "artillery", "", { t: T2, w: 44, h: 29 }); vis(T2, T3)(B.units["bat" + k].el); });
shoot(BAT[0], posOn(RUN, 0.42), T2 + 0.5, { r: 10 / S2c, h: 30, width: 1.6 / S2c, dur: 0.6 });
shoot(BAT[1], posOn(RUN, 0.6), T_MISS + 0.1, { r: 10 / S2c, h: 30, width: 1.6 / S2c, dur: 0.6 });
smoke([[BAT[0][0] - 6, BAT[0][1]], [BAT[1][0] - 6, BAT[1][1]]], T2 + 0.55, 1 / S2c);
// Grant's army marches south down the west (Louisiana) bank to meet the boats below the city
const GW = [[RUN[6][0] - 260, RUN[6][1] + 60], [RUN[30][0] - 230, RUN[30][1]], [RUN[56][0] - 200, RUN[56][1]]];
unitS("gc2", "carth", GW[0], "infantry", "", { t: T2 }); vis(T2, T3)(B.units.gc2.el); along("gc2", GW, T2 + 0.1, T3 - T2 - 0.2, 12);
arw({ pts: GW, side: "carth", t: T2 + 0.05, dur: 1.2, width: AW(S2c, 9), until: T3 - 0.01 });
pinPortrait("gc2", PHOTO("grant"), FL.us, "Grant", T2 + 0.15, T3 - 0.02, "left");
placeN(VKS, "Vicksburg · 1863", 2, T_MISS, T3 - 0.01, "r");
endScope(SC2, T3);
// ---------- CUT 3: James River · 1864 (jamesriver_w): the pontoon bridge, Lee's army facing the other way ----------
// the bridge: Weyanoke Point (the tip of the north-bank peninsula) -> Windmill Point (south bank), traced on the jamesriver relief (map px)
const WEY = [1402, 874], WIN = [1414, 940], S3c = 1.2, S3b = 2.4;
const LEEP = JP(37.41, -77.25), C3 = [LEEP[0] + 240, LEEP[1] + 230], C3b = [1412, 880];
// close on the bridge first ("marched a whole army across a river"), then pull back to show Lee ("while Robert E. Lee...")
tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, T3 - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, T3 + 0.04);
tl.set(LJA, { autoAlpha: 1 }, T3 - 0.01);
camTo(T3, 0.01, C3b, S3b); camTo(T3 + 0.02, T_LEE - 0.7 - T3, [C3b[0], C3b[1] + 15], S3b * 1.06, "sine.out");
camTo(T_LEE - 0.6, 1.3, C3, S3c, "power2.inOut"); camTo(T_LEE + 0.75, T4 - T_LEE, [C3[0] - 10, C3[1] - 8], S3c * 1.03, "sine.out");
SFX("ref:whoosh", T3 - 0.2); SFX("hit", T3 + 0.02); K.shake(T3 + 0.02, 3, 0.25);
dateSet("JUNE 1864", T3, null);
[flagS(FL.us35, "", WEY[0] + 140, WEY[1] - 95, T3, null), flagS(FL.csa, "", WIN[0] - 60, WIN[1] + 95, T3, T_LEE - 0.4)].forEach(vis(T3, null));   // the south bank was still Confederate country
flagS(FL.csa, "", LEEP[0] - 230, LEEP[1] + 40, T_LEE - 0.6, null);
// the pontoon bridge: a plank line with a dark casing (solid, no glow)
const BR = document.createElementNS(NS, "g");
BR.innerHTML = `<path d="M${WEY.join(" ")} L${WIN.join(" ")}" stroke="#2a2420" stroke-width="${(7 / S3b).toFixed(2)}" stroke-linecap="round"/><path d="M${WEY.join(" ")} L${WIN.join(" ")}" stroke="#d9c79d" stroke-width="${(4 / S3b).toFixed(2)}" stroke-linecap="round"/>`;
OVL.appendChild(BR); vis(T3, null)(BR);
const XR = [[1470, 700], [1440, 780], [1412, 840], WEY, WIN, [1418, 975]];
// three columns spaced along the march (constant gap, never stacked): column k runs from f = 0.36 - 0.18k to f = 1 - 0.18k
[0, 1, 2].forEach((k) => { const pts = sub(XR, 0.36 - 0.18 * k, 1 - 0.18 * k, 24), id = unitS("j" + k, "carth", pts[0], "infantry", "", { t: T3 + 0.05 * k }); along(id, pts, T3 + 0.1, 4.2, 24); });
arw({ pts: XR, side: "carth", t: T3 + 0.2, dur: 1.4, width: AW(S3b, 9), until: T_LEE - 0.5 });
arw({ pts: XR, side: "carth", t: T_LEE - 0.4, dur: 0.01, width: AW(S3c, 9), until: null });
pinPortrait("j2", PHOTO("grant"), FL.us35, "Grant", T3 + 0.3, T4 - 0.1, "right");   // on the last column, card beside the march (clear of the arrow)
placeN([(WEY[0] + WIN[0]) / 2 - 75, (WEY[1] + WIN[1]) / 2 + 10], "James River · 1864", 3, T_ACROSS, T_ACROSS + 2.4, "l");   // west of the bridge, clear of the columns and Grant's card
// Lee (his portrait card on a stake at his own army, on his name) and his army, facing the other way (north, toward Richmond)
const LR = [unitS("l0", "rome", LEEP, "infantry", "", { t: T3 + 0.1, until: T4 }), unitS("l1", "rome", [LEEP[0] + 120, LEEP[1] - 30], "infantry", "", { t: T3 + 0.2, until: T4 })];
pinPortrait("l0", PHOTO("lee"), FL.csa, "Lee", T_LEE - 0.05, T4 - 0.1, "left");
[[LEEP, [LEEP[0] - 40, LEEP[1] - 200]], [[LEEP[0] + 120, LEEP[1] - 30], [LEEP[0] + 110, LEEP[1] - 230]]].forEach(([a, b], k) => arw({ pts: [a, [b[0], a[1] - 110]], side: "rome", t: T_OTHER + k * 0.15, dur: 0.7, width: AW(S3c, 9), until: T4 }));
wstampL("LOOKING THE OTHER WAY", LEEP[0] + 170, LEEP[1] + 90, T_OTHER + 0.1, T4 - 0.1, null, 26);
// =====================================================================================================================
// the title (riser + boom): the James River shot dims at the top, the title card sits below the date scroll
// =====================================================================================================================
SFX("ref:riser", T4 + 0.1);
const TDIM = scr0("", "inset:0;background:linear-gradient(0deg,rgba(5,7,13,0.25) 0%,rgba(5,7,13,0.75) 70%);");
tl.fromTo(TDIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, T4);
const TITLE = scr0(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">ULYSSES S. GRANT'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:28px;letter-spacing:0.3em;color:#ffd54a;margin-top:8px">1 TWO RIVERS · 2 THE MISSISSIPPI · 3 ACROSS A RIVER</div></div>`, "left:0;right:0;top:230px;display:flex;justify-content:center;");
tl.fromTo(TITLE, { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power4.in", immediateRender: false }, T_GREAT - 0.26);
SFX("ref:boom", T_GREAT); K.shake(T_GREAT, 6, 0.4);
B.finish();
