// PLAN (p-1 .. p-2): Normandy, the five beaches and the airborne flanks; then behind Utah: flooded fields, causeways, the town on the main road.
const B = Battle();
const { at, P: PS } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(10, 128794, 88848);
// --- reference-style helpers (merged-style test): white-box labels, nation flags, legend ---
const box = (txt, x, y, t, size = 24, until) => { SFX("ref:pop", t); return GG.pin(`<div style="background:#f1eee6;color:#111;font-family:Oswald;font-weight:500;letter-spacing:.3em;padding:4px 9px 4px 14px;font-size:${size}px;box-shadow:0 2px 8px rgba(0,0,0,.6);white-space:nowrap">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 80) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><img src="${src}" style="width:${w}px;display:block;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)">${name ? `<div class="gg-lbl" style="position:relative;font-size:${Math.round(w / 4)}px;color:#f7f3ea;text-shadow:0 2px 4px #000;letter-spacing:0.08em">${name}</div>` : ""}</div>`, x, y, { t, pop: true, until });
const legend = (t, until) => GG.card(`<div style="display:flex;gap:26px;font-size:22px;letter-spacing:0.08em;align-items:center"><span><b style="display:inline-block;width:20px;height:20px;background:#2e5cb2;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>ALLIES</span><span><b style="display:inline-block;width:20px;height:20px;background:#8c0c14;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>GERMAN-HELD</span></div>`, "tr", 40, t, until);
const svgPath = (pts, attrs, t, dur = 1.2) => { const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); for (const k in attrs) p.setAttribute(k, attrs[k]);
  document.getElementById("overlay").appendChild(p); GG.hide(p); B.tl.fromTo(p, { autoAlpha: 0 }, { autoAlpha: 1, duration: dur }, t); return p; };

const T_FIVE = at("p-1", "five beaches"), T_UTAH = at("p-1", "Utah and Omaha"), T_GOLD = at("p-1", "Gold and Sword"), T_JUNO = at("p-1", "Juno"), T_FIRST = at("p-1", "But first"), T_THREE = at("p-1", "three airborne"), T_FLANKS = at("p-1", "guard the flanks");
const S2 = PS("p-2"), T_FLOOD = at("p-2", "flooded the fields"), T_CAUSE = at("p-2", "narrow causeways"), T_MUST = at("p-2", "must take them"), T_TOWN = at("p-2", "the town");
B.image("assets/media/normandy_ctlm_before.png", 0, 0, 2880, 1620, { t: 0, dur: 0.6 });
const SME = G(49.408, -1.317);
B.camera([[0, 1500, 820, 0.68], [T_FLANKS, 1500, 820, 0.7], [S2 + 0.3, 1370, 720, 1.6], [T_TOWN, 1350, 720, 1.75], [END, 1345, 718, 1.8]]);
B.showDate(0.2); B.date("THE PLAN · 6 JUNE 1944", 0.3, null, 30);
B.image("assets/media/emblem_ger.png", ...G(49.05, -0.75).map((v) => v - 150), 300, 300, { t: 0.4, dur: 1.2, opacity: 0.75, until: S2 + 0.5 });
legend(0.6, S2); box("NORMANDY · GERMAN-HELD", ...G(49.0, -0.75), 1.4, 30, S2);
const BEACH = [["UTAH", 49.415, -1.175, "us", T_UTAH], ["OMAHA", 49.37, -0.88, "us", T_UTAH + 0.6], ["GOLD", 49.345, -0.58, "uk", T_GOLD], ["JUNO", 49.335, -0.42, "ca", T_JUNO], ["SWORD", 49.295, -0.30, "uk", T_GOLD + 0.6]];
BEACH.forEach(([n, la, lo, side, t]) => { const [x, y] = G(la, lo);
  const keep = n === "UTAH" ? END + 1 : S2 + 0.2;
  B.arrow({ side: "carth", pts: [[x + (n === "UTAH" ? 120 : 0), y - 190], [x, y - 12]], width: 16, t, dur: 0.8, until: keep });
  box(n, x, y - 225, t + 0.1, 30, keep); SFX("hit", t); });
flag("assets/media/us_flag_48star.png", "USA", ...G(49.66, -1.0), T_UTAH + 0.3, S2 + 0.2, 110);
flag("assets/media/uk_flag.png", "BRITAIN", ...G(49.60, -0.5), T_GOLD + 0.3, S2 + 0.2, 110);
GG.tagbox("CANADA", ...G(49.50, -0.40), "#1f4fc4", { size: 24, t: T_JUNO + 0.2, until: S2 + 0.2 });
// the airborne flanks
const drop = (la, lo, t, n) => { const [x, y] = G(la, lo); for (let i = 0; i < n; i++) GG.chute(x + ((i * 37) % 120) - 60, y + ((i * 23) % 90) - 45, t + i * 0.08, { s: 34, until: S2 + 0.5 }); };
drop(49.40, -1.30, T_THREE, 7); drop(49.22, -0.25, T_THREE + 0.5, 5);
GG.tagbox("US 82ND + 101ST AIRBORNE", ...G(49.33, -1.48), "#1f4fc4", { size: 24, t: T_THREE + 0.4, until: S2 + 0.3 });
GG.tagbox("BRITISH 6TH AIRBORNE", ...G(49.16, -0.15), "#1f4fc4", { size: 24, t: T_THREE + 0.9, until: S2 + 0.3 });
// the transports are on screen whenever their engines are heard (owner 2026-10-06: no plane sound without a plane)
[[49.40, -1.30], [49.22, -0.25], [49.36, -1.25]].forEach(([la, lo], i) => { const [x, y] = G(la, lo), t = T_THREE - 0.8 + i * 0.4;
  K.aircraft({ kind: "cargo", side: "carth", size: 44, alt: 14, pts: [[x - 420, y - 60], [x + 260, y + 30]], t, dur: 3.2, until: t + 3.4, sfx: i ? false : undefined }); });
SFX("ref:whoosh", S2);
// behind Utah: the flooded fields (approximate), the narrow causeways, the town on the main road
const water = { fill: "none", stroke: "#4f86d8", "stroke-width": 26, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0.5 };
[[[49.47, -1.215], [49.43, -1.205], [49.39, -1.195], [49.355, -1.19]], [[49.46, -1.385], [49.43, -1.365], [49.40, -1.352], [49.37, -1.34], [49.345, -1.325]], [[49.345, -1.325], [49.33, -1.29], [49.315, -1.255]]].forEach((L) => svgPath(L.map(([a, b]) => G(a, b)), water, T_FLOOD));
box("FLOODED", ...G(49.445, -1.255), T_FLOOD + 0.3, 14); box("FLOODED", ...G(49.45, -1.43), T_FLOOD + 0.6, 14);
[[49.428, -1.19, 49.43, -1.235], [49.41, -1.186, 49.405, -1.23], [49.39, -1.18, 49.386, -1.225], [49.37, -1.183, 49.366, -1.222]].forEach(([a, b, c, d], i) => svgPath([G(a, b), G(c, d)], { stroke: "#f3eee2", "stroke-width": 5, "stroke-linecap": "round" }, T_CAUSE + i * 0.25, 0.4));
box("CAUSEWAYS", ...G(49.36, -1.25), T_CAUSE + 0.4, 14); SFX("hit", T_CAUSE);
GG.road([G(49.50, -1.47), G(49.43, -1.33), SME, G(49.35, -1.29), G(49.303, -1.248)], { w: 4, t: T_TOWN - 0.3 });
B.city("", ...SME, { r: 6, t: T_TOWN }); box("SAINTE-MÈRE-ÉGLISE", SME[0] - 150, SME[1] + 40, T_TOWN + 0.1, 14);
K.target(SME[0], SME[1], T_TOWN + 0.2, { r: 18, side: "carth", until: END + 1 });
K.raiseTerritory();
B.finish();
