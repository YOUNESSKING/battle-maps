// KIT TEST: one continuous zoom from `east` through the nested `chesapeake` into `peninsula` (INSET, each map at its own resolution).
// python3 kit/build_scene.py test-kit-inset east --dur 6 --inset chesapeake --inset peninsula     (snapshots 2, 3.6, 6 s)
LIVING({ clouds: 0.1 });
dateNow("SEPTEMBER 1781");
INSET("chesapeake"); const PI = INSET("peninsula");
const Y = PLACE("yorktown"), PC = [PI.box[0] + PI.box[2] * 0.55, PI.box[1] + PI.box[3] * 0.5];   // end inside the peninsula inset
camera([[0, ...LYT(38.6, -75.6), 0.9], [0.6, ...LYT(38.6, -75.6), 0.9], [5.0, ...PC, 13.0, "power2.inOut"], [6, ...PC, 13.3]]);
UNIT("y1", "british", NUDGE(LYT(37.2180, -76.5150), { s: 13 }), "infantry", { ech: "XX", t: 4.6 });
