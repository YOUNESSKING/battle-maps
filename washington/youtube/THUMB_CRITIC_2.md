# THUMB CRITIC 2 (harsh, sidebar view) - Washington "HE SNUCK OUT."
Scores (after critic-1 fixes): **A 6/10, B 7.5/10.**
Sheet: `washington/youtube/thumbs_vs_competitors.jpg` (copies in /tmp/wx_comp/). Compared: Warfare Genius (estK7vTXo24, "NO WAY OUT", 11k views, the direct rival), Minds of Warfare (-BySQC-Lt2E, "THE PERFECT LIE"), Warfront Archives (26l6zxjA3uY, "10 DAYS TO SAVE AMERICA"), HISTORY "VICTORY AT TRENTON", PBS "THE BATTLE OF TRENTON", Kings and Generals "TRENTON 1776", JD Brick (Lego), Drunk History.

## Sidebar verdict
- The Trenton/Delaware sidebar is dark, painterly, colour portraits of Washington in a black tricorn + big text. Almost all rivals are saturated and dark; ours (A) is the only sepia/grey-blue one, which makes it different but also LOW CONTRAST/muted next to them.
- **A is NOT visibly different from Warfare Genius.** Same layout: map-ish scene top, red torn band bottom-left with white caps, Washington right. At 168x94 the two read as siblings; viewers who clicked WG's will see A as a duplicate. Our differentiators (white S-arrow, parchment tags, sepia face) are small at feed size; the tags are illegible at 168 px, only the word and the arrow read.
- **B is the more distinct** (navy, bright yellow coat, giant cream word). But face-left + big words-right matches Warfront "10 DAYS" structure; it still stands apart by colour. The Cinzel line and the Trenton/Princeton labels vanish at feed size; only "HE SNUCK OUT." reads (good).
- Neither shows a tricorn/boats/ice crossing icon; viewers searching "crossing the Delaware" expect boats. A's empty river is calm and quiet next to PBS/Warfront action.

## Cheap tells / untrue
- A: portrait's left coat edge is a hard diagonal wedge (x~800-900, y~500-720) that reads as a pasted cut-out over the red band; top-right has a dark vignette box behind the head (x>1000,y<250).
- A: sepia face against a dark right-hand sky = face loses contrast; competitors' faces are bright.
- A geography: PA (west/left) -> NJ (east/right) is correct. BUT the red blocks sit on the NJ bank directly across from the ferry and the TRENTON tag points up-and-across, so Trenton reads as straight across the river. Trenton is ~9 mi DOWNSTREAM (SE) on the NJ bank; the Hessians were not opposite the ferry. Cheap fix below. Princeton NE of Trenton (B: icon right/up-right of Trenton) is correct.
- B: Princeton is drawn as Nassau Hall in a feathered oval; ok, no sticker box now. Blue arrow tiny vs dead space. River hairline still barely visible and runs behind the seal for no reason.
- Text clipping: none found; word clears the shoulder.

## Numbered fixes for `washington/tools/make_thumbs_washington.py`
1. **Make B the lead candidate (or at least equal) and move A away from the WG look:** change A's band colour or position (e.g. band top-left / ivory band with red word, or a crimson-black band lower-right) so it is not the WG red bottom-left band; or accept B as the main and A as the test.
2. A: raise saturation/brightness +20% on the portrait and bg (warm the sepia a touch, keep it sepia but lift the face; remove the dark right vignette) so it holds against the dark, saturated sidebar.
3. A: add 2-3 painted Durham boats with a few figures mid-river on the arrow's path (or ice-crossing action) so it reads "crossing" like the rivals; cut the empty-scenic feel.
4. A: geography: move the TRENTON tag lower on the NJ bank toward the arrow tip (downstream, SE), put the red blocks at the tag, not opposite the ferry; add a thin "9 MI" or leave unlabelled. Feather/mask the coat wedge into the band with a soft shadow.
5. A/B: tags and Cinzel line to >=48 px (bold) so they survive 168 px; B: arrow 140 px thick, drop the river hairline behind the seal or make it a visible bright line east of Trenton, swap the portrait's flat navy for a slight vignette glow to separate it from Warfront's layout.
