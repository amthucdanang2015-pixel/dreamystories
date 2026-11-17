// Chiếc Thuyền Giấy Trên Đầm Sen — dreamy, hushed wonder on a village lotus
// pond. Signature: lavender dusk deepening to indigo night, huge round lotus
// leaves, lotus buds that glow soft pink like lanterns, silver ripple rings,
// a cream notebook-paper boat with a tiny painted star, stone steps and a
// wooden window. Calm water only — no waves, no one in the water.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { Figure, Finish, Glow, Lotus, SceneCtx, Sky, Stars, StoryScenes, Water, rng } from '../kit';

// ─── Colours ──────────────────────────────────────────────────

const PAPER = '#F6EEDB';
const PAPER_SHADE = '#DCD0B4';
const GRID = '#9FB6D6';
const STAR = '#E58FA8';
const LEAF = '#3E7A5E';
const LEAF_LIGHT = '#5C9A76';
const LEAF_DARK = '#2A5A45';
const BUD = '#F2A7BC';
const BUD_GLOW = '#FFD6E0';
const WHITE_LOTUS = '#FBF6F2';
const FROG = '#6CC24A';
const FROG_BELLY = '#E8F2C2';
const FISH_RED = '#E0583E';
const FISH_BLUE = '#3F7FC2';
const DRAGON = '#3FB8B0';
const WING = '#E8F6FA';
const STONE = '#8A8478';
const STONE_DARK = '#6B665C';
const WOOD = '#7A5236';
const WOOD_DARK = '#58391F';
const WALL = '#E8D9BC';
const ROOF = '#9C4B36';
const SHIRT = '#F2D98A';
const PANTS = '#E9DDB5';

// ─── Characters ───────────────────────────────────────────────

/** The folded paper boat, bow to the right. (x, y) = waterline centre; s = 1 is ~40 wide. */
function PaperBoat({ x, y, s = 1, flip = false, reflect = true }: { x: number; y: number; s?: number; flip?: boolean; reflect?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {reflect ? <Path d="M-18,1 L18,1 L12,8 L-12,8 Z" fill={PAPER} opacity={0.18} /> : null}
      {/* sail triangle */}
      <Path d="M-10,-6 L0,-24 L10,-6 Z" fill={PAPER} />
      <Path d="M0,-24 L10,-6 L0,-6 Z" fill={PAPER_SHADE} />
      {/* hull */}
      <Path d="M-20,-8 L20,-8 L13,1 L-13,1 Z" fill={PAPER} />
      <Path d="M-20,-8 L-13,1 L-8,-8 Z" fill={PAPER_SHADE} />
      <Path d="M20,-8 L13,1 L8,-8 Z" fill={PAPER_SHADE} />
      {/* notebook grid */}
      <Path d="M-12,-4.5 L12,-4.5 M-4,-16 L4,-16 M-6,-12 L6,-12" stroke={GRID} strokeWidth={0.5} opacity={0.8} />
      <Path d="M-6,-8 L-6,0 M0,-8 L0,0 M6,-8 L6,0" stroke={GRID} strokeWidth={0.5} opacity={0.6} />
      {/* tiny painted star */}
      <Path d="M3,-13 L3.8,-11.2 L5.6,-11 L4.2,-9.8 L4.6,-8 L3,-9 L1.4,-8 L1.8,-9.8 L0.4,-11 L2.2,-11.2 Z" fill={STAR} />
    </G>
  );
}

/** A big round lotus leaf seen from a low angle. */
function LotusLeaf({ x, y, rx = 30, notch = 0 }: { x: number; y: number; rx?: number; notch?: number }) {
  const ry = rx * 0.34;
  const nx = Math.cos(notch) * rx;
  const ny = Math.sin(notch) * ry;
  return (
    <G>
      <Ellipse cx={x} cy={y + 2} rx={rx} ry={ry} fill={LEAF_DARK} />
      <Ellipse cx={x} cy={y} rx={rx} ry={ry} fill={LEAF} />
      <Ellipse cx={x - rx * 0.2} cy={y - ry * 0.2} rx={rx * 0.55} ry={ry * 0.45} fill={LEAF_LIGHT} opacity={0.5} />
      <Path d={`M${x},${y} L${x + nx},${y + ny} L${x + nx * 0.9 + 4},${y + ny * 0.9 - 2} Z`} fill={LEAF_DARK} />
      {[0.5, 1.6, 2.6, 3.7, 4.8].map((a, i) => (
        <Path key={i} d={`M${x},${y} L${x + Math.cos(a) * rx * 0.85},${y + Math.sin(a) * ry * 0.85}`} stroke={LEAF_DARK} strokeWidth={0.6} opacity={0.5} />
      ))}
    </G>
  );
}

/** A lotus bud on a stem, glowing like a little lantern when `lit`. */
function Bud({ x, y, h = 22, lit = true, s = 1 }: { x: number; y: number; h?: number; lit?: boolean; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d={`M0,0 Q2,${-h * 0.5} 0,${-h}`} stroke={LEAF_DARK} strokeWidth={1.4} fill="none" />
      {lit ? (
        <G>
          <Circle cx={0} cy={-h - 6} r={16} fill={BUD_GLOW} opacity={0.12} />
          <Circle cx={0} cy={-h - 6} r={9} fill={BUD_GLOW} opacity={0.25} />
        </G>
      ) : null}
      <Path d={`M0,${-h} C-6,${-h - 3} -5,${-h - 11} 0,${-h - 15} C5,${-h - 11} 6,${-h - 3} 0,${-h} Z`} fill={lit ? BUD : '#C98BA0'} />
      <Path d={`M0,${-h - 1} C-2,${-h - 5} -1.5,${-h - 10} 0,${-h - 13}`} stroke="#FFFFFF" strokeWidth={1} fill="none" opacity={lit ? 0.6 : 0.3} />
    </G>
  );
}

function Frog({ x, y, s = 1, flip = false, push = false, wave = false }: { x: number; y: number; s?: number; flip?: boolean; push?: boolean; wave?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Ellipse cx={-6} cy={-2} rx={6} ry={3} fill={FROG} />
      <Ellipse cx={0} cy={-8} rx={11} ry={8} fill={FROG} />
      <Ellipse cx={2} cy={-5} rx={7} ry={4.5} fill={FROG_BELLY} />
      <Circle cx={-4} cy={-15} r={4} fill={FROG} />
      <Circle cx={5} cy={-15} r={4} fill={FROG} />
      <Circle cx={-4} cy={-15.5} r={2.2} fill="#FFFFFF" />
      <Circle cx={5} cy={-15.5} r={2.2} fill="#FFFFFF" />
      <Circle cx={-3.4} cy={-15.5} r={1.2} fill="#1E2A16" />
      <Circle cx={5.6} cy={-15.5} r={1.2} fill="#1E2A16" />
      <Path d="M-3,-9 Q1,-5.5 6,-9" stroke="#2F5A1E" strokeWidth={1} fill="none" strokeLinecap="round" />
      <Circle cx={-6} cy={-9} r={1.6} fill="#F2A3B5" opacity={0.5} />
      <Circle cx={8} cy={-9} r={1.6} fill="#F2A3B5" opacity={0.5} />
      {push ? (
        <Path d="M8,-6 Q14,-6 18,-8" stroke={FROG} strokeWidth={3} fill="none" strokeLinecap="round" />
      ) : wave ? (
        <Path d="M8,-8 Q13,-14 12,-20" stroke={FROG} strokeWidth={3} fill="none" strokeLinecap="round" />
      ) : (
        <Ellipse cx={8} cy={-1} rx={4} ry={2} fill={FROG} />
      )}
    </G>
  );
}

function ParadiseFish({ x, y, s = 1, flip = false, jump = false }: { x: number; y: number; s?: number; flip?: boolean; jump?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s}) rotate(${jump ? -30 : 0})`}>
      <Path d="M-8,0 Q-16,-8 -22,-6 Q-18,0 -22,6 Q-16,8 -8,0 Z" fill={FISH_RED} opacity={0.9} />
      <Ellipse cx={0} cy={0} rx={10} ry={4.6} fill={FISH_RED} />
      <Path d="M-5,-4 L-5,4 M-1,-4.5 L-1,4.5 M3,-4 L3,4" stroke={FISH_BLUE} strokeWidth={1.6} />
      <Path d="M-4,-4 Q0,-10 6,-4 Z" fill={FISH_BLUE} opacity={0.8} />
      <Circle cx={6} cy={-1} r={1.3} fill="#FFFFFF" />
      <Circle cx={6.3} cy={-1} r={0.7} fill="#1A1426" />
    </G>
  );
}

function Dragonfly({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <G opacity={0.75}>
        <Ellipse cx={-2} cy={-6} rx={9} ry={2.6} fill={WING} transform="rotate(-20 -2 -6)" />
        <Ellipse cx={-2} cy={-3} rx={8} ry={2.2} fill={WING} transform="rotate(15 -2 -3)" />
        <Ellipse cx={4} cy={-6} rx={8} ry={2.4} fill={WING} transform="rotate(25 4 -6)" />
      </G>
      <Path d="M-18,-3 L2,-4" stroke={DRAGON} strokeWidth={2.2} strokeLinecap="round" />
      <Circle cx={4} cy={-4} r={2.8} fill={DRAGON} />
      <Circle cx={5.2} cy={-4.8} r={1} fill="#1A1426" />
    </G>
  );
}

function Ripples({ x, y, n = 3, w = 20, opacity = 0.45 }: { x: number; y: number; n?: number; w?: number; opacity?: number }) {
  return (
    <G opacity={opacity}>
      {Array.from({ length: n }, (_, i) => (
        <Ellipse key={i} cx={x} cy={y} rx={w * (0.5 + i * 0.5)} ry={w * (0.12 + i * 0.12)} fill="none" stroke="#E6E2F4" strokeWidth={0.8} />
      ))}
    </G>
  );
}

function StarReflections({ c, y, seed = 9, n = 12 }: { c: SceneCtx; y: number; seed?: number; n?: number }) {
  const r = rng(seed);
  return (
    <G>
      {Array.from({ length: n }, (_, i) => (
        <Rect key={i} x={r() * c.W} y={y + 6 + r() * (c.H - y - 10)} width={3 + r() * 4} height={1} rx={0.5} fill="#F4EEFF" opacity={0.4 + r() * 0.3} />
      ))}
    </G>
  );
}

/** Stone steps and a house corner with a wooden window, on the left side. */
function HouseCorner({ x, y, s = 1, lit = false, sleeper = false }: { x: number; y: number; s?: number; lit?: boolean; sleeper?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {/* house wall & roof */}
      <Rect x={-90} y={-110} width={86} height={84} fill={WALL} />
      <Path d="M-100,-108 L-6,-108 L4,-126 L-90,-126 Z" fill={ROOF} />
      {/* window */}
      <Rect x={-60} y={-92} width={40} height={32} fill={WOOD_DARK} />
      <Rect x={-57} y={-89} width={34} height={26} fill={lit ? '#FCE7C0' : '#2A2340'} />
      {lit ? <Rect x={-57} y={-89} width={34} height={26} fill="#FFF4D8" opacity={0.35} /> : null}
      {sleeper ? (
        <G>
          <Rect x={-55} y={-72} width={30} height={7} rx={2} fill="#E7A9B6" />
          <Ellipse cx={-48} cy={-73} rx={6} ry={3.6} fill="#FFFFFF" />
          <Circle cx={-46} cy={-76} r={4.2} fill="#E8B98F" />
          <Path d="M-50.2,-77.5 Q-46,-83 -41.8,-77.5 Q-46,-79.5 -50.2,-77.5 Z" fill="#1E1712" />
          <Path d="M-47.6,-75.6 Q-46.6,-74.6 -45.6,-75.6" stroke="#2A1A10" strokeWidth={0.6} fill="none" />
        </G>
      ) : null}
      {sleeper ? (
        <G>
          {/* shutters swung open */}
          <Path d="M-60,-92 L-72,-88 L-72,-56 L-60,-60 Z" fill={WOOD} />
          <Path d="M-20,-92 L-8,-88 L-8,-56 L-20,-60 Z" fill={WOOD} />
        </G>
      ) : (
        [-50, -40, -30].map((wx) => <Rect key={wx} x={wx - 0.8} y={-89} width={1.6} height={26} fill={WOOD} />)
      )}
      {/* steps down to the water */}
      <Rect x={-96} y={-26} width={92} height={8} fill={STONE} />
      <Rect x={-96} y={-18} width={102} height={8} fill={STONE_DARK} />
      <Rect x={-96} y={-10} width={112} height={10} fill={STONE} />
      <Path d="M-90,-22 l10,0 M-60,-14 l14,0 M-30,-6 l12,0" stroke={STONE_DARK} strokeWidth={0.8} />
    </G>
  );
}

function NightPond({ c, y, dusk = false, stars = 30, seed = 3 }: { c: SceneCtx; y: number; dusk?: boolean; stars?: number; seed?: number }) {
  return (
    <G>
      {dusk ? (
        <Sky c={c} top="#4A4478" mid="#9A7FA6" bottom="#E7B6A8" />
      ) : (
        <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      )}
      {stars ? <Stars c={c} count={stars} seed={seed} color="#F4EEFF" maxY={y - 20} opacity={dusk ? 0.4 : 0.7} /> : null}
      <Path d={`M-10,${y} Q60,${y - 14} 140,${y - 6} T${c.W + 10},${y - 4} L${c.W + 10},${y + 2} L-10,${y + 2} Z`} fill={dusk ? '#4B5A6E' : '#1E2E3A'} />
      <Water c={c} y={y} top={dusk ? '#8A7AA0' : '#2A3456'} bottom={dusk ? '#4E4A72' : '#151A30'} name="pond" seed={seed + 1} />
      <StarReflections c={c} y={y} seed={seed + 2} n={dusk ? 6 : 12} />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <NightPond c={c} y={180} stars={50} seed={5} />
    <LotusLeaf x={70} y={232} rx={46} notch={0.4} />
    <LotusLeaf x={300} y={226} rx={50} notch={2.6} />
    <LotusLeaf x={250} y={300} rx={60} notch={3.8} />
    <LotusLeaf x={80} y={316} rx={56} notch={5.2} />
    <Bud x={110} y={222} h={30} />
    <Bud x={264} y={214} h={36} />
    <Bud x={300} y={290} h={30} />
    <Bud x={46} y={300} h={26} />
    <Glow c={c} name="boat" cx={180} cy={196} r={70} color={c.p.glow} opacity={0.35} />
    <Ripples x={180} y={214} n={3} w={30} />
    <PaperBoat x={180} y={214} s={2.6} />
    <Finish c={c} vignette={0.32} />
  </G>
);

const pages = [
  // 1 — dusk: Na sits on the stone steps and folds a paper boat
  (c: SceneCtx) => (
    <G>
      <NightPond c={c} y={150} dusk stars={6} seed={11} />
      <HouseCorner x={196} y={176} s={1} />
      <LotusLeaf x={272} y={196} rx={30} notch={2.8} />
      <LotusLeaf x={236} y={222} rx={38} notch={4} />
      <Lotus x={280} y={190} s={1} color={BUD} leaf={LEAF} bloom />
      <Figure x={164} y={152} s={0.8} top={SHIRT} bottom={PANTS} hairStyle="bob" pose="hold" sitting />
      <PaperBoat x={182} y={130} s={0.6} reflect={false} />
      <Finish c={c} vignette={0.26} />
    </G>
  ),
  // 2 — the little boat drifts between big round lotus leaves at dusk
  (c: SceneCtx) => (
    <G>
      <NightPond c={c} y={120} dusk stars={4} seed={21} />
      <LotusLeaf x={90} y={140} rx={34} notch={0.6} />
      <LotusLeaf x={270} y={150} rx={40} notch={2.6} />
      <LotusLeaf x={250} y={208} rx={52} notch={3.6} />
      <LotusLeaf x={96} y={214} rx={50} notch={5.4} />
      <Bud x={120} y={136} h={24} lit={false} />
      <Bud x={292} y={146} h={28} lit={false} />
      <Ripples x={180} y={182} n={3} w={24} />
      <PaperBoat x={180} y={182} s={1.6} />
      <Finish c={c} vignette={0.26} />
    </G>
  ),
  // 3 — the first stars come out and the lotus buds begin to glow like lanterns
  (c: SceneCtx) => (
    <G>
      <NightPond c={c} y={118} stars={34} seed={31} />
      <LotusLeaf x={100} y={150} rx={36} notch={0.6} />
      <LotusLeaf x={268} y={146} rx={38} notch={2.6} />
      <LotusLeaf x={250} y={214} rx={50} notch={3.6} />
      <LotusLeaf x={110} y={214} rx={48} notch={5.4} />
      <Bud x={92} y={146} h={30} />
      <Bud x={130} y={144} h={22} />
      <Bud x={250} y={142} h={34} />
      <Bud x={286} y={146} h={24} />
      <Bud x={226} y={208} h={26} />
      <Ripples x={180} y={188} n={2} w={22} />
      <PaperBoat x={180} y={188} s={1.5} />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 4 — a green frog hops onto a leaf: “Chào thuyền nhỏ!” and gives a gentle push
  (c: SceneCtx) => (
    <G>
      <NightPond c={c} y={110} stars={28} seed={41} />
      <Bud x={92} y={150} h={34} />
      <Bud x={286} y={150} h={30} />
      <LotusLeaf x={140} y={186} rx={44} notch={5.6} />
      <Frog x={134} y={186} s={1.5} push />
      <Ripples x={200} y={190} n={3} w={22} />
      <PaperBoat x={204} y={190} s={1.5} />
      <Path d="M228,176 l8,-2 M228,184 l10,0" stroke="#E6E2F4" strokeWidth={1} strokeLinecap="round" opacity={0.6} />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 5 — a little paradise fish makes silver ripples; a dragonfly rests on the bow
  (c: SceneCtx) => (
    <G>
      <NightPond c={c} y={104} stars={26} seed={51} />
      <Bud x={88} y={146} h={30} />
      <Bud x={290} y={140} h={34} />
      <LotusLeaf x={84} y={150} rx={30} notch={0.4} />
      <LotusLeaf x={290} y={146} rx={30} notch={2.8} />
      <PaperBoat x={180} y={164} s={1.8} />
      <Dragonfly x={212} y={149} s={0.95} flip />
      <ParadiseFish x={164} y={206} s={1.4} />
      <Ripples x={150} y={196} n={3} w={18} opacity={0.6} />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 6 — a great white lotus opens; a dewdrop inside shines like a tiny moon
  (c: SceneCtx) => (
    <G>
      <NightPond c={c} y={110} stars={30} seed={61} />
      <Glow c={c} name="white" cx={180} cy={120} r={80} color="#FFF6FA" opacity={0.4} />
      <LotusLeaf x={180} y={160} rx={70} notch={4.4} />
      <G transform="translate(180,152) scale(2.4)">
        <Path d="M0,0 C-16,-2 -20,-12 -16,-18 C-10,-12 -4,-6 0,0 Z" fill={WHITE_LOTUS} />
        <Path d="M0,0 C16,-2 20,-12 16,-18 C10,-12 4,-6 0,0 Z" fill={WHITE_LOTUS} />
        <Path d="M0,0 C-10,-6 -10,-18 -5,-24 C-2,-16 -1,-8 0,0 Z" fill="#F1E8EC" />
        <Path d="M0,0 C10,-6 10,-18 5,-24 C2,-16 1,-8 0,0 Z" fill="#F1E8EC" />
        <Ellipse cx={0} cy={-6} rx={5} ry={2.4} fill="#F4D88A" />
        <Circle cx={0} cy={-9} r={2.6} fill="#EAF6FF" />
        <Circle cx={0} cy={-9} r={4.5} fill="#EAF6FF" opacity={0.3} />
        <Circle cx={-0.8} cy={-9.8} r={0.8} fill="#FFFFFF" />
      </G>
      <Ripples x={180} y={206} n={2} w={20} />
      <PaperBoat x={180} y={206} s={1.2} />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 7 — the breeze turns the boat towards home; Frog, the fish and Dragonfly wave goodbye
  (c: SceneCtx) => (
    <G>
      <NightPond c={c} y={124} stars={26} seed={71} />
      <HouseCorner x={156} y={150} s={0.62} lit />
      <LotusLeaf x={228} y={180} rx={34} notch={3} />
      <Frog x={226} y={180} s={1.2} flip wave />
      <ParadiseFish x={254} y={204} s={1} flip jump />
      <Dragonfly x={262} y={150} s={0.9} flip />
      <Ripples x={150} y={204} n={3} w={20} />
      <PaperBoat x={150} y={204} s={1.4} flip />
      <Path d="M186,200 q10,-4 20,0 M190,210 q10,-3 18,0" stroke="#E6E2F4" strokeWidth={0.9} fill="none" opacity={0.5} />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 8 — the boat rests at the steps below Na's window; she is asleep; the pond is still
  (c: SceneCtx) => (
    <G>
      <NightPond c={c} y={160} stars={40} seed={81} />
      <HouseCorner x={226} y={196} s={1.15} lit sleeper />
      <Bud x={270} y={214} h={20} s={0.9} />
      <LotusLeaf x={284} y={218} rx={30} notch={2.6} />
      <PaperBoat x={200} y={214} s={1.2} />
      <Finish c={c} vignette={0.34} />
    </G>
  ),
];

export const THUYEN_GIAY_DAM_SEN: StoryScenes = { cover, pages };
