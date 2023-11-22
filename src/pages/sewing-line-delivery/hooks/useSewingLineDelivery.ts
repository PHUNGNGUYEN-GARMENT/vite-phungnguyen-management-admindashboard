import { useState } from 'react'

export default function useSewingLineDelivery() {
  const [sewingLineDeliveryName, setSewingLineDeliveryName] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)

  return {
    sewingLineDeliveryName,
    setSewingLineDeliveryName,
    openModal,
    setOpenModal
  }
}
