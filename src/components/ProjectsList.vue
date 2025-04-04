<script setup lang="ts">
import AddPiecesScreen from "@/components/AddPiecesScreen.vue";
import {onMounted, ref} from "vue";
import IDBaseLink from "@/components/ui/IDBaseLink.vue";

const projectsList = ref([]);
const projectUuid = ref(null);

onMounted(() => {
  if (localStorage.getItem('projectUuid')) {
    projectUuid.value = JSON.parse(localStorage.getItem('projectUuid')!)
  }
})
</script>

<template>
<div class="flex flex-row gap-4 h-full">
  <div class="flex flex-col gap-2">
    <div v-if="projectsList.length === 0" class="bg-gray-200 p-4 h-full">
      Тут появятся ваши опубликованные проекты
    </div>
    <div v-for="project of projectsList"></div>
  </div>
  <div
    v-if="projectUuid"
    class="flex flex-col gap-4 p-12 w-full items-center"
  >
    У вас уже есть неопубликованный проект. Чтобы создать новый, войдите или зарегистрируйтесь, а затем опубликуйте текущий проект.
    <div class="flex flex-row gap-4">
      <IDBaseLink to="/login">Войти</IDBaseLink>
      <IDBaseLink :to="`/${projectUuid}`">Вернуться к проекту</IDBaseLink>
    </div>
  </div>
  <AddPiecesScreen v-else />
</div>
</template>

<style lang="scss">

</style>
