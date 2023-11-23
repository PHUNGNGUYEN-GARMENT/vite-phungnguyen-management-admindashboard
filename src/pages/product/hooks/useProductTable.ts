import { useForm } from 'antd/es/form/Form'
import React, { useState } from 'react'
import { Product } from '~/typing'
import ProductAPI from '../../../api/services/ProductAPI'
import { ProductTableDataType } from '../ProductPage'

export default function useProductTable() {
  const [form] = useForm()
  const [dataSource, setDataSource] = useState<ProductTableDataType[]>([])
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')

  const isEditing = (record: ProductTableDataType) => record.key === editingKey
  const isDelete = (record: ProductTableDataType) => record.key === deleteKey

  const handleEdit = (record: Partial<ProductTableDataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', createdAt: '', updatedAt: '', ...record })
    setEditingKey(record.key)
  }

  const handleDelete = (record: ProductTableDataType) => {
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

  const handleSaveEditing = async (key: React.Key, setLoading: (status: boolean) => void) => {
    try {
      const row = (await form.validateFields()) as ProductTableDataType

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
        await ProductAPI.updateItem(row)
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
      ProductAPI.deleteItem(itemFound.productID).then(() => {
        const dataSourceRemovedItem = dataSource.filter((item) => item.productID !== key)
        setDataSource(dataSourceRemovedItem)
      })
    }
  }

  const handleAddNewItemData = (product: Product) => {
    console.log('Handle AddNewItem, ', product)
    // ProductAPI.createNew(product)
    //   .then((meta) => {
    //     setLoading(true)
    //     const data = meta?.data as Product
    //     const item: ProductTableDataType = { ...data, key: data.productID! }
    //     setDataSource([...dataSource, item])
    //   })
    //   .finally(() => {
    //     setLoading(false)
    //   })
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
    handleDelete,
    handleCancelEditing,
    handleSaveEditing,
    handleDeleteRow,
    handleCancelConfirmEditing,
    handleCancelConfirmDelete,
    handleAddNewItemData
  }
}
