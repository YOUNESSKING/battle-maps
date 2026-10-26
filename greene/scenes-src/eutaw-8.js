// Move 3 end: Greene withdraws from Eutaw Springs; the British fall back to Charleston; by December 1781 they hold only
// Charleston and Savannah; method card (line 3). Basemap eutaw_field1781 (battlefield), then the region map as a B.image layer.
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;

const NS = "http://www.w3.org/2000/svg", SVG = document.getElementById("overlay");
const svgEl = (html) => { const g = document.createElementNS(NS, "g"); g.innerHTML = html; SVG.appendChild(g); gsap.set(g, { autoAlpha: 0 }); return g; };
const RED = "#c4121f", BLUE = "#1f4fc4";

// region layer: eutaw_regioncrop.png = eutaw_region.jpg (zoom 8, origin 16709,25391) cropped at x655,y300 (1689x950), shown at 2880x1620
const K = 2880 / 1689;
const RG = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  const x = (lon + 180) / 360 * n - 16709, y = (1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 25391;
  return [+((x - 655) * K).toFixed(1), +((y - 300) * K).toFixed(1)];
};
function fort(x, y, t, side, s = 1.6) {
  const outer = document.createElementNS(NS, "g"), g = document.createElementNS(NS, "g");
  outer.setAttribute("transform", `translate(${x} ${y})`);
  const pts = [];
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + Math.PI / 4 + i * Math.PI / 4, r = (i % 2 ? 7.5 : 15) * s; pts.push(`${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`); }
  g.innerHTML = `<polygon points="${pts.join(" ")}" transform="rotate(45)" fill="${side === "carth" ? BLUE : RED}" stroke="#f7f3ea" stroke-width="${3 * s}" stroke-linejoin="round"/>
    <rect x="${-3.5 * s}" y="${-3.5 * s}" width="${7 * s}" height="${7 * s}" fill="#1b1812"/>`;
  outer.appendChild(g); SVG.appendChild(outer);
  gsap.set(g, { autoAlpha: 0 });
  tl.fromTo(g, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)", svgOrigin: "0 0" }, t);
  return g;
}
function swords(x, y, t, s = 1) { // crossed sabres battle marker
  const g = svgEl(`<g transform="translate(${x} ${y}) scale(${s})">
    <circle r="30" fill="rgba(24,20,14,0.85)" stroke="#f7f3ea" stroke-width="4"/>
    <g stroke="#f7f3ea" stroke-width="6" stroke-linecap="round"><line x1="-15" y1="-15" x2="15" y2="15"/><line x1="15" y1="-15" x2="-15" y2="15"/></g>
    <g stroke="#f7f3ea" stroke-width="5" stroke-linecap="round"><line x1="-19" y1="-8" x2="-8" y2="-19"/><line x1="19" y1="-8" x2="8" y2="-19"/></g></g>`);
  tl.fromTo(g, { autoAlpha: 0, scale: 1.8, svgOrigin: `${x} ${y}` }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, t);
  return g;
}

// ---------- key times ----------
const S8 = P("eutaw-8"), S9 = P("eutaw-9"), SM = P("method-3");
const T_WITH = at("eutaw-8", "withdrew"), T_HELD = at("eutaw-8", "the British held the field"), T_MATTER = at("eutaw-8", "it didn't matter");
const T_LOST = at("eutaw-8", "Stewart had lost"), T_THIRD = at("eutaw-8", "more than a third"), T_NEXT = at("eutaw-8", "The next day"), T_CHS = at("eutaw-8", "toward Charleston");
const T_NEVER = at("eutaw-8", "The British would never");
const T_ONCE = at("eutaw-9", "once controlled"), T_NOTH = at("eutaw-9", "held nothing but"), T_CS = at("eutaw-9", "Charleston and Savannah");
const T_GUIL = at("eutaw-9", "at Guilford"), T_HOB = at("eutaw-9", "Hobkirk's Hill"), T_EUT = at("eutaw-9", "at Eutaw Springs"), T_BACK = at("eutaw-9", "taken back");
const T_M1 = at("method-3", "Make the land"), T_M2 = at("method-3", "Make every victory"), T_M3 = at("method-3", "never lose");
const T_SWITCH = T_CHS + 0.3;

// ---------- camera ----------
B.camera([
  [0, 1560, 880, 0.92],
  [T_WITH + 3.5, 1400, 900, 0.85],
  [T_HELD + 2.0, 1500, 880, 0.9],
  [T_NEXT, 1700, 900, 0.88],
  [T_SWITCH, 1900, 900, 0.8],
  [T_SWITCH + 0.02, 1440, 810, 0.667],
  [S9, 1440, 820, 0.667],
  [T_NOTH + 1.0, 1440, 815, 0.69],
  [SM, 1440, 810, 0.667],
  [END, 1440, 820, 0.667],
]);

// ---------- battlefield: the state at the end of the fighting ----------
B.showDate(0.2);
B.date("8 SEPTEMBER 1781", 0.3, T_NEXT - 0.3, 36);
B.date("9 SEPTEMBER 1781", T_NEXT, T_SWITCH + 0.5, 36);
B.label("EUTAW HOUSE", 1968, 858, { cls: "tg", size: 22, t: 0.3, anchor: [-50, -50], until: T_SWITCH - 0.7 });
const houseRed = svgEl(`<rect x="1925" y="775" width="85" height="65" fill="${RED}" opacity="0.55"/>`);
tl.to(houseRed, { autoAlpha: 1, duration: 0.5 }, 0.1);
tl.to(houseRed, { autoAlpha: 0, duration: 0.8 }, T_NEXT + 0.5);
const BLUE0 = [[1380, 740], [1380, 840], [1380, 980], [1380, 1080]];
const BLUECOL = [[420, 916], [540, 912], [660, 908], [780, 906]];
BLUE0.forEach(([x, y], i) => {
  B.unit({ id: "b" + i, side: "carth", x, y, w: 64, h: 40, t: 0.2 + i * 0.1 });
  B.move("b" + i, T_WITH - 0.2 + i * 0.25, 4.2, ...BLUECOL[i]);
});
B.arrow({ side: "carth", pts: [[1300, 905], [1000, 920], [700, 905]], width: 20, t: T_WITH, dur: 2.2, until: T_LOST });
B.label("WITHDRAWS IN GOOD ORDER", 600, 1010, { cls: "tg", size: 30, t: T_WITH + 1.2, anchor: [-50, -50], until: T_LOST });
const REDX = { r1: [2330, 720], r3: [2360, 1000], r4: [2330, 1110], rm: [2100, 590] };
const REDCAMP = { r1: [1640, 760], r3: [1640, 1030], r4: [1790, 1030], rm: [1790, 760] };
Object.entries(REDX).forEach(([k, [x, y]], i) => {
  B.unit({ id: k, side: "rome", x, y, w: 64, h: 40, t: 0.4 + i * 0.1 });
  B.move(k, T_HELD - 0.6 + i * 0.15, 2.4, ...REDCAMP[k]);
});
B.caption("THE BRITISH HOLD THE FIELD", T_HELD, T_LOST - 0.6, "rome");
B.stat([
  `<span style="color:var(--carth-light)">US</span> ~520 KILLED, WOUNDED &amp; MISSING`,
  `<span style="color:#ff6b6b">BRITISH</span> ~700 · OVER 1/3 OF HIS ARMY`,
], T_LOST - 0.3, T_NEXT - 0.2);
// the next day: Stewart falls back toward Charleston
const REDROAD = { r1: [2350, 900], r3: [2470, 906], r4: [2590, 912], rm: [2230, 895] };
Object.entries(REDROAD).forEach(([k, [x, y]], i) => B.move(k, T_NEXT + 0.1 + i * 0.1, 2.6, x + 120, y + 4));
B.arrow({ side: "rome", pts: [[2080, 890], [2400, 905], [2760, 925]], width: 20, t: T_NEXT + 0.4, dur: 1.8, until: T_SWITCH - 0.7 });
B.label("TO CHARLESTON", 2760, 860, { cls: "tg", size: 30, t: T_NEXT + 1.6, anchor: [-100, -100], until: T_SWITCH - 0.7 });
B.hideUnits(["b0", "b1", "b2", "b3", "r1", "r3", "r4", "rm"], T_SWITCH - 0.7, 0.4);

// ---------- region: the South, December 1781 ----------
B.image("assets/eutaw_regioncrop.png", 0, 0, 2880, 1620, { t: T_SWITCH - 0.06, dur: 0.05 });
const dip = document.createElement("div");
dip.className = "fx-layer"; dip.style.background = "#1b1812";
document.getElementById("fx").appendChild(dip); gsap.set(dip, { autoAlpha: 0 });
tl.to(dip, { autoAlpha: 1, duration: 0.35, ease: "power1.in" }, T_SWITCH - 0.4);
tl.to(dip, { autoAlpha: 0, duration: 0.5, ease: "power1.out" }, T_SWITCH + 0.05);
const landRed = B.image("assets/eutaw_landred.png", 0, 0, 2880, 1620, { t: T_ONCE - 0.6, dur: 1.2 });
tl.to(landRed, { autoAlpha: 0, duration: 1.6 }, T_NOTH + 0.2);
B.image("assets/eutaw_landblue.png", 0, 0, 2880, 1620, { t: T_NOTH + 0.2, dur: 1.6 });
B.date("DECEMBER 1781", T_SWITCH + 0.9, null, 38);
const ST = [["NORTH CAROLINA", 35.35, -79.3], ["SOUTH CAROLINA", 34.8, -81.7], ["GEORGIA", 32.85, -83.3]];
ST.forEach(([n, la, lo], i) => B.label(n, ...RG(la, lo), { cls: "country", size: 50, t: T_SWITCH + 0.4 + i * 0.15 }));
B.label("ATLANTIC OCEAN", ...RG(32.6, -77.9), { cls: "sea", size: 48, t: T_SWITCH + 1.0 });
// Eutaw -> Charleston retreat, carried over from the battlefield
const EU = RG(33.40, -80.30), CH = RG(32.78, -79.93), SV = RG(32.08, -81.09);
B.arrow({ side: "rome", pts: [[EU[0] + 16, EU[1] + 20], [EU[0] + 90, EU[1] + 120], [CH[0] - 18, CH[1] - 36]], width: 16, t: T_SWITCH + 0.2, dur: 1.6, until: T_ONCE });
// interior posts all American now, two red enclaves on the coast
const POSTS = [[34.25, -80.61], [34.15, -82.02], [33.47, -81.97], [33.95, -81.05], [33.73, -80.66], [33.54, -80.44], [33.49, -80.86]];
POSTS.forEach(([la, lo], i) => fort(...RG(la, lo), T_NOTH + 0.6 + i * 0.1, "carth", 2.0));
const encl = svgEl(`<circle cx="${CH[0]}" cy="${CH[1]}" r="70" fill="${RED}" opacity="0.4" stroke="${RED}" stroke-width="5"/>
  <circle cx="${SV[0]}" cy="${SV[1]}" r="70" fill="${RED}" opacity="0.4" stroke="${RED}" stroke-width="5"/>`);
tl.to(encl, { autoAlpha: 1, duration: 0.8 }, T_NOTH + 0.4);
tl.fromTo(encl, { scale: 1.6, svgOrigin: `${(CH[0] + SV[0]) / 2} ${(CH[1] + SV[1]) / 2}` }, { scale: 1, duration: 1.2, ease: "power2.out", immediateRender: false }, T_NOTH + 0.4);
fort(...CH, T_SWITCH + 0.5, "rome", 2.8);
fort(...SV, T_SWITCH + 0.5, "rome", 2.8);
B.label("CHARLESTON", CH[0] + 52, CH[1], { cls: "city", size: 40, t: T_SWITCH + 0.6, anchor: [0, -50] });
B.label("SAVANNAH", SV[0] + 52, SV[1], { cls: "city", size: 40, t: T_SWITCH + 0.6, anchor: [0, -50] });
// the three lost battles
const BATTLES = [["GUILFORD", 36.07, -79.84, T_GUIL, false], ["HOBKIRK'S HILL", 34.28, -80.61, T_HOB, false], ["EUTAW SPRINGS", 33.40, -80.30, T_EUT, true]];
BATTLES.forEach(([n, la, lo, t, below]) => {
  const [x, y] = RG(la, lo);
  swords(x, y + (n === "GUILFORD" ? 20 : 0), t - 0.2, 1.2);
  B.label(n, x + 44, y + (n === "GUILFORD" ? 20 : 0), { cls: "city", size: 36, t: t - 0.1, anchor: [0, -50] });
});
B.caption("LOST THE BATTLES · WON THE SOUTH", T_BACK - 0.3, SM - 0.2, "carth");

// ---------- method card ----------
B.dim(SM - 0.1, END + 2);
B.dateBox(SM - 0.1);
B.method(T_M1 - 0.6, null, { hi: 2, rowT: [T_M1 - 0.2, T_M2 - 0.2, T_M3 - 0.2] });
