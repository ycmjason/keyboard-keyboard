export const A4 = 440;

const SEMITONE_FACTOR = 2 ** (1 / 12);
export const SEMITONE = (n: number) => SEMITONE_FACTOR ** n;

export const OCTAVE = (n: number) => SEMITONE(12 * n);
