import React, { useState } from 'react'
import { ResponseDataType } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import { Product } from '~/typing'

export default function useProductList() {
  const [metaData, setMetaData] = useState<ResponseDataType>()
  const [dataSource, setDataSource] = useState<Product[]>([])
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')

  const requestListData = (
    current?: number,
    pageSize?: number,
    setLoading?: (enable: boolean) => void
  ) => {
    ProductAPI.getAlls(current, pageSize)
      .then((data) => {
        setMetaData(data)
        setLoading?.(true)
        if (data?.success) {
          console.log(data)
          setDataSource(
            data.data.map((item: Product) => {
              return { ...item, key: item.id } as Product
            })
          )
        }
      })
      .finally(() => {
        setLoading?.(false)
      })
  }

  const handleEdit = (record: Partial<Product> & { key: React.Key }) => {
    setEditingKey(record.key)
  }

  const handleDelete = (record: Product) => {
    setDeleteKey(record.id ?? '')
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

  const handleSaveEditing = async (
    key: React.Key,
    setLoading: (status: boolean) => void
  ) => {}

  const handleDeleteRow = (key: React.Key) => {}

  const handleAddNewItemData = (product: Product) => {}

  return {
    requestListData,
    metaData,
    setMetaData,
    editingKey,
    setEditingKey,
    deleteKey,
    setDeleteKey,
    dataSource,
    setDataSource,
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
