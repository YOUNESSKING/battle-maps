# gm3d overlay: Grand Maneuver HUD + cards (experiment)

`overlay.js` rebuilds Grand Maneuver's on-screen overlays, measured from real frames of their France 1814 video (`OVERLAY_SPEC.md`). One script, CSS inside, fonts in `assets/fonts/` (Cormorant Garamond + Cinzel, OFL). Everything is a pure function of the GSAP timeline time, so a HyperFrames render is frame-exact.

Files: `overlay.js` (module), `demo.html` (all elements over a still, 62 s), `stills.jpg`, `compare.jpg` (theirs vs ours), `tools/gm_frames.py` (frame sampling / crops / colour sampling), `demo.mp4` (rendered, not committed).

## Set-up
```html
<script src="vendor/gsap.min.js"></script>
<script src="overlay.js"></script>
<div id="ov" style="position:absolute;inset:0"></div>   <!-- 1920x1080 stage -->
<script>
const tl = gsap.timeline({ paused: true });
const O = GMOverlay.create(document.getElementById("ov"), {
  tl,                                   // the composition timeline (required for rendering)
  project: (world, t) => ({ x, y, visible }),   // world -> screen px at time t (from the 3D world agent)
  fontBase: "assets/fonts/",            // where the woff2 files live
  seed: 1814,                           // grain / paper / seal textures
});
// ... API calls (all times in seconds on tl) ...
window.__timelines = { main: tl };
</script>
```
`O.update(t)` is chained onto `tl`'s own onUpdate (after all tweens render). A host that sets `tl.eventCallback("onUpdate", ...)` after `create` must call `O.update(tl.time())` itself (or pass `hook:false` and call it from its render loop). World points are whatever the projector accepts (e.g. `[x, y, z]`).

## API (every call returns O unless noted; tIn/tOut in seconds, tOut may be null = stays)
| Element | Call |
|---|---|
| Date plaque | `O.plaque.date(t, {month:"February 1814", day:"10", weekday:"Thursday", note:"day one · fog · thaw"})` |
| Clock plaque (pocket watch) | `O.plaque.clock(t, {time:"5:30", note:"Mist in the Kolocha valley", header?:"7 September 1812"})` |
| Clock runs (minute-precise) | `O.plaque.run(t0, t1, "9:45", {step:1})` (24 h strings or minutes) / `O.plaque.set(t, "12:00")` |
| Weather line, label override | `O.plaque.note(t, "Smoke over the field")`, `O.plaque.label(t, "And night")` (`null` restores the time) |
| Hide plaque | `O.plaque.hide(t)` (`O.watch` is an alias) |
| Timeline bar | `O.timeline.show(t, {month:"Feb", year:"1814", days:["10",...,"15"], at:0, counter?:"Casualties"})` (`cells:[...]` for hours) |
| Playhead (red line) | `O.timeline.go(t, {at:2.5, d:1.2, cas?:43000})` (at = cell index + fraction) |
| Wax seal + battle name | `O.timeline.seal(t, {at:1.0, name:"Champaubert"})` (at = right edge of the cell) |
| Legend | `O.legend(tIn, tOut, {title?, entries:[{name:"French", sub:"Napoleon · Ney", color:"#3C6E9E"}]})` |
| Medallion, ivory card + leader line | `O.medallion({kind:"card", img, side:"fr", role:"Emperor", name:"Napoleon", sub?, men:"30,000", world, offset:[dx,dy], tIn, tOut})` |
| Medallion, dark plate | `O.medallion({kind:"plate", img, side:"uk", role?, name:"Wellington", titleCase?, sub, men?, screen:[x,y] or world+offset, leader:false, tIn, tOut})` |
| Oval painting inset | `O.inset(tIn, tOut, {img, x, y, w:480, h:358, caption:"Into France, Oct. 1813 · W. Heath"})` |
| Place card with small oval | `O.place(tIn, tOut, {title, sub, img?, world or x,y})` |
| Event label + map marker | `O.label(tIn, tOut, {name, sub, world, side or stripes, small?, marker?})` (returns its handle) |
| Letter card (typed quote) | `O.letter(tIn, tOut, {header:"2 February 1814 · Piney", title:"Napoleon to Clarke", sub, quote, cps:28})` |
| Centred quote on a dim | `O.quote(tIn, tOut, {orig?, lang:"fr"/"de"/"ru", en, attr, y:640, dim:true})` |
| Title card | `O.title(tIn, tOut, {lines:["Napoleon's","Last","Masterpiece"], sub, y})` |
| 3D number | `O.number(tIn, tOut, {value:200000, side?:"fr", world or x,y, size:112, suffix?})` |
| Distance ruler | `O.distance(tIn, tOut, {from, to, value:70, unit:"MILES", sub, stripes?})` |
| Ledger + stamps (Borodino, [vidIQ AI]) | `O.ledger.show(t,{title,sub})`, `.add(t,{who, note?, stamp:"REFUSED", stampAt?})`, `.note(t, i, text)`, `.final(t,{lines:["The Guard","saved"]})`, `.hide(t)` |
| Grade | `O.film.grade(t, "day"/"dusk"/"night"/"candle"/"none", d, {at:[x,y]})`; `O.film.dim(tIn, tOut)`; `O.film.set({grain, paper, vignette})` |
Sides: `fr`, `ru`, `uk`, `pr`, `au` (flag stripes + portrait ring colours); `stripes:[...]` overrides.

## Render the demo
HyperFrames renders `index.html`, so copy the folder to a scratch build dir with `demo.html` as `index.html`, then `npx hyperframes render -o demo.mp4 .` (purge `/root/.cache/hyperframes/history` after).

## Measuring more frames
`python3 tools/gm_frames.py sample VIDEO OUT --every 2 --chapters 0:00,0:45,...` · `crops FRAMES OUT` · `color IMG x0,y0,x1,y1 --px` · `zoom OUT.png 3 IMG:x0,y0,x1,y1` · `sheet FRAMES OUT.jpg`. Never commit the reference video or its frames.

Demo copy (quotes, numbers) and the placeholder painting are for layout only; check every line against sources before use.
