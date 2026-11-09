# Episode 7 – Soundplan

Mischskript: `scripts/audio/elevatormix.py` (eigene Partitur + Atmo + Effekte, Loop über `Ring`), Geräusche: `scripts/audio/sfx_elevator.py`. Alles lokal synthetisiert, keine fremden Klänge. `shortmix.py`, `sfx_gen.py`, `dsp.py`, `instruments.py` werden nur importiert, nicht geändert.

Alle Zeitpunkte hängen an **Wörtern** (`words_timed.json`), d. h. mit der echten John-Aufnahme verschiebt sich alles automatisch mit.

## Musik (D-Moll, Leitmotiv A–D–F–E auf Celesta/Spieluhr)
| Abschnitt | Wörter | Musik |
|---|---|---|
| A Taste 13 | Anfang – „Leo was“ | tiefer D-Liegeton, gläserner hoher Klang, Leitmotiv langsam und dünn; hohes E auf „thirteen“ |
| B Reparatur | „Leo was“ – „Then the button“ | leise Pizzicato-Figur (neugierig); auf „felt wrong“ kippt die Harmonie (Es-Dur über D = „falsch“), Horn-Akzent |
| C Fahrt | „Then the button“ – Halt | Herzschlag-Pauke wird immer schneller, Tuba steigt chromatisch ab, Streicher-Cluster türmt sich, Riser in den Aufprall |
| Halt | nach „allow.“ | Schlag + Sub-Boom, dann **Stille** (nur Nachknarzen, leises Brummen) |
| D Stadt | „When“ – „Then he noticed“ | sehr tiefer Liegeton, großer Akkord auf „An entire city“ (F-Dur → C → B♭maj7 → Dm9), Pauke + Becken, Leitmotiv eine Oktave höher |
| E Entdeckung | „Then he noticed“ – „himself“ | Musik dünnt aus, Leitmotiv bricht nach drei Tönen ab, gedämpfter Puls, hoher Spannungston wächst; ein dumpfer Schlag auf „himself“, dann **Stille** |
| F Schleife | „Suddenly“ – Ende | Liegeton, Leitmotiv vollständig auf „glowing again“, unaufgelöstes F/F♯ hoch, umgekehrter Becken-Anstieg, Pauke + Blechstoß genau, wenn die 13 angeht (= Bild 0) |

## Atmo
- Flur im 12. Stock (Raumton, fernes Radio, Netzbrummen) bis die Türen schließen
- Kabine: altes Licht-Summen, tiefes Rauschen
- Höhle/Stadt: Wind durch leere Straßen, ganz tiefer Druck-Ton, ferne Tropfen mit langem Hall, gelegentliches Ächzen von altem Stahl. **Keine Stimmen, nichts Lebendiges.** Blendet mit dem Türöffnen ein und wird gedämpft, wenn die Türen am Ende zugehen.

## Effekte
| Wort | Geräusch |
|---|---|
| Bild 0 (= letztes Bild) | Taste 13 geht an: Klick, elektrisches Brummen, leiser Glockenton (klingt über die Loop-Naht) |
| „broken“ | Schraubenzieher quietscht, Abdeckplatte schwingt auf; „wrong“: Platte klappt zu |
| „lit“ | Taste 13 geht von selbst an |
| „closed“ | Türen rollen zu, Schlag |
| „started“ | Motor läuft an (Relais, Heulen) |
| „down“ … Halt | Fahrt: Seil-Zischen, Schienenstöße immer schneller, Sub-Grollen; Ruckler auf down / basement / foundations / deeper / should; Lichtflackern; Vorbeisausen auf „Past the foundations“ |
| „Much“ | er hämmert auf die Tasten (10 Klicks) |
| Halt | Bremsen kreischen, tiefer Schlag, Nachknarzen |
| „When“ | Türen öffnen langsam |
| „Empty“ | vorsichtige Schritte |
| „One“ | weit hinter ihm schließen sich die Türen (leise) |
| „Suddenly“ | Ankunfts-„Ding“ mit Höhlenecho, Türen öffnen |
| „waiting“ | Schritte rückwärts; „for him“: Türen schließen hart |

## Pegel (Standard)
Musik −18,5 LUFS (unter Sprache −10 dB, zusätzlich −4 dB bei 1–4 kHz), Atmo −26 LUFS (−6 dB unter Sprache), Effekte −25 LUFS (−3 dB), Musik Hochpass 38 Hz, Atmo 70 Hz. Gesamt −14 LUFS, True Peak ≤ −1 dBTP, Limiter über die Loop-Naht.
**Ohne Stimme (Vorschau):** keine Normalisierung auf −14 LUFS, sondern der Pegel, den das Bett auch mit Stimme hätte (+1 dB). Die Vorschau ist deshalb leiser (≈ −24 LUFS).
