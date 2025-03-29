<script setup lang="ts">
type TProps = {
  rel?: string
  to: string
};
defineProps<TProps>();
</script>

<template>
  <a
    :href="to"
    :rel="rel"
    class="hover:text-orange-600 transition-all"
  >
    <slot></slot>
  </a>
</template>

<style lang="scss">

</style>
