# John natürlicher – Untersuchung und Vorschlag (2026-11-06)

**Rahmen:** kein kostenpflichtiger Aufruf, keine neue Aufnahme.
- Die Aufnahme `shorts/city-in-the-wall/voice/takes/john_mrab_v1/` wurde nur gelesen.
- Der Ordner `out/` enthält einen kostenlosen, lokalen Hörtest.
- Mary Celeste wurde nur gelesen.
- Kostenlose Abfrage bei ElevenLabs: Johns Standard-Einstellungen. Die Modell- und Kontoinfos lassen sich mit dem gespeicherten API-Schlüssel nicht abrufen, weil ihm dafür die Leserechte fehlen.

## 1. Was die aktuelle Aufnahme ausmacht
| | Wert | Johns Standard |
|---|---|---|
| Stability | **0,20** (sehr niedrig = sehr frei) | 0,50 |
| Similarity | 0,75 | 0,75 |
| Style | nicht gesendet → 0 | 0,00 |
| Speaker Boost | nicht gesendet | an |
| Nachbearbeitung | Tempo ×1,10 (Rubber Band), alle Pausen auf genau 0,18 s, Kompressor 2:1 mit Präsenzanhebung und Limiter auf −15 LUFS | – |

**Messungen (lokal):**
| | Roh (ElevenLabs) | Fertig (`voice_master.wav`) | Mary Celeste (John, roh) |
|---|---|---|---|
| Tonhöhenumfang (5–95 %) | 13,9 Halbtöne | 13,5 | 12,6 |
| Streuung der Tonhöhe | 4,4 Halbtöne | 4,4 | 3,9 |
| Pausenlänge: Streuung | 0,092 s | **0,038 s** | – |
| Lautheitsumfang (LRA) | 6,5 LU | **3,8 LU** | 3,6 |

**Deutung:**
1. **Die Melodie ist nicht flach, eher zu weit geschwungen.** Bei Stability 0,20 schwingt John in fast jedem Satz gleich stark nach oben und unten. Das wirkt wie ein „Ansager“-Muster und damit künstlich, obwohl viel Bewegung drin ist.
2. **Gleichförmiger Rhythmus durch unsere Nachbearbeitung.** Alle 21 Satzpausen sind genau 0,18 s lang. Ein Mensch macht mal kürzere, mal längere Pausen. Die Streuung sinkt von 0,092 auf 0,038 s, das klingt wie ein Metronom.
3. **Glättung durch die Klangkette.** Kompressor, Präsenzanhebung und Limiter machen die Lautstärke sehr gleichmäßig: Der Lautheitsumfang sinkt von 6,5 auf 3,8 LU. Das trägt zum „glatten“ Eindruck bei.
4. **Tempo ×1,10 (Rubber Band):** Es glättet die Tonhöhenbewegung nur wenig, um etwa 5 %. Das ist ein kleiner, aber hörbarer Anteil.

## 2. Kostenloser Hörtest (aus der vorhandenen Aufnahme, keine neue Aufnahme)
- `out/Vergleich_Anfang_Roh-Aktuell-P1.wav`: die ersten drei Sätze dreimal, getrennt durch 1 s Stille:
  1. Roh von ElevenLabs (ohne Tempo und ohne Kette, nur auf gleiche Lautheit gebracht)
  2. aktuelle fertige Fassung
  3. **P1**
- `out/P1_pausen-proportional_leichte-kette.wav`: die ganze Aufnahme als P1. Sie ist genauso lang (45,5 s) und hat dasselbe Tempo.
  - Pausen werden **anteilig** gekürzt statt alle auf 0,18 s. Sie liegen jetzt zwischen 0,11 und 0,25 s, die natürliche Abwechslung bleibt.
  - Leichtere Kette: Kompressor 1,5:1, keine Präsenzanhebung, sanfterer De-Esser. Der Lautheitsumfang liegt bei 4,5 statt 3,8 LU.

## 3. Vorschlag für die neue Aufnahme (erst nach deiner Freigabe)
Unverändert bleiben:
- Stimme John `OEHTkiHZj6OczWZHu0Aj` und Modell eleven_v4
- Text, Betonungen in GROSSBUCHSTABEN, `[energetic, fast-paced]`, `[whispers]`
- Tempo ×1,10 und dieselbe Gesamtlänge

| Einstellung | bisher | **neu** | Begründung |
|---|---|---|---|
| Stability | 0,20 | **0,35** | Weniger übertriebene, gleichförmige Schwünge, ruhigere und menschlichere Sprachmelodie. Die Betonungen kommen weiter aus den GROSSBUCHSTABEN und Anweisungen. Nicht 0,50, denn das wird spürbar flacher und weniger filmisch. |
| Similarity | 0,75 | **0,85** | Näher an der echten Sprecheraufnahme hinter John: mehr natürliche Stimmfarbe, Atem und Textur, weniger „generische KI-Stimme“. Nicht höher, sonst können Nebengeräusche der Vorlage mitkommen. |
| Style | 0 | **0,15** | Etwas mehr von Johns eigener Sprechweise und damit mehr natürliche Variation. Bewusst niedrig: Höhere Werte machen die Stimme theatralisch und unberechenbar. |
| Speaker Boost | nicht gesendet | **an** (ausdrücklich) | Verstärkt die Ähnlichkeit zum echten Sprecher. Das ist Johns Standard. |
| Nachbearbeitung | Pausen alle 0,18 s, Kette 2:1 | **wie P1** | Gleiche Länge und gleiches Tempo, aber natürlicher Rhythmus und weniger Glättung |

**Ehrliche Grenzen:**
- Ob eleven_v4 „Style“ voll umsetzt, kann ich vorab nicht prüfen, weil dem API-Schlüssel die Leserechte für Modellinfos fehlen.
- Jede Aufnahme fällt etwas anders aus, das ist bei ElevenLabs normal.
- Ob die Flüsterstelle wieder gelingt, zeigt erst die Aufnahme.

## 4. Credits (gemessen: 0,44 Credits je Zeichen; der Text hat 900 Zeichen)
| Weg | Inhalt | Credits ca. |
|---|---|---|
| **A** | eine ganze neue Aufnahme mit den neuen Einstellungen | **≈ 400** |
| **B (empfohlen)** | erst ein kurzer Test: Sätze 1–4 + Flüsterstelle, ca. 330 Zeichen, mit zwei Einstellungen: neu (0,35 / 0,85 / 0,15) und vorsichtig (0,30 / 0,80 / 0,10). Du wählst, dann die ganze Aufnahme. | 2 × ≈ 145 + ≈ 400 = **≈ 690** |

Warum ich B empfehle: „Natürlich“ ist ein Höreindruck. Ein kurzer Test kostet weniger als eine verworfene ganze Aufnahme. Die Testausschnitte würden in einem eigenen Take-Ordner liegen. Bestehende Dateien bleiben unverändert.

---

# Teil 2 (2026-11-06): Woher kommt der Hall? + trockene Studio-Varianten (kostenlos, lokal)
Keine neue Aufnahme, kein API-Aufruf. Die Aufnahme `john_mrab_v1` wurde nur gelesen. Mary Celeste ist unberührt.
Messwerkzeuge: `analysis/tails.py`, `analysis/decay.py`, `analysis/dryness.py`. Varianten: `make_variants_v2.py` → `out/v2/`.

## Messung: Ausklingen am Satzende
Gemessen wird ab dem letzten Lautstärkegipfel, bis wann der Pegel um 10, 25 und 40 dB gefallen ist. Je länger, desto mehr Hall.

| Stufe | −10 dB | −25 dB | −40 dB | Dichte zwischen Silben* |
|---|---|---|---|---|
| ElevenLabs roh (umgerechnet auf Tempo ×1,10) | 32 ms | 98 ms | 184 ms | 24,6 dB |
| + Rubber Band R3 (bisher) | **58 ms** | **140 ms** | 210 ms | 24,8 dB |
| + bisherige Kette (2:1, Präsenz, Limiter) | 55 ms | 145 ms | 220 ms | **21,7 dB** |
| + leichte Kette (P1) | 58 ms | 142 ms | 210 ms | 23,2 dB |

\* Abstand zwischen lauten Silben und den Lücken dazwischen. Weniger bedeutet, Hall oder Kompression füllen die Lücken.

In den Pausen selbst ist kein Rauschen und kein Raumton: Der Grundpegel liegt bei −85 dBFS, die Stille ist also digital sauber.

**Ursachen**
1. **Schon in der Rohaufnahme** ist ein kurzer Nachklang: knapp 0,2 s, bis der Ton um 40 dB leiser ist. Eine trockene, nahe Studiostimme fällt deutlich schneller ab. Vermutlich stammt das aus der Aufnahme, mit der die John-Stimme trainiert wurde, oder es ist Johns erzeugter Klang. Das ist der Grundanteil.
2. **Die Tempo-Verarbeitung (Rubber Band R3) verschmiert die Wortenden.** Der erste Abfall dauert fast doppelt so lang (32 → 58 ms). Das hört man als „Raum“ oder leichtes Phasing.
3. **Kompression** hebt die leisen Ausklänge zwischen den Silben an, die Lücken werden flacher (24,6 → 21,7 dB). Das macht den Raum hörbarer und die Stimme „glatter“. Die leichte Kette von P1 tut das weniger.
4. **Pausenkürzen** erzeugt keinen Hall. Es schneidet nur in der Stille.

## Hörvergleich
**`out/v2/Vergleich_V1-V5_Anfang+Fluestern.wav`** (81 s): Eine Ansage „Variante 1 … 5“ (macOS-Stimme Anna, nur zur Orientierung), dann jeweils die ersten drei Sätze und die Flüsterstelle.

Alle Varianten haben dieselbe Länge (45,505 s), dasselbe Tempo ×1,10, dieselben Pausen wie P1 und dieselben Wortzeiten (`out/v2/words_P1-pausen.json`), dazu −15 LUFS und True Peak ≤ −1,2 dBTP.

| | Tempo-Verfahren | Kette | Abfall −10 / −40 dB | Lücken | Eindruck laut Messung |
|---|---|---|---|---|---|
| V1 | Rubber Band R3 | leicht (= P1) | 50 / 210 ms | 22,0 dB | Referenz |
| V2 | Rubber Band R2 „crisp“ | leicht | 60 / 220 ms | 22,6 dB | Konsonanten etwas knackiger, Wortenden weniger verschmiert, minimal weniger Höhen |
| V3 | ffmpeg atempo | leicht | 42 / 200 ms | 20,1 dB | knappster Anfang, aber gefülltere Lücken; kann bei langen Vokalen leicht „stottern“ |
| **V4** | R2 crisp | **trocken-sanft**: Abwärts-Expander auf Ausklänge (max. −12 dB, vor dem Kompressor), −2 dB bei 300 Hz, +1 dB bei 4,5 kHz | 55 / **165 ms** | **31,2 dB** | deutlich trockener und näher, Klang bleibt voll |
| V5 | R2 crisp | **trocken-mittel**: Expander max. −18 dB, −3 dB bei 300 Hz | 55 / **128 ms** | **37,4 dB** | am trockensten; Gefahr, dass leise Wortenden etwas „abgeschnitten“ wirken |

**Prüfung:** Whisper erkennt in V4 und V5 alle 151 Wörter. Einzige Ausnahme ist dasselbe „But“, das Whisper schon beim Original übersprungen hat. Es ist hörbar vorhanden.

**Meine Empfehlung: V4.** Sie ist trocken, nah und präsent, ohne aggressives Gate und ohne dumpfe Klangfarbe. Der Expander senkt nur die Ausklänge und nimmt nichts aus der Stimme selbst. V5 nur, wenn dir V4 noch zu räumlich ist.

**Grenze:** Der Raumanteil steckt teilweise in der Rohaufnahme. Nachbearbeitung kann ihn nur verkürzen, nicht ganz entfernen. Echte Hall-Entfernung bräuchte ein zusätzliches Programm, also ein neues Paket, und das installiere ich nicht ohne deine Freigabe.

## Angepasster ElevenLabs-Vorschlag (nur falls eine neue Aufnahme gewünscht ist, nicht ausgeführt)
Änderung gegenüber Teil 1: **Similarity 0,80 statt 0,85**. Wenn der Hall aus Johns Trainingsaufnahme stammt, holt eine höhere Similarity mehr von diesem Raum zurück.

| | bisher | Vorschlag |
|---|---|---|
| Stability | 0,20 | **0,35** (natürlichere, weniger vorhersehbare Melodie ohne übertriebene Schwünge) |
| Similarity | 0,75 | **0,80** |
| Style | 0 | **0,10** (etwas mehr eigene Färbung; niedrig, damit die Dramaturgie stabil bleibt) |
| Speaker Boost | nicht gesendet | an (Johns Standard) |

Text, Betonungen, Anweisungen, Stimme und Modell bleiben unverändert. Danach dieselbe Nachbearbeitung wie gewählt (z. B. V4).

**Credits** (0,44 je Zeichen gemessen):
- ganze Aufnahme ≈ **400**
- mit Kurztest vorher (zwei Einstellungen) ≈ **690**

**Hinweis:** Eine neue Aufnahme ändert die Wortzeiten, das Bild passt sich automatisch an. Mit der vorhandenen Aufnahme und V4 bleiben die Wortzeiten exakt wie in P1.
