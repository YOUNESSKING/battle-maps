# THUMB CRITIC 1 (harsh) - Washington "HE SNUCK OUT."
Scores vs published refs (Grant Back Door = 10): A 5/10, B 6.5/10.

## A (Back Door recipe)
- Blocks (red 205-520 x 262-345; blue 630-815 x 410-520) sit ON the river and ice; red blocks float mid-water under TRENTON tag. Reference puts blocks on land/roads. Biggest cheat tell.
- Geography wrong: Trenton tag is top-left on the PA-side-looking west bank; arrow goes up-left, Trenton is DOWNSTREAM (SE) on the NJ shore. Crossing should read west->east (PA -> NJ); arrow runs right->left. Reads backwards for anyone who knows.
- Arrow is thin, short, cream on pale ice: low contrast (ref arrow is huge, long S-sweep, ~90px wide). Arrow head points at water, not at a target.
- Background is a calm empty river scenic: no fire/smoke/boats/roads; flat vs. busy ref. No boats (Durham boats) = no "crossing" story.
- Portrait: face pushed right, edge fade at x~1000-1080 is a visible soft dark vignette ramp (halo/gradient seam), sepia flat; neck/shoulder lower-left cut at x~760-930 looks pasted over band. Face only ~38% height: OK.
- Word band: good, matches ref; but "HE SNUCK OUT." right end touches portrait shoulder (x~840). Band torn edge OK.
- Tags: MCCONKEY'S FERRY tag sits on water over the blue blocks' top; small at feed size (illegible at 168px). TRENTON tag in sky-ish bank OK.
- Feed strip: word readable, tags/blocks illegible; arrow weak.

## B (Grand Maneuver recipe)
- Strong: word huge, portrait big, clean matte. Cinzel line small (~30px) - fades at feed size.
- Navy is flat; river hairline barely visible, no other map content; Nassau Hall painted frame reads as sticker box (gold-bordered rectangle floating) - the ref uses an iconic object, not a framed photo.
- Princeton building drawn in the lower right but Princeton is NE of Trenton: arrow goes right/up-right ok. But the river line crosses behind the seal, meaningless.
- Seal+arrow tiny (arrow ~60px) relative to dead space between portrait and seal. Trenton label under seal ok.
- Halo: faint cream/gold rim around portrait is a bit glowy; left edge crop of coat OK.

## Top fixes for make_thumbs_washington.py
1. A: move blocks onto land: red column along the NJ (east/south) bank road near Trenton, blue on PA bank at the ferry; shift to the shore pixels, not x205-520,y262-345 over water. Add 1px dark shadow offset (3,4).
2. A: fix geography: put the TRENTON tag lower/right-of-arrow-end on the east bank, arrow from PA (west, x~120,y~560) sweeping east to the NJ shore; widen arrow to 80-90px, add S-curve, bright off-white plus 6px dark outer shadow.
3. A: darken/saturate bg 15% and add smoke/vignette or Durham boats (painted) mid-river so it is not an empty scenic; raise contrast of arrow.
4. A: portrait: end the left fade earlier with a hard 2px matte, scale face to ~1/3 height, remove the dark gradient; shift 40px right so the word clears the shoulder.
5. B: enlarge seal-arrow-icon (arrow 110px, thicker), drop the gold frame to a soft-masked vignette, bump Cinzel line to 42px, add visible river hairline contrast (alpha +40%).
6. Both: tag font >= 44px; check 168x94 legibility.
