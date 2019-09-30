<template>
  <div id="app">
    <h1>Keyboard-Keybaord</h1>

    <section class="container">
      <div class="keyboards" tabindex="0" ref="keyboardsDivRef">
        <PianoKeyboard
          class="highOctaveKeyboard"
          startKey="F"
          :numberOfWhiteKeys="13"
          :labels="higherKeys"
          :isActives="higherIsPlayings"
        ></PianoKeyboard>
        <PianoKeyboard
          class="lowOctaveKeyboard"
          startKey="F"
          :numberOfWhiteKeys="12"
          :labels="lowerKeys"
          :isActives="lowerIsPlayings"
        ></PianoKeyboard>
      </div>
    </section>

    <Footer class="footer"></Footer>
  </div>
</template>

<script lang="ts">
import { createComponent, computed, ref, Ref } from '@vue/composition-api';
import { A4, SEMITONE, OCTAVE } from '/audio/frequencies';
import { useKeyDown } from '/compositions/useKeyDown';
import PianoKeyboard from '/components/PianoKeyboard.vue';
import Footer from '/components/Footer.vue';
import { useMusicBox } from '/compositions/useMusicBox';
import { arrayOfRefsToRefOfArray } from '/helpers/vue-composition-api';

const frequencyForF = A4 * SEMITONE(-4) * OCTAVE(-1);

const useMusicalKeyboard = (
  keys: string[],
  startFrequency: number,
  opts: { element?: Ref<GlobalEventHandlers | null> } = {},
) => {
  const { element = computed(() => window) } = opts;

  const isKeyDowns = keys.map(key => useKeyDown(element, key).isKeyDown);

  const isPlayings = arrayOfRefsToRefOfArray(isKeyDowns);
  useMusicBox(startFrequency, isPlayings);

  return { isPlayings };
};

export default createComponent({
  components: { PianoKeyboard, Footer },
  setup() {
    const keyboardsDivRef = ref<HTMLElement>(null);

    const higherKeys = `q2w3e4rt6y7ui9o0p-[]`.split('');
    const { isPlayings: higherIsPlayings } = useMusicalKeyboard(higherKeys, frequencyForF, {
      element: keyboardsDivRef,
    });

    const lowerKeys = `\`azsxdcvgbhnmk,l.;/`.split('');
    const { isPlayings: lowerIsPlayings } = useMusicalKeyboard(lowerKeys, frequencyForF * OCTAVE(-1), {
      element: keyboardsDivRef,
    });

    return {
      higherKeys,
      higherIsPlayings,
      lowerKeys,
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
