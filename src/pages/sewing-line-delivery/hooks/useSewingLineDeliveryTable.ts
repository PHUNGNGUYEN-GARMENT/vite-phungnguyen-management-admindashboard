import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import { SewingLineDelivery } from '~/typing'
import { SewingLineDeliveryTableDataType } from '../SewingLineDeliveryPage'
import SewingLineDeliveryAPI from '../../../api/services/SewingLineDeliveryAPI'

export default function useSewingLineDeliveryTable() {
  const [form] = useForm()
  const [dataSource, setDataSource] = useState<
    SewingLineDeliveryTableDataType[]
  >([])
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    SewingLineDeliveryAPI.getAlls().then((meta) => {
      const data = meta?.data as SewingLineDelivery[]
      const items: SewingLineDeliveryTableDataType[] = data.map((item) => {
        return { ...item, key: item.sewingLineDeliveryID }
      })
      console.log(items)
      setDataSource(items)
    })
  }, [])

  const isEditing = (record: SewingLineDeliveryTableDataType) =>
    record.key === editingKey
  const isDelete = (record: SewingLineDeliveryTableDataType) =>
    record.key === deleteKey

  const handleEdit = (
    record: Partial<SewingLineDeliveryTableDataType> & { key: React.Key }
  ) => {
    form.setFieldsValue({ name: '', createdAt: '', updatedAt: '', ...record })
    setEditingKey(record.key)
  }

  const handleDelete = (record: SewingLineDeliveryTableDataType) => {
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
      const row =
        (await form.validateFields()) as SewingLineDeliveryTableDataType

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

        await SewingLineDeliveryAPI.updateItem(row)
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
      SewingLineDeliveryAPI.deleteItem(itemFound.sewingLineDeliveryID).then(
        () => {
          const dataSourceRemovedItem = dataSource.filter(
            (item) => item.sewingLineDeliveryID !== key
          )
          setDataSource(dataSourceRemovedItem)
        }
      )
    }
  }

  const handleAddNewItemData = (sewingLineDeliveryName: string) => {
    SewingLineDeliveryAPI.createNew(sewingLineDeliveryName)
      .then((meta) => {
        setLoading(true)
        const data = meta?.data as SewingLineDelivery
        const item: SewingLineDeliveryTableDataType = {
          ...data,
          key: data.sewingLineDeliveryID
        }
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
