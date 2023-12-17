import { Form } from 'antd'
import { Color as AntColor } from 'antd/es/color-picker'
import { useState } from 'react'
import { Color } from '~/typing'

export default function useColorList() {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<Color[]>([])
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

  const handleStartDelete = (key: React.Key, onSuccess: (data: Color) => void) => {
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

  const handleStartSaveEditing = async (key: React.Key, onSuccess: (data: Color) => void) => {
    try {
      const hexColor: AntColor = await form.getFieldValue(`hexColor/${key}`)
      const name: string = await form.getFieldValue(`name/${key}`)
      const row: Color = { name, hexColor: hexColor.toHexString() }
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

  const handleAddNewItemData = (Color: Color) => {
    console.log('Handle AddNewItem, ', Color)
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
