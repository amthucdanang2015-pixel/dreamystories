// Hạt Bí Của Bé Su — fresh, bright, patient garden story in a northern
// Vietnamese village. Signature: clear spring-morning blue over cream, a
// tiled-roof house, banana plants, a brick well and clay water jar, a bamboo
// pumpkin trellis with curling tendrils, big yellow flowers and bees; the
// story ends in a warm lamplit dinner with bowls of pumpkin soup.
// No pests, no wilting, no tantrums, no tools used dangerously.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Bird,
  Cloud,
  Figure,
  Finish,
  Glow,
  Grass,
  Pose,
  Ridge,
  SceneCtx,
  Sky,
  StoryScenes,
  Sun,
  rng,
} from '../kit';

// ─── Colours ──────────────────────────────────────────────────

const HAIR = '#1E1712';
const SU = { top: '#F4EBD2', bottom: '#4E8A3E', hair: HAIR, hairStyle: 'short' as const };
const GRANDPA = { top: '#51648F', bottom: '#8C8270', hair: '#E9E5DC', beard: '#F4F1EA', skin: '#DDAA80' };
const MOTHER = { top: '#C25B4A', bottom: '#5A3E3A', hairStyle: 'bun' as const, dress: true };
const FATHER = { top: '#4E7A8A', bottom: '#3E4A52', hairStyle: 'short' as const };
const TREES = '#A9C98A';
const SOIL = '#7A5434';
const SOIL_DARK = '#4A3220';
const SEED = '#F6F2E4';
const SEED_RIM = '#DCD2B4';
const ROOT = '#F2E8CC';
const SPROUT = '#7CC24E';
const SPROUT_STEM = '#5E9A3A';
const BAMBOO = '#CDAE6E';
const BAMBOO_DARK = '#A88A4E';
const LEAF = '#4F8A3A';
const LEAF_LIGHT = '#6FA84C';
const LEAF_DARK = '#35632A';
const FLOWER = '#F6C232';
const FLOWER_DEEP = '#E3A23B';
const PUMPKIN_GREEN = '#5E8F3C';
const PUMPKIN_GREEN_SHADE = '#47742E';
const PUMPKIN_RIPE = '#E7A23A';
const PUMPKIN_RIPE_SHADE = '#C9822A';
const STEM = '#6A5A2E';
const TIN = '#AEB8BE';
const TIN_DARK = '#7E8A90';
const WATER = '#9ED2E6';
const WALL = '#EFE3C6';
const ROOF = '#B5573C';
const ROOF_DARK = '#8E3F2C';
const DOOR = '#5A3A26';
const BRICK = '#B4644A';
const BRICK_DARK = '#8A4632';
const JAR = '#9A5A38';
const JAR_DARK = '#74402A';
const BANANA_TRUNK = '#8FA35A';
const BANANA_LEAF = '#5E9A44';
const BANANA_LIGHT = '#7DB656';
const ROOM = '#E6CB98';
const FLOOR = '#B5865A';
const WOOD = '#7A5236';
const WOOD_DARK = '#5A3A24';
const SOUP = '#F0A43C';

// ─── Characters ───────────────────────────────────────────────

/** Su with his short spiky hair. */
function Su({ x, y, s = 0.68, pose = 'down', flip = false, sitting = false }: { x: number; y: number; s?: number; pose?: Pose; flip?: boolean; sitting?: boolean }) {
  const l = sitting ? 12 : 0;
  return (
    <G>
      <Figure x={x} y={y} s={s} {...SU} pose={pose} flip={flip} sitting={sitting} />
      <Path
        transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}
        d={`M-7.5,${-54 + l} L-6,${-62 + l} L-3,${-57 + l} L0,${-64 + l} L2.5,${-57 + l} L5.5,${-62 + l} L7.5,${-54 + l} Z`}
        fill={HAIR}
      />
    </G>
  );
}

function Grandpa({ x, y, s = 1, pose = 'down', flip = false, sitting = false }: { x: number; y: number; s?: number; pose?: Pose; flip?: boolean; sitting?: boolean }) {
  return <Figure x={x} y={y} s={s} {...GRANDPA} pose={pose} flip={flip} sitting={sitting} />;
}

// ─── Garden props ─────────────────────────────────────────────

function TileHouse({ x, y, s = 1, lit = false }: { x: number; y: number; s?: number; lit?: boolean }) {
  const edge = (yy: number) => -58 + (-38 - yy) * 0.5;
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-46} y={-40} width={92} height={40} fill={WALL} />
      <Path d="M-58,-38 L-44,-66 L44,-66 L58,-38 Z" fill={ROOF} />
      {[-45, -52, -59].map((yy) => (
        <Path key={yy} d={`M${edge(yy)},${yy} L${-edge(yy)},${yy}`} stroke={ROOF_DARK} strokeWidth={1} opacity={0.6} />
      ))}
      <Rect x={-58} y={-40} width={116} height={4} fill={ROOF_DARK} />
      <Rect x={-11} y={-36} width={22} height={36} fill={lit ? '#FCE2A8' : DOOR} />
      {[-36, 22].map((wx) => (
        <G key={wx}>
          <Rect x={wx} y={-30} width={14} height={12} fill={lit ? '#FCE2A8' : DOOR} />
          <Path d={`M${wx + 4.7},-30 L${wx + 4.7},-18 M${wx + 9.3},-30 L${wx + 9.3},-18`} stroke={WOOD} strokeWidth={1.2} />
        </G>
      ))}
    </G>
  );
}

function Banana({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const leaves: Array<[number, number]> = [[-40, -62], [38, -66], [-18, -90], [22, -88], [-34, -36], [32, -40]];
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-4,0 L-3,-52 L3,-52 L4,0 Z" fill={BANANA_TRUNK} />
      {leaves.map(([ex, ey], i) => (
        <Path
          key={i}
          d={`M0,-52 Q${ex / 2},${Math.min(-52, ey) - 14} ${ex},${ey} Q${ex / 2},${Math.min(-52, ey) - 2} 0,-52 Z`}
          fill={i % 2 ? BANANA_LEAF : BANANA_LIGHT}
        />
      ))}
    </G>
  );
}

function Well({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-18} y={-22} width={36} height={22} fill={BRICK} />
      <Path d="M-18,-15 L18,-15 M-18,-8 L18,-8 M-8,-22 L-8,-15 M6,-22 L6,-15 M-2,-15 L-2,-8 M12,-15 L12,-8 M-12,-8 L-12,0 M4,-8 L4,0" stroke={BRICK_DARK} strokeWidth={0.8} />
      <Ellipse cx={0} cy={-22} rx={18} ry={4} fill={BRICK_DARK} />
      <Ellipse cx={0} cy={-22} rx={14} ry={2.6} fill="#2E3A3A" />
    </G>
  );
}

function Jar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={-12} rx={13} ry={12} fill={JAR} />
      <Rect x={-8} y={-27} width={16} height={5} rx={2} fill={JAR_DARK} />
      <Ellipse cx={0} cy={-27} rx={8} ry={2} fill="#3A4A4A" />
      <Ellipse cx={-5} cy={-15} rx={3} ry={5} fill="#FFFFFF" opacity={0.15} />
    </G>
  );
}

function Seed({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Ellipse cx={0} cy={0} rx={4.6} ry={2.8} fill={SEED_RIM} />
      <Ellipse cx={0} cy={-0.2} rx={3.8} ry={2.1} fill={SEED} />
      <Path d="M-4.4,0 L-5.6,0" stroke={SEED_RIM} strokeWidth={1} strokeLinecap="round" />
    </G>
  );
}

function Sprout({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={0.5} rx={8} ry={2} fill={SOIL} />
      <Path d="M0,0 Q-1.5,-6 0,-12" stroke={SPROUT_STEM} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <Path d="M0,-12 C-3,-17 -10,-18 -13,-14 C-9,-10 -3,-10 0,-12 Z" fill={SPROUT} />
      <Path d="M0,-12 C3,-18 10,-20 13,-16 C10,-11 4,-10 0,-12 Z" fill={SPROUT} />
      <Path d="M-2,-13 Q-6,-15 -10,-14.5 M2,-13.5 Q6,-16.5 10,-16" stroke={SPROUT_STEM} strokeWidth={0.6} fill="none" opacity={0.6} />
    </G>
  );
}

/** The seed under the soil, putting out its first tiny roots. */
function RootSeed({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M0,2 Q-2,8 -6,12 M0,2 Q1,9 0,16 M0,2 Q3,7 7,10 M-3,8 l-3,1.5 M0.5,11 l2.5,2 M4,8 l1,3" stroke={ROOT} strokeWidth={1} fill="none" strokeLinecap="round" />
      <Path d="M0.5,-2 Q1.5,-7 -0.5,-11" stroke={SPROUT} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <Seed x={0} y={0} rot={-20} />
    </G>
  );
}

function SoilSection({ c, y, seed = 3 }: { c: SceneCtx; y: number; seed?: number }) {
  const r = rng(seed);
  return (
    <G>
      <Path d={`M0,${y} Q${c.W * 0.5},${y + 5} ${c.W},${y} L${c.W},${c.H + 2} L0,${c.H + 2} Z`} fill={SOIL} />
      <Rect x={0} y={y + (c.H - y) * 0.55} width={c.W} height={c.H} fill={SOIL_DARK} opacity={0.5} />
      {Array.from({ length: 22 }, (_, i) => (
        <Ellipse key={i} cx={r() * c.W} cy={y + 8 + r() * (c.H - y - 8)} rx={1.5 + r() * 2.5} ry={1 + r() * 1.4} fill={i % 3 ? SOIL_DARK : '#9A7650'} opacity={0.6} />
      ))}
    </G>
  );
}

function WateringCan({ x, y, s = 1, pour = false }: { x: number; y: number; s?: number; pour?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <G transform={`rotate(${pour ? 24 : 0})`}>
        <Rect x={-7} y={-10} width={14} height={11} rx={2} fill={TIN} />
        <Path d="M7,-6 L16,-13" stroke={TIN} strokeWidth={2.4} strokeLinecap="round" />
        <Ellipse cx={16.5} cy={-13.5} rx={2} ry={1.4} fill={TIN_DARK} />
        <Path d="M-6,-10 Q0,-17 6,-10" stroke={TIN_DARK} strokeWidth={1.6} fill="none" />
      </G>
      {pour ? (
        <Path d="M20,-4 l1,6 M23,-4 l1.5,8 M26,-4 l2,6 M21.5,6 l0.6,3 M25,7 l0.8,3" stroke={WATER} strokeWidth={1.2} strokeLinecap="round" />
      ) : null}
    </G>
  );
}

function Leaf({ x, y, s = 1, rot = 0, light = false }: { x: number; y: number; s?: number; rot?: number; light?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Path d="M0,0 C-9,-1 -13,-9 -9,-15 C-7,-13 -5,-13 -4,-15 C-2,-19 2,-19 4,-15 C5,-13 7,-13 9,-15 C13,-9 9,-1 0,0 Z" fill={light ? LEAF_LIGHT : LEAF} />
      <Path d="M0,0 L0,-14 M0,-6 L-6,-11 M0,-6 L6,-11" stroke={LEAF_DARK} strokeWidth={0.7} opacity={0.6} />
    </G>
  );
}

function Flower({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <Ellipse key={a} cx={0} cy={-5} rx={3.6} ry={5.6} fill={FLOWER} transform={`rotate(${a})`} />
      ))}
      <Circle cx={0} cy={0} r={2.6} fill={FLOWER_DEEP} />
    </G>
  );
}

function Tendril({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <Path
      transform={`translate(${x},${y}) scale(${s})`}
      d="M0,0 Q6,-2 8,4 Q9,9 4,9 Q1,8 2,5 Q4,3 5,6"
      stroke={LEAF_LIGHT}
      strokeWidth={1}
      fill="none"
      strokeLinecap="round"
    />
  );
}

function Pumpkin({ x, y, s = 1, ripe = false }: { x: number; y: number; s?: number; ripe?: boolean }) {
  const body = ripe ? PUMPKIN_RIPE : PUMPKIN_GREEN;
  const shade = ripe ? PUMPKIN_RIPE_SHADE : PUMPKIN_GREEN_SHADE;
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={-7} cy={-9} rx={9} ry={9} fill={shade} />
      <Ellipse cx={7} cy={-9} rx={9} ry={9} fill={shade} />
      <Ellipse cx={0} cy={-9.5} rx={9} ry={9.5} fill={body} />
      <Path d="M-1,-18 Q0,-23 3,-24" stroke={STEM} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <Ellipse cx={-3} cy={-13} rx={2.5} ry={4} fill="#FFFFFF" opacity={0.18} />
    </G>
  );
}

function Bee({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={-1} cy={-5} rx={3} ry={4} fill="#FFFFFF" opacity={0.75} transform="rotate(-20 -1 -5)" />
      <Ellipse cx={2} cy={-5} rx={3} ry={4} fill="#FFFFFF" opacity={0.75} transform="rotate(20 2 -5)" />
      <Ellipse cx={0} cy={0} rx={5} ry={3.4} fill={FLOWER} />
      <Path d="M-1.5,-3.2 L-1.5,3.2 M1.5,-3.2 L1.5,3.2" stroke="#2A2416" strokeWidth={1.2} />
      <Circle cx={5} cy={-0.5} r={2} fill="#2A2416" />
      <Path d="M-6,0 q-4,-3 -8,0 q-4,3 -8,0" stroke="#2A2416" strokeWidth={0.6} fill="none" strokeDasharray="1.5,2" opacity={0.5} />
    </G>
  );
}

/** Bamboo trellis; when `full`, a pumpkin vine covers it with leaves, tendrils and flowers. */
function Trellis({ x, y, w, h, seed = 4, full = true }: { x: number; y: number; w: number; h: number; seed?: number; full?: boolean }) {
  const r = rng(seed);
  const left = x - w / 2;
  const top = y - h;
  const poles = [0, 0.25, 0.5, 0.75, 1].map((t) => left + w * t);
  const leaves = full
    ? [
        ...Array.from({ length: Math.round(w / 8) }, () => ({ lx: left + r() * w, ly: top + 4 + r() * h * 0.38 })),
        ...poles.flatMap((px) => [0.55, 0.7, 0.85].map((t) => ({ lx: px + (r() - 0.5) * 12, ly: top + h * t }))),
      ].map((l) => ({ ...l, s: 0.8 + r() * 0.6, rot: (r() - 0.5) * 90 }))
    : [];
  const flowers = full ? Array.from({ length: Math.round(w / 40) }, () => ({ fx: left + 10 + r() * (w - 20), fy: top + 8 + r() * h * 0.4 })) : [];
  return (
    <G>
      {poles.map((px) => (
        <Rect key={px} x={px - 2} y={top - 6} width={4} height={h + 6} rx={2} fill={BAMBOO} />
      ))}
      <Rect x={left - 8} y={top} width={w + 16} height={4} rx={2} fill={BAMBOO} />
      <Rect x={left - 8} y={top + h * 0.45} width={w + 16} height={3} rx={1.5} fill={BAMBOO_DARK} />
      {full
        ? poles.map((px, i) => (
            <Path key={`v${i}`} d={`M${px},${y} Q${px + 7},${y - h * 0.5} ${px - 4},${top + 4}`} stroke={LEAF_DARK} strokeWidth={2} fill="none" />
          ))
        : null}
      {leaves.map((l, i) => (
        <Leaf key={`l${i}`} x={l.lx} y={l.ly} s={l.s} rot={l.rot} light={i % 3 === 0} />
      ))}
      {full ? poles.slice(0, 4).map((px, i) => <Tendril key={`t${i}`} x={px + 16} y={top + h * 0.45 + 4} />) : null}
      {flowers.map((f, i) => (
        <Flower key={`f${i}`} x={f.fx} y={f.fy} s={1.1} />
      ))}
    </G>
  );
}

function Garden({ c, y, seed = 1 }: { c: SceneCtx; y: number; seed?: number }) {
  return (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="morning" cx={c.W * 0.82} cy={c.H * 0.16} r={c.H * 0.45} color={c.p.glow} opacity={0.75} />
      <Sun cx={c.W * 0.82} cy={c.H * 0.16} r={13} color="#FFF8DE" />
      <Cloud x={c.W * 0.24} y={c.H * 0.2} s={0.8} color="#FFFFFF" opacity={0.8} />
      <Ridge c={c} y={y - 16} amp={14} seed={seed} color={TREES} />
      <Ridge c={c} y={y} amp={4} seed={seed + 1} color={c.p.ground} />
      <Grass c={c} y={y + 6} seed={seed + 2} color={c.p.groundDeep} count={12} />
    </G>
  );
}

function Bowl({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-8,-6 Q-7,1 0,1 Q7,1 8,-6 Z" fill="#F4F0E6" />
      <Ellipse cx={0} cy={-6} rx={8} ry={2} fill={SOUP} />
      <Path d="M-8,-4 Q0,-2 8,-4" stroke="#4A7AB0" strokeWidth={0.8} fill="none" />
      <Path d="M-2,-10 q-2,-3 0,-6 M2,-10 q2,-3 0,-6" stroke="#FFFFFF" strokeWidth={0.9} fill="none" opacity={0.6} strokeLinecap="round" />
    </G>
  );
}

function OilLamp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={-4} rx={6} ry={4} fill="#C9A35A" />
      <Path d="M-4,-8 Q-6,-18 0,-24 Q6,-18 4,-8 Z" fill="#FFFFFF" opacity={0.35} />
      <Path d="M0,-10 Q-2.4,-14 0,-18 Q2.4,-14 0,-10 Z" fill="#FFC24A" />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Garden c={c} y={282} seed={5} />
    <Trellis x={180} y={292} w={320} h={226} seed={7} />
    <Pumpkin x={232} y={196} s={1.7} />
    <Bee x={96} y={112} s={1.2} />
    <Bee x={286} y={96} s={1.1} />
    <Bee x={196} y={138} s={1} />
    <Glow c={c} name="pair" cx={170} cy={290} r={80} color={c.p.glow} opacity={0.4} />
    <Grandpa x={140} y={326} s={1.25} pose="wave" />
    <Su x={202} y={326} s={0.88} pose="up" flip />
    <WateringCan x={226} y={326} s={1.1} />
    <Finish c={c} vignette={0.24} />
  </G>
);

const pages = [
  // 1 — spring morning: Grandpa places a flat white seed in Su's open palm
  (c: SceneCtx) => (
    <G>
      <Garden c={c} y={168} seed={11} />
      <TileHouse x={66} y={174} s={0.95} />
      <Banana x={318} y={186} s={0.9} />
      <Jar x={122} y={180} s={0.8} />
      <Glow c={c} name="seed" cx={180} cy={168} r={26} color={c.p.glow} opacity={0.9} />
      <Su x={160} y={204} s={0.68} pose="out" />
      <Grandpa x={204} y={204} s={1} pose="out" flip />
      <Seed x={177} y={174} s={1.1} rot={-10} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 2 — Su pats the soil over the seed, then waters it from his tin can
  (c: SceneCtx) => (
    <G>
      <Garden c={c} y={164} seed={21} />
      <Banana x={40} y={182} s={0.95} />
      <Well x={300} y={182} s={1} />
      <Ellipse cx={200} cy={202} rx={28} ry={7} fill={SOIL} />
      <Path d="M186,200 q3,-2 6,0 M204,198 q3,-2 6,0" stroke={SOIL_DARK} strokeWidth={1} fill="none" opacity={0.6} />
      <Su x={148} y={204} s={0.72} pose="hold" sitting />
      <WateringCan x={164} y={188} s={1.1} pour />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 3 — Su crouches over the bare patch, puzzled; Grandpa watches from the doorway
  (c: SceneCtx) => (
    <G>
      <Garden c={c} y={172} seed={31} />
      <TileHouse x={92} y={180} s={1.4} />
      <Grandpa x={92} y={180} s={0.86} />
      <Jar x={170} y={186} s={0.75} />
      <Ellipse cx={282} cy={208} rx={26} ry={6.5} fill={SOIL} />
      <Su x={236} y={208} s={0.72} pose="hold" sitting />
      <Path d="M246,150 Q246,144 251,144 Q256,144 256,149 Q256,153 251,154 L251,158" stroke={c.p.ink} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7} />
      <Circle cx={251} cy={163} r={1.4} fill={c.p.ink} opacity={0.7} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 4 — Grandpa kneels beside Su; a cut-away shows the seed growing tiny roots in the dark
  (c: SceneCtx) => (
    <G>
      <Garden c={c} y={128} seed={41} />
      <SoilSection c={c} y={148} seed={43} />
      <Ellipse cx={180} cy={149} rx={30} ry={5} fill={SOIL} />
      <Grandpa x={136} y={150} s={0.95} pose="out" sitting />
      <Su x={224} y={150} s={0.68} pose="hold" sitting flip />
      <Glow c={c} name="roots" cx={180} cy={196} r={34} color={c.p.glow} opacity={0.45} />
      <RootSeed x={180} y={192} s={2} />
      <Finish c={c} vignette={0.28} />
    </G>
  ),
  // 5 — two tiny green sprout leaves peek out; Su jumps with joy
  (c: SceneCtx) => (
    <G>
      <Garden c={c} y={168} seed={51} />
      <TileHouse x={300} y={172} s={0.7} />
      <Glow c={c} name="sprout" cx={146} cy={180} r={44} color={c.p.glow} opacity={0.8} />
      <Sprout x={146} y={204} s={2.4} />
      <Ellipse cx={232} cy={210} rx={12} ry={2.6} fill={c.p.groundDeep} opacity={0.35} />
      <Su x={232} y={194} s={0.72} pose="up" flip />
      <Path d="M206,140 l-6,-6 M214,132 l-2,-8 M256,140 l6,-6 M250,132 l2,-8" stroke={FLOWER_DEEP} strokeWidth={1.8} strokeLinecap="round" />
      <Bird x={96} y={60} s={0.8} color={c.p.ink} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 6 — the vine climbs the bamboo trellis: tendrils, big yellow flowers, bees, a round green pumpkin
  (c: SceneCtx) => (
    <G>
      <Garden c={c} y={196} seed={61} />
      <Trellis x={180} y={204} w={300} h={156} seed={63} />
      <Pumpkin x={204} y={168} s={1.5} />
      <Bee x={86} y={66} s={1.1} />
      <Bee x={262} y={84} s={1} />
      <Bee x={150} y={108} s={0.9} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 7 — the pumpkin comes home; the family shares pumpkin soup round the lamplit table
  (c: SceneCtx) => (
    <G>
      <Rect x={0} y={0} width={c.W} height={c.H} fill={ROOM} />
      <Rect x={30} y={34} width={66} height={56} fill={WOOD} />
      <Rect x={34} y={38} width={58} height={48} fill="#E9A06E" />
      <Path d="M53,38 L53,86 M73,38 L73,86" stroke={WOOD} strokeWidth={2} />
      <Rect x={0} y={190} width={c.W} height={c.H} fill={FLOOR} />
      <Glow c={c} name="lamp" cx={182} cy={132} r={150} color={c.p.glow} opacity={0.8} />
      <Grandpa x={120} y={196} s={0.95} />
      <Su x={160} y={196} s={0.66} />
      <Figure x={208} y={196} s={0.92} {...MOTHER} flip />
      <Figure x={250} y={196} s={1} {...FATHER} flip />
      <Rect x={90} y={160} width={186} height={6} rx={2} fill={WOOD} />
      <Rect x={96} y={166} width={174} height={30} fill={WOOD_DARK} />
      <Bowl x={124} y={160} />
      <Bowl x={156} y={160} />
      <OilLamp x={182} y={160} />
      <Bowl x={210} y={160} />
      <Bowl x={244} y={160} />
      <Pumpkin x={316} y={214} s={1.7} ripe />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
];

export const HAT_BI_CUA_BE_SU: StoryScenes = { cover, pages };
