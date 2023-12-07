import { App as AntApp, Form, List } from 'antd'
import React, { useEffect } from 'react'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import BaseLayout from '~/components/layout/BaseLayout'
import useList, { ListDataType } from '~/hooks/useList'
import { Product } from '~/typing'
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
    handleCancelEditing,
    handleConfirmCancelDeleting
  } = useList<ProductTableDataType>([])
  const { message } = AntApp.useApp()
  console.log('Product page loading...')

  useEffect(() => {
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
      }
    })
  }, [])

  // Nơi tập hợp function xử lý những case chung

  function handleSearch(value: string) {
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
  }

  function handleSortChange(value: boolean) {
    handleSorted(value ? 'asc' : 'desc', (meta) => {
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
  }

  function handleReset() {
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
  }

  function handlePaginationChange(page: number) {
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
  }

  function handleSaveClick(item: ListDataType<ProductTableDataType>) {
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
            message.success('Updated!')
          }
        }
      )
    })
  }

  function handleConfirmDelete(item: ListDataType<ProductTableDataType>) {
    setLoading(true)
    handleStartDeleting(item.key!, (productToDelete) => {
      handleDeleteProductItem(Number(productToDelete.key), (meta) => {
        if (meta.success) {
          setLoading(false)
          message.success('Deleted!')
        }
      })
    })
  }

  return (
    <>
      <Form form={form} {...props}>
        <BaseLayout
          onSearch={(value) => handleSearch(value)}
          searchValue={searchText}
          onSearchChange={(e) => setSearchText(e.target.value)}
          onSortChange={(val) => handleSortChange(val)}
          onResetClick={() => handleReset()}
          onAddNewClick={() => setOpenModal(true)}
        >
          <List
            className={props.className}
            itemLayout='vertical'
            size='large'
            pagination={{
              onChange: (page) => handlePaginationChange(page),
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
                onSaveClick={() => handleSaveClick(item)}
                onClickStartEditing={() => handleStartEditing(item.key!)}
                onConfirmCancelEditing={() => handleCancelEditing()}
                onConfirmCancelDeleting={() => handleConfirmCancelDeleting()}
                onConfirmDelete={() => handleConfirmDelete(item)}
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
