import { App as AntApp, Form, Table, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RequestBodyType, defaultRequestBody } from '~/api/client'
import ImportationAPI from '~/api/services/ImportationAPI'
import ProductAPI from '~/api/services/ProductAPI'
import useTable, { TableCellProps, TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import EditableCell, { EditableTableProps, InputType } from '~/components/ui/Table/EditableCell'
import ItemAction from '~/components/ui/Table/ItemAction'
import useAPICaller from '~/hooks/useAPICaller'
import { RootState } from '~/store/store'
import { Importation, Product } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { ImportationTableDataType } from '../type'
import ModalAddNewImportation from './ModalAddNewImportation'

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface Props extends React.HTMLAttributes<HTMLElement> {}

const ImportationTable: React.FC<Props> = ({ ...props }) => {
  const productService = useAPICaller<Product>(ProductAPI)
  const importationService = useAPICaller<Importation>(ImportationAPI)
  const {
    form,
    loading,
    setLoading,
    editingKey,
    setDeleteKey,
    dataSource,
    isEditing,
    setDataSource,
    dateCreation,
    setDateCreation,
    handleConvertDataSource,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleStartSaveEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<ImportationTableDataType>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const user = useSelector((state: RootState) => state.user)
  const { message } = AntApp.useApp()

  console.log('ImportationTableDataType...')

  useEffect(() => {
    productService.getListItems(defaultRequestBody, setLoading, (meta) => {
      if (meta?.success) {
        const products = meta.data as Product[]
        selfHandleConvertDataSource(products)
      }
    })
  }, [])

  useEffect(() => {
    if (dataSource.length > 0) {
      console.log(dataSource)
    }
  }, [dataSource])

  const selfHandleConvertDataSource = (products: Product[]) => {
    importationService.getListItems(defaultRequestBody, setLoading, (meta2) => {
      if (meta2?.success) {
        const importations = meta2.data as Importation[]
        setDataSource(
          products.map((item) => {
            return {
              ...item,
              productID: item.id,
              key: Number(item.id),
              importation: importations.find((i) => i.productID === item.id)
            }
          })
        )
      } else {
        setDataSource(
          products.map((item) => {
            return { ...item, productID: item.id, key: Number(item.id) }
          })
        )
      }
    })
  }

  const selfHandleSaveClick = async (item: TableItemWithKey<ImportationTableDataType>) => {
    const row = await form.validateFields()
    console.log({
      row: row,
      item: item
    })
    await ImportationAPI.createOrUpdateItemByProductID(Number(item.key!), {
      productID: item.productID,
      quantity: row.quantity,
      dateImported: DayJS(row.dateImported).format(DatePattern.iso8601)
    } as Importation).then((meta) => {
      if (meta?.success) {
        const importation = meta.data as Importation
        handleStartSaveEditing(item.key!, {
          ...item,
          importation: importation
        })
        message.success('Success!')
      } else {
        message.error('Failed!')
      }
    })
  }

  const actionsCols: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Operation',
      width: '15%',
      dataIndex: 'operation',
      render: (_, item: TableItemWithKey<ImportationTableDataType>) => {
        return (
          <>
            <ItemAction
              isEditing={isEditing(item.key!)}
              editingKey={editingKey}
              onSaveClick={() => selfHandleSaveClick(item)}
              onClickStartEditing={() => handleStartEditing(item.key!)}
              onConfirmCancelEditing={() => handleConfirmCancelEditing()}
              onConfirmCancelDeleting={() => handleConfirmCancelDeleting()}
              onConfirmDelete={() => {
                importationService.updateItemBy(
                  { field: 'productID', key: item.key! },
                  { status: 'deleted' },
                  setLoading,
                  (meta) => {
                    if (meta) {
                      if (meta.success) {
                        handleStartSaveEditing(item.key!, {
                          ...item,
                          importation: undefined
                        })
                        message.success('Deleted!')
                      }
                    } else {
                      message.error('Failed!')
                    }
                  }
                )
              }}
              onStartDeleting={() => setDeleteKey(item.key!)}
            />
          </>
        )
      }
    }
  ]

  const commonCols: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Product code',
      dataIndex: 'productCode',
      width: '15%',
      render: (_, record: ImportationTableDataType) => {
        return (
          <Typography.Text copyable className='text-md flex-shrink-0 font-bold'>
            {record.productCode}
          </Typography.Text>
        )
      }
    },
    {
      title: 'Kiện',
      dataIndex: 'quantity',
      width: '15%',
      editable: true,
      render: (_, record: ImportationTableDataType) => {
        return <span className=''>{record.importation?.quantity ?? 0}</span>
      }
    },
    {
      title: 'Date Imported',
      dataIndex: 'dateImported',
      width: '15%',
      editable: true,
      render: (_, record: ImportationTableDataType) => {
        const validData = record.importation?.dateImported ? record.importation.dateImported : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    }
  ]

  const dateCreationColumns: (ColumnTypes[number] & TableCellProps)[] = [
    {
      title: 'Created date',
      dataIndex: 'createdAt',
      width: '10%',
      render: (_, record: ImportationTableDataType) => {
        const validData = record.importation?.createdAt ? record.importation.createdAt : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '10%',
      render: (_, record: ImportationTableDataType) => {
        const validData = record.importation?.updatedAt ? record.importation?.updatedAt : ''
        return <span>{DayJS(validData).format(DatePattern.display)}</span>
      }
    }
  ]

  const adminColumns: (ColumnTypes[number] & TableCellProps)[] = dateCreation
    ? [...commonCols, ...dateCreationColumns, ...actionsCols]
    : [...commonCols, ...actionsCols]

  const staffColumns: (ColumnTypes[number] & TableCellProps)[] = [...commonCols]

  const mergedColumns = (cols: (ColumnTypes[number] & TableCellProps)[]): ColumnTypes => {
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
          initialValue: smartInitialValue(col.dataIndex, record),
          editing: isEditing(record.key!)
        })
      }
    }) as ColumnTypes
  }

  const onCellColumnType = (dataIndex: string): InputType => {
    switch (dataIndex) {
      case 'quantity':
        return 'number'
      case 'dateImported':
        return 'datepicker'
      default:
        return 'text'
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const smartInitialValue = (dataIndex: string, record: ImportationTableDataType): any => {
    switch (dataIndex) {
      case 'quantity':
        return record.importation?.quantity
      case 'dateImported':
        return DayJS(record.importation?.dateImported)
      default:
        return record.id
    }
  }

  return (
    <>
      <Form {...props} form={form} component={false}>
        <BaseLayout
          onSearch={(value) => {
            if (value.length > 0) {
              productService.getListItems(
                {
                  ...defaultRequestBody,
                  search: {
                    field: 'productCode',
                    term: value
                  }
                },
                setLoading,
                (meta) => {
                  if (meta?.success) {
                    const products = meta.data as Product[]
                    selfHandleConvertDataSource(products)
                  }
                }
              )
            }
          }}
          onSortChange={(val) => {
            productService.sortedListItems(val ? 'asc' : 'desc', setLoading, (meta) => {
              if (meta?.success) {
                const products = meta.data as Product[]
                selfHandleConvertDataSource(products)
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            productService.getListItems(defaultRequestBody, setLoading, (meta) => {
              if (meta?.success) {
                const products = meta.data as Product[]
                selfHandleConvertDataSource(products)
                message.success('Reloaded!')
              }
            })
          }}
          dateCreation={dateCreation}
          onDateCreationChange={setDateCreation}
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
            columns={mergedColumns(user.isAdmin ? adminColumns : staffColumns)}
            rowClassName='editable-row'
            pagination={{
              onChange: (_page) => {
                productService.setPage(_page)
                const body: RequestBodyType = {
                  ...defaultRequestBody,
                  paginator: {
                    page: _page,
                    pageSize: 5
                  },
                  search: {
                    field: 'dateImported',
                    term: form.getFieldValue('search') ?? ''
                  }
                }
                productService.getListItems(body, setLoading, (meta) => {
                  if (meta?.success) {
                    const products = meta.data as Product[]
                    selfHandleConvertDataSource(products)
                  }
                })
              },
              current: productService.metaData?.page,
              pageSize: 5,
              total: productService.metaData?.total
            }}
          />
        </BaseLayout>
      </Form>
      {openModal && (
        <ModalAddNewImportation
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(addNewForm) => {
            importationService.createNewItem(addNewForm, setLoading, (meta) => {
              if (meta?.success) {
                const itemNew = meta.data as Importation
                handleStartAddNew({ key: Number(itemNew.id), ...itemNew })
                message.success('Created!')
                setOpenModal(false)
              } else {
                message.error('Failed!')
              }
            })
          }}
        />
      )}
    </>
  )
}

export default ImportationTable
