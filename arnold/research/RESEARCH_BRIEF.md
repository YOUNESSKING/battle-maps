# Research brief, Benedict Arnold #17 (no Gemini file: owner approved own research 2026-11-03)
Questions = `research/GEMINI_ARNOLD_PROMPT.md` (read it). Each agent researches ONE move from primary + serious sources
and writes `arnold/research/FACTCHECK_<X>_<move>.md`, modelled on `grant/research/FACTCHECK_A_henry_donelson.md` (read it for the format).

## Rules
- Fetch real texts; prefer primary sources: Arnold's letters (Force, *American Archives*; Kenneth Roberts *March to Quebec* journals of
  Henry, Dearborn, Senter, Meigs, Thayer, Morison; Arnold's Valcour reports to Gates/Schuyler, Oct 1776; Carleton's/Pringle's reports;
  Burgoyne *State of the Expedition* 1780; Wilkinson *Memoirs*; Riedesel; Digby journal; Anburey; Varick/Livingston letters to Schuyler,
  Sep 1777), archive.org / Gutenberg / Founders Online (founders.archives.gov) / NPS (nps.gov/sara, Valcour), American Battlefield Trust,
  Naval History and Heritage Command (*Naval Documents of the American Revolution*, vols 2-6), Mount Vernon, Library of Congress.
  Modern cross-checks: Wikipedia (only as a pointer), Mahan *Major Operations of the Navies*, Nelson *Benedict Arnold's Navy*,
  Desjardin *Through a Howling Wilderness*, Luzader *Saratoga*, Philbrick *Valiant Ambition*, Ketchum *Saratoga*.
- Table: claim | verdict CONFIRMED / CORRECTED / DISPUTED / UNVERIFIED | safe hedged fact | source URL + short snippet.
  Then: "Best vivid details that ARE verified" (for maps and the hook), "Do not say", numbers per side (troops, ships, guns, losses,
  prisoners, distances, dates, with ranges where sources differ), place coordinates (lat/lon) for the map, and pronunciation of every name
  (IPA or respelling with source).
- Never invent quotes, numbers, file names. Quote marks only on verbatim text you have seen. Ignore page numbers.
- Licensed visuals: list 4-8 public-domain images (Wikimedia Commons / LoC) with exact file name + URL you actually opened
  (Wikimedia may block: try `https://images.weserv.nl/?url=upload.wikimedia.org/...` or the LoC API). Note any image that shows
  something inaccurate.
- Also note, for the map: what modern dams/reservoirs exist on the route (must NOT be drawn), 1775-77 shorelines vs today.
- Save fetched texts in the scratchpad `/tmp/claude-0/-home-user-battle-maps/ea403ef6-3b59-5ee8-9889-dab5cb0fb2ba/scratchpad/arnold/`.
- Do not edit any other file. Do not commit. Final reply: <= 15 lines summary (top facts, biggest corrections, open questions).
