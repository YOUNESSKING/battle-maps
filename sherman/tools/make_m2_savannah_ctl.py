"""Savannah control geometry for tools/make_m2_control.py (Sherman #13, MOVE 2 agent). Rivers from Natural Earth (south_ne_rivers.json).
dec10 (10-20 Dec 1864): Sherman's army holds the ground between the Savannah River and the Ogeechee west of Hardee's line (~3-4 miles west of
the city, behind the flooded rice fields; Memoirs "overflowed rice-fields ... narrow causeways"); the city, the islands, Fort McAllister's
peninsula south of the Ogeechee (to 13 Dec) and the South Carolina shore = Confederate; coast posts (Fort Pulaski/Tybee, Hilton Head, Port
Royal) = Union since 1861-62. dec21: + Savannah to the sea and Fort McAllister (Hardee left 20 Dec, city surrendered 21 Dec)."""
ARMY_DEC10 = [(32.50, -82.20), (32.50, -81.232), (32.468, -81.196), (32.35, -81.152), (32.30, -81.13), (32.265, -81.143), (32.222, -81.145),
              (32.187, -81.154), (32.148, -81.138), (32.131, -81.132),
              (32.10, -81.160), (32.05, -81.180), (32.00, -81.200), (31.955, -81.235),          # Hardee's line (approx.)
              (31.962, -81.288), (32.006, -81.316), (31.99, -81.42), (32.06, -81.70), (32.18, -82.20)]
CITY_DEC21 = [(32.131, -81.132), (32.091, -81.087), (32.087, -80.998), (32.05, -80.945), (32.035, -80.92), (31.95, -80.95), (31.86, -81.05),
              (31.88, -81.16), (31.955, -81.235), (32.00, -81.20), (32.05, -81.18), (32.10, -81.16)]
MCALLISTER = [(31.93, -81.30), (31.907, -81.253), (31.875, -81.161), (31.83, -81.15), (31.83, -81.33)]
HARDEE_LINE = ARMY_DEC10[9:14]

def union(P, mask, W, H, dt, coast):
    polys = [ARMY_DEC10] + list(coast)
    if dt == "dec21": polys += [CITY_DEC21, MCALLISTER]
    return mask(P, W, H, polys=polys)
