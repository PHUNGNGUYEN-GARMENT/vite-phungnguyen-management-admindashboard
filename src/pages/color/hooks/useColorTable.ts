import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import { Color } from '~/typing'
import { ColorTableDataType } from '../ColorPage'
import ColorAPI from '../api/ColorAPI'

export default function useColorTable() {
  const [form] = useForm()
  const [dataSource, setDataSource] = useState<ColorTableDataType[]>([])
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    ColorAPI.getAllColors().then((meta) => {
      const data = meta?.data as Color[]
      const items: ColorTableDataType[] = data.map((item) => {
        return { ...item, key: item.colorID }
      })
      console.log(items)
      setDataSource(items)
    })
  }, [])

  const isEditing = (record: ColorTableDataType) => record.key === editingKey
  const isDelete = (record: ColorTableDataType) => record.key === deleteKey

  const handleEdit = (record: Partial<ColorTableDataType> & { key: React.Key }) => {
    form.setFieldsValue({ nameColor: '', hexColor: '', createdAt: '', updatedAt: '', ...record })
    setEditingKey(record.key)
  }

  const handleDelete = (record: ColorTableDataType) => {
    setDeleteKey(record.key)
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

  const handleLoadingChange = (enable: boolean) => {
    setLoading(enable)
  }

  const handleToggleLoading = () => {
    setLoading(!loading)
  }

  const handleSaveEditing = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as ColorTableDataType

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
        await ColorAPI.updateItem(row)
          .then(() => {
            setLoading(true)
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        newData.push(row)
        setDataSource(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const handleDeleteRow = (key: React.Key) => {
    const itemFound = dataSource.find((item) => item.key === key)
    if (itemFound) {
      ColorAPI.deleteItem(itemFound.colorID).then(() => {
        const dataSourceRemovedItem = dataSource.filter((item) => item.colorID !== key)
        setDataSource(dataSourceRemovedItem)
      })
    }
  }

  const handleAddNewItemData = (nameColor: string, hexColor: string) => {
    ColorAPI.createNew(nameColor, hexColor)
      .then((meta) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setLoading(true)
        const data = meta?.data as Color
        const item: ColorTableDataType = { ...data, key: data.colorID }
        setDataSource([...dataSource, item])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return {
    form,
    editingKey,
    setEditingKey,
    deleteKey,
    setDeleteKey,
    dataSource,
    setDataSource,
    loading,
    isEditing,
    isDelete,
    setLoading,
    handleToggleLoading,
    handleEdit,
    handleDelete,
    handleCancelEditing,
    handleLoadingChange,
    handleSaveEditing,
    handleDeleteRow,
    handleCancelConfirmEditing,
    handleCancelConfirmDelete,
    handleAddNewItemData
  }
}
