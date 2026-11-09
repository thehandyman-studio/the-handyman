# STATUS – THE HANDYMAN (bisher mrABSURDLY / Mystery & Strange Stories)

## AKTUELL (2026-11-09): 5 Skript-Entwürfe für neue Folgen (Claude im Browser)
- Auf dem Branch `claude/focused-shannon-bbosod`: `shorts/prison-break/`, `bank-vault/`, `moon-crack/`, `pyramid-elevator/`, `volcano-plug/`, jeweils nur `SCRIPT.md`
- Übersicht: `docs/EPISODES.md` → „Skript-Entwürfe“
- Nichts gerendert, keine Stimme, kein Ton, keine Kosten
- **„The Leaking Volcano“ (`shorts/volcano-plug/`) Skript v4 freigegeben** (2026-11-09). Auftrag für den Mac: `shorts/volcano-plug/MAC_PROMPT.md` (zuerst Drachen-Figur entwerfen, dann Bild ohne Stimme)
- Die anderen vier Skripte bleiben Entwürfe
- **Nächster Schritt:** auf dem Mac Branch holen und `MAC_PROMPT.md` ausführen

## Vorher (2026-11-06, abends): Projekt auf die Marke THE HANDYMAN umgestellt
- **Kanal:** THE HANDYMAN · Slogan-Empfehlung: „Every job hides a mystery.“ (`docs/HANDYMAN_BRAND.md`)
- **Hauptfigur jeder Folge:** The Handyman = Leo in Arbeitskleidung, wie im Pilot. Verbindlich und gesperrt: `docs/HANDYMAN_CHARACTER_BIBLE.md`, im Code `HANDYMAN` in `src/engine/castbible.ts` (nur ergänzt; Pilot-Code unverändert).
- **Gültige Dokumente:**
  - `CLAUDE.md` (zentrale Anweisung)
  - `docs/HANDYMAN_STANDARD.md`
  - `docs/PRODUCTION_WORKFLOW.md`
  - `docs/EPISODES.md`
  - `docs/CLAUDE_BROWSER_SETUP.md`
  - `.claude/skills/the-handyman-short/SKILL.md`
  - Die Dokumente `docs/mrABSURDLY_*` und `docs/PRODUCTION_WORKFLOW_mrABSURDLY.md` sind Archiv.
- **Episode 1 (Pilot):** „The City Hidden Inside a Wall“, fertig: `out/city-in-the-wall/CityWall_FINAL_1440x2560.mp4`. Unverändert, nichts neu gerendert.
- **Neue Werkzeuge** (lokal, kostenlos, getestet):
  - `scripts/voice/natural_master.py`: Standard-Stimmklang V3; reproduziert die freigegebene V3 bitgenau
  - `scripts/estimate_words.py`: Wortzeiten vorab schätzen; im Pilot max. 0,6 s Abweichung zur echten Aufnahme
  - `scripts/check-setup.sh`: Werkzeug-Prüfung
  - `requirements.txt`
- **Git / GitHub:**
  - `.gitignore` erweitert: keine Schlüssel, keine Renderings und großen Audiodateien, kein Referenzmaterial
  - noch **kein Commit, kein Remote, kein Push**; jeder Schritt braucht Adrians Zustimmung
  - Claude im Browser ist **nicht** eingerichtet oder getestet
- **Nächster Schritt:** Adrian entscheidet über Slogan, GitHub-Repository und ersten Commit. Danach Thema für Episode 2.

---
(Ab hier: Verlauf vor der Umstellung)


Stand: 2026-11-05 (abends, nach final_v1) · Branch `integrate-cartoon-template` · letzter Commit `36a8c9e` (viele Änderungen seitdem noch **nicht** committet)
Hinweis: Diese Datei wurde aus dem geprüften Projektstand erstellt (der STATUS-Entwurf aus der Nebenfrage war in
dieser Sitzung nicht sichtbar). Sie wird bei jeder größeren Etappe und vor Sitzungsende aktualisiert.

## NEU ab 2026-11-06: Kanal mrABSURDLY (hat Vorrang vor „Mystery“ unten)
- Ausrichtung: ungewöhnliche, spannende, teils absurde Geschichten (wahr oder erfunden), **40–65 s**.
- Verbindlich: `docs/mrABSURDLY_STANDARD.md` · Bestandsaufnahme und Plan: `docs/mrABSURDLY_PLAN.md` (freigegeben am 2026-11-06).
- Entscheidungen 2026-11-06:
  - Figuren Option A (gezeichnete Figuren, menschlicher: ca. 5 Köpfe hoch, Hände, Augenbrauen, Frisuren, mehr Mimik und Gesten; keine 3D-Menschen)
  - freie OFL-Schrift für Untertitel erlaubt, Untertitel bei ca. 76 %
  - nur ein Referenzvideo
  - Skill-Anleitung aktualisiert (Sicherung `~/.claude/skills/_backup/…`, `CHANGELOG.md`)
- Referenzanalyse: `references/ricks-clips/analysis/` (Whisper lokal: 3,69 Wörter/s, Sätze im Mittel 14 Wörter, kaum Pausen, ≈ 3 s je Bild, 0 harte Schnitte). Nur privat.
- Werkzeug: whisper.cpp (Homebrew) + Modell `~/whisper-models/ggml-medium.en.bin` (kostenlos, lokal).

**Fortschritt (Reihenfolge laut Freigabe)**
1. ✅ Standard-Dokumente: `docs/mrABSURDLY_STANDARD.md`, `templates/SCRIPT_TEMPLATE.md`, `templates/story.template.json`
2. ✅ Kostenloser Stimmtest aus der Mary-Celeste-Aufnahme: `voice-lab/2026-11-06_mrabsurdly-voice/` (Varianten A–D) → **Variante C gewählt**: Profil `scripts/voice/profiles/mrabsurdly_john.json` (Tempo ×1,10) + `shorts_master.py --max-pause=0.18`; kostenlos geprüft (48,0 s statt 47,9 s im Test). Mary-Celeste-Master unverändert.
3. ✅ Figuren (Option A): `src/engine/human.ts`, `src/engine/castbible.ts`, `docs/CAST_BIBLE.md`; `toon.ts` nur ergänzt (exports, neue Ausdrücke), `people.ts` ergänzt (`Person.human`). Test: `FigureSheet` + `FigureScene` → `out/figure-test/v2/`. Mary Celeste rendert unverändert (PSNR 43–44 dB). → **Figuren freigegeben am 2026-11-06**
4. ⏳ Erste Geschichte „The City Hidden Inside a Wall“: Skript + Szenenplan in `shorts/city-in-the-wall/` (SCRIPT.md, SCENE_PLAN.md) Entscheidungen 2026-11-06: Ende A (rekursiv, bildgleicher Loop), Handwerker = Leo, Test ohne Aufnahme (Schätzzeiten), „his wall“ bleibt, Comic-Einblendungen sparsam.
5. ✅ Animationsstruktur: `src/engine/shots.ts` (Einstellungen an Wörtern, Kamera-Bausteine, glide/whip/flash/xfade), `acting.ts` (Regie pro Wort), `overlays.tsx` (✗/KNOCK/Zahlen), `crowd.ts` (Tausende Figuren), `fonts.ts` (Nunito, OFL); `human.ts` + Rückansicht/Latzhose/Hammer/Blick nach oben; `Captions.tsx` mit Option (76 %, Nunito). Mary Celeste unverändert.
6. ✅ Visueller Test Bilder 1–9: `out/city-in-the-wall/CityWall_test_shots1-9_v1.mp4`, Bericht `shorts/city-in-the-wall/TEST_v1.md`. Rückmeldung: Kamera/Komposition gut, Stadt zu sehr „Computerspiel“.
7. ✅ Look-Test v2 (nicht freigegeben): `CityLookTest`, Vorschlag `shorts/city-in-the-wall/LOOK_PROPOSAL.md`, Vergleich `out/city-in-the-wall/VERGLEICH_alt_oben_neu_unten.jpg`, Video `out/city-in-the-wall/CityWall_LOOKTEST_v2.mp4` → von Adrian als visueller Standard der Folge angenommen.
8. ✅ Look v3: Verschattung/Schmutzkanten, Lichtstrahlen + Staub, Fensterschimmer, kräftigeres Leuchten, Sitzende + Fenster-Figuren, Schärfeverlagerung. Video `out/city-in-the-wall/CityWall_LOOKTEST_v3.mp4`, Vergleich `out/city-in-the-wall/VERGLEICH_v2_oben_v3_unten.jpg` → von Adrian als visueller Standard freigegeben.
9. ✅ **Vollständige Bildproduktion v1** (ohne Ton): `out/city-in-the-wall/CityWall_full_picture_v2.mp4` (46,8 s, 24 Szenen / 30 Einstellungen, nahtloser Loop), Bericht `shorts/city-in-the-wall/PRODUCTION_REPORT_v1.md`, Übersicht `out/city-in-the-wall/qa_full_v2/overview.jpg`, Tonvorbereitung `shorts/city-in-the-wall/story.json` → **wartet auf Adrians Prüfung**; danach Entscheidung über die Aufnahme (≈ 420 Credits) (`shots.ts`, `acting.ts`, `overlays.ts`)
7. ⏳ (erledigt durch 6) (mit vorhandener John-Aufnahme, ohne neue Kosten)
8. ⏳ volle Produktion (braucht Freigabe der Aufnahme ≈ 420 Credits) → `docs/WORKFLOW.md`

## Ziel
~30 YouTube Shorts pro Monat · 55–70 s · 1440 × 2560 · 30 fps · MP4 · amerikanisches Englisch · Mystery /
unglaubliche Geschichten · Cinematic 3D Cartoon · Stimme **John** · große weiße Wort-für-Wort-Untertitel · Musik + SFX.
Ziel langfristig 30–90 min aktive Arbeit pro Short. **Keine Veröffentlichung ohne Freigabe.** Kostenpflichtige
API-Aufrufe nur nach Rückfrage.

## Verbindliche Stimme
- ElevenLabs **John – Conversational** `OEHTkiHZj6OczWZHu0Aj`, Modell `eleven_v4`
- Profil `scripts/voice/profiles/john_shorts_fast.json` (Stability 0,2 · Similarity 0,75), Sprechtext beginnt mit
  `[energetic, fast-paced]`, Betonung per GROSSSCHRIFT
- Audiobearbeitung `scripts/voice/shorts_master.py` (Hochpass 70 Hz, +1,5 dB @ 3 kHz, De-Esser, Kompression 2:1,
  −15 LUFS, ≤ −1 dBTP). Pausenkürzung bei Mary Celeste **aus** (`--max-pause 0.5`), weil 0,18 s das Video unter 55 s
  gebracht hätte.
- Kosten: ca. 0,44 Credits pro Zeichen (Mary Celeste komplett: 412 Credits)
- Frühere Teststimmen (Wyman, Young Storyteller, Buster) bleiben erhalten, werden nicht verwendet.

## Produktionsprozess (fertig)
| Schritt | Werkzeug |
|---|---|
| Skript + Faktenprüfung | `shorts/<name>/SCRIPT.md`, `voice/narration.txt` (nur gesprochener Text) |
| Szenen + Ton-Cues | `shorts/<name>/story.json` (Szenenanfänge, Überblendungen, Musikabschnitte, SFX – alles als **Wörter**) |
| Sprachausgabe John | `npm run voice -- <name> --profile=john_shorts_fast --spoken=<datei> --take=<take> [--confirm]` |
| Wortzeiten + Prüfung | automatisch (Verfahren 1 → `words_snapped.json`), Master: `shorts_master.py` → `words_master.json` |
| Bild | `src/engine/` (Bildkette, Untertitel, Zeitachse, Kamera, Meer/Himmel, Schiff, Licht, Figuren, Kulissen) + `src/videos/<name>/` |
| Musik + SFX + Mix | `.venv/bin/python scripts/audio/shortmix.py shorts/<name>` (≈ 8 s) → `audio/mix.wav`, −14 LUFS |
| Standbilder | `node scripts/stills.mjs <CompId> out/<name>/x/f <frames> 0.5` |
| Render mit Ton | `node scripts/render-short.mjs <CompId> shorts/<name> out/<name>/<datei>.mp4` (≈ 1 min, Skalierung 4/3) |
| Qualitätskontrolle | `.venv/bin/python scripts/short_qa.py <mp4> <outdir> <shots.json>` |
Für Remotion-Läufe `REMOTION_TMP` auf einen Arbeitsordner setzen (Bundles sind groß).

## Mary Celeste (erstes Produktionsvideo)
**Fertig**
- `SCRIPT.md` mit Faktenprüfung (Quellen Q1–Q6), Korrektur „But the lifeboat was gone.“
- John-Aufnahme `voice/takes/john_prod_v1/` (55,28 s, 156 Wörter, geprüft), `voice_master.wav` + `words_master.json`
- `SCENE_PLAN.md` v2 (Zeitplan auf John umgestellt, 56,2 s)
- `story.json`, Musik + SFX + Mix (`audio/mix.wav`, −14,0 LUFS, −1,3 dBTP)
- **Rohschnitt v1** `out/mary-celeste/roughcut_v1.mp4` (1440 × 2560, 30 fps, 56,2 s) – QA bestanden (keine
  schwarzen/weißen/eingefrorenen Frames, Ton ok)

**Fertig – Durchgang 2 (freigegeben am 2026-11-05): `out/mary-celeste/mary-celeste_final_v1.mp4`**
- QA (`out/mary-celeste/qa_final_v1/report.md`): 1440 × 2560, 30 fps, 1686 Frames, 56,2 s, −14,0 LUFS, −1,3 dBFS,
  keine schwarzen/weißen/eingefrorenen Frames. Alle „Sprünge“ in der QA-Liste sind geplante Schnitte oder Untertitelwechsel.
- Stimme, Musik, SFX, Untertitel unverändert (kein neuer ElevenLabs-Aufruf, `audio/mix.wav` unverändert).
1. Figuren: Briggs, Sarah, Sophia + sieben Matrosen an Deck (Szene 5, New York), verblassen auf „gone“ (6),
   zwei Ausguckleute der Dei Gratia, einer zeigt erschrocken (3) – `src/videos/mary-celeste/cast.ts`
2. Innenräume: Vorratsraum (Säcke, Fässer, Wasser), Laderaum mit Fassreihen und Wasser am Boden (7),
   Kapitänskajüte (8) mit neu modelliertem Säbel (Scheide mit Messingbeschlägen, Bügel, Knauf), unleserliche Logbuchtafel (10)
3. Seekarte ohne Text mit Azoren und Kurslinie (3c), Hafen New York mit Pier und Backsteinhäusern (5)
4. Hypothese (11): kühles Blau deutlich heller (Helligkeit 0,40 statt 0,16), Jolle mit zehn Silhouetten rudert in den Nebel
5. Kameras: Kollisionen mit Deckhaus, Segeln, Großmast, Lichtschacht behoben; Gesichter über der Untertitelzone
6. Platzhalter ersetzt; Lichtschächte im Laderaum abgeschwächt (überstrahlten das Bild)
- Engine-Fehler behoben: Figuren auf gedrehten Booten/Schiffen standen seitlich zur Kamera (`src/engine/people.ts`);
  `Sky.setVisible()` für Innenräume. Hinweis: Phrasen in `TL.at()` treffen das **erste** Vorkommen – bei häufigen
  Wörtern (`were`, `no`) die Nummer angeben, z. B. `at("Were", 2)`.

**Offen / Entscheidungen**
- Untertitel verschwinden in Pausen ab 0,25 s (vorläufig von Claude gesetzt; SKILL.md nennt 0,6 s)
- Untertitel-Schrift: Systemschrift „Arial Rounded MT Bold“ (SKILL.md empfiehlt eine eingebettete OFL-Schrift)
- Viele Änderungen noch ohne Git-Commit (nur nach Freigabe committen)
- `references/STYLE_BIBLE.md` enthält noch „no captions“ (SKILL.md hat Vorrang)

## Nächster konkreter Schritt
Adrian sieht sich `out/mary-celeste/mary-celeste_final_v1.mp4` an und gibt Rückmeldung bzw. Freigabe.
Danach (nach Freigabe): Git-Commit des Stands, dann das zweite Video mit derselben Vorlage.

## Sicherungspunkte
Git-Tags: `checkpoint-before-template`, `checkpoint-before-voice-workflow`. Der Rohschnitt-Code ist noch nicht committet
(Sicherungen einzelner Dateien liegen in `scripts/voice/_backup/` und `shorts/mary-celeste/_backup/`).

## City in the Wall – Stand 2026-11-06 (abends)
- Visuelle Überarbeitung fertig: `out/city-in-the-wall/CityWall_full_picture_v4.mp4`, Bericht `shorts/city-in-the-wall/REVISION_REPORT_v1.md`, Übersicht `out/city-in-the-wall/qa_full_v4/overview.jpg`
- Loop unverändert (nahtlos, 54–58 dB gegen die freigegebene v2), Mary Celeste unverändert
- Wartet auf Adrians Rückmeldung. Keine Aufnahme, kein Ton, keine Commits.
- Ältere Ausgaben hat Adrian nach `~/Downloads/Video Produktion/` verschoben
- Nachbesserung 2: `out/city-in-the-wall/CityWall_full_picture_v5.mp4` (Stadt im Loch in 2/10/13/20 sichtbar, Schild-Zeitpunkt), Bericht `shorts/city-in-the-wall/REVISION_REPORT_v2.md`. Wartet auf Rückmeldung.
- **FREIGEGEBEN 2026-11-06:** `out/city-in-the-wall/CityWall_full_picture_v5.mp4` ist die visuelle Grundlage (Revision 2: Stadt im Loch in 2/10/13/20, Schild erst bei erhobenen Armen). Bild, Loop und Mary Celeste nicht mehr ändern.
- Nächster Schritt: Sprachaufnahme vorbereiten, siehe `shorts/city-in-the-wall/VOICE_AUDIO_READINESS.md`. Die Aufnahme kostet ca. 380–420 Credits und braucht Adrians ausdrückliche Freigabe.
- **Sprachaufnahme erstellt (2026-11-06, freigegeben):** `shorts/city-in-the-wall/voice/takes/john_mrab_v1/voice_master.wav` (45,5 s, 396 Credits), Wortzeiten `words_master.json`, Bericht `TAKE_REPORT.md`. Bild noch auf geschätzten Zeiten. Video mit Ton noch nicht gerendert, wartet auf Adrians Abnahme der Stimme.
- **Sprachfassung gewählt (2026-11-06): V3** = `shorts/city-in-the-wall/voice/takes/john_mrab_v1_V3/` (bitgenaue Kopie von voice-lab V3_atempo.wav, Wortzeiten geprüft ≤ ½ Bild). Soundplan `shorts/city-in-the-wall/SOUND_PLAN.md` wartet auf Freigabe. Vor der Mischung muss das Bild auf die V3-Wortzeiten umgestellt werden (45,83 s, 1375 Bilder), auch das nur mit Freigabe.
- **Vorschau mit Ton v1 (2026-11-06):** `out/city-in-the-wall/CityWall_PREVIEW_v1_mit_Ton.mp4` (+ LOOP-3x), Bericht `shorts/city-in-the-wall/AUDIO_REPORT_v1.md`. Bild jetzt auf V3-Wortzeiten (1375 Bilder). Wartet auf Adrians Abnahme. Finale Fassung in 1440 × 2560 erst nach Freigabe (`node scripts/render-short.mjs CityWallShort shorts/city-in-the-wall out/city-in-the-wall/<name>.mp4`).

## City in the Wall – FINAL (2026-11-06)
- **Fertig und freigegeben:** `out/city-in-the-wall/CityWall_FINAL_1440x2560.mp4` (1440 × 2560, 30 fps, 45,83 s, −14 LUFS, Loop nahtlos). Prüfbericht: `shorts/city-in-the-wall/FINAL_QA.md`.
- **Ausgangsdateien, unverändert aufbewahrt:**
  - Stimme V3: `shorts/city-in-the-wall/voice/takes/john_mrab_v1_V3/`
  - Bild v5: `out/city-in-the-wall/CityWall_full_picture_v5.mp4`
  - Mix: `shorts/city-in-the-wall/audio/`
  - Vorschau: `out/city-in-the-wall/CityWall_PREVIEW_v1_mit_Ton.mp4`
- **Ablauf und Erkenntnisse für die nächsten Shorts:** `docs/PRODUCTION_WORKFLOW_mrABSURDLY.md`
- **Offen:** Git-Commit und Upload nur nach Adrians Freigabe.
