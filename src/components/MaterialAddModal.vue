<script setup lang="ts">
import IDModal from "~/components/ui/IDModal.vue";
import {useCuttingStore} from "~/stores/useCuttingStore";
import IDTextInput from "~/components/ui/IDTextInput.vue";
import IDButton from "~/components/ui/IDButton.vue";
import useVuelidate from "@vuelidate/core";
import { required, numeric } from "~/utils/validators";

const model = defineModel()

const rules = {
  title: { required },
  length: { required, numeric },
  width: { required, numeric },
  thickness: { required, numeric },
}

const store = useCuttingStore();
const form = ref({
  title: '',
  length: null,
  width: null,
  thickness: null,
})
const v$ = useVuelidate(rules, form)

async function addMaterial(value: any) {
  if (!value) {
    return;
  }
  await v$.value.$validate();
  if (v$.value.$error) {
    return;
  }
  store.addMaterial({
    title: form.value.title,
    length: form.value.length!,
    width: form.value.width!,
    thickness: form.value.thickness!
  })
  model.value = false
}
</script>

<template>
  <IDModal @update:modelValue="() => addMaterial" v-model="model">
    <div class="bg-white rounded-xl p-4 md:p-8 flex flex-col gap-4 max-w-124">
      <h3 class="mb-4">Новый материал</h3>
      <IDTextInput
        placeholder="Название"
        v-model="v$.title.$model"
        :error="v$.title.$error"
        :error-message="v$.title.$errors?.[0]?.$message.toString()"
      />
      <div class="flex flex-row items-center gap-2">
        <IDTextInput
          placeholder="Длина"
          v-model="v$.length.$model"
          :error="v$.length.$error"
          :error-message="v$.length.$errors?.[0]?.$message.toString()"
        />
        x
        <IDTextInput
          placeholder="Ширина"
          v-model="v$.width.$model"
          :error="v$.width.$error"
          :error-message="v$.width.$errors?.[0]?.$message.toString()"
        />
        x
        <IDTextInput
          placeholder="Толщина"
          v-model="v$.thickness.$model"
          :error="v$.thickness.$error"
          :error-message="v$.thickness.$errors?.[0]?.$message.toString()"
        />
      </div>
      <IDButton
        variant="primary"
        full-width
        @click="() => addMaterial(true)"
      >
        Добавить
      </IDButton>
    </div>
  </IDModal>
</template>

<style lang="scss">

</style>