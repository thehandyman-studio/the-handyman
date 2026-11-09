# THE HANDYMAN #3 – Where Lost Things Go – Skript + Szenenplan (v2)

Vorlage v2 (2026-11-06) · Standard: `docs/HANDYMAN_STANDARD.md` · Figur: `docs/HANDYMAN_CHARACTER_BIBLE.md` · Formel: `docs/HANDYMAN_BRAND.md`
Stand: 2026-11-09 · **ENTWURF v2, wartet auf Adrians Freigabe.** v2 folgt seiner Vorgabe: *Er verliert etwas und verfolgt es.* Einstieg: „What happens when you lose your …?“ Noch kein Bild-Code, keine Aufnahme, kein Ton.

## 0. Eckdaten
| | |
|---|---|
| Art | **fiktiv** (neugierig → staunend → unheimlich) |
| **Aufhänger** | eine Frage direkt an die Zuschauer: *„What happens when you lose your hammer?“* |
| **Auftrag des Handyman** | Arbeit an Mr. Pells Küchenspüle (Nebenfigur `boss`). Dabei rutscht ihm der Hammer vom Gürtel in den Abfluss. |
| **Verfolgung** | Er folgt dem Klappern durch die Rohre: Wand → Keller → unter die Straße → Kanalisation → eine winzige Tür mit der Aufschrift „LOST“. |
| **Entdeckung** | Dahinter liegt ein Lager, größer als die Stadt, in dem Angestellte alles sortieren, was je verloren wurde. |
| **Steigerung** | Er findet seinen Hammer („Lost today“), daneben ein Regal mit **seinem Namen**: alles, was er je verloren hat, bis zum Werkzeugkasten aus seiner Kindheit. |
| **Wendung** | Am Ende des Regals ist ein leerer Platz mit frischem Etikett: „The handyman. Lost today.“ Hinter ihm hebt ein Angestellter den Stempel. *Thunk.* |
| Länge | **158 Wörter** · geschätzt 47,9 s + 0,7 s = **48,6 s (1458 Bilder)** |
| Figuren | **The Handyman** (`HANDYMAN`) · Mr. Pell = `boss` (nur am Anfang) · Lagerangestellte (Menge, `crowdHuman`, mit Schürzen und Ärmelschonern) · der Stempel-Angestellte (`doc`, Brille, Kittel als Lagerkittel) |
| Orte / Licht | Küche (warm) → Rohre in der Wand / Keller (dunkel, Taschenlampen-Kegel) → Kanal (feucht, grünlich) → die kleine Tür → das Lager (riesig, golden, Lampenreihen, Staub) → sein Regal (enger, wärmer, still) |
| Schleife | **ja, als Echo statt Bildgleichheit:** Der Stempel fällt auf schwarz („Thunk“), dann beginnt die Folge wieder mit der Frage „What happens when you lose your hammer?“ – und der Zuschauer weiß jetzt: Jemand anderes wird bald seinen *Handyman* suchen. |

**Warum diese Fassung stärker ist:**
- **Die Frage im ersten Satz** spricht jeden direkt an. Jeder hat schon etwas verloren, also will man die Antwort wissen.
- **Eine Verfolgungsjagd hat eingebauten Zug:** Jeder Schritt führt tiefer, von der Küche bis in die Kanalisation, und mit jedem Schritt wird es fremder.
- **Ab der Mitte wird es persönlich:** Das Regal mit seinem Namen und der Werkzeugkasten aus seiner Kindheit geben der Figur zum ersten Mal eine Vergangenheit. Er spricht dabei weiterhin kein Wort.
- **Die Wendung dreht alles um:** Er sucht etwas Verlorenes und wird selbst zum Verlorenen.
- **„What happens when you lose your …?“ kann ein wiederkehrendes Format werden**, zum Beispiel für „… your shadow?“ oder „… your keys?“.

## 1. Fakten
Keine. Frei erfunden. Mr. Pell ist ein erfundener Name.

## 1a. Prüfung der Endlosschleife
- **Ende:** Der Stempel kracht herunter, Schnitt auf Schwarz mit dem dumpfen „Thunk“, 0,7 s Ausklang.
- **Anfang:** Aus dem Schwarz öffnet sich das Bild auf die Küchenspüle, und John fragt: „What happens when you lose your hammer?“
- **Warum das trägt:** Beim zweiten Durchlauf hört man die Frage anders. Man weiß jetzt, was passiert, wenn man etwas verliert, und dass er selbst verloren gegangen ist. Die Schleife ist hier inhaltlich, nicht bildgleich wie in Ep. 1 und 2.
- **Optional, als Bildbrücke:** Der Stempelabdruck „LOST“ steht in den letzten Bildern groß im Bild, und in Bild 1 trägt der Hammer am Gürtel ein winziges, gleiches Etikett. Das ist eine Entscheidung für dich, weil es Schrift im Bild ist.

## 2. Skript + Szenenplan

**Sprechtext (gleich `voice/narration.txt`, 158 Wörter):**
```
What happens when you lose your hammer?
The handyman finds out when his slips off his belt and drops down Mr. Pell's kitchen drain.
He follows the rattle through the pipes, down into the basement, and out under the street.
The clinking leads him deep into the sewer, to a tiny door that says: "LOST."
Behind it is a warehouse bigger than the city, where clerks sort everything anyone has ever lost.
Umbrellas, car keys, wedding rings, and a mountain of single socks.
He searches row after row until he finds his hammer, neatly tagged: "Lost today."
But next to it is a shelf with his name on it.
His old glasses, his lunchbox, and the toolbox he lost when he was six.
Every single thing he's ever lost, waiting for him.
At the very end is an empty space with a fresh tag.
It reads: "The handyman. Lost today."
Behind him, a clerk raises a stamp.
Thunk.
```

**Tempo für John:** Die Frage am Anfang ist neugierig gestellt (`[curious]`). Die Verfolgung ist zügig (`[energetic, fast-paced]`), wie eine Jagd. Ab „But next to it“ wird es ruhiger und persönlicher. Das Etikett wird geflüstert (`[whispers]`). „Thunk.“ ist trocken und allein.

**19 Einstellungen, Ø 2,6 s.** Zeiten aus `voice/estimate/words_estimated.json`. H = The Handyman, P = Mr. Pell, S = der Stempel-Angestellte.

| # | Teil | Start-Wort | ≈ s | Zweck | Größe | Kamera | Übergang rein | Figuren: Mimik / Geste (auf Wort) | Bild / Effekt | Ton |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Aufhänger | (Anfang) | 0,00–2,30 | hook | INSERT | `push` | aus Schwarz (Loop) | – | Großaufnahme: Hammer am Gürtel, die Schlaufe gibt langsam nach | leises Knarzen |
| 2 | Aufhänger | „The handyman finds“ | 2,30–5,14 | hook | MS | `push` | `glide` | H beugt sich über die Spüle (`lean`), P schaut über seine Schulter | Küche, warmes Morgenlicht | Gluckern |
| 3 | Aufhänger | „drops down“ | 5,14–7,38 | payoff | INSERT von oben | `punch` | `whip` | H greift ins Leere (`reach`, `shock`) | Der Hammer fällt in den Abfluss, *plopp* | *plopp*, Klappern entfernt sich |
| 4 | Verfolgung | „He follows“ | 7,38–10,93 | bridge | MS → WS | `track` | `whip` | H drückt das Ohr an die Wand, folgt dem Geräusch (`walk`, `look` zur Wand) | Klappern wandert hinter der Tapete nach unten (Comic-Geräuschlinien sparsam) | Klappern in den Rohren |
| 5 | Verfolgung | „and out under“ | 10,93–12,44 | bridge | WS | `crane` abwärts | `xfade` 8 | H öffnet einen Gullydeckel auf der Straße | Straße, Gully, Abendlicht | Deckel schabt |
| 6 | Verfolgung | „The clinking“ | 12,44–14,80 | info | WS, Kanal | `track` | `whip` | H watet durch den Kanal (`walk`), Hammer-Geräusch voraus | feuchte Wände, grünliches Licht, Tropfen | Plätschern, Echo |
| 7 | Entdeckung | „to a tiny“ | 14,80–16,72 | reveal | INSERT → MS | `push` | `glide` | H kniet vor der Tür (`lean`, `surprised`) | eine winzige, alte Holztür mit Messingschild **„LOST“**, warmes Licht durch die Ritzen | Musik hält an |
| 8 | Entdeckung | „Behind it“ | 16,72–19,31 | reveal | EWS | `crane` hoch und zurück | `flash` 6 (Tür geht auf) | H klein in der Tür | Das Lager: Regale bis zum Horizont, goldenes Licht, Staub | Musik öffnet sich, Chor-Pad |
| 9 | Entdeckung | „where clerks“ | 19,31–22,19 | info | WS | `orbit` | `whip` | Angestellte schieben Wagen, stempeln, klettern Leitern | Förderbänder, Rohrpost-Röhren | Gewusel, Stempel |
| 10 | Steigerung | „Umbrellas“ | 22,19–26,20 | payoff | TOP → INSERT | `push`, je ein `punch` pro Ding | `cut` (1 von 2) | – | Regenschirm-Wald, Schlüsselwand, Ringe in Schalen, **ein Berg einzelner Socken** (auf „mountain“) | komischer Tusch auf „socks“ |
| 11 | Steigerung | „He searches“ | 26,20–27,56 | info | MS | `track` | `whip` | H geht suchend durch die Gänge (`walk`, `look`) | – | Schritte |
| 12 | Steigerung | „until he finds“ | 27,56–30,69 | payoff | INSERT | `push` | `glide` | H greift erleichtert zu (`relief`) | **sein Hammer** im Fach, Etikett „Lost today“ | Glockenspiel-Motiv (A–D–F–E) |
| 13 | Wendung | „But next“ | 30,69–33,31 | reveal | MS | `push`, `dutch` 4° | `xfade` 8 | H dreht den Kopf, erstarrt (`surprised` → `worried`) | Regal mit Namensschild **„THE HANDYMAN“** | Musik wird leise |
| 14 | Wendung | „His old glasses“ | 33,31–37,33 | info | INSERT, Fahrt am Regal entlang | `track` | `glide` | – | alte Brille, eine Brotdose, ein kleiner roter Kinder-Werkzeugkasten | zarte Celesta |
| 15 | Wendung | „Every single“ | 37,33–40,22 | reaction | CU | `push` | `xfade` 8 | H nimmt den kleinen Werkzeugkasten in die Hand, gerührt (`calm`, `brows` 3) | – | Celesta-Motiv |
| 16 | Wendung | „At the very“ | 40,22–43,11 | reveal | WS, Fahrt ans Regal-Ende | `track` | `glide` | H geht langsam weiter | leerer Platz am Ende, frisches Etikett | Herzschlag beginnt |
| 17 | Pointe | „It reads“ | 43,11–45,39 | payoff | INSERT | `punch` auf „Lost today“ | `cut` (2 von 2) | – | Etikett **„THE HANDYMAN · LOST TODAY“** | Stille |
| 18 | Pointe | „Behind him“ | 45,39–47,61 | reaction | MS von hinten über S | `push` | `whip` | H von hinten, ahnungslos. S hebt im Vordergrund einen riesigen Stempel (`hold_up`) | Schatten des Stempels fällt über H | Riser |
| 19 | Pointe + Loop | „Thunk“ | 47,61–48,61 | payoff | CU H | `kick` | `glide` | H dreht sich um, **erstarrt mit Schweißtropfen** (`scared`, `sweat`) | Der Stempel fällt, Schnitt auf Schwarz auf „Thunk“ | dumpfer Stempelschlag, Stille |

Kürzel: Größe EWS, WS, MS, MCU, CU, INSERT, TOP · Kamera push, punch, crane, track, orbit, kick, dutch · Übergang xfade, whip, glide, flash, cut (max. 2)

## 3. Selbstprüfung
- [x] The Handyman ist Hauptfigur, ab Bild 1 im Bild (Hammer am Gürtel, ab Bild 2 ganz), heißt „the handyman“ (Satz 2 und 12) und spricht nicht.
- [x] Ausgangspunkt ist ein Auftrag (Küchenspüle), auch wenn die Frage voransteht. Der Hammer ist der Kern. Reaktionen (Charakterbibel §3): neugierig vorbeugen (2, 7), Hand ausstrecken (3), erstarren mit Schweißtropfen (19).
- [x] Satz 1 ist der Aufhänger, als Frage an die Zuschauer.
- [x] Steigerung: Abfluss → Wand → Keller → Straße → Kanal → Tür → Lager → sein Hammer → sein Regal → sein Platz → der Stempel.
- [x] Die Pointe steht im letzten Satz („Thunk.“), das Video endet darauf + 0,7 s.
- [x] 158 Wörter ≈ 48 s.
- [x] Kurze Sätze: 2 („It reads: …“ mit 5 Wörtern, „Thunk.“). Pro Satz höchstens 1 Wort in GROSSBUCHSTABEN, 3 Regieanweisungen (`[curious]` + `[energetic, fast-paced]` am Anfang, `[whispers]`).
- [x] 19 Einstellungen, keine über 5 s, keine zwei gleichen Größen hintereinander, 2 harte Schnitte (10, 17).
- [x] Keine fremden Inhalte.

**Entscheidungen für dich:**
1. **Schrift im Bild:** Drei Stellen tragen Text: die Tür („LOST“), das Namensschild am Regal („THE HANDYMAN“) und das Etikett. Ohne Schrift funktioniert die Wendung nicht. Der Standard erlaubt außer Untertiteln nur Zahlen. Im Pilot gab es mit dem Schild schon eine Ausnahme. Erlaubst du sie hier auch?
2. **Regieanweisungen:** `[curious]` vor der Frage plus `[energetic, fast-paced]` direkt danach zählen als zwei. Zusammen mit `[whispers]` sind es genau die erlaubten 3.
3. **Rückblick in die Kindheit:** „the toolbox he lost when he was six“ gibt ihm eine kleine Vorgeschichte. Sein Aussehen bleibt unverändert. Ist das in Ordnung?
4. **Kosten der Stimme:** etwa **390 Credits** (898 Zeichen). Erst nach deiner Freigabe.

## 4. Sprechtexte (Entwürfe angelegt)
- `voice/narration.txt`: Wortlaut (Untertitel-Vorlage)
- `voice/narration_john.txt`: Sprechfassung (898 Zeichen), Betonungen HAMMER, STREET, LOST (Türschild), BIGGER, MOUNTAIN, HIS, SIX, EMPTY
- `voice/narration_john.captions.json`: Untertitel-Regeln
- `voice/estimate/words_estimated.json`: geschätzte Wortzeiten (158 Wörter, Ende 47,91 s)
