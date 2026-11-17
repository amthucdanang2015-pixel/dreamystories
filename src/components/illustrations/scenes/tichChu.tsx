// Tích Chu — tender and intimate: plum dusk outside, amber oil-lamp light
// inside a small thatched cottage, a starry violet night at the end.
// Signature: the little grey bird with Grandma's white tuft, the oil lamp's
// halo, the bamboo bed, and the water gourd that brings her home.

import React from 'react';
import { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import {
  Figure,
  Finish,
  Fireflies,
  Glow,
  Grass,
  Hut,
  Lotus,
  Palm,
  Peaks,
  Ridge,
  SceneCtx,
  Sky,
  Stars,
  StoryScenes,
  gid,
  gurl,
} from '../kit';

const CHU = { top: '#9CC3DE', bottom: '#7A5636', hairStyle: 'short' as const, skin: '#E8B98F' };
const GRANDMA = {
  top: '#7A5038',
  bottom: '#5A3E2C',
  hair: '#E8E3DC',
  hairStyle: 'bun' as const,
  hat: 'khan' as const,
  hatColor: '#2A2228',
  skin: '#E2B48E',
};
const FAIRY = { top: '#F6D6DE', bottom: '#FBEFF2', hair: '#3A2A30', hairStyle: 'long' as const, dress: true, skin: '#F0CBA8' };
const LAMP = '#F6C46A';
const BAMBOO = '#C9A464';
const BAMBOO_DARK = '#9A7A44';
const WALL_NIGHT = '#5A4256';
const ROOF_NIGHT = '#3A2C3E';

/** Grandma as a little grey-brown bird with a white bun-like tuft. (x, y) = body centre. */
function GrandmaBird({ x, y, s = 1, flip = false, fly = false }: { x: number; y: number; s?: number; flip?: boolean; fly?: boolean }) {
  return (
    <G transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      <Path d="M-9,-1 L-20,-6 L-19,2 Z" fill="#6E655E" />
      {fly ? <Path d="M-4,-2 Q-14,8 -2,10 Q2,4 2,0 Z" fill="#6E655E" /> : null}
      <Ellipse cx={-1} cy={0} rx={11} ry={8.5} fill="#8F857C" />
      <Ellipse cx={1} cy={3} rx={7} ry={4.5} fill="#DCD3C8" />
      {fly ? (
        <Path d="M-6,-4 Q-12,-26 6,-23 Q4,-12 4,-4 Z" fill="#6E655E" />
      ) : (
        <Path d="M-9,-2 Q-1,-9 6,-1 Q-1,2 -9,-2 Z" fill="#6E655E" />
      )}
      <Circle cx={8} cy={-7} r={6} fill="#8F857C" />
      <Circle cx={5} cy={-14} r={3.4} fill="#FFFFFF" />
      <Path d="M6,-17 q3,-3 6,-1" stroke="#FFFFFF" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <Circle cx={10.2} cy={-8} r={1.4} fill="#1A1410" />
      <Circle cx={10.7} cy={-8.5} r={0.45} fill="#FFFFFF" />
      <Circle cx={9.4} cy={-4.6} r={1.5} fill="#E8A090" opacity={0.5} />
      <Path d="M13.6,-7.2 L17.4,-5.8 L13.6,-4.4 Z" fill="#D9A040" />
      {!fly ? <Path d="M-2,8 L-2,11 M2,8 L2,11" stroke="#6E5A40" strokeWidth={1} strokeLinecap="round" /> : null}
    </G>
  );
}

/** Small brass oil lamp with glass chimney. (x, y) = base. */
function OilLamp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M-7,0 L7,0 L5,-3 L-5,-3 Z" fill="#8A6A3A" />
      <Ellipse cx={0} cy={-7} rx={7} ry={5} fill="#C9A45E" />
      <Ellipse cx={0} cy={-6} rx={5} ry={2.6} fill="#E8B86B" opacity={0.8} />
      <Rect x={-2.5} y={-13} width={5} height={3} fill="#8A6A3A" />
      <Path d="M-3,-12 Q-6.5,-18 -3,-26 L3,-26 Q6.5,-18 3,-12 Z" fill="#FFF6DE" opacity={0.45} />
      <Path d="M0,-13 Q-2.6,-17 0,-22 Q2.6,-17 0,-13 Z" fill="#FFC24A" />
      <Path d="M0,-14 Q-1.2,-16 0,-19 Q1.2,-16 0,-14 Z" fill="#FFF6DE" />
    </G>
  );
}

/** Bottle gourd for carrying water. (x, y) = centre of the lower bulb. */
function Gourd({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Circle cx={0} cy={0} r={8} fill="#D9B25A" />
      <Circle cx={0} cy={-11} r={5} fill="#D9B25A" />
      <Rect x={-2} y={-19} width={4} height={4} fill="#8A6A3A" />
      <Path d="M-5,-6 Q0,-4 5,-6" stroke="#8A5A2A" strokeWidth={1.4} fill="none" />
      <Ellipse cx={-3} cy={-2} rx={2} ry={3.4} fill="#F0D488" />
    </G>
  );
}

/** A bamboo bed (chõng tre). (x, y) = left end of the top surface. */
function BambooBed({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <G>
      {[x + 4, x + w - 8].map((lx) => (
        <Rect key={lx} x={lx} y={y + 6} width={4} height={24} fill={BAMBOO_DARK} />
      ))}
      <Rect x={x + 4} y={y + 18} width={w - 8} height={2.4} fill={BAMBOO_DARK} />
      <Rect x={x} y={y} width={w} height={7} rx={2} fill={BAMBOO} />
      {Array.from({ length: Math.floor(w / 10) }, (_, i) => (
        <Path key={i} d={`M${x + 6 + i * 10},${y + 1} L${x + 6 + i * 10},${y + 6}`} stroke={BAMBOO_DARK} strokeWidth={0.8} opacity={0.7} />
      ))}
    </G>
  );
}

/** Diamond kite with a bow tail. (x, y) = centre. */
function Kite({ x, y, s = 1, color, accent }: { x: number; y: number; s?: number; color: string; accent: string }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Path d="M0,16 Q-6,26 2,34 Q8,42 2,50" stroke={accent} strokeWidth={1} fill="none" />
      {[28, 40].map((ty) => (
        <Path key={ty} d={`M-3,${ty - 2} L3,${ty + 2} M3,${ty - 2} L-3,${ty + 2}`} stroke={accent} strokeWidth={2} strokeLinecap="round" />
      ))}
      <Path d="M0,-14 L11,0 L0,16 L-11,0 Z" fill={color} />
      <Path d="M0,-14 L0,16 M-11,0 L11,0" stroke={accent} strokeWidth={1} />
      <Path d="M0,-14 L11,0 L0,0 Z" fill="#FFFFFF" opacity={0.25} />
    </G>
  );
}

/** Music note drifting from a lullaby. */
function Note({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return (
    <G transform={`translate(${x},${y}) scale(${s})`}>
      <Ellipse cx={0} cy={0} rx={3} ry={2.2} fill={color} transform="rotate(-20)" />
      <Path d="M2.6,-1 L2.6,-12 Q6,-10 7,-7" stroke={color} strokeWidth={1.3} fill="none" strokeLinecap="round" />
    </G>
  );
}

/** Soft grey feather. (x, y) = quill tip. */
function Feather({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <G transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <Path d="M0,0 Q-6,-10 -1,-22 Q6,-12 0,0 Z" fill="#B8B0AC" />
      <Path d="M0,2 Q0,-10 -1,-21" stroke="#8F857C" strokeWidth={0.8} fill="none" />
    </G>
  );
}

function Sparkle({ x, y, r = 4, color }: { x: number; y: number; r?: number; color: string }) {
  return (
    <Path
      d={`M${x},${y - r} Q${x},${y} ${x + r},${y} Q${x},${y} ${x},${y + r} Q${x},${y} ${x - r},${y} Q${x},${y} ${x},${y - r} Z`}
      fill={color}
    />
  );
}

/** The kind fairy: pale pink and white robes, lotus, soft glow. (x, y) = feet. */
function Fairy({ c, x, y, s = 1, flip = false }: { c: SceneCtx; x: number; y: number; s?: number; flip?: boolean }) {
  const d = flip ? -1 : 1;
  return (
    <G>
      <Glow c={c} name="fairy" cx={x} cy={y - 34 * s} r={78 * s} color="#FBE3EC" opacity={0.95} />
      <Path
        d={`M${x - 10 * s * d},${y - 34 * s} Q${x - 30 * s * d},${y - 20 * s} ${x - 22 * s * d},${y + 2 * s} Q${x - 16 * s * d},${y - 14 * s} ${x - 6 * s * d},${y - 26 * s} Z`}
        fill="#FBEFF2"
        opacity={0.85}
      />
      <Circle cx={x} cy={y - 50 * s} r={13 * s} fill="#FFF1F4" opacity={0.6} />
      <Figure x={x} y={y} s={s} {...FAIRY} pose="wave" flip={flip} />
      <Lotus x={x - 11 * s * d} y={y - 18 * s} s={0.5 * s} color="#F4A7B9" leaf="#7FA86E" />
    </G>
  );
}

/** Interior wall with thatch rafters and an earth floor. */
function Room({ c, top, bottom, floorY, floor }: { c: SceneCtx; top: string; bottom: string; floorY: number; floor: string }) {
  return (
    <G>
      <Sky c={c} top={top} bottom={bottom} name="wall" />
      {Array.from({ length: 10 }, (_, i) => (
        <Path key={i} d={`M${i * 40 + 6},0 L${i * 40 + 6},${floorY}`} stroke="#000000" strokeWidth={1} opacity={0.07} />
      ))}
      <Rect x={0} y={0} width={c.W} height={14} fill="#3A2A2E" />
      <Path d="M0,14 L60,0 M80,14 L140,0 M160,14 L220,0 M240,14 L300,0 M320,14 L380,0" stroke="#2A1E22" strokeWidth={2} />
      <Rect x={0} y={floorY} width={c.W} height={c.H - floorY + 2} fill={floor} />
      <Path d={`M0,${floorY} L${c.W},${floorY}`} stroke="#000000" strokeWidth={2} opacity={0.12} />
    </G>
  );
}

/** Window with bamboo bars and a gradient view. */
function Window({ c, x, y, w, h, top, bottom }: { c: SceneCtx; x: number; y: number; w: number; h: number; top: string; bottom: string }) {
  return (
    <G>
      <Defs>
        <LinearGradient id={gid(c, 'win')} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={top} />
          <Stop offset="1" stopColor={bottom} />
        </LinearGradient>
      </Defs>
      <Rect x={x} y={y} width={w} height={h} fill={gurl(c, 'win')} />
      <Rect x={x - 4} y={y - 4} width={w + 8} height={5} fill="#4A3428" />
      <Rect x={x - 4} y={y + h - 1} width={w + 8} height={5} fill="#4A3428" />
      {Array.from({ length: 3 }, (_, i) => (
        <Rect key={i} x={x + ((i + 1) * w) / 4 - 1.2} y={y} width={2.4} height={h} fill="#6A4E3A" />
      ))}
    </G>
  );
}

const cover = (c: SceneCtx) => (
  <G>
    <Sky c={c} top={c.p.ink} mid={c.p.sky} bottom="#8A5E7A" />
    <Stars c={c} count={70} seed={7} maxY={240} color={c.p.glow} />
    <Glow c={c} name="moon" cx={292} cy={72} r={50} color={c.p.glow} opacity={0.45} />
    <Circle cx={292} cy={72} r={17} fill="#FBE9C4" />
    <Circle cx={300} cy={66} r={15} fill={c.p.sky} />
    <Ridge c={c} y={250} amp={18} seed={5} color="#3A2E46" />
    <Palm x={330} y={268} s={1.3} trunk="#2E2436" leaf="#2E2436" />
    <Glow c={c} name="door" cx={74} cy={248} r={70} color={LAMP} opacity={0.6} />
    <Hut x={74} y={270} s={1.7} wall={WALL_NIGHT} roof={ROOF_NIGHT} door="#231B2C" lit={LAMP} />
    <Rect x={0} y={266} width={c.W} height={100} fill={c.p.groundDeep} />
    <Glow c={c} name="lamp" cx={250} cy={262} r={110} color={c.p.glow} opacity={0.6} />
    <BambooBed x={92} y={288} w={184} />
    <Figure x={214} y={300} s={1.5} {...GRANDMA} pose="out" sitting flip />
    <Figure x={168} y={297} s={1.15} {...CHU} pose="out" sitting />
    <OilLamp x={260} y={288} s={1.5} />
    <Feather x={124} y={222} s={1.6} rot={28} />
    <Circle cx={118} cy={204} r={10} fill={c.p.glow} opacity={0.15} />
    <Fireflies c={c} color={c.p.glow} count={10} area={[20, 200, 320, 80]} />
    <Grass c={c} y={320} seed={14} color="#2A3424" count={10} />
    <Finish c={c} vignette={0.4} />
  </G>
);

const pages = [
  // 1 — inside the cottage: Grandma rocks baby Chu's hammock and sings by lamplight
  (c: SceneCtx) => (
    <G>
      <Room c={c} top="#5A3A44" bottom="#8A5A48" floorY={196} floor="#5E4236" />
      <Window c={c} x={34} y={52} w={62} h={52} top={c.p.sky} bottom={c.p.skyLow} />
      <Circle cx={52} cy={66} r={1.4} fill={c.p.glow} />
      <Glow c={c} name="lamp" cx={104} cy={172} r={150} color={LAMP} opacity={0.6} />
      {/* hammock */}
      <Path d="M124,14 L148,148 M252,14 L228,148" stroke="#8A6A4A" strokeWidth={1.4} />
      <Path d="M146,146 Q188,202 230,146 Q188,166 146,146 Z" fill="#C9A26E" />
      {[160, 176, 192, 208].map((nx) => (
        <Path key={nx} d={`M${nx},152 L${nx + 6},176`} stroke="#A8844E" strokeWidth={0.8} opacity={0.7} />
      ))}
      <Circle cx={166} cy={152} r={7.5} fill={CHU.skin} />
      <Path d="M158.6,152 Q159,143 166,143.4 Q173,143 173.4,152 Q169,147 158.6,152 Z" fill="#1E1712" />
      <Path d="M163,154 q1.4,1 2.8,0 M168,154 q1.4,1 2.8,0" stroke="#2A1A10" strokeWidth={0.8} fill="none" />
      <Path d="M172,152 Q196,150 224,148 Q200,162 176,160 Z" fill={CHU.top} />
      <Path d="M146,146 Q188,180 230,146" stroke="#A8844E" strokeWidth={3.4} fill="none" />
      {/* Grandma on her stool, the pull string in her hand */}
      <Rect x={252} y={198} width={30} height={4} rx={2} fill="#6A4E3A" />
      <Rect x={256} y={202} width={3} height={16} fill="#4A3428" />
      <Rect x={276} y={202} width={3} height={16} fill="#4A3428" />
      <Path d="M246,188 Q238,170 230,148" stroke="#8A6A4A" strokeWidth={1} fill="none" />
      <Figure x={268} y={208} s={1.1} {...GRANDMA} pose="out" sitting flip />
      <Note x={244} y={110} s={1.1} color={c.p.glow} />
      <Note x={222} y={90} s={0.9} color={c.p.glow} />
      <Note x={258} y={78} s={0.8} color={c.p.glow} />
      {/* low table with rice bowl and the lamp */}
      <Rect x={50} y={190} width={74} height={6} rx={2} fill="#6A4E3A" />
      <Rect x={56} y={196} width={4} height={20} fill="#4A3428" />
      <Rect x={114} y={196} width={4} height={20} fill="#4A3428" />
      <Ellipse cx={76} cy={182} rx={8} ry={4.4} fill="#FBF4E2" />
      <Path d="M67,183 Q68,190 76,190 Q84,190 85,183 Z" fill="#5E8AA8" />
      <Path d="M86,180 L98,174 M86,182 L99,177" stroke="#8A6A3A" strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M72,176 q-3,-5 0,-9 M80,176 q3,-5 0,-9" stroke="#FFFFFF" strokeWidth={1} fill="none" opacity={0.5} />
      <OilLamp x={108} y={190} s={1.3} />
      <Finish c={c} vignette={0.38} />
    </G>
  ),
  // 2 — older Chu runs off to fly kites; Grandma watches alone from the doorway
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#A57E9E" mid="#E2AFA2" bottom="#F6D8B8" />
      <Glow c={c} name="sun" cx={300} cy={136} r={110} color={c.p.glow} opacity={0.6} />
      <Ridge c={c} y={150} amp={14} seed={21} color="#8E9A72" />
      <Ridge c={c} y={170} amp={10} seed={4} color={c.p.ground} />
      <Path d="M80,186 Q140,196 170,214 Q190,230 240,244 L200,244 Q160,226 140,210 Q110,194 70,188 Z" fill="#D8C29A" />
      <Hut x={64} y={186} s={1.8} wall="#B89480" roof="#6A5060" door="#3A2C30" />
      <Figure x={64} y={186} s={0.56} {...GRANDMA} />
      <Kite x={258} y={52} s={1.1} color="#E8B86B" accent="#B8574A" />
      <Kite x={318} y={82} s={0.9} color="#9CC3DE" accent="#4A6A8A" />
      <Kite x={186} y={36} s={0.7} color="#C78F8A" accent="#6A3A4A" />
      <Path d="M224,170 Q236,110 258,66" stroke="#4A3B5C" strokeWidth={0.7} fill="none" opacity={0.7} />
      <Path d="M288,172 Q300,130 318,96" stroke="#4A3B5C" strokeWidth={0.7} fill="none" opacity={0.7} />
      <G transform="rotate(8 214 214)">
        <Figure x={214} y={214} s={0.76} {...CHU} pose="up" />
      </G>
      <Figure x={280} y={214} s={0.68} top="#E8B86B" bottom="#5A4A3A" hairStyle="topknot" pose="up" />
      <Figure x={316} y={216} s={0.64} top="#C9748A" bottom="#5A4A3A" hairStyle="bob" pose="wave" />
      <Grass c={c} y={196} seed={2} color={c.p.groundDeep} count={12} />
      <Finish c={c} vignette={0.26} />
    </G>
  ),
  // 3 — a hot day: Grandma rests on the bamboo bed and reaches for the empty jug
  (c: SceneCtx) => (
    <G>
      <Room c={c} top="#8A6A6A" bottom="#B08A78" floorY={192} floor="#8A6A54" />
      {/* the bright, empty doorway */}
      <Rect x={250} y={44} width={70} height={148} fill="#FFF1D0" />
      <Rect x={244} y={40} width={82} height={6} fill="#4A3428" />
      <Rect x={244} y={40} width={6} height={152} fill="#4A3428" />
      <Rect x={320} y={40} width={6} height={152} fill="#4A3428" />
      <Path d="M250,172 Q280,164 320,170 L320,192 L250,192 Z" fill="#E8D8A8" />
      <Rect x={250} y={180} width={70} height={12} fill="#F0DCA8" />
      <Path d="M266,120 q4,-6 0,-12 q-4,-6 0,-12 M290,128 q4,-6 0,-12 q-4,-6 0,-12" stroke="#F0C890" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <Path d="M250,192 L320,192 L352,244 L214,244 Z" fill="#FFE8B0" opacity={0.45} />
      <BambooBed x={104} y={176} w={124} />
      <Ellipse cx={148} cy={172} rx={13} ry={5} fill="#E8DCC8" />
      <G transform="rotate(-90 214 166)">
        <Figure x={214} y={166} s={1.2} {...GRANDMA} />
      </G>
      <Rect x={172} y={154} width={52} height={24} rx={8} fill="#B87A6A" />
      <Path d="M178,160 L218,160" stroke="#D89A88" strokeWidth={1.4} opacity={0.6} />
      <Path d="M166,174 Q152,188 140,194" stroke={GRANDMA.top} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Circle cx={139} cy={195} r={2.8} fill={GRANDMA.skin} />
      {/* the empty clay jug */}
      <Path d="M118,214 Q112,204 118,196 L119,190 L131,190 L132,196 Q138,204 132,214 Z" fill="#A8643E" />
      <Ellipse cx={125} cy={190} rx={6} ry={1.8} fill="#5A2E1E" />
      {/* palm-leaf fan resting on the bed */}
      <Path d="M206,176 L196,172" stroke="#8A6A3A" strokeWidth={1.4} />
      <Path d="M196,172 Q186,160 176,170 Q184,178 196,172 Z" fill="#D8C28A" />
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 4 — the little grey bird flies out of the cottage window into the plum evening
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} mid="#8A5E7A" bottom={c.p.skyLow} />
      <Stars c={c} count={14} seed={44} maxY={70} color={c.p.glow} opacity={0.7} />
      <Glow c={c} name="sunset" cx={300} cy={196} r={130} color="#F6C08A" opacity={0.55} />
      <Ridge c={c} y={192} amp={16} seed={14} color="#6A5A6E" />
      <Ridge c={c} y={214} amp={8} seed={3} color={c.p.groundDeep} />
      {/* the cottage wall and its lamp-lit window */}
      <Rect x={-10} y={40} width={130} height={210} fill="#8A6A62" />
      <Path d="M-10,22 L146,30 L130,54 L-10,50 Z" fill="#5A4256" />
      <Glow c={c} name="win" cx={62} cy={118} r={70} color={LAMP} opacity={0.7} />
      <Rect x={32} y={92} width={60} height={54} fill={LAMP} />
      <Path d="M32,92 L14,98 L14,150 L32,146 Z M92,92 L110,98 L110,150 L92,146 Z" fill="#4A3428" />
      <Rect x={28} y={144} width={68} height={5} fill="#4A3428" />
      {[[100, 112], [118, 104], [138, 100], [158, 98], [176, 98]].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={1.4 + i * 0.2} fill={c.p.glow} opacity={0.4 + i * 0.1} />
      ))}
      <Glow c={c} name="bird" cx={224} cy={92} r={46} color={c.p.glow} opacity={0.5} />
      <GrandmaBird x={224} y={96} s={2.3} fly />
      <Feather x={160} y={150} s={1.1} rot={-30} />
      <Finish c={c} vignette={0.34} />
    </G>
  ),
  // 5 — Chu cries in the doorway; the glowing fairy points to the far mountain
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.sky} mid="#8A5E7A" bottom={c.p.skyLow} />
      <Stars c={c} count={16} seed={52} maxY={80} color={c.p.glow} opacity={0.6} />
      <Peaks base={176} peaks={[[318, 96, 46], [272, 60, 34]]} color="#7A6A8A" />
      <Glow c={c} name="peak" cx={318} cy={82} r={26} color={c.p.glow} opacity={0.9} />
      <Sparkle x={318} y={80} r={5} color="#FFFFFF" />
      <Ridge c={c} y={176} amp={10} seed={8} color={c.p.ground} />
      <Ridge c={c} y={206} amp={6} seed={11} color={c.p.groundDeep} />
      <Hut x={72} y={206} s={2} wall="#8A6A62" roof="#4A3B4C" door="#2A2030" />
      <Figure x={84} y={218} s={0.9} {...CHU} pose="hold" />
      <Path d="M88,173 q-1.6,3.4 0,5 q1.6,-1.6 0,-5 Z M82,175 q-1.4,3 0,4.4 q1.4,-1.4 0,-4.4 Z" fill="#BFE0F0" />
      <Fairy c={c} x={196} y={196} s={1.15} />
      {[[236, 126], [256, 114], [276, 102], [296, 90]].map(([x, y], i) => (
        <Sparkle key={i} x={x} y={y} r={2 + i * 0.4} color={c.p.glow} />
      ))}
      <Finish c={c} vignette={0.34} />
    </G>
  ),
  // 6 — over the green hills to the sparkling spring; Chu kneels to fill the gourd
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#B88AA6" mid="#E8B8A6" bottom="#F6E2C8" />
      <Glow c={c} name="sun" cx={70} cy={60} r={90} color={c.p.glow} opacity={0.7} />
      <Ridge c={c} y={110} amp={14} seed={31} color="#A7AE8E" />
      <Ridge c={c} y={142} amp={14} seed={12} color="#8A9A6E" />
      <Ridge c={c} y={176} amp={10} seed={6} color={c.p.ground} />
      <Path d="M40,244 Q60,200 100,180 Q130,164 118,140 L126,140 Q142,166 112,186 Q80,206 90,244 Z" fill="#D8C29A" />
      <Figure x={122} y={144} s={0.3} {...CHU} />
      {[[60, 150], [170, 160], [30, 186]].map(([x, y], i) => (
        <G key={i}>
          <Circle cx={x} cy={y} r={10} fill={c.p.groundDeep} />
          <Circle cx={x + 9} cy={y + 2} r={8} fill={c.p.groundDeep} />
        </G>
      ))}
      {/* the mountain spring */}
      <Path d="M210,200 Q226,130 268,96 Q300,76 340,90 Q370,100 370,120 L370,210 Z" fill="#7A6A7E" />
      <Path d="M290,96 Q320,86 350,98 L344,110 Q318,100 296,108 Z" fill="#8F7F92" />
      <Glow c={c} name="spring" cx={256} cy={170} r={70} color="#E8F6F4" opacity={0.7} />
      <Rect x={262} y={104} width={12} height={84} rx={4} fill="#CDE6E8" />
      <Path d="M266,110 L266,180 M270,118 L270,184" stroke="#FFFFFF" strokeWidth={1} opacity={0.8} />
      <Ellipse cx={248} cy={198} rx={48} ry={13} fill="#9FD0D0" />
      <Ellipse cx={256} cy={196} rx={28} ry={6} fill="#CFEDEB" opacity={0.7} />
      {[[232, 190], [262, 184], [284, 198], [244, 204]].map(([x, y], i) => (
        <Sparkle key={i} x={x} y={y} r={2.4 + (i % 2)} color="#FFFFFF" />
      ))}
      <Rect x={0} y={208} width={c.W} height={40} fill={c.p.ground} />
      <Figure x={182} y={218} s={0.84} {...CHU} pose="out" sitting />
      <Gourd x={206} y={194} s={0.95} rot={120} />
      <Grass c={c} y={212} seed={8} color={c.p.groundDeep} count={8} />
      <Finish c={c} vignette={0.24} />
    </G>
  ),
  // 7 — Chu offers the spring water; the bird glows and becomes Grandma again
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top="#6A4A6E" mid="#B07A86" bottom="#F0B48A" />
      <Glow c={c} name="sun" cx={120} cy={200} r={110} color="#F6C08A" opacity={0.5} />
      <Ridge c={c} y={194} amp={10} seed={17} color={c.p.ground} />
      <Hut x={48} y={200} s={0.9} wall="#8A6A62" roof="#4A3B4C" door="#2A2030" lit={LAMP} />
      <Rect x={0} y={206} width={c.W} height={40} fill={c.p.groundDeep} />
      {/* the little tree and its branch */}
      <Path d="M330,214 Q318,160 300,110" stroke="#4A3A34" strokeWidth={9} fill="none" strokeLinecap="round" />
      <Path d="M306,124 Q260,118 214,130" stroke="#4A3A34" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Circle cx={300} cy={84} r={34} fill={c.p.groundDeep} />
      <Circle cx={336} cy={96} r={28} fill={c.p.groundDeep} />
      <Circle cx={312} cy={66} r={22} fill={c.p.ground} />
      <Path d="M228,126 q6,-8 12,-4 q-4,6 -12,4 Z M252,122 q6,-8 12,-3 q-5,6 -12,3 Z" fill={c.p.ground} />
      <Glow c={c} name="magic" cx={240} cy={130} r={92} color={c.p.glow} opacity={0.95} />
      <G opacity={0.4}>
        <Figure x={252} y={210} s={1.15} {...GRANDMA} pose="out" flip />
      </G>
      <GrandmaBird x={236} y={116} s={1.5} flip />
      {[[200, 96], [270, 100], [262, 150], [214, 160], [286, 128]].map(([x, y], i) => (
        <Sparkle key={i} x={x} y={y} r={2.4 + (i % 3)} color="#FFFFFF" />
      ))}
      <Figure x={170} y={218} s={0.78} {...CHU} pose="up" />
      <Gourd x={186} y={164} s={0.95} rot={50} />
      {[[198, 148], [207, 140], [215, 133]].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r={1.8} fill="#CFEDEB" />
      ))}
      <Finish c={c} vignette={0.3} />
    </G>
  ),
  // 8 — together on the porch under the stars, singing, a cup of tea between them
  (c: SceneCtx) => (
    <G>
      <Sky c={c} top={c.p.ink} mid={c.p.sky} bottom="#7A5A7E" />
      <Stars c={c} count={60} seed={83} maxY={170} color={c.p.glow} />
      <Circle cx={304} cy={42} r={14} fill="#FBE9C4" />
      <Circle cx={311} cy={37} r={12.5} fill={c.p.sky} />
      <Ridge c={c} y={170} amp={14} seed={19} color="#3A2E46" />
      <Fireflies c={c} color={c.p.glow} count={12} area={[240, 120, 120, 70]} />
      {/* porch roof, posts and floor */}
      <Path d="M-10,-10 L250,-10 L232,26 Q110,36 -10,42 Z" fill="#2E2234" />
      <Path d="M-10,40 Q110,34 232,24" stroke="#4A3A4A" strokeWidth={3} fill="none" />
      <Rect x={26} y={34} width={9} height={170} fill="#3A2A2E" />
      <Rect x={222} y={24} width={8} height={180} fill="#3A2A2E" />
      <Rect x={0} y={198} width={c.W} height={50} fill="#4A3428" />
      <Rect x={0} y={198} width={c.W} height={4} fill="#5E4434" />
      <Path d="M70,40 L70,58" stroke="#6A4E3A" strokeWidth={1} />
      <Glow c={c} name="lamp" cx={70} cy={70} r={140} color={LAMP} opacity={0.55} />
      <OilLamp x={70} y={82} s={1.3} />
      <BambooBed x={98} y={186} w={164} />
      <Figure x={142} y={194} s={0.84} {...CHU} pose="wave" sitting />
      <Figure x={222} y={196} s={1.12} {...GRANDMA} pose="hold" sitting flip />
      {/* tea between them */}
      <Ellipse cx={182} cy={186} rx={14} ry={2.6} fill="#6A4E3A" />
      <Path d="M172,186 Q170,176 178,174 L186,174 Q192,176 190,186 Z" fill="#7A5A44" />
      <Path d="M190,180 Q196,178 196,174" stroke="#7A5A44" strokeWidth={1.6} fill="none" />
      <Path d="M192,186 L194,180 L200,180 L202,186 Z" fill="#E8DCC8" />
      <Path d="M196,176 q-2,-4 0,-8 M182,170 q2,-4 0,-8" stroke="#FFFFFF" strokeWidth={0.9} fill="none" opacity={0.5} />
      <Note x={160} y={140} s={1.1} color={c.p.glow} />
      <Note x={184} y={122} s={0.9} color={c.p.glow} />
      <Note x={206} y={136} s={1} color={c.p.glow} />
      <Finish c={c} vignette={0.38} />
    </G>
  ),
];

export const TICH_CHU: StoryScenes = { cover, pages };
