<script setup lang="ts">
import {ELayoutMethod, useCuttingStore} from '@/stores/useCuttingStore';
import {alignPieces} from "@/services/alignPieces";
import {usePiecesDrawing} from "@/composables/usePiecesDrawing";
import {nextTick, onMounted, ref, watch} from "vue";

type TProps = {
  ignoreLocalStorage?: boolean
};
const props = withDefaults(defineProps<TProps>(), {
  ignoreLocalStorage: false
});

const canvas = ref<HTMLCanvasElement | null>(null);
const store = useCuttingStore();

const { ctx, clearCanvas, drawPieces, canvasHeight, canvasWidth } = usePiecesDrawing();

onMounted(async () => {
  ctx.value = canvas.value.getContext("2d");
  ctx.value.font = "12px serif";
  if (localStorage.getItem('pieces') && !props.ignoreLocalStorage) {
    store.pieces = await JSON.parse(localStorage.getItem('pieces') ?? '[]');
    for (let i = 0; i < store.pieces.length; i++) {
      if (!store.pieces[i].slots) {
        store.pieces[i].slots = { width: [0, 0], height: [0, 0]}
      }
    }
  }

  const {pieces, lists} = alignPieces(store.pieces, store.layoutMethod === ELayoutMethod.VERTICAL);

  await nextTick()
  await clearCanvas()
  drawPieces(pieces, lists);
})

watch([() => store.pieces, () => store.layoutMethod], () => {
  if (store.pieces.length) {
    localStorage.setItem('pieces', JSON.stringify(store.pieces))
  }

  const {pieces, lists} = alignPieces(store.pieces, store.layoutMethod === ELayoutMethod.VERTICAL);

  const rawListsIndices: number[] = [];
  store.rawLists = lists.map(list => {
    if (rawListsIndices.includes(list.rawListNumber)) {
      return null;
    }
    rawListsIndices.push(list.rawListNumber);
    return {index: list.rawListNumber, materialId: list.materialId, type: store.getMaterialById(list.materialId)?.type}
  }).filter(l => !!l);

  clearCanvas();
  drawPieces(pieces, lists);
}, { deep: true })


</script>

<template>
  <v-stage>

  </v-stage>
  <canvas
    id="canvas"
    ref="canvas"
    :height="canvasHeight"
    :width="canvasWidth"
    :style="`width: ${canvasWidth}px; height: ${canvasHeight}px`"
    class="mb-24"
  />
</template>

<style lang="scss">

</style>
