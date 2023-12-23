/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import useDevice from '~/components/hooks/useDevice'
import ProductList2 from './components/ProductList'

const ProductPage2: React.FC = () => {
  const { width } = useDevice()

  return (
    <>
      {/* {width >= 768 && (
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
      )} */}
      {width <= 768 && <ProductList2 />}
    </>
  )
}

export default ProductPage2
