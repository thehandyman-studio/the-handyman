# CLAUDE.md – THE HANDYMAN (YouTube Shorts)

Zentrale Anweisung für Claude: lokal in Claude Code auf Adrians Mac und in Claude im Browser.

## Projekt in einem Satz
Vertikale 3D-Cartoon-Shorts (9:16, 40–65 s, Englisch) für den Kanal **THE HANDYMAN**: In jeder Folge stößt **The Handyman** bei einem Auftrag auf etwas Mysteriöses, Absurdes oder Unerklärliches. Gerendert wird mit Remotion + three.js, gesprochen von John (ElevenLabs), der Ton wird lokal synthetisiert.

## Mit wem du arbeitest
- **Adrian** schreibt Deutsch und hat **keine Programmiererfahrung**.
- Antworte auf Deutsch: einfach, kurz, ohne Fachjargon.
- Ziel des Workflows: Adrian gibt ein Thema vor, prüft die Vorschau und gibt das fertige Video frei. Den Rest machst du selbstständig.
- Vor großen Umbauten kurz den Plan vorlegen. Freigaben gelten nur für das, wofür sie gegeben wurden.

## Harte Regeln (nie ohne Adrians ausdrückliche Zustimmung)
1. **Keine kostenpflichtigen Aufrufe.** ElevenLabs nur nach Freigabe der Kosten. Die Vorschau ohne `--confirm` ist kostenlos.
2. **Keine Commits, Pushes, Uploads, Veröffentlichungen.** Uploads auf YouTube macht nur Adrian.
3. **Keine neuen Pakete, keine Paket-Updates, keine externen Downloads.** `@react-three/postprocessing` bleibt **3.0.4**, sonst entstehen leere Bilder.
4. **Fertige Produktionen nie verändern oder neu rendern:**
   - Mary Celeste: `shorts/mary-celeste/`, `src/videos/mary-celeste/`
   - Episode 1 „The City Hidden Inside a Wall“: `shorts/city-in-the-wall/`, `src/videos/city-in-the-wall/`, `out/city-in-the-wall/*FINAL*`
   - Gemeinsamen Code (`src/engine/`, `scripts/audio/shortmix.py`, `sfx_gen.py`) nur **ergänzend** ändern, mit gleichem Ergebnis für alte Folgen. Danach mit Standbild und PSNR gegen die Referenz prüfen.
5. **The Handyman nicht verändern:** Die gesperrten Merkmale stehen in `docs/HANDYMAN_CHARACTER_BIBLE.md`. Im Code immer `HANDYMAN`, `HANDYMAN_SEED` und `HANDYMAN_HUMAN` aus `src/engine/castbible.ts` nehmen.
6. **Keine Schlüssel in Dateien oder Git.** Der ElevenLabs-Schlüssel steht nur in `.env` auf dem Mac (wird von Git ignoriert).
7. **Nichts löschen,** was Adrian nicht ausdrücklich freigibt. Vor dem Ändern sichern: `<ordner>/_backup/<datum>_<grund>/`.
8. **Keine fremden Inhalte:** Referenzmaterial in `references/` ist private Studie. Nie veröffentlichen oder kopieren.

## Verbindliche Dokumente (in dieser Reihenfolge lesen)
- `docs/HANDYMAN_BRAND.md`: Marke, Slogan, Erzählformel
- `docs/HANDYMAN_CHARACTER_BIBLE.md`: The Handyman, gesperrte Merkmale
- `docs/HANDYMAN_STANDARD.md`: Format, Skript, Stimme, Bild, Untertitel, Ton
- `docs/PRODUCTION_WORKFLOW.md`: Schritte, was im Browser und was auf dem Mac läuft, Checkliste, Erkenntnisse
- `docs/CAST_BIBLE.md`: Nebenfiguren
- `docs/EPISODES.md`: Episodenliste
- `STATUS.md`: aktueller Stand
- Vorlagen: `templates/SCRIPT_TEMPLATE.md`, `templates/story.template.json`
- **Musterfolge:** `src/videos/city-in-the-wall/` und `shorts/city-in-the-wall/`. Neue Folgen danach aufbauen, aber die Muster-Dateien nicht ändern.

## Wo was liegt
| Ordner | Inhalt |
|---|---|
| `src/engine/` | gemeinsame Engine: Shell/Post-Kette, Untertitel, Einstellungen (`shots.ts`), Schauspiel (`acting.ts`), Figuren (`human.ts`, `castbible.ts`, `people.ts`), Menge |
| `src/videos/<name>/` | Bild-Code je Folge; Kompositionen in `src/Root.tsx` |
| `shorts/<name>/` | Skript, Pläne, Stimme (`voice/`), Ton (`audio/`), Berichte |
| `scripts/` | Render (`render-short.mjs`, `stills.mjs`), Prüfungen (`pace_report.py`, `short_qa.py`), Stimme (`voice/`), Ton (`audio/`) |
| `out/` | Renderings, nicht in Git |
| `voice-lab/` | Stimm-Experimente |

## Befehle (Mac, Projektordner)
```sh
scripts/check-setup.sh                                        # alle lokalen Werkzeuge da?
export REMOTION_TMP=<scratch>/rtmp                            # immer setzen
python3 scripts/estimate_words.py shorts/<n>/voice/narration.txt shorts/<n>/voice/estimate/words_estimated.json
node scripts/stills.mjs <Comp> out/<n>/stills/s_ 120,450,900 0.35        # Standbilder
npx remotion render src/index.ts <Comp> out/<n>/<n>_picture_vX.mp4 --codec h264 --crf 18 --gl=angle
LC_ALL=C .venv/bin/python scripts/pace_report.py src/videos/<n>/story.ts <words.json> <video.mp4> out/<n>/qa --total <frames>
.venv/bin/python scripts/short_qa.py <video.mp4> out/<n>/qa out/<n>/qa/shots.json
.venv/bin/python scripts/voice/generate_voice.py <n> --profile mrabsurdly_john --spoken narration_john.txt --take <take>   # Vorschau, kostenlos
#   ... --confirm  ← KOSTET Credits, nur nach Freigabe
.venv/bin/python scripts/voice/process_voice.py <n> --profile mrabsurdly_john --spoken narration_john.txt --take <take>
.venv/bin/python scripts/voice/natural_master.py <n> --take <take> --out <take>_V3     # Standard-Stimmklang
.venv/bin/python scripts/audio/<episode>mix.py shorts/<n>                                # eigener Mix je Folge
node scripts/render-short.mjs <Comp> shorts/<n> out/<n>/<Name>_FINAL_1440x2560.mp4      # Finale mit Ton
```
Das Stimmprofil heißt aus historischen Gründen `mrabsurdly_john.json`. Es ist das gültige THE-HANDYMAN-Profil. Nicht umbenennen: alte Aufnahmen verweisen darauf.

## Bekannte Fallen
- **Kommentare in Codezeilen:** Ein `// Kommentar` mitten in einer per Skript bearbeiteten Zeile schaltet den Rest ab. Kommentare nur ans Zeilenende.
- **zsh:** `"$var:r…"` wird als Modifikator gelesen, deshalb `${var}` schreiben.
- **Prüfen:** Jede Kamera mit Standbildern prüfen (keine Wände im Bild, Gesichter über dem Untertitelband). Haltephasen immer mit `push`.
- **Wortzeiten:** `TL.at("wort")` trifft das erste Vorkommen. Bei häufigen Wörtern `nth` angeben.
- **Weitere Fallen:** `docs/PRODUCTION_WORKFLOW.md` (Abschnitt „Erkenntnisse aus dem Pilot“).

## Claude im Browser
Nur Lesen, Schreiben, Planen und Code. **Kein Rendern, keine Stimme, kein Ton-Mix:** Das ist dort nicht eingerichtet und nicht getestet. Einzelheiten: `docs/CLAUDE_BROWSER_SETUP.md`. Im Browser erstellte Änderungen gehören auf einen eigenen Branch. Der Mac holt sie und führt die 💻-Schritte aus.
