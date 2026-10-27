# Media Credits — Nathanael Greene / Southern Campaign video

All images below are from Wikimedia Commons and are Public domain, CC0,
CC BY, or CC BY-SA (no NC/ND licences used). Portrait paintings and
engravings are photographic reproductions of flat public-domain artworks
(free to use regardless of the photographer); photos of 3D objects
(statues, monuments, historic sites) are CC-licensed photographs and are
credited to their photographer below.

Downloaded with a descriptive User-Agent, 2-3 s+ between requests, and
standard thumbnail widths (960/1280/1920 px) only, per Wikimedia's API
etiquette. Wikimedia's edge rate-limiter (`x-envoy-ratelimited`) put this
session's shared network path into repeated cooldowns (30 s to 600 s
`Retry-After`) for a stretch during this fetch; downloads paused and
retried automatically rather than hammering the API, which is why the
archive set below is smaller than the 20-28 target — see the note at the
end of this file for what's still outstanding.

## Portraits

### greene.jpg
- **Title**: "Nathanael Greene" by Charles Willson Peale (1783)
- **Author**: Charles Willson Peale
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Nathanael_Greene_by_Charles_Willson_Peale.jpg
- **Notes**: 1920px standard thumbnail (original 2400x3000). Peale's best-known life portrait of Greene, painted 1783 — the portrait requested.

### cornwallis.jpg
- **Title**: "Charles, Second Earl and First Marquess Cornwallis" by Thomas Gainsborough (1783), Royal Collection RCIN 400748
- **Author**: Thomas Gainsborough
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Thomas_Gainsborough_(1727-88)_-_Charles,_Second_Earl_and_First_Marquess_Cornwallis_(1738-1805)_-_RCIN_400748_-_Royal_Collection.jpg
- **Notes**: Commons only hosts this photo at 635x768; downloaded at that native size (no larger standard thumbnail exists).

### tarleton.jpg
- **Title**: "Banastre Tarleton" by Sir Joshua Reynolds (1782)
- **Author**: Joshua Reynolds
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Banastre-Tarleton-by-Joshua-Reynolds.jpg
- **Notes**: 1920px standard thumbnail (original 2597x4226). National Gallery, London.

### otho_williams.jpg
- **Title**: "General Otho Holland Williams" — 1880s steel engraving "Engraved by J.B. Longacre from a Painting by C.W. Peale" (NYPL digital collection scan)
- **Author**: J.B. Longacre (engraver), after Charles Willson Peale
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:General_Otho_Holland_Williams_(NYPL_Hades-256684-EM15035).jpg
- **Notes**: 1920px standard thumbnail (original 3754x6000). No direct photo of the Peale original was found on Commons; this Longacre engraving after it was the best available.

### morgan.jpg
- **Title**: "Daniel Morgan" by Charles Willson Peale (c.1794)
- **Author**: Charles Willson Peale
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:DanielMorgan.jpeg
- **Notes**: Native file is small (703x858) — no higher-resolution scan of this Peale portrait was found on Commons.

### washington.jpg
- **Title**: "George Washington" by Charles Willson Peale (1776)
- **Author**: Charles Willson Peale
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:George_Washington_by_Peale_1776FXD.jpg
- **Notes**: 1920px standard thumbnail (original 2467x3000). "FXD" = a cleaned-up derivative of the original Commons scan.

### fox.jpg
- **Title**: "Charles James Fox" by Anton (Karl Anton) Hickel (1794)
- **Author**: Anton Hickel
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Charles_James_Fox_by_Karl_Anton_Hickel.jpg
- **Notes**: 1920px standard thumbnail (original 2400x2875). National Portrait Gallery, London.

## Cut-outs

### greene_full.png
- **Source painting**: same as greene.jpg (Peale, 1783)
- **Licence**: Public domain
- **Notes**: Background (oval frame + painted-black interior) removed with `rembg` (isnet-general-use ONNX model). A custom post-pass strips the near-black painted background still classed as "foreground" by the model, then keeps only the largest connected silhouette (drops the stray gold oval-frame fragments). Edges eroded ~1px + Gaussian-feathered, cropped to bounding box, resized to 1250px tall for the bio card.

### greene_head.png
- Same source and processing as greene_full.png, cropped/resized to 700px tall for a round portrait stake.

### cornwallis_head.png
- **Source painting**: same as cornwallis.jpg (Gainsborough, 1783)
- **Licence**: Public domain
- **Notes**: Background removed with `rembg` (isnet-general-use), 700px tall, feathered edges.

### williams_head.png
- **Source**: same as otho_williams.jpg (1880s Longacre engraving after Peale)
- **Licence**: Public domain
- **Notes**: The engraving has a smooth dark stippled-vignette background rather than a flat photo background, which `rembg` could not cleanly separate from the sitter. Instead, cropped tightly to the engraved plate and given a soft radial (oval) alpha fade to transparent at the edges, sized to 700px tall — reads cleanly as a round portrait stake.

### stewart_head.png — not created
- No portrait (painted, engraved, or photographed) of Lt. Col. Alexander Stewart (British 3rd Regiment / Eutaw Springs) was found on Wikimedia Commons; skipped per instructions. `marjoribanks` was skipped for the same reason (no portrait found).

## Flags

### us_flag_13star.png
- **Title**: "Flag of the United States (1777–1795)" (Betsy Ross style, 13 stars)
- **Author**: Jacobolus (SVG, Wikimedia Commons original work)
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Flag_of_the_United_States_(1777%E2%80%931795).svg
- **Notes**: Rendered from the Commons SVG at the standard 960px-wide thumbnail, resized locally to 600px wide PNG.

### gb_flag_1606.png
- **Title**: "Flag of Great Britain (1707–1800)" — the Union Flag before the 1801 St Patrick's saltire (King's Colours used through the Revolutionary War)
- **Author**: Hoshie (SVG, Wikimedia Commons original work)
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Flag_of_Great_Britain_(1707-1800).svg
- **Notes**: Rendered from the Commons SVG at the standard 960px-wide thumbnail, resized locally to 600px wide PNG.

## Archive paintings, engravings, maps, and photos

### guilford_mcbarron.jpg
- **Title**: "Battle of Guilford Courthouse, 15 March 1781"
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Battle_of_Guilford_Courthouse_15_March_1781.jpg
- **Notes**: 1920px standard thumbnail (original 1929x1383). U.S. Army-style battle painting of the 1st Maryland's stand.

### guilford_plan_1781.jpg
- **Title**: "Battle of Guildford, fought on the 15th of March 1781" (period battle plan, Library of Congress)
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Battle_of_Guildford,_fought_on_the_15th_of_March_1781._LOC_73691878.jpg
- **Notes**: 1920px standard thumbnail (original 3098x3508). Contemporary (Tarleton's-history-era) engraved troop-dispositions plan of Guilford Court House.

### camden_chappel.jpg
- **Title**: "Battle of Camden" — death of Baron de Kalb, after Alonzo Chappel
- **Author**: Alonzo Chappel
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Battle_of_Camden.jpg
- **Notes**: Native size 1523x1009 (no larger standard thumbnail). 19th-century engraving of Gates's defeat at Camden, Aug 1780.

### camden_plan_1780.jpg
- **Title**: "Plan of the battle fought near Camden, August 16th, 1780" (Library of Congress)
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Plan_of_the_battle_fought_near_Camden,_August_16th,_1780._LOC_gm71000640.jpg
- **Notes**: 1920px standard thumbnail (original much larger). Period troop-disposition map.

### hobkirks_hill_charge.jpg
- **Title**: "Hobkirk's Hill — American cavalry charge" (NYPL digital collection)
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Hobkirks-Hill-American-cavalry-charge-NYPL.jpg
- **Notes**: Native size 1452x900. 19th-century engraving of Washington's cavalry at Hobkirk's Hill, April 1781.

### hobkirks_hill_sketch.jpg
- **Title**: "Atlas of Battles of the American Revolution, Sheet 27 — Sketch of the Battle of Hobkirks Hill, near Camden, on the 25th April, 1781" (NARA)
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Atlas_of_Battles_of_the_American_Revolution,_Sheet_27-_Sketch_of_the_Battle_of_Hobkirks_Hill,_near_Camden._on_the_25th._April,_1781_-_NARA_-_102279734.jpg
- **Notes**: 1920px standard thumbnail. Period battle-plan sketch.

### cowpens_kemmelmeyer.jpg
- **Title**: "The Battle of Cowpens" by Frederick Kemmelmeyer (c.1809), Yale University Art Gallery (1944.106)
- **Author**: Frederick Kemmelmeyer
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Frederick_Kemmelmeyer_-_Battle_of_Cowpen_-_1944.106_-_Yale_University_Art_Gallery.jpg
- **Notes**: 1920px standard thumbnail (original 1920x1451, this is the full native resolution). Contemporary-era painting of William Washington's cavalry at Cowpens.

### cowpens_ranney.jpg
- **Title**: "The Battle of Cowpens" by William Ranney (1845)
- **Author**: William Ranney
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Cowpens.jpg
- **Notes**: Native size 1230x944 (no larger standard thumbnail). Depicts Colonel William Washington's cavalry saving Washington's own life at Cowpens.

### cowpens_wm_washington.jpg
- **Title**: "William Washington at the Battle of Cowpens" — engraving for Graham's Magazine, by S. H. Gimber
- **Author**: S. H. Gimber (engraver)
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:William_Washington_at_Battle_of_Cowpens.jpg
- **Notes**: Native size 1506x1019. 19th-century magazine engraving of the same cavalry duel.

### eutaw_springs_engraving.jpg
- **Title**: "Battle of Eutaw Springs" (NYPL digital collection)
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Battle_of_Eutaw_Springs_(NYPL_Hades-254180-478749).jpg
- **Notes**: Native size 1260x840 (below 1920, so downloaded at original size). Period/19th-century engraving of the battle, Sep 1781.

### valley_forge_trego.jpg
- **Title**: "The March to Valley Forge, December 19, 1777" by William B. T. Trego (1883)
- **Author**: William B. T. Trego
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:The_March_to_Valley_Forge,_December_19,_1777,_by_William_B._T._Trego.jpg
- **Notes**: 1920px standard thumbnail (original 2096x1101). Used for the barefoot-soldiers-in-snow beat in the winter-march section.

## Still outstanding

The following items from the brief were queued but had not finished
downloading when this pass ended — Wikimedia's edge rate-limiter
(`x-envoy-ratelimited`, `Retry-After` 30-600s) kept putting this session's
shared network path into repeated cooldowns. All titles below were already
verified on Commons (correct file, Public domain / CC BY / CC BY-SA
licence) via the API before the fetch stalled, so a follow-up pass can
retry the same filenames directly:

- `continental_infantry_ogden.jpg` — File:Infantry- Continental Army, 1779-1783, IV - H.A. Ogden ; lith. by G.H. Buek & Co., N.Y. LCCN92515475.jpg (Public domain)
- `yorktown_trumbull.jpg` — File:John Trumbull - The Surrender of Lord Cornwallis at Yorktown, October 19, 1781 - 1832.4 - Yale University Art Gallery.jpg (Public domain) — the Trumbull Yorktown surrender painting called out as a "must have"
- `greene_statue_dc.jpg` — File:Washington, D.C. - equestrian statue of Nathanael Greene (17112400526).jpg (CC BY 2.0, photographer: see Commons page)
- `greene_statue_capitol.jpg` — File:Flickr - USCapitol - Nathanael Greene Statue.jpg (Public domain)
- `greene_monument_savannah.jpg` — File:Savannah - Nathanael Greene Monument.jpg (CC BY 4.0)
- `guilford_battlefield_1.jpg` / `guilford_battlefield_2.jpg` — File:Guilford Courthouse National Military Park (...).jpg (Public domain, NPS)
- `eutaw_springs_battlefield.jpg` — File:Eutaw Springs Battlefield Park - general view with sign.JPG (CC BY 3.0)
- `southern_campaign_map.jpg` — File:The marches of Lord Cornwallis in the Southern Provinces... LOC 74692779.jpg (Public domain) — the Tarleton/Faden Southern-campaign map
- `greene_homestead.jpg` — File:Nathaniel Greene Homestead, Anthony (Coventry Town), R.I (68994).jpg (Public domain)
- `kentish_guards_armory.jpg` — File:Kentish Armory, front view, East Greenwich, Rhode Island.jpg (CC BY-SA 4.0)
- `george_iii.jpg` — File:Allan Ramsay - King George III - 66.21B - Indianapolis Museum of Art.jpg (Public domain)
- `kings_mountain.jpg` — File:Battle of King's Mountain (NYPL Hades-257500-EM15424).jpg (Public domain)
- `artillery_hancock_cannon.jpg` — File:Hancock Cannon.jpg (Public domain) — American Revolution-era cannon (a specifically "British" artillery photo/plate was not found on Commons)

A retry script (`wm.py`/`download_list5.py`, in the session's scratchpad)
that respects Wikimedia's `Retry-After` header was left running in the
background past the end of this pass and may have picked up some of these
before the session ended — check `greene/assets/media/` for any of the
above filenames before re-fetching.

## Files added by a concurrent process

Three files appeared in this folder during this pass that this pass did not
fetch itself (`yorktown_trumbull.jpg`, `greene_statue.jpg`,
`continental_army_ogden.jpg`) — almost certainly a parallel search/download
subagent working the same brief. They are included in `manifest.json` with
a best-effort description from viewing them (Trumbull's Yorktown surrender;
the Nathanael Greene equestrian statue, Stanton Park, Washington D.C.; an
Ogden Continental-infantry uniform plate), but this pass did not verify
their exact Commons file/licence/photographer, so their manifest `licence`
field flags them for a source check before publishing.

## Library of Congress downloads (main session; public domain)
- **yorktown_trumbull.jpg** — "Surrender of Lord Cornwallis at Yorktown Va. Oct. 19th. 1781", lithograph after John Trumbull (19th c.). LoC Prints & Photographs, https://www.loc.gov/pictures/item/2002695775/ — no known restrictions. Cropped to the image area.
- **continental_army_ogden.jpg** — H. A. Ogden, "Infantry: Continental Army, 1779-1783" (Uniform of the Army of the United States, 1888). https://www.loc.gov/pictures/item/92515475/ — public domain. Cropped.
- **greene_statue.jpg** — Nathanael Greene equestrian statue, Stanton Park, Washington, D.C. Photo by Carol M. Highsmith, https://www.loc.gov/pictures/item/2010641664/ — Highsmith dedicated her Archive to the public domain (credit requested).

## Added in the badge/archive pass (2026-10-27)
Fetched via Wikimedia Special:FilePath standard thumbnails with Retry-After backoff, and the LoC tile server. Heads cut with rembg (isnet-general-use) from the portraits below; each `<name>_head_flat.png` is the uncut square crop. Heads redone from existing sources: `williams_head.png` (from otho_williams.jpg, old file was an uncut crop), `tarleton_head.png`, `morgan_head.png`, `fox_head.png`.

### Badge portraits (public domain, all flat 18th/19th-c. paintings or engravings)
- `lee_head.png` / `lee_head_flat.png` — Henry "Light-Horse Harry" Lee III, painting by Gilbert Stuart (c.1800, Gilbert Stuart; Wikimedia file "General Henry Lee.jpg"). Public domain (artist d. 1828). https://commons.wikimedia.org/wiki/File:General_Henry_Lee.jpg
- `rawdon_head.png` / `rawdon_head_flat.png` — Francis Rawdon-Hastings, Earl of Moira (Lord Rawdon), portrait by Hugh Douglas Hamilton (late 18th c., NPG). Public domain. https://commons.wikimedia.org/wiki/File:Francis_Rawdon-Hastings,_1st_Marquess_of_Hastings_by_Hugh_Douglas_Hamilton.jpg  (painted later in life, not 1781)
- `william_washington_head.png` / `_flat.png` — Col. William Washington, 19th-c. steel engraving after Charles Willson Peale (NYPL). Public domain. https://commons.wikimedia.org/wiki/File:Col._Wm._Washington_(NYPL_NYPG96-F27-421361).jpg
- `sumter_head.png` / `_flat.png` — Maj. Gen. Thomas Sumter, engraving by W. C. Johnson after C. W. Peale (LoC LCCN 2002725158 / Commons "Major General Thomas Sumter, by W. C. Johnson after C. W. Peale.jpg"). Public domain. https://commons.wikimedia.org/wiki/File:Major_General_Thomas_Sumter,_by_W._C._Johnson_after_C._W._Peale.jpg  (Peale painted him in the 1790s, older than in 1780-81)
- `tarleton_head`, `morgan_head`, `fox_head`, `williams_head`: cut from tarleton.jpg, morgan.jpg, fox.jpg, otho_williams.jpg (licences above).
- Initials only (no authentic life portrait used): Alexander Stewart, John Marjoribanks, William Lee Davidson, Francis Marion (only later/imaginary likenesses).

### Archive stills
- `charleston_siege_chappel.jpg` — "Siege of Charleston", steel engraving from Alonzo Chappel's painting (19th c.), NYPL digital collection; mat cropped. Public domain. https://commons.wikimedia.org/wiki/File:Siege_of_Charleston_(NYPL_NYPG96-F27-421356).jpg
- `charleston_plan_desbarres.jpg` — detail of the siege-lines plan "Siege of Charleston 1780", J. F. W. Des Barres. Public domain, 643 px only (map detail). https://commons.wikimedia.org/wiki/File:Siege_of_Charleston_1780.jpg
- `carolinas_map_mouzon.jpg` — Henry Mouzon, "An Accurate Map of North and South Carolina with their Indian Frontiers" (Sayer & Bennett, 1775), Internet Archive/David Rumsey scan, 1920 px wide thumbnail, cropped to the map. Public domain. https://commons.wikimedia.org/wiki/File:An_Accurate_Map_Of_North_And_South_Carolina_With_Their_Indian_Frontiers,_Shewing_in_a_distinct_manner_all_the_Mountains_(IA_dr_an-accurate-map-of-north-and-south-carolina-with-their-indian-frontiers-sh-00124026).jpg
- `sc_map_faden.jpg` — William Faden, "A map of South Carolina and a part of Georgia" (1780), BnF scan. Public domain. https://commons.wikimedia.org/wiki/File:A_map_of_South_Carolina_and_a_part_of_Georgia_containing_the_whole_sea-coast,_all_the_islands,_inlets..._-_by_William_Faden..._-_btv1b53089730p.jpg
- `eutaw_springs_chappel_loc.jpg` — "Battle of Eutaw Springs", engraving after Alonzo Chappel (c.1859), LoC Prints & Photographs cph.3a48495 (https://www.loc.gov/pictures/item/2006679197/). Public domain (19th c.); only 640 px available.
- `eutaw_springs_loc_engraving.jpg` — "Battle of Eutaw Springs", 19th-c. engraving, LoC cph.3b03086 (https://www.loc.gov/pictures/item/2004674935/). Public domain; 640 px.
- `ninety_six_incident.jpg` — "An Incident in the defence of Ninety-six" (19th-c. book illustration). Public domain. https://commons.wikimedia.org/wiki/File:An_Incident_in_the_defence_of_Ninety-six.jpg
- `cowpens_kemmelmeyer.jpg`, `cowpens_ranney.jpg`, `cowpens_wm_washington.jpg` — copied from /home/user/battle-maps/greene/assets/media (credits above / in that folder's CREDITS.md).
- Licence note: `guilford_mcbarron.jpg` is H. Charles McBarron's US Army (Center of Military History) painting; US-government commission, treated as public domain on Commons, but the exact Commons licence template was not re-checked here.
- Not found: British Foot Guards print (no usable PD image located), Fort Motte / Maham tower print (only a 610 px John Blake White painting "Mrs. Motte directing Generals Marion and Lee to burn her mansion", not downloaded).
