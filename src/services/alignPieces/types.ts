export type TCuttingPiece = {
  name: string | null
  width: number
  height: number
  count: number
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
  materialId?: number,
  type: string
}

export type TMaterial = {
  id: number,
  title: string,
  price: number,
  area?: number,
  texture_url: string,
  thickness: number,
  manufacturer: string,
  manufacturer_code: string,
  color: string,
  type: string
  is_available: boolean
  slug: string
}