# Morgan v4 (2026-10-21): brought up to STYLE_LOCK / HANDOVER v3 without re-rendering any map scene

Master: https://gofile.io/d/dsJbx5Io (18:21, 1080p, -14.2 LUFS). Voice and script unchanged (owner's choice).

Done (no re-render):
- Music: the locked Kevin MacLeod bed (Long Note One / Wounded / Long Note Two / Anguish, `tools/make_music_bed.py`), MUSIC_VOL 0.08, locked ducking.
- Sound: the locked kit (`assets/media/sfx/` from goosegreen, `tools/sfx_mix_lib.py`, `tools/check_sound_lock.py` = OK): real distant-artillery
  booms for cannon, zoom whoosh only on the 3 biggest camera moves, hit on title/casualty cards; Morgan's own musket / cavalry / cheer
  sounds kept (no 18th-century equivalent in the kit). Locked mix chain: SFX ducking, limiter 0.5, two-pass loudnorm -14. `tools/mix.py`.
- Archive: Netflix look with `tools/archive_shots.py` (3D depth photos, ~4 s shots, lower-third labels, headline date cards for Cowpens,
  Saratoga, Yorktown). Owner: portraits were held too long -> each portrait at most 4.5 s once per segment, then event images
  (`archive/slots.json`); the 29 s bio card is cut after 8 s to wagon / Braddock cutaways (`archive/hook_cutaways.json`).
  Build: `python3 tools/assemble.py --v4` (resumable via build/seg/*.v4 markers), then `python3 tools/mix.py`.
- Packaging: TG title pattern (vidIQ 94), locked-formula thumbnails (`tools/make_thumb.py`, A "LET THEM RUN", B "ONE HOUR"),
  link-free description, facts-to-check box, PDF (`tools/make_upload_pdf.py "Daniel Morgan" Morgan`).

Not done (would need a re-render or a re-voice): hook v2, dark HD maps, territory/front-line looks, silhouette counters, photo badges,
impact/bomb effects, new casualty/method cards, voice A, a stakes-first line 1.

## v5 (2026-10-21, owner: "images and portraits kept repeating back and forth, the introduction was way too long")
Master: https://gofile.io/d/7p1ggtrK (17:39, -14.2 LUFS; folder also has both thumbnails and the upload PDF).
- **No image twice in the whole video:** one shot per image, never back to an earlier image, one portrait per person (<= 4.5 s);
  `assemble.py` USED / DROP sets, 37 archive shots, 0 duplicates (checked from build/seg/*.v5). 15 new LoC / Commons images (`*_n*.jpg`).
- **Intro 2:20 -> 1:38 without re-recording:** `tools/cut.py` removes whole sentences/paragraphs from picture + voice at the same
  points (the Tarleton portrait paragraph, "He had almost no formal education.", "He liked to say...", "And yet the battle plan...
  still studied..."), writes timing_cut.json; music bed, SFX cues and chapters follow (`CUT=1` for make_music_bed.py / mix.py).
- Full rebuild: `bash build/run_v5.sh` (assemble --v5 -> cut -> CUT=1 music bed -> CUT=1 mix).
Rule for every future video: never reuse an image; a 20 s archive paragraph needs 4-5 different images; keep the hook <= ~65-100 s.

## v6 (2026-10-21, owner: "low-quality images; replace the white ones; don't zoom on every image / zoomed at the start, not clear; music still loud")
Master: https://gofile.io/d/GJbziotm (17:39, -14.2 LUFS; folder also has both thumbnails and the PDF).
- HD: every archive image >= 1500 px; 14 low-res ones upscaled with Real-ESRGAN x4plus (`tools/upscale.py`, originals in archive/orig/)
  because Wikimedia blocked downloads (429 for 35+ min); The Met API (v1.1 search, CC0, full-size originals) works as a source.
- White images out: schematic map + Declaration line-art dropped, second letter + Guilford plan replaced (Met: Leutze "Washington
  Crossing the Delaware", Müller after Trumbull "Battle of Bunker's Hill"), medal cut onto dark, the one letter toned darker.
- Moves (`archive_shots.boxes`): every shot STARTS on the whole image; mix of push-in (15 %), gentle pan, near-still drift; tall /
  square images shown whole on a dark blurred fill (`fit`), never cropped. 35 shots, 0 repeats.
- Music: MUSIC_VOL 0.045 (owner: "still loud"; the locked 0.08 was too loud for this video).
Rule for future videos: >= 1500 px images only (upscale if needed), no white/bright scans, no shot that starts zoomed in, music <= 0.05.
