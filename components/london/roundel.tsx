import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { London } from '@/constants/london';

type RoundelProps = ViewProps & {
  size: number;
  /** Word written across the bar, like a station name on the real roundel. */
  label?: string;
};

/** The London Underground roundel: red ring crossed by a blue bar. */
export function Roundel({ size, label, style, ...rest }: RoundelProps) {
  const ring = size * 0.16;

  return (
    <View style={[{ width: size, height: size }, styles.root, style]} {...rest}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ring,
          borderColor: London.bus,
        }}
      />
      <View
        style={[
          styles.bar,
          {
            width: size * 1.18,
            height: size * 0.26,
            top: size * 0.37,
            left: -size * 0.09,
            backgroundColor: London.tube,
          },
        ]}>
        {label ? (
          <Text numberOfLines={1} style={[styles.label, { fontSize: size * 0.15 }]}>
            {label}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center' },
  bar: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: London.white,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
