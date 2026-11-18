import numpy as np, cv2, json
from skimage.graph import route_through_array
E=np.load('/home/user/battle-maps/grant/assets/src/vicksburg_hd_elev.npy')
x0,y0,x1,y1=1000,300,1420,1140
c=E[y0*2:y1*2,x0*2:x1*2].astype(np.float32)
m=cv2.blur(c,(5,5));sd=np.sqrt(np.maximum(cv2.blur(c*c,(5,5))-m*m,0))
w=((sd<0.1)&(c<30)).astype(np.uint8)
w=cv2.morphologyEx(w,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
d=cv2.distanceTransform(w,cv2.DIST_L2,5)
cost=np.where(w>0,1.0/(1+d)**1.5,40.0).astype(np.float64)+0.002
def tr(a,b):
    P,_=route_through_array(cost,(int((a[1]-y0)*2),int((a[0]-x0)*2)),(int((b[1]-y0)*2),int((b[0]-x0)*2)),fully_connected=True,geometric=True)
    P=np.array(P,np.float32)[:,::-1]/2+[x0,y0]
    return P[::6].tolist()+[P[-1].tolist()]
segN=tr((1190,322),(1296,676))
segE=tr((1296,676),(1350,690))
RIV63=[(1350,690),(1355.5,685.5),(1360.5,678.5),(1365.5,671.5),(1371,665.5),(1377,661.0),(1382,661.5),(1384.2,665.5),(1381.5,671.5),(1378.5,680),(1375.5,690.5),(1370.5,701.0),(1364.8,710.5)]
segM=tr((1364.8,710.5),(1297,806))
DAVIS=[(1297,806),(1284,811),(1262,806),(1240,798),(1220,796),(1198,800),(1181,811),(1171,829),(1170,851),(1179,866),(1198,872),(1214,868)]
segS=tr((1214,868),(1224.0,891.5))
GG=[(1224.0,891.5),(1235.8,921.5),(1242.8,946.5),(1235.8,969.0),(1215.2,989.0),(1187.8,1005.2),(1166.5,1025.2),(1154.0,1049.0),(1145.2,1071.5),(1132.8,1090.2),(1105.2,1106.5),(1072.8,1119.0),(1050.2,1139.0)]
pts=segN[:-1]+segE[:-1]+[list(p) for p in RIV63]+segM[1:-1]+[list(p) for p in DAVIS]+segS[1:-1]+[list(p) for p in GG]
json.dump({"name":"Mississippi River (1863 course)","note":"upstream first, map units. North of Milliken's Bend and Vicksburg-Warrenton: modern channel traced on the DEM (flat water). Young's Point - De Soto Point: the modern channel down to the neck, then the 1863 loop (cut off 26 Apr 1876 across the ~4000 ft neck 2 mi east of Grant's Canal, NPS marker 32.3210N 90.9330W = map (1343.6,705.8)) NE along the west side of the point to the hairpin under Fort Hill and S along the city front (now the Yazoo diversion canal); the state line follows it. Davis Bend loop (cut off 1867) traced on the old channel scar (approx.). Grand Gulf - Bruinsburg: grant m2d GGRIV (modern = 1863 there).","pts":[[round(a,1),round(b,1)] for a,b in pts]},open('/home/user/battle-maps/vicksburg/worlds/configs/_mississippi1863.json','w'))
img=(np.dstack([np.clip((c-12)/40,0,1)]*3)*200).astype(np.uint8); img[w>0]=(200,120,40)
P=((np.array(pts)-[x0,y0])*2).astype(np.int32); cv2.polylines(img,[P],False,(0,0,255),3)
cv2.imwrite('/tmp/vx_bake/miss_trace.jpg',cv2.resize(img,None,fx=0.45,fy=0.45))
print(len(pts))
# ---- merge with the research agent's 1863 channel at Vicksburg (vicksburg/data/geo.json): Milliken's Bend -> De Soto Point hairpin -> Warrenton,
#      joined to the Davis Bend entry (geo.json is the authority there; the trace above covers the rest)
import sys; sys.path.insert(0, "/home/user/battle-maps/vicksburg/tools"); from gm_look import catmull
F = '/home/user/battle-maps/vicksburg/worlds/configs/_mississippi1863.json'
P = np.array(json.load(open(F))['pts'])
J = json.load(open('/home/user/battle-maps/vicksburg/data/geo.json'))
g = np.array([r for r in J['rivers'] if r['name'].startswith('Mississippi, 1863')][0]['pts'], np.float32)
i0 = int(np.hypot(*(P - g[0]).T).argmin()); i1 = int(np.hypot(*(P - [1297, 806]).T).argmin())
G = catmull(np.vstack([g, [[1335, 796], [1312, 803]], P[i1:i1 + 1]]), 1.0)
pts = np.vstack([P[:i0], G, P[i1 + 1:]])
json.dump(dict(name="Mississippi River (1863 course)", note="upstream first, map units. Milliken's Bend - Warrenton: vicksburg/data/geo.json 'Mississippi, 1863 channel at Vicksburg (De Soto Point hairpin)' (research agent: Grant's Memoirs ch.XXXII + DEM old channels; cut off across the neck in 1876), Catmull-Rom resampled, joined to the Davis Bend entry. North of Milliken's Bend and Davis Bend - Hard Times: the modern channel traced on the DEM (flat water). Davis Bend loop (cut off 1867) traced on the old channel scar (approx.; the MS-LA state line follows it). Grand Gulf - Bruinsburg: grant m2d GGRIV (modern = 1863 there). Rebuild: python3 vicksburg/tools/trace_mississippi1863.py",
               pts=[[round(float(a), 1), round(float(b), 1)] for a, b in pts]), open(F, 'w'))
print("merged", len(pts))
