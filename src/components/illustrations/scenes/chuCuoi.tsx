// Chú Cuội — silver-blue lunar night, one great banyan, Mid-Autumn lanterns.
// Signature: cool indigo skies, a silver moon that grows page by page,
// a single warm lantern-gold accent.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Banyan,
  Bird,
  Figure,
  Finish,
  Fireflies,
  Glow,
  Hut,
  Lantern,
  MoonDisc,
  Ridge,
  SceneCtx,
  Sky,
  Stars,
  StoryScenes,
  Sun,
  Water,
} from '../kit';

const CUOI = { top: '#7A5236', bottom: '#5A4130', hairStyle: 'short' as const };
const WIFE = { top: '#46588F', bottom: '#2E3A63', hairStyle: 'bun' as const, hat: 'khan' as const, hatColor: '#262B45' };
const LEAF = '#2E4A5C';
const LEAF_LIGHT = '#4F7488';
const TRUNK = '#3A3346';
const SILVER = '#DDE4F2';

function Tiger({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Ellipse cx={0} cy={-12} rx={22} ry={10} fill="#D08A44" />
      <Circle cx={22} cy={-20} r={9} fill="#D08A44" />
      <Circle cx={18} cy={-28} r={3} fill="#D08A44" />
      <Circle cx={27} cy={-27} r={3} fill="#D08A44" />
      <Ellipse cx={25} cy={-17} rx={4} ry={3} fill="#F2E3C8" />
      <Circle cx={24} cy={-22} r={1} fill="#1A1410" />
      {[-12, -4, 4].map((sx) => (
        <Path key={sx} d={`M${sx},-21 q2,5 0,9`} stroke="#5A3418" strokeWidth={2} fill="none" strokeLinecap="round" />
      ))}
      <Rect x={-16} y={-6} width={5} height={8} rx={2} fill="#C27D3A" />
      <Rect x={10} y={-6} width={5} height={8} rx={2} fill="#C27D3A" />
      <Path d="M-22,-14 Q-34,-20 -30,-30" stroke="#D08A44" strokeWidth={3} fill="none" strokeLinecap="round" />
    </G>
  );
}

function Axe({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M0,0 L10,-16" stroke="#6B4A2E" strokeWidth={2} strokeLinecap="round" />
      <Path d="M8,-18 L15,-15 L12,-10 Z" fill="#AEB8C8" />
    </G>
  );
}

const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top={c.p.ink} mid={c.p.sky} bottom={c.p.skyLow} />
    <Stars c={c} count={60} seed={4} maxY={c.H * 0.8} color={SILVER} />
    <Glow c={c} name="moonHalo" cx={180} cy={150} r={170} color={c.p.glow} opacity={0.35} />
    <MoonDisc cx={180} cy={150} r={104} color="#E9ECF4" shade="rgba(120,135,180,0.16)" />
    {/* Moon surface ridge Cuội sits on */}
    <Path d="M92,196 Q180,170 268,196 Q240,240 180,252 Q120,240 92,196 Z" fill="#C9D2E6" />
    <Glow c={c} name="treeHalo" cx={186} cy={150} r={70} color={c.p.glow} opacity={0.35} />
    <Banyan x={192} y={196} s={0.92} trunk={TRUNK} leaf={LEAF} leafLight={LEAF_LIGHT} root="#4C4560" />
    <Figure x={160} y={198} s={0.62} {...CUOI} sitting />
    {/* Village far below with rising lanterns */}
    <Ridge c={c} y={300} amp={14} seed={8} color={c.p.groundDeep} />
    <Hut x={70} y={318} s={0.55} wall="#28304F" roof="#1C2240" door="#141A33" lit={c.p.glow} />
    <Hut x={290} y={322} s={0.5} wall="#28304F" roof="#1C2240" door="#141A33" lit={c.p.glow} />
    <Ridge c={c} y={330} amp={8} seed={2} color={c.p.ink} />
    {[
      [60, 270, 'star'],
      [104, 248, 'round'],
      [262, 262, 'carp'],
      [306, 236, 'star'],
      [36, 226, 'round'],
    ].map(([x, y, k], i) => (
      <Lantern key={i} x={x as number} y={y as number} s={0.8} color={i % 2 ? '#E7A14A' : '#E2C26A'} glow={c.p.glow} kind={k as 'round' | 'star' | 'carp'} />
    ))}
    <Finish c={c} vignette={0.4} />
  </G>
);

const pages = [
  // 1 — Cuội walks into the forest at a cool silver dawn
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.skyLow} mid="#9AA7CC" bottom="#E9D9C4" />
      <Glow c={c} name="dawn" cx={250} cy={150} r={120} color="#F6E2B8" opacity={0.6} />
      <Sun cx={250} cy={152} r={18} color="#F7E6C2" />
      <Ridge c={c} y={150} amp={22} seed={5} color="#6F81A8" />
      <Banyan x={60} y={172} s={0.7} trunk="#4A4A63" leaf="#566C8C" leafLight="#6F86A6" />
      <Banyan x={312} y={176} s={0.62} trunk="#4A4A63" leaf="#566C8C" leafLight="#6F86A6" />
      <Ridge c={c} y={186} amp={12} seed={9} color="#3C5368" />
      <Ridge c={c} y={212} amp={8} seed={12} color={LEAF} />
      <Figure x={168} y={214} s={0.95} {...CUOI} pose="hold" />
      <Axe x={170} y={180} s={1.1} />
      <Bird x={210} y={86} s={1} color="#3C4A6E" />
      <Bird x={228} y={98} s={0.8} color="#3C4A6E" wing="down" />
      <Bird x={196} y={104} s={0.7} color="#3C4A6E" />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 2 — the mother tiger heals her cub with banyan leaves
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Stars c={c} count={18} seed={21} maxY={90} color={SILVER} opacity={0.6} />
      <Ridge c={c} y={150} amp={18} seed={14} color="#26304F" />
      <Glow c={c} name="sapling" cx={196} cy={160} r={70} color={c.p.glow} opacity={0.45} />
      <Banyan x={200} y={196} s={0.6} trunk={TRUNK} leaf={LEAF_LIGHT} leafLight="#86A6B8" />
      <Ridge c={c} y={196} amp={8} seed={6} color={LEAF} />
      <Tiger x={220} y={210} s={1.05} flip />
      <Tiger x={168} y={214} s={0.55} />
      {[[176, 196], [184, 199], [170, 200]].map(([x, y], i) => (
        <Path key={i} d={`M${x},${y} q4,-5 8,0 q-4,5 -8,0 Z`} fill="#7FB59A" />
      ))}
      {/* Cuội peeking from a bush */}
      <Figure x={72} y={214} s={0.9} {...CUOI} />
      <Ellipse cx={78} cy={208} rx={36} ry={18} fill="#22364A" />
      <Ellipse cx={58} cy={204} rx={18} ry={12} fill="#2C4558" />
      <Fireflies c={c} color={c.p.glow} count={10} area={[120, 120, 200, 80]} />
      <Finish c={c} vignette={0.35} />
    </G>
  ),
  // 3 — planting the glowing banyan beside the cottage, sharing leaves
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#56679A" bottom="#BCC6DE" />
      <Ridge c={c} y={160} amp={16} seed={31} color="#7887AE" />
      <Hut x={92} y={196} s={1.1} wall="#C7B49A" roof="#8E7A5F" door="#5A4632" />
      <Glow c={c} name="tree" cx={196} cy={150} r={64} color={c.p.glow} opacity={0.5} />
      <Banyan x={200} y={198} s={0.62} trunk={TRUNK} leaf={LEAF_LIGHT} leafLight="#9BB9C9" />
      <Rect x={0} y={196} width={c.W} height={50} fill="#3C5368" />
      <Ellipse cx={200} cy={200} rx={18} ry={4} fill="#5A4632" />
      <Figure x={176} y={210} s={0.9} {...CUOI} pose="out" />
      <Figure x={256} y={212} s={0.88} top="#8D6F9E" bottom="#4E3F5E" hairStyle="bun" pose="out" flip />
      <Figure x={292} y={214} s={0.66} top="#C27D5A" bottom="#5E4430" hairStyle="topknot" flip pose="wave" />
      <Path d="M232,182 q4,-5 8,0 q-4,5 -8,0 Z" fill="#7FB59A" />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 4 — Cuội shows his wife a clay jar of clear water
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom="#7E8DB8" />
      <Stars c={c} count={14} seed={41} maxY={70} color={SILVER} opacity={0.5} />
      <MoonDisc cx={300} cy={52} r={18} color="#E9ECF4" />
      <Hut x={60} y={196} s={1} wall="#9C8C7C" roof="#6E5E4E" door="#3E3428" lit={c.p.glow} />
      <Glow c={c} name="tree" cx={250} cy={150} r={66} color={c.p.glow} opacity={0.45} />
      <Banyan x={252} y={198} s={0.7} trunk={TRUNK} leaf={LEAF_LIGHT} leafLight="#9BB9C9" />
      <Rect x={0} y={194} width={c.W} height={50} fill="#2E3E58" />
      <Figure x={150} y={212} s={0.95} {...CUOI} pose="hold" />
      <Figure x={196} y={212} s={0.9} {...WIFE} flip />
      {/* clay jar */}
      <Path d="M160,188 Q152,196 158,206 L170,206 Q176,196 168,188 Z" fill="#B0643E" />
      <Ellipse cx={164} cy={188} rx={5} ry={1.6} fill="#BFE0F0" />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 5 — muddy water, the tree begins to sway and lift
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#2E3A66" mid="#6A6E9E" bottom="#C89B8C" />
      <Hut x={74} y={192} s={0.95} wall="#8C7C6C" roof="#5E4E40" door="#3E3428" />
      <Water c={c} y={196} top="#7A5C3E" bottom="#5A4128" shimmer="#B08A62" name="mud" />
      <Glow c={c} name="tree" cx={236} cy={140} r={70} color={c.p.glow} opacity={0.5} />
      <G transform="rotate(-8 236 196)">
        <Banyan x={236} y={190} s={0.72} trunk={TRUNK} leaf={LEAF_LIGHT} leafLight="#9BB9C9" />
      </G>
      {[214, 228, 246, 258].map((x, i) => (
        <Path key={i} d={`M${x},190 q${i % 2 ? 4 : -4},8 ${i % 2 ? 2 : -2},14`} stroke="#4C4560" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      ))}
      <Path d="M280,112 q8,4 6,12 M292,128 q8,4 6,12 M184,108 q-8,4 -6,12" stroke={c.p.glow} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.7} />
      <Figure x={150} y={206} s={0.9} {...WIFE} pose="out" />
      <Path d="M160,170 L170,176 L168,184 L158,180 Z" fill="#6B4A2E" />
      <Finish c={c} vignette={0.32} />
    </G>
  ),
  // 6 — the banyan floats up, Cuội holding a root; calm and dreamy
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.ink} mid={c.p.sky} bottom="#8C93C0" />
      <Stars c={c} count={40} seed={61} maxY={150} color={SILVER} />
      <Glow c={c} name="moon" cx={290} cy={40} r={70} color={c.p.glow} opacity={0.4} />
      <MoonDisc cx={290} cy={40} r={34} color="#E9ECF4" />
      <Glow c={c} name="tree" cx={176} cy={80} r={60} color={c.p.glow} opacity={0.4} />
      <Banyan x={176} y={118} s={0.62} trunk={TRUNK} leaf={LEAF_LIGHT} leafLight="#9BB9C9" />
      <Path d="M182,118 Q186,146 180,170" stroke="#4C4560" strokeWidth={1.8} fill="none" />
      <Figure x={180} y={204} s={0.62} {...CUOI} pose="up" />
      <Ridge c={c} y={222} amp={10} seed={4} color="#2A3556" />
      <Hut x={84} y={228} s={0.4} wall="#4A5272" roof="#2E3556" door="#1C2240" lit={c.p.glow} />
      <Finish c={c} vignette={0.38} />
    </G>
  ),
  // 7 — under the banyan on the moon, the earth glowing far away
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.ink} bottom={c.p.sky} />
      <Stars c={c} count={55} seed={71} maxY={180} color={SILVER} />
      <Glow c={c} name="earth" cx={300} cy={52} r={40} color="#9FD3E0" opacity={0.5} />
      <Circle cx={300} cy={52} r={16} fill="#5E9BB8" />
      <Path d="M290,46 q6,-6 12,0 q-2,6 -8,6 Z M302,58 q6,-2 8,4 q-6,2 -8,-4 Z" fill="#7FB58A" />
      <Path d="M-10,200 Q180,150 370,200 L370,250 L-10,250 Z" fill="#C9D2E6" />
      <Ellipse cx={90} cy={206} rx={14} ry={4} fill="#AEB8D0" />
      <Ellipse cx={268} cy={196} rx={10} ry={3} fill="#AEB8D0" />
      <Glow c={c} name="tree" cx={190} cy={120} r={80} color={c.p.glow} opacity={0.4} />
      <Banyan x={196} y={182} s={0.9} trunk={TRUNK} leaf={LEAF} leafLight={LEAF_LIGHT} root="#4C4560" />
      <Figure x={156} y={186} s={0.72} {...CUOI} sitting />
      <Finish c={c} vignette={0.4} />
    </G>
  ),
  // 8 — Mid-Autumn: children with star and carp lanterns look up at the moon
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.ink} mid={c.p.sky} bottom={c.p.skyLow} />
      <Stars c={c} count={30} seed={81} maxY={120} color={SILVER} />
      <Glow c={c} name="moon" cx={180} cy={66} r={90} color={c.p.glow} opacity={0.45} />
      <MoonDisc cx={180} cy={66} r={40} color="#EEF0F6" />
      <Path d="M172,60 l5,-12 l5,12 Z" fill="#9AA5C2" opacity={0.6} />
      <Hut x={44} y={190} s={0.9} wall="#3A4466" roof="#252C4A" door="#151B33" lit={c.p.glow} />
      <Hut x={318} y={192} s={0.85} wall="#3A4466" roof="#252C4A" door="#151B33" lit={c.p.glow} />
      <Rect x={0} y={190} width={c.W} height={60} fill={c.p.groundDeep} />
      {[
        { x: 112, top: '#C25B4A', hair: 'bob' as const, k: 'star' as const },
        { x: 156, top: '#E2C26A', hair: 'topknot' as const, k: 'carp' as const },
        { x: 204, top: '#5E8C7A', hair: 'braid' as const, k: 'round' as const },
        { x: 248, top: '#8D6F9E', hair: 'short' as const, k: 'star' as const },
      ].map((k, i) => (
        <G key={i}>
          <Path d={`M${k.x + 8},${176} L${k.x + 12},${152}`} stroke="#6B4A2E" strokeWidth={1.4} />
          <Lantern x={k.x + 12} y={148} s={0.9} color={k.k === 'round' ? '#E7A14A' : k.k === 'carp' ? '#E46A4A' : '#E2C26A'} glow={c.p.glow} kind={k.k} />
          <Figure x={k.x} y={214} s={0.66} top={k.top} bottom="#3A3346" hairStyle={k.hair} pose="hold" flip={i % 2 === 1} />
        </G>
      ))}
      <Finish c={c} vignette={0.36} />
    </G>
  ),
];

export const CHU_CUOI: StoryScenes = { cover, pages };
