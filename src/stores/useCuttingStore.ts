import {defineStore} from "pinia";

export type TCuttingPiece = {
  name: string | null
  width: number | null
  height: number | null
  count: number | null
  rotatable: boolean
  sizeWithEdges: boolean
  edges: {
    width: number[]
    height: number[]
  }
  slots: {
    width: number[]
    height: number[]
  }
  materialName?: string
}

type TRawList = {
  index: number
  materialId: number,
  type: string
}

export type TMaterial = {
  title: string,
  // thickness: number,
  // width: number,
  // length: number
}

export type TRawSheetSettings = {
  sheetHeight: number,
  sheetWidth: number,
  sheetThickness: number,
  padding: number,
  sawDiskWidth: number
}

export type TSlotSettings = {
  offset: number,
  depth: number,
  width: number
}

export const listOptions: TMaterial[] = [];

export enum ELayoutMethod {
  HORIZONTAL,
  VERTICAL
}

export const useCuttingStore = defineStore('cutting', {
  state: () => ({
    pieces: [] as TCuttingPiece[],
    layoutMethod: ELayoutMethod.HORIZONTAL as ELayoutMethod,
    materials: listOptions,
    rawLists: [{}] as TRawList[],
    totalSheetsCount: 0,
    cuttingLength: 0,
    projectDetails: {
      title: '',
      client: '',
      manager: ''
    },
    slotSettings: {
      offset: 15,
      depth: 8,
      width: 4
    } as TSlotSettings,
    edgeSettings: {
      edgeThickWidth: 2,
      edgeThinWidth: 0.8
    },
    rawSheetSettings: {
      sheetHeight: 2070,
      sheetWidth: 2800,
      sheetThickness: 16,
      padding: 10,
      sawDiskWidth: 4
    } as TRawSheetSettings
  }),
  getters: {
    rawSizes: (state) => state.pieces.map(p => [...Array(p.count).fill({ w: p.width, l: p.height, rot: p.rotatable})]),
    getMaterialById: (state) => (id: number|undefined) => {
      return (id || (id === 0)) ? state.materials?.[id] : null
    },
    rawSheetArea: (state) => state.rawSheetSettings.sheetHeight * state.rawSheetSettings.sheetWidth / 1e6,
  },
  actions: {
    addNewPiece() {
      const lastPiece = this.pieces[this.pieces.length-1]
      this.pieces.push({
        name: '',
        width: null,
        height: null,
        count: 1,
        rotatable: true,
        sizeWithEdges: true,
        edges: {
          width: [0,0],
          height: [0,0]
        },
        slots: {
          width: [0,0],
          height: [0,0]
        },
        materialName: lastPiece?.materialName ?? ''
      })
    },
    loadPieces() {
      this.pieces = JSON.parse(localStorage.getItem('pieces') ?? '[]')
    },
    loadSettings() {
      this.layoutMethod = Number(localStorage.getItem('layoutMethod') ?? '1')
      this.rawSheetSettings = JSON.parse(localStorage.getItem('rawSheetSettings') ?? JSON.stringify(this.rawSheetSettings))
    },
    saveSettings() {
      localStorage.setItem('layoutMethod', JSON.stringify(this.layoutMethod))
      localStorage.setItem('rawSheetSettings', JSON.stringify(this.rawSheetSettings))
    },
    loadMaterials() {
      this.materials = JSON.parse(localStorage.getItem('materials') ?? '[]')
    },
    saveMaterials() {
      localStorage.setItem('materials', JSON.stringify(this.materials))
    },
    addMaterial(material: TMaterial) {
      this.materials.push(material)
      this.saveMaterials();
    }
  }
})
