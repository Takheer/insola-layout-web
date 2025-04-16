<script setup lang="ts">

import IDTextInput from "@/components/ui/IDTextInput.vue";
import {pluralize} from "@/utils/pluralize";
import {useAuthApi} from "@/services/useAuthApi";
import {computed, onMounted, ref, watch} from "vue";

type TEmits = {
  (e: 'success'): void
  (e: 'fail'): void
};
const emits = defineEmits<TEmits>();

type TProps = {
  credential: string
};
const props = defineProps<TProps>();

const SECONDS_TO_RESEND = 60;

const authApi = useAuthApi();

let confirmationTickInterval: ReturnType<typeof setInterval> | undefined

const code = ref('');
const inputDisabled = ref(false);
const confirmationRecentlySent = ref(false);
const confirmationTickTime = ref(SECONDS_TO_RESEND);

const confirmationTickTimeFormatted = computed(
  () => `${confirmationTickTime.value} ${pluralize(confirmationTickTime.value, "секунду", "секунды", "секунд")}`
);

function sendCode() {
  authApi.sendCodeToEmail(props.credential);

  confirmationTickTime.value = SECONDS_TO_RESEND
  confirmationRecentlySent.value = true;
  confirmationTickInterval = setInterval(() => confirmationTickTime.value--, 1000)

  setTimeout(() => {
    confirmationRecentlySent.value = false;
    clearInterval(confirmationTickInterval)
    confirmationTickInterval = undefined;
    confirmationTickTime.value = 0
  }, SECONDS_TO_RESEND * 1000)
}

onMounted(() => sendCode())

watch(code, async (newVal: string) => {
  if (newVal.toString().length !== 4) {
    return
  }
  inputDisabled.value = true;
  const authResult = await authApi.auth(props.credential, newVal);
  authResult.success ? emits('success') : emits('fail')
  inputDisabled.value = false;
})
</script>

<template>
  <div class="flex flex-col p-8 gap-4 shadow-lg rounded-2xl">
    <p class="text-lg md:text-xl">Отправили код на {{ credential }}</p>
    <p class="text-sm md:text-base font-light">Напишите его, чтобы подтвердить, что это вы, а не кто-то другой входит в личный кабинет</p>
    <IDTextInput
      v-model="code"
      placeholder="Код подтверждения"
      :disabled="inputDisabled"
    />
    <p v-if="confirmationTickTime">
      Получить код повторно можно через {{ confirmationTickTimeFormatted }}
    </p>
    <p
      v-else
      class="transition-all hover:text-orange-600 cursor-pointer"
      @click="sendCode"
    >
      Получить код повторно
    </p>
  </div>
</template>

<style lang="scss">

</style>
