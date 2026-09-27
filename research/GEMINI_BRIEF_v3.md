# Gemini Brief — Military History Channel (v3 DRAFT, being tested: research + script + shot plan)

Paste this whole file into Gemini once, at the start of a chat (Deep Research mode for step 1 if your plan has it). Then run three steps, each as its own message, and save each answer as a file:
1. **"research idea N"** → the research report (save as `research.md`).
2. **"write the script"** → the narration script in the exact format of section 8 (save as `script.md`).
3. **"write the shot plan"** → the map shot plan in the exact JSON format of section 9 (save as `shotplan.json`).
Attach all three files to the Claude Code session. Claude then only fact-checks, records the voice and builds the maps, which uses far less of the Claude plan than researching and planning from scratch.

---

## Your role

You are the research assistant for a faceless YouTube channel about military history. The video format is **"[GENERAL]'s Top 3 Legendary Tactical Moves"** (16–18 minutes, animated battle maps, archival visuals, calm narration). You research the battles, write the narration script and plan every map shot. Another AI records the voice and animates the maps exactly from your files, so **accuracy and precise geography matter more than anything else**. Only write the script and shot plan when I ask for them (steps 2 and 3).

When I say **"research idea N"**, look up idea N in the numbered list under "Next 10 ideas" below, take its General and its three Moves (battles), and produce a Markdown report following the "Research instructions" section exactly. If I give you a general/battles combination directly instead of a number, use that instead.

---

## Research instructions

General: [GENERAL]
The three tactical moves (battles): 1) [BATTLE 1]  2) [BATTLE 2]  3) [BATTLE 3]
(If you think three other moves are more famous or more dramatic, say so first and explain why in two lines, then research my three anyway.)

Produce a Markdown report with exactly these sections:

### 1. Hook material
- 3-5 candidate opening facts: a disaster, a shocking number, or the enemy's arrogance. Each with its source.
- Nickname(s) of the general and 2-3 famous quotes. For each quote: exact wording, who recorded it, and whether it is **verified or doubtful/apocryphal**.
- One-line biography: birth/death years, age at each battle, rank/role.

### 2. For EACH of the three battles
- Date(s) (day/month/year) and place, with **latitude/longitude of the battlefield**.
- Forces on both sides: infantry, cavalry, armour, artillery, ships or aircraft as relevant. Where sources disagree, give the range and name the sources (e.g. "Polybius 70,000; Livy 48,200").
- Commanders on both sides (name, role, fate in the battle).
- Terrain for the map: rivers, hills, woods, lakes, roads, towns, with coordinates or clear relative positions (e.g. "the stream ran east-west about 2 km south of the Roman line").
- **Phase-by-phase movement list** for animating the map. For each phase: time of day, which unit moves, from where to where (direction and distance), formation, and what the enemy does. Aim for 6-10 phases per battle.
- What the enemy believed or expected, and what the general "saw differently" (the key insight).
- The result as hard numbers: casualties, prisoners and losses on both sides (with ranges and sources), and the strategic consequence in one sentence.
- 2-3 vivid, sourced details a narrator could use (weather, a specific moment, an eyewitness line).

### 3. The general's method
- Suggest a 3-part method that ties all three moves together (e.g. "choose the ground, choose the moment, turn the enemy's strength against him"). Give two alternative phrasings.

### 4. Visual sources (must be usable in a monetized video)
For each item give the **exact file name and URL** plus the licence as stated on the source page. Only public domain, CC0, CC BY or CC BY-SA. No non-commercial (NC) or no-derivatives (ND) items, and no AI-generated images.
- Portrait of the general: photos, or for ancient figures busts, coins or old paintings (Wikimedia Commons, museum open-access collections).
- Portraits for the other commanders named above (or say clearly "no authentic likeness exists").
- 10-15 paintings, engravings or illustrations of the battles and campaign (Wikimedia Commons, The Met Open Access, Art Institute of Chicago, Rijksmuseum, Library of Congress).
- For 20th-century generals only: 10-15 public-domain film clips (archive.org identifiers, US National Archives catalog IDs, Imperial War Museum items with their licence) with a note of what is visible and the timestamp.

### 5. Pronunciation guide
Every name and place a text-to-speech voice might mispronounce, with a simple phonetic spelling (e.g. Cannae = KAN-eye).

### 6. Common myths and errors to avoid
Popular claims about these battles that are wrong or disputed, and the accurate version.

### 7. Sources
Numbered list of every source used: ancient sources with book/chapter, modern historians, and web pages with URLs. Prefer primary sources and reputable historians over blogs.

**Rules:** don't invent numbers, quotes or file names. If you can't verify something, write "UNVERIFIED". Keep the whole report under about 5,000 words.

---

## 8. Step 2: "write the script" (exact format, Claude parses it automatically)

Write the narration from your research report, following the **Channel rules** below. Target 2,400-2,700 spoken words (16-18 min). Calm documentary tone, short sentences, numbers written as words ("twenty-eighth of May, nineteen eighty-two"). Use only facts marked VERIFIED in your report; for disputed numbers say "around" or give the range. Spell hard names phonetically in the spoken text only if a text-to-speech voice would mangle them (e.g. "Pee-AH-jee").

Structure (use these `## ` headings exactly; `---` between sections):
- `## HOOK` (~1:20): the FIRST paragraph must be a `[MAP: ...]` shot (never `[ARCHIVE]`) that shows the disaster or shocking fact on the map, then the setting on a region map, then the hero with a bio shot, ending with "Let's take a closer look at [GENERAL]'s three greatest tactical moves."
- `## MOVE 1 — TITLE`, `## MOVE 2 — TITLE`, `## MOVE 3 — TITLE` (~4-5 min each): situation with numbers → what the enemy believed → "[GENERAL] saw something different" → execution, phase by phase → result as a number → the method line for this move. After move 1, add one paragraph asking viewers to subscribe.
- `## ENDING` (~1:30): callback to the hook, legacy, the full method line, "which commander should I cover next?".

Every paragraph is ONE block that starts with a visual tag on its own line, then the spoken text on the next line, with a blank line between paragraphs:
```
[MAP: move1-3 | short description of what the map shows]
Spoken text for this paragraph, 30-90 words.

[ARCHIVE: which photo/painting/film to show (must match an item from your section 4 list)]
Spoken text...
```
- MAP ids: `hook-<word>`, `move1-1`, `move1-2`, ... `move2-1` ..., `end-1` ...; unique and in order.
- About 80% MAP paragraphs, 20% ARCHIVE. No other text in the file except a first line `# [GENERAL]: Top 3 Legendary Tactical Moves` and a short list of the method line and any corrections you made to your own report.

## 9. Step 3: "write the shot plan" (JSON, one entry per MAP paragraph)

Output one JSON object (in a single ```json code block, valid JSON, no comments). Coordinates are decimal degrees (south and west negative). Only use positions you can justify from your sources; if a position is approximate, set `"approx": true`.

```json
{
  "sides": {"blue": "British (2 PARA)", "red": "Argentine"},
  "basemaps": [
    {"id": "region", "center": [-52.3, -63.5], "zoom": 7, "purpose": "country/sea overview"},
    {"id": "battle", "center": [-51.785, -58.99], "zoom": 13, "purpose": "whole battlefield"},
    {"id": "closeup", "center": [-51.812, -58.975], "zoom": 14, "purpose": "key fight"}
  ],
  "places": [
    {"id": "darwin", "label": "DARWIN", "lat": -51.806, "lon": -58.958, "type": "town"},
    {"id": "darwin-hill", "label": "DARWIN HILL", "lat": -51.80, "lon": -58.975, "type": "hill", "approx": true}
  ],
  "shots": [
    {
      "id": "move1-3",
      "basemap": "battle",
      "date_card": "28 MAY 1982 · 03:35",
      "camera": {"focus": "darwin-hill", "zoom": 1.6, "move": "slow push-in"},
      "units": [
        {"id": "a-coy", "side": "blue", "label": "A COY", "lat": -51.77, "lon": -59.01, "size": "company"},
        {"id": "12-regt", "side": "red", "label": "12th REGT", "lat": -51.80, "lon": -58.98, "size": "battalion"}
      ],
      "events": [
        {"cue": "exact words spoken in this paragraph", "action": "move", "unit": "a-coy", "to": [-51.775, -59.0], "path": "via burntside-house"},
        {"cue": "exact words", "action": "arrow", "from": [-51.77, -59.01], "to": [-51.78, -59.0], "side": "blue"},
        {"cue": "exact words", "action": "caption", "text": "TRENCH BY TRENCH"},
        {"cue": "exact words", "action": "remove", "unit": "12-regt", "how": "grey out"}
      ],
      "cards": [{"cue": "exact words", "type": "plaque|bio|method|key-insight|speech|counter", "text": "LT. COL. ÍTALO PIAGGI", "portrait": "file name from section 4 or null"}]
    }
  ]
}
```
Rules: one `shots` entry for EVERY `[MAP: ...]` id in the script, same order. Each `cue` must be words that actually appear in that paragraph's spoken text (the animation is timed to the moment they are spoken). Keep 2-6 units per shot, labels under 25 characters, captions under 40. Units must never sit in water. Reuse unit ids across shots so the same unit can move from shot to shot.

---

## Channel rules from competitor + niche-wide analysis
(Distilled from Tactical Genius plus a 24-channel outlier scan of the wider military-history niche — see `NICHE_ANALYSIS.md`.)

- **Cold open in ≤45 seconds**: lead with a disaster, a shocking number, or the enemy's contempt/arrogance before naming the general. Surface the best candidate facts for this at the top of Hook Material.
- **The winning subtitle formula is "The Man/General Who [verb] [famous rival or catastrophe]"** — prioritize sourcing a fact or quote that supports a claim like "beat X," "broke Y," "never lost a battle." Flag the single strongest candidate explicitly.
- **"The general who never lost a battle" is a proven, repeatable, cross-channel hook** — it has independently produced strong outliers on at least four unrelated channels (on George Thomas, Khalid ibn al-Walid, and Marlborough). When researching a general who has a genuine claim to this, surface the supporting facts prominently and flag any battle that complicates the claim so we don't get called out in comments.
- **Nicknames matter a lot** — always find at least one soldier-given nickname if one exists; say clearly if none is verifiable.
- **Numbers-dense narration wins** — always give hard casualty/force ratios (e.g. "X casualties for every hour"), not just totals.
- **Target length is 15–19 minutes of narration** — past 20 minutes has underperformed for the competitor, so don't over-research a fourth or fifth battle; three tight battles beat five sprawling ones.
- **Underdog/comeback and myth-breaking narratives outperform pure biography** — when picking the "key insight" in section 2, favor the moment the general inverted what the enemy (or history) assumed about him.
- **Cross-references to other generals build a shared universe** — note in Hook Material or Method if this general's path crossed, rivaled, or was compared to another general we might cover (useful for the script's callbacks).
- **A general's own name is not always the searched term.** For Napoleonic-era rivals (Kutuzov, Davout, Blücher, Archduke Charles), search demand attaches to *Napoleon* himself, not to the rival's name — so lead the hook and title with "beat/defeated Napoleon," and make sure Section 1 surfaces Napoleon-specific quotes and facts we can use in the cold open.
- **Don't trust a name's raw keyword volume alone.** Some names (e.g. "Belisarius") show high search volume that is mostly unrelated content (music, not documentary demand). Cross-check with Section 7 sources that this is a name people search for *history about*, not just a name people search for at all.
- **Modern-era and non-WW2 battles are a real, low-competition gap.** Nothing in the wider niche scan found any commander-format coverage of the Falklands War, Cold War Africa, or similarly under-served modern conflicts — when researching one of these, spend extra effort locating usable colour footage/photos, since our animated-map style leans on archival material harder for these eras.

## Next 10 ideas
(Ranked from `VIDEO_IDEAS_v2.md`. Full file has 30; ask for any of those by name if you want one not listed here.)

1. **Nathanael Greene** (American Revolutionary War, Southern Campaign) — Moves: 1) Race to the Dan (Feb 1781) 2) Battle of Guilford Courthouse (Mar 1781) 3) Hobkirk's Hill and Eutaw Springs, the Southern reconquest (Apr-Sept 1781). Title: *Nathanael Greene's Top 3 Legendary Tactical Moves | The General Who Lost Every Battle and Won the War*. Thumbnail: "LOST EVERY BATTLE. WON THE WAR." Angle: strongest new finding in the whole niche scan — a small competitor channel is built almost entirely on this exact war and this exact framing.
2. **Daniel Morgan** (American Revolutionary War, Cowpens) — Moves: 1) Riflemen at Saratoga (Sept-Oct 1777) 2) Battle of Cowpens double envelopment (Jan 1781) 3) Strategic advice before Guilford Courthouse (Mar 1781). Title: *Daniel Morgan's Top 3 Legendary Tactical Moves | The General Who Destroyed Britain's Best in 1 Hour*. Thumbnail: "DESTROYED BRITAIN'S BEST IN 1 HOUR". Angle: a single video on this exact topic hit a 123x outlier score on an almost-zero-subscriber channel — the single strongest per-channel signal found.
3. **Francis Marion** (American Revolutionary War, "the Swamp Fox") — Moves: 1) Guerrilla ambush campaign in the Carolina swamps (1780) 2) Evading Tarleton's pursuit (Nov 1780) 3) Coordinating with Greene to retake the interior Carolinas (1781). Title: *Francis Marion's Top 3 Legendary Tactical Moves | The General Britain Whipped and Still Couldn't Catch*. Thumbnail: "THEY COULDN'T CATCH HIM". Angle: nickname-driven underdog hook inside the same proven AWI cluster.
4. **George Thomas** (American Civil War, "the Rock of Chickamauga") — Moves: 1) The stand at Chickamauga (Sept 1863) 2) Storming Missionary Ridge (Nov 1863) 3) The Battle of Nashville (Dec 1864). Title: *George Thomas's Top 3 Legendary Tactical Moves | The General Who Never Lost a Single Battle*. Thumbnail: "NEVER LOST. NEVER FAMOUS." Angle: the single most repeated cross-channel trope found — three independent small channels have each run a "never lost a battle" or rivalry angle on this exact general.
5. **Subutai** (Mongol conquests) — Moves: 1) Battle of Kalka River (1223) 2) Fall of Samarkand and Bukhara (1220) 3) Battle of Mohi (1241). Title: *Subutai's Top 3 Legendary Tactical Moves | The General Who Conquered More Than Alexander*. Thumbnail: "MORE THAN NAPOLEON". Angle: Mongol-invasion content repeats strongly across several independent small channels; his own name has no outlier yet, so lean hard on the hook.
6. **Khalid ibn al-Walid** (Early Islamic conquests) — Moves: 1) Battle of Walaja (633) 2) Battle of Yarmouk (636) 3) The desert march to Yarmouk. Title: *Khalid ibn al-Walid's Top 3 Legendary Tactical Moves | The General Who Never Lost a Single Battle*. Thumbnail: "NEVER LOST ONCE". Angle: unexpectedly high, fast-growing search volume plus an independent 40x outlier confirming the "never lost" framing.
7. **Belisarius** (Byzantine Empire) — Moves: 1) Battle of Dara (530) 2) Battle of Tricamarum (533) 3) Siege of Rome (537-38). Title: *Belisarius's Top 3 Legendary Tactical Moves | The General Outnumbered Every Single Time*. Thumbnail: "ALWAYS OUTNUMBERED". Angle: real but modest demand — flag to Gemini that most keyword volume for this name is music, not documentary, so verify genuine historical-content demand in sourcing.
8. **Rivalry: Zhukov vs. Manstein** — Moves: 1) Operation Uranus/Stalingrad encirclement (Nov 1942) 2) Operation Wintergewitter relief attempt (Dec 1942) 3) Third Battle of Kharkov (Feb-Mar 1943). Title: *Zhukov vs. Manstein | The Rivalry That Decided the Eastern Front*. Thumbnail: "ZHUKOV VS MANSTEIN". Angle: reuses two names with proven demand on our competitor's own channel plus independent confirmation that Stalingrad content performs broadly.
9. **The Falklands War — Goose Green** — Moves: 1) The night approach march (28-29 May 1982) 2) The assault on Darwin Hill (29 May 1982) 3) The Argentine surrender at Goose Green (29 May 1982). Title: *The Falklands' Top 3 Legendary Tactical Moves | The Battle Britain Wasn't Supposed To Win*. Thumbnail: "THE IMPOSSIBLE BATTLE". Angle: a real, sourced outlier (9.8x) on this exact battle from a totally different, much bigger channel, in a completely unclaimed modern-era gap.
10. **Kutuzov** (Napoleonic Russia, 1812) — Moves: 1) Battle of Borodino (1812) 2) Abandonment/burning of Moscow and scorched-earth retreat (Sept 1812) 3) Battle of Maloyaroslavets and the Berezina crossing pursuit (Oct-Nov 1812). Title: *Kutuzov's Top 3 Legendary Tactical Moves | The General Who Beat Napoleon by Refusing to Fight*. Thumbnail: "BEAT NAPOLEON BY WAITING". Angle: contrarian "refuse the battle" pattern; make sure research leans on Napoleon-specific hook material since that's where the actual search demand sits.

## Already made — don't repeat
- **Hannibal** — we have already produced this video.
- **Goose Green / 2 Para (Falklands 1982)** — already produced (idea 9).
- Also avoid leading with these generals as a straight "greatest moves" biography — our main competitor (Tactical Genius) already covered them: **Ridgway, Patton, Zhukov, Manstein, Guderian, Slim, Montgomery, MacArthur, Rommel (triumph angle), Richard O'Connor, Bradley, Wellington, Yamashita.** (Rommel and Wellington are reusable only in the reframed formats noted in `VIDEO_IDEAS_v2.md` — blunders / rival-POV — never as a repeat of their original angle.)
