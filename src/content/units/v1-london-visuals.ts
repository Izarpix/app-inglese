import type { Unit } from '../types';

export const v1LondonVisuals: Unit = {
  id: 'v1',
  stage: 'foundations',
  order: 7,
  title: 'London visual vocabulary',
  summary: 'Learn everyday city words with image flashcards.',
  level: 'A2',
  errorTags: ['false-friend'],
  lesson: {
    rule: 'A flashcard works best when you first try to recall the word, then reveal it and decide honestly whether it came easily.',
    schema: [
      { label: 'First look', value: 'Name the picture before turning the card.' },
      { label: 'After reveal', value: 'Say the word and one short phrase aloud.' },
      { label: 'Again', value: 'Use it when the word did not come quickly.' },
    ],
    examples: [
      { wrong: 'I take the metro in London.', right: 'I take the Tube in London.', note: 'Tube is the everyday name for the London Underground.' },
      { wrong: 'The red bus has two floors.', right: 'The red bus is a double-decker.', note: 'Double-decker is the usual noun for this bus.' },
    ],
    traps: ['Do not translate every city word directly from Italian.', 'Recall first: seeing the answer too early makes recognition feel like learning.'],
  },
  cards: [
    { id: 'v1-001', type: 'flashcard', prompt: 'What is this London transport called?', answers: ['the Tube', 'the underground'], image: 'tube-pass', explanation: 'The Tube is the familiar name for the London Underground.', errorTags: ['false-friend'], level: 'A2' },
    { id: 'v1-002', type: 'flashcard', prompt: 'What do you call this bus?', answers: ['a double-decker', 'a double-decker bus'], image: 'double-decker', explanation: 'A double-decker has two levels for passengers.', errorTags: ['false-friend'], level: 'A2' },
    { id: 'v1-003', type: 'flashcard', prompt: 'What is this famous clock tower called?', answers: ['Big Ben'], image: 'big-ben', explanation: 'Big Ben is the famous clock bell and the name commonly used for the tower.', errorTags: ['false-friend'], level: 'A2' },
    { id: 'v1-004', type: 'flashcard', prompt: 'What do you call a prize you earn?', answers: ['a reward', 'a badge'], image: 'spot-on', explanation: 'A reward is something earned for doing well.', errorTags: ['false-friend'], level: 'A2' },
  ],
};
