export type Product = {
  productID?: number
  productCode: string
  quantityPO: number
  dateInputNPL: string
  dateOutputFCR: string
  placePrintIn: string
  createdAt: string
  updatedAt: string
}

export type Color = {
  colorID: number
  nameColor: string
  rgbColor: string
  hexColor: string
  cmykColor: string
  hsvColor: string
  hslColor: string
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
