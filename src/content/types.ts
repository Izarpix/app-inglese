/**
 * Shape of the teaching content.
 *
 * Everything the learner sees is built from these three types. The SQLite
 * schema and the Supabase tables mirror them, so changing something here means
 * changing the database too.
 */

/**
 * Error categories. They do three jobs at once: they tag a card, they build the
 * learner's error profile, and they connect a mistake back to the note that
 * explains it. Derived from the course syllabus crossed with the mistakes
 * Italian speakers actually make.
 */
export const ERROR_TAGS = [
  // present
  'present-simple-vs-continuous',
  'state-verbs',
  // past
  'past-simple',
  'irregular-verb',
  'narrative-tense',
  'used-to',
  // present perfect
  'present-perfect-vs-past-simple',
  'present-perfect-continuous',
  'time-adverbial',
  'for-since',
  'been-vs-gone',
  // future
  'future-form',
  'future-time-clause',
  // modals
  'modal',
  'obligation',
  'deduction',
  'past-infinitive',
  // voice and reporting
  'passive',
  'double-object-passive',
  'reported-speech',
  'have-something-done',
  // conditionals
  'conditional',
  'wish',
  // verb patterns
  'gerund-vs-infinitive',
  'preposition-plus-gerund',
  'phrasal-verb',
  'get',
  // words
  'word-formation',
  'article',
  'quantifier',
  'uncountable',
  'preposition',
  'false-friend',
  'adjective-order',
  'do-vs-make',
  'question-form',
  'negative-form',
  'word-order',
  // ESP
  'esp-trend-vocabulary',
  'esp-structure',
  'esp-numbers',
] as const;

export type ErrorTag = (typeof ERROR_TAGS)[number];

/**
 * How the learner answers. The last four mirror the five sections of the real
 * written exam, so practising here is practising the exam paper itself.
 *
 * Open production, the answer is typed:
 * - `correct`    a sentence with a typical Italian mistake, to be fixed
 * - `fill`       one gap to complete, the verb or word given in brackets
 * - `rewrite`    an Italian sentence to say in English
 * - `vocab`      a word or expression to produce
 *
 * Exam formats:
 * - `choice`     multiple choice with preset options        (exam section 1)
 * - `build`      build a sentence from the words given      (exam section 2)
 * - `transform`  rewrite around a given keyword             (exam section 3)
 * - `box`        pick the right word from a word box        (exam section 4)
 * - `form`       word formation from a root word            (exam section 5)
 */
export type CardType =
  | 'correct'
  | 'fill'
  | 'rewrite'
  | 'vocab'
  | 'choice'
  | 'build'
  | 'transform'
  | 'box'
  | 'form';

export type Level = 'A2' | 'B1' | 'B2' | 'C1';

export type Card = {
  /** Stable id: unit prefix plus a progressive number. Never reused. */
  id: string;
  type: CardType;
  /** What the learner sees. A `fill` card contains exactly one `___`. */
  prompt: string;
  /** Accepted answers; the first is the canonical form shown as "the" answer. */
  answers: [string, ...string[]];
  /** `choice` and `box`: the options offered, in the order they appear. */
  options?: string[];
  /** `transform`: the word that must appear, unchanged, in the answer. */
  keyword?: string;
  /** `form`: the root word to be turned into the right part of speech. */
  root?: string;
  /** `transform` and `build`: the opening words already written for the learner. */
  given?: string;
  /** Optional nudge, shown on request, before the answer is revealed. */
  hint?: string;
  /** Why the answer is what it is. */
  explanation: string;
  errorTags: ErrorTag[];
  level: Level;
};

/**
 * A grammar note has a FIXED shape: four blocks, always the same, always in
 * this order. The note on the passive and the note on the conditionals must
 * read the same way, so after two of them the learner knows where to look.
 *
 * 1. `rule`     the rule in one sentence, the thing to keep if all else is lost
 * 2. `schema`   the key table: situation on the left, form on the right
 * 3. `examples` always wrong then right, never just right
 * 4. `traps`    what specifically trips up an Italian speaker
 *
 * It is a type and not a convention on purpose: a note missing a block does not
 * compile, so the form cannot drift from one topic to the next.
 */
export type Lesson = {
  rule: string;
  schema: { label: string; value: string }[];
  examples: { wrong: string; right: string; note: string }[];
  traps: string[];
};

/** Where a unit sits in the course. */
export type Stage = 'foundations' | 'core' | 'esp' | 'exam';

/**
 * A unit is one topic: the note that explains it and the exercises that drill
 * it, in the same file. Adding a topic means adding one file.
 */
export type Unit = {
  id: string;
  stage: Stage;
  /** Position within its stage. */
  order: number;
  title: string;
  /** One line under the title: what this unit is for. */
  summary: string;
  level: Level;
  errorTags: ErrorTag[];
  lesson: Lesson;
  cards: Card[];
};
