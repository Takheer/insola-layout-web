<script setup lang="ts">

import {PhGear, PhSidebarSimple} from "@phosphor-icons/vue";

const tabClass = "flex flex-row w-fit gap-2 px-2 py-1 rounded-lg cursor-pointer";

type TProps = {
  selectedTab: number | null
};
const props = withDefaults(defineProps<TProps>(), {
  selectedTab: null
});

type TEmits = {
  (e: 'update', val: any): void
};
const emits = defineEmits<TEmits>();

function setSelectedTab(i: number) {
  emits('update', props.selectedTab === i ? null : i);
}
</script>

<template>
<div class="flex flex-col gap-2 py-2 px-4 bg-gray-200 text-sm min-w-40">
  <div
    class="flex flex-row gap-1 bg-gray-200 pt-1 rounded-t-lg"
  >
    <div
      :class="[tabClass, selectedTab === 0 ? 'bg-white' : '']"
      @click="setSelectedTab(0)"
    >
      <PhGear size="20" />
      Настройки
    </div>
    <div
      :class="[tabClass, selectedTab === 1 ? 'bg-white' : '']"
      @click="setSelectedTab(1)"
    >
      <PhSidebarSimple size="20" />
      Пазы
    </div>
  </div>
</div>
</template>

<style lang="scss">

</style>