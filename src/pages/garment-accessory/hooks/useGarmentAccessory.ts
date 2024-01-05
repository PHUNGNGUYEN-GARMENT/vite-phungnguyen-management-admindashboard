/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import AccessoryNoteAPI from '~/api/services/AccessoryNoteAPI'
import GarmentAccessoryAPI from '~/api/services/GarmentAccessoryAPI'
import GarmentAccessoryNoteAPI from '~/api/services/GarmentAccessoryNoteAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { AccessoryNote, GarmentAccessory, GarmentAccessoryNote, Product, ProductColor } from '~/typing'
import { GarmentAccessoryTableDataType } from '../type'

export default function useGarmentAccessory(table: UseTableProps<GarmentAccessoryTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing } = table

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const accessoryNoteService = useAPIService<AccessoryNote>(AccessoryNoteAPI)
  const garmentAccessoryService = useAPIService<GarmentAccessory>(GarmentAccessoryAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const garmentAccessoryNoteService = useAPIService<GarmentAccessoryNote>(GarmentAccessoryNoteAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<{
    garmentAccessory?: GarmentAccessory | undefined
    garmentAccessoryNotes?: GarmentAccessoryNote[] | undefined
  }>({})

  // List
  const [products, setProducts] = useState<Product[]>([])
  const [accessoryNotes, setAccessoryNotes] = useState<AccessoryNote[]>([])
  const [garmentAccessories, setGarmentAccessories] = useState<GarmentAccessory[]>([])
  const [garmentAccessoryNotes, setGarmentAccessoryNotes] = useState<GarmentAccessoryNote[]>([])

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
    await garmentAccessoryService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setGarmentAccessories(meta.data as GarmentAccessory[])
      }
    })
    await garmentAccessoryNoteService.getListItems(
      { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 } },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setGarmentAccessoryNotes(meta.data as GarmentAccessoryNote[])
        }
      }
    )
    await accessoryNoteService.getListItems(
      { ...defaultRequestBody, paginator: { pageSize: -1, page: 1 } },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setAccessoryNotes(meta.data as AccessoryNote[])
        }
      }
    )
  }

  useEffect(() => {
    if (garmentAccessoryNotes.length > 0) {
      console.log(garmentAccessoryNotes)
    }
  }, [garmentAccessoryNotes])

  useEffect(() => {
    loadData()
  }, [garmentAccessoryNew])

  useEffect(() => {
    selfConvertDataSource(products, productColors, garmentAccessories, garmentAccessoryNotes)
  }, [products, productColors, garmentAccessories, garmentAccessoryNotes])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _garmentAccessories?: GarmentAccessory[],
    _garmentAccessoryNotes?: GarmentAccessoryNote[]
  ) => {
    setDataSource(
      _products.map((item) => {
        return {
          ...item,
          key: item.id,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          garmentAccessory: (_garmentAccessories ? _garmentAccessories : garmentAccessories).find(
            (i) => i.productID === item.id
          ),
          garmentAccessoryNotes: (_garmentAccessoryNotes ? _garmentAccessoryNotes : garmentAccessoryNotes).filter(
            (i) => i.productID === item.id
          )
        } as GarmentAccessoryTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<GarmentAccessoryTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      if (newRecord) {
        if (newRecord.garmentAccessory) {
          if (record.garmentAccessory) {
            // Update GarmentAccessory
            if ((newRecord.garmentAccessory.amountCutting ?? 0) < 0) {
              throw new Error('The value must be greater than 0')
            } else {
              await garmentAccessoryService.updateItemByPk(
                record.garmentAccessory.id!,
                {
                  amountCutting: newRecord.garmentAccessory.amountCutting,
                  passingDeliveryDate: newRecord.garmentAccessory.passingDeliveryDate
                },
                setLoading,
                (meta) => {
                  if (!meta?.success) {
                    throw new Error('API update GarmentAccessory failed')
                  }
                }
              )
            }
          } else {
            // Create GarmentAccessory
            await garmentAccessoryService.createNewItem(
              {
                ...newRecord.garmentAccessory,
                productID: record.id!
              },
              setLoading,
              (meta) => {
                if (!meta?.success) {
                  throw new Error('API create GarmentAccessory failed')
                }
              }
            )
          }

          if (newRecord.garmentAccessoryNotes) {
            console.log('Update GarmentAccessoryNote')
            await garmentAccessoryNoteService.updateItemsBy?.(
              { field: 'productID', key: record.id! },
              newRecord.garmentAccessoryNotes.map((item) => {
                return {
                  ...item,
                  productID: record.id!,
                  garmentAccessoryID: record.garmentAccessory?.id,
                  noteStatus: 'enough',
                  status: 'active'
                }
              }),
              setLoading,
              (meta) => {
                if (!meta?.success) {
                  throw new Error('API update GarmentAccessoryNote failed')
                }
              }
            )
          }
        }
        message.success('Success!')
      }
    } catch (error: any) {
      console.error(error)
      message.error(`${error.message}`)
    } finally {
      setLoading(false)
      handleConfirmCancelEditing()
      loadData()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await garmentAccessoryService.createNewItem(
        {
          amountCutting: formAddNew.amountCutting,
          passingDeliveryDate: formAddNew.passingDeliveryDate
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
    record: TableItemWithKey<GarmentAccessoryTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      await garmentAccessoryService.updateItemBy(
        {
          field: 'productID',
          key: record.id!
        },
        {
          amountCutting: null,
          passingDeliveryDate: null
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) {
            throw new Error('API delete GarmentAccessory failed')
          }
          await garmentAccessoryNoteService.updateItemsBy(
            {
              field: 'productID',
              key: record.id!
            },
            [],
            setLoading,
            (meta2) => {
              if (!meta2?.success) {
                throw new Error('API delete GarmentAccessoryNote failed')
              }
            }
          )
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSortChange = async (checked: boolean, _event: React.MouseEvent<HTMLButtonElement>) => {
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
    garmentAccessoryService,
    accessoryNotes
  }
}
