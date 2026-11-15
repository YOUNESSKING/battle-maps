"""Contact sheet of gm_test.mp4: 16 frames (4 x 4) at the key beats, labelled with their time -> contact_sheet.jpg"""
import json, os, subprocess
import cv2, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); T = json.load(open(f"{HERE}/build/times.json"))
ts = [2.5, T["grant"] + 1.2, T["story"] + 2.5, T["dive"] + 0.9, T["pem"] + 1.5, T["crossing"] + 1.5, T["midm"] + 2.5, T["bburn"] + 1.5,
      T["pris"] + 1.6, T["six"] + 1.2, T["april"] + 1.5, T["drift"] + 1.0, T["p5"] + 1.0, T["three"] + 1.8, T["oneday2"] + 0.9, T["D"] - 0.3]
tiles = []
for t in ts:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", f"{HERE}/gm_test.mp4", "-frames:v", "1", "-vf", "scale=640:360", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], capture_output=True).stdout
    im = np.frombuffer(raw, np.uint8).reshape(360, 640, 3).copy()
    cv2.rectangle(im, (0, 0), (92, 30), (0, 0, 0), -1); cv2.putText(im, f"{t:5.1f}s", (6, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 1, cv2.LINE_AA)
    tiles.append(im)
rows = [np.hstack(tiles[i:i + 4]) for i in range(0, 16, 4)]
cv2.imwrite(f"{HERE}/contact_sheet.jpg", np.vstack(rows), [cv2.IMWRITE_JPEG_QUALITY, 88])
print("wrote contact_sheet.jpg")
