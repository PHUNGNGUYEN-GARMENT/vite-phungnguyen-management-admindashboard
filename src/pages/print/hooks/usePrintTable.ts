import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import { Print } from '~/typing'
import { PrintTableDataType } from '../PrintPage'
import PrintAPI from '../api/PrintAPI'

export default function usePrintTable() {
  const [form] = useForm()
  const [dataSource, setDataSource] = useState<PrintTableDataType[]>([])
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    PrintAPI.getAlls().then((meta) => {
      const data = meta?.data as Print[]
      const items: PrintTableDataType[] = data.map((item) => {
        return { ...item, key: item.printID }
      })
      console.log(items)
      setDataSource(items)
    })
  }, [])

  const isEditing = (record: PrintTableDataType) => record.key === editingKey
  const isDelete = (record: PrintTableDataType) => record.key === deleteKey

  const handleEdit = (record: Partial<PrintTableDataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', createdAt: '', updatedAt: '', ...record })
    setEditingKey(record.key)
  }

  const handleDelete = (record: PrintTableDataType) => {
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
      const row = (await form.validateFields()) as PrintTableDataType

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

        await PrintAPI.updateItem(row)
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
      PrintAPI.deleteItem(itemFound.printID).then(() => {
        const dataSourceRemovedItem = dataSource.filter((item) => item.printID !== key)
        setDataSource(dataSourceRemovedItem)
      })
    }
  }

  const handleAddNewItemData = (name: string) => {
    PrintAPI.createNew(name)
      .then((meta) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setLoading(true)
        const data = meta?.data as Print
        const item: PrintTableDataType = { ...data, key: data.printID }
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
