// KIT TEST: one continuous zoom from `east` through the nested `chesapeake` into `peninsula` (INSET, each map at its own resolution).
// python3 kit/build_scene.py test-kit-inset east --dur 6 --inset chesapeake --inset peninsula     (snapshots 2, 3.6, 6 s)
LIVING({ clouds: 0.1 });
dateNow("SEPTEMBER 1781");
INSET("chesapeake"); const PI = INSET("peninsula");
const Y = PLACE("yorktown"), PC = [PI.box[0] + PI.box[2] * 0.52, PI.box[1] + PI.box[3] * 0.52];   // end inside the peninsula inset
const WY = LYT(37.255, -76.60);   // between Williamsburg and Yorktown: the names stay inside the frame on the way in
camera([[0, ...LYT(38.6, -75.6), 0.9], [0.6, ...LYT(38.6, -75.6), 0.9], [3.2, ...WY, 4.2, "power2.in"], [5.0, ...PC, 13.0, "power2.out"], [6, ...PC, 13.3]]);
UNIT("y1", "british", NUDGE(LYT(37.2030, -76.4700), { s: 13 }), "infantry", { ech: "XX", t: 4.6 });
