<script setup lang="ts">
import {onMounted} from "vue";
import {useApi} from "@/services/useApi.ts";
import {useUserStore} from "@/stores/useUserStore.ts";

const api = useApi();
const userStore = useUserStore();

onMounted(async () => {
  userStore.user = (await api.getCurrentUser()).user;
})
</script>

<template>
<div class="flex flex-row gap-4">
  <div class="flex flex-col gap-2 p-4">
    <div class="flex flex-row gap-2">
      <h1>{{ userStore.user.fullName }}</h1>
      <p class="text-gray-400">{{ userStore.user.email }}</p>
    </div>
  </div>
</div>
</template>

<style lang="scss">

</style>
