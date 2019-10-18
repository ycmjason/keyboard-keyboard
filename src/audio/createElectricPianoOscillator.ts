import organWave from '/audio/waves/piano.wave.json';

const organWaveReal = new Float32Array(organWave.real);
const organWaveImag = new Float32Array(organWave.imag);

const audioContext = new AudioContext();

const setValueCurveAtTimeForOneMinute = (
  param: AudioParam,
  values: Float32Array,
  startTime: number,
  periodS: number,
) => {
  const SECONDS_IN_MINUTE = 60;
  const repeatTimes = Math.ceil(SECONDS_IN_MINUTE / periodS);
  const valuesLengthForAMinute = repeatTimes * values.length;
  const valuesForAMinute = Float32Array.from({ length: valuesLengthForAMinute }, (_, i) => {
    return values[i % values.length];
  });
  param.setValueCurveAtTime(valuesForAMinute, startTime, SECONDS_IN_MINUTE);
};

const createTremoloNode = (min = 0.09, max = 0.09125, periodMs = 350) => {
  const gainNode = audioContext.createGain();
  setValueCurveAtTimeForOneMinute(
    gainNode.gain,
    new Float32Array([min, max, min]),
    audioContext.currentTime,
    periodMs / 1000,
  );
  return gainNode;
};

export const createElectricPianoOscillator = (frequency: number) => {
  const tremoloNode = createTremoloNode();
  tremoloNode.connect(audioContext.destination);

  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = frequency;
  oscillator.setPeriodicWave(audioContext.createPeriodicWave(organWaveReal, organWaveImag));
  oscillator.connect(tremoloNode);

  return oscillator;
};
