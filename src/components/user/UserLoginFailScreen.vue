<script setup lang="ts">
import {PhWarningOctagon} from "@phosphor-icons/vue";
import IDBaseLink from "@/components/ui/IDBaseLink.vue";
</script>

<template>
  <div class="flex flex-col p-8 gap-4 shadow-lg rounded-2xl items-center">
    <PhWarningOctagon color="red" size="48" />
    <p class="text-xl md:text-2xl">Неверный код!</p>
    <div class="flex flex-row gap-4 font-light">
      <IDBaseLink to="/login">Попробовать снова</IDBaseLink>
      <IDBaseLink to="/">На главную</IDBaseLink>
    </div>
  </div>
</template>

<style lang="scss">

</style>
