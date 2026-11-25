// Voi Con Bin Ở Bản Đôn — warm, sunny and kind. Signature: a dry dipterocarp
// forest in the Central Highlands (tall straight trunks, golden fallen
// leaves, smooth river stones, distant blue hills) under honey-gold light, one
// small cool pool in deep shade, a sparkling trunk-shower, and finally soft
// grey clouds bringing the first rain. No drought cracks, no riders.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { Cloud, Finish, Glow, Rain, Ridge, SceneCtx, Sky, StoryScenes, Sun, Water, rng } from '../kit';

// ─── Colours ──────────────────────────────────────────────────

const GREY = '#9A9CA4';
const GREY_DARK = '#7E8088';
const EAR_EDGE = '#E2A8A8';
const DARK = '#2A2218';
const FAWN = '#B87A48';
const FAWN_LIGHT = '#E8C8A0';
const SQUIRREL = '#7A5A44';
const SQ_BELLY = '#C8563A';
const SUNBIRD_BACK = '#7A8A3A';
const SUNBIRD_BREAST = '#F2C83A';
const TRUNK = '#6A5638';
const CROWN = '#7A8A3E';
const CROWN_LIGHT = '#A8A84E';
const HILLS = '#9DB0B4';
const HILLS_NEAR = '#B8B48A';
const POOL = ['#7FA7B5', '#4E7A8A'];
const SHADE = '#4E5A34';
const STONE = '#C8BCA4';
const STONE_DARK = '#A89C84';
const BUSH = '#6E7A3A';
const LEAF_GOLD = ['#E2A83A', '#D08A2E', '#E8C25A'];
const SPRAY = '#E8F4F8';

// ─── Characters ───────────────────────────────────────────────

type TrunkPose = 'curl' | 'down' | 'up';

/** Bin, the baby elephant, facing right. (x, y) = between the feet; s = 1 is ~60 units long. */
function Bin({
  x,
  y,
  s = 1,
  flip = false,
  trunk = 'curl',
  happy = false,
  flap = false,
}: {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  trunk?: TrunkPose;
  happy?: boolean;
  flap?: boolean;
}) {
  const trunkD =
    trunk === 'down'
      ? 'M33,-26 Q44,-16 42,4'
      : trunk === 'up'
        ? 'M33,-30 Q46,-34 44,-50 Q43,-56 48,-58'
        : 'M33,-26 Q42,-18 38,-10 Q35,-6 39,-5';
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {[-16, -4, 8, 18].map((lx, i) => (
        <Rect key={lx} x={lx} y={-14} width={9} height={14} rx={4} fill={i % 2 ? GREY : GREY_DARK} />
      ))}
      <Path d="M-23,-26 Q-30,-22 -28,-14" stroke={GREY_DARK} strokeWidth={2} fill="none" strokeLinecap="round" />
      <Ellipse cx={0} cy={-24} rx={25} ry={17} fill={GREY} />
      <Circle cx={23} cy={-32} r={14} fill={GREY} />
      <Path d={trunkD} stroke={GREY} strokeWidth={6.5} fill="none" strokeLinecap="round" />
      <G transform={flap ? 'rotate(-18 12 -38)' : undefined}>
        <Ellipse cx={11} cy={-32} rx={11} ry={14} fill={EAR_EDGE} />
        <Ellipse cx={12} cy={-32} rx={9} ry={12} fill={GREY_DARK} />
      </G>
      {happy ? (
        <Path d="M25,-35 Q27,-37.5 29,-35" stroke={DARK} strokeWidth={1.1} fill="none" strokeLinecap="round" />
      ) : (
        <Circle cx={27} cy={-35} r={1.6} fill={DARK} />
      )}
      <Circle cx={29} cy={-29} r={2.4} fill={EAR_EDGE} opacity={0.45} />
      {happy || trunk === 'up' ? <Path d="M28,-24 Q31,-21 34,-23" stroke={DARK} strokeWidth={0.9} fill="none" strokeLinecap="round" /> : null}
    </G>
  );
}

/** Little barking deer, facing right. (x, y) = feet. */
function Deer({ x, y, s = 1, flip = false, drink = false, leap = false }: { x: number; y: number; s?: number; flip?: boolean; drink?: boolean; leap?: boolean }) {
  const lift = leap ? -8 : 0;
  return (
    <G transform={`translate(${x},${y + lift}) scale(${flip ? -s : s},${s})`}>
      {leap ? (
        <Path d="M-10,-14 L-16,-4 M-6,-14 L-10,-2 M8,-14 L14,-4 M11,-14 L18,-6" stroke={FAWN} strokeWidth={2.2} strokeLinecap="round" />
      ) : (
        <Path d="M-9,-14 L-9,0 M-5,-14 L-4,0 M8,-14 L8,0 M11,-14 L12,0" stroke={FAWN} strokeWidth={2.2} strokeLinecap="round" />
      )}
      <Ellipse cx={1} cy={-17} rx={13} ry={6.5} fill={FAWN} />
      <Ellipse cx={1} cy={-14} rx={8} ry={3} fill={FAWN_LIGHT} />
      <Path d="M-12,-19 L-15,-22" stroke={FAWN_LIGHT} strokeWidth={2} strokeLinecap="round" />
      <G transform={drink ? 'rotate(70 11 -20)' : undefined}>
        <Path d="M9,-20 Q13,-28 15,-32" stroke={FAWN} strokeWidth={5} strokeLinecap="round" fill="none" />
        <Ellipse cx={18} cy={-33} rx={5.5} ry={4} fill={FAWN} />
        <Ellipse cx={13} cy={-38} rx={1.8} ry={4} fill={FAWN} transform="rotate(-25 13 -38)" />
        <Circle cx={19} cy={-34} r={1.5} fill={DARK} />
        <Circle cx={23} cy={-32} r={0.9} fill={DARK} />
      </G>
    </G>
  );
}

/** Red-bellied squirrel, sitting up, facing right. (x, y) = feet. */
function Squirrel({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-4,-2 Q-16,-4 -14,-16 Q-12,-26 -4,-22 Q-10,-16 -6,-10 Z" fill={SQUIRREL} />
      <Ellipse cx={0} cy={-7} rx={5} ry={7} fill={SQUIRREL} />
      <Ellipse cx={1.4} cy={-6} rx={2.6} ry={5} fill={SQ_BELLY} />
      <Circle cx={2} cy={-16} r={4} fill={SQUIRREL} />
      <Path d="M0,-19 L0,-23 L2,-20 Z" fill={SQUIRREL} />
      <Circle cx={3.6} cy={-16.6} r={0.9} fill={DARK} />
    </G>
  );
}

/** Olive-backed sunbird. (x, y) = centre. */
function Sunbird({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-4,0 L-10,3 L-9,-1 Z" fill={SUNBIRD_BACK} />
      <Ellipse cx={0} cy={0} rx={5} ry={3.4} fill={SUNBIRD_BACK} />
      <Ellipse cx={1} cy={1.2} rx={3.6} ry={2} fill={SUNBIRD_BREAST} />
      <Circle cx={4.6} cy={-2.4} r={2.6} fill={SUNBIRD_BACK} />
      <Path d="M6.8,-2.4 Q10,-2 11,0" stroke={DARK} strokeWidth={0.8} fill="none" strokeLinecap="round" />
      <Circle cx={5.4} cy={-3} r={0.6} fill={DARK} />
    </G>
  );
}

// ─── Scenery helpers ──────────────────────────────────────────

/** Tall straight dipterocarp. (x, y) = base. */
function TallTree({ x, y, h = 150, s = 1 }: { x: number; y: number; h?: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d={`M-4,0 L-2.4,${-h} L2.4,${-h} L4,0 Z`} fill={TRUNK} />
      <Path d={`M0,${-h * 0.7} L-12,${-h * 0.8}`} stroke={TRUNK} strokeWidth={2} strokeLinecap="round" />
      <Ellipse cx={-14} cy={-h * 0.82} rx={12} ry={6} fill={CROWN} />
      <Ellipse cx={-10} cy={-h - 2} rx={20} ry={11} fill={CROWN} />
      <Ellipse cx={14} cy={-h + 4} rx={18} ry={10} fill={CROWN} />
      <Ellipse cx={2} cy={-h - 10} rx={16} ry={9} fill={CROWN_LIGHT} />
    </G>
  );
}

function FallenLeaves({ c, y, seed = 9, count = 26 }: { c: SceneCtx; y: number; seed?: number; count?: number }) {
  const r = rng(seed);
  return (
    <G>
      {Array.from({ length: count }, (_, i) => {
        const lx = r() * c.W;
        const ly = y + r() * (c.H - y);
        return <Ellipse key={i} cx={lx} cy={ly} rx={3} ry={1.4} fill={LEAF_GOLD[i % 3]} transform={`rotate(${r() * 180} ${lx} ${ly})`} />;
      })}
    </G>
  );
}

function Stones({ list }: { list: Array<[number, number, number]> }) {
  return (
    <G>
      {list.map(([sx, sy, r], i) => (
        <G key={i}>
          <Ellipse cx={sx} cy={sy} rx={r} ry={r * 0.55} fill={i % 2 ? STONE_DARK : STONE} />
          <Ellipse cx={sx - r * 0.3} cy={sy - r * 0.2} rx={r * 0.35} ry={r * 0.15} fill="#FFFFFF" opacity={0.25} />
        </G>
      ))}
    </G>
  );
}

/** Small cool pool in deep shade. (x, y) = centre. steep adds dark banks. */
function Pool({ x, y, rx = 60, ry = 16, steep = false }: { x: number; y: number; rx?: number; ry?: number; steep?: boolean }) {
  return (
    <G>
      <Ellipse cx={x} cy={y - 4} rx={rx * 1.6} ry={ry * 2.4} fill={SHADE} opacity={0.35} />
      {steep ? <Ellipse cx={x} cy={y - 2} rx={rx + 8} ry={ry + 7} fill="#6A5232" /> : null}
      <Ellipse cx={x} cy={y} rx={rx} ry={ry} fill={POOL[1]} />
      <Ellipse cx={x} cy={y + (steep ? 4 : 1)} rx={rx * 0.9} ry={ry * (steep ? 0.6 : 0.8)} fill={POOL[0]} />
      <Path d={`M${x - rx * 0.5},${y + 2} L${x - rx * 0.2},${y + 2} M${x + rx * 0.1},${y + 6} L${x + rx * 0.4},${y + 6}`} stroke={SPRAY} strokeWidth={1.2} strokeLinecap="round" opacity={0.6} />
    </G>
  );
}

/** Sparkling arc of droplets from (x1, y1) falling around (x2, y2). */
function Spray({ x1, y1, x2, y2, spread = 30, seed = 3 }: { x1: number; y1: number; x2: number; y2: number; spread?: number; seed?: number }) {
  const r = rng(seed);
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - 40;
  return (
    <G>
      <Path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} stroke={SPRAY} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
      {Array.from({ length: 22 }, (_, i) => {
        const dx = x2 + (r() - 0.5) * spread * 2;
        const dy = y2 - 10 + r() * 40;
        return i % 4 === 0 ? (
          <Path key={i} d={`M${dx},${dy - 3} L${dx + 0.8},${dy} L${dx},${dy + 3} L${dx - 0.8},${dy} Z M${dx - 3},${dy} L${dx},${dy - 0.8} L${dx + 3},${dy} L${dx},${dy + 0.8} Z`} fill="#FFFFFF" />
        ) : (
          <Circle key={i} cx={dx} cy={dy} r={1 + r() * 1.4} fill={SPRAY} opacity={0.85} />
        );
      })}
    </G>
  );
}

function Bush({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={-14} cy={-8} rx={16} ry={11} fill={BUSH} />
      <Ellipse cx={12} cy={-10} rx={18} ry={13} fill={BUSH} />
      <Ellipse cx={0} cy={-16} rx={14} ry={10} fill="#828E46" />
    </G>
  );
}

/** Honey-gold forest backdrop: sky, blue hills, tall trees, dry ground from y. */
function Forest({ c, y, seed = 1, trees = [40, 110, 270, 330] }: { c: SceneCtx; y: number; seed?: number; trees?: number[] }) {
  return (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name={`sun${seed}`} cx={c.W * 0.7} cy={c.H * 0.12} r={c.W * 0.4} color={c.p.glow} opacity={0.7} />
      <Ridge c={c} y={y - 26} amp={22} seed={seed} color={HILLS} />
      <Ridge c={c} y={y - 6} amp={10} seed={seed + 1} color={HILLS_NEAR} />
      {trees.map((tx, i) => (
        <TallTree key={tx} x={tx} y={y + 4} h={y - 30 + (i % 2) * 14} s={0.9 + (i % 3) * 0.08} />
      ))}
      <Rect x={0} y={y} width={c.W} height={c.H - y + 2} fill={c.p.ground} />
      <FallenLeaves c={c} y={y + 4} seed={seed + 2} />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Forest c={c} y={230} seed={4} trees={[30, 96, 290, 340]} />
    <Pool x={186} y={330} rx={92} ry={18} />
    <Stones list={[[70, 330, 10], [300, 340, 9], [80, 348, 7]]} />
    <Bin x={100} y={300} s={1.6} trunk="up" happy flap />
    <Spray x1={176} y1={207} x2={262} y2={240} spread={44} seed={5} />
    <Deer x={252} y={292} s={1.5} flip />
    <Squirrel x={302} y={290} s={1.4} flip />
    <Sunbird x={232} y={216} s={1.4} flip />
    <Sunbird x={286} y={226} s={1.2} flip />
    <Finish c={c} vignette={0.25} />
  </G>
);

const pages = [
  // 1 — Bin splashing happily in a clear forest stream among tall trees
  (c: SceneCtx) => (
    <G>
      <Forest c={c} y={150} seed={11} />
      <Water c={c} y={170} top={POOL[0]} bottom={POOL[1]} shimmer={SPRAY} name="stream1" seed={12} />
      <Stones list={[[40, 186, 10], [320, 200, 12], [290, 214, 7]]} />
      <Bin x={170} y={206} s={1.3} trunk="up" happy />
      <Spray x1={232} y1={131} x2={256} y2={150} spread={22} seed={13} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 2 — the shrinking stream between stones, golden leaves, one small pool in deep shade
  (c: SceneCtx) => (
    <G>
      <Forest c={c} y={140} seed={21} trees={[60, 230, 290, 340]} />
      <Path d="M-10,180 Q60,172 120,184 Q160,192 190,196" stroke={POOL[0]} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.8} />
      <Stones list={[[30, 176, 9], [80, 186, 11], [130, 180, 8], [160, 200, 10], [110, 206, 7]]} />
      <Ellipse cx={268} cy={196} rx={90} ry={34} fill={SHADE} opacity={0.4} />
      <Pool x={260} y={204} rx={42} ry={11} />
      <Stones list={[[216, 210, 8], [306, 206, 9]]} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 3 — Bin drinking from the shady pool, ears flapping, pleased with himself
  (c: SceneCtx) => (
    <G>
      <Forest c={c} y={140} seed={31} trees={[40, 120, 300]} />
      <Pool x={220} y={206} rx={64} ry={14} />
      <Bin x={130} y={200} s={1.35} trunk="down" happy flap />
      <Stones list={[[290, 214, 9], [70, 210, 8]]} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 4 — a deer, a squirrel and two sunbirds peek from the bushes at the steep-banked pool
  (c: SceneCtx) => (
    <G>
      <Forest c={c} y={136} seed={41} trees={[30, 200, 330]} />
      <Pool x={200} y={206} rx={70} ry={16} steep />
      <Bush x={90} y={186} s={1.4} />
      <Deer x={110} y={182} s={1.3} />
      <Bush x={60} y={192} s={1.1} />
      <Squirrel x={146} y={186} s={1.2} />
      <Sunbird x={130} y={128} s={1.2} />
      <Sunbird x={150} y={118} s={1} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 5 — Bin looks thoughtfully at the small animals, then dips his trunk into the pool
  (c: SceneCtx) => (
    <G>
      <Forest c={c} y={136} seed={51} trees={[60, 160, 320]} />
      <Pool x={190} y={208} rx={70} ry={14} steep />
      <Bin x={90} y={200} s={1.3} trunk="down" />
      <Bush x={300} y={190} s={1.2} />
      <Deer x={268} y={190} s={1.2} flip />
      <Squirrel x={300} y={192} s={1.1} flip />
      <Sunbird x={256} y={140} s={1.1} flip />
      <Sunbird x={284} y={128} s={0.9} flip />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 6 — a gentle sparkling shower over the deer, squirrel and sunbirds; everyone laughing
  (c: SceneCtx) => (
    <G>
      <Forest c={c} y={136} seed={61} trees={[40, 300, 340]} />
      <Pool x={175} y={214} rx={66} ry={12} />
      <Glow c={c} name="sparkle" cx={250} cy={150} r={70} color={c.p.glow} opacity={0.6} />
      <Bin x={90} y={204} s={1.3} trunk="up" happy flap />
      <Spray x1={152} y1={128} x2={252} y2={150} spread={36} seed={63} />
      <Deer x={240} y={204} s={1.2} flip />
      <Squirrel x={286} y={204} s={1.1} flip />
      <Sunbird x={224} y={128} s={1.1} flip />
      <Sunbird x={276} y={138} s={1} flip />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 7 — soft grey clouds over the hills and the first rain; the friends dance under a big tree
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#9AA0A8" mid="#C2C0B8" bottom="#E2D6BC" />
      <Glow c={c} name="lowSun" cx={300} cy={130} r={80} color={c.p.glow} opacity={0.4} />
      <Sun cx={300} cy={132} r={10} color="#FBEED2" />
      <Ridge c={c} y={124} amp={22} seed={71} color="#8EA0A8" />
      <Cloud x={70} y={50} s={1.8} color="#B8BCC2" />
      <Cloud x={190} y={40} s={2.1} color="#C8CACE" />
      <Cloud x={300} y={56} s={1.6} color="#B8BCC2" />
      <TallTree x={84} y={196} h={150} s={1.1} />
      <Rect x={0} y={192} width={c.W} height={50} fill="#8A7A4E" />
      <FallenLeaves c={c} y={196} seed={72} count={18} />
      <Rain c={c} color="#E8F0F4" count={60} seed={73} opacity={0.6} />
      <Bin x={150} y={216} s={1.2} trunk="up" happy flap />
      <Deer x={236} y={214} s={1.2} flip leap />
      <Squirrel x={280} y={214} s={1.1} flip />
      <Sunbird x={210} y={130} s={1.1} flip />
      <Sunbird x={256} y={120} s={1} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
];

export const VOI_CON_BAN_DON: StoryScenes = { cover, pages };
