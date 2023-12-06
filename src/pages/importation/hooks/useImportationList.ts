import { Form } from 'antd'
import { useState } from 'react'
import { Importation } from '~/typing'

export default function useImportationList() {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<Importation[]>([])
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const isEditing = (key: React.Key) => key === editingKey
  const isDelete = (key: React.Key) => key === deleteKey

  const handleEdit = (key: React.Key) => {
    setEditingKey(key)
  }

  const handleStartEditing = (key: React.Key) => {
    setEditingKey(key)
  }

  const handleStartDelete = (
    key: React.Key,
    onSuccess: (data: Importation) => void
  ) => {
    const itemFound = dataSource.find((item) => item.id === key)
    if (itemFound) {
      const dataSourceRemovedItem = dataSource.filter((item) => item.id !== key)
      setDataSource(dataSourceRemovedItem)
      onSuccess(itemFound)
    }
  }

  const handleCancelEditing = () => {
    setEditingKey('')
  }

  const handleCancelConfirmEditing = () => {
    setEditingKey('')
  }

  const handleCancelConfirmDelete = () => {
    setDeleteKey('')
  }

  const handleStartSaveEditing = async (
    key: React.Key,
    onSuccess: (data: Importation) => void
  ) => {
    try {
      const row: Importation = await form.validateFields()
      const newData = [...dataSource]
      const index = newData.findIndex((item) => key === item.id)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        onSuccess(row)
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

  const handleAddNewItemData = (item: Importation) => {
    console.log('Handle AddNewItem, ', item)
  }

  return {
    form,
    editingKey,
    setEditingKey,
    deleteKey,
    setDeleteKey,
    dataSource,
    setDataSource,
    isEditing,
    isDelete,
    handleEdit,
    handleStartDelete,
    handleStartEditing,
    handleCancelEditing,
    handleStartSaveEditing,
    handleCancelConfirmEditing,
    handleCancelConfirmDelete,
    handleAddNewItemData
  }
}
