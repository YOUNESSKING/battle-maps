// Hook-in (korea basemap): the whole peninsula on 27 Nov 1950 with the real front of that night (Eighth Army on the
// Chongchon, X Corps at the Chosin Reservoir; two-colour only where the Chinese were in contact), red / blue territory
// ("E" look), units on screen in frame 1, odds card 15,000 VS 120,000 (ticking counters), -30°F stamp, night falls on
// "On the night of", then the accelerating dive onto the Chosin Reservoir. Hands off to "hook" (chosin) with a 0.6 s dissolve.
// HAND-OFF TIMES (abs, must match tools/assemble_full.py hook_composite() offsets 9.8 and 56.2):
//   python3 tools/build_scene.py hook-in  korea  hook-1 hook-1 --to 10.4               (dissolve into "hook" 9.8-10.4 s)
//   python3 tools/build_scene.py hook     chosin hook-1 hook-3 --from 9.8 --to 56.8    (dissolve into "hook-out" 56.2-56.8 s)
//   python3 tools/build_scene.py hook-out korea  hook-2 hook-3 --from 56.2             (runs to the start of the archive paragraph)
const B = Battle();
const { at, tl } = B;
const END = B.T.duration;
const T_A = END - 0.6; // start of the dissolve into "hook" (abs 9.8)
const K = FXK(B);
// GLOBE OPENING TEST v3: hand-off at 3.0 s at the map camera view (1440,810, scale 0.667); during the 1 s dissolve
// globe and map zoom together to (1405,745, 0.787), then the map eases on (px/radian = 65536/2pi / cos(lat) * scale).
GLOBE(B, { from: [18, 20], lat: 38.29, lon: 127.59, endScale: 8866, lat2: 38.62, lon2: 127.40, endScale2: 10509, red: [408, 156], blue: [410], t: 0, turn: 1.4, zoom: 1.6, fade: 1.0, lift: 90 });

const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 54556).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 24399).toFixed(1)];
};
const H1 = "hook-1";
const T_120 = at(H1, "A hundred and twenty"), T_COLD = at(H1, "Thirty degrees"), T_NIGHT = at(H1, "On the night of");

// camera with zoom interpolated in log space + per-segment ease: keys [t, cx, cy, s, ease]
const logCamera = (keys) => {
  const world = document.getElementById("world"), W = 1920, H = 1080;
  const cam = { cx: keys[0][1], cy: keys[0][2], ls: Math.log(keys[0][3]) };
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const apply = () => {
    const s = Math.max(Math.exp(cam.ls), W / 2880), cx = clamp(cam.cx, W / 2 / s, 2880 - W / 2 / s), cy = clamp(cam.cy, H / 2 / s, 1620 - H / 2 / s);
    gsap.set(world, { x: W / 2 - cx * s, y: H / 2 - cy * s, scale: s });
  };
  apply();
  for (let i = 1; i < keys.length; i++) {
    const [t0] = keys[i - 1], [t1, cx, cy, s, ease] = keys[i];
    tl.to(cam, { cx, cy, ls: Math.log(s), duration: Math.max(t1 - t0, 0.01), ease: ease || "sine.inOut", onUpdate: apply }, t0);
  }
};
// chosin basemap framing (1440,810,0.667) and (1470,760,0.82) expressed on the korea basemap (x8 zoom)
const C2K = (x, y) => [(446141 + x) / 8 - 54556, (197446 + y) / 8 - 24399];
const K1 = C2K(1440, 810), K2 = C2K(1470, 760);
logCamera([
  [0, 1440, 810, 0.667],
  [3.0, 1440, 810, 0.667, "none"],
  [4.0, 1405, 745, 0.787, "none"],
  [5.2, 1395, 725, 0.80, "sine.out"],
  [T_NIGHT + 0.6, 1395, 640, 0.98, "sine.inOut"],
  [T_A, K1[0], K1[1], 0.667 * 8, "power1.in"],
  [T_A + 0.6, K2[0], K2[1], 0.82 * 8, "none"],
]);
K.grid(G, 33.5, 43.5, 121, 133, 0.5, 0);

// ---------- helpers (screen / world layers) ----------
const scene = document.getElementById("scene"), world = document.getElementById("world"), ov = document.getElementById("overlay");
const screenEl = (html, css) => {
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  scene.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el;
};
const worldLayer = (css) => { // full-map layer between the relief and the overlay (units and lines stay above it)
  const el = document.createElement("div"); el.style.cssText = `position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none;${css}`;
  world.insertBefore(el, ov); gsap.set(el, { autoAlpha: 0 }); return el;
};
const shown = (el) => gsap.set(el, { autoAlpha: 1 }); // on screen from frame 1

// ---------- the front on the night of 27 November 1950 ----------
// contact front (west coast -> Chongchon -> Tokchon -> mountains -> Yudam-ni -> east shore of the reservoir):
// drawn west -> east, so sideA (left of travel) = north = Chinese red, sideB = south = UN blue
const FRONT = [[39.62, 125.14], [39.70, 125.5], [39.78, 125.9], [39.74, 126.3], [39.95, 126.62], [40.24, 126.92], [40.46, 127.07], [40.53, 127.33]].map(([a, b]) => G(a, b));
// X Corps' advance line in the north-east (7th Division on the Yalu at Hyesan): not in contact -> blue only
const NE = [[40.53, 127.33], [40.8, 127.72], [41.15, 128.05], [41.42, 128.4], [41.62, 128.95]].map(([a, b]) => G(a, b));
const MASK = "assets/korea_land.png";
const fr = K.front({ pts: FRONT, sideA: "rome", sideB: "carth", t: 0, dur: 0.05, until: T_A - 1.0 });
const ne = K.front({ pts: NE, sideA: "carth", sideB: "carth", t: 0, dur: 0.05, until: T_A - 1.0 });
K.frontTint({ pts: FRONT, dir: -1, depth: 170, color: "#a8503c", t: 0, dur: 0.01, alpha: 0.34, mask: MASK, until: T_A - 2.0 });
K.frontTint({ pts: [...FRONT, ...NE.slice(1)], dir: 1, depth: 170, color: "#4a6a9a", t: 0, dur: 0.01, alpha: 0.34, mask: MASK, until: T_A - 2.0 });

// ---------- units on screen in frame 1 ----------
const U = [
  // [id, side, x, y, size, icon, flag, label]
  ["e8", "carth", ...G(39.45, 125.85), "XXXX", "infantry", "us", "8TH ARMY"],
  ["md", "carth", ...G(40.25, 127.38), "XX", "infantry", "us", "1ST MARINE DIV"],
  ["d7", "carth", ...G(40.95, 128.28), "XX", "infantry", "us", null],
  ["g13", "rome", ...G(40.25, 125.7), "XXXX", "infantry", "prc", "13TH ARMY GROUP"],
  ["g9", "rome", ...G(40.95, 126.75), "XXXX", "infantry", "prc", "9TH ARMY GROUP"],
  ["a1", "rome", ...G(40.05, 124.95), "XXX", "infantry", "prc", null],
  ["a2", "rome", ...G(40.3, 126.3), "XXX", "infantry", "prc", null],
  ["a3", "rome", ...G(40.78, 127.5), "XXX", "infantry", "prc", null],
];
U.forEach(([id, side, x, y, size, icon, flag, label]) => {
  B.unit({ id, side, x, y, w: 60, h: 40, label });
  K.counter(id, { icon, flag, size });
  shown(B.units[id].el);
});
B.hideUnits(U.map((u) => u[0]), T_A - 1.3, 0.7);

// ---------- labels ----------
B.showDate(0.2);
B.date("27 NOVEMBER 1950", 0.3, null, 38);
B.label("CHINA", ...G(41.9, 123.8), { cls: "country", size: 66, t: 0.3, until: T_A - 2.2 });
B.label("NORTH KOREA", ...G(38.95, 126.55), { cls: "country", size: 44, t: 0.5, until: T_A - 2.2 });
B.label("SEA OF JAPAN", ...G(39.1, 130.6), { cls: "sea", size: 42, t: 0.8, until: T_A - 2.2 });
B.label("YELLOW SEA", ...G(37.2, 124.3), { cls: "sea", size: 42, t: 0.9, until: T_A - 2.2 });

// ---------- odds card: 15,000 VS 120,000, counters ticking (screen, bottom) ----------
const odds = screenEl(`<div style="display:flex;align-items:center;gap:40px;padding:18px 60px 22px;background:rgba(18,16,12,0.9);border-top:6px solid #c9b48a;box-shadow:0 20px 40px rgba(0,0,0,0.5);font-weight:700;letter-spacing:0.04em">
  <div style="text-align:center"><div class="nb" style="font-size:118px;line-height:1;color:#6f9bff">0</div><div style="font-size:26px;letter-spacing:0.3em;color:#c9d6ff">U.S. MARINES</div></div>
  <div class="vs" style="font-size:50px;color:#c9b48a">VS</div>
  <div class="red" style="text-align:center"><div class="nr" style="font-size:118px;line-height:1;color:#ff5b5b">0</div><div style="font-size:26px;letter-spacing:0.3em;color:#ffc4c4">CHINESE</div></div></div>`,
  "left:0;right:0;top:790px;display:flex;justify-content:center;");
const oddsIn = odds.firstElementChild;
tl.fromTo(odds, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0);
tl.fromTo(oddsIn, { scale: 1.35 }, { scale: 1, duration: 0.3, ease: "power4.in" }, 0);
[odds.querySelector(".vs"), odds.querySelector(".red")].forEach((el) => gsap.set(el, { autoAlpha: 0 }));
tl.fromTo(odds.querySelector(".vs"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, T_120 - 0.1);
tl.fromTo(odds.querySelector(".red"), { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power4.in" }, T_120);
const fmt = (v) => Math.round(v).toLocaleString("en-US");
const cb = { v: 0 }, cr = { v: 0 }, nb = odds.querySelector(".nb"), nr = odds.querySelector(".nr");
tl.to(cb, { v: 15000, duration: 1.2, ease: "power2.out", onUpdate: () => { nb.textContent = fmt(cb.v); } }, 0.1);
tl.to(cr, { v: 120000, duration: 1.8, ease: "power2.out", onUpdate: () => { nr.textContent = fmt(cr.v); } }, T_120 + 0.1);
tl.to(odds, { autoAlpha: 0, y: 30, duration: 0.5 }, T_NIGHT - 0.3);

// ---------- -30°F stamp ----------
const cold = screenEl(`<div style="font-family:'Special Elite',monospace;font-size:120px;color:#e8f1ff;border:10px solid #e8f1ff;border-radius:12px;padding:0 34px;rotate:-7deg;background:rgba(20,34,60,0.35);text-shadow:0 3px 10px rgba(0,0,0,0.6);box-shadow:0 0 30px rgba(160,200,255,0.35)">−30°F</div>`,
  "right:130px;top:190px;");
tl.fromTo(cold, { autoAlpha: 0, scale: 2.3 }, { autoAlpha: 0.95, scale: 1, duration: 0.3, ease: "power4.in" }, T_COLD);
tl.to(cold, { autoAlpha: 0, duration: 0.6 }, T_A - 1.9);
B.snow(T_COLD, END + 2);

// ---------- night falls: palette muted, Chinese armies strike ----------
const night = worldLayer("background: radial-gradient(ellipse 70% 60% at 50% 40%, rgba(10,18,44,0.58), rgba(4,8,22,0.8));");
tl.to(night, { autoAlpha: 1, duration: 2.2, ease: "sine.inOut" }, T_NIGHT);
K.night({ lines: [fr, ne], tOn: T_NIGHT });
[
  [G(40.45, 125.85), G(39.64, 126.08)], [G(40.55, 126.45), G(39.78, 126.6)], [G(41.0, 127.05), G(40.44, 127.2)],
].forEach(([a, b], i) => B.arrow({ side: "rome", pts: [a, [(a[0] + b[0]) / 2 + 14, (a[1] + b[1]) / 2], b], width: 22, t: T_NIGHT + 0.5 + i * 0.3, dur: 1.2, until: T_A - 1.3 }));

// ---------- target: Chosin ----------
const CH = G(40.385, 127.253);
K.target(CH[0], CH[1], T_NIGHT + 0.8, { r: 34, until: T_A - 0.6 });
B.label("CHOSIN RESERVOIR", CH[0] + 48, CH[1] - 20, { cls: "tg", size: 30, t: T_NIGHT + 1.0, until: T_A - 1.2, anchor: [0, -50] });
K.raiseTerritory();

// ---------- sound cues: only on visible beats ----------
SFX("hit", 0.1);            // odds card slams in
SFX("hit", T_120 + 0.25);   // 120,000 slams in
for (let t = 0.15; t < 1.3; t += 0.2) SFX("tick", t);             // 15,000 counting up
for (let t = T_120 + 0.4; t < T_120 + 1.9; t += 0.2) SFX("tick", t); // 120,000 counting up
SFX("whoosh", T_A - 0.9);   // accelerating dive onto the Chosin Reservoir (fastest at the hand-off)
B.finish();
