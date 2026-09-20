import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '@/constants/supabase';
import type { AnswerRecord, Profile, Suggestion } from '@/src/store/app-state';
import { load, loadRaw, removeRaw, save, saveRaw } from '@/src/store/storage';

/**
 * Sync to Supabase, offline first.
 *
 * The app never waits for the network: everything is written to the device
 * first (docs/04), then pushed up. Anything that fails to send is parked in an
 * outbox and retried the next time the app opens, so a session on the train
 * with no signal is not lost.
 *
 * Signing in is anonymous: nobody has to create a password or hand over an
 * email address to try the app. The account lives on the device, which is why
 * the display name is the only thing that identifies a person.
 */

const OUTBOX_ANSWERS = 'outbox-answers';
const OUTBOX_SUGGESTIONS = 'outbox-suggestions';

/** Supabase needs an async storage; ours is synchronous, so we wrap it. */
const storageAdapter = {
  getItem: async (key: string) => loadRaw(key),
  setItem: async (key: string, value: string) => saveRaw(key, value),
  removeItem: async (key: string) => removeRaw(key),
};

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  client ??= createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: storageAdapter,
      persistSession: true,
      autoRefreshToken: true,
      // the app is not an OAuth callback target, so there is never a session in the URL
      detectSessionInUrl: false,
    },
  });
  return client;
}

/** The current user id, signing in anonymously the first time. */
export async function ensureSession(): Promise<string | null> {
  try {
    const supabase = getClient();
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) return data.session.user.id;

    const { data: created, error } = await supabase.auth.signInAnonymously();
    if (error) return null;
    return created.user?.id ?? null;
  } catch {
    return null;
  }
}

type PendingAnswer = AnswerRecord & { unitId: string };

/** Records an answer for sending, and tries to send everything waiting. */
export function queueAnswer(record: AnswerRecord, unitId: string): void {
  const pending = load<PendingAnswer[]>(OUTBOX_ANSWERS, []);
  save(OUTBOX_ANSWERS, [...pending, { ...record, unitId }]);
  void flush();
}

export function queueSuggestion(suggestion: Suggestion): void {
  const pending = load<Suggestion[]>(OUTBOX_SUGGESTIONS, []);
  save(OUTBOX_SUGGESTIONS, [...pending, suggestion]);
  void flush();
}

/** Writes the profile; it is a single row, so the latest value simply wins. */
export async function pushProfile(profile: Profile): Promise<void> {
  try {
    const userId = await ensureSession();
    if (!userId) return;

    await getClient()
      .from('profiles')
      .upsert({
        id: userId,
        display_name: profile.name,
        level: profile.level,
        daily_goal: profile.dailyGoal,
        updated_at: new Date().toISOString(),
      });
  } catch {
    // the profile is not worth an outbox: the next change will carry it up
  }
}

let flushing = false;

/** Sends everything waiting in the outboxes. Safe to call at any time. */
export async function flush(): Promise<void> {
  if (flushing) return;
  flushing = true;

  try {
    const answers = load<PendingAnswer[]>(OUTBOX_ANSWERS, []);
    const suggestions = load<Suggestion[]>(OUTBOX_SUGGESTIONS, []);
    if (answers.length === 0 && suggestions.length === 0) return;

    const userId = await ensureSession();
    if (!userId) return;

    const supabase = getClient();

    if (answers.length) {
      const { error } = await supabase.from('answers').insert(
        answers.map((a) => ({
          user_id: userId,
          card_id: a.cardId,
          unit_id: a.unitId,
          grade: a.grade,
          error_tags: a.errorTags,
          answered_at: new Date(a.at).toISOString(),
        })),
      );
      if (!error) save(OUTBOX_ANSWERS, []);
    }

    if (suggestions.length) {
      const { error } = await supabase.from('suggestions').insert(
        suggestions.map((s) => ({
          user_id: userId,
          author: s.author,
          body: s.text,
          created_at: new Date(s.at).toISOString(),
        })),
      );
      if (!error) save(OUTBOX_SUGGESTIONS, []);
    }
  } catch {
    // offline, or the project is paused: everything stays in the outbox
  } finally {
    flushing = false;
  }
}

/** How many items are still waiting to go up. Shown in the profile screen. */
export function pendingCount(): number {
  return (
    load<PendingAnswer[]>(OUTBOX_ANSWERS, []).length +
    load<Suggestion[]>(OUTBOX_SUGGESTIONS, []).length
  );
}
