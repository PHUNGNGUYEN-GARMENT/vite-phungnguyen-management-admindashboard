import { Form } from 'antd'
import { useState } from 'react'
import { TableItemWithKey } from './useTable'

export default function useList<T extends { key?: React.Key }>(
  initValue: TableItemWithKey<T>[]
) {
  const [form] = Form.useForm<T>()
  const [dataSource, setDataSource] = useState<TableItemWithKey<T>[]>(initValue)
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const isEditing = (key: React.Key) => key === editingKey
  const isDelete = (key: React.Key) => key === deleteKey

  const handleStartEditing = (key: React.Key) => {
    setEditingKey(key)
  }

  const handleStartDeleting = (
    key: React.Key,
    onSuccess: (row: TableItemWithKey<T>) => void
  ) => {
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      const dataSourceRemovedItem = dataSource.filter(
        (item) => item.key !== key
      )
      setDataSource(dataSourceRemovedItem)
      onSuccess(itemFound)
    }
  }

  const handleConfirmCancelEditing = () => {
    setEditingKey('')
  }

  const handleConfirmCancelDeleting = () => {
    setDeleteKey('')
  }

  const handleStartSaveEditing = async (
    key: React.Key,
    itemToUpdate: T,
    onSuccess?: (row: T) => void
  ) => {
    try {
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
        onSuccess?.(itemToUpdate)
        // After updated local data
        // We need to update on database
      } else {
        newData.push(itemToUpdate)
        setDataSource(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
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
    setDeleteKey,
    editingKey,
    setEditingKey,
    dataSource,
    setDataSource,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleStartSaveEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  }
}
