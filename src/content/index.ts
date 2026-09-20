import type { Card, ErrorTag, Stage, Unit } from './types';

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
import { e1Trends } from './units/e1-trends';
import { e2DataTenses } from './units/e2-data-tenses';
import { e3Numbers } from './units/e3-numbers';
import { f1Present } from './units/f1-present';
import { f2PastSimple } from './units/f2-past-simple';
import { f3Questions } from './units/f3-questions';
import { f4Articles } from './units/f4-articles';
import { f5WordOrder } from './units/f5-word-order';
import { f6FalseFriends } from './units/f6-false-friends';
import { x1Mock } from './units/x1-mock';

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
  e1Trends,
  e2DataTenses,
  e3Numbers,
  x1Mock,
];

export const STAGES: { id: Stage; title: string; subtitle: string }[] = [
  { id: 'foundations', title: 'Foundations', subtitle: 'The basics, from the ground up' },
  { id: 'core', title: 'Core grammar', subtitle: 'The syllabus of your course' },
  { id: 'esp', title: 'English for data and finance', subtitle: 'Charts, figures, markets' },
  { id: 'exam', title: 'Exam practice', subtitle: 'The written paper, section by section' },
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

/** Fisher-Yates: a real shuffle, so the session order is never the file order. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
