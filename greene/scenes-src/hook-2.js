// Hook 2: Nathanael Greene bio card over the dimmed map of the South.
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = "hook-2";

const G = (lat, lon) => { // assets/greene_south.json (zoom 8)
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 16709).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 25369).toFixed(1)];
};

// slow drift over the British-held South
B.camera([[0, 1380, 760, 0.86], [END, 1440, 700, 0.95]]);
B.image("assets/gs_borders.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.image("assets/gs_brit.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const lab = (t, x, y, o) => B.label(t, x, y, { ...o, instant: true });
lab("NORTH CAROLINA", ...G(35.3, -77.55), { cls: "country", size: 46 });
lab("SOUTH CAROLINA", ...G(33.72, -80.55), { cls: "country", size: 42 });
lab("GEORGIA", ...G(32.75, -83.9), { cls: "country", size: 46 });
lab("VIRGINIA", ...G(37.05, -79.6), { cls: "country", size: 46 });
[[32.78, -79.93], [34.25, -80.61], [34.17, -82.02], [33.47, -81.97], [33.37, -79.28], [32.08, -81.09]].forEach(([la, lo], i) => {
  const [x, y] = G(la, lo);
  gsap.set(B.unit({ id: "o" + i, side: "rome", kind: "inf", x, y, w: 34, h: 34 }), { autoAlpha: 1 });
});
gsap.set(document.getElementById("date"), { autoAlpha: 0 });

B.dim(0, END + 1, 1);
B.bio({
  photo: "assets/media/greene_full.png",
  name: "NATHANAEL GREENE",
  rows: ["Major General, Continental Army", "Born 1742 · Rhode Island", "Son of a Quaker ironmaster", "No military schooling · self-taught", "Expelled by his Quaker meeting"],
  rowT: [at(K, "Major General"), at(K, "thirty-eight"), at(K, "son of a Quaker"), at(K, "no military schooling"), at(K, "thrown him out") - 0.3],
  t: 0.2,
  until: END - 0.5,
});
B.finish();
