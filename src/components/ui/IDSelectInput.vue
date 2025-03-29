<script setup lang="ts">
import {onMounted} from "vue";

const model = defineModel()

function update(e: Event) {
  const target = e.target as HTMLTextAreaElement
  model.value = target.value
}

type TProps = {
  label?: string,
  options: any[],
  itemValue?: string,
  itemLabel?: string,
  error?: boolean,
  errorMessage?: string
  placeholder?: string
  dense?: boolean
  selectedItemId?: string
};
const props = withDefaults(defineProps<TProps>(), {
  itemValue: 'value',
  itemLabel: 'label'
});
const id = props.label || props.placeholder

onMounted(() => {
  if (props.selectedItemId) {
    model.value = props.options.find(o => o[props.itemValue] === props.selectedItemId).id;
  }
})
</script>

<template>
<div class="flex flex-col gap-2">
  <label v-if="label" :for="label">{{ label }}</label>
  <select
    v-model="model"
    class="cursor-pointer transition-all outline outline-gray-400 outline-2 hover:outline-orange-200 focus:outline-orange-400 rounded appearance-none"
    :class="dense ? 'px-2 py-1' : 'px-4 py-2'"
    :id="id"
  >
    <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
    <option v-for="option of options" :key="itemValue" :value="option[itemValue]">{{ option[itemLabel] }}</option>
  </select>
  <p v-if="error"></p>
</div>
</template>

<style scoped lang="scss">
select {
  background: url('data:image/svg+xml,<svg data-v-ff992ebd="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16" fill="currentColor"><g><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></g></svg>');
  background-position: calc(100% - 0.75rem) center !important;
  background-repeat: no-repeat;
  background-color: white;
}
</style>
