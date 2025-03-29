<script setup lang="ts">
import { vMaska } from "maska/vue"

import {
  PhArrowsClockwise,
  PhArrowsLeftRight,
  PhCopy,
  PhSidebarSimple,
  PhTrash,
  PhX
} from "@phosphor-icons/vue";
import EdgeSelector from "@/components/EdgeSelector.vue";
import IDTextInput from "@/components/ui/IDTextInput.vue";
import IDPopup from "@/components/ui/IDPopup.vue";
import IDButton from "@/components/ui/IDButton.vue";
import type {TCuttingPiece} from "@/stores/useCuttingStore";
import {useCuttingStore} from "@/stores/useCuttingStore";
import IDAutocomplete from "@/components/ui/IDAutocomplete.vue";

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import {computed, ref} from "vue";
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')

type TProps = {
  piece: TCuttingPiece,
  pieceIndex: number
};
const props = defineProps<TProps>();
type TEmits = {
  (e: 'openMaterialAddModal'): void
  (e: 'openSlotsSelectModal'): void
  (e: 'swapDimensions'): void
  (e: 'copy'): void
  (e: 'delete'): void
};
const emits = defineEmits<TEmits>();


const store = useCuttingStore();

const xHovered = ref(false);
const searchQuery = ref('');
const materialOptions = computed(() => store.materials
  .map((m, i) => ({ label: `${m.title} (${m.length}x${m.width}x${m.thickness})`, value: i.toString()}))
);

function openMaterialAddModal() {
  emits('openMaterialAddModal')
}

function setMaterial(value: any) {
  store.pieces[props.pieceIndex].materialId = value
}
</script>

<template>
  <div class="flex flex-col gap-2 p-4 rounded border shadow">
    <div class="flex flex-row gap-2">
      <IDTextInput
        v-model="piece.name"
        placeholder="Название (необязательно)"
        dense
      />
      <IDAutocomplete
        placeholder="Материал"
        :model-value="store.pieces[pieceIndex].materialId?.toString()"
        :options="[...materialOptions, {label: 'Добавить', value: 'add', onClick: openMaterialAddModal}]"
        :filterable="false"
        dense
        inline
        @update:modelValue="setMaterial"
        @search="searchQuery = $event"
      />
      <div class="flex flex-grow flex-col gap-2">
        <IDTextInput
          class="max-w-32"
          v-model="piece.width"
          v-maska="'####'"
          dense
          placeholder="Длина"
        />
        <div class="flex flex-row gap-2">
          <EdgeSelector
            v-model="piece.edges.width[0]"
            class="w-[50%]"
          />
          <EdgeSelector
            v-model="piece.edges.width[1]"
            class="w-[50%]"
          />
        </div>
      </div>
      <div
        @mouseenter="xHovered = true"
        @mouseleave="xHovered = false"
        class="cursor-pointer py-2 hover:text-orange-600 transition-all"
        @click="emits('swapDimensions')"
      >
        <PhArrowsLeftRight v-if="xHovered" />
        <PhX v-else />
      </div>
      <div class="flex flex-col gap-2">
        <IDTextInput
          class="max-w-32"
          v-model="piece.height"
          v-maska="'####'"
          dense
          placeholder="Ширина"
        />
        <div class="flex flex-row gap-2">
          <EdgeSelector
            v-model="piece.edges.height[0]"
            class="w-[50%]"
          />
          <EdgeSelector
            v-model="piece.edges.height[1]"
            class="w-[50%]"
          />
        </div>
      </div>
      <IDTextInput
        :model-value="piece.count"
        v-maska="'##'"
        @update:model-value="piece.count = +$event"
        placeholder="Количество"
        dense
        class="max-w-32"
      />
    </div>
    <div class="flex flex-row gap-2 mt-2 items-center">
      <IDPopup
        :text="isMobile ? '' : 'Меню выбора пазов'"
        size="sm"
      >
        <IDButton
          variant="outline"
          class="flex flex-row gap-2"
          size="sm"
          @click="() => emits('openSlotsSelectModal')"
        >
          <PhSidebarSimple
            size="20"
            class="cursor-pointer transition-all"
          />
          Пазы ({{ piece.slots.width.reduce((c, v) => c+v, 0) + piece.slots.height.reduce((c, v) => c+v, 0) }})
        </IDButton>
      </IDPopup>
      <IDPopup
        :text="`Включите, если деталь можно вращать для оптимизации раскроя. Выключите, если детали должны иметь единое направление паттерна. Сейчас ${piece.rotatable ? 'включено' : 'выключено'}`"
        size="sm"
      >
        <PhArrowsClockwise
          size="24"
          class="cursor-pointer hover:text-cyan-500 transition-all"
          :class="{'text-cyan-600': piece.rotatable}"
          @click="piece.rotatable = !piece.rotatable"
        />
      </IDPopup>
      <PhCopy
        @click="() => emits('copy')"
        class="cursor-pointer hover:text-orange-600 transition-all ml-auto"
        size="24"
      />
      <PhTrash
        @click="() => emits('delete')"
        class="cursor-pointer hover:text-red-500 transition-all"
        size="24"
      />
    </div>
  </div>
</template>

<style lang="scss">

</style>
