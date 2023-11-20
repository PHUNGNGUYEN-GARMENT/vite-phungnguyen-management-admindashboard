import { useState } from 'react'

export default function useColor() {
  const [nameColor, setNameColor] = useState<string>('White')
  const [hexColor, setHexColor] = useState<string>('#ffffff')
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
