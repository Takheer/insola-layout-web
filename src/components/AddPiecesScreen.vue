<script setup lang="ts">
import {IKButton} from "insola-tech-ui-kit";
import {PhPlus, PhFilePdf} from "@phosphor-icons/vue";
import {useRouter} from "vue-router";

const router = useRouter();

async function createNewProject() {
  let uuid;
  if (localStorage.getItem('localProjectUuid')) {
    uuid = await JSON.parse(localStorage.getItem('localProjectUuid')!)
  } else {
    uuid = crypto.randomUUID()
    localStorage.setItem('localProjectUuid', JSON.stringify(crypto.randomUUID()))
  }
  await router.push(`/${uuid}`)
}
</script>

<template>
<div class="flex flex-col gap-2 w-full justify-center items-center px-24 py-32">
  <IKButton
    @click="createNewProject"
    class="w-full flex flex-row items-center gap-2 justify-center"
    variant="primary"
    full-width
  >
    <PhPlus size="32" />
    Новый проект
  </IKButton>
  <div></div>
  <IKButton
    @click="createNewProject"
    class="w-full flex flex-row items-center gap-2 justify-center"
    variant="outline"
    full-width
  >
    Импорт из SketchCut
  </IKButton>
  <div></div>
  <IKButton
    @click="createNewProject"
    class="w-full flex flex-row items-center gap-2 justify-center"
    variant="outline"
    full-width
  >
    <PhFilePdf size="32" />
    Распознать из PDF
  </IKButton>
</div>
</template>

<style lang="scss">

</style>
