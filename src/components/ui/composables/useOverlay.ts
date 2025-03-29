import { watch, onMounted, onUnmounted, type Ref } from 'vue';

type TElement = HTMLElement | HTMLBodyElement;

const OVERFLOW_CLASS = 'fui-overflow-hidden';
const OBSERVER_CONFIG: MutationObserverInit = {
  attributes: true,
  attributeFilter: ['class']
};

export const useOverlay = (value: Ref<boolean>, el?: TElement) => {
  if (typeof window === 'undefined') {
    return;
  }
  const element = el || document.body;
  let observer: MutationObserver | undefined;

  watch(value, (newValue: boolean) => toggleOverflow(newValue));

  function init () {
    if (!observer) {
      observer = new MutationObserver(callback);
    }
    observer.observe(element, OBSERVER_CONFIG);
  }

  const callback: MutationCallback = (mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.attributeName !== 'class') {
        return;
      }
      const hasOverflowClass = (mutation.target as TElement).classList.contains(OVERFLOW_CLASS);
      !hasOverflowClass && value.value && toggleOverflow(true);
    }
  };

  function toggleOverflow (force: boolean) {
    element.classList.toggle('fui-overflow-hidden', force);
  }

  onMounted(init);
  onUnmounted(() => observer?.disconnect());

  return {
    observer,
    toggleOverflow
  };
};
