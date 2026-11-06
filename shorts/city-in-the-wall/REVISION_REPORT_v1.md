# „The City Hidden Inside a Wall“ – Visuelle Überarbeitung (Bericht, 2026-11-06)

> Nachfolger: `REVISION_REPORT_v2.md` (v5, freigegeben). Offener Punkt 1 (dunkles Loch) und 5 (Schild) sind dort erledigt.

**Ergebnis**
- Video (ohne Ton, geschätzte Wortzeiten): `out/city-in-the-wall/CityWall_full_picture_v4.mp4`
  (1404 Bilder = 46,8 s, 1080 × 1920, 30 fps)
- Szenenübersicht: `out/city-in-the-wall/qa_full_v4/overview.jpg` (ein Bild aus der Mitte jeder Einstellung)
- Tempo: `qa_full_v4/pace.md`
- Loop-Prüfung: `qa_full_v4/loop.md` und `loop_seam.jpg`
- Technische Prüfung: `qa_full_v4/report.md`
- Kontaktbögen: `qa_full_v4/sheet_*.jpg`
- Vorversion zum Vergleich: `~/Downloads/Video Produktion/CityWall_full_picture_v2.mp4` (nur gelesen, nicht verändert)

## Prüfergebnisse
| Prüfung | Ergebnis |
|---|---|
| Loop: erstes Bild (0) gegenüber der freigegebenen Fassung | 58 dB, praktisch identisch |
| Loop: letztes Bild (1403) gegenüber der freigegebenen Fassung | 54 dB, praktisch identisch |
| Loop-Naht (letztes → erstes Bild) | 2,90 bei normalem Bildwechsel von 3,13 → **nahtlos** (wie vorher) |
| Mary Celeste, Bild 600, gegen die Referenz | 40 dB. Nur 0,07 % der Pixel weichen sichtbar ab, verstreut (Kanten-Rauschen): **unverändert** |
| Schwarze Bilder / Standbilder / ungeplante Weißblitze | keine |
| Plötzliche Sprünge | 21 statt 35 in v3. Fast alle sind gewollte Kamera-Stöße auf Wörter (z. B. „knocks“, „hammer“) oder Schnitte |
| TypeScript-Prüfung | fehlerfrei |
| Pakete / `@react-three/postprocessing` | keine neuen Pakete, Version 3.0.4 unverändert |

Keine kostenpflichtigen Aufrufe, keine ElevenLabs-Aufnahme, keine Uploads, keine Git-Commits.

## Änderungen nach deinen Punkten
| # | Problem | Ursache | Änderung |
|---|---|---|---|
| 1 | Stadt hinter der Wand wirkte verblasst, Wand wie ein Comic | Ein heller Leuchtschleier vor dem Loch, Wand nur eine dünne Fläche, gezeichnete Comic-Risse | Schleier entfernt. Die Wand ist jetzt 7,2 m dick (Stadtmaßstab) mit Putzoberfläche, sichtbarer Bruchkante, Putzbrocken am Rand und Latten-Resten. Comic-Risse ersetzt durch Licht, das durch feine Spalten dringt. Auch ein dunkles Rechteck um das Loch ist weg: Es war ein versehentlich wieder eingeblendeter Lichtschacht. |
| 2 | Figuren unscharf oder zu groß | Die Tiefenunschärfe zielte teils auf den Hintergrund, und die Figuren-Bildkarten waren zu niedrig aufgelöst | Die Schärfe liegt in jeder Einstellung auf der Hauptfigur. Die Auflösung der Figuren richtet sich jetzt nach ihrer Größe im Bild. Die Kameras wurden so gesetzt, dass Figuren in natürlicher Größe erscheinen. |
| 3 | Park (≈ s 12): zu viele Bäume | – | Weniger Bäume, Wege, Bänke, sichtbare Spaziergänger und Sitzende |
| 4 | Leos Wohnung unrealistisch | Raum fast leer | Möbliert: Bücherregal, Sofa, Couchtisch mit Tasse, Stehlampe, Hängelampe, Teppich, Fenster, Bilder, Türen. Gezieltes Raumlicht. |
| 5 | Mann, der nach oben schaut | Frontansicht mit verdrehtem Kopf | Seitenansicht: Er schaut hoch, zeigt nach oben und schreit dann erschrocken |
| 6 | Blick aus der Stadt durchs Loch: flaches, riesiges Gesicht | Gesicht war eine flache Fläche direkt im Loch | Hinter dem Loch steht jetzt Leos echte Wohnung im Maßstab 60:1 (Perspektive, Licht). Leo steht darin als Figur hinter der dicken Bruchkante. |
| 7 | Hammer und Durchbruch verschwanden in der Wand | Zeitpunkt und Kamera schnitten die Bewegung ab | Die ganze Schlagbewegung ist sichtbar: Hammer durchschlägt die Wand, dann zerbröselt der Pfropfen. Der Loop-Takt ist unverändert. |
| 8 | Menge ohne Stadt | Kamera zu nah und zu steil | Neuer Platz mit Häusern, Läden, Café, Bänken, Laternen und Gruppen. Einstellung 14 gleitet als Kamerafahrt von oben in den Platz hinein (räumlich lesbar). |
| 9 | Spätere Stadtaufnahme ohne Zusammenhang | – | Einstellungen 15, 17 und 22 zeigen jetzt Häuserfronten, Laternen und Läden |
| 10 | Kletternder Mann und Schild | Er schwebte, das Schild war abgeschnitten, und der Kopf verdeckte die Schrift | Er klettert ein Fallrohr hoch, steigt über die Dachkante und steht auf dem Dach. Beide Hände halten das Schild. Der Text „PLEASE DON'T / OPEN THE / NEXT WALL.“ steht vollständig über dem Kopf und ist lesbar. |
| 11 | Handwerker später unscharf oder zu groß | – | Einstellungen 20, 21b, 23 und 24a zeigen Leo scharf und in passender Größe, mit möblierter Wohnung im Hintergrund. In 24a steht Leo erschrocken vor der Wand, die gerade aufbricht. Vorher war er aus dem Bild bzw. sah aus, als würde er selbst hämmern. |
| 12 | Flüsterfiguren nicht im Stadtmaßstab | Rose zu groß, Kamera zu nah | Rose und eine Nachbarin stehen auf dem Gehweg vor dem Laden, mit Häusern darüber |
| 13 | Allgemein | – | Feste Zufallswerte, damit jeder Render identisch ist. Figuren halten Abstand zu Wänden, damit nichts hineinragt. Möbel werfen keine Schatten mehr auf die Stadt. Requisiten hängen an den Händen. |
| 14 | Loop | – | **Unverändert:** Anfangs- und Endbild, Durchbruch-Zeitpunkt, Rekursion, Aufbau (gemessen, siehe oben) |

**Zusätzlich behoben (Folgewirkungen)**
- Einstellungen 3 und 16 (Blick über Leos Schulter): Leo verdeckte das Loch. Er steht jetzt links daneben, und die Kamera schaut leicht von oben hinein, sodass man die Stadt im Loch sieht.
- Einstellung 24a: Eine Kamerabewegung war durch einen falsch platzierten Code-Kommentar abgeschaltet und läuft jetzt wieder.

## Geänderte Dateien
- Nur die Episode:
  - `src/videos/city-in-the-wall/`: `story.ts`, `world.ts`, `citySet.ts`, `roomSet.ts`, `production.ts`, `lookdev/cityV2.ts`, `lookdev/crowdV2.ts`
- Engine, nur ergänzend; Mary Celeste ist nachweislich unverändert:
  - `src/engine/people.ts`: Auflösung der Figuren nach Bildgröße, nur wenn eingeschaltet
  - `src/engine/human.ts`: Seiten- und Rückansicht, Hammer, Schild, Gesten zum Hochhalten und Klettern
  - `src/engine/acting.ts`: weiche Übergänge
  - `src/engine/crowd.ts`: Mindestabstand zur Kamera
- `scripts/pace_report.py`: Szenenübersicht und Loop-Prüfung

## Noch offene Probleme
1. **Loch von vorn gesehen (Einstellungen 2, 10, 13, 20):** Von vorn, auf Augenhöhe, sieht man durch das Loch vor allem den dunklen Nachthimmel der Mini-Stadt. Das Loch wirkt dann schwarz. Von schräg oben (3, 16) sieht man die Stadt. Lösungsmöglichkeiten:
   - Kameras etwas höher setzen
   - den Himmel der Mini-Stadt aus dem Zimmer heraus heller machen
2. **Schnitttempo:** Im Mittel 1,56 s pro Einstellung, also schneller als die geplanten 2–4 s. Das ist unverändert seit v2 und erst mit der echten Sprachaufnahme sinnvoll zu bewerten.
3. **Wortzeiten sind geschätzt.** Mit der echten Aufnahme verschieben sich alle Schnitte leicht. Das passt sich automatisch an, sollte aber erneut geprüft werden.
4. **Einstellung 18 (Klettern):** Der Mann ist eher klein im Bild, dafür ist der ganze Weg vom Rohr aufs Dach sichtbar. Falls du ihn größer möchtest, geht das mit einer näheren Kamera, dann ist aber weniger Hauswand zu sehen.
5. **Schild-Übergang (Einstellung 18 → 19):** Beim Hochnehmen erscheint das Schild für etwa 4 Bilder (0,13 s), bevor die Arme ganz oben sind. Das fällt kaum auf.
6. Ton, Musik und Sprachaufnahme sind weiterhin nicht freigegeben bzw. nicht produziert.

Sicherungen der Vorversionen: `src/videos/city-in-the-wall/_backup/`
