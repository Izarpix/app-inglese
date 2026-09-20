import { StyleSheet, View, type ViewProps } from 'react-native';

type GradientProps = ViewProps & {
  colors: [string, string];
  /** Number of colour bands. More bands means smoother, 24 is already invisible. */
  steps?: number;
};

/**
 * A vertical gradient built from stacked colour bands.
 *
 * React Native has no native gradient and `expo-linear-gradient` is one more
 * dependency; interpolating a couple of dozen flat bands looks identical on a
 * phone screen and costs nothing.
 */
export function Gradient({ colors, steps = 24, style, children, ...rest }: GradientProps) {
  const [from, to] = colors;

  return (
    <View style={[styles.root, style]} {...rest}>
      <View style={StyleSheet.absoluteFill}>
        {Array.from({ length: steps }, (_, i) => (
          <View key={i} style={[styles.band, { backgroundColor: mix(from, to, i / (steps - 1)) }]} />
        ))}
      </View>
      {children}
    </View>
  );
}

/** Linear interpolation between two `#rrggbb` colours. */
function mix(from: string, to: string, t: number): string {
  const a = parseHex(from);
  const b = parseHex(to);
  const channel = (i: number) => Math.round(a[i] + (b[i] - a[i]) * t);
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
}

function parseHex(hex: string): [number, number, number] {
  const value = parseInt(hex.replace('#', ''), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

const styles = StyleSheet.create({
  root: { overflow: 'hidden' },
  band: { flex: 1 },
});
