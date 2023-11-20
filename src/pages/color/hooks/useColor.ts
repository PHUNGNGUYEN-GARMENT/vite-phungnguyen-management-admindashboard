import { useEffect, useState } from 'react'

export const useColor = () => {
  const [nameColor, setNameColor] = useState<string>('White')
  const [hexColor, setHexColor] = useState<string>('#ffffff')
  const [openModal, setOpenModal] = useState<boolean>(false)

  useEffect(() => {
    console.log(`Name color: ${nameColor} - Hex color: ${hexColor}`)
  }, [nameColor, hexColor])

  return {
    nameColor,
    setNameColor,
    hexColor,
    setHexColor,
    openModal,
    setOpenModal
  }
}
