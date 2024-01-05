/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import SampleSewingAPI from '~/api/services/SampleSewingAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Product, ProductColor, SampleSewing } from '~/typing'
import { SampleSewingTableDataType } from '../type'

export default function useSampleSewing(table: UseTableProps<SampleSewingTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing } = table

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const sampleSewingService = useAPIService<SampleSewing>(SampleSewingAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<SampleSewing | undefined>(undefined)

  // List
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [sampleSewings, setSampleSewings] = useState<SampleSewing[]>([])

  // New
  const [sampleSewingNew, setSampleSewingNew] = useState<SampleSewing | undefined>(undefined)

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
    await sampleSewingService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setSampleSewings(meta.data as SampleSewing[])
      }
    })
  }

  useEffect(() => {
    if (sampleSewings) {
      console.log(sampleSewings)
    }
  }, [sampleSewings])

  useEffect(() => {
    loadData()
  }, [sampleSewingNew])

  useEffect(() => {
    selfConvertDataSource(products, productColors, sampleSewings)
  }, [products, productColors, sampleSewings])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _sampleSewings?: SampleSewing[]
  ) => {
    const items = _products ? _products : products
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          sampleSewing: (_sampleSewings ? _sampleSewings : sampleSewings).find((i) => i.productID === item.id)
        } as SampleSewingTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<SampleSewingTableDataType>, newRecord: SampleSewing) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    if (newRecord) {
      try {
        if (record.sampleSewing) {
          console.log('SampleSewing progressing: ', newRecord)
          await sampleSewingService.updateItemByPk(
            newRecord.id!,
            {
              dateSubmissionNPL: newRecord.dateSubmissionNPL,
              dateApprovalPP: newRecord.dateApprovalPP,
              dateApprovalSO: newRecord.dateApprovalSO,
              dateSubmissionFirstTime: newRecord.dateSubmissionFirstTime,
              dateSubmissionSecondTime: newRecord.dateSubmissionSecondTime,
              dateSubmissionThirdTime: newRecord.dateSubmissionThirdTime,
              dateSubmissionForthTime: newRecord.dateSubmissionForthTime,
              dateSubmissionFifthTime: newRecord.dateSubmissionFifthTime
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
          await sampleSewingService.createNewItem({ ...newRecord, productID: record.id }, table.setLoading, (meta) => {
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
      await sampleSewingService.createNewItem(
        {
          productID: formAddNew.productID,
          dateSubmissionNPL: formAddNew.dateSubmissionNPL,
          dateApprovalPP: formAddNew.dateApprovalPP,
          dateApprovalSO: formAddNew.dateApprovalSO,
          dateSubmissionFirstTime: formAddNew.dateSubmissionFirstTime,
          dateSubmissionSecondTime: formAddNew.dateSubmissionSecondTime,
          dateSubmissionThirdTime: formAddNew.dateSubmissionThirdTime,
          dateSubmissionForthTime: formAddNew.dateSubmissionForthTime,
          dateSubmissionFifthTime: formAddNew.dateSubmissionFifthTime
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            setSampleSewingNew(meta.data as SampleSewing)
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
    record: TableItemWithKey<SampleSewingTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      if (record.sampleSewing) {
        await sampleSewingService.deleteItemByPk(record.sampleSewing.id!, setLoading, (meta, msg) => {
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
    sampleSewingService.setPage(_page)
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
    sampleSewingService
  }
}
