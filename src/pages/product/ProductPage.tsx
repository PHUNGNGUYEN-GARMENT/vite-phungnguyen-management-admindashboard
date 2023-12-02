import { Flex } from 'antd'
import useDevice from '~/hooks/useDevice'
import ProductList from './components/ProductList'
import ProductTable from './components/ProductTable'

const ProductPage: React.FC = () => {
  const { width } = useDevice()

  return (
    <>
      <Flex vertical gap={20}>
        {width >= 640 && <ProductTable className='hidden md:block' />}
        <ProductList className='block md:hidden' />
      </Flex>
    </>
  )
}

export default ProductPage
