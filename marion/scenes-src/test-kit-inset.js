// KIT TEST (d): the hook's one continuous zoom, lowcountry -> santee (INSET, 8x), ending inside the santee map at the Great Savannah.
//   python3 kit/build_scene.py test-kit-d lowcountry --dur 6 --inset santee --src test-kit-inset     (snapshots 2.6 = mid-way, 6 s)
LIVING({ clouds: 0.1 });
dateNow("AUGUST 1780");
const PI = INSET("santee", { s0: 2.2, s1: 2.8 });   // r2: the nested map takes over early and fast (the two maps' roads never show doubled for long)
const PC = LYT(33.462, -80.338);   // the ferry + the house (inside the santee inset)
camera([[0, ...LYT(33.52, -80.28), 0.77], [0.5, ...LYT(33.52, -80.28), 0.77], [3.4, ...LYT(33.47, -80.31), 4.0, "power2.in"], [5.2, ...PC, 16.0, "power2.out"], [6, ...PC, 16.4]]);
SIDEFLAG("gb", LYT(32.98, -80.52)); SIDEFLAG("sc", LYT(33.86, -79.55));
UNIT("g1", "british", LYT(33.4915, -80.3255), "infantry", { ech: "II", t: 4.6 });
