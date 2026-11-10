"""s12d_rt round 3 road edits (critics): Edwards moved ~35 px E + 35 px S on screen (s 1.9 -> 18.4 map px each), roads
pulled to it locally; the Raymond-Edwards road bent ~40 px (21 map px) south off Champion Hill's hachures."""
import json, math
SRC = "/home/user/battle-maps/research/style_tests/roads_towns/roads/roads_px.json"
ED0, ED_OFF = (1581.0, 698.0), (18.4, 18.4)
ED1 = (ED0[0] + ED_OFF[0], ED0[1] + ED_OFF[1])

def fixed_roads():
    roads = json.load(open(SRC))["roads"]
    for r in roads:
        P = [tuple(p) for p in r["pts"]]
        if r["id"] == "raymond_edwards_road":
            cum = [0.0]
            for i in range(1, len(P)):
                cum.append(cum[-1] + math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]))
            L = cum[-1]
            P = [(x, y + 21.0 * math.sin(math.pi * c / L) ** 1.3) for (x, y), c in zip(P, cum)]
        if r["id"] == "grand_gulf_port_gibson":   # round 7: landing ~100 px (screen) north, just below the mouth of the Big Black
            x0, y0 = P[0]; dx, dy = 1264.0 - x0, 906.0 - y0
            cum = [0.0]
            for i in range(1, len(P)):
                cum.append(cum[-1] + math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]))
            Lr = cum[-1]
            P = [(x + dx * max(0, 1 - c / (0.75 * Lr)) ** 1.5, y + dy * max(0, 1 - c / (0.75 * Lr)) ** 1.5) for (x, y), c in zip(P, cum)]
        Q = []
        for x, y in P:
            w = math.exp(-((x - ED0[0]) ** 2 + (y - ED0[1]) ** 2) / (34.0 ** 2))
            Q.append((x + ED_OFF[0] * w, y + ED_OFF[1] * w))
        r["pts"] = Q
    return roads
