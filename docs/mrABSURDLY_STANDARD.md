> **ARCHIV (2026-11-06):** Das Projekt heißt jetzt **THE HANDYMAN**. Gültig ist `docs/HANDYMAN_STANDARD.md`. Dieses Dokument bleibt zur Nachvollziehbarkeit unverändert erhalten.

# mrABSURDLY – Produktionsstandard v1

Stand: 2026-11-06 · freigegeben als Plan am 2026-11-06 · Grundlage: `docs/mrABSURDLY_PLAN.md` (Bestandsaufnahme +
Messwerte). Dieses Dokument ist **verbindlich** für jede neue Folge. Ändern nur nach Rücksprache.

**Kurz:** ungewöhnliche, spannende, teils absurde Geschichten. Gezeichnete Figuren in einer gemalten 3D-Welt.
Neues Bild alle 2–4 s, fließende Erzählung mit John, große weiße Wort-für-Wort-Untertitel.

Wir übernehmen nur **allgemeine Prinzipien** aus dem Referenzvideo. Geschichten, Figuren, Bilder, Texte und Stimme
sind immer unsere eigenen. Referenzmaterial wird nie veröffentlicht, hochgeladen oder zitiert.

---

## 1. Format

| | |
|---|---|
| Länge | **40–65 s** (Video endet auf dem letzten Wort + max. 1 s Ausklang) |
| Bild | 9:16, Arbeitsauflösung 1080 × 1920, Export **1440 × 2560**, 30 fps, h264 CRF 16 |
| Ton | Gesamtmischung −14 LUFS, True Peak ≤ −1 dBTP; Stimme vor dem Mix −15 LUFS |
| Sprache | amerikanisches Englisch |
| Kein | Intro, Logo, Abspann, „like & subscribe“, Text im Bild (außer Untertiteln und Zahlen) |

## 2. Geschichte und Skript

### 2.1 Aufbau (4 Teile)
| Teil | Anteil | Inhalt |
|---|---|---|
| **1. Aufhänger** | Satz 1 (10–18 Wörter, ≈ 3–5 s) | Die ungewöhnliche Aussage oder Lage, sofort, ohne Einleitung. Ein Widerspruch, ein Verbot, eine unmögliche Tat. |
| **2. Aufbau** | 1–3 Sätze | Wo, wer, was gilt, konkret und in der Gegenwart. Eine Figur mit Namen, eine Zahl, ein Detail. |
| **3. Steigerung** | 3–5 Schritte | Jeder Schritt bringt **neue** Information oder eine Entwicklung und ist größer als der vorige. Eine Rätsel- oder Fragestelle. Kurze wörtliche Rede erlaubt. |
| **4. Wendung / Pointe** | letzte 1–2 Sätze | Überraschung, Ironie oder Auflösung. Kurz. Video endet auf dem letzten Wort. |

Optional: **Schleifen-Ende**. Der letzte Satz führt grammatisch oder inhaltlich in den ersten zurück, und das letzte
Bild passt zum ersten.

### 2.2 Satzbau (gemessen: Referenz 14 Wörter je Satz, Mary Celeste 5)
- **Fließende Satzketten von 10–20 Wörtern** mit „and / but / so / when / until / because“. Die Spannung entsteht
  durch die Kette von Ereignissen, nicht durch Pausen.
- **Kurze Sätze (2–6 Wörter) nur für Pointen und Schocks**, höchstens 3 pro Video („Nothing happens.“).
- Gegenwart für die Handlung, Umgangssprache, Kurzformen (it's, he's, can't), keine Fachwörter ohne Erklärung im
  selben Satz.
- Keine Wiederholungen. Nichts sagen, was das Bild ohnehin zeigt. Keine Übergangsfloskeln („Let's dive in“, „But
  that's not all“).
- **Jeder Satz ist ein Bild.** Was nicht zu zeigen ist, wird umformuliert oder gestrichen.
- Wahre Geschichten: Fakten mit Quelle in `SCRIPT.md`. Erfundene Geschichten: im Skript als „fiktiv“ markieren.

**Beispiel (Mary-Celeste-Anfang, nur zur Veranschaulichung):**
- Bisher, 5 Sätze mit 4 Pausen: *„Imagine discovering a ship drifting alone in the Atlantic. Its sails damaged. Its
  deck empty. Not a single person aboard. On December 4th, 1872, …“*
- Neu, 1 fließender Satz: *„In 1872, a crew spots a ship drifting near the Azores, so they row over to help, and when
  they climb aboard, there's NOBODY on it.“*

### 2.3 Länge
- 3,5–3,7 Wörter/s → **140–230 Wörter** für 40–65 s.
- Faustregel beim Schreiben: 55 s ≈ 195 Wörter.

## 3. Stimme (John)

| | |
|---|---|
| Stimme | ElevenLabs **John – Conversational** `OEHTkiHZj6OczWZHu0Aj`, Modell `eleven_v4` (kein Klonen, keine Nachahmung fremder Stimmen) |
| Profil | **`scripts/voice/profiles/mrabsurdly_john.json`** (gewählt am 2026-11-06 = Variante C): Stabilität 0,2, Ähnlichkeit 0,75, lokal Tempo ×1,10 |
| Sprechtext | beginnt mit `[energetic, fast-paced]`; pro Satz höchstens **ein** Wort in GROSSBUCHSTABEN; Regieanweisungen wie `[curious]`, `[whispers]`, `[excited]` nur dort, wo die Stimmung wechselt (höchstens 3 pro Video) |
| Pausen | Satzende max. **0,20 s** (vor der Beschleunigung gemessen) → im Ablauf `shorts_master.py … --max-pause=0.18`, weil das Tempo vorher angewendet wird; **eine** längere Pause vor der Pointe ist erlaubt |
| Tempo | **×1,10** lokal mit Rubber Band (R3, Klangfarbe und Tonhöhe bleiben), automatisch durch das Profil |
| Ziel | **3,5–3,7 Wörter/s** gesamt, gemessen mit `scripts/pace_report.py` |
| Kosten | jede ElevenLabs-Aufnahme nur nach ausdrücklicher Zustimmung (≈ 0,44 Credits pro Zeichen) |

Spannungskurve der Stimme: gleichmäßig zügig. Die Tat- und Steigerungsszene wird leicht schneller (Referenz: 4,2 Wörter/s),
vor der Pointe kommt eine kurze Pause, die Pointe selbst ist ruhig und trocken.

## 4. Bild: Einstellungen und Schnitt

### 4.1 Rhythmus (gemessen: Referenz ≈ 3 s je Bild, 0 harte Schnitte)
- **Neues Bild alle 2–4 s** (Mittel ≈ 3 s), also 15–25 Einstellungen je Video.
- **Keine Einstellung länger als 5 s** ohne neues Ereignis im Bild (Geste, Reaktion, Kamerawechsel, Effekt).
- Jede Einstellung hat einen **Zweck**: `hook` · `info` · `reaction` · `reveal` · `payoff` · `bridge` (Ortswechsel).
  Ohne Zweck wird sie gestrichen.
- Bildwechsel liegen auf einem Wort: Das neue Bild steht **2 Bilder vor** dem ersten Wort seines Satzteils.

### 4.2 Bildgrößen
| Kürzel | Größe | Typischer Zweck |
|---|---|---|
| `EWS` | Luftbild / sehr weit | Ort, Ausmaß, „die ganze Stadt“ |
| `WS` | Totale | Situation, Menge |
| `MS` | Halbnah (Hüfte aufwärts) | Handlung, Gesten |
| `MCU` | Nah (Brust aufwärts), oft zwei Figuren | Gespräch, Aufhänger |
| `CU` | Groß (Gesicht) | Reaktion, Gefühl |
| `INSERT` | Makro auf einen Gegenstand | Schlüsselobjekt, Zahl, Detail |
| `TOP` | senkrecht von oben | Überraschung, Orientierung |

- **Nie zweimal dieselbe Größe hintereinander.**
- Muster für einen Gedanken: weit → näher → Detail/Reaktion.
- Gesichter und wichtige Handlungen liegen **über** dem Untertitelband (oberhalb ca. 70 % der Bildhöhe).

### 4.3 Kamera-Bausteine (`src/engine/shots.ts`, entsteht im Animationsschritt)
| Baustein | Wirkung | Dauer |
|---|---|---|
| `push` | langsames Heranfahren in jeder Haltephase (0,15–0,35 %/Bild) | ganze Einstellung |
| `punch` | kurzer Ruck heran auf ein Schlüsselwort (0,6 %/Bild) | 6–10 Bilder |
| `crane` | Kranfahrt nah ↔ weit in **einer** Bewegung (z. B. Gesicht → Luftbild) | 1–3 s |
| `whip` | Reißschwenk mit Bewegungsunschärfe zum nächsten Motiv am selben Ort | 6–10 Bilder |
| `orbit` | langsames Umkreisen eines Objekts | 2–4 s |
| `track` | Figur begleiten (gehen, klettern) | 2–4 s |
| `kick` | Stoß bei Aufprall (Vorzeichen wechselt jedes Bild, klingt in 7 Bildern ab) | 7 Bilder |
| `dutch` | Schräglage 4–5° für Dramatik | ganze Einstellung |

Bewegungen beginnen schnell und laufen weich aus (wie in der Referenz gemessen). Die Kamera wackelt nie aus der
Hand.

### 4.4 Übergänge
| Übergang | Wann | Länge |
|---|---|---|
| Überblendung `xfade` | Orts- oder Zeitwechsel (Tag → Nacht, Haus → Platz) | 6–9 Bilder |
| Reißschwenk `whip` | anderes Motiv am selben Ort | 6–10 Bilder |
| Kranfahrt `crane` | Größenwechsel am selben Ort | 1–3 s |
| Lichtblitz `flash` | Zeitsprung („The next morning“) | 6–8 Bilder |
| harter Schnitt `cut` | nur für Schock oder Pointe | höchstens 2 pro Video |

### 4.5 Hervorhebung wichtiger Wörter
- `punch` der Kamera **oder** Wechsel auf `INSERT` genau auf das Wort.
- Effekt-Karten im Comicstil: Knall, Sterne, Schweißtropfen, Ausrufezeichen, Staub, Lichtkranz.
- **Zahlen-Einblendung** (Zähler, Uhr, Jahreszahl) als gezeichnetes Objekt in der Welt. Sonst kein Text im Bild.
- Farbwechsel des Lichts bei Wendungen (z. B. Tag → Nachtblau → Morgengold).
- Ton: passender Effekt (Wusch beim Reißschwenk, Klick, Schlag), siehe `story.json` `events`.
- Jede sichtbare Reaktion beginnt **0–3 Bilder vor** ihrem Wort.

## 5. Figuren

Der Stil bleibt **gezeichnete Figuren in der 3D-Welt** (Entscheidung 2026-11-06, Option A). Keine 3D-Menschen.
Sie werden aber menschlicher und ausdrucksstärker (Umsetzung im Figurenschritt; Details in `docs/CAST_BIBLE.md`):

| | bisher | neu |
|---|---|---|
| Proportion | ≈ 3,5 Köpfe hoch | **≈ 5 Köpfe hoch** (Kinder ≈ 4) |
| Kopf | Bohnenform | Bohnenform bleibt erkennbar, etwas kleiner im Verhältnis |
| Hände | Tintenpunkte | **einfache Hände** (Faust, offen, zeigend, haltend) |
| Gesicht | Augen, Mund | dazu **Augenbrauen**, Seitenblick, aufgerissene oder zusammengekniffene Augen, Schweißtropfen |
| Haare | Mützen, Hüte | **verschiedene Frisuren** |
| Bewegung | stehen, sitzen, winken | dazu zeigen, Schulterzucken, Hände an den Kopf, Arme verschränken, gehen, laufen, klettern, halten/drücken, Schreck-Sprung, sprechender Mund |

- Figuren handeln in **fast jeder Einstellung**. Gegenstände allein höchstens in `INSERT`-Bildern.
- Mimik und Gesten werden **pro Wort** im Szenenplan festgelegt.
- Wiederkehrende Figuren haben feste Farben, Frisur, Kleidung und Größe (Figurenbibel). Ein Video nutzt höchstens 3–4
  Hauptfiguren plus eine Menge.
- Blinzeln alle 0,5–2,3 s (vorhanden), Laufen mit Auf-und-ab-Bewegung 3–7 %, Füße bleiben fest am Boden.

## 6. Welt und Licht
- Weiter wie bisher (bewährt, nicht umbauen):
  - gemalte Texturen
  - schwarze Tusche-Konturen an der 3D-Welt
  - kräftige Farben
  - Unschärfe im Hintergrund bei `CU`/`MS`/`INSERT`
  - Nebel in Horizontfarbe
- Umgebung und Gegenstände werden **pro Geschichte** passend gebaut. Bausteine wie Meer, Schiff, Innenräume,
  Kenney-Modelle werden wiederverwendet.
- Lichtstimmung folgt der Geschichte: Tag, Gold, Nacht, Morgen. Die Werte stehen in `looks.ts`.

## 7. Untertitel
| | |
|---|---|
| Inhalt | ein Wort oder eine kurze Einheit (Kurzwörter < 4 Bilder werden gruppiert, max. 3 Wörter) |
| Timing | erscheint 1 Bild vor dem Wort, harter Wechsel, **keine** Ein- oder Ausblendeffekte; verschwindet in Pausen ab 0,25 s |
| Stil | weiß #FFFFFF, sehr fette runde Schrift (eingebettete OFL-Schrift in `public/fonts/`), schwarze Kontur + weicher Schatten |
| Größe | ≈ 104 px bei 1080 Breite; lange Wörter schrumpfen auf max. 80 % der Breite, kein Umbruch |
| Position | Mitte, **≈ 76 % der Bildhöhe**; im Vorschaubild mit eingezeichneter YouTube-Sicherheitszone prüfen |
| Quelle | dieselbe Wortdatei wie das Bild (`words_master.json`), nie abgetippt |

## 8. Ton
- Musik und Effekte: `scripts/audio/shortmix.py` (bewährt). Musik-Abschnitte und Effekte stehen als **Wörter** in
  `story.json`.
- Musik deutlich unter der Stimme. Jeder Reißschwenk bekommt einen Wusch, jede Hervorhebung einen Akzent.
- Gesamtmischung −14 LUFS.

## 9. Ablauf je Folge (Kurzfassung, ausführlich in `docs/WORKFLOW.md`)
1. Thema + `SCRIPT.md` (Vorlage `templates/SCRIPT_TEMPLATE.md`): Skript und Szenenplan **zusammen** in einer Tabelle.
2. Freigabe des Skripts → Sprechtext `voice/narration.txt`.
3. Stimme (nur nach Zustimmung zu den Kosten) → Wortzeiten → Master.
4. `story.json` (Vorlage `templates/story.template.json`) → Szenen-Code → Standbilder → Vorschau.
5. Ton-Mix → Render → QA (`short_qa.py` + `pace_report.py`) → Freigabe.

## 10. Pflicht-Prüfungen (aus früheren Fehlern)
- Rhythmus: `pace_report.py` zeigt Einstellungslängen, Übergänge und Wörter/s. Keine Einstellung über 5 s ohne
  Ereignis.
- Jede Kamera mit Standbildern prüfen: nicht in Häusern, Masten, Segeln; keine Gegenstände näher als ca. 2 m; Gesichter
  über dem Untertitelband.
- `TL.at("wort")` trifft das **erste** Vorkommen, bei häufigen Wörtern die Nummer angeben.
- Lichtschächte nicht durch die Kamera sehen lassen (überstrahlen Innenräume).
- Haltephasen immer mit `push`, sonst meldet die QA „eingefroren“.
- `REMOTION_TMP` auf einen Arbeitsordner setzen; Ton mit `-map 0:v:0 -map 1:a:0`; kein Filmkorn.
- `@react-three/postprocessing` bleibt **3.0.4**. Keine Paket-Updates.
- Vor jeder Veröffentlichung: Freigabe durch Adrian. Keine Uploads durch Claude.
