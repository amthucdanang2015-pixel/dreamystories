import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@storymoon_reading_progress_v1';

export interface StoryProgress {
  storyId: string;
  pageIndex: number; // 0-based
  totalPages: number;
  completed: boolean;
  updatedAt: number;
}

interface ProgressStore {
  progressMap: Record<string, StoryProgress>;
  lastReadStoryId: string | null;
  isLoaded: boolean;
  loadProgress: () => Promise<void>;
  saveProgress: (storyId: string, pageIndex: number, totalPages: number) => Promise<void>;
  markCompleted: (storyId: string) => Promise<void>;
  clearProgress: (storyId: string) => Promise<void>;
  getActiveProgress: () => StoryProgress | null;
  getProgress: (storyId: string) => StoryProgress | null;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progressMap: {},
  lastReadStoryId: null,
  isLoaded: false,

  loadProgress: async () => {
    try {
      const stored = await AsyncStorage.getItem(PROGRESS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          progressMap: Record<string, StoryProgress>;
          lastReadStoryId: string | null;
        };
        set({
          progressMap: parsed.progressMap || {},
          lastReadStoryId: parsed.lastReadStoryId || null,
          isLoaded: true,
        });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  saveProgress: async (storyId: string, pageIndex: number, totalPages: number) => {
    // Only markCompleted() (reached "The End") finishes a story; arriving on
    // the last page is still in progress, so it can be resumed.
    const progressItem: StoryProgress = {
      storyId,
      pageIndex,
      totalPages,
      completed: false,
      updatedAt: Date.now(),
    };

    const nextMap = {
      ...get().progressMap,
      [storyId]: progressItem,
    };

    set({
      progressMap: nextMap,
      lastReadStoryId: storyId,
    });

    try {
      await AsyncStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          progressMap: nextMap,
          lastReadStoryId: storyId,
        })
      );
    } catch {}
  },

  markCompleted: async (storyId: string) => {
    const current = get().progressMap[storyId];
    if (!current) return;

    const nextMap = {
      ...get().progressMap,
      [storyId]: {
        ...current,
        completed: true,
        updatedAt: Date.now(),
      },
    };

    set({ progressMap: nextMap });
    try {
      await AsyncStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          progressMap: nextMap,
          lastReadStoryId: get().lastReadStoryId,
        })
      );
    } catch {}
  },

  clearProgress: async (storyId: string) => {
    const nextMap = { ...get().progressMap };
    delete nextMap[storyId];
    const nextLast = get().lastReadStoryId === storyId ? null : get().lastReadStoryId;
    set({ progressMap: nextMap, lastReadStoryId: nextLast });

    try {
      await AsyncStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          progressMap: nextMap,
          lastReadStoryId: nextLast,
        })
      );
    } catch {}
  },

  getActiveProgress: () => {
    const { progressMap, lastReadStoryId } = get();

    // Check last read story first
    if (lastReadStoryId && progressMap[lastReadStoryId]) {
      const p = progressMap[lastReadStoryId];
      if (!p.completed && p.pageIndex > 0) {
        return p;
      }
    }

    // Otherwise find the most recent incomplete progress with pageIndex > 0
    const list = Object.values(progressMap)
      .filter((p) => !p.completed && p.pageIndex > 0)
      .sort((a, b) => b.updatedAt - a.updatedAt);

    return list[0] || null;
  },

  getProgress: (storyId: string) => {
    return get().progressMap[storyId] || null;
  },
}));

