// HOOK v2 (hook-1 .. hook-2), Gavin #7. Basemap nijmegen (z15) + water mask (the Waal). Follows STYLE_LOCK 1a (Rokossovsky hook v2 beats)
// in the current Gavin look (parchment relief, counters, tracers, flags, territory). v1 kept in scenes-src/old/hook_v1.js.
// hook-1: frame 0 = 26 blue boats already pushing off the south bank, red guns + MG nests on the north bank, flags, territory + front;
//         BIG card slams in at 0.3 s and ticks 0 -> 260 PARATROOPERS, 26 CANVAS BOATS; tracers + water impacts every ~1.5 s;
//         "paddles": hard zoom-whoosh DIVE onto the river, NOT ENOUGH PADDLES; ROWING WITH RIFLES; "Half": boats grey out in 3 waves;
//         "they took the bridge": boats hit the north bank, arrows to both bridges, THEY TOOK THE BRIDGE (boom + hit).
// hook-2: WHITE-FLASH cut (evening): north end of the road bridge turns blue, British tanks roll across, BEFORE DARK; zoom-out whoosh to
//         a wide Europe map (assets/media/europe_relief.jpg + europe_ctl_sep44.png, its own layer inside this scene) with three rings:
//         THE BRIDGE TAKEN (Holland), TIGER TANKS STOPPED (Sicily), THE CAUSEWAY HELD (Normandy).
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const tl = B.tl, scene = document.getElementById("scene"), worldEl = document.getElementById("world");
const US = "assets/media/us_flag_48star.png", UK = "assets/media/uk_flag.png", REICH = "assets/media/ger_reich_flag.png";
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
const sstamp = (txt, css, t, o = {}) => slam(scr(stampHTML(txt, o.color || "#e3232f", o.size || 56, o.rot || -4, o.sub), css), t, o);
const flag = (src, name, x, y, t, until, w = 85) => { const el = GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${Math.round(w * 0.05)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(1, Math.round(w / 40))}px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${Math.round(w * 0.24)}px;color:#f7f3ea;text-shadow:0 2px 4px #000;letter-spacing:0.08em">${name}</div></div>`, x, y, { t: t === 0 ? null : t, pop: true, until }); if (t === 0) gsap.set(el, { autoAlpha: 1 }); return el; };
const legendHTML = (rows) => `<div style="display:flex;gap:26px;font-size:21px;letter-spacing:0.1em;align-items:center">${rows.map(([c, nm]) => `<span><b style="display:inline-block;width:20px;height:20px;background:${c};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`;
const legend = (rows, t, until) => {
  if (t > 0) { const c = GG.card(legendHTML(rows), "", 34, t, until); c.querySelector(".inner").style.cssText += "padding:12px 30px 14px;"; return c; }
  const el = document.createElement("div"); el.className = "gg-card"; el.style.top = "34px"; el.innerHTML = `<div class="inner" style="padding:12px 30px 14px">${legendHTML(rows)}</div>`;
  scene.insertBefore(el, document.getElementById("credit")); if (until != null) GG.fadeOut(el, until, 0.4); return el;
};
const date0 = (text, until) => { const d = document.createElement("div"); d.className = "d"; d.textContent = text; d.style.fontSize = "34px"; document.getElementById("date").appendChild(d); if (until != null) tl.to(d, { autoAlpha: 0, y: -14, duration: 0.3 }, until); };
const unit0 = (id, side, x, y, icon, flagKey, o = {}) => {   // counter on screen from frame 0 (or popped in at o.t)
  B.unit({ id, side, x, y, w: o.w || 34, h: o.h || 23, label: o.label, t: o.t });
  K.counter(id, { icon, flag: flagKey, size: o.size });
  const tg = B.units[id].el.querySelector(".tag"); if (tg) tg.style.fontSize = (o.tag || 14) + "px";
  if (o.t == null) gsap.set(B.units[id].el, { autoAlpha: 1 });
  return id;
};
// camera with explicit eases (hard dive, snap, pull-out)
const CW = 1920, CH = 1080, cam = { cx: 1250, cy: 640, s: 1.35 };
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const applyCam = () => { const s = Math.max(cam.s, CW / 2880), cx = clamp(cam.cx, CW / 2 / s, 2880 - CW / 2 / s), cy = clamp(cam.cy, CH / 2 / s, 1620 - CH / 2 / s); gsap.set(worldEl, { x: CW / 2 - cx * s, y: CH / 2 - cy * s, scale: s }); };
applyCam();
const camTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(cam, { cx, cy, s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
// ---------- times (all from the spoken words) ----------
const H1 = "hook-1", H2 = "hook-2";
const T_PARA = at(H1, "paratroopers"), T_26 = at(H1, "Twenty-six"), T_NOT = at(H1, "Not enough"), T_PAD = at(H1, "paddles"), T_RIFLE = at(H1, "rifle butts");
const T_HALF = at(H1, "Half"), T_NEVER = at(H1, "never reached"), T_FAR = at(H1, "far bank"), T_BUT = at(H1, "But before"), T_TOOK = at(H1, "they took"), T_BRIDGE = at(H1, "the bridge.");
const S2 = PS(H2), T_ROLLED = at(H2, "rolled"), T_GREAT = at(H2, "great bridge"), T_NIJ = at(H2, "Nijmegen"), T_GEN = at(H2, "And the general"), T_ALREADY = at(H2, "had already");
const T_STOP = at(H2, "stopped"), T_TIGER = at(H2, "Tiger"), T_WITHP = at(H2, "with paratroopers"), T_HELD = at(H2, "and held"), T_CAUSE = at(H2, "causeway");
// ---------- the map: water, grid, bridges, labels ----------
GG.water("assets/nijmegen_water.png", 0, { alpha: 0.85 });
K.grid(GG.proj(15, 4329295, 2775666), 51.83, 51.875, 5.80, 5.93, 0.01, 0);
const RAIL_N = [1382, 690], RAIL_S = [1400, 818], ROAD_N = [1744, 752], ROAD_S = [1760, 912];
GG.road([RAIL_N, RAIL_S], { w: 7 }); GG.road([ROAD_N, ROAD_S], { w: 10 });
const lbl0 = (txt, x, y, o = {}) => { const el = GG.lbl(txt, x, y, o); gsap.set(el, { autoAlpha: 1 }); if (o.until0 != null) GG.fadeOut(el, o.until0, 0.3); return el; };
lbl0("RAILWAY BRIDGE", RAIL_S[0] + 18, RAIL_S[1] + 26, { size: 17, anchor: [0, -50] });
lbl0("ROAD BRIDGE", ROAD_S[0] + 22, ROAD_S[1] + 24, { size: 21, color: "#fff6d8", anchor: [0, -50] });
B.label("THE WAAL", 985, 430, { cls: "river", size: 32, rot: 52, t: 0, instant: true });
lbl0("NIJMEGEN", 1900, 1110, { size: 30 });
lbl0("LENT", 1660, 520, { size: 20 });
// territory (option 1 tint, drawn outward from each bank so the water stays clear) + the two-colour front along the river
const NB = [[500, 12], [600, 72], [700, 137], [800, 190], [900, 205], [1000, 300], [1100, 482], [1200, 558], [1300, 647], [1400, 710], [1500, 731], [1600, 767], [1700, 781], [1800, 752], [1900, 694], [2000, 522], [2100, 321], [2200, 176], [2300, 87], [2400, 37], [2500, 6]];
const SB = [[600, 235], [700, 286], [800, 371], [900, 485], [1000, 567], [1100, 632], [1200, 701], [1300, 766], [1400, 833], [1500, 867], [1600, 882], [1700, 902], [1800, 915], [1900, 880], [2000, 783], [2100, 596], [2200, 416], [2300, 299], [2400, 202], [2500, 141], [2600, 107], [2700, 74], [2800, 48]];
const RIVER_C = [[450, 40], [600, 150], [700, 211], [800, 298], [900, 345], [1000, 425], [1100, 557], [1200, 630], [1300, 706], [1400, 771], [1500, 799], [1600, 824], [1700, 841], [1800, 833], [1900, 787], [2000, 652], [2100, 458], [2200, 296], [2300, 193], [2400, 120], [2500, 73], [2650, 30], [2900, 0]];
K.frontTint({ pts: NB, dir: -1, color: "#be3a2a", alpha: 0.46, depth: 300, soft: 24, t: 0, dur: 0.01 });
K.frontTint({ pts: SB, dir: 1, color: "#2e5cb2", alpha: 0.46, depth: 300, soft: 24, t: 0, dur: 0.01 });
K.front({ pts: RIVER_C, sideA: "rome", sideB: "carth", t: 0, dur: 0.01, width: 15, glow: 0.47, until: T_GEN + 0.6 });
// flags + legend + date, all up at frame 0
const FUS = flag(US, "USA", 930, 900, 0, T_PAD - 0.3);
const FDE = flag(REICH, "GERMANY", 1420, 400, 0, T_PAD - 0.3);
const LEG = legend([["#2e5cb2", "ALLIES"], ["#be3a2a", "GERMANS"]], 0, T_GEN + 0.3);
date0("20 SEPTEMBER 1944", S2 + 0.05);
// ---------- units at frame 0 ----------
// German guns and MG nests on the north bank
const RED = [["r1", 1230, 470, "artillery", null], ["r6", 1170, 520, "infantry", "MG"], ["r2", 1320, 585, "infantry", "MG"], ["r3", 1455, 655, "infantry", "MG"],
  ["r4", 1600, 700, "aa", null], ["r5", 1790, 690, "artillery", null]];
RED.forEach(([id, x, y, icon, lab]) => unit0(id, "rome", x, y, icon, "ger", { label: lab, tag: 13 }));
// 26 canvas boats: two rows along the south bank, ALREADY pushing off at frame 0
const sEdge = (x) => { for (let i = 1; i < SB.length; i++) if (x <= SB[i][0]) { const a = SB[i - 1], b = SB[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return 0; };
const boatSVG = `<svg width="26" height="14" viewBox="0 0 30 16" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.6))"><path d="M1 3 L29 3 L24 14 L6 14 Z" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2"/></svg>`;
const PERP = [0.82, -0.57], T_LAND = T_TOOK - 0.3;   // across the Waal (perpendicular to the flow); boats land just before "they took"
const BOATS = [];
for (let r = 0; r < 2; r++) for (let j = 0; j < 13; j++) {
  const x = 1090 + j * 20 + r * 10, y = sEdge(x) + 16 + r * 26, L = 175 + r * 26;
  const el = GG.pin(boatSVG, x, y); gsap.set(el, { autoAlpha: 1, rotation: -35 });
  BOATS.push({ el, x, y, dx: PERP[0] * L, dy: PERP[1] * L, i: BOATS.length });
}
// waves that never reach the far bank ("Half the boats"): 13 of 26, three waves
const WAVES = [[T_HALF + 0.15, [1, 4, 8, 14, 19]], [T_NEVER + 0.15, [2, 6, 11, 16]], [T_FAR + 0.1, [9, 17, 21, 24]]];
const lost = {}; WAVES.forEach(([t, ids]) => ids.forEach((k) => { lost[k] = t; }));
BOATS.forEach((b) => {
  const tEnd = lost[b.i] != null ? lost[b.i] : T_LAND, f = tEnd / T_LAND, wob = (b.i % 3) * 0.12;
  tl.to(b.el, { x: b.dx * f, y: b.dy * f, duration: tEnd, ease: "none" }, 0);
  tl.to(b.el.querySelector("svg"), { rotation: (b.i % 2 ? 6 : -6), duration: 0.6, yoyo: true, repeat: Math.floor(tEnd / 0.6), ease: "sine.inOut" }, wob);   // rowing wobble
  if (lost[b.i] != null) {   // hit: greys, drifts downstream (the Waal flows west)
    tl.to(b.el.querySelector("path"), { attr: { fill: "#77746c" }, duration: 0.25 }, tEnd);
    tl.to(b.el, { x: b.dx * f - 46, y: b.dy * f - 26, opacity: 0.5, duration: 3.0, ease: "power1.out" }, tEnd + 0.05);
    tl.to(b.el, { autoAlpha: 0, duration: 0.6 }, S2 - 0.3);
  }
});
WAVES.forEach(([t, ids]) => { ids.forEach((k, n) => { const b = BOATS[k], f = t / T_LAND; K.impact(b.x + b.dx * f, b.y + b.dy * f, t - 0.05 + n * 0.08, { r: 13, puffs: 2, shake: n ? false : 4, sfx: n ? false : "impact" }); }); SFX("hit", t + 0.05); });
// ---------- the guns fire from the first second: tracers + shells in the water (shake) every ~1.5 s ----------
const boatAt = (k, t) => { const b = BOATS[k], f = Math.min(t, lost[k] != null ? lost[k] : T_LAND) / T_LAND; return [b.x + b.dx * f, b.y + b.dy * f]; };
const GUNS = { r1: [1230, 470], r6: [1170, 520], r2: [1320, 585], r3: [1455, 655] };
[0.25, 0.9, 1.6].forEach((t, k) => K.gun(...GUNS[["r1", "r2", "r3"][k]], t, { unit: ["r1", "r2", "r3"][k], sfx: k ? false : "fire" }));
const tracer = (from, k, t) => { const [x, y] = boatAt(k, t + 0.35); GG.arc(from[0], from[1], x + 6, y - 4, t, { h: 0, color: "#ff6a5a", dash: "10 7", width: 3, dur: 0.35, until: t + 0.7 }); };
const SHOTS = [1.0, 2.5, 4.0, 5.6, 7.0, 8.5, 10.0, 11.3];
SHOTS.forEach((t, n) => {
  const g = ["r6", "r2", "r3", "r2"][n % 4];
  tracer(GUNS[g], [3, 10, 17, 22, 7, 13, 0, 25][n], t); tracer(GUNS[g], [5, 12, 20, 15, 23, 18, 3, 12][n], t + 0.15);
  K.gun(...GUNS[g], t, { unit: g, sfx: false }); SFX("mg", t);
  const [x, y] = boatAt([7, 15, 0, 25, 10, 5, 20, 3][n], t + 0.5);
  K.impact(x - 20 + (n % 3) * 18, y - 18 + (n % 2) * 30, t + 0.5, { r: 12, puffs: 2, shake: 3 });   // shell into the water, near the boats
});
// ---------- the BIG card: slams in at 0.3 s, ticks 0 -> 260 PARATROOPERS, then 26 CANVAS BOATS ----------
const BIG = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:12px 50px 16px;background:rgba(14,12,10,0.88);border-top:8px solid #6f9bff;box-shadow:0 22px 44px rgba(0,0,0,.6)">
  <div class="n" style="font-size:140px;line-height:1;color:#f7f3ea;letter-spacing:0.02em">0</div>
  <div style="font-size:38px;letter-spacing:0.26em;color:#9fc0ff;margin-top:2px">PARATROOPERS</div>
  <div class="b" style="font-size:44px;letter-spacing:0.16em;color:#f7f3ea;margin-top:8px;border-top:2px solid rgba(201,180,138,0.5);padding-top:6px">26 CANVAS BOATS</div></div>`,
  "left:70px;top:210px;transform-origin:30% 40%;");
slam(BIG, 0.3, { from: 1.9, dur: 0.22, shake: 6 });
const cv = { v: 0 }, cn = BIG.querySelector(".n"), T_C0 = 0.55, T_C1 = T_PARA + 0.35;
tl.to(cv, { v: 260, duration: T_C1 - T_C0, ease: "power2.out", onUpdate: () => { cn.textContent = Math.round(cv.v); } }, T_C0);
for (let t = T_C0; t < T_C1 - 0.05; t += 0.14) SFX("tick", t);
const BL = BIG.querySelector(".b"); gsap.set(BL, { autoAlpha: 0 });
tl.fromTo(BL, { autoAlpha: 0, scale: 1.8 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power4.in" }, T_26 + 0.15);
SFX("hit", T_26 + 0.33); K.shake(T_26 + 0.33, 3, 0.25);
tl.to(BIG, { autoAlpha: 0, y: -40, duration: 0.3, ease: "power2.in" }, T_PAD - 0.45);
// ---------- camera: slow push from frame 0, hard zoom-whoosh DIVE onto the river on "paddles" ----------
camTo(0, T_PAD - 0.35, 1240, 630, 1.45);
SFX("whoosh", T_PAD - 0.4);
camTo(T_PAD - 0.35, 0.7, 1280, 660, 2.5, "expo.inOut");
camTo(T_PAD + 0.37, T_BUT - T_PAD - 0.4, 1320, 625, 2.3, "sine.inOut");                 // drift with the boats
camTo(T_BUT - 0.05, 1.0, 1440, 680, 1.3, "power2.inOut");                                // pull back: both bridges in view
camTo(T_BUT + 1.0, S2 - T_BUT - 1.05, 1450, 690, 1.36, "none");
// stamps on the punchlines
const PAD = sstamp("NOT ENOUGH PADDLES", "left:0;right:0;top:150px;display:flex;justify-content:center;", T_PAD + 0.3, { size: 58, rot: -4, shake: 5, until: T_RIFLE - 0.2 });
sstamp("ROWING WITH RIFLES", "left:0;right:0;top:770px;display:flex;justify-content:center;", T_RIFLE - 0.05, { size: 58, rot: 3, shake: 5, until: T_HALF + 0.05 });
B.caption("HALF THE BOATS NEVER REACHED THE FAR BANK", T_HALF + 0.05, T_BUT - 0.1, "rome r");
// ---------- "they took the bridge": the boats hit the north bank, the paratroopers push along it to both bridges ----------
const LANDX = [1300, 560];
K.target(1290, 545, T_LAND + 0.05, { r: 46, side: "carth", until: S2 - 0.2 });
B.arrow({ pts: [[1290, 560], [1345, 620], [1376, 676]], side: "carth", t: T_LAND + 0.2, dur: 0.6, width: 11, until: S2 - 0.1 });
B.arrow({ pts: [[1320, 552], [1500, 610], [1640, 670], [1730, 728]], side: "carth", t: T_LAND + 0.35, dur: 0.9, width: 13, until: S2 - 0.1 });
B.grey(["r6", "r2", "r1"], T_LAND + 0.2, 0.3); B.grey(["r3", "r4", "r5"], T_TOOK + 0.5, 0.3);
K.impact(1455, 655, T_TOOK + 0.35, { r: 14, shake: false }); K.impact(1790, 690, T_TOOK + 0.55, { r: 16, shake: false, sfx: false });
sstamp("THEY TOOK THE BRIDGE", "left:0;right:0;top:800px;display:flex;justify-content:center;", T_BRIDGE - 0.05, { size: 64, rot: -3, shake: 7, boom: true, until: S2 - 0.15 });
B.hideUnits(["r6", "r2", "r1", "r3", "r4", "r5"], S2, 0.05);
// =====================================================================================================================
// hook-2: WHITE-FLASH cut to the evening: the north end of the road bridge, British tanks roll across
// =====================================================================================================================
GG.whiteFlash(S2 - 0.05); SFX("whoosh", S2 - 0.25); SFX("hit", S2 + 0.03);
camTo(S2, 0.01, 1760, 800, 1.75);
camTo(S2 + 0.02, T_GEN - S2 - 0.4, 1740, 790, 1.95, "sine.inOut");
GG.layer("background: linear-gradient(to left, rgba(255,140,60,0.34), rgba(120,60,90,0.2) 55%, rgba(30,30,70,0.16));", S2 - 0.05, null, { dur: 0.2 });
B.date("20 SEPT 1944 · EVENING", S2 + 0.05, T_GEN + 0.3, 30);
BOATS.forEach((b) => tl.to(b.el, { autoAlpha: 0, duration: 0.05 }, S2));
// the north end of the road bridge turns blue
const NORTHEND = K.territory({ pts: [[1560, 600], [1700, 560], [1880, 600], [1930, 700], [1860, 770], [1740, 760], [1610, 740], [1540, 680]], side: "#2e5cb2", alpha: 0.62, t: S2 + 0.1, dur: 0.5, soft: 14 });
tl.to(NORTHEND, { opacity: 0.25, duration: 0.15, yoyo: true, repeat: 3 }, S2 + 0.65);
unit0("pn", "carth", ROAD_N[0] - 6, ROAD_N[1] - 46, "infantry", "us", { w: 38, h: 26, label: "US PARATROOPERS", tag: 15, size: "II", t: S2 + 0.25 });
K.target(ROAD_N[0], ROAD_N[1] + 6, S2 + 0.3, { r: 44, side: "carth", until: T_GEN });
const FUK = flag(UK, "BRITAIN", 1960, 990, S2 + 0.4, T_GEN - 0.1, 70);
const FUS2 = flag(US, "USA", 1560, 630, S2 + 0.45, T_GEN - 0.1, 70);
// British tanks roll across the great bridge
["tk1", "tk2", "tk3"].forEach((id, i) => {
  unit0(id, "carth", ROAD_S[0] + 4, ROAD_S[1] + 70 + i * 34, "tank", "uk", { w: 38, h: 24, label: i ? null : "BRITISH TANKS", tag: 15, t: S2 + 0.2 + i * 0.12 });
  B.move(id, T_ROLLED - 0.2 + i * 0.5, 2.6, ROAD_N[0] + 30 + i * 4, ROAD_N[1] - 90 - i * 32, "power1.inOut");
});
B.highlight([ROAD_S, ROAD_N], T_GREAT - 0.2, null, 36);
sstamp("BEFORE DARK", "left:0;right:0;top:820px;display:flex;justify-content:center;", T_ROLLED + 0.55, { size: 70, rot: -4, shake: 6, boom: true, until: T_GEN - 0.15 });
const NIJ = GG.tagbox("THE NIJMEGEN ROAD BRIDGE", ROAD_N[0] + 70, ROAD_N[1] + 60, "#1f4fc4", { size: 22, t: T_NIJ - 0.25, until: T_GEN - 0.1, anchor: [0, -50] });
SFX("hit", T_NIJ - 0.1);
// =====================================================================================================================
// zoom-out whoosh to the wide Europe map (own layer: relief + Sept 1944 control map, flags, three rings)
// =====================================================================================================================
const PR = GG.proj(6, 7093, 5051);
const EU = document.createElement("div"); EU.style.cssText = "position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden;background:#86a9c9;";
const EUW = document.createElement("div"); EUW.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;transform-origin:0 0;";
EUW.innerHTML = `<img src="assets/media/europe_relief.jpg" alt="" style="position:absolute;left:0;top:0;width:2880px;height:1620px"><img src="assets/media/europe_ctl_sep44.png" alt="" style="position:absolute;left:0;top:0;width:2880px;height:1620px">`;
EU.appendChild(EUW); scene.insertBefore(EU, document.getElementById("fx")); GG.hide(EU);
const ecam = { cx: 1366, cy: 373, s: 9 };
const applyE = () => gsap.set(EUW, { x: CW / 2 - ecam.cx * ecam.s, y: CH / 2 - ecam.cy * ecam.s, scale: ecam.s });
applyE();
const eTo = (t, dur, cx, cy, s, ease = "sine.inOut") => tl.to(ecam, { cx, cy, s, duration: dur, ease, onUpdate: applyE }, t);
const epin = (html, lat, lon, t, o = {}) => { const [x, y] = PR(lat, lon); const el = document.createElement("div"); el.style.cssText = `position:absolute;left:${x + (o.dx || 0)}px;top:${y + (o.dy || 0)}px;`; el.innerHTML = html; EUW.appendChild(el);
  gsap.set(el, { xPercent: o.anchor ? o.anchor[0] : -50, yPercent: o.anchor ? o.anchor[1] : -50 }); GG.hide(el);
  if (t != null) tl.fromTo(el, { autoAlpha: 0, scale: o.pop ? 0.3 : 1 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: o.pop ? "back.out(2.2)" : "power2.out" }, t); return el; };
const T_ZO = T_GEN - 0.3;
SFX("whoosh", T_ZO - 0.15);
camTo(T_ZO - 0.1, 0.45, 1740, 790, 0.7, "expo.in");                 // the Nijmegen map rushes away ...
tl.fromTo(EU, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, T_ZO + 0.15);
eTo(T_ZO + 0.15, 1.0, 1400, 820, 0.9, "expo.out");                   // ... and the Europe map pulls back from Nijmegen to the whole theatre
eTo(T_ZO + 1.17, END - T_ZO - 1.2, 1400, 830, 0.95, "none");
legend([["#2e5cb2", "ALLIES"], ["#be3a2a", "AXIS"], ["#807c72", "NEUTRAL"]], T_ZO + 0.6, null);
B.date("1943 – 1944", T_GEN + 0.35, null, 36);
const eflag = (src, name, lat, lon, t, w = 120) => epin(`<div style="display:flex;flex-direction:column;align-items:center;gap:6px"><img src="${src}" style="width:${w}px;display:block;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div style="font-family:Oswald;font-weight:700;font-size:${Math.round(w * 0.22)}px;color:#f7f3ea;text-shadow:0 2px 4px #000;letter-spacing:0.08em">${name}</div></div>`, lat, lon, t, { pop: true });
eflag(REICH, "GERMANY", 50.6, 11.8, T_ZO + 0.7); eflag(UK, "BRITAIN", 52.6, -1.6, T_ZO + 0.8);
// ring: pulsing circle + parachute + label with a US flag chip (Gavin's paratroopers)
const ring = (lat, lon, n, txt, sub, t, side) => {
  const [x, y] = PR(lat, lon);
  [0, 0.8].forEach((d) => { const r = document.createElement("div"); r.style.cssText = `position:absolute;left:${x - 46}px;top:${y - 46}px;width:92px;height:92px;border-radius:50%;border:6px solid #ffd54a;box-shadow:0 0 18px #ffd54a;`; EUW.appendChild(r);
    gsap.set(r, { autoAlpha: 0 }); tl.fromTo(r, { autoAlpha: 1, scale: 0.4 }, { autoAlpha: 0, scale: 1.7, duration: 1.6, repeat: Math.max(0, Math.round((END - t) / 1.6)), ease: "sine.out", immediateRender: false }, t + d); });
  epin(`<svg width="54" height="54" viewBox="0 0 40 40" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.6))"><path d="M4 18 Q20 -4 36 18 Z" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2.5"/><line x1="5" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.6"/><line x1="35" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.6"/><line x1="20" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.6"/><circle cx="20" cy="35" r="3.2" fill="#f3eee2"/></svg>`, lat, lon, t, { pop: true });
  const lab = epin(`<div style="display:flex;align-items:center;gap:12px;padding:8px 18px 10px;background:rgba(18,16,12,0.92);border-left:7px solid #ffd54a;font-family:Oswald;font-weight:700;color:#f7f3ea;white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,.6)">
    <span style="display:inline-flex;width:40px;height:40px;border-radius:50%;border:4px solid #ffd54a;align-items:center;justify-content:center;font-size:24px;color:#ffd54a">${n}</span>
    <div><div style="font-size:34px;letter-spacing:0.08em;line-height:1.1">${txt}</div><div style="font-size:19px;letter-spacing:0.22em;color:#d8cfb8"><img src="${US}" style="height:15px;vertical-align:-2px;margin-right:8px;border:1px solid #f7f3ea">${sub}</div></div></div>`,
    lat, lon, null, side);
  slam(lab, t + 0.15, { from: 1.8, dur: 0.22, shake: 4 });
  return lab;
};
ring(51.84, 5.86, 3, "THE BRIDGE TAKEN", "HOLLAND · SEPT 1944", T_ZO + 1.05, { dx: 70, dy: -70, anchor: [0, -50] });
// Sicily: German tanks driven at the beaches and stopped (red arrow, impacts, greyed)
const [sx, sy] = PR(37.05, 14.30);
const ARW = document.createElementNS("http://www.w3.org/2000/svg", "svg"); ARW.setAttribute("width", "2880"); ARW.setAttribute("height", "1620"); ARW.style.cssText = "position:absolute;left:0;top:0;overflow:visible";
EUW.appendChild(ARW);
const earrow = (pts, t, dur, col) => {
  const d = "M" + pts.map((q) => q.join(" ")).join(" L"), g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  g.innerHTML = `<path d="${d}" fill="none" stroke="#f7f3ea" stroke-width="22" stroke-linecap="round"/><path class="c" d="${d}" fill="none" stroke="${col}" stroke-width="13" stroke-linecap="round"/><g transform="translate(${b[0]} ${b[1]}) rotate(${ang})"><polygon class="h" points="0,-20 28,0 0,20" fill="${col}" stroke="#f7f3ea" stroke-width="4"/></g>`;
  ARW.appendChild(g); const ps = g.querySelectorAll("path"), len = ps[0].getTotalLength();
  gsap.set(ps, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len }); gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 1, duration: 0.01 }, t); tl.to(ps, { strokeDashoffset: 0, duration: dur, ease: "power2.inOut" }, t);
  return g;
};
const stopIt = (g, t) => { tl.to([g.querySelector(".c"), g.querySelector(".h")], { attr: { stroke: "#8a877f", fill: "#8a877f" }, duration: 0.3 }, t); tl.to(g, { opacity: 0.6, duration: 0.3 }, t); };
const blast = (x, y, t, first) => { const f = document.createElement("div"); f.className = "fxk-fire"; f.style.cssText = `position:absolute;left:${x - 22}px;top:${y - 22}px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle, #fffbe6 0%, #ffd34d 22%, rgba(255,120,20,0.9) 48%, rgba(200,40,0,0.5) 62%, rgba(120,20,0,0) 74%);`;
  EUW.appendChild(f); gsap.set(f, { autoAlpha: 0 }); tl.fromTo(f, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1.2, duration: 0.14, immediateRender: false }, t); tl.to(f, { autoAlpha: 0, scale: 1.7, duration: 0.5 }, t + 0.16);
  SFX(first ? "explosion" : "impact", t); if (first) K.shake(t, 4, 0.3); };
const AS = earrow([[sx + 120, sy - 110], [sx + 60, sy - 50], [sx + 18, sy - 14]], T_STOP - 0.4, 0.6, "#c4121f");
blast(sx + 22, sy - 18, T_STOP + 0.25, true); blast(sx + 40, sy - 34, T_STOP + 0.45, false);
stopIt(AS, T_STOP + 0.5);
ring(37.05, 14.30, 1, "TIGER TANKS STOPPED", "SICILY · JULY 1943", T_TIGER + 0.05, { dx: 80, dy: 10, anchor: [0, -50] });
// "with paratroopers": parachutes pop over Sicily
[[37.25, 14.55], [37.10, 14.75], [37.30, 14.15], [36.98, 14.55]].forEach(([la, lo], k) => { epin(`<svg width="30" height="30" viewBox="0 0 40 40" style="display:block;overflow:visible"><path d="M4 18 Q20 -4 36 18 Z" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2.5"/><line x1="5" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.6"/><line x1="35" y1="18" x2="20" y2="34" stroke="#f3eee2" stroke-width="1.6"/><circle cx="20" cy="35" r="3.2" fill="#f3eee2"/></svg>`, la, lo, T_WITHP + k * 0.15, { pop: true }); SFX("tick", T_WITHP + k * 0.15); });
// Normandy: the German attack on the causeway is held (red arrow from the west, stopped)
const [nx, ny] = PR(49.40, -1.37);
const AN = earrow([[nx - 130, ny + 20], [nx - 60, ny + 6], [nx - 16, ny]], T_HELD - 0.3, 0.6, "#c4121f");
blast(nx - 14, ny, T_HELD + 0.35, true); stopIt(AN, T_HELD + 0.45);
ring(49.40, -1.37, 2, "THE CAUSEWAY HELD", "NORMANDY · JUNE 1944", T_CAUSE - 0.05, { dx: -80, dy: 30, anchor: [-100, -50] });
K.raiseTerritory();
B.finish();
