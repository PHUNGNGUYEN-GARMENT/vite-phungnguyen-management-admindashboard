import { Form } from 'antd'
import React, { useState } from 'react'
import { TableListDataType } from '~/typing'

export default function useTable<T>(initData: TableListDataType<T>[]) {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<TableListDataType<T>[]>(initData)
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const isEditing = (key: React.Key) => key === editingKey
  const isDelete = (key: React.Key) => key === deleteKey

  // Add row
  async function handleStartAddNew(item: TableListDataType<T>) {
    const newData = [...dataSource]
    newData.push(item)
    setDataSource(newData)
  }

  // Edit row
  function handleStartEditing(record: Partial<T> & { key?: React.Key }) {
    // Can using record to set default value form editing..
    setEditingKey(record.key!)
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
  async function handleStartSaveEditing(
    key: React.Key,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave?: (row: any) => void
  ) {
    try {
      const row = await form.validateFields()

      const newData = [...dataSource]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        onSave?.(row)
        setDataSource(newData)
        setEditingKey('')
        // After updated local data
        // We need to update on database
      } else {
        newData.push(row)
        setDataSource(newData)
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
