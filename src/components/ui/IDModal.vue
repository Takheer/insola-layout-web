<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {PhX} from "@phosphor-icons/vue";
import {useOverlay} from "@/components/ui/composables/useOverlay"

const props = withDefaults(defineProps<TProps>(), { modelValue: undefined });

type TProps = {
  /**
   * v-model, управляет состоянием модального окна
   */
  modelValue?: boolean;
  /**
   * Запрещает закрытие монадального океа по клику на оверлей
   */
  persistent?: boolean;
  /**
   * Позволяет открыть модальное окно на весь экран
   */
  fullscreen?: boolean;
};

type TEmits = {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'content:down', value: TouchEvent): void;
  (e: 'bg:down', value: TouchEvent): void;
};

const emits = defineEmits<TEmits>();

const isEnable = ref(false);
useOverlay(isEnable)

const overlayClass = computed(() => {
  const val = ['overflow-auto'];
  props.fullscreen ? val.push('w-full h-full bg-white') : val.push('max-w-[calc(100%-48px)]', 'max-h-[calc(100%-48px)]');
  return val.join(' ');
});

watch(() => props.modelValue, (value) => {
  isEnable.value !== value && (isEnable.value = value ?? false);
});

watch(isEnable, (value) => {
  props.modelValue !== value && emits('update:modelValue', value);
});

function open () {
  isEnable.value = true;
  emits('update:modelValue', true);
}

function close () {
  isEnable.value = false;
  emits('update:modelValue', false);
}

function toggle () {
  isEnable.value = !isEnable.value;
  emits('update:modelValue', isEnable.value);
}

function onClickOutside () {
  !props.persistent && close();
}

function onTouchContentDown (e: TouchEvent) {
  emits('content:down', e);
}

function onTouchBgDown (e: TouchEvent) {
  emits('bg:down', e);
}

defineExpose({
  open,
  close,
  toggle
});
</script>

<script lang="ts">
export default {
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
};
</script>

<template>
  <teleport to="body">
    <Transition
      mode="out-in"
      name="fade"
    >
      <div
        v-if="modelValue"
        class="fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center z-[1000]"
        v-bind="$attrs"
      >
        <div
          class="overlay__bg absolute bg-[#2D2C32] opacity-70 top-0 bottom-0 left-0 right-0"
          @click="onClickOutside"
          @touchstart.passive="onTouchBgDown"
        />

        <div
          class="overlay__content relative w-fit h-fit"
          :class="overlayClass"
          @touchstart.passive="onTouchContentDown"
        >
          <PhX
            :size="32"
            @click="close"
            class="absolute top-8 right-8 cursor-pointer transition-all hover:color-orange-600"
          />
          <!-- @slot slot:default - Слот для контента. Передается функция закрытия `close`-->
          <slot
            name="default"
            :close="close"
          />
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style lang="scss">
.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.2s ease-in-out;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
