import { watch, Ref, computed } from '@vue/composition-api';
import { playNote, stopNote } from '/audio';
import { SEMITONE } from '/audio/frequencies';
import zip from 'lodash.zip';

export const useMusicBox = (lowestFrequency: number, isPlayings: Ref<boolean[]>) => {
  const frequencies = computed(() => isPlayings.value.map((_, i) => lowestFrequency * SEMITONE(i)));

  watch(isPlayings, (isPlayings, oldIsPlayings) => {
    for (const [frequency, isPlaying, oldIsPlaying] of zip(frequencies.value, isPlayings, oldIsPlayings)) {
      if (!frequency) continue;
      if (typeof isPlaying === 'undefined' || typeof oldIsPlaying === 'undefined') continue;

      if (isPlaying !== oldIsPlaying) {
        if (isPlaying) playNote(frequency);
        else stopNote(frequency);
      }
    }
  });
};
