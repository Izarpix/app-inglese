import { StyleSheet, View, type ViewProps } from 'react-native';

import { London } from '@/constants/london';

type UnionJackProps = ViewProps & {
  /** Flag width in points; the height follows the 2:1 ratio of the real flag. */
  width: number;
};

/**
 * The Union Jack, drawn with plain Views instead of an image or an SVG library.
 *
 * The diagonals are long thin bars rotated by the angle of the flag's diagonal
 * and clipped by the container. The real flag counterchanges the red diagonals
 * (they are offset on each side of the white ones); this draws them centred,
 * which at watermark size nobody can tell apart.
 */
export function UnionJack({ width, style, ...rest }: UnionJackProps) {
  const height = width / 2;
  const diagonal = Math.sqrt(width * width + height * height) * 1.02;
  const angle = (Math.atan2(height, width) * 180) / Math.PI;

  const bar = (thickness: number, color: string, rotate: number) => ({
    position: 'absolute' as const,
    width: diagonal,
    height: thickness,
    left: (width - diagonal) / 2,
    top: (height - thickness) / 2,
    backgroundColor: color,
    transform: [{ rotate: `${rotate}deg` }],
  });

  return (
    <View style={[{ width, height, backgroundColor: London.royal }, styles.clip, style]} {...rest}>
      {/* white saltire */}
      <View style={bar(height * 0.3, London.white, angle)} />
      <View style={bar(height * 0.3, London.white, -angle)} />
      {/* red saltire */}
      <View style={bar(height * 0.12, London.flagRed, angle)} />
      <View style={bar(height * 0.12, London.flagRed, -angle)} />
      {/* white cross of St George */}
      <View style={[styles.centered, { width: width * 0.22, height, backgroundColor: London.white }]} />
      <View style={[styles.centered, { width, height: height * 0.36, backgroundColor: London.white }]} />
      {/* red cross of St George */}
      <View style={[styles.centered, { width: width * 0.13, height, backgroundColor: London.flagRed }]} />
      <View style={[styles.centered, { width, height: height * 0.21, backgroundColor: London.flagRed }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  centered: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
  },
});
