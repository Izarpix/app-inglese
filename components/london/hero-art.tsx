import { Image, type ImageStyle } from 'expo-image';
import type { StyleProp } from 'react-native';

const ARTWORK = {
  study: require('@/assets/images/london-hero.png'),
  progress: require('@/assets/images/progress-hero.png'),
  rewards: require('@/assets/images/rewards-hero.png'),
  profile: require('@/assets/images/profile-hero.png'),
} as const;

export function LondonHeroArt({
  variant = 'study',
  style,
}: {
  variant?: keyof typeof ARTWORK;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={ARTWORK[variant]}
      contentFit="contain"
      contentPosition="right bottom"
      priority="high"
      style={style}
    />
  );
}
