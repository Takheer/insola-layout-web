<script setup lang="ts">
import TabsMenu from "@/components/TabsMenu.vue";
import SideMenu from "@/components/SideMenu.vue";
import PiecesList from "@/components/PiecesList.vue";
import MainCanvas from "@/components/MainCanvas.vue";
import {onMounted, ref} from "vue";
import {useCuttingStore} from "@/stores/useCuttingStore.ts";
import {useProjectsStore} from "@/stores/useProjectsStore.ts";
import {piecesFromDto, useApi} from "@/services/useApi.ts";
import {useRoute} from "vue-router";

const selectedTab = ref(null);
const store = useCuttingStore()
const projectsStore = useProjectsStore();
const api = useApi();
const route = useRoute();

onMounted(async () => {
  store.loadPieces()
  store.loadSettings()
  const data = await api.getProjectByUuid(route.params.uuid as string)

  if (data.project.pieces) {
    store.pieces = piecesFromDto(data.project.pieces)
  }
  if (store.pieces.length === 0) {
    store.addNewPiece();
  }
  if (projectsStore.projectsList.length === 0) {
    const data = await api.getUserProjects();
    projectsStore.projectsList = data.projects
  }
})

store.$subscribe(() => {
  store.saveSettings()
})
</script>

<template>
  <div class="flex flex-col h-[100vh]">
    <TabsMenu :selected-tab="selectedTab" @update="selectedTab=$event" />
    <div class="flex flex-row gap-2 overflow-y-hidden">
      <Transition>
        <SideMenu :selected-tab="selectedTab" />
      </Transition>
      <div class="flex flex-row gap-2 p-4 w-full">
        <PiecesList class="overflow-y-auto transition-all" />
        <MainCanvas v-if="store.pieces.length > 0" class="transition-all" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>
