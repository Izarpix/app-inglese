/**
 * London palette. Every colour is taken from something you would actually see
 * in the city, so the app has a place instead of just a set of hex codes.
 */
export const London = {
  /** Union Jack / Royal Navy blue — headers and primary surfaces. */
  royal: '#012169',
  /** Union Jack red — the accent that carries the brand. */
  flagRed: '#C8102E',
  /** K6 telephone box and pillar box red — warmer, used for the graphics. */
  phoneBox: '#D8232A',
  /** London Underground roundel blue. */
  tube: '#0019A8',
  /** Routemaster bus red. */
  bus: '#DA291C',
  /** Royal Parks green — the "correct answer" colour. */
  park: '#1B7F5C',
  /** Crown gold — highlights, streaks, rewards. */
  gold: '#F2B705',
  /** Portland stone — the page background. */
  stone: '#F6F1E7',
  /** Slightly deeper stone for cards sitting on stone. */
  stoneDeep: '#EDE5D6',
  /** Black cab — primary text. */
  cab: '#1A1A1A',
  /** Thames fog — secondary text. */
  fog: '#6B7280',
  /** Hairlines and dividers. */
  line: '#DCD3C2',
  white: '#FFFFFF',
} as const;

/** Colour pairs used for the soft gradients behind headers and deck cards. */
export const Gradients = {
  royal: ['#012169', '#1B3FA0'] as [string, string],
  sunset: ['#C8102E', '#F2B705'] as [string, string],
  tube: ['#0019A8', '#00A3E0'] as [string, string],
  park: ['#1B7F5C', '#7FB800'] as [string, string],
  fog: ['#4B5A6B', '#8FA3B8'] as [string, string],
};

export const Radius = { sm: 10, md: 16, lg: 22, xl: 28 } as const;
