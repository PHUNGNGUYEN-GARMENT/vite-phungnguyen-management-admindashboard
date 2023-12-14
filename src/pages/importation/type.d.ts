import { Importation, ItemStatusType, Product } from '~/typing'

// Mix between Product and Importation
export type ImportationTableDataType = {
  id?: number
  key?: React.Key
  productID?: number
  product?: Product
  productCode?: string
  quantityPO?: number
  dateInputNPL?: string
  dateOutputFCR?: string
  importation?: Importation
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}
