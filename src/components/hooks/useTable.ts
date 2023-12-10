import { Form } from 'antd'
import React, { useState } from 'react'

export type TableItemWithKey<T> = T & { key?: React.Key }

export default function useTable<T extends { key?: React.Key }>(
  initData: TableItemWithKey<T>[]
) {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<TableItemWithKey<T>[]>(initData)
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const isEditing = (key: React.Key) => key === editingKey
  const isDelete = (key: React.Key) => key === deleteKey

  // Add row
  async function handleStartAddNew(item: TableItemWithKey<T>) {
    const newData = [...dataSource]
    newData.push(item)
    setDataSource(newData)
  }

  // Edit row
  function handleStartEditing(key: React.Key) {
    // Can using record to set default value form editing..
    setEditingKey(key)
  }

  const handleConfirmCancelEditing = () => {
    setEditingKey('')
  }

  // Delete row
  function handleStartDeleting(
    key: React.Key,
    onDelete?: (key: React.Key) => void
  ) {
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      const dataSourceRemovedItem = dataSource.filter(
        (item) => item.key !== key
      )
      setDataSource(dataSourceRemovedItem)
      onDelete?.(key)
    }
  }

  // Cancel delete row
  const handleConfirmCancelDeleting = () => {
    setDeleteKey('')
  }

  // Save editing row
  const handleStartSaveEditing = async (
    key: React.Key,
    itemToUpdate: TableItemWithKey<T>,
    onSuccess?: (status: boolean) => void
  ) => {
    try {
      const newData = [...dataSource]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...itemToUpdate
        })
        setDataSource(newData)
        onSuccess?.(true)
        setEditingKey('')
        // After updated local data
        // We need to update on database
      } else {
        newData.push(itemToUpdate)
        setDataSource(newData)
        onSuccess?.(false)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  return {
    form,
    isEditing,
    isDelete,
    editingKey,
    deleteKey,
    dataSource,
    setDataSource,
    setEditingKey,
    setDeleteKey,
    handleStartDeleting,
    handleStartEditing,
    handleStartSaveEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting,
    handleStartAddNew
  }
}
