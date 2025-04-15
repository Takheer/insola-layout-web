<script setup lang="ts">
import {ref} from "vue";

type TProps = {
  text: string
  size?: 'md' | 'sm'
  placement?: 'top' | 'left' | 'right' | 'bottom'
};
const props = withDefaults(defineProps<TProps>(), {
  size: 'md'
});

const popupShowed = ref(false)

const placementClass = {
  'right': 'left-20 top-2',
  'bottom': 'top-8',
  'top': '',
  'left': ''
}
</script>

<template>
  <div class="relative">
    <div
      @mouseover="popupShowed=true"
      @mouseleave="popupShowed=false">
      <slot/>
    </div>
    <div v-show="popupShowed" class="absolute z-50" :class="placementClass[placement ?? 'left']">
      <div
        class="flex rounded bg-gray-700 py-2 px-6 text-white"
        :class="{
        'text-xs font-light': size === 'sm',
        'text-nowrap': text.length < 40,
        'min-w-[240px]': text.length >= 40
      }"
      >{{ text }}</div>
    </div>
  </div>
</template>

<style lang="scss">

</style>
