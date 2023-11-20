import React from 'react'
import { create } from 'zustand'
import ColorAPI from '~/services/api/services/ColorAPI'
import { ColorTableDataType } from '../ColorPage'

interface TableState {
  dataSource: ColorTableDataType[]
  editingKey: React.Key
  deleteKey: React.Key
  loading: boolean
  setLoading: (status: boolean) => void
  isEditing: (record: ColorTableDataType) => boolean
  isDelete: (record: ColorTableDataType) => boolean
  setDataSource: (data: ColorTableDataType[]) => void
  setEditingKey: (key: React.Key) => void
  handleEdit: (record: Partial<ColorTableDataType> & { key: React.Key }) => void
  handleDelete: (record: ColorTableDataType) => void
  handleCancelEditing: () => void
  handleCancelConfirmEditing: () => void
  handleCancelConfirmDelete: () => void
  handleLoadingChange: (enable: boolean) => void
  handleDeleteRow: (key: React.Key) => void
  handleAdd: (item: ColorTableDataType) => void
}

export const useTable2 = create<TableState>()((set, get) => ({
  dataSource: [],
  editingKey: '',
  deleteKey: '',
  loading: false,
  setLoading: (status: boolean) => set(() => ({ loading: status })),
  isEditing: (record: ColorTableDataType): boolean => {
    const { editingKey } = get()
    return record.key === editingKey
  },
  isDelete: (record: ColorTableDataType): boolean => {
    const { deleteKey } = get()
    return record.key === deleteKey
  },
  setDataSource: (data: ColorTableDataType[]) => set(() => ({ dataSource: data })),
  setEditingKey: (key: React.Key) => set(() => ({ editingKey: key })),
  handleEdit: (record: Partial<ColorTableDataType> & { key: React.Key }) => {
    // const { form } = get()
    // form.setFieldsValue({ nameColor: '', hexColor: '', createdAt: '', updatedAt: '', ...record })
    set({
      editingKey: record.key
    })
  },
  handleDelete: (record: ColorTableDataType) => set(() => ({ deleteKey: record.key })),
  handleCancelEditing: () => set(() => ({ editingKey: '' })),
  handleCancelConfirmEditing: () => set(() => ({ editingKey: '' })),
  handleCancelConfirmDelete: () => set(() => ({ deleteKey: '' })),
  handleLoadingChange: (enable: boolean) => set(() => ({ loading: enable })),
  handleDeleteRow: (key: React.Key) => {
    const { dataSource } = get()
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      ColorAPI.deleteItem(itemFound.colorID).then(() => {
        const dataSourceRemovedItem = dataSource.filter((item) => item.colorID !== key)
        set({
          dataSource: dataSourceRemovedItem
        })
      })
    }
  },
  handleAdd: (item: ColorTableDataType) => set((state) => ({ dataSource: [...state.dataSource, item] }))
}))
