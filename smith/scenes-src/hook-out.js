// Hook-out: reverse hand-off from "hook" (chosin) to the whole red/blue peninsula, then hook-3 (Smith cut-out + bio card)
// over the zoomed-out map with a blue pulse on Chosin.
// Build: python3 tools/build_scene.py hook-out korea hook-2 hook-3 --from 54.9   (crossfade window 54.9-55.5 s)
const B = Battle();
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
const K2 = C2K(1400, 700), K1 = C2K(1440, 810);
logCamera([
  [0, K2[0], K2[1], 0.82 * 8],
  [0.6, K1[0], K1[1], 0.667 * 8, "none"],
  [4.6, 1343, 800, 0.72, "power1.out"],
  [END, 1343, 820, 0.7, "sine.inOut"],
]);

// ---------- red / blue ----------
B.image("assets/hook_red.png", 0, 0, 2880, 1620, { t: 0.6, dur: 1.8 });
B.image("assets/hook_blue.png", 0, 0, 2880, 1620, { t: 0.6, dur: 1.8 });
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
B.finish();
