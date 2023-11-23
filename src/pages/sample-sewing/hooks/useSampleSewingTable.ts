import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import { SampleSewing } from '~/typing'
import { SampleSewingTableDataType } from '../SampleSewingPage'
import SampleSewingAPI from '../../../api/services/SampleSewingAPI'

export default function useSampleSewingTable() {
  const [form] = useForm()
  const [dataSource, setDataSource] = useState<SampleSewingTableDataType[]>([])
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    SampleSewingAPI.getAlls().then((meta) => {
      const data = meta?.data as SampleSewing[]
      const items: SampleSewingTableDataType[] = data.map((item) => {
        return { ...item, key: item.sampleSewingID }
      })
      console.log(items)
      setDataSource(items)
    })
  }, [])

  const isEditing = (record: SampleSewingTableDataType) => record.key === editingKey
  const isDelete = (record: SampleSewingTableDataType) => record.key === deleteKey

  const handleEdit = (record: Partial<SampleSewingTableDataType> & { key: React.Key }) => {
    form.setFieldsValue({ productID: '', dateSewingNPL: '', createdAt: '', updatedAt: '', ...record })
    setEditingKey(record.key)
  }

  const handleDelete = (record: SampleSewingTableDataType) => {
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
      const row = (await form.validateFields()) as SampleSewingTableDataType

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

        await SampleSewingAPI.updateItem(row)
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
      SampleSewingAPI.deleteItem(itemFound.sampleSewingID).then(() => {
        const dataSourceRemovedItem = dataSource.filter((item) => item.sampleSewingID !== key)
        setDataSource(dataSourceRemovedItem)
      })
    }
  }

  const handleAddNewItemData = (productID: number, dateSewingNPL: string) => {
    SampleSewingAPI.createNew(productID, dateSewingNPL)
      .then((meta) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setLoading(true)
        const data = meta?.data as SampleSewing
        const item: SampleSewingTableDataType = { ...data, key: data.sampleSewingID }
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
