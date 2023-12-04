import { Form } from 'antd'
import { useState } from 'react'
import ProductAPI from '~/api/services/ProductAPI'
import { Product } from '~/typing'

export default function useProductList() {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<Product[]>([])
  const [editingKey, setEditingKey] = useState<React.Key>('')
  const [deleteKey, setDeleteKey] = useState<React.Key>('')
  const isEditing = (key: React.Key) => key === editingKey
  const isDelete = (key: React.Key) => key === deleteKey

  const handleEdit = (key: React.Key) => {
    setEditingKey(key)
  }

  const handleStartEditing = (key: React.Key) => {
    setEditingKey(key)
  }

  const handleDelete = (
    key: React.Key,
    setLoading: (enable: boolean) => void
  ) => {
    setLoading(true)
    const itemFound = dataSource.find((item) => item.id === key)
    if (itemFound) {
      ProductAPI.deleteItemByID(itemFound.id ?? -1)
        .then((meta) => {
          if (meta?.success) {
            const dataSourceRemovedItem = dataSource.filter(
              (item) => item.id !== key
            )
            setDataSource(dataSourceRemovedItem)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
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
    setLoading: (enable: boolean) => void
  ) => {
    try {
      const row = (await form.validateFields()) as Product
      const newData = [...dataSource]
      const index = newData.findIndex((item) => key === item.id)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        await ProductAPI.updateItemByID(Number(key), row)
          .then((meta) => {
            console.log(meta)
            setLoading(true)
          })
          .finally(() => {
            setLoading(false)
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
    handleStartEditing,
    handleCancelEditing,
    handleSaveEditing,
    handleCancelConfirmEditing,
    handleCancelConfirmDelete,
    handleAddNewItemData
  }
}
