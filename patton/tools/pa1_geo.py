"""Shared geography for map agent A (Patton #15 move1a..move1e): projection + period place coordinates (lat, lon).
Coordinates: standard town centres (Nominatim / IGN), rounded to ~0.01 deg."""
import json, math
def proj(base):
    J = json.load(open(f"assets/{base}_hd_lift.json")); Z, (OX, OY) = J["zoom"], J["origin_world_px"]
    def P(lat, lon):
        n = 256 * 2 ** Z; r = math.radians(lat)
        return ((lon + 180) / 360 * n - OX, (1 - math.asinh(math.tan(r)) / math.pi) / 2 * n - OY)
    return P
PLACES = {
    "stlo": (49.116, -1.090), "marigny": (49.100, -1.245), "coutances": (49.048, -1.445), "granville": (48.838, -1.597),
    "avranches": (48.684, -1.357), "pontaubault": (48.630, -1.352), "villedieu": (48.838, -1.220), "brecey": (48.725, -1.166),
    "brest": (48.390, -4.486), "rennes": (48.111, -1.680), "stmalo": (48.649, -2.008), "lorient": (47.748, -3.370),
    "vannes": (47.658, -2.760), "nantes": (47.218, -1.554), "stnazaire": (47.273, -2.214), "angers": (47.473, -0.552),
    "laval": (48.073, -0.770), "mayenne": (48.303, -0.614), "lemans": (48.006, 0.199), "mortain": (48.648, -0.940),
    "alencon": (48.432, 0.091), "sees": (48.605, 0.172), "argentan": (48.744, -0.020), "falaise": (48.894, -0.193),
    "caen": (49.183, -0.370), "chambois": (48.807, 0.108), "trun": (48.843, 0.032), "mantes": (48.990, 1.717),
    "paris": (48.857, 2.352), "dreux": (48.737, 1.366), "chartres": (48.446, 1.489), "vire": (48.838, -0.889),
    "fougeres": (48.352, -1.199), "sthilaire": (48.577, -1.091), "evreux": (49.024, 1.151), "rouen": (49.443, 1.099),
    "cherbourg": (49.639, -1.616), "bayeux": (49.276, -0.703), "lisieux": (49.146, 0.226), "tours": (47.394, 0.684),
    "orleans": (47.903, 1.909), "quimper": (47.996, -4.102), "stbrieuc": (48.514, -2.765), "morlaix": (48.578, -3.828),
    "dinan": (48.455, -2.050), "chateaubriant": (47.717, -1.376), "evron": (48.156, -0.401), "flers": (48.749, -0.570),
    "domfront": (48.593, -0.646), "carrouges": (48.567, -0.155), "ecouche": (48.718, -0.124), "gace": (48.795, 0.296),
    "laigle": (48.765, 0.629), "verneuil": (48.739, 0.929), "vernon": (49.092, 1.485), "larocheguyon": (49.081, 1.632),
    "mamers": (48.349, 0.369), "beaumont": (48.226, 0.130), "lude": (47.646, 0.157), "chateaugontier": (47.829, -0.703),
    "barenton": (48.600, -0.835), "juvigny": (48.690, -1.020), "stbarthelemy": (48.670, -0.965), "tirepied": (48.712, -1.270),
    "ducey": (48.618, -1.290), "pontorson": (48.553, -1.508), "stjames": (48.523, -1.320), "jersey": (49.215, -2.135),
    "guernsey": (49.455, -2.580), "alderney": (49.715, -2.200),
}
