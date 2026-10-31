"""Map agent D (Patton #15: move2a, move2b, move3a-move3d): who holds the ground + front polylines (map px).
usage (from patton/): python3 tools/pd_make_control.py ; then
  python3 tools/make_loss_layers.py pd_ard_ctl dec16 dec19 ; python3 tools/make_loss_layers.py pd_rhi_ctl mar07 mar21 mar23 mar24
Look = m2b (tools/m2b_make_control.py `save`: A4 light red, Allied blue, red rim); this file only imports its Map/save helpers.
-> assets/media/pd_ard_ctl_<dec16|dec19>_mx.png + pd_ard_front.json (ardennes z9)
   16 Dec: the start line (Cole: Monschau - Losheim - Schnee Eifel - Our - Sauer - Echternach) + the Saar front (Third Army).
   19 Dec: the salient of m2b (Cole: Elsenborn shoulder, Stoumont, St-Vith held, Houffalize, Noville, Wiltz, Ettelbruck).
-> assets/media/pd_rhi_ctl_<mar07|mar21|mar23|mar24>_mx.png + pd_rhi_front.json (rhine z9), MacDonald, The Last Offensive:
   7 Mar: Rhine reached from the Wesel pocket (west bank, cleared 10 Mar) to Cologne (6 Mar) - Bonn - Remagen (bridge taken 7 Mar,
          tiny east-bank foothold); 4th Armd at the Rhine near Andernach; Third Army on the Kyll / Trier, Saar; Palatinate German.
   21 Mar: west bank Allied from the Waal to Worms (Koblenz 19 Mar, Palatinate swept by 21-22 Mar; a German remnant south of Worms
          held until 24-25 Mar); Remagen bridgehead to the Sieg - Linz - Neuwied edge.
   23 Mar: + the Oppenheim bridgehead (radius more than 5 miles after 24 h).
   24 Mar: + the Rees - Wesel bridgehead (Plunder, night 23-24 Mar) and the Varsity drop zones east of Wesel (Diersfordt - Hamminkeln).
-> assets/media/pd_lor_front.json (lorraine z10, option 2): Third Army on the Saar facing east + VIII Corps on the Our / Sauer, 16 Dec
-> assets/media/pd_opp.json (oppenheim z13, option 2): the Rhine centre line (traced by eye off the relief: the DEM misses it),
   bank fronts and the bridgehead arc."""
import json, math, os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from m2b_make_control import Map, save, NL_ROER, START, SAAR, B19, STVITH19, BORDER


def orient_de_left(M, pts, de):
    """polyline (map px) with the GERMAN side on the LEFT of travel (front2 default sideA = rome)."""
    px = M.line(pts); sc = 0
    for (x0, y0), (x1, y1) in zip(px, px[1:]):
        dx, dy = x1 - x0, y1 - y0; L = math.hypot(dx, dy) or 1; mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        lx, ly = int(mx + dy / L * 10), int(my - dx / L * 10)
        if 0 <= lx < M.W and 0 <= ly < M.H: sc += 1 if de[ly, lx] else -1
    return px if sc >= 0 else px[::-1]


def ardennes():
    M = Map("ardennes")
    WEST = NL_ROER + START + SAAR
    base = M.poly([WEST + [(WEST[-1][0], 45), (12, 45), (12, 56), (WEST[0][0], 56)]])
    st = {"dec16": base, "dec19": base | (M.poly([B19]) & ~M.poly([STVITH19]))}
    for s, ax in st.items(): save(M, f"assets/media/pd_ard_ctl_{s}_mx.png", ax, ~ax)
    pre = [(6.30, 50.95), (6.45, 50.80), (6.40, 50.66)]
    json.dump({"dec16": orient_de_left(M, pre + START + SAAR[:6], st["dec16"]),
               "dec19": orient_de_left(M, pre + B19[:len(B19) - len(START) + 1] + SAAR[:6], st["dec19"])},
              open("assets/media/pd_ard_front.json", "w"))


# ---------------- rhine (z9), (lon, lat) ----------------
NL = [(3.0, 51.80), (3.9, 51.78), (4.6, 51.70), (5.3, 51.76), (5.75, 51.86), (5.82, 51.92), (5.95, 51.95), (6.06, 51.87)]
RH_N = [(6.15, 51.835), (6.28, 51.81), (6.40, 51.76), (6.50, 51.70), (6.62, 51.655), (6.70, 51.56), (6.75, 51.45), (6.77, 51.32),
        (6.78, 51.22), (6.88, 51.07), (6.97, 50.94), (7.05, 50.80), (7.11, 50.72), (7.19, 50.63), (7.24, 50.575)]
WESEL_POCKET = [(6.30, 51.66), (6.45, 51.72), (6.62, 51.67), (6.71, 51.55), (6.55, 51.48), (6.36, 51.52)]
REM07 = [(7.22, 50.59), (7.27, 50.60), (7.28, 50.56), (7.24, 50.555)]
S07 = [(7.24, 50.555), (7.05, 50.50), (6.95, 50.48), (7.36, 50.44), (7.38, 50.39), (6.92, 50.34), (6.82, 50.20), (6.72, 50.02),
       (6.70, 49.85), (6.62, 49.70), (6.55, 49.52), (6.62, 49.40), (6.75, 49.32), (7.00, 49.20), (7.40, 49.10), (7.95, 49.03), (8.20, 48.97)]
REM21 = [(7.17, 50.74), (7.32, 50.76), (7.46, 50.66), (7.49, 50.52), (7.42, 50.44), (7.33, 50.46), (7.26, 50.56)]
RH_S = [(7.33, 50.46), (7.47, 50.40), (7.59, 50.36), (7.64, 50.28), (7.71, 50.17), (7.77, 50.07), (7.90, 49.97), (8.08, 49.975),
        (8.27, 50.00), (8.33, 49.93), (8.355, 49.87), (8.38, 49.80), (8.37, 49.70), (8.36, 49.62)]
S21 = [(8.36, 49.60), (8.18, 49.56), (8.05, 49.45), (7.98, 49.25), (7.95, 49.0)]
OPP = [(8.33, 49.95), (8.43, 49.95), (8.48, 49.90), (8.48, 49.82), (8.42, 49.78), (8.38, 49.80), (8.355, 49.87)]
WES24 = [(6.30, 51.80), (6.42, 51.84), (6.58, 51.78), (6.68, 51.70), (6.71, 51.62), (6.70, 51.56), (6.62, 51.655), (6.40, 51.76)]


def rhine():
    M = Map("rhine")
    far = lambda line: [line[-1], (line[-1][0], 47), (14, 47), (14, 54), (line[0][0], 54)]
    L07 = NL + RH_N + S07; L21 = NL + RH_N[:-1] + [(7.24, 50.6)] + RH_S + S21
    ger07 = (M.poly([L07 + far(L07)]) | M.poly([WESEL_POCKET])) & ~M.poly([REM07])
    ger21 = M.poly([L21 + far(L21)]) & ~M.poly([REM21])
    ger23 = ger21 & ~M.poly([OPP]); ger24 = ger23 & ~M.poly([WES24])
    st = {"mar07": ger07, "mar21": ger21, "mar23": ger23, "mar24": ger24}
    for s, ax in st.items(): save(M, f"assets/media/pd_rhi_ctl_{s}_mx.png", ax, ~ax)
    fr = {"mar07": [orient_de_left(M, NL[4:] + RH_N + S07[:12], ger07)],
          "mar21": [orient_de_left(M, NL[4:] + RH_N[:-1] + [(7.22, 50.63), (7.17, 50.74), (7.32, 50.76), (7.46, 50.66), (7.49, 50.52),
                                                           (7.42, 50.44)] + RH_S[1:] + S21[:3], ger21)],
          "opp": [orient_de_left(M, OPP, ger23)], "wes": [orient_de_left(M, WES24, ger24)]}
    json.dump(fr, open("assets/media/pd_rhi_front.json", "w"))


def lorraine():
    M = Map("lorraine")
    line = BORDER[:6] + [(6.50, 49.73), (6.52, 49.70), (6.46, 49.60)] + SAAR[1:8]
    de = M.poly([line + [(8.6, 48.5), (8.6, 50.4), (6.13, 50.4)]])
    json.dump({"dec16": orient_de_left(M, line, de)}, open("assets/media/pd_lor_front.json", "w"))


# ---------------- oppenheim (z13): map px traced off the relief (see docstring) ----------------
RHINE_OPP = [[1455, -20], [1490, 100], [1525, 200], [1548, 300], [1556, 400], [1552, 500], [1538, 600], [1528, 700], [1532, 800],
             [1560, 900], [1620, 958], [1690, 1000], [1730, 1060], [1745, 1150], [1732, 1250], [1720, 1330], [1736, 1420], [1772, 1500],
             [1835, 1640]]


def oppenheim():
    M = Map("oppenheim")
    json.dump({"rhine": RHINE_OPP}, open("assets/media/pd_opp.json", "w"))


if __name__ == "__main__":
    for w in (sys.argv[1:] or ["ardennes", "rhine", "lorraine", "oppenheim"]): globals()[w]()
