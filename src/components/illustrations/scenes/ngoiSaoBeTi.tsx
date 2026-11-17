// Ngôi Sao Bé Tí — still, deep and tender. Signature: a vast violet sky with
// one tiny silver star (lilac halo, small curious face) among many, a misty
// northern mountain valley with terraced fields and a wooden stilt house,
// soft clouds that hide the moon, and a single thin silver beam slipping
// through a gap into a small square window. No fireflies, no big sun.

import React from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { Bird, Finish, Glow, Mist, MoonDisc, Paddies, Ridge, SceneCtx, Sky, Stars, StiltHouse, StoryScenes } from '../kit';

// ─── Colours ──────────────────────────────────────────────────

const STAR = '#F4F1FF';
const HALO = '#B9B3E6';
const STAR_FACE = '#4A3F7A';
const MOON = '#F2EBD3';
const MOON_SHADE = '#DCD2B4';
const NIGHT_CLOUD = '#4B4380';
const NIGHT_CLOUD_LIGHT = '#5E5596';
const MOUNTAIN_FAR = '#2E2A5C';
const MOUNTAIN_NEAR = '#232048';
const TERRACE = '#2B3550';
const TERRACE_LINE = '#3C4870';
const WOOD = '#7A5A42';
const ROOF = '#4A3A30';
const DARK = '#2A1E18';
const ROOM = '#2C2546';
const ROOM_FLOOR = '#3A3058';
const BED = '#5A4A3A';
const PILLOW = '#E8E4F4';
const SKIN = '#E8B98F';
const HAIR = '#1E1712';
const PJ = '#A9C2E6';
const BLANKET = ['#C8504A', '#E9C46A', '#3F6FA8', '#F2EDE2'];
const BEAM = '#E9E6FF';
const PLUM = '#4A3A40';
const BLOSSOM = '#F2C6D6';
const BULBUL = '#C9AE92';

// ─── Characters ───────────────────────────────────────────────

type StarMood = 'curious' | 'wistful' | 'effort' | 'glad' | 'calm';

/** Tí, the littlest star. (x, y) = centre; s = 1 is ~18 units across. */
function Ti({ x, y, s = 1, mood = 'curious', halo = 1 }: { x: number; y: number; s?: number; mood?: StarMood; halo?: number }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? 4.2 : 9.5;
    return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
  }).join(' L');
  const eyes =
    mood === 'calm' || mood === 'glad' ? (
      <Path d="M-3.2,-0.6 Q-2.2,-2 -1.2,-0.6 M1.2,-0.6 Q2.2,-2 3.2,-0.6" stroke={STAR_FACE} strokeWidth={0.7} fill="none" strokeLinecap="round" />
    ) : mood === 'effort' ? (
      <Path d="M-3.4,-1.6 L-1.2,-0.8 L-3.4,0 M3.4,-1.6 L1.2,-0.8 L3.4,0" stroke={STAR_FACE} strokeWidth={0.7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <G>
        <Circle cx={-2.2} cy={-0.8} r={0.9} fill={STAR_FACE} />
        <Circle cx={2.2} cy={-0.8} r={0.9} fill={STAR_FACE} />
      </G>
    );
  const mouth =
    mood === 'wistful' ? (
      <Path d="M-1.2,2.4 Q0,1.6 1.2,2.4" stroke={STAR_FACE} strokeWidth={0.6} fill="none" strokeLinecap="round" />
    ) : mood === 'effort' ? (
      <Path d="M-1.4,1.6 L1.4,1.6" stroke={STAR_FACE} strokeWidth={0.7} strokeLinecap="round" />
    ) : (
      <Path d="M-1.3,1.6 Q0,2.8 1.3,1.6" stroke={STAR_FACE} strokeWidth={0.6} fill="none" strokeLinecap="round" />
    );
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Circle cx={0} cy={0} r={22 * halo} fill={HALO} opacity={0.08} />
      <Circle cx={0} cy={0} r={14 * halo} fill={HALO} opacity={0.16} />
      <Circle cx={0} cy={0} r={10} fill={STAR} opacity={0.18} />
      {mood === 'effort' ? (
        <Path d="M0,-17 L0,-13 M12,-12 L9,-9 M-12,-12 L-9,-9 M15,2 L11,2 M-15,2 L-11,2" stroke={STAR} strokeWidth={1} strokeLinecap="round" opacity={0.8} />
      ) : null}
      <Path d={`M${pts} Z`} fill={STAR} />
      {eyes}
      {mouth}
      <Circle cx={-3.6} cy={1} r={1} fill="#E7A9C4" opacity={0.6} />
      <Circle cx={3.6} cy={1} r={1} fill="#E7A9C4" opacity={0.6} />
    </G>
  );
}

/** Lan sitting up or lying in bed under a striped blanket. (x, y) = bed foot, left. */
function LanInBed({ x, y, s = 1, pose = 'sit', smile = false }: { x: number; y: number; s?: number; pose?: 'sit' | 'sleep'; smile?: boolean }) {
  const sit = pose === 'sit';
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      {/* bed */}
      <Rect x={0} y={-16} width={96} height={12} rx={3} fill={BED} />
      <Rect x={2} y={-4} width={4} height={6} fill={DARK} />
      <Rect x={90} y={-4} width={4} height={6} fill={DARK} />
      <Rect x={86} y={-34} width={8} height={22} rx={2} fill={BED} />
      <Ellipse cx={76} cy={sit ? -22 : -20} rx={14} ry={6} fill={PILLOW} />
      {sit ? (
        <G>
          {/* body sitting up against the pillow */}
          <Path d="M58,-18 L58,-42 Q66,-50 74,-42 L74,-18 Z" fill={PJ} />
          <Circle cx={66} cy={-52} r={8} fill={SKIN} />
          <Path d="M57.6,-53 Q57,-63 66,-62 Q75,-63 74.4,-53 Q70,-58 57.6,-53 Z" fill={HAIR} />
          <Path d="M58,-54 Q53,-48 55,-40 M74,-54 Q79,-48 77,-40" stroke={HAIR} strokeWidth={3} fill="none" strokeLinecap="round" />
          {smile ? (
            <G>
              <Path d="M61.6,-53 Q62.8,-54.6 64,-53 M68,-53 Q69.2,-54.6 70.4,-53" stroke="#2A1A10" strokeWidth={0.9} fill="none" strokeLinecap="round" />
              <Path d="M63.4,-48.6 Q66,-46 68.6,-48.6" stroke="#2A1A10" strokeWidth={0.8} fill="none" strokeLinecap="round" />
            </G>
          ) : (
            <G>
              <Circle cx={63} cy={-53} r={1} fill="#2A1A10" />
              <Circle cx={69} cy={-53} r={1} fill="#2A1A10" />
              <Ellipse cx={66} cy={-48} rx={1.1} ry={1.4} fill="#2A1A10" opacity={0.8} />
            </G>
          )}
          <Circle cx={61} cy={-49} r={1.6} fill="#E58C7A" opacity={0.4} />
          <Circle cx={71} cy={-49} r={1.6} fill="#E58C7A" opacity={0.4} />
          {/* hands holding the blanket edge */}
          <Circle cx={60} cy={-30} r={2.6} fill={SKIN} />
          <Circle cx={72} cy={-30} r={2.6} fill={SKIN} />
        </G>
      ) : (
        <G>
          <Circle cx={74} cy={-26} r={7.5} fill={SKIN} />
          <Path d="M66.6,-27 Q67,-36 75,-35 Q82,-34 81.6,-27 Q76,-31 66.6,-27 Z" fill={HAIR} />
          <Path d="M70.4,-25.6 Q71.6,-24.4 72.8,-25.6 M75.6,-25.6 Q76.8,-24.4 78,-25.6" stroke="#2A1A10" strokeWidth={0.8} fill="none" strokeLinecap="round" />
          <Circle cx={70} cy={-22.6} r={1.5} fill="#E58C7A" opacity={0.4} />
        </G>
      )}
      {/* striped hand-woven blanket */}
      <G>
        <Path d={sit ? 'M4,-16 Q30,-30 56,-32 L76,-30 L80,-16 Z' : 'M4,-16 Q36,-28 66,-24 L80,-18 L82,-16 Z'} fill={BLANKET[3]} />
        {[0, 1, 2].map((i) => (
          <Path
            key={i}
            d={sit ? `M${10 + i * 16},-17 Q${16 + i * 16},-${23 + i * 3} ${20 + i * 16},-${25 + i * 2}` : `M${10 + i * 18},-17 Q${16 + i * 18},-${22 + i} ${22 + i * 18},-${23 + i}`}
            stroke={BLANKET[i]}
            strokeWidth={3}
            fill="none"
          />
        ))}
      </G>
    </G>
  );
}

// ─── Scenery helpers ──────────────────────────────────────────

function NightSky({ c, stars = 60, seed = 3 }: { c: SceneCtx; stars?: number; seed?: number }) {
  return (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Stars c={c} count={stars} seed={seed} color="#E8E4FF" opacity={0.75} />
    </G>
  );
}

/** Misty mountain valley with terraced fields; returns the ground line ~ y. */
function Valley({ c, y, seed = 5, mist = true }: { c: SceneCtx; y: number; seed?: number; mist?: boolean }) {
  return (
    <G>
      <Ridge c={c} y={y - 40} amp={40} seed={seed} color={MOUNTAIN_FAR} segments={5} />
      {mist ? <Mist c={c} y={y - 20} color="#8A80C2" opacity={0.18} height={30} /> : null}
      <Ridge c={c} y={y - 10} amp={26} seed={seed + 1} color={MOUNTAIN_NEAR} segments={6} />
      <Paddies c={c} y={y} color={TERRACE} line={TERRACE_LINE} rows={4} />
    </G>
  );
}

function SoftCloud({ x, y, s = 1, light = false }: { x: number; y: number; s?: number; light?: boolean }) {
  const col = light ? NIGHT_CLOUD_LIGHT : NIGHT_CLOUD;
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={0} rx={60} ry={12} fill={col} />
      <Circle cx={-30} cy={-8} r={18} fill={col} />
      <Circle cx={-2} cy={-16} r={24} fill={col} />
      <Circle cx={28} cy={-8} r={18} fill={col} />
      <Path d="M-40,-18 Q-24,-30 -6,-30" stroke="#7E76B8" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5} />
    </G>
  );
}

/** A small square-windowed stilt house; `lit` adds a silver glow in the window. */
function House({ x, y, s = 1, lit = false }: { x: number; y: number; s?: number; lit?: boolean }) {
  return (
    <G>
      <StiltHouse x={x} y={y} s={s} wood={WOOD} roof={ROOF} dark={DARK} />
      <Rect x={x + 10 * s} y={y - 31 * s} width={10 * s} height={9 * s} fill={lit ? BEAM : '#1A1530'} />
      {lit ? <Circle cx={x + 15 * s} cy={y - 26.5 * s} r={12 * s} fill={BEAM} opacity={0.25} /> : null}
    </G>
  );
}

function Beam({ x1, y1, x2, y2, w = 10, opacity = 0.4 }: { x1: number; y1: number; x2: number; y2: number; w?: number; opacity?: number }) {
  return (
    <G>
      <Path d={`M${x1 - 1.5},${y1} L${x1 + 1.5},${y1} L${x2 + w / 2},${y2} L${x2 - w / 2},${y2} Z`} fill={BEAM} opacity={opacity * 0.6} />
      <Path d={`M${x1},${y1} L${x2},${y2}`} stroke={BEAM} strokeWidth={1.2} opacity={opacity + 0.3} strokeLinecap="round" />
    </G>
  );
}

function Room({ c, windowX = 220, windowY = 40, lit = false }: { c: SceneCtx; windowX?: number; windowY?: number; lit?: boolean }) {
  return (
    <G>
      <Rect x={0} y={0} width={c.W} height={c.H} fill={ROOM} />
      {/* woven bamboo wall texture */}
      {Array.from({ length: 12 }, (_, i) => (
        <Path key={i} d={`M0,${i * 16 + 8} L${c.W},${i * 16 + 8}`} stroke="#352D52" strokeWidth={1} />
      ))}
      <Rect x={0} y={c.H - 40} width={c.W} height={40} fill={ROOM_FLOOR} />
      {Array.from({ length: 9 }, (_, i) => (
        <Path key={i} d={`M${i * 44},${c.H - 40} L${i * 44 - 20},${c.H}`} stroke="#45396A" strokeWidth={1} />
      ))}
      {/* small square window */}
      <Rect x={windowX - 4} y={windowY - 4} width={60} height={56} fill={WOOD} />
      <Rect x={windowX} y={windowY} width={52} height={48} fill={lit ? '#3A3270' : '#120F24'} />
      {lit ? (
        <G>
          <Circle cx={windowX + 36} cy={windowY + 14} r={2.6} fill={STAR} />
          <Circle cx={windowX + 36} cy={windowY + 14} r={7} fill={STAR} opacity={0.25} />
        </G>
      ) : null}
      <Rect x={windowX + 25} y={windowY} width={2} height={48} fill={WOOD} />
    </G>
  );
}

function PlumTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-3,0 Q-4,-20 0,-34 Q-10,-44 -22,-48 M0,-34 Q8,-46 22,-50 M0,-34 Q2,-48 -2,-60" stroke={PLUM} strokeWidth={4} fill="none" strokeLinecap="round" />
      {[
        [-22, -48],
        [-12, -44],
        [22, -50],
        [12, -46],
        [-2, -60],
        [4, -54],
        [-8, -56],
      ].map(([bx, by], i) => (
        <Circle key={i} cx={bx} cy={by} r={3.2} fill={BLOSSOM} opacity={0.85} />
      ))}
      {/* nest */}
      <Path d="M8,-40 Q16,-32 24,-40 Z" fill="#7A5A3A" />
      <Path d="M8,-40 Q16,-36 24,-40" stroke="#5A4028" strokeWidth={1} fill="none" />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <NightSky c={c} stars={70} seed={7} />
    <SoftCloud x={70} y={170} s={1.6} />
    <SoftCloud x={300} y={164} s={1.7} light />
    <Valley c={c} y={290} seed={8} />
    <Beam x1={192} y1={160} x2={206} y2={256} w={16} opacity={0.35} />
    <House x={196} y={280} s={1.3} lit />
    <Glow c={c} name="ti" cx={190} cy={150} r={50} color={c.p.glow} opacity={0.6} />
    <Ti x={190} y={150} s={1.8} mood="effort" halo={1.1} />
    <Finish c={c} vignette={0.38} />
  </G>
);

const pages = [
  // 1 — a vast violet sky full of stars; Tí, the tiniest, looks around curiously
  (c: SceneCtx) => (
    <G>
      <NightSky c={c} stars={90} seed={11} />
      <Glow c={c} name="ti1" cx={180} cy={110} r={40} color={c.p.glow} opacity={0.4} />
      <Ti x={180} y={110} s={1.6} mood="curious" />
      <Ridge c={c} y={226} amp={16} seed={12} color={MOUNTAIN_NEAR} opacity={0.9} />
      <Finish c={c} vignette={0.38} />
    </G>
  ),
  // 2 — the round Moon lights the whole valley; Tí watches, wistful
  (c: SceneCtx) => (
    <G>
      <NightSky c={c} stars={40} seed={21} />
      <Glow c={c} name="moon" cx={130} cy={70} r={90} color={MOON} opacity={0.5} />
      <MoonDisc cx={130} cy={70} r={30} color={MOON} shade={MOON_SHADE} />
      <Path d="M120,68 Q123,65 126,68 M134,68 Q137,65 140,68 M126,78 Q130,81 134,78" stroke="#B9AE8E" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <Valley c={c} y={200} seed={22} />
      <House x={178} y={204} s={0.9} />
      <Ti x={252} y={56} s={1.1} mood="wistful" halo={0.7} />
      <Finish c={c} vignette={0.32} />
    </G>
  ),
  // 3 — thick clouds roll in and cover the Moon; the valley goes dark and still
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#140F30" bottom="#262050" />
      <Stars c={c} count={10} seed={31} color="#E8E4FF" maxY={40} opacity={0.4} />
      <Glow c={c} name="hidden" cx={150} cy={80} r={50} color={MOON} opacity={0.18} />
      <SoftCloud x={150} y={96} s={2} />
      <SoftCloud x={70} y={70} s={1.3} light />
      <SoftCloud x={270} y={84} s={1.5} light />
      <G opacity={0.6}>
        <Valley c={c} y={204} seed={32} mist={false} />
      </G>
      <House x={180} y={208} s={0.9} />
      <Finish c={c} vignette={0.45} />
    </G>
  ),
  // 4 — inside the stilt house, Lan wakes and sits up holding her blanket; the window is dark
  (c: SceneCtx) => (
    <G>
      <Room c={c} windowX={198} windowY={46} />
      <LanInBed x={86} y={206} s={1.3} pose="sit" />
      <Finish c={c} vignette={0.4} />
    </G>
  ),
  // 5 — high above, Tí finds a tiny gap in the clouds and shines as hard as a small star can
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom="#2A2258" />
      <Stars c={c} count={40} seed={51} color="#E8E4FF" maxY={90} opacity={0.6} />
      <SoftCloud x={86} y={176} s={2.2} light />
      <SoftCloud x={290} y={180} s={2.2} light />
      <SoftCloud x={180} y={232} s={2.4} />
      <Glow c={c} name="ti5" cx={182} cy={110} r={70} color={c.p.glow} opacity={0.55} />
      <Ti x={182} y={110} s={2.3} mood="effort" halo={1.2} />
      <Finish c={c} vignette={0.35} />
    </G>
  ),
  // 6 — a thin silver beam slips through the gap into Lan's window; she smiles up at it
  (c: SceneCtx) => (
    <G>
      <Room c={c} windowX={198} windowY={30} lit />
      <Beam x1={236} y1={44} x2={170} y2={170} w={26} opacity={0.35} />
      <LanInBed x={86} y={206} s={1.3} pose="sit" smile />
      <Finish c={c} vignette={0.36} />
    </G>
  ),
  // 7 — Lan settles back to sleep; outside, a mother bulbul follows the light home to her nest
  (c: SceneCtx) => (
    <G>
      <NightSky c={c} stars={40} seed={71} />
      <SoftCloud x={90} y={50} s={1.4} />
      <SoftCloud x={290} y={56} s={1.4} light />
      <Beam x1={190} y1={30} x2={212} y2={176} w={14} opacity={0.35} />
      <Valley c={c} y={214} seed={72} />
      <House x={210} y={206} s={1.2} lit />
      <PlumTree x={124} y={212} s={1.5} />
      <Circle cx={164} cy={132} r={10} fill={BEAM} opacity={0.18} />
      <Bird x={164} y={132} s={1.4} color={BULBUL} wing="down" />
      <Ti x={190} y={30} s={0.9} mood="glad" halo={0.8} />
      <Finish c={c} vignette={0.36} />
    </G>
  ),
  // 8 — all night long Tí glows softly over the sleeping valley
  (c: SceneCtx) => (
    <G>
      <NightSky c={c} stars={70} seed={81} />
      <SoftCloud x={70} y={128} s={1.2} light />
      <SoftCloud x={300} y={120} s={1.3} light />
      <Valley c={c} y={208} seed={82} />
      <House x={182} y={210} s={1} lit />
      <Glow c={c} name="ti8" cx={182} cy={74} r={56} color={c.p.glow} opacity={0.45} />
      <Ti x={182} y={74} s={1.6} mood="calm" />
      <Finish c={c} vignette={0.36} />
    </G>
  ),
];

export const NGOI_SAO_BE_TI: StoryScenes = { cover, pages };
