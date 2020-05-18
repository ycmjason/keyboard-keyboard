import { Ref, watch, ref } from 'vue';

export const useKeyDown = (elementRef: Ref<GlobalEventHandlers | null>, key: string) => {
  const isKeyDown = ref(false);

  const onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key !== key) return;
    isKeyDown.value = true;
  };

  const onKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key !== key) return;
    isKeyDown.value = false;
  };

  watch(elementRef, (element, old) => {
    if (element) {
      element.addEventListener('keydown', onKeyDown);
      element.addEventListener('keyup', onKeyUp);
    } else {
      isKeyDown.value = false;
    }

    if (old) {
      old.removeEventListener('keydown', onKeyDown);
      old.removeEventListener('keyup', onKeyUp);
    }
  });

  return { isKeyDown };
};
