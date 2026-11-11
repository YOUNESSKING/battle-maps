# Yorktown 1781 image credits

All items from Wikimedia Commons (https://commons.wikimedia.org/wiki/File:<name>), licence as shown on the Commons file page (checked via the Commons API listing). Flat PD paintings/engravings; no AI images. Sources saved in `src/`, crops `<key>_head.png` (rembg isnet-general-use cut-out), `<key>_head_flat.png` (600x600 RGB crop).

## Portraits (TASK 1)
| key | Commons file | Work / author / date (per Commons title, not independently re-verified) | Licence | Credit line |
|---|---|---|---|---|
| washington | George Washington at Princeton by Charles Willson Peale.jpg | C. W. Peale, Washington at Princeton, 1779 (face of the 1779-84 Peale type) | Public domain | Charles Willson Peale, via Wikimedia Commons |
| rochambeau | Charles Willson Peale, Comte de Rochambeau.jpg | C. W. Peale (low res 515x580) | Public domain | C. W. Peale, via Wikimedia Commons |
| lafayette | Marquis de Lafayette 2.jpg | Peale-type 1779-80 uniform portrait (attribution not checked on file page) | Public domain | via Wikimedia Commons |
| hamilton | John Trumbull - Alexander Hamilton - Google Art Project.jpg | John Trumbull, 1806 | Public domain | John Trumbull, via Wikimedia Commons / Google Art Project |
| laurens | Charles Willson Peale - John Laurens - Google Art Project.jpg | C. W. Peale, miniature c.1780 | Public domain | C. W. Peale, via Wikimedia Commons |
| lincoln | Benjamin Lincoln by Charles Willson Peale.jpg | C. W. Peale, 1784 | Public domain | C. W. Peale, via Wikimedia Commons |
| knox | Henry Knox by Peale.jpg | C. W. Peale, c.1784 | Public domain | C. W. Peale, via Wikimedia Commons |
| lauzun | Général ARMAND LOUIS DE GONTAUT DE BIRON (1747-1793).jpg | Unknown painter, 1790s; profile, 1792-93 general's uniform (Lauzun = Biron). Substitute for a frontal 1780s likeness | Public domain | via Wikimedia Commons |
| nelson | Thomas Nelson (1700s).jpg | Engraving "etched by H. B. Hall from a drawing" (19th c. print); not a painting | Public domain | via Wikimedia Commons |
| cornwallis | Thomas Gainsborough (1727-88) - Charles, Second Earl and First Marquess Cornwallis (1738-1805) - RCIN 400748 - Royal Collection.jpg | Thomas Gainsborough, 1783 (Royal Collection) | Public domain | Thomas Gainsborough, via Wikimedia Commons |
| clinton | Sirhenryclinton2.jpg | Portrait of Sir Henry Clinton as a young man (looks c.1762 Soldi type; NOT 1781 age). Better 1780s print `Sir Henry Clinton, K.B LCCN2001697134.jpg` queued, not yet downloaded | Public domain | via Wikimedia Commons |
| graves | Admiral Lord Graves, 1st Baron Graves of Gravesend, by Thomas Gainsborough.jpg | Thomas Gainsborough | Public domain | Thomas Gainsborough, via Wikimedia Commons |
| tarleton | Banastre-Tarleton-by-Joshua-Reynolds.jpg | Joshua Reynolds, 1782 | Public domain | Joshua Reynolds, via Wikimedia Commons |
| ohara | Charles O'Hara c. 1791-1792.png | Miniature/painting c.1791-92 (177x219, very low res; identity from file title) | Public domain | via Wikimedia Commons |
| degrasse | MISSING | planned: Comte de Grasse par Mauzaisse J Baptiste.jpg (PD, Versailles) | | |
| barras | MISSING | no PD portrait of Jacques-Melchior de Barras found on Commons (results are his cousin Paul Barras: do NOT use) | | |
| hood | MISSING | planned: Admiral Sir Samuel Hood, 1st Viscount Hood (1724-1816) RMG RP6255.jpg (PD) | | |

## Archive (TASK 3), saved in `../archive/`
| key | status | Commons file | Work | Licence | Points of interest [fx, fy] |
|---|---|---|---|---|---|
| trumbull_surrender | OK 1920x1266 | Surrender of Lord Cornwallis.jpg | John Trumbull, Surrender of Lord Cornwallis, 1820 (Capitol Rotunda) | PD | [0.55,0.5] O'Hara and Lincoln centre; [0.80,0.3] US flag; [0.10,0.35] British line |
| capes_battle | OK 1920x1205 | BattleOfVirginiaCapes.jpg | Modern marine painting (looks like V. Zveg, US Navy art, 1962) | Commons says PD (US Navy work; verify author on file page) | [0.30,0.45] British van; [0.78,0.4] French line |
| couder_siege | PENDING | Couder Yorktown Versailles.JPG (also Bataille de Yorktown by Auguste Couder.jpg) | A. Couder, Siege of Yorktown, 1836, Versailles | PD (both files) | |
| redoubt10 | PENDING | EL Lami - Storming of redoubt 10 during the Siege of Yorktown (1840).jpg | Eugene Lami, 1840 | PD | |
| blarenberghe_siege | PENDING | Louis Nicolas van Blarenberghe - The siege of Yorktown (1781).jpg (948x607 only) | Van Blarenberghe, Versailles | PD | |
| blarenberghe_surrender | PENDING | The Surrender of Yorktown by Louis-Nicolas Van Blarenberghe.jpg (800x363) | Van Blarenberghe | PD | |
| peale_washington_yorktown | PENDING | Washington, Lafayette & Tilghman at Yorktown.jpg | C. W. Peale, 1784 | PD | |
| bauman_map | PENDING | To His Excellency Genl. Washington ... investment of York and Gloucester ..., LOC gm71002180.jpg | Sebastian Bauman, 1782 (LOC) | PD | |
| french_chesapeake_map | PENDING (substitute) | A Plan of the entrance of Chesapeak (sic) Bay, with James and York Rivers ... LOC gm71000687.jpg | 1781-82 plan (LOC; British Army/French positions, October 1781) | PD | |
| charleston_1780 | PENDING | Siege of Charleston (NYPL NYPG96-F27-421356).jpg | engraving, NYPL | PD | |
| nelson_house | PENDING | Nelson House and Main Street, Yorktown, Virginia-LCCN2008679622.jpg | LOC photo | PD | |
| moore_house | PENDING | Moore House Yorktown VA.JPG | photo, 3840x2160 | CC BY-SA 3.0 (credit author from Commons page) | |

Pending rows were blocked by Wikimedia 429 (Retry-After 600 s, repeated). Re-run `bash /tmp/claude-0/-home-user-battle-maps/764f817d-e5db-5db1-83f8-b39183cdb213/scratchpad/batch6.sh` when throttle clears (honours Retry-After), then `python3 .../crop.py degrasse hood` / `cut.py`.
Library of Congress (loc.gov) returned a Cloudflare challenge (429); not bypassed. LOC items go through Commons copies.

## Flags
`fr_royal_flag.png` drawn with PIL (own work, CC0), 600x316, white field with gold fleurs-de-lis. `flags_preview.png` compares the three flags.
