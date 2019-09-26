<template>
  <div id="app"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import { playNote, stopNote } from '/audio';
import { A4, SEMITONE, OCTAVE } from '/audio/frequencies';
import zip from 'lodash.zip';

const frequencyForF = A4 * SEMITONE(-4) * OCTAVE(-1);

export default Vue.extend({
  mounted() {
    const higherKeys = `q2w3e4rt6y7ui9o0p-[]`.split('');
    const higherFrequencies = Array.from({ length: 20 }, (_, i) => frequencyForF * SEMITONE(i));

    const lowerKeys = `\`azsxdcvgbhnmk,l.;/`.split('');
    const lowerFrequencies = higherFrequencies.slice(0, lowerKeys.length).map(f => f * OCTAVE(-1));

    const frequencies = [...lowerFrequencies, ...higherFrequencies];
    const keys = [...lowerKeys, ...higherKeys];

    for (const [key, frequency] of zip(keys, frequencies)) {
      if (!key || !frequency) continue;

      window.addEventListener('keydown', e => {
        if (e.key === key) {
          playNote(frequency);
        }
      });

      window.addEventListener('keyup', e => {
        if (e.key === key) {
          stopNote(frequency);
        }
      });
    }
  },
});
</script>
