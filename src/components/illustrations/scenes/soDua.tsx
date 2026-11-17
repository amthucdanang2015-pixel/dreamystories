// Sọ Dừa — honeyed late-morning in a northern village: stepped terraces of
// rice, rammed-clay walls with tiled caps, and a grassy goat hill crowned by
// one flat-tiered shade tree. Signature: the round brown coconut-shell boy
// with a tiny sprout and a warm tan face, a bamboo flute trailing music
// notes, plump cream goats, and clay-red pots, jars and gateways.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Bird,
  Cloud,
  Figure,
  Finish,
  Glow,
  Grass,
  Hut,
  Ridge,
  SceneCtx,
  Sky,
  StoryScenes,
  Sun,
  rng,
} from '../kit';

// ─── Characters & colours ─────────────────────────────────────

const HERO = { top: '#F3E6C8', bottom: '#D9C69E', hairStyle: 'topknot' as const };
const OFFICIAL = { ...HERO, hat: 'khan' as const, hatColor: '#2E2A3E' };
const MOTHER = {
  top: '#7A5536',
  bottom: '#5A3E28',
  hair: '#CFCAC2',
  hairStyle: 'bun' as const,
  hat: 'khan' as const,
  hatColor: '#1E1712',
  dress: true,
};
const YOUNGEST = { top: '#EBA9A6', bottom: '#C98482', hairStyle: 'braid' as const, dress: true };
const SIS_TEAL = { top: '#3AA39C', bottom: '#2A7C76', hairStyle: 'bun' as const, dress: true };
const SIS_PLUM = { top: '#8E4C7E', bottom: '#6C3660', hairStyle: 'bob' as const, dress: true };
const RICH = {
  top: '#2C3E74',
  bottom: '#1E2C56',
  hairStyle: 'short' as const,
  hat: 'khan' as const,
  hatColor: '#15110E',
  beard: '#2A2018',
  dress: true,
};
const VILLAGER = { top: '#9A6A44', bottom: '#6E4C30', hat: 'nonla' as const, hatColor: '#E6D29C' };

const SHELL = '#8A5A34';
const SHELL_DARK = '#6A4224';
const SHELL_LIGHT = '#B07A4A';
const FACE = '#DCAA72';
const CLAY = '#C67C4E';
const CLAY_DARK = '#A35E36';
const TILE = '#8E4A30';
const THATCH = '#C2A060';
const GOAT = '#F1E8D6';
const GOAT_DARK = '#C9BBA0';
const TREE_DEEP = '#5C7032';
const TREE = '#7E9442';
const TREE_LIGHT = '#A9BA66';
const TRUNK = '#6E4E32';
const TERRACES = ['#B5C46E', '#9DB25A', '#C3CF84', '#8AA24E'];
const NOTE = '#7A4A2A';
const GOLD = '#F2C14E';

// ─── Local helpers ────────────────────────────────────────────

/** The coconut-shell boy: round brown shell, tiny sprout, warm tan face. (x, y) = base centre. */
function Coconut({ x, y, s = 1, flip = false, rot = 0, opacity = 1 }: { x: number; y: number; s?: number; flip?: boolean; rot?: number; opacity?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} opacity={opacity}>
      <Ellipse cx={0} cy={0.5} rx={13} ry={2.6} fill="#3A2618" opacity={0.18} />
      <G transform={`rotate(${rot},0,-13)`}>
        <Ellipse cx={0} cy={-13} rx={14} ry={13} fill={SHELL} />
        <Path d="M-9,-3 Q-13,-13 -8,-23 M9,-3 Q13,-13 8,-23" stroke={SHELL_DARK} strokeWidth={0.9} fill="none" opacity={0.6} />
        <Path d="M-11,-18 Q-6,-25 1,-25" stroke={SHELL_LIGHT} strokeWidth={2.6} strokeLinecap="round" fill="none" />
        <Path d="M0,-26 Q-1,-30 2,-33" stroke="#6A7C38" strokeWidth={1.4} strokeLinecap="round" fill="none" />
        <Path d="M2,-33 Q8,-37 10,-31 Q5,-30 2,-33 Z" fill="#94B050" />
        <Ellipse cx={1} cy={-11.5} rx={8.4} ry={6.8} fill={FACE} />
        <Circle cx={-2.4} cy={-13} r={1.4} fill="#2A1A10" />
        <Circle cx={4} cy={-13} r={1.4} fill="#2A1A10" />
        <Circle cx={-2} cy={-13.5} r={0.5} fill="#FFFFFF" />
        <Circle cx={4.4} cy={-13.5} r={0.5} fill="#FFFFFF" />
        <Path d="M-1.6,-9.6 Q0.8,-7 3.4,-9.6" stroke="#5A3020" strokeWidth={1} strokeLinecap="round" fill="none" />
        <Ellipse cx={-5} cy={-10} rx={1.7} ry={1} fill="#E58C7A" opacity={0.6} />
        <Ellipse cx={7} cy={-10} rx={1.7} ry={1} fill="#E58C7A" opacity={0.6} />
      </G>
    </G>
  );
}

/** Half a coconut shell with its white lining. (x, y) = base centre. */
function HalfShell({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Path d="M-13,-9 Q-13,1 0,1 Q13,1 13,-9 Z" fill={SHELL} />
      <Ellipse cx={0} cy={-9} rx={13} ry={3.4} fill="#F6EBD8" />
      <Path d="M-9,-5 Q-3,-2 3,-3" stroke={SHELL_LIGHT} strokeWidth={1.6} strokeLinecap="round" fill="none" />
    </G>
  );
}

/** Stepped rice terraces receding downhill, each with a light earthen lip. */
function Terraces({ c, y, rows = 5, step = 14, seed = 3 }: { c: SceneCtx; y: number; rows?: number; step?: number; seed?: number }) {
  const r = rng(seed);
  return (
    <G>
      {Array.from({ length: rows }, (_, i) => {
        const yy = y + i * step * (1 + i * 0.25);
        const a = (4 + r() * 7) * (i % 2 ? -1 : 1);
        const top = `M-20,${yy} Q${c.W * 0.25},${yy - a} ${c.W * 0.5},${yy} T${c.W + 20},${yy}`;
        return (
          <G key={i}>
            <Path d={`${top} L${c.W + 20},${c.H + 2} L-20,${c.H + 2} Z`} fill={TERRACES[i % TERRACES.length]} />
            <Path d={top} stroke="#EDE2AE" strokeWidth={1.2 + i * 0.3} fill="none" opacity={0.65} />
            {Array.from({ length: 6 + i * 2 }, (_, k) => {
              const tx = r() * c.W;
              const ty = yy + 4 + r() * step * 0.6;
              return <Path key={k} d={`M${tx},${ty} l-1,-3 M${tx + 2},${ty} l1,-3.4`} stroke={TREE_DEEP} strokeWidth={0.9} strokeLinecap="round" opacity={0.45} />;
            })}
          </G>
        );
      })}
    </G>
  );
}

/** Flat, tiered shade tree on the goat hill. (x, y) = trunk base. */
function ShadeTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={1} rx={40} ry={5} fill="#3A2618" opacity={0.16} />
      <Path d="M-5,0 Q-3,-30 -1,-52 L3,-52 Q4,-30 7,0 Z" fill={TRUNK} />
      <Path d="M0,-38 Q-14,-44 -24,-50 M2,-42 Q16,-48 26,-56" stroke={TRUNK} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <Ellipse cx={0} cy={-52} rx={46} ry={10} fill={TREE_DEEP} />
      <Ellipse cx={3} cy={-62} rx={38} ry={9} fill={TREE} />
      <Ellipse cx={-2} cy={-72} rx={28} ry={8} fill={TREE} />
      <Ellipse cx={0} cy={-80} rx={16} ry={6} fill={TREE_LIGHT} />
      <Ellipse cx={-16} cy={-64} rx={14} ry={3} fill={TREE_LIGHT} opacity={0.8} />
      <Ellipse cx={18} cy={-54} rx={12} ry={2.6} fill={TREE_LIGHT} opacity={0.6} />
    </G>
  );
}

/** Plump cream goat. (x, y) = feet centre, faces right. */
function Goat({ x, y, s = 1, flip = false, graze = false }: { x: number; y: number; s?: number; flip?: boolean; graze?: boolean }) {
  const hx = graze ? 15 : 16;
  const hy = graze ? -7 : -24;
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Ellipse cx={0} cy={0.5} rx={14} ry={2.4} fill="#3A2618" opacity={0.14} />
      {[-10, -5, 4, 9].map((lx) => (
        <Rect key={lx} x={lx - 1.5} y={-11} width={3} height={11} rx={1.5} fill={GOAT_DARK} />
      ))}
      <Path d="M-13,-19 q-4,-3 -3,-7" stroke={GOAT_DARK} strokeWidth={2} strokeLinecap="round" fill="none" />
      <Ellipse cx={0} cy={-15} rx={14} ry={9} fill={GOAT} />
      <Path d={`M8,-19 Q${hx - 2},${(hy - 19) / 2} ${hx},${hy}`} stroke={GOAT} strokeWidth={7} strokeLinecap="round" fill="none" />
      <Ellipse cx={hx + 2} cy={hy} rx={5.6} ry={4.4} fill={GOAT} />
      <Path d={`M${hx - 2},${hy - 3} q-6,-1 -7,3 q4,0 7,-1 Z`} fill={GOAT_DARK} />
      <Path d={`M${hx},${hy - 4} q1,-6 -3,-8`} stroke="#B49A70" strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Circle cx={hx + 3} cy={hy - 1} r={0.9} fill="#2A1A10" />
      <Path d={`M${hx + 4},${hy + 4} l-1,4 l2,-1 Z`} fill={GOAT_DARK} />
    </G>
  );
}

/** Bamboo flute. (x, y) = centre. */
function Flute({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Rect x={-16} y={-1.7} width={32} height={3.4} rx={1.7} fill="#D2AC66" />
      <Rect x={-13} y={-1.7} width={1.3} height={3.4} fill="#9A7440" />
      <Rect x={11} y={-1.7} width={1.3} height={3.4} fill="#9A7440" />
      {[-8, -3.5, 1, 5.5].map((hx) => (
        <Circle key={hx} cx={hx} cy={0} r={0.75} fill="#5A3A20" />
      ))}
    </G>
  );
}

/** A small drift of music notes. (x, y) = lowest note head. */
function Notes({ x, y, s = 1, color = NOTE, opacity = 0.85 }: { x: number; y: number; s?: number; color?: string; opacity?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <Ellipse cx={0} cy={0} rx={2.8} ry={2.2} fill={color} />
      <Path d="M2.5,0 L2.5,-11 Q6,-9 7,-5" stroke={color} strokeWidth={1.2} strokeLinecap="round" fill="none" />
      <Ellipse cx={11} cy={-12} rx={2.6} ry={2} fill={color} />
      <Ellipse cx={19} cy={-15} rx={2.6} ry={2} fill={color} />
      <Path d="M13.4,-12 L13.4,-23 L21.4,-26 L21.4,-15" stroke={color} strokeWidth={1.2} strokeLinejoin="round" fill="none" />
      <Path d="M13.4,-22 L21.4,-25" stroke={color} strokeWidth={2.4} />
      <Ellipse cx={-4} cy={-22} rx={2} ry={1.6} fill={color} opacity={0.7} />
      <Path d="M-2.2,-22 L-2.2,-30" stroke={color} strokeWidth={1} opacity={0.7} />
    </G>
  );
}

/** Rammed-clay wall with a tiled cap. (x, y) = left end of ground line. */
function ClayWall({ x, y, w, h = 26 }: { x: number; y: number; w: number; h?: number }) {
  return (
    <G>
      <Rect x={x} y={y - h} width={w} height={h} fill={CLAY} />
      {[0.3, 0.6].map((t) => (
        <Rect key={t} x={x} y={y - h + h * t} width={w} height={1.2} fill={CLAY_DARK} opacity={0.4} />
      ))}
      <Rect x={x - 3} y={y - h - 5} width={w + 6} height={6} rx={2} fill={TILE} />
      {Array.from({ length: Math.floor(w / 8) }, (_, i) => (
        <Circle key={i} cx={x + 4 + i * 8} cy={y - h + 1} r={2} fill={TILE} />
      ))}
    </G>
  );
}

/** Clay gateway with a little tiled roof. (x, y) = ground centre. */
function Gate({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-24} y={-42} width={9} height={42} fill={CLAY} />
      <Rect x={15} y={-42} width={9} height={42} fill={CLAY} />
      <Rect x={-24} y={-44} width={48} height={5} fill={CLAY_DARK} />
      <Path d="M-34,-42 Q-30,-46 -32,-50 Q0,-44 32,-50 Q30,-46 34,-42 Q0,-46 -34,-42 Z" fill={TILE} />
      <Path d="M-20,-56 Q0,-51 20,-56 L24,-48 Q0,-44 -24,-48 Z" fill={TILE} />
    </G>
  );
}

/** Earthen pot / jar; `gold` heaps it with gold. (x, y) = base centre. */
function Pot({ x, y, s = 1, color = CLAY, gold = false }: { x: number; y: number; s?: number; color?: string; gold?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={0.5} rx={10} ry={2} fill="#3A2618" opacity={0.16} />
      {gold ? (
        <G>
          <Circle cx={-4} cy={-21} r={3.4} fill={GOLD} />
          <Circle cx={3} cy={-22} r={3.8} fill="#F7D67A" />
          <Circle cx={0} cy={-25} r={3.2} fill={GOLD} />
        </G>
      ) : null}
      <Path d="M-6,-19 Q-13,-14 -11,-6 Q-9,0 0,0 Q9,0 11,-6 Q13,-14 6,-19 Z" fill={color} />
      <Rect x={-7} y={-21} width={14} height={3.4} rx={1.7} fill={CLAY_DARK} />
      <Path d="M-9,-10 Q0,-7 9,-10" stroke="#F0C9A0" strokeWidth={1} fill="none" opacity={0.5} />
    </G>
  );
}

/** Plump pink pig. (x, y) = feet centre, faces right. */
function Pig({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Ellipse cx={0} cy={0.5} rx={12} ry={2} fill="#3A2618" opacity={0.14} />
      {[-7, -3, 4, 8].map((lx) => (
        <Rect key={lx} x={lx - 1.5} y={-6} width={3} height={6} rx={1.4} fill="#D88A8A" />
      ))}
      <Path d="M-12,-10 q-4,-2 -2,-5 q2,0 0,2" stroke="#D88A8A" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <Ellipse cx={0} cy={-10} rx={12} ry={8} fill="#EBA8A4" />
      <Circle cx={11} cy={-12} r={5.6} fill="#EBA8A4" />
      <Ellipse cx={16} cy={-11} rx={2.4} ry={2} fill="#D88A8A" />
      <Path d="M8,-16 L10,-21 L13,-16 Z" fill="#D88A8A" />
      <Circle cx={12.4} cy={-13.6} r={0.9} fill="#2A1A10" />
    </G>
  );
}

/** Stack of peach silk rolls. (x, y) = base centre. */
function SilkStack({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const rows = [
    [-12, 0],
    [0, 0],
    [12, 0],
    [-6, -8],
    [6, -8],
    [0, -16],
  ];
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {rows.map(([rx, ry], i) => (
        <G key={i}>
          <Rect x={rx - 6} y={ry - 8} width={12} height={8} rx={4} fill={i % 2 ? '#F2B49C' : '#F6C4AA'} />
          <Circle cx={rx} cy={ry - 4} r={2} fill="#E0957A" />
        </G>
      ))}
    </G>
  );
}

/** Rice parcel wrapped in a leaf and tied with twine. (x, y) = centre. */
function Parcel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-6} y={-4.5} width={12} height={9} rx={2.4} fill="#7E9A48" />
      <Rect x={-0.6} y={-4.5} width={1.2} height={9} fill="#D8BC80" />
      <Rect x={-6} y={-0.6} width={12} height={1.2} fill="#D8BC80" />
    </G>
  );
}

/** Woven rice basket. (x, y) = base centre. */
function RiceBasket({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-6,-9 Q0,-18 6,-9" stroke="#8A6A3A" strokeWidth={1.3} fill="none" />
      <Path d="M-8,-9 Q-9,-2 -5,0 L5,0 Q9,-2 8,-9 Z" fill="#C9A060" />
      <Path d="M-8,-5 Q0,-3 8,-5" stroke="#9A7440" strokeWidth={0.9} fill="none" />
    </G>
  );
}

/** Low bush to hide behind. (x, y) = base centre. */
function Bush({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={-12} cy={-9} rx={14} ry={10} fill={TREE_DEEP} />
      <Ellipse cx={8} cy={-12} rx={16} ry={13} fill={TREE} />
      <Ellipse cx={20} cy={-6} rx={10} ry={7} fill={TREE_DEEP} />
      <Ellipse cx={4} cy={-19} rx={7} ry={3} fill={TREE_LIGHT} />
      <Rect x={-26} y={-4} width={56} height={4} rx={2} fill={TREE_DEEP} />
    </G>
  );
}

/** Small 4-point sparkle. */
function Sparkle({ x, y, r = 4, color }: { x: number; y: number; r?: number; color: string }) {
  return (
    <Path
      d={`M${x},${y - r} Q${x},${y} ${x + r},${y} Q${x},${y} ${x},${y + r} Q${x},${y} ${x - r},${y} Q${x},${y} ${x},${y - r} Z`}
      fill={color}
    />
  );
}

/** Red and gold paper bunting for the wedding. */
function Bunting({ x1, x2, y, sag = 10 }: { x1: number; x2: number; y: number; sag?: number }) {
  const n = Math.floor((x2 - x1) / 14);
  return (
    <G>
      <Path d={`M${x1},${y} Q${(x1 + x2) / 2},${y + sag * 2} ${x2},${y}`} stroke="#8A4A2E" strokeWidth={0.9} fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n;
        const px = x1 + (x2 - x1) * t;
        const py = y + sag * 4 * t * (1 - t);
        return <Path key={i} d={`M${px - 4},${py} L${px + 4},${py} L${px},${py + 8} Z`} fill={i % 2 ? GOLD : '#C8463E'} />;
      })}
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top={c.p.sky} mid="#F6E2B8" bottom={c.p.skyLow} />
    <Glow c={c} name="sun" cx={274} cy={92} r={160} color={c.p.glow} opacity={0.85} />
    <Sun cx={274} cy={92} r={20} color="#FFF3D2" />
    <Cloud x={92} y={84} s={1.1} color="#FBF0DA" opacity={0.9} />
    <Ridge c={c} y={178} amp={20} seed={4} color="#CBC08C" opacity={0.85} />
    <Terraces c={c} y={186} rows={6} step={13} seed={5} />
    <Hut x={58} y={204} s={0.7} wall={CLAY} roof={THATCH} door="#6A4226" />
    <Hut x={316} y={198} s={0.55} wall={CLAY} roof={THATCH} door="#6A4226" />
    <Path d="M-20,372 L-20,300 Q90,248 200,254 Q300,260 380,288 L380,372 Z" fill={c.p.ground} />
    <Path d="M40,276 Q130,254 220,258" stroke="#BCCB78" strokeWidth={3} fill="none" opacity={0.7} strokeLinecap="round" />
    <ShadeTree x={290} y={286} s={1.35} />
    <Goat x={90} y={316} s={1.15} graze />
    <Goat x={322} y={322} s={0.95} flip graze />
    <Goat x={240} y={306} s={0.8} flip />
    <Glow c={c} name="boy" cx={176} cy={262} r={60} color={c.p.glow} opacity={0.55} />
    <Coconut x={174} y={298} s={2.2} />
    <Flute x={216} y={294} s={1.15} rot={-12} />
    <Notes x={218} y={262} />
    <Notes x={238} y={224} s={0.8} opacity={0.7} />
    <Notes x={196} y={196} s={0.65} opacity={0.55} />
    <Bird x={110} y={130} s={0.8} color={NOTE} />
    <Bird x={128} y={140} s={0.6} color={NOTE} wing="down" />
    <Grass c={c} y={300} seed={12} color={c.p.groundDeep} count={14} />
    <Finish c={c} vignette={0.24} />
  </G>
);

const pages = [
  // 1 — the old mother outside her clay cottage, hugging the smiling coconut baby
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={290} cy={40} r={110} color={c.p.glow} opacity={0.7} />
      <Ridge c={c} y={120} amp={12} seed={2} color="#CBC08C" opacity={0.8} />
      <Terraces c={c} y={128} rows={4} step={12} seed={8} />
      <Rect x={0} y={178} width={c.W} height={64} fill="#D9AE7E" />
      <ClayWall x={-4} y={180} w={56} h={22} />
      <Hut x={104} y={180} s={1.55} wall={CLAY} roof={THATCH} door="#6A4226" />
      <Pot x={62} y={190} s={0.9} />
      <Pot x={76} y={194} s={0.7} color={CLAY_DARK} />
      <Path d="M0,200 Q120,192 360,206" stroke="#C49466" strokeWidth={1.2} fill="none" opacity={0.6} />
      <Glow c={c} name="love" cx={200} cy={170} r={56} color={c.p.glow} opacity={0.8} />
      <Figure x={196} y={214} s={1.12} {...MOTHER} pose="hold" />
      <Coconut x={203} y={192} s={0.72} rot={-6} />
      <Path d="M228,150 c-3,-4 -9,-1 -6,3 l6,6 l6,-6 c3,-4 -3,-7 -6,-3 Z" fill="#E58C7A" opacity={0.8} />
      <Path d="M242,136 c-2,-3 -6,-1 -4,2 l4,4 l4,-4 c2,-3 -2,-5 -4,-2 Z" fill="#E58C7A" opacity={0.6} />
      <Bird x={250} y={60} s={0.7} color={NOTE} />
      <Grass c={c} y={204} seed={4} color="#A88458" count={8} height={6} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 2 — the coconut boy rolls among the goats; the rich man stares from his clay gate
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={70} cy={36} r={100} color={c.p.glow} opacity={0.7} />
      <Cloud x={190} y={46} s={0.8} color="#FBF0DA" opacity={0.85} />
      <Terraces c={c} y={112} rows={3} step={12} seed={11} />
      <Path d="M-20,250 L-20,150 Q120,120 250,150 Q310,164 380,176 L380,250 Z" fill={c.p.ground} />
      <ClayWall x={262} y={178} w={110} h={24} />
      <Gate x={300} y={180} s={1.05} />
      <Figure x={300} y={180} s={0.95} {...RICH} pose="out" flip />
      <Path d="M292,112 l2,-8 M300,110 l0,-9 M308,112 l-2,-8" stroke={c.p.accent} strokeWidth={1.6} strokeLinecap="round" />
      <Goat x={62} y={176} s={1.05} graze />
      <Goat x={118} y={206} s={1.15} />
      <Goat x={226} y={208} s={1} flip graze />
      <Goat x={196} y={164} s={0.8} flip />
      <Path d="M138,190 l-16,0 M140,196 l-22,0 M138,202 l-14,0" stroke="#F6EBD8" strokeWidth={1.6} strokeLinecap="round" opacity={0.8} />
      <Coconut x={168} y={212} s={1.15} rot={18} />
      <Path d="M150,214 q-10,-3 -18,0" stroke={c.p.groundDeep} strokeWidth={1.2} fill="none" opacity={0.5} />
      <Grass c={c} y={180} seed={14} color={c.p.groundDeep} count={12} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 3 — the older sisters turn up their noses; the youngest kneels to share a rice parcel
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={300} cy={44} r={100} color={c.p.glow} opacity={0.7} />
      <Ridge c={c} y={118} amp={12} seed={6} color="#CBC08C" opacity={0.8} />
      <Terraces c={c} y={124} rows={3} step={12} seed={13} />
      <Path d="M-20,250 L-20,166 Q140,150 380,170 L380,250 Z" fill={c.p.ground} />
      <Path d="M-20,214 Q80,190 180,198 Q260,204 380,190 L380,206 Q260,220 180,214 Q80,208 -20,230 Z" fill="#D9B784" />
      <ShadeTree x={322} y={176} s={0.9} />
      <G transform="rotate(-4,72,206)">
        <Figure x={72} y={206} s={1.02} {...SIS_TEAL} pose="hold" flip />
      </G>
      <RiceBasket x={62} y={184} s={0.9} />
      <G transform="rotate(-4,112,202)">
        <Figure x={112} y={202} s={1} {...SIS_PLUM} pose="down" flip />
      </G>
      <RiceBasket x={124} y={204} s={0.9} />
      <Figure x={222} y={214} s={1.05} {...YOUNGEST} pose="out" sitting />
      <RiceBasket x={206} y={216} s={0.9} />
      <Parcel x={246} y={188} s={1} />
      <Coconut x={272} y={214} s={1.05} flip />
      <Goat x={300} y={216} s={0.75} flip graze />
      <Grass c={c} y={190} seed={9} color={c.p.groundDeep} count={10} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 4 — a gentle young man plays the flute under the shade tree; the youngest peeks in wonder
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} mid="#F6E2B8" bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={180} cy={30} r={120} color={c.p.glow} opacity={0.7} />
      <Terraces c={c} y={118} rows={3} step={12} seed={17} />
      <Path d="M-20,250 L-20,170 Q100,138 220,146 Q300,152 380,172 L380,250 Z" fill={c.p.ground} />
      <ShadeTree x={150} y={176} s={1.45} />
      <Glow c={c} name="music" cx={150} cy={150} r={70} color={c.p.glow} opacity={0.6} />
      <Figure x={140} y={190} s={1.05} {...HERO} pose="hold" sitting />
      <Flute x={154} y={146} s={0.75} rot={-14} />
      <Notes x={172} y={130} />
      <Notes x={196} y={104} s={0.8} opacity={0.7} />
      <Notes x={218} y={84} s={0.6} opacity={0.5} />
      <Goat x={62} y={196} s={0.9} graze />
      <Goat x={90} y={214} s={0.75} flip graze />
      <Figure x={276} y={196} s={0.98} {...YOUNGEST} pose="hold" flip />
      <Bush x={272} y={202} s={1.1} />
      <Sparkle x={250} y={140} r={3} color="#FFF4D2" />
      <Sparkle x={238} y={160} r={2} color="#FFF4D2" />
      <Grass c={c} y={196} seed={19} color={c.p.groundDeep} count={10} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 5 — the clay courtyard full of wedding gifts: gold, peach silk, fat pigs
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={180} cy={20} r={130} color={c.p.glow} opacity={0.7} />
      <Ridge c={c} y={96} amp={10} seed={3} color="#CBC08C" opacity={0.7} />
      <ClayWall x={-4} y={132} w={368} h={34} />
      <Gate x={180} y={134} s={1.2} />
      <Rect x={0} y={132} width={c.W} height={110} fill="#D6A678" />
      {[150, 172, 200].map((yy) => (
        <Path key={yy} d={`M0,${yy} L${c.W},${yy}`} stroke="#BE8C5E" strokeWidth={1} opacity={0.6} />
      ))}
      <Glow c={c} name="gold" cx={176} cy={176} r={40} color={GOLD} opacity={0.55} />
      <Pot x={176} y={194} s={1.5} gold />
      <Sparkle x={160} y={148} r={3} color="#FFF4D2" />
      <Sparkle x={194} y={152} r={2.4} color="#FFF4D2" />
      <SilkStack x={124} y={196} s={1.1} />
      <SilkStack x={226} y={198} s={1} />
      <Pig x={92} y={220} s={0.95} />
      <Pig x={150} y={224} s={0.9} />
      <Pig x={212} y={226} s={0.9} flip />
      <Pig x={262} y={220} s={0.85} flip />
      <Figure x={300} y={206} s={1.05} {...RICH} pose="up" flip />
      <Figure x={46} y={208} s={1} {...MOTHER} pose="down" />
      <Coconut x={70} y={210} s={0.65} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 6 — wedding feast: the shell opens in a soft glow and a young man steps out
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} mid="#F7E0B0" bottom={c.p.skyLow} />
      <Terraces c={c} y={110} rows={2} step={12} seed={21} />
      <ClayWall x={-4} y={142} w={368} h={24} />
      <Rect x={0} y={140} width={c.W} height={102} fill="#D9AE7E" />
      <Bunting x1={-4} x2={364} y={30} sag={14} />
      <Figure x={44} y={170} s={0.85} {...VILLAGER} pose="up" />
      <Figure x={74} y={174} s={0.8} {...SIS_TEAL} pose="down" flip />
      <Figure x={300} y={170} s={0.85} {...VILLAGER} pose="up" flip />
      <Figure x={330} y={174} s={0.82} {...MOTHER} pose="wave" flip />
      <Rect x={28} y={196} width={74} height={12} rx={3} fill="#B04A36" />
      <Circle cx={46} cy={194} r={5} fill="#F6EBD8" />
      <Circle cx={66} cy={194} r={5} fill="#E9B44C" />
      <Circle cx={86} cy={194} r={5} fill="#9DB25A" />
      <Glow c={c} name="open" cx={170} cy={150} r={96} color={c.p.glow} opacity={1} />
      <Circle cx={170} cy={150} r={34} fill="#FFF6DC" opacity={0.5} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <Path key={i} d={`M${170 + Math.cos(a) * 44},${150 + Math.sin(a) * 44} L${170 + Math.cos(a) * 58},${150 + Math.sin(a) * 58}`} stroke="#FFF1C4" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
        );
      })}
      <HalfShell x={140} y={204} s={1.1} rot={-16} />
      <HalfShell x={202} y={204} s={1.1} rot={16} />
      <Figure x={170} y={200} s={1.15} {...HERO} pose="wave" />
      <Sparkle x={140} y={120} r={4} color="#FFFFFF" />
      <Sparkle x={204} y={110} r={3} color="#FFFFFF" />
      <Sparkle x={128} y={160} r={2.4} color="#FFFFFF" />
      <Figure x={248} y={206} s={1.05} {...YOUNGEST} pose="hold" flip />
      <Path d="M262,128 c-3,-4 -9,-1 -6,3 l6,6 l6,-6 c3,-4 -3,-7 -6,-3 Z" fill="#E58C7A" />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 7 — daytime study: low desk, scrolls, a little oil lamp; his wife sews nearby
  (c: SceneCtx) => (
    <G>
      <Rect x={0} y={0} width={c.W} height={c.H} fill="#D7A272" />
      {[40, 80, 120].map((yy) => (
        <Rect key={yy} x={0} y={yy} width={c.W} height={1.4} fill={CLAY_DARK} opacity={0.25} />
      ))}
      <Rect x={124} y={28} width={112} height={72} rx={4} fill="#8A5A3A" />
      <G>
        <Rect x={130} y={34} width={100} height={60} fill={c.p.sky} />
        <Rect x={130} y={70} width={100} height={24} fill={TERRACES[0]} />
        <Path d="M130,78 Q180,72 230,80" stroke="#EDE2AE" strokeWidth={1} fill="none" />
        <Path d="M130,86 Q180,92 230,84" stroke="#EDE2AE" strokeWidth={1} fill="none" />
        <Circle cx={204} cy={50} r={8} fill="#FFF3D2" />
        {[146, 164, 182, 200, 218].map((bx) => (
          <Rect key={bx} x={bx - 1.4} y={34} width={2.8} height={60} fill="#8A5A3A" />
        ))}
      </G>
      <Rect x={0} y={170} width={c.W} height={72} fill="#B9845A" />
      <Rect x={0} y={170} width={c.W} height={3} fill="#9A6A44" />
      <Rect x={40} y={162} width={210} height={12} rx={4} fill="#C9A86A" opacity={0.6} />
      <Rect x={108} y={176} width={110} height={8} rx={2} fill="#7A4E30" />
      <Rect x={114} y={184} width={6} height={20} fill="#6A4226" />
      <Rect x={206} y={184} width={6} height={20} fill="#6A4226" />
      <Glow c={c} name="lamp" cx={200} cy={164} r={60} color={c.p.glow} opacity={0.85} />
      <Ellipse cx={200} cy={174} rx={7} ry={2.6} fill={CLAY_DARK} />
      <Path d="M193,174 Q200,166 207,174 Z" fill={CLAY} />
      <Path d="M200,166 Q197,160 200,154 Q203,160 200,166 Z" fill="#F7B54A" />
      <Rect x={124} y={170} width={30} height={6} rx={1} fill="#F6EBD8" />
      <Rect x={122} y={169} width={3} height={8} rx={1.5} fill="#8A5A3A" />
      <Rect x={153} y={169} width={3} height={8} rx={1.5} fill="#8A5A3A" />
      <Rect x={172} y={168} width={8} height={8} rx={1} fill="#3A2618" />
      <Path d="M184,170 L188,156" stroke="#5A3A20" strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M188,170 L191,157" stroke="#5A3A20" strokeWidth={1.4} strokeLinecap="round" />
      {[20, 34, 48].map((sx, i) => (
        <G key={sx}>
          <Rect x={sx} y={150 - i * 2} width={8} height={24 + i * 2} rx={3} fill="#EADBB8" />
          <Rect x={sx} y={150 - i * 2} width={8} height={3} rx={1.5} fill="#B04A36" />
        </G>
      ))}
      <Figure x={128} y={204} s={1.1} {...HERO} pose="hold" sitting />
      <Figure x={286} y={206} s={1.05} {...YOUNGEST} pose="hold" sitting flip />
      <Rect x={258} y={182} width={18} height={8} rx={3} fill="#EBA9A6" opacity={0.8} />
      <Path d="M268,182 Q262,168 270,160" stroke="#F6EBD8" strokeWidth={0.8} fill="none" />
      <Finish c={c} vignette={0.26} />
    </G>
  ),
  // 8 — home by the rice fields: forgiving smiles, shy sisters, mother at the gate
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} mid="#F6E2B8" bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={200} cy={40} r={130} color={c.p.glow} opacity={0.75} />
      <Sun cx={200} cy={40} r={14} color="#FFF3D2" />
      <Ridge c={c} y={112} amp={12} seed={7} color="#CBC08C" opacity={0.8} />
      <Terraces c={c} y={120} rows={3} step={13} seed={23} />
      <Rect x={0} y={176} width={c.W} height={66} fill="#D9AE7E" />
      <ClayWall x={270} y={180} w={100} h={24} />
      <Gate x={310} y={182} s={1} />
      <Figure x={310} y={182} s={0.92} {...MOTHER} pose="wave" flip />
      <Pot x={262} y={190} s={0.8} />
      <G transform="rotate(12,60,212)">
        <Figure x={60} y={212} s={1} {...SIS_TEAL} pose="down" />
      </G>
      <G transform="rotate(12,100,212)">
        <Figure x={100} y={212} s={1} {...SIS_PLUM} pose="down" />
      </G>
      <Glow c={c} name="couple" cx={190} cy={170} r={70} color={c.p.glow} opacity={0.5} />
      <Figure x={176} y={214} s={1.12} {...OFFICIAL} pose="out" flip />
      <Figure x={212} y={214} s={1.06} {...YOUNGEST} pose="down" flip />
      <Bird x={110} y={56} s={0.8} color={NOTE} />
      <Bird x={128} y={66} s={0.6} color={NOTE} wing="down" />
      <Grass c={c} y={204} seed={27} color="#A88458" count={8} height={6} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
];

export const SO_DUA: StoryScenes = { cover, pages };
