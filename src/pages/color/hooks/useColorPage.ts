import { create } from 'zustand'

interface ColorsState {
  nameColor: string
  hexColor: string
  openModal: boolean
  setNameColor: (nameColor: string) => void
  setHexColor: (hexColor: string) => void
  setOpenModal: (status: boolean) => void
}

export const useColorPage = create<ColorsState>()((set) => ({
  nameColor: '',
  hexColor: '#ffffff',
  openModal: false,
  setNameColor: (nameColor: string) => set(() => ({ nameColor: nameColor })),
  setHexColor: (hexColor: string) => set(() => ({ hexColor: hexColor })),
  setOpenModal: (status: boolean) => set(() => ({ openModal: status }))
}))
