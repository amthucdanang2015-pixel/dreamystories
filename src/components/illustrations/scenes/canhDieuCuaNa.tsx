// Cánh Diều Của Bé Na — open, breezy, gently hopeful; a long grassy river
// dyke in the northern countryside. Signature: late-afternoon gold turning
// to a pink-and-lavender sunset, then the first evening star; a blue
// diamond kite with a ribbon tail and bamboo flute, swaying rice, a wide
// river, a bamboo grove and a water buffalo walking home.
// No power lines, no falls or injuries, no storms.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Bamboo,
  Cloud,
  Figure,
  Finish,
  Glow,
  Hut,
  Paddies,
  Pose,
  Ridge,
  SceneCtx,
  Sky,
  Stars,
  StoryScenes,
  Sun,
  Water,
  rng,
} from '../kit';

// ─── Colours ──────────────────────────────────────────────────

const HAIR = '#1E1712';
const DRESS = '#F4C430';
const DAD = { top: '#F7F4EE', bottom: '#5C6272', hairStyle: 'short' as const };
const KITE = '#3E7CB1';
const KITE_LIGHT = '#6FA6D6';
const KITE_DARK = '#2C5E8C';
const RIBBON = '#E2585E';
const BAMBOO_TAN = '#C9A86A';
const STRING = '#FFF4E0';
const PATH_DIRT = '#C9A878';
const FAR_BANK = '#7E8E5E';
const GROVE = '#4E6A3A';
const GROVE_LEAF = '#5E7E44';
const RICE = '#8DAA4E';
const RICE_DEEP = '#5E7A3A';
const GRAIN = '#D8C46A';
const BUFFALO = '#4A4248';
const BUFFALO_LIGHT = '#6A6066';
const HORN = '#D8CCB4';
const CLOUD_PINK = '#F4B3B8';
const CLOUD_LILAC = '#C9A8CC';

type Tone = 'gold' | 'sunset' | 'dusk';

// ─── Characters ───────────────────────────────────────────────

/** Na in her sunflower dress with two high pigtails; `flutter` blows them in the wind. */
function Na({ x, y, s = 0.66, pose = 'down', flip = false, sitting = false, flutter = false }: { x: number; y: number; s?: number; pose?: Pose; flip?: boolean; sitting?: boolean; flutter?: boolean }) {
  const hy = -57 + (sitting ? 12 : 0);
  return (
    <G>
      <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
        {flutter ? (
          <G>
            <Ellipse cx={-14} cy={hy + 1} rx={6} ry={2.6} fill={HAIR} transform={`rotate(-15 -14 ${hy + 1})`} />
            <Ellipse cx={-4} cy={hy - 6} rx={6} ry={2.6} fill={HAIR} transform={`rotate(-25 -4 ${hy - 6})`} />
          </G>
        ) : (
          <G>
            <Ellipse cx={-10} cy={hy - 3} rx={3} ry={4.2} fill={HAIR} transform={`rotate(-25 -10 ${hy - 3})`} />
            <Ellipse cx={10} cy={hy - 3} rx={3} ry={4.2} fill={HAIR} transform={`rotate(25 10 ${hy - 3})`} />
          </G>
        )}
      </G>
      <Figure x={x} y={y} s={s} top={DRESS} bottom={DRESS} hair={HAIR} dress pose={pose} flip={flip} sitting={sitting} />
    </G>
  );
}

function Dad({ x, y, s = 1, pose = 'down', flip = false, sitting = false }: { x: number; y: number; s?: number; pose?: Pose; flip?: boolean; sitting?: boolean }) {
  return <Figure x={x} y={y} s={s} {...DAD} pose={pose} flip={flip} sitting={sitting} />;
}

/** Blue diamond kite, nose up. (x, y) = centre. */
function Kite({ x, y, s = 1, rot = 0, color = KITE, light = KITE_LIGHT, tail = true, bend = 1 }: { x: number; y: number; s?: number; rot?: number; color?: string; light?: string; tail?: boolean; bend?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      {tail ? (
        <G>
          <Path d={`M0,16 Q${-9 * bend},27 ${4 * bend},37 Q${15 * bend},47 ${2 * bend},60`} stroke={RIBBON} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d={`M${-3 * bend},27 l-3,-2 l0,4 Z M${-3 * bend},27 l3,-2 l0,4 Z M${8 * bend},44 l-3,-2 l0,4 Z M${8 * bend},44 l3,-2 l0,4 Z`} fill={RIBBON} />
        </G>
      ) : null}
      <Path d="M0,-18 L12,0 L0,16 L-12,0 Z" fill={color} />
      <Path d="M0,-18 L12,0 L0,0 Z" fill={light} />
      <Path d="M0,0 L0,16 L-12,0 Z" fill={KITE_DARK} opacity={0.35} />
      <Path d="M0,-18 L0,16 M-12,0 L12,0" stroke={BAMBOO_TAN} strokeWidth={0.9} />
      <Rect x={-5} y={-23} width={10} height={3} rx={1.5} fill={BAMBOO_TAN} />
    </G>
  );
}

function KiteString({ x1, y1, x2, y2, sag = 12 }: { x1: number; y1: number; x2: number; y2: number; sag?: number }) {
  return <Path d={`M${x1},${y1} Q${(x1 + x2) / 2 + sag},${(y1 + y2) / 2 + sag} ${x2},${y2}`} stroke={STRING} strokeWidth={0.8} fill="none" opacity={0.9} />;
}

function Buffalo({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-20,-18 Q-27,-12 -24,-4" stroke={BUFFALO} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      {[-15, -7, 8, 15].map((lx, i) => (
        <Rect key={lx} x={lx - 2} y={-11} width={4} height={11} rx={1.5} fill={BUFFALO} transform={`rotate(${i % 2 ? 8 : -8} ${lx} -11)`} />
      ))}
      <Ellipse cx={0} cy={-17} rx={21} ry={10} fill={BUFFALO} />
      <Ellipse cx={22} cy={-15} rx={7} ry={6} fill={BUFFALO} />
      <Ellipse cx={26} cy={-12} rx={4} ry={3} fill={BUFFALO_LIGHT} />
      <Path d="M18,-19 Q11,-27 19,-29 M25,-19 Q32,-27 24,-30" stroke={HORN} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Circle cx={23} cy={-17} r={1} fill="#1A1416" />
    </G>
  );
}

function RiceStalks({ c, y, seed = 3, sway = 3, count = 26 }: { c: SceneCtx; y: number; seed?: number; sway?: number; count?: number }) {
  const r = rng(seed);
  return (
    <G>
      {Array.from({ length: count }, (_, i) => {
        const x = r() * c.W;
        const yy = y + r() * (c.H - y) * 0.85;
        const h = 14 + r() * 10;
        const tx = x + sway * (0.6 + r() * 0.8);
        return (
          <G key={i}>
            <Path d={`M${x},${yy} Q${x + sway * 0.3},${yy - h * 0.6} ${tx},${yy - h}`} stroke={RICE_DEEP} strokeWidth={1.3} fill="none" strokeLinecap="round" />
            <Path d={`M${x},${yy} Q${x - 4},${yy - h * 0.4} ${x - 6 + sway * 0.5},${yy - h * 0.6}`} stroke={RICE_DEEP} strokeWidth={1} fill="none" strokeLinecap="round" />
            <Ellipse cx={tx + 2} cy={yy - h + 3} rx={1.6} ry={3.4} fill={GRAIN} transform={`rotate(30 ${tx + 2} ${yy - h + 3})`} />
          </G>
        );
      })}
    </G>
  );
}

/** Soft curling breath of wind. */
function Wind({ x, y, s = 1, opacity = 0.6 }: { x: number; y: number; s?: number; opacity?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`} opacity={opacity}>
      <Path d="M0,0 Q20,-6 40,0 Q50,4 46,10 Q42,14 38,9" stroke="#FFFFFF" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Path d="M10,14 Q26,10 40,16" stroke="#FFFFFF" strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </G>
  );
}

/** River, dyke and rice fields. `y` = river horizon; the dyke path is at about y + 34. */
function Dyke({ c, y, tone = 'gold', seed = 1, sway = 3 }: { c: SceneCtx; y: number; tone?: Tone; seed?: number; sway?: number }) {
  const sky =
    tone === 'dusk'
      ? { top: '#5E5488', mid: '#A588B0', bottom: '#E6B4B4' }
      : tone === 'sunset'
        ? { top: c.p.sky, mid: '#F0B08A', bottom: c.p.skyLow }
        : { top: '#F2B07E', mid: '#F8C890', bottom: '#FBE2AE' };
  const river = tone === 'dusk' ? ['#9A8AB4', '#6A6090'] : tone === 'sunset' ? ['#F2B48A', '#B07A84'] : ['#F2CE8A', '#9AA486'];
  const sunY = tone === 'sunset' ? y - 12 : y - 52;
  return (
    <G>
      <Sky c={c} top={sky.top} mid={sky.mid} bottom={sky.bottom} />
      {tone !== 'dusk' ? <Glow c={c} name="sun" cx={c.W * 0.78} cy={sunY} r={90} color={c.p.glow} opacity={0.8} /> : null}
      {tone !== 'dusk' ? <Sun cx={c.W * 0.78} cy={sunY} r={15} color="#FFF0C8" /> : null}
      <Ridge c={c} y={y - 2} amp={5} seed={seed} color={tone === 'dusk' ? '#5A5A6E' : FAR_BANK} />
      <Bamboo x={44} y={y + 2} h={58} color={GROVE} leaf={GROVE_LEAF} stalks={4} seed={seed + 3} />
      <Water c={c} y={y} top={river[0]} bottom={river[1]} shimmer={c.p.glow} name="river" seed={seed + 1} />
      <Path d={`M-10,${y + 32} Q${c.W * 0.5},${y + 22} ${c.W + 10},${y + 30} L${c.W + 10},${c.H + 2} L-10,${c.H + 2} Z`} fill={c.p.ground} />
      <Path d={`M-10,${y + 32} Q${c.W * 0.5},${y + 22} ${c.W + 10},${y + 30} L${c.W + 10},${y + 38} Q${c.W * 0.5},${y + 30} -10,${y + 40} Z`} fill={PATH_DIRT} />
      <Paddies c={c} y={y + 62} color={RICE} line={RICE_DEEP} rows={4} />
      <RiceStalks c={c} y={y + 66} seed={seed + 2} sway={sway} />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Dyke c={c} y={226} tone="sunset" seed={5} sway={4} />
    <Cloud x={92} y={96} s={1.3} color={CLOUD_PINK} opacity={0.9} />
    <Cloud x={290} y={150} s={1.1} color={CLOUD_PINK} opacity={0.85} />
    <Cloud x={160} y={170} s={0.8} color={CLOUD_LILAC} opacity={0.7} />
    <Glow c={c} name="kite" cx={232} cy={104} r={50} color={c.p.glow} opacity={0.5} />
    <KiteString x1={162} y1={216} x2={228} y2={122} sag={14} />
    <Kite x={232} y={104} s={1.6} rot={-12} bend={1.2} />
    <Dad x={112} y={262} s={1.15} pose="wave" />
    <Na x={152} y={262} s={0.8} pose="up" flutter />
    <Finish c={c} vignette={0.26} />
  </G>
);

const pages = [
  // 1 — a long green dyke on a summer evening; children with kites; Na holds her new blue kite beside Dad
  (c: SceneCtx) => (
    <G>
      <Dyke c={c} y={118} seed={11} />
      <Kite x={264} y={46} s={0.5} rot={10} color="#E2585E" light="#F08A8A" />
      <Kite x={312} y={70} s={0.42} rot={-8} color="#5EA05A" light="#86C27E" />
      <Figure x={286} y={152} s={0.42} top="#E07A5A" pose="up" />
      <Figure x={316} y={150} s={0.4} top="#F2E6C8" bottom="#4E5A6A" pose="up" flip />
      <Dad x={128} y={156} s={1} />
      <Na x={164} y={157} s={0.66} pose="hold" />
      <Kite x={178} y={122} s={0.8} rot={-6} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 2 — Na runs along the dyke with the string; the kite wobbles and tumbles into the grass
  (c: SceneCtx) => (
    <G>
      <Dyke c={c} y={116} seed={21} />
      <Path d="M92,140 q-8,-2 -14,2 M96,148 q-10,0 -16,4" stroke="#FFFFFF" strokeWidth={1.4} fill="none" opacity={0.6} strokeLinecap="round" />
      <Na x={128} y={155} s={0.66} pose="out" flutter />
      <KiteString x1={141} y1={133} x2={234} y2={150} sag={-6} />
      <Path d="M224,118 q8,-8 16,0 M246,126 q6,-6 12,0" stroke="#FFFFFF" strokeWidth={1.2} fill="none" opacity={0.7} strokeLinecap="round" />
      <Kite x={240} y={148} s={0.8} rot={70} bend={-0.8} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 3 — Na sits on the dyke with her chin in her hands; the blue kite lies in the grass
  (c: SceneCtx) => (
    <G>
      <Dyke c={c} y={116} seed={31} sway={1} />
      <Na x={166} y={156} s={0.7} pose="hold" sitting />
      <Kite x={222} y={170} s={0.8} rot={100} bend={0.4} />
      <Finish c={c} vignette={0.26} />
    </G>
  ),
  // 4 — Dad sits beside Na, pointing to the sky; both are listening to the wind
  (c: SceneCtx) => (
    <G>
      <Dyke c={c} y={118} seed={41} sway={4} />
      <Wind x={210} y={50} s={1.2} />
      <Wind x={110} y={74} s={0.8} opacity={0.45} />
      <Dad x={146} y={158} s={0.95} pose="wave" sitting />
      <Na x={190} y={158} s={0.68} pose="hold" sitting flip />
      <Kite x={238} y={172} s={0.75} rot={96} bend={0.4} />
      <Finish c={c} vignette={0.26} />
    </G>
  ),
  // 5 — a water buffalo walks home along the dyke; the river turns gold; rice sways; Na's pigtails flutter
  (c: SceneCtx) => (
    <G>
      <Dyke c={c} y={118} seed={51} sway={6} />
      <Glow c={c} name="river" cx={240} cy={130} r={90} color={c.p.glow} opacity={0.55} />
      <Buffalo x={254} y={153} s={1.15} flip />
      <Wind x={60} y={60} s={1} opacity={0.5} />
      <Na x={128} y={157} s={0.68} flutter />
      <Kite x={146} y={142} s={0.6} rot={20} tail={false} />
      <Finish c={c} vignette={0.26} />
    </G>
  ),
  // 6 — the blue kite soars high among pink clouds; Na lets out the string; Dad cheers
  (c: SceneCtx) => (
    <G>
      <Dyke c={c} y={168} tone="sunset" seed={61} sway={5} />
      <Cloud x={120} y={60} s={1.1} color={CLOUD_PINK} opacity={0.9} />
      <Cloud x={300} y={96} s={0.9} color={CLOUD_PINK} opacity={0.85} />
      <Cloud x={200} y={120} s={0.6} color={CLOUD_LILAC} opacity={0.7} />
      <Glow c={c} name="high" cx={240} cy={56} r={40} color={c.p.glow} opacity={0.5} />
      <KiteString x1={158} y1={168} x2={238} y2={72} sag={16} />
      <Kite x={240} y={56} s={1.1} rot={-14} bend={1.2} />
      <Dad x={112} y={204} s={0.9} pose="up" />
      <Na x={150} y={204} s={0.62} pose="up" flutter />
      <Finish c={c} vignette={0.26} />
    </G>
  ),
  // 7 — lavender dusk and the first star; Dad and Na wind up the string and walk home along the dyke
  (c: SceneCtx) => (
    <G>
      <Dyke c={c} y={118} tone="dusk" seed={71} sway={1} />
      <Stars c={c} count={10} seed={72} color="#FFF6E8" maxY={80} opacity={0.5} />
      <Glow c={c} name="star" cx={262} cy={40} r={22} color={c.p.glow} opacity={0.8} />
      <Path d="M262,32 Q262,40 270,40 Q262,40 262,48 Q262,40 254,40 Q262,40 262,32 Z" fill="#FFF6E0" />
      <Hut x={66} y={118} s={0.42} wall="#CDB8A0" roof="#6E5A5A" door="#3A2E36" lit="#FFD98A" />
      <Dad x={178} y={156} s={1} pose="hold" flip />
      <Kite x={166} y={130} s={0.55} rot={-20} tail={false} />
      <Na x={208} y={157} s={0.66} pose="hold" flip />
      <Circle cx={200} cy={139} r={3} fill={BAMBOO_TAN} />
      <Finish c={c} vignette={0.32} />
    </G>
  ),
];

export const CANH_DIEU_CUA_NA: StoryScenes = { cover, pages };
