import { Button, Flex, Form, Popconfirm, Switch, Table, Typography } from 'antd'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import ProductAPI from '~/api/services/ProductAPI'
import Status from '~/components/ui/Status'
import useTable from '~/hooks/useTable'
import { Product, StatusType } from '~/typing'
import { dateDistance, dateFormatter } from '~/utils/date-formatter'
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

  const commonActionsCol: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Operation',
      dataIndex: 'operation',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: ProductTableDataType) => {
        // const deletable = isDelete(record as ColorTableDataType)
        return isEditing(record.key!) ? (
          <Flex className='flex flex-col gap-3 lg:flex-row'>
            <Typography.Link onClick={() => handleSaveEditingRow(record.id!)}>
              Save
            </Typography.Link>
            <Popconfirm
              title={`Sure to cancel?`}
              onConfirm={() => {
                handleCancelEditingRow()
              }}
            >
              <a>Cancel</a>
            </Popconfirm>
          </Flex>
        ) : (
          <Flex gap={30}>
            <Button
              type='dashed'
              disabled={isDisableEditing}
              onClick={() => {
                handleStartEditingRow(record)
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title={`Sure to delete?`}
              onCancel={() => handleCancelDeleteRow()}
              onConfirm={() => handleDeleteRow(record.key!)}
            >
              <Button danger onClick={() => handleStartDeleteRow(record.key!)}>
                Delete
              </Button>
            </Popconfirm>
          </Flex>
        )
      }
    }
  ]

  const adminColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      editable: false,
      responsive: ['lg']
    },
    {
      title: 'Code',
      dataIndex: 'productCode',
      editable: true
    },
    {
      title: 'Quantity PO',
      dataIndex: 'quantityPO',
      editable: true
    },
    {
      title: 'Date Input NPL',
      dataIndex: 'dateInputNPL',
      editable: true
    },
    {
      title: 'Date Output FCR',
      dataIndex: 'dateOutputFCR',
      editable: true
    },
    {
      title: 'Progress',
      dataIndex: 'state',
      editable: true,
      children: [
        {
          title: 'May',
          dataIndex: 'sewing',
          editable: true,
          render: (value, record: ProductTableDataType) => {
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
        } as ColumnTypes[number] & {
          editable?: boolean
          dataIndex: string
        },
        {
          title: 'Ủi',
          dataIndex: 'iron',
          editable: true,
          render: (value, record: ProductTableDataType) => {
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
        } as ColumnTypes[number] & {
          editable?: boolean
          dataIndex: string
        },
        {
          title: 'Kiểm tra',
          dataIndex: 'check',
          editable: true,
          render: (value, record: ProductTableDataType) => {
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
        } as ColumnTypes[number] & {
          editable?: boolean
          dataIndex: string
        },
        {
          title: 'Đóng gói',
          dataIndex: 'pack',
          editable: true,
          render: (value, record: ProductTableDataType) => {
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
        } as ColumnTypes[number] & {
          editable?: boolean
          dataIndex: string
        }
      ]
    },
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      editable: true,
      render: (value, record: ProductTableDataType) => {
        return <>{record.updatedAt}</>
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '15%',
      editable: true,
      responsive: ['md'],
      render: (value, record: ProductTableDataType) => {
        return <>{record.updatedAt}</>
      }
    },
    ...commonActionsCol
  ]

  const staffColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
      editable: false,
      responsive: ['lg']
    },
    {
      title: 'Code',
      dataIndex: 'productCode',
      editable: true
    },
    {
      title: 'Quantity PO',
      dataIndex: 'quantityPO',
      editable: true
    },
    {
      title: 'Progress',
      dataIndex: 'state',
      editable: true,
      children: [
        {
          title: 'May',
          dataIndex: 'sewing',
          editable: true,
          render: (value, record: ProductTableDataType) => {
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
        } as ColumnTypes[number] & {
          editable?: boolean
          dataIndex: string
        },
        {
          title: 'Ủi',
          dataIndex: 'iron',
          editable: true,
          render: (value, record: ProductTableDataType) => {
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
        } as ColumnTypes[number] & {
          editable?: boolean
          dataIndex: string
        },
        {
          title: 'Kiểm tra',
          editable: true,
          dataIndex: 'check',
          render: (value, record: ProductTableDataType) => {
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
        } as ColumnTypes[number] & {
          editable?: boolean
          dataIndex: string
        },
        {
          title: 'Đóng gói',
          editable: true,
          dataIndex: 'pack',
          render: (value, record: ProductTableDataType) => {
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
        } as ColumnTypes[number] & {
          editable?: boolean
          dataIndex: string
        }
      ]
    },
    {
      title: 'Ngày xuất FCR',
      dataIndex: 'dateOutputFCR',
      editable: true,
      render: (value, record: ProductTableDataType) => {
        const validData = record.dateOutputFCR ? record.dateOutputFCR : ''
        return (
          <div>
            <span>{dateFormatter(validData)}</span>
            <span className='absolute bottom-0 right-0 p-1 text-[10px]'>
              {dateDistance(new Date(validData))}
            </span>
          </div>
        )
      }
    },
    ...commonActionsCol
  ]

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
