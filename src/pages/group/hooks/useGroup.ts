import { useState } from 'react'

export default function useGroup() {
  const [name, setName] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)

  return {
    name,
    setName,
    openModal,
    setOpenModal
  }
}
