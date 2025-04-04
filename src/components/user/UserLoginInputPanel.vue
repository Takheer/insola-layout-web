<script setup lang="ts">

import IDTextInput from "@/components/ui/IDTextInput.vue";
import IDButton from "@/components/ui/IDButton.vue";
import {useVuelidate} from "@vuelidate/core";
import { required, email } from "@/utils/validators";
import {ref} from "vue";

type TEmits = {
  (e: 'setCredential', val: string): void
  (e: 'updateMode'): void
};
const emits = defineEmits<TEmits>();

const rules = {
  credential: {
    required,
    email
  }
}


const credential = ref('')
const v$ = useVuelidate(rules, { credential });

const errorMsg = ref('')

async function sendConfirmationCode() {
  await v$.value.$validate();
  if (v$.value.$error) {
    errorMsg.value = 'Введите верный адрес электронной почты!'
    return;
  }
  errorMsg.value = ''

  emits('setCredential', credential.value)
}
</script>

<template>
<div class="flex flex-col p-8 gap-4 shadow-lg rounded-2xl">
  <p class="text-lg md:text-xl font-bold">Войти</p>
  <IDTextInput
    v-model="credential"
    placeholder="Электронная почта"
    :error-message="errorMsg"
    :error="!!errorMsg"
  />
  <IDButton
    variant="primary"
    @click="sendConfirmationCode"
  >
    Получить код
  </IDButton>
  <div class="flex flex-row gap-2">
    Нет учётной записи?
    <div
      class="hover:text-orange-600 transition-all cursor-pointer"
      @click="() => emits('updateMode')"
    >
      Зарегистрироваться
    </div>
  </div>
</div>
</template>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
