import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { ErrorTag } from '@/src/content/types';
import type { Grade } from '@/src/domain/grading';
import { flush, pushProfile, queueAnswer, queueSuggestion } from '@/src/sync/remote';
import { deviceId, load, save } from './storage';

const KEYS = {
  profile: 'profile',
  answers: 'answers',
  suggestions: 'suggestions',
} as const;

export type AnswerRecord = {
  cardId: string;
  deckId: string;
  grade: Grade;
  errorTags: ErrorTag[];
  at: number;
};

export type Suggestion = {
  id: string;
  author: string;
  text: string;
  at: number;
};

export type Profile = {
  name: string;
  level: 'B1' | 'B2' | 'C1';
  /** Cards the learner wants to do every day. */
  dailyGoal: number;
};

type AppState = {
  /** Stable id of this installation; identifies a friend's data without an account. */
  deviceId: string;
  profile: Profile;
  setProfile: (patch: Partial<Profile>) => void;
  answers: AnswerRecord[];
  suggestions: Suggestion[];
  recordAnswer: (record: Omit<AnswerRecord, 'at'>) => void;
  addSuggestion: (author: string, text: string) => void;
  removeSuggestion: (id: string) => void;
};

const AppStateContext = createContext<AppState | null>(null);

/**
 * Application state, saved to the device on every change.
 *
 * The shape of `AnswerRecord` is already the shape of the `reviews` /
 * `error_log` rows (docs/04), so moving this to SQLite — and later syncing it
 * to a server — means changing where it is written, not what is written.
 */
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [id] = useState(deviceId);
  const [profile, setProfileState] = useState<Profile>(() =>
    load<Profile>(KEYS.profile, { name: '', level: 'B2', dailyGoal: 10 }),
  );
  const [answers, setAnswers] = useState<AnswerRecord[]>(() =>
    load<AnswerRecord[]>(KEYS.answers, []),
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() =>
    load<Suggestion[]>(KEYS.suggestions, []),
  );

  useEffect(() => save(KEYS.profile, profile), [profile]);
  // On opening: send anything left over, and make sure the profile row exists
  // so this learner shows up by name in the owner's queries from the start.
  useEffect(() => {
    void (async () => {
      await flush();
      await pushProfile(load<Profile>(KEYS.profile, { name: '', level: 'B2', dailyGoal: 10 }));
    })();
  }, []);
  useEffect(() => save(KEYS.answers, answers), [answers]);
  useEffect(() => save(KEYS.suggestions, suggestions), [suggestions]);

  const setProfile = useCallback((patch: Partial<Profile>) => {
    setProfileState((current) => {
      const next = { ...current, ...patch };
      void pushProfile(next);
      return next;
    });
  }, []);

  const recordAnswer = useCallback((record: Omit<AnswerRecord, 'at'>) => {
    const full: AnswerRecord = { ...record, at: Date.now() };
    setAnswers((current) => [...current, full]);
    queueAnswer(full, record.deckId);
  }, []);

  const addSuggestion = useCallback((author: string, text: string) => {
    const entry: Suggestion = {
      id: `${Date.now()}`,
      author: author.trim() || 'Anonymous',
      text: text.trim(),
      at: Date.now(),
    };
    setSuggestions((current) => [entry, ...current]);
    queueSuggestion(entry);
  }, []);

  const removeSuggestion = useCallback((id: string) => {
    setSuggestions((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      deviceId: id,
      profile,
      setProfile,
      answers,
      suggestions,
      recordAnswer,
      addSuggestion,
      removeSuggestion,
    }),
    [id, profile, setProfile, answers, suggestions, recordAnswer, addSuggestion, removeSuggestion],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const state = useContext(AppStateContext);
  if (!state) throw new Error('useAppState must be used inside <AppStateProvider>');
  return state;
}

/** Cards answered wrong, grouped by error category, worst first. */
export function weakestTags(answers: AnswerRecord[]): { tag: ErrorTag; misses: number }[] {
  const counts = new Map<ErrorTag, number>();

  for (const answer of answers) {
    if (answer.grade === 'correct') continue;
    for (const tag of answer.errorTags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, misses]) => ({ tag, misses }))
    .sort((a, b) => b.misses - a.misses);
}
