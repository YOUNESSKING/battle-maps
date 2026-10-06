// TERRAIN (g-2): out of the clouds, straight down over Nijmegen, then the camera tilts north up the 3D Holland corridor:
// the one road glows from Eindhoven to Arnhem; the Waal road bridge at Nijmegen pulses red (German-held).
const B = Battle();
const GG = GGK(B);
const { at } = B;
const END = B.T.duration;
const G = GG.proj(10, 133746, 86157);
const [nx, ny] = G(51.846, 5.866);
const T_SIXTY = at("g-2", "Sixty miles"), T_NIJ = at("g-2", "At Nijmegen"), T_HANDS = at("g-2", "German hands");
const FL = Flyover(B, GG, { height: "assets/holland_height.png", tex: "assets/media/holland_dark.jpg", exag: 34, fog: [1300, 3200], fog1: [420, 1000], tint: 0x8a909c,
  labels: [["EINDHOVEN", ...G(51.44, 5.48)], ["GRAVE", ...G(51.76, 5.74)], ["NIJMEGEN", ...G(51.822, 5.79)], ["ARNHEM", ...G(51.98, 5.91)], ["THE RHINE", ...G(51.965, 5.75)], ["GERMANY", ...G(51.80, 6.35)]],
  C0: [nx - 1440, 1100, ny - 810 + 4], L0: [nx - 1440, 0, ny - 810], C1: [nx - 1440 - 70, 250, ny - 810 + 420], L1: [nx - 1440 + 25, 0, ny - 810 - 120],
  dur: END, ease: "power2.out", labT: 2.6 });
// the road (Market Garden corridor), drawn on in glowing gold, projected onto the terrain every frame
const ROAD = [[51.23, 5.42], [51.35, 5.46], [51.44, 5.48], [51.51, 5.49], [51.62, 5.54], [51.70, 5.62], [51.76, 5.74], [51.80, 5.80], [51.846, 5.866], [51.90, 5.88], [51.98, 5.91]].map(([a, b]) => G(a, b));
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", 1920); svg.setAttribute("height", 1080); svg.style.cssText = "position:absolute;inset:0;pointer-events:none";
svg.innerHTML = `<defs><filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <path id="road" fill="none" stroke="#ffcf7a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" opacity="0.95"/>`;
document.getElementById("scene").insertBefore(svg, document.getElementById("credit"));
const road = svg.querySelector("#road"), rs = { k: 0 };
// red pulsing marker on the bridge
const mk = document.createElement("div");
mk.innerHTML = `<div style="position:absolute;left:-30px;top:-30px;width:60px;height:60px;border-radius:50%;border:4px solid #ff4a3a;box-shadow:0 0 22px 6px rgba(255,60,40,.7)" class="ring"></div>
  <div style="position:absolute;left:44px;top:-50px;white-space:nowrap;font-family:Oswald;font-weight:500;color:#f4efe2;letter-spacing:.2em;font-size:24px;text-shadow:0 0 10px rgba(255,80,60,.6),0 2px 4px #000">WAAL BRIDGE<div style="font-size:17px;letter-spacing:.3em;color:#ff8a7a">GERMAN-HELD</div></div>`;
mk.style.cssText = "position:absolute;left:0;top:0;opacity:0";
document.getElementById("scene").insertBefore(mk, document.getElementById("credit"));
FL.hooks.push((project) => {
  const pts = ROAD.map(([x, y]) => project(x, y, 14)).filter((p) => p[2]); let d = "", L = 0, acc = [0];
  for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); acc.push(L); }
  pts.forEach((p, i) => { d += (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); });
  road.setAttribute("d", d); road.setAttribute("stroke-dasharray", `${(L * rs.k).toFixed(1)} 99999`);
  const [bx, by] = project(nx, ny, 14); mk.style.left = bx + "px"; mk.style.top = by + "px";
});
B.tl.to(rs, { k: 1, duration: 3.0, ease: "power1.inOut", onUpdate: FL.render }, T_SIXTY);
B.tl.to(mk, { opacity: 1, duration: 0.6 }, T_NIJ);
B.tl.fromTo(mk.querySelector(".ring"), { scale: 0.8 }, { scale: 1.35, duration: 0.7, repeat: 6, yoyo: true, ease: "sine.inOut" }, T_NIJ);
SFX("hit", T_NIJ); SFX("static", T_HANDS);
// out of the clouds: white clears, puffs rush outward
const wh = document.createElement("div"); wh.style.cssText = "position:absolute;inset:0;background:radial-gradient(ellipse at center,#eef0f3 0%,#d9dde3 60%,#b9bfc8 100%)";
document.getElementById("scene").insertBefore(wh, document.getElementById("credit"));
B.tl.fromTo(wh, { opacity: 1 }, { opacity: 0, duration: 1.4, ease: "power2.out" }, 0.1);
[0, 2, 1, 3].forEach((n, i) => {
  const c = document.createElement("img"); c.src = `assets/media/cloud_puff${n}.png`;
  c.style.cssText = "position:absolute;left:50%;top:50%;width:1400px;height:800px;margin:-400px 0 0 -700px";
  document.getElementById("scene").insertBefore(c, wh.nextSibling);
  const dx = [-500, 460, -260, 380][i], dy = [-200, 180, 260, -220][i];
  B.tl.fromTo(c, { opacity: 0.95, scale: 1.4, x: dx * 0.4, y: dy * 0.4 }, { opacity: 0, scale: 3.6, x: dx * 2.6, y: dy * 2.6, duration: 1.6 + i * 0.2, ease: "power1.out" }, 0);
});
B.finish();
