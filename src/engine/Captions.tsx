// Word-by-word captions (skill step 8), a plain React layer above the 3D canvas (no ink, blur or grade on it).
// Source: the corrected word timings of the short (words_master.json / words_snapped.json), imported directly.
//  - one word at a time, hard swap; a word appears LEAD frames before it is spoken and stays until the next word
//  - in a pause of >= HIDE_PAUSE s the caption clears HOLD s after the word ends (no caption hanging in silence)
//  - words shorter than MIN_FRAMES are grouped with the following word(s) (max 3) so nothing flickers
//  - text = word without trailing punctuation (keeps apostrophes, hyphens, numbers like 1,701)
//  - look: white, heavy rounded sans, ~6 px black outline + soft shadow, ~100 px at 1080 wide, centred, baseline at
//    66 % of the frame height (band 60-74 %), long words shrink to 80 % of the width, never wrap.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Word, FPS } from "./timeline";

export const CAPTION = { LEAD: 1, HIDE_PAUSE: 0.25, HOLD: 0.08, MIN_FRAMES: 4, SIZE: 104, BASELINE: 0.66, STROKE: 7,
  FONT: '"Arial Rounded MT Bold", "Arial Black", "Helvetica Neue", sans-serif' };

type Unit = { text: string; a: number; b: number };
const clean = (w: string) => w.replace(/[.,!?;:…"“”)]+$/u, "").replace(/^["“(]+/u, "");

/** caption units with their on-screen frame ranges [a, b) */
export const captionUnits = (words: Word[]): Unit[] => {
  const units: { ws: Word[] }[] = [];
  for (let i = 0; i < words.length; i++) {
    const u = { ws: [words[i]] };
    while (u.ws.length < 3 && i + 1 < words.length) {
      const last = u.ws[u.ws.length - 1], next = words[i + 1];
      const shown = (next.s - u.ws[0].s) * FPS;
      if (shown >= CAPTION.MIN_FRAMES || next.s - last.e > CAPTION.HIDE_PAUSE) break;
      u.ws.push(next); i++;
    }
    units.push(u);
  }
  return units.map((u, k) => {
    const first = u.ws[0], last = u.ws[u.ws.length - 1], nxt = units[k + 1]?.ws[0];
    const a = Math.max(0, Math.round(first.s * FPS) - CAPTION.LEAD);
    let b = nxt ? Math.round(nxt.s * FPS) - CAPTION.LEAD : Math.round((last.e + CAPTION.HOLD) * FPS);
    if (nxt && nxt.s - last.e >= CAPTION.HIDE_PAUSE) b = Math.min(b, Math.round((last.e + CAPTION.HOLD) * FPS));
    return { text: u.ws.map((w) => clean(w.w)).join(" "), a, b: Math.max(b, a + 1) };
  });
};

/** optional per-short look (mrABSURDLY: baseline 0.76 + embedded OFL font); defaults = CAPTION (Mary Celeste unchanged) */
export type CaptionStyle = { baseline?: number; font?: string; size?: number };
export const Captions: React.FC<{ words: Word[]; style?: CaptionStyle }> = ({ words, style }) => {
  const f = useCurrentFrame();
  const units = React.useMemo(() => captionUnits(words), [words]);
  const u = units.find((x) => f >= x.a && f < x.b);
  if (!u) return null;
  // shrink long words to 80 % of the width (rounded heavy sans: ~0.62 em per character)
  const size = Math.min(style?.size ?? CAPTION.SIZE, (1080 * 0.8) / Math.max(1, u.text.length * 0.62));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: 0, right: 0, top: `${(style?.baseline ?? CAPTION.BASELINE) * 100}%`, transform: "translateY(-80%)",
        textAlign: "center", whiteSpace: "nowrap", fontFamily: style?.font ?? CAPTION.FONT, fontWeight: 900, fontSize: size, lineHeight: 1,
        color: "#ffffff", WebkitTextStroke: `${CAPTION.STROKE * 2}px #000000`, paintOrder: "stroke fill",
        textShadow: "0 6px 14px rgba(0,0,0,0.55)", letterSpacing: "0.01em",
      }}>{u.text}</div>
    </AbsoluteFill>
  );
};
