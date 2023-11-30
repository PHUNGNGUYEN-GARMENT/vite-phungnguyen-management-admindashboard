import { Flex } from 'antd'
import { useState } from 'react'
import useDevice from '~/hooks/useDevice'
import ProductList from './components/ProductList'
import ProductTable from './components/ProductTable'

const ProductPage: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { width } = useDevice()

  return (
    <>
      <Flex vertical gap={20}>
        {width >= 640 && (
          <ProductTable
            isAdmin={isAdmin}
            loading={loading}
            setLoading={setLoading}
            className='hidden md:block'
          />
        )}
        <ProductList
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          loading={loading}
          setLoading={setLoading}
          className='block md:hidden'
        />
      </Flex>
    </>
  )
}

export default ProductPage
