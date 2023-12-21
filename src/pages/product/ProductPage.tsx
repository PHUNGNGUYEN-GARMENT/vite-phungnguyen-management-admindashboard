/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import useDevice from '~/components/hooks/useDevice'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import useAPIService from '~/hooks/useAPIService'
import { Color, Group, PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import ModalAddNewProduct from './components/ModalAddNewProduct'
import ProductList from './components/ProductList'
import ProductTable from './components/ProductTable'
import { ProductTableDataType } from './type'

const ProductPage: React.FC = () => {
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const printablePlaceService = useAPIService<PrintablePlace>(PrintablePlaceAPI)

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
    handleStartEditing,
    handleStartDeleting,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<ProductTableDataType>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [printablePlaces, setPrintablePlaces] = useState<PrintablePlace[]>([])

  const [productNew, setProductNew] = useState<Product | undefined>(undefined)
  const [productColorNew, setProductColorNew] = useState<Color | undefined>(undefined)
  const [productGroupNew, setProductGroupNew] = useState<Group | undefined>(undefined)
  const [printablePlaceNew, setPrintablePlaceNew] = useState<PrintablePlace | undefined>(undefined)

  const { message } = AntApp.useApp()

  const { width } = useDevice()

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

  const selfHandleSaveClick = async (item: TableItemWithKey<ProductTableDataType>) => {
    const row = (await form.validateFields()) as any
    console.log({ row: row, item: item })
    try {
      if (
        (row.productCode && item.productCode !== row.productCode) ||
        (row.quantityPO && item.quantityPO !== row.quantityPO) ||
        (row.dateInputNPL && DayJS(row.dateInputNPL).diff(DayJS(item.dateInputNPL))) ||
        (row.dateOutputFCR && DayJS(row.dateOutputFCR).diff(DayJS(item.dateOutputFCR)))
      ) {
        console.log('Product progressing...')
        await productService.updateItemByPk(
          Number(item.id!),
          {
            productCode: row.productCode,
            quantityPO: row.quantityPO,
            dateInputNPL: row.dateInputNPL,
            dateOutputFCR: row.dateOutputFCR
          },
          setLoading,
          (meta) => {
            if (!meta?.success) {
              throw new Error('API update Product failed')
            }
          }
        )
      }
      if (row.colorID && row.colorID !== item.productColor?.colorID) {
        console.log('Product color progressing...')
        await productColorService.createOrUpdateItemBy(
          { field: 'productID', key: item.key! },
          { colorID: row.colorID },
          setLoading,
          (meta) => {
            if (!meta?.success) {
              throw new Error('API update ProductColor failed')
            }
          }
        )
      }
      if (row.groupID && row.groupID !== item.productGroup?.groupID) {
        console.log('ProductGroup progressing...')
        await productGroupService.createOrUpdateItemBy(
          { field: 'productID', key: item.key! },
          { groupID: row.groupID },
          setLoading,
          (meta) => {
            if (!meta?.success) {
              throw new Error('API update ProductGroup failed')
            }
          }
        )
      }
      if (row.printID && row.printID !== item.printablePlace?.printID) {
        console.log('PrintablePlace progressing...')
        await printablePlaceService.createOrUpdateItemBy(
          { field: 'productID', key: item.key! },
          { printID: row.printID },
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const selfHandleAddNewItem = async (formAddNew: any) => {
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

  const handleConfirmDelete = async (item: TableItemWithKey<ProductTableDataType>) => {
    await productService.deleteItemByPk(item.id!, setLoading, (meta, msg) => {
      if (meta) {
        if (meta.success) {
          handleStartDeleting(item.id!, () => {})
          message.success(msg)
        }
      } else {
        message.error(msg)
      }
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
  }

  return (
    <>
      <Form form={form}>
        <BaseLayout
          onDateCreationChange={(enable) => setDateCreation(enable)}
          onSearch={async (value) => {
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
          }}
          onSortChange={async (val) => {
            await productService.sortedListItems(val ? 'asc' : 'desc', setLoading, (meta) => {
              if (meta?.success) {
                selfConvertDataSource(meta?.data as Product[])
              }
            })
          }}
          onResetClick={async () => {
            form.setFieldValue('search', '')
            await productService.getListItems(defaultRequestBody, setLoading, (meta) => {
              if (meta?.success) {
                selfConvertDataSource(meta?.data as Product[])
              }
            })
          }}
          onAddNewClick={() => setOpenModal(true)}
        >
          {width >= 768 && (
            <ProductTable
              loading={loading}
              setLoading={setLoading}
              metaData={productService.metaData}
              dataSource={dataSource}
              dateCreation={dateCreation}
              editingKey={editingKey}
              isEditing={isEditing}
              onPageChange={handlePageChange}
              onConfirmDelete={handleConfirmDelete}
              setDeleteKey={setDeleteKey}
              onSaveClick={selfHandleSaveClick}
              onStartEditing={handleStartEditing}
              onConfirmCancelEditing={handleConfirmCancelEditing}
              onConfirmCancelDeleting={handleConfirmCancelDeleting}
            />
          )}
          {width <= 768 && (
            <ProductList
              loading={loading}
              setLoading={setLoading}
              metaData={productService.metaData}
              dataSource={dataSource}
              dateCreation={dateCreation}
              editingKey={editingKey}
              isEditing={isEditing}
              onPageChange={handlePageChange}
              onConfirmDelete={handleConfirmDelete}
              setDeleteKey={setDeleteKey}
              onSaveClick={selfHandleSaveClick}
              onStartEditing={handleStartEditing}
              onConfirmCancelEditing={handleConfirmCancelEditing}
              onConfirmCancelDeleting={handleConfirmCancelDeleting}
            />
          )}
        </BaseLayout>
      </Form>
      {openModal && (
        <ModalAddNewProduct
          setLoading={setLoading}
          loading={loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={selfHandleAddNewItem}
        />
      )}
    </>
  )
}

export default ProductPage
