import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
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

import { Gradient } from '@/components/london/gradient';
import { CityLines } from '@/components/london/city-lines';
import { SafeTop } from '@/components/safe-top';
import { Gradients, London, Radius, Shadows } from '@/constants/london';
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

              {unitsOf(stage.id).map((unit, unitIndex) => (
                <View key={unit.id} style={styles.unit}>
                  <View style={styles.routeRail}>
                    <View style={[styles.routeDot, { borderColor: STAGE_GRADIENT[stage.id][0] }]} />
                    {unitIndex < unitsOf(stage.id).length - 1 ? (
                      <View style={[styles.routeLine, { backgroundColor: STAGE_GRADIENT[stage.id][0] }]} />
                    ) : null}
                  </View>
                  <Pressable
                    onPress={() => router.push({ pathname: '/study', params: { deckId: unit.id } })}
                    style={({ pressed }) => [styles.unitMain, pressed && styles.pressed]}>
                    <View style={styles.rowText}>
                      <Text style={styles.unitTitle}>{unit.title}</Text>
                      <Text style={styles.unitMeta}>
                        Platform {unitIndex + 1} · {unit.cards.length} cards · {unit.level}
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
                  <MaterialCommunityIcons name="chevron-right" size={19} color={London.line} />
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
    <SafeTop>
      <Gradient colors={Gradients.royal} style={styles.header}>
        <View style={styles.headerGlow} />
        <Image
          source={require('@/assets/images/london-hero.png')}
          contentFit="contain"
          contentPosition="right bottom"
          priority="high"
          style={styles.headerArtwork}
        />
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <View style={styles.brandPill}>
                <View style={styles.brandDot} />
                <Text style={styles.brandPillText}>LONDON ENGLISH</Text>
              </View>
              <Text style={styles.headerTitle}>Inglesiamo</Text>
              <Text style={styles.headerSub}>English that takes you places.</Text>
            </View>
          </View>

          <View style={styles.chips}>
            <Chip icon="cards-outline" label="Answers" value={`${studied}`} />
            <Chip icon="target" label="Accuracy" value={studied ? `${accuracy}%` : '--'} />
            <Chip icon="cards-playing-outline" label="Cards" value={`${allCards.length}`} />
          </View>
        </View>
      </Gradient>
    </SafeTop>
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
    <View style={styles.today}>
      <View style={styles.todayArt}>
        <CityLines style={styles.todayLines} />
        <Image
          source={require('@/assets/images/session-phone-box.png')}
          contentFit="contain"
          style={styles.todayPhoneBox}
        />
      </View>
      <View style={styles.todayText}>
        <View style={styles.todayRoute}>
          <View style={styles.todayRouteDot} />
          <Text style={styles.todayKicker}>NEXT DEPARTURE · 5 MIN</Text>
        </View>
        <Text style={styles.todayTitle}>10 cards, five minutes</Text>
        <Text style={styles.todaySubtitle}>
          Multiple choice, gap fill, transformation. All mixed, the way the exam asks.
        </Text>
        <Pressable onPress={onPress} style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
          <Text style={styles.ctaText}>Start journey</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color={London.white} />
        </Pressable>
      </View>
    </View>
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

      <Text style={styles.credit}>Inglesiamo · by Izarpix</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: London.stone },
  scroll: { paddingBottom: 40 },

  header: {
    minHeight: 286,
    paddingBottom: 20,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerGlow: { position: 'absolute', width: 240, height: 240, borderRadius: 120, right: -70, top: -80, backgroundColor: 'rgba(69,128,183,0.2)' },
  headerArtwork: { position: 'absolute', width: '72%', height: 245, right: -8, top: -4, opacity: 0.78 },
  headerContent: { flex: 1, paddingHorizontal: 22, paddingTop: 18, justifyContent: 'space-between', gap: 30 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandPill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 7, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10, marginBottom: 10 },
  brandDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: London.flagRed, borderWidth: 1, borderColor: London.white },
  brandPillText: { color: London.gold, fontSize: 9.5, fontWeight: '900', letterSpacing: 1.3 },
  headerTitle: { color: London.white, fontSize: 36, fontWeight: '900', letterSpacing: -1.2, maxWidth: '58%' },
  headerSub: { color: 'rgba(255,255,255,0.76)', fontSize: 14, marginTop: 3, maxWidth: '55%' },

  chips: { flexDirection: 'row', gap: 10 },
  chip: {
    flex: 1,
    backgroundColor: 'rgba(7,24,39,0.48)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 2,
  },
  chipValue: { color: London.white, fontSize: 18, fontWeight: '800' },
  chipLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' },

  body: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  rowText: { flex: 1, gap: 3 },

  today: { borderRadius: Radius.xl, minHeight: 202, justifyContent: 'center', backgroundColor: London.white, borderWidth: 1, borderColor: 'rgba(16,42,67,0.1)', overflow: 'hidden', ...Shadows.raised },
  todayArt: { position: 'absolute', width: 122, right: 0, top: 0, bottom: 0, backgroundColor: London.sky, overflow: 'hidden', borderLeftWidth: 1, borderLeftColor: '#D7E1EF' },
  todayLines: { right: -85, top: 10, opacity: 0.3 },
  todayPhoneBox: { position: 'absolute', width: 118, height: 180, right: 1, bottom: -2 },
  todayText: { padding: 20, paddingRight: 138, gap: 8 },
  todayRoute: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  todayRouteDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: London.white, borderWidth: 3, borderColor: London.flagRed },
  todayKicker: { color: London.flagRed, fontSize: 9.5, fontWeight: '900', letterSpacing: 1.2 },
  todayTitle: { color: London.cab, fontSize: 22, lineHeight: 27, fontWeight: '900', letterSpacing: -0.4 },
  todaySubtitle: { color: London.fog, fontSize: 12.5, lineHeight: 18 },
  cta: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: London.royal,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  ctaText: { color: London.white, fontWeight: '800', fontSize: 14 },

  review: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: London.blush,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: London.flagRed,
    padding: 14,
    ...Shadows.card,
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

  stage: { gap: 0, marginTop: 18 },
  stageHead: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 12 },
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
    paddingLeft: 8,
    paddingRight: 10,
    marginBottom: 9,
    ...Shadows.card,
  },
  routeRail: { width: 30, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  routeDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 4, backgroundColor: London.white, zIndex: 2 },
  routeLine: { position: 'absolute', width: 3, top: '50%', bottom: -29, opacity: 0.65 },
  unitMain: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
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
    ...Shadows.card,
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
