"""20 s names clip for the owner (tts/PRONUNCIATION.md). Run from /home/user/battle-maps/tts."""
import sys, numpy as np, soundfile as sf
sys.path.insert(0, "/home/user/battle-maps/cleburne/tools")
from kokoro_onnx import Kokoro
from tts_names import speak
k = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
S = ["Patrick Cleburne held Ringgold Gap after Chickamauga.",
     "Chetoogeta Mountain and Catoosa County lie nearby.",
     "Peter Osterhaus attacked, and Hiram Granbury and Daniel Govan fired back.",
     "Frederick Knefler, Greenberry Raum and Colonel Matthies also fell at Pickett's Mill.",
     "Hardee, Lowrey, Hazen, Goldthwaite, Creighton and Bierce."]
ch=[]
for t in S:
    a,sr=speak(k,t,"am_michael",1.0); ch+=[a,np.zeros(int(sr*0.5),dtype=a.dtype)]
sf.write("/home/user/battle-maps/cleburne/audio/names_clip.wav",np.concatenate(ch),sr)
