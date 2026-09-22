import type { Unit } from '../types';

export const c19PastHabits: Unit = {
  id: 'c19', stage: 'core', order: 19, title: 'Past habits: used to and would', summary: 'Talk clearly about repeated past actions and states that have changed.', level: 'B1', errorTags: ['used-to', 'narrative-tense'],
  lesson: {
    rule: 'Use used to for past states and repeated habits that are no longer true; use would for repeated actions in a past context, but not for past states.',
    schema: [
      { label: 'Past state no longer true', value: 'used to: I used to live in Rome.' },
      { label: 'Repeated past action', value: 'used to / would: Every summer, we would visit our grandparents.' },
      { label: 'Negative and question', value: 'did not use to / Did you use to ...? (use has no -d after did)' },
      { label: 'Single completed event', value: 'past simple: I visited them last weekend.' },
    ],
    examples: [
      { wrong: 'I would live in Rome when I was a child.', right: 'I used to live in Rome when I was a child.', note: 'Live is a state, so do not use would here.' },
      { wrong: 'Did you used to study at night?', right: 'Did you use to study at night?', note: 'Did already carries the past form.' },
      { wrong: 'Every day I used to go to the library yesterday.', right: 'I went to the library yesterday.', note: 'Yesterday is one finished event, not a repeated past habit.' },
    ],
    traps: ['Used to is pronounced /ˈjuːstə/ in connected speech, but keep the spelling use to after did.', 'Would needs a clear past context before the repeated action.', 'Do not use used to for a habit that still continues now.'],
  },
  cards: [
    { id: 'c19-001', type: 'choice', prompt: 'I ___ play tennis, but I stopped last year.', answers: ['used to'], options: ['used to', 'would to', 'use to', 'was used'], explanation: 'A former regular habit takes used to.', errorTags: ['used-to'], level: 'B1' },
    { id: 'c19-002', type: 'fill', prompt: 'Did you ___ (use) to live near the university?', answers: ['use'], explanation: 'After did, use the base form: use to.', errorTags: ['used-to'], level: 'B1' },
    { id: 'c19-003', type: 'choice', prompt: 'Every summer, my grandfather ___ tell us stories after dinner.', answers: ['would'], options: ['would', 'used', 'did used', 'has'], explanation: 'Would can describe a repeated past action after a past-time context.', errorTags: ['used-to'], level: 'B2' },
    { id: 'c19-004', type: 'correct', prompt: 'Correct the sentence: “She would be very shy at school.”', answers: ['She used to be very shy at school.'], explanation: 'Be is a state; use used to, not would.', errorTags: ['used-to'], level: 'B1' },
  ],
};
