import { Button, Flex, Form, Popconfirm, Switch, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import ProductAPI from '~/api/services/ProductAPI'
import Status from '~/components/ui/Status'
import useTable from '~/hooks/useTable'
import { Product, StatusType } from '~/typing'
import { firstLetterUppercase } from '~/utils/text'
import EditableCell, { EditableTableProps } from './components/EditableCell'

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

export type ProductTableDataType = {
  key?: string | number
  id?: number
  productCode?: string
  quantityPO?: number
  dateInputNPL?: string
  dateOutputFCR?: string
  status?: {
    name: string
    type: StatusType
  }[]
  createdAt?: string
  updatedAt?: string
}

const ProductPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const {
    form,
    isEditing,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const matchedStatusType = (
    record: ProductTableDataType,
    nameField: string
  ): string => {
    if (record.status) {
      const itemFind = record.status.find((item) => item.name === nameField)
      return itemFind?.type || ''
    }
    return ''
  }

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
              onClick={() => handleSaveEditingRow(record.id!)}
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
              type='dashed'
              disabled={isDisableEditing}
              onClick={() => {
                form.setFields([
                  { name: 'productCode', value: record.productCode },
                  { name: 'quantityPO', value: record.quantityPO },
                  {
                    name: 'sewing',
                    value: record.status
                      ? record.status.find((item) => item.name === 'sewing')
                          ?.type
                      : ''
                  },
                  { name: 'iron', value: matchedStatusType(record, 'iron') },
                  { name: 'check', value: matchedStatusType(record, 'check') },
                  { name: 'pack', value: matchedStatusType(record, 'pack') },
                  {
                    name: 'dateOutputFCR',
                    value: record.dateOutputFCR
                      ? dayjs(record.dateOutputFCR)
                          .toISOString()
                          .format('DD/MM/YYYY')
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
        const validData = record.status ? record.status : []
        return (
          <>
            <Status
              type={validData[0].type}
              label={firstLetterUppercase(validData[0].type)}
            />
          </>
        )
      }
    },
    {
      title: 'Ủi',
      dataIndex: 'iron',
      editable: true,
      width: '12%',
      render: (_, record: ProductTableDataType) => {
        const validData = record.status ? record.status : []
        return (
          <>
            <Status
              type={validData[1].type}
              label={firstLetterUppercase(validData[1].type)}
            />
          </>
        )
      }
    },
    {
      title: 'Kiểm tra',
      dataIndex: 'check',
      editable: true,
      width: '12%',
      render: (_, record: ProductTableDataType) => {
        const validData = record.status ? record.status : []
        return (
          <>
            <Status
              type={validData[2].type}
              label={firstLetterUppercase(validData[2].type)}
            />
          </>
        )
      }
    },
    {
      title: 'Đóng gói',
      dataIndex: 'pack',
      editable: true,
      width: '12%',
      render: (_, record: ProductTableDataType) => {
        const validData = record.status ? record.status : []
        return (
          <>
            <Status
              type={validData[3].type}
              label={firstLetterUppercase(validData[3].type)}
            />
          </>
        )
      }
    },
    {
      title: 'Date Output FCR',
      dataIndex: 'dateOutputFCR',
      width: '15%',
      editable: true
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
        return <>{record.updatedAt}</>
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '15%',
      editable: true,
      responsive: ['md'],
      render: (_, record: ProductTableDataType) => {
        return <>{record.updatedAt}</>
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
        responsive: col.responsive,
        onCell: (record: ProductTableDataType) => ({
          record,
          inputType: onCellColumnType(col.dataIndex),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record.key!),
          responsive: col.responsive
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
