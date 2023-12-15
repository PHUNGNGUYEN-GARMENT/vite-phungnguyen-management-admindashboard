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
import useAPICaller from '~/hooks/useAPICaller'
import { PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
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
    handleStartSaveEditing,
    setDateCreation,
    handleStartAddNew,
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
        setPrintablePlaces(meta.data as PrintablePlace[])
      }
    })
  }, [])

  useEffect(() => {
    selfConvertDataSource(products, productColors, productGroups, printablePlaces)
  }, [products, productColors, productGroups, printablePlaces])

  useEffect(() => {
    if (dataSource.length > 0) {
      console.log('dataSource: ', dataSource)
    }
  }, [dataSource])

  const selfConvertDataSource = (
    _products?: Product[],
    _productColors?: ProductColor[],
    _productGroups?: ProductGroup[],
    _printablePlaces?: PrintablePlace[]
  ) => {
    if (_products) {
      setDataSource(
        _products.map((item) => {
          return {
            ...item,
            productColor: (_productColors ? _productColors : productColors).find((i) => i.productID === item.id),
            productGroup: (_productGroups ? _productGroups : productGroups).find((i) => i.productID === item.id),
            printablePlace: (_printablePlaces ? _printablePlaces : printablePlaces).find(
              (i) => i.productID === item.id
            ),
            key: item.id
          } as ProductTableDataType
        })
      )
    }
  }

  const selfHandleSaveClick = async (item: TableItemWithKey<ProductTableDataType>) => {
    const row = (await form.validateFields()) as any
    console.log({ row: row, item: item })
    try {
      if (
        (row.productCode && row.productCode !== item.productCode) ||
        (row.quantityPO && row.quantityPO !== item.quantityPO) ||
        (row.dateInputNPL && row.dateInputNPL !== DayJS(item.dateInputNPL).format(DatePattern.display)) ||
        (row.dateOutputFCR && row.dateOutputFCR !== DayJS(item.dateOutputFCR).format(DatePattern.display))
      ) {
        console.log('Product progressing...')
        productService.updateItemByPk(
          Number(item.id!),
          {
            productCode: row.productCode,
            quantityPO: row.quantityPO,
            dateInputNPL: row.dateInputNPL,
            dateOutputFCR: row.dateOutputFCR
          } as Product,
          setLoading,
          (meta) => {
            if (meta?.success) {
              const productNew = meta.data as Product
              console.log(productNew)
              handleStartSaveEditing(item.key!, { ...productNew })
              message.success('Updated!')
            } else {
              message.error('Failed!')
            }
          }
        )
      }
      if (row.colorID !== item.productColor?.colorID) {
        console.log('Product color progressing...')
        productColorService.updateItemBy(
          { field: 'productID', key: item.key! },
          { colorID: row.colorID },
          setLoading,
          (meta) => {
            if (meta?.success) {
              console.log(meta.data)
              handleStartSaveEditing(item.key!, {
                productColor: productColors.find((i) => i.colorID === row.colorID)
              })
              message.success('Updated!')
            } else {
              message.error('Failed!')
            }
          }
        )
        //   await ProductColorAPI.createOrUpdateItemByProductID(Number(item.key!), {
        //     colorID: row.colorID
        //   } as ProductColor).then((meta) => {
        //     if (meta?.success) {
        //       const productColorNew = meta.data as ProductColor
        //       itemNew = { ...itemNew, productColor: { ...productColorNew } }
        //       handleStartSaveEditing(item.id!, { ...item })
        //     }
        //   })
      }
      if (row.groupID !== item.productGroup?.groupID) {
        console.log('ProductGroup progressing...')
        //   await ProductGroupAPI.createOrUpdateItemByProductID(Number(item.key!), {
        //     groupID: row.groupID
        //   } as ProductColor).then((meta) => {
        //     if (meta?.success) {
        //       const productGroupNew = meta.data as ProductGroup
        //       itemNew = { ...itemNew, productGroup: { ...productGroupNew } }
        //       handleStartSaveEditing(item.id!, { ...item })
        //     }
        //   })
      }
      if (row.printID !== item.printablePlace?.printID) {
        console.log('PrintablePlace progressing...')
        //   await PrintablePlaceAPI.createOrUpdateItemByProductID(Number(item.key!), {
        //     groupID: row.groupID
        //   } as ProductColor).then((meta) => {
        //     if (meta?.success) {
        //       const printablePlaceNew = meta.data as PrintablePlace
        //       itemNew = { ...itemNew, printablePlace: { ...printablePlaceNew } }
        //       handleStartSaveEditing(item.id!, { ...item })
        //     }
        //   })
      }
    } catch (error) {
      console.log(error)
      message.error('Failed!')
      message.error('Error!')
    } finally {
      setLoading(false)
      handleConfirmCancelEditing()
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
                    selfConvertDataSource(meta?.data as Product[])
                  }
                }
              )
            }
          }}
          onSortChange={(val) => {
            productService.sortedListItems(val ? 'asc' : 'desc', setLoading, (meta) => {
              if (meta?.success) {
                selfConvertDataSource(meta?.data as Product[])
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            productService.getListItems(defaultRequestBody, setLoading, (meta) => {
              if (meta?.success) {
                selfConvertDataSource(meta?.data as Product[])
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
                    selfConvertDataSource(meta?.data as Product[])
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
              productService.createNewItem(addNewForm, setLoading, (meta) => {
                if (meta?.data) {
                  const product = meta.data as Product
                  productColorService.createNewItem(
                    { productID: product.id!, colorID: addNewForm.colorID },
                    setLoading,
                    (meta) => {
                      if (meta?.success) {
                        const productColorNew = meta.data as ProductColor
                        handleStartAddNew({ id: product.id!, key: product.id!, ...productColorNew })
                      }
                    }
                  )
                  productGroupService.createNewItem(
                    { productID: product.id!, groupID: addNewForm.groupID },
                    setLoading,
                    (meta) => {
                      if (meta?.success) {
                        const productGroupNew = meta.data as ProductGroup
                        handleStartAddNew({ id: product.id!, key: product.id!, ...productGroupNew })
                      }
                    }
                  )
                  printablePlaceService.createNewItem(
                    { productID: product.id!, printID: addNewForm.printID },
                    setLoading,
                    (meta) => {
                      if (meta?.success) {
                        const printablePlaceNew = meta.data as PrintablePlace
                        handleStartAddNew({ id: product.id!, key: product.id!, ...printablePlaceNew })
                      }
                    }
                  )
                  message.success('Created!')
                } else {
                  message.error('Failed!')
                }
              })
            } catch (error) {
              console.log(error)
              message.error('Failed!')
            } finally {
              setLoading(false)
              setOpenModal(false)
            }
          }}
        />
      )}
    </>
  )
}

export default ProductList
