import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Gradient } from '@/components/london/gradient';
import { RewardBadge } from '@/components/london/reward-badge';
import { Gradients, London, Radius } from '@/constants/london';
import { computeRewards, isUnlocked } from '@/src/domain/rewards';
import { useAppState } from '@/src/store/app-state';

export default function RewardsScreen() {
  const { answers } = useAppState();
  const rewards = computeRewards(answers);
  const unlocked = rewards.filter(isUnlocked).length;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Gradient colors={Gradients.sunset} style={styles.header}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerContent}>
              <Text style={styles.kicker}>YOUR COLLECTION</Text>
              <Text style={styles.title}>Rewards</Text>
              <Text style={styles.subtitle}>
                {unlocked} of {rewards.length} unlocked
              </Text>
            </View>
          </SafeAreaView>
        </Gradient>

        <View style={styles.body}>
          {rewards.map((reward) => {
            const done = isUnlocked(reward);
            return (
              <View key={reward.id} style={[styles.card, done && styles.cardDone]}>
                <RewardBadge reward={reward} size={62} />
                <View style={styles.text}>
                  <Text style={styles.name}>{reward.title}</Text>
                  <Text style={styles.desc}>{reward.description}</Text>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.fill,
                        {
                          width: `${Math.round((reward.progress / reward.target) * 100)}%`,
                          backgroundColor: done ? London.gold : London.tube,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {reward.progress} / {reward.target}
                  </Text>
                </View>
              </View>
            );
          })}

          <Text style={styles.note}>
            The medals are placeholders: drop your PNGs into{' '}
            <Text style={styles.code}>assets/images/rewards/</Text> and they take over.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: London.stone },
  scroll: { paddingBottom: 40 },
  header: { paddingBottom: 26 },
  headerContent: { paddingHorizontal: 20, paddingTop: 14, gap: 2 },
  kicker: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  title: { color: London.white, fontSize: 32, fontWeight: '900' },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' },
  body: { padding: 20, gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    backgroundColor: London.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: London.line,
    padding: 14,
  },
  cardDone: { borderColor: London.gold, borderWidth: 2 },
  text: { flex: 1, gap: 4 },
  name: { color: London.cab, fontSize: 15, fontWeight: '800' },
  desc: { color: London.fog, fontSize: 12.5, lineHeight: 17 },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: London.stoneDeep,
    overflow: 'hidden',
    marginTop: 4,
  },
  fill: { height: 6, borderRadius: 3 },
  progressText: { color: London.fog, fontSize: 11, fontWeight: '700' },
  note: { color: London.fog, fontSize: 12, lineHeight: 17, marginTop: 6 },
  code: { fontWeight: '700', color: London.cab },
});
