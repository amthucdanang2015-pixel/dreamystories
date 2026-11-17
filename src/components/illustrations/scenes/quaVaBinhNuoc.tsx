// Quạ và Bình Nước — sunny, still and thoughtful: a quiet puzzle on a
// sun-baked garden path that ends in a happy splash. Signature: pale
// sky-blue to cream high-summer skies, a low whitewashed wall with potted
// herbs, warm flagstones, a tall terracotta pitcher with a cream wave band
// (shown in cutaway so the water line can rise), smooth round pebbles in a
// counting row, and a friendly glossy indigo-black crow with a violet sheen.

import React from 'react';
import { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Finish, Glow, SceneCtx, Sky, StoryScenes, Sun, gid, gurl, rng } from '../kit';

// ─── Characters & colours ─────────────────────────────────────

const CROW = '#2C2B4E';
const CROW_DEEP = '#1B1A36';
const CROW_BELLY = '#3A3962';
const SHEEN = '#4E58A8';
const SHEEN_V = '#7A66C2';
const CROW_EYE = '#F0A43A';
const BEAK = '#3B3752';
const LEGS = '#4C4766';
const CLAY = '#C0623A';
const CLAY_DEEP = '#9A4A2A';
const CLAY_LIGHT = '#DA8456';
const CREAM = '#F4E6C6';
const INTERIOR = '#6A3220';
const WATER = '#7CC3D2';
const WATER_DEEP = '#3F8FA8';
const SKY_TOP = '#CFE5EA';
const WALL = '#F7F2E7';
const WALL_SHADE = '#E4DAC6';
const COPING = '#DCCDB0';
const HERB = '#7FA35A';
const HERB_DEEP = '#5C7F40';
const PEBBLES = ['#BDB4A6', '#D5CBB9', '#A89C8C', '#CFC2AC', '#9E9486'];

// ─── Local helpers ────────────────────────────────────────────

type CrowPose = 'stand' | 'fly' | 'peer' | 'think' | 'drink';

/**
 * The crow, facing right. (x, y) = feet (or body base when flying);
 * s = 1 is ~66 units beak-to-tail. Body lean rotates around the feet.
 */
function Crow({
  x,
  y,
  s = 1,
  flip = false,
  pose = 'stand',
  pebble = false,
  happy = false,
}: {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  pose?: CrowPose;
  pebble?: boolean;
  happy?: boolean;
}) {
  const lean = pose === 'peer' ? 20 : pose === 'drink' ? 30 : pose === 'fly' ? -6 : 0;
  const tilt = pose === 'think' ? -20 : 0;
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <G transform={`rotate(${lean} 0 0)`}>
        {/* tail fan */}
        <Path d="M-12,-16 L-34,-11 L-33,-6 L-30,-8.5 L-28,-4 L-24,-7 L-10,-10 Z" fill={CROW_DEEP} />
        {pose === 'fly' ? (
          <Path d="M-2,-24 C-8,-44 -20,-54 -32,-56 L-27,-50 L-33,-47 L-27,-44 L-31,-40 L-23,-38 C-16,-32 -10,-26 -2,-20 Z" fill={CROW_DEEP} />
        ) : (
          <G>
            <Path d="M-2,-10 L-3,0 M5,-10 L5,0" stroke={LEGS} strokeWidth={1.8} strokeLinecap="round" />
            <Path d="M-7,0 L1,0 M1,0 L9.5,0" stroke={LEGS} strokeWidth={1.5} strokeLinecap="round" />
          </G>
        )}
        {/* body (fluffed when happy) */}
        {happy
          ? Array.from({ length: 9 }, (_, i) => {
              const a = Math.PI * (0.9 + i * 0.15);
              return <Circle key={i} cx={Math.cos(a) * 16} cy={-18 + Math.sin(a) * 11} r={4.5} fill={CROW} />;
            })
          : null}
        <Ellipse cx={0} cy={-18} rx={happy ? 18 : 16} ry={happy ? 13 : 11} fill={CROW} transform="rotate(-18 0 -18)" />
        <Ellipse cx={4} cy={-14} rx={9} ry={6} fill={CROW_BELLY} />
        {pose === 'fly' ? (
          <G>
            <Path d="M4,-22 C-2,-40 -6,-54 -2,-64 L2,-58 L4,-63 L7,-56 L10,-60 L11,-52 C10,-40 12,-30 12,-20 Z" fill={CROW} />
            <Path d="M7,-26 C4,-38 3,-48 5,-56" stroke={SHEEN} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.8} />
          </G>
        ) : (
          <G>
            <Path d="M-12,-22 C-4,-30 10,-28 12,-20 C6,-14 -6,-10 -22,-10 Z" fill={CROW_DEEP} />
            <Path d="M-8,-22 C0,-26 6,-25 9,-21" stroke={SHEEN} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.8} />
            <Path d="M-12,-17 C-4,-19 2,-18 6,-16" stroke={SHEEN_V} strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.6} />
          </G>
        )}
        {/* head */}
        <G transform={`rotate(${tilt} 10 -26)`}>
          <Ellipse cx={9} cy={-26} rx={7} ry={8} fill={CROW} />
          <Path d="M8,-38 L6,-44.5 L10,-40 L11,-46.5 L13,-40 L16.5,-43.5 L15,-38 Z" fill={CROW} />
          <Circle cx={13} cy={-32} r={8} fill={CROW} />
          <Path d="M8,-37 Q13,-40.5 18,-37" stroke={SHEEN} strokeWidth={1.4} fill="none" strokeLinecap="round" />
          <Path d="M6,-30 Q8,-25 12,-24" stroke={SHEEN_V} strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.6} />
          {happy && pose !== 'drink' ? (
            <G>
              <Path d="M19,-34 L32,-33.5 L19,-30.5 Z" fill={BEAK} />
              <Path d="M19,-29.5 L29,-25 L19,-27.2 Z" fill={BEAK} />
              <Path d="M19,-30.5 L24,-29.8 L19,-29.5 Z" fill="#D9837A" />
            </G>
          ) : (
            <G>
              <Path d="M19,-34 L32,-30 L19,-27.5 Z" fill={BEAK} />
              <Path d="M19,-30.8 L30,-30.2" stroke={CROW_DEEP} strokeWidth={0.8} />
            </G>
          )}
          {happy ? (
            <Path d="M12.6,-33.6 Q15,-37 17.4,-33.6" stroke={CROW_EYE} strokeWidth={1.5} fill="none" strokeLinecap="round" />
          ) : (
            <G>
              <Circle cx={15} cy={-34} r={2.5} fill={CROW_EYE} />
              <Circle cx={15.6} cy={-34} r={1.15} fill="#1A1426" />
              <Circle cx={16.2} cy={-34.8} r={0.5} fill="#FFFFFF" />
            </G>
          )}
          <Circle cx={15.5} cy={-28.5} r={1.8} fill="#C87A8A" opacity={0.35} />
          {pebble ? (
            <G>
              <Circle cx={32} cy={-30} r={3.6} fill={PEBBLES[3]} />
              <Circle cx={31} cy={-31.2} r={1.1} fill="#FFFFFF" opacity={0.5} />
            </G>
          ) : null}
        </G>
      </G>
    </G>
  );
}

// Pitcher silhouette as [y, half-width] pairs, base (0) up to the lip (-88).
const PROFILE: Array<[number, number]> = [
  [0, 13], [-4, 18], [-14, 25], [-28, 29], [-42, 27], [-54, 20], [-63, 11], [-70, 7.5], [-79, 7.5], [-84, 10.5], [-88, 10.5],
];
const INNER_BOTTOM = -5;
const INNER_TOP = -78;

function hwAt(y: number) {
  for (let i = 0; i < PROFILE.length - 1; i++) {
    const [y0, w0] = PROFILE[i];
    const [y1, w1] = PROFILE[i + 1];
    if (y <= y0 && y >= y1) return w0 + ((w1 - w0) * (y0 - y)) / (y0 - y1);
  }
  return PROFILE[PROFILE.length - 1][1];
}
const innerAt = (y: number) => Math.max(hwAt(y) * 0.8 - 2, 3);

function loopPath(pts: Array<[number, number]>) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    d += ` Q${x0},${y0} ${(x0 + x1) / 2},${(y0 + y1) / 2}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${last[0]},${last[1]} Z`;
}

/** Inner region between y0 (bottom) and y1 (higher), following the pitcher's inside. */
function innerBand(y0: number, y1: number, steps = 10) {
  const ys = Array.from({ length: steps + 1 }, (_, i) => y0 + ((y1 - y0) * i) / steps);
  const right = ys.map((y) => `${innerAt(y).toFixed(2)},${y.toFixed(2)}`);
  const left = ys.slice().reverse().map((y) => `${(-innerAt(y)).toFixed(2)},${y.toFixed(2)}`);
  return `M${right.join(' L')} L${left.join(' L')} Z`;
}

/**
 * Tall terracotta pitcher with a cream wave band. (x, y) = base centre; s = 1 is 88 tall.
 * `cutaway` opens the front to show `water` (0..1 of the inside) and `pebbles` inside.
 */
function Pitcher({
  c,
  x,
  y,
  s = 1,
  cutaway = false,
  water = 0,
  pebbles = 0,
  marks = [],
  brim = false,
}: {
  c: SceneCtx;
  x: number;
  y: number;
  s?: number;
  cutaway?: boolean;
  water?: number;
  pebbles?: number;
  marks?: number[];
  brim?: boolean;
}) {
  const right = PROFILE.map(([py, w]) => [w, py] as [number, number]);
  const left = PROFILE.slice().reverse().map(([py, w]) => [-w, py] as [number, number]);
  const outline = loopPath([...right, ...left]);
  const lvl = (t: number) => INNER_BOTTOM + (INNER_TOP - INNER_BOTTOM) * t;
  const wy = lvl(water);
  const r = rng(7);
  const stones: Array<[number, number, string]> = [];
  let py = INNER_BOTTOM - 3;
  while (stones.length < pebbles) {
    const hw = innerAt(py) - 3;
    const per = Math.max(1, Math.floor((hw * 2) / 6.4));
    for (let k = 0; k < per && stones.length < pebbles; k++) {
      stones.push([-hw + 3 + k * 6.4 + r() * 1.5, py - r() * 1.2, PEBBLES[stones.length % PEBBLES.length]]);
    }
    py -= 5;
  }
  const bandY = -40;
  const bw = hwAt(bandY) - 1;
  let wave = `M${-bw},${bandY}`;
  for (let k = 0; k < 6; k++) {
    const x0 = -bw + (k * bw * 2) / 6;
    const x1 = -bw + ((k + 1) * bw * 2) / 6;
    wave += ` Q${(x0 + x1) / 2},${bandY + (k % 2 ? 4 : -4)} ${x1},${bandY}`;
  }
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Defs>
        <LinearGradient id={gid(c, 'clay')} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={CLAY_DEEP} />
          <Stop offset="0.35" stopColor={CLAY_LIGHT} />
          <Stop offset="0.6" stopColor={c.p.accent} />
          <Stop offset="1" stopColor={CLAY_DEEP} />
        </LinearGradient>
      </Defs>
      <Ellipse cx={10} cy={1} rx={30} ry={3.6} fill={c.p.ink} opacity={0.2} />
      <Path d="M-8,-77 C-26,-77 -34,-58 -24,-44" stroke={CLAY_DEEP} strokeWidth={4.6} fill="none" strokeLinecap="round" />
      <Path d={outline} fill={gurl(c, 'clay')} />
      <Path d={`M${-hwAt(-48) + 1},-48 L${hwAt(-48) - 1},-48 M${-hwAt(-32) + 1},-32 L${hwAt(-32) - 1},-32`} stroke={CREAM} strokeWidth={1.3} />
      <Path d={wave} stroke={CREAM} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <Path d="M-20,-24 Q-22,-40 -16,-52" stroke="#FFFFFF" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.25} />
      {cutaway ? (
        <G>
          <Path d={innerBand(INNER_BOTTOM, INNER_TOP)} fill={INTERIOR} />
          {marks.map((t, i) => (
            <Path key={i} d={`M${-innerAt(lvl(t)) + 1},${lvl(t)} L${innerAt(lvl(t)) - 1},${lvl(t)}`} stroke={WATER} strokeWidth={0.8} opacity={0.45} />
          ))}
          {water > 0 ? <Path d={innerBand(INNER_BOTTOM, wy)} fill={WATER_DEEP} opacity={0.9} /> : null}
          {stones.map(([sx, sy, col], i) => (
            <G key={i}>
              <Ellipse cx={sx} cy={sy} rx={3.4} ry={2.7} fill={col} />
              <Ellipse cx={sx - 1} cy={sy - 1} rx={1.1} ry={0.7} fill="#FFFFFF" opacity={0.4} />
            </G>
          ))}
          {water > 0 ? (
            <G>
              <Path d={innerBand(INNER_BOTTOM, wy)} fill={WATER} opacity={0.35} />
              <Ellipse cx={0} cy={wy} rx={innerAt(wy)} ry={1.6} fill={WATER} />
              <Path d={`M-4,${wy - 3} Q0,${wy - 5} 4,${wy - 3}`} stroke="#FFFFFF" strokeWidth={0.9} fill="none" opacity={0.7} />
            </G>
          ) : null}
          <Path d={innerBand(INNER_BOTTOM, INNER_TOP)} stroke={CLAY_LIGHT} strokeWidth={1.4} fill="none" />
        </G>
      ) : null}
      <Ellipse cx={0} cy={-88} rx={10.5} ry={2.8} fill={CLAY_DEEP} />
      <Ellipse cx={0} cy={-88} rx={7.5} ry={1.9} fill={brim ? WATER : '#4A2418'} />
      {brim ? <Path d="M-4,-88.4 L2,-88.4" stroke="#FFFFFF" strokeWidth={0.9} strokeLinecap="round" /> : null}
    </G>
  );
}

function Pebble({ x, y, r = 4, color }: { x: number; y: number; r?: number; color: string }) {
  return (
    <G>
      <Ellipse cx={x + 1.2} cy={y + r * 0.55} rx={r} ry={r * 0.35} fill="#7A6A52" opacity={0.25} />
      <Ellipse cx={x} cy={y} rx={r} ry={r * 0.78} fill={color} />
      <Ellipse cx={x - r * 0.3} cy={y - r * 0.3} rx={r * 0.32} ry={r * 0.2} fill="#FFFFFF" opacity={0.45} />
    </G>
  );
}

/** A tidy counting row of pebbles. */
function PebbleRow({ x, y, n, gap = 14, r = 4.2 }: { x: number; y: number; n: number; gap?: number; r?: number }) {
  return (
    <G>
      {Array.from({ length: n }, (_, i) => (
        <Pebble key={i} x={x + i * gap} y={y} r={r} color={PEBBLES[i % PEBBLES.length]} />
      ))}
    </G>
  );
}

function Scattered({ seed, area, n = 8 }: { seed: number; area: [number, number, number, number]; n?: number }) {
  const r = rng(seed);
  const [ax, ay, aw, ah] = area;
  return (
    <G>
      {Array.from({ length: n }, (_, i) => (
        <Pebble key={i} x={ax + r() * aw} y={ay + r() * ah} r={3 + r() * 2.4} color={PEBBLES[i % PEBBLES.length]} />
      ))}
    </G>
  );
}

/** Low whitewashed garden wall from `top` down to `y`. */
function Wall({ c, top, y, x0 = 0, x1 }: { c: SceneCtx; top: number; y: number; x0?: number; x1?: number }) {
  const xe = x1 ?? c.W;
  const r = rng(top);
  return (
    <G>
      <Rect x={x0} y={top} width={xe - x0} height={y - top} fill={WALL} />
      {Array.from({ length: 6 }, (_, i) => (
        <Ellipse key={i} cx={x0 + r() * (xe - x0)} cy={top + 10 + r() * (y - top - 20)} rx={10 + r() * 14} ry={4 + r() * 4} fill={WALL_SHADE} opacity={0.45} />
      ))}
      <Rect x={x0} y={y - 5} width={xe - x0} height={5} fill={WALL_SHADE} />
      <Rect x={x0 - 2} y={top - 5} width={xe - x0 + 4} height={7} rx={2.5} fill={COPING} />
      <Rect x={x0} y={top + 2} width={xe - x0} height={3} fill={WALL_SHADE} opacity={0.7} />
    </G>
  );
}

/** Warm flagstone path from y to the bottom, stones growing toward the viewer. */
function Flagstones({ c, y, seed = 3 }: { c: SceneCtx; y: number; seed?: number }) {
  const r = rng(seed);
  const tones = [c.p.ground, '#E3D4B6', '#CDBB98'];
  const rows: React.ReactElement[] = [];
  let ry = y;
  for (let j = 0; ry < c.H; j++) {
    const h = 12 + j * 7;
    let rx = -r() * 30;
    while (rx < c.W) {
      const w = (28 + r() * 26) * (1 + j * 0.35);
      rows.push(
        <G key={`${j}-${rx.toFixed(1)}`}>
          <Rect x={rx + 1.5} y={ry + 1.5} width={w - 3} height={h - 3} rx={3 + j} fill={tones[Math.floor(r() * 3)]} />
          <Rect x={rx + 4} y={ry + 2.5} width={w * 0.5} height={1.4} rx={0.7} fill="#FFFFFF" opacity={0.3} />
        </G>
      );
      rx += w;
    }
    ry += h;
  }
  return (
    <G>
      <Rect x={0} y={y} width={c.W} height={c.H - y + 2} fill={c.p.groundDeep} />
      {rows}
    </G>
  );
}

function HerbPot({ x, y, s = 1, seed = 1 }: { x: number; y: number; s?: number; seed?: number }) {
  const r = rng(seed);
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {Array.from({ length: 9 }, (_, i) => {
        const a = -Math.PI * (0.15 + r() * 0.7);
        const L = 9 + r() * 8;
        const lx = Math.cos(a) * L * 0.8;
        const ly = -14 + Math.sin(a) * L;
        return <Ellipse key={i} cx={lx} cy={ly} rx={2.4} ry={5} fill={i % 2 ? HERB : HERB_DEEP} transform={`rotate(${(a * 180) / Math.PI + 90} ${lx} ${ly})`} />;
      })}
      <Path d="M-8,-14 L8,-14 L6,0 L-6,0 Z" fill={CLAY} />
      <Rect x={-9.5} y={-16} width={19} height={4} rx={1.5} fill={CLAY_DEEP} />
    </G>
  );
}

/** Dried-up puddle: a pale patch with fine cracks. */
function DryPuddle({ x, y, w = 40, color }: { x: number; y: number; w?: number; color: string }) {
  return (
    <G>
      <Ellipse cx={x} cy={y} rx={w / 2} ry={w * 0.16} fill="#C9B48E" opacity={0.85} />
      <Path d={`M${x - w * 0.3},${y} l${w * 0.15},-2 l${w * 0.12},3 l${w * 0.14},-2 M${x - w * 0.05},${y - 1} l2,-${w * 0.1} M${x + w * 0.1},${y + 1} l3,${w * 0.08}`} stroke={color} strokeWidth={0.9} fill="none" strokeLinecap="round" />
    </G>
  );
}

function HeatHaze({ xs, y }: { xs: number[]; y: number }) {
  return (
    <G opacity={0.55}>
      {xs.map((hx, i) => (
        <Path key={i} d={`M${hx},${y} q4,-5 0,-10 q-4,-5 0,-10 q4,-5 0,-10`} stroke="#FFFFFF" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      ))}
    </G>
  );
}

function Sparkle({ x, y, r = 4, color = '#FFFFFF' }: { x: number; y: number; r?: number; color?: string }) {
  return <Path d={`M${x},${y - r} Q${x},${y} ${x + r},${y} Q${x},${y} ${x},${y + r} Q${x},${y} ${x - r},${y} Q${x},${y} ${x},${y - r} Z`} fill={color} />;
}

function Splash({ x, y }: { x: number; y: number }) {
  return (
    <G>
      {[[-8, -6, 2.2], [-3, -12, 2.6], [4, -14, 2.2], [9, -7, 1.8], [0, -20, 1.6]].map(([dx, dy, rr], i) => (
        <Circle key={i} cx={x + dx} cy={y + dy} r={rr} fill={WATER} />
      ))}
      <Path d={`M${x - 14},${y - 4} l-5,-3 M${x + 14},${y - 4} l5,-3`} stroke={WATER_DEEP} strokeWidth={1.2} strokeLinecap="round" />
    </G>
  );
}

function Backdrop({ c, sunX = 300, sunY = 44, glow = 'sun' }: { c: SceneCtx; sunX?: number; sunY?: number; glow?: string }) {
  return (
    <G>
      <Sky c={c} top={SKY_TOP} mid={c.p.skyLow} bottom={c.p.sky} />
      <Glow c={c} name={glow} cx={sunX} cy={sunY} r={100} color={c.p.glow} opacity={0.9} />
      <Sun cx={sunX} cy={sunY} r={18} color="#FFF8DE" rays="#FBE3A0" />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Backdrop c={c} sunX={290} sunY={64} />
    <Wall c={c} top={168} y={262} />
    <HerbPot x={70} y={164} s={1.3} seed={3} />
    <HerbPot x={300} y={164} s={1.1} seed={5} />
    <Flagstones c={c} y={262} seed={7} />
    <Pitcher c={c} x={180} y={306} s={1.9} />
    <Crow x={188} y={139} s={1.15} pebble />
    <PebbleRow x={78} y={334} n={6} gap={16} />
    <PebbleRow x={208} y={334} n={5} gap={16} />
    <Finish c={c} vignette={0.2} />
  </G>
);

const pages = [
  // 1 — the crow flies low over a sun-baked flagstone path; dried puddles and shimmering heat haze
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} sunX={70} sunY={42} />
      <Wall c={c} top={118} y={150} x0={220} />
      <Flagstones c={c} y={150} seed={11} />
      <DryPuddle x={110} y={186} w={50} color={c.p.groundDeep} />
      <DryPuddle x={258} y={208} w={60} color={c.p.groundDeep} />
      <DryPuddle x={196} y={226} w={34} color={c.p.groundDeep} />
      <HeatHaze xs={[60, 140, 230, 300]} y={150} />
      <Ellipse cx={186} cy={194} rx={22} ry={3} fill={c.p.ink} opacity={0.12} />
      <Crow x={176} y={118} s={1.3} pose="fly" />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 2 — landing on the wall beside the tall pitcher, he peers into its neck; a little water far below
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} sunX={300} sunY={36} />
      <Wall c={c} top={96} y={170} />
      <HerbPot x={60} y={92} s={1.1} seed={21} />
      <Flagstones c={c} y={170} seed={23} />
      <Pitcher c={c} x={160} y={216} s={1.5} cutaway water={0.12} />
      <Crow x={200} y={94} s={1} flip pose="peer" />
      <Scattered seed={25} area={[230, 196, 90, 30]} n={5} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 3 — the pitcher won't budge (scuffs, a stray feather); he sits on the wall, head tilted, thinking
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} sunX={60} sunY={40} />
      <Wall c={c} top={102} y={172} />
      <HerbPot x={310} y={98} s={1.1} seed={31} />
      <Flagstones c={c} y={172} seed={33} />
      <Pitcher c={c} x={130} y={216} s={1.4} />
      <Path d="M86,214 l-8,2 M90,220 l-9,1 M84,208 l-6,-1" stroke={c.p.groundDeep} strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M100,226 q4,-6 10,-4 q-4,2 -10,4 Z" fill={CROW} />
      <Crow x={246} y={100} s={1.05} flip pose="think" />
      {/* thought bubble */}
      <Circle cx={218} cy={54} r={2.4} fill="#FFFFFF" opacity={0.9} />
      <Circle cx={208} cy={44} r={3.6} fill="#FFFFFF" opacity={0.9} />
      <Ellipse cx={188} cy={28} rx={16} ry={12} fill="#FFFFFF" opacity={0.92} />
      <Path d="M184,24 Q184,18 189,18 Q194,18 194,23 Q194,27 189,28 L189,31" stroke={c.p.ink} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <Circle cx={189} cy={35} r={1.1} fill={c.p.ink} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 4 — he picks up a smooth pebble from the path; pebbles all around; the last one went in — plink!
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} sunX={300} sunY={30} />
      <Wall c={c} top={50} y={140} />
      <HerbPot x={84} y={46} s={1} seed={41} />
      <Flagstones c={c} y={140} seed={43} />
      <Pitcher c={c} x={252} y={214} s={1.4} />
      <Splash x={252} y={88} />
      <Path d="M276,74 l6,-4 M280,82 l7,-1" stroke={c.p.accent} strokeWidth={1.4} strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Circle key={i} cx={176 + i * 14} cy={150 - Math.sin(((i + 1) / 6) * Math.PI) * 40 - i * 8} r={1.3} fill={c.p.ink} opacity={0.3} />
      ))}
      <Scattered seed={45} area={[40, 186, 160, 40]} n={10} />
      <Crow x={130} y={204} s={1.35} pebble />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 5 — cutaway: pebbles piling up, the water line climbing; he flies in with another; a counting row on the path
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} sunX={56} sunY={34} />
      <Wall c={c} top={100} y={168} />
      <Flagstones c={c} y={168} seed={53} />
      <Pitcher c={c} x={140} y={214} s={1.6} cutaway water={0.62} pebbles={28} marks={[0.12, 0.28, 0.45]} />
      <Path d="M186,140 l5,-6 l5,6 M186,152 l5,-6 l5,6" stroke={WATER_DEEP} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Crow x={262} y={96} s={1} flip pose="fly" pebble />
      <PebbleRow x={210} y={222} n={8} gap={14} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 6 — water at the brim: perched on the sunny wall he drinks, feathers fluffed; sparkles at the rim
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} sunX={290} sunY={40} />
      <Wall c={c} top={118} y={178} />
      <HerbPot x={70} y={114} s={1.2} seed={61} />
      <HerbPot x={300} y={114} s={1} seed={63} />
      <Flagstones c={c} y={178} seed={65} />
      <Pitcher c={c} x={170} y={214} s={1.2} brim />
      <Crow x={214} y={116} s={1.1} flip pose="drink" happy />
      <Sparkle x={150} y={96} r={4} />
      <Sparkle x={160} y={84} r={2.6} />
      <Sparkle x={186} y={98} r={3} color={c.p.glow} />
      <Path d="M236,74 q4,-4 8,0 M242,64 q5,-5 10,0" stroke={c.p.accent} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <PebbleRow x={110} y={226} n={6} gap={13} r={3.6} />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
];

export const QUA_VA_BINH_NUOC: StoryScenes = { cover, pages };
