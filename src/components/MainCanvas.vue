<script setup lang="ts">
import {ELayoutMethod, useCuttingStore} from '@/stores/useCuttingStore';
import { type TPiecesLayout, useAlignPieces} from "@/services/alignPieces";
import {usePiecesDrawing} from "@/composables/usePiecesDrawing";
import {onMounted, ref, useTemplateRef, watch} from "vue";
import {useProjectsStore} from "@/stores/useProjectsStore.ts";
import {useRoute} from "vue-router";
import {useApi} from "@/services/useApi.ts";
import {debounce} from "@/utils/debounce.ts";

type TProps = {
  ignoreLocalStorage?: boolean
};
const props = withDefaults(defineProps<TProps>(), {
  ignoreLocalStorage: false
});
const stage = useTemplateRef('stage')
const tr1Ref = useTemplateRef('tr1Ref')

const store = useCuttingStore();
const projectsStore = useProjectsStore();
const route = useRoute();
const api = useApi();

const { alignPieces } = useAlignPieces()
const { canvasHeight, canvasWidth, getDrawablePiecesAndSheets } = usePiecesDrawing();

onMounted(async () => {
  const {pieces: rawPieces, lists: rawLists} = alignPieces(store.pieces, store.layoutMethod === ELayoutMethod.VERTICAL);
  const {pieces: drawablePieces, sheets: drawableSheets} = getDrawablePiecesAndSheets(rawPieces, rawLists)
  lists.value = drawableSheets;
  pieces.value = drawablePieces

})

const stageSize = ref({
  width: canvasWidth,
  height: canvasHeight
});

const pieces = ref([] as TPiecesLayout[]);
const lists = ref([] as TPiecesLayout[]);
const dragItemId = ref(null);

const handleDragstart = (e) => {
  // save drag element:
  dragItemId.value = e.target.id();
  // move current element to the top:
  const item = lists.value.find(i => i.id === dragItemId.value);
  const index = lists.value.indexOf(item);
  lists.value.splice(index, 1);
  lists.value.push(item);
};

const handleDragend = () => {
  dragItemId.value = null;
};

const updateProjectDebounced = debounce(api.updateProject, 700)

watch([() => store.pieces, () => store.layoutMethod, () => store.rawSheetSettings, () => store.slotSettings, () => store.projectDetails], () => {
  if (projectsStore.isProjectPublished(route.params.uuid as string)) {
    updateProjectDebounced(route.params.uuid as string, store)
    localStorage.removeItem('localProjectUuid')
  }
}, { deep: true })

watch([() => store.pieces, () => store.layoutMethod, () => store.rawSheetSettings, () => store.slotSettings], () => {
  if (store.pieces.length) {
    localStorage.setItem('pieces', JSON.stringify(store.pieces))
  }
  const {pieces: rawPieces, lists: rawLists, stats} = alignPieces(store.pieces, store.layoutMethod === ELayoutMethod.VERTICAL);
  store.totalSheetsCount = rawPieces.reduce((prev, curr) => curr.rawListNumber > prev ? curr.rawListNumber : prev, 0) + 1
  store.cuttingLength = stats.cuttingLength

  const {pieces: drawablePieces, sheets: drawableSheets} = getDrawablePiecesAndSheets(rawPieces, rawLists)
  lists.value = drawableSheets;
  pieces.value = drawablePieces

}, { deep: true, immediate: true })


</script>

<template>
  <div class="overflow-y-auto pt-4" :style="{minWidth: `${canvasWidth}px`}">
    <v-stage
      ref="stage"
      :config="stageSize"
      @dragstart="handleDragstart"
      @dragend="handleDragend"
    >
      <v-layer ref="layer">
        <v-rect
          v-for="(item, i) in lists"
          :key="i"
          :config="{
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
          fill: '#6db8c9',
          opacity: 0.6
        }"
        />
        <v-rect
          v-for="(item, i) in pieces"
          :key="i"
          :config="{
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
          fill: '#89b717',
          opacity: 0.8
        }"
        />
        <v-text
          v-for="(item, i) in pieces"
          :key="i"
          :config="{
            x: item.x,
            y: item.y + item.h - 8,
            text: `${item.originalWidth}x${item.originalHeight}`,
            fontSize: 8,
            fontFamily: 'Roboto',
            fill: '#222222'
          }"
        />

        <v-transformer :config="{}" ref="tr1Ref" />
      </v-layer>
    </v-stage>
  </div>
</template>

<style lang="scss">

</style>
