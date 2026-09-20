import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Gradient } from '@/components/london/gradient';
import { PhoneBox } from '@/components/london/phone-box';
import { Roundel } from '@/components/london/roundel';
import { UnionJack } from '@/components/london/union-jack';
import { Gradients, London, Radius } from '@/constants/london';
import { allCards, STAGES, unitsOf } from '@/src/content';
import type { Stage } from '@/src/content/types';
import { reviewSize } from '@/src/domain/review';
import { useAppState } from '@/src/store/app-state';

/** One colour per stage, so the course reads as four blocks at a glance. */
const STAGE_GRADIENT: Record<Stage, [string, string]> = {
  foundations: Gradients.tube,
  core: Gradients.royal,
  esp: Gradients.park,
  exam: Gradients.sunset,
};

const STAGE_ICON: Record<Stage, keyof typeof MaterialCommunityIcons.glyphMap> = {
  foundations: 'foot-print',
  core: 'book-open-page-variant',
  esp: 'chart-line',
  exam: 'school',
};

export default function HomeScreen() {
  const router = useRouter();
  const { answers } = useAppState();

  const studied = answers.length;
  const right = answers.filter((a) => a.grade !== 'wrong').length;
  const accuracy = studied ? Math.round((right / studied) * 100) : 0;
  const toReview = reviewSize(answers, allCards, 10);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header studied={studied} accuracy={accuracy} />

        <View style={styles.body}>
          <TodayCard onPress={() => router.push('/study')} />

          {toReview > 0 ? (
            <Pressable
              onPress={() => router.push({ pathname: '/study', params: { mode: 'review' } })}
              style={({ pressed }) => [styles.review, pressed && styles.pressed]}>
              <View style={styles.reviewIcon}>
                <MaterialCommunityIcons name="refresh" size={22} color={London.white} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.reviewTitle}>Review your mistakes</Text>
                <Text style={styles.reviewMeta}>
                  {toReview} cards on the topics you got wrong
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={London.flagRed} />
            </Pressable>
          ) : null}

          {STAGES.map((stage) => (
            <View key={stage.id} style={styles.stage}>
              <View style={styles.stageHead}>
                <Gradient colors={STAGE_GRADIENT[stage.id]} style={styles.stageIcon}>
                  <MaterialCommunityIcons
                    name={STAGE_ICON[stage.id]}
                    size={18}
                    color={London.white}
                  />
                </Gradient>
                <View style={styles.rowText}>
                  <Text style={styles.stageTitle}>{stage.title}</Text>
                  <Text style={styles.stageSubtitle}>{stage.subtitle}</Text>
                </View>
              </View>

              {unitsOf(stage.id).map((unit) => (
                <View key={unit.id} style={styles.unit}>
                  <Pressable
                    onPress={() => router.push({ pathname: '/study', params: { deckId: unit.id } })}
                    style={({ pressed }) => [styles.unitMain, pressed && styles.pressed]}>
                    <View style={styles.rowText}>
                      <Text style={styles.unitTitle}>{unit.title}</Text>
                      <Text style={styles.unitMeta}>
                        {unit.cards.length} cards · level {unit.level}
                      </Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push({ pathname: '/lesson', params: { id: unit.id } })}
                    hitSlop={6}
                    style={({ pressed }) => [styles.noteButton, pressed && styles.pressed]}>
                    <MaterialCommunityIcons
                      name="book-open-variant"
                      size={18}
                      color={London.royal}
                    />
                    <Text style={styles.noteButtonText}>Note</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ))}

          <SuggestionBox />
        </View>
      </ScrollView>
    </View>
  );
}

function Header({ studied, accuracy }: { studied: number; accuracy: number }) {
  return (
    <Gradient colors={Gradients.royal} style={styles.header}>
      <UnionJack width={260} style={styles.headerFlag} />
      <SafeAreaView edges={['top']}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>MIND THE GAP</Text>
              <Text style={styles.headerTitle}>Inglesiamo</Text>
              <Text style={styles.headerSub}>Your English, one day at a time</Text>
            </View>
            <Roundel size={50} />
          </View>

          <View style={styles.chips}>
            <Chip icon="cards-outline" label="Answers" value={`${studied}`} />
            <Chip icon="target" label="Accuracy" value={studied ? `${accuracy}%` : '--'} />
            <Chip icon="cards-playing-outline" label="Cards" value={`${allCards.length}`} />
          </View>
        </View>
      </SafeAreaView>
    </Gradient>
  );
}

function Chip({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.chip}>
      <MaterialCommunityIcons name={icon} size={16} color={London.gold} />
      <Text style={styles.chipValue}>{value}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

function TodayCard({ onPress }: { onPress: () => void }) {
  return (
    <Gradient colors={Gradients.sunset} style={styles.today}>
      <PhoneBox height={150} style={styles.todayPhoneBox} />
      <View style={styles.todayText}>
        <Text style={styles.todayKicker}>TODAY&apos;S SESSION</Text>
        <Text style={styles.todayTitle}>10 cards, five minutes</Text>
        <Text style={styles.todaySubtitle}>
          Multiple choice, gap fill, transformation. All mixed, the way the exam asks.
        </Text>
        <Pressable onPress={onPress} style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
          <Text style={styles.ctaText}>Start</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color={London.flagRed} />
        </Pressable>
      </View>
    </Gradient>
  );
}

function SuggestionBox() {
  const { suggestions, addSuggestion, removeSuggestion } = useAppState();
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim()) return;
    addSuggestion(author, text);
    setAuthor('');
    setText('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.sectionTitle}>Feedback</Text>
      <View style={styles.suggestCard}>
        <View style={styles.suggestHead}>
          <MaterialCommunityIcons name="thought-bubble-outline" size={20} color={London.tube} />
          <Text style={styles.suggestHeadText}>
            Trying the app out? Tell us what you would improve.
          </Text>
        </View>

        <TextInput
          value={author}
          onChangeText={setAuthor}
          placeholder="Your name (optional)"
          placeholderTextColor={London.fog}
          style={styles.input}
        />
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Your suggestion…"
          placeholderTextColor={London.fog}
          multiline
          style={[styles.input, styles.inputMultiline]}
        />
        <Pressable
          onPress={submit}
          style={({ pressed }) => [styles.suggestButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="send" size={16} color={London.white} />
          <Text style={styles.suggestButtonText}>Send feedback</Text>
        </Pressable>

        {suggestions.map((item) => (
          <View key={item.id} style={styles.suggestion}>
            <View style={{ flex: 1 }}>
              <Text style={styles.suggestionAuthor}>{item.author}</Text>
              <Text style={styles.suggestionText}>{item.text}</Text>
            </View>
            <Pressable onPress={() => removeSuggestion(item.id)} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={18} color={London.fog} />
            </Pressable>
          </View>
        ))}

        {suggestions.length === 0 ? (
          <Text style={styles.suggestEmpty}>
            No feedback yet. Whatever you write stays saved on this phone.
          </Text>
        ) : null}
      </View>

      <Text style={styles.credit}>Inglesiamo · by Izarpix Studio</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: London.stone },
  scroll: { paddingBottom: 40 },

  header: { paddingBottom: 22 },
  headerFlag: {
    position: 'absolute',
    right: -70,
    top: 10,
    opacity: 0.16,
    transform: [{ rotate: '-12deg' }],
    borderRadius: 8,
  },
  headerContent: { paddingHorizontal: 20, paddingTop: 12, gap: 18 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  kicker: {
    color: London.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 4,
  },
  headerTitle: { color: London.white, fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 2 },

  chips: { flexDirection: 'row', gap: 10 },
  chip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: Radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 2,
  },
  chipValue: { color: London.white, fontSize: 18, fontWeight: '800' },
  chipLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' },

  body: { paddingHorizontal: 20, paddingTop: 20, gap: 12 },
  rowText: { flex: 1, gap: 3 },

  today: { borderRadius: Radius.xl, padding: 18, minHeight: 176, justifyContent: 'center' },
  todayPhoneBox: { position: 'absolute', right: 14, bottom: 0, opacity: 0.95 },
  todayText: { paddingRight: 92, gap: 6 },
  todayKicker: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  todayTitle: { color: London.white, fontSize: 22, fontWeight: '800' },
  todaySubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 18 },
  cta: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: London.white,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  ctaText: { color: London.flagRed, fontWeight: '800', fontSize: 15 },

  review: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FBE9EB',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: London.flagRed,
    padding: 14,
  },
  reviewIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: London.flagRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewTitle: { color: London.flagRed, fontSize: 15, fontWeight: '800' },
  reviewMeta: { color: London.cab, fontSize: 12, lineHeight: 17 },

  stage: { gap: 8, marginTop: 14 },
  stageHead: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 2 },
  stageIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  stageTitle: { color: London.cab, fontSize: 17, fontWeight: '800' },
  stageSubtitle: { color: London.fog, fontSize: 12 },

  unit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: London.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: London.line,
    paddingLeft: 14,
    paddingRight: 8,
  },
  unitMain: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  unitTitle: { color: London.cab, fontSize: 14.5, fontWeight: '700' },
  unitMeta: { color: London.fog, fontSize: 12 },
  noteButton: {
    alignItems: 'center',
    gap: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    backgroundColor: London.stone,
  },
  noteButtonText: { color: London.royal, fontSize: 10, fontWeight: '800' },

  sectionTitle: {
    color: London.cab,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 8,
  },
  suggestCard: {
    backgroundColor: London.white,
    borderRadius: Radius.lg,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: London.line,
  },
  suggestHead: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  suggestHeadText: { flex: 1, color: London.cab, fontSize: 13, lineHeight: 18 },
  input: {
    backgroundColor: London.stone,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: London.cab,
    borderWidth: 1,
    borderColor: London.line,
  },
  inputMultiline: { minHeight: 76, textAlignVertical: 'top' },
  suggestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: London.tube,
    paddingVertical: 12,
    borderRadius: Radius.sm,
  },
  suggestButtonText: { color: London.white, fontWeight: '700', fontSize: 14 },
  suggestion: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: London.stone,
    borderRadius: Radius.sm,
    padding: 12,
  },
  suggestionAuthor: { color: London.tube, fontSize: 12, fontWeight: '800', marginBottom: 2 },
  suggestionText: { color: London.cab, fontSize: 14, lineHeight: 19 },
  suggestEmpty: { color: London.fog, fontSize: 12, lineHeight: 17 },

  credit: {
    textAlign: 'center',
    color: London.fog,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 22,
  },

  pressed: { opacity: 0.8 },
});
