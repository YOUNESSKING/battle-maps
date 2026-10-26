// ===== method card 1 over the dimmed Race-to-the-Dan map =====
const M = P("method-1");
B.camera([[0, 1480, 760, 1.05], [END, 1500, 750, 1.12]]);
drawBase({ t: 0 });
B.showDate(0);
B.date("FEBRUARY 1781", 0, null, 36);
// end state of the race: Greene safe in Virginia, Cornwallis back at Hillsborough
B.unit({ id: "grn", side: "carth", kind: "inf", x: 2002, y: 296, w: 48, h: 30, label: "GREENE", t: 0 });
B.unit({ id: "brit", side: "rome", kind: "inf", x: 1830, y: 690, w: 50, h: 32, label: "CORNWALLIS", t: 0 });
B.city("HILLSBOROUGH", ...PL.hillsborough, { size: 22, r: 7, t: 0 });
B.dim(0, END + 1, 1);
B.method(2.3, null, { hi: 0, rowT: [at("method-1", "Make the land") - 0.1, at("method-1", "Make every") - 0.1, at("method-1", "And never") - 0.1] });
