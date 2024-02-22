import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import SewingLineAPI from '~/api/services/SewingLineAPI'
import SewingLineDeliveryAPI from '~/api/services/SewingLineDeliveryAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { GarmentAccessory, Product, ProductColor, SewingLine, SewingLineDelivery } from '~/typing'
import { SewingLineDeliveryTableDataType } from '../type'

export default function useSewingLineDelivery(table: UseTableProps<SewingLineDeliveryTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing } = table

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const sewingLineService = useAPIService<SewingLine>(SewingLineAPI)
  const sewingLineDeliveryService = useAPIService<SewingLineDelivery>(SewingLineDeliveryAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<SewingLineDelivery[]>([])
  const [sewingLineDeliveryRecordTemp, setSewingLineDeliveryRecordTemp] = useState<SewingLineDelivery>({})

  // List
  const [products, setProducts] = useState<Product[]>([])
  const [sewingLineDeliveries, setSewingLineDeliveries] = useState<SewingLineDelivery[]>([])
  const [sewingLines, setSewingLines] = useState<SewingLine[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])

  // New
  const [garmentAccessoryNew, setGarmentAccessoryNew] = useState<GarmentAccessory | undefined>(undefined)

  const loadData = async () => {
    await productService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setProducts(meta.data as Product[])
      }
    })
    await productColorService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setProductColors(meta.data as ProductColor[])
      }
    })
    await sewingLineDeliveryService.getListItems(
      { ...defaultRequestBody, paginator: { page: 1, pageSize: -1 } },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setSewingLineDeliveries(meta.data as SewingLineDelivery[])
        }
      }
    )
    await sewingLineService.getListItems(
      { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 }, sorting: { direction: 'asc', column: 'id' } },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setSewingLines(meta.data as SewingLine[])
        }
      }
    )
  }

  useEffect(() => {
    loadData()
  }, [garmentAccessoryNew])

  useEffect(() => {
    selfConvertDataSource(products, productColors, sewingLineDeliveries)
  }, [products, productColors, sewingLineDeliveries, sewingLines])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _sewingLineDeliveries?: SewingLineDelivery[]
  ) => {
    setDataSource(
      _products.map((item) => {
        return {
          ...item,
          key: item.id,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          sewingLineDeliveries: (_sewingLineDeliveries ? _sewingLineDeliveries : sewingLineDeliveries).filter(
            (i) => i.productID === item.id
          )
        } as SewingLineDeliveryTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<SewingLineDeliveryTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      if (newRecord) {
        if (record.sewingLineDeliveries) {
          // Update GarmentAccessory
          console.log('Update SewingLineDelivery')
          await sewingLineDeliveryService.updateItemsBy(
            { field: 'productID', key: record.id! },
            newRecord.map((item) => {
              return {
                quantityOriginal: item.quantityOriginal ?? null,
                quantitySewed: item.quantitySewed ?? null,
                expiredDate: item.expiredDate ?? null,
                sewingLineID: item.sewingLineID ?? null
              } as SewingLineDelivery
            }),
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update SewingLineDelivery failed')
              }
            }
          )
        } else {
          console.log('Create SewingLineDelivery')
          await sewingLineDeliveryService.createNewItems(
            newRecord.map((i) => {
              return {
                productID: record.id,
                quantityOriginal: i.quantityOriginal,
                quantitySewed: i.quantitySewed,
                expiredDate: i.expiredDate,
                sewingLineID: i.sewingLineID
              } as SewingLineDelivery
            }),
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API create GarmentAccessory failed')
              }
            }
          )
        }
      }

      message.success('Success!')
    } catch (error: any) {
      message.error(`${error.message}`)
    } finally {
      setLoading(false)
      handleConfirmCancelEditing()
      loadData()
    }
  }

  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await sewingLineDeliveryService.createNewItem(
        {
          quantitySewed: formAddNew.quantitySewed,
          expiredDate: formAddNew.expiredDate
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            setGarmentAccessoryNew(meta.data as GarmentAccessory)
            message.success(msg)
          } else {
            console.log('Errr')
            message.error(msg)
          }
        }
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      setOpenModal(false)
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<SewingLineDeliveryTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      await sewingLineDeliveryService.deleteItemBy(
        {
          field: 'productID',
          key: record.id!
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) {
            throw new Error('API delete GarmentAccessory failed')
          }
          // Other service here...
          onDataSuccess?.(meta)
          message.success(msg)
        }
      )
    } catch (error) {
      console.error(error)
    } finally {
      loadData()
      setLoading(false)
    }
  }

  const handlePageChange = async (_page: number) => {
    productService.setPage(_page)
    const body: RequestBodyType = {
      ...defaultRequestBody,
      paginator: {
        page: _page,
        pageSize: 5
      },
      search: {
        field: 'productCode',
        term: searchText
      }
    }
    await productService.getListItems(body, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as Product[])
      }
    })
  }

  const handleResetClick = async () => {
    setSearchText('')
    loadData()
  }

  const handleSortChange = async (checked: boolean) => {
    await productService.sortedListItems(
      checked ? 'asc' : 'desc',
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Product[])
        }
      },
      { field: 'productCode', term: searchText }
    )
  }

  const handleSearch = async (value: string) => {
    if (value.length > 0) {
      await productService.getListItems(
        {
          ...defaultRequestBody,
          search: {
            field: 'productCode',
            term: value
          }
        },
        setLoading,
        (meta) => {
          if (meta?.success) {
            selfConvertDataSource(meta?.data as Product[])
          }
        }
      )
    }
  }

  return {
    searchText,
    setSearchText,
    openModal,
    loadData,
    newRecord,
    setNewRecord,
    setLoading,
    setOpenModal,
    setDataSource,
    handleAddNewItem,
    handleConfirmDelete,
    handleSaveClick,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch,
    productService,
    productColorService,
    sewingLines,
    sewingLineDeliveryRecordTemp,
    setSewingLineDeliveryRecordTemp
  }
}
