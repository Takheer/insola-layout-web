<script setup lang="ts">
import TabsMenu from "@/components/TabsMenu.vue";
import SideMenu from "@/components/SideMenu.vue";
import PiecesList from "@/components/PiecesList.vue";
import MainCanvas from "@/components/MainCanvas.vue";
import {onMounted, ref} from "vue";
import {useCuttingStore} from "@/stores/useCuttingStore.ts";
import {useProjectsStore} from "@/stores/useProjectsStore.ts";
import {useApi} from "@/services/useApi.ts";
import {useRoute} from "vue-router";
import {PhSpinner} from "@phosphor-icons/vue";

const selectedTab = ref(null);
const store = useCuttingStore()
const projectsStore = useProjectsStore();
const api = useApi();
const route = useRoute();

const isProjectEditable = ref(false)
const isProjectLoading = ref(false);

onMounted(async () => {
  isProjectLoading.value = true;
  store.loadPieces()
  store.loadSettings()
  const [data, userOwnsProjectData] = await Promise.all([
    api.getProjectByUuid(route.params.uuid as string),
    api.userOwnsProject(route.params.uuid as string)
  ])

  isProjectEditable.value = userOwnsProjectData.owns || data.status === 404;

  if (data.status === 200) {
    store.pieces = data.project.pieces
    store.edgeSettings = data.project.edgeSettings;
    store.projectDetails = data.project.projectDetails;
    store.layoutMethod = data.project.layoutMethod;
  } else if (localStorage.getItem('pieces')) {
    store.pieces = await JSON.parse(localStorage.getItem('pieces') ?? '[]');
    for (let i = 0; i < store.pieces.length; i++) {
      if (!store.pieces[i].slots) {
        store.pieces[i].slots = { width: [0, 0], height: [0, 0]}
      }
    }
  }
  if (store.pieces.length === 0) {
    store.addNewPiece();
  }

  isProjectLoading.value = false;

  if (projectsStore.projectsList.length === 0) {
    const data = await api.getUserProjects();
    projectsStore.projectsList = data.status === 200 ? data.projects : []
  }
})

store.$subscribe(() => {
  store.saveSettings()
})
</script>

<template>
  <div class="flex flex-col">
    <div v-if="isProjectLoading" class="flex items-center justify-center p-24 w-full animate-spin">
      <PhSpinner size="64" />
    </div>
    <template v-else>
      <TabsMenu
        :selected-tab="selectedTab"
        :is-project-editable="isProjectEditable"
        @update="selectedTab=$event"
        class="order-2 md:order-1"
      />
      <div class="flex flex-row overflow-y-hidden order-1 md:order-2">
        <Transition>
          <SideMenu :selected-tab="selectedTab" />
        </Transition>
        <div class="flex flex-col md:flex-row gap-2 p-4 pt-0 w-full">
          <PiecesList :disabled="!isProjectEditable" class="overflow-y-auto transition-all grow h-[43vh] md:h-[86vh]" />
          <MainCanvas v-if="store.pieces.length > 0" class="transition-all h-[43vh] md:h-[86vh]" />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">

</style>
