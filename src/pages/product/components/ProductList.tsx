/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import useTable from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import SkyList from '~/components/sky-ui/SkyList/SkyList'
import useProduct from '../hooks/useProduct'
import { ProductTableDataType } from '../type'
import ModalAddNewProduct from './ModalAddNewProduct'
import ProductListItem from './ProductListItem'

const ProductList: React.FC = () => {
  const table = useTable<ProductTableDataType>([])

  const {
    searchText,
    setSearchText,
    newRecord,
    setNewRecord,
    openModal,
    setOpenModal,
    handleResetClick,
    handleSortChange,
    handleSearch,
    handleSaveClick,
    handleAddNewItem,
    handleConfirmDelete,
    handlePageChange,
    productService
  } = useProduct(table)

  return (
    <>
      <BaseLayout
        searchValue={searchText}
        onDateCreationChange={(enable) => table.setDateCreation(enable)}
        onSearchChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => handleSearch(value)}
        onSortChange={(checked, e) => handleSortChange(checked, e)}
        onResetClick={() => handleResetClick()}
        onAddNewClick={() => setOpenModal(true)}
      >
        <SkyList
          itemLayout='vertical'
          size='large'
          loading={table.loading}
          dataSource={table.dataSource}
          metaData={productService.metaData}
          onPageChange={handlePageChange}
          renderItem={(record: ProductTableDataType) => (
            <ProductListItem
              record={record}
              newRecord={newRecord}
              setNewRecord={setNewRecord}
              isDateCreation={table.dateCreation}
              isEditing={table.isEditing(record.key!)}
              actions={{
                onSave: {
                  onClick: () => {
                    setNewRecord(record)
                    handleSaveClick(record, newRecord)
                  }
                },
                onEdit: {
                  onClick: () => {
                    setNewRecord(record)
                    table.handleStartEditing(record!.key!)
                  }
                },
                onDelete: {
                  onClick: () => table.handleStartDeleting(record.key!)
                },
                onConfirmCancelEditing: () => table.handleConfirmCancelEditing(),
                onConfirmCancelDeleting: () => table.handleConfirmCancelDeleting(),
                onConfirmDelete: () => handleConfirmDelete(record)
              }}
            />
          )}
        />
      </BaseLayout>
      {openModal && (
        <ModalAddNewProduct
          setLoading={table.setLoading}
          loading={table.loading}
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={handleAddNewItem}
        />
      )}
    </>
  )
}

export default ProductList
