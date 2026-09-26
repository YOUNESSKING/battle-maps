# Title, Thumbnail, Description, Chapters & Tags Guide (battle-maps channel)

How to write the YouTube packaging for every video. Adapted from the owner's packaging guide for the sister channel
(Psycho Décodé, videos 1–4) to this English military-history channel. Each rule says **why**, so edge cases can be
judged instead of followed blindly. Worked example: `morgan/youtube/youtube_metadata.md` (+ the PDF next to it).

---

## 0. Order of work

1. **Validate the topic** before writing anything (§1).
2. **Title**: write options, score them, lock one (§2).
3. **Thumbnail**: must make the *same promise* as the title (§3).
4. **Description**: only after the final audio is locked (§4).
5. **Chapters**: computed from the final timeline, never guessed (§5).
6. **Tags + category** (§6).
7. Save everything in `<name>/youtube/youtube_metadata.md`, build the upload PDF (`<name>/youtube/<Name>-YouTube-upload.pdf`: thumbnail, title, alternatives, settings, description, tags) and give the owner the exact text to paste.
   **Never upload or edit anything on YouTube ourselves.**

---

## 1. Validate the topic first

- Topic + packaging drive views; a strong intro is only table stakes.
  *Why (sister channel):* competitor flops had intros as strong as their hits (40 transcripts studied).
- Proof of demand = the same topic doing well on **several channels**. Use `vidiq_outliers` / search.
  Here: `research/VIDEO_IDEAS_v2.md` already lists the outliers per idea (e.g. Daniel Morgan: a 123x outlier on a
  tiny channel, no bigger channel covering him in the general format — that gap is the opportunity).
- Record the competitor video IDs, titles, views and thumbnail notes in `<name>/youtube/competitors.md`
  and save their thumbnails in `<name>/youtube/competitor_refs/`.

---

## 2. Title

### Rules
| Rule | Why |
|---|---|
| **Score every option with `vidiq_score_title`** (type `long`, 5 credits each). Target **≥ 85**. | Don't lock an unscored title. Morgan: 93 / 95 / 93 / 96. |
| Put the hook in the **first ~60 characters**. | Phones cut titles around 60 characters. The series name ("X's Top 3 Tactical Moves") goes after the hook. |
| **No negation as the hook** ("He wasn't a genius…"). | Sister channel video 2: the brain reads the strong word before the negation; the promise flips. |
| Be **clear and accurate**: every claim must be true and self-explanatory. | Morgan v1 "Destroyed Britain's Best" confused the owner ("Britain's best what?") and overstated it; "Britain's Elite" is clear and true. |
| Match the **emotional register** of the competitor hits (underdog, "the general who never lost", enemy's arrogance). | See `research/NICHE_ANALYSIS.md`. |
| The title in `youtube_metadata.md` must be the **scored, locked** one. | Sister channel V4: a helper agent wrote an unscored title into the metadata file. |
| ≤ 100 characters (YouTube limit). | |

### Pattern that worked
`[Hook: the most shocking true fact]: [General]'s Top 3 Tactical Moves`
- Morgan (95, locked): *He Destroyed Britain's Elite in 1 Hour: Daniel Morgan's Top 3 Tactical Moves*
- Morgan A/B alternative (96): *How a Crippled Wagon Driver Wiped Out Britain's Elite in Under an Hour*

---

## 3. Title ↔ thumbnail: one promise

- Thumbnail = 2–5 words, ALL CAPS, **one red element** (the emotional payload), no negation,
  tested at 168×94 px (phone size). The general's portrait on one side, the key map moment behind.
- **The thumbnail must never contradict the title.**
  *Why (sister channel):* video 2 had CTR 1.7 % while its live thumbnail said the opposite of its title.
- The thumbnail completes the title, it doesn't repeat it word for word when possible.
- Make 2–3 options and use Studio → **Test & compare**.

---

## 4. Description

Write it **after the voice is final** (facts can change during fact-checking and re-voicing).

### Template (paste-ready shape)
```
[LINE 1–2 — THE HOOK: the script's own opening, in plain words. These are the only lines shown before
 "more", so they must make someone want to watch.]

In this video we break down [General]'s three greatest tactical moves: [3 moves, each naming the REAL
 battle / people actually said in the recorded voice].

[ONE payoff line — the video's closing idea.]

CHAPTERS
0:00 …

SOURCES
- …

CREDITS (images, terrain, music — required by the CC BY licences)
…

Narration voice: AI-generated (Kokoro TTS). Maps: original animations.
📩 Business enquiries: [email to fill in]

#[General] #[Battle] #[War]
```

### Rules
| Rule | Why |
|---|---|
| Name **only battles, people and numbers that are in the recorded script**. | Sister channel V4 cited researchers who were never in the voice. |
| **Fact-check every name and number** before it goes in (and before voicing). Use the Gemini v3 fact-check list. | Morgan research had 5 errors (see HANDOVER §8.12). |
| First line = the script's hook, not "In this video…". | The first ~2 lines are all most viewers see. |
| Keep every CC BY / CC BY-SA credit line. | Licence requirement. |
| Exactly **3 hashtags**. | More than 3 looks spammy. |
| Business email: `[email to fill in]` — **the owner must fill it in.** | |

---

## 5. Chapters

- Compute them from the **final** timeline, never by ear: the paragraph start times in `<name>/audio/timing.json`
  (our assembly keeps the voice timeline unchanged, so these are the final times). Re-run whenever the audio changes.
- Anchor chapters to **paragraph ids** (e.g. `cow-13`), never to a hard-coded second.
- First chapter = `0:00`; every chapter ≥ 10 s (YouTube minimum); ~10–12 chapters for 16–19 min
  (hook, each move's setup / key moment / result, ending).
- Chapter titles: short, the section's idea — they double as mini-hooks ("The Shot That Killed Fraser").

---

## 6. Tags & category

- 12–18 English tags, **≤ 500 characters total**, comma-separated, in this order:
  1. broad: `military history`, `history documentary`, the war (`American Revolution`)
  2. topic: the battles and concepts (`Battle of Cowpens`, `double envelopment`)
  3. names said in the video (`Banastre Tarleton`, `Nathanael Greene`)
  4. long-tail phrases people search (`greatest military tactics`, `animated battle map`)
- Same fact rule: no tag for a person or battle that isn't in the video.
- Category: **Education**, always.
- Mark **Altered or synthetic content = Yes** (AI narration voice).

---

## 7. Final checklist (tick before handing to the owner)

- [ ] Topic validated by ≥ 2 competitor outliers; refs saved in `youtube/competitor_refs/`
- [ ] Title scored ≥ 85 with vidIQ; hook inside ~60 chars; ≤ 100 chars; clear and true
- [ ] No negation as the hook (title and thumbnail)
- [ ] Thumbnail makes the same promise as the title; 2–3 options for Test & compare
- [ ] Description line 1 = script hook; every name/number fact-checked and actually in the voice
- [ ] Chapters from `timing.json` on the FINAL audio; start at 0:00; each ≥ 10 s
- [ ] Credits + email placeholder + 3 hashtags
- [ ] 12–18 tags, ≤ 500 chars; category Education; synthetic content = Yes
- [ ] `youtube_metadata.md` and the PDF hold the locked title (not an alternative)

---

## 8. How sure are we?

- **Measured (sister channel):** the video 2 CTR/thumbnail mismatch, the chapter-timing errors, the fact errors,
  the vidIQ title scores.
- **Good practice, not yet proven on this channel:** hashtag count, tag order, chapter count, the hook-first title.
  Revisit after each video's Studio numbers (CTR, first-30-s retention) come in — ask the owner for
  screenshots; vidIQ has no impressions/CTR.
