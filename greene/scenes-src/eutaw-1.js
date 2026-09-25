// Move 3 opener: the Reconquest of South Carolina, April - June 1781. Americans = blue ("carth"), British = red ("rome").
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const HAVE_GREENE_HEAD = true;

// ---------- projection (assets/eutaw_region.json: zoom 8, origin 16709,25391) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 16709).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 25391).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));

// ---------- helper: bastioned fort marker in the SVG overlay; returns {g, flip(t)} ----------
const NS = "http://www.w3.org/2000/svg", SVG = document.getElementById("overlay");
const RED = "#c4121f", BLUE = "#1f4fc4";
function fort(x, y, t, o = {}) {
  const s = o.s || 1, outer = document.createElementNS(NS, "g"), g = document.createElementNS(NS, "g");
  outer.setAttribute("transform", `translate(${x} ${y})`);
  const pts = [];
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + Math.PI / 4 + i * Math.PI / 4, r = (i % 2 ? 7.5 : 15) * s; pts.push(`${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`); }
  g.innerHTML = `<circle r="${22 * s}" fill="none" stroke="#f7f3ea" stroke-width="3" opacity="0"/>
    <polygon points="${pts.join(" ")}" transform="rotate(45)" fill="${o.side === "carth" ? BLUE : RED}" stroke="#f7f3ea" stroke-width="${3 * s}" stroke-linejoin="round"/>
    <rect x="${-3.5 * s}" y="${-3.5 * s}" width="${7 * s}" height="${7 * s}" fill="#1b1812"/>`;
  outer.appendChild(g); SVG.appendChild(outer);
  gsap.set(g, { autoAlpha: 0 });
  tl.fromTo(g, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)", svgOrigin: "0 0" }, t);
  const poly = g.querySelector("polygon"), ring = g.querySelector("circle");
  return {
    g,
    flip(tf, color = BLUE) {
      tl.to(poly, { attr: { fill: color }, duration: 0.35 }, tf);
      tl.fromTo(g, { scale: 1 }, { scale: 1.7, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out", svgOrigin: "0 0", immediateRender: false }, tf);
      tl.fromTo(ring, { attr: { r: 14 * s }, opacity: 0.95 }, { attr: { r: 46 * s }, opacity: 0, duration: 0.9, ease: "power2.out", immediateRender: false }, tf);
    },
  };
}
const tagSize = (id, px) => { const t = B.units[id].el.querySelector(".tag"); if (t) t.style.fontSize = px + "px"; };

// ---------- key times ----------
const T_CORN = at("eutaw-1", "When Cornwallis"), T_EXPECT = at("eutaw-1", "everyone expected"), T_INSTEAD = at("eutaw-1", "Instead");
const T_SOUTH = at("eutaw-1", "marched south"), T_HELD = at("eutaw-1", "The British still held"), T_WEB = at("eutaw-1", "web of fortified");
const T_CAMDEN = at("eutaw-1", "from Camden"), T_96 = at("eutaw-1", "Ninety Six to"), T_AUG = at("eutaw-1", "Augusta,"), T_8000 = at("eutaw-1", "eight thousand");
const P2 = P("eutaw-2"), T_RAWDON = at("eutaw-2", "Lord Rawdon"), T_HOB = at("eutaw-2", "Hobkirk's Hill"), T_BACK = at("eutaw-2", "drove him back");
const T_MATTER = at("eutaw-2", "It didn't matter"), T_PINNED = at("eutaw-2", "pinned in place"), T_PART = at("eutaw-2", "partisan bands");
const T_MARION = at("eutaw-2", "Francis Marion"), T_SUMTER = at("eutaw-2", "Thomas Sumter"), T_LEE = at("eutaw-2", "Henry Lee");
const T_WATSON = at("eutaw-2", "Fort Watson fell"), T_MOTTE = at("eutaw-2", "Fort Motte fell"), T_ORB = at("eutaw-2", "Orangeburg and"), T_AUGS = at("eutaw-2", "Augusta surrendered");
const T_WEEKS = at("eutaw-2", "Within weeks"), T_ABCAM = at("eutaw-2", "abandoned Camden"), T_AB96 = at("eutaw-2", "then Ninety Six");

// ---------- camera ----------
B.camera([
  [0, 1600, 620, 0.9],
  [T_HELD - 1.5, 1570, 640, 0.93],
  [T_WEB + 0.5, 1330, 900, 1.65],
  [P2 - 0.3, 1340, 890, 1.7],
  [P2 + 2.2, 1386, 712, 4.2],
  [T_MATTER, 1386, 714, 4.4],
  [T_MATTER + 2.2, 1335, 875, 1.9],
  [T_ORB, 1350, 870, 2.0],
  [END, 1330, 860, 1.95],
]);

// ---------- base: rivers ----------
const RIV = [
  [[34.8, -80.87], [34.25, -80.66], [33.9, -80.62], [33.75, -80.63]],
  [[34.3, -81.6], [33.99, -81.06], [33.87, -80.85], [33.75, -80.63]],
  [[33.75, -80.63], [33.6, -80.48], [33.52, -80.35], [33.45, -80.1], [33.35, -79.9], [33.25, -79.6], [33.12, -79.25]],
  [[34.6, -82.85], [34.0, -82.35], [33.47, -81.97], [33.2, -81.75], [32.9, -81.5], [32.5, -81.3], [32.08, -81.09], [32.03, -80.9]],
  [[35.2, -80.0], [34.4, -79.7], [33.9, -79.45], [33.37, -79.28]],
  [[35.4, -78.8], [34.8, -78.6], [34.23, -77.95], [33.9, -78.0]],
  [[36.8, -79.9], [36.7, -78.6], [36.6, -77.4], [36.95, -76.7]],
];
RIV.forEach((r) => B.river(GL(r), 4));

// ---------- title + wide shot ----------
B.title("MOVE 3", "THE RECONQUEST", "April – September 1781", 0.4, T_CORN + 4.2);
B.showDate(T_CORN + 4.4);
B.date("APRIL 1781", T_CORN + 4.6, P2 + 0.2);
B.date("25 APRIL 1781", P2 + 0.3, T_MATTER + 0.5);
B.date("MAY – JUNE 1781", T_MATTER + 0.8, null, 36);

const STATES = [
  ["VIRGINIA", 36.95, -79.9, 44], ["NORTH CAROLINA", 35.95, -81.8, 44], ["SOUTH CAROLINA", 34.1, -81.4, 44], ["GEORGIA", 32.9, -83.2, 44],
];
STATES.forEach(([n, la, lo, sz], i) => B.label(n, ...G(la, lo), { cls: "country", size: sz, t: 1.2 + i * 0.25, until: T_HELD }));
B.label("ATLANTIC OCEAN", ...G(32.9, -77.6), { cls: "sea", size: 40, t: 2.4, until: T_HELD });

// Cornwallis to Virginia
B.city("WILMINGTON", ...G(34.23, -77.94), { size: 24, t: T_CORN - 0.2, until: T_HELD + 0.5 });
B.unit({ id: "corn", side: "rome", x: G(34.45, -78.1)[0] - 30, y: G(34.45, -78.1)[1], w: 40, h: 28, label: "CORNWALLIS", t: T_CORN + 0.2 });
tagSize("corn", 17);
B.arrow({ side: "rome", pts: GL([[34.55, -78.25], [35.3, -78.2], [36.0, -77.95], [36.55, -77.7]]), width: 16, t: T_CORN + 0.8, dur: 2.6, until: T_HELD + 0.5 });
B.move("corn", T_CORN + 1.0, 2.6, ...G(36.62, -77.62));
B.hideUnits(["corn"], T_HELD + 0.4);

// Greene: expected to follow, turns south instead
const GR0 = G(35.55, -79.15);
B.unit({ id: "greene", side: "carth", x: GR0[0], y: GR0[1], w: 40, h: 28, label: "GREENE", t: T_CORN + 2.2 });
tagSize("greene", 17);
const expect = B.arrow({ side: "white", pts: GL([[35.72, -79.0], [36.25, -78.6], [36.7, -78.2]]), width: 12, dash: "16 12", t: T_EXPECT, dur: 1.4 });
B.label("?", ...G(36.9, -78.05), { cls: "tg", size: 54, t: T_EXPECT + 1.2, until: T_INSTEAD + 0.4, anchor: [-50, -50] });
tl.to(expect, { autoAlpha: 0, duration: 0.5 }, T_INSTEAD);
B.arrow({ side: "carth", pts: GL([[35.4, -79.35], [35.0, -79.9], [34.62, -80.4], [34.42, -80.6]]), width: 16, t: T_INSTEAD + 0.4, dur: 2.4, until: T_WEB });
B.move("greene", T_SOUTH - 0.2, 3.0, ...G(34.52, -80.62));
if (HAVE_GREENE_HEAD) B.portraitStake({ img: "assets/media/greene_head.png", flag: "assets/media/us_flag_13star.png", name: "GREENE", x: G(35.45, -79.75)[0], y: G(35.45, -79.75)[1], size: 0.9, t: T_INSTEAD - 0.4, until: T_HELD });

// ---------- the web of posts ----------
const F = {
  camden: { ll: [34.25, -80.61], name: "CAMDEN" },
  n96: { ll: [34.15, -82.02], name: "NINETY SIX" },
  aug: { ll: [33.47, -81.97], name: "AUGUSTA", left: true },
  granby: { ll: [33.95, -81.05], name: "FORT GRANBY", left: true },
  motte: { ll: [33.73, -80.66], name: "FORT MOTTE", left: true },
  watson: { ll: [33.54, -80.44], name: "FORT WATSON" },
  orb: { ll: [33.49, -80.86], name: "ORANGEBURG", left: true },
  chs: { ll: [32.78, -79.93], name: "CHARLESTON" },
  sav: { ll: [32.08, -81.09], name: "SAVANNAH" },
};
const showT = { camden: T_CAMDEN, n96: T_96, aug: T_AUG, granby: T_WEB + 0.3, motte: T_WEB + 0.5, watson: T_WEB + 0.7, orb: T_WEB + 0.9, chs: T_WEB - 0.5, sav: T_WEB - 0.3 };
Object.entries(F).forEach(([k, f]) => {
  const [x, y] = G(...f.ll);
  f.xy = [x, y];
  f.m = fort(x, y, showT[k]);
  f.lab = B.label(f.name, f.left ? x - 20 : x + 20, y, { cls: "city", size: 18, t: showT[k] + 0.1, anchor: f.left ? [-100, -50] : [0, -50] });
});
const WEB = [["chs", "watson"], ["watson", "motte"], ["motte", "camden"], ["motte", "granby"], ["granby", "n96"], ["n96", "aug"], ["chs", "orb"], ["orb", "granby"], ["sav", "aug"], ["chs", "sav"]];
WEB.forEach(([a, b], i) => B.line([F[a].xy, F[b].xy], { color: "var(--rome)", width: 3, dash: "9 7", t: T_WEB + 0.2 + i * 0.12, dur: 0.9, until: P2 + 0.2 }));
B.caption("~8,000 BRITISH TROOPS", T_8000 - 0.3, P2 - 0.2, "rome");

// ---------- Hobkirk's Hill ----------
const HOB = [F.camden.xy[0], F.camden.xy[1] - 34];
B.move("greene", P2, 1.6, HOB[0], HOB[1] - 4);
B.unit({ id: "rawdon", side: "rome", x: F.camden.xy[0] + 22, y: F.camden.xy[1] + 2, w: 16, h: 11, label: "RAWDON", t: T_RAWDON - 0.4 });
tagSize("rawdon", 7);
gsap.set(B.units.greene.el.querySelector(".tag"), { fontSize: 17 });
tl.to(B.units.greene.el.querySelector(".tag"), { fontSize: 7, duration: 1.2 }, P2);
tl.to(B.units.greene.el.querySelector(".blk"), { width: 16, height: 11, duration: 1.2 }, P2);
B.units.greene.w = 16; B.units.greene.h = 11;
Object.values(F).forEach((f) => { tl.to(f.lab, { autoAlpha: 0, duration: 0.6 }, P2 + 0.2); tl.to(f.lab, { autoAlpha: 1, duration: 0.6 }, T_MATTER + 1.4); });
B.label("CAMDEN", F.camden.xy[0] - 11, F.camden.xy[1] + 1, { cls: "city", size: 8, t: P2 + 1.2, until: T_MATTER + 1.0, anchor: [-100, -50] });
B.label("HOBKIRK'S HILL", HOB[0] - 14, HOB[1] - 6, { cls: "city", size: 8, t: T_HOB - 0.3, until: T_MATTER + 1.5, anchor: [-100, -50] });
B.arrow({ side: "rome", pts: [[F.camden.xy[0] + 8, F.camden.xy[1] - 6], [F.camden.xy[0] + 6, HOB[1] + 12]], width: 3.5, t: T_HOB, dur: 0.9, until: T_MATTER + 1.2 });
B.move("greene", T_BACK - 0.2, 1.8, HOB[0] + 4, HOB[1] - 26);
B.move("rawdon", T_BACK, 1.8, F.camden.xy[0] + 12, F.camden.xy[1] - 20);
B.move("rawdon", T_PINNED - 0.5, 1.4, F.camden.xy[0] + 22, F.camden.xy[1] + 2);
B.hideUnits(["rawdon"], T_MATTER + 1.0);
tl.to(B.units.greene.el.querySelector(".tag"), { fontSize: 14, duration: 1.0 }, T_MATTER + 0.8);
tl.to(B.units.greene.el.querySelector(".blk"), { width: 30, height: 21, duration: 1.0 }, T_MATTER + 0.8);

// ---------- partisans take the posts ----------
const PART = [
  { name: "MARION", pts: [[1600, 1000], [1500, 965], [1428, 906]], lab: [1612, 1012], t: T_MARION, anc: [0, -50] },
  { name: "LEE", pts: [[1585, 800], [1480, 826], [1394, 846]], lab: [1597, 796], t: T_LEE, anc: [0, -50] },
  { name: "SUMTER", pts: [[1300, 1010], [1326, 960], [1337, 918]], lab: [1290, 1018], t: T_SUMTER, anc: [-100, -50] },
  { name: "", pts: [[1245, 845], [1190, 872], [1152, 897]], lab: null, t: T_AUGS - 1.6, off: T_AUGS + 3.5 },
];
PART[0].off = T_WATSON + 3.5; PART[1].off = T_MOTTE + 3.5; PART[2].off = T_ORB + 3.5;
PART.forEach((p) => {
  B.arrow({ side: "carth", pts: p.pts, width: 9, t: p.t, dur: 1.3, until: p.off });
  if (p.lab) B.label(p.name, p.lab[0], p.lab[1], { cls: "tg", size: 20, t: p.t + 0.2, anchor: p.anc, until: p.off });
});
F.watson.m.flip(T_WATSON + 0.4);
F.motte.m.flip(T_MOTTE + 0.4);
F.orb.m.flip(T_ORB + 0.2);
F.granby.m.flip(T_ORB + 0.6);
F.aug.m.flip(T_AUGS + 0.3);
B.caption("THE OUTPOSTS FALL", T_WATSON - 0.2, T_WEEKS - 0.3, "carth");

// Greene to Ninety Six (siege), Camden evacuated, Ninety Six abandoned
B.move("greene", T_ORB - 0.5, 2.6, F.n96.xy[0] - 42, F.n96.xy[1] + 4);
B.arrow({ side: "rome", pts: [[F.camden.xy[0] + 14, F.camden.xy[1] + 12], [1440, 790], [1478, 850]], width: 8, t: T_ABCAM - 0.3, dur: 1.2, until: END - 0.2 });
F.camden.m.flip(T_ABCAM + 0.2);
F.n96.m.flip(T_AB96 + 0.3);
B.label("EVACUATED", F.camden.xy[0] + 20, F.camden.xy[1] - 22, { cls: "tg", size: 13, t: T_ABCAM + 0.5, anchor: [0, -50] });
B.label("ABANDONED", F.n96.xy[0] + 20, F.n96.xy[1] + 22, { cls: "tg", size: 13, t: T_AB96 + 0.6, anchor: [0, -50] });
