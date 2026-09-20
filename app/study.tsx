import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { RewardBadge } from '@/components/london/reward-badge';
import { UnionJack } from '@/components/london/union-jack';
import { Gradients, London, Radius } from '@/constants/london';
import { allCards, getUnit, shuffle, unitForTag } from '@/src/content';
import type { Card, CardType } from '@/src/content/types';
import { gradeAnswer, normalise, type Grade } from '@/src/domain/grading';
import { play } from '@/src/audio/feedback';
import { computeRewards, isUnlocked } from '@/src/domain/rewards';
import { buildReviewSession } from '@/src/domain/review';
import { useAppState } from '@/src/store/app-state';

const SESSION_LENGTH = 10;

const TYPE_LABEL: Record<CardType, string> = {
  fill: 'Complete the sentence',
  correct: 'Fix the mistake',
  rewrite: 'Say it in English',
  vocab: 'How do you say',
  choice: 'Pick the right form',
  build: 'Build the sentence',
  transform: 'Rewrite with the keyword',
  box: 'Choose from the word box',
  form: 'Form the right word',
};

const TYPE_ICON: Record<CardType, keyof typeof MaterialCommunityIcons.glyphMap> = {
  fill: 'format-text-variant',
  correct: 'pencil-outline',
  rewrite: 'translate',
  vocab: 'book-alphabet',
  choice: 'format-list-bulleted',
  build: 'hammer-wrench',
  transform: 'swap-horizontal',
  box: 'package-variant-closed',
  form: 'alphabetical-variant',
};

/** Card types answered by tapping an option rather than typing. */
const TAP_TYPES: CardType[] = ['choice', 'box'];

export default function StudyScreen() {
  const router = useRouter();
  const { deckId, mode } = useLocalSearchParams<{ deckId?: string; mode?: string }>();
  const { answers, recordAnswer } = useAppState();

  const deck = deckId ? getUnit(deckId) : undefined;
  const isReview = mode === 'review';

  /** Frozen at mount: a review session must not reshuffle as you answer it. */
  const answersAtStart = useRef(answers);

  /**
   * Built once per session so the order does not reshuffle on every render.
   * A review session is not shuffled: it is already ordered by how badly each
   * card is going.
   */
  const cards = useMemo(() => {
    if (isReview) return buildReviewSession(answersAtStart.current, allCards, SESSION_LENGTH);
    return shuffle(deck ? deck.cards : allCards).slice(0, SESSION_LENGTH);
  }, [deck, isReview]);

  const rewardsBefore = useRef(computeRewards(answers).filter(isUnlocked).map((r) => r.id));

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [expected, setExpected] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionGrades, setSessionGrades] = useState<Grade[]>([]);

  const card = cards[index];

  if (!card) {
    return (
      <Shell title={isReview ? 'Review' : 'No cards'} onClose={() => router.back()}>
        <Text style={styles.emptyText}>
          {isReview
            ? 'No mistakes to review yet. Do a session, and from then on the app knows what to bring back.'
            : 'This deck is empty.'}
        </Text>
      </Shell>
    );
  }

  const check = (answer: string) => {
    const result = gradeAnswer(card, answer);
    setGrade(result.grade);
    setExpected(result.expected);
    setSessionGrades((current) => [...current, result.grade]);
    recordAnswer({
      cardId: card.id,
      deckId: deck?.id ?? card.id.split('-')[0],
      grade: result.grade,
      errorTags: card.errorTags,
    });

    play(result.grade);

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(
        result.grade === 'wrong'
          ? Haptics.NotificationFeedbackType.Error
          : Haptics.NotificationFeedbackType.Success,
      );
    }
  };

  const next = () => {
    if (index + 1 >= cards.length) {
      play('complete');
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setInput('');
    setPicked(null);
    setGrade(null);
    setExpected('');
    setShowHint(false);
  };

  if (done) {
    return (
      <Summary
        grades={sessionGrades}
        newRewardIds={computeRewards(answers)
          .filter(isUnlocked)
          .map((r) => r.id)
          .filter((id) => !rewardsBefore.current.includes(id))}
        onClose={() => router.back()}
      />
    );
  }

  const answered = grade !== null;

  return (
    <Shell
      title={isReview ? 'Review your mistakes' : (deck?.title ?? 'Mixed session')}
      progress={(index + (answered ? 1 : 0)) / cards.length}
      counter={`${index + 1} / ${cards.length}`}
      onClose={() => router.back()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={12}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.typeRow}>
            <MaterialCommunityIcons name={TYPE_ICON[card.type]} size={16} color={London.tube} />
            <Text style={styles.typeLabel}>{TYPE_LABEL[card.type]}</Text>
            <View style={styles.levelPill}>
              <Text style={styles.levelText}>{card.level}</Text>
            </View>
          </View>

          <View style={styles.promptCard}>
            <Text style={styles.prompt}>{card.prompt}</Text>

            {card.keyword ? (
              <View style={styles.cueRow}>
                <Text style={styles.cueLabel}>KEYWORD</Text>
                <View style={styles.cuePill}>
                  <Text style={styles.cueText}>{card.keyword}</Text>
                </View>
              </View>
            ) : null}

            {card.root ? (
              <View style={styles.cueRow}>
                <Text style={styles.cueLabel}>ROOT WORD</Text>
                <View style={styles.cuePill}>
                  <Text style={styles.cueText}>{card.root}</Text>
                </View>
              </View>
            ) : null}

            {card.given ? (
              <Text style={styles.given}>Start with: {card.given}...</Text>
            ) : null}
            {card.hint && !answered ? (
              showHint ? (
                <Text style={styles.hint}>{card.hint}</Text>
              ) : (
                <Pressable onPress={() => setShowHint(true)} hitSlop={8}>
                  <Text style={styles.hintLink}>Show a hint</Text>
                </Pressable>
              )
            ) : null}
          </View>

          {TAP_TYPES.includes(card.type) ? (
            <View style={styles.options}>
              {(card.options ?? []).map((option) => (
                <Pressable
                  key={option}
                  disabled={answered}
                  onPress={() => {
                    setPicked(option);
                    check(option);
                  }}
                  style={[
                    styles.option,
                    answered && normalise(option) === normalise(card.answers[0]) && styles.optionRight,
                    answered &&
                      picked === option &&
                      normalise(option) !== normalise(card.answers[0]) &&
                      styles.optionWrong,
                  ]}>
                  <Text style={styles.optionText}>{option}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <TextInput
              value={input}
              onChangeText={setInput}
              editable={!answered}
              placeholder="Type your answer…"
              placeholderTextColor={London.fog}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              style={[styles.answerInput, answered && styles.answerInputLocked]}
              onSubmitEditing={() => !answered && check(input)}
            />
          )}

          {answered ? <Feedback card={card} grade={grade} expected={expected} /> : null}
        </ScrollView>

        <View style={styles.footer}>
          {answered ? (
            <Pressable onPress={next} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
              <Text style={styles.primaryText}>
                {index + 1 >= cards.length ? 'See your score' : 'Continue'}
              </Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color={London.white} />
            </Pressable>
          ) : TAP_TYPES.includes(card.type) ? (
            <Text style={styles.footerHint}>Tap the answer you think is right.</Text>
          ) : (
            <Pressable
              onPress={() => check(input)}
              disabled={!input.trim()}
              style={({ pressed }) => [
                styles.primary,
                !input.trim() && styles.primaryDisabled,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.primaryText}>Check</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </Shell>
  );
}

function Feedback({ card, grade, expected }: { card: Card; grade: Grade; expected: string }) {
  const router = useRouter();
  const lessonUnit = card.errorTags.map(unitForTag).find(Boolean);
  const palette = {
    correct: { bg: '#E6F4EE', border: London.park, icon: 'check-circle' as const, title: 'Correct' },
    almost: { bg: '#FDF3DA', border: London.gold, icon: 'alert-circle' as const, title: 'Almost, just a typo' },
    wrong: { bg: '#FBE9EB', border: London.flagRed, icon: 'close-circle' as const, title: 'Not quite' },
  }[grade];

  return (
    <View style={[styles.feedback, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      <View style={styles.feedbackHead}>
        <MaterialCommunityIcons name={palette.icon} size={20} color={palette.border} />
        <Text style={[styles.feedbackTitle, { color: palette.border }]}>{palette.title}</Text>
      </View>

      <Text style={styles.expectedLabel}>ANSWER</Text>
      <Text style={styles.expected}>{expected}</Text>

      {card.answers.length > 1 ? (
        <Text style={styles.alternatives}>
          Also accepted: {card.answers.slice(1).join(' · ')}
        </Text>
      ) : null}

      <Text style={styles.explanation}>{card.explanation}</Text>

      <View style={styles.tags}>
        {card.errorTags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {lessonUnit && grade !== 'correct' ? (
        <Pressable
          onPress={() => router.push({ pathname: '/lesson', params: { id: lessonUnit.id } })}
          style={({ pressed }) => [styles.lessonLink, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="book-open-variant" size={16} color={London.royal} />
          <Text style={styles.lessonLinkText}>Review the rule: {lessonUnit.title}</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={London.royal} />
        </Pressable>
      ) : null}
    </View>
  );
}

function Summary({
  grades,
  newRewardIds,
  onClose,
}: {
  grades: Grade[];
  newRewardIds: string[];
  onClose: () => void;
}) {
  const { answers } = useAppState();
  useEffect(() => {
    if (newRewardIds.length) play('reward');
  }, [newRewardIds]);

  const right = grades.filter((g) => g !== 'wrong').length;
  const score = grades.length ? Math.round((right / grades.length) * 100) : 0;
  const earned = computeRewards(answers).filter((r) => newRewardIds.includes(r.id));

  return (
    <View style={styles.root}>
      <Gradient colors={Gradients.royal} style={styles.summaryHeader}>
        <UnionJack width={300} style={styles.summaryFlag} />
        <SafeAreaView edges={['top']}>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryKicker}>SESSION COMPLETE</Text>
            <Text style={styles.summaryScore}>{score}%</Text>
            <Text style={styles.summarySub}>
              {right} out of {grades.length} answers
            </Text>
          </View>
        </SafeAreaView>
      </Gradient>

      <ScrollView contentContainerStyle={styles.summaryBody}>
        {earned.length ? (
          <View style={styles.rewardCard}>
            <Text style={styles.rewardTitle}>Reward unlocked</Text>
            {earned.map((reward) => (
              <View key={reward.id} style={styles.rewardRow}>
                <RewardBadge reward={reward} size={56} />
                <View style={styles.flex}>
                  <Text style={styles.rewardName}>{reward.title}</Text>
                  <Text style={styles.rewardDesc}>{reward.description}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <Pressable onPress={onClose} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
          <Text style={styles.primaryText}>Back home</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Shell({
  title,
  progress,
  counter,
  onClose,
  children,
}: {
  title: string;
  progress?: number;
  counter?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.root}>
      <Gradient colors={Gradients.royal} style={styles.shellHeader}>
        <SafeAreaView edges={['top']}>
          <View style={styles.shellTop}>
            <Pressable onPress={onClose} hitSlop={10}>
              <MaterialCommunityIcons name="close" size={24} color={London.white} />
            </Pressable>
            <Text numberOfLines={1} style={styles.shellTitle}>
              {title}
            </Text>
            <Text style={styles.shellCounter}>{counter ?? ''}</Text>
          </View>
          {progress !== undefined ? (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
            </View>
          ) : null}
        </SafeAreaView>
      </Gradient>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: London.stone },
  flex: { flex: 1 },

  shellHeader: { paddingBottom: 14 },
  shellTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },
  shellTitle: { flex: 1, color: London.white, fontSize: 16, fontWeight: '700' },
  shellCounter: { color: London.gold, fontSize: 14, fontWeight: '800' },
  progressTrack: {
    height: 6,
    marginHorizontal: 18,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
  },
  progressFill: { height: 6, backgroundColor: London.gold },

  scroll: { padding: 20, gap: 14, paddingBottom: 30 },

  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  typeLabel: { flex: 1, color: London.tube, fontSize: 12, fontWeight: '800', letterSpacing: 0.6 },
  levelPill: {
    backgroundColor: London.royal,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  levelText: { color: London.white, fontSize: 11, fontWeight: '800' },

  promptCard: {
    backgroundColor: London.white,
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: London.line,
    gap: 10,
  },
  prompt: { color: London.cab, fontSize: 21, lineHeight: 30, fontWeight: '600' },
  hint: { color: London.fog, fontSize: 13, lineHeight: 18 },
  cueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cueLabel: { color: London.fog, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  cuePill: {
    backgroundColor: London.gold,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cueText: { color: London.royal, fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  given: { color: London.cab, fontSize: 14, fontStyle: 'italic' },
  hintLink: { color: London.tube, fontSize: 13, fontWeight: '700' },

  answerInput: {
    backgroundColor: London.white,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: London.line,
    padding: 14,
    minHeight: 80,
    fontSize: 17,
    color: London.cab,
    textAlignVertical: 'top',
  },
  answerInputLocked: { opacity: 0.6 },

  options: { gap: 10 },
  option: {
    backgroundColor: London.white,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: London.line,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  optionRight: { borderColor: London.park, backgroundColor: '#E6F4EE' },
  optionWrong: { borderColor: London.flagRed, backgroundColor: '#FBE9EB' },
  optionText: { color: London.cab, fontSize: 16, fontWeight: '600' },

  feedback: { borderRadius: Radius.lg, borderWidth: 1.5, padding: 16, gap: 6 },
  feedbackHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  feedbackTitle: { fontSize: 15, fontWeight: '800' },
  expectedLabel: { color: London.fog, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  expected: { color: London.cab, fontSize: 17, fontWeight: '700', lineHeight: 24 },
  alternatives: { color: London.fog, fontSize: 12, lineHeight: 17, fontStyle: 'italic' },
  explanation: { color: London.cab, fontSize: 14, lineHeight: 21, marginTop: 4 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  tag: {
    backgroundColor: 'rgba(1,33,105,0.08)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  tagText: { color: London.royal, fontSize: 10, fontWeight: '700' },

  footer: { padding: 20, paddingTop: 6 },
  footerHint: { textAlign: 'center', color: London.fog, fontSize: 13, paddingVertical: 14 },
  primary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: London.flagRed,
    paddingVertical: 16,
    borderRadius: Radius.md,
  },
  primaryDisabled: { backgroundColor: London.fog, opacity: 0.5 },
  primaryText: { color: London.white, fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85 },

  summaryHeader: { paddingBottom: 30 },
  summaryFlag: {
    position: 'absolute',
    left: -60,
    bottom: -40,
    opacity: 0.14,
    transform: [{ rotate: '8deg' }],
  },
  summaryContent: { alignItems: 'center', paddingTop: 30, gap: 4 },
  summaryKicker: { color: London.gold, fontSize: 12, fontWeight: '800', letterSpacing: 1.6 },
  summaryScore: { color: London.white, fontSize: 58, fontWeight: '900' },
  summarySub: { color: 'rgba(255,255,255,0.85)', fontSize: 15 },
  summaryBody: { padding: 20, gap: 16 },

  rewardCard: {
    backgroundColor: London.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: London.gold,
    padding: 16,
    gap: 12,
  },
  rewardTitle: { color: London.cab, fontSize: 16, fontWeight: '800' },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rewardName: { color: London.cab, fontSize: 15, fontWeight: '700' },
  rewardDesc: { color: London.fog, fontSize: 13, lineHeight: 18 },

  lessonLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    backgroundColor: London.white,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: London.line,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  lessonLinkText: { flex: 1, color: London.royal, fontSize: 13, fontWeight: '700' },
  emptyText: { padding: 20, color: London.fog, fontSize: 14, lineHeight: 21 },
});
