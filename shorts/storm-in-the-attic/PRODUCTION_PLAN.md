# „The Storm Hiding in the Attic“ – Produktionsplan (Episode 2)

Stand: 2026-11-06 · **Skript v2 grundsätzlich freigegeben, Bild-Code umgesetzt und technisch geprüft** (Cloud). Noch keine Aufnahme, kein Ton, kein Mac-Rendering.
Gehört zu: `SCRIPT.md` (Skript + Szenenplan), `SOUND_PLAN.md` (Musik und Effekte).
Muster: Pilot `src/videos/city-in-the-wall/` und `shorts/city-in-the-wall/`. Diese Dateien werden nur **gelesen**, nie geändert.

---

## 1. Kurzfassung
| | |
|---|---|
| Titel | **The Storm Hiding in the Attic** |
| Ordnername | `storm-in-the-attic` |
| Komposition | `StormAtticShort` (Arbeitsgröße 1080 × 1920, 30 fps; Finale 1440 × 2560 über Skalierung 4/3) |
| Länge | ≈ 47,7 s (geschätzt, 1431 Bilder); endgültig = letztes Wort der Aufnahme + 0,7 s (der Loop-Tropfen braucht den Ausklang; Standard: max. 1 s) |
| Stimme | John, Profil `mrabsurdly_john`, Klang V3 (`natural_master.py`) |
| Kosten Stimme | **≈ 380–400 Credits** (868 Zeichen in `narration_john.txt` × 0,44; Pilot: 905 Zeichen = 396 Credits). Die kostenlose Vorschau zeigt als Obergrenze ≈ 868. |
| Neue Pakete | **keine** |
| Änderungen an Gemeinsamem | **keine** an `src/engine/`, `shortmix.py`, `sfx_gen.py`. Einzige Änderung an bestehender Datei: zwei Zeilen **dazu** in `src/Root.tsx` (Import + Komposition) |

---

## 2. Bildsprache und Welt

**Stil:** wie im Pilot. Gezeichnete Figuren in einer gemalten 3D-Welt, Tusche-Konturen, kräftige Farben, Unschärfe im Hintergrund bei CU/MS/INSERT, Nebel in Horizontfarbe. Keine 3D-Menschen.

### 2.1 Orte (alle neu gebaut, im Episodenordner)
| Ort | Datei | Inhalt | Licht |
|---|---|---|---|
| **Flur Whitlock** | `houseSet.ts` | Schmaler Flur mit Tapete (gemaltes Blumenmuster), Läufer, Standuhr, Abreißkalender „40“, gerahmtes Bild. Decke mit braunem Wasserfleck. **12 Eimer und Töpfe** in einer Reihe (verschiedene Farben). Klappleiter zur offenen Dachluke | warmes, staubiges Nachmittagslicht aus einem Seitenfenster |
| **Dachboden** | `atticSet.ts` | Schräges Dach mit Sparren (Bauweise wie `room()` aus `src/engine/sets.ts`, aber mit Dachschräge), Dielen, runde Dachfenster-Öffnung mit zwei Flügeln, alte Truhe, Schaukelpferd, Tuch über Möbeln. Pfütze unter der Wolke. Lichtstrahl über `shaft()` aus `sets.ts` | dunkel, kühl, ein Lichtstrahl; Blitzlicht bei 9 und 11; warm bei 16; Gegenlicht bei 17 |
| **Stadt (trocken)** | `townSet.ts` | 10–14 Häuser mit Satteldach und **rundem Dachfenster** in Reihen, Gärten mit gelbem Gras, rissige Erde, reglose Wäscheleine, Thermometer an einer Wand. Leerer, bleicher Himmel | grell, Mittagsgelb, harte Schatten; ab 20 kühler |
| **Himmel** | `skyEye.ts` | Himmelskuppel mit Verlauf; das **Auge**: gemalte Mandelform mit Tusche-Lidstrich und Wimpern, Iris in Sturmblau mit Blitzadern; außerhalb der Lider durchsichtig | bleich, dann kalt; letzte 5 Bilder Weiß (Loop) |

### 2.2 Die Wolke (`cloud.ts`)
- 7–9 weiche Kugeln, im Malstil schattiert (oben weiß, unten blaugrau), mit Tusche-Kontur. **Kein Gesicht.**
- Zustände über die Zeit (an Wörtern): ruhig → dunkel und aufgebläht („black“) → zuckende Blitze innen → zahm und kleiner („drifts“) → versteckt sich hinter der Schulter („won't leave“).
- Regen: 120 kurze Striche, die fallen und in der Pfütze Ringe machen. Stärke als Wert 0–1 je Bild; auf „The rain stops“ wird er 0.
- Blitz: gezackte Linie als leuchtendes Band (ohne Kontur), 4 Bilder sichtbar, dazu der weiße `Flash` aus `src/engine/overlays.tsx`.
- Regenbogen: kleiner Bogen aus 6 Farbbändern über der Hand, blendet in 10 Bildern ein.
- In der Stadt: dieselbe Wolke klein und vielfach in den Dachfenstern, jede mit eigener Zitterbewegung; Erscheinen als Welle von Fenster zu Fenster.

### 2.3 Figuren
- **The Handyman:** nur `HANDYMAN`, `HANDYMAN_SEED`, `HANDYMAN_HUMAN` aus `src/engine/castbible.ts`. Hammer rechts (`prop: "hammer"`, `propHand: 1`). Nichts nachgebaut, nichts verändert.
- **Mrs. Whitlock:** `CAST.rose` mit `CAST_SEED.rose` (Figurenbibel).
- Alle Gesten und Mimiken gibt es schon (`src/engine/human.ts`): `point_up`, `climb`, `fist_pump`/`hold_up`, `hold`, `present`, `scared`, `legs: "jump"`, `sweat`, `lookUp`, `lean`, `view: "back" | "side"`. **Kein Ausbau der Figur nötig.**

### 2.4 Kamera und Einstellungen
Die 22 Einstellungen stehen in `SCRIPT.md` §2. Umsetzung wie im Pilot mit `Shots` aus `src/engine/shots.ts`:
- Jede Einstellung startet auf einem **Wort** (`start`), 2 Bilder vor dem Wort.
- Haltephasen immer mit `push` (sonst meldet die QA „eingefroren“).
- Bewegungen: `crane` (3, 19, 22), `orbit` (7, 15), `track` (5), `punch`/`kick` auf Schlüsselwörtern („twelve“, „thunder“, „lightning“, „jumps“, „why“).
- Übergänge: `glide` (2, 5, 6, 15, 18, 19), `whip` (4, 7, 9, 12, 17, 21), `xfade` (3, 10, 13, 16, 20), `flash` (11, Loop), `cut` nur 8 und 14.
- **Gesichter über dem Untertitelband:** Figuren mit `frame(..., { above })` so setzen, dass Köpfe oberhalb ≈ 70 % der Bildhöhe liegen. Jede Kamera mit Standbildern prüfen.
- **Abstand zu Wänden:** Seitenansichten ≥ 0,65 m von Wänden (Figurenbibel). Im Dachboden die Sparren nicht durch die Kamera schneiden lassen.

### 2.5 Loop (Bild)
- Bild 22: Auf „back“ zucken Blitze in der Iris. Danach bildet sich am unteren Lid ein Tropfen (Bild −18), löst sich (−12) und fällt. Die letzten 5 Bilder blenden weiß auf (85 %).
- Bild 1: Das Weiß klingt in 6 Bildern ab. Derselbe Tropfen (2D-Ebene über dem Bild, `LoopDrop` in `StormAtticShort.tsx`) fällt ohne Sprung weiter und landet in Bild 4 im Eimer. Dazu kommen Ringe (3D) und ein Spritzring (2D).
- Die Bahn wird aus den Kameras beider Einstellungen berechnet (Lid in Bild −12 → Wasser in Bild 4), rechnet sich also nach der Aufnahme von selbst neu.
- Begründung: `SCRIPT.md` §1a.

### 2.6 Untertitel
- Vorhandene Komponente `src/engine/Captions.tsx`, wie im Pilot: `baseline: 0.76`, Schrift Nunito (OFL, `public/fonts/`), weiß, schwarze Kontur, ≈ 104 px.
- Quelle: dieselbe Wortdatei wie das Bild (erst `words_estimated.json`, nach der Aufnahme `words_master.json`).
- Betonungswörter erscheinen klein geschrieben (Regeln in `voice/narration_john.captions.json`).

---

## 3. Dateien

### 3.1 Angelegt: Texte (kostenlos, alles neu)
| Datei | Inhalt |
|---|---|
| `shorts/storm-in-the-attic/SCRIPT.md` | Skript + Szenenplan (22 Einstellungen) + Selbstprüfung |
| `shorts/storm-in-the-attic/SOUND_PLAN.md` | Musik, Atmo, Effekte, Pegel, Loop |
| `shorts/storm-in-the-attic/PRODUCTION_PLAN.md` | diese Datei |
| `shorts/storm-in-the-attic/voice/narration.txt` | Wortlaut (Untertitel-Vorlage) |
| `shorts/storm-in-the-attic/voice/narration_john.txt` | Sprechfassung mit Betonung und 3 Anweisungen |
| `shorts/storm-in-the-attic/voice/narration_john.captions.json` | Untertitel-Regeln |
| `shorts/storm-in-the-attic/voice/estimate/words_estimated.json` | geschätzte Wortzeiten (155 Wörter, Ende 47,00 s) |

### 3.2 Angelegt: Bild-Code (geprüft mit `npx tsc --noEmit` und ESLint, beide ohne Fehler)
| Datei | neu / geändert | Inhalt |
|---|---|---|
| `src/videos/storm-in-the-attic/story.ts` | neu | Zeitachse, Rollen, Cues pro Wort, 22 Einstellungen, Einblendungen |
| `src/videos/storm-in-the-attic/world.ts` | neu | die Welt: vier Orte, Licht und Farbkorrektur je Ort, Wolke, Regen, Blitz |
| `src/videos/storm-in-the-attic/houseSet.ts` | neu | Flur Whitlock |
| `src/videos/storm-in-the-attic/atticSet.ts` | neu | Dachboden |
| `src/videos/storm-in-the-attic/townSet.ts` | neu | trockene Stadt mit Dachfenstern |
| `src/videos/storm-in-the-attic/cloud.ts` | neu | Wolke, Regen, letzter Tropfen, Pfütze mit Ringen, Blitz, kleine Fensterwolken |
| `src/videos/storm-in-the-attic/skyEye.ts` | neu | Himmelskuppel und Auge (24 Öffnungsstufen, Blitzadern) |
| `src/videos/storm-in-the-attic/StormAtticShort.tsx` | neu | Komposition (Muster `CityWallShort.tsx`) |
| `src/Root.tsx` | **geändert, nur ergänzt** | 1 Import + 1 `<Composition id="StormAtticShort">`; bestehende Einträge bleiben unverändert |

Sicherung vor der Änderung an `src/Root.tsx`: `src/_backup/2026-11-06_episode2-composition/Root.tsx.bak` (von Git ignoriert, wie alle `_backup`-Ordner).

### 3.2b Noch offen (nach der Aufnahme, weil sie an den echten Wortzeiten hängen)
| Datei | neu / geändert | Inhalt |
|---|---|---|
| `shorts/storm-in-the-attic/story.json` | neu | Ton-Vorbereitung (Szenen, Wörter) wie im Pilot |
| `scripts/audio/stormmix.py` | neu | eigenes Mischskript (Muster `citymix.py`) |
| `scripts/audio/sfx_storm.py` | neu | Geräusche: Tropfen, Regen, Donner, Blitz, Leiter, Fenster |

### 3.3 Entsteht auf dem Mac
`voice/takes/john_storm_v1/…` (Rohaufnahme, Master, Wortzeiten), `voice/takes/john_storm_v1_V3/…`, `audio/mix.wav` + Stems, alle Videos unter `out/storm-in-the-attic/` (nicht in Git), `FINAL_QA.md`.

### 3.4 Nicht angefasst
Pilot (`shorts/city-in-the-wall/`, `src/videos/city-in-the-wall/`, `out/city-in-the-wall/*FINAL*`), Mary Celeste, `src/engine/`, `scripts/audio/shortmix.py`, `sfx_gen.py`, `dsp.py`, `instruments.py`, alle Dokumente in `docs/`, `CLAUDE.md`, `.env`.

---

## 4. Ablauf mit Freigaben

| # | Schritt | Wo | Freigabe |
|---|---|---|---|
| 1 | Skript, Szenenplan, Soundplan, Sprechtexte, Wortzeiten | ☁️ erledigt | **Adrian: Skript** ✔ (grundsätzlich, v2) |
| 2 | Bild-Code + Komposition, `npx tsc --noEmit` | ☁️ **erledigt** | – |
| 3 | Standbilder je Einstellung, Bildvorschau, `pace_report.py`, `short_qa.py`, Fehler beheben | 💻 (Standbilder probeweise auch ☁️ mit `--gl=swangle`, solange der Bildvergleich offen ist nur zur Orientierung) | **Adrian: Bild** |
| 4 | Stimm-Vorschau (kostenlos), Kostenanzeige | 💻 | **Adrian: Kosten (≈ 400–420 Credits)** |
| 5 | Aufnahme `--confirm` 💶, `process_voice.py`, `natural_master.py` → V3, Whisper-Prüfung | 💻 | **Adrian: Stimme** |
| 6 | Bild auf `words_master.json` umstellen (eine Zeile in `story.ts`), kurze Einstellungen nachziehen | ☁️ Code, 💻 Prüfung | – |
| 7 | `stormmix.py`, Vorschau mit Ton, Loop-Probe 3× | 💻 | **Adrian: Vorschau** |
| 8 | Finale 1440 × 2560, Endprüfung, `FINAL_QA.md`, Eintrag in `docs/EPISODES.md` und `STATUS.md` | 💻 | **Adrian: Veröffentlichung** (Upload macht Adrian) |

## 5. Befehle auf dem Mac (Projektordner, in dieser Reihenfolge)
```sh
scripts/check-setup.sh
export REMOTION_TMP=<scratch>/rtmp

# Schritt 3: Bild prüfen
node scripts/stills.mjs StormAtticShort out/storm-in-the-attic/stills/s_ 19,59,121,197,275,337,407,487,538,561,645,724,794,850,925,994,1076,1139,1220,1297,1354,1403,1424 0.35
npx remotion render src/index.ts StormAtticShort out/storm-in-the-attic/storm_picture_v1.mp4 --codec h264 --crf 18 --gl=angle
LC_ALL=C .venv/bin/python scripts/pace_report.py src/videos/storm-in-the-attic/story.ts shorts/storm-in-the-attic/voice/estimate/words_estimated.json out/storm-in-the-attic/storm_picture_v1.mp4 out/storm-in-the-attic/qa --total 1431
.venv/bin/python scripts/short_qa.py out/storm-in-the-attic/storm_picture_v1.mp4 out/storm-in-the-attic/qa out/storm-in-the-attic/qa/shots.json

# Schritt 4: Stimm-Vorschau, KOSTENLOS
.venv/bin/python scripts/voice/generate_voice.py storm-in-the-attic --profile mrabsurdly_john --spoken narration_john.txt --take john_storm_v1
# Schritt 5: NUR NACH FREIGABE DER KOSTEN
.venv/bin/python scripts/voice/generate_voice.py storm-in-the-attic --profile mrabsurdly_john --spoken narration_john.txt --take john_storm_v1 --confirm
.venv/bin/python scripts/voice/process_voice.py storm-in-the-attic --profile mrabsurdly_john --spoken narration_john.txt --take john_storm_v1
.venv/bin/python scripts/voice/natural_master.py storm-in-the-attic --take john_storm_v1 --out john_storm_v1_V3

# Schritt 7: Ton
.venv/bin/python scripts/audio/stormmix.py shorts/storm-in-the-attic

# Schritt 8: Finale
node scripts/render-short.mjs StormAtticShort shorts/storm-in-the-attic out/storm-in-the-attic/StormAttic_FINAL_1440x2560.mp4
```
Die Bildnummern für die Standbilder liegen in jeder der 22 Einstellungen (geschätzte Zeiten; 561 = der Blitz, 1424 = der Tropfen am Lid) und werden nach der Aufnahme neu berechnet.

## 6. Technische Endprüfung (aus `docs/PRODUCTION_WORKFLOW.md`)
- Bild 1440 × 2560, 30 fps, Bildanzahl = letztes Wort + 0,45 s
- Ton 48 kHz Stereo, −14 LUFS ±0,5, True Peak ≤ −1 dBTP, so lang wie das Bild
- `short_qa.py`: keine schwarzen Bilder, keine Standbilder, keine ungeplanten Blitze. Die Blitze in 11 und am Loop sind **geplant** und werden im Bericht so markiert.
- Loop: Naht ≤ normaler Bildwechsel, Ton ohne Klick
- Pilot und Mary Celeste unverändert (MD5)
- Handyman-Prüfung (Charakterbibel §7): Merkmale aus `HANDYMAN`, Hammer sichtbar, ≥ 2 Reaktionen, scharf im Bild, Erzählung sagt „the handyman“

## 7. Risiken und wie ich sie abfange
| Risiko | Gegenmaßnahme |
|---|---|
| Wolke wirkt wie Watte statt wie Gewitter | Innenleuchten + dunkle Unterseite + Regen; früh im Standbild prüfen (Einstellung 7 und 9 zuerst bauen) |
| Blitzeffekte lösen die QA aus | als geplante Blitze im Bericht eintragen; Lichtwechsel nur auf Wörtern |
| Auge im Himmel wirkt eher lustig als unheimlich | bleiche Farben, langsames Öffnen, keine Pupillen-Bewegung; Alternative steht in `SCRIPT.md` §3 |
| Echte Wortzeiten verschieben Schnitte (bis 1 s) | alle Schnitte hängen an Wörtern; nach der Aufnahme Standbilder neu prüfen |
| Einstellungen 1, 6, 13, 18 sind kurz (1,0–1,3 s) | bewusst kurze Pointen; nach der Aufnahme nötigenfalls 2–3 Bilder früher starten |
| Bild in der Cloud ≠ Mac | Cloud-Standbilder nur zur Orientierung, bis der Bildvergleich (PSNR) gemacht ist; Freigaben nur auf Mac-Renderings |
