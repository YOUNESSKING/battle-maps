import sys, numpy as np, soundfile as sf
sys.path.insert(0, '/home/user/battle-maps/marion/tools')
from tts_names import speak
from kokoro_onnx import Kokoro
k = Kokoro('/home/user/battle-maps/tts/kokoro-v1.0.onnx', '/home/user/battle-maps/tts/voices-v1.0.bin')
lines = ["Francis Marion rode between the Santee and the Pee Dee.",
 "Colonel Hugh Horry blocked the road at Horse Creek, near the Great Savannah and Nelson's Ferry.",
 "Major James Wemyss burned the country from Kingstree to the Pee Dee.",
 "Black Mingo. Tearcoat Swamp. Benbow's Ferry. Ox Swamp. Jack's Creek. Snow's Island.",
 "Banastre Tarleton, Lord Cornwallis, Lord Rawdon, and Nathanael Greene.",
 "Hezekiah Maham built a tower at Fort Watson. Rebecca Motte gave up her house at Fort Motte.",
 "Parker's Ferry, on the Edisto. Eutaw Springs. Andrew Pickens.",
 "Scarce an inhabitant between the Santee and Pedee."]
out = []
for l in lines:
    a, sr = speak(k, l, 'am_michael', 1.0); out += [a, np.zeros(int(sr * 0.5), dtype=a.dtype)]
sf.write('/home/user/battle-maps/marion/build/names/names_clip.wav', np.concatenate(out), sr)
