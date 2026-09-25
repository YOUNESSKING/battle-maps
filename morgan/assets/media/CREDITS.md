# Media Credits — Daniel Morgan video

All images below were sourced from Wikimedia Commons via the API
(`commons.wikimedia.org/w/api.php`), using standard thumbnail widths
(960/1280/1920px). Public domain works are either flat 18th/19th-century
paintings/engravings/prints, or U.S. federal works; the one CC0 item is a
museum photo of a medal (3D object), used under its CC0 licence.

## Archive stills (archive/aNN.jpg)

### a01.jpg — Banastre Tarleton
- **Title**: "Banastre Tarleton" (portrait)
- **Author**: Sir Joshua Reynolds, 1782
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Banastre-Tarleton-by-Joshua-Reynolds.jpg

### a02.jpg — The Battle of Cowpens
- **Title**: "The Battle of Cowpens"
- **Author**: William Ranney, 1845
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Cowpens.jpg
- **Notes**: Native resolution is 1230x944 (no larger scan available on Commons); used at full native size.

### a03.jpg — General John Burgoyne
- **Title**: "General John Burgoyne"
- **Author**: Sir Joshua Reynolds, c. 1766
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:General_John_Burgoyne_-_Reynolds_c._1766.jpg

### a04.jpg — Surrender of General Burgoyne
- **Title**: "Surrender of General Burgoyne" (U.S. Capitol Rotunda)
- **Author**: John Trumbull, 1821
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Surrender_of_General_Burgoyne.jpg

### a05.jpg — Daniel Morgan
- **Title**: "Morgan, Daniel (full length)"
- **Author**: Unknown (18th/19th-century engraving, National Archives copy)
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Morgan,_Daniel_(full_length)_-_NARA_-_532870.jpg

### a06.jpg — Winter encampment
- **Title**: "The March to Valley Forge, December 19, 1777"
- **Author**: William B. T. Trego, 1883
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:The_March_to_Valley_Forge,_December_19,_1777,_by_William_B._T._Trego.jpg
- **Notes**: A dedicated PD night-campfire scene of Continental soldiers could not be found on Commons; this well-known Valley Forge winter-encampment painting (explicitly allowed as a fallback by the brief) was used instead.

### a07.jpg — Daniel Morgan Congressional Gold Medal
- **Title**: "Medal of General Daniel Morgan" (Comitia Americana medal)
- **Author**: Augustin Dupré (engraver), c. 1789; photo: The Metropolitan Museum of Art
- **Licence**: CC0
- **Source**: https://commons.wikimedia.org/wiki/File:Medal_of_General_Daniel_Morgan_MET_LC-83_2_398-001.jpg
- **Notes**: Photo of a 3D medal; used under the museum's CC0 release, per the "photos of 3D objects must be CC-licensed" rule.

### a08.jpg — Nathanael Greene
- **Title**: "Nathanael Greene"
- **Author**: Charles Willson Peale, 1783
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Nathanael_Greene_by_Charles_Willson_Peale.jpg

### a09.jpg — Manuscript letter
- **Title**: "Letter to Gen. Nathaniel Greene, reporting that Gen. Lawson is marching to Hillsboro and that British have turned south" (manuscript, page 1)
- **Author**: Friedrich Wilhelm von Steuben (writer) to Nathanael Greene (recipient); Boston Public Library, American Revolutionary War Manuscripts Collection
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Letter_to_Gen._Nathaniel_Greene,_reporting_that_Gen._Lawson_is_marching_to_Hillsboro_and_that_British_have_turned_south_(manuscript)_(IA_lettertogennatha00steu).pdf
- **Notes**: No Morgan- or Greene-authored PD manuscript image was found on Commons, so a different 1781 Revolutionary War-era manuscript letter addressed to Greene was used instead (page-1 thumbnail of the PDF, 960px). Downloaded at the standard 960px PDF-thumbnail width.

### a10.jpg — Surrender of Lord Cornwallis
- **Title**: "Surrender of Lord Cornwallis" (U.S. Capitol Rotunda)
- **Author**: John Trumbull, 1820 (placed 1826)
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Surrender_of_Lord_Cornwallis.jpg

### a11.jpg — The Battle of Cowpens (Kemmelmeyer)
- **Title**: "Battle of Cowpen" [sic]
- **Author**: Frederick Kemmelmeyer, 1809; Yale University Art Gallery
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Frederick_Kemmelmeyer_-_Battle_of_Cowpen_-_1944.106_-_Yale_University_Art_Gallery.jpg
- **Notes**: A different Cowpens painting from a02.jpg (Ranney), per the brief's "use a different image where a slot repeats a subject."

## Cut-outs (assets/media/)

All cut-outs: background removed with `rembg` (isnet-general-use model),
edges cleaned with a slight alpha erosion + Gaussian feather, cropped
tightly to the figure/head, and resized to the target height.

### morgan_full.png (~1250px tall)
- Source: same as a05.jpg (see above), Unknown author, Public domain.
- https://commons.wikimedia.org/wiki/File:Morgan,_Daniel_(full_length)_-_NARA_-_532870.jpg
- Notes: engraving on a light background; rembg's mask left a faint halo (grayscale figure vs. light paper), cleaned up with an additional alpha-curve pass before cropping.

### morgan_head.png (~700px tall)
- **Title**: "DanielMorgan" (round-crop bust portrait)
- **Author**: Charles Willson Peale, c. 1794
- **Licence**: Public domain
- https://commons.wikimedia.org/wiki/File:DanielMorgan.jpeg

### tarleton_head.png (~700px tall)
- Source: cropped version of the Reynolds Tarleton portrait, Public domain.
- https://commons.wikimedia.org/wiki/File:Banastre-Tarleton-by-Joshua-Reynolds_(cropped).jpg

### burgoyne_head.png (~700px tall)
- Source: full Reynolds Burgoyne portrait (a03.jpg), head/shoulders region cropped locally before background removal (the Commons "(cropped)" derivative of this file turned out to be a crop of the painting's background battle vignette, not the face, so it was not used).
- https://commons.wikimedia.org/wiki/File:General_John_Burgoyne_-_Reynolds_c._1766.jpg

### gates_head.png (~700px tall)
- **Title**: "Horatio Gates"
- **Author**: James Peale, 1782; National Portrait Gallery
- **Licence**: Public domain
- https://commons.wikimedia.org/wiki/File:James_Peale_-_Horatio_Gates_-_NPG.69.50_-_National_Portrait_Gallery.jpg

### greene_head.png (~700px tall)
- Source: same as a08.jpg, Charles Willson Peale, 1783, Public domain.
- https://commons.wikimedia.org/wiki/File:Nathanael_Greene_by_Charles_Willson_Peale.jpg

### cornwallis_head.png (~700px tall)
- **Title**: "Charles Cornwallis (1738–1805), Lord Brome, 1st Marquis Cornwallis"
- **Author**: Joshua Reynolds; Port Eliot collection
- **Licence**: Public domain
- https://commons.wikimedia.org/wiki/File:Joshua_Reynolds_(1723-1792)_-_Charles_Cornwallis_(1738%E2%80%931805),_Lord_Brome,_1st_Marquis_Cornwallis_-_A17_-_Port_Eliot.jpg

### howard_head.png (~700px tall)
- **Title**: "Johneagerhoward" (John Eager Howard)
- **Author**: uncredited on Commons
- **Licence**: Public domain
- https://commons.wikimedia.org/wiki/File:Johneagerhoward.jpg
- Notes: small source (366x450); upscaled with Lanczos resampling to reach 700px tall.

### pickens_head.png (~700px tall)
- **Title**: "Andrew Pickens" (portrait)
- **Author**: Thomas Sully
- **Licence**: Public domain
- https://commons.wikimedia.org/wiki/File:AndrewPickensByThomasSully.jpg
- Notes: small, low-contrast source (469x600); upscaled 3x before running rembg with alpha matting to get a usable mask. Some soft edge halo remains around the hair/shoulders.

### us_flag_13star.png (~600px wide)
- **Title**: "Flag of the United States (1777–1795)" (13-star, Betsy Ross pattern)
- **Author**: Jacobolus (Commons SVG)
- **Licence**: Public domain
- https://commons.wikimedia.org/wiki/File:Flag_of_the_United_States_(1777%E2%80%931795).svg
- Notes: rendered from the Commons SVG at the standard 960px-wide thumbnail, downloaded as-is (960px; not resized further).

### gb_flag_1707.png (~600px wide)
- **Title**: "Flag of Great Britain (1707–1800)" (no St Patrick's saltire)
- **Author**: Hoshie (Commons SVG)
- **Licence**: Public domain
- https://commons.wikimedia.org/wiki/File:Flag_of_Great_Britain_(1707%E2%80%931800).svg
- Notes: rendered from the Commons SVG at the standard 960px-wide thumbnail, downloaded as-is (960px; not resized further).

## Gaps / not sourced

- **fraser_head.png** (Simon Fraser, 1729–1777): skipped. The only Commons candidate, "British School – General Simon (possibly General Simon Fraser of Balnain, 1729–1777)", carries an explicit "possibly" attribution and risks confusion with the unrelated Simon Fraser of Lovat, so it was not used as a confirmed likeness of Burgoyne's Simon Fraser.
- **washington_w_head.png** (William Washington): skipped. No clean PD head/shoulders portrait of William Washington was found on Commons; the only period image, an 1830s NARA copy print of "Colonel (William Augustine) Washington at the Battle of Cowpens," is a busy multi-figure cavalry-action engraving, not a bust portrait, and did not crop cleanly to a round-stake head.
