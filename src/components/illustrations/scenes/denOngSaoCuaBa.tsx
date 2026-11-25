// Chiếc Đèn Ông Sao Của Bà — warm, glowing, gentle. Signature: an old
// riverside town in central Vietnam (yellow-walled shophouses, tiled roofs),
// a golden-afternoon courtyard, then a full-moon night lit by red and gold
// lanterns, flower lanterns drifting on the river, and Mai's red star lantern
// with its one crooked point. Candles only ever glow inside lanterns.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { Figure, Finish, Glow, Lantern, MoonDisc, SceneCtx, Sky, Stars, StoryScenes, Water } from '../kit';

// ─── Colours ──────────────────────────────────────────────────

const WALL = '#E2B65A';
const WALL_NIGHT = '#7A5A3A';
const ROOF = '#9A4A32';
const ROOF_NIGHT = '#4A2420';
const DOOR = '#5A3424';
const WOOD = '#8A5A3A';
const BAMBOO = '#D9B878';
const RED = '#D9483B';
const RED_LIT = '#F06A4A';
const CAKE = '#C98A44';
const CAKE_DARK = '#9A6232';
const MOON = '#FBEBC4';
const RIVER = ['#3A2440', '#1E1220'];

const MAI = { top: '#E86A55', bottom: '#2E2228', hairStyle: 'bob' as const };
const BA = { top: '#7A3A5E', bottom: '#5A2846', hair: '#B9B2AE', hairStyle: 'bun' as const, dress: true };
const BOY = { top: '#A9C8E2', bottom: '#3A4A5E', hairStyle: 'short' as const };

// ─── Characters & props ───────────────────────────────────────

/** Grandma: a Figure in a plum áo dài, plus round glasses and a jade bracelet. */
function Grandma({ x, y, s = 1, pose = 'down', flip = false }: { x: number; y: number; s?: number; pose?: 'down' | 'hold' | 'out'; flip?: boolean }) {
  const hand = pose === 'out' ? [20, -34] : pose === 'hold' ? [10, -28] : [11, -20];
  return (
    <G>
      <Figure x={x} y={y} s={s} {...BA} pose={pose} flip={flip} />
      <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
        <Circle cx={3} cy={-51} r={2} stroke="#E8DCC0" strokeWidth={0.6} fill="none" />
        <Circle cx={-2} cy={-51} r={2} stroke="#E8DCC0" strokeWidth={0.6} fill="none" />
        <Path d="M0,-51.2 L1,-51.2" stroke="#E8DCC0" strokeWidth={0.6} />
        <Circle cx={hand[0]} cy={hand[1] + 2.4} r={2.2} stroke="#5FAE8A" strokeWidth={1.2} fill="none" />
      </G>
    </G>
  );
}

/** Five-pointed star lantern; point 2 (upper right) is crooked. (x, y) = centre. */
function StarLantern({ x, y, s = 1, mode = 'lit', stick }: { x: number; y: number; s?: number; mode?: 'lit' | 'unlit' | 'frame'; stick?: [number, number] }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    let a = -Math.PI / 2 + (i * Math.PI) / 5;
    let r = i % 2 ? 4.4 : 10;
    if (i === 2) {
      a += 0.32;
      r = 8.6;
    }
    return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
  }).join(' L');
  const d = `M${pts} Z`;
  return (
    <G>
      {stick ? <Path d={`M${stick[0]},${stick[1]} L${x},${y + 4 * s}`} stroke={BAMBOO} strokeWidth={1.6} strokeLinecap="round" /> : null}
      <G transform={`translate(${x},${y}) scale(${s})`}>
        {mode === 'lit' ? <Circle cx={0} cy={0} r={18} fill="#FFD58A" opacity={0.22} /> : null}
        {mode !== 'frame' ? <Path d={d} fill={mode === 'lit' ? RED_LIT : RED} /> : null}
        {mode === 'lit' ? <Circle cx={0} cy={0.6} r={3.4} fill="#FFE3A0" opacity={0.85} /> : null}
        <Path d={d} stroke={BAMBOO} strokeWidth={0.7} fill="none" strokeLinejoin="round" />
        {mode !== 'frame' ? (
          <Path d="M-8,-2.6 L-12,4 M8,-2.6 L12,4" stroke="#F3C26A" strokeWidth={0.6} opacity={0.7} />
        ) : null}
      </G>
    </G>
  );
}

function Mooncakes({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={2} rx={22} ry={5} fill="#B8A07A" />
      {[-10, 2, 13].map((cx, i) => (
        <G key={i}>
          <Ellipse cx={cx} cy={-2 - (i === 1 ? 3 : 0)} rx={7} ry={4.4} fill={CAKE} />
          <Ellipse cx={cx} cy={-3 - (i === 1 ? 3 : 0)} rx={4} ry={2.2} stroke={CAKE_DARK} strokeWidth={0.8} fill="none" />
        </G>
      ))}
    </G>
  );
}

/** Paper flower lantern floating on the river. */
function FlowerLantern({ x, y, s = 1, color = '#F2A0A0' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Circle cx={0} cy={-3} r={10} fill="#FFD58A" opacity={0.2} />
      <Ellipse cx={0} cy={4} rx={9} ry={2} fill="#FFD58A" opacity={0.25} />
      <Path d="M0,0 C-8,-2 -9,-8 -6,-10 C-3,-6 -1,-3 0,0 Z M0,0 C8,-2 9,-8 6,-10 C3,-6 1,-3 0,0 Z" fill={color} />
      <Path d="M0,0 C-3,-5 -2,-10 0,-12 C2,-10 3,-5 0,0 Z" fill="#FBE3C8" />
      <Circle cx={0} cy={-4} r={1.2} fill="#FFE9A8" />
    </G>
  );
}

/** Yellow-walled shophouse with tiled roof. (x, y) = ground centre. */
function Shophouse({ x, y, s = 1, night = false, lit, lantern }: { x: number; y: number; s?: number; night?: boolean; lit?: string; lantern?: boolean }) {
  const wall = night ? WALL_NIGHT : WALL;
  const roof = night ? ROOF_NIGHT : ROOF;
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-34} y={-52} width={68} height={52} fill={wall} />
      <Path d="M-42,-50 L-30,-68 L30,-68 L42,-50 Z" fill={roof} />
      <Path d="M-38,-55 L38,-55 M-34,-61 L34,-61" stroke="#2A1410" strokeWidth={1} opacity={0.3} />
      <Rect x={-36} y={-70} width={72} height={3} rx={1.5} fill={roof} />
      <Rect x={-24} y={-36} width={18} height={36} fill={lit ?? DOOR} />
      <Rect x={6} y={-36} width={18} height={36} fill={lit ?? DOOR} opacity={lit ? 0.85 : 1} />
      <Rect x={-15.5} y={-36} width={1} height={36} fill={DOOR} opacity={0.6} />
      <Rect x={14.5} y={-36} width={1} height={36} fill={DOOR} opacity={0.6} />
      {lantern ? <Lantern x={0} y={-44} s={0.7} color={RED} glow="#FFD58A" /> : null}
    </G>
  );
}

function Table({ x, y, w = 120 }: { x: number; y: number; w?: number }) {
  return (
    <G>
      <Rect x={x - w / 2} y={y} width={w} height={6} rx={2} fill={WOOD} />
      <Rect x={x - w / 2 + 6} y={y + 6} width={5} height={40} fill="#6A4028" />
      <Rect x={x + w / 2 - 11} y={y + 6} width={5} height={40} fill="#6A4028" />
    </G>
  );
}

function NightSky({ c, moon = [276, 54, 26] as [number, number, number], seed = 1 }: { c: SceneCtx; moon?: [number, number, number]; seed?: number }) {
  return (
    <G>
      <Sky c={c} top={c.p.ink} mid={c.p.sky} bottom={c.p.skyLow} />
      <Stars c={c} count={30} seed={seed} color="#FBE8C8" opacity={0.6} />
      <Glow c={c} name="moonHalo" cx={moon[0]} cy={moon[1]} r={moon[2] * 3} color={MOON} opacity={0.4} />
      <MoonDisc cx={moon[0]} cy={moon[1]} r={moon[2]} color={MOON} shade="rgba(190,140,90,0.18)" />
    </G>
  );
}

/** A row of shophouses on the far bank and the river below with reflections. */
function Riverside({ c, y, riverY, seed = 3 }: { c: SceneCtx; y: number; riverY: number; seed?: number }) {
  return (
    <G>
      {[30, 100, 170, 240, 310].map((hx, i) => (
        <Shophouse key={hx} x={hx} y={y} s={0.62 + (i % 2) * 0.06} night lit={i % 2 ? '#E8A85A' : undefined} lantern={i !== 2} />
      ))}
      <Rect x={0} y={y} width={c.W} height={riverY - y} fill={c.p.groundDeep} />
      <Water c={c} y={riverY} top={RIVER[0]} bottom={RIVER[1]} shimmer="#E8A85A" name={`river${seed}`} seed={seed} />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <NightSky c={c} moon={[272, 70, 34]} seed={4} />
    <Riverside c={c} y={196} riverY={206} seed={5} />
    {[[60, 236], [130, 262], [214, 246], [292, 270], [330, 232]].map(([fx, fy], i) => (
      <FlowerLantern key={i} x={fx} y={fy} s={1.1} color={i % 2 ? '#F2C46A' : '#F2A0A0'} />
    ))}
    <Rect x={0} y={292} width={c.W} height={70} fill={c.p.ground} />
    <Rect x={0} y={292} width={c.W} height={3} fill="#7A5038" />
    <Glow c={c} name="star" cx={162} cy={240} r={90} color={c.p.glow} opacity={0.5} />
    <Grandma x={214} y={340} s={1.35} flip />
    <Figure x={150} y={342} s={1.05} {...MAI} pose="hold" />
    <StarLantern x={164} y={238} s={2.6} stick={[160, 313]} />
    <Finish c={c} vignette={0.4} />
  </G>
);

const pages = [
  // 1 — golden afternoon courtyard; Mai runs to Grandma, mooncakes on a tray
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#F2C27A" bottom="#F8E2B8" />
      <Glow c={c} name="sun" cx={300} cy={30} r={140} color="#FFE6A8" opacity={0.6} />
      <Shophouse x={110} y={176} s={1.6} lantern />
      <Shophouse x={300} y={170} s={1.3} />
      <Rect x={0} y={176} width={c.W} height={70} fill="#B87A52" />
      {[30, 90, 150, 210, 270, 330].map((bx) => (
        <Path key={bx} d={`M${bx},176 L${bx - 30},240`} stroke="#9A6242" strokeWidth={1} opacity={0.6} />
      ))}
      <Table x={230} y={176} w={100} />
      <Mooncakes x={232} y={174} />
      <Grandma x={272} y={214} s={1.05} flip pose="hold" />
      <Figure x={150} y={220} s={0.78} {...MAI} pose="out" />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 2 — at the wooden table: bamboo sticks, red cellophane, rice glue, tying a star frame
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#EDB872" bottom="#F6DCAE" />
      <Rect x={0} y={0} width={c.W} height={150} fill={WALL} opacity={0.75} />
      <Rect x={30} y={30} width={60} height={70} fill={DOOR} opacity={0.5} />
      <Glow c={c} name="light" cx={180} cy={150} r={130} color="#FFE6A8" opacity={0.5} />
      <Grandma x={230} y={200} s={1.3} pose="hold" flip />
      <Figure x={128} y={204} s={1} {...MAI} pose="hold" />
      <Rect x={0} y={170} width={c.W} height={74} fill={WOOD} />
      <Rect x={0} y={170} width={c.W} height={4} fill="#A87048" />
      {[0, 1, 2, 3].map((i) => (
        <Path key={i} d={`M${40 + i * 4},${196 + i * 3} L${110 + i * 4},${186 + i * 3}`} stroke={BAMBOO} strokeWidth={1.6} strokeLinecap="round" />
      ))}
      <Rect x={250} y={186} width={46} height={30} fill={RED} opacity={0.75} transform="rotate(-8 273 201)" />
      <Ellipse cx={312} cy={210} rx={14} ry={5} fill="#E8E0D0" />
      <Ellipse cx={312} cy={208} rx={10} ry={3} fill="#F6F2E8" />
      <StarLantern x={180} y={186} s={2.6} mode="frame" />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 3 — the finished red star with its crooked point; Mai pouts, Grandma smiles kindly
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#E8AE6A" bottom="#F4D6A6" />
      <Rect x={0} y={0} width={c.W} height={c.H} fill={WALL} opacity={0.5} />
      <Glow c={c} name="star3" cx={180} cy={104} r={110} color="#FFE6A8" opacity={0.55} />
      <StarLantern x={180} y={104} s={6.4} mode="unlit" />
      <Figure x={70} y={244} s={1.5} {...MAI} pose="hold" />
      <Path d="M68.2,174.6 Q69.7,173 71.2,174.6" stroke="#2A1A10" strokeWidth={0.9} fill="none" strokeLinecap="round" />
      <Grandma x={292} y={248} s={1.75} flip />
      <Path d="M290.5,166.5 Q292.5,169 294.5,166.5" stroke="#2A1A10" strokeWidth={1} fill="none" strokeLinecap="round" />
      <Rect x={0} y={222} width={c.W} height={20} fill={WOOD} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 4 — full-moon night in the courtyard; Grandma lights a small candle inside the star
  (c: SceneCtx) => (
    <G>
      <NightSky c={c} moon={[290, 44, 22]} seed={41} />
      <Shophouse x={70} y={176} s={1.5} night lit="#E8A85A" lantern />
      <Rect x={0} y={176} width={c.W} height={70} fill={c.p.ground} />
      <Glow c={c} name="candle" cx={190} cy={150} r={100} color={c.p.glow} opacity={0.55} />
      <Glow c={c} name="redGlow" cx={190} cy={150} r={60} color={RED_LIT} opacity={0.35} />
      <Table x={190} y={176} w={110} />
      <Mooncakes x={240} y={174} s={0.8} />
      <StarLantern x={182} y={158} s={1.9} />
      <Grandma x={222} y={214} s={1.05} pose="hold" flip />
      <Figure x={142} y={218} s={0.8} {...MAI} pose="down" />
      <Finish c={c} vignette={0.38} />
    </G>
  ),
  // 5 — children with lanterns along the river, a little drum, flower lanterns afloat, full moon
  (c: SceneCtx) => (
    <G>
      <NightSky c={c} moon={[180, 40, 22]} seed={51} />
      <Riverside c={c} y={112} riverY={120} seed={52} />
      {[[50, 150], [120, 170], [210, 150], [290, 166], [330, 140]].map(([fx, fy], i) => (
        <FlowerLantern key={i} x={fx} y={fy} s={0.9} color={i % 2 ? '#F2C46A' : '#F2A0A0'} />
      ))}
      <Rect x={0} y={186} width={c.W} height={60} fill={c.p.ground} />
      {/* drummer */}
      <Figure x={84} y={226} s={0.66} top="#5E8C7A" bottom="#2E2228" hairStyle="topknot" pose="hold" />
      <Ellipse cx={90} cy={208} rx={8} ry={6} fill={RED} />
      <Ellipse cx={90} cy={203} rx={8} ry={2.4} fill="#F2DEB8" />
      <StarLantern x={168} y={160} s={1.4} stick={[162, 204]} />
      <Figure x={156} y={226} s={0.7} {...MAI} pose="hold" />
      <Path d="M226,204 L232,176" stroke={BAMBOO} strokeWidth={1.4} />
      <Lantern x={232} y={172} s={0.9} color="#E7A14A" glow={c.p.glow} kind="round" />
      <Figure x={220} y={226} s={0.66} top="#8D6F9E" bottom="#2E2228" hairStyle="braid" pose="hold" />
      <Path d="M290,204 L296,176" stroke={BAMBOO} strokeWidth={1.4} />
      <Lantern x={298} y={172} s={0.9} color="#E46A4A" glow={c.p.glow} kind="carp" />
      <Figure x={284} y={226} s={0.62} top="#E2C26A" bottom="#2E2228" hairStyle="short" pose="hold" />
      <Finish c={c} vignette={0.36} />
    </G>
  ),
  // 6 — Mai holds out her star so the little boy can relight his carp lantern
  (c: SceneCtx) => (
    <G>
      <NightSky c={c} moon={[300, 40, 20]} seed={61} />
      <Riverside c={c} y={110} riverY={118} seed={62} />
      <FlowerLantern x={60} y={150} />
      <FlowerLantern x={300} y={162} color="#F2C46A" />
      <Rect x={0} y={180} width={c.W} height={66} fill={c.p.ground} />
      <Glow c={c} name="share" cx={184} cy={150} r={80} color={c.p.glow} opacity={0.5} />
      <Figure x={130} y={226} s={0.9} {...MAI} pose="out" />
      <StarLantern x={172} y={150} s={1.6} stick={[148, 195]} />
      <Lantern x={200} y={160} s={1.2} color="#E46A4A" glow={c.p.glow} kind="carp" />
      <Path d="M217,201 L206,166" stroke={BAMBOO} strokeWidth={1.4} />
      <Figure x={232} y={226} s={0.72} {...BOY} pose="out" flip />
      <Finish c={c} vignette={0.36} />
    </G>
  ),
  // 7 — walking home hand in hand along the moonlit river; the lit window of home ahead
  (c: SceneCtx) => (
    <G>
      <NightSky c={c} moon={[90, 46, 24]} seed={71} />
      <Water c={c} y={130} top={RIVER[0]} bottom={RIVER[1]} shimmer={MOON} name="river7" seed={72} />
      <Ellipse cx={90} cy={150} rx={20} ry={3} fill={MOON} opacity={0.35} />
      <FlowerLantern x={60} y={168} s={0.8} />
      <FlowerLantern x={150} y={158} s={0.7} color="#F2C46A" />
      <Shophouse x={318} y={196} s={1.3} night lit={c.p.glow} lantern />
      <Glow c={c} name="home" cx={318} cy={176} r={60} color={c.p.glow} opacity={0.4} />
      <Path d="M-10,196 Q180,184 370,196 L370,250 L-10,250 Z" fill={c.p.ground} />
      <Grandma x={210} y={222} s={1.1} />
      <Figure x={180} y={224} s={0.74} {...MAI} pose="out" />
      <Path d="M190.4,199 Q196,201 199,200" stroke={BA.top} strokeWidth={2} strokeLinecap="round" fill="none" />
      <StarLantern x={160} y={176} s={1.3} stick={[165, 199]} />
      <Finish c={c} vignette={0.38} />
    </G>
  ),
];

export const DEN_ONG_SAO_CUA_BA: StoryScenes = { cover, pages };
