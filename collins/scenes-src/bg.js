// BG (bg-1): Western Front overview, June 1944 (option 1). Utah Beach, the Channel supply problem, no port; Cherbourg, the nearest
// deep-water port, a fortress. Control map: tools/make_bgeu_control.py (mid-June 1944 lodgement; research/FACT_NOTES_cotentin.md).
// Built with: python3 tools/build_scene.py bg europe_hd_ref bg-1 bg-1
// Americans = blue (carth), Germans = red (rome). Flags: US 48-star, UK, Reich. Emblem fixed on Germany (never fades).
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(6, 7093, 5051);
const FL = { us: "assets/media/us_flag_48star.png", uk: "assets/media/uk_flag.png", de: "assets/media/ger_reich_flag.png" };
const B1 = "bg-1";
const T_JUNE = at(B1, "sixth of June"), T_UTAH = at(B1, "Utah Beach"), T_START = at(B1, "But a landing"), T_BULLET = at(B1, "Every bullet"),
  T_CHANNEL = at(B1, "across the Channel"), T_NOPORT = at(B1, "no proper port"), T_NEAREST = at(B1, "The nearest one"),
  T_TIP = at(B1, "northern tip"), T_FORT = at(B1, "turned it into a fortress");

// ---------- helpers (Rokossovsky bg.js kit) ----------
const box = (txt, x, y, t, size = 16, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.28em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.6).toFixed(1)}px;font-size:${size}px;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6);white-space:nowrap">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 120) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.5, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w * 0.2).toFixed(1)}px;color:#f7f3ea;text-shadow:0 ${w * 0.015}px ${w * 0.035}px #000;letter-spacing:0.08em">${name}</div></div>`, x, y, { t, pop: true, until });
const neutral = (name, x, y, t, until, size = 18) => GG.pin(`<div class="gg-lbl" style="position:relative;text-align:center;font-size:${size}px;line-height:1.1;color:#e9e6dc">${name}<br><span style="font-size:${Math.round(size * 0.65)}px;letter-spacing:.32em;color:#c9c4b4">NEUTRAL</span></div>`, x, y, { t, until });
const legend = (t, until) => {
  const sw = (c) => `<b style="display:inline-block;width:20px;height:20px;background:${c};vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>`;
  const el = GG.card(`<div style="display:flex;gap:26px;font-size:21px;letter-spacing:0.08em;align-items:center"><span>${sw("#2e5cb2")}ALLIES</span><span>${sw("#8c0c14")}GERMANY &amp; ALLIES</span><span>${sw("#6d766c")}NEUTRAL</span></div>`, "", 34, t, until);
  el.querySelector(".inner").style.cssText += "padding:12px 30px 14px;border-top-color:#9fc0ea;"; return el;
};
const arrowT = (o) => { const g = B.arrow(o); const ps = g.querySelectorAll("path"); ps[0].setAttribute("stroke-width", o.width + 1.6); g.querySelector("polygon").setAttribute("stroke-width", 0.8); return g; };
const unit = (id, side, x, y, t, o = {}) => { B.unit({ id, side, x, y, w: o.w || 9, h: o.h || 6, t, label: o.label }); K.counter(id, { icon: o.icon || "infantry", flag: side === "rome" ? FL.de : (o.flag || "us") });
  const u = B.units[id], bk = u.el.querySelector(".blk"); bk.style.borderWidth = Math.max(0.5, u.h * 0.1).toFixed(2) + "px"; bk.style.boxShadow = `0 ${u.h * 0.06}px ${u.h * 0.12}px rgba(0,0,0,0.4)`; return u; };

// ---------- map layers: territory (multiply), living map, emblem, geography ----------
B.image("assets/media/bgeu_ctl_jun44_mx.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 }).style.mixBlendMode = "multiply";
const LV = LivingK(B); LV.clouds({ n: 7, opacity: 0.22 }); LV.scaleBar(1714.41); LV.north();
const EM = G(51.0, 10.0);   // centred on Germany, clear of the sea and of the BERLIN / PRAGUE labels
B.image("assets/media/emblem_ger.png", EM[0] - 120, EM[1] - 120, 240, 240, { t: 0, dur: 0.6, opacity: 0.8 });
B.image("assets/media/bgeu_geo.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });

const UTAH = G(49.415, -1.175), CHB = G(49.639, -1.616), OMAHA = G(49.37, -0.88), GOLD = G(49.34, -0.6), JUNO = G(49.33, -0.42), SWORD = G(49.29, -0.30);
const PORTS = G(50.8, -1.09);

// ---------- camera: Western Europe -> the Channel -> Cherbourg ----------
const T_PUSH = T_UTAH - 1.4;
B.camera([[0, 1290, 560, 0.95], [T_PUSH, 1275, 556, 1.0], [T_UTAH + 1.2, 1058, 522, 3.6], [T_BULLET, 1060, 517, 3.65], [T_NOPORT, 1054, 520, 3.7],
  [T_NEAREST + 0.2, 1046, 524, 3.8], [T_TIP + 0.8, 1033, 530, 5.0], [END, 1031, 531, 5.2]]);
SFX("ref:whoosh", T_PUSH + 0.1);
B.showDate(0.1); B.date("6 JUNE 1944", 0.3, T_START + 1.5, 34); B.date("JUNE 1944", T_START + 1.5, null, 34);
legend(0.4, END + 1);

// wide set: the powers (flags ~115 px on screen)
flag(FL.de, "GERMANY", ...G(48.2, 3.4), 0.5, T_PUSH + 0.3, 118);
flag(FL.uk, "BRITAIN", ...G(53.7, -1.5), 0.7, T_PUSH + 0.3, 118);
flag(FL.us, "USA", ...G(51.1, -3.4), 0.9, T_PUSH + 0.3, 118);
neutral("SPAIN", ...G(40.3, -3.2), 0.9, T_PUSH + 0.3, 22); neutral("SWITZERLAND", ...G(46.6, 7.2), 1.0, T_PUSH + 0.3, 12);
neutral("SWEDEN", ...G(57.6, 14.6), 1.1, T_PUSH + 0.3, 18); neutral("IRELAND", ...G(53.1, -8.0), 1.0, T_PUSH + 0.3, 14);
// wide units on screen from the first second (Allied armies in Britain, German armies in France)
[["w1", "carth", G(51.6, -1.6), "us"], ["w2", "carth", G(51.9, 0.3), "uk"]].forEach(([id, s, p, f], i) => unit(id, s, p[0], p[1], 0.2 + i * 0.15, { w: 30, h: 20, flag: f }));
[["w3", G(49.2, 0.6)], ["w4", G(50.3, 2.6)], ["w5", G(48.2, -2.8)]].forEach(([id, p], i) => unit(id, "rome", p[0], p[1], 0.3 + i * 0.15, { w: 30, h: 20 }));
B.hideUnits(["w1", "w2", "w3", "w4", "w5"], T_PUSH + 0.3, 0.5);

// ---------- 6 June: the landings; Utah Beach ----------
const XA = [[1052, 470], [1050, 505], [1047, 538]];
arrowT({ side: "carth", pts: [PORTS, [PORTS[0] + 2, 500], [UTAH[0] + 4, UTAH[1] - 7]], width: 1.6, t: T_UTAH - 0.2, dur: 1.5, until: T_NOPORT });
arrowT({ side: "carth", pts: [[PORTS[0] + 10, PORTS[1] + 2], [1072, 510], [JUNO[0], JUNO[1] - 7]], width: 1.6, t: T_UTAH + 0.1, dur: 1.5, until: T_NOPORT });
box("UTAH BEACH", UTAH[0] + 14, UTAH[1] - 4, T_UTAH, 4.6, END + 1);
box("D-DAY BEACHES", 1074, 566, T_UTAH + 0.6, 4.0, T_NEAREST);
unit("us1", "carth", UTAH[0] + 1, UTAH[1] + 4, T_UTAH + 0.1, { flag: "us" });
unit("us2", "carth", OMAHA[0] + 1, OMAHA[1] + 4, T_UTAH + 0.3, { flag: "us" });
unit("uk1", "carth", JUNO[0], JUNO[1] + 4, T_UTAH + 0.5, { flag: "uk" });
unit("de1", "rome", ...G(49.55, -1.50), T_UTAH + 0.6); unit("de2", "rome", ...G(49.05, -1.0), T_UTAH + 0.7); unit("de3", "rome", ...G(49.05, -0.35), T_UTAH + 0.8);
// close set of flags (on each side's ground)
flag(FL.us, "USA", ...G(49.27, -0.95), T_UTAH + 0.5, null, 10);
flag(FL.uk, "BRITAIN", ...G(50.95, -1.75), T_UTAH + 0.6, T_TIP, 11);
flag(FL.uk, "BRITAIN", ...G(49.25, -0.5), T_NEAREST, null, 10);
flag(FL.de, "GERMANY", ...G(48.85, 0.55), T_UTAH + 0.7, null, 11);
// the Cotentin push: arrow from Utah into the peninsula
arrowT({ side: "carth", pts: [[UTAH[0] - 1, UTAH[1] - 1], [UTAH[0] - 5, UTAH[1] - 6], [UTAH[0] - 10, UTAH[1] - 10]], width: 1.3, t: T_START + 0.2, dur: 1.2 });
B.caption("A LANDING IS ONLY THE START", T_START, T_BULLET - 0.1, "carth");

// ---------- every bullet, shell and gallon across the Channel: the ships pile up off the beaches ----------
const SHIPS = [[1052, 470], [1060, 486], [1054, 500], [1066, 508], [1076, 518], [1060, 520], [1070, 530], [1084, 534], [1094, 540], [1080, 524], [1092, 528], [1100, 538]];
SHIPS.forEach(([x, y], i) => { GG.ship(x, y, { w: 9, t: T_BULLET - 0.2 + i * 0.45, color: "#1f4fc4", pop: true }); SFX("tick", T_BULLET - 0.2 + i * 0.45); });
B.caption("EVERY BULLET · EVERY SHELL · EVERY GALLON: ACROSS THE CHANNEL", T_BULLET, T_NOPORT - 0.1, "carth");
GG.stamp("NO PORT", T_NOPORT + 0.2, T_NEAREST + 0.4, { size: 66 });

// ---------- Cherbourg: the nearest deep-water port, a fortress ----------
box("CHERBOURG", CHB[0] - 3, CHB[1] - 7, T_NEAREST + 0.1, 4.4, END + 1);
K.target(CHB[0], CHB[1], T_NEAREST + 0.2, { r: 6, side: "#ffd54a", until: T_FORT });
SFX("hit", T_NEAREST + 0.3);
box("COTENTIN PENINSULA", CHB[0] - 8, CHB[1] + 14, T_TIP, 3.2, END + 1);
const port = GG.card(`<div style="text-align:center"><div style="font-size:22px;letter-spacing:0.4em;color:#9fc0ea">CHERBOURG</div><div style="font-size:52px;font-weight:700;letter-spacing:0.08em">THE NEAREST DEEP-WATER PORT</div></div>`, "", 150, T_NEAREST + 0.4, T_FORT - 0.2);
port.querySelector(".inner").style.borderTopColor = "#2c57b7";
// the fortress: red ring of forts, guns firing out to sea
const ring = K.target(CHB[0], CHB[1], T_FORT - 0.2, { r: 5, side: "rome", until: END + 1 });
unit("de4", "rome", CHB[0] + 3, CHB[1] + 3, T_FORT - 0.4, { icon: "artillery", w: 6, h: 4 });
[0, 1, 2].forEach((k) => { const t = T_FORT + 0.1 + k * 0.6; K.gun(CHB[0] + 3, CHB[1] + 2, t, { unit: "de4", dx: 0, dy: -2 }); GG.arc(CHB[0] + 3, CHB[1] + 1, CHB[0] + 6 + k * 5, CHB[1] - 9 - k * 2, t + 0.05, { dur: 0.6, width: 0.4, h: 4, impact: false });
  K.impact(CHB[0] + 6 + k * 5, CHB[1] - 9 - k * 2, t + 0.65, { r: 2.2, puffs: 2 }); });
GG.stamp("FORTRESS", T_FORT + 0.3, END + 1, { size: 70 });
K.raiseTerritory();
B.finish();
