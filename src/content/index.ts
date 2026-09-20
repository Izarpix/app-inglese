import { chartsAndData } from './decks/charts-and-data';
import { falseFriends } from './decks/false-friends';
import { presentPerfectVsPastSimple } from './decks/present-perfect-vs-past-simple';
import { verbForms } from './decks/verb-forms';
import type { Card, Deck } from './types';

/**
 * Every deck in the app, in the order of the exam syllabus (docs/06 §4bis).
 * Adding a deck means adding one import and one entry here.
 */
export const decks: Deck[] = [
  presentPerfectVsPastSimple,
  verbForms,
  falseFriends,
  chartsAndData,
];

export function getDeck(id: string): Deck | undefined {
  return decks.find((deck) => deck.id === id);
}

export const allCards: Card[] = decks.flatMap((deck) => deck.cards);

/** Fisher-Yates: a real shuffle, so the session order is never the file order. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
