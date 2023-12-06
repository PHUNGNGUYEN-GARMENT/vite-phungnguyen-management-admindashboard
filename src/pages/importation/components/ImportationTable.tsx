import {
  App as AntApp,
  Button,
  Flex,
  Form,
  Input,
  Popconfirm,
  Switch,
  Table,
  Typography
} from 'antd'
import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import useTable from '~/hooks/useTable'
import { setAdminAction } from '~/store/actions-creator'
import { RootState } from '~/store/store'
import { ItemStatusType, SewingLineDelivery } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useImportation from '../hooks/useImportation'
import EditableCell, { EditableTableProps } from './EditableCell'

const { Search } = Input

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface Props extends React.HTMLAttributes<HTMLElement> {}

export type ImportationTableDataType = {
  key?: React.Key
  id?: number
  name?: string
  status?: ItemStatusType
  createdAt?: string
  updatedAt?: string
}

const ImportationTable: React.FC<Props> = ({ ...props }) => {
  const user = useSelector((state: RootState) => state.user)

  const dispatch = useDispatch()
  const { message } = AntApp.useApp()
  const {
    metaData,
    loading,
    setOpenModal,
    searchText,
    setSearchText,
    dateCreation,
    setDateCreation,
    getDataList,
    handleUpdateItem,
    handleDeleteItem,
    handleSorted
  } = useImportation()
  const {
    form,
    editingKey,
    isEditing,
    isDisableEditing,
    dataSource,
    setDataSource,
    handleStartEditingRow,
    handleStartSaveEditingRow,
    handleCancelEditingRow,
    handleStartDeleteRow,
    handleDeleteRow,
    handleCancelDeleteRow
  } = useTable<ImportationTableDataType>([])

  console.log('ImportationTableDataType...')

  useEffect(() => {
    getDataList(defaultRequestBody, (meta) => {
      if (meta?.success) {
        setDataSource(
          meta.data.map((item: SewingLineDelivery) => {
            return {
              ...item,
              key: item.id
            } as ImportationTableDataType
          })
        )
      }
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
      render: (_, record: ImportationTableDataType) => {
        return isEditing(record.key!) ? (
          <Flex className='flex flex-col gap-3 lg:flex-row'>
            <Button
              type='primary'
              onClick={() =>
                handleStartSaveEditingRow(
                  record.id!,
                  (row: SewingLineDelivery) => {
                    handleUpdateItem(record.id!, row, (meta) => {
                      if (meta.success) {
                        message.success('Updated!')
                      }
                    })
                  }
                )
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
                form.setFields([{ name: 'name', value: record.name }])
                handleStartEditingRow(record)
              }}
            >
              Edit
            </Button>
            {user.isAdmin && (
              <Popconfirm
                title={`Sure to delete?`}
                onCancel={() => handleCancelDeleteRow()}
                onConfirm={() =>
                  handleDeleteRow(record.key!, (key) => {
                    handleDeleteItem(Number(key), (meta) => {
                      if (meta.success) {
                        message.success('Deleted!')
                      }
                    })
                  })
                }
              >
                <Button
                  disabled={editingKey !== ''}
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
      title: 'Group Name',
      dataIndex: 'name',
      width: '15%',
      editable: user.isAdmin,
      render: (_, record: ImportationTableDataType) => {
        return (
          <Typography.Text copyable className='text-md flex-shrink-0 font-bold'>
            {record.name}
          </Typography.Text>
        )
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
      render: (_, record: ImportationTableDataType) => {
        const validData = record.createdAt ? record.createdAt : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '10%',
      render: (_, record: ImportationTableDataType) => {
        const validData = record.updatedAt ? record.updatedAt : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    }
  ]

  const adminColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = dateCreation
    ? [...commonCols, ...dateCreationColumns, ...actionsCols]
    : [...commonCols, ...actionsCols]

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
        onCell: (record: ImportationTableDataType) => ({
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
      case 'name':
        return 'text'
      default:
        return ''
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
                checkedChildren='Date Creation'
                unCheckedChildren='Date Creation'
                defaultChecked={dateCreation}
                onChange={(val) => {
                  setDateCreation(val)
                }}
              />
              <Search
                name='search'
                placeholder='Search name...'
                size='middle'
                enterButton
                allowClear
                className='w-1/2'
                onSearch={(value) => {
                  if (value.length > 0) {
                    const body: RequestBodyType = {
                      ...defaultRequestBody,
                      search: {
                        field: 'name',
                        term: value
                      }
                    }
                    getDataList(body, (meta) => {
                      if (meta?.success) {
                        setDataSource(
                          meta.data.map((item: SewingLineDelivery) => {
                            return {
                              ...item,
                              key: item.id
                            } as ImportationTableDataType
                          })
                        )
                      }
                    })
                  }
                }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Flex>
            <Flex gap={10} align='center'>
              <Switch
                checkedChildren='Sorted'
                unCheckedChildren='Sorted'
                onChange={async (val) => {
                  await handleSorted(val ? 'asc' : 'desc', (meta) => {
                    if (meta.success) {
                      setDataSource(
                        meta.data.map((item: SewingLineDelivery) => {
                          return {
                            ...item,
                            key: item.id
                          } as ImportationTableDataType
                        })
                      )
                    }
                  })
                }}
              />
              <Button
                onClick={() => {
                  form.setFieldValue('search', '')
                  setSearchText('')
                  getDataList(defaultRequestBody, (meta) => {
                    if (meta?.success) {
                      setDataSource(
                        meta.data.map((item: SewingLineDelivery) => {
                          return {
                            ...item,
                            key: item.id
                          } as ImportationTableDataType
                        })
                      )
                      message.success('Reloaded!')
                    }
                  })
                }}
                className='flex items-center'
                type='default'
              >
                Reset
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
            columns={mergedColumns(user.isAdmin ? adminColumns : staffColumns)}
            rowClassName='editable-row'
            pagination={{
              onChange: (page) => {
                const body: RequestBodyType = {
                  ...defaultRequestBody,
                  paginator: {
                    page: page,
                    pageSize: 5
                  },
                  search: {
                    field: 'productCode',
                    term: searchText
                  }
                }
                getDataList(body, (meta) => {
                  if (meta?.success) {
                    setDataSource(
                      meta.data.map((item: SewingLineDelivery) => {
                        return {
                          ...item,
                          key: item.id
                        } as ImportationTableDataType
                      })
                    )
                  }
                })
                handleCancelEditingRow()
                handleCancelDeleteRow()
              },
              current: metaData?.page,
              pageSize: 5,
              total: metaData?.total
            }}
          />
        </Flex>
      </Form>
    </>
  )
}

export default ImportationTable
