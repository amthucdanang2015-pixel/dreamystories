// Rùa và Thỏ — a bright, good-humoured woodland race with a calm, warm finish.
// Signature: clear sky-blue over fresh spring greens, round lollipop broadleaf
// trees, a winding sandy race path lined with orange pennants, a big shady
// oak, a babbling brook with stepping stones and a finish ribbon strung
// between two white birches. Morning blue turns to late-afternoon gold.
// Hare: lanky, sand-brown, very long ears, white tail puff, striped orange
// scarf. Tortoise: small and round, olive patterned shell with a tiny leaf.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Bird,
  Cloud,
  Finish,
  Glow,
  Grass,
  Ridge,
  SceneCtx,
  Sky,
  StoryScenes,
  Sun,
  rng,
} from '../kit';

// ─── Characters & colours ─────────────────────────────────────

const HARE = '#C9A06A';
const HARE_DARK = '#A77E4E';
const HARE_CREAM = '#F3E6CC';
const EAR_PINK = '#F0B6A8';
const SCARF = '#F08A3C';
const SCARF_STRIPE = '#FFD27A';
const SHELL = '#7E8F3A';
const SHELL_DARK = '#5C6B28';
const SHELL_RIM = '#B3B866';
const TORT_SKIN = '#B9C47E';
const LEAF = '#5DBB4A';
const PATH = '#E6C98E';
const PATH_EDGE = '#C9A86A';
const BARK = '#7A5A3C';
const BIRCH = '#F4F1E8';
const SQUIRREL = '#C8642E';
const EYE = '#2A2014';

type HarePose = 'stand' | 'bounce' | 'laugh' | 'run' | 'yawn' | 'droop';
type TortPose = 'walk' | 'munch' | 'smile' | 'cheer' | 'shake';

// ─── Local helpers ────────────────────────────────────────────

/** Lanky hare. Faces right; (x, y) = feet. */
function Hare({ x, y, s = 1, flip = false, pose = 'stand' }: { x: number; y: number; s?: number; flip?: boolean; pose?: HarePose }) {
  const run = pose === 'run';
  const sit = pose === 'laugh' || pose === 'droop';
  const tilt = run ? 'rotate(24 0 -20)' : pose === 'bounce' ? 'rotate(-6 0 -20)' : undefined;
  const ears: [number, number] =
    pose === 'laugh' || pose === 'droop' ? [-118, -100] : run ? [-60, -48] : pose === 'yawn' ? [-14, 10] : [-8, 10];
  const lift = sit ? 8 : 0;
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Ellipse cx={0} cy={1} rx={18} ry={2.6} fill="#000000" opacity={pose === 'bounce' ? 0.06 : 0.12} />
      <G transform={`translate(0,${pose === 'bounce' ? -10 : 0})`}>
        <G transform={tilt}>
          {/* hind leg & big foot */}
          {run ? (
            <Path d="M-6,-14 Q-16,-8 -26,-4" stroke={HARE_DARK} strokeWidth={6} fill="none" strokeLinecap="round" />
          ) : (
            <G>
              <Ellipse cx={-4} cy={-9 + lift * 0.4} rx={9} ry={8} fill={HARE_DARK} />
              <Ellipse cx={2} cy={-2} rx={11} ry={3.2} fill={HARE_DARK} />
            </G>
          )}
          <Circle cx={-12} cy={-20 + lift} r={4.6} fill="#FFFFFF" />
          {/* body */}
          <Ellipse cx={0} cy={-24 + lift} rx={10} ry={sit ? 12 : 15} fill={HARE} />
          <Ellipse cx={4} cy={-21 + lift} rx={5.6} ry={sit ? 8 : 10} fill={HARE_CREAM} />
          {/* front leg */}
          {run ? (
            <Path d="M4,-16 Q14,-10 22,-14" stroke={HARE} strokeWidth={4.6} fill="none" strokeLinecap="round" />
          ) : (
            <Path d={`M5,${-16 + lift} L6,0`} stroke={HARE} strokeWidth={4.2} strokeLinecap="round" />
          )}
          {/* ears pivot from the top of the head */}
          {ears.map((a, i) => (
            <G key={i} transform={`translate(${4 + i * 3},${-48 + lift}) rotate(${a})`}>
              <Ellipse cx={0} cy={-15} rx={3.8} ry={16} fill={HARE} />
              <Ellipse cx={0} cy={-15} rx={1.8} ry={12} fill={EAR_PINK} />
            </G>
          ))}
          {/* head */}
          <Circle cx={7} cy={-42 + lift} r={9} fill={HARE} />
          <Ellipse cx={13} cy={-39 + lift} rx={5} ry={4} fill={HARE_CREAM} />
          <Circle cx={17.4} cy={-40.6 + lift} r={1.4} fill="#C7787A" />
          {pose === 'yawn' || pose === 'laugh' ? (
            <Path d={`M7,${-45 + lift} q2.4,-2 4.8,0`} stroke={EYE} strokeWidth={1.2} fill="none" strokeLinecap="round" />
          ) : run ? (
            <G>
              <Circle cx={10} cy={-45 + lift} r={2.4} fill="#FFFFFF" />
              <Circle cx={10.6} cy={-45 + lift} r={1.3} fill={EYE} />
            </G>
          ) : (
            <Circle cx={10} cy={-45 + lift} r={1.3} fill={EYE} />
          )}
          {pose === 'yawn' || pose === 'laugh' ? (
            <Ellipse cx={13} cy={-36 + lift} rx={2.6} ry={pose === 'yawn' ? 3.4 : 2.4} fill="#8A3A30" />
          ) : pose === 'droop' ? (
            <Path d={`M10,${-35 + lift} q3,-1.6 6,0`} stroke={EYE} strokeWidth={1} fill="none" strokeLinecap="round" />
          ) : (
            <Path d={`M9,${-37 + lift} q4,3 8,-1`} stroke={EYE} strokeWidth={1.1} fill="none" strokeLinecap="round" />
          )}
          <Circle cx={6} cy={-38 + lift} r={2} fill="#E58C7A" opacity={0.4} />
          {/* striped orange scarf, tail flying behind */}
          <Rect x={-1} y={-35 + lift} width={14} height={5} rx={2.5} fill={SCARF} />
          <Path d={`M0,${-33 + lift} Q-10,${-34 + lift} -18,${(run ? -40 : -26) + lift}`} stroke={SCARF} strokeWidth={4} fill="none" strokeLinecap="round" />
          {[3, 8].map((sx) => (
            <Rect key={sx} x={sx} y={-35 + lift} width={1.8} height={5} fill={SCARF_STRIPE} />
          ))}
          {/* arms */}
          {pose === 'yawn' ? (
            <Path d={`M2,${-30} Q-2,-48 4,-60`} stroke={HARE} strokeWidth={3.6} fill="none" strokeLinecap="round" />
          ) : pose === 'laugh' ? (
            <Path d={`M2,${-28 + lift} Q10,${-22 + lift} 8,${-18 + lift}`} stroke={HARE} strokeWidth={3.6} fill="none" strokeLinecap="round" />
          ) : pose === 'droop' ? (
            <Path d={`M3,${-28 + lift} Q14,${-26 + lift} 22,${-28 + lift}`} stroke={HARE} strokeWidth={3.6} fill="none" strokeLinecap="round" />
          ) : pose === 'bounce' ? (
            <Path d="M2,-30 Q12,-38 16,-48" stroke={HARE} strokeWidth={3.6} fill="none" strokeLinecap="round" />
          ) : null}
        </G>
      </G>
    </G>
  );
}

/** Small round tortoise with patterned olive shell and a leaf on top. Faces right; (x, y) = feet. */
function Tortoise({ x, y, s = 1, flip = false, pose = 'walk' }: { x: number; y: number; s?: number; flip?: boolean; pose?: TortPose }) {
  const headY = pose === 'cheer' ? -16 : -10;
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Ellipse cx={0} cy={1} rx={20} ry={2.6} fill="#000000" opacity={0.12} />
      {/* legs */}
      <Rect x={-14} y={-6} width={6} height={7} rx={3} fill={TORT_SKIN} />
      <Rect x={pose === 'walk' ? 8 : 6} y={-6} width={6} height={7} rx={3} fill={TORT_SKIN} transform={pose === 'walk' ? 'rotate(-18 10 -2)' : undefined} />
      {pose === 'shake' || pose === 'cheer' ? (
        <Path d="M12,-8 Q20,-12 24,-18" stroke={TORT_SKIN} strokeWidth={5} fill="none" strokeLinecap="round" />
      ) : null}
      <Path d="M-15,-5 L-21,-3 L-15,-2 Z" fill={TORT_SKIN} />
      {/* head & neck */}
      <Path d={`M10,-8 Q16,${headY - 2} 20,${headY}`} stroke={TORT_SKIN} strokeWidth={6} fill="none" strokeLinecap="round" />
      <Circle cx={21} cy={headY - 1} r={6} fill={TORT_SKIN} />
      <Path d={`M20,${headY - 4} q2.4,-1.6 4.4,0`} stroke={EYE} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <Path d={`M19.6,${headY - 5.4} q2.6,-1 5,0.4`} stroke={TORT_SKIN} strokeWidth={1.4} fill="none" />
      <Circle cx={22.2} cy={headY - 3} r={1} fill={EYE} />
      <Path d={`M21,${headY + 1} q2.4,2 5,0`} stroke={EYE} strokeWidth={1} fill="none" strokeLinecap="round" />
      <Circle cx={18.6} cy={headY + 0.4} r={1.6} fill="#E58C7A" opacity={0.4} />
      {pose === 'munch' ? <Path d={`M25,${headY + 1} q8,-6 12,0 q-6,4 -12,0 Z`} fill={LEAF} /> : null}
      {/* shell */}
      <Path d="M-17,-5 Q-17,-27 0,-28 Q17,-27 17,-5 Z" fill={SHELL} />
      <Path d="M-6,-24 L6,-24 L9,-15 L0,-10 L-9,-15 Z" fill={SHELL_DARK} opacity={0.75} />
      <Path d="M-15,-12 L-10,-15 L-9,-7 L-15,-7 Z M15,-12 L10,-15 L9,-7 L15,-7 Z" fill={SHELL_DARK} opacity={0.6} />
      <Circle cx={0} cy={-17} r={2.4} fill={SHELL_RIM} opacity={0.6} />
      <Rect x={-18} y={-7} width={36} height={4} rx={2} fill={SHELL_RIM} />
      {/* the tiny leaf */}
      <Path d="M-2,-28 q-2,-9 6,-11 q1,8 -6,11 Z" fill={LEAF} />
      <Path d="M-2,-28 L3,-37" stroke="#3E8A32" strokeWidth={0.8} />
    </G>
  );
}

/** Red squirrel with bushy tail, waving a little orange flag. */
function Squirrel({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-6,-4 Q-24,-8 -20,-28 Q-16,-40 -6,-36 Q-14,-28 -8,-14 Z" fill={SQUIRREL} />
      <Ellipse cx={0} cy={-10} rx={7} ry={10} fill={SQUIRREL} />
      <Ellipse cx={2} cy={-8} rx={3.6} ry={6} fill="#F3D9B8" />
      <Circle cx={3} cy={-24} r={6} fill={SQUIRREL} />
      <Path d="M0,-29 L1,-34 L4,-29 Z" fill={SQUIRREL} />
      <Circle cx={5} cy={-25} r={1} fill={EYE} />
      <Path d="M4,-16 L12,-32" stroke={BARK} strokeWidth={1.4} />
      <Path d="M12,-32 L24,-28 L12,-24 Z" fill={SCARF} />
    </G>
  );
}

function Hedgehog({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-12,0 L-14,-6 L-10,-8 L-11,-13 L-6,-13 L-5,-18 L0,-15 L3,-19 L5,-13 L10,-12 L9,-6 Z" fill="#7A5E48" />
      <Path d="M6,-9 Q16,-8 16,-3 Q12,0 6,0 Z" fill="#E8CFAE" />
      <Circle cx={16} cy={-4} r={1.2} fill={EYE} />
      <Circle cx={11} cy={-7} r={0.9} fill={EYE} />
      <Path d="M8,-10 L12,-18" stroke="#E8CFAE" strokeWidth={2.4} strokeLinecap="round" />
    </G>
  );
}

function Duck({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Ellipse cx={0} cy={-6} rx={8} ry={6} fill="#F2E7C4" />
      <Circle cx={6} cy={-14} r={4.4} fill="#F2E7C4" />
      <Path d="M10,-14 L15,-13 L10,-11 Z" fill={SCARF} />
      <Circle cx={7} cy={-15} r={0.8} fill={EYE} />
      <Path d="M-6,-8 L-11,-14 L-4,-11 Z" fill="#E2D2A2" />
    </G>
  );
}

function Badger({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Ellipse cx={0} cy={-12} rx={13} ry={12} fill="#5A5856" />
      <Path d="M-10,-20 Q-16,-30 -12,-38" stroke="#5A5856" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Ellipse cx={4} cy={-28} rx={9} ry={8} fill="#F2F0EA" />
      <Path d="M-1,-35 Q2,-26 0,-21 M9,-35 Q6,-26 8,-21" stroke="#3A3836" strokeWidth={3} fill="none" />
      <Circle cx={4} cy={-23} r={1.6} fill={EYE} />
    </G>
  );
}

/** Round broadleaf "lollipop" tree. (x, y) = trunk base. */
function LeafTree({ x, y, s = 1, color, light }: { x: number; y: number; s?: number; color: string; light: string }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-3} y={-30} width={6} height={30} rx={2} fill={BARK} />
      <Circle cx={0} cy={-44} r={20} fill={color} />
      <Circle cx={-12} cy={-34} r={11} fill={color} />
      <Circle cx={12} cy={-36} r={12} fill={color} />
      <Circle cx={-6} cy={-52} r={8} fill={light} opacity={0.7} />
    </G>
  );
}

/** Big shady oak with a wide lobed crown. (x, y) = trunk base. */
function Oak({ x, y, s = 1, c }: { x: number; y: number; s?: number; c: SceneCtx }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={2} rx={70} ry={9} fill={c.p.groundDeep} opacity={0.5} />
      <Path d="M-10,0 Q-6,-30 -8,-56 L8,-56 Q6,-30 12,0 Z" fill={BARK} />
      <Path d="M-6,-46 Q-24,-56 -40,-58 M6,-48 Q24,-58 42,-60" stroke={BARK} strokeWidth={5} fill="none" strokeLinecap="round" />
      {[[-44, -70, 24], [44, -72, 26], [-20, -92, 28], [20, -94, 30], [0, -76, 30], [-56, -58, 16], [58, -60, 16]].map(([cx, cy, r], i) => (
        <Circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? c.p.groundDeep : '#5E9C44'} />
      ))}
      {[[-26, -104], [16, -108], [44, -84], [-48, -82]].map(([cx, cy], i) => (
        <Circle key={i} cx={cx} cy={cy} r={9} fill={c.p.ground} opacity={0.7} />
      ))}
      {[[-30, -60], [26, -64], [6, -86]].map(([ax, ay], i) => (
        <G key={i}>
          <Circle cx={ax} cy={ay} r={2.4} fill="#A8743E" />
          <Rect x={ax - 2.4} y={ay - 3.6} width={4.8} height={2} rx={1} fill="#6A4A2A" />
        </G>
      ))}
    </G>
  );
}

function Birch({ x, y, h = 90 }: { x: number; y: number; h?: number }) {
  return (
    <G>
      <Rect x={x - 3} y={y - h} width={6} height={h} rx={2} fill={BIRCH} />
      {[0.2, 0.38, 0.55, 0.72, 0.88].map((t, i) => (
        <Rect key={i} x={x - (i % 2 ? 1 : 3)} y={y - h * t} width={i % 2 ? 4 : 3} height={1.6} fill="#3A3A34" opacity={0.7} />
      ))}
      <Ellipse cx={x} cy={y - h - 8} rx={16} ry={20} fill="#A9D46A" />
      <Ellipse cx={x - 6} cy={y - h - 14} rx={7} ry={8} fill="#CBE88E" />
    </G>
  );
}

/** Finish ribbon between two posts (or broken in the middle). */
function Ribbon({ x1, x2, y, broken = false }: { x1: number; x2: number; y: number; broken?: boolean }) {
  const mid = (x1 + x2) / 2;
  return broken ? (
    <G>
      <Path d={`M${x1},${y} Q${(x1 + mid) / 2},${y + 6} ${mid - 6},${y + 18}`} stroke={SCARF} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d={`M${x2},${y} Q${(x2 + mid) / 2},${y + 6} ${mid + 6},${y + 18}`} stroke={SCARF} strokeWidth={3} fill="none" strokeLinecap="round" />
    </G>
  ) : (
    <Path d={`M${x1},${y} Q${mid},${y + 8} ${x2},${y}`} stroke={SCARF} strokeWidth={3} fill="none" strokeLinecap="round" />
  );
}

function Pennant({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Rect x={-0.8} y={-22} width={1.6} height={22} fill={BARK} />
      <Path d="M0.8,-22 L12,-18 L0.8,-14 Z" fill={SCARF} />
    </G>
  );
}

/** Winding sandy race path: a ribbon through centreline points, narrowing into the distance. */
function RacePath({ pts, w0 = 40, w1 = 8 }: { pts: Array<[number, number]>; w0?: number; w1?: number }) {
  const n = pts.length;
  const wAt = (i: number) => w0 + ((w1 - w0) * i) / (n - 1);
  const left = pts.map(([px, py], i) => [px - wAt(i) / 2, py] as [number, number]);
  const right = pts.map(([px, py], i) => [px + wAt(i) / 2, py] as [number, number]).reverse();
  const line = (p: Array<[number, number]>) =>
    p.map(([px, py], i) => (i === 0 ? `${px},${py}` : `Q${px},${py} ${(px + (p[i + 1] ?? p[i])[0]) / 2},${(py + (p[i + 1] ?? p[i])[1]) / 2}`)).join(' ');
  const d = `M${line(left)} L${right[0][0]},${right[0][1]} ${line(right)} Z`;
  return (
    <G>
      <Path d={d} fill={PATH_EDGE} transform="translate(0,2)" />
      <Path d={d} fill={PATH} />
    </G>
  );
}

function Dust({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`} opacity={0.85}>
      <Circle cx={0} cy={-6} r={7} fill="#F2E2BE" />
      <Circle cx={-10} cy={-4} r={5} fill="#F2E2BE" />
      <Circle cx={-18} cy={-3} r={3.4} fill="#F2E2BE" opacity={0.7} />
      <Circle cx={-25} cy={-2} r={2} fill="#F2E2BE" opacity={0.5} />
    </G>
  );
}

function Footprints({ pts }: { pts: Array<[number, number]> }) {
  return (
    <G opacity={0.55}>
      {pts.map(([fx, fy], i) => (
        <G key={i}>
          <Circle cx={fx} cy={fy - (i % 2 ? 2 : 0)} r={1.4} fill={PATH_EDGE} />
          <Circle cx={fx + 3} cy={fy + (i % 2 ? 0 : 2)} r={1.4} fill={PATH_EDGE} />
        </G>
      ))}
    </G>
  );
}

/** Motion arcs (no harsh lines): soft dashes around a bouncing or dashing hare. */
function Swoosh({ x, y, r = 24, color = '#FFFFFF' }: { x: number; y: number; r?: number; color?: string }) {
  return (
    <G opacity={0.8}>
      <Path d={`M${x - r},${y} A${r},${r * 0.4} 0 0 0 ${x + r},${y}`} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeDasharray="6 6" />
    </G>
  );
}

/** Daytime woodland backdrop: sky, far trees, meadow. */
function Woods({ c, y, seed = 1, gold = false }: { c: SceneCtx; y: number; seed?: number; gold?: boolean }) {
  const r = rng(seed);
  return (
    <G>
      {gold ? (
        <Sky c={c} top="#F6D79A" mid="#FBE6B0" bottom="#F7F0C8" />
      ) : (
        <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      )}
      <Ridge c={c} y={y - 18} amp={12} seed={seed + 1} color={gold ? '#C8C27A' : '#B7D99A'} />
      {Array.from({ length: 7 }, (_, i) => (
        <LeafTree
          key={i}
          x={-10 + i * 60 + r() * 20}
          y={y + 2}
          s={0.55 + r() * 0.25}
          color={gold ? '#8FA548' : i % 2 ? '#6FAE4C' : '#7DBE58'}
          light={gold ? '#D8CC7A' : '#B6DE84'}
        />
      ))}
      <Ridge c={c} y={y} amp={6} seed={seed + 4} color={c.p.ground} />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Woods c={c} y={170} seed={3} />
    <Sun cx={270} cy={66} r={22} color="#FFF2B8" rays="#FFE48A" />
    <Cloud x={90} y={74} s={1.1} color="#FFFFFF" opacity={0.9} />
    <RacePath pts={[[150, 362], [200, 318], [140, 270], [210, 220], [190, 176]]} w0={110} w1={14} />
    {[[96, 330, 1.2], [270, 300, 1.1], [100, 262, 0.9], [252, 228, 0.7], [160, 214, 0.6], [222, 186, 0.45]].map(([px, py, ps], i) => (
      <Pennant key={i} x={px} y={py} s={ps} />
    ))}
    <Hare x={200} y={184} s={0.5} pose="run" />
    <Dust x={190} y={186} s={0.5} />
    <Footprints pts={[[150, 352], [160, 340], [172, 330]]} />
    <Tortoise x={180} y={318} s={2.2} pose="walk" />
    <Grass c={c} y={240} seed={9} color={c.p.groundDeep} count={18} />
    <Bird x={130} y={120} s={0.9} color="#5C7A8A" />
    <Bird x={150} y={110} s={0.7} color="#5C7A8A" wing="down" />
    <Finish c={c} vignette={0.16} />
  </G>
);

const pages = [
  // 1 — Hare bounces in circles, boasting; Tortoise munches a leaf calmly by a mossy log
  (c: SceneCtx) => (
    <G>
      <Woods c={c} y={150} seed={5} />
      <Sun cx={70} cy={44} r={16} color="#FFF2B8" rays="#FFE48A" />
      <Cloud x={280} y={50} s={0.9} color="#FFFFFF" opacity={0.85} />
      <RacePath pts={[[90, 244], [150, 214], [230, 190], [300, 168], [360, 158]]} w0={70} w1={20} />
      <Swoosh x={146} y={210} r={30} />
      <Hare x={146} y={204} s={1.15} pose="bounce" />
      {/* mossy log */}
      <Rect x={214} y={196} width={64} height={16} rx={8} fill={BARK} />
      <Ellipse cx={278} cy={204} rx={6} ry={8} fill="#C9A06A" />
      <Path d="M216,198 Q240,190 264,198" stroke="#7FB04A" strokeWidth={5} fill="none" strokeLinecap="round" />
      <Tortoise x={252} y={226} s={1} pose="munch" flip />
      <Grass c={c} y={196} seed={11} color={c.p.groundDeep} count={12} />
      <Finish c={c} vignette={0.16} />
    </G>
  ),
  // 2 — Tortoise smiles and offers a race; Hare laughs on the grass with his ears flopping
  (c: SceneCtx) => (
    <G>
      <Woods c={c} y={146} seed={9} />
      <Cloud x={100} y={46} s={0.8} color="#FFFFFF" opacity={0.85} />
      <Cloud x={270} y={36} s={0.6} color="#FFFFFF" opacity={0.7} />
      <Hare x={130} y={210} s={1.2} pose="laugh" />
      {[[100, 130], [86, 146], [168, 128]].map(([hx, hy], i) => (
        <Path key={i} d={`M${hx},${hy} q4,-6 8,0 q4,-6 8,0`} stroke={SCARF} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.8} />
      ))}
      <Tortoise x={236} y={214} s={1.3} pose="smile" flip />
      <Grass c={c} y={196} seed={13} color={c.p.groundDeep} count={14} />
      <Finish c={c} vignette={0.16} />
    </G>
  ),
  // 3 — the start: Squirrel waves the flag, friends cheer, Hare zooms off, Tortoise takes one step
  (c: SceneCtx) => (
    <G>
      <Woods c={c} y={140} seed={13} />
      <Sun cx={300} cy={40} r={14} color="#FFF2B8" rays="#FFE48A" />
      <RacePath pts={[[40, 228], [140, 212], [240, 196], [330, 180], [380, 172]]} w0={60} w1={26} />
      {/* the starting line scratched in the dirt */}
      <Path d="M120,198 Q128,214 130,226" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" opacity={0.85} />
      <Pennant x={116} y={196} s={0.9} />
      <Squirrel x={92} y={192} s={1.1} />
      <Tortoise x={124} y={222} s={0.95} pose="walk" />
      <Hare x={258} y={196} s={1.05} pose="run" />
      <Dust x={238} y={198} s={1} />
      <Dust x={200} y={204} s={0.6} />
      <Hedgehog x={180} y={176} s={1} />
      <Duck x={210} y={172} s={0.9} />
      <Duck x={224} y={174} s={0.7} />
      <Badger x={56} y={178} s={0.9} />
      <Grass c={c} y={210} seed={15} color={c.p.groundDeep} count={10} />
      <Finish c={c} vignette={0.16} />
    </G>
  ),
  // 4 — halfway: Hare stretches and yawns under the big shady oak; the path behind is empty
  (c: SceneCtx) => (
    <G>
      <Woods c={c} y={148} seed={17} />
      <Cloud x={70} y={40} s={0.8} color="#FFFFFF" opacity={0.85} />
      <RacePath pts={[[40, 244], [80, 206], [150, 184], [200, 166], [180, 152]]} w0={64} w1={10} />
      {[[110, 196, 0.8], [176, 172, 0.6], [196, 156, 0.45]].map(([px, py, ps], i) => (
        <Pennant key={i} x={px} y={py} s={ps} />
      ))}
      <Oak x={256} y={206} s={0.95} c={c} />
      <Hare x={236} y={214} s={1.1} pose="yawn" />
      <Path d="M262,152 q4,-4 8,0 M270,140 q3,-3 6,0" stroke={c.p.ink} strokeWidth={1} fill="none" opacity={0.4} />
      <Grass c={c} y={206} seed={17} color={c.p.groundDeep} count={12} />
      <Finish c={c} vignette={0.16} />
    </G>
  ),
  // 5 — Tortoise crosses the stepping-stone brook and climbs a sunny hill; a hedgehog cheers
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Sun cx={290} cy={42} r={16} color="#FFF2B8" rays="#FFE48A" />
      <Ridge c={c} y={130} amp={10} seed={21} color="#B7D99A" />
      <Path d="M120,250 Q200,120 380,140 L380,250 Z" fill={c.p.ground} />
      <Path d="M120,250 Q160,170 220,160" stroke="#B7DE84" strokeWidth={4} fill="none" opacity={0.6} />
      <Rect x={-10} y={196} width={150} height={60} fill={c.p.ground} />
      {/* brook */}
      <Path d="M-10,206 Q60,196 140,214 L150,240 Q60,226 -10,236 Z" fill="#7CC8E2" />
      <Path d="M20,214 q10,-3 20,0 M80,220 q10,-3 20,0" stroke="#FFFFFF" strokeWidth={1.4} fill="none" opacity={0.7} />
      {[[30, 222], [66, 218], [102, 224]].map(([sx, sy], i) => (
        <Ellipse key={i} cx={sx} cy={sy} rx={11} ry={4} fill="#B8B4A8" />
      ))}
      <Footprints pts={[[70, 214], [100, 218], [146, 206], [162, 196], [176, 186]]} />
      <Tortoise x={196} y={180} s={1.1} pose="walk" />
      <Hedgehog x={276} y={170} s={1.2} flip />
      <LeafTree x={330} y={156} s={0.8} color="#6FAE4C" light="#B6DE84" />
      <Pennant x={226} y={172} s={0.7} />
      <Grass c={c} y={170} seed={23} color={c.p.groundDeep} count={10} />
      <Finish c={c} vignette={0.16} />
    </G>
  ),
  // 6 — late gold: Tortoise breaks the ribbon between the birches as Hare races in wide-eyed
  (c: SceneCtx) => (
    <G>
      <Woods c={c} y={150} seed={25} gold />
      <Glow c={c} name="lowsun" cx={290} cy={110} r={120} color={c.p.glow} opacity={0.8} />
      <Sun cx={290} cy={110} r={16} color="#FFE29A" />
      <RacePath pts={[[0, 220], [100, 208], [200, 204], [300, 196], [380, 190]]} w0={50} w1={36} />
      <Birch x={176} y={210} h={96} />
      <Birch x={262} y={206} h={92} />
      <Ribbon x1={179} x2={259} y={168} broken />
      <Tortoise x={222} y={214} s={1.15} pose="cheer" />
      <Hare x={96} y={214} s={1} pose="run" />
      <Dust x={74} y={216} s={0.9} />
      <Hedgehog x={300} y={196} s={0.9} flip />
      <Badger x={322} y={198} s={0.8} flip />
      <Duck x={150} y={190} s={0.8} />
      <Squirrel x={130} y={196} s={0.8} />
      <Grass c={c} y={210} seed={27} color="#5E8A36" count={10} />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
  // 7 — golden evening: ears drooping, Hare shakes Tortoise's hand; the path home winds away
  (c: SceneCtx) => (
    <G>
      <Woods c={c} y={150} seed={29} gold />
      <Glow c={c} name="evening" cx={180} cy={150} r={170} color={c.p.glow} opacity={0.75} />
      <Sun cx={180} cy={140} r={18} color="#FFD98A" />
      <RacePath pts={[[180, 250], [140, 214], [200, 182], [170, 156]]} w0={90} w1={10} />
      <Hare x={154} y={222} s={1.2} pose="droop" />
      <Tortoise x={214} y={226} s={1.2} pose="shake" flip />
      <Birch x={58} y={200} h={80} />
      <Pennant x={292} y={210} s={0.8} />
      <Bird x={110} y={70} s={0.8} color="#A0745A" />
      <Bird x={128} y={62} s={0.6} color="#A0745A" wing="down" />
      <Grass c={c} y={200} seed={31} color="#5E8A36" count={12} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
];

export const RUA_VA_THO: StoryScenes = { cover, pages };
