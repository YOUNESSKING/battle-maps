# Cleburne #14: packaging v6 (2026-11-06)
Sheet: `cleburne/youtube/packaging_sheet.jpg` (A, B, C at 1280x720 + feed strip at true 168x94 and 2x next to 6 competitors).
Competitor thumbnails: `cleburne/youtube/sidebar/` (14 hqdefault files, named by video id).

## 1. Sidebar check (yt-dlp search, 2026-11-06: "Patrick Cleburne", "Ringgold Gap", "Missionary Ridge Tunnel Hill", "Battle of Missionary Ridge", "Pickett's Mill")
| Video | Channel | Views | Thumbnail |
|---|---|---|---|
| V-j_WbJWQXU Ulysses S Grant - Battle of Chattanooga | Scots Grey | 811K | film still, no text |
| 5RL4YD_8mh8 Chickamauga & Chattanooga | Real History | 384K | reenactment photo, big thin title |
| EoLrcWoGEnY The Battle of Chattanooga (1863) Pt 1 | Threads from the National Tapestry | 291K | CHATTANOOGA in big red caps + Grant & Bragg real portraits, warm sepia |
| jT4u6WCsaw8 Patrick Cleburne: Stonewall of the West | History Gone Wilder | 221K | NAME in text box + colourised famous Cleburne portrait + warm battle painting |
| K5XoCT1XdH4 Five Fateful Hours: Franklin | Threads | 140K | big title text + real portraits, light sepia |
| XMK79steT6A Missionary Ridge, Animated Battle Map | History Gone Wilder | 113K | place name in big text + two portraits on a white map |
| rlWd51CN5_M Death of Cleburne / Franklin | History Gone Wilder | 84K | "Cleburne At Franklin" huge text + colour portrait + warm painting |
| Ringgold Gap / Pickett's Mill topics | ABT, HGW, GA State Parks | 7K-27K | small niche; no strong competitor |

What the winners do: **the NAME or the famous PLACE written huge** (CLEBURNE / CHATTANOOGA / Missionary Ridge), **real period portraits with the face large**, **light, warm (sepia/orange/white-map) images**. Nobody uses a dark image, an AI face or a slogan without the name. The demand is Chattanooga/Missionary Ridge + Grant/Sherman; Ringgold Gap and Pickett's Mill alone are tiny searches.
Our A/B thumbnails repeat the Arnold #17 failure: dark grey-blue, no name, AI face that does not look like Cleburne (moustache only; he wore a full beard), and a collar with TWO stars in a wreath (a CSA general wears three) = stray insignia. They should not be the main thumbnail.
Note: the sidebar winners all use the colourised moustache-and-goatee portrait of Cleburne (the "famous" one). We could not fetch it (Wikimedia rate-limited this machine); C uses our own real LoC photo (Ben Oppenheimer carte, LoC 2025167359, public domain, already in the video). If the owner can supply that famous portrait, a C2 with it is worth a Test & Compare slot.

## 2. Thumbnail C (new): `cleburne/youtube/thumb/cleburne-thumb-C-name.jpg` (1280x720)
- "CLEBURNE" huge (Oswald 700, yellow, black stroke) + red tag "TOP 3 MOVES" (2 words + numeral). Spelling checked: CLEBURNE, TOP 3 MOVES.
- Real photo, cut out (rembg isnet), warm-toned, contrast face pop + warm rim light; whole face in frame.
- Background: our own video frame, Tunnel Hill counterattack, 25 Nov 1863, 4 PM (master 4:53), date scroll cropped out, ground warmed to gold, markers/arrows kept vivid. Labels visible: CORSE, LOOMIS, MATTHIES, HUNDREDS SURRENDER (all in the script/FACT_NOTES; "hundreds of Federals surrendered" = NPS "surrendered in large numbers").
- No Confederate battle flag; only the video's own tiny period flags (US flag, First National on Cleburne's badge). No insignia added. Possible nitpick: the Union red NATO-style infantry boxes (red square with an X) are small but could, at a glance, read like a red saltire; they are the video's own markers.
- Fits titles A and C (and B, which names Sherman/Missionary Ridge = the map shown).

## 3. Titles (vidIQ `score_title`, long, 2026-11-06)
| | Title | Chars | vidIQ | Claim check |
|---|---|---|---|---|
| A (locked format, current) | Patrick Cleburne's Top 3 Legendary Tactical Moves \| The Man Who Saved the Confederacy's Western Army | 99 | 87 | Ringgold: Bragg's order to hold "until the artillery and transportation of the army are secure"; the train got away, Grant halted the pursuit (ECW; script line "and saved the army"). |
| A-alt | Patrick Cleburne's Top 3 Legendary Tactical Moves \| The Man Who Beat Sherman at Missionary Ridge | 96 | 87 | Tunnel Hill: Sherman ~16,000 vs ~4,000, attacks failed, ~2,000 Union lost vs ~220 (NPS, Wikipedia, ABT). Carries the famous names the sidebar is built on. |
| B (famous-battle curiosity) | Missionary Ridge, 1863: How One Confederate Division Stopped Sherman's 16,000 | 77 | **89** | Sherman "roughly 16,000" in three divisions (NPS; Wikipedia 16,600); Cleburne's division held Tunnel Hill. |
| C (hybrid) | How Patrick Cleburne Stopped Sherman at Missionary Ridge and Saved an Army at Ringgold Gap | 88 | 85 | as A + B. |
Rejected: "Patrick Cleburne: How 4,000 Men Stopped Sherman and Saved an Army" (83); "...The Irish-Born General Who Stopped Sherman at Missionary Ridge" (83). No "Stonewall of the West" (origin unsourced in FACT_NOTES; also the competitor's title).

## 4. Recommendation
- **Main thumbnail: C** (name + real face + bright warm map: the exact Arnold lesson, and it is the only bright, warm, named thumbnail of ours in the strip). Test & Compare: C vs A ("AT ALL HAZARDS"); drop B (same image as A). Better: replace A/B in the test with a C2 using the famous portrait if the owner can provide it.
- **Main title: A (current)**, kept because it is the locked format and the sidebar check does not argue against it; but the sidebar demand is Missionary Ridge/Sherman/Chattanooga, so put **B (89)** and **C (85)** in the title test. If the owner prefers one swap, A-alt ("The Man Who Beat Sherman at Missionary Ridge", 87) adds the searched names while staying in the locked format.
- Before publishing: add the "Packaging TEST claims" table (added to `cleburne/research/FACT_NOTES.md`).
