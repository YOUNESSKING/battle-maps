// GLOBE OPENING (test v3, 2026-10-04; not locked until the owner approves): the video opens on a vibrant Earth that
// turns WHILE it zooms in, its colours morph into the parchment map palette during the dive, and it hands over to the
// basemap with a dissolve during which globe and map zoom at the SAME speed (motion never stops = seamless).
// Usage (after `const B = Battle();`, and give the scene camera matching keys, see globe-test.js):
//   GLOBE(B, { from: [lat0, lon0],            // where the globe starts facing
//              lat, lon, endScale,            // centre + px/radian when the dissolve STARTS (= map camera view then)
//              lat2, lon2, endScale2,         // centre + px/radian when the dissolve ENDS (= map camera view then)
//              red: [ids], blue: [ids],       // ISO-3166 numeric country ids (locked territory colours)
//              t: 0, turn: 1.4, zoom: 1.6, fade: 1.0, lift: 90 });
//   px/radian of a web-mercator basemap at zoom z, camera scale s, latitude L: (256 * 2^z / 2pi) / cos(L) * s
// Natural Earth 1:50m (world-atlas, public domain), d3-geo orthographic. Driven by the paused timeline (seek-safe).
(function () {
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const x = hex(a), y = hex(b); return "rgb(" + x.map((v, i) => Math.round(v + (y[i] - v) * p)).join(",") + ")"; };
  // vibrant globe -> parchment map palette (sea, land, border ink)
  const PAL = {
    sea0: ["#3d82bf", "#a9bdb9"], sea1: ["#1d4f86", "#93aaa9"], sea2: ["#0d2747", "#7e9695"],
    land: ["#e7d39a", "#e2d4b0"], ink: ["#4a4436", "#5a5242"],
  };
  window.GLOBE = function (B, o) {
    const W = 1920, H = 1080, NS = "http://www.w3.org/2000/svg";
    const TINT = { red: "#b44a33", blue: "#3f6fb0" };
    const topo = window.WORLD50, countries = topojson.feature(topo, topo.objects.countries).features;
    const land = topojson.feature(topo, topo.objects.land);
    const scene = document.getElementById("scene"), world = document.getElementById("world");
    let stars = ""; let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 140; i++) stars += `<circle cx="${(rnd() * W).toFixed(0)}" cy="${(rnd() * H).toFixed(0)}" r="${(0.6 + rnd() * 1.4).toFixed(1)}" fill="#fff" fill-opacity="${(0.25 + rnd() * 0.6).toFixed(2)}"/>`;
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("width", W); svg.setAttribute("height", H);
    svg.style.cssText = "position:absolute;left:0;top:0;pointer-events:none;";
    svg.innerHTML = `<defs>
        <radialGradient id="gl-sea" cx="40%" cy="36%" r="72%"><stop class="s0" offset="0"/><stop class="s1" offset="0.7"/><stop class="s2" offset="1"/></radialGradient>
        <radialGradient id="gl-bg" cx="50%" cy="45%" r="80%"><stop offset="0" stop-color="#101b2e"/><stop offset="1" stop-color="#03060c"/></radialGradient>
        <radialGradient id="gl-shade" cx="36%" cy="32%" r="74%"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></radialGradient>
        <radialGradient id="gl-spec" cx="34%" cy="28%" r="40%"><stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <filter id="gl-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
      </defs>
      <g class="space"><rect width="${W}" height="${H}" fill="url(#gl-bg)"/>${stars}</g>
      <circle class="atmo" fill="none" stroke="#7cc4ff" stroke-width="26" filter="url(#gl-blur)"/>
      <path class="sea" fill="url(#gl-sea)"/>
      <path class="grat" fill="none" stroke-width="1.1" stroke-dasharray="5 7"/>
      <path class="land" stroke-width="0.9"/>
      <path class="red" fill="${TINT.red}" stroke-width="0.9"/>
      <path class="blue" fill="${TINT.blue}" stroke-width="0.9"/>
      <path class="borders" fill="none" stroke-width="0.7" stroke-opacity="0.8"/>
      <circle class="shade" fill="url(#gl-shade)"/><circle class="spec" fill="url(#gl-spec)"/>`;
    scene.insertBefore(svg, world.nextSibling); // above the map, below every card / caption added later
    const q = (c) => svg.querySelector("." + c);
    const proj = d3.geoOrthographic().translate([W / 2, H / 2]).clipAngle(90).precision(0.4);
    const path = d3.geoPath(proj), grat = d3.geoGraticule10();
    const pick = (ids) => ({ type: "FeatureCollection", features: countries.filter((f) => (ids || []).includes(+f.id)) });
    const reds = pick(o.red), blues = pick(o.blue);
    const borders = topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b);
    const s0 = Math.log(o.startScale || 380), s1 = Math.log(o.endScale);
    const st = { dy: -(o.lift != null ? o.lift : 90), lon: o.from[1], lat: o.from[0], ls: s0 };
    const draw = () => {
      const s = Math.exp(st.ls), p = Math.min(1, Math.max(0, (st.ls - s0) / (s1 - s0)));
      const pc = Math.pow(p, 1.6); // colour morph: vibrant at first, parchment by the hand-off
      proj.rotate([-st.lon, -st.lat]).scale(s).translate([W / 2, H / 2 + st.dy]);
      q("sea").setAttribute("d", path({ type: "Sphere" }));
      ["s0", "s1", "s2"].forEach((k, i) => q(k).setAttribute("stop-color", mix(...PAL["sea" + i], pc)));
      q("grat").setAttribute("d", path(grat)); q("grat").setAttribute("stroke", pc > 0.5 ? `rgba(60,50,30,${0.12 + 0.12 * pc})` : `rgba(255,255,255,${0.16 * (1 - pc)})`);
      const ink = mix(...PAL.ink, pc);
      q("land").setAttribute("d", path(land)); q("land").setAttribute("fill", mix(...PAL.land, pc)); q("land").setAttribute("stroke", ink);
      q("red").setAttribute("d", path(reds)); q("red").setAttribute("fill-opacity", 0.75 - 0.5 * pc); q("red").setAttribute("stroke", ink);
      q("blue").setAttribute("d", path(blues)); q("blue").setAttribute("fill-opacity", 0.8 - 0.5 * pc); q("blue").setAttribute("stroke", ink);
      q("borders").setAttribute("d", path(borders)); q("borders").setAttribute("stroke", ink);
      for (const c of ["atmo", "shade", "spec"]) { const e = q(c); e.setAttribute("cx", W / 2); e.setAttribute("cy", H / 2 + st.dy); e.setAttribute("r", s + (c === "atmo" ? 10 : 0)); }
      q("atmo").setAttribute("stroke-opacity", 0.75 * (1 - pc)); q("shade").setAttribute("opacity", 1 - 0.85 * pc); q("spec").setAttribute("opacity", 1 - pc);
      q("space").setAttribute("opacity", 1 - pc);
    };
    draw();
    const t = o.t || 0, turn = o.turn || 1.4, zoom = o.zoom || 1.6, fade = o.fade || 1.0, tA = t + turn + zoom;
    // the globe keeps turning WHILE it zooms (owner 2026-10-04), arriving at the hand-off view at tA
    B.tl.to(st, { lon: o.lon, lat: o.lat, duration: turn + zoom, ease: "sine.inOut", onUpdate: draw }, t);
    B.tl.to(st, { ls: s1, dy: 0, duration: zoom + turn * 0.5, ease: "power1.in", onUpdate: draw }, t + turn * 0.5);
    // hand-off: globe and map keep zooming together at the same rate while the globe dissolves
    B.tl.to(st, { lat: o.lat2 != null ? o.lat2 : o.lat, lon: o.lon2 != null ? o.lon2 : o.lon, ls: Math.log(o.endScale2 || o.endScale * 1.18), duration: fade, ease: "none", onUpdate: draw }, tA);
    B.tl.to(svg, { opacity: 0, duration: fade, ease: "sine.inOut" }, tA);
    if (window.SFX && o.sfx !== false) SFX("whoosh", t + turn * 0.5 + zoom * 0.4); // the dive from space = one of the biggest moves
    return { svg, handoff: tA, end: tA + fade };
  };
})();
