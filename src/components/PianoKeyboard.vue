<template>
  <div class="piano-keyboard">
    <div v-for="(key, i) of keys" :key="i" class="key" :class="isWhiteKey(key.name) ? 'key--white' : 'key--black'">
      {{ key.label }}
    </div>
  </div>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api';
import { mod } from '/helpers/math';

const NUMBER_OF_WHITE_IN_OCTAVE = 8;
const KEY_NAMES = ['A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab'] as const;
type KeyName = typeof KEY_NAMES[number];

const isWhiteKey = (keyName: KeyName) => !isBlackKey(keyName);
const isBlackKey = (keyName: KeyName) => /[#b]/.test(keyName);

const stepNSemitoneFrom = (keyName: KeyName, n: number): KeyName => {
  const indexOfFromKeyName = KEY_NAMES.indexOf(keyName);
  return KEY_NAMES[(indexOfFromKeyName + n) % KEY_NAMES.length];
};

const stepNWhiteKeys = (keyName: KeyName, n: number): KeyName => {
  if (isBlackKey(keyName)) throw Error('starting with a black key?');

  n = mod(n, NUMBER_OF_WHITE_IN_OCTAVE);
  if (n === 0) return keyName;

  const nextWhite = stepOneWhiteKey(keyName);
  return stepNWhiteKeys(nextWhite, n - 1);
};

const stepOneWhiteKey = (keyName: KeyName): KeyName => {
  if (isBlackKey(keyName)) throw Error('starting with a black key?');
  const nextSemitone = stepNSemitoneFrom(keyName, 1);
  if (isWhiteKey(nextSemitone)) return nextSemitone;
  return stepNSemitoneFrom(nextSemitone, 1);
};

const getSemitoneDistance = (k1: KeyName, k2: KeyName): number => {
  return mod(KEY_NAMES.indexOf(k2) - KEY_NAMES.indexOf(k1), KEY_NAMES.length);
};

export default createComponent({
  props: {
    startKey: {
      type: String as () => 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G',
      required: true,
    },
    numberOfWhiteKeys: {
      type: Number,
      required: true,
    },
    labels: {
      type: Array as () => string[],
      default: () => [],
    },
  },
  setup(props) {
    const endKey = computed(() => stepNWhiteKeys(props.startKey, props.numberOfWhiteKeys - 1));

    const numberOfSemitones = computed(() => {
      const semitoneDistance = getSemitoneDistance(props.startKey, endKey.value);
      const numberOfExtraOctave = Math.floor(props.numberOfWhiteKeys / NUMBER_OF_WHITE_IN_OCTAVE);
      return semitoneDistance + numberOfExtraOctave * KEY_NAMES.length + 1;
    });

    const keys = computed(() => {
      return Array.from({ length: numberOfSemitones.value }, (_, i) => ({
        name: stepNSemitoneFrom(props.startKey, i),
        label: props.labels[i] || '',
      }));
    });

    return { keys, isWhiteKey };
  },
});
</script>

<style scoped>
.piano-keyboard {
  display: flex;
  justify-content: center;
  font-size: 2rem;
  --key--white-width: 4rem;
  --key--white-height: 11rem;
  --key--black-width: 3rem;
  --key--black-height: 6rem;
}

.key {
  border: 1px black solid;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 1rem;
}

.key--white {
  background: white;
  color: black;
  width: var(--key--white-width);
  height: var(--key--white-height);
  z-index: 1;
}

.key--black + .key--white {
  margin-left: calc(-1 * var(--key--black-width) / 2);
}

.key--black {
  background: black;
  color: white;
  width: var(--key--black-width);
  height: var(--key--black-height);
  z-index: 2;
  margin-left: calc(-1 * var(--key--black-width) / 2);
}
</style>
