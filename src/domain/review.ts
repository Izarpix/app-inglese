import type { Card, ErrorTag } from '@/src/content/types';
import type { AnswerRecord } from '@/src/store/app-state';

/**
 * Builds a review session out of the learner's own mistakes.
 *
 * Priority, in order:
 *   1. the exact cards answered wrong, oldest mistake first (most forgotten);
 *   2. cards that are not the same but share an error category with them —
 *      this is the "propose me something similar" part: getting the same card
 *      right again proves you remember the card, not the rule.
 *
 * Pure function: cards in, cards out, so it can be tested without the app.
 */
export function buildReviewSession(
  answers: AnswerRecord[],
  cards: Card[],
  limit: number,
): Card[] {
  const missCount = new Map<ErrorTag, number>();
  const missedCardIds: string[] = [];

  for (const answer of answers) {
    if (answer.grade === 'correct') continue;
    if (!missedCardIds.includes(answer.cardId)) missedCardIds.push(answer.cardId);
    for (const tag of answer.errorTags) {
      missCount.set(tag, (missCount.get(tag) ?? 0) + 1);
    }
  }

  if (missedCardIds.length === 0) return [];

  const byId = new Map(cards.map((card) => [card.id, card]));
  const session: Card[] = [];

  // 1. the cards actually missed
  for (const id of missedCardIds) {
    const card = byId.get(id);
    if (card && session.length < limit) session.push(card);
  }

  // 2. similar ones, ranked by how badly that category is going
  const weight = (card: Card) =>
    card.errorTags.reduce((sum, tag) => sum + (missCount.get(tag) ?? 0), 0);

  const similar = cards
    .filter((card) => !missedCardIds.includes(card.id) && weight(card) > 0)
    .sort((a, b) => weight(b) - weight(a));

  for (const card of similar) {
    if (session.length >= limit) break;
    session.push(card);
  }

  return session;
}

/** How many cards a review session would contain right now. */
export function reviewSize(answers: AnswerRecord[], cards: Card[], limit: number): number {
  return buildReviewSession(answers, cards, limit).length;
}
