import { useState } from 'react'
import { Print, Product } from '~/typing'

export default function useProduct() {
  const [product, setProduct] = useState<Product>({})
  const [prints, setPrints] = useState<Print[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)

  return {
    product,
    setProduct,
    prints,
    setPrints,
    openModal,
    setOpenModal
  }
}
