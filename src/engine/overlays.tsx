// mrABSURDLY comic overlays (used sparingly): stamps (red X), words ("KNOCK"), numbers. A plain React layer above
// the 3D picture and below the captions; each item pops in (scale 0 -> 1.2 -> 1 over 7 f), holds, pops out (4 f).
// Placement in fractions of the frame; keep y < 0.68 so nothing collides with the caption band (~0.76).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Timeline } from "./timeline";
import { NUNITO } from "./fonts";

export type Overlay = {
  kind: "x" | "word" | "number"; text?: string;
  at: string; nth?: number; lead?: number; /** frames on screen */ dur: number;
  x: number; y: number; size?: number; rot?: number; color?: string;
};
type Placed = Overlay & { a: number };
export const placeOverlays = (tl: Timeline, list: Overlay[]): Placed[] => list.map((o) => ({ ...o, a: tl.at(o.at, o.nth ?? 0) - (o.lead ?? 1) }));

const pop = (k: number, dur: number) => {
  if (k < 0 || k >= dur) return 0;
  if (k < 4) return 1.2 * (k + 1) / 4;
  if (k < 7) return 1.2 - 0.2 * (k - 3) / 3;
  if (k >= dur - 4) return Math.max(0, (dur - k) / 4);
  return 1;
};

const Item: React.FC<{ o: Placed; k: number }> = ({ o, k }) => {
  const s = pop(k, o.dur);
  if (!s) return null;
  const size = o.size ?? 360, style: React.CSSProperties = {
    position: "absolute", left: `${o.x * 100}%`, top: `${o.y * 100}%`,
    transform: `translate(-50%, -50%) rotate(${o.rot ?? -8}deg) scale(${s})`, filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.45))",
  };
  if (o.kind === "x") {
    const w = size * 0.2;
    return (
      <svg style={style} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[[0.15, 0.15, 0.85, 0.85], [0.85, 0.15, 0.15, 0.85]].map(([a, b, c, d], i) => (
          <g key={i}>
            <line x1={a * size} y1={b * size} x2={c * size} y2={d * size} stroke="#1a1020" strokeWidth={w + 22} strokeLinecap="round" />
            <line x1={a * size} y1={b * size} x2={c * size} y2={d * size} stroke={o.color ?? "#e8352b"} strokeWidth={w} strokeLinecap="round" />
          </g>
        ))}
      </svg>
    );
  }
  return (
    <div style={{ ...style, fontFamily: NUNITO, fontWeight: 1000, fontSize: size, lineHeight: 1, whiteSpace: "nowrap",
      color: o.color ?? "#ffd23f", WebkitTextStroke: `${size * 0.09}px #1a1020`, paintOrder: "stroke fill", letterSpacing: "0.02em" }}>
      {o.text}
    </div>
  );
};

export const Overlays: React.FC<{ items: Placed[] }> = ({ items }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: "none" }}>{items.map((o, i) => <Item key={i} o={o} k={f - o.a} />)}</AbsoluteFill>;
};

/** whip blur + flash on top of the 3D layers (outside the post chain): an SVG horizontal blur and a white veil */
export const WhipBlurDefs: React.FC<{ px: number }> = ({ px }) => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <filter id="whipblur" x="-5%" y="0%" width="110%" height="100%"><feGaussianBlur stdDeviation={`${px} 0`} edgeMode="duplicate" /></filter>
  </svg>
);
export const Flash: React.FC<{ a: number }> = ({ a }) => (a > 0 ? <AbsoluteFill style={{ background: "#fffaf0", opacity: a }} /> : null);
