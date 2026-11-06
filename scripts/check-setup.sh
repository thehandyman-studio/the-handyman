#!/bin/zsh
# THE HANDYMAN: checks that every LOCAL tool for production is present (read-only, installs nothing, no network).
cd "$(dirname "$0")/.." || exit 1
ok=0
chk() { if eval "$2" >/dev/null 2>&1; then printf "  OK    %s\n" "$1"; else printf "  FEHLT %s  -> %s\n" "$1" "$3"; ok=1; fi; }
echo "THE HANDYMAN – Werkzeuge"
chk "Node.js"                 "node -v"                                   "https://nodejs.org (>= 20.19)"
chk "npm-Pakete (node_modules)" "test -d node_modules/remotion"           "npm ci"
chk "@react-three/postprocessing 3.0.4" "grep -q '\"version\": \"3.0.4\"' node_modules/@react-three/postprocessing/package.json" "npm ci (Version ist gepinnt)"
chk "ffmpeg"                  "ffmpeg -version"                           "brew install ffmpeg"
chk "Rubber Band (alte Stimmkette, Mary Celeste)" "rubberband --version"  "brew install rubberband"
chk "whisper.cpp (whisper-cli)" "command -v whisper-cli"                  "brew install whisper-cpp"
chk "Whisper-Modell medium.en" "test -f $HOME/whisper-models/ggml-medium.en.bin" "Modell nach ~/whisper-models/ legen"
chk "Python .venv"            "test -x .venv/bin/python"                  "python3 -m venv .venv && .venv/bin/pip install -r requirements.txt"
chk "numpy / scipy / pillow"  ".venv/bin/python -c 'import numpy, scipy, PIL'" ".venv/bin/pip install -r requirements.txt"
chk "ElevenLabs-Schlüssel (.env, nur lokal)" "grep -q '^ELEVENLABS_API_KEY=' .env" ".env mit ELEVENLABS_API_KEY=… anlegen (nie committen)"
chk ".env von Git ignoriert"  "git check-ignore -q .env"                  ".gitignore prüfen"
exit $ok
