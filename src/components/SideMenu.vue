<script setup lang="ts">
import IDTextInput from "@/components/ui/IDTextInput.vue";
import IDSwitch from "@/components/ui/IDSwitch.vue";
import {ELayoutMethod, useCuttingStore} from "@/stores/useCuttingStore";

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import IDButton from "@/components/ui/IDButton.vue";
import {PhFilePdf} from "@phosphor-icons/vue";
import {useLayoutToPdf} from "@/services/layoutToPdf";

const layoutToPdf = useLayoutToPdf()
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')

type TProps = {
  selectedTab: number | null
};
const props = withDefaults(defineProps<TProps>(), {
  selectedTab: null
});

const menuClass = "flex flex-col gap-2 p-1 pb-2"
const cardClass = "flex flex-col gap-2 p-4 pb-2 bg-white shadow-lg rounded-lg text-sm"

const store = useCuttingStore();

const alignmentOptions = [
  {id: ELayoutMethod.HORIZONTAL, value: 'Ширине', selected: true},
  {id: ELayoutMethod.VERTICAL, value: 'Высоте'}
];

function downloadPdf() {
  layoutToPdf({
    title: "Тестовый заказ",
    materialName: "ЛДСП 2800х2070х16 U963 чото там какой-то нежный",
    sheet: {
      width: store.rawSheetSettings.sheetWidth,
      height: store.rawSheetSettings.sheetHeight,
      thickness: store.rawSheetSettings.sheetThickness,
      padding: store.rawSheetSettings.padding,
      diskThickness: store.rawSheetSettings.padding,
      area: store.rawSheetArea
    },
    details: {
      count: store.pieces.reduce((prev, curr) => prev + (curr.count ?? 0), 0),
      area: 5.43
    },
    result: {
      cuttingLength: store.cuttingLength / 1000,
      edgeThickLength: 23,
      edgeThinLength: 32,
      slotsLength: 0,
      sheetsCount: store.totalSheetsCount,
      sheetsTotalArea: store.totalSheetsCount * store.rawSheetArea,
      residuesTotalArea: 0,
      junkTotalValue: 0
    }
  })
}
</script>

<template>
  <div
    class="flex flex-col gap-4 bg-gray-200 p-2 w-80 h-[96vh] overflow-hidden transition-all"
    v-if="selectedTab !== null"
  >
    <div class="overflow-auto">
      <div :class="menuClass" v-if="selectedTab === 0">
        <div :class="cardClass">
          <h3 class="pb-2">Метод раскроя</h3>
          Выровнять детали по
          <IDSwitch
            :options="alignmentOptions"
            @select="store.layoutMethod = $event"
          />
        </div>
        <div :class="cardClass">
          <h3 class="pb-2">Параметры листа</h3>
          Высота, мм
          <IDTextInput v-model="store.rawSheetSettings.sheetHeight" class="mb-2"/>
          Ширина, мм
          <IDTextInput v-model="store.rawSheetSettings.sheetWidth" class="mb-2" />
          Толщина, мм
          <IDTextInput v-model="store.rawSheetSettings.sheetThickness" class="mb-2" />
          Отступ от края листа, мм
          <IDTextInput v-model="store.rawSheetSettings.padding" class="mb-2" />
          Ширина реза, мм
          <IDTextInput v-model="store.rawSheetSettings.sawDiskWidth" class="mb-2" />
        </div>
      </div>
      <div :class="menuClass" v-if="selectedTab === 1">
        <div :class="cardClass">
          <div class="flex flex-col gap-1">
            Ширина, мм
            <IDTextInput v-model="store.slotSettings.width" />
          </div>
          <div class="flex flex-col gap-1">
            Глубина, мм
            <IDTextInput v-model="store.slotSettings.depth" />
          </div>
          <div class="flex flex-col gap-1">
            Отступ от края, мм
            <IDTextInput v-model="store.slotSettings.offset" />
          </div>
        </div>
      </div>
      <div :class="menuClass" v-if="selectedTab === 2">
        <IDButton
          full-width
          class="flex flex-row items-center gap-2"
          @click="downloadPdf"
        >
          <PhFilePdf size="20" />
          PDF
        </IDButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>
