import { ItemStatusType } from '~/typing'

export type SewingLineTableDataType = {
  key?: React.Key
  id?: number
  sewingLineName?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}
