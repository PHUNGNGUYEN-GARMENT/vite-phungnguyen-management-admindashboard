/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import CuttingGroupAPI from '~/api/services/CuttingGroupAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { CuttingGroup, Product, ProductColor } from '~/typing'
import { CuttingGroupTableDataType } from '../type'

export default function useCuttingGroup(table: UseTableProps<CuttingGroupTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing } = table

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const cuttingGroupService = useAPIService<CuttingGroup>(CuttingGroupAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<CuttingGroup | undefined>(undefined)

  // List
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [cuttingGroups, setCuttingGroups] = useState<CuttingGroup[]>([])

  // New
  const [sampleSewingNew, setCuttingGroupNew] = useState<CuttingGroup | undefined>(undefined)

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
    await cuttingGroupService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setCuttingGroups(meta.data as CuttingGroup[])
      }
    })
  }

  useEffect(() => {
    if (newRecord) {
      console.log(newRecord)
    }
  }, [newRecord])

  useEffect(() => {
    loadData()
  }, [sampleSewingNew])

  useEffect(() => {
    selfConvertDataSource(products, productColors, cuttingGroups)
  }, [products, productColors, cuttingGroups])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _cuttingGroups?: CuttingGroup[]
  ) => {
    const items = _products ? _products : products
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          cuttingGroup: (_cuttingGroups ? _cuttingGroups : cuttingGroups).find((i) => i.productID === item.id)
        } as CuttingGroupTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<CuttingGroupTableDataType>, newRecord: CuttingGroup) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    if (newRecord) {
      try {
        if (record.cuttingGroup) {
          console.log('CuttingGroup progressing: ', newRecord)
          await cuttingGroupService.updateItemBy(
            { field: 'productID', key: record.key },
            {
              quantityRealCut: newRecord.quantityRealCut,
              dateSendEmbroidered: newRecord.dateSendEmbroidered,
              timeCut: newRecord.timeCut,
              quantityArrivedEmbroidered: newRecord.quantityArrivedEmbroidered,
              quantityDeliveredBTP: newRecord.quantityDeliveredBTP
            },
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update group failed')
              }
            }
          )
        } else {
          console.log('add new')
          await cuttingGroupService.createNewItem({ ...newRecord, productID: record.id }, table.setLoading, (meta) => {
            if (!meta?.success) {
              throw new Error('API update group failed')
            }
          })
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
      await cuttingGroupService.createNewItem(
        {
          productID: formAddNew.id,
          quantityRealCut: formAddNew.quantityRealCut,
          dateSendEmbroidered: formAddNew.dateSendEmbroidered,
          timeCut: formAddNew.timeCut,
          quantityArrivedEmbroidered: formAddNew.quantityArrivedEmbroidered,
          quantityDeliveredBTP: formAddNew.quantityDeliveredBTP
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            setCuttingGroupNew(meta.data as CuttingGroup)
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
    record: TableItemWithKey<CuttingGroupTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      if (record.cuttingGroup) {
        await cuttingGroupService.deleteItemByPk(record.cuttingGroup.id!, setLoading, (meta, msg) => {
          if (!meta?.success) {
            throw new Error('API delete failed')
          }
          message.success(msg)
          onDataSuccess?.(meta)
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      loadData()
      setLoading(false)
      setOpenModal(false)
    }
  }

  const handlePageChange = async (_page: number) => {
    cuttingGroupService.setPage(_page)
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
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch,
    productService,
    cuttingGroupService
  }
}
