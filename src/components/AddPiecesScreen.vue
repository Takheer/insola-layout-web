<script setup lang="ts">
import IDButton from "@/components/ui/IDButton.vue";
import {PhPlus, PhFilePdf} from "@phosphor-icons/vue";
import {useRouter} from "vue-router";

const router = useRouter();

async function createNewProject() {
  let uuid;
  if (localStorage.getItem('projectUuid')) {
    uuid = localStorage.getItem('projectUuid')
  } else {
    uuid = crypto.randomUUID()
    localStorage.setItem('projectUuid', JSON.stringify(crypto.randomUUID()))
  }
  uuid = await JSON.parse(uuid!)
  await router.push(`/${uuid}`)
}
</script>

<template>
<div class="flex flex-col gap-2 w-full justify-center items-center px-24 py-32">
  <IDButton
    @click="createNewProject"
    class="w-full flex flex-row items-center gap-2 justify-center"
    variant="primary"
    full-width
  >
    <PhPlus size="32" />
    Новый проект
  </IDButton>
  <div></div>
  <IDButton
    @click="createNewProject"
    class="w-full flex flex-row items-center gap-2 justify-center"
    variant="outline"
    full-width
  >
    Импорт из SketchCut
  </IDButton>
  <div></div>
  <IDButton
    @click="createNewProject"
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
