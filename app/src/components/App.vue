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

      <div class="config">
        <div>Transpose (semitone)</div>
        <div>
          <input class="config-display-input" type="text" readonly :value="transpose" />
        </div>
        <div>
          <input type="range" :min="-12" :max="12" v-model="transpose" />
        </div>
      </div>
    </section>

    <Footer class="footer"></Footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from 'vue';
import { A4, SEMITONE, OCTAVE } from '/@/audio/frequencies';
import { useKeyDown } from '/@/compositions/useKeyDown';
import PianoKeyboard from '/@/components/PianoKeyboard.vue';
import Footer from '/@/components/Footer.vue';
import { useMusicNote } from '/@/compositions/useMusicNote';
import { zip } from 'lodash-es';

const F2 = A4 * SEMITONE(-4) * OCTAVE(-1);

const usePiano = (
  startingFrequency: Ref<number>,
  keys: string[],
  triggerZone: Ref<GlobalEventHandlers | null>,
): Ref<boolean[]> => {
  const frequencies = keys.map((_, i) => computed(() => startingFrequency.value * SEMITONE(i)));
  const isPlayings = keys.map((key) => useKeyDown(triggerZone, key).isKeyDown);
  for (const [frequency, isPlaying] of zip(frequencies, isPlayings)) {
    if (!frequency || !isPlaying) continue;
    useMusicNote(frequency, isPlaying);
  }

  return computed(() => isPlayings.map(({ value }) => value));
};

export default defineComponent({
  components: { PianoKeyboard, Footer },
  setup() {
    const keyboardsDivRef = ref<HTMLElement | null>(null);

    const transpose = ref(0);

    const higherTriggerKeys = `q2w3e4rt6y7ui9o0p-[]`.split('');
    const higherIsPlayings = usePiano(
      computed(() => F2 * SEMITONE(transpose.value)),
      higherTriggerKeys,
      keyboardsDivRef,
    );

    const lowerTriggerKeys = `\`azsxdcvgbhnmk,l.;/`.split('');
    const lowerIsPlayings = usePiano(
      computed(() => F2 * OCTAVE(-1) * SEMITONE(transpose.value)),
      lowerTriggerKeys,
      keyboardsDivRef,
    );

    return {
      higherTriggerKeys,
      higherIsPlayings,
      lowerTriggerKeys,
      lowerIsPlayings,
      keyboardsDivRef,
      transpose,
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

<style scoped>
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

.config {
  width: 100%;
  display: grid;
  grid-template-columns: 5fr 1fr 11fr;
  align-items: center;
  grid-gap: 1rem;
}

.config .config-display-input {
  width: 3rem;
  text-align: center;
}

.config input[type='range'] {
  width: 100%;
}
</style>
