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
import useAPICaller from '~/hooks/useAPICaller'
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
  const { message } = AntApp.useApp()
  console.log('Product page loading...')

  useEffect(() => {
    productService.getListItems(defaultRequestBody, (meta) => {
      if (meta?.success) {
        const products = meta.data as Product[]
        productColorService.getListItems(defaultRequestBody, (meta2) => {
          const productColors = meta2?.data as ProductColor[]
          setDataSource(
            products.map((item: Product) => {
              return {
                ...item,
                productColor: productColors.find((col) => col.productID === item.id),
                key: item.id
              } as TableItemWithKey<ProductTableDataType>
            })
          )
        })
      }
    })
  }, [])

  const selfHandleSaveClick = async (item: TableItemWithKey<ProductTableDataType>) => {
    const row = (await form.validateFields()) as any
    console.log(row)
    productService.updateItemByPk(
      item.id ?? Number(item.key),
      {
        productCode: row.productCode,
        quantityPO: row.quantityPO,
        dateInputNPL: row.dateInputNPL,
        dateOutputFCR: row.dateOutputFCR
      },
      (meta) => {
        if (meta?.success) {
          const color = meta.data as Product
          handleStartSaveEditing(color.id ?? Number(item.key), color, () => {
            message.success('Updated!')
          })
        } else {
          message.error('Failed!')
        }
      }
    )

    productColorService.getItemBy(
      {
        field: 'productID',
        key: item.id!
      },
      (meta) => {
        if (meta?.success) {
          productColorService.updateItemBy(
            {
              field: 'productID',
              key: item.id!
            },
            { colorID: row.colorID },
            (meta2) => {
              if (meta2?.success) {
                console.log('ProductColor updated successfully')
              }
            }
          )
        } else {
          productColorService.createNewItem({ productID: item.id, colorID: row.colorID, status: 'active' }, (meta3) => {
            if (meta3?.success) {
              console.log('ProductColor created')
            }
          })
        }
      }
    )
  }

  //   {
  //     "title": "ASO-413123",
  //     "hexColor": 12,
  //     "quantityPo": 1243,
  //     "dateInputNPL": "2023-12-01T09:06:08.122Z",
  //     "dateOutputFCR": "2023-12-01T09:06:10.291Z",
  //     "groupID": 5,
  //     "print": 2
  // }

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
                (meta) => {
                  if (meta?.success) {
                    handleConvertDataSource(meta)
                  }
                }
              )
            }
          }}
          onSortChange={(val) => {
            productService.sortedListItems(val ? 'asc' : 'desc', (meta) => {
              if (meta?.success) {
                handleConvertDataSource(meta)
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            productService.getListItems(defaultRequestBody, (meta) => {
              if (meta?.success) {
                handleConvertDataSource(meta)
              }
            })
          }}
          onAddNewClick={() => setOpenModal(true)}
        >
          <List
            className={props.className}
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
                productService.getListItems(body, (meta) => {
                  if (meta?.success) {
                    handleConvertDataSource(meta)
                  }
                })
              },
              current: productService.metaData?.page,
              pageSize: 5,
              total: productService.metaData?.total
            }}
            loading={productService.loading}
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
                  productService.deleteItemByPk(item.id!, (meta) => {
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
            productService.createNewItem(addNewForm, (meta) => {
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
