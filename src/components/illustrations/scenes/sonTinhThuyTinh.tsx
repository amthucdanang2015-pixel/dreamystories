// Sơn Tinh, Thủy Tinh — a mythic contest of land and water.
// Signature: storm-lit indigo skies split by jade mountain light; layered
// jade Peaks always rise on the LEFT, stylised curling wave Crests always
// surge on the RIGHT, ribbon clouds swirl overhead, and a Hùng-era stilt
// palace with buffalo-horn roof tips anchors the kingdom in between.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Bird,
  Cloud,
  Crest,
  Figure,
  Finish,
  Glow,
  Grass,
  Mist,
  Paddies,
  Peaks,
  Pose,
  Rain,
  RibbonCloud,
  Ridge,
  SceneCtx,
  Sky,
  StiltHouse,
  StoryScenes,
  Sun,
  WaveBand,
  rng,
} from '../kit';

// ─── Characters & constants ───────────────────────────────────

const SON = { skin: '#C08A62', top: '#3E8C68', bottom: '#2A5E48', hairStyle: 'topknot' as const };
const SON_CLOAK = '#2C6E54';
const SON_LEAF = '#7CCB9C';
const SON_AURA = '#A6EBC6';
const THUY = { skin: '#D9B49A', top: '#3557A8', bottom: '#22377A', hair: '#DDEFF2', hairStyle: 'long' as const, dress: true };
const THUY_AURA = '#9CC4F0';
const MY = { top: '#86BE96', bottom: '#C9A24A', hairStyle: 'long' as const, dress: true };
const KING = { top: '#B5402F', bottom: '#7A2A20', beard: '#F1EEE6', hair: '#E8E4DA', hat: 'crown' as const, hatColor: '#D9B04A', dress: true };
const JADE = ['#8FD0B2', '#4FA48C', '#2F7F6A', '#1D5A4C'];
const SEA = { deep: '#1E3C84', mid: '#2C58A4', light: '#4E86C4', foam: '#DCEFF4' };
const WOOD = '#7A5236';
const PALACE_ROOF = '#5A3A2A';
const PALACE_DARK = '#2E2018';
const BRONZE = '#D9B04A';
const VILLAGER_TOPS = ['#B0643E', '#5E7FA6', '#8D6F9E', '#C9A24A'];

/** A small almond leaf. */
const leafPath = (x: number, y: number, dir: number, len = 7) =>
  `M${x},${y} q${(dir * len) / 2},${-len / 3} ${dir * len},0 q${(-dir * len) / 2},${len / 3} ${-dir * len},0 Z`;

// ─── Story-specific pieces ────────────────────────────────────

/** Sơn Tinh: jade robe, leaf-and-moss cloak, leaf crown, staff with a jade orb. */
function SonTinh({ x, y, s = 1, pose = 'down', flip = false }: { x: number; y: number; s?: number; pose?: Pose; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-9,-41 Q-20,-22 -17,-1 Q0,3 17,-1 Q20,-22 9,-41 Z" fill={SON_CLOAK} />
      {[
        [-16, -6, -1],
        [-18, -16, -1],
        [-16, -27, -1],
        [-12, -36, -1],
        [16, -6, 1],
        [18, -16, 1],
        [16, -27, 1],
        [12, -36, 1],
      ].map(([lx, ly, d], i) => (
        <Path key={i} d={leafPath(lx, ly, d)} fill={SON_LEAF} />
      ))}
      <Path d="M-16,0 L-18,-68" stroke="#7A5A3A" strokeWidth={2.2} strokeLinecap="round" />
      <Circle cx={-18} cy={-70} r={5} fill={SON_AURA} opacity={0.35} />
      <Circle cx={-18} cy={-70} r={3.2} fill="#9FE0BE" />
      <Figure x={0} y={0} {...SON} pose={pose} />
      <Path d={leafPath(-7, -58, -1, 6)} fill={SON_LEAF} />
      <Path d={leafPath(7, -58, 1, 6)} fill={SON_LEAF} />
      <Path d="M-2,-60 q2,-6 4,0 Z" fill={SON_LEAF} />
    </G>
  );
}

/** Thủy Tinh: indigo wave robe that curls at the hem, sea-foam hair, pearls. */
function ThuyTinh({
  x,
  y,
  s = 1,
  pose = 'down',
  flip = false,
  frown = false,
}: {
  x: number;
  y: number;
  s?: number;
  pose?: Pose;
  flip?: boolean;
  frown?: boolean;
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-11,-8 Q-24,-4 -28,-16 Q-30,-27 -22,-29 Q-15,-29 -17,-22 Q-19,-16 -12,-19 Z" fill={SEA.mid} />
      <Path d="M-22,-29 Q-15,-29 -17,-22" stroke={SEA.foam} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <Path d="M11,-6 Q22,-2 27,-11 Q25,-3 13,-1 Z" fill={SEA.light} />
      <Figure x={0} y={0} {...THUY} pose={pose} />
      <Path d="M-9,-55 Q-13,-66 -5,-64 Q-3,-71 3,-66 Q9,-69 9,-58 Q4,-61 -9,-55 Z" fill={SEA.foam} />
      {[-5, -2, 1, 4, 7].map((px, i) => (
        <Circle key={i} cx={px} cy={-38 + Math.abs(px - 1) * 0.35} r={1.3} fill="#F6F2E6" />
      ))}
      {frown ? (
        <G>
          <Path d="M-4.2,-54.2 L-0.8,-53.2 M1.8,-53.2 L5.2,-54.2" stroke="#2A1A10" strokeWidth={0.9} strokeLinecap="round" />
          <Path d="M-0.5,-46.4 Q1.2,-48 2.9,-46.4" stroke="#2A1A10" strokeWidth={0.8} fill="none" strokeLinecap="round" />
        </G>
      ) : null}
    </G>
  );
}

/** Mỵ Nương: soft green and gold dress, long hair with a flower. */
function MyNuong({ x, y, s = 1, pose = 'down', flip = false }: { x: number; y: number; s?: number; pose?: Pose; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Figure x={0} y={0} {...MY} pose={pose} />
      <Path d="M-8,-39 Q0,-34 8,-39" stroke={BRONZE} strokeWidth={1.2} fill="none" />
      <Circle cx={-7} cy={-56} r={2.6} fill="#F29BA8" />
      <Circle cx={-7} cy={-56} r={1} fill="#F7E08A" />
    </G>
  );
}

function Elephant({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  const body = '#9A95B0';
  const shade = '#7E7896';
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {[-20, -8, 8, 18].map((lx, i) => (
        <Rect key={lx} x={lx - 4.5} y={-24} width={9} height={24} rx={3} fill={i % 2 ? shade : body} />
      ))}
      <Path d="M-26,-30 Q-34,-28 -33,-16" stroke={body} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Ellipse cx={0} cy={-34} rx={28} ry={18} fill={body} />
      <Path d="M-14,-50 Q0,-54 14,-50 L12,-29 Q0,-25 -12,-29 Z" fill="#B5402F" />
      <Path d="M-12,-31 Q0,-27 12,-31" stroke={BRONZE} strokeWidth={2} fill="none" />
      <Circle cx={0} cy={-40} r={3} fill={BRONZE} />
      <Circle cx={30} cy={-40} r={14} fill={body} />
      <Ellipse cx={22} cy={-38} rx={8} ry={12} fill={shade} />
      <Path d="M40,-36 Q48,-22 44,-8 Q42,-3 47,-3" stroke={body} strokeWidth={6.5} fill="none" strokeLinecap="round" />
      {/* nine tusks fanning forward */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = ((-70 + i * 17) * Math.PI) / 180;
        const ox = 37;
        const oy = -32;
        const L = 14 - Math.abs(i - 4) * 0.9;
        const ex = ox + Math.cos(a) * L;
        const ey = oy + Math.sin(a) * L;
        return (
          <Path
            key={i}
            d={`M${ox},${oy} Q${(ox + ex) / 2 + 2},${(oy + ey) / 2 + 3} ${ex},${ey - 2}`}
            stroke="#F6EDD4"
            strokeWidth={1.8}
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
      <Circle cx={33} cy={-45} r={1.5} fill="#1A1410" />
    </G>
  );
}

function Rooster({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  const legs = '#E0A040';
  const tail: Array<[string, number, number, number, number]> = [
    ['#2F7F6A', -18, -48, -22, -26],
    ['#1D4A42', -26, -42, -28, -20],
    [BRONZE, -24, -34, -27, -12],
    [SEA.mid, -18, -28, -22, -8],
  ];
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {tail.map(([col, cx, cy, ex, ey], i) => (
        <Path key={i} d={`M-6,-20 Q${cx},${cy} ${ex},${ey}`} stroke={col} strokeWidth={3.6} fill="none" strokeLinecap="round" />
      ))}
      <Path d="M-3,-9 L-4,0 M-7,0 L-1,0 M3,-9 L4,0 M1,0 L7,0" stroke={legs} strokeWidth={1.8} strokeLinecap="round" />
      {/* nine little spurs */}
      {Array.from({ length: 9 }, (_, i) => {
        const left = i < 5;
        const k = left ? i : i - 5;
        const ly = -8 + k * 1.6;
        const lx = left ? -3 - (ly + 9) / 9 : 3 + (ly + 9) / 9;
        return <Path key={i} d={`M${lx},${ly} l${left ? -2.4 : 2.4},-0.8`} stroke="#F2D27A" strokeWidth={1.1} strokeLinecap="round" />;
      })}
      <Ellipse cx={0} cy={-16} rx={11} ry={9} fill="#C8452F" />
      <Ellipse cx={-1} cy={-16} rx={7} ry={5} fill="#8E2A20" />
      <Path d="M4,-21 Q8,-27 8,-31 L13,-30 Q11,-24 9,-18 Z" fill="#D9653A" />
      <Circle cx={10.5} cy={-31} r={5} fill="#D9653A" />
      <Path d="M6,-35 q1,-5 3,-1.5 q1,-4.5 3,-0.5 q2,-3.5 3,1 Z" fill="#E2312A" />
      <Path d="M15,-32 L19.5,-30.5 L15,-29 Z" fill="#E8B84A" />
      <Ellipse cx={14} cy={-26.5} rx={1.6} ry={2.4} fill="#E2312A" />
      <Circle cx={12} cy={-32} r={0.9} fill="#1A1410" />
    </G>
  );
}

function Horse({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  const coat = '#8A5A3A';
  const coatDark = '#6E4630';
  const mane = '#D8452F';
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {[-16, -8, 10, 18].map((lx, i) => (
        <Rect key={lx} x={lx - 2.25} y={-24} width={4.5} height={24} rx={2} fill={i % 2 ? coatDark : coat} />
      ))}
      <Path d="M-20,-31 Q-33,-31 -32,-12" stroke={mane} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <Ellipse cx={0} cy={-30} rx={22} ry={10.5} fill={coat} />
      <Path d="M-8,-40 L8,-40 L7,-24 L-7,-24 Z" fill={BRONZE} opacity={0.9} />
      <Path d="M12,-36 Q18,-50 24,-56 L32,-52 Q24,-42 22,-27 Z" fill={coat} />
      <Path d="M24,-58 Q34,-60 40,-50 Q41,-45 37,-44 Q30,-47 26,-50 Z" fill={coat} />
      <Path d="M25,-58 L27,-64 L29.5,-58 Z" fill={coatDark} />
      <Circle cx={31} cy={-54} r={1.2} fill="#1A1410" />
      {/* nine red manes */}
      {Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        const mx = 25 - 13 * t;
        const my = -57 + 23 * t;
        return (
          <Path key={i} d={`M${mx},${my} q-7,-4 -12,1`} stroke={mane} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        );
      })}
    </G>
  );
}

/** Hùng-era stilt palace: three stilt halls with buffalo-horn roof tips. */
function StiltPalace({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <StiltHouse x={-64} y={0} s={0.8} wood={WOOD} roof={PALACE_ROOF} dark={PALACE_DARK} />
      <StiltHouse x={64} y={0} s={0.8} wood={WOOD} roof={PALACE_ROOF} dark={PALACE_DARK} />
      <StiltHouse x={0} y={0} s={1.35} wood={WOOD} roof={PALACE_ROOF} dark={PALACE_DARK} />
      {[
        [-46, -76, -1],
        [46, -76, 1],
        [-91, -45, -1],
        [-37, -45, 1],
        [37, -45, -1],
        [91, -45, 1],
      ].map(([hx, hy, d], i) => (
        <Path key={i} d={`M${hx},${hy} q${d * 5},-3 ${d * 4},-9`} stroke={PALACE_ROOF} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      ))}
      <Circle cx={0} cy={-58} r={4.5} fill={BRONZE} />
      <Circle cx={0} cy={-58} r={2} fill="#F2D27A" />
    </G>
  );
}

function PalaceGate({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-33} y={-58} width={7} height={58} fill={WOOD} />
      <Rect x={26} y={-58} width={7} height={58} fill={WOOD} />
      <Rect x={-30} y={-50} width={60} height={4} fill={WOOD} />
      <Path d="M-46,-57 Q-31,-62 -29,-71 L29,-71 Q31,-62 46,-57 Q0,-61 -46,-57 Z" fill={PALACE_ROOF} />
      <Path d="M-46,-57 q-5,-2 -5,-8 M46,-57 q5,-2 5,-8" stroke={PALACE_ROOF} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Circle cx={0} cy={-64} r={3.4} fill={BRONZE} />
      <Rect x={-36} y={-4} width={14} height={4} fill={PALACE_DARK} />
      <Rect x={22} y={-4} width={14} height={4} fill={PALACE_DARK} />
    </G>
  );
}

/** Wavy water surface from x0 to the right edge, filled down. */
function SeaRight({ c, x0, y, color, amp = 5, seed = 2 }: { c: SceneCtx; x0: number; y: number; color: string; amp?: number; seed?: number }) {
  const r = rng(seed);
  let d = `M${x0},${c.H + 2} Q${x0 + 6},${y + 8} ${x0 + 20},${y}`;
  for (let x = x0 + 20; x < c.W + 30; x += 28) {
    d += ` Q${x + 7},${y - amp - r() * 3} ${x + 14},${y} Q${x + 21},${y + amp * 0.6} ${x + 28},${y}`;
  }
  d += ` L${c.W + 30},${c.H + 2} Z`;
  return <Path d={d} fill={color} />;
}

/** Jade hill sweeping from the left edge down to x1 at the bottom. */
function JadeHill({ c, y, x1, color }: { c: SceneCtx; y: number; x1: number; color: string }) {
  return <Path d={`M-10,${c.H + 2} L-10,${y} Q${x1 * 0.45},${y - 10} ${x1 * 0.7},${y + (c.H - y) * 0.35} Q${x1 * 0.9},${y + (c.H - y) * 0.6} ${x1},${c.H + 2} Z`} fill={color} />;
}

/** Rain limited to a rectangle. */
function Drops({ x0, x1, y0, y1, seed, color, count = 30, opacity = 0.5 }: { x0: number; x1: number; y0: number; y1: number; seed: number; color: string; count?: number; opacity?: number }) {
  const r = rng(seed);
  return (
    <G opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const x = x0 + r() * (x1 - x0);
        const yy = y0 + r() * (y1 - y0);
        return <Path key={i} d={`M${x},${yy} l-2.5,8`} stroke={color} strokeWidth={1.2} strokeLinecap="round" />;
      })}
    </G>
  );
}

/** Swirling storm-cloud spiral (Thủy Tinh's wind). */
function Swirl({ x, y, s = 1, color, opacity = 1 }: { x: number; y: number; s?: number; color: string; opacity?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <Path d="M-16,0 C-16,-14 14,-14 14,0 C14,8 0,9 -2,2 C-3,-3 5,-4 6,0" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M-16,0 Q-26,4 -34,2" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
    </G>
  );
}

/** Villager with a shoulder pole and two baskets of earth. */
function Carrier({ x, y, s = 1, top, flip = false, stones = false }: { x: number; y: number; s?: number; top: string; flip?: boolean; stones?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Figure x={0} y={0} top={top} bottom="#3E3A40" hat="nonla" hatColor="#D9C98E" pose="hold" />
      <Path d="M-23,-41 L23,-43" stroke="#8A6A40" strokeWidth={2} strokeLinecap="round" />
      <Path d="M-21,-41 L-25,-24 M-21,-41 L-15,-24 M21,-43 L17,-24 M21,-43 L27,-24" stroke="#6B5236" strokeWidth={0.9} />
      {[-20, 22].map((bx) => (
        <G key={bx}>
          <Ellipse cx={bx} cy={-25} rx={6.5} ry={3} fill={stones ? '#8C93A0' : '#6E4A30'} />
          {stones ? <Circle cx={bx + 2} cy={-27} r={2.4} fill="#A6ADB8" /> : null}
          <Path d={`M${bx - 7},-24 L${bx + 7},-24 L${bx + 5},-14 L${bx - 5},-14 Z`} fill="#B08A52" />
        </G>
      ))}
    </G>
  );
}

function Umbrella({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M0,0 L0,20 q0,3 -3,3" stroke="#4A3626" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <Path d="M-18,0 Q-16,-15 0,-17 Q16,-15 18,0 Q13.5,-3 9,0 Q4.5,-3 0,0 Q-4.5,-3 -9,0 Q-13.5,-3 -18,0 Z" fill={color} />
      <Path d="M0,-17 L0,-20" stroke="#4A3626" strokeWidth={1.4} strokeLinecap="round" />
    </G>
  );
}

/** Dream bubble with a soft parchment glow. */
function Bubble({ c, x, y, r, children }: { c: SceneCtx; x: number; y: number; r: number; children: React.ReactNode }) {
  return (
    <G>
      <Circle cx={x} cy={y} r={r + 4} fill={c.p.glow} opacity={0.12} />
      <Circle cx={x} cy={y} r={r} fill="#2E3A6E" />
      <Circle cx={x} cy={y} r={r} fill={c.p.glow} opacity={0.16} />
      <Circle cx={x} cy={y} r={r} stroke={c.p.glow} strokeWidth={1.6} fill="none" opacity={0.8} />
      {children}
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

// Cover — Sơn Tinh on jade mountains (left), Thủy Tinh rising from gentle
// waves (right), Mỵ Nương on a little hill between them, soft dawn.
const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top={c.p.ink} mid={c.p.sky} bottom={c.p.skyLow} />
    <Glow c={c} name="dawn" cx={180} cy={250} r={200} color={c.p.glow} opacity={0.5} />
    <RibbonCloud x={84} y={74} s={1.3} color="#3A4886" />
    <RibbonCloud x={276} y={56} s={1.15} color="#3A4886" flip />
    <RibbonCloud x={196} y={120} s={0.9} color="#8496C6" opacity={0.6} />
    <RibbonCloud x={300} y={150} s={0.7} color="#8496C6" opacity={0.45} flip />
    {/* jade peaks rising on the left */}
    <Glow c={c} name="jadeAura" cx={80} cy={190} r={130} color={c.p.accent} opacity={0.45} />
    <Peaks base={300} peaks={[[30, 200, 60], [100, 170, 58], [160, 110, 46]]} color={JADE[3]} />
    <Peaks base={300} peaks={[[56, 140, 50], [126, 112, 48]]} color={JADE[2]} />
    {/* water on the right */}
    <WaveBand c={c} y={246} amp={8} len={46} color={SEA.light} opacity={0.9} />
    <Glow c={c} name="seaAura" cx={272} cy={210} r={80} color={THUY_AURA} opacity={0.4} />
    <ThuyTinh x={272} y={278} s={1.5} pose="out" flip />
    <WaveBand c={c} y={266} amp={9} len={44} phase={14} color={SEA.mid} />
    <Crest x={236} y={274} s={0.8} color={SEA.mid} foam={SEA.foam} flip />
    <Crest x={322} y={284} s={1.1} color={SEA.light} foam={SEA.foam} />
    <WaveBand c={c} y={306} amp={7} len={40} phase={6} color={SEA.deep} />
    <Crest x={270} y={322} s={0.9} color={SEA.deep} foam={SEA.foam} />
    {/* Sơn Tinh's hill */}
    <JadeHill c={c} y={232} x1={200} color={JADE[1]} />
    <Path d={`M-10,262 Q60,248 118,272`} stroke={JADE[0]} strokeWidth={3} fill="none" opacity={0.5} strokeLinecap="round" />
    <Glow c={c} name="sonAura" cx={84} cy={186} r={70} color={SON_AURA} opacity={0.5} />
    <SonTinh x={82} y={234} s={1.5} pose="out" />
    {/* Mỵ Nương on the little hill between */}
    <Path d="M118,372 Q180,250 246,372 Z" fill={c.p.ground} />
    <Path d="M140,330 Q180,300 222,330" stroke={JADE[0]} strokeWidth={2} fill="none" opacity={0.35} />
    <Glow c={c} name="myGlow" cx={180} cy={278} r={46} color={c.p.glow} opacity={0.45} />
    <MyNuong x={180} y={312} s={1.05} pose="hold" />
    <Finish c={c} vignette={0.4} />
  </G>
);

const pages = [
  // 1 — the Hùng King and Mỵ Nương in the palace courtyard; two glowing
  //     spirits approach, one from the mountains, one from the river
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} mid="#3F5488" bottom={c.p.skyLow} />
      <RibbonCloud x={120} y={36} s={1} color="#3A4886" />
      <RibbonCloud x={250} y={28} s={0.9} color="#3A4886" flip />
      <WaveBand c={c} y={150} amp={4} len={34} color={SEA.light} />
      <WaveBand c={c} y={160} amp={4} len={30} phase={10} color={SEA.mid} />
      <Crest x={300} y={156} s={0.55} color={SEA.light} foam={SEA.foam} />
      <Glow c={c} name="seaAura" cx={292} cy={120} r={34} color={THUY_AURA} opacity={0.6} />
      <ThuyTinh x={292} y={152} s={0.55} flip pose="out" />
      <Glow c={c} name="jadeAura" cx={60} cy={120} r={90} color={c.p.accent} opacity={0.5} />
      <Peaks base={172} peaks={[[24, 110, 46], [74, 86, 44], [118, 54, 34]]} color={JADE[2]} />
      <Peaks base={172} peaks={[[48, 62, 36]]} color={JADE[1]} />
      <Glow c={c} name="sonAura" cx={74} cy={98} r={30} color={SON_AURA} opacity={0.6} />
      <SonTinh x={74} y={118} s={0.5} pose="out" />
      <StiltPalace x={182} y={170} s={0.82} />
      {/* courtyard */}
      <Rect x={0} y={168} width={c.W} height={80} fill={c.p.ground} />
      {[184, 200, 220].map((yy, i) => (
        <Path key={i} d={`M0,${yy} Q180,${yy - 4} ${c.W},${yy}`} stroke={JADE[0]} strokeWidth={1} opacity={0.25} fill="none" />
      ))}
      <Ellipse cx={178} cy={224} rx={56} ry={6} fill={c.p.groundDeep} opacity={0.5} />
      <Figure x={158} y={222} s={1.15} {...KING} pose="out" />
      <MyNuong x={198} y={222} s={1.05} pose="hold" flip />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 2 — split scene: Sơn Tinh waves up green hills; Thủy Tinh calls swirling
  //     rain clouds and wind
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.ink} mid={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="jadeSide" cx={80} cy={170} r={150} color={c.p.accent} opacity={0.55} />
      <Glow c={c} name="seaSide" cx={290} cy={110} r={130} color={SEA.light} opacity={0.5} />
      {/* right: wind & rain */}
      <Swirl x={262} y={48} s={1.2} color="#7E92C8" />
      <Swirl x={318} y={84} s={0.9} color="#5E74B0" />
      <Cloud x={226} y={76} s={1.1} color="#4A5A92" />
      <Cloud x={306} y={44} s={1} color="#4A5A92" />
      <Drops x0={200} x1={370} y0={80} y1={210} seed={23} color="#CFE0F4" count={36} opacity={0.55} />
      {[[210, 120], [236, 104], [222, 150]].map(([wx, wy], i) => (
        <Path key={i} d={`M${wx},${wy} q14,-8 28,0 q10,6 20,-2`} stroke="#CFE0F4" strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.6} />
      ))}
      {/* left: rising hills */}
      <Peaks base={236} peaks={[[30, 160, 52], [96, 186, 56], [154, 120, 42]]} color={JADE[3]} />
      <Peaks base={236} peaks={[[60, 120, 46], [126, 96, 40]]} color={JADE[2]} />
      {[[96, 50], [30, 76], [154, 116]].map(([px, py], i) => (
        <Path key={i} d={`M${px - 12},${py - 4} Q${px},${py - 14} ${px + 12},${py - 4}`} stroke={SON_AURA} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7} />
      ))}
      {[40, 74, 116, 148].map((lx, i) => (
        <Path key={i} d={`M${lx},${232 - (i % 2) * 10} l0,-14`} stroke={SON_AURA} strokeWidth={1.6} strokeLinecap="round" opacity={0.5} />
      ))}
      {/* the seam between land and water */}
      <Path d="M200,0 Q186,120 172,240" stroke={c.p.glow} strokeWidth={10} fill="none" opacity={0.12} />
      <Path d="M200,0 Q186,120 172,240" stroke={c.p.glow} strokeWidth={2} fill="none" opacity={0.55} />
      <Path d="M-10,250 L-10,226 Q80,212 172,222 L172,250 Z" fill={JADE[1]} />
      <Glow c={c} name="sonAura" cx={110} cy={170} r={60} color={SON_AURA} opacity={0.45} />
      <SonTinh x={112} y={226} s={1.45} pose="wave" />
      <SeaRight c={c} x0={176} y={214} color={SEA.mid} />
      <Glow c={c} name="thuyAura" cx={266} cy={170} r={60} color={THUY_AURA} opacity={0.45} />
      <ThuyTinh x={266} y={238} s={1.45} pose="up" flip />
      <SeaRight c={c} x0={184} y={226} color={SEA.deep} seed={6} />
      <Crest x={322} y={232} s={0.9} color={SEA.light} foam={SEA.foam} />
      <Crest x={212} y={238} s={0.6} color={SEA.mid} foam={SEA.foam} flip />
      <Finish c={c} vignette={0.36} />
    </G>
  ),
  // 3 — the king announces the challenge; dreamy pictures of the nine-tusk
  //     elephant, nine-spur rooster and nine-red-mane horse float above him
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.ink} bottom="#34407A" />
      <Glow c={c} name="hall" cx={180} cy={160} r={170} color={c.p.glow} opacity={0.25} />
      {/* hall pillars and hanging red-gold banner */}
      {[36, 324].map((px) => (
        <G key={px}>
          <Rect x={px - 7} y={0} width={14} height={240} fill={WOOD} />
          <Rect x={px - 9} y={190} width={18} height={6} fill={PALACE_DARK} />
        </G>
      ))}
      <Path d="M0,0 L360,0 L360,10 Q180,22 0,10 Z" fill={PALACE_ROOF} />
      <Rect x={0} y={196} width={c.W} height={50} fill={c.p.groundDeep} />
      <Path d="M0,196 L360,196" stroke={JADE[1]} strokeWidth={2} opacity={0.5} />
      <RibbonCloud x={58} y={124} s={0.7} color="#5C6EA8" opacity={0.6} />
      <RibbonCloud x={304} y={130} s={0.7} color="#5C6EA8" opacity={0.6} flip />
      {/* dream bubbles */}
      <Circle cx={168} cy={106} r={3} fill={c.p.glow} opacity={0.6} />
      <Circle cx={174} cy={96} r={4} fill={c.p.glow} opacity={0.6} />
      <Bubble c={c} x={90} y={72} r={40}>
        <Elephant x={82} y={98} s={0.68} />
      </Bubble>
      <Bubble c={c} x={180} y={50} r={36}>
        <Rooster x={182} y={74} s={1.05} />
      </Bubble>
      <Bubble c={c} x={270} y={72} r={40}>
        <Horse x={264} y={96} s={0.72} />
      </Bubble>
      <Text9 x={90} y={28} color={c.p.glow} />
      <Text9 x={180} y={10} color={c.p.glow} />
      <Text9 x={270} y={28} color={c.p.glow} />
      <Ellipse cx={180} cy={226} rx={36} ry={5} fill={c.p.ink} opacity={0.4} />
      <Figure x={180} y={226} s={1.6} {...KING} pose="out" />
      <Finish c={c} vignette={0.36} />
    </G>
  ),
  // 4 — sunrise: the gifts stand at the palace gate as Sơn Tinh leads
  //     Mỵ Nương away toward his mountains
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} mid={c.p.skyLow} bottom={c.p.glow} />
      <Glow c={c} name="sunrise" cx={84} cy={140} r={120} color={c.p.glow} opacity={0.8} />
      <Sun cx={84} cy={140} r={18} color="#F7E8BE" />
      <RibbonCloud x={160} y={52} s={1} color="#8496C6" opacity={0.7} />
      <RibbonCloud x={280} y={70} s={0.8} color="#8496C6" opacity={0.6} flip />
      <Bird x={140} y={84} s={0.8} color={c.p.sky} />
      <Bird x={156} y={92} s={0.6} color={c.p.sky} wing="down" />
      <Peaks base={186} peaks={[[30, 92, 48], [126, 70, 44]]} color={JADE[2]} />
      <Peaks base={186} peaks={[[70, 56, 40]]} color={JADE[1]} />
      <Rect x={0} y={184} width={c.W} height={60} fill={c.p.ground} />
      <Path d="M150,246 Q120,208 64,188" stroke={JADE[0]} strokeWidth={10} fill="none" opacity={0.3} strokeLinecap="round" />
      <PalaceGate x={282} y={206} s={1.2} />
      <Horse x={276} y={208} s={0.62} flip />
      <Elephant x={204} y={214} s={0.72} flip />
      <Rooster x={240} y={226} s={0.85} flip />
      <Glow c={c} name="sonAura" cx={112} cy={180} r={44} color={SON_AURA} opacity={0.4} />
      <SonTinh x={108} y={222} s={1} flip />
      <MyNuong x={136} y={224} s={0.95} flip pose="out" />
      <Grass c={c} y={204} seed={4} color={JADE[3]} count={10} />
      <Finish c={c} vignette={0.25} />
    </G>
  ),
  // 5 — Thủy Tinh arrives late at the empty gate, frowning; grey-indigo
  //     clouds gather and the river begins to rise
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.ink} mid="#38447E" bottom="#6E80A8" />
      <Cloud x={70} y={50} s={1.4} color="#3A4572" />
      <Cloud x={200} y={36} s={1.6} color="#2E3864" />
      <Cloud x={300} y={58} s={1.3} color="#3A4572" />
      <Swirl x={250} y={80} s={1} color="#5C6EA8" opacity={0.8} />
      <Swirl x={120} y={86} s={0.8} color="#5C6EA8" opacity={0.6} />
      <Drops x0={170} x1={370} y0={70} y1={170} seed={51} color="#CFE0F4" count={18} opacity={0.4} />
      <Peaks base={176} peaks={[[20, 70, 40], [70, 50, 34]]} color={JADE[3]} opacity={0.8} />
      <Path d={`M-10,250 L-10,176 L196,176 Q214,200 206,250 Z`} fill={c.p.ground} />
      <Path d="M-10,176 L196,176" stroke={JADE[1]} strokeWidth={2} opacity={0.5} />
      <PalaceGate x={110} y={196} s={1.3} />
      <Path d="M80,196 L140,196" stroke={PALACE_DARK} strokeWidth={1} opacity={0.3} />
      {/* rising river */}
      <SeaRight c={c} x0={190} y={180} color={SEA.light} seed={9} />
      <Glow c={c} name="thuyAura" cx={262} cy={164} r={56} color={THUY_AURA} opacity={0.35} />
      <ThuyTinh x={262} y={226} s={1.45} flip frown />
      <SeaRight c={c} x0={196} y={210} color={SEA.mid} seed={3} />
      <Crest x={316} y={216} s={0.8} color={SEA.mid} foam={SEA.foam} />
      <SeaRight c={c} x0={206} y={230} color={SEA.deep} seed={12} amp={4} />
      <Path d="M200,196 l6,-6 M214,190 l6,-6" stroke={SEA.foam} strokeWidth={1.6} strokeLinecap="round" opacity={0.6} />
      <Finish c={c} vignette={0.38} />
    </G>
  ),
  // 6 — soft rain: Sơn Tinh calmly lifts the hills higher while villagers
  //     carry baskets of earth and stones to build a dike together
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#3B4A80" bottom="#93A8C8" />
      <RibbonCloud x={220} y={40} s={1.1} color="#6C7EB4" opacity={0.7} />
      <WaveBand c={c} y={168} amp={3} len={36} color={SEA.light} opacity={0.85} />
      <Glow c={c} name="jadeAura" cx={70} cy={100} r={100} color={c.p.accent} opacity={0.5} />
      <Peaks base={204} peaks={[[24, 100, 44], [116, 82, 40]]} color={JADE[3]} />
      <Peaks base={204} peaks={[[70, 110, 52]]} color={JADE[2]} />
      {[[70, 108], [70, 122], [116, 136]].map(([px, py], i) => (
        <Path key={i} d={`M${px - 16},${py} Q${px},${py - 10} ${px + 16},${py}`} stroke={SON_AURA} strokeWidth={1.8} fill="none" opacity={0.55} strokeLinecap="round" />
      ))}
      <Glow c={c} name="sonAura" cx={70} cy={74} r={36} color={SON_AURA} opacity={0.6} />
      <SonTinh x={70} y={96} s={0.72} pose="up" />
      {/* the dike */}
      <Path d="M140,206 L164,180 L380,180 L380,206 Z" fill="#7A5A3E" />
      <Path d="M164,180 L380,180" stroke="#A07A52" strokeWidth={3} />
      {[[178, 196], [204, 190], [232, 198], [262, 192], [298, 197], [330, 190]].map(([sx, sy], i) => (
        <Ellipse key={i} cx={sx} cy={sy} rx={5} ry={3.4} fill={i % 2 ? '#8C93A0' : '#A6ADB8'} />
      ))}
      <Rect x={0} y={204} width={c.W} height={40} fill={c.p.ground} />
      <Figure x={262} y={182} s={0.8} top={VILLAGER_TOPS[3]} bottom="#3E3A40" hat="nonla" hatColor="#D9C98E" pose="out" />
      <Ellipse cx={278} cy={178} rx={5} ry={3} fill="#A6ADB8" />
      <Carrier x={170} y={228} s={0.95} top={VILLAGER_TOPS[0]} />
      <Carrier x={222} y={230} s={0.9} top={VILLAGER_TOPS[1]} stones />
      <Carrier x={300} y={228} s={0.92} top={VILLAGER_TOPS[2]} flip />
      <Rain c={c} seed={61} color="#E2ECF6" count={50} opacity={0.35} />
      <Finish c={c} vignette={0.28} />
    </G>
  ),
  // 7 — the water flows gently back to the sea; the sun breaks through
  //     over bright green rice fields and smiling villagers
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.skyLow} mid="#A6C4D6" bottom="#F2E8C4" />
      <Glow c={c} name="sun" cx={250} cy={60} r={110} color={c.p.glow} opacity={0.75} />
      {[0, 1, 2].map((i) => (
        <Path
          key={i}
          d={`M${60 + i * 6},132 Q180,${8 + i * 6} ${300 - i * 6},132`}
          stroke={['#E9A58C', '#E9D9A6', '#9FD3B8'][i]}
          strokeWidth={4}
          fill="none"
          opacity={0.35}
        />
      ))}
      <Sun cx={250} cy={60} r={18} color="#F8EAC0" rays={c.p.glow} />
      <Cloud x={70} y={60} s={1.3} color="#8FA3C6" />
      <Cloud x={330} y={80} s={1.1} color="#E4EEEA" opacity={0.9} />
      <Cloud x={160} y={44} s={0.9} color="#E4EEEA" opacity={0.8} />
      <Rect x={0} y={122} width={c.W} height={10} fill={SEA.light} />
      <Peaks base={132} peaks={[[30, 44, 40], [78, 30, 30]]} color={JADE[2]} />
      <Paddies c={c} y={130} color="#6DB57A" line={c.p.ground} rows={6} />
      {/* the river winding back to the sea */}
      <Path d="M206,246 Q180,206 220,180 Q262,156 246,132 L262,132 Q282,160 236,186 Q204,208 236,246 Z" fill={SEA.light} />
      <Path d="M222,200 l10,-4 M238,170 l8,-4" stroke={SEA.foam} strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
      <StiltHouse x={84} y={158} s={0.6} wood={WOOD} roof={PALACE_ROOF} dark={PALACE_DARK} />
      <StiltHouse x={310} y={160} s={0.5} wood={WOOD} roof={PALACE_ROOF} dark={PALACE_DARK} />
      <Figure x={112} y={226} s={0.95} top={VILLAGER_TOPS[0]} bottom="#3E3A40" hat="nonla" hatColor="#D9C98E" pose="wave" />
      <Figure x={146} y={228} s={0.68} top={VILLAGER_TOPS[3]} bottom="#3E3A40" hairStyle="topknot" pose="up" />
      <Figure x={290} y={226} s={0.92} top={VILLAGER_TOPS[2]} bottom="#3E3A40" hairStyle="bun" dress pose="wave" flip />
      <Bird x={190} y={92} s={0.9} color="#3A4886" />
      <Bird x={206} y={100} s={0.7} color="#3A4886" wing="down" />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 8 — a cozy village in summer rain; neighbours share umbrellas while
  //     Mỵ Nương and Sơn Tinh watch kindly from a misty mountain
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.ink} mid={c.p.sky} bottom="#6E86AE" />
      <Glow c={c} name="jadeAura" cx={76} cy={70} r={80} color={c.p.accent} opacity={0.45} />
      <Peaks base={172} peaks={[[74, 110, 64], [140, 64, 40]]} color={JADE[2]} />
      <Peaks base={172} peaks={[[20, 70, 40]]} color={JADE[3]} />
      <Glow c={c} name="pair" cx={76} cy={52} r={30} color={c.p.glow} opacity={0.55} />
      <MyNuong x={68} y={66} s={0.42} />
      <SonTinh x={84} y={66} s={0.44} />
      <Mist c={c} y={120} color="#C8D6E8" opacity={0.22} height={22} />
      <Ridge c={c} y={176} amp={8} seed={18} color={JADE[3]} />
      <StiltHouse x={188} y={196} s={1.05} wood="#5E4232" roof={PALACE_ROOF} dark={PALACE_DARK} />
      <Rect x={184} y={164} width={8} height={10} fill={c.p.glow} opacity={0.9} />
      <Glow c={c} name="lamp1" cx={188} cy={168} r={24} color={c.p.glow} opacity={0.5} />
      <StiltHouse x={302} y={194} s={0.85} wood="#5E4232" roof={PALACE_ROOF} dark={PALACE_DARK} />
      <Rect x={299} y={168} width={6} height={8} fill={c.p.glow} opacity={0.85} />
      <Rect x={0} y={194} width={c.W} height={50} fill={c.p.groundDeep} />
      <Ellipse cx={230} cy={218} rx={26} ry={4} fill={SEA.light} opacity={0.5} />
      <Ellipse cx={100} cy={232} rx={20} ry={3} fill={SEA.light} opacity={0.4} />
      {/* neighbours under shared umbrellas */}
      <Figure x={136} y={228} s={0.9} top={VILLAGER_TOPS[0]} bottom="#3E3A40" hairStyle="bun" dress />
      <Figure x={158} y={228} s={0.66} top={VILLAGER_TOPS[3]} bottom="#3E3A40" hairStyle="topknot" pose="hold" flip />
      <Umbrella x={146} y={172} s={1.25} color="#B5402F" />
      <Figure x={248} y={228} s={0.92} top={VILLAGER_TOPS[1]} bottom="#3E3A40" pose="out" />
      <Figure x={272} y={228} s={0.9} top="#8C7A6A" bottom="#3E3A40" hair="#DDD8CE" hairStyle="bun" beard="#E8E4DA" flip />
      <Umbrella x={260} y={170} s={1.2} color={c.p.accent} />
      <Rain c={c} seed={81} color="#D6E2F2" count={60} opacity={0.42} />
      <Finish c={c} vignette={0.36} />
    </G>
  ),
];

/** Tiny "×9" tally of nine dots shown above each dream bubble. */
function Text9({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <G>
      {Array.from({ length: 9 }, (_, i) => (
        <Circle key={i} cx={x - 16 + i * 4} cy={y} r={1.3} fill={color} opacity={0.85} />
      ))}
    </G>
  );
}

export const SON_TINH_THUY_TINH: StoryScenes = { cover, pages };
