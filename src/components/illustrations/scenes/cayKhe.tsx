// Cây Khế — bright, breezy and generous: a sunny village garden, one old star
// fruit tree, a giant golden phoenix-like bird and an open turquoise sea.
// Signature: teal-to-butter afternoon skies, yellow five-pointed star fruit,
// rainbow-tipped golden plumes, glittering gold sparkles on sea and island.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Cloud,
  Figure,
  Finish,
  Glow,
  Grass,
  Hut,
  Paddies,
  Ridge,
  SceneCtx,
  Sky,
  StoryScenes,
  Sun,
  Water,
  WaveBand,
  rng,
} from '../kit';

// ─── Characters & colours ─────────────────────────────────────

const YOUNG = { top: '#8A5A3A', bottom: '#5E4030', hairStyle: 'short' as const };
const OLDER = {
  top: '#2F4C8A',
  bottom: '#1F2F5A',
  hairStyle: 'topknot' as const,
  hat: 'khan' as const,
  hatColor: '#C9962E',
};
const NONLA = '#EAD9A2';
const GOLD = '#F2B52E';
const GOLD_DEEP = '#D98F26';
const GOLD_LIGHT = '#FFE08A';
const RAINBOW = ['#E8604C', '#F29A3A', '#4FB7A8', '#6E8FD8', '#B26FC4'];
const TRUNK = '#7A5A3A';
const SEA_TOP = '#5CC6C0';
const SEA_DEEP = '#2E9AA6';

// ─── Local helpers ────────────────────────────────────────────

function starPath(cx: number, cy: number, r: number, rot = 0, inner = 0.48) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = ((rot - 90 + i * 36) * Math.PI) / 180;
    const rr = i % 2 ? r * inner : r;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(2)},${(cy + Math.sin(a) * rr).toFixed(2)} `;
  }
  return d + 'Z';
}

/** A yellow five-pointed star fruit (khế), seen end-on. */
function StarFruit({ x, y, r = 6, rot = 0 }: { x: number; y: number; r?: number; rot?: number }) {
  return (
    <G>
      <Path d={starPath(x, y + r * 0.12, r, rot)} fill={GOLD_DEEP} />
      <Path d={starPath(x, y, r, rot)} fill="#F6C93A" />
      <Path d={starPath(x - r * 0.08, y - r * 0.1, r * 0.48, rot, 0.5)} fill={GOLD_LIGHT} opacity={0.85} />
    </G>
  );
}

/** Four-point glitter. */
function Sparkle({ x, y, r = 4, color = '#FFFFFF', opacity = 1 }: { x: number; y: number; r?: number; color?: string; opacity?: number }) {
  return (
    <Path
      d={`M${x},${y - r} Q${x},${y} ${x + r},${y} Q${x},${y} ${x},${y + r} Q${x},${y} ${x - r},${y} Q${x},${y} ${x},${y - r} Z`}
      fill={color}
      opacity={opacity}
    />
  );
}

/** The old star fruit tree: broad leafy crown dotted with fruit. (x, y) = trunk base. */
function StarFruitTree({
  x,
  y,
  s = 1,
  c,
  seed = 3,
  count = 20,
}: {
  x: number;
  y: number;
  s?: number;
  c: SceneCtx;
  seed?: number;
  count?: number;
}) {
  const r = rng(seed);
  const fruit = Array.from({ length: count }, () => {
    const a = r() * Math.PI * 2;
    const d = 0.35 + 0.65 * Math.sqrt(r());
    return { fx: Math.cos(a) * 62 * d, fy: -96 + Math.sin(a) * 34 * d, rr: 5 + r() * 2.4, rot: r() * 72 };
  });
  const leaf = c.p.groundDeep;
  const leafMid = c.p.ground;
  const leafLight = '#A9CC6A';
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path
        d="M-11,0 C-8,-20 -13,-36 -6,-52 C-14,-60 -26,-62 -36,-70 L-31,-75 C-20,-67 -10,-64 -2,-58 C2,-66 4,-76 -1,-86 L6,-86 C10,-74 9,-62 6,-55 C14,-62 26,-67 35,-76 L40,-71 C29,-61 17,-55 8,-47 C6,-30 8,-15 13,0 Z"
        fill={TRUNK}
      />
      <Path d="M-4,-10 Q0,-26 -3,-40" stroke="#5E4430" strokeWidth={1.4} fill="none" opacity={0.6} />
      <Ellipse cx={0} cy={-90} rx={72} ry={36} fill={leaf} />
      <Ellipse cx={-46} cy={-76} rx={32} ry={22} fill={leaf} />
      <Ellipse cx={46} cy={-78} rx={34} ry={22} fill={leaf} />
      <Ellipse cx={-22} cy={-102} rx={42} ry={26} fill={leafMid} />
      <Ellipse cx={26} cy={-104} rx={40} ry={26} fill={leafMid} />
      <Ellipse cx={0} cy={-120} rx={34} ry={19} fill={leafMid} />
      <Ellipse cx={-30} cy={-112} rx={18} ry={8} fill={leafLight} />
      <Ellipse cx={18} cy={-124} rx={16} ry={7} fill={leafLight} />
      <Ellipse cx={46} cy={-94} rx={14} ry={6} fill={leafLight} />
      <Ellipse cx={-56} cy={-84} rx={11} ry={5} fill={leafLight} opacity={0.8} />
      {/* small pinnate leaflets at the crown edge */}
      {[-70, -54, 54, 70, -36, 36].map((lx, i) => (
        <G key={i}>
          <Ellipse cx={lx} cy={-66 + (i % 2) * 4} rx={5} ry={2.4} fill={leaf} transform={`rotate(${lx > 0 ? 30 : -30} ${lx} ${-66 + (i % 2) * 4})`} />
          <Ellipse cx={lx + (lx > 0 ? 6 : -6)} cy={-62 + (i % 2) * 4} rx={5} ry={2.4} fill={leaf} transform={`rotate(${lx > 0 ? 40 : -40} ${lx + (lx > 0 ? 6 : -6)} ${-62 + (i % 2) * 4})`} />
        </G>
      ))}
      {fruit.map((f, i) => (
        <G key={i}>
          <Path d={`M${f.fx},${f.fy - f.rr - 3} L${f.fx},${f.fy - f.rr + 1}`} stroke={leaf} strokeWidth={1} />
          <StarFruit x={f.fx} y={f.fy} r={f.rr} rot={f.rot} />
        </G>
      ))}
    </G>
  );
}

/**
 * The magic bird: big golden phoenix with rainbow-tipped plumes and a kind face.
 * Faces right; (x, y) = centre of its body. s = 1 spans about 160 units.
 */
function Phoenix({
  x,
  y,
  s = 1,
  flip = false,
  wing = 'up',
  headDown = false,
  worried = false,
  legs = false,
}: {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  wing?: 'up' | 'level' | 'fold';
  headDown?: boolean;
  worried?: boolean;
  legs?: boolean;
}) {
  const sx = -4;
  const sy = -10;
  const angles =
    wing === 'up' ? [-152, -139, -126, -113, -100] : wing === 'level' ? [-200, -188, -176, -164, -152] : [166, 173, 180, 187, 194];
  const lens = wing === 'fold' ? [34, 38, 42, 44, 46] : [52, 60, 64, 62, 54];
  const feathers = (dx: number, dy: number, base: string, tipOpacity: number) =>
    angles.map((deg, i) => {
      const a = (deg * Math.PI) / 180;
      const L = lens[i];
      const cx = sx + dx + (Math.cos(a) * L) / 2;
      const cy = sy + dy + (Math.sin(a) * L) / 2;
      const tx = sx + dx + Math.cos(a) * (L - 7);
      const ty = sy + dy + Math.sin(a) * (L - 7);
      return (
        <G key={i}>
          <Ellipse cx={cx} cy={cy} rx={L / 2} ry={6.6} fill={base} transform={`rotate(${deg} ${cx} ${cy})`} />
          <Ellipse cx={tx} cy={ty} rx={8.5} ry={5.4} fill={RAINBOW[i]} opacity={tipOpacity} transform={`rotate(${deg} ${tx} ${ty})`} />
        </G>
      );
    });
  const tails: Array<[number, number, string]> = [
    [-86, -24, RAINBOW[1]],
    [-104, -6, RAINBOW[0]],
    [-110, 14, RAINBOW[2]],
    [-96, 32, RAINBOW[4]],
  ];
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {/* long tail plumes with eye-spots */}
      {tails.map(([ex, ey, col], i) => (
        <G key={i}>
          <Path
            d={`M-20,-3 C-44,${ey * 0.3 - 7} ${ex * 0.7},${ey - 9} ${ex},${ey} C${ex * 0.7},${ey + 5} -44,${ey * 0.3 + 7} -18,6 Z`}
            fill={i % 2 ? GOLD_DEEP : GOLD}
          />
          <Circle cx={ex} cy={ey} r={6.4} fill={col} />
          <Circle cx={ex} cy={ey} r={3.2} fill={GOLD_LIGHT} />
          <Circle cx={ex} cy={ey} r={1.4} fill={col} />
        </G>
      ))}
      {/* far wing */}
      {wing !== 'fold' ? <G opacity={0.9}>{feathers(8, -3, '#C27E22', 0.7)}</G> : null}
      {legs ? (
        <G>
          <Path d="M-2,14 L-4,28 M8,14 L8,28" stroke="#E8873A" strokeWidth={2.6} strokeLinecap="round" />
          <Path d="M-9,29 L1,29 M3,29 L13,29" stroke="#E8873A" strokeWidth={2.2} strokeLinecap="round" />
        </G>
      ) : null}
      {/* body */}
      <Ellipse cx={0} cy={0} rx={28} ry={17} fill={GOLD} />
      <Ellipse cx={8} cy={5} rx={18} ry={10} fill={GOLD_LIGHT} />
      {/* near wing */}
      {feathers(0, 0, GOLD_DEEP, 1)}
      <Ellipse cx={sx - 4} cy={sy + 2} rx={17} ry={11} fill={GOLD} />
      <Path d={`M${sx - 16},${sy + 4} q4,5 8,0 q4,5 8,0 q4,5 8,0`} stroke={GOLD_LIGHT} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      {/* neck + head */}
      <G transform={headDown ? 'rotate(32 14 -4)' : undefined}>
        <Path d="M8,-6 C12,-22 20,-34 28,-38 L40,-32 C31,-25 27,-12 25,4 Z" fill={GOLD} />
        <Path d="M16,-12 C19,-22 23,-28 28,-31" stroke={GOLD_LIGHT} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.8} />
        {[
          ['M28,-46 C24,-60 15,-64 8,-62', RAINBOW[0]],
          ['M30,-47 C30,-62 24,-70 17,-71', RAINBOW[2]],
          ['M33,-46 C37,-58 35,-66 30,-70', RAINBOW[4]],
        ].map(([d, col], i) => {
          const end = (d as string).split(' ').pop()!.split(',');
          return (
            <G key={i}>
              <Path d={d as string} stroke={GOLD_DEEP} strokeWidth={2.6} fill="none" strokeLinecap="round" />
              <Circle cx={Number(end[0])} cy={Number(end[1])} r={3} fill={col as string} />
            </G>
          );
        })}
        <Circle cx={32} cy={-37} r={11.5} fill={GOLD} />
        <Path d="M42,-40 L52,-35.5 L42,-31 Z" fill="#E8873A" />
        <Path d="M42,-35.5 L50,-35.5" stroke="#B9652A" strokeWidth={0.8} />
        <Circle cx={35.5} cy={-39} r={2.8} fill="#3A2A1A" />
        <Circle cx={36.4} cy={-39.9} r={1} fill="#FFFFFF" />
        <Circle cx={36} cy={-32.5} r={2.8} fill="#F08A7A" opacity={0.5} />
        {worried ? (
          <G>
            <Path d="M31,-44.5 Q34,-46.5 39,-43.5" stroke="#8A5A1E" strokeWidth={1.3} fill="none" strokeLinecap="round" />
            <Path d="M24,-44 q-2,3 0,5 q2,-2 0,-5 Z" fill="#BFE6F0" />
          </G>
        ) : (
          <Path d="M32,-43.6 Q35,-45.4 38.5,-44" stroke="#B9782A" strokeWidth={1} fill="none" strokeLinecap="round" />
        )}
      </G>
    </G>
  );
}

function Younger({
  x,
  y,
  s = 1,
  pose = 'down',
  flip = false,
  sitting = false,
}: {
  x: number;
  y: number;
  s?: number;
  pose?: 'down' | 'up' | 'out' | 'hold' | 'wave';
  flip?: boolean;
  sitting?: boolean;
}) {
  const lift = sitting ? 12 : 0;
  return (
    <G>
      {/* nón lá slung on his back */}
      <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
        <Path d={`M-18,${-29 + lift} L-6,${-47 + lift} L5,${-33 + lift} Q-6,${-25 + lift} -18,${-29 + lift} Z`} fill={NONLA} />
        <Path d={`M-12,${-31 + lift} L-6,${-44 + lift}`} stroke="#C9B57A" strokeWidth={0.8} />
      </G>
      <Figure x={x} y={y} s={s} {...YOUNG} pose={pose} flip={flip} sitting={sitting} />
    </G>
  );
}

function Older({
  x,
  y,
  s = 1.06,
  pose = 'down',
  flip = false,
  sitting = false,
}: {
  x: number;
  y: number;
  s?: number;
  pose?: 'down' | 'up' | 'out' | 'hold' | 'wave';
  flip?: boolean;
  sitting?: boolean;
}) {
  const lift = sitting ? 12 : 0;
  return (
    <G>
      <Figure x={x} y={y} s={s} {...OLDER} pose={pose} flip={flip} sitting={sitting} />
      <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
        {/* gold sash and small mustache */}
        <Rect x={-9} y={-22 + lift} width={18} height={3} fill={GOLD} />
        <Path
          d={`M-2.5,${-46.2 + lift} Q0,${-48.4 + lift} 1.4,${-46.6 + lift} Q3,${-48.4 + lift} 5.6,${-46.2 + lift}`}
          stroke="#2A1A10"
          strokeWidth={1.3}
          fill="none"
          strokeLinecap="round"
        />
      </G>
    </G>
  );
}

/** Small cloth bag; `big` is the older brother's enormous sack. (x, y) = base centre. */
function ClothBag({ x, y, s = 1, big = false }: { x: number; y: number; s?: number; big?: boolean }) {
  const k = big ? 2.6 : 1;
  return (
    <G transform={`translate(${x},${y}) scale(${s * k})`}>
      <Path d="M-11,0 Q-15,-11 -7,-17 L7,-17 Q15,-11 11,0 Q0,3 -11,0 Z" fill={big ? '#B5674A' : '#C98F5E'} />
      <Path d="M-6,-17 Q-9,-22 -4,-23 L4,-23 Q9,-22 6,-17 Z" fill={big ? '#B5674A' : '#C98F5E'} />
      <Rect x={-7} y={-18.5} width={14} height={2.4} rx={1.2} fill="#6A4A2E" />
      <Path d="M-8,-6 Q0,-3 8,-6" stroke="#8A5A3A" strokeWidth={0.8} fill="none" opacity={0.6} />
      <Circle cx={-2} cy={-23} r={2} fill={GOLD} />
      <Circle cx={2.5} cy={-23.5} r={1.6} fill={GOLD_LIGHT} />
    </G>
  );
}

/** The little island that glitters with gold. (x, y) = waterline centre. */
function GoldIsland({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const r = rng(51);
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={2} rx={66} ry={8} fill="#8FDCD2" opacity={0.7} />
      <Path d="M-60,2 Q-40,-22 -10,-26 Q24,-30 44,-14 Q58,-6 62,2 Z" fill="#E8C978" />
      <Path d="M-34,-12 Q-16,-30 6,-30 Q26,-28 34,-12 Q0,-6 -34,-12 Z" fill={GOLD} />
      <Path d="M-20,-22 Q-4,-38 14,-26 Q0,-20 -20,-22 Z" fill={GOLD_LIGHT} />
      {Array.from({ length: 14 }, (_, i) => (
        <Ellipse key={i} cx={-40 + r() * 80} cy={-6 - r() * 18} rx={3 + r() * 2} ry={2 + r()} fill={i % 2 ? GOLD_DEEP : GOLD_LIGHT} />
      ))}
      <Sparkle x={-12} y={-40} r={6} />
      <Sparkle x={22} y={-36} r={4.5} />
      <Sparkle x={40} y={-18} r={3.5} />
      <Sparkle x={-36} y={-20} r={3.5} />
    </G>
  );
}

/** The older brother's big house with a curved terracotta tile roof. */
function TiledHouse({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-50} y={-4} width={100} height={4} fill="#9A7A5A" />
      <Rect x={-44} y={-34} width={88} height={30} fill="#F1E2C2" />
      {[-40, -16, 16, 40].map((px) => (
        <Rect key={px} x={px - 2} y={-34} width={4} height={30} fill="#7A4A2E" />
      ))}
      <Rect x={-9} y={-28} width={18} height={24} fill="#8A4E2E" />
      <Rect x={-9} y={-28} width={18} height={2} fill={GOLD} />
      <Circle cx={-28} cy={-20} r={6} fill="#8A4E2E" />
      <Circle cx={28} cy={-20} r={6} fill="#8A4E2E" />
      <Path d="M-34,-20 L-22,-20 M-28,-26 L-28,-14 M22,-20 L34,-20 M28,-26 L28,-14" stroke="#E2C9A0" strokeWidth={1} />
      <Path d="M-64,-30 Q-66,-38 -72,-41 Q-44,-38 -40,-62 L40,-62 Q44,-38 72,-41 Q66,-38 64,-30 Z" fill="#C2553A" />
      {Array.from({ length: 13 }, (_, i) => {
        const tx = -54 + i * 9;
        return <Path key={i} d={`M${tx},-33 Q${tx + 1},-46 ${tx * 0.75},-60`} stroke="#A0412C" strokeWidth={1.2} fill="none" opacity={0.7} />;
      })}
      <Rect x={-44} y={-66} width={88} height={5} rx={2.5} fill="#A0412C" />
      <Path d="M-44,-63 Q-52,-66 -50,-72 M44,-63 Q52,-66 50,-72" stroke="#A0412C" strokeWidth={3} fill="none" strokeLinecap="round" />
    </G>
  );
}

function WateringCan({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-6} y={-8} width={12} height={10} rx={2} fill="#6E8F9A" />
      <Path d="M6,-4 L16,-12" stroke="#6E8F9A" strokeWidth={2.4} strokeLinecap="round" />
      <Path d="M-6,-6 Q-11,-10 -6,-12" stroke="#6E8F9A" strokeWidth={1.6} fill="none" />
    </G>
  );
}

function Basket({ x, y, s = 1, seed = 5 }: { x: number; y: number; s?: number; seed?: number }) {
  const r = rng(seed);
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {Array.from({ length: 6 }, (_, i) => (
        <StarFruit key={i} x={-12 + i * 5 + r() * 2} y={-12 - (i % 2) * 4} r={5} rot={r() * 72} />
      ))}
      <Path d="M-16,-10 L16,-10 Q14,0 0,1 Q-14,0 -16,-10 Z" fill="#B88A4E" />
      <Path d="M-15,-6 L15,-6 M-13,-2 L13,-2" stroke="#8A6234" strokeWidth={1} />
      <Path d="M-14,-10 Q0,-26 14,-10" stroke="#8A6234" strokeWidth={1.6} fill="none" />
    </G>
  );
}

function Fence({ x, y, w, h = 24, s = 1 }: { x: number; y: number; w: number; h?: number; s?: number }) {
  const posts = Math.floor(w / 9);
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {Array.from({ length: posts + 1 }, (_, i) => (
        <Rect key={i} x={i * 9 - 1.6} y={-h} width={3.2} height={h} rx={1.2} fill="#B08A5A" />
      ))}
      <Rect x={-2} y={-h * 0.75} width={w + 4} height={2.6} fill="#9A744A" />
      <Rect x={-2} y={-h * 0.33} width={w + 4} height={2.6} fill="#9A744A" />
    </G>
  );
}

function SeaSparkles({ c, y, seed, count = 8 }: { c: SceneCtx; y: number; seed: number; count?: number }) {
  const r = rng(seed);
  return (
    <G>
      {Array.from({ length: count }, (_, i) => (
        <Sparkle key={i} x={r() * c.W} y={y + r() * (c.H - y - 6)} r={2 + r() * 2.4} color="#FFFFFF" opacity={0.6 + r() * 0.4} />
      ))}
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top={c.p.sky} mid="#CFE3BE" bottom={c.p.skyLow} />
    <Glow c={c} name="sun" cx={292} cy={70} r={110} color={c.p.glow} opacity={0.7} />
    <Sun cx={292} cy={70} r={22} color="#FFF3C4" rays={c.p.glow} />
    <Cloud x={70} y={76} s={1.1} color="#FFFFFF" opacity={0.85} />
    <Cloud x={312} y={150} s={0.7} color="#FFFFFF" opacity={0.7} />
    {/* turquoise sea glimpsed beyond the garden */}
    <Rect x={0} y={232} width={c.W} height={20} fill={SEA_TOP} />
    <SeaSparkles c={{ ...c, H: 250 }} y={234} seed={8} count={6} />
    <Ridge c={c} y={258} amp={12} seed={4} color={c.p.ground} />
    <Hut x={306} y={290} s={0.7} wall="#E2C99A" roof="#B8955A" door="#6A4A2E" />
    <Glow c={c} name="tree" cx={180} cy={170} r={140} color={c.p.glow} opacity={0.45} />
    <StarFruitTree x={186} y={318} s={1.55} c={c} seed={12} count={26} />
    <Phoenix x={196} y={150} s={0.95} wing="up" legs />
    <Ridge c={c} y={318} amp={8} seed={9} color={c.p.groundDeep} />
    <Grass c={c} y={322} seed={14} color="#3F6A2A" count={16} />
    <Younger x={104} y={338} s={1.1} pose="wave" />
    {[[138, 334], [244, 338], [262, 330]].map(([fx, fy], i) => (
      <StarFruit key={i} x={fx} y={fy} r={5} rot={i * 20} />
    ))}
    <Finish c={c} vignette={0.2} />
  </G>
);

const pages = [
  // 1 — big tiled house and rice fields (older) vs. tiny thatched hut and one star fruit tree (younger)
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Sun cx={182} cy={44} r={14} color="#FFF3C4" rays={c.p.glow} />
      <Cloud x={70} y={54} s={0.9} color="#FFFFFF" opacity={0.85} />
      <Cloud x={300} y={64} s={0.7} color="#FFFFFF" opacity={0.7} />
      <Ridge c={c} y={146} amp={14} seed={5} color="#A9C98A" />
      <Paddies c={c} y={170} color={c.p.ground} line={c.p.groundDeep} rows={4} />
      <TiledHouse x={104} y={178} s={0.95} />
      {/* dusty path dividing the two homes */}
      <Path d="M168,240 Q178,206 186,170 L196,170 Q196,206 214,240 Z" fill="#E8D49A" />
      <Ridge c={c} y={184} amp={6} seed={11} color={c.p.groundDeep} opacity={0.35} />
      <StarFruitTree x={312} y={200} s={0.62} c={c} seed={21} count={12} />
      <Hut x={262} y={192} s={0.7} wall="#E2C99A" roof="#B8955A" door="#6A4A2E" />
      <Older x={134} y={214} s={1.08} pose="out" />
      <Younger x={214} y={216} s={0.98} pose="wave" flip />
      <Grass c={c} y={200} seed={3} color={c.p.groundDeep} count={10} />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 2 — watering the tree; golden fruit everywhere as the great bird swoops in to land
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#B7E2DC" bottom={c.p.skyLow} />
      <Glow c={c} name="morning" cx={70} cy={60} r={90} color={c.p.glow} opacity={0.6} />
      <Cloud x={300} y={40} s={0.7} color="#FFFFFF" opacity={0.8} />
      <Ridge c={c} y={176} amp={10} seed={7} color={c.p.ground} />
      <StarFruitTree x={228} y={204} s={1.0} c={c} seed={33} count={22} />
      <Phoenix x={112} y={70} s={0.62} wing="up" flip={false} />
      <Rect x={0} y={200} width={c.W} height={44} fill={c.p.groundDeep} />
      <Ellipse cx={226} cy={206} rx={26} ry={5} fill="#5E4430" opacity={0.5} />
      <Younger x={160} y={218} s={0.98} pose="out" />
      <WateringCan x={180} y={186} s={1} />
      {[0, 1, 2].map((i) => (
        <Path key={i} d={`M${196 + i * 2},${176 + i * 2} q4,8 2,16`} stroke="#9FD8E8" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      ))}
      {[[256, 214], [276, 220], [204, 222]].map(([fx, fy], i) => (
        <StarFruit key={i} x={fx} y={fy} r={5} rot={i * 25} />
      ))}
      <Grass c={c} y={206} seed={8} color="#3F6A2A" count={10} />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 3 — close-up: the brother speaks politely; the bird bends its head kindly toward him
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom="#E9EDB8" />
      <Glow c={c} name="halo" cx={140} cy={110} r={120} color={c.p.glow} opacity={0.55} />
      {/* overhanging branch of the star fruit tree */}
      <Path d="M-10,34 Q100,10 210,28" stroke={TRUNK} strokeWidth={7} fill="none" strokeLinecap="round" />
      <Ellipse cx={40} cy={18} rx={70} ry={26} fill={c.p.groundDeep} />
      <Ellipse cx={170} cy={14} rx={70} ry={22} fill={c.p.ground} />
      <Ellipse cx={300} cy={10} rx={80} ry={24} fill={c.p.groundDeep} />
      {[[60, 34], [104, 30], [150, 30], [230, 26], [276, 30]].map(([fx, fy], i) => (
        <StarFruit key={i} x={fx} y={fy} r={6.5} rot={i * 17} />
      ))}
      <Ridge c={c} y={194} amp={8} seed={13} color={c.p.ground} />
      <Rect x={0} y={206} width={c.W} height={40} fill={c.p.groundDeep} />
      <Phoenix x={146} y={150} s={1.25} wing="fold" headDown legs />
      <Younger x={250} y={216} s={1.18} pose="hold" flip />
      <Grass c={c} y={210} seed={6} color="#3F6A2A" count={8} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 4 — riding the bird across the turquoise sea toward the glittering gold island, small bag in hand
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom="#E6F2D8" />
      <Cloud x={60} y={46} s={0.9} color="#FFFFFF" opacity={0.85} />
      <Cloud x={250} y={36} s={0.6} color="#FFFFFF" opacity={0.7} />
      <Water c={c} y={150} top={SEA_TOP} bottom={SEA_DEEP} shimmer="#E9FBF6" name="sea" seed={41} />
      <SeaSparkles c={c} y={154} seed={42} count={10} />
      <Glow c={c} name="gold" cx={286} cy={146} r={60} color={c.p.glow} opacity={0.8} />
      <GoldIsland x={290} y={156} s={0.8} />
      <Phoenix x={164} y={104} s={1.0} wing="up" />
      <Younger x={156} y={100} s={0.72} sitting pose="hold" />
      <ClothBag x={169} y={95} s={0.65} />
      {[[100, 60], [82, 74]].map(([bx, by], i) => (
        <Path key={i} d={`M${bx},${by} q8,-4 16,0`} stroke="#FFFFFF" strokeWidth={1.4} fill="none" opacity={0.7} strokeLinecap="round" />
      ))}
      <Finish c={c} vignette={0.16} />
    </G>
  ),
  // 5 — sharing rice with neighbours at his cosy new home; the older brother peeks over the fence
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Sun cx={300} cy={44} r={13} color="#FFF3C4" rays={c.p.glow} />
      <Ridge c={c} y={160} amp={12} seed={15} color="#A9C98A" />
      <StarFruitTree x={54} y={196} s={0.66} c={c} seed={55} count={12} />
      {/* the cosy new home: warm walls, fresh golden thatch */}
      <Hut x={132} y={192} s={1.05} wall="#F4DDB0" roof="#E2B04E" door="#8A5A3A" />
      <Rect x={0} y={190} width={c.W} height={54} fill={c.p.ground} />
      <Grass c={c} y={196} seed={16} color={c.p.groundDeep} count={10} />
      {/* rice sacks */}
      <Path d="M150,214 Q146,200 154,196 L164,196 Q172,200 168,214 Z" fill="#EADBB8" />
      <Path d="M126,214 Q122,202 130,198 L138,198 Q146,202 142,214 Z" fill="#EADBB8" />
      <Younger x={180} y={218} s={0.98} pose="out" />
      <Figure x={214} y={218} s={0.94} top="#5E8C7A" bottom="#3A4A3A" hairStyle="bun" hat="nonla" hatColor={NONLA} pose="out" flip />
      <Figure x={240} y={220} s={0.64} top="#D9785A" bottom="#5E4430" hairStyle="topknot" pose="hold" flip />
      <ClothBag x={232} y={204} s={0.55} />
      {/* older brother peeking from behind the fence */}
      <Older x={306} y={234} s={1.06} pose="hold" flip />
      <Fence x={268} y={232} w={92} h={42} />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 6 — on the gold island the older brother stuffs an enormous bag; the bird looks worried
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#AEDFD8" bottom="#F6E6B4" />
      <Glow c={c} name="gold" cx={210} cy={170} r={130} color={c.p.glow} opacity={0.7} />
      <Water c={c} y={150} top={SEA_TOP} bottom={SEA_DEEP} shimmer="#E9FBF6" name="sea" seed={61} />
      <Path d="M-20,250 L-20,196 Q60,160 180,158 Q300,160 380,196 L380,250 Z" fill="#E8C978" />
      <Path d="M150,196 Q190,150 250,156 Q300,166 312,196 Q240,206 150,196 Z" fill={GOLD} />
      <Path d="M184,176 Q214,148 252,166 Q220,174 184,176 Z" fill={GOLD_LIGHT} />
      {Array.from({ length: 12 }, (_, i) => (
        <Ellipse key={i} cx={164 + ((i * 37) % 140)} cy={180 + ((i * 13) % 20)} rx={4} ry={2.4} fill={i % 2 ? GOLD_DEEP : GOLD_LIGHT} />
      ))}
      <Phoenix x={92} y={170} s={0.92} wing="fold" worried legs />
      <ClothBag x={232} y={212} s={1.1} big />
      <Older x={278} y={218} s={1.1} pose="hold" flip />
      <Sparkle x={210} y={148} r={6} />
      <Sparkle x={300} y={160} r={4} />
      <Sparkle x={170} y={160} r={3.6} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 7 — high over the calm sea: he opens his hands and the gold drifts gently down; the bird flies on steadily
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#8FCBD0" mid="#CFE6CF" bottom="#F6DFA6" />
      <Glow c={c} name="sun" cx={300} cy={190} r={110} color={c.p.glow} opacity={0.7} />
      <Sun cx={300} cy={186} r={18} color="#FFE7A8" />
      <Cloud x={70} y={50} s={0.8} color="#FFFFFF" opacity={0.8} />
      <Cloud x={240} y={40} s={0.6} color="#FFFFFF" opacity={0.7} />
      <WaveBand c={c} y={190} amp={3} len={50} color={SEA_TOP} />
      <WaveBand c={c} y={206} amp={3} len={44} phase={18} color={SEA_DEEP} opacity={0.6} />
      <SeaSparkles c={c} y={194} seed={71} count={8} />
      <Phoenix x={190} y={90} s={1.0} wing="level" />
      <Older x={182} y={86} s={0.72} sitting pose="out" />
      {/* gold pieces drifting down, with soft rings where they meet the sea */}
      {[[150, 112], [162, 132], [146, 152], [170, 168], [156, 182]].map(([gx, gy], i) => (
        <G key={i}>
          <Ellipse cx={gx} cy={gy} rx={3.4} ry={2.2} fill={GOLD} transform={`rotate(${i * 30} ${gx} ${gy})`} />
          <Sparkle x={gx + 5} y={gy - 4} r={2.4} color={GOLD_LIGHT} />
        </G>
      ))}
      <Ellipse cx={152} cy={198} rx={14} ry={3} stroke="#FFFFFF" strokeWidth={1} fill="none" opacity={0.7} />
      <Ellipse cx={172} cy={204} rx={9} ry={2} stroke="#FFFFFF" strokeWidth={1} fill="none" opacity={0.5} />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 8 — at sunset both brothers pick star fruit together; the bird rests on a branch
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#9FC9C8" mid="#F6D29A" bottom="#F3A97A" />
      <Glow c={c} name="sunset" cx={180} cy={190} r={160} color={c.p.glow} opacity={0.6} />
      <Sun cx={60} cy={150} r={20} color="#FFD98A" />
      <Ridge c={c} y={164} amp={10} seed={81} color="#C9A86A" opacity={0.7} />
      <Paddies c={c} y={184} color="#9AAE58" line={c.p.groundDeep} rows={3} />
      <StarFruitTree x={188} y={212} s={1.18} c={c} seed={88} count={22} />
      <Phoenix x={252} y={88} s={0.48} wing="fold" legs flip />
      <Rect x={0} y={206} width={c.W} height={40} fill={c.p.groundDeep} />
      <Older x={138} y={222} s={1.06} pose="up" />
      <Younger x={238} y={222} s={0.98} pose="up" flip />
      <Basket x={188} y={224} s={1.1} seed={9} />
      <Grass c={c} y={212} seed={18} color="#3A5E28" count={8} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
];

export const CAY_KHE: StoryScenes = { cover, pages };
