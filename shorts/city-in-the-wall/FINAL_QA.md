# City in the Wall – Finaler Export (2026-11-06)
**Datei:** `out/city-in-the-wall/CityWall_FINAL_1440x2560.mp4` (99,9 MB). Die Bildspur ohne Ton liegt daneben als `…_picture.mp4`.
Erstellt mit `node scripts/render-short.mjs CityWallShort shorts/city-in-the-wall …` aus dem freigegebenen Stand der Vorschau v1.
Keine inhaltlichen Änderungen.

| Prüfung | Ergebnis |
|---|---|
| Auflösung, Bildrate | 1440 × 2560, 30 fps, H.264, 17 Mbit/s |
| Laufzeit | 45,833 s = 1375 Bilder. Ton gleich lang (45,833 s) |
| Ton | AAC 48 kHz Stereo, 315 kbit/s. −14,0 LUFS, LRA 4,6 LU, True Peak −1,3 dBFS, keine übersteuerten Samples |
| Ton = freigegebener Mix | Korrelation mit `audio/mix.wav` 0,9999 (Unterschied nur durch AAC-Kodierung) |
| Bild = freigegebene Vorschau | PSNR 36,4 dB im Mittel (min. 29,8). Die Abweichung kommt nur vom Rendern in höherer Auflösung (feinere Kanten und Figuren), es gibt keine inhaltlichen Unterschiede. |
| Bildfehler (`short_qa.py`) | keine schwarzen Bilder, keine ungeplanten Weißblitze, keine Standbilder ≥ 12 Bilder. Ausschläge nur bei Schnitten und gewollten Kamerastößen. |
| Loop Bild | Naht 3,99 bei normalem Bildwechsel 3,10 (max. 21,2) → **nahtlos** |
| Loop Ton | Pegelsprung an der Naht 3,0 dB (gewollte Atempause vor dem Durchbruch, normal 1,4 dB). Kein Klick: Die Samples am Ende und am Anfang liegen nahe beieinander (−0,035 / −0,030). |
| Ausgangsdateien unverändert (MD5) | V3, Bild v5, Mix, Vorschau ✔ · Mary-Celeste-Mix ✔ |

Prüfdaten: `out/city-in-the-wall/qa_final/` (overview.jpg, pace.md, loop.md, loop_seam.jpg, report.md)
