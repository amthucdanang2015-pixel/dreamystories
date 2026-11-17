// Hồ Gươm — serene, misty, reverent: the Lake of the Returned Sword.
// Signature: wide celadon water under pearl morning mist, weeping willows
// framing the edges, and a single warm gold note — the glowing sword and
// the Golden Turtle's hex-plated shell. Ends at Turtle Tower and the
// vermilion Thê Húc bridge at dusk.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Banyan,
  Bird,
  Boat,
  Figure,
  Finish,
  Fireflies,
  Glow,
  Grass,
  Lotus,
  Mist,
  Paddies,
  Pavilion,
  Ridge,
  SceneCtx,
  Sky,
  StoryScenes,
  Sun,
  Water,
} from '../kit';

// ─── Characters & constants ───────────────────────────────────

const LE_THAN = { top: '#8A7A5C', bottom: '#5E5040', hat: 'nonla' as const, hatColor: '#E6D8A8' };
const LE_LOI = { top: '#2F5E46', bottom: '#1F3F30', beard: '#1E1712', hat: 'khan' as const, hatColor: '#1E2A24', dress: true };
const KING = { top: '#E2B84A', bottom: '#C99A30', beard: '#1E1712', hat: 'crown' as const, hatColor: '#F2D27A', dress: true };
const FRIEND_TOPS = ['#5E7A5A', '#8A6A4A', '#4E6A6E', '#7A6A5A'];
const SHELL = '#D6A23A';
const PLATE = '#EBC665';
const RIM = '#A87A22';
const TURTLE_SKIN = '#A8A060';
const WILLOW_TRUNK = '#5A5A44';
const WILLOW_LEAF = '#8DB58A';
const WILLOW_LIGHT = '#B8D4A4';
const LAKE_TOP = '#B6D4C2';
const MIST = '#F4F6EC';
const STONE = '#E2DCC6';
const STONE_SHADE = '#B9B198';

// ─── Story-specific pieces ────────────────────────────────────

/** Weeping willow: leaning trunk, light crown, curtains of drooping strands. (x, y) = base. */
function Willow({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-5,0 Q-9,-30 -2,-56 Q6,-70 20,-78 L23,-74 Q9,-64 4,-52 Q-1,-30 6,0 Z" fill={WILLOW_TRUNK} />
      <Path d="M-1,-48 Q-14,-62 -28,-68" stroke={WILLOW_TRUNK} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Ellipse cx={2} cy={-76} rx={36} ry={11} fill={WILLOW_LEAF} />
      <Ellipse cx={-6} cy={-80} rx={20} ry={6} fill={WILLOW_LIGHT} opacity={0.8} />
      {Array.from({ length: 18 }, (_, i) => {
        const sx = -36 + i * 4.4;
        const sy = -76 + Math.abs(i - 8) * 0.6;
        const len = 38 + ((i * 37) % 28);
        return (
          <Path
            key={i}
            d={`M${sx},${sy} Q${sx + 3},${sy + len * 0.5} ${sx + 1},${sy + len}`}
            stroke={i % 3 === 0 ? WILLOW_LIGHT : WILLOW_LEAF}
            strokeWidth={2.4}
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
    </G>
  );
}

const hex = (cx: number, cy: number, r: number) => {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    d += `${i ? 'L' : 'M'}${cx + Math.cos(a) * r},${cy + Math.sin(a) * r * 0.8} `;
  }
  return `${d}Z`;
};

/**
 * The Golden Turtle, seen side-on at the waterline. (x, y) = waterline centre.
 * headUp lifts its head high (mouth near local 64,-46); otherwise mouth ≈ 66,-20.
 */
function GoldenTurtle({ x, y, s = 1, flip = false, headUp = false, head = true }: { x: number; y: number; s?: number; flip?: boolean; headUp?: boolean; head?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M28,0 Q44,4 52,14 Q40,12 26,5 Z" fill={TURTLE_SKIN} opacity={0.7} />
      <Path d="M-30,0 Q-44,4 -50,12 Q-38,10 -26,4 Z" fill={TURTLE_SKIN} opacity={0.7} />
      {head ? (
        headUp ? (
          <G>
            <Path d="M26,-10 Q40,-26 48,-42" stroke={TURTLE_SKIN} strokeWidth={11} fill="none" strokeLinecap="round" />
            <Ellipse cx={55} cy={-47} rx={12} ry={8.5} fill={TURTLE_SKIN} />
            <Circle cx={58} cy={-51} r={1.8} fill="#22352F" />
            <Circle cx={58.6} cy={-51.6} r={0.6} fill="#FFFFFF" />
            <Path d="M54.5,-54 Q58,-56 61.5,-54" stroke="#6E6A3A" strokeWidth={0.9} fill="none" strokeLinecap="round" />
            <Path d="M60,-43 Q63,-41.5 66,-43" stroke="#6E6A3A" strokeWidth={0.9} fill="none" strokeLinecap="round" />
          </G>
        ) : (
          <G>
            <Path d="M28,-8 Q42,-12 50,-18" stroke={TURTLE_SKIN} strokeWidth={10} fill="none" strokeLinecap="round" />
            <Ellipse cx={57} cy={-21} rx={12} ry={8} fill={TURTLE_SKIN} />
            <Circle cx={60} cy={-25} r={1.7} fill="#22352F" />
            <Circle cx={60.6} cy={-25.6} r={0.6} fill="#FFFFFF" />
            <Path d="M56.5,-28 Q60,-30 63.5,-28" stroke="#6E6A3A" strokeWidth={0.9} fill="none" strokeLinecap="round" />
            <Path d="M61,-17 Q64,-15.5 67,-17" stroke="#6E6A3A" strokeWidth={0.9} fill="none" strokeLinecap="round" />
          </G>
        )
      ) : null}
      <Path d="M-42,0 Q-40,-36 0,-40 Q40,-36 42,0 Z" fill={SHELL} />
      {[
        [0, -25, 9.5],
        [-18, -17, 8],
        [18, -17, 8],
        [-31, -7, 5.5],
        [31, -7, 5.5],
        [-9, -7, 6.5],
        [9, -7, 6.5],
      ].map(([hx, hy, r], i) => (
        <Path key={i} d={hex(hx, hy, r)} fill={PLATE} stroke={RIM} strokeWidth={1.2} />
      ))}
      <Path d="M-30,-24 Q-18,-36 2,-37" stroke="#FBEBB8" strokeWidth={2.4} fill="none" opacity={0.6} strokeLinecap="round" />
      <Path d="M-42,0 Q0,6 42,0" stroke={RIM} strokeWidth={3} fill="none" />
    </G>
  );
}

/** Slender glowing sword with a jade-studded hilt. (x, y) = pommel; blade along +x before rotation. */
function Sword({ x, y, s = 1, rot = 0, glow = '#E8C46A' }: { x: number; y: number; s?: number; rot?: number; glow?: string }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Ellipse cx={46} cy={0} rx={52} ry={10} fill={glow} opacity={0.22} />
      <Ellipse cx={48} cy={0} rx={36} ry={5} fill={glow} opacity={0.4} />
      <Path d="M17,-2 L74,-1.2 L82,0 L74,1.2 L17,2 Z" fill="#FBF8EC" />
      <Path d="M19,0 L74,0" stroke="#D6E6DC" strokeWidth={0.8} />
      <Rect x={1} y={-2.2} width={14} height={4.4} rx={2} fill="#6B4A2E" />
      <Circle cx={5} cy={0} r={1.3} fill="#5EC29A" />
      <Circle cx={10} cy={0} r={1.3} fill="#5EC29A" />
      <Rect x={14} y={-5.5} width={3} height={11} rx={1.2} fill="#D9A93A" />
      <Circle cx={0} cy={0} r={2.8} fill="#D9A93A" />
    </G>
  );
}

/** Royal dragon boat: vermilion hull, gold dragon prow and tail, optional canopy. (x, y) = waterline centre. */
function RoyalBoat({ x, y, s = 1, flip = false, canopy = true, hull }: { x: number; y: number; s?: number; flip?: boolean; canopy?: boolean; hull: string }) {
  const gold = '#D9A93A';
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {canopy ? (
        <G>
          <Rect x={-26} y={-40} width={2.4} height={34} fill="#5A2A1E" />
          <Rect x={-4} y={-40} width={2.4} height={34} fill="#5A2A1E" />
          <Path d="M-36,-38 Q-14,-50 8,-38 Q-14,-43 -36,-38 Z" fill={hull} />
          <Path d="M-36,-38 Q-14,-34 8,-38" stroke={gold} strokeWidth={1.4} fill="none" />
        </G>
      ) : null}
      <Path d="M-46,-6 Q-40,6 -20,7 L24,7 Q42,6 48,-6 Z" fill={hull} />
      <Path d="M-44,-2 Q0,3 46,-2" stroke={gold} strokeWidth={1.8} fill="none" />
      {[-30, -16, -2, 12, 26].map((sx) => (
        <Path key={sx} d={`M${sx},1 q3,-3 6,0`} stroke={gold} strokeWidth={1} fill="none" />
      ))}
      <Path d="M46,-6 Q50,-20 46,-30 Q54,-36 61,-29 Q63,-23 57,-21 Q52,-15 51,-6 Z" fill={gold} />
      <Path d="M50,-31 q-2,-6 2,-9 M55,-33 q0,-6 4,-7" stroke={gold} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <Circle cx={55} cy={-28} r={1.3} fill="#5A2A1E" />
      <Path d="M61,-25 q5,1 7,5" stroke={gold} strokeWidth={1} fill="none" strokeLinecap="round" />
      <Path d="M-46,-6 Q-55,-16 -51,-28 Q-46,-18 -40,-8 Z" fill={gold} />
    </G>
  );
}

/** Tháp Rùa — small three-tiered tower on a grassy islet. (x, y) = islet waterline centre. */
function TurtleTower({ x, y, s = 1, c, reflect = true }: { x: number; y: number; s?: number; c: SceneCtx; reflect?: boolean }) {
  const arch = (ax: number, ay: number, w: number, h: number) =>
    `M${ax - w / 2},${ay} L${ax - w / 2},${ay - h + w / 2} Q${ax},${ay - h - w / 4} ${ax + w / 2},${ay - h + w / 2} L${ax + w / 2},${ay} Z`;
  const body = (
    <G>
      <Rect x={-15} y={-34} width={30} height={24} fill={STONE} />
      <Rect x={6} y={-34} width={9} height={24} fill={STONE_SHADE} opacity={0.6} />
      <Path d={arch(-6, -12, 7, 16)} fill="#5E5A48" />
      <Path d={arch(6, -12, 5, 12)} fill="#5E5A48" />
      <Rect x={-18} y={-37} width={36} height={3.5} fill={STONE_SHADE} />
      <Rect x={-11} y={-52} width={22} height={15} fill={STONE} />
      <Rect x={4} y={-52} width={7} height={15} fill={STONE_SHADE} opacity={0.6} />
      <Path d={arch(-3, -39, 5, 10)} fill="#5E5A48" />
      <Path d={arch(5, -39, 4, 8)} fill="#5E5A48" />
      <Rect x={-14} y={-55} width={28} height={3} fill={STONE_SHADE} />
      <Rect x={-7} y={-66} width={14} height={11} fill={STONE} />
      <Path d={arch(0, -57, 4, 8)} fill="#5E5A48" />
      <Path d="M-9,-66 L9,-66 L6,-70 Q0,-76 -6,-70 Z" fill={STONE_SHADE} />
      <Path d="M0,-74 L0,-79" stroke={STONE_SHADE} strokeWidth={1.4} strokeLinecap="round" />
    </G>
  );
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {reflect ? (
        <G transform="scale(1,-0.6)" opacity={0.18}>
          {body}
        </G>
      ) : null}
      <Ellipse cx={0} cy={0} rx={44} ry={6} fill={c.p.groundDeep} />
      <Path d="M-42,0 Q-24,-12 0,-12 Q24,-12 42,0 Z" fill={c.p.ground} />
      <Circle cx={-28} cy={-12} r={8} fill={c.p.groundDeep} />
      <Circle cx={-22} cy={-18} r={7} fill={WILLOW_LEAF} />
      <Circle cx={30} cy={-12} r={7} fill={c.p.groundDeep} />
      <Circle cx={25} cy={-16} r={5} fill={WILLOW_LEAF} />
      <G transform="translate(0,-8)">{body}</G>
    </G>
  );
}

/** Vermilion Thê Húc bridge arching from (x0, y0) to (x1, y1), apex h above. */
function TheHucBridge({ x0, y0, x1, y1, h, color }: { x0: number; y0: number; x1: number; y1: number; h: number; color: string }) {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2 - 2 * h;
  const at = (t: number, off = 0): [number, number] => [
    (1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * mx + t * t * x1,
    (1 - t) * (1 - t) * (y0 + off) + 2 * t * (1 - t) * (my + off) + t * t * (y1 + off),
  ];
  const n = 14;
  return (
    <G>
      {Array.from({ length: 7 }, (_, i) => {
        const t = (i + 0.5) / 7;
        const [px, py] = at(t);
        return <Rect key={`p${i}`} x={px - 1.6} y={py} width={3.2} height={y0 + (y1 - y0) * t + 10 - py} fill="#7A2A1E" />;
      })}
      <Path d={`M${x0},${y0} Q${mx},${my} ${x1},${y1}`} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
      <Path d={`M${x0},${y0 - 10} Q${mx},${my - 10} ${x1},${y1 - 10}`} stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {Array.from({ length: n + 1 }, (_, i) => {
        const [px, py] = at(i / n);
        return <Path key={i} d={`M${px},${py} L${px},${py - 10}`} stroke={color} strokeWidth={1.6} />;
      })}
    </G>
  );
}

/** Concentric ripple rings on the water. */
function Ripples({ x, y, color, n = 3, r = 30, opacity = 0.6 }: { x: number; y: number; color: string; n?: number; r?: number; opacity?: number }) {
  return (
    <G opacity={opacity}>
      {Array.from({ length: n }, (_, i) => (
        <Ellipse key={i} cx={x} cy={y} rx={r * (1 + i * 0.6)} ry={r * 0.18 * (1 + i * 0.6)} stroke={color} strokeWidth={1.4 - i * 0.3} fill="none" />
      ))}
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

// Cover — the great Golden Turtle rises from the calm green lake, the glowing
// sword in its mouth; a small dragon boat nearby; willows; misty morning.
const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top="#B4CEC2" mid={c.p.sky} bottom={c.p.skyLow} />
    <Glow c={c} name="morning" cx={200} cy={150} r={170} color="#FFF6DC" opacity={0.7} />
    <Ridge c={c} y={192} amp={12} seed={6} color={c.p.groundDeep} opacity={0.35} />
    <Mist c={c} y={192} color={MIST} opacity={0.7} height={34} />
    <Water c={c} y={204} top={LAKE_TOP} bottom={c.p.ground} shimmer={MIST} />
    <Mist c={c} y={214} color={MIST} opacity={0.45} height={20} />
    <RoyalBoat x={96} y={238} s={0.55} hull={c.p.accent} />
    <Figure x={89} y={235} s={0.36} {...KING} sitting />
    <Glow c={c} name="turtle" cx={190} cy={230} r={140} color={c.p.glow} opacity={0.5} />
    <Ripples x={180} y={276} color={c.p.glow} r={70} n={3} opacity={0.55} />
    <GoldenTurtle x={170} y={276} s={1.6} headUp />
    <Sword x={226} y={214} s={1.05} rot={-10} glow={c.p.glow} />
    <Water c={c} y={290} top="#9CC4AE" bottom={c.p.groundDeep} name="near" seed={9} shimmer={MIST} />
    <Willow x={4} y={300} s={1.5} />
    <Willow x={356} y={306} s={1.45} flip />
    <Lotus x={300} y={330} s={1.1} color="#F2B8B0" leaf={c.p.groundDeep} />
    <Lotus x={64} y={340} s={0.9} color="#F2B8B0" leaf={c.p.groundDeep} bloom={false} />
    <Bird x={250} y={86} s={0.9} color={c.p.groundDeep} />
    <Bird x={268} y={96} s={0.7} color={c.p.groundDeep} wing="down" />
    <Finish c={c} vignette={0.26} />
  </G>
);

const pages = [
  // 1 — a quiet green lake with a dragon-like shimmer beneath the water;
  //     villagers on the shore look on, hopeful
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Ridge c={c} y={104} amp={10} seed={3} color={c.p.groundDeep} opacity={0.3} />
      <Mist c={c} y={106} color={MIST} opacity={0.7} height={24} />
      <Water c={c} y={110} top={LAKE_TOP} bottom={c.p.ground} shimmer={MIST} />
      {/* the Dragon King's shimmer under the water */}
      <Path d="M90,190 C130,150 170,214 214,170 C246,140 276,176 300,150" stroke={c.p.glow} strokeWidth={16} fill="none" opacity={0.16} strokeLinecap="round" />
      <Path d="M90,190 C130,150 170,214 214,170 C246,140 276,176 300,150" stroke={c.p.glow} strokeWidth={4} fill="none" opacity={0.4} strokeLinecap="round" />
      {[[120, 172], [150, 178], [180, 190], [212, 172], [240, 154], [268, 162]].map(([sx, sy], i) => (
        <Circle key={i} cx={sx} cy={sy} r={1.6} fill="#FBEBB8" opacity={0.8} />
      ))}
      <Path d="M300,150 q10,-6 14,0 q-4,6 -14,0 Z" fill={c.p.glow} opacity={0.4} />
      <Mist c={c} y={150} color={MIST} opacity={0.25} height={16} />
      {/* shore */}
      <Path d="M-10,250 L-10,196 Q60,188 120,206 Q150,220 170,250 Z" fill={c.p.ground} />
      <Path d="M-10,214 Q70,206 140,230" stroke={c.p.groundDeep} strokeWidth={6} fill="none" opacity={0.4} />
      <Willow x={32} y={206} s={1.6} />
      <Figure x={70} y={216} s={0.92} {...LE_THAN} pose="hold" />
      <Figure x={96} y={222} s={0.86} top={FRIEND_TOPS[2]} bottom="#3E4A44" hairStyle="bun" dress />
      <Figure x={118} y={230} s={0.62} top={FRIEND_TOPS[1]} bottom="#3E4A44" hairStyle="topknot" pose="out" />
      <Lotus x={290} y={214} s={1} color="#F2B8B0" leaf={c.p.groundDeep} />
      <Lotus x={320} y={226} s={0.8} color="#F2B8B0" leaf={c.p.groundDeep} bloom={false} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 2 — fisherman Lê Thận hauls up his net and finds a glowing sword blade
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#C2D8CC" bottom={c.p.skyLow} />
      <Glow c={c} name="dawn" cx={90} cy={110} r={110} color="#FFF4D8" opacity={0.7} />
      <Ridge c={c} y={122} amp={8} seed={12} color={c.p.groundDeep} opacity={0.25} />
      <Willow x={300} y={128} s={0.7} flip />
      <Mist c={c} y={124} color={MIST} opacity={0.7} height={22} />
      <Water c={c} y={130} top={LAKE_TOP} bottom={c.p.groundDeep} shimmer={MIST} />
      <Boat x={140} y={204} s={2.1} hull="#7A5A3A" />
      <Figure x={136} y={194} s={1.4} {...LE_THAN} pose="out" />
      {/* the net, rising from the water */}
      <Glow c={c} name="blade" cx={236} cy={168} r={64} color={c.p.glow} opacity={0.75} />
      <Path d="M166,146 Q210,138 262,152 Q268,186 236,204 Q196,198 188,180 Z" fill="#C9B88A" opacity={0.35} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Path key={`a${i}`} d={`M${172 + i * 16},${144 - (i > 3 ? -4 : 0)} Q${186 + i * 12},${178} ${196 + i * 8},${202}`} stroke="#8A7A5C" strokeWidth={0.9} fill="none" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Path key={`b${i}`} d={`M${176 + i * 4},${154 + i * 13} Q220,${150 + i * 14} ${262 - i * 6},${158 + i * 12}`} stroke="#8A7A5C" strokeWidth={0.9} fill="none" />
      ))}
      <Path d="M164,146 L262,152" stroke="#6E5E40" strokeWidth={1.6} />
      <Sword x={202} y={176} s={0.85} rot={-8} glow={c.p.glow} />
      {[[200, 210], [226, 214], [248, 206]].map(([dx, dy], i) => (
        <Ellipse key={i} cx={dx} cy={dy} rx={1.2} ry={2} fill={MIST} opacity={0.8} />
      ))}
      {[[268, 132], [278, 146], [256, 124]].map(([sx, sy], i) => (
        <Path key={i} d={`M${sx},${sy - 4} L${sx},${sy + 4} M${sx - 4},${sy} L${sx + 4},${sy}`} stroke="#FBEBB8" strokeWidth={1.4} strokeLinecap="round" />
      ))}
      <Ripples x={226} y={212} color={MIST} r={40} n={2} opacity={0.5} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 3 — at dusk in a quiet grove, Lê Lợi looks up at a soft light in a banyan
  //     and finds the jewelled sword hilt
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#A6BEB4" mid="#E6CCA6" bottom="#F2DDB8" />
      <Sun cx={70} cy={150} r={16} color="#F7E2B0" />
      <Glow c={c} name="dusk" cx={70} cy={150} r={80} color="#F7E2B0" opacity={0.6} />
      <Ridge c={c} y={168} amp={14} seed={33} color="#9AB8A6" />
      <Willow x={330} y={186} s={1.1} flip />
      <Ridge c={c} y={196} amp={8} seed={36} color={c.p.ground} />
      <Glow c={c} name="hiltLight" cx={168} cy={110} r={70} color={c.p.glow} opacity={0.8} />
      <Banyan x={226} y={206} s={1.45} trunk="#6E6450" leaf="#6E9C7A" leafLight="#9CC09A" root="#7E7460" />
      <Glow c={c} name="hiltCore" cx={164} cy={120} r={22} color="#FFF4D0" opacity={0.9} />
      <Path d="M164,96 L164,112" stroke="#7E7460" strokeWidth={1} />
      <G transform="translate(164,112) rotate(90)">
        <Rect x={0} y={-2.4} width={15} height={4.8} rx={2} fill="#6B4A2E" />
        <Circle cx={5} cy={0} r={1.5} fill="#5EC29A" />
        <Circle cx={10} cy={0} r={1.5} fill="#C2402F" />
        <Rect x={14} y={-6} width={3.2} height={12} rx={1.2} fill="#D9A93A" />
        <Circle cx={0} cy={0} r={3} fill="#D9A93A" />
      </G>
      <Rect x={0} y={204} width={c.W} height={40} fill={c.p.groundDeep} />
      <Grass c={c} y={206} seed={8} color={c.p.ground} count={12} />
      <Figure x={132} y={218} s={1.3} {...LE_LOI} pose="up" />
      <Fireflies c={c} color={c.p.glow} count={12} area={[90, 90, 200, 100]} />
      <Finish c={c} vignette={0.28} />
    </G>
  ),
  // 4 — at sunrise over the rice fields, Lê Lợi raises the glowing sword
  //     and his friends gather round him
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} mid="#F2DDB0" bottom="#F4C88A" />
      <Glow c={c} name="sunrise" cx={180} cy={150} r={150} color={c.p.glow} opacity={0.7} />
      <Sun cx={180} cy={150} r={26} color="#FBE7B0" rays="#F2D27A" />
      <Ridge c={c} y={146} amp={8} seed={41} color="#9AB8A6" />
      <Paddies c={c} y={150} color="#9CC08A" line={c.p.ground} rows={6} />
      <Path d="M70,250 Q120,200 180,198 Q240,200 290,250 Z" fill={c.p.ground} />
      <Glow c={c} name="sword" cx={198} cy={96} r={56} color={c.p.glow} opacity={0.8} />
      <Figure x={180} y={210} s={1.35} {...LE_LOI} pose="up" />
      <Sword x={200} y={136} s={0.75} rot={-78} glow={c.p.glow} />
      <Figure x={112} y={226} s={0.98} {...LE_THAN} pose="up" />
      <Figure x={140} y={222} s={0.92} top={FRIEND_TOPS[0]} bottom="#3E4A44" hairStyle="topknot" pose="wave" />
      <Figure x={222} y={222} s={0.94} top={FRIEND_TOPS[1]} bottom="#3E4A44" hat="khan" hatColor="#3A3A2A" pose="wave" flip />
      <Figure x={250} y={228} s={0.9} top={FRIEND_TOPS[2]} bottom="#3E4A44" hairStyle="bun" dress pose="up" flip />
      <Bird x={90} y={70} s={0.9} color={c.p.groundDeep} />
      <Bird x={274} y={64} s={0.8} color={c.p.groundDeep} wing="down" />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 5 — a sunny day on Tả Vọng lake: King Lê Lợi in yellow on his dragon boat
  //     as a golden turtle shell breaks the surface
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#B6D2C6" bottom={c.p.skyLow} />
      <Sun cx={300} cy={42} r={16} color="#FBEBC0" rays="#F2D27A" />
      <Glow c={c} name="sun" cx={300} cy={42} r={70} color="#FFF4D0" opacity={0.6} />
      <Ridge c={c} y={128} amp={10} seed={52} color={c.p.groundDeep} opacity={0.3} />
      <Mist c={c} y={130} color={MIST} opacity={0.5} height={18} />
      <Water c={c} y={136} top={LAKE_TOP} bottom={c.p.ground} shimmer={MIST} />
      <Glow c={c} name="turtle" cx={120} cy={186} r={60} color={c.p.glow} opacity={0.55} />
      <Ripples x={118} y={198} color={MIST} r={44} n={3} opacity={0.6} />
      <GoldenTurtle x={118} y={198} s={0.85} />
      <Water c={c} y={198} top="#8EB8A2" bottom={c.p.ground} name="near" seed={21} shimmer={MIST} />
      <Ripples x={244} y={202} color={MIST} r={44} n={2} opacity={0.5} />
      <RoyalBoat x={244} y={200} s={1.3} hull={c.p.accent} flip />
      <Figure x={258} y={194} s={0.85} {...KING} sitting flip />
      <Figure x={212} y={194} s={0.8} top="#7A2A1E" bottom="#5A2A1E" hat="khan" hatColor="#3A2A1E" pose="hold" flip />
      <Path d="M206,168 L196,214" stroke="#6B4A2E" strokeWidth={1.6} strokeLinecap="round" />
      <Willow x={26} y={160} s={1.4} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 6 — the Golden Turtle speaks gently to the smiling king, who holds the
  //     glowing sword out with both hands
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Ridge c={c} y={110} amp={8} seed={62} color={c.p.groundDeep} opacity={0.25} />
      <Mist c={c} y={112} color={MIST} opacity={0.6} height={20} />
      <Water c={c} y={116} top={LAKE_TOP} bottom={c.p.groundDeep} shimmer={MIST} />
      <Glow c={c} name="meeting" cx={190} cy={150} r={130} color={c.p.glow} opacity={0.45} />
      <Ripples x={110} y={206} color={MIST} r={60} n={2} opacity={0.5} />
      <GoldenTurtle x={110} y={206} s={1.7} headUp />
      {[[226, 110], [234, 102], [230, 92]].map(([bx, by], i) => (
        <Circle key={i} cx={bx} cy={by} r={1.5 + i * 0.5} fill="#FBEBB8" opacity={0.8} />
      ))}
      <Ripples x={274} y={212} color={MIST} r={46} n={2} opacity={0.5} />
      <RoyalBoat x={274} y={212} s={1.4} hull={c.p.accent} flip canopy={false} />
      <Figure x={276} y={204} s={1.3} {...KING} pose="hold" flip />
      <Sword x={276} y={167} s={0.95} rot={180} glow={c.p.glow} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 7 — the turtle dives with the sword; a soft golden glow spreads across
  //     the quiet lake
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#B4CABC" mid="#E8DDB8" bottom="#F2E2B8" />
      <Glow c={c} name="afternoon" cx={180} cy={90} r={160} color={c.p.glow} opacity={0.45} />
      <Ridge c={c} y={92} amp={8} seed={72} color={c.p.groundDeep} opacity={0.3} />
      <Water c={c} y={96} top="#C8DCC0" bottom={c.p.ground} shimmer={MIST} />
      <RoyalBoat x={300} y={116} s={0.5} hull={c.p.accent} flip />
      <Glow c={c} name="lakeGlow" cx={180} cy={176} r={150} color={c.p.glow} opacity={0.55} />
      <Ripples x={180} y={176} color={c.p.glow} r={46} n={4} opacity={0.8} />
      <G transform="rotate(28 180 176)">
        <GoldenTurtle x={180} y={176} s={1.2} />
        <Sword x={232} y={152} s={0.8} rot={4} glow={c.p.glow} />
      </G>
      <Rect x={0} y={178} width={c.W} height={70} fill={c.p.ground} opacity={0.55} />
      <Path d="M150,180 Q176,200 170,236" stroke={c.p.glow} strokeWidth={10} fill="none" opacity={0.25} strokeLinecap="round" />
      <Ripples x={180} y={180} color="#FBEBB8" r={60} n={3} opacity={0.6} />
      {[[100, 190], [250, 196], [140, 214], [226, 222], [80, 220], [290, 214]].map(([sx, sy], i) => (
        <Rect key={i} x={sx} y={sy} width={14 + (i % 3) * 6} height={1.6} rx={0.8} fill="#FBEBB8" opacity={0.7} />
      ))}
      <Willow x={20} y={130} s={1.3} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 8 — Hoàn Kiếm Lake today at dusk: Turtle Tower on its islet, the red
  //     Thê Húc bridge, families strolling peacefully
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#8EA8B0" mid="#E6C8B0" bottom="#F2DDB8" />
      <Glow c={c} name="dusk" cx={130} cy={130} r={150} color="#F6D8A8" opacity={0.6} />
      <Ridge c={c} y={136} amp={10} seed={82} color="#8EA8A0" opacity={0.6} />
      <Mist c={c} y={140} color={MIST} opacity={0.5} height={16} />
      <Water c={c} y={146} top="#E4D4B8" bottom={c.p.ground} shimmer={MIST} />
      <Rect x={188} y={146} width={24} height={60} fill={c.p.glow} opacity={0.12} />
      <TurtleTower x={200} y={178} s={1.15} c={c} />
      <Pavilion x={356} y={190} s={0.5} roof="#4A3A2E" pillar={c.p.accent} wall="#E2D2B4" />
      <TheHucBridge x0={256} y0={214} x1={350} y1={192} h={14} color={c.p.accent} />
      {[[284, 196], [322, 188]].map(([lx, ly], i) => (
        <G key={i}>
          <Circle cx={lx} cy={ly} r={6} fill={c.p.glow} opacity={0.3} />
          <Circle cx={lx} cy={ly} r={2.4} fill="#F2B04A" />
        </G>
      ))}
      <Path d="M-10,250 L-10,212 Q70,210 140,226 Q170,234 180,250 Z" fill={c.p.groundDeep} />
      <Path d="M-10,220 Q80,218 150,236" stroke={c.p.ground} strokeWidth={3} fill="none" opacity={0.6} />
      <Willow x={20} y={220} s={1.5} />
      <Figure x={62} y={232} s={0.8} top="#C2402F" bottom="#3E4A44" hairStyle="long" dress />
      <Figure x={80} y={234} s={0.55} top="#E2B84A" bottom="#3E4A44" hairStyle="bob" pose="wave" />
      <Figure x={98} y={236} s={0.82} top="#4E6A6E" bottom="#2E3A34" hairStyle="short" pose="hold" />
      <Figure x={140} y={242} s={0.76} top="#8A6A8A" bottom="#3E3A40" hairStyle="bun" dress flip />
      <Bird x={190} y={86} s={0.9} color={c.p.ink} />
      <Bird x={206} y={94} s={0.7} color={c.p.ink} wing="down" />
      <Finish c={c} vignette={0.28} />
    </G>
  ),
];

export const HO_GUOM: StoryScenes = { cover, pages };
