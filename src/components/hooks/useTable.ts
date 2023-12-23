import { Form } from 'antd'
import { useState } from 'react'
import { ResponseDataType } from '~/api/client'

export type TableItemWithKey<T> = T & { key?: React.Key }
type TableItemWithId<T> = T & { id?: number }
export interface TableCellProps {
  editable?: boolean
  dataIndex: string
  required?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue?: any
}

export default function useTable<T extends { key?: React.Key }>(initValue: TableItemWithKey<T>[]) {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<TableItemWithKey<T>[]>(initValue)
  const [loading, setLoading] = useState<boolean>(false)
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const [dateCreation, setDateCreation] = useState<boolean>(false)
  const isEditing = (key: React.Key) => key === editingKey
  const isDelete = (key: React.Key) => key === deleteKey

  const handleConvertDataSource = (meta: ResponseDataType) => {
    setLoading(true)
    const items = meta.data as TableItemWithId<T>[]
    setDataSource(
      items.map((item: TableItemWithId<T>) => {
        return {
          ...item,
          key: item.id
        } as TableItemWithKey<T>
      })
    )
    setLoading(false)
  }

  const handleStartEditing = (key: React.Key) => {
    setEditingKey(key)
  }

  const handleStartDeleting = (key: React.Key, onSuccess: (itemDelete: TableItemWithKey<T>) => void) => {
    setLoading(true)
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      const dataSourceRemovedItem = dataSource.filter((item) => item.key !== key)
      setDataSource(dataSourceRemovedItem)
      onSuccess(itemFound)
    }
    setLoading(false)
  }

  const handleConfirmCancelEditing = () => {
    setEditingKey('')
  }

  const handleConfirmCancelDeleting = () => {
    setDeleteKey('')
  }

  const handleStartSaveEditing = async (key: React.Key, itemToUpdate: T, onDataSuccess?: (row: T) => void) => {
    try {
      setLoading(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newData = [...dataSource]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...itemToUpdate
        })
        setDataSource(newData)
        setEditingKey('')
        onDataSuccess?.(itemToUpdate)
        // After updated local data
        // We need to update on database
      } else {
        newData.push(itemToUpdate)
        setDataSource(newData)
        setEditingKey('')
        onDataSuccess?.(itemToUpdate)
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    } finally {
      setLoading(false)
    }
  }

  const handleStartAddNew = (item: TableItemWithKey<T>) => {
    const newDataSource = [...dataSource]
    newDataSource.unshift({
      ...item,
      key: item.key
    } as TableItemWithKey<T>)
    setDataSource(newDataSource)
  }

  return {
    form,
    isDelete,
    isEditing,
    deleteKey,
    loading,
    setLoading,
    setDeleteKey,
    editingKey,
    setEditingKey,
    dataSource,
    setDataSource,
    dateCreation,
    setDateCreation,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleStartSaveEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting,
    handleConvertDataSource
  }
}
