import { ItemStatusType } from '~/typing'

export type GroupTableDataType = {
  key?: React.Key
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}