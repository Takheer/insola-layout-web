<script setup lang="ts">
import {PhCircleNotch} from "@phosphor-icons/vue";
import {computed} from "vue";

type TProps = {
  to?: string
  variant?: 'primary' | 'outline'
  fullWidth?: boolean
  size?: 'lg' | 'md' | 'sm'
  loading?: boolean
  dense?: boolean
};

const props = withDefaults(defineProps<TProps>(), {
  variant: 'primary',
  fullWidth: false,
  size: 'md',
  dense: false
});

const btnClasses = {
  primary: 'bg-yellow-400',
  outline: 'border border-1'
}

const btnHoverClasses = {
  primary: 'hover:bg-yellow-500',
  outline: 'bg-white hover:bg-yellow-300'
}

const sizeClasses = {
  lg: 'px-8 py-4 text-lg',
  md: 'px-6 py-3',
  sm: 'px-4 py-2 text-sm'
}

const iconSize = {
  lg: 32,
  md: 24,
  sm: 16
}

const btnClass = computed(() => ['flex text-black rounded-lg',
  btnClasses[props.variant],
  props.loading ? '' : btnHoverClasses[props.variant],
  sizeClasses[props.size],
  props.loading ? 'cursor-default' : 'cursor-pointer transition-all'].join(' ')
)

const widthClass = computed(() => props.fullWidth ? 'w-full justify-center' : 'grow-0 w-fit')

type TEmits = {
  (e: 'click'): void
};
const emits = defineEmits<TEmits>();
</script>

<template>
  <a
    v-if="to"
    :class="[btnClass, widthClass]"
    :href="to"
  >
    <PhCircleNotch :size="iconSize[size]" v-if="loading" class="animate-spin" />
    <slot v-else />
  </a>
  <button
    v-else
    :class="[btnClass, widthClass]"
    @click="() => loading ? null : emits('click')"
  >
    <PhCircleNotch :size="iconSize[size]" v-if="loading" class="animate-spin" />
    <slot v-else />
  </button>
</template>

<style lang="scss">

</style>
