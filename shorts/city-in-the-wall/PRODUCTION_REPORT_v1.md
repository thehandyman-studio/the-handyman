# The City Hidden Inside a Wall – Produktionsbericht v1 (Bild, ohne Ton)

Stand: 2026-11-06 · Komposition `CityWallShort` · **Noch keine Sprachaufnahme, keine Tonmischung.** Alle Zeiten beruhen
auf den geschätzten Wortzeiten in Variante C (`voice/estimate/words_estimated.json`, 3,27 Wörter/s).

## Ergebnisse (`out/city-in-the-wall/`)
| Datei | Inhalt |
|---|---|
| `CityWall_full_picture_v2.mp4` | **vollständiges Video**, 1080 × 1920, 30 fps, 1.404 Frames = 46,8 s, Untertitel (Nunito, 76 %) auf Schätzzeiten, kein Ton |
| `qa_full_v2/overview.jpg` | **Szenenübersicht**: je ein beschriftetes Bild aus der Mitte jeder Einstellung (24 Szenen = 30 Einstellungen) |
| `qa_full_v2/loop_seam.jpg` | die Loop-Naht: Frames 1402, 1403 · 0, 1, 3 |
| `qa_full_v2/loop.md` | Messung der Loop-Naht |
| `qa_full_v2/pace.md` | Einstellungsliste mit Frames und Längen, Tempo |
| `qa_full_v2/report.md` + `sheet_*.jpg` | Frame-für-Frame-Prüfung (`scripts/short_qa.py`), Übersichten je 2 s |
| `CityWall_full_picture_v1.mp4` | erster Gesamtrender (vor den Korrekturen, nur zum Vergleich) |

## Szenen (24 Szenen laut Plan; einige in 2–4 Einstellungen geteilt)
| # | Wort | Ort | Bild |
|---|---|---|---|
| 1 | (Anfang) | Stadt | **Loop-Start:** Nahaufnahme der Wand, der Hammerkopf durchbricht den Putz, Brocken und Licht; eine durchgehende Rückfahrt in die Straßenschlucht mit erschrockenen Mini-Menschen |
| 2 | discovered | Zimmer | Leo in Latzhose mit Hammer, überrascht |
| 3 | civilization | Zimmer | über seine Schulter (Rückansicht) ins leuchtende Loch, die Stadt dahinter in 1:60 |
| 4a–d | Behind / insulation / bricks / pipes | Zimmer | Lochkante, dann Dämmwolle ✗, Ziegel ✗, Rohre ✗ |
| 5 | It was | Stadt | Reißschwenk, Kranfahrt vom Loch über die Dächer |
| 6–9 | Tiny / glowing / little / and thousands | Stadt | Straßen von oben, leuchtende Hausfront, kleines Auto (fährt nur auf der Fahrbahn), Platz mit Brunnen und Menge |
| 10 | At first | Zimmer | Leo, Hand am Kinn, selbstgefällig auf „model“ |
| 11 | But then | Stadt | Mini-Mann schaut hoch („looked“), zeigt nach oben („pointed“) |
| 12a | and started | Stadt | **Gegenschuss:** Leos Riesengesicht im Loch (aus Sicht des Mini-Manns) |
| 12b | screaming | Stadt | Mini-Mann schreit, Hände am Kopf, Stoß |
| 13 | The handyman | Zimmer | **Seitenansicht:** Leo beugt sich langsam zum Loch vor |
| 14 | Suddenly | Stadt | von oben: alle erstarren auf „stopped“ (Menschen und Autos) |
| 15 | Then they all | Stadt | Kamera senkt sich in die Menge, die Köpfe drehen sich als Welle nach oben |
| 16 | He slowly | Zimmer | über die Schulter: Leo hebt langsam die Hand |
| 17 | Thousands of tiny | Stadt | hinter der Menge: alle winken (Rückansicht), oben im Loch Leos grinsendes Riesengesicht |
| 18 | But one | Stadt | Doc klettert ein Fallrohr hoch (Rückansicht), steht auf dem Pavillondach, hebt das Schild |
| 19 | It read | Stadt | Schild aus Leos Sicht, voll lesbar: „PLEASE DON'T OPEN THE NEXT WALL“, Ruck auf „NEXT“ |
| 20 | The handyman froze | Zimmer | Leo erstarrt, Schweißtropfen |
| 21 | Then came | Zimmer | Reißschwenk zur Gegenwand: drei Klopfer (je Stoß, Beben, KNOCK), Risse wachsen, beim dritten bricht ein Stück aus, ein **riesiges Auge** schaut herein |
| 21b | opposite | Zimmer | Leo dreht sich um und **schaut nach oben** (Seitenansicht) |
| 22 | A tiny voice | Stadt | Rose flüstert „He's found us again“ (Mund nur auf diesen Wörtern), zwei Verängstigte daneben |
| 23 | The handyman stepped | Zimmer | **Seitenansicht:** Leo tritt mit erhobenem Hammer zurück |
| 24a | And then | Zimmer | von hinten: Leo hebt den Hammer, die Gegenwand bebt und reißt |
| 24b | struck | Stadt | **Loop-Ende:** dieselbe Nahaufnahme wie Bild 1; die Wand ist noch ganz, Licht dringt durch wachsende Risse → Frame 0 |

## Der Loop (Variante A, von Anfang an eingebaut)
- **Eine Wand, eine Uhr.**
  - Bild 24b und Bild 1 zeigen dieselbe Stelle derselben Wand aus derselben Kamera.
  - Der Wanddurchbruch läuft auf einer Zeitachse über die Loop-Grenze hinweg:

| Zeit | Was passiert |
|---|---|
| −1,4 s bis 0 | Risse wachsen vom Mittelpunkt, Licht dringt immer stärker durch, die Wand bebt |
| ab 0 | Die Wand ist noch ganz, das Licht ist am stärksten |
| 0,03 s | Der Hammerkopf durchbricht den Putz |
| 0,15 s | Der Rest zerbröselt, die Brocken fliegen |

  - Der letzte Frame (1403) entspricht Zeitpunkt −0,03 s, Frame 0 dem Zeitpunkt 0. Es ist also ein normaler Schritt
    derselben Animation, kein Schnitt.
- **Bedeutung:**
  - Am Ende bricht jemand Größeres in Leos Welt ein.
  - Am Anfang bricht Leo in die Stadt ein.
  - Die Nahaufnahme ist in beiden Welten gleich: dieselbe Putzwand, derselbe Hammer.
  - Zusammen bilden sie die rekursive Schleife.
- **Andeutung des Größeren:**
  - Bei den Klopfern wachsen die Risse, und beim dritten Klopfer schaut ein riesiges Auge herein.
  - In 24a bebt die Gegenwand.
- **Gemessen** (`qa_full_v2/loop.md`): Zwischen dem letzten Frame und Frame 0 ändert sich die Helligkeit im Mittel um
  **2,89** von 255. Zwischen normalen Nachbarbildern sind es im Median 3,12. Ergebnis: **nahtlos**.
- **Ton (vorbereitet, noch nicht gemischt):**
  - Der Einschlag liegt auf Frame 0 („He“).
  - Ein Anstieg (Riser) läuft bis zum letzten „wall“.
  - Die Musik endet in derselben Tonart, in der sie beginnt.
  - Für eine wirklich nahtlose Wiederholung braucht `shortmix.py` noch eine kleine Loop-Option (siehe unten).

## Umgesetzte Korrekturen aus den Tests
- **A. Autofahrt**
  - Straßen sind jetzt 7 m breit (zwei Spuren à 3,5 m) mit 2 m Gehwegen. Die Häuserblöcke sind dafür kleiner.
  - Autos fahren in der Spurmitte, 1,75 m von der Straßenmitte. Laternen stehen 4 m von der Mitte entfernt, Fußgänger
    4,5 m.
  - Jede Fahrtrichtung hat eine Geschwindigkeit, es gibt kein Überholen durch andere Autos und keine Fahrt über
    Kreuzungen in Querrichtung.
  - Die Kamera fährt im Gegenverkehr-Fahrstreifen mit.
- **B. Wanddurchbruch**
  - Der Hammer wird in der Nahaufnahme groß und deutlich. Er durchstößt sichtbar den Putz, die Brocken fliegen zuerst
    um den Kopf, dann aus dem Rest.
  - Die Mini-Menschen ducken sich.
  - Tiefenschärfe ist in Bild 1 kaum gesetzt (1,2): Hammer, Loch und Durchbruch bleiben scharf.
  - Das Loch ist in allen Folgebildern scharf oder liegt im Schärfebereich.
- **C. Kamera**
  - Alle Kamerapositionen wurden mit Standbildern auf Durchdringungen geprüft und korrigiert (Bild 1, 9, 13, 23, 24a).
  - Bäume direkt vor der Kamera wurden entfernt, Figuren, die näher als 4 m vor der Kamera stehen, werden ausgeblendet.

## Qualitätskontrolle (Kurzfassung)
| Prüfung | Ergebnis |
|---|---|
| Format | 1080 × 1920, 9:16, 30 fps, 1.404 Frames ✔ |
| alle 24 Szenen vorhanden | ✔ (30 Einstellungen, siehe Übersicht) |
| schwarze / ungeplante weiße / eingefrorene Frames | keine ✔ |
| Sprünge (Bildänderung > 3× Umgebung) | 34 Frames, alle auf geplanten Kamera-Rucken und Stößen („discovered“, „model“, „pointed“, „screaming“, „stopped“, „NEXT“, Klopfer), Schnitten oder Leos Bewegungen direkt danach |
| Loop-Naht | nahtlos (siehe oben) ✔ |
| Render | erfolgreich, ≈ 46 s Rechenzeit ✔ |
| Projekt übersetzt fehlerfrei | ✔ |
| Mary Celeste unverändert | ✔ (Vergleichsbild 600: 43 dB = praktisch identisch; keine Datei von Mary Celeste geändert) |
| keine neuen Pakete, Postprocessing 3.0.4 | ✔ |

## Offene Punkte / bekannte Schwächen
1. **Schnitttempo:** Im Mittel 1,56 s pro Einstellung, also schneller als die gewünschten 2–4 s.
   - **Ursache:**
     - 24 Szenen in 46 s
     - die bewusst schnellen Aufzählungen (4b–d: je 0,4–0,6 s; 6–8: je 0,7–0,8 s)
     - die geteilten Szenen (12a/b, 21/21b, 24a/b)
   - **Möglichkeiten:**
     - 4b–d zu einem Bild mit drei Stempeln zusammenfassen
     - 6–8 zu einer durchgehenden Kranfahrt verbinden
     - 21b streichen
   - Damit kämen wir auf ≈ 24 Einstellungen und Ø ≈ 1,95 s.
2. **Bild 7 („glowing windows“):** Die Fenster leuchten, wirken aber eher ruhig-cremig als glühend. Die Stellschraube
   (Leuchtstärke dieses Bildes) ist vorhanden.
3. **Kein Ton:** Für die Mischung fehlen noch:
   - die Aufnahme (≈ 420 Credits, Freigabe nötig)
   - kleine Ergänzungen in `shortmix.py`: Umgebungston „Stadt“, Klopfen, Putzbrocken, winziger Schrei, Stempel-Klick,
     Loop-Option
4. **Untertitel und Bildwechsel** beruhen auf geschätzten Zeiten. Nach der Aufnahme rechnet sich alles automatisch
   neu, eine Sichtprüfung bleibt nötig.
5. **Der Schnitt 24a → 24b** wechselt von Leos hellem Zimmer zur Nahaufnahme der Stadtwand. Sie ist im Stadtlicht
   kühler, liegt erst im Schatten und wird dann warm durchleuchtet. Inhaltlich gewollt (der Maßstabssprung), farblich
   ein spürbarer Wechsel.
6. **Leos Hammerhand:** Je nach Ansicht (vorn, hinten, seitlich) wechselt der Hammer die Bildseite. Bei schnellen
   Schnitten fällt das kaum auf, ist aber keine strenge Kontinuität.
7. **Zwischen 21b und 23** geht Leo außerhalb des Bildes (während Bild 22) zur Zimmermitte, damit er in 23
   zurücktreten kann.
8. **Menge:** Die Figuren sind flache Karten, die immer zur Kamera schauen. In der Rückansicht (Bild 17) und beim
   Winken funktioniert das, seitliches Gehen sieht man nicht.
9. **Das Auge in Bild 21** ist bewusst klein (Durchbruch 26 × 20 cm). Beim Hineinfahren ist es erkennbar, auf dem
   Handy aber knapp.
10. **Format:** gerendert in 1080 × 1920. Die Endfassung kommt wie gewohnt in 1440 × 2560.
11. Die älteren Test-Kompositionen (`CityWallTest`, `CityLookTest`) verwenden jetzt die neue Szenenliste. Sie sind
    durch dieses Video ersetzt.

## Technische Änderungen in dieser Etappe
- **Figuren** (`src/engine/human.ts`): Seitenansicht (stehen, gehen, rennen, sitzen, vorbeugen, Kopf heben, zeigen,
  winken, halten, greifen, Hammer), Gesten `hold_up` und `climb`, Option `propHand`. `toon.ts`: `faceSide` exportiert.
- **Regie** (`acting.ts`): Zahlenwerte (Vorbeugen, Kopf heben, Augenbrauen, Kopfneigung, Blick) gleiten weich;
  Klettern zählt die senkrechte Strecke.
- **`people.ts`**: Option „ganz zur Kamera drehen“ (Riesenfiguren).
- **`crowd.ts`**: Figuren näher als 4 m werden ausgeblendet.
- **Menge** (`lookdev/crowdV2.ts`): Hochschauen und Winken, auch von hinten.
- **Stadt** (`lookdev/cityV2.ts`): neuer Straßenquerschnitt, kleinerer Platz, Pavillon mit Fallrohr.
- **`citySet.ts`**:
  - gemeinsamer Putz mit dem Zimmer
  - Verschlussstück im Loch, Risse und Licht durch die Risse, Zeitachse des Durchbruchs auch vor dem Einschlag
  - Fahrspuren
- **`roomSet.ts`**: Gegenwand mit Durchbruch, Verschlussstück und Rissen.
- **`world.ts`**: Uhr und Zeitachse pro Einstellung, Rollen pro Einstellung, Erstarren/Hochschauen/Winken der Menge,
  Gehweg-Abstand, Story-Hook.
- **Neu:**
  - `production.ts`: Produktionswelt, Schild, Gegenwand, Fenster für Bild 7
  - `CityWallShort.tsx`: Komposition
  - `story.ts`: alle 24 Szenen
  - `scripts/pace_report.py`
  - `shorts/city-in-the-wall/story.json`: Tonvorbereitung
- **Sicherungen:** `src/engine/_backup/2026-11-06_before-full/`,
  `src/videos/city-in-the-wall/_backup/2026-11-06_before-full/`.
