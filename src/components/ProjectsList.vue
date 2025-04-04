<script setup lang="ts">
import AddPiecesScreen from "@/components/AddPiecesScreen.vue";
import {computed, onMounted, ref} from "vue";
import IDBaseLink from "@/components/ui/IDBaseLink.vue";
import {useApi} from "@/services/useApi.ts";
import {pluralize} from "../utils/pluralize.ts";
import {useRouter} from "vue-router";
import {useProjectsStore} from "@/stores/useProjectsStore.ts";

const api = useApi();
const router = useRouter();

const projectUuid = ref(null);
const store = useProjectsStore();

onMounted(async () => {
  const data = await api.getUserProjects();
  if (data.status === 200) {
    console.log({data})
    store.projectsList = data.projects
  }
  if (localStorage.getItem('projectUuid')) {
    projectUuid.value = JSON.parse(localStorage.getItem('projectUuid')!)
  }
})
</script>

<template>
<div class="flex flex-row gap-4 h-full">
  <div class="flex flex-col gap-2 bg-gray-200 p-2 h-full">
    <div v-if="store.projectsList.length === 0" class="p-2">
      Тут появятся ваши опубликованные проекты
    </div>
    <div
      v-for="project of store.projectsList"
      class="flex flex-col gap-2 p-2 bg-white rounded-lg shadow-lg cursor-pointer hover:dark:bg-gray-100 transition-all"
      @click="router.push(`/${projectUuid}`)"
    >
      <div class="w-60 text-ellipsis whitespace-nowrap overflow-hidden">
        {{ project.uuid }}
      </div>
      <div>
        {{ project.pieces?.length }} {{ pluralize(project.pieces?.length, "деталь", "детали", "деталей")}}
      </div>
    </div>
  </div>
  <AddPiecesScreen v-if="store.isProjectPublished(projectUuid)" />
  <div
    v-else
    class="flex flex-col gap-4 p-12 w-full items-center"
  >
    У вас уже есть неопубликованный проект. Чтобы создать новый, войдите или зарегистрируйтесь, а затем опубликуйте текущий проект.
    <div class="flex flex-row gap-4">
      <IDBaseLink to="/login">Войти</IDBaseLink>
      <IDBaseLink :to="`/${projectUuid}`">Вернуться к проекту</IDBaseLink>
    </div>
  </div>
</div>
</template>

<style lang="scss">

</style>
