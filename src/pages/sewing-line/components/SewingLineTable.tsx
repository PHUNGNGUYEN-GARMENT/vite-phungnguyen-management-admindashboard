import { App as AntApp, Form, Table, Typography } from 'antd'
import type { Color as AntColor } from 'antd/es/color-picker'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  RequestBodyType,
  ResponseDataType,
  defaultRequestBody
} from '~/api/client'
import useTable, { TableItemWithKey } from '~/components/hooks/useTable'
import BaseLayout from '~/components/layout/BaseLayout'
import ItemAction from '~/components/layout/Item/ItemAction'
import { RootState } from '~/store/store'
import { SewingLine } from '~/typing'
import DayJS, { DatePattern } from '~/utils/date-formatter'
import useSewingLine from '../hooks/useSewingLine'
import { SewingLineTableDataType } from '../type'
import EditableCell, { EditableTableProps } from './EditableCell'
import ModalAddNewSewingLine from './ModalAddNewSewingLine'

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface Props extends React.HTMLAttributes<HTMLElement> {}

const SewingLineTable: React.FC<Props> = ({ ...props }) => {
  const {
    metaData,
    loading,
    setPage,
    dateCreation,
    setDateCreation,
    setLoading,
    openModal,
    setOpenModal,
    handleAddNewItem,
    getDataList,
    handleUpdateItem,
    handleDeleteItem,
    handleSorted
  } = useSewingLine()
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
    getDataList(defaultRequestBody, (meta) => {
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

  const selfHandleSaveClick = async (
    record: TableItemWithKey<SewingLineTableDataType>
  ) => {
    const row = await form.validateFields()
    const hexColor = row.hexColor
      ? typeof row.hexColor === 'string'
        ? row.hexColor
        : (row.hexColor as AntColor).toHexString()
      : ''
    handleStartSaveEditing(
      record.key!,
      {
        ...row,
        hexColor: hexColor
      },
      (status) => {
        if (status) {
          handleUpdateItem(
            record.id ?? Number(record.key!),
            {
              ...row,
              hexColor: hexColor
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

  const selfHandleConfirmDelete = (
    item: TableItemWithKey<SewingLineTableDataType>
  ) => {
    setLoading(true)
    handleStartDeleting(item.key!, (productToDelete) => {
      handleDeleteItem(Number(productToDelete), (success) => {
        if (success) {
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
      title: 'Name',
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
            <span>
              {DayJS(record ? record.createdAt : '').format(
                DatePattern.display
              )}
            </span>
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
            <span>
              {DayJS(record ? record.updatedAt : '').format(
                DatePattern.display
              )}
            </span>
          </>
        )
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
                  field: 'nameColor',
                  term: value
                }
              }
              getDataList(body, (meta) => {
                if (meta?.success) {
                  selfHandleProgressDataSource(meta)
                }
              })
            }
          }}
          onSortChange={(val) => {
            handleSorted(val ? 'asc' : 'desc', (meta) => {
              if (meta?.success) {
                selfHandleProgressDataSource(meta)
              }
            })
          }}
          onResetClick={() => {
            form.setFieldValue('search', '')
            getDataList(defaultRequestBody, (meta) => {
              if (meta?.success) {
                selfHandleProgressDataSource(meta)
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
                setPage(_page)
                const body: RequestBodyType = {
                  ...defaultRequestBody,
                  paginator: {
                    page: _page,
                    pageSize: 5
                  },
                  search: {
                    field: 'nameColor',
                    term: form.getFieldValue('search') ?? ''
                  }
                }
                getDataList(body, (meta) => {
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
            handleAddNewItem(addNewForm, (meta) => {
              if (meta?.success) {
                const newItem = meta.data as SewingLine
                handleStartAddNew({
                  key: newItem.id,
                  ...addNewForm
                })
                message.success('Created!')
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
