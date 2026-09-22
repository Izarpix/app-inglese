import { StyleSheet, View } from 'react-native';

import { London, Radius, Shadows } from '@/constants/london';

/**
 * The white floating pill behind the tab bar.
 *
 * The navigator positions the whole bar over the scrolling page. Keeping the
 * shape self-contained means content remains visible behind and below it, so
 * iOS cannot turn its shortened layout viewport into a large empty panel.
 */
export function TabBarPill() {
  return <View style={styles.dock} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: Radius.xl,
    // A little translucency lets the page continue underneath the floating
    // dock, rather than creating an opaque white strip at the bottom.
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderWidth: 1,
    borderColor: London.line,
    ...Shadows.raised,
  },
});
