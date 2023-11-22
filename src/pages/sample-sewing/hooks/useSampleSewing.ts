import { useState } from 'react'
import { Product } from '~/typing'

export default function useSampleSewing() {
  const [product, setProduct] = useState<Product>()
  const [dateSewingNPL, setDateSewingNPL] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)

  return {
    product,
    setProduct,
    dateSewingNPL,
    setDateSewingNPL,
    openModal,
    setOpenModal
  }
}
