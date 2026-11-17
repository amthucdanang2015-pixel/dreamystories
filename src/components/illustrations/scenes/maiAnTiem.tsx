// Mai An Tiêm — sunny resilience on a faraway island.
// Signature: wide cerulean sea glittering under a tropical sun, pale sand,
// coconut palms and a driftwood hut, white seabirds, and big striped
// watermelons with bright red flesh (the accent) — bookended by the palace garden.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Boat,
  Cloud,
  Figure,
  Finish,
  Glow,
  Lotus,
  Palm,
  Pavilion,
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

const TIEM = { top: '#8A5A36', bottom: '#4E3A2A', hairStyle: 'short' as const, skin: '#D9A27A' };
const HEADBAND = '#D94A3D';
const WIFE = { top: '#9CC8E6', bottom: '#3E5A78', hairStyle: 'braid' as const, dress: true, skin: '#E8B98F' };
const BOY = { top: '#E8C95A', bottom: '#7A5A3A', hairStyle: 'topknot' as const, skin: '#DDA67E' };
const GIRL = { top: '#F09A84', bottom: '#7A5A3A', hairStyle: 'bob' as const, dress: true, skin: '#E8B98F' };
const KING = { top: '#E8B83A', bottom: '#C9952A', hair: '#CFCFCF', hairStyle: 'short' as const, hat: 'crown' as const, hatColor: '#F2D06A', beard: '#EDEDED', dress: true };
const MELON_DARK = '#2F6B34';
const MELON_LIGHT = '#8CC46A';
const FLESH = '#E8473C';
const SEA_TOP = '#4FB3DE';
const SEA_DEEP = '#2A86BE';
const PALM_TRUNK = '#9A7650';
const PALM_LEAF = '#4E9A54';
const DRIFT = '#A89A86';

type Pose = 'down' | 'up' | 'out' | 'hold' | 'wave';

// ─── Local helpers ────────────────────────────────────────────

/** Whole striped watermelon. (x, y) = centre. */
function Melon({ x, y, r = 12, rot = 0 }: { x: number; y: number; r?: number; rot?: number }) {
  const rx = r * 1.15;
  return (
    <G transform={`translate(${x},${y}) rotate(${rot})`}>
      <Ellipse cx={0} cy={r * 0.85} rx={rx * 0.9} ry={r * 0.18} fill="#000000" opacity={0.12} />
      <Ellipse cx={0} cy={0} rx={rx} ry={r} fill={MELON_LIGHT} />
      {[-0.66, -0.22, 0.22, 0.66].map((t, i) => (
        <Path
          key={i}
          d={`M${t * rx * 0.7},${-r * 0.96} Q${t * rx * 1.25 + 2},${-r * 0.5} ${t * rx * 1.2 - 2},0 Q${t * rx * 1.25 + 2},${r * 0.5} ${t * rx * 0.7},${r * 0.96}`}
          stroke={MELON_DARK}
          strokeWidth={r * 0.26}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <Ellipse cx={-rx * 0.35} cy={-r * 0.45} rx={rx * 0.28} ry={r * 0.16} fill="#FFFFFF" opacity={0.3} />
      <Path d={`M0,${-r} q2,-4 6,-4 q2,2 -1,4`} stroke="#5E7A3A" strokeWidth={1.4} fill="none" strokeLinecap="round" />
    </G>
  );
}

/** Half a watermelon, cut face towards the viewer. (x, y) = centre of the cut. */
function MelonHalf({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  const seeds: Array<[number, number]> = [[-0.5, 0.2], [-0.2, 0.45], [0.15, 0.25], [0.45, 0.4], [-0.05, 0.62], [0.3, 0.65], [-0.4, 0.55]];
  return (
    <G transform={`translate(${x},${y})`}>
      <Ellipse cx={0} cy={r * 0.95} rx={r * 1.1} ry={r * 0.16} fill="#000000" opacity={0.12} />
      <Path d={`M${-r},0 A${r},${r} 0 0 0 ${r},0 Z`} fill={MELON_DARK} />
      <Path d={`M${-r * 0.9},0 A${r * 0.9},${r * 0.9} 0 0 0 ${r * 0.9},0 Z`} fill="#E9F2D2" />
      <Path d={`M${-r * 0.8},0 A${r * 0.8},${r * 0.8} 0 0 0 ${r * 0.8},0 Z`} fill={FLESH} />
      <Ellipse cx={0} cy={0} rx={r} ry={r * 0.22} fill={MELON_DARK} />
      <Ellipse cx={0} cy={0} rx={r * 0.9} ry={r * 0.19} fill="#E9F2D2" />
      <Ellipse cx={0} cy={0} rx={r * 0.8} ry={r * 0.16} fill="#F2645A" />
      {seeds.map(([sx, sy], i) => (
        <Ellipse key={i} cx={sx * r} cy={sy * r * (sy > 0.3 ? 1 : 0.3)} rx={r * 0.05} ry={r * 0.08} fill="#1E1A18" />
      ))}
    </G>
  );
}

/** A wedge slice of watermelon. (x, y) = rind centre. */
function Slice({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Path d="M-10,0 Q0,4 10,0 L0,-16 Z" fill={FLESH} />
      <Path d="M-10,0 Q0,4 10,0" stroke={MELON_DARK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <Path d="M-8.5,-1 Q0,2 8.5,-1" stroke="#E9F2D2" strokeWidth={1} fill="none" />
      <Ellipse cx={-3} cy={-6} rx={0.8} ry={1.3} fill="#1E1A18" />
      <Ellipse cx={3} cy={-6} rx={0.8} ry={1.3} fill="#1E1A18" />
      <Ellipse cx={0} cy={-10} rx={0.8} ry={1.3} fill="#1E1A18" />
    </G>
  );
}

function Leaf({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Path d="M0,0 Q-8,-4 -7,-11 Q-3,-9 -1,-13 Q2,-9 6,-11 Q8,-4 0,0 Z" fill="#3E8A42" />
      <Path d="M0,0 L0,-10" stroke="#2F6B34" strokeWidth={0.8} />
    </G>
  );
}

/** Long sprawling watermelon vine through points, with leaves and curly tendrils. */
function Vine({ pts, seed = 1 }: { pts: Array<[number, number]>; seed?: number }) {
  const r = rng(seed);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    d += ` Q${(px + x) / 2},${Math.min(py, y) - 8} ${x},${y}`;
  }
  return (
    <G>
      <Path d={d} stroke="#4E8A3A" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <G key={i}>
          <Leaf x={x} y={y} s={1 + r() * 0.4} rot={-30 + r() * 60} />
          {i % 2 ? <Path d={`M${x},${y} q6,-4 4,-9 q-3,-1 -2,2`} stroke="#6FAE4A" strokeWidth={1} fill="none" strokeLinecap="round" /> : null}
        </G>
      ))}
    </G>
  );
}

function Sprout({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={0.5} rx={6} ry={1.6} fill="#B8935E" />
      <Path d="M0,0 L0,-7" stroke="#5E9A3A" strokeWidth={1.4} />
      <Path d="M0,-6 Q-6,-10 -7,-6 Q-4,-4 0,-6 Z M0,-6 Q6,-10 7,-6 Q4,-4 0,-6 Z" fill="#6FB54A" />
    </G>
  );
}

/** White seabird. (x, y) = body centre. */
function Gull({ x, y, s = 1, flip = false, up = true }: { x: number; y: number; s?: number; flip?: boolean; up?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {up ? (
        <Path d="M-2,-1 Q-10,-14 -22,-12 Q-12,-8 -6,2 Z M2,-1 Q10,-16 22,-14 Q12,-8 6,2 Z" fill="#FFFFFF" />
      ) : (
        <Path d="M-2,0 Q-12,2 -22,8 Q-10,8 -4,3 Z M2,0 Q12,2 22,8 Q10,8 4,3 Z" fill="#FFFFFF" />
      )}
      {up ? <Path d="M-22,-12 Q-18,-12 -16,-10 M22,-14 Q18,-13 16,-11" stroke="#6A7A88" strokeWidth={2} strokeLinecap="round" /> : null}
      <Ellipse cx={0} cy={0} rx={9} ry={4} fill="#FFFFFF" />
      <Circle cx={8} cy={-1.5} r={3.6} fill="#FFFFFF" />
      <Path d="M11,-1.5 L15,-0.5 L11,0.6 Z" fill="#F2B24A" />
      <Circle cx={9} cy={-2.4} r={0.8} fill="#1E1A18" />
      <Path d="M-9,0 L-13,-2 L-13,2 Z" fill="#E2E8EE" />
    </G>
  );
}

function Seed({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <Ellipse cx={x} cy={y} rx={1.5 * s} ry={2.3 * s} fill="#1E1A18" />;
}

function Sparkle({ x, y, r = 3, color = '#FFFFFF', opacity = 0.9 }: { x: number; y: number; r?: number; color?: string; opacity?: number }) {
  return (
    <Path
      d={`M${x},${y - r} Q${x},${y} ${x + r},${y} Q${x},${y} ${x},${y + r} Q${x},${y} ${x - r},${y} Q${x},${y} ${x},${y - r} Z`}
      fill={color}
      opacity={opacity}
    />
  );
}

function SeaSparkles({ c, y, y2, seed, count = 8 }: { c: SceneCtx; y: number; y2?: number; seed: number; count?: number }) {
  const r = rng(seed);
  const bottom = y2 ?? c.H - 6;
  return (
    <G>
      {Array.from({ length: count }, (_, i) => (
        <Sparkle key={i} x={r() * c.W} y={y + r() * (bottom - y)} r={1.8 + r() * 2.4} opacity={0.55 + r() * 0.4} />
      ))}
    </G>
  );
}

function Rocks({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-22,0 Q-24,-14 -12,-18 Q-2,-20 2,-10 Q4,0 -22,0 Z" fill="#8E8A80" />
      <Path d="M-2,0 Q0,-24 14,-26 Q28,-24 28,0 Z" fill="#A39E92" />
      <Path d="M6,-18 Q14,-24 22,-20" stroke="#C4BFB2" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M24,0 Q26,-8 32,-8 Q38,-6 38,0 Z" fill="#7E7A70" />
    </G>
  );
}

function Shell({ x, y, s = 1, color = '#F6C9B8' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-4,0 Q-5,-5 0,-6 Q5,-5 4,0 Z" fill={color} />
      <Path d="M-2,0 L-1,-5 M0,0 L0,-6 M2,0 L1,-5" stroke="#D99A8A" strokeWidth={0.6} />
    </G>
  );
}

/** Driftwood hut with a palm-frond roof. `building` leaves it half-finished. (x, y) = ground centre. */
function DriftHut({ x, y, s = 1, building = false }: { x: number; y: number; s?: number; building?: boolean }) {
  const planks = building ? 3 : 6;
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-28} y={-34} width={4} height={34} fill="#7E6E5A" />
      <Rect x={24} y={-34} width={4} height={34} fill="#7E6E5A" />
      {Array.from({ length: planks }, (_, i) => (
        <Rect key={i} x={-30 + (i % 2) * 3} y={-6 - i * 5.4} width={58 - (i % 2) * 4} height={4.6} rx={2.3} fill={i % 2 ? DRIFT : '#B8AC98'} />
      ))}
      {building ? null : (
        <G>
          <Rect x={-6} y={-22} width={12} height={22} fill="#5E4E3E" />
          <Path d="M-40,-30 Q-20,-52 0,-54 Q20,-52 40,-30 Q0,-36 -40,-30 Z" fill="#C9A85E" />
          {[-30, -18, -6, 6, 18, 30].map((fx, i) => (
            <Path key={i} d={`M${fx * 0.4},-52 Q${fx * 0.8},-42 ${fx + (fx > 0 ? 4 : -4)},-30`} stroke="#A8883E" strokeWidth={1.4} fill="none" />
          ))}
          <Path d="M-36,-34 Q-20,-48 0,-50 Q20,-48 36,-34" stroke={PALM_LEAF} strokeWidth={3} fill="none" opacity={0.7} />
        </G>
      )}
    </G>
  );
}

/** Trading boat with a battened sail, rice sacks and rolls of cloth. (x, y) = waterline centre. */
function TradeBoat({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-46,-12 Q-40,4 -20,6 L24,6 Q42,4 50,-14 Q30,-8 0,-8 Q-30,-8 -46,-12 Z" fill="#8A5A36" />
      <Path d="M-44,-10 Q0,-4 48,-12" stroke="#B87A4A" strokeWidth={2} fill="none" />
      <Rect x={-2} y={-78} width={3} height={70} fill="#6A4A2E" />
      <Path d="M2,-76 Q34,-60 34,-14 L2,-14 Z" fill="#E9C99A" />
      {[-62, -50, -38, -26].map((sy) => (
        <Path key={sy} d={`M2,${sy} Q${18 + (sy + 76) * 0.2},${sy + 2} ${30 + (sy + 76) * 0.06},${sy + 4}`} stroke="#B89A6A" strokeWidth={1.4} fill="none" />
      ))}
      {/* sacks of rice */}
      <Path d="M-36,-10 Q-38,-22 -30,-24 L-22,-24 Q-16,-22 -18,-10 Z" fill="#EADBB8" />
      <Path d="M-20,-10 Q-22,-20 -14,-22 L-8,-22 Q-2,-20 -4,-10 Z" fill="#E2CFA4" />
      {/* rolls of cloth */}
      <Rect x={10} y={-20} width={20} height={6} rx={3} fill="#D94A3D" />
      <Rect x={12} y={-26} width={18} height={6} rx={3} fill="#4F8FC4" />
      <Rect x={14} y={-32} width={14} height={6} rx={3} fill="#F2C26A" />
      <Path d="M2,-78 L14,-82 L2,-86 Z" fill="#D94A3D" />
    </G>
  );
}

function Hoe({ x, y, s = 1, rot = -20 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Path d="M0,0 L0,-44" stroke="#8A5A36" strokeWidth={2.4} strokeLinecap="round" />
      <Path d="M-1,-44 L10,-44 L12,-36 L1,-40 Z" fill="#8E949C" />
    </G>
  );
}

function MelonBasket({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Melon x={-9} y={-14} r={8} rot={-10} />
      <Melon x={8} y={-15} r={8.5} rot={12} />
      <Melon x={0} y={-22} r={7.5} />
      <Path d="M-20,-12 L20,-12 Q18,1 0,2 Q-18,1 -20,-12 Z" fill="#B88A4E" />
      <Path d="M-19,-8 L19,-8 M-17,-3 L17,-3" stroke="#8A6234" strokeWidth={1} />
    </G>
  );
}

function Tiem({ x, y, s = 1, pose = 'down', flip = false, sitting = false }: { x: number; y: number; s?: number; pose?: Pose; flip?: boolean; sitting?: boolean }) {
  const lift = sitting ? 12 : 0;
  return (
    <G>
      <Figure x={x} y={y} s={s} {...TIEM} pose={pose} flip={flip} sitting={sitting} />
      {/* red headband with knotted tails */}
      <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
        <Path d={`M-8.4,${-54.5 + lift} Q0,${-57.5 + lift} 8.4,${-54.5 + lift}`} stroke={HEADBAND} strokeWidth={2.6} fill="none" />
        <Path d={`M-8,${-54.5 + lift} l-5,3 M-8,${-54.5 + lift} l-4,6`} stroke={HEADBAND} strokeWidth={1.6} strokeLinecap="round" />
      </G>
    </G>
  );
}
function Wife({ x, y, s = 0.94, pose = 'down', flip = false, sitting = false }: { x: number; y: number; s?: number; pose?: Pose; flip?: boolean; sitting?: boolean }) {
  return <Figure x={x} y={y} s={s} {...WIFE} pose={pose} flip={flip} sitting={sitting} />;
}
function Boy({ x, y, s = 0.62, pose = 'down', flip = false, sitting = false }: { x: number; y: number; s?: number; pose?: Pose; flip?: boolean; sitting?: boolean }) {
  return <Figure x={x} y={y} s={s} {...BOY} pose={pose} flip={flip} sitting={sitting} />;
}
function Girl({ x, y, s = 0.58, pose = 'down', flip = false, sitting = false }: { x: number; y: number; s?: number; pose?: Pose; flip?: boolean; sitting?: boolean }) {
  return <Figure x={x} y={y} s={s} {...GIRL} pose={pose} flip={flip} sitting={sitting} />;
}

/** Sandy shore across the canvas from y, with a wet edge. */
function Beach({ c, y, seed = 2 }: { c: SceneCtx; y: number; seed?: number }) {
  return (
    <G>
      <Ridge c={c} y={y + 4} amp={6} seed={seed} color="#F6EEDC" opacity={0.9} />
      <Ridge c={c} y={y + 8} amp={6} seed={seed} color={c.p.ground} />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top={c.p.sky} mid="#BFE3EE" bottom={c.p.skyLow} />
    <Glow c={c} name="sun" cx={290} cy={74} r={120} color={c.p.glow} opacity={0.7} />
    <Sun cx={290} cy={74} r={24} color="#FFF0C2" rays={c.p.glow} />
    <Cloud x={84} y={86} s={1.1} color="#FFFFFF" opacity={0.85} />
    <Water c={c} y={182} top={SEA_TOP} bottom={SEA_DEEP} shimmer="#E8F8FF" name="sea" seed={3} />
    <SeaSparkles c={c} y={186} y2={236} seed={4} count={10} />
    <Gull x={150} y={70} s={1.1} />
    <Gull x={196} y={50} s={0.8} up={false} flip />
    <Gull x={236} y={112} s={0.7} />
    <Path d="M-20,370 L-20,250 Q90,222 180,226 Q280,230 380,254 L380,370 Z" fill="#F6EEDC" />
    <Path d="M-20,370 L-20,258 Q90,232 180,236 Q280,240 380,262 L380,370 Z" fill={c.p.ground} />
    <Palm x={40} y={290} s={1.5} trunk={PALM_TRUNK} leaf={PALM_LEAF} kind="coconut" lean={14} />
    <Palm x={330} y={286} s={1.3} trunk={PALM_TRUNK} leaf="#3E8A48" kind="coconut" lean={-12} />
    {/* pile of melons with one cut open */}
    <Melon x={170} y={300} r={20} />
    <Melon x={206} y={304} r={18} rot={14} />
    <Melon x={188} y={276} r={17} rot={-8} />
    <Melon x={146} y={314} r={14} rot={10} />
    <MelonHalf x={226} y={322} r={22} />
    <Slice x={262} y={336} s={1.3} rot={-6} />
    <Tiem x={110} y={330} s={1.2} pose="out" />
    <Wife x={272} y={318} s={1.08} sitting flip />
    <Boy x={84} y={338} s={0.8} pose="wave" />
    <Girl x={306} y={334} s={0.76} pose="hold" flip />
    <Slice x={297} y={306} s={0.9} rot={-20} />
    <Finish c={c} vignette={0.2} />
  </G>
);

const pages = [
  // 1 — young An Tiêm in the palace garden, holding a hoe, speaking thoughtfully
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom="#E6F1E6" />
      <Cloud x={80} y={44} s={0.8} color="#FFFFFF" opacity={0.85} />
      <Glow c={c} name="palace" cx={262} cy={140} r={90} color={c.p.glow} opacity={0.5} />
      <Pavilion x={262} y={176} s={1.25} roof="#B8463A" pillar="#8A3A2E" wall="#F2DEB8" trim="#E2B64B" />
      <Figure x={262} y={170} s={0.6} {...KING} sitting />
      <Rect x={0} y={174} width={c.W} height={70} fill="#9CC46A" />
      <Path d="M150,244 Q170,206 220,178 L246,178 Q214,210 214,244 Z" fill="#E8D8B0" />
      {/* lotus pond */}
      <Ellipse cx={70} cy={212} rx={64} ry={16} fill="#6CB8D6" />
      <Lotus x={50} y={212} s={0.9} color="#F2A6B8" leaf="#5E9A4A" />
      <Lotus x={92} y={216} s={0.8} color="#F2A6B8" leaf="#5E9A4A" bloom={false} />
      <Palm x={28} y={180} s={1.1} trunk="#8A6A4A" leaf="#5E9A4A" kind="areca" />
      <Palm x={340} y={182} s={1.05} trunk="#8A6A4A" leaf="#5E9A4A" kind="areca" lean={-6} />
      {[[300, 196], [318, 204], [190, 190]].map(([fx, fy], i) => (
        <Circle key={i} cx={fx} cy={fy} r={3} fill={i % 2 ? '#F2C26A' : c.p.accent} />
      ))}
      <Tiem x={150} y={212} s={1.15} pose="hold" />
      <Hoe x={160} y={208} s={1.1} rot={10} />
      {/* thought puff */}
      <Circle cx={170} cy={124} r={2.4} fill="#FFFFFF" opacity={0.85} />
      <Circle cx={178} cy={114} r={3.6} fill="#FFFFFF" opacity={0.85} />
      <Ellipse cx={196} cy={98} rx={16} ry={11} fill="#FFFFFF" opacity={0.9} />
      <Sprout x={196} y={104} s={1.1} />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 2 — a small boat sails away, leaving the family on a bare sandy island amid the wide blue sea
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom="#D8EEF2" />
      <Cloud x={250} y={50} s={1} color="#FFFFFF" opacity={0.85} />
      <Cloud x={70} y={36} s={0.6} color="#FFFFFF" opacity={0.7} />
      <Water c={c} y={112} top={SEA_TOP} bottom={SEA_DEEP} shimmer="#E8F8FF" name="sea" seed={21} />
      <SeaSparkles c={c} y={118} seed={22} count={10} />
      <Boat x={290} y={130} s={0.8} hull="#7A5A3A" sail="#E9DCC0" />
      <Path d="M240,134 q-10,2 -20,0 M248,140 q-14,2 -26,0" stroke="#FFFFFF" strokeWidth={1.2} fill="none" opacity={0.6} />
      {/* the bare island */}
      <Path d="M-20,250 L-20,176 Q60,150 150,156 Q220,162 252,196 Q262,214 250,250 Z" fill="#F6EEDC" />
      <Path d="M-20,250 L-20,184 Q60,160 148,164 Q212,170 240,200 Q250,220 238,250 Z" fill={c.p.ground} />
      <Path d="M30,210 Q90,196 160,206" stroke={c.p.groundDeep} strokeWidth={1.4} fill="none" opacity={0.5} />
      <Rocks x={40} y={180} s={1.1} />
      <Rocks x={196} y={202} s={0.8} />
      <Tiem x={110} y={206} s={0.95} pose="wave" />
      <Wife x={136} y={208} s={0.9} />
      <Boy x={92} y={210} s={0.6} />
      <Girl x={154} y={210} s={0.56} pose="hold" />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 3 — building the driftwood hut; wife and children collect shells and plant a tiny garden
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Sun cx={70} cy={40} r={14} color="#FFF0C2" rays={c.p.glow} />
      <Water c={c} y={120} top={SEA_TOP} bottom={SEA_DEEP} shimmer="#E8F8FF" name="sea" seed={31} />
      <SeaSparkles c={c} y={124} y2={150} seed={32} count={6} />
      <Beach c={c} y={150} seed={33} />
      <Palm x={330} y={170} s={1.2} trunk={PALM_TRUNK} leaf={PALM_LEAF} kind="coconut" lean={-10} />
      <DriftHut x={120} y={190} s={1.15} building />
      {/* a log being lifted onto the wall */}
      <Rect x={124} y={154} width={66} height={5.4} rx={2.7} fill={DRIFT} transform="rotate(-8 157 157)" />
      <Tiem x={186} y={200} s={1.05} pose="up" flip />
      {/* tiny garden rows */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((k) => <Sprout key={`${row}-${k}`} x={222 + k * 14 + row * 4} y={200 + row * 10} s={0.9} />)
      )}
      <Girl x={290} y={226} s={0.62} pose="hold" flip />
      <Wife x={64} y={220} s={0.92} pose="hold" />
      <Boy x={92} y={224} s={0.6} pose="out" />
      {[[74, 196], [100, 230], [40, 228], [116, 222]].map(([sx, sy], i) => (
        <Shell key={i} x={sx} y={sy} s={1.2} color={i % 2 ? '#F6C9B8' : '#F2E2C8'} />
      ))}
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 4 — white seabirds drop little black seeds; An Tiêm kneels to pick them up
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#6DBCE0" bottom="#E6F3F0" />
      <Glow c={c} name="sun" cx={300} cy={40} r={70} color={c.p.glow} opacity={0.6} />
      <Gull x={120} y={52} s={1.3} />
      <Gull x={176} y={36} s={1.0} up={false} />
      <Gull x={218} y={66} s={1.1} />
      <Gull x={80} y={84} s={0.7} up={false} />
      {[[124, 74], [130, 96], [178, 58], [184, 84], [220, 90], [214, 118], [190, 112], [140, 120]].map(([sx, sy], i) => (
        <G key={i}>
          <Path d={`M${sx},${sy - 10} L${sx},${sy - 4}`} stroke="#1E3A4C" strokeWidth={0.8} strokeDasharray="1.5,2" opacity={0.4} />
          <Seed x={sx} y={sy} s={1.1} />
        </G>
      ))}
      <Water c={c} y={150} top={SEA_TOP} bottom={SEA_DEEP} shimmer="#E8F8FF" name="sea" seed={41} />
      <Beach c={c} y={168} seed={42} />
      <Palm x={34} y={192} s={1.1} trunk={PALM_TRUNK} leaf={PALM_LEAF} kind="coconut" lean={10} />
      <Tiem x={180} y={214} s={1.3} sitting pose="hold" />
      {[[204, 210], [214, 216], [226, 208], [150, 220]].map(([sx, sy], i) => (
        <Seed key={i} x={sx} y={sy} s={1.1} />
      ))}
      <Seed x={191} y={186} s={1} />
      <Seed x={195} y={185} s={1} />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 5 — watering sprouts with a coconut-shell scoop; beyond, long vines heavy with big striped melons
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Sun cx={290} cy={40} r={16} color="#FFF0C2" rays={c.p.glow} />
      <Water c={c} y={116} top={SEA_TOP} bottom={SEA_DEEP} shimmer="#E8F8FF" name="sea" seed={51} />
      <Beach c={c} y={136} seed={52} />
      <Rect x={0} y={160} width={c.W} height={90} fill="#D9BC86" opacity={0.6} />
      <Palm x={330} y={150} s={0.9} trunk={PALM_TRUNK} leaf={PALM_LEAF} kind="coconut" lean={-6} />
      {/* left: sprouts being watered */}
      {[52, 70, 88].map((sx) => (
        <Sprout key={sx} x={sx} y={210} s={1.3} />
      ))}
      <Tiem x={110} y={216} s={1.1} pose="out" flip />
      <Path d="M88,178 Q94,186 102,180 Q98,174 88,178 Z" fill="#6A4A2E" />
      <Path d="M90,184 q-2,8 -4,14 M94,185 q-1,8 -2,14" stroke="#9FD8E8" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      {/* right: vines and melons */}
      <Vine pts={[[140, 210], [170, 196], [204, 206], [240, 190], [276, 204], [316, 192], [350, 206]]} seed={53} />
      <Vine pts={[[160, 226], [200, 228], [240, 222], [290, 230], [340, 224]]} seed={54} />
      <Melon x={196} y={214} r={13} rot={-6} />
      <Melon x={252} y={204} r={17} rot={8} />
      <Melon x={304} y={218} r={19} />
      <Melon x={270} y={232} r={12} rot={-12} />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 6 — coral sunset: the family sits together cutting a watermelon, red slices, children laughing
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#7FB6D6" mid="#F6B89A" bottom="#F99A7A" />
      <Glow c={c} name="sunset" cx={180} cy={132} r={150} color={c.p.glow} opacity={0.7} />
      <Sun cx={180} cy={128} r={26} color="#FFD69A" />
      <WaveBand c={c} y={136} amp={2} len={60} color="#5E9FC8" />
      <WaveBand c={c} y={146} amp={2} len={50} phase={20} color="#E99A8A" opacity={0.5} />
      <Rect x={150} y={140} width={60} height={2} rx={1} fill="#FFE3A8" opacity={0.8} />
      <Rect x={160} y={148} width={40} height={2} rx={1} fill="#FFE3A8" opacity={0.7} />
      <Path d="M-20,250 L-20,172 Q180,150 380,172 L380,250 Z" fill="#E9C9A0" />
      <Palm x={26} y={180} s={1.3} trunk="#7A5A40" leaf="#3E7A46" kind="coconut" lean={10} />
      <MelonHalf x={180} y={196} r={22} />
      <Melon x={152} y={206} r={10} rot={-10} />
      <Tiem x={112} y={216} s={1.12} sitting pose="hold" />
      <Slice x={128} y={178} s={1.1} rot={10} />
      <Wife x={250} y={216} s={1.04} sitting pose="hold" flip />
      <Slice x={232} y={182} s={1} rot={-10} />
      <Boy x={146} y={232} s={0.8} pose="up" />
      <Slice x={157} y={186} s={0.8} rot={20} />
      <Girl x={212} y={232} s={0.76} pose="up" flip />
      <Slice x={202} y={186} s={0.8} rot={-20} />
      <Finish c={c} vignette={0.26} />
    </G>
  ),
  // 7 — setting carved melons afloat on gentle waves; a trading boat arrives with rice and cloth
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom="#F6E2C6" />
      <Cloud x={200} y={46} s={0.9} color="#FFFFFF" opacity={0.85} />
      <Water c={c} y={116} top={SEA_TOP} bottom={SEA_DEEP} shimmer="#E8F8FF" name="sea" seed={71} />
      <SeaSparkles c={c} y={120} seed={72} count={10} />
      <TradeBoat x={276} y={146} s={0.95} flip />
      <Gull x={300} y={54} s={0.7} />
      {/* bobbing melons heading out */}
      {[[180, 150, 9], [214, 166, 8], [150, 176, 10]].map(([mx, my, mr], i) => (
        <G key={i}>
          <Melon x={mx} y={my} r={mr} rot={i * 10} />
          <Path d={`M${mx - mr - 6},${my + mr * 0.6} q${mr + 6},4 ${mr * 2 + 12},0`} stroke="#E8F8FF" strokeWidth={1.4} fill="none" opacity={0.8} />
        </G>
      ))}
      <Path d="M-20,250 L-20,188 Q60,178 120,196 Q150,206 160,250 Z" fill="#F6EEDC" />
      <Path d="M-20,250 L-20,194 Q60,186 116,202 Q140,212 148,250 Z" fill={c.p.ground} />
      <WaveBand c={c} y={210} amp={3} len={40} color="#8FD6F0" opacity={0.35} />
      <Tiem x={96} y={222} s={1.15} pose="out" />
      <Melon x={118} y={190} r={9} />
      <MelonBasket x={46} y={222} s={1.1} />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 8 — back at the palace gate: the king welcomes the family, who offer a basket of watermelons
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom="#FBE8C8" />
      <Glow c={c} name="gate" cx={180} cy={120} r={130} color={c.p.glow} opacity={0.6} />
      <Pavilion x={180} y={176} s={1.7} roof="#B8463A" pillar="#8A3A2E" wall="#F2DEB8" trim="#E2B64B" />
      <Path d="M164,176 L164,148 Q180,136 196,148 L196,176 Z" fill="#6A2E26" />
      {/* red festival banners */}
      {[96, 264].map((bx) => (
        <G key={bx}>
          <Rect x={bx - 1} y={92} width={2} height={84} fill="#6A4A2E" />
          <Path d={`M${bx + 1},94 L${bx + 16},98 L${bx + 1},112 Z`} fill={c.p.accent} />
        </G>
      ))}
      <Rect x={0} y={176} width={c.W} height={70} fill="#D9C49A" />
      <Path d="M120,246 L150,176 L210,176 L240,246 Z" fill="#E9DCC0" />
      <Palm x={30} y={190} s={1.1} trunk="#8A6A4A" leaf="#5E9A4A" kind="areca" />
      <Palm x={334} y={190} s={1.1} trunk="#8A6A4A" leaf="#5E9A4A" kind="areca" />
      <Figure x={226} y={214} s={1.12} {...KING} pose="out" flip />
      <MelonBasket x={182} y={218} s={1.2} />
      <Tiem x={150} y={218} s={1.1} pose="out" />
      <Wife x={118} y={218} s={1.02} />
      <Boy x={92} y={222} s={0.68} pose="wave" />
      <Girl x={68} y={222} s={0.64} pose="hold" />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
];

export const MAI_AN_TIEM: StoryScenes = { cover, pages };
