import { ProductColor } from "~/typing"

export type ProductTableDataType = {
  key?: React.Key
  productCode?: string
  quantityPO?: number
  dateInputNPL?: string
  dateOutputFCR?: string
  productColor?: ProductColor
  progress?: {
    sewing?: number
    iron?: number
    check?: number
    pack?: number
  }
  createdAt?: string
  updatedAt?: string
}
