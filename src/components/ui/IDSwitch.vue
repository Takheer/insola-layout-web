<script setup lang="ts">
import {ref, watch} from "vue";

type TProps = {
  options: {
    id: any
    value: any
    selected?: boolean
  }[]
};
const props = defineProps<TProps>();

type TEmits = {
  (e: 'select', id: any): void
};
const emits = defineEmits<TEmits>();

const localOptions = ref<typeof props.options>(props.options);

watch(() => props.options, (newVal) => {
  localOptions.value = newVal;
})

function setSelected(id: any) {
  localOptions.value.forEach(o => o.selected = false);
  localOptions.value.find(o => o.id === id)!.selected = true;
  emits('select', id)
}
</script>

<template>
<div class="flex flex-row p-1 h-fit w-fit bg-gray-200 rounded">
  <div
    v-for="option of localOptions"
    class="cursor-pointer rounded py-1 px-2"
    :class="option.selected ? 'bg-white' : ''"
    @click="setSelected(option.id)"
  >
    {{option.value}}
  </div>
</div>
</template>

<style lang="scss">

</style>
