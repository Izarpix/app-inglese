import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Gradient } from '@/components/london/gradient';
import { LondonHeroArt } from '@/components/london/hero-art';
import { RewardBadge } from '@/components/london/reward-badge';
import { SafeTop } from '@/components/safe-top';
import { Gradients, London, Radius, Shadows } from '@/constants/london';
import { computeRewards, isUnlocked } from '@/src/domain/rewards';
import { useAppState } from '@/src/store/app-state';

export default function RewardsScreen() {
  const { answers } = useAppState();
  const rewards = computeRewards(answers);
  const unlocked = rewards.filter(isUnlocked).length;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SafeTop>
          <Gradient colors={Gradients.sunset} style={styles.header}>
            <LondonHeroArt variant="rewards" style={styles.headerArt} />
            <View style={styles.headerContent}>
              <Text style={styles.kicker}>YOUR COLLECTION</Text>
              <Text style={styles.title}>Rewards</Text>
              <Text style={styles.subtitle}>
                {unlocked} of {rewards.length} unlocked
              </Text>
            </View>
          </Gradient>
        </SafeTop>

        <View style={styles.body}>
          <View style={styles.passport}>
            <View style={styles.passportIcon}>
              <MaterialCommunityIcons name="passport" size={27} color={London.gold} />
            </View>
            <View style={styles.passportText}>
              <Text style={styles.passportKicker}>LONDON LEARNER PASS</Text>
              <Text style={styles.passportTitle}>{unlocked ? `${unlocked} stamps collected` : 'Your collection starts here'}</Text>
            </View>
            <Text style={styles.passportNumber}>№ {String(unlocked + 1).padStart(3, '0')}</Text>
          </View>
          {rewards.map((reward, index) => {
            const done = isUnlocked(reward);
            return (
              <View key={reward.id} style={[styles.card, done && styles.cardDone]}>
                <RewardBadge reward={reward} size={84} />
                <View style={styles.text}>
                  <View style={styles.cardMeta}>
                    <Text style={styles.serial}>LONDON BADGE · 0{index + 1}</Text>
                    {done ? (
                      <View style={styles.collectedPill}>
                        <Text style={styles.collectedText}>COLLECTED</Text>
                      </View>
                    ) : null}
                  </View>
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
                    {done ? 'Mastered' : `${reward.progress} of ${reward.target}`}
                  </Text>
                </View>
              </View>
            );
          })}

          <Text style={styles.note}>Keep travelling through the course to fill your London learner pass.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: London.stone },
  scroll: { paddingBottom: 40 },
  header: {
    paddingBottom: 26,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerArt: { position: 'absolute', width: '70%', height: 188, right: -14, top: -20, opacity: 0.72 },
  headerContent: { paddingHorizontal: 20, paddingTop: 14, gap: 2 },
  kicker: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  title: { color: London.white, fontSize: 32, fontWeight: '900' },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' },
  body: { padding: 20, gap: 12 },
  passport: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: London.royal, borderRadius: Radius.lg, padding: 16, marginBottom: 4, ...Shadows.raised },
  passportIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)' },
  passportText: { flex: 1 },
  passportKicker: { color: London.gold, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  passportTitle: { color: London.white, fontSize: 14, fontWeight: '700', marginTop: 3 },
  passportNumber: { color: 'rgba(255,255,255,0.46)', fontSize: 10, fontWeight: '800', transform: [{ rotate: '90deg' }] },
  card: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    backgroundColor: London.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: London.line,
    padding: 16,
    ...Shadows.card,
  },
  cardDone: { borderColor: London.gold, borderWidth: 1.5, backgroundColor: '#FFFDF7' },
  text: { flex: 1, gap: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  serial: { flex: 1, color: London.flagRed, fontSize: 8.5, fontWeight: '900', letterSpacing: 0.8 },
  collectedPill: { backgroundColor: '#E7F4EF', borderRadius: 999, paddingHorizontal: 7, paddingVertical: 3 },
  collectedText: { color: London.park, fontSize: 7.5, fontWeight: '900', letterSpacing: 0.5 },
  name: { color: London.cab, fontSize: 17, fontWeight: '900', letterSpacing: -0.2 },
  desc: { color: London.fog, fontSize: 12.5, lineHeight: 17 },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: London.stoneDeep,
    overflow: 'hidden',
    marginTop: 4,
  },
  fill: { height: 6, borderRadius: 3 },
  progressText: { color: London.fog, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  note: { color: London.fog, fontSize: 12, lineHeight: 17, marginTop: 6 },
});
