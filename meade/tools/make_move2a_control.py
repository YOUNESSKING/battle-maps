"""MOVE 2 agent: May 1863 control overlay on `penn` for the opening of move2a (before Lee marches north).
Same look as tools/make_penn_control.py (imported read-only): Union blue (110,160,255), Confederate red (232,52,52) + rim, multiply.
May 1863 (after Chancellorsville, before 2nd Winchester 13-15 Jun): Lee's army south of the Rappahannock (Fredericksburg - Culpeper);
Union = northern Virginia north of the Rappahannock and east of the Blue Ridge (Hooker at Falmouth, Aquia depot, Washington's
defences; Loudoun/Fauquier contested, drawn Union), the lower Shenandoah Valley north of Strasburg (Milroy at Winchester, Berryville,
Martinsburg), Harpers Ferry; the upper Valley (Strasburg/New Market south) Confederate. Northern Neck east of Fredericksburg left red
(not occupied). ~5 km accuracy. -> assets/media/move2a_ctl_may63_mx.png   usage (from meade/): python3 tools/make_move2a_control.py"""
import os, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_penn_control as PC, make_virginia_control as VC
NORTH_VA_MAY63 = [(38.40, -77.25), (38.30, -77.46), (38.40, -77.65), (38.48, -77.78), (38.53, -77.82), (38.62, -77.86), (38.70, -77.90),
                  (38.80, -78.05), (38.88, -78.15), (38.95, -78.30), (38.99, -78.40), (39.02, -78.60), (39.05, -79.00), (39.80, -79.00),
                  (39.80, -77.00), (38.60, -77.00)]
PC.DATES["may63"] = dict(inv=[], union_va=[NORTH_VA_MAY63, PC.WASH_DEF, PC.HARPERS, VC.NW_63, VC.EASTERN_SHORE, VC.NORFOLK, VC.LOWER_PEN, VC.GLOUCESTER])
land = np.array(Image.open("assets/penn_land.png").convert("L").resize((2880, 1620))) > 127
POT = PC.snap_potomac(); VA = list(VC.VIRGINIA); VA[18:18 + len(POT)] = POT[::-1]
va = PC.mask([VA], 2880, 1620)
PC.build("may63", land, va)
os.replace("assets/media/penn_ctl_may63_mx.png", "assets/media/move2a_ctl_may63_mx.png"); print("-> assets/media/move2a_ctl_may63_mx.png")
