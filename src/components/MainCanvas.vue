<script setup lang="ts">
import {ELayoutMethod, useCuttingStore} from '@/stores/useCuttingStore';
import { type TPiecesLayout, useAlignPieces} from "@/services/alignPieces";
import {usePiecesDrawing} from "@/composables/usePiecesDrawing";
import {onMounted, ref, watch} from "vue";

type TProps = {
  ignoreLocalStorage?: boolean
};
const props = withDefaults(defineProps<TProps>(), {
  ignoreLocalStorage: false
});

const store = useCuttingStore();

const { alignPieces } = useAlignPieces()
const { canvasHeight, canvasWidth, getDrawablePiecesAndSheets } = usePiecesDrawing(store.rawSheetSettings);

onMounted(async () => {
  if (localStorage.getItem('pieces') && !props.ignoreLocalStorage) {
    store.pieces = await JSON.parse(localStorage.getItem('pieces') ?? '[]');
    for (let i = 0; i < store.pieces.length; i++) {
      if (!store.pieces[i].slots) {
        store.pieces[i].slots = { width: [0, 0], height: [0, 0]}
      }
    }
  }

  const {pieces: rawPieces, lists: rawLists, stats} = alignPieces(store.pieces, store.layoutMethod === ELayoutMethod.VERTICAL);
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

watch([() => store.pieces, () => store.layoutMethod, () => store.rawSheetSettings], () => {
  if (store.pieces.length) {
    localStorage.setItem('pieces', JSON.stringify(store.pieces))
  }

  const {pieces: rawPieces, lists: rawLists, stats} = alignPieces(store.pieces, store.layoutMethod === ELayoutMethod.VERTICAL);
  store.totalSheetsCount = rawPieces.reduce((prev, curr) => curr.rawListNumber > prev ? curr.rawListNumber : prev, 0) + 1
  store.cuttingLength = stats.cuttingLength
  const {pieces: drawablePieces, sheets: drawableSheets} = getDrawablePiecesAndSheets(rawPieces, rawLists)
  lists.value = drawableSheets;
  pieces.value = drawablePieces

  const rawListsIndices: number[] = [];
  store.rawLists = rawLists.map(list => {
    if (rawListsIndices.includes(list.rawListNumber)) {
      return null;
    }
    rawListsIndices.push(list.rawListNumber);
    return {index: list.rawListNumber, materialId: list.materialId, type: store.getMaterialById(list.materialId)?.type}
  }).filter(l => !!l);

}, { deep: true })


</script>

<template>
  <div class="overflow-y-auto" :style="{minWidth: `${canvasWidth}px`}">
    <v-stage
      ref="stage"
      :config="stageSize"
      @dragstart="handleDragstart"
      @dragend="handleDragend"
    >
      <v-layer ref="layer">
        <v-rect
          v-for="(item, i) in pieces"
          :key="i"
          :config="{
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
          fill: '#89b717',
          opacity: 0.8,
          draggable: true
        }"
        />
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
      </v-layer>
    </v-stage>
  </div>
</template>

<style lang="scss">

</style>
