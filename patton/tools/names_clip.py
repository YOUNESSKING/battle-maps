"""20 s names clip for the owner (tts/PRONUNCIATION.md). Run from /home/user/battle-maps/tts."""
import sys, numpy as np, soundfile as sf
sys.path.insert(0, "/home/user/battle-maps/patton/tools")
from kokoro_onnx import Kokoro
from tts_names import speak
k = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
S = ["George Patton turned north to relieve Bastogne, where Anthony McAuliffe said Nuts.",
     "At Verdun, Eisenhower and Bradley heard him, and Kluge fell back from Mortain.",
     "The road ran through Avranches and Pontaubault, over the Sée and the Sélune, to Le Mans, Alençon and Argentan.",
     "Chaumont and Assenois lay north of Arlon, beyond the Schnee Eifel and the Meuse.",
     "At Nierstein and Oppenheim the boats crossed the Rhine, and Hausser and Felber watched from Grossgerau.",
     "Remagen, Mantes, Falaise, Metz and the Moselle."]
ch=[]
for t in S:
    a,sr=speak(k,t,"am_michael",1.0); ch+=[a,np.zeros(int(sr*0.5),dtype=a.dtype)]
sf.write("/home/user/battle-maps/patton/audio/names_clip.wav",np.concatenate(ch),sr)
