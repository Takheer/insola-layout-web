<script setup lang="ts">
import IDModal from "@/components/ui/IDModal.vue";
import {useCuttingStore} from "@/stores/useCuttingStore";
import IDTextInput from "@/components/ui/IDTextInput.vue";
import IDButton from "@/components/ui/IDButton.vue";
import useVuelidate from "@vuelidate/core";
import { required, numeric } from "@/utils/validators";
import {ref} from "vue";

const model = defineModel()

const rules = {
  title: { required }
}

const store = useCuttingStore();
const form = ref({
  title: ''
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
    title: form.value.title
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
