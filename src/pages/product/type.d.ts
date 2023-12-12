import { PrintablePlace, ProductColor, ProductGroup } from '~/typing'

export type ProductTableDataType = {
  key?: React.Key
  id?: number
  productCode?: string
  quantityPO?: number
  dateInputNPL?: string
  dateOutputFCR?: string
  productColor?: ProductColor
  productGroup?: ProductGroup
  printablePlace?: PrintablePlace
  progress?: {
    sewing?: number
    iron?: number
    check?: number
    pack?: number
  }
  createdAt?: string
  updatedAt?: string
}
