// Hook-out: reverse hand-off from "hook" (chosin) to the whole red/blue peninsula, then hook-3 (Smith cut-out + bio card)
// over the zoomed-out map with a blue pulse on Chosin.
// Same Nov-1950 front + territory as hook-in (day palette now), Smith badge on "the man in command", then the bio card.
// HAND-OFF TIMES (abs, must match tools/assemble_full.py hook_composite() offsets 9.8 and 56.2):
//   python3 tools/build_scene.py hook-in  korea  hook-1 hook-1 --to 10.4               (dissolve into "hook" 9.8-10.4 s)
//   python3 tools/build_scene.py hook     chosin hook-1 hook-3 --from 9.8 --to 56.8    (dissolve into "hook-out" 56.2-56.8 s)
//   python3 tools/build_scene.py hook-out korea  hook-2 hook-3 --from 56.2             (runs to the start of the archive paragraph)
const B = Battle();
const K = FXK(B);
const { P, at, tl } = B;
const END = B.T.duration;

const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 54556).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 24399).toFixed(1)];
};
const logCamera = (keys) => { // zoom interpolated in log space + per-segment ease: keys [t, cx, cy, s, ease]
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
const C2K = (x, y) => [(446141 + x) / 8 - 54556, (197446 + y) / 8 - 24399];
const K2 = C2K(1500, 800), K1 = C2K(1440, 810); // = the last two camera keys of "hook"
logCamera([
  [0, K2[0], K2[1], 0.82 * 8],
  [0.6, K1[0], K1[1], 0.667 * 8, "none"],
  [4.6, 1360, 690, 0.76, "power1.out"],
  [END, 1360, 710, 0.74, "sine.inOut"],
]);

// ---------- the front of 27 Nov 1950 + territory (same as hook-in), fading in as the camera pulls out ----------
K.grid(G, 33.5, 43.5, 121, 133, 0.5, 0.6);
const FRONT = [[39.62, 125.14], [39.70, 125.5], [39.78, 125.9], [39.74, 126.3], [39.95, 126.62], [40.24, 126.92], [40.46, 127.07], [40.53, 127.33]].map(([a, b]) => G(a, b));
const NE = [[40.53, 127.33], [40.8, 127.72], [41.15, 128.05], [41.42, 128.4], [41.62, 128.95]].map(([a, b]) => G(a, b));
const MASK = "assets/korea_land.png";
K.front({ pts: FRONT, sideA: "rome", sideB: "carth", t: 1.0, dur: 1.6, until: END + 1 });
K.front({ pts: NE, sideA: "carth", sideB: "carth", t: 1.6, dur: 1.2, until: END + 1 });
K.frontTint({ pts: FRONT, dir: -1, depth: 170, color: "#a8503c", t: 1.0, dur: 1.6, alpha: 0.34, mask: MASK });
K.frontTint({ pts: [...FRONT, ...NE.slice(1)], dir: 1, depth: 170, color: "#4a6a9a", t: 1.0, dur: 1.6, alpha: 0.34, mask: MASK });
B.label("CHINA", ...G(41.9, 123.8), { cls: "country", size: 66, t: 1.6, until: 3.2 });
B.label("NORTH KOREA", ...G(38.95, 126.55), { cls: "country", size: 44, t: 1.8, until: 3.2 });
B.snow(0, 3.5);
gsap.set(document.getElementById("date"), { autoAlpha: 0 }); // no date scroll here

// Chosin: blue pocket pulse
const CH = G(40.385, 127.253);
const NS = "http://www.w3.org/2000/svg";
const glow = document.createElementNS(NS, "circle");
glow.setAttribute("cx", CH[0]); glow.setAttribute("cy", CH[1]); glow.setAttribute("r", 26);
glow.setAttribute("fill", "rgba(40,110,235,0.55)"); glow.setAttribute("stroke", "#9fc0ea"); glow.setAttribute("stroke-width", 4);
document.getElementById("overlay").appendChild(glow);
gsap.set(glow, { autoAlpha: 0, transformOrigin: "50% 50%" });
tl.to(glow, { autoAlpha: 1, duration: 0.8 }, 1.4);
const pulses = Math.ceil((END - 2.2) / 1.6);
tl.fromTo(glow, { scale: 0.85 }, { scale: 1.3, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: pulses * 2 - 1, immediateRender: false }, 2.2);
const ring = document.createElementNS(NS, "circle");
ring.setAttribute("cx", CH[0]); ring.setAttribute("cy", CH[1]); ring.setAttribute("r", 26);
ring.setAttribute("fill", "none"); ring.setAttribute("stroke", "#f7f3ea"); ring.setAttribute("stroke-width", 3);
document.getElementById("overlay").appendChild(ring);
gsap.set(ring, { autoAlpha: 0, transformOrigin: "50% 50%" });
tl.fromTo(ring, { autoAlpha: 0.9, scale: 1 }, { autoAlpha: 0, scale: 2.6, duration: 1.6, ease: "power1.out", repeat: pulses - 1, immediateRender: false }, 2.2);
B.label("CHOSIN", CH[0] + 40, CH[1], { cls: "tg", size: 38, t: 2.0, anchor: [0, -50] });

// ---------- hook-3: O.P. Smith ----------
const H3 = P("hook-3");
const T_MAN = at("hook-3", "the man in command");
K.badge({ name: "MAJ. GEN. O.P. SMITH", role: "1ST MARINE DIVISION", photo: "assets/media/smith_head.png", flag: "us", side: "carth", corner: "tr", t: T_MAN, until: 5.6 });
B.dim(2.6, END + 1, 0.55);
const bio = B.bio({
  photo: "assets/media/smith_full.png",
  name: "OLIVER P. SMITH",
  rows: ["Major General, USMC", "Born 1893 · California", "Commander, 1st Marine Division", "“The Professor”"],
  rowT: [4.2, at("hook-3", "fifty-seven"), at("hook-3", "Californian") + 0.6, at("hook-3", "the Professor") - 0.4],
  t: 3.0,
  until: END - 0.05,
});
Object.assign(bio.photo.querySelector("img").style, { height: "860px", left: "10px" });
Object.assign(bio.card.style, { left: "1290px", top: "300px", width: "600px", padding: "32px 38px 38px" });
bio.card.querySelector(".h").style.fontSize = "64px";
bio.card.querySelectorAll(".row").forEach((r) => { r.style.fontSize = "33px"; });
// ---------- sound cues (locked kit, levels in tools/sfx_mix_lib.py): only on visible beats ----------
SFX("whoosh", 0.4);   // fast pull-back from Chosin to the whole peninsula (continues the hook zoom-out)
SFX("hit", 3.4);      // Smith cut-out + bio card slam in (the badge plays its own whoosh)
K.raiseTerritory();
B.finish();
