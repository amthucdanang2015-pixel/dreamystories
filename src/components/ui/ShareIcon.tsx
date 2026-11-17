import React from 'react';
import { Platform } from 'react-native';
import { Share, Share2 } from 'lucide-react-native';

/** The platform's familiar share glyph: box-and-arrow on iOS/web, nodes on Android. */
export function ShareIcon({ size = 20, color, strokeWidth = 2.1 }: { size?: number; color: string; strokeWidth?: number }) {
  const Icon = Platform.OS === 'android' ? Share2 : Share;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
