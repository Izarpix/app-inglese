import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Gradient } from '@/components/london/gradient';
import { LondonHeroArt } from '@/components/london/hero-art';
import { SafeTop } from '@/components/safe-top';
import { Gradients, London, Radius, Shadows } from '@/constants/london';
import { allCards, unitForTag } from '@/src/content';
import { useAppState, weakestTags } from '@/src/store/app-state';

/** Human wording for the error categories, so the screen reads as English. */
const TAG_LABEL: Record<string, string> = {
  'present-simple-vs-continuous': 'Present simple or continuous',
  'state-verbs': 'State verbs',
  'past-simple': 'Past simple',
  'irregular-verb': 'Irregular verbs',
  'narrative-tense': 'Narrative tenses',
  'used-to': 'Used to',
  'present-perfect-vs-past-simple': 'Present perfect or past simple',
  'present-perfect-continuous': 'Present perfect continuous',
  'time-adverbial': 'Time expressions (yesterday, ago, yet)',
  'for-since': 'For and since',
  'been-vs-gone': 'Been or gone',
  'future-form': 'Future forms',
  'future-time-clause': 'Future time and condition clauses',
  modal: 'Modal verbs',
  obligation: 'Obligation and necessity',
  deduction: 'Deduction and speculation',
  'past-infinitive': 'Past infinitives',
  passive: 'The passive',
  'double-object-passive': 'Passive with two objects',
  'reported-speech': 'Reported speech',
  'have-something-done': 'Have something done',
  conditional: 'Conditionals',
  wish: 'Wish',
  'gerund-vs-infinitive': 'Gerund or infinitive',
  'preposition-plus-gerund': 'Preposition plus -ing',
  'phrasal-verb': 'Phrasal verbs',
  get: 'Uses of get',
  'word-formation': 'Word formation',
  article: 'Articles',
  quantifier: 'Quantifiers',
  uncountable: 'Uncountable nouns',
  preposition: 'Prepositions',
  'false-friend': 'False friends',
  'adjective-order': 'Adjective order',
  'do-vs-make': 'Do or make',
  'question-form': 'Question forms',
  'negative-form': 'Negative forms',
  'word-order': 'Word order',
  'esp-trend-vocabulary': 'Trend vocabulary',
  'esp-structure': 'Structures for describing data',
  'esp-numbers': 'Numbers and proportions',
};

export default function ProgressScreen() {
  const router = useRouter();
  const { answers } = useAppState();

  const total = answers.length;
  const right = answers.filter((a) => a.grade === 'correct').length;
  const almost = answers.filter((a) => a.grade === 'almost').length;
  const accuracy = total ? Math.round(((right + almost) / total) * 100) : 0;
  const seen = new Set(answers.map((a) => a.cardId)).size;
  const weak = weakestTags(answers).slice(0, 5);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SafeTop>
          <Gradient colors={Gradients.tube} style={styles.header}>
            <LondonHeroArt variant="progress" style={styles.headerArt} />
            <View style={styles.headerContent}>
              <Text style={styles.kicker}>HOW YOU ARE DOING</Text>
              <Text style={styles.title}>Progress</Text>
              <View style={styles.stats}>
                <Stat value={`${total}`} label="Answers" />
                <Stat value={total ? `${accuracy}%` : '--'} label="Accuracy" />
                <Stat value={`${seen}/${allCards.length}`} label="Cards seen" />
              </View>
            </View>
          </Gradient>
        </SafeTop>

        <View style={styles.body}>
          <View style={styles.journeyCard}>
            <View style={styles.journeyTop}>
              <View>
                <Text style={styles.eyebrow}>YOUR JOURNEY</Text>
                <Text style={styles.journeyTitle}>{seen ? `${seen} stops explored` : 'Ready to depart'}</Text>
              </View>
              <View style={styles.accuracyBadge}>
                <Text style={styles.accuracyValue}>{total ? `${accuracy}%` : '—'}</Text>
                <Text style={styles.accuracyLabel}>accuracy</Text>
              </View>
            </View>
            <View style={styles.journeyTrack}>
              <View style={[styles.journeyFill, { width: `${Math.max(4, Math.round((seen / allCards.length) * 100))}%` }]} />
              <View style={styles.journeyStop} />
            </View>
            <Text style={styles.journeyMeta}>{allCards.length - seen} cards left across the network</Text>
          </View>

          <View style={styles.sectionHead}>
            <View>
              <Text style={styles.sectionEyebrow}>SERVICE UPDATE</Text>
              <Text style={styles.sectionTitle}>Where you slip most</Text>
            </View>
            <MaterialCommunityIcons name="subway-variant" size={24} color={London.flagRed} />
          </View>
          <View style={styles.card}>
            {weak.length === 0 ? (
              <Text style={styles.empty}>
                No mistakes recorded yet. Do a session and your profile appears here: the app
                uses these categories to decide what to push you on.
              </Text>
            ) : (
              weak.map((item) => {
                const lesson = unitForTag(item.tag);
                return (
                  <Pressable
                    key={item.tag}
                    disabled={!lesson}
                    onPress={() =>
                      lesson && router.push({ pathname: '/lesson', params: { id: lesson.id } })
                    }
                    style={styles.weakRow}>
                    <MaterialCommunityIcons
                      name="alert-circle-outline"
                      size={18}
                      color={London.flagRed}
                    />
                    <View style={styles.weakTextBox}>
                      <Text style={styles.weakLabel}>{TAG_LABEL[item.tag] ?? item.tag}</Text>
                      {lesson ? (
                        <Text style={styles.weakLink}>Tap to review the rule</Text>
                      ) : null}
                    </View>
                    <View style={styles.missPill}>
                      <Text style={styles.missText}>{item.misses}</Text>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>

          <View style={styles.warning}>
            <MaterialCommunityIcons name="information-outline" size={18} color={London.tube} />
            <Text style={styles.warningText}>
              Your progress is saved on this device. An account, so you find it anywhere, is
              the next block of work.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: London.stone },
  scroll: { paddingBottom: 40 },
  header: {
    paddingBottom: 24,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerArt: { position: 'absolute', width: '70%', height: 196, right: -14, top: -10, opacity: 0.72 },
  headerContent: { paddingHorizontal: 20, paddingTop: 14, gap: 4 },
  kicker: { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  title: { color: London.white, fontSize: 32, fontWeight: '900', marginBottom: 12 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: Radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 2,
  },
  statValue: { color: London.white, fontSize: 19, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' },
  body: { padding: 20, gap: 14 },
  journeyCard: { backgroundColor: London.white, borderRadius: Radius.lg, padding: 18, gap: 14, borderWidth: 1, borderColor: London.line, ...Shadows.card },
  journeyTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  eyebrow: { color: London.flagRed, fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
  journeyTitle: { color: London.cab, fontSize: 20, fontWeight: '800', marginTop: 3 },
  accuracyBadge: { width: 70, height: 70, borderRadius: 35, backgroundColor: London.royal, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: London.gold },
  accuracyValue: { color: London.white, fontSize: 19, fontWeight: '900' },
  accuracyLabel: { color: 'rgba(255,255,255,0.72)', fontSize: 9, fontWeight: '700' },
  journeyTrack: { height: 6, backgroundColor: London.stoneDeep, borderRadius: 3, overflow: 'visible' },
  journeyFill: { height: 6, backgroundColor: London.flagRed, borderRadius: 3 },
  journeyStop: { position: 'absolute', right: -1, top: -4, width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: London.flagRed, backgroundColor: London.white },
  journeyMeta: { color: London.fog, fontSize: 12 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  sectionEyebrow: { color: London.flagRed, fontSize: 9.5, fontWeight: '900', letterSpacing: 1.3, marginBottom: 2 },
  sectionTitle: { color: London.cab, fontSize: 17, fontWeight: '800' },
  card: {
    backgroundColor: London.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: London.line,
    padding: 16,
    gap: 12,
    ...Shadows.card,
  },
  empty: { color: London.fog, fontSize: 13.5, lineHeight: 20 },
  weakRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  weakTextBox: { flex: 1, gap: 2 },
  weakLabel: { color: London.cab, fontSize: 14, fontWeight: '600' },
  weakLink: { color: London.tube, fontSize: 11.5, fontWeight: '700' },
  missPill: {
    backgroundColor: London.blush,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  missText: { color: London.flagRed, fontSize: 12, fontWeight: '800' },
  warning: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(0,25,168,0.06)',
    borderRadius: Radius.md,
    padding: 14,
  },
  warningText: { flex: 1, color: London.cab, fontSize: 12.5, lineHeight: 18 },
});
