// hagaru-a: Korea, Oct-Nov 1950. UN armies race north (front + territory move from the 38th parallel to the
// late-November line); X Corps lands on the east coast by sea; Marines sent to the Chosin Reservoir.
// UN = blue ("carth"), North Korean = red ("rome"). Locked style: const K = FXK(B) (smith/lib/fx.js).
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const K = FXK(B);
// sound: whoosh on big camera zooms (scale x1.6 or more within 6 s), at the fastest point of the move
const camSfx = (keys) => { for (let i = 1; i < keys.length; i++) { const r = keys[i][3] / keys[i - 1][3], d = keys[i][0] - keys[i - 1][0];
  if ((r >= 1.6 || r <= 1 / 1.6) && d <= 6) SFX("whoosh", Math.max(0, keys[i - 1][0] + d / 2 - 0.5)); } return keys; };

// projection (assets/korea.json: zoom 8)
const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 54556).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 24399).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));
const MASK = "assets/korea_land.png";

const T_RACE = at("hagaru-1", "toward the Chinese border") - 0.7, T_YALU = at("hagaru-1", "Yalu River");
const T_SMITH = at("hagaru-1", "Smith's division"), T_COAST = at("hagaru-1", "east coast");
const T_MTN = at("hagaru-1", "ordered into the mountains"), T_LAKE = at("hagaru-1", "vast frozen lake");
const T_CHOSIN = at("hagaru-1", "Chosin Reservoir");

// ---------- camera: wide peninsula, drift north with the armies, then push in on the east coast / Chosin ----------
B.camera(camSfx([
  [0, 1330, 760, 0.72],
  [T_RACE, 1300, 720, 0.8],
  [T_SMITH - 0.5, 1180, 640, 0.98],
  [T_MTN, 1420, 520, 1.45],
  [END, 1395, 400, 2.05],
]));

// ---------- base layers ----------
K.grid(G, 34.7, 41.7, 119.7, 135.5, 0.5, 0.3);
// the Chosin Reservoir itself (water overlay of the chosin basemap, scaled from zoom 11 to zoom 8)
B.image("assets/chosin_water.png", 446141 / 8 - 54556, 197446 / 8 - 24399, 360, 202.5, { t: 0.5, dur: 1.0 });
B.river(GL([[39.86, 124.2], [40.1, 124.42], [40.3, 124.72], [40.46, 124.96], [40.7, 125.35], [40.95, 125.85], [41.15, 126.29], [41.45, 126.55], [41.75, 126.85]]), 7);

// ---------- the front: 38th parallel (early October) -> late-November line, two-colour (the real contact line) ----------
// drawn west -> east: sideA (left of travel) = north = red, sideB = south = blue
const FRONT_OCT = GL([[37.85, 125.1], [38.0, 125.9], [38.1, 126.6], [38.15, 127.3], [38.2, 128.0], [38.3, 128.6]]);
const FRONT_NOV = GL([[39.85, 125.1], [40.05, 125.9], [40.25, 126.6], [40.8, 127.35], [41.25, 128.3], [41.5, 129.7]]);
const T_FRONT = 0.8, T_MOVE = T_RACE + 0.3;
const FRONT = K.front({ pts: FRONT_OCT, to: FRONT_NOV, sideA: "rome", sideB: "carth", t: T_FRONT, dur: 1.6, moveT: T_MOVE, moveDur: 3.0, until: END + 1 });
// territory ("E" look): blue behind the front to the south, red to the north; both move north with the front
K.frontTint({ pts: FRONT_OCT, to: FRONT_NOV, dir: 1, depth: 170, side: "carth", t: T_FRONT - 0.2, alpha: 0.34, mask: MASK, moveT: T_MOVE, moveDur: 3.0 });
K.frontTint({ pts: FRONT_OCT, to: FRONT_NOV, dir: -1, depth: 120, side: "rome", t: T_FRONT + 0.2, alpha: 0.34, mask: MASK, moveT: T_MOVE, moveDur: 3.0 });
B.label("38TH PARALLEL", ...G(37.93, 128.25), { cls: "tg", size: 22, t: T_FRONT + 0.8, until: T_MOVE + 0.4 });

// ---------- title ----------
B.title("MOVE 2", "HAGARU-RI", "NOVEMBER 1950", 0.25, T_RACE - 0.3);
SFX("hit", 0.45);                // MOVE 2 title card slams in

// ---------- labels ----------
B.showDate(T_RACE - 0.6);
B.date("OCTOBER 1950", T_RACE - 0.4, T_MTN - 0.3);
B.date("NOVEMBER 1950", T_MTN, null);
B.label("CHINA", ...G(41.3, 123.4), { cls: "country", size: 66, t: T_RACE - 0.2, until: T_MTN + 1.0 });
B.label("NORTH KOREA", ...G(39.25, 126.25), { cls: "country", size: 40, t: T_RACE - 0.3, until: T_RACE + 1.4 });
B.label("SEA OF JAPAN", ...G(39.3, 130.0), { cls: "sea", size: 40, t: T_RACE + 0.3, until: T_MTN + 0.6 });
B.label("YELLOW SEA", ...G(37.6, 124.2), { cls: "sea", size: 40, t: T_RACE + 0.4, until: T_SMITH - 0.4 });
const yalu = B.label("YALU RIVER", ...G(40.72, 124.95), { cls: "river", size: 30, t: T_YALU - 0.7, until: T_MTN + 0.6 });
gsap.set(yalu, { xPercent: -50, yPercent: -50, rotation: -35 });
B.city("SEOUL", ...G(37.57, 126.98), { left: true, size: 30, t: T_RACE - 0.2, until: T_SMITH + 1.0 });
B.city("PYONGYANG", ...G(39.03, 125.75), { left: true, size: 30, t: T_RACE + 1.6, until: T_MTN + 0.6 });
B.city("INCHON", ...G(37.47, 126.63), { left: true, size: 26, r: 7, t: 0.6, until: T_SMITH });

// ---------- North Korean remnants fall back north ahead of the front ----------
[[38.55, 126.1, 40.45, 126.05], [38.6, 127.6, 41.0, 127.75]].forEach(([la, lo, la2, lo2], i) => {
  const [x, y] = G(la, lo);
  B.unit({ id: "k" + i, side: "rome", x, y, w: 34, h: 34, t: T_FRONT + 0.6 + i * 0.2 });
  K.counter("k" + i, { icon: "infantry", flag: "kpa", size: "XX" });
  B.move("k" + i, T_MOVE + 0.1, 3.0, ...G(la2, lo2));
  B.hideUnits(["k" + i], T_MTN, 0.6);
});

// ---------- UN armies race north (Eighth Army in the west) ----------
const racePaths = [
  [[37.75, 126.85], [38.5, 126.3], [39.1, 125.8], [39.55, 125.3]],
  [[37.8, 127.35], [38.6, 126.95], [39.3, 126.55], [39.75, 126.0]],
  [[37.85, 127.9], [38.7, 127.6], [39.4, 127.1], [39.85, 126.7]],
];
racePaths.forEach((pts, i) => B.arrow({ side: "carth", pts: GL(pts), width: 18, t: T_RACE + 0.1 + i * 0.35, dur: 2.4, until: T_SMITH + 0.6 }));
SFX("whoosh", T_RACE + 0.1);     // UN arrows race north
const eighth = [[39.62, 125.35, "XXX"], [39.83, 125.95, "XXXX"], [39.95, 126.55, "XXX"]];
eighth.forEach(([la, lo, sz], i) => {
  B.unit({ id: "e" + i, side: "carth", x: G(la, lo)[0], y: G(la, lo)[1], w: 38, h: 38, label: i === 1 ? "EIGHTH ARMY" : null, t: T_RACE + 2.6 + i * 0.2 });
  K.counter("e" + i, { icon: "infantry", flag: "us", size: sz });
});
B.units.e1.el.querySelector(".tag").style.fontSize = "15px";
B.caption("UN ARMIES RACE FOR THE YALU", T_RACE + 0.5, T_SMITH - 0.2, "carth");

// the Chinese border flashes: the line the armies were driving toward
B.highlight(GL([[39.86, 124.2], [40.3, 124.72], [40.7, 125.35], [41.15, 126.29], [41.75, 126.85]]), T_YALU - 0.2, null, 26);

// ---------- X Corps comes round by sea and lands on the east coast ----------
B.city("WONSAN", ...G(39.15, 127.44), { left: true, size: 28, t: T_SMITH - 0.2 });
B.city("HUNGNAM", ...G(39.83, 127.62), { size: 26, r: 7, t: T_COAST + 0.6 });
B.arrow({ side: "carth", pts: GL([[37.6, 129.75], [38.4, 129.55], [39.0, 128.9], [39.2, 127.75]]), width: 14, dash: "26 14", t: T_SMITH - 0.2, dur: 1.6 });
B.label("X CORPS BY SEA", ...G(38.35, 130.35), { cls: "tg", size: 26, t: T_SMITH + 0.2, until: T_MTN + 0.4 });
B.unit({ id: "m1", side: "carth", x: G(39.3, 127.62)[0], y: G(39.3, 127.62)[1], w: 38, h: 38, label: "1ST MARINE DIV.", t: T_COAST });
K.counter("m1", { icon: "infantry", flag: "us", size: "XX" });
B.units.m1.el.querySelector(".tag").style.fontSize = "15px";
B.caption("SMITH'S MARINES LAND ON THE EAST COAST", T_SMITH + 0.2, T_MTN - 0.2, "carth");

// ---------- into the mountains, toward the reservoir ----------
B.arrow({ side: "carth", pts: GL([[39.38, 127.58], [39.62, 127.58], [39.9, 127.5], [40.12, 127.38], [40.3, 127.3]]), width: 12, t: T_MTN + 0.2, dur: 2.8 });
B.move("m1", T_MTN + 0.3, 3.4, ...G(40.12, 127.52), "power1.inOut");
B.snow(T_MTN - 0.5, END + 1);
SFX("blizzard", T_MTN - 0.5);   // cold wind bed as the snow starts over the mountains
SFX("truck", T_MTN + 0.3);      // the division column moves up into the mountains
const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
const [rx, ry] = G(40.47, 127.24);
ring.setAttribute("cx", rx); ring.setAttribute("cy", ry); ring.setAttribute("r", 34);
ring.setAttribute("fill", "none"); ring.setAttribute("stroke", "#f7f3ea"); ring.setAttribute("stroke-width", 5); ring.setAttribute("stroke-dasharray", "10 6");
document.getElementById("overlay").appendChild(ring);
gsap.set(ring, { autoAlpha: 0, scale: 2.2, transformOrigin: "50% 50%" });
tl.to(ring, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "power3.out" }, T_LAKE);
B.label("CHOSIN RESERVOIR", rx - 44, ry, { cls: "tg", size: 30, t: T_CHOSIN - 0.4, anchor: [-100, -50] });
K.raiseTerritory();
B.finish();
