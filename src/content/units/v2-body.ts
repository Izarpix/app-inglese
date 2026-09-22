import type { Unit } from '../types';

export const v2Body: Unit = {
  id: 'v2', stage: 'foundations', order: 8, title: 'Body parts: visual flashcards', summary: 'Learn and recall everyday body vocabulary from original cartoon images.', level: 'A2', errorTags: ['false-friend'],
  lesson: { rule: 'Look at the image, say the word before revealing it, then make one short sentence. This turns recognition into active recall.', schema: [{ label: 'First look', value: 'Name the body part without reading an answer.' }, { label: 'Reveal', value: 'Check the word and repeat it aloud.' }, { label: 'Use', value: 'Make a short phrase: My hand / My eye.' }], examples: [{ wrong: 'I have pain to my eye.', right: 'My eye hurts. / I have pain in my eye.', note: 'Use hurt for simple everyday descriptions.' }], traps: ['Body parts normally use my, your, his or her in everyday English.', 'Eye is singular; eyes is plural.'] },
  cards: [
    { id: 'v2-001', type: 'flashcard', prompt: 'Name this body part.', answers: ['hand'], image: 'body-hand', explanation: 'A hand is at the end of your arm. Try: “Raise your hand.”', errorTags: ['false-friend'], level: 'A2' },
    { id: 'v2-002', type: 'flashcard', prompt: 'Name this body part.', answers: ['eye'], image: 'body-eye', explanation: 'An eye is used for seeing. The plural is eyes.', errorTags: ['false-friend'], level: 'A2' },
  ],
};
