import { useForm } from 'antd/es/form/Form'
import React, { useEffect, useState } from 'react'
import { Group } from '~/typing'
import { GroupTableDataType } from '../Group'
import GroupAPI from '../api/GroupAPI'

export default function useGroupTable() {
  const [form] = useForm()
  const [dataSource, setDataSource] = useState<GroupTableDataType[]>([])
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    GroupAPI.getAlls().then((meta) => {
      const data = meta?.data as Group[]
      const items: GroupTableDataType[] = data.map((item) => {
        return { ...item, key: item.groupID }
      })
      console.log(items)
      setDataSource(items)
    })
  }, [])

  const isEditing = (record: GroupTableDataType) => record.key === editingKey
  const isDelete = (record: GroupTableDataType) => record.key === deleteKey

  const handleEdit = (record: Partial<GroupTableDataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', createdAt: '', updatedAt: '', ...record })
    setEditingKey(record.key)
  }

  const handleDelete = (record: GroupTableDataType) => {
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
      const row = (await form.validateFields()) as GroupTableDataType

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

        await GroupAPI.updateItem(row)
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
      GroupAPI.deleteItem(itemFound.groupID).then(() => {
        const dataSourceRemovedItem = dataSource.filter((item) => item.groupID !== key)
        setDataSource(dataSourceRemovedItem)
      })
    }
  }

  const handleAddNewItemData = (name: string) => {
    GroupAPI.createNew(name)
      .then((meta) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setLoading(true)
        const data = meta?.data as Group
        const item: GroupTableDataType = { ...data, key: data.groupID }
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
