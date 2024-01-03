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
import DayJS from '~/utils/date-formatter'
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
  const [newRecord, setNewRecord] = useState<any>({})

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
    await garmentAccessoryNoteService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setGarmentAccessoryNotes(meta.data as GarmentAccessoryNote[])
      }
    })
    await accessoryNoteService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setAccessoryNotes(meta.data as AccessoryNote[])
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [garmentAccessoryNew])

  useEffect(() => {
    selfConvertDataSource(products, productColors, garmentAccessories, garmentAccessoryNotes)
  }, [products, productColors, garmentAccessories, garmentAccessoryNotes])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _garmentAccessory?: GarmentAccessory[],
    _garmentAccessoryNotes?: GarmentAccessoryNote[]
  ) => {
    setDataSource(
      _products.map((item) => {
        return {
          ...item,
          key: item.id,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          garmentAccessory: (_garmentAccessory ? _garmentAccessory : garmentAccessories).find(
            (i) => i.productID === item.id
          ),
          garmentAccessoryNotes: (_garmentAccessoryNotes ? _garmentAccessoryNotes : garmentAccessoryNotes).filter(
            (i) => i.productID === item.id
          )
        } as GarmentAccessoryTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<GarmentAccessoryTableDataType>, newRecord: any) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    if (newRecord) {
      try {
        if (
          record.garmentAccessory &&
          ((newRecord.amountCutting !== record.garmentAccessory?.amountCutting && newRecord.amountCutting > 0) ||
            (newRecord.passingDeliveryDate &&
              DayJS(newRecord.passingDeliveryDate).diff(record.garmentAccessory?.passingDeliveryDate)))
        ) {
          console.log('GarmentAccessory progressing...')
          await garmentAccessoryService.createOrUpdateItemByPk(
            record.garmentAccessory.id!,
            {
              productID: record.id!,
              passingDeliveryDate: newRecord.passingDeliveryDate,
              amountCutting: newRecord.amountCutting
            },
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update GarmentAccessory failed')
              }
            }
          )
        }
        if (record.garmentAccessoryNotes) {
          const newGarmentAccessoryNotes: GarmentAccessoryNote[] = newRecord.garmentAccessoryNotes
          console.log('GarmentAccessoryNotes progressing...')
          await garmentAccessoryNoteService.createNewItems(
            newGarmentAccessoryNotes.map((item) => {
              return {
                productID: record.id!,
                garmentAccessoryID: record.garmentAccessory!.id!,
                accessoryNoteID: item.accessoryNoteID,
                noteStatus: item.noteStatus
              } as GarmentAccessoryNote
            }),
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update GarmentAccessory failed')
              }
            }
          )
        }
        message.success('Success!')
      } catch (error) {
        console.error(error)
        message.error('Failed')
      } finally {
        setLoading(false)
        handleConfirmCancelEditing()
        loadData()
      }
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
    console.log(record)
    await garmentAccessoryService.deleteItemByPk(record.garmentAccessory!.id!, setLoading, (meta, msg) => {
      if (meta) {
        if (meta.success) {
          loadData()
          message.success(msg)
        }
      } else {
        message.error(msg)
      }
      onDataSuccess?.(meta)
    })
  }

  const handlePageChange = async (_page: number) => {
    garmentAccessoryService.setPage(_page)
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
    await productColorService.getListItems(body, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as Product[])
      }
    })
  }

  const handleResetClick = async () => {
    setSearchText('')
    await garmentAccessoryService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as GarmentAccessory[])
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSortChange = async (checked: boolean, _event: React.MouseEvent<HTMLButtonElement>) => {
    await garmentAccessoryService.sortedListItems(
      checked ? 'asc' : 'desc',
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as GarmentAccessory[])
        }
      },
      { field: 'productCode', term: searchText }
    )
  }

  const handleSearch = async (value: string) => {
    if (value.length > 0) {
      await garmentAccessoryService.getListItems(
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
            selfConvertDataSource(meta?.data as GarmentAccessory[])
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
