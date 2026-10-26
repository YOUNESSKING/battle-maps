// Move 1 opener: the Roman-Persian frontier in upper Mesopotamia, summer 530. Romans = blue ("carth"), Persians = red ("rome").
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = "dara-1";

// ---------- projection (assets/mesopotamia.json: zoom 9) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 9, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 79041).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 50138).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));
const pins = document.getElementById("pins");
const svg = document.getElementById("overlay");

// small fortress glyph (walls + corner towers) in world coordinates
const fort = (x, y, s, t) => {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const h = s / 2, tw = s * 0.28;
  g.innerHTML = `<rect x="${x - h}" y="${y - h}" width="${s}" height="${s}" fill="#2f5fc4" stroke="#f7f3ea" stroke-width="${s * 0.12}"/>` +
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([dx, dy]) => `<rect x="${x + dx * h - tw / 2}" y="${y + dy * h - tw / 2}" width="${tw}" height="${tw}" fill="#1b1812" stroke="#f7f3ea" stroke-width="${s * 0.06}"/>`).join("");
  svg.appendChild(g);
  gsap.set(g, { autoAlpha: 0, scale: 0, transformOrigin: `${x}px ${y}px` });
  B.tl.to(g, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2.5)" }, t);
  return g;
};

// ---------- timing ----------
const T_FRONT = at(K, "The frontier between"), T_TURKEY = at(K, "southeastern Turkey"), T_MARCH = at(K, "A Persian army marches"),
  T_NIS = at(K, "the city of Nisibis"), T_DARA = at(K, "Roman fortress of Dara"), T_FEW = at(K, "only a few miles"),
  T_ORD = at(K, "Its orders"), T_TAKE = at(K, "take the fortress"), T_BREAK = at(K, "break the Roman frontier");

const DARA = G(37.177, 40.953), NIS = G(37.07, 41.215);

// ---------- camera ----------
B.camera([
  [0, 1440, 810, 0.667],
  [T_FRONT + 1.0, 1440, 810, 0.667],
  [T_MARCH, 1430, 805, 0.76],
  [T_NIS + 1.5, 1452, 822, 2.3],
  [T_ORD, 1450, 820, 2.45],
  [END, 1446, 818, 2.6],
]);

// ---------- title ----------
B.title("MOVE 1", "DARA", "SUMMER 530 AD", 0.3, T_FRONT + 1.0);
B.showDate(T_FRONT + 1.0);
B.date("SUMMER 530 AD", T_FRONT + 1.2);

// ---------- the two empires ----------
B.image("assets/meso_rome.png", 0, 0, 2880, 1620, { t: 0.6, dur: 1.6 });
B.image("assets/meso_persia.png", 0, 0, 2880, 1620, { t: 0.9, dur: 1.6 });
const FRONT = GL([[38.9, 41.75], [38.6, 41.6], [38.25, 41.47], [37.9, 41.35], [37.5, 41.2], [37.12, 41.08], [36.6, 40.85], [36.0, 40.6], [35.4, 40.47]]);
B.line(FRONT, { dash: "22 14", width: 6, t: T_FRONT + 0.8, dur: 2.2 });
B.label("ROMAN EMPIRE", ...G(37.55, 39.1), { cls: "country", size: 70, t: T_FRONT + 1.3, until: T_MARCH + 0.3 });
B.label("PERSIAN EMPIRE", ...G(36.55, 43.0), { cls: "country", size: 70, t: T_FRONT + 1.6, until: T_MARCH + 0.3 });
B.label("FRONTIER", G(38.2, 41.45)[0] + 30, G(38.2, 41.45)[1], { cls: "tg", size: 34, t: T_FRONT + 2.2, until: T_MARCH + 0.3, anchor: [0, -50] });
B.caption("TODAY: SOUTHEASTERN TURKEY", T_TURKEY - 1.2, T_MARCH + 1.4);

// ---------- Dara and Nisibis ----------
fort(...DARA, 22, T_FRONT + 2.0);
B.label("DARA", DARA[0] - 18, DARA[1] - 6, { cls: "city", size: 24, t: T_FRONT + 2.2, anchor: [-100, -50] });
B.label("ROMAN FORTRESS", DARA[0] - 18, DARA[1] + 18, { cls: "city", size: 13, t: T_DARA, anchor: [-100, -50] });
B.city("NISIBIS", ...NIS, { r: 7, size: 24, t: T_FRONT + 2.4 });
B.label("PERSIAN CITY", NIS[0] + 16, NIS[1] + 22, { cls: "city", size: 13, t: T_NIS, anchor: [0, -50] });

// ---------- the Persian army marches ----------
B.arrow({ side: "rome", pts: [[NIS[0] - 6, NIS[1] - 10], [NIS[0] - 44, NIS[1] - 34], [DARA[0] + 36, DARA[1] + 6]], width: 6, t: T_NIS + 0.6, dur: 2.2 });
B.label("PERSIAN ARMY", 1493, 805, { cls: "tg", size: 10, rot: 34, t: T_NIS + 1.2, anchor: [-50, -50] });
B.caption("ORDERS: TAKE DARA · BREAK THE FRONTIER", T_TAKE - 0.4, END - 0.3, "rome");
B.finish();
