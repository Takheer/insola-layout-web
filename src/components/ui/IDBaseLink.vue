<script setup lang="ts">
type TProps = {
  rel?: string
  to: string
};
defineProps<TProps>();
</script>

<template>
  <NuxtLink
    :to="to"
    :rel="rel"
    class="hover:text-orange-600 transition-all"
  >
    <slot></slot>
  </NuxtLink>
</template>

<style lang="scss">

</style>