import { useState } from 'react'
import { PrintablePlace, Product } from '~/typing'

export default function useProduct() {
  const [products, setProducts] = useState<Product[]>([])
  const [printablePlaces, setPrintablePlaces] = useState<PrintablePlace[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  return {
    products,
    setProducts,
    printablePlaces,
    setPrintablePlaces,
    loading,
    setLoading,
    openModal,
    setOpenModal
  }
}
