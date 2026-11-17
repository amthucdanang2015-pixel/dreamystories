// Đám Mây Nhỏ Làm Mưa — airy, soft and hopeful. Signature: rolling terraced
// tea hills with neat rounded rows, a lavender-blushed little cloud with
// sleepy half-moon eyes, fine silver drizzle, a mint ribbon of breeze, and
// a pastel sunset rainbow. Daylight throughout, never a threatening storm.

import React from 'react';
import { Circle, Ellipse, G, Path } from 'react-native-svg';
import { Finish, Glow, Rain, Ridge, SceneCtx, Sky, StoryScenes, Sun, rng } from '../kit';

// ─── Colours ──────────────────────────────────────────────────

const CLOUD = '#FBFAFF';
const CLOUD_SHADE = '#DCD6F0';
const CLOUD_BLUSH = '#E9A9B8';
const CLOUD_EYE = '#4A4466';
const BIG_CLOUD = '#8E9AB3';
const BIG_CLOUD_DARK = '#6F7B95';
const FAR_HILL = '#9DB8C4';
const TEA = '#5E8A4E';
const TEA_LIGHT = '#79A563';
const TEA_DRY = '#A9A26A';
const TEA_DRY_DARK = '#8E8552';
const HILL_DRY = '#C9B98A';
const EARTH = '#B8735A';
const SPROUT = '#7DBF5A';
const DEW = '#BFE6F2';
const FLOWERS = ['#F4C24E', '#F2A3B5', '#FFFFFF', '#B9A7E6'];
const MINT = '#BFE8D6';
const DRIZZLE = '#E9F2FA';

// ─── Characters ───────────────────────────────────────────────

type CloudMood = 'shy' | 'worried' | 'calm' | 'happy' | 'awed';

/** Bông, the little cloud. (x, y) = centre of her flat underside; s = 1 is ~70 wide. */
function Bong({ x, y, s = 1, mood = 'shy' }: { x: number; y: number; s?: number; mood?: CloudMood }) {
  const eyes =
    mood === 'awed' ? (
      <G>
        <Circle cx={-8} cy={-15} r={2.4} fill={CLOUD_EYE} />
        <Circle cx={8} cy={-15} r={2.4} fill={CLOUD_EYE} />
        <Circle cx={-7.3} cy={-15.8} r={0.8} fill="#FFFFFF" />
        <Circle cx={8.7} cy={-15.8} r={0.8} fill="#FFFFFF" />
      </G>
    ) : mood === 'happy' || mood === 'calm' ? (
      <G>
        <Path d="M-11,-15 Q-8,-19 -5,-15 M5,-15 Q8,-19 11,-15" stroke={CLOUD_EYE} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </G>
    ) : (
      <G>
        <Path d="M-11,-16 Q-8,-13 -5,-16 M5,-16 Q8,-13 11,-16" stroke={CLOUD_EYE} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </G>
    );
  const mouth =
    mood === 'happy' ? (
      <Path d="M-4,-9 Q0,-4 4,-9 Z" fill="#C9677D" />
    ) : mood === 'worried' ? (
      <Path d="M-3,-7 Q0,-10 3,-7" stroke={CLOUD_EYE} strokeWidth={1.2} fill="none" strokeLinecap="round" />
    ) : mood === 'awed' ? (
      <Ellipse cx={0} cy={-8} rx={1.8} ry={2.2} fill="#C9677D" />
    ) : (
      <Path d="M-2.5,-9 Q0,-7 2.5,-9" stroke={CLOUD_EYE} strokeWidth={1.2} fill="none" strokeLinecap="round" />
    );
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {/* lavender underside shading */}
      <Ellipse cx={0} cy={-3} rx={36} ry={9} fill={CLOUD_SHADE} />
      <Circle cx={-22} cy={-12} r={14} fill={CLOUD} />
      <Circle cx={-4} cy={-22} r={19} fill={CLOUD} />
      <Circle cx={17} cy={-17} r={15} fill={CLOUD} />
      <Circle cx={30} cy={-8} r={9} fill={CLOUD} />
      <Ellipse cx={0} cy={-8} rx={34} ry={8} fill={CLOUD} />
      <Circle cx={-10} cy={-30} r={6} fill="#FFFFFF" opacity={0.8} />
      {eyes}
      {mouth}
      <Ellipse cx={-14} cy={-10} rx={4.4} ry={2.6} fill={CLOUD_BLUSH} opacity={mood === 'shy' ? 0.75 : 0.45} />
      <Ellipse cx={14} cy={-10} rx={4.4} ry={2.6} fill={CLOUD_BLUSH} opacity={mood === 'shy' ? 0.75 : 0.45} />
      {mood === 'worried' ? (
        <Path d="M22,-34 q2,4 0,6 q-2,-2 0,-6 Z" fill={DEW} />
      ) : null}
    </G>
  );
}

function BigCloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={-2} rx={56} ry={12} fill={BIG_CLOUD_DARK} />
      <Circle cx={-34} cy={-16} r={20} fill={BIG_CLOUD} />
      <Circle cx={-6} cy={-30} r={28} fill={BIG_CLOUD} />
      <Circle cx={26} cy={-22} r={22} fill={BIG_CLOUD} />
      <Circle cx={48} cy={-10} r={13} fill={BIG_CLOUD} />
      <Ellipse cx={0} cy={-8} rx={54} ry={10} fill={BIG_CLOUD} />
      <Path d="M-14,-24 Q-8,-28 -2,-24 M10,-24 Q16,-28 22,-24" stroke="#4E5870" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Path d="M-2,-14 Q4,-18 10,-14" stroke="#4E5870" strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </G>
  );
}

/** Two-leaf sprout with a dewdrop head. (x, y) = soil. */
function Sprout({ x, y, s = 1, mood = 'thirsty' }: { x: number; y: number; s?: number; mood?: 'thirsty' | 'happy' | 'up' }) {
  const droop = mood === 'thirsty';
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={0} rx={8} ry={2.4} fill={EARTH} opacity={0.7} />
      <Path d={droop ? 'M0,0 Q1,-10 4,-14' : mood === 'up' ? 'M0,0 Q-1,-14 0,-22' : 'M0,0 Q-1,-10 0,-16'} stroke={SPROUT} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {droop ? (
        <G>
          <Path d="M3,-12 Q-6,-12 -9,-4 Q-2,-6 3,-12 Z" fill={TEA_DRY} />
          <Path d="M4,-13 Q12,-10 13,-2 Q7,-6 4,-13 Z" fill={TEA_DRY} />
        </G>
      ) : (
        <G transform={mood === 'up' ? 'translate(0,-6)' : ''}>
          <Path d="M0,-14 Q-10,-22 -16,-16 Q-8,-12 0,-14 Z" fill={SPROUT} />
          <Path d="M0,-14 Q10,-22 16,-16 Q8,-12 0,-14 Z" fill={SPROUT} />
        </G>
      )}
      {/* face on the stem top */}
      <G transform={droop ? 'translate(4,-16)' : mood === 'up' ? 'translate(0,-25)' : 'translate(0,-19)'}>
        <Circle cx={0} cy={0} r={4.2} fill={droop ? '#9CC77C' : '#A7DC86'} />
        {mood === 'happy' || mood === 'up' ? (
          <Path d="M-2.4,-0.6 Q-1.4,-2 -0.4,-0.6 M0.6,-0.6 Q1.6,-2 2.6,-0.6" stroke="#2F4A26" strokeWidth={0.7} fill="none" strokeLinecap="round" />
        ) : (
          <G>
            <Circle cx={-1.4} cy={-1} r={0.65} fill="#2F4A26" />
            <Circle cx={1.4} cy={-1} r={0.65} fill="#2F4A26" />
          </G>
        )}
        <Path d={mood === 'thirsty' ? 'M-1,1.8 Q0,1.2 1,1.8' : 'M-1.2,1.2 Q0,2.4 1.2,1.2'} stroke="#2F4A26" strokeWidth={0.6} fill="none" strokeLinecap="round" />
      </G>
    </G>
  );
}

// ─── Scenery helpers ──────────────────────────────────────────

/**
 * A rounded tea hill with neat hedge rows following its curve.
 * The crest runs from (x0, base) up to the middle at `top` and down to (x1, base).
 */
function TeaHill({
  x0,
  x1,
  top,
  base,
  bottom,
  dry = false,
  rows = 5,
}: {
  x0: number;
  x1: number;
  top: number;
  base: number;
  bottom: number;
  dry?: boolean;
  rows?: number;
  seed?: number;
}) {
  const cx = (x0 + x1) / 2;
  const hill = `M${x0},${bottom} L${x0},${base} Q${cx},${top - (base - top)} ${x1},${base} L${x1},${bottom} Z`;
  const bush = dry ? TEA_DRY : TEA;
  const bushLight = dry ? '#BDB57E' : TEA_LIGHT;
  const gap = dry ? '#B4A472' : '#86A86A';
  const span = bottom - top;
  return (
    <G>
      <Path d={hill} fill={gap} />
      {Array.from({ length: rows }, (_, i) => {
        // rows get wider and flatter towards the viewer
        const t = (i + 0.6) / rows;
        const yMid = top + span * t * 0.92 + 4;
        const sag = (base - top) * (1 - t) * 0.95;
        const w = 6 + t * 10;
        const d = `M${x0 - 10},${yMid + sag} Q${cx},${yMid - sag} ${x1 + 10},${yMid + sag}`;
        const hi = `M${x0 - 10},${yMid + sag - w * 0.28} Q${cx},${yMid - sag - w * 0.28} ${x1 + 10},${yMid + sag - w * 0.28}`;
        return (
          <G key={i}>
            <Path d={d} stroke={bush} strokeWidth={w} fill="none" strokeLinecap="round" />
            <Path d={hi} stroke={bushLight} strokeWidth={w * 0.32} fill="none" strokeLinecap="round" opacity={0.75} />
          </G>
        );
      })}
    </G>
  );
}

function Flowers({ seed, area, droop = false, n = 10 }: { seed: number; area: [number, number, number, number]; droop?: boolean; n?: number }) {
  const r = rng(seed);
  const [ax, ay, aw, ah] = area;
  return (
    <G>
      {Array.from({ length: n }, (_, i) => {
        const x = ax + r() * aw;
        const y = ay + r() * ah;
        const col = FLOWERS[i % FLOWERS.length];
        return (
          <G key={i}>
            <Path d={droop ? `M${x},${y} q1,-6 5,-7` : `M${x},${y} l0,-8`} stroke={droop ? TEA_DRY_DARK : TEA} strokeWidth={1} fill="none" />
            <Circle cx={droop ? x + 5 : x} cy={droop ? y - 5 : y - 9} r={2.2} fill={droop ? '#D9B98C' : col} />
            {!droop ? <Circle cx={x} cy={y - 9} r={0.8} fill="#F4C24E" /> : null}
          </G>
        );
      })}
    </G>
  );
}

function Rainbow({ cx, cy, r, opacity = 0.45 }: { cx: number; cy: number; r: number; opacity?: number }) {
  const bands = ['#F2A3B5', '#F6C98A', '#F4E79A', '#B8DFA6', '#A8CBE8', '#B9A7E6'];
  return (
    <G opacity={opacity}>
      {bands.map((col, i) => {
        const rr = r - i * 5;
        return <Path key={i} d={`M${cx - rr},${cy} A${rr},${rr} 0 0 1 ${cx + rr},${cy}`} stroke={col} strokeWidth={5} fill="none" />;
      })}
    </G>
  );
}

/** Fine drizzle falling from under a cloud. */
function Drizzle({ x, y, w, h, seed = 5, n = 26, opacity = 0.75 }: { x: number; y: number; w: number; h: number; seed?: number; n?: number; opacity?: number }) {
  const r = rng(seed);
  return (
    <G opacity={opacity}>
      {Array.from({ length: n }, (_, i) => {
        const xx = x + r() * w;
        const yy = y + r() * h;
        return <Path key={i} d={`M${xx},${yy} l-1,5`} stroke={DRIZZLE} strokeWidth={1} strokeLinecap="round" />;
      })}
    </G>
  );
}

function Drop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M0,-6 Q4,0 0,3 Q-4,0 0,-6 Z" fill={DEW} />
      <Circle cx={-1} cy={0} r={0.9} fill="#FFFFFF" opacity={0.8} />
    </G>
  );
}

/** A ribbon of breeze with a kind face and a few tea leaves. */
function Breeze({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-70,10 C-40,-20 -10,30 20,0 C40,-20 60,-16 70,-4 C56,-10 40,-8 26,8 C-4,40 -40,4 -70,10 Z" fill={MINT} opacity={0.85} />
      <Path d="M-60,22 C-30,6 -10,30 16,18" stroke={MINT} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />
      <Path d="M56,-6 Q60,-9 64,-6" stroke="#4E7A6A" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <Path d="M54,0 Q58,3 62,0" stroke="#4E7A6A" strokeWidth={1.1} fill="none" strokeLinecap="round" />
      {[
        [-40, -6, 20],
        [-6, 22, -30],
        [36, -18, 50],
      ].map(([lx, ly, rot], i) => (
        <Path key={i} d="M0,0 Q4,-5 10,0 Q4,4 0,0 Z" fill={TEA_LIGHT} transform={`translate(${lx},${ly}) rotate(${rot})`} />
      ))}
    </G>
  );
}

function DaySky({ c, warm = false }: { c: SceneCtx; warm?: boolean }) {
  return (
    <G>
      <Sky c={c} top={warm ? '#E9D9A8' : c.p.sky} bottom={warm ? '#FBF3DA' : c.p.skyLow} />
      <Ridge c={c} y={c.H * 0.56} amp={18} seed={4} color={warm ? '#C6C7A8' : FAR_HILL} opacity={0.8} />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
    <Rainbow cx={180} cy={250} r={150} opacity={0.4} />
    <Ridge c={c} y={210} amp={22} seed={6} color={FAR_HILL} opacity={0.8} />
    <Drizzle x={120} y={206} w={120} h={70} seed={7} n={30} />
    <TeaHill x0={-40} x1={400} top={250} base={310} bottom={360} rows={4} seed={8} />
    <Bong x={180} y={204} s={1.7} mood="happy" />
    <Flowers seed={9} area={[40, 320, 280, 30]} n={12} />
    <Finish c={c} vignette={0.16} />
  </G>
);

const pages = [
  // 1 — Bông peeks shyly from behind the top of the green tea hill
  (c: SceneCtx) => (
    <G>
      <DaySky c={c} />
      <Bong x={196} y={120} s={1.3} mood="shy" />
      <TeaHill x0={20} x1={340} top={104} base={170} bottom={240} rows={5} seed={11} />
      <Flowers seed={12} area={[60, 214, 240, 20]} n={8} />
      <Finish c={c} vignette={0.16} />
    </G>
  ),
  // 2 — the big clouds rumble and pour; Bông watches from far off, wide-eyed
  (c: SceneCtx) => (
    <G>
      <DaySky c={c} />
      <Rain c={c} seed={21} color="#6F7B95" count={50} maxY={190} opacity={0.5} />
      <BigCloud x={150} y={74} s={1.1} />
      <BigCloud x={60} y={58} s={0.8} />
      <Ridge c={c} y={176} amp={14} seed={22} color={TEA} />
      <Bong x={236} y={150} s={0.8} mood="awed" />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 3 — a hot, dry summer: tea buds droop, flowers bow, a tiny sprout is thirsty
  (c: SceneCtx) => (
    <G>
      <DaySky c={c} warm />
      <Sun cx={270} cy={46} r={18} color="#FCE7A6" />
      <Glow c={c} name="heat" cx={270} cy={46} r={60} color="#FFF4CF" opacity={0.5} />
      <TeaHill x0={-20} x1={380} top={120} base={180} bottom={240} dry rows={4} seed={31} />
      <Flowers seed={32} area={[80, 206, 120, 16]} droop n={6} />
      <Sprout x={200} y={222} s={2} mood="thirsty" />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 4 — Bông wants to help but hesitates above the hill, worried
  (c: SceneCtx) => (
    <G>
      <DaySky c={c} warm />
      <Bong x={180} y={92} s={1.3} mood="worried" />
      <TeaHill x0={-20} x1={380} top={150} base={196} bottom={240} dry rows={3} seed={41} />
      <Sprout x={180} y={226} s={1.2} mood="thirsty" />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 5 — Chị Gió swirls by with tea leaves: “small rain is still rain”
  (c: SceneCtx) => (
    <G>
      <DaySky c={c} />
      <Breeze x={180} y={128} s={1.25} />
      <Bong x={168} y={108} s={1.2} mood="calm" />
      <TeaHill x0={-20} x1={380} top={170} base={206} bottom={240} dry rows={3} seed={51} />
      <Finish c={c} vignette={0.16} />
    </G>
  ),
  // 6 — one drop, then another: a fine silver drizzle over the tea rows
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#B8CDE0" bottom="#E3EAF0" />
      <Ridge c={c} y={c.H * 0.56} amp={18} seed={4} color={FAR_HILL} opacity={0.6} />
      <Drizzle x={110} y={80} w={140} h={120} seed={61} n={60} />
      <Drop x={150} y={96} s={1.2} />
      <Drop x={196} y={110} />
      <Bong x={180} y={78} s={1.3} mood="calm" />
      <TeaHill x0={-20} x1={380} top={150} base={196} bottom={240} rows={3} seed={62} />
      <Finish c={c} vignette={0.16} />
    </G>
  ),
  // 7 — fresh glossy tea, flowers open again, the sprout stretches: “Cảm ơn Bông!”
  (c: SceneCtx) => (
    <G>
      <DaySky c={c} />
      <Bong x={232} y={70} s={1} mood="happy" />
      <TeaHill x0={-20} x1={380} top={136} base={190} bottom={240} rows={4} seed={71} />
      {[[90, 170], [130, 160], [250, 166], [286, 176]].map(([dx, dy], i) => (
        <Drop key={i} x={dx} y={dy} s={0.8} />
      ))}
      <Flowers seed={72} area={[80, 200, 200, 20]} n={10} />
      <Sprout x={170} y={222} s={1.7} mood="up" />
      <Finish c={c} vignette={0.16} />
    </G>
  ),
  // 8 — pastel sunset and a soft rainbow; Bông floats openly, light and happy
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#B9A7D6" mid="#F2C6B4" bottom="#FFE8C8" />
      <Rainbow cx={180} cy={200} r={120} opacity={0.4} />
      <Glow c={c} name="dusk" cx={180} cy={200} r={110} color="#FFE6B8" opacity={0.5} />
      <Ridge c={c} y={168} amp={14} seed={81} color="#9E9AB8" opacity={0.8} />
      <TeaHill x0={-30} x1={390} top={170} base={208} bottom={240} rows={3} seed={82} />
      <Bong x={180} y={98} s={1.3} mood="happy" />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
];

export const MAY_NHO_LAM_MUA: StoryScenes = { cover, pages };
