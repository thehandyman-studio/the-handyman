# THE HANDYMAN #? – The Prison Break – Skript + Szenenplan

Entwurf v1 (2026-11-09, Claude im Browser) · **wartet auf Adrians Freigabe** · Standard: `docs/HANDYMAN_STANDARD.md` · Figur: `docs/HANDYMAN_CHARACTER_BIBLE.md` · Formel: `docs/HANDYMAN_BRAND.md`
Noch nichts umgesetzt: kein Bild-Code, keine Stimme, kein Ton. Zeiten sind geschätzt (≈ 3,6 Wörter/s).

## 0. Eckdaten
| | |
|---|---|
| Art | **fiktiv**, absurd-komisch |
| **Auftrag des Handyman** | ein tropfendes Waschbecken in Zelle 14 eines Hochsicherheitsgefängnisses reparieren |
| **Entdeckung** | hinter dem Poster in der Zelle ist ein Fluchttunnel, und es gibt noch viele mehr |
| **Steigerung** | er mauert gewissenhaft jeden Tunnel zu (42 Stück), die Häftlinge buhen, der Direktor ist begeistert, aber das reparierte Schloss geht nicht mehr auf |
| **Wendung** | komisch und ironisch: Er ist jetzt selbst eingesperrt und beginnt mit einem Löffel zu graben. **Schleife: ja** (das Tropfen am Ende = das Tropfen am Anfang) |
| Länge | Ziel ≈ 53 s · **190 Wörter** |
| Figuren | **The Handyman** · `boss` als Gefängnisdirektor · **Rudy**, alter Häftling (neue Nebenfigur, siehe 5.) · Menge (`crowdHuman`) als Häftlinge und Wärter |
| Orte / Licht | Zelle 14 (kaltes Tageslicht durchs Gitterfenster) → Gang (Neon) → Hof von oben (Mittag) → Haupttor (Nachmittag, gold) → Zelle 14 (Nacht, blau) |
| Schleifen-Ende | ja |

## 1. Fakten
Entfällt, die Geschichte ist erfunden.

## 2. Skript + Szenenplan

### Sprechtext (rein)
```
He came to fix one dripping sink in a prison, and ended up planning the greatest escape in history.
Cell 14 belonged to an old prisoner who smiled and asked, "While you're here, could you check the wall behind my bed?"
Behind the poster was a tunnel, so the handyman did what any good handyman would do, and filled it with fresh cement.
The prisoner stared at him in horror.
Then the next cell asked about a loose tile, and underneath it was another tunnel, which he sealed too.
By lunch, he'd closed forty-two tunnels, three secret ladders, and one hollow guitar full of spoons.
The prisoners booed, but the warden was thrilled, and he walked the handyman to the main gate himself.
Then the warden turned his key, but the lock had been fixed so perfectly that it wouldn't open anymore.
Not for keys, not for crowbars, not even for the handyman's hammer.
That night, he sat on a bunk in Cell 14, and the old prisoner handed him a spoon.
The handyman looked at the wall.
So he started to dig, toward the sound of a dripping sink.
```

### Szenenplan
| # | Teil | Sprechtext | Start-Wort | ≈ s | Zweck | Größe | Kamera | Übergang rein | Figuren: Mimik / Geste (auf Wort) | Hervorhebung / Effekt | Ton |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Aufhänger | He came to fix one dripping sink in a prison, | (Anfang) | 3,0 | hook | INSERT | push | – (Loop-Anschluss) | – | Tropfen fällt ins Becken, in Zeitlupe | Tropfen (= letzter Ton der Folge) |
| 2 | Aufhänger | and ended up planning the greatest escape in history. | ended | 2,5 | hook | MS | push, `punch` auf „escape“ | whip | Handyman kniet am Becken, Hammer in der rechten Hand, schaut zum Gitterfenster hoch (`lookUp` 0,6), `expr: thinking` | – | Wusch |
| 3 | Aufbau | Cell 14 belonged to an old prisoner | Cell | 1,9 | info | WS | crane (Gang → Zelle) | xfade | Rudy liegt auf der Pritsche, Handyman an der Tür | Zahl „14“ als gemalte Nummer an der Zellentür | Gefängnis-Atmo, fernes Türknallen |
| 4 | Aufbau | who smiled and asked, "While you're here, could you check the wall behind my bed?" | smiled | 4,2 | info | MCU | push | – | Rudy lächelt breit, zeigt mit Daumen hinter sich (`point`), Handyman seitlich, Augenbrauen hoch | – | – |
| 5 | Entdeckung | Behind the poster was a tunnel, | Behind | 1,7 | reveal | INSERT | punch auf „tunnel“ | whip | Hand hebt Poster an | dunkles Tunnelloch, Löffel liegt davor | Papier-Rascheln |
| 6 | Steigerung 1 | so the handyman did what any good handyman would do, and filled it with fresh cement. | so | 4,4 | reaction | MS | push | – | Handyman beugt sich vor (`lean` 7), dann zufrieden mit Kelle, `expr: calm` | Staubwölkchen | Kelle, Zement |
| 7 | Steigerung 1 | The prisoner stared at him in horror. | prisoner | 1,9 | reaction | CU | punch | cut | Rudy `expr: scared`, `sweat: true` | Schweißtropfen | – |
| 8 | Steigerung 2 | Then the next cell asked about a loose tile, | next | 2,4 | bridge | WS | track (Gang entlang) | whip | Häftlinge winken ihn zur Nachbarzelle | – | Schritte |
| 9 | Steigerung 2 | and underneath it was another tunnel, which he sealed too. | underneath | 2,8 | reveal | TOP | push | – | Handyman hebt Fliese, kippt Zement nach | – | Zement-Platsch |
| 10 | Steigerung 3 | By lunch, he'd closed forty-two tunnels, | lunch | 2,0 | info | EWS | crane (Hof von oben) | flash (Zeitsprung) | Handyman winzig im Hof | **Zahl „42“** als Zähler in der Welt (Kreidetafel) | Mittagsglocke |
| 11 | Steigerung 3 | three secret ladders, and one hollow guitar full of spoons. | three | 2,7 | payoff | INSERT | orbit | – | – | Gitarre kippt, Löffel prasseln heraus, Sterne | Löffel-Klirren |
| 12 | Steigerung 4 | The prisoners booed, but the warden was thrilled, | prisoners | 2,5 | reaction | WS | push | xfade | Häftlinge hinter Gittern buhen, `boss` strahlt (`expr: happy`) | – | Buh-Rufe der Menge |
| 13 | Steigerung 4 | and he walked the handyman to the main gate himself. | walked | 2,6 | bridge | MS | track | – | `boss` Arm um seine Schulter, Handyman hebt die Hand zum Gruß (`wave`) | goldenes Nachmittagslicht | Schritte, Kies |
| 14 | Steigerung 5 | Then the warden turned his key, | turned | 1,7 | info | INSERT | punch | – | – | Schlüssel im riesigen Schloss | Schlüssel-Klick |
| 15 | Steigerung 5 | but the lock had been fixed so perfectly that it wouldn't open anymore. | lock | 3,3 | reaction | MCU | push, dutch | – | `boss` zerrt am Schlüssel, Handyman daneben `expr: scared`, `sweat: true` | Schweißtropfen | Rütteln |
| 16 | Steigerung 5 | Not for keys, not for crowbars, not even for the handyman's hammer. | Not | 3,3 | reaction | MS | `kick` auf „hammer“ | – | Wärter mit Brecheisen, dann Handyman schlägt mit dem Hammer aufs Schloss | Comic-Wort „KNOCK“, Funken | Metall-Klong ×3 |
| 17 | Wendung | That night, he sat on a bunk in Cell 14, | night | 2,5 | bridge | WS | push | xfade (Nacht, blau) | Handyman sitzt auf der Pritsche, Rudy gegenüber | Mondlicht durchs Gitter | Grillen, fernes Tropfen |
| 18 | Wendung | and the old prisoner handed him a spoon. | handed | 2,0 | info | INSERT | punch | – | Löffel wechselt von Hand zu Hand | Lichtkranz um den Löffel | kleiner Glanz-Ton |
| 19 | Wendung | The handyman looked at the wall. | looked | 1,7 | reaction | CU | push | – | Handyman `expr: thinking`, Seitenblick zur Wand | – | Stille |
| 20 | Pointe | So he started to dig, toward the sound of a dripping sink. | dig | 3,0 | payoff | MS | push → Schluss auf Wand | – | Handyman von hinten (`view: back`), kratzt mit dem Löffel | Bild endet auf dem Tropfen = Bild 1 | Kratzen, dann **Tropfen** (Loop) |

**Schleife:** Der letzte Ton ist das Tropfen. Bild 1 beginnt genau mit diesem Tropfen am Waschbecken.

## 3. Selbstprüfung vor der Freigabe
- [x] The Handyman ist Hauptfigur, ab Bild 2 zu sehen. Er heißt „the handyman“ und spricht nicht.
- [x] Beginnt mit einem Auftrag (Waschbecken). Hammer in Bild 2 und 16. Reaktionen: vorbeugen, nachdenken, erstarren mit Schweiß, Hand heben.
- [x] Satz 1 ist der Aufhänger (18 Wörter).
- [x] Steigerung: 1 Tunnel → noch einer → 42 → Direktor begeistert → Tor geht nicht auf → nicht mal mit dem Hammer.
- [x] Die Pointe steht im letzten Satz, das Video endet auf „sink“.
- [x] Wortzahl 190 ÷ 3,6 ≈ 53 s.
- [x] Kurze Pointen-Sätze: 2 („The prisoner stared at him in horror.“, „The handyman looked at the wall.“).
- [x] 20 Einstellungen, keine zwei gleichen Größen hintereinander, 1 harter Schnitt.
- [x] Eigene Geschichte, nichts übernommen.

## 4. Vorschlag Sprechtext für ElevenLabs (erst nach Freigabe → `voice/narration_john.txt`)
Wortlaut identisch mit dem reinen Sprechtext, nur Betonungen:
```
[energetic, fast-paced] He came to fix one dripping sink in a prison, and ended up planning the greatest ESCAPE in history.
Cell 14 belonged to an old prisoner who smiled and asked, "While you're here, could you check the wall behind my BED?"
Behind the poster was a TUNNEL, so the handyman did what any good handyman would do, and filled it with fresh cement.
The prisoner stared at him in HORROR.
Then the next cell asked about a loose tile, and underneath it was ANOTHER tunnel, which he sealed too.
By lunch, he'd closed FORTY-TWO tunnels, three secret ladders, and one hollow guitar full of spoons.
The prisoners booed, but the warden was THRILLED, and he walked the handyman to the main gate himself.
Then the warden turned his key, but the lock had been fixed so perfectly that it wouldn't open ANYMORE.
Not for keys, not for crowbars, not even for the handyman's HAMMER.
[quiet] That night, he sat on a bunk in Cell 14, and the old prisoner handed him a spoon.
The handyman looked at the wall.
So he started to dig, toward the sound of a dripping sink.
```
Untertitel: „Cell 14“ als Zahl schreiben. In `narration_john.captions.json` die Betonungswörter klein schreiben lassen.

## 5. Offene Punkte für den Mac
- **Neue Nebenfigur Rudy** (alter Häftling): Vorschlag gestreifte Häftlingskleidung, Glatze mit grauem Haarkranz, Stoppelbart. Muss in `docs/CAST_BIBLE.md` eingetragen werden, bevor sie gebaut wird (Freigabe Adrian).
- **Neue Kulissen:** Zelle mit Pritsche und Gitterfenster, Gefängnisgang mit Gittertüren, Hof von oben, Haupttor mit großem Schloss.
- `boss` bleibt im Marineanzug (passt als Direktor).
- Häftlingskleidung für die Menge (`crowdHuman`) prüfen: eventuell nur Farben über eine Option, ohne gesperrte Figuren zu ändern.
- Musik: Celesta-Motiv A–D–F–E, gegen Ende leise und langsam.
