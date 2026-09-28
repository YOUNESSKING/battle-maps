// Hook-in: whole peninsula from above (red north + China, blue south), then an accelerating zoom onto the
// Chosin Reservoir during the first sentence. Hands off to "hook" (chosin basemap) with a 0.6 s crossfade.
// Build: python3 tools/build_scene.py hook-in korea hook-1 hook-1 --to 7.0   (hand-off window 6.4-7.0 s)
const B = Battle();
const { at, tl } = B;
const END = B.T.duration;
const T_A = 6.4; // start of the crossfade into "hook"

const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 54556).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 24399).toFixed(1)];
};

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
  [0, 1430, 850, 0.72],
  [1.5, 1425, 820, 0.76, "sine.inOut"],
  [T_A, K1[0], K1[1], 0.667 * 8, "power1.in"],
  [T_A + 0.6, K2[0], K2[1], 0.82 * 8, "none"],
]);

// ---------- red / blue ----------
// tints fade out during the dive so the hand-off to the plain chosin relief is seamless
[B.image("assets/hook_red.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 }), B.image("assets/hook_blue.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 })]
  .forEach((el) => tl.to(el, { autoAlpha: 0, duration: 1.9, ease: "sine.inOut" }, T_A - 2.0));
B.showDate(0.2);
B.date("27 NOVEMBER 1950", 0.3, null, 38);
B.label("CHINA", ...G(41.6, 123.6), { cls: "country", size: 66, t: 0.2, until: 3.4 });
B.label("NORTH KOREA", ...G(39.35, 126.4), { cls: "country", size: 50, t: 0.4, until: 3.6 });
B.label("SOUTH KOREA", ...G(36.3, 127.9), { cls: "country", size: 50, t: 0.6, until: 3.2 });
B.label("SEA OF JAPAN", ...G(38.9, 131.0), { cls: "sea", size: 44, t: 0.8, until: 3.2 });
B.label("YELLOW SEA", ...G(36.6, 124.4), { cls: "sea", size: 44, t: 0.9, until: 3.2 });
B.label("JAPAN", 2560, 1540, { cls: "country", size: 56, t: 1.0, until: 3.0 });

// ---------- target: Chosin ----------
const CH = G(40.385, 127.253);
const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
ring.setAttribute("cx", CH[0]); ring.setAttribute("cy", CH[1]); ring.setAttribute("r", 34);
ring.setAttribute("fill", "none"); ring.setAttribute("stroke", "#f7f3ea"); ring.setAttribute("stroke-width", 6);
document.getElementById("overlay").appendChild(ring);
gsap.set(ring, { autoAlpha: 0, transformOrigin: "50% 50%" });
tl.fromTo(ring, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power2.out" }, 1.2);
tl.to(ring, { attr: { "stroke-width": 1.2 }, duration: 3.0, ease: "power2.in" }, 2.2);
tl.to(ring, { autoAlpha: 0, duration: 0.8 }, T_A - 1.2);
B.label("CHOSIN RESERVOIR", CH[0] + 44, CH[1], { cls: "tg", size: 30, t: 1.5, until: 3.6, anchor: [0, -50] });
B.snow(2.8, END + 2);
B.finish();
