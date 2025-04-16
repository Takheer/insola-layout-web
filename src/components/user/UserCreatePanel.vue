<script setup lang="ts">

import IDTextInput from "@/components/ui/IDTextInput.vue";
import IDButton from "@/components/ui/IDButton.vue";
import {useVuelidate} from "@vuelidate/core";
import { required, email } from "@/utils/validators";
import {ref} from "vue";
import {useAuthApi} from "@/services/useAuthApi.ts";

type TEmits = {
  (e: 'setCredential', val: string): void
  (e: 'updateMode'): void
};
const emits = defineEmits<TEmits>();

const authApi = useAuthApi();

const rules = {
  credential: { required, email },
  name: { required }
}

const $externalResults = ref({})

const credential = ref('')
const name = ref('')
const v$ = useVuelidate(rules, { credential, name }, { $externalResults });

async function sendConfirmationCode() {
  await v$.value.$validate();
  if (v$.value.$error) {
    return;
  }

  await authApi.createUser(credential.value, name.value)
  emits('setCredential', credential.value)
}
</script>

<template>
  <div class="flex flex-col p-8 gap-4 shadow-lg rounded-2xl">
    <p class="text-lg md:text-xl font-bold">Зарегистрироватсья</p>
    <IDTextInput
      v-model="credential"
      placeholder="Электронная почта"
      :error-message="v$.credential.$errors?.[0]?.$message.toString()"
      :error="v$.credential.$error"
    />
    <IDTextInput
      v-model="name"
      placeholder="Имя"
      :error-message="v$.name.$errors?.[0]?.$message.toString()"
      :error="v$.name.$error"
    />
    <IDButton
      variant="primary"
      @click="sendConfirmationCode"
    >
      Получить код
    </IDButton>
    <div class="flex flex-row gap-2">
      Есть учётная запись?
      <div class="hover:text-orange-600 transition-all cursor-pointer" @click="() => emits('updateMode')">Войти</div>
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
