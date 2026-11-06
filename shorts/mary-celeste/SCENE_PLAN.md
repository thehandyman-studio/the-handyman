# Mary Celeste – Szenenplan v2 (John-Produktion)

Stand: 2026-11-05 · **Verbindliche Tonspur: John** – `voice/takes/john_prod_v1/voice_master.wav` +
`words_master.json` (eleven_v4, Stability 0,2, `[energetic, fast-paced]`, −15 LUFS) · `SCRIPT.md` (Faktenprüfung Q1–Q6)
· v1 (Wyman-Zeiten) gesichert in `_backup/2026-11-05_scene-plan-before-john/`

| | |
|---|---|
| Format | 9:16, Arbeitsauflösung 1080 × 1920, 30 fps; **finaler Export 1440 × 2560** (`--scale 1.3333`) |
| Sprachaufnahme | 55,28 s (Sprache 0,09–55,19 s) |
| Videolänge | **1686 Frames = 56,2 s** (Sprache + 1,0 s Ausklang) |
| Szenen | 12 |
| Stil | Vorlage „cartoon-3d-short“: 3D-Welt mit Tusche-Konturen, 2D-Figurenkarten. Für diesen Short **dunkler und kühler** (siehe Abschnitt 1) |

## 0. Verbindlicher Zeitplan (John, aus `words_master.json` berechnet)

Im Code werden die Grenzen **aus `words_master.json` berechnet**, nicht abgetippt: Schnitt 2 Frames vor dem ersten
Wort der Szene. So passt das Bild automatisch, falls die Tonspur neu erzeugt wird.

| # | Szene | Frames | Zeit (s) | Dauer |
|---|---|---|---|---|
| 1 | Der Haken | 0–102 | 0,00–3,40 | 3,40 s |
| 2 | Beschädigt und leer | 102–248 | 3,40–8,27 | 4,87 s |
| 3 | Die Sichtung | 248–426 | 8,27–14,20 | 5,93 s |
| 4 | Die Enthüllung | 426–476 | 14,20–15,87 | 1,67 s |
| 5 | Rückblende New York | 476–724 | 15,87–24,13 | 8,27 s |
| 6 | Alle zehn sind fort | 724–828 | 24,13–27,60 | 3,47 s |
| 7 | Seetüchtig und unberührt | 828–1082 | 27,60–36,07 | 8,47 s |
| 8 | Keine Spuren | 1082–1168 | 36,07–38,93 | 2,87 s |
| 9 | Die Jolle fehlt | 1168–1226 | 38,93–40,87 | 1,93 s |
| 10 | Der letzte Eintrag | 1226–1380 | 40,87–46,00 | 5,13 s |
| 11 | Hypothesen | 1380–1531 | 46,00–51,03 | 5,03 s |
| 12 | Gefunden, nie wiedergesehen | 1531–1686 | 51,03–56,20 | 5,17 s |

**Schlüsselwörter (Frame des Wortanfangs):**
- 1: drifting f49 · Atlantic f87
- 2: sails f110 · deck f156 · Not f189 · aboard f224
- 3: December f254 · 1872 f281 · Dei f338 · Azores f396
- 4: Mary f441
- 5: New f526 · ten f556 · Captain f582 · wife f634 · daughter f669 · seven f687
- 6: all f748 · gone f776 · strangest f800
- 7: seaworthy f857 · Food f885 · 1,701 f951 · barrels f986 · untouched f1052
- 8: bodies f1095 · struggle f1139
- 9: lifeboat f1177 · gone f1199
- 10: log f1262 · November f1284 · silence f1351
- 11: panic f1427 · Were f1441 · disaster f1466 · knows f1510
- 12: found f1558 · ten f1587 · never f1633 · again f1646

**Änderungen gegenüber v1 (Wyman):** Johns Tempo ist höher (56,2 statt 61,2 s). Die 1-s-Spannungspause vor
„And the strangest part?“ (Szene 6a) entfällt, weil sie aus der bearbeiteten Wyman-Fassung stammte. Szene 6 ist
deshalb kürzer (3,5 s): Die Figuren verblassen bei „gone“ (f776), der Weg in die Kajüte beginnt bei „strangest“ (f800).
**Alle Frame-Angaben in den Abschnitten 2 und 3 unten stammen noch aus der Wyman-Fassung und sind überholt.** Es
gelten Inhalt, Kamera und Licht der Szenen, die Zeiten nur aus diesem Abschnitt 0.

Frame-Angaben (Abschnitte 2–3, Wyman v1, überholt): `f = round(Sekunde × 30)`. Schnitte liegen nach der Regel der Anleitung 0–3 Frames vor dem
Wort, auf das sie reagieren, und immer in einer Sprechpause.

---

## 1. Visuelle Grundregeln

### 1.1 Stimmung und Licht (drei Lichtwelten)
| Lichtwelt | Wo | Beschreibung |
|---|---|---|
| **GEGENWART** (neues Preset `overcast`) | Szenen 1–4, 6–10, 11 (Schluss), 12 | Bedeckter Himmel, Horizont blaugrau `#7d8c96`, oben `#3b4a58`. Diffuses Licht ohne harte Sonne, flacher Kontrast. Meer dunkel petrol `#1f3a44` mit grauem Schaum. Nebel in Horizontfarbe ab ~40 m. Sättigung ca. −25 % gegenüber dem Bridge-Tag, aber nie schwarz zugelaufen (Tusche bleibt lesbar, Schatten nicht unter Luma ~0,18). |
| **ERINNERUNG** (neues Preset `memory`) | Szene 5 (New York, Nov. 1872) | Gedämpftes, warmes Spätherbstlicht, Sonne tief und milchig. Leichte Sepia-Tönung und weiche Vignette. Klar als Rückblende erkennbar, aber nicht fröhlich bunt. |
| **HYPOTHESE** (Grading-Variante) | Szene 11, erster Teil | Fast einfarbig kaltes Blau, starke Vignette, leicht weichgezeichnet, Figuren nur als Silhouetten. Signalisiert: **Das ist eine Frage, keine Tatsache.** |

Innenräume (Szenen 7, 8, 10): nur Tageslicht durch Luken und Fenster, staubige Lichtkegel, keine brennenden
Lampen. Ob an Bord Licht brannte, ist nicht belegt.

### 1.2 Das Schiff: ein Modell, immer gleich
Beide Schiffe entstehen aus **einem** parametrischen Baustein (Vorschlag: `src/videos/mary-celeste/ship.ts`).
Jede Szene verwendet genau dieses Modell. Unterschiedlich ist nur der dokumentierte Zustand.

**Mary Celeste**, Brigantine mit zwei Masten [Q1]:
- **Takelage:** Fockmast mit Rahsegeln, Großmast mit Gaffelsegel, Klüversegel am Bugspriet.
- **Rumpf:** schwarz mit schmalem cremefarbenem Streifen, Deck aus hellem, verwittertem Holz, niedriges Kajütendeckhaus achtern, Steuerrad achtern.
- **Ausstattung:** Großluke mittschiffs, darüber die Halterungen für die Jolle, zwei Pumpen am Großmast.
- **Farben:** künstlerische Festlegung, nicht historisch belegt. Sie bleiben aber in allen Szenen gleich.
- **Kein Name am Heck:** Laut Anleitung keine Texte im Bild. Das Namensbrett bleibt leer bzw. zeigt nur Ornament.

**Zustand GEFUNDEN** (Szenen 1–4, 6–12):
- Segel teilweise gesetzt, Segel und Takelage beschädigt [Q1, Q2]. **Fock und oberes Vormarssegel fehlen** und hängen nur als Fetzen an der Rah [Q2].
- Jolle fehlt, Halterungen leer [Q1, Q2].
- Eine Pumpe teilweise zerlegt, Peilstab liegt daneben [Q1].
- Im Laderaum ca. 1,1 m Wasser [Q2, Q6].

**Zustand ABFAHRT** (Szene 5): alle Segel intakt, Jolle an ihrem Platz, Deck aufgeräumt.

**Dei Gratia**, ebenfalls eine Brigantine [Q1]: gleicher Baustein, aber klar unterscheidbar. Rumpf dunkelgrün,
Segel hellbeige statt grau-weiß, alle Segel intakt. Farben ebenfalls künstlerisch.

### 1.3 Freiraum für Untertitel (9:16, Handy)
- **Untertitel-Band:** 60–74 % der Bildhöhe (Grundlinie ~66 %). Dort nie Gesichter, das Schiff oder die
  wichtigste Handlung platzieren. Ruhige Flächen wie Meer, Deck oder Wand sind dort ideal.
- **Hauptmotiv** in 12–56 % der Bildhöhe, mittig bis leicht links.
- **Untere 22 % und rechte 10 %** frei von wichtigen Details, wegen der Shorts/TikTok-Bedienelemente.
- Wenn das Schiff vom Horizont geschnitten wird: Horizont bei 45–55 %, das Meer füllt das Untertitel-Band.

### 1.4 Was wir zeigen dürfen (Faktentreue)
| Kategorie | Regel |
|---|---|
| **Belegt** (als Tatsache zeigen) | Alles mit Quelle in SCRIPT.md: verlassenes Schiff, Schäden, fehlende Jolle, Vorräte, Fässer, Wasser im Laderaum, Logbuchtafel, die zehn Personen, Dei Gratia, Fund am 4.12.1872, Abfahrt New York |
| **Künstlerische Freiheit** (unauffällig) | Wetter und Himmel, Schiffsfarben, Aussehen der Personen, Kleidung, Hafenarchitektur, Möbel. Nichts davon wird im Text behauptet. |
| **Hypothese** (nur im Stil HYPOTHESE, Szene 11) | Verlassen im Beiboot, plötzliche Naturgefahr. Ohne Ausgang: kein Sinken, kein Tod, keine Gewalt. |
| **Nie zeigen** | Blut, Kampfspuren, Leichen, Geister, Seeungeheuer, Piraten, einen bestimmten „Täter“, lesbare Daten oder Texte (Logbuchtafel unleserlich) |

---

## 2. Szenenübersicht

| # | Frames | Zeit (s) | Text | Kern-Bild |
|---|---|---|---|---|
| 1 | 0–109 | 0,00–3,63 | Imagine discovering a ship drifting alone in the Atlantic. | Riesige graue See, winziges Schiff |
| 2 | 109–268 | 3,63–8,93 | Its sails damaged. Its deck empty. Not a single person aboard. | Zerrissene Segel, leeres Deck |
| 3 | 268–461 | 8,93–15,37 | On December 4th, 1872, … near the Azores. | Dei Gratia sichtet das Schiff, Seekarte |
| 4 | 461–507 | 15,37–16,90 | It was the Mary Celeste. | Heldenansicht des Schiffs |
| 5 | 507–772 | 16,90–25,73 | Just weeks earlier, … seven crew members. | Rückblende New York, die zehn Menschen |
| 6 | 772–927 | 25,73–30,90 | But now, all ten were gone. / And the strangest part? | Dieselben Plätze, leer. Abstieg ins Dunkel |
| 7 | 927–1192 | 30,90–39,73 | The ship was still seaworthy. … largely untouched. | Rumpf, Vorräte, Fässer im Laderaum |
| 8 | 1192–1293 | 39,73–43,10 | There were no bodies. No clear signs of a struggle. | Aufgeräumte Kapitänskajüte |
| 9 | 1293–1346 | 43,10–44,87 | But the lifeboat was gone. | Leere Jollen-Halterung |
| 10 | 1346–1517 | 44,87–50,57 | The last entry in the ship's log … / After that, silence. | Logbuchtafel, dann Stille |
| 11 | 1517–1667 | 50,57–55,57 | Did the crew abandon ship …? Were they caught …? / No one knows. | Hypothesen-Bilder, zurück zur Wirklichkeit |
| 12 | 1667–1837 | 55,57–61,23 | The Mary Celeste was found. / But the ten people … never seen again. | Beide Schiffe, dann Aufzug in die Leere |

---

## 3. Szenen im Detail

### Szene 1: Der Haken · f0–109 (0,00–3,63 s)
- **Text:** „Imagine discovering a ship drifting alone in the Atlantic.“
- **Schlüsselwörter:** drifting f48 · Atlantic f78
- **Umgebung:** offener Atlantik bis zum Horizont, bedeckter Himmel, Dunst. Kein Land in Sicht.
- **Objekte:** Mary Celeste (Zustand GEFUNDEN), sehr klein, im oberen Bilddrittel (Schiffsmitte ~38 % Höhe).
- **Kamera:** Luftbild, hoch und schräg (ca. 60 m Höhe, 35° nach unten), Brennweite weit, keine Tiefenunschärfe.
- **Bewegung:** langsame Annäherung mit leichtem Absinken (0,25 %/Frame). Bei „Atlantic“ (f76) weitet sich das Bild noch einmal kurz, das Meer wirkt riesig.
- **Licht:** GEGENWART, flach und kühl, leichter Nebel.
- **Animation:**
  - lange Dünung, das Schiff hebt und senkt sich und dreht sich träge um seine Achse (treibend, nicht segelnd)
  - die Segelfetzen flattern
  - wenige Schaumkronen
- **Untertitel-Band:** ruhiges Meer, frei.

### Szene 2: Beschädigt und leer · f109–268 (3,63–8,93 s)
- **Text:** „Its sails damaged. Its deck empty. Not a single person aboard.“
- **Drei Einstellungen:**
  - **2a** (f109–153) „Its sails damaged.“: Untersicht vom Deck den Fockmast hinauf. Die Fock und das obere Vormarssegel fehlen, Fetzen schlagen im Wind, lose Leinen pendeln. Kamera: langsames Kippen nach oben, Rollen 4°. DOF: Mast scharf, Himmel weich. Bei „damaged“ (f128) schlägt ein Fetzen sichtbar.
  - **2b** (f153–199) „Its deck empty.“: Fahrt auf Augenhöhe (1,6 m) über das Deck nach achtern. Leere Großluke, Steuerrad, Seile auf den Planken. Langsame Vorwärtsfahrt. Das Rad bewegt sich minimal mit der Dünung.
  - **2c** (f199–268) „Not a single person aboard.“: Schnitt auf f199 (2 Frames vor „Not“). Kran steigt senkrecht über das Deck auf, Draufsicht auf das ganze leere Schiff. Mit dem Ende von „aboard“ (f262) ist die Draufsicht erreicht.
- **Licht:** GEGENWART.
- **Untertitel-Band:** In 2a liegt das Deck unten im Band, der Mast steht oben. In 2c liegt das Heck im Band, das Deck mittig oben.

### Szene 3: Die Sichtung · f268–461 (8,93–15,37 s)
- **Text:** „On December 4th, 1872, the crew of the ship Dei Gratia spotted a vessel near the Azores.“
- **Schlüsselwörter:** December f275 · 1872 f297 · the crew f340 · Dei f365 · Azores f430
- **3a** (f268–338): Die Dei Gratia (grüner Rumpf, intakte Segel) segelt von links ins Bild. Seitliche Halbtotale, die Kamera fährt parallel mit. Früher Nachmittag [Q2], bedeckt. Datum und Jahr erscheinen **nicht** als Text, nur gesprochen.
- **3b** (f338–420): Über die Schulter von zwei Matrosen-Karten an der Reling der Dei Gratia. Einer zeigt nach vorn. Am Horizont (Höhe ~42 %) ein kleines Segel: die Mary Celeste. Langsames Heranschieben auf den Horizont, Tiefenunschärfe auf die Matrosen (Fokus fern).
- **3c** (f420–461) „near the Azores“: Einschub einer gemalten Seekarte **ohne Beschriftung**. Atlantik, die Azoren als Inselgruppe, die Küste Portugals, ein kleines Schiffssymbol **zwischen** Azoren und Portugal [Q2, Q6]. Die Kamera schwebt leicht darüber. Damit bleibt „near the Azores“ gesprochen, das Bild ist aber genau.
- **Untertitel-Band:** in 3b das Meer zwischen Reling und Horizont.

### Szene 4: Die Enthüllung · f461–507 (15,37–16,90 s)
- **Text:** „It was the Mary Celeste.“ (Mary f478)
- **Umgebung:** offene See, die Mary Celeste groß im Bild.
- **Kamera:** niedrige Dreiviertelansicht von schräg vorn (Kamerahöhe 1 m über dem Wasser, 18 m entfernt). Bug ragt nach oben ins Bild, Schiffsmitte ~35 % Höhe.
- **Bewegung:** schnelle Annäherung mit sanftem Abbremsen (20 Frames), dann bei „Mary“ (f476) ein kurzer Ruck nach vorn (0,6 %/Frame), Rollen 4,5°.
- **Licht:** GEGENWART, eine etwas hellere Wolkenlücke hinter dem Schiff zeichnet die Silhouette (künstlerisch).
- **Animation:** Bug hebt sich über eine Welle, Gischt.

### Szene 5: Rückblende New York · f507–772 (16,90–25,73 s)
- **Text:** „Just weeks earlier, she had left New York, carrying ten people: Captain Benjamin Briggs, his wife, their two-year-old daughter, and seven crew members.“
- **Schlüsselwörter:** New York f564 · carrying f584 / ten f593 · Captain f626 · his wife f658 · their … daughter f685–704 · and seven f726/733
- **Übergang:** Weiche Überblendung (8 Frames) in das Licht ERINNERUNG. Die Anleitung erlaubt Überblendungen bei Orts- und Zeitwechseln (`XFADE`).
- **Umgebung:** Hafenkai, Anfang November 1872 [Q1, Q2]. Ziegellagerhäuser (aus der Bridge-Vorlage abgeleitet), Holzsteg, Fässer, Taue. Die Mary Celeste im Zustand ABFAHRT. Das genaue Aussehen von Hafen und Kai ist künstlerisch, wir behaupten keinen bestimmten Pier.
- **5a** (f507–582) „Just weeks earlier, she had left New York“: Totale vom Kai. Die Leinen werden losgeworfen, das Schiff löst sich langsam vom Steg. Seitliches Gleiten.
- **5b** (f582–624) „carrying ten people“: Fahrt längs über das Deck. Die **zehn Figuren** stehen nebeneinander, Köpfe bei ~30–40 % Höhe, Füße über dem Untertitel-Band oder durch die Reling verdeckt.
- **5c** (f624–656) „Captain Benjamin Briggs“: Nahaufnahme Briggs (Vollbart, Kapitänsmütze, dunkler Rock), freundlich-ruhiger Ausdruck. DOF auf die Augen.
- **5d** (f656–683) „his wife“: Schwenk zu Sarah (Kleid der 1870er, Haube), lächelnd.
- **5e** (f683–724) „their two-year-old daughter“: Kamera senkt sich auf Kinderhöhe zu Sophia, die die Hand der Mutter hält.
- **5f** (f724–772) „and seven crew members“: Rückzug zur Halbtotalen, die sieben Matrosen in einer Reihe, einer winkt. Bei f760 friert die Bewegung kurz ein und entsättigt sich: Übergang zu Szene 6.
- **Hinweis:** Aussehen und Kleidung sind künstlerisch, es gibt keine Porträtvorgabe. Namen werden nicht eingeblendet.

### Szene 6: Alle zehn sind fort · f772–927 (25,73–30,90 s)
- **Text:** „But now, all ten were gone.“ (ten f817, gone f839) · 1,0 s Stille · „And the strangest part?“ (f885–921, strangest f896)
- **6a** (f772–880): **Bildgleicher Übergang** zu 5b: dieselbe Deckposition und dieselbe Kamerafahrt, jetzt im Licht GEGENWART auf dem leeren, verwitterten Deck. Bei „all ten“ (f809–817) stehen die zehn Figuren noch als blasse, halbdurchsichtige Erinnerung da. Bei „gone“ (f837) verblassen sie innerhalb von 6 Frames. Keine Geister-Effekte, nur ein Ausblenden. In der Stille (f855–885): nur Wind, die Kamera schiebt sich langsam weiter (0,2 %/Frame) auf die leeren Planken.
- **6b** (f880–927) „And the strangest part?“: Schnitt auf f882. Gekippte Untersicht vor der offenen Kajütentür, die im Seegang langsam hin- und herschwingt. Bei „strangest“ (f894) fährt die Kamera durch die Tür in die Dunkelheit (Übergang zu Szene 7).
- **Licht:** GEGENWART. In 6b ist das Innere fast schwarz, ein schmaler Lichtstreifen fällt durch die Tür.

### Szene 7: Seetüchtig und unberührt · f927–1192 (30,90–39,73 s)
- **Text:** „The ship was still seaworthy. Food and water remained. Its cargo of 1,701 barrels of industrial alcohol was largely untouched.“
- **Schlüsselwörter:** seaworthy f960 · Food f990 · Its cargo f1044 · 1,701 f1066 · barrels f1098 · untouched f1170
- **7a** (f927–988) „still seaworthy“: Außen, Kamera knapp über der Wasserlinie, gleitet am Rumpf entlang. Der Rumpf ist intakt und schwimmt aufrecht [Q2, Q6]. Ruhige, stabile Bewegung, damit „intakt“ spürbar wird.
- **7b** (f988–1042) „Food and water remained“: Vorratsraum. Wasserfässer, Säcke, Kisten und Töpfe in Regalen, voll und ordentlich [Q2]. Langsamer Schwenk, Licht fällt durch eine Luke.
- **7c** (f1042–1192) „cargo of 1,701 barrels …“: Laderaum. Lange Reihen gleicher Fässer, die in die Dunkelheit führen. Die Kamera fährt langsam in Längsrichtung durch den Gang. Ab „1,701“ (f1066) zieht sie leicht nach oben, damit die Menge wirkt. Am Boden steht ruhiges Wasser zwischen den Fässern (~1,1 m) [Q2, Q6], das sanft schwappt. Staubige Lichtkegel aus der Großluke. Bei „untouched“ (f1168) bleibt die Kamera auf einer intakten Fassreihe stehen und schiebt sich weiter vor.
- **Hinweis:** Die 9 leeren Fässer [Q4] zeigen wir nicht, der Text sagt „largely“. Keine Zahl im Bild.
- **Untertitel-Band:** in 7c der Gang bzw. das Wasser am Boden.

### Szene 8: Keine Spuren · f1192–1293 (39,73–43,10 s)
- **Text:** „There were no bodies. No clear signs of a struggle.“ (bodies f1208 · No clear f1233 · struggle f1270)
- **Umgebung:** Kapitänskajüte, klein und holzgetäfelt. Tisch, zwei Stühle an ihrem Platz, Koje, ein Regal mit Büchern und Seekartenrollen. Der Säbel hängt in der Scheide an der Wand [Q1]. Ein Kinderspielzeug liegt in der Koje (künstlerisch, unaufdringlich).
- **Kamera:** **8a** (f1192–1231) langsame Fahrt durch die leere Kajüte auf Augenhöhe. **8b** (f1231–1293) Nahaufnahme des unberührten Tisches, dann ein kurzes Gleiten zum Säbel, der ordentlich hängt.
- **Licht:** Tageslicht durch ein kleines Fenster, sonst Halbdunkel.
- **Animation:** Staub im Licht, eine Lampe an der Decke pendelt im Seegang (unbeleuchtet).
- **Wichtig:** **keine** Flecken, Kerben, umgestoßenen Gegenstände oder Spuren. Die alten Behauptungen des Anklägers wurden widerlegt [Q2, Q6].

### Szene 9: Die Jolle fehlt · f1293–1346 (43,10–44,87 s)
- **Text:** „But the lifeboat was gone.“ (lifeboat f1304 · gone f1323)
- **Umgebung:** Deck mittschiffs über der Großluke [Q1].
- **Objekte:** zwei leere Holzhalterungen für die Jolle, lose Zurrleinen, die über die Luke hängen.
- **Kamera:** Draufsicht aus 4 m Höhe, die sich langsam senkt. Bei „gone“ (f1321) ein kurzer Ruck nach vorn auf die leeren Halterungen, Rollen 4°.
- **Animation:** Die losen Leinen pendeln.
- **Hinweis:** Ob Leinen gekappt oder gelöst wurden, ist nicht belegt. Deshalb nur lose Leinen, keine Schnittkanten.

### Szene 10: Der letzte Eintrag · f1346–1517 (44,87–50,57 s)
- **Text:** „The last entry in the ship's log was dated November 25th.“ (log f1383 · November f1411) · „After that, silence.“ (After f1459 · silence f1489)
- **10a** (f1346–1457): Kajüte. Auf dem Tisch liegt die **Logbuchtafel** [Q1, Q2], eine Schiefertafel mit Holzrahmen und Kreidezeilen, die **nicht lesbar** sind (nur Kritzel-Andeutungen, keine Zahlen). Kamera: Makro-Fahrt über die Zeilen, die bei der letzten Zeile anhält (f1409, kurz vor „November“). DOF sehr flach.
- **10b** (f1457–1517) „After that, silence.“: Schnitt nach außen. Totale, das Schiff allein auf grauer See. Bei „silence“ (f1487) stoppt jede Kamerabewegung bis auf ein minimales Heranschieben. Die Segelfetzen hängen still, der Ton wird fast leer.
- **Licht:** innen das Fensterlicht auf der Tafel, außen GEGENWART, etwas dunkler.

### Szene 11: Hypothesen · f1517–1667 (50,57–55,57 s)
- **Text:** „Did the crew abandon ship in a panic?“ (panic f1555) · „Were they caught in a sudden disaster?“ (Were f1578 · disaster f1610) · „No one knows.“ (No f1633 · knows f1644)
- **11a** (f1517–1576), Stil HYPOTHESE: Die Jolle mit zehn **Silhouetten**, die vom Schiff weg in den Nebel rudert, aus erhöhter Position gesehen. Das Bild bleibt offen: keine Gesichter, kein Ziel, kein Ausgang.
- **11b** (f1576–1631), Stil HYPOTHESE: Das Schiff von außen, der Himmel verdunkelt sich schnell, eine hohe, unbestimmte Dünung hebt das Schiff an. **Keine bestimmte Ursache** (keine Explosion, keine Wasserhose, kein Monster), kein Sinken.
- **11c** (f1631–1667) „No one knows.“: harter Schnitt zurück ins Licht GEGENWART. Nahaufnahme des leeren Steuerrads, das sich leicht im Seegang bewegt. Stillstand der Kamera mit minimalem Heranschieben.
- **Untertitel-Band:** in 11a das Wasser zwischen Schiff und Jolle, in 11c die Radnabe oberhalb.

### Szene 12: Gefunden, aber nie wiedergesehen · f1667–1837 (55,57–61,23 s)
- **Text:** „The Mary Celeste was found.“ (Mary f1673 · found f1699) · „But the ten people aboard were never seen again.“ (ten f1729 · never f1770 · again f1787)
- **12a** (f1667–1719): Totale, die Dei Gratia liegt neben der Mary Celeste (beide Modelle, Abstand ~60 m) [Q1–Q3]. Kamera seitlich, langsames Gleiten.
- **12b** (f1719–1837): Die Kamera steigt in einer einzigen Bewegung steil auf und weg. Die Mary Celeste wird immer kleiner, bis sie bei „again“ (f1787) nur noch ein Punkt im Nebel ist. Nach dem letzten Wort noch 1,0 s Ausklingen (f1807–1837), Nebel zieht über das Bild, Abblendung auf dunkles Blaugrau.
- **Licht:** GEGENWART, am Ende etwas dunkler.

---

## 4. Ton (Ausblick, wird erst nach dem Bild gebaut)
- **Durchgehend:** Wind, Wellen, Holzknarren, schlagendes Segeltuch. Keine fröhliche Marschmusik wie bei Bridge.
- **Musik:** langsam, tief, schwebend.
- **Pausen bewusst leer lassen:** f855–885 (vor „And the strangest part?“) und ab „silence“ (f1489).
- Hypothesen-Szene etwas verfremdet (dumpfer).

---

## 5. Benötigte 3D-Modelle und Elemente

| Element | Vorhanden? | Bewertung / Vorschlag |
|---|---|---|
| **Brigantine (Mary Celeste)** | ❌ nein | Wichtigstes Modell. **Eigenes parametrisches Modell im Code** (wie die Brücke im Bridge-Short): Rumpf, 2 Masten, Rahen, Segel als Tuch-Flächen, Takelage als Tusche-Linien, Zustände GEFUNDEN/ABFAHRT. Garantiert gleiches Aussehen in allen Szenen. Fertige Gratis-Schiffe (z. B. Kenney „Pirate Kit“) sind Piraten-Galeonen und passen nicht. |
| **Dei Gratia** | ❌ | Derselbe Baustein mit anderen Farben, kein zusätzliches Modell nötig. |
| **Offenes Meer** (Dünung, Schaum, Nebel) | ❌ | Die Vorlage hat nur einen ruhigen Fluss. Ein neuer Wasser-Shader mit großen Wellen ist nötig, und das Schiff muss sich mit den Wellen bewegen. Größter Programmieraufwand. |
| **Lichtstimmungen** `overcast`, `memory`, Hypothese | ❌ | Die Vorlage kennt nur „Tag“ und „goldene Stunde“. Drei neue Presets bzw. Grading-Varianten. |
| **Jolle** (Beiboot) | ❌ | `canoe.glb` ist ein Kanu und passt nicht. Einfaches Ruderboot im Code bauen. |
| **Fässer** (Laderaum, Vorräte, Kai) | ❌ | Einfaches gedrehtes Fass im Code, vielfach kopiert (Instancing). Alternativ CC0-Fässer von Kenney (Download, nur nach deiner Freigabe). |
| **Schiffsinneres** (Kajüte, Vorratsraum, Laderaum) | ❌ | Nicht vorhanden. Einfache Räume aus Holzflächen mit den gemalten Holztexturen der Vorlage. |
| **Kleinteile** (Steuerrad, Pumpen, Peilstab, Luke, Jollen-Halterung, Logbuchtafel, Säbel, Tisch, Stühle, Koje, Lampe) | ❌ | Einfache Formen im Code. Logbuchtafel mit gemalter, unleserlicher Kreide-Textur. |
| **Hafen New York 1872** | ⚠️ teilweise | Die Ziegelhäuser der Bridge-Vorlage sind als Lagerhäuser brauchbar. Holzsteg und Poller sind neu. Die Kenney-Marktstände, Fahnen und die Windmühle sind „Fantasy-Stadt“ und **ungeeignet**. |
| **Seekarte ohne Text** (Szene 3c) | ❌ | Gemalte 2D-Textur auf einer Fläche. |
| **Figuren** (Briggs, Sarah, Sophia, 7 Matrosen, 2 Matrosen der Dei Gratia, Silhouetten) | ⚠️ System vorhanden | `toon.ts`/`cast.ts` können Figurenkarten zeichnen. Neu nötig: Kleidung der 1870er (Kapitänsrock und -mütze, Matrosenkleidung, Kleid und Haube, Kleinkind). Die Soldatenuniformen der Bridge-Vorlage passen nicht. |
| **Bäume, Blumen, Büsche (Kenney Nature Kit)** | ✅ | Werden in diesem Short **nicht** gebraucht. |
| **Untertitel-Komponente** | ❌ | Laut Anleitung beim ersten neuen Short einmal bauen (Schritt 8). |

**Stil-Hinweis:** Die Vorlage ist auf helles, farbenfrohes Tageslicht abgestimmt. Den gewünschten düsteren
Look erreichen wir über die neuen Lichtstimmungen. Der Tusche- und Figurenstil bleibt gleich. Die
Kontrollrunden (Schritt 10 der Anleitung) müssen gegen die düstere Stimmung prüfen, nicht gegen die hellen Referenzwerte.
