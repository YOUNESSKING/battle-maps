// John's raid into Picenum; the siege of Rome is lifted (March 538). Romans blue ("carth"), Goths red ("rome").
const B = Battle();
const R = RomeKit(B);
const { P, at, tl } = B;
const END = B.T.duration;

const G = (lat, lon) => { // assets/italy.json: zoom 7, origin 16218,11535
  const n = 256 * 2 ** 7, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 16218).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 11535).toFixed(1)];
};
const ROME = G(41.9, 12.5), RAVENNA = G(44.42, 12.2), RIMINI = G(44.06, 12.57);
const T_FORCE = at("rome-10", "sent a force"), T_DEEP = at("rome-10", "deep into"), T_COAST = at("rome-10", "Adriatic coast"), T_THREAT = at("rome-10", "threatening");
const T_MARCH = at("rome-10", "In March"), T_YEAR = at("rome-10", "after a year"), T_BURN = at("rome-10", "Vitiges burned"), T_AWAY = at("rome-10", "marched away");
const T_5K = at("rome-10", "Five thousand");

B.camera([
  [0, 1330, 540, 1.3],
  [T_COAST, 1345, 470, 1.38],
  [T_BURN - 0.5, 1320, 540, 1.4],
  [END, 1300, 575, 1.55],
]);

B.image("assets/italy_goths.png", 0, 0, 2880, 1620, { t: 0, dur: 0.3 });
B.showDate(0.1);
B.date("SIEGE OF ROME · 538 AD", 0.2, T_MARCH, 30);
B.date("MARCH 538 AD", T_MARCH + 0.1, null);
B.label("ADRIATIC SEA", 1560, 470, { cls: "sea", size: 28, t: 0.3, rot: 38, anchor: [-50, -50] });
B.city("ROME", ...ROME, { size: 30, left: true, dy: 16, t: 0.1 });
B.city("RAVENNA", ...RAVENNA, { size: 28, left: true, t: 0.3 });
B.label("GOTHIC CAPITAL", RAVENNA[0] - 18, RAVENNA[1] + 24, { cls: "tg", size: 18, t: 0.6, anchor: [-100, 0] });

// Gothic camps ring Rome
const camps = [];
for (let i = 0; i < 7; i++) {
  const a = (-150 + i * 42) * Math.PI / 180; // north and east of the city
  camps.push(R.camp(ROME[0] + Math.cos(a) * 44, ROME[1] + Math.sin(a) * 44, 0.2 + i * 0.12, { s: 0.3 }));
}
const ring = document.createElementNS("http://www.w3.org/2000/svg", "g");
ring.innerHTML = `<circle cx="${ROME[0]}" cy="${ROME[1]}" r="18" fill="rgba(31,79,196,0.35)" stroke="#1f4fc4" stroke-width="4"/>`;
document.getElementById("overlay").appendChild(ring);

// John's cavalry raid up the Adriatic coast
B.arrow({ side: "carth", pts: [[ROME[0] + 18, ROME[1] - 14], [1395, 600], [1452, 555], [1440, 495], [1398, 440], [1335, 388]], width: 16, t: T_FORCE, dur: 4.6 });
B.label("JOHN'S CAVALRY", 1470, 600, { cls: "tg", size: 22, t: T_FORCE + 0.8, anchor: [0, -50] });
B.label("PICENUM", 1462, 470, { cls: "country", size: 30, t: T_DEEP });
B.city("RIMINI", ...RIMINI, { size: 22, r: 7, t: T_COAST });
const thr = document.createElementNS("http://www.w3.org/2000/svg", "g");
thr.innerHTML = `<circle cx="${RAVENNA[0]}" cy="${RAVENNA[1]}" r="30" fill="none" stroke="#1f4fc4" stroke-width="6"/>`;
document.getElementById("overlay").appendChild(thr);
gsap.set(thr, { autoAlpha: 0 });
tl.to(thr, { autoAlpha: 1, duration: 0.45, yoyo: true, repeat: 5 }, T_THREAT);
B.caption("RAVENNA THREATENED", T_THREAT + 0.2, T_MARCH - 0.2, "carth");

// the Goths burn their camps and march away
camps.forEach((g, i) => {
  const f = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const [x, y] = [gsap.getProperty(g, "x"), gsap.getProperty(g, "y")];
  f.innerHTML = `<circle cx="${x}" cy="${y}" r="16" fill="#ff7a1a" opacity="0.85" filter="url(#rkGlowS)"/>`;
  document.getElementById("overlay").appendChild(f);
  gsap.set(f, { autoAlpha: 0 });
  tl.to(f, { autoAlpha: 1, duration: 0.4 }, T_BURN + i * 0.12);
  tl.to(f, { autoAlpha: 0, duration: 1.0 }, T_AWAY + 0.6 + i * 0.1);
  tl.to(g, { autoAlpha: 0, duration: 1.0 }, T_BURN + 0.6 + i * 0.12);
});
B.arrow({ side: "rome", pts: [[1296, 600], [1268, 530], [1256, 450], [1266, 380]], width: 26, t: T_AWAY, dur: 2.6 });
B.caption("MARCH 538 · SIEGE LIFTED AFTER 1 YEAR AND 9 DAYS", T_YEAR, T_5K - 0.2, "carth");
tl.fromTo(ring, { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.8, duration: 0.8, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_5K);
B.caption("5,000 DEFENDERS HELD ROME", T_5K + 0.2, END - 0.1, "carth");
