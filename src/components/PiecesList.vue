<script setup lang="ts">
import { PhPlus } from "@phosphor-icons/vue";
import IDButton from "@/components/ui/IDButton.vue";
import {type TCuttingPiece, useCuttingStore} from "@/stores/useCuttingStore";
import SlotsSelectModal from "@/components/SlotsSelectModal.vue";
import PieceInput from "@/components/PieceInput.vue";
import {onMounted, ref} from "vue";

const store = useCuttingStore()

const isMaterialAddModalEnabled = ref(false);
const isSlotsSelectModalEnabled = ref(false);
const selectedPieceIndex = ref(-1)
const selectedPiece = ref<TCuttingPiece>({} as TCuttingPiece)

function copyPiece(i: number) {
  store.pieces.splice(i, 0, JSON.parse(JSON.stringify(store.pieces[i])))
}

function deletePiece(i: number) {
  store.pieces.splice(i, 1)
}

function swapDimensions(i: number) {
  const p = store.pieces[i]
  store.pieces[i] = {
    ...p,
    width: p.height,
    height: p.width,
    edges: {
      width: p.edges.height,
      height: p.edges.width
    },
    slots: {
      width: p.slots.height,
      height: p.slots.width
    }
  }
}

function openMaterialAddModal(i: number) {
  selectedPieceIndex.value = i;
  isMaterialAddModalEnabled.value = true
}

function openSlotsSelectModal(i: number) {
  selectedPiece.value = store.pieces[i];
  selectedPieceIndex.value = i;
  isSlotsSelectModalEnabled.value = true
}

function setSelectedPieceMaterial(materialId: number) {
  store.pieces[selectedPieceIndex.value].materialId = materialId;
  store.pieces[selectedPieceIndex.value].materialName = store.getMaterialById(materialId).title;
  isMaterialAddModalEnabled.value = false
}

function setSelectedPieceSlots(slots: {width: number[], height: number[]}) {
  store.pieces[selectedPieceIndex.value].slots = {
    width: [...slots.width],
    height: [...slots.height]
  };
  isSlotsSelectModalEnabled.value = false
}

onMounted(() => {
  store.loadMaterials();
})
</script>

<template>
<div class="flex flex-col gap-2">
  <PieceInput
    v-for="(piece, i) in store.pieces"
    :key="i"
    :piece="piece"
    :piece-index="i"
    @copy="() => copyPiece(i)"
    @delete="() => deletePiece(i)"
    @open-material-add-modal="() => openMaterialAddModal(i)"
    @open-slots-select-modal="() => openSlotsSelectModal(i)"
    @swap-dimensions="() => swapDimensions(i)"
  />
  <IDButton
    @click="store.addNewPiece"
    class="w-full flex flex-row items-center gap-2 justify-center"
    variant="outline"
  >
    <PhPlus size="32" />
    Добавить деталь
  </IDButton>
  <MaterialAddModal v-model="isMaterialAddModalEnabled" />
  <SlotsSelectModal :selected-piece="selectedPiece" v-model="isSlotsSelectModalEnabled" @setSlots="setSelectedPieceSlots" />
</div>
</template>

<style lang="scss">

</style>
