/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp, Form, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
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
  const [productPrints, setProductPrints] = useState<PrintablePlace[]>([])
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
        setProductPrints(meta.data as PrintablePlace[])
      }
    })
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      console.log('products: ', products)
      setDataSource(
        products.map((item) => {
          return {
            ...item,
            productColor: productColors.find((i) => i.productID === item.id),
            productGroup: productGroups.find((i) => i.productID === item.id),
            printablePlace: productPrints.find((i) => i.productID === item.id),
            key: item.id
          } as ProductTableDataType
        })
      )
    }
  }, [products, productColors, productGroups, productPrints])

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
                    field: 'nameColor',
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
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(addNewForm) => {
            productService.createNewItem(addNewForm, setLoading, (meta) => {
              if (meta?.success) {
                const itemNew = meta.data as Product
                handleStartAddNew({ key: String(uuidv4()), ...itemNew })
                message.success('Created!')
                setOpenModal(false)
              } else {
                message.error('Failed!')
              }
            })
          }}
        />
      )}
    </>
  )
}

export default ProductList
