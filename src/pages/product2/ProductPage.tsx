/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import useDevice from '~/components/hooks/useDevice'
import ProductList2 from './components/ProductList'
import ProductTable from './components/ProductTable'

const ProductPage2: React.FC = () => {
  const { width } = useDevice()

  return (
    <>
      {width >= 768 && <ProductTable />}
      {width <= 768 && <ProductList2 />}
    </>
  )
}

export default ProductPage2
