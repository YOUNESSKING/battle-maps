# Style W (Warhawk ink look, one green): what to ADD or DO on the maps, clean-screen first
Looked at: r11_t2/t43/t55 (full size), r12_sheet + r12_t41, w8_close_story_s33, ref_wide_frame, ref_close_frame, ref_A_flat_illustrated,
CRITIC_NOTES, VIDIQ_MAP_NOTES, styleW/index.html (lines 370-520), make_style_w.py, timing.js. Screen px are at 1920x1080; close-ups run at camera s ~3.0-3.7.

## Observed problems found while looking (fix regardless of the ideas)
- r11_t55: the north arrow (1828,180) sits INSIDE the Cleburne badge portrait ring. North arrow must step out while a top-right badge is up.
- r11_t43: the WRONG HILL stamp covers the Corse arrow and half of the "J. E. SMITH" label.
- Off-style UI on an ink map: coloured pill labels (boxS "THE RAVINE" pink, "TUNNEL HILL" pale blue, "RAILROAD TUNNEL" yellow), blue/red/yellow glowPaths, yellow K.target rings. The reference never uses pills or glows on the map.
- Permanent furniture: legend box top-centre, "Terrain: Mapzen" credit bottom-right, scale bar, both nation flags floating in empty ground. Five always-on items before any story element appears.

## Ideas, ranked by viewer value per unit of clutter
### 1. Retire the furniture (negative clutter; do first)
- Legend box: up for the first ~8 s of the first map of the video and again only when a new symbol type appears; otherwise gone (the unit colours + flags teach it).
- Terrain credit: move into the end-screen / description; never on the map.
- Scale bar: only on the first frame of each new zoom level for 3.5 s (same rule as captions).
- Nation flags: pin each flag to its side's REAR ground (Union behind Sherman's divisions north of the creek; Confederate behind the ridge, east) at 48x30 px with a thin sepia staff, so they say "this side is theirs" instead of floating. One pair per shot, never re-placed mid-shot.
- Build: scene JS only (legend()/LV.scaleBar/flagS timings).

### 2. Focus wash ("spotlight") instead of rings, glows and pills
- What: everything outside a soft ellipse around the ground being talked about darkens to ~72 % brightness with a slight desaturation (multiply rgb(205,200,180)), feather ~120 screen px. The named ground stays full colour.
- When: "a deep ravine" -> ellipse on SADDLE (about 260x130 screen px); "the real Tunnel Hill" -> moves to TH (300 px); "near the mouth of the railroad tunnel" -> tunnel; "the open fields do the rest" -> FIELD; "charged along the narrow spine" (P3) -> long thin ellipse along RIDGE[0..4]; "stopped at the railroad embankment" -> RR_W. In 0.6 s, glides (0.8 s, sine) between targets, out 0.8 s on the next sentence that is not about ground (e.g. "Cleburne saw something" -> out).
- Why: the viewer's eye goes to the place before the label is read; works at feed size; replaces K.target (3 uses), glowPath on SADDLE/RIDGE/RR (8 uses) and the red FIELD polygon fill.
- Clutter: low and it REMOVES colour overlays. While up: corner badge and caption may stay (they sit in the dark zone, which helps them read); stamps not at the same time.
- Build: one screen-space div above the map, below units: `background: radial-gradient(ellipse W H at X Y, transparent 55%, rgba(40,36,20,.30) 100%)`, X/Y recomputed from world coords in the camera apply() so it tracks pans. Helper `focus(pts|[x,y], t, until, {w,h})`.

### 3. Re-ink the story ground when it is named (no new colours)
- What: the generator already draws hill hachures, ravine strokes, field furrows, rail + portals in story_draw(). Export each feature ALSO as its own transparent ink layer (darker sepia (38,32,14), stroke +30 %). On the word, that layer fades 0 -> 1 in 0.4 s (feels like the engraver pressed harder), holds ~3 s, settles to 0.25.
- When: "he seized a hill" -> Billy Goat Hill hachures; "a deep ravine" -> ravine strokes; "the real Tunnel Hill" / "the highest point on my line" -> Tunnel Hill hachures; "railroad tunnel" -> portals + dashed hidden line; "open fields" -> furrows; P3 "narrow spine" -> ridge crest.
- Why: teaches the viewer to read the drawn terrain itself, so later shots need no label. Pairs with idea 2 (focus says WHERE, re-ink says WHAT).
- Clutter: zero added hues; replaces the glowPaths.
- Build: make_style_w.py story_draw(d,...) -> call per feature onto separate RGBA canvases (`{base}_ink_hill.png`, `_ink_ravine`, `_ink_rail`, `_ink_field`, `_ink_ridge`), same size/registration as the close image; scene `lay()` them.

### 4. Map-native place labels (reference style) instead of pills
- What: white Georgia/serif with soft dark shadow, no box: 26 px for hills, 22 px for features, italic + letter-spaced 0.08em and set ON A CURVE (SVG textPath) for linear features: "Missionary Ridge" along RIDGE, "Tennessee River" along the river, "the ravine" along SADDLE. Writes on left-to-right in 0.5 s (clip-path wipe), out 0.4 s.
- When/leave: on the narrated word, off ~3.5 s later (rule). Exceptions that become PERMANENT small (18 px, 80 % opacity) once named: Tunnel Hill and Billy Goat Hill (the two points every later sentence refers to), like the reference's permanent towns.
- Why: matches the reference look, and a label on the curve of the feature tells the viewer the shape of the ground (the spine runs THIS way).
- Clutter: smaller and quieter than pills. Max 2 transient labels at once.
- Build: scene JS helper `ink label(text, pts|xy, t, until, {curve,size,perm})`; delete boxS map uses.

### 5. Brigade "a few at a time" shown as dot lines (the reference's skirmisher rings)
- What: in P3 each attacking brigade is drawn as a short line of 6-8 small rings (11 px, 2 px side-colour stroke, light fill, reference ref_close_frame) moving up the slope, the NATO box hidden while the dots move. Hit: rings drop out one by one (opacity to 0, 60 ms apart) under fire; survivors drift back.
- When: "John Corse's brigade" -> line on the spine; "torn apart" -> 4 of 7 rings vanish; "John Loomis ... open fields on the west" -> second line; "stopped at the railroad embankment" -> line halts on RR_W; "Colonel Matthies ... shredded" -> third. Each line gone 2 s after it breaks.
- Why: makes "one brigade at a time" and "torn apart" visible as numbers of men, which a box cannot; strongest retention moment of the move.
- Clutter: only one line on screen at a time (that is the point of the story).
- Build: scene JS (`dotLine(side, pts, t, n)`), reuse pinAlong for movement.

### 6. Fallen marks that stay where each attack broke
- What: 4-6 tiny sepia crosses/strokes (8 px, 1.5 px, (50,44,20) at 55 %) left at the place each brigade broke (spine below the crest, embankment, flat ground), plus a small serif date-time tag only for the first ("8 AM"). They stay until the end of the move.
- When: appear 0.4 s after "torn apart", "stopped at the railroad embankment", "shredded"; at "Sherman had sixteen thousand men on that field" the camera pulls out (it already does, s 2.0) and the three marked spots read as three failures in a row.
- Why: memory aid; the viewer sees the pattern Cleburne exploited without a card.
- Clutter: tiny, map-coloured ink, no text.
- Build: scene JS, SVG in world layer.

### 7. Powder smoke and muzzle flash, reference-style
- What: reference close frame uses dark ink-blot smoke clouds (~70-90 px) and small orange muzzle flashes at the firing line. Add: along the Confederate crest, 3-5 flashes (14 px orange (255,170,60) + 0.15 s) and grey-sepia smoke blots (rgba(60,55,40,.45)) that drift slowly EAST (one wind direction for the whole battle) and thin out over 4 s.
- When: "his infantry along the crest" (one flash per brigade as it appears), every "fired from the crest" / "torn apart" / "shredded"; smoke is heaviest at "Each time, Cleburne's men fired from the crest". Stops completely at "By about four o'clock" (exhausted, quiet) so the silence is visible before "Cleburne chose that moment".
- Why: shows where the fire comes from (the crest) without arrows; fits the sound lock (gun sound only where the flash is visible = STYLE_LOCK 1c "artillery shots only where visible").
- Clutter: low if capped at ~5 blots on screen; smoke must not cover unit labels (spawn 20 px downwind of the unit).
- Build: scene JS; K.smoke exists, set colour/drift; flash = small radial div.

### 8. Time-of-day grade on the map only (zero objects)
- What: CSS filter on the map layers (not on cards/units): 8 AM cool (brightness .97, hue +4, saturation .92), noon neutral, 2 PM neutral, 4 PM warm low sun (sepia .12, brightness .95) plus the hill hachure shadow side slightly heavier; night = existing nightWash. Transitions 2 s, timed to the date-scroll changes already in the code (T_EIGHT, T_TWO, T_FOUR, T_NIGHT).
- Why: the day passing becomes felt; supports "By about four o'clock, the Union soldiers were exhausted" with no text. The date scroll already carries the clock, so the two agree.
- Clutter: none.
- Build: scene JS, tl.to(mapLayer, {filter}) next to B.date calls.

### 9. Zoom box: show where the next close-up is BEFORE diving in
- What: on the wide map a thin sepia rectangle (2 px, (50,44,20), corner ticks 14 px) draws itself around the battle ground in 0.5 s; the camera then flies into it and the rectangle grows off-screen with the zoom.
- When: just before the first close dive at "Cleburne arrived on the twenty-fourth" (camera s 1.3 -> 1.9) and again on the return to wide at "While Cleburne held the hill" (rectangle appears around the hill on the way OUT, so the viewer sees where they were, plus Thomas "two miles to the south").
- Why: orientation in 1 s; no permanent mini-map.
- Clutter: ~1.5 s, one thin line.
- Build: scene JS, SVG rect in world coords; fades when its screen size > 1.3 x screen.

### 10. Wide -> close look transition as a lens, not a global cross-fade
- What: the close (mossy, canopy) look resolves first at the focus point and spreads outward: a radial mask whose radius = f(camera s) (0 at s 1.4, full screen at s 2.4), feather 250 px.
- When: every dive (T_ARR, T_BELIEVED) and reverse on pull-outs (T_16, T_WHILE).
- Why: the eye is pulled to the battle ground; the change of art style reads as "we are zooming into detail" instead of a colour shift.
- Clutter: none.
- Build: camera apply(): set `mask-image: radial-gradient(circle R at X Y, #000 60%, transparent 100%)` on the close-look image instead of opacity.

### 11. Elevation profile slip for "steep slope / ravine" (one use per move)
- What: a 480x120 px paper slip (same parchment as the date scroll), bottom-left, ink side-view line: Billy Goat Hill - ravine dip - Tunnel Hill, tiny triangle "Tunnel Hill" peak, tiny red arrow climbing. Profile drawn L->R in 0.8 s.
- When: in on "a deep ravine lay between it and the real Tunnel Hill", out at "Cleburne saw something" (~4 s). Optional second use on "climb a steep slope" (P2b).
- Why: the top-down map cannot show height; the story is about height. Highest value of all for understanding, but costs a box, so it is ranked here.
- Clutter: medium. While up: caption and corner badge step out, scale bar hidden.
- Build: scene JS SVG (hand-written polyline from a DEM transect, or from tunnel_story.json hills/ravine heights); keep to one line weight 2.5 px sepia.

### 12. Commander portrait pins at the unit (reference does this)
- What: reference shows a small sepia photo card (60x78 px) with the side flag on top, on a short stake AT the commander's position. Use for the hero and the main opponent only: Cleburne's card on Tunnel Hill, Sherman's at the north bank.
- When: at the name in narration ("Cleburne arrived", "to face William Sherman"), stays ~4 s, then shrinks into the unit counter.
- Why: ties face to place; the corner badge does not show WHERE the man is.
- Clutter: it REPLACES the corner badge for that beat (do not show both); never more than one pin at once.
- Build: scene JS; variant of badge() rendered in world coords.

### 13. Ink march trails instead of arrow + moving unit
- What: a moving unit leaves a thin dashed sepia-side trail (3 px, dash 8/6, side colour at 70 %) that fades 2 s after arrival. Planned moves stay as the existing dashed arrow; actual moves become trails.
- When: Sherman's night crossing ("in the dark"), Cleburne's train ride ("racing back"), Hardee's reinforcements (P4 "sent Cleburne reinforcements").
- Why: today both a fat arrow AND the unit move do the same job; one thin trail shows the same path with half the ink.
- Clutter: lower than now.
- Build: scene JS, path grows with pinAlong progress.

### 14. Front line in ink (test only, needs owner OK because option 2 glowing fronts are locked)
- What: crisp 2-px double line (blue on the Confederate side, red on the Union side, 3 px apart), no blur, ends clipped to the ground (no running across the river as in r11_t43/t55).
- Why: the blurred glow is the one element that still looks like the old Frontlines style on the ink map.
- Build: frontS() option `ink:true`.

## 5 things NOT to add
1. Contour lines or shaded relief everywhere: the reference has neither; it would fight the hachures and the "clean map" rule. Height goes in idea 3 and 11 only where the story needs it.
2. A full road network / every creek name: there is no road in this story; generic roads become noise. Draw only roads a sentence mentions.
3. A permanent mini-map or locator inset in a corner: a fixed box all scene long; idea 9 does the job in 1.5 s.
4. Labels on every brigade at once (4 Confederate + 4 Union + 3 divisions = 11 name tags): name a unit only while the narrator names it; others keep the bare symbol or the dot line.
5. Decorative cartography (compass rose, cartouche, grid/lat-long, paper edge frame, animated swaying trees, birds, heavier clouds): style without information; the reference is plain, and the existing clouds (0.16) should stay that faint or go.
(also: distance dimension arrows like "800 YARDS" and casualty counters ticking on the map during the fight; numbers belong on the result card.)
