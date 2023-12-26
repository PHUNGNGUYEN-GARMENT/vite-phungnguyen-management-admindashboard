/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { defaultRequestBody } from '~/api/client'
import BaseLayout from '~/components/layout/BaseLayout'
import SkyList from '~/components/sky-ui/SkyList/SkyList'
import { Product } from '~/typing'
import useProduct from '../hooks/useProduct'
import { ProductTableDataType } from '../type'
import ModalAddNewProduct from './ModalAddNewProduct'
import ProductListItem from './ProductListItem'

const ProductList: React.FC = () => {
  const {
    isEditing,
    dataSource,
    loading,
    setLoading,
    searchText,
    setSearchText,
    dateCreation,
    setDateCreation,
    handleStartEditing,
    handleStartDeleting,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting,
    openModal,
    newRecord,
    setNewRecord,
    setOpenModal,
    selfConvertDataSource,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    productService
  } = useProduct()

  return (
    <>
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
          await productService.sortedListItems(
            val ? 'asc' : 'desc',
            setLoading,
            (meta) => {
              if (meta?.success) {
                selfConvertDataSource(meta?.data as Product[])
              }
            },
            { field: 'productCode', term: searchText }
          )
        }}
        onResetClick={async () => {
          setSearchText('')
          await productService.getListItems(defaultRequestBody, setLoading, (meta) => {
            if (meta?.success) {
              selfConvertDataSource(meta?.data as Product[])
            }
          })
        }}
        onAddNewClick={() => setOpenModal(true)}
      >
        <SkyList
          itemLayout='vertical'
          size='large'
          loading={loading}
          dataSource={dataSource}
          metaData={productService.metaData}
          onPageChange={handlePageChange}
          renderItem={(record: ProductTableDataType) => (
            <ProductListItem
              record={record}
              newRecord={newRecord}
              setNewRecord={setNewRecord}
              isDateCreation={dateCreation}
              isEditing={isEditing(record.key!)}
              actions={{
                onSave: {
                  onClick: () => {
                    setNewRecord(record)
                    handleSaveClick(record, newRecord)
                  }
                },
                onEdit: {
                  onClick: () => handleStartEditing(record.key!)
                },
                onDelete: {
                  onClick: () => handleStartDeleting(record.key!)
                },
                onConfirmCancelEditing: () => handleConfirmCancelEditing(),
                onConfirmCancelDeleting: () => handleConfirmCancelDeleting(),
                onConfirmDelete: () =>
                  handleConfirmDelete(record, (meta) => {
                    if (meta?.success) {
                      handleStartDeleting(record.key!)
                    }
                  })
              }}
            />
          )}
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewProduct
          setLoading={setLoading}
          loading={loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={handleAddNewItem}
        />
      )}
    </>
  )
}

export default ProductList
