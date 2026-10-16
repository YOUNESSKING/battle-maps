"""Front lines for the `chanc` close-up (Jackson MOVE 3, 1-2 May 1863), option 2 (two-colour glowing K.front; no fill).
usage (from jackson/): python3 tools/make_chanc_control.py
-> assets/media/chanc_front_may1n.json  night 1 May - 2 May afternoon: {"contact": the Union arc where it touches Lee's men
                                         (Hancock east of Chancellorsville, Slocum's XII Corps south, Sickles at Hazel Grove),
                                         "xi": the XI Corps line along the Orange Turnpike from Dowdall's Tavern to the Talley farm
                                         (one colour: no enemy in front of it = the flank "in the air"),
                                         "north": Meade's V Corps line north to the Rappahannock (one colour)}
-> assets/media/chanc_front_may2e.json  ~7:15 pm 2 May (the halt): {"contact": the new Union line facing west (Berry at Fairview /
                                         the Plank Road, ~1 mile west of Chancellorsville... ~0.3 mi east of the wounding site) joined
                                         to the old southern arc; Confederate side outward}
-> assets/media/chanc_front_sweep.json  the flank attack: {"from": Jackson's line astride the Turnpike (~2 mi wide, Luckett farm),
                                         "to": the halt line a mile short of Chancellorsville} (same point count, for K.front `to`)
Orientation: K.front sideA = the left of the direction of travel; every line is traced so that the Confederates (sideA "carth")
are outside the Union arc. Sources + accuracy: research/FACT_NOTES_chanc.md (Hotchkiss 2 May map; NPS FRSP flank-attack map;
ABT Chancellorsville May 2 map; approximate to ~100-200 m)."""
import json, math

J = json.load(open("assets/chanc.json")); z, (ox, oy) = J["zoom"], J["origin_world_px"]
def P(lat, lon):
    n = 256 * 2 ** z; r = math.radians(lat); return [round((lon + 180) / 360 * n - ox, 1), round((1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - oy, 1)]
R = json.load(open("assets/media/chanc_roads.json"))
def pike(x0, x1, dy=6, step=14):   # the Orange Turnpike between map x0 and x1 (sorted west -> east), nudged south of the road
    pts = sorted([p for g in R["turnpike"] for p in g if x0 <= p[0] <= x1], key=lambda p: p[0])
    out, last = [], -1e9
    for p in pts:
        if p[0] - last >= step: out.append([p[0], round(p[1] + dy, 1)]); last = p[0]
    return out
def LL(pts): return [P(*q) for q in pts]

# --- night 1 May .. 2 May afternoon
CONTACT = LL([(38.3180, -77.6160), (38.3100, -77.6185), (38.3040, -77.6215), (38.3000, -77.6270), (38.3010, -77.6330), (38.3030, -77.6395),
              (38.3005, -77.6460), (38.3025, -77.6525)])                       # Hancock -> Slocum's line -> Fairview front -> Hazel Grove
NORTH = LL([(38.3600, -77.5990), (38.3450, -77.6050), (38.3300, -77.6120), (38.3180, -77.6160)])      # V Corps to the river (south-bound)
XI_W, XI_E = P(38.3190, -77.6950)[0], P(38.3100, -77.6650)[0]
XI = pike(XI_W, XI_E) + LL([(38.3060, -77.6585), (38.3025, -77.6525)])   # Talley farm -> Wilderness Church -> Dowdall's -> Hazel Grove
json.dump({"contact": CONTACT, "xi": XI, "north": NORTH}, open("assets/media/chanc_front_may1n.json", "w"))

# --- ~7:15 pm 2 May: the arc + the new west-facing line (traced south -> north so the Confederates are west of it)
MAY2E = CONTACT + LL([(38.3070, -77.6480), (38.3110, -77.6474), (38.3160, -77.6465), (38.3230, -77.6455)])
json.dump({"contact": MAY2E, "north": NORTH}, open("assets/media/chanc_front_may2e.json", "w"))

# --- the sweep: Jackson's start line (Rodes in front, ~2 mi wide astride the Turnpike, just east of the Brock Road junction) -> the halt
N = 7
A = [P(38.3010 + k * (0.0300 / (N - 1)), -77.7030 + 0.0012 * abs(k - 3)) for k in range(N)][::-1]      # traced north -> south: A = east?
# heading south puts sideA on the EAST: reverse to south -> north so the Confederates (A) are on the WEST
A = A[::-1]
Bp = [P(38.3010 + k * (0.0230 / (N - 1)), -77.6545 + 0.0006 * abs(k - 3)) for k in range(N)]
json.dump({"from": A, "to": Bp}, open("assets/media/chanc_front_sweep.json", "w"))
print("fronts written; XI pts", len(XI), "sweep", len(A), len(Bp))
