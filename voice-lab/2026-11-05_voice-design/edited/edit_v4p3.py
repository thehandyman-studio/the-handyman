"""Local edit of variant 4 / preview 3 (no API, no credits). The source MP3 is only read, never changed.

    .venv/bin/python voice-lab/2026-11-05_voice-design/edited/edit_v4p3.py

1. decode MP3 -> 24-bit WAV (44.1 kHz mono, as delivered)
2. Rubber Band R3 (fine) with formant preservation: pitch +0.4 semitones, tempo/length unchanged
3. gentle EQ: high-pass 70 Hz, -1 dB at 220 Hz (less boom), +1.5 dB at 3 kHz (presence/clarity); no compression,
   no high shelf (keeps it from getting thin or sharp)
4. loudness matched to the source (EBU R128), true peak kept below -1 dBTP
Output: 4_preview3_pitch+0.4_eq.wav next to this script (never overwritten).
"""
import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(HERE), "previews", "4_warm_lively_conversational", "preview_3.mp3")
OUT = os.path.join(HERE, "4_preview3_pitch+0.4_eq.wav")
PITCH = 0.4
EQ = "highpass=f=70:poles=2,equalizer=f=220:t=q:w=1.0:g=-1.0,equalizer=f=3000:t=q:w=1.0:g=1.5"


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"{cmd[0]} fehlgeschlagen:\n{r.stderr[-600:]}")
    return r


def loud(path):
    s = run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
    s = s[s.rfind("Summary:"):]
    return float(s.split("I:")[1].split()[0]), float(s.split("Peak:")[1].split()[0])


def main():
    if os.path.exists(OUT):
        sys.exit(f"{OUT} existiert schon - nichts ueberschrieben.")
    with tempfile.TemporaryDirectory() as td:
        dec, sh, eq = (os.path.join(td, n) for n in ("dec.wav", "shifted.wav", "eq.wav"))
        run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", SRC, "-c:a", "pcm_s24le", dec])
        run(["rubberband", "-q", "-3", "-F", "-p", f"{PITCH:g}", dec, sh])
        run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", sh, "-af", EQ, "-c:a", "pcm_s24le", eq])
        i_src, _ = loud(dec)
        i_eq, tp_eq = loud(eq)
        gain = i_src - i_eq
        if tp_eq + gain > -1.0:                      # never push the peaks above -1 dBTP
            gain = -1.0 - tp_eq
        run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-n", "-i", eq, "-af", f"volume={gain:.3f}dB",
             "-c:a", "pcm_s24le", OUT])
        i_out, tp_out = loud(OUT)
        info = {"source": os.path.relpath(SRC, os.path.dirname(HERE)), "pitch_semitones": PITCH,
                "engine": "rubberband -3 -F (R3 fine, formants kept), tempo unchanged", "eq": EQ,
                "gain_db": round(gain, 2), "loudness_source_LUFS": i_src, "loudness_out_LUFS": i_out,
                "true_peak_out_dBTP": tp_out}
    json.dump(info, open(os.path.join(HERE, "4_preview3_pitch+0.4_eq.json"), "w"), indent=2)
    print(json.dumps(info, indent=1))


if __name__ == "__main__":
    main()
