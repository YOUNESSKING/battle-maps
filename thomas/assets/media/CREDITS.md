# Media Credits — George H. Thomas video (Part A: portraits & flags)

Sources: Wikimedia Commons API (`commons.wikimedia.org/w/api.php`, standard
thumbnail widths 960/1280/1920px via `iiurlwidth`) and the Library of
Congress Prints & Photographs Division (`loc.gov` item JSON, `tile.loc.gov`
service-tier JPEGs ~640-1024px) — used for several figures after Commons'
`action=query` endpoint started rate-limiting this session's IP (429s); LoC
has no such limit and hosts the same Brady-era negatives directly. All
images below are Public domain (Civil War-era photographs/engravings, or
U.S. federal/LoC works) or Flickr Commons "No known restrictions" (treated
as public domain, per LoC's own rights statement). No NC/ND-licensed
material was used.

## Cut-outs (assets/media/) — background removed with `rembg` (isnet-general-use model), cropped to the figure, resized to target height

### thomas_full.png (~1250px tall, waist-up — no full-length standing photo of Thomas was found on Commons or LoC)
- **Title**: "George Henry Thomas" (Brady-Handy Collection)
- **Author**: Mathew Brady studio, c. 1855-1865
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:George_Henry_Thomas_-_Brady-Handy.jpg

### thomas_head.png (~700px tall)
- **Title**: "Gen. George H. Thomas" (different photo from thomas_full.png)
- **Author**: Unknown, c. 1860-1865; NARA copy
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Gen._George_H._Thomas_-_NARA_-_528908.jpg

### rosecrans_head.png (~700px tall)
- **Title**: "William S. Rosecrans" (Brady portrait, National Portrait Gallery)
- **Author**: Mathew Brady, 1861
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:William_S._Rosecrans_Brady_Portrait_1861.jpg
- **Notes**: Source is a full-length photo; cropped to the head-and-shoulders region (top ~46% of the segmented figure) so the face fills the frame like the other cut-outs.

### bragg_head.png (~700px tall)
- **Title**: "General Braxton Bragg, C.S.A."
- **Author**: Mississippi Department of Archives and History (Flickr Commons)
- **Licence**: No known copyright restrictions (Flickr Commons)
- **Source**: https://commons.wikimedia.org/wiki/File:General_Braxton_Bragg,_C.S.A._(9238294863).jpg
- **Notes**: Re-cropped tighter (alpha-threshold bounding box + small padding) to remove excess transparent margin.

### longstreet_head.png (~700px tall)
- **Title**: "General James Longstreet, C.S.A., head-and-shoulders portrait, facing slightly right"
- **Author**: Unknown, 1861; Library of Congress
- **Licence**: Public domain / no known restrictions
- **Source**: https://www.loc.gov/item/2004678556/ (downloaded via tile.loc.gov, 809x1024)
- **Notes**: Original CDV scan has a small face on a large light-grey mount; pre-cropped to the face region before background removal so the head fills the frame.

### grant_head.png (~700px tall)
- **Title**: "Portrait of Maj. Gen. Ulysses S. Grant, officer of the Federal Army"
- **Author**: Unknown, 1860s; Library of Congress (Civil War glass negative collection)
- **Licence**: Public domain / no known restrictions
- **Source**: https://www.loc.gov/item/2018666428/ (downloaded via tile.loc.gov, 672x1024)

### hood_head.png (~700px tall)
- **Title**: "Confederate General John Bell Hood" (sketch/engraved portrait)
- **Author**: Alfred R. Waud, 1862; Library of Congress
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Confederate_General_John_Bell_Hood_LCCN2004660558.jpg

### sherman_head.png (~700px tall)
- **Title**: "General William Sherman, head-and-shoulders portrait, facing right"
- **Author**: Popular Graphic Arts collection, 1865; Library of Congress
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:General_William_Sherman,_head-and-shoulders_portrait,_facing_right_LCCN90711519.jpg

### steedman_head.png (~700px tall)
- **Title**: "Portrait of Maj. Gen. James B. Steedman, officer of the Federal Army"
- **Author**: Unknown, 1860s; Library of Congress (Civil War glass negative collection)
- **Licence**: Public domain / no known restrictions
- **Source**: https://www.loc.gov/item/2018666494/ (downloaded via tile.loc.gov, 657x1024)
- **Notes**: Replaces an earlier attempt using the "Album Sketches of the Army of the Cumberland" oval lithograph (LCCN2013650007) — that sepia engraving's low-contrast tan background defeated both rembg and a colour-distance chroma key, leaving speckled non-transparent pixels, so a plain photographic Brady-type portrait was used instead for a clean cut-out.

### granger_head.png (~700px tall)
- **Title**: "Gen. Gordon Granger"
- **Author**: Unknown, c. 1860s; Library of Congress (Civil War glass negative collection)
- **Licence**: Public domain / no known restrictions
- **Source**: https://www.loc.gov/item/2018668630/ (downloaded via tile.loc.gov, 682x1024)

### schofield_head.png (~700px tall)
- **Title**: "John Schofield" (Brady-Handy Collection)
- **Author**: Mathew Brady studio, c. 1855-1865
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:John_Schofield_-_Brady-Handy.jpg

### wilson_head.png (~700px tall)
- **Title**: "Major General James Harrison Wilson ... in uniform" (published by E. & H.T. Anthony, from a Brady negative)
- **Author**: Mathew Brady studio (negative), E. & H.T. Anthony (print), 1861; Library of Congress
- **Licence**: Public domain / no known restrictions
- **Source**: https://www.loc.gov/item/2023632098/ (downloaded via tile.loc.gov, 665x1024)

### cleburne_head.png (~700px tall)
- **Title**: "Maj. General Patrick R. Cleburne, head-and-shoulders portrait, facing left"
- **Author**: Civil War Glass Negatives collection, c. 1860-1870; Library of Congress
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:Maj._General_Patrick_R._Cleburne,_head-and-shoulders_portrait,_facing_left_LCCN93503339.jpg

### wood_head.png (~700px tall)
- **Title**: "T.J. Wood" (Thomas J. Wood)
- **Author**: Civil War Glass Negatives collection, c. 1860-1870; Library of Congress
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:T.J._Wood_LOC_cwpb.05542.jpg

### garfield_head.png (~700px tall)
- **Title**: "General James Garfield" (Brady-Handy Collection, Civil War uniform)
- **Author**: Mathew Brady studio, c. 1855-1865
- **Licence**: Public domain
- **Source**: https://commons.wikimedia.org/wiki/File:General_James_Garfield_-_Brady-Handy.jpg

## Flags (~600px wide)

### us_flag_35star.png
- **Title**: "Flag of the United States (1863-1865)" (35-star flag, West Virginia admitted)
- **Licence**: Public domain (own SVG work, Commons)
- **Source**: https://commons.wikimedia.org/wiki/File:Flag_of_the_United_States_(1863-1865).svg
- **Notes**: Rendered from the Commons SVG at the standard 960px-wide thumbnail (via `Special:FilePath`), then resized locally to 600px wide.

### csa_battle_flag.png
- **Title**: "Battle flag of the Confederate States of America" (Army of Northern Virginia battle flag, square pattern)
- **Licence**: Public domain (own SVG work, Commons)
- **Source**: https://commons.wikimedia.org/wiki/File:Battle_flag_of_the_Confederate_States_of_America.svg
- **Notes**: Rendered from the Commons SVG at the standard 960px-wide thumbnail (via `Special:FilePath`), then resized locally to 600px wide.

## Notes on method

- No full-length standing/seated photograph of George H. Thomas was found on Commons or LoC (only head-and-shoulders/waist-up Brady-type studio portraits exist for him, unlike some contemporaries); `thomas_full.png` therefore uses the well-known Brady-Handy waist-up portrait, per the brief's "waist-up is acceptable if no full-length exists."
- All cut-out backgrounds removed with `rembg` (isnet-general-use ONNX model), auto-cropped to content bounding box, resized with Lanczos resampling.
- All photographs used are flat 2D photographs or prints (not photos of 3D objects), so photographer/collection credit follows the LoC/Commons attribution as given; none required a separate "photo of a 3D object" credit for Part A.
