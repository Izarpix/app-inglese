import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { London } from '@/constants/london';
import { isUnlocked, type Reward } from '@/src/domain/rewards';

/**
 * Placeholder badge: a coloured medal with an emoji.
 *
 * When the real artwork exists, drop a PNG per reward id in
 * `assets/images/rewards/<id>.png` and swap this body for an <Image>; nothing
 * else in the app needs to change.
 */
export function RewardBadge({ reward, size = 64 }: { reward: Reward; size?: number }) {
  const unlocked = isUnlocked(reward);

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: unlocked ? reward.color : London.stoneDeep,
          borderColor: unlocked ? London.gold : London.line,
        },
      ]}>
      <MaterialCommunityIcons
        name={reward.icon as keyof typeof MaterialCommunityIcons.glyphMap}
        size={size * 0.46}
        color={unlocked ? London.white : London.fog}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
});
