<script setup lang="ts">
import {ref} from "vue";

const model = defineModel()

function update(e: Event) {
  const target = e.target as HTMLTextAreaElement
  model.value = isNaN(Number(target.value)) ? target.value : Number(target.value)
}

const input = ref<HTMLInputElement | null>(null);
type TEmits = {
  (e: 'focus'): void
  (e: 'blur'): void
};
const emits = defineEmits<TEmits>();

type TProps = {
  label?: string,
  labelClass?: string
  error?: boolean,
  message?: string
  errorMessage?: string
  placeholder?: string
  dense?: boolean
  disabled?: boolean
};
const props = defineProps<TProps>();
const id = props.label || props.placeholder
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="label" :class="labelClass ?? ''">{{ label }}</label>
    <div class="flex gap-2 relative">
      <div
        data-testid="input-wrapper"
        class="flex grow overflow-hidden"
        :class="[
          'transition-all outline outline-gray-400 outline-2 hover:outline-orange-200 focus:outline-orange-400 rounded',
          disabled ? 'hover:outline-gray-200' : 'hover:outline-orange-200'
          ]"
      >
        <input
          :id="id"
          ref="input"
          :placeholder="placeholder"
          :disabled="disabled"
          @input="update"
          @focus="emits('focus')"
          @blur="emits('blur')"
          :value="model"
          class="box-content block bg-transparent font-inter
            not-last:pr-0 w-full border-none focus-visible:outline-none
            cursor-inherit transition-all"
          :class="[
            error ? 'outline-red-400' : '',
            dense ? 'px-2 py-1' : 'px-4 py-2',
            disabled ? 'text-gray-400' : '',
            ]"
        />
      </div>
      <slot name="append:outer" />
    </div>
    <p v-if="error" class="text-red-400">{{ errorMessage }}</p>
    <p v-else-if="message" class="text-sm text-gray-600">{{ message }}</p>
  </div>
</template>

<style lang="scss">

</style>
