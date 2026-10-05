// ENDING: the three moves replay on the Europe map, the method, the question (end-2 .. end-3). Basemap: europe (z6).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(6, 7093, 5051);
const T_RIDGE = at("end-2", "A ridge"), T_CAUSE = at("end-2", "a causeway"), T_RIVER = at("end-2", "a river"), T_THREE = at("end-2", "Three times");
const T_LEAD = at("end-2", "Lead from the front"), T_TAKE = at("end-2", "Take the ground"), T_ATTACK = at("end-2", "And attack"), S3 = P("end-3");
K.grid(G, 32, 60, -22, 40, 5, 0);
B.camera([[0, 1500, 800, 0.7], [END, 1500, 800, 0.72]]);
// who controls Europe by September 1944 (tools/make_europe_control.py) + nation flags (STYLE_LOCK 2026-10-05)
B.image("assets/media/europe_ctl_sep44.png", 0, 0, 2880, 1620, { t: 0.1, dur: 1.0 });
const flag = (src, name, lat, lon, t, w = 165) => { const [x, y] = G(lat, lon);
  return GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:6px"><img src="${src}" style="width:${w}px;display:block;border:2px solid #1a1712;box-shadow:0 3px 8px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:40px;color:#f7f3ea;text-shadow:0 2px 4px #000,0 0 10px rgba(0,0,0,0.8);letter-spacing:0.08em">${name}</div></div>`, x, y, { t, pop: true }); };
flag("assets/media/ger_reich_flag.png", "GERMANY", 49.6, 12.6, 0.4);
flag("assets/media/uk_flag.png", "BRITAIN", 52.4, -1.2, 0.6);
flag("assets/media/ussr_flag.png", "USSR", 52.6, 35.9, 0.8);
[["NEUTRAL", 40.0, -3.8], ["NEUTRAL", 39.3, 33.0]].forEach(([n, la, lo]) => { const [x, y] = G(la, lo); GG.lbl(n, x, y, { size: 36, color: "#f2eee4", t: 1.0 }); });
GG.card(`<div style="display:flex;gap:26px;font-size:24px;letter-spacing:0.08em;align-items:center"><span><b style="display:inline-block;width:22px;height:22px;background:#2e5cb2;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>ALLIES</span><span><b style="display:inline-block;width:22px;height:22px;background:#be3a2a;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>AXIS</span><span><b style="display:inline-block;width:22px;height:22px;background:#807c72;vertical-align:-3px;margin-right:8px;border:1px solid #f7f3ea"></b>NEUTRAL</span></div>`, "", 40, 0.5, T_LEAD - 0.4);
B.showDate(0.1);
B.date("1943 – 1944", 0.3, T_LEAD - 0.4, 38);
[["BIAZZA RIDGE", G(37.01, 14.42), T_RIDGE], ["LA FIÈRE", G(49.40, -1.36), T_CAUSE], ["THE WAAL", G(51.85, 5.86), T_RIVER]].forEach(([name, [x, y], t], i) => {
  K.target(x, y, t, { r: 34, side: "carth", until: T_LEAD });
  GG.tagbox(`${i + 1} · ${name}`, x + 40, y + 6, "#1f4fc4", { size: 32, anchor: [0, -50], t: t + 0.1, until: T_LEAD });
  SFX("hit", t + 0.1);
});
B.caption("THREE TIMES THE PLAN FELL APART · THREE TIMES GAVIN WAS AT THE FRONT", T_THREE, T_LEAD - 0.4, "carth r");
B.dim(T_LEAD - 0.4, END + 1, 0.7);
B.dateBox(T_LEAD - 0.4);
GG.method(3, T_LEAD - 0.2, END + 1, [T_LEAD, T_TAKE, T_ATTACK]);
B.caption("WHICH COMMANDER SHOULD WE COVER NEXT?", S3 + 0.2, END + 1, "r");
B.finish();
