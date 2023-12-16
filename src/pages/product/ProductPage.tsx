import { Flex } from 'antd'
import useDevice from '~/components/hooks/useDevice'
import ProductList from './components/ProductList'

const ProductPage: React.FC = () => {
  const { width } = useDevice()

  return (
    <>
      <Flex vertical gap={20}>
        {/* {width >= 768 && <ProductTable className='' />} */}
        {width <= 768 && <ProductList className='' />}
      </Flex>
    </>
  )
}

export default ProductPage
