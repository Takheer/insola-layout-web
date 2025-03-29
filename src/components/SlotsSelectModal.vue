<script setup lang="ts">
import IDModal from "@/components/ui/IDModal.vue";
import { type TCuttingPiece, useCuttingStore } from "@/stores/useCuttingStore";
import SlotSelector from "@/components/SlotSelector.vue";
import IDTextInput from "@/components/ui/IDTextInput.vue";
import { vMaska } from "maska/vue"
import {computed, nextTick, onUpdated, ref, watch} from "vue";

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')

type TEmits = {
  (e: 'setSlots', val: any): void
};

const emits = defineEmits<TEmits>();

type TProps = {
  selectedPiece?: TCuttingPiece
};
const props = defineProps<TProps>();

const store = useCuttingStore();

const pieceCanvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref(null);

const localSlots = ref({
  width: [0, 0],
  height: [0, 0]
})


const baseWidth = computed(() => isMobile.value ? 180 : 460)

const canvasHeight = computed(() => +props.selectedPiece.height > +props.selectedPiece.width ? baseWidth.value : +props.selectedPiece.height / +props.selectedPiece.width * baseWidth.value)
const canvasWidth = computed(() => +props.selectedPiece.width >= +props.selectedPiece.height ? baseWidth.value : +props.selectedPiece.width / +props.selectedPiece.height * baseWidth.value)

onUpdated(async () => {
  ctx.value = pieceCanvas.value?.getContext("2d");
  await nextTick()
  if (ctx.value) {
    await drawPiece()
  }
})

watch(() => props.selectedPiece, async () => {
  localSlots.value = {
    width: [...props.selectedPiece.slots.width],
    height: [...props.selectedPiece.slots.height],
  }
  await drawPiece()
}, { deep: true })

async function drawPiece() {
  ctx.value = pieceCanvas.value?.getContext("2d");
  await nextTick()
  if (!ctx.value) {
    return;
  }

  ctx.value.strokeStyle = 'black';
  ctx.value.fillStyle = "rgba(0, 255, 0, 0.1)";

  ctx.value.strokeRect(1, 1, canvasWidth.value-2, canvasHeight.value-2);
  ctx.value.fillRect(1, 1, canvasWidth.value-2, canvasHeight.value-2);
}

function emitNewSlots(modelValue: any) {
  if (!modelValue) {
    emits('setSlots', localSlots.value)
  }
}
</script>

<template>
  <IDModal @update:modelValue="emitNewSlots">
    <div class="bg-white rounded-xl p-4 md:p-8 flex flex-col">
      <h3 class="mb-4">Выбор пазов</h3>
      <div class="flex flex-col gap-2 px-2">
        <p>{{selectedPiece.width}}x{{selectedPiece.height}}</p>
        <div
          class="flex flex-col gap-1"
        >
          <input type="checkbox" v-model="localSlots.width[0]">
          <div class="flex flex-row gap-1">
            <input type="checkbox" v-model="localSlots.height[0]">
            <div class="relative">
              <canvas
                id="pieceCanvas"
                ref="pieceCanvas"
                :height="canvasHeight"
                :width="canvasWidth"
                :style="`width: ${canvasWidth}px; height: ${canvasHeight}px`"
              />
              <SlotSelector position="top" :size="canvasWidth" v-model="localSlots.width[0]" />
              <SlotSelector position="bottom" :size="canvasWidth" v-model="localSlots.width[1]" />
              <SlotSelector position="left" :size="canvasHeight" v-model="localSlots.height[0]" />
              <SlotSelector position="right" :size="canvasHeight" v-model="localSlots.height[1]" />
            </div>
            <input type="checkbox" v-model="localSlots.height[1]">
          </div>
          <input type="checkbox" v-model="localSlots.width[1]">
        </div>
      </div>
      <div class="flex flex-col gap-4 pt-4 pb-2">
        <IDTextInput
          dense
          label="Отступ от края, мм"
          class="flex max-w-48 w-fit grow"
          :label-class="isMobile ? 'text-xs' : 'text-sm'"
          v-model="store.slotSettings.offset"
          v-maska="'##'"
        />
        <IDTextInput
          dense
          label="Ширина, мм"
          class="flex max-w-48 w-fit grow"
          :label-class="isMobile ? 'text-xs' : 'text-sm'"
          v-model="store.slotSettings.width"
          v-maska="'##'"
        />
        <IDTextInput
          dense
          label="Глубина, мм"
          class="flex max-w-48 w-fit grow"
          :label-class="isMobile ? 'text-xs' : 'text-sm'"
          v-model="store.slotSettings.depth"
          v-maska="'##'"
        />
      </div>
    </div>
  </IDModal>
</template>

<style lang="scss">

</style>
