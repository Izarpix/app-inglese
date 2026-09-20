import type { ErrorTag, Level } from './types';

/**
 * A lesson has a FIXED shape: four blocks, always the same, always in this
 * order. That is the point. The note on the passive and the note on the
 * conditionals must read the same way, so after two of them the learner already
 * knows where to look for what.
 *
 * 1. `rule`     the rule in one sentence, the thing to keep if all else is lost
 * 2. `schema`   the key table: situation on the left, form on the right
 * 3. `examples` always wrong then right, never just right
 * 4. `traps`    what specifically trips up an Italian speaker
 *
 * Adding a lesson means filling these fields; the screen renders them the same
 * way every time, so there is no way to "explain this one differently".
 */
export type Lesson = {
  id: string;
  title: string;
  /** Short line under the title: what this note is for. */
  summary: string;
  level: Level;
  /** Lessons of the exam syllabus this covers (docs/06). Not shown in the app. */
  syllabusUnits: number[];
  /** The error categories this lesson explains. Links mistakes to theory. */
  errorTags: ErrorTag[];
  rule: string;
  schema: { label: string; value: string }[];
  examples: { wrong: string; right: string; note: string }[];
  traps: string[];
};

export const lessons: Lesson[] = [
  {
    id: 'lesson-ppps',
    title: 'Present perfect or past simple',
    summary: 'When the past is closed, and when it is still open.',
    level: 'B1',
    syllabusUnits: [2, 3],
    errorTags: ['present-perfect-vs-past-simple', 'time-adverbial', 'for-since', 'been-vs-gone'],
    rule: 'If the moment it happened is finished and identified, use the past simple; if the period is still open, or what matters is the effect right now, use the present perfect.',
    schema: [
      { label: 'yesterday, last week, in 2008, two hours ago, when...?', value: 'past simple' },
      { label: 'today, this week, this year (not over yet)', value: 'present perfect' },
      { label: 'ever, never, already, yet, just, so far', value: 'present perfect' },
      { label: 'for + length of time, since + starting point', value: 'present perfect' },
      { label: 'Form', value: 'have / has + past participle (third column)' },
    ],
    examples: [
      {
        wrong: 'I have seen him yesterday.',
        right: 'I saw him yesterday.',
        note: '"Yesterday" closes the time frame, so the past simple is compulsory.',
      },
      {
        wrong: 'I live in Milan since 2023.',
        right: 'I have lived in Milan since 2023.',
        note: 'Italian uses the present tense here. English uses the present perfect.',
      },
      {
        wrong: 'When have you submitted the report?',
        right: 'When did you submit the report?',
        note: '"When" asks for an exact moment, so the past is closed.',
      },
    ],
    traps: [
      'The Italian passato prossimo does not map onto the present perfect. Only the time expression decides.',
      '"For" takes a length of time (for two hours), "since" a starting point (since Monday). Never "since two hours".',
      '"I have been to London" means you went and came back. "I have gone to London" means you are still there.',
      'After "have" comes the past participle, not the past simple: has written, not has wrote.',
    ],
  },
  {
    id: 'lesson-narrative',
    title: 'Telling a story in the past',
    summary: 'Past simple, past continuous, past perfect: who does what in a narrative.',
    level: 'B2',
    syllabusUnits: [4, 5, 6],
    errorTags: ['narrative-tense'],
    rule: 'The past simple moves the story forward, the past continuous sets the background, and the past perfect goes back to what had already happened.',
    schema: [
      { label: 'Main events, in order', value: 'past simple: I opened the file' },
      { label: 'Long background, interrupted', value: 'past continuous: I was reading when...' },
      { label: 'Earlier than another past event', value: 'past perfect: it had already started' },
      { label: 'Length of time up to a past point', value: 'past perfect continuous: had been waiting' },
      { label: 'Past habit, now over', value: 'used to + infinitive' },
    ],
    examples: [
      {
        wrong: 'While I read my notes, the lecturer changed the slide.',
        right: 'While I was reading my notes, the lecturer changed the slide.',
        note: '"While" plus a long action calls for the past continuous.',
      },
      {
        wrong: 'When we arrived, the seminar has already started.',
        right: 'When we arrived, the seminar had already started.',
        note: 'Earlier than another past event, so past perfect.',
      },
      {
        wrong: 'I was used to take the bus.',
        right: 'I used to take the bus.',
        note: '"Used to + infinitive" is a past habit. "Be used to + -ing" means to be accustomed to.',
      },
    ],
    traps: [
      'The Italian imperfetto is not always a past continuous: "abitavo a Roma" is "I lived in Rome".',
      'The past perfect is only needed when the order is not already clear. Do not put it everywhere.',
      '"Used to" has no present form. For a present habit, use the present simple.',
    ],
  },
  {
    id: 'lesson-future',
    title: 'Talking about the future',
    summary: 'Will, going to, present continuous: three futures for three situations.',
    level: 'B1',
    syllabusUnits: [7, 8, 9],
    errorTags: ['future-form'],
    rule: 'English picks the future form according to how settled the plan is: will for what you decide now, going to for what you already had in mind, present continuous for what is already in the diary.',
    schema: [
      { label: 'Decision made right now', value: "will: I'll help you" },
      { label: 'Intention already formed, or visible evidence', value: "going to: it's going to rain" },
      { label: 'Fixed arrangement', value: 'present continuous: I am meeting him at four' },
      { label: 'Timetables and schedules', value: 'present simple: the train leaves at six' },
      { label: 'Finished by a future point', value: 'future perfect: I will have finished by May' },
    ],
    examples: [
      {
        wrong: "I'll call you as soon as I will get the email.",
        right: "I'll call you as soon as I get the email.",
        note: 'After when, as soon as, until, before, after: present tense, never the future.',
      },
      {
        wrong: 'Look at those clouds, it will rain.',
        right: 'Look at those clouds, it is going to rain.',
        note: 'There is evidence in front of you, so "going to".',
      },
      {
        wrong: 'Tomorrow I will meet my supervisor, it is in the diary.',
        right: 'Tomorrow I am meeting my supervisor, it is in the diary.',
        note: 'A fixed arrangement takes the present continuous.',
      },
    ],
    traps: [
      'The rule Italian speakers break most: "quando arriverò" is "when I arrive", not "when I will arrive".',
      '"Shall" survives mainly in offers: "Shall I open the window?".',
      'The Italian present used for the future ("domani vado a Roma") becomes going to or the present continuous.',
    ],
  },
  {
    id: 'lesson-modals',
    title: 'Modal verbs',
    summary: 'Obligation, ability, deduction: must, can, should, might.',
    level: 'B2',
    syllabusUnits: [10, 11],
    errorTags: ['modal'],
    rule: 'Modals never change form, never take "to" after them, and never take the -s of the third person.',
    schema: [
      { label: 'Obligation', value: 'must / have to' },
      { label: 'Prohibition', value: "mustn't  (not the same as don't have to = not necessary)" },
      { label: 'Ability', value: 'can (present), could (past)' },
      { label: 'Advice', value: 'should / ought to' },
      { label: 'Near certainty', value: "must be  ·  impossible: can't be" },
      { label: 'Uncertain possibility', value: 'may / might / could' },
    ],
    examples: [
      {
        wrong: 'I must to study tonight.',
        right: 'I must study tonight.',
        note: 'After a modal the infinitive has no "to".',
      },
      {
        wrong: "In the library you don't have to eat: there is a sign.",
        right: "In the library you mustn't eat: there is a sign.",
        note: '"Mustn\'t" is forbidden, "don\'t have to" is not required. They are opposites.',
      },
      {
        wrong: 'She cans speak three languages.',
        right: 'She can speak three languages.',
        note: 'Modals never take an -s.',
      },
    ],
    traps: [
      'Italian "devo" covers both must and have to: must is an obligation you feel, have to comes from outside.',
      'The past of must is "had to". "I must go yesterday" does not exist.',
      '"Could have + past participle" is the reproach: "you could have told me".',
    ],
  },
  {
    id: 'lesson-conditionals',
    title: 'Conditionals',
    summary: 'First, second, third: how real is the thing you are imagining.',
    level: 'B2',
    syllabusUnits: [15],
    errorTags: ['conditional'],
    rule: 'The "if" half never takes will or would: its tense always steps one notch back from the time you actually mean.',
    schema: [
      { label: 'Real, likely (first)', value: 'if + present simple, then will + infinitive' },
      { label: 'Unreal present (second)', value: 'if + past simple, then would + infinitive' },
      { label: 'Unreal past, regret (third)', value: 'if + past perfect, then would have + participle' },
      { label: 'Always true (zero)', value: 'if + present simple, then present simple' },
      { label: 'Wish about the present', value: 'I wish + past simple' },
    ],
    examples: [
      {
        wrong: 'If I would have more time, I would read it.',
        right: 'If I had more time, I would read it.',
        note: 'Never "would" inside the if.',
      },
      {
        wrong: 'If you will miss the deadline, email the secretary.',
        right: 'If you miss the deadline, email the secretary.',
        note: 'First conditional: the if half takes the present.',
      },
      {
        wrong: "Unless we don't leave now, we'll miss the train.",
        right: "Unless we leave now, we'll miss the train.",
        note: '"Unless" already means "if not". Do not double the negative.',
      },
    ],
    traps: [
      'Italian uses the subjunctive ("se avessi tempo"), English the past simple: the form looks past but talks about now.',
      'In formal English the second conditional takes "if I were", not "if I was".',
      'The third conditional is always heavy on both sides: had + participle, then would have + participle.',
    ],
  },
  {
    id: 'lesson-gerund',
    title: 'Gerund or infinitive',
    summary: 'When a verb is followed by -ing and when it takes "to".',
    level: 'B2',
    syllabusUnits: [17, 18],
    errorTags: ['gerund-vs-infinitive'],
    rule: 'After a preposition it is always -ing; after another verb it depends on that verb, and the verbs are learnt in groups.',
    schema: [
      { label: 'After a preposition (at, of, in, about, for)', value: '-ing: good at explaining' },
      { label: 'enjoy, avoid, mind, suggest, finish, keep, consider', value: '-ing' },
      { label: 'decide, hope, agree, manage, refuse, promise, want', value: 'to + infinitive' },
      { label: 'As the subject of a sentence', value: '-ing: Studying is hard' },
      { label: 'Meaning changes', value: 'remember to do is not remember doing' },
    ],
    examples: [
      {
        wrong: 'I look forward to hear from you.',
        right: 'I look forward to hearing from you.',
        note: 'Here "to" is a preposition, not an infinitive, so it takes -ing.',
      },
      {
        wrong: "I don't mind to get up early.",
        right: "I don't mind getting up early.",
        note: '"Mind" takes the gerund.',
      },
      {
        wrong: 'He is good at explain complex ideas.',
        right: 'He is good at explaining complex ideas.',
        note: 'After the preposition "at": -ing.',
      },
    ],
    traps: [
      'Italian nearly always uses the infinitive, so the instinct is wrong for every verb that wants -ing.',
      '"Remember to send" means do not forget. "Remember sending" means you recall having sent it.',
      '"Look forward to" closes most emails, and it always takes -ing.',
    ],
  },
  {
    id: 'lesson-passive',
    title: 'The passive and reported speech',
    summary: 'How academic writing sounds, and how to report what was said.',
    level: 'B2',
    syllabusUnits: [13, 14],
    errorTags: ['passive', 'reported-speech'],
    rule: 'The passive is always "be" plus the past participle, and "be" carries the tense the active verb would have had.',
    schema: [
      { label: 'Present simple', value: 'is / are + participle: the lecture is held' },
      { label: 'Past simple', value: 'was / were + participle: the data were analysed' },
      { label: 'Present perfect', value: 'has / have been + participle' },
      { label: 'Future', value: 'will be + participle' },
      { label: 'Who did it, if it matters', value: 'by + agent: by two teams' },
      { label: 'Reported speech', value: 'every tense steps one notch back' },
    ],
    examples: [
      {
        wrong: 'The results will publish next Monday.',
        right: 'The results will be published next Monday.',
        note: 'Without "be" the sentence says the results will publish something.',
      },
      {
        wrong: 'He said he has finished the report the day before.',
        right: 'He said he had finished the report the day before.',
        note: 'In reported speech the present perfect becomes the past perfect.',
      },
      {
        wrong: 'She said me to check the figures.',
        right: 'She asked me to check the figures.',
        note: '"Say" never takes a person straight after it: ask or tell somebody to do something.',
      },
    ],
    traps: [
      'The Italian impersonal "si" ("si ritiene che") usually becomes a passive: "it is believed that".',
      'In academic writing the passive is the norm, not a style mistake.',
      'Reported speech also shifts time and place: yesterday becomes the day before, here becomes there.',
    ],
  },
  {
    id: 'lesson-charts',
    title: 'Describing charts and data',
    summary: 'The ESP vocabulary: trends, percentages, comparisons.',
    level: 'B2',
    syllabusUnits: [2, 7, 13],
    errorTags: ['preposition', 'uncountable', 'word-formation'],
    rule: 'Describing a chart takes three things: the verb of movement, the adverb of intensity, and the right preposition.',
    schema: [
      { label: 'Goes up', value: 'rise, increase, climb, soar, rocket' },
      { label: 'Goes down', value: 'fall, decrease, decline, drop, plummet' },
      { label: 'Stays flat', value: 'remain stable, level off, plateau' },
      { label: 'How much it changed', value: 'by: increased by 15%' },
      { label: 'The level it reached', value: 'to: rose to 40%' },
      { label: 'Intensity', value: 'slightly, gradually, steadily, sharply, dramatically' },
    ],
    examples: [
      {
        wrong: 'Sales increased of 15%.',
        right: 'Sales increased by 15%.',
        note: 'The size of the change takes "by".',
      },
      {
        wrong: 'The datas shows a clear trend.',
        right: 'The data show a clear trend.',
        note: '"Datas" does not exist, and in academic English "data" takes a plural verb.',
      },
      {
        wrong: 'The sample consisted in 240 students.',
        right: 'The sample consisted of 240 students.',
        note: '"Consist of". Italian "consistere in" leads straight to the mistake.',
      },
    ],
    traps: [
      '"Percentage points" and "per cent" are different: 6% to 4% is a fall of 2 points, but of 33 per cent.',
      '"Rise" goes up by itself, "raise" lifts something: the index rose, they raised the rate.',
      '"Information", "research", "advice" and "news" have no plural.',
    ],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

/** The lesson that explains a given mistake, used to turn errors into theory. */
export function lessonForTag(tag: ErrorTag): Lesson | undefined {
  return lessons.find((lesson) => lesson.errorTags.includes(tag));
}
