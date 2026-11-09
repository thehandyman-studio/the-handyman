# Episode 7 „Elevator 13“ – Prüfbericht

## Stand 2026-11-09: VORSCHAU aus der Cloud (ohne Erzählstimme)
Das Finale mit Johns Stimme entsteht auf dem Mac (`MAC_STEPS.md`). Diesen Bericht dort um den Abschnitt „Finale“ ergänzen.

### Dateien (Cloud, nicht in Git; `out/` wird nicht versioniert)
| Datei | Inhalt |
|---|---|
| `out/elevator-13/Elevator13_PREVIEW_1440x2560.mp4` | Master-Vorschau mit Musik + Geräuschen + Untertiteln |
| `out/elevator-13/Elevator13_PREVIEW_1080x1920.mp4` | dieselbe Fassung in 1080 × 1920 |
| `out/elevator-13/Elevator13_PREVIEW_1440x2560_picture.mp4` | ohne Ton (Bild/Schnitt allein prüfen) |

### Technische Prüfung (`short_qa.py`, `qa_shots.py`)
| Prüfung | Ergebnis |
|---|---|
| Auflösung / Bildrate | 1440 × 2560 bzw. 1080 × 1920, 30 fps ✅ |
| Länge | 1716 Bilder = 57,2 s (letztes Wort + 1,6 s) ✅ (Ziel 56–60 s) |
| Schwarze Bilder | keine ✅ |
| Ungeplante weiße Bilder | keine ✅ |
| Eingefrorene Stellen (≥ 12 Bilder) | keine ✅ (zwei waren im ersten Render, behoben) |
| Bildsprünge | alle gemeldeten Sprünge sind geplant: Ruck auf „thirteen“, Platte öffnet, 13 leuchtet auf, Halt, Ruck auf „believe“/„familiar“, Schnitte, 13-Aufblitzen am Ende ✅ |
| Loop-Naht | letztes Bild ↔ erstes Bild oberhalb der Untertitel: mittlere Abweichung 0,3 (Graustufen 0–255), d. h. unsichtbar ✅ (erster Render: 8,7 – Schatten in der Kabine, behoben) |
| Ton | 48 kHz Stereo AAC, Länge = Bild ✅; −24,4 LUFS, Peak −2,5 dBFS (ohne Stimme absichtlich leiser, siehe SOUND_PLAN.md) |
| Ton-Loop | Pegelsprung an der Naht 1,0 dB bei 1,05 dB Median ✅ |
| Untertitel | Text = `narration.txt`, Position 76 %, Nunito; laufen auf **geschätzten** Zeiten |
| Frühere Produktionen | Pilot, Mary Celeste, Engine, `shortmix.py`, `sfx_gen.py`: keine Änderung (git diff gegen afcbbbb leer) ✅ |

### Sichtprüfung (alle 32 Einstellungen, Kontaktbögen alle 1 s)
- Hook: Tastenfeld 1–12 + leuchtende 13 im ersten Bild, Leo bemerkt sie ✅
- Haus oben (Backstein, Kupferdach, Lieferwagen) und Kopie unten in **derselben** Einstellung → klar wiedererkennbar ✅
- Fahrt: Anzeige 12 → 13 → −1 … −20, Schacht, Felsschacht, Tastenhämmern, harter Halt ✅
- Türen öffnen auf die Stadt (erster Render: Türen blieben zu – Wortbezug „One“ falsch, behoben) ✅
- Stadt: Kranfahrt, leere Allee mit dem einsamen Aufzug, Luftbild, Fenster ✅
- Zweiter Leo im Lobbyfenster, hebt den Kopf; Fenster später dunkel ✅
- Ende: Aufzug wieder offen, 13 leuchtet, Leo tritt rückwärts hinein, Türen zu, 13 geht an = Bild 1 ✅
- Handyman: Werte aus `HANDYMAN`, Hammer sichtbar (u. a. 12b, 25), Reaktionen „Erstarren mit Schweißtropfen“, „Vorbeugen“, „Nachdenken“ ✅

### Offene Punkte
1. **Stimme fehlt** (Schlüssel nur auf dem Mac). Danach Bild + Untertitel auf echte Wortzeiten, Mix auf −14 LUFS, Stimme vorn (≥ 12 dB).
2. Erzählung nennt ihn „Leo“ (Auftrag), Charakterbibel sonst „the handyman“.
3. Schnitttempo: Ø 1,8 s pro Einstellung (Standard 2–4 s). Mit der echten Aufnahme neu bewerten; kürzeste: „16 streets“ und „27 dark“ (je ≈ 1,1 s).
4. Schachtfahrt (Bilder 09/10) liest sich eher als Bewegung/Atmosphäre; die aufgemalten Etagennummern sind kaum zu erkennen.
