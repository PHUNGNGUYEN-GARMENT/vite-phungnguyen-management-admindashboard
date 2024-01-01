/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type ItemStatusType = 'draft' | 'active' | 'closed' | 'archived' | 'deleted'

export type NoteItemStatusType = 'lake' | 'enough' | 'arrived' | 'not_arrived'

export type InputType =
  | 'number'
  | 'text'
  | 'colorpicker'
  | 'select'
  | 'datepicker'
  | 'colorselector'
  | 'textarea'
  | 'checkbox'
  | 'noteselectmultiple'

export type ItemWithKeyAndTitleType = {
  key?: React.Key
  title?: string | React.ReactNode
  desc?: string | React.ReactNode
  editable?: boolean
  dataIndex: string
  initialField?: {
    value: any
    data?: any[]
  }
  inputType?: InputType
  responsive?: Breakpoint[]
}

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

export interface User {
  id?: number
  email?: string
  fullName?: string
  role?: Role
  isAdmin?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id?: number
  productCode?: string
  quantityPO?: number
  dateInputNPL?: string | null
  dateOutputFCR?: string | null
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

export interface Color {
  id?: number
  name?: string
  hexColor?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}

export interface ProductColor {
  id?: number
  colorID?: number
  productID?: number
  status?: ItemStatusType
  color?: Color
  product?: Product
  createdAt?: string
  updatedAt?: string
}

export interface Group {
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}

export interface Print {
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  orderNumber?: number
}

export interface PrintablePlace {
  id?: number
  printID?: number
  productID?: number
  status?: ItemStatusType
  product?: Product
  print?: Print
  createdAt?: string
  updatedAt?: string
}

export interface ProductGroup {
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

export interface GarmentAccessory {
  id?: number
  productID?: number
  amountCutting?: number
  passingDeliveryDate?: string | null
  status?: ItemStatusType
  product?: Product
  createdAt?: string
  updatedAt?: string
}

export interface AccessoryNote {
  id?: number
  title?: string
  summary?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

export interface GarmentAccessoryNote {
  id?: number
  productID?: number
  product?: Product
  accessoryNoteID?: number
  accessoryNote?: AccessoryNote
  garmentAccessoryID?: number
  garmentAccessory?: GarmentAccessory
  noteStatus?: NoteItemStatusType
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

export interface Importation {
  id?: number
  productID?: number
  quantity?: number
  status?: ItemStatusType
  dateImported?: string | null
  product?: Product
  createdAt?: string
  updatedAt?: string
}

export type SampleSewing = {
  id?: number
  productID?: number
  dateSubmissionNPL?: string | null
  dateApprovalSO?: string | null
  dateApprovalPP?: string | null
  dateSubmissionFirstTime?: string | null
  dateSubmissionSecondTime?: string | null
  dateSubmissionThirdTime?: string | null
  dateSubmissionForthTime?: string | null
  dateSubmissionFifthTime?: string | null
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
  product?: Product
}

export interface DateSendSampleSewing {
  dateSampleSewingID: number
  productID: number
  dateSend: string | null
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export interface CuttingGroup {
  productID: number
  quantityRealCut: number
  amountRemaining: number
  dateSendEmbroideredPrint: string | null
  quantityEmbroideredPrintArrived: number
  quantityDeliveredBTP: number
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export interface EmbroideredDelivery {
  embroideredDeliveryID: number
  productID: number
  quantitySewingOut: number
  dateExpectedCompletion: string | null
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export interface SewingLineDelivery {
  id?: number
  productID?: number
  sewingLineID?: number
  quantityOrigin?: number
  quantitySewed?: number
  expiredDate?: string | null
  status?: ItemStatusType
  product?: Product
  sewingLine?: SewingLine
}

export interface SewingLine {
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}
