# Critic: Yorktown kit r3 + hooks (round 3)

**VERDICT: NO** (very close. The kit is ready apart from one leftover. The hooks follow 1a/1c: stakes end on "Yorktown" at ~10.5 s, the promise "a safe harbor became a trap" is spoken at ~13-15 s, one continuous zoom from 5 to 10 s with no cut or flash, the date lands in the first second, one card at a time, name slam at 51 s, three snap cuts, then the title card. What blocks it is two wrong-side flags in the siege that a history viewer will catch. These are fixes only, not a rebuild.)

## Kit: r2 list, item by item
1. Hudson collision: fixed. 2. Inset strip: fixed (the box is clear of the name, names inside the frame and readable). 3. Storm framing: fixed (the narrows, Gloucester, landings, 4 flatboats). 4. Redoubts after 14 Oct: fixed (allied blue). 5. Lone flags: fixed (each flag stands by its wing box: French west, US east). 7. XX boxes on the trenches: fixed.
6. **Still open (kit-a-r3):** the artillery + wagon boxes (~975-1060, 335-400) still cover the east half of the painted Philadelphia town. "New York" still arcs along Long Island (acceptable). Fix: move both boxes about 60 px NE, off the town.

## Defects
1. **sheet-hook-a, 12.5-21.4 s (hook-2), history:** the US flag (`SIDEFLAG("us","al1")`) stands on the WEST wing, upstream of the town. That was the French sector; the Americans held the right, down toward the river below the town (Redoubt 10 side). Fix: attach the US flag to the east-wing box (the one near ~740,460 in the 15 s tile). Kit-b already has this right.
2. **sheet-hook-b, 59.9-62.5 s (night-attack cut), history:** the US flag (`as9`) sits on the inland redoubt, Redoubt 9, which the French took. Hamilton's Americans took Redoubt 10, on the river bluff. Fix: move the US flag to the R10 box. Optionally add the French flag at R9 (MAP_BRIEF allows it for the French wing).
3. **sheet-kit-r3, kit-b "dusk 14 Oct":** Redoubt 10 already shows allied hatching and both redoubts are blue at dusk. The assault came after dark that night. Fix: label the frame "night 14 Oct", or keep the redoubts red until the assault beat.
4. **sheet-hook-a, 0.5-5.0 s (minor, 1a beat):** after the date lands at 0.4 s, nothing new happens until UNPAID at ~5 s, and the 0.5 and 2.5 tiles are identical. Fix: make the blue columns visibly march from 0.5 s, or add a soft focus pulse on "broke" (~2.5 s). Do not add a stamp: there is no stamp text for "broke".
5. **sheet-hook-b, 63.9-66.1 s (minor):** under the title card the date scroll steps back from "14 OCT 1781" to "1781", which repeats the "1781" in the title. Fix: keep "14 OCT 1781", or leave the scroll as it is.
6. **script.md hook-3 tag (housekeeping):** the tag says "four hundred and fifty miles", but the spoken text and the code cue are "four hundred miles". Fix the tag text so the next `B.at` re-grep stays clean. The code already matches the speech.

## Passes
Clean frame 0 (map + units only). Date scroll on "seventeen eighty-one". Stamps (UNPAID, MUTINY, SURRENDERED, SIX YEARS) and the 8,000 card are each on their word and gone within 3.5 s. Blue taker-colour hatching follows 2d 3b FORM 1 and MAP_BRIEF. The "?" banner reveals Washington. The battle-at-sea cut is dated 5 SEP and shows the French flag. Flags: US 13-star, French white with gold lilies, British 1606. The look matches the living-map reference. The facts in the hook check out: about 8,000 surrendered, six years away from home, unloaded muskets, he never saw the sea battle.
