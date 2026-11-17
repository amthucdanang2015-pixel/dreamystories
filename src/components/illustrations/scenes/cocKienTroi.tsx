// Cóc Kiện Trời — a plucky comic adventure from parched heat to joyful rain.
// Signature: hot ochre skies over cracked earth, a winding cloud road up to a
// lilac-and-cream sky palace, a giant thunder drum with soft sound rings,
// then silver rain, a full blue river and a rainbow.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import {
  Cloud,
  Figure,
  Finish,
  Glow,
  Grass,
  Lotus,
  Pavilion,
  Rain,
  Ridge,
  RibbonCloud,
  SceneCtx,
  Sky,
  StoryScenes,
  Sun,
  Water,
  rng,
} from '../kit';

// ─── Characters & colours ─────────────────────────────────────

const TOAD = '#8C8A45';
const TOAD_DARK = '#6A6A2E';
const TOAD_BELLY = '#E8DCA8';
const TOAD_EYE = '#F2C230';
const STAFF = '#C9B060';
const EMPEROR = {
  top: '#3F8F72',
  bottom: '#D9A93A',
  hair: '#EDEDED',
  hairStyle: 'short' as const,
  hat: 'crown' as const,
  hatColor: '#E2B64B',
  beard: '#F4F4F0',
  dress: true,
  skin: '#EAC29A',
};
const RAIN_GOD = { top: '#9CC3E6', bottom: '#6F95C2', hairStyle: 'long' as const, hair: '#3A3A5E', dress: true };
const CLOUD = '#FBF6EC';
const CLOUD_SHADE = '#E3D9EE';
const LILAC = '#C9BEE6';
const SILVER = '#E6ECF5';
const RIVER = '#5AA6D6';

type ToadPose = 'stand' | 'speak' | 'drum' | 'bow' | 'cheer' | 'sit';

// ─── Local helpers ────────────────────────────────────────────

/** The hero: a small round bumpy toad with big golden eyes and a bamboo staff. Faces right; (x, y) = feet. */
function Toad({ x, y, s = 1, flip = false, pose = 'stand', staff = true }: { x: number; y: number; s?: number; flip?: boolean; pose?: ToadPose; staff?: boolean }) {
  const hand: [number, number] =
    pose === 'speak' || pose === 'cheer' ? [20, -46] : pose === 'drum' ? [26, -34] : pose === 'bow' ? [22, -12] : [20, -24];
  const staffEnd: [number, number] =
    pose === 'speak' ? [hand[0] + 4, hand[1] - 16] : pose === 'drum' ? [hand[0] + 24, hand[1] - 10] : pose === 'bow' ? [hand[0] + 2, 0] : pose === 'cheer' ? [hand[0] + 10, hand[1] - 20] : [hand[0] + 2, -58];
  const staffStart: [number, number] =
    pose === 'drum' ? [hand[0] - 10, hand[1] + 4] : pose === 'bow' ? [hand[0] - 1, -26] : [hand[0] - 2, hand[1] + 22 > 0 ? 0 : hand[1] + 22];
  const tilt = pose === 'bow' ? 'rotate(22 6 -6)' : undefined;
  const bumps: Array<[number, number, number]> = [
    [-10, -26, 2.4],
    [-4, -32, 2],
    [-14, -18, 2.2],
    [-6, -20, 1.6],
    [2, -26, 1.6],
    [-12, -10, 1.8],
    [10, -36, 1.4],
  ];
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Ellipse cx={0} cy={1} rx={22} ry={3} fill="#000000" opacity={0.12} />
      <G transform={tilt}>
        {/* back leg */}
        <Ellipse cx={-10} cy={-9} rx={13} ry={9} fill={TOAD_DARK} />
        <Ellipse cx={-3} cy={-1.5} rx={10} ry={3.2} fill={TOAD_DARK} />
        {/* body */}
        <Ellipse cx={0} cy={-20} rx={19} ry={16} fill={TOAD} />
        <Ellipse cx={6} cy={-14} rx={12} ry={10} fill={TOAD_BELLY} />
        {bumps.map(([bx, by, br], i) => (
          <Circle key={i} cx={bx} cy={by} r={br} fill={TOAD_DARK} opacity={0.75} />
        ))}
        {/* head */}
        <Ellipse cx={7} cy={-32} rx={16} ry={11} fill={TOAD} />
        {/* big golden eyes */}
        {[0, 14].map((ex) => (
          <G key={ex}>
            <Circle cx={ex} cy={-41} r={7} fill={TOAD} />
            <Circle cx={ex + 0.5} cy={-41.5} r={5} fill={TOAD_EYE} />
            <Circle cx={ex + 1.2} cy={-41.5} r={2.6} fill="#1E1A10" />
            <Circle cx={ex + 2.2} cy={-42.8} r={1} fill="#FFFFFF" />
          </G>
        ))}
        {pose === 'speak' || pose === 'stand' ? (
          <Path d="M-1,-48.5 L5,-46.5 M12,-46.5 L18,-48.5" stroke={TOAD_DARK} strokeWidth={1.6} strokeLinecap="round" />
        ) : null}
        {/* mouth */}
        {pose === 'cheer' || pose === 'sit' ? (
          <Path d="M-2,-30 Q8,-20 20,-30 Q8,-26 -2,-30 Z" fill="#7A3A2A" />
        ) : pose === 'speak' ? (
          <Ellipse cx={12} cy={-28} rx={4} ry={3} fill="#7A3A2A" />
        ) : (
          <Path d="M-2,-29 Q8,-23 20,-29" stroke="#3B2A1E" strokeWidth={1.4} fill="none" strokeLinecap="round" />
        )}
        <Circle cx={20} cy={-31} r={2.6} fill="#E58C7A" opacity={0.45} />
        {/* front legs */}
        <Path d={`M8,-18 Q16,-10 14,0`} stroke={TOAD_DARK} strokeWidth={4.6} fill="none" strokeLinecap="round" />
        <Ellipse cx={16} cy={-0.5} rx={4.4} ry={2} fill={TOAD_DARK} />
        {staff ? (
          <G>
            <Path d={`M${staffStart[0]},${staffStart[1]} L${staffEnd[0]},${staffEnd[1]}`} stroke={STAFF} strokeWidth={3} strokeLinecap="round" />
            {[0.3, 0.55, 0.8].map((t) => (
              <Circle
                key={t}
                cx={staffStart[0] + (staffEnd[0] - staffStart[0]) * t}
                cy={staffStart[1] + (staffEnd[1] - staffStart[1]) * t}
                r={1.9}
                fill="#9A8440"
              />
            ))}
          </G>
        ) : null}
        <Path d={`M10,-24 Q${(10 + hand[0]) / 2 + 2},${(-24 + hand[1]) / 2 - 2} ${hand[0]},${hand[1]}`} stroke={TOAD} strokeWidth={5} fill="none" strokeLinecap="round" />
        <Circle cx={hand[0]} cy={hand[1]} r={3.4} fill={TOAD} />
        {pose === 'cheer' ? (
          <Path d="M-6,-24 Q-16,-36 -14,-48" stroke={TOAD} strokeWidth={5} fill="none" strokeLinecap="round" />
        ) : null}
      </G>
    </G>
  );
}

function Crab({ x, y, s = 1, flip = false, wave = true }: { x: number; y: number; s?: number; flip?: boolean; wave?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {[-1, 1].map((d) => (
        <G key={d}>
          <Path d={`M${d * 8},-6 l${d * 8},4 M${d * 9},-9 l${d * 9},2 M${d * 6},-4 l${d * 5},6`} stroke="#B8402E" strokeWidth={2} strokeLinecap="round" />
          <Path d={`M${d * 10},-12 Q${d * 16},${wave ? -22 : -16} ${d * 16},${wave ? -28 : -20}`} stroke="#D9533C" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d={`M${d * 16},${wave ? -28 : -20} q${d * -6},-6 ${d * -2},-10 q${d * 2},4 ${d * 6},4 q${d * 2},-4 ${d * 6},-2 q${d * -2},8 ${d * -10},8 Z`} fill="#D9533C" />
        </G>
      ))}
      <Ellipse cx={0} cy={-9} rx={13} ry={8.5} fill="#E2603F" />
      <Ellipse cx={-3} cy={-12} rx={6} ry={3} fill="#F08A66" />
      <Path d="M-4,-16 L-5,-22 M4,-16 L5,-22" stroke="#B8402E" strokeWidth={1.6} />
      <Circle cx={-5} cy={-23} r={2.6} fill="#FFFFFF" />
      <Circle cx={5} cy={-23} r={2.6} fill="#FFFFFF" />
      <Circle cx={-4.6} cy={-23} r={1.3} fill="#1E1A10" />
      <Circle cx={5.4} cy={-23} r={1.3} fill="#1E1A10" />
      <Path d="M-3,-7 Q0,-4.6 3,-7" stroke="#7A2A1E" strokeWidth={1} fill="none" strokeLinecap="round" />
    </G>
  );
}

function Bear({ x, y, s = 1, flip = false, bow = false }: { x: number; y: number; s?: number; flip?: boolean; bow?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Ellipse cx={-8} cy={-4} rx={8} ry={5} fill="#2A2420" />
      <Ellipse cx={10} cy={-4} rx={8} ry={5} fill="#2A2420" />
      <Ellipse cx={0} cy={-22} rx={19} ry={20} fill="#2E2824" />
      <Ellipse cx={2} cy={-18} rx={11} ry={12} fill="#4A3F38" />
      <G transform={bow ? 'rotate(24 4 -36)' : undefined}>
        <Circle cx={4} cy={-48} r={14} fill="#2E2824" />
        <Circle cx={-6} cy={-60} r={5} fill="#2E2824" />
        <Circle cx={14} cy={-60} r={5} fill="#2E2824" />
        <Circle cx={-6} cy={-60} r={2.4} fill="#6A5A50" />
        <Circle cx={14} cy={-60} r={2.4} fill="#6A5A50" />
        <Ellipse cx={8} cy={-43} rx={7} ry={5.4} fill="#C9A27A" />
        <Ellipse cx={9} cy={-45.5} rx={2.6} ry={1.8} fill="#1A1410" />
        <Circle cx={0} cy={-51} r={1.6} fill="#F4EFE2" />
        <Circle cx={12} cy={-51} r={1.6} fill="#F4EFE2" />
        <Circle cx={0.4} cy={-51} r={0.9} fill="#1A1410" />
        <Circle cx={12.4} cy={-51} r={0.9} fill="#1A1410" />
      </G>
      <Path d="M-12,-30 Q-20,-20 -14,-10" stroke="#2E2824" strokeWidth={7} fill="none" strokeLinecap="round" />
      <Path d="M14,-30 Q22,-20 16,-10" stroke="#2E2824" strokeWidth={7} fill="none" strokeLinecap="round" />
    </G>
  );
}

function Tiger({ x, y, s = 1, flip = false, bow = false }: { x: number; y: number; s?: number; flip?: boolean; bow?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-14,-6 Q-30,-8 -28,-24 Q-26,-30 -22,-28" stroke="#E08A3A" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Ellipse cx={0} cy={-18} rx={16} ry={18} fill="#E89440" />
      <Ellipse cx={3} cy={-14} rx={9} ry={11} fill="#F6E3C4" />
      {[-12, -6].map((sx, i) => (
        <Path key={i} d={`M${sx},${-30 + i * 8} q6,2 8,6`} stroke="#8A4A1E" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      ))}
      <Ellipse cx={-6} cy={-2} rx={6} ry={3.6} fill="#E08A3A" />
      <Ellipse cx={8} cy={-2} rx={6} ry={3.6} fill="#E08A3A" />
      <G transform={bow ? 'rotate(24 4 -32)' : undefined}>
        <Circle cx={4} cy={-42} r={13} fill="#E89440" />
        <Circle cx={-6} cy={-53} r={4.4} fill="#E89440" />
        <Circle cx={14} cy={-53} r={4.4} fill="#E89440" />
        <Circle cx={-6} cy={-53} r={2} fill="#F6C7A8" />
        <Circle cx={14} cy={-53} r={2} fill="#F6C7A8" />
        <Ellipse cx={6} cy={-37} rx={7.4} ry={5} fill="#F6E3C4" />
        <Path d="M4,-54 l1,5 M8,-54 l-1,5 M-6,-44 l5,1 M18,-44 l-5,1" stroke="#8A4A1E" strokeWidth={1.8} strokeLinecap="round" />
        <Ellipse cx={6.4} cy={-39.5} rx={2.2} ry={1.5} fill="#B85A4A" />
        <Circle cx={0} cy={-44} r={1.5} fill="#1A1410" />
        <Circle cx={12} cy={-44} r={1.5} fill="#1A1410" />
        <Path d="M3,-35 Q6,-33 9,-35" stroke="#8A4A1E" strokeWidth={1} fill="none" strokeLinecap="round" />
      </G>
    </G>
  );
}

function Fox({ x, y, s = 1, flip = false, bow = false }: { x: number; y: number; s?: number; flip?: boolean; bow?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-8,-6 Q-30,-6 -30,-26 Q-22,-20 -8,-14 Z" fill="#D9643A" />
      <Path d="M-30,-26 Q-28,-18 -22,-16 Q-28,-22 -30,-26 Z" fill="#F7EDE0" />
      <Ellipse cx={-25} cy={-21} rx={5} ry={3.6} fill="#F7EDE0" transform="rotate(-40 -25 -21)" />
      <Ellipse cx={0} cy={-14} rx={11} ry={14} fill="#E06E40" />
      <Ellipse cx={3} cy={-12} rx={6} ry={9} fill="#F7EDE0" />
      <Rect x={-6} y={-6} width={4} height={7} rx={2} fill="#4A2A1E" />
      <Rect x={3} y={-6} width={4} height={7} rx={2} fill="#4A2A1E" />
      <G transform={bow ? 'rotate(26 2 -26)' : undefined}>
        <Path d="M-8,-30 Q2,-44 14,-32 L22,-28 Q14,-22 4,-24 Q-6,-24 -8,-30 Z" fill="#E06E40" />
        <Path d="M6,-26 L22,-28 Q14,-22 6,-24 Z" fill="#F7EDE0" />
        <Path d="M-6,-34 L-6,-46 L2,-38 Z M4,-38 L10,-48 L12,-36 Z" fill="#E06E40" />
        <Path d="M-4.5,-36 L-4.5,-42 L0,-38 Z M6,-38 L9.4,-44 L10.4,-37 Z" fill="#3A2420" />
        <Circle cx={22} cy={-28} r={1.6} fill="#1A1410" />
        <Path d="M4,-32 q2,-2 4,0" stroke="#1A1410" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      </G>
    </G>
  );
}

function Bee({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Ellipse cx={-1} cy={-5} rx={3.4} ry={4.4} fill="#FFFFFF" opacity={0.8} transform="rotate(-20 -1 -5)" />
      <Ellipse cx={3} cy={-5} rx={3} ry={4} fill="#FFFFFF" opacity={0.7} transform="rotate(20 3 -5)" />
      <Ellipse cx={0} cy={0} rx={6} ry={4.4} fill="#F2C230" />
      <Path d="M-2,-4 L-2,4 M2,-4 L2,4" stroke="#3B2A1E" strokeWidth={1.6} />
      <Circle cx={5} cy={-1} r={0.9} fill="#1A1410" />
      <Path d="M-6,0 L-8,0" stroke="#3B2A1E" strokeWidth={1.2} strokeLinecap="round" />
    </G>
  );
}

function Bees({ x, y, n = 5, seed = 3, spread = 30, trail = true }: { x: number; y: number; n?: number; seed?: number; spread?: number; trail?: boolean }) {
  const r = rng(seed);
  const bees = Array.from({ length: n }, () => ({ bx: x + (r() - 0.5) * spread * 2, by: y + (r() - 0.5) * spread, f: r() > 0.5 }));
  return (
    <G>
      {bees.map((b, i) => (
        <G key={i}>
          {trail ? (
            <Path
              d={`M${b.bx + (b.f ? 8 : -8)},${b.by} q${b.f ? 8 : -8},-8 ${b.f ? 14 : -14},0 q${b.f ? 6 : -6},8 ${b.f ? 12 : -12},2`}
              stroke="#3B2A1E"
              strokeWidth={0.9}
              strokeDasharray="2,2.4"
              fill="none"
              opacity={0.5}
            />
          ) : null}
          <Bee x={b.bx} y={b.by} s={0.95} flip={b.f} />
        </G>
      ))}
    </G>
  );
}

/** Dry riverbed: ochre earth from y down, with zig-zag crack lines. */
function CrackedEarth({ c, y, seed = 1, color, crack }: { c: SceneCtx; y: number; seed?: number; color: string; crack: string }) {
  const r = rng(seed);
  const cracks = Array.from({ length: 13 }, () => {
    let px = r() * c.W;
    let py = y + 6 + r() * (c.H - y - 6);
    let d = `M${px.toFixed(1)},${py.toFixed(1)}`;
    const dir = r() > 0.5 ? 1 : -1;
    const steps = 3 + Math.floor(r() * 3);
    const depth = (py - y) / (c.H - y);
    for (let k = 0; k < steps; k++) {
      px += dir * (8 + r() * 16) * (0.6 + depth);
      py += (r() - 0.5) * 10 * (0.4 + depth);
      d += ` L${px.toFixed(1)},${py.toFixed(1)}`;
    }
    return { d, w: 0.8 + depth * 1.6, bx: px, by: py };
  });
  return (
    <G>
      <Rect x={0} y={y} width={c.W} height={c.H - y + 2} fill={color} />
      {cracks.map((k, i) => (
        <G key={i}>
          <Path d={k.d} stroke={crack} strokeWidth={k.w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d={`M${k.bx},${k.by} l${i % 2 ? 6 : -6},${5 + (i % 3) * 2}`} stroke={crack} strokeWidth={k.w * 0.7} strokeLinecap="round" />
        </G>
      ))}
    </G>
  );
}

function Wilted({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M0,0 Q2,-14 8,-18 Q12,-18 12,-12" stroke="#9A8A4A" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <Path d="M12,-12 q-4,4 -2,8 q4,-2 2,-8 Z" fill="#B8A05A" />
      <Path d="M2,-8 q-8,0 -10,6 q6,0 10,-6 Z" fill="#A8984E" />
    </G>
  );
}

function HeatWaves({ y, xs }: { y: number; xs: number[] }) {
  return (
    <G opacity={0.4}>
      {xs.map((x, i) => (
        <Path key={i} d={`M${x},${y} q4,-4 8,0 q4,4 8,0 q4,-4 8,0`} stroke="#FFF3D6" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      ))}
    </G>
  );
}

/** A puffy cloud mass; (x, y) = centre of its base. */
function Puff({ x, y, w = 80, color = CLOUD, shade = CLOUD_SHADE }: { x: number; y: number; w?: number; color?: string; shade?: string }) {
  const n = Math.max(3, Math.round(w / 18));
  return (
    <G>
      <Ellipse cx={x} cy={y - 2} rx={w / 2 + 4} ry={8} fill={shade} />
      {Array.from({ length: n }, (_, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        const px = x - w / 2 + t * w;
        const pr = 10 + Math.sin(t * Math.PI) * 9;
        return <Circle key={i} cx={px} cy={y - pr * 0.7} r={pr} fill={color} />;
      })}
    </G>
  );
}

/** The winding road of clouds. pts: centreline points from bottom to top. */
function CloudRoad({ pts, width = 20 }: { pts: Array<[number, number]>; width?: number }) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q${x},${y} ${(x + nx) / 2},${(y + ny) / 2}`;
  }
  d += ` L${pts[pts.length - 1][0]},${pts[pts.length - 1][1]}`;
  return (
    <G>
      <Path d={d} stroke={CLOUD_SHADE} strokeWidth={width + 8} fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,4)" />
      <Path d={d} stroke={CLOUD} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <Circle key={i} cx={x + (i % 2 ? 8 : -8)} cy={y - width * 0.35} r={width * 0.42} fill={CLOUD} />
      ))}
    </G>
  );
}

/** Cloud-palace gate: two cream pillars under an upturned lilac roof. (x, y) = ground centre. */
function CloudGate({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {[-34, 34].map((px) => (
        <G key={px}>
          <Rect x={px - 6} y={-70} width={12} height={70} rx={2} fill="#F6EBD6" />
          <Rect x={px - 8} y={-8} width={16} height={8} rx={2} fill="#D9C9A8" />
          <Path d={`M${px - 4},-60 Q${px + 4},-50 ${px - 4},-40 Q${px + 4},-30 ${px - 4},-20`} stroke="#B9A9D9" strokeWidth={2} fill="none" />
        </G>
      ))}
      <Rect x={-44} y={-78} width={88} height={8} fill="#B8A2D8" />
      <Path d="M-56,-78 Q-58,-86 -64,-88 Q-40,-84 -36,-96 L36,-96 Q40,-84 64,-88 Q58,-86 56,-78 Z" fill="#7C6FB0" />
      <Rect x={-30} y={-100} width={60} height={4} rx={2} fill="#E2B64B" />
      <Circle cx={0} cy={-104} r={4} fill="#E2B64B" />
      <Rect x={-14} y={-76} width={28} height={10} rx={2} fill="#E2B64B" />
    </G>
  );
}

/** Giant thunder drum on a stand. (x, y) = stand base. */
function Drum({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-30,0 L-22,-30 M30,0 L22,-30" stroke="#8E5A2E" strokeWidth={5} strokeLinecap="round" />
      <Path d="M-36,-70 Q-42,-46 -36,-22 L36,-22 Q42,-46 36,-70 Z" fill="#B8463A" />
      <Path d="M-38,-58 L38,-58 M-38,-34 L38,-34" stroke="#8E2F28" strokeWidth={2} />
      {[-28, -14, 0, 14, 28].map((sx) => (
        <G key={sx}>
          <Circle cx={sx} cy={-66} r={1.8} fill="#E2B64B" />
          <Circle cx={sx} cy={-26} r={1.8} fill="#E2B64B" />
        </G>
      ))}
      <Ellipse cx={-36} cy={-46} rx={8} ry={24} fill="#F4E6C6" />
      <Ellipse cx={-36} cy={-46} rx={4} ry={12} fill="#E8D4A8" />
      <Path d="M-36,-52 q-2,6 0,12" stroke="#B8463A" strokeWidth={1.4} fill="none" />
    </G>
  );
}

function SoundRings({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <G>
      {[18, 30, 44, 60].map((r, i) => (
        <Path
          key={r}
          d={`M${x - r * 0.4},${y - r} A${r},${r} 0 0 0 ${x - r * 0.4},${y + r}`}
          stroke={color}
          strokeWidth={3 - i * 0.5}
          fill="none"
          strokeLinecap="round"
          opacity={0.85 - i * 0.18}
        />
      ))}
    </G>
  );
}

/** The comic Thunder God: a puffy lilac cloud spirit with a drum belt. (x, y) = cloud base. */
function ThunderGod({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Puff x={0} y={0} w={70} color="#EDE6F6" shade="#D2C6E6" />
      <Ellipse cx={0} cy={-30} rx={24} ry={20} fill="#9A8FC8" />
      {/* drum belt */}
      <Rect x={-26} y={-24} width={52} height={5} rx={2.5} fill="#8E5A2E" />
      {[-20, -7, 7, 20].map((dx) => (
        <G key={dx}>
          <Ellipse cx={dx} cy={-21} rx={5} ry={6} fill="#B8463A" />
          <Ellipse cx={dx} cy={-21} rx={3} ry={4} fill="#F4E6C6" />
        </G>
      ))}
      {/* arms on hips */}
      <Path d="M-20,-40 Q-34,-36 -26,-24" stroke="#9A8FC8" strokeWidth={6} fill="none" strokeLinecap="round" />
      <Path d="M20,-40 Q34,-36 26,-24" stroke="#9A8FC8" strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* head */}
      <Circle cx={0} cy={-62} r={17} fill="#B3A7DA" />
      {/* wild cloud hair */}
      {[-16, -8, 0, 8, 16].map((hx, i) => (
        <Circle key={hx} cx={hx} cy={-78 + (i % 2) * 3} r={7} fill="#EDE6F6" />
      ))}
      {/* puffed cheeks */}
      <Circle cx={-11} cy={-57} r={7.6} fill="#C7BBE6" />
      <Circle cx={11} cy={-57} r={7.6} fill="#C7BBE6" />
      <Circle cx={-11} cy={-56} r={3.6} fill="#E58C9A" opacity={0.5} />
      <Circle cx={11} cy={-56} r={3.6} fill="#E58C9A" opacity={0.5} />
      {/* grumpy brows, eyes, pouty mouth */}
      <Path d="M-10,-71 L-3,-68 M10,-71 L3,-68" stroke="#3B2A4E" strokeWidth={2.2} strokeLinecap="round" />
      <Circle cx={-5} cy={-64} r={1.8} fill="#2A1E3A" />
      <Circle cx={5} cy={-64} r={1.8} fill="#2A1E3A" />
      <Ellipse cx={0} cy={-53} rx={3} ry={2.2} fill="#6A3A5A" />
      {/* little grumble puffs */}
      <Circle cx={26} cy={-70} r={3} fill="#FFFFFF" opacity={0.8} />
      <Circle cx={32} cy={-76} r={2} fill="#FFFFFF" opacity={0.7} />
    </G>
  );
}

/** Cloud throne for the Jade Emperor. (x, y) = base centre. */
function CloudThrone({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-26,-14 Q-30,-56 0,-62 Q30,-56 26,-14 Z" fill="#E2B64B" />
      <Path d="M-20,-16 Q-22,-50 0,-54 Q22,-50 20,-16 Z" fill="#3F8F72" opacity={0.85} />
      <Puff x={0} y={0} w={64} />
      <RibbonCloud x={-28} y={-8} s={0.6} color={CLOUD} />
      <RibbonCloud x={30} y={-6} s={0.6} color={CLOUD} flip />
    </G>
  );
}

function CloudJar({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Path d="M-8,-16 Q-16,-6 -10,6 L10,6 Q16,-6 8,-16 Z" fill="#6F8FC4" />
      <Rect x={-7} y={-19} width={14} height={4} rx={2} fill="#4F6FA4" />
      <Path d="M-10,-4 Q0,0 10,-4" stroke="#A9C3E8" strokeWidth={1.4} fill="none" />
      <Circle cx={-4} cy={-22} r={5} fill={CLOUD} />
      <Circle cx={3} cy={-24} r={6} fill={CLOUD} />
      <Circle cx={8} cy={-20} r={4} fill={CLOUD} />
    </G>
  );
}

function SilverStreams({ x, y, h, n = 5 }: { x: number; y: number; h: number; n?: number }) {
  return (
    <G>
      {Array.from({ length: n }, (_, i) => {
        const sx = x + i * 6 - (n * 6) / 2;
        return (
          <G key={i}>
            <Path d={`M${sx},${y} q${-2 - i},${h * 0.5} ${-4 - i * 2},${h}`} stroke={SILVER} strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.85} />
            <Circle cx={sx - 4 - i * 2} cy={y + h + 6} r={1.6} fill={SILVER} />
          </G>
        );
      })}
    </G>
  );
}

function Rainbow({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const bands = ['#E8705A', '#F2A64A', '#F2D45A', '#7FC27A', '#5AA6D6', '#7C6FB0'];
  return (
    <G opacity={0.8}>
      {bands.map((col, i) => {
        const rr = r - i * 6;
        return <Path key={i} d={`M${cx - rr},${cy} A${rr},${rr} 0 0 1 ${cx + rr},${cy}`} stroke={col} strokeWidth={6} fill="none" />;
      })}
    </G>
  );
}

function Shade({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-2,0 Q-4,-30 2,-56 M2,-40 Q-14,-50 -24,-48 M1,-30 Q16,-40 26,-36 M2,-52 Q12,-62 18,-60" stroke="#6E4A2A" strokeWidth={3} fill="none" strokeLinecap="round" />
      {[[-22, -50], [-12, -54], [24, -38], [18, -62], [8, -60]].map(([lx, ly], i) => (
        <Ellipse key={i} cx={lx} cy={ly} rx={5} ry={2.4} fill="#A8984E" transform={`rotate(${i * 30} ${lx} ${ly})`} />
      ))}
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top={LILAC} mid={c.p.skyLow} bottom={c.p.sky} />
    <Glow c={c} name="palace" cx={236} cy={70} r={120} color={c.p.glow} opacity={0.9} />
    {/* sky palace on clouds */}
    <Puff x={236} y={108} w={150} />
    <Pavilion x={236} y={98} s={0.95} roof={c.p.accent} pillar="#F6EBD6" wall="#E8DDF2" trim="#E2B64B" />
    <RibbonCloud x={130} y={56} s={1.1} color={CLOUD} opacity={0.9} />
    <RibbonCloud x={324} y={150} s={0.9} color={CLOUD} opacity={0.8} flip />
    {/* dry cracked earth far below */}
    <CrackedEarth c={c} y={292} seed={3} color={c.p.ground} crack={c.p.groundDeep} />
    <Ridge c={c} y={296} amp={8} seed={5} color={c.p.groundDeep} opacity={0.5} />
    {/* winding cloud road */}
    <CloudRoad pts={[[40, 330], [120, 300], [80, 252], [170, 226], [130, 180], [200, 150], [216, 112]]} width={22} />
    {/* the parade: toad leads, friends trail behind */}
    <Bees x={152} y={226} n={4} seed={7} spread={14} trail={false} />
    <Fox x={56} y={318} s={0.7} />
    <Tiger x={96} y={290} s={0.66} />
    <Bear x={72} y={250} s={0.6} flip />
    <Crab x={128} y={224} s={0.8} />
    <Toad x={158} y={184} s={1.5} pose="speak" />
    <Finish c={c} vignette={0.22} />
  </G>
);

const pages = [
  // 1 — the parched riverbed under a blazing sun; wilted plants, thirsty animals in thin shade
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={284} cy={50} r={110} color="#FFF0C8" opacity={0.85} />
      <Sun cx={284} cy={50} r={22} color="#FFF4D2" rays="#F7D58A" />
      <Ridge c={c} y={140} amp={14} seed={3} color="#D9A666" />
      <CrackedEarth c={c} y={150} seed={11} color={c.p.ground} crack={c.p.groundDeep} />
      {/* empty river channel */}
      <Path d="M-10,176 Q120,160 200,182 Q280,204 370,188 L370,214 Q280,226 200,206 Q120,186 -10,204 Z" fill="#B87A40" opacity={0.6} />
      <HeatWaves y={132} xs={[80, 160, 230]} />
      <Shade x={112} y={170} s={1.1} />
      <Ellipse cx={112} cy={174} rx={34} ry={5} fill={c.p.groundDeep} opacity={0.35} />
      <Bear x={100} y={182} s={0.62} bow />
      <Tiger x={136} y={182} s={0.58} flip bow />
      <Wilted x={220} y={190} s={1.2} />
      <Wilted x={252} y={200} s={1} />
      <Wilted x={50} y={212} s={1.1} />
      <Toad x={226} y={222} s={0.9} pose="stand" staff={false} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 2 — on a rock the little toad speaks up; crab, bear, tiger, bees and fox line up behind him
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#E7C08E" bottom={c.p.skyLow} />
      <Sun cx={56} cy={42} r={16} color="#FFF4D2" rays="#F7D58A" />
      <Ridge c={c} y={150} amp={12} seed={21} color="#D9A666" />
      <CrackedEarth c={c} y={164} seed={22} color={c.p.ground} crack={c.p.groundDeep} />
      <Path d="M60,206 Q70,172 104,168 Q138,170 146,206 Z" fill="#A87A52" />
      <Path d="M74,180 Q100,170 128,178" stroke="#C9A07A" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Toad x={104} y={174} s={1.55} pose="speak" />
      {/* speech puffs */}
      <Circle cx={150} cy={86} r={3} fill={c.p.glow} />
      <Circle cx={160} cy={78} r={4.5} fill={c.p.glow} />
      <Ellipse cx={180} cy={64} rx={16} ry={10} fill={c.p.glow} />
      <Path d="M172,64 q4,-6 8,0 q4,6 8,0" stroke={c.p.accent} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Crab x={172} y={214} s={0.95} flip />
      <Bear x={208} y={214} s={0.78} flip />
      <Tiger x={250} y={216} s={0.74} flip />
      <Fox x={290} y={218} s={0.8} flip />
      <Bees x={262} y={118} n={5} seed={23} spread={22} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 3 — at the cloud palace gates the tiny toad beats the giant drum; soft sound rings ripple out
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={LILAC} mid="#EFE6F4" bottom={c.p.glow} />
      <Glow c={c} name="gate" cx={110} cy={110} r={110} color="#FFFFFF" opacity={0.6} />
      <CloudGate x={98} y={190} s={1.05} />
      <RibbonCloud x={300} y={42} s={1} color={CLOUD} opacity={0.9} flip />
      <Drum x={238} y={196} s={1.05} />
      <SoundRings x={196} y={148} color={c.p.accent} />
      <Puff x={60} y={214} w={150} />
      <Puff x={250} y={216} w={170} />
      <Rect x={0} y={208} width={c.W} height={40} fill={CLOUD} />
      <Toad x={160} y={212} s={1.05} pose="drum" />
      <Path d="M140,140 l-6,-6 M146,132 l-2,-8 M134,150 l-8,-2" stroke={c.p.accent} strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
      <Finish c={c} vignette={0.16} />
    </G>
  ),
  // 4 — the puffy-cheeked Thunder God grumbles at the gate; bees buzz round him; friends stand shoulder to shoulder
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#B8ACDC" bottom="#F1E8F0" />
      <CloudGate x={214} y={192} s={1.45} />
      <ThunderGod x={214} y={200} s={1.3} />
      <Bees x={150} y={92} n={3} seed={41} spread={18} />
      <Bees x={286} y={104} n={3} seed={42} spread={18} />
      <Puff x={100} y={226} w={200} />
      <Puff x={290} y={228} w={160} />
      <Rect x={0} y={220} width={c.W} height={30} fill={CLOUD} />
      <Fox x={44} y={222} s={0.74} />
      <Tiger x={72} y={222} s={0.72} />
      <Bear x={100} y={222} s={0.74} />
      <Crab x={124} y={222} s={0.8} />
      <Toad x={140} y={224} s={0.95} pose="stand" />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 5 — the toad bows politely before the kind Jade Emperor on his cloud throne; friends bow behind
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#C3B6E2" mid="#EFE4EE" bottom={c.p.glow} />
      {/* palace hall pillars */}
      {[40, 110, 250, 320].map((px) => (
        <G key={px}>
          <Rect x={px - 7} y={0} width={14} height={200} fill="#F6EBD6" opacity={0.9} />
          <Path d={`M${px - 4},40 q8,10 0,20 q-8,10 0,20`} stroke="#B9A9D9" strokeWidth={2} fill="none" />
        </G>
      ))}
      <Path d="M0,0 L360,0 L360,14 Q180,30 0,14 Z" fill={c.p.accent} />
      <Glow c={c} name="throne" cx={256} cy={130} r={100} color="#FFF6D8" opacity={0.85} />
      <CloudThrone x={256} y={196} s={1.3} />
      <Figure x={254} y={176} s={1.2} {...EMPEROR} sitting pose="out" flip />
      <Puff x={130} y={226} w={240} />
      <Rect x={0} y={218} width={c.W} height={30} fill={CLOUD} />
      <Toad x={170} y={218} s={1.1} pose="bow" />
      <Crab x={128} y={220} s={0.7} />
      <Bear x={104} y={220} s={0.62} bow />
      <Tiger x={76} y={220} s={0.6} bow />
      <Fox x={50} y={220} s={0.64} bow />
      <Bees x={88} y={150} n={3} seed={51} spread={14} trail={false} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 6 — the Jade Emperor smiles in surprise; the gentle Rain God pours silver rain from a cloud jar
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#A99CD4" mid="#D9D0EA" bottom="#E9C99A" />
      <Glow c={c} name="emperor" cx={88} cy={92} r={80} color="#FFF6D8" opacity={0.8} />
      <CloudThrone x={88} y={128} s={0.95} />
      <Figure x={86} y={114} s={0.9} {...EMPEROR} sitting pose="wave" />
      <Path d="M70,48 l-4,-6 M78,44 l0,-7 M62,54 l-6,-3" stroke={c.p.accent} strokeWidth={1.6} strokeLinecap="round" />
      <Puff x={236} y={130} w={150} />
      <Figure x={230} y={116} s={1.1} {...RAIN_GOD} pose="hold" />
      <CloudJar x={250} y={92} s={1.1} rot={50} />
      <SilverStreams x={268} y={104} h={28} n={5} />
      <Rain c={c} seed={61} color={SILVER} count={34} opacity={0.75} />
      {/* earth far below, starting to darken with rain */}
      <Ridge c={c} y={206} amp={10} seed={62} color={c.p.ground} />
      <Ridge c={c} y={222} amp={6} seed={63} color="#8FA35A" />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 7 — cheering and dancing home down the cloud path through soft rain, the toad leading with a big smile
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#9FA6CC" mid="#CFD6E6" bottom="#E7E2D2" />
      <Rain c={c} seed={71} color={SILVER} count={50} opacity={0.7} />
      <Ridge c={c} y={214} amp={10} seed={72} color="#9DB86A" />
      <Ridge c={c} y={228} amp={6} seed={73} color="#7FA04E" />
      <CloudRoad pts={[[380, 40], [300, 70], [250, 110], [180, 130], [110, 170], [40, 206]]} width={22} />
      <Fox x={292} y={78} s={0.6} flip />
      <Tiger x={252} y={108} s={0.6} flip />
      <Bear x={212} y={128} s={0.62} flip />
      <Crab x={170} y={140} s={0.74} flip />
      <Bees x={200} y={70} n={4} seed={74} spread={20} />
      <Toad x={110} y={178} s={1.35} pose="cheer" flip />
      {[[90, 120], [128, 118]].map(([nx, ny], i) => (
        <Path key={i} d={`M${nx},${ny} l0,-8 l6,-2 l0,8`} stroke={c.p.accent} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      ))}
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 8 — after the rain: full blue river, green fields, a rainbow, the happy toad on a lily pad
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#9CCBEA" bottom="#F5EBD0" />
      <Rainbow cx={180} cy={150} r={130} />
      <Cloud x={60} y={60} s={0.9} color="#FFFFFF" opacity={0.9} />
      <Cloud x={306} y={48} s={0.7} color="#FFFFFF" opacity={0.85} />
      <Ridge c={c} y={136} amp={12} seed={81} color="#8FBF6A" />
      <Ridge c={c} y={148} amp={8} seed={82} color="#6FA44E" />
      <Water c={c} y={156} top={RIVER} bottom="#3E86BA" shimmer="#E6F4FF" name="river" seed={83} />
      <Grass c={c} y={150} seed={84} color="#4F8A3A" count={6} />
      <Lotus x={60} y={200} s={1.1} color="#F2A6B8" leaf="#5E9A4A" />
      <Lotus x={300} y={190} s={0.9} color="#F2A6B8" leaf="#5E9A4A" bloom={false} />
      {/* lily pad */}
      <Path d="M140,208 A42,12 0 1 0 224,208 A42,12 0 0 0 186,198 L182,208 L176,197 A42,12 0 0 0 140,208 Z" fill="#5E9A4A" />
      <Ellipse cx={182} cy={207} rx={34} ry={8} fill="#7FB55E" opacity={0.6} />
      <Toad x={182} y={208} s={1.4} pose="sit" />
      <Ellipse cx={182} cy={222} rx={56} ry={4} stroke="#E6F4FF" strokeWidth={1.2} fill="none" opacity={0.6} />
      <Finish c={c} vignette={0.18} />
    </G>
  ),
];

export const COC_KIEN_TROI: StoryScenes = { cover, pages };
