import { watch, Ref, computed } from '@vue/composition-api';
import { playNote, stopNote } from '/audio';

export const useMusicNote = (frequency: number, isPlaying: Ref<boolean>) => {
  watch(isPlaying, isPlaying => {
    if (isPlaying) playNote(frequency);
    else stopNote(frequency);
  });
};
