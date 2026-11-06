> **ARCHIV (2026-11-06):** Das Projekt heißt jetzt **THE HANDYMAN**. Gültig ist `docs/HANDYMAN_STANDARD.md` und `docs/PRODUCTION_WORKFLOW.md`. Dieses Dokument bleibt zur Nachvollziehbarkeit unverändert erhalten.

# mrABSURDLY – Bestandsaufnahme und Integrationsplan

Stand: 2026-11-06 · Phase 1 + 2 · **Noch nichts umgesetzt. Wartet auf Freigabe.**

---

## Teil A – Bestandsaufnahme (Phase 1)

### A1. Referenzvideo („The Town Built Around a Button“)

**Zugang**
- Es lag nur **ein** Video vor: `~/Downloads/references/rics-clips/ScreenRecording_11-05-2026 22.mov`. Eine identische
  Kopie liegt in `~/Downloads/`.
- Format: Bildschirmaufnahme 1180 × 2556, 60 fps, 69,6 s. Das eigentliche Video dauert ca. **65,6 s**, danach
  beginnt es von vorn.

**Was ich wirklich geprüft habe**
- Bild: alle 0,5 s ein Einzelbild, dazu jeder Übergang in Einzelbildern.
- Ton: Lautstärke und Pausen gemessen.
- **Die Stimme habe ich nicht angehört.** Auf dem Mac ist keine Sprache-zu-Text-Software installiert. Sprechtempo und
  Betonung sind deshalb nicht selbst gemessen. Die Werte unten stammen aus der älteren Analyse im Skill
  (20 Videos, offenbar vom gleichen Kanal).

| Merkmal | Befund |
|---|---|
| Harte Schnitte | **keine** (außer dem Neustart am Ende) |
| Übergänge | ca. 7 kurze Überblendungen (0,2–0,3 s) bei Orts- oder Zeitwechsel; ca. 6 Reißschwenks bzw. schnelle Kamerafahrten von einem Motiv zum nächsten |
| Neues Bild | ca. 20–25 Bildausschnitte, **etwa alle 2,5–3 s** |
| Kamera | steht nie still. Oft eine einzige Fahrt von Nah bis zur Luftaufnahme (Kranfahrt). Drückt sich in Haltephasen langsam heran. |
| Bildgrößen | Makro (Knopf, Kratzer), Nah, Halbnah, Totale, Luftbild, Blick senkrecht von oben. Fast nie zweimal dieselbe Größe hintereinander. |
| Figuren | ständig neue Mimik (Augen, Schweißtropfen, Zähne, Seitenblick), Gesten (zeigen, trinken, drücken, klettern, gehen), große Menschenmengen für das Ausmaß |
| Hervorhebung | eingeblendeter Zähler (47 → 48 Kratzer) trägt die Pointe; Makro-Einstellung auf das Schlüsselobjekt |
| Untertitel | 1–2 Wörter, weiß, fett, schwarze Kontur, ca. 62–65 % Bildhöhe, harter Wechsel |
| Stimme | siehe A1b (mit Whisper gemessen) |
| Ton | sehr stark verdichtet (Lautstärkeschwankung 2,3 LU) |
| Geschichte | frei erfunden: Aufhänger („Knopf, den niemand drücken darf“) → Welt → Hinweise → Wette → Tat → Folge → Pointe. **Das Ende führt nahtlos zum Anfang zurück.** |

### A1b. Sprachanalyse mit Whisper (2026-11-06, lokal, kostenlos)

Werkzeug: whisper.cpp 1.9.5 (Homebrew) mit dem Modell `medium.en` (`~/whisper-models/`).
Ergebnisse in `references/ricks-clips/analysis/`: Abschrift, Wortzeiten, Messskripte.
**Nur zum privaten Studium, niemals veröffentlichen oder Text übernehmen.**

| Messwert | Referenz | Mary Celeste (John) |
|---|---|---|
| Wörter / Dauer | 245 Wörter / 66,4 s | 156 Wörter / 55,1 s |
| **Gesamttempo** | **3,69 Wörter/s** | 2,83 Wörter/s |
| Tempo pro Satz | 2,7–4,8, Mittel 3,7 Wörter/s | – |
| Tempo je 10 s | 3,5 / 3,8 / 3,2 / 4,2 / 3,6 / 3,9 | – |
| Pausenzeit gesamt (gleiche Messmethode) | ca. 4,8 s (≈ 7 %)¹ | ca. 11,0 s (≈ 20 %) |
| Pausen am Satzende | 0,15–0,35 s | Mittel 0,31 s, bis 0,45 s |
| Pausen bei Kommas | 0,08–0,25 s | – |
| **Sprechtempo ohne Pausen** | **mindestens ca. 4,0 Wörter/s**¹ | **ca. 3,5 Wörter/s** |
| Satzlänge | 16 Sätze, Mittel **14 Wörter** (6–33) | 22 Sätze, Mittel **5 Wörter** (3–23) |

¹ Unter der Referenzstimme liegt Musik, die kurze Pausen überdeckt. Der echte Pausenanteil kann daher etwas höher sein,
und dann ist auch das Sprechtempo ohne Pausen etwas höher als 4,0. (Korrigiert am 2026-11-06: Die erste Fassung nannte
für Mary Celeste 28 % Pausen und 3,9 Wörter/s. Diese Werte kamen aus einer anderen, ungenaueren Messmethode.)

**Wichtigste Erkenntnis:** Der Unterschied hat drei Ursachen:
1. **Sprechtempo:** John spricht die Wörter selbst etwa 10–15 % langsamer.
2. **Pausen:** Unsere Aufnahme hat etwa dreimal so viel Pausenzeit.
3. **Satzbau:** Das Mary-Celeste-Skript hat sehr kurze, abgehackte Sätze („But the lifeboat was gone.“), und nach jedem
   davon macht die Stimme eine Pause. Die Referenz erzählt in langen, fließenden Sätzen mit Kommas („…, and …“,
   „…, but …“, „So when …, he …“). Die Spannung entsteht durch die Kette von Ereignissen, nicht durch Pausen.

Folgen für die Stimme:
- Tempo leicht erhöhen (×1,05–1,15; kostenloser Hörtest in `voice-lab/2026-11-06_mrabsurdly-voice/`).
- Pausenkürzen allein bringt bei Mary Celeste nur 1,5–2,6 s, weil nur Satzpausen gekürzt werden.
  Den größten Hebel hat der Satzbau.
- Pausen kürzen: Satzende ca. 0,25 s, Komma ca. 0,12 s.
- Vor allem anders **schreiben**: lange Satzketten, kurze Sätze nur für Pointen („Nothing happens.“).
- Dramaturgie der Referenz: gleichmäßiges Tempo mit kleinen Beschleunigungen (30–40 s: 4,2 Wörter/s in der Tat-Szene)
  und **eine** etwas längere Pause vor bzw. nach der Pointe (0,34 s nach „nothing happens“).

### A2. Mary Celeste (unsere Produktion)

| | Mary Celeste | Referenz |
|---|---|---|
| Länge | 56,2 s | 65,6 s |
| Szenen | 12, also ca. 4,7 s pro Szene | ca. 3 s pro Bild |
| Harte Schnitte | 15 | 0 |
| Überblendungen | 3 | ca. 7 + 6 Reißschwenks |
| Sprechtempo | 2,8 Wörter/s (156 Wörter) | ca. 3,7 Wörter/s |
| Pausen | bis 0,5 s erlaubt | fast keine |
| Figuren im Bild | nur in wenigen Szenen (meist Schiff und Gegenstände) | in fast jeder Einstellung |

> ⚠️ **Wichtiger Befund zu den Figuren (betrifft Punkt 4 deines Auftrags):**
> Die Figuren in Mary Celeste sind **keine 3D-Modelle mit realistischen Proportionen**. Es sind flache, am Computer
> gezeichnete Comicfiguren („Karten“) mit bohnenförmigem Kopf, ca. 3,5 Köpfe hoch. Sie stehen in einer 3D-Welt und
> drehen sich immer zur Kamera (`src/engine/toon.ts`, `src/engine/people.ts`). Das ist dieselbe Figurenart wie im
> Referenzvideo und im Brücken-Beispiel. Echte menschliche 3D-Figuren gibt es im Projekt bisher nicht.
> → Entscheidung nötig, siehe Teil C, Frage 1.

**Was aus Mary Celeste wiederverwendbar ist**

| Baustein | Datei | Wiederverwendbar? |
|---|---|---|
| Figuren-Zeichnung (Körper, Kleidung, Hüte, Bart, Kleid) | `src/engine/toon.ts` | ja (Grundlage für alle Figuren) |
| Gesichtsausdrücke (neutral, ernst, grinsen, lachen, nervös, Schock, Erleichterung …) | `toon.ts` (`Expr`) | ja, sollen erweitert werden |
| Posen | `toon.ts`: stehen, sitzen, winken, Blickrichtung | ja, aber zu wenige Bewegungen |
| Blinzeln, Licht auf Figuren, Bodenschatten | `people.ts`, `cardshade.ts`, `cards.ts` | ja |
| Effekte (Sterne, Knall, Staub, Spritzer, Ring, Musiknoten) | `toon.ts` (`fx…`) | ja |
| Meer, Himmel, Schiff, Innenräume, Seekarte | `sea.ts`, `ship.ts`, `sets.ts`, `videos/mary-celeste/sets.ts` | ja, für passende Geschichten |
| Konturen, Unschärfe, Farblook, Leuchten | `ink.ts`, `lensblur.ts`, `grade.ts`, `Shell.tsx` | ja, unverändert |
| Zeitachse nach Wörtern, Szenen und Überblendungen aus `story.json` | `timeline.ts`, `Shell.tsx` | ja |
| Kamera (Fahrt, Zoom, Heranziehen, Stoß) | `camera.ts` | ja, Bausteine fehlen (siehe B5) |
| Untertitel | `Captions.tsx` | ja, kleine Anpassungen |
| Kenney-3D-Modelle (frei nutzbar, CC0) | `public/` | ja |

### A3. Ursprünglicher Leitfaden (Skill `~/.claude/skills/cartoon-3d-short/`)

| Teil | Im Projekt? | Bemerkung |
|---|---|---|
| `SKILL.md` Ablauf in 12 Schritten | ja, weiterentwickelt | teils veraltet: Stimme Wyman, 1080 × 1920, „Bridge-Ordner kopieren“, Windows-Pfade |
| `templates/bridge/` (13 Dateien) | ja: `src/videos/bridge/` (Original), allgemeine Teile nach `src/engine/` übernommen | **Doppelung:** `bridge/` hat eigene Kopien von toon/ink/grade usw. Sie bleiben als Archiv und werden nicht weiter gepflegt. |
| `templates/audio/` | ja: `dsp.py`, `instruments.py`, `sfx_gen.py` + **`shortmix.py`** (fasst `timeline/music/sfx/mix.py` zusammen) | kein Handlungsbedarf |
| `templates/scripts/` | ja, alle 5 in `scripts/` | `bridge-stills.mjs` ist durch `stills.mjs` ersetzt |
| `references/STYLE_BIBLE.md` + `reports/` | nur im Skill | Zahlen weiter gültig. „Keine Untertitel“ ist überholt. |
| Lehren aus früheren Fehlern („Gotchas“) | in SKILL.md und STATUS.md | bleiben verbindlich (siehe B9) |

### A4. Stimme

- Ablauf: `npm run voice` → ElevenLabs (kostet, nur mit `--confirm`) → kostenlose Nachbearbeitung → Wortzeiten
  (`snap_timing.py`) → `shorts_master.py` (Klang, Lautstärke, optional Pausenkürzung).
- Profil `john_shorts_fast.json`: John, `eleven_v4`, Stabilität 0,2, Ähnlichkeit 0,75.
  - Geschwindigkeit lässt sich bei v4 laut unserer Notiz **nicht** einstellen.
  - Tempo- und Tonhöhenänderung sind abgeschaltet.
  - Kleiner Fehler: `credits_per_char_estimate` steht auf 1,0, gemessen waren ca. 0,44.
- **Kostenlose Hebel für mehr Tempo und Spannung, schon vorhanden:**
  1. lokales Tempo (Rubber Band, Tonhöhe bleibt gleich)
  2. Pausenkürzung (`--max-pause`)
  3. Klangkette

  Alle drei lassen sich an der **vorhandenen** Mary-Celeste-Aufnahme testen, also ohne neue Aufnahme.
- **Kostenpflichtige Hebel (nur nach Freigabe):**
  - anders geschriebener Sprechtext: kürzere Sätze, gezielte Betonung, Regieanweisungen pro Abschnitt
  - Stabilitätswert
  - Vorher wäre ein Kurztest mit 2–3 Sätzen sinnvoll, ca. 100–200 Credits.

### A5. Untertitel, Rendering, Qualitätskontrolle

- Untertitel (`src/engine/Captions.tsx`):
  - Wort für Wort, harter Wechsel, Kurzwörter werden gruppiert
  - Verschwinden ab 0,25 s Pause
  - Höhe **66 %** (Wunsch: 76 %)
  - Schrift: Mac-Systemschrift „Arial Rounded MT Bold“, keine eingebettete freie Schrift
- Rendering: `scripts/render-short.mjs` erzeugt 1440 × 2560, 30 fps, h264 CRF 16, Ton wird angehängt.
  Standbilder: `scripts/stills.mjs`.
- Qualitätskontrolle: `scripts/short_qa.py` prüft schwarze, weiße und eingefrorene Bilder sowie die Lautstärke und
  erstellt Übersichtsbilder. **Es fehlt** eine Messung von Schnittrhythmus und Einstellungslänge.
- Technik: Remotion 4.0.540, three 0.187, `@react-three/postprocessing` **3.0.4 (fest, bleibt)**.

---

## Teil B – Produktionsstandard mrABSURDLY (Phase 2, Entwurf)

### B1. Erzählung und Skript
- 40–65 s, ca. **3,4–3,7 Wörter/s** (130–220 Wörter).
- Aufbau: **Aufhänger** (Satz 1, keine Einleitung) → **Aufbau** (1–2 Sätze, konkret, Gegenwart) → **Steigerung**
  (3–5 Schritte, jeder größer, kurze wörtliche Rede erlaubt) → **Wendung/Pointe** (letzte 1–2 Sätze, Video endet auf dem
  letzten Wort). Optional: Ende, das in den ersten Satz zurückführt (Endlosschleife).
- Themen offen: wahr, erfunden, historisch, wissenschaftlich. Wahre Fakten bekommen Quellen im Skript.
- Fließende Sätze von 10–20 Wörtern (Referenz: Mittel 14), kurze Sätze nur für Pointen, Umgangssprache, Kurzformen („it's“, „don't“), keine Wiederholungen, nichts beschreiben, was man
  ohnehin sieht.
- **Jeder Satz wird schon beim Schreiben einem Bild zugeordnet** (Skript und Szenenplan in einer Tabelle).

### B2. Szenenplan (neu: Einstellungen statt grober Szenen)
- Pro Einstellung: Startwort, Zweck (Aufhänger / Info / Reaktion / Enthüllung / Pointe), Bildgröße, Kamera-Baustein,
  Figuren mit Mimik und Geste pro Wort, Übergang, Hervorhebung, Ton-Effekt.
- **Schnittfrequenz:** neues Bild alle **2–4 s** (Mittelwert ca. 3 s). Keine Einstellung über 5 s ohne neues Ereignis.
  Ein 55-s-Video hat also 15–25 Einstellungen.
- **Bildgrößen-Regel:** nie zweimal dieselbe Größe hintereinander. Grundmuster Totale → Halbnah → Nah/Makro → Reaktion.
- **Übergänge:** Überblendung 6–9 Bilder bei Orts- oder Zeitwechsel, Reißschwenk 6–10 Bilder innerhalb eines Ortes,
  Kranfahrt für Größenwechsel, harter Schnitt nur für Schock (0–2 pro Video).
- Jede Reaktion beginnt 0–3 Bilder **vor** ihrem Wort (bestehende Regel).

### B3. Figuren (abhängig von Frage 1)
- Feste **Figurenbibel** (`docs/CAST_BIBLE.md`): wiederkehrende Grundtypen (z. B. Hauptfigur, Erzähl-Gegenspieler,
  Mutter/Vater, Beamter, Kind, Menge) mit festen Proportionen, Farben, Frisur, Kleidung. So werden Figuren über Videos
  hinweg wiedererkennbar.
- Mehr Bewegung: Zeigen, Schulterzucken, Hände an den Kopf, Arme verschränken, Gehen, Laufen, Klettern, Sitzen,
  Gegenstand halten/drücken, Sprung vor Schreck.
- Mehr Mimik: Augenbrauen, Seitenblick, Augen aufreißen, zusammenkneifen, Schweißtropfen, Zähne knirschen, Sprechmund
  (einfache Mundbewegung, solange die Figur spricht).
- Mimik und Gesten werden **pro Wort** im Szenenplan gesetzt.

### B4. Kamera
- Jede Haltephase drückt sich langsam heran (vorhanden: `pushK`). Bei Schlüsselwörtern kommt ein kurzer Ruck heran
  dazu (vorhanden: „punch“).
- Neue Bausteine: Reißschwenk, Kranfahrt nah→weit / weit→nah, Makro-Insert, Über-die-Schulter, senkrecht von oben,
  Untersicht (Heldenperspektive), Schräglage 4–5° für Dramatik, Stoß bei Aufprall (vorhanden: „kick“).

### B5. Hervorhebung wichtiger Wörter
- Kurzer Kameraruck, Effekt-Karte (Knall, Sterne, Ausrufezeichen), Makro auf das Objekt, eingeblendete Zahl/Zähler im
  Comicstil (keine Schrift außer Zahlen), Farbblitz bei Wendungen.
- Untertitel bleiben weiß, ohne Effekte.

### B6. Stimme – neues Profil „mrABSURDLY John“
- Gleiche Stimme (John, `OEHTkiHZj6OczWZHu0Aj`), gleiches Modell (`eleven_v4`). Keine fremde Stimme, keine Nachahmung.
- **Kostenlos, lokal (laut Whisper-Messung A1b):** Pausen kürzen (Satzende max. ca. 0,25 s, Komma ca. 0,12 s),
  Tempo ×1,05–1,15 (Tonhöhe bleibt). Gemessen an Mary Celeste: 2,83 → 3,10 / 3,27 / 3,42 Wörter/s.
  Die übrige Lücke zu 3,7 schließt der Satzbau.
- **Schreibregeln für den Sprechtext:** fließende Satzketten von 10–20 Wörtern mit „and / but / so / when“; kurze
  Sätze (3–6 Wörter) nur für Pointen und Schocks; pro Satz höchstens ein Wort in GROSSBUCHSTABEN; Gedankenstrich oder
  „…“ nur vor einer Pointe; Fragen für Spannungsmomente; Regieanweisungen nur dort, wo sich die Stimmung ändert
  (z. B. `[curious]`, `[whispers]`, `[excited]`), nicht in jedem Satz.
- Stabilität: 0,2 behalten. Optional 0,3 testen, falls 0,2 übertrieben klingt.
- Erst nach Freigabe: ein bezahlter Kurztest (2–3 Sätze, ca. 100–200 Credits), um zu prüfen, wie v4 die
  Regieanweisungen umsetzt.

### B7. Untertitel
- Höhe **76 %** (laut deinem Wunsch). Hinweis: YouTube legt ab ca. 78–80 % Titel und Knöpfe darüber. 76 % ist knapp,
  aber machbar. Prüfung im Vorschaubild mit eingezeichneter Sicherheitszone.
- Größe, Weiß, schwarze Kontur, Schatten und harter Wechsel bleiben. Keine Effekte.
- Eingebettete freie Schrift (OFL-Lizenz, kostenlos) statt Systemschrift, damit der Render auf jedem Rechner gleich
  aussieht.
- Gesichter liegen über dem Untertitelband: Der Szenenplan prüft das pro Einstellung.

### B8. Technik
- 1440 × 2560 (2K, über 1080p), 30 fps, h264, Ton −14 LUFS, Untertitel aus denselben Wortzeiten wie das Bild.
- Keine Paket-Updates. `@react-three/postprocessing` bleibt 3.0.4.
- Engine-Änderungen nur **ergänzend**: Bestehende Standardwerte bleiben, damit Mary Celeste und Bridge unverändert
  rendern. Nachweis durch Vergleichsstandbilder vorher/nachher.

### B9. Bekannte Fallen (bleiben Pflicht-Prüfungen)
- `TL.at("wort")` trifft das erste Vorkommen, bei häufigen Wörtern die Nummer angeben.
- Kamera nicht in Häuser, Masten oder Segel setzen, jede Kamera mit Standbildern prüfen.
- Lichtschächte überstrahlen Innenräume.
- Gegenstände näher als ca. 2 m zur Kamera werden zu Klecksen.
- Ruhige Haltephasen ohne Heranziehen gelten in der QA als eingefroren.
- `REMOTION_TMP` auf einen Arbeitsordner setzen (Speicherplatz!).
- Ton mit `-map 0:v:0 -map 1:a:0` anhängen.
- Kein Filmkorn.
- Postprocessing 3.0.4 nicht ändern.

---

## Teil B10 – Dateien: was geändert und was neu erstellt wird

**Neue Dateien**

| Datei | Zweck |
|---|---|
| `docs/mrABSURDLY_STANDARD.md` | der verbindliche Standard (aus Teil B) |
| `docs/WORKFLOW.md` | Schritt-für-Schritt-Anleitung (Phase 5: Skript → Szenenplan → Stimme → Animation → Untertitel → Render → QA) |
| `docs/CAST_BIBLE.md` | wiederkehrende Figuren mit festen Merkmalen |
| `templates/SCRIPT_TEMPLATE.md` | Skript + Szenenplan in einer Tabelle |
| `templates/story.template.json` | Vorlage mit Einstellungen, Übergängen, Mimik/Gesten-Cues, Musik, SFX |
| `scripts/voice/profiles/mrabsurdly_john.json` | neues Stimmprofil (Grundlage `john_shorts_fast.json`, das unverändert bleibt) |
| `src/engine/shots.ts` | Kamera-Bausteine: Reißschwenk, Kranfahrt, Makro, Über-die-Schulter, von oben, Untersicht |
| `src/engine/acting.ts` | Mimik-, Gesten- und Mund-Zeitplan pro Wort für Figuren |
| `src/engine/overlays.ts` | Zähler- und Hervorhebungs-Effekte |
| `scripts/pace_report.py` | misst Einstellungslängen, Übergänge und Sprechtempo eines Renders und vergleicht mit dem Standard |
| `public/fonts/<Schrift>.ttf` + Lizenz | eingebettete Untertitelschrift |
| `shorts/absurd-test/`, `src/videos/absurd-test/` | Testabschnitt (Phase 4) |

**Geänderte Dateien (nur ergänzend)**

| Datei | Änderung |
|---|---|
| `src/engine/toon.ts` | neue Mimik, Gesten, Mundformen, ggf. neue Proportionen (alte bleiben Standard) |
| `src/engine/people.ts` | Figuren bekommen Geste, Sprechen, Gehen, Zeitplan |
| `src/engine/camera.ts` | kleine Hilfsfunktionen für `shots.ts` |
| `src/engine/Shell.tsx` | Reißschwenk-Übergang mit Bewegungsunschärfe (ohne Änderung der Postprocessing-Version) |
| `src/engine/timeline.ts` | Einstellungen statt Szenen aus `story.json` lesen (alte Form bleibt gültig) |
| `src/engine/Captions.tsx` | Höhe 76 %, eingebettete Schrift (Mary Celeste behält 66 % über einen Parameter) |
| `scripts/audio/shortmix.py` | automatischer „Wusch“-Ton bei Reißschwenks, Akzent-Töne bei Hervorhebungen |
| `scripts/voice/shorts_master.py` | nur falls nötig: Tempo-Einstellung aus dem Profil lesen |
| `src/Root.tsx` | Test-Komposition anmelden |
| `STATUS.md` | neuer Stand, mrABSURDLY statt „nur Mystery“ |
| Gedächtnis-Notizen | Ziel und Kanalname aktualisieren |
| `~/.claude/skills/cartoon-3d-short/SKILL.md` | veraltete Stellen korrigieren und auf `docs/WORKFLOW.md` verweisen (nur mit Freigabe, liegt außerhalb des Projekts) |

**Nicht angefasst:** `package.json` und alle Pakete, `src/videos/bridge/`, `src/videos/mary-celeste/`,
Mary-Celeste-Audio, alle vorhandenen Stimmprofile, `voice.py` / `generate_voice.py` (ElevenLabs-Anbindung).

### B11. Reihenfolge der Umsetzung (Phase 3 + 4, jeweils mit Zwischenstand)
1. Standard, Vorlagen, Figurenbibel schreiben (nur Dokumente).
2. Stimme **kostenlos** testen: vorhandene Mary-Celeste-Aufnahme mit gekürzten Pausen und Tempo 1,00 / 1,05. Du hörst
   2–3 Varianten und wählst.
3. Kamera-Bausteine + Übergänge, dazu Standbilder und ein kurzer Vorschau-Render.
4. Figuren: Mimik, Gesten, Mund (bzw. die in Frage 1 gewählte Variante), dazu Standbilder zur Abnahme.
5. Untertitel 76 % + Schrift, Prüfung mit Sicherheitszone.
6. **Testabschnitt** (ca. 12–15 s, 5–6 Einstellungen) mit der **vorhandenen** John-Aufnahme, also ohne neue Kosten.
   Danach Render, QA, `pace_report.py` und eine Liste der Verbesserungen.
7. Gegenprobe: Mary Celeste und Bridge rendern weiterhin gleich (Vergleichsstandbilder).
8. Dokumentation (`WORKFLOW.md`, `STATUS.md`), dann Commit **nur nach Freigabe**.

---

## Teil C – Offene Entscheidungen

1. **Figurenstil** (wichtigste Frage). Die Mary-Celeste-Figuren sind flache gezeichnete Comicfiguren, keine
   3D-Menschen.
   - **A (Empfehlung):** gezeichnete Figuren behalten, aber menschlicher machen: ca. 5 statt 3,5 Köpfe hoch, echte
     Hände, Augenbrauen, Frisuren, mehr Mimik und Gesten. Passt zur ganzen Engine. Mittlerer Aufwand, geringes Risiko.
   - **B:** echte 3D-Menschenfiguren (frei lizenzierte Modelle mit Skelett-Animation) mit Comic-Shader. Großer Umbau,
     Gesichtsausdrücke sind schwierig, hohes Risiko, eigener Test vorab nötig.
   - **C:** gezeichnete Figuren unverändert lassen, nur mehr Bewegung.
2. Darf ich eine **kostenlose freie Schrift** (OFL) für die Untertitel herunterladen?
3. ~~Whisper installieren~~: erledigt am 2026-11-06 (siehe A1b). Vorschlag: Whisper zusätzlich als automatische
   Kontrolle in der QA nutzen (Abschrift des fertigen Videos ↔ Skript, Sprechtempo, Pausen).
4. Kommen die **drei weiteren Referenzvideos** noch? Soll ich den Ordner `references/ricks-clips/` anlegen und das
   vorhandene Video dorthin kopieren?
5. Darf ich die Skill-Dateien unter `~/.claude/skills/cartoon-3d-short/` anpassen, oder sollen nur Projektdokumente
   gepflegt werden?
