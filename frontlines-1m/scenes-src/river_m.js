// RIVER (m-1 .. m-2), MERGED style test (dark terrain, crimson north bank, stamped emblem, white-box labels): the Waal crossing at Nijmegen, 20 Sept 1944. South bank Allied / north bank German
// (strong territory colours + flags); 26 boats push off under fire; shells in the water (locked boom + shake on every impact);
// about half the boats are lost; the rest land; the north bank turns blue up to the road bridge; the bridge is theirs.
// Positions from the approved hook (gavin/scenes-src/hook.js).
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const RAIL_N = [1382, 682], RAIL_S = [1400, 808], ROAD_N = [1744, 752], ROAD_S = [1760, 908];
const T_26 = at("m-1", "Twenty-six"), T_260 = at("m-1", "Two hundred"), T_300 = at("m-1", "Three hundred"), T_GUNS = at("m-1", "under the German"), S2 = PS("m-2");
const T_HALF = at("m-2", "Half of the boats"), T_REST = at("m-2", "The rest do"), T_NIGHT = at("m-2", "by nightfall"), T_THEIRS = at("m-2", "is theirs");
B.image("assets/media/nijmegen_ctlm_before.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01, until: T_REST + 1.2 });
B.image("assets/media/nijmegen_ctlm_after.png", 0, 0, 2880, 1620, { t: T_REST + 0.6, dur: 1.4 });
K.grid(GG.proj(15, 4329295, 2775666), 51.83, 51.875, 5.80, 5.93, 0.01, 0);
const bridge = (a, b, w) => GG.road([a, b], { w });
bridge(RAIL_N, RAIL_S, 7); bridge(ROAD_N, ROAD_S, 10);
GG.lbl("RAILWAY BRIDGE", RAIL_S[0] + 20, RAIL_S[1] + 30, { size: 18, anchor: [0, -50], t: 0 });
GG.lbl("ROAD BRIDGE", ROAD_S[0] + 24, ROAD_S[1] + 26, { size: 22, color: "#fff6d8", anchor: [0, -50], t: 0 });
// reference-style labels: white boxes, black widely spaced capitals, slide in (tick on each)
const box = (txt, x, y, t, size = 26) => { SFX("tick", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.32em;padding:5px 10px 5px 16px;font-size:${size}px;box-shadow:0 2px 8px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t }); };
B.image("assets/media/emblem_ger.png", 1170, 40, 420, 420, { t: 0.3, dur: 1.4, opacity: 0.75, until: T_REST + 1.0 });
box("THE WAAL", 930, 470, 0.6, 24); box("NIJMEGEN", 1960, 1180, 0.9, 26); box("GERMAN-HELD NORTH BANK", 1500, 420, 1.2, 22);
B.camera([[0, 1200, 640, 1.25], [T_GUNS, 1160, 585, 1.45], [S2 + 1.5, 1185, 560, 1.52], [T_NIGHT, 1520, 700, 1.2], [END, 1575, 725, 1.3]]);
B.showDate(0.1);
B.date("20 SEPT 1944 · 15:00", 0.3, T_NIGHT - 0.2, 32);
B.date("20 SEPT 1944 · 19:00", T_NIGHT, null, 32);
const flag = (src, name, x, y, t, w = 100) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><img src="${src}" style="width:${w}px;display:block;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:22px;color:#f7f3ea;text-shadow:0 2px 4px #000,0 0 10px rgba(0,0,0,0.8);letter-spacing:0.08em">${name}</div></div>`, x, y, { t, pop: true });
flag("assets/media/us_flag_48star.png", "US 82ND AIRBORNE", 900, 800, 0.7);
// boats on the south bank, German guns on the north bank
const boat = (x, y, t) => GG.pin(`<svg width="30" height="16" viewBox="0 0 30 16" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.6))"><path d="M1 3 L29 3 L24 14 L6 14 Z" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2"/></svg>`, x, y, { t });
const BOATS = [];
for (let i = 0; i < 26; i++) { const x = 980 + (i % 13) * 22 + (i > 12 ? 11 : 0), y = 640 + (i % 13) * 9 + (i > 12 ? 22 : 0); BOATS.push(boat(x, y, 0.1 + (i % 13) * 0.04)); }
const RED = [["r1", 1120, 455, "artillery"], ["r2", 1270, 560, "infantry"], ["r3", 1400, 640, "aa"], ["r4", 1560, 690, "infantry"], ["r5", ROAD_N[0] + 30, ROAD_N[1] - 30, "artillery"]];
RED.forEach(([id, x, y, icon], i) => { B.unit({ id, side: "rome", x, y, w: 32, h: 22, t: 0.3 + i * 0.1 }); K.counter(id, { icon, flag: "ger", size: icon === "infantry" ? "I" : undefined }); });
// the numbers
const odds = GG.card(`<div style="display:flex;align-items:center;gap:40px;font-weight:700;letter-spacing:0.04em">
  <div class="c1" style="text-align:center"><div style="font-size:80px;line-height:1;color:#6f9bff">26</div><div style="font-size:22px;letter-spacing:0.3em;color:#c9d6ff">BOATS</div></div>
  <div class="c2" style="text-align:center"><div style="font-size:80px;line-height:1;color:#6f9bff">260</div><div style="font-size:22px;letter-spacing:0.3em;color:#c9d6ff">MEN</div></div></div>`, "gg-odds", 840, T_26 - 0.2, T_GUNS + 0.4);
odds.querySelector(".inner").style.padding = "16px 54px 20px";
GG.hide(odds.querySelector(".c2")); B.tl.fromTo(odds.querySelector(".c2"), { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, T_260);
SFX("hit", T_26); SFX("hit", T_260);
// ~300 m of open water: bank-to-bank bar (measured on the water mask, see hook.js)
const W1 = [1230, 719], W2 = [1292, 638], NX = 0.79, NY = 0.613;
const barG = document.createElementNS("http://www.w3.org/2000/svg", "g");
const tick = (q) => `<line x1="${q[0] - NX * 14}" y1="${q[1] - NY * 14}" x2="${q[0] + NX * 14}" y2="${q[1] + NY * 14}" stroke="#fbfaf6" stroke-width="4" stroke-linecap="round"/>`;
barG.innerHTML = `<line x1="${W1[0]}" y1="${W1[1]}" x2="${W2[0]}" y2="${W2[1]}" stroke="#1b1812" stroke-width="7" stroke-linecap="round"/><line x1="${W1[0]}" y1="${W1[1]}" x2="${W2[0]}" y2="${W2[1]}" stroke="#fbfaf6" stroke-width="3.5" stroke-dasharray="9 6"/>${tick(W1)}${tick(W2)}`;
document.getElementById("overlay").appendChild(barG); GG.hide(barG);
B.tl.fromTo(barG, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, T_300); B.tl.to(barG, { autoAlpha: 0, duration: 0.4 }, T_GUNS + 1.2);
GG.lbl("~300 M OF OPEN WATER", W2[0] - 30, W2[1] - 26, { size: 18, anchor: [-100, -50], t: T_300 + 0.1, until: T_GUNS + 1.2 });
SFX("hit", T_300);
// push off; tracers; shells in the water (locked impact = boom + shake); half the boats lost
const LOST = [1, 3, 4, 6, 9, 11, 13, 14, 16, 19, 21, 22, 24];
BOATS.forEach((el, i) => {
  const t0 = T_300 + 0.4 + (i % 13) * 0.08 + (i > 12 ? 0.4 : 0);
  if (LOST.includes(i)) { const th = T_GUNS + 1.0 + ((i * 7) % 13) * ((T_REST - T_GUNS - 1.0) / 13);
    B.tl.to(el, { x: 60 + (i % 5) * 6, y: -90 - (i % 4) * 8, duration: th - t0, ease: "none" }, t0);
    B.tl.to(el, { autoAlpha: 0.2, filter: "grayscale(1)", duration: 0.5 }, th); GG.fadeOut(el, th + 1.2, 0.6);
  } else B.tl.to(el, { x: 120 + ((i * 17) % 40) - 20, y: -185 + ((i * 11) % 30) - 15, duration: T_REST + 0.4 - t0, ease: "sine.inOut" }, t0);
});
[[1120, 455], [1270, 560], [1400, 640], [1270, 560], [1120, 455], [1400, 640], [1270, 560]].forEach(([x, y], i) => {
  const t = T_GUNS + 0.3 + i * 1.0;
  GG.arc(x, y, 1060 + (i * 23) % 80, 560 - (i * 17) % 70, t, { h: 0, color: "#ff6a5a", dash: "10 7", width: 3, dur: 0.5, until: t + 0.9 });
  SFX("mg", t);
});
[[1060, 560], [1120, 520], [1010, 500], [1090, 470], [1150, 560], [1040, 530]].forEach(([x, y], i) => {
  const t = T_GUNS + 1.0 + i * ((T_REST - T_GUNS - 1.2) / 6);
  K.gun(1120, 455, t - 0.6, { unit: "r1" });
  K.impact(x, y, t, { r: 12, puffs: 2 });
});
B.caption("ABOUT HALF THE BOATS NEVER MADE IT ACROSS", T_HALF, T_REST + 1.5, "carth r");
// the far bank: blue sweeps east to both bridges, the German positions fall, the road bridge is taken
B.arrow({ side: "carth", pts: [[1080, 470], [1250, 545], [RAIL_N[0], RAIL_N[1] - 40], [1560, 655], [ROAD_N[0] - 10, ROAD_N[1] - 30]], width: 12, t: T_REST + 0.6, dur: 2.6 });
["r1", "r2", "r3", "r4", "r5"].forEach((id, i) => B.grey([id], T_REST + 1.0 + i * 0.45, 0.3));
B.hideUnits(["r1", "r2", "r3", "r4", "r5"], T_THEIRS, 0.5);
B.highlight([ROAD_S, ROAD_N], T_THEIRS, null, 40);
GG.stamp("THE BRIDGE IS THEIRS", T_THEIRS + 0.3, END + 1);
const blk = document.createElement("div"); blk.style.cssText = "position:absolute;inset:0;background:#000;opacity:0;z-index:50"; document.getElementById("scene").appendChild(blk);
B.tl.to(blk, { opacity: 1, duration: 1.0 }, END - 1.0);
K.raiseTerritory();
B.finish();
