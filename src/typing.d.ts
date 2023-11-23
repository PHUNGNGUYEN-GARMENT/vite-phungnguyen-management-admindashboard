export type ResponseDataType = {
  isSuccess?: boolean
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any
}

export type Product = {
  productID?: number
  productCode?: string
  quantityPO?: number
  dateInputNPL?: date
  dateOutputFCR?: date
  createdAt?: date
  updatedAt?: date
}

export type Color = {
  colorID: number
  nameColor: string
  hexColor: string
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type ProductColor = {
  colorID: number
  productID: number
  createdAt: string
  updatedAt: string
  orderNumber: number
}

export type Group = {
  groupID: number
  name: string
  createdAt: string
  updatedAt: string
  orderNumber: number
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
