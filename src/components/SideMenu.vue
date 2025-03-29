<script setup lang="ts">
import IDTextInput from "@/components/ui/IDTextInput.vue";
import IDSwitch from "@/components/ui/IDSwitch.vue";
import {ELayoutMethod, useCuttingStore} from "@/stores/useCuttingStore";

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')

type TProps = {
  selectedTab: number | null
};
const props = withDefaults(defineProps<TProps>(), {
  selectedTab: null
});

const menuClass = "flex flex-col gap-4 p-4 pb-2 bg-white shadow-lg rounded-lg text-sm"

const store = useCuttingStore();

const alignmentOptions = [
  {id: ELayoutMethod.HORIZONTAL, value: 'Ширине', selected: true},
  {id: ELayoutMethod.VERTICAL, value: 'Длине'}
];
</script>

<template>
  <div
    class="flex flex-col gap-4 bg-gray-200 p-2 w-80 h-[96vh] overflow-hidden transition-all"
    v-if="selectedTab !== null"
  >
    <div class="overflow-auto">
      <div :class="menuClass" v-if="selectedTab === 0">
        <div class="flex flex-col gap-2">
          Выровнять детали по
          <IDSwitch
            :options="alignmentOptions"
            @select="store.layoutMethod = $event"
          />
        </div>
      </div>
      <div :class="menuClass" v-if="selectedTab === 1">
        <div class="flex flex-col gap-1">
          Ширина, мм
          <IDTextInput v-model="store.slotSettings.width" />
        </div>
        <div class="flex flex-col gap-1">
          Глубина, мм
          <IDTextInput v-model="store.slotSettings.depth" />
        </div>
        <div class="flex flex-col gap-1">
          Отступ от края, мм
          <IDTextInput v-model="store.slotSettings.offset" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>
