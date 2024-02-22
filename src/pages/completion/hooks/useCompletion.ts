import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import CompletionAPI from '~/api/services/CompletionAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Completion, Product, ProductColor } from '~/typing'
import { dateComparator, numberComparator } from '~/utils/helpers'
import { CompletionNewRecordProps, CompletionTableDataType } from '../type'

export default function useCompletion(table: UseTableProps<CompletionTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing } = table

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const completionService = useAPIService<Completion>(CompletionAPI)
  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<CompletionNewRecordProps>({
    quantityIroned: null,
    quantityPackaged: null,
    quantityCheckPassed: null,
    exportedDate: null,
    passFIDate: null
  })
  // List
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])

  const loadData = async () => {
    await productService.getListItems(
      {
        ...defaultRequestBody,
        paginator: { page: productService.page, pageSize: defaultRequestBody.paginator?.pageSize }
      },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setProducts(meta.data as Product[])
        }
      }
    )
    await productColorService.getListItems(
      {
        ...defaultRequestBody,
        paginator: { page: 1, pageSize: -1 }
      },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setProductColors(meta.data as ProductColor[])
        }
      }
    )
    await completionService.getListItems(
      {
        ...defaultRequestBody,
        paginator: { page: 1, pageSize: -1 }
      },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setCompletions(meta.data as Completion[])
        }
      }
    )
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    selfConvertDataSource(products, productColors, completions)
  }, [products, productColors, completions])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _completions?: Completion[]
  ) => {
    setDataSource(
      _products.map((item) => {
        return {
          ...item,
          key: item.id,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          completion: (_completions ? _completions : completions).find((i) => i.productID === item.id)
        } as CompletionTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<CompletionTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      if (record.completion) {
        // Update GarmentAccessory
        if (
          numberComparator(newRecord.quantityIroned, record.completion.quantityIroned) ||
          numberComparator(newRecord.quantityCheckPassed, record.completion.quantityCheckPassed) ||
          numberComparator(newRecord.quantityPackaged, record.completion.quantityPackaged) ||
          !record.completion.exportedDate ||
          dateComparator(newRecord.exportedDate, record.completion.exportedDate) ||
          !record.completion.passFIDate ||
          dateComparator(newRecord.passFIDate, record.completion.passFIDate)
        ) {
          console.log('Update')
          await completionService.updateItemByPk(
            record.completion.id!,
            {
              ...newRecord
            },
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update failed')
              }
            }
          )
        }
      } else {
        console.log('Create')
        await completionService.createNewItem(
          {
            productID: record.id!,
            ...newRecord
          },
          setLoading,
          (meta) => {
            if (!meta?.success) {
              throw new Error('API create failed')
            }
          }
        )
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

  const handleConfirmDelete = async (
    record: TableItemWithKey<CompletionTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      // await completionService.updateItemBy(
      //   {
      //     field: 'productID',
      //     key: record.id!
      //   },
      //   {
      //     quantityIroned: null,
      //     quantityCheckPassed: null,
      //     quantityPackaged: null,
      //     exportedDate: null,
      //     passFIDate: null
      //   },
      //   setLoading,
      //   async (meta, msg) => {
      //     if (!meta?.success) {
      //       throw new Error('API delete failed')
      //     }
      //     onDataSuccess?.(meta)
      //     message.success(msg)
      //   }
      // )
      await completionService.deleteItemBy(
        {
          field: 'productID',
          key: record.id!
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) {
            throw new Error('API delete failed')
          }
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
    await productService.pageChange(
      _page,
      setLoading,
      (meta) => {
        if (meta?.success) {
          selfConvertDataSource(meta?.data as Product[])
        }
      },
      { field: 'productCode', term: searchText }
    )
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
    handleConfirmDelete,
    handleSaveClick,
    selfConvertDataSource,
    handlePageChange,
    handleSortChange,
    handleResetClick,
    handleSearch,
    productService,
    productColorService,
    completionService
  }
}
