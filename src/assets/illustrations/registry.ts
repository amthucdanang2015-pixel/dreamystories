// ============================================================
// Story Illustration Registry
// Maps image keys to require() paths
// Replace these with real illustration assets when available.
// ============================================================

// Since we're using SVG illustrations rendered inline,
// this module maps page IDs to illustration component names
// for the demo story.

export type IllustrationKey =
  | 'rabbit_cover'
  | 'rabbit_page1'
  | 'rabbit_page2'
  | 'rabbit_page3'
  | 'rabbit_page4'
  | 'rabbit_page5'
  | 'rabbit_page6';

// Colors for each illustrated page (used by SVG illustrations)
export const PAGE_PALETTES: Record<IllustrationKey, {
  sky: string;
  ground: string;
  accent1: string;
  accent2: string;
  moon: string;
}> = {
  rabbit_cover: {
    sky: '#1E2419',
    ground: '#3D4A30',
    accent1: '#BFE5D8',
    accent2: '#78866B',
    moon: '#F7E8B0',
  },
  rabbit_page1: {
    sky: '#FFF3DC',
    ground: '#BFE5D8',
    accent1: '#78866B',
    accent2: '#E8D5A8',
    moon: '#F7F3E9',
  },
  rabbit_page2: {
    sky: '#1A1D2E',
    ground: '#2D3B2A',
    accent1: '#F7E8B0',
    accent2: '#BFE5D8',
    moon: '#FFF3DC',
  },
  rabbit_page3: {
    sky: '#0D1117',
    ground: '#1E2B1A',
    accent1: '#C6A66B',
    accent2: '#78866B',
    moon: '#F0E8C0',
  },
  rabbit_page4: {
    sky: '#1A1D2E',
    ground: '#252F20',
    accent1: '#F7E8B0',
    accent2: '#BFE5D8',
    moon: '#FFFFFF',
  },
  rabbit_page5: {
    sky: '#0D1117',
    ground: '#1E2B1A',
    accent1: '#C6A66B',
    accent2: '#78866B',
    moon: '#F0E8C0',
  },
  rabbit_page6: {
    sky: '#1A1D2E',
    ground: '#252F20',
    accent1: '#F7E8B0',
    accent2: '#BFE5D8',
    moon: '#FFFFFF',
  },
};

