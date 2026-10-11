// MOVE 3a (move3-1), Collins #9: the Battle of the Bulge opens, 16 December 1944. Basemap europe_hd_ref (z6), option 1 (multiply
// territory `_mx` overlays from tools/make_bulge_control.py: 16 Dec start line -> 24 Dec, the Bulge at its deepest, Bastogne ringed).
// Western Front overview -> camera dive onto the Ardennes; the German offensive arrows (6th SS Pz Army, 5th Pz Army, 7th Army),
// the opening barrage on the thin American line, the goal: the Meuse, then Antwerp, splitting the Allies (British north, US south);
// the 2nd Panzer spearhead arrow toward Dinant; UK flag on the Meuse; snow (winter). Fronts + sources: research/FACT_NOTES_bulge.md.
// Built with: python3 tools/build_scene.py move3a europe_hd_ref move3-1 move3-1
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(6, 7093, 5051);
const FL = { us: "assets/media/us_flag_48star.png", uk: "assets/media/uk_flag.png", de: "assets/media/ger_reich_flag.png" };
const M1 = "move3-1";
const T_HIT = at(M1, "Hitler launched"), T_SMASH = at(M1, "German armies smashed"), T_THIN = at(M1, "thin American line"),
  T_ARD = at(M1, "in the Ardennes"), T_GOAL = at(M1, "Their goal"), T_MEUSE = at(M1, "River Meuse"), T_ANT = at(M1, "port of Antwerp"),
  T_SPLIT = at(M1, "splitting");

// ---------- helpers (Rokossovsky / collins bg.js europe kit; sizes in world px, the camera scales them) ----------
const box = (txt, x, y, t, size = 16, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.6).toFixed(1)}px;font-size:${size}px;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6);white-space:nowrap">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 120) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.5, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.2).toFixed(1)}px;color:#f7f3ea;text-shadow:0 ${w * 0.02}px ${w * 0.04}px #000;letter-spacing:0.08em">${name}</div></div>`, x, y, { t, pop: true, until });
const neutral = (name, x, y, t, until, size = 18) => GG.pin(`<div class="gg-lbl" style="position:relative;text-align:center;font-size:${size}px;line-height:1.1;color:#e9e6dc">${name}<br><span style="font-size:${(size * 0.65).toFixed(1)}px;letter-spacing:.32em;color:#c9c4b4">NEUTRAL</span></div>`, x, y, { t, until });
const legend = (t, until) => {
  const sw = (c) => `<b style="display:inline-block;width:20px;height:20px;background:${c};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>`;
  const el = GG.card(`<div style="display:flex;gap:26px;font-size:21px;letter-spacing:0.08em;align-items:center"><span>${sw("#2e5cb2")}ALLIES</span><span>${sw("#8c0c14")}GERMANY</span><span>${sw("#6d766c")}NEUTRAL</span></div>`, "", 34, t, until);
  el.querySelector(".inner").style.cssText += "padding:12px 30px 14px;border-top-color:#9fc0ea;"; return el;
};
const unit = (id, side, p, t, o = {}) => {   // counter scaled for the zoomed europe map (border + tag in world px)
  const w = o.w || 8, h = o.h || 5.5; B.unit({ id, side, x: p[0], y: p[1], w, h, t, label: o.label });
  K.counter(id, { icon: o.icon || "infantry", flag: side === "rome" ? FL.de : (o.flag || "us") });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (h * 0.5).toFixed(1) + "px", padding: `0 ${(h * 0.2).toFixed(1)}px`, marginTop: (h * 0.15).toFixed(1) + "px" });
  return u;
};
const ctl = (state, t, until, dur = 1.0) => { const el = B.image(`assets/media/bulge_eu_${state}_mx.png`, 0, 0, 2880, 1620, { t, dur, until }); el.style.mixBlendMode = "multiply"; return el; };
const along = (pts, f) => { const seg = []; let Lt = 0; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j] || j === seg.length - 1) { const k = Math.min(1, d / seg[j]); return [pts[j][0] + (pts[j + 1][0] - pts[j][0]) * k, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * k]; } d -= seg[j]; } };
const gl = (pts, col, w, t, until) => {   // glowing river line (world), fades in / out
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); p.style.filter = `drop-shadow(0 0 ${w * 1.5}px ${col})`;
  svg.appendChild(p); gsap.set(p, { opacity: 0 });
  B.tl.to(p, { opacity: 1, duration: 0.5 }, t); B.tl.to(p, { opacity: 0.55, duration: 0.6, yoyo: true, repeat: 3, ease: "sine.inOut" }, t + 0.6);
  if (until != null) B.tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};

const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke-width", (w * 1.45).toFixed(2)); if (o.dash) ps[0].setAttribute("stroke-dasharray", o.dash.split(" ").map((v) => +v).join(" "));
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", (w * 0.25).toFixed(2)); return g; };
// ---------- map layers: territory (multiply), living map, emblem, geography, winter ----------
const C16 = ctl("dec16", 0, T_GOAL + 0.6, 0.01);
ctl("dec24", T_GOAL - 0.4, null, 2.2);              // the Bulge grows west while the goal is spoken (16 -> 24 Dec)
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.22 }); LV.scaleBar(1714.41); LV.north();
const EM = G(50.75, 9.0);   // on Germany, inside the frame both wide and zoomed (never over the sea or cut by the edge); stays the whole scene
B.image("assets/media/emblem_ger.png", EM[0] - 30, EM[1] - 30, 60, 60, { t: 0, dur: 0.6, opacity: 0.8 });
const GEO = B.image("assets/media/bgeu_geo.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01, until: T_SMASH + 0.2 });   // wide labels; small ones when zoomed
const town = (nm, lat, lon, t, dx = 0, dy = -3.6) => { const [x, y] = G(lat, lon); B.city("", x, y, { r: 0.9, t }); return GG.lbl(nm, x + dx, y + dy, { size: 4.6, t }); };
GG.layer("background:rgba(225,236,248,0.10);", 0, null, { dur: 0.01 });   // cold winter grade
B.snow(0.2, END + 1);

// ---------- camera: the Western Front -> dive onto the Ardennes ----------
B.camera([[0, 1300, 500, 1.6], [T_SMASH - 0.4, 1310, 495, 1.7], [T_SMASH + 1.4, 1345, 478, 4.2], [T_GOAL, 1338, 472, 4.25],
  [T_ANT - 0.2, 1330, 462, 4.0], [END, 1328, 462, 4.05]]);
SFX("ref:whoosh", T_SMASH - 0.2);
B.showDate(0.1); B.date("16 DECEMBER 1944", 0.3, T_GOAL - 0.2, 34); B.date("16 – 24 DECEMBER 1944", T_GOAL - 0.1, null, 30);
legend(0.4, END + 1);
B.title("MOVE 3", "CELLES", "DECEMBER 1944", 0.3, 4.4); SFX("ref:boom", 0.4);

// wide set: the powers (flags ~115 px on screen at scale 1.6 -> w 72)
flag(FL.de, "GERMANY", ...G(51.6, 9.4), 0.5, T_SMASH + 0.4, 70);
flag(FL.us, "USA", ...G(48.4, 2.6), 0.7, T_SMASH + 0.4, 70);
flag(FL.uk, "BRITAIN", ...G(52.3, -1.2), 0.9, T_SMASH + 0.4, 70);
neutral("SWITZERLAND", ...G(46.75, 8.1), 1.0, T_SMASH + 0.4, 9);
// Western Front units on screen from the first second (Allied armies facing the Reich, Germans behind the Siegfried Line)
const W0 = [["a1", G(51.55, 5.3), "uk"], ["a2", G(50.85, 5.95), "us"], ["a3", G(49.3, 6.3), "us"], ["a4", G(48.4, 6.9), "us"]];
W0.forEach(([id, p, f], i) => unit(id, "carth", p, 0.15 + i * 0.12, { w: 18, h: 12, flag: f }));
const G0 = [["g1", G(51.4, 6.9)], ["g2", G(50.3, 7.0)], ["g3", G(49.2, 7.4)], ["g4", G(48.3, 8.0)]];
G0.forEach(([id, p], i) => unit(id, "rome", p, 0.25 + i * 0.12, { w: 18, h: 12, icon: i === 1 ? "tank" : "infantry" }));
B.move("g2", 0.6, 3.0, ...G(50.35, 6.75));
B.hideUnits([...W0.map((q) => q[0]), "g1", "g3", "g4"], T_SMASH + 0.3, 0.5);
B.hideUnits(["g2"], T_SMASH + 0.6, 0.4);
box("THE ARDENNES", ...G(50.0, 5.0), 2.2, 12, T_SMASH + 0.2);
K.target(...G(50.15, 5.9), 2.2, { r: 16, until: T_SMASH + 0.4 });
B.caption("HITLER'S LAST OFFENSIVE IN THE WEST", T_HIT, T_THIN - 0.2, "rome r");

// ---------- 16 Dec: the blow falls on the thin American line (close) ----------
flag(FL.de, "GERMANY", ...G(50.05, 7.75), T_SMASH + 1.2, END + 1, 26);
[["BRUSSELS", 50.85, 4.35], ["LIÈGE", 50.633, 5.567], ["NAMUR", 50.465, 4.867], ["AACHEN", 50.776, 6.084], ["LUXEMBOURG", 49.611, 6.13], ["COLOGNE", 50.94, 6.96]].forEach(([n, la, lo], i) => town(n, la, lo, T_SMASH + 1.0 + i * 0.08));
flag(FL.us, "USA", ...G(49.55, 4.55), T_SMASH + 1.3, END + 1, 26);
const MEUSE = [G(50.14, 4.825), G(50.235, 4.905), G(50.26, 4.912), G(50.375, 4.87), G(50.465, 4.87), G(50.52, 5.24), G(50.63, 5.57)];
const USL = [["u1", G(50.47, 6.20)], ["u2", G(50.28, 6.10)], ["u3", G(50.05, 6.05)], ["u4", G(49.85, 6.25)]];
USL.forEach(([id, p], i) => unit(id, "carth", p, T_SMASH + 1.0 + i * 0.1, { w: 7, h: 5 }));
box("THIN US LINE · 4 DIVISIONS", ...G(49.72, 5.75), T_THIN, 5, T_GOAL);
const GERS = [["p6", G(50.52, 6.55), "tank", "6TH SS PZ ARMY"], ["p5", G(50.22, 6.55), "tank", "5TH PZ ARMY"], ["p7", G(49.90, 6.62), "infantry", "7TH ARMY"]];
GERS.forEach(([id, p, ic], i) => unit(id, "rome", p, T_SMASH + 1.1 + i * 0.12, { w: 8, h: 5.5, icon: ic }));
// the opening barrage: guns behind the start line, shells on the US positions (boom + shake on every impact)
const GUN = [G(50.45, 6.62), G(50.30, 6.64), G(50.05, 6.66)];
for (let v = 0; v < 2; v++) GUN.forEach((g, k) => {
  const t = T_SMASH + 1.5 + v * 0.9 + k * 0.15, tg = USL[(k + v) % 4][1];
  K.gun(g[0], g[1], t, { dx: 2, dy: -1.5 }); GG.arc(g[0] - 1, g[1] - 1, tg[0] + 1.5, tg[1] - 1, t + 0.05, { dur: 0.7, width: 0.8 }); K.impact(tg[0] + 1.5, tg[1] - 1, t + 0.75, { r: 4 });
});
B.grey(USL.map((q) => q[0]), T_ARD + 0.4, 0.6);
// the three German armies' arrows west
const A6 = [G(50.45, 6.38), G(50.42, 6.05), G(50.48, 5.75)], A5 = [G(50.20, 6.35), G(50.12, 5.95), G(50.18, 5.45), G(50.24, 5.05)], A7 = [G(49.90, 6.40), G(49.86, 6.05)];
[A6, A5, A7].forEach((p, k) => arw({ pts: p, side: "rome", t: T_THIN + 0.2 + k * 0.3, dur: 1.6, width: [4.2, 5, 3.2][k], until: T_SPLIT + 1.8 }));
["p6", "p5", "p7"].forEach((id, k) => B.move(id, T_THIN + 0.4 + k * 0.3, 3.4, ...[G(50.46, 5.95), G(50.15, 5.70), G(49.88, 6.15)][k]));
B.caption("GERMAN ARMIES SMASH INTO THE ARDENNES", T_SMASH + 0.3, T_GOAL - 0.2, "rome r");

// ---------- the goal: cross the Meuse, then Antwerp; split the Allies ----------
gl(MEUSE, "#8fd0ff", 1.6, T_MEUSE - 0.2, END + 1); SFX("ref:pop", T_MEUSE);
box("RIVER MEUSE", ...G(50.62, 4.55), T_MEUSE, 5, END + 1);
flag(FL.uk, "BRITISH", ...G(50.12, 4.40), T_MEUSE + 0.3, END + 1, 18);   // British XXX Corps sent to guard the Meuse crossings
K.target(...G(50.0, 5.716), T_GOAL + 0.8, { r: 6, side: "carth", until: END + 1 });
box("BASTOGNE · SURROUNDED", ...G(49.94, 5.73), T_GOAL + 1.0, 5, END + 1);
const ANT = G(51.22, 4.40);
arw({ pts: [G(50.48, 4.95), G(50.80, 4.70), [ANT[0] + 1, ANT[1] + 4]], side: "rome", t: T_ANT - 0.2, dur: 1.4, width: 3.2, dash: "5 3", until: END + 1 });
K.target(...ANT, T_ANT + 0.8, { r: 7, until: END + 1 }); box("ANTWERP · THE ALLIES' PORT", ANT[0] - 2, ANT[1] - 8, T_ANT + 0.6, 5, END + 1);
B.caption("GOAL: CROSS THE MEUSE · TAKE ANTWERP", T_GOAL, T_SPLIT - 0.1, "rome r");
// splitting the Allies: British + Canadians north of the thrust, Americans south (a red slash between them)
box("BRITISH + CANADIANS", ...G(51.50, 5.75), T_SPLIT - 0.1, 5, END + 1); box("AMERICANS", ...G(49.60, 5.05), T_SPLIT + 0.2, 5, END + 1);
GG.stamp("SPLIT THE ALLIES IN TWO", T_SPLIT + 0.5, END + 1, { size: 50, top: 860 });
// 2nd Panzer: the spearhead races for the Meuse at Dinant (the next scene picks it up on 23 Dec)
arw({ pts: [G(50.08, 5.80), G(50.14, 5.45), G(50.22, 5.15), [G(50.235, 4.99)[0], G(50.235, 4.99)[1]]], side: "rome", t: T_MEUSE + 0.4, dur: 1.8, width: 3.6, until: END + 1 });
box("2ND PANZER DIVISION", ...G(50.36, 5.62), T_MEUSE + 1.4, 5, END + 1);
K.raiseTerritory();
B.finish();
