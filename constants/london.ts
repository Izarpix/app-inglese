/**
 * London palette. Every colour is taken from something you would actually see
 * in the city, so the app has a place instead of just a set of hex codes.
 */
export const London = {
  /** Union Jack / Royal Navy blue — headers and primary surfaces. */
  royal: '#102A43',
  /** Union Jack red — the accent that carries the brand. */
  flagRed: '#D64545',
  /** K6 telephone box and pillar box red — warmer, used for the graphics. */
  phoneBox: '#C9363E',
  /** London Underground roundel blue. */
  tube: '#2457C5',
  /** Routemaster bus red. */
  bus: '#D64545',
  /** Royal Parks green — the "correct answer" colour. */
  park: '#24856A',
  /** Crown gold — highlights, streaks, rewards. */
  gold: '#F2C14E',
  /** Portland stone — the page background. */
  stone: '#F6F3EC',
  /** Slightly deeper stone for cards sitting on stone. */
  stoneDeep: '#ECE6DA',
  /** Black cab — primary text. */
  cab: '#17212B',
  /** Thames fog — secondary text. */
  fog: '#687481',
  /** Hairlines and dividers. */
  line: '#DDD7CB',
  /** Pale blue used for selected and informational surfaces. */
  sky: '#EAF0FA',
  /** Pale red used for review and error surfaces. */
  blush: '#FBEDEE',
  white: '#FFFFFF',
} as const;

/** Colour pairs used for the soft gradients behind headers and deck cards. */
export const Gradients = {
  royal: ['#102A43', '#244B6D'] as [string, string],
  sunset: ['#D64545', '#A82637'] as [string, string],
  tube: ['#2457C5', '#3978D4'] as [string, string],
  park: ['#24856A', '#3E9D78'] as [string, string],
  fog: ['#536778', '#7E91A0'] as [string, string],
};

export const Radius = { sm: 10, md: 14, lg: 20, xl: 28 } as const;

export const Shadows = {
  card: {
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  raised: {
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 7,
  },
} as const;
