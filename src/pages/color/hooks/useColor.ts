import { useState } from 'react'

export const useColor = () => {
  const [nameColor, setNameColor] = useState<string>('')
  const [hexColor, setHexColor] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)

  return {
    nameColor,
    setNameColor,
    hexColor,
    setHexColor,
    openModal,
    setOpenModal
  }
}
