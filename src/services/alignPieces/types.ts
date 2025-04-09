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
