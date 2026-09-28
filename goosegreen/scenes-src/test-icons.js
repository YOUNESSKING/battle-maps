// TEST: candidate unit symbols (artillery / tanks / mech) on real counters, for the owner to choose.
const B = Battle();
const K = FXK(B);
const END = B.T.duration;
B.camera([[0, 1500, 800, 1.55], [END, 1500, 800, 1.55]]);
document.getElementById("date").style.display = "none";
const bg = document.createElement("div");
bg.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;background:rgba(20,18,14,0.35)";
document.getElementById("world").insertBefore(bg, document.getElementById("overlay"));
const cols = [["A · NATO STANDARD", 1270], ["B · SILHOUETTES (K&G)", 1580], ["CURRENT", 1880]];
const rows = [["ARTILLERY", 640, ["art_nato", "art_gun", "artillery"]], ["TANKS", 820, ["tank_nato", "tank_sil", null]], ["MECH. INFANTRY", 1000, ["mech_nato", "mech_nato", null]]];
cols.forEach(([t, x]) => B.label(t, x, 520, { size: 20, t: 0, instant: true }));
rows.forEach(([name, y, icons]) => {
  B.label(name, 900, y, { size: 18, t: 0, instant: true, anchor: [0, -50] });
  icons.forEach((ic, c) => {
    if (!ic) { B.label("(none yet)", cols[c][1], y, { size: 14, t: 0, instant: true }); return; }
    ["carth", "rome"].forEach((side, k) => {
      const id = `u${y}_${c}_${k}`, x = cols[c][1] - 55 + k * 110;
      B.unit({ id, side, x, y, w: 50, h: 34, label: side === "carth" ? "2 PARA" : "12th REGT", t: 0 });
      K.counter(id, { icon: ic, flag: side === "carth" ? "uk" : "arg", size: ic.startsWith("art") || ic === "artillery" ? "I" : "II" });
    });
  });
});
B.finish();
