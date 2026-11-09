// THE HANDYMAN channel art (docs/HANDYMAN_BRAND.md "Kanal-Grafiken"): drawn from our OWN locked character
// (HANDYMAN / HANDYMAN_SEED from castbible.ts) with the engine's 2D figure drawing, no 3D, no outside material.
//   ChannelAvatar 800 x 800: head + raised hammer in a glowing hole, night blue (YouTube shows it as a circle).
//   ChannelBanner 2560 x 1440: dark wall with a glowing crack, the handyman, name + slogan. Everything important sits
//   inside YouTube's safe area for all devices (centre 1546 x 423).
import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";
import { Pen } from "../../engine/toon";
import { bodyHuman, HumanOpts } from "../../engine/human";
import { HANDYMAN, HANDYMAN_SEED, HANDYMAN_HUMAN } from "../../engine/castbible";
import { rng } from "../../engine/paint";
import { useNunito, NUNITO } from "../../engine/fonts";

/** brand colours (docs/HANDYMAN_BRAND.md) */
const C = { mustard: "#d99a2b", blue: "#3f5f96", brown: "#6b4a2a", night: "#2a2840", warm: "#ffd9a6", ink: "#241726" };

/** the handyman: design point (fx, fy) of the 600 x 1000 drawing placed at (x, y), scale k */
const handyman = (g: CanvasRenderingContext2D, o: HumanOpts, k: number, x: number, y: number, fx = 300, fy = 975) => {
  g.save(); g.setTransform(k, 0, 0, k, x - fx * k, y - fy * k);
  bodyHuman(new Pen(g), HANDYMAN, { ...HANDYMAN_HUMAN, seed: HANDYMAN_SEED, ...o });
  g.restore();
};
/** jagged hole outline around (cx, cy) */
const holePts = (cx: number, cy: number, rx: number, ry: number, seed: number) => {
  const r = rng(seed), pts: [number, number][] = [];
  for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2, j = 0.82 + 0.3 * r(); pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]); }
  return pts;
};
const poly = (g: CanvasRenderingContext2D, pts: [number, number][]) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
const useCanvas = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, ready: boolean) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => { if (ready && ref.current) draw(ref.current.getContext("2d")!); }, [ready, draw]);
  return <canvas ref={ref} width={w} height={h} style={{ width: w, height: h }} />;
};

// ---------------------------------------------------------------- the wall and the hole (version C)
/** mustard-ochre plaster: mottled, a few scratches and hairline cracks, darker towards the edges */
const plasterWall = (g: CanvasRenderingContext2D, w: number, h: number, seed: number) => {
  const base = g.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, "#e2b354"); base.addColorStop(0.5, "#d9a441"); base.addColorStop(1, "#c98f30");
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  const r = rng(seed), n = Math.round((w * h) / 900);
  for (let i = 0; i < n; i++) {
    const light = r() < 0.5;
    g.fillStyle = light ? `rgba(255,236,190,${0.04 + 0.06 * r()})` : `rgba(120,70,20,${0.03 + 0.05 * r()})`;
    g.beginPath(); g.ellipse(r() * w, r() * h, 4 + 30 * r(), 3 + 18 * r(), r() * 3, 0, 6.3); g.fill();
  }
  g.strokeStyle = "rgba(110,70,30,0.18)"; g.lineWidth = 1.5;
  for (let i = 0; i < n / 40; i++) { const x = r() * w, y = r() * h; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 60, y + (r() - 0.5) * 20); g.stroke(); }
  const vig = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
  vig.addColorStop(0, "rgba(60,30,10,0)"); vig.addColorStop(1, "rgba(60,30,10,0.45)");
  g.fillStyle = vig; g.fillRect(0, 0, w, h);
};
/** a broken-through hole: outer outline, the wall's thickness (lath + broken plaster), the inside drawn by `inside`
 *  (clipped to the opening); ink outline, hairline cracks and a few loose chips around it */
const brokenHole = (g: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, seed: number, inside: () => void, ink = 12) => {
  const outer = holePts(cx, cy, rx, ry, seed);
  const inner = outer.map(([x, y]): [number, number] => [cx + (x - cx) * 0.9 + rx * 0.03, cy + (y - cy) * 0.88 + ry * 0.05]);
  // soft shadow of the opening onto the wall
  g.save(); g.shadowColor = "rgba(40,20,5,0.55)"; g.shadowBlur = ink * 3; poly(g, outer); g.fillStyle = "#6b4a2a"; g.fill(); g.restore();
  // wall thickness: wooden lath and broken plaster (lit from above-left)
  const th = g.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
  th.addColorStop(0, "#8a5a32"); th.addColorStop(1, "#4a2f1c");
  poly(g, outer); g.fillStyle = th; g.fill();
  g.save(); poly(g, inner); g.clip(); inside(); g.restore();
  poly(g, inner); g.lineWidth = ink * 0.45; g.strokeStyle = "rgba(36,23,38,0.8)"; g.lineJoin = "round"; g.stroke();
  poly(g, outer); g.lineWidth = ink; g.strokeStyle = C.ink; g.stroke();
  // hairline cracks and loose chips
  const r = rng(seed + 99); g.strokeStyle = C.ink; g.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const p = outer[Math.floor(r() * outer.length)], a = Math.atan2(p[1] - cy, p[0] - cx) + (r() - 0.5) * 0.6;
    let x = p[0], y = p[1]; g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < 4; k++) { x += Math.cos(a + (r() - 0.5) * 0.8) * rx * 0.09; y += Math.sin(a + (r() - 0.5) * 0.8) * rx * 0.09; g.lineTo(x, y); }
    g.lineWidth = ink * 0.4; g.stroke();
  }
  for (let i = 0; i < 7; i++) {
    const p = outer[Math.floor(r() * outer.length)], a = Math.atan2(p[1] - cy, p[0] - cx), d = rx * (0.08 + 0.12 * r());
    const x = p[0] + Math.cos(a) * d, y = p[1] + Math.sin(a) * d * 0.8 + rx * 0.05, s2 = rx * (0.02 + 0.025 * r());
    poly(g, [[x - s2, y], [x, y - s2 * 0.8], [x + s2, y - s2 * 0.2], [x + s2 * 0.4, y + s2 * 0.7]]);
    g.fillStyle = "#e9c27a"; g.fill(); g.lineWidth = ink * 0.3; g.stroke();
  }
};
/** the mystery behind the wall: night blue, rows of dark little houses with warm windows, haze */
const nightCity = (g: CanvasRenderingContext2D, x0: number, y0: number, w: number, h: number, seed: number) => {
  const sky = g.createLinearGradient(0, y0, 0, y0 + h);
  sky.addColorStop(0, "#141a3d"); sky.addColorStop(0.6, "#26306a"); sky.addColorStop(1, "#3b3f7a");
  g.fillStyle = sky; g.fillRect(x0, y0, w, h);
  const r = rng(seed);
  for (let row = 0; row < 3; row++) {
    const base = y0 + h * (0.62 + row * 0.16), k = 0.55 + row * 0.3, shade = ["#2a2f5e", "#1f2450", "#171b3e"][row];
    let x = x0 - 20;
    while (x < x0 + w + 20) {
      const bw = (26 + 34 * r()) * k * (w / 500), bh = (40 + 70 * r()) * k * (h / 380);
      g.fillStyle = shade; g.fillRect(x, base - bh, bw, bh + h);
      if (r() < 0.6) { g.beginPath(); g.moveTo(x - 2, base - bh); g.lineTo(x + bw / 2, base - bh - bw * 0.45); g.lineTo(x + bw + 2, base - bh); g.closePath(); g.fill(); }
      const ws = Math.max(3, 5 * k * (w / 500));
      for (let wy = base - bh + ws * 1.6; wy < base - ws; wy += ws * 2.2) for (let wx = x + ws; wx < x + bw - ws; wx += ws * 2) {
        if (r() < 0.45) { g.fillStyle = r() < 0.8 ? "#ffd28a" : "#ffb35c"; g.fillRect(wx, wy, ws, ws * 1.2); }
      }
      x += bw + 2;
    }
    const haze = g.createLinearGradient(0, base - h * 0.2, 0, base + 10);
    haze.addColorStop(0, "rgba(90,100,170,0)"); haze.addColorStop(1, "rgba(90,100,170,0.25)");
    g.fillStyle = haze; g.fillRect(x0, base - h * 0.2, w, h * 0.2 + 10);
  }
  const glow = g.createRadialGradient(x0 + w / 2, y0 + h * 0.8, 10, x0 + w / 2, y0 + h * 0.8, w * 0.6);
  glow.addColorStop(0, "rgba(255,200,120,0.22)"); glow.addColorStop(1, "rgba(255,200,120,0)");
  g.fillStyle = glow; g.fillRect(x0, y0, w, h);
};

// ---------------------------------------------------------------- avatar: his face peeking through the hole at us
const drawAvatar = (g: CanvasRenderingContext2D) => {
  const W = 800;
  plasterWall(g, W, W, 11);
  brokenHole(g, 400, 410, 300, 290, 5, () => {
    // his side: warm lamp light from behind him
    const room = g.createRadialGradient(400, 300, 30, 400, 420, 380);
    room.addColorStop(0, "#fff1d6"); room.addColorStop(0.6, "#f2c27a"); room.addColorStop(1, "#b9803f");
    g.fillStyle = room; g.fillRect(0, 0, W, W);
    handyman(g, { gesture: "idle", expr: "surprised", brows: 3, look: 0, lean: 4, blink: false, t: 0.6 }, 1.5, 400, 430, 300, 250);
  }, 14);
};

// ---------------------------------------------------------------- banner: the hole with the night city, the handyman beside it
const drawBanner = (g: CanvasRenderingContext2D) => {
  const W = 2560, H = 1440;
  plasterWall(g, W, H, 23);
  const cx = 960, cy = 715, rx = 250, ry = 185;
  brokenHole(g, cx, cy, rx, ry, 9, () => nightCity(g, cx - rx, cy - ry, rx * 2, ry * 2, 17), 12);
  // a little warm light falls out of the hole onto the wall
  const spill = g.createRadialGradient(cx, cy + ry * 0.4, 20, cx, cy + ry, rx * 1.6);
  spill.addColorStop(0, "rgba(255,210,140,0.18)"); spill.addColorStop(1, "rgba(255,210,140,0)");
  g.fillStyle = spill; g.fillRect(0, 0, W, H);
  // the handyman, curious, leaning toward the hole, hammer in hand (inside the safe area: y 508..931)
  handyman(g, { gesture: "idle", expr: "surprised", brows: 4, look: 0.7, lean: 7, facing: 1, blink: false, t: 0.6 }, 0.43, 610, 925);
  // name + slogan on the wall, right of the hole, inside the safe area (x <= 2010)
  const x0 = 1270, maxW = 2010 - x0;
  g.textAlign = "left"; g.textBaseline = "alphabetic"; g.lineJoin = "round";
  g.font = `900 100px ${NUNITO}`;
  const size = Math.min(130, Math.floor((100 * maxW) / g.measureText("HANDYMAN").width)), yT = 700; // keeps "THE" below y 508
  g.save(); g.shadowColor = "rgba(60,30,10,0.45)"; g.shadowBlur = 18; g.shadowOffsetY = 8;
  g.font = `900 ${Math.round(size * 0.55)}px ${NUNITO}`; g.lineWidth = Math.round(size * 0.1); g.strokeStyle = C.ink;
  g.strokeText("THE", x0 + 4, yT - size * 0.9); g.fillStyle = "#fff8ec"; g.fillText("THE", x0 + 4, yT - size * 0.9);
  g.font = `900 ${size}px ${NUNITO}`; g.lineWidth = Math.round(size * 0.14);
  g.strokeText("HANDYMAN", x0, yT); g.fillStyle = "#fff8ec"; g.fillText("HANDYMAN", x0, yT);
  g.restore();
  g.fillStyle = C.ink; g.fillRect(x0 + 4, yT + 32, maxW * 0.18, 6);
  g.font = `800 ${Math.round(size * 0.36)}px ${NUNITO}`; g.fillStyle = "#3a2418";
  (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "2px";
  g.fillText("Every job hides a mystery.", x0 + 4, yT + 32 + size * 0.55);
};

export const ChannelAvatar: React.FC = () => {
  const font = useNunito();
  return <AbsoluteFill style={{ background: C.night }}>{useCanvas(800, 800, drawAvatar, font)}</AbsoluteFill>;
};
export const ChannelBanner: React.FC = () => {
  const font = useNunito();
  return <AbsoluteFill style={{ background: C.night }}>{useCanvas(2560, 1440, drawBanner, font)}</AbsoluteFill>;
};
