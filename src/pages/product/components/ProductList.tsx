import { List } from 'antd'
import { useEffect } from 'react'
import { StatusType } from '~/typing'
import useProductList from '../hooks/useProductList'
import ProductListItem from './ProductListItem'

interface Props extends React.HTMLAttributes<HTMLElement> {
  isAdmin: boolean
  loading: boolean
  setLoading: (enable: boolean) => void
}

export type ProductTableDataType = {
  key?: string | number
  id?: number
  productCode?: string
  quantityPO?: number
  dateInputNPL?: string
  dateOutputFCR?: string
  sewing?: StatusType
  iron?: StatusType
  check?: StatusType
  pack?: StatusType
  createdAt?: string
  updatedAt?: string
}

const ProductList: React.FC<Props> = ({
  isAdmin,
  loading,
  setLoading,
  ...props
}) => {
  const { dataSource, metaData, requestListData } = useProductList()
  console.log('Product page loading...')

  useEffect(() => {
    requestListData()
  }, [])

  useEffect(() => {
    console.log(metaData)
  }, [metaData])

  return (
    <>
      <List
        className={props.className}
        itemLayout='vertical'
        size='large'
        pagination={{
          onChange: (page) => {
            console.log(page)
            requestListData(page, 5, setLoading)
          },
          pageSize: 5,
          total: metaData?.total
        }}
        loading={loading}
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item key={item.id} actions={[]}>
            <ProductListItem data={item} />
          </List.Item>
        )}
      />
    </>
  )
}

export default ProductList
