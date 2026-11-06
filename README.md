# THE HANDYMAN – YouTube Shorts

*Every job hides a mystery.*

Vertikale 3D-Cartoon-Shorts (9:16, 40–65 s, Englisch) mit der wiederkehrenden Hauptfigur **The Handyman**. Gebaut mit Remotion und three.js; Stimme von John (ElevenLabs); Musik und Geräusche werden lokal synthetisiert.

- **Für Claude:** `CLAUDE.md` (zentrale Anweisung) und `.claude/skills/the-handyman-short/SKILL.md`
- **Marke, Figur, Standard, Ablauf:**
  - `docs/HANDYMAN_BRAND.md`
  - `docs/HANDYMAN_CHARACTER_BIBLE.md`
  - `docs/HANDYMAN_STANDARD.md`
  - `docs/PRODUCTION_WORKFLOW.md`
- **Episoden:** `docs/EPISODES.md` · Stand: `STATUS.md`
- **GitHub / Claude im Browser:** `docs/CLAUDE_BROWSER_SETUP.md`

## Einrichtung auf einem Mac
```sh
npm ci                                   # Node-Pakete (Versionen gepinnt, postprocessing 3.0.4)
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
brew install ffmpeg rubberband whisper-cpp   # + Whisper-Modell medium.en nach ~/whisper-models/
echo 'ELEVENLABS_API_KEY=…' > .env       # nur lokal, wird von Git ignoriert
scripts/check-setup.sh                   # prüft alles
npm run dev                              # Remotion Studio (Vorschau im Browser)
```

Remotion-Lizenz: Für manche Firmen ist eine Firmenlizenz nötig, siehe https://github.com/remotion-dev/remotion/blob/main/LICENSE.md
