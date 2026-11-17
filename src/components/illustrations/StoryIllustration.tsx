import React from 'react';
import { Image } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Rect,
  G,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { IllustrationKey, PAGE_PALETTES } from '../../assets/illustrations/registry';
import { getStoryById, getStoryImageSource, getStoryPalette } from '../../data/stories';
import { COVER_H, COVER_W, Finish, PAGE_H, PAGE_W, Ridge, SceneCtx, Sky, Stars as KitStars } from './kit';
import { STORY_SCENES } from './scenes';

interface IllustrationProps {
  /** SVG illustration key, or a bundled image key like '<storyId>/page-01'. */
  pageKey: IllustrationKey | string;
  width: number;
  height: number;
}

// ─── Stars ────────────────────────────────────────────────────
const Stars: React.FC<{ count?: number; opacity?: number }> = ({
  count = 20,
  opacity = 0.7,
}) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    cx: (((i * 137 + 23) % 320) + 10).toString(),
    cy: (((i * 97 + 11) % 120) + 5).toString(),
    r: (((i * 53) % 2) + 1).toString(),
  }));
  return (
    <G opacity={opacity}>
      {stars.map((s, i) => (
        <Circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#FFFFFF" />
      ))}
    </G>
  );
};

// ─── Rabbit Figure ────────────────────────────────────────────
const RabbitFigure: React.FC<{
  x: number;
  y: number;
  size?: number;
  bodyColor?: string;
  earColor?: string;
}> = ({ x, y, size = 60, bodyColor = '#F7F3E9', earColor = '#E8C8C0' }) => {
  const s = size / 60;
  return (
    <G transform={`translate(${x}, ${y}) scale(${s})`}>
      <Ellipse cx="22" cy="-28" rx="6" ry="18" fill={bodyColor} />
      <Ellipse cx="22" cy="-28" rx="3" ry="12" fill={earColor} />
      <Ellipse cx="38" cy="-30" rx="6" ry="18" fill={bodyColor} />
      <Ellipse cx="38" cy="-30" rx="3" ry="12" fill={earColor} />
      <Circle cx="30" cy="-8" r="16" fill={bodyColor} />
      <Circle cx="25" cy="-10" r="3" fill="#292A25" />
      <Circle cx="35" cy="-10" r="3" fill="#292A25" />
      <Circle cx="26" cy="-11" r="1" fill="#FFFFFF" />
      <Circle cx="36" cy="-11" r="1" fill="#FFFFFF" />
      <Ellipse cx="30" cy="-4" rx="3" ry="2" fill="#D4A0A0" />
      <Ellipse cx="30" cy="16" rx="20" ry="22" fill={bodyColor} />
      <Circle cx="48" cy="20" r="8" fill={bodyColor} />
      <Ellipse cx="18" cy="34" rx="12" ry="6" fill={bodyColor} />
      <Ellipse cx="40" cy="34" rx="12" ry="6" fill={bodyColor} />
    </G>
  );
};

// ─── Moon ─────────────────────────────────────────────────────
const Moon: React.FC<{
  cx: number;
  cy: number;
  r: number;
  glow?: boolean;
  color?: string;
}> = ({ cx, cy, r, glow = true, color = '#F7E8B0' }) => (
  <G>
    {glow && <Circle cx={cx} cy={cy} r={r + 16} fill="rgba(247,232,176,0.12)" />}
    {glow && <Circle cx={cx} cy={cy} r={r + 8} fill="rgba(247,232,176,0.18)" />}
    <Circle cx={cx} cy={cy} r={r} fill={color} />
    <Circle cx={cx - r * 0.2} cy={cy - r * 0.1} r={r * 0.08} fill="rgba(180,160,80,0.3)" />
    <Circle cx={cx + r * 0.2} cy={cy + r * 0.1} r={r * 0.1} fill="rgba(180,160,80,0.25)" />
  </G>
);

// ─── Tree ─────────────────────────────────────────────────────
const Tree: React.FC<{
  x: number;
  y: number;
  h?: number;
  trunkColor?: string;
  leafColor?: string;
}> = ({ x, y, h = 80, trunkColor = '#5A4A30', leafColor = '#5A6A48' }) => (
  <G>
    <Rect x={x - 6} y={y - h * 0.4} width={12} height={h * 0.5} fill={trunkColor} rx={4} />
    <Ellipse cx={x} cy={y - h * 0.6} rx={h * 0.3} ry={h * 0.45} fill={leafColor} />
    <Ellipse cx={x} cy={y - h * 0.72} rx={h * 0.22} ry={h * 0.35} fill={leafColor} />
  </G>
);

// ─── Hills ────────────────────────────────────────────────────
const Hills: React.FC<{ width: number; height: number; y: number; color: string }> = ({
  width,
  height,
  y,
  color,
}) => (
  <Path
    d={`M0,${y} Q${width * 0.25},${y - height * 0.4} ${width * 0.5},${y} Q${width * 0.75},${y - height * 0.3} ${width},${y} L${width},${height * 2} L0,${height * 2} Z`}
    fill={color}
  />
);

// ─── Grass Tuft ───────────────────────────────────────────────
const GrassTuft: React.FC<{ x: number; y: number; color?: string }> = ({
  x,
  y,
  color = '#5A6A48',
}) => (
  <G>
    <Path
      d={`M${x},${y} Q${x - 4},${y - 10} ${x - 6},${y - 16}`}
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d={`M${x},${y} Q${x + 2},${y - 12} ${x + 2},${y - 18}`}
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d={`M${x},${y} Q${x + 6},${y - 10} ${x + 8},${y - 15}`}
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </G>
);

// ─── Flower ───────────────────────────────────────────────────
const Flower: React.FC<{ x: number; y: number; color?: string }> = ({
  x,
  y,
  color = '#E8C0C0',
}) => (
  <G>
    <Path d={`M${x},${y} L${x},${y - 14}`} stroke="#78866B" strokeWidth="1.5" />
    <Circle cx={x} cy={y - 16} r={5} fill={color} opacity={0.9} />
    <Circle cx={x} cy={y - 16} r={2} fill="#F7E8B0" />
  </G>
);

// ─── Burrow ───────────────────────────────────────────────────
const Burrow: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <G>
    <Ellipse cx={cx} cy={cy} rx={22} ry={10} fill="#2A2010" />
    <Ellipse cx={cx} cy={cy - 2} rx={16} ry={7} fill="#1A1408" />
  </G>
);

// ─── Page Illustrations ───────────────────────────────────────

function CoverIllustration({ w, h }: { w: number; h: number }) {
  return (
    <G>
      <Defs>
        <LinearGradient id="covSky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#0D1117" />
          <Stop offset="100%" stopColor="#1E2419" />
        </LinearGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#covSky)" />
      <Stars count={35} opacity={0.8} />
      <Moon cx={w * 0.7} cy={h * 0.22} r={45} />
      <Hills width={w} height={h} y={h * 0.72} color="#3D4A30" />
      <Rect x={0} y={h * 0.75} width={w} height={h * 0.25} fill="#3D4A30" />
      <Tree x={w * 0.1} y={h * 0.72} h={90} leafColor="#2D3B2A" />
      <Tree x={w * 0.88} y={h * 0.72} h={70} leafColor="#2D3B2A" />
      {[20, 60, 110, 170, 230, 280, 330].map((gx) => (
        <GrassTuft key={gx} x={gx} y={h * 0.74} color="#3D4A30" />
      ))}
      <RabbitFigure x={w * 0.42} y={h * 0.68} size={72} />
    </G>
  );
}

function Page1Illustration({ w, h }: { w: number; h: number }) {
  return (
    <G>
      <Defs>
        <LinearGradient id="p1sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFE8B0" />
          <Stop offset="100%" stopColor="#F7F3E9" />
        </LinearGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#p1sky)" />
      <Circle cx={w * 0.75} cy={h * 0.2} r={32} fill="#F7C66B" opacity={0.8} />
      <Circle cx={w * 0.75} cy={h * 0.2} r={22} fill="#F7A03B" />
      <Hills width={w} height={h} y={h * 0.68} color="#BFE5D8" />
      <Rect x={0} y={h * 0.72} width={w} height={h * 0.28} fill="#BFE5D8" />
      <Tree x={w * 0.2} y={h * 0.68} h={110} trunkColor="#5A4A30" leafColor="#5A7048" />
      {[w * 0.45, w * 0.55, w * 0.65, w * 0.75].map((fx, i) => (
        <Flower key={i} x={fx} y={h * 0.72} color={i % 2 === 0 ? '#E8C0C0' : '#C0D8E8'} />
      ))}
      <RabbitFigure x={w * 0.52} y={h * 0.66} size={68} />
      {[80, 140, 210, 270].map((gx) => (
        <GrassTuft key={gx} x={gx} y={h * 0.74} color="#5A7048" />
      ))}
    </G>
  );
}

function Page2Illustration({ w, h }: { w: number; h: number }) {
  return (
    <G>
      <Defs>
        <LinearGradient id="p2sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#0A0D1A" />
          <Stop offset="100%" stopColor="#1A1D2E" />
        </LinearGradient>
        <RadialGradient id="p2glow" cx="70%" cy="20%" r="40%">
          <Stop offset="0%" stopColor="rgba(247,232,176,0.25)" />
          <Stop offset="100%" stopColor="rgba(247,232,176,0)" />
        </RadialGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#p2sky)" />
      <Rect width={w} height={h} fill="url(#p2glow)" />
      <Stars count={40} opacity={0.9} />
      <Moon cx={w * 0.72} cy={h * 0.2} r={40} />
      <Hills width={w} height={h} y={h * 0.7} color="#2D3B2A" />
      <Rect x={0} y={h * 0.74} width={w} height={h * 0.26} fill="#2D3B2A" />
      <RabbitFigure x={w * 0.3} y={h * 0.68} size={65} />
      <Circle cx={w * 0.6} cy={30} r={2} fill="#F7E8B0" opacity={0.7} />
      <Circle cx={w * 0.78} cy={45} r={2} fill="#F7E8B0" opacity={0.7} />
      <Circle cx={w * 0.65} cy={20} r={1.5} fill="#F7E8B0" opacity={0.7} />
    </G>
  );
}

function Page3Illustration({ w, h }: { w: number; h: number }) {
  return (
    <G>
      <Defs>
        <LinearGradient id="p3sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#05070D" />
          <Stop offset="100%" stopColor="#0D1117" />
        </LinearGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#p3sky)" />
      <Stars count={45} opacity={0.95} />
      <Moon cx={w * 0.65} cy={h * 0.18} r={36} />
      <Path
        d={`M0,${h * 0.75} Q${w * 0.3},${h * 0.5} ${w * 0.5},${h * 0.6} Q${w * 0.7},${h * 0.68} ${w},${h * 0.75} L${w},${h} L0,${h} Z`}
        fill="#1E2B1A"
      />
      <Rect x={0} y={h * 0.78} width={w} height={h * 0.22} fill="#1E2B1A" />
      <RabbitFigure x={w * 0.46} y={h * 0.6} size={72} />
      {[1, 2, 3].map((i) => (
        <Path
          key={i}
          d={`M${w * 0.52 + i * 18},${h * 0.42} Q${w * 0.52 + i * 20},${h * 0.38} ${w * 0.52 + i * 22},${h * 0.36}`}
          stroke="#F7E8B0"
          strokeWidth={1.5}
          fill="none"
          opacity={0.5 - i * 0.1}
          strokeLinecap="round"
        />
      ))}
    </G>
  );
}

function Page4Illustration({ w, h }: { w: number; h: number }) {
  return (
    <G>
      <Defs>
        <LinearGradient id="p4sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#05070D" />
          <Stop offset="100%" stopColor="#1A1D2E" />
        </LinearGradient>
        <RadialGradient id="p4moonGlow" cx="65%" cy="20%" r="55%">
          <Stop offset="0%" stopColor="rgba(247,232,176,0.4)" />
          <Stop offset="60%" stopColor="rgba(247,232,176,0.1)" />
          <Stop offset="100%" stopColor="rgba(247,232,176,0)" />
        </RadialGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#p4sky)" />
      <Rect width={w} height={h} fill="url(#p4moonGlow)" />
      <Stars count={30} opacity={0.6} />
      <Circle cx={w * 0.65} cy={h * 0.2} r={55} fill="rgba(247,232,176,0.15)" />
      <Circle cx={w * 0.65} cy={h * 0.2} r={45} fill="rgba(247,232,176,0.25)" />
      <Moon cx={w * 0.65} cy={h * 0.2} r={36} glow={false} color="#FFFDE0" />
      {[-30, -15, 0, 15, 30].map((angle, i) => (
        <Path
          key={i}
          d={`M${w * 0.65},${h * 0.2 + 36} L${w * 0.65 + Math.sin((angle * Math.PI) / 180) * 200},${h * 0.2 + 36 + Math.cos((angle * Math.PI) / 180) * 200}`}
          stroke="rgba(247,232,176,0.08)"
          strokeWidth={20}
          fill="none"
        />
      ))}
      <Hills width={w} height={h} y={h * 0.7} color="#252F20" />
      <Rect x={0} y={h * 0.74} width={w} height={h * 0.26} fill="#252F20" />
      <RabbitFigure x={w * 0.3} y={h * 0.68} size={68} />
    </G>
  );
}

function Page5Illustration({ w, h }: { w: number; h: number }) {
  return (
    <G>
      <Defs>
        <LinearGradient id="p5sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#05070D" />
          <Stop offset="100%" stopColor="#1E2419" />
        </LinearGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#p5sky)" />
      <Stars count={50} opacity={0.9} />
      <Moon cx={w * 0.75} cy={h * 0.18} r={30} />
      <Hills width={w} height={h} y={h * 0.72} color="#1E2B1A" />
      <Rect x={0} y={h * 0.75} width={w} height={h * 0.25} fill="#1E2B1A" />
      <Burrow cx={w * 0.35} cy={h * 0.76} />
      <RabbitFigure x={w * 0.3} y={h * 0.72} size={62} />
      {/* Soft sparkles / moon rays */}
      <Path
        d={`M${w * 0.75},${h * 0.18 + 30} L${w * 0.6},${h * 0.5}`}
        stroke="rgba(247,232,176,0.12)"
        strokeWidth={8}
        fill="none"
      />
      <Path
        d={`M${w * 0.75},${h * 0.18 + 30} L${w * 0.72},${h * 0.6}`}
        stroke="rgba(247,232,176,0.1)"
        strokeWidth={8}
        fill="none"
      />
      <Path
        d={`M${w * 0.75},${h * 0.18 + 30} L${w * 0.84},${h * 0.55}`}
        stroke="rgba(247,232,176,0.08)"
        strokeWidth={8}
        fill="none"
      />
      {/* ZZZ dots */}
      <Circle cx={w * 0.42} cy={h * 0.6} r={3} fill="#C6A66B" opacity={0.4} />
      <Circle cx={w * 0.46} cy={h * 0.55} r={4} fill="#C6A66B" opacity={0.3} />
      <Circle cx={w * 0.5} cy={h * 0.49} r={5} fill="#C6A66B" opacity={0.2} />
    </G>
  );
}

function Page6Illustration({ w, h }: { w: number; h: number }) {
  return (
    <G>
      <Defs>
        <LinearGradient id="p6sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#05070D" />
          <Stop offset="100%" stopColor="#1A1D2E" />
        </LinearGradient>
        <RadialGradient id="p6glow" cx="70%" cy="20%" r="50%">
          <Stop offset="0%" stopColor="rgba(247,232,176,0.3)" />
          <Stop offset="100%" stopColor="rgba(247,232,176,0)" />
        </RadialGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#p6sky)" />
      <Rect width={w} height={h} fill="url(#p6glow)" />
      <Stars count={55} opacity={0.9} />
      <Moon cx={w * 0.7} cy={h * 0.22} r={42} />
      <Hills width={w} height={h} y={h * 0.7} color="#252F20" />
      <Rect x={0} y={h * 0.74} width={w} height={h * 0.26} fill="#252F20" />
      <Burrow cx={w * 0.32} cy={h * 0.76} />
      <RabbitFigure x={w * 0.28} y={h * 0.7} size={60} />
      {[w * 0.15, w * 0.5, w * 0.85, w * 0.4].map((sx, i) => (
        <Circle
          key={i}
          cx={sx}
          cy={h * (0.1 + i * 0.08)}
          r={2.5}
          fill="#F7E8B0"
          opacity={0.6}
        />
      ))}
      <Rect x={w * 0.1} y={h * 0.84} width={w * 0.8} height={36} rx={8} fill="rgba(0,0,0,0.3)" />
    </G>
  );
}

// ─── Illustration Map ─────────────────────────────────────────

type IllPage = { w: number; h: number };

const ILLUSTRATION_MAP: Record<IllustrationKey, React.FC<IllPage>> = {
  rabbit_cover: CoverIllustration,
  rabbit_page1: Page1Illustration,
  rabbit_page2: Page2Illustration,
  rabbit_page3: Page3Illustration,
  rabbit_page4: Page4Illustration,
  rabbit_page5: Page5Illustration,
  rabbit_page6: Page6Illustration,
};

// ─── Main Export ──────────────────────────────────────────────



/** Resolve '<storyId>/cover' or '<storyId>/page-NN' to a vector scene. */
function resolveScene(key: string) {
  const m = /^([a-z0-9-]+)\/(cover|page-(\d+))$/.exec(key);
  if (!m) return null;
  const story = getStoryById(m[1]);
  const scenes = STORY_SCENES[m[1]];
  const palette = getStoryPalette(story);
  if (!scenes) return { scene: null, palette, isCover: m[2] === 'cover' };
  if (m[2] === 'cover') return { scene: scenes.cover, palette, isCover: true };
  const index = parseInt(m[3], 10) - 1;
  return { scene: scenes.pages[index] ?? null, palette, isCover: false };
}

/** Quiet branded placeholder in the story's own palette (never a broken image). */
function PaletteFallback({ c }: { c: SceneCtx }) {
  return (
    <G>
      <Sky c={c} top={c.p.sky} bottom={c.p.skyLow} />
      <KitStars c={c} count={18} seed={7} color="#FFFFFF" opacity={0.45} />
      <Circle cx={c.W * 0.68} cy={c.H * 0.3} r={Math.min(c.W, c.H) * 0.12} fill={c.p.glow} opacity={0.9} />
      <Ridge c={c} y={c.H * 0.72} amp={c.H * 0.08} seed={7} color={c.p.ground} />
      <Ridge c={c} y={c.H * 0.84} amp={c.H * 0.05} seed={3} color={c.p.groundDeep} />
      <Finish c={c} />
    </G>
  );
}

export const StoryIllustration: React.FC<IllustrationProps> = ({
  pageKey,
  width,
  height,
}) => {
  // Gradient ids are document-global on web: give every instance its own prefix.
  const uid = 'i' + React.useId().replace(/[^a-zA-Z0-9]/g, '');

  // Prefer a bundled picture-book PNG when the asset pack provides one.
  const imageSource = getStoryImageSource(pageKey);
  if (imageSource) {
    return (
      <Image
        source={imageSource}
        style={{ width, height }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    );
  }

  const resolved = resolveScene(pageKey);
  if (resolved) {
    const W = resolved.isCover ? COVER_W : PAGE_W;
    const H = resolved.isCover ? COVER_H : PAGE_H;
    const ctx: SceneCtx = { W, H, uid, p: resolved.palette };
    return (
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        {resolved.scene ? resolved.scene(ctx) : <PaletteFallback c={ctx} />}
      </Svg>
    );
  }

  const IllComp = ILLUSTRATION_MAP[pageKey as IllustrationKey];

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {IllComp ? (
        <IllComp w={width} h={height} />
      ) : (
        <G>
          <Rect width={width} height={height} fill="#1E2419" />
          <Circle cx={width / 2} cy={height * 0.3} r={40} fill="#F7E8B0" opacity={0.8} />
        </G>
      )}
    </Svg>
  );
};
