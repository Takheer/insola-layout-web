<script setup lang="ts">
import {ref} from "vue";

const model = defineModel()

function update(e: Event) {
  const target = e.target as HTMLTextAreaElement
  model.value = target.value
}

const input = ref<HTMLInputElement | null>(null);

type TProps = {
  label?: string,
  error?: boolean,
  errorMessage?: string
  placeholder?: string
  dense?: boolean
  inline?: boolean
};
const props = defineProps<TProps>();
const id = props.label || props.placeholder
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="label">{{ label }}</label>
    <div
      :id="id"
      ref="input"
      @input="update"
      class="transition-all outline outline-gray-400 outline-2 hover:outline-orange-200 focus:outline-orange-400 rounded"
      :class="[
        error ? 'outline-red-400' : '',
        dense ? 'px-2 py-1' : 'px-4 py-2',
        model ? '' : 'text-gray-400',
        inline ? 'whitespace-nowrap overflow-auto' : ''
      ]" >
      {{ model || placeholder }}
    </div>
    <p v-if="error" class="text-red-400">{{ errorMessage }}</p>
  </div>
</template>

<style lang="scss">

</style>
