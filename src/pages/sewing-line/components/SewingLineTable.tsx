import { App as AntApp, Form, Table, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RequestBodyType, ResponseDataType, defaultRequestBody } from '~/api/client'
import SewingLineAPI from '~/api/services/SewingLineAPI'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import ItemAction from '~/components/ui/Table/ItemAction'
import useAPICaller from '~/hooks/useAPICaller'
import { RootState } from '~/store/store'
import { SewingLine } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import { SewingLineTableDataType } from '../type'
import EditableCell, { EditableTableProps } from './EditableCell'
import ModalAddNewSewingLine from './ModalAddNewSewingLine'

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface Props extends React.HTMLAttributes<HTMLElement> {}

const SewingLineTable: React.FC<Props> = ({ ...props }) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { loading, metaData, createNewItem, getListItems, updateItemByPk, sortedListItems } =
    useAPICaller<SewingLine>(SewingLineAPI)
  const {
    form,
    editingKey,
    setDeleteKey,
    dataSource,
    setDataSource,
    isEditing,
    handleStartAddNew,
    handleStartEditing,
    handleStartDeleting,
    handleStartSaveEditing,
    handleConfirmCancelEditing,
    handleConfirmCancelDeleting
  } = useTable<SewingLineTableDataType>([])
  const user = useSelector((state: RootState) => state.user)
  const { message } = AntApp.useApp()

  useEffect(() => {
    getListItems(defaultRequestBody, (meta) => {
      if (meta?.success) {
        selfHandleProgressDataSource(meta)
      }
    })
  }, [])

  const selfHandleProgressDataSource = (meta: ResponseDataType) => {
    const colors = meta.data as SewingLine[]
    setDataSource(
      colors.map((item: SewingLine) => {
        return {
          ...item,
          key: item.id
        } as SewingLineTableDataType
      })
    )
  }

  const selfHandleSaveClick = async (record: TableItemWithKey<SewingLineTableDataType>) => {
    const row = await form.validateFields()
    handleStartSaveEditing(
      record.key!,
      {
        ...row
      },
      (status) => {
        if (status) {
          updateItemByPk(
            record.id ?? Number(record.key!),
            {
              ...row
            },
            (success) => {
              if (success) {
                message.success('Updated!')
              } else {
                message.error('Failed!')
              }
            }
          )
        }
      }
    )
  }

  const selfHandleConfirmDelete = (item: TableItemWithKey<SewingLineTableDataType>) => {
    handleStartDeleting(item.key!, (productToDelete) => {
      updateItemByPk(Number(productToDelete.key), { status: 'deleted' }, (meta) => {
        if (meta?.success) {
          message.success('Deleted!')
        } else {
          message.error('Failed!')
        }
      })
    })
  }

  const actionsCols: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Operation',
      width: '15%',
      dataIndex: 'operation',
      render: (_, record: SewingLineTableDataType) => {
        return (
          <>
            <ItemAction
              isEditing={isEditing(record.key!)}
              editingKey={editingKey}
              onSaveClick={() => selfHandleSaveClick(record)}
              onClickStartEditing={() => handleStartEditing(record.key!)}
              onConfirmCancelEditing={() => handleConfirmCancelEditing()}
              onConfirmCancelDeleting={() => handleConfirmCancelDeleting()}
              onConfirmDelete={() => selfHandleConfirmDelete(record)}
              onStartDeleting={() => setDeleteKey(record.key!)}
            />
          </>
        )
      }
    }
  ]

  const commonCols: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'Chuyền',
      dataIndex: 'sewingLineName',
      width: '15%',
      editable: user.isAdmin,
      render: (_, record: SewingLineTableDataType) => {
        return (
          <Typography.Text copyable className='text-md flex-shrink-0 font-bold'>
            {record.sewingLineName}
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
      render: (_, record: SewingLineTableDataType) => {
        return (
          <>
            <span>{DayJS(record ? record.createdAt : '').format(DatePattern.display)}</span>
          </>
        )
      }
    },
    {
      title: 'Updated date',
      dataIndex: 'updatedAt',
      width: '10%',
      render: (_, record: SewingLineTableDataType) => {
        return (
          <>
            <span>{DayJS(record ? record.updatedAt : '').format(DatePattern.display)}</span>
          </>
        )
      }
    }
  ]

  const adminColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [...commonCols, ...dateCreationColumns, ...actionsCols]

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
        onCell: (record: SewingLineTableDataType) => ({
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
      case 'sewingLineName':
        return 'text'
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
                  field: 'sewingLineName',
                  term: value
                }
              }
              getListItems(body, (meta) => {
                if (meta?.success) {
                  selfHandleProgressDataSource(meta)
                }
              })
            }
          }}
          onSortChange={(val) => {
            sortedListItems(val ? 'asc' : 'desc', (meta) => {
              if (meta?.success) {
                selfHandleProgressDataSource(meta)
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            getListItems(defaultRequestBody, (meta) => {
              if (meta?.success) {
                selfHandleProgressDataSource(meta)
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
            columns={mergedColumns(user.isAdmin ? adminColumns : staffColumns)}
            rowClassName='editable-row'
            pagination={{
              onChange: (_page) => {
                const body: RequestBodyType = {
                  ...defaultRequestBody,
                  paginator: {
                    page: _page,
                    pageSize: 5
                  },
                  search: {
                    field: 'sewingLineName',
                    term: form.getFieldValue('search') ?? ''
                  }
                }
                getListItems(body, (meta) => {
                  if (meta?.success) {
                    selfHandleProgressDataSource(meta)
                  }
                })
              },
              current: metaData?.page,
              pageSize: 5,
              total: metaData?.total
            }}
          />
        </BaseLayout>
      </Form>
      {openModal && (
        <ModalAddNewSewingLine
          openModal={openModal}
          setOpenModal={setOpenModal}
          onAddNew={(addNewForm) => {
            createNewItem(addNewForm, (meta) => {
              if (meta?.success) {
                const newItem = meta.data as SewingLine
                handleStartAddNew({
                  key: newItem.id,
                  ...addNewForm
                })
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

export default SewingLineTable
