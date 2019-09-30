<template>
  <div id="app">
    <h1>Keyboard-Keybaord</h1>

    <PianoKeyboard
      class="highOctaveKeyboard"
      startKey="F"
      :numberOfWhiteKeys="13"
      :labels="'q2w3e4rt6y7ui9o0p-[]'.split('')"
    ></PianoKeyboard>
    <PianoKeyboard
      class="lowOctaveKeyboard"
      startKey="F"
      :numberOfWhiteKeys="12"
      :labels="'`azsxdcvgbhnmk,l.;/'.split('')"
    ></PianoKeyboard>

    <Footer class="footer"></Footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import zip from 'lodash.zip';

import { playNote, stopNote } from '/audio';
import { A4, SEMITONE, OCTAVE } from '/audio/frequencies';
import PianoKeyboard from '/components/PianoKeyboard.vue';
import Footer from '/components/Footer.vue';

const frequencyForF = A4 * SEMITONE(-4) * OCTAVE(-1);

export default Vue.extend({
  components: { PianoKeyboard, Footer },
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

<style>
@import 'normalize.css';

html {
  box-sizing: border-box;
  font-family: 'Indie Flower', cursive;
  font-size: 18px;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}
</style>


<style lang="stylus" scoped>
h1 {
  text-align: center;
}

.highOctaveKeyboard {
  margin-bottom: 1rem;
}

.footer {
  margin-top: 3rem;
}
</style>
