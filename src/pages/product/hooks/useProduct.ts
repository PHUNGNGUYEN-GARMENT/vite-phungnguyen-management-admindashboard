import { useState } from 'react'
import { Print, PrintablePlace, Product } from '~/typing'

export default function useProduct() {
  const [products, setProducts] = useState<Product[]>([])
  const [printablePlaces, setPrintablePlaces] = useState<PrintablePlace[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [expandedDate, setExpandedDate] = useState<boolean>(true)

  const getNameOfPrints = (
    printIDs: string[],
    compareArr: PrintablePlace[]
  ): string[] => {
    const items = compareArr.filter((item) =>
      printIDs.includes(`${item.printID}`)
    )
    return items.map((item) => {
      return item.name
    })
  }

  return {
    expandedDate,
    setExpandedDate,
    products,
    setProducts,
    printablePlaces,
    setPrintablePlaces,
    loading,
    setLoading,
    openModal,
    setOpenModal,
    getNameOfPrints
  }
}
