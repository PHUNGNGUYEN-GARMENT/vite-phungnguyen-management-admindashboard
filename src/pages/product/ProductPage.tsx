import { Button, Flex, Form, Popconfirm, Switch, Table, Typography } from 'antd'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import ProductAPI from '~/api/services/ProductAPI'
import Status from '~/components/ui/Status'
import useTable from '~/hooks/useTable'
import { Product, StatusType } from '~/typing'
import {
  DatePattern,
  default as DayJS,
  default as dayjs
} from '~/utils/date-formatter'
import { firstLetterUppercase } from '~/utils/text'
import EditableCell, { EditableTableProps } from './components/EditableCell'
import useProduct from './hooks/useProduct'

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

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

const ProductPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const { convertToProduct } = useProduct()
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
  console.log('Product page loading...')

  useEffect(() => {
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
              size='small'
              onClick={() =>
                handleSaveEditingRow(record.id!, (row) => {
                  console.log(row)
                  ProductAPI.updateItem(
                    convertToProduct({ ...row, id: record.id! })
                  )
                    .then((data) => {
                      setLoading(true)
                      console.log(data)
                    })
                    .finally(() => {
                      setLoading(false)
                    })
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
              <Button size='small' type='dashed'>
                Cancel
              </Button>
            </Popconfirm>
          </Flex>
        ) : (
          <Flex gap={10}>
            <Button
              type='dashed'
              disabled={isDisableEditing}
              size='small'
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
                      ? dayjs(record.dateOutputFCR)
                      : ''
                  }
                ])
                handleStartEditingRow(record)
              }}
            >
              Edit
            </Button>
            {isAdmin && (
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
      width: '12%',
      editable: true
    },
    {
      title: 'Quantity PO',
      dataIndex: 'quantityPO',
      width: '15%',
      editable: true
    },
    {
      title: 'May',
      dataIndex: 'sewing',
      width: '12%',
      editable: true,
      render: (_, record: ProductTableDataType) => {
        return (
          <Status
            type={record.sewing ?? 'normal'}
            label={firstLetterUppercase(record.sewing ?? 'normal')}
          />
        )
      }
    },
    {
      title: 'Ủi',
      dataIndex: 'iron',
      editable: true,
      width: '12%',
      render: (_, record: ProductTableDataType) => {
        return (
          <Status
            type={record.iron ?? 'normal'}
            label={firstLetterUppercase(record.iron ?? 'normal')}
          />
        )
      }
    },
    {
      title: 'Kiểm tra',
      dataIndex: 'check',
      editable: true,
      width: '12%',
      render: (_, record: ProductTableDataType) => {
        return (
          <Status
            type={record.check ?? 'normal'}
            label={firstLetterUppercase(record.check ?? 'normal')}
          />
        )
      }
    },
    {
      title: 'Đóng gói',
      dataIndex: 'pack',
      editable: true,
      width: '12%',
      render: (_, record: ProductTableDataType) => {
        return (
          <Status
            type={record.pack ?? 'normal'}
            label={firstLetterUppercase(record.pack ?? 'normal')}
          />
        )
      }
    },
    {
      title: 'Date Output FCR',
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
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell
              }
            }}
            loading={loading}
            bordered
            dataSource={dataSource}
            columns={mergedColumns(isAdmin ? adminColumns : staffColumns)}
            rowClassName='editable-row'
            pagination={{
              onChange: () => {
                handleCancelEditingRow()
                handleCancelDeleteRow()
              }
            }}
          />
        </Form>
      </Flex>
    </>
  )
}

export default ProductPage
