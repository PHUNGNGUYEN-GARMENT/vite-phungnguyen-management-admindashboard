export type Role =
  | 'admin'
  | 'importation' // Xuất nhập khẩu
  | 'sample_sewing' // May mẫu
  | 'fabric_warehouse' // Kho vải
  | 'accessories_warehouse' // Kho phụ liệu
  | 'cutting' // Tổ cắt
  | 'embroidered_delivery' // Chuyền may

export type StatusType = 'normal' | 'warn' | 'error' | 'success'

export type SortDirection = 'asc' | 'desc'

export type ItemStatusType =
  | 'draft'
  | 'active'
  | 'closed'
  | 'archived'
  | 'deleted'

export type StepRound = {
  name: string
  type: StatusType
}

export type StepRound = {
  name: string
  type: StatusType
}

export type TableListDataType<T> = {
  key: React.Key
  data: T
}

export type User = {
  id?: number
  email?: string
  fullName?: string
  role?: Role
  isAdmin?: boolean
  createdAt?: string
  updatedAt?: string
}

export type Product = {
  id?: number
  productCode?: string
  quantityPO?: number
  dateInputNPL?: string
  dateOutputFCR?: string
  progress?: {
    sewing?: number
    iron?: number
    check?: number
    pack?: number
  }
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

export type Color = {
  id?: number
  nameColor?: string
  hexColor?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}

export type ProductColor = {
  id?: number
  colorID?: number
  productID?: number
  status?: ItemStatusType
  color?: Color
  product?: Product
  createdAt?: string
  updatedAt?: string
}

export type Group = {
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}

export type Print = {
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}

export type PrintablePlace = {
  id?: number
  printID?: number
  productID?: number
  name?: string
  status?: ItemStatusType
  product?: Product
  print?: Print
}

export type ProductGroup = {
  id?: number
  groupID?: number
  productID?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  product?: Product
  group?: Group
}

export type GarmentAccessory = {
  id?: number
  productID?: number
  accessoryNoteIDs?: number[]
  cuttingAccessoryDate?: string
  amountCuttingAccessory?: number
  status?: ItemStatusType
  product?: Product
  accessoryNotes?: AccessoryNote[]
}

export type AccessoryNote = {
  id?: number
  title?: string
  summary?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

export type Importation = {
  id?: number
  productID?: number
  quantity?: number
  status?: ItemStatusType
  dateImported?: string
  product?: Product
  createdAt?: string
  updatedAt?: string
}

export type SampleSewing = {
  sampleSewingID: number
  productID: number
  dateSewingNPL: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type DateSendSampleSewing = {
  dateSampleSewingID: number
  productID: number
  dateSend: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type CuttingGroup = {
  productID: number
  quantityRealCut: number
  amountRemaining: number
  dateSendEmbroideredPrint: string
  quantityEmbroideredPrintArrived: number
  quantityDeliveredBTP: number
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type EmbroideredDelivery = {
  embroideredDeliveryID: number
  productID: number
  quantitySewingOut: number
  dateExpectedCompletion: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type SewingLineDelivery = {
  id?: number
  productID?: number
  sewingLineID?: number
  quantityOrigin?: number
  quantitySewed?: number
  expiredDate?: string
  status?: ItemStatusType
  product?: Product
  sewingLine?: SewingLine
}

export type SewingLine = {
  id?: number
  sewingLine?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}
