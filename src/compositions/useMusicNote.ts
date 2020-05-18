import { watch, Ref, watchEffect } from 'vue';
import { playNote, stopNote } from '@/audio';

export const useMusicNote = (frequency: Ref<number>, isPlaying: Ref<boolean>) => {
  watchEffect(() => {
    if (isPlaying.value) playNote(frequency.value);
    else stopNote(frequency.value);
  });

  watch(frequency, (_frequency, oldFrequency) => {
    stopNote(oldFrequency);
  });
};
