import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { London } from '@/constants/london';

type PhoneBoxProps = ViewProps & {
  /** Height in points; the box keeps the proportions of a real K6 kiosk. */
  height: number;
};

/**
 * The red telephone box (the K6 kiosk), drawn with Views: crown-topped roof,
 * TELEPHONE sign, and three columns of window panes.
 */
export function PhoneBox({ height, style, ...rest }: PhoneBoxProps) {
  const width = height * 0.46;
  const pane = { flex: 1, backgroundColor: 'rgba(255,255,255,0.82)', borderRadius: 1 };

  return (
    <View style={[{ width, height }, style]} {...rest}>
      {/* roof */}
      <View style={[styles.roofCap, { width: width * 0.34, height: height * 0.02 }]} />
      <View style={[styles.roof, { width, height: height * 0.09 }]} />
      {/* TELEPHONE sign */}
      <View style={[styles.sign, { width, height: height * 0.09 }]}>
        <Text numberOfLines={1} style={[styles.signText, { fontSize: height * 0.045 }]}>
          TELEPHONE
        </Text>
      </View>
      {/* windows */}
      <View style={[styles.body, { width, paddingHorizontal: width * 0.09, gap: width * 0.05 }]}>
        {[0, 1, 2].map((column) => (
          <View key={column} style={[styles.column, { gap: height * 0.012 }]}>
            {[0, 1, 2, 3, 4].map((row) => (
              <View key={row} style={pane} />
            ))}
          </View>
        ))}
      </View>
      {/* base */}
      <View style={[styles.base, { width, height: height * 0.05 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  roofCap: {
    alignSelf: 'center',
    backgroundColor: '#8E1218',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  roof: {
    backgroundColor: '#B81C22',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  sign: {
    backgroundColor: '#F3E9D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signText: {
    color: '#1A1A1A',
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: London.phoneBox,
    paddingVertical: 8,
  },
  column: { flex: 1 },
  base: {
    backgroundColor: '#8E1218',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});
