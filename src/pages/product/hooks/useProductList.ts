import { useEffect, useState } from 'react'
import { ResponseDataType } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import { Product } from '~/typing'

export default function useProductList() {
  const [metaData, setMetaData] = useState<ResponseDataType>({
    success: true,
    message: 'Ok',
    data: [
      {
        id: 25,
        productCode: 'FFSO-1',
        quantityPO: 2000,
        dateInputNPL: '2023-11-08T09:15:12.000Z',
        dateOutputFCR: '2023-11-08T09:15:12.000Z',
        orderNumber: 3,
        createdAt: '2023-11-25T08:26:52.000Z',
        updatedAt: '2023-11-25T08:26:52.000Z',
        sewing: 'normal',
        iron: 'warn',
        check: 'error',
        pack: 'success'
      },
      {
        id: 26,
        productCode: 'FFSO-3',
        quantityPO: 3000,
        dateInputNPL: '2023-11-08T09:15:12.000Z',
        dateOutputFCR: '2023-11-08T09:15:12.000Z',
        orderNumber: 4,
        createdAt: '2023-11-25T08:26:58.000Z',
        updatedAt: '2023-11-25T08:26:58.000Z',
        sewing: 'normal',
        iron: 'warn',
        check: 'error',
        pack: 'success'
      },
      {
        id: 27,
        productCode: 'FFSO-4',
        quantityPO: 3100,
        dateInputNPL: '2023-11-08T09:15:12.000Z',
        dateOutputFCR: '2023-11-08T09:15:12.000Z',
        orderNumber: 5,
        createdAt: '2023-11-25T08:32:48.000Z',
        updatedAt: '2023-11-25T08:32:48.000Z',
        sewing: 'normal',
        iron: 'warn',
        check: 'error',
        pack: 'success'
      },
      {
        id: 28,
        productCode: 'FFSO-5',
        quantityPO: 3100,
        dateInputNPL: '2023-11-08T09:15:12.000Z',
        dateOutputFCR: '2023-11-08T09:15:12.000Z',
        orderNumber: 6,
        createdAt: '2023-11-25T08:32:50.000Z',
        updatedAt: '2023-11-25T08:32:50.000Z',
        sewing: 'normal',
        iron: 'warn',
        check: 'error',
        pack: 'success'
      },
      {
        id: 29,
        productCode: 'FFSO-6',
        quantityPO: 3100,
        dateInputNPL: '2023-11-08T09:15:12.000Z',
        dateOutputFCR: '2023-11-08T09:15:12.000Z',
        orderNumber: 7,
        createdAt: '2023-11-25T08:32:52.000Z',
        updatedAt: '2023-11-25T08:32:52.000Z',
        sewing: 'normal',
        iron: 'warn',
        check: 'error',
        pack: 'success'
      }
    ],
    count: 5,
    page: 1,
    total: 29
  })
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
        // setMetaData(data)
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

  const querySearchData = (searchText: string) => {
    if (searchText.length !== 0) {
      ProductAPI.getItemByCode(searchText).then((data) => {
        console.log(data)
        if (data?.success) {
          setDataSource([data?.data])
        }
      })
    }
  }

  useEffect(() => {
    if (metaData) {
      setDataSource(
        metaData.data.map((item: Product) => {
          return { ...item, key: item.id } as Product
        })
      )
    }
  }, [metaData])

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
      ProductAPI.deleteItem(itemFound.id ?? -1)
        .then((data) => {
          if (data?.success) {
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
    productToUpdate: Product,
    setLoading: (enable: boolean) => void
  ) => {
    try {
      const newData = [...dataSource]
      const index = newData.findIndex((item) => key === item.id)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...productToUpdate
        })
        setDataSource(newData)
        setEditingKey('')

        // After updated local data
        // We need to update on database
        await ProductAPI.updateItem(productToUpdate)
          .then(() => {
            setLoading(true)
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        newData.push(productToUpdate)
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
    requestListData,
    metaData,
    setMetaData,
    editingKey,
    setEditingKey,
    deleteKey,
    setDeleteKey,
    dataSource,
    setDataSource,
    isEditing,
    querySearchData,
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
