// GLOBE OPENING (test, 2026-10-04; not locked until the owner approves): the video opens on the Earth, turns to the
// theatre, zooms in and dissolves into the parchment basemap, matched to the scene's first camera view.
// Usage (after `const B = Battle();`):
//   GLOBE(B, { lat, lon,            // map point under the screen centre at the hand-off (scene's first camera view)
//              endScale,            // px per radian at the hand-off = (2^zoom*256/2pi) / cos(lat) * camera scale
//              from: [lat0, lon0],  // where the globe starts facing (it turns to [lat, lon])
//              red: [ids], blue: [ids],  // ISO-3166 numeric country ids tinted with the locked territory colours
//              t: 0, turn: 1.6, zoom: 2.0, fade: 0.6, lift: 90 });  // lift = globe starts this many px above centre (clear of the odds card)
// Drawn with d3-geo (orthographic) from Natural Earth 1:50m (world-atlas, public domain). Everything is driven by the
// paused timeline (a tweened proxy + onUpdate), so renders are deterministic and seek-safe.
(function () {
  window.GLOBE = function (B, o) {
    const W = 1920, H = 1080, NS = "http://www.w3.org/2000/svg";
    const TINT = { red: "#a8503c", blue: "#4a6a9a" };
    const topo = window.WORLD50, countries = topojson.feature(topo, topo.objects.countries).features;
    const land = topojson.feature(topo, topo.objects.land);
    const scene = document.getElementById("scene"), world = document.getElementById("world");
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("width", W); svg.setAttribute("height", H);
    svg.style.cssText = "position:absolute;left:0;top:0;pointer-events:none;";
    svg.innerHTML = `<defs>
        <radialGradient id="gl-sea" cx="42%" cy="38%" r="70%"><stop offset="0" stop-color="#b9cac6"/><stop offset="0.75" stop-color="#93aaa9"/><stop offset="1" stop-color="#6f8786"/></radialGradient>
        <radialGradient id="gl-bg" cx="50%" cy="50%" r="75%"><stop offset="0" stop-color="#3b352a"/><stop offset="1" stop-color="#14120e"/></radialGradient>
        <radialGradient id="gl-shade" cx="38%" cy="34%" r="72%"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.42"/></radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#gl-bg)"/>
      <circle class="glow" fill="none" stroke="#c9b48a" stroke-opacity="0.35"/>
      <path class="sea" fill="url(#gl-sea)"/>
      <path class="grat" fill="none" stroke="rgba(60,50,30,0.28)" stroke-width="1.2" stroke-dasharray="5 7"/>
      <path class="land" fill="#e2d4b0" stroke="#5a5242" stroke-width="0.9"/>
      <path class="red" fill="${TINT.red}" fill-opacity="0.55" stroke="#5a5242" stroke-width="0.9"/>
      <path class="blue" fill="${TINT.blue}" fill-opacity="0.6" stroke="#5a5242" stroke-width="0.9"/>
      <path class="borders" fill="none" stroke="#6d6450" stroke-width="0.7" stroke-opacity="0.8"/>
      <circle class="shade" fill="url(#gl-shade)"/>`;
    scene.insertBefore(svg, world.nextSibling); // above the map, below every card / caption added later
    const q = (c) => svg.querySelector("." + c);
    const proj = d3.geoOrthographic().translate([W / 2, H / 2]).clipAngle(90).precision(0.4);
    const path = d3.geoPath(proj);
    const grat = d3.geoGraticule10();
    const pick = (ids) => ({ type: "FeatureCollection", features: countries.filter((f) => (ids || []).includes(+f.id)) });
    const reds = pick(o.red), blues = pick(o.blue);
    const borders = topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b);
    const st = { dy: o.lift != null ? -o.lift : -90, lon: o.from ? o.from[1] : o.lon - 70, lat: o.from ? o.from[0] : o.lat - 15, ls: Math.log(o.startScale || 400) };
    const draw = () => {
      const s = Math.exp(st.ls);
      proj.rotate([-st.lon, -st.lat]).scale(s).translate([W / 2, H / 2 + st.dy]);
      const sphere = path({ type: "Sphere" });
      q("sea").setAttribute("d", sphere);
      q("grat").setAttribute("d", path(grat));
      q("land").setAttribute("d", path(land));
      q("red").setAttribute("d", path(reds));
      q("blue").setAttribute("d", path(blues));
      q("borders").setAttribute("d", path(borders));
      for (const c of ["glow", "shade"]) { const e = q(c); e.setAttribute("cx", W / 2); e.setAttribute("cy", H / 2 + st.dy); e.setAttribute("r", s + (c === "glow" ? 6 : 0)); }
      q("glow").setAttribute("stroke-width", Math.max(2, 14 - s / 200));
    };
    draw();
    const t = o.t || 0, turn = o.turn || 1.6, zoom = o.zoom || 2.0, fade = o.fade || 0.6;
    // the globe keeps turning WHILE it zooms (owner 2026-10-04): one spin over the whole opening, settling on the target at the hand-off
    B.tl.to(st, { lon: o.lon, lat: o.lat, duration: turn + zoom, ease: "sine.inOut", onUpdate: draw }, t);
    B.tl.to(st, { ls: Math.log(o.endScale), dy: 0, duration: zoom + turn * 0.5, ease: "power2.in", onUpdate: draw }, t + turn * 0.5);
    B.tl.to(svg, { opacity: 0, duration: fade, ease: "sine.inOut" }, t + turn + zoom - fade * 0.5);
    if (window.SFX && o.sfx !== false) SFX("whoosh", t + turn + zoom * 0.45); // the zoom sound: the dive from space is one of the biggest moves
    return { svg, end: t + turn + zoom + fade * 0.5 };
  };
})();
