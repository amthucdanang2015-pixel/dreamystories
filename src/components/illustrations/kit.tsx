// ============================================================
// StoryMoon illustration kit
//
// Shared vector primitives for the story scenes. One brand style:
// flat gouache-like shapes, no outlines, soft glows, rounded forms
// and a common paper-grain finish. Each story composes these with
// its own palette, setting and motifs (see ./scenes/*), so stories
// look unmistakably different while still feeling like one library.
//
// Scenes draw on a fixed canvas (pages 360×240, covers 360×360)
// and are scaled with preserveAspectRatio="xMidYMid slice", so keep
// focal content inside the central ~240×200 area.
// ============================================================

import React from 'react';
import {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import type { StoryPalette } from '../../types/story';

export const PAGE_W = 360;
export const PAGE_H = 240;
export const COVER_W = 360;
export const COVER_H = 360;

export interface SceneCtx {
  /** Canvas width / height in scene units */
  W: number;
  H: number;
  /** Unique prefix for gradient ids (ids are document-global on web). */
  uid: string;
  p: StoryPalette;
}

export type Scene = (c: SceneCtx) => React.ReactElement;

export interface StoryScenes {
  cover: Scene;
  pages: Scene[];
}

export const gid = (c: SceneCtx, name: string) => `${c.uid}-${name}`;
export const gurl = (c: SceneCtx, name: string) => `url(#${gid(c, name)})`;

/** Deterministic PRNG so every render of a scene is identical. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pt = [number, number];

/** Smooth open curve through points, closed down to the bottom of the canvas. */
export function smoothFill(points: Pt[], bottom: number): string {
  if (points.length < 2) return '';
  let d = `M${points[0][0]},${bottom} L${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    d += ` Q${x},${y} ${(x + nx) / 2},${(y + ny) / 2}`;
  }
  const last = points[points.length - 1];
  d += ` L${last[0]},${last[1]} L${last[0]},${bottom} Z`;
  return d;
}

// ─── Sky & light ──────────────────────────────────────────────

export function Sky({
  c,
  top,
  bottom,
  name = 'sky',
  mid,
}: {
  c: SceneCtx;
  top: string;
  bottom: string;
  mid?: string;
  name?: string;
}) {
  return (
    <G>
      <Defs>
        {mid ? (
          <LinearGradient id={gid(c, name)} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={top} />
            <Stop offset="0.55" stopColor={mid} />
            <Stop offset="1" stopColor={bottom} />
          </LinearGradient>
        ) : (
          <LinearGradient id={gid(c, name)} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={top} />
            <Stop offset="1" stopColor={bottom} />
          </LinearGradient>
        )}
      </Defs>
      <Rect x={0} y={0} width={c.W} height={c.H} fill={gurl(c, name)} />
    </G>
  );
}

export function Glow({
  c,
  name,
  cx,
  cy,
  r,
  color,
  opacity = 0.6,
}: {
  c: SceneCtx;
  name: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
  opacity?: number;
}) {
  return (
    <G>
      <Defs>
        <RadialGradient id={gid(c, name)} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={color} stopOpacity={opacity} />
          <Stop offset="0.45" stopColor={color} stopOpacity={opacity * 0.35} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={cx} cy={cy} r={r} fill={gurl(c, name)} />
    </G>
  );
}

export function Stars({
  c,
  count = 30,
  seed = 1,
  color = '#FFFFFF',
  maxY,
  opacity = 0.85,
}: {
  c: SceneCtx;
  count?: number;
  seed?: number;
  color?: string;
  maxY?: number;
  opacity?: number;
}) {
  const r = rng(seed);
  const limit = maxY ?? c.H * 0.55;
  const stars = Array.from({ length: count }, () => ({
    x: r() * c.W,
    y: r() * limit,
    s: r(),
  }));
  return (
    <G opacity={opacity}>
      {stars.map((s, i) =>
        s.s > 0.9 ? (
          <Path
            key={i}
            d={`M${s.x},${s.y - 3} Q${s.x},${s.y} ${s.x + 3},${s.y} Q${s.x},${s.y} ${s.x},${s.y + 3} Q${s.x},${s.y} ${s.x - 3},${s.y} Q${s.x},${s.y} ${s.x},${s.y - 3} Z`}
            fill={color}
          />
        ) : (
          <Circle key={i} cx={s.x} cy={s.y} r={0.5 + s.s * 0.9} fill={color} opacity={0.4 + s.s * 0.6} />
        )
      )}
    </G>
  );
}

export function MoonDisc({
  cx,
  cy,
  r,
  color,
  shade,
}: {
  cx: number;
  cy: number;
  r: number;
  color: string;
  shade?: string;
}) {
  const sh = shade ?? 'rgba(120,130,170,0.18)';
  return (
    <G>
      <Circle cx={cx} cy={cy} r={r} fill={color} />
      <Circle cx={cx - r * 0.3} cy={cy - r * 0.15} r={r * 0.16} fill={sh} />
      <Circle cx={cx + r * 0.25} cy={cy + r * 0.3} r={r * 0.11} fill={sh} />
      <Circle cx={cx + r * 0.35} cy={cy - r * 0.35} r={r * 0.07} fill={sh} />
    </G>
  );
}

export function Sun({
  cx,
  cy,
  r,
  color,
  rays,
}: {
  cx: number;
  cy: number;
  r: number;
  color: string;
  rays?: string;
}) {
  return (
    <G>
      {rays
        ? Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <Path
                key={i}
                d={`M${cx + Math.cos(a) * (r + 4)},${cy + Math.sin(a) * (r + 4)} L${cx + Math.cos(a) * (r + 12)},${cy + Math.sin(a) * (r + 12)}`}
                stroke={rays}
                strokeWidth={2.4}
                strokeLinecap="round"
              />
            );
          })
        : null}
      <Circle cx={cx} cy={cy} r={r} fill={color} />
    </G>
  );
}

/** Soft puffy cloud. (x, y) = centre of its flat base. */
export function Cloud({
  x,
  y,
  s = 1,
  color,
  opacity = 1,
}: {
  x: number;
  y: number;
  s?: number;
  color: string;
  opacity?: number;
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <Ellipse cx={-14} cy={-6} rx={14} ry={9} fill={color} />
      <Ellipse cx={2} cy={-12} rx={15} ry={13} fill={color} />
      <Ellipse cx={18} cy={-7} rx={12} ry={8} fill={color} />
      <Rect x={-26} y={-7} width={54} height={7} rx={3.5} fill={color} />
    </G>
  );
}

/** Vietnamese ribbon cloud (mây cuộn): a long band ending in spiral curls. */
export function RibbonCloud({
  x,
  y,
  s = 1,
  color,
  opacity = 1,
  flip = false,
}: {
  x: number;
  y: number;
  s?: number;
  color: string;
  opacity?: number;
  flip?: boolean;
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} opacity={opacity}>
      <Rect x={-30} y={-5} width={52} height={10} rx={5} fill={color} />
      <Path
        d="M22,0 C30,-1 32,-9 26,-12 C21,-14 17,-9 21,-6"
        stroke={color}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M-30,0 C-38,2 -38,11 -31,12 C-26,13 -24,8 -28,6"
        stroke={color}
        strokeWidth={3.4}
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
}

// ─── Land & water ─────────────────────────────────────────────

/** Rolling silhouette across the full canvas width, filled to the bottom. */
export function Ridge({
  c,
  y,
  amp = 16,
  seed = 3,
  color,
  segments = 6,
  opacity = 1,
}: {
  c: SceneCtx;
  y: number;
  amp?: number;
  seed?: number;
  color: string;
  segments?: number;
  opacity?: number;
}) {
  const r = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i <= segments; i++) {
    pts.push([-20 + ((c.W + 40) * i) / segments, y - amp * r()]);
  }
  return <Path d={smoothFill(pts, c.H + 2)} fill={color} opacity={opacity} />;
}

/** Pointed mountains. peaks: [centreX, height, halfWidth]. */
export function Peaks({
  base,
  peaks,
  color,
  snow,
  opacity = 1,
}: {
  base: number;
  peaks: Array<[number, number, number]>;
  color: string;
  snow?: string;
  opacity?: number;
}) {
  return (
    <G opacity={opacity}>
      {peaks.map(([x, h, w], i) => (
        <G key={i}>
          <Path
            d={`M${x - w},${base} Q${x - w * 0.35},${base - h * 0.55} ${x - 3},${base - h + 2} Q${x},${base - h - 2} ${x + 3},${base - h + 2} Q${x + w * 0.4},${base - h * 0.5} ${x + w},${base} Z`}
            fill={color}
          />
          {snow ? (
            <Path
              d={`M${x - w * 0.18},${base - h * 0.78} Q${x},${base - h - 1} ${x + w * 0.2},${base - h * 0.76} Q${x + w * 0.05},${base - h * 0.7} ${x},${base - h * 0.74} Q${x - w * 0.06},${base - h * 0.7} ${x - w * 0.18},${base - h * 0.78} Z`}
              fill={snow}
            />
          ) : null}
        </G>
      ))}
    </G>
  );
}

/** Still water from y to the bottom with gentle shimmer lines. */
export function Water({
  c,
  y,
  top,
  bottom,
  shimmer,
  name = 'water',
  seed = 5,
}: {
  c: SceneCtx;
  y: number;
  top: string;
  bottom: string;
  shimmer?: string;
  name?: string;
  seed?: number;
}) {
  const r = rng(seed);
  return (
    <G>
      <Defs>
        <LinearGradient id={gid(c, name)} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={top} />
          <Stop offset="1" stopColor={bottom} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={y} width={c.W} height={c.H - y + 2} fill={gurl(c, name)} />
      {shimmer
        ? Array.from({ length: 9 }, (_, i) => {
            const yy = y + 6 + r() * (c.H - y - 10);
            const xx = r() * c.W;
            const len = 10 + r() * 26;
            return (
              <Rect
                key={i}
                x={xx}
                y={yy}
                width={len}
                height={1.6}
                rx={0.8}
                fill={shimmer}
                opacity={0.35 + r() * 0.4}
              />
            );
          })
        : null}
    </G>
  );
}

/** A band of waves (rounded crests) filled to the bottom. */
export function WaveBand({
  c,
  y,
  amp = 6,
  len = 40,
  color,
  phase = 0,
  opacity = 1,
}: {
  c: SceneCtx;
  y: number;
  amp?: number;
  len?: number;
  color: string;
  phase?: number;
  opacity?: number;
}) {
  let d = `M${-len + phase},${c.H + 2} L${-len + phase},${y}`;
  for (let x = -len + phase; x < c.W + len; x += len) {
    d += ` Q${x + len / 4},${y - amp} ${x + len / 2},${y} Q${x + (3 * len) / 4},${y + amp * 0.6} ${x + len},${y}`;
  }
  d += ` L${c.W + len},${c.H + 2} Z`;
  return <Path d={d} fill={color} opacity={opacity} />;
}

/** Stylised curling wave crest (Thủy Tinh). (x, y) = base of the curl. */
export function Crest({
  x,
  y,
  s = 1,
  color,
  foam,
  flip = false,
}: {
  x: number;
  y: number;
  s?: number;
  color: string;
  foam: string;
  flip?: boolean;
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path
        d="M-34,0 C-30,-26 -6,-44 16,-38 C30,-34 34,-20 26,-12 C20,-6 10,-10 12,-18 C14,-24 6,-26 0,-22 C-10,-14 -12,-4 -8,0 Z"
        fill={color}
      />
      <Path
        d="M16,-38 C30,-34 34,-20 26,-12 C20,-6 10,-10 12,-18"
        stroke={foam}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx={30} cy={-36} r={2.2} fill={foam} />
      <Circle cx={36} cy={-30} r={1.6} fill={foam} />
    </G>
  );
}

export function Grass({
  c,
  y,
  seed = 7,
  color,
  count = 14,
  height = 8,
}: {
  c: SceneCtx;
  y: number;
  seed?: number;
  color: string;
  count?: number;
  height?: number;
}) {
  const r = rng(seed);
  return (
    <G>
      {Array.from({ length: count }, (_, i) => {
        const x = r() * c.W;
        const yy = y + r() * (c.H - y) * 0.8;
        const h = height * (0.6 + r() * 0.6);
        return (
          <Path
            key={i}
            d={`M${x - 3},${yy} Q${x - 2},${yy - h * 0.6} ${x - 4},${yy - h} M${x},${yy} Q${x + 0.5},${yy - h * 0.8} ${x + 1},${yy - h * 1.2} M${x + 3},${yy} Q${x + 3},${yy - h * 0.6} ${x + 5},${yy - h * 0.9}`}
            stroke={color}
            strokeWidth={1.4}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
    </G>
  );
}

/** Paddy field rows receding toward the horizon. */
export function Paddies({
  c,
  y,
  color,
  line,
  rows = 5,
}: {
  c: SceneCtx;
  y: number;
  color: string;
  line: string;
  rows?: number;
}) {
  return (
    <G>
      <Rect x={0} y={y} width={c.W} height={c.H - y + 2} fill={color} />
      {Array.from({ length: rows }, (_, i) => {
        const t = (i + 1) / (rows + 1);
        const yy = y + (c.H - y) * t * t * 1.1;
        return (
          <Path
            key={i}
            d={`M0,${yy} Q${c.W * 0.5},${yy - 4 - i} ${c.W},${yy + 2}`}
            stroke={line}
            strokeWidth={1 + i * 0.5}
            fill="none"
            opacity={0.55}
          />
        );
      })}
    </G>
  );
}

// ─── Plants ───────────────────────────────────────────────────

/** Banyan: broad crown, sturdy trunk, curtains of aerial roots. (x, y) = trunk base. */
export function Banyan({
  x,
  y,
  s = 1,
  trunk,
  leaf,
  leafLight,
  root,
}: {
  x: number;
  y: number;
  s?: number;
  trunk: string;
  leaf: string;
  leafLight: string;
  root?: string;
}) {
  const rc = root ?? trunk;
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-9,0 C-7,-20 -10,-40 -4,-58 L6,-58 C10,-40 8,-20 11,0 Z" fill={trunk} />
      <Path d="M-4,-44 C-16,-52 -30,-54 -40,-62" stroke={trunk} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Path d="M6,-46 C18,-54 32,-56 42,-64" stroke={trunk} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Ellipse cx={-30} cy={-70} rx={30} ry={18} fill={leaf} />
      <Ellipse cx={30} cy={-72} rx={32} ry={19} fill={leaf} />
      <Ellipse cx={0} cy={-84} rx={36} ry={22} fill={leaf} />
      <Ellipse cx={-12} cy={-92} rx={20} ry={11} fill={leafLight} />
      <Ellipse cx={22} cy={-82} rx={16} ry={8} fill={leafLight} />
      <Ellipse cx={-36} cy={-74} rx={12} ry={6} fill={leafLight} />
      {[-48, -40, -30, -22, 22, 30, 38, 48].map((rx, i) => (
        <Path
          key={i}
          d={`M${rx},${-60 + (i % 3) * 3} Q${rx + (i % 2 ? 2 : -2)},${-40} ${rx + (i % 2 ? -1 : 1)},${-18 - (i % 4) * 6}`}
          stroke={rc}
          strokeWidth={1.4}
          fill="none"
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}
    </G>
  );
}

/** Cluster of bamboo stalks with leaf sprays. (x, y) = base. */
export function Bamboo({
  x,
  y,
  h = 90,
  color,
  leaf,
  stalks = 3,
  seed = 11,
}: {
  x: number;
  y: number;
  h?: number;
  color: string;
  leaf: string;
  stalks?: number;
  seed?: number;
}) {
  const r = rng(seed);
  return (
    <G>
      {Array.from({ length: stalks }, (_, i) => {
        const sx = x + (i - (stalks - 1) / 2) * 8;
        const sh = h * (0.75 + r() * 0.3);
        const lean = (r() - 0.5) * 14;
        const nodes = Math.floor(sh / 14);
        return (
          <G key={i}>
            <Path
              d={`M${sx},${y} Q${sx + lean * 0.3},${y - sh * 0.5} ${sx + lean},${y - sh}`}
              stroke={color}
              strokeWidth={3.2}
              fill="none"
              strokeLinecap="round"
            />
            {Array.from({ length: nodes }, (_, n) => {
              const t = (n + 1) / (nodes + 1);
              const nx = sx + lean * t * t;
              const ny = y - sh * t;
              return <Rect key={n} x={nx - 2.4} y={ny - 0.6} width={4.8} height={1.4} fill={leaf} opacity={0.6} />;
            })}
            {[0.55, 0.75, 0.95].map((t, k) => {
              const lx = sx + lean * t * t;
              const ly = y - sh * t;
              const dir = (i + k) % 2 ? 1 : -1;
              return (
                <G key={k}>
                  <Path d={`M${lx},${ly} q${dir * 8},${-2} ${dir * 16},${4} q${-dir * 8},${-1} ${-dir * 16},${-4} Z`} fill={leaf} />
                  <Path d={`M${lx},${ly} q${dir * 6},${-6} ${dir * 13},${-6} q${-dir * 6},${3} ${-dir * 13},${6} Z`} fill={leaf} />
                </G>
              );
            })}
          </G>
        );
      })}
    </G>
  );
}

/** Areca or coconut palm. (x, y) = base. */
export function Palm({
  x,
  y,
  s = 1,
  trunk,
  leaf,
  kind = 'areca',
  lean = 0,
}: {
  x: number;
  y: number;
  s?: number;
  trunk: string;
  leaf: string;
  kind?: 'areca' | 'coconut';
  lean?: number;
}) {
  const topX = lean;
  const topY = kind === 'areca' ? -86 : -70;
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path
        d={`M-2,0 Q${topX * 0.4 - 1},${topY * 0.5} ${topX - 1},${topY} L${topX + 1.5},${topY} Q${topX * 0.4 + 2},${topY * 0.5} 2.5,0 Z`}
        fill={trunk}
      />
      {[-150, -120, -60, -30, -95, 200, -10].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const len = kind === 'areca' ? 22 : 30;
        const ex = topX + Math.cos(a) * len;
        const ey = topY + Math.sin(a) * len * 0.7 + (kind === 'coconut' ? 10 : 4);
        return (
          <Path
            key={i}
            d={`M${topX},${topY} Q${(topX + ex) / 2},${Math.min(topY, ey) - 8} ${ex},${ey} Q${(topX + ex) / 2},${Math.min(topY, ey) - 2} ${topX},${topY} Z`}
            fill={leaf}
          />
        );
      })}
      {kind === 'coconut' ? (
        <G>
          <Circle cx={topX - 3} cy={topY + 4} r={3} fill={trunk} />
          <Circle cx={topX + 3} cy={topY + 5} r={3} fill={trunk} />
        </G>
      ) : null}
    </G>
  );
}

export function Lotus({
  x,
  y,
  s = 1,
  color,
  leaf,
  bloom = true,
}: {
  x: number;
  y: number;
  s?: number;
  color: string;
  leaf: string;
  bloom?: boolean;
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={-10} cy={2} rx={14} ry={4} fill={leaf} />
      {bloom ? (
        <G>
          <Path d="M0,0 C-10,-4 -12,-14 -8,-18 C-4,-12 -2,-6 0,0 Z" fill={color} />
          <Path d="M0,0 C10,-4 12,-14 8,-18 C4,-12 2,-6 0,0 Z" fill={color} />
          <Path d="M0,0 C-5,-8 -4,-18 0,-22 C4,-18 5,-8 0,0 Z" fill={color} />
          <Path d="M0,-2 C-2,-8 -1,-14 0,-16 C1,-14 2,-8 0,-2 Z" fill="#FFFFFF" opacity={0.35} />
        </G>
      ) : (
        <Path d="M0,0 C-4,-6 -3,-14 0,-17 C3,-14 4,-6 0,0 Z" fill={color} />
      )}
    </G>
  );
}

// ─── Buildings & objects ──────────────────────────────────────

/** Thatched village cottage. (x, y) = centre of the ground line. */
export function Hut({
  x,
  y,
  s = 1,
  wall,
  roof,
  door,
  lit,
}: {
  x: number;
  y: number;
  s?: number;
  wall: string;
  roof: string;
  door: string;
  /** Colour of a lamp-lit doorway */
  lit?: string;
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-26} y={-26} width={52} height={26} fill={wall} />
      <Path d="M-36,-22 Q-20,-52 0,-54 Q20,-52 36,-22 Q0,-28 -36,-22 Z" fill={roof} />
      <Path d="M-30,-30 Q0,-36 30,-30" stroke={door} strokeWidth={1} opacity={0.3} fill="none" />
      <Rect x={-6} y={-18} width={12} height={18} rx={1.5} fill={lit ?? door} />
      <Rect x={12} y={-18} width={9} height={7} rx={1} fill={lit ?? door} opacity={0.85} />
    </G>
  );
}

/** Hùng-era stilt house with saddle roof. (x, y) = ground centre. */
export function StiltHouse({
  x,
  y,
  s = 1,
  wood,
  roof,
  dark,
}: {
  x: number;
  y: number;
  s?: number;
  wood: string;
  roof: string;
  dark: string;
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {[-24, -8, 8, 24].map((px) => (
        <Rect key={px} x={px - 1.5} y={-16} width={3} height={16} fill={dark} />
      ))}
      <Rect x={-30} y={-34} width={60} height={18} fill={wood} />
      <Path d="M-44,-30 Q-36,-40 -34,-56 Q0,-48 34,-56 Q36,-40 44,-30 Q0,-36 -44,-30 Z" fill={roof} />
      <Rect x={-4} y={-30} width={8} height={14} fill={dark} opacity={0.7} />
    </G>
  );
}

/** Vietnamese pavilion / palace with upturned eaves. (x, y) = ground centre. */
export function Pavilion({
  x,
  y,
  s = 1,
  roof,
  pillar,
  wall,
  trim,
}: {
  x: number;
  y: number;
  s?: number;
  roof: string;
  pillar: string;
  wall: string;
  trim?: string;
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-40} y={-4} width={80} height={4} fill={trim ?? pillar} />
      <Rect x={-32} y={-30} width={64} height={26} fill={wall} />
      {[-28, -10, 10, 28].map((px) => (
        <Rect key={px} x={px - 2} y={-30} width={4} height={26} fill={pillar} />
      ))}
      <Path d="M-48,-30 Q-50,-38 -54,-40 Q-30,-36 -28,-46 L28,-46 Q30,-36 54,-40 Q50,-38 48,-30 Z" fill={roof} />
      <Path d="M-36,-46 Q-38,-52 -42,-54 Q-20,-52 -18,-62 L18,-62 Q20,-52 42,-54 Q38,-52 36,-46 Z" fill={roof} />
      <Rect x={-20} y={-66} width={40} height={4} rx={2} fill={trim ?? roof} />
    </G>
  );
}

export function Lantern({
  x,
  y,
  s = 1,
  color,
  glow,
  kind = 'round',
}: {
  x: number;
  y: number;
  s?: number;
  color: string;
  glow?: string;
  kind?: 'round' | 'star' | 'carp';
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {glow ? <Circle cx={0} cy={0} r={13} fill={glow} opacity={0.25} /> : null}
      {kind === 'star' ? (
        <Path
          d="M0,-9 L2.6,-3 L9,-2.8 L4,1.4 L5.6,8 L0,4.4 L-5.6,8 L-4,1.4 L-9,-2.8 L-2.6,-3 Z"
          fill={color}
        />
      ) : kind === 'carp' ? (
        <G>
          <Ellipse cx={0} cy={0} rx={9} ry={5} fill={color} />
          <Path d="M8,0 L14,-5 L13,0 L14,5 Z" fill={color} />
          <Circle cx={-5} cy={-1} r={1} fill="#2A1A10" />
        </G>
      ) : (
        <G>
          <Ellipse cx={0} cy={0} rx={6} ry={7.5} fill={color} />
          <Rect x={-3} y={-9.5} width={6} height={2} fill="#3A2416" />
          <Rect x={-3} y={7.5} width={6} height={2} fill="#3A2416" />
        </G>
      )}
    </G>
  );
}

export function Boat({
  x,
  y,
  s = 1,
  hull,
  sail,
  dragon,
}: {
  x: number;
  y: number;
  s?: number;
  hull: string;
  sail?: string;
  /** Colour of a dragon-head prow */
  dragon?: string;
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-30,-6 Q-26,4 -12,5 L14,5 Q28,4 32,-6 Z" fill={hull} />
      {sail ? (
        <G>
          <Rect x={-1} y={-40} width={2} height={34} fill={hull} />
          <Path d="M1,-38 Q18,-26 16,-8 L1,-8 Z" fill={sail} />
        </G>
      ) : null}
      {dragon ? (
        <Path d="M30,-6 Q36,-14 34,-20 Q40,-18 40,-12 Q38,-8 32,-4 Z" fill={dragon} />
      ) : null}
    </G>
  );
}

// ─── Characters ───────────────────────────────────────────────

export type HairStyle = 'short' | 'bun' | 'topknot' | 'braid' | 'long' | 'bob' | 'none';
export type HatStyle = 'none' | 'nonla' | 'crown' | 'khan' | 'helmet';
export type Pose = 'down' | 'up' | 'out' | 'hold' | 'wave';

/**
 * Storybook figure. (x, y) = between the feet; s = 1 is an adult (~58 units tall).
 * Use s ≈ 0.7 for a child. `dress` gives a long áo tứ thân / robe silhouette.
 */
export function Figure({
  x,
  y,
  s = 1,
  skin = '#E8B98F',
  top,
  bottom,
  hair = '#1E1712',
  hairStyle = 'short',
  hat = 'none',
  hatColor,
  pose = 'down',
  flip = false,
  dress = false,
  beard,
  sitting = false,
}: {
  x: number;
  y: number;
  s?: number;
  skin?: string;
  top: string;
  bottom?: string;
  hair?: string;
  hairStyle?: HairStyle;
  hat?: HatStyle;
  hatColor?: string;
  pose?: Pose;
  flip?: boolean;
  dress?: boolean;
  beard?: string;
  sitting?: boolean;
}) {
  const legs = bottom ?? top;
  const lift = sitting ? 12 : 0;
  const arm = (side: -1 | 1) => {
    const sx = side * 8;
    const sy = -38 + lift;
    let ex = side * 11;
    let ey = -20 + lift;
    if (pose === 'up') {
      ex = side * 14;
      ey = -58 + lift;
    } else if (pose === 'out') {
      ex = side * 20;
      ey = -34 + lift;
    } else if (pose === 'hold') {
      ex = side * 4 + 6;
      ey = -28 + lift;
    } else if (pose === 'wave' && side === 1) {
      ex = 16;
      ey = -54 + lift;
    }
    return (
      <G key={side}>
        <Path
          d={`M${sx},${sy} Q${(sx + ex) / 2 + side * 3},${(sy + ey) / 2} ${ex},${ey}`}
          stroke={top}
          strokeWidth={4.6}
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={ex} cy={ey} r={2.4} fill={skin} />
      </G>
    );
  };
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {sitting ? (
        <G>
          <Path d="M-7,-14 L12,-14 L13,-8 L-7,-8 Z" fill={legs} />
          <Rect x={8} y={-10} width={5} height={10} rx={2} fill={legs} />
        </G>
      ) : dress ? (
        <Path d="M-8,-20 L8,-20 L12,0 L-12,0 Z" fill={legs} />
      ) : (
        <G>
          <Rect x={-6.5} y={-20} width={5.5} height={20} rx={2.5} fill={legs} />
          <Rect x={1} y={-20} width={5.5} height={20} rx={2.5} fill={legs} />
        </G>
      )}
      <Path
        d={dress ? `M-8,${-40 + lift} L8,${-40 + lift} L11,${-6 + lift} L-11,${-6 + lift} Z` : `M-8,${-40 + lift} L8,${-40 + lift} L10,${-17 + lift} L-10,${-17 + lift} Z`}
        fill={top}
      />
      {arm(-1)}
      {arm(1)}
      <Rect x={-2.2} y={-44 + lift} width={4.4} height={5} fill={skin} />
      <Circle cx={0} cy={-50 + lift} r={8} fill={skin} />
      {/* hair */}
      {hairStyle !== 'none' ? (
        <Path d={`M-8.2,${-50 + lift} Q-8,${-60 + lift} 0,${-59 + lift} Q8,${-60 + lift} 8.2,${-50 + lift} Q4,${-55 + lift} -8.2,${-50 + lift} Z`} fill={hair} />
      ) : null}
      {hairStyle === 'bun' ? <Circle cx={-7} cy={-55 + lift} r={4} fill={hair} /> : null}
      {hairStyle === 'topknot' ? <Circle cx={0} cy={-60 + lift} r={3.4} fill={hair} /> : null}
      {hairStyle === 'braid' ? (
        <Path d={`M-6,${-52 + lift} Q-11,${-40 + lift} -9,${-24 + lift}`} stroke={hair} strokeWidth={3.4} strokeLinecap="round" fill="none" />
      ) : null}
      {hairStyle === 'long' ? <Path d={`M-8,${-52 + lift} Q-10,${-40 + lift} -7,${-34 + lift} L-3,${-36 + lift} Z`} fill={hair} /> : null}
      {hairStyle === 'bob' ? <Path d={`M-8.6,${-52 + lift} L-8.6,${-45 + lift} L-5,${-46 + lift} Z M8.6,${-52 + lift} L8.6,${-45 + lift} L5,${-46 + lift} Z`} fill={hair} /> : null}
      {/* face */}
      <Circle cx={3} cy={-51 + lift} r={0.95} fill="#2A1A10" />
      <Circle cx={-2} cy={-51 + lift} r={0.95} fill="#2A1A10" />
      <Circle cx={4.5} cy={-47.5 + lift} r={1.4} fill="#E58C7A" opacity={0.45} />
      {beard ? <Path d={`M-4,${-46 + lift} Q1,${-30 + lift} 6,${-46 + lift} Q1,${-43 + lift} -4,${-46 + lift} Z`} fill={beard} /> : null}
      {/* hats */}
      {hat === 'nonla' ? <Path d={`M-15,${-55 + lift} L0,${-70 + lift} L15,${-55 + lift} Q0,${-52 + lift} -15,${-55 + lift} Z`} fill={hatColor ?? '#E9D9A6'} /> : null}
      {hat === 'crown' ? (
        <Path d={`M-6,${-57 + lift} L-6,${-64 + lift} L-3,${-61 + lift} L0,${-66 + lift} L3,${-61 + lift} L6,${-64 + lift} L6,${-57 + lift} Z`} fill={hatColor ?? '#E2B64B'} />
      ) : null}
      {hat === 'khan' ? <Rect x={-8.6} y={-60 + lift} width={17.2} height={5.5} rx={2.7} fill={hatColor ?? '#3A2A2A'} /> : null}
      {hat === 'helmet' ? <Path d={`M-9,${-52 + lift} Q-9,${-64 + lift} 0,${-64 + lift} Q9,${-64 + lift} 9,${-52 + lift} Z M0,${-64 + lift} L0,${-70 + lift}`} fill={hatColor ?? '#8A8F96'} stroke={hatColor ?? '#8A8F96'} strokeWidth={1.6} /> : null}
    </G>
  );
}

export function Bird({
  x,
  y,
  s = 1,
  color,
  wing = 'up',
}: {
  x: number;
  y: number;
  s?: number;
  color: string;
  wing?: 'up' | 'down';
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {wing === 'up' ? (
        <Path d="M-8,0 Q-4,-6 0,0 Q4,-6 8,0 Q4,-3 0,1 Q-4,-3 -8,0 Z" fill={color} />
      ) : (
        <Path d="M-8,-2 Q-4,3 0,0 Q4,3 8,-2 Q4,1 0,2 Q-4,1 -8,-2 Z" fill={color} />
      )}
    </G>
  );
}

// ─── Weather & finish ─────────────────────────────────────────

export function Rain({
  c,
  seed = 13,
  color,
  count = 40,
  maxY,
  opacity = 0.55,
}: {
  c: SceneCtx;
  seed?: number;
  color: string;
  count?: number;
  maxY?: number;
  opacity?: number;
}) {
  const r = rng(seed);
  const lim = maxY ?? c.H;
  return (
    <G opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const x = r() * (c.W + 20);
        const y = r() * lim;
        return (
          <Path key={i} d={`M${x},${y} l-3,9`} stroke={color} strokeWidth={1.2} strokeLinecap="round" />
        );
      })}
    </G>
  );
}

export function Fireflies({
  c,
  seed = 17,
  color,
  count = 14,
  area,
}: {
  c: SceneCtx;
  seed?: number;
  color: string;
  count?: number;
  area?: [number, number, number, number];
}) {
  const r = rng(seed);
  const [ax, ay, aw, ah] = area ?? [0, c.H * 0.3, c.W, c.H * 0.5];
  return (
    <G>
      {Array.from({ length: count }, (_, i) => {
        const x = ax + r() * aw;
        const y = ay + r() * ah;
        return (
          <G key={i}>
            <Circle cx={x} cy={y} r={3.2} fill={color} opacity={0.18} />
            <Circle cx={x} cy={y} r={1.1} fill={color} />
          </G>
        );
      })}
    </G>
  );
}

/** Low mist band. */
export function Mist({ c, y, color, opacity = 0.5, height = 26 }: { c: SceneCtx; y: number; color: string; opacity?: number; height?: number }) {
  return (
    <G opacity={opacity}>
      <Ellipse cx={c.W * 0.25} cy={y} rx={c.W * 0.4} ry={height * 0.5} fill={color} />
      <Ellipse cx={c.W * 0.75} cy={y + 4} rx={c.W * 0.45} ry={height * 0.45} fill={color} />
    </G>
  );
}

/**
 * The shared StoryMoon finish: soft vignette in the story's ink colour plus
 * a whisper of paper grain. Applied over every scene so 11 very different
 * palettes still read as one hand-made library.
 */
export function Finish({ c, vignette = 0.3, seed = 99 }: { c: SceneCtx; vignette?: number; seed?: number }) {
  const r = rng(seed);
  return (
    <G>
      <Defs>
        <RadialGradient id={gid(c, 'vig')} cx="50%" cy="48%" r="72%">
          <Stop offset="0.55" stopColor={c.p.ink} stopOpacity={0} />
          <Stop offset="1" stopColor={c.p.ink} stopOpacity={vignette} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={c.W} height={c.H} fill={gurl(c, 'vig')} />
      <G opacity={0.07}>
        {Array.from({ length: 46 }, (_, i) => (
          <Circle
            key={i}
            cx={r() * c.W}
            cy={r() * c.H}
            r={0.4 + r() * 0.9}
            fill={i % 2 ? '#FFFFFF' : c.p.ink}
          />
        ))}
      </G>
    </G>
  );
}
