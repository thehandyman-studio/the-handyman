# THE HANDYMAN #? – The Moon Has a Crack – Skript + Szenenplan

Entwurf v1 (2026-11-09, Claude im Browser) · **wartet auf Adrians Freigabe** · Standard: `docs/HANDYMAN_STANDARD.md` · Figur: `docs/HANDYMAN_CHARACTER_BIBLE.md` · Formel: `docs/HANDYMAN_BRAND.md`
Noch nichts umgesetzt: kein Bild-Code, keine Stimme, kein Ton. Zeiten sind geschätzt (≈ 3,6 Wörter/s).

## 0. Eckdaten
| | |
|---|---|
| Art | **fiktiv**, märchenhaft-absurd |
| **Auftrag des Handyman** | ein nächtlicher Anruf: „The moon is broken.“ Er soll einen Riss im Mond reparieren |
| **Entdeckung** | der Riss ist echt, und er wird breiter |
| **Steigerung** | er klettert mit einer endlos langen Leiter hinauf, vorbei an Vögeln, Wolken und einem Flugzeug, und spachtelt den Riss perfekt zu |
| **Wendung** | komisch: Der Mond ist jetzt so glatt, dass er wie eine Lampe strahlt. Niemand kann mehr schlafen. Um drei Uhr nachts kommt der nächste Anruf: „Can you break the moon?“ **Schleife: ja** (Anruf um 3 Uhr = Bild 1) |
| Länge | Ziel ≈ 52 s · **186 Wörter** |
| Figuren | **The Handyman** · `rose` und `pip` als genervte Nachbarn an den Fenstern · Flugzeug-Passagiere (Menge) |
| Orte / Licht | Schlafzimmer (Nacht, blau) → Straße mit Pick-up → Hügel → Himmel → Mondoberfläche (kalt, silbern) → Stadt taghell → Schlafzimmer (Nacht) |
| Schleifen-Ende | ja |

## 1. Fakten
Entfällt, die Geschichte ist erfunden.

## 2. Skript + Szenenplan

### Sprechtext (rein)
```
At three in the morning, he got the strangest call of his life: "Hello? The moon is broken."
He looked out the window, and there it was, a long, dark crack running right across the full moon.
So he loaded his longest ladder onto the truck, drove to the highest hill in town, and started to climb.
He climbed past the birds, past the clouds, and past a very confused airplane.
Up close, the moon was cold, dusty, and much bigger than he expected, and the crack was getting wider.
The handyman pulled out his putty knife, filled the crack with plaster, and tapped it smooth with his hammer.
It was the best job he'd ever done.
The moon was so smooth and so shiny now that it started to glow like a giant lamp.
Down on Earth, the night turned bright as noon, the roosters started crowing, and nobody could sleep anymore.
Every phone in town started ringing at once.
The handyman climbed down, went home, and closed his curtains.
At three in the morning, his phone rang again: "Hello? Can you break the moon?"
```

### Szenenplan
| # | Teil | Sprechtext | Start-Wort | ≈ s | Zweck | Größe | Kamera | Übergang rein | Figuren: Mimik / Geste (auf Wort) | Hervorhebung / Effekt | Ton |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Aufhänger | At three in the morning, | (Anfang) | 1,4 | hook | INSERT | punch | – (Loop-Anschluss) | – | Telefon klingelt neben Wecker, **3:00** | Klingeln (= Ende der Folge) |
| 2 | Aufhänger | he got the strangest call of his life: "Hello? The moon is broken." | got | 4,0 | hook | MCU | push, `punch` auf „broken“ | – | im Bett, Haare zerzaust, Telefon am Ohr, `expr: surprised` | – | Telefonstimme (gefiltert) |
| 3 | Aufbau | He looked out the window, and there it was, | looked | 2,3 | reaction | MS | push | whip | am Fenster von hinten (`view: back`), beugt sich vor (`lean` 7) | – | Nacht-Atmo |
| 4 | Entdeckung | a long, dark crack running right across the full moon. | crack | 2,8 | reveal | INSERT | push | – | – | Vollmond mit dunklem Zickzack-Riss | tiefes Knistern |
| 5 | Aufbau | So he loaded his longest ladder onto the truck, | loaded | 2,3 | info | MS | track | xfade | lädt eine absurd lange Leiter auf den Pick-up | Leiter ragt weit über das Auto | Metall-Klappern |
| 6 | Steigerung 1 | drove to the highest hill in town, and started to climb. | drove | 3,0 | bridge | EWS | crane (Stadt → Hügel → Leiter in den Himmel) | – | winzig am Fuß der Leiter | – | Motor, Wind |
| 7 | Steigerung 1 | He climbed past the birds, past the clouds, | climbed | 2,2 | track | WS | track (senkrecht) | – | klettert (`view: back`) | Vögel, Wolken ziehen vorbei | Flügelschlagen |
| 8 | Steigerung 1 | and past a very confused airplane. | confused | 1,7 | reaction | MCU | whip | whip | Passagiere am Fenster starren, Handyman hebt die Hand zum Gruß (`wave`) | – | Düsenrauschen |
| 9 | Steigerung 2 | Up close, the moon was cold, dusty, and much bigger than he expected, | Up | 3,6 | reveal | EWS | crane (heraus) | xfade | winzige Figur oben auf der Leiter vor riesiger Mondfläche | Mondstaub glitzert | Stille, tiefer Ton |
| 10 | Steigerung 2 | and the crack was getting wider. | crack | 1,7 | reaction | CU | punch | – | `expr: scared`, `sweat: true` | Riss knackt weiter | Knacken |
| 11 | Steigerung 3 | The handyman pulled out his putty knife, filled the crack with plaster, | pulled | 3,3 | action | MS | push | – | spachtelt konzentriert (`lean` 6) | Gipsstaub | Spachtel-Schaben |
| 12 | Steigerung 3 | and tapped it smooth with his hammer. | tapped | 1,9 | action | INSERT | `kick` je Schlag | – | Hammer klopft | Sterne beim Klopfen | Klopfen ×3 |
| 13 | Steigerung 3 | It was the best job he'd ever done. | best | 2,2 | reaction | MCU | push | – | stolz, `expr: happy`, wischt sich die Stirn | – | Celesta-Motiv kurz |
| 14 | Wendung | The moon was so smooth and so shiny now that it started to glow like a giant lamp. | smooth | 4,4 | twist | WS | crane (heraus), Licht wird gleißend | – | Handyman hält sich die Hand vor die Augen | Mond strahlt weiß | Summen wie Neonröhre |
| 15 | Wendung | Down on Earth, the night turned bright as noon, | Down | 2,5 | bridge | EWS | push | flash | – | Stadt taghell in der Nacht | – |
| 16 | Wendung | the roosters started crowing, and nobody could sleep anymore. | roosters | 2,8 | info | MS | push | whip | Hahn kräht, `rose` und `pip` am Fenster mit Kissen, `expr: angry` | – | Hahn, Hundegebell |
| 17 | Wendung | Every phone in town started ringing at once. | Every | 2,2 | info | TOP | push | – | – | Dächer von oben, an jedem Haus Klingel-Striche | vielstimmiges Klingeln |
| 18 | Wendung | The handyman climbed down, went home, and closed his curtains. | climbed | 2,8 | action | MS | push | xfade | zieht die Vorhänge zu, `expr: tired` | Licht im Zimmer wird dunkel | Vorhang-Rascheln, Stille |
| 19 | Pointe | At three in the morning, his phone rang again: | three | 2,2 | payoff | INSERT | punch | – | – | **3:00**, Telefon klingelt (= Bild 1) | Klingeln |
| 20 | Pointe | "Hello? Can you break the moon?" | Hello | 2,0 | payoff | CU | push | – | Handyman im Bett, starrt trocken zur Decke, Hammer auf dem Nachttisch | – | Telefonstimme, Klingeln geht in Bild 1 über |

**Schleife:** Bild 19 und Bild 1 zeigen dasselbe klingelnde Telefon um 3:00.

## 3. Selbstprüfung vor der Freigabe
- [x] The Handyman ist ab Bild 2 zu sehen und Hauptfigur. Er heißt „the handyman“ und spricht nicht.
- [x] Beginnt mit einem Auftrag (Anruf: Mond reparieren). Hammer in Bild 12 und 20. Reaktionen: vorbeugen, Hand heben, erstarren mit Schweiß.
- [x] Satz 1 ist der Aufhänger (19 Wörter, endet auf dem Anruf).
- [x] Steigerung: Riss → Leiter in den Himmel → Riss wird breiter → perfekte Reparatur → Mond als Lampe → ganze Stadt wach.
- [x] Pointe im letzten Satz, Video endet auf „moon“.
- [x] Wortzahl 186 ÷ 3,6 ≈ 52 s.
- [x] Kurze Sätze: „It was the best job he'd ever done.“ (8 Wörter), „Every phone in town started ringing at once.“ (8).
- [x] 20 Einstellungen, keine zwei gleichen Größen hintereinander, 0 harte Schnitte.
- [x] Eigene Geschichte, nichts übernommen.

## 4. Vorschlag Sprechtext für ElevenLabs (erst nach Freigabe → `voice/narration_john.txt`)
```
[energetic, fast-paced] At three in the morning, he got the strangest call of his life: "Hello? The moon is BROKEN."
He looked out the window, and there it was, a long, dark CRACK running right across the full moon.
So he loaded his LONGEST ladder onto the truck, drove to the highest hill in town, and started to climb.
He climbed past the birds, past the clouds, and past a very CONFUSED airplane.
Up close, the moon was cold, dusty, and much bigger than he expected, and the crack was getting WIDER.
The handyman pulled out his putty knife, filled the crack with plaster, and tapped it smooth with his hammer.
It was the BEST job he'd ever done.
The moon was so smooth and so shiny now that it started to GLOW like a giant lamp.
Down on Earth, the night turned bright as noon, the roosters started crowing, and NOBODY could sleep anymore.
Every phone in town started ringing at ONCE.
[tired] The handyman climbed down, went home, and closed his curtains.
At three in the morning, his phone rang again: "Hello? Can you BREAK the moon?"
```

## 5. Offene Punkte für den Mac
- Keine neuen Figuren nötig (`rose`, `pip`, Menge).
- **Neue Kulissen:** Schlafzimmer (oder das Zuhause aus dem Pilot), Pick-up mit Leiter, Hügel, Himmel mit Wolken und Flugzeug, Mondoberfläche.
- Prüfen: `expr: tired` und `expr: angry` gibt es eventuell noch nicht in `acting.ts`/`human.ts`. Wenn nicht, nur **ergänzen**, nichts an bestehenden Ausdrücken ändern.
- Licht: Wechsel nachtblau → gleißend weiß (Bild 14–17) ist der Effekt der Folge. In `looks.ts` als neue Stimmung ergänzen.
