import { CuttingGroup, Product, ProductColor } from '~/typing'

export interface CuttingGroupTableDataType extends Product {
  key: React.Key
  productColor: ProductColor
  cuttingGroup: CuttingGroup
}
