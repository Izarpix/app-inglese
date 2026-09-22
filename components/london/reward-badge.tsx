import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { London } from '@/constants/london';
import { isUnlocked, type Reward } from '@/src/domain/rewards';

const ARTWORK: Record<string, ImageSource> = {
  'first-steps': require('@/assets/images/rewards/first-steps.png'),
  'tube-pass': require('@/assets/images/rewards/tube-pass.png'),
  'double-decker': require('@/assets/images/rewards/double-decker.png'),
  'big-ben': require('@/assets/images/rewards/big-ben.png'),
  'spot-on': require('@/assets/images/rewards/spot-on.png'),
  'royal-flush': require('@/assets/images/rewards/royal-flush.png'),
  'london-passport': require('@/assets/images/rewards/london-passport.png'),
};

/** Dedicated enamel artwork, dimmed and locked until the reward is earned. */
export function RewardBadge({ reward, size = 64 }: { reward: Reward; size?: number }) {
  const unlocked = isUnlocked(reward);

  return (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2 }]}>
      {ARTWORK[reward.id] ? <Image source={ARTWORK[reward.id]} contentFit="contain" transition={180} style={[styles.artwork, !unlocked && styles.artworkLocked]} /> : <MaterialCommunityIcons name={reward.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={size * 0.56} color={unlocked ? London.gold : London.fog} />}
      {!unlocked ? (
        <View style={styles.lock}>
          <MaterialCommunityIcons name="lock" size={size * 0.2} color={London.white} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: London.royal,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  artwork: { width: '100%', height: '100%' },
  artworkLocked: { opacity: 0.28 },
  lock: {
    position: 'absolute',
    width: '36%',
    height: '36%',
    borderRadius: 999,
    backgroundColor: 'rgba(16,42,67,0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
});
