"""One command for the whole narration step of a short:

    npm run voice -- <short>                    # preview (no credits); processes an existing take
    npm run voice -- <short> --confirm          # generate with ElevenLabs (credits), then post-process
    npm run voice -- <short> --confirm --new    # new take (old one archived), then post-process
    npm run voice -- <short> --force            # re-process even if words.json was hand-fixed (backed up)
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generate_voice  # noqa: E402
import process_voice  # noqa: E402
from common import voice_dir  # noqa: E402


def main():
    ap = argparse.ArgumentParser(description="ElevenLabs narration + post-processing for one short.")
    ap.add_argument("short")
    ap.add_argument("--confirm", action="store_true")
    ap.add_argument("--new", action="store_true")
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()

    g = [a.short] + (["--confirm"] if a.confirm else []) + (["--new"] if a.new else [])
    generate_voice.main(g)
    if not os.path.exists(os.path.join(voice_dir(a.short), "raw", "elevenlabs.mp3")):
        print("Noch keine Original-Aufnahme -> Nachbearbeitung uebersprungen.")
        return 0
    print("--- Nachbearbeitung (kostenlos) ---")
    return process_voice.main([a.short] + (["--force"] if a.force else []))


if __name__ == "__main__":
    sys.exit(main())
