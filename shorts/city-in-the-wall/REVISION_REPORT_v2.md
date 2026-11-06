# „The City Hidden Inside a Wall“ – Nachbesserung 2 (2026-11-06)

> **FREIGEGEBEN (2026-11-06, Adrian):** `CityWall_full_picture_v5.mp4` ist die aktuelle freigegebene visuelle Fassung.
> Bild, Loop und Szenenfolge werden ab jetzt nur noch durch die echten Wortzeiten der Aufnahme verschoben.

**Ergebnis**
- Video (ohne Ton): `out/city-in-the-wall/CityWall_full_picture_v5.mp4` (1404 Bilder = 46,8 s)
- Szenenübersicht: `out/city-in-the-wall/qa_full_v5/overview.jpg`
- Prüfberichte: `qa_full_v5/` (pace.md, loop.md, report.md, Kontaktbögen)
- Vorversion v4 liegt unverändert in `~/Downloads/Video Produktion/`

## 1. Loch in den frontalen Einstellungen 2, 10, 13 und 20
**Ursache:** Auf Augenhöhe führt der Blick durch das Loch waagerecht über die Dächer der Mini-Stadt in den Nachthimmel. Der Hintergrund dort war fast schwarz (#1d161c).

**Änderungen, nur in diesen vier Einstellungen:**
| Einstellung | Kamera | Wirkung |
|---|---|---|
| 02 Leo | 45 cm höher, schaut leicht nach unten | Dächer, Gassen und Fenster füllen das untere Zwei-Drittel des Lochs |
| 10 model | Blickwinkel von 4° auf 14° von oben | Stadt neben Leos Kopf sichtbar |
| 13 lean | höher und frontaler (vorher fast parallel zur Wand, dort verdeckte die Wanddicke alles) | Stadt im Loch sichtbar, Bruchkante bleibt räumlich |
| 20 froze | Blickwinkel von 2° auf 8°, leicht seitlicher | Stadt hinter Leos Schulter sichtbar. Die Hängelampe ragt nur noch als Ecke ins Bild |

**Gezielte Aufhellung, nur im Loch und nur in diesen vier Einstellungen:**
- Der Himmel hinter der Mini-Stadt ist jetzt ein tiefes Nachtblau (#2a2840) statt fast Schwarz. Er bleibt dunkel und deckend, ohne Schleier und ohne Überbelichtung.
- Die Fenster der Mini-Stadt leuchten in diesen Einstellungen 35 % stärker. Dafür gibt es denselben Regler, der auch in Einstellung 22 benutzt wird.
- Licht, Farbkorrektur und Wand sind sonst unverändert.

## 2. Schild beim Hochnehmen (Einstellung 18)
- **Vorher:** Das Schild erschien schon in dem Moment, in dem die Arme losgingen.
- **Jetzt:** Die Arme gehen erst ohne Schild hoch. Das Schild erscheint 2 Bilder nach dem Wort „held“, wenn die Arme ganz oben sind. Geprüft Bild für Bild (969–979).
- Keine Nebenwirkung: Einstellung 19 ist unverändert, das Schild ist dort vollständig lesbar.

## Prüfungen
| Prüfung | Ergebnis |
|---|---|
| Bild-für-Bild-Vergleich v5 gegen v4 | Geändert sind **nur** die Bilder 56–92 (Einstellung 2), 413–488 (10, inkl. Überblendung), 616–662 (13, inkl. Überblendung), 970–974 (Schild) und 1069–1101 (20). Alle anderen Bilder sind identisch. |
| Loop: Bilder 0 und 1403 | identisch mit v4. Gegen die freigegebene v2: 58 / 54 dB |
| Loop-Naht | 2,90 (normal 3,13) → **nahtlos** |
| Schwarze Bilder / Standbilder / Weißblitze | keine |
| TypeScript | fehlerfrei |
| Mary Celeste | nicht berührt: In dieser Runde wurde keine Engine-Datei geändert |

Unverändert wie gewünscht: Schnitttempo, Einstellung 18 (außer dem Schild-Zeitpunkt), Loop.

## Geänderte Dateien
- `src/videos/city-in-the-wall/story.ts`: vier Kameras, Regler für Himmel und Fenster an vier Einstellungen, Schild-Zeitpunkt
- `src/videos/city-in-the-wall/world.ts`: neue Option „Himmelfarbe im Loch“, nur in Zimmer-Einstellungen, die sie ausdrücklich setzen
- Sicherung vorher: `src/videos/city-in-the-wall/_backup/2026-11-06_before-hole-light/`

## Noch offen
- Schnitttempo (1,56 s im Mittel) und Wortzeiten bleiben bis zur echten Aufnahme vorläufig
- Ton, Musik und Sprachaufnahme sind nicht freigegeben
