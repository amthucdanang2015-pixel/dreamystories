// Sư Tử và Chuột — warm, sunlit and kind: big-and-small humour on a golden
// savanna. Signature: hazy amber skies, one wide flat-topped acacia, tall
// swaying golden grass, an oversized cuddly lion with a fluffy russet mane
// (never fierce: no bared teeth or claws), a tiny grey-brown mouse with huge
// pink ears, and a knotted rope net that the mouse nibbles open. No hunter.

import React from 'react';
import { Circle, Ellipse, G, Path } from 'react-native-svg';
import { Bird, Finish, Glow, Ridge, SceneCtx, Sky, StoryScenes, Sun, rng } from '../kit';

// ─── Characters & colours ─────────────────────────────────────

const LION = '#E3A94A';
const LION_LIGHT = '#F4D08A';
const LION_SHADE = '#C88A34';
const MUZZLE = '#FBE7BE';
const NOSE = '#8A4A3A';
const MOUTH = '#7A3A2A';
const MANE = '#A8532A';
const MANE_DEEP = '#86401F';
const MANE_LIGHT = '#C66E38';
const EYE = '#3A2414';
const BLUSH = '#F0957A';
const MOUSE = '#8E8070';
const MOUSE_DEEP = '#6E6254';
const MOUSE_LIGHT = '#BDB09E';
const EAR_PINK = '#F2A6A6';
const TAIL_PINK = '#C99A92';
const ACACIA = '#6F7A36';
const ACACIA_LIGHT = '#8E9A48';
const ACACIA_DARK = '#55602A';
const BARK = '#5E3E26';
const ROPE = '#C9A26A';
const ROPE_DARK = '#94703F';
const GRASS_GOLD = '#E7B95A';
const GRASS_DEEP = '#B9853A';
const ROCK = '#C9A274';
const SHADOW = '#7A4A1E';

// ─── Local helpers ────────────────────────────────────────────

type LionEyes = 'open' | 'half' | 'closed';
type LionMouth = 'smile' | 'chuckle' | 'roar';
type LionPaw = 'down' | 'hover' | 'up';

/**
 * The lion, lying sphinx-like and facing right. (x, y) = ground under his chest;
 * s = 1 spans ~175 units nose-to-tail tuft and ~85 units tall.
 * `tilt` rotates the head (negative = looking up).
 */
function Lion({
  x,
  y,
  s = 1,
  flip = false,
  eyes = 'half',
  mouth = 'smile',
  paw = 'down',
  tilt = 0,
  brows = false,
}: {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  eyes?: LionEyes;
  mouth?: LionMouth;
  paw?: LionPaw;
  tilt?: number;
  brows?: boolean;
}) {
  const eye = (ex: number) =>
    eyes === 'open' ? (
      <G key={ex}>
        <Circle cx={ex} cy={-47} r={3.2} fill={EYE} />
        <Circle cx={ex + 1.1} cy={-48.2} r={1.1} fill="#FFFFFF" />
      </G>
    ) : eyes === 'half' ? (
      <G key={ex}>
        <Path d={`M${ex - 3.4},-47 Q${ex},-43 ${ex + 3.4},-47 Z`} fill={EYE} />
        <Path d={`M${ex - 3.8},-47.2 Q${ex},-48.6 ${ex + 3.8},-47.2`} stroke={EYE} strokeWidth={1.3} fill="none" strokeLinecap="round" />
      </G>
    ) : (
      <Path key={ex} d={`M${ex - 3.6},-47.5 Q${ex},-43.6 ${ex + 3.6},-47.5`} stroke={EYE} strokeWidth={1.6} fill="none" strokeLinecap="round" />
    );
  const maneR = rng(41);
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {/* long soft afternoon shadow */}
      <Ellipse cx={-4} cy={1} rx={104} ry={6.5} fill={SHADOW} opacity={0.2} />
      {/* tail with russet tuft */}
      <Path d="M-66,-16 C-90,-20 -96,-2 -112,-7" stroke={LION} strokeWidth={4.4} fill="none" strokeLinecap="round" />
      <Ellipse cx={-114} cy={-8} rx={7.5} ry={5.4} fill={MANE} />
      {/* haunch, body, back paw */}
      <Ellipse cx={-52} cy={-24} rx={30} ry={24} fill={LION} />
      <Ellipse cx={-18} cy={-24} rx={56} ry={24} fill={LION} />
      <Ellipse cx={-24} cy={-39} rx={40} ry={6.5} fill={LION_LIGHT} opacity={0.55} />
      <Path d="M-72,-12 Q-64,-44 -36,-40" stroke={LION_SHADE} strokeWidth={2} fill="none" opacity={0.5} />
      <Path d="M-60,-6 Q-20,0 12,-6" stroke={LION_SHADE} strokeWidth={1.6} fill="none" opacity={0.5} />
      <Ellipse cx={-36} cy={-5} rx={18} ry={6.5} fill={LION} />
      <Path d="M-22,-8 l0,4 M-26,-9 l0,4" stroke={LION_SHADE} strokeWidth={1.1} strokeLinecap="round" />
      {/* far front paw */}
      <Path d="M8,-22 L32,-8" stroke={LION_SHADE} strokeWidth={13} strokeLinecap="round" />
      <Ellipse cx={38} cy={-5.5} rx={13} ry={6} fill={LION_SHADE} />
      {/* head */}
      <G transform={`rotate(${tilt} 30 -44)`}>
        {/* fluffy russet mane */}
        <Circle cx={32} cy={-46} r={30} fill={MANE} />
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return (
            <Circle
              key={i}
              cx={32 + Math.cos(a) * 27}
              cy={-46 + Math.sin(a) * 25}
              r={11 + maneR() * 2}
              fill={i % 2 ? MANE_DEEP : MANE}
            />
          );
        })}
        {[[12, -62], [50, -66], [8, -36], [56, -40], [30, -72]].map(([mx, my], i) => (
          <Ellipse key={i} cx={mx} cy={my} rx={6} ry={3.4} fill={MANE_LIGHT} opacity={0.7} transform={`rotate(${i * 40} ${mx} ${my})`} />
        ))}
        <Circle cx={18} cy={-65} r={7} fill={LION} />
        <Circle cx={18} cy={-65} r={3.6} fill={LION_SHADE} />
        <Circle cx={46} cy={-65} r={7} fill={LION} />
        <Circle cx={46} cy={-65} r={3.6} fill={LION_SHADE} />
        <Ellipse cx={32} cy={-44} rx={20} ry={19} fill={LION} />
        <Ellipse cx={32} cy={-55} rx={10} ry={4.6} fill={LION_LIGHT} opacity={0.6} />
        {eye(24)}
        {eye(40)}
        {brows ? (
          <G>
            <Path d="M19,-52 L27,-55.5" stroke={MANE_DEEP} strokeWidth={1.8} strokeLinecap="round" />
            <Path d="M37,-55.5 L45,-52" stroke={MANE_DEEP} strokeWidth={1.8} strokeLinecap="round" />
          </G>
        ) : null}
        <Circle cx={18.5} cy={-38} r={3.2} fill={BLUSH} opacity={0.4} />
        <Circle cx={45.5} cy={-38} r={3.2} fill={BLUSH} opacity={0.4} />
        {/* soft muzzle */}
        <Ellipse cx={27} cy={-34} rx={8} ry={6.5} fill={MUZZLE} />
        <Ellipse cx={37} cy={-34} rx={8} ry={6.5} fill={MUZZLE} />
        <Ellipse cx={32} cy={-28.5} rx={6} ry={4} fill={MUZZLE} />
        {[[25, -34], [23, -31.5], [39, -34], [41, -31.5]].map(([dx, dy], i) => (
          <Circle key={i} cx={dx} cy={dy} r={0.7} fill={LION_SHADE} />
        ))}
        {mouth === 'smile' ? (
          <Path d="M32,-35.5 L32,-33 M28,-33 Q30,-31 32,-33 Q34,-31 36,-33" stroke={NOSE} strokeWidth={1.3} fill="none" strokeLinecap="round" />
        ) : mouth === 'chuckle' ? (
          <G>
            <Path d="M27,-33.5 Q32,-24.5 37,-33.5 Q32,-32 27,-33.5 Z" fill={MOUTH} />
            <Ellipse cx={32} cy={-29.2} rx={2.6} ry={1.5} fill="#E98A80" />
          </G>
        ) : (
          <G>
            <Ellipse cx={32} cy={-29.5} rx={4.2} ry={5.2} fill={MOUTH} />
            <Ellipse cx={32} cy={-26.8} rx={2.4} ry={1.4} fill="#E98A80" />
          </G>
        )}
        <Path d="M27,-41 Q32,-43 37,-41 Q34,-36 32,-35.5 Q30,-36 27,-41 Z" fill={NOSE} />
      </G>
      {/* near front leg and big soft paw (no claws) */}
      {paw === 'down' ? (
        <G>
          <Path d="M16,-22 L44,-8" stroke={LION} strokeWidth={15} strokeLinecap="round" />
          <Ellipse cx={50} cy={-6.5} rx={15} ry={7.5} fill={LION} />
          <Path d="M58,-11 l0,4.5 M53.5,-12.5 l0,4.5 M62,-9 l0,3.5" stroke={LION_SHADE} strokeWidth={1.2} strokeLinecap="round" />
        </G>
      ) : paw === 'hover' ? (
        <G>
          <Path d="M16,-24 L50,-21" stroke={LION} strokeWidth={15} strokeLinecap="round" />
          <Ellipse cx={58} cy={-21} rx={15} ry={7.5} fill={LION} transform="rotate(-6 58 -21)" />
          <Path d="M66,-25 l0,4.5 M61.5,-27 l0,4.5 M70,-23 l0,3.5" stroke={LION_SHADE} strokeWidth={1.2} strokeLinecap="round" />
        </G>
      ) : (
        <G>
          <Path d="M16,-26 L42,-44" stroke={LION} strokeWidth={15} strokeLinecap="round" />
          <Ellipse cx={48} cy={-51} rx={13} ry={8} fill={LION} transform="rotate(-58 48 -51)" />
          <Ellipse cx={51} cy={-53} rx={6.5} ry={4.6} fill={MUZZLE} transform="rotate(-58 51 -53)" />
          {[[54, -61], [58.5, -56.5], [59.5, -50]].map(([bx, by], i) => (
            <Circle key={i} cx={bx} cy={by} r={2} fill={MUZZLE} />
          ))}
        </G>
      )}
    </G>
  );
}

type MousePose = 'stand' | 'run' | 'nibble' | 'plead' | 'cheer';

/** The brave little mouse, facing right. (x, y) = feet; upright s = 1 is ~30 units tall. */
function Mouse({ x, y, s = 1, flip = false, pose = 'stand' }: { x: number; y: number; s?: number; flip?: boolean; pose?: MousePose }) {
  const upright = pose === 'plead' || pose === 'cheer';
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {upright ? (
        <G>
          <Path d="M-3,-2 C-12,0 -16,-8 -12,-12 C-9,-15 -6,-11 -9,-9.5" stroke={TAIL_PINK} strokeWidth={1.3} fill="none" strokeLinecap="round" />
          <Ellipse cx={-1.5} cy={-0.8} rx={2.6} ry={1.2} fill={MOUSE_DEEP} />
          <Ellipse cx={2.6} cy={-0.8} rx={2.6} ry={1.2} fill={MOUSE_DEEP} />
          <Ellipse cx={0} cy={-8.5} rx={5} ry={8} fill={MOUSE} />
          <Ellipse cx={1.3} cy={-7.5} rx={3.2} ry={5.5} fill={MOUSE_LIGHT} />
          <Circle cx={3.6} cy={-25} r={3.8} fill={MOUSE_DEEP} />
          <Circle cx={3.6} cy={-25} r={2.4} fill={EAR_PINK} opacity={0.8} />
          <Circle cx={1.5} cy={-19} r={4.6} fill={MOUSE} />
          <Path d="M4,-21.5 Q9.5,-21 9.4,-18.5 Q6.5,-16.6 4,-17 Z" fill={MOUSE} />
          <Circle cx={9.4} cy={-19.4} r={1.05} fill={EAR_PINK} />
          <Circle cx={-2.6} cy={-24} r={4.6} fill={MOUSE} />
          <Circle cx={-2.6} cy={-24} r={3.1} fill={EAR_PINK} />
          <Circle cx={4.4} cy={-20.4} r={1.2} fill="#1E1410" />
          <Circle cx={4.8} cy={-20.9} r={0.42} fill="#FFFFFF" />
          <Path d="M5,-16.8 Q6.6,-15.6 8,-16.9" stroke={MOUSE_DEEP} strokeWidth={0.7} fill="none" strokeLinecap="round" />
          <Path d="M8.5,-18 l4,-1 M8.5,-17.2 l4,0.8" stroke={MOUSE_DEEP} strokeWidth={0.4} />
          {pose === 'plead' ? (
            <G>
              <Circle cx={4.4} cy={-12} r={1.7} fill={MOUSE_LIGHT} />
              <Circle cx={5.6} cy={-13.2} r={1.7} fill={MOUSE_LIGHT} />
            </G>
          ) : (
            <G>
              <Path d="M3,-13 L6.5,-20 M-3,-13 L-6,-20" stroke={MOUSE} strokeWidth={2} strokeLinecap="round" />
              <Circle cx={6.5} cy={-20.5} r={1.5} fill={MOUSE_LIGHT} />
              <Circle cx={-6} cy={-20.5} r={1.5} fill={MOUSE_LIGHT} />
            </G>
          )}
        </G>
      ) : (
        <G>
          <Path d="M-6.5,-3.5 C-16,-1 -20,-8 -15,-11 C-11,-13 -10,-8 -13,-8" stroke={TAIL_PINK} strokeWidth={1.3} fill="none" strokeLinecap="round" />
          {pose === 'run' ? (
            <Path d="M-4,-2 l-4,2 M-1,-2 l-2,2.5 M4,-2 l4,1.5 M6,-3 l4,0" stroke={MOUSE_DEEP} strokeWidth={1.5} strokeLinecap="round" />
          ) : (
            <G>
              <Ellipse cx={-3} cy={-0.8} rx={2.2} ry={1} fill={MOUSE_DEEP} />
              <Ellipse cx={4} cy={-0.8} rx={2.2} ry={1} fill={MOUSE_DEEP} />
            </G>
          )}
          <Ellipse cx={0} cy={-5.5} rx={7.5} ry={5.2} fill={MOUSE} />
          <Ellipse cx={1} cy={-3.5} rx={5} ry={2.4} fill={MOUSE_LIGHT} />
          <G transform={pose === 'nibble' ? 'rotate(28 5 -7)' : undefined}>
            <Circle cx={8.5} cy={-13.5} r={3.6} fill={MOUSE_DEEP} />
            <Circle cx={8.5} cy={-13.5} r={2.3} fill={EAR_PINK} opacity={0.8} />
            <Circle cx={7} cy={-8} r={4.2} fill={MOUSE} />
            <Path d="M9,-10.5 Q14,-8 13.5,-6.5 Q11,-5.5 9,-6 Z" fill={MOUSE} />
            <Circle cx={13.6} cy={-7} r={1} fill={EAR_PINK} />
            <Circle cx={4} cy={-13} r={4.3} fill={MOUSE} />
            <Circle cx={4} cy={-13} r={2.9} fill={EAR_PINK} />
            <Circle cx={9} cy={-9.2} r={1.1} fill="#1E1410" />
            <Circle cx={9.4} cy={-9.6} r={0.4} fill="#FFFFFF" />
            <Path d="M12.5,-7.5 l4,-1.2 M12.5,-6.8 l4,0.6" stroke={MOUSE_DEEP} strokeWidth={0.4} />
          </G>
          {pose === 'nibble' ? <Circle cx={10} cy={-4} r={1.4} fill={MOUSE_LIGHT} /> : null}
        </G>
      )}
    </G>
  );
}

/** Wide flat-topped acacia. (x, y) = trunk base; right branch tip at (27, -56)·s. */
function Acacia({ x, y, s = 1, leaf = ACACIA, light = ACACIA_LIGHT, trunk = BARK }: { x: number; y: number; s?: number; leaf?: string; light?: string; trunk?: string }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path
        d="M-5,0 C-4,-20 -8,-34 -22,-50 L-18,-53 C-6,-42 -1,-34 0,-30 C2,-40 10,-50 26,-58 L28,-54 C14,-46 6,-36 5,-20 C5,-12 6,-6 7,0 Z"
        fill={trunk}
      />
      <Path d="M-1,-34 C-3,-48 -1,-58 3,-64" stroke={trunk} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Ellipse cx={0} cy={-61} rx={60} ry={5} fill={ACACIA_DARK} opacity={leaf === ACACIA ? 1 : 0.6} />
      <Ellipse cx={0} cy={-66} rx={70} ry={10} fill={leaf} />
      <Ellipse cx={-34} cy={-72} rx={40} ry={9} fill={leaf} />
      <Ellipse cx={30} cy={-74} rx={46} ry={10} fill={leaf} />
      <Ellipse cx={-10} cy={-81} rx={38} ry={7} fill={light} />
      <Ellipse cx={34} cy={-80} rx={22} ry={5} fill={light} />
      <Ellipse cx={-52} cy={-70} rx={14} ry={3.6} fill={light} opacity={0.8} />
    </G>
  );
}

/** Tall swaying golden grass blades in a band from y downward. */
function TallGrass({ c, y, seed = 3, n = 40, h = 30, color = GRASS_GOLD, lean = 6, depth = 30 }: { c: SceneCtx; y: number; seed?: number; n?: number; h?: number; color?: string; lean?: number; depth?: number }) {
  const r = rng(seed);
  return (
    <G>
      {Array.from({ length: n }, (_, i) => {
        const bx = r() * (c.W + 20) - 10;
        const by = y + r() * depth;
        const bh = h * (0.6 + r() * 0.6);
        const l = lean * (0.4 + r());
        const col = r() > 0.7 ? GRASS_DEEP : color;
        return (
          <G key={i}>
            <Path d={`M${bx - 1.8},${by} Q${bx + l * 0.3},${by - bh * 0.55} ${bx + l},${by - bh} Q${bx + l * 0.3 + 0.8},${by - bh * 0.55} ${bx + 1.8},${by} Z`} fill={col} />
            {i % 5 === 0 ? <Ellipse cx={bx + l} cy={by - bh} rx={1.6} ry={4} fill={col} transform={`rotate(${l * 2} ${bx + l} ${by - bh})`} /> : null}
          </G>
        );
      })}
    </G>
  );
}

function Rock({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-40,0 Q-36,-18 -10,-22 Q20,-24 36,-12 Q44,-4 42,0 Z" fill={ROCK} />
      <Path d="M-26,-14 Q-8,-21 18,-18" stroke="#E2C495" strokeWidth={3} fill="none" strokeLinecap="round" />
    </G>
  );
}

const NET_ROWS = [0.22, 0.42, 0.62, 0.82, 1];
const NET_COLS = 7;

/** A knot of the net: column i (0..6), depth t (0..1). */
function netPt(x: number, top: number, w: number, h: number, i: number, t: number): [number, number] {
  const bx = x - w / 2 + (i * w) / (NET_COLS - 1);
  return [x + (bx - x) * Math.sqrt(t), top + t * h + Math.sin(i * 1.7) * 3 * t];
}

/** Loose dome of knotted rope hanging from (x, top). `cut` opens a gap around one knot. */
function Net({ x, top, w, h, cut }: { x: number; top: number; w: number; h: number; cut?: [number, number] }) {
  const P = (i: number, j: number) => (j < 0 ? ([x, top] as [number, number]) : netPt(x, top, w, h, i, NET_ROWS[j]));
  const isCut = (i: number, j: number) => !!cut && cut[0] === i && cut[1] === j;
  const segs: Array<[[number, number], [number, number]]> = [];
  for (let i = 0; i < NET_COLS; i++) {
    for (let j = 0; j < NET_ROWS.length; j++) {
      if (!(isCut(i, j) || isCut(i, j - 1))) segs.push([P(i, j - 1), P(i, j)]);
      if (i < NET_COLS - 1 && !isCut(i, j)) segs.push([P(i, j), P(i + 1, j)]);
    }
  }
  return (
    <G>
      <Path d={`M${x},${top} L${x},${top - 200}`} stroke={ROPE_DARK} strokeWidth={2.4} />
      {segs.map(([a, b], k) => (
        <Path key={k} d={`M${a[0]},${a[1]} Q${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2 + 3} ${b[0]},${b[1]}`} stroke={ROPE} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      ))}
      {NET_ROWS.map((_, j) =>
        Array.from({ length: NET_COLS }, (__, i) => {
          if (isCut(i, j)) return null;
          const [kx, ky] = P(i, j);
          return <Circle key={`${i}-${j}`} cx={kx} cy={ky} r={2.4} fill={ROPE_DARK} />;
        })
      )}
      <Circle cx={x} cy={top} r={4} fill={ROPE_DARK} />
    </G>
  );
}

/** The cut net lying crumpled in the grass. */
function NetPile({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-30,0 Q-26,-12 -6,-14 Q18,-16 30,-4 Q32,0 28,1 Z" fill={ROPE} opacity={0.35} />
      {[-22, -12, -2, 8, 18].map((px, i) => (
        <Path key={i} d={`M${px},0 Q${px + 4},-10 ${px + 10},-12`} stroke={ROPE} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      ))}
      <Path d="M-28,-2 Q0,-12 28,-3 M-20,-8 Q4,-16 22,-9" stroke={ROPE} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      {[[-14, -6], [2, -9], [14, -6], [-4, -3]].map(([kx, ky], i) => (
        <Circle key={i} cx={kx} cy={ky} r={2} fill={ROPE_DARK} />
      ))}
      <Path d="M30,-4 l6,-3 M30,-4 l7,1" stroke={ROPE} strokeWidth={1.4} strokeLinecap="round" />
    </G>
  );
}

/** Little rope snippets tumbling down. */
function RopeBits({ x, y }: { x: number; y: number }) {
  return (
    <G>
      {[[0, 0, 30], [8, 14, -20], [-6, 26, 60], [4, 38, 10]].map(([dx, dy, rot], i) => (
        <Path key={i} d={`M${x + dx - 3},${y + dy} L${x + dx + 3},${y + dy}`} stroke={ROPE} strokeWidth={2} strokeLinecap="round" transform={`rotate(${rot} ${x + dx} ${y + dy})`} />
      ))}
    </G>
  );
}

function Zzz({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <G opacity={0.75}>
      {[[0, 0, 6], [12, -12, 8], [26, -28, 10]].map(([dx, dy, k], i) => (
        <Path key={i} d={`M${x + dx},${y + dy} l${k},0 l${-k},${k} l${k},0`} stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </G>
  );
}

/** Soft arcs for a sound (roar) or laugh. */
function Arcs({ x, y, color, n = 3, rot = 0 }: { x: number; y: number; color: string; n?: number; rot?: number }) {
  return (
    <G transform={`rotate(${rot} ${x} ${y})`}>
      {Array.from({ length: n }, (_, i) => (
        <Path key={i} d={`M${x - 8 - i * 7},${y - i * 7} Q${x},${y - 12 - i * 9} ${x + 8 + i * 7},${y - i * 7}`} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.75 - i * 0.18} />
      ))}
    </G>
  );
}

function Savanna({ c, horizon, seed }: { c: SceneCtx; horizon: number; seed: number }) {
  return (
    <G>
      <Ridge c={c} y={horizon - 6} amp={10} seed={seed} color="#E9B866" opacity={0.7} />
      <Ridge c={c} y={horizon} amp={6} seed={seed + 1} color={c.p.ground} />
      <TallGrass c={c} y={horizon} seed={seed + 2} n={30} h={14} color="#E2B055" depth={12} />
    </G>
  );
}

// ─── Scenes ───────────────────────────────────────────────────

const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top={c.p.sky} mid="#FAD597" bottom={c.p.skyLow} />
    <Glow c={c} name="sun" cx={250} cy={150} r={150} color={c.p.glow} opacity={0.9} />
    <Sun cx={250} cy={150} r={34} color="#FFE9B6" />
    <Savanna c={c} horizon={250} seed={3} />
    <Bird x={84} y={92} s={0.9} color={c.p.accent} />
    <Bird x={104} y={80} s={0.7} color={c.p.accent} wing="down" />
    <Acacia x={150} y={262} s={2.4} />
    <Lion x={168} y={292} s={1.5} eyes="half" mouth="smile" />
    <Mouse x={244} y={272} s={0.85} flip pose="cheer" />
    <TallGrass c={c} y={312} seed={8} n={46} h={34} depth={50} />
    <Finish c={c} vignette={0.24} />
  </G>
);

const pages = [
  // 1 — the lion asleep under the acacia; the tiny mouse scampers right across his nose
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={304} cy={56} r={100} color={c.p.glow} opacity={0.85} />
      <Sun cx={304} cy={56} r={20} color="#FFE9B6" />
      <Savanna c={c} horizon={150} seed={11} />
      <Acacia x={92} y={176} s={1.7} />
      <Lion x={150} y={204} s={1.25} eyes="closed" mouth="smile" tilt={10} />
      <Zzz x={206} y={118} color={c.p.ink} />
      <Mouse x={192} y={148} s={0.7} pose="run" />
      <TallGrass c={c} y={212} seed={13} n={34} h={24} depth={30} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 2 — awake now, a huge paw hovers over the mouse, who looks up pleading, paws together
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#F5BE72" bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={60} cy={60} r={90} color={c.p.glow} opacity={0.7} />
      <Savanna c={c} horizon={146} seed={21} />
      <Acacia x={300} y={170} s={1.4} />
      <Rock x={74} y={196} s={1.1} />
      <Lion x={132} y={208} s={1.3} eyes="open" mouth="smile" paw="hover" tilt={8} />
      <Mouse x={214} y={208} s={0.55} flip pose="plead" />
      <Path d="M204,184 l-4,-4 M210,181 l0,-5 M216,184 l4,-4" stroke={c.p.accent} strokeWidth={1.2} strokeLinecap="round" opacity={0.7} />
      <TallGrass c={c} y={214} seed={23} n={30} h={20} depth={26} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 3 — the lion chuckles, eyes shut, paw lifted; the mouse dashes away through tall grass
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={250} cy={70} r={110} color={c.p.glow} opacity={0.8} />
      <Savanna c={c} horizon={150} seed={31} />
      <Acacia x={40} y={168} s={1.5} />
      <Lion x={120} y={208} s={1.22} eyes="closed" mouth="chuckle" paw="up" tilt={-8} />
      <Arcs x={150} y={112} color={c.p.accent} n={2} rot={20} />
      <TallGrass c={c} y={196} seed={33} n={20} h={34} depth={8} lean={10} />
      <Mouse x={284} y={214} s={0.8} pose="run" />
      <Path d="M252,206 l14,0 M248,212 l16,0 M254,200 l10,0" stroke={c.p.ink} strokeWidth={1.2} strokeLinecap="round" opacity={0.4} />
      <TallGrass c={c} y={216} seed={35} n={32} h={22} depth={24} lean={9} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 4 — tangled in a loose rope net hung from the acacia, he roars at the sky, worried not hurt
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#EFAE62" bottom={c.p.skyLow} />
      <Glow c={c} name="sun" cx={300} cy={150} r={90} color={c.p.glow} opacity={0.6} />
      <Savanna c={c} horizon={160} seed={41} />
      <Acacia x={120} y={214} s={2} />
      <Lion x={146} y={212} s={1.1} eyes="closed" mouth="roar" tilt={-22} brows />
      <Net x={174} top={102} w={210} h={110} />
      <Arcs x={214} y={110} color={c.p.accent} n={3} rot={30} />
      <Bird x={60} y={40} s={0.9} color={c.p.accent} />
      <Bird x={250} y={30} s={0.8} color={c.p.accent} wing="down" />
      <Bird x={284} y={48} s={0.7} color={c.p.accent} />
      <TallGrass c={c} y={214} seed={43} n={28} h={18} depth={24} />
      <Finish c={c} vignette={0.28} />
    </G>
  ),
  // 5 — the mouse perches on the net nibbling through a knot; cut ropes fall; the lion watches, hopeful
  (c: SceneCtx) => {
    const [mx, my] = netPt(174, 102, 210, 110, 4, NET_ROWS[2]);
    return (
      <G>
        <Sky c={c} top="#EFAE62" bottom={c.p.skyLow} />
        <Glow c={c} name="sun" cx={300} cy={150} r={90} color={c.p.glow} opacity={0.6} />
        <Savanna c={c} horizon={160} seed={41} />
        <Acacia x={120} y={214} s={2} />
        <Lion x={146} y={212} s={1.1} eyes="open" mouth="smile" tilt={-10} brows />
        <Net x={174} top={102} w={210} h={110} cut={[4, 2]} />
        <Path d={`M${mx - 9},${my - 2} l-4,-2 M${mx - 9},${my} l-5,1 M${mx + 9},${my + 4} l4,3`} stroke={ROPE} strokeWidth={1.4} strokeLinecap="round" />
        <Mouse x={mx - 2} y={my - 1} s={0.7} pose="nibble" />
        <RopeBits x={mx + 4} y={my + 12} />
        <TallGrass c={c} y={214} seed={53} n={28} h={18} depth={24} />
        <Finish c={c} vignette={0.26} />
      </G>
    );
  },
  // 6 — sunset: the lion free, lying down with the mouse sitting proudly in his mane; cut net in the grass
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#E8956A" mid="#F4B67A" bottom="#FCD9A0" />
      <Glow c={c} name="sun" cx={262} cy={160} r={130} color="#FFE2A8" opacity={0.95} />
      <Sun cx={262} cy={160} r={30} color="#FFD58A" />
      <Ridge c={c} y={168} amp={8} seed={61} color="#D9955A" />
      <Ridge c={c} y={176} amp={5} seed={62} color={c.p.groundDeep} />
      <Acacia x={300} y={172} s={1.3} leaf="#7A5A3A" light="#94704A" trunk="#5A3A26" />
      <Bird x={90} y={60} s={0.8} color={c.p.accent} />
      <Bird x={110} y={52} s={0.6} color={c.p.accent} wing="down" />
      <Lion x={134} y={212} s={1.25} eyes="half" mouth="smile" tilt={6} />
      <Mouse x={176} y={128} s={0.62} pose="cheer" />
      <NetPile x={282} y={214} s={1.1} />
      <TallGrass c={c} y={214} seed={63} n={30} h={18} depth={24} color="#E0A050" />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
];

export const SU_TU_VA_CHUOT: StoryScenes = { cover, pages };
