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
import { allCards, decks } from '@/src/content';
import { lessons } from '@/src/content/lessons';
import { reviewSize } from '@/src/domain/review';
import { useAppState } from '@/src/store/app-state';

/** A different London icon per deck, so the list is recognisable at a glance. */
const DECK_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  ppps: 'clock-time-four-outline',
  ff: 'account-switch-outline',
  esp: 'chart-line',
};

const DECK_GRADIENTS: [string, string][] = [Gradients.tube, Gradients.sunset, Gradients.park];

export default function HomeScreen() {
  const router = useRouter();
  const { answers } = useAppState();

  const studiedToday = answers.length;
  const correctToday = answers.filter((a) => a.grade !== 'wrong').length;
  const accuracy = studiedToday ? Math.round((correctToday / studiedToday) * 100) : 0;
  const toReview = reviewSize(answers, allCards, 10);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Header studied={studiedToday} accuracy={accuracy} />

        <View style={styles.body}>
          <TodayCard onPress={() => router.push('/study')} />

          {toReview > 0 ? (
            <Pressable
              onPress={() => router.push({ pathname: '/study', params: { mode: 'review' } })}
              style={({ pressed }) => [styles.review, pressed && styles.pressed]}>
              <View style={styles.reviewIcon}>
                <MaterialCommunityIcons name="refresh" size={22} color={London.white} />
              </View>
              <View style={styles.deckText}>
                <Text style={styles.reviewTitle}>Review your mistakes</Text>
                <Text style={styles.reviewMeta}>
                  {toReview} cards on the topics you got wrong
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={London.flagRed} />
            </Pressable>
          ) : null}

          <Text style={styles.sectionTitle}>Your decks</Text>
          {decks.map((deck, index) => (
            <Pressable
              key={deck.id}
              onPress={() => router.push({ pathname: '/study', params: { deckId: deck.id } })}
              style={({ pressed }) => [styles.deck, pressed && styles.pressed]}>
              <Gradient
                colors={DECK_GRADIENTS[index % DECK_GRADIENTS.length]}
                style={styles.deckIcon}>
                <MaterialCommunityIcons
                  name={DECK_ICONS[deck.id] ?? 'book-open-variant'}
                  size={26}
                  color={London.white}
                />
              </Gradient>
              <View style={styles.deckText}>
                <Text style={styles.deckTitle}>{deck.title}</Text>
                <Text style={styles.deckMeta}>
                  {deck.cards.length} cards · level {deck.level}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={London.fog} />
            </Pressable>
          ))}

          <Text style={styles.sectionTitle}>Grammar notes</Text>
          {lessons.map((lesson) => (
            <Pressable
              key={lesson.id}
              onPress={() => router.push({ pathname: '/lesson', params: { id: lesson.id } })}
              style={({ pressed }) => [styles.lesson, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="book-open-variant" size={19} color={London.royal} />
              <View style={styles.deckText}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.deckMeta}>{lesson.summary}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={London.fog} />
            </Pressable>
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
              <Text style={styles.headerTitle}>Your English,{'\n'}one day at a time</Text>
            </View>
            <Roundel size={54} />
          </View>

          <View style={styles.chips}>
            <Chip icon="cards-outline" label="Today" value={`${studied}`} />
            <Chip icon="target" label="Accuracy" value={studied ? `${accuracy}%` : '--'} />
            <Chip icon="fire" label="Streak" value="1" />
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
          Complete, correct, rewrite. All mixed, the way the exam asks.
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
    marginBottom: 6,
  },
  headerTitle: { color: London.white, fontSize: 27, fontWeight: '800', lineHeight: 33 },

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

  sectionTitle: {
    color: London.cab,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 2,
  },

  deck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: London.white,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: London.line,
  },
  deckIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },

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

  lesson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: London.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: London.line,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  lessonTitle: { color: London.cab, fontSize: 14.5, fontWeight: '700' },
  deckText: { flex: 1, gap: 3 },
  deckTitle: { color: London.cab, fontSize: 15, fontWeight: '700' },
  deckMeta: { color: London.fog, fontSize: 12 },

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

  pressed: { opacity: 0.8 },
});
