import type { AnswerRecord } from '@/src/store/app-state';

/**
 * Rewards are computed, never stored: given the list of answers, the same
 * badges always come out. That keeps them honest (no way to end up with a badge
 * the numbers do not justify) and survives the move to SQLite untouched.
 */
export type Reward = {
  id: string;
  title: string;
  description: string;
  /** Placeholder colour until the real artwork lands in assets/images/rewards/. */
  color: string;
  /** Icon shown on the placeholder badge; replaced by the artwork later. */
  icon: string;
  /** How many units are needed to unlock it. */
  target: number;
  /** How far the learner is, capped at `target`. */
  progress: number;
};

export function computeRewards(answers: AnswerRecord[]): Reward[] {
  const total = answers.length;
  const right = answers.filter((a) => a.grade !== 'wrong').length;
  const perfectStreak = longestStreak(answers);

  const definitions: Omit<Reward, 'progress'>[] = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Answer your first card.',
      color: '#C8102E',
      icon: 'flag-checkered',
      target: 1,
    },
    {
      id: 'tube-pass',
      title: 'Tube Pass',
      description: 'Answer 10 cards.',
      color: '#0019A8',
      icon: 'subway-variant',
      target: 10,
    },
    {
      id: 'double-decker',
      title: 'Double Decker',
      description: 'Answer 50 cards.',
      color: '#DA291C',
      icon: 'bus-double-decker',
      target: 50,
    },
    {
      id: 'big-ben',
      title: 'Big Ben',
      description: 'Answer 200 cards.',
      color: '#1B7F5C',
      icon: 'clock-time-eight',
      target: 200,
    },
    {
      id: 'spot-on',
      title: 'Spot On',
      description: 'Get 25 answers right.',
      color: '#F2B705',
      icon: 'target',
      target: 25,
    },
    {
      id: 'royal-flush',
      title: 'Royal Flush',
      description: 'Ten right answers in a row.',
      color: '#012169',
      icon: 'crown',
      target: 10,
    },
  ];

  const progressOf = (id: string) => {
    if (id === 'spot-on') return right;
    if (id === 'royal-flush') return perfectStreak;
    return total;
  };

  return definitions.map((definition) => ({
    ...definition,
    progress: Math.min(progressOf(definition.id), definition.target),
  }));
}

export function isUnlocked(reward: Reward): boolean {
  return reward.progress >= reward.target;
}

/** Longest run of answers that were not wrong. */
function longestStreak(answers: AnswerRecord[]): number {
  let best = 0;
  let current = 0;

  for (const answer of answers) {
    current = answer.grade === 'wrong' ? 0 : current + 1;
    best = Math.max(best, current);
  }

  return best;
}
