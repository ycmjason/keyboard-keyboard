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
import { createComponent, ref, Ref } from '@vue/composition-api';
import { A4, SEMITONE, OCTAVE } from '/audio/frequencies';
import { useKeyDown } from '/compositions/useKeyDown';
import PianoKeyboard from '/components/PianoKeyboard.vue';
import Footer from '/components/Footer.vue';
import { useMusicBox } from '/compositions/useMusicBox';
import { arrayOfRefsToRefOfArray } from '/helpers/vue-composition-api';

const frequencyForF = A4 * SEMITONE(-4) * OCTAVE(-1);

const useMusicalKeyboard = (element: Ref<GlobalEventHandlers | null>, keys: string[], startFrequency: number) => {
  const isPlayings = arrayOfRefsToRefOfArray(keys.map(key => useKeyDown(element, key).isKeyDown));

  useMusicBox(startFrequency, isPlayings);

  return { isPlayings };
};

export default createComponent({
  components: { PianoKeyboard, Footer },
  setup() {
    const keyboardsDivRef = ref<HTMLElement>(null);

    const higherTriggerKeys = `q2w3e4rt6y7ui9o0p-[]`.split('');
    const { isPlayings: higherIsPlayings } = useMusicalKeyboard(keyboardsDivRef, higherTriggerKeys, frequencyForF);

    const lowerTriggerKeys = `\`azsxdcvgbhnmk,l.;/`.split('');
    const { isPlayings: lowerIsPlayings } = useMusicalKeyboard(
      keyboardsDivRef,
      lowerTriggerKeys,
      frequencyForF * OCTAVE(-1),
    );

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
