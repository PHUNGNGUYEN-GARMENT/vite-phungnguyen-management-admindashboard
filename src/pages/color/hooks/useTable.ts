import { create } from 'zustand'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}

interface TableState {
  dataSource: DataType[]
  editingKey: React.Key
  deleteKey: React.Key
  isLoading: boolean
  setDataSource: (data: DataType[]) => void
  setEditingKey: (key: React.Key) => void
  setDeleteKey: (key: React.Key) => void
  handleEdit: (record: Partial<DataType> & { key: React.Key }) => void
  handleCancel: () => void
  handleLoadingChange: (enable: boolean) => void
  handleAdd: (item: DataType) => void
  handleDelete: (key: React.Key) => void
}

export const useTable = create<TableState>()((set) => ({
  dataSource: [],
  editingKey: '',
  deleteKey: '',
  isLoading: false,
  setDataSource: (data: DataType[]) => set(() => ({ dataSource: data })),
  setEditingKey: (key: React.Key) => set(() => ({ editingKey: key })),
  setDeleteKey: (key: React.Key) => set(() => ({ deleteKey: key })),
  handleEdit: (record: Partial<DataType> & { key: React.Key }) => set(() => ({ editingKey: record.key })),
  handleCancel: () => set(() => ({ editingKey: '' })),
  handleLoadingChange: (enable: boolean) => set(() => ({ isLoading: enable })),
  handleAdd: (item: DataType) => set((state) => ({ dataSource: [...state.dataSource, item] })),
  handleDelete: (key: React.Key) =>
    set((state) => ({ dataSource: state.dataSource.filter((item) => item.key !== key) }))
}))
