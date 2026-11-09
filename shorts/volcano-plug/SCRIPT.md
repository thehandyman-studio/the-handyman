# THE HANDYMAN #? – The Leaking Volcano – Skript + Szenenplan

Entwurf v4 (2026-11-09, Claude im Browser) · **von Adrian freigegeben (2026-11-09)** · Standard: `docs/HANDYMAN_STANDARD.md` · Figur: `docs/HANDYMAN_CHARACTER_BIBLE.md` · Formel: `docs/HANDYMAN_BRAND.md`
v2 nach Adrians Vorgaben: Anfang „Have you ever seen a leaking volcano?“, der Bürgermeister ruft ihn, am Ende des Risses wartet eine Überraschung, **mehrere unvorhersehbare Wendungen**. v4: Geschenk ist ein Mini-Vulkan statt eines Dracheneis (Adrians Vorgabe). v3: Rückblende Drachenjäger nach Einstellung 12 (Adrians Vorgabe), dafür an anderen Stellen gekürzt. v1 (Schraubzwinge, neuer Vulkan beim Bauern) ist ersetzt.
Noch nichts umgesetzt: kein Bild-Code, keine Stimme, kein Ton. Zeiten sind geschätzt (≈ 3,6 Wörter/s).

## 0. Eckdaten
| | |
|---|---|
| Art | **fiktiv**, absurd-komisch, märchenhaft |
| **Auftrag des Handyman** | der Bürgermeister einer Insel ruft an: Der Vulkan leckt Rauch, er soll das Leck finden und reparieren |
| **Entdeckung** | am Ende des Risses ist eine kleine Holztür mit Klingel, und dahinter wohnt ein Drache im Schlafanzug |
| **Wendungen** (absichtlich mehrere) | 1. Tür im Fels → 2. Drache öffnet und niest → 3. Der Vulkan leckt gar nicht, der Drache ist erkältet, weil seine Heizung kaputt ist → 3b. Früher versteckten sich Drachen in Vulkanen vor Drachenjägern; die Zeit ist längst vorbei, aber niemand hat es ihm gesagt (Kalender von 1347) → 4. Reparatur gelingt, aber der Bürgermeister ist sauer: Der Rauch war die einzige Touristenattraktion → 5. Er baut dem Drachen einen Schornstein, der Vulkan bläst Rauchringe → 6. Zum Dank bekommt er einen Mini-Vulkan. Abends fängt der auf seiner Werkbank an zu rauchen |
| Schleife | **ja:** „ein dünner Rauchfaden zischt aus einem Riss“ steht am Anfang (großer Vulkan) und am Ende (Mini-Vulkan auf seiner Werkbank). Die erste Frage „Have you ever seen a leaking volcano?“ passt danach wieder genau. |
| Länge | Ziel ≈ 63 s · **227 Wörter** |
| Figuren | **The Handyman** · `boss` als Bürgermeister · **Drache** (neue Figur, siehe 5.) · Touristen und Dorfbewohner (Menge) · Drachenjäger/Ritter in der Rückblende (Menge mit Rüstung, neu) |
| Orte / Licht | Insel mit Vulkan (Tag) → verrauchtes Dorf → Vulkanhang → Drachenwohnung im Berg (kalt, blau, dann warm orange) → Rückblende (vergilbt, wie ein altes Gemälde) → Gipfel mit Schornstein (Abendgold) → Werkstatt (Nacht) |

## 1. Fakten
Entfällt, die Geschichte ist erfunden.

## 2. Skript + Szenenplan

### Sprechtext (rein)
```
Have you ever seen a leaking volcano?
This one leaked so much smoke that the mayor called the handyman to fix it.
He climbed the volcano and found a thin stream of smoke hissing from a crack.
But at the other end of the crack was a tiny wooden door with a doorbell.
He rang, and a dragon in pajamas opened the door and sneezed smoke right into his face.
The volcano wasn't leaking.
The dragon inside it just had a terrible cold, because his heater had been broken for weeks.
You see, back in the day, dragons hid inside volcanoes to escape the dragon hunters.
But those days were long over, and nobody had ever told this dragon.
So the handyman crawled into the boiler room and fixed it with three taps of his hammer.
Warm air filled the mountain, the dragon stopped sneezing, and the smoke disappeared.
But the mayor wasn't happy, because that smoke was the only reason tourists came to the island.
So the handyman went back up and built the dragon a chimney, and soon the volcano blew perfect smoke rings.
The tourists came back, and the dragon was so grateful that he gave the handyman a present: a tiny volcano.
That night, on his workbench, the tiny volcano began to rumble, and a thin stream of smoke hissed from a crack.
```

### Szenenplan
| # | Teil | Sprechtext | Start-Wort | ≈ s | Zweck | Größe | Kamera | Übergang rein | Figuren: Mimik / Geste (auf Wort) | Hervorhebung / Effekt | Ton |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Aufhänger | Have you ever seen a leaking volcano? | (Anfang) | 1,7 | hook | EWS | push | – (Loop-Anschluss) | kleines Boot mit dem Handyman nähert sich der Insel | Vulkan pufft Rauch in **unregelmäßigen Stößen** (Niesrhythmus, versteckter Hinweis) | Meer, fernes dumpfes „Puff“ |
| 2 | Auftrag | This one leaked so much smoke that the mayor | This | 3,0 | info | WS | push | xfade | Dorf im Rauch, Leute husten mit Tüchern vor dem Mund | Rauchschwaden | Husten, Möwen |
| 3 | Auftrag | called the handyman to fix it. | called | 1,4 | info | MCU | punch | – | `boss` hustend am Steg, schüttelt dem Handyman die Hand, Handyman mit Hammer und rotem Werkzeugkasten | – | Händedruck |
| 4 | Aufbau | He climbed the volcano | climbed | 1,2 | track | WS | track | whip | steigt den Hang hinauf (`view: back`) | – | Schritte, Geröll |
| 5 | Entdeckung | and found a thin stream of smoke hissing from a crack. | found | 2,6 | reveal | INSERT | push | – | – | Riss im Fels, zischender Rauchfaden | Zischen |
| 6 | Wendung 1 | But at the other end of the crack | other | 1,8 | track | TOP | track (am Riss entlang) | – | Handyman folgt gebückt dem Riss (`lean` 7) | – | Zischen wird leiser |
| 7 | Wendung 1 | was a tiny wooden door with a doorbell. | tiny | 1,9 | reveal | INSERT | punch auf „doorbell“ | – | – | kleine Holztür im Fels, Messingklingel, Lichtkranz | Celesta-Motiv, kurz |
| 8 | Wendung 2 | He rang, and a dragon in pajamas opened the door | rang | 2,6 | reveal | MS | push | – | Handyman klingelt, Tür geht auf, Drache im gestreiften Schlafanzug mit roter Nase, Handyman `expr: surprised` | – | „Ding-dong“, Tür knarrt |
| 9 | Wendung 2 | and sneezed smoke right into his face. | sneezed | 1,9 | reaction | CU | `kick` auf „sneezed“ | – | Gesicht voller Ruß, Haare nach hinten geweht, blinzelt | Rußwolke, Sterne | lautes „Hatschi“ |
| 10 | Wendung 3 | The volcano wasn't leaking. | wasn't | 1,1 | payoff | EWS | push | whip | – | Vulkan pufft genau im Takt des Niesens | Echo vom Niesen |
| 11 | Wendung 3 | The dragon inside it just had a terrible cold, | dragon | 2,3 | info | MCU | push | – | Drache putzt sich mit riesigem Taschentuch die Nase, Decke um die Schultern | – | Naseputzen |
| 12 | Wendung 3 | because his heater had been broken for weeks. | heater | 2,3 | info | INSERT | push | – | – | alter Heizkessel, kalt, Eiszapfen, Spinnweben | Tropfen, Wind |
| 12a | Rückblende | You see, back in the day, dragons hid inside volcanoes | back | 2,8 | info | WS | push | xfade (Rückblende: vergilbte Farben wie ein altes Gemälde) | viele Drachen fliegen in rauchende Vulkane | Papier-Textur über dem Bild | Laute, alte Fanfare |
| 12b | Rückblende | to escape the dragon hunters. | escape | 1,5 | info | MS | track | – | Ritter mit Netzen und Lanzen suchen vergeblich | – | Hufe, Rüstungsklappern |
| 13a | Wendung 3b | But those days were long over, | long | 1,7 | twist | INSERT | punch auf „over“ | xfade (zurück in die Drachenwohnung) | – | verstaubter Wandkalender des Drachen, **Jahreszahl 1347**, Spinnweben | Staub-Puff |
| 13b | Wendung 3b | and nobody had ever told this dragon. | nobody | 2,0 | reaction | MCU | push | – | Drache späht ängstlich aus der Tür, Handyman zuckt mit den Schultern (`shrug`), `expr: thinking` | – | kleines Fagott-Motiv |
| 13 | Steigerung | So the handyman crawled into the boiler room | crawled | 3,0 | action | MS | track | – | kriecht mit Taschenlampe hinein (`view: back`), beugt sich vor, `expr: thinking` | Lichtkegel | Krabbeln, Metall |
| 14 | Steigerung | and fixed it with three taps of his hammer. | fixed | 2,2 | action | INSERT | `kick` je Schlag | – | Hammer klopft dreimal auf den Kessel | Funken, Flamme springt an | Klopfen ×3, „Wuff“ der Flamme |
| 15 | Steigerung | Warm air filled the mountain, the dragon stopped sneezing, | Warm | 2,8 | reaction | MCU | push | – | Drache lächelt, Decke fällt ab | Licht wechselt von blau zu warm orange | warmes Summen |
| 16 | Steigerung | and the smoke disappeared. | smoke | 2,2 | bridge | EWS | crane (heraus) | – | – | Himmel wird klar | Möwen, Erleichterung |
| 17 | Wendung 4 | But the mayor wasn't happy, | mayor | 1,4 | twist | CU | punch | **cut** | `boss` runzelt die Stirn, Arme verschränkt | – | Musik bricht ab |
| 18 | Wendung 4 | because that smoke was the only reason tourists came to the island. | tourists | 3,4 | info | WS | push | – | Touristen mit Kameras steigen enttäuscht aufs Schiff, Souvenirstand mit Vulkan-Tassen ist leer | – | Schiffshorn |
| 19 | Wendung 5 | So the handyman went back up and built the dragon a chimney, | built | 3,0 | action | MS | push | xfade (Abendgold) | Handyman mauert auf dem Gipfel, Drache reicht Ziegel, beide `expr: happy` | – | Kelle, Hämmern |
| 20 | Wendung 5 | and soon the volcano blew perfect smoke rings. | rings | 2,9 | payoff | EWS | crane | – | – | große Rauchringe über der Insel | Celesta-Motiv, voll |
| 21 | Wendung 6 | The tourists came back, and the dragon was so grateful | tourists | 2,8 | reaction | WS | push | – | Touristen jubeln und fotografieren, Drache winkt vom Gipfel | – | Jubel |
| 22 | Wendung 6 | that he gave the handyman a present: a tiny volcano. | present | 2,5 | reveal | MCU | punch auf „volcano“ | – | Drache reicht ihm einen Mini-Vulkan im Blumentopf, Handyman hält ihn vorsichtig, `expr: surprised` | Mini-Vulkan glänzt, winziges Rauchwölkchen | Glanz-Ton |
| 23 | Pointe | That night, on his workbench, the tiny volcano began to rumble, | night | 3,0 | bridge | INSERT | push | xfade (Nacht, blau) | – | Mini-Vulkan auf der Werkbank neben dem Hammer, Werkzeug zittert | leises Grollen, Uhrticken |
| 24 | Pointe | and a thin stream of smoke hissed from a crack. | stream | 2,5 | payoff | CU | push | – | Handyman starrt, `expr: scared`, `sweat: true`, Rauchfaden steigt vor seinem Gesicht | Rauchfaden aus einem Riss im Mini-Vulkan, wie in Bild 5 | **Zischen** → Bild 1 |

**Schleife:** Bild 24 endet mit dem Rauch aus dem Mini-Vulkan. Bild 1 zeigt den großen Vulkan, der Rauch pufft, und John fragt: „Have you ever seen a leaking volcano?“

## 3. Selbstprüfung vor der Freigabe
- [x] The Handyman ist ab Bild 1 (im Boot) zu sehen und Hauptfigur. Er heißt „the handyman“ und spricht nicht.
- [x] Beginnt mit einem Auftrag (Bürgermeister ruft an). Hammer in Bild 3, 14 und 23. Reaktionen: vorbeugen, nachdenken, erstarren mit Schweiß.
- [x] Satz 1 ist der Aufhänger, als Frage an die Zuschauer (Adrians Vorgabe; mit 6 Wörtern kürzer als die Richtzahl, das ist gewollt).
- [x] Sieben Wendungen, jede ändert die Richtung der Geschichte. Keine ist aus der vorigen vorhersehbar.
- [x] Pointe im letzten Satz, Video endet auf „crack“.
- [x] Wortzahl 227 ÷ 3,6 ≈ 63 s (Rahmen 40–65 s).
- [x] Kurze Sätze: „Have you ever seen a leaking volcano?“, „The volcano wasn't leaking.“ (2).
- [x] 28 Einstellungen (12a/12b/13a/13b neu), keine zwei gleichen Größen hintereinander, 1 harter Schnitt.
- [x] Eigene Geschichte, nichts übernommen.

## 4. Vorschlag Sprechtext für ElevenLabs (erst nach Freigabe → `voice/narration_john.txt`)
```
[energetic, fast-paced] Have you ever seen a LEAKING volcano?
This one leaked so much smoke that the mayor called the handyman to fix it.
He climbed the volcano and found a thin stream of smoke hissing from a CRACK.
But at the other end of the crack was a tiny wooden DOOR with a doorbell.
He rang, and a DRAGON in pajamas opened the door and sneezed smoke right into his face.
The volcano wasn't leaking.
The dragon inside it just had a terrible COLD, because his heater had been broken for weeks.
[storytelling] You see, back in the day, dragons hid inside volcanoes to escape the dragon HUNTERS.
But those days were long over, and NOBODY had ever told this dragon.
So the handyman crawled into the boiler room and fixed it with three taps of his HAMMER.
Warm air filled the mountain, the dragon stopped sneezing, and the smoke disappeared.
But the mayor wasn't HAPPY, because that smoke was the only reason tourists came to the island.
So the handyman went back up and built the dragon a CHIMNEY, and soon the volcano blew perfect smoke rings.
The tourists came back, and the dragon was so grateful that he gave the handyman a present: a TINY volcano.
[quiet] That night, on his workbench, the tiny volcano began to rumble, and a thin stream of smoke hissed from a crack.
```

## 5. Offene Punkte für den Mac
- **Neue Figur: Drache.** Vorschlag: freundlich, rundlich, grün-türkis, gestreifter Schlafanzug, rote Schnupfnase, kleine Flügel. Er ist keine Menschenfigur aus `human.ts`, sondern ein eigenes gezeichnetes Modell im selben Stil (Tusche-Kontur). Das ist der größte Bauaufwand der Folge. Eintrag in `docs/CAST_BIBLE.md` erst nach Freigabe durch Adrian.
- `boss` als Bürgermeister passt zur Figurenbibel (Marineanzug, Schnurrbart).
- **Kulissen:** Insel mit Vulkan, verrauchtes Dorf mit Steg, Felsriss mit Holztür, Drachenwohnung mit Heizkessel, Gipfel mit Schornstein, Werkstatt (darf das Zuhause aus dem Pilot sein).
- Ordnername bleibt `shorts/volcano-plug/`, damit nichts doppelt entsteht. Umbenennen in `leaking-volcano` nur, wenn du willst.
