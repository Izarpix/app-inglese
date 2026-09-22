import type { Unit } from '../types';

export const e4ChartsTables: Unit = {
  id: 'e4', stage: 'esp', order: 4, title: 'Charts, tables and comparisons', summary: 'Describe visual data accurately in reports and presentations.', level: 'B2', errorTags: ['esp-structure', 'esp-numbers', 'esp-trend-vocabulary'],
  lesson: {
    rule: 'A clear data description identifies the visual, gives the main message, supports it with precise comparisons and numbers, and avoids listing every figure.',
    schema: [
      { label: 'Introduce the visual', value: 'The chart illustrates / compares / shows ...' },
      { label: 'Compare values', value: 'higher than, lower than, whereas, in contrast to' },
      { label: 'Report a number', value: 'stood at 45%; rose from 30% to 45%; a rise of 15 percentage points' },
      { label: 'Describe a table', value: 'the highest figure, the lowest proportion, a similar pattern' },
      { label: 'Finish with the main trend', value: 'Overall, ... / The most striking feature is ...' },
    ],
    examples: [
      { wrong: 'The chart has Italy 45 and France 30.', right: 'Italy recorded 45%, compared with 30% in France.', note: 'Use a reporting verb, a unit and a comparison.' },
      { wrong: 'Sales increased 10%.', right: 'Sales increased by 10% / Sales increased to 10%.', note: 'By gives the amount of change; to gives the final value.' },
      { wrong: 'All numbers are different.', right: 'Overall, Italy had the highest figure, whereas France had the lowest.', note: 'Lead with the main message, not a list of figures.' },
    ],
    traps: ['Do not confuse percent (a number) with percentage points (the difference between two percentages).', 'Increase is a noun or verb; higher is an adjective, so use higher than.', 'Check whether a period is complete before choosing present or past tenses.'],
  },
  cards: [
    { id: 'e4-001', type: 'choice', prompt: 'Italy recorded 45%, ___ France stood at 30%.', answers: ['whereas'], options: ['whereas', 'because', 'despite', 'therefore'], explanation: 'Whereas creates a direct contrast between two figures.', errorTags: ['esp-structure'], level: 'B2' },
    { id: 'e4-002', type: 'fill', prompt: 'Sales rose ___ 30% to 45%.', answers: ['from'], explanation: 'Use from for the starting value and to for the final value.', errorTags: ['esp-numbers'], level: 'B2' },
    { id: 'e4-003', type: 'choice', prompt: 'Choose the best overview: ___', answers: ['Overall, the highest figure was recorded in Italy.'], options: ['Overall, the highest figure was recorded in Italy.', 'The chart has many numbers.', 'Italy is 45 and France is 30.', 'There are two countries.'], explanation: 'An overview states the main feature of the visual.', errorTags: ['esp-structure'], level: 'B2' },
    { id: 'e4-004', type: 'form', prompt: 'There was a sharp ___ in revenue. (FALL)', answers: ['fall'], root: 'FALL', explanation: 'After a, use the noun fall.', errorTags: ['esp-trend-vocabulary'], level: 'B2' },
    { id: 'e4-reading-001', type: 'reading', prompt: 'What is the most striking feature of the table?', passage: { heading: 'Library use by faculty', body: 'The table compares weekly library visits by four faculties. Business recorded 420 visits, Arts 395, Engineering 210 and Law 205. Although Business and Arts were similar, both figures were almost double those for Engineering and Law.' }, answers: ['Business and Arts had far more visits than Engineering and Law.'], options: ['Business and Arts had far more visits than Engineering and Law.', 'Law recorded the highest number of visits.', 'All faculties had identical figures.', 'Engineering was slightly ahead of Business.'], explanation: 'The text explicitly compares the two higher figures with the two lower ones.', errorTags: ['esp-structure'], level: 'B2' },
    { id: 'e4-news-001', type: 'news', prompt: 'What does “by 15 percentage points” describe?', passage: { heading: 'Recycling rate improves', body: 'The city recycling rate rose from 40% in 2024 to 55% in 2025. Officials said that the rate had increased by 15 percentage points, rather than by 15%. The distinction matters because the change is calculated from two percentage values.' }, answers: ['The difference between 40% and 55%.'], options: ['The difference between 40% and 55%.', 'Fifteen percent of the 2025 rate.', 'The total amount recycled.', 'A prediction for the next year.'], explanation: '55% minus 40% equals 15 percentage points.', errorTags: ['esp-numbers'], level: 'B2' },
  ],
};
