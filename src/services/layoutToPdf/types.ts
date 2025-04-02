export type TOrderPdfData = {
  title: string
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
  }
  result: {
    cuttingLength: number
    edgeThickLength: number
    edgeThinLength: number
    slotsLength: number
    sheetsCount: number
    sheetsTotalArea: number
    residuesTotalArea: number
    junkTotalValue: number
  }
}
