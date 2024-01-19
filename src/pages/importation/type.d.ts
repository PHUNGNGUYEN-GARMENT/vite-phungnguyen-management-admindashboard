import { Importation, Product, ProductColor } from '~/typing'

export interface ImportationTableDataType extends Product {
  key: React.Key
  productColor: ProductColor
  importation: Importation
}
