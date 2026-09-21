import { StyleSheet, View, type ViewProps } from 'react-native';

import { London } from '@/constants/london';

/** A quiet Tube-map motif used behind hero content. */
export function CityLines({ style, ...rest }: ViewProps) {
  return (
    <View pointerEvents="none" style={[styles.root, style]} {...rest}>
      <View style={[styles.line, styles.red]} />
      <View style={[styles.line, styles.gold]} />
      <View style={[styles.line, styles.blue]} />
      <View style={[styles.stop, styles.stopOne]} />
      <View style={[styles.stop, styles.stopTwo]} />
      <View style={[styles.stop, styles.stopThree]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', width: 250, height: 150, opacity: 0.2 },
  line: { position: 'absolute', height: 3, borderRadius: 2 },
  red: { width: 220, top: 42, left: 10, backgroundColor: London.flagRed, transform: [{ rotate: '-18deg' }] },
  gold: { width: 210, top: 76, left: 24, backgroundColor: London.gold, transform: [{ rotate: '22deg' }] },
  blue: { width: 190, top: 105, left: 38, backgroundColor: '#7EB4EE', transform: [{ rotate: '-8deg' }] },
  stop: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: London.white,
    borderWidth: 3,
    borderColor: London.gold,
  },
  stopOne: { left: 58, top: 51 },
  stopTwo: { left: 145, top: 82 },
  stopThree: { left: 201, top: 65, borderColor: London.flagRed },
});
