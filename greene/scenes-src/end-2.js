// End 2: closing card. The three moves, Greene's method, "which commander next?", fade to black.
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const K = "end-2";
const scene = document.getElementById("scene"), pins = document.getElementById("pins");

const G = (lat, lon) => { // assets/greene_south.json (zoom 8)
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 16709).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 25369).toFixed(1)];
};

// the map of the South, slowly drifting under the dimmer
B.camera([[0, 1480, 640, 0.95], [END, 1450, 620, 1.1]]);
B.image("assets/gs_borders.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
gsap.set(document.getElementById("date"), { autoAlpha: 0 });
B.dim(0, END + 1, 1);

// the three moves, as they are named
const T_WHICH = at(K, "Which commander");
const moves = document.createElement("div");
moves.className = "card";
moves.style.top = "120px";
const NAMES = ["THE RACE TO THE DAN", "GUILFORD COURTHOUSE", "THE RECONQUEST"];
moves.innerHTML = `<div class="inner" style="border-top-color:var(--carth-light);text-align:left">${NAMES.map((n, i) =>
  `<div class="row"><span style="color:var(--carth-light);margin-right:18px">MOVE ${i + 1}</span>${n}</div>`).join("")}</div>`;
scene.insertBefore(moves, document.getElementById("credit"));
gsap.set(moves, { autoAlpha: 0 });
tl.fromTo(moves, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.05);
const rowT = [0.15, at(K, "Guilford") - 0.1, at(K, "The reconquest") - 0.1];
moves.querySelectorAll(".row").forEach((r, i) => tl.fromTo(r, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out" }, rowT[i]));
tl.to(moves, { autoAlpha: 0, duration: 0.5 }, T_WHICH - 0.3);

// Greene's method
B.method(at(K, "Make the land") - 0.3, T_WHICH - 0.3, {
  rowT: [at(K, "Make the land") - 0.1, at(K, "Make every victory") - 0.1, at(K, "And never lose") - 0.1],
});

// end card
B.title("THANKS FOR WATCHING", "WHICH COMMANDER NEXT?", "Tell us in the comments", T_WHICH + 0.1, null);

// fade to black
const black = document.createElement("div");
black.style.cssText = "position:absolute;inset:0;background:#000;";
scene.appendChild(black);
gsap.set(black, { autoAlpha: 0 });
tl.to(black, { autoAlpha: 1, duration: 1.4, ease: "power1.in" }, END - 1.5);
B.finish();
