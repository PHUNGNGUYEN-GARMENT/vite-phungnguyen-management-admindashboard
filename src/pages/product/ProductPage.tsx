import { Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { IColor } from '../color/ColorPage'

interface ProductPageProps extends React.HTMLAttributes<HTMLElement> {}

export interface IProductPageList {
  productID?: number
  productCode: string
  colors: IColor[]
  group: string
  quantityPO: number
  dateInputNPL: string
  dateOutputFCR: string
  placePrintIn: string
  createdAt: string
  updatedAt: string
}

const columns: ColumnsType<IProductPageList> = [
  {
    title: 'Mã hàng',
    dataIndex: 'productCode',
    key: 'productCode',
    render: (self) => <Typography.Text className='font-semibold'>{self}</Typography.Text>
  },
  {
    title: 'Màu',
    dataIndex: 'colors',
    key: 'colors',
    render: (colors: IColor[]) => (
      <>
        {colors.map((color) => {
          return (
            <Tag color={color.hexColor} key={color.colorID}>
              {color.nameColor}
            </Tag>
          )
        })}
      </>
    )
  },
  {
    title: 'Nhóm',
    dataIndex: 'group',
    key: 'group',
    render: (item) => <Tag color='default'>{item}</Tag>
  },
  {
    title: 'Số lượng PO',
    key: 'quantityPO',
    dataIndex: 'quantityPO'
  },
  {
    title: 'Ngày nhập NPL',
    key: 'dateInputNPL',
    dataIndex: 'dateInputNPL',
    responsive: ['md']
  },
  {
    title: 'Ngày xuất FCR',
    key: 'dateOutputFCR',
    dataIndex: 'dateOutputFCR',
    responsive: ['md']
  },
  {
    title: 'Nơi in / thêu',
    key: 'placePrintIn',
    dataIndex: 'placePrintIn',
    responsive: ['md']
  }
]

// eslint-disable-next-line no-empty-pattern
function ProductPage({}: ProductPageProps) {
  const [tableData, setTableData] = useState<IProductPageList[]>([])
  // useEffect(() => {
  //   ProductApi.listProduct().then((res) => {
  //     colorApi.colors().then((col) => {})
  //     if (res) {
  //       setProducts(res.data)
  //     }
  //   })
  // }, [])

  return (
    <div>
      {/* <Table columns={columns} dataSource={products.map((item, index) => {})} />
      {products.length} */}
    </div>
  )
}

export default ProductPage
