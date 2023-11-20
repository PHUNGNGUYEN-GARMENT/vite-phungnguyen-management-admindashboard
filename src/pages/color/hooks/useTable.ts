import { Form } from 'antd'
import React, { useEffect, useState } from 'react'
import ColorAPI from '~/services/api/services/ColorAPI'
import { Color } from '~/typing'
import { ColorTableDataType } from '../components/TableColorPage'

export function useTable() {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<ColorTableDataType[]>([])
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    ColorAPI.getAllColors().then((meta) => {
      const data = meta?.data as Color[]
      if (data.length > 0) {
        setDataSource(
          data.map((item) => {
            return { ...item, key: item.colorID }
          }) as ColorTableDataType[]
        )
      }
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

  return {
    form,
    editingKey,
    deleteKey,
    dataSource,
    setDataSource,
    loading,
    isEditing,
    isDelete,
    setLoading,
    handleEdit,
    handleDelete,
    handleCancelEditing,
    handleLoadingChange,
    handleSaveEditing,
    handleDeleteRow,
    handleCancelConfirmEditing,
    handleCancelConfirmDelete
  }
}
