// RIVER (m-1 .. m-2): the Waal crossing on a dark 3D board. 26 glowing boats push off from the south bank under the guns on the
// north bank; about half are hit (water impacts, screen shake on every hit); the rest land and sweep east; the road bridge turns blue.
// Positions from the approved hook (gavin/scenes-src/hook.js). Map px on the nijmegen basemap (z15).
const B = Battle();
const GG = GGK(B);
const { at, P: PS } = B;
const END = B.T.duration;
const RAIL_N = [1382, 682], RAIL_S = [1400, 808], ROAD_N = [1744, 752], ROAD_S = [1760, 908];
const T_26 = at("m-1", "Twenty-six"), T_260 = at("m-1", "Two hundred"), T_300 = at("m-1", "Three hundred"), T_GUNS = at("m-1", "under the German"), S2 = PS("m-2");
const T_HALF = at("m-2", "Half of the boats"), T_REST = at("m-2", "The rest do"), T_NIGHT = at("m-2", "by nightfall"), T_THEIRS = at("m-2", "is theirs");
const BD = Board(B, { tex: "assets/media/board_nijmegen.jpg", keys: [
  [0, 1180, 640, 1260, 1200, 600], [S2, 1230, 430, 1060, 1230, 590], [T_NIGHT, 1500, 520, 1240, 1530, 680], [END, 1560, 470, 1180, 1580, 700]] });
document.getElementById("credit").textContent = "Terrain: Mapzen / AWS Terrain Tiles (open data)";
const NS = "http://www.w3.org/2000/svg", svg = BD.svg;
const el = (tag, attrs, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
const draw = [];  // functions (P) -> update geometry each frame
BD.hooks.push((P) => draw.forEach((f) => f(P)));
// bridges (pale glowing lines), labels
const line = (a, b, col, w, op = 1) => { const l = el("line", { stroke: col, "stroke-width": w, "stroke-linecap": "round", opacity: op, filter: "url(#bglow)" });
  draw.push((P) => { const p = P(...a), q = P(...b); l.setAttribute("x1", p[0]); l.setAttribute("y1", p[1]); l.setAttribute("x2", q[0]); l.setAttribute("y2", q[1]); }); return l; };
line(RAIL_N, RAIL_S, "#cfc6b0", 4, 0.8); const road = line(ROAD_N, ROAD_S, "#ff5a48", 7, 1);
const lbl = (txt, x, y, o = {}) => { const d = document.createElement("div"); d.textContent = txt;
  d.style.cssText = `position:absolute;left:0;top:0;transform:translate(-50%,-50%);white-space:nowrap;font-family:Oswald;font-weight:500;letter-spacing:.25em;font-size:${o.size || 22}px;color:${o.color || "#e9e3d3"};text-shadow:0 0 10px rgba(0,0,0,.9),0 2px 4px #000`;
  document.getElementById("scene").insertBefore(d, document.getElementById("credit")); draw.push((P) => { const p = P(x, y); d.style.left = p[0] + "px"; d.style.top = p[1] + "px"; }); return d; };
lbl("THE WAAL", 1000, 560, { size: 26, color: "#8fb8ff" }); lbl("NIJMEGEN", 1700, 1150, { size: 26 }); lbl("ROAD BRIDGE", ROAD_S[0] + 120, ROAD_S[1] + 40, { size: 20, color: "#ffb0a6" });
lbl("RAILWAY BRIDGE", RAIL_S[0] - 40, RAIL_S[1] + 50, { size: 18 });
// German positions on the north bank: red glow dots that open fire (tracer lines toward the river)
const RED = [[1100, 420], [1250, 515], [1395, 600], [1560, 650], [ROAD_N[0] + 30, ROAD_N[1] - 60]];
const reds = RED.map(([x, y]) => { const c = el("circle", { r: 9, fill: "#ff4a3a", filter: "url(#bglow)", opacity: 0 }); draw.push((P) => { const p = P(x, y); c.setAttribute("cx", p[0]); c.setAttribute("cy", p[1]); }); return c; });
reds.forEach((c, i) => B.tl.to(c, { opacity: 1, duration: 0.3 }, T_GUNS - 0.6 + i * 0.12));
// boats: 26 glowing blue wedges on the south bank; push off, cross perpendicular to the flow
const CROSS = [78, -100], SINK = new Set([1, 3, 4, 6, 9, 11, 13, 14, 16, 19, 21, 22, 24]);  // 13 of 26 ~ "about half"
const boats = [];
for (let i = 0; i < 26; i++) {
  const x = 980 + (i % 13) * 22 + (i > 12 ? 11 : 0), y = 640 + (i % 13) * 9 + (i > 12 ? 22 : 0);
  const b = { x, y, k: 0, sunk: SINK.has(i), node: el("path", { fill: "#3d7bff", stroke: "#cfe0ff", "stroke-width": 1.5, filter: "url(#bglow)", opacity: 0 }) };
  draw.push((P) => { const cx = b.x + CROSS[0] * b.k, cy = b.y + CROSS[1] * b.k; const p = P(cx - 7, cy + 4), q = P(cx + 7, cy + 4), r = P(cx + 5, cy - 4), s = P(cx - 5, cy - 4);
    b.node.setAttribute("d", `M${p[0]} ${p[1]}L${q[0]} ${q[1]}L${r[0]} ${r[1]}L${s[0]} ${s[1]}Z`); });
  B.tl.to(b.node, { opacity: 1, duration: 0.25 }, 0.2 + (i % 13) * 0.05);
  boats.push(b);
}
const PUSH = T_300 + 0.3;
boats.forEach((b, i) => {
  const t0 = PUSH + (i % 13) * 0.08 + (i > 12 ? 0.5 : 0);
  if (b.sunk) {
    const ks = 0.35 + ((i * 37) % 30) / 100, th = T_HALF - 0.6 + ((i * 53) % 25) / 10;  // hit somewhere mid-river
    B.tl.to(b, { k: ks, duration: th - t0, ease: "none", onUpdate: BD.render }, t0);
    B.tl.to(b.node, { attr: { fill: "#555b66", stroke: "#8a8f99" }, duration: 0.2 }, th);
    B.tl.to(b.node, { opacity: 0, duration: 1.4 }, th + 0.5);
  } else B.tl.to(b, { k: 1.25, duration: T_REST + 0.6 - t0, ease: "sine.inOut", onUpdate: BD.render }, t0);
});
// fire: tracers from the red positions to the river; water impacts (splash ring + flash) with the locked boom and a screen shake
const sc = document.getElementById("scene");
const shake = (t, a = 7) => { B.tl.to(sc, { x: a, y: -a * 0.6, duration: 0.05, yoyo: true, repeat: 5, ease: "none" }, t); B.tl.set(sc, { x: 0, y: 0 }, t + 0.32); };
const impact = (x, y, t) => {
  const ring = el("circle", { fill: "none", stroke: "#e8f1ff", "stroke-width": 3, opacity: 0, filter: "url(#bglow)" }), fl = el("circle", { fill: "#ffd9a0", opacity: 0, filter: "url(#bglow)" });
  const o = { r: 0 }; draw.push((P) => { const p = P(x, y), q = P(x + 18 * o.r, y); const rr = Math.abs(q[0] - p[0]);
    ring.setAttribute("cx", p[0]); ring.setAttribute("cy", p[1]); ring.setAttribute("r", rr); fl.setAttribute("cx", p[0]); fl.setAttribute("cy", p[1]); fl.setAttribute("r", rr * 0.6 + 2); });
  B.tl.fromTo(o, { r: 0.2 }, { r: 2.2, duration: 0.8, ease: "power2.out", onUpdate: BD.render, immediateRender: false }, t);
  B.tl.fromTo(ring, { opacity: 0.95 }, { opacity: 0, duration: 0.8, immediateRender: false }, t);
  B.tl.fromTo(fl, { opacity: 1 }, { opacity: 0, duration: 0.35, immediateRender: false }, t);
  SFX("impact", t); shake(t);
};
const tracer = (from, to, t) => { const l = el("line", { stroke: "#ffb46a", "stroke-width": 2.5, opacity: 0, filter: "url(#bglow)", "stroke-dasharray": "16 22" });
  draw.push((P) => { const p = P(...from), q = P(...to); l.setAttribute("x1", p[0]); l.setAttribute("y1", p[1]); l.setAttribute("x2", q[0]); l.setAttribute("y2", q[1]); });
  B.tl.fromTo(l, { opacity: 0.9, attr: { "stroke-dashoffset": 0 } }, { opacity: 0, attr: { "stroke-dashoffset": -120 }, duration: 0.6, ease: "none", immediateRender: false }, t); };
for (let j = 0; j < 14; j++) { const r = RED[j % 4], t = T_GUNS + 0.2 + j * 0.42; tracer(r, [1040 + (j * 41) % 220, 600 + (j * 29) % 110], t); if (j % 3 === 0) SFX("mg", t); }
const HITS = [[1080, 610], [1150, 640], [1010, 585], [1190, 600], [1110, 560], [1230, 640], [1060, 630]];
HITS.forEach(([x, y], k) => impact(x, y, T_GUNS + 1.4 + k * ((T_REST - T_GUNS - 1.4) / HITS.length)));
// numbers, Frontlines-style minimal typography top-left
const card = document.createElement("div");
card.style.cssText = "position:absolute;left:90px;top:90px;font-family:Oswald;color:#f4efe2;text-shadow:0 2px 12px rgba(0,0,0,.9)";
card.innerHTML = [["26", "BOATS"], ["260", "MEN"], ["300 M", "OF OPEN WATER"]].map(([n, w]) => `<div class="row" style="display:flex;align-items:baseline;gap:18px;margin-bottom:6px;opacity:0"><span style="font-size:64px;font-weight:700;color:#8fb8ff">${n}</span><span style="font-size:26px;letter-spacing:.35em;color:#d9c9a3">${w}</span></div>`).join("");
sc.insertBefore(card, document.getElementById("credit"));
[T_26, T_260, T_300].forEach((t, i) => { B.tl.fromTo(card.children[i], { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, t); SFX("hit", t); });
B.tl.to(card, { opacity: 0, duration: 0.6 }, S2 - 0.2);
// the far bank is taken: blue glow sweeps east along the north bank to both bridges; road bridge turns blue
const sweep = el("path", { fill: "none", stroke: "#3d7bff", "stroke-width": 8, "stroke-linecap": "round", filter: "url(#bglow)", opacity: 0.95 });
const SW = [[1100, 470], [1250, 555], [RAIL_N[0], RAIL_N[1] - 50], [1560, 665], [ROAD_N[0] - 10, ROAD_N[1] - 40]], sw = { k: 0 };
draw.push((P) => { const pts = SW.map((q) => P(...q)); let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  sweep.setAttribute("d", pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join("")); sweep.setAttribute("stroke-dasharray", `${L * sw.k} 99999`); });
B.tl.to(sw, { k: 1, duration: 2.6, ease: "power1.inOut", onUpdate: BD.render }, T_REST + 0.6);
reds.forEach((c, i) => B.tl.to(c, { attr: { fill: "#6b6f78" }, opacity: 0.35, duration: 0.4 }, T_REST + 0.9 + i * 0.45));
B.tl.to(road, { attr: { stroke: "#4f8bff" }, duration: 0.6 }, T_THEIRS); SFX("hit", T_THEIRS);
// end: title card and fade to black
const fin = document.createElement("div");
fin.style.cssText = "position:absolute;left:0;right:0;top:820px;text-align:center;font-family:Oswald;color:#f4efe2;text-shadow:0 3px 18px rgba(0,0,0,.95);opacity:0";
fin.innerHTML = `<div style="font-size:54px;font-weight:700;letter-spacing:.12em">THE BRIDGE IS TAKEN</div><div style="font-size:24px;letter-spacing:.45em;color:#d9c9a3">NIJMEGEN · 20 SEPTEMBER 1944</div>`;
sc.insertBefore(fin, document.getElementById("credit"));
B.tl.to(fin, { opacity: 1, duration: 1.0 }, T_THEIRS + 0.4);
const blk = document.createElement("div"); blk.style.cssText = "position:absolute;inset:0;background:#000;opacity:0"; sc.appendChild(blk);
B.tl.to(blk, { opacity: 1, duration: 1.0 }, END - 1.0);
B.finish();
