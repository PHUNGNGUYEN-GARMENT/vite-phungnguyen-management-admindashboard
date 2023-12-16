/* eslint-disable @typescript-eslint/no-explicit-any */
import { App as AntApp, Form, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import ColorAPI from '~/api/services/ColorAPI'
import GroupAPI from '~/api/services/GroupAPI'
import PrintAPI from '~/api/services/PrintAPI'
import PrintablePlaceAPI from '~/api/services/PrintablePlaceAPI'
import ProductAPI from '~/api/services/ProductAPI'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import ProductGroupAPI from '~/api/services/ProductGroupAPI'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import useAPIService from '~/hooks/useAPIService'
import { Color, Group, Print, PrintablePlace, Product, ProductColor, ProductGroup } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ProductTableDataType } from '../type'
import ModalAddNewProduct from './ModalAddNewProduct'
import ProductListItem from './ProductListItem'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ProductList: React.FC<Props> = ({ ...props }) => {
  const productService = useAPIService<Product>(ProductAPI)
  const productColorService = useAPIService<ProductColor>(ProductColorAPI)
  const productGroupService = useAPIService<ProductGroup>(ProductGroupAPI)
  const printablePlaceService = useAPIService<PrintablePlace>(PrintablePlaceAPI)

  const colorService = useAPIService<Color>(ColorAPI)
  const groupService = useAPIService<Group>(GroupAPI)
  const printService = useAPIService<Print>(PrintAPI)
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

  const [colors, setColors] = useState<Color[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [prints, setPrints] = useState<Print[]>([])

  const [productNew, setProductNew] = useState<Product | undefined>(undefined)
  const [productColorNew, setProductColorNew] = useState<Color | undefined>(undefined)
  const [productGroupNew, setProductGroupNew] = useState<Group | undefined>(undefined)
  const [printablePlaceNew, setPrintablePlaceNew] = useState<PrintablePlace | undefined>(undefined)

  const { message } = AntApp.useApp()

  useEffect(() => {
    colorService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setColors(meta.data as Color[])
      }
    })
    groupService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setGroups(meta.data as Group[])
      }
    })
    printService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        setPrints(meta.data as Print[])
      }
    })
  }, [isEditing])

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
  }, [productNew, productColorNew, productGroupNew, printablePlaceNew])

  useEffect(() => {
    selfConvertDataSource(products, productColors, productGroups, printablePlaces)
  }, [products, productColors, productGroups, printablePlaces])

  // Create action
  // useEffect(() => {
  //   if (productNew && productColorNew && productGroupNew && printablePlaceNew) {
  //     const item = {
  //       ...productNew,
  //       key: productNew?.id,
  //       productColor: productColors.find((i) => i.id === productColorNew.id),
  //       productGroup: productGroups.find((i) => i.id === productGroupNew.id),
  //       printablePlace: printablePlaces.find((i) => i.id === printablePlaceNew.id)
  //     } as ProductTableDataType
  //     handleStartAddNew(item)
  //   }
  // }, [productNew, productColorNew, productGroupNew, printablePlaceNew])

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
        productService.updateItemByPk(
          Number(item.id!),
          {
            productCode: row.productCode,
            quantityPO: row.quantityPO,
            dateInputNPL: row.dateInputNPL,
            dateOutputFCR: row.dateOutputFCR
          },
          setLoading,
          (meta) => {
            if (meta?.success) {
              const productNew = meta.data as Product
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
        productColorService.createOrUpdateItemBy(
          { field: 'productID', key: item.key! },
          { colorID: row.colorID },
          setLoading,
          (meta) => {
            if (meta?.success) {
              const productColorUpdated = meta.data as ProductColor
              handleStartSaveEditing(item.key!, {
                productColor: {
                  ...productColorUpdated,
                  color: colors.find((i) => i.id === row.colorID)
                }
              })
              message.success('Updated!')
            } else {
              message.error('Failed!')
            }
          }
        )
      }
      if (row.groupID !== item.productGroup?.groupID) {
        console.log('ProductGroup progressing...')
        productGroupService.createOrUpdateItemBy(
          { field: 'productID', key: item.key! },
          { groupID: row.groupID },
          setLoading,
          (meta) => {
            if (meta?.success) {
              const productGroupUpdated = meta.data as ProductGroup
              handleStartSaveEditing(item.key!, {
                productGroup: {
                  ...productGroupUpdated,
                  group: groups.find((i) => i.id === row.groupID)
                }
              })
              message.success('Updated!')
            } else {
              message.error('Failed!')
            }
          }
        )
      }
      if (row.printID !== item.printablePlace?.printID) {
        console.log('PrintablePlace progressing...')
        printablePlaceService.createOrUpdateItemBy(
          { field: 'productID', key: item.key! },
          { printID: row.printID },
          setLoading,
          (meta) => {
            if (meta?.success) {
              const printablePlaceUpdated = meta.data as PrintablePlace
              handleStartSaveEditing(item.key!, {
                printablePlace: {
                  ...printablePlaceUpdated,
                  print: prints.find((i) => i.id === row.printID)
                }
              })
              message.success('Updated!')
            } else {
              message.error('Failed!')
            }
          }
        )
      }
    } catch (error) {
      console.error(error)
      message.error('Error!')
    } finally {
      setLoading(false)
      handleConfirmCancelEditing()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const selfHandleAddNewItem = async (formAddNew: any) => {
    try {
      console.log(formAddNew)
      setLoading(true)
      productService.createNewItem(
        {
          productCode: formAddNew.productCode,
          quantityPO: formAddNew.quantityPO,
          dateInputNPL: DayJS(formAddNew.dateInputNPL).format(DatePattern.iso8601),
          dateOutputFCR: DayJS(formAddNew.dateOutputFCR).format(DatePattern.iso8601)
        },
        setLoading,
        (meta, msg) => {
          if (meta?.data) {
            const productNew = meta.data as Product
            setProductNew(productNew)
            if (formAddNew.colorID) {
              console.log('Product color created')
              productColorService.createNewItem(
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
              productGroupService.createNewItem(
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
              printablePlaceService.createNewItem(
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
            message.error(msg)
          }
        }
      )
    } catch (error) {
      console.error(error)
      message.error('Failed!')
    } finally {
      setLoading(false)
      setOpenModal(false)
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
          onAddNew={selfHandleAddNewItem}
        />
      )}
    </>
  )
}

export default ProductList
