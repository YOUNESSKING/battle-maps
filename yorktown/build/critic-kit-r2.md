# Critic: Yorktown kit (round 2)

**VERDICT: NO** (close: the look now matches the living-map reference, and 7 of the 10 round-1 items are fixed. Three label/framing defects remain that the owner would see in these exact frames. Round 3 should only need fixes, not a rebuild.)

Round 1 status: 1 mostly fixed (towns and ruts are better, but the Philadelphia town is still small); 2 fixed; 3 partly fixed (a flatboat is visible in kit-b, but the storm frame has no crossing); 4 fixed (works and units stay on, dimmed by the night); 5 fixed in kit-b, still open in the inset; 6 fixed (date shows, no stray letters or bands); 7 fixed (ship at the bay mouth, Yorktown label not cropped); 8 mostly fixed (two parallels, guns in the batteries); 9 and 10 fixed (red British cloth, gold-lily pennant, Cornwallis off the edge).

## Remaining defects
1. **kit-a, Hudson name collision (new):** the carved "Hudson" (~1145,60-150) is hidden behind Clinton's red XX box and banner and reads "dson". Fix: run `NUDGE` on the Clinton box and banner, or carve the name further up the river. Add the `LABEL_AUDIT` check to the kit-a test.
2. **Inset strip frame 3 (peninsula, 6 s):** the red box touches the "Yorktown" name (2e item 2, >= 20 px). The Williamsburg and Yorktown names are too small to read at 1080p. Frame 2 has the names cut off at the bottom edge. Fix: `NUDGE` the box east into the river mouth, scale the inset names up about 1.5x, and keep them inside the frame.
3. **kit-storm (night 16 Oct):** the framing is the same as kit-b, so Gloucester Point and the ferry are off screen. The storm night is the failed escape across the York. Fix: frame the narrows (Yorktown to Gloucester Point), and show the landings and 2-3 flatboats on the water in the storm.
4. **kit-storm, Redoubts 9/10:** they are still grey/neutral two days after they were taken. Fix: give them allied colour, or keep the red hatching from kit-b, from 14 Oct onward.
5. **kit-b and storm, lone flags:** the French pennant (~870,700 / 575,962) and the US flag (~1340,1060) stand alone on the grass and read like stray stickers. The French pennant is tiny. Fix: put the flags on the French (west) and American (east) wing boxes, or drop them until the narration names the wing.
6. **kit-a, minor:** the "New York" name sits mid-Long Island, far from the city. Arc it at the Manhattan tip. The artillery box (~990,390) almost covers the small Philadelphia town; move the box 30 px NE.
7. **kit-b, minor:** the infantry XX boxes still sit 100-200 px behind the second parallel. Move them up to the trenches for the 14 Oct assault frames.

Passes: painted towns at Yorktown, carved arced names, blue carved rivers, woods, texture, gold banners, date scroll, night dim and rain, and the hard inset edges. No camps, farms, blocks, dashed arrows or trees on the water.
