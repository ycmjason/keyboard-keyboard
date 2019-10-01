import { createElectricPianoOscillator } from '/audio/createElectricPianoOscillator';

const frequencyOscillatorMap: Map<number, OscillatorNode> = new Map();

export const playNote = (frequency: number) => {
  stopNote(frequency);

  const oscillator = createElectricPianoOscillator(frequency);
  oscillator.start();
  frequencyOscillatorMap.set(frequency, oscillator);
};

export const stopNote = (frequency: number) => {
  const oscillator = frequencyOscillatorMap.get(frequency);
  frequencyOscillatorMap.delete(frequency);
  if (!oscillator) return;

  oscillator.stop();
};
