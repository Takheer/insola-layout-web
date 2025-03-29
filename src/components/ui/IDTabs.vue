<script setup lang="ts">
type TProps = {
  tabs: { id: string, label: string, selected?: boolean | unknown }[]
};

type TEmits = {
  (e: 'change', val: string): void
};

const props = defineProps<TProps>();
const emits = defineEmits<TEmits>();
</script>

<template>
  <div class="flex flex-row">
    <div
      v-for="tab of tabs"
      :key="tab.id"
      class="px-4 py-2 cursor-pointer select-none hover:bg-gray-200"
      :class="tab.selected ? 'border border-b-0' : 'border-b'"
      @click="emits('change', tab.id)"
    >
      {{ tab.label }}
    </div>
  </div>
</template>

<style lang="scss">

</style>