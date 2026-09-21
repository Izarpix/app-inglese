import { StyleSheet, View } from 'react-native';

import { London, Radius, Shadows } from '@/constants/london';

/**
 * The white rounded shape behind the tab bar.
 *
 * It exists because of a limit measured on the iPhone (ADR-019): a web app
 * launched from the home screen gets a window 62 pt shorter than the screen, so
 * the bar can never touch the bottom edge. A bar that is *supposed* to touch it
 * looks broken with that gap; a bar that floats is supposed to have room around
 * it, so the same 62 pt read as margin.
 *
 * The bar itself stays transparent and this shape is drawn behind it, which
 * keeps the navigator reserving the bar's height: nothing ends up hidden
 * underneath.
 */
export function TabBarPill({ bottom }: { bottom: number }) {
  return <View style={[styles.pill, { bottom: 6 + bottom }]} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 6,
    borderRadius: Radius.lg,
    backgroundColor: London.white,
    borderWidth: 1,
    borderColor: London.line,
    // soft lift, so the pill reads as sitting above the page
    ...Shadows.raised,
  },
});
