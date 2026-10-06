// UTAH (n-2): dawn; landing craft reach Utah Beach at 06:30; paratroopers hold the causeway exits; about 200 casualties, the lightest beach; end.
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

const T_SIX = at("n-2", "At six thirty"), T_HOLD = at("n-2", "With paratroopers"), T_COST = at("n-2", "about two hundred"), T_LIGHT = at("n-2", "the lightest"), T_BEGUN = at("n-2", "D-Day has begun");
B.image("assets/media/normandy_ctlm_dawn.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
GG.layer("background: linear-gradient(to left, rgba(255,150,70,0.22), rgba(120,70,90,0.12) 60%, rgba(20,20,50,0.12));", 0, END + 1, { dur: 0.01 });
const UT = G(49.415, -1.175), SME = G(49.408, -1.317);
B.camera([[0, UT[0] - 60, UT[1], 1.9], [T_HOLD, UT[0] - 90, UT[1] + 5, 2.1], [END, UT[0] - 100, UT[1] + 8, 2.2]]);
B.showDate(0.1); B.date("6 JUNE 1944 · 06:30", 0.2, null, 30);
box("UTAH BEACH", UT[0] + 70, UT[1] - 70, 0.4, 18); B.city("", ...SME, { r: 6, t: 0.3 }); box("SAINTE-MÈRE-ÉGLISE", SME[0] - 40, SME[1] + 36, 0.5, 14);
// landing craft run in from the sea (east) to the beach
for (let i = 0; i < 6; i++) { const y = UT[1] - 50 + i * 20, sh = GG.ship(UT[0] + 260, y, { w: 26, t: 0.3 + i * 0.1 });
  B.tl.to(sh, { x: -240, duration: T_SIX + 1.6 - 0.3, ease: "power1.inOut" }, 0.3 + i * 0.1); }
SFX("explosion", T_SIX + 0.4); SFX("impact", T_SIX + 1.2);
// paratroopers hold the causeway exits; the beach troops push inland along them
[[49.428, -1.235], [49.405, -1.23], [49.386, -1.225], [49.366, -1.222]].forEach(([a, b], i) => { const [x, y] = G(a, b), id = "pa" + i;
  B.unit({ id, side: "carth", x, y, w: 18, h: 12, t: T_HOLD + i * 0.2 }); K.counter(id, { icon: "infantry", flag: "us" });
  B.arrow({ side: "carth", pts: [[UT[0] - 4, UT[1] - 30 + i * 20], [x + 8, y]], width: 7, t: T_HOLD + 0.8 + i * 0.2, dur: 1.0 }); });
B.caption("PARATROOPERS HOLD THE CAUSEWAYS BEHIND THE BEACH", T_HOLD, T_COST - 0.2, "carth r");
const cas = GG.card(`<div style="text-align:center;font-weight:700"><div style="font-size:22px;letter-spacing:0.35em;color:#c9b48a">UTAH BEACH · D-DAY</div><div style="font-size:64px;line-height:1.1;color:#f4f1ea">~200 CASUALTIES</div><div style="font-size:22px;letter-spacing:0.25em;color:#9fc0ea">THE LIGHTEST OF THE FIVE BEACHES</div></div>`, "", 110, T_COST - 0.2, T_BEGUN - 0.3);
SFX("hit", T_COST);
GG.stamp("D-DAY HAS BEGUN", T_BEGUN + 0.1, END + 1); SFX("ref:boom", T_BEGUN);
const blk = document.createElement("div"); blk.style.cssText = "position:absolute;inset:0;background:#000;opacity:0;z-index:50"; document.getElementById("scene").appendChild(blk);
B.tl.to(blk, { opacity: 1, duration: 1.2 }, END - 1.2);
K.raiseTerritory();
B.finish();
