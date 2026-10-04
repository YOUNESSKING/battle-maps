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
B.camera([[0, 1400, 860, 0.9], [END, 1400, 840, 0.95]]);
B.showDate(0.1);
B.date("1943 – 1944", 0.3, T_LEAD - 0.4, 38);
[["BIAZZA RIDGE", G(37.01, 14.42), T_RIDGE], ["LA FIÈRE", G(49.40, -1.36), T_CAUSE], ["THE WAAL", G(51.85, 5.86), T_RIVER]].forEach(([name, [x, y], t], i) => {
  K.target(x, y, t, { r: 34, side: "carth", until: T_LEAD });
  GG.tagbox(`${i + 1} · ${name}`, x + 40, y + 6, "#1f4fc4", { size: 24, anchor: [0, -50], t: t + 0.1, until: T_LEAD });
  SFX("hit", t + 0.1);
});
B.caption("THREE TIMES THE PLAN FELL APART · THREE TIMES GAVIN WAS AT THE FRONT", T_THREE, T_LEAD - 0.4, "carth r");
B.dim(T_LEAD - 0.4, END + 1, 0.7);
B.dateBox(T_LEAD - 0.4);
GG.method(3, T_LEAD - 0.2, END + 1, [T_LEAD, T_TAKE, T_ATTACK]);
B.caption("WHICH COMMANDER SHOULD WE COVER NEXT?", S3 + 0.2, END + 1, "r");
B.finish();
