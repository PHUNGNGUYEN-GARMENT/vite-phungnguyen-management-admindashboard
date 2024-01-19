/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { ResponseDataType, defaultRequestBody } from '~/api/client'
import ImportationAPI from '~/api/services/ImportationAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Importation, Product, ProductColor } from '~/typing'
import { ImportationTableDataType } from '../type'

export default function useImportation(table: UseTableProps<ImportationTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing } = table

  // Services
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const importationService = useAPIService<Importation>(ImportationAPI)

  // UI
  const { message } = AntApp.useApp()

  // State changes
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<Importation>({})

  // List
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [importations, setImportations] = useState<Importation[]>([])

  // New
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
    await importationService.getListItems(
      {
        ...defaultRequestBody,
        paginator: { page: 1, pageSize: -1 }
      },
      setLoading,
      (meta) => {
        if (meta?.success) {
          setImportations(meta.data as Importation[])
        }
      }
    )
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    selfConvertDataSource(products, productColors, importations)
  }, [products, productColors, importations])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _importations?: Importation[]
  ) => {
    const items = _products ? _products : products
    setDataSource(
      items.map((item) => {
        return {
          ...item,
          key: item.id,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          importation: (_importations ? _importations : importations).find((i) => i.productID === item.id)
        } as ImportationTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<ImportationTableDataType>) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    try {
      if (newRecord && record.importation) {
        console.log('Importation progressing: ', newRecord)
        await importationService.updateItemBy(
          { field: 'productID', key: record.key },
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
      } else {
        console.log('add new')
        await importationService.createNewItem({ ...newRecord, productID: record.id }, table.setLoading, (meta) => {
          if (!meta?.success) {
            throw new Error('API create failed')
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddNewItem = async (formAddNew: { productID: number; importation: Importation }) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      await importationService.createNewItem(
        {
          productID: formAddNew.productID,
          ...formAddNew.importation
        },
        setLoading,
        async (meta, msg) => {
          if (!meta?.success) {
            throw new Error('API create failed')
          } else {
            message.success(msg)
          }
        }
      )
    } catch (error) {
      console.error(error)
      message.error('Failed!')
    } finally {
      setLoading(false)
      setOpenModal(false)
      loadData()
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<ImportationTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    try {
      if (record.importation) {
        await importationService.deleteItemByPk(record.importation.id!, setLoading, (meta, msg) => {
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
    importationService
  }
}
