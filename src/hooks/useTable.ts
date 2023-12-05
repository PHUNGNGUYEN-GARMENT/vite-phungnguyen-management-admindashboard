import { Form } from 'antd'
import React, { useState } from 'react'

export type TableDataType<T> = {
  key: React.Key
  data: T
}

export default function useTable<T>(initData: TableDataType<T>[]) {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<TableDataType<T>[]>(initData)
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')

  const isEditing = (key: React.Key) => key === editingKey

  const isDisableEditing: boolean = editingKey !== ''

  const isDisableDeleting: boolean = deleteKey !== ''

  const isDelete = (key: React.Key) => key === deleteKey

  // Add row
  async function handleAddRow(item: TableDataType<T>) {
    const newData = [...dataSource]
    newData.push(item)
    setDataSource(newData)
  }

  // Delete row
  function handleStartDeleteRow(key: React.Key) {
    setDeleteKey(key)
  }

  // Delete row
  function handleDeleteRow(
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
  function handleCancelDeleteRow() {
    setDeleteKey('')
  }

  // Edit row
  function handleStartEditingRow(record: Partial<T> & { key?: React.Key }) {
    // Can using record to set default value form editing..
    setEditingKey(record.key!)
  }

  // Confirm cancel editing row
  function handleCancelEditingRow() {
    setEditingKey('')
  }

  // Save editing row
  async function handleStartSaveEditingRow(
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
    isDisableEditing,
    isDisableDeleting,
    isDelete,
    editingKey,
    deleteKey,
    dataSource,
    setDataSource,
    handleAddRow,
    handleStartEditingRow,
    handleCancelEditingRow,
    handleDeleteRow,
    handleStartDeleteRow,
    handleCancelDeleteRow,
    handleStartSaveEditingRow
  }
}
