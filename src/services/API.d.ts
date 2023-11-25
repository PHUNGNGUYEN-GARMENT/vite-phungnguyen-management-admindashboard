declare namespace API {
  // Basic user information
  export type ProductInfoItem = {
    productID: number
    productCode: string
    quantityPO: number
    progress: StepRound[]
    state: string
    dateInputNPL: string
    dateOutputFCR: string
    createdAt: string
    updatedAt: string
  }
}
