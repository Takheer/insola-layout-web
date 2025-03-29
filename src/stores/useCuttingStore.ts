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
  materialId?: number
  materialName?: string
}

type TRawList = {
  index: number
  materialId: number,
  type: string
}

export type TMaterial = {
  title: string,
  thickness: number,
  width: number,
  length: number
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
    slotSettings: {
      offset: 15,
      depth: 8,
      width: 4
    }
  }),
  getters: {
    rawSizes: (state) => state.pieces.map(p => [...Array(p.count).fill({ w: p.width, l: p.height, rot: p.rotatable})]),
    getMaterialById: (state) => (id: number|undefined) => {
      return (id || (id === 0)) ? state.materials?.[id] : null
    }
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
        materialId: lastPiece?.materialId,
        materialName: lastPiece?.materialName ?? ''
      })
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