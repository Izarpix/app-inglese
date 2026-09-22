import type { Card, CardType, ErrorTag, Stage, Unit } from './types';

import { c1PresentPerfect } from './units/c1-present-perfect';
import { c2PresentPerfectContinuous } from './units/c2-present-perfect-continuous';
import { c3PerfectVsPast } from './units/c3-perfect-vs-past';
import { c4Narrative } from './units/c4-narrative';
import { c5PastPerfect } from './units/c5-past-perfect';
import { c6FutureBasic } from './units/c6-future-basic';
import { c7FuturePerfect } from './units/c7-future-perfect';
import { c8FutureClauses } from './units/c8-future-clauses';
import { c9Obligation } from './units/c9-obligation';
import { c10Ability } from './units/c10-ability';
import { c11Deduction } from './units/c11-deduction';
import { c12Get } from './units/c12-get';
import { c13Passive } from './units/c13-passive';
import { c14Reporting } from './units/c14-reporting';
import { c15Conditionals } from './units/c15-conditionals';
import { c16Gerund } from './units/c16-gerund';
import { c17WordFormation } from './units/c17-word-formation';
import { c18PhrasalVerbs } from './units/c18-phrasal-verbs';
import { c19PastHabits } from './units/c19-past-habits';
import { e1Trends } from './units/e1-trends';
import { e2DataTenses } from './units/e2-data-tenses';
import { e3Numbers } from './units/e3-numbers';
import { e4ChartsTables } from './units/e4-charts-tables';
import { f1Present } from './units/f1-present';
import { f2PastSimple } from './units/f2-past-simple';
import { f3Questions } from './units/f3-questions';
import { f4Articles } from './units/f4-articles';
import { f5WordOrder } from './units/f5-word-order';
import { f6FalseFriends } from './units/f6-false-friends';
import { v1LondonVisuals } from './units/v1-london-visuals';
import { v2Body } from './units/v2-body';
import { v3Everyday } from './units/v3-everyday';
import { x1Mock } from './units/x1-mock';
import { x2Reading } from './units/x2-reading';

/**
 * The whole course, in teaching order: foundations first, then the syllabus of
 * the university module, then the ESP thread, then exam practice.
 *
 * Adding a topic means writing one file and adding it here.
 */
export const units: Unit[] = [
  f1Present,
  f2PastSimple,
  f3Questions,
  f4Articles,
  f5WordOrder,
  f6FalseFriends,
  v1LondonVisuals,
  v2Body,
  v3Everyday,
  c1PresentPerfect,
  c2PresentPerfectContinuous,
  c3PerfectVsPast,
  c4Narrative,
  c5PastPerfect,
  c6FutureBasic,
  c7FuturePerfect,
  c8FutureClauses,
  c9Obligation,
  c10Ability,
  c11Deduction,
  c12Get,
  c13Passive,
  c14Reporting,
  c15Conditionals,
  c16Gerund,
  c17WordFormation,
  c18PhrasalVerbs,
  c19PastHabits,
  e1Trends,
  e2DataTenses,
  e3Numbers,
  e4ChartsTables,
  x1Mock,
  x2Reading,
];

export const STAGES: { id: Stage; title: string; subtitle: string }[] = [
  { id: 'foundations', title: 'Foundations', subtitle: 'The basics, from the ground up' },
  { id: 'core', title: 'Core grammar', subtitle: 'The syllabus of your course' },
  { id: 'esp', title: 'English for data and finance', subtitle: 'Charts, figures, markets' },
  { id: 'exam', title: 'Exam practice', subtitle: 'The written paper, section by section' },
];

/** The shelf structure used by the Learn tab. It is deliberately independent
 * from the course stages: a learner looks for a subject, not a database phase. */
export const STUDY_CATEGORIES = [
  {
    id: 'grammar',
    title: 'Grammar',
    subtitle: 'Build the structure of your English',
    icon: 'book-open-page-variant' as const,
    unitIds: ['f1', 'f2', 'f3', 'f4', 'f5', 'c1', 'c2', 'c3', 'c4', 'c5', 'c19', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11', 'c13', 'c14', 'c15', 'c16'],
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    subtitle: 'Useful words, collocations and visual recall',
    icon: 'book-alphabet' as const,
    unitIds: ['v1', 'v2', 'v3', 'f6', 'c12', 'c18', 'c17'],
  },
  {
    id: 'english-for-work',
    title: 'English for work',
    subtitle: 'Data, figures and professional communication',
    icon: 'chart-line' as const,
    unitIds: ['e1', 'e2', 'e3', 'e4'],
  },
  {
    id: 'exam-practice',
    title: 'Exam practice',
    subtitle: 'Train with mixed exam-style activities',
    icon: 'school' as const,
    unitIds: ['x1'],
  },
] as const;

/** The Practice flow is exercise-first: learners pick a format, then one of
 * these 21 syllabus areas. A single area can span two closely linked units. */
export const PRACTICE_AREAS = [
  { id: 'present', title: 'Present forms', unitIds: ['f1'] },
  { id: 'past-simple', title: 'Past simple', unitIds: ['f2'] },
  { id: 'past-narrative', title: 'Past habits & narrative tenses', unitIds: ['c19', 'c4', 'c5'] },
  { id: 'questions', title: 'Question forms', unitIds: ['f3'] },
  { id: 'articles', title: 'Articles & determiners', unitIds: ['f4'] },
  { id: 'word-order', title: 'Word order', unitIds: ['f5'] },
  { id: 'vocabulary', title: 'Vocabulary & false friends', unitIds: ['f6', 'v1', 'v2', 'v3'] },
  { id: 'perfect', title: 'Present perfect forms', unitIds: ['c1', 'c2', 'c3'] },
  { id: 'future', title: 'Future forms & time clauses', unitIds: ['c6', 'c7', 'c8'] },
  { id: 'modals', title: 'Modal verbs', unitIds: ['c9', 'c10', 'c11'] },
  { id: 'verb-patterns', title: 'Gerunds & infinitives', unitIds: ['c16'] },
  { id: 'get', title: 'Uses of get', unitIds: ['c12'] },
  { id: 'phrasal', title: 'Phrasal verbs', unitIds: ['c18'] },
  { id: 'passive', title: 'The passive', unitIds: ['c13'] },
  { id: 'reporting', title: 'Reporting verbs', unitIds: ['c14'] },
  { id: 'conditionals', title: 'Conditionals', unitIds: ['c15'] },
  { id: 'word-formation', title: 'Word formation', unitIds: ['c17'] },
  { id: 'trends', title: 'Trends & graphs', unitIds: ['e1'] },
  { id: 'data', title: 'Data tenses', unitIds: ['e2'] },
  { id: 'numbers', title: 'Numbers, charts & tables', unitIds: ['e3', 'e4'] },
  { id: 'exam', title: 'Mock exam & reading', unitIds: ['x1', 'x2'] },
] as const;

export type PracticeArea = (typeof PRACTICE_AREAS)[number];

export const PRACTICE_FORMATS: { id: string; title: string; subtitle: string; icon: string; types: CardType[] }[] = [
  { id: 'choice', title: 'Multiple choice', subtitle: 'Choose the strongest answer', icon: 'format-list-checks', types: ['choice', 'box'] },
  { id: 'complete', title: 'Complete sentences', subtitle: 'Fill gaps and form the right word', icon: 'form-textbox', types: ['fill', 'form', 'vocab'] },
  { id: 'reading', title: 'Read a passage', subtitle: 'Read an academic text and answer', icon: 'text-box-search-outline', types: ['reading'] },
  { id: 'news', title: 'Read the news', subtitle: 'Read a short report and answer', icon: 'newspaper-variant-outline', types: ['news'] },
  { id: 'writing', title: 'Sentence work', subtitle: 'Correct, translate and transform', icon: 'pencil-ruler', types: ['correct', 'rewrite', 'build', 'transform'] },
  { id: 'flashcards', title: 'Visual flashcards', subtitle: 'Recall vocabulary from images', icon: 'image-outline', types: ['flashcard'] },
];

export function unitsOf(stage: Stage): Unit[] {
  return units.filter((unit) => unit.stage === stage).sort((a, b) => a.order - b.order);
}

export function getUnit(id: string): Unit | undefined {
  return units.find((unit) => unit.id === id);
}

/** The unit that teaches a given mistake, used to turn an error into theory. */
export function unitForTag(tag: ErrorTag): Unit | undefined {
  return (
    units.find((unit) => unit.errorTags.includes(tag)) ??
    units.find((unit) => unit.cards.some((card) => card.errorTags.includes(tag)))
  );
}

export const allCards: Card[] = units.flatMap((unit) => unit.cards);

/** Cards grouped by their teaching unit; never infer the unit from a card id. */
export function cardsForUnits(unitIds: readonly string[]): Card[] {
  return units.filter((unit) => unitIds.includes(unit.id)).flatMap((unit) => unit.cards);
}

/** Extra teaching context for the lesson reader. Rules alone are easy to
 * memorise but hard to apply; these notes explain the decision the learner is
 * making before they look at the examples. */
export type LessonGuide = { overview: string; memoryTip: string };

const LESSON_GUIDES: Partial<Record<string, LessonGuide>> = {
  f1: { overview: 'First decide whether you are talking about a routine or something temporary and in progress. English makes that distinction even when Italian uses the same present form.', memoryTip: 'Routine = simple. Right now / temporary = continuous.' },
  f2: { overview: 'Use the past simple to place a completed event clearly in the past. The important decision is whether the time is finished, not whether the action took a long time.', memoryTip: 'Finished time expression? Start with the past simple.' },
  f3: { overview: 'Questions are built around an auxiliary verb. Find the tense first, then choose do, be, have or a modal before the subject.', memoryTip: 'Auxiliary first, subject second, main verb after.' },
  f4: { overview: 'Articles show whether the listener can identify a noun. Think: one of many, a specific known thing, or things in general.', memoryTip: 'New/one thing: a or an. Known thing: the. General plural: no article.' },
  f5: { overview: 'English word order carries information that Italian can often express with endings or emphasis. Keep the subject and verb together before adding details.', memoryTip: 'Subject + verb + object is your safe starting line.' },
  f6: { overview: 'False friends are dangerous because they feel familiar. Pause whenever an English word looks exactly like Italian and check the meaning in context.', memoryTip: 'A familiar-looking word is a signal to verify, not to trust.' },
  v1: { overview: 'Visual recall builds a direct connection between an object and its English name. Try to name the image before you reveal the answer.', memoryTip: 'Look, recall aloud, reveal, then use the word in a phrase.' },
  c1: { overview: 'The present perfect connects a past event to now; the past simple leaves it in a finished past time. The time reference is the key to choosing.', memoryTip: 'Finished time = past simple. Connection to now = present perfect.' },
  c2: { overview: 'The continuous form highlights duration or an activity still in progress. It answers “how long?” or explains a present result.', memoryTip: 'Have/has been + -ing puts the focus on the activity and its duration.' },
  c3: { overview: 'Both tenses can describe the past, but only the present perfect reaches the present moment. Look for a finished date, then choose the past simple.', memoryTip: 'Yesterday/last/ago close the past; already/yet/ever often link to now.' },
  c4: { overview: 'A story needs a background, a sequence of events and sometimes an earlier past. Choose the tense according to the role of each event in the story.', memoryTip: 'Background = continuous; main event = past simple; earlier event = past perfect.' },
  c5: { overview: 'The past perfect is not “a more difficult past”: it simply makes the order of two past moments clear. Use it when the earlier action could be unclear.', memoryTip: 'Two past moments? The earlier one can take had + past participle.' },
  c6: { overview: 'Future forms express intention, prediction, arrangement and evidence differently. Choose the meaning first instead of translating “futuro” mechanically.', memoryTip: 'Plan = going to; arrangement = present continuous; instant decision/prediction = will.' },
  c7: { overview: 'Future perfect forms let you stand at a future point and look back at what will be completed or continuing by then.', memoryTip: 'By + future deadline often calls for will have + past participle.' },
  c8: { overview: 'After when, until, as soon as and if, English usually uses a present form for a future meaning. The time clause is not a second future sentence.', memoryTip: 'Future meaning after if/when: present simple, not will.' },
  c9: { overview: 'Modals show how strong an obligation is and where it comes from: a speaker, a rule, advice or necessity. This is more important than the Italian translation.', memoryTip: 'Must = strong speaker/rule obligation; have to = external necessity.' },
  c10: { overview: 'Ability changes with time and situation. Can is useful for general present ability, but not every past or future meaning.', memoryTip: 'General ability: can/could. One successful past action: was/were able to.' },
  c11: { overview: 'Deduction is a scale of certainty. Use the evidence you have to choose a strong, medium or weak conclusion.', memoryTip: 'Must = very likely; might/may/could = possible; cannot = impossible.' },
  c12: { overview: 'Get is a flexible everyday verb whose meaning changes with the word after it. Learn it in whole phrases rather than as a single Italian translation.', memoryTip: 'Memorise get + adjective, get + noun and get + particle as separate patterns.' },
  c13: { overview: 'The passive moves attention from the person doing an action to the result, process or thing affected. Keep the original tense in the verb be.', memoryTip: 'Passive = form of be + past participle; the tense lives in be.' },
  c14: { overview: 'Reported speech is about viewpoint: you report what was said from a later moment. Pronouns, time words and tense may therefore move back.', memoryTip: 'Ask: who is speaking now, and when is “now” from their perspective?' },
  c15: { overview: 'Conditionals combine a condition and its consequence. The tense pattern signals whether the situation is real, likely, imaginary or impossible in the past.', memoryTip: 'Real possibility uses present + will; imaginary present uses past + would.' },
  c16: { overview: 'Some verbs are followed by -ing, others by to + infinitive, and some change meaning with the choice. Learn the verb and its pattern together.', memoryTip: 'Do not learn “avoid” alone: learn “avoid doing”.' },
  c17: { overview: 'Word formation asks you to recognise the job a word must do in its sentence, then build the correct noun, verb, adjective or adverb.', memoryTip: 'Read the words around the gap first: they tell you the word class needed.' },
  e1: { overview: 'Describing trends means choosing both the direction and the degree of change. A precise verb often communicates more clearly than a long sentence.', memoryTip: 'Direction + degree: rose sharply, fell slightly, remained stable.' },
  e2: { overview: 'Data language depends on the time period: use present forms for current facts and past forms for completed periods, then make comparisons carefully.', memoryTip: 'Check the chart dates before choosing the tense.' },
  e3: { overview: 'Numbers, fractions and percentages need accurate grammar as well as accurate maths. Focus on how the number attaches to the noun and verb.', memoryTip: 'Percentages need “of”; the noun after it helps decide singular or plural verb.' },
  x1: { overview: 'Exam practice is about recognising the task before you answer. Slow down for the instruction, then use the same grammar decisions you have practised by topic.', memoryTip: 'Identify the exercise type, scan for clues, then check form and meaning.' },
  c18: { overview: 'Phrasal verbs are not optional “informal extras”: they appear constantly in lectures, discussions and everyday university communication. Learn each verb with its particle and the structure that follows it.', memoryTip: 'Learn the whole chunk: find out, put off doing, deal with a problem.' },
  c19: { overview: 'Past-habit forms help you make a narrative precise. Use them only when a former habit or state is relevant and no longer true, not simply because a sentence refers to the past.', memoryTip: 'Used to covers states and habits; would only repeats actions.' },
  e4: { overview: 'In a report or presentation, data matters only when the reader can see the pattern. Select the highest, lowest and most significant change, then support that message with accurate figures.', memoryTip: 'Introduce → overview → precise comparisons → short conclusion.' },
};

export function lessonGuideFor(unit: Unit): LessonGuide {
  return LESSON_GUIDES[unit.id] ?? {
    overview: `This topic develops ${unit.summary.toLowerCase()} Read the rule, compare the examples, then say the pattern aloud before practising.`,
    memoryTip: 'Choose the meaning first, then choose the grammar that expresses it.',
  };
}

/** Fisher-Yates: a real shuffle, so the session order is never the file order. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
