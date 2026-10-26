// Hook: the Mediterranean c. 527 AD. Romans / Byzantines = blue ("carth"), Persians, Vandals, Goths = red ("rome").
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = "hook-empire";

// ---------- projection (assets/med.json: zoom 6) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 6, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 7753).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 5567).toFixed(1)];
};

// ---------- scene-local helpers ----------
const pins = document.getElementById("pins");
const multi = (el, lh = 1.05) => { el.style.whiteSpace = "pre"; el.style.textAlign = "center"; el.style.lineHeight = lh; return el; };
// pulsing target marker: bright dot + expanding rings (finite repeats, seek-safe)
const pulse = (x, y, t, until, color = "#ffd75e") => {
  const g = document.createElement("div");
  g.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:0;height:0;`;
  const core = document.createElement("div");
  core.style.cssText = `position:absolute;left:-15px;top:-15px;width:30px;height:30px;border-radius:50%;background:${color};border:4px solid #1b1812;box-shadow:0 0 18px 6px rgba(255,215,94,0.75);`;
  g.appendChild(core);
  const rings = [0, 1].map(() => {
    const r = document.createElement("div");
    r.style.cssText = `position:absolute;left:-30px;top:-30px;width:60px;height:60px;border-radius:50%;border:6px solid ${color};`;
    g.appendChild(r); return r;
  });
  pins.appendChild(g);
  gsap.set(g, { autoAlpha: 0 });
  B.tl.fromTo(g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, t);
  B.tl.fromTo(core, { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(3)" }, t);
  const reps = Math.max(Math.floor((until - t) / 1.4) - 1, 0);
  rings.forEach((r, i) => B.tl.fromTo(r, { scale: 0.5, opacity: 0.95 }, { scale: 2.8, opacity: 0, duration: 1.4, ease: "power1.out", repeat: reps }, t + 0.2 + i * 0.7));
  if (until != null && until < END) B.tl.to(g, { autoAlpha: 0, duration: 0.4 }, until);
  return g;
};
// capital star
const star = (x, y, t) => {
  const s = document.createElement("div");
  s.textContent = "★";
  s.style.cssText = `position:absolute;left:${x - 22}px;top:${y - 27}px;width:44px;text-align:center;font-size:44px;line-height:54px;color:#ffd75e;text-shadow:0 0 3px #1b1812,0 0 3px #1b1812,0 2px 6px rgba(0,0,0,0.8);`;
  pins.appendChild(s);
  gsap.set(s, { autoAlpha: 0 });
  B.tl.fromTo(s, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(3)" }, t);
  return s;
};

// ---------- timing ----------
const T_W = at(K, "The old Western"), T_ITALY = at(K, "Italy belonged"), T_AFR = at(K, "North Africa"),
  T_PERSIA = at(K, "in the east"), T_JUST = at(K, "Justinian dreamed"), T_BACK = at(K, "taking it all back"),
  T_BEL = at(K, "gave that job"), T_FEW = at(K, "almost always");

// ---------- camera: one long slow push ----------
B.camera([
  [0, 1440, 800, 0.667],
  [T_JUST, 1480, 780, 0.685],
  [END, 1500, 770, 0.71],
]);

// ---------- date ----------
B.showDate(0.2);
B.date("527 AD", 0.4);

// ---------- the empires ----------
B.image("assets/emp_rome.png", 0, 0, 2880, 1620, { t: 0.5, dur: 1.6 });
const lRome = multi(B.label("EASTERN ROMAN\nEMPIRE", ...G(39.3, 33.2), { cls: "country", size: 50, t: 1.0 }));
star(...G(41.01, 28.98), 1.6);
B.label("CONSTANTINOPLE", G(41.01, 28.98)[0] - 10, G(41.01, 28.98)[1] - 30, { cls: "city", size: 30, t: 1.8, anchor: [0, -100] });
B.label("(CAPITAL)", G(41.01, 28.98)[0] + 30, G(41.01, 28.98)[1] + 2, { cls: "city", size: 22, t: 2.0, anchor: [0, -50] });
B.caption("THE WEST HAS FALLEN · ONLY THE EAST REMAINS", T_W + 0.6, T_ITALY - 0.2, "carth");

B.image("assets/emp_goth.png", 0, 0, 2880, 1620, { t: T_ITALY, dur: 1.2 });
B.label("OSTROGOTHIC KINGDOM", ...G(42.35, 13.1), { cls: "country", size: 30, rot: 46, t: T_ITALY + 0.3, until: T_BACK - 0.4 });
B.image("assets/emp_vandal.png", 0, 0, 2880, 1620, { t: T_AFR, dur: 1.2 });
multi(B.label("VANDAL\nKINGDOM", ...G(33.6, 6.8), { cls: "country", size: 40, t: T_AFR + 0.3 }));
B.image("assets/emp_persia.png", 0, 0, 2880, 1620, { t: T_PERSIA, dur: 1.2 });
multi(B.label("SASSANID\nPERSIA", ...G(34.2, 48.4), { cls: "country", size: 50, t: T_PERSIA + 0.3 }));
B.label("MEDITERRANEAN SEA", ...G(34.6, 18.2), { cls: "sea", size: 34, t: 2.4 });

// ---------- Justinian's plan: take it all back ----------
const CP = G(41.01, 28.98), CARTH = G(36.853, 10.323), ROMA = G(41.9, 12.5), DARA = G(37.177, 40.953);
B.arrow({ side: "carth", pts: [[CP[0] - 26, CP[1] + 18], [1500, 760], [1150, 820], [CARTH[0] + 80, CARTH[1] + 5]], width: 14, t: T_BACK - 0.3, dur: 2.0, dash: null });
B.arrow({ side: "carth", pts: [[CP[0] - 30, CP[1] + 4], [1500, 560], [1250, 560], [ROMA[0] + 75, ROMA[1] + 10]], width: 14, t: T_BACK + 0.3, dur: 2.0 });
pulse(...CARTH, T_BEL - 0.9, END);
pulse(...ROMA, T_BEL - 0.5, END);
pulse(...DARA, T_BEL - 0.1, END);
B.label("CARTHAGE", CARTH[0] + 4, CARTH[1] - 34, { cls: "city", size: 30, t: T_BEL - 0.7, anchor: [-50, -100] });
B.label("ROME", ROMA[0] - 30, ROMA[1] + 4, { cls: "city", size: 30, t: T_BEL - 0.3, anchor: [-100, -50] });
B.label("DARA", DARA[0] - 30, DARA[1] + 4, { cls: "city", size: 30, t: T_BEL + 0.1, anchor: [-100, -50] });
B.caption("JUSTINIAN'S GENERAL: BELISARIUS", T_BEL + 0.2, T_FEW + 0.2, "carth");
B.caption("ALMOST ALWAYS OUTNUMBERED", T_FEW + 0.5, END - 0.3, "carth");
B.finish();
