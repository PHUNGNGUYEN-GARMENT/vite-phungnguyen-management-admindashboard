/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp } from 'antd'
import { useEffect, useState } from 'react'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import { TableItemWithKey, UseTableProps } from '~/components/hooks/useTable'
import useAPIService from '~/hooks/useAPIService'
import { ProductTableDataType } from '~/pages/product/type'
import { Color, Group, PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'

export default function useProduct(table: UseTableProps<ProductTableDataType>) {
  const { setLoading, setDataSource, handleConfirmCancelEditing, handleConfirmDeleting } = table

  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const printablePlaceService = useAPIService<PrintablePlace>(PrintablePlaceAPI)

  const { message } = AntApp.useApp()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [newRecord, setNewRecord] = useState<any>({})

  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [printablePlaces, setPrintablePlaces] = useState<PrintablePlace[]>([])

  const [productNew, setProductNew] = useState<Product | undefined>(undefined)
  const [productColorNew, setProductColorNew] = useState<Color | undefined>(undefined)
  const [productGroupNew, setProductGroupNew] = useState<Group | undefined>(undefined)
  const [printablePlaceNew, setPrintablePlaceNew] = useState<PrintablePlace | undefined>(undefined)

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
    await productGroupService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setProductGroups(meta.data as ProductGroup[])
      }
    })
    await printablePlaceService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setPrintablePlaces(meta.data as PrintablePlace[])
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [productNew, productColorNew, productGroupNew, printablePlaceNew])

  useEffect(() => {
    selfConvertDataSource(products, productColors, productGroups, printablePlaces)
  }, [products, productColors, productGroups, printablePlaces])

  const selfConvertDataSource = (
    _products: Product[],
    _productColors?: ProductColor[],
    _productGroups?: ProductGroup[],
    _printablePlaces?: PrintablePlace[]
  ) => {
    setDataSource(
      _products.map((item) => {
        return {
          ...item,
          productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
          productGroup: (_productGroups ? _productGroups : productGroups).find((i) => i.productID === item.id),
          printablePlace: (_printablePlaces ? _printablePlaces : printablePlaces).find((i) => i.productID === item.id),
          key: item.id
        } as ProductTableDataType
      })
    )
  }

  const handleSaveClick = async (record: TableItemWithKey<ProductTableDataType>, newRecord: any) => {
    // const row = (await form.validateFields()) as any
    console.log({ old: record, new: newRecord })
    if (newRecord) {
      try {
        console.log('Product progressing...')
        await productService.updateItemByPk(
          Number(record.id!),
          {
            productCode: newRecord.productCode,
            quantityPO: newRecord.quantityPO,
            dateInputNPL: newRecord.dateInputNPL,
            dateOutputFCR: newRecord.dateOutputFCR
          },
          setLoading,
          (meta) => {
            if (!meta?.success) {
              throw new Error('API update Product failed')
            }
          }
        )
        if (newRecord.colorID && newRecord.colorID !== record.productColor?.colorID) {
          console.log('Product color progressing...')
          await productColorService.createOrUpdateItemBy(
            { field: 'productID', key: record.key! },
            { colorID: newRecord.colorID },
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update ProductColor failed')
              }
            }
          )
        }
        if (newRecord.groupID && newRecord.groupID !== record.productGroup?.groupID) {
          console.log('ProductGroup progressing...')
          await productGroupService.createOrUpdateItemBy(
            { field: 'productID', key: record.key! },
            { groupID: newRecord.groupID },
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update ProductGroup failed')
              }
            }
          )
        }
        if (newRecord.printID && newRecord.printID !== record.printablePlace?.printID) {
          console.log('PrintablePlace progressing...')
          await printablePlaceService.createOrUpdateItemBy(
            { field: 'productID', key: record.key! },
            { printID: newRecord.printID },
            setLoading,
            (meta) => {
              if (!meta?.success) {
                throw new Error('API update PrintablePlace failed')
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
      await productService.createNewItem(
        {
          productCode: formAddNew.productCode,
          quantityPO: formAddNew.quantityPO,
          dateInputNPL: DayJS(formAddNew.dateInputNPL).format(DatePattern.iso8601),
          dateOutputFCR: DayJS(formAddNew.dateOutputFCR).format(DatePattern.iso8601)
        },
        setLoading,
        async (meta, msg) => {
          if (meta?.data) {
            const productNew = meta.data as Product
            setProductNew(productNew)
            if (formAddNew.colorID) {
              console.log('Product color created')
              await productColorService.createNewItem(
                { productID: productNew.id!, colorID: formAddNew.colorID },
                setLoading,
                (meta) => {
                  if (meta?.success) {
                    const productColorNew = meta.data as ProductColor
                    setProductColorNew(productColorNew)
                  }
                }
              )
            }
            if (formAddNew.groupID) {
              console.log('Product group created')
              await productGroupService.createNewItem(
                { productID: productNew.id!, groupID: formAddNew.groupID },
                setLoading,
                (meta) => {
                  if (meta?.success) {
                    const productGroupNew = meta.data as ProductGroup
                    setProductGroupNew(productGroupNew)
                  }
                }
              )
            }
            if (formAddNew.printID) {
              console.log('Product print created')
              await printablePlaceService.createNewItem(
                { productID: productNew.id!, printID: formAddNew.printID },
                setLoading,
                (meta) => {
                  if (meta?.success) {
                    const printablePlaceNew = meta.data as PrintablePlace
                    setPrintablePlaceNew(printablePlaceNew)
                  }
                }
              )
            }
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
    item: TableItemWithKey<ProductTableDataType>,
    onDataSuccess?: (meta: ResponseDataType | undefined) => void
  ) => {
    await productService.deleteItemByPk(item.id!, setLoading, (meta, msg) => {
      if (meta) {
        if (meta.success) {
          handleConfirmDeleting(item.id!)
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
    await productService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        selfConvertDataSource(meta?.data as Product[])
      }
    })
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
    productService,
    handleSaveClick,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleAddNewItem,
    handlePageChange,
    productColorService,
    productGroupService,
    handleConfirmDelete,
    printablePlaceService,
    selfConvertDataSource,
    handleConfirmCancelEditing
  }
}
