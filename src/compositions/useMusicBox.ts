import { watch, Ref } from '@vue/composition-api';
import { playNote, stopNote } from '/audio';
import { SEMITONE } from '/audio/frequencies';
import zip from 'lodash.zip';

export const useMusicBox = (lowestFrequency: number, isPlayings: Ref<boolean[]>) => {
  watch(isPlayings, (isPlayings, oldIsPlayings) => {
    const frequencies = isPlayings.map((_, i) => lowestFrequency * SEMITONE(i));

    for (const [frequency, isPlaying, oldIsPlaying] of zip(frequencies, isPlayings, oldIsPlayings)) {
      if (!frequency) continue;
      if (typeof isPlaying === 'undefined' || typeof oldIsPlaying === 'undefined') continue;

      if (isPlaying !== oldIsPlaying) {
        if (isPlaying) playNote(frequency);
        else stopNote(frequency);
      }
    }
  });
};
