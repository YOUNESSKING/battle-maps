// NIGHT (e-3): the transport stream crosses the Cotentin from the west; flak; the numbers.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(10, 128794, 88848);
// --- reference-style helpers (merged-style test): white-box labels, nation flags, legend ---
const box = (txt, x, y, t, size = 24, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.3em;padding:4px 9px 4px 14px;font-size:${size}px;box-shadow:0 2px 8px rgba(0,0,0,.6);white-space:nowrap">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 80) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><img src="${src}" style="width:${w}px;display:block;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)">${name ? `<div class="gg-lbl" style="position:relative;font-size:${Math.round(w / 4)}px;color:#f7f3ea;text-shadow:0 2px 4px #000;letter-spacing:0.08em">${name}</div>` : ""}</div>`, x, y, { t, pop: true, until });
const legend = (t, until) => GG.card(`<div style="display:flex;gap:26px;font-size:22px;letter-spacing:0.08em;align-items:center"><span><b style="display:inline-block;width:20px;height:20px;background:#2e5cb2;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>ALLIES</span><span><b style="display:inline-block;width:20px;height:20px;background:#8c0c14;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>GERMAN-HELD</span></div>`, "tr", 40, t, until);
const svgPath = (pts, attrs, t, dur = 1.2) => { const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); for (const k in attrs) p.setAttribute(k, attrs[k]);
  document.getElementById("overlay").appendChild(p); GG.hide(p); B.tl.fromTo(p, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur }, t); return p; };

const T_HOURS = at("e-3", "Hours before"), T_13 = at("e-3", "thirteen thousand"), T_800 = at("e-3", "eight hundred"), T_COT = at("e-3", "Cotentin");
B.image("assets/media/normandy_ctlm_before.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
GG.layer("background: rgba(4,8,22,0.5);", 0, END + 1, { dur: 0.01 });
const SME = G(49.408, -1.317);
B.camera([[0, 1150, 720, 1.0], [END, 1250, 715, 1.15]]);
B.showDate(0.1); B.date("5 JUNE 1944 · NIGHT", 0.2, null, 30);
for (let i = 0; i < 14; i++) { const y0 = 560 + (i % 5) * 40, t = 0.3 + i * 0.45;
  K.aircraft({ kind: "cargo", side: "carth", size: 30, alt: 10, pts: [[150, y0], [800, y0 + 20], [SME[0] - 60 + (i % 4) * 30, SME[1] - 60 + (i % 5) * 30]], t, dur: 5.0, until: t + 5.2, sfx: i % 4 ? false : undefined }); }
// flak bursts in the sky over the coast (air bursts: flash + puff, no ground shake)
for (let k = 0; k < 10; k++) { const x = 820 + (k * 97) % 420, y = 520 + (k * 61) % 300, t = T_HOURS + 1.5 + k * 0.55;
  GG.pin(`<div style="width:26px;height:26px;border-radius:50%;background:radial-gradient(circle,#fff3c4 0%,#ff9a3a 40%,rgba(255,120,40,0) 70%)"></div>`, x, y, { t, pop: true, until: t + 0.45 });
  if (k % 3 === 0) SFX("mg", t); }
box("COTENTIN PENINSULA", ...G(49.55, -1.55), T_COT, 18);
const card = GG.card(`<div style="display:flex;align-items:center;gap:40px;font-weight:700;letter-spacing:0.04em"><div style="text-align:center"><div style="font-size:72px;line-height:1;color:#6f9bff">13,000</div><div style="font-size:20px;letter-spacing:0.3em;color:#c9d6ff">PARATROOPERS</div></div><div class="c2" style="text-align:center"><div style="font-size:72px;line-height:1;color:#6f9bff">800+</div><div style="font-size:20px;letter-spacing:0.3em;color:#c9d6ff">PLANES</div></div></div>`, "gg-odds", 820, T_13 - 0.2, END + 1);
card.querySelector(".inner").style.padding = "16px 54px 20px"; GG.hide(card.querySelector(".c2"));
B.tl.fromTo(card.querySelector(".c2"), { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, T_800); SFX("hit", T_13); SFX("hit", T_800);
SFX("ref:riser", END - 2.2);
K.raiseTerritory();
B.finish();
