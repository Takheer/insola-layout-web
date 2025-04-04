<script setup lang="ts">

import {PhCheck} from "@phosphor-icons/vue";
import IDBaseLink from "@/components/ui/IDBaseLink.vue";
import {onMounted, ref} from "vue";
import {useRouter, useRoute} from "vue-router";

const SECONDS_TO_REDIRECT = 3;

const router = useRouter()
const route = useRoute()

const secondsToRedirect = ref(SECONDS_TO_REDIRECT)

onMounted( () => {
  setInterval(() => {
    secondsToRedirect.value--;
  }, 1000)
  setTimeout(async () => {
    if (route.query.redirect_uri) {
      await router.replace(route.query.redirect_uri as string);
    } else {
      await router.replace('/');
    }
  }, SECONDS_TO_REDIRECT * 1000)
})
</script>

<template>
  <div class="flex flex-col p-16 gap-8 shadow-lg rounded-2xl items-center">
    <PhCheck color="green" size="64" />
    <p class="text-xl md:text-2xl">Вы вошли в учётную запись!</p>
    <p>
      До выхода на предыдущую страницу: 00:0{{ secondsToRedirect }} сек.
    </p>
    <div class="flex flex-row gap-8 font-light">
      <IDBaseLink to="/">На главную</IDBaseLink>
    </div>
  </div>
</template>

<style lang="scss">

</style>
