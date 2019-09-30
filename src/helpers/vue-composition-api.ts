import { Ref, computed } from '@vue/composition-api';

export const arrayOfRefsToRefOfArray = <T>(refs: Ref<T>[]): Ref<T[]> => {
  return computed(() => refs.map(({ value }) => value));
};
