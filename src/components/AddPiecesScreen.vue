<script setup lang="ts">
import IDButton from "@/components/ui/IDButton.vue";
import {PhPlus, PhFilePdf} from "@phosphor-icons/vue";
import {useCuttingStore} from "@/stores/useCuttingStore";
const store = useCuttingStore();
</script>

<template>
<div class="flex flex-col gap-2 w-full justify-center items-center px-24 py-32">
  <IDButton
    @click="store.addNewPiece"
    class="w-full flex flex-row items-center gap-2 justify-center"
    variant="primary"
    full-width
  >
    <PhPlus size="32" />
    Добавить деталь
  </IDButton>
  <div></div>
  <IDButton
    @click="store.addNewPiece"
    class="w-full flex flex-row items-center gap-2 justify-center"
    variant="outline"
    full-width
  >
    Импорт из SketchCut
  </IDButton>
  <div></div>
  <IDButton
    @click="store.addNewPiece"
    class="w-full flex flex-row items-center gap-2 justify-center"
    variant="outline"
    full-width
  >
    <PhFilePdf size="32" />
    Распознать из PDF
  </IDButton>
</div>
</template>

<style lang="scss">

</style>
