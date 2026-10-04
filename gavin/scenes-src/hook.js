// HOOK: the Waal crossing, Nijmegen, 20 September 1944 (hook-1 .. hook-2). Basemap: nijmegen (z15) + water mask (the Waal).
// First frame: units on screen (boats on the south bank, German guns on the north bank). Sides: US/British = blue, German = red.
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const RAIL_N = [1382, 682], RAIL_S = [1400, 808], ROAD_N = [1744, 752], ROAD_S = [1760, 908];
const LAUNCH = [1085, 612], LAND = [1035, 420];
GG.water("assets/nijmegen_water.png", 0, { alpha: 0.85 });
K.grid(GG.proj(15, 4329295, 2775666), 51.83, 51.875, 5.80, 5.93, 0.01, 0);
// bridges
const bridge = (a, b, w) => GG.road([a, b], { w });
bridge(RAIL_N, RAIL_S, 7); bridge(ROAD_N, ROAD_S, 10);
GG.lbl("RAILWAY BRIDGE", RAIL_S[0] + 20, RAIL_S[1] + 30, { size: 18, anchor: [0, -50], t: 0 });
GG.lbl("ROAD BRIDGE", ROAD_S[0] + 24, ROAD_S[1] + 26, { size: 22, color: "#fff6d8", anchor: [0, -50], t: 0 });
B.label("THE WAAL", 1230, 640, { cls: "river", size: 34, rot: 28, t: 0, instant: true });
GG.lbl("NIJMEGEN", 1960, 1180, { size: 30, t: 0 });
GG.lbl("LENT", 1560, 470, { size: 20, t: 0 });
const p = (n) => "hook-" + n;
const T_TWO = at(p(1), "Two hundred"), T_RIVER = at(p(1), "A river"), T_DAY = at(p(1), "in broad daylight"), T_GUNS = at(p(1), "German guns"), T_PADDLE = at(p(1), "There were not enough");
const S2 = P(p(2)), T_KNEW = at(p(2), "knew exactly"), T_BEFORE = at(p(2), "Before dark"), T_TANKS = at(p(2), "British tanks"), T_BRIDGE = at(p(2), "the bridge his division");

B.camera([
  [0, 1180, 600, 1.35],
  [T_RIVER, 1150, 560, 1.45],
  [T_PADDLE + 1.5, 1120, 520, 1.6],
  [S2 - 0.1, 1120, 520, 1.6],
  [S2 + 0.25, 1600, 760, 1.15],             // flash-forward snap (the one zoom sound)
  [T_TANKS + 0.5, 1700, 800, 1.45],
  [END, 1720, 800, 1.55],
]);

// boats on the south bank from the first frame
const boat = (x, y, t) => GG.pin(`<svg width="30" height="16" viewBox="0 0 30 16" style="display:block;overflow:visible;filter:drop-shadow(0 2px 2px rgba(0,0,0,0.6))"><path d="M1 3 L29 3 L24 14 L6 14 Z" fill="#1f4fc4" stroke="#f3eee2" stroke-width="2"/></svg>`, x, y, { t });
const BOATS = [];
for (let i = 0; i < 26; i++) {
  const x = 980 + (i % 13) * 22 + (i > 12 ? 11 : 0), y = 640 + (i % 13) * 9 + (i > 12 ? 22 : 0);
  BOATS.push([boat(x, y, 0.05 + (i % 13) * 0.03), x, y]);
}
// German guns and machine guns along the north bank and the bridge ends
const RED = [["r1", 1120, 455, "artillery"], ["r2", 1270, 560, "infantry"], ["r3", 1400, 640, "aa"], ["r4", 1560, 690, "infantry"], ["r5", ROAD_N[0] + 30, ROAD_N[1] - 30, "artillery"], ["r6", 1840, 975, "infantry"]];
RED.forEach(([id, x, y, icon], i) => { B.unit({ id, side: "rome", x, y, w: 32, h: 22, t: 0.1 + i * 0.1 }); K.counter(id, { icon, flag: "ger", size: icon === "infantry" ? "I" : undefined }); });
SFX("hit", T_TWO + 0.1);
const odds = GG.card(`<div style="display:flex;align-items:center;gap:34px;font-weight:700;letter-spacing:0.04em">
  <div style="text-align:center"><div style="font-size:92px;line-height:1;color:#6f9bff">260</div><div style="font-size:24px;letter-spacing:0.3em;color:#c9d6ff">MEN · 26 CANVAS BOATS</div></div>
  <div class="vs" style="font-size:48px;color:#c9b48a">VS</div>
  <div class="red" style="text-align:center"><div style="font-size:64px;line-height:1.1;color:#ff5b5b">GUNS ON THE<br>FAR BANK</div></div></div>`, "gg-odds", 820, 0.6, T_PADDLE - 0.2);
odds.querySelector(".inner").style.padding = "18px 54px 22px";
[odds.querySelector(".vs"), odds.querySelector(".red")].forEach((el) => GG.hide(el));
B.tl.fromTo(odds.querySelector(".vs"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, T_GUNS - 0.3);
B.tl.fromTo(odds.querySelector(".red"), { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power4.in" }, T_GUNS - 0.1);
SFX("hit", T_GUNS);
// ~300 m of open water
const bar = GG.pin(`<svg width="40" height="200" viewBox="0 0 40 200" style="display:block;overflow:visible;transform:rotate(-38deg)"><line x1="20" y1="4" x2="20" y2="196" stroke="#1b1812" stroke-width="7"/><line x1="20" y1="4" x2="20" y2="196" stroke="#fbfaf6" stroke-width="3.5" stroke-dasharray="10 6"/><line x1="6" y1="4" x2="34" y2="4" stroke="#fbfaf6" stroke-width="4"/><line x1="6" y1="196" x2="34" y2="196" stroke="#fbfaf6" stroke-width="4"/></svg>`, 1185, 545, { t: T_RIVER, until: T_PADDLE + 1 });
GG.lbl("~300 M OF OPEN WATER", 1250, 520, { size: 18, anchor: [0, -50], t: T_RIVER + 0.2, until: T_PADDLE + 1 });
GG.sun(1460, 330, { s: 80, t: T_DAY, until: S2 });
// the boats push off under fire: tracers, flak, shells in the water (boom + locked shake on every impact)
BOATS.forEach(([el, x, y], i) => B.tl.to(el, { x: 120 + ((i * 17) % 40) - 20, y: -185 + ((i * 11) % 30) - 15, duration: 7.5, ease: "none" }, T_GUNS + 0.6 + (i % 13) * 0.12));
[[1120, 455], [1270, 560], [1400, 640], [1270, 560], [1120, 455], [1400, 640]].forEach(([x, y], i) => {
  const t = T_GUNS + 1.0 + i * 0.9;
  GG.arc(x, y, 1060 + (i * 23) % 80, 560 - (i * 17) % 70, t, { h: 0, color: "#ff6a5a", dash: "10 7", width: 3, dur: 0.5, until: t + 0.9 });
  SFX("mg", t);
});
[[1060, 560], [1120, 520], [1010, 500], [1090, 470], [1150, 560]].forEach(([x, y], i) => {
  const t = T_GUNS + 1.6 + i * 1.1;
  K.gun(1120, 455, t - 0.6, { unit: "r1" });
  K.impact(x, y, t, { r: 12, puffs: 2 });
});
[3, 9, 17].forEach((k, i) => B.tl.to(BOATS[k][0], { autoAlpha: 0.25, duration: 0.6 }, T_GUNS + 2.6 + i * 1.2));
B.caption("NOT ENOUGH PADDLES: SOME ROWED WITH THEIR RIFLE BUTTS", T_PADDLE, S2 - 0.2, "carth r");

// ---------- hook-2: flash-forward to the evening ----------
GG.whiteFlash(S2);
SFX("whoosh", S2 - 0.2); SFX("hit", S2 + 0.05);   // the one zoom sound of the hook
GG.layer("background: linear-gradient(to left, rgba(255,140,60,0.36), rgba(120,60,90,0.2) 55%, rgba(30,30,70,0.16));", S2, END + 1, { dur: 0.4 });
B.date("20 SEPT 1944 · EVENING", S2 + 0.2, END + 1, 30);
B.showDate(S2 + 0.1);
BOATS.forEach(([el]) => GG.fadeOut(el, S2, 0.2));
["r1", "r2", "r3", "r4", "r5", "r6"].forEach((id) => B.grey([id], S2 + 0.3, 0.3));
B.hideUnits(["r1", "r2", "r3", "r4", "r5", "r6"], S2 + 1.2, 0.5);
B.unit({ id: "pn", side: "carth", x: ROAD_N[0] - 10, y: ROAD_N[1] - 40, w: 36, h: 24, label: "US PARATROOPERS", t: S2 + 0.4 });
K.counter("pn", { icon: "infantry", flag: "us", size: "II" });
K.target(ROAD_N[0], ROAD_N[1] + 20, T_KNEW, { r: 50, side: "carth", until: END + 1 });
[["tk1", 0], ["tk2", 1], ["tk3", 2]].forEach(([id, i]) => {
  B.unit({ id, side: "carth", x: ROAD_S[0] + 20, y: ROAD_S[1] + 60 + i * 34, w: 36, h: 22, label: i ? null : "BRITISH TANKS", t: T_TANKS - 0.6 + i * 0.2 });
  K.counter(id, { icon: "tank", flag: "uk" });
  B.move(id, T_TANKS + 0.2 + i * 0.6, 3.2, ROAD_N[0] + 4 + i * 6, ROAD_N[1] - 70 - i * 30, "power1.inOut");
});
B.highlight([ROAD_S, ROAD_N], T_BRIDGE, null, 40);
GG.stamp("BEFORE DARK: THE BRIDGE WAS THEIRS", T_BEFORE + 0.4, END + 0.5);
B.finish();
