import { ItemStatusType } from '~/typing'

export type ColorTableDataType = {
  key?: React.Key
  id?: number
  name?: string
  hexColor?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}
