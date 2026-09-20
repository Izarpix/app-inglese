/**
 * Shape of the teaching content.
 *
 * This file is the single source of truth for what a card is. The SQLite schema
 * (Phase 2) will mirror these fields, so changing something here means changing
 * the database too.
 */

/**
 * Error categories used to tag cards and, later, to fill `error_log`.
 * Derived from the exam syllabus (docs/06 §4bis) crossed with the typical
 * mistakes of Italian speakers (docs/06 §3).
 */
export const ERROR_TAGS = [
  'present-perfect-vs-past-simple',
  'time-adverbial',
  'for-since',
  'state-verbs',
  'irregular-verb',
  'been-vs-gone',
  'question-form',
  'negative-form',
  'narrative-tense',
  'future-form',
  'modal',
  'passive',
  'reported-speech',
  'conditional',
  'gerund-vs-infinitive',
  'phrasal-verb',
  'word-formation',
  'article',
  'preposition',
  'false-friend',
  'uncountable',
  'adjective-order',
  'do-vs-make',
] as const;

export type ErrorTag = (typeof ERROR_TAGS)[number];

/**
 * How the learner answers (ADR-008).
 *
 * Production types — the answer is typed, never picked from a list:
 * - `correct`  a sentence containing a typical Italian mistake, to be fixed
 * - `fill`     one gap to complete, the verb or word given in brackets
 * - `rewrite`  an Italian sentence to say in English
 * - `vocab`    a word or expression to produce
 *
 * Exam type — the answer is chosen from preset options, the way the university
 * exam asks it:
 * - `choice`   one gap or question with 3-4 options, exactly one correct
 */
export type CardType = 'correct' | 'fill' | 'rewrite' | 'vocab' | 'choice';

export type Level = 'B1' | 'B2' | 'C1';

export type Card = {
  /** Stable id: deck prefix + progressive number. Never reused, never renumbered. */
  id: string;
  type: CardType;
  /** What the learner sees. A `fill` card contains exactly one `___`. */
  prompt: string;
  /** Accepted answers; the first one is the canonical form shown as "the" answer. */
  answers: [string, ...string[]];
  /**
   * Options for a `choice` card, in the order they are shown. Exactly one of
   * them must equal `answers[0]`. Ignored by every other card type.
   */
  options?: string[];
  /** Optional nudge shown on request, before revealing the answer. */
  hint?: string;
  /** Why the answer is what it is. Written in Italian: it is content for the user. */
  explanation: string;
  errorTags: ErrorTag[];
  level: Level;
};

export type Deck = {
  /** Stable id, also used as the prefix of its card ids. */
  id: string;
  /** Shown in the app, in Italian. */
  title: string;
  description: string;
  /** Lessons of the exam syllabus this deck covers (docs/06 §4bis). */
  syllabusUnits: number[];
  level: Level;
  cards: Card[];
};
