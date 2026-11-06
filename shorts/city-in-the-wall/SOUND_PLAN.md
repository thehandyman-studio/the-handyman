# „The City Hidden Inside a Wall“ – Soundplan (Entwurf 2026-11-06, wartet auf Freigabe)

**Status:**
- Bisher nur Planung: noch keine Mischung, kein Render, kein Download, keine neuen Pakete.
- Stimme, Bild v5 und Loop sind unverändert. Mary Celeste ist unberührt.

**Grundlage:**
- Stimme **V3** `voice/takes/john_mrab_v1_V3/voice_master.wav` (siehe `SELECTED.md`)
- Wortzeiten `words_master.json`
- Alle Zeiten unten in Sekunden ab Videostart, aus diesen Wortzeiten berechnet
- Videolänge mit V3: **45,83 s (1375 Bilder)**

---

## 0. Vorbedingung: Bild auf die echten Wortzeiten umstellen (braucht deine Freigabe)
Das freigegebene Bild v5 läuft noch auf **geschätzten** Wortzeiten (46,8 s). Die echten Zeiten von V3 weichen davon bis zu 1 s ab, im Schnitt 0,3 s früher. Damit Geräusche und Bild synchron sind, muss das Bild dieselben Wortzeiten benutzen. Das war von Anfang an so vorgesehen und ist ein einzeiliger Wechsel in `story.ts`.
- **Bildinhalte, Kameras und Loop-Aufbau bleiben gleich.** Nur die Schnittpunkte verschieben sich um wenige Zehntelsekunden, das Video wird 1 s kürzer.
- **Danach nötig:** Loop-Naht und Szenenübersicht neu prüfen.
- **Auffällig:** Einstellung 04d („pipes“) wäre mit V3 nur 0,24 s lang (vorher 0,4 s). Vorschlag: ihren Start 3 Bilder früher setzen. Das ist eine winzige Bildänderung, ebenfalls nur mit deiner Freigabe.

## 1. Lautstärke-Verhältnisse (für die ganze Mischung)
| Ebene | Ziel | Bezug zur Stimme |
|---|---|---|
| **Gesamtmischung** | −14 LUFS integriert, True Peak ≤ −1 dBTP (YouTube-Norm) | – |
| **Stimme (V3)** | bleibt wie gemastert, in der Mischung ≈ −14,5 LUFS | Referenz, **immer vorn** |
| **Musik** | ≈ −28 LUFS (Stem). **Unter Sprache** automatisch abgesenkt (≈ −7 dB, weiche Hüllkurve aus den Wortzeiten). In Sprechpausen bis ≈ −22 LUFS kurzzeitig | unter Sprache 16–20 dB leiser, in Lücken 8–12 dB leiser |
| **Atmosphäre** | Stadt ≈ −32 LUFS, Wohnung ≈ −38 LUFS. Unter Sprache −5 dB | 20–26 dB leiser |
| **Kleine Effekte** (Schritte, Putzkrümel, Rascheln) | Spitzen ≈ 18–22 dB unter der Stimme | kaum bewusst hörbar, „spürbar“ |
| **Schlüssel-Effekte** (Durchbruch, 3× Klopfen, Treffer auf „NEXT“) | Spitzen 3–6 dB unter der Stimme, möglichst in Sprechlücken | deutlich hörbar, nie über der Stimme |
| **Stimm-Schutz** | Musik und Atmo werden zusätzlich zwischen 1 und 4 kHz leicht abgesenkt (≈ −3 dB), solange John spricht | Verständlichkeit |

## 2. Musik – Aufbau (Tonart D-Moll, 83,78 BPM = genau 16 Takte auf 45,83 s, damit der Puls am Loop nicht stolpert)
| Abschnitt | Zeit | Stimmung | Instrumente (Empfehlung) |
|---|---|---|---|
| A **Anfang / Entdeckung** | 0,00–7,47 | geheimnisvoll, neugierig | Der Durchbruch-Treffer bei 0,03 s klingt in einem tiefen Bordun aus. Pizzicato-Streicher tasten sich vor, dazu ein leises Celesta-Motiv („kleine Welt“). Auf „insulation / bricks / pipes“ je ein trockener, gedämpfter Ton (passend zu den roten Kreuzen). |
| B **Die Stadt** | 7,47–14,27 | staunend, lebendiger | Auf „It was“ (7,54) öffnet sich die Musik: warmer Streicher-Teppich, Celesta und Glockenspiel spielen das Motiv voll. Leichter Puls aus Pizzicato und Shaker. Aufschwung bis „thousands“ (11,68). |
| C **Modell?** | 14,27–16,13 | kurz zurückgenommen, verschmitzt | Nur Celesta und ein gehaltener Akkord |
| D **Begegnung** | 16,13–22,10 | zunehmend spannend | Ab „But then“ (16,21) wechselt die Harmonie nach Moll, tiefe Streicher-Ostinati, Herzschlag-Pauke. Auf den Mini-Schrei (≈ 20,5) ein kurzer Streicherstich. |
| E **Stillstand** | 22,10–26,13 | Spannung durch Leere | Auf „stopped“ (23,84) bricht alles ab, nur ein hoher, gehaltener Streicherton und Sub-Bordun bleiben. Auf „Then they all looked up“ (24,74) schwillt ein Akkord an. |
| F **Winken** | 26,13–29,70 | kurz warm, aber unsicher | Celesta-Motiv in Dur, zögerlich, ohne Puls |
| G **Warnung auf dem Dach** | 29,70–35,13 | düster, bedrohlich | Tiefes Blech und Kontrabass, gedämpfte Trommel. Auf „held“ (31,83) leiser Aufschlag. Auf „NEXT“ (34,45) ein dunkler Treffer (Sub + Pauke + Blechstoß), synchron mit dem Bild-Ruck. |
| H **Erstarren** | 35,13–36,30 | angehaltene Luft | Fast Stille, nur ein hoher Ton |
| I **Drei Klopfer** | 36,30–38,83 | musikalischer Spannungsaufbau | Jeder Klopfer (36,90 / 37,20 / 37,47) wird von Pauke und tiefem Streicherstich gedoppelt, jeweils lauter. Danach ein beschleunigender Herzschlag. |
| J **Flüstern** | 38,83–42,00 | unheimlich, sehr leise | Dunkler, langsamer Puls. Bei „He's found us again“ (40,79–41,83) fast nur noch Bordun, damit das Flüstern frei steht. |
| K **Schluss** | 42,00–45,83 | dramatischer Höhepunkt | Ab „The handyman stepped back“ wächst alles zusammen: Ostinato, Riser, Becken-Swell. Auf „hammer“ (44,19) ein Schlag in der Musik. Ab „struck“ (44,66) großer Riser bis zum Ende, 0,1 s vor dem Ende ein kurzes Luftholen (Stille). Der Treffer selbst fällt auf den **Anfang** (Loop, siehe 5). |

## 3. Atmosphäre (je Ort, mit 0,35 s Überblendung an den Schnitten)
| Ort | Bild-Einstellungen (Zeit mit V3) | Klang |
|---|---|---|
| **Stadt** | 1 (0–1,40), 5–9 (7,47–14,27), 11–12b (16,13–20,70), 14–15 (22,10–26,13), 17–19 (27,50–35,13), 22 (38,83–42,00), 24b (44,60–45,83) | **Lebendige Mini-Stadt:** Stimmengewirr (hochgestimmt, „klein“), ferne Mini-Autos und Hupen, Fahrradklingel, Café-Geschirr, Schritte auf Pflaster, Tauben. Stereo breit, leicht hell. |
| **Wohnung** | 2–4 (1,40–7,47), 10 (14,27–16,13), 13 (20,70–22,10), 16 (26,13–27,50), 20–21b (35,13–38,83), 23–24a (42,00–44,60) | **Dezent:** Raumton, ferne Straße hinter dem Fenster, ganz leise tickende Uhr. Dazu die **Stadt gedämpft durch das Loch** (Tiefpass, −12 dB, nur in den Einstellungen, in denen das Loch zu sehen ist). |
| **Sonderregeln** | | Auf „stopped“ (23,84) verstummt die Stadt schlagartig. Ab „Then they all looked up“ (24,74) kommt nur ein Rascheln zurück. In der Flüsterszene (38,83–42,00) ist die Stadt fast still: wenige ängstliche Mini-Stimmen, kein Verkehr. |

## 4. Soundeffekte – Zeitplan
| Zeit (s) | Bild | Effekt | Lautstärke |
|---|---|---|---|
| **0,03** | 1 Durchbruch | **Hammerschlag + Mauerbruch:** Holz-/Metall-Aufschlag, Putz bricht, tiefer Sub-Boom. Durch den Loop ist das gleichzeitig das Ziel des Risers am Ende. | Schlüssel (−3 dB rel.) |
| 0,15–1,40 | 1 | **Herabfallender Putz und Brocken:** Krümel-Rieseln, 4–6 einzelne Brocken auf Pflaster (in der Stadt), Staub | klein |
| 0,25–1,30 | 1 | Erschrockene Mini-Menschen: kurze hohe Rufe und Keuchen, gestreut | klein |
| 1,40–2,00 | 2 Leo | nachrieselnder Putz in der Wohnung, ein Brocken fällt auf den Boden (Leo-Seite) | klein |
| 5,73 / 6,51 / 7,23 | 04b–d | gedämpftes „Tock“ zu jedem roten Kreuz (Teil der Musik) | klein |
| 7,47 | 5 Reveal | Luftzug („whoosh“) in die Stadt, Glitzer der Celesta | mittel |
| 9,70 | 7 Fenster | Fensterflügel, leise Mini-Stimmen im Haus | klein |
| 10,67–11,40 | 8 Auto | **Mini-Auto** fährt am Bild vorbei (hohes Motorsurren mit Stereo-Bewegung) + kurzes Mini-Hupen | mittel-klein |
| 11,40–14,27 | 9 Tausende | Stimmengewirr schwillt an, Schritte, Fahrradklingel | Atmo |
| 17,56 / 18,16 | 11 | Mini-Mann schaut hoch / zeigt: kurzer Stoff-Rascheln-Akzent | klein |
| **≈ 20,45** | 12b Schrei | **Mini-Schrei:** hohe, kurze, panische Stimme (0,5 s), danach 2–3 weitere entfernt | mittel, zwischen „screaming“ und „The handyman“ |
| 20,80 | 13 | Dielenknarren, als Leo sich vorbeugt | klein |
| **23,84** | 14 | Stadt verstummt **schlagartig** (Atmo-Schnitt) | – |
| 24,80–25,60 | 15 | Tausende drehen die Köpfe: breites, weiches Rascheln | klein |
| 28,84 | 17 Winken | leises Mini-Raunen und Winken (Stoff) | klein |
| 30,00–31,20 | 18 Klettern | **Kletterbewegung:** Hände am Fallrohr (metallisches Klicken), Schuhe schrammen an der Wand, Ächzen (Mini) | klein-mittel |
| 31,20–31,80 | 18 Dach | **Dachschritte:** 3–4 Schritte auf Ziegeln, ein Ziegel klappert | klein-mittel |
| 31,90 | 18 Schild | Schild wird hochgerissen (Luftzug, Holzbrett) | klein |
| 34,45 | 19 „NEXT“ | dunkler Treffer (Musik) + Bild-Ruck | Schlüssel |
| 35,13 | 20 erstarrt | alles wird still, nur Raumton | – |
| **36,90 / 37,20 / 37,47** | 21 Klopfen | **Drei deutliche Klopfer:** schwer, durch die Wand (Faust auf Putz und Holz), mit Sub-Druck. Bei jedem rieselt Putz und klirrt die Hängelampe leicht. Steigende Lautstärke 1 → 3. | Schlüssel (der 3. am lautesten) |
| 38,90–42,00 | 22 Flüstern | ganz leises Mini-Flüstern mehrerer Stimmen unter Johns Flüstern, ein Kind wimmert kurz | sehr leise (−24 dB rel.) |
| 42,10 / 42,50 | 23 | Leo tritt zurück: zwei Schritte auf Dielen | klein |
| **44,19** | 24a „hammer“ | Schlag von außen an die gegenüberliegende Wand: Riss, Staub, Lampe schwingt | mittel-groß |
| 44,60–45,73 | 24b | Risse knistern, Licht summt durch die Spalten. Riser wächst. Hammer holt aus (Luftzug ab 45,45) | wachsend |
| 45,73–45,83 | Ende | 0,1 s Luftholen (fast Stille), dann Loop → Treffer bei 0,03 | – |

## 5. Akustischer Loop
- Die Mischung wird **kreisförmig** gebaut. Alles, was über das Ende hinausklingt (Hall, Riser-Spitze, Atmo), wird an den Anfang addiert. Am Übergang gibt es also keinen Sprung und keinen Fade.
- Musik und Atmo laufen am Ende in die Stadt-Atmo und den Bordun des Anfangs hinein. Ende (Einstellung 24b) und Anfang (Einstellung 1) sind derselbe Ort und dieselbe Atmo.
- Das Tempo ist so gewählt, dass genau 16 Takte ins Video passen. Der Puls läuft über den Loop weiter.
- **Prüfung danach:** Ich messe die Naht wie beim Bild (Pegelsprung am Übergang gegenüber dem normalen Verlauf) und erstelle eine Hördatei, die das Video 3× hintereinander abspielt.

## 6. Vorhandene und benötigte Audiodateien
**Vorhanden ✔**
- Stimme V3 und Wortzeiten
- Klang-Werkzeuge (eigene Synthese, lizenzfrei, schon für die Brücke und Mary Celeste benutzt):
  - `scripts/audio/instruments.py`: Streicher-Teppich, Pizzicato, Celesta/Spieluhr, Glockenspiel, Vibraphon, Pauke, Becken, Blech, Trommel
  - `scripts/audio/sfx_gen.py`: Luftzug, Knarren, Hammerschlag, Holzbruch, Klirren, Rasseln, Schritte, Stimmen/Gewirr mit Größenregler (für Mini-Stimmen), Ausrufe
  - `scripts/audio/shortmix.py`: Riser, Boom, Absenken unter Sprache, Mastering auf −14 LUFS
- **Keine** fertigen Musik- oder Geräusch-Aufnahmen im Projekt (alles wird erzeugt)

**Noch zu bauen** (lokal, kostenlos):
- Neue Datei `scripts/audio/citymix.py` (eigene Mischung für diese Folge) und `scripts/audio/sfx_city.py` (neue Geräusche).
- `shortmix.py` und `sfx_gen.py` bleiben **unverändert**, damit Mary Celeste garantiert gleich klingt.

| Benötigt | Weg |
|---|---|
| Stadt-Atmo (Mini-Gewirr, Mini-Verkehr, Hupe, Klingel, Geschirr, Tauben) | Synthese aus vorhandenem Gewirr (hochgestimmt) + neuer Mini-Motor |
| Wohnungs-Raumton, Uhr, ferne Straße | Synthese (vorhandener Innenraum-Teppich; Uhr-Ticken neu) |
| Durchbruch: Hammer, Putzbruch, Brocken, Rieseln | Synthese aus Hammerschlag + Holzbruch + Rasseln, neu kombiniert |
| Mini-Schrei, Mini-Rufe, Mini-Flüstern | Synthese aus der Stimmformung (`vox`) mit kleiner Größe |
| Drei Klopfer durch die Wand | neu: Faust auf Putz und Holz mit Sub-Druck |
| Kletterklicks, Dachziegel-Schritte, Stoffrascheln | neu, aus vorhandenen Bausteinen (Klirren, Schritt, Rauschen) |
| Riss-Knistern, Licht-Summen | neu (Knarren und Rauschen) |
| Musik (Abschnitte A–K) | neue Partitur aus den vorhandenen Instrumenten |

**Optional: echte Aufnahmen für mehr Realismus.** Am meisten Wirkung hätten: Hammer auf Putz, Putz- und Mauerbrocken, Klopfen an Wand oder Tür, Schritte auf Dachziegeln. Die Lizenzen nenne ich nach meinem Wissensstand, bitte vor dem Herunterladen auf der Seite selbst prüfen:
- **Freesound.org:** Nur Sounds mit **CC0** nehmen (frei, ohne Namensnennung) oder mit CC-BY (Namensnennung in der Videobeschreibung). Keine „NC“-Lizenzen. Kostenloses Konto nötig, du müsstest selbst herunterladen.
- **Sonniss „GDC Game Audio Bundle“:** große, professionelle Pakete, kommerziell frei und ohne Namensnennung. Mehrere GB groß.
- **Pixabay Sound Effects:** frei nutzbar ohne Namensnennung (Pixabay-Lizenz).
- **YouTube Audio Library** (in YouTube Studio): Musik und Effekte, für YouTube-Videos frei. Manche Titel verlangen Namensnennung.
- **Nicht geeignet:** BBC Sound Effects (Lizenz nur für nicht-kommerzielle Nutzung) und Musik mit unklarer Content-ID-Registrierung (Gefahr von Ansprüchen auf dem Kanal).

## 7. Empfehlung zur Musik
**Eigene, für dieses Video komponierte Partitur aus unseren Instrumenten (kostenlos, keine Lizenzrisiken).**
- **Warum:**
  - Sie folgt exakt den sechs gewünschten Stimmungen und den Wortzeiten.
  - Sie trifft die Bildakzente: Schrei, „NEXT“, Klopfer, Hammer.
  - Sie ist auf genau 16 Takte gebaut und dadurch **nahtlos loopbar**. Das schafft fertige Musik aus Bibliotheken praktisch nie.
  - Keine Content-ID-Ansprüche und keine Namensnennung.
- **Leitmotiv:**
  - Ein kurzes Celesta-Motiv aus 4 Tönen steht für die Mini-Stadt.
  - Es kommt in jedem Abschnitt anders gefärbt wieder: neugierig, staunend, unsicher, bedrohlich (tief im Blech).
  - Im Schluss erklingt es als großer Akkord, und der Treffer am Loop-Anfang löst es auf.
- **Ehrliche Grenze:** Unsere Instrumente sind synthetisch. Sie klingen filmisch und sauber, aber nicht wie ein echtes Orchester.
- **Fallback:** Wenn dir das nach dem ersten Hörtest nicht hochwertig genug ist, kannst du 1–2 passende Titel aus der YouTube Audio Library herunterladen. Ich schneide sie dann auf die Abschnitte, und die Akzente und den Loop baue ich mit unseren Effekten darüber.

## 8. Vorgeschlagener Ablauf nach deiner Freigabe
1. Bild auf V3-Wortzeiten umstellen (+ 04d drei Bilder früher), Loop und Übersicht prüfen
2. `sfx_city.py` und `citymix.py` bauen. Einzelne Hörproben: Durchbruch, Klopfer, Mini-Schrei, Stadt-Atmo, Musik-Skizze
3. Kurze Freigabe der Hörproben durch dich
4. Ganze Mischung, Loop-Hörprobe 3×
5. Video mit Ton (1440 × 2560)
6. Abschließende Prüfungen: Lautheit, Synchronität, Loop, Mary Celeste unverändert
