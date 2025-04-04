<script setup lang="ts">
import {PhUser} from "@phosphor-icons/vue";
import {useRouter} from "vue-router";

const cardClass = "flex flex-row gap-2 items-center hover:text-orange-600 transition-all cursor-pointer"
const router = useRouter();
</script>

<template>
<div class="flex flex-row px-6 py-2 gap-4 shadow-lg">
  <div :class="cardClass" @click="router.push('/')">
    Проекты
  </div>
  <div
    :class="cardClass"
    class="ml-auto"
    @click="router.push('/login')"
  >
    <PhUser size="20" />
    Войти
  </div>
</div>
</template>

<style lang="scss">

</style>
