// Sự Tích Trầu Cau — a tender emerald legend: tall ringed areca palms in
// vertical rows, a clear jade stream over pale stones, green-gold light
// slanting through fronds. Signature: heart-shaped betel leaves on a winding
// vine, one smooth white limestone, and warm red ceremonial accents (the
// bride's áo, the lacquer tray). Transformations are soft glows and fading
// figures, never grief.

import React from 'react';
import { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import {
  Bird,
  Figure,
  Finish,
  Glow,
  Grass,
  Palm,
  Ridge,
  SceneCtx,
  Sky,
  StiltHouse,
  StoryScenes,
  gid,
  gurl,
  rng,
} from '../kit';

// ─── Characters & colours ─────────────────────────────────────

const TAN = { top: '#1E7A4C', bottom: '#155C38', hairStyle: 'short' as const, hat: 'khan' as const, hatColor: '#141414' };
const LANG = { top: '#A6D6B8', bottom: '#82B898', hairStyle: 'short' as const };
const WIFE = { top: '#C8453A', bottom: '#A2322A', hairStyle: 'braid' as const, dress: true };
const KING = {
  top: '#E3B23C',
  bottom: '#C69428',
  hair: '#D8D4CC',
  hairStyle: 'short' as const,
  hat: 'crown' as const,
  hatColor: '#C88A22',
  beard: '#ECE8E0',
  dress: true,
};
const ATTEND = { top: '#2F6A6A', bottom: '#245050', hairStyle: 'topknot' as const, hat: 'khan' as const, hatColor: '#7A1E1A' };
const NEIGH_A = { top: '#C9A46A', bottom: '#8A6A3A', hairStyle: 'bun' as const, dress: true };
const NEIGH_B = { top: '#6E5A8A', bottom: '#4E3E66', hat: 'nonla' as const, hatColor: '#E6D8A4' };
const GROOM = { top: '#2A4C8A', bottom: '#1E3666', hairStyle: 'short' as const, hat: 'khan' as const, hatColor: '#C2362F' };
const BRIDE = { top: '#D23A30', bottom: '#A82A24', hairStyle: 'long' as const, hat: 'khan' as const, hatColor: '#E2B64B', dress: true };
const ELDER_M = { top: '#5A4A7A', bottom: '#3E3258', hair: '#D2CEC6', hairStyle: 'bun' as const, dress: true };
const ELDER_F = { top: '#3E5A46', bottom: '#2C4232', hair: '#D2CEC6', hairStyle: 'short' as const, hat: 'khan' as const, hatColor: '#1A1A1A', beard: '#E2DED6', dress: true };

const TRUNK = '#B3A98A';
const TRUNK_RING = '#E2DCC4';
const CROWN = '#7DB25A';
const FROND = '#2F8A50';
const FROND_LIGHT = '#57A866';
const NUT = '#E39A3A';
const NUT_GREEN = '#9CBF4A';
const BETEL = '#3F9A4A';
const BETEL_LIGHT = '#79C26A';
const STONE = '#F3F1E7';
const STONE_SHADE = '#D6D6C8';
const RED = '#C2362F';
const RED_DEEP = '#8E2622';
const GOLD = '#E2B64B';
const WOOD = '#A9784A';
const WOOD_DARK = '#6E4A2E';
const HILL_FAR = '#A9CFA4';
const HILL_MID = '#6FA67C';

// ─── Local helpers ────────────────────────────────────────────

/** Tall, ringed areca palm with arching fronds and nut clusters. (x, y) = base. */
function Areca({ x, y, h = 150, lean = 0, nuts = true, unfurl = 1, opacity = 1 }: { x: number; y: number; h?: number; lean?: number; nuts?: boolean; unfurl?: number; opacity?: number }) {
  const cx = x + lean * 0.4;
  const cy = y - h / 2;
  const tx = x + lean;
  const ty = y - h;
  const rings = Math.floor(h / 9);
  const top = ty - 12;
  return (
    <G opacity={opacity}>
      <Path d={`M${x - 2.6},${y} Q${cx - 1.6},${cy} ${tx - 1.6},${ty} L${tx + 1.6},${ty} Q${cx + 2},${cy} ${x + 2.8},${y} Z`} fill={TRUNK} />
      {Array.from({ length: rings }, (_, i) => {
        const t = (i + 1) / (rings + 1);
        const px = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * cx + t * t * tx;
        const py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * cy + t * t * ty;
        return <Rect key={i} x={px - 2.4} y={py} width={4.8} height={1} fill={TRUNK_RING} opacity={0.8} />;
      })}
      <Ellipse cx={tx} cy={ty - 6} rx={3.2} ry={9} fill={CROWN} />
      {[-172, -150, -128, -104, -76, -52, -30, -8].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const L = (30 + (i % 3) * 4) * unfurl;
        const ex = tx + Math.cos(a) * L;
        const ey = top + Math.sin(a) * L * 0.5 + 10 * unfurl;
        const mx = (tx + ex) / 2;
        const my = Math.min(top, ey) - 10 * unfurl;
        return (
          <G key={i}>
            <Path d={`M${tx},${top} Q${mx},${my} ${ex},${ey} Q${mx},${my + 6} ${tx},${top} Z`} fill={i % 2 ? FROND : FROND_LIGHT} />
            <Path d={`M${tx},${top} Q${mx},${my + 2} ${ex},${ey}`} stroke="#1F5A3C" strokeWidth={0.6} fill="none" opacity={0.5} />
          </G>
        );
      })}
      {nuts ? (
        <G>
          <Path d={`M${tx},${ty} q-4,4 -7,10 M${tx},${ty} q4,4 6,10`} stroke="#C8B070" strokeWidth={0.9} fill="none" />
          {[
            [-7, 10, NUT],
            [-4, 13, NUT_GREEN],
            [-9, 14, NUT],
            [5, 10, NUT_GREEN],
            [7, 14, NUT],
            [3, 14, NUT],
          ].map(([dx, dy, col], i) => (
            <Circle key={i} cx={tx + (dx as number)} cy={ty + (dy as number)} r={2.1} fill={col as string} />
          ))}
        </G>
      ) : null}
    </G>
  );
}

/** Heart-shaped betel leaf, tip at (0, 12) before rotation. (x, y) = stalk. */
function HeartLeaf({ x, y, s = 1, rot = 0, color = BETEL }: { x: number; y: number; s?: number; rot?: number; color?: string }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Path d="M0,0 C-3,-3 -8,-2 -8,3 C-8,7 -3,10 0,13 C3,10 8,7 8,3 C8,-2 3,-3 0,0 Z" fill={color} />
      <Path d="M0,0 L0,11 M0,5 l-3,-2 M0,5 l3,-2" stroke={BETEL_LIGHT} strokeWidth={0.7} fill="none" opacity={0.8} />
    </G>
  );
}

/** Betel vine winding up a straight trunk at x from y, `h` tall. */
function BetelVine({ x, y, h, turns = 3.5, w = 6, progress = 1, s = 1 }: { x: number; y: number; h: number; turns?: number; w?: number; progress?: number; s?: number }) {
  const steps = Math.max(4, Math.floor(28 * progress));
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const t = (i / steps) * progress;
    return [x + Math.sin(t * turns * Math.PI * 2) * w, y - t * h] as [number, number];
  });
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i][1]}`;
  const leaves = Math.floor(10 * progress);
  return (
    <G>
      <Path d={d} stroke="#4F7A34" strokeWidth={1.6 * s} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {Array.from({ length: leaves }, (_, i) => {
        const t = ((i + 0.6) / 10) * 1;
        const side = i % 2 ? 1 : -1;
        const lx = x + Math.sin(t * turns * Math.PI * 2) * w;
        const ly = y - t * h;
        return <HeartLeaf key={i} x={lx} y={ly} s={(0.8 + (i % 3) * 0.12) * s} rot={side * 70 - 10} color={i % 3 === 1 ? BETEL_LIGHT : BETEL} />;
      })}
    </G>
  );
}

/** Smooth white limestone. (x, y) = base centre. */
function WhiteStone({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={1} rx={22} ry={3.4} fill="#14301F" opacity={0.16} />
      <Path d="M-20,0 Q-22,-14 -10,-20 Q2,-26 14,-19 Q23,-12 20,0 Z" fill={STONE} />
      <Path d="M-20,0 Q-8,-5 20,0 Q12,-8 18,-12 Q20,-4 20,0 Z" fill={STONE_SHADE} opacity={0.8} />
      <Path d="M-12,-15 Q-4,-21 6,-20" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" fill="none" />
    </G>
  );
}

/** Clear stream band across the canvas with pale stones on its banks. */
function Stream({ c, y, h, name = 'stream', seed = 31 }: { c: SceneCtx; y: number; h: number; name?: string; seed?: number }) {
  const r = rng(seed);
  const W = c.W;
  return (
    <G>
      <Defs>
        <LinearGradient id={gid(c, name)} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#C4E6DA" />
          <Stop offset="1" stopColor="#78BCAA" />
        </LinearGradient>
      </Defs>
      <Path
        d={`M-20,${y} Q${W * 0.3},${y - 6} ${W * 0.55},${y + 2} T${W + 20},${y} L${W + 20},${y + h} Q${W * 0.6},${y + h + 6} ${W * 0.35},${y + h - 2} T-20,${y + h} Z`}
        fill={gurl(c, name)}
      />
      {Array.from({ length: 12 }, (_, i) => {
        const fx = r() * W;
        const fy = y + 5 + r() * (h - 10);
        return <Path key={i} d={`M${fx},${fy} q6,-3 12,0 q6,3 12,0`} stroke="#FFFFFF" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.45 + r() * 0.4} />;
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const bank = i % 2 ? y : y + h;
        return <Ellipse key={i} cx={r() * W} cy={bank + (r() - 0.5) * 4} rx={5 + r() * 6} ry={2.4 + r() * 2} fill={i % 3 ? '#E4E4D6' : '#CFD3C2'} />;
      })}
    </G>
  );
}

/** Red lacquer tray with folded betel quids and areca slices. (x, y) = centre. */
function RedTray({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={6} rx={26} ry={5} fill="#14301F" opacity={0.18} />
      <Path d="M-24,0 L-20,6 L20,6 L24,0 Z" fill={RED_DEEP} />
      <Ellipse cx={0} cy={0} rx={24} ry={7} fill={RED} />
      <Ellipse cx={0} cy={0} rx={24} ry={7} fill="none" stroke={GOLD} strokeWidth={1.2} />
      <Ellipse cx={0} cy={-0.5} rx={18} ry={4.6} fill="#D2483E" />
      {[-12, -6, 0, 6, 12].map((qx, i) => (
        <G key={qx} transform={`translate(${qx},${-2 - (i % 2)})`}>
          <Path d="M0,-7 L4.6,2 Q0,4 -4.6,2 Z" fill={i % 2 ? BETEL_LIGHT : BETEL} />
          <Path d="M0,-6 L0,2" stroke="#2E6E36" strokeWidth={0.6} />
        </G>
      ))}
      {[-9, 3, 14].map((nx) => (
        <G key={nx}>
          <Ellipse cx={nx} cy={3} rx={3.2} ry={2} fill="#EED6A2" />
          <Ellipse cx={nx} cy={3} rx={1.4} ry={0.9} fill="#B5652E" />
        </G>
      ))}
    </G>
  );
}

/** A single folded betel quid (miếng trầu). (x, y) = centre. */
function Quid({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M0,-7 L5,3 Q0,5 -5,3 Z" fill={BETEL} />
      <Ellipse cx={0} cy={2} rx={2.4} ry={1.4} fill="#EED6A2" />
      <Circle cx={0} cy={2} r={0.8} fill={RED} />
    </G>
  );
}

/** Red sash across a figure's chest for the groom. (x, y, s) match the Figure. */
function Sash({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  const k = flip ? -1 : 1;
  return <Path d={`M${x - 7 * s * k},${y - 39 * s} L${x + 8 * s * k},${y - 20 * s}`} stroke={RED} strokeWidth={3 * s} strokeLinecap="round" />;
}

/** Puzzled question mark. (x, y) = dot. */
function Puzzle({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <G>
      <Path d={`M${x - 3},${y - 9} Q${x - 3},${y - 13} ${x},${y - 13} Q${x + 3.4},${y - 13} ${x + 3.4},${y - 10} Q${x + 3.4},${y - 7.5} ${x},${y - 6} L${x},${y - 3.5}`} stroke={color} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Circle cx={x} cy={y} r={1} fill={color} />
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

/** Slanting shafts of green-gold light through the fronds. */
function Rays({ c, xs, color, opacity = 0.16 }: { c: SceneCtx; xs: number[]; color: string; opacity?: number }) {
  return (
    <G opacity={opacity}>
      {xs.map((x) => (
        <Path key={x} d={`M${x},-4 L${x + 18},-4 L${x + 70},${c.H + 4} L${x + 36},${c.H + 4} Z`} fill={color} />
      ))}
    </G>
  );
}

/** Royal parasol (lọng) held on a pole. (x, y) = pole base. */
function Parasol({ x, y, h = 70 }: { x: number; y: number; h?: number }) {
  return (
    <G>
      <Path d={`M${x},${y} L${x},${y - h}`} stroke={WOOD_DARK} strokeWidth={1.6} />
      <Path d={`M${x - 20},${y - h + 6} Q${x},${y - h - 14} ${x + 20},${y - h + 6} Q${x},${y - h + 2} ${x - 20},${y - h + 6} Z`} fill={GOLD} />
      {[-14, -7, 0, 7, 14].map((fx) => (
        <Path key={fx} d={`M${x + fx},${y - h + 4} l0,5`} stroke={RED} strokeWidth={1.6} strokeLinecap="round" />
      ))}
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top={c.p.sky} mid="#E2EBC8" bottom={c.p.skyLow} />
    <Glow c={c} name="light" cx={210} cy={70} r={170} color={c.p.glow} opacity={0.85} />
    <Ridge c={c} y={190} amp={34} seed={6} color={HILL_FAR} />
    <Ridge c={c} y={214} amp={22} seed={9} color={HILL_MID} />
    <Palm x={42} y={226} s={1.1} trunk={TRUNK} leaf={HILL_MID} />
    <Palm x={318} y={222} s={1.2} trunk={TRUNK} leaf={HILL_MID} lean={-4} />
    <Areca x={74} y={262} h={180} lean={-6} />
    <Areca x={300} y={258} h={168} lean={8} />
    <Rect x={0} y={236} width={c.W} height={126} fill={c.p.ground} />
    <Stream c={c} y={276} h={46} seed={12} />
    <Rays c={c} xs={[120, 200, 250]} color={c.p.glow} />
    <Glow c={c} name="heart" cx={186} cy={180} r={110} color={c.p.glow} opacity={0.7} />
    <Areca x={186} y={262} h={214} lean={4} />
    <BetelVine x={187} y={262} h={150} turns={4} w={6} />
    <WhiteStone x={158} y={268} s={1.3} />
    <RedTray x={236} y={284} s={1.55} />
    <Sparkle x={130} y={150} r={4} color="#FFFFFF" />
    <Sparkle x={244} y={120} r={3} color="#FFFFFF" />
    <Sparkle x={112} y={300} r={2.6} color="#FFFFFF" />
    <Bird x={262} y={96} s={0.8} color={c.p.groundDeep} />
    <Grass c={c} y={240} seed={8} color={c.p.groundDeep} count={10} />
    <Finish c={c} vignette={0.24} />
  </G>
);

const pages = [
  // 1 — the look-alike brothers stroll under the areca palms; neighbours wave, puzzled
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="light" cx={180} cy={40} r={130} color={c.p.glow} opacity={0.7} />
      <Ridge c={c} y={130} amp={20} seed={3} color={HILL_FAR} />
      <StiltHouse x={300} y={156} s={0.8} wood={WOOD} roof="#7A6A44" dark={WOOD_DARK} />
      <Rect x={0} y={150} width={c.W} height={92} fill={c.p.ground} />
      <Path d="M-20,206 Q120,186 220,192 Q300,196 380,186 L380,206 Q300,214 220,210 Q120,206 -20,226 Z" fill="#D9CC9E" />
      {[34, 112, 190, 268, 340].map((px, i) => (
        <Areca key={px} x={px} y={170 + (i % 2) * 6} h={148 + (i % 3) * 10} lean={(i % 2 ? -1 : 1) * 4} nuts={i % 2 === 0} />
      ))}
      <Rays c={c} xs={[60, 160, 240]} color={c.p.glow} opacity={0.14} />
      <Figure x={66} y={212} s={0.95} {...NEIGH_A} pose="wave" />
      <Figure x={100} y={208} s={0.92} {...NEIGH_B} pose="out" />
      <Puzzle x={66} y={140} color={c.p.ink} />
      <Puzzle x={104} y={130} color={c.p.ink} />
      <Figure x={200} y={212} s={1.08} {...TAN} pose="down" />
      <Figure x={230} y={210} s={1.08} {...LANG} pose="down" />
      <Bird x={240} y={60} s={0.7} color={c.p.groundDeep} />
      <Grass c={c} y={200} seed={5} color={c.p.groundDeep} count={10} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 2 — a simple wedding at the stilt house; Lang stands a little apart at the edge
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="light" cx={170} cy={50} r={130} color={c.p.glow} opacity={0.75} />
      <Ridge c={c} y={120} amp={18} seed={5} color={HILL_FAR} />
      <Areca x={40} y={172} h={150} lean={-4} />
      <Areca x={262} y={168} h={140} lean={5} nuts={false} />
      <Rect x={0} y={164} width={c.W} height={78} fill={c.p.ground} />
      <StiltHouse x={156} y={170} s={1.7} wood={WOOD} roof="#7A6A44" dark={WOOD_DARK} />
      {[110, 132, 180, 202].map((bx, i) => (
        <Path key={bx} d={`M${bx},${116 + (i % 2) * 2} l5,0 l-2.5,10 Z`} fill={i % 2 ? GOLD : RED} />
      ))}
      <Path d="M100,116 Q156,124 212,116" stroke={RED_DEEP} strokeWidth={1} fill="none" />
      <Rect x={60} y={196} width={190} height={16} rx={4} fill="#C9B47A" opacity={0.7} />
      <RedTray x={84} y={200} s={0.75} />
      <Glow c={c} name="couple" cx={162} cy={170} r={58} color={c.p.glow} opacity={0.6} />
      <Figure x={148} y={214} s={1.1} {...TAN} pose="hold" />
      <Sash x={148} y={214} s={1.1} />
      <Figure x={178} y={214} s={1.04} {...WIFE} pose="hold" flip />
      <Figure x={224} y={210} s={0.85} {...NEIGH_A} pose="wave" flip />
      <Figure x={322} y={212} s={1.02} {...LANG} pose="down" flip />
      <Grass c={c} y={204} seed={7} color={c.p.groundDeep} count={10} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 3 — golden late afternoon: the wife greets Lang by mistake; Tân looks surprised behind
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#E8CC94" mid="#F1DDB0" bottom={c.p.skyLow} />
      <Glow c={c} name="dusk" cx={300} cy={110} r={140} color={c.p.glow} opacity={0.85} />
      <Ridge c={c} y={132} amp={18} seed={11} color="#B7C79A" />
      <Areca x={330} y={170} h={140} lean={-5} />
      <Rect x={0} y={164} width={c.W} height={78} fill={c.p.ground} />
      <StiltHouse x={92} y={176} s={1.8} wood={WOOD} roof="#7A6A44" dark={WOOD_DARK} />
      <Glow c={c} name="door" cx={92} cy={130} r={30} color={c.p.glow} opacity={0.9} />
      <Path d="M140,148 L156,180 M148,148 L164,180" stroke={WOOD_DARK} strokeWidth={1.6} />
      {[154, 162, 170].map((ry, i) => (
        <Path key={ry} d={`M${143 + i * 4},${ry} l8,0`} stroke={WOOD_DARK} strokeWidth={1.4} />
      ))}
      <Figure x={166} y={210} s={0.98} {...TAN} pose="out" />
      <Figure x={196} y={214} s={1.04} {...WIFE} pose="out" />
      <Figure x={236} y={214} s={1.08} {...LANG} pose="down" flip />
      <Path d="M160,138 l-2,-6 M166,136 l0,-7 M172,138 l2,-6" stroke={c.p.accent} strokeWidth={1.4} strokeLinecap="round" />
      <Bird x={268} y={70} s={0.7} color={c.p.groundDeep} wing="down" />
      <Grass c={c} y={204} seed={13} color={c.p.groundDeep} count={8} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 4 — by the wide clear stream, Lang softly becomes a smooth white stone
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="light" cx={200} cy={50} r={120} color={c.p.glow} opacity={0.7} />
      <Ridge c={c} y={100} amp={22} seed={14} color={HILL_FAR} />
      <Ridge c={c} y={120} amp={12} seed={15} color={HILL_MID} />
      <StiltHouse x={60} y={110} s={0.42} wood={WOOD} roof="#7A6A44" dark={WOOD_DARK} />
      <Palm x={78} y={114} s={0.5} trunk={TRUNK} leaf={FROND} />
      <Rect x={0} y={118} width={c.W} height={20} fill={c.p.ground} />
      <Stream c={c} y={134} h={62} seed={21} />
      <Path d="M-20,250 L-20,200 Q120,186 240,194 Q320,198 380,190 L380,250 Z" fill={c.p.ground} />
      <Areca x={318} y={206} h={180} lean={-6} />
      <Glow c={c} name="stone" cx={186} cy={196} r={70} color={c.p.glow} opacity={0.95} />
      <WhiteStone x={186} y={218} s={1.3} />
      <G opacity={0.5}>
        <Figure x={186} y={216} s={1.05} {...LANG} pose="hold" sitting flip />
      </G>
      <Sparkle x={168} y={150} r={3.4} color="#FFFFFF" />
      <Sparkle x={206} y={140} r={2.6} color="#FFFFFF" />
      <Sparkle x={196} y={120} r={2} color="#FFFFFF" />
      <Sparkle x={160} y={176} r={2} color="#FFFFFF" />
      <Grass c={c} y={204} seed={17} color={c.p.groundDeep} count={10} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 5 — Tân beside the white stone rises softly into a tall areca palm
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#D6EAD0" bottom={c.p.skyLow} />
      <Glow c={c} name="light" cx={200} cy={40} r={140} color={c.p.glow} opacity={0.8} />
      <Ridge c={c} y={110} amp={16} seed={18} color={HILL_FAR} />
      <Stream c={c} y={128} h={60} seed={23} />
      <Path d="M-20,250 L-20,196 Q140,182 260,190 Q320,194 380,186 L380,250 Z" fill={c.p.ground} />
      <Glow c={c} name="rise" cx={200} cy={110} r={110} color={c.p.glow} opacity={0.95} />
      <Areca x={202} y={214} h={190} lean={2} unfurl={0.85} />
      <G opacity={0.4}>
        <Figure x={204} y={214} s={1.1} {...TAN} pose="up" />
      </G>
      <WhiteStone x={164} y={218} s={1.3} />
      {[
        [182, 160, 3.4],
        [222, 140, 2.6],
        [190, 100, 2.4],
        [216, 70, 3],
        [178, 50, 2],
      ].map(([sx, sy, sr], i) => (
        <Sparkle key={i} x={sx} y={sy} r={sr} color="#FFFFFF" />
      ))}
      <Bird x={290} y={60} s={0.7} color={c.p.groundDeep} />
      <Grass c={c} y={204} seed={19} color={c.p.groundDeep} count={10} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 6 — the young wife reaches the palm and becomes a heart-leaved betel vine
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="light" cx={160} cy={40} r={130} color={c.p.glow} opacity={0.75} />
      <Ridge c={c} y={108} amp={18} seed={24} color={HILL_FAR} />
      <Stream c={c} y={128} h={58} seed={25} />
      <Path d="M-20,250 L-20,194 Q120,182 240,190 Q320,194 380,184 L380,250 Z" fill={c.p.ground} />
      <Areca x={62} y={196} h={150} lean={-5} nuts={false} />
      <Glow c={c} name="vine" cx={180} cy={150} r={90} color={c.p.glow} opacity={0.9} />
      <Areca x={180} y={214} h={196} lean={0} />
      <BetelVine x={180} y={214} h={160} turns={4} w={6} progress={0.65} />
      <WhiteStone x={146} y={218} s={1.2} />
      <G opacity={0.45}>
        <Figure x={196} y={214} s={1.05} {...WIFE} pose="out" flip />
      </G>
      <HeartLeaf x={214} y={150} s={0.9} rot={30} color={BETEL_LIGHT} />
      <HeartLeaf x={226} y={130} s={0.7} rot={-20} color={BETEL} />
      <Sparkle x={210} y={170} r={3} color="#FFFFFF" />
      <Sparkle x={156} y={120} r={2.6} color="#FFFFFF" />
      <Sparkle x={200} y={96} r={2.2} color="#FFFFFF" />
      <Grass c={c} y={204} seed={26} color={c.p.groundDeep} count={10} />
      <Finish c={c} vignette={0.2} />
    </G>
  ),
  // 7 — the kindly king with attendants folds a quid that glows warm red in his hand
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="light" cx={220} cy={40} r={130} color={c.p.glow} opacity={0.7} />
      <Ridge c={c} y={116} amp={18} seed={27} color={HILL_FAR} />
      <Stream c={c} y={136} h={36} seed={28} />
      <Path d="M-20,250 L-20,176 Q140,166 260,172 Q320,176 380,168 L380,250 Z" fill={c.p.ground} />
      <Areca x={96} y={212} h={200} lean={-3} />
      <BetelVine x={96} y={212} h={170} turns={4.5} w={6} />
      <WhiteStone x={66} y={216} s={1.2} />
      <Parasol x={292} y={210} h={84} />
      <Figure x={266} y={210} s={0.98} {...ATTEND} pose="down" flip />
      <Figure x={296} y={212} s={0.98} {...ATTEND} pose="hold" flip />
      <Figure x={206} y={214} s={1.12} {...KING} pose="hold" flip />
      <Glow c={c} name="red" cx={194} cy={182} r={30} color="#E8564A" opacity={0.85} />
      <Quid x={195} y={182} s={1.1} />
      <Sparkle x={182} y={166} r={2.4} color="#FFE2D8" />
      <Sparkle x={208} y={170} r={2} color="#FFE2D8" />
      <Grass c={c} y={200} seed={29} color={c.p.groundDeep} count={10} />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
  // 8 — a wedding today: the red tray offered between two smiling families
  (c: SceneCtx) => (
    <G>
      <Rect x={0} y={0} width={c.W} height={c.H} fill="#E9DCC0" />
      {[
        [24, 108],
        [228, 108],
      ].map(([ox, ow]) => (
        <G key={ox}>
          <Rect x={ox} y={30} width={ow} height={110} fill={c.p.sky} />
          <Rect x={ox} y={110} width={ow} height={30} fill={HILL_MID} />
          <Areca x={ox + ow * 0.3} y={140} h={104} lean={-2} />
          <Areca x={ox + ow * 0.75} y={140} h={92} lean={3} nuts={false} />
        </G>
      ))}
      {[18, 132, 222, 336].map((px) => (
        <Rect key={px} x={px} y={22} width={8} height={150} fill={WOOD_DARK} />
      ))}
      <Rect x={136} y={30} width={88} height={110} fill={RED} />
      <Circle cx={180} cy={80} r={22} fill="none" stroke={GOLD} strokeWidth={2.4} />
      <Circle cx={180} cy={80} r={14} fill="none" stroke={GOLD} strokeWidth={1.4} />
      <Rect x={0} y={14} width={c.W} height={10} fill={WOOD} />
      <Path d="M0,24 Q90,40 180,24 Q270,40 360,24 L360,30 Q270,46 180,30 Q90,46 0,30 Z" fill={RED} />
      <Rect x={0} y={170} width={c.W} height={72} fill="#C9A46A" />
      <Rect x={0} y={170} width={c.W} height={3} fill={WOOD} />
      <Rect x={146} y={186} width={68} height={8} rx={2} fill={RED_DEEP} />
      <Rect x={152} y={194} width={5} height={18} fill={RED_DEEP} />
      <Rect x={203} y={194} width={5} height={18} fill={RED_DEEP} />
      <Glow c={c} name="tray" cx={180} cy={176} r={44} color={c.p.glow} opacity={0.8} />
      <RedTray x={180} y={180} s={1.25} />
      <Figure x={66} y={214} s={1} {...ELDER_M} pose="down" />
      <Figure x={112} y={214} s={1.08} {...GROOM} pose="out" />
      <Figure x={248} y={214} s={1.06} {...BRIDE} pose="out" flip />
      <Figure x={294} y={214} s={1.02} {...ELDER_F} pose="down" flip />
      <Sparkle x={160} y={150} r={2.6} color="#FFFFFF" />
      <Sparkle x={204} y={146} r={2} color="#FFFFFF" />
      <Finish c={c} vignette={0.22} />
    </G>
  ),
];

export const SU_TICH_TRAU_CAU: StoryScenes = { cover, pages };
