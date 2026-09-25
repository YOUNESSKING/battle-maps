// Ending: Morgan's stake and the three battles light up as they are named; slow, calm pull-out. East map (z7).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

// ---------- projection (assets/east.json: zoom 7, origin 7980, 11794) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 7, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 7980).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 11794).toFixed(1)];
};

// glowing battle marker (same look as hook2): pulse ring + numbered disc + name/year label
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
  const pulse = (tp) => [0, 0.9].forEach((d) => {
    B.tl.set(ring, { autoAlpha: 1, scale: 0.35 }, tp + d);
    B.tl.to(ring, { autoAlpha: 0, scale: 1.25, duration: 1.3, ease: "power2.out" }, tp + d + 0.01);
  });
  B.tl.fromTo(disc, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "back.out(2.5)" }, t);
  pulse(t);
  B.tl.fromTo(lab, { autoAlpha: 0, x: o.left ? 20 : -20 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, t + 0.2);
  return { el, pulse };
};

const T_SAR = at("ending-1", "Saratoga"), T_COW = at("ending-1", "Cowpens"), T_GUI = at("ending-1", "Guilford Courthouse");
const T_STUDY = at("ending-1", "Military officers"), T_WEAK = at("ending-1", "He looked at his weakest");

// ---------- camera: from the stake, one slow pull-out that ends on all three battles ----------
const WIN = G(39.18, -78.16);
B.camera([
  [0, 1290, 600, 1.9],
  [T_SAR - 0.6, 1380, 530, 1.2],
  [T_COW - 0.6, 1260, 790, 1.0],
  [T_GUI + 1.2, 1320, 720, 0.86],
  [END, 1330, 712, 0.8],
]);

B.image("assets/east_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.showDate(0.3);
B.date("1777 – 1781", 0.5);
B.portraitStake({ img: "assets/media/morgan_head.png", flag: "assets/media/us_flag_13star.png", name: "DANIEL MORGAN", x: WIN[0], y: WIN[1], size: 1.0, t: 0.4 });
B.city("WINCHESTER", WIN[0], WIN[1], { size: 22, r: 7, t: 1.0, dy: 10 });
B.caption("THE OLD WAGONER", 1.2, T_SAR - 1.2, "carth");

marker(1, "SARATOGA", "1777", 43.0, -73.63, T_SAR - 0.2, { left: true });
const cow = marker(2, "COWPENS", "1781", 35.13, -81.81, T_COW - 0.2, { left: true });
marker(3, "GUILFORD COURTHOUSE", "1781", 36.13, -79.85, T_GUI - 0.2);
cow.pulse(T_STUDY + 1.0);
B.finish();
