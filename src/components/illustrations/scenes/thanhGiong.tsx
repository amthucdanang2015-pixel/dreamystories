// Thánh Gióng — heroic bronze-age energy, growth and courage, never violence.
// Signature: a Đông Sơn bronze-drum sun-star (concentric rings around a
// many-pointed star) burns through stormy slate skies on every page; red
// laterite earth, golden bamboo, and the iron horse whose breath glows like
// warm embers. Gióng grows from a tiny boy on a bamboo mat to a giant.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Bamboo,
  Cloud,
  Figure,
  Finish,
  Glow,
  Grass,
  Hut,
  Palm,
  Peaks,
  Pose,
  Ridge,
  SceneCtx,
  Sky,
  StoryScenes,
  rng,
} from '../kit';

// ─── Characters & constants ───────────────────────────────────

const GIONG_SMALL = { top: '#E6D3A8', bottom: '#8A5A3A', hairStyle: 'topknot' as const };
const GIONG_ARMOR = { top: '#5E6670', bottom: '#3E444C', hat: 'helmet' as const, hatColor: '#8A929C' };
const SASH = '#C8302A';
const MOTHER = { top: '#7A4E30', bottom: '#4A3020', hairStyle: 'bun' as const, hat: 'khan' as const, hatColor: '#1E1712', dress: true };
const FATHER = { top: '#8C6A48', bottom: '#4A3828', beard: '#DCD5C6', hair: '#CFC8BA', hairStyle: 'topknot' as const };
const MESSENGER = { top: '#3E62A0', bottom: '#24365E', hat: 'khan' as const, hatColor: '#26304A' };
const IRON = '#40454E';
const IRON_LIGHT = '#6E7682';
const IRON_DARK = '#2A2E35';
const BAMBOO_GOLD = '#D9B04A';
const BAMBOO_LEAF = '#A8A244';
const THATCH = '#B08A52';
const THATCH_DARK = '#7E5E36';
const WALL = '#D9B98A';
const DOOR = '#5A3A26';
const VILLAGER_TOPS = ['#B5683A', '#5E7A5A', '#8C5A7A', '#C9A24A', '#4E6A8C'];

// ─── Story-specific pieces ────────────────────────────────────

/** Đông Sơn bronze-drum sun-star: concentric rings, ticks, a many-pointed star. */
function DrumStar({
  x,
  y,
  r,
  color,
  ring,
  points = 14,
  opacity = 1,
}: {
  x: number;
  y: number;
  r: number;
  color: string;
  ring?: string;
  points?: number;
  opacity?: number;
}) {
  const rc = ring ?? color;
  let star = '';
  for (let i = 0; i < points * 2; i++) {
    const a = (i * Math.PI) / points - Math.PI / 2;
    const rr = i % 2 ? r * 0.17 : r * 0.47;
    star += `${i ? 'L' : 'M'}${x + Math.cos(a) * rr},${y + Math.sin(a) * rr} `;
  }
  star += 'Z';
  return (
    <G opacity={opacity}>
      <Circle cx={x} cy={y} r={r} fill={color} opacity={0.18} />
      {[1, 0.84, 0.68, 0.54].map((k, i) => (
        <Circle key={i} cx={x} cy={y} r={r * k} stroke={rc} strokeWidth={Math.max(1, r * 0.035)} fill="none" />
      ))}
      {Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2;
        return (
          <Path
            key={`t${i}`}
            d={`M${x + Math.cos(a) * r * 0.7},${y + Math.sin(a) * r * 0.7} L${x + Math.cos(a) * r * 0.82},${y + Math.sin(a) * r * 0.82}`}
            stroke={rc}
            strokeWidth={Math.max(0.8, r * 0.025)}
          />
        );
      })}
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2;
        return <Circle key={`d${i}`} cx={x + Math.cos(a) * r * 0.92} cy={y + Math.sin(a) * r * 0.92} r={Math.max(0.8, r * 0.03)} fill={rc} />;
      })}
      <Path d={star} fill={color} />
      <Circle cx={x} cy={y} r={r * 0.1} fill={rc} />
    </G>
  );
}

/** Gióng — tiny boy with a red sash, or the giant in iron armour with a red cape. */
function Giong({
  x,
  y,
  s = 1,
  pose = 'down',
  flip = false,
  sitting = false,
  armor = false,
}: {
  x: number;
  y: number;
  s?: number;
  pose?: Pose;
  flip?: boolean;
  sitting?: boolean;
  armor?: boolean;
}) {
  const lift = sitting ? 12 : 0;
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {armor ? <Path d={`M-8,${-40 + lift} Q-20,${-22 + lift} -18,${-2 + lift} L-6,${-12 + lift} Z`} fill={SASH} /> : null}
      <Figure x={0} y={0} {...(armor ? GIONG_ARMOR : GIONG_SMALL)} pose={pose} sitting={sitting} />
      {armor ? (
        <G>
          {[-35, -29, -23].map((py) => (
            <Path key={py} d={`M-8,${py + lift} Q0,${py + 2 + lift} 8,${py + lift}`} stroke={IRON_LIGHT} strokeWidth={1.2} fill="none" />
          ))}
          <Ellipse cx={-8} cy={-39 + lift} rx={4} ry={2.6} fill={IRON_LIGHT} />
          <Ellipse cx={8} cy={-39 + lift} rx={4} ry={2.6} fill={IRON_LIGHT} />
          <Rect x={-9} y={-21 + lift} width={18} height={3} fill={SASH} />
          <Path d={`M-9,${-52 + lift} Q0,${-66 + lift} 9,${-52 + lift}`} stroke="#F2C46B" strokeWidth={0.8} fill="none" opacity={0.8} />
        </G>
      ) : (
        <G>
          <Rect x={-9.5} y={-21 + lift} width={19} height={3.4} fill={SASH} />
          <Path d={`M6,${-18 + lift} q3,5 1,9`} stroke={SASH} strokeWidth={2} fill="none" strokeLinecap="round" />
        </G>
      )}
    </G>
  );
}

/** The iron horse: dark riveted plates, gentle face, golden ember breath. */
function IronHorse({
  x,
  y,
  s = 1,
  flip = false,
  gallop = false,
  breath = true,
}: {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  gallop?: boolean;
  breath?: boolean;
}) {
  const legs = gallop
    ? ['M16,-28 Q26,-22 34,-14', 'M22,-28 Q30,-16 28,-4', 'M-16,-28 Q-26,-18 -36,-12', 'M-22,-28 Q-30,-22 -40,-24']
    : ['M-22,-28 L-22,0', 'M-12,-28 L-12,0', 'M14,-28 L14,0', 'M24,-28 L24,0'];
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {legs.map((d, i) => (
        <G key={i}>
          <Path d={d} stroke={i % 2 ? IRON_DARK : IRON} strokeWidth={6.5} strokeLinecap="round" fill="none" />
        </G>
      ))}
      <Path d={gallop ? 'M-28,-40 Q-46,-46 -54,-34' : 'M-28,-38 Q-44,-38 -44,-18'} stroke={IRON_DARK} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Ellipse cx={0} cy={-38} rx={31} ry={14} fill={IRON} />
      <Ellipse cx={-4} cy={-46} rx={20} ry={4} fill={IRON_LIGHT} opacity={0.45} />
      <Path d="M-12,-51 Q-14,-38 -12,-25 M10,-51 Q12,-38 10,-25" stroke={IRON_DARK} strokeWidth={1.4} fill="none" />
      {[-46, -40, -34, -28].map((ry) => (
        <G key={ry}>
          <Circle cx={-13} cy={ry} r={1} fill={IRON_LIGHT} />
          <Circle cx={11} cy={ry} r={1} fill={IRON_LIGHT} />
        </G>
      ))}
      <Path d="M16,-46 Q22,-64 30,-72 L42,-66 Q32,-54 28,-30 Z" fill={IRON} />
      {[0, 1, 2, 3, 4].map((i) => {
        const mx = 30 - i * 3.6;
        const my = -72 + i * 6;
        return <Path key={i} d={`M${mx},${my} l-8,-2 l6,5 Z`} fill={IRON_DARK} />;
      })}
      <Path d="M30,-74 Q44,-78 53,-64 Q55,-58 49,-57 Q41,-60 34,-62 Z" fill={IRON} />
      <Path d="M32,-74 L34,-82 L37.5,-74 Z" fill={IRON_DARK} />
      <Circle cx={41} cy={-68} r={1.9} fill="#F2C46B" />
      <Path d="M47,-60 q2,1.5 4,0" stroke={IRON_DARK} strokeWidth={0.9} fill="none" strokeLinecap="round" />
      {breath ? (
        <G>
          <Circle cx={60} cy={-59} r={13} fill="#F2C46B" opacity={0.18} />
          <Circle cx={66} cy={-59} r={8} fill="#F2C46B" opacity={0.3} />
          <Circle cx={72} cy={-59} r={4.5} fill="#F7DC94" opacity={0.6} />
          <Circle cx={56} cy={-59} r={3.2} fill="#FBE7B0" opacity={0.85} />
          {[[64, -68], [74, -52], [80, -62], [70, -48]].map(([sx, sy], i) => (
            <Circle key={i} cx={sx} cy={sy} r={1.1} fill="#F7DC94" />
          ))}
        </G>
      ) : null}
    </G>
  );
}

/** Giant Gióng riding the iron horse, optionally holding a golden bamboo stalk. */
function Rider({
  x,
  y,
  s = 1,
  gallop = false,
  stalk = false,
  armor = true,
  roots = false,
  breath = true,
}: {
  x: number;
  y: number;
  s?: number;
  gallop?: boolean;
  stalk?: boolean;
  armor?: boolean;
  roots?: boolean;
  breath?: boolean;
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <IronHorse x={0} y={0} gallop={gallop} breath={breath} />
      {stalk ? (
        <G>
          <Path d="M10,-30 L24,-128" stroke={BAMBOO_GOLD} strokeWidth={3.4} strokeLinecap="round" />
          {[0.25, 0.45, 0.65, 0.85].map((t, i) => (
            <Rect key={i} x={10 + 14 * t - 2.6} y={-30 - 98 * t} width={5.2} height={1.4} fill="#A8862E" />
          ))}
          {[[24, -128, 1], [22, -116, -1], [20, -104, 1]].map(([lx, ly, d], i) => (
            <Path key={i} d={`M${lx},${ly} q${d * 9},-2 ${d * 18},5 q${-d * 9},-1 ${-d * 18},-5 Z`} fill={BAMBOO_LEAF} />
          ))}
          {roots ? (
            <Path d="M10,-30 q-4,6 -2,12 M10,-30 q2,7 6,10 M10,-30 q-7,3 -9,8" stroke="#8A5A3A" strokeWidth={1.2} fill="none" strokeLinecap="round" />
          ) : null}
        </G>
      ) : null}
      <Giong x={-2} y={-40} s={1} sitting armor={armor} pose={stalk ? 'up' : 'wave'} />
    </G>
  );
}

/** A woven bamboo mat. */
function Mat({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <G>
      <Path d={`M${x - w / 2},${y} L${x + w / 2},${y} L${x + w / 2 - 8},${y - 7} L${x - w / 2 + 8},${y - 7} Z`} fill="#C9A86A" />
      {Array.from({ length: Math.floor(w / 7) }, (_, i) => (
        <Path key={i} d={`M${x - w / 2 + 4 + i * 7},${y} L${x - w / 2 + 9 + i * 6.6},${y - 7}`} stroke="#A8864A" strokeWidth={1} />
      ))}
    </G>
  );
}

/** Inside the thatched house: woven wall, posts, roof underside, window, floor. */
function Interior({ c, wall, view, night = false }: { c: SceneCtx; wall: string; view: string; night?: boolean }) {
  return (
    <G>
      <Rect x={0} y={0} width={c.W} height={c.H} fill={wall} />
      {Array.from({ length: 22 }, (_, i) => (
        <Path key={i} d={`M0,${30 + i * 7} L${c.W},${30 + i * 7}`} stroke={c.p.ink} strokeWidth={0.8} opacity={0.12} />
      ))}
      <Rect x={232} y={50} width={78} height={62} fill={view} />
      {night
        ? [[242, 60], [296, 58], [304, 84], [250, 92]].map(([sx, sy], i) => <Circle key={i} cx={sx} cy={sy} r={0.9} fill="#F7E7C0" />)
        : null}
      <Bamboo x={262} y={118} h={70} color={night ? '#2A2622' : '#8A7A3A'} leaf={night ? '#2A2622' : BAMBOO_LEAF} stalks={3} seed={4} />
      {[244, 258, 272, 286, 300].map((bx) => (
        <Rect key={bx} x={bx - 1.4} y={50} width={2.8} height={62} fill={THATCH_DARK} />
      ))}
      <Rect x={228} y={46} width={86} height={5} fill={THATCH_DARK} />
      <Rect x={228} y={111} width={86} height={5} fill={THATCH_DARK} />
      <Rect x={18} y={0} width={13} height={200} fill={THATCH_DARK} />
      <Rect x={330} y={0} width={13} height={200} fill={THATCH_DARK} />
      <Path d="M-10,0 L370,0 L370,24 Q180,40 -10,24 Z" fill={THATCH} />
      {Array.from({ length: 24 }, (_, i) => (
        <Path key={i} d={`M${i * 16 - 4},${24 + Math.sin(i) * 2 + (i > 4 && i < 19 ? 8 : 2)} l3,8`} stroke={THATCH} strokeWidth={2} strokeLinecap="round" />
      ))}
      <Rect x={0} y={192} width={c.W} height={52} fill={c.p.groundDeep} />
      <Path d={`M0,192 L${c.W},192`} stroke={c.p.ground} strokeWidth={2} />
    </G>
  );
}

/** Villager with a shoulder pole and two baskets (rice, greens or fruit). */
function Carrier({ x, y, s = 1, top, flip = false, load = 'rice' }: { x: number; y: number; s?: number; top: string; flip?: boolean; load?: 'rice' | 'greens' | 'fruit' }) {
  const heap = load === 'rice' ? '#F4EEDC' : load === 'greens' ? '#6E9A3E' : '#E8873A';
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Figure x={0} y={0} top={top} bottom="#4A3020" hat="nonla" hatColor="#E2CF94" pose="hold" />
      <Path d="M-23,-41 L23,-43" stroke="#8A6A40" strokeWidth={2} strokeLinecap="round" />
      <Path d="M-21,-41 L-25,-24 M-21,-41 L-15,-24 M21,-43 L17,-24 M21,-43 L27,-24" stroke="#6B5236" strokeWidth={0.9} />
      {[-20, 22].map((bx) => (
        <G key={bx}>
          <Ellipse cx={bx} cy={-25} rx={6.5} ry={3.4} fill={heap} />
          {load === 'fruit' ? <Circle cx={bx + 2} cy={-28} r={2.4} fill="#F2B44A" /> : null}
          <Path d={`M${bx - 7},-24 L${bx + 7},-24 L${bx + 5},-14 L${bx - 5},-14 Z`} fill="#B08A52" />
          <Path d={`M${bx - 6},-20 L${bx + 6},-20`} stroke="#8A6A3A" strokeWidth={0.8} />
        </G>
      ))}
    </G>
  );
}

/** Bronze drum, seen from the side, sun-star on its tympanum. */
function BronzeDrum({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-27,-32 Q-32,-18 -22,-2 L22,-2 Q32,-18 27,-32 Z" fill="#B8863A" />
      {[-24, -16, -9].map((by) => (
        <Path key={by} d={`M-27,${by} Q0,${by + 4} 27,${by}`} stroke="#8A5E26" strokeWidth={1.4} fill="none" />
      ))}
      <Path d="M-22,-2 L22,-2 L20,2 L-20,2 Z" fill="#8A5E26" />
      <Ellipse cx={0} cy={-32} rx={28} ry={8} fill={BAMBOO_GOLD} />
      <G transform="translate(0,-32) scale(1,0.28)">
        <DrumStar x={0} y={0} r={26} color="#F7DC94" ring="#8A5E26" />
      </G>
    </G>
  );
}

/** Festival flag on a bamboo pole with the sun-star emblem. */
function Flag({ x, y, h = 70, color, flip = false }: { x: number; y: number; h?: number; color: string; flip?: boolean }) {
  const d = flip ? -1 : 1;
  return (
    <G>
      <Path d={`M${x},${y} L${x},${y - h}`} stroke={BAMBOO_GOLD} strokeWidth={2.2} strokeLinecap="round" />
      <Path d={`M${x},${y - h + 2} Q${x + d * 16},${y - h + 6} ${x + d * 30},${y - h + 2} L${x + d * 26},${y - h + 14} L${x + d * 30},${y - h + 26} Q${x + d * 16},${y - h + 22} ${x},${y - h + 26} Z`} fill={color} />
      <DrumStar x={x + d * 13} y={y - h + 14} r={6.5} color="#F7DC94" points={8} />
    </G>
  );
}

/** Bronze light rays fanning from a point. */
function Rays({ x, y, color, count = 9, len = 240, spread = 1.2, start = Math.PI / 2, opacity = 0.18 }: { x: number; y: number; color: string; count?: number; len?: number; spread?: number; start?: number; opacity?: number }) {
  return (
    <G opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const a = start - spread / 2 + (spread * i) / (count - 1);
        const a2 = a + 0.05;
        return (
          <Path
            key={i}
            d={`M${x},${y} L${x + Math.cos(a) * len},${y + Math.sin(a) * len} L${x + Math.cos(a2) * len},${y + Math.sin(a2) * len} Z`}
            fill={color}
          />
        );
      })}
    </G>
  );
}

function Dust({ x, y, seed, color }: { x: number; y: number; seed: number; color: string }) {
  const r = rng(seed);
  return (
    <G>
      {Array.from({ length: 6 }, (_, i) => (
        <Circle key={i} cx={x - i * 9 - r() * 6} cy={y - r() * 8} r={3 + r() * 5} fill={color} opacity={0.35 + r() * 0.2} />
      ))}
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

// Cover — tall young Gióng on his glowing iron horse on a hill, golden bamboo
// stalk raised, the bronze sun-star blazing behind, villagers waving below.
const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top={c.p.ink} mid={c.p.sky} bottom={c.p.skyLow} />
    <Rays x={186} y={118} color={c.p.glow} count={11} spread={Math.PI * 2} len={300} opacity={0.14} />
    <Glow c={c} name="sunStar" cx={186} cy={118} r={150} color={c.p.glow} opacity={0.55} />
    <DrumStar x={186} y={118} r={82} color={c.p.glow} ring={c.p.accent} />
    <Cloud x={50} y={64} s={1.5} color="#3A3E52" />
    <Cloud x={320} y={92} s={1.3} color="#3A3E52" />
    <Cloud x={300} y={40} s={1} color="#5A5E74" opacity={0.8} />
    <Ridge c={c} y={262} amp={14} seed={4} color={c.p.groundDeep} />
    {/* the hill */}
    <Path d="M20,372 Q70,262 190,254 Q300,260 350,372 Z" fill={c.p.ground} />
    <Path d="M60,300 Q180,248 310,300" stroke="#8C9A3E" strokeWidth={8} fill="none" opacity={0.55} strokeLinecap="round" />
    <Glow c={c} name="horseGlow" cx={186} cy={200} r={100} color={c.p.glow} opacity={0.35} />
    <Rider x={168} y={268} s={1.45} stalk />
    {/* bamboo-hedged village below */}
    <Bamboo x={30} y={344} h={110} color={BAMBOO_GOLD} leaf={BAMBOO_LEAF} stalks={4} seed={3} />
    <Bamboo x={334} y={346} h={104} color={BAMBOO_GOLD} leaf={BAMBOO_LEAF} stalks={4} seed={8} />
    <Rect x={0} y={330} width={c.W} height={34} fill={c.p.groundDeep} />
    <Hut x={86} y={338} s={0.62} wall={WALL} roof={THATCH} door={DOOR} />
    <Hut x={282} y={340} s={0.58} wall={WALL} roof={THATCH} door={DOOR} />
    {[[124, '#B5683A', 'wave'], [146, '#5E7A5A', 'up'], [222, '#8C5A7A', 'up'], [244, '#C9A24A', 'wave']].map(([fx, top, pose], i) => (
      <Figure key={i} x={fx as number} y={354} s={0.48} top={top as string} bottom="#4A3020" hairStyle={i % 2 ? 'bun' : 'topknot'} pose={pose as Pose} flip={i > 1} />
    ))}
    <Finish c={c} vignette={0.4} />
  </G>
);

const pages = [
  // 1 — inside the thatched house at night: the old couple and little Gióng,
  //     three and still silent, lying on his bamboo mat looking up
  (c: SceneCtx) => (
    <G>
      <Interior c={c} wall="#6A4630" view="#3A3E52" night />
      <DrumStar x={272} y={70} r={12} color={c.p.glow} opacity={0.8} />
      <Glow c={c} name="lamp" cx={198} cy={176} r={110} color={c.p.glow} opacity={0.5} />
      <Mat x={180} y={204} w={96} />
      <G transform="translate(194,198) rotate(-90)">
        <Giong x={0} y={0} s={0.6} />
      </G>
      <Path d="M166,182 q2,-6 0,-12 M174,178 q2,-6 0,-12" stroke={c.p.glow} strokeWidth={1} fill="none" opacity={0.5} strokeLinecap="round" />
      <Figure x={92} y={210} s={1.05} {...FATHER} sitting />
      <Figure x={268} y={210} s={1.05} {...MOTHER} sitting flip pose="hold" />
      {/* oil lamp */}
      <Path d="M206,190 L218,190 L214,196 L210,196 Z" fill="#B8863A" />
      <Path d="M212,190 q-3,-6 0,-10 q3,4 0,10 Z" fill="#F7DC94" />
      <Finish c={c} vignette={0.42} />
    </G>
  ),
  // 2 — the royal messenger drums down the red village lane; little Gióng
  //     sits up and speaks for the first time to his surprised mother
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} mid="#7A6E6E" bottom={c.p.skyLow} />
      <Rays x={110} y={40} color={c.p.glow} count={7} spread={1.4} len={220} start={Math.PI / 2 + 0.3} />
      <Glow c={c} name="sunStar" cx={110} cy={40} r={60} color={c.p.glow} opacity={0.6} />
      <DrumStar x={110} y={40} r={24} color={c.p.glow} ring={c.p.accent} />
      <Cloud x={200} y={40} s={1.3} color="#3A3E52" />
      <Cloud x={40} y={60} s={1} color="#3A3E52" />
      <Bamboo x={22} y={172} h={110} color={BAMBOO_GOLD} leaf={BAMBOO_LEAF} stalks={4} seed={2} />
      <Bamboo x={176} y={168} h={90} color={BAMBOO_GOLD} leaf={BAMBOO_LEAF} stalks={3} seed={5} />
      <Rect x={0} y={166} width={c.W} height={80} fill={c.p.ground} />
      <Path d="M100,248 Q150,200 170,166 L196,166 Q190,200 260,248 Z" fill="#C2603E" opacity={0.6} />
      <Hut x={290} y={190} s={1.5} wall={WALL} roof={THATCH} door={DOOR} />
      {/* messenger with drum */}
      <Figure x={92} y={222} s={1.1} {...MESSENGER} pose="hold" />
      <Ellipse cx={108} cy={196} rx={8} ry={6} fill="#B8863A" />
      <Ellipse cx={108} cy={191} rx={8} ry={2.4} fill={BAMBOO_GOLD} />
      {[0, 1].map((i) => (
        <Path key={i} d={`M${122 + i * 7},${180 - i * 3} q5,8 0,16`} stroke={c.p.glow} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.75} />
      ))}
      {/* mother & Gióng at the door */}
      <Figure x={258} y={222} s={1} {...MOTHER} pose="out" />
      <Mat x={302} y={224} w={40} />
      <Giong x={300} y={222} s={0.7} sitting pose="wave" flip />
      {[0, 1, 2].map((i) => (
        <Path key={i} d={`M${290 - i * 2},${188 + i * 6} l-7,${-3 + i * 3}`} stroke="#FBE7B0" strokeWidth={1.8} strokeLinecap="round" />
      ))}
      <Grass c={c} y={210} seed={9} color={c.p.groundDeep} count={8} />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 3 — tiny Gióng speaks confidently to the kneeling messenger; a golden
  //     vision of the iron horse glows above him; mother watches amazed
  (c: SceneCtx) => (
    <G>
      <Interior c={c} wall="#8A5A3A" view="#C9A27A" />
      <Glow c={c} name="vision" cx={182} cy={92} r={90} color={c.p.glow} opacity={0.6} />
      <DrumStar x={182} y={92} r={58} color={c.p.glow} ring={c.p.accent} opacity={0.35} />
      <G opacity={0.75}>
        <IronHorse x={174} y={118} s={0.72} />
      </G>
      <Mat x={184} y={210} w={60} />
      <Giong x={180} y={206} s={0.62} sitting pose="out" />
      <Figure x={112} y={208} s={1.05} {...MESSENGER} sitting pose="hold" />
      <Figure x={264} y={214} s={1.08} {...MOTHER} pose="up" flip />
      <Finish c={c} vignette={0.38} />
    </G>
  ),
  // 4 — the whole village brings rice, greens and fruit; Gióng, bigger every
  //     day, eats happily from a huge bowl in the red-earth yard
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#5E6276" bottom="#E3A06A" />
      <Glow c={c} name="sunStar" cx={250} cy={46} r={70} color={c.p.glow} opacity={0.7} />
      <DrumStar x={250} y={46} r={26} color={c.p.glow} ring={c.p.accent} />
      <Cloud x={110} y={50} s={1.1} color="#4B4F63" opacity={0.85} />
      <Bamboo x={30} y={170} h={100} color={BAMBOO_GOLD} leaf={BAMBOO_LEAF} stalks={4} seed={12} />
      <Bamboo x={340} y={170} h={96} color={BAMBOO_GOLD} leaf={BAMBOO_LEAF} stalks={4} seed={14} />
      <Hut x={292} y={170} s={1.15} wall={WALL} roof={THATCH} door={DOOR} />
      <Rect x={0} y={166} width={c.W} height={80} fill={c.p.ground} />
      <Path d={`M0,190 Q180,180 ${c.W},192`} stroke="#C2603E" strokeWidth={14} fill="none" opacity={0.4} />
      <Carrier x={76} y={222} s={0.95} top={VILLAGER_TOPS[0]} load="rice" />
      <Carrier x={128} y={226} s={0.9} top={VILLAGER_TOPS[1]} load="greens" />
      <Figure x={326} y={226} s={0.66} top={VILLAGER_TOPS[3]} bottom="#4A3020" hairStyle="bob" pose="hold" flip />
      <Circle cx={316} cy={198} r={4} fill="#E8873A" />
      <Circle cx={322} cy={196} r={3.6} fill="#F2B44A" />
      {/* Gióng, growing */}
      <Glow c={c} name="giong" cx={214} cy={170} r={60} color={c.p.glow} opacity={0.35} />
      <Giong x={210} y={224} s={1.4} sitting pose="hold" />
      <Path d="M206,196 Q222,214 238,196 Z" fill="#B8863A" />
      <Ellipse cx={222} cy={196} rx={16} ry={4} fill="#F4EEDC" />
      <Path d="M176,226 Q186,206 200,226 Z" fill="#7E5E36" />
      <Ellipse cx={188} cy={212} rx={9} ry={3} fill="#F4EEDC" />
      <Path d="M220,182 q2,-6 0,-10 M228,184 q2,-6 0,-10" stroke="#F4EEDC" strokeWidth={1.2} fill="none" opacity={0.6} strokeLinecap="round" />
      <Finish c={c} vignette={0.26} />
    </G>
  ),
  // 5 — Gióng stretches up as tall as a tree beside the iron horse, whose
  //     breath glows warm gold; tiny villagers cheer
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.ink} mid={c.p.sky} bottom={c.p.skyLow} />
      <Rays x={158} y={64} color={c.p.glow} count={13} spread={Math.PI * 2} len={260} opacity={0.16} />
      <Glow c={c} name="halo" cx={158} cy={64} r={110} color={c.p.glow} opacity={0.65} />
      <DrumStar x={158} y={64} r={48} color={c.p.glow} ring={c.p.accent} />
      <Cloud x={40} y={50} s={1.4} color="#3A3E52" />
      <Cloud x={320} y={36} s={1.3} color="#3A3E52" />
      <Ridge c={c} y={204} amp={10} seed={7} color={c.p.groundDeep} />
      <Palm x={90} y={216} s={1.65} trunk="#6E4A30" leaf="#7E8A3A" />
      <Rect x={0} y={212} width={c.W} height={34} fill={c.p.ground} />
      <Glow c={c} name="breath" cx={312} cy={142} r={46} color={c.p.glow} opacity={0.6} />
      <IronHorse x={232} y={222} s={1.35} />
      <Giong x={158} y={220} s={2.4} pose="up" armor />
      {[[40, 'up'], [60, 'wave'], [292, 'up'], [314, 'wave']].map(([fx, pose], i) => (
        <Figure key={i} x={fx as number} y={232} s={0.52} top={VILLAGER_TOPS[i]} bottom="#4A3020" hairStyle={i % 2 ? 'bun' : 'topknot'} pose={pose as Pose} flip={i > 1} />
      ))}
      <Finish c={c} vignette={0.34} />
    </G>
  ),
  // 6 — Gióng gallops across the red hills pulling up a golden bamboo stalk;
  //     far away, tiny figures run off over the hills (no one is struck)
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} mid="#6A6474" bottom={c.p.skyLow} />
      <Glow c={c} name="sunStar" cx={60} cy={48} r={70} color={c.p.glow} opacity={0.6} />
      <DrumStar x={60} y={48} r={26} color={c.p.glow} ring={c.p.accent} />
      <Rays x={60} y={48} color={c.p.glow} count={6} spread={1} len={300} start={0.5} opacity={0.14} />
      <Cloud x={230} y={46} s={1.4} color="#3A3E52" />
      <Cloud x={330} y={70} s={1} color="#3A3E52" />
      <Ridge c={c} y={152} amp={16} seed={21} color="#8A3E2A" />
      {[[286, 152], [302, 147], [318, 151], [334, 146]].map(([fx, fy], i) => (
        <Figure key={i} x={fx} y={fy} s={0.24} top="#3A2A24" bottom="#2A1C17" pose="out" />
      ))}
      <Ridge c={c} y={186} amp={12} seed={25} color={c.p.ground} />
      <Bamboo x={36} y={200} h={92} color={BAMBOO_GOLD} leaf={BAMBOO_LEAF} stalks={4} seed={31} />
      <Rect x={0} y={198} width={c.W} height={48} fill={c.p.groundDeep} />
      <Ellipse cx={56} cy={202} rx={8} ry={2.4} fill={c.p.ink} opacity={0.5} />
      {[[94, 150], [80, 166], [100, 180]].map(([lx, ly], i) => (
        <Path key={i} d={`M${lx},${ly} l-36,0`} stroke={c.p.glow} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
      ))}
      <Dust x={110} y={204} seed={4} color="#C9774A" />
      <Glow c={c} name="ride" cx={200} cy={150} r={80} color={c.p.glow} opacity={0.3} />
      <Rider x={170} y={206} s={1.25} gallop stalk roots breath={false} />
      <Finish c={c} vignette={0.32} />
    </G>
  ),
  // 7 — atop Sóc Sơn mountain Gióng leaves his armour on a rock, and he and
  //     the horse rise gently into golden clouds
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} mid="#B07A5E" bottom={c.p.glow} />
      <Glow c={c} name="heaven" cx={260} cy={56} r={130} color={c.p.glow} opacity={0.75} />
      <DrumStar x={260} y={56} r={44} color="#FBE7B0" ring={c.p.accent} opacity={0.9} />
      <Cloud x={196} y={110} s={1.8} color="#F7DC94" opacity={0.85} />
      <Cloud x={312} y={104} s={1.5} color="#F2C46B" opacity={0.85} />
      <Cloud x={262} y={128} s={1.3} color="#FBE7B0" opacity={0.9} />
      <Peaks base={250} peaks={[[96, 150, 110]]} color={c.p.groundDeep} />
      <Peaks base={250} peaks={[[30, 90, 60], [190, 70, 70]]} color="#8A3E2A" />
      <Ridge c={c} y={228} amp={6} seed={2} color={c.p.ink} opacity={0.5} />
      {/* armour resting on the summit rock */}
      <Ellipse cx={100} cy={110} rx={26} ry={9} fill="#5A3A2A" />
      <Path d="M86,104 L102,104 L104,88 L84,88 Z" fill={IRON} />
      <Ellipse cx={84} cy={89} rx={4.5} ry={3} fill={IRON_LIGHT} />
      <Ellipse cx={104} cy={89} rx={4.5} ry={3} fill={IRON_LIGHT} />
      <Rect x={85} y={100} width={18} height={3} fill={SASH} />
      <Path d="M86,94 Q94,96 102,94 M86,99 Q94,101 102,99" stroke={IRON_LIGHT} strokeWidth={1} fill="none" />
      <Path d="M104,104 Q104,92 112,92 Q120,92 120,104 Z" fill={IRON_LIGHT} />
      <Path d="M112,92 L112,86" stroke={IRON_LIGHT} strokeWidth={1.6} />
      {/* sparkle trail */}
      {[[124, 96], [146, 88], [168, 84], [188, 86]].map(([sx, sy], i) => (
        <Circle key={i} cx={sx} cy={sy} r={1.6 + i * 0.3} fill="#FBE7B0" opacity={0.8} />
      ))}
      <G transform="rotate(-12 236 108)">
        <Rider x={232} y={110} s={0.85} gallop armor={false} />
      </G>
      <Cloud x={238} y={120} s={1} color="#FBE7B0" opacity={0.9} />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 8 — the spring festival in Phù Đổng: flags, a great bronze drum, golden
  //     bamboo and the round ponds left by the horse's hooves, children at play
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#7A8098" mid="#E3B08A" bottom="#F6E3B8" />
      <DrumStar x={180} y={40} r={22} color={c.p.glow} ring={c.p.accent} />
      <Glow c={c} name="sunStar" cx={180} cy={40} r={60} color={c.p.glow} opacity={0.55} />
      <Bamboo x={24} y={170} h={120} color={BAMBOO_GOLD} leaf={BAMBOO_LEAF} stalks={5} seed={40} />
      <Bamboo x={336} y={170} h={116} color={BAMBOO_GOLD} leaf={BAMBOO_LEAF} stalks={5} seed={44} />
      <Hut x={96} y={162} s={0.8} wall={WALL} roof={THATCH} door={DOOR} />
      <Hut x={270} y={160} s={0.75} wall={WALL} roof={THATCH} door={DOOR} />
      <Path d="M70,82 Q180,104 290,82" stroke="#6E4A30" strokeWidth={0.8} fill="none" />
      {Array.from({ length: 11 }, (_, i) => {
        const t = i / 10;
        const bx = 70 + 220 * t;
        const by = 82 + 22 * 4 * t * (1 - t);
        return <Path key={i} d={`M${bx - 4},${by} L${bx + 4},${by} L${bx},${by + 8} Z`} fill={i % 2 ? '#C8302A' : BAMBOO_GOLD} />;
      })}
      <Flag x={70} y={170} h={96} color="#C8302A" />
      <Flag x={290} y={170} h={96} color="#C8302A" flip />
      <Rect x={0} y={166} width={c.W} height={80} fill={c.p.ground} />
      {/* round ponds */}
      <Ellipse cx={62} cy={216} rx={30} ry={8} fill="#6E8A8A" />
      <Ellipse cx={58} cy={214} rx={18} ry={3} fill="#A8C4C0" opacity={0.6} />
      <Ellipse cx={306} cy={222} rx={26} ry={7} fill="#6E8A8A" />
      <Ellipse cx={302} cy={220} rx={14} ry={2.4} fill="#A8C4C0" opacity={0.6} />
      <BronzeDrum x={180} y={200} s={1.25} />
      <Figure x={140} y={208} s={0.8} top={VILLAGER_TOPS[4]} bottom="#4A3020" hat="khan" hatColor="#C8302A" pose="up" />
      <Path d="M150,160 L160,176" stroke="#6E4A30" strokeWidth={2} strokeLinecap="round" />
      {/* children playing */}
      <Figure x={114} y={232} s={0.6} top="#C8302A" bottom="#4A3020" hairStyle="topknot" pose="up" />
      <Figure x={236} y={230} s={0.6} top={VILLAGER_TOPS[3]} bottom="#4A3020" hairStyle="braid" pose="wave" flip />
      <Figure x={258} y={234} s={0.56} top={VILLAGER_TOPS[1]} bottom="#4A3020" hairStyle="bob" pose="out" flip />
      <Path d="M244,180 L246,198" stroke="#6E4A30" strokeWidth={1} />
      <DrumStar x={244} y={178} r={6} color={BAMBOO_GOLD} points={8} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
];

export const THANH_GIONG: StoryScenes = { cover, pages };
