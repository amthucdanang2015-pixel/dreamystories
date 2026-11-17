// Nàng Tiên Ốc — a hushed, dewy dawn lullaby beside a turquoise lotus pond.
// Signature: blush-pink and gold mist over turquoise water, round lotus pads
// and pink blooms, a little snail whose spiral shell shimmers jade, turquoise
// and pearl, a glazed clay water jar, and shell-spiral curls drifting through
// mist and ripples. The fairy only ever appears in a soft, warm glow and the
// shell is always whole — at the end it is tucked safely into a basket.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Figure,
  Finish,
  Glow,
  Hut,
  Lotus,
  Mist,
  Ridge,
  SceneCtx,
  Sky,
  StoryScenes,
  Sun,
  Water,
  rng,
} from '../kit';

// ─── Characters & colours ─────────────────────────────────────

const GRANNY = {
  top: '#8A5E3E',
  bottom: '#5E4434',
  hair: '#D9D4CC',
  hairStyle: 'bun' as const,
  hat: 'nonla' as const,
  hatColor: '#EAD9A6',
  skin: '#DDB08A',
};
const FAIRY = {
  top: '#4FB9B0',
  bottom: '#DDF1EC',
  hair: '#1E2A30',
  hairStyle: 'long' as const,
  dress: true,
  skin: '#F0CDAE',
};
const JADE = '#4FAF92';
const JADE_DEEP = '#2F8A78';
const TURQ = '#6FD0C8';
const PEARL = '#F4FBF6';
const LOTUS_PINK = '#F2A7BA';
const PAD = '#5E9F6A';
const PAD_LIGHT = '#86BF7E';
const CLAY = '#A65E3A';
const CLAY_GLAZE = '#7A3F2A';
const WOOD = '#B48A5E';
const WOOD_DARK = '#7E5A3C';
const WICKER = '#C9A46A';
const MIST = '#FFF4EC';

// ─── Local helpers ────────────────────────────────────────────

/** Archimedean spiral path, inside → out. */
function spiralPath(cx: number, cy: number, r: number, turns = 2.4, rot = 0) {
  const steps = Math.round(turns * 18);
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = rot + t * turns * Math.PI * 2;
    const rr = r * t;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(2)},${(cy + Math.sin(a) * rr).toFixed(2)} `;
  }
  return d;
}

/** Shell-spiral curl drawn in mist or ripples. */
function Curl({ x, y, r = 10, color = MIST, opacity = 0.6, w = 1.6 }: { x: number; y: number; r?: number; color?: string; opacity?: number; w?: number }) {
  return <Path d={spiralPath(x, y, r, 1.6, Math.PI)} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" opacity={opacity} />;
}

/** The spiral jade-and-pearl shell on its own (always whole). (x, y) = base centre. */
function Shell({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={0.5} rx={10} ry={2} fill="#000000" opacity={0.12} />
      <Circle cx={0} cy={-9} r={9.5} fill={JADE} />
      <Path d="M-9.5,-9 A9.5,9.5 0 0 1 9.5,-9 Q0,-4 -9.5,-9 Z" fill={TURQ} opacity={0.65} />
      <Path d={spiralPath(1, -9.5, 8.4, 2.3, 0.4)} stroke={PEARL} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <Circle cx={-4} cy={-14} r={2.2} fill={PEARL} opacity={0.8} />
      <Circle cx={4.5} cy={-4} r={1.2} fill={JADE_DEEP} opacity={0.5} />
    </G>
  );
}

/** The little snail: shell on a pale soft body with two tiny eye-stalks. Faces right. */
function Snail({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-12,0 Q-12,-4 -4,-4 L10,-4 Q15,-5 16,-12 Q19,-12 19,-6 Q19,0 12,0 Z" fill="#EADFC8" />
      <Path d="M15,-11 L14,-18 M18,-10 L19,-17" stroke="#EADFC8" strokeWidth={1.4} strokeLinecap="round" />
      <Circle cx={14} cy={-18.5} r={1.2} fill="#3A3A3A" />
      <Circle cx={19} cy={-17.5} r={1.2} fill="#3A3A3A" />
      <Shell x={-1} y={-2} s={0.95} />
    </G>
  );
}

/** A round lotus pad with its little notch. */
function Pad({ x, y, rx = 18, color = PAD, flip = false }: { x: number; y: number; rx?: number; color?: string; flip?: boolean }) {
  const ry = rx * 0.32;
  const d = flip ? -1 : 1;
  return (
    <G>
      <Path
        d={`M${x},${y} L${x + d * rx * 0.9},${y - ry * 0.4} A${rx},${ry} 0 1 ${flip ? 0 : 1} ${x + d * rx * 0.9},${y + ry * 0.4} Z`}
        fill={color}
      />
      <Path d={`M${x},${y} L${x - d * rx * 0.6},${y - ry * 0.3} M${x},${y} L${x - d * rx * 0.5},${y + ry * 0.5}`} stroke={PAD_LIGHT} strokeWidth={0.8} opacity={0.7} />
    </G>
  );
}

/** Glazed clay water jar (chum). (x, y) = base centre. */
function Jar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={1} rx={26} ry={4} fill="#000000" opacity={0.15} />
      <Path d="M-16,0 Q-30,-14 -26,-32 Q-22,-46 -15,-50 L15,-50 Q22,-46 26,-32 Q30,-14 16,0 Z" fill={CLAY} />
      <Path d="M-26,-30 Q0,-24 26,-30 Q30,-14 16,0 L-16,0 Q-30,-14 -26,-30 Z" fill={CLAY_GLAZE} opacity={0.55} />
      <Path d="M-20,-36 Q-18,-44 -12,-46" stroke="#E8B48A" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.6} />
      <Rect x={-18} y={-54} width={36} height={6} rx={3} fill={CLAY_GLAZE} />
      <Ellipse cx={0} cy={-53} rx={15} ry={2.6} fill={TURQ} />
      <Path d="M-24,-22 Q0,-17 24,-22" stroke="#E8B48A" strokeWidth={1} fill="none" opacity={0.4} />
    </G>
  );
}

function Basket({ x, y, s = 1, lid = false }: { x: number; y: number; s?: number; lid?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-13,-16 L13,-16 L10,0 L-10,0 Z" fill={WICKER} />
      {[-11, -6, -1].map((yy) => (
        <Path key={yy} d={`M-12,${yy} L12,${yy}`} stroke="#9E7C46" strokeWidth={1} opacity={0.6} />
      ))}
      <Path d="M-11,-16 Q0,-30 11,-16" stroke="#9E7C46" strokeWidth={1.8} fill="none" />
      {lid ? <Ellipse cx={0} cy={-16} rx={14} ry={3} fill="#B8935A" /> : null}
    </G>
  );
}

/** A shell-spiral hairpin + flowing pearl sash added over the kit Figure. */
function Fairy({ x, y, s = 1, flip = false, pose = 'down', sitting = false }: { x: number; y: number; s?: number; flip?: boolean; pose?: 'down' | 'up' | 'out' | 'hold' | 'wave'; sitting?: boolean }) {
  const lift = sitting ? 12 : 0;
  return (
    <G>
      <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
        <Path d={`M-8,${-36 + lift} Q-22,${-26 + lift} -16,${-6 + lift} Q-26,${-14 + lift} -24,${-30 + lift} Z`} fill={PEARL} opacity={0.85} />
      </G>
      <Figure x={x} y={y} s={s} flip={flip} pose={pose} sitting={sitting} {...FAIRY} />
      <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
        <Path d={`M-8,${-30 + lift} Q0,${-26 + lift} 8,${-30 + lift}`} stroke={PEARL} strokeWidth={2} fill="none" />
        <Circle cx={-6} cy={-58 + lift} r={3} fill={PEARL} />
        <Path d={spiralPath(-6, -58 + lift, 2.6, 1.8)} stroke={JADE} strokeWidth={0.9} fill="none" />
      </G>
    </G>
  );
}

function Granny(props: { x: number; y: number; s?: number; flip?: boolean; pose?: 'down' | 'up' | 'out' | 'hold' | 'wave'; sitting?: boolean }) {
  return <Figure {...GRANNY} {...props} />;
}

/** Interior backdrop: plank wall, earthen floor and a window onto the pond. */
function Interior({ c, winX = 250, light = c.p.glow }: { c: SceneCtx; winX?: number; light?: string }) {
  return (
    <G>
      <Rect x={0} y={0} width={c.W} height={c.H} fill="#E9CFAE" />
      {Array.from({ length: 10 }, (_, i) => (
        <Rect key={i} x={i * 38} y={0} width={1.4} height={180} fill={WOOD_DARK} opacity={0.18} />
      ))}
      <Rect x={0} y={0} width={c.W} height={16} fill={WOOD_DARK} opacity={0.55} />
      <Rect x={winX - 34} y={42} width={68} height={56} fill={TURQ} />
      <Rect x={winX - 34} y={42} width={68} height={26} fill="#F8D9C6" />
      <Ellipse cx={winX - 10} cy={84} rx={12} ry={3} fill={PAD} />
      <Lotus x={winX + 14} y={86} s={0.5} color={LOTUS_PINK} leaf={PAD} />
      {[-17, 0, 17].map((dx) => (
        <Rect key={dx} x={winX + dx - 1.2} y={42} width={2.4} height={56} fill={WOOD} />
      ))}
      <Rect x={winX - 38} y={38} width={76} height={5} fill={WOOD_DARK} />
      <Rect x={winX - 38} y={97} width={76} height={5} fill={WOOD_DARK} />
      <Glow c={c} name="window" cx={winX} cy={70} r={70} color={light} opacity={0.5} />
      <Rect x={0} y={180} width={c.W} height={64} fill="#C99E74" />
      <Rect x={0} y={180} width={c.W} height={3} fill={WOOD_DARK} opacity={0.4} />
    </G>
  );
}

/** Dawn pond backdrop: pink-gold sky, far bank, turquoise water from y. */
function Pond({ c, y, seed = 1, sun = true }: { c: SceneCtx; y: number; seed?: number; sun?: boolean }) {
  return (
    <G>
      <Sky c={c} top={c.p.sky} mid="#FBDCC4" bottom={c.p.skyLow} />
      <Glow c={c} name="dawn" cx={c.W * 0.5} cy={y - 10} r={c.W * 0.5} color={c.p.glow} opacity={0.8} />
      {sun ? <Sun cx={c.W * 0.5 + 60} cy={y - 18} r={14} color="#FFE2B0" /> : null}
      <Ridge c={c} y={y - 6} amp={14} seed={seed + 2} color="#B9C9B4" opacity={0.75} />
      <Ridge c={c} y={y} amp={6} seed={seed + 5} color="#7FAF92" />
      <Water c={c} y={y} top={TURQ} bottom={c.p.groundDeep} shimmer={MIST} name="pond" seed={seed} />
      <Mist c={c} y={y + 2} color={MIST} opacity={0.55} height={20} />
    </G>
  );
}

/** Scattered pads, blooms and buds across the pond. */
function LotusField({ c, y, seed = 3, n = 7 }: { c: SceneCtx; y: number; seed?: number; n?: number }) {
  const r = rng(seed);
  return (
    <G>
      {Array.from({ length: n }, (_, i) => {
        const px = r() * c.W;
        const py = y + r() * (c.H - y) * 0.85;
        const k = 0.6 + ((py - y) / (c.H - y)) * 0.8;
        return (
          <G key={i}>
            <Pad x={px} y={py} rx={16 * k} color={i % 2 ? PAD : PAD_LIGHT} flip={i % 3 === 0} />
            {r() > 0.45 ? <Lotus x={px + 6 * k} y={py - 1} s={0.7 * k} color={LOTUS_PINK} leaf={PAD} bloom={r() > 0.3} /> : null}
          </G>
        );
      })}
    </G>
  );
}

function Steam({ x, y }: { x: number; y: number }) {
  return (
    <G>
      {[-6, 0, 6].map((dx) => (
        <Path key={dx} d={`M${x + dx},${y} q-4,-6 0,-12 q4,-6 0,-12`} stroke="#FFFFFF" strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.75} />
      ))}
    </G>
  );
}

/** Low tray with rice bowls and a soup pot. (x, y) = base centre. */
function MealTray({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={-4} rx={30} ry={7} fill={WOOD_DARK} />
      <Rect x={-26} y={-4} width={4} height={6} fill={WOOD_DARK} />
      <Rect x={22} y={-4} width={4} height={6} fill={WOOD_DARK} />
      <Path d="M-20,-8 Q-14,-1 -8,-8 Z" fill="#F4F0E4" />
      <Ellipse cx={-14} cy={-8.5} rx={6} ry={2.4} fill="#FFFFFF" />
      <Path d="M8,-8 Q14,-1 20,-8 Z" fill="#F4F0E4" />
      <Ellipse cx={14} cy={-8.5} rx={6} ry={2.4} fill="#FFFFFF" />
      <Path d="M-6,-8 L-6,-16 Q0,-19 6,-16 L6,-8 Z" fill={CLAY} />
      <Path d="M-2,-11 L18,-20" stroke={WOOD_DARK} strokeWidth={1} />
    </G>
  );
}

function Broom({ x, y, s = 1, tilt = -20 }: { x: number; y: number; s?: number; tilt?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${tilt}) scale(${s})`}>
      <Rect x={-1} y={-40} width={2} height={30} fill={WOOD} />
      <Path d="M-2,-12 L2,-12 L8,0 L-8,0 Z" fill="#D8BE78" />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Pond c={c} y={196} seed={11} sun={false} />
    {/* the fairy as a faint silhouette in the dawn mist */}
    <Glow c={c} name="fairy" cx={180} cy={126} r={110} color={c.p.glow} opacity={0.95} />
    <G opacity={0.32}>
      <Fairy x={180} y={170} s={1.5} pose="out" />
    </G>
    <Curl x={92} y={150} r={14} />
    <Curl x={276} y={140} r={12} />
    <Curl x={228} y={92} r={9} opacity={0.4} />
    <LotusField c={c} y={210} seed={5} n={8} />
    {/* hero pad and snail */}
    <Pad x={182} y={292} rx={62} color={PAD} />
    <Ellipse cx={182} cy={290} rx={44} ry={10} fill={PAD_LIGHT} opacity={0.35} />
    <Glow c={c} name="shine" cx={178} cy={262} r={46} color={PEARL} opacity={0.7} />
    <Snail x={176} y={286} s={2} />
    <Lotus x={102} y={300} s={1.6} color={LOTUS_PINK} leaf={PAD} />
    <Lotus x={274} y={286} s={1.3} color={c.p.accent} leaf={PAD_LIGHT} />
    <Lotus x={300} y={330} s={0.9} color={LOTUS_PINK} leaf={PAD} bloom={false} />
    <Curl x={240} y={322} r={10} color={PEARL} opacity={0.5} />
    <Finish c={c} vignette={0.2} />
  </G>
);

const pages = [
  // 1 — the old woman wades in the misty pond at dawn and lifts a tiny shimmering snail
  (c: SceneCtx) => (
    <G>
      <Pond c={c} y={140} seed={3} />
      <Curl x={64} y={110} r={12} />
      <Curl x={300} y={104} r={10} />
      <LotusField c={c} y={150} seed={7} n={6} />
      <Granny x={170} y={214} s={1.15} pose="up" />
      <Basket x={150} y={190} s={0.8} />
      {/* water covering her legs */}
      <Rect x={130} y={194} width={84} height={50} fill={c.p.groundDeep} opacity={0.75} />
      <Ellipse cx={172} cy={194} rx={30} ry={3} stroke={MIST} strokeWidth={1.2} fill="none" opacity={0.7} />
      <Ellipse cx={172} cy={196} rx={42} ry={5} stroke={MIST} strokeWidth={0.8} fill="none" opacity={0.4} />
      <Glow c={c} name="snail" cx={186} cy={146} r={22} color={PEARL} opacity={0.9} />
      <Snail x={186} y={150} s={0.55} />
      <Lotus x={240} y={210} s={1.1} color={LOTUS_PINK} leaf={PAD} />
      <Lotus x={98} y={222} s={0.9} color={c.p.accent} leaf={PAD_LIGHT} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 2 — inside the cottage she lowers the snail into the big glazed water jar, smiling
  (c: SceneCtx) => (
    <G>
      <Interior c={c} winX={92} />
      <Jar x={204} y={196} s={0.95} />
      <Granny x={250} y={200} s={1.1} pose="out" flip />
      <Glow c={c} name="snail" cx={224} cy={146} r={18} color={PEARL} opacity={0.8} />
      <Snail x={224} y={150} s={0.45} flip />
      <Path d="M262,128 q6,-4 12,0 M266,120 q5,-3 10,0" stroke={WOOD_DARK} strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.5} />
      <Curl x={198} y={128} r={6} color={TURQ} opacity={0.7} w={1.2} />
      <Basket x={128} y={200} s={0.9} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 3 — she comes home to a swept yard, a watered garden and a warm meal; hands up in surprise
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#F9DFC8" bottom={c.p.skyLow} />
      <Glow c={c} name="soft" cx={250} cy={60} r={120} color={c.p.glow} opacity={0.6} />
      <Ridge c={c} y={150} amp={10} seed={21} color="#A9C7A6" />
      <Water c={c} y={156} top={TURQ} bottom={c.p.ground} shimmer={MIST} name="pond" seed={4} />
      <Rect x={0} y={170} width={c.W} height={74} fill="#D9BE8E" />
      <Hut x={140} y={176} s={1.3} wall="#EBD6B0" roof="#B89058" door={WOOD_DARK} lit={c.p.glow} />
      <Jar x={74} y={182} s={0.62} />
      {/* watered garden beds */}
      {[0, 1, 2].map((i) => (
        <G key={i}>
          <Rect x={226} y={180 + i * 14} width={100} height={8} rx={4} fill="#7A5A3C" opacity={0.6} />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <Ellipse key={k} cx={232 + k * 17} cy={179 + i * 14} rx={5} ry={3} fill={k % 2 ? PAD_LIGHT : PAD} />
          ))}
          <Circle cx={240 + i * 28} cy={172 + i * 10} r={1.4} fill={TURQ} />
        </G>
      ))}
      {/* sweep marks */}
      {[0, 1, 2].map((i) => (
        <Path key={i} d={`M${40 + i * 12},${226 - i} q16,-6 32,0`} stroke="#F2E2BC" strokeWidth={1.6} fill="none" opacity={0.8} />
      ))}
      <MealTray x={140} y={188} s={0.8} />
      <Steam x={140} y={170} />
      <Granny x={196} y={226} s={1.1} pose="up" flip />
      <Basket x={214} y={228} s={0.7} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 4 — peeking from behind the door, she sees the fairy rise in a soft glow from the shell
  (c: SceneCtx) => (
    <G>
      <Interior c={c} winX={296} />
      <Jar x={232} y={194} s={1.1} />
      <Glow c={c} name="rise" cx={172} cy={140} r={90} color={c.p.glow} opacity={1} />
      <Glow c={c} name="pearl" cx={172} cy={186} r={34} color={PEARL} opacity={0.9} />
      <Fairy x={172} y={188} s={1.15} pose="out" />
      <Shell x={190} y={196} s={0.7} />
      <Curl x={140} y={120} r={9} color={PEARL} opacity={0.7} />
      <Curl x={206} y={100} r={7} color={PEARL} opacity={0.6} />
      {[[130, 160], [214, 142], [158, 92]].map(([sx, sy], i) => (
        <Circle key={i} cx={sx} cy={sy} r={1.6} fill={PEARL} opacity={0.8} />
      ))}
      {/* the old woman peeking behind the door */}
      <Granny x={70} y={200} s={1.1} pose="hold" />
      <Rect x={36} y={60} width={34} height={142} fill={WOOD} />
      <Rect x={36} y={60} width={34} height={142} fill={WOOD_DARK} opacity={0.15} />
      {[90, 130, 170].map((yy) => (
        <Rect key={yy} x={36} y={yy} width={34} height={2} fill={WOOD_DARK} opacity={0.4} />
      ))}
      <Rect x={28} y={54} width={8} height={150} fill={WOOD_DARK} />
      <Finish c={c} vignette={0.26} />
    </G>
  ),
  // 5 — the fairy sweeps and hums; the old woman tucks the empty shell safely into a basket
  (c: SceneCtx) => (
    <G>
      <Interior c={c} winX={180} />
      <Glow c={c} name="hum" cx={110} cy={150} r={70} color={c.p.glow} opacity={0.7} />
      <Fairy x={110} y={206} s={1.1} pose="hold" />
      <Broom x={122} y={208} tilt={-24} />
      {[0, 1].map((i) => (
        <Path key={i} d={`M${86 - i * 14},${218} q10,-4 20,0`} stroke="#E6C89A" strokeWidth={1.4} fill="none" />
      ))}
      {/* humming notes as little spirals */}
      <Curl x={130} y={112} r={5} color={JADE_DEEP} opacity={0.6} w={1.2} />
      <Curl x={146} y={98} r={4} color={JADE_DEEP} opacity={0.45} w={1.1} />
      <Jar x={300} y={198} s={0.95} />
      <Granny x={252} y={208} s={1.08} pose="hold" flip />
      <Basket x={232} y={210} s={1.05} />
      <Shell x={232} y={194} s={0.6} />
      <Glow c={c} name="shell" cx={232} cy={188} r={14} color={PEARL} opacity={0.7} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 6 — a warm embrace in the doorway, morning light pouring in, the pond glimmering behind
  (c: SceneCtx) => (
    <G>
      <Rect x={0} y={0} width={c.W} height={c.H} fill="#D9B892" />
      {/* the view through the doorway */}
      <G>
        <Rect x={110} y={34} width={140} height={150} fill={c.p.sky} />
        <Glow c={c} name="morning" cx={180} cy={120} r={90} color={c.p.glow} opacity={1} />
        <Rect x={110} y={124} width={140} height={60} fill={TURQ} />
        <Rect x={110} y={124} width={140} height={4} fill="#7FAF92" />
        <Pad x={136} y={150} rx={14} />
        <Lotus x={142} y={150} s={0.6} color={LOTUS_PINK} leaf={PAD} />
        <Pad x={226} y={164} rx={16} color={PAD_LIGHT} flip />
        <Lotus x={220} y={164} s={0.7} color={c.p.accent} leaf={PAD} />
        <Rect x={130} y={140} width={20} height={1.4} fill={MIST} opacity={0.8} />
        <Rect x={196} y={134} width={26} height={1.4} fill={MIST} opacity={0.8} />
      </G>
      <Rect x={100} y={28} width={10} height={160} fill={WOOD_DARK} />
      <Rect x={250} y={28} width={10} height={160} fill={WOOD_DARK} />
      <Rect x={96} y={24} width={168} height={10} fill={WOOD_DARK} />
      {/* light pouring across the floor */}
      <Path d="M110,184 L250,184 L320,244 L40,244 Z" fill={c.p.glow} opacity={0.45} />
      <Rect x={0} y={184} width={110} height={60} fill="#B88E66" />
      <Rect x={250} y={184} width={110} height={60} fill="#B88E66" />
      <Granny x={166} y={200} s={1.15} pose="out" />
      <Fairy x={194} y={200} s={1.2} pose="out" flip />
      <Path d="M180,104 c-3,-4 -9,-1 -6,4 l6,6 l6,-6 c3,-5 -3,-8 -6,-4 Z" fill={c.p.accent} opacity={0.8} />
      <Jar x={58} y={200} s={0.8} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 7 — mother and daughter pick lotus from a little boat at pink-gold evening, cottage behind
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#F2C1C2" mid="#F8D6B4" bottom="#FFE6B8" />
      <Glow c={c} name="evening" cx={110} cy={120} r={150} color={c.p.glow} opacity={0.75} />
      <Sun cx={96} cy={112} r={16} color="#FFD7A0" />
      <Ridge c={c} y={124} amp={10} seed={41} color="#C9B8A8" opacity={0.7} />
      <Ridge c={c} y={132} amp={6} seed={44} color="#86A88C" />
      <Hut x={284} y={136} s={0.8} wall="#EBD6B0" roof="#B89058" door={WOOD_DARK} lit="#FFE0A0" />
      <Water c={c} y={134} top="#7FCFC6" bottom={c.p.groundDeep} shimmer="#FFE6C8" name="pond" seed={9} />
      <Rect x={60} y={138} width={70} height={2} fill="#FFE2B0" opacity={0.6} />
      <LotusField c={c} y={146} seed={13} n={9} />
      {/* the boat */}
      <Granny x={160} y={206} s={1} pose="hold" sitting />
      <Fairy x={212} y={206} s={1} pose="out" flip />
      <Path d="M118,196 Q120,212 150,214 L212,214 Q240,212 246,196 Z" fill={WOOD_DARK} />
      <Path d="M122,198 L242,198" stroke={WOOD} strokeWidth={2} />
      <Lotus x={186} y={196} s={0.8} color={LOTUS_PINK} leaf={PAD} />
      <Ellipse cx={182} cy={218} rx={74} ry={4} stroke="#FFE6C8" strokeWidth={1} fill="none" opacity={0.6} />
      <Lotus x={258} y={186} s={1.1} color={c.p.accent} leaf={PAD} />
      <Lotus x={92} y={204} s={1} color={LOTUS_PINK} leaf={PAD_LIGHT} />
      <Curl x={290} y={222} r={8} color="#FFE6C8" opacity={0.5} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
];

export const NANG_TIEN_OC: StoryScenes = { cover, pages };
