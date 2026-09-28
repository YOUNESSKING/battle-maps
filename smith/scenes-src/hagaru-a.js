// hagaru-a: Korea, Oct-Nov 1950. UN armies race north; X Corps lands on the east coast; Marines sent to the Chosin Reservoir.
// UN = blue ("carth"), North Korean / Chinese = red ("rome").
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

// projection (assets/korea.json: zoom 8)
const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 54556).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 24399).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));

const T_RACE = at("hagaru-1", "raced north"), T_YALU = at("hagaru-1", "Yalu River");
const T_SMITH = at("hagaru-1", "Smith's division"), T_COAST = at("hagaru-1", "east coast");
const T_MTN = at("hagaru-1", "ordered into the mountains"), T_LAKE = at("hagaru-1", "vast frozen lake");
const T_CHOSIN = at("hagaru-1", "Chosin Reservoir");

// ---------- camera: wide peninsula, drift north with the armies, then push in on the east coast / Chosin ----------
B.camera([
  [0, 1330, 760, 0.72],
  [T_RACE, 1300, 720, 0.8],
  [T_SMITH - 0.5, 1180, 640, 0.98],
  [T_MTN, 1420, 520, 1.45],
  [END, 1395, 400, 2.05],
]);

// ---------- base layers ----------
B.image("assets/korea_north.png", 0, 0, 2880, 1620, { t: 0.2, dur: 1.4, opacity: 0.7 });
B.image("assets/korea_south.png", 0, 0, 2880, 1620, { t: 0.4, dur: 1.4 });
// the Chosin Reservoir itself (water overlay of the chosin basemap, scaled from zoom 11 to zoom 8)
B.image("assets/chosin_water.png", 446141 / 8 - 54556, 197446 / 8 - 24399, 360, 202.5, { t: 0.5, dur: 1.0 });
B.river(GL([[39.86, 124.2], [40.1, 124.42], [40.3, 124.72], [40.46, 124.96], [40.7, 125.35], [40.95, 125.85], [41.15, 126.29], [41.45, 126.55], [41.75, 126.85]]), 7);

// ---------- title ----------
B.title("MOVE 2", "HAGARU-RI", "NOVEMBER 1950", 0.25, T_RACE - 0.3);

// ---------- labels ----------
B.showDate(T_RACE - 0.6);
B.date("OCTOBER 1950", T_RACE - 0.4, T_MTN - 0.3);
B.date("NOVEMBER 1950", T_MTN, null);
B.label("CHINA", ...G(41.3, 123.4), { cls: "country", size: 66, t: T_RACE - 0.2, until: T_MTN + 1.0 });
B.label("NORTH KOREA", ...G(39.55, 126.6), { cls: "country", size: 46, t: T_RACE - 0.3, until: T_RACE + 0.9 });
B.label("SEA OF JAPAN", ...G(39.3, 130.0), { cls: "sea", size: 40, t: T_RACE + 0.3, until: T_MTN + 0.6 });
B.label("YELLOW SEA", ...G(37.6, 124.2), { cls: "sea", size: 40, t: T_RACE + 0.4, until: T_SMITH + 1.0 });
const yalu = B.label("YALU RIVER", ...G(40.72, 124.95), { cls: "river", size: 30, t: T_YALU - 0.7, until: T_MTN + 0.6 });
gsap.set(yalu, { xPercent: -50, yPercent: -50, rotation: -35 });
B.city("SEOUL", ...G(37.57, 126.98), { left: true, size: 30, t: T_RACE - 0.2, until: T_SMITH + 1.0 });
B.city("PYONGYANG", ...G(39.03, 125.75), { left: true, size: 30, t: T_RACE + 0.6, until: T_MTN + 0.6 });
B.city("INCHON", ...G(37.47, 126.63), { left: true, size: 26, r: 7, t: 0.6, until: T_SMITH });

// ---------- UN armies race north (Eighth Army in the west) ----------
const racePaths = [
  [[37.75, 126.85], [38.5, 126.3], [39.25, 125.75], [39.85, 125.0]],
  [[37.8, 127.35], [38.65, 126.95], [39.55, 126.55], [40.35, 126.15]],
  [[37.85, 127.9], [38.75, 127.6], [39.6, 127.15], [40.3, 127.05]],
];
racePaths.forEach((pts, i) => B.arrow({ side: "carth", pts: GL(pts), width: 18, t: T_RACE + 0.1 + i * 0.35, dur: 2.4, until: T_SMITH + 0.6 }));
const eighth = [[39.8, 125.25], [40.0, 125.8], [40.15, 126.35]];
eighth.forEach(([la, lo], i) =>
  B.unit({ id: "e" + i, side: "carth", x: G(la, lo)[0], y: G(la, lo)[1], w: 38, h: 38, label: i === 1 ? "EIGHTH ARMY" : null, t: T_RACE + 2.4 + i * 0.2 }));
B.units.e1.el.querySelector(".tag").style.fontSize = "15px";
B.caption("UN ARMIES RACE FOR THE YALU", T_RACE + 0.5, T_SMITH - 0.2, "carth");

// the Chinese border flashes: the line the armies were driving toward
B.highlight(GL([[39.86, 124.2], [40.3, 124.72], [40.7, 125.35], [41.15, 126.29], [41.75, 126.85]]), T_YALU - 0.2, null, 26);

// ---------- X Corps lands on the east coast ----------
B.city("WONSAN", ...G(39.15, 127.44), { left: true, size: 28, t: T_SMITH - 0.2 });
B.city("HUNGNAM", ...G(39.83, 127.62), { size: 26, r: 7, t: T_COAST + 0.6 });
B.arrow({ side: "white", pts: GL([[38.95, 129.2], [39.1, 128.4], [39.17, 127.62]]), width: 16, t: T_SMITH, dur: 1.6 });
B.unit({ id: "m1", side: "carth", x: G(39.3, 127.62)[0], y: G(39.3, 127.62)[1], w: 38, h: 38, label: "1ST MARINE DIV.", t: T_COAST });
B.units.m1.el.querySelector(".tag").style.fontSize = "15px";
B.caption("SMITH'S MARINES LAND ON THE EAST COAST", T_SMITH + 0.2, T_MTN - 0.2, "carth");

// ---------- into the mountains, toward the reservoir ----------
B.arrow({ side: "carth", pts: GL([[39.38, 127.58], [39.62, 127.58], [39.9, 127.5], [40.12, 127.38], [40.33, 127.28]]), width: 12, t: T_MTN + 0.2, dur: 2.8 });
B.move("m1", T_MTN + 0.3, 3.4, ...G(40.18, 127.36), "power1.inOut");
B.snow(T_MTN - 0.5, END + 1);
const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
const [rx, ry] = G(40.47, 127.24);
ring.setAttribute("cx", rx); ring.setAttribute("cy", ry); ring.setAttribute("r", 34);
ring.setAttribute("fill", "none"); ring.setAttribute("stroke", "#f7f3ea"); ring.setAttribute("stroke-width", 5); ring.setAttribute("stroke-dasharray", "10 6");
document.getElementById("overlay").appendChild(ring);
gsap.set(ring, { autoAlpha: 0, scale: 2.2, transformOrigin: "50% 50%" });
B.tl.to(ring, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "power3.out" }, T_LAKE);
B.label("CHOSIN RESERVOIR", rx - 44, ry, { cls: "tg", size: 30, t: T_CHOSIN - 0.4, anchor: [-100, -50] });
B.finish();
