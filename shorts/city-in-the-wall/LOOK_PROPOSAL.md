# Mini-Stadt: Qualitäts-Vorschlag (Look-Test v2, 2026-11-06)

**Noch nicht freigegeben.** Der bisherige Test (`CityWallTest`) ist unverändert. Der neue Look läuft getrennt als
`CityLookTest` mit **denselben Kameras**, damit Vorher und Nachher direkt vergleichbar sind.

- Vergleich: `out/city-in-the-wall/VERGLEICH_alt_oben_neu_unten.jpg` (oben alt, unten neu; Bilder 1, 5, 7, 8, 9, 9)
- Video des neuen Looks: `out/city-in-the-wall/CityWall_LOOKTEST_v2.mp4` (Bilder 1–9, ohne Ton)

Ziel: eine hochwertige, stilisierte 3D-Filmwelt, weder fotorealistisch noch Computerspiel. Die Figuren bleiben
gezeichnet, die warmen Fensterlichter und die Kameraführung bleiben.

## Was mit der bestehenden Three.js-Architektur möglich ist
Alles unten nutzt nur Vorhandenes:
- Three.js-Geometrie und die Zwei-Ton-Materialien der Engine
- die gemalten HD-Texturen aus der Bridge-Produktion (Ziegel, Stein, Dachziegel, Pflaster)
- Leuchten (Bloom), Objektiv-Unschärfe, Farbkorrektur und Tusche-Linien

Keine neuen Pakete, keine Änderung an `@react-three/postprocessing` 3.0.4 und keine Änderung an der Render- oder
Ton-Pipeline.

| Wunsch | Im Look-Test umgesetzt | Weiter möglich (nach Freigabe) |
|---|---|---|
| **1. Gebäude** | Schmale Stadthäuser entlang der Blockränder statt großer Kisten: 2–5 Geschosse, Giebel- und Flachdächer, Schornsteine, Gauben, echte Fensterrahmen, Fensterbänke, Stürze, Sprossen, Fensterläden, Gesimse, Sockel, Ladenfronten mit Markisen und Schildern, Haustüren mit Stufe, Balkone mit Geländer | Erker, Rundbögen, Fachwerk, Eckhäuser mit Türmchen, Dachrinnen und Fallrohre, Blumenkästen, verschiedene Ladentypen |
| **2. Materialien** | Putz in 8 Farben (fleckig, leichte Regenspuren), gemalte Ziegel, Natursteinsockel, Dachziegel und Schiefer, Pflaster, Gehwegplatten mit Bordstein, Holz | Schmutz an Hauskanten und Sockeln, unterschiedlich verwitterte Fassaden, Pfützen mit Lichtspiegelung, Moos an Dächern |
| **3. Licht** | Warmes Licht strömt durch das Loch, kühles blau-violettes Umgebungslicht füllt die Schatten (Warm-Kalt-Kontrast), dunklere und trotzdem lesbare Schatten, warme Lichtflecken unter Laternen und Schaufenstern, Fenster mit Vorhängen und Silhouetten, Laternen mit leuchtendem Glas, Dunst in die Tiefe, filmische Farbkorrektur (S-Kurve, kühle Schatten, warme Lichter, Vignette) | Lichtschimmer von Fenstern auf Fassaden, gezielte Punktlichter in Nahaufnahmen, Lichtstrahlen aus dem Loch (neu gebaut als weiche Lichtbahnen), **gebackene Umgebungsverdeckung** (dunkle Kanten in Ecken und an Bodenkanten) |
| **4. Menge** | 30 Erscheinungsbilder statt 10 in ruhigeren Farben (Mäntel, Kleider, Mützen, Zylinder, Hauben, Brillen, Kinder, kräftige Figuren), 11 Haltungen statt 6 (gehen, stehen, im Gespräch nach links und rechts, tragen, Arme verschränkt, nachdenken, ducken), Gesprächsgruppen auf Platz und Vorplatz, gespiegelt, verschiedene Größen, Gehwege auf richtiger Höhe | Sitzende auf Bänken, Kinder an der Hand, Schlangen vor Läden, Leute an Fenstern, Fahrräder |
| **5. Kamera** | Stärkere, filmischere Tiefenschärfe in der Stadt (×1,5), Bäume und Brunnen als Vordergrund für Tiefe, Gehwege und Bordsteine als Tiefenlinien | Schärfeverlagerung von einer Figur zur nächsten, Lichtpunkte im Unscharfen (Bokeh) von Fenstern und Laternen gezielt im Bildhintergrund, je Bild passende Brennweite |

Zusätzlich:
- Das Auto hat ein echtes Profil mit Motorhaube, Kabine, Chromstoßstangen und Scheinwerfern.
- Der Platz hat Brunnen, Bänke und einen Baumring.

## Ehrliche Grenzen
- **Echtes indirektes Licht** (Licht, das von Wänden zurückstrahlt) und **Echtzeit-Umgebungsverdeckung (SSAO)** bräuchten
  einen zusätzlichen Effekt in der Render-Kette. Das wäre eine Änderung an der Pipeline, die ich ohne deine Freigabe
  nicht mache. Mein Vorschlag stattdessen: die Verdeckung in Texturen und Geometrie „einbacken“ (dunkle Kanten, Verläufe
  am Sockel) und leichte Rücklicht-Anteile im Material. Das wirkt ähnlich und kostet keine Stabilität.
- **Fensterlicht:** Die Leuchtstärke ist eine Stellschraube. Im Test ist sie bewusst ruhig, damit die Fassaden nicht
  ausbrennen. Sie lässt sich je Einstellung kräftiger machen, zum Beispiel für Bild 7 („glowing windows“).
- Weit entfernte Blöcke bleiben einfache Hausformen mit Fensterreihen. Im Dunst und in der Unschärfe ist der
  Unterschied nicht sichtbar, und es spart Rechenzeit.
- **Rechenzeit:** Der Aufbau der Stadt dauert pro Render-Durchgang einige Sekunden länger. Das Rendern selbst bleibt
  schnell: ca. 13 s für 14 s Video in 1080p.

## Technik (neu bzw. geändert)
| Datei | Art |
|---|---|
| `src/videos/city-in-the-wall/lookdev/cityV2.ts` | **neu**: Stadthäuser, Straßen, Laternen, Lichtflecken, Bäume, Brunnen, Bänke, Autos |
| `src/videos/city-in-the-wall/lookdev/crowdV2.ts` | **neu**: 30 Erscheinungsbilder, 11 Haltungen |
| `src/videos/city-in-the-wall/lookdev/LookTest.tsx` | **neu**: Look-Test-Komposition (Licht, Farbkorrektur, Tiefenschärfe) |
| `src/videos/city-in-the-wall/citySet.ts` | ergänzt: Option, die alten Häuser wegzulassen |
| `src/videos/city-in-the-wall/world.ts` | ergänzt: Optionen für Stadtbau, Licht, Farbkorrektur, Dunst, Menge, Tiefenschärfe (Standard = bisheriger Look) |
| `src/engine/crowd.ts` | ergänzt: Spiegeln einzelner Figuren |
| `src/Root.tsx` | Komposition `CityLookTest` angemeldet |

Sicherungen: `src/videos/city-in-the-wall/_backup/2026-11-06_before-lookdev/`.

## Vorschlag für die Umsetzung (nach Freigabe)
1. Den v2-Look zum Standard für diese Folge machen (`CityWallTest` → v2).
2. Die Punkte aus der Spalte „Weiter möglich“ nach deiner Auswahl umsetzen, Empfehlung in dieser Reihenfolge:
   - gebackene Verdeckung und Schmutzkanten
   - Lichtbahnen aus dem Loch
   - Fassaden-Lichtschimmer
   - sitzende und Fenster-Figuren
   - Schärfeverlagerung
3. Jeweils mit Vergleichsbild in derselben Kamera, wie hier.

---

## Version 3 (2026-11-06) – v2 als Standard + 6 Verbesserungen
- Video: `out/city-in-the-wall/CityWall_LOOKTEST_v3.mp4`
- Vergleich: `out/city-in-the-wall/VERGLEICH_v2_oben_v3_unten.jpg` (Bilder 1, 5, 7, 8, 9, 9)

| # | Wunsch | Umsetzung |
|---|---|---|
| 1 | Eingebackene Verschattung + Schmutzkanten | Dunkle Verläufe über dem Sockel, unter der Traufe, an beiden Hauskanten und auf dem Gehweg an der Hauswand; Schmutzspuren unter jeder dritten Fensterbank. Das sind halbtransparente Flächen in der Szene, die Render-Pipeline bleibt unverändert. |
| 2 | Weiche Lichtstrahlen durch das Loch | 15 schmale Strahlen fächern aus dem Loch und drehen sich zur Kamera. Schaut die Kamera fast entlang eines Strahls (Luftbild), blendet er sich aus, damit kein Schleier entsteht. Dazu ≈ 400 schwebende Staubteilchen. |
| 3 | Fensterlicht auf den Fassaden | Warmer Lichtschimmer um jedes leuchtende Fenster und jedes Schaufenster |
| 4 | Kräftigeres Fensterleuchten | Grundhelligkeit +30 %; je Einstellung regelbar (Bild 7 ×1,45, Bilder 5 und 6 ×1,2). Rund um die Nahaufnahme von Bild 7 leuchten alle Fenster. |
| 5 | Sitzende und Fenster-Figuren | Sitzende auf den Bänken am Brunnen und an 7 Café-Tischen vor der ersten Häuserreihe; Menschen an jedem 6. leuchtenden Fenster (Arme verschränkt oder winkend), unten am Fensterbrett abgeschnitten |
| 6 | Schärfeverlagerung | Bild 1: von der Wand und dem Loch zu den erschrockenen Mini-Menschen (auf „hole“); Bild 9: vom Brunnen zur Menge dahinter (auf „people“) |

**Unverändert:** Hauptfiguren, Render-Pipeline, Pakete und Mary Celeste (Vergleichsbild 600: 43 dB, praktisch identisch).

**Hinweis:** Weil neue Details hinzugekommen sind, wird jedes Haus anders ausgewürfelt als in v2. Die Stadt bleibt
gleich aufgebaut, einzelne Häuser sehen aber anders aus (z. B. Bild 7: jetzt ein Ziegelhaus). Ab der Freigabe ist die
Auswahl fest.

**Neu/geändert in v3:**
- `lookdev/cityV2.ts`: Verschattung, Schimmer, Strahlen, Staub, Café, Sitzplätze, Fensterplätze, Leuchtregler
- `lookdev/crowdV2.ts`: Haltungen sitzen, aus dem Fenster schauen, aus dem Fenster winken
- `lookdev/LookTest.tsx`: zusätzliche Figuren und Bild-Regler
- `story.ts`: zwei Schärfeverlagerungen
- `world.ts`, `engine/crowd.ts`: kleine, ergänzende Optionen (Zusatzfiguren, Hook pro Bild, abgeschnittene Figuren,
  feste Blickrichtung)
- Sicherung: `src/videos/city-in-the-wall/_backup/2026-11-06_before-look-v3/`
