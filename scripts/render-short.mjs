// usage: node scripts/render-short.mjs <CompositionId> <shortDir> <out.mp4> [scale=4/3]
// Renders the picture (h264, CRF 16, 1080x1920 x scale -> 1440x2560), then muxes <shortDir>/audio/mix.wav
// (Remotion writes a silent track: map video from the render, audio from the mix). Set REMOTION_TMP to a big folder.
import fs from "node:fs";
if (process.env.REMOTION_TMP) { fs.mkdirSync(process.env.REMOTION_TMP, { recursive: true }); process.env.TEMP = process.env.TMP = process.env.REMOTION_TMP; }
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import path from "node:path";
const [id, shortDir, out, scaleArg = "4/3"] = process.argv.slice(2);
// exact fractions: 1920 x 4/3 = 2560 (1.3333 would give 2559.94 and Remotion needs integer sizes)
const scale = scaleArg.includes("/") ? Number(scaleArg.split("/")[0]) / Number(scaleArg.split("/")[1]) : Number(scaleArg);
const chromiumOptions = { gl: "angle" };
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id, chromiumOptions });
fs.mkdirSync(path.dirname(out), { recursive: true });
const pic = out.replace(/\.mp4$/, "_picture.mp4");
const t0 = Date.now(); let last = 0;
await renderMedia({ composition, serveUrl, codec: "h264", crf: 16, scale, outputLocation: pic, chromiumOptions, concurrency: 4,
  timeoutInMilliseconds: 240000, muted: true,
  onProgress: ({ progress }) => { const p = Math.floor(progress * 20); if (p > last) { last = p; console.log(`render ${(progress * 100).toFixed(0)} % (${((Date.now() - t0) / 1000).toFixed(0)} s)`); } } });
execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", pic, "-i", path.join(shortDir, "audio", "mix.wav"),
  "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", "-shortest", out]);
console.log("done", out, ((Date.now() - t0) / 1000).toFixed(0) + " s");
