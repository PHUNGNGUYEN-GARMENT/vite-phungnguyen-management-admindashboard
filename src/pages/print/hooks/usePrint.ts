import { useState } from 'react'

export default function usePrint() {
  const [name, setName] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)

  return {
    name,
    setName,
    openModal,
    setOpenModal
  }
}
