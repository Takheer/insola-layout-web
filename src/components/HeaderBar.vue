<script setup lang="ts">
import {PhSignIn, PhUser} from "@phosphor-icons/vue";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import IDButton from "@/components/ui/IDButton.vue";
import {useUserStore} from "@/stores/useUserStore.ts";

const cardClass = "flex flex-row gap-2 items-center hover:text-orange-600 transition-all cursor-pointer"
const router = useRouter();

const _install_ready = ref(false);
const _install_prompt = ref(null);
const _app_installed = ref(false);

const userStore = useUserStore();

onMounted(() => {
  window.addEventListener("beforeinstallprompt", savePrompt)
  window.addEventListener("appinstalled", handleAppInstalled)
})

function savePrompt(event: any) {
  event.preventDefault();
  _install_prompt.value = event;
  _install_ready.value = true;
}

function installPWA(){
  // @ts-ignore
  _install_prompt.value?.prompt()
}

function handleAppInstalled(){
  _install_prompt.value = null;
  _app_installed.value = true;
}
</script>

<template>
<div class="flex flex-row px-6 py-2 gap-4 shadow-lg">
  <div :class="cardClass" @click="router.push('/')">
    Проекты
  </div>
  <div v-show="_install_ready && !_app_installed" class="flex flex-row gap-2 items-center">
    Установите это приложение
    <IDButton @click="installPWA()" size="sm">Install</IDButton>
  </div>
  <p v-show="_app_installed">
    Приложение установлено
  </p>
  <div
    v-if="userStore.getCurrentUser"
    :class="cardClass"
    class="ml-auto"
    @click="router.push('/user')"
  >
    <PhUser size="20" />
    Аккаунт
  </div>
  <div
    v-else
    :class="cardClass"
    class="ml-auto"
    @click="router.push('/login')"
  >
    <PhSignIn size="20" />
    Войти
  </div>
</div>
</template>

<style lang="scss">

</style>
