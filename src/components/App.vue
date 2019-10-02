<template>
  <div id="app">
    <h1>Keyboard-Keybaord</h1>

    <section class="container">
      <div class="keyboards" tabindex="0" ref="keyboardsDivRef">
        <PianoKeyboard
          class="highOctaveKeyboard"
          startKey="F"
          :labels="higherTriggerKeys"
          :numberOfKeys="higherTriggerKeys.length"
          :isActives="higherIsPlayings"
        ></PianoKeyboard>
        <PianoKeyboard
          class="lowOctaveKeyboard"
          startKey="F"
          :labels="lowerTriggerKeys"
          :numberOfKeys="lowerTriggerKeys.length"
          :isActives="lowerIsPlayings"
        ></PianoKeyboard>
      </div>
    </section>

    <Footer class="footer"></Footer>
  </div>
</template>

<script lang="ts">
import { createComponent, ref, computed, Ref } from '@vue/composition-api';
import { A4, SEMITONE, OCTAVE } from '/audio/frequencies';
import { useKeyDown } from '/compositions/useKeyDown';
import PianoKeyboard from '/components/PianoKeyboard.vue';
import Footer from '/components/Footer.vue';
import { useMusicNote } from '/compositions/useMusicNote';
import zip from 'lodash.zip';

const F2 = A4 * SEMITONE(-4) * OCTAVE(-1);

const usePiano = (
  startingFrequency: number,
  keys: string[],
  triggerZone: Ref<GlobalEventHandlers | null>,
): Ref<boolean[]> => {
  const frequencies = keys.map((_, i) => startingFrequency * SEMITONE(i));
  const isPlayings = keys.map(key => useKeyDown(triggerZone, key).isKeyDown);
  for (const [frequency, isPlaying] of zip(frequencies, isPlayings)) {
    if (!frequency || !isPlaying) continue;
    useMusicNote(frequency, isPlaying);
  }

  return computed(() => isPlayings.map(({ value }) => value));
};

export default createComponent({
  components: { PianoKeyboard, Footer },
  setup() {
    const keyboardsDivRef = ref<HTMLElement>(null);

    const higherTriggerKeys = `q2w3e4rt6y7ui9o0p-[]`.split('');
    const higherIsPlayings = usePiano(F2, higherTriggerKeys, keyboardsDivRef);

    const lowerTriggerKeys = `\`azsxdcvgbhnmk,l.;/`.split('');
    const lowerIsPlayings = usePiano(F2 * OCTAVE(-1), lowerTriggerKeys, keyboardsDivRef);

    return {
      higherTriggerKeys,
      higherIsPlayings,
      lowerTriggerKeys,
      lowerIsPlayings,
      keyboardsDivRef,
    };
  },
});
</script>

<style>
@import 'normalize.css';

html {
  box-sizing: border-box;
  font-family: 'Indie Flower', cursive;
  font-size: 28px;
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

.container {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.keyboards {
  padding: 1rem;
}

.highOctaveKeyboard {
  margin-bottom: 1rem;
}

.footer {
  margin-top: 3rem;
}
</style>
