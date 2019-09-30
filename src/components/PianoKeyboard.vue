<template>
  <div class="piano-keyboard">
    <div v-for="(key, i) of keys" :key="i" class="key" :class="key.class">
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
    isActives: {
      type: Array as () => boolean[],
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
      return Array.from({ length: numberOfSemitones.value }, (_, i) => {
        const name = stepNSemitoneFrom(props.startKey, i);
        return {
          name,
          label: props.labels[i] || '',
          class: {
            'key--black': isBlackKey(name),
            'key--white': isWhiteKey(name),
            'key--active': props.isActives[i],
          },
        };
      });
    });

    return { keys, isWhiteKey };
  },
});
</script>

<style scoped>
.piano-keyboard {
  display: flex;
  justify-content: center;
  overflow: hidden;
  --key--white-background: #ffffff;
  --key--white-width: 2rem;
  --key--white-height: 5.5rem;

  --key--black-background: #3d3d3d;
  --key--black-width: 1.5rem;
  --key--black-height: 3rem;

  --key--padding: 0.3rem;
}

.key {
  border: 1px black solid;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: var(--key--padding);
}

.key--white {
  background: var(--key--white-background);
  color: black;
  width: var(--key--white-width);
  height: var(--key--white-height);
  z-index: 1;
}

.key--white.key--active {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.7) inset;
}

.key--black + .key--white {
  margin-left: calc(-1 * var(--key--black-width) / 2);
}

.key--black {
  background: var(--key--black-background);
  color: white;
  width: var(--key--black-width);
  height: var(--key--black-height);
  z-index: 2;
  margin-left: calc(-1 * var(--key--black-width) / 2);
  box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.8);
}
.key--black.key--active {
  box-shadow: none;
}
</style>
