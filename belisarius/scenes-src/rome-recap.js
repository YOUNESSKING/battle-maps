// Siege of Rome recap + the Belisarius method. Romans blue ("carth"), Goths red ("rome"). Shared geometry: RomeKit (lib/battle.js).
const B = Battle();
const R = RomeKit(B);
const { P, at, tl } = B;
const END = B.T.duration;
const G = R.G;
const svgG = (html) => { const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); g.innerHTML = html; document.getElementById("overlay").appendChild(g); return g; };

const T_SHAPE = at("rome-11", "He shaped"), T_TURNED = at("rome-11", "turned Rome"), T_STRUCK = at("rome-11", "He struck");
const T_OXEN = at("rome-11", "the oxen"), T_FOOD = at("rome-11", "the food"), T_TIME = at("rome-11", "And he made"), T_SUPPOSED = at("rome-11", "a siege is supposed");
const T_STARVE = at("rome-11", "starve the attackers");

B.camera([
  [0, 1509, 771, 0.7],
  [END, 1470, 760, 0.74],
]);

// the city, already besieged
R.tiber();
R.walls({ t: 0.1, dur: 1.6 });
G.camps.forEach(([x, y], i) => R.camp(x, y, 0.4 + i * 0.12));
B.showDate(0.2);
B.date("537 – 538 AD", 0.3, null, 34);

// method card on the left, rows on the spoken lines
const card = B.method(0.5, null, [T_SHAPE, T_STRUCK, T_TIME]);
Object.assign(card.style, { left: "40px", right: "auto", top: "705px", justifyContent: "flex-start" });
gsap.set(card.querySelector(".inner"), { scale: 0.66, transformOrigin: "0% 0%", textAlign: "left" });

// 1. shape the battlefield: walls and river become weapons
const wallGlow = svgG(`<path d="M ${G.wall.map((p) => p.join(" ")).join(" L ")} Z" fill="none" stroke="#1f4fc4" stroke-width="26" stroke-linejoin="round" opacity="0.55" filter="url(#rkGlowS)"/>`);
gsap.set(wallGlow, { autoAlpha: 0 });
tl.to(wallGlow, { autoAlpha: 1, duration: 0.6, yoyo: true, repeat: 3 }, T_SHAPE + 0.3);
tl.to(wallGlow, { autoAlpha: 0.6, duration: 0.6 }, T_SHAPE + 3.0);
const bm = [[1080, 873, 22], [1170, 908, 15]].map(([x, y, a], i) => R.boatMill(x, y, a, T_TURNED + i * 0.3, 2.2));
bm.forEach((m) => tl.fromTo(m.wheel, { rotation: 0 }, { rotation: 900, duration: END - T_TURNED, ease: "none", transformOrigin: "50% 50%" }, T_TURNED));
B.label("FLOATING MILLS", 1235, 930, { cls: "tg", size: 34, t: T_TURNED + 0.5, anchor: [0, -50] });

// 2. strike what holds them together: the oxen, the food
const TW = [[1570, 118], [1662, 105], [1762, 150]];
TW.forEach(([x, y], i) => {
  const tw = R.tower(x, y, T_OXEN - 0.6 + i * 0.2, 1.7);
  tw.querySelectorAll("rect").forEach((r) => r.setAttribute("fill", "#77746c"));
  const ox = R.oxen(x, y + 58, T_OXEN - 0.4 + i * 0.2, 1.7);
  gsap.set(ox, { rotation: 75 });
  ox.querySelectorAll("ellipse,circle").forEach((c) => c.setAttribute("fill", "#77746c"));
});
B.label("STRANDED TOWERS", 1650, 330, { cls: "tg", size: 34, t: T_OXEN + 0.3, anchor: [-50, 0] });
R.dimCamps(T_FOOD, 1.6, 0.4);
B.caption("NO OXEN · NO FOOD", T_FOOD + 0.2, T_TIME - 0.2, "rome");

// 3. make time fight for you: the besiegers starve and leave
B.arrow({ side: "rome", pts: [[2230, 700], [2320, 470], [2330, 200], [2270, 30]], width: 30, t: T_SUPPOSED, dur: 2.4 });
R.camps.forEach((g, i) => tl.to(g, { autoAlpha: 0, duration: 1.0 }, T_SUPPOSED + 1.2 + i * 0.15));
B.caption("THE BESIEGERS STARVED", T_STARVE - 0.4, END, "carth");
