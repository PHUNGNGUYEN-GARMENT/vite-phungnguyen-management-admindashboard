import { ItemStatusType } from '~/typing'

export type SewingLineTableDataType = {
  key?: React.Key
  id?: number | undefined
  sewingLineName?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}
