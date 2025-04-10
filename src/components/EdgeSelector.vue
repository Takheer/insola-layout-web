<script setup lang="ts">
import IDPopup from "@/components/ui/IDPopup.vue";
import {edgeValues} from "@/services/consts";
import {computed, ref} from "vue";

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import {useCuttingStore} from "@/stores/useCuttingStore.ts";
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')

const model = defineModel()
const store = useCuttingStore()

const text = computed(() => model.value === edgeValues.THICK ? store.edgeSettings.edgeThickWidth : model.value === edgeValues.THIN ? store.edgeSettings.edgeThinWidth : 0)
const hovered = ref(false)


function update() {
  switch (model.value) {
    case edgeValues.THIN:
      model.value = edgeValues.THICK;
      break;
    case edgeValues.THICK:
      model.value = edgeValues.NO;
      break;
    case edgeValues.NO:
    default:
      model.value = edgeValues.THIN;
      break;
  }
}
</script>

<template>
  <IDPopup
    :text="text ? `Кромка ${text}мм` : 'Без кромки'"
    size="sm"
  >
    <div
      class="flex flex-col gap-0.5 cursor-pointer transition-all"
      @mouseenter="hovered=true"
      @mouseleave="hovered=false"
      @click="update"
    >
      <div
        class="border-2 border-gray-300 transition-all"
        :class="model === edgeValues.THICK ? 'border-gray-900' : hovered ? 'border-gray-400' : ''"
      />
      <div
        class="border-2 border-gray-300 border-dashed transition-all"
        :class="model === edgeValues.THIN ? 'border-gray-900' : hovered ? 'border-gray-400' : ''"
      />
      <p
        class=" font-light select-none"
        :class="isMobile ? 'text-[11px]' : 'text-xs'"
      >
        {{ text }}мм
      </p>
    </div>
  </IDPopup>
</template>

<style lang="scss">

</style>
