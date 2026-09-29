# Smith remake: script changes + scene plan (locked style, items 1-5 of NEXT_SESSION.md)

Rules: `STYLE_LOCK.md` exactly. `const K = FXK(B)` in every scene (smith/lib/fx.js). Blue = US/UN (`carth`), red = KPA/Chinese (`rome`).
Every visual beat has its SFX (K.impact / K.gun / K.aircraft / K.badge / K.casualties do it automatically; add
`SFX("whoosh"|"hit"|"tick"|"static", t)` for camera dives, stamps, counters, radio). Agents write scenes + snapshot sheets only; no renders
until the owner approves ONE labelled sheet per move.

## A. Script changes (apply only after the AUDIO-LOCKED-DONE commit; then `git pull`, edit, `narrate_changed.py`)

**hook-1 (new, stakes first):**
> Fifteen thousand Marines. A hundred and twenty thousand Chinese. Thirty degrees below zero. On the night of November twenty-seventh, nineteen fifty, bugles sounded from every ridge around the Chosin Reservoir, and an army that American intelligence swore was not there came pouring down the slopes.

**hook-2 (new, with the flash-forward inside the first ~45 s):**
> The First Marine Division was strung out along one narrow mountain road, seventy-eight miles from the sea. Within hours, that road was cut in a dozen places. In Tokyo, commanders braced for the destruction of the most famous division in the Marine Corps. Two weeks later, that division came down out of the mountains, not as a fleeing mob, but as a fighting column, carrying its wounded, its guns and its dead. And the Chinese army group that had trapped it would be out of the war until spring.

**hook-3:** unchanged (bio card).

**hook archive paragraph (shortened, flash-forward moved into hook-2):**
> So how did one soft-spoken general turn a death trap into one of the greatest fighting withdrawals in history? Let's take a closer look at O.P. Smith's three greatest tactical moves.

**inchon-9 (subscribe ask moved here, between Move 1 and Move 2):**
> MacArthur had the vision. But it was Smith's planning that got the Marines over the seawall. And already, you can see the shape of his method. Build the lifeline first. Refuse to be rushed. And keep the division whole. At Inchon, he had used the tide itself as a schedule. If you're enjoying this breakdown, consider subscribing. Because in the mountains of the north, Smith was about to face a far deadlier enemy, and this time, his own commander would be pushing him into the trap.

**hagaru-9 (subscribe ask removed):**
> Build the lifeline first. Refuse to be rushed. Keep the division whole. At Hagaru-ri, the first two rules had saved his men. The Chinese had failed to break the Marines apart. But they still held the mountains, and the road to the sea was seventy miles long. The hardest part of Smith's campaign was still ahead: getting out.

Re-voice: `cp goosegreen/tools/narrate_changed.py smith/tools/`, make `smith/audio/voice.wav` from voice.mp3 if the .wav is missing
(`ffmpeg -i voice.mp3 -ar 24000 -ac 1 voice.wav`), run from `/home/user/battle-maps/tts`. 5 paragraphs re-voiced; everything after the hook
shifts, so scenes must keep using `B.at("para-id", "phrase")` (no absolute times) and `assemble_full.py` hook dissolve times must be
re-read from timing.json. Then `make_music_bed.py` again (length changes).

## B. Shared building blocks (write once, copy into every scene)
- `K.grid(G, ...)` 0.5° step on korea, 0.1° on chosin/inchon, 0.05° on chosin_close/funchilin.
- Masks: `assets/<basemap>_land.png` (built by `tools/make_land.py`, reservoir cut out).
- Counters `K.counter(id, { icon, flag, size })`: 1st Marine Div `XX`, regiments (1st/5th/7th Marines, 11th Marines arty) `III`, battalions `II`;
  flags `us` / `kpa` / `prc`. Chinese divisions `XX`, armies `XXX`, 9th Army Group `XXXX`. Artillery = howitzer silhouette, tanks = tank silhouette.
- Badges `K.badge`: Smith (`assets/media/smith_head.png`, flag us), Almond (almond.jpg, us), MacArthur (initials MAC unless a PD crop exists),
  Song Shilun (song_shilun.jpg, prc), Ridgway (ridgway_head.png, us). Slide in when introduced.
- Ships: side silhouettes (copy `G.ship` from goosegreen/scenes-src/hook-atlantic.js) + `K.gun` at the bow + `K.impact` on the target.
- Aircraft: Corsair = `kind: "prop"` (new art in smith fx.js), C-47 = `turboprop` art, C-119 = `cargo` (new twin-boom art). Bombing run
  = exact Harrier recipe: size 84, alt 30, dur 3.2, bombs `K.impact(x, y, t0 + 1.55 + k * 0.25, { r: 20, shake: k === 0 ? 5 : false })`.
- Casualty card `K.casualties({ headA: "U.S. MARINES", headB: "NORTH KOREAN" | "CHINESE", flagA: "us", flagB: "kpa" | "prc", rows })`.
- Night: `K.night({ lines: [...fronts], tOn, tOff })` + the goosegreen move1.js night overlay.

## C. Scenes (same files/tags as MAPS_BRIEF.md; one Opus agent per move)

### Hook (hook-in / hook / hook-out) — keep peninsula zoom-in / zoom-out
- **hook-in (korea):** peninsula, red North + China territory (frontTint along the Nov-1950 front, night palette), blue south; units on screen at frame 1;
  **odds card 15,000 VS 120,000** slams in on "Fifteen thousand Marines. A hundred and twenty thousand Chinese" (hit + tick counters),
  "-30°F" stamp on "Thirty degrees below zero"; camera dive (whoosh) into Chosin.
- **hook (chosin):** night palette; blue Marine counters along the MSR (Yudam-ni, Hagaru-ri, Koto-ri), red Chinese divisions pour down (arrows, bugle = no new sound, use existing kinds only);
  fronts form around three pockets (two-colour where they touch); "ENCIRCLED" stamp; road cut markers ×12 with hits.
  **Flash-forward** on "Two weeks later": white flash (whoosh), column counters slide down the road to Hungnam, counter "78 MILES" ticking, Chinese counters turn grey;
  stamp "OUT OF THE WAR UNTIL SPRING".
- **hook-out (korea):** zoom back out, Smith badge + bio card (hook-3) as now.

### Move 1 — Inchon
- **inchon-a (korea):** Pusan perimeter as a two-colour front (blue inside / red outside, day palette) + territory (blue SE corner, red rest); KPA counters `kpa`; title card.
  inchon-2: sea arrow Japan → Inchon, red supply lines through Seoul.
- **inchon-b (inchon):** inchon-3 tide gauge + mud (keep); inchon-4 small red garrison, thought bubble; inchon-5 **Smith badge**, counters 1st/5th Marines (III), ships.
  **inchon-6 "The Navy and Marine aircraft had pounded it for days":** 2 destroyer + 1 cruiser silhouettes firing (K.gun) with K.impacts on Wolmi-do,
  then **2 Corsair bombing runs** (Harrier recipe) + smoke columns on Wolmi-do; target ring; 3/5 Marines (II) assault arrow, garrison greys out; clock 06:33.
  inchon-7: Red Beach / Blue Beach arrows at 17:30, naval gunfire + one Corsair run on the city front, smoke on burning Inchon.
- **inchon-c (inchon):** inchon-8 night → dawn: two-colour beachhead front drawn on and pushed inland (`to` + moveT), blue territory grows (frontTint `to`),
  red lost ground `K.lose`; then Seoul arrows. **Casualty card** (landing day): Marines ~20 killed / ~175 wounded (one column only if no sourced KPA landing-day figure). inchon-9 method card (keep) + subscribe ask.

### Move 2 — Hagaru-ri
- **hagaru-a (korea):** UN arrows north, X Corps by sea to Wonsan/Hungnam; blue front line moving north (`to`) with territory; title card.
- **hagaru-b (chosin):** MSR drawn, ONE ROAD · 78 MILES; Almond badge.
- **hagaru-c (chosin_close):** hagaru-3 Chinese counters fade in (`prc`, XX) + **Song Shilun badge**; Almond thought bubble.
  hagaru-4 **Smith badge**, counters inch forward, supply dumps. hagaru-5 airstrip + perimeter as a one-colour blue line (not yet in contact), bulldozers.
  hagaru-6/7 **night palette**: fronts become two-colour where the Chinese attack; Hagaru-ri perimeter; **Chinese mortars** (K.gun + impacts) on the perimeter,
  **Marine howitzers** (11th Marines, artillery counters) firing with impacts on the attackers; East Hill contested (front moves back and forth); dumps burning = smoke.
  hagaru-8: **C-47s land** on the airstrip (turboprop art, landing shadow), loop out south; counter 4,300+ WOUNDED EVACUATED (ticks); para-drops.
- **hagaru-d (chosin_close):** method card over the held perimeter (subscribe removed from narration; card unchanged).
  **Casualty card** after Move 2? Losses are counted once for the whole Chosin campaign at the end of Move 3 (script gives no Hagaru-only numbers).

### Move 3 — The breakout
- **breakout-a (chosin):** Yudam-ni/Hagaru-ri/Koto-ri pockets as fronts, red divisions on every ridge; title card; Chinese thought bubble.
- **breakout-b (chosin_close):** the **moving column** with a moving two-colour front on each flank (`to` + moveT), infantry arrows up the ridges,
  **fighter-bomber runs** (Corsairs, Harrier recipe) on the ridges on "fighter-bombers struck anything that moved", smoke on hit ridges.
- **breakout-c (funchilin):** bridge blown (explosion + smoke), ~29 FT gap; **C-119s drop 8 spans** (cargo art, parachutes, one drifts into Chinese lines);
  Hill 1081 seized in the snowstorm (target ring, front moves off the height); bridge closes (DEC 9).
- **breakout-d (chosin):** column reaches Hungnam, ships offshore, Chinese counters grey; **Casualty card (Chosin)**: Marines ~1,000 killed / thousands wounded + frostbite
  vs Chinese "TENS OF THOUSANDS" (killed, wounded, frozen; the script gives no exact figure, so the card says it in words); method card.

### Ending
- **ending-1 (korea):** Hungnam → Pusan by sea, early-1951 front (two-colour, day) + territory, **Ridgway badge**.
- **ending-2 (chosin):** final road lit blue, method lines, title.

## D. Snapshot sheets for the owner (one per move, labelled)
`hyperframes snapshot . --at ...` per scene, then one contact sheet per move (hook, Move 1, Move 2, Move 3 + ending), each frame labelled
(scene, time, what the owner should check: aircraft bombing, ships firing, fronts, night, counters, badges, casualty card). Send, wait for approval.

## E. Sound (owner rule 2026-09-29, HANDOVER 1b "Sound library scope")
- Library only where it matches the picture: impacts/explosions (incl. naval shells landing), land guns + mortars, aircraft flybys, MG,
  whoosh/hit/tick/static on camera dives, stamps, cards, counters. Ship guns use `sfx: false` on K.gun.
- Everything else gets its own kind, cued in the scenes now: `naval_gun`, `bugle`, `blizzard`, `truck`, `parachute`, `bulldozer`, `ship`.
  Sounds: sourced CC0/PD/CC BY into `assets/media/sfx/new/<kind>_<n>.wav` (2-3 variants each, credits in `new/CREDITS_NEW.md`).
- No identical repeats: `tools/sfx_mix_lib.py` can vary pitch per cue and avoid back-to-back repeats (`vary`).
- Gate: new kinds and `vary` are mixed ONLY when listed in `assets/media/sfx/new/APPROVED.txt` (one word per line). Until then the mix
  is exactly the locked one. Owner test: `build/sound_test_new.mp3` (the sounds on their own) + a 1-min in-context clip
  (`SFX_TEST=1 python3 tools/make_clip.py ...`, after the scenes are approved), then write APPROVED.txt.
