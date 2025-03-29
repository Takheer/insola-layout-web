<script setup lang="ts">
type TProps = {
  size: number
  position: 'top' | 'bottom' | 'right' | 'left'
  isSelected?: boolean
};
const props = defineProps<TProps>();

const model = defineModel<number|boolean>()

function update() {
  model.value = !model.value
}

const vertical = computed(() => ['right', 'left'].includes(props.position))

const positionClass = {
  'top': 'top-0 border-t',
  'bottom': 'bottom-0 border-b',
  'right': 'top-0 right-0 border-r',
  'left': 'top-0 left-0 border-l',
}
</script>

<template>
  <div
    class="absolute hover:border-red-300 transition-all cursor-pointer p-1"
    :class="[positionClass[position], model ? 'border-red-400' : '']"
    :style="vertical ? `height: ${size}px;` : `width: ${size}px;`"
    @click="update"
  />
</template>

<style lang="scss">

</style>