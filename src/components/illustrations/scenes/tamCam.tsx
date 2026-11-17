// Tấm Cám — honey-gold Red River delta afternoon: lotus pond, stone well,
// areca palms and a bamboo fence. Signature: the little brown-gold goby
// fish, a flock of brown sparrows, Bụt's soft halo, and Tấm's faded brown
// áo tứ thân turning pale blue as the story turns.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Bird,
  Figure,
  Finish,
  Glow,
  Grass,
  Hut,
  Lotus,
  Palm,
  Paddies,
  Pavilion,
  Ridge,
  SceneCtx,
  Sky,
  StoryScenes,
  Sun,
  Water,
} from '../kit';

const TAM = { top: '#9A7650', bottom: '#735738', hairStyle: 'braid' as const, dress: true };
const TAM_BLUE = { top: '#A9CBE6', bottom: '#7FA8CC', hairStyle: 'braid' as const, dress: true };
const CAM = { top: '#EF8DB0', bottom: '#CF6690', hairStyle: 'bob' as const, dress: true };
const STEP = { top: '#5E3F66', bottom: '#442D4C', hairStyle: 'bun' as const, dress: true };
const KING = { top: '#E8B83E', bottom: '#CC9A2A', hairStyle: 'short' as const, hat: 'crown' as const, hatColor: '#C88A22', dress: true };
const PALM_TRUNK = '#8A6E4A';
const PALM_LEAF = '#6E8E42';
const LOTUS_PINK = '#EE9AAE';
const LOTUS_LEAF = '#5E8A48';
const STONE = '#B7AE9C';

/** The little goby (bống): round brown-gold fish with big friendly eyes. (x, y) = centre. */
function Goby({ x, y, s = 1, flip = false, rot = 0 }: { x: number; y: number; s?: number; flip?: boolean; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-10,0 L-21,-8 Q-17,0 -21,8 Z" fill="#A86E2E" />
      <Ellipse cx={0} cy={0} rx={13} ry={10} fill="#C98F3E" />
      <Ellipse cx={1} cy={4} rx={9} ry={5} fill="#EDC97C" />
      <Path d="M-5,-9 Q0,-17 6,-9 Z" fill="#A86E2E" />
      <Path d="M-1,3 q-4,5 -8,2 q3,-4 8,-2 Z" fill="#A86E2E" />
      <Circle cx={-6} cy={-3} r={1.2} fill="#8E5A24" />
      <Circle cx={-2} cy={-6} r={1} fill="#8E5A24" />
      <Circle cx={6} cy={-3} r={4.8} fill="#FFFFFF" />
      <Circle cx={7} cy={-3} r={2.9} fill="#2A1A10" />
      <Circle cx={8} cy={-4.3} r={1} fill="#FFFFFF" />
      <Path d="M11,3 q2,1.5 0,3" stroke="#7A4A20" strokeWidth={1} fill="none" strokeLinecap="round" />
    </G>
  );
}

/** Round stone village well seen slightly from above. (x, y) = ground centre. */
function Well({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={2} rx={36} ry={6} fill="#4A3622" opacity={0.18} />
      <Path d="M-30,-34 L-30,-4 Q0,8 30,-4 L30,-34 Z" fill={STONE} />
      {[-26, -17, -9].map((sy, row) =>
        [-24, -12, 0, 12, 24].map((sx) => (
          <Rect key={`${row}-${sx}`} x={sx - 5 + (row % 2 ? 6 : 0)} y={sy} width={10} height={6} rx={2.5} fill="#9C9381" opacity={0.55} />
        ))
      )}
      <Ellipse cx={0} cy={-34} rx={31} ry={9} fill="#D3CAB6" />
      <Ellipse cx={0} cy={-34} rx={24} ry={6} fill="#2E4A40" />
      <Ellipse cx={-4} cy={-33} rx={12} ry={2.2} fill="#5E8A72" opacity={0.7} />
      <Path d="M-30,-10 q-3,-4 -1,-8 M29,-12 q3,-4 1,-8" stroke="#7E9A4E" strokeWidth={2} fill="none" strokeLinecap="round" />
    </G>
  );
}

/** Little brown sparrow. (x, y) = feet. */
function Sparrow({ x, y, s = 1, flip = false, fly = false }: { x: number; y: number; s?: number; flip?: boolean; fly?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-8,-6 L-15,-10 L-14,-4 Z" fill="#6E4A2C" />
      <Ellipse cx={-1} cy={-6} rx={8} ry={5.5} fill="#9A6A40" />
      <Ellipse cx={0} cy={-4} rx={5} ry={3} fill="#EBD8B4" />
      {fly ? (
        <Path d="M-4,-9 Q-9,-24 5,-21 Q2,-14 3,-8 Z" fill="#6E4A2C" />
      ) : (
        <Path d="M-7,-8 Q-1,-12 4,-7 Q-1,-5 -7,-8 Z" fill="#6E4A2C" />
      )}
      <Circle cx={6} cy={-11} r={4} fill="#9A6A40" />
      <Path d="M3.5,-14 Q7,-16 9.5,-13 Q6,-13 3.5,-14 Z" fill="#5A3A22" />
      <Circle cx={5.4} cy={-9} r={1.3} fill="#F2E3C8" />
      <Path d="M9.6,-11.6 L12.8,-10.4 L9.6,-9.4 Z" fill="#D9A040" />
      <Circle cx={7.3} cy={-11.6} r={0.9} fill="#1A1410" />
      {!fly ? <Path d="M-2,-1 L-2,0.5 M1.5,-1 L1.5,0.5" stroke="#5A3A22" strokeWidth={0.9} /> : null}
    </G>
  );
}

/** Embroidered slipper (hài thêu) with a curled toe. (x, y) = centre. */
function Slipper({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Path d="M-12,3 L11,3 Q14,1 13,-1 L-12,-1 Z" fill="#8A2A3A" />
      <Path d="M-12,1 Q-13,-7 -6,-7 Q2,-7 6,-4 Q11,-1 13,0 L13,1 Z" fill="#D9475C" />
      <Path d="M12,0 Q17,-3 13,-7" stroke="#E9B44C" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Ellipse cx={-7} cy={-6} rx={4.2} ry={1.4} fill="#7A2030" />
      <Circle cx={1} cy={-3} r={1.6} fill="#E9B44C" />
      {[0, 72, 144, 216, 288].map((a) => (
        <Circle key={a} cx={1 + Math.cos((a * Math.PI) / 180) * 2.6} cy={-3 + Math.sin((a * Math.PI) / 180) * 2.6} r={0.9} fill="#F6D58A" />
      ))}
      <Circle cx={-4} cy={-2} r={0.8} fill="#F6D58A" />
      <Circle cx={7} cy={-1.5} r={0.8} fill="#F6D58A" />
    </G>
  );
}

/** Bamboo fence: posts with two rails. (x, y) = left end of ground line. */
function Fence({ x, y, w, h = 28 }: { x: number; y: number; w: number; h?: number }) {
  const n = Math.floor(w / 9);
  return (
    <G>
      {Array.from({ length: n }, (_, i) => (
        <Rect key={i} x={x + i * 9} y={y - h + (i % 3) * 1.5} width={4.4} height={h - (i % 3) * 1.5} rx={2.2} fill={i % 2 ? '#C29A5C' : '#B08A4E'} />
      ))}
      <Rect x={x - 2} y={y - h * 0.74} width={w + 2} height={3} rx={1.5} fill="#8A6A3A" />
      <Rect x={x - 2} y={y - h * 0.36} width={w + 2} height={3} rx={1.5} fill="#8A6A3A" />
    </G>
  );
}

/** Woven fishing basket (giỏ). (x, y) = base centre. */
function Basket({ x, y, s = 1, full = false }: { x: number; y: number; s?: number; full?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {full ? (
        <G>
          <Path d="M-8,-18 Q-10,-30 -4,-34 Q-2,-26 -3,-18 Z" fill="#BFC0B0" />
          <Path d="M-4,-34 L-8,-38 L-1,-37 Z" fill="#9EA092" />
          <Path d="M3,-18 Q6,-30 1,-35 Q-1,-26 -1,-18 Z" fill="#C98F3E" />
          <Path d="M7,-18 Q12,-28 9,-32 Q5,-26 4,-18 Z" fill="#BFC0B0" />
        </G>
      ) : null}
      <Path d="M-12,-20 Q-17,-8 -10,0 L10,0 Q17,-8 12,-20 Z" fill="#C49A5A" />
      {[-15, -10, -5].map((yy) => (
        <Path key={yy} d={`M-14,${yy} Q0,${yy + 3} 14,${yy}`} stroke="#9A7440" strokeWidth={1.2} fill="none" opacity={0.7} />
      ))}
      {full ? <Rect x={-13} y={-21.5} width={26} height={3} rx={1.5} fill="#8A6A3A" /> : <Ellipse cx={0} cy={-20} rx={12} ry={3.5} fill="#6A4E2A" />}
    </G>
  );
}

/** Paper pinwheel on a stick. (x, y) = hub. */
function Pinwheel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const cols = ['#F07FA6', '#F4C65A', '#8FC4E0', '#9CCB7A'];
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M0,0 L-2,24" stroke="#8A6A3A" strokeWidth={1.6} strokeLinecap="round" />
      {cols.map((col, i) => (
        <Path key={i} d="M0,0 L0,-10 L8,-7 Z" fill={col} transform={`rotate(${i * 90 + 15})`} />
      ))}
      <Circle cx={0} cy={0} r={1.6} fill="#FFFFFF" />
    </G>
  );
}

/** Grey royal elephant with a red saddle cloth. (x, y) = feet centre, faces right. */
function Elephant({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-28,-34 q-6,6 -4,14" stroke="#8C8C96" strokeWidth={2} fill="none" strokeLinecap="round" />
      {[-22, -10, 8, 19].map((lx) => (
        <Rect key={lx} x={lx} y={-20} width={8} height={20} rx={3} fill={lx > 0 ? '#8C8C96' : '#9C9CA6'} />
      ))}
      <Ellipse cx={0} cy={-30} rx={29} ry={20} fill="#9C9CA6" />
      <Circle cx={27} cy={-38} r={14} fill="#9C9CA6" />
      <Path d="M37,-34 Q46,-20 42,-5 Q39,-1 36,-5 Q38,-18 31,-28 Z" fill="#9C9CA6" />
      <Ellipse cx={19} cy={-35} rx={9} ry={12} fill="#86868F" />
      <Path d="M34,-26 Q40,-21 43,-26" stroke="#F6EEDC" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <Circle cx={31} cy={-42} r={1.3} fill="#2A1A10" />
      <Path d="M-16,-49 L14,-49 L17,-28 L-17,-28 Z" fill="#C8463E" />
      <Rect x={-17} y={-30} width={34} height={3} fill="#E9B44C" />
      {[-12, -4, 4, 12].map((tx) => (
        <Circle key={tx} cx={tx} cy={-24} r={1.4} fill="#E9B44C" />
      ))}
    </G>
  );
}

/** Bụt: white beard and robe, wooden staff, soft halo. (x, y) = feet. */
function But({ c, name, x, y, s = 1, flip = false }: { c: SceneCtx; name: string; x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G>
      <Glow c={c} name={name} cx={x} cy={y - 34 * s} r={62 * s} color={c.p.glow} opacity={0.95} />
      <Circle cx={x} cy={y - 50 * s} r={14 * s} fill={c.p.glow} opacity={0.55} />
      <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
        <Path d="M13,0 L13,-60" stroke="#8A6340" strokeWidth={2.6} strokeLinecap="round" />
        <Path d="M13,-60 q4,-4 0,-7 q-4,1 -2,4" stroke="#8A6340" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      </G>
      <Figure x={x} y={y} s={s} flip={flip} top="#FBF7EE" bottom="#EFE7D6" hair="#F2EFE8" hairStyle="short" dress skin="#EFC9A2" />
      <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
        <Path d="M-5,-47 Q-1,-24 2,-26 Q6,-30 7,-47 Q1,-43 -5,-47 Z" fill="#FFFFFF" />
        <Path d="M-1,-53.6 l4,-0.6 M4,-53.6 l3,0.4" stroke="#FFFFFF" strokeWidth={1.4} strokeLinecap="round" />
      </G>
    </G>
  );
}

/** Small 4-point sparkle. */
function Sparkle({ x, y, r = 4, color }: { x: number; y: number; r?: number; color: string }) {
  return (
    <Path
      d={`M${x},${y - r} Q${x},${y} ${x + r},${y} Q${x},${y} ${x},${y + r} Q${x},${y} ${x - r},${y} Q${x},${y} ${x},${y - r} Z`}
      fill={color}
    />
  );
}

/** Rice bowl with a little white mound. (x, y) = base centre. */
function Bowl({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={-7} rx={7} ry={4} fill="#FBF4E2" />
      <Path d="M-8,-6 Q-7,0 0,0 Q7,0 8,-6 Z" fill="#5E8AA8" />
      <Path d="M-6,-3.5 Q0,-1.5 6,-3.5" stroke="#FFFFFF" strokeWidth={0.8} fill="none" opacity={0.6} />
    </G>
  );
}

const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top={c.p.sky} mid="#F7DFA0" bottom={c.p.skyLow} />
    <Glow c={c} name="sun" cx={262} cy={110} r={170} color={c.p.glow} opacity={0.8} />
    <Sun cx={262} cy={110} r={22} color="#FFF4D6" />
    <Ridge c={c} y={214} amp={18} seed={4} color="#C4CF8E" />
    <Paddies c={c} y={226} color="#AFC277" line="#8DAA5B" rows={3} />
    <Palm x={36} y={250} s={1.35} trunk={PALM_TRUNK} leaf={PALM_LEAF} />
    <Palm x={66} y={244} s={1.1} trunk={PALM_TRUNK} leaf={PALM_LEAF} lean={4} />
    <Palm x={326} y={252} s={1.4} trunk={PALM_TRUNK} leaf={PALM_LEAF} lean={-6} />
    <Ridge c={c} y={246} amp={8} seed={9} color={c.p.ground} />
    <But c={c} name="but" x={104} y={252} s={0.95} />
    <Fence x={190} y={258} w={180} h={32} />
    {[218, 244, 268, 300].map((sx, i) => (
      <Sparrow key={sx} x={sx} y={258 - 32 * 0.74 - 1} s={1.05} flip={i % 2 === 1} />
    ))}
    <Rect x={0} y={256} width={c.W} height={110} fill={c.p.ground} />
    <Path d="M-10,330 Q60,302 150,326 Q120,372 -10,372 Z" fill="#7FA8A0" />
    <Path d="M10,334 Q60,316 120,330" stroke="#CFE2D8" strokeWidth={1.6} fill="none" opacity={0.6} />
    <Lotus x={34} y={338} s={1.1} color={LOTUS_PINK} leaf={LOTUS_LEAF} />
    <Lotus x={92} y={344} s={0.9} color={LOTUS_PINK} leaf={LOTUS_LEAF} bloom={false} />
    <Well x={228} y={318} s={1.4} />
    <Goby x={218} y={264} s={0.95} rot={-24} />
    <Circle cx={240} cy={262} r={2.4} fill="#CFE6DC" />
    <Circle cx={246} cy={256} r={1.6} fill="#CFE6DC" />
    <Sparrow x={262} y={271} s={0.9} flip />
    <Figure x={142} y={322} s={1.38} {...TAM} pose="hold" sitting />
    <Bowl x={156} y={302} s={1.3} />
    <Grass c={c} y={300} seed={12} color={c.p.groundDeep} count={12} />
    <Finish c={c} vignette={0.26} />
  </G>
);

const pages = [
  // 1 — Tấm sweeps the brick courtyard; Cám plays with a pinwheel in the shade
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={196} cy={40} r={110} color={c.p.glow} opacity={0.6} />
      <Ridge c={c} y={160} amp={10} seed={2} color="#B9C784" />
      <Palm x={226} y={170} s={0.95} trunk={PALM_TRUNK} leaf={PALM_LEAF} />
      <Palm x={250} y={168} s={0.8} trunk={PALM_TRUNK} leaf={PALM_LEAF} lean={5} />
      <Fence x={120} y={172} w={250} h={22} />
      <Hut x={66} y={172} s={1.55} wall="#E3C79A" roof="#A27A48" door="#6A4E30" />
      <Rect x={0} y={170} width={c.W} height={74} fill="#D9A878" />
      {[184, 200, 218].map((yy) => (
        <Path key={yy} d={`M0,${yy} L${c.W},${yy}`} stroke="#BE8C5E" strokeWidth={1} opacity={0.7} />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <Path key={i} d={`M${i * 28 + (i % 2) * 8},170 L${i * 28 - 10 + (i % 2) * 8},240`} stroke="#BE8C5E" strokeWidth={1} opacity={0.5} />
      ))}
      {/* the shade tree Cám sits under */}
      <Ellipse cx={292} cy={212} rx={46} ry={8} fill="#8A6A3A" opacity={0.28} />
      <Path d="M300,212 Q296,170 304,120" stroke="#6E5236" strokeWidth={8} strokeLinecap="round" fill="none" />
      <Circle cx={280} cy={104} r={30} fill={c.p.groundDeep} />
      <Circle cx={320} cy={96} r={30} fill={c.p.groundDeep} />
      <Circle cx={300} cy={80} r={28} fill={c.p.ground} />
      <Circle cx={266} cy={92} r={14} fill={c.p.ground} />
      <Figure x={276} y={214} s={0.9} {...CAM} pose="hold" sitting />
      <Pinwheel x={290} y={182} s={1.1} />
      {/* Tấm with broom, water buckets set down beside her */}
      <Figure x={150} y={214} s={1.02} {...TAM} pose="hold" />
      <Path d="M160,186 L128,214" stroke="#8A6A3A" strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M128,214 L116,212 L122,222 L134,220 Z" fill="#C9A45E" />
      <Path d="M112,222 q-6,-2 -10,2 M104,216 q-5,-3 -9,0" stroke="#B9895A" strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.7} />
      <Path d="M184,186 L230,196" stroke="#8A6A3A" strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M182,202 L198,202 L196,218 L184,218 Z" fill="#8A6E4A" />
      <Path d="M212,206 L228,206 L226,222 L214,222 Z" fill="#8A6E4A" />
      <Ellipse cx={190} cy={202} rx={8} ry={2} fill="#9FC8D0" />
      <Ellipse cx={220} cy={206} rx={8} ry={2} fill="#9FC8D0" />
      <Bird x={190} y={58} s={0.8} color="#8A6A3A" />
      <Bird x={208} y={66} s={0.6} color="#8A6A3A" wing="down" />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 2 — at the lotus pond: Tấm's basket is full, Cám points far away to trick her
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={70} cy={60} r={90} color={c.p.glow} opacity={0.6} />
      <Paddies c={c} y={118} color="#B8C47E" line="#8DAA5B" rows={3} />
      <Palm x={300} y={130} s={0.7} trunk={PALM_TRUNK} leaf={PALM_LEAF} />
      <Palm x={318} y={132} s={0.6} trunk={PALM_TRUNK} leaf={PALM_LEAF} lean={-3} />
      <Hut x={46} y={130} s={0.6} wall="#E3C79A" roof="#A27A48" door="#6A4E30" />
      <Water c={c} y={132} top="#9FC2B0" bottom="#6E9A8A" shimmer="#E6F0DC" name="pond" />
      <Lotus x={60} y={160} s={1} color={LOTUS_PINK} leaf={LOTUS_LEAF} />
      <Lotus x={270} y={156} s={0.9} color={LOTUS_PINK} leaf={LOTUS_LEAF} />
      <Lotus x={316} y={170} s={1.1} color={LOTUS_PINK} leaf={LOTUS_LEAF} bloom={false} />
      <Lotus x={200} y={150} s={0.7} color={LOTUS_PINK} leaf={LOTUS_LEAF} bloom={false} />
      <Path d="M-10,196 Q120,180 220,190 Q300,196 370,186 L370,250 L-10,250 Z" fill={c.p.ground} />
      <Grass c={c} y={196} seed={22} color={c.p.groundDeep} count={10} />
      <Figure x={130} y={216} s={1.02} {...TAM} pose="hold" />
      <Basket x={140} y={210} s={0.95} full />
      <Figure x={224} y={218} s={0.98} {...CAM} pose="out" />
      <Basket x={252} y={222} s={0.7} />
      {/* Cám points away: little motion dashes */}
      <Path d="M262,176 l12,-4 M264,184 l12,0" stroke={c.p.ink} strokeWidth={1.4} strokeLinecap="round" opacity={0.4} />
      <Bird x={300} y={70} s={0.9} color="#8A6A3A" />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 3 — Tấm sits sadly by the pond; Bụt appears in soft light; one goby remains
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#ECBB72" bottom={c.p.skyLow} />
      <Ridge c={c} y={142} amp={12} seed={13} color="#C4C98A" />
      <Water c={c} y={150} top="#B4C8A8" bottom="#7FA290" shimmer="#F6F0D8" name="pond" seed={9} />
      <Lotus x={250} y={176} s={1.2} color={LOTUS_PINK} leaf={LOTUS_LEAF} />
      <Lotus x={300} y={168} s={0.9} color={LOTUS_PINK} leaf={LOTUS_LEAF} bloom={false} />
      <Lotus x={330} y={186} s={1} color={LOTUS_PINK} leaf={LOTUS_LEAF} />
      <Palm x={30} y={156} s={0.95} trunk={PALM_TRUNK} leaf={PALM_LEAF} />
      <Path d="M-10,198 Q100,182 200,196 Q260,204 370,200 L370,250 L-10,250 Z" fill={c.p.ground} />
      <But c={c} name="but" x={120} y={214} s={1.12} />
      {[[84, 120], [160, 112], [150, 150], [70, 160]].map(([x, y], i) => (
        <Sparkle key={i} x={x} y={y} r={3 + (i % 2)} color="#FFFFFF" />
      ))}
      <Figure x={228} y={218} s={1.02} {...TAM} sitting flip />
      <Path d="M219,170 q-1.4,3 0,4.4 q1.4,-1.4 0,-4.4 Z" fill="#9FC8E0" />
      <Basket x={188} y={222} s={1} />
      <Goby x={188} y={196} s={0.72} rot={-14} flip />
      <Grass c={c} y={204} seed={31} color={c.p.groundDeep} count={8} />
      <Finish c={c} vignette={0.26} />
    </G>
  ),
  // 4 — Tấm shares rice at the well; later the goby swims free in the wide river
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={292} cy={96} r={100} color={c.p.glow} opacity={0.7} />
      <Sun cx={292} cy={96} r={16} color="#FFF4D6" />
      <Ridge c={c} y={120} amp={10} seed={6} color="#C4CF8E" />
      {/* the wide sunny river, far away */}
      <Path d="M200,136 Q260,124 370,126 L370,176 Q280,170 214,142 Z" fill="#9FC8C0" />
      <Path d="M250,140 l26,0 M290,150 l30,0 M310,134 l20,0" stroke="#FFF4D6" strokeWidth={1.6} strokeLinecap="round" opacity={0.8} />
      <Goby x={300} y={142} s={0.55} rot={-10} />
      {[[176, 108], [204, 92], [234, 90], [262, 104]].map(([x, y], i) => (
        <Sparkle key={i} x={x} y={y} r={2.4 + i * 0.4} color="#FFFFFF" />
      ))}
      <Palm x={176} y={156} s={0.8} trunk={PALM_TRUNK} leaf={PALM_LEAF} />
      <Rect x={0} y={152} width={c.W} height={92} fill={c.p.ground} />
      <Path d="M200,152 Q280,150 370,168 L370,176 Q280,166 200,156 Z" fill="#9FC8C0" opacity={0.6} />
      <Fence x={-4} y={160} w={120} h={22} />
      <Well x={138} y={222} s={1.6} />
      <Goby x={140} y={154} s={1.05} rot={-20} />
      <Path d="M122,166 q-4,-6 -2,-10 M160,164 q4,-6 2,-10" stroke="#CFE6DC" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Figure x={66} y={222} s={1.05} {...TAM} pose="out" />
      {[[98, 170], [104, 176], [110, 168], [116, 174]].map(([x, y], i) => (
        <Ellipse key={i} cx={x} cy={y} rx={1.6} ry={1} fill={i % 2 ? '#F6D58A' : '#FFFFFF'} />
      ))}
      <Bowl x={48} y={224} />
      <Grass c={c} y={214} seed={41} color={c.p.groundDeep} count={8} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 5 — a flock of sparrows sorts the mixed grains into two neat piles
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#F1CB7C" bottom={c.p.skyLow} />
      <Glow c={c} name="magic" cx={300} cy={34} r={100} color={c.p.glow} opacity={0.9} />
      <Ridge c={c} y={132} amp={10} seed={15} color="#C4CF8E" />
      <Fence x={-4} y={146} w={370} h={24} />
      <Rect x={0} y={144} width={c.W} height={100} fill="#D9B07E" />
      <Figure x={180} y={190} s={1.35} {...TAM} pose="out" sitting />
      {/* the big woven tray */}
      <Ellipse cx={180} cy={206} rx={112} ry={30} fill="#9A7440" />
      <Ellipse cx={180} cy={203} rx={104} ry={26} fill="#CDA86C" />
      {[0.5, 0.75].map((t) => (
        <Ellipse key={t} cx={180} cy={203} rx={104 * t} ry={26 * t} stroke="#B38E54" strokeWidth={1} fill="none" />
      ))}
      <Path d="M90,210 Q118,176 146,210 Z" fill="#D9A43E" />
      <Path d="M100,206 Q118,186 136,206" stroke="#F0C45E" strokeWidth={1.4} fill="none" />
      <Path d="M214,210 Q242,176 270,210 Z" fill="#FBF4E2" />
      <Path d="M224,206 Q242,186 260,206" stroke="#FFFFFF" strokeWidth={1.4} fill="none" />
      {Array.from({ length: 14 }, (_, i) => (
        <Ellipse key={i} cx={158 + (i % 7) * 7} cy={200 + Math.floor(i / 7) * 8 + (i % 3)} rx={1.6} ry={1} fill={i % 2 ? '#D9A43E' : '#FBF4E2'} />
      ))}
      <Sparrow x={108} y={186} s={1.1} />
      <Sparrow x={150} y={208} s={1.05} flip />
      <Sparrow x={176} y={214} s={1.1} />
      <Sparrow x={208} y={208} s={1.05} />
      <Sparrow x={258} y={186} s={1.1} flip />
      <Sparrow x={88} y={216} s={1} />
      <Sparrow x={278} y={218} s={1} flip />
      <Sparrow x={248} y={88} s={1.05} fly flip />
      <Sparrow x={278} y={64} s={0.95} fly flip />
      <Sparrow x={312} y={92} s={0.9} fly flip />
      <Sparrow x={86} y={84} s={0.85} fly />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 6 — in pale blue, Tấm crosses the stream; one slipper slips into the water
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#F6DC98" bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={120} cy={50} r={100} color={c.p.glow} opacity={0.6} />
      <Ridge c={c} y={132} amp={10} seed={17} color="#C4CF8E" />
      {/* festival rooftops and the king's elephant on the far bank */}
      <Pavilion x={320} y={138} s={0.55} roof="#B85A3A" pillar="#8A3A2A" wall="#F2DDB0" trim="#E9B44C" />
      {[268, 290, 352].map((fx) => (
        <G key={fx}>
          <Path d={`M${fx},138 L${fx},104`} stroke="#8A6A3A" strokeWidth={1.2} />
          <Path d={`M${fx},104 L${fx + 12},108 L${fx},112 Z`} fill={fx % 2 ? '#E59A9A' : '#E9B44C'} />
        </G>
      ))}
      <Rect x={0} y={136} width={c.W} height={30} fill={c.p.ground} />
      <Elephant x={286} y={162} s={0.62} flip />
      <Path d="M276,126 L276,104" stroke="#8A6A3A" strokeWidth={1.2} />
      <Path d="M264,108 Q276,96 288,108 Z" fill="#E9B44C" />
      <Palm x={34} y={160} s={0.9} trunk={PALM_TRUNK} leaf={PALM_LEAF} />
      <Water c={c} y={164} top="#A9CCC4" bottom="#80AEA6" shimmer="#F4F8EC" name="stream" seed={21} />
      {[[96, 196], [140, 202], [190, 198], [236, 204]].map(([x, y], i) => (
        <Ellipse key={i} cx={x} cy={y} rx={14} ry={5} fill="#B7AE9C" />
      ))}
      <Path d="M-10,224 Q120,214 370,226 L370,250 L-10,250 Z" fill={c.p.ground} />
      <Lotus x={300} y={214} s={1} color={LOTUS_PINK} leaf={LOTUS_LEAF} />
      <Figure x={140} y={202} s={1.08} {...TAM_BLUE} pose="out" />
      <Rect x={132} y={199} width={8} height={3} rx={1.5} fill="#D9475C" />
      <Slipper x={176} y={208} s={1.1} rot={28} />
      <Ellipse cx={180} cy={216} rx={10} ry={2.4} stroke="#FFFFFF" strokeWidth={1} fill="none" opacity={0.8} />
      <Ellipse cx={180} cy={216} rx={17} ry={4} stroke="#FFFFFF" strokeWidth={0.8} fill="none" opacity={0.5} />
      <Sparrow x={66} y={222} s={0.9} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 7 — the young king holds up the slipper; Tấm steps forward shyly
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Pavilion x={170} y={160} s={1.5} roof="#B85A3A" pillar="#8A3A2A" wall="#F2DDB0" trim="#E9B44C" />
      {/* bunting */}
      <Path d="M-10,18 Q90,44 180,26 Q270,10 370,30" stroke="#8A6A3A" strokeWidth={1} fill="none" />
      {Array.from({ length: 12 }, (_, i) => {
        const x = 10 + i * 30;
        const y = i < 6 ? 22 + Math.sin(i * 0.6) * 10 + i * 1.5 : 30 - (i - 6) * 1.2;
        return <Path key={i} d={`M${x},${y} L${x + 12},${y} L${x + 6},${y + 12} Z`} fill={['#E59A9A', '#E9B44C', '#A9CBE6', '#9CCB7A'][i % 4]} />;
      })}
      <Rect x={0} y={158} width={c.W} height={86} fill="#D9B07E" />
      <Elephant x={300} y={196} s={0.78} flip />
      {/* the crowd: Cám and village girls watching */}
      <Figure x={46} y={200} s={0.82} {...CAM} />
      <Figure x={74} y={198} s={0.8} top="#9CCB7A" bottom="#6E9A52" hairStyle="bun" dress />
      <Figure x={100} y={202} s={0.82} top="#E9B44C" bottom="#B88A2E" hairStyle="long" dress />
      <Figure x={150} y={220} s={1.02} {...TAM_BLUE} pose="hold" />
      <Rect x={152} y={217} width={9} height={3} rx={1.5} fill="#D9475C" />
      <Glow c={c} name="slipper" cx={236} cy={140} r={28} color={c.p.glow} opacity={0.95} />
      <Figure x={222} y={220} s={1.08} {...KING} pose="up" flip />
      <Slipper x={208} y={152} s={1.15} rot={-10} />
      <Sparkle x={192} y={140} r={3.4} color="#FFFFFF" />
      <Sparkle x={224} y={136} r={2.6} color="#FFFFFF" />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 8 — Queen Tấm holds hands with Cám and the stepmother in the palace garden
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} mid="#F7DFA0" bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={180} cy={70} r={150} color={c.p.glow} opacity={0.7} />
      <Pavilion x={180} y={150} s={1.9} roof="#B85A3A" pillar="#8A3A2A" wall="#F2DDB0" trim="#E9B44C" />
      <Palm x={34} y={160} s={1.05} trunk={PALM_TRUNK} leaf={PALM_LEAF} />
      <Palm x={326} y={162} s={1.1} trunk={PALM_TRUNK} leaf={PALM_LEAF} lean={-5} />
      <Rect x={0} y={148} width={c.W} height={96} fill={c.p.ground} />
      <Path d="M-10,212 Q180,198 370,212 L370,250 L-10,250 Z" fill="#8FB8AE" />
      <Lotus x={40} y={226} s={1} color={LOTUS_PINK} leaf={LOTUS_LEAF} />
      <Lotus x={312} y={228} s={1.1} color={LOTUS_PINK} leaf={LOTUS_LEAF} />
      <Goby x={260} y={228} s={0.5} rot={-10} />
      <Figure x={136} y={204} s={0.96} {...CAM} pose="out" />
      <Figure x={224} y={204} s={1} {...STEP} pose="out" flip />
      <Figure x={180} y={204} s={1.04} {...TAM_BLUE} hat="crown" hatColor="#E2B64B" pose="out" />
      <Path d="M172,172 Q180,176 188,172" stroke="#E9B44C" strokeWidth={1.6} fill="none" />
      <Sparrow x={110} y={70} s={0.9} fly />
      <Sparrow x={252} y={58} s={0.85} fly flip />
      {[[90, 120], [270, 110], [60, 186], [300, 184]].map(([x, y], i) => (
        <Path key={i} d={`M${x},${y} q3,-3 6,0 q-3,3 -6,0 Z`} fill={LOTUS_PINK} opacity={0.8} />
      ))}
      <Finish c={c} vignette={0.24} />
    </G>
  ),
];

export const TAM_CAM: StoryScenes = { cover, pages };
