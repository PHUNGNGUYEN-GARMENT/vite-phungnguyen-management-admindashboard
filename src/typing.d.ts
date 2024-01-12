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
  | 'multipleselect'

export type ItemWithKeyAndTitleType = {
  key?: React.Key
  title?: string | null | React.ReactNode
  desc?: string | null | React.ReactNode
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
  email?: string | null
  fullName?: string | null
  role?: Role
  isAdmin?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id?: number
  productCode?: string | null
  quantityPO?: number | null
  dateInputNPL?: string | null
  dateOutputFCR?: string | null
  progress?: {
    sewing?: number | null
    iron?: number | null
    check?: number | null
    pack?: number | null
  }
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
}

export interface Color {
  id?: number
  name?: string | null
  hexColor?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
  orderNumber?: number | null
}

export interface ProductColor {
  id?: number
  colorID?: number | null
  productID?: number | null
  status?: ItemStatusType | null
  color?: Color
  product?: Product | null
  createdAt?: string
  updatedAt?: string
}

export interface Group {
  id?: number
  name?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
  orderNumber?: number | null
}

export interface Print {
  id?: number
  name?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
  orderNumber?: number | null
}

export interface PrintablePlace {
  id?: number
  printID?: number | null
  productID?: number | null
  status?: ItemStatusType | null
  product?: Product | null
  print?: Print | null
  createdAt?: string
  updatedAt?: string
}

export interface ProductGroup {
  id?: number
  groupID?: number | null
  productID?: number | null
  name?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
  product?: Product | null
  group?: Group | null
}

export interface GarmentAccessory {
  id?: number
  productID?: number | null
  amountCutting?: number | null
  passingDeliveryDate?: string | null
  status?: ItemStatusType | null
  syncStatus?: boolean | null
  product?: Product | null
  createdAt?: string
  updatedAt?: string
}

export interface AccessoryNote {
  id?: number
  title?: string | null
  summary?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
}

export interface GarmentAccessoryNote {
  id?: number
  productID?: number | null
  product?: Product | null
  accessoryNoteID?: number | null
  accessoryNote?: AccessoryNote
  garmentAccessoryID?: number | null
  garmentAccessory?: GarmentAccessory | null
  noteStatus?: NoteItemStatusType | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
}

export interface Importation {
  id?: number
  productID?: number | null
  quantity?: number | null
  status?: ItemStatusType | null
  dateImported?: string | null
  product?: Product | null
  createdAt?: string
  updatedAt?: string
}

export type SampleSewing = {
  id?: number
  productID?: number | null
  dateSubmissionNPL?: string | null
  dateApprovalSO?: string | null
  dateApprovalPP?: string | null
  dateSubmissionFirstTime?: string | null
  dateSubmissionSecondTime?: string | null
  dateSubmissionThirdTime?: string | null
  dateSubmissionForthTime?: string | null
  dateSubmissionFifthTime?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
  product?: Product | null
}

export interface DateSendSampleSewing {
  dateSampleSewingID: number
  productID: number
  dateSend: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export interface CuttingGroup {
  id?: number
  productID?: number | null
  quantityRealCut?: number | null
  timeCut?: string | null
  dateSendEmbroidered?: string | null
  quantityArrivedEmbroidered?: number | null
  quantityDeliveredBTP?: number | null
  status?: ItemStatusType
  dateArrived1Th?: string | null
  quantityArrived1Th?: number | null
  dateArrived2Th?: string | null
  quantityArrived2Th?: number | null
  dateArrived3Th?: string | null
  quantityArrived3Th?: number | null
  dateArrived4Th?: string | null
  quantityArrived4Th?: number | null
  dateArrived5Th?: string | null
  quantityArrived5Th?: number | null
  dateArrived6Th?: string | null
  quantityArrived6Th?: number | null
  dateArrived7Th?: string | null
  quantityArrived7Th?: number | null
  dateArrived8Th?: string | null
  quantityArrived8Th?: number | null
  dateArrived9Th?: string | null
  quantityArrived9Th?: number | null
  dateArrived10Th?: string | null
  quantityArrived10Th?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface EmbroideredDelivery {
  embroideredDeliveryID: number
  productID: number
  quantitySewingOut: number
  dateExpectedCompletion: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export interface SewingLineDelivery {
  id?: number
  productID?: number | null
  sewingLineID?: number | null
  quantityOriginal?: number | null
  quantitySewed?: number | null
  expiredDate?: string | null
  status?: ItemStatusType | null
  product?: Product | null
  sewingLine?: SewingLine | null
}

export interface SewingLine {
  id?: number
  name?: string | null
  status?: ItemStatusType | null
  createdAt?: string
  updatedAt?: string
}
