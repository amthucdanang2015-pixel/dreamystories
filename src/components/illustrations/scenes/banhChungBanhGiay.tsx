// Bánh Chưng, Bánh Giầy — festive Hùng-era Tết: lacquer red, gold and
// leaf green on warm parchment. Signature: the square green bánh chưng and
// the round white bánh giầy, which recur on almost every page, framed by
// peach blossoms, dong leaves, a Đông Sơn drum sun and hearth light.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Figure,
  Finish,
  Glow,
  Grass,
  Paddies,
  Pose,
  Ridge,
  RibbonCloud,
  SceneCtx,
  Sky,
  Stars,
  StiltHouse,
  StoryScenes,
  Sun,
} from '../kit';

const LANG = { top: '#8A5A34', bottom: '#6A4426', hairStyle: 'topknot' as const, skin: '#C98E62' };
const KING = {
  top: '#B8372C',
  bottom: '#8E2620',
  hair: '#8F8A84',
  hairStyle: 'short' as const,
  hat: 'crown' as const,
  hatColor: '#E9B44C',
  dress: true,
  skin: '#DDAA82',
};
const PRINCES = ['#3E8A8A', '#7A5A9A', '#D9902E', '#4E6AA8'];
const LACQUER = '#B8372C';
const LACQUER_DEEP = '#8E2620';
const GOLD = '#E9B44C';
const WOOD = '#7A4A2A';
const WOOD_DARK = '#4A2C1A';
const PETAL = '#F4A7B9';

/** Square bánh chưng: leaf-green with lighter bamboo-string ties. (x, y) = centre. */
function BanhChung({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Rect x={-15} y={-13} width={30} height={30} rx={3} fill="#24482A" opacity={0.35} />
      <Rect x={-15} y={-15} width={30} height={30} rx={3} fill="#3C7A3C" />
      <Rect x={-13} y={-13} width={26} height={26} rx={2} fill="#5E9C48" />
      <Path d="M-13,-13 L13,13 M-4,-13 L13,4 M-13,-4 L4,13" stroke="#4E8A3E" strokeWidth={0.8} opacity={0.6} />
      <Rect x={-7} y={-15.5} width={2.4} height={31} rx={1} fill="#E3EBB0" />
      <Rect x={4.6} y={-15.5} width={2.4} height={31} rx={1} fill="#E3EBB0" />
      <Rect x={-15.5} y={-7} width={31} height={2.4} rx={1} fill="#E3EBB0" />
      <Rect x={-15.5} y={4.6} width={31} height={2.4} rx={1} fill="#E3EBB0" />
      <Rect x={-12} y={-12} width={8} height={2} rx={1} fill="#8CC064" opacity={0.6} />
    </G>
  );
}

/** Round white bánh giầy on a leaf. (x, y) = base centre. */
function BanhGiay({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={0} rx={18} ry={4} fill="#4E8A4F" />
      <Path d="M-14,0 Q-15,-15 0,-15 Q15,-15 14,0 Z" fill="#FBF7EE" />
      <Path d="M6,-12 Q13,-9 13,0 L7,0 Q9,-7 6,-12 Z" fill="#E8DFCC" />
      <Ellipse cx={-5} cy={-10} rx={4} ry={2} fill="#FFFFFF" />
    </G>
  );
}

/** Peach blossom cluster: five round petals. */
function Blossom({ x, y, r = 3, bud = false }: { x: number; y: number; r?: number; bud?: boolean }) {
  if (bud) return <Circle cx={x} cy={y} r={r * 0.7} fill="#E77A98" />;
  return (
    <G>
      {[0, 72, 144, 216, 288].map((a) => (
        <Circle key={a} cx={x + Math.cos(((a - 90) * Math.PI) / 180) * r} cy={y + Math.sin(((a - 90) * Math.PI) / 180) * r} r={r * 0.85} fill={PETAL} />
      ))}
      <Circle cx={x} cy={y} r={r * 0.55} fill="#FCD3DC" />
      <Circle cx={x} cy={y} r={r * 0.28} fill="#C2416A" />
    </G>
  );
}

/** Peach branch with blossoms, growing to the right from (x, y). */
function PeachBranch({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  const blooms: Array<[number, number, number, boolean?]> = [
    [22, -7, 3.4], [40, -12, 3.8], [58, -26, 3.4], [68, -31, 3, true], [72, -5, 4], [96, -6, 3.6],
    [110, 12, 3.4], [122, -17, 3.6], [104, -14, 2.6, true], [84, -18, 3], [130, -22, 2.4, true],
  ];
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M0,0 Q30,-10 60,-6 Q90,-2 124,-18" stroke={WOOD_DARK} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <Path d="M40,-8 Q50,-24 68,-31 M86,-4 Q98,10 112,12 M80,-4 Q84,-14 86,-18" stroke={WOOD_DARK} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      {blooms.map(([bx, by, r, bud], i) => (
        <Blossom key={i} x={bx} y={by} r={r} bud={bud} />
      ))}
      <Path d="M50,-10 q4,-6 9,-4 q-4,4 -9,4 Z M116,-16 q4,-6 9,-3 q-4,4 -9,3 Z" fill="#7FA84E" />
    </G>
  );
}

/** Large dong leaf. (x, y) = stem. */
function DongLeaf({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Path d="M0,0 Q16,-11 38,0 Q16,11 0,0 Z" fill="#4E8A4F" />
      <Path d="M0,0 L36,0" stroke="#8CC064" strokeWidth={0.9} />
      <Path d="M10,0 l4,-4 M18,0 l4,-5 M26,0 l3,-4 M10,0 l4,4 M18,0 l4,5 M26,0 l3,4" stroke="#6EA45A" strokeWidth={0.6} />
    </G>
  );
}

/** Đông Sơn bronze-drum sun: concentric rings around a many-pointed star. */
function DrumSun({ x, y, r, color, opacity = 1 }: { x: number; y: number; r: number; color: string; opacity?: number }) {
  const n = 14;
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 0.5) / n) * Math.PI * 2;
    const a2 = ((i + 1) / n) * Math.PI * 2;
    d += `M${x + Math.cos(a0) * r * 0.16},${y + Math.sin(a0) * r * 0.16} L${x + Math.cos(a1) * r * 0.5},${y + Math.sin(a1) * r * 0.5} L${x + Math.cos(a2) * r * 0.16},${y + Math.sin(a2) * r * 0.16} Z `;
  }
  return (
    <G opacity={opacity}>
      <Circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={2} />
      <Circle cx={x} cy={y} r={r * 0.82} fill="none" stroke={color} strokeWidth={1} strokeDasharray="2 3" />
      <Circle cx={x} cy={y} r={r * 0.64} fill="none" stroke={color} strokeWidth={1.4} />
      <Circle cx={x} cy={y} r={r * 0.18} fill={color} />
      <Path d={d} fill={color} />
    </G>
  );
}

/** Bronze incense urn with three sticks and curling smoke. (x, y) = base. */
function Incense({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-4,-36 q-5,-8 0,-14 q5,-6 0,-12 M2,-36 q6,-8 1,-16" stroke="#F6E7CB" strokeWidth={1.2} fill="none" opacity={0.6} strokeLinecap="round" />
      {[-3, 0, 3].map((sx) => (
        <G key={sx}>
          <Path d={`M${sx},-12 L${sx * 1.6},-34`} stroke="#B8372C" strokeWidth={1} />
          <Circle cx={sx * 1.6} cy={-34} r={1} fill="#FFB24A" />
        </G>
      ))}
      <Path d="M-10,-12 Q-11,-2 -6,0 L6,0 Q11,-2 10,-12 Z" fill="#B0803A" />
      <Rect x={-11} y={-14} width={22} height={3} rx={1.5} fill="#D9A84E" />
      <Rect x={-7} y={-1} width={14} height={2} fill="#8A5E2A" />
    </G>
  );
}

/** Gold footed tray. (x, y) = base centre. */
function Tray({ x, y, s = 1, w = 30 }: { x: number; y: number; s?: number; w?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d={`M${-w / 4},0 L${w / 4},0 L${w / 6},-5 L${-w / 6},-5 Z`} fill="#C8902A" />
      <Rect x={-w / 2} y={-8} width={w} height={3.4} rx={1.7} fill={GOLD} />
    </G>
  );
}

/** Pyramid of five fruits on a gold tray. (x, y) = base. */
function FruitTray({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Circle cx={-8} cy={-13} r={5.5} fill="#E8902E" />
      <Circle cx={4} cy={-13} r={5.5} fill="#9CC45A" />
      <Circle cx={-2} cy={-22} r={5.5} fill="#D9473A" />
      <Path d="M8,-14 Q16,-26 10,-30 Q12,-22 6,-16 Z" fill="#F2CD4A" />
      <Path d="M-2,-27 l1,-4" stroke="#4E6A2E" strokeWidth={1.2} />
      <Tray x={0} y={0} w={30} />
    </G>
  );
}

/** Basket of rare treasures (fruit and seashells) for the princes. (x, y) = base. */
function TreasureBasket({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Circle cx={-5} cy={-10} r={4} fill="#D9473A" />
      <Circle cx={3} cy={-11} r={4} fill="#F2CD4A" />
      <Path d="M5,-9 Q8,-17 12,-9 Z" fill="#F6D6C8" />
      <Path d="M-11,-8 Q0,-6 11,-8 L8,0 L-8,0 Z" fill="#B88A4E" />
    </G>
  );
}

/** Lang Liêu with his cloth belt. */
function Lang({ x, y, s = 1, pose = 'down', flip = false, sitting = false }: { x: number; y: number; s?: number; pose?: Pose; flip?: boolean; sitting?: boolean }) {
  return (
    <G>
      <Figure x={x} y={y} s={s} {...LANG} pose={pose} flip={flip} sitting={sitting} />
      <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
        <Rect x={-9.4} y={-23 + (sitting ? 12 : 0)} width={18.8} height={3} rx={1.2} fill="#D9B26A" />
      </G>
    </G>
  );
}

/** The elderly Hùng King: grey beard, red-and-gold robe, crown. */
function King({ x, y, s = 1, pose = 'down', flip = false, sitting = false }: { x: number; y: number; s?: number; pose?: Pose; flip?: boolean; sitting?: boolean }) {
  const l = sitting ? 12 : 0;
  return (
    <G>
      <Figure x={x} y={y} s={s} {...KING} pose={pose} flip={flip} sitting={sitting} />
      <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
        <Path d={`M-2,${-39 + l} L2,${-39 + l} L4,${-6 + l} L-4,${-6 + l} Z`} fill={GOLD} opacity={sitting ? 0 : 1} />
        <Rect x={-9} y={-25 + l} width={18} height={2.6} fill={GOLD} />
        <Path d={`M-5,${-47 + l} Q0,${-24 + l} 7,${-47 + l} Q1,${-43 + l} -5,${-47 + l} Z`} fill="#C9C4BC" />
      </G>
    </G>
  );
}

/** Small glass-less clay oil lamp with flame. (x, y) = base. */
function OilLamp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-6,0 L6,0 L4,-4 L-4,-4 Z" fill="#8A5A34" />
      <Path d="M-8,-4 Q0,-1 8,-4 Q6,-9 0,-9 Q-6,-9 -8,-4 Z" fill="#A86A3A" />
      <Path d="M5,-8 Q2,-14 5,-19 Q8,-14 5,-8 Z" fill="#FFC24A" />
      <Path d="M5,-9 Q3.6,-12 5,-15 Q6.4,-12 5,-9 Z" fill="#FFF1C9" />
    </G>
  );
}

/** Hall interior backdrop: lacquer wall, beams, pillars and plank floor. */
function Hall({ c, floorY, top = '#6E2E20', bottom = '#A9502E' }: { c: SceneCtx; floorY: number; top?: string; bottom?: string }) {
  return (
    <G>
      <Sky c={c} top={top} bottom={bottom} name="wall" />
      <Rect x={0} y={0} width={c.W} height={16} fill={WOOD_DARK} />
      <Rect x={0} y={16} width={c.W} height={3} fill={GOLD} opacity={0.8} />
      <Rect x={0} y={floorY} width={c.W} height={c.H - floorY + 2} fill="#5A3420" />
      {[0.3, 0.6].map((t) => (
        <Path key={t} d={`M0,${floorY + (c.H - floorY) * t} L${c.W},${floorY + (c.H - floorY) * t}`} stroke="#4A2A18" strokeWidth={1} />
      ))}
      {[18, 342].map((px) => (
        <G key={px}>
          <Rect x={px - 9} y={16} width={18} height={floorY - 16} fill={LACQUER_DEEP} />
          <Rect x={px - 9} y={40} width={18} height={3} fill={GOLD} />
          <Rect x={px - 9} y={floorY - 14} width={18} height={3} fill={GOLD} />
        </G>
      ))}
    </G>
  );
}

const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top="#F0C47E" mid={c.p.sky} bottom={c.p.skyLow} />
    <Glow c={c} name="sun" cx={180} cy={180} r={190} color={c.p.glow} opacity={0.55} />
    <Sun cx={180} cy={128} r={30} color="#FBE3A8" />
    <DrumSun x={180} y={128} r={60} color={GOLD} opacity={0.45} />
    <Ridge c={c} y={226} amp={14} seed={4} color="#A9BC7E" />
    <StiltHouse x={78} y={242} s={1.05} wood="#9A6A3E" roof="#6A4A2E" dark={WOOD_DARK} />
    <StiltHouse x={286} y={244} s={1.35} wood="#9A6A3E" roof="#6A4A2E" dark={WOOD_DARK} />
    <Paddies c={c} y={242} color={c.p.ground} line={c.p.groundDeep} rows={5} />
    <PeachBranch x={-10} y={70} s={1.2} />
    <PeachBranch x={370} y={52} s={1.1} flip />
    <Glow c={c} name="cakes" cx={180} cy={262} r={80} color={c.p.glow} opacity={0.6} />
    <Lang x={180} y={326} s={1.45} pose="out" />
    <BanhChung x={146} y={262} s={1.3} rot={-4} />
    <BanhGiay x={216} y={280} s={1.3} />
    <DongLeaf x={16} y={348} s={1.4} rot={-30} />
    <DongLeaf x={344} y={350} s={1.4} rot={-150} />
    <Finish c={c} vignette={0.28} />
  </G>
);

const pages = [
  // 1 — the old Hùng King speaks to his sons in the wooden hall dressed for Tết
  (c: SceneCtx) => (
    <G>
      <Hall c={c} floorY={186} />
      <Glow c={c} name="drum" cx={240} cy={84} r={70} color={c.p.glow} opacity={0.5} />
      <DrumSun x={240} y={84} r={38} color={GOLD} />
      {[90, 290].map((bx) => (
        <G key={bx}>
          <Rect x={bx - 10} y={19} width={20} height={58} fill={LACQUER} />
          <Circle cx={bx} cy={48} r={6} fill={GOLD} />
          <Path d={`M${bx - 10},77 L${bx},85 L${bx + 10},77 Z`} fill={LACQUER} />
        </G>
      ))}
      {/* dais */}
      <Rect x={188} y={170} width={112} height={18} fill={LACQUER} />
      <Rect x={188} y={170} width={112} height={3} fill={GOLD} />
      <Rect x={222} y={134} width={36} height={38} rx={3} fill={LACQUER_DEEP} />
      <Rect x={222} y={134} width={36} height={4} rx={2} fill={GOLD} />
      <King x={232} y={180} s={1.08} pose="out" flip sitting />
      {/* sons, youngest Lang Liêu at the end in plain brown */}
      {PRINCES.slice(0, 3).map((col, i) => (
        <Figure key={col} x={62 + i * 32} y={214} s={0.9} top={col} bottom="#3A2A2A" hairStyle="topknot" />
      ))}
      <Lang x={160} y={214} s={0.9} />
      {/* peach blossom in a vase */}
      <Path d="M310,186 Q302,176 306,166 L322,166 Q326,176 318,186 Z" fill="#D9A84E" />
      <Path d="M314,166 Q310,140 296,120 M314,166 Q320,136 334,118" stroke={WOOD_DARK} strokeWidth={2} fill="none" strokeLinecap="round" />
      {[[296, 120, 3.4], [302, 134, 3], [334, 118, 3.4], [326, 136, 3], [312, 146, 2.6]].map(([bx, by, r], i) => (
        <Blossom key={i} x={bx} y={by} r={r} />
      ))}
      <Finish c={c} vignette={0.32} />
    </G>
  ),
  // 2 — princes hurry off with rare treasures; Lang Liêu quietly tends his rice
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={82} cy={56} r={80} color={c.p.glow} opacity={0.55} />
      <Sun cx={82} cy={56} r={16} color="#FBE3A8" />
      <Ridge c={c} y={100} amp={14} seed={8} color="#B9C58E" />
      <StiltHouse x={316} y={110} s={0.6} wood="#9A6A3E" roof="#6A4A2E" dark={WOOD_DARK} />
      {/* the dike path the princes hurry along */}
      <Rect x={0} y={106} width={c.W} height={14} fill="#C9A26E" />
      {PRINCES.slice(0, 3).map((col, i) => (
        <G key={col}>
          <G transform={`rotate(-8 ${64 + i * 30} 114)`}>
            <Figure x={64 + i * 30} y={114} s={0.5} top={col} bottom="#3A2A2A" hairStyle="topknot" pose="hold" flip />
          </G>
          <TreasureBasket x={56 + i * 30} y={100} s={0.6} />
        </G>
      ))}
      <Path d="M150,104 l10,0 M146,110 l12,0" stroke={c.p.ink} strokeWidth={1} strokeLinecap="round" opacity={0.35} />
      <Paddies c={c} y={120} color="#6E9E5A" line={c.p.groundDeep} rows={5} />
      {Array.from({ length: 22 }, (_, i) => {
        const row = Math.floor(i / 6);
        const x = 30 + (i % 6) * 56 + row * 14;
        const y = 140 + row * 24;
        return <Path key={i} d={`M${x},${y} l-3,-${8 + row * 2} M${x},${y} l0,-${10 + row * 2} M${x},${y} l3,-${8 + row * 2}`} stroke="#9CCB6A" strokeWidth={1.4} strokeLinecap="round" />;
      })}
      <Rect x={0} y={200} width={c.W} height={4} fill="#BFD8C8" opacity={0.5} />
      <G transform="rotate(14 222 220)">
        <Lang x={222} y={220} s={1.3} pose="hold" />
      </G>
      <Path d="M242,190 l-2,-10 M244,190 l1,-11 M246,190 l4,-9" stroke="#7FB84E" strokeWidth={2} strokeLinecap="round" />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 3 — night in his small house: Lang Liêu worries by the oil lamp, a dream cloud gathers
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#2E1C14" bottom="#5A3622" name="wall" />
      {Array.from({ length: 12 }, (_, i) => (
        <Path key={i} d={`M${i * 32},0 L${i * 32},186`} stroke="#3A2416" strokeWidth={2} opacity={0.5} />
      ))}
      {/* window with warm night */}
      <Rect x={44} y={40} width={64} height={54} fill="#1E120C" />
      <Stars c={c} count={8} seed={33} maxY={90} color="#F6E2B0" opacity={0.7} />
      <Rect x={40} y={36} width={72} height={6} fill={WOOD} />
      <Rect x={40} y={92} width={72} height={6} fill={WOOD} />
      {[58, 76, 94].map((bx) => (
        <Rect key={bx} x={bx - 1.5} y={40} width={3} height={54} fill={WOOD} />
      ))}
      <Rect x={0} y={184} width={c.W} height={60} fill="#4A2C1A" />
      <Rect x={150} y={196} width={180} height={34} fill="#B08A4E" />
      {[204, 212, 220].map((yy) => (
        <Path key={yy} d={`M152,${yy} L328,${yy}`} stroke="#8A6A3A" strokeWidth={1} opacity={0.6} />
      ))}
      <Glow c={c} name="lamp" cx={136} cy={170} r={130} color={c.p.glow} opacity={0.75} />
      <Rect x={110} y={186} width={50} height={6} rx={2} fill={WOOD} />
      <Rect x={114} y={192} width={4} height={14} fill={WOOD_DARK} />
      <Rect x={152} y={192} width={4} height={14} fill={WOOD_DARK} />
      <OilLamp x={130} y={186} s={1.2} />
      <Lang x={196} y={214} s={1.1} pose="hold" flip sitting />
      {/* dream puffs rising to a soft golden cloud */}
      <Circle cx={212} cy={140} r={3} fill="#F6E2B0" opacity={0.7} />
      <Circle cx={224} cy={124} r={5} fill="#F6E2B0" opacity={0.7} />
      <Glow c={c} name="dream" cx={272} cy={78} r={70} color={c.p.glow} opacity={0.6} />
      <G opacity={0.85}>
        <Ellipse cx={252} cy={84} rx={26} ry={16} fill="#F6E2B0" />
        <Ellipse cx={278} cy={72} rx={28} ry={22} fill="#F6E2B0" />
        <Ellipse cx={302} cy={86} rx={22} ry={14} fill="#F6E2B0" />
      </G>
      {[[262, 74], [284, 64], [296, 84], [274, 88]].map(([x, y], i) => (
        <Ellipse key={i} cx={x} cy={y} rx={2.4} ry={1.4} fill="#FFFFFF" />
      ))}
      <Finish c={c} vignette={0.4} />
    </G>
  ),
  // 4 — the golden dream spirit offers shining rice grains to the sleeping prince
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#3A2416" mid="#6A3A22" bottom="#8A4E2A" />
      <Glow c={c} name="spirit" cx={190} cy={100} r={170} color={c.p.glow} opacity={0.75} />
      <DrumSun x={190} y={96} r={64} color="#FBE3A8" opacity={0.35} />
      <RibbonCloud x={110} y={60} s={1.1} color="#F6D68A" opacity={0.8} />
      <RibbonCloud x={290} y={70} s={1} color="#F6D68A" opacity={0.8} flip />
      <RibbonCloud x={190} y={146} s={1.5} color="#FBE3A8" />
      <Figure x={190} y={142} s={1.2} top="#F6D68A" bottom="#F0C46A" hair="#FFF6DE" hairStyle="topknot" beard="#FFF6DE" dress pose="out" skin="#F6D2A8" />
      <Path d="M184,85 Q190,108 196,85 Q190,90 184,85 Z" fill="#FFF6DE" />
      {[[214, 98], [218, 104], [222, 98], [166, 98], [162, 104], [158, 100]].map(([x, y], i) => (
        <Ellipse key={i} cx={x} cy={y} rx={2} ry={1.2} fill="#FFFFFF" />
      ))}
      {[[206, 124], [196, 150], [178, 170], [160, 184], [222, 140]].map(([x, y], i) => (
        <G key={i}>
          <Circle cx={x} cy={y} r={4} fill="#FFF1C9" opacity={0.3} />
          <Ellipse cx={x} cy={y} rx={2} ry={1.2} fill="#FFFFFF" />
        </G>
      ))}
      {/* the sleeping prince on his mat */}
      <Rect x={60} y={208} width={200} height={14} rx={3} fill="#B08A4E" />
      <Ellipse cx={94} cy={208} rx={13} ry={6} fill="#E8D4AE" />
      <G transform="rotate(-90 160 200)">
        <Lang x={160} y={200} s={1.15} />
      </G>
      <Rect x={120} y={188} width={60} height={22} rx={8} fill={LACQUER} />
      <Rect x={120} y={188} width={60} height={3} rx={1.5} fill={GOLD} opacity={0.8} />
      <Finish c={c} vignette={0.42} />
    </G>
  ),
  // 5 — wrapping the square cake in dong leaves, then pounding rice for the round one
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={260} cy={70} r={110} color={c.p.glow} opacity={0.45} />
      <Ridge c={c} y={134} amp={10} seed={18} color="#A9BC7E" />
      <Paddies c={c} y={140} color={c.p.ground} line={c.p.groundDeep} rows={2} />
      {/* thatch eave framing the top-left */}
      <Path d="M-10,-10 L210,-10 L190,30 Q100,42 -10,52 Z" fill="#8A6A3E" />
      <Path d="M-10,48 Q100,38 192,28" stroke="#6A4A2E" strokeWidth={3} fill="none" />
      <PeachBranch x={370} y={40} s={0.9} flip />
      <Rect x={0} y={160} width={c.W} height={84} fill="#C9A26E" />
      {/* the work mat */}
      <Path d="M24,196 L200,196 L214,232 L10,232 Z" fill="#B08A4E" />
      <DongLeaf x={30} y={212} s={1.3} rot={-14} />
      <DongLeaf x={36} y={222} s={1.2} rot={10} />
      <Path d="M70,214 Q70,224 82,224 Q94,224 94,214 Z" fill="#8A5A34" />
      <Ellipse cx={82} cy={214} rx={12} ry={4} fill="#FBF7EE" />
      <Path d="M100,222 Q100,230 110,230 Q120,230 120,222 Z" fill="#8A5A34" />
      <Ellipse cx={110} cy={222} rx={10} ry={3.4} fill="#F2CD4A" />
      <BanhChung x={184} y={216} s={0.6} />
      <Lang x={138} y={216} s={1.3} pose="hold" sitting />
      <BanhChung x={152} y={190} s={0.85} rot={8} />
      <DongLeaf x={144} y={188} s={0.75} rot={-40} />
      {/* mortar, pestle and the round white cakes */}
      <Path d="M236,226 L240,194 L280,194 L284,226 Z" fill={WOOD} />
      <Ellipse cx={260} cy={194} rx={20} ry={5} fill={WOOD_DARK} />
      <Ellipse cx={260} cy={194} rx={15} ry={3.4} fill="#FBF7EE" />
      <Path d="M262,192 L292,128" stroke="#A8784A" strokeWidth={6} strokeLinecap="round" />
      <Path d="M266,170 q8,-6 6,-14" stroke={c.p.ink} strokeWidth={1.2} fill="none" opacity={0.3} strokeLinecap="round" />
      <BanhGiay x={306} y={226} s={1} />
      <BanhGiay x={322} y={214} s={0.75} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 6 — the Tết altar: among fancy gifts, the king smiles at the square and round cakes
  (c: SceneCtx) => (
    <G>
      <Hall c={c} floorY={200} top={LACQUER_DEEP} bottom={LACQUER} />
      <DrumSun x={180} y={66} r={44} color={GOLD} opacity={0.6} />
      {[118, 242].map((bx) => (
        <G key={bx}>
          <Rect x={bx - 8} y={19} width={16} height={50} fill="#7A1E18" />
          <Rect x={bx - 6} y={28} width={12} height={32} fill="none" stroke={GOLD} strokeWidth={1} />
        </G>
      ))}
      <Glow c={c} name="cakes" cx={182} cy={128} r={56} color={c.p.glow} opacity={0.7} />
      {/* altar table */}
      <Rect x={108} y={150} width={7} height={52} fill="#7A1E18" />
      <Rect x={245} y={150} width={7} height={52} fill="#7A1E18" />
      <Rect x={114} y={150} width={132} height={16} fill={LACQUER_DEEP} />
      {[130, 160, 200, 230].map((gx) => (
        <Circle key={gx} cx={gx} cy={158} r={3} fill={GOLD} />
      ))}
      <Rect x={102} y={142} width={156} height={9} fill={LACQUER} />
      <Rect x={102} y={150} width={156} height={2} fill={GOLD} />
      <FruitTray x={122} y={142} s={0.8} />
      <Path d="M138,142 Q140,132 148,132 Q152,140 150,142 Z" fill="#F6D6C8" />
      <Path d="M141,138 l6,0 M142,135 l5,0" stroke="#D9A898" strokeWidth={0.8} />
      <Rect x={222} y={128} width={16} height={14} rx={2} fill={LACQUER} stroke={GOLD} strokeWidth={1} />
      <Tray x={182} y={142} w={60} />
      <BanhChung x={168} y={120} s={0.95} />
      <BanhGiay x={198} y={134} s={0.9} />
      <Incense x={244} y={128} s={0.8} />
      <Rect x={109} y={128} width={4} height={14} fill="#F6E7CB" />
      <Path d="M111,128 q-2,-4 0,-7 q2,3 0,7 Z" fill="#FFB24A" />
      <Lang x={78} y={222} s={1.05} pose="out" />
      <King x={286} y={222} s={1.1} pose="hold" flip />
      <PeachBranch x={370} y={110} s={0.7} flip />
      <Finish c={c} vignette={0.34} />
    </G>
  ),
  // 7 — the moved king rests his hands on Lang Liêu's shoulders; the princes bow
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#F0C47E" bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={180} cy={110} r={150} color={c.p.glow} opacity={0.55} />
      <StiltHouse x={180} y={150} s={2.1} wood="#9A6A3E" roof="#6A4A2E" dark={WOOD_DARK} />
      {[40, 320].map((px, i) => (
        <G key={px}>
          <Path d={`M${px},164 L${px},40`} stroke={WOOD_DARK} strokeWidth={2.4} />
          <Path d={`M${px},42 Q${px + (i ? -24 : 24)},50 ${px + (i ? -30 : 30)},64 L${px},70 Z`} fill={LACQUER} />
          <Circle cx={px + (i ? -10 : 10)} cy={56} r={3} fill={GOLD} />
        </G>
      ))}
      <PeachBranch x={-6} y={30} s={0.8} />
      <PeachBranch x={366} y={20} s={0.8} flip />
      <Rect x={0} y={150} width={c.W} height={94} fill="#C9A26E" />
      <Path d="M0,170 L360,170" stroke="#B08A5A" strokeWidth={1} opacity={0.6} />
      {/* the cakes on a red stand between them */}
      <Rect x={164} y={142} width={32} height={10} fill={LACQUER} />
      <BanhChung x={172} y={132} s={0.5} />
      <BanhGiay x={188} y={140} s={0.5} />
      <G transform="rotate(12 84 216)">
        <Figure x={84} y={216} s={0.88} top={PRINCES[0]} bottom="#3A2A2A" hairStyle="topknot" pose="hold" />
      </G>
      <G transform="rotate(11 116 214)">
        <Figure x={116} y={214} s={0.88} top={PRINCES[1]} bottom="#3A2A2A" hairStyle="topknot" pose="hold" />
      </G>
      <G transform="rotate(-11 250 214)">
        <Figure x={250} y={214} s={0.88} top={PRINCES[2]} bottom="#3A2A2A" hairStyle="topknot" pose="hold" flip />
      </G>
      <G transform="rotate(-12 282 216)">
        <Figure x={282} y={216} s={0.88} top={PRINCES[3]} bottom="#3A2A2A" hairStyle="topknot" pose="hold" flip />
      </G>
      <Lang x={164} y={220} s={1.08} />
      <King x={198} y={220} s={1.22} pose="out" flip />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 8 — today: a family wraps bánh chưng around the warm cooking fire before Tết
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#1E100A" mid="#3A2416" bottom="#6A3420" />
      <Stars c={c} count={18} seed={88} maxY={90} color="#F6D68A" opacity={0.6} />
      <Path d="M-10,-10 L370,-10 L370,24 Q180,40 -10,26 Z" fill="#2A1A10" />
      <Rect x={16} y={20} width={8} height={176} fill="#2A1A10" />
      <Rect x={336} y={20} width={8} height={176} fill="#2A1A10" />
      <Rect x={0} y={188} width={c.W} height={56} fill="#3A2416" />
      <Glow c={c} name="hearth" cx={180} cy={172} r={170} color="#F09A3E" opacity={0.7} />
      <Glow c={c} name="hearthCore" cx={180} cy={196} r={70} color={c.p.glow} opacity={0.9} />
      {/* peach branch in a vase, lit by the fire */}
      <Path d="M304,188 Q298,178 302,168 L316,168 Q320,178 314,188 Z" fill="#D9A84E" />
      <Path d="M309,168 Q304,140 288,118 M309,168 Q316,136 330,116" stroke={WOOD_DARK} strokeWidth={2} fill="none" strokeLinecap="round" />
      {[[288, 118, 3.4], [296, 132, 3], [330, 116, 3.4], [322, 134, 3], [306, 146, 2.6]].map(([bx, by, r], i) => (
        <Blossom key={i} x={bx} y={by} r={r} />
      ))}
      {/* hearth: stones, logs, flames, big pot of cakes */}
      <Path d="M148,124 q-6,-10 0,-20 q6,-10 0,-20 M212,124 q6,-10 0,-20" stroke="#E8D4B0" strokeWidth={1.6} fill="none" opacity={0.4} strokeLinecap="round" />
      <Path d="M146,134 L214,134 L208,184 Q180,190 152,184 Z" fill="#2A1E18" />
      <Rect x={142} y={130} width={76} height={6} rx={3} fill="#4A3A30" />
      <BanhChung x={166} y={124} s={0.42} />
      <BanhChung x={184} y={122} s={0.42} rot={6} />
      <BanhChung x={200} y={125} s={0.42} rot={-4} />
      <Path d="M150,206 Q160,182 172,206 Z M168,208 Q182,174 196,208 Z M190,206 Q202,184 212,206 Z" fill="#F07A2E" />
      <Path d="M172,208 Q182,188 192,208 Z" fill="#FFD25A" />
      <Rect x={146} y={204} width={70} height={6} rx={3} fill="#5A3420" transform="rotate(-6 180 207)" />
      {[[146, 206], [214, 206], [180, 212]].map(([sx, sy], i) => (
        <Ellipse key={i} cx={sx} cy={sy} rx={9} ry={6} fill="#6A5A50" />
      ))}
      {/* the family */}
      <Figure x={84} y={218} s={1.05} top="#C8463E" bottom="#5A2A22" hairStyle="long" sitting pose="hold" />
      <BanhChung x={98} y={196} s={0.65} />
      <Figure x={122} y={222} s={0.72} top="#E9B44C" bottom="#5A3A2A" hairStyle="bob" sitting pose="hold" />
      <DongLeaf x={124} y={208} s={0.6} rot={-20} />
      <Figure x={238} y={222} s={0.72} top="#5E8A6A" bottom="#3A2A22" hairStyle="short" sitting pose="out" flip />
      <Figure x={278} y={218} s={1.08} top="#4E6A8A" bottom="#2A2A30" hairStyle="short" sitting pose="hold" flip />
      <BanhChung x={262} y={198} s={0.62} />
      <DongLeaf x={40} y={228} s={1.1} rot={-12} />
      <DongLeaf x={44} y={234} s={1} rot={14} />
      <BanhChung x={318} y={220} s={0.6} />
      <BanhChung x={318} y={202} s={0.6} />
      <BanhGiay x={336} y={234} s={0.6} />
      <Grass c={c} y={232} seed={5} color="#2A1A10" count={4} height={5} />
      <Finish c={c} vignette={0.42} />
    </G>
  ),
];

export const BANH_CHUNG_BANH_GIAY: StoryScenes = { cover, pages };
