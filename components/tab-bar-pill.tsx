import { StyleSheet, View } from 'react-native';

import { London, Radius, Shadows } from '@/constants/london';

/**
 * The white dock behind the tab bar.
 *
 * It exists because of a limit measured on the iPhone (ADR-019): a web app
 * launched from the home screen can get a window shorter than the physical
 * screen. The dock deliberately continues below that window; Safari fills the
 * unreachable remainder with the same white, so the navigation reads as one
 * continuous surface instead of a floating pill with a beige hole underneath.
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
    bottom: -120,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    backgroundColor: London.white,
    borderTopWidth: 1,
    borderTopColor: London.line,
    ...Shadows.raised,
  },
});
