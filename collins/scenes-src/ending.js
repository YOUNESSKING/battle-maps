// ENDING (end-1 .. end-2), Collins #9: Western Front overview, option 1 (copies rokossovsky/scenes-src/ending.js).
// Patton, "the legend of the summer of 1944" (badge + the Third Army breakout arrow), then Collins's badge centre; the three moves
// replay as rings with their dates while the control map moves with them (26 Jun 44 Cherbourg -> 25 Jul 44 Cobra / Saint-Lô ->
// 24 Dec 44 the Bulge, its tip at Celles); the method lines light one by one; closing card WHICH COMMANDER NEXT? + subscribe.
// Control overlays: tools/make_bulge_control.py (bulge_eu_jun44 / jul44 / dec24, fronts in research/FACT_NOTES_ardennes.md).
// Built with: python3 tools/build_scene.py ending europe_hd_ref end-1 end-2
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(6, 7093, 5051);
const FL = { us: "assets/media/us_flag_48star.png", uk: "assets/media/uk_flag.png", de: "assets/media/ger_reich_flag.png" };
const E1 = "end-1", E2 = "end-2", S2 = PS(E2);
const T_PAT = at(E1, "Patton became"), T_BUT = at(E1, "But it was Collins"), T_PORT = at(E1, "took the port"), T_BROKE = at(E1, "broke the German line"),
  T_TIP = at(E1, "stopped the tip"), T_CUT = at(E1, "He cut his enemies"), T_THREW = at(E1, "He threw his tanks"), T_HIT = at(E1, "And he hit");
const T_NEXT = at(E2, "Which commander"), T_SUB = at(E2, "subscribe");

// ---------- helpers (collins move3a / rokossovsky ending kit; sizes in world px, the camera scales them ~2.2x) ----------
const box = (txt, x, y, t, size = 10, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.6).toFixed(1)}px;font-size:${size}px;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6);white-space:nowrap">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 52) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.5, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.2).toFixed(1)}px;color:#f7f3ea;text-shadow:0 ${w * 0.02}px ${w * 0.04}px #000;letter-spacing:0.08em">${name}</div></div>`, x, y, { t, pop: true, until });
const neutral = (name, x, y, t, until, size = 9) => GG.pin(`<div class="gg-lbl" style="position:relative;text-align:center;font-size:${size}px;line-height:1.1;color:#e9e6dc">${name}<br><span style="font-size:${(size * 0.65).toFixed(1)}px;letter-spacing:.32em;color:#c9c4b4">NEUTRAL</span></div>`, x, y, { t, until });
const legend = (t, until) => {
  const sw = (c) => `<b style="display:inline-block;width:20px;height:20px;background:${c};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>`;
  const el = GG.card(`<div style="display:flex;gap:26px;font-size:21px;letter-spacing:0.08em;align-items:center"><span>${sw("#2e5cb2")}ALLIES</span><span>${sw("#8c0c14")}GERMANY</span><span>${sw("#6d766c")}NEUTRAL</span></div>`, "", 34, t, until);
  el.querySelector(".inner").style.cssText += "padding:12px 30px 14px;border-top-color:#9fc0ea;"; return el;
};
const ctl = (state, t, until) => { const el = B.image(`assets/media/bulge_eu_${state}_mx.png`, 0, 0, 2880, 1620, { t, dur: t > 0 ? 1.0 : 0.01, until }); el.style.mixBlendMode = "multiply"; return el; };
const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w * 1.45).toFixed(2)); const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", (w * 0.25).toFixed(2)); return g; };
const centre = (el, top) => Object.assign(el.style, { right: "0px", left: "0px", top: top + "px", bottom: "auto", display: "flex", justifyContent: "center" });

// ---------- map layers: territory per date (multiply), living map, emblem fixed on Germany, geography, winter at the end ----------
ctl("jun44", 0, T_BROKE); ctl("jul44", T_BROKE - 0.3, T_TIP); ctl("dec24", T_TIP - 0.3);
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.22 }); LV.scaleBar(1714.41); LV.north();
const EM = G(50.75, 9.0);   // on Germany, inside the frame, clear of the flag and labels; never fades
B.image("assets/media/emblem_ger.png", EM[0] - 30, EM[1] - 30, 60, 60, { t: 0, dur: 0.6, opacity: 0.8 });
B.image("assets/media/bgeu_geo.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });

// ---------- camera: Western Front (Cherbourg ... the Rhine), slow drift ----------
B.camera([[0, 1190, 505, 2.15], [T_BUT, 1188, 505, 2.2], [S2, 1185, 505, 2.25], [END, 1184, 505, 2.27]]);
B.showDate(0.2); B.date("SUMMER 1944", 0.4, T_PORT - 0.2, 34); B.date("JUNE 1944", T_PORT - 0.1, T_BROKE - 0.2, 34);
B.date("JULY 1944", T_BROKE - 0.1, T_TIP - 0.2, 34); B.date("DECEMBER 1944", T_TIP - 0.1, null, 34);
legend(0.4, END + 1);
flag(FL.de, "GERMANY", ...G(52.05, 8.4), 0.5); flag(FL.uk, "BRITAIN", ...G(52.45, -1.7), 0.7); flag(FL.us, "USA", ...G(47.75, 0.9), 0.9);
neutral("SWITZERLAND", ...G(46.85, 8.0), 1.0);

// ---------- Patton: the legend of the summer (Third Army's breakout from Avranches, the drive across France) ----------
const pat = K.badge({ name: "LT. GEN. GEORGE S. PATTON", role: "THIRD ARMY · THE LEGEND OF 1944", photo: "assets/media/patton_head.png", flag: "us", side: "carth", corner: "tr", t: 0.2, until: T_BUT - 0.2 });
centre(pat, 150);
const AVR = G(48.68, -1.36);
arw({ pts: [AVR, G(48.3, 0.2), G(48.6, 1.6), G(48.75, 2.9)], side: "carth", width: 5, t: 0.3, dur: 2.4, until: T_BUT + 0.4 });
arw({ pts: [G(48.3, 0.2), G(47.9, 1.9), G(48.3, 4.0)], side: "carth", width: 4, t: 1.0, dur: 2.2, until: T_BUT + 0.4 });
box("PATTON'S THIRD ARMY", ...G(47.95, -0.2), 1.2, 7, T_BUT + 0.3);

// ---------- Collins, centre; the three moves replay as rings + dates ----------
const col = K.badge({ name: "J. LAWTON COLLINS", role: "VII CORPS · \"LIGHTNING JOE\"", photo: "assets/media/collins_head.png", flag: "us", side: "carth", corner: "tr", t: T_BUT, until: T_CUT - 0.5 });
centre(col, 150);
const ring = (p, name, date, n, t, dx, dy = -2) => {
  K.target(p[0], p[1], t, { r: 13, until: S2 + 0.5 }); SFX("hit", t + 0.05);
  box(name, p[0] + dx, p[1] + dy, t + 0.1, 9, S2 + 0.5);
  GG.pin(`<div style="display:flex;align-items:center;gap:3.5px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 1px 2px #000"><span style="display:inline-flex;width:14px;height:14px;border-radius:50%;border:1.4px solid #ffd54a;align-items:center;justify-content:center;font-size:8.5px">${n}</span><span style="font-size:10px;letter-spacing:.1em">${date}</span></div>`, p[0] + dx, p[1] + dy + 13, { t: t + 0.25, pop: true, until: S2 + 0.5 });
};
const CHB = G(49.639, -1.616), STL = G(49.116, -1.09), CEL = G(50.233, 5.017);
ring(CHB, "CHERBOURG", "JUN 1944", 1, T_PORT, -44, -6);
ring(STL, "SAINT-LÔ", "JUL 1944", 2, T_BROKE, 34, 6);
arw({ pts: [[STL[0] - 2, STL[1] + 3], [STL[0] - 4, STL[1] + 16], [STL[0] - 3, STL[1] + 30]], side: "carth", width: 3.5, t: T_BROKE + 0.3, dur: 1.0, until: S2 + 0.5 });   // the Cobra breakout
ring(CEL, "CELLES", "DEC 1944", 3, T_TIP, -40, 6);
// the tip of the Bulge: 2nd Panzer's spearhead and the blow from the north that stopped it
arw({ pts: [G(50.08, 5.80), G(50.14, 5.45), G(50.24, 5.08)], side: "rome", width: 3.6, t: T_TIP - 0.4, dur: 1.0, until: S2 + 0.5 });
arw({ pts: [G(50.62, 5.75), G(50.42, 5.38), G(50.27, 5.08)], side: "carth", width: 3.6, t: T_TIP + 0.6, dur: 1.0, until: S2 + 0.5 });
K.impact(CEL[0] + 1, CEL[1] - 1, T_TIP + 1.55, { r: 4 }); SFX("ref:boom", T_TIP + 1.6);
GG.layer("background:rgba(225,236,248,0.08);", T_TIP, null, { dur: 1.0 }); B.snow(T_TIP, END + 1);

// ---------- the method, one line per spoken line ----------
const M = document.createElement("div");
M.style.cssText = "position:absolute;left:0;right:0;top:760px;display:flex;justify-content:center;";
M.innerHTML = `<div style="padding:16px 44px 18px;background:rgba(18,16,12,0.9);border-top:6px solid #c9b48a;color:#f4f1ea;font-weight:700;box-shadow:0 20px 40px rgba(0,0,0,0.5)">
  <div style="font-size:22px;letter-spacing:0.4em;color:#c9b48a;text-align:center;margin-bottom:6px">COLLINS'S METHOD</div>
  ${["CUT THEM OFF, THEN NEVER LET THEM DIG IN", "THROW THE TANKS INTO THE CHAOS", "HIT THE SPEARHEAD WHEN IT RUNS DRY"].map((s, i) => `<div class="row" style="display:flex;align-items:center;gap:18px;font-size:38px;letter-spacing:0.07em;line-height:1.35"><span style="display:inline-flex;width:40px;height:40px;border-radius:50%;border:3px solid currentColor;align-items:center;justify-content:center;font-size:22px">${i + 1}</span>${s}</div>`).join("")}</div>`;
document.getElementById("scene").insertBefore(M, document.getElementById("credit"));
GG.hide(M); GG.fadeIn(M, T_CUT - 0.4, 0.5); GG.fadeOut(M, S2 - 0.1, 0.5);
M.querySelectorAll(".row").forEach((r, i) => { const t = [T_CUT, T_THREW, T_HIT][i] + 0.1; B.tl.fromTo(r, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }, t); SFX("ref:pop", t); });

// ---------- closing card ----------
GG.layer("background: rgba(6,8,12,0.45);", S2 - 0.1, null, { dur: 0.8 });
SFX("ref:boom", T_NEXT + 0.1);
const close = GG.card(`<div style="text-align:center"><div style="font-size:30px;letter-spacing:0.4em;color:#c9b48a">TELL US IN THE COMMENTS</div><div style="font-size:96px;font-weight:700;letter-spacing:0.06em;line-height:1.15">WHICH COMMANDER NEXT?</div></div>`, "", 600, T_NEXT + 0.1, END + 1);
close.querySelector(".inner").style.padding = "26px 70px 30px";
const sub = GG.card(`<div style="display:flex;align-items:center;gap:16px;font-size:40px;font-weight:700;letter-spacing:0.12em"><span style="background:#c4121f;padding:10px 30px;border-radius:6px">SUBSCRIBE</span><svg width="44" height="44" viewBox="0 0 24 24"><path fill="#f4f1ea" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1z"/></svg></div>`, "", 860, T_SUB - 0.2, END + 1);
sub.querySelector(".inner").style.cssText += "background:transparent;box-shadow:none;border-top:none;padding:0;";
SFX("hit", T_SUB);
K.raiseTerritory();
B.finish();
