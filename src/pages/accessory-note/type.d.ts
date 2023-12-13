import { ItemStatusType } from '~/typing'

export type AccessoryNoteTableDataType = {
  key?: React.Key
  id?: number
  title?: string
  summary?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}
