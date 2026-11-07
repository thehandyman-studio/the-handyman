# „The Storm Hiding in the Attic“ – Soundplan v2 (ENTWURF 2026-11-06, auf Skript v2 angepasst, wartet auf Freigabe)

**Status:** nur Planung. Noch keine Stimme, kein Mix, kein Render.
Alle Zeiten sind **geschätzt** (`voice/estimate/words_estimated.json`). Im Mischskript hängt jedes Ereignis an einem **Wort**, nicht an einer Sekunde. Nach der Aufnahme rechnen sich alle Zeiten von selbst neu.

**Umsetzung:** eigenes Mischskript `scripts/audio/stormmix.py` nach dem Muster `scripts/audio/citymix.py`, Geräusche in `scripts/audio/sfx_storm.py` nach dem Muster `sfx_city.py`.
- `dsp.py`, `instruments.py`, `shortmix.py`, `sfx_gen.py` werden nur **importiert**, nicht geändert (Mary Celeste und der Pilot bleiben unverändert).
- Alles lokal synthetisiert, keine fremden Samples, keine Downloads.
- Loop-sicher: alles liegt auf einem Ring-Puffer, auch der Limiter. Kein Fade am Ende.

## 1. Pegel (aus `docs/HANDYMAN_STANDARD.md` §8)
| Ebene | Ziel | unter Sprache |
|---|---|---|
| Gesamt | **−14 LUFS**, True Peak ≤ −1 dBTP | – |
| Stimme (V3) | −15 LUFS vor dem Mix | Referenz, immer vorn |
| Musik | −18,5 LUFS, Hochpass 38 Hz | −10 dB und zusätzlich −4 dB bei 1–4 kHz |
| Atmo | −26 LUFS, Hochpass 70 Hz | −6 dB |
| Effekte | −25 LUFS | −3 dB; Schlüssel-Effekte möglichst in Sprechlücken |
| Prüfung | Stimme minus Rest im Median ≥ 12 dB, Wort für Wort | |

## 2. Musik
- **Tonart d-Moll**, Tempo so gewählt, dass **17 ganze Takte** genau die Videolänge füllen (bei 47,70 s: 85,5 BPM). Der Wert wird nach der Aufnahme aus der echten Länge neu berechnet.
- **Leitmotiv:** das Celesta-Motiv A–D–F–E aus dem Pilot, das musikalische Markenzeichen.
- **Neue Klangfarbe dieser Folge:** „Regen-Pizzicato“ (kurze, gezupfte Töne wie Tropfen) und ein tiefes Donner-Pauken-Grollen.

| Abschnitt | Wörter (≈ s) | Stimmung | Instrumente |
|---|---|---|---|
| A Leck | Anfang – „Mrs“ (0–5,4) | trocken, neugierig | Tropfen-Pizzicato im Takt der Eimer, leiser Bordun. Auf „forty“ ein heißer, flirrender Akkord |
| B Eimer und Leiter | „Mrs“ – „Between“ (5,4–10,6) | verschmitzt, dann gespannt | Pizzicato-Muster aus 12 Tönen (die Eimer); beim Klettern steigt eine Tonleiter mit |
| C Die Wolke | „Between“ – „He raises“ (10,6–15,3) | staunend | **Celesta-Motiv** voll, Streicherteppich, weiches Glockenspiel |
| D Drohung | „He raises“ – „So he lowers“ (15,3–22,4) | gefährlich, schnell | Tiefe Streicher-Ostinati, Herzschlag-Pauke. Auf „growls“ Pauken-Wirbel. Auf „Lightning“ ein Streicherstich. Nach dem Sprung ein komischer Pizzicato-Abwärtslauf |
| E Zähmung | „So he lowers“ – „The rain stops“ (22,4–25,8) | sanft | Nur Celesta und gehaltener Akkord |
| F Hand-Moment | „The rain stops“ – „He opens“ (25,8–34,3) | zart, warm, dann zerbrechlich | Auf „The rain stops“ **Stille** (0,8 s). Dann das Motiv langsam in Dur, Celesta solo, sehr leise. Auf „trembling“ ein feines Tremolo der hohen Streicher (die Angst kündigt sich an) |
| G Fenster | „He opens“ – „In every“ (34,3–38,5) | hell, dann kippend | Offener Dur-Akkord beim Öffnen; auf „why“ bricht alles ab, nur ein hoher Streicherton |
| H Die Stadt | „In every“ – „The handyman looks“ (38,5–44,4) | unheimlich | Das Motiv tief und in Moll, langsam, tiefer Bordun, gedämpftes Blech. Auf „scared“ ein dunkler Schlag |
| I Der Himmel | „The handyman looks“ – Ende (44,4–47,7) | höchste Spannung | Herzschlag, großer Riser ab „sky“. **Donnerschlag** auf „back“, rollt über die Naht in den Anfang |

## 3. Atmosphäre je Ort (0,35 s Überblendung an Schnitten)
| Ort | Einstellungen | Klang |
|---|---|---|
| Flur Whitlock | 1, 2, 4 | Raumton, tickende Standuhr, Tropfen in Eimer, draußen gedämpfte Zikaden |
| Stadt (trocken) | 3, 18–20 | Hitze: Zikaden, ferner Hund, trockener Wind, kein Verkehr. In 19–20 zusätzlich leises Wind-Wimmern aus den Fenstern |
| Leiter / Luke | 5 | knarrende Sprossen, Regen gedämpft von oben |
| Dachboden | 6–17 | Holzknacken, feiner Regen auf Dielen und Pfütze (Stärke folgt der Wolke), Wind in den Balken bei Donner. Ab „The rain stops“ nur noch Raumton |
| Himmel | 21–22 | fast Stille, tiefes Grollen von sehr weit oben |

## 4. Effekte – Zeitplan (an Wörtern)
| Wort (≈ s) | Bild | Effekt | Stärke |
|---|---|---|---|
| Bild 4 (0,13) | 1 | **Tropfen landet im vollen Eimer** (*plink* + kleiner Platscher), gleichzeitig Ausklang des Donners von der Naht | Schlüssel |
| „ceiling“ (≈ 2,0) | 2 | zweiter Tropfen in den Eimer | klein |
| „twelve“ (≈ 6,4) | 4 | Tropfen in mehrere Eimer, 12 Tonhöhen (Teil der Musik) | klein |
| „climbs“ (≈ 8,1) | 5 | Leitersprossen, 4 Tritte, Knarren | klein |
| „Between“ (10,6) | 6 | Regenrauschen wird lauter | mittel |
| „tiny“ (≈ 12,4) | 7 | weiches Wolken-Rauschen, Glitzern | klein |
| „black“ (≈ 17,8) | 9 | Wind schwillt an, Holz ächzt | mittel |
| **„growls“ (≈ 18,3)** | 9 | **Donnergrollen** (tief, lang) | Schlüssel |
| **„Lightning“ (18,7)** | 10 | **Blitzknall**: harter Knall, Knistern, Funken | Schlüssel |
| „jumps“ (≈ 21,1) | 11 | Sprung (Stoff), Landung auf Dielen, *tsss* vom Hammer | mittel |
| „lowers“ (≈ 22,8) | 12 | Hammer berührt leise den Boden | klein |
| „The rain stops“ (25,8) | 13 | Regen bricht ab, ein letztes *plink* (dicker Tropfen, Bild +6) | Schlüssel (durch Stille) |
| „drifts“ (≈ 27,8) | 14 | weiches Wind-Schnurren | klein |
| „sleeping“ (≈ 31,2) | 15 | ganz leises „Atmen“ der Wolke (gefilterter Wind) | sehr leise |
| „trembling“ (≈ 33,6) | 16 | feines Zittern (Tremolo, Teil der Musik) | klein |
| „opens“ (≈ 34,6) | 17 | Fensterriegel, Flügel schwingen auf, Außenwelt wird hörbar | mittel |
| „hides“ (≈ 36,3) | 17 | Husch (Wolke hinter die Schulter) | klein |
| „why“ (≈ 38,2) | 18 | Musik-Abbruch, hoher Ton | – |
| „every“ (≈ 38,7) | 19 | viele kleine Fensterläden klappern nacheinander (Welle) | klein |
| „scared“ (≈ 42,6) | 20 | tiefes, fernes Grollen | mittel |
| „looks up“ (≈ 44,9) | 21 | Herzschlag | klein |
| **„back“ (≈ 46,6)** | 22 | **Donnerschlag**, läuft über die Naht in Bild 1 | Schlüssel |
| Bild −12 bis 4 | 22 → 1 | der fallende Tropfen: leises Pfeifen der Luft, endet im *plink* | klein |

## 5. Loop
- Der Donnerschlag am Ende und der Tropfen am Anfang liegen auf demselben Ring-Puffer. Was über das Ende hinausklingt, läuft am Anfang weiter.
- Musiktempo = ganze Takte auf die Videolänge, damit der Puls an der Naht nicht stolpert.
- Prüfung: Loop-Probe 3× hintereinander, ohne Klick (wie im Pilot).
