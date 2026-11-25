// Rùa Con Tìm Đường Ra Biển — quiet, wide and reassuring; a protected island
// beach at Côn Đảo. Signature: deep blue night, a low full moon laying a
// silver path across the sea, pale soft sand with tiny turtle tracks, sea
// grape plants, smooth dark rocks, low green hills, a friendly ghost crab
// and a single seashell. Gentle curling waves only.
// No predators or gulls, no beach lights or litter, no rough seas.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { Finish, Glow, MoonDisc, SceneCtx, Sky, Stars, StoryScenes, Water, rng } from '../kit';

// ─── Colours ──────────────────────────────────────────────────

const MOON = '#F4F6FF';
const STAR = '#EAF2FF';
const SEA_TOP = '#2E5C80';
const SEA_DEEP = '#132C4A';
const SEA_LIGHT = '#4A82A8';
const FOAM = '#DDEBF5';
const WET_SAND = '#A8977A';
const HILL = '#1C3A3E';
const HILL_FAR = '#22465A';
const ROCK = '#2C343E';
const ROCK_LIGHT = '#3E4854';
const SEAGRAPE = '#3E6A4A';
const SEAGRAPE_LIGHT = '#5A8A5E';
const SKIN = '#4A5A32';
const SHELL = '#5A6A30';
const SHELL_DARK = '#3E4A22';
const SHELL_LIGHT = '#7A8C46';
const EGG = '#F2EEE2';
const EGG_SHADE = '#D6CFBC';
const NEST = '#A8956E';
const TRACK = '#8C7A5E';
const CRAB = '#E8DAB8';
const CRAB_SHADE = '#CDBB94';
const SEASHELL = '#F2C8BC';
const SEASHELL_LINE = '#D69A8C';

// ─── Characters ───────────────────────────────────────────────

/** Baby sea turtle seen from above, heading up (towards the sea) at rot = 0. */
function Turtle({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Path d="M-6,-5 Q-16,-11 -21,-4 Q-14,-1 -6,-1 Z M6,-5 Q16,-11 21,-4 Q14,-1 6,-1 Z" fill={SKIN} />
      <Path d="M-5,8 Q-11,10 -12,15 Q-7,13 -4,11 Z M5,8 Q11,10 12,15 Q7,13 4,11 Z" fill={SKIN} />
      <Ellipse cx={0} cy={-12} rx={4.2} ry={5} fill={SKIN} />
      <Circle cx={-2.4} cy={-13.4} r={1.4} fill="#FFFFFF" />
      <Circle cx={2.4} cy={-13.4} r={1.4} fill="#FFFFFF" />
      <Circle cx={-2.4} cy={-13.8} r={0.7} fill="#08121F" />
      <Circle cx={2.4} cy={-13.8} r={0.7} fill="#08121F" />
      <Path d="M0,-8 C-4,-11 -11,-9 -11,-2 C-11,5 -5,10 0,13 C5,10 11,5 11,-2 C11,-9 4,-11 0,-8 Z" fill={SHELL} />
      <Path d="M0,-6 L0,10 M-7,-2 L7,-2 M-6,4 L6,4" stroke={SHELL_DARK} strokeWidth={0.8} />
      <Ellipse cx={-4} cy={-3} rx={3} ry={2} fill={SHELL_LIGHT} opacity={0.6} />
    </G>
  );
}

/** An egg cracking open with a baby turtle wriggling out of the top. */
function HatchingEgg({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-4,-8 Q-12,-14 -15,-8 Q-9,-6 -4,-6 Z M4,-8 Q12,-14 15,-8 Q9,-6 4,-6 Z" fill={SKIN} />
      <Ellipse cx={0} cy={-12} rx={4} ry={4.8} fill={SKIN} />
      <Circle cx={-2.2} cy={-13.2} r={1.3} fill="#FFFFFF" />
      <Circle cx={2.2} cy={-13.2} r={1.3} fill="#FFFFFF" />
      <Circle cx={-2.2} cy={-13.6} r={0.65} fill="#08121F" />
      <Circle cx={2.2} cy={-13.6} r={0.65} fill="#08121F" />
      <Path d="M-9,-6 L-6,-9 L-3,-5 L0,-9 L3,-5 L6,-9 L9,-6 C9,4 5,8 0,8 C-5,8 -9,4 -9,-6 Z" fill={EGG} />
      <Path d="M5,-2 C6,2 4,6 0,7" stroke={EGG_SHADE} strokeWidth={1.4} fill="none" />
      <Path d="M14,-14 C14,-20 20,-22 24,-18 L22,-16 L19,-18 L17,-15 Z" fill={EGG} />
      <Path d="M-18,-16 l-3,-2 M-19,-11 l-4,0 M18,-6 l4,-1" stroke={FOAM} strokeWidth={1} strokeLinecap="round" opacity={0.7} />
    </G>
  );
}

function Egg({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={0} rx={7} ry={7.6} fill={EGG} />
      <Ellipse cx={2} cy={2} rx={4} ry={4.6} fill={EGG_SHADE} opacity={0.5} />
    </G>
  );
}

function Eggshell({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <Path
      transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}
      d="M-8,-2 L-5,-5 L-2,-1 L1,-5 L4,-1 L8,-3 C8,4 4,7 0,7 C-4,7 -8,4 -8,-2 Z"
      fill={EGG}
    />
  );
}

function Crab({ x, y, s = 1, point = false, flip = false }: { x: number; y: number; s?: number; point?: boolean; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {[-1, 1].map((d) => (
        <Path key={d} d={`M${d * 6},-4 l${d * 7},3 M${d * 6},-2 l${d * 7},5 M${d * 5},0 l${d * 5},5`} stroke={CRAB_SHADE} strokeWidth={1.3} strokeLinecap="round" />
      ))}
      <Ellipse cx={0} cy={-5} rx={9} ry={5.5} fill={CRAB} />
      <Path d="M-3,-9 L-4,-16 M3,-9 L4,-16" stroke={CRAB} strokeWidth={1.4} />
      <Circle cx={-4} cy={-17} r={1.7} fill="#08121F" />
      <Circle cx={4} cy={-17} r={1.7} fill="#08121F" />
      <Path d="M-2.5,-4 Q0,-2 2.5,-4" stroke={CRAB_SHADE} strokeWidth={0.8} fill="none" />
      <Ellipse cx={-11} cy={-7} rx={3.4} ry={2.6} fill={CRAB_SHADE} />
      {point ? (
        <G>
          <Path d="M7,-7 Q14,-13 19,-18" stroke={CRAB} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Ellipse cx={21} cy={-20} rx={3.8} ry={2.4} fill={CRAB_SHADE} transform="rotate(-40 21 -20)" />
        </G>
      ) : (
        <Ellipse cx={11} cy={-7} rx={3.4} ry={2.6} fill={CRAB_SHADE} />
      )}
    </G>
  );
}

function CrabHole({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={0} rx={10} ry={3.6} fill={WET_SAND} />
      <Ellipse cx={0} cy={0.4} rx={7} ry={2.4} fill="#3A3226" />
    </G>
  );
}

function Seashell({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M0,0 C-10,-1 -12,-10 -6,-15 C-2,-18 2,-18 6,-15 C12,-10 10,-1 0,0 Z" fill={SEASHELL} />
      <Path d="M0,0 L-7,-12 M0,0 L-3,-15 M0,0 L2,-16 M0,0 L6,-13" stroke={SEASHELL_LINE} strokeWidth={0.8} />
      <Rect x={-3} y={-1} width={6} height={3} rx={1} fill={SEASHELL} />
    </G>
  );
}

/** A little line of flipper marks from (x1, y1) to (x2, y2). */
function Tracks({ x1, y1, x2, y2, n = 8, w = 4 }: { x1: number; y1: number; x2: number; y2: number; n?: number; w?: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy * w;
  const py = ux * w;
  return (
    <G opacity={0.7}>
      <Path d={`M${x1},${y1} L${x2},${y2}`} stroke={TRACK} strokeWidth={1} opacity={0.35} />
      {Array.from({ length: n }, (_, i) => {
        const t = i / Math.max(1, n - 1);
        const cx = x1 + dx * t;
        const cy = y1 + dy * t;
        return (
          <Path
            key={i}
            d={`M${cx + px},${cy + py} L${cx + px * 0.4 + ux * 3},${cy + py * 0.4 + uy * 3} M${cx - px},${cy - py} L${cx - px * 0.4 + ux * 3},${cy - py * 0.4 + uy * 3}`}
            stroke={TRACK}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        );
      })}
    </G>
  );
}

function SeaGrape({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  const leaves: Array<[number, number, number]> = [[-14, -22, 9], [2, -32, 10], [16, -20, 9], [-4, -14, 8], [24, -34, 7], [-22, -36, 7]];
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M0,0 Q-6,-14 -14,-22 M0,0 Q2,-16 2,-32 M0,0 Q8,-10 16,-20 M2,-20 Q14,-28 24,-34 M-4,-14 Q-14,-28 -22,-36" stroke="#4A3A2A" strokeWidth={1.6} fill="none" />
      {leaves.map(([lx, ly, r], i) => (
        <Circle key={i} cx={lx} cy={ly} r={r} fill={i % 2 ? SEAGRAPE_LIGHT : SEAGRAPE} />
      ))}
    </G>
  );
}

function Rock({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-18,0 Q-16,-12 -4,-14 Q10,-15 16,-6 Q19,-2 18,0 Z" fill={ROCK} />
      <Path d="M-10,-8 Q-4,-12 4,-11" stroke={ROCK_LIGHT} strokeWidth={2} fill="none" strokeLinecap="round" />
    </G>
  );
}

/** A small foamy curl of a gentle wave. */
function Curl({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <Path
      transform={`translate(${x},${y}) scale(${s})`}
      d="M-14,0 Q-4,-6 4,-4 Q9,-2 7,1 Q5,3 2,0"
      stroke={FOAM}
      strokeWidth={1.4}
      fill="none"
      strokeLinecap="round"
      opacity={0.8}
    />
  );
}

/** Shimmering silver path from the moon down the water to `to`. */
function MoonPath({ x, y, to, seed = 3, n = 16, spread = 70 }: { x: number; y: number; to: number; seed?: number; n?: number; spread?: number }) {
  const r = rng(seed);
  return (
    <G>
      {Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1);
        const yy = y + 2 + (to - y - 4) * t;
        const w = 6 + t * spread * (0.6 + r() * 0.5);
        const xx = x - w / 2 + (r() - 0.5) * 10 * t;
        return <Rect key={i} x={xx} y={yy} width={w} height={1.4 + t * 1.6} rx={1} fill={MOON} opacity={0.8 - t * 0.3} />;
      })}
    </G>
  );
}

/** Night sky, moon, sea and sand. `horizon` = sea line, `shore` = where the sand begins. */
function Beach({ c, horizon, shore, moonX = c.W * 0.6, seed = 1, stars = 40 }: { c: SceneCtx; horizon: number; shore: number; moonX?: number; seed?: number; stars?: number }) {
  const moonY = horizon - 30;
  return (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Stars c={c} count={stars} seed={seed} color={STAR} maxY={horizon - 8} />
      <Glow c={c} name="moon" cx={moonX} cy={moonY} r={80} color={c.p.glow} opacity={0.5} />
      <MoonDisc cx={moonX} cy={moonY} r={20} color={MOON} shade="rgba(150,170,210,0.25)" />
      <Path d={`M${c.W * 0.62},${horizon} Q${c.W * 0.82},${horizon - 18} ${c.W + 10},${horizon - 10} L${c.W + 10},${horizon} Z`} fill={HILL_FAR} />
      <Path d={`M-10,${horizon} Q${c.W * 0.1},${horizon - 34} ${c.W * 0.28},${horizon - 20} Q${c.W * 0.36},${horizon - 12} ${c.W * 0.42},${horizon} Z`} fill={HILL} />
      <Water c={c} y={horizon} top={SEA_TOP} bottom={SEA_DEEP} name="sea" seed={seed + 1} />
      <MoonPath x={moonX} y={horizon} to={Math.min(shore, c.H)} seed={seed + 2} spread={c.W * 0.22} />
      <Path d={`M-10,${shore - 4} Q${c.W * 0.5},${shore - 10} ${c.W + 10},${shore - 3}`} stroke={FOAM} strokeWidth={1.4} fill="none" opacity={0.7} />
      <Path d={`M-10,${shore} Q${c.W * 0.4},${shore - 6} ${c.W + 10},${shore + 1} L${c.W + 10},${c.H + 2} L-10,${c.H + 2} Z`} fill={WET_SAND} />
      <Path d={`M-10,${shore + 10} Q${c.W * 0.5},${shore + 2} ${c.W + 10},${shore + 12} L${c.W + 10},${c.H + 2} L-10,${c.H + 2} Z`} fill={c.p.ground} />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Beach c={c} horizon={150} shore={214} moonX={196} seed={5} stars={60} />
    <Curl x={100} y={194} s={1.2} />
    <Curl x={290} y={190} s={1} />
    <Rock x={50} y={240} s={1.4} />
    <SeaGrape x={20} y={352} s={1.6} />
    <SeaGrape x={346} y={348} s={1.4} flip />
    <Tracks x1={166} y1={352} x2={176} y2={306} n={7} w={5} />
    <Glow c={c} name="turtle" cx={180} cy={284} r={50} color={c.p.glow} opacity={0.3} />
    <Turtle x={180} y={286} s={2.1} rot={-6} />
    <CrabHole x={280} y={272} s={1.3} />
    <Crab x={278} y={268} s={1.6} flip />
    <Finish c={c} vignette={0.34} />
  </G>
);

const pages = [
  // 1 — a quiet island beach at night; a small egg cracks open and a baby turtle wriggles out
  (c: SceneCtx) => (
    <G>
      <Beach c={c} horizon={78} shore={118} seed={11} />
      <SeaGrape x={20} y={236} s={1.2} />
      <SeaGrape x={344} y={232} s={1.1} flip />
      <Ellipse cx={180} cy={196} rx={46} ry={14} fill={NEST} />
      <Egg x={152} y={194} />
      <Egg x={206} y={196} s={0.95} />
      <Egg x={194} y={204} s={0.9} />
      <Glow c={c} name="egg" cx={178} cy={176} r={36} color={c.p.glow} opacity={0.35} />
      <HatchingEgg x={178} y={192} s={1.9} />
      <Finish c={c} vignette={0.34} />
    </G>
  ),
  // 2 — the baby turtle alone by the empty nest; many small tracks lead away under the stars
  (c: SceneCtx) => (
    <G>
      <Beach c={c} horizon={70} shore={112} seed={21} stars={60} />
      <Ellipse cx={150} cy={206} rx={36} ry={11} fill={NEST} />
      <Eggshell x={136} y={204} rot={-20} />
      <Eggshell x={160} y={208} s={0.9} rot={30} />
      <Tracks x1={150} y1={196} x2={92} y2={128} n={9} />
      <Tracks x1={156} y1={196} x2={180} y2={124} n={9} />
      <Tracks x1={164} y1={198} x2={262} y2={130} n={10} />
      <Turtle x={196} y={202} s={1.4} rot={-20} />
      <Rock x={310} y={196} s={1.2} />
      <Finish c={c} vignette={0.36} />
    </G>
  ),
  // 3 — a small ghost crab pops out of its hole and points a claw toward the moonlit sea
  (c: SceneCtx) => (
    <G>
      <Beach c={c} horizon={86} shore={130} moonX={250} seed={31} />
      <Rock x={60} y={170} s={1.3} />
      <CrabHole x={226} y={198} s={1.4} />
      <Crab x={226} y={196} s={1.9} point />
      <Turtle x={146} y={204} s={1.35} rot={28} />
      <SeaGrape x={340} y={238} s={1} flip />
      <Finish c={c} vignette={0.34} />
    </G>
  ),
  // 4 — a shining silver moon path; the baby turtle crawls across the sand leaving little tracks
  (c: SceneCtx) => (
    <G>
      <Beach c={c} horizon={92} shore={140} moonX={180} seed={41} />
      <Glow c={c} name="path" cx={180} cy={124} r={70} color={c.p.glow} opacity={0.35} />
      <Tracks x1={176} y1={238} x2={180} y2={204} n={6} />
      <Turtle x={180} y={190} s={1.4} />
      <Rock x={300} y={178} s={1} />
      <SeaGrape x={24} y={238} s={1} />
      <Finish c={c} vignette={0.34} />
    </G>
  ),
  // 5 — the baby turtle rests beside a seashell halfway down the beach; small waves curl far off
  (c: SceneCtx) => (
    <G>
      <Beach c={c} horizon={88} shore={132} moonX={230} seed={51} />
      <Curl x={80} y={118} />
      <Curl x={160} y={114} s={0.8} />
      <Curl x={280} y={120} s={1.1} />
      <Tracks x1={158} y1={238} x2={166} y2={196} n={6} />
      <Turtle x={168} y={182} s={1.3} rot={-12} />
      <Seashell x={208} y={192} s={1.3} />
      <Finish c={c} vignette={0.34} />
    </G>
  ),
  // 6 — a gentle wave lifts the baby turtle off the wet sand and it starts to swim in the silver water
  (c: SceneCtx) => (
    <G>
      <Beach c={c} horizon={78} shore={214} moonX={190} seed={61} />
      <Path d="M40,214 Q110,190 180,170 Q250,190 330,214 Z" fill={SEA_LIGHT} opacity={0.5} />
      <Path d="M70,200 Q130,180 180,170 Q232,180 290,200" stroke={FOAM} strokeWidth={1.6} fill="none" opacity={0.8} strokeLinecap="round" />
      <Glow c={c} name="swim" cx={184} cy={164} r={44} color={c.p.glow} opacity={0.35} />
      <Turtle x={184} y={164} s={1.5} rot={-8} />
      <Curl x={110} y={196} />
      <Curl x={260} y={194} s={0.9} />
      <Finish c={c} vignette={0.34} />
    </G>
  ),
  // 7 — several baby turtles swim together along the moon path under a sky full of stars
  (c: SceneCtx) => (
    <G>
      <Beach c={c} horizon={100} shore={c.H + 40} moonX={180} seed={71} stars={90} />
      <Turtle x={180} y={150} s={1.1} rot={-4} />
      <Turtle x={150} y={178} s={1.25} rot={8} />
      <Turtle x={214} y={186} s={1.3} rot={-10} />
      <Turtle x={170} y={212} s={1.4} rot={4} />
      <Turtle x={120} y={132} s={0.8} rot={14} />
      <Turtle x={236} y={136} s={0.85} rot={-12} />
      <Finish c={c} vignette={0.34} />
    </G>
  ),
];

export const RUA_CON_RA_BIEN: StoryScenes = { cover, pages };
