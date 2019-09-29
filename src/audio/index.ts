import organWave from '/audio/waves/piano.wave.json';

const audioContext = new AudioContext();

const stopFunctions: Record<string, () => void> = {};

const isPlaying = (frequency: number) => !!stopFunctions[frequency];

const setValueCurveForOneMinute = (param: AudioParam, values: Float32Array, startTime: number, durationS: number) => {
  const SECONDS_IN_MINUTE = 60;
  const repeatTimes = Math.ceil(SECONDS_IN_MINUTE / durationS);
  const valuesLengthForAMinute = repeatTimes * values.length;
  const valuesForAMinute = Float32Array.from({ length: valuesLengthForAMinute }, (_, i) => {
    return values[i % values.length];
  });
  param.setValueCurveAtTime(valuesForAMinute, startTime, SECONDS_IN_MINUTE);
};

const createTremoloNode = (min = 0.09, max = 0.09125, durationMs = 350) => {
  const gainNode = audioContext.createGain();
  setValueCurveForOneMinute(
    gainNode.gain,
    new Float32Array([min, max, min]),
    audioContext.currentTime,
    durationMs / 1000,
  );
  return gainNode;
};

const createPianoOscillator = (frequency: number) => {
  const tremoloNode = createTremoloNode();
  tremoloNode.connect(audioContext.destination);

  const oscillator = audioContext.createOscillator();
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.setPeriodicWave(audioContext.createPeriodicWave(organWave.real, organWave.imag));
  oscillator.connect(tremoloNode);

  return oscillator;
};

export const playNote = (frequency: number) => {
  if (isPlaying(frequency)) return;
  const oscillator = createPianoOscillator(frequency);
  oscillator.start();

  stopFunctions[frequency] = () => oscillator.stop();
};

export const stopNote = (frequency: number) => {
  const stop = stopFunctions[frequency];
  delete stopFunctions[frequency];

  if (stop) stop();
};
