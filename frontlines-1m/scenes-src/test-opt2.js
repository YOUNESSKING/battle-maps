// TEST OPTION 2 (front lines only) of EUROPE HD (e-1 .. e-2), 1-min D-Day test with the map upgrade (HD relief, living map). Was: the reference look on our engine. Dark terrain, crimson occupied Europe with a red rim,
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
// OPTION 2 (owner 2026-10-06): no territory fill; who holds what is shown only by the two-colour glowing front lines
// (blue on the Allied side, red on the Axis side), traced from the control map by tools/make_front_lines.py
const FRONTS = [[[2401.5, 0.0], [2404.2, 4.7], [2409.6, 14.1], [2417.6, 28.1], [2428.4, 46.9], [2439.4, 63.6], [2450.6, 78.2], [2462.1, 90.8], [2473.9, 101.2], [2484.0, 112.4], [2492.5, 124.3], [2499.4, 136.9], [2504.6, 150.1], [2508.6, 163.0], [2511.2, 175.5], [2512.5, 187.6], [2512.5, 199.4], [2510.2, 213.4], [2505.6, 229.8], [2498.6, 248.5], [2489.4, 269.5], [2481.5, 286.5], [2475.1, 299.4], [2470.1, 308.3], [2466.4, 313.2], [2456.8, 319.5], [2441.1, 327.3], [2419.4, 336.6], [2391.6, 347.4], [2365.1, 358.9], [2339.8, 371.2], [2315.7, 384.3], [2292.8, 398.2], [2275.5, 409.1], [2263.8, 417.0], [2257.8, 422.0], [2257.2, 424.0], [2257.5, 428.5], [2258.5, 435.5], [2260.2, 445.0], [2262.8, 457.0], [2263.5, 469.8], [2262.5, 483.4], [2259.8, 497.9], [2255.2, 513.1], [2251.4, 529.2], [2248.3, 546.1], [2245.9, 563.8], [2244.1, 582.2], [2243.1, 596.8], [2242.9, 607.2], [2243.4, 613.8], [2244.6, 616.2], [2247.0, 619.6], [2250.6, 623.8], [2255.3, 628.8], [2261.2, 634.7], [2269.5, 641.5], [2280.2, 649.3], [2293.2, 658.1], [2308.8, 667.9], [2325.1, 676.6], [2342.4, 684.2], [2360.5, 690.8], [2379.5, 696.2], [2395.8, 701.3], [2409.4, 705.9], [2420.4, 710.1], [2428.6, 713.9], [2435.2, 717.1], [2440.2, 719.8], [2443.4, 721.9], [2445.1, 723.6], [2446.2, 725.1], [2446.9, 726.5], [2447.1, 727.9], [2446.9, 729.1], [2446.7, 730.1], [2446.6, 730.7], [2446.5, 731.0]], [[1751.0, 1006.5], [1751.2, 1006.7], [1751.5, 1007.0], [1751.9, 1007.4], [1752.6, 1008.1], [1752.6, 1009.0], [1751.9, 1010.2], [1750.7, 1011.8], [1748.8, 1013.7], [1745.2, 1015.7], [1739.7, 1017.9], [1732.5, 1020.2], [1723.5, 1022.8], [1714.8, 1024.2], [1706.4, 1024.6], [1698.4, 1023.9], [1690.6, 1022.1], [1683.4, 1021.0], [1676.6, 1020.5], [1670.4, 1020.6], [1664.6, 1021.4], [1659.2, 1022.4], [1654.2, 1023.6], [1649.6, 1025.1], [1645.4, 1026.9], [1642.0, 1028.0], [1639.5, 1028.5], [1637.9, 1028.4], [1637.1, 1027.6], [1636.6, 1027.1], [1636.2, 1026.7], [1636.0, 1026.5]]];
FRONTS.forEach((pts) => K.front({ pts, sideA: "carth", sideB: "rome", t: 0, dur: 0.8, width: 15, until: END }));
const LV = LivingK(B);
LV.clouds({ n: 7, opacity: 0.24 });
LV.scaleBar(1714.41); LV.north();

const [ex, ey] = G(50.9, 10.9), [nx, ny] = G(49.35, -1.1), [lx, ly] = G(51.6, -1.2);
B.camera([[0, 1560, 790, 0.7], [T_COAST, 1500, 780, 0.74], [T_ENG, 1250, 720, 0.95], [S2, 1240, 740, 1.05], [T_13, 1180, 760, 1.6], [T_MISSION, nx + 10, ny - 10, 2.6], [END, nx + 20, ny - 5, 2.75]]);
B.showDate(0.2); B.date("5 JUNE 1944", 0.4, null, 34);
// the emblem stamped into Germany (reference), with a deep boom
B.image("assets/media/emblem_ger.png", ex - 190, ey - 190, 380, 380, { t: T_FOUR - 0.3, dur: 1.4, opacity: 0.8 });  // owner: the emblem stays (no fade)
SFX("ref:boom", T_FOUR - 0.3);
const box = (txt, x, y, t, size = 26, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.32em;padding:${Math.round(size * 0.2)}px ${Math.round(size * 0.35)}px ${Math.round(size * 0.2)}px ${Math.round(size * 0.6)}px;font-size:${size}px;box-shadow:0 2px 8px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
box("OCCUPIED FRANCE", ...G(46.8, 2.4), T_COAST, 20, T_13);
box("OCCUPIED NORWAY", ...G(61.0, 9.0), T_COAST + 0.4, 18, T_13);
box("GREAT BRITAIN", ...G(53.2, -1.6), T_ENG - 0.2, 18, T_MISSION);
const flag = (src, name, x, y, t, until, w = 90) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><img src="${src}" style="width:${w}px;display:block;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:22px;color:#f7f3ea;text-shadow:0 2px 4px #000;letter-spacing:0.08em">${name}</div></div>`, x, y, { t, pop: true, until });
flag("assets/media/ussr_flag.png", "USSR", ...G(51.0, 26.8), T_FOUR + 0.6);  // owner: the Soviet Union must be visible too
flag("assets/media/uk_flag.png", "BRITAIN", ...G(52.0, -3.6), T_ENG + 0.1, T_13); flag("assets/media/us_flag_48star.png", "USA", ...G(51.4, -4.6), T_ENG + 0.4, T_13);
GG.card(`<div style="display:flex;gap:26px;font-size:22px;letter-spacing:0.08em;align-items:center"><span><b style="display:inline-block;width:20px;height:20px;background:#2c57b7;height:6px;box-shadow:0 0 8px #2c57b7;vertical-align:4px;margin-right:8px;border:1px solid #f7f3ea"></b>ALLIES</span><span><b style="display:inline-block;width:20px;height:20px;background:#bc2528;height:6px;box-shadow:0 0 8px #bc2528;vertical-align:4px;margin-right:8px;border:1px solid #f7f3ea"></b>AXIS</span></div>`, "tr", 40, T_FOUR, S2);
SFX("ref:whoosh", T_ENG - 0.4);
// night falls; the transport stream crosses the Channel and turns east over the Cotentin's west coast
GG.layer("background: rgba(4,8,22,0.42);", T_HOURS, END + 1, { dur: 1.2 });
SFX("ref:whoosh", T_13 - 0.3); SFX("ref:riser", T_MISSION - 1.8);
// owner 2026-10-06: the transports fly over the drop zone, release their sticks of paratroopers as they pass, then carry on east over
// the coast and turn back north for England, leaving the map (they never stop in mid-air)
const along = (pts, k) => { let L = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); L += d; }
  return seg.slice(0, k).reduce((a, b) => a + b, 0) / L; };   // fraction of the flight at which point k is reached
for (let i = 0; i < 5; i++) {  // owner: fewer planes, more space between them
  const y0 = ly + i * 12 - 24, t = T_HOURS + 0.4 + i * 0.6, jx = i * 6 - 12, jy = i * 7 - 14;
  const pts = [[lx - 20 + i * 10, y0], [nx - 50, ny - 30 + jy], [nx - 34, ny - 8 + jy], [nx - 8 + jx, ny - 6 + jy], [nx + 24 + jx, ny - 12 + jy], [nx + 34, ny - 70], [nx + 12, ny - 170]];
  const dur = 7.0;
  K.aircraft({ kind: "c47g", side: "carth", size: 30, alt: 9, pts, t, dur, until: t + dur, sfx: i % 2 ? false : undefined });
  const tDrop = t + dur * along(pts, 3);   // over the drop zone
  for (let c = 0; c < 3; c++) GG.chute(nx - 14 + jx + c * 6, ny - 4 + jy + (c % 2) * 4, tDrop - 0.25 + c * 0.2, { s: 9, until: END + 1 });
}
const card = GG.card(`<div style="display:flex;align-items:center;gap:40px;font-weight:700;letter-spacing:0.04em"><div style="text-align:center"><div style="font-size:72px;line-height:1;color:#6f9bff">13,000</div><div style="font-size:20px;letter-spacing:0.3em;color:#c9d6ff">PARATROOPERS</div></div><div class="c2" style="text-align:center"><div style="font-size:72px;line-height:1;color:#6f9bff">800+</div><div style="font-size:20px;letter-spacing:0.3em;color:#c9d6ff">PLANES</div></div></div>`, "gg-odds", 820, T_13 - 0.2, T_DARK + 0.6);
card.querySelector(".inner").style.padding = "16px 54px 20px"; GG.hide(card.querySelector(".c2"));
B.tl.fromTo(card.querySelector(".c2"), { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, T_800); SFX("hit", T_13); SFX("hit", T_800);
box("COTENTIN PENINSULA", nx - 6, ny - 26, T_MISSION + 0.3, 8);
B.caption("JUMP BEHIND THE BEACHES IN THE DARK · SEIZE THE ROADS", T_MISSION, END + 1, "carth r");
K.raiseTerritory();
B.finish();
