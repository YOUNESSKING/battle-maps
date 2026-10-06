// EUROPE HD (e-1 .. e-2), 1-min D-Day test with the map upgrade (HD relief, living map). Was: the reference look on our engine. Dark terrain, crimson occupied Europe with a red rim,
// a big stamped emblem, white-box labels (flat, as locked) and a camera that never stops drifting; then the push into Normandy and the
// transport stream crossing the Channel to the Cotentin's west coast at night.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(6, 7093, 5051);
const T_JUNE = at("e-1", "June"), T_FOUR = at("e-1", "For four years"), T_COAST = at("e-1", "the coast of Europe"), T_ENG = at("e-1", "from England"), T_STRIKE = at("e-1", "strike back");
const S2 = PS("e-2"), T_HOURS = at("e-2", "Hours before"), T_13 = at("e-2", "thirteen thousand"), T_800 = at("e-2", "eight hundred"), T_MISSION = at("e-2", "Their mission"), T_DARK = at("e-2", "in the dark");
B.image("assets/media/europe_ctlm_jun5_mx.png", 0, 0, 2880, 1620, { t: 0, dur: 0.6 }).style.mixBlendMode = "multiply";
const LV = LivingK(B);
LV.clouds({ n: 7, opacity: 0.24 });
LV.scaleBar(1714.41); LV.north();

const [ex, ey] = G(50.9, 10.9), [nx, ny] = G(49.35, -1.1), [lx, ly] = G(51.6, -1.2);
B.camera([[0, 1430, 820, 0.78], [T_COAST, 1400, 800, 0.82], [T_ENG, 1250, 720, 0.95], [S2, 1240, 740, 1.05], [T_13, 1180, 760, 1.6], [T_MISSION, nx + 10, ny - 10, 2.6], [END, nx + 20, ny - 5, 2.75]]);
B.showDate(0.2); B.date("5 JUNE 1944", 0.4, null, 34);
// the emblem stamped into Germany (reference), with a deep boom
B.image("assets/media/emblem_ger.png", ex - 190, ey - 190, 380, 380, { t: T_FOUR - 0.3, dur: 1.4, opacity: 0.8, until: T_ENG - 0.2 });
SFX("ref:boom", T_FOUR - 0.3);
const box = (txt, x, y, t, size = 26, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.32em;padding:${Math.round(size * 0.2)}px ${Math.round(size * 0.35)}px ${Math.round(size * 0.2)}px ${Math.round(size * 0.6)}px;font-size:${size}px;box-shadow:0 2px 8px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
box("OCCUPIED FRANCE", ...G(46.8, 2.4), T_COAST, 20, T_13);
box("OCCUPIED NORWAY", ...G(61.0, 9.0), T_COAST + 0.4, 18, T_13);
box("GREAT BRITAIN", ...G(53.2, -1.6), T_ENG - 0.2, 18, T_MISSION);
const flag = (src, name, x, y, t, until, w = 90) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><img src="${src}" style="width:${w}px;display:block;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:22px;color:#f7f3ea;text-shadow:0 2px 4px #000;letter-spacing:0.08em">${name}</div></div>`, x, y, { t, pop: true, until });
flag("assets/media/uk_flag.png", "BRITAIN", ...G(52.0, -3.6), T_ENG + 0.1, T_13); flag("assets/media/us_flag_48star.png", "USA", ...G(51.4, -4.6), T_ENG + 0.4, T_13);
GG.card(`<div style="display:flex;gap:26px;font-size:22px;letter-spacing:0.08em;align-items:center"><span><b style="display:inline-block;width:20px;height:20px;background:#2e5cb2;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>ALLIES</span><span><b style="display:inline-block;width:20px;height:20px;background:#8c0c14;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>AXIS</span></div>`, "tr", 40, T_FOUR, S2);
SFX("ref:whoosh", T_ENG - 0.4);
// night falls; the transport stream crosses the Channel and turns east over the Cotentin's west coast
GG.layer("background: rgba(4,8,22,0.42);", T_HOURS, END + 1, { dur: 1.2 });
SFX("ref:whoosh", T_13 - 0.3); SFX("ref:riser", T_MISSION - 1.8);
// owner 2026-10-06: the transports fly over the drop zone, release their sticks of paratroopers as they pass, then carry on east over
// the coast and turn back north for England, leaving the map (they never stop in mid-air)
const along = (pts, k) => { let L = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); L += d; }
  return seg.slice(0, k).reduce((a, b) => a + b, 0) / L; };   // fraction of the flight at which point k is reached
for (let i = 0; i < 9; i++) {
  const y0 = ly + (i % 3) * 7 - 7, t = T_HOURS + 0.4 + i * 0.35, jx = (i % 4) * 4, jy = (i % 3) * 5;
  const pts = [[lx - 20 + (i % 3) * 8, y0], [nx - 50, ny - 30 + (i % 3) * 6], [nx - 34, ny - 8 + jy], [nx - 8 + jx, ny - 6 + jy], [nx + 24 + jx, ny - 12 + jy], [nx + 34, ny - 70], [nx + 12, ny - 170]];
  const dur = 7.0;
  K.aircraft({ kind: "cargo", side: "carth", size: 22, alt: 8, pts, t, dur, until: t + dur, sfx: i % 3 ? false : undefined });
  const tDrop = t + dur * along(pts, 3);   // over the drop zone
  for (let c = 0; c < 3; c++) GG.chute(nx - 12 + jx + c * 5, ny - 4 + jy + (c % 2) * 3, tDrop - 0.25 + c * 0.18, { s: 9, until: END + 1 });
}
const card = GG.card(`<div style="display:flex;align-items:center;gap:40px;font-weight:700;letter-spacing:0.04em"><div style="text-align:center"><div style="font-size:72px;line-height:1;color:#6f9bff">13,000</div><div style="font-size:20px;letter-spacing:0.3em;color:#c9d6ff">PARATROOPERS</div></div><div class="c2" style="text-align:center"><div style="font-size:72px;line-height:1;color:#6f9bff">800+</div><div style="font-size:20px;letter-spacing:0.3em;color:#c9d6ff">PLANES</div></div></div>`, "gg-odds", 820, T_13 - 0.2, T_DARK + 0.6);
card.querySelector(".inner").style.padding = "16px 54px 20px"; GG.hide(card.querySelector(".c2"));
B.tl.fromTo(card.querySelector(".c2"), { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, T_800); SFX("hit", T_13); SFX("hit", T_800);
box("COTENTIN PENINSULA", nx - 6, ny - 26, T_MISSION + 0.3, 8);
B.caption("JUMP BEHIND THE BEACHES IN THE DARK · SEIZE THE ROADS", T_MISSION, END + 1, "carth r");
K.raiseTerritory();
B.finish();
