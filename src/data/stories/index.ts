// ============================================================
// Story catalogue
// Bilingual text lives in ./content/*.json (also read by the asset
// scripts); bundled illustrations and narration MP3s come from the
// generated static-require registry ./storyAssets.generated.ts.
// Regenerate the registry with: node scripts/story-assets.mjs
// ============================================================

import { ImageSourcePropType } from 'react-native';
import { BilingualText, Story, StoryArtDirection, StoryPalette } from '../../types/story';
import { LITTLE_RABBIT_STORY } from './littleRabbit';
import { STORY_ASSETS } from './storyAssets.generated';

import everydayConversations from './content/100-everyday-conversations.json';
import chuCuoi from './content/chu-cuoi.json';
import cayKhe from './content/cay-khe.json';
import tamCam from './content/tam-cam.json';
import banhChungBanhGiay from './content/banh-chung-banh-giay.json';
import sonTinhThuyTinh from './content/son-tinh-thuy-tinh.json';
import thanhGiong from './content/thanh-giong.json';
import maiAnTiem from './content/mai-an-tiem.json';
import hoGuom from './content/ho-guom.json';
import cocKienTroi from './content/coc-kien-troi.json';
import tichChu from './content/tich-chu.json';
import soDua from './content/so-dua.json';
import suTichTrauCau from './content/su-tich-trau-cau.json';
import nangTienOc from './content/nang-tien-oc.json';
import ruaVaTho from './content/rua-va-tho.json';
import suTuVaChuot from './content/su-tu-va-chuot.json';
import quaVaBinhNuoc from './content/qua-va-binh-nuoc.json';
import domDomSoiDuong from './content/dom-dom-soi-duong.json';
import mayNhoLamMua from './content/may-nho-lam-mua.json';
import thuyenGiayDamSen from './content/thuyen-giay-dam-sen.json';
import ngoiSaoBeTi from './content/ngoi-sao-be-ti.json';

interface StoryContent {
  id: string;
  title: BilingualText;
  description: BilingualText;
  theme: BilingualText;
  category: string;
  ageRange: string;
  duration: string;
  artDirection?: StoryArtDirection;
  pages: Array<{ sentences: string[][] }>;
}

const pad = (n: number) => String(n).padStart(2, '0');

function buildStory(content: StoryContent): Story {
  const assets = STORY_ASSETS[content.id];
  return {
    id: content.id,
    title: content.title,
    description: content.description,
    theme: content.theme,
    coverImage: `${content.id}/cover`,
    coverImageSource: assets?.cover,
    duration: content.duration,
    ageRange: content.ageRange,
    category: content.category,
    languages: ['en', 'vi'],
    art: content.artDirection,
    pages: content.pages.map((page, pi) => {
      const pageAssets = assets?.pages[pi];
      return {
        id: `page-${pad(pi + 1)}`,
        image: `${content.id}/page-${pad(pi + 1)}`,
        imageSource: pageAssets?.image,
        sentences: page.sentences.map(([en, vi], si) => ({
          id: `p${pad(pi + 1)}-s${pad(si + 1)}`,
          en,
          vi,
          audio: pageAssets?.sentences[si],
        })),
      };
    }),
  };
}

export const FOLK_TALES: Story[] = [
  chuCuoi,
  cayKhe,
  tamCam,
  banhChungBanhGiay,
  sonTinhThuyTinh,
  thanhGiong,
  maiAnTiem,
  hoGuom,
  cocKienTroi,
  tichChu,
  soDua,
  suTichTrauCau,
  nangTienOc,
  ruaVaTho,
  suTuVaChuot,
  quaVaBinhNuoc,
].map((c) => buildStory(c as StoryContent));

/** Original StoryMoon bedtime stories (Vietnamese-first, English companion text). */
export const ORIGINAL_STORIES: Story[] = [
  domDomSoiDuong,
  mayNhoLamMua,
  thuyenGiayDamSen,
  ngoiSaoBeTi,
].map((c) => buildStory(c as StoryContent));

export const ALL_STORIES: Story[] = [
  buildStory(everydayConversations as StoryContent),
  LITTLE_RABBIT_STORY,
  ...FOLK_TALES,
  ...ORIGINAL_STORIES,
];

/** Illustration lookup by key ('<storyId>/cover' or '<storyId>/page-NN'). */
const IMAGE_BY_KEY: Record<string, ImageSourcePropType> = {};
for (const s of ALL_STORIES) {
  if (s.coverImageSource) IMAGE_BY_KEY[s.coverImage] = s.coverImageSource;
  for (const p of s.pages) {
    if (p.imageSource) IMAGE_BY_KEY[p.image] = p.imageSource;
  }
}

export function getStoryById(id: string): Story | undefined {
  return ALL_STORIES.find((s) => s.id === id);
}

export function getStoryImageSource(key: string): ImageSourcePropType | undefined {
  return IMAGE_BY_KEY[key];
}

/** Brand palette used when a story has no art direction of its own. */
export const DEFAULT_STORY_PALETTE: StoryPalette = {
  sky: '#1E2433',
  skyLow: '#3A4A52',
  ground: '#3D4A30',
  groundDeep: '#1E2B1A',
  accent: '#C6A66B',
  glow: '#F3E3B5',
  ink: '#10131C',
  paper: '#F0E9D6',
};

export function getStoryPalette(story?: Story | null): StoryPalette {
  return story?.art?.palette ?? DEFAULT_STORY_PALETTE;
}
