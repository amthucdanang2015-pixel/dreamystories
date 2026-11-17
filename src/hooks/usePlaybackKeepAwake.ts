// ============================================================
// usePlaybackKeepAwake — keeps the screen on while a story is read aloud,
// so a child can follow along without the device dimming or locking.
// Released as soon as playback stops/pauses/finishes/fails, the app leaves
// the foreground, another screen covers the reader, or the reader unmounts.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import type { PlaybackStatus } from '../store/playbackStore';
import { createKeepAwakeController, shouldKeepScreenAwake } from '../utils/keepAwakePolicy';

const TAG = 'storymoon-story-playback';

export function usePlaybackKeepAwake(status: PlaybackStatus): void {
  const isFocused = useIsFocused();
  const [appState, setAppState] = useState<string>(AppState.currentState ?? 'active');

  const controller = useRef(
    createKeepAwakeController(
      { activate: activateKeepAwakeAsync, deactivate: deactivateKeepAwake },
      TAG,
      (err) => console.warn('Keep-awake unavailable:', err)
    )
  ).current;

  useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    controller.set(shouldKeepScreenAwake({ status, appState, isFocused }));
  }, [controller, status, appState, isFocused]);

  // Leaving the reader always restores the normal screen timeout.
  useEffect(() => () => controller.release(), [controller]);
}
