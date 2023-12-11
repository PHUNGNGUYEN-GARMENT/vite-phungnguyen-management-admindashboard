import { ItemStatusType } from '~/typing'

export type SewingLineDeliveryTableDataType = {
  key?: React.Key
  id?: number | undefined
  productID?: number | undefined
  sewingLineID?: number | undefined
  quantityOrigin?: number | undefined
  quantitySewed?: number | undefined
  expiredDate?: string | undefined
  status?: ItemStatusType | undefined
  product?: Product | undefined
  sewingLine?: SewingLine | undefined
  createdAt?: string
  updatedAt?: string
}
