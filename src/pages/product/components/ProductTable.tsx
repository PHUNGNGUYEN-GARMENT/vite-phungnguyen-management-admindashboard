import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Switch,
  Table,
  Typography
} from 'antd'
import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import ProductAPI from '~/api/services/ProductAPI'
import ProgressBar from '~/components/ui/ProgressBar'
import useTable from '~/hooks/useTable'
import { Product } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useProduct from '../hooks/useProduct'
import AddNewProduct from './AddNewProduct'
import EditableCell, { EditableTableProps } from './EditableCell'

const { Search } = Input

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface Props extends React.HTMLAttributes<HTMLElement> {}

export type ProductTableDataType = {
  key?: React.Key
  id?: number
  productCode?: string
  quantityPO?: number
  dateInputNPL?: string
  dateOutputFCR?: string
  sewing?: number
  iron?: number
  check?: number
  pack?: number
  createdAt?: string
  updatedAt?: string
}

const ProductTable: React.FC<Props> = ({ ...props }) => {
  const {
    admin,
    setAdmin,
    loading,
    // setLoading,
    openModal,
    setOpenModal,
    searchText,
    setSearchText,
    handleAddNew
  } = useProduct()
  const {
    form,
    isEditing,
    isDisableEditing,
    dataSource,
    setDataSource,
    handleStartEditingRow,
    handleSaveEditingRow,
    handleCancelEditingRow,
    handleStartDeleteRow,
    handleDeleteRow,
    handleCancelDeleteRow
  } = useTable<ProductTableDataType>([])
  useEffect(() => {
    console.log('Product table loading...')
    ProductAPI.getAlls().then((data) => {
      if (data?.success) {
        console.log(data)
        setDataSource(
          data.data.map((item: Product) => {
            return { ...item, key: item.id } as ProductTableDataType
          })
        )
      }
    })
  }, [])

  const commonActionsCol: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Operation',
      width: 'auto',
      dataIndex: 'operation',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_, record: ProductTableDataType) => {
        return isEditing(record.key!) ? (
          <Flex className='flex flex-col gap-3 lg:flex-row'>
            {/* <Typography.Link onClick={() => handleSaveEditingRow(record.id!)}>
              Save
            </Typography.Link> */}
            <Button
              type='primary'
              onClick={() =>
                handleSaveEditingRow(record.id!, (row) => {
                  console.log(row)
                  // ProductAPI.updateItem(record.id!, convertToProduct(row))
                  //   .then((data) => {
                  //     setLoading(true)
                  //     console.log(data)
                  //   })
                  //   .finally(() => {
                  //     setLoading(false)
                  //   })
                })
              }
            >
              Save
            </Button>
            <Popconfirm
              title={`Sure to cancel?`}
              onConfirm={() => {
                handleCancelEditingRow()
              }}
            >
              {/* <Typography.Link>Cancel</Typography.Link> */}
              <Button type='dashed'>Cancel</Button>
            </Popconfirm>
          </Flex>
        ) : (
          <Flex gap={10}>
            <Button
              type='primary'
              disabled={isDisableEditing}
              onClick={() => {
                form.setFields([
                  { name: 'productCode', value: record.productCode },
                  { name: 'quantityPO', value: record.quantityPO },
                  {
                    name: 'sewing',
                    value: record.sewing
                  },
                  { name: 'iron', value: record.iron },
                  { name: 'check', value: record.check },
                  { name: 'pack', value: record.pack },
                  {
                    name: 'dateOutputFCR',
                    value: record.dateOutputFCR
                      ? DayJS(record.dateOutputFCR)
                      : ''
                  }
                ])
                handleStartEditingRow(record)
              }}
            >
              Edit
            </Button>
            {admin && (
              <Popconfirm
                title={`Sure to delete?`}
                onCancel={() => handleCancelDeleteRow()}
                onConfirm={() => handleDeleteRow(record.key!)}
              >
                <Typography.Link
                  onClick={() => handleStartDeleteRow(record.key!)}
                >
                  Delete
                </Typography.Link>
              </Popconfirm>
            )}
          </Flex>
        )
      }
    }
  ]

  const commonCols: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Code',
      dataIndex: 'productCode',
      width: '10%',
      editable: true
    },
    {
      title: 'Quantity PO',
      dataIndex: 'quantityPO',
      width: '10%',
      editable: true
    },
    {
      title: 'May',
      dataIndex: 'sewing',
      width: '15%',
      editable: true,
      render: (_, record: ProductTableDataType) => {
        return (
          <>
            <Flex className='w-full' align='center' vertical>
              <ProgressBar
                count={record.sewing ?? 0}
                total={record.quantityPO ?? 0}
              />
              <Typography.Text type='secondary' className='w-24 font-medium'>
                {record.sewing ?? 0}/{record.quantityPO ?? 0}
              </Typography.Text>
            </Flex>
          </>
        )
      }
    },
    {
      title: 'Ủi',
      dataIndex: 'iron',
      editable: true,
      width: '15%',
      render: (_, record: ProductTableDataType) => {
        return (
          <>
            <Flex className='w-full' align='center' vertical>
              <ProgressBar
                count={record.iron ?? 0}
                total={record.quantityPO ?? 0}
              />
              <Typography.Text type='secondary' className='w-24 font-medium'>
                {record.iron ?? 0}/{record.quantityPO ?? 0}
              </Typography.Text>
            </Flex>
          </>
        )
      }
    },
    {
      title: 'Kiểm tra',
      dataIndex: 'check',
      editable: true,
      width: '15%',
      render: (_, record: ProductTableDataType) => {
        return (
          <>
            <Flex className='w-full' align='center' vertical>
              <ProgressBar
                count={record.check ?? 0}
                total={record.quantityPO ?? 0}
              />
              <Typography.Text type='secondary' className='w-24 font-medium'>
                {record.check ?? 0}/{record.quantityPO ?? 0}
              </Typography.Text>
            </Flex>
          </>
        )
      }
    },
    {
      title: 'Đóng gói',
      dataIndex: 'pack',
      editable: true,
      width: '15%',
      render: (_, record: ProductTableDataType) => {
        return (
          <>
            <Flex className='w-full' align='center' vertical>
              <ProgressBar
                count={record.pack ?? 0}
                total={record.quantityPO ?? 0}
              />
              <Typography.Text type='secondary' className='w-24 font-medium'>
                {record.pack ?? 0}/{record.quantityPO ?? 0}
              </Typography.Text>
            </Flex>
          </>
        )
      }
    },
    {
      title: 'FCR',
      dataIndex: 'dateOutputFCR',
      width: '15%',
      editable: true,
      render: (_, record: ProductTableDataType) => {
        const validData = record.dateOutputFCR ? record.dateOutputFCR : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    }
  ]

  const adminColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    ...commonCols,
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      editable: true,
      render: (_, record: ProductTableDataType) => {
        const validData = record.createdAt ? record.createdAt : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '15%',
      editable: true,
      responsive: ['md'],
      render: (_, record: ProductTableDataType) => {
        const validData = record.updatedAt ? record.updatedAt : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    },
    ...commonActionsCol
  ]

  const staffColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [...commonCols, ...commonActionsCol]

  const mergedColumns = (
    cols: (ColumnTypes[number] & {
      editable?: boolean
      dataIndex: string
    })[]
  ): ColumnTypes => {
    return cols.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: (record: ProductTableDataType) => ({
          record,
          inputType: onCellColumnType(col.dataIndex),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record.key!)
        })
      }
    }) as ColumnTypes
  }

  const onCellColumnType = (dataIndex: string): string => {
    switch (dataIndex) {
      case 'productCode':
        return 'text'
      case 'quantityPO':
        return 'number'
      case 'dateInputNPL' && 'dateInputFCR':
        return 'datepicker'
      case 'status':
        return 'select'
      default:
        return 'text'
    }
  }

  return (
    <>
      <Form {...props} form={form} component={false}>
        <Flex vertical gap={20}>
          <Flex
            justify='space-between'
            align='center'
            className='rounded-sm bg-white px-5 py-3'
          >
            <Flex gap={10} className='m-0 w-full' align='center'>
              <Switch
                checkedChildren='Admin'
                unCheckedChildren='Admin'
                defaultChecked={false}
                onChange={(val) => {
                  setAdmin(val)
                }}
              />
              <Form.Item name='search' className='m-0 w-1/2'>
                <Search
                  placeholder='Search code...'
                  size='middle'
                  enterButton
                  allowClear
                  onSearch={(value) => {
                    if (value.length > 0) {
                      // querySearchData(value)
                    }
                  }}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Form.Item>
            </Flex>
            <Flex gap={10}>
              {searchText.length !== 0 && (
                <Button
                  onClick={() => {
                    form.setFieldValue('search', '')
                    // requestListData()
                  }}
                  className='flex items-center'
                  type='default'
                >
                  Reset
                </Button>
              )}
              <Button
                onClick={() => {
                  setOpenModal(true)
                }}
                className='flex items-center'
                type='primary'
                icon={<Plus size={20} />}
              >
                New
              </Button>
            </Flex>
          </Flex>
          <Table
            components={{
              body: {
                cell: EditableCell
              }
            }}
            loading={loading}
            bordered
            dataSource={dataSource}
            columns={mergedColumns(admin ? adminColumns : staffColumns)}
            rowClassName='editable-row'
            pagination={{
              onChange: () => {
                handleCancelEditingRow()
                handleCancelDeleteRow()
              }
            }}
          />
        </Flex>
      </Form>
      <Modal
        open={openModal}
        onOk={() => handleAddNew(form)}
        centered
        width='auto'
        onCancel={() => {
          setOpenModal(false)
        }}
      >
        <AddNewProduct />
      </Modal>
    </>
  )
}

export default ProductTable
