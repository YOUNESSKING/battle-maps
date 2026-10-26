// Hook 2-3: Daniel Morgan bio card over the dimmed East map, then his stake in Virginia and the three battles.
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

// ---------- projection (assets/east.json: zoom 7, origin 7980, 11794) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 7, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 7980).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 11794).toFixed(1)];
};

// glowing battle marker: pulse ring + numbered disc + name/year label (world coords)
const marker = (num, name, year, lat, lon, t, o = {}) => {
  const [x, y] = G(lat, lon), r = o.r || 28, sz = o.size || 40;
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:0;height:0;`;
  el.innerHTML = `<div class="mk-ring" style="position:absolute;left:${-r * 2}px;top:${-r * 2}px;width:${r * 4}px;height:${r * 4}px;border-radius:50%;border:${r * 0.22}px solid #f2c14e;box-shadow:0 0 ${r}px #f2c14e"></div>
    <div class="mk-disc" style="position:absolute;left:${-r}px;top:${-r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:#1f4fc4;border:${r * 0.16}px solid #f7f3ea;box-shadow:0 0 ${r * 0.9}px 4px rgba(242,193,78,0.95),0 4px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:${r * 1.15}px;line-height:1">${num}</div>
    <div class="mk-lab place city" style="position:absolute;${o.left ? `right:${r + 12}px;text-align:right;` : `left:${r + 12}px;`}top:${-sz * 0.72}px;font-size:${sz}px;white-space:nowrap">${name} <span style="color:#ffd98a">${year}</span></div>`;
  document.getElementById("pins").appendChild(el);
  const ring = el.querySelector(".mk-ring"), disc = el.querySelector(".mk-disc"), lab = el.querySelector(".mk-lab");
  gsap.set([ring, disc, lab], { autoAlpha: 0 });
  B.tl.fromTo(disc, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "back.out(2.5)" }, t);
  [0, 0.9].forEach((d) => {
    B.tl.set(ring, { autoAlpha: 1, scale: 0.35 }, t + d);
    B.tl.to(ring, { autoAlpha: 0, scale: 1.25, duration: 1.3, ease: "power2.out" }, t + d + 0.01);
  });
  B.tl.fromTo(lab, { autoAlpha: 0, x: o.left ? 20 : -20 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, t + 0.2);
  if (o.until != null) B.tl.to([disc, lab], { autoAlpha: 0, duration: 0.5 }, o.until);
  return el;
};

const H3 = P("hook-3");
const T_45 = at("hook-3", "forty-five years old"), T_ARTH = at("hook-3", "crippled by arthritis");
const T_PLAN = at("hook-3", "the battle plan"), T_STUD = at("hook-3", "still studied");
const T_HOW = at("hook-3", "So how did"), T_BEST = at("hook-3", "best troops"), T_LOOK = at("hook-3", "Let's take a closer look"), T_THREE = at("hook-3", "three greatest");

// ---------- camera ----------
const WIN = G(39.18, -78.16);
B.camera([
  [0, 1330, 790, 1.05],
  [H3 - 0.4, 1300, 720, 1.25],
  [H3 + 2.6, 1290, 640, 1.6],
  [T_PLAN, 1270, 700, 1.55],
  [T_HOW - 0.2, 1200, 820, 1.2],
  [T_BEST - 0.6, 1300, 900, 0.9],
  [T_LOOK + 0.6, 1330, 700, 0.9],
  [END, 1330, 705, 0.96],
]);

B.image("assets/east_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });

// ---------- hook-2: bio card over the dimmed map ----------
B.dim(0, H3 - 0.3);
gsap.set(document.getElementById("date"), { autoAlpha: 0 });
B.showDate(H3 + 0.2);
B.bio({
  photo: "assets/media/morgan_full.png",
  name: "DANIEL MORGAN",
  rows: ["Brigadier General, Continental Army", "Born c. 1736 · Virginia frontier", "Teamster · \u201cThe Old Wagoner\u201d", "Struck a British officer, 1756", "Sentenced to 500 lashes · took <b>499</b>"],
  rowT: [at("hook-2", "Brigadier General"), at("hook-2", "almost no formal"), at("hook-2", "teamster"), at("hook-2", "struck a British officer"), at("hook-2", "four hundred and ninety-nine") - 0.6],
  t: 0.2,
  until: B.end("hook-2") + 0.1,
});

// ---------- hook-3: Morgan in Virginia ----------
B.date("1781", H3 + 0.3);
B.label("VIRGINIA", ...G(37.9, -78.6), { cls: "country", size: 40, t: H3 + 0.4, until: T_45 });
B.portraitStake({ img: "assets/media/morgan_head.png", flag: "assets/media/us_flag_13star.png", name: "DANIEL MORGAN", x: WIN[0], y: WIN[1], size: 1.0, t: H3 + 0.8 });
B.city("WINCHESTER", WIN[0], WIN[1], { size: 24, r: 7, t: H3 + 1.4, dy: 10 });
B.caption("AGE 45 · ARTHRITIS · SCIATICA", T_45 + 0.2, T_PLAN - 0.3, "carth");
B.caption("HIS JANUARY 1781 PLAN · STILL STUDIED BY OFFICERS TODAY", T_PLAN + 0.2, T_HOW - 0.3, "carth");

// "the best troops in the British Empire": redcoat garrisons drop in along the coast
[[40.71, -74.0, "NEW YORK"], [32.78, -79.93, "CHARLESTON"], [34.25, -80.61, "CAMDEN"], [32.08, -81.09, "SAVANNAH"]].forEach(([la, lo, n], i) => {
  const [x, y] = G(la, lo);
  B.unit({ id: "gb" + i, side: "rome", x: x + 30, y: y - 4, w: 46, h: 30, t: T_BEST - 0.6 + i * 0.25 });
});
B.caption("A WAGON DRIVER AGAINST THE BRITISH EMPIRE", T_HOW + 0.3, T_LOOK - 0.3, "rome");
B.hideUnits(["gb0", "gb1", "gb2", "gb3"], T_LOOK + 0.2, 0.6);

// the three moves light up
const T_M = [T_LOOK + 0.6, T_THREE - 0.2, T_THREE + 0.9];
marker(1, "SARATOGA", "1777", 43.0, -73.63, T_M[0], { left: true });
marker(2, "COWPENS", "1781", 35.13, -81.81, T_M[1], { left: true });
marker(3, "GUILFORD COURTHOUSE", "1781", 36.13, -79.85, T_M[2]);
B.finish();
