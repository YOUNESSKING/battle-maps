// KIT TEST: one continuous zoom from `east` into the nested `peninsula` basemap (INSET). python3 kit/build_scene.py test-kit-inset east --dur 6 --inset peninsula
LIVING({ clouds: 0.1 });
INSET("peninsula");
const Y = PLACE("yorktown");
camera([[0, ...LYT(38.6, -75.6), 0.9], [1.0, ...LYT(38.6, -75.6), 0.9], [5.0, ...Y, 11.0, "power2.inOut"], [6, ...Y, 11.2]]);
UNIT("y1", "british", Y, "infantry", { ech: "XX" });
