import { Product } from '~/typing'

export default function useProduct() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function convertToProduct(row: any): Product {
    const newRow = {
      id: row.id,
      productCode: row.productCode,
      quantityPO: row.quantityPO,
      status: [
        {
          name: 'sewing',
          type: row.check
        },
        {
          name: 'iron',
          type: row.iron
        },
        {
          name: 'check',
          type: row.check
        },
        {
          name: 'pack',
          type: row.pack
        }
      ],
      dateOutputFCR: row.dateOutputFCR
    } as Product

    return newRow
  }

  return {
    convertToProduct
  }
}
