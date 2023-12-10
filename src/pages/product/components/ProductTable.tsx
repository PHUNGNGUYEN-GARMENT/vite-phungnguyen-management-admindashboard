import {
  App as AntApp,
  Button,
  Flex,
  Form,
  List,
  Popconfirm,
  Table,
  Typography
} from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import BaseLayout from '~/components/layout/BaseLayout'
import ProgressBar from '~/components/ui/ProgressBar'
import useTable from '~/hooks/useTable'
import { RootState } from '~/store/store'
import { Product } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useProduct from '../hooks/useProduct'
import { ProductTableDataType } from '../type'
import EditableCell, { EditableTableProps } from './EditableCell'
import ModalAddNewProduct from './ModalAddNewProduct'

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ProductTable: React.FC<Props> = ({ ...props }) => {
  const user = useSelector((state: RootState) => state.user)
  const [isDateCreation, setIsDateCreation] = useState<boolean>(false)
  const { message } = AntApp.useApp()
  const {
    metaData,
    loading,
    setLoading,
    openModal,
    setOpenModal,
    searchText,
    setSearchText,
    handleAddNewProduct,
    getProductList,
    handleUpdateProductItem,
    handleDeleteProductItem,
    handleSorted
  } = useProduct()
  const {
    form,
    isEditing,
    editingKey,
    dataSource,
    setDataSource,
    handleStartDeleting,
    handleStartEditing,
    handleStartSaveEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<ProductTableDataType>([])

  console.log('Load product table...')

  useEffect(() => {
    getProductList(defaultRequestBody, (meta) => {
      if (meta?.success) {
        setDataSource(
          meta.data.map((item: Product) => {
            return {
              ...item,
              key: item.id
            } as ProductTableDataType
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
      render: (_, record: ProductTableDataType) => {
        return isEditing(record.key!) ? (
          <Flex className='flex flex-col gap-3 lg:flex-row'>
            <Button
              type='primary'
              onClick={() => {
                handleStartSaveEditing(record.key!, (productToSave) => {
                  console.log(productToSave)
                  handleUpdateProductItem(
                    Number(record.key),
                    {
                      productCode: productToSave.productCode,
                      quantityPO: productToSave.quantityPO,
                      dateOutputFCR: productToSave.dateOutputFCR,
                      dateInputNPL: productToSave.dateInputNPL
                    },
                    (meta) => {
                      if (meta.success) {
                        message.success('Updated!')
                      }
                    }
                  )
                })
              }}
            >
              Save
            </Button>
            <Popconfirm
              title={`Sure to cancel?`}
              onConfirm={() => handleConfirmCancelEditing()}
            >
              <Button type='dashed'>Cancel</Button>
            </Popconfirm>
          </Flex>
        ) : (
          <Flex gap={10}>
            <Button
              type='primary'
              disabled={editingKey !== ''}
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
                handleStartEditing(record)
              }}
            >
              Edit
            </Button>
            {user.isAdmin && (
              <Popconfirm
                title={`Sure to delete?`}
                onCancel={() => handleConfirmCancelDeleting()}
                onConfirm={() => {
                  setLoading(true)
                  handleStartDeleting(record.key!)
                  handleDeleteProductItem(Number(record.key!), (meta) => {
                    if (meta.success) {
                      setLoading(false)
                      message.success('Deleted!')
                    }
                  })
                }}
              >
                <Button
                  type='dashed'
                  onClick={() => handleStartDeleting(record.key!)}
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
        <BaseLayout
          onSearch={(value) => {
            if (value.length > 0) {
              const body: RequestBodyType = {
                ...defaultRequestBody,
                search: {
                  field: 'productCode',
                  term: value
                }
              }
              getProductList(body, (meta) => {
                if (meta?.success) {
                  setDataSource(
                    meta.data.map((item: Product) => {
                      return {
                        ...item,
                        key: item.id
                      } as ProductTableDataType
                    })
                  )
                }
              })
            }
          }}
          onDateCreationChange={(val) => setIsDateCreation(val)}
          searchValue={searchText}
          onSearchChange={(e) => setSearchText(e.target.value)}
          onSortChange={(val) => {
            handleSorted(val ? 'asc' : 'desc', (meta) => {
              if (meta.success) {
                setDataSource(
                  meta.data.map((item: Product) => {
                    return {
                      ...item,
                      key: item.id
                    } as ProductTableDataType
                  })
                )
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            setSearchText('')
            getProductList(defaultRequestBody, (meta) => {
              if (meta?.success) {
                setDataSource(
                  meta.data.map((item: Product) => {
                    return {
                      ...item,
                      key: item.id
                    } as ProductTableDataType
                  })
                )
                message.success('Reloaded!')
              }
            })
          }}
          onAddNewClick={() => setOpenModal(true)}
        >
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
                ? isDateCreation
                  ? [...commonCols, ...dateCreationColumns, ...actionsCols]
                  : adminColumns
                : staffColumns
            )}
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
                getProductList(body, (meta) => {
                  if (meta?.success) {
                    setDataSource(
                      meta.data.map((item: Product) => {
                        return {
                          ...item,
                          key: item.id
                        } as ProductTableDataType
                      })
                    )
                  }
                })
                handleConfirmCancelEditing()
                handleConfirmCancelDeleting()
              },
              current: metaData?.page,
              pageSize: 5,
              total: metaData?.total
            }}
          />
        </BaseLayout>
      </Form>
      {openModal && (
        <ModalAddNewProduct
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(_form) => {
            handleAddNewProduct(_form, (meta) => {
              if (meta.success) {
                const data = meta?.data as Product
                const newDataSource = [...dataSource]
                console.log({ newDataSource, data })
                // newDataSource.unshift(data)
                // setDataSource(newDataSource)
                // message.success('Success!', 1)
              }
            })
          }}
        />
      )}
    </>
  )
}

export default ProductTable
