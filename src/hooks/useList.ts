import { Form } from 'antd'
import { useState } from 'react'

export type ListDataType<T> = {
  key: React.Key
  data: T
}

const useList = <T>(initValue: ListDataType<T>[]) => {
  const [form] = Form.useForm<T>()
  const [dataSource, setDataSource] = useState<ListDataType<T>[]>(initValue)
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const isEditing = (key: React.Key) => key === editingKey
  const isDelete = (key: React.Key) => key === deleteKey

  const handleStartEditItem = (key: React.Key) => {
    setEditingKey(key)
  }

  const handleStartDeleteItem = (
    key: React.Key,
    onSuccess: (data: ListDataType<T>) => void
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

  const handleCancelEditing = () => {
    setEditingKey('')
  }

  const handleConfirmCancelEditing = () => {
    setEditingKey('')
  }

  const handleConfirmCancelDelete = () => {
    setDeleteKey('')
  }

  const handleStartSaveEditing = async (key: React.Key) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row: any = await form.validateFields()
      const newData = [...dataSource]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
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

  const handleAddNewItemData = (item: ListDataType<T>) => {
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
    handleStartDeleteItem,
    handleStartEditItem,
    handleCancelEditing,
    handleStartSaveEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDelete,
    handleAddNewItemData
  }
}

export default useList
