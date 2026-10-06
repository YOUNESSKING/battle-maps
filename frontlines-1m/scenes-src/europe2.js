// EUROPE (e-1 .. e-2), 2-min merged-style test: occupied Europe (crimson, emblem centred on Germany), England, then the Channel: the Germans watch the Pas-de-Calais.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(6, 7093, 5051);
// --- reference-style helpers (merged-style test): white-box labels, nation flags, legend ---
const box = (txt, x, y, t, size = 24, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.3em;padding:4px 9px 4px 14px;font-size:${size}px;box-shadow:0 2px 8px rgba(0,0,0,.6);white-space:nowrap">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 80) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><img src="${src}" style="width:${w}px;display:block;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)">${name ? `<div class="gg-lbl" style="position:relative;font-size:${Math.round(w / 4)}px;color:#f7f3ea;text-shadow:0 2px 4px #000;letter-spacing:0.08em">${name}</div>` : ""}</div>`, x, y, { t, pop: true, until });
const legend = (t, until) => GG.card(`<div style="display:flex;gap:26px;font-size:22px;letter-spacing:0.08em;align-items:center"><span><b style="display:inline-block;width:20px;height:20px;background:#2e5cb2;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>ALLIES</span><span><b style="display:inline-block;width:20px;height:20px;background:#8c0c14;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>GERMAN-HELD</span></div>`, "tr", 40, t, until);
const svgPath = (pts, attrs, t, dur = 1.2) => { const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); for (const k in attrs) p.setAttribute(k, attrs[k]);
  document.getElementById("overlay").appendChild(p); GG.hide(p); B.tl.fromTo(p, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur }, t); return p; };

const T_FOUR = at("e-1", "For four years"), T_COAST = at("e-1", "the coast of Europe"), T_ENG = at("e-1", "In England"), T_LARGEST = at("e-1", "the largest");
const S2 = PS("e-2"), T_NORM = at("e-2", "Its target is Normandy"), T_WRONG = at("e-2", "the wrong place"), T_PDC = at("e-2", "Pas-de-Calais"), T_NARROW = at("e-2", "narrowest");
B.image("assets/media/europe_ctlm_jun5.png", 0, 0, 2880, 1620, { t: 0, dur: 0.6 });
const [gx, gy] = G(50.9, 10.9), PDC = G(50.55, 2.3), NOR = G(49.2, -0.7);
B.camera([[0, 1430, 820, 0.78], [T_COAST, 1400, 800, 0.82], [T_ENG, 1280, 700, 0.95], [S2, 1250, 660, 1.1], [T_NORM, 1150, 600, 1.9], [T_PDC, 1190, 560, 2.2], [END, 1200, 565, 2.3]]);
B.showDate(0.2); B.date("JUNE 1944", 0.4, null, 34);
B.image("assets/media/emblem_ger.png", gx - 190, gy - 190, 380, 380, { t: T_FOUR - 0.3, dur: 1.4, opacity: 0.85, until: S2 + 1 });
SFX("ref:boom", T_FOUR - 0.3);
box("GERMANY", ...G(48.9, 11.0), T_FOUR + 0.8, 26, S2 + 1);
box("OCCUPIED FRANCE", ...G(46.6, 2.4), T_COAST, 26, T_NORM);
box("OCCUPIED NORWAY", ...G(61.0, 9.5), T_COAST + 0.4, 22, S2);
box("GREAT BRITAIN", ...G(53.4, -1.4), T_ENG, 24, T_NORM);
flag("assets/media/uk_flag.png", "BRITAIN", ...G(52.1, -3.4), T_ENG + 0.2, T_NORM); flag("assets/media/us_flag_48star.png", "USA", ...G(51.6, -1.0), T_ENG + 0.5, T_NORM);
legend(T_FOUR, S2);
SFX("ref:whoosh", T_ENG - 0.3); SFX("ref:whoosh", T_NORM - 0.4);
// Normandy: the real target; the Pas-de-Calais: where the Germans look
K.target(NOR[0], NOR[1], T_NORM, { r: 26, side: "carth", until: END + 1 });
box("NORMANDY", NOR[0] - 10, NOR[1] + 34, T_NORM + 0.2, 18);
[[0, 0], [16, 8], [-14, 12], [6, 22]].forEach(([dx, dy], i) => { const id = "pc" + i; B.unit({ id, side: "rome", x: PDC[0] + dx + 14, y: PDC[1] + dy + 6, w: 18, h: 12, t: T_WRONG + i * 0.15 }); K.counter(id, { icon: i % 2 ? "tank" : "infantry", flag: "ger" }); });
box("PAS-DE-CALAIS", PDC[0] + 30, PDC[1] - 26, T_PDC, 16);
B.caption("THE GERMANS EXPECT THE INVASION HERE · WHERE THE CHANNEL IS NARROWEST", T_PDC + 0.2, END + 1, "rome r");
SFX("hit", T_PDC + 0.2);
K.raiseTerritory();
B.finish();
