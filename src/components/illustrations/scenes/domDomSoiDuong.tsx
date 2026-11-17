// Đom Đóm Nhỏ Soi Đường — a hushed village night at the edge of a bamboo
// grove. Signature: deep teal-green night, tall bamboo stems, the only warm
// light is Mơ's green-gold glow (faint and flickering at first, calm and
// round by the end), an old round stone well, a little plank bridge,
// broad banana leaves by the hedgehogs' burrow. No moon dominates the sky.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { Bamboo, Finish, Glow, Grass, Mist, Paddies, Ridge, SceneCtx, Sky, Stars, StoryScenes, rng } from '../kit';

// ─── Colours ──────────────────────────────────────────────────

const BAMBOO = '#2F5A3A';
const BAMBOO_FAR = '#1E3D30';
const BAMBOO_LEAF = '#3E7348';
const BODY = '#3A3428';
const WING = '#DDE8E4';
const SPINE = '#6B4E36';
const SPINE_DARK = '#4E3826';
const SPINE_MUM = '#5E5248';
const FACE = '#EED9B8';
const NOSE = '#E59A9A';
const EYE = '#1E1712';
const STONE = '#5E6B66';
const STONE_DARK = '#46524E';
const PLANK = '#7A5A3C';
const PLANK_DARK = '#5A4029';
const BANANA = '#3F7A3E';
const BANANA_LIGHT = '#58964F';
const PATH = '#3D4F33';
const EARTH = '#2A3A25';

// ─── Characters ───────────────────────────────────────────────

/**
 * Mơ the firefly, facing right. (x, y) = body centre. `glow` 0..1 sets the
 * size of the light; `flicker` draws a broken, sputtering halo instead.
 */
function Firefly({
  x,
  y,
  s = 1,
  glow = 0.6,
  flicker = false,
  calm = false,
  sleeping = false,
  flip = false,
}: {
  x: number;
  y: number;
  s?: number;
  glow?: number;
  flicker?: boolean;
  calm?: boolean;
  sleeping?: boolean;
  flip?: boolean;
}) {
  const G1 = '#E8F59A';
  const G2 = '#B8D45A';
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {/* light from the tail */}
      {flicker ? (
        <G>
          <Circle cx={-7} cy={2} r={9 * glow + 4} fill={G1} opacity={0.12} />
          <Path d="M-15,-6 l2,2 M-17,4 l3,0 M-12,11 l1,-2 M0,10 l-1,-2" stroke={G1} strokeWidth={1.2} strokeLinecap="round" opacity={0.7} />
        </G>
      ) : (
        <G>
          <Circle cx={-7} cy={2} r={26 * glow + 6} fill={G1} opacity={calm ? 0.1 : 0.07} />
          <Circle cx={-7} cy={2} r={14 * glow + 4} fill={G1} opacity={calm ? 0.2 : 0.14} />
          <Circle cx={-7} cy={2} r={7 * glow + 3} fill={G1} opacity={0.3} />
        </G>
      )}
      {/* wings */}
      {!sleeping ? (
        <G opacity={0.7}>
          <Ellipse cx={-2} cy={-8} rx={7} ry={4} fill={WING} transform="rotate(-30 -2 -8)" />
          <Ellipse cx={3} cy={-8} rx={6} ry={3.5} fill={WING} transform="rotate(20 3 -8)" />
        </G>
      ) : (
        <Ellipse cx={-1} cy={-3} rx={7} ry={3} fill={WING} opacity={0.6} />
      )}
      {/* tail lantern */}
      <Ellipse cx={-7} cy={2} rx={5.5} ry={4.5} fill={flicker ? G2 : G1} />
      <Ellipse cx={-8} cy={1} rx={2.4} ry={1.8} fill="#FFFFFF" opacity={0.6} />
      {/* body & head */}
      <Ellipse cx={0} cy={0} rx={5} ry={4.2} fill={BODY} />
      <Circle cx={6} cy={-2} r={4.2} fill={BODY} />
      <Path d="M8,-5.5 Q11,-11 14,-11 M7,-6 Q8,-12 11,-13" stroke={BODY} strokeWidth={0.9} fill="none" strokeLinecap="round" />
      {sleeping || calm ? (
        <Path d="M6.4,-2.6 Q7.8,-1.2 9.2,-2.6" stroke="#F3EBD2" strokeWidth={0.9} fill="none" strokeLinecap="round" />
      ) : (
        <G>
          <Circle cx={7.8} cy={-2.6} r={1.7} fill="#F3EBD2" />
          <Circle cx={8.3} cy={-2.5} r={0.9} fill={EYE} />
        </G>
      )}
    </G>
  );
}

type HogMood = 'sad' | 'walk' | 'happy' | 'peer';

/** A hedgehog facing right. (x, y) = between the feet. s = 1 is ~40 units long. */
function Hedgehog({
  x,
  y,
  s = 1,
  flip = false,
  mood = 'walk',
  mother = false,
  leaf = true,
}: {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  mood?: HogMood;
  mother?: boolean;
  leaf?: boolean;
}) {
  const spine = mother ? SPINE_MUM : SPINE;
  // zig-zag spiny back
  const pts: string[] = [];
  const n = 11;
  for (let i = 0; i <= n; i++) {
    const a = Math.PI * (1 - i / n);
    const r = i % 2 ? 22 : 17;
    pts.push(`${(Math.cos(a) * r * 1.05 - 3).toFixed(1)},${(-6 - Math.sin(a) * r * 0.85).toFixed(1)}`);
  }
  const look = mood === 'sad' ? 6 : mood === 'peer' ? -4 : 0;
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Ellipse cx={0} cy={-1} rx={18} ry={2.2} fill="#000000" opacity={0.18} />
      {/* feet */}
      <Ellipse cx={-9} cy={-1.5} rx={3} ry={2} fill={FACE} />
      <Ellipse cx={8} cy={-1.5} rx={3} ry={2} fill={FACE} />
      {/* spines */}
      <Path d={`M-25,-4 L${pts.join(' L')} L18,-4 Z`} fill={spine} />
      <Path d="M-14,-18 l4,6 M-6,-22 l3,7 M3,-21 l1,7" stroke={SPINE_DARK} strokeWidth={1.2} strokeLinecap="round" opacity={0.6} />
      {/* face / belly */}
      <G transform={`rotate(${look} 14 -9)`}>
        <Path d="M8,-17 Q22,-16 27,-7 Q26,-3 18,-3 L8,-3 Z" fill={FACE} />
        <Circle cx={27.5} cy={-7.5} r={2} fill={NOSE} />
        {mood === 'happy' ? (
          <Path d="M17,-12.5 Q19,-15 21,-12.5" stroke={EYE} strokeWidth={1.1} fill="none" strokeLinecap="round" />
        ) : (
          <G>
            <Circle cx={19} cy={-12} r={1.6} fill={EYE} />
            <Circle cx={19.5} cy={-12.6} r={0.5} fill="#FFFFFF" />
          </G>
        )}
        {mood === 'sad' ? <Circle cx={19.5} cy={-8.6} r={0.9} fill="#BFE3F0" opacity={0.9} /> : null}
        <Circle cx={21} cy={-8} r={1.8} fill={NOSE} opacity={0.4} />
        <Ellipse cx={13} cy={-15} rx={2.2} ry={2.6} fill={FACE} />
      </G>
      {leaf && !mother ? (
        <Path d="M-6,-23 Q0,-31 8,-27 Q2,-21 -6,-23 Z" fill={BANANA_LIGHT} />
      ) : null}
    </G>
  );
}

// ─── Scenery helpers ──────────────────────────────────────────

function Backdrop({ c, horizon = 0.7, stars = 28, seed = 3 }: { c: SceneCtx; horizon?: number; stars?: number; seed?: number }) {
  const hy = c.H * horizon;
  return (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Stars c={c} count={stars} seed={seed} color="#E9F3E6" maxY={hy - 30} opacity={0.6} />
      <Ridge c={c} y={hy - 6} amp={14} seed={seed + 1} color={BAMBOO_FAR} />
      <Ridge c={c} y={hy + 10} amp={8} seed={seed + 2} color={c.p.ground} />
    </G>
  );
}

/** A clump of tall bamboo reaching above the frame. */
function Grove({ x, y, h = 150, seed = 5, far = false }: { x: number; y: number; h?: number; seed?: number; far?: boolean }) {
  return <Bamboo x={x} y={y} h={h} stalks={far ? 3 : 4} seed={seed} color={far ? BAMBOO_FAR : BAMBOO} leaf={far ? '#28503A' : BAMBOO_LEAF} />;
}

/** One long bamboo leaf to perch on, pointing right from (x, y). */
function PerchLeaf({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-30,-60 Q-24,-30 -6,-4" stroke={BAMBOO} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M-8,-6 Q20,-14 52,-2 Q22,2 -8,-6 Z" fill={BAMBOO_LEAF} />
      <Path d="M-6,-5 Q20,-8 48,-2" stroke="#2E5A36" strokeWidth={0.8} fill="none" />
    </G>
  );
}

function Trail({ points, broken = false }: { points: Array<[number, number]>; broken?: boolean }) {
  return (
    <G>
      {points.map(([x, y], i) =>
        broken && i % 3 === 1 ? null : (
          <G key={i}>
            <Circle cx={x} cy={y} r={3.6} fill="#E8F59A" opacity={0.12} />
            <Circle cx={x} cy={y} r={1.3} fill="#E8F59A" opacity={broken ? 0.5 : 0.85} />
          </G>
        )
      )}
    </G>
  );
}

function Well({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-22,0 L-22,-20 Q0,-26 22,-20 L22,0 Q0,4 -22,0 Z" fill={STONE} />
      <Ellipse cx={0} cy={-20} rx={22} ry={5} fill={STONE_DARK} />
      <Ellipse cx={0} cy={-20} rx={17} ry={3.2} fill="#0E1A18" />
      {[-14, -2, 10].map((sx, i) => (
        <Path key={i} d={`M${sx},-14 l8,0 M${sx + 4},-7 l8,0`} stroke={STONE_DARK} strokeWidth={1} strokeLinecap="round" />
      ))}
      <Path d="M-14,-4 Q-10,-12 -4,-10" stroke="#4F7A48" strokeWidth={2} fill="none" strokeLinecap="round" />
    </G>
  );
}

function Bridge({ x, y, w = 90 }: { x: number; y: number; w?: number }) {
  return (
    <G>
      <Path d={`M${x - w / 2},${y + 10} Q${x},${y + 30} ${x + w / 2},${y + 10} L${x + w / 2},${y + 24} L${x - w / 2},${y + 24} Z`} fill="#16302E" />
      <Path d={`M${x - w / 2 + 8},${y + 18} q10,-2 20,0 M${x + 6},${y + 21} q10,-2 18,0`} stroke="#3F6B66" strokeWidth={1} opacity={0.6} />
      <Rect x={x - w / 2} y={y} width={w} height={6} rx={2} fill={PLANK} />
      {Array.from({ length: Math.floor(w / 10) }, (_, i) => (
        <Rect key={i} x={x - w / 2 + 2 + i * 10} y={y} width={1} height={6} fill={PLANK_DARK} />
      ))}
      <Rect x={x - w / 2 + 4} y={y + 6} width={3} height={12} fill={PLANK_DARK} />
      <Rect x={x + w / 2 - 7} y={y + 6} width={3} height={12} fill={PLANK_DARK} />
    </G>
  );
}

function BananaTree({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-4,0 Q-3,-40 -1,-70 L4,-70 Q5,-40 5,0 Z" fill="#5C7A44" />
      {[
        'M1,-70 Q-30,-96 -56,-72 Q-28,-80 1,-66 Z',
        'M1,-70 Q30,-100 60,-80 Q30,-82 1,-66 Z',
        'M1,-70 Q-10,-110 -30,-118 Q-6,-100 3,-70 Z',
        'M1,-68 Q-40,-60 -50,-30 Q-32,-56 1,-64 Z',
        'M1,-68 Q38,-64 46,-36 Q30,-58 1,-64 Z',
      ].map((d, i) => (
        <Path key={i} d={d} fill={i % 2 ? BANANA : BANANA_LIGHT} />
      ))}
    </G>
  );
}

function Burrow({ x, y }: { x: number; y: number }) {
  return (
    <G>
      <Path d={`M${x - 34},${y} Q${x},${y - 34} ${x + 34},${y} Z`} fill={EARTH} />
      <Path d={`M${x - 16},${y} Q${x},${y - 20} ${x + 16},${y} Z`} fill="#141E12" />
      <Circle cx={x} cy={y - 8} r={9} fill="#F3E3A0" opacity={0.15} />
    </G>
  );
}

function GroundPath({ c, y, seed = 7 }: { c: SceneCtx; y: number; seed?: number }) {
  const r = rng(seed);
  return (
    <G>
      <Path d={`M-10,${y + 14} Q${c.W * 0.3},${y - 6} ${c.W * 0.55},${y + 4} T${c.W + 10},${y} L${c.W + 10},${c.H} L-10,${c.H} Z`} fill={PATH} />
      {Array.from({ length: 10 }, (_, i) => (
        <Ellipse key={i} cx={r() * c.W} cy={y + 14 + r() * (c.H - y - 18)} rx={2 + r() * 3} ry={1.2} fill="#4C6040" opacity={0.6} />
      ))}
    </G>
  );
}

function FireflyCloud({ c, seed, area, n = 12 }: { c: SceneCtx; seed: number; area: [number, number, number, number]; n?: number }) {
  const r = rng(seed);
  const [ax, ay, aw, ah] = area;
  return (
    <G>
      {Array.from({ length: n }, (_, i) => {
        const x = ax + r() * aw;
        const y = ay + r() * ah;
        const big = 0.6 + r() * 0.6;
        return (
          <G key={i}>
            <Circle cx={x} cy={y} r={9 * big} fill={c.p.glow} opacity={0.1} />
            <Circle cx={x} cy={y} r={4 * big} fill={c.p.glow} opacity={0.25} />
            <Circle cx={x} cy={y} r={1.8 * big} fill={c.p.glow} />
          </G>
        );
      })}
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Backdrop c={c} horizon={0.66} stars={40} seed={11} />
    <Grove x={36} y={300} h={300} seed={12} far />
    <Grove x={330} y={290} h={290} seed={13} far />
    <GroundPath c={c} y={262} seed={14} />
    <Grove x={14} y={360} h={340} seed={15} />
    <Grove x={350} y={360} h={330} seed={16} />
    <Trail points={[[64, 300], [88, 292], [112, 286], [136, 278], [160, 268], [182, 256], [204, 244]]} />
    <Glow c={c} name="mo" cx={226} cy={226} r={70} color={c.p.glow} opacity={0.45} />
    <Hedgehog x={150} y={318} s={1.7} mood="walk" />
    <Firefly x={226} y={226} s={2.4} glow={0.8} />
    <Grass c={c} y={360} seed={17} color="#22381F" count={30} height={12} />
    <Finish c={c} vignette={0.35} />
  </G>
);

const pages = [
  // 1 — dusk at the edge of the bamboo grove; Mơ on a leaf, a faint flickering light
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} horizon={0.72} stars={14} seed={21} />
      <Grove x={46} y={200} h={200} seed={22} far />
      <Grove x={300} y={196} h={190} seed={23} far />
      <Grove x={262} y={240} h={240} seed={24} />
      <Grass c={c} y={240} seed={25} color="#22381F" count={34} height={10} />
      <PerchLeaf x={150} y={150} s={1.4} />
      <Firefly x={176} y={136} s={2} glow={0.25} flicker />
      <Finish c={c} vignette={0.32} />
    </G>
  ),
  // 2 — the big fireflies twinkle over the rice fields; Mơ watches from a leaf
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Stars c={c} count={20} seed={31} color="#E9F3E6" maxY={90} opacity={0.5} />
      <Ridge c={c} y={120} amp={10} seed={32} color={BAMBOO_FAR} />
      <Paddies c={c} y={128} color="#29452C" line="#3C6340" rows={5} />
      <FireflyCloud c={c} seed={33} area={[60, 78, 260, 70]} n={16} />
      <PerchLeaf x={104} y={226} s={1.3} />
      <Firefly x={138} y={212} s={1.8} glow={0.2} flicker />
      <Path d="M152,196 q6,-8 14,-10" stroke={c.p.glow} strokeWidth={1} strokeDasharray="2 3" fill="none" opacity={0.6} />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 3 — a sniffle by the bamboo roots: Little Hedgehog is lost
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} horizon={0.7} stars={18} seed={41} />
      <Grove x={92} y={210} h={220} seed={42} />
      <Grove x={300} y={206} h={200} seed={43} far />
      <Path d="M70,212 q10,-12 24,-4 q10,-8 22,2 q-24,6 -46,2 Z" fill="#284426" />
      <GroundPath c={c} y={196} seed={44} />
      <Hedgehog x={176} y={214} s={1.5} mood="sad" />
      <Firefly x={250} y={110} s={1.6} glow={0.3} flicker flip />
      <Trail points={[[290, 70], [278, 84], [266, 96]]} broken />
      <Finish c={c} vignette={0.34} />
    </G>
  ),
  // 4 — Mơ hurries in zigzags; the little light sputters and blinks
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} horizon={0.72} stars={16} seed={51} />
      <Grove x={30} y={220} h={220} seed={52} />
      <Grove x={330} y={220} h={210} seed={53} />
      <GroundPath c={c} y={198} seed={54} />
      <Trail broken points={[[150, 150], [166, 126], [184, 150], [202, 120], [220, 146], [238, 112], [250, 128]]} />
      <Firefly x={262} y={110} s={1.6} glow={0.3} flicker />
      <Hedgehog x={120} y={218} s={1.3} mood="peer" />
      <Finish c={c} vignette={0.34} />
    </G>
  ),
  // 5 — Mơ stops, breathes slowly; the light grows calm and round like a lantern
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} horizon={0.74} stars={22} seed={61} />
      <Grove x={40} y={226} h={220} seed={62} far />
      <Grove x={320} y={226} h={220} seed={63} far />
      <Glow c={c} name="calm" cx={180} cy={110} r={90} color={c.p.glow} opacity={0.5} />
      <Circle cx={180} cy={110} r={44} fill="none" stroke={c.p.glow} strokeWidth={0.8} opacity={0.35} />
      <Circle cx={180} cy={110} r={62} fill="none" stroke={c.p.glow} strokeWidth={0.6} opacity={0.2} />
      <Firefly x={186} y={110} s={2.6} glow={0.9} calm />
      <Grass c={c} y={240} seed={64} color="#22381F" count={30} height={10} />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 6 — past the old stone well and over the little wooden bridge, together
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} horizon={0.68} stars={20} seed={71} />
      <Grove x={330} y={176} h={170} seed={72} far />
      <Path d={`M0,186 L${c.W},178 L${c.W},${c.H} L0,${c.H} Z`} fill={c.p.groundDeep} />
      <Well x={104} y={198} s={0.9} />
      <Bridge x={222} y={176} w={100} />
      <Trail points={[[132, 186], [150, 182], [170, 176], [194, 168], [214, 160]]} />
      <Glow c={c} name="lead" cx={236} cy={146} r={48} color={c.p.glow} opacity={0.45} />
      <Firefly x={236} y={146} s={1.5} glow={0.75} />
      <Hedgehog x={178} y={176} s={1} mood="walk" />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 7 — Mother Hedgehog waits under the banana tree; a happy hug
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} horizon={0.7} stars={18} seed={81} />
      <BananaTree x={250} y={204} s={1.3} />
      <BananaTree x={70} y={210} s={1} flip />
      <Path d={`M0,200 Q${c.W / 2},188 ${c.W},198 L${c.W},${c.H} L0,${c.H} Z`} fill={c.p.groundDeep} />
      <Burrow x={292} y={204} />
      <Hedgehog x={238} y={206} s={1.4} mother mood="happy" flip />
      <Hedgehog x={136} y={208} s={1.1} mood="happy" />
      <Glow c={c} name="hug" cx={188} cy={92} r={44} color={c.p.glow} opacity={0.4} />
      <Firefly x={188} y={92} s={1.4} glow={0.7} />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 8 — flying home with a steady glow; curled up on a bamboo leaf to sleep
  (c: SceneCtx) => (
    <G>
      <Backdrop c={c} horizon={0.76} stars={34} seed={91} />
      <Grove x={40} y={230} h={210} seed={92} far />
      <Grove x={110} y={230} h={190} seed={93} far />
      <Grove x={330} y={240} h={240} seed={94} />
      <Mist c={c} y={196} color="#6E9A8A" opacity={0.18} height={30} />
      <Trail points={[[70, 70], [100, 80], [130, 92], [160, 104], [190, 116], [214, 126]]} />
      <PerchLeaf x={210} y={170} s={1.4} />
      <Glow c={c} name="rest" cx={240} cy={154} r={46} color={c.p.glow} opacity={0.4} />
      <Firefly x={238} y={158} s={1.9} glow={0.55} sleeping />
      <Path d="M262,128 q3,-3 6,0 M270,118 q4,-4 8,0" stroke={c.p.glow} strokeWidth={1.1} fill="none" strokeLinecap="round" opacity={0.6} />
      <Finish c={c} vignette={0.34} />
    </G>
  ),
];

export const DOM_DOM_SOI_DUONG: StoryScenes = { cover, pages };
