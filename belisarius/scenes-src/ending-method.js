// Ending: the method. Dark parchment; DARA, TRICAMARUM, ROME light up one by one with the three method lines.
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = "ending-method";

const G = (lat, lon) => {
  const n = 256 * 2 ** 6, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 7753).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 5567).toFixed(1)];
};
const pins = document.getElementById("pins");
const world = document.getElementById("world");

const glow = (x, y, t, until) => { // marker that lights up: warm glow + dot + expanding rings
  const g = document.createElement("div");
  g.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:0;height:0;`;
  const halo = document.createElement("div");
  halo.style.cssText = "position:absolute;left:-90px;top:-90px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle, rgba(255,215,94,0.75) 0%, rgba(255,190,60,0.3) 38%, rgba(255,190,60,0) 70%);";
  const core = document.createElement("div");
  core.style.cssText = "position:absolute;left:-17px;top:-17px;width:34px;height:34px;border-radius:50%;background:#ffd75e;border:4px solid #1b1812;box-shadow:0 0 22px 8px rgba(255,215,94,0.8);";
  g.appendChild(halo); g.appendChild(core);
  const ring = document.createElement("div");
  ring.style.cssText = "position:absolute;left:-32px;top:-32px;width:64px;height:64px;border-radius:50%;border:6px solid #ffd75e;";
  g.appendChild(ring);
  pins.appendChild(g);
  gsap.set(g, { autoAlpha: 0 });
  B.tl.fromTo(g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, t);
  B.tl.fromTo(core, { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(3)" }, t);
  B.tl.fromTo(halo, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "power2.out" }, t);
  const reps = Math.max(Math.floor((until - t) / 1.8) - 1, 0);
  B.tl.fromTo(ring, { scale: 0.5, opacity: 1 }, { scale: 3.0, opacity: 0, duration: 1.8, ease: "power1.out", repeat: reps }, t + 0.3);
  return g;
};

const T1 = at(K, "Shape the battlefield"), T2 = at(K, "Strike what holds"), T3 = at(K, "Make time fight"),
  T_RULES = at(K, "Three simple rules"), T_NEXT = at(K, "which commander");

B.camera([
  [0, 1440, 810, 0.667],
  [END, 1440, 760, 0.7],
]);
B.dateBox(0, null);

// darker parchment: the dimmer sits inside the world, under the markers, so they glow above it
const dim = B.dim(0, END + 1, 0.78);
world.insertBefore(dim, document.getElementById("overlay"));
dim.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;background:rgba(8,8,10,0.62);";

const DARA = G(37.177, 40.953), TRIC = G(36.78, 9.95), ROMA = G(41.9, 12.5);
glow(...DARA, T1 + 0.15, END);
B.label("DARA", DARA[0] + 40, DARA[1], { cls: "city", size: 44, t: T1 + 0.3, anchor: [0, -50] });
B.label("530", DARA[0] + 40, DARA[1] + 46, { cls: "city", size: 30, t: T1 + 0.5, anchor: [0, -50] });
glow(...TRIC, T2 + 0.15, END);
B.label("TRICAMARUM", TRIC[0] - 40, TRIC[1] - 64, { cls: "city", size: 44, t: T2 + 0.3, anchor: [-100, -50] });
B.label("533", TRIC[0] - 40, TRIC[1] - 18, { cls: "city", size: 30, t: T2 + 0.5, anchor: [-100, -50] });
glow(...ROMA, T3 + 0.15, END);
B.label("ROME", ROMA[0] - 40, ROMA[1] - 10, { cls: "city", size: 44, t: T3 + 0.3, anchor: [-100, -50] });
B.label("537–538", ROMA[0] - 40, ROMA[1] + 36, { cls: "city", size: 30, t: T3 + 0.5, anchor: [-100, -50] });

// method card, lowered so the three glowing places stay visible above it
const m = B.method(T1 + 0.05, null, [T1 + 0.15, T2, T3]);
m.style.top = "600px";
B.caption("WHO SHOULD I COVER NEXT?", T_NEXT - 0.2, null);
B.finish();
