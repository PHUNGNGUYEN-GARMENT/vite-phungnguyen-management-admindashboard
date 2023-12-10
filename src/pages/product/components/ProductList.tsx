import { App as AntApp, Form, List } from 'antd'
import React, { useEffect } from 'react'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import ProductColorAPI from '~/api/services/ProductColorAPI'
import BaseLayout from '~/components/layout/BaseLayout'
import useList from '~/hooks/useList'
import { Product, ProductColor } from '~/typing'
import useProduct from '../hooks/useProduct'
import { ProductTableDataType } from '../type'
import ModalAddNewProduct from './ModalAddNewProduct'
import ProductListItem from './ProductListItem'

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ProductList: React.FC<Props> = ({ ...props }) => {
  const {
    metaData,
    loading,
    setLoading,
    openModal,
    setOpenModal,
    searchText,
    setSearchText,
    handleAddNewProduct,
    getProductList,
    handleUpdateProductItem,
    handleDeleteProductItem,
    handleSorted
  } = useProduct()
  const {
    form,
    editingKey,
    setDeleteKey,
    dataSource,
    setDataSource,
    isEditing,
    handleStartDeleting,
    handleStartSaveEditing,
    handleStartEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useList<ProductTableDataType>([])
  const { message } = AntApp.useApp()
  console.log('Product page loading...')

  useEffect(() => {
    getProductList(defaultRequestBody, async (meta) => {
      if (meta?.success) {
        const products = meta.data as Product[]
        await ProductColorAPI.getItems({
          ...defaultRequestBody,
          filter: {
            status: 'active',
            field: 'productID',
            items: products.map((item) => item.id) as number[]
          }
        }).then((productColorMeta) => {
          if (productColorMeta?.success) {
            const productColors = productColorMeta.data as ProductColor[]
            setDataSource(
              meta.data.map((item: Product) => {
                return {
                  ...item,
                  productColor: productColors.find(
                    (col) => col.productID === item.id
                  ),
                  key: item.id
                } as ProductTableDataType
              })
            )
          }
        })
      }
    })
  }, [])

  return (
    <>
      <Form form={form} {...props}>
        <BaseLayout
          onSearch={(value) => {
            if (value.length > 0) {
              const body: RequestBodyType = {
                ...defaultRequestBody,
                search: {
                  field: 'productCode',
                  term: value
                }
              }
              getProductList(body, (meta) => {
                if (meta?.success) {
                  setDataSource(
                    meta.data.map((item: Product) => {
                      return {
                        ...item,
                        key: item.id
                      } as ProductTableDataType
                    })
                  )
                }
              })
            }
          }}
          searchValue={searchText}
          onSearchChange={(e) => setSearchText(e.target.value)}
          onSortChange={(val) => {
            handleSorted(val ? 'asc' : 'desc', (meta) => {
              if (meta.success) {
                setDataSource(
                  meta.data.map((item: Product) => {
                    return {
                      ...item,
                      key: item.id
                    } as ProductTableDataType
                  })
                )
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            setSearchText('')
            getProductList(defaultRequestBody, (meta) => {
              if (meta?.success) {
                setDataSource(
                  meta.data.map((item: Product) => {
                    return {
                      ...item,
                      key: item.id
                    } as ProductTableDataType
                  })
                )
                message.success('Reloaded!')
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
              onChange: (page) => {
                const body: RequestBodyType = {
                  ...defaultRequestBody,
                  paginator: {
                    page: page,
                    pageSize: 5
                  },
                  search: {
                    field: 'productCode',
                    term: searchText
                  }
                }
                getProductList(body, (meta) => {
                  if (meta?.success) {
                    setDataSource(
                      meta.data.map((item: Product) => {
                        return {
                          ...item,
                          key: item.id
                        } as ProductTableDataType
                      })
                    )
                  }
                })
              },
              current: metaData?.page,
              pageSize: 5,
              total: metaData?.total
            }}
            loading={loading}
            dataSource={dataSource}
            renderItem={(item) => (
              <ProductListItem
                data={item}
                editingKey={editingKey}
                isEditing={isEditing(item.key!)}
                onSaveClick={() => {
                  handleStartSaveEditing(item.key!, (productToSave) => {
                    console.log(productToSave)
                    handleUpdateProductItem(
                      Number(item.key),
                      {
                        productCode: productToSave.productCode,
                        quantityPO: productToSave.quantityPO,
                        dateOutputFCR: productToSave.dateOutputFCR,
                        dateInputNPL: productToSave.dateInputNPL
                      },
                      (meta) => {
                        if (meta.success) {
                          // ProductColorAPI.updateItemByProductID(
                          //   Number(item.data.key),
                          //   {
                          //     : hexColor
                          //   }
                          // )
                          message.success('Updated!')
                        }
                      }
                    )
                  })
                }}
                onClickStartEditing={() => handleStartEditing(item.key!)}
                onConfirmCancelEditing={() => handleConfirmCancelEditing()}
                onConfirmCancelDeleting={() => handleConfirmCancelDeleting()}
                onConfirmDelete={() => {
                  setLoading(true)
                  handleStartDeleting(item.key!, (productToDelete) => {
                    handleDeleteProductItem(
                      Number(productToDelete.key),
                      (meta) => {
                        if (meta.success) {
                          setLoading(false)
                          message.success('Deleted!')
                        }
                      }
                    )
                  })
                }}
                onStartDeleting={() => setDeleteKey(item.key)}
              />
            )}
          />
        </BaseLayout>
      </Form>
      {openModal && (
        <ModalAddNewProduct
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(_form) => {
            handleAddNewProduct(_form, (meta) => {
              if (meta.success) {
                const data = meta?.data as Product
                const newDataSource = [...dataSource]
                console.log({ newDataSource, data })
                // newDataSource.unshift(data)
                // setDataSource(newDataSource)
                // message.success('Success!', 1)
              }
            })
          }}
        />
      )}
    </>
  )
}

export default ProductList
