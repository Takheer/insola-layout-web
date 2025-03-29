<script setup lang="ts">
import TabsMenu from "@/components/TabsMenu.vue";
import SideMenu from "@/components/SideMenu.vue";
import AddPiecesScreen from "@/components/AddPiecesScreen.vue";
import PiecesList from "@/components/PiecesList.vue";
import MainCanvas from "@/components/MainCanvas.vue";
import {ref} from "vue";
import {useCuttingStore} from "@/stores/useCuttingStore.ts";

const selectedTab = ref(null);
const store = useCuttingStore()
</script>

<template>
  <div class="flex flex-col h-[100vh]">
    <TabsMenu :selected-tab="selectedTab" @update="selectedTab=$event" />
    <div class="flex flex-row gap-2 overflow-y-hidden">
      <Transition>
        <SideMenu :selected-tab="selectedTab" />
      </Transition>
      <div class="flex flex-row gap-2 p-4 w-full">
        <AddPiecesScreen v-if="store.pieces.length === 0" />
        <PiecesList v-else class="overflow-y-auto transition-all" />
        <MainCanvas v-if="store.pieces.length > 0" class="overflow-y-auto transition-all" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
