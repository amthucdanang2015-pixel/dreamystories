import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Image, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SPLASH_BACKGROUND } from '../../utils/appearanceScheme';

// Must match the expo-splash-screen config in app.json (image + imageWidth) so
// the overlay's first frame is identical to the native launch screen. The
// splash is always the Light design, whatever the device or App Appearance.
const LOGO = Platform.select({
  android: { size: 192, source: require('../../../assets/images/splash-logo-android.png') },
  default: { size: 300, source: require('../../../assets/images/splash-logo.png') },
});

const DURATION_MS = 650;
const REDUCED_MOTION_DURATION_MS = 150;
// If the overlay's image isn't drawn by then, skip the transition entirely.
const IMAGE_TIMEOUT_MS = 600;

/**
 * Optional, subtle hand-off from the static native splash into the app.
 *
 * Invariant: the native splash (which already shows the full artwork) is only
 * hidden once this overlay has drawn the *same* artwork in the same place, so
 * there is never a frame of bare background. If the image can't be drawn in
 * time, the native splash hides straight to the app with no overlay at all.
 *
 * pointerEvents="none": the app underneath is live from the first frame, so
 * the animation never blocks access.
 */
export function LaunchTransition({ isReady }: { isReady: boolean }) {
  const progress = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const [handedOff, setHandedOff] = useState(false);
  const [done, setDone] = useState(false);
  const settled = useRef(false);

  // Image painted → reveal the JS splash immediately so it can gently breathe
  // while app state hydrates, then fade into the app when it is ready.
  const handOff = () => {
    if (settled.current) return;
    settled.current = true;
    // onLoad fires when the bitmap is ready; wait two frames so it's on screen.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        SplashScreen.hide();
        setHandedOff(true);
      }),
    );
  };

  const finish = () => {
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduceMotion) => {
        breathe.stopAnimation();
        Animated.timing(progress, {
          toValue: 1,
          duration: reduceMotion ? REDUCED_MOTION_DURATION_MS : DURATION_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start(() => setDone(true));
      });
  };

  useEffect(() => {
    if (!handedOff || done) return;
    if (isReady) {
      finish();
      return;
    }

    let animation: Animated.CompositeAnimation | null = null;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduceMotion) => {
        if (reduceMotion || done || isReady) return;
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(breathe, {
              toValue: 1,
              duration: 1500,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(breathe, {
              toValue: 0,
              duration: 1500,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        );
        animation.start();
      });

    return () => animation?.stop();
  }, [isReady, done, breathe, handedOff]);

  // Overlay can't match the splash → skip it; reveal the app directly.
  const skip = () => {
    if (settled.current) return;
    settled.current = true;
    setDone(true);
    SplashScreen.hide();
  };

  useEffect(() => {
    const t = setTimeout(skip, IMAGE_TIMEOUT_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.025] });
  const breathingScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.012] });

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[StyleSheet.absoluteFill, styles.overlay, { opacity }]}
    >
      {/* Dark status-bar content on the light splash, as at launch (Info.plist
          UIStatusBarStyleDarkContent); the app's own style returns on unmount. */}
      <StatusBar style="dark" />
      <Animated.View style={{ transform: [{ scale: Animated.multiply(scale, breathingScale) }] }}>
        <Image
          source={LOGO.source}
          style={{ width: LOGO.size, height: LOGO.size }}
          resizeMode="contain"
          fadeDuration={0}
          onLoad={handOff}
          onError={skip}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: SPLASH_BACKGROUND, // same as the native splash
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
});
