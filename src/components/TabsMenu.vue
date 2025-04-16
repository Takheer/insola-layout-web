<script setup lang="ts">

import {PhCheck, PhExport, PhGear, PhGlobe, PhSidebarSimple, PhUser} from "@phosphor-icons/vue";
import {useRoute, useRouter} from "vue-router";
import IDBaseLink from "@/components/ui/IDBaseLink.vue";
import IDButton from "@/components/ui/IDButton.vue";
import {useApi} from "@/services/useApi.ts";
import {useCuttingStore} from "@/stores/useCuttingStore.ts";
import {useProjectsStore} from "@/stores/useProjectsStore.ts";
import {ref} from "vue";

const tabClass = "flex flex-row w-fit gap-2 px-2 py-1 rounded-lg cursor-pointer";

type TProps = {
  selectedTab: number | null
  isProjectEditable?: boolean
};
const props = withDefaults(defineProps<TProps>(), {
  selectedTab: null,
  isProjectEditable: false
});

type TEmits = {
  (e: 'update', val: any): void
};
const emits = defineEmits<TEmits>();

const store = useCuttingStore();
const projectsStore = useProjectsStore();
const api = useApi();
const router = useRouter();
const route = useRoute();

const isProjectPublishing = ref(false)

async function publish() {
  isProjectPublishing.value = true;
  const data = await api.createNewProject(route.params.uuid as string, store)

  if (data.status === 401) {
    isProjectPublishing.value = false;
    await router.push(`/login?redirect_uri=${route.fullPath}`)
  }
  if (data.project.pieces) {
    projectsStore.projectsList.push(data.project)
    localStorage.removeItem('localProjectUuid')
    isProjectPublishing.value = false;
  }
}

function setSelectedTab(i: number) {
  emits('update', props.selectedTab === i ? null : i);
}
</script>

<template>
<div class="flex flex-col gap-2 px-4 bg-gray-200 text-sm min-w-40">
  <div
    class="flex flex-row items-center gap-1 bg-gray-200 pt-3 py-2 rounded-t-lg overflow-x-auto"
  >
    <div
      :class="[tabClass, selectedTab === 0 ? 'bg-white' : '']"
      @click="setSelectedTab(0)"
    >
      <PhGear size="20" />
      Настройки
    </div>
    <div
      :class="[tabClass, selectedTab === 1 ? 'bg-white' : '']"
      @click="setSelectedTab(1)"
    >
      <PhSidebarSimple size="20" />
      Пазы
    </div>
    <div
      :class="[tabClass, selectedTab === 2 ? 'bg-white' : '']"
      @click="setSelectedTab(2)"
    >
      <PhExport size="20" />
      Скачать
    </div>
    <div
      v-if="projectsStore.isProjectPublished(route.params.uuid as string)"
      class="flex flex-row items-center gap-1 ml-2 text-gray-600"
    >
      <PhCheck color="green" size="20" />
      Опубликован!
    </div>
    <IDButton
      v-else-if="isProjectEditable"
      variant="primary"
      size="sm"
      class="flex flex-row gap-2 ml-2"
      @click="publish"
    >
      <PhGlobe size="20" />
      Опубликовать
    </IDButton>
  </div>
</div>
</template>

<style lang="scss">

</style>
