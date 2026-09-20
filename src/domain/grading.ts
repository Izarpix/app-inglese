import type { Card } from '@/src/content/types';

export type Grade = 'correct' | 'almost' | 'wrong';

export type GradeResult = {
  grade: Grade;
  /** The accepted answer the learner came closest to; always the canonical one on a miss. */
  expected: string;
};

/**
 * Pure grading. No React, no database: input in, verdict out (docs/03).
 *
 * `almost` means the answer differs by a single character — a typo, not a
 * mistake. Telling the two apart matters: marking a typo as an error would
 * poison the error profile and make the app insist on grammar the learner
 * already knows.
 */
export function gradeAnswer(card: Card, input: string): GradeResult {
  const given = normalise(input);
  const canonical = card.answers[0];

  if (!given) return { grade: 'wrong', expected: canonical };

  for (const answer of card.answers) {
    if (normalise(answer) === given) return { grade: 'correct', expected: answer };
  }

  for (const answer of card.answers) {
    if (editDistance(normalise(answer), given) <= 1) return { grade: 'almost', expected: answer };
  }

  return { grade: 'wrong', expected: canonical };
}

/**
 * Strips everything that is not the answer: case, punctuation, curly quotes,
 * double spaces, and the slash used to separate the halves of a two-gap answer.
 */
export function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[.,!?;:"“”()/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Levenshtein distance, capped implicitly by the short strings we compare. */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 1) return 2;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
    }
    previous = current;
  }

  return previous[b.length];
}
