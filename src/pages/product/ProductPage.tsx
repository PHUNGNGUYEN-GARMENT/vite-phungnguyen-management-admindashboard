import { Button, Flex, Switch } from 'antd'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import ProductList from './components/ProductList'
import ProductTable from './components/ProductTable'

const ProductPage: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <>
      <Flex vertical>
        <Flex justify='space-between' align='end'>
          <Switch
            checkedChildren='Admin'
            unCheckedChildren='Admin'
            defaultChecked={false}
            checked={isAdmin}
            onChange={setIsAdmin}
          />
          <Button
            onClick={() => {}}
            className='flex items-center'
            type='primary'
            icon={<Plus size={20} />}
          >
            New
          </Button>
        </Flex>
        <ProductTable
          isAdmin={isAdmin}
          loading={loading}
          setLoading={setLoading}
          className='hidden md:block'
        />
        <ProductList
          isAdmin={isAdmin}
          loading={loading}
          setLoading={setLoading}
          className='block md:hidden'
        />
      </Flex>
    </>
  )
}

export default ProductPage
