<script setup lang="ts">

import {PhCheck, PhExport, PhGear, PhGlobe, PhSidebarSimple, PhUser} from "@phosphor-icons/vue";
import {useRoute, useRouter} from "vue-router";
import IDBaseLink from "@/components/ui/IDBaseLink.vue";
import IDButton from "@/components/ui/IDButton.vue";
import {useApi} from "@/services/useApi.ts";
import {useCuttingStore} from "@/stores/useCuttingStore.ts";
import {useProjectsStore} from "@/stores/useProjectsStore.ts";

const tabClass = "flex flex-row w-fit gap-2 px-2 py-1 rounded-lg cursor-pointer";

type TProps = {
  selectedTab: number | null
};
const props = withDefaults(defineProps<TProps>(), {
  selectedTab: null
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

async function publish() {
  const data = await api.createNewProject(
    JSON.parse(localStorage.getItem('projectUuid')!),
    store
  )

  if (data.status === 401) {
    await router.push(`/login?redirect_uri=${route.fullPath}`)
  }
}

function setSelectedTab(i: number) {
  emits('update', props.selectedTab === i ? null : i);
}
</script>

<template>
<div class="flex flex-col gap-2 py-2 px-4 bg-gray-200 text-sm min-w-40">
  <div
    class="flex flex-row items-center gap-1 bg-gray-200 pt-1 rounded-t-lg"
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
      v-else
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
