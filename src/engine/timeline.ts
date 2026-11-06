// Timeline from the narration's word timings (words_master.json): scenes and story beats are addressed by WORDS,
// never by typed frame numbers, so a new voice take re-times the whole picture automatically.
export const FPS = 30;
export type Word = { w: string; s: number; e: number };
const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, "");

export class Timeline {
  readonly words: Word[];
  readonly total: number; // frames: last word end + tail
  constructor(words: Word[], tailS = 1.0) {
    this.words = words;
    this.total = Math.ceil((words[words.length - 1].e + tailS) * FPS);
  }
  /** index of the first word of `phrase` (space-separated, case/punctuation-insensitive), `nth` occurrence (0-based) */
  idx(phrase: string, nth = 0): number {
    const p = phrase.split(/\s+/).map(norm);
    let hit = 0;
    for (let i = 0; i + p.length <= this.words.length; i++) {
      if (p.every((q, k) => norm(this.words[i + k].w) === q)) {
        if (hit === nth) return i;
        hit++;
      }
    }
    throw new Error(`timeline: phrase "${phrase}" #${nth} not found`);
  }
  /** frame where the word / phrase starts */
  at(phrase: string, nth = 0) { return Math.round(this.words[this.idx(phrase, nth)].s * FPS); }
  /** frame where the last word of the phrase ends */
  end(phrase: string, nth = 0) {
    const n = phrase.split(/\s+/).length;
    return Math.round(this.words[this.idx(phrase, nth) + n - 1].e * FPS);
  }
  /** cut frame for a shot that starts with this phrase: `lead` frames before the word (skill rule 0-3 f) */
  cut(phrase: string, nth = 0, lead = 2) { return Math.max(0, this.at(phrase, nth) - lead); }
}

/** scene table from cut frames: [{id, a, b}] covering 0..total */
export const scenesFrom = (cuts: number[], total: number) =>
  cuts.map((a, i) => ({ id: i + 1, a, b: i + 1 < cuts.length ? cuts[i + 1] : total }));
