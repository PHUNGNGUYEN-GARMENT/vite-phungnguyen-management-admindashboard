import { Completion, Product, ProductColor, SewingLineDelivery } from '~/typing'

export interface DashboardTableDataType extends Product {
  key?: React.Key
  productColor?: ProductColor
  sewingLineDeliveries?: SewingLineDelivery[]
  completion?: Completion
}
