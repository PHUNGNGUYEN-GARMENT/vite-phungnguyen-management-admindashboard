export type Role =
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
  colorID: number
  productID: number
  createdAt: string
  updatedAt: string
  orderNumber: number
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
  printID: number
  name: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type PrintablePlace = {
  printID: number
  productID: number
  name: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type ProductGroup = {
  groupID: number
  productID: number
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type GarmentAccessoryNote = {
  accessoryNoteID: number
  title: string
  summary: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type GarmentAccessory = {
  garmentAccessoryID: number
  productID: number
  notesOther: string
  amountCuttingAccessory: string
  dateDeliveryChain: string
  syncGarmentAccessoryState: boolean
  syncPackageAccessoryState: boolean
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type NotionAccessory = {
  accessoryNoteID: number
  garmentAccessoryID: number
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type Importation = {
  importationID: number
  productID: number
  dateImported: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type ImportedLot = {
  productID: number
  importationID: number
  quantity: number
  unit: string
  createdAt: string
  updatedAt: string
  orderNumber: number
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

export type EmbroideredSewingLineDelivery = {
  embroideredDeliveryID: number
  sewingLineDeliveryID: number
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type SewingLineDelivery = {
  sewingLineDeliveryID: number
  sewingLine: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}
