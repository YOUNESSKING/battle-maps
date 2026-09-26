// Hook 3: theater map (TN/KY/GA). Thomas portrait stake; three glowing markers light up as the
// narration names his three moves (Chickamauga, Chattanooga/Missionary Ridge, Nashville).
// Basemap: theater.json — zoom 9, origin_world_px [32857, 50973].
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

const G = (lat, lon) => {
  const n = 256 * 2 ** 9, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 32857).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 50973).toFixed(1)];
};

// ---------- media available at render time (checked by ls before final build; falls back to a plaque) ----------
const HAS = { thomas_head: true, us_flag_35star: true };

// glowing numbered battle marker: pulse ring + disc + label (world coords)
const marker = (num, name, sub, lat, lon, t, o = {}) => {
  const [x, y] = G(lat, lon), r = o.r || 30, sz = o.size || 40;
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:0;height:0;`;
  el.innerHTML = `<div class="mk-ring" style="position:absolute;left:${-r * 2}px;top:${-r * 2}px;width:${r * 4}px;height:${r * 4}px;border-radius:50%;border:${r * 0.22}px solid #f2c14e;box-shadow:0 0 ${r}px #f2c14e"></div>
    <div class="mk-disc" style="position:absolute;left:${-r}px;top:${-r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:#c4121f;border:${r * 0.16}px solid #f7f3ea;box-shadow:0 0 ${r * 0.9}px 4px rgba(242,193,78,0.95),0 4px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:${r * 1.15}px;line-height:1">${num}</div>
    <div class="mk-lab place tg" style="position:absolute;${o.left ? `right:${r + 12}px;text-align:right;` : `left:${r + 12}px;`}top:${-sz * 0.62}px;font-size:${sz}px;white-space:nowrap">${name}<br><span style="font-size:${sz * 0.6}px;opacity:0.85">${sub}</span></div>`;
  document.getElementById("pins").appendChild(el);
  const ring = el.querySelector(".mk-ring"), disc = el.querySelector(".mk-disc"), lab = el.querySelector(".mk-lab");
  gsap.set([ring, disc, lab], { autoAlpha: 0 });
  B.tl.fromTo(disc, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "back.out(2.5)" }, t);
  [0, 0.9].forEach((d) => {
    B.tl.set(ring, { autoAlpha: 1, scale: 0.35 }, t + d);
    B.tl.to(ring, { autoAlpha: 0, scale: 1.25, duration: 1.3, ease: "power2.out" }, t + d + 0.01);
  });
  B.tl.fromTo(lab, { autoAlpha: 0, x: o.left ? 20 : -20 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, t + 0.2);
  return el;
};

// ---------- places (Chickamauga/Ridge markers nudged apart slightly for legibility) ----------
const CHATT = G(35.046, -85.310), CHICK = G(34.75, -85.30), NASH = G(36.163, -86.782);
const ATL = G(33.749, -84.388), KNOX = G(35.961, -83.921), LAF = G(34.705, -85.282);
const RIDGE_MK = G(35.03, -85.20);

// ---------- times ----------
const H3 = P("hook-3");
const T_ANN = at("hook-3", "annihilation");
const T_CLIMB = at("hook-3", "could not be climbed");
const T_MAP2 = at("hook-3", "off the map");
const T_BEAT = at("hook-3", "hard to beat");
const T_LOOK = at("hook-3", "closer look");
const T_THREE = at("hook-3", "three greatest tactical moves");

// ---------- camera: tight on Thomas near Chattanooga, then pull back to the whole theater ----------
B.camera([
  [H3, CHATT[0] - 20, CHATT[1] - 60, 1.55],
  [T_ANN - 1.4, CHICK[0], CHICK[1] - 40, 1.2],
  [T_CLIMB - 1.2, RIDGE_MK[0] - 30, RIDGE_MK[1], 1.15],
  [T_MAP2 - 1.2, NASH[0] + 60, NASH[1] + 40, 1.05],
  [T_LOOK, 1440, 810, 0.667],
  [END, 1440, 810, 0.667],
]);
gsap.set(document.getElementById("date"), { autoAlpha: 0 });

// ---------- state / geography context ----------
B.label("TENNESSEE", 1185, 420, { cls: "country", size: 40, t: H3 + 0.3, until: T_ANN - 1 });
B.label("GEORGIA", 1877, 1300, { cls: "country", size: 40, t: H3 + 0.5, until: T_ANN - 1 });
B.label("KENTUCKY", 1440, 60, { cls: "country", size: 34, t: H3 + 0.7, until: T_ANN - 1 });
B.city("KNOXVILLE", ...KNOX, { size: 20, r: 6, t: H3 + 1.0, dy: -8, until: T_LOOK });
B.city("ATLANTA", ...ATL, { size: 20, r: 6, t: H3 + 1.2, dy: -8, left: true, until: T_LOOK });
B.city("LAFAYETTE", ...LAF, { size: 16, r: 4, t: H3 + 1.4, dy: 16, until: T_ANN - 1 });

// ---------- Thomas portrait stake (fades before the markers crowd the same ground) ----------
const stakeX = CHATT[0] - 90, stakeY = CHATT[1] - 40;
if (HAS.thomas_head) {
  B.portraitStake({ img: "assets/media/thomas_head.png", flag: HAS.us_flag_35star ? "assets/media/us_flag_35star.png" : "", name: "GEORGE H. THOMAS", x: stakeX, y: stakeY, size: 0.95, t: H3 + 0.4, until: T_ANN - 0.8 });
} else {
  B.plaque({ name: "GEORGE H. THOMAS", role: "Major General, USA", side: "carth", x: stakeX, y: stakeY + 60, t: H3 + 0.4, until: T_ANN - 0.8 });
}
B.city("CHATTANOOGA", ...CHATT, { size: 20, r: 6, t: H3 + 1.6, dy: 16, until: T_ANN - 0.8 });

// ---------- the three moves light up as they're named ----------
marker(1, "CHICKAMAUGA", "SEPT 1863", 34.75, -85.30, T_ANN, { left: false });
marker(2, "MISSIONARY RIDGE", "NOV 1863", 35.03, -85.20, T_CLIMB, { left: false });
marker(3, "NASHVILLE", "DEC 1864", 36.163, -86.782, T_MAP2, { left: true });

B.caption("A VIRGINIAN WHO NEVER LOST A BATTLE HE COMMANDED", H3 + 3.0, T_ANN - 0.5);
B.caption("THREE TACTICAL MOVES, FIFTEEN MONTHS", T_THREE - 0.3, END, "carth");

B.finish();
