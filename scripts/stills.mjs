// usage: node scripts/stills.mjs <CompositionId> <outPrefix> <frame,frame,...> [scale] [inputPropsJson]
// Bundles once, renders JPEG stills with the GPU (ANGLE). Set REMOTION_TMP to a big folder (bundles are ~1 GB).
import fs from "node:fs";
if (process.env.REMOTION_TMP) { fs.mkdirSync(process.env.REMOTION_TMP, { recursive: true }); process.env.TEMP = process.env.TMP = process.env.REMOTION_TMP; }
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [id, prefix, frames, scale = "0.5", props = "{}"] = process.argv.slice(2);
const inputProps = JSON.parse(props);
const chromiumOptions = { gl: "angle" };
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id, inputProps, chromiumOptions });
const onBrowserLog = (l) => { if (l.type === "error" || l.type === "warning") console.log(`[${l.type}]`, l.text.slice(0, 300)); };
fs.mkdirSync(path.dirname(prefix), { recursive: true });
for (const f of frames.split(",").map(Number)) {
  const t0 = Date.now();
  await renderStill({ composition, serveUrl, frame: f, output: `${prefix}${f}.jpg`, imageFormat: "jpeg", jpegQuality: 88, scale: Number(scale),
    inputProps, chromiumOptions, timeoutInMilliseconds: 240000, onBrowserLog });
  console.log("still", f, ((Date.now() - t0) / 1000).toFixed(1) + "s");
}
