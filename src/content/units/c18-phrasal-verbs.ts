import type { Unit } from '../types';

export const c18PhrasalVerbs: Unit = {
  id: 'c18', stage: 'core', order: 18, title: 'Phrasal verbs for university English', summary: 'Multi-word verbs for study, work and everyday communication.', level: 'B2', errorTags: ['phrasal-verb'],
  lesson: {
    rule: 'A phrasal verb is a verb plus a particle such as up, out, on or off. The particle changes the meaning, so learn the complete expression and its grammar together.',
    schema: [
      { label: 'Continue', value: 'carry on / keep on + -ing: Carry on working.' },
      { label: 'Discover or find', value: 'find out + information: Find out what the data means.' },
      { label: 'Postpone', value: 'put off + noun / -ing: They put off the meeting.' },
      { label: 'Handle successfully', value: 'deal with + problem: We need to deal with the issue.' },
      { label: 'Separable verbs', value: 'turn down the offer / turn the offer down; pronouns go in the middle: turn it down.' },
    ],
    examples: [
      { wrong: 'I need to find the answer out it.', right: 'I need to find it out.', note: 'With a pronoun, place it between the verb and particle.' },
      { wrong: 'They postponed to discuss the proposal.', right: 'They put off discussing the proposal.', note: 'Put off is followed by a noun or -ing form.' },
      { wrong: 'Please carry on to work.', right: 'Please carry on working.', note: 'Carry on takes -ing when an activity follows.' },
    ],
    traps: ['Do not guess a phrasal verb from the individual words: look it up as one unit.', 'Some phrasal verbs are inseparable, for example deal with; never split them.', 'A formal alternative may be better in an academic essay, but phrasal verbs are essential for speaking and listening.'],
  },
  cards: [
    { id: 'c18-001', type: 'choice', prompt: 'We need to ___ why the results changed.', answers: ['find out'], options: ['find out', 'find up', 'find over', 'find through'], explanation: 'Find out means discover information.', errorTags: ['phrasal-verb'], level: 'B2' },
    { id: 'c18-002', type: 'fill', prompt: 'They put ___ the meeting until next week.', answers: ['off'], explanation: 'Put off means postpone.', errorTags: ['phrasal-verb'], level: 'B2' },
    { id: 'c18-003', type: 'choice', prompt: 'Please ___ with your presentation.', answers: ['carry on'], options: ['carry on', 'carry out', 'carry away', 'carry over'], explanation: 'Carry on means continue an activity.', errorTags: ['phrasal-verb'], level: 'B2' },
    { id: 'c18-004', type: 'correct', prompt: 'Correct the sentence: “Turn down it because the offer is too low.”', answers: ['Turn it down because the offer is too low.'], explanation: 'A pronoun goes between a separable phrasal verb and its particle.', errorTags: ['phrasal-verb'], level: 'B2' },
  ],
};
