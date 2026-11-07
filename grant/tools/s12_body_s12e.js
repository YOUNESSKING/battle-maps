// SCRIPT-12 TEST, scene s12e (62.30 - 73.93 s): "On the fourth of July, Vicksburg surrendered, and the river that held the South together was Union
// water. But Robert E. Lee was still waiting in Virginia." Re-cut of the approved tools/vx_body_m2g.js (vicksburg_siege_w + the mississippi layer,
// ONE continuous zoom-out from the siege lines to the whole river, no cut): white flags + SURRENDERED on the spoken word, the city hatches blue
// (the only ground changing hands), the river drawn blue top to bottom on "Union water"; cliffhanger: Lee's portrait card at the east edge with an
// ink pointer toward Virginia (he has no unit on this map: a badge, <= 3.6 s). The 35-star US flag (July 1863).
// Built with: python3 tools/s12_inline.py vx s12e vicksburg_siege_w s12-5 s12-5 63.8 75.4667
// @@KIT
// @@DATA
const SZ = GD.maps.vicksburg_siege, MZ = GD.maps.mississippi;
const L = GG.proj(12, SZ.origin_world_px[0], SZ.origin_world_px[1]);
const LL = (pts) => pts.map(([la, lo]) => L(la, lo));
const F35 = "assets/media/us35_flag.png";
const P1 = "s12-5";
const T_JUL = at(P1, "On the fourth of July"), T_4 = at(P1, "fourth of July"), T_SUR = at(P1, "Vicksburg surrendered"), T_SURW = at(P1, "surrendered"),
  T_RIV = at(P1, "and the river"), T_HELD = at(P1, "held the South together"), T_UW = at(P1, "Union water"), T_BUT = at(P1, "But Robert"), T_LEE = at(P1, "Lee was"),
  T_WAIT = at(P1, "still waiting"), T_VA = at(P1, "in Virginia");
const VKS = L(32.352, -90.878);
const FRT = LL([[32.387, -90.880], [32.378, -90.858], [32.366, -90.846], [32.352, -90.840], [32.338, -90.843], [32.325, -90.850], [32.313, -90.861], [32.303, -90.875], [32.296, -90.889]]);
const RIVM = LL([[37.0, -89.18], [36.6, -89.5], [36.0, -89.7], [35.5, -90.0], [35.15, -90.07], [34.80, -90.30], [34.53, -90.58], [34.15, -90.85], [33.75, -91.05], [33.40, -91.08], [33.05, -91.12], [32.80, -91.16], [32.60, -91.12],
  [32.48, -91.06], [32.40, -91.00], [32.375, -90.93], [32.37, -90.895], [32.345, -90.893], [32.30, -90.90], [32.247, -90.935], [32.13, -91.04], [32.04, -91.07],
  [31.95, -91.16], [31.80, -91.30], [31.56, -91.42], [31.20, -91.58], [31.00, -91.62], [30.70, -91.32], [30.45, -91.20], [30.20, -91.08], [29.95, -90.07], [29.6, -89.75], [29.2, -89.3]]);
// ---------- the world (m2g): mississippi layers under the feathered siege relief + on top of it ----------
const AR = [MZ.origin_world_px[0] * 16 - SZ.origin_world_px[0], MZ.origin_world_px[1] * 16 - SZ.origin_world_px[1], 46080, 25920];
const group = (parent, before) => { const g = document.createElement("div"); g.style.cssText = `position:absolute;left:${AR[0]}px;top:${AR[1]}px;width:${AR[2]}px;height:${AR[3]}px;isolation:isolate;`; parent.insertBefore(g, before); return g; };
const gimg = (src, parent) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"; parent.appendChild(i); return i; };
const RELIEF = document.getElementById("relief");
const PU = group(WORLD, RELIEF); gimg("assets/media/vx_miss_w.jpg", PU);
const PW = group(WORLD, OVL); gimg("assets/media/vx_miss_w.jpg", PW);
hatch("assets/media/gn_siege_julcap_mx.png", T_SURW + 0.1, 1.6);   // the city changes hands: blue hatch, then dissolves
living(SZ.meters_per_px, [], { n: 5, clouds: 0.12 });
const FEATHER = "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%)";
let maskOn = null;
const setMask = (on) => { if (on === maskOn) return; maskOn = on; [RELIEF].forEach((el) => { const v = on ? FEATHER : "none"; el.style.webkitMaskImage = v; el.style.maskImage = v; el.style.webkitMaskComposite = on ? "source-in" : ""; el.style.maskComposite = on ? "intersect" : ""; }); };
// ---------- the one camera (m2g) ----------
const OVS = 1920 / AR[2];
const cam = { cx: 0, cy: 0, s: 2.6 };
const clampK = (s) => Math.min(1, Math.max(0, (s - 0.6) / 0.25));
const applyCam = () => { let s = cam.s, cx = cam.cx, cy = cam.cy; const cl = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const k = clampK(s); if (k > 0) { const ccx = cl(cx, 960 / s, 2880 - 960 / s), ccy = cl(cy, 540 / s, 1620 - 540 / s); cx += (ccx - cx) * k; cy += (ccy - cy) * k; }
  if (s < 0.9) { const mx = cl(cx, AR[0] + 960 / s, AR[0] + AR[2] - 960 / s), my = cl(cy, AR[1] + 540 / s, AR[1] + AR[3] - 540 / s); const j = 1 - k; cx += (mx - cx) * j; cy += (my - cy) * j; }
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); lens(cx, cy, s);
  const op = s >= 0.35 ? 0 : s <= 0.12 ? 1 : Math.log(0.35 / s) / Math.log(0.35 / 0.12);
  PW.style.opacity = op.toFixed(3); setMask(s < 0.8); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
const zoom = (t, dur, c0, s0, c1, s1, P, ease = "power2.inOut") => {
  const d0 = [(P[0] - c0[0]) * s0, (P[1] - c0[1]) * s0], d1 = [(P[0] - c1[0]) * s1, (P[1] - c1[1]) * s1], q = { u: 0 };
  tl.fromTo(q, { u: 0 }, { u: 1, duration: dur, ease, immediateRender: false, onUpdate: () => { const u = q.u, s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * u);
    cam.s = s; cam.cx = P[0] - (d0[0] + (d1[0] - d0[0]) * u) / s; cam.cy = P[1] - (d0[1] + (d1[1] - d0[1]) * u) / s; applyCam(); } }, t); };
const C0 = L(32.348, -90.862), S0 = 2.6, C1 = L(32.348, -90.858), S1 = 2.8;
const C2 = L(32.6, -90.6), S2 = OVS * 1.12;
const C3 = L(32.9, -89.6), S3 = OVS * 1.2;               // the cliffhanger: the camera leans east, toward Virginia
cam.cx = C0[0]; cam.cy = C0[1]; cam.s = S0; applyCam();
const TZ0 = T_RIV - 0.1, TZ1 = T_UW + 0.2;
camTo(0, TZ0, C1, S1, "sine.inOut");
zoom(TZ0, TZ1 - TZ0, C1, S1, C2, S2, VKS, "power2.inOut"); SFX("whoosh", TZ0 - 0.05);
camTo(TZ1 + 0.02, T_BUT - TZ1 - 0.02, [C2[0] + 200, C2[1]], S2 * 1.03, "sine.inOut");
camTo(T_BUT, END - T_BUT, C3, S3, "sine.inOut");
// ---------- HUD: the date scroll ----------
dateNow("JUNE 1863", T_4 - 0.05); B.date("4 JULY 1863", T_4, null, 32);
// ---------- the siege lines, units and portraits (on screen from frame 0: the hand-off from s12d) ----------
const FR = on0(front2(FRT, S1, 0, { dur: 0.01, flip: true, until: T_SURW + 0.8 }));
tl.set(FR, { autoAlpha: 1 }, 0);
const FUS = now(flagS(F35, "", ...L(32.36, -90.81), 0, null));
const FCS = now(flagS(FL.cs, "", ...L(32.335, -90.872), 0, null)); tl.to(FCS, { opacity: 0.55, duration: 0.8 }, T_SURW + 0.6);
U("u15", "carth", L(32.390, -90.842), "", "XXX"); U("u17", "carth", L(32.358, -90.826), "", "XXX"); U("u13", "carth", L(32.318, -90.836), "", "XXX");
U("rp", "rome", L(32.357, -90.866), "", "XX"); U("r2", "rome", L(32.375, -90.875), "", "XX"); U("r3", "rome", L(32.318, -90.874), "", "XX");
["u15", "u17", "u13", "rp", "r2", "r3"].forEach((id) => tagAt(id, null));
now(pinPortrait("u13", PHOTO("grant"), F35, "Grant", 0, null, true)); now(pinPortrait("rp", PHOTO("pemberton"), FL.cs, "Pemberton", 0, null, true, "left"));
// ---------- "Vicksburg surrendered": white flags along the works, the stamp ----------
const WFL = [];
const WF = `<svg width="30" height="34" viewBox="0 0 30 34" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #fff) drop-shadow(0 1px 2px #000)"><line x1="3" y1="2" x2="3" y2="34" stroke="#3a2c1c" stroke-width="2.4"/><path d="M4 3 Q12 0 19 4 Q24 6 28 4 L28 17 Q22 19 18 16 Q11 13 4 16 Z" fill="#fbfaf4" stroke="#8a8478" stroke-width="0.8"/></svg>`;
[[32.380, -90.866], [32.365, -90.856], [32.350, -90.851], [32.334, -90.855], [32.318, -90.867], [32.306, -90.881]].forEach(([la, lo], k) => {
  WFL.push(pinS(GG.pin(WF, ...L(la, lo), { t: T_SURW + 0.05 + k * 0.12, pop: true }))); });
const SUR = wstampL("SURRENDERED", ...L(32.345, -90.905), T_SURW + 0.15, TZ0 + 0.6, "#f7f3ea", 34);
// ---------- the one zoom-out: the river that held the South together becomes Union water (drawn blue top to bottom) ----------
const CLOSE = [...["u15", "u17", "rp", "r2", "r3"].map((id) => B.units[id].el), FUS, FCS, ...WFL];
CLOSE.forEach((el) => tl.to(el, { autoAlpha: 0, duration: 0.5 }, TZ0 + 0.8));
const MFL = [flagS(F35, "", ...L(34.6, -92.6), TZ0 + 1.2, END + 1), flagS(FL.cs, "", ...L(31.6, -87.3), TZ0 + 1.25, END + 1)];
{ const sv = document.createElementNS(NSs, "svg"); sv.setAttribute("viewBox", `0 0 ${AR[2]} ${AR[3]}`);   // inside the mississippi layer group (its own box: no clipping)
  sv.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none"; PW.appendChild(sv);
  const gl = document.createElementNS(NSs, "path"); sv.appendChild(gl);
  Object.entries({ fill: "none", stroke: "#6fa0ff", "stroke-width": (26 / S2).toFixed(1), "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => gl.setAttribute(k, v));
  gl.style.filter = "blur(" + (6 / S2).toFixed(0) + "px)";
  const p = document.createElementNS(NSs, "path"); p.setAttribute("d", "M" + RIVM.map((q) => [(q[0] - AR[0]).toFixed(1), (q[1] - AR[1]).toFixed(1)].join(" ")).join(" L")); sv.appendChild(p);
  Object.entries({ fill: "none", stroke: "#3c6fe0", "stroke-width": (8 / S2).toFixed(1), "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  tl.to(p, { opacity: 0.95, duration: 0.2 }, T_UW - 0.4); const RL = RIVM.map((q) => [q[0] - AR[0], q[1] - AR[1]]), dr = { u: 0.001 }; p.setAttribute("d", "M" + sub(RL, 0, 0.001, 2).map((q) => q.map((v) => v.toFixed(1)).join(" ")).join(" L"));
  tl.fromTo(dr, { u: 0.001 }, { u: 1, duration: 1.6, ease: "sine.inOut", immediateRender: false, onUpdate: () => { const d = "M" + sub(RL, 0, dr.u, 60).map((q) => q.map((v) => v.toFixed(1)).join(" ")).join(" L"); p.setAttribute("d", d); gl.setAttribute("d", d); } }, T_UW - 0.4);
  tl.to(gl, { opacity: 0.55, duration: 0.3 }, T_UW - 0.4);
  tl.to(p, { opacity: 0.75, duration: 1.0 }, T_LEE + 0.5); }
stampP("UNION WATER", ...L(33.95, -90.15), T_UW, T_LEE - 0.25, 30);   // right next to the river
// ---------- the cliffhanger: Robert E. Lee, still waiting in Virginia (no unit on this map: a portrait badge at the east edge, pointing east) ----------
// round 2: Lee has no unit on this map (Virginia is off it): a CORNER badge (2d.6), <= 3.5 s
{ const LB = cmd("lee", "ROBERT E. LEE", "VIRGINIA", "rome", "tr", T_LEE - 0.05, END + 1); const rl = [...LB.querySelectorAll("div")].find((d) => d.textContent === "VIRGINIA");
  gsap.set(rl, { autoAlpha: 0 }); tl.fromTo(rl, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, at(P1, "Virginia") - 0.05); }   // round 3: the sub-line ON "Virginia"
declutter([], [[T_UW, T_LEE - 0.25]]);
applyCam(); tl.call(applyCam, null, 0);
fixImgs();
K.raiseTerritory();
B.finish();
