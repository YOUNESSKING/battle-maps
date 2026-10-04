// INTRO: four combat jumps, the three moves (hook-3). Basemap: europe (z6).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const K = FXK(B);
const GG = GGK(B);
const G = GG.proj(6, 7093, 5051);
const p = "hook-3";
const T_NAME = at(p, "His name"), T_FOUR = at(p, "jumped into battle four times"), T_SIC = at(p, "Sicily"), T_SAL = at(p, "Salerno"), T_NOR = at(p, "Normandy"), T_HOL = at(p, "and Holland");
const T_NOOTHER = at(p, "No other American"), T_RIFLE = at(p, "He carried"), T_THREE = at(p, "And three times"), T_THESE = at(p, "These are");
K.grid(G, 32, 60, -22, 40, 5, 0);
B.camera([[0, 1400, 860, 0.9], [T_NOR - 0.5, 1400, 860, 0.9], [T_HOL + 1.0, 1400, 830, 0.86], [END, 1400, 840, 0.9]]);
B.showDate(0.1);
B.date("1943 – 1944", 0.3, null, 38);
K.badge({ name: "JAMES M. GAVIN", role: "82ND AIRBORNE DIVISION", photo: "assets/media/gavin_head.png", flag: "us", side: "carth", corner: "bl", t: T_NAME - 0.2, until: T_THREE });
const JUMPS = [["SICILY", "JULY 1943", G(37.0, 14.4), T_SIC], ["SALERNO", "SEPT 1943", G(40.6, 14.9), T_SAL], ["NORMANDY", "JUNE 1944", G(49.4, -1.3), T_NOR], ["HOLLAND", "SEPT 1944", G(51.84, 5.86), T_HOL]];
JUMPS.forEach(([name, date, [x, y], t], i) => {
  GG.chute(x, y - 30, t - 0.1, { s: 60 });
  SFX("hit", t);
  GG.tagbox(`${i + 1} · ${name} · ${date}`, x + (i === 2 ? -40 : 40), y + 30, "#1f4fc4", { size: 22, anchor: i === 2 ? [-100, -50] : [0, -50], t: t + 0.1 });
});
B.line([G(37.0, 14.4), G(40.6, 14.9), G(49.4, -1.3), G(51.84, 5.86)], { dash: "14 10", width: 5, t: T_SIC, dur: T_HOL - T_SIC + 0.5 });
GG.card(`<div style="font-size:52px;font-weight:700;letter-spacing:0.1em">4 COMBAT JUMPS IN 14 MONTHS</div>`, "tr", 640, T_NOOTHER - 0.3, T_RIFLE - 0.2);
B.caption("NO OTHER AMERICAN GENERAL MADE FOUR", T_NOOTHER, T_RIFLE - 0.2, "carth r");
B.caption("HE CARRIED AN M1 RIFLE, LIKE A PRIVATE", T_RIFLE, T_THREE - 0.2, "carth r");
const list = GG.card(`<div class="h">HIS 3 GREATEST TACTICAL MOVES</div><div class="row"><b>1</b>BIAZZA RIDGE · SICILY 1943</div><div class="row"><b>2</b>THE LA FIÈRE CAUSEWAY · NORMANDY 1944</div><div class="row"><b>3</b>THE WAAL CROSSING · HOLLAND 1944</div>`, "gg-list", 300, T_THREE + 0.4, END + 1);
list.querySelectorAll(".row").forEach((r, i) => B.tl.fromTo(r, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out" }, T_THESE + 0.4 + i * 0.9));
[0, 1, 2].forEach((i) => SFX("hit", T_THESE + 0.4 + i * 0.9));
B.finish();
