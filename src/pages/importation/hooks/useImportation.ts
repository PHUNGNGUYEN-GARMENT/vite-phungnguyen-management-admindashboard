/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import ImportationAPI from '~/api/services/ImportationAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { Importation, Product, ProductColor, ProductGroup } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ImportationTableDataType } from '../ImportationPage'

export default function useImportation() {
  const productService = useAPIService<Product>(ProductAPI)
  const importationService = useAPIService<Importation>(ImportationAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)

  const { message } = AntApp.useApp()

  const {
    form,
    isEditing,
    editingKey,
    dataSource,
    loading,
    setLoading,
    setDataSource,
    setDeleteKey,
    dateCreation,
    setDateCreation,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<ImportationTableDataType>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  // const [products, setProducts] = useState<Product[]>([])
  const [importations, setImportations] = useState<Importation[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])

  const [importationNew, setImportationNew] = useState<Importation | undefined>(undefined)

  const loadData = async () => {
    // await productService.getListItems(defaultRequestBody, setLoading, (meta) => {
    //   if (meta?.success) {
    //     setProducts(meta.data as Product[])
    //   }
    // })
    await importationService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setImportations(meta.data as Importation[])
      }
    })
    await productColorService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setProductColors(meta.data as ProductColor[])
      }
    })
    await productGroupService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setProductGroups(meta.data as ProductGroup[])
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [importationNew])

  useEffect(() => {
    if (dataSource) {
      console.log(dataSource)
    }
  }, [dataSource])

  useEffect(() => {
    selfConvertDataSource(importations, productColors, productGroups)
  }, [importations, productColors, productGroups])

  const selfConvertDataSource = (
    _importations?: Importation[],
    _productColors?: ProductColor[],
    _productGroups?: ProductGroup[]
  ) => {
    setDataSource(
      (_importations ? _importations : importations).map((item) => {
        return {
          ...item,
          // importation: (_importations ? _importations : importations).find((i) => i.productID === item.id),
          key: item.id,
          productColors: _productColors ? _productColors : productColors.find((i) => i.product?.id === item.productID),
          productGroups: _productGroups ? _productGroups : productGroups.find((i) => i.product?.id === item.productID)
        } as ImportationTableDataType
      })
    )
  }

  const handleSaveClick = async (item: TableItemWithKey<ImportationTableDataType>) => {
    const row = (await form.validateFields()) as any
    console.log({ row: row, item: item })
    try {
      if (
        (row.quantity && row.quantity !== item?.quantity) ||
        (row.dateImported && DayJS(row.dateImported).diff(DayJS(item?.dateImported)))
      ) {
        console.log('Importation progressing...')
        await importationService.createOrUpdateItemByPk(
          item.id!,
          {
            quantity: row.quantity,
            dateImported: row.dateImported && DayJS(row.dateImported).format(DatePattern.iso8601)
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              const itemNew = meta.data as Importation
              setImportationNew(itemNew)
            } else {
              throw new Error('API update Importation failed')
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      // await productService.createNewItem(
      //   {
      //     productCode: formAddNew.productCode,
      //     quantityPO: formAddNew.quantityPO,
      //     dateInputNPL: DayJS(formAddNew.dateInputNPL).format(DatePattern.iso8601),
      //     dateOutputFCR: DayJS(formAddNew.dateOutputFCR).format(DatePattern.iso8601)
      //   },
      //   setLoading,
      //   async (meta, msg) => {
      //     if (meta?.data) {
      //       const productNew = meta.data as Product
      //       setProductNew(productNew)
      //       if (formAddNew.colorID) {
      //         console.log('Product color created')
      //         await productColorService.createNewItem(
      //           { productID: productNew.id!, colorID: formAddNew.colorID },
      //           setLoading,
      //           (meta) => {
      //             if (meta?.success) {
      //               const productColorNew = meta.data as ProductColor
      //               setProductColorNew(productColorNew)
      //             }
      //           }
      //         )
      //       }
      //       if (formAddNew.groupID) {
      //         console.log('Product group created')
      //         await productGroupService.createNewItem(
      //           { productID: productNew.id!, groupID: formAddNew.groupID },
      //           setLoading,
      //           (meta) => {
      //             if (meta?.success) {
      //               const productGroupNew = meta.data as ProductGroup
      //               setProductGroupNew(productGroupNew)
      //             }
      //           }
      //         )
      //       }
      //       if (formAddNew.printID) {
      //         console.log('Product print created')
      //         await printablePlaceService.createNewItem(
      //           { productID: productNew.id!, printID: formAddNew.printID },
      //           setLoading,
      //           (meta) => {
      //             if (meta?.success) {
      //               const printablePlaceNew = meta.data as PrintablePlace
      //               setPrintablePlaceNew(printablePlaceNew)
      //             }
      //           }
      //         )
      //       }
      //       message.success(msg)
      //     } else {
      //       console.log('Errr')
      //       message.error(msg)
      //     }
      //   }
      // )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      setOpenModal(false)
    }
  }

  const handleConfirmDelete = async (
    record: TableItemWithKey<ImportationTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    await importationService.deleteItemByPk(record.id!, setLoading, (meta, msg) => {
      if (meta) {
        if (meta.success) {
          handleStartDeleting(record.id!, () => {})
          message.success(msg)
        }
      } else {
        message.error(msg)
      }
      onDataSuccess?.(meta)
    })
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
        term: form.getFieldValue('search') ?? ''
      }
    }
    await productService.getListItems(body, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as Product[])
      }
    })
    await importationService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setImportations(meta.data as Importation[])
      }
    })
  }

  return {
    form,
    loading,
    openModal,
    loadData,
    isEditing,
    editingKey,
    dataSource,
    setLoading,
    setOpenModal,
    setDeleteKey,
    dateCreation,
    setDataSource,
    productService,
    setDateCreation,
    handleSaveClick,
    handleAddNewItem,
    handlePageChange,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    importationService,
    handleConfirmDelete,
    selfConvertDataSource,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  }
}
