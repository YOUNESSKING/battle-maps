# R&R cards study: date card + statement cards (TEST, 2026-11-08)

**Recreated from vidIQ's AI description + R&R's thumbnail** (no frames of the video were captured).

Source: Redcoats & Rebels, "Lee Saw a Chance to Win the War at Gettysburg. Meade Saw It Coming" (https://youtu.be/5REtz7sDS2k, 29 min).

**IMPORTANT: this study is based on vidIQ's AI description of the video (two `vidiq_video_watch` runs, 25 credits each) plus its
transcript (`vidiq_video_transcript`, 5 credits), NOT on frames we captured.** YouTube downloads are blocked here by a bot check and
were not worked around. Fonts, sizes, colours and timings below are vidIQ's estimates ("Cinzel/Trajan style", "~6 % of frame height",
"#C62828") and must be checked by eye by the owner against the real video. The only real image we saw is the video's thumbnail (serif
gold "GETTYSBURG · 1863" kicker with thin gold rules, huge cream serif "OPEN FIELD"), which fits the description.
Credits used: 55 of the 100 budget.

## 1. What R&R puts on screen (vidIQ, with timestamps)

Three families of text graphics, all serif, all on dark:

### A. Centred "chapter" / date / statement cards (the ones the owner likes)
| time | kicker (small, amber) | main line (big, white) | sub-line (italic) |
|---|---|---|---|
| 1:32-1:37 | TWO MONTHS EARLIER | CHANCELLORSVILLE | *Virginia, May 1863* |
| 2:28-2:30 | | JACKSON DIES | *May 10, 1863 • eight days after he was shot* |
| 3:24-3:27 | EVERY ONE OF THEM | BEATEN BY LEE | |
| 4:56-4:59 | DAY ONE | JULY 1, 1863 | |
| 8:36-8:40 | DAY TWO | JULY 2, 1863 | |
| 16:04-16:08 | JULY 3 • THE AFTERNOON | FOUR REASONS | *each one made the others worse* |
| 17:00 / 19:12 / 19:50 / 20:30 | red numeral 1-4 + REASON ONE... | THE BOMBARDMENT MISSES / THE GROUND / THE FUNNEL / THE FLANKS | |
| 4:10-4:33 | red numeral 1-3 + LEE'S FIRST GOAL... | GET THE WAR OUT OF VIRGINIA ... | *Feed the army off Pennsylvania's farms at harvest time* |
| 23:42-23:47 | KNOWN FOREVER AFTER AS | PICKETT'S CHARGE | |
| 27:52-27:56 | ONE WEEK IN JULY 1863 | THE TURNING POINT | *military and psychological* |

Recipe (vidIQ):
- **Background**: the painting/photo stays, darkened by a heavy black radial vignette (~70-90 %, near-black at the edges), slow
  Ken Burns push on the art; a few list cards use a solid dark navy-charcoal card instead (map/art hidden).
- **Layout**: centred stack. Kicker ~2.5 % of frame height, gold/amber (~#E08E45), uppercase serif, very wide tracking. Main line
  ~6-7 % of frame height, bold white uppercase Roman serif (Cinzel/Trajan look), medium tracking. A **thin red rule** (~2 px, ~60 px to
  ~10 % of screen width, ~#C62828) centred under the main line. Optional sub-line ~3 %, *italic* serif (Garamond/Baskerville look),
  cream/off-white, mixed case. Numbered cards add a big red numeral (~10 %) on top.
- **Motion**: ~0.4-0.5 s fade-in with a slight upward drift / micro scale-up, static hold (~2.5-4.5 s; list cards up to 6-8 s with
  lines fading in one by one, ~0.3 s each), then a cut or cross-dissolve to the next shot.
- **Sound**: mostly none of its own (music swell / low drone); vidIQ heard "soft whoosh" on list-line reveals and a "subtle bass
  impact" on the REASON cards.

### B. Quote cards (2:08 Hooker; 25:25-25:59 three Lee "my fault" quotes)
Darkened, desaturated portrait of the speaker behind a vignette; a big **red opening quote mark** top-left; the quote in white
*italic* serif (~4.5 % height), left-aligned in the left-centre of the frame; under it an attribution block with a thin **red vertical
bar**: name in bold white caps serif + an italic citation line ("as remembered by Edward Porter Alexander"). Fades in with the
spoken line, ~4 s, cross-fades to the next variant.

### C. Lower-third identifiers (very frequent: people, places, dates)
Bottom-left dark box (~75 % black), **red vertical bar on the left edge**, bold white caps serif title + cream italic sub-line
("CHANCELLORSVILLE / *May 1863*", "GEORGE G. MEADE / *In command for less than a week*"), 0.3 s fade, ~2.5-3.5 s, fade out.

### Dates
**R&R's date is NOT permanent.** Dates appear only at chapter breaks ("DAY ONE / JULY 1, 1863") or inside a lower third
(*May 1863*) and fade after 2-4 s. vidIQ saw no date or place parked in a screen corner during the map sequences.

### Which spoken lines the cards echo (transcript)
The cards mostly repeat or compress the narrator's words, on or just after them: "That afternoon the trap would close for four
reasons, and each one made the others worse" -> FOUR REASONS / *each one made the others worse*; "known forever after as Pickett's
Charge" -> KNOWN FOREVER AFTER AS / PICKETT'S CHARGE; "Every one of them had walked away with Lee's name attached to his failure" ->
EVERY ONE OF THEM / BEATEN BY LEE (a paraphrase). Some lower thirds add unspoken detail (*Army of Northern Virginia*,
*The Leister farmhouse*) and the 1:32 card says "TWO MONTHS EARLIER" where the narrator says "go back a few months": R&R does NOT
follow our rule 1c.1 strictly. Our version keeps 1c.1: card words are spoken words only.

## 2. Ours vs R&R (what differs)
| | ours (s12d) | R&R |
|---|---|---|
| date | parchment scroll top-left, typewriter font (Special Elite), always on | big centred serif date card at chapter breaks only |
| statement/caption | Oswald (condensed sans) caps, cream on a solid black box with a coloured top bar, bottom/centre band, no dimming | big serif caps, white on the darkened picture itself (no box), amber kicker, thin red rule, italic sub-line |
| quote | Oswald on a black box, blue left bar | italic serif, giant red quote mark, attribution with red bar, portrait behind |
| motion | 0.5 s slide-up 30 px | 0.5 s fade + slow ~2 % push |

## 3. The test build, round 2 (after 3 critics; recreated from vidIQ's AI description + R&R's thumbnail)
Helpers `rr_cards.js`, scene copy `grant/scenes/s12d_rr` (built by `build_rr.py`), `snapshots/`, `compare_sheet.jpg`, `rr_cards_demo.mp4`.
- **Type**: Cinzel 600/700 (OFL, Trajan-style caps) for titles, kickers and the date plate; EB Garamond Italic 400/500 (OFL, real
  italic woff2) for sub-lines and quotes (`fonts/`, licences included). Gold kicker #d4b06a 42 px with hairlines either side and a
  negative right margin equal to its tracking; red only for the 5 px rule and the bars; text lines cream/white; sub-lines 52 px.
- **Date system**: the plate (top-left, 52 px Cinzel, red bar) shows only the YEAR "1863" until a day is spoken; the big "1 MAY 1863"
  card lands on "May first" with a light dim (<= ~40 %), the plate rolls to "1 MAY 1863" as it lands, the card holds ~0.7 s and fades
  in place (no fly, so it cannot miss the plate); the dim is gone before "Port Gibson", whose label lands on its word. The clock then
  rolls the plate (12, 14, 16, 17 MAY) and it KEEPS "17 MAY 1863" (never steps back).
- **Map vs cards**: lighter dim (centre ~48 %, edges ~72 %) + a feathered dark plate (~66 %) right behind the text; every map pin
  (units, flags, portrait cards, labels) that sits under a card's text fades out while the card is up (`RR.guard`, run on every camera
  update + every frame).
- **Fewer full cards**: Sherman quote (~3 s), the 1 MAY date card (light), ONE merged numbers card. "A BATTLE EVERY / THREE OR FOUR
  DAYS" is a lower third (no dim; "THREE OR FOUR DAYS" lands on its words); the "ate off the country" sub-line is dropped.
- **Merged numbers card**: HE COUNTED / OVER 60,000 / CONFEDERATES (on "Confederates") / *modern counts are lower* (on its words, ~3.7 s)
  / rule / HIS ARMY (on "his army") / THE SMALLER ONE (on "the smaller one"); ends with paragraph s12-4 (63.5 s voice time).
- **Quote card**: darkened, desaturated Sherman portrait on the left, narrator's words in italic, the VERBATIM part *as sure as life*
  with a big red hanging opening mark in the margin, attribution SHERMAN WARNED (40 px) with a red bar matched to its height.
- No new sounds: only the original `hit` cues.
