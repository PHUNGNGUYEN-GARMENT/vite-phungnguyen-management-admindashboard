import {
  App as AntApp,
  Button,
  Flex,
  Form,
  Input,
  List,
  Popconfirm,
  Switch,
  Table,
  Typography
} from 'antd'
import { ArrowDownUp, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductAPI from '~/api/services/ProductAPI'
import ProgressBar from '~/components/ui/ProgressBar'
import useTable from '~/hooks/useTable'
import { setAdminAction } from '~/store/actions-creator'
import { RootState } from '~/store/store'
import { Product } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useProduct from '../hooks/useProduct'
import EditableCell, { EditableTableProps } from './EditableCell'
import ModalAddNewProduct from './ModalAddNewProduct'

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
  progress?: {
    sewing?: number
    iron?: number
    check?: number
    pack?: number
  }
  createdAt?: string
  updatedAt?: string
}

const ProductTable: React.FC<Props> = ({ ...props }) => {
  const user = useSelector((state: RootState) => state.user)
  const [dateCreation, setDateCreation] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { message } = AntApp.useApp()
  const {
    metaData,
    querySearchData,
    loading,
    setLoading,
    openModal,
    setOpenModal,
    searchText,
    setSearchText,
    handleAddNew,
    fetchDataList
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
    fetchDataList(undefined, undefined, undefined, (data) => {
      setDataSource(
        data.data.map((item: Product) => {
          return { ...item, key: item.id } as ProductTableDataType
        })
      )
    })
  }, [])

  const actionsCols: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Operation',
      width: '15%',
      dataIndex: 'operation',
      render: (_, record: ProductTableDataType) => {
        return isEditing(record.key!) ? (
          <Flex className='flex flex-col gap-3 lg:flex-row'>
            <Button
              type='primary'
              onClick={() =>
                handleSaveEditingRow(record.id!, (row) => {
                  console.log(row)
                  ProductAPI.updateItem(record.id!, row)
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
                    value: record.progress?.sewing
                  },
                  { name: 'iron', value: record.progress?.iron },
                  { name: 'check', value: record.progress?.check },
                  { name: 'pack', value: record.progress?.pack },
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
            {user.isAdmin && (
              <Popconfirm
                title={`Sure to delete?`}
                onCancel={() => handleCancelDeleteRow()}
                onConfirm={() => handleDeleteRow(record.key!)}
              >
                <Button
                  type='dashed'
                  onClick={() => handleStartDeleteRow(record.key!)}
                >
                  Delete
                </Button>
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
      editable: user.isAdmin,
      render: (_, record: ProductTableDataType) => {
        return (
          <Typography.Text copyable className='text-md flex-shrink-0 font-bold'>
            {record.productCode}
          </Typography.Text>
        )
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantityPO',
      width: '12%',
      editable: true
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      width: '25%',
      render: (_, record: ProductTableDataType) => {
        const progressArr: { task: string; quantity: number }[] = [
          {
            task: 'Sewing',
            quantity: record.progress?.sewing ?? 0
          },
          {
            task: 'Iron',
            quantity: record.progress?.iron ?? 0
          },
          {
            task: 'Check',
            quantity: record.progress?.check ?? 0
          },
          {
            task: 'Pack',
            quantity: record.progress?.pack ?? 0
          }
        ]
        return (
          <Flex vertical>
            <List className='list-none'>
              {progressArr.map((item, index) => {
                return (
                  <List.Item key={index} className='m-0 p-0'>
                    <Flex className='m-0 w-full p-0'>
                      <Typography.Text className='m-0 w-16 flex-shrink-0 p-0'>
                        {item.task}
                      </Typography.Text>
                      <Flex className='w-full' align='center' vertical>
                        <ProgressBar
                          count={item.quantity ?? 0}
                          total={record.quantityPO ?? 0}
                        />
                        <Typography.Text
                          type='secondary'
                          className='w-24 font-medium'
                        >
                          {item.quantity ?? 0}/{record.quantityPO ?? 0}
                        </Typography.Text>
                      </Flex>
                    </Flex>
                  </List.Item>
                )
              })}
            </List>
          </Flex>
        )
      }
    },
    {
      title: 'FCR',
      dataIndex: 'dateOutputFCR',
      width: '10%',
      editable: true,
      render: (_, record: ProductTableDataType) => {
        const validData = record.dateOutputFCR ? record.dateOutputFCR : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    }
  ]

  const dateCreationColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      width: '10%',
      render: (_, record: ProductTableDataType) => {
        const validData = record.createdAt ? record.createdAt : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '10%',
      responsive: ['md'],
      render: (_, record: ProductTableDataType) => {
        const validData = record.updatedAt ? record.updatedAt : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    }
  ]

  const adminColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [...commonCols, ...actionsCols]

  const staffColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [...commonCols]

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
                defaultChecked={user.isAdmin}
                onChange={(val) => {
                  dispatch(setAdminAction(val))
                }}
              />
              <Switch
                checkedChildren='Date'
                unCheckedChildren='Date'
                defaultChecked={dateCreation}
                onChange={(val) => {
                  setDateCreation(val)
                }}
              />
              <Search
                placeholder='Search code...'
                size='middle'
                enterButton
                allowClear
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onSearch={(value, _event, info) => {
                  if (value.length > 0) {
                    querySearchData(value, (meta) => {
                      setDataSource(
                        meta.data.map((item: Product) => {
                          return {
                            ...item,
                            key: item.id
                          } as ProductTableDataType
                        })
                      )
                    })
                  }
                  if (info?.source === 'clear') {
                    fetchDataList(1, 5, setLoading, (meta) => {
                      setDataSource(
                        meta.data.map((item: Product) => {
                          return {
                            ...item,
                            key: item.id
                          } as ProductTableDataType
                        })
                      )
                    })
                  }
                }}
                className='w-1/2'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Flex>
            <Flex gap={10}>
              {searchText.length > 0 && (
                <Button
                  onClick={() => {
                    form.setFieldValue('search', '')
                    fetchDataList()
                  }}
                  className='flex items-center'
                  type='default'
                >
                  Reset
                </Button>
              )}
              <Button
                onClick={() => {
                  fetchDataList(1, 5, setLoading, (data) => {
                    setDataSource(
                      data.data.map((item: Product) => {
                        return { ...item, key: item.id } as ProductTableDataType
                      })
                    )
                  })
                }}
                className='flex items-center'
                type='dashed'
                icon={<ArrowDownUp size={20} />}
              >
                Sort
              </Button>
              {user.isAdmin && (
                <Flex gap={10} align='center'>
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
              )}
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
            columns={mergedColumns(
              user.isAdmin
                ? dateCreation
                  ? [...commonCols, ...dateCreationColumns, ...actionsCols]
                  : adminColumns
                : staffColumns
            )}
            rowClassName='editable-row'
            pagination={{
              onChange: (page) => {
                fetchDataList(page, 5, setLoading, (data) => {
                  setDataSource(
                    data.data.map((item: Product) => {
                      return { ...item, key: item.id } as ProductTableDataType
                    })
                  )
                })
                handleCancelEditingRow()
                handleCancelDeleteRow()
              },
              pageSize: 5,
              total: metaData?.total
            }}
          />
        </Flex>
      </Form>
      <ModalAddNewProduct
        openModal={openModal}
        setOpenModal={setOpenModal}
        onAddNew={(_form) => {
          handleAddNew(_form, (data) => {
            if (data.success) {
              console.log(data)
              message.success('Success!', 1)
              // const productNew: Product = data.data
              // const newData = [...dataSource]
              // const item = {
              //   ...productNew,
              //   key: productNew.id
              // } as ProductTableDataType
              // const itemTable: TableDataType<ProductTableDataType> = {
              //   data: { ...item },
              //   key: productNew.id!
              // }
              // newData.push(itemTable)
              // console.log(newData)
              // setDataSource(newData)
              // showMessage()
            }
          })
        }}
      />
    </>
  )
}

export default ProductTable
