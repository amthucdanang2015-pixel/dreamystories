// Ếch Con Hát Ru — hushed Mekong Delta paddies at dusk. Signature: blue-green
// dusk deepening into a calm starry night, a narrow canal with water-lily
// leaves, rows of young rice, a coconut palm and one warm thatched window on
// the far bank, fireflies, and a tiny bright-green frog whose song is drawn as
// a few small soft notes (the big frogs' croaks are bold sound arcs).

import React from 'react';
import { Circle, Ellipse, G, Path } from 'react-native-svg';
import {
  Fireflies,
  Finish,
  Glow,
  Grass,
  Hut,
  MoonDisc,
  Paddies,
  Palm,
  Ridge,
  SceneCtx,
  Sky,
  Stars,
  StoryScenes,
  Sun,
  Water,
} from '../kit';

// ─── Colours ──────────────────────────────────────────────────

const FROG = '#6FBF4A';
const FROG_BELLY = '#F1EBC8';
const FROG_EYE = '#E9C04A';
const BIG_FROG = '#7A7A3E';
const BIG_BELLY = '#C9BE8A';
const DUCKLING = '#F4E08A';
const BEAK = '#E89A4A';
const DUCK = '#F4F1EA';
const DUCK_BAND = '#AEB4B8';
const DARK = '#1A1410';
const LILY = '#3F7A4E';
const LILY_LIGHT = '#5E9A62';
const RICE = '#7FB46A';
const PALM_TRUNK = '#3A3A2E';
const PALM_LEAF = '#24432E';
const HUT_WALL = '#5A5A44';
const HUT_ROOF = '#3E3A2A';
const HUT_DOOR = '#22261C';
const BANK = '#2C4A2C';
const MOON = '#F2EBC8';

// ─── Characters ───────────────────────────────────────────────

type Mouth = 'smile' | 'sing' | 'croak';

/** A front-facing frog. (x, y) = bottom centre; s = 1 is ~22 units wide. */
function Frog({
  x,
  y,
  s = 1,
  big = false,
  mouth = 'smile',
  sleepy = false,
}: {
  x: number;
  y: number;
  s?: number;
  big?: boolean;
  mouth?: Mouth;
  sleepy?: boolean;
}) {
  const body = big ? BIG_FROG : FROG;
  const belly = big ? BIG_BELLY : FROG_BELLY;
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={-9} cy={-2} rx={5.5} ry={3} fill={body} />
      <Ellipse cx={9} cy={-2} rx={5.5} ry={3} fill={body} />
      <Ellipse cx={0} cy={-8} rx={11} ry={8} fill={body} />
      <Ellipse cx={0} cy={-5} rx={6.5} ry={4.5} fill={belly} />
      {mouth === 'croak' ? <Ellipse cx={0} cy={-5} rx={7.5} ry={5.5} fill={belly} opacity={0.95} /> : null}
      <Circle cx={-5} cy={-15} r={4} fill={body} />
      <Circle cx={5} cy={-15} r={4} fill={body} />
      {sleepy ? (
        <Path d="M-7,-15 Q-5,-13.6 -3,-15 M3,-15 Q5,-13.6 7,-15" stroke={DARK} strokeWidth={0.8} fill="none" strokeLinecap="round" />
      ) : (
        <G>
          <Circle cx={-5} cy={-15} r={2.6} fill={big ? '#D9B85A' : FROG_EYE} />
          <Circle cx={5} cy={-15} r={2.6} fill={big ? '#D9B85A' : FROG_EYE} />
          <Circle cx={-4.6} cy={-15} r={1.1} fill={DARK} />
          <Circle cx={5.4} cy={-15} r={1.1} fill={DARK} />
        </G>
      )}
      {mouth === 'smile' ? (
        <Path d="M-3,-10 Q0,-8 3,-10" stroke={DARK} strokeWidth={0.7} fill="none" strokeLinecap="round" />
      ) : mouth === 'sing' ? (
        <Ellipse cx={0} cy={-9.6} rx={1.1} ry={1.4} fill={DARK} opacity={0.8} />
      ) : (
        <Ellipse cx={0} cy={-10.4} rx={3} ry={1.6} fill={DARK} opacity={0.8} />
      )}
      <Circle cx={-7.5} cy={-10.5} r={1.3} fill="#E58C7A" opacity={0.35} />
      <Circle cx={7.5} cy={-10.5} r={1.3} fill="#E58C7A" opacity={0.35} />
    </G>
  );
}

/** A fluffy duckling floating on the water, facing right. (x, y) = waterline centre. */
function Duckling({
  x,
  y,
  s = 1,
  mode = 'awake',
  flip = false,
}: {
  x: number;
  y: number;
  s?: number;
  mode?: 'awake' | 'sleep' | 'tucked';
  flip?: boolean;
}) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-10,0 Q-12,-8 -4,-10 Q4,-11 9,-5 Q10,0 8,0 Z" fill={DUCKLING} />
      <Path d="M-10,-4 L-14,-8 L-11,-2 Z" fill={DUCKLING} />
      <Path d="M-6,-6 Q0,-9 4,-4" stroke="#E2C866" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      {mode === 'tucked' ? (
        <Circle cx={2} cy={-9} r={5} fill={DUCKLING} />
      ) : (
        <G>
          <Circle cx={7} cy={-14} r={5.4} fill={DUCKLING} />
          <Path d="M11.5,-14 L16,-13 L11.5,-11.5 Z" fill={BEAK} />
          {mode === 'sleep' ? (
            <Path d="M7.4,-15 Q8.6,-14 9.8,-15" stroke={DARK} strokeWidth={0.7} fill="none" strokeLinecap="round" />
          ) : (
            <Circle cx={8.8} cy={-15} r={0.9} fill={DARK} />
          )}
          <Circle cx={9} cy={-12.4} r={1.1} fill="#F0A08A" opacity={0.4} />
        </G>
      )}
    </G>
  );
}

/** White farm duck with a grey wing band, facing right. (x, y) = waterline centre. */
function MotherDuck({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-20,0 Q-24,-14 -8,-16 Q8,-17 16,-8 Q18,0 14,0 Z" fill={DUCK} />
      <Path d="M-20,-8 L-27,-15 L-21,-3 Z" fill={DUCK} />
      <Path d="M-12,-9 Q-2,-13 8,-6" stroke={DUCK_BAND} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M10,-12 Q10,-22 13,-28" stroke={DUCK} strokeWidth={6} fill="none" strokeLinecap="round" />
      <Circle cx={14} cy={-30} r={6} fill={DUCK} />
      <Path d="M19,-31 L25,-29.5 L19,-27.6 Z" fill={BEAK} />
      <Path d="M14.6,-31.6 Q15.8,-33 17,-31.6" stroke={DARK} strokeWidth={0.8} fill="none" strokeLinecap="round" />
    </G>
  );
}

// ─── Scenery helpers ──────────────────────────────────────────

/** Water-lily leaf with its notch. (x, y) = centre. */
function Lily({ x, y, r = 12, light = false }: { x: number; y: number; r?: number; light?: boolean }) {
  const ry = r * 0.36;
  return (
    <Path
      d={`M${x},${y} L${x + r},${y - 1.2} A${r},${ry} 0 1,0 ${x + r},${y + 1.2} Z`}
      fill={light ? LILY_LIGHT : LILY}
    />
  );
}

function Ripples({ x, y, s = 1, color = '#BFD8D0', opacity = 0.5 }: { x: number; y: number; s?: number; color?: string; opacity?: number }) {
  return (
    <G opacity={opacity}>
      {[14, 22, 30].map((rx, i) => (
        <Ellipse key={i} cx={x - i * 6 * s} cy={y + 1} rx={rx * s} ry={2.6 * s + i * 0.6} stroke={color} strokeWidth={1} fill="none" opacity={1 - i * 0.28} />
      ))}
    </G>
  );
}

/** A few small soft music notes drifting up from (x, y). */
function SoftNotes({ x, y, color, s = 1 }: { x: number; y: number; color: string; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`} opacity={0.9}>
      {[
        [0, 0, 1],
        [10, -12, 0.85],
        [2, -24, 0.7],
      ].map(([nx, ny, k], i) => (
        <G key={i} transform={`translate(${nx},${ny}) scale(${k})`}>
          <Circle cx={0} cy={0} r={5} fill={color} opacity={0.18} />
          <Ellipse cx={0} cy={0} rx={2.2} ry={1.6} fill={color} />
          <Path d="M2,0 L2,-7 Q4,-6 5,-4" stroke={color} strokeWidth={0.9} fill="none" strokeLinecap="round" />
        </G>
      ))}
    </G>
  );
}

/** Bold sound arcs for the big frogs' loud croaks. */
function Croak({ x, y, s = 1, color = '#E9DFA8', flip = false }: { x: number; y: number; s?: number; color?: string; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} opacity={0.75}>
      {[6, 11, 16].map((r, i) => (
        <Path key={i} d={`M${r * 0.5},${-r * 0.86} Q${r * 1.15},0 ${r * 0.5},${r * 0.86}`} stroke={color} strokeWidth={2.2 - i * 0.4} fill="none" strokeLinecap="round" />
      ))}
    </G>
  );
}

/** Far bank (palm, thatched house), young rice, then the canal from waterY down. */
function Delta({
  c,
  y,
  waterY,
  lit = true,
  hutX = 292,
  palmX = 252,
  seed = 3,
  water = ['#3E6A6A', '#1E3A40'],
}: {
  c: SceneCtx;
  y: number;
  waterY: number;
  lit?: boolean;
  hutX?: number;
  palmX?: number;
  seed?: number;
  water?: [string, string] | string[];
}) {
  return (
    <G>
      <Ridge c={c} y={y} amp={6} seed={seed} color={c.p.groundDeep} />
      <Palm x={palmX} y={y + 2} s={0.8} trunk={PALM_TRUNK} leaf={PALM_LEAF} kind="coconut" lean={8} />
      <Hut x={hutX} y={y + 3} s={0.55} wall={HUT_WALL} roof={HUT_ROOF} door={HUT_DOOR} lit={lit ? c.p.glow : undefined} />
      {lit ? <Glow c={c} name={`win${seed}`} cx={hutX} cy={y - 6} r={22} color={c.p.glow} opacity={0.5} /> : null}
      <Paddies c={c} y={y + 6} color={c.p.ground} line={c.p.groundDeep} rows={3} />
      <Grass c={c} y={y + 8} seed={seed + 4} color={RICE} count={22} height={7} />
      <Water c={c} y={waterY} top={water[0]} bottom={water[1]} shimmer={c.p.skyLow} name={`canal${seed}`} seed={seed + 1} />
    </G>
  );
}

/** Near bank rising from the right edge, where the big frogs sit. */
function NearBank({ c, x = 230, y = 190 }: { c: SceneCtx; x?: number; y?: number }) {
  return (
    <G>
      <Path d={`M${x},${c.H + 2} Q${x + 10},${y} ${x + 50},${y - 4} Q${x + 100},${y - 8} ${c.W + 10},${y - 2} L${c.W + 10},${c.H + 2} Z`} fill={BANK} />
      <Grass c={c} y={y - 6} seed={x} color={RICE} count={6} height={9} />
    </G>
  );
}

const DuskSky = ({ c, stars = 14, seed = 1 }: { c: SceneCtx; stars?: number; seed?: number }) => (
  <G>
    <Sky c={c} top={c.p.sky} mid="#355E66" bottom={c.p.skyLow} />
    <Stars c={c} count={stars} seed={seed} maxY={c.H * 0.35} color={c.p.glow} opacity={0.7} />
  </G>
);

const NightSky = ({ c, stars = 50, seed = 1 }: { c: SceneCtx; stars?: number; seed?: number }) => (
  <G>
    <Sky c={c} top={c.p.ink} mid={c.p.sky} bottom="#2E5258" />
    <Stars c={c} count={stars} seed={seed} maxY={c.H * 0.45} color={c.p.glow} opacity={0.8} />
  </G>
);

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <DuskSky c={c} stars={40} seed={4} />
    <Delta c={c} y={176} waterY={214} seed={5} />
    <Lily x={250} y={262} r={14} light />
    <Lily x={70} y={318} r={18} />
    <Glow c={c} name="song" cx={168} cy={270} r={80} color={c.p.glow} opacity={0.35} />
    <Lily x={148} y={292} r={34} light />
    <Lily x={222} y={300} r={26} />
    <Duckling x={224} y={300} s={1.6} mode="sleep" />
    <Ripples x={230} y={302} s={1.2} />
    <Frog x={146} y={292} s={1.5} mouth="sing" />
    <SoftNotes x={176} y={250} color={c.p.glow} s={1.2} />
    <Fireflies c={c} color={c.p.glow} count={18} seed={6} area={[30, 190, 300, 120]} />
    <Finish c={c} vignette={0.38} />
  </G>
);

const pages = [
  // 1 — the rice field at dusk; Ếch Con on a lily leaf, big frogs singing on the bank
  (c: SceneCtx) => (
    <G>
      <DuskSky c={c} stars={12} seed={11} />
      <Glow c={c} name="dusk" cx={110} cy={118} r={110} color={c.p.glow} opacity={0.25} />
      <Delta c={c} y={116} waterY={150} seed={12} />
      <Lily x={70} y={176} r={12} />
      <Lily x={128} y={196} r={22} light />
      <Frog x={126} y={196} s={0.9} />
      <NearBank c={c} x={226} y={190} />
      <Frog x={268} y={194} s={1.4} big mouth="croak" />
      <Frog x={318} y={192} s={1.25} big mouth="croak" />
      <Croak x={286} y={170} s={0.8} />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 2 — Ếch Con tries a tiny song; the big frogs croak loudly and nobody notices
  (c: SceneCtx) => (
    <G>
      <DuskSky c={c} stars={22} seed={21} />
      <Delta c={c} y={104} waterY={134} seed={22} hutX={70} palmX={110} />
      <Lily x={110} y={198} r={34} light />
      <Frog x={108} y={198} s={1.6} mouth="sing" />
      <G opacity={0.55}>
        <SoftNotes x={132} y={150} color={c.p.glow} s={0.6} />
      </G>
      <NearBank c={c} x={200} y={176} />
      <Frog x={248} y={184} s={1.7} big mouth="croak" />
      <Frog x={310} y={182} s={1.8} big mouth="croak" />
      <Croak x={266} y={150} s={1.2} />
      <Croak x={292} y={148} s={1.2} flip />
      <Finish c={c} vignette={0.32} />
    </G>
  ),
  // 3 — a little duckling paddles alone along the dark canal; the house is far away
  (c: SceneCtx) => (
    <G>
      <NightSky c={c} stars={46} seed={31} />
      <Delta c={c} y={110} waterY={130} seed={32} hutX={312} palmX={286} water={['#24464C', '#12262C']} />
      <Lily x={60} y={190} r={16} />
      <Lily x={300} y={206} r={20} light />
      <Ripples x={150} y={182} s={1.4} />
      <Duckling x={172} y={182} s={1.5} />
      <Fireflies c={c} color={c.p.glow} count={6} seed={33} area={[40, 110, 280, 40]} />
      <Finish c={c} vignette={0.4} />
    </G>
  ),
  // 4 — the big frogs croak so loudly that the duckling tucks her head under her wing
  (c: SceneCtx) => (
    <G>
      <NightSky c={c} stars={36} seed={41} />
      <Delta c={c} y={104} waterY={128} seed={42} hutX={60} palmX={30} water={['#24464C', '#12262C']} />
      <Lily x={96} y={192} r={18} light />
      <Duckling x={96} y={190} s={1.5} mode="tucked" />
      <NearBank c={c} x={180} y={170} />
      <Frog x={226} y={178} s={1.5} big mouth="croak" />
      <Frog x={274} y={174} s={1.7} big mouth="croak" />
      <Frog x={324} y={178} s={1.5} big mouth="croak" />
      <Croak x={238} y={140} s={1.3} flip />
      <Croak x={262} y={132} s={1.5} flip />
      <Finish c={c} vignette={0.38} />
    </G>
  ),
  // 5 — Ếch Con hops close and sings softly; fireflies gather around them
  (c: SceneCtx) => (
    <G>
      <NightSky c={c} stars={50} seed={51} />
      <Delta c={c} y={100} waterY={122} seed={52} water={['#24464C', '#12262C']} />
      <Glow c={c} name="lullaby" cx={180} cy={176} r={90} color={c.p.glow} opacity={0.35} />
      <Lily x={146} y={196} r={30} light />
      <Lily x={216} y={200} r={26} />
      <Duckling x={212} y={198} s={1.6} mode="sleep" flip />
      <Frog x={146} y={196} s={1.3} mouth="sing" />
      <SoftNotes x={170} y={160} color={c.p.glow} s={0.9} />
      <Fireflies c={c} color={c.p.glow} count={14} seed={53} area={[110, 130, 150, 70]} />
      <Finish c={c} vignette={0.38} />
    </G>
  ),
  // 6 — pale dawn: Mother Duck swims up to her sleeping duckling; the frog watches
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#8FB2B4" mid="#C9D6C4" bottom="#F2DEC2" />
      <Glow c={c} name="dawn" cx={250} cy={108} r={110} color="#FBEACB" opacity={0.6} />
      <Sun cx={250} cy={110} r={14} color="#FBEED2" />
      <Delta c={c} y={110} waterY={134} seed={62} lit={false} hutX={70} palmX={110} water={['#9CC0BA', '#5E8A86']} />
      <Lily x={170} y={196} r={26} light />
      <Duckling x={168} y={194} s={1.3} mode="sleep" />
      <Ripples x={262} y={190} s={1.3} color="#E8F0E6" />
      <MotherDuck x={262} y={190} s={1.5} flip />
      <Lily x={90} y={206} r={22} />
      <Frog x={88} y={206} s={1.1} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 7 — a calm starry night; Ếch Con sings the last song, the big frogs listen sleepily
  (c: SceneCtx) => (
    <G>
      <NightSky c={c} stars={70} seed={71} />
      <Glow c={c} name="moon" cx={292} cy={44} r={50} color={MOON} opacity={0.4} />
      <MoonDisc cx={292} cy={44} r={16} color={MOON} shade="rgba(120,140,120,0.18)" />
      <Delta c={c} y={110} waterY={134} seed={72} hutX={60} palmX={100} water={['#24464C', '#12262C']} />
      <Glow c={c} name="song7" cx={160} cy={180} r={70} color={c.p.glow} opacity={0.3} />
      <Lily x={160} y={200} r={30} light />
      <Frog x={158} y={200} s={1.4} mouth="sing" />
      <SoftNotes x={184} y={162} color={c.p.glow} s={1} />
      <NearBank c={c} x={226} y={186} />
      <Frog x={268} y={192} s={1.4} big sleepy />
      <Frog x={318} y={190} s={1.3} big sleepy />
      <Fireflies c={c} color={c.p.glow} count={12} seed={73} area={[20, 120, 320, 60]} />
      <Finish c={c} vignette={0.38} />
    </G>
  ),
];

export const ECH_CON_HAT_RU: StoryScenes = { cover, pages };
