import type {TCuttingPiece} from "@/stores/useCuttingStore.ts";
import {ELayoutMethod} from "@/stores/useCuttingStore.ts";

export type TOrderPdfData = {
  title: string
  client?: string
  manager?: string
  materialName: string
  sheet: {
    width: number
    height: number
    thickness: number
    padding: number
    diskThickness: number
    area: number
  }
  details: {
    count: number
    area: number
  },
  edges: {
    edgeThinWidth: number
    edgeThickWidth: number
  },
  result: {
    cuttingLength: number
    edgeThickLength: number
    edgeThinLength: number
    slotsLength: number
    sheetsCount: number
    sheetsTotalArea: number
    residuesTotalArea: number
    junkTotalValue: number
  },
  pieces: TCuttingPiece[],
  layoutMethod: ELayoutMethod
}
