// KIT TEST: night + storm (16-17 Oct) on the yorktown basemap. python3 kit/build_scene.py test-kit-wx yorktown --dur 6
LIVING({ clouds: 0.1, light: "night", lightK: 0.8 });
dateNow("16 OCTOBER 1781");
camera([[0, ...LYT(37.2380, -76.5060), 2.0], [END, ...LYT(37.2380, -76.5060), 2.05]]);
UNIT("b1", "british", LYT(37.2395, -76.5085), "infantry", { ech: "X" });
STORM(0.2, 6);
