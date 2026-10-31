# Tree crown source imagery (TREE REDESIGN TEST, owner 2026-10-31)

All imagery: **USGS The National Map, "USGS NAIP Plus" ImageServer** (NAIP + High Resolution Orthoimagery),
credit line "USGS, USDA, The National Map: Orthoimagery". USGS/USDA works are **U.S. Government public domain**
(the service description: "free downloads of public domain ... orthoimagery"). No pixels from the reference film are used.

Service: https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer
Each file = `exportImage?bbox=<lon0,lat0,lon1,lat1>&bboxSR=4326&imageSR=3857&size=W,H&format=png&f=image`

| file | place | bbox (WGS84 lon/lat) | size | use |
|---|---|---|---|---|
| hro_dc_epp_0.png | East Potomac Park golf course, Washington DC | -77.027500,38.872500,-77.024664,38.874708 | 2048² (~0.12 m/px export) | angle A sprites |
| hro_dc_epp_1.png | same | -77.024664,38.872500,-77.021829,38.874708 | 2048² | A |
| hro_dc_epp_2.png | same | -77.027500,38.870292,-77.024664,38.872500 | 2048² | A |
| hro_dc_epp_3.png | same | -77.024664,38.870292,-77.021829,38.872500 | 2048² | A |
| hro_dc_epp_4.png | same | -77.027500,38.868085,-77.024664,38.870292 | 2048² | A |
| hro_dc_epp_5.png | same | -77.024664,38.868085,-77.021829,38.870292 | 2048² | A |
| hro_dc_epp_6.png | same | -77.027500,38.865877,-77.024664,38.868085 | 2048² | A |
| hro_dc_epp_7.png | same | -77.024664,38.865877,-77.021829,38.868085 | 2048² | A |
| hro_dc_epp_8.png | same | -77.030336,38.870292,-77.027500,38.872500 | 2048² | A |
| hro_dc_epp_9.png | same | -77.030336,38.868085,-77.027500,38.870292 | 2048² | A |
| hro_dc_rockcreek.png | Rock Creek Park forest, Washington DC | -77.0500,38.9400,-77.0450,38.9440 (bilinear) | 1450² (~0.3 m/px) | angle C canopy texture |

Derived (by `cleburne/tools/make_tree_sprites.py`): `sprites_A.npz` (isolated crowns cut from the golf course),
`sprites_C.npz` (generated crown outlines filled with Rock Creek canopy windows), `*_sheet.jpg` contact sheets.
Licence: public domain (U.S. Government work).
