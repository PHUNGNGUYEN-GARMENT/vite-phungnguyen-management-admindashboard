import { Form } from 'antd'
import { useState } from 'react'
import { TableListDataType } from '~/typing'

const useList = <T>(initValue: TableListDataType<T>[]) => {
  const [form] = Form.useForm<T>()
  const [dataSource, setDataSource] =
    useState<TableListDataType<T>[]>(initValue)
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const isEditing = (key: React.Key) => key === editingKey
  const isDelete = (key: React.Key) => key === deleteKey

  const handleStartEditing = (key: React.Key) => {
    setEditingKey(key)
  }

  const handleStartDeleting = (
    key: React.Key,
    onSuccess: (data: TableListDataType<T>) => void
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess?: (row: any) => void
  ) => {
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
        onSuccess?.(row)
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

  const handleStartAddNew = (item: TableListDataType<T>) => {
    console.log('Handle AddNewItem, ', item)
  }

  return {
    form,
    isDelete,
    isEditing,
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

export default useList
