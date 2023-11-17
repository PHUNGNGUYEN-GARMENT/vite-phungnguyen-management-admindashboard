import { create } from 'zustand'

interface ColorsState {
  nameColor: string
  hexColor: string
  setNameColor: (nameColor: string) => void
  setHexColor: (hexColor: string) => void
}

export const useColors = create<ColorsState>()((set) => ({
  nameColor: '',
  hexColor: '#ffffff',
  setNameColor: (nameColor: string) => set(() => ({ nameColor: nameColor })),
  setHexColor: (hexColor: string) => set(() => ({ hexColor: hexColor }))
}))
