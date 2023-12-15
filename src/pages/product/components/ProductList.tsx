/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp, Form, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import useAPICaller, { serviceActionUpdateOrCreate } from '~/hooks/useAPICaller'
import { PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'
import { ProductTableDataType } from '../type'
import ModalAddNewProduct from './ModalAddNewProduct'
import ProductListItem from './ProductListItem'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ProductList: React.FC<Props> = ({ ...props }) => {
  const productService = useAPICaller<Product>(ProductAPI)
  const productColorService = useAPICaller<ProductColor>(ProductColorAPI)
  const productGroupService = useAPICaller<ProductGroup>(ProductGroupAPI)
  const printablePlaceService = useAPICaller<PrintablePlace>(PrintablePlaceAPI)
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
    handleStartSaveEditing,
    handleConvertDataSource,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<ProductTableDataType>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])
  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [printablePlaces, setPrintablePlaces] = useState<PrintablePlace[]>([])
  const { message } = AntApp.useApp()
  console.log('Product page loading...')

  useEffect(() => {
    productService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setProducts(meta.data as Product[])
      }
    })
    productColorService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setProductColors(meta.data as ProductColor[])
      }
    })
    productGroupService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setProductGroups(meta.data as ProductGroup[])
      }
    })
    printablePlaceService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        console.log('Printable place', meta.data)
        setPrintablePlaces(meta.data as PrintablePlace[])
      }
    })
  }, [])

  useEffect(() => {
    setDataSource(
      products.map((item) => {
        return {
          ...item,
          productColor: productColors.find((i) => i.productID === item.id),
          productGroup: productGroups.find((i) => i.productID === item.id),
          printablePlace: printablePlaces.find((i) => i.productID === item.id),
          key: item.id
        } as ProductTableDataType
      })
    )
  }, [products, productColors, productGroups, printablePlaces])

  useEffect(() => {
    if (dataSource.length > 0) {
      console.log('dataSource: ', dataSource)
    }
  }, [dataSource])

  const selfHandleSaveClick = async (item: TableItemWithKey<ProductTableDataType>) => {
    const row = (await form.validateFields()) as any
    console.log(row)
    if (
      row.productCode !== item.productCode ||
      row.quantityPo !== item.quantityPO ||
      row.dateInputNPL !== item.dateInputNPL ||
      row.dateOutputFCR !== item.dateOutputFCR
    ) {
      console.log('Product progressing')
      serviceActionUpdateOrCreate(
        { field: 'id', key: Number(item.id!) },
        ProductAPI,
        {
          productCode: row.productCode,
          quantityPO: row.quantityPO,
          dateInputNPL: row.dateInputNPL,
          dateOutputFCR: row.dateOutputFCR
        } as Product,
        setLoading,
        (data, msg) => {
          if (data?.success) {
            message.success(msg)
          } else {
            message.error(msg)
          }
          handleStartSaveEditing(item.id!, {
            ...item,
            productCode: row.productCode,
            quantityPO: row.quantityPO,
            dateInputNPL: row.dateInputNPL,
            dateOutputFCR: row.dateOutputFCR
          })
        }
      )
    }
    if (row.colorID !== item.productColor?.colorID) {
      console.log('ProductColor progressing')
      serviceActionUpdateOrCreate(
        { field: 'productID', key: Number(item.id!) },
        ProductColorAPI,
        { colorID: row.colorID } as ProductColor,
        setLoading,
        (data, msg) => {
          if (data?.success) {
            message.success(msg)
          } else {
            message.error(msg)
          }
          handleStartSaveEditing(item.id!, { ...item, productColor: { colorID: row.colorID } as ProductColor })
        }
      )
    }
    if (row.groupID !== item.productGroup?.groupID) {
      console.log('ProductGroup progressing')
      serviceActionUpdateOrCreate(
        { field: 'productID', key: Number(item.id!) },
        ProductGroupAPI,
        { groupID: row.groupID } as ProductGroup,
        setLoading,
        (data, msg) => {
          if (data?.success) {
            message.success(msg)
          } else {
            message.error(msg)
          }
          handleStartSaveEditing(item.id!, { ...item, productGroup: { groupID: row.groupID } as ProductGroup })
        }
      )
    }
    if (row.printID !== item.printablePlace?.printID) {
      console.log('PrintablePlace progressing')
      serviceActionUpdateOrCreate(
        { field: 'productID', key: Number(item.id!) },
        PrintablePlaceAPI,
        { printID: row.printID } as PrintablePlace,
        setLoading,
        (data, msg) => {
          if (data?.success) {
            message.success(msg)
          } else {
            message.error(msg)
          }
          handleStartSaveEditing(item.id!, { ...item, printablePlace: { printID: row.printID } as PrintablePlace })
        }
      )
    }
  }

  return (
    <>
      <Form form={form} {...props}>
        <BaseLayout
          onDateCreationChange={(enable) => setDateCreation(enable)}
          onSearch={(value) => {
            if (value.length > 0) {
              productService.getListItems(
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
                    handleConvertDataSource(meta)
                  }
                }
              )
            }
          }}
          onSortChange={(val) => {
            productService.sortedListItems(val ? 'asc' : 'desc', setLoading, (meta) => {
              if (meta?.success) {
                handleConvertDataSource(meta)
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            productService.getListItems(defaultRequestBody, setLoading, (meta) => {
              if (meta?.success) {
                handleConvertDataSource(meta)
              }
            })
          }}
          onAddNewClick={() => setOpenModal(true)}
        >
          <List
            itemLayout='vertical'
            size='large'
            pagination={{
              onChange: (_page) => {
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
                productService.getListItems(body, setLoading, (meta) => {
                  if (meta?.success) {
                    handleConvertDataSource(meta)
                  }
                })
              },
              current: productService.metaData?.page,
              pageSize: 5,
              total: productService.metaData?.total
            }}
            loading={loading}
            dataSource={dataSource}
            renderItem={(item) => (
              <ProductListItem
                data={item}
                key={item.key}
                dateCreation={dateCreation}
                editingKey={editingKey}
                isEditing={isEditing(item.key!)}
                onSaveClick={() => selfHandleSaveClick(item)}
                onClickStartEditing={() => handleStartEditing(item.key!)}
                onConfirmCancelEditing={() => handleConfirmCancelEditing()}
                onConfirmCancelDeleting={() => handleConfirmCancelDeleting()}
                onConfirmDelete={() => {
                  productService.deleteItemByPk(item.id!, setLoading, (meta) => {
                    if (meta) {
                      if (meta.success) {
                        handleStartDeleting(item.id!, () => {})
                        message.success('Deleted!')
                      }
                    } else {
                      message.error('Failed!')
                    }
                  })
                }}
                onStartDeleting={() => setDeleteKey(item.key!)}
              />
            )}
          />
        </BaseLayout>
      </Form>
      {openModal && (
        <ModalAddNewProduct
          setLoading={setLoading}
          loading={loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(addNewForm) => {
            console.log(addNewForm)
            try {
              setLoading(true)
              productService.createNewItem(addNewForm, setLoading, (meta1) => {
                if (meta1?.success) {
                  const itemNew = meta1.data as Product
                  productColorService.createNewItem(
                    { productID: itemNew.id!, colorID: addNewForm.colorID } as ProductColor,
                    setLoading,
                    async (meta2) => {
                      if (meta2?.success) {
                        const productColorNew = meta2.data as ProductColor
                        const getProductColorNew = await ProductColorAPI.getItemByPk(productColorNew.id!)
                        productGroupService.createNewItem(
                          { productID: itemNew.id!, groupID: addNewForm.groupID } as ProductGroup,
                          setLoading,
                          async (meta3) => {
                            if (meta3?.success) {
                              const productGroupNew = meta3.data as ProductGroup
                              const getProductGroupNew = await ProductGroupAPI.getItemByPk(productGroupNew.id!)
                              printablePlaceService.createNewItem(
                                { productID: itemNew.id!, printID: addNewForm.printID } as PrintablePlace,
                                setLoading,
                                async (meta4) => {
                                  if (meta4?.success) {
                                    const printablePlaceNew = meta4.data as PrintablePlace
                                    const getPrintablePlaceNew = await PrintablePlaceAPI.getItemByPk(
                                      printablePlaceNew.id!
                                    )
                                    handleStartAddNew({
                                      key: Number(itemNew.id),
                                      ...itemNew,
                                      productColor: getProductColorNew?.data as ProductColor,
                                      productGroup: getProductGroupNew?.data as ProductGroup,
                                      printablePlace: getPrintablePlaceNew?.data as PrintablePlace
                                    })
                                    message.success('Created!')
                                    setOpenModal(false)
                                  }
                                }
                              )
                            }
                          }
                        )
                      }
                    }
                  )
                } else {
                  message.error('Failed!')
                }
              })
            } catch (error) {
              message.error('Failed!')
              console.log(error)
            } finally {
              setLoading(false)
            }
          }}
        />
      )}
    </>
  )
}

export default ProductList
